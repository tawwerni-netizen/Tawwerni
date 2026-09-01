"use client";

import { useState } from "react";
import Link from "next/link";
import type { PromptCategory } from "@/content/lead-magnet-prompts";
import { trackLead } from "@/lib/analytics";

const STORAGE_KEY = "tw_leadmagnet_ai-prompts";

export default function LeadMagnetGate({ categories }: { categories: PromptCategory[] }) {
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/lead-magnets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, magnetKey: "ai-prompts" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "حصل خطأ، جرّب تاني");
        return;
      }
      trackLead();
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private browsing — still unlock for this visit */
      }
      setUnlocked(true);
    } catch {
      setError("مفيش اتصال بالإنترنت. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string, key: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedIdx(key);
        setTimeout(() => setCopiedIdx(null), 1500);
      })
      .catch(() => {});
  }

  if (!unlocked) {
    return (
      <form onSubmit={submit} className="mx-auto max-w-sm rounded-3xl border border-black/5 bg-white p-6">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسمك"
          className="mb-3 w-full rounded-xl border border-black/10 px-3 py-3 text-sm"
        />
        <input
          required
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="mb-3 w-full rounded-xl border border-black/10 px-3 py-3 text-center text-sm"
        />
        {error && <p className="mb-3 text-center text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-shine w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "..." : "شوف الـ100 برومبت ←"}
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-400">
          مفيش سبام. ممكن نبعتلك إيميلات عن {"طوّرني"} بعدها.
        </p>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-brand-50 p-4 text-center text-sm text-brand-900">
        اتفضل — ١٠٠ برومبت، دوس على أي واحد تنسخه.
      </div>

      {categories.map((cat) => (
        <div key={cat.key}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-neutral-800">
            <span aria-hidden>{cat.icon}</span> {cat.title}
          </h2>
          <div className="space-y-2">
            {cat.prompts.map((p, i) => {
              const key = `${cat.key}-${i}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => copy(p, key)}
                  className="block w-full rounded-xl border border-black/5 bg-white p-3 text-right text-sm leading-relaxed text-neutral-700 transition hover:border-brand-400"
                >
                  {p}
                  <span className="mt-1 block text-[11px] font-bold text-brand-600">
                    {copiedIdx === key ? "✓ اتنسخ" : "📋 دوس عشان تنسخ"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-center text-white">
        <p className="mb-1 text-lg font-bold">عايز تتعلم تستخدمها صح؟</p>
        <p className="mb-4 text-sm text-white/80">
          مسار الذكاء الاصطناعي بياخدك خطوة بخطوة — مش بس برومبتات جاهزة.
        </p>
        <Link
          href="/quiz"
          className="btn-ghost-shine inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800"
        >
          🤖 جرّب اليوم الأول مجانًا ←
        </Link>
      </div>
    </div>
  );
}
