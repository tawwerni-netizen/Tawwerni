import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import TestimonialClient from "@/components/TestimonialClient";

const MIN_COMPLETIONS = 3;

export default async function TestimonialPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [completions, existing] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      select: { lesson: { select: { module: { select: { courseId: true } } } } },
    }),
    prisma.testimonial.findFirst({ where: { userId: user.id } }),
  ]);

  // The course they've put the most work into
  const perCourse = new Map<string, number>();
  for (const c of completions) {
    const id = c.lesson.module.courseId;
    perCourse.set(id, (perCourse.get(id) ?? 0) + 1);
  }
  const topCourseId = [...perCourse.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <TestimonialClient
      existingStatus={existing?.status ?? null}
      completionsCount={completions.length}
      minCompletions={MIN_COMPLETIONS}
      topCourseId={topCourseId}
    />
  );
}
