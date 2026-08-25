"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: 5, icon: "🌱", label: "٥ دقايق/يوم", sub: "بداية سهلة" },
  { value: 15, icon: "🚀", label: "١٥ دقيقة/يوم", sub: "الأنسب", popular: true },
  { value: 30, icon: "🔥", label: "٣٠ دقيقة/يوم", sub: "مسار سريع" },
];

export default function OnboardingForm({ suggestedPace }: { suggestedPace: number }) {
  const router = useRouter();
  const [pace, setPace] = useState(suggestedPace);
  const [loading, setLoading] = useState(false);

  async function start() {
    setLoading(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dailyPaceMinutes: pace }),
    });
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-neutral-50">
      <div className="w-full max-w-sm mx-auto">
        <div className="rounded-2xl bg-gradient-to-l from-brand-800 to-brand-600 text-white p-5 mb-5">
          <p className="text-2xl mb-1">🎉</p>
          <h1 className="text-lg font-bold mb-1">أهلًا بيك!</h1>
          <p className="text-sm text-brand-100">خطتك جاهزة. اختيار واحد سريع وتدخل.</p>
        </div>

        <p className="text-sm font-bold mb-1">قد إيه تقدر تلتزم بيه يوميًا؟</p>
        <p className="text-xs text-neutral-400 mb-4">تقدر تغيّره في أي وقت من الإعدادات</p>

        <div className="space-y-2 mb-6">
          {OPTIONS.map((opt) => (
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
      </div>
    </div>
  );
}
