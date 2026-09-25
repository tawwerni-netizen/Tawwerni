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
  xpEarned: number;
}

interface WeekDayItem {
  label: string;
  labelEn: string;
  done: boolean;
  isToday: boolean;
  index: number;
}

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
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">
        {isEn ? "My Progress" : "تقدّمي"}
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
        {isEn ? "Track your learning journey and momentum" : "تابع رحلتك التعليمية"}
      </p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl py-3 text-center shadow-xs">
          <div className="text-xl font-bold text-brand-800 dark:text-brand-400">{totalXp}</div>
          <div className="text-[10px] text-neutral-400">{isEn ? "Total XP" : "إجمالي XP"}</div>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl py-3 text-center shadow-xs">
          <div className="text-xl font-bold text-brand-800 dark:text-brand-400">{streak} 🔥</div>
          <div className="text-[10px] text-neutral-400">{isEn ? "Day Streak" : "أيام متتالية"}</div>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl py-3 text-center shadow-xs">
          <div className="text-xl font-bold text-brand-800 dark:text-brand-400">{completionsCount}</div>
          <div className="text-[10px] text-neutral-400">{isEn ? "Lessons Done" : "دروس مكتملة"}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 rounded-full px-2.5 py-1 font-bold">
            {isEn ? `Level ${level.levelNumber}` : `مستوى ${level.levelNumber}`}
          </span>
          <span className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{levelName}</span>
        </div>
        {nextLevelName && (
          <p className="text-xs text-neutral-400 mb-2">
            {isEn
              ? `${level.xpToNext} XP to reach "${nextLevelName}"`
              : `${level.xpToNext} XP لمستوى "${nextLevelName}"`}
          </p>
        )}
        <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-5 shadow-xs">
        <p className="text-xs text-neutral-400 mb-3 font-medium">
          {isEn ? "This Week" : "الأسبوع ده"}
        </p>
        <div className="flex justify-between">
          {weekDays.map((d) => (
            <WeekDot
              key={d.labelEn}
              label={isEn ? d.labelEn : d.label}
              done={d.done}
              isToday={d.isToday}
              index={d.index}
            />
          ))}
        </div>
      </div>

      {!hasTestimonial && completionsCount >= 3 && (
        <Link
          href="/app/testimonial"
          className="card-lift mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-l from-brand-700 to-brand-600 p-4 text-white shadow-md hover:from-brand-800 hover:to-brand-700 transition-all"
        >
          <span className="text-2xl" aria-hidden>💬</span>
          <span className="flex-1">
            <span className="block text-sm font-bold">
              {isEn ? "Share your experience" : "شارك تجربتك"}
            </span>
            <span className="block text-xs text-white/80">
              {isEn ? "1 minute — could inspire someone to start" : "دقيقة واحدة — ممكن تساعد حد يبدأ"}
            </span>
          </span>
          <span aria-hidden>{isEn ? "→" : "←"}</span>
        </Link>
      )}

      {courses.length > 0 && (
        <>
          <p className="text-xs text-neutral-400 mb-2 tracking-wide font-medium">
            {isEn ? "My Courses" : "كورساتي"}
          </p>
          <div className="space-y-2 mb-6">
            {courses.map((course) => {
              const percent = course.totalLessons
                ? Math.round((course.completedLessons / course.totalLessons) * 100)
                : 0;
              const courseTitle = isEn ? (course.titleEn || course.titleAr) : course.titleAr;
              return (
                <Link
                  key={course.id}
                  href={`/app/learn/${course.slug}`}
                  className="block bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl p-3 shadow-xs hover:border-brand-500/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{course.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-neutral-900 dark:text-neutral-100">{courseTitle}</p>
                      <p className="text-[10px] text-neutral-400">
                        {course.completedLessons}/{course.totalLessons} · {percent}% · +{course.xpEarned} XP
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${percent}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}

      <p className="text-xs text-neutral-400 mb-2 tracking-wide font-medium">
        {isEn
          ? `Badges · ${earnedKeys.size}/${badgeDefs.length}`
          : `الشارات · ${earnedKeys.size}/${badgeDefs.length}`}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {badgeDefs.map((badge) => {
          const earned = earnedKeys.has(badge.key);
          return (
            <div
              key={badge.key}
              className={`rounded-xl border p-3 flex items-center gap-2 ${
                earned
                  ? "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50"
                  : "bg-neutral-50 dark:bg-neutral-900 border-black/5 dark:border-white/5 opacity-60"
              }`}
            >
              <span className="text-xl">{earned ? badge.icon : "🔒"}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-neutral-900 dark:text-neutral-100">
                  {isEn ? badge.titleEn : badge.title}
                </p>
                <p className="text-[10px] text-neutral-400 truncate">
                  {isEn ? badge.descriptionEn : badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
