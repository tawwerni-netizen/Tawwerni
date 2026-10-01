import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak, getWeekDays } from "@/lib/xp";
import { approvedCourseIds } from "@/lib/access";
import { ALL_100_TRACKS } from "@/content/tracks100";
import { resolveUserLearningProgress } from "@/lib/recent-learning-server";
import StudentDashboardView from "@/components/StudentDashboardView";

export default async function AppHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [cookieStore, completionsRaw] = await Promise.all([
    cookies(),
    prisma.lessonCompletion
      .findMany({
        where: { userId: user.id },
        select: { completedAt: true, xpEarned: true, lessonId: true },
        orderBy: { completedAt: "desc" },
      })
      .catch(() => []),
  ]);

  const { activeTrack, inProgressTracks, completedLessonIds } = await resolveUserLearningProgress(
    user.id,
    cookieStore
  );

  const totalXp = completionsRaw.reduce((s, c) => s + c.xpEarned, 0);
  const streak = computeStreak(completionsRaw.map((c) => c.completedAt));
  const weekDays = getWeekDays(completionsRaw.map((c) => c.completedAt));

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
      isActive: t.slug === activeTrack?.slug,
    };
  });

  return (
    <StudentDashboardView
      userName={user.name || "يا بطل"}
      totalXp={totalXp}
      streak={streak}
      dailyPaceMinutes={user.dailyPaceMinutes || 15}
      weekDays={weekDays}
      activeTrack={activeTrack}
      inProgressTracks={inProgressTracks}
      tiles={tiles}
      paidOrder={paidOrder}
      hasCompletions={completionsRaw.length > 0}
    />
  );
}
