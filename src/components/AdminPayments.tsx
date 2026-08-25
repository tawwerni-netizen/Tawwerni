"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

const PROVIDER_LABEL: Record<string, string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "إنستاباي",
};

export default function AdminPayments({
  transactions,
  pendingOrders,
}: {
  transactions: Tx[];
  pendingOrders: PendingOrder[];
}) {
  const router = useRouter();
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
      setError(d.error ?? "حصل خطأ");
      return;
    }
    setPicking(null);
    router.refresh();
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-center">
        <div className="mb-2 text-3xl">✓</div>
        <p className="text-sm font-bold">مفيش تحويلات محتاجة مراجعة</p>
        <p className="mt-1 text-xs text-neutral-400">
          كل التحويلات اللي وصلت اتطابقت تلقائيًا مع طلباتها.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {transactions.map((tx) => (
        <div key={tx.id} className="rounded-2xl border border-amber-200 bg-white p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold">
                {PROVIDER_LABEL[tx.provider] ?? tx.provider} · {tx.amountEgp} ج.م
              </p>
              {tx.senderPhone && (
                <p className="text-xs text-neutral-500" dir="ltr">
                  {tx.senderPhone}
                </p>
              )}
            </div>
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900">
              محتاج مراجعة
            </span>
          </div>

          {tx.matchNote && (
            <p className="mb-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-900">
              {tx.matchNote}
            </p>
          )}

          <details className="mb-3">
            <summary className="cursor-pointer text-[11px] text-neutral-400">نص الرسالة</summary>
            <p className="mt-1 rounded-lg bg-neutral-50 p-2 text-[11px] leading-relaxed text-neutral-600">
              {tx.rawSms}
            </p>
          </details>

          {picking === tx.id ? (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-neutral-500">اختار الطلب اللي يخص التحويل ده:</p>
              {pendingOrders.length === 0 ? (
                <p className="text-xs text-neutral-400">مفيش طلبات معلّقة دلوقتي.</p>
              ) : (
                pendingOrders.map((o) => (
                  <button
                    key={o.id}
                    disabled={busy === tx.id}
                    onClick={() => act(tx.id, "link", o.id)}
                    className="card-lift w-full rounded-xl border border-black/10 p-2.5 text-right disabled:opacity-50"
                  >
                    <p className="truncate text-xs font-bold" dir="ltr">
                      {o.email}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {o.courseTitle} · {o.amountEgp} ج.م
                      {o.senderPhone && (
                        <span dir="ltr" className="mr-1">
                          · {o.senderPhone}
                        </span>
                      )}
                    </p>
                  </button>
                ))
              )}
              <button
                onClick={() => setPicking(null)}
                className="w-full py-1 text-center text-[11px] text-neutral-400"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                disabled={busy === tx.id}
                onClick={() => setPicking(tx.id)}
                className="btn-shine flex-1 rounded-full bg-brand-600 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                اربطه بطلب ✓
              </button>
              <button
                disabled={busy === tx.id}
                onClick={() => act(tx.id, "ignore")}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold text-neutral-500 disabled:opacity-50"
              >
                تجاهل
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
