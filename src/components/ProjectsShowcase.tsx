"use client";

import { useState } from "react";
import { useI18n } from "./LanguageContext";

export type DemonstratedProject = {
  id: string;
  titleAr: string;
  titleEn: string;
  skillNameAr: string;
  skillNameEn: string;
  skillIcon: string;
  artifactSummaryAr: string;
  artifactSummaryEn: string;
  score: number;
  completedAt: string;
};

export default function ProjectsShowcase({
  projects = [],
}: {
  projects: DemonstratedProject[];
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const [activeArtifact, setActiveArtifact] = useState<DemonstratedProject | null>(null);

  return (
    <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              {isEn ? "PROOF OF WORK" : "معرض المشاريع والإثباتات"}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
              {projects.length} {isEn ? "Verified Projects" : "مشاريع منجزة"}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span>💼</span>
            <span>{isEn ? "Your Demonstrated Projects Portfolio" : "مخرجاتك ومشاريعك الواقعية المعتمدة"}</span>
          </h3>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-8 text-center bg-neutral-50/50 dark:bg-neutral-800/20">
          <span className="text-3xl mb-2 block">📁</span>
          <p className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">
            {isEn ? "No verified projects yet" : "لا توجد مشاريع منجزة حتى الآن"}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">
            {isEn
              ? "Complete your daily missions to build verified portfolio pieces that prove your skills to clients and employers."
              : "أكمل مهامك اليومية التطبيقية ليتم توثيق أول مشروع عملي في بورتفوليو مهاراتك هنا."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/40 p-4 flex flex-col justify-between gap-3 hover:border-amber-400/40 transition"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/5 text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                    <span>{proj.skillIcon}</span>
                    <span>{isEn ? proj.skillNameEn : proj.skillNameAr}</span>
                  </span>

                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {proj.score}/100 ✓
                  </span>
                </div>

                <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white leading-snug">
                  {isEn ? proj.titleEn : proj.titleAr}
                </h4>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-3 leading-relaxed">
                  {isEn ? proj.artifactSummaryEn : proj.artifactSummaryAr}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-mono">
                  {proj.completedAt}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveArtifact(proj)}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  {isEn ? "View Artifact →" : "عرض المخرج ←"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Artifact Preview Modal */}
      {activeArtifact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0c1614] border border-black/10 dark:border-white/10 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {activeArtifact.skillIcon} {isEn ? activeArtifact.skillNameEn : activeArtifact.skillNameAr}
              </span>
              <button
                type="button"
                onClick={() => setActiveArtifact(null)}
                className="text-sm font-bold text-neutral-400 hover:text-white px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-2">
              {isEn ? activeArtifact.titleEn : activeArtifact.titleAr}
            </h3>

            <div className="my-4 rounded-2xl bg-neutral-100 dark:bg-black/50 border border-black/5 dark:border-white/10 p-4 font-mono text-xs text-neutral-800 dark:text-neutral-200 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {isEn ? activeArtifact.artifactSummaryEn : activeArtifact.artifactSummaryAr}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-black/5 dark:border-white/5">
              <span>{isEn ? "Verified Evidence Score:" : "درجة الإتقان الموثقة:"} <b className="text-emerald-500">{activeArtifact.score}/100</b></span>
              <button
                type="button"
                onClick={() => setActiveArtifact(null)}
                className="rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-bold px-4 py-2 text-xs"
              >
                {isEn ? "Close" : "إغلاق"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
