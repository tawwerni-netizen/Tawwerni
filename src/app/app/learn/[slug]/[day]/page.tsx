import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { hasCourseAccess, approvedCourseIds, FREE_PREVIEW_DAY } from "@/lib/access";
import LessonPlayer, { type Card } from "@/components/LessonPlayer";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; day: string }> }) {
  const { slug, day } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const dayNumber = Number(day);
  const course = await prisma.course.findUnique({
    where: { slug },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  if (!course) notFound();

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const totalDays = allLessons.length;
  const lesson = allLessons.find((l) => l.dayNumber === dayNumber);
  if (!lesson) notFound();

  // Day 1 is a free preview; everything after it needs an approved order.
  if (dayNumber !== FREE_PREVIEW_DAY && !(await hasCourseAccess(user.id, course.id))) {
    redirect(`/app/learn/${course.slug}?locked=1`);
  }

  const module = course.modules.find((m) => m.id === lesson.moduleId)!;

  const [cards, quizQuestions] = await Promise.all([
    prisma.lessonCard.findMany({ where: { lessonId: lesson.id }, orderBy: { order: "asc" } }),
    prisma.quizQuestion.findMany({ where: { lessonId: lesson.id }, orderBy: { order: "asc" } }),
  ]);

  const nextLesson = allLessons.find((l) => l.order > lesson.order && l.moduleId === lesson.moduleId) ??
    course.modules.find((m) => m.order === module.order + 1)?.lessons[0];

  const unlockedIds = await approvedCourseIds(user.id);
  const promoCourses = (
    await prisma.course.findMany({
      where: { isComingSoon: false, id: { not: course.id } },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, icon: true, category: true },
    })
  )
    .filter((c) => !unlockedIds.has(c.id))
    .map(({ slug, icon, category }) => ({ slug, icon, category }));

  return (
    <LessonPlayer
      courseSlug={course.slug}
      moduleTitle={module.title}
      dayNumber={dayNumber}
      totalDays={totalDays}
      lessonId={lesson.id}
      lessonTitle={lesson.title}
      cards={cards.map(
        (c) =>
          ({
            type: c.type,
            heading: c.heading ?? "",
            body: JSON.parse(c.body),
          }) as Card
      )}
      quiz={quizQuestions.map((q) => ({
        id: q.id,
        type: q.type as "mcq" | "tf",
        question: q.question,
        options: JSON.parse(q.options),
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }))}
      xp={lesson.xp}
      nextDayNumber={nextLesson?.dayNumber ?? null}
      promoCourses={promoCourses}
    />
  );
}
