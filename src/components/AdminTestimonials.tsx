"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageContext";

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
  const { lang } = useI18n();
  const isEn = lang === "en";

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
      setError(d.error ?? (isEn ? "An error occurred" : "حصل خطأ"));
      return;
    }
    setEditing(null);
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 text-center shadow-xs">
        <p className="text-sm text-neutral-400">
          {isEn ? "No reviews or testimonials to display." : "مفيش آراء أو تقييمات هنا دلوقتي."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2 text-xs text-red-600 dark:text-red-300 font-semibold">{error}</p>}

      {items.map((t) => (
        <div key={t.id} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-900 dark:text-white">
                {t.holderName} {STARS(t.rating)}
              </p>
              {t.courseTitle && <p className="text-[11px] text-neutral-400">{t.courseTitle}</p>}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {t.status === "approved" && (
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-300/40">
                  {isEn ? "Approved" : "موافَق عليه"}
                </span>
              )}
              {t.status === "rejected" && (
                <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-[10px] font-bold text-neutral-500">
                  {isEn ? "Rejected" : "مرفوض"}
                </span>
              )}
              {t.featured && (
                <span className="rounded-full bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300/40">
                  ⭐ {isEn ? "Featured" : "مُبرز"}
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
                className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 p-2.5 text-xs text-neutral-900 dark:text-white leading-relaxed focus:outline-teal-500"
              />
              <div className="flex gap-2">
                <button
                  disabled={busy === t.id}
                  onClick={() => act(t.id, "edit", { quote: draft, holderName: t.holderName })}
                  className="flex-1 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-1.5 text-xs font-bold text-white shadow-xs disabled:opacity-50"
                >
                  {isEn ? "Save" : "احفظ"}
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="px-3 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  {isEn ? "Cancel" : "إلغاء"}
                </button>
              </div>
            </div>
          ) : (
            <p className="mb-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 p-3 text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 italic">
              &ldquo;{t.quote}&rdquo;
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {t.status === "pending" && (
              <>
                <button
                  disabled={busy === t.id}
                  onClick={() => act(t.id, "approve")}
                  className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-50"
                >
                  {isEn ? "Approve ✓" : "وافق ✓"}
                </button>
                <button
                  disabled={busy === t.id}
                  onClick={() => act(t.id, "reject")}
                  className="rounded-full border border-red-300 dark:border-red-800 px-4 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 disabled:opacity-50"
                >
                  {isEn ? "Reject" : "ارفض"}
                </button>
              </>
            )}
            {t.status === "approved" && (
              <button
                disabled={busy === t.id}
                onClick={() => act(t.id, t.featured ? "unfeature" : "feature")}
                className="rounded-full border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 px-4 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 disabled:opacity-50"
              >
                {t.featured ? (isEn ? "Unfeature" : "شيل الإبراز") : (isEn ? "Feature ⭐" : "أبرزه ⭐")}
              </button>
            )}
            {editing !== t.id && (
              <button
                onClick={() => {
                  setEditing(t.id);
                  setDraft(t.quote);
                }}
                className="rounded-full border border-black/10 dark:border-white/10 px-4 py-1.5 text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isEn ? "Edit Quote" : "عدّل النص"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
