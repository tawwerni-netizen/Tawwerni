"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageContext";

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

const METHOD_LABEL: Record<string, { ar: string; en: string }> = {
  vodafone_cash: { ar: "فودافون كاش", en: "Vodafone Cash" },
  instapay: { ar: "إنستاباي", en: "InstaPay" },
};

export default function AdminPayouts({ payouts }: { payouts: Payout[] }) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

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
      setError(d.error ?? (isEn ? "An error occurred" : "حصل خطأ"));
      return;
    }
    router.refresh();
  }

  if (payouts.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 text-center shadow-xs">
        <div className="mb-2 text-3xl">✓</div>
        <p className="text-sm font-bold text-neutral-900 dark:text-white">
          {isEn ? "No pending payout requests" : "مفيش طلبات سحب معلقة"}
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          {isEn ? "All affiliate commissions have been fulfilled." : "كل عمولات التسويق اتسددت بالكامل."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-600 dark:text-red-300 font-semibold">{error}</p>}

      {payouts.map((p) => {
        const methodInfo = METHOD_LABEL[p.method] ?? { ar: p.method, en: p.method };
        return (
          <div key={p.id} className="rounded-2xl border border-amber-300/60 dark:border-amber-700/50 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-neutral-900 dark:text-white" dir="ltr">
                  {p.email}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {p.name ?? (isEn ? "Anonymous" : "بدون اسم")} · {isEn ? `Referred ${p.referredCount} members` : `جاب ${p.referredCount} مشترك`}
                </p>
              </div>
              <span className="shrink-0 text-lg font-bold text-teal-600 dark:text-teal-400 font-mono">
                {p.amountEgp} {isEn ? "EGP" : "ج.م"}
              </span>
            </div>

            <div className="mb-3 rounded-xl bg-neutral-50 dark:bg-neutral-800 p-3">
              <p className="mb-1 text-xs text-neutral-400">{isEn ? "Transfer to destination:" : "حوّل على"}</p>
              <p className="text-sm font-bold text-neutral-900 dark:text-white font-mono" dir="ltr">
                {p.destination}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mt-0.5">
                {isEn ? methodInfo.en : methodInfo.ar}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                disabled={busy === p.id}
                onClick={() => settle(p.id, "paid")}
                className="flex-1 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-2.5 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-50 transition"
              >
                {busy === p.id ? "..." : isEn ? "Mark as Transferred ✓" : "حوّلت ✓"}
              </button>
              <button
                disabled={busy === p.id}
                onClick={() => settle(p.id, "rejected")}
                className="rounded-full border border-red-300 dark:border-red-800 px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50 transition"
              >
                {isEn ? "Reject" : "رفض"}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-neutral-400">
              {isEn ? "Rejecting returns the balance back to the user's wallet." : "الرفض بيرجّع الرصيد لمحفظة المستخدم تاني."}
            </p>
          </div>
        );
      })}
    </div>
  );
}
