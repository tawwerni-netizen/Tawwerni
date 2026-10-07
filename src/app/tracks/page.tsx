"use client";

import Link from "next/link";
import { brand } from "@/content/brand";
import TrackExplorer from "@/components/TrackExplorer";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";

export default function TracksPage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col transition-colors relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

      {/* Top Header */}
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

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/quiz"
              className="whitespace-nowrap shrink-0 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs font-black text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/20"
            >
              {isEn ? "Career Quiz · Find My Track 🎯" : "حدد مسارك الأنسب 🎯"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-18 px-4 sm:px-6 border-b border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300 mb-5 animate-fade-in shadow-2xs">
            <span className="text-base animate-pulse">✨</span>
            <span>
              {isEn
                ? "The All-Inclusive Catalog · 100 Practical Tracks"
                : "الكتالوج التخصصي الشامل · 100 مسار احترافي متكامل"}
            </span>
          </span>

          <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 dark:text-white mb-5 leading-tight">
            {isEn ? (
              <>
                All Modern Career Skills, <br className="hidden sm:inline" />
                <span className="text-teal-600 dark:text-emerald-400 font-black">
                  In One 1-Year Membership
                </span>
              </>
            ) : (
              <>
                كل مهارات سوق العمل والذكاء الاصطناعي، <br className="hidden sm:inline" />
                <span className="text-teal-600 dark:text-emerald-400 font-black">
                  في اشتراك سنوي واحد شامل
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {isEn
              ? "100 practical tracks covering 10 high-demand pillars. Every lesson takes only 5–15 minutes with actionable daily tasks, quizzes, and 24/7 AI coaching."
              : "100 مسار عملي مقسمة على 10 قطاعات وظيفية حيوية. كل درس مدته من 5 إلى 15 دقيقة فقط مع تطبيق عملي فوري، كويزات ذكية، ومتابعة مدار الساعة."}
          </p>

          {/* High-Dopamine Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-center">
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3.5 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">100</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5">
                {isEn ? "Specialized Tracks" : "مسارًا عمليًا كاملاً"}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3.5 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">10</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5">
                {isEn ? "Vital Pillars" : "قطاعات وظيفية كبرى"}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3.5 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">5-15</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5">
                {isEn ? "Mins / Day" : "دقيقة فقط يوميًا"}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3.5 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">100%</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-semibold mt-0.5">
                {isEn ? "Bilingual AR/EN" : "ثنائي اللغة بالكامل"}
              </div>
            </div>
          </div>

          {/* Reassurance Lifetime Ownership & Accredited Certificate Pill */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-teal-50/80 dark:bg-teal-950/40 border border-teal-500/20 px-4 py-2 rounded-full">
            <span className="font-bold text-teal-800 dark:text-teal-300">♾️ {isEn ? "Lifetime Ownership" : "ملكية دائمة مدى الحياة"}</span>
            <span className="text-neutral-400">•</span>
            <span className="font-bold text-amber-700 dark:text-amber-300">🎓 {isEn ? "Verifiable Digital QR Certificate For Every Track" : "شهادة إتمام رقمية موثقة بكود QR لكل مسار"}</span>
            <span className="text-neutral-400">•</span>
            <span>{isEn ? "Day 1 of every track is 100% free to test" : "اليوم الأول من كل مسار مفتوح مجاناً للتجربة"}</span>
          </div>
        </div>
      </section>

      {/* Explorer Component */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex-1 w-full">
        <TrackExplorer />
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "All 100 Tracks Unlocked" : brand.tagline}</p>
          <div className="flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
            <Link href="/about" className="hover:text-teal-600 transition-colors">{isEn ? "About Us" : "من نحن"}</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-teal-600 transition-colors">{isEn ? "Terms" : "الشروط والأحكام"}</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">{isEn ? "Privacy" : "سياسة الخصوصية"}</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-teal-600 transition-colors font-semibold text-teal-700 dark:text-teal-400">{isEn ? "Digital Products Policy" : "سياسة المنتجات الرقمية"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
