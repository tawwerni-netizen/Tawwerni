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
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col transition-colors"
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
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
              href="/quiz"
              className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/15"
            >
              {isEn ? "Find My Track" : "حدد مسارك"}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 px-4 sm:px-6 border-b border-black/5 dark:border-neutral-900">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 mb-4 animate-fade-in">
            <span>✨</span>
            <span>
              {isEn
                ? "The Comprehensive Catalog · 100 Professional Tracks"
                : "الكتالوج الشامل · 100 مسار احترافي متكامل"}
            </span>
          </span>

          <h1 className="text-3xl font-black sm:text-5xl tracking-tight text-neutral-900 dark:text-white mb-4">
            {isEn ? (
              <>
                All Future Skills, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  In One Lifetime Membership
                </span>
              </>
            ) : (
              <>
                كل مهارات المستقبل، <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  في اشتراك واحد مدى الحياة
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {isEn
              ? "100 actionable tracks across 10 vital disciplines. Every lesson takes only 5-15 minutes with practical hands-on tasks and AI coaching support."
              : "100 مسار عملي مقسمة على 10 قطاعات أساسية. كل درس مدته من 5 إلى 15 دقيقة مع تطبيق عملي ودعم نفسي وتركيز فائق."}
          </p>
        </div>
      </section>

      {/* Explorer Component */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex-1 w-full">
        <TrackExplorer />
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "All 100 Tracks Unlocked" : brand.tagline}</p>
      </footer>
    </div>
  );
}
