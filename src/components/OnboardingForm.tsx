"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/LanguageContext";

const PACE_OPTIONS = [
  { value: 5, icon: "🌱", labelAr: "٥ دقايق/يوم", labelEn: "5 mins/day", subAr: "بداية سهلة", subEn: "Easy start" },
  { value: 15, icon: "🚀", labelAr: "١٥ دقيقة/يوم", labelEn: "15 mins/day", subAr: "الأنسب", subEn: "Recommended", popular: true },
  { value: 30, icon: "🔥", labelAr: "٣٠ دقيقة/يوم", labelEn: "30 mins/day", subAr: "مسار سريع", subEn: "Fast track" },
];

const GOAL_OPTIONS = [
  { value: "business", icon: "💰", labelAr: "أزوّد دخلي", labelEn: "Increase my income", slug: "bina-el-amal" },
  { value: "career", icon: "💼", labelAr: "أطوّر شغلي الحالي", labelEn: "Advance my current career", slug: "nomo-mehany" },
  { value: "ai-tech", icon: "🤖", labelAr: "أتعلّم الذكاء الاصطناعي", labelEn: "Learn Artificial Intelligence", slug: "tahaddi-28-yawm" },
  { value: "ai-tech", icon: "🚀", labelAr: "أبني مشروع أو منصة", labelEn: "Build a project or platform", slug: "ebni-mansetak" },
  { value: "success-mindset", icon: "🧠", labelAr: "أطوّر نفسي وعاداتي", labelEn: "Improve myself & habits", slug: "namat-el-nagah" },
] as const;

const GOAL_LABELS_FOR_SLUG: Record<string, { ar: string; en: string }> = {
  "bina-el-amal": { ar: "بناء الأعمال", en: "Business Building" },
  "nomo-mehany": { ar: "النمو المهني", en: "Career Growth" },
  "tahaddi-28-yawm": { ar: "تحدي الذكاء الاصطناعي", en: "AI Challenge" },
  "ebni-mansetak": { ar: "ابنِ منصتك", en: "Build Your Platform" },
  "namat-el-nagah": { ar: "نمط النجاح", en: "Success Mindset" },
};

export default function OnboardingForm({ suggestedPace }: { suggestedPace: number }) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [step, setStep] = useState<0 | 1>(0);
  const [goal, setGoal] = useState<(typeof GOAL_OPTIONS)[number] | null>(null);
  const [pace, setPace] = useState(suggestedPace);
  const [loading, setLoading] = useState(false);

  function pickGoal(g: (typeof GOAL_OPTIONS)[number]) {
    setGoal(g);
    setStep(1);
  }

  async function start() {
    setLoading(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dailyPaceMinutes: pace,
        ...(goal ? { focusCategory: goal.value } : {}),
      }),
    });
    router.push(goal ? `/app/learn/${goal.slug}` : "/app");
    router.refresh();
  }

  return (
    <div dir={isEn ? "ltr" : "rtl"} className="min-h-screen flex flex-col justify-center px-6 py-12 bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <div className="w-full max-w-sm mx-auto">
        {/* Gamified Setup Stepper */}
        <div className="mb-6 relative flex items-center justify-between px-2">
          <div className="absolute top-4 start-4 end-4 -translate-y-1/2 h-1 bg-black/10 dark:bg-white/10 rounded-full z-0 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: step === 0 ? "25%" : "75%" }}
            />
          </div>

          {[
            { id: 0, icon: "🎯", labelAr: "الهدف والمسار", labelEn: "Goal" },
            { id: 1, icon: "⚡", labelAr: "الوتيرة اليومية", labelEn: "Pace" },
            { id: 2, icon: "🚀", labelAr: "انطلاق الخطة", labelEn: "Launch" },
          ].map((st) => {
            const isDone = step > st.id;
            const isCurrent = step === st.id;
            return (
              <div key={st.id} className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black transition-all shadow-sm ${
                    isDone
                      ? "bg-emerald-500 text-white shadow-emerald-500/25 border-2 border-emerald-400"
                      : isCurrent
                      ? "bg-neutral-950 text-teal-300 ring-4 ring-teal-400/40 border-2 border-teal-300 animate-node-pulse scale-105"
                      : "bg-white dark:bg-neutral-900 text-neutral-400 border border-black/10 dark:border-white/10"
                  }`}
                >
                  <span>{isDone ? "✓" : st.icon}</span>
                </div>
                <span className={`text-3xs font-extrabold ${isCurrent ? "text-teal-700 dark:text-teal-300" : isDone ? "text-emerald-600 dark:text-emerald-400" : "text-neutral-400"}`}>
                  {isEn ? st.labelEn : st.labelAr}
                </span>
              </div>
            );
          })}
        </div>

        {/* Welcome Header */}
        <div className="rounded-3xl bg-gradient-to-br from-teal-900 via-[#0c241e] to-[#081512] text-white p-5 mb-5 shadow-lg border border-teal-400/30">
          <p className="text-2xl mb-1">🎉</p>
          <h1 className="text-lg font-black mb-1">{isEn ? "Welcome!" : "أهلًا بيك في طوّرني!"}</h1>
          <p className="text-xs text-neutral-300 leading-relaxed font-medium">
            {step === 0
              ? (isEn ? "Two quick calibration questions and your personalized learning plan is ready." : "سؤالين سريعين ونظام المعايرة هيجهز خطتك التدريبية المخصصة.")
              : (isEn ? "One step away from your first interactive mission." : "خطوة واحدة أخيرة وتنطلق في مهمتك التطبيقية الأولى.")}
          </p>
        </div>

        {step === 0 ? (
          <>
            <p className="text-sm font-black mb-1 text-neutral-900 dark:text-white">
              {isEn ? "What is your main goal right now?" : "إيه هدفك المهني دلوقتي؟"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 font-medium">
              {isEn ? "We'll build your roadmap from day one" : "هنحددلك خارطة الطريق والمسار الأنسب ليك"}
            </p>

            <div className="space-y-2.5">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.slug}
                  onClick={() => pickGoal(opt)}
                  className="w-full flex items-center gap-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-3.5 text-start transition-all hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5 group cursor-pointer"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xl border border-black/5 dark:border-white/5 group-hover:scale-105 transition-transform">
                    {opt.icon}
                  </span>
                  <span className="flex-1 text-sm font-extrabold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {isEn ? opt.labelEn : opt.labelAr}
                  </span>
                  <span className="text-neutral-400 font-bold group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all">
                    {isEn ? "→" : "←"}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isEn ? "← Change Goal" : "→ تعديل الهدف"}</span>
              </button>
              {goal && (
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <span>{goal.icon}</span>
                  <span>{isEn ? (GOAL_LABELS_FOR_SLUG[goal.slug]?.en ?? goal.labelEn) : (GOAL_LABELS_FOR_SLUG[goal.slug]?.ar ?? goal.labelAr)}</span>
                </span>
              )}
            </div>

            <p className="text-sm font-black mb-1 text-neutral-900 dark:text-white">
              {isEn ? "How much time can you commit daily?" : "قد إيه تقدر تلتزم بيه يوميًا؟"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 font-medium">
              {isEn ? "Consistency beats intensity. You can adjust this anytime." : "الاستمرارية أهم من الكثافة. تقدر تعدلها في أي وقت من الإعدادات."}
            </p>

            <div className="space-y-2.5 mb-6">
              {PACE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPace(opt.value)}
                  className={`w-full flex items-center gap-3.5 rounded-2xl border p-3.5 text-start transition-all cursor-pointer ${
                    pace === opt.value
                      ? "border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-500/30 shadow-md -translate-y-0.5"
                      : "border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-teal-500/40 hover:shadow-xs"
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xl border border-black/5 dark:border-white/5">
                    {opt.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-neutral-900 dark:text-white">
                        {isEn ? opt.labelEn : opt.labelAr}
                      </span>
                      {opt.popular && (
                        <span className="text-3xs bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 rounded-full px-2 py-0.5 font-bold">
                          {isEn ? "Recommended" : "الأنسب للتعلم"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{isEn ? opt.subEn : opt.subAr}</p>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      pace === opt.value ? "border-teal-500 bg-teal-500 text-white text-3xs font-black shadow-xs" : "border-black/20 dark:border-white/20"
                    }`}
                  >
                    {pace === opt.value ? "✓" : ""}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={start}
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-white font-black rounded-2xl py-3.5 text-sm shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-60 cursor-pointer text-center"
            >
              {loading ? "..." : (isEn ? "Start My First Mission 🚀" : "انطلق في مهمتك التطبيقية الأولى 🚀")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
