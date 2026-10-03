"use client";

import Link from "next/link";
import { useI18n } from "./LanguageContext";
import { getTrackBySlug } from "@/content/tracks100";
import { resolveDomainTheme } from "@/lib/design-system/domain-themes";

export default function CourseTile({
  slug,
  title,
  titleEn,
  category,
  categoryEn,
  icon,
  total,
  done,
  unlocked,
  isActive,
}: {
  slug: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  icon: string;
  total: number;
  done: number;
  unlocked: boolean;
  isActive: boolean;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const track = getTrackBySlug(slug);
  const displayTitle = isEn ? (titleEn || track?.titleEn || title) : (title || track?.titleAr);
  const displayCategory = isEn ? (categoryEn || track?.pillarNameEn || category) : (category || track?.pillarNameAr);
  const theme = resolveDomainTheme({
    pillarId: track?.pillarId,
    trackSlug: slug,
    category: category || track?.pillarNameEn,
    title,
  });

  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done >= total;

  return (
    <Link
      href={`/app/learn/${slug}`}
      style={
        isActive
          ? {
              borderColor: theme.palette.primary,
              boxShadow: `0 0 0 2px ${theme.palette.primary}33`,
            }
          : undefined
      }
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = `${theme.palette.primary}66`;
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.borderColor = "";
      }}
      className="tile-press relative block rounded-2xl border border-black/10 dark:border-neutral-800 p-3.5 text-center transition-all bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs"
    >
      {isActive && (
        <span
          className="absolute top-2 end-2 rounded-full px-2 py-0.5 text-[9px] font-bold text-white shadow-xs"
          style={{ backgroundColor: theme.palette.primary }}
        >
          {isEn ? "Active" : "شغّال"}
        </span>
      )}
      {complete && (
        <span className="absolute top-2 end-2 text-sm" title={isEn ? "Completed" : "خلصته"}>
          🎓
        </span>
      )}

      <div className="mb-1 text-2xl" aria-hidden>
        {icon}
      </div>
      <div className="truncate text-xs font-bold" title={displayTitle}>
        {displayTitle}
      </div>
      <div className="truncate text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 flex items-center justify-center gap-1">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: theme.palette.primary }}
        />
        <span className="truncate">{displayCategory}</span>
      </div>

      <div className="mt-2.5">
        <div className="progress-track" role="presentation">
          <span
            className="progress-fill"
            style={{ width: `${pct}%`, backgroundColor: theme.palette.primary }}
          />
        </div>
        <div className="mt-1 text-[10px] text-neutral-400 font-mono">
          {done}/{total} {isEn ? "Days" : "يوم"}
        </div>
      </div>

      <div
        className="mt-1 text-[10px] font-medium"
        style={{ color: theme.palette.primary }}
      >
        {unlocked ? (isEn ? "Unlocked ✓" : "مفتوح ✓") : (isEn ? "Included in Pass" : "ضمن الاشتراك")}
      </div>
    </Link>
  );
}
