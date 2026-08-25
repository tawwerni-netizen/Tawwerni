import { PrismaClient } from "../src/generated/prisma/client";
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

  // Replace the course tree wholesale so re-seeding stays idempotent.
  const existing = await prisma.course.findUnique({ where: { slug: meta.slug } });
  if (existing) {
    const lessons = await prisma.lesson.findMany({
      where: { module: { courseId: existing.id } },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);
    await prisma.quizQuestion.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.lessonCard.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.lessonCompletion.deleteMany({ where: { lessonId: { in: lessonIds } } });
    await prisma.lesson.deleteMany({ where: { module: { courseId: existing.id } } });
    await prisma.module.deleteMany({ where: { courseId: existing.id } });
  }

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

  for (let mi = 0; mi < def.modules.length; mi++) {
    const moduleContent = def.modules[mi];
    const dbModule = await prisma.module.create({
      data: {
        courseId: course.id,
        order: mi,
        title: moduleContent.title,
        description: moduleContent.description,
        icon: moduleContent.icon,
      },
    });

    for (let li = 0; li < moduleContent.lessons.length; li++) {
      const lessonContent = moduleContent.lessons[li];
      const dbLesson = await prisma.lesson.create({
        data: {
          moduleId: dbModule.id,
          dayNumber: lessonContent.day,
          title: lessonContent.title,
          durationMin: lessonContent.durationMin,
          xp: lessonContent.xp,
          order: li,
          isCheckpoint: lessonContent.isCheckpoint ?? false,
        },
      });

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
  }

  console.log(`  ✓ ${meta.title} — ${totalLessons} درس، ${totalXp} XP`);
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
