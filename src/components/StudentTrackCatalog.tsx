"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ALL_100_TRACKS, TRACK_PILLARS, Track100 } from "@/content/tracks100";
import { allCourses } from "@/content/courses";
import { useI18n } from "./LanguageContext";
import TrackCardVisual from "./TrackCardVisual";

type Props = {
  completedTrackSlugs?: string[];
  inProgressTrackSlugs?: string[];
};

export default function StudentTrackCatalog({ completedTrackSlugs = [], inProgressTrackSlugs = [] }: Props) {
  const { lang, t } = useI18n();
  const [selectedPillarId, setSelectedPillarId] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTrack, setActiveTrack] = useState<Track100 | null>(null);

  const interactiveSlugs = useMemo(() => new Set(allCourses.map((c) => c.meta.slug)), []);

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
    <div className="w-full">
      {/* Header Badges */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5 text-xs">
        <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1.5 font-bold text-teal-800 dark:text-teal-300">
          🌟 {lang === "ar" ? "١٠٠ مسار احترافي مفتوح بالكامل" : "100 Professional Tracks Unlocked"}
        </span>
        <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3.5 py-1.5 font-bold text-neutral-700 dark:text-neutral-300">
          ⚡ {lang === "ar" ? `أكثر من ${totalLessonsCount} درس تطبيقي` : `${totalLessonsCount}+ Hands-on Lessons`}
        </span>
        <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 font-bold text-amber-800 dark:text-amber-300">
          ♾️ {lang === "ar" ? "وصول مدى الحياة شامل التحديثات" : "Lifetime Access & Updates"}
        </span>
      </div>

      {/* Search and Level Filters */}
      <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === "ar" ? "ابحث في كل الـ 100 مسار بالاسم أو المجال..." : "Search all 100 tracks by keyword..."}
            className="w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-teal-500 focus:outline-hidden backdrop-blur-md shadow-xs transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-3 left-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-sm"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedLevel("all")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedLevel === "all"
                ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-neutral-950 shadow-md font-bold"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {t.categoryAll}
          </button>
          <button
            onClick={() => setSelectedLevel("beginner")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedLevel === "beginner"
                ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-neutral-950 shadow-md font-bold"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {t.beginner}
          </button>
          <button
            onClick={() => setSelectedLevel("intermediate")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedLevel === "intermediate"
                ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-neutral-950 shadow-md font-bold"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {lang === "ar" ? "متوسط" : "Intermediate"}
          </button>
          <button
            onClick={() => setSelectedLevel("advanced")}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedLevel === "advanced"
                ? "bg-teal-600 text-white dark:bg-teal-500 dark:text-neutral-950 shadow-md font-bold"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
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
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            selectedPillarId === null
              ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
              : "border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <span>🌟</span>
          <span>{lang === "ar" ? `جميع الـ ${totalTracksCount} مسار` : `All ${totalTracksCount} Tracks`}</span>
        </button>

        {TRACK_PILLARS.map((pillar) => {
          const isSelected = selectedPillarId === pillar.id;
          return (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillarId(isSelected ? null : pillar.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? "bg-teal-600 text-white dark:bg-teal-400 dark:text-neutral-950 shadow-md"
                  : "border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{pillar.icon}</span>
              <span>{lang === "ar" ? pillar.nameAr : pillar.nameEn}</span>
            </button>
          );
        })}
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
          <p className="text-sm">
            {lang === "ar" ? "لم يتم العثور على مسارات تطابق بحثك" : "No tracks match your search criteria."}
          </p>
        </div>
      )}

      {/* Track Details Modal */}
      {activeTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-black/10 dark:border-teal-500/20 bg-white dark:bg-neutral-950 p-6 text-neutral-900 dark:text-white shadow-2xl transition-colors">
            <button
              onClick={() => setActiveTrack(null)}
              className="absolute top-5 left-5 rounded-full w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${activeTrack.accentFrom}, ${activeTrack.accentTo})`,
                }}
              >
                {activeTrack.icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                  {lang === "ar" ? activeTrack.pillarNameAr : activeTrack.pillarNameEn} · #{String(activeTrack.order).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-black text-neutral-900 dark:text-white mt-0.5">
                  {lang === "ar" ? activeTrack.titleAr : activeTrack.titleEn}
                </h2>
              </div>
            </div>

            <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-5">
              {lang === "ar" ? activeTrack.descriptionAr : activeTrack.descriptionEn}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-black/5 dark:border-neutral-800 text-center mb-6">
              <div>
                <span className="text-xs text-neutral-500 block mb-0.5">{lang === "ar" ? "الدروس" : "Lessons"}</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{activeTrack.totalLessons} {t.lessonsCount}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block mb-0.5">{lang === "ar" ? "الوقت الإجمالي" : "Duration"}</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{activeTrack.durationHours} {t.hoursCount}</span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block mb-0.5">{lang === "ar" ? "النقاط" : "Total XP"}</span>
                <span className="text-sm font-bold text-teal-700 dark:text-teal-400 font-mono">+{activeTrack.totalXp} XP</span>
              </div>
            </div>

            {/* Outcomes */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider mb-2.5">
                {t.whatYouWillLearn}
              </h4>
              <ul className="space-y-2">
                {(lang === "ar" ? activeTrack.outcomesAr : activeTrack.outcomesEn).map((outcome, i) => (
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
                <p>{lang === "ar" ? activeTrack.realityAr : activeTrack.realityEn}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-3">
              <Link
                href={`/app/learn/${activeTrack.slug}`}
                className="flex-1 py-3 text-center rounded-full font-bold text-sm bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white shadow-lg active:scale-95 transition-all"
              >
                {lang === "ar" ? "ابدأ المسار الآن (اليوم الأول مجانًا) ←" : "Start Track Now (Day 1 Free) →"}
              </Link>
              <button
                onClick={() => setActiveTrack(null)}
                className="px-5 py-3 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 transition-colors"
              >
                {lang === "ar" ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
