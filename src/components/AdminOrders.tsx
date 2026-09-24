"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageContext";

type Order = {
  id: string;
  email: string;
  name: string | null;
  senderPhone: string | null;
  courseTitle: string;
  courseIcon: string;
  method: string;
  amountEgp: number;
  status: string;
  proofChannel: string | null;
  createdAt: string;
};

const METHOD_LABEL: Record<string, { ar: string; en: string }> = {
  vodafone_cash: { ar: "فودافون كاش", en: "Vodafone Cash" },
  instapay: { ar: "إنستاباي", en: "InstaPay" },
};

const STATUS_META: Record<string, { ar: string; en: string; cls: string }> = {
  pending: { ar: "في الانتظار", en: "Pending", cls: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40" },
  approved: { ar: "مفعّل", en: "Approved", cls: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40" },
  rejected: { ar: "مرفوض", en: "Rejected", cls: "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-300/40" },
};

export default function AdminOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [filter, setFilter] = useState<string>("pending");
  const [busy, setBusy] = useState<string | null>(null);

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  async function updateStatus(id: string, status: string) {
    setBusy(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(null);
    router.refresh();
  }

  const FILTERS = [
    { key: "pending", ar: "في الانتظار", en: "Pending" },
    { key: "approved", ar: "مفعّل", en: "Approved" },
    { key: "rejected", ar: "مرفوض", en: "Rejected" },
    { key: "all", ar: "الكل", en: "All" },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {isEn ? "Subscription Orders" : "طلبات الاشتراك"}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            {pendingCount > 0
              ? isEn
                ? `${pendingCount} order(s) awaiting review`
                : `${pendingCount} طلب محتاج مراجعة وتأكيد`
              : isEn
              ? "All orders reviewed and verified ✓"
              : "مفيش طلبات منتظرة — الكل متراجع ✓"}
          </p>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs rounded-full px-3 py-1.5 font-semibold transition ${
                filter === f.key
                  ? "bg-teal-600 text-white shadow-xs"
                  : "border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {isEn ? f.en : f.ar}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/10 p-8 text-center text-sm text-neutral-400 shadow-xs">
          {isEn ? "No orders found in this category." : "مفيش طلبات في هذا القسم حاليًا."}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((order) => {
            const meta = STATUS_META[order.status] ?? STATUS_META.pending;
            const methodInfo = METHOD_LABEL[order.method] ?? { ar: order.method, en: order.method };

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-black/5 dark:border-white/10 p-4 shadow-xs transition hover:border-teal-500/30"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl shrink-0 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                    {order.courseIcon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-neutral-900 dark:text-white">
                        {order.courseTitle}
                      </span>
                      <span className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${meta.cls}`}>
                        {isEn ? meta.en : meta.ar}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 break-all font-mono" dir="ltr">
                      {order.email}
                    </p>
                    {order.name && (
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">{order.name}</p>
                    )}
                    {order.senderPhone && (
                      <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 px-2 py-1 text-xs font-bold text-amber-900 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/40">
                        <span aria-hidden>📱</span>
                        <span dir="ltr" className="font-mono">{order.senderPhone}</span>
                        <span className="font-normal text-amber-700 dark:text-amber-300 text-[11px]">
                          {isEn ? "Transfer from this number" : "بيحوّل من الرقم ده"}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center mb-3">
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl py-2">
                    <div className="text-[10px] text-neutral-400">{isEn ? "Method" : "الطريقة"}</div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {isEn ? methodInfo.en : methodInfo.ar}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl py-2">
                    <div className="text-[10px] text-neutral-400">{isEn ? "Amount" : "المبلغ"}</div>
                    <div className="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                      {order.amountEgp} {isEn ? "EGP" : "ج.م"}
                    </div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl py-2">
                    <div className="text-[10px] text-neutral-400">{isEn ? "Date" : "التاريخ"}</div>
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString(isEn ? "en-US" : "ar-EG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  {order.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(order.id, "approved")}
                      disabled={busy === order.id}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-500 text-white text-xs font-bold rounded-full py-2.5 shadow-xs hover:brightness-110 active:scale-98 transition disabled:opacity-50"
                    >
                      {busy === order.id ? "..." : isEn ? "Grant Access ✓" : "منح الوصول ✓"}
                    </button>
                  )}
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "rejected")}
                      disabled={busy === order.id}
                      className="px-4 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold rounded-full py-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 transition disabled:opacity-50"
                    >
                      {isEn ? "Reject" : "رفض"}
                    </button>
                  )}
                  {order.status === "approved" && (
                    <button
                      onClick={() => updateStatus(order.id, "pending")}
                      disabled={busy === order.id}
                      className="flex-1 border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 text-xs font-bold rounded-full py-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition disabled:opacity-50"
                    >
                      {isEn ? "Revoke / Pending" : "إلغاء التفعيل"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
