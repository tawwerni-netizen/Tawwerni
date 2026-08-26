/**
 * Security and feature checks against a running dev server.
 *
 * Focused on the things that would cost money or hand over an account:
 * the removed OTP back door, password reset, admin-only surfaces, the
 * completion gate behind the certificate, and unauthenticated writes.
 *
 * Usage: npx tsx scripts/e2e-security.ts [baseUrl]
 */
import "./load-env";
import { TEST_HEADERS } from "./test-env";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";
import { createResetToken } from "../src/lib/password-reset";

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
  header() {
    return [...this.jar].map(([k, v]) => `${k}=${v}`).join("; ");
  }
  absorb(res: Response) {
    for (const raw of res.headers.getSetCookie?.() ?? []) {
      const [pair] = raw.split(";");
      const i = pair.indexOf("=");
      if (i > 0) this.jar.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
    }
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
    this.absorb(res);
    return res;
  }
  has(name: string) {
    return this.jar.has(name);
  }
}

async function body(res: Response) {
  const t = await res.text();
  try {
    return JSON.parse(t);
  } catch {
    return { _raw: t.slice(0, 200) };
  }
}

(async () => {
  const stamp = Date.now();
  const victimEmail = `victim${stamp}@test.local`;
  const adminEmail = `sadmin${stamp}@test.local`;
  const PW = "originalpass123";

  console.log(`\nالسيرفر: ${BASE}\n`);

  /* ================= the removed back door ================= */
  console.log("الباب الخلفي القديم (OTP)");
  for (const p of ["/api/auth/request-code", "/api/auth/verify-code"]) {
    const r = await fetch(`${BASE}${p}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TEST_HEADERS },
      body: JSON.stringify({ email: "anyone@example.com", code: "000000" }),
    });
    check(`${p} اتشال`, r.status === 404 || r.status === 405, `status ${r.status}`);
  }

  /* ================= setup ================= */
  const victim = await prisma.user.create({
    data: {
      email: victimEmail,
      name: "الضحية",
      phone: "01099999999",
      passwordHash: await hashPassword(PW),
      dailyPaceMinutes: 15,
    },
  });
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "أدمن",
      passwordHash: await hashPassword(PW),
      isAdmin: true,
      dailyPaceMinutes: 15,
    },
  });

  /* ================= password reset ================= */
  console.log("\nنسيت كلمة السر");
  let r = await fetch(`${BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TEST_HEADERS },
    body: JSON.stringify({ email: victimEmail }),
  });
  check("طلب اللينك", r.status === 200, `status ${r.status}`);
  let d = await body(r);
  check("الرد مفيهوش توكن", !JSON.stringify(d).includes("token"), JSON.stringify(d).slice(0, 120));

  r = await fetch(`${BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TEST_HEADERS },
    body: JSON.stringify({ email: `ghost${stamp}@test.local` }),
  });
  const ghost = await body(r);
  check(
    "إيميل مش موجود بيدّي نفس الرد",
    r.status === 200 && ghost.message === d.message,
    `status ${r.status}`
  );

  // Mint a real token the way the email would carry it.
  const token = await createResetToken(victimEmail);
  check("التوكن اتولّد", !!token);

  r = await fetch(`${BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TEST_HEADERS },
    body: JSON.stringify({ token: "not-a-real-token-aaaaaaaaaaaaaaaa", password: "brandnew12345" }),
  });
  check("توكن مزيّف بيترفض", r.status === 400, `status ${r.status}`);

  r = await fetch(`${BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TEST_HEADERS },
    body: JSON.stringify({ token, password: "short" }),
  });
  check("باسورد قصير بيترفض", r.status === 400, `status ${r.status}`);

  const resetJar = new Jar();
  r = await resetJar.fetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, password: "brandnew12345" }),
  });
  check("تغيير الباسورد باللينك", r.status === 200, `status ${r.status}`);
  check("بيدخّل تلقائي بعد التغيير", resetJar.has("tawwerni_session"));

  r = await fetch(`${BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TEST_HEADERS },
    body: JSON.stringify({ token, password: "another12345" }),
  });
  check("نفس اللينك مبيشتغلش مرتين", r.status === 400, `status ${r.status}`);

  r = await new Jar().fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: victimEmail, password: PW }),
  });
  check("الباسورد القديم بطل", r.status === 401, `status ${r.status}`);

  const victimJar = new Jar();
  r = await victimJar.fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: victimEmail, password: "brandnew12345" }),
  });
  check("الباسورد الجديد شغّال", r.status === 200, `status ${r.status}`);

  /* ================= change password ================= */
  console.log("\nتغيير الباسورد من جوّه");
  r = await victimJar.fetch("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword: "wrong", newPassword: "yetanother123" }),
  });
  check("الباسورد الحالي الغلط بيترفض", r.status === 401, `status ${r.status}`);

  r = await new Jar().fetch("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword: "brandnew12345", newPassword: "yetanother123" }),
  });
  check("من غير جلسة بيترفض", r.status === 401, `status ${r.status}`);

  r = await victimJar.fetch("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword: "brandnew12345", newPassword: "yetanother123" }),
  });
  check("التغيير الصحيح بينجح", r.status === 200, `status ${r.status}`);

  // Changing the password bumps `sessionVersion`, so the jar is re-issued a
  // fresh cookie by that same response. Confirm it survived rather than
  // silently running the rest of the suite signed out.
  r = await victimJar.fetch("/app");
  check("الجهاز اللي غيّر الباسورد فضل داخل", r.status === 200, `status ${r.status}`);

  /* ================= profile leaks ================= */
  console.log("\nتسريب بيانات");
  r = await victimJar.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ name: "اسم جديد" }),
  });
  const profile = JSON.stringify(await body(r));
  check("الرد مفيهوش passwordHash", !profile.includes("passwordHash"), profile.slice(0, 120));
  check("الرد مفيهوش scrypt", !profile.includes("scrypt"));

  r = await victimJar.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ dailyPaceMinutes: 99999 }),
  });
  check("وتيرة غير منطقية بترفض", r.status === 400, `status ${r.status}`);

  r = await victimJar.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ avatarUrl: "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=" }),
  });
  check("صورة SVG بترفض (ممكن تحمل سكربت)", r.status === 400, `status ${r.status}`);

  r = await victimJar.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ avatarUrl: "https://evil.example.com/x.png" }),
  });
  check("رابط صورة خارجي بيرفض", r.status === 400, `status ${r.status}`);

  /* ================= unauthenticated writes ================= */
  console.log("\nكتابة من غير تسجيل دخول");
  await fetch(`${BASE}/api/quiz/lead`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TEST_HEADERS },
    body: JSON.stringify({ email: victimEmail, name: "اسم مزوّر", answers: { field: "business" } }),
  });
  const afterLead = await prisma.user.findUnique({
    where: { email: victimEmail },
    select: { name: true },
  });
  check(
    "الكويز مبيغيّرش اسم حساب حقيقي",
    afterLead?.name === "اسم جديد",
    String(afterLead?.name)
  );

  const course = await prisma.course.findFirst({ where: { isComingSoon: false } });
  await fetch(`${BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TEST_HEADERS },
    body: JSON.stringify({
      email: victimEmail,
      name: "مخترق",
      phone: "01011111111",
      courseSlug: course!.slug,
      method: "vodafone_cash",
    }),
  });
  const afterOrder = await prisma.user.findUnique({
    where: { email: victimEmail },
    select: { name: true, phone: true },
  });
  check("الطلب مبيغيّرش اسم حساب حقيقي", afterOrder?.name === "اسم جديد", String(afterOrder?.name));
  check(
    "الطلب مبيغيّرش تليفون حساب حقيقي",
    afterOrder?.phone === "01099999999",
    String(afterOrder?.phone)
  );

  /* ================= admin surfaces ================= */
  console.log("\nصلاحيات الأدمن");
  for (const p of [
    "/api/admin/email-test",
    `/api/admin/users/${victim.id}/password`,
  ]) {
    const res = await fetch(`${BASE}${p}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TEST_HEADERS },
      body: JSON.stringify({ mode: "temp", to: "x@y.com" }),
    });
    check(`${p} بيرفض الزائر`, res.status === 401, `status ${res.status}`);
  }

  r = await victimJar.fetch(`/api/admin/users/${victim.id}/password`, {
    method: "POST",
    body: JSON.stringify({ mode: "temp" }),
  });
  check("مستخدم عادي مش بيعمل reset لنفسه من راوت الأدمن", r.status === 401, `status ${r.status}`);

  const adminJar = new Jar();
  await adminJar.fetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: PW }),
  });

  r = await adminJar.fetch(`/api/admin/users/${victim.id}/password`, {
    method: "POST",
    body: JSON.stringify({ mode: "temp" }),
  });
  const tempRes = await body(r);
  check("الأدمن بيعمل باسورد مؤقت", r.status === 200 && !!tempRes.tempPassword, `status ${r.status}`);

  const flagged = await prisma.user.findUnique({
    where: { id: victim.id },
    select: { mustChangePassword: true },
  });
  check("الباسورد المؤقت متعلّم عليه للتغيير", flagged?.mustChangePassword === true);

  // A second admin must not be seizable from the panel.
  const otherAdmin = await prisma.user.create({
    data: {
      email: `other${stamp}@test.local`,
      passwordHash: await hashPassword(PW),
      isAdmin: true,
      dailyPaceMinutes: 15,
    },
  });
  r = await adminJar.fetch(`/api/admin/users/${otherAdmin.id}/password`, {
    method: "POST",
    body: JSON.stringify({ mode: "temp" }),
  });
  check("أدمن مبيقدرش ياخد حساب أدمن تاني", r.status === 403, `status ${r.status}`);

  /*
   * The operator reset above deliberately signed the victim out of every
   * device — that is the point of it. Sign back in with the temporary password
   * it produced, so the checks below run against a live session.
   */
  r = await victimJar.fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: victimEmail, password: tempRes.tempPassword }),
  });
  check("الباسورد المؤقت بيشتغل فعلًا", r.status === 200, `status ${r.status}`);

  /* ================= certificate gate ================= */
  console.log("\nبوابة الشهادة");
  r = await victimJar.fetch(`/app/learn/${course!.slug}/certificate`);
  const certHtml = await r.text();
  check(
    "الشهادة مقفولة قبل ما يخلّص",
    certHtml.includes("الشهادة لسه مقفولة"),
    `status ${r.status}`
  );

  // Completing a locked lesson must be refused server-side too.
  const lockedLesson = await prisma.lesson.findFirst({
    where: { module: { courseId: course!.id }, dayNumber: { gt: 1 } },
  });
  r = await victimJar.fetch(`/api/lessons/${lockedLesson!.id}/complete`, {
    method: "POST",
    body: JSON.stringify({ score: 4, totalQuestions: 4 }),
  });
  check("مش بينفع يخلّص درس مقفول", r.status === 403, `status ${r.status}`);


  /* ================= session invalidation ================= */
  console.log("\nإبطال الجلسات عند تغيير الباسورد");

  const sessionUser = await prisma.user.create({
    data: {
      email: `sess${stamp}@test.local`,
      passwordHash: await hashPassword(PW),
      dailyPaceMinutes: 15,
    },
  });

  // Two devices signed in on the same account.
  const deviceA = new Jar();
  const deviceB = new Jar();
  for (const d of [deviceA, deviceB]) {
    await d.fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: sessionUser.email, password: PW }),
    });
  }
  check("الجهازين داخلين", (await deviceA.fetch("/app")).status === 200 && (await deviceB.fetch("/app")).status === 200);

  // Device A changes the password.
  r = await deviceA.fetch("/api/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword: PW, newPassword: "freshpass9876" }),
  });
  check("الجهاز الأول غيّر الباسورد", r.status === 200, `status ${r.status}`);

  r = await deviceB.fetch("/app");
  check(
    "الجهاز التاني اتطرد",
    r.status === 307 || r.status === 302,
    `status ${r.status} — الجلسة القديمة لسه شغالة`
  );

  r = await deviceA.fetch("/app");
  check("الجهاز اللي غيّر فضل داخل", r.status === 200, `status ${r.status}`);

  await prisma.user.deleteMany({ where: { id: sessionUser.id } });

  /* ================= JSON-LD escaping ================= */
  console.log("\nالبيانات المنظّمة");
  const landing = await (await fetch(`${BASE}/`)).text();

  const ldBlocks = landing.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  ) ?? [];
  check("فيه بيانات منظّمة", ldBlocks.length >= 2, `${ldBlocks.length} بلوك`);

  // Anything inside the block must be escaped — a raw "<" would let content
  // close the tag and become markup.
  const inner = ldBlocks.map((b) =>
    b.replace(/^<script type="application\/ld\+json">/, "").replace(/<\/script>$/, "")
  );
  check("مفيش وسوم HTML جوّه البيانات", inner.every((b) => !b.includes("<")), "فيه < غير مهروبة");
  check("البيانات JSON صالح", inner.every((b) => {
    try { JSON.parse(b); return true; } catch { return false; }
  }));

  /* ================= headers ================= */
  console.log("\nرؤوس الأمان");
  const head = await fetch(`${BASE}/`);
  check("X-Frame-Options", head.headers.get("x-frame-options") === "SAMEORIGIN");
  check("X-Content-Type-Options", head.headers.get("x-content-type-options") === "nosniff");
  check("Referrer-Policy", !!head.headers.get("referrer-policy"));
  check("مفيش X-Powered-By", !head.headers.get("x-powered-by"));

  const apiHead = await fetch(`${BASE}/api/auth/logout`, { method: "POST" });
  check(
    "الـAPI مش بيتكاش",
    (apiHead.headers.get("cache-control") ?? "").includes("no-store"),
    apiHead.headers.get("cache-control") ?? "مفيش"
  );

  /* ================= cleanup ================= */
  await prisma.passwordReset.deleteMany({ where: { userId: { in: [victim.id, otherAdmin.id] } } });
  await prisma.order.deleteMany({ where: { userId: victim.id } });
  await prisma.user.deleteMany({
    where: { email: { in: [victimEmail, adminEmail, `other${stamp}@test.local`] } },
  });

  console.log(`\n${"─".repeat(46)}`);
  console.log(`نجح: ${pass}   فشل: ${fail}`);
  if (failures.length) {
    console.log("\nالمشاكل:");
    failures.forEach((f) => console.log(`  • ${f}`));
  }
  await prisma.$disconnect();
  process.exit(fail ? 1 : 0);
})();
