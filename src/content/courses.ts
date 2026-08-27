import type { CourseDefinition } from "./course-types";
import { aiCourse } from "./course-28-day-ai";
import { mindsetCourse } from "./course-mindset";
import { careerCourse } from "./course-career";
import { businessCourse } from "./course-business";
import { healthCourse } from "./course-health";
import { claudePmCourse } from "./course-claude-pm";
import { buildPlatformCourse } from "./course-build-platform";
import { creativeDirectorCourse } from "./course-creative-director";
import { aiVideoYouCourse } from "./course-ai-video-you";

/**
 * Catalogue order — this array position becomes `Course.order`, which is how
 * the courses are listed everywhere in the app.
 *
 * The order is a marketing decision, not an alphabetical one. It answers, in
 * sequence, the questions a visitor actually asks:
 *
 *   1. `ebni-mansetak` — “can this really do something?” It is the proof: the
 *      platform they are looking at was built with it. Nothing else here earns
 *      attention that fast, and it is the only track a competitor cannot copy
 *      by rewriting the same self-improvement content.
 *   2. `tahaddi-28-yawm` — where the quiz funnel lands, and the broadest entry
 *      point for someone who is curious about AI but has no project yet.
 *   3. `kalod-modeer-ebdaay` — the natural next step: they built something, now
 *      it needs to look like a brand and stay fed with content.
 *   4. `enta-fi-ay-makan` — the most visually striking thing in the catalogue,
 *      and the one a short video can sell in twenty seconds. It sits here, not
 *      higher: it is the deepest of the four AI tracks, and leading with it
 *      would sell a technique to people who have not yet decided what to make.
 *   5. `claude-lel-mashroaat` — the certificate, and the highest-value track for
 *      anyone already employed.
 *   6. `bina-el-amal` — carries the income promise.
 *   7. `nomo-mehany` — career, for the same buyer at a different moment.
 *   8-9. Mindset and health sit underneath all of it. They matter, and the
 *      completion data may well be highest here — but nobody arrives for them
 *      first, and putting them near the top makes the catalogue read as generic
 *      self-help rather than something specific.
 */
export const allCourses: CourseDefinition[] = [
  buildPlatformCourse,
  aiCourse,
  creativeDirectorCourse,
  aiVideoYouCourse,
  claudePmCourse,
  businessCourse,
  careerCourse,
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
