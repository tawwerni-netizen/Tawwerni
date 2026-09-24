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
      className={`relative inline-flex items-center justify-center px-2.5 h-9 rounded-full border border-black/10 bg-white/90 dark:bg-neutral-800/90 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-xs ${className}`}
    >
      <span className="flex items-center gap-1.5">
        <span className="text-sm">🌐</span>
        <span>{lang === "ar" ? "EN" : "عربي"}</span>
      </span>
    </button>
  );
}
