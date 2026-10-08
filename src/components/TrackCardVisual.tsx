"use client";

import { useRouter } from "next/navigation";
import type { Track100 } from "@/content/tracks100";
import { getTrackArtwork } from "@/content/track-artworks";
import { useI18n } from "./LanguageContext";
import { pricing } from "@/content/brand";
import { resolveDomainTheme, type DomainTheme } from "@/lib/design-system/domain-themes";

type Props = {
  track: Track100;
  onSelect?: (track: Track100) => void;
  isUnlocked?: boolean;
};

function PillarSvgIllustration({ pillarId, theme }: { pillarId: number; theme: DomainTheme }) {
  const p = theme.palette.primary;
  const a = theme.palette.accent;

  switch (pillarId) {
    case 1: // AI & Prompts
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <circle cx="100" cy="50" r="32" strokeDasharray="3 3" />
          <circle cx="100" cy="50" r="16" style={{ fill: `${p}33` }} />
          <circle cx="45" cy="30" r="6" style={{ fill: `${a}66` }} />
          <circle cx="155" cy="30" r="6" style={{ fill: `${a}66` }} />
          <circle cx="40" cy="75" r="5" style={{ fill: `${p}4d` }} />
          <circle cx="160" cy="75" r="5" style={{ fill: `${p}4d` }} />
          <line x1="45" y1="30" x2="100" y2="50" />
          <line x1="155" y1="30" x2="100" y2="50" />
          <line x1="40" y1="75" x2="100" y2="50" />
          <line x1="160" y1="75" x2="100" y2="50" />
          <line x1="45" y1="30" x2="40" y2="75" strokeDasharray="2 2" />
          <line x1="155" y1="30" x2="160" y2="75" strokeDasharray="2 2" />
        </svg>
      );
    case 2: // Code & Dev
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <rect x="25" y="15" width="150" height="70" rx="10" strokeDasharray="4 4" />
          <path d="M60,35 L45,50 L60,65" strokeWidth="2" strokeLinecap="round" />
          <path d="M140,35 L155,50 L140,65" strokeWidth="2" strokeLinecap="round" />
          <line x1="110" y1="30" x2="90" y2="70" strokeWidth="2" strokeLinecap="round" />
          <circle cx="38" cy="25" r="2.5" className="fill-rose-400" />
          <circle cx="46" cy="25" r="2.5" className="fill-amber-400" />
          <circle cx="54" cy="25" r="2.5" className="fill-emerald-400" />
        </svg>
      );
    case 3: // Data & BI
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <polyline points="30,80 70,55 110,65 150,30 175,20" strokeWidth="2" strokeLinecap="round" />
          <rect x="40" y="65" width="14" height="20" rx="3" style={{ fill: `${p}33` }} />
          <rect x="75" y="45" width="14" height="40" rx="3" style={{ fill: `${p}40` }} />
          <rect x="110" y="55" width="14" height="30" rx="3" style={{ fill: `${p}33` }} />
          <rect x="145" y="30" width="14" height="55" rx="3" style={{ fill: `${a}59` }} />
          <circle cx="175" cy="20" r="4" style={{ fill: a }} />
        </svg>
      );
    case 4: // Freelancing & Agency
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <circle cx="70" cy="50" r="24" style={{ fill: `${p}33` }} />
          <circle cx="130" cy="50" r="24" style={{ fill: `${p}33` }} />
          <line x1="70" y1="50" x2="130" y2="50" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M62,44 Q70,38 78,44 T78,56 Q70,62 62,56" strokeWidth="1.8" />
          <line x1="70" y1="36" x2="70" y2="64" strokeWidth="1.8" />
          <polyline points="120,40 135,50 120,60" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 5: // Marketing & Sales
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <path d="M50,40 L90,25 L90,75 L50,60 Z" style={{ fill: `${p}33` }} />
          <path d="M105,32 Q125,50 105,68" strokeWidth="2" strokeLinecap="round" />
          <path d="M120,24 Q150,50 120,76" strokeWidth="2" strokeLinecap="round" />
          <circle cx="165" cy="50" r="16" strokeDasharray="2 2" />
          <circle cx="165" cy="50" r="5" style={{ fill: a }} />
        </svg>
      );
    case 6: // Design & Media
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <circle cx="75" cy="50" r="28" strokeDasharray="3 3" />
          <circle cx="125" cy="50" r="28" strokeDasharray="3 3" />
          <path d="M40,50 C80,10 120,90 160,50" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="80" cy="30" r="4" style={{ fill: a }} />
          <circle cx="120" cy="70" r="4" style={{ fill: p }} />
        </svg>
      );
    case 7: // Startups & Business
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <polygon points="100,18 135,82 65,82" strokeWidth="1.8" style={{ fill: `${p}33` }} />
          <polygon points="100,32 120,76 80,76" strokeWidth="1.2" />
          <line x1="100" y1="18" x2="100" y2="82" strokeDasharray="3 3" />
          <circle cx="100" cy="48" r="4" style={{ fill: a }} />
        </svg>
      );
    case 8: // Cybersecurity
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <path d="M100,18 L140,32 L140,58 C140,75 100,88 100,88 C100,88 60,75 60,58 L60,32 Z" strokeWidth="1.8" style={{ fill: `${p}33` }} />
          <circle cx="100" cy="48" r="8" strokeWidth="1.5" />
          <line x1="100" y1="56" x2="100" y2="66" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 9: // Soft Skills & Leadership
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <circle cx="60" cy="50" r="18" style={{ fill: `${p}33` }} />
          <circle cx="140" cy="50" r="18" style={{ fill: `${p}33` }} />
          <path d="M78,50 Q100,35 122,50" strokeWidth="2" strokeLinecap="round" />
          <path d="M78,50 Q100,65 122,50" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="50" r="4" style={{ fill: a }} />
        </svg>
      );
    case 10: // Productivity & Mindset
    default:
      return (
        <svg viewBox="0 0 200 100" className="w-full h-full opacity-40 transition-transform duration-500 group-hover:scale-105 fill-none" strokeWidth="1.2" style={{ stroke: a }}>
          <ellipse cx="100" cy="50" rx="45" ry="18" strokeDasharray="3 3" transform="rotate(-25 100 50)" />
          <ellipse cx="100" cy="50" rx="45" ry="18" strokeDasharray="3 3" transform="rotate(25 100 50)" />
          <circle cx="100" cy="50" r="12" style={{ fill: `${p}4d` }} />
          <circle cx="100" cy="50" r="4" style={{ fill: a }} />
        </svg>
      );
  }
}

export default function TrackCardVisual({ track, onSelect }: Props) {
  const router = useRouter();
  const { lang, t } = useI18n();

  const title = lang === "ar" ? track.titleAr : track.titleEn;
  const description = lang === "ar" ? track.descriptionAr : track.descriptionEn;
  const pillar = lang === "ar" ? track.pillarNameAr : track.pillarNameEn;
  const level = lang === "ar" ? track.levelAr : track.levelEn;
  const artwork = getTrackArtwork(track.slug);
  const theme = resolveDomainTheme({ pillarId: track.pillarId, trackSlug: track.slug });

  function handleClick() {
    if (onSelect) {
      onSelect(track);
    } else {
      router.push(`/app/learn/${track.slug}`);
    }
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${theme.palette.primary}66`;
        e.currentTarget.style.boxShadow = `0 20px 40px -15px ${theme.palette.primary}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.boxShadow = "";
      }}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-4.5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 cursor-pointer text-neutral-900 dark:text-white shadow-xs"
    >
      {/* Dynamic Background Glow - Pulses and intensifies with domain identity color */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-15 dark:opacity-25 blur-3xl transition-all duration-500 group-hover:opacity-50 group-hover:scale-125"
        style={{ background: `radial-gradient(circle, ${theme.palette.primary} 0%, transparent 70%)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full opacity-10 dark:opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-40 group-hover:scale-125"
        style={{ background: `radial-gradient(circle, ${theme.palette.secondary} 0%, transparent 70%)` }}
      />

      <div>
        {/* Top Header Pill & Order */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-xs transition-colors"
            style={{
              backgroundColor: `${theme.palette.primary}14`,
              borderColor: `${theme.palette.primary}38`,
            }}
          >
            <span>{track.icon}</span>
            <span className="font-bold">{pillar}</span>
          </span>
          <span
            className="font-mono text-xs font-bold text-neutral-400 dark:text-neutral-500 transition-colors"
          >
            #{String(track.order).padStart(2, "0")}
          </span>
        </div>

        {/* Rich Thematic Graphic Visual Banner */}
        <div
          className="relative my-2.5 flex h-40 w-full items-center justify-center overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 shadow-inner transition-all duration-500"
          style={{
            background: theme.gradient,
          }}
        >
          {artwork ? (
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={artwork.image}
                alt={lang === "ar" ? artwork.altAr : artwork.altEn}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              {/* Subtle ambient color tint matching domain accent */}
              <div
                className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-35 pointer-events-none"
                style={{
                  background: `linear-gradient(to top, ${theme.palette.primary}80 0%, transparent 60%)`,
                }}
              />
            </div>
          ) : (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <PillarSvgIllustration pillarId={track.pillarId} theme={theme} />
            </div>
          )}

          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none" />

          {/* Top Floating Badges (Showcases 3D artwork cleanly without center obstruction) */}
          {artwork ? (
            <div className="absolute top-2.5 inset-x-2.5 z-10 flex items-center justify-between pointer-events-none">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black/50 backdrop-blur-md text-base shadow-md border border-white/25 transition-transform duration-300 group-hover:scale-110">
                {track.icon}
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20 shadow-md">
                <span
                  className="h-1.5 w-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.palette.accent }}
                />
                <span>{lang === "ar" ? artwork.badgeAr : artwork.badgeEn}</span>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 dark:bg-black/30 backdrop-blur-md text-3xl shadow-xl border border-white/30 dark:border-white/20 transition-transform duration-300 group-hover:scale-110">
              {track.icon}
            </div>
          )}

          {/* Level Overlay Chip */}
          <div className="absolute bottom-2.5 start-2.5 z-10 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/15">
            {level}
          </div>

          {/* Lesson Count Overlay */}
          <div className="absolute bottom-2.5 end-2.5 z-10 rounded-full bg-black/55 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/15 font-mono">
            {track.totalLessons} {t.lessonsCount}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold leading-snug tracking-tight text-neutral-900 dark:text-white transition-colors line-clamp-2 mt-2">
          {title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Footer Info & Badges */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-1.5 font-bold">
          <span className="rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-mono font-black">
            {lang === "ar" ? `${pricing.trackPriceEgp} ج.م` : `${pricing.trackPriceEgp} EGP`}
          </span>
          <span className="text-[10px] text-neutral-400 hidden sm:inline">
            {lang === "ar" ? "· يوم 1 مجانًا" : "· Day 1 Free"}
          </span>
        </div>

        <div
          className="flex items-center gap-1 font-mono font-bold text-xs"
          style={{ color: theme.palette.primary }}
        >
          <span>⚡</span>
          <span>{track.totalXp} XP</span>
        </div>
      </div>
    </div>
  );
}
