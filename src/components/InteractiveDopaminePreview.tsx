"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "./LanguageContext";
import { FORMATTED_METRICS } from "@/lib/content-metrics";

export default function InteractiveDopaminePreview() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [xp, setXp] = useState(0);

  const sampleQuestion = {
    titleAr: "تحدي الـ 30 ثانية: كيف تجعل الذكاء الاصطناعي يكتب لك خطة تسويقية ناجحة؟",
    titleEn: "30-Second Challenge: How do you get AI to build a high-converting marketing strategy?",
    promptAr: "ما هو أفضل برومبت يحقق لك نتائج دقيقة واحترافية من أول مرة؟",
    promptEn: "Which prompt structure yields the most precise, high-converting output on the first try?",
    options: isEn
      ? [
          { text: "Write me a fast marketing plan for a product.", correct: false, feedback: "Too generic! Produces weak, clichéd output." },
          { text: "Act as a Senior CMO for a SaaS brand. Target: Gen Z. Strategy: Organic TikTok + hook angles with 3 test hooks.", correct: true, feedback: "Perfect! Role + Goal + Audience + Constraints = Elite output." },
          { text: "Give me good social media tips.", correct: false, feedback: "Lacks context and persona." },
        ]
      : [
          { text: "اكتب لي خطة تسويقية سريعة لمنتجي.", correct: false, feedback: "عام جداً! الذكاء الاصطناعي هيعطيك كلام مكرر وبدون فائدة حقيقية." },
          { text: "تصرف كخبير تسويق أول (CMO). الجمهور: شباب 18-25 سنة. المطلوب: استراتيجية تيك توك عضوية بـ 3 أفكار خطافية (Hooks) قابلة للقياس.", correct: true, feedback: "عبقري! حددت الدور + الهدف + الجمهور + القيود = نتيجة احترافية فورية!" },
          { text: "اعطيني نصائح تسويق عامة.", correct: false, feedback: "يفتقر للسياق والنتائج القابلة للتطبيق." },
        ],
  };

  const handleSelect = (idx: number, isCorrect: boolean) => {
    setSelectedOption(idx);
    if (isCorrect && !completed) {
      setCompleted(true);
      setXp(75);
    }
  };

  return (
    <div className="relative mx-auto my-12 max-w-3xl overflow-hidden rounded-3xl border border-teal-500/30 bg-gradient-to-b from-teal-500/10 via-white to-white dark:from-teal-950/40 dark:via-neutral-900 dark:to-neutral-900 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />

      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 px-3 py-1 text-xs font-black text-teal-700 dark:text-teal-300">
          <span className="animate-pulse">⚡</span>
          <span>{isEn ? "Interactive Live Demo" : "تجربة حية تفاعلية من داخل المسارات"}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-900 dark:bg-black text-white px-3 py-1 rounded-full text-xs font-mono font-bold shadow-xs">
          <span>🏆 XP:</span>
          <span className={`transition-all duration-500 ${completed ? "text-emerald-400 scale-125" : "text-neutral-400"}`}>
            +{xp} XP
          </span>
        </div>
      </div>

      <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white mb-2 leading-tight">
        {isEn ? sampleQuestion.titleEn : sampleQuestion.titleAr}
      </h3>
      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-5">
        {isEn ? sampleQuestion.promptEn : sampleQuestion.promptAr}
      </p>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {sampleQuestion.options.map((opt, i) => {
          const isChosen = selectedOption === i;
          const letterStyles = [
            "bg-cyan-500/15 border-cyan-400/50 text-cyan-700 dark:text-cyan-300",
            "bg-emerald-500/15 border-emerald-400/50 text-emerald-700 dark:text-emerald-300",
            "bg-purple-500/15 border-purple-400/50 text-purple-700 dark:text-purple-300",
          ][i] || "bg-teal-500/15 border-teal-400/50 text-teal-300";

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i, opt.correct)}
              className={`w-full text-start p-3.5 sm:p-4 rounded-2xl border-2 text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                isChosen
                  ? opt.correct
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-950 dark:text-white shadow-md ring-2 ring-emerald-500/30 font-bold"
                    : "border-red-400 bg-red-50 dark:bg-red-950/60 text-red-950 dark:text-white"
                  : "border-black/10 dark:border-white/15 bg-white dark:bg-[#111c19] text-neutral-900 dark:text-white hover:border-teal-400/70 hover:shadow-md hover:shadow-teal-500/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black border ${
                  isChosen
                    ? opt.correct
                      ? "bg-emerald-500 text-neutral-950 border-emerald-400"
                      : "bg-red-500 text-white border-red-400"
                    : letterStyles
                }`}>
                  {isChosen ? (opt.correct ? "✓" : "✗") : String.fromCharCode(65 + i)}
                </span>
                <div className="flex-1">
                  <p className="font-bold leading-relaxed">{opt.text}</p>
                  {isChosen && (
                    <p className={`mt-1.5 text-xs font-bold ${opt.correct ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300"}`}>
                      {opt.feedback}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion Celebratory Banner */}
      {completed && (
        <div className="animate-rise rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-black text-sm">{isEn ? "Awesome job! +75 XP earned!" : "رائع جداً! كسبت أول 75 XP بذكاء!"}</p>
              <p className="text-xs text-white/90">
                {isEn ? "That's how easy and engaging everyday learning is on Tawwerni." : "بالظبط كده! خطوة واحدة عملية ممتعة كل يوم تصنع منك محترف حقيقي."}
              </p>
            </div>
          </div>
          <Link
            href="/quiz"
            style={{ backgroundColor: '#ffffff', color: '#042f2e' }}
            className="cta-btn-white shrink-0 rounded-full bg-white text-teal-800 font-black px-5 py-2.5 text-xs shadow-md hover:bg-neutral-100 active:scale-95 transition"
          >
            <span style={{ color: '#042f2e' }}>{isEn ? "Unlock All 100 Tracks →" : "ابدأ أول مسار كامل مجاناً ←"}</span>
          </Link>
        </div>
      )}

      {/* High-Contrast Bottom Mission Count Badge */}
      <div className="mt-4 pt-4 border-t border-teal-500/20 dark:border-white/10 flex items-center justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-300 shadow-sm text-center">
          <span className="text-amber-400 text-base animate-pulse">✨</span>
          <span>
            {isEn
              ? `Over ${FORMATTED_METRICS.lessons} bite-sized practical missions engineered for continuous momentum & real skill growth.`
              : `أكثر من ${FORMATTED_METRICS.lessons} درس ومهمة تطبيقية صُمموا ليعطوك شعور الإنجاز والتقدم من أول دقيقة.`}
          </span>
        </div>
      </div>
    </div>
  );
}
