"use client";

import Link from "next/link";
import { brand } from "@/content/brand";
import CommunityWall from "@/components/CommunityWall";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";
import { CONTENT_METRICS, FORMATTED_METRICS } from "@/lib/content-metrics";
import { getTrackDayOneUrl } from "@/lib/canonical-routes";

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

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/tracks"
              className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-teal-600 transition-colors hidden sm:inline shrink-0"
            >
              {isEn ? `All ${CONTENT_METRICS.tracks} Tracks` : `الـ ${CONTENT_METRICS.tracks} مسار`}
            </Link>
            <Link
              href="/quiz"
              className="whitespace-nowrap shrink-0 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 px-3.5 sm:px-5 py-2 sm:py-2 text-xs font-black text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/20"
            >
              {isEn ? "Find Your Path 🎯" : "اعرف المسار المناسب لك 🎯"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative overflow-hidden py-14 sm:py-16 px-4 sm:px-6 border-b border-black/5 dark:border-white/5 text-center">
        <div className="mx-auto max-w-3xl relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300 mb-5 shadow-2xs">
            <span className="text-base">🛠️</span>
            <span>
              {isEn
                ? `Practical Projects & Missions · ${CONTENT_METRICS.tracks} Tracks & ${CONTENT_METRICS.careerPaths} Career Paths`
                : `مشاريع ومهام تطبيقية واقعية · ${CONTENT_METRICS.tracks} مسار و ${CONTENT_METRICS.careerPaths} مساراً مهنياً`}
            </span>
          </span>

          <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 dark:text-white mb-4 leading-tight">
            {isEn ? (
              <>
                Practical Projects & Deliverables <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  You Build and Document
                </span>
              </>
            ) : (
              <>
                نماذج من المشاريع والمهام <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  التي يمكن للمتعلم تنفيذها
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {isEn
              ? "Every track on Tawwerni culminates in real, hands-on capstones you can document and showcase directly in your portfolio — moving beyond passive video watching to verifiable mastery."
              : "كل مسار في طوّرني ينتهي بمنتج ومخرج عملي ملموس يمكنك توثيقه وإضافته إلى ملف أعمالك، بعيداً عن الفيديوهات السلبية والمحاضرات النظرية."}
          </p>

          {/* Canonical Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-center">
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">{CONTENT_METRICS.tracks}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Specialized Tracks" : "مسار تخصصي"}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-amber-500 font-mono">{CONTENT_METRICS.careerPaths}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Career Roadmaps" : "مساراً مهنياً متكاملاً"}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{FORMATTED_METRICS.lessons}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Lessons & Missions" : "درس ومهمة تطبيقية"}
              </div>
            </div>
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-3 border border-black/5 dark:border-white/10 shadow-xs">
              <div className="text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono">100%</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
                {isEn ? "Free Day 1 (No Sign Up)" : "اليوم الأول مجاناً بلا تسجيل"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Practical Projects Showcase */}
      <main className="flex-1">
        <CommunityWall />
      </main>

      {/* High-Converting Bottom CTA */}
      <section className="py-14 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-br from-teal-900 via-neutral-950 to-emerald-950 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden border border-teal-500/30">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />

          <h2 className="text-2xl sm:text-4xl font-black mb-3">
            {isEn ? "Ready to Build Your First Practical Project?" : "جاهز لتنفيذ أول مشروع ومهمة عملية لك؟"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto mb-6 leading-relaxed">
            {isEn
              ? "Try Day 1 of any track 100% free with zero prior registration. Experience actionable micro-learning and execute real tasks immediately."
              : "جرّب اليوم الأول من أي مسار مجانًا بدون تسجيل مسبق. اختبر بنفسك أسلوب التعلّم بالتطبيق المباشر ونفّذ أول مهمة عملية فوراً."}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={getTrackDayOneUrl("prompt-engineering-mastery")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-neutral-950 font-black text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all text-center"
            >
              {isEn ? "Try Day 1 Free Now →" : "جرّب اليوم الأول مجانًا ←"}
            </Link>
            <Link
              href="/quiz"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md active:scale-95 transition-all text-center"
            >
              {isEn ? "Find The Best Path For You" : "اعرف المسار المناسب لك"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "Practical Educational Platform" : "منصة طوّرني للتعلّم التطبيقي"}</p>
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
