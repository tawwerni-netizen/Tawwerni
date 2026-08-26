/**
 * Clears the accounts and orders left over from building, so the panel opens
 * on a clean slate at launch.
 *
 *   npx tsx scripts/reset-for-launch.ts          ← shows what it would delete
 *   npx tsx scripts/reset-for-launch.ts --yes    ← actually deletes
 *
 * Admins are never touched, and neither is anything listed in KEEP. Courses,
 * lessons and badges are content, not user data, so they stay too.
 *
 * Run it once, before the first real customer. After that, use the panel.
 */
import "./load-env";
import { prisma } from "../src/lib/prisma";

/** Accounts that survive the reset even though they look like test data. */
const KEEP = ["demo@tawwerni.com", "logoxpress.eg@gmail.com"];

const confirmed = process.argv.includes("--yes");

(async () => {
  const doomed = await prisma.user.findMany({
    where: { isAdmin: false, email: { notIn: KEEP } },
    select: { id: true, email: true },
  });

  const kept = await prisma.user.findMany({
    where: { OR: [{ isAdmin: true }, { email: { in: KEEP } }] },
    select: { email: true, isAdmin: true },
  });

  console.log(`\nهيفضل ${kept.length} حساب:`);
  for (const u of kept) console.log(`  ✓ ${u.email}${u.isAdmin ? "  (أدمن)" : ""}`);

  console.log(`\nهيتمسح ${doomed.length} حساب:`);
  for (const u of doomed) console.log(`  ✗ ${u.email}`);

  const orders = await prisma.order.count();
  const payments = await prisma.paymentTransaction.count();
  console.log(`\nوكمان: ${orders} طلب · ${payments} تحويل — كلهم.`);

  if (!confirmed) {
    console.log(`\nده عرض بس. للتنفيذ الفعلي:`);
    console.log(`  npx tsx scripts/reset-for-launch.ts --yes\n`);
    await prisma.$disconnect();
    return;
  }

  // Orders and transactions go wholesale — every one of them is from testing,
  // and a real order can only arrive after this script has run.
  await prisma.paymentTransaction.deleteMany({});
  await prisma.referralEarning.deleteMany({});
  await prisma.order.deleteMany({});

  // Then the accounts, children first: the foreign keys won't allow otherwise.
  const ids = doomed.map((u) => u.id);
  if (ids.length) {
    await prisma.passwordReset.deleteMany({ where: { userId: { in: ids } } });
    await prisma.payout.deleteMany({ where: { userId: { in: ids } } });
    await prisma.lessonCompletion.deleteMany({ where: { userId: { in: ids } } });
    await prisma.userBadge.deleteMany({ where: { userId: { in: ids } } });
    // A kept account may have been referred by one that is going away.
    await prisma.user.updateMany({
      where: { referredById: { in: ids } },
      data: { referredById: null },
    });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
  }

  console.log(`\n✅ اتمسح ${ids.length} حساب · ${orders} طلب · ${payments} تحويل`);
  console.log(`   فاضل: ${await prisma.user.count()} حساب · ${await prisma.order.count()} طلب`);
  console.log(`   المحتوى زي ما هو: ${await prisma.course.count()} مسار · ${await prisma.lesson.count()} درس\n`);

  await prisma.$disconnect();
})();
