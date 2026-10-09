import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { resolveUserLearningProgress } from "@/lib/recent-learning-server";
import StudentTrackCatalog from "@/components/StudentTrackCatalog";
import ShareRow from "@/components/ShareRow";
import LearnHeader from "@/components/LearnHeader";

export default async function LearnPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [cookieStore, completions] = await Promise.all([
    cookies(),
    prisma.lessonCompletion
      .findMany({
        where: { userId: user.id },
        select: { lessonId: true },
      })
      .catch(() => []),
  ]);

  const { activeTrack, inProgressTracks } = await resolveUserLearningProgress(
    user.id,
    cookieStore
  );

  const completedTrackSlugs = inProgressTracks
    .filter((t) => t.doneCount >= t.totalDays)
    .map((t) => t.slug);
  const inProgressTrackSlugs = inProgressTracks.map((t) => t.slug);

  const resumeTrack = activeTrack
    ? {
        slug: activeTrack.slug,
        dayNumber: activeTrack.nextDayNumber,
        titleAr: activeTrack.titleAr,
        titleEn: activeTrack.titleEn,
        icon: activeTrack.icon,
        totalDays: activeTrack.totalDays,
        doneCount: activeTrack.doneCount,
        nextDayTitle: activeTrack.nextDayTitle,
        nextDayTitleEn: activeTrack.nextDayTitleEn,
      }
    : null;

  return (
    <div className="px-4 pt-7 sm:pt-9 pb-12 min-h-screen">
      <LearnHeader />

      <StudentTrackCatalog
        completedTrackSlugs={completedTrackSlugs}
        inProgressTrackSlugs={inProgressTrackSlugs}
        resumeTrack={resumeTrack}
      />

      <ShareRow className="mt-12" />
    </div>
  );
}
