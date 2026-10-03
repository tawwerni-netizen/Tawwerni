"use client";

import Link from "next/link";
import { TrackSkillTree, SkillNode } from "@/content/skill-trees";
import { useI18n } from "./LanguageContext";
import { resolveDomainTheme } from "@/lib/design-system/domain-themes";

export default function SkillTreeView({ tree }: { tree: TrackSkillTree }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const theme = resolveDomainTheme({ trackSlug: tree.trackSlug, title: tree.titleAr });
  const masteredCount = tree.skills.filter((s) => s.status === "mastered").length;
  const progressPercent = Math.round((masteredCount / tree.skills.length) * 100);

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: theme.palette.primary }}
            >
              {isEn ? "COMPETENCY TREE" : "خريطة المهارات المكتسبة"}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
              {masteredCount} / {tree.skills.length} {isEn ? "Mastered" : "متقنة"} ({progressPercent}%)
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span>{tree.icon}</span>
            <span>{isEn ? tree.titleEn : tree.titleAr}</span>
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
            <span>{isEn ? "Mastered ⭐" : "متقنة ⭐"}</span>
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-xs"
              style={{ backgroundColor: theme.palette.accent }}
            />
            <span>{isEn ? "In Progress ⚡" : "قيد التطوير ⚡"}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <span>{isEn ? "Available ⚪" : "متاحة ⚪"}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
            <span>{isEn ? "Locked 🔒" : "مغلقة 🔒"}</span>
          </span>
        </div>
      </div>

      {/* Visual Skill Graph Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
        {tree.skills.map((skill, idx) => {
          const isMastered = skill.status === "mastered";
          const isInProgress = skill.status === "in_progress";
          const isAvailable = skill.status === "available";
          const isLocked = skill.status === "locked";

          return (
            <div
              key={skill.id}
              style={
                isInProgress
                  ? {
                      backgroundColor: `${theme.palette.primary}12`,
                      borderColor: `${theme.palette.primary}55`,
                      boxShadow: `0 0 0 1px ${theme.palette.primary}22`,
                    }
                  : undefined
              }
              className={`relative rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 ${
                isMastered
                  ? "bg-amber-500/10 border-amber-400/40 text-neutral-900 dark:text-white shadow-xs"
                  : isInProgress
                  ? "text-neutral-900 dark:text-white"
                  : isAvailable
                  ? "bg-neutral-50 dark:bg-neutral-800/40 border-black/5 dark:border-white/10 text-neutral-800 dark:text-neutral-200"
                  : "bg-neutral-100/50 dark:bg-neutral-900/40 border-black/5 dark:border-white/5 opacity-60 text-neutral-400"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-2xs border border-black/5 dark:border-white/5">
                    {skill.icon}
                  </span>

                  <span
                    style={
                      isInProgress
                        ? {
                            backgroundColor: `${theme.palette.primary}22`,
                            color: theme.palette.accent,
                            borderColor: `${theme.palette.primary}44`,
                          }
                        : undefined
                    }
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      isMastered
                        ? "bg-amber-400 text-neutral-950 border-amber-300 font-bold"
                        : isInProgress
                        ? ""
                        : isAvailable
                        ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-transparent"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 border-transparent"
                    }`}
                  >
                    {isMastered
                      ? isEn ? "Mastered ⭐" : "متقنة موثقة ⭐"
                      : isInProgress
                      ? isEn ? "In Progress ⚡" : "قيد التطوير ⚡"
                      : isAvailable
                      ? isEn ? "Available ⚪" : "متاحة للتحدي"
                      : isEn ? "Locked 🔒" : "مغلقة 🔒"}
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-black leading-snug">
                  {isEn ? skill.nameEn : skill.nameAr}
                </h4>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {isEn ? skill.descriptionEn : skill.descriptionAr}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                <span>{isEn ? `Milestone: Day ${skill.unlockedAtDay}` : `المحطة: يوم ${skill.unlockedAtDay}`}</span>
                {isMastered && (
                  <span className="text-amber-600 dark:text-amber-300 font-bold">
                    {isEn ? "Evidence: Verified ✓" : "الإثبات: موثق ✓"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Final Project Capstone Bar */}
      <div
        className={`rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
          tree.finalProjectUnlocked
            ? "bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border-amber-400/60 shadow-md"
            : "bg-neutral-100 dark:bg-neutral-800/40 border-black/5 dark:border-white/5 opacity-80"
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-neutral-950 flex items-center justify-center text-2xl shrink-0 shadow-md font-black">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-black uppercase text-amber-700 dark:text-amber-300">
                {isEn ? "FINAL CAPSTONE PROJECT" : "مشروع التخرج المعتمد (CAPSTONE)"}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  tree.finalProjectUnlocked
                    ? "bg-emerald-500 text-white"
                    : "bg-neutral-300 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
                }`}
              >
                {tree.finalProjectUnlocked ? (isEn ? "Unlocked" : "مفتوح للإنجاز") : (isEn ? "Locked" : "مغلق")}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">
              {isEn ? tree.finalProjectTitleEn : tree.finalProjectTitleAr}
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isEn
                ? "Combines all track skills. Completing this unlocks your verified digital credential & portfolio exhibit."
                : "يجمع كافة مهارات المسار. عند إنجازه بنجاح يتم توثيق جواز مهاراتك وفتح شهادة الإتمام الرقمية الموثقة."}
            </p>
          </div>
        </div>

        {tree.finalProjectUnlocked ? (
          <Link
            href={`/app/learn/${tree.trackSlug}/24`}
            className="shrink-0 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs px-4 py-2.5 text-center shadow-md active:scale-95 transition"
          >
            {isEn ? "Launch Final Project →" : "بدء مشروع التخرج ←"}
          </Link>
        ) : (
          <span className="shrink-0 text-xs text-neutral-500 font-bold bg-black/5 dark:bg-white/5 px-3 py-2 rounded-xl text-center">
            {isEn ? `Complete all skills to unlock` : `يتطلب إتقان كافة المهارات أعلاه`}
          </span>
        )}
      </div>
    </div>
  );
}
