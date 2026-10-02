"use client";

import Link from "next/link";
import { brand } from "@/content/brand";
import CommunityWall from "@/components/CommunityWall";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";

export default function CommunityPage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col transition-colors relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <LogoLink size={34} />
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors hidden sm:inline"
            >
              {isEn ? "← Back to Home" : "← العودة للرئيسية"}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/tracks"
              className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-teal-600 transition-colors hidden sm:inline"
            >
              {isEn ? "All 100 Tracks" : "الـ 100 مسار"}
            </Link>
            <Link
              href="/quiz"
              className="rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 px-5 py-2 text-xs font-black text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/20"
            >
              {isEn ? "Join The Community 🚀" : "انضم لمجتمع الأبطال 🚀"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-14 sm:py-16 px-4 sm:px-6 border-b border-black/5 dark:border-white/5 text-center">
        <div className="mx-auto max-w-3xl relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300 mb-5 shadow-2xs">
            <span className="text-base animate-pulse">👥</span>
            <span>
              {isEn
                ? "The Founding Cohort · 300+ Verified Success Stories"
                : "فوج التأسيس الأول · أكثر من 300 قصة نجاح موثقة"}
            </span>
          </span>

          <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 dark:text-white mb-4 leading-tight">
            {isEn ? (
              <>
                Learn With Peers, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Grow Without Friction
                </span>
              </>
            ) : (
              <>
                تعلّم مع نخبة من الطموحين، <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  وحقق أهدافك بلا تسويف
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {isEn
              ? "Discover genuine feedback, real-world earnings, and career transformations from learners across 10 vital industries using Tawwerni daily."
              : "اكتشف تجارب حقيقية ونتائج موثقة لطلاب، مستقلين، ورواد أعمال يبنون مهاراتهم اليومية عبر منصة طوّرني ويحققون دخلاً حقيقيًا."}
          </p>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">300+</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Verified Members" : "عضو مؤسس موثق"}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-amber-500 font-mono">4.9 / 5</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Average Rating" : "تقييم الرضا العام"}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">94%</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Completion Rate" : "نسبة الالتزام بالعادة"}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">7d</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Full Guarantee" : "ضمان استرداد كامل"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        <CommunityWall />
      </main>

      {/* High-Converting Bottom CTA */}
      <section className="py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-teal-900 via-neutral-950 to-emerald-950 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden border border-teal-500/30">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />

          <h2 className="text-2xl sm:text-4xl font-black mb-3">
            {isEn ? "Ready to Write Your Own Success Story?" : "جاهز لكتابة قصة نجاحك الخاصة؟"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
            {isEn
              ? "Join hundreds of ambitious professionals leveling up their careers daily. Day 1 is 100% free with a 7-day money-back guarantee."
              : "انضم إلى مئات المحترفين والطلاب الذين يطورون مهاراتهم يوميًا. اليوم الأول مجانًا بالكامل وضمان استرداد 100% خلال 7 أيام."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/quiz"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-neutral-950 font-black text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all"
            >
              {isEn ? "Start Your Journey Today →" : "ابدأ رحلتك التعليمية الآن ←"}
            </Link>
            <Link
              href="/tracks"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md active:scale-95 transition-all"
            >
              {isEn ? "Explore All 100 Tracks" : "استكشف كل الـ 100 مسار"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "Early Adopter Community" : "مجتمع الرواد الأوائل"}</p>
          <div className="flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
            <Link href="/about" className="hover:text-teal-600 transition-colors">{isEn ? "About Us" : "من نحن"}</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-teal-600 transition-colors">{isEn ? "Terms" : "الشروط والأحكام"}</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">{isEn ? "Privacy" : "سياسة الخصوصية"}</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-teal-600 transition-colors font-semibold text-teal-700 dark:text-teal-400">{isEn ? "7-Day Refund Guarantee" : "ضمان الـ 7 أيام"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
