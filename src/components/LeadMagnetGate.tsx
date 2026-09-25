"use client";

import { useState } from "react";
import Link from "next/link";
import type { PromptCategory } from "@/content/lead-magnet-prompts";
import { trackLead } from "@/lib/analytics";
import { useI18n } from "@/components/LanguageContext";

const STORAGE_KEY = "tw_leadmagnet_ai-prompts";

export default function LeadMagnetGate({ categories }: { categories: PromptCategory[] }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

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
        setError(data.error ?? (isEn ? "Something went wrong. Please try again." : "حصل خطأ، جرّب تاني"));
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
      setError(isEn ? "No internet connection. Please try again." : "مفيش اتصال بالإنترنت. جرّب تاني.");
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
      <form onSubmit={submit} className="mx-auto max-w-sm rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-sm" dir={isEn ? "ltr" : "rtl"}>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={isEn ? "Your Full Name" : "اسمك"}
          className="mb-3 w-full rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400"
        />
        <input
          required
          type="email"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="mb-3 w-full rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-3 text-center text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400"
        />
        {error && <p className="mb-3 text-center text-xs text-red-600 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-shine w-full rounded-full bg-brand-600 py-3.5 text-sm font-bold text-white disabled:opacity-60 transition active:scale-98"
        >
          {loading ? "..." : (isEn ? "Unlock All 100 Prompts Free →" : "شوف الـ100 برومبت ←")}
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-400 dark:text-neutral-500">
          {isEn
            ? "100% spam-free. We only send practical insights and updates from Tawwerni."
            : "مفيش سبام. ممكن نبعتلك إيميلات عن طوّرني بعدها."}
        </p>
      </form>
    );
  }

  return (
    <div className="space-y-6" dir={isEn ? "ltr" : "rtl"}>
      <div className="rounded-2xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-800/40 p-4 text-center text-sm text-brand-900 dark:text-brand-200">
        {isEn
          ? "🎉 You're in! 100 battle-tested prompts ready. Click any prompt card to copy it instantly."
          : "اتفضل — ١٠٠ برومبت، دوس على أي واحد تنسخه."}
      </div>

      {categories.map((cat) => (
        <div key={cat.key}>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-neutral-800 dark:text-neutral-100">
            <span aria-hidden>{cat.icon}</span> {isEn ? cat.titleEn : cat.title}
          </h2>
          <div className="space-y-2">
            {(isEn && cat.promptsEn ? cat.promptsEn : cat.prompts).map((p, i) => {
              const key = `${cat.key}-${i}`;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => copy(p, key)}
                  className={`block w-full rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-3.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-200 transition hover:border-brand-400 dark:hover:border-brand-500 ${
                    isEn ? "text-left" : "text-right"
                  }`}
                >
                  <p>{p}</p>
                  <span className="mt-1.5 block text-[11px] font-bold text-brand-600 dark:text-brand-400">
                    {copiedIdx === key
                      ? (isEn ? "✓ Copied to clipboard!" : "✓ اتنسخ")
                      : (isEn ? "📋 Tap to copy" : "📋 دوس عشان تنسخ")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-center text-white shadow-xl">
        <p className="mb-1 text-lg font-bold">
          {isEn ? "Want to Master AI for Real Results?" : "عايز تتعلم تستخدمها صح؟"}
        </p>
        <p className="mb-4 text-sm text-white/80 max-w-md mx-auto leading-relaxed">
          {isEn
            ? "Our hands-on AI Track takes you step-by-step with practical 5-minute daily challenges — far beyond static templates."
            : "مسار الذكاء الاصطناعي بياخدك خطوة بخطوة — مش بس برومبتات جاهزة."}
        </p>
        <Link
          href="/quiz"
          className="btn-ghost-shine inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800 hover:bg-neutral-100 transition active:scale-98"
        >
          {isEn ? "🤖 Start Day 1 Free Preview →" : "🤖 جرّب اليوم الأول مجانًا ←"}
        </Link>
      </div>
    </div>
  );
}
