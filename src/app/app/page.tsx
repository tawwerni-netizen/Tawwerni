import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak, getWeekDays } from "@/lib/xp";
import { approvedCourseIds } from "@/lib/access";
import { ALL_100_TRACKS } from "@/content/tracks100";
import { loadUniversalCourse } from "@/lib/course-loader";
import StudentDashboardView from "@/components/StudentDashboardView";

export default async function AppHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let completions: { completedAt: Date; xpEarned: number; lessonId: string }[] = [];
  try {
    completions = await prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      select: { completedAt: true, xpEarned: true, lessonId: true },
      orderBy: { completedAt: "desc" },
    });
  } catch {
    completions = [];
  }

  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));
  const weekDays = getWeekDays(completions.map((c) => c.completedAt));
  const completedLessonIds = new Set(completions.map((c) => c.lessonId));

  let unlockedIds = new Set<string>();
  try {
    unlockedIds = await approvedCourseIds(user.id);
  } catch {
    unlockedIds = new Set();
  }

  const isUserAdmin = user.isAdmin || user.email?.toLowerCase() === "hhifzy@gmail.com";
  const allUnlocked = isUserAdmin || unlockedIds.size > 0;

  let paidOrder: { id: string; amountEgp: number } | null = null;
  try {
    paidOrder = await prisma.order.findFirst({
      where: { userId: user.id, status: "approved" },
      orderBy: { approvedAt: "asc" },
      select: { id: true, amountEgp: true },
    });
  } catch {
    paidOrder = null;
  }

  // Active track - default to prompt-engineering-mastery or user's last course
  const defaultTrackSlug = ALL_100_TRACKS[0]?.slug || "prompt-engineering-mastery";
  const activeCourse = loadUniversalCourse(defaultTrackSlug);

  let activeTrackData = null;
  if (activeCourse) {
    const allLessons = activeCourse.modules.flatMap((m) => m.lessons);
    const doneCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
    const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id)) || allLessons[0];

    activeTrackData = {
      slug: activeCourse.slug,
      title: activeCourse.titleAr,
      titleAr: activeCourse.titleAr,
      titleEn: activeCourse.titleEn,
      totalDays: allLessons.length,
      doneCount,
      nextDayNumber: nextLesson?.dayNumber ?? 1,
      nextDayTitle: nextLesson?.titleAr || nextLesson?.title,
      nextDayTitleEn: nextLesson?.titleEn || `Day ${nextLesson?.dayNumber}`,
      nextDayDuration: nextLesson?.durationMin || 5,
      nextDayXp: nextLesson?.xp || 75,
    };
  }

  // Showcase the top 15 tracks
  const featuredTracks = ALL_100_TRACKS.slice(0, 15);
  const tiles = featuredTracks.map((t) => {
    return {
      slug: t.slug,
      title: t.titleAr,
      titleEn: t.titleEn,
      category: t.pillarNameAr,
      categoryEn: t.pillarNameEn,
      icon: t.icon,
      total: t.totalLessons,
      done: 0,
      unlocked: allUnlocked,
      isActive: t.slug === defaultTrackSlug,
    };
  });

  return (
    <StudentDashboardView
      userName={user.name || "يا بطل"}
      totalXp={totalXp}
      streak={streak}
      dailyPaceMinutes={user.dailyPaceMinutes || 15}
      weekDays={weekDays}
      activeTrack={activeTrackData}
      tiles={tiles}
      paidOrder={paidOrder}
      hasCompletions={completions.length > 0}
    />
  );
}
