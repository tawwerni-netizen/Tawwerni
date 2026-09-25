"use client";

import { useState, useEffect } from "react";
import { useI18n } from "./LanguageContext";

type Mood = "excited" | "focused" | "tired" | "down" | null;

export default function MoodCheckIn() {
  const { t, lang } = useI18n();
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem("tawwerni-mood");
      const savedDate = localStorage.getItem("tawwerni-mood-date");
      if (saved && savedDate === todayKey) {
        setSelectedMood(saved as Mood);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function handleSelect(mood: Mood) {
    setSelectedMood(mood);
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      if (mood) {
        localStorage.setItem("tawwerni-mood", mood);
        localStorage.setItem("tawwerni-mood-date", todayKey);
      }
    } catch {
      /* ignore */
    }
  }

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-gradient-to-r from-teal-50 via-white to-emerald-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-teal-950/40 p-4 text-neutral-900 dark:text-white shadow-sm dark:shadow-lg mb-6 backdrop-blur-xs transition-colors">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute top-3 end-3 text-xs text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
        aria-label={lang === "ar" ? "إغلاق" : "Close"}
      >
        ✕
      </button>

      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">✨</span>
        <h4 className="text-sm font-bold text-teal-700 dark:text-teal-300">{t.howAreYouFeeling}</h4>
      </div>

      {/* Mood Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
        <button
          type="button"
          onClick={() => handleSelect("excited")}
          className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
            selectedMood === "excited"
              ? "border-teal-500 bg-teal-500/15 text-teal-800 dark:text-teal-200 font-bold scale-[1.02] shadow-xs"
              : "border-black/10 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/40 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <span>🚀</span>
          <span>{lang === "ar" ? "متحمس وطاقتي عالية" : "Energized"}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect("focused")}
          className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
            selectedMood === "focused"
              ? "border-teal-500 bg-teal-500/15 text-teal-800 dark:text-teal-200 font-bold scale-[1.02] shadow-xs"
              : "border-black/10 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/40 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <span>☕</span>
          <span>{lang === "ar" ? "هادئ ومستعد" : "Calm & Ready"}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect("tired")}
          className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
            selectedMood === "tired"
              ? "border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold scale-[1.02] shadow-xs"
              : "border-black/10 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/40 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <span>🧘‍♂️</span>
          <span>{lang === "ar" ? "مجهد أو مشتت" : "Tired/Distracted"}</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelect("down")}
          className={`flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all ${
            selectedMood === "down"
              ? "border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-200 font-bold scale-[1.02] shadow-xs"
              : "border-black/10 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/40 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          }`}
        >
          <span>💪</span>
          <span>{lang === "ar" ? "محتاج دفعة وتشجيع" : "Need a Boost"}</span>
        </button>
      </div>

      {/* Empathetic tailored advice box */}
      {selectedMood && (
        <div className="mt-3 p-3 rounded-xl bg-white/90 dark:bg-neutral-950/60 border border-teal-500/20 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 shadow-xs animate-fade-in">
          <span className="text-base">💡</span>
          <div>
            <div className="font-semibold text-teal-700 dark:text-teal-400 mb-0.5">
              {lang === "ar" ? "توجيه اليوم المخصص لك:" : "Personalized Guidance:"}
            </div>
            {selectedMood === "excited" && <p>{t.moodAdviceExcited}</p>}
            {selectedMood === "focused" && <p>{t.moodAdviceFocused}</p>}
            {selectedMood === "tired" && <p>{t.moodAdviceTired}</p>}
            {selectedMood === "down" && <p>{t.moodAdviceDown}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
