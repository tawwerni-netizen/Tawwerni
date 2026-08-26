/**
 * Checks the panel's create/delete user controls.
 *
 * These are the two most destructive things in the app, so the tests are as
 * much about what they REFUSE as what they do.
 */
import { TEST_HEADERS } from "./test-env";
import { prisma } from "../src/lib/prisma";

import { hashPassword } from "../src/lib/password";

const BASE = process.argv[2] ?? "http://localhost:3000";

let pass = 0;
let fail = 0;
const failures: string[] = [];

function check(name: string, ok: boolean, detail = "") {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

class Jar {
  private jar = new Map<string, string>();
  private header() {
    return [...this.jar].map(([k, v]) => `${k}=${v}`).join("; ");
  }
  async fetch(path: string, init: RequestInit = {}) {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      redirect: "manual",
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...(this.header() ? { Cookie: this.header() } : {}),
        ...TEST_HEADERS,
        ...(init.headers ?? {}),
      },
    });
    for (const raw of res.headers.getSetCookie?.() ?? []) {
      const [pair] = raw.split(";");
      const i = pair.indexOf("=");
      if (i > 0) this.jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    }
    return res;
  }
}

async function body(res: Response) {
  const t = await res.text();
  try {
    return JSON.parse(t);
  } catch {
    return { _raw: t.slice(0, 160) };
  }
}

(async () => {
  const stamp = Date.now();
  const adminEmail = `au${stamp}@test.local`;
  const newEmail = `made${stamp}@test.local`;
  const PW = "adminpass1234";

  console.log(`\nالسيرفر: ${BASE}\n`);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "أدمن",
      passwordHash: await hashPassword(PW),
      isAdmin: true,
      dailyPaceMinutes: 15,
    },
  });

  const jar = new Jar();
  await jar.fetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: PW }),
  });

  /* ---------------- creating ---------------- */
  console.log("إضافة مستخدم");

  let r = await new Jar().fetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify({ email: newEmail, password: "whatever1234" }),
  });
  check("الزائر مبيقدرش يضيف", r.status === 401, `status ${r.status}`);

  r = await jar.fetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify({ email: "not-an-email", password: "whatever1234" }),
  });
  check("إيميل غلط بيترفض", r.status === 400, `status ${r.status}`);

  r = await jar.fetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify({ email: newEmail, password: "short" }),
  });
  check("باسورد قصير بيترفض", r.status === 400, `status ${r.status}`);

  r = await jar.fetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify({
      email: newEmail,
      name: "عميل واتساب",
      phone: "01234567890",
      password: "goodpass1234",
      grantAccess: true,
    }),
  });
  const made = await body(r);
  check("الأدمن بيضيف حساب", r.status === 200, `status ${r.status} ${JSON.stringify(made).slice(0, 120)}`);
  check("والاشتراك اتفعّل معاه", made.activated === true, String(made.activated));

  const created = await prisma.user.findUnique({
    where: { email: newEmail },
    select: { id: true, name: true, mustChangePassword: true, orders: { select: { status: true } } },
  });
  check("الحساب موجود في الداتابيز", !!created);
  check("متعلّم عليه إنه يغيّر الباسورد", created?.mustChangePassword === true);
  check("الطلب approved", created?.orders[0]?.status === "approved", String(created?.orders[0]?.status));

  // The new account can actually sign in with the password the owner set.
  r = await new Jar().fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: newEmail, password: "goodpass1234" }),
  });
  check("العميل بيقدر يدخل بالباسورد ده", r.status === 200, `status ${r.status}`);

  r = await jar.fetch("/api/admin/users", {
    method: "POST",
    body: JSON.stringify({ email: newEmail, password: "goodpass1234" }),
  });
  check("إيميل مكرر بيترفض", r.status === 409, `status ${r.status}`);

  /* ---------------- deleting ---------------- */
  console.log("\nحذف مستخدم");

  r = await new Jar().fetch(`/api/admin/users/${created!.id}`, {
    method: "DELETE",
    body: JSON.stringify({ confirmEmail: newEmail }),
  });
  check("الزائر مبيقدرش يمسح", r.status === 401, `status ${r.status}`);

  r = await jar.fetch(`/api/admin/users/${created!.id}`, {
    method: "DELETE",
    body: JSON.stringify({ confirmEmail: "wrong@example.com" }),
  });
  check("تأكيد بإيميل غلط بيترفض", r.status === 400, `status ${r.status}`);

  r = await jar.fetch(`/api/admin/users/${created!.id}`, {
    method: "DELETE",
    body: JSON.stringify({}),
  });
  check("من غير تأكيد بيترفض", r.status === 400, `status ${r.status}`);

  r = await jar.fetch(`/api/admin/users/${admin.id}`, {
    method: "DELETE",
    body: JSON.stringify({ confirmEmail: adminEmail }),
  });
  check("الأدمن مبيقدرش يمسح نفسه", r.status === 403, `status ${r.status}`);

  r = await jar.fetch(`/api/admin/users/${created!.id}`, {
    method: "DELETE",
    body: JSON.stringify({ confirmEmail: newEmail }),
  });
  check("المسح بالتأكيد الصح بينجح", r.status === 200, `status ${r.status}`);

  const gone = await prisma.user.findUnique({ where: { email: newEmail } });
  check("الحساب اتمسح فعلًا", gone === null);

  const orphans = await prisma.order.count({ where: { userId: created!.id } });
  check("طلباته اتمسحت معاه", orphans === 0, String(orphans));

  /* ---------------- cleanup ---------------- */
  await prisma.order.deleteMany({ where: { userId: admin.id } });
  await prisma.user.deleteMany({ where: { email: { in: [adminEmail, newEmail] } } });

  console.log(`\n${"─".repeat(46)}`);
  console.log(`نجح: ${pass}   فشل: ${fail}`);
  if (failures.length) {
    console.log("\nالمشاكل:");
    failures.forEach((f) => console.log(`  • ${f}`));
  }
  await prisma.$disconnect();
  process.exit(fail ? 1 : 0);
})();
