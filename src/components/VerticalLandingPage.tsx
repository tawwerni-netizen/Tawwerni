"use client";

import Link from "next/link";
import { loadUniversalCourse } from "@/lib/course-loader";
import { brand, pricing, referral, referralsToBreakEven } from "@/content/brand";
import { LogoLink } from "@/components/Logo";
import LiveSeats from "@/components/LiveSeats";
import SocialLinks from "@/components/SocialLinks";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function VerticalLandingPage({
  courseSlug,
  eyebrow,
  eyebrowEn,
  headline,
  headlineEn,
  headlineAccent,
  headlineAccentEn,
  subhead,
  subheadEn,
  primaryCta = "ابدأ التحدي الآن ←",
  primaryCtaEn = "Start The Challenge Now →",
}: {
  courseSlug: string;
  eyebrow: string;
  eyebrowEn?: string;
  headline: string;
  headlineEn?: string;
  headlineAccent: string;
  headlineAccentEn?: string;
  subhead: string;
  subheadEn?: string;
  primaryCta?: string;
  primaryCtaEn?: string;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const course = loadUniversalCourse(courseSlug);
  const totalLessons = course?.totalLessons ?? 28;

  const displayEyebrow = isEn
    ? (eyebrowEn ?? `🌟 ${totalLessons} Days · Practical Hands-on Track`)
    : eyebrow;
  const displayHeadline = isEn
    ? (headlineEn ?? `Master ${course?.titleEn ?? "Future Skills"}`)
    : headline;
  const displayHeadlineAccent = isEn
    ? (headlineAccentEn ?? "Through Action, Not Passive Watching.")
    : headlineAccent;
  const displaySubhead = isEn
    ? (subheadEn ?? (course?.descriptionEn ?? "Daily micro-lessons designed to build tangible, monetizable capabilities in just 5-15 minutes a day."))
    : subhead;
  const displayPrimaryCta = isEn ? primaryCtaEn : primaryCta;

  const displayReality = isEn ? course?.realityEn : course?.realityAr;
  const displayOutcomes = (isEn ? course?.outcomesEn : course?.outcomesAr) ?? [];

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors"
    >
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="tap px-2.5 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {isEn ? "Sign In" : "دخول"}
            </Link>
            <Link href="/quiz" className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition-all">
              <span>{isEn ? "Start Free" : "ابدأ مجانًا"}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <div className="mx-auto mb-6 max-w-xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 px-3.5 py-1.5 text-xs font-bold text-teal-800 dark:text-teal-300">
            {displayEyebrow}
          </span>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight md:text-5xl text-neutral-900 dark:text-white">
            {displayHeadline}
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
              {displayHeadlineAccent}
            </span>
          </h1>
          <p className="mx-auto mb-7 max-w-lg text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
            {displaySubhead}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/quiz"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-9 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/20 hover:brightness-110 active:scale-98 transition-all"
            >
              <span>{displayPrimaryCta}</span>
            </Link>
            <Link
              href="/login?signup=1"
              className="w-full sm:w-auto rounded-full border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-7 py-3.5 text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-98 transition-all"
            >
              {isEn ? "Try Day 1 Free" : "جرّب اليوم الأول مجانًا"}
            </Link>
          </div>
          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            {isEn ? "No credit card required · Day 1 is 100% unlocked" : "من غير بطاقة بنكية · اليوم الأول مفتوح"}
          </p>
        </div>

        <LiveSeats className="mx-auto mb-14 max-w-sm" />

        {course && (
          <div className="mx-auto mb-14 max-w-2xl rounded-3xl border border-black/5 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs">
            <h2 className="mb-2 text-center text-xl font-bold md:text-2xl text-neutral-900 dark:text-white">
              {isEn ? `What can you actually do after ${totalLessons} days?` : `بعد ${totalLessons} يوم، تبقى تقدر تعمل إيه؟`}
            </h2>
            {displayReality && (
              <p className="mx-auto mb-6 max-w-lg text-center text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                {displayReality}
              </p>
            )}
            <ul className="space-y-2.5 max-w-md mx-auto">
              {displayOutcomes.map((o, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0">✓</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mx-auto mb-14 max-w-md">
          <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-br from-white to-teal-50/20 dark:from-neutral-900 dark:to-neutral-900 p-6 text-center shadow-lg">
            <p className="mb-1 text-xs font-bold tracking-wide text-teal-700 dark:text-teal-400">
              {isEn ? "All-Inclusive 1-Year Access" : "اشتراك واحد شامل"}
            </p>
            <div className="mb-2 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black font-mono text-neutral-900 dark:text-white" dir="ltr">{pricing.priceEgp}</span>
              <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{isEn ? "EGP" : "ج.م"}</span>
            </div>
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {isEn
                ? `Unlocks all ${totalLessons} lessons in this track + all other 99 professional tracks for life.`
                : `وبيفتحلك كل المسارات التانية كمان (${totalLessons} درس في هذا المسار لوحده)`}
            </p>
            <p className="mb-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3 text-xs leading-relaxed text-teal-900 dark:text-teal-200">
              {isEn ? (
                <>
                  <b>{referralsToBreakEven} friends join via your link = 100% of your fee back.</b> Earn {referral.commissionEgp} EGP per referral.
                </>
              ) : (
                <>
                  <b>{referralsToBreakEven} أصحاب يشتركوا بلينكك = رجّعت فلوسك.</b> كل واحد بياخد {referral.commissionEgp} ج.م.
                </>
              )}
            </p>
            <Link
              href="/quiz"
              className="block w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all"
            >
              <span>{isEn ? "Start The Challenge →" : "ابدأ التحدي ←"}</span>
            </Link>
            <p className="mt-3 text-xs text-neutral-400">
              {isEn ? "Day 1 is completely free — test it before any commitment" : "اليوم الأول مجاني — جرّب قبل ما تدفع أي حاجة"}
            </p>
          </div>
        </div>

        <footer className="mt-12 border-t border-black/5 dark:border-neutral-800 pt-8 text-center">
          <SocialLinks className="justify-center" />
          <p className="mt-4 text-xs text-neutral-400">
            {isEn ? brand.nameEn : brand.name}
            <span className="text-neutral-300">.com</span> · {isEn ? "All Rights Reserved" : "كل الحقوق محفوظة"}
          </p>
        </footer>
      </main>
    </div>
  );
}
