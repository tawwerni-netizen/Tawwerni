import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasCourseAccess, pendingOrderFor, FREE_PREVIEW_DAY } from "@/lib/access";
import { loadUniversalLesson } from "@/lib/course-loader";
import { ALL_100_TRACKS } from "@/content/tracks100";
import LessonPlayer from "@/components/LessonPlayer";

export default async function LessonPage({ params }: { params: Promise<{ slug: string; day: string }> }) {
  const { slug, day } = await params;
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=/app/learn/${slug}/${day}`);
  }

  const dayNumber = Number(day);
  if (isNaN(dayNumber) || dayNumber < 1) notFound();

  const lessonData = loadUniversalLesson(slug, dayNumber);
  if (!lessonData) notFound();

  const { course, module, lesson, allLessons, nextLesson } = lessonData;

  let unlocked = false;
  try {
    unlocked = await hasCourseAccess(user.id, course.id);
  } catch {
    unlocked = false;
  }

  // Day 1 is a free preview; everything after it needs an approved order or admin role.
  if (dayNumber !== FREE_PREVIEW_DAY && !unlocked) {
    redirect(`/app/learn/${course.slug}?locked=1`);
  }

  // Drives the prompt shown after the free day finishes.
  let pending = false;
  if (!unlocked) {
    try {
      const p = await pendingOrderFor(user.id, course.id);
      pending = p !== null;
    } catch {
      pending = false;
    }
  }

  const accessState = unlocked ? "unlocked" : pending ? "pending" : "unpaid";

  const promoCourses = ALL_100_TRACKS.filter((t) => t.slug !== course.slug)
    .slice(0, 4)
    .map(({ slug, icon, pillarNameAr, pillarNameEn }) => ({
      slug,
      icon,
      category: pillarNameAr,
      categoryEn: pillarNameEn,
    }));

  return (
    <LessonPlayer
      courseSlug={course.slug}
      courseTitle={course.titleAr}
      courseTitleEn={course.titleEn}
      accessState={accessState}
      moduleTitle={module.titleAr}
      moduleTitleEn={module.titleEn}
      dayNumber={dayNumber}
      totalDays={allLessons.length}
      lessonId={lesson.id}
      lessonTitle={lesson.titleAr}
      lessonTitleEn={lesson.titleEn}
      videoUrl={lesson.videoUrl}
      cards={lesson.cards}
      cardsAr={lesson.cardsAr}
      cardsEn={lesson.cardsEn}
      quiz={lesson.quiz}
      quizAr={lesson.quizAr}
      quizEn={lesson.quizEn}
      xp={lesson.xp}
      nextDayNumber={nextLesson?.dayNumber ?? null}
      promoCourses={promoCourses}
    />
  );
}
