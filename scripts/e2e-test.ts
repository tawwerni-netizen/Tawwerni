/**
 * End-to-end check against a running dev server.
 *
 * Walks the paths that carry money or access: signing up, logging in, placing
 * an order, an admin approving it, the resulting all-access unlock, and the
 * referral commission behind it. Also checks that the admin panel actually
 * refuses people who are not admins — the failure mode that matters most here.
 *
 * Usage: npx tsx scripts/e2e-test.ts [baseUrl]
 */
import "./load-env";
import { TEST_HEADERS } from "./test-env";
import { prisma } from "../src/lib/prisma";
import { allCourses } from "../src/content/courses";

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

/** Minimal cookie jar: the session is a cookie, so the jar is the test subject. */
class Jar {
  private jar = new Map<string, string>();

  header() {
    return [...this.jar].map(([k, v]) => `${k}=${v}`).join("; ");
  }

  absorb(res: Response) {
    for (const raw of res.headers.getSetCookie?.() ?? []) {
      const [pair] = raw.split(";");
      const idx = pair.indexOf("=");
      if (idx > 0) this.jar.set(pair.slice(0, idx).trim(), pair.slice(idx + 1).trim());
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
}

async function json(res: Response) {
  const t = await res.text();
  try {
    return JSON.parse(t);
  } catch {
    return { _raw: t.slice(0, 200) };
  }
}

(async () => {
  const stamp = Date.now();
  const referrerEmail = `ref${stamp}@test.local`;
  const buyerEmail = `buy${stamp}@test.local`;
  const PW = "testpass1234";

  console.log(`\nالسيرفر: ${BASE}\n`);

  /* ---------------- pages load ---------------- */
  console.log("الصفحات العامة");
  for (const p of ["/", "/login", "/quiz", "/quiz/checkout", "/admin"]) {
    const r = await fetch(`${BASE}${p}`, { redirect: "manual" });
    check(`${p} → ${r.status}`, r.status === 200);
  }

  /* ---------------- protected routes redirect ---------------- */
  console.log("\nالصفحات المحمية بترفض الزائر");
  for (const p of ["/app", "/app/learn", "/app/progress", "/app/referrals", "/app/profile"]) {
    const r = await fetch(`${BASE}${p}`, { redirect: "manual" });
    check(`${p} بيحوّل لتسجيل الدخول`, r.status === 307 || r.status === 302, `status ${r.status}`);
  }

  /* ---------------- signup + referral attribution ---------------- */
  console.log("\nالتسجيل والإحالة");
  const referrer = new Jar();
  let r = await referrer.fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email: referrerEmail, password: PW, name: "المُحيل" }),
  });
  check("تسجيل حساب جديد", r.status === 200, `status ${r.status}`);

  const refRow = await prisma.user.findUnique({
    where: { email: referrerEmail },
    select: { id: true, referralCode: true },
  });
  check("الحساب اتسجّل في الداتابيز", !!refRow);

  // The referrals page sits behind the same onboarding gate every /app route
  // does — skipping this step made the fetch below hit the /onboarding
  // redirect instead of the page that actually mints the code, which looked
  // exactly like a broken referral system and was not one.
  await referrer.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ dailyPaceMinutes: 15 }),
  });

  // Referral code is minted lazily on first view of the referrals page.
  await referrer.fetch("/app/referrals");
  const withCode = await prisma.user.findUnique({
    where: { email: referrerEmail },
    select: { id: true, referralCode: true },
  });
  check("كود الإحالة اتولّد", !!withCode?.referralCode, String(withCode?.referralCode));

  // Buyer arrives through the referral link, so the cookie carries the code.
  const buyer = new Jar();
  await buyer.fetch(`/?ref=${withCode!.referralCode}`);
  r = await buyer.fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email: buyerEmail, password: PW, name: "المشتري" }),
  });
  check("تسجيل المشتري", r.status === 200, `status ${r.status}`);

  const buyerRow = await prisma.user.findUnique({
    where: { email: buyerEmail },
    select: { id: true, referredById: true },
  });
  check("الإحالة اتربطت", buyerRow?.referredById === withCode!.id, String(buyerRow?.referredById));

  /* ---------------- login ---------------- */
  console.log("\nتسجيل الدخول");
  const fresh = new Jar();
  r = await fresh.fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: buyerEmail, password: PW }),
  });
  check("الدخول بالباسورد الصح", r.status === 200, `status ${r.status}`);

  r = await new Jar().fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: buyerEmail, password: "wrong-password" }),
  });
  check("الباسورد الغلط بيترفض", r.status === 401, `status ${r.status}`);

  r = await new Jar().fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: `nobody${stamp}@test.local`, password: PW }),
  });
  const unknownBody = await json(r);
  check("إيميل مش موجود بيدّي نفس الرسالة", r.status === 401 && unknownBody.error === "الإيميل أو الباسورد غلط");

  /* ---------------- onboarding gate ---------------- */
  console.log("\nالـ Onboarding");
  r = await fresh.fetch("/app");
  check("قبل الـ onboarding بيتحوّل ليه", r.status === 307 || r.status === 302, `status ${r.status}`);

  r = await fresh.fetch("/api/profile", {
    method: "PATCH",
    body: JSON.stringify({ dailyPaceMinutes: 15 }),
  });
  check("حفظ الالتزام اليومي", r.status === 200, `status ${r.status}`);

  r = await fresh.fetch("/app");
  check("الصفحة الرئيسية بتفتح بعده", r.status === 200, `status ${r.status}`);

  /* ---------------- free day vs locked days ---------------- */
  console.log("\nاليوم المجاني والأيام المقفولة");
  const course = await prisma.course.findFirst({ where: { isComingSoon: false }, orderBy: { order: "asc" } });
  r = await fresh.fetch(`/app/learn/${course!.slug}/1`);
  check("اليوم الأول مفتوح مجانًا", r.status === 200, `status ${r.status}`);

  r = await fresh.fetch(`/app/learn/${course!.slug}/2`);
  check("اليوم التاني مقفول قبل الدفع", r.status === 307 || r.status === 302, `status ${r.status}`);

  /* ---------------- order ---------------- */
  console.log("\nالطلب والتفعيل");
  r = await fresh.fetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({
      email: buyerEmail,
      name: "المشتري التجريبي",
      phone: "01000000001",
      courseSlug: course!.slug,
      method: "vodafone_cash",
      proofChannel: "whatsapp",
    }),
  });
  check("إنشاء الطلب", r.status === 200, `status ${r.status} ${JSON.stringify(await json(r)).slice(0, 120)}`);

  const order = await prisma.order.findFirst({
    where: { userId: buyerRow!.id },
    orderBy: { createdAt: "desc" },
  });
  check("الطلب اتسجّل بحالة pending", order?.status === "pending", String(order?.status));

  // Still locked while pending.
  r = await fresh.fetch(`/app/learn/${course!.slug}/2`);
  check("لسه مقفول والطلب تحت المراجعة", r.status === 307 || r.status === 302, `status ${r.status}`);

  /* ---------------- admin auth ---------------- */
  console.log("\nصلاحية لوحة التحكم");
  const nonAdmin = new Jar();
  r = await nonAdmin.fetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: buyerEmail, password: PW }),
  });
  check("مستخدم عادي بباسورد صح مبيدخلش اللوحة", r.status === 401, `status ${r.status}`);

  r = await nonAdmin.fetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: buyerEmail, password: "nope" }),
  });
  check("باسورد غلط على اللوحة بيترفض", r.status === 401, `status ${r.status}`);

  // A logged-in ordinary user must not see the panel content either.
  const adminHtml = await (await fresh.fetch("/admin")).text();
  check("مستخدم مسجّل عادي بيشوف شاشة الدخول مش الطلبات", adminHtml.includes("لوحة إدارة"), "شاف محتوى اللوحة");

  // Now a real admin.
  const adminEmail = `admin${stamp}@test.local`;
  await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash: await hashPassword(PW),
      isAdmin: true,
      name: "أدمن الاختبار",
      dailyPaceMinutes: 15,
    },
  });
  const admin = new Jar();
  r = await admin.fetch("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: PW }),
  });
  check("الأدمن بيدخل اللوحة", r.status === 200, `status ${r.status}`);

  const panel = await (await admin.fetch("/admin")).text();
  check("اللوحة بتفتح على الطلبات", !panel.includes("ادخل بحساب المالك"), "لسه شاشة دخول");

  for (const p of ["/admin/users", "/admin/payouts"]) {
    const res = await admin.fetch(p);
    check(`${p} بيفتح للأدمن`, res.status === 200, `status ${res.status}`);
  }

  /* ---------------- approval unlocks everything ---------------- */
  console.log("\nالموافقة بتفتح كل المسارات");
  r = await admin.fetch(`/api/admin/orders/${order!.id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "approved" }),
  });
  check("الموافقة على الطلب", r.status === 200, `status ${r.status} ${JSON.stringify(await json(r)).slice(0, 150)}`);

  const approved = await prisma.order.findUnique({ where: { id: order!.id } });
  check("الطلب بقى approved", approved?.status === "approved", String(approved?.status));

  r = await fresh.fetch(`/app/learn/${course!.slug}/2`);
  check("اليوم التاني اتفتح", r.status === 200, `status ${r.status}`);

  const other = await prisma.course.findFirst({
    where: { isComingSoon: false, id: { not: course!.id } },
    orderBy: { order: "asc" },
  });
  r = await fresh.fetch(`/app/learn/${other!.slug}/2`);
  check("مسار تاني اتفتح كمان (اشتراك واحد)", r.status === 200, `status ${r.status}`);

  /* ---------------- commission ---------------- */
  console.log("\nالعمولة");
  const earning = await prisma.referralEarning.findUnique({ where: { orderId: order!.id } });
  check("العمولة اتحسبت للمُحيل", earning?.userId === withCode!.id, String(earning?.userId));
  check("قيمة العمولة صح", earning?.amountEgp === 50, String(earning?.amountEgp));

  // Replaying the approval must not pay twice.
  await admin.fetch(`/api/admin/orders/${order!.id}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "approved" }),
  });
  const count = await prisma.referralEarning.count({ where: { orderId: order!.id } });
  check("الموافقة مرتين مبتدفعش عمولتين", count === 1, `${count}`);

  /* ---------------- catalogue ---------------- */
  console.log("\nالكتالوج");
  const courses = await prisma.course.findMany({ orderBy: { order: "asc" } });
  check("مفيش كورسات فاضية (قريبًا)", courses.every((c) => !c.isComingSoon));
  // Was a hardcoded "6" — the exact count this is supposed to guard against
  // silently drifting from. Checked against the seeded catalogue itself
  // instead, so the count can only ever be wrong if the seed and the DB
  // actually disagree, not just because a track got added.
  check("عدد المسارات مطابق للمحتوى المزروع", courses.length === allCourses.length, `${courses.length} في القاعدة، ${allCourses.length} في المحتوى`);
  check(
    "الترتيب مطابق لترتيب الكتالوج في الكود",
    courses[0].slug === allCourses[0].meta.slug,
    `${courses[0].slug} بدل ${allCourses[0].meta.slug}`
  );

  /* ---------------- cleanup ---------------- */
  await prisma.referralEarning.deleteMany({ where: { orderId: order!.id } });
  await prisma.order.deleteMany({ where: { userId: buyerRow!.id } });
  await prisma.user.deleteMany({ where: { email: { in: [referrerEmail, buyerEmail, adminEmail] } } });

  console.log(`\n${"─".repeat(46)}`);
  console.log(`نجح: ${pass}   فشل: ${fail}`);
  if (failures.length) {
    console.log("\nالمشاكل:");
    failures.forEach((f) => console.log(`  • ${f}`));
  }
  await prisma.$disconnect();
  process.exit(fail ? 1 : 0);
})();
