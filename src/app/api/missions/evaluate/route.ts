import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { getSessionUserId, getCurrentUser } from "@/lib/auth";
import { hasCourseAccess, FREE_PREVIEW_DAY } from "@/lib/access";
import { loadMission } from "@/lib/mission-adapter";
import { evaluateMissionSubmission } from "@/lib/mission-evaluator";
import { ensureDbCourse } from "@/lib/db-course";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "لازم تسجل دخول أولاً" }, { status: 401 });
  }

  const user = await getCurrentUser();
  const body = await readJson(request);
  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const submissionText = typeof body.submissionText === "string" ? body.submissionText.trim() : "";
  const dayNumber = typeof body.dayNumber === "number" ? body.dayNumber : Number(body.dayNumber);

  if (!slug || isNaN(dayNumber) || dayNumber < 1) {
    return NextResponse.json({ error: "بيانات المهمة غير صالحة" }, { status: 400 });
  }

  const mission = loadMission(slug, dayNumber);
  if (!mission) {
    return NextResponse.json({ error: "المهمة غير موجودة" }, { status: 404 });
  }

  // Ensure database course exists for relations
  const dbCourse = await ensureDbCourse(slug);
  const courseId = dbCourse ? dbCourse.id : slug;

  // Access check
  if (dayNumber !== FREE_PREVIEW_DAY && !(await hasCourseAccess(userId, courseId))) {
    return NextResponse.json({ error: "المسار مش مفعّل على حسابك" }, { status: 403 });
  }

  // Evaluate submission
  const evaluation = await evaluateMissionSubmission(mission, submissionText, user?.email);

  // If passed, record completion in LessonCompletion to maintain backward compatibility!
  if (evaluation.passed) {
    try {
      const lessonId = `les-${slug}-${dayNumber}`;

      // Check if module exists or find lesson
      let lesson = await prisma.lesson.findFirst({
        where: { id: lessonId },
      });

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
      }
    } catch (e) {
      console.error("Failed to sync mission completion with legacy table:", e);
    }
  }

  return NextResponse.json({
    ok: true,
    evaluation,
  });
}
