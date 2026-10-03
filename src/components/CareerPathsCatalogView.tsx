"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/components/LanguageContext";
import {
  CareerPath,
  CareerGoalCategory,
  CAREER_GOAL_FILTERS,
} from "@/content/career-paths";
import { resolveCareerPathProgress } from "@/lib/career-paths-progress";

type Props = {
  careerPaths: CareerPath[];
  userCompletedLessonIds: string[];
  isLoggedIn: boolean;
};

export default function CareerPathsCatalogView({
  careerPaths,
  userCompletedLessonIds,
  isLoggedIn,
}: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [selectedGoal, setSelectedGoal] = useState<CareerGoalCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const completedSet = useMemo(
    () => new Set(userCompletedLessonIds),
    [userCompletedLessonIds]
  );

  const filteredPaths = useMemo(() => {
    return careerPaths.filter((cp) => {
      // Goal category filter
      if (selectedGoal !== "all" && cp.goalCategory !== selectedGoal) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = (cp.titleAr + " " + cp.titleEn).toLowerCase().includes(q);
        const matchDesc = (cp.descriptionAr + " " + cp.descriptionEn).toLowerCase().includes(q);
        const matchPrompt = (cp.goalPromptAr + " " + cp.goalPromptEn).toLowerCase().includes(q);
        const matchRole = (cp.targetRoleAr + " " + cp.targetRoleEn).toLowerCase().includes(q);
        return matchTitle || matchDesc || matchPrompt || matchRole;
      }
      return true;
    });
  }, [careerPaths, selectedGoal, searchQuery]);

  return (
    <div className="space-y-12">
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-b from-teal-500/15 via-neutral-900/60 to-neutral-950 p-6 sm:p-12 text-center backdrop-blur-xl shadow-2xl">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-full max-w-2xl rounded-full bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-cyan-500/20 blur-3xl -z-10" />

        <div className="mx-auto max-w-3xl space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/15 px-4 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300 shadow-xs">
            <span className="text-sm">🧭</span>
            <span>
              {isEn
                ? "Outcome-Driven Career Roadmaps"
                : "خرائط طريق تخصصية موجهة نحو التوظيف وبناء الدخل"}
            </span>
          </div>

          {/* Main Title - Formatted with Perfect Breathing Room */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-white leading-[1.25] tracking-tight">
            {isEn ? "Stop Guessing Where to Start." : "لا تسأل: أي كورس أبدأ؟"}
            <span className="block mt-2 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {isEn ? "Choose Your Goal. Follow the Roadmap." : "حدد هدفك المهني، واتبع خارطة الطريق."}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
            {isEn
              ? "Instead of wandering across 100 detached courses, step into sequential career paths. Each roadmap guides you through foundational logic, core toolkits, real project deliverables, and capstone portfolio proof."
              : "بدل التشتت بين 100 كورس منفصل؛ صممنا لك مسارات مهنية مرتبة على مراحل واقعية (تأسيس ← مهارات جوهرية ← تطبيق عملي متقدم ← مشاريع بورتفوليو تثبت كفاءتك لأصحاب الأعمال والعملاء)."}
          </p>

          {/* 3 Dopamine Reassurance Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-bold text-neutral-700 dark:text-neutral-200">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-neutral-900/80 px-4 py-2 border border-black/5 dark:border-white/10 shadow-2xs">
              <span className="text-teal-500 text-sm">✓</span>
              <span>{isEn ? "12 Curated Specializations" : "12 مسار مهني متكامل"}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-neutral-900/80 px-4 py-2 border border-black/5 dark:border-white/10 shadow-2xs">
              <span className="text-emerald-500 text-sm">✓</span>
              <span>{isEn ? "Structured in Ordered Stages" : "مقسمة إلى مراحل ومحطات بالترتيب"}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-neutral-900/80 px-4 py-2 border border-black/5 dark:border-white/10 shadow-2xs">
              <span className="text-amber-500 text-sm">🏆</span>
              <span>{isEn ? "Verified Capstone Deliverables" : "مشاريع بورتفوليو فعلية للاعتماد"}</span>
            </span>
          </div>
        </div>
      </section>

      {/* ================= 2. GOAL FILTER PILLS & SEARCH ================= */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>{isEn ? "What do you want to achieve?" : "ما هو طموحك الذي تريد تحقيقه؟"}</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isEn
                ? "Filter roadmaps according to your career ambition"
                : "اختر هدفك لتصفية المسارات المناسبة لك مباشرة"}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search paths, roles, skills..." : "ابحث عن مسار، وظيفة، أو مهارة..."}
              className="w-full rounded-2xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-neutral-900/80 px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 end-3 my-auto text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Goal Selector Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          {CAREER_GOAL_FILTERS.map((filter) => {
            const isSelected = selectedGoal === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedGoal(filter.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/20 scale-102 ring-2 ring-teal-400/40"
                    : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-600 dark:hover:text-teal-300"
                }`}
              >
                <span className="text-sm">{filter.icon}</span>
                <span>{isEn ? filter.labelEn : filter.labelAr}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= 3. CAREER PATHS CARDS GRID ================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-bold">
          <span>
            {isEn
              ? `Showing ${filteredPaths.length} career path${filteredPaths.length === 1 ? "" : "s"}`
              : `عرض ${filteredPaths.length} مسار مهني`}
          </span>
          {isLoggedIn && (
            <span className="text-teal-500 flex items-center gap-1.5 font-bold">
              <span className="inline-block h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span>{isEn ? "Progress saved to your account" : "سجل تقدمك متصل بحسابك"}</span>
            </span>
          )}
        </div>

        {filteredPaths.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-black/15 dark:border-white/15 p-12 text-center bg-white/40 dark:bg-neutral-900/40">
            <span className="text-4xl block mb-2">🔍</span>
            <p className="text-base font-black text-neutral-800 dark:text-neutral-200">
              {isEn ? "No matching career paths found" : "لم يتم العثور على مسارات تطابق بحثك"}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {isEn ? "Try adjusting your search query or goal filter" : "جرب تغيير مصطلح البحث أو اختيار فئة أخرى"}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedGoal("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-full bg-teal-500 text-white font-bold px-5 py-2 text-xs shadow-md hover:bg-teal-400"
            >
              {isEn ? "Reset Filters" : "إعادة ضبط الفلاتر"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredPaths.map((cp) => {
              const progress = resolveCareerPathProgress(cp, completedSet);
              const totalTracks = progress.totalTracksCount;
              const completedTracks = progress.completedTracksCount;
              const hasStarted = progress.completedLessonsCount > 0;

              return (
                <div
                  key={cp.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/95 shadow-sm transition-all duration-300 hover:border-teal-500/50 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* ----- CARD TOP COVER ARTWORK ----- */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={cp.coverImage}
                      alt={isEn ? cp.titleEn : cp.titleAr}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 opacity-90"
                      loading="lazy"
                    />
                    {/* Dark gradient fade for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 text-2xs font-extrabold text-white shadow-sm shrink-0 whitespace-nowrap">
                        <span className="text-xs">{cp.icon}</span>
                        <span>{isEn ? cp.levelEn : "كافة المستويات"}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-teal-500/40 px-2.5 py-1 text-2xs font-bold text-teal-300 shadow-sm whitespace-nowrap shrink-0">
                        <span>⏱️ {isEn ? `${cp.estimatedHours}h` : `${cp.estimatedHours} ساعة`}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white">📚 {totalTracks} {isEn ? "Tracks" : "مسارات"}</span>
                      </span>
                    </div>

                    {/* Speech Bubble - Fully Legible & Prominent */}
                    <div className="absolute inset-x-3.5 bottom-3.5 z-10">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-neutral-950/90 backdrop-blur-md border border-teal-400/40 px-3 py-2 text-xs font-bold text-teal-200 shadow-lg w-full">
                        <span className="text-sm shrink-0">💬</span>
                        <span className="leading-snug">
                          {isEn ? cp.goalPromptEn : cp.goalPromptAr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ----- CARD BODY ----- */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Titles - Full & Clear, Zero Truncation */}
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white group-hover:text-teal-400 transition-colors leading-snug">
                          {isEn ? cp.titleEn : cp.titleAr}
                        </h3>
                        <p className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400/90 mt-0.5">
                          {isEn ? cp.titleAr : cp.titleEn}
                        </p>
                      </div>

                      {/* Target Role Badge */}
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 text-2xs font-extrabold text-teal-800 dark:text-teal-300">
                        <span>💼</span>
                        <span>
                          {isEn ? `Role: ${cp.targetRoleEn}` : `الوظيفة: ${cp.targetRoleAr}`}
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-neutral-700 dark:text-neutral-200 leading-relaxed font-medium">
                        {isEn ? cp.taglineEn : cp.taglineAr}
                      </p>

                      {/* User Progress Bar (if logged in) */}
                      {isLoggedIn && (
                        <div className="rounded-xl bg-neutral-100 dark:bg-neutral-950/80 p-3 border border-black/5 dark:border-teal-500/20 space-y-1.5">
                          <div className="flex items-center justify-between text-2xs font-bold">
                            <span className="text-neutral-700 dark:text-neutral-300">
                              {isEn ? "Your Path Progress" : "تقدمك في المسار"}
                            </span>
                            <span className={progress.percent > 0 ? "text-teal-600 dark:text-teal-400 font-black" : "text-neutral-400"}>
                              {progress.percent}% ({completedTracks}/{totalTracks} {isEn ? "tracks" : "مسار"})
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                              style={{ width: `${progress.percent}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Roadmap Stages Preview - High-Contrast & Crystal Clear */}
                      <div className="rounded-2xl bg-neutral-100/90 dark:bg-neutral-950/85 p-3.5 border border-black/10 dark:border-teal-500/30 shadow-inner space-y-2.5">
                        <div className="flex items-center justify-between text-2xs font-black uppercase tracking-wider">
                          <span className="text-neutral-800 dark:text-teal-300 flex items-center gap-1.5">
                            <span>🧭</span>
                            <span>{isEn ? "Sequential Roadmap Stages" : "مراحل خريطة الطريق بالترتيب"}</span>
                          </span>
                          <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-2xs font-bold text-teal-700 dark:text-teal-300 font-mono">
                            {cp.stages.length} {isEn ? "Stages" : "مراحل"}
                          </span>
                        </div>

                        <div className="space-y-2 pt-0.5">
                          {cp.stages.map((st, idx) => (
                            <div
                              key={st.id}
                              className="flex items-center gap-2.5 text-xs"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 border border-teal-400/40 text-2xs font-black text-teal-800 dark:text-teal-200 shadow-2xs">
                                {idx + 1}
                              </span>
                              <span className="font-bold text-xs leading-snug text-neutral-900 dark:text-white">
                                {isEn ? st.titleEn : st.titleAr}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Capstone Deliverable Trophy Box */}
                      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs">
                        <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300 mb-1">
                          <span className="text-base">🏆</span>
                          <span>{isEn ? "Capstone Deliverable Proof:" : "المشروع الختامي للبورتفوليو:"}</span>
                        </div>
                        <p className="text-neutral-700 dark:text-neutral-200 text-xs font-semibold leading-relaxed">
                          {isEn ? cp.portfolioProjectEn : cp.portfolioProjectAr}
                        </p>
                      </div>
                    </div>

                    {/* ----- CARD FOOTER & CTA BUTTON (HIGH CONTRAST & NEVER WHITE-ON-WHITE) ----- */}
                    <div className="pt-4 border-t border-black/5 dark:border-white/10">
                      <Link
                        href={`/career-paths/${cp.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-sm py-3.5 px-6 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer text-center"
                      >
                        <span>
                          {hasStarted
                            ? (isEn ? "Resume Roadmap" : "استأنف خارطة الطريق")
                            : (isEn ? "View Roadmap & Milestones" : "استعرض خارطة الطريق والمراحل")}
                        </span>
                        <span className="text-base">➔</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
