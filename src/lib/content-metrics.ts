import { ALL_100_TRACKS } from "@/content/tracks100";
import { getAllCareerPaths } from "@/content/career-paths";
import { LEGAL_CONTRACTS, TOTAL_PROMPTS_COUNT } from "@/content/vip-vault-data";

/**
 * Single Canonical Source of Truth for Platform Content Counts
 * (Tawwerni V4.7 Requirement 07 & 08)
 *
 * Derived dynamically from canonical content arrays.
 * Never hardcode these totals across marketing/checkout components.
 */

export const TRACK_COUNT = ALL_100_TRACKS.length; // 100
export const CAREER_PATH_COUNT = getAllCareerPaths().length; // 12
export const LESSON_COUNT = ALL_100_TRACKS.reduce((sum, t) => sum + t.totalLessons, 0); // 2,181
export const MISSION_COUNT = LESSON_COUNT; // 2,181 practical missions (1 per lesson)
export const QUIZ_COUNT = LESSON_COUNT; // 2,181 checkpoint quizzes (1 per lesson)
export const PROMPT_COUNT = TOTAL_PROMPTS_COUNT; // 10,000 executive prompt templates
export const CONTRACT_COUNT = LEGAL_CONTRACTS.length; // 5 legal contracts

export const CONTENT_METRICS = {
  tracks: TRACK_COUNT,
  careerPaths: CAREER_PATH_COUNT,
  lessons: LESSON_COUNT,
  missions: MISSION_COUNT,
  quizzes: QUIZ_COUNT,
  prompts: PROMPT_COUNT,
  contracts: CONTRACT_COUNT,
} as const;

export const FORMATTED_METRICS = {
  tracks: `${TRACK_COUNT}`,
  careerPaths: `${CAREER_PATH_COUNT}`,
  lessons: `${LESSON_COUNT.toLocaleString()}`,
  lessonsPlus: `${LESSON_COUNT.toLocaleString()}+`,
  missions: `${MISSION_COUNT.toLocaleString()}`,
  quizzes: `${QUIZ_COUNT.toLocaleString()}`,
  prompts: `${PROMPT_COUNT.toLocaleString()}`,
  promptsPlus: `+${PROMPT_COUNT.toLocaleString()}`,
  contracts: `${CONTRACT_COUNT}`,
} as const;
