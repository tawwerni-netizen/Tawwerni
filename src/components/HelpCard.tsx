"use client";

import { faqCount, openHelpCentre } from "@/lib/help-centre";

/**
 * The help-centre entry point on the home screen.
 *
 * It was a plain `<div>`: it looked exactly like a button, sat next to real
 * links, and did nothing at all when tapped. It now opens the same panel as the
 * floating button — one help centre, two ways in.
 */
export default function HelpCard({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => openHelpCentre()}
      className={`tile-press flex w-full items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 text-right ${className}`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-xl" aria-hidden>
        💬
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">مركز المساعدة</span>
        <span className="block text-xs text-neutral-400">
          إجابات جاهزة لأكتر من {faqCount()} سؤال
        </span>
      </span>
      <span className="go-arrow shrink-0 text-brand-600" aria-hidden>
        ←
      </span>
    </button>
  );
}
