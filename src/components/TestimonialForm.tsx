"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageContext";

export default function TestimonialForm({ courseId }: { courseId: string | null }) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState<number | null>(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote, rating, courseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? (isEn ? "Something went wrong, please try again." : "حصل خطأ، جرّب تاني"));
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError(isEn ? "No internet connection. Please verify your connection." : "مفيش اتصال بالإنترنت. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div dir={isEn ? "ltr" : "rtl"} className="mx-auto max-w-md rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 text-center shadow-xs">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl">
          🙏
        </div>
        <h1 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "Thank you for your feedback!" : "شكرًا على وقتك!"}
        </h1>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {isEn
            ? "We'll review your testimonial, and if approved it will appear on the platform under your name."
            : "هنراجع كلامك، ولو مناسب هيظهر على الموقع باسمك."}
        </p>
      </div>
    );
  }

  return (
    <form dir={isEn ? "ltr" : "rtl"} onSubmit={submit} className="mx-auto max-w-md text-neutral-900 dark:text-white">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl">
          💬
        </div>
        <h1 className="mb-1 text-lg font-bold">
          {isEn ? "Share Your Experience" : "شارك تجربتك"}
        </h1>
        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {isEn
            ? "Your words can inspire someone else to take the leap. No specific format needed — just share how you truly feel."
            : "كلامك ممكن يساعد حد تاني يقرر يبدأ. مفيش صيغة معينة — اكتب اللي حسّيته فعلًا."}
        </p>
      </div>

      <div className="mb-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
        <p className="mb-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
          {isEn ? "Your Rating (Optional)" : "تقييمك (اختياري)"}
        </p>
        <div className="flex justify-center gap-1" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(rating === n ? null : n)}
              className="p-1 text-2xl transition-transform active:scale-90"
              aria-label={isEn ? `${n} stars` : `${n} نجوم`}
            >
              {rating && n <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
        <label className="mb-2 block text-xs font-bold text-neutral-500 dark:text-neutral-400">
          {isEn ? "Your Review" : "تجربتك"}
        </label>
        <textarea
          required
          minLength={10}
          maxLength={800}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={5}
          placeholder={isEn ? "What changed after you started learning with Tawwerni?" : "إيه اللي اتغيّر بعد ما بدأت؟"}
          className="w-full rounded-xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-3 text-sm leading-relaxed transition-colors focus:border-teal-500 focus:outline-hidden text-neutral-900 dark:text-white"
        />
        <p className={`mt-1 text-[11px] text-neutral-400 ${isEn ? "text-right" : "text-left"}`}>
          {quote.length}/800
        </p>
      </div>

      {error && (
        <p className="mb-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-xs text-red-600 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || quote.trim().length < 10}
        className="btn-shine w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-bold text-white shadow-md active:scale-98 transition-all disabled:opacity-60"
      >
        {loading
          ? (isEn ? "Submitting..." : "جاري الإرسال...")
          : (isEn ? "Submit My Review →" : "ابعت رأيي ←")}
      </button>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-400">
        {isEn
          ? "We review every testimonial before publishing — no automated posting."
          : "بنراجع كل رأي قبل ما نعرضه — مفيش نشر أوتوماتيكي."}
      </p>
    </form>
  );
}
