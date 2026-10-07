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
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-3.5 sm:px-5">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="tap px-2 sm:px-2.5 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shrink-0">
              {isEn ? "Sign In" : "دخول"}
            </Link>
            <Link href="/quiz" className="whitespace-nowrap shrink-0 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-md active:scale-95 transition-all">
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
            <span className="text-teal-600 dark:text-emerald-400 font-black">
              {displayHeadlineAccent}
            </span>
          </h1>
          <p className="mx-auto mb-7 max-w-lg text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-base">
            {displaySubhead}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={`/app/learn/${courseSlug}/1`}
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-9 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-500/20 hover:brightness-110 active:scale-98 transition-all text-center"
            >
              <span>{isEn ? "Try Day 1 Free →" : "جرّب اليوم الأول مجانًا ←"}</span>
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto rounded-full border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-7 py-3.5 text-sm font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-98 transition-all text-center"
            >
              {isEn ? "Discover Your Path" : "اعرف مسارك المناسب"}
            </Link>
          </div>
          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            {isEn ? "Immediate access · No credit card required · Day 1 is 100% unlocked" : "دخول فوري بدون بطاقة بنكية · اليوم الأول مفتوح مجانًا بالكامل"}
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
              {isEn ? "Individual Track · 1-Year Full Access" : "اشتراك لمدة عام كامل (365 يوماً)"}
            </p>
            <div className="mb-2 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black font-mono text-neutral-900 dark:text-white" dir="ltr">{pricing.trackPriceEgp}</span>
              <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">{isEn ? "EGP / Year" : "ج.م / سنة"}</span>
            </div>
            <p className="mb-3 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {isEn
                ? `Master all ${totalLessons} daily missions in this track, complete your practical portfolio project, and receive your QR-verified certificate. 1-year full access, zero hidden fees.`
                : `أتقن كافة الـ ${totalLessons} مهمة عملية في هذا المسار، وأنجز مشروعك العملي، واحصل على شهادة إتمام رقمية برمز QR. اشتراك سنوي كامل (365 يوماً) وبدون أي مصاريف خفية.`}
            </p>
            <p className="mb-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-3 text-xs leading-relaxed text-teal-900 dark:text-teal-200">
              {isEn ? (
                <>
                  <b>Earn {referral.commissionEgp} EGP per paid referral.</b> Share your invite link and request withdrawal once you reach {referral.minPayoutEgp} EGP.
                </>
              ) : (
                <>
                  <b>اكسب {referral.commissionEgp} ج.م لكل إحالة مدفوعة.</b> شارك رابطك واسحب أرباحك فور وصولك لـ {referral.minPayoutEgp} ج.م.
                </>
              )}
            </p>
            <Link
              href={`/quiz/checkout?type=track&slug=${courseSlug}`}
              className="block w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3.5 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all"
            >
              <span>{isEn ? `Subscribe to Track for ${pricing.trackPriceEgp} EGP / Year →` : `اشترك في المسار بـ ${pricing.trackPriceEgp} ج.م / سنة ←`}</span>
            </Link>
            <div className="mt-3 flex items-center justify-center gap-3 text-2xs text-neutral-500 dark:text-neutral-400">
              <Link href="/career-paths" className="underline hover:text-teal-500">
                {isEn ? `Career Paths (${pricing.careerPathPriceEgp} EGP)` : `المسارات المهنية (${pricing.careerPathPriceEgp} ج.م)`}
              </Link>
              <span>·</span>
              <Link href="/quiz/checkout?type=all_access" className="underline hover:text-amber-500">
                {isEn ? `All-Access (${pricing.allAccessPriceEgp} EGP)` : `الوصول الشامل (${pricing.allAccessPriceEgp} ج.م)`}
              </Link>
            </div>
            <p className="mt-2 text-3xs text-neutral-400">
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
