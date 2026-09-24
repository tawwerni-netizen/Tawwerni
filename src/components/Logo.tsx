"use client";

import Link from "next/link";
import { useI18n } from "./LanguageContext";

/**
 * The brand mark.
 *
 * In Arabic: Stylised "ط" with upward climbing steps.
 * In English: Modern geometric "T" monogram with an ascending rocket/growth arrow.
 */
export function LogoMark({
  size = 36,
  className = "",
  lang,
}: {
  size?: number;
  className?: string;
  lang?: "ar" | "en";
}) {
  const { lang: contextLang } = useI18n();
  const isEn = (lang ?? contextLang) === "en";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={isEn ? "Tawwerni" : "طوّرني"}
      className={className}
    >
      <defs>
        <linearGradient
          id={isEn ? "tw-tile-en" : "tw-tile-ar"}
          x1="0"
          y1="0"
          x2="48"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#14b8a6" />
          <stop offset="55%" stopColor="#0f766e" />
          <stop offset="100%" stopColor="#042f2e" />
        </linearGradient>
        <linearGradient
          id={isEn ? "tw-sheen-en" : "tw-sheen-ar"}
          x1="0"
          y1="0"
          x2="26"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="13" fill={`url(#${isEn ? "tw-tile-en" : "tw-tile-ar"})`} />
      <rect width="48" height="48" rx="13" fill={`url(#${isEn ? "tw-sheen-en" : "tw-sheen-ar"})`} />

      {isEn ? (
        /* English Logo Mark: Geometric "T" Monogram with Ascending Vector */
        <g>
          {/* Horizontal crossbar (left side) */}
          <path
            d="M13 18.5 H24"
            stroke="#ffffff"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central vertical pillar */}
          <path
            d="M23.5 18.5 V33.5"
            stroke="#ffffff"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Ascending right wing shooting upward */}
          <path
            d="M23.5 18.5 L35 12"
            stroke="#ffffff"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrowhead on the rising wing */}
          <path
            d="M29 12 H35 V18"
            stroke="#ffffff"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Accent intelligence spark dot */}
          <circle cx="34" cy="32" r="2.6" fill="#9fe1cb" />
        </g>
      ) : (
        /* Arabic Logo Mark: Stylized "ط" with Rising Path */
        <g>
          {/* Rising path — three steps climbing to the right */}
          <path
            d="M13 32.5 L20.5 25 L26 30.5 L35.5 19"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrowhead */}
          <path
            d="M30 18.5 L36 18.5 L36 24.5"
            stroke="#ffffff"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* The dot of the ط */}
          <circle cx="13" cy="16" r="2.6" fill="#9fe1cb" />
        </g>
      )}
    </svg>
  );
}

/** Mark plus wordmark, used in headers and hero elements. */
export function Logo({
  size = 32,
  showWord = true,
  className = "",
  lang,
}: {
  size?: number;
  showWord?: boolean;
  className?: string;
  lang?: "ar" | "en";
}) {
  const { lang: contextLang } = useI18n();
  const isEn = (lang ?? contextLang) === "en";

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} lang={lang} />
      {showWord && (
        <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white flex items-center">
          {isEn ? (
            <>
              <span className="font-extrabold tracking-tight">Tawwerni</span>
              <span className="text-teal-600 dark:text-teal-400 font-extrabold">.com</span>
            </>
          ) : (
            <>
              <span>طوّرني</span>
              <span className="text-teal-600 dark:text-teal-400 font-extrabold">.com</span>
            </>
          )}
        </span>
      )}
    </span>
  );
}

/**
 * The header logo: alive, and a way home.
 */
export function LogoLink({
  size = 34,
  showWord = true,
  href = "/",
  className = "",
  lang,
}: {
  size?: number;
  showWord?: boolean;
  href?: string;
  className?: string;
  lang?: "ar" | "en";
}) {
  const { lang: contextLang } = useI18n();
  const isEn = (lang ?? contextLang) === "en";

  return (
    <Link
      href={href}
      aria-label={isEn ? "Tawwerni — Home" : "طوّرني — الصفحة الرئيسية"}
      className={`logo-link group inline-flex items-center gap-2.5 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${className}`}
    >
      <span className="logo-tile relative inline-block shrink-0">
        <LogoMark size={size} lang={lang} />
        <span className="logo-gleam" aria-hidden />
      </span>
      {showWord && (
        <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white flex items-center">
          {isEn ? (
            <>
              <span className="font-extrabold tracking-tight">Tawwerni</span>
              <span className="text-teal-600 dark:text-teal-400 font-extrabold">.com</span>
            </>
          ) : (
            <>
              <span>طوّرني</span>
              <span className="text-teal-600 dark:text-teal-400 font-extrabold">.com</span>
            </>
          )}
        </span>
      )}
    </Link>
  );
}
