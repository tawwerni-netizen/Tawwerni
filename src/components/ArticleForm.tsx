"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pillars } from "@/content/hub-pillars";

type CourseOption = { id: string; title: string };

type Initial = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  pillar: string;
  icon: string;
  seoTitle: string;
  seoDescription: string;
  readingMinutes: number;
  faq: string;
  relatedCourseId: string;
  ctaText: string;
};

const EMPTY: Initial = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  pillar: pillars[0]?.key ?? "",
  icon: "📄",
  seoTitle: "",
  seoDescription: "",
  readingMinutes: 5,
  faq: "",
  relatedCourseId: "",
  ctaText: "",
};

export default function ArticleForm({
  initial,
  courses,
}: {
  initial?: Initial;
  courses: CourseOption[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [form, setForm] = useState<Initial>(initial ?? EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function set<K extends keyof Initial>(key: K, value: Initial[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save(publish?: boolean) {
    setError("");
    setBusy(true);
    try {
      const url = isEdit ? `/api/admin/articles/${initial!.id}` : "/api/admin/articles";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "حصل خطأ");
        return;
      }

      const id = isEdit ? initial!.id! : data.id;
      if (publish !== undefined) {
        const pubRes = await fetch(`/api/admin/articles/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: publish ? "publish" : "unpublish" }),
        });
        if (!pubRes.ok) {
          const d = await pubRes.json().catch(() => ({}));
          setError(d.error ?? "اتحفظ بس فشل النشر");
          return;
        }
      }

      router.push("/admin/articles");
      router.refresh();
    } catch {
      setError("مفيش اتصال. جرّب تاني.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <div className="mb-3 grid grid-cols-[1fr_5rem] gap-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-neutral-500">العنوان</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-neutral-500">أيقونة</label>
            <input
              value={form.icon}
              onChange={(e) => set("icon", e.target.value)}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-center text-sm"
            />
          </div>
        </div>

        <label className="mb-1 block text-xs font-bold text-neutral-500">
          Slug (إنجليزي، بدون مسافات)
        </label>
        <input
          dir="ltr"
          value={form.slug}
          onChange={(e) => set("slug", e.target.value.toLowerCase())}
          placeholder="chatgpt-daily-tasks"
          className="mb-3 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-xs font-bold text-neutral-500">الموضوع</label>
        <select
          value={form.pillar}
          onChange={(e) => set("pillar", e.target.value)}
          className="mb-3 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        >
          {pillars.map((p) => (
            <option key={p.key} value={p.key}>
              {p.icon} {p.title}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-xs font-bold text-neutral-500">ملخص قصير</label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <label className="mb-1 block text-xs font-bold text-neutral-500">
          المحتوى — فقرات عادية، ## عنوان فرعي، - نقطة، **بولد**، [نص](رابط)
        </label>
        <textarea
          value={form.content}
          onChange={(e) => set("content", e.target.value)}
          rows={16}
          dir="rtl"
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm leading-relaxed"
        />
      </div>

      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <p className="mb-3 text-xs font-bold text-neutral-500">SEO ودعوة الفعل</p>
        <label className="mb-1 block text-[11px] text-neutral-400">عنوان SEO (اختياري)</label>
        <input
          value={form.seoTitle}
          onChange={(e) => set("seoTitle", e.target.value)}
          className="mb-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        />
        <label className="mb-1 block text-[11px] text-neutral-400">وصف SEO (اختياري)</label>
        <textarea
          value={form.seoDescription}
          onChange={(e) => set("seoDescription", e.target.value)}
          rows={2}
          className="mb-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        />
        <label className="mb-1 block text-[11px] text-neutral-400">دقايق القراءة</label>
        <input
          type="number"
          min={1}
          value={form.readingMinutes}
          onChange={(e) => set("readingMinutes", Number(e.target.value))}
          className="mb-2 w-24 rounded-xl border border-black/10 px-3 py-2 text-sm"
        />
        <label className="mb-1 block text-[11px] text-neutral-400">المسار المرتبط</label>
        <select
          value={form.relatedCourseId}
          onChange={(e) => set("relatedCourseId", e.target.value)}
          className="mb-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        >
          <option value="">— من غير مسار —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <label className="mb-1 block text-[11px] text-neutral-400">نص الدعوة للفعل (اختياري)</label>
        <input
          value={form.ctaText}
          onChange={(e) => set("ctaText", e.target.value)}
          className="mb-2 w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
        />
        <label className="mb-1 block text-[11px] text-neutral-400">
          أسئلة شائعة — JSON: [{"{"}"q":"...","a":"..."{"}"}]
        </label>
        <textarea
          value={form.faq}
          onChange={(e) => set("faq", e.target.value)}
          rows={3}
          dir="ltr"
          className="w-full rounded-xl border border-black/10 px-3 py-2 text-xs"
        />
      </div>

      <div className="flex gap-2">
        <button
          disabled={busy}
          onClick={() => save()}
          className="flex-1 rounded-full border border-black/10 py-3 text-sm font-bold text-neutral-600 disabled:opacity-50"
        >
          احفظ كمسودة
        </button>
        <button
          disabled={busy}
          onClick={() => save(true)}
          className="btn-shine flex-1 rounded-full bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          احفظ وانشر ←
        </button>
      </div>
    </div>
  );
}
