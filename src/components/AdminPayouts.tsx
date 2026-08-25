"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Payout = {
  id: string;
  email: string;
  name: string | null;
  amountEgp: number;
  method: string;
  destination: string;
  requestedAt: string;
  referredCount: number;
};

const METHOD_LABEL: Record<string, string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "إنستاباي",
};

export default function AdminPayouts({ payouts }: { payouts: Payout[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function settle(id: string, action: "paid" | "rejected") {
    setBusy(id);
    setError("");
    const res = await fetch(`/api/admin/payouts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setBusy(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "حصل خطأ");
      return;
    }
    router.refresh();
  }

  if (payouts.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-center">
        <div className="mb-2 text-3xl">✓</div>
        <p className="text-sm font-bold">مفيش طلبات سحب</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {payouts.map((p) => (
        <div key={p.id} className="rounded-2xl border border-amber-200 bg-white p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold" dir="ltr">
                {p.email}
              </p>
              <p className="text-xs text-neutral-500">
                {p.name ?? "بدون اسم"} · جاب {p.referredCount} مشترك
              </p>
            </div>
            <span className="shrink-0 text-lg font-bold text-brand-700">{p.amountEgp} ج.م</span>
          </div>

          <div className="mb-3 rounded-xl bg-neutral-50 p-3">
            <p className="mb-1 text-xs text-neutral-400">حوّل على</p>
            <p className="text-sm font-bold" dir="ltr">
              {p.destination}
            </p>
            <p className="text-xs text-neutral-500">{METHOD_LABEL[p.method] ?? p.method}</p>
          </div>

          <div className="flex gap-2">
            <button
              disabled={busy === p.id}
              onClick={() => settle(p.id, "paid")}
              className="btn-shine flex-1 rounded-full bg-brand-600 py-2 text-xs font-bold text-white disabled:opacity-50"
            >
              حوّلت ✓
            </button>
            <button
              disabled={busy === p.id}
              onClick={() => settle(p.id, "rejected")}
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold text-neutral-500 disabled:opacity-50"
            >
              رفض
            </button>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            الرفض بيرجّع الرصيد للمستخدم تاني.
          </p>
        </div>
      ))}
    </div>
  );
}
