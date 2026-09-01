"use client";

import { useState } from "react";
import { brand, referral, referralsToBreakEven, pricing } from "@/content/brand";
import { trackReferralShared } from "@/lib/analytics";

/**
 * Sharing, offered to people who have not bought yet.
 *
 * Every share control on this site used to live behind the paywall, which is
 * backwards: the visitor who likes the page and is still deciding is the one
 * most likely to send it to somebody, and they had no way to. That is the
 * largest leak in a product whose whole distribution plan is WhatsApp.
 *
 * The copy leads with the free first day rather than the price, because that
 * is what a person can send a friend without feeling like they are selling to
 * them — and it is the thing most likely to get opened.
 */
export default function ShareInvite({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const url = `https://${brand.domain}`;
  const message = `لقيت حاجة تعجبك: ${brand.name} — ${brand.domain}

٩ مسارات بالعامية المصرية، ٥ دقايق في اليوم.
اليوم الأول من كل مسار مفتوح مجانًا — جرّبه من غير ما تدفع حاجة.`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${message}\n\n${url}`);
    } catch {
      // Clipboard is blocked in some in-app browsers; the WhatsApp link still works.
      return;
    }
    setCopied(true);
    trackReferralShared("copy");
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className={`invite-card ${className}`}>
      <p className="invite-title">تعرف حد ده هيفيده؟</p>
      <p className="invite-sub">
        ابعتله اليوم الأول المجاني. ولو اشترك، بتاخد{" "}
        <b>{referral.commissionEgp} ج.م</b> — و{referralsToBreakEven} أصحاب بيغطّوا
        اشتراكك كله.
      </p>

      <div className="invite-actions">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`${message}\n\n${url}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackReferralShared("whatsapp")}
          className="invite-btn invite-btn-wa"
        >
          <span aria-hidden>💬</span> ابعت على واتساب
        </a>
        <button type="button" onClick={copy} className="invite-btn">
          <span aria-hidden>{copied ? "✓" : "🔗"}</span>
          {copied ? "اتنسخ" : "انسخ اللينك"}
        </button>
      </div>

      {/*
        Said plainly: the commission needs an account, and pretending otherwise
        would produce a share that quietly earns the sender nothing.
      */}
      <p className="invite-note">
        العمولة بتتحسب بلينكك الخاص — بيتولّد أول ما تعمل حساب. المشاركة دي
        بتوصّل صاحبك للتجربة المجانية، والاشتراك {pricing.priceEgp} ج.م مرة واحدة.
      </p>
    </div>
  );
}
