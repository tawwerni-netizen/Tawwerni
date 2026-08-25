import type { CourseDefinition } from "./course-types";
import { aiCourse } from "./course-28-day-ai";
import { mindsetCourse } from "./course-mindset";
import { careerCourse } from "./course-career";
import { businessCourse } from "./course-business";
import { healthCourse } from "./course-health";

export const allCourses: CourseDefinition[] = [
  aiCourse,
  mindsetCourse,
  careerCourse,
  businessCourse,
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
