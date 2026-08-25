"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brand } from "@/content/brand";

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

const METHOD_LABEL: Record<string, string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "إنستاباي",
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending: { label: "في الانتظار", cls: "bg-amber-100 text-amber-800" },
  approved: { label: "مفعّل", cls: "bg-green-100 text-green-800" },
  rejected: { label: "مرفوض", cls: "bg-red-100 text-red-700" },
};

export default function AdminOrders({ orders }: { orders: Order[] }) {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold">طلبات الاشتراك</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/users" className="text-sm font-bold text-brand-600">
              المستخدمون
            </Link>
            <Link href="/admin/payouts" className="text-sm font-bold text-brand-600">
              السحوبات
            </Link>
            <span className="text-sm font-bold text-brand-800">
              {brand.name}
              <span className="text-brand-400">.com</span>
            </span>
          </div>
        </div>
        <p className="text-sm text-neutral-500 mb-4">
          {pendingCount > 0 ? `${pendingCount} طلب محتاج مراجعة` : "مفيش طلبات منتظرة"}
        </p>

        <div className="flex gap-2 mb-4 flex-wrap">
          {[
            { key: "pending", label: "في الانتظار" },
            { key: "approved", label: "مفعّل" },
            { key: "rejected", label: "مرفوض" },
            { key: "all", label: "الكل" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`text-xs rounded-full px-3 py-1.5 border ${
                filter === f.key ? "bg-brand-600 text-white border-brand-600" : "border-black/10 text-neutral-600 bg-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center text-sm text-neutral-400">
            مفيش طلبات في القسم ده
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((order) => {
              const meta = STATUS_META[order.status] ?? STATUS_META.pending;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-black/5 p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl shrink-0">{order.courseIcon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{order.courseTitle}</span>
                        <span className={`text-[10px] rounded-full px-2 py-0.5 ${meta.cls}`}>{meta.label}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-1 break-all" dir="ltr">
                        {order.email}
                      </p>
                      {order.name && <p className="text-xs text-neutral-400">{order.name}</p>}
                      {order.senderPhone && (
                        <p className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900">
                          <span aria-hidden>📱</span>
                          <span dir="ltr">{order.senderPhone}</span>
                          <span className="font-normal text-amber-700">بيحوّل من الرقم ده</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div className="bg-neutral-50 rounded-lg py-2">
                      <div className="text-[10px] text-neutral-400">الطريقة</div>
                      <div className="text-xs font-bold">{METHOD_LABEL[order.method] ?? order.method}</div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg py-2">
                      <div className="text-[10px] text-neutral-400">المبلغ</div>
                      <div className="text-xs font-bold">{order.amountEgp} ج.م</div>
                    </div>
                    <div className="bg-neutral-50 rounded-lg py-2">
                      <div className="text-[10px] text-neutral-400">التاريخ</div>
                      <div className="text-xs font-bold">
                        {new Date(order.createdAt).toLocaleDateString("ar-EG", { day: "numeric", month: "short" })}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {order.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(order.id, "approved")}
                        disabled={busy === order.id}
                        className="flex-1 bg-brand-600 text-white text-xs font-bold rounded-full py-2.5 disabled:opacity-50"
                      >
                        {busy === order.id ? "..." : "منح الوصول ✓"}
                      </button>
                    )}
                    {order.status === "pending" && (
                      <button
                        onClick={() => updateStatus(order.id, "rejected")}
                        disabled={busy === order.id}
                        className="px-4 border border-red-200 text-red-600 text-xs rounded-full py-2.5 disabled:opacity-50"
                      >
                        رفض
                      </button>
                    )}
                    {order.status === "approved" && (
                      <button
                        onClick={() => updateStatus(order.id, "pending")}
                        disabled={busy === order.id}
                        className="flex-1 border border-black/10 text-neutral-500 text-xs rounded-full py-2.5 disabled:opacity-50"
                      >
                        إلغاء التفعيل
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
