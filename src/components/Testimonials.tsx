"use client";

import Link from "next/link";
import { PRACTICAL_PROJECTS } from "@/content/practical-projects";
import { getTrackDayOneUrl } from "@/lib/canonical-routes";
import { useI18n } from "./LanguageContext";

export default function Testimonials() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const featuredProjects = PRACTICAL_PROJECTS.slice(0, 6);

  return (
    <div className="mx-auto mb-16 max-w-5xl">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3.5 py-1 text-xs font-bold text-teal-600 dark:text-teal-400 mb-3">
          <span>🛠️</span>
          <span>{isEn ? "Actionable Capstones & Outcomes" : "مشاريع عملية ومخرجات حقيقية"}</span>
        </span>
        <h2 className="text-2xl font-black md:text-3xl text-neutral-900 dark:text-white tracking-tight">
          {isEn
            ? "Practical Projects and Tasks You Build on Tawwerni"
            : "نماذج من المشاريع والمهام التي يمكن للمتعلم تنفيذها"}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? "Every specialized track culminates in a tangible, production-ready deliverable you can document and showcase directly in your professional portfolio."
            : "كل مسار تخصصي ينتهي بمشروع تطبيقي ملموس يمكنك توثيقه وعرضه في ملف أعمالك، بعيداً عن المشاهدة السلبية والمحاضرات النظرية."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <div
            key={project.id}
            className="group rounded-3xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 p-5 shadow-xs flex flex-col justify-between hover:border-teal-500/40 hover:shadow-md transition-all text-neutral-900 dark:text-white relative overflow-hidden"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-20 w-20 rounded-full bg-teal-500/10 blur-lg group-hover:bg-teal-500/20 transition-all" />

            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 dark:text-teal-300">
                  <span>{project.icon}</span>
                  <span>{isEn ? project.domainEn : project.domainAr}</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  {isEn ? `${project.estimatedDays} Days` : `${project.estimatedDays} يوماً`}
                </span>
              </div>

              <h3 className="font-black text-sm text-neutral-900 dark:text-white mb-2 leading-snug">
                {isEn ? project.titleEn : project.titleAr}
              </h3>

              <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-black/5 dark:border-white/5 p-2.5 mb-3.5">
                <p className="text-[10px] font-bold text-teal-700 dark:text-teal-400 mb-0.5">
                  📦 {isEn ? "Deliverable:" : "المخرج العملي:"}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {isEn ? project.deliverableEn : project.deliverableAr}
                </p>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {project.tools.slice(0, 3).map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 border border-teal-200/40 dark:border-teal-800/40 text-teal-800 dark:text-teal-300 font-semibold"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-2">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[150px]">
                📚 {isEn ? project.trackTitleEn : project.trackTitleAr}
              </span>
              <Link
                href={getTrackDayOneUrl(project.trackSlug)}
                className="text-xs font-black text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors whitespace-nowrap"
              >
                {isEn ? "Try Day 1 Free →" : "جرّب اليوم الأول مجاناً ←"}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          <span>
            {isEn
              ? "Browse all practical projects and portfolio capstones →"
              : "استكشف كافة المشاريع والمهام التطبيقية في المنصة ←"}
          </span>
        </Link>
      </div>
    </div>
  );
}
