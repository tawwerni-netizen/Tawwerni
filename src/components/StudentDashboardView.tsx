"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "./LanguageContext";
import WeekDot from "@/components/WeekDot";
import HelpCard from "@/components/HelpCard";
import CourseTile from "@/components/CourseTile";
import ShareRow from "@/components/ShareRow";
import PurchasePixel from "@/components/PurchasePixel";
import MoodCheckIn from "@/components/MoodCheckIn";
import FocusPlayer from "@/components/FocusPlayer";
import SkillTreeView from "@/components/SkillTreeView";
import ProjectsShowcase, { DemonstratedProject } from "@/components/ProjectsShowcase";
import { TrackSkillTree, SkillNode } from "@/content/skill-trees";
import { ResolvedCareerPathProgress } from "@/lib/career-paths-progress";

type Props = {
  userName: string;
  totalXp: number;
  streak: number;
  currentDayNumber: number;
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
  targetSkill: SkillNode;
  skillTree: TrackSkillTree;
  weakSkill: SkillNode | null;
  demonstratedProjects: DemonstratedProject[];
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
  activeCareerPathProgress?: ResolvedCareerPathProgress | null;
};

const WEEK_LETTERS_EN = ["M", "T", "W", "T", "F", "S", "S"];
const WEEK_LETTERS_AR = ["ا", "ث", "أ", "خ", "ج", "س", "أ"];
const WEEK_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_LABELS_AR = ["اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"];

export default function StudentDashboardView({
  userName,
  totalXp,
  streak,
  currentDayNumber,
  dailyPaceMinutes,
  weekDays,
  activeTrack,
  targetSkill,
  skillTree,
  weakSkill,
  demonstratedProjects,
  inProgressTracks = [],
  tiles,
  paidOrder,
  hasCompletions,
  activeCareerPathProgress,
}: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [greetingTime, setGreetingTime] = useState<"morning" | "evening">("evening");
  const [showCatalog, setShowCatalog] = useState(false);
  const [tileSearch, setTileSearch] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreetingTime(hour >= 4 && hour < 14 ? "morning" : "evening");
  }, []);

  const dayFormatted = String(currentDayNumber).padStart(2, "0");
  const activeTitle = isEn
    ? activeTrack?.titleEn || activeTrack?.title
    : activeTrack?.titleAr || activeTrack?.title;

  const nextMissionTitle = isEn
    ? activeTrack?.nextDayTitleEn || activeTrack?.nextDayTitle || "Practical Milestone Mission"
    : activeTrack?.nextDayTitle || "مهمة اليوم التطبيقية";

  const nextMissionDuration = activeTrack?.nextDayDuration || 12;

  // Student level tier for status
  const studentLevel =
    totalXp >= 2000
      ? isEn ? "Elite Practitioner 👑" : "ممارس النخبة 👑"
      : totalXp >= 1000
      ? isEn ? "Advanced Pro ⚡" : "محترف متقدم ⚡"
      : totalXp >= 400
      ? isEn ? "Active Explorer 🚀" : "مستكشف نشط 🚀"
      : isEn ? "Rising Pioneer 🌱" : "رائد واعد 🌱";

  // Filtered tiles if catalog search is used
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

  return (
    <div
      className="relative mx-auto max-w-5xl px-4 pt-6 sm:pt-8 pb-20 min-h-screen text-neutral-900 dark:text-white font-sans"
      dir={isEn ? "ltr" : "rtl"}
    >
      {paidOrder && <PurchasePixel orderId={paidOrder.id} amountEgp={paidOrder.amountEgp} />}

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 h-96 w-96 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none fixed bottom-1/3 right-10 h-80 w-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/10 blur-3xl -z-10" />

      {/* ================= 1. GREETING & STATUS HEADER ================= */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-wider uppercase text-teal-600 dark:text-teal-400">
              {greetingTime === "morning"
                ? isEn ? "Good morning" : "صباح الخير"
                : isEn ? "Good evening" : "مساء الخير"}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              {studentLevel}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-tight">
            {isEn ? (
              <>
                {greetingTime === "morning" ? "Good morning" : "Good evening"},{" "}
                <span className="text-teal-600 dark:text-teal-400 font-extrabold">{userName || "Champion"}</span> 👋
              </>
            ) : (
              <>
                {greetingTime === "morning" ? "صباح الخير" : "مساء الخير"}،{" "}
                <span className="text-teal-600 dark:text-teal-400 font-extrabold">{userName || "يا بطل"}</span> 👋
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {isEn
              ? "The system has calibrated your next milestone. One mission at a time."
              : "النظام قام بمعايرة مهمتك التالية بدقة. مهمة واحدة تلو الأخرى حتى الإتقان الكامل."}
          </p>
        </div>

        {/* Live Streak & Day Tracker */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-3 px-4 shrink-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20">
            🔥
          </div>
          <div>
            <div className="text-base font-black text-neutral-900 dark:text-white leading-none font-mono">
              {isEn ? `Day ${dayFormatted}` : `اليوم ${dayFormatted}`}
            </div>
            <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {streak > 0
                ? isEn ? `${streak}-Day Streak Active` : `${streak} أيام التزام مستمر`
                : isEn ? "Start today's streak" : "ابدأ سلسلة التزامك اليوم"}
            </div>
          </div>
        </div>
      </header>

      {/* ================= 2. YOUR NEXT MISSION (THE HERO FOCUS) ================= */}
      {activeTrack && (
        <section className="mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-teal-900 via-[#0a1e19] to-[#071310] text-white p-6 sm:p-8 shadow-2xl border-2 border-teal-400/40 relative overflow-hidden">
            {/* Ambient inner glows */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />

            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-black">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>{isEn ? "YOUR NEXT MISSION" : "مهمتك التالية الآن"}</span>
              </span>

              <span className="text-xs font-bold text-teal-200/90 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                {activeTrack.icon || "⚡"} {activeTitle}
              </span>
            </div>

            {/* Mission Title */}
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
              {nextMissionTitle}
            </h2>

            {/* 3 High-Contrast Feature Pills */}
            <div className="flex flex-wrap items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 px-3.5 py-1.5 rounded-xl text-xs font-bold text-neutral-100 shadow-xs">
                <span>⏱️</span>
                <span>{nextMissionDuration} {isEn ? "min" : "دقيقة"}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-teal-500/20 border border-teal-400/40 px-3.5 py-1.5 rounded-xl text-xs font-black text-teal-200 shadow-xs">
                <span>{targetSkill.icon}</span>
                <span>{isEn ? `Skill: ${targetSkill.nameEn}` : `المهارة: ${targetSkill.nameAr}`}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 bg-amber-500/20 border border-amber-400/40 px-3.5 py-1.5 rounded-xl text-xs font-mono font-black text-amber-200 shadow-xs">
                <span>💎</span>
                <span>Reward: +180 XP</span>
              </span>
            </div>

            {/* Dominant CTA Button */}
            <Link
              href={`/app/learn/${activeTrack.slug}/${currentDayNumber}`}
              style={{ backgroundColor: "#ffffff", color: "#042f2e" }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-sm sm:text-base hover:brightness-105 active:scale-98 transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              <span className="text-xl">🚀</span>
              <span style={{ color: "#042f2e", fontWeight: 900 }}>
                {isEn ? "START MISSION →" : "ابدأ المهمة الآن ←"}
              </span>
            </Link>
          </div>
        </section>
      )}

      {/* ================= 2.5 ACTIVE CAREER PATH ROADMAP CARD ================= */}
      {activeCareerPathProgress && (
        <section className="mb-8 rounded-3xl border border-teal-500/25 bg-white dark:bg-neutral-900/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${activeCareerPathProgress.careerPath.accentGradient} text-2xl text-white shadow-xs`}
              >
                {activeCareerPathProgress.careerPath.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                    🧭 {isEn ? "Your Active Career Roadmap" : "مسارك المهني المعتمد"}
                  </span>
                  <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-2xs font-black text-teal-700 dark:text-teal-300">
                    {activeCareerPathProgress.percent}%
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white mt-0.5">
                  {isEn
                    ? activeCareerPathProgress.careerPath.titleEn
                    : activeCareerPathProgress.careerPath.titleAr}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {activeCareerPathProgress.currentStage
                    ? (isEn
                        ? `Current: ${activeCareerPathProgress.currentStage.stage.titleEn} (${activeCareerPathProgress.completedTracksCount}/${activeCareerPathProgress.totalTracksCount} tracks)`
                        : `المحطة الحالية: ${activeCareerPathProgress.currentStage.stage.titleAr} (${activeCareerPathProgress.completedTracksCount}/${activeCareerPathProgress.totalTracksCount} مسارات منجزة)`)
                    : (isEn ? "All stages completed" : "تمت جميع المراحل بنجاح")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/career-paths/${activeCareerPathProgress.careerPath.slug}`}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs px-4 py-2.5 transition-all shadow-md shadow-teal-500/20 hover:scale-[1.02] active:scale-98"
              >
                <span>{isEn ? "Roadmap Timeline" : "خارطة الطريق"}</span>
                <span>➔</span>
              </Link>
              <Link
                href="/app/inventory"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs px-3.5 py-2.5 transition-all border border-emerald-500/25"
              >
                <span>📚</span>
                <span>{isEn ? "My Library" : "مكتبتي"}</span>
              </Link>
              <Link
                href="/career-paths"
                className="inline-flex items-center gap-1 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 font-bold text-xs px-3 py-2.5 transition-all border border-black/5 dark:border-white/10"
              >
                <span>🧭</span>
                <span>{isEn ? "All Paths" : "كافة المسارات"}</span>
              </Link>
            </div>
          </div>

          {/* Gamified Mini Milestones Stepper Strip */}
          <div className="mt-4 pt-3.5 border-t border-black/5 dark:border-white/10">
            <div className="flex items-center justify-between text-2xs mb-2">
              <span className="font-extrabold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                <span>📍</span>
                <span>{isEn ? "Milestone Journey Track:" : "مسار المحطات التدريبية:"}</span>
              </span>
              <span className="font-mono font-black text-teal-700 dark:text-teal-300">
                {activeCareerPathProgress.completedTracksCount} / {activeCareerPathProgress.totalTracksCount} {isEn ? "Tracks Mastered" : "مسارات متقنة"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {activeCareerPathProgress.stagesProgress.map((sp, idx) => (
                <div key={sp.stageId} className="flex items-center gap-1.5 shrink-0">
                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-3xs font-black transition-all ${
                      sp.isCompleted
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 shadow-2xs"
                        : sp.isCurrent
                        ? "bg-teal-500/20 border-2 border-teal-400 text-teal-800 dark:text-teal-200 ring-2 ring-teal-400/20 animate-node-pulse shadow-xs"
                        : "bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-neutral-400"
                    }`}
                  >
                    <span>{sp.isCompleted ? "✓" : sp.isCurrent ? "⚡" : `0${idx + 1}`}</span>
                    <span className="max-w-[120px] truncate">{isEn ? sp.stage.titleEn.split(":")[0] : sp.stage.titleAr.split(":")[0]}</span>
                  </div>
                  {idx < activeCareerPathProgress.stagesProgress.length - 1 && (
                    <span className="text-3xs text-neutral-300 dark:text-neutral-700 font-bold">➔</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mini progress line */}
          <div className="mt-3.5 h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all duration-500 rounded-full"
              style={{ width: `${activeCareerPathProgress.percent}%` }}
            />
          </div>
        </section>
      )}

      {/* Focus & Well-being Tools Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <FocusPlayer />
        <MoodCheckIn />
      </div>

      {/* ================= 3. CURRENT SKILLS (VISUAL SKILL MAP) ================= */}
      <section className="mb-8">
        <SkillTreeView tree={skillTree} />
      </section>

      {/* ================= 4. RECENT PROGRESS ================= */}
      <section className="mb-8 rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-5 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              {isEn ? "HABIT CONSISTENCY" : "سجل نشاطك والتزامك"}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mt-0.5">
              {isEn ? "Weekly Execution Rhythm" : "وتيرة التنفيذ والتطبيق الأسبوعي"}
            </h3>
          </div>
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
            {streak} {isEn ? "Days in a row" : "أيام متتالية"}
          </span>
        </div>

        <div className="flex justify-between bg-neutral-50 dark:bg-neutral-800/40 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 mb-4">
          {weekDays.map((d, i) => (
            <WeekDot
              key={isEn ? WEEK_LABELS_EN[i] ?? i : WEEK_LABELS_AR[i] ?? i}
              label={isEn ? d.labelEn || WEEK_LABELS_EN[i] : d.labelAr || WEEK_LABELS_AR[i]}
              letter={isEn ? WEEK_LETTERS_EN[i] : WEEK_LETTERS_AR[i]}
              done={d.done}
              isToday={d.isToday}
              index={i}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 p-3 border border-teal-500/20">
            <div className="text-lg sm:text-xl font-black text-teal-700 dark:text-teal-400 font-mono">
              {totalXp} XP
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
              {isEn ? "Total Experience" : "إجمالي نقاط الخبرة"}
            </div>
          </div>

          <div className="rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 p-3 border border-amber-500/20">
            <div className="text-lg sm:text-xl font-black text-amber-700 dark:text-amber-400 font-mono">
              {activeTrack?.doneCount || 0} / {activeTrack?.totalDays || 24}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
              {isEn ? "Missions Completed" : "مهمة منجزة"}
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 p-3 border border-emerald-500/20">
            <div className="text-lg sm:text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
              {dailyPaceMinutes} {isEn ? "m/d" : "د/يوم"}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold mt-0.5">
              {isEn ? "Daily Habit Pace" : "الوتيرة اليومية"}
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. PROJECTS (PROOF OF WORK) ================= */}
      <section className="mb-8">
        <ProjectsShowcase projects={demonstratedProjects} />
      </section>

      {/* ================= 6. WEAK SKILL (TARGETED REINFORCEMENT) ================= */}
      <section className="mb-8">
        {weakSkill ? (
          <div className="rounded-3xl border border-amber-400/40 bg-gradient-to-r from-amber-500/10 via-neutral-50 dark:via-neutral-900/60 to-amber-500/10 p-5 sm:p-6 backdrop-blur-md shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-600 dark:text-amber-300 flex items-center justify-center text-2xl shrink-0">
                🎯
              </span>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                  {isEn ? "SKILL REINFORCEMENT" : "نقطة تركيز للتطوير والتقوية"}
                </span>
                <h3 className="text-base font-black text-neutral-900 dark:text-white mt-0.5">
                  {isEn ? weakSkill.nameEn : weakSkill.nameAr}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-lg leading-relaxed">
                  {isEn
                    ? "You are progressing well! Reinforcing this skill with a quick 3-minute challenge will elevate your mastery score to 100%."
                    : "أداؤك ممتاز! تقوية هذه المهارة بتطبيق سريع مدته ٣ دقائق سيرفع معدل إتقانك المثبت بنسبة ١٠٠٪."}
                </p>
              </div>
            </div>

            <Link
              href={`/app/learn/${activeTrack?.slug || "tahaddi-28-yawm"}/${weakSkill.unlockedAtDay}`}
              className="shrink-0 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs px-5 py-3 text-center shadow-md active:scale-95 transition"
            >
              {isEn ? "Reinforce Skill (3 Mins) →" : "تقوية المهارة (٣ دقائق) ←"}
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-5 flex items-center gap-3.5 text-xs text-neutral-700 dark:text-neutral-300">
            <span className="text-2xl">🌟</span>
            <div>
              <p className="font-black text-emerald-700 dark:text-emerald-400">
                {isEn ? "Balanced Competency Profile" : "أداء استثنائي ومتوازن"}
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] mt-0.5">
                {isEn
                  ? "All demonstrated skills are in solid standing. Keep your momentum going on today's mission!"
                  : "كافة المهارات المكتسبة في سجلّك تحقق درجات إتقان مرتفعة. حافظ على وتيرتك في مهمة اليوم!"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ================= 7. NEXT UNLOCK ================= */}
      <section className="mb-8 rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl shrink-0">
            🔓
          </span>
          <div>
            <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
              {isEn ? "UPCOMING MILESTONE" : "المحطة القادمة في مسارك"}
            </span>
            <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white mt-0.5">
              {isEn
                ? "Final Capstone Deliverable & Verifiable Credential"
                : "مشروع التخرج العملي (Capstone) وتوثيق شهادة الإتمام الرقمية"}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isEn
                ? "Completing your remaining daily missions unlocks your verified portfolio showcase and QR credential."
                : "إتمام المهام القادمة يفتح بورتفوليو أعمالك العام الموثق مع كود الاعتماد الرسمي."}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full shrink-0">
          Day {currentDayNumber + 1}
        </span>
      </section>

      {/* VIP 10,000 Prompts Vault Quick Access */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-neutral-100/80 dark:via-neutral-900/60 to-emerald-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md shadow-xs mb-8">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-neutral-950 flex items-center justify-center text-2xl shrink-0 shadow-md shadow-amber-500/20">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                {isEn ? "VIP Members Vault" : "خزنة الـ VIP الحصرية"}
              </span>
              <span className="rounded-md bg-amber-400 text-neutral-950 px-2 py-0.5 text-[10px] font-black">
                +10,000 Prompts
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white leading-snug">
              {isEn
                ? "Executive 10,000 Corporate Prompts Vault + Legal Contracts"
                : "بنك الـ 10,000 برومبت التنفيذي للشركات + حزمة عقود الفريلانس"}
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isEn
                ? "Copy-pasteable executive prompts + 5 bilingual freelance contracts ready for instant download."
                : "١٠٠ مجال شركات × ١٠٠ برومبت تنفيذي جاهز للنسخ + ٥ عقود عمل حر تحمي أتعابك قانونياً."}
            </p>
          </div>
        </div>

        <Link
          href="/app/vip-vault"
          className="shrink-0 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-neutral-950 font-black text-xs px-5 py-3 text-center shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <span>📥</span>
          <span>{isEn ? "Access Vault Files →" : "تحميل ملفات الخزنة ←"}</span>
        </Link>
      </div>

      {/* ================= 8. COLLAPSIBLE REFERENCE LIBRARY (NOT CLUTTERING HOME) ================= */}
      <section className="pt-4 border-t border-black/5 dark:border-white/10">
        <button
          type="button"
          onClick={() => setShowCatalog(!showCatalog)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-800/40 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/80 transition-all text-start"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📚</span>
            <div>
              <p className="text-xs sm:text-sm font-black text-neutral-800 dark:text-neutral-200">
                {isEn ? "Master Catalog (100 Specialized Tracks)" : "كتالوج الـ ١٠٠ مسار التخصصية"}
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isEn
                  ? "Explore all specialized tracks, try Day 1 free, or access your owned inventory."
                  : "استكشف كافة المسارات التخصصية، جرّب اليوم الأول مجاناً، أو استعرض مساراتك الممتلكة في مكتبتك."}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
            {showCatalog ? (isEn ? "Hide ▲" : "إخفاء ▲") : (isEn ? "Explore ▼" : "استعراض ▼")}
          </span>
        </button>

        {showCatalog && (
          <div className="mt-4 animate-fade-in space-y-4">
            <input
              type="text"
              value={tileSearch}
              onChange={(e) => setTileSearch(e.target.value)}
              placeholder={isEn ? "Search tracks..." : "ابحث في الـ ١٠٠ مسار..."}
              className="w-full text-xs rounded-xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 px-4 py-3 focus:outline-hidden focus:border-teal-500 transition"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredTiles.map((t) => (
                <CourseTile
                  key={t.slug}
                  slug={t.slug}
                  title={t.title}
                  titleEn={t.titleEn}
                  category={t.category}
                  categoryEn={t.categoryEn}
                  icon={t.icon}
                  total={t.total}
                  done={t.done}
                  unlocked={t.unlocked}
                  isActive={t.isActive}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer help */}
      <div className="mt-8">
        <HelpCard />
      </div>
    </div>
  );
}
