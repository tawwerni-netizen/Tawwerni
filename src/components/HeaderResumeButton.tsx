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
      className="group relative flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 text-xs font-bold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white shadow-sm hover:shadow-md active:scale-95 transition-all outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
    >
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>

      <span className="text-[11px] leading-none" aria-hidden>
        ▶️
      </span>

      <span className="hidden sm:inline font-extrabold tracking-tight">
        {isEn ? "Resume" : "استئناف"}
      </span>

      <span className="font-mono text-[10px] sm:text-[11px] bg-black/25 px-1.5 py-0.5 rounded-full text-white/95">
        {isEn ? `Day ${targetDay}` : `يوم ${targetDay}`}
      </span>
    </Link>
  );
}
