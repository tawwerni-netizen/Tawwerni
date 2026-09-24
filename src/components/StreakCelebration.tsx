"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./LanguageContext";

type Props = {
  streak: number;
  xpEarned?: number;
  onDismiss?: () => void;
};

export default function StreakCelebration({ streak, xpEarned = 50, onDismiss }: Props) {
  const { t, lang } = useI18n();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);

  useEffect(() => {
    // Generate celebratory confetti particles
    const colors = ["#10b981", "#14b8a6", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"];
    const items = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl border border-teal-500/30 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-6 text-center text-white shadow-2xl overflow-hidden">
        {/* Confetti simulation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full animate-ping opacity-60"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: p.color,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${1.5 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        {/* Big Badge Icon */}
        <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-teal-500/20 animate-bounce">
          🔥
        </div>

        <h3 className="text-2xl font-black text-white mb-1">
          {t.congratulations}
        </h3>
        <p className="text-sm text-neutral-400 mb-4">
          {t.lessonCompleted}
        </p>

        {/* Reward cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl border border-teal-500/20 bg-teal-950/40 p-3">
            <span className="text-xs text-teal-400 font-bold block mb-1">
              ⚡ {t.xpEarned}
            </span>
            <span className="text-2xl font-black text-teal-200 font-mono">
              +{xpEarned}
            </span>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-950/40 p-3">
            <span className="text-xs text-amber-400 font-bold block mb-1">
              🔥 {t.streakDays}
            </span>
            <span className="text-2xl font-black text-amber-200 font-mono">
              {streak}
            </span>
          </div>
        </div>

        {/* Streak Protection Reassurance (Loss Aversion) */}
        <div className="flex items-center justify-center gap-2 text-xs text-teal-300/90 bg-teal-950/60 rounded-xl py-2 px-3 mb-6 border border-teal-800/40">
          <span>🛡️</span>
          <span>{t.streakFreeze}</span>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="w-full py-3 rounded-full font-bold text-sm bg-gradient-to-r from-teal-500 to-emerald-400 text-neutral-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-teal-500/25"
        >
          {t.continueLearning}
        </button>
      </div>
    </div>
  );
}
