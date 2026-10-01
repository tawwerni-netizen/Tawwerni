import { prisma } from "@/lib/prisma";
import { ALL_100_TRACKS } from "@/content/tracks100";
import { loadUniversalCourse, findTrackOrHandcrafted } from "@/lib/course-loader";
import {
  ActiveTrackData,
  InProgressTrackData,
  COOKIE_COURSE_KEY,
  COOKIE_DAY_KEY,
  isValidCourseSlug,
} from "./recent-learning";

/**
 * Server-side resolver to intelligently determine:
 * 1. The primary active track the user is learning (resolving from cookies and most recent DB completions).
 * 2. All in-progress tracks the user has started.
 */
export async function resolveUserLearningProgress(
  userId: string,
  cookieStore?: { get: (name: string) => { value: string } | undefined }
): Promise<{
  activeTrack: ActiveTrackData | null;
  inProgressTracks: InProgressTrackData[];
  completedLessonIds: Set<string>;
  totalCompletions: number;
}> {
  let completions: Array<{ lessonId: string; completedAt: Date; xpEarned: number }> = [];
  try {
    completions = await prisma.lessonCompletion.findMany({
      where: { userId },
      select: { lessonId: true, completedAt: true, xpEarned: true },
      orderBy: { completedAt: "desc" },
    });
  } catch {
    completions = [];
  }

  const completedLessonIds = new Set(completions.map((c) => c.lessonId));

  // Read cookies if available
  const cookieSlug = cookieStore?.get(COOKIE_COURSE_KEY)?.value;
  const cookieDay = Number(cookieStore?.get(COOKIE_DAY_KEY)?.value) || null;

  // Map completions to course slugs
  const courseCompletionsMap = new Map<string, Set<string>>();
  for (const comp of completions) {
    // Check standard lessonId pattern: les-[slug]-[day]
    const match = comp.lessonId.match(/^les-(.+)-(\d+)$/);
    if (match) {
      const slug = match[1];
      if (!courseCompletionsMap.has(slug)) {
        courseCompletionsMap.set(slug, new Set());
      }
      courseCompletionsMap.get(slug)!.add(comp.lessonId);
    }
  }

  // Find candidate slugs
  // Most recent completed course:
  let mostRecentCourseSlug: string | null = null;
  if (completions.length > 0) {
    for (const comp of completions) {
      const match = comp.lessonId.match(/^les-(.+)-(\d+)$/);
      if (match && isValidCourseSlug(match[1])) {
        mostRecentCourseSlug = match[1];
        break;
      }
    }
  }

  // Determine active track slug
  const defaultSlug = ALL_100_TRACKS[0]?.slug || "prompt-engineering-mastery";
  let targetSlug = defaultSlug;

  if (cookieSlug && isValidCourseSlug(cookieSlug)) {
    targetSlug = cookieSlug;
  } else if (mostRecentCourseSlug) {
    targetSlug = mostRecentCourseSlug;
  }

  const activeCourse = loadUniversalCourse(targetSlug);
  let activeTrack: ActiveTrackData | null = null;

  if (activeCourse) {
    const allLessons = activeCourse.modules.flatMap((m) => m.lessons);
    const doneCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;

    let nextLesson = null;
    if (cookieDay && cookieDay >= 1 && cookieDay <= allLessons.length) {
      const candidate = allLessons.find((l) => l.dayNumber === cookieDay);
      if (candidate && !completedLessonIds.has(candidate.id)) {
        nextLesson = candidate;
      }
    }
    if (!nextLesson) {
      nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id)) || allLessons[0];
    }

    activeTrack = {
      slug: activeCourse.slug,
      title: activeCourse.titleAr,
      titleAr: activeCourse.titleAr,
      titleEn: activeCourse.titleEn,
      icon: activeCourse.icon,
      totalDays: allLessons.length,
      doneCount,
      nextDayNumber: nextLesson?.dayNumber ?? 1,
      nextDayTitle: nextLesson?.titleAr || nextLesson?.title || `يوم ${nextLesson?.dayNumber ?? 1}`,
      nextDayTitleEn: nextLesson?.titleEn || `Day ${nextLesson?.dayNumber ?? 1}`,
      nextDayDuration: nextLesson?.durationMin || 5,
      nextDayXp: nextLesson?.xp || 75,
    };
  }

  // Calculate all in-progress courses
  const inProgressTracks: InProgressTrackData[] = [];
  const processedSlugs = new Set<string>();

  // If cookieSlug exists and differs from default, add it if not finished
  if (cookieSlug && activeCourse && activeTrack && activeTrack.doneCount < activeTrack.totalDays) {
    processedSlugs.add(cookieSlug);
  }

  // Iterate over all courses that have completions
  for (const [slug] of courseCompletionsMap.entries()) {
    if (processedSlugs.has(slug)) continue;
    processedSlugs.add(slug);

    const c = loadUniversalCourse(slug);
    if (!c) continue;

    const allLessons = c.modules.flatMap((m) => m.lessons);
    const doneCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;
    if (doneCount === 0) continue;

    const nextL = allLessons.find((l) => !completedLessonIds.has(l.id));
    if (!nextL) continue; // completed all lessons

    inProgressTracks.push({
      slug: c.slug,
      title: c.titleAr,
      titleAr: c.titleAr,
      titleEn: c.titleEn,
      icon: c.icon,
      totalDays: allLessons.length,
      doneCount,
      percent: Math.round((doneCount / allLessons.length) * 100),
      nextDayNumber: nextL.dayNumber,
      nextDayTitle: nextL.titleAr || nextL.title,
      nextDayTitleEn: nextL.titleEn || `Day ${nextL.dayNumber}`,
    });
  }

  return {
    activeTrack,
    inProgressTracks,
    completedLessonIds,
    totalCompletions: completions.length,
  };
}
