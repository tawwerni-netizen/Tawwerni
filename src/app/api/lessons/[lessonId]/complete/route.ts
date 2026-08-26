import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { hasCourseAccess, FREE_PREVIEW_DAY } from "@/lib/access";
import { computeStreak } from "@/lib/xp";
import { badgeDefs } from "@/content/badges";

export async function POST(request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "لازم تسجل دخول" }, { status: 401 });

  const { lessonId } = await params;
  const body = await readJson(request);

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: true, quizQuestions: { select: { id: true } } },
  });
  if (!lesson) return NextResponse.json({ error: "الدرس مش موجود" }, { status: 404 });

  /*
   * The quiz result is client-reported, so it has to be bounded here.
   *
   * These went straight into the database unchecked, which meant a crafted
   * request could store `score: 999999` — and that number is what the
   * certificate averages into "متوسط الكويزات". `totalQuestions` is pinned to
   * the lesson's real question count rather than trusted from the body, and
   * the score is clamped into that range.
   */
  const totalQuestions = lesson.quizQuestions.length;
  const rawScore = Number(body.score);
  const score = Number.isFinite(rawScore)
    ? Math.min(Math.max(Math.round(rawScore), 0), totalQuestions)
    : 0;

  // Mirror the page-level gate so a locked day can't be completed via a direct call.
  if (
    lesson.dayNumber !== FREE_PREVIEW_DAY &&
    !(await hasCourseAccess(userId, lesson.module.courseId))
  ) {
    return NextResponse.json({ error: "المسار مش مفعّل على حسابك" }, { status: 403 });
  }

  const xpEarned = lesson.xp;

  await prisma.lessonCompletion.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { score, totalQuestions, xpEarned },
    create: { userId, lessonId, score, totalQuestions, xpEarned },
  });

  const [completions, moduleLessons, courseLessons] = await Promise.all([
    prisma.lessonCompletion.findMany({ where: { userId }, select: { completedAt: true, xpEarned: true, lessonId: true } }),
    prisma.lesson.findMany({ where: { moduleId: lesson.moduleId }, select: { id: true } }),
    prisma.lesson.findMany({ where: { module: { courseId: lesson.module.courseId } }, select: { id: true } }),
  ]);

  const totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));
  const completedLessonIds = new Set(completions.map((c) => c.lessonId));

  const newBadgeKeys: string[] = [];
  const isFirstEver = completions.length === 1;
  if (isFirstEver) newBadgeKeys.push("first-step");
  if (totalQuestions > 0 && score === totalQuestions) newBadgeKeys.push("perfect-score");

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const last7DaysCount = completions.filter((c) => c.completedAt >= sevenDaysAgo).length;
  if (last7DaysCount >= 7) newBadgeKeys.push("week-warrior");

  if (streak >= 7) newBadgeKeys.push("on-fire");
  if (streak >= 30) newBadgeKeys.push("unstoppable");

  if (moduleLessons.every((l) => completedLessonIds.has(l.id))) newBadgeKeys.push("module-master");
  if (courseLessons.every((l) => completedLessonIds.has(l.id))) newBadgeKeys.push("course-graduate");

  const awardedBadges: { key: string; title: string; icon: string }[] = [];
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

  return NextResponse.json({ ok: true, xpEarned, totalXp, streak, newBadges: awardedBadges });
}
