"use client";

import type { Track100 } from "@/content/tracks100";
import { useI18n } from "./LanguageContext";

type Props = {
  track: Track100;
  onSelect?: (track: Track100) => void;
  isUnlocked?: boolean;
};

export default function TrackCardVisual({ track, onSelect, isUnlocked = true }: Props) {
  const { lang, t } = useI18n();

  const title = lang === "ar" ? track.titleAr : track.titleEn;
  const description = lang === "ar" ? track.descriptionAr : track.descriptionEn;
  const pillar = lang === "ar" ? track.pillarNameAr : track.pillarNameEn;
  const level = lang === "ar" ? track.levelAr : track.levelEn;

  return (
    <div
      onClick={() => onSelect?.(track)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/80 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/10 cursor-pointer text-white"
    >
      {/* Dynamic Background Glow based on track colors */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ background: `radial-gradient(circle, ${track.accentFrom} 0%, transparent 70%)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30"
        style={{ background: `radial-gradient(circle, ${track.accentTo} 0%, transparent 70%)` }}
      />

      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-neutral-300 backdrop-blur-xs">
            <span>{track.icon}</span>
            <span>{pillar}</span>
          </span>
          <span className="font-mono text-xs font-bold text-neutral-500 group-hover:text-teal-400 transition-colors">
            #{String(track.order).padStart(2, "0")}
          </span>
        </div>

        {/* Visual Graphic Artwork Badge */}
        <div className="relative my-3 flex h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-neutral-950/80 to-neutral-900/60 shadow-inner group-hover:border-teal-500/20 transition-all">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${track.accentFrom}, ${track.accentTo})`,
              boxShadow: `0 10px 25px -5px ${track.accentFrom}40`,
            }}
          >
            {track.icon}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold leading-snug tracking-tight text-white group-hover:text-teal-300 transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-400 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer Info & Badges */}
      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-neutral-800/70 px-2 py-0.5 font-medium text-neutral-300">
            {level}
          </span>
          <span>
            {track.totalLessons} {t.lessonsCount}
          </span>
        </div>

        <div className="flex items-center gap-1 font-mono font-bold text-teal-400">
          <span>⚡</span>
          <span>{track.totalXp} XP</span>
        </div>
      </div>
    </div>
  );
}
