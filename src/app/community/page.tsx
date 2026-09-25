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
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white flex flex-col transition-colors"
    >
      {/* Header */}
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
              href="/tracks"
              className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-teal-600 transition-colors hidden sm:inline"
            >
              {isEn ? "Browse All 100 Tracks" : "تصفح الـ 100 مسار"}
            </Link>
            <Link
              href="/quiz"
              className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/15"
            >
              {isEn ? "Join Community" : "انضم للمجتمع"}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <CommunityWall />
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "Early Adopter Community" : "مجتمع الرواد الأوائل"}</p>
      </footer>
    </div>
  );
}
