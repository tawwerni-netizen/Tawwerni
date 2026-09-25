"use client";

import { useI18n } from "./LanguageContext";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      title={lang === "ar" ? "English" : "العربية"}
      className={`group relative inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-neutral-800/90 px-3 text-xs font-bold text-neutral-800 dark:text-neutral-200 shadow-2xs transition-all hover:scale-105 active:scale-95 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 ${className}`}
    >
      <svg
        className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400 transition-transform duration-300 group-hover:rotate-45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span className="font-bold tracking-tight">
        {lang === "ar" ? "EN" : "عربي"}
      </span>
    </button>
  );
}
