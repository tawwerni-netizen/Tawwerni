/** Formatting helpers.
 *
 *  All of these are locale-aware: Arabic gets Arabic-Indic digits from
 *  `Intl.NumberFormat` and RTL-safe separators, which is the difference between
 *  a translated interface and a localized one.
 */

import type { Locale } from "./i18n";

const intlLocale: Record<Locale, string> = { en: "en-US", ar: "ar" };

export function formatBytes(bytes: number | null | undefined, locale: Locale = "en"): string {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes) || bytes < 0) {
    return "—";
  }
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);
  const digits = value >= 100 || exponent === 0 ? 0 : 1;

  const formatted = new Intl.NumberFormat(intlLocale[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

  return `${formatted} ${units[exponent]}`;
}

export function formatSpeed(bytesPerSecond: number | null | undefined, locale: Locale = "en"): string {
  if (!bytesPerSecond || bytesPerSecond <= 0) return "—";
  return `${formatBytes(bytesPerSecond, locale)}/s`;
}

/** ``mm:ss`` or ``h:mm:ss``. Always LTR-safe since it is punctuation-separated. */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds < 0) {
    return "—";
  }
  const total = Math.floor(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

export function formatEta(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0 || !Number.isFinite(seconds)) return "—";
  return formatDuration(seconds);
}

export function formatCount(value: number | null | undefined, locale: Locale = "en"): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat(intlLocale[locale], {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value: number, locale: Locale = "en"): string {
  const clamped = Math.max(0, Math.min(100, value));
  return new Intl.NumberFormat(intlLocale[locale], {
    maximumFractionDigits: 0,
  }).format(clamped);
}

/** ``6 hours`` / ``٦ ساعات`` - used for the retention notice. */
export function formatRelativeExpiry(iso: string | null, locale: Locale = "en"): string | null {
  if (!iso) return null;
  const expires = new Date(iso).getTime();
  if (Number.isNaN(expires)) return null;

  const deltaSeconds = Math.round((expires - Date.now()) / 1000);
  if (deltaSeconds <= 0) return null;

  const rtf = new Intl.RelativeTimeFormat(intlLocale[locale], { numeric: "auto" });
  if (deltaSeconds < 3600) return rtf.format(Math.round(deltaSeconds / 60), "minute");
  if (deltaSeconds < 86_400) return rtf.format(Math.round(deltaSeconds / 3600), "hour");
  return rtf.format(Math.round(deltaSeconds / 86_400), "day");
}

/** A resolution label that never over-promises: shows what the source has. */
export function qualityBadge(height: number | null | undefined): string | null {
  if (!height) return null;
  if (height >= 4320) return "8K";
  if (height >= 2160) return "4K";
  if (height >= 1440) return "2K";
  if (height >= 1080) return "FHD";
  if (height >= 720) return "HD";
  return `${height}p`;
}

export function truncate(text: string | null | undefined, max = 90): string {
  if (!text) return "";
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}
