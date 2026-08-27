import type { CourseDefinition } from "./course-types";
import { aiCourse } from "./course-28-day-ai";
import { mindsetCourse } from "./course-mindset";
import { careerCourse } from "./course-career";
import { businessCourse } from "./course-business";
import { healthCourse } from "./course-health";
import { claudePmCourse } from "./course-claude-pm";
import { buildPlatformCourse } from "./course-build-platform";

/**
 * Catalogue order — this array position becomes `Course.order`, which is how
 * the courses are listed everywhere in the app.
 *
 * The sequence follows the learner outward from what they signed up for:
 * the AI challenge is where the quiz funnel lands, so it leads; the Claude
 * certificate is the obvious next step from it and used to be buried last
 * despite being the highest-value thing here. Career and business carry the
 * income promise. Mindset and health sit underneath all of it — they matter,
 * but nobody arrives for them first.
 */
export const allCourses: CourseDefinition[] = [
  buildPlatformCourse,
  aiCourse,
  claudePmCourse,
  careerCourse,
  businessCourse,
  mindsetCourse,
  healthCourse,
];

export function getCourseBySlug(slug: string) {
  return allCourses.find((c) => c.meta.slug === slug);
}

export function courseStats(course: CourseDefinition) {
  const lessons = course.modules.flatMap((m) => m.lessons);
  return {
    totalLessons: lessons.length,
    totalXp: lessons.reduce((s, l) => s + l.xp, 0),
  };
}
