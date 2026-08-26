/**
 * Creates a paying account for hands-on testing.
 *
 * Goes through `activateOrder` — the same path a matched bank transfer takes —
 * so the account behaves exactly like a real customer's rather than one with a
 * flag flipped by hand.
 *
 * Usage: npx tsx scripts/create-demo-user.ts <email> <password> [name]
 */
import "./load-env";
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";
import { activateOrder } from "../src/lib/activate-order";
import { pricing } from "../src/content/brand";

const [email, password, name = "مشترك تجريبي"] = process.argv.slice(2);

if (!email || !password) {
  console.error("الاستخدام: npx tsx scripts/create-demo-user.ts <email> <password> [name]");
  process.exit(1);
}

(async () => {
  const normalized = email.toLowerCase().trim();
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email: normalized },
    update: { passwordHash, name, mustChangePassword: false },
    create: {
      email: normalized,
      passwordHash,
      name,
      dailyPaceMinutes: 15,
      welcomedAt: new Date(),
    },
    select: { id: true, email: true },
  });

  const already = await prisma.order.findFirst({
    where: { userId: user.id, status: "approved" },
    select: { id: true },
  });

  if (already) {
    console.log(`✓ ${user.email} — الاشتراك مفتوح بالفعل`);
  } else {
    const course = await prisma.course.findFirst({
      where: { isComingSoon: false },
      orderBy: { order: "asc" },
      select: { id: true },
    });
    if (!course) throw new Error("مفيش مسارات — شغّل npm run db:seed الأول");

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        courseId: course.id,
        method: "manual",
        amountEgp: pricing.priceEgp,
        originalPriceEgp: pricing.originalPriceEgp,
        status: "pending",
      },
      select: { id: true },
    });
    await activateOrder(order.id, "حساب تجريبي");
    console.log(`✓ ${user.email} — الاشتراك اتفعّل، كل المسارات مفتوحة`);
  }

  console.log(`  الباسورد مخزّن مشفّر — مش موجود في أي مكان كنص.`);
  await prisma.$disconnect();
})();
