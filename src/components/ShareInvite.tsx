"use client";

import { useState } from "react";
import { brand, referral, referralsToBreakEven, pricing } from "@/content/brand";
import { trackReferralShared } from "@/lib/analytics";
import { useI18n } from "./LanguageContext";

export default function ShareInvite({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const [copied, setCopied] = useState(false);

  const url = `https://${brand.domain}`;
  const message = isEn
    ? `I found something remarkable: ${brand.name} — ${brand.domain}

100 professional tracks in AI, Coding & Freelancing, 5-15 mins daily.
Day 1 of every single track is 100% free — try it without spending a dime.`
    : `لقيت حاجة هتعجبك جدًا: ${brand.name} — ${brand.domain}

١٠٠ مسار احترافي في الذكاء الاصطناعي والتكنولوجيا، ٥ إلى ١٥ دقيقة يوميًا.
اليوم الأول من كل مسار مفتوح مجانًا — جربه عمليًا من غير ما تدفع حاجة.`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${message}\n\n${url}`);
    } catch {
      return;
    }
    setCopied(true);
    trackReferralShared("copy");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      className={`rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-sm transition-colors ${className}`}
    >
      <p className="text-base font-bold text-neutral-900 dark:text-white mb-1">
        {isEn ? "Know someone who would benefit from this?" : "تعرف حد التكنولوجيا والمهارات دي هتفيده؟"}
      </p>
      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
        {isEn ? (
          <>
            Send them Day 1 free. If they enroll, you earn{" "}
            <b className="text-teal-600 dark:text-teal-400">{referral.commissionEgp} EGP</b> — just{" "}
            {referralsToBreakEven} friends cover your entire membership!
          </>
        ) : (
          <>
            شارك معه اليوم الأول المجاني. وإذا اشترك، تحصل على{" "}
            <b className="text-teal-600 dark:text-teal-400">{referral.commissionEgp} ج.م كاش</b> — و
            {referralsToBreakEven} أصدقاء يغطون اشتراكك بالكامل وزيادة.
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${message}\n\n${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackReferralShared("whatsapp")}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors"
        >
          <span aria-hidden>💬</span>
          <span>{isEn ? "Share via WhatsApp" : "شارك عبر واتساب"}</span>
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          <span aria-hidden>{copied ? "✓" : "🔗"}</span>
          <span>{copied ? (isEn ? "Copied!" : "تم النسخ!") : (isEn ? "Copy Invite Link" : "انسخ الرابط")}</span>
        </button>
      </div>

      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 leading-relaxed">
        {isEn
          ? `Your referral earnings link directly to your account. Friends get full free preview, and lifetime membership is just ${pricing.priceEgp} EGP.`
          : `العمولة تُحسب عبر رابطك المخصص الذي يتولد فور التسجيل. المشاركة تمنح صديقك التجربة المجانية، والاشتراك الكامل ${pricing.priceEgp} ج.م لمرة واحدة فقط.`}
      </p>
    </div>
  );
}
