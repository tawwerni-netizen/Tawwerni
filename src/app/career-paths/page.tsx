import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAllCareerPaths } from "@/content/career-paths";
import CareerPathsHeader from "@/components/CareerPathsHeader";
import CareerPathsCatalogView from "@/components/CareerPathsCatalogView";

export const metadata: Metadata = {
  title: "المسارات المهنية في طوّرني | Career Paths Roadmaps",
  description:
    "خرائط طريق مهنية موجهة نحو النتائج في البرمجة، التصميم، التسويق، العمل الحر، الذكاء الاصطناعي، وتحليل البيانات. تعلم بالترتيب، ابنِ مهارات حقيقية، وأنشئ بورتفوليو احترافي.",
  alternates: {
    canonical: "/career-paths",
  },
  openGraph: {
    title: "المسارات المهنية في طوّرني | Career Paths Roadmaps",
    description:
      "لا تسأل أي كورس أبدأ؟ حدد طموحك المهني واتبع خارطة طريق متسلسلة تأخذك حتى إثبات الكفاءة وسابقة الأعمال.",
    url: "https://tawwerni.com/career-paths",
    type: "website",
  },
};

export default async function CareerPathsPage() {
  const user = await getCurrentUser();
  const careerPaths = getAllCareerPaths();

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

  // Schema.org structured data for Educational Occupational Program
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: careerPaths.map((cp, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: cp.titleAr,
      description: cp.descriptionAr,
      url: `https://tawwerni.com/career-paths/${cp.slug}`,
    })),
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

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-10 flex-1">
        <CareerPathsCatalogView
          careerPaths={careerPaths}
          userCompletedLessonIds={completedLessonIds}
          isLoggedIn={!!user}
        />
      </main>
    </div>
  );
}
