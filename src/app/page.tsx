import Link from "next/link";
import { brand, pricing, payment } from "@/content/brand";
import { allCourses, courseStats } from "@/content/courses";
import { LogoLink } from "@/components/Logo";

/**
 * The public landing page.
 *
 * Three things it was getting wrong as a sales page:
 *
 *  1. It sold one course. The site has six, and "٦ مسارات باشتراك واحد" is a
 *     far stronger offer than "٢٨ يوم ذكاء اصطناعي" — visitors couldn't see
 *     most of what they'd be buying.
 *  2. The price appeared nowhere. A visitor who just wants to know what it
 *     costs had to complete an eighteen-question quiz to find out, and most
 *     of them simply left instead.
 *  3. It was locked to `max-w-lg`, so on a laptop it was a narrow strip with
 *     empty gutters either side.
 */
export default function LandingPage() {
  const courses = allCourses.map((c) => ({
    ...c.meta,
    ...courseStats(c),
  }));

  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <LogoLink size={34} href="/" />
        <Link
          href="/login"
          className="tap rounded-full border border-black/10 px-4 py-2 text-xs font-bold"
        >
          تسجيل الدخول
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-6 pb-16">
        {/* ---------- Hero ---------- */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-800">
            🎯 {courses.length} مسارات · {totalLessons} درس · اشتراك واحد
          </span>
          <h1 className="mb-3 text-3xl font-bold leading-tight md:text-5xl">
            {brand.tagline}
            <br />
            <span className="text-brand-600">في ٥ دقايق بس</span>
          </h1>
          <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-neutral-500 md:text-base">
            درس واحد كل يوم — تقراه، تنفّذ مهمة عملية، وتجاوب على كام سؤال. كله
            بالعربي، وبدون تعقيد.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/quiz"
              className="btn-shine inline-block rounded-full bg-brand-600 px-8 py-3.5 text-sm font-bold text-white"
            >
              ابدأ التحدي الآن ←
            </Link>
            {/* A second door for anyone who doesn't want an eighteen-question
                quiz before they can see the product. */}
            <Link
              href="/login?signup=1"
              className="tap inline-block rounded-full border border-black/10 px-6 py-3.5 text-sm font-bold"
            >
              جرّب اليوم الأول مجانًا
            </Link>
          </div>
          <p className="mt-3 text-[11px] text-neutral-400">
            من غير بطاقة بنكية · اليوم الأول من كل مسار مفتوح
          </p>
        </div>

        {/* ---------- Price, stated plainly ---------- */}
        <div className="mx-auto mb-12 max-w-md rounded-3xl border border-brand-200/50 bg-white p-6 text-center">
          <p className="mb-1 text-xs font-bold tracking-wide text-brand-700">اشتراك واحد</p>
          <div className="mb-2 flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold">{pricing.priceEgp}</span>
            <span className="text-sm font-bold">ج.م</span>
            <span className="text-sm text-neutral-400 line-through" dir="ltr">
              {pricing.originalPriceEgp}
            </span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-neutral-500">
            دفعة واحدة · وصول مدى الحياة · كل المسارات · التحديثات مجانًا
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[11px]">
            {["ضمان استرجاع ٧ أيام", "فودافون كاش", "إنستاباي"].map((t) => (
              <span key={t} className="rounded-full bg-neutral-50 px-3 py-1 text-neutral-600">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ---------- What you actually get ---------- */}
        <p className="mb-1 text-center text-xs tracking-wide text-neutral-400">
          كل ده جوّه الاشتراك
        </p>
        <h2 className="mb-6 text-center text-xl font-bold md:text-2xl">
          {courses.length} مسارات كاملة
        </h2>

        <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <div
              key={c.slug}
              className="course-card animate-rise"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="course-card-wash" aria-hidden />
              <span className="course-card-icon" aria-hidden>
                {c.icon}
              </span>
              <span className="course-card-body">
                <span className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="course-card-title">{c.title}</span>
                  {c.badge && <span className="course-chip">{c.badge}</span>}
                </span>
                <span className="course-card-desc">{c.description}</span>
                <span className="course-card-meta">
                  {c.totalLessons} درس · {c.totalXp} XP
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* ---------- How it works ---------- */}
        <h2 className="mb-6 text-center text-xl font-bold md:text-2xl">إزاي بيشتغل</h2>
        <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: "📖",
              title: "اقرا",
              body: "بطاقات قصيرة، فكرة واحدة في كل واحدة. ٥ دقايق مش أكتر.",
            },
            {
              icon: "🎯",
              title: "نفّذ",
              body: "مهمة عملية واحدة كل يوم — المعرفة من غير تطبيق بتتنسى.",
            },
            {
              icon: "✅",
              title: "ثبّت",
              body: "كام سؤال سريع بشرح كامل، عشان المعلومة تفضل معاك.",
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/5 bg-white p-5">
              <span className="mb-2 block text-2xl" aria-hidden>
                {f.icon}
              </span>
              <p className="mb-1 text-sm font-bold">{f.title}</p>
              <p className="text-xs leading-relaxed text-neutral-500">{f.body}</p>
            </div>
          ))}
        </div>

        {/* ---------- Closing CTA ---------- */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-800 to-brand-600 p-8 text-center text-white">
          <h2 className="mb-2 text-xl font-bold md:text-2xl">ابدأ النهاردة</h2>
          <p className="mx-auto mb-5 max-w-md text-sm leading-relaxed text-brand-100">
            اليوم الأول من كل مسار مفتوح مجانًا. جرّب الأول، وقرّر بعدين.
          </p>
          <Link
            href="/quiz"
            className="btn-ghost-shine inline-block rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-800"
          >
            ابدأ التحدي ←
          </Link>
        </div>

        <p className="mt-8 text-center text-[11px] leading-relaxed text-neutral-400">
          محتاج مساعدة؟ واتساب <span dir="ltr">{payment.supportWhatsapp}</span> ·{" "}
          {payment.supportEmail}
        </p>
      </main>
    </div>
  );
}
