"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MissionData } from "@/lib/mission-adapter";
import { EvaluationResponse } from "@/lib/mission-evaluator";
import { recordRecentLearningClient } from "@/lib/recent-learning";
import { useI18n } from "./LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { LogoLink } from "./Logo";
import { resolveDomainTheme } from "@/lib/design-system/domain-themes";

type Stage = "objective" | "learn" | "example" | "practice" | "evaluating" | "feedback" | "complete";

function playMissionChime(type: "step" | "pass" | "retry") {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});

    if (type === "step") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "pass") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
        g.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.07);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.35);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + i * 0.07);
        o.stop(ctx.currentTime + i * 0.07 + 0.35);
      });
    } else if (type === "retry") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch {
    /* browser audio autoplay policy */
  }
}

export default function MissionPlayer({
  mission,
  nextDayNumber,
  isAlreadyCompleted,
  previousScore,
}: {
  mission: MissionData;
  nextDayNumber: number | null;
  isAlreadyCompleted?: boolean;
  previousScore?: number;
}) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [stage, setStage] = useState<Stage>("objective");
  const [submissionText, setSubmissionText] = useState("");
  const [learnCardIdx, setLearnCardIdx] = useState(0);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [evalStats, setEvalStats] = useState<{
    totalXp?: number;
    streak?: number;
    newBadges?: { key: string; title: string; icon: string }[];
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const skill = mission.targetSkill;
  const theme = resolveDomainTheme({ trackSlug: mission.slug, title: mission.titleAr });

  useEffect(() => {
    recordRecentLearningClient({
      courseSlug: mission.slug,
      dayNumber: mission.dayNumber,
      courseTitle: mission.titleAr,
      courseTitleEn: mission.titleEn,
      lessonTitle: mission.titleAr,
      lessonTitleEn: mission.titleEn,
    });
  }, [mission]);

  function changeStage(newStage: Stage) {
    playMissionChime("step");
    setStage(newStage);
  }

  async function handleEvaluate() {
    if (!submissionText.trim() || submissionText.trim().length < 15) {
      setError(
        isEn
          ? "Please write a substantive deliverable (at least 15 characters) before evaluation."
          : "يرجى كتابة مخرج عملي واضح (١٥ حرفاً على الأقل) قبل الإرسال للتقييم."
      );
      return;
    }

    setError("");
    setStage("evaluating");
    setSubmitting(true);

    try {
      const res = await fetch("/api/missions/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: mission.slug,
          dayNumber: mission.dayNumber,
          submissionText,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Evaluation failed");
      }

      setEvaluation(data.evaluation);
      setEvalStats({
        totalXp: data.totalXp,
        streak: data.streak,
        newBadges: data.newBadges,
      });

      if (data.evaluation.passed) {
        playMissionChime("pass");
        setStage("complete");
      } else {
        playMissionChime("retry");
        setStage("feedback");
      }
    } catch (err) {
      setError(
        isEn
          ? "Connection glitch during evaluation. Please try again."
          : "حدث خطأ في الاتصال أثناء التقييم. حاول مرة أخرى."
      );
      setStage("practice");
    } finally {
      setSubmitting(false);
    }
  }

  function handleUseTemplate() {
    if (mission.practice.starterTemplate) {
      setSubmissionText(mission.practice.starterTemplate);
    }
  }

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-[#070d0c] text-neutral-100 flex flex-col font-sans transition-colors selection:bg-emerald-500/30 selection:text-white relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] blur-3xl rounded-full transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.palette.primary}26 0%, ${theme.palette.secondary}15 50%, transparent 80%)`,
          }}
        />
      </div>

      {/* Top Mission Cockpit Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070d0c]/85 backdrop-blur-xl px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5 border border-white/5"
            >
              {isEn ? "‹ Exit to Cockpit" : "‹ لوحة التحكم"}
            </Link>
            <Link
              href={`/app/learn/${mission.slug}/${mission.dayNumber}?mode=cards`}
              className="hidden md:inline-flex text-[11px] font-medium text-neutral-400 hover:text-neutral-200 transition-colors py-1 px-2 rounded hover:bg-white/5 border border-white/5"
              title={isEn ? "Switch to Classic Cards" : "عرض البطاقات الكلاسيكي"}
            >
              {isEn ? "🃏 Cards" : "🃏 بطاقات"}
            </Link>
            <LogoLink size={26} href="/app" />
          </div>

          <div className="flex items-center gap-2">
            {isAlreadyCompleted && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <span>✓</span>
                <span>{isEn ? `Completed (${previousScore ?? 90}%)` : `منجزة مسبقاً (${previousScore ?? 90}%)`}</span>
              </span>
            )}

            <span
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors"
              style={{
                backgroundColor: `${theme.palette.primary}20`,
                borderColor: `${theme.palette.primary}4d`,
                color: theme.palette.accent,
              }}
            >
              <span>{skill.icon}</span>
              <span>{isEn ? skill.nameEn : skill.nameAr}</span>
            </span>

            <span className="text-xs font-mono font-black text-amber-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              +{mission.xpReward} XP
            </span>

            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Progressive Stage Stepper */}
      <div className="relative z-20 border-b border-white/5 bg-black/30 py-2.5 px-4 overflow-x-auto">
        <div className="mx-auto max-w-4xl flex items-center justify-center gap-2 sm:gap-4 text-xs font-bold text-neutral-400 whitespace-nowrap">
          {[
            { id: "objective", labelAr: "١. الهدف والمخرج", labelEn: "1. Objective" },
            { id: "learn", labelAr: "٢. الأساس العملي", labelEn: "2. Framework" },
            { id: "example", labelAr: "٣. النموذج الذهبي", labelEn: "3. Benchmark" },
            { id: "practice", labelAr: "٤. التطبيق والتسليم", labelEn: "4. Practice & Submit" },
            { id: "complete", labelAr: "٥. الإتقان والتوثيق", labelEn: "5. Mastery Pass" },
          ].map((st) => {
            const isActive = stage === st.id;
            const isDone =
              (st.id === "objective" && stage !== "objective") ||
              (st.id === "learn" && !["objective", "learn"].includes(stage)) ||
              (st.id === "example" && ["practice", "evaluating", "feedback", "complete"].includes(stage)) ||
              (st.id === "practice" && stage === "complete");

            return (
              <div
                key={st.id}
                style={
                  isActive
                    ? {
                        backgroundColor: `${theme.palette.primary}25`,
                        borderColor: `${theme.palette.primary}66`,
                        color: theme.palette.accent,
                        boxShadow: `0 0 14px ${theme.palette.primary}33`,
                      }
                    : undefined
                }
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-[11px] sm:text-xs ${
                  isActive
                    ? "border font-black"
                    : isDone
                    ? "text-emerald-400/80 bg-white/5 font-semibold"
                    : "text-neutral-500"
                }`}
              >
                <span>{isDone ? "✓" : isActive ? "⚡" : "○"}</span>
                <span>{isEn ? st.labelEn : st.labelAr}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-center">
        {/* ================= STAGE 1: OBJECTIVE ================= */}
        {stage === "objective" && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black mb-3">
                <span>🎯</span>
                <span>{isEn ? `Day ${mission.dayNumber} Mission` : `مهمة اليوم ${mission.dayNumber}`}</span>
                <span>·</span>
                <span>{mission.estimatedMinutes} {isEn ? "Mins" : "دقائق"}</span>
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isEn ? mission.titleEn : mission.titleAr}
              </h1>
            </div>

            {/* The 3 Core Student Questions */}
            <div className="grid grid-cols-1 gap-4 bg-[#0d1614] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl">
              {/* Question 1: What am I trying to accomplish? */}
              <div className="flex items-start gap-3.5">
                <span className="w-10 h-10 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center text-lg shrink-0">
                  🧭
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-teal-300 uppercase tracking-wide">
                    {isEn ? "What are you accomplishing?" : "ما الذي ستحققه في هذه المهمة؟"}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-200 mt-1 leading-relaxed">
                    {isEn ? mission.objective.accomplishEn : mission.objective.accomplishAr}
                  </p>
                </div>
              </div>

              {/* Question 2: What will I produce? */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-white/5">
                <span className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 flex items-center justify-center text-lg shrink-0">
                  🛠️
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide">
                    {isEn ? "What tangible artifact will you produce?" : "ما المخرج العملي الذي ستنتجه بيدك؟"}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-200 mt-1 leading-relaxed font-semibold">
                    {isEn ? mission.objective.produceEn : mission.objective.produceAr}
                  </p>
                </div>
              </div>

              {/* Question 3: How will I know I succeeded? */}
              <div className="flex items-start gap-3.5 pt-4 border-t border-white/5">
                <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center text-lg shrink-0">
                  ⚖️
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wide">
                    {isEn ? "How will you know you succeeded?" : "كيف ستتأكد من نجاحك واكتمال المهمة؟"}
                  </h3>
                  <ul className="text-xs text-neutral-300 mt-1.5 space-y-1">
                    {(isEn ? mission.objective.successCriteriaEn : mission.objective.successCriteriaAr).map(
                      (crit, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{crit}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => changeStage("learn")}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isEn ? "I Understand the Objective → Continue to Framework" : "فهمت الهدف والمخرج المطلوب ➔ استمر للشرح العملي"}</span>
            </button>
          </div>
        )}

        {/* ================= STAGE 2: LEARN ================= */}
        {stage === "learn" && (
          <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-teal-300 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30">
                {isEn ? "Step 2: Practical Framework" : "الخطوة ٢: الأساس العملي المركز"}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {learnCardIdx + 1} / {mission.learnCards.length}
              </span>
            </div>

            {/* Active Card */}
            <div className="rounded-3xl bg-[#0d1614] border-2 border-teal-500/30 p-6 sm:p-8 shadow-2xl relative">
              <h2 className="text-xl sm:text-2xl font-black text-white mb-4 leading-snug">
                {mission.learnCards[learnCardIdx]?.heading}
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-neutral-200 leading-relaxed">
                {mission.learnCards[learnCardIdx]?.lines.map((line, idx) => (
                  <p key={idx} className="flex items-start gap-2.5">
                    <span className="text-teal-400 font-bold shrink-0">•</span>
                    <span>{line}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {learnCardIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setLearnCardIdx((i) => i - 1)}
                  className="px-5 py-3.5 rounded-full border border-white/10 text-xs font-bold text-neutral-300 hover:bg-white/5 transition"
                >
                  {isEn ? "‹ Previous" : "السابق"}
                </button>
              )}

              {learnCardIdx < mission.learnCards.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setLearnCardIdx((i) => i + 1)}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold rounded-full py-4 text-sm transition"
                >
                  {isEn ? "Next Point →" : "النقطة التالية ➔"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => changeStage("example")}
                  className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 transition active:scale-98"
                >
                  {isEn ? "Continue to Golden Benchmark Example →" : "استمر لرؤية النموذج الذهبي المعياري ➔"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= STAGE 3: EXAMPLE ================= */}
        {stage === "example" && (
          <div className="animate-fade-in space-y-6">
            <div className="text-start">
              <span className="text-xs font-black text-amber-300 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/30">
                {isEn ? "Step 3: Golden Benchmark Standard" : "الخطوة ٣: النموذج الذهبي المعياري (100/100)"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
                {isEn ? mission.goldenExample.titleEn : mission.goldenExample.titleAr}
              </h2>
            </div>

            {/* Benchmark display box */}
            <div className="rounded-3xl bg-black/60 border-2 border-amber-400/40 p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-4">
                <span className="text-xs font-bold text-amber-300/90 flex items-center gap-1.5 font-sans">
                  <span>💎</span>
                  <span>{isEn ? "Standard Benchmark Specification" : "مواصفات المخرج المعياري"}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-amber-400 text-neutral-950 px-3 py-1 rounded-full font-sans shrink-0 shadow-xs">
                  ⭐ {isEn ? "Exemplary Benchmark" : "نموذج مثالي"}
                </span>
              </div>
              <div className="font-mono text-xs sm:text-sm leading-relaxed text-amber-100 whitespace-pre-wrap">
                {mission.goldenExample.content}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-neutral-300 leading-relaxed">
              <span className="font-bold text-emerald-400">💡 {isEn ? "Why this passes:" : "لماذا يحقق هذا النموذج الدرجة الكاملة؟"}</span>{" "}
              {isEn ? mission.goldenExample.explanationEn : mission.goldenExample.explanationAr}
            </div>

            <button
              type="button"
              onClick={() => changeStage("practice")}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              {isEn ? "Ready to Produce My Deliverable →" : "جاهز للتطبيق وإنتاج المخرج بنفسي ➔"}
            </button>
          </div>
        )}

        {/* ================= STAGE 4: PRACTICE & SUBMIT ================= */}
        {stage === "practice" && (
          <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-300 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
                {isEn ? "Step 4: Your Production Workspace" : "الخطوة ٤: مساحة التطبيق والإنتاج المباشر"}
              </span>

              {mission.practice.starterTemplate && (
                <button
                  type="button"
                  onClick={handleUseTemplate}
                  className="text-xs font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                >
                  {isEn ? "Use Starter Template" : "استخدم القالب التوجيهي"}
                </button>
              )}
            </div>

            {/* Practice instructions box */}
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-neutral-300 space-y-1.5">
              <p className="font-black text-white text-xs mb-1">
                📋 {isEn ? "Execution Instructions:" : "إرشادات التنفيذ:"}
              </p>
              {(isEn ? mission.practice.instructionsEn : mission.practice.instructionsAr).map((inst, i) => (
                <p key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">›</span>
                  <span>{inst}</span>
                </p>
              ))}
            </div>

            {/* Error banner if any */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs">
                ⚠️ {error}
              </div>
            )}

            {/* Workspace TextArea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black text-white">
                  {isEn ? "Your Deliverable (Artifact Content):" : "مخرجك العملي للتفتيش والتقييم:"}
                </label>
                <span className="text-[11px] font-mono font-bold">
                  {submissionText.trim().length >= 15 ? (
                    <span className="text-emerald-400">✓ {submissionText.trim().length} {isEn ? "chars" : "حرفاً"}</span>
                  ) : (
                    <span className="text-amber-400">{submissionText.trim().length} / 15 {isEn ? "min chars" : "حرفاً كحد أدنى"}</span>
                  )}
                </span>
              </div>
              <textarea
                rows={8}
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleEvaluate();
                  }
                }}
                placeholder={isEn ? mission.practice.placeholderEn : mission.practice.placeholderAr}
                className="w-full rounded-2xl bg-black/60 border-2 border-white/15 p-4 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-emerald-400 focus:outline-hidden transition leading-relaxed font-mono"
              />
              <div className="text-[11px] text-neutral-400 mt-1.5 flex justify-between items-center">
                <span>{isEn ? "Evaluated against: Specificity, Constraints, Workplace Realism" : "المعايير المفحوصة: التحديد، القيود، والقيمة العملية"}</span>
                <span className="hidden sm:inline text-neutral-500 font-mono">({isEn ? "Ctrl+Enter to submit" : "Ctrl+Enter للإرسال السريع"})</span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handleEvaluate}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>🚀</span>
              <span>{isEn ? "Submit for AI Evaluation →" : "إرسال للتفتيش والتقييم الذكي ➔"}</span>
            </button>
          </div>
        )}

        {/* ================= STAGE: EVALUATING SPINNER ================= */}
        {stage === "evaluating" && (
          <div className="animate-fade-in text-center py-16 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <h3 className="text-xl font-black text-white">
              {isEn ? "Evaluating Your Deliverable..." : "جاري فحص مخرجك العملي وتدقيق المعايير..."}
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              {isEn
                ? "Checking against rubrics: context framing, negative constraints, and workplace actionability."
                : "نقوم بقياس دقة التوجيه، الالتزام بالقيود، وجاهزية المخرج للتنفيذ في بيئة العمل الحقيقية."}
            </p>
          </div>
        )}

        {/* ================= STAGE 5: FEEDBACK (NOT YET) ================= */}
        {stage === "feedback" && evaluation && (
          <div className="animate-fade-in space-y-6">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black mb-2">
                <span>⚠️</span>
                <span>{isEn ? "Score: " : "الدرجة المحققة: "} {evaluation.score} / 100</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {isEn ? evaluation.headlineEn : evaluation.headlineAr}
              </h2>
            </div>

            {/* 3 Feedback Cards */}
            <div className="space-y-3.5">
              {/* Card 1: What you did well */}
              <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/30 p-4 text-start">
                <h4 className="text-xs font-black text-emerald-300 flex items-center gap-1.5 mb-1.5">
                  <span>✓</span>
                  <span>{isEn ? "What you did well:" : "ما أحسنت فيه (نقاط القوة):"}</span>
                </h4>
                <ul className="text-xs text-emerald-200/90 space-y-1">
                  {(isEn ? evaluation.wellEn : evaluation.wellAr).map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>

              {/* Card 2: What needs improvement */}
              <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-4 text-start">
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5 mb-1.5">
                  <span>⚙️</span>
                  <span>{isEn ? "What needs improvement:" : "ما يحتاج إلى تطوير (الملاحظات):"}</span>
                </h4>
                <ul className="text-xs text-amber-200/90 space-y-1">
                  {(isEn ? evaluation.improveEn : evaluation.improveAr).map((imp, i) => (
                    <li key={i}>• {imp}</li>
                  ))}
                </ul>
              </div>

              {/* Card 3: Your next move */}
              <div className="rounded-2xl bg-teal-950/30 border border-teal-500/30 p-4 text-start">
                <h4 className="text-xs font-black text-teal-300 flex items-center gap-1.5 mb-1.5">
                  <span>🎯</span>
                  <span>{isEn ? "Your next move:" : "خطوتك القادمة:"}</span>
                </h4>
                <p className="text-xs text-neutral-200">
                  {isEn ? evaluation.nextMoveEn : evaluation.nextMoveAr}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => changeStage("practice")}
              className="w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer"
            >
              {isEn ? "Try Again (Refine Deliverable) 🔄" : "أعد المحاولة وطبّق الملاحظات (TRY AGAIN) 🔄"}
            </button>
          </div>
        )}

        {/* ================= STAGE 6: PASS & COMPLETION ================= */}
        {stage === "complete" && evaluation && (
          <div className="animate-fade-in text-center space-y-6">
            {/* Elegant Golden Milestone Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/60 text-xs sm:text-sm font-black text-emerald-300 shadow-xl shadow-emerald-500/20">
              <span>🏆</span>
              <span>{isEn ? "Verified Mission Complete" : "اكتملت المهمة بنجاح وتوثيق"}</span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {isEn ? evaluation.headlineEn : evaluation.headlineAr}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2">
                {isEn
                  ? "Your demonstrated deliverable meets executive workplace standards."
                  : "مخرجك العملي أثبت الكفاءة وحقق المعايير المهنية المطلوبة بنجاح."}
              </p>
            </div>

            {/* Achievement Badges Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-center">
                <span className="text-xl sm:text-2xl">💎</span>
                <p className="font-mono font-black text-base sm:text-lg text-emerald-400 mt-0.5">
                  +{evaluation.xpEarned} XP
                </p>
                <p className="text-[10px] text-neutral-400 font-bold">{isEn ? "XP Earned" : "نقاط خبرة"}</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-center">
                <span className="text-xl sm:text-2xl">{evaluation.skillIcon}</span>
                <p className="font-black text-xs sm:text-sm text-white mt-0.5 truncate">
                  {isEn ? evaluation.skillNameEn : evaluation.skillNameAr}
                </p>
                <p className="text-[10px] text-teal-300 font-bold">{isEn ? "Skill Unlocked ⭐" : "مهارة موثقة ⭐"}</p>
              </div>

              {evalStats.streak ? (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-center">
                  <span className="text-xl sm:text-2xl">🔥</span>
                  <p className="font-mono font-black text-base sm:text-lg text-amber-400 mt-0.5">
                    {evalStats.streak} {isEn ? "Days" : "أيام"}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-bold">{isEn ? "Current Streak" : "استمرارية حية"}</p>
                </div>
              ) : null}

              {evalStats.totalXp ? (
                <div className="rounded-2xl bg-white/5 border border-white/10 p-3 sm:p-4 text-center">
                  <span className="text-xl sm:text-2xl">⭐</span>
                  <p className="font-mono font-black text-base sm:text-lg text-teal-300 mt-0.5">
                    {evalStats.totalXp}
                  </p>
                  <p className="text-[10px] text-neutral-400 font-bold">{isEn ? "Account Total XP" : "إجمالي النقاط"}</p>
                </div>
              ) : null}
            </div>

            {/* Newly awarded badges notification */}
            {evalStats.newBadges && evalStats.newBadges.length > 0 && (
              <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center animate-fade-in">
                <p className="text-xs font-black text-amber-300 mb-1.5">
                  🎉 {isEn ? "New Badges Unlocked!" : "أوسمة جديدة تم فتحها في حسابك!"}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-1">
                  {evalStats.newBadges.map((b) => (
                    <span
                      key={b.key}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold"
                    >
                      <span>{b.icon}</span>
                      <span>{b.title}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Next actions */}
            <div className="space-y-3 max-w-md mx-auto pt-2">
              {nextDayNumber ? (
                <Link
                  href={`/app/learn/${mission.slug}/${nextDayNumber}`}
                  className="block w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  {isEn ? `Next Mission (Day ${nextDayNumber}) →` : `المهمة التالية (يوم ${nextDayNumber}) ➔`}
                </Link>
              ) : (
                <Link
                  href={`/app/learn/${mission.slug}/certificate`}
                  className="block w-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  {isEn ? "Claim Verified Certificate 🎓" : "استلم شهادتك المعتمدة 🎓"}
                </Link>
              )}

              <Link
                href="/app"
                className="block w-full rounded-full border border-white/15 py-3.5 text-xs sm:text-sm font-bold text-neutral-300 hover:bg-white/5 transition"
              >
                {isEn ? "Return to Cockpit Dashboard" : "العودة للوحة التحكم الرئيسية"}
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
