"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ALL_100_TRACKS, TRACK_PILLARS, Track100 } from "@/content/tracks100";
import { allCourses } from "@/content/courses";
import { useI18n } from "./LanguageContext";
import TrackCardVisual from "./TrackCardVisual";
import { getTrackArtwork } from "@/content/track-artworks";
import { getRecentLearningClient } from "@/lib/recent-learning";
import { resolveDomainTheme } from "@/lib/design-system/domain-themes";

type Props = {
  completedTrackSlugs?: string[];
  inProgressTrackSlugs?: string[];
  resumeTrack?: {
    slug: string;
    dayNumber: number;
    titleAr?: string;
    titleEn?: string;
    icon?: string;
    totalDays?: number;
    doneCount?: number;
    nextDayTitle?: string;
    nextDayTitleEn?: string;
  } | null;
};

export default function StudentTrackCatalog({
  completedTrackSlugs = [],
  inProgressTrackSlugs = [],
  resumeTrack,
}: Props) {
  const { lang, t } = useI18n();
  const isEn = lang === "en";
  const [selectedPillarId, setSelectedPillarId] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTrack, setActiveTrack] = useState<Track100 | null>(null);
  const [effectiveResume, setEffectiveResume] = useState(resumeTrack || null);

  useEffect(() => {
    if (!resumeTrack) {
      const clientData = getRecentLearningClient();
      if (clientData && clientData.courseSlug) {
        setEffectiveResume({
          slug: clientData.courseSlug,
          dayNumber: clientData.dayNumber || 1,
          titleAr: clientData.courseTitle,
          titleEn: clientData.courseTitleEn || clientData.courseTitle,
          icon: clientData.icon || "⚡",
          totalDays: clientData.totalDays,
          doneCount: clientData.doneCount,
          nextDayTitle: clientData.lessonTitle,
          nextDayTitleEn: clientData.lessonTitleEn,
        });
      }
    } else {
      setEffectiveResume(resumeTrack);
    }
  }, [resumeTrack]);

  const totalTracksCount = ALL_100_TRACKS.length;
  const totalLessonsCount = useMemo(() => {
    return ALL_100_TRACKS.reduce((sum, t) => sum + t.totalLessons, 0);
  }, []);

  const filteredTracks = useMemo(() => {
    return ALL_100_TRACKS.filter((track) => {
      if (selectedPillarId !== null && track.pillarId !== selectedPillarId) {
        return false;
      }
      if (selectedLevel !== "all") {
        if (selectedLevel === "beginner" && track.levelEn !== "Beginner") return false;
        if (selectedLevel === "intermediate" && track.levelEn !== "Intermediate") return false;
        if (selectedLevel === "advanced" && track.levelEn !== "Advanced") return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleAr = track.titleAr.toLowerCase();
        const titleEn = track.titleEn.toLowerCase();
        const descAr = track.descriptionAr.toLowerCase();
        const descEn = track.descriptionEn.toLowerCase();
        return titleAr.includes(q) || titleEn.includes(q) || descAr.includes(q) || descEn.includes(q);
      }
      return true;
    });
  }, [selectedPillarId, selectedLevel, searchQuery]);

  return (
    <div className="w-full" dir={isEn ? "ltr" : "rtl"}>
      {/* Header Stat Pills */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 px-3.5 py-1.5 font-black text-teal-800 dark:text-teal-300 shadow-2xs">
          <span>🌟</span>
          <span>{isEn ? "100 Practical Tracks Available" : "١٠٠ مسار عملي متاحة للتعلّم والامتلاك"}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 px-3.5 py-1.5 font-bold text-neutral-700 dark:text-neutral-300 shadow-2xs">
          <span>⚡</span>
          <span>{isEn ? `${totalLessonsCount}+ Hands-on Lessons` : `أكثر من ${totalLessonsCount} درس تطبيقي`}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs">
          <span>♾️</span>
          <span>{isEn ? "Lifetime Ownership" : "ملكية دائمة مدى الحياة"}</span>
        </span>
      </div>

      {/* Resume Active Learning Banner (High-Dopamine Cosmic Card) */}
      {effectiveResume && (
        <div className="mb-8 rounded-3xl border border-teal-400/40 bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 text-white p-5 sm:p-6 shadow-xl shadow-teal-900/15 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/20 blur-xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-cyan-400/20 blur-xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black/25 text-3xl border border-white/20 shadow-md">
                {effectiveResume.icon || "⚡"}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-black border border-white/15">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                    </span>
                    <span>{isEn ? "Continue Where You Left Off" : "تابع من حيث توقفت"}</span>
                  </span>
                  <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded-full">
                    {isEn ? `Day ${effectiveResume.dayNumber}` : `اليوم ${effectiveResume.dayNumber}`}
                    {effectiveResume.totalDays ? ` / ${effectiveResume.totalDays}` : ""}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {isEn ? (effectiveResume.titleEn || effectiveResume.titleAr) : effectiveResume.titleAr}
                </h3>
                {(effectiveResume.nextDayTitle || effectiveResume.nextDayTitleEn) && (
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                    {isEn ? (effectiveResume.nextDayTitleEn || effectiveResume.nextDayTitle) : effectiveResume.nextDayTitle}
                  </p>
                )}
              </div>
            </div>

            <Link
              href={`/app/learn/${effectiveResume.slug}/${effectiveResume.dayNumber}`}
              style={{ backgroundColor: '#ffffff', color: '#042f2e', border: '2px solid #34d399' }}
              className="btn-resume-mission inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-black shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <span className="text-base">🚀</span>
              <span style={{ color: '#042f2e', fontWeight: 900 }}>
                {isEn
                  ? `Resume Lesson · Day ${effectiveResume.dayNumber} →`
                  : `استئناف درس اليوم · اليوم ${effectiveResume.dayNumber} ←`}
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Search and Level Filters Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? "Search across all 100 tracks by keyword or skill..." : "ابحث في كل الـ 100 مسار بالاسم أو المهارة..."}
            className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-teal-500 focus:outline-hidden backdrop-blur-md shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-3 end-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-sm"
              aria-label={isEn ? "Clear search" : "مسح البحث"}
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedLevel("all")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              selectedLevel === "all"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md font-black"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {t.categoryAll}
          </button>
          <button
            onClick={() => setSelectedLevel("beginner")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === "beginner"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md font-black"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {t.beginner}
          </button>
          <button
            onClick={() => setSelectedLevel("intermediate")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === "intermediate"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md font-black"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isEn ? "Intermediate" : "متوسط"}
          </button>
          <button
            onClick={() => setSelectedLevel("advanced")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedLevel === "advanced"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md font-black"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {t.expert}
          </button>
        </div>
      </div>

      {/* Pillar Tabs (10 Pillars) */}
      <div className="mb-7 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedPillarId(null)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all ${
            selectedPillarId === null
              ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
              : "border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <span>🌟</span>
          <span>{isEn ? `All ${totalTracksCount} Tracks` : `جميع الـ ${totalTracksCount} مسار`}</span>
        </button>

        {TRACK_PILLARS.map((pillar) => {
          const isSelected = selectedPillarId === pillar.id;
          const theme = resolveDomainTheme({ pillarId: pillar.id });
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillarId(isSelected ? null : pillar.id)}
              style={
                isSelected
                  ? {
                      background: `linear-gradient(135deg, ${theme.palette.primary}, ${theme.palette.secondary})`,
                      color: "#ffffff",
                      boxShadow: `0 8px 20px -6px ${theme.palette.primary}66`,
                      borderColor: theme.palette.accent,
                    }
                  : undefined
              }
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? "font-black border shadow-md"
                  : "border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{pillar.icon}</span>
              <span>{isEn ? pillar.nameEn : pillar.nameAr}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium">
        <span>
          {isEn
            ? `Showing ${filteredTracks.length} of ${totalTracksCount} tracks`
            : `عرض ${filteredTracks.length} من أصل ${totalTracksCount} مسار`}
        </span>
      </div>

      {/* Grid of All 100 Tracks */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTracks.map((track) => (
          <TrackCardVisual
            key={track.id}
            track={track}
            onSelect={(t) => setActiveTrack(t)}
          />
        ))}
      </div>

      {filteredTracks.length === 0 && (
        <div className="py-16 text-center text-neutral-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm font-bold">
            {isEn ? "No tracks match your search criteria." : "لم يتم العثور على مسارات تطابق بحثك"}
          </p>
        </div>
      )}

      {/* Reassurance Footer Bar */}
      <div className="mt-12 rounded-3xl bg-neutral-100 dark:bg-neutral-900/70 border border-black/5 dark:border-white/10 p-5 text-center text-xs text-neutral-600 dark:text-neutral-400 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
        <span className="font-bold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
          <span>♾️</span>
          <span>{isEn ? "Lifetime Ownership" : "ملكية دائمة مدى الحياة"}</span>
        </span>
        <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
        <span>{isEn ? "Includes all practical projects & certified QR badges" : "شامل كافة المشاريع التطبيقية والشهادات الرقمية المعتمدة"}</span>
        <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
        <Link href="/refund" className="underline hover:text-teal-600 font-bold">
          {isEn ? "Digital Products Policy" : "سياسة المنتجات الرقمية"}
        </Link>
      </div>

      {/* Track Details Modal */}
      {activeTrack && (() => {
        const activeArtwork = getTrackArtwork(activeTrack.slug);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div
              dir={isEn ? "ltr" : "rtl"}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/10 dark:border-teal-500/20 bg-white dark:bg-neutral-900 p-6 text-neutral-900 dark:text-white shadow-2xl transition-colors"
            >
              <button
                onClick={() => setActiveTrack(null)}
                className="absolute top-5 end-5 z-20 rounded-full w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-md transition-colors"
                aria-label={isEn ? "Close" : "إغلاق"}
              >
                ✕
              </button>

              {/* 3D Concept Artwork Showcase Banner */}
              {activeArtwork && (
                <div className="relative mb-5 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15 shadow-xl aspect-video w-full bg-neutral-900 group">
                  <img
                    src={activeArtwork.image}
                    alt={isEn ? activeArtwork.altEn : activeArtwork.altAr}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20">
                      <span
                        className="h-2 w-2 rounded-full animate-pulse"
                        style={{ backgroundColor: activeTrack.accentFrom }}
                      />
                      <span>✨ {isEn ? activeArtwork.badgeEn : activeArtwork.badgeAr}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-md border border-white/15">
                      3D Concept Art
                    </span>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${activeTrack.accentFrom}, ${activeTrack.accentTo})`,
                  }}
                >
                  {activeTrack.icon}
                </div>
                <div>
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    {isEn ? activeTrack.pillarNameEn : activeTrack.pillarNameAr} · #{String(activeTrack.order).padStart(2, "0")}
                  </span>
                  <h2 className="text-xl font-black text-neutral-900 dark:text-white mt-0.5">
                    {isEn ? activeTrack.titleEn : activeTrack.titleAr}
                  </h2>
                </div>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
                {isEn ? activeTrack.descriptionEn : activeTrack.descriptionAr}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-black/5 dark:border-neutral-800 text-center mb-6">
                <div>
                  <span className="text-xs text-neutral-500 block mb-0.5">{isEn ? "Lessons" : "الدروس"}</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{activeTrack.totalLessons} {t.lessonsCount}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block mb-0.5">{isEn ? "Duration" : "الوقت الإجمالي"}</span>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{activeTrack.durationHours} {t.hoursCount}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 block mb-0.5">{isEn ? "Total XP" : "النقاط"}</span>
                  <span className="text-sm font-bold text-teal-700 dark:text-teal-400 font-mono">+{activeTrack.totalXp} XP</span>
                </div>
              </div>

              {/* Outcomes */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider mb-2.5">
                  {t.whatYouWillLearn}
                </h4>
                <ul className="space-y-2">
                  {(isEn ? activeTrack.outcomesEn : activeTrack.outcomesAr).map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-200">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Reality Check */}
              <div className="mb-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200/90 flex items-start gap-2">
                <span className="text-base">⚠️</span>
                <div>
                  <span className="font-bold block mb-0.5">{t.honestReality}:</span>
                  <p>{isEn ? activeTrack.realityEn : activeTrack.realityAr}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/app/learn/${activeTrack.slug}`}
                  className="flex-1 py-3 text-center rounded-full font-bold text-sm bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white shadow-lg active:scale-95 transition-all"
                >
                  {isEn ? "Start Track Now (Day 1 Free) →" : "ابدأ المسار الآن (اليوم الأول مجانًا) ←"}
                </Link>
                <button
                  onClick={() => setActiveTrack(null)}
                  className="px-5 py-3 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  {isEn ? "Close" : "إغلاق"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
