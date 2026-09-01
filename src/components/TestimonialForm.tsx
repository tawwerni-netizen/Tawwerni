"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TestimonialForm({ courseId }: { courseId: string | null }) {
  const router = useRouter();
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
        setError(data.error ?? "حصل خطأ، جرّب تاني");
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("مفيش اتصال بالإنترنت. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md rounded-3xl border border-black/5 bg-white p-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
          🙏
        </div>
        <h1 className="mb-2 text-lg font-bold">شكرًا على وقتك!</h1>
        <p className="text-sm leading-relaxed text-neutral-500">
          هنراجع كلامك، ولو مناسب هيظهر على الموقع باسمك.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
          💬
        </div>
        <h1 className="mb-1 text-lg font-bold">شارك تجربتك</h1>
        <p className="text-sm leading-relaxed text-neutral-500">
          كلامك ممكن يساعد حد تاني يقرر يبدأ. مفيش صيغة معينة — اكتب اللي حسّيته
          فعلًا.
        </p>
      </div>

      <div className="mb-4 rounded-2xl border border-black/5 bg-white p-4">
        <p className="mb-2 text-xs font-bold text-neutral-500">تقييمك (اختياري)</p>
        <div className="flex justify-center gap-1" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(rating === n ? null : n)}
              className="p-1 text-2xl transition-transform active:scale-90"
              aria-label={`${n} نجوم`}
            >
              {rating && n <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-black/5 bg-white p-4">
        <label className="mb-2 block text-xs font-bold text-neutral-500">تجربتك</label>
        <textarea
          required
          minLength={10}
          maxLength={800}
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={5}
          placeholder="إيه اللي اتغيّر بعد ما بدأت؟"
          className="w-full rounded-xl border border-black/10 p-3 text-sm leading-relaxed transition-colors focus:border-brand-600 focus:outline-none"
        />
        <p className="mt-1 text-left text-[11px] text-neutral-400">{quote.length}/800</p>
      </div>

      {error && <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading || quote.trim().length < 10}
        className="btn-shine w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading ? "جاري الإرسال..." : "ابعت رأيي ←"}
      </button>
      <p className="mt-3 text-center text-[11px] leading-relaxed text-neutral-400">
        بنراجع كل رأي قبل ما نعرضه — مفيش نشر أوتوماتيكي.
      </p>
    </form>
  );
}
