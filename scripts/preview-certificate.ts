/**
 * Marks one course complete for one account so the certificate can be viewed.
 * Local preview only — never run this against real data.
 */
import "./load-env";
import { prisma } from "../src/lib/prisma";

const [email, slug = "claude-lel-mashroaat"] = process.argv.slice(2);

if (!email) {
  console.error("الاستخدام: npx tsx scripts/preview-certificate.ts <email> [slug]");
  process.exit(1);
}

(async () => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  const course = await prisma.course.findUnique({
    where: { slug },
    include: { modules: { include: { lessons: true } } },
  });

  if (!user) throw new Error(`مفيش حساب بالإيميل ${email}`);
  if (!course) throw new Error(`مفيش مسار بالـ slug ${slug}`);

  const lessons = course.modules.flatMap((m) => m.lessons);

  for (const l of lessons) {
    await prisma.lessonCompletion.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: l.id } },
      update: { score: 4, totalQuestions: 4, xpEarned: l.xp },
      create: { userId: user.id, lessonId: l.id, score: 4, totalQuestions: 4, xpEarned: l.xp },
    });
  }

  console.log(`✓ ${lessons.length} درس اتعلّم عليهم كمكتملين في "${course.title}"`);
  console.log(`  افتح: /app/learn/${course.slug}/certificate`);
  await prisma.$disconnect();
})();
