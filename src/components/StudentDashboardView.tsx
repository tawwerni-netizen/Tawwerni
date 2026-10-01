"use client";

import { useState } from "react";
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
  weekDays: { label: string; labelAr?: string; labelEn?: string; done: boolean; isToday: boolean }[];
  activeTrack: {
    slug: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    icon?: string;
    totalDays: number;
    doneCount: number;
    nextDayNumber?: number;
    nextDayTitle?: string;
    nextDayTitleEn?: string;
    nextDayDuration?: number;
    nextDayXp?: number;
  } | null;
  inProgressTracks?: {
    slug: string;
    title: string;
    titleAr?: string;
    titleEn?: string;
    icon: string;
    totalDays: number;
    doneCount: number;
    percent: number;
    nextDayNumber: number;
    nextDayTitle: string;
    nextDayTitleEn: string;
  }[];
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

const WEEK_LETTERS_EN = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_LETTERS_AR = ["ا", "ث", "أ", "خ", "ج", "س", "أ"];
const WEEK_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_LABELS_AR = ["اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"];

export default function StudentDashboardView({
  userName,
  totalXp,
  streak,
  dailyPaceMinutes,
  weekDays,
  activeTrack,
  inProgressTracks = [],
  tiles,
  paidOrder,
  hasCompletions,
}: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const [tileSearch, setTileSearch] = useState("");

  const activeTitle = isEn
    ? activeTrack?.titleEn || activeTrack?.title
    : activeTrack?.titleAr || activeTrack?.title;
  const nextLessonTitle = isEn
    ? activeTrack?.nextDayTitleEn || activeTrack?.nextDayTitle
    : activeTrack?.nextDayTitle;

  // Filtered tiles if search is used
  const filteredTiles = tileSearch.trim()
    ? tiles.filter((t) => {
        const q = tileSearch.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          (t.titleEn && t.titleEn.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q) ||
          (t.categoryEn && t.categoryEn.toLowerCase().includes(q))
        );
      })
    : tiles;

  // Calculate student level tier for dopamine
  const studentLevel = totalXp >= 2000 ? (isEn ? "Elite Master 👑" : "خبير النخبة 👑")
    : totalXp >= 1000 ? (isEn ? "Advanced Pro ⚡" : "محترف متقدم ⚡")
    : totalXp >= 400 ? (isEn ? "Active Explorer 🚀" : "مستكشف نشط 🚀")
    : (isEn ? "Rising Pioneer 🌱" : "رائد واعد 🌱");

  return (
    <div className="relative px-4 pt-6 sm:pt-8 pb-16 min-h-screen text-neutral-900 dark:text-white" dir={isEn ? "ltr" : "rtl"}>
      {paidOrder && <PurchasePixel orderId={paidOrder.id} amountEgp={paidOrder.amountEgp} />}

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 h-96 w-96 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none fixed bottom-1/3 right-10 h-80 w-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl -z-10" />

      {/* Header Greeting & Dopamine Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Greeting className="text-xs font-black tracking-wider uppercase text-teal-600 dark:text-teal-400" />
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {studentLevel}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-tight">
            {isEn ? (
              <>
                Welcome back, <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent font-extrabold">{userName || "Champion"}</span> 👋
              </>
            ) : (
              <>
                أهلًا بك، <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent font-extrabold">{userName || "يا بطل"}</span> 👋
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {isEn
              ? "15 focused minutes today builds an unstoppable career tomorrow."
              : "١٥ دقيقة تركيز اليوم تصنع مستقبلك المهني وتضاعف مهاراتك خطوة بخطوة."}
          </p>
        </div>

        {/* Quick Streak Dopamine Badge */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 border border-teal-500/30 dark:border-teal-400/20 rounded-2xl p-3 px-4 shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/30 animate-pulse">
            🔥
          </div>
          <div>
            <div className="text-base font-black text-neutral-900 dark:text-white leading-none">
              {streak} {isEn ? "Days" : "أيام"}
            </div>
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {streak > 0
                ? (isEn ? "Streak Burning! Keep going" : "سلسلتك مشتعلة! استمر")
                : (isEn ? "Start your streak today!" : "ابدأ سلسلة نجاحك اليوم!")}
            </div>
          </div>
        </div>
      </div>

      {/* Psychological Well-being & Focus Section */}
      <div className="space-y-4 mb-6">
        <MoodCheckIn />
        <FocusPlayer />
      </div>

      {/* Main Grid: Radiant Active Mission + High-Energy Weekly Progress */}
      <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-stretch">
        {/* Active Mission Card (7 cols) */}
        {activeTrack && (
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 text-white p-6 sm:p-7 shadow-xl shadow-teal-900/20 relative overflow-hidden flex flex-col justify-between border border-teal-400/30">
            {/* Ambient inner glows */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-400/25 blur-2xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-2xl" />

            <div>
              {/* Header inside card */}
              <div className="mb-4 flex items-center justify-between text-xs text-white/90">
                <span className="font-bold flex items-center gap-2 bg-black/25 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                  </span>
                  <span>{isEn ? "Mission In Progress" : "مهمتك الحالية المتزامنة"}</span>
                </span>
                <span className="font-mono bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black">
                  {activeTrack.doneCount}/{activeTrack.totalDays} {isEn ? "Days Complete" : "يوم مكتمل"}
                </span>
              </div>

              {activeTrack.nextDayNumber ? (
                <>
                  <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white mb-3 border border-white/10">
                    <span className="text-base">{activeTrack.icon || "⚡"}</span>
                    <span className="truncate max-w-[280px]">{activeTitle}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black mb-2 text-white leading-tight">
                    {isEn
                      ? `Day ${activeTrack.nextDayNumber} · ${nextLessonTitle || "Practical Milestone"}`
                      : `اليوم ${activeTrack.nextDayNumber} · ${nextLessonTitle || "خطوة تطبيقية عملية"}`}
                  </h2>

                  {/* Micro stats tag pills */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs">
                      <span>⏱️</span>
                      <span>{activeTrack.nextDayDuration || 5} {isEn ? "mins" : "دقايق تركيز"}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/20 border border-white/30 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-xs">
                      <span className="text-sm">💎</span>
                      <span className="tracking-wide">+{activeTrack.nextDayXp || 75} XP</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs">
                      <span>🎯</span>
                      <span>{isEn ? "Day 1 Free" : "تطبيق عملي فوري"}</span>
                    </span>
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <h2 className="text-xl sm:text-2xl font-black mb-2 text-white">
                    {isEn ? `Completed ${activeTitle}! 🎉` : `أتممت ${activeTitle} بنجاح باهر! 🎉`}
                  </h2>
                  <p className="mb-6 text-xs sm:text-sm text-white/85 leading-relaxed">
                    {isEn
                      ? "Congratulations! Your verified certificate is unlocked, and 99 other career tracks await your exploration."
                      : "ألف مبروك! شهادتك المعتمدة جاهزة للتحميل، ولديك ٩٩ مسارًا مهنيًا آخر مفتوحًا بالكامل في اشتراكك."}
                  </p>
                </div>
              )}
            </div>

            {/* Radiant CTA Button */}
            {activeTrack.nextDayNumber ? (
              <Link
                href={`/app/learn/${activeTrack.slug}/${activeTrack.nextDayNumber}`}
                style={{ backgroundColor: '#ffffff', color: '#042f2e', border: '2px solid #34d399' }}
                className="btn-resume-mission group relative overflow-hidden rounded-2xl font-black py-4 px-6 text-center text-sm sm:text-base active:scale-98 transition-all flex items-center justify-center gap-2.5 shadow-2xl"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🚀</span>
                <span style={{ color: '#042f2e', fontWeight: 900 }}>
                  {isEn
                    ? `Resume Lesson · Day ${activeTrack.nextDayNumber} →`
                    : `استئناف درس اليوم · اليوم ${activeTrack.nextDayNumber} ←`}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            ) : (
              <Link
                href={`/app/learn/${activeTrack.slug}/certificate`}
                style={{ color: '#451a03' }}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 text-amber-950 font-black py-4 px-6 text-center text-sm sm:text-base shadow-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>🎓</span>
                <span style={{ color: '#451a03' }}>{isEn ? "Claim Verified Certificate Now →" : "استلم شهادتك المعتمدة فوراً ←"}</span>
              </Link>
            )}
          </div>
        )}

        {/* Weekly Activity Box & Stats (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span>📅</span>
                <span>{isEn ? "Weekly Activity Streak" : "نشاطك والتزامك هذا الأسبوع"}</span>
              </span>
              <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/20">
                {isEn ? "Daily Habit" : "عادة يومية"}
              </span>
            </div>

            <div className="flex justify-between mb-6 bg-neutral-50 dark:bg-neutral-800/40 p-3 rounded-2xl border border-black/5 dark:border-white/5">
              {weekDays.map((d, i) => (
                <WeekDot
                  key={isEn ? (WEEK_LABELS_EN[i] ?? i) : (WEEK_LABELS_AR[i] ?? i)}
                  label={isEn ? (d.labelEn || WEEK_LABELS_EN[i]) : (d.labelAr || WEEK_LABELS_AR[i])}
                  letter={isEn ? WEEK_LETTERS_EN[i] : WEEK_LETTERS_AR[i]}
                  done={d.done}
                  isToday={d.isToday}
                  index={i}
                />
              ))}
            </div>
          </div>

          {/* Gamified 3-Card Stat Metrics */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/30 dark:to-neutral-900 rounded-2xl p-3 border border-teal-500/20 shadow-xs">
              <div className="text-xl font-black text-teal-700 dark:text-teal-400 font-mono flex items-center justify-center gap-1">
                <span>💎</span>
                <span>{totalXp}</span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-1">
                {isEn ? "Total XP" : "نقاط الخبرة"}
              </div>
            </div>

            <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-neutral-900 rounded-2xl p-3 border border-amber-500/20 shadow-xs">
              <div className="text-xl font-black text-amber-600 dark:text-amber-400 font-mono flex items-center justify-center gap-1">
                <span>🔥</span>
                <span>{streak}</span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-1">
                {isEn ? "Streak Days" : "أيام متتالية"}
              </div>
            </div>

            <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-neutral-900 rounded-2xl p-3 border border-emerald-500/20 shadow-xs">
              <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono flex items-center justify-center gap-1">
                <span>⚡</span>
                <span>{dailyPaceMinutes}</span>
              </div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-1">
                {isEn ? "Mins / Day" : "دقيقة / يوم"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* In-Progress Tracks Shelf */}
      {inProgressTracks.length > 0 && (
        <div className="mb-8 rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span>{isEn ? "Your In-Progress Tracks" : "مساراتك قيد التعلّم النشطة"}</span>
            </h3>
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono font-bold bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-black/5 dark:border-white/5">
              {inProgressTracks.length} {isEn ? "active courses" : "مسارات نشطة"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressTracks.map((t) => {
              const trackTitle = isEn ? t.titleEn : t.titleAr;
              return (
                <div
                  key={t.slug}
                  className="rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50/80 dark:bg-neutral-800/50 p-4 flex flex-col justify-between gap-3.5 hover:border-teal-500/40 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/5 shadow-2xs">
                        {t.icon}
                      </span>
                      <h4 className="text-xs sm:text-sm font-black truncate text-neutral-900 dark:text-neutral-100 flex-1">
                        {trackTitle}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1.5 font-bold">
                      <span>{isEn ? `Next: Day ${t.nextDayNumber}` : `التالي: يوم ${t.nextDayNumber}`}</span>
                      <span className="font-mono text-teal-600 dark:text-teal-400">{t.doneCount}/{t.totalDays} ({t.percent}%)</span>
                    </div>

                    {/* Progress bar with glow */}
                    <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                        style={{ width: `${t.percent}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/app/learn/${t.slug}/${t.nextDayNumber}`}
                    className="rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black py-2.5 px-3 text-center shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>▶️</span>
                    <span>{isEn ? `Resume Day ${t.nextDayNumber}` : `استئناف يوم ${t.nextDayNumber}`}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reminder & Help Prompts */}
      <div className="mb-8 space-y-4">
        <ReminderPrompt hasCompletions={hasCompletions} />
        <HelpCard />
      </div>

      {/* 100 Tracks Showcase Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-500/20 px-3 py-1 rounded-full mb-2">
            <span>✨</span>
            <span>{isEn ? "100 Tracks · All 10 Vital Pillars" : "الكتالوج الكامل · 100 مسار مفتوحة مجاناً في باقتك"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            {isEn ? "Your Unlocked Catalog" : "جميع مساراتك التخصصية (١٠٠ مسار كامل)"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEn
              ? "Your annual membership grants unlimited access to all 100 tracks. Start any track anytime."
              : "اشتراكك السنوي يمنحك وصولاً شاملاً وغير محدود لكافة المسارات. ابدأ أي مسار في أي وقت بحرية تامة."}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* Quick search input */}
          <input
            type="text"
            value={tileSearch}
            onChange={(e) => setTileSearch(e.target.value)}
            placeholder={isEn ? "Search tracks..." : "ابحث في المسارات..."}
            className="rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-teal-500 shadow-2xs w-44 sm:w-56"
          />

          <Link
            href="/app/learn"
            className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 text-xs font-bold shadow-md shadow-teal-500/15 active:scale-95 transition-all shrink-0"
          >
            <span>{isEn ? "All Tracks" : "تصفح الكل"}</span>
            <span>{isEn ? "→" : "←"}</span>
          </Link>
        </div>
      </div>

      {/* Course Tiles Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filteredTiles.map((t) => (
          <CourseTile key={t.slug} {...t} />
        ))}
      </div>

      {filteredTiles.length === 0 && (
        <div className="text-center py-12 rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 mt-4">
          <p className="text-sm font-bold text-neutral-500">
            {isEn ? "No tracks match your search." : "لا توجد مسارات مطابقة لبحثك."}
          </p>
        </div>
      )}

      {/* Viral Referral & Share Row */}
      <ShareRow className="mt-10" />

      {/* 48-Hour Guarantee Peace-of-Mind Bar */}
      <div className="mt-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-black/5 dark:border-white/10 p-4 text-center text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        <span className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
          <span>🛡️</span>
          <span>{isEn ? "48-Hour 100% Money-Back Guarantee" : "ضمان استرداد كامل بنسبة 100% خلال 48 ساعة"}</span>
        </span>
        <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
        <span>{isEn ? "VIP WhatsApp Support Active 24/7" : "دعم فني مباشر على الواتساب على مدار الساعة"}</span>
        <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
        <Link href="/refund" className="underline hover:text-teal-600 font-medium">
          {isEn ? "Refund Policy" : "سياسة الاسترجاع"}
        </Link>
      </div>
    </div>
  );
}
