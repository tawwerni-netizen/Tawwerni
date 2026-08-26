/**
 * Removes accounts left behind by test runs.
 *
 * Only ever touches `@test.local` addresses — the suites mint those and nothing
 * real ever uses that domain, so this can't reach a paying customer.
 */
import { prisma } from "../src/lib/prisma";

(async () => {
  const ids = (
    await prisma.user.findMany({
      where: { email: { endsWith: "@test.local" } },
      select: { id: true },
    })
  ).map((u) => u.id);

  if (ids.length === 0) {
    console.log("مفيش حسابات اختبار.");
    await prisma.$disconnect();
    return;
  }

  // Children first — the foreign keys won't allow the user rows to go otherwise.
  await prisma.passwordReset.deleteMany({ where: { userId: { in: ids } } });
  await prisma.referralEarning.deleteMany({
    where: { OR: [{ userId: { in: ids } }, { referredUserId: { in: ids } }] },
  });
  await prisma.payout.deleteMany({ where: { userId: { in: ids } } });
  await prisma.lessonCompletion.deleteMany({ where: { userId: { in: ids } } });
  await prisma.userBadge.deleteMany({ where: { userId: { in: ids } } });
  await prisma.chatMessage.deleteMany({ where: { userId: { in: ids } } });
  await prisma.order.deleteMany({ where: { userId: { in: ids } } });
  await prisma.user.updateMany({ where: { referredById: { in: ids } }, data: { referredById: null } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });

  console.log(`اتمسح ${ids.length} حساب اختبار.`);
  console.log(`الباقي: ${await prisma.user.count()} حساب.`);
  await prisma.$disconnect();
})();
