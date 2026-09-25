"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./LanguageContext";

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
  const { lang } = useI18n();
  const isEn = lang === "en";

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
    setReady(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const theme = next ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("tawwerni-theme", theme);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        dark
          ? isEn
            ? "Switch to light mode"
            : "التبديل إلى الوضع النهاري"
          : isEn
          ? "Switch to dark mode"
          : "التبديل إلى الوضع الليلي"
      }
      title={
        dark
          ? isEn
            ? "Light mode"
            : "الوضع النهاري"
          : isEn
          ? "Dark mode"
          : "الوضع الليلي"
      }
      className={`theme-toggle group relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 dark:border-white/10 bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 shadow-2xs transition-all hover:scale-105 active:scale-95 hover:bg-neutral-100 dark:hover:bg-neutral-700/80 ${className}`}
    >
      {/* Render nothing until mounted so server and client markup agree. */}
      <span className={ready ? "transition-transform duration-300" : "opacity-0"}>
        {dark ? (
          /* Sleek glowing sun */
          <svg
            className="h-[18px] w-[18px] text-amber-400 transition-transform duration-300 group-hover:rotate-45"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4.2" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 2v2.5M12 19.5v2.5M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12h2.5M6.7 17.3l-1.77 1.77M19.07 4.93l-1.77 1.77" />
          </svg>
        ) : (
          /* Sleek crescent moon */
          <svg
            className="h-[18px] w-[18px] text-neutral-700 transition-transform duration-300 -rotate-12 group-hover:rotate-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
              fill="currentColor"
              fillOpacity="0.15"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
