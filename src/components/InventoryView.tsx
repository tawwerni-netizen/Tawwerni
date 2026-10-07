"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "./LanguageContext";
import type { UserInventory } from "@/lib/entitlements";
import type { NextStepRecommendation } from "@/lib/recommendations";

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

  // Filtered tracks
  const filteredTracks = inventory.ownedTracks.filter((track) => {
    if (selectedCareerPathFilter && track.viaCareerPathSlug !== selectedCareerPathFilter) {
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
              {inventory.isLegacyFullAccess
                ? isEn
                  ? "As a founding member, you have unrestricted access to all 100 individual tracks and complete career paths."
                  : "بصفتك مشتركاً مؤسساً، تمتلك وصولاً كاملاً غير مقيد لكافة الـ 100 مسار تخصصي وجميع المسارات المهنية الشاملة."
                : isEn
                ? "Manage your owned career roadmaps and specialized tracks. Track your independent milestones and certifications."
                : "هنا تجد كافة المسارات المهنية والتخصصية التي تمتلكها، مع متابعة تقدمك وإنجازاتك اليومية وشهاداتك المعتمدة."}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full md:w-auto shrink-0">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-3 text-center">
              <span className="block text-[11px] text-neutral-400 font-medium">
                {isEn ? "Career Paths" : "المسارات المهنية"}
              </span>
              <span className="block text-xl font-black text-emerald-400 font-mono mt-0.5">
                {inventory.isLegacyFullAccess ? "11" : inventory.ownedCareerPaths.length}
              </span>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-3 text-center">
              <span className="block text-[11px] text-neutral-400 font-medium">
                {isEn ? "Owned Tracks" : "المسارات الممتلكة"}
              </span>
              <span className="block text-xl font-black text-white font-mono mt-0.5">
                {inventory.isLegacyFullAccess ? "100" : inventory.ownedTracks.length}
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

      {/* 2. Deterministic Next Step Recommendation Card */}
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

      {/* 3. Owned Career Paths Section */}
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
            <span>{isEn ? "Explore All Career Paths (100 EGP)" : "تصفح كل المسارات المهنية (١٠٠ ج.م)"}</span>
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
                ? "Career paths combine multiple specialized tracks into a structured milestone roadmap for just 100 EGP."
                : "المسار المهني يجمع عدة مسارات تخصصية مترابطة في خريطة عمل واحدة تؤهلك لسوق العمل بـ ١٠٠ ج.م فقط."}
            </p>
            <Link
              href="/career-paths"
              className="inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-black text-neutral-950 hover:bg-emerald-400 transition-all cursor-pointer"
            >
              {isEn ? "Explore Career Paths (100 EGP) ➔" : "استكشف المسارات المهنية (١٠٠ ج.م) ➔"}
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

      {/* 4. Owned Specialized Tracks Section */}
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

        {selectedCareerPathFilter && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
            <span className="text-emerald-300 font-bold">
              {isEn ? "Filtered by Career Path" : "معروض فقط مسارات المسار المهني المحدد"}
            </span>
            <button
              type="button"
              onClick={() => setSelectedCareerPathFilter(null)}
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              {isEn ? "Clear Filter ✕" : "إلغاء التصفية ✕"}
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
                ? "You can unlock any specialized track for 50 EGP or get complete Career Paths for 100 EGP."
                : "يمكنك تملك أي مسار تخصصي منفرد بـ ٥٠ ج.م فقط أو الحصول على مسار مهني متكامل بـ ١٠٠ ج.م."}
            </p>
            <Link
              href="/tracks"
              className="inline-block rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-black text-neutral-950 hover:bg-emerald-400 transition-all cursor-pointer"
            >
              {isEn ? "Browse 100 Tracks (50 EGP) ➔" : "تصفح الـ ١٠٠ مسار (٥٠ ج.م) ➔"}
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
                        : track.source === "legacy"
                        ? isEn
                          ? "Founding Member"
                          : "وصول مؤسس شامل"
                        : isEn
                        ? "Direct Purchase (50 EGP)"
                        : "مملوك مباشرة (٥٠ ج.م)"}
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

      {/* 5. Catalog Upsell & Expansion Card */}
      <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-6 text-center space-y-3">
        <h3 className="text-base sm:text-lg font-black text-white">
          {isEn ? "Want to expand your knowledge base?" : "هل تريد توسيع مخزونك التعليمي؟"}
        </h3>
        <p className="text-xs text-neutral-300 max-w-xl mx-auto leading-relaxed">
          {isEn
            ? "Add any focused track for 50 EGP, or grab complete career roadmaps with multiple certified tracks for 100 EGP."
            : "يمكنك إضافة أي مسار تخصصي جديد بـ ٥٠ ج.م فقط، أو الحصول على مسار مهني متكامل يضم حزمة مسارات بـ ١٠٠ ج.م."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/tracks"
            className="rounded-full border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-5 py-2.5 text-xs font-bold text-emerald-300 transition-all cursor-pointer"
          >
            {isEn ? "Browse 100 Tracks (50 EGP each)" : "تصفح الـ ١٠٠ مسار (٥٠ ج.م للمسار) ➔"}
          </Link>
          <Link
            href="/career-paths"
            className="rounded-full bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-black text-neutral-950 transition-all cursor-pointer shadow-md"
          >
            {isEn ? "Explore Career Paths (100 EGP bundle)" : "استكشف المسارات المهنية (١٠٠ ج.م للحزمة) ➔"}
          </Link>
        </div>
      </div>
    </div>
  );
}
