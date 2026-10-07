"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PRACTICAL_PROJECTS, PracticalProject } from "@/content/practical-projects";
import { getTrackDayOneUrl } from "@/lib/canonical-routes";
import { useI18n } from "./LanguageContext";

export default function CommunityWall() {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredProjects = useMemo(() => {
    return PRACTICAL_PROJECTS.filter((p) => {
      if (selectedDomain !== "all" && p.domain !== selectedDomain) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleAr = p.titleAr.toLowerCase();
        const titleEn = p.titleEn.toLowerCase();
        const deliverableAr = p.deliverableAr.toLowerCase();
        const tools = p.tools.join(" ").toLowerCase();
        const trackTitle = (p.trackTitleAr + " " + p.trackTitleEn).toLowerCase();
        return (
          titleAr.includes(q) ||
          titleEn.includes(q) ||
          deliverableAr.includes(q) ||
          tools.includes(q) ||
          trackTitle.includes(q)
        );
      }
      return true;
    });
  }, [selectedDomain, searchQuery]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  return (
    <section className="py-10 px-4 sm:px-6">
      {/* Filter and Search Bar */}
      <div className="mx-auto max-w-5xl mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Domain filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => {
              setSelectedDomain("all");
              setVisibleCount(9);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
              selectedDomain === "all"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {isEn ? "All Projects" : "كل المشاريع والمهام"}
          </button>
          <button
            onClick={() => {
              setSelectedDomain("ai");
              setVisibleCount(9);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDomain === "ai"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            🤖 {isEn ? "AI & Automation" : "الذكاء الاصطناعي"}
          </button>
          <button
            onClick={() => {
              setSelectedDomain("coding");
              setVisibleCount(9);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDomain === "coding"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            💻 {isEn ? "Web Development" : "البرمجة والويب"}
          </button>
          <button
            onClick={() => {
              setSelectedDomain("data");
              setVisibleCount(9);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDomain === "data"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            📊 {isEn ? "Data Analytics" : "تحليل البيانات"}
          </button>
          <button
            onClick={() => {
              setSelectedDomain("freelance");
              setVisibleCount(9);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDomain === "freelance"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            💼 {isEn ? "Freelancing" : "العمل الحر"}
          </button>
          <button
            onClick={() => {
              setSelectedDomain("marketing");
              setVisibleCount(9);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDomain === "marketing"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            📈 {isEn ? "Marketing & Growth" : "التسويق والمبيعات"}
          </button>
          <button
            onClick={() => {
              setSelectedDomain("design");
              setVisibleCount(9);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedDomain === "design"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            🎨 {isEn ? "UI/UX & Design" : "التصميم والواجهات"}
          </button>
        </div>

        {/* Search */}
        <div className="relative md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(9);
            }}
            placeholder={isEn ? "Search project, skill, tool..." : "ابحث باسم المشروع أو المهارة أو الأداة..."}
            className="w-full rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-teal-500 focus:outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-2.5 end-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="mx-auto max-w-5xl mb-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center justify-between">
        <span>
          {isEn
            ? `Showing ${visibleProjects.length} of ${filteredProjects.length} practical capstone projects`
            : `عرض ${visibleProjects.length} من أصل ${filteredProjects.length} مشروع ومهمة تطبيقية جاهزة للتنفيذ`}
        </span>
        <span className="text-teal-600 dark:text-teal-400 font-bold hidden sm:inline">
          {isEn ? "Free Day 1 Preview on all projects" : "اليوم الأول مجاني لكل مشروع بدون تسجيل مسبق"}
        </span>
      </div>

      {/* Practical Projects Grid */}
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleProjects.map((project) => (
          <div
            key={project.id}
            className="group rounded-3xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 p-5.5 backdrop-blur-md flex flex-col justify-between hover:border-teal-500/40 hover:shadow-lg transition-all text-neutral-900 dark:text-white relative overflow-hidden"
          >
            {/* Ambient card hover aura */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-teal-500/10 blur-xl group-hover:bg-teal-500/20 transition-all" />

            <div>
              {/* Domain & Badge Top Bar */}
              <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-teal-700 dark:text-teal-300">
                  <span className="text-base">{project.icon}</span>
                  <span>{isEn ? project.domainEn : project.domainAr}</span>
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {isEn ? `${project.estimatedDays} Days Roadmap` : `مسار ${project.estimatedDays} يوماً`}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-black text-sm sm:text-base text-neutral-900 dark:text-white mb-2 leading-snug">
                {isEn ? project.titleEn : project.titleAr}
              </h3>

              {/* Objective */}
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3.5">
                {isEn ? project.objectiveEn : project.objectiveAr}
              </p>

              {/* Tangible Deliverable Box */}
              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-black/5 dark:border-white/5 p-3 mb-4">
                <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider mb-1">
                  📦 {isEn ? "Portfolio Deliverable" : "ما ستوثقه في ملف أعمالك:"}
                </p>
                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                  {isEn ? project.deliverableEn : project.deliverableAr}
                </p>
              </div>

              {/* Tools Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-800/50 text-teal-800 dark:text-teal-300 font-semibold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer: Track & Day 1 CTA */}
            <div className="pt-3.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[170px]" title={isEn ? project.trackTitleEn : project.trackTitleAr}>
                📚 {isEn ? project.trackTitleEn : project.trackTitleAr}
              </span>
              <Link
                href={getTrackDayOneUrl(project.trackSlug)}
                className="inline-flex items-center gap-1 text-xs font-black text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors whitespace-nowrap"
              >
                <span>{isEn ? "Try Day 1 Free →" : "جرّب اليوم الأول مجاناً ←"}</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-16 text-center text-neutral-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm font-bold">
            {isEn ? "No projects found matching your search" : "لم نجد مشاريع تطابق بحثك"}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredProjects.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="px-8 py-3 rounded-full border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal-500/10 cursor-pointer"
          >
            {isEn
              ? `Load More Projects (${filteredProjects.length - visibleCount} more) ↓`
              : `عرض المزيد من المشاريع (${filteredProjects.length - visibleCount} مشروع إضافي) ↓`}
          </button>
        </div>
      )}
    </section>
  );
}
