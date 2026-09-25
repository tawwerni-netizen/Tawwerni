"use client";

import { faqCount, openHelpCentre } from "@/lib/help-centre";
import { useI18n } from "./LanguageContext";

/**
 * The help-centre entry point on the home screen.
 *
 * It was a plain `<div>`: it looked exactly like a button, sat next to real
 * links, and did nothing at all when tapped. It now opens the same panel as the
 * floating button — one help centre, two ways in.
 */
export default function HelpCard({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <button
      type="button"
      onClick={() => openHelpCentre()}
      className={`tile-press flex w-full items-center gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 text-start shadow-xs hover:border-brand-500/40 transition-colors ${className}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 dark:bg-brand-950 text-xl" aria-hidden>
        💬
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {isEn ? "Help Center" : "مركز المساعدة"}
        </span>
        <span className="block text-xs text-neutral-400">
          {isEn
            ? `Instant answers to ${faqCount()}+ common questions`
            : `إجابات جاهزة لأكتر من ${faqCount()} سؤال`}
        </span>
      </span>
      <span className="go-arrow shrink-0 text-brand-600 dark:text-brand-400" aria-hidden>
        {isEn ? "→" : "←"}
      </span>
    </button>
  );
}
