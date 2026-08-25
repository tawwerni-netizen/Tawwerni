"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      /* clipboard blocked — the link is visible on screen anyway */
    }
  }

  async function share() {
    const text = `اتعلّم مهارة جديدة كل يوم مع طوّرني. سجّل من اللينك ده: ${props.shareUrl}`;
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
        setError(data.error ?? "حصل خطأ، جرّب تاني");
        return;
      }
      setDone(true);
      setShowForm(false);
      router.refresh();
    } catch {
      setError("مفيش اتصال. جرّب تاني.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Balance */}
      <div className="animate-pop overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
        <p className="mb-1 text-xs text-white/70">رصيدك القابل للسحب</p>
        <p className="mb-3 text-4xl font-bold">
          {props.availableEgp}
          <span className="mr-1 text-lg font-normal">ج.م</span>
        </p>

        <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-white/80">
          {props.canWithdraw
            ? "وصلت للحد الأدنى — تقدر تسحب دلوقتي ✓"
            : `فاضل ${remaining} ج.م توصل لأول سحب (${props.minPayoutEgp} ج.م)`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Tile label="صاحبك اشترك" value={props.totalReferred} />
        <Tile label="تحت التحويل" value={`${props.lockedEgp} ج`} />
        <Tile label="اتحوّل لك" value={`${props.paidEgp} ج`} />
      </div>

      {/* Link */}
      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <p className="mb-1 text-sm font-bold">لينك الدعوة بتاعك</p>
        <p className="mb-3 text-xs leading-relaxed text-neutral-500">
          كل واحد يشترك من اللينك ده، تاخد{" "}
          <b className="text-brand-700">{props.commissionEgp} ج.م</b> أول ما اشتراكه يتفعّل.
        </p>

        <button
          type="button"
          onClick={copy}
          className="mb-2 flex w-full items-center justify-between gap-2 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right transition hover:border-brand-400"
        >
          <span className="shrink-0 text-xs font-bold text-brand-700">
            {copied ? "✓ اتنسخ" : "📋 انسخ"}
          </span>
          <span className="min-w-0 flex-1 truncate text-left text-xs text-neutral-700" dir="ltr">
            {props.shareUrl}
          </span>
        </button>

        <button
          type="button"
          onClick={share}
          className="btn-shine w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white"
        >
          شارك اللينك 🚀
        </button>
      </div>

      {/* Payout */}
      {props.openRequestEgp !== null ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">⏳ طلب السحب تحت المراجعة</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            طلبت سحب <b>{props.openRequestEgp} ج.م</b>. هنحوّلهم لك ونحدّث الحالة هنا.
          </p>
        </div>
      ) : done ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-bold text-green-800">✓ استلمنا طلب السحب</p>
          <p className="mt-1 text-xs text-green-700">هنراجعه ونحوّلك في أقرب وقت.</p>
        </div>
      ) : showForm ? (
        <form onSubmit={submitPayout} className="rounded-2xl border border-black/5 bg-white p-4">
          <p className="mb-3 text-sm font-bold">اسحب {props.availableEgp} ج.م</p>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {(
              [
                ["vodafone_cash", "فودافون كاش", "📱"],
                ["instapay", "إنستاباي", "⚡"],
              ] as const
            ).map(([value, label, icon]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMethod(value)}
                className={`card-lift rounded-xl border-2 p-3 text-center ${
                  method === value ? "border-brand-600 bg-brand-50" : "border-black/10"
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
            className="mb-2 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
          />

          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="btn-shine flex-1 rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white disabled:opacity-60"
            >
              {busy ? "بيتبعت…" : "أكّد طلب السحب"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-black/10 px-4 py-2.5 text-sm text-neutral-500"
            >
              إلغاء
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          disabled={!props.canWithdraw}
          onClick={() => setShowForm(true)}
          className={`w-full rounded-full py-3 text-sm font-bold ${
            props.canWithdraw
              ? "btn-shine bg-brand-600 text-white"
              : "cursor-not-allowed bg-neutral-100 text-neutral-400"
          }`}
        >
          {props.canWithdraw
            ? `اسحب ${props.availableEgp} ج.م`
            : `السحب بيفتح عند ${props.minPayoutEgp} ج.م`}
        </button>
      )}

      {/* How it works */}
      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <p className="mb-2 text-sm font-bold">بيشتغل إزاي؟</p>
        <ol className="space-y-1.5 text-xs leading-relaxed text-neutral-600">
          <li>١. ابعت لينك الدعوة لأصحابك.</li>
          <li>٢. لما حد يشترك من اللينك، تاخد {props.commissionEgp} ج.م.</li>
          <li>٣. العمولة بتتحسب بعد ما اشتراكه يتفعّل فعليًا.</li>
          <li>٤. أول ما توصل {props.minPayoutEgp} ج.م، تقدر تسحب.</li>
        </ol>
      </div>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white py-3 text-center">
      <div className="text-lg font-bold text-brand-800">{value}</div>
      <div className="text-xs text-neutral-400">{label}</div>
    </div>
  );
}
