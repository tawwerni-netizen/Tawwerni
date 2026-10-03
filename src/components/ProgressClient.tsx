"use client";

import Link from "next/link";
import WeekDot from "@/components/WeekDot";
import { useI18n } from "./LanguageContext";
import { badgeDefs } from "@/content/badges";

interface LevelInfo {
  levelNumber: number;
  name: string;
  nameEn: string;
  nextName: string | null;
  nextNameEn: string | null;
  xpIntoLevel: number;
  xpForNextLevel: number | null;
  xpToNext: number;
}

interface CourseProgressItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  totalLessons: number;
  completedLessons: number;
  nextDay?: number;
  xpEarned: number;
}

interface WeekDayItem {
  label: string;
  labelEn: string;
  done: boolean;
  isToday: boolean;
  index: number;
}

const WEEK_LETTERS_AR = ["إ", "ن", "ث", "ر", "خ", "ج", "س"];
const WEEK_LETTERS_EN = ["M", "T", "W", "T", "F", "S", "S"];

export default function ProgressClient({
  totalXp,
  streak,
  completionsCount,
  level,
  progressPercent,
  weekDays,
  hasTestimonial,
  courses,
  earnedBadgeKeys,
}: {
  totalXp: number;
  streak: number;
  completionsCount: number;
  level: LevelInfo;
  progressPercent: number;
  weekDays: WeekDayItem[];
  hasTestimonial: boolean;
  courses: CourseProgressItem[];
  earnedBadgeKeys: string[];
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const earnedKeys = new Set(earnedBadgeKeys);

  const levelName = isEn ? level.nameEn : level.name;
  const nextLevelName = isEn ? level.nextNameEn : level.nextName;

  return (
    <div className="relative mx-auto max-w-2xl px-4 pt-7 sm:pt-9 pb-16 text-neutral-900 dark:text-white" dir={isEn ? "ltr" : "rtl"}>
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-10 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />

      {/* Header Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-500/20 mb-2">
            <span>📈</span>
            <span>{isEn ? "Personal Momentum & Growth" : "لوحة التقدم والزخم اليومي"}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
            {isEn ? "My Learning Progress" : "سجل تقدّمي وإنجازاتي"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEn ? "Track your streak, earned XP, and unlock milestone badges." : "تابع سلسلة التزامك ونقاط خبرتك وتقدمك في الكورسات المفتوحة."}
          </p>
        </div>
      </div>

      {/* 1. Level Mastery Card (High Dopamine Banner) */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 text-white p-6 mb-6 shadow-xl shadow-teal-900/15 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/20 blur-xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-cyan-400/20 blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black border border-white/20">
              <span className="text-base">👑</span>
              <span>{isEn ? `Level ${level.levelNumber}` : `المستوى ${level.levelNumber}`}</span>
            </span>
            <span className="text-sm font-black text-white/95 font-mono">
              {progressPercent}% {isEn ? "to next rank" : "للرتبة التالية"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-1.5 leading-tight">
            {levelName}
          </h2>

          {nextLevelName && (
            <p className="text-xs text-white/80 mb-4 font-medium">
              {isEn
                ? `⚡ Earn +${level.xpToNext} XP to reach "${nextLevelName}"`
                : `⚡ باقٍ لك +${level.xpToNext} XP لتصل إلى رتبة "${nextLevelName}"`}
            </p>
          )}

          {/* Progress bar */}
          <div className="h-3 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-300 via-teal-200 to-white rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. 3-Stat Metric Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 text-center shadow-xs">
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono flex items-center justify-center gap-1">
            <span>💎</span>
            <span>{totalXp}</span>
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold mt-1">
            {isEn ? "Total XP" : "إجمالي XP"}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 text-center shadow-xs">
          <div className="text-2xl font-black text-amber-500 font-mono flex items-center justify-center gap-1">
            <span className="animate-pulse">🔥</span>
            <span>{streak}</span>
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold mt-1">
            {isEn ? "Day Streak" : "أيام متتالية"}
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 text-center shadow-xs">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center justify-center gap-1">
            <span>🎯</span>
            <span>{completionsCount}</span>
          </div>
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold mt-1">
            {isEn ? "Lessons Done" : "دروس مكتملة"}
          </div>
        </div>
      </div>

      {/* 3. Weekly Consistency Calendar */}
      <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>📅</span>
            <span>{isEn ? "Activity This Week" : "سجل نشاطك هذا الأسبوع"}</span>
          </span>
          <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
            {isEn ? "Consistency beats intensity" : "الاستمرارية أهم من الكثرة"}
          </span>
        </div>

        <div className="flex justify-between bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-2xl border border-black/5 dark:border-white/5">
          {weekDays.map((d, i) => (
            <WeekDot
              key={d.labelEn || i}
              label={isEn ? d.labelEn : d.label}
              letter={isEn ? WEEK_LETTERS_EN[i % 7] : WEEK_LETTERS_AR[i % 7]}
              done={d.done}
              isToday={d.isToday}
              index={d.index}
            />
          ))}
        </div>
      </div>

      {/* 4. Testimonial Prompt (if 3+ completions) */}
      {!hasTestimonial && completionsCount >= 3 && (
        <Link
          href="/app/testimonial"
          className="group mb-6 flex items-center gap-3.5 rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-5 text-white shadow-lg hover:shadow-xl transition-all"
        >
          <span className="text-3xl group-hover:scale-110 transition-transform">💬</span>
          <div className="flex-1 min-w-0">
            <span className="block text-sm font-black">
              {isEn ? "Share Your Experience with Peers" : "شارك تجربتك على حائط المجتمع"}
            </span>
            <span className="block text-xs text-white/85 mt-0.5">
              {isEn ? "Takes 1 minute — inspire another ambitious learner today!" : "دقيقة واحدة — كلماتك تلهم شخصاً آخر ليبدأ رحلته!"}
            </span>
          </div>
          <span className="text-base font-bold">{isEn ? "→" : "←"}</span>
        </Link>
      )}

      {/* 5. In-Progress Courses */}
      {courses.length > 0 && (
        <div className="mb-6">
          {/* Accredited Certificates Shelf if any course is completed */}
          {courses.some((c) => c.completedLessons >= c.totalLessons) && (
            <div className="mb-6 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-neutral-900/40 to-emerald-500/10 p-5 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎓</span>
                  <span>{isEn ? "My Verified Completion Certificates" : "شهادات الإتمام الرقمية الموثقة"}</span>
                </span>
                <span className="text-xs font-mono bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-full font-black">
                  {courses.filter((c) => c.completedLessons >= c.totalLessons).length} {isEn ? "Certificates" : "شهادات"}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courses
                  .filter((c) => c.completedLessons >= c.totalLessons)
                  .map((certCourse) => (
                    <div
                      key={certCourse.id}
                      className="rounded-2xl border border-amber-500/30 bg-white/80 dark:bg-neutral-900/80 p-3.5 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl p-2 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                          {certCourse.icon || "📜"}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-black truncate text-neutral-900 dark:text-white">
                            {isEn ? (certCourse.titleEn || certCourse.titleAr) : certCourse.titleAr}
                          </p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                            ✓ {isEn ? "100% Completed · Verified QR" : "مكتمل ١٠٠٪ · كود QR معتمد"}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/app/learn/${certCourse.slug}/certificate`}
                        className="shrink-0 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black px-3.5 py-2 shadow-xs transition-all active:scale-95"
                      >
                        {isEn ? "View ↗" : "عرض الشهادة ↗"}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📚</span>
              <span>{isEn ? "My Active Courses" : "كورساتك النشطة قيد التعلم"}</span>
            </span>
            <span className="text-xs font-mono text-neutral-400 font-bold">
              {courses.length} {isEn ? "courses" : "كورسات"}
            </span>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const percent = course.totalLessons
                ? Math.round((course.completedLessons / course.totalLessons) * 100)
                : 0;
              const courseTitle = isEn ? (course.titleEn || course.titleAr) : course.titleAr;

              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl p-4 shadow-sm hover:border-teal-500/40 transition-all"
                >
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 shrink-0">
                        {course.icon}
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/app/learn/${course.slug}`}
                          className="text-sm font-black truncate text-neutral-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 block"
                        >
                          {courseTitle}
                        </Link>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                          {course.completedLessons}/{course.totalLessons} {isEn ? "Lessons" : "درس"} · {percent}% · +{course.xpEarned} XP
                        </p>
                      </div>
                    </div>

                    {course.nextDay && course.completedLessons < course.totalLessons ? (
                      <Link
                        href={`/app/learn/${course.slug}/${course.nextDay}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white px-3.5 py-2 text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>▶️</span>
                        <span>{isEn ? `Day ${course.nextDay}` : `يوم ${course.nextDay}`}</span>
                      </Link>
                    ) : course.completedLessons >= course.totalLessons ? (
                      <Link
                        href={`/app/learn/${course.slug}/certificate`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 px-3.5 py-2 text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>🎓</span>
                        <span>{isEn ? "Certificate" : "الشهادة"}</span>
                      </Link>
                    ) : null}
                  </div>

                  <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Gamified Badges Shelf */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>🎖️</span>
            <span>
              {isEn
                ? `Achievements & Badges (${earnedKeys.size}/${badgeDefs.length})`
                : `شارات الإنجاز والتميز (${earnedKeys.size}/${badgeDefs.length})`}
            </span>
          </span>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
            {earnedKeys.size === badgeDefs.length
              ? (isEn ? "All Badges Unlocked! 🏆" : "أغلقت كل الشارات! 🏆")
              : (isEn ? "Collect them all!" : "اجمعها كلها!")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {badgeDefs.map((badge) => {
            const earned = earnedKeys.has(badge.key);
            return (
              <div
                key={badge.key}
                className={`rounded-2xl border p-3.5 flex items-center gap-3 transition-all ${
                  earned
                    ? "bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30 shadow-xs"
                    : "bg-white/50 dark:bg-neutral-900/40 border-black/5 dark:border-white/5 opacity-60"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    earned
                      ? "bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-950 shadow-md shadow-amber-500/20"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {earned ? badge.icon : "🔒"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black text-neutral-900 dark:text-white truncate">
                      {isEn ? badge.titleEn : badge.title}
                    </p>
                    {earned && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">✓</span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {isEn ? badge.descriptionEn : badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Assurance */}
      <div className="mt-8 text-center text-xs text-neutral-400 space-y-1">
        <p>
          {isEn ? "Protected by 7-Day Money-Back Guarantee · All 100 Tracks Unlocked" : "مشمول بضمان استرداد كامل خلال 7 أيام · كافة الـ 100 مسار مفتوحة"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/tracks" className="hover:text-teal-600 underline">{isEn ? "All Tracks" : "المسارات"}</Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-teal-600 underline">{isEn ? "Refund Policy" : "سياسة الاسترجاع"}</Link>
        </div>
      </div>
    </div>
  );
}
