"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useI18n } from "@/components/LanguageContext";

type Props = {
  isLoggedIn?: boolean;
};

export default function CareerPathsHeader({ isLoggedIn = false }: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <LogoLink size={34} href={isLoggedIn ? "/app" : "/"} />

          <Link
            href="/career-paths"
            className="text-xs font-black text-teal-700 dark:text-teal-300 inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full"
          >
            <span>🧭</span>
            <span>{isEn ? "Career Paths" : "المسارات المهنية"}</span>
          </Link>

          <Link
            href="/tracks"
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors hidden md:inline-flex items-center gap-1.5"
          >
            <span>🌟</span>
            <span>{isEn ? "All 100 Tracks" : "الـ 100 مسار"}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageToggle />
          <ThemeToggle />

          {isLoggedIn ? (
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 px-3.5 py-1.5 text-xs font-black text-teal-800 dark:text-teal-300 hover:bg-teal-500/25 transition-all"
            >
              <span>🏠</span>
              <span>{isEn ? "My Dashboard" : "لوحة التعلم"}</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-2.5 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors hidden sm:inline"
              >
                {isEn ? "Sign In" : "دخول"}
              </Link>
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-xs font-black text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <span>{isEn ? "Start Free" : "ابدأ مجاناً"}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
