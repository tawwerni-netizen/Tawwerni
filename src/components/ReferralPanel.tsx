"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "./LanguageContext";

type Props = {
  code: string;
  shareUrl: string;
  totalReferred: number;
  availableEgp: number;
  lockedEgp: number;
  paidEgp: number;
  canWithdraw: boolean;
  commissionEgp: number;
  minPayoutEgp: number;
  openRequestEgp: number | null;
};

export default function ReferralPanel(props: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [method, setMethod] = useState<"vodafone_cash" | "instapay">("vodafone_cash");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const progress = Math.min(100, Math.round((props.availableEgp / props.minPayoutEgp) * 100));
  const remaining = Math.max(0, props.minPayoutEgp - props.availableEgp);

  async function copy() {
    try {
      await navigator.clipboard.writeText(props.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  async function share() {
    const text = isEn
      ? `Learn a high-income skill every day with Tawwerni. Sign up using my link: ${props.shareUrl}`
      : `اتعلّم مهارة جديدة كل يوم مع طوّرني. سجّل من اللينك ده: ${props.shareUrl}`;
    if (navigator.share) {
      await navigator.share({ text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }
  }

  async function submitPayout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/referrals/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, destination }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? (isEn ? "An error occurred, please try again" : "حصل خطأ، جرّب تاني"));
        return;
      }
      setDone(true);
      setShowForm(false);
      router.refresh();
    } catch {
      setError(isEn ? "Connection error. Please try again." : "مفيش اتصال. جرّب تاني.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Balance */}
      <div className="animate-pop overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white shadow-md">
        <p className="mb-1 text-xs text-white/70">
          {isEn ? "Withdrawable Balance" : "رصيدك القابل للسحب"}
        </p>
        <p className="mb-3 text-4xl font-bold">
          {props.availableEgp}
          <span className="mx-1.5 text-lg font-normal">{isEn ? "EGP" : "ج.م"}</span>
        </p>

        <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-white/80">
          {props.canWithdraw
            ? isEn
              ? "Minimum reached — you can withdraw now ✓"
              : "وصلت للحد الأدنى — تقدر تسحب دلوقتي ✓"
            : isEn
            ? `${remaining} EGP left to reach minimum payout (${props.minPayoutEgp} EGP)`
            : `فاضل ${remaining} ج.م توصل لأول سحب (${props.minPayoutEgp} ج.م)`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Tile label={isEn ? "Friends Joined" : "صاحبك اشترك"} value={props.totalReferred} />
        <Tile label={isEn ? "Pending" : "تحت التحويل"} value={`${props.lockedEgp} ${isEn ? "EGP" : "ج"}`} />
        <Tile label={isEn ? "Paid Out" : "اتحوّل لك"} value={`${props.paidEgp} ${isEn ? "EGP" : "ج"}`} />
      </div>

      {/* Link */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
        <p className="mb-1 text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {isEn ? "Your Personal Referral Link" : "لينك الدعوة بتاعك"}
        </p>
        <p className="mb-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {isEn ? (
            <>
              For every friend who subscribes from this link, you earn{" "}
              <b className="text-brand-700 dark:text-brand-400">{props.commissionEgp} EGP</b> once
              their subscription is confirmed.
            </>
          ) : (
            <>
              كل واحد يشترك من اللينك ده، تاخد{" "}
              <b className="text-brand-700 dark:text-brand-400">{props.commissionEgp} ج.م</b> أول ما
              اشتراكه يتفعّل.
            </>
          )}
        </p>

        <button
          type="button"
          onClick={copy}
          className="mb-2 flex w-full items-center justify-between gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-right transition hover:border-brand-400"
        >
          <span className="shrink-0 text-xs font-bold text-brand-700 dark:text-brand-400">
            {copied ? (isEn ? "✓ Copied" : "✓ اتنسخ") : (isEn ? "📋 Copy" : "📋 انسخ")}
          </span>
          <span className="min-w-0 flex-1 truncate text-left text-xs text-neutral-700 dark:text-neutral-300" dir="ltr">
            {props.shareUrl}
          </span>
        </button>

        <button
          type="button"
          onClick={share}
          className="btn-shine w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-brand-700 transition-colors"
        >
          {isEn ? "Share Link 🚀" : "شارك اللينك 🚀"}
        </button>
      </div>

      {/* Payout */}
      {props.openRequestEgp !== null ? (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/30 p-4">
          <p className="text-sm font-bold text-amber-900 dark:text-amber-300">
            {isEn ? "⏳ Payout Request Under Review" : "⏳ طلب السحب تحت المراجعة"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            {isEn
              ? `You requested a payout of ${props.openRequestEgp} EGP. We are processing it and will update status here.`
              : `طلبت سحب ${props.openRequestEgp} ج.م. هنحوّلهم لك ونحدّث الحالة هنا.`}
          </p>
        </div>
      ) : done ? (
        <div className="rounded-2xl border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/30 p-4">
          <p className="text-sm font-bold text-green-800 dark:text-green-300">
            {isEn ? "✓ Payout request received" : "✓ استلمنا طلب السحب"}
          </p>
          <p className="mt-1 text-xs text-green-700 dark:text-green-400">
            {isEn
              ? "We will review and send your transfer promptly."
              : "هنراجعه ونحوّلك في أقرب وقت."}
          </p>
        </div>
      ) : showForm ? (
        <form onSubmit={submitPayout} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
          <p className="mb-3 text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {isEn ? `Withdraw ${props.availableEgp} EGP` : `اسحب ${props.availableEgp} ج.م`}
          </p>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {(
              [
                ["vodafone_cash", isEn ? "Vodafone Cash" : "فودافون كاش", "📱"],
                ["instapay", isEn ? "InstaPay" : "إنستاباي", "⚡"],
              ] as const
            ).map(([value, label, icon]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMethod(value)}
                className={`card-lift rounded-xl border-2 p-3 text-center transition-colors ${
                  method === value
                    ? "border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300"
                    : "border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                <div className="text-xl">{icon}</div>
                <div className="text-xs font-bold">{label}</div>
              </button>
            ))}
          </div>

          <input
            required
            dir="ltr"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={method === "vodafone_cash" ? "01xxxxxxxxx" : "your@instapay"}
            className="mb-2 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-neutral-800 px-3 py-2.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
          />

          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="btn-shine flex-1 rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white disabled:opacity-60 hover:bg-brand-700 transition-colors"
            >
              {busy
                ? isEn ? "Submitting..." : "بيتبعت…"
                : isEn ? "Confirm Payout Request" : "أكّد طلب السحب"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-black/10 dark:border-white/10 px-4 py-2.5 text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              {isEn ? "Cancel" : "إلغاء"}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          disabled={!props.canWithdraw}
          onClick={() => setShowForm(true)}
          className={`w-full rounded-full py-3 text-sm font-bold transition-all ${
            props.canWithdraw
              ? "btn-shine bg-brand-600 text-white shadow-md hover:bg-brand-700"
              : "cursor-not-allowed bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
          }`}
        >
          {props.canWithdraw
            ? isEn ? `Withdraw ${props.availableEgp} EGP` : `اسحب ${props.availableEgp} ج.م`
            : isEn ? `Withdrawal unlocks at ${props.minPayoutEgp} EGP` : `السحب بيفتح عند ${props.minPayoutEgp} ج.م`}
        </button>
      )}

      {/* How it works */}
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
        <p className="mb-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">
          {isEn ? "How it works" : "بيشتغل إزاي؟"}
        </p>
        <ol className="space-y-1.5 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
          <li>{isEn ? "1. Share your personal invite link with friends." : "١. ابعت لينك الدعوة لأصحابك."}</li>
          <li>
            {isEn
              ? `2. Earn ${props.commissionEgp} EGP for every friend who subscribes.`
              : `٢. لما حد يشترك من اللينك، تاخد ${props.commissionEgp} ج.م.`}
          </li>
          <li>
            {isEn
              ? "3. Commission is credited once their membership is active."
              : "٣. العمولة بتتحسب بعد ما اشتراكه يتفعّل فعليًا."}
          </li>
          <li>
            {isEn
              ? `4. Once you reach ${props.minPayoutEgp} EGP, withdraw instantly anytime.`
              : `٤. أول ما توصل ${props.minPayoutEgp} ج.م، تقدر تسحب.`}
          </li>
        </ol>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 py-3 text-center shadow-xs">
      <div className="text-lg font-bold text-brand-800 dark:text-brand-400">{value}</div>
      <div className="text-xs text-neutral-400">{label}</div>
    </div>
  );
}
