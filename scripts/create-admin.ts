/**
 * Creates or updates the owner account and marks it admin.
 *
 *   npx tsx scripts/create-admin.ts <email> [name]
 *
 * The password is asked for, not passed as an argument. An argument would sit
 * in the shell's history file for anyone with the machine to read later, and
 * this is the password to the panel that approves payments.
 *
 * Passing it as a third argument still works, for scripted setups.
 */
import { askHidden } from "./ask-hidden";
import { prisma } from "../src/lib/prisma";
import { hashPassword, passwordProblem } from "../src/lib/password";

const [email, ...rest] = process.argv.slice(2);
// A third argument is still honoured so existing scripts keep working; the
// name is whatever is left.
const inlinePassword = rest.length > 1 ? rest[0] : undefined;
const name = (rest.length > 1 ? rest[1] : rest[0]) ?? "المالك";

if (!email) {
  console.error("الاستخدام: npx tsx scripts/create-admin.ts <email> [name]");
  process.exit(1);
}

(async () => {
  let password = inlinePassword;

  if (!password) {
    password = await askHidden("الباسورد الجديد (مش هيظهر وانت بتكتب): ");
    const again = await askHidden("اكتبه تاني للتأكيد: ");

    if (password !== again) {
      console.error("\n✗ الباسوردين مش زي بعض. مفيش حاجة اتغيّرت.");
      await prisma.$disconnect();
      process.exit(1);
    }
  }

  const problem = passwordProblem(password);
  if (problem) {
    console.error(`\n✗ ${problem}. مفيش حاجة اتغيّرت.`);
    await prisma.$disconnect();
    process.exit(1);
  }

  const normalized = email.toLowerCase().trim();
  const existed = await prisma.user.findUnique({ where: { email: normalized } });
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email: normalized },
    // Bumping sessionVersion logs out every device already holding a token —
    // same as the in-app password change. This is a recovery path, so a
    // session someone else is holding has to die with the old password.
    update: {
      passwordHash,
      isAdmin: true,
      name,
      mustChangePassword: false,
      sessionVersion: { increment: 1 },
    },
    create: {
      email: normalized,
      passwordHash,
      isAdmin: true,
      name,
      dailyPaceMinutes: 15,
      welcomedAt: new Date(),
    },
  });

  console.log(`\n✓ ${existed ? "الباسورد اتغيّر" : "الحساب اتعمل"}: ${user.email}`);
  console.log(`  أدمن: ${user.isAdmin ? "نعم" : "لا"} · الاسم: ${user.name}`);
  console.log(`  الباسورد مخزّن مشفّر — مش موجود في أي مكان كنص.`);

  if (existed) {
    console.log(`\n  كل الأجهزة اللي كانت داخلة على الحساب ده اتطردت — لازم تدخل من جديد.`);
  }

  await prisma.$disconnect();
})();
