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
    <div dir={isEn ? "ltr" : "rtl"} className="min-h-screen flex flex-col justify-center px-6 bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <div className="w-full max-w-sm mx-auto">
        <div className="rounded-2xl bg-gradient-to-l from-brand-800 to-brand-600 text-white p-5 mb-5 shadow-sm">
          <p className="text-2xl mb-1">🎉</p>
          <h1 className="text-lg font-bold mb-1">{isEn ? "Welcome!" : "أهلًا بيك!"}</h1>
          <p className="text-sm text-brand-100">
            {step === 0
              ? (isEn ? "Two quick questions and your plan is ready." : "سؤالين سريعين وخطتك جاهزة.")
              : (isEn ? "One step away from your first lesson." : "خطوة واحدة وتدخل.")}
          </p>
        </div>

        {step === 0 ? (
          <>
            <p className="text-sm font-bold mb-1 text-neutral-900 dark:text-white">
              {isEn ? "What is your main goal right now?" : "إيه هدفك دلوقتي؟"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              {isEn ? "We'll show you exactly where to start" : "هنقولّك تبدأ منين بالظبط"}
            </p>

            <div className="space-y-2">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.slug}
                  onClick={() => pickGoal(opt)}
                  className="w-full flex items-center gap-3 rounded-xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-start transition hover:border-brand-400"
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="flex-1 text-sm font-bold text-neutral-900 dark:text-white">
                    {isEn ? opt.labelEn : opt.labelAr}
                  </span>
                  <span className="text-neutral-400">{isEn ? "→" : "←"}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {goal && (
              <div className="mb-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 p-3 text-center">
                <p className="text-xs text-brand-800 dark:text-brand-300">
                  {isEn ? "Suggested Path: " : "مسارك المقترح: "}
                  <b>{goal.icon} {isEn ? (GOAL_LABELS_FOR_SLUG[goal.slug]?.en ?? goal.labelEn) : (GOAL_LABELS_FOR_SLUG[goal.slug]?.ar ?? goal.labelAr)}</b>
                </p>
              </div>
            )}

            <p className="text-sm font-bold mb-1 text-neutral-900 dark:text-white">
              {isEn ? "How much time can you commit daily?" : "قد إيه تقدر تلتزم بيه يوميًا؟"}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
              {isEn ? "You can change this anytime in settings" : "تقدر تغيّره في أي وقت من الإعدادات"}
            </p>

            <div className="space-y-2 mb-6">
              {PACE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPace(opt.value)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-start transition ${
                    pace === opt.value
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950/40"
                      : "border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900 dark:text-white">
                        {isEn ? opt.labelEn : opt.labelAr}
                      </span>
                      {opt.popular && (
                        <span className="text-[10px] bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full px-2 py-0.5 font-bold">
                          {isEn ? "Recommended" : "الأكثر شيوعًا"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400">{isEn ? opt.subEn : opt.subAr}</p>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                      pace === opt.value ? "border-brand-600 bg-brand-600" : "border-black/20 dark:border-neutral-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={start}
              disabled={loading}
              className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm disabled:opacity-60"
            >
              {loading ? "..." : (isEn ? "Start My First Lesson →" : "ابدأ درسي الأول ←")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
