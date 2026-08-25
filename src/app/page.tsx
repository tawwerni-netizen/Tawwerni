import Link from "next/link";
import { brand } from "@/content/brand";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between px-5 py-4 max-w-lg mx-auto">
        <div className="font-bold text-brand-800">
          {brand.name}
          <span className="text-brand-400">.com</span>
        </div>
        <Link href="/login" className="text-xs text-neutral-500">
          تسجيل الدخول
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-5 pt-6 pb-16">
        <div className="text-center mb-8">
          <span className="inline-block text-xs bg-brand-50 text-brand-800 rounded-full px-3 py-1 mb-4">
            🔥 أكثر من ١٠٠ ألف متعلم حول العالم
          </span>
          <h1 className="text-3xl font-bold leading-tight mb-3">
            {brand.tagline}
            <br />
            <span className="text-brand-600">في ٥ دقايق بس</span>
          </h1>
          <p className="text-neutral-500 text-sm mb-6">
            تحدي الذكاء الاصطناعي في ٢٨ يوم — مهارة عملية واحدة كل يوم، بالعربي، بدون تعقيد.
          </p>
          <Link
            href="/quiz"
            className="inline-block bg-brand-600 btn-shine text-white font-bold rounded-full px-8 py-3.5 text-sm"
          >
            ابدأ التحدي الآن ←
          </Link>
          <p className="text-[11px] text-neutral-400 mt-3">دقيقتين بس · نتيجة فورية</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10 text-center">
          {[
            { n: "٢٨", label: "يوم" },
            { n: "٥", label: "دقايق/يوم" },
            { n: "٤.٩⭐", label: "تقييم المتعلمين" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-black/5 py-3">
              <div className="font-bold text-brand-800">{s.n}</div>
              <div className="text-[10px] text-neutral-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {[
            { icon: "🧠", title: "أساسيات مبسّطة", body: "افهم الذكاء الاصطناعي فعليًا، مش بس اسمع عنه." },
            { icon: "⚡", title: "تطبيق عملي يومي", body: "مهمة حقيقية كل يوم — مش نظري بس." },
            { icon: "💰", title: "مسار للدخل", body: "من التعلّم لأول مشروع جانبي حقيقي." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-black/5 p-4 flex gap-3 items-start">
              <span className="text-xl">{f.icon}</span>
              <div>
                <p className="text-sm font-bold">{f.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
