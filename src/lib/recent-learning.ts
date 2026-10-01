import { findTrackOrHandcrafted } from "@/lib/course-loader";

export function isValidCourseSlug(slug?: string | null): boolean {
  if (!slug) return false;
  const found = findTrackOrHandcrafted(slug);
  return Boolean(found.track || found.handcrafted);
}

export type RecentLearningInfo = {
  courseSlug: string;
  dayNumber: number;
  courseTitle: string;
  courseTitleEn?: string;
  lessonTitle: string;
  lessonTitleEn?: string;
  icon?: string;
  totalDays?: number;
  doneCount?: number;
  timestamp: number;
};

export type ActiveTrackData = {
  slug: string;
  title: string;
  titleAr: string;
  titleEn: string;
  icon?: string;
  totalDays: number;
  doneCount: number;
  nextDayNumber: number;
  nextDayTitle: string;
  nextDayTitleEn: string;
  nextDayDuration: number;
  nextDayXp: number;
};

export type InProgressTrackData = {
  slug: string;
  title: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  totalDays: number;
  doneCount: number;
  percent: number;
  nextDayNumber: number;
  nextDayTitle: string;
  nextDayTitleEn: string;
};

export const STORAGE_KEY = "tawwerni_last_learning";
export const COOKIE_COURSE_KEY = "tawwerni_last_course";
export const COOKIE_DAY_KEY = "tawwerni_last_day";

/**
 * Client-side helper to record the user's latest viewed course & day.
 */
export function recordRecentLearningClient(info: {
  courseSlug: string;
  dayNumber: number;
  courseTitle: string;
  courseTitleEn?: string;
  lessonTitle: string;
  lessonTitleEn?: string;
  icon?: string;
}) {
  if (typeof window === "undefined") return;
  try {
    const payload: RecentLearningInfo = {
      ...info,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    // Save cookies with 1 year expiration
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE_COURSE_KEY}=${encodeURIComponent(info.courseSlug)}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `${COOKIE_DAY_KEY}=${info.dayNumber}; path=/; max-age=${maxAge}; SameSite=Lax`;
  } catch {
    /* ignore storage errors */
  }
}

/**
 * Client-side helper to read the latest viewed course & day.
 */
export function getRecentLearningClient(): RecentLearningInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
