import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, getCurrentUser } from "@/lib/auth";
import { hasCourseAccess, FREE_PREVIEW_DAY } from "@/lib/access";
import { loadMission } from "@/lib/mission-adapter";
import { evaluateMissionSubmission } from "@/lib/mission-evaluator";
import { ensureDbCourse } from "@/lib/db-course";
import { loadUniversalLesson } from "@/lib/course-loader";
import { computeStreak } from "@/lib/xp";
import { badgeDefs } from "@/content/badges";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  const user = userId ? await getCurrentUser() : null;
  const body = await readJson(request);
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const submissionText = typeof body.submissionText === "string" ? body.submissionText.trim() : "";
  const dayNumber = typeof body.dayNumber === "number" ? body.dayNumber : Number(body.dayNumber);

  if (!slug || isNaN(dayNumber) || dayNumber < 1) {
    return NextResponse.json({ error: "بيانات المهمة غير صالحة" }, { status: 400 });
  }

  // Day 1 is 100% free with zero login or payment barrier.
  // Day 2+ requires account authentication and active access.
  if (!userId && dayNumber !== FREE_PREVIEW_DAY) {
    return NextResponse.json({ error: "لازم تسجل دخول أولاً" }, { status: 401 });
  }

  const mission = loadMission(slug, dayNumber);
  if (!mission) {
    return NextResponse.json({ error: "المهمة غير موجودة" }, { status: 404 });
  }

  // Ensure database course exists for relations
  const dbCourse = await ensureDbCourse(slug);
  const courseId = dbCourse ? dbCourse.id : slug;

  // Access check
  if (dayNumber !== FREE_PREVIEW_DAY && (!userId || !(await hasCourseAccess(userId, courseId)))) {
    return NextResponse.json({ error: "المسار مش مفعّل على حسابك" }, { status: 403 });
  }

  // Evaluate submission
  const evaluation = await evaluateMissionSubmission(mission, submissionText, user?.email);

  let totalXp = evaluation.passed ? 50 : 0;
  let streak = 1;
  const awardedBadges: { key: string; title: string; icon: string }[] = [];

  // If passed and user is logged in, record completion in LessonCompletion to maintain 100% backward compatibility
  if (evaluation.passed && userId) {
    try {
      const lessonId = `les-${slug}-${dayNumber}`;

      // Check if lesson exists in DB
      let lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { module: true },
      });

      // If not present in DB, synthesize Course, Module, and Lesson rows
      if (!lesson) {
        const universalData = loadUniversalLesson(slug, dayNumber);
        if (universalData) {
          const courseRow = await prisma.course.upsert({
            where: { slug: universalData.course.slug },
            update: {
              title: universalData.course.titleAr || universalData.course.title,
              totalLessons: universalData.course.totalLessons,
              totalXp: universalData.course.totalXp,
            },
            create: {
              id: universalData.course.id,
              slug: universalData.course.slug,
              title: universalData.course.titleAr || universalData.course.title,
              description: universalData.course.descriptionAr || universalData.course.description || "",
              icon: universalData.course.icon || "⚡",
              category: universalData.course.categoryAr || universalData.course.category || "عام",
              totalLessons: universalData.course.totalLessons,
              totalXp: universalData.course.totalXp,
              order: universalData.course.order ?? 0,
            },
          });

          const moduleRow = await prisma.module.upsert({
            where: { courseId_order: { courseId: courseRow.id, order: universalData.module.order ?? 0 } },
            update: {
              title: universalData.module.titleAr || universalData.module.title,
            },
            create: {
              id: universalData.module.id,
              courseId: courseRow.id,
              order: universalData.module.order ?? 0,
              title: universalData.module.titleAr || universalData.module.title,
              description: universalData.module.descriptionAr || universalData.module.description || "",
              icon: universalData.module.icon || "🧭",
            },
          });

          const lessonRow = await prisma.lesson.upsert({
            where: { moduleId_dayNumber: { moduleId: moduleRow.id, dayNumber: universalData.lesson.dayNumber } },
            update: {
              title: universalData.lesson.titleAr || universalData.lesson.title,
              xp: universalData.lesson.xp || mission.xpReward,
            },
            create: {
              id: universalData.lesson.id,
              moduleId: moduleRow.id,
              dayNumber: universalData.lesson.dayNumber,
              title: universalData.lesson.titleAr || universalData.lesson.title,
              durationMin: universalData.lesson.durationMin || mission.estimatedMinutes,
              xp: universalData.lesson.xp || mission.xpReward,
              order: universalData.lesson.order ?? 0,
              isCheckpoint: universalData.lesson.isCheckpoint ?? false,
            },
          });

          lesson = {
            ...lessonRow,
            module: { ...moduleRow, courseId: courseRow.id },
          };
        }
      }

      if (lesson) {
        await prisma.lessonCompletion.upsert({
          where: { userId_lessonId: { userId, lessonId: lesson.id } },
          update: {
            score: evaluation.score,
            totalQuestions: 100,
            xpEarned: evaluation.xpEarned,
          },
          create: {
            userId,
            lessonId: lesson.id,
            score: evaluation.score,
            totalQuestions: 100,
            xpEarned: evaluation.xpEarned,
          },
        });

        // Compute XP, Streak, and Badges
        const [completions, moduleLessons, courseLessons] = await Promise.all([
          prisma.lessonCompletion.findMany({
            where: { userId },
            select: { completedAt: true, xpEarned: true, lessonId: true },
          }),
          prisma.lesson.findMany({ where: { moduleId: lesson.moduleId }, select: { id: true } }),
          prisma.lesson.findMany({ where: { module: { courseId: lesson.module.courseId } }, select: { id: true } }),
        ]);

        totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);
        streak = computeStreak(completions.map((c) => c.completedAt));
        const completedLessonIds = new Set(completions.map((c) => c.lessonId));

        const newBadgeKeys: string[] = [];
        if (completions.length === 1) newBadgeKeys.push("first-step");
        if (evaluation.score >= 90) newBadgeKeys.push("perfect-score");

        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const last7DaysCount = completions.filter((c) => c.completedAt >= sevenDaysAgo).length;
        if (last7DaysCount >= 7) newBadgeKeys.push("week-warrior");

        if (streak >= 7) newBadgeKeys.push("on-fire");
        if (streak >= 30) newBadgeKeys.push("unstoppable");

        if (moduleLessons.length > 0 && moduleLessons.every((l) => completedLessonIds.has(l.id))) {
          newBadgeKeys.push("module-master");
        }
        if (courseLessons.length > 0 && courseLessons.every((l) => completedLessonIds.has(l.id))) {
          newBadgeKeys.push("course-graduate");
        }

        for (const key of newBadgeKeys) {
          const def = badgeDefs.find((b) => b.key === key);
          if (!def) continue;
          const badge = await prisma.badge.findUnique({ where: { key } });
          if (!badge) continue;
          const already = await prisma.userBadge.findUnique({
            where: { userId_badgeId: { userId, badgeId: badge.id } },
          });
          if (!already) {
            await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
            awardedBadges.push({ key: def.key, title: def.title, icon: def.icon });
          }
        }
      }
    } catch (e) {
      console.error("Failed to sync mission completion with legacy table:", e);
    }
  }

  return NextResponse.json({
    ok: true,
    evaluation,
    totalXp,
    streak,
    newBadges: awardedBadges,
  });
}
