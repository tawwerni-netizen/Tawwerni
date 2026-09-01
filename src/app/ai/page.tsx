import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCourseBySlug, courseStats } from "@/content/courses";
import { brand, pricing, referral, referralsToBreakEven } from "@/content/brand";
import { LogoLink } from "@/components/Logo";
import LiveSeats from "@/components/LiveSeats";
import SocialLinks from "@/components/SocialLinks";

const AI_PILLARS = ["chatgpt", "claude", "ai-tools", "ai-jobs", "ai-business"];

export const metadata: Metadata = {
  title: "تعلّم الذكاء الاصطناعي بالعربي — عملي مش نظري",
  description:
    "مسار 28 يوم، 5 دقايق في اليوم، تتعلم فيه تستخدم الذكاء الاصطناعي في شغلك فعليًا. مش محاضرات — مهمة عملية كل يوم.",
  alternates: { canonical: "/ai" },
};

/**
 * The AI-specific landing page — not a copy of the homepage.
 *
 * The homepage sells the whole catalogue to someone who doesn't know what
 * they want yet. This page is for someone who searched or clicked an ad for
 * one specific thing — "AI" — and should see that one thing immediately: the
 * course, real articles about it, and nothing about the other eight tracks.
 */
export default async function AiLandingPage() {
  const course = getCourseBySlug("tahaddi-28-yawm");
  const stats = course ? courseStats(course) : { totalLessons: 0, totalXp: 0 };

  const articles = await prisma.article.findMany({
    where: { pillar: { in: AI_PILLARS }, status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 6,
    select: { slug: true, pillar: true, title: true, excerpt: true, icon: true },
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-2">
            <Link href="/login" className="tap px-2 py-2 text-xs text-neutral-500">
              دخول
            </Link>
            <Link href="/quiz" className="cta-buy px-5 py-2.5 text-xs">
              <span>ابدأ مجانًا</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <div className="mx-auto mb-6 max-w-xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs text-brand-800">
            🤖 {stats.totalLessons} درس · مهمة عملية كل يوم
          </span>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            تعلّم الذكاء الاصطناعي
            <br />
            <span className="text-brand-600">بالتطبيق، مش بالمشاهدة.</span>
          </h1>
          <p className="mx-auto mb-7 max-w-lg text-sm leading-relaxed text-neutral-500 md:text-base">
            28 يوم، 5 دقايق كل يوم، مهمة عملية واحدة تنفّذها بنفسك — تلخيص،
            كتابة، تحليل بيانات، أتمتة. مش محاضرات نظرية عن &ldquo;مستقبل
            الذكاء الاصطناعي&rdquo;.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/quiz" className="cta-buy px-9 py-4 text-sm">
              <span>ابدأ التحدي الآن ←</span>
            </Link>
            <Link href="/login?signup=1" className="cta-ghost px-7 py-4 text-sm">
              جرّب اليوم الأول مجانًا
            </Link>
          </div>
          <p className="cta-note mt-4">من غير بطاقة بنكية · اليوم الأول مفتوح</p>
        </div>

        <LiveSeats className="mx-auto mb-14 max-w-sm" />

        {/* What you'll actually be able to do */}
        {course && (
          <div className="mx-auto mb-14 max-w-2xl">
            <h2 className="mb-2 text-center text-xl font-bold md:text-2xl">
              بعد 28 يوم، تبقى تقدر تعمل إيه؟
            </h2>
            <p className="mx-auto mb-6 max-w-lg text-center text-sm leading-relaxed text-neutral-500">
              {course.meta.reality}
            </p>
            <ul className="outcome-list mx-auto max-w-md">
              {course.meta.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Real articles, not filler */}
        {articles.length > 0 && (
          <div className="mx-auto mb-14 max-w-2xl">
            <h2 className="mb-7 text-center text-xl font-bold md:text-2xl">
              اقرأ قبل ما تبدأ
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/hub/${a.pillar}/${a.slug}`}
                  className="rounded-2xl border border-black/5 bg-white p-4 transition hover:border-brand-400"
                >
                  <span className="mb-2 block text-xl" aria-hidden>
                    {a.icon}
                  </span>
                  <p className="mb-1 text-sm font-bold text-neutral-800">{a.title}</p>
                  <p className="text-xs leading-relaxed text-neutral-500">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="mx-auto mb-14 max-w-md">
          <div className="price-card">
            <p className="mb-1 text-xs font-bold tracking-wide text-brand-700">اشتراك واحد</p>
            <div className="mb-2 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold">{pricing.priceEgp}</span>
              <span className="text-sm font-bold">ج.م</span>
            </div>
            <p className="mb-3 text-xs text-neutral-400">
              وبيفتحلك كل المسارات التانية كمان، مش مسار الذكاء الاصطناعي بس
            </p>
            <p className="mb-4 rounded-xl bg-brand-50 px-3 py-2.5 text-xs leading-relaxed text-brand-900">
              <b>{referralsToBreakEven} أصحاب يشتركوا بلينكك = رجّعت فلوسك.</b>{" "}
              كل واحد بياخد {referral.commissionEgp} ج.م.
            </p>
            <Link href="/quiz" className="cta-buy w-full px-8 py-4 text-sm">
              <span>ابدأ التحدي ←</span>
            </Link>
            <p className="cta-note mt-3">اليوم الأول مجاني — جرّب قبل ما تدفع أي حاجة</p>
          </div>
        </div>

        <footer className="mt-12 border-t border-black/5 pt-8 text-center">
          <SocialLinks className="justify-center" />
          <p className="mt-4 text-[11px] text-neutral-400">
            {brand.name}
            <span className="text-neutral-300">.com</span> · كل الحقوق محفوظة
          </p>
        </footer>
      </main>
    </div>
  );
}
