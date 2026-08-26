/** Quick read-only snapshot of the database: admins, users, course order. */
import "./load-env";
import { prisma } from "../src/lib/prisma";

(async () => {
  const total = await prisma.user.count();
  const admins = await prisma.user.findMany({
    where: { isAdmin: true },
    select: { email: true, name: true, passwordHash: true },
  });
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, title: true, order: true, isComingSoon: true, _count: { select: { modules: true } } },
  });
  const lessons = await prisma.lesson.count();

  console.log(`users: ${total}`);
  console.log(`admins: ${admins.length}`);
  for (const a of admins) console.log(`  - ${a.email} (${a.name ?? "بدون اسم"}) باسورد: ${a.passwordHash ? "متسجّل" : "ناقص"}`);
  console.log(`courses: ${courses.length} · lessons: ${lessons}`);
  for (const c of courses) {
    console.log(`  ${String(c.order).padStart(2)} · ${c.slug.padEnd(26)} ${c.title}${c.isComingSoon ? "  (قريبًا)" : ""}`);
  }

  await prisma.$disconnect();
})();
