"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PACE_OPTIONS = [
  { value: 5, icon: "🌱", label: "٥ دقايق/يوم", sub: "بداية سهلة" },
  { value: 15, icon: "🚀", label: "١٥ دقيقة/يوم", sub: "الأنسب", popular: true },
  { value: 30, icon: "🔥", label: "٣٠ دقيقة/يوم", sub: "مسار سريع" },
];

/**
 * Goal → the course that actually answers it, and the taxonomy value the
 * rest of the app (profile, quiz lead capture) already stores preference in.
 *
 * Someone who signs up straight from "جرّب اليوم الأول مجانًا" on the
 * homepage skips the quiz entirely — no goal, no recommendation, nothing.
 * They used to land on a flat 9-course catalogue with no steer at all. This
 * is the one question that fixes that for the free-signup path specifically.
 */
const GOAL_OPTIONS = [
  { value: "business", icon: "💰", label: "أزوّد دخلي", slug: "bina-el-amal" },
  { value: "career", icon: "💼", label: "أطوّر شغلي الحالي", slug: "nomo-mehany" },
  { value: "ai-tech", icon: "🤖", label: "أتعلّم الذكاء الاصطناعي", slug: "tahaddi-28-yawm" },
  { value: "ai-tech", icon: "🚀", label: "أبني مشروع أو منصة", slug: "ebni-mansetak" },
  { value: "success-mindset", icon: "🧠", label: "أطوّر نفسي وعاداتي", slug: "namat-el-nagah" },
] as const;

export default function OnboardingForm({ suggestedPace }: { suggestedPace: number }) {
  const router = useRouter();
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
    <div className="min-h-screen flex flex-col justify-center px-6 bg-neutral-50">
      <div className="w-full max-w-sm mx-auto">
        <div className="rounded-2xl bg-gradient-to-l from-brand-800 to-brand-600 text-white p-5 mb-5">
          <p className="text-2xl mb-1">🎉</p>
          <h1 className="text-lg font-bold mb-1">أهلًا بيك!</h1>
          <p className="text-sm text-brand-100">
            {step === 0 ? "سؤالين سريعين وخطتك جاهزة." : "خطوة واحدة وتدخل."}
          </p>
        </div>

        {step === 0 ? (
          <>
            <p className="text-sm font-bold mb-1">إيه هدفك دلوقتي؟</p>
            <p className="text-xs text-neutral-400 mb-4">هنقولّك تبدأ منين بالظبط</p>

            <div className="space-y-2">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => pickGoal(opt)}
                  className="w-full flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 text-right transition hover:border-brand-400"
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="flex-1 text-sm font-bold">{opt.label}</span>
                  <span className="text-neutral-300">←</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {goal && (
              <div className="mb-4 rounded-xl bg-brand-50 p-3 text-center">
                <p className="text-xs text-brand-800">
                  مسارك المقترح: <b>{goal.icon} {GOAL_LABELS_FOR_SLUG[goal.slug]}</b>
                </p>
              </div>
            )}

            <p className="text-sm font-bold mb-1">قد إيه تقدر تلتزم بيه يوميًا؟</p>
            <p className="text-xs text-neutral-400 mb-4">تقدر تغيّره في أي وقت من الإعدادات</p>

            <div className="space-y-2 mb-6">
              {PACE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPace(opt.value)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-3 text-right ${
                    pace === opt.value ? "border-brand-600 bg-brand-50" : "border-black/10 bg-white"
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{opt.label}</span>
                      {opt.popular && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                          الأكثر شيوعًا
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400">{opt.sub}</p>
                  </div>
                  <span
                    className={`w-5 h-5 rounded-full border-2 shrink-0 ${
                      pace === opt.value ? "border-brand-600 bg-brand-600" : "border-black/20"
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
              {loading ? "..." : "ابدأ درسي الأول ←"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const GOAL_LABELS_FOR_SLUG: Record<string, string> = {
  "bina-el-amal": "بناء الأعمال",
  "nomo-mehany": "النمو المهني",
  "tahaddi-28-yawm": "تحدي الذكاء الاصطناعي",
  "ebni-mansetak": "ابنِ منصتك",
  "namat-el-nagah": "نمط النجاح",
};
