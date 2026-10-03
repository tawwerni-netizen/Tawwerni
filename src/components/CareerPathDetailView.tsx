"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/components/LanguageContext";
import { CareerPath } from "@/content/career-paths";
import { resolveCareerPathProgress } from "@/lib/career-paths-progress";

type Props = {
  careerPath: CareerPath;
  userCompletedLessonIds: string[];
  isLoggedIn: boolean;
  relatedCareerPaths: CareerPath[];
};

export default function CareerPathDetailView({
  careerPath,
  userCompletedLessonIds,
  isLoggedIn,
  relatedCareerPaths,
}: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const completedSet = useMemo(
    () => new Set(userCompletedLessonIds),
    [userCompletedLessonIds]
  );

  const progress = useMemo(
    () => resolveCareerPathProgress(careerPath, completedSet),
    [careerPath, completedSet]
  );

  const nextTrack = progress.nextActionableTrack;
  const nextTrackUrl = nextTrack
    ? `/app/learn/${nextTrack.trackSlug}/${nextTrack.nextDayNumber}`
    : `/app/learn/${careerPath.stages[0]?.tracks[0]?.trackSlug || "prompt-engineering-mastery"}`;

  return (
    <div className="space-y-12 pb-16">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs">
        <Link
          href="/career-paths"
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 font-bold transition-colors"
        >
          <span>←</span>
          <span>{isEn ? "Back to All Career Paths" : "العودة لجميع المسارات المهنية"}</span>
        </Link>

        <span className="rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-1 text-2xs font-bold text-neutral-600 dark:text-neutral-400">
          {isEn ? careerPath.levelEn : careerPath.levelAr}
        </span>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 sm:p-10 shadow-sm">
        {/* Glow behind icon */}
        <div
          className={`pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br ${careerPath.accentGradient} opacity-20 blur-3xl`}
        />

        <div className="relative z-10 space-y-6">
          {/* Ambition Prompt Callout */}
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/25 px-3.5 py-1 text-xs font-black text-teal-800 dark:text-teal-300">
            <span>🎯</span>
            <span>{isEn ? careerPath.goalPromptEn : careerPath.goalPromptAr}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${careerPath.accentGradient} text-3xl text-white shadow-md`}
                >
                  {careerPath.icon}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white">
                    {isEn ? careerPath.titleEn : careerPath.titleAr}
                  </h1>
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">
                    💼 {isEn ? `Target Role: ${careerPath.targetRoleEn}` : `الوظيفة المستهدفة: ${careerPath.targetRoleAr}`}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed pt-2">
                {isEn ? careerPath.descriptionEn : careerPath.descriptionAr}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 rounded-2xl bg-black/5 dark:bg-white/5 p-4 border border-black/5 dark:border-white/10 text-center">
              <div className="p-2">
                <span className="block text-2xl font-black text-neutral-900 dark:text-white">
                  {careerPath.stages.length}
                </span>
                <span className="text-2xs font-bold text-neutral-500">
                  {isEn ? "Stages" : "مراحل متتالية"}
                </span>
              </div>
              <div className="p-2">
                <span className="block text-2xl font-black text-neutral-900 dark:text-white">
                  {progress.totalTracksCount}
                </span>
                <span className="text-2xs font-bold text-neutral-500">
                  {isEn ? "Core Tracks" : "مسارات تعليمية"}
                </span>
              </div>
              <div className="p-2">
                <span className="block text-2xl font-black text-neutral-900 dark:text-white">
                  {progress.totalLessonsCount}
                </span>
                <span className="text-2xs font-bold text-neutral-500">
                  {isEn ? "Missions" : "مهمة تطبيقية"}
                </span>
              </div>
              <div className="p-2">
                <span className="block text-2xl font-black text-neutral-900 dark:text-white">
                  {careerPath.estimatedHours}h
                </span>
                <span className="text-2xs font-bold text-neutral-500">
                  {isEn ? "Estimated" : "ساعة تدريبية"}
                </span>
              </div>
            </div>
          </div>

          {/* User Progress Cockpit */}
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-500/10 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-neutral-900 dark:text-white">
                    {isEn ? "Your Pathway Progression" : "حالة تقدمك في هذا المسار المهني"}
                  </span>
                  <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-2xs font-extrabold text-teal-700 dark:text-teal-300">
                    {progress.percent}%
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {progress.isFullyCompleted
                    ? (isEn
                        ? "🎉 Outstanding! You have completed all milestones in this career path!"
                        : "🎉 رائع جداً! لقد أكملت جميع مراحل ومسارات هذا التخصص المهني!")
                    : (isEn
                        ? `Completed ${progress.completedTracksCount} of ${progress.totalTracksCount} tracks (${progress.completedLessonsCount}/${progress.totalLessonsCount} missions).`
                        : `أنجزت ${progress.completedTracksCount} من أصل ${progress.totalTracksCount} مسارات (${progress.completedLessonsCount}/${progress.totalLessonsCount} مهمة مكتملة).`)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={nextTrackUrl}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-6 py-2.5 text-xs font-black text-white shadow-md hover:brightness-110 active:scale-95 transition-all text-center"
                >
                  <span>
                    {progress.completedLessonsCount === 0
                      ? (isEn ? "Start Stage 1" : "ابدأ المرحلة الأولى")
                      : (isEn ? "Resume Current Mission" : "استأنف المهمة الحالية")}
                  </span>
                  <span>➔</span>
                </Link>
              </div>
            </div>

            {/* Progress bar line */}
            <div className="mt-3.5 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Target Skills Acquired */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
          <span>⚡</span>
          <span>{isEn ? "Core Skills You Will Master" : "المهارات الجوهرية التي ستتقنها عملياً"}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(isEn ? careerPath.keySkillsEn : careerPath.keySkillsAr).map((skill, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 p-3 text-xs"
            >
              <span className="text-teal-500 font-bold">✓</span>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Roadmap Timeline */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span>🗺️</span>
              <span>{isEn ? "Interactive Career Roadmap" : "خارطة الطريق التفاعلية (المراحل والمسارات)"}</span>
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {isEn
                ? "Complete each stage sequentially to unlock the capstone portfolio project"
                : "أكمل المراحل خطوة بخطوة بالترتيب لتحقيق أعلى استفادة وتجهيز سابقة أعمالك"}
            </p>
          </div>
        </div>

        {/* Vertical Timeline container */}
        <div className="relative space-y-10 before:absolute before:inset-0 before:start-4 sm:before:start-6 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-neutral-300 dark:before:via-neutral-800 before:to-transparent">
          {progress.stagesProgress.map((stageItem, stageIdx) => {
            const stage = stageItem.stage;
            const isCompleted = stageItem.isCompleted;
            const isCurrent = stageItem.isCurrent;

            return (
              <div key={stageItem.stageId} className="relative ps-11 sm:ps-16 space-y-4">
                {/* Stage Indicator Node */}
                <div
                  className={`absolute start-1.5 sm:start-3.5 top-0 flex h-6 w-6 sm:h-7 sm:w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 text-xs font-black transition-all ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                      : isCurrent
                      ? "border-teal-500 bg-white dark:bg-neutral-900 text-teal-500 ring-4 ring-teal-500/20 animate-pulse"
                      : "border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {isCompleted ? "✓" : stageIdx + 1}
                </div>

                {/* Stage Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {isEn ? `Stage 0${stageIdx + 1}` : `المرحلة 0${stageIdx + 1}`}
                      </span>
                      {isCompleted && (
                        <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-2xs font-bold">
                          {isEn ? "Stage Completed" : "مرحلة مكتملة ✓"}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 text-2xs font-bold animate-pulse">
                          {isEn ? "Active Stage" : "المرحلة الحالية"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white mt-0.5">
                      {isEn ? stage.titleEn : stage.titleAr}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl">
                      {isEn ? stage.descriptionEn : stage.descriptionAr}
                    </p>
                  </div>

                  <span className="text-2xs font-bold text-neutral-400 shrink-0">
                    {stageItem.completedTracksCount}/{stageItem.totalTracksCount} {isEn ? "tracks done" : "مسار منجز"}
                  </span>
                </div>

                {/* Stage Tracks Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {stageItem.tracks.map((trackItem) => {
                    const track = trackItem.track;
                    const ref = trackItem.trackRef;
                    const isTrackDone = trackItem.isCompleted;
                    const isTrackCurrent = trackItem.isCurrent;
                    const isTrackStarted = trackItem.isStarted;

                    const learnUrl = isTrackDone
                      ? `/app/learn/${ref.trackSlug}`
                      : `/app/learn/${ref.trackSlug}/${trackItem.nextDayNumber}`;

                    return (
                      <div
                        key={ref.trackSlug}
                        className={`group relative flex flex-col justify-between rounded-2xl border p-4 sm:p-5 transition-all ${
                          isTrackDone
                            ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10"
                            : isTrackCurrent
                            ? "border-teal-500 bg-white dark:bg-neutral-900 shadow-md ring-1 ring-teal-500/30"
                            : "border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60"
                        }`}
                      >
                        {/* Top row */}
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-2xl border border-black/5 dark:border-white/10">
                                {track?.icon || "📖"}
                              </span>
                              <div>
                                <h4 className="text-sm font-black text-neutral-900 dark:text-white group-hover:text-teal-500 transition-colors">
                                  {track ? (isEn ? track.titleEn : track.titleAr) : ref.trackSlug}
                                </h4>
                                <div className="flex items-center gap-2 text-2xs text-neutral-400 mt-0.5">
                                  <span>{track ? (isEn ? track.levelEn : track.levelAr) : "مبتدئ"}</span>
                                  <span>•</span>
                                  <span>{trackItem.totalLessons} {isEn ? "missions" : "مهمة"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Pill */}
                            {isTrackDone ? (
                              <span className="shrink-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-2xs font-extrabold text-emerald-700 dark:text-emerald-300">
                                ✓ {isEn ? "Completed" : "مكتمل"}
                              </span>
                            ) : isTrackCurrent ? (
                              <span className="shrink-0 rounded-full bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-2xs font-extrabold text-teal-700 dark:text-teal-300">
                                ● {isEn ? "Current" : "قيد التعلم"}
                              </span>
                            ) : isTrackStarted ? (
                              <span className="shrink-0 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-2xs font-extrabold text-amber-700 dark:text-amber-300">
                                {trackItem.percent}%
                              </span>
                            ) : null}
                          </div>

                          {/* Track Milestone & Deliverable */}
                          <div className="mt-4 space-y-2 text-xs">
                            <div className="rounded-xl bg-black/5 dark:bg-white/5 p-2.5 border border-black/5 dark:border-white/10">
                              <span className="font-extrabold text-neutral-700 dark:text-neutral-300 block text-2xs mb-0.5">
                                🎯 {isEn ? "What you will achieve:" : "الهدف المكتسب من هذا المسار:"}
                              </span>
                              <p className="text-neutral-600 dark:text-neutral-400 text-2xs leading-relaxed">
                                {isEn ? ref.milestoneEn : ref.milestoneAr}
                              </p>
                            </div>

                            <div className="rounded-xl bg-teal-500/5 dark:bg-teal-500/10 p-2.5 border border-teal-500/15">
                              <span className="font-extrabold text-teal-700 dark:text-teal-300 block text-2xs mb-0.5">
                                📦 {isEn ? "Required Deliverable:" : "المخرج العملي المطلوب:"}
                              </span>
                              <p className="text-neutral-600 dark:text-neutral-400 text-2xs leading-relaxed">
                                {isEn ? ref.deliverableEn : ref.deliverableAr}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Track Action CTA */}
                        <div className="mt-4 border-t border-black/5 dark:border-white/10 pt-3 flex items-center justify-between">
                          <span className="text-2xs text-neutral-400 font-bold">
                            {isTrackDone
                              ? (isEn ? "All missions done" : "جميع المهمات منجزة")
                              : `${trackItem.completedLessonsCount}/${trackItem.totalLessons} ${isEn ? "missions" : "مهمة"}`}
                          </span>

                          <Link
                            href={learnUrl}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition-all ${
                              isTrackCurrent
                                ? "bg-teal-600 text-white shadow-xs hover:bg-teal-500"
                                : isTrackDone
                                ? "bg-black/5 dark:bg-white/10 text-neutral-700 dark:text-neutral-200 hover:bg-black/10"
                                : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-teal-600 hover:text-white"
                            }`}
                          >
                            <span>
                              {isTrackDone
                                ? (isEn ? "Review Track" : "مراجعة المسار")
                                : isTrackStarted
                                ? (isEn ? `Day ${trackItem.nextDayNumber}` : `الدرس ${trackItem.nextDayNumber}`)
                                : (isEn ? "Start Track" : "ابدأ المسار")}
                            </span>
                            <span>➔</span>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Capstone Portfolio Project Section */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-neutral-900/60 p-6 sm:p-10 backdrop-blur-md">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-black text-amber-700 dark:text-amber-300">
            <span>🏆</span>
            <span>{isEn ? "Capstone Portfolio Proof" : "المشروع الختامي للبورتفوليو وإثبات الكفاءة"}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
            {isEn ? careerPath.portfolioProjectEn : careerPath.portfolioProjectAr}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl">
            {isEn
              ? "At Tawwerni, completion is not about watching hours of video. It is about building a verified project you can put in your portfolio, present in job interviews, or showcase to clients as tangible proof of competence."
              : "في طوّرني، الإنجاز ليس مجرد شهادة ورقية أو مشاهدة فيديوهات. الإنجاز هو أن تخرج بهذا المشروع النهائي متكاملاً، وتضعه في رابط سابقة أعمالك (Portfolio)، ليكون دليلاً حاسماً يثبت مهارتك أمام أصحاب العمل والعملاء."}
          </p>

          <div className="rounded-2xl bg-white/70 dark:bg-neutral-900/70 p-4 border border-black/5 dark:border-white/10 max-w-2xl text-xs space-y-2">
            <span className="font-extrabold text-neutral-800 dark:text-neutral-200 block">
              🌟 {isEn ? "Final Transformation:" : "المخرج والنتيجة النهائية عند إكمال المسار:"}
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {isEn ? careerPath.finalOutcomeEn : careerPath.finalOutcomeAr}
            </p>
          </div>
        </div>
      </section>

      {/* Related Career Paths */}
      {relatedCareerPaths.length > 0 && (
        <section className="space-y-4 border-t border-black/5 dark:border-white/10 pt-8">
          <h3 className="text-base font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span>🧭</span>
            <span>{isEn ? "Explore Adjacent Career Paths" : "مسارات مهنية أخرى قد تهمك"}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedCareerPaths.map((rp) => (
              <Link
                key={rp.id}
                href={`/career-paths/${rp.slug}`}
                className="group flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 transition-all hover:border-teal-500/50 hover:-translate-y-0.5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-xl">
                  {rp.icon}
                </span>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white group-hover:text-teal-500 transition-colors truncate">
                    {isEn ? rp.titleEn : rp.titleAr}
                  </h4>
                  <p className="text-2xs text-neutral-500 truncate mt-0.5">
                    {isEn ? rp.targetRoleEn : rp.targetRoleAr}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
