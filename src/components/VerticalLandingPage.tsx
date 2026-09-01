import Link from "next/link";
import { getCourseBySlug, courseStats } from "@/content/courses";
import { brand, pricing, referral, referralsToBreakEven } from "@/content/brand";
import { LogoLink } from "@/components/Logo";
import LiveSeats from "@/components/LiveSeats";
import SocialLinks from "@/components/SocialLinks";

/**
 * The shared shell behind every audience-specific landing page (/ai,
 * /freelancing, /data, ...).
 *
 * Each page is real content for one specific visitor intent, not a copy of
 * the homepage — see the comment on the /ai page for why that distinction
 * matters. This component holds the structure every one of them shares
 * (hero, real course outcomes, honest pricing); what makes each page
 * different is the copy passed in, not a different layout.
 */
export default function VerticalLandingPage({
  courseSlug,
  eyebrow,
  headline,
  headlineAccent,
  subhead,
  primaryCta = "ابدأ التحدي الآن ←",
}: {
  courseSlug: string;
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  subhead: string;
  primaryCta?: string;
}) {
  const course = getCourseBySlug(courseSlug);
  const stats = course ? courseStats(course) : { totalLessons: 0, totalXp: 0 };

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
            {eyebrow}
          </span>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            {headline}
            <br />
            <span className="text-brand-600">{headlineAccent}</span>
          </h1>
          <p className="mx-auto mb-7 max-w-lg text-sm leading-relaxed text-neutral-500 md:text-base">
            {subhead}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/quiz" className="cta-buy px-9 py-4 text-sm">
              <span>{primaryCta}</span>
            </Link>
            <Link href="/login?signup=1" className="cta-ghost px-7 py-4 text-sm">
              جرّب اليوم الأول مجانًا
            </Link>
          </div>
          <p className="cta-note mt-4">من غير بطاقة بنكية · اليوم الأول مفتوح</p>
        </div>

        <LiveSeats className="mx-auto mb-14 max-w-sm" />

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

        <div className="mx-auto mb-14 max-w-md">
          <div className="price-card">
            <p className="mb-1 text-xs font-bold tracking-wide text-brand-700">اشتراك واحد</p>
            <div className="mb-2 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold">{pricing.priceEgp}</span>
              <span className="text-sm font-bold">ج.م</span>
            </div>
            <p className="mb-3 text-xs text-neutral-400">
              {stats.totalLessons > 0
                ? `وبيفتحلك كل المسارات التانية كمان، مش المسار ده بس (${stats.totalLessons} درس فيه لوحده)`
                : "وبيفتحلك كل المسارات التانية كمان، مش مسار واحد بس"}
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
