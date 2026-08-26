/** Reverses scripts/preview-certificate.ts — removes the fake completions. */
import "./load-env";
import { prisma } from "../src/lib/prisma";

const [email, slug = "claude-lel-mashroaat"] = process.argv.slice(2);

if (!email) {
  console.error("الاستخدام: npx tsx scripts/undo-certificate-preview.ts <email> [slug]");
  process.exit(1);
}

(async () => {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  const course = await prisma.course.findUnique({ where: { slug } });

  if (!user || !course) {
    console.log("مفيش حساب أو مسار بالاسم ده.");
    await prisma.$disconnect();
    return;
  }

  const removed = await prisma.lessonCompletion.deleteMany({
    where: { userId: user.id, lesson: { module: { courseId: course.id } } },
  });

  console.log(`اتشال ${removed.count} إكمال تجريبي من "${course.title}".`);
  await prisma.$disconnect();
})();
