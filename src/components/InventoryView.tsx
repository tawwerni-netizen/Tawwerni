"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "./LanguageContext";
import type { UserInventory } from "@/lib/entitlements";
import type { NextStepRecommendation } from "@/lib/recommendations";
import { pricing } from "@/lib/pricing";
import { TRACK_PILLARS } from "@/content/tracks100";

export default function InventoryView({
  inventory,
  recommendation,
  userName,
}: {
  inventory: UserInventory;
  recommendation: NextStepRecommendation;
  userName: string;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [activeTab, setActiveTab] = useState<"all" | "in_progress" | "completed">("all");
  const [selectedCareerPathFilter, setSelectedCareerPathFilter] = useState<string | null>(null);
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<number | null>(null);

  // Active track to resume learning
  const lastActiveTrack =
    (inventory.lastActiveTrackSlug &&
      inventory.ownedTracks.find((t) => t.slug === inventory.lastActiveTrackSlug)) ||
    inventory.ownedTracks.find((t) => t.progressPct > 0 && !t.isCompleted) ||
    inventory.ownedTracks[0];

  // Smart upgrade calculations
  const showSmartUpgrade = !inventory.isAllAccess && !inventory.isLegacyFullAccess && !inventory.isAdmin;
  const userPaid = inventory.userPaidAmountEgp || 0;
  const upgradeDelta = Math.max(50, pricing.allAccessPriceEgp - userPaid);

  // Pillar statistics for Skill Graph
  const pillarStats = TRACK_PILLARS.map((pillar) => {
    const tracksInPillar = inventory.ownedTracks.filter((t) => t.pillarId === pillar.id);
    const completedTracksInPillar = tracksInPillar.filter((t) => t.isCompleted).length;
    const completedLessonsInPillar = tracksInPillar.reduce((sum, t) => sum + t.completedLessons, 0);
    const avgProgress =
      tracksInPillar.length > 0
        ? Math.round(tracksInPillar.reduce((sum, t) => sum + t.progressPct, 0) / tracksInPillar.length)
        : 0;
    return {
      ...pillar,
      tracksCount: tracksInPillar.length,
      completedTracksCount: completedTracksInPillar,
      completedLessons: completedLessonsInPillar,
      masteryPct: avgProgress,
    };
  });

  // Filtered tracks
  const filteredTracks = inventory.ownedTracks.filter((track) => {
    if (selectedCareerPathFilter && track.viaCareerPathSlug !== selectedCareerPathFilter) {
      return false;
    }
    if (selectedPillarFilter && track.pillarId !== selectedPillarFilter) {
      return false;
    }
    if (activeTab === "in_progress") {
      return track.progressPct > 0 && !track.isCompleted;
    }
    if (activeTab === "completed") {
      return track.isCompleted;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. Header & Membership Status Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1916] via-[#0d1614] to-[#081210] p-5 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 end-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                🎒 {isEn ? "My Learning Inventory" : "مكتبتي التعليمية ومخزوني الممتلك"}
              </span>

              {inventory.isAdmin ? (
                <span className="text-xs font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full">
                  🛡️ {isEn ? "Platform Admin" : "مشرف المنصة"}
                </span>
              ) : inventory.isAllAccess ? (
                <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                  👑 {isEn ? "All-Access Master Key" : "المفتاح الشامل لكافة الكورسات"}
                </span>
              ) : inventory.isLegacyFullAccess ? (
                <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                  👑 {isEn ? "Founding Full Access Member" : "عضو مؤسس · وصول شامل لجميع الـ 100 مسار"}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
                  ✓ {isEn ? "Modular Learning Ownership" : "نظام التملك التعليمي الموديولار"}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
              {isEn ? `Welcome back, ${userName}` : `أهلاً بك، ${userName}`}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {inventory.isAllAccess || inventory.isLegacyFullAccess
                ? isEn
                  ? "You have permanent master access across all 100 specialized tracks and 12 complete career paths."
                  : "تمتلك وصولاً دائماً وشاملاً لكافة الـ 100 مسار تخصصي وجميع الـ 12 مساراً مهنياً مدى الحياة."
                : isEn
                ? "Manage your owned career roadmaps and specialized tracks. Track your independent milestones and certifications."
                : "هنا تجد كافة المسارات المهنية والتخصصية التي تمتلكها، مع متابعة تقدمك وإنجازاتك اليومية وشهاداتك الرقمية الموثقة."}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-3 text-center">
              <span className="block text-[11px] text-neutral-400 font-medium">
                {isEn ? "Career Paths" : "المسارات المهنية"}
              </span>
              <span className="block text-xl font-black text-emerald-400 font-mono mt-0.5">
                {inventory.isAllAccess || inventory.isLegacyFullAccess ? "12" : inventory.ownedCareerPaths.length}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-3 text-center">
              <span className="block text-[11px] text-neutral-400 font-medium">
                {isEn ? "Owned Tracks" : "المسارات الممتلكة"}
              </span>
              <span className="block text-xl font-black text-white font-mono mt-0.5">
                {inventory.isAllAccess || inventory.isLegacyFullAccess ? "100" : inventory.ownedTracks.length}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-3 text-center">
              <span className="block text-[11px] text-neutral-400 font-medium">
                {isEn ? "Completed Lessons" : "الدروس المنجزة"}
              </span>
              <span className="block text-xl font-black text-teal-300 font-mono mt-0.5">
                {inventory.totalCompletedLessons}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-3 text-center">
              <span className="block text-[11px] text-neutral-400 font-medium">
                {isEn ? "Total XP" : "نقاط XP"}
              </span>
              <span className="block text-xl font-black text-amber-300 font-mono mt-0.5">
                {inventory.totalEarnedXp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Resume Active Learning Banner (High-Dopamine Cosmic Focus Card) */}
      {lastActiveTrack && (
        <div className="rounded-3xl border border-teal-400/40 bg-gradient-to-br from-teal-900 via-teal-950 to-emerald-950 text-white p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/20 blur-xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full bg-cyan-400/20 blur-xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-3xl shrink-0 backdrop-blur-md border border-white/15">
                {lastActiveTrack.icon}
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider">
                    ⚡ {isEn ? "Continue Today's Momentum" : "استكمل تعلّمك اليوم"}
                  </span>
                  <span className="text-[11px] text-teal-200">
                    {isEn ? lastActiveTrack.pillarNameEn : lastActiveTrack.pillarNameAr}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg md:text-xl font-black">
                  {isEn ? lastActiveTrack.titleEn : lastActiveTrack.titleAr}
                </h2>
                <p className="text-xs text-teal-100/80 mt-0.5">
                  {lastActiveTrack.completedLessons} / {lastActiveTrack.totalLessons} {isEn ? "missions completed" : "مهمة منجزة"} ({lastActiveTrack.progressPct}%)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <div className="hidden sm:block w-36 space-y-1">
                <div className="h-2 w-full rounded-full bg-black/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all duration-500"
                    style={{ width: `${lastActiveTrack.progressPct}%` }}
                  />
                </div>
              </div>
              <Link
                href={`/app/learn/${lastActiveTrack.slug}`}
                className="w-full md:w-auto whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 text-neutral-950 font-black px-6 py-3 text-xs sm:text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all text-center cursor-pointer"
              >
                {lastActiveTrack.progressPct > 0
                  ? isEn ? "Continue Next Lesson ➔" : "تابع الدرس التالي ➔"
                  : isEn ? "Start Lesson #1 ➔" : "ابدأ الدرس الأول ➔"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Smart Credit-Based Upgrade Banner (If not all-access) */}
      {showSmartUpgrade && (
        <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-[#18140c] to-[#0e0c08] p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -end-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-2xl shrink-0">
                👑
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {isEn ? "Smart Credit Upgrade" : "ترقية ذكية بخصم رصيدك السابق"}
                  </span>
                  {userPaid > 0 && (
                    <span className="text-[11px] text-amber-200 font-bold">
                      {isEn ? `You already invested ${userPaid} EGP` : `تم خصم ${userPaid} ج.م استثمرتها سابقاً`}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isEn
                    ? `Upgrade to All-Access Pass for just ${upgradeDelta} EGP`
                    : `رقّ حسابك للمفتاح الشامل (All-Access Pass) بـ ${upgradeDelta} ج.م فقط`}
                </h3>
                <p className="mt-1 text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  {isEn
                    ? `We credit 100% of your previous payments (${userPaid} EGP). Pay only the difference to unlock all 100 practical tracks, all 12 career paths, and future updates for life.`
                    : `نخصم لك 100% من مدفوعاتك السابقة (${userPaid} ج.م). ادفع الفارق فقط لتملك كافة الـ 100 مسار، والـ 12 مساراً مهنياً، وبنك الـ 10,000 برومبت مدى الحياة.`}
                </p>
              </div>
            </div>

            <Link
              href="/quiz/checkout?type=all_access&slug=all-access"
              className="w-full md:w-auto whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-black px-6 py-3.5 text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all text-center shrink-0 cursor-pointer"
            >
              {isEn ? `Upgrade Now (${upgradeDelta} EGP) 👑` : `ترقية حسابي الآن (${upgradeDelta} ج.م) 👑`}
            </Link>
          </div>
        </div>
      )}

      {/* 4. Skill Graph / Domain Mastery Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>📊</span>
              <span>{isEn ? "Skill Graph & Domain Mastery" : "خريطة المهارات ومؤشر الإتقان حسب المجالات"}</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isEn
                ? "Track your progress across specialized learning pillars and skill categories."
                : "راقب توزيع مهاراتك ونسب الإنجاز في مختلف مجالات المعرفة والتطبيق."}
            </p>
          </div>

          {selectedPillarFilter && (
            <button
              type="button"
              onClick={() => setSelectedPillarFilter(null)}
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {isEn ? "Clear Pillar Filter ✕" : "إلغاء تصفية المجال ✕"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pillarStats.map((pillar) => {
            const isSelected = selectedPillarFilter === pillar.id;
            return (
              <button
                type="button"
                key={pillar.id}
                onClick={() => setSelectedPillarFilter(isSelected ? null : pillar.id)}
                className={`rounded-2xl p-3.5 text-start border transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-400 bg-emerald-500/15 shadow-md shadow-emerald-500/20"
                    : "border-white/10 bg-[#0d1614] hover:border-white/25"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{pillar.icon}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {pillar.masteryPct}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {isEn ? pillar.nameEn : pillar.nameAr}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                  <span>
                    {pillar.tracksCount} {isEn ? "tracks" : "مسار"}
                  </span>
                  <span>
                    {pillar.completedLessons} {isEn ? "done" : "درس"}
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${pillar.masteryPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Deterministic Next Step Recommendation Card */}
      {recommendation && (
        <div className="rounded-3xl border-2 border-emerald-500/30 bg-[#0d1614] p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-2xl shrink-0">
                {recommendation.icon}
              </span>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {isEn ? "Smart Recommendation" : "المحطة التالية المقترحة لك"}
                  </span>
                  {recommendation.badgeAr && (
                    <span className="text-[10px] font-bold text-neutral-300 bg-white/5 px-2 py-0.5 rounded-md">
                      {isEn ? recommendation.badgeEn : recommendation.badgeAr}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isEn ? recommendation.titleEn : recommendation.titleAr}
                </h3>
                <p className="mt-1 text-xs text-neutral-300 max-w-xl leading-relaxed">
                  {isEn ? recommendation.descriptionEn : recommendation.descriptionAr}
                </p>
              </div>
            </div>

            <Link
              href={recommendation.ctaHref}
              className="w-full sm:w-auto whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-3 text-xs sm:text-sm font-black text-neutral-950 shadow-md hover:brightness-110 active:scale-98 transition-all text-center shrink-0 cursor-pointer"
            >
              {isEn ? recommendation.ctaTextEn : recommendation.ctaTextAr}
            </Link>
          </div>
        </div>
      )}

      {/* 6. Owned Career Paths Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>🚀</span>
              <span>{isEn ? "Owned Career Paths (Bundles)" : "المسارات المهنية الممتلكة (الحزم الشاملة)"}</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isEn
                ? "Roadmaps that include multiple interconnected tracks from zero to job readiness."
                : "خرائط طريق متكاملة تؤهلك لوظيفة محددة وتفتح جميع مساراتها دفعة واحدة."}
            </p>
          </div>

          <Link
            href="/career-paths"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors hidden sm:inline-flex items-center gap-1"
          >
            <span>{isEn ? `Explore All Career Paths (${pricing.careerPathPriceEgp} EGP)` : `تصفح كل المسارات المهنية (${pricing.careerPathPriceEgp} ج.م)`}</span>
            <span>➔</span>
          </Link>
        </div>

        {inventory.ownedCareerPaths.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-8 text-center space-y-3">
            <span className="text-4xl">🧭</span>
            <h3 className="text-base font-bold text-white">
              {isEn ? "No Career Paths Owned Yet" : "لم تمتلك أي مسار مهني متكامل بعد"}
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              {isEn
                ? `Career paths combine multiple specialized tracks into a structured milestone roadmap for just ${pricing.careerPathPriceEgp} EGP.`
                : `المسار المهني يجمع عدة مسارات تخصصية مترابطة في خريطة عمل واحدة تؤهلك لسوق العمل بـ ${pricing.careerPathPriceEgp} ج.م فقط.`}
            </p>
            <Link
              href="/career-paths"
              className="inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-black text-neutral-950 hover:bg-emerald-400 transition-all cursor-pointer"
            >
              {isEn ? `Explore Career Paths (${pricing.careerPathPriceEgp} EGP) ➔` : `استكشف المسارات المهنية (${pricing.careerPathPriceEgp} ج.م) ➔`}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventory.ownedCareerPaths.map((cp) => (
              <div
                key={cp.slug}
                className="rounded-3xl border border-white/10 bg-[#0d1614] p-5 shadow-sm hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-2xl shrink-0">
                        {cp.icon}
                      </span>
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-white">
                          {isEn ? cp.titleEn : cp.titleAr}
                        </h3>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          {isEn ? `${cp.totalTracks} Tracks Included` : `${cp.totalTracks} مسارات تخصصية مشمولة`}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-black text-white bg-black/40 border border-white/10 px-2.5 py-1 rounded-xl">
                      {cp.progressPct}%
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-4 line-clamp-2">
                    {isEn ? cp.taglineEn : cp.taglineAr}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-[11px] text-neutral-400 font-medium">
                      <span>{isEn ? "Overall Completion" : "نسبة الإنجاز الإجمالية"}</span>
                      <span className="font-mono">
                        {cp.completedTracks} / {cp.totalTracks} {isEn ? "tracks" : "مسار"}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${cp.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCareerPathFilter(
                        selectedCareerPathFilter === cp.slug ? null : cp.slug
                      )
                    }
                    className="text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {selectedCareerPathFilter === cp.slug
                      ? isEn
                        ? "Show All Tracks"
                        : "عرض كل المسارات"
                      : isEn
                      ? "Filter Tracks in this Path ↓"
                      : "تصفية مسارات هذا المسار فقط ↓"}
                  </button>

                  <Link
                    href={`/career-paths/${cp.slug}`}
                    className="rounded-full bg-white/10 hover:bg-emerald-500 hover:text-neutral-950 px-4 py-1.5 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    {isEn ? "Open Career Path ➔" : "دخول المسار المهني ➔"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. Owned Specialized Tracks Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>🎓</span>
              <span>{isEn ? "Owned Specialized Tracks" : "المسارات التخصصية الممتلكة"}</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {filteredTracks.length}
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isEn
                ? "Every track includes 28 daily missions, interactive quizzes, and a portfolio artifact."
                : "كل مسار يحتوي ٢٨ مهمة يومية تطبيقية وكويزات عملية ومشروعاً حقيقياً للبورتفوليو."}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-2xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-emerald-500 text-neutral-950 shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isEn ? "All" : "الكل"} ({inventory.ownedTracks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("in_progress")}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "in_progress"
                  ? "bg-emerald-500 text-neutral-950 shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isEn ? "In Progress" : "قيد التعلّم"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === "completed"
                  ? "bg-emerald-500 text-neutral-950 shadow-xs"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {isEn ? "Completed" : "المكتملة"}
            </button>
          </div>
        </div>

        {(selectedCareerPathFilter || selectedPillarFilter) && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-emerald-300 font-bold">
              {selectedCareerPathFilter && (isEn ? "Filtered by Career Path" : "مصفى حسب المسار المهني")}
              {selectedCareerPathFilter && selectedPillarFilter && " · "}
              {selectedPillarFilter && (isEn ? "Filtered by Domain Pillar" : "مصفى حسب المجال")}
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedCareerPathFilter(null);
                setSelectedPillarFilter(null);
              }}
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {isEn ? "Clear All Filters ✕" : "إلغاء كافة التصفيات ✕"}
            </button>
          </div>
        )}

        {filteredTracks.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-8 text-center space-y-3">
            <span className="text-4xl">📚</span>
            <h3 className="text-base font-bold text-white">
              {isEn ? "No Tracks In This Filter" : "لا توجد مسارات مطابقة لهذا التصنيف"}
            </h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              {isEn
                ? `You can unlock any specialized track for ${pricing.trackPriceEgp} EGP or get complete Career Paths for ${pricing.careerPathPriceEgp} EGP.`
                : `يمكنك تملك أي مسار تخصصي منفرد بـ ${pricing.trackPriceEgp} ج.م فقط أو الحصول على مسار مهني متكامل بـ ${pricing.careerPathPriceEgp} ج.م.`}
            </p>
            <Link
              href="/tracks"
              className="inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-black text-neutral-950 hover:bg-emerald-400 transition-all cursor-pointer"
            >
              {isEn ? `Browse 100 Tracks (${pricing.trackPriceEgp} EGP) ➔` : `تصفح الـ ١٠٠ مسار (${pricing.trackPriceEgp} ج.م) ➔`}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track) => (
              <div
                key={track.slug}
                className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-sm hover:border-emerald-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-xl shrink-0">
                      {track.icon}
                    </span>

                    {/* Source badge */}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 bg-white/5 border-white/10 text-neutral-300">
                      {track.source === "career_path"
                        ? isEn
                          ? `Via ${track.viaCareerPathTitleEn || "Path"}`
                          : `ضمن مسار ${track.viaCareerPathTitleAr || "المهني"}`
                        : track.source === "all_access"
                        ? isEn
                          ? "All-Access"
                          : "وصول شامل"
                        : track.source === "legacy"
                        ? isEn
                          ? "Founding Member"
                          : "وصول مؤسس شامل"
                        : isEn
                        ? `Direct (${pricing.trackPriceEgp} EGP)`
                        : `مملوك مباشرة (${pricing.trackPriceEgp} ج.م)`}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-white mb-1 line-clamp-1">
                    {isEn ? track.titleEn : track.titleAr}
                  </h3>

                  <span className="text-[11px] text-neutral-400 block mb-3">
                    {isEn ? track.pillarNameEn : track.pillarNameAr}
                  </span>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                      <span>{isEn ? "Progress" : "الإنجاز"}</span>
                      <span>
                        {track.completedLessons} / {track.totalLessons} {isEn ? "lessons" : "درس"} ({track.progressPct}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${track.progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  {track.isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <span>✓</span>
                      <span>{isEn ? "Completed" : "مكتمل بالكامل"}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400">
                      {track.progressPct > 0 ? (isEn ? "In Progress" : "مستمر") : (isEn ? "Ready" : "جاهز للبدء")}
                    </span>
                  )}

                  <Link
                    href={`/app/learn/${track.slug}`}
                    className={`rounded-full px-4 py-1.5 text-xs font-black transition-all cursor-pointer ${
                      track.progressPct > 0
                        ? "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-xs"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {track.progressPct > 0 ? (isEn ? "Continue ➔" : "تابع ➔") : (isEn ? "Start ➔" : "ابدأ ➔")}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 8. Catalog Upsell & Expansion Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-6 text-center space-y-3">
        <h3 className="text-base sm:text-lg font-black text-white">
          {isEn ? "Want to expand your knowledge base?" : "هل تريد توسيع مخزونك التعليمي؟"}
        </h3>
        <p className="text-xs text-neutral-300 max-w-xl mx-auto leading-relaxed">
          {isEn
            ? `Add any focused track for ${pricing.trackPriceEgp} EGP, or grab complete career roadmaps with multiple certified tracks for ${pricing.careerPathPriceEgp} EGP.`
            : `يمكنك إضافة أي مسار تخصصي جديد بـ ${pricing.trackPriceEgp} ج.م فقط، أو الحصول على مسار مهني متكامل يضم حزمة مسارات بـ ${pricing.careerPathPriceEgp} ج.م.`}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/tracks"
            className="rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-5 py-2.5 text-xs font-bold text-emerald-300 transition-all cursor-pointer"
          >
            {isEn ? `Browse 100 Tracks (${pricing.trackPriceEgp} EGP each)` : `تصفح الـ ١٠٠ مسار (${pricing.trackPriceEgp} ج.م للمسار) ➔`}
          </Link>
          <Link
            href="/career-paths"
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-black text-neutral-950 transition-all cursor-pointer shadow-md"
          >
            {isEn ? `Explore Career Paths (${pricing.careerPathPriceEgp} EGP bundle)` : `استكشف المسارات المهنية (${pricing.careerPathPriceEgp} ج.م للحزمة) ➔`}
          </Link>
        </div>
      </div>
    </div>
  );
}
