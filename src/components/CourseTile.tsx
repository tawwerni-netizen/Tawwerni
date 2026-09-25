"use client";

import Link from "next/link";
import { useI18n } from "./LanguageContext";
import { getTrackBySlug } from "@/content/tracks100";

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

  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done >= total;

  return (
    <Link
      href={`/app/learn/${slug}`}
      className={`tile-press relative block rounded-2xl border p-3.5 text-center transition-all bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs ${
        isActive ? "border-teal-500 ring-2 ring-teal-500/20" : "border-black/10 dark:border-neutral-800 hover:border-teal-500/40"
      }`}
    >
      {isActive && (
        <span className="absolute top-2 end-2 rounded-full bg-teal-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
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
      <div className="truncate text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
        {displayCategory}
      </div>

      <div className="mt-2.5">
        <div className="progress-track" role="presentation">
          <span className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-[10px] text-neutral-400 font-mono">
          {done}/{total} {isEn ? "Days" : "يوم"}
        </div>
      </div>

      <div className="mt-1 text-[10px] font-medium text-teal-600 dark:text-teal-400">
        {unlocked ? (isEn ? "Unlocked ✓" : "مفتوح ✓") : (isEn ? "Included in Pass" : "ضمن الاشتراك")}
      </div>
    </Link>
  );
}
