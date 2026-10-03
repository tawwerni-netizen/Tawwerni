"use client";

import { useState } from "react";
import Link from "next/link";
import { getAllDomainThemes, DOMAIN_THEMES, type DomainTheme } from "@/lib/design-system/domain-themes";
import { ALL_100_TRACKS, TRACK_PILLARS } from "@/content/tracks100";
import TrackCardVisual from "@/components/TrackCardVisual";
import CourseTile from "@/components/CourseTile";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useI18n } from "@/components/LanguageContext";

export default function DesignSystemShowcasePage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const allThemes = getAllDomainThemes();
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);

  const activeTheme = selectedDomainId ? DOMAIN_THEMES[selectedDomainId] : null;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              ‹ {isEn ? "Back to Tawwerni" : "العودة إلى طوّرني"}
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">🎨</span>
              <h1 className="text-sm font-black tracking-tight">
                {isEn ? "Tawwerni Global Domain Color System" : "نظام ألوان وهوية المجالات العشرة في طوّرني"}
              </h1>
            </div>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              WCAG AA Compliant
            </span>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Intro Hero Banner */}
        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 mb-3">
              <span>🏛️</span>
              <span>Level 2 Domain Visual Identity System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
              {isEn
                ? "One Learning Universe · 10 Distinct Visual Worlds"
                : "عالم تعلم واحد موحد · ١٠ هويات بصرية متميزة"}
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {isEn
                ? "This architectural system guarantees each of the 10 learning pillars possesses an unmistakable visual DNA (chromatic tonal ramp 50–950, controlled accent glows, accessible contrast, and symbolic motifs) without corrupting Tawwerni's core platform brand."
                : "هذا النظام المعماري يمنح كل مجال من المجالات العشرة بصمة بصرية واضحة ومقنعة (مدرج لوني متكامل 50-950، توهجات ضوئية محسوبة، تباين لوني مريح للعين، وزخارف رمزية) مع الحفاظ التام على هوية منصة طوّرني الأساسية."}
            </p>
          </div>

          {/* 3-Tier Architecture Rules Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-black/5 dark:border-white/5 text-xs">
            <div className="rounded-2xl p-3.5 bg-neutral-100/60 dark:bg-neutral-800/40 border border-black/5 dark:border-white/5">
              <span className="font-black text-emerald-600 dark:text-emerald-400 block mb-1">
                Level 1: Platform Brand (Emerald)
              </span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                {isEn
                  ? "Global navigation, cockpit chrome, CTAs, and master layout. Never overridden by domain colors."
                  : "الشريط العلوي، لوحة التحكم، الأزرار العامة، والهيكل الرئيسي. لا يتأثر بألوان المجالات."}
              </p>
            </div>

            <div className="rounded-2xl p-3.5 bg-neutral-100/60 dark:bg-neutral-800/40 border border-black/5 dark:border-white/5">
              <span className="font-black text-indigo-600 dark:text-indigo-400 block mb-1">
                Level 2: Domain Accents (10 Worlds)
              </span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                {isEn
                  ? "Track borders, card glows, skill graph in-progress nodes, domain tags, and FHEEM context pills."
                  : "إطارات البطاقات، التوهجات، عقد المهارات قيد التعلم، ووسوم المجالات في فهيم."}
              </p>
            </div>

            <div className="rounded-2xl p-3.5 bg-neutral-100/60 dark:bg-neutral-800/40 border border-black/5 dark:border-white/5">
              <span className="font-black text-amber-600 dark:text-amber-400 block mb-1">
                Level 3: Semantics & Rewards
              </span>
              <p className="text-neutral-500 dark:text-neutral-400 text-[11px] leading-relaxed">
                {isEn
                  ? "Gold/Amber for Mastered ⭐, Green for Success ✓, Red for Errors. Absolute priority."
                  : "الذهبي للإتقان ⭐، الأخضر للنجاح، الأحمر للخطأ. أولوية مطلقة لا تتغير."}
              </p>
            </div>
          </div>
        </div>

        {/* Pillar Filter Selector Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedDomainId(null)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all ${
              selectedDomainId === null
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <span>🌟</span>
            <span>{isEn ? "All 10 Domains Overview" : "استعراض كل المجالات العشرة"}</span>
          </button>

          {allThemes.map((theme) => {
            const isSelected = selectedDomainId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setSelectedDomainId(isSelected ? null : theme.id)}
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
                    : "border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <span>{theme.icon}</span>
                <span>{isEn ? theme.nameEn : theme.nameAr}</span>
              </button>
            );
          })}
        </div>

        {/* Display: Detailed view if single domain selected, or Grid if all domains */}
        {activeTheme ? (
          <DomainDetailSection theme={activeTheme} isEn={isEn} />
        ) : (
          <div className="space-y-12">
            {allThemes.map((theme) => (
              <DomainSummarySection
                key={theme.id}
                theme={theme}
                isEn={isEn}
                onSelect={() => setSelectedDomainId(theme.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function DomainSummarySection({
  theme,
  isEn,
  onSelect,
}: {
  theme: DomainTheme;
  isEn: boolean;
  onSelect: () => void;
}) {
  const sampleTrack = ALL_100_TRACKS.find((t) => t.pillarId === theme.id) || ALL_100_TRACKS[0];

  return (
    <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-3.5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border"
            style={{
              backgroundColor: `${theme.palette.primary}18`,
              borderColor: `${theme.palette.primary}44`,
            }}
          >
            {theme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-neutral-400">
                Pillar #{theme.id} · {theme.slug.toUpperCase()}
              </span>
            </div>
            <h3 className="text-xl font-black text-neutral-900 dark:text-white">
              {isEn ? theme.nameEn : theme.nameAr}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isEn ? theme.motifEn : theme.motifAr}
            </p>
          </div>
        </div>

        <button
          onClick={onSelect}
          style={{ borderColor: theme.palette.accent }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border hover:scale-105 transition-all text-neutral-700 dark:text-neutral-200"
        >
          <span>{isEn ? "Explore Tokens & Components" : "فحص التوكنز والمكونات"}</span>
          <span>→</span>
        </button>
      </div>

      {/* 11-step Color Ramp Bar */}
      <div className="mb-6">
        <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mb-2 flex items-center justify-between">
          <span>{isEn ? "Chromatic Tonal Scale (50 — 950)" : "المدرج اللوني الكامل (50 — 950)"}</span>
          <span className="font-mono text-[10px]">Primary: {theme.palette.primary}</span>
        </div>
        <div className="grid grid-cols-11 gap-1 sm:gap-2">
          {(Object.entries(theme.palette.scale) as [string, string][]).map(([step, hex]) => {
            const isDarkTone = Number(step) >= 500;
            return (
              <div
                key={step}
                className="flex flex-col items-center p-2 rounded-xl border border-black/5 dark:border-white/5 transition-transform hover:scale-105"
                style={{ backgroundColor: hex }}
              >
                <span
                  className="text-[9px] font-black font-mono"
                  style={{ color: isDarkTone ? "#ffffff" : "#1a1a1a" }}
                >
                  {step}
                </span>
                <span
                  className="hidden md:inline text-[8px] font-mono mt-0.5 opacity-80"
                  style={{ color: isDarkTone ? "#ffffff" : "#1a1a1a" }}
                >
                  {hex}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Component Previews Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Live Card Preview */}
        <div>
          <div className="text-[11px] font-bold text-neutral-400 mb-2">
            {isEn ? "Track Card Visual" : "بطاقة المسار الرسمية"}
          </div>
          <TrackCardVisual track={sampleTrack} />
        </div>

        {/* Live Course Tile Preview */}
        <div>
          <div className="text-[11px] font-bold text-neutral-400 mb-2">
            {isEn ? "Dashboard Course Tile" : "بلاطة لوحة التحكم"}
          </div>
          <div className="space-y-3">
            <CourseTile
              slug={sampleTrack.slug}
              title={sampleTrack.titleAr}
              titleEn={sampleTrack.titleEn}
              category={sampleTrack.pillarNameAr}
              categoryEn={sampleTrack.pillarNameEn}
              icon={sampleTrack.icon}
              total={sampleTrack.totalLessons}
              done={4}
              unlocked={true}
              isActive={true}
            />
            <CourseTile
              slug={sampleTrack.slug}
              title={sampleTrack.titleAr}
              titleEn={sampleTrack.titleEn}
              category={sampleTrack.pillarNameAr}
              categoryEn={sampleTrack.pillarNameEn}
              icon={sampleTrack.icon}
              total={sampleTrack.totalLessons}
              done={1}
              unlocked={false}
              isActive={false}
            />
          </div>
        </div>

        {/* Live Skill Node & Mission Cockpit Previews */}
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-bold text-neutral-400 mb-2">
              {isEn ? "Skill Tree Node (In-Progress)" : "عقدة خريطة المهارات (قيد التعلم)"}
            </div>
            <div
              className="rounded-2xl p-4 border transition-all"
              style={{
                backgroundColor: `${theme.palette.primary}12`,
                borderColor: `${theme.palette.primary}55`,
                boxShadow: `0 0 0 1px ${theme.palette.primary}22`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-2xs border border-black/5 dark:border-white/5">
                  {theme.icon}
                </span>
                <span
                  className="text-[10px] font-black px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: `${theme.palette.primary}25`,
                    color: theme.palette.accent,
                    borderColor: `${theme.palette.primary}40`,
                  }}
                >
                  {isEn ? "In Progress ⚡" : "قيد التطوير ⚡"}
                </span>
              </div>
              <div className="text-xs font-black text-neutral-900 dark:text-white">
                {isEn ? `${theme.nameEn} Core Mastery` : `إتقان ${theme.nameAr}`}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                {isEn ? theme.motifEn : theme.motifAr}
              </div>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-neutral-400 mb-2">
              {isEn ? "Mission Stepper Stage" : "مؤشر مرحلة المهمة التفاعلية"}
            </div>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border shadow-xs"
              style={{
                backgroundColor: `${theme.palette.primary}25`,
                borderColor: `${theme.palette.primary}66`,
                color: theme.palette.accent,
                boxShadow: `0 0 14px ${theme.palette.primary}33`,
              }}
            >
              <span>⚡</span>
              <span>{isEn ? "Stage 4: Practice & Submission" : "المرحلة ٤: التطبيق والتسليم"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DomainDetailSection({
  theme,
  isEn,
}: {
  theme: DomainTheme;
  isEn: boolean;
}) {
  const tracksInPillar = ALL_100_TRACKS.filter((t) => t.pillarId === theme.id);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div
        className="rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg"
        style={{ background: theme.gradient }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-black/30 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20 shadow-md">
              {theme.icon}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-bold opacity-80">
                Pillar {theme.id} · {theme.slug}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {isEn ? theme.nameEn : theme.nameAr}
              </h2>
              <p className="text-xs opacity-90 mt-1 max-w-xl">
                {isEn ? theme.motifEn : theme.motifAr}
              </p>
            </div>
          </div>

          <div className="text-end">
            <span className="text-2xl font-black font-mono">{tracksInPillar.length}</span>
            <span className="block text-xs opacity-80">{isEn ? "Tracks in Pillar" : "مسار معتمد"}</span>
          </div>
        </div>
      </div>

      {/* Surface Tokens & Accessibility Checks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Light Surface Tokens */}
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-xs text-neutral-900">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black flex items-center gap-2">
              <span>☀️</span>
              <span>Light Mode Surfaces & Contrast</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              WCAG AA Pass
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-xl" style={{ backgroundColor: theme.light.badgeBg }}>
              <span className="font-bold" style={{ color: theme.light.badgeText }}>
                Badge Pill Sample Text
              </span>
              <span className="font-mono text-[10px] opacity-75">{theme.light.badgeText}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl border" style={{ borderColor: theme.light.border, backgroundColor: theme.light.bgSurface }}>
              <span className="font-bold" style={{ color: theme.light.text }}>
                High-Contrast Text Ground
              </span>
              <span className="font-mono text-[10px] opacity-75">{theme.light.text}</span>
            </div>
          </div>
        </div>

        {/* Dark Surface Tokens */}
        <div className="rounded-3xl border border-white/10 bg-neutral-900 p-6 shadow-xs text-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-black flex items-center gap-2">
              <span>🌙</span>
              <span>Dark Mode Surfaces & Contrast</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-500/30">
              WCAG AA Pass
            </span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-xl" style={{ backgroundColor: theme.dark.badgeBg }}>
              <span className="font-bold" style={{ color: theme.dark.badgeText }}>
                Badge Pill Sample Text
              </span>
              <span className="font-mono text-[10px] opacity-75">{theme.dark.badgeText}</span>
            </div>
            <div className="flex justify-between p-2 rounded-xl border" style={{ borderColor: theme.dark.border, backgroundColor: theme.dark.bgSurface }}>
              <span className="font-bold" style={{ color: theme.dark.text }}>
                High-Contrast Text Ground
              </span>
              <span className="font-mono text-[10px] opacity-75">{theme.dark.text}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks in This Pillar */}
      <div>
        <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-4">
          {isEn
            ? `All ${tracksInPillar.length} Tracks in ${theme.nameEn}`
            : `جميع الـ ${tracksInPillar.length} مسار في ${theme.nameAr}`}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tracksInPillar.map((track) => (
            <TrackCardVisual key={track.id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
}
