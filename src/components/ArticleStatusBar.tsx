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
    <div className="mx-auto mb-4 flex max-w-2xl items-center justify-between rounded-2xl border border-black/5 bg-white p-3">
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-bold ${
          status === "published" ? "bg-green-50 text-green-700" : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {status === "published" ? "منشور حاليًا" : "مسودة"}
      </span>
      <div className="flex gap-2">
        <button
          disabled={busy}
          onClick={toggle}
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-bold text-neutral-600 disabled:opacity-50"
        >
          {status === "published" ? "سحب من النشر" : "انشره"}
        </button>
        <button
          disabled={busy}
          onClick={remove}
          className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 disabled:opacity-50"
        >
          امسح
        </button>
      </div>
    </div>
  );
}
