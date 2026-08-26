"use client";

import { useEffect, useState } from "react";

const STORE_KEY = "tawwerni-reminder";
const HOUR_KEY = "tawwerni-reminder-hour";

/**
 * Daily reminder to come back and do the lesson.
 *
 * Built on the browser's own Notification API rather than push, deliberately:
 * real push needs a service worker, VAPID keys and a server that can reach the
 * push endpoints, and on iOS only works for an installed PWA. That is a lot of
 * moving parts to maintain for a reminder. This schedules locally — while the
 * tab or installed app is alive it fires on time, and the daily-streak card
 * does the rest of the work.
 *
 * Three rules about the permission prompt, because getting these wrong is how
 * a site trains people to hit "Block" forever:
 *
 *  1. Never on first load. Only after the learner has finished something, so
 *     the request lands as "keep this going" rather than "let me interrupt you".
 *  2. Ask once. A dismissal is remembered and never asked again.
 *  3. The browser dialog only opens after they tap our own button — a bare
 *     `requestPermission()` on page load is what gets domains muted.
 */
export default function ReminderPrompt({ hasCompletions }: { hasCompletions: boolean }) {
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
      return; // storage blocked — don't nag on every page load
    }

    if (stored === "on" && Notification.permission === "granted") {
      setEnabled(true);
      return;
    }
    // Asked and answered.
    if (stored === "off" || Notification.permission === "denied") return;
    // Earn the ask first.
    if (!hasCompletions) return;

    setShow(true);
  }, [hasCompletions]);

  // Fire at the chosen hour for as long as the page stays open.
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
        new Notification("درس النهاردة مستنيك 📚", {
          body: "٥ دقايق بس — وتحافظ على سلسلتك.",
          icon: "/icon.svg",
          tag: "tawwerni-daily",
        });
      } catch {
        /* the browser may refuse while the tab is hidden — nothing to do */
      }
    }, msUntilNext());

    return () => clearTimeout(timer);
  }, [enabled, hour]);

  async function allow() {
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        localStorage.setItem(STORE_KEY, "on");
        localStorage.setItem(HOUR_KEY, String(hour));
        setEnabled(true);
        new Notification("تمام ✓", {
          body: `هنفكّرك كل يوم الساعة ${hour}:٠٠.`,
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
          <p className="text-sm font-bold">نفكّرك كل يوم؟</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
            أكتر سبب بيخلي الناس تسيب المسار إنها بتنسى. تذكير واحد في اليوم
            بيحل ده.
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <label className="text-xs text-neutral-500">الساعة</label>
        <select
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs"
        >
          {[7, 9, 12, 15, 18, 20, 21, 22].map((h) => (
            <option key={h} value={h}>
              {h}:٠٠
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={allow} className="btn-shine rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white">
          فكّرني
        </button>
        <button onClick={dismiss} className="rounded-full border border-black/10 px-4 py-2 text-xs">
          مش دلوقتي
        </button>
      </div>
    </div>
  );
}
