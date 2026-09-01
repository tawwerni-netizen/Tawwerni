"use client";

import { useEffect, useState } from "react";
import { brand } from "@/content/brand";
import { referral } from "@/content/brand";
import { allCourses } from "@/content/courses";
import { trackReferralShared } from "@/lib/analytics";

/**
 * Sharing, aimed at how this audience actually shares.
 *
 * WhatsApp first, and by a distance — in Egypt a link that isn't WhatsApp-able
 * mostly doesn't travel. The native share sheet is offered when the browser has
 * one (every modern phone), because it reaches WhatsApp, Messenger, Telegram
 * and SMS in one tap. Copy is the fallback that always works.
 *
 * The link carries the sharer's referral code, so a share is worth 50 EGP to
 * them — which is the difference between "nice idea" and something people
 * actually do.
 */
export default function ShareRow({
  className = "",
  title = "شارك طوّرني",
  note,
  message,
}: {
  className?: string;
  title?: string;
  note?: string;
  message?: string;
}) {
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
        /* fall back to the plain domain — sharing still works */
      });

    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
    return () => {
      cancelled = true;
    };
  }, []);

  const text =
    message ??
    // Counted, not typed — see LiveSeats.tsx for why a hardcoded count here
    // is exactly the bug that let this go stale once already.
    `جرّب ${brand.name} — درس واحد كل يوم في ٥ دقايق، بالعربي. ${allCourses.length} مسارات كاملة باشتراك واحد.`;

  async function nativeShare() {
    try {
      await navigator.share({ title: brand.name, text, url });
      trackReferralShared("native");
    } catch {
      /* the user dismissed the sheet — nothing to report */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      trackReferralShared("copy");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied — the WhatsApp button still works */
    }
  }

  return (
    <div className={`share-row ${className}`}>
      <div className="mb-3 flex items-start gap-3">
        <span className="share-row-icon" aria-hidden>
          🎁
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">
            {note ?? `خد ${referral.commissionEgp} ج.م عن كل صاحب يشترك من لينكك.`}
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
          <span aria-hidden>💬</span> واتساب
        </a>

        {canNativeShare && (
          <button type="button" onClick={nativeShare} className="share-btn">
            <span aria-hidden>📤</span> شارك
          </button>
        )}

        <button type="button" onClick={copy} className="share-btn">
          <span aria-hidden>{copied ? "✓" : "🔗"}</span> {copied ? "اتنسخ" : "انسخ اللينك"}
        </button>
      </div>
    </div>
  );
}
