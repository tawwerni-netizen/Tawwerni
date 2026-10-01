import { prisma } from "@/lib/prisma";
import { loadUniversalCourse } from "@/lib/course-loader";

/**
 * Ensures a user has a specified number of completed lessons in a course.
 * Automatically provisions the Course, Module, and Lesson records in MySQL if they do not yet exist,
 * and creates LessonCompletion records with realistic completion timestamps, XP, and badges.
 */
export async function backfillUserCourseProgress(
  emailOrUserId: string,
  courseSlug: string = "tahaddi-28-yawm",
  completedDayCount: number = 18
) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUserId.trim().toLowerCase() },
          { id: emailOrUserId.trim() },
        ],
      },
      include: {
        completions: {
          select: { lessonId: true },
        },
      },
    });

    if (!user) {
      return { success: false, error: "المستخدم غير موجود" };
    }

    const courseData = loadUniversalCourse(courseSlug);
    if (!courseData) {
      return { success: false, error: "المسار غير موجود" };
    }

    // 1. Ensure Course in DB
    const dbCourse = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {
        title: courseData.titleAr,
        totalLessons: courseData.totalLessons,
        totalXp: courseData.totalXp,
      },
      create: {
        id: courseData.id,
        slug: courseData.slug,
        title: courseData.titleAr,
        description: courseData.descriptionAr || "",
        icon: courseData.icon || "⚡",
        category: courseData.categoryAr || "عام",
        totalLessons: courseData.totalLessons,
        totalXp: courseData.totalXp,
        order: courseData.order ?? 0,
      },
    });

    const allLessons = courseData.modules.flatMap((m) => m.lessons);
    const targetLessons = allLessons.filter((l) => l.dayNumber <= completedDayCount);

    const existingLessonIds = new Set(user.completions.map((c) => c.lessonId));
    const now = new Date();
    let newCompletionsAdded = 0;

    // 2. Ensure Modules, Lessons, and Completions exist
    for (const l of targetLessons) {
      const parentModule = courseData.modules.find((m) =>
        m.lessons.some((ml) => ml.id === l.id)
      );
      if (!parentModule) continue;

      const dbModule = await prisma.module.upsert({
        where: { courseId_order: { courseId: dbCourse.id, order: parentModule.order } },
        update: { title: parentModule.titleAr },
        create: {
          id: parentModule.id,
          courseId: dbCourse.id,
          order: parentModule.order,
          title: parentModule.titleAr,
          description: parentModule.descriptionAr || "",
          icon: parentModule.icon || "🧭",
        },
      });

      const dbLesson = await prisma.lesson.upsert({
        where: { moduleId_dayNumber: { moduleId: dbModule.id, dayNumber: l.dayNumber } },
        update: { title: l.titleAr, xp: l.xp || 75 },
        create: {
          id: l.id,
          moduleId: dbModule.id,
          dayNumber: l.dayNumber,
          title: l.titleAr,
          durationMin: l.durationMin || 5,
          xp: l.xp || 75,
          order: l.order,
          isCheckpoint: l.isCheckpoint,
        },
      });

      if (!existingLessonIds.has(dbLesson.id)) {
        // Space out completion dates so user earns a solid streak
        const daysAgo = completedDayCount - l.dayNumber;
        const completedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        await prisma.lessonCompletion.upsert({
          where: { userId_lessonId: { userId: user.id, lessonId: dbLesson.id } },
          update: { score: 2, totalQuestions: 2, xpEarned: dbLesson.xp || 75, completedAt },
          create: {
            userId: user.id,
            lessonId: dbLesson.id,
            score: 2,
            totalQuestions: 2,
            xpEarned: dbLesson.xp || 75,
            completedAt,
          },
        });
        newCompletionsAdded++;
      }
    }

    // 3. Award Badges (first-step, week-warrior, on-fire)
    const badgeKeys = ["first-step", "week-warrior", "on-fire"];
    for (const key of badgeKeys) {
      try {
        const badge = await prisma.badge.findUnique({ where: { key } });
        if (badge) {
          await prisma.userBadge.upsert({
            where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
            update: {},
            create: { userId: user.id, badgeId: badge.id },
          });
        }
      } catch {
        /* ignore badge upsert issues */
      }
    }

    return {
      success: true,
      userId: user.id,
      email: user.email,
      courseSlug,
      creditedCount: completedDayCount,
      newCompletionsAdded,
    };
  } catch (err) {
    console.error("Error backfilling user progress:", err);
    return { success: false, error: String(err) };
  }
}
