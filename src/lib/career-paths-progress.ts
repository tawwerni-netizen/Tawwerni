import { CareerPath, CareerPathStage, CareerPathTrackRef } from "@/content/career-paths";
import { ALL_100_TRACKS, Track100, getTrackBySlug } from "@/content/tracks100";

export type ResolvedTrackProgress = {
  trackSlug: string;
  track: Track100 | null;
  trackRef: CareerPathTrackRef;
  totalLessons: number;
  completedLessonsCount: number;
  isCompleted: boolean;
  isStarted: boolean;
  isCurrent: boolean;
  percent: number;
  nextDayNumber: number;
};

export type ResolvedStageProgress = {
  stage: CareerPathStage;
  stageId: string;
  isCompleted: boolean;
  isCurrent: boolean;
  completedTracksCount: number;
  totalTracksCount: number;
  tracks: ResolvedTrackProgress[];
};

export type ResolvedCareerPathProgress = {
  careerPath: CareerPath;
  totalTracksCount: number;
  completedTracksCount: number;
  totalLessonsCount: number;
  completedLessonsCount: number;
  percent: number;
  isFullyCompleted: boolean;
  currentStage: ResolvedStageProgress | null;
  nextActionableTrack: ResolvedTrackProgress | null;
  stagesProgress: ResolvedStageProgress[];
};

/**
 * Deterministically resolves career path progress given a career path and completed lesson IDs set.
 */
export function resolveCareerPathProgress(
  careerPath: CareerPath,
  completedLessonIds: Set<string> | string[]
): ResolvedCareerPathProgress {
  const completedSet = completedLessonIds instanceof Set ? completedLessonIds : new Set(completedLessonIds);

  let totalTracksCount = 0;
  let completedTracksCount = 0;
  let totalLessonsCount = 0;
  let completedLessonsCount = 0;

  const stagesProgress: ResolvedStageProgress[] = [];
  let nextActionableTrack: ResolvedTrackProgress | null = null;
  let currentStageFound = false;

  for (const stage of careerPath.stages) {
    const stageTracks: ResolvedTrackProgress[] = [];
    let stageCompletedTracks = 0;

    for (const trackRef of stage.tracks) {
      totalTracksCount++;
      const track = getTrackBySlug(trackRef.trackSlug) ?? null;
      const totalLessons = track?.totalLessons ?? 20;
      totalLessonsCount += totalLessons;

      let trackCompletedCount = 0;
      let firstUncompletedDay = 1;
      let foundUncompleted = false;

      for (let day = 1; day <= totalLessons; day++) {
        const lessonId = `les-${trackRef.trackSlug}-${day}`;
        if (completedSet.has(lessonId)) {
          trackCompletedCount++;
        } else if (!foundUncompleted) {
          firstUncompletedDay = day;
          foundUncompleted = true;
        }
      }

      completedLessonsCount += trackCompletedCount;
      const isCompleted = trackCompletedCount >= totalLessons;
      const isStarted = trackCompletedCount > 0;
      const percent = totalLessons > 0 ? Math.round((trackCompletedCount / totalLessons) * 100) : 0;

      if (isCompleted) {
        stageCompletedTracks++;
        completedTracksCount++;
      }

      const isCurrent = !isCompleted && !nextActionableTrack;

      const trackProgress: ResolvedTrackProgress = {
        trackSlug: trackRef.trackSlug,
        track,
        trackRef,
        totalLessons,
        completedLessonsCount: trackCompletedCount,
        isCompleted,
        isStarted,
        isCurrent,
        percent,
        nextDayNumber: isCompleted ? totalLessons : firstUncompletedDay,
      };

      if (!isCompleted && !nextActionableTrack) {
        nextActionableTrack = trackProgress;
      }

      stageTracks.push(trackProgress);
    }

    const isStageCompleted = stageCompletedTracks === stage.tracks.length && stage.tracks.length > 0;
    const isStageCurrent = !isStageCompleted && !currentStageFound;
    if (isStageCurrent) {
      currentStageFound = true;
    }

    stagesProgress.push({
      stage,
      stageId: stage.id,
      isCompleted: isStageCompleted,
      isCurrent: isStageCurrent,
      completedTracksCount: stageCompletedTracks,
      totalTracksCount: stage.tracks.length,
      tracks: stageTracks,
    });
  }

  const overallPercent =
    totalLessonsCount > 0 ? Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100)) : 0;

  const currentStage = stagesProgress.find((s) => s.isCurrent) || stagesProgress[0] || null;
  const isFullyCompleted = completedTracksCount === totalTracksCount && totalTracksCount > 0;

  return {
    careerPath,
    totalTracksCount,
    completedTracksCount,
    totalLessonsCount,
    completedLessonsCount,
    percent: overallPercent,
    isFullyCompleted,
    currentStage,
    nextActionableTrack,
    stagesProgress,
  };
}

/**
 * Finds the top recommended career path for a user based on their active/recent tracks and completion counts.
 */
export function getRecommendedCareerPath(
  careerPaths: CareerPath[],
  completedLessonIds: Set<string> | string[]
): CareerPath {
  const completedSet = completedLessonIds instanceof Set ? completedLessonIds : new Set(completedLessonIds);

  if (completedSet.size === 0) {
    return careerPaths[0]; // Default to first featured
  }

  let bestPath = careerPaths[0];
  let maxScore = -1;

  for (const cp of careerPaths) {
    let score = 0;
    for (const stage of cp.stages) {
      for (const t of stage.tracks) {
        // Check how many lessons are done in this track
        for (let day = 1; day <= 28; day++) {
          if (completedSet.has(`les-${t.trackSlug}-${day}`)) {
            score++;
          }
        }
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestPath = cp;
    }
  }

  return bestPath;
}
