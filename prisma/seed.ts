import { PrismaClient, type Prisma } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { allCourses, courseStats } from "../src/content/courses";
import { comingSoonCourses } from "../src/content/courses-catalog";
import { badgeDefs } from "../src/content/badges";
import type { CourseDefinition } from "../src/content/course-types";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function seedCourse(def: CourseDefinition, order: number) {
  const { totalLessons, totalXp } = courseStats(def);
  const { meta } = def;

  // Modules and lessons are updated in place, never dropped and rebuilt.
  //
  // Rebuilding them mints new lesson ids, and a LessonCompletion points at a
  // lesson id — so a wholesale replace silently erases every student's
  // progress. Content changes constantly after launch; progress must not.
  //
  // Cards and quiz questions carry no user data, so those are still replaced
  // wholesale per lesson. That is the cheap, safe half.
  const course = await prisma.course.upsert({
    where: { slug: meta.slug },
    update: {
      title: meta.title,
      description: meta.description,
      icon: meta.icon,
      category: meta.category,
      badge: meta.badge,
      level: meta.level,
      totalLessons,
      totalXp,
      isComingSoon: false,
      order,
    },
    create: {
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      icon: meta.icon,
      category: meta.category,
      badge: meta.badge,
      level: meta.level,
      totalLessons,
      totalXp,
      isComingSoon: false,
      order,
    },
  });

  const keptModuleIds: string[] = [];

  for (let mi = 0; mi < def.modules.length; mi++) {
    const moduleContent = def.modules[mi];
    const moduleData = {
      title: moduleContent.title,
      description: moduleContent.description,
      icon: moduleContent.icon,
    };
    const dbModule = await prisma.module.upsert({
      where: { courseId_order: { courseId: course.id, order: mi } },
      update: moduleData,
      create: { courseId: course.id, order: mi, ...moduleData },
    });
    keptModuleIds.push(dbModule.id);

    const keptLessonIds: string[] = [];

    for (let li = 0; li < moduleContent.lessons.length; li++) {
      const lessonContent = moduleContent.lessons[li];
      const lessonData = {
        title: lessonContent.title,
        durationMin: lessonContent.durationMin,
        xp: lessonContent.xp,
        order: li,
        isCheckpoint: lessonContent.isCheckpoint ?? false,
      };
      const dbLesson = await prisma.lesson.upsert({
        where: {
          moduleId_dayNumber: { moduleId: dbModule.id, dayNumber: lessonContent.day },
        },
        update: lessonData,
        create: { moduleId: dbModule.id, dayNumber: lessonContent.day, ...lessonData },
      });
      keptLessonIds.push(dbLesson.id);

      // Wipe this lesson's content rows so re-seeding stays idempotent. Safe:
      // neither table holds anything the student created.
      await prisma.lessonCard.deleteMany({ where: { lessonId: dbLesson.id } });
      await prisma.quizQuestion.deleteMany({ where: { lessonId: dbLesson.id } });

      for (let ci = 0; ci < lessonContent.cards.length; ci++) {
        const card = lessonContent.cards[ci];
        await prisma.lessonCard.create({
          data: {
            lessonId: dbLesson.id,
            order: ci,
            type: "info",
            heading: card.heading,
            body: JSON.stringify({ lines: card.lines, tools: card.tools ?? [] }),
          },
        });
      }

      await prisma.lessonCard.create({
        data: {
          lessonId: dbLesson.id,
          order: lessonContent.cards.length,
          type: "task",
          heading: "مهمتك النهاردة",
          body: JSON.stringify(lessonContent.task),
        },
      });

      for (let qi = 0; qi < lessonContent.quiz.length; qi++) {
        const q = lessonContent.quiz[qi];
        await prisma.quizQuestion.create({
          data: {
            lessonId: dbLesson.id,
            order: qi,
            type: q.type,
            question: q.question,
            options: JSON.stringify(q.options),
            correctIndex: q.correctIndex,
            explanation: q.explanation,
          },
        });
      }
    }

    // A day that no longer exists in the content has to go, and its progress
    // with it — there is nothing left to have made progress on. This is the
    // only path that deletes a completion, and it only fires when a course
    // actually shrinks.
    await dropLessons({ moduleId: dbModule.id, id: { notIn: keptLessonIds } });
  }

  await dropLessons({ module: { courseId: course.id, id: { notIn: keptModuleIds } } });
  await prisma.module.deleteMany({ where: { courseId: course.id, id: { notIn: keptModuleIds } } });

  console.log(`  ✓ ${meta.title} — ${totalLessons} درس، ${totalXp} XP`);
}

/** Removes lessons and everything that references them, children first. */
async function dropLessons(where: Prisma.LessonWhereInput) {
  const doomed = await prisma.lesson.findMany({ where, select: { id: true } });
  if (!doomed.length) return;

  const ids = doomed.map((l) => l.id);
  await prisma.quizQuestion.deleteMany({ where: { lessonId: { in: ids } } });
  await prisma.lessonCard.deleteMany({ where: { lessonId: { in: ids } } });
  await prisma.lessonCompletion.deleteMany({ where: { lessonId: { in: ids } } });
  await prisma.lesson.deleteMany({ where: { id: { in: ids } } });
  console.log(`    · اتشال ${ids.length} درس مابقاش موجود في المحتوى`);
}

async function main() {
  console.log("Seeding badges...");
  for (const badge of badgeDefs) {
    await prisma.badge.upsert({
      where: { key: badge.key },
      update: { title: badge.title, description: badge.description, icon: badge.icon },
      create: badge,
    });
  }

  console.log(`Seeding ${allCourses.length} full courses...`);
  for (let i = 0; i < allCourses.length; i++) {
    await seedCourse(allCourses[i], i);
  }

  // Drop every placeholder course. An empty card on the catalogue reads as an
  // unfinished product; better to show fewer tracks that are all real.
  await prisma.course.deleteMany({ where: { isComingSoon: true } });

  const liveSlugs = new Set(allCourses.map((c) => c.meta.slug));
  const remaining = comingSoonCourses.filter((c) => !liveSlugs.has(c.slug));

  if (remaining.length) {
    console.log(`Seeding ${remaining.length} coming-soon courses...`);
    for (let i = 0; i < remaining.length; i++) {
      const c = remaining[i];
      const data = {
        title: c.title,
        description: c.description,
        icon: c.icon,
        category: c.category,
        badge: c.badge,
        level: c.level,
        totalLessons: c.totalLessons,
        totalXp: c.totalXp,
        isComingSoon: true,
        order: allCourses.length + i,
      };
      await prisma.course.upsert({
        where: { slug: c.slug },
        update: data,
        create: { slug: c.slug, ...data },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
