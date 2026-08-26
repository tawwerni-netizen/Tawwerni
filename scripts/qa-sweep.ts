/**
 * QA sweep: the states nobody clicks through by hand.
 *
 * Happy paths get exercised constantly during development. What breaks in
 * production is the empty account, the malformed request, the duplicate
 * submit, the URL somebody typed wrong.
 */
import "./load-env";
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

(async () => {
  const stamp = Date.now();
  const email = `qa${stamp}@test.local`;
  const PW = "qapassword1234";

  console.log(`\nالسيرفر: ${BASE}\n`);

  /* ---------- malformed input ---------- */
  console.log("مدخلات مكسورة");

  for (const [path, bodyText] of [
    ["/api/auth/login", "not json at all"],
    ["/api/auth/signup", "{{{"],
    ["/api/orders", "[]"],
    ["/api/quiz/lead", "null"],
  ] as const) {
    const res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TEST_HEADERS },
      body: bodyText,
    });
    // Anything but a 5xx: a malformed body is the caller's fault, not a crash.
    check(`${path} مبيقعش على body مكسور`, res.status < 500, `status ${res.status}`);
  }

  for (const path of ["/api/auth/login", "/api/orders", "/api/quiz/lead"]) {
    const res = await fetch(`${BASE}${path}`, { method: "POST" });
    check(`${path} مبيقعش على body فاضي`, res.status < 500, `status ${res.status}`);
  }

  /* ---------- bad URLs ---------- */
  console.log("\nروابط غلط");

  const user = await prisma.user.create({
    data: { email, passwordHash: await hashPassword(PW), name: "QA", dailyPaceMinutes: 15 },
  });
  const jar = new Jar();
  await jar.fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password: PW }),
  });

  for (const [path, expect] of [
    ["/app/learn/does-not-exist", 404],
    ["/app/learn/does-not-exist/1", 404],
    ["/app/learn/does-not-exist/certificate", 404],
    ["/this-page-does-not-exist", 404],
  ] as const) {
    const res = await jar.fetch(path);
    check(`${path} → ${expect}`, res.status === expect, `status ${res.status}`);
  }

  const course = await prisma.course.findFirst({ where: { isComingSoon: false } });

  // Day numbers outside the course.
  for (const day of ["0", "999", "abc", "-1"]) {
    const res = await jar.fetch(`/app/learn/${course!.slug}/${day}`);
    check(
      `يوم "${day}" مبيقعش`,
      res.status === 404 || res.status === 307 || res.status === 302,
      `status ${res.status}`
    );
  }

  /* ---------- empty account ---------- */
  console.log("\nحساب فاضي");

  for (const path of ["/app", "/app/learn", "/app/progress", "/app/referrals", "/app/profile"]) {
    const res = await jar.fetch(path);
    check(`${path} بيفتح لحساب من غير أي تقدّم`, res.status === 200, `status ${res.status}`);
  }

  /* ---------- double submit ---------- */
  console.log("\nإرسال مزدوج");

  const orderBody = JSON.stringify({
    email,
    name: "QA",
    phone: "01000000009",
    courseSlug: course!.slug,
    method: "vodafone_cash",
  });

  const [a, b] = await Promise.all([
    fetch(`${BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TEST_HEADERS },
      body: orderBody,
    }),
    fetch(`${BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TEST_HEADERS },
      body: orderBody,
    }),
  ]);
  check("الطلب المزدوج مبيرجعش خطأ", a.status === 200 && b.status === 200, `${a.status}/${b.status}`);

  const orderCount = await prisma.order.count({ where: { userId: user.id } });
  check("مبيتعملش طلبين لنفس المسار", orderCount === 1, `${orderCount} طلب`);

  /* ---------- oversized input ---------- */
  console.log("\nمدخلات ضخمة");

  const huge = "ا".repeat(50_000);
  let res = await jar.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ name: huge }),
  });
  check("اسم ضخم مبيقعش", res.status < 500, `status ${res.status}`);

  const saved = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true } });
  check("الاسم اتقصّ", (saved?.name?.length ?? 0) <= 60, `${saved?.name?.length} حرف`);

  res = await jar.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ avatarUrl: "data:image/png;base64," + "A".repeat(600_000) }),
  });
  check("صورة ضخمة بترفض", res.status === 413, `status ${res.status}`);

  /* ---------- public pages render without a session ---------- */
  console.log("\nالصفحات العامة من غير جلسة");

  for (const path of ["/", "/quiz", "/quiz/checkout", "/login", "/forgot-password", "/reset-password"]) {
    const r2 = await fetch(`${BASE}${path}`);
    check(`${path} → ${r2.status}`, r2.status === 200, `status ${r2.status}`);
  }

  for (const path of ["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/opengraph-image.jpg"]) {
    const r2 = await fetch(`${BASE}${path}`);
    check(`${path} → ${r2.status}`, r2.status === 200, `status ${r2.status}`);
  }

  /* ---------- cleanup ---------- */
  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });

  console.log(`\n${"─".repeat(46)}`);
  console.log(`نجح: ${pass}   فشل: ${fail}`);
  if (failures.length) {
    console.log("\nالمشاكل:");
    failures.forEach((f) => console.log(`  • ${f}`));
  }
  await prisma.$disconnect();
  process.exit(fail ? 1 : 0);
})();
