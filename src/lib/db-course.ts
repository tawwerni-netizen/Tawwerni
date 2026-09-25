import { prisma } from "@/lib/prisma";
import { loadUniversalCourse } from "@/lib/course-loader";

/**
 * Ensures that a course exists in the Prisma database so that relations
 * (Orders, Certificates, Purchases, Testimonials) work reliably for all 100 courses.
 */
export async function ensureDbCourse(slug: string) {
  const existing = await prisma.course.findUnique({
    where: { slug },
    include: { modules: { include: { lessons: true } } },
  });

  if (existing) return existing;

  const uCourse = loadUniversalCourse(slug);
  if (!uCourse) return null;

  // Create course record and basic modules/lessons structure in DB
  const created = await prisma.course.create({
    data: {
      id: uCourse.id,
      slug: uCourse.slug,
      title: uCourse.titleAr,
      description: uCourse.descriptionAr,
      icon: uCourse.icon,
      category: uCourse.category,
      badge: uCourse.badge,
      level: uCourse.level,
      totalLessons: uCourse.totalLessons,
      totalXp: uCourse.totalXp,
      isComingSoon: false,
      order: 100,
      modules: {
        create: uCourse.modules.map((m, mIdx) => ({
          id: m.id,
          title: m.titleAr,
          description: m.descriptionAr,
          icon: m.icon,
          order: mIdx + 1,
          lessons: {
            create: m.lessons.map((l, lIdx) => ({
              id: l.id,
              dayNumber: l.dayNumber,
              title: l.titleAr,
              durationMin: l.durationMin,
              xp: l.xp,
              isCheckpoint: l.isCheckpoint ?? false,
              order: lIdx + 1,
            })),
          },
        })),
      },
    },
    include: { modules: { include: { lessons: true } } },
  });

  return created;
}
