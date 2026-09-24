"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageContext";

type PendingOrder = {
  id: string;
  email: string;
  name: string | null;
  senderPhone: string | null;
  courseTitle: string;
  amountEgp: number;
};

type Tx = {
  id: string;
  provider: string;
  amountEgp: number;
  senderPhone: string | null;
  rawSms: string;
  matchNote: string | null;
  createdAt: string;
};

const PROVIDER_LABEL: Record<string, { ar: string; en: string }> = {
  vodafone_cash: { ar: "فودافون كاش", en: "Vodafone Cash" },
  instapay: { ar: "إنستاباي", en: "InstaPay" },
};

export default function AdminPayments({
  transactions,
  pendingOrders,
}: {
  transactions: Tx[];
  pendingOrders: PendingOrder[];
}) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [busy, setBusy] = useState<string | null>(null);
  const [picking, setPicking] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function act(txId: string, action: "link" | "ignore", orderId?: string) {
    setBusy(txId);
    setError("");
    const res = await fetch(`/api/admin/payments/${txId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, orderId }),
    });
    setBusy(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? (isEn ? "An error occurred" : "حصل خطأ"));
      return;
    }
    setPicking(null);
    router.refresh();
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 text-center shadow-xs">
        <div className="mb-2 text-3xl">✓</div>
        <p className="text-sm font-bold text-neutral-900 dark:text-white">
          {isEn ? "No transfers awaiting review" : "مفيش تحويلات محتاجة مراجعة"}
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          {isEn
            ? "All received incoming transfers matched automatically with customer orders."
            : "كل التحويلات اللي وصلت اتطابقت تلقائيًا مع طلباتها."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-600 dark:text-red-300 font-semibold">{error}</p>}

      {transactions.map((tx) => {
        const prov = PROVIDER_LABEL[tx.provider] ?? { ar: tx.provider, en: tx.provider };
        return (
          <div key={tx.id} className="rounded-2xl border border-amber-300/60 dark:border-amber-700/50 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-neutral-900 dark:text-white">
                  {isEn ? prov.en : prov.ar} · {tx.amountEgp} {isEn ? "EGP" : "ج.م"}
                </p>
                {tx.senderPhone && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono" dir="ltr">
                    {tx.senderPhone}
                  </p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-amber-100 dark:bg-amber-950/60 px-2 py-1 text-[10px] font-bold text-amber-900 dark:text-amber-200 border border-amber-300/40">
                {isEn ? "Action Required" : "محتاج مراجعة"}
              </span>
            </div>

            {tx.matchNote && (
              <p className="mb-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1.5 text-[11px] text-amber-900 dark:text-amber-200 border border-amber-200/50">
                {tx.matchNote}
              </p>
            )}

            <details className="mb-3">
              <summary className="cursor-pointer text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
                {isEn ? "Raw SMS Payload" : "نص الرسالة"}
              </summary>
              <p className="mt-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 p-2 text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-300 font-mono">
                {tx.rawSms}
              </p>
            </details>

            {picking === tx.id ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
                  {isEn ? "Select the corresponding pending order:" : "اختار الطلب اللي يخص التحويل ده:"}
                </p>
                {pendingOrders.length === 0 ? (
                  <p className="text-xs text-neutral-400">{isEn ? "No pending orders." : "مفيش طلبات معلّقة دلوقتي."}</p>
                ) : (
                  pendingOrders.map((o) => (
                    <button
                      key={o.id}
                      disabled={busy === tx.id}
                      onClick={() => act(tx.id, "link", o.id)}
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 p-2.5 text-start hover:border-teal-500 bg-neutral-50 dark:bg-neutral-800 transition disabled:opacity-50"
                    >
                      <p className="truncate text-xs font-bold text-neutral-900 dark:text-white" dir="ltr">
                        {o.email}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {o.courseTitle} · {o.amountEgp} {isEn ? "EGP" : "ج.م"}
                        {o.senderPhone && (
                          <span dir="ltr" className={isEn ? "ml-1 font-mono" : "mr-1 font-mono"}>
                            · {o.senderPhone}
                          </span>
                        )}
                      </p>
                    </button>
                  ))
                )}
                <button
                  onClick={() => setPicking(null)}
                  className="w-full py-1 text-center text-[11px] text-neutral-400 hover:underline"
                >
                  {isEn ? "Cancel" : "إلغاء"}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  disabled={busy === tx.id}
                  onClick={() => setPicking(tx.id)}
                  className="flex-1 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-2 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-50 transition"
                >
                  {isEn ? "Link to Order ✓" : "اربطه بطلب ✓"}
                </button>
                <button
                  disabled={busy === tx.id}
                  onClick={() => act(tx.id, "ignore")}
                  className="rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 transition"
                >
                  {isEn ? "Ignore" : "تجاهل"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
