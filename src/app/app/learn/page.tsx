import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import StudentTrackCatalog from "@/components/StudentTrackCatalog";
import ShareRow from "@/components/ShareRow";
import FocusPlayer from "@/components/FocusPlayer";

import LearnHeader from "@/components/LearnHeader";

export default async function LearnPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let completions: Array<{ lesson: { module: { course: { slug: string } } } }> = [];
  try {
    completions = await prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: {
                  select: { slug: true },
                },
              },
            },
          },
        },
      },
    });
  } catch {
    /* fallback when offline */
  }

  const completedTrackSlugs = Array.from(
    new Set(completions.map((c) => c.lesson.module.course.slug).filter(Boolean))
  );

  return (
    <div className="px-4 pt-5 pb-8 min-h-screen">
      <FocusPlayer />

      <LearnHeader />

      <StudentTrackCatalog
        completedTrackSlugs={completedTrackSlugs}
        inProgressTrackSlugs={completedTrackSlugs}
      />

      <ShareRow
        className="mt-12"
        title="عجبك المحتوى؟"
        note="شارك المنصة مع زملائك — واحصل على 75 ج.م عمولة كاش عن كل مشترك من رابطك."
      />
    </div>
  );
}
