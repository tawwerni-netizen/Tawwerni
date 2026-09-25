"use client";

import { useEffect, useState } from "react";
import { brand } from "@/content/brand";
import { referral } from "@/content/brand";
import { allCourses } from "@/content/courses";
import { coursesWord } from "@/lib/arabic-plural";
import { trackReferralShared } from "@/lib/analytics";

import { useI18n } from "./LanguageContext";

/**
 * Sharing, aimed at how this audience actually shares.
 */
export default function ShareRow({
  className = "",
  title,
  titleEn,
  note,
  noteEn,
  message,
  messageEn,
}: {
  className?: string;
  title?: string;
  titleEn?: string;
  note?: string;
  noteEn?: string;
  message?: string;
  messageEn?: string;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const resolvedTitle = isEn
    ? (titleEn ?? `Share ${brand.nameEn}`)
    : (title ?? `شارك ${brand.name}`);
  const resolvedNote = isEn
    ? (noteEn ?? `Earn ${referral.commissionEgp} EGP for every friend who subscribes from your link.`)
    : (note ?? `خد ${referral.commissionEgp} ج.م عن كل صاحب يشترك من لينكك.`);

  const [url, setUrl] = useState(`https://${brand.domain}`);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Fetch the personal code so the share is worth money to the sharer.
    fetch("/api/referrals/code")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d?.code) {
          setUrl(`https://${brand.domain}/?ref=${d.code}`);
        }
      })
      .catch(() => {
        /* fall back */
      });

    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    return () => {
      cancelled = true;
    };
  }, []);

  const text = isEn
    ? (messageEn ?? `Try ${brand.nameEn} — 5-minute micro-lessons daily. 100 complete professional tracks with one membership.`)
    : (message ?? `جرّب ${brand.name} — درس واحد كل يوم في ٥ دقايق، بالعربي والإنجليزي. ١٠٠ مسار احترافي كامل باشتراك واحد.`);

  async function nativeShare() {
    try {
      await navigator.share({ title: brand.name, text, url });
      trackReferralShared("native");
    } catch {
      /* ignore */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      trackReferralShared("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`share-row ${className}`}>
      <div className="mb-3 flex items-start gap-3">
        <span className="share-row-icon" aria-hidden>
          🎁
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{resolvedTitle}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {resolvedNote}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackReferralShared("whatsapp")}
          className="share-btn share-btn-wa"
        >
          <span aria-hidden>💬</span> {isEn ? "WhatsApp" : "واتساب"}
        </a>

        {canNativeShare && (
          <button type="button" onClick={nativeShare} className="share-btn">
            <span aria-hidden>📤</span> {isEn ? "Share" : "شارك"}
          </button>
        )}

        <button type="button" onClick={copy} className="share-btn">
          <span aria-hidden>{copied ? "✓" : "🔗"}</span>{" "}
          {copied ? (isEn ? "Copied" : "اتنسخ") : (isEn ? "Copy Link" : "انسخ اللينك")}
        </button>
      </div>
    </div>
  );
}
