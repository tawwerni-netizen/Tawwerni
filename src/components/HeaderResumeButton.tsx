"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRecentLearningClient, RecentLearningInfo } from "@/lib/recent-learning";
import { useI18n } from "@/components/LanguageContext";

type Props = {
  initialResume?: {
    slug: string;
    dayNumber: number;
    titleAr?: string;
    titleEn?: string;
    icon?: string;
  } | null;
};

export default function HeaderResumeButton({ initialResume }: Props) {
  const pathname = usePathname();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [resumeData, setResumeData] = useState<{
    slug: string;
    dayNumber: number;
    titleAr?: string;
    titleEn?: string;
    icon?: string;
  } | null>(initialResume || null);

  useEffect(() => {
    // Check client-side storage for the latest visited lesson
    const clientData = getRecentLearningClient();
    if (clientData && clientData.courseSlug) {
      setResumeData({
        slug: clientData.courseSlug,
        dayNumber: clientData.dayNumber || 1,
        titleAr: clientData.courseTitle,
        titleEn: clientData.courseTitleEn || clientData.courseTitle,
        icon: clientData.icon || "⚡",
      });
    }
  }, [pathname]);

  // Don't show resume button if the learner is ALREADY on the lesson player for that same lesson
  if (pathname.startsWith("/app/learn/") && pathname.includes(`/${resumeData?.dayNumber}`)) {
    return null;
  }

  // If no course visited yet, default to first track Day 1
  const targetSlug = resumeData?.slug || "prompt-engineering-mastery";
  const targetDay = resumeData?.dayNumber || 1;
  const courseTitle = isEn
    ? resumeData?.titleEn || "Prompt Engineering Mastery"
    : resumeData?.titleAr || "هندسة الأوامر بالذكاء الاصطناعي";

  return (
    <Link
      href={`/app/learn/${targetSlug}/${targetDay}`}
      aria-label={isEn ? `Resume Learning: ${courseTitle}` : `استئناف التعلم: ${courseTitle}`}
      title={isEn ? `Resume: ${courseTitle} (Day ${targetDay})` : `استئناف: ${courseTitle} (يوم ${targetDay})`}
      className="group relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full ps-2 pe-2.5 sm:pe-3 py-1 text-xs font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-xs hover:shadow-md hover:shadow-teal-500/20 active:scale-95 transition-all outline-hidden border border-white/15 whitespace-nowrap shrink-0"
    >
      {/* Clean SVG Play Glyph in Translucent Disc */}
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 text-white transition-colors shrink-0">
        <svg
          className="h-2.5 w-2.5 fill-current ms-0.5"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>

      {/* Label */}
      <span className="font-extrabold tracking-tight whitespace-nowrap">
        {isEn ? "Resume" : "استئناف"}
      </span>

      {/* Day Chip - Protected with whitespace-nowrap */}
      <span className="whitespace-nowrap shrink-0 text-[10px] sm:text-[11px] font-bold rounded-full bg-black/25 dark:bg-black/35 px-2 py-0.5 text-white/95 border border-white/10 font-sans">
        {isEn ? `Day ${targetDay}` : `يوم ${targetDay}`}
      </span>
    </Link>
  );
}
