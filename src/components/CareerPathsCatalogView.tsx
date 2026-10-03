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
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-b from-teal-500/10 via-neutral-900/40 to-neutral-950/60 p-6 sm:p-10 text-center backdrop-blur-md">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-700 dark:text-teal-300">
            <span>🧭</span>
            <span>
              {isEn ? "Goal-Driven Career Roadmaps" : "خرائط طريق مهنية موجهة نحو النتائج"}
            </span>
          </div>

          <h1 className="text-2xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {isEn ? "Choose Your Ambition." : "لا تسأل: أي كورس أبدأ؟"}
            <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {isEn ? "Follow a Battle-Tested Roadmap." : "حدد هدفك المهني، واتبع خارطة الطريق."}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl mx-auto">
            {isEn
              ? "Instead of wandering across 100 detached courses, step into sequential career paths. Each roadmap guides you through foundational logic, core toolkits, real project deliverables, and capstone portfolio proof."
              : "بدل التشتت بين 100 كورس منفصل؛ صممنا لك مسارات مهنية مرتبة على مراحل واقعية (تأسيس ← مهارات جوهرية ← تطبيق عملي ← مشاريع بورتفوليو تثبت كفاءتك في سوق العمل)."}
          </p>

          {/* Quick Stats Banner */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 border border-black/5 dark:border-white/10">
              <span className="text-teal-500">✓</span>
              <span>{isEn ? "12 Curated Specializations" : "12 مسار مهني متكامل"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 border border-black/5 dark:border-white/10">
              <span className="text-teal-500">✓</span>
              <span>{isEn ? "Structured in Stages" : "مقسمة إلى مراحل ومحطات"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 dark:bg-white/5 px-3 py-1 border border-black/5 dark:border-white/10">
              <span className="text-teal-500">✓</span>
              <span>{isEn ? "Hands-on Capstones" : "مشاريع بورتفوليو فعلية"}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Goal Selector / Filter Pills */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span>🎯</span>
              <span>{isEn ? "What do you want to achieve?" : "ما هو طموحك الذي تريد تحقيقه؟"}</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "Filter roadmaps according to your career ambition"
                : "اختر طموحك لتصفية المسارات المهنية المناسبة لك مباشرة"}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isEn ? "Search paths, roles, skills..." : "ابحث عن مسار، وظيفة، أو مهارة..."}
              className="w-full rounded-full border border-black/10 dark:border-white/15 bg-white/70 dark:bg-neutral-900/70 px-4 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 shadow-2xs"
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

        {/* Goal Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CAREER_GOAL_FILTERS.map((filter) => {
            const isSelected = selectedGoal === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedGoal(filter.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-teal-500 text-white shadow-xs scale-102"
                    : "bg-white/80 dark:bg-neutral-900/80 border border-black/5 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-teal-500/40 hover:bg-teal-500/5 hover:text-teal-600 dark:hover:text-teal-300"
                }`}
              >
                <span>{filter.icon}</span>
                <span>{isEn ? filter.labelEn : filter.labelAr}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Career Paths Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <span>
            {isEn
              ? `Showing ${filteredPaths.length} career path${filteredPaths.length === 1 ? "" : "s"}`
              : `عرض ${filteredPaths.length} مسار مهني`}
          </span>
          {isLoggedIn && (
            <span className="text-teal-600 dark:text-teal-400 flex items-center gap-1">
              <span>●</span>
              <span>{isEn ? "Progress tracked to your profile" : "التقدم متصل بحسابك مباشرة"}</span>
            </span>
          )}
        </div>

        {filteredPaths.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/15 p-12 text-center">
            <span className="text-3xl">🔍</span>
            <p className="mt-2 text-sm font-bold text-neutral-700 dark:text-neutral-300">
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
              className="mt-4 rounded-full bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 text-xs font-bold text-teal-600 dark:text-teal-300 hover:bg-teal-500/20"
            >
              {isEn ? "Reset Filters" : "إعادة ضبط الفلاتر"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((cp) => {
              const progress = resolveCareerPathProgress(cp, completedSet);
              const totalTracks = progress.totalTracksCount;
              const completedTracks = progress.completedTracksCount;
              const hasStarted = progress.completedLessonsCount > 0;

              return (
                <div
                  key={cp.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-5 shadow-xs transition-all hover:border-teal-500/50 hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Top Header & Icon */}
                  <div>
                    {/* Goal Prompt Bubble */}
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/25 px-2.5 py-1 text-2xs sm:text-xs font-bold text-teal-800 dark:text-teal-300">
                      <span>💬</span>
                      <span className="line-clamp-1">{isEn ? cp.goalPromptEn : cp.goalPromptAr}</span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cp.accentGradient} text-2xl shadow-sm text-white`}
                        >
                          {cp.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-black text-neutral-900 dark:text-white group-hover:text-teal-500 transition-colors line-clamp-1">
                            {isEn ? cp.titleEn : cp.titleAr}
                          </h3>
                          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {isEn ? cp.targetRoleEn : cp.targetRoleAr}
                          </p>
                        </div>
                      </div>

                      {cp.featured && (
                        <span className="shrink-0 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-2xs font-extrabold text-amber-700 dark:text-amber-300">
                          {isEn ? "Featured" : "مميز"}
                        </span>
                      )}
                    </div>

                    {/* Tagline / Description */}
                    <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                      {isEn ? cp.taglineEn : cp.taglineAr}
                    </p>

                    {/* User Progress Bar (if logged in and has progress) */}
                    {isLoggedIn && (
                      <div className="mt-4 rounded-xl bg-black/5 dark:bg-white/5 p-2.5 border border-black/5 dark:border-white/10">
                        <div className="flex items-center justify-between text-2xs font-bold mb-1.5">
                          <span className="text-neutral-600 dark:text-neutral-400">
                            {isEn ? "Path Progress" : "تقدمك في المسار"}
                          </span>
                          <span className={progress.percent > 0 ? "text-teal-600 dark:text-teal-400" : "text-neutral-400"}>
                            {progress.percent}% ({completedTracks}/{totalTracks} {isEn ? "tracks" : "مسار"})
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Roadmap Stages Preview */}
                    <div className="mt-4 space-y-1.5 border-t border-black/5 dark:border-white/10 pt-3">
                      <p className="text-2xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        {isEn ? "Roadmap Stages" : "مراحل خريطة الطريق"}
                      </p>
                      <div className="space-y-1">
                        {cp.stages.map((st, idx) => (
                          <div
                            key={st.id}
                            className="flex items-center gap-2 text-2xs text-neutral-600 dark:text-neutral-400"
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-2xs font-bold text-neutral-500">
                              {idx + 1}
                            </span>
                            <span className="line-clamp-1">{isEn ? st.titleEn : st.titleAr}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Capstone Deliverable Snippet */}
                    <div className="mt-3.5 rounded-lg bg-teal-500/5 dark:bg-teal-500/10 border border-teal-500/15 p-2.5 text-2xs">
                      <span className="font-extrabold text-teal-700 dark:text-teal-300 block mb-0.5">
                        🏆 {isEn ? "Capstone Deliverable:" : "المشروع الختامي:"}
                      </span>
                      <span className="text-neutral-600 dark:text-neutral-400 line-clamp-1">
                        {isEn ? cp.portfolioProjectEn : cp.portfolioProjectAr}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 border-t border-black/5 dark:border-white/10 pt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-2xs text-neutral-500 dark:text-neutral-400">
                      <span>⏱️ {cp.estimatedHours} {isEn ? "hrs" : "ساعة"}</span>
                      <span>•</span>
                      <span>📚 {totalTracks} {isEn ? "tracks" : "مسارات"}</span>
                    </div>

                    <Link
                      href={`/career-paths/${cp.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 dark:bg-white px-3.5 py-1.5 text-xs font-black text-white dark:text-neutral-900 transition-all hover:bg-teal-600 dark:hover:bg-teal-400 hover:text-white dark:hover:text-black group-hover:shadow-sm"
                    >
                      <span>{hasStarted ? (isEn ? "Continue" : "استأنف") : (isEn ? "View Roadmap" : "خارطة الطريق")}</span>
                      <span>➔</span>
                    </Link>
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
