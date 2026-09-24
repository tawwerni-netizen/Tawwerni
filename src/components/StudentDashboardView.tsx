"use client";

import Link from "next/link";
import { useI18n } from "./LanguageContext";
import WeekDot from "@/components/WeekDot";
import HelpCard from "@/components/HelpCard";
import CourseTile from "@/components/CourseTile";
import ShareRow from "@/components/ShareRow";
import Greeting from "@/components/Greeting";
import ReminderPrompt from "@/components/ReminderPrompt";
import PurchasePixel from "@/components/PurchasePixel";
import MoodCheckIn from "@/components/MoodCheckIn";
import FocusPlayer from "@/components/FocusPlayer";

type Props = {
  userName: string;
  totalXp: number;
  streak: number;
  dailyPaceMinutes: number;
  weekDays: { label: string; done: boolean; isToday: boolean }[];
  activeTrack: {
    slug: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    totalDays: number;
    doneCount: number;
    nextDayNumber?: number;
    nextDayTitle?: string;
    nextDayTitleEn?: string;
    nextDayDuration?: number;
    nextDayXp?: number;
  } | null;
  tiles: {
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
  }[];
  paidOrder: { id: string; amountEgp: number } | null;
  hasCompletions: boolean;
};

export default function StudentDashboardView({
  userName,
  totalXp,
  streak,
  dailyPaceMinutes,
  weekDays,
  activeTrack,
  tiles,
  paidOrder,
  hasCompletions,
}: Props) {
  const { lang, t } = useI18n();
  const isEn = lang === "en";

  const activeTitle = isEn
    ? activeTrack?.titleEn || activeTrack?.title
    : activeTrack?.titleAr || activeTrack?.title;
  const nextLessonTitle = isEn
    ? activeTrack?.nextDayTitleEn || activeTrack?.nextDayTitle
    : activeTrack?.nextDayTitle;

  return (
    <div className="px-4 pt-5 pb-8 min-h-screen text-neutral-900 dark:text-white" dir={isEn ? "ltr" : "rtl"}>
      {paidOrder && <PurchasePixel orderId={paidOrder.id} amountEgp={paidOrder.amountEgp} />}
      
      {/* Header Greeting */}
      <Greeting className="mb-1 text-xs tracking-wide text-neutral-500 dark:text-neutral-400 font-semibold" />
      <h1 className="text-2xl font-black mb-1 md:text-3xl text-neutral-900 dark:text-white">
        {isEn ? (
          <>
            Welcome back, <span className="text-teal-600 dark:text-teal-400 font-extrabold">{userName || "Champion"}</span> 👋
          </>
        ) : (
          <>
            أهلًا بك، <span className="text-teal-600 dark:text-teal-400 font-extrabold">{userName || "يا بطل"}</span> 👋
          </>
        )}
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">
        {isEn
          ? "Ready to conquer today's practical milestone in Tawwerni?"
          : "جاهز لإنجاز خطوة اليوم في طوّرني؟"}
      </p>

      {/* Psychological Well-being & Mood Check-in */}
      <MoodCheckIn />
      <FocusPlayer />

      {/* Main Grid: Active Mission + Weekly Streak */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        {activeTrack && (
          <div className="animate-rise rounded-3xl bg-gradient-to-l from-teal-700 to-emerald-600 text-white p-5 shadow-lg relative overflow-hidden">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
            
            <div className="mb-2 flex items-center justify-between text-xs text-white/90">
              <span className="font-bold">{isEn ? "Today's Practical Mission" : "مهمة اليوم التطبيقية"}</span>
              <span className="font-mono bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
                {activeTrack.doneCount}/{activeTrack.totalDays} {isEn ? "Days" : "يوم"}
              </span>
            </div>

            {activeTrack.nextDayNumber ? (
              <>
                <h2 className="text-lg font-bold mb-1 text-white">
                  {isEn
                    ? `Day ${activeTrack.nextDayNumber} · ${nextLessonTitle || "Practical Step"}`
                    : `يوم ${activeTrack.nextDayNumber} · ${nextLessonTitle || "خطوة تطبيقية"}`}
                </h2>
                <p className="mb-4 text-xs text-white/80">
                  {activeTitle} · {activeTrack.nextDayDuration || 5} {isEn ? "mins" : "دقايق"} · {activeTrack.nextDayXp || 75} XP
                </p>
                <Link
                  href={`/app/learn/${activeTrack.slug}/${activeTrack.nextDayNumber}`}
                  className="btn-ghost-shine cta-btn-white block text-center font-bold rounded-full py-3 text-sm shadow-md active:scale-98 transition-all"
                >
                  {isEn ? `Continue · Day ${activeTrack.nextDayNumber} →` : `كمّل · يوم ${activeTrack.nextDayNumber} ←`}
                </Link>
              </>
            ) : (
              <>
                <h2 className="mb-1 text-lg font-bold text-white">
                  {isEn ? `Completed ${activeTitle}! 🎉` : `خلّصت ${activeTitle}! 🎉`}
                </h2>
                <p className="mb-4 text-xs text-white/80">
                  {isEn
                    ? "Your certificate is ready, and all 100 tracks are open for you."
                    : "شهادتك جاهزة، وكل الـ ١٠٠ مسار مفتوحة ليك بالكامل."}
                </p>
                <Link
                  href={`/app/learn/${activeTrack.slug}/certificate`}
                  className="btn-ghost-shine cta-btn-white block rounded-full py-3 text-center text-sm font-bold shadow-md active:scale-98 transition-all"
                >
                  {isEn ? "Claim Your Verified Certificate 🎓" : "استلم شهادتك المعتمدة 🎓"}
                </Link>
              </>
            )}
          </div>
        )}

        {/* Weekly Activity Box */}
        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 p-5 shadow-xs">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 font-semibold uppercase tracking-wider">
            {isEn ? "Your Activity This Week" : "نشاطك هذا الأسبوع"}
          </p>
          <div className="flex justify-between mb-4">
            {weekDays.map((d, i) => (
              <WeekDot key={d.label} label={d.label} done={d.done} isToday={d.isToday} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl py-3 border border-black/5 dark:border-neutral-700/40">
              <div className="text-lg font-bold text-teal-700 dark:text-teal-400 font-mono">{totalXp}</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                {isEn ? "Earned XP" : "XP المكتسبة"}
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl py-3 border border-black/5 dark:border-neutral-700/40">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{streak} 🔥</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                {isEn ? "Day Streak" : "أيام متتالية"}
              </div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-2xl py-3 border border-black/5 dark:border-neutral-700/40">
              <div className="text-lg font-bold text-teal-700 dark:text-teal-400 font-mono">{dailyPaceMinutes}</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                {isEn ? "Min/Day" : "دقيقة/يوم"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReminderPrompt hasCompletions={hasCompletions} />
      <HelpCard className="mb-6" />

      {/* 100 Tracks Showcase Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="text-lg font-black text-neutral-900 dark:text-white">
            {isEn ? "Your Unlocked Tracks (All 100 Tracks)" : "مساراتك المفتوحة (١٠٠ مسار كامل)"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {isEn
              ? "Your membership grants all-inclusive access to all 100 tracks across 10 vital disciplines."
              : "اشتراكك يمنحك وصولًا شاملاً لجميع المسارات الـ 100 في 10 مجالات حيوية"}
          </p>
        </div>
        <Link
          href="/app/learn"
          className="tap inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-all shadow-2xs"
        >
          <span>{isEn ? "Browse All 100 Tracks" : "تصفح كل الـ 100 مسار"}</span>
          <span>{isEn ? "→" : "←"}</span>
        </Link>
      </div>

      {/* Course Tiles Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tiles.map((t) => (
          <CourseTile key={t.slug} {...t} />
        ))}
      </div>

      <ShareRow className="mt-8" />
    </div>
  );
}
