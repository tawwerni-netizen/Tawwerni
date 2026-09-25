"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./LanguageContext";

const STORE_KEY = "tawwerni-reminder";
const HOUR_KEY = "tawwerni-reminder-hour";

/**
 * Daily reminder to come back and do the lesson.
 */
export default function ReminderPrompt({ hasCompletions }: { hasCompletions: boolean }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [show, setShow] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(20);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORE_KEY);
      const h = localStorage.getItem(HOUR_KEY);
      if (h) setHour(Number(h));
    } catch {
      return;
    }

    if (stored === "on" && Notification.permission === "granted") {
      setEnabled(true);
      return;
    }
    if (stored === "off" || Notification.permission === "denied") return;
    if (!hasCompletions) return;

    setShow(true);
  }, [hasCompletions]);

  useEffect(() => {
    if (!enabled) return;

    function msUntilNext() {
      const now = new Date();
      const target = new Date(now);
      target.setHours(hour, 0, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      return target.getTime() - now.getTime();
    }

    const timer = setTimeout(() => {
      try {
        new Notification(
          isEn ? "Today's lesson is waiting 📚" : "درس النهاردة مستنيك 📚",
          {
            body: isEn
              ? "Just 5 minutes — keep your learning streak alive."
              : "٥ دقايق بس — وتحافظ على سلسلتك.",
            icon: "/icon.svg",
            tag: "tawwerni-daily",
          }
        );
      } catch {
        /* ignore */
      }
    }, msUntilNext());

    return () => clearTimeout(timer);
  }, [enabled, hour, isEn]);

  async function allow() {
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        localStorage.setItem(STORE_KEY, "on");
        localStorage.setItem(HOUR_KEY, String(hour));
        setEnabled(true);
        new Notification(isEn ? "All Set ✓" : "تمام ✓", {
          body: isEn
            ? `We'll remind you every day at ${hour}:00.`
            : `هنفكّرك كل يوم الساعة ${hour}:٠٠.`,
          icon: "/icon.svg",
        });
      } else {
        localStorage.setItem(STORE_KEY, "off");
      }
    } catch {
      /* ignore */
    } finally {
      setShow(false);
    }
  }

  function dismiss() {
    try {
      localStorage.setItem(STORE_KEY, "off");
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="reminder-card animate-rise mb-5">
      <div className="mb-3 flex items-start gap-3">
        <span className="reminder-icon" aria-hidden>
          🔔
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {isEn ? "Remind you daily?" : "نفكّرك كل يوم؟"}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {isEn
              ? "The #1 reason learners fall off is simply forgetting. One micro reminder keeps your momentum."
              : "أكتر سبب بيخلي الناس تسيب المسار إنها بتنسى. تذكير واحد في اليوم بيحل ده."}
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <label className="text-xs text-neutral-500 dark:text-neutral-400">
          {isEn ? "Time" : "الساعة"}
        </label>
        <select
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 px-2.5 py-1.5 text-xs text-neutral-800 dark:text-neutral-200"
        >
          {[7, 9, 12, 15, 18, 20, 21, 22].map((h) => (
            <option key={h} value={h}>
              {h}:00
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={allow}
          className="btn-shine rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-colors"
        >
          {isEn ? "Remind Me" : "فكّرني"}
        </button>
        <button
          onClick={dismiss}
          className="rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-xs text-neutral-600 dark:text-neutral-400 hover:border-black/20 transition-colors"
        >
          {isEn ? "Not now" : "مش دلوقتي"}
        </button>
      </div>
    </div>
  );
}
