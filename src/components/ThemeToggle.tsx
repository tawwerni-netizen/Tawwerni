"use client";

import { useEffect, useState } from "react";

/**
 * Night-mode switch.
 *
 * The chosen theme is written to <html data-theme> and mirrored to
 * localStorage. The initial value is applied by an inline script in the
 * layout — before first paint — so the page never flashes the wrong theme.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try {
      localStorage.setItem("tawwerni-theme", next ? "dark" : "light");
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "الوضع النهاري" : "الوضع الليلي"}
      title={dark ? "الوضع النهاري" : "الوضع الليلي"}
      className={`theme-toggle relative grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-base transition-transform hover:scale-110 active:scale-95 ${className}`}
    >
      {/* Render nothing until mounted so server and client markup agree. */}
      <span className={ready ? "transition-opacity" : "opacity-0"}>{dark ? "☀️" : "🌙"}</span>
    </button>
  );
}
