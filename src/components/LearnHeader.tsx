"use client";

import { useI18n } from "./LanguageContext";

export default function LearnHeader() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div className="mb-6" dir={isEn ? "ltr" : "rtl"}>
      <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-black text-teal-700 dark:text-teal-300 mb-3 shadow-2xs">
        <span className="text-sm animate-pulse">✨</span>
        <span>
          {isEn
            ? "Unlocked Catalog · 100 Practical Career Tracks"
            : "الكتالوج التخصصي · 100 مسار مفتوحة بالكامل في اشتراكك"}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
        {isEn ? (
          <>
            Explore & Master{" "}
            <span className="text-teal-600 dark:text-emerald-400 font-black">
              All 100 Tracks
            </span>
          </>
        ) : (
          <>
            تعلّم وتدرّب في{" "}
            <span className="text-teal-600 dark:text-emerald-400 font-black">
              كل الـ 100 مسار
            </span>
          </>
        )}
      </h1>

      <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl leading-relaxed">
        {isEn
          ? "Unlimited access for 1 year. Every track is broken into bite-sized 5–15 minute daily micro-tasks, interactive flashcards, quizzes, and 24/7 AI coaching."
          : "وصول سنوي شامل لجميع المسارات الـ 100. كل كورس مصمم بنظام المهام اليومية المصغرة (٥-١٥ دقيقة) مع كويزات ذكية ودعم ذكاء اصطناعي فوري."}
      </p>
    </div>
  );
}
