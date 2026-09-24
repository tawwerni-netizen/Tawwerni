"use client";

import { useState, useMemo } from "react";
import { COMMUNITY_300 } from "@/content/community-300";
import { useI18n } from "./LanguageContext";

export default function CommunityWall() {
  const { lang, t } = useI18n();
  const [selectedArchetype, setSelectedArchetype] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredMembers = useMemo(() => {
    return COMMUNITY_300.filter((member) => {
      if (selectedArchetype !== "all" && member.archetype !== selectedArchetype) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = member.name.toLowerCase();
        const roleAr = member.roleAr.toLowerCase();
        const roleEn = member.roleEn.toLowerCase();
        const cityAr = member.cityAr.toLowerCase();
        const trackAr = member.trackTitleAr.toLowerCase();
        return name.includes(q) || roleAr.includes(q) || roleEn.includes(q) || cityAr.includes(q) || trackAr.includes(q);
      }
      return true;
    });
  }, [selectedArchetype, searchQuery]);

  const visibleMembers = filteredMembers.slice(0, visibleCount);

  return (
    <section className="py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 mb-3">
          <span>👥</span>
          <span>{lang === "ar" ? "مجتمع طوّرني · 300 عضو موثق" : "Tawwerni Community · 300 Verified Members"}</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white mb-3 tracking-tight">
          {t.communityTitle}
        </h2>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
          {t.communitySubtitle}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mx-auto max-w-5xl mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Archetype buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => { setSelectedArchetype("all"); setVisibleCount(12); }}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedArchetype === "all"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {t.categoryAll} (300)
          </button>
          <button
            onClick={() => { setSelectedArchetype("freelancer"); setVisibleCount(12); }}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedArchetype === "freelancer"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            💼 {lang === "ar" ? "المستقلون" : "Freelancers"}
          </button>
          <button
            onClick={() => { setSelectedArchetype("employee"); setVisibleCount(12); }}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedArchetype === "employee"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            👔 {lang === "ar" ? "الموظفون" : "Employees"}
          </button>
          <button
            onClick={() => { setSelectedArchetype("founder"); setVisibleCount(12); }}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedArchetype === "founder"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            🏢 {lang === "ar" ? "رواد الأعمال" : "Founders"}
          </button>
          <button
            onClick={() => { setSelectedArchetype("student"); setVisibleCount(12); }}
            className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
              selectedArchetype === "student"
                ? "bg-teal-600 text-white shadow-md"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            🎓 {lang === "ar" ? "الطلاب" : "Students"}
          </button>
        </div>

        {/* Search */}
        <div className="relative sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(12); }}
            placeholder={lang === "ar" ? "ابحث باسم أو تخصص..." : "Search member or role..."}
            className="w-full rounded-full border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:border-teal-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleMembers.map((member) => (
          <div
            key={member.id}
            className="rounded-3xl border border-black/5 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 p-5 backdrop-blur-md flex flex-col justify-between hover:border-teal-500/30 transition-all hover:-translate-y-1 shadow-xs text-neutral-900 dark:text-white"
          >
            <div>
              {/* Member Top Bar */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center font-bold text-neutral-950 text-sm shadow-md">
                  {member.avatarSeed}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white truncate">{member.name}</span>
                    <span className="text-teal-500 text-xs" title={t.verifiedLearner}>✓</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {lang === "ar" ? member.roleAr : member.roleEn} · {lang === "ar" ? member.cityAr : member.cityEn}
                  </p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-2.5 text-amber-400 text-xs">
                <span>★★★★★</span>
                <span className="text-neutral-400 dark:text-neutral-500 font-mono text-[10px]">({member.rating})</span>
              </div>

              {/* Quote */}
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 italic">
                &ldquo;{lang === "ar" ? member.quoteAr : member.quoteEn}&rdquo;
              </p>
            </div>

            {/* Track Tag Footer */}
            <div className="pt-3 border-t border-black/5 dark:border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="inline-flex items-center gap-1 text-teal-700 dark:text-teal-300 font-medium truncate max-w-[200px]">
                <span>📚</span>
                <span className="truncate">{lang === "ar" ? member.trackTitleAr : member.trackTitleEn}</span>
              </span>
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">Verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredMembers.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-6 py-2.5 rounded-full border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold transition-all hover:scale-105 active:scale-95"
          >
            {lang === "ar"
              ? `عرض المزيد (${filteredMembers.length - visibleCount} عضو إضافي)`
              : `Load More (${filteredMembers.length - visibleCount} more)`}
          </button>
        </div>
      )}
    </section>
  );
}
