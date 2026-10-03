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
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-teal-400 font-bold transition-colors"
        >
          <span>←</span>
          <span>{isEn ? "Back to All Career Paths" : "العودة لجميع المسارات المهنية"}</span>
        </Link>

        <span className="rounded-full bg-teal-500/10 border border-teal-500/30 px-3.5 py-1 text-2xs font-bold text-teal-400">
          {isEn ? careerPath.levelEn : careerPath.levelAr}
        </span>
      </div>

      {/* ================= 1. HERO BANNER WITH COVER ARTWORK ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-teal-500/30 bg-neutral-950 p-6 sm:p-10 shadow-2xl">
        {/* Cover Artwork Background with Blur & Fade */}
        <div className="absolute inset-0 z-0">
          <img
            src={careerPath.coverImage}
            alt={isEn ? careerPath.titleEn : careerPath.titleAr}
            className="h-full w-full object-cover object-center opacity-30 blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Ambition Goal Prompt Box - Prominent & Fully Visible */}
          <div className="inline-flex items-center gap-2.5 rounded-2xl bg-teal-500/20 border border-teal-400/40 px-4 py-2 text-xs sm:text-sm font-black text-teal-200 shadow-lg">
            <span className="text-base shrink-0">🎯</span>
            <span className="leading-snug">{isEn ? careerPath.goalPromptEn : careerPath.goalPromptAr}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl">
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${careerPath.accentGradient} text-3xl sm:text-4xl text-white shadow-xl ring-2 ring-white/20`}
                >
                  {careerPath.icon}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                    {isEn ? careerPath.titleEn : careerPath.titleAr}
                  </h1>
                  <p className="text-sm font-mono font-bold text-teal-300 mt-1">
                    {isEn ? careerPath.titleAr : careerPath.titleEn}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 mt-1 flex items-center gap-1.5">
                    <span>💼</span>
                    <span>{isEn ? `Target Role: ${careerPath.targetRoleEn}` : `الوظيفة المستهدفة: ${careerPath.targetRoleAr}`}</span>
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-medium pt-1">
                {isEn ? careerPath.descriptionEn : careerPath.descriptionAr}
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 shrink-0 rounded-2xl bg-white/5 backdrop-blur-md p-5 border border-white/10 text-center">
              <div className="p-2">
                <span className="block text-2xl sm:text-3xl font-black text-white">
                  {careerPath.stages.length}
                </span>
                <span className="text-2xs font-bold text-neutral-400">
                  {isEn ? "Stages" : "مراحل متتالية"}
                </span>
              </div>
              <div className="p-2">
                <span className="block text-2xl sm:text-3xl font-black text-teal-300 font-mono">
                  {progress.totalTracksCount}
                </span>
                <span className="text-2xs font-bold text-neutral-400">
                  {isEn ? "Core Tracks" : "مسارات تعليمية"}
                </span>
              </div>
              <div className="p-2">
                <span className="block text-2xl sm:text-3xl font-black text-white font-mono">
                  {progress.totalLessonsCount}
                </span>
                <span className="text-2xs font-bold text-neutral-400">
                  {isEn ? "Missions" : "مهمة تطبيقية"}
                </span>
              </div>
              <div className="p-2">
                <span className="block text-2xl sm:text-3xl font-black text-amber-300 font-mono">
                  {careerPath.estimatedHours}{isEn ? "h" : ""}
                </span>
                <span className="text-2xs font-bold text-neutral-400">
                  {isEn ? "Estimated" : "ساعة تدريبية"}
                </span>
              </div>
            </div>
          </div>

          {/* User Progress Cockpit */}
          <div className="rounded-2xl border border-teal-500/40 bg-teal-950/40 backdrop-blur-md p-5 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-black text-white">
                    {isEn ? "Your Pathway Progression" : "حالة تقدمك في هذا المسار المهني"}
                  </span>
                  <span className="rounded-full bg-teal-500/20 border border-teal-400/40 px-2.5 py-0.5 text-xs font-mono font-black text-teal-300">
                    {progress.percent}%
                  </span>
                </div>
                <p className="text-xs text-neutral-300">
                  {progress.isFullyCompleted
                    ? (isEn
                        ? "🎉 Outstanding! You have completed all milestones in this career path!"
                        : "🎉 رائع جداً! لقد أكملت جميع مراحل ومسارات هذا التخصص المهني!")
                    : (isEn
                        ? `Completed ${progress.completedTracksCount} of ${progress.totalTracksCount} tracks (${progress.completedLessonsCount}/${progress.totalLessonsCount} missions).`
                        : `أنجزت ${progress.completedTracksCount} من أصل ${progress.totalTracksCount} مسارات (${progress.completedLessonsCount}/${progress.totalLessonsCount} مهمة مكتملة).`)}
                </p>
              </div>

              {/* Top CTA */}
              <Link
                href={nextTrackUrl}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 px-7 py-3.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-98 transition-all text-center cursor-pointer"
              >
                <span>
                  {progress.completedLessonsCount === 0
                    ? (isEn ? "Start Stage 1" : "ابدأ المرحلة الأولى")
                    : (isEn ? "Resume Current Mission" : "استأنف المهمة الحالية")}
                </span>
                <span>➔</span>
              </Link>
            </div>

            {/* Progress line */}
            <div className="h-2.5 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. TARGET SKILLS ================= */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span>{isEn ? "Core Skills You Will Master" : "المهارات الجوهرية التي ستتقنها عملياً"}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {(isEn ? careerPath.keySkillsEn : careerPath.keySkillsAr).map((skill, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 text-xs shadow-2xs"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-500 font-bold">
                ✓
              </span>
              <span className="text-neutral-800 dark:text-neutral-200 font-bold leading-snug">{skill}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. INTERACTIVE ROADMAP TIMELINE ================= */}
      <section className="space-y-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span>🗺️</span>
            <span>{isEn ? "Interactive Career Roadmap" : "خارطة الطريق التفاعلية (المراحل والمسارات)"}</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {isEn
              ? "Complete each stage sequentially to unlock the capstone portfolio project"
              : "أكمل المراحل خطوة بخطوة بالترتيب لتحقيق أعلى استفادة وبناء سابقة أعمالك"}
          </p>
        </div>

        {/* Vertical Timeline container */}
        <div className="relative space-y-12 before:absolute before:inset-0 before:start-4 sm:before:start-6 before:h-full before:w-1 before:bg-gradient-to-b before:from-teal-500 before:via-neutral-300 dark:before:via-neutral-800 before:to-transparent">
          {progress.stagesProgress.map((stageItem, stageIdx) => {
            const stage = stageItem.stage;
            const isCompleted = stageItem.isCompleted;
            const isCurrent = stageItem.isCurrent;

            return (
              <div key={stageItem.stageId} className="relative ps-11 sm:ps-16 space-y-4">
                {/* Stage Indicator Node */}
                <div
                  className={`absolute start-1.5 sm:start-3.5 top-0 flex h-7 w-7 sm:h-8 sm:w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 text-xs font-black transition-all ${
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-md"
                      : isCurrent
                      ? "border-teal-400 bg-neutral-900 text-teal-300 ring-4 ring-teal-500/30 animate-pulse shadow-lg"
                      : "border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {isCompleted ? "✓" : stageIdx + 1}
                </div>

                {/* Stage Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-3.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xs font-extrabold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {isEn ? `Stage 0${stageIdx + 1}` : `المرحلة 0${stageIdx + 1}`}
                      </span>
                      {isCompleted && (
                        <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-2xs font-bold">
                          {isEn ? "Stage Completed" : "مرحلة مكتملة ✓"}
                        </span>
                      )}
                      {isCurrent && (
                        <span className="rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-600 dark:text-teal-400 px-2.5 py-0.5 text-2xs font-bold animate-pulse">
                          {isEn ? "Active Stage" : "المرحلة الحالية"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mt-1">
                      {isEn ? stage.titleEn : stage.titleAr}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                      {isEn ? stage.descriptionEn : stage.descriptionAr}
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 shrink-0">
                    {stageItem.completedTracksCount}/{stageItem.totalTracksCount} {isEn ? "tracks done" : "مسار منجز"}
                  </span>
                </div>

                {/* Stage Tracks Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
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
                        className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all shadow-sm ${
                          isTrackDone
                            ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/20"
                            : isTrackCurrent
                            ? "border-teal-500 bg-white dark:bg-neutral-900 ring-2 ring-teal-500/40 shadow-lg"
                            : "border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/80"
                        }`}
                      >
                        {/* Top row */}
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/5 text-2xl border border-black/5 dark:border-white/10 shadow-2xs">
                                {track?.icon || "📖"}
                              </span>
                              <div>
                                <h4 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white group-hover:text-teal-400 transition-colors leading-snug">
                                  {track ? (isEn ? track.titleEn : track.titleAr) : ref.trackSlug}
                                </h4>
                                <div className="flex items-center gap-2 text-2xs font-bold text-neutral-500 mt-1">
                                  <span>{track ? (isEn ? track.levelEn : track.levelAr) : "مبتدئ"}</span>
                                  <span>•</span>
                                  <span>{trackItem.totalLessons} {isEn ? "missions" : "مهمة"}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Pill */}
                            {isTrackDone ? (
                              <span className="shrink-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-2xs font-extrabold text-emerald-600 dark:text-emerald-400">
                                ✓ {isEn ? "Completed" : "مكتمل"}
                              </span>
                            ) : isTrackCurrent ? (
                              <span className="shrink-0 rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-1 text-2xs font-extrabold text-teal-600 dark:text-teal-400">
                                ● {isEn ? "Current" : "قيد التعلم"}
                              </span>
                            ) : isTrackStarted ? (
                              <span className="shrink-0 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-2xs font-mono font-bold text-amber-700 dark:text-amber-300">
                                {trackItem.percent}%
                              </span>
                            ) : null}
                          </div>

                          {/* Track Milestone & Deliverable */}
                          <div className="space-y-2.5 text-xs">
                            <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3 border border-black/5 dark:border-white/10">
                              <span className="font-extrabold text-neutral-800 dark:text-neutral-200 block text-2xs mb-1">
                                🎯 {isEn ? "What you will achieve:" : "الهدف المكتسب من هذا المسار:"}
                              </span>
                              <p className="text-neutral-600 dark:text-neutral-300 text-xs leading-relaxed font-medium">
                                {isEn ? ref.milestoneEn : ref.milestoneAr}
                              </p>
                            </div>

                            <div className="rounded-xl bg-teal-500/10 border border-teal-500/25 p-3">
                              <span className="font-extrabold text-teal-800 dark:text-teal-300 block text-2xs mb-1">
                                📦 {isEn ? "Required Deliverable:" : "المخرج العملي المطلوب:"}
                              </span>
                              <p className="text-neutral-700 dark:text-neutral-200 text-xs leading-relaxed font-semibold">
                                {isEn ? ref.deliverableEn : ref.deliverableAr}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Track Action CTA - High Contrast & Never White-on-White */}
                        <div className="mt-5 border-t border-black/10 dark:border-white/10 pt-3.5 flex items-center justify-between">
                          <span className="text-2xs font-mono font-bold text-neutral-500">
                            {isTrackDone
                              ? (isEn ? "All missions done" : "جميع المهمات منجزة")
                              : `${trackItem.completedLessonsCount}/${trackItem.totalLessons} ${isEn ? "missions" : "مهمة"}`}
                          </span>

                          <Link
                            href={learnUrl}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-all cursor-pointer ${
                              isTrackCurrent
                                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25 hover:from-teal-400 hover:to-emerald-400 ring-2 ring-teal-400/40"
                                : isTrackDone
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-white/10 hover:border-teal-500/40 shadow-xs"
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

      {/* ================= 4. CAPSTONE PORTFOLIO PROJECT SECTION ================= */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-neutral-950 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/20 px-4 py-1.5 text-xs font-black text-amber-800 dark:text-amber-300">
            <span>🏆</span>
            <span>{isEn ? "Capstone Portfolio Proof" : "المشروع الختامي للبورتفوليو وإثبات الكفاءة"}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black text-neutral-900 dark:text-white leading-snug">
            {isEn ? careerPath.portfolioProjectEn : careerPath.portfolioProjectAr}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl font-medium">
            {isEn
              ? "At Tawwerni, completion is not about watching hours of video. It is about building a verified project you can put in your portfolio, present in job interviews, or showcase to clients as tangible proof of competence."
              : "في طوّرني، الإنجاز ليس مجرد شهادة ورقية أو مشاهدة فيديوهات. الإنجاز هو أن تخرج بهذا المشروع النهائي متكاملاً، وتضعه في رابط سابقة أعمالك (Portfolio)، ليكون دليلاً حاسماً يثبت مهارتك أمام أصحاب العمل والعملاء."}
          </p>

          <div className="rounded-2xl bg-white/80 dark:bg-neutral-900/80 p-4 sm:p-5 border border-black/10 dark:border-white/10 max-w-2xl text-xs space-y-2 shadow-xs">
            <span className="font-extrabold text-neutral-900 dark:text-neutral-100 block text-xs">
              🌟 {isEn ? "Final Transformation:" : "المخرج والنتيجة النهائية عند إكمال المسار:"}
            </span>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              {isEn ? careerPath.finalOutcomeEn : careerPath.finalOutcomeAr}
            </p>
          </div>
        </div>
      </section>

      {/* ================= 5. RELATED CAREER PATHS ================= */}
      {relatedCareerPaths.length > 0 && (
        <section className="space-y-4 border-t border-black/10 dark:border-white/10 pt-8">
          <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <span>🧭</span>
            <span>{isEn ? "Explore Adjacent Career Paths" : "مسارات مهنية أخرى قد تهمك"}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedCareerPaths.map((rp) => (
              <Link
                key={rp.id}
                href={`/career-paths/${rp.slug}`}
                className="group flex items-center gap-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 transition-all hover:border-teal-500/50 hover:-translate-y-0.5 shadow-xs"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/5 dark:bg-white/5 text-2xl border border-black/5 dark:border-white/10">
                  {rp.icon}
                </span>
                <div className="overflow-hidden">
                  <h4 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-teal-400 transition-colors truncate">
                    {isEn ? rp.titleEn : rp.titleAr}
                  </h4>
                  <p className="text-2xs text-neutral-500 truncate mt-0.5 font-medium">
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
