"use client";

import { useState, useMemo } from "react";
import { COMMUNITY_300 } from "@/content/community-300";
import { useI18n } from "./LanguageContext";

export default function CommunityWall() {
  const { lang, t } = useI18n();
  const isEn = lang === "en";
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
        return (
          name.includes(q) ||
          roleAr.includes(q) ||
          roleEn.includes(q) ||
          cityAr.includes(q) ||
          trackAr.includes(q)
        );
      }
      return true;
    });
  }, [selectedArchetype, searchQuery]);

  const visibleMembers = filteredMembers.slice(0, visibleCount);

  return (
    <section className="py-10 px-4 sm:px-6">
      {/* Filter and Search Bar */}
      <div className="mx-auto max-w-5xl mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Archetype pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => {
              setSelectedArchetype("all");
              setVisibleCount(12);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 ${
              selectedArchetype === "all"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            {t.categoryAll} (300)
          </button>
          <button
            onClick={() => {
              setSelectedArchetype("freelancer");
              setVisibleCount(12);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedArchetype === "freelancer"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            💼 {isEn ? "Freelancers" : "المستقلون"}
          </button>
          <button
            onClick={() => {
              setSelectedArchetype("employee");
              setVisibleCount(12);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedArchetype === "employee"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            👔 {isEn ? "Employees" : "الموظفون"}
          </button>
          <button
            onClick={() => {
              setSelectedArchetype("founder");
              setVisibleCount(12);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedArchetype === "founder"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            🏢 {isEn ? "Founders" : "رواد الأعمال"}
          </button>
          <button
            onClick={() => {
              setSelectedArchetype("student");
              setVisibleCount(12);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedArchetype === "student"
                ? "bg-gradient-to-r from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20"
                : "bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            🎓 {isEn ? "Students" : "الطلاب"}
          </button>
        </div>

        {/* Search */}
        <div className="relative md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            placeholder={isEn ? "Search member, role, or city..." : "ابحث باسم أو تخصص أو مدينة..."}
            className="w-full rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:border-teal-500 focus:outline-hidden shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-2.5 end-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="mx-auto max-w-5xl mb-4 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
        {isEn
          ? `Showing ${Math.min(visibleCount, filteredMembers.length)} of ${filteredMembers.length} verified members`
          : `عرض ${Math.min(visibleCount, filteredMembers.length)} من أصل ${filteredMembers.length} عضو موثق`}
      </div>

      {/* Testimonials Grid */}
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleMembers.map((member) => (
          <div
            key={member.id}
            className="group rounded-3xl border border-black/5 dark:border-white/10 bg-white/90 dark:bg-neutral-900/80 p-5 backdrop-blur-md flex flex-col justify-between hover:border-teal-500/40 hover:shadow-lg transition-all text-neutral-900 dark:text-white relative overflow-hidden"
          >
            {/* Ambient card hover aura */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-teal-500/10 blur-xl group-hover:bg-teal-500/20 transition-all" />

            <div>
              {/* Member Top Bar */}
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-teal-400 flex items-center justify-center font-black text-neutral-950 text-sm shadow-md shrink-0">
                  {member.avatarSeed}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-neutral-900 dark:text-white truncate">
                      {member.name}
                    </span>
                    <span
                      className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-bold"
                      title={t.verifiedLearner}
                    >
                      ✓
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {isEn ? member.roleEn : member.roleAr} · {isEn ? member.cityEn : member.cityAr}
                  </p>
                </div>
              </div>

              {/* Star Rating & Badge */}
              <div className="flex items-center justify-between gap-1 mb-3 text-amber-400 text-xs">
                <div className="flex items-center gap-1">
                  <span>★★★★★</span>
                  <span className="text-neutral-400 dark:text-neutral-500 font-mono text-[10px]">
                    ({member.rating})
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {member.archetype === "freelancer" ? (isEn ? "Freelancer" : "مستقل")
                    : member.archetype === "founder" ? (isEn ? "Founder" : "رائد أعمال")
                    : member.archetype === "student" ? (isEn ? "Student" : "طالب")
                    : (isEn ? "Employee" : "موظف")}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4 italic">
                &ldquo;{isEn ? member.quoteEn : member.quoteAr}&rdquo;
              </p>
            </div>

            {/* Track Tag Footer */}
            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
              <span className="inline-flex items-center gap-1.5 text-teal-700 dark:text-teal-300 font-semibold truncate max-w-[200px]">
                <span>📚</span>
                <span className="truncate">{isEn ? member.trackTitleEn : member.trackTitleAr}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <span>⚡</span>
                <span>Active</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="py-16 text-center text-neutral-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm font-bold">
            {isEn ? "No members found matching your search" : "لم نجد أعضاء يطابقون بحثك"}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredMembers.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + 12)}
            className="px-8 py-3 rounded-full border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal-500/10"
          >
            {isEn
              ? `Load More (${filteredMembers.length - visibleCount} more members) ↓`
              : `عرض المزيد (${filteredMembers.length - visibleCount} عضو إضافي) ↓`}
          </button>
        </div>
      )}
    </section>
  );
}
