import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeLevel, computeStreak, getWeekDays } from "@/lib/xp";
import { getAllUniversalCourses } from "@/lib/course-loader";
import ProgressClient from "@/components/ProgressClient";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [completions, userBadges, hasTestimonial] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      select: {
        lessonId: true,
        completedAt: true,
        xpEarned: true,
      },
    }),
    prisma.userBadge.findMany({ where: { userId: user.id }, select: { badge: { select: { key: true } } } }),
    prisma.testimonial.findFirst({ where: { userId: user.id }, select: { id: true } }),
  ]);

  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));
  const weekDaysAr = getWeekDays(completions.map((c) => c.completedAt), "ar");
  const weekDaysEn = getWeekDays(completions.map((c) => c.completedAt), "en");

  const weekDays = weekDaysAr.map((d, i) => ({
    label: d.label,
    labelEn: weekDaysEn[i]?.label ?? d.label,
    done: d.done,
    isToday: d.isToday,
    index: i,
  }));

  const level = computeLevel(totalXp);
  const progressPercent = level.xpForNextLevel
    ? Math.min(100, Math.round((level.xpIntoLevel / level.xpForNextLevel) * 100))
    : 100;

  const doneIds = new Set(completions.map((c) => c.lessonId));
  const allUniversal = getAllUniversalCourses();

  const coursesProgress = allUniversal
    .map((c) => {
      const allLessons = c.modules.flatMap((m) => m.lessons);
      const courseLessonIds = new Set(allLessons.map((l) => l.id));
      const courseCompletions = completions.filter((comp) => courseLessonIds.has(comp.lessonId));
      const completedLessons = courseCompletions.length;
      const xpEarned = courseCompletions.reduce((s, comp) => s + comp.xpEarned, 0);
      return {
        id: c.id,
        slug: c.slug,
        titleAr: c.titleAr,
        titleEn: c.titleEn,
        icon: c.icon,
        totalLessons: c.totalLessons,
        completedLessons,
        xpEarned,
      };
    })
    .filter((c) => c.completedLessons > 0);

  return (
    <ProgressClient
      totalXp={totalXp}
      streak={streak}
      completionsCount={completions.length}
      level={level}
      progressPercent={progressPercent}
      weekDays={weekDays}
      hasTestimonial={Boolean(hasTestimonial)}
      courses={coursesProgress}
      earnedBadgeKeys={userBadges.map((ub) => ub.badge.key)}
    />
  );
}
