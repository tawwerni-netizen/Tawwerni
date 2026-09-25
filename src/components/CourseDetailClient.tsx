"use client";

import Link from "next/link";
import { useI18n } from "@/components/LanguageContext";
import { getTrackArtwork } from "@/content/track-artworks";
import type { UniversalCourse } from "@/lib/course-loader";
import { pricing, payment } from "@/content/brand";

type Props = {
  course: UniversalCourse;
  isLoggedIn: boolean;
  unlocked: boolean;
  pendingOrder: boolean;
  doneIds: string[];
  relatedArticles: {
    slug: string;
    pillar: string;
    title: string;
    excerpt: string;
    icon: string;
    readingMinutes: number;
  }[];
};

export default function CourseDetailClient({
  course,
  isLoggedIn,
  unlocked,
  pendingOrder,
  doneIds = [],
  relatedArticles = [],
}: Props) {
  const { lang, t } = useI18n();
  const isEn = lang === "en";

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const doneSet = new Set(doneIds);
  const doneCount = allLessons.filter((l) => doneSet.has(l.id)).length;
  const nextLesson = allLessons.find((l) => !doneSet.has(l.id)) ?? allLessons[0];
  const FREE_PREVIEW_DAY = 1;
  const canOpen = (dayNumber: number) => unlocked || dayNumber === FREE_PREVIEW_DAY;

  const title = isEn ? course.titleEn : course.titleAr;
  const description = isEn ? course.descriptionEn : course.descriptionAr;
  const level = isEn ? course.levelEn : course.levelAr;
  const artwork = getTrackArtwork(course.slug);

  return (
    <div className="pb-12 text-neutral-900 dark:text-white" dir={isEn ? "ltr" : "rtl"}>
      {/* Course Hero Banner */}
      <div
        className="relative overflow-hidden px-4 sm:px-6 pt-8 pb-8 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${course.accentFrom || "#0f766e"}, ${course.accentTo || "#042f2e"})`,
        }}
      >
        {artwork && (
          <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-30">
            <img
              src={artwork.image}
              alt={isEn ? artwork.altEn : artwork.altAr}
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
          </div>
        )}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/20 blur-2xl" />

        <div className="mx-auto max-w-4xl relative z-10">
          <Link
            href="/app/learn"
            className="tap inline-flex items-center gap-1 py-1 text-xs text-white/80 hover:text-white transition-colors"
          >
            <span>{isEn ? "← Back to Catalog" : "← العودة للكتالوج"}</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-3">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md text-3xl sm:text-4xl shadow-md border border-white/20">
                {course.icon}
              </div>
              <div>
                <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold backdrop-blur-xs mb-1">
                  {isEn ? course.categoryEn : course.categoryAr} · #{String(course.order).padStart(2, "0")}
                </span>
                <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="rounded-xl bg-white/15 border border-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-xs">
                {level}
              </span>
            </div>
          </div>

          <p className="text-sm text-white/90 mt-3 max-w-2xl leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 mt-5 text-xs">
            <span className="bg-white/15 border border-white/10 rounded-full px-3.5 py-1 font-semibold">
              📅 {allLessons.length} {isEn ? "Days" : "يوم"}
            </span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3.5 py-1 font-semibold">
              📚 {course.modules.length} {isEn ? "Modules" : "وحدات"}
            </span>
            <span className="bg-white/15 border border-white/10 rounded-full px-3.5 py-1 font-semibold">
              ⚡ {course.totalXp} XP
            </span>
          </div>

          {/* Primary Action Button */}
          <div className="mt-6 max-w-md">
            {!isLoggedIn ? (
              <Link
                href="/login?signup=1"
                className="btn-ghost-shine cta-btn-white block text-center font-bold rounded-full py-3 text-sm shadow-xl active:scale-98 transition-all"
              >
                {isEn ? "Start Day 1 Free Now →" : "جرّب اليوم الأول مجانًا الآن ←"}
              </Link>
            ) : unlocked && doneCount >= allLessons.length ? (
              <Link
                href={`/app/learn/${course.slug}/certificate`}
                className="btn-ghost-shine cta-btn-white block rounded-full py-3 text-center text-sm font-bold shadow-xl transition-all"
              >
                {isEn ? "🎓 View Your Official Certificate" : "🎓 استلم شهادتك المعتمدة"}
              </Link>
            ) : unlocked ? (
              <Link
                href={`/app/learn/${course.slug}/${nextLesson.dayNumber}`}
                className="btn-ghost-shine cta-btn-white block text-center font-bold rounded-full py-3 text-sm shadow-xl active:scale-98 transition-all"
              >
                {doneCount === 0
                  ? (isEn ? "Start Day 1 Now →" : "ابدأ يوم ١ الآن ←")
                  : (isEn ? `Continue · Day ${nextLesson.dayNumber} →` : `كمّل · يوم ${nextLesson.dayNumber} ←`)}
              </Link>
            ) : (
              <Link
                href={`/app/learn/${course.slug}/${FREE_PREVIEW_DAY}`}
                className="btn-ghost-shine cta-btn-white block text-center font-bold rounded-full py-3 text-sm shadow-xl active:scale-98 transition-all"
              >
                {isEn ? "Start Day 1 Free Preview →" : "جرّب اليوم الأول مجانًا ←"}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-6">
        {/* Access Status Banner */}
        {!unlocked && isLoggedIn && (
          pendingOrder ? (
            <div className="rounded-2xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-4 mb-6">
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
                ⏳ {isEn ? "Your Payment Is Under Verification" : "طلبك تحت المراجعة"}
              </p>
              <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300/80">
                {isEn
                  ? `Once payment proof is received, all 100 tracks are unlocked within ${payment.activationHours} hours. Reach us on WhatsApp at `
                  : `لو أرسلت إثبات التحويل، هنفعّل الـ 100 مسار خلال ${payment.activationHours} ساعة. للاستفسار عبر واتساب `}
                <b dir="ltr">{payment.supportWhatsapp}</b>.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-r from-teal-600 to-emerald-600 p-5 mb-6 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-base font-bold mb-1">
                    🔓 {isEn ? "Unlock All 100 Tracks (1-Year Access)" : "افتح جميع الـ 100 مسار لمدة سنة"}
                  </p>
                  <p className="text-xs text-white/90 max-w-xl leading-relaxed">
                    {isEn
                      ? `Day 1 is 100% free. A single one-time payment of ${pricing.priceEgp} EGP unlocks all ${allLessons.length} days in this track, plus ALL other 99 professional tracks for a full year.`
                      : `اليوم الأول مجاني. اشتراك واحد بقيمة ${pricing.priceEgp} ج.م يفتحلك باقي الـ ${allLessons.length - 1} يوم هنا وجميع الـ 100 مسار التانية بالكامل لمدة سنة.`}
                  </p>
                </div>
                <Link
                  href="/quiz/checkout"
                  className="btn-ghost-shine shrink-0 rounded-full bg-white px-6 py-2.5 text-center text-xs font-bold text-teal-800 shadow-md hover:bg-neutral-50 active:scale-95 transition-all"
                >
                  {isEn ? "Subscribe Now →" : "اشترك الآن ←"}
                </Link>
              </div>
            </div>
          )
        )}

        {/* 3D Concept Artwork Spotlight Banner */}
        {artwork && (
          <div className="relative mb-6 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 shadow-xl group">
            <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden bg-neutral-900">
              <img
                src={artwork.image}
                alt={isEn ? artwork.altEn : artwork.altAr}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 flex items-end justify-between gap-3">
                <div className="min-w-0 pr-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20 mb-1.5">
                    <span
                      className="h-2 w-2 rounded-full animate-pulse"
                      style={{ backgroundColor: course.accentFrom || "#10b981" }}
                    />
                    <span>✨ {isEn ? artwork.badgeEn : artwork.badgeAr}</span>
                  </span>
                  <p className="text-sm sm:text-base font-bold text-white drop-shadow-md truncate">
                    {isEn ? artwork.altEn : artwork.altAr}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-mono font-bold bg-white/15 backdrop-blur-md text-white/90 border border-white/20 px-3 py-1 rounded-full shadow-md">
                  3D Concept Art
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Highlights Grid */}
        <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 p-5 mb-6 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            {isEn ? "What This Track Includes" : "الكورس يشمل"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700 dark:text-neutral-300">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
              <span className="text-lg">🧠</span>
              <span>
                {isEn
                  ? `${course.modules.length} structured modules from basics to revenue`
                  : `${course.modules.length} وحدات مهارية من الأساسيات للربح`}
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
              <span className="text-lg">🎯</span>
              <span>{isEn ? "1 actionable 5-minute hands-on task daily" : "مهمة عملية واحدة ٥ دقائق كل يوم"}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
              <span className="text-lg">📝</span>
              <span>{isEn ? "Interactive quizzes with detailed explanations" : "كويزات تفاعلية بشرح كامل بعد كل درس"}</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
              <span className="text-lg">🎓</span>
              <span>{isEn ? "Official verified completion certificate" : "شهادة إتمام معتمدة عند إنهاء المسار"}</span>
            </div>
          </div>
        </div>

        {/* Learning Outcomes */}
        {((isEn ? course.outcomesEn : course.outcomesAr) || []).length > 0 && (
          <div className="rounded-3xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 p-5 mb-6 shadow-xs">
            <h3 className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-3">
              {t.whatYouWillLearn}
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(isEn ? course.outcomesEn : course.outcomesAr).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                  <span className="text-teal-600 dark:text-teal-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reality Check Note */}
        {(course.realityAr || course.realityEn) && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-950/20 p-4 mb-6 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200/90">
            <span className="text-lg shrink-0">⚠️</span>
            <div>
              <p className="font-bold mb-0.5">{t.honestReality}:</p>
              <p className="leading-relaxed">{isEn ? course.realityEn : course.realityAr}</p>
            </div>
          </div>
        )}

        {/* Curriculum Outline */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
              {isEn ? `Curriculum Outline · ${allLessons.length} Lessons` : `منهج المسار · ${allLessons.length} درس`}
            </h2>
            <span className="text-xs text-neutral-400 font-mono">
              {doneCount}/{allLessons.length} {isEn ? "Completed" : "مكتمل"}
            </span>
          </div>

          <div className="space-y-4">
            {course.modules.map((module) => {
              const modDone = module.lessons.filter((l) => doneSet.has(l.id)).length;
              const modTitle = isEn ? module.titleEn : module.titleAr;
              const modDesc = isEn ? module.descriptionEn : module.descriptionAr;

              return (
                <div
                  key={module.id}
                  className="rounded-3xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 overflow-hidden shadow-xs transition-colors"
                >
                  {/* Module Header */}
                  <div className="p-4 border-b border-black/5 dark:border-neutral-800/80 flex items-center justify-between gap-3 bg-neutral-50/60 dark:bg-neutral-800/40">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{module.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-neutral-900 dark:text-white">{modTitle}</p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{modDesc}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-neutral-400 shrink-0">
                      {modDone}/{module.lessons.length}
                    </span>
                  </div>

                  {/* Module Lessons List */}
                  <div className="divide-y divide-black/5 dark:divide-neutral-800">
                    {module.lessons.map((lesson) => {
                      const done = doneSet.has(lesson.id);
                      const open = canOpen(lesson.dayNumber);
                      const lessonTitle = isEn ? lesson.titleEn : lesson.titleAr;

                      const inner = (
                        <div className="flex items-center justify-between gap-3 w-full">
                          <div className="flex items-center gap-3 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                                done
                                  ? "bg-teal-600 text-white"
                                  : open
                                  ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20"
                                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                              }`}
                            >
                              {done ? "✓" : open ? lesson.dayNumber : "🔒"}
                            </span>
                            <p className={`text-sm truncate font-medium ${done ? "text-neutral-500 line-through" : "text-neutral-800 dark:text-neutral-200"}`}>
                              {lesson.isCheckpoint ? "🏁 " : ""}
                              {lessonTitle}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 text-[11px]">
                            {lesson.dayNumber === FREE_PREVIEW_DAY && !unlocked && (
                              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 font-bold">
                                {isEn ? "FREE" : "مجاني"}
                              </span>
                            )}
                            <span className="text-neutral-400 font-mono">
                              {open ? `${lesson.durationMin} ${isEn ? "min" : "د"}` : (isEn ? "Locked" : "مقفول")}
                            </span>
                          </div>
                        </div>
                      );

                      return open ? (
                        <Link
                          key={lesson.id}
                          href={`/app/learn/${course.slug}/${lesson.dayNumber}`}
                          className="flex items-center px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                        >
                          {inner}
                        </Link>
                      ) : (
                        <div
                          key={lesson.id}
                          className="flex items-center px-4 py-3 opacity-60 bg-neutral-50/30 dark:bg-neutral-900/40"
                          aria-disabled="true"
                        >
                          {inner}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Hub Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">
              {isEn ? "Enrichment Articles & Guides" : "مقالات تساعدك أكثر"}
            </p>
            <div className="space-y-2">
              {relatedArticles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/hub/${a.pillar}/${a.slug}`}
                  className="flex items-center gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 p-3.5 hover:border-teal-500/40 transition-colors shadow-xs"
                >
                  <span className="text-xl shrink-0">{a.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{a.title}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">{a.excerpt}</p>
                  </div>
                  <span className="text-xs text-neutral-400 shrink-0 font-mono">{a.readingMinutes} {isEn ? "min" : "د"}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
