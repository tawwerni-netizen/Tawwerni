"use client";

import Link from "next/link";
import { useI18n } from "./LanguageContext";
import TestimonialForm from "./TestimonialForm";

type Props = {
  existingStatus: string | null;
  completionsCount: number;
  minCompletions: number;
  topCourseId: string | null;
};

export default function TestimonialClient({
  existingStatus,
  completionsCount,
  minCompletions,
  topCourseId,
}: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  if (existingStatus) {
    const STATUS_COPY: Record<string, { ar: string; en: string }> = {
      pending: {
        ar: "لسه بنراجعه — هيظهر على الموقع لو مناسب.",
        en: "Under review — it will appear on the platform if approved.",
      },
      approved: {
        ar: "اتوافق عليه! ممكن يظهر على الموقع.",
        en: "Approved! It may now appear on the platform.",
      },
      rejected: {
        ar: "شكرًا على وقتك — قررنا ما نعرضهوش دلوقتي.",
        en: "Thank you for your time — we have decided not to display it at this time.",
      },
    };

    const statusObj = STATUS_COPY[existingStatus];

    return (
      <div dir={isEn ? "ltr" : "rtl"} className="px-4 pt-6 pb-10 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-xs">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl">
            🙏
          </div>
          <h1 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
            {isEn ? "Feedback Submitted" : "بعتّ رأيك خلاص"}
          </h1>
          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {statusObj ? (isEn ? statusObj.en : statusObj.ar) : ""}
          </p>
        </div>
      </div>
    );
  }

  if (completionsCount < minCompletions) {
    return (
      <div dir={isEn ? "ltr" : "rtl"} className="px-4 pt-6 pb-10 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-xs">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-2xl grayscale">
            🔒
          </div>
          <h1 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
            {isEn ? "Complete More Lessons First" : "كمّل شوية أول"}
          </h1>
          <p className="mb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {isEn
              ? `You need to complete at least ${minCompletions} lessons to share authentic feedback. You have completed ${completionsCount} so far.`
              : `محتاج تخلّص ${minCompletions} دروس على الأقل الأول عشان يبقى عندك تجربة فعلية تشاركها. إنت خلّصت ${completionsCount} لحد دلوقتي.`}
          </p>
          <Link
            href="/app/learn"
            className="btn-shine inline-block rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-2.5 text-sm font-bold text-white shadow-md active:scale-98 transition-all"
          >
            {isEn ? "Continue Your Track →" : "كمّل مسارك ←"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-10">
      <TestimonialForm courseId={topCourseId} />
    </div>
  );
}
