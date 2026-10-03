import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getCareerPathBySlug,
  getAllCareerPaths,
} from "@/content/career-paths";
import CareerPathsHeader from "@/components/CareerPathsHeader";
import CareerPathDetailView from "@/components/CareerPathDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cp = getCareerPathBySlug(slug);
  if (!cp) return {};

  return {
    title: `${cp.titleAr} | خارطة طريق طوّرني`,
    description: `${cp.taglineAr} - ${cp.descriptionAr}`,
    alternates: {
      canonical: `/career-paths/${cp.slug}`,
    },
    openGraph: {
      title: `${cp.titleAr} | ${cp.titleEn}`,
      description: cp.taglineAr,
      url: `https://tawwerni.com/career-paths/${cp.slug}`,
      type: "article",
    },
  };
}

export default async function CareerPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const careerPath = getCareerPathBySlug(slug);
  if (!careerPath) notFound();

  const user = await getCurrentUser();
  const allPaths = getAllCareerPaths();

  // Find related paths (different path, matching goal or complementary)
  const relatedCareerPaths = allPaths
    .filter((p) => p.slug !== careerPath.slug)
    .filter(
      (p) =>
        p.goalCategory === careerPath.goalCategory ||
        p.featured
    )
    .slice(0, 3);

  let completedLessonIds: string[] = [];
  if (user) {
    try {
      const completions = await prisma.lessonCompletion.findMany({
        where: { userId: user.id },
        select: { lessonId: true },
      });
      completedLessonIds = completions.map((c) => c.lessonId);
    } catch {
      completedLessonIds = [];
    }
  }

  // Educational program JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: careerPath.titleAr,
    alternateName: careerPath.titleEn,
    description: careerPath.descriptionAr,
    occupationalCategory: careerPath.targetRoleAr,
    timeToComplete: `PT${careerPath.estimatedHours}H`,
    provider: {
      "@type": "Organization",
      name: "Tawwerni",
      url: "https://tawwerni.com",
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col transition-colors relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CareerPathsHeader isLoggedIn={!!user} />

      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 flex-1">
        <CareerPathDetailView
          careerPath={careerPath}
          userCompletedLessonIds={completedLessonIds}
          isLoggedIn={!!user}
          relatedCareerPaths={relatedCareerPaths}
        />
      </main>
    </div>
  );
}
