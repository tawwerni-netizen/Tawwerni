"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArticleStatusBar({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: status === "published" ? "unpublish" : "publish" }),
    });
    setBusy(false);
    router.refresh();
  }

  async function remove() {
    if (!confirm("متأكد إنك عايز تمسح المقال ده؟ مفيش تراجع.")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto mb-4 flex max-w-2xl items-center justify-between rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-3.5 shadow-xs">
      <span
        className={`rounded-full px-3 py-1 text-xs font-black shadow-xs ${
          status === "published"
            ? "bg-emerald-600 text-white border border-emerald-500"
            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10"
        }`}
      >
        {status === "published" ? "✓ منشور حاليًا" : "مسودة"}
      </span>
      <div className="flex gap-2">
        <button
          disabled={busy}
          onClick={toggle}
          className="rounded-full border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 transition"
        >
          {status === "published" ? "سحب من النشر" : "انشره"}
        </button>
        <button
          disabled={busy}
          onClick={remove}
          className="rounded-full border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/60 disabled:opacity-50 transition"
        >
          امسح
        </button>
      </div>
    </div>
  );
}
