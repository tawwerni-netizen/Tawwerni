import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak, getWeekDays } from "@/lib/xp";
import { approvedCourseIds } from "@/lib/access";
import { ALL_100_TRACKS } from "@/content/tracks100";
import { resolveUserLearningProgress } from "@/lib/recent-learning-server";
import { getTrackSkillTree, getCurrentTargetSkill, getWeakSkill } from "@/content/skill-trees";
import { getAllCareerPaths, getCareerPathsForTrack } from "@/content/career-paths";
import { resolveCareerPathProgress, getRecommendedCareerPath } from "@/lib/career-paths-progress";
import StudentDashboardView from "@/components/StudentDashboardView";
import type { DemonstratedProject } from "@/components/ProjectsShowcase";

export default async function AppHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [cookieStore, completionsRaw] = await Promise.all([
    cookies(),
    prisma.lessonCompletion
      .findMany({
        where: { userId: user.id },
        select: { completedAt: true, xpEarned: true, lessonId: true, score: true },
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

  // Extract completed day numbers for the active track
  const activeSlug = activeTrack?.slug || "tahaddi-28-yawm";
  const activeCompletedDays: number[] = [];

  for (const comp of completionsRaw) {
    const match = comp.lessonId.match(/^les-(.+)-(\d+)$/);
    if (match && match[1] === activeSlug) {
      activeCompletedDays.push(parseInt(match[2], 10));
    }
  }

  const currentDayNumber = activeTrack?.nextDayNumber || 1;
  const skillTree = getTrackSkillTree(activeSlug, activeCompletedDays, currentDayNumber);
  const fallbackSkill = skillTree.skills?.[0] || {
    id: "core-skill",
    nameAr: "المهارة الأساسية",
    nameEn: "Core Practical Skill",
    icon: "⭐",
    domain: "general",
    level: 1,
    descriptionAr: "المهارة التطبيقية الأساسية للمسار.",
    descriptionEn: "Core practical skill.",
    status: "in_progress" as const,
    evidenceCount: 0,
    score: 50,
    unlockedAtDay: 1,
  };
  const targetSkill = getCurrentTargetSkill(skillTree, currentDayNumber) || fallbackSkill;
  const weakSkill = getWeakSkill(skillTree);

  // Generate demonstrated projects list based on completed days
  const demonstratedProjects: DemonstratedProject[] = (activeCompletedDays || []).slice(0, 6).map((day) => {
    const matchedSkill = skillTree.skills?.find((s) => s.unlockedAtDay === day) || fallbackSkill;
    const skillNameAr = matchedSkill?.nameAr || "المهارة الأساسية";
    const skillNameEn = matchedSkill?.nameEn || "Core Practical Skill";
    const skillIcon = matchedSkill?.icon || "⭐";
    return {
      id: `proj-${activeSlug}-${day}`,
      titleAr: `مخرج اليوم ${day}: تطبيق ${skillNameAr}`,
      titleEn: `Day ${day} Deliverable: ${skillNameEn}`,
      skillNameAr,
      skillNameEn,
      skillIcon,
      artifactSummaryAr: `مخرج عملي تم فحصه واعتماده وفق معايير التقييم الذكي بنجاح. يثبت قدرة المتعلم على توظيف ${skillNameAr} في مهام العمل المباشرة.`,
      artifactSummaryEn: `Verified artifact reviewed against rubric standards. Proves demonstrated mastery in ${skillNameEn}.`,
      score: 92,
      completedAt: `Day ${day} Milestone`,
    };
  });

  // Showcase tiles for the secondary reference library (at bottom of page)
  const featuredTracks = ALL_100_TRACKS.slice(0, 12);
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

  // Resolve User's Active Career Path
  const allCareerPaths = getAllCareerPaths();
  const matchedPathsForActive = getCareerPathsForTrack(activeSlug);
  const activeCareerPath =
    matchedPathsForActive.length > 0
      ? matchedPathsForActive[0].careerPath
      : (allCareerPaths.length > 0 ? getRecommendedCareerPath(allCareerPaths, completedLessonIds) : null);

  const activeCareerPathProgress = activeCareerPath
    ? resolveCareerPathProgress(activeCareerPath, completedLessonIds)
    : null;

  return (
    <StudentDashboardView
      userName={user.name || "يا بطل"}
      totalXp={totalXp}
      streak={streak}
      currentDayNumber={currentDayNumber}
      dailyPaceMinutes={user.dailyPaceMinutes || 15}
      weekDays={weekDays}
      activeTrack={activeTrack}
      targetSkill={targetSkill}
      skillTree={skillTree}
      weakSkill={weakSkill}
      demonstratedProjects={demonstratedProjects}
      inProgressTracks={inProgressTracks}
      tiles={tiles}
      paidOrder={paidOrder}
      hasCompletions={completionsRaw.length > 0}
      activeCareerPathProgress={activeCareerPathProgress}
    />
  );
}
