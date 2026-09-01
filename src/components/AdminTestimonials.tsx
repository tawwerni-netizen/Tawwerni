"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  holderName: string;
  quote: string;
  rating: number | null;
  courseTitle: string | null;
  status: string;
  featured: boolean;
  createdAt: string;
};

const STARS = (n: number | null) => (n ? "⭐".repeat(n) : "");

export default function AdminTestimonials({ items }: { items: Item[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  async function act(id: string, action: string, extra?: Record<string, unknown>) {
    setBusy(id);
    setError("");
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    setBusy(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "حصل خطأ");
      return;
    }
    setEditing(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 text-center">
        <p className="text-sm text-neutral-500">مفيش حاجة هنا دلوقتي.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      {items.map((t) => (
        <div key={t.id} className="rounded-2xl border border-black/5 bg-white p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold">
                {t.holderName} {STARS(t.rating)}
              </p>
              {t.courseTitle && <p className="text-[11px] text-neutral-400">{t.courseTitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {t.status === "approved" && (
                <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-green-700">
                  موافَق عليه
                </span>
              )}
              {t.status === "rejected" && (
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-bold text-neutral-500">
                  مرفوض
                </span>
              )}
              {t.featured && (
                <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900">
                  ⭐ مُبرز
                </span>
              )}
            </div>
          </div>

          {editing === t.id ? (
            <div className="mb-3 space-y-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-black/10 p-2.5 text-xs leading-relaxed"
              />
              <div className="flex gap-2">
                <button
                  disabled={busy === t.id}
                  onClick={() => act(t.id, "edit", { quote: draft, holderName: t.holderName })}
                  className="btn-shine flex-1 rounded-full bg-brand-600 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                >
                  احفظ
                </button>
                <button onClick={() => setEditing(null)} className="px-3 text-xs text-neutral-400">
                  إلغاء
                </button>
              </div>
            </div>
          ) : (
            <p className="mb-3 rounded-xl bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-700">
              &ldquo;{t.quote}&rdquo;
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {t.status === "pending" && (
              <>
                <button
                  disabled={busy === t.id}
                  onClick={() => act(t.id, "approve")}
                  className="btn-shine rounded-full bg-brand-600 px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                >
                  وافق ✓
                </button>
                <button
                  disabled={busy === t.id}
                  onClick={() => act(t.id, "reject")}
                  className="rounded-full border border-black/10 px-4 py-1.5 text-xs font-bold text-neutral-500 disabled:opacity-50"
                >
                  ارفض
                </button>
              </>
            )}
            {t.status === "approved" && (
              <button
                disabled={busy === t.id}
                onClick={() => act(t.id, t.featured ? "unfeature" : "feature")}
                className="rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-900 disabled:opacity-50"
              >
                {t.featured ? "شيل الإبراز" : "أبرزه ⭐"}
              </button>
            )}
            {editing !== t.id && (
              <button
                onClick={() => {
                  setEditing(t.id);
                  setDraft(t.quote);
                }}
                className="rounded-full border border-black/10 px-4 py-1.5 text-xs text-neutral-500"
              >
                عدّل النص
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
