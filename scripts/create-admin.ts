/**
 * Creates or updates the owner account and marks it admin.
 * Usage: npx tsx scripts/create-admin.ts <email> <password> [name]
 */
import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";

const [email, password, name = "المالك"] = process.argv.slice(2);

if (!email || !password) {
  console.error("الاستخدام: npx tsx scripts/create-admin.ts <email> <password> [name]");
  process.exit(1);
}

(async () => {
  const normalized = email.toLowerCase().trim();
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email: normalized },
    update: { passwordHash, isAdmin: true, name, mustChangePassword: false },
    create: {
      email: normalized,
      passwordHash,
      isAdmin: true,
      name,
      dailyPaceMinutes: 15,
      welcomedAt: new Date(),
    },
  });

  console.log(`✓ الحساب جاهز: ${user.email}`);
  console.log(`  أدمن: ${user.isAdmin ? "نعم" : "لا"}`);
  console.log(`  الباسورد مخزّن مشفّر — مش موجود في أي مكان كنص.`);
  await prisma.$disconnect();
})();
