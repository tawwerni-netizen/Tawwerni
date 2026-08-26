import Link from "next/link";
import { brand, pricing, payment } from "@/content/brand";
import { allCourses, courseStats } from "@/content/courses";
import { LogoLink } from "@/components/Logo";
import LiveSeats from "@/components/LiveSeats";
import StructuredData from "@/components/StructuredData";
import FaqSchema from "@/components/FaqSchema";
import SocialLinks from "@/components/SocialLinks";

/**
 * The public landing page.
 *
 * Structured the way a decision actually gets made, not the way a feature list
 * is written:
 *
 *   1. What you get, in one line.
 *   2. The cost of *not* doing it — stated as the reader's own situation, not
 *      as a threat. Loss lands harder than gain, but only when it's true.
 *   3. Proof there's something real here: six tracks, a hundred and fifty
 *      lessons, day one open to anyone.
 *   4. The price, framed against what it's worth rather than in isolation.
 *   5. Objection handling.
 *   6. One clear action.
 *
 * The refund line is deliberately absent from this page — see the note above
 * the price block.
 */
export default function LandingPage() {
  const courses = allCourses.map((c) => ({ ...c.meta, ...courseStats(c) }));
  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0);

  /** What ٢٩٩ buys you elsewhere. Anchoring beats a bare number. */
  const comparisons = [
    { icon: "☕", label: "٣ قعدات قهوة", note: "بتخلص في ساعة" },
    { icon: "🍔", label: "وجبة لاتنين", note: "بتخلص في نص ساعة" },
    // Counted, not typed: a hardcoded 157 here would quietly disagree with the
    // catalogue the first time a lesson is added.
    { icon: "📚", label: `${totalLessons} درس`, note: "بتفضل معاك للأبد", ours: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <StructuredData />
      <FaqSchema />

      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-2">
            <Link href="/login" className="tap px-2 py-2 text-xs text-neutral-500">
              دخول
            </Link>
            <Link href="/quiz" className="cta-buy px-5 py-2.5 text-xs">
              <span>ابدأ مجانًا</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pt-10 pb-16">
        {/* ---------- 1. The promise ---------- */}
        <div className="mx-auto mb-6 max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs text-brand-800">
            🎯 {courses.length} مسارات · {totalLessons} درس · اشتراك واحد
          </span>
          <h1 className="mb-4 text-3xl font-bold leading-tight md:text-5xl">
            {brand.tagline}
            <br />
            <span className="text-brand-600">في ٥ دقايق بس</span>
          </h1>
          <p className="mx-auto mb-7 max-w-lg text-sm leading-relaxed text-neutral-500 md:text-base">
            درس واحد كل يوم — تقراه، تنفّذ مهمة عملية، وتجاوب على كام سؤال.
            كله بالعربي، وبدون تعقيد.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/quiz" className="cta-buy px-9 py-4 text-sm">
              <span>ابدأ التحدي الآن ←</span>
            </Link>
            <Link href="/login?signup=1" className="cta-ghost px-7 py-4 text-sm">
              جرّب اليوم الأول مجانًا
            </Link>
          </div>
          <p className="cta-note mt-4">
            من غير بطاقة بنكية · اليوم الأول من كل مسار مفتوح
          </p>
        </div>

        <LiveSeats className="mx-auto mb-14 max-w-sm" />

        {/* ---------- 2. The cost of not ---------- */}
        <div className="mx-auto mb-14 max-w-3xl">
          <h2 className="mb-2 text-center text-xl font-bold md:text-2xl">
            السنة اللي فاتت عدّت. والجاية هتعدّي برضه.
          </h2>
          <p className="mx-auto mb-7 max-w-lg text-center text-sm leading-relaxed text-neutral-500">
            السؤال الوحيد: هتبقى فين لما تعدّي؟
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="loss-card">
              <p className="loss-card-tag">من غير نظام</p>
              <ul className="loss-list">
                <li>تفتح كورس، تحمّس، وتسيبه بعد ٣ أيام</li>
                <li>تحفظ ١٠٠ فيديو ومتتفرجش على واحد</li>
                <li>تشوف اللي حواليك بيتقدّموا وإنت واقف</li>
                <li>بعد سنة تلاقي نفسك في نفس المكان</li>
              </ul>
            </div>

            <div className="gain-card">
              <p className="gain-card-tag">مع {brand.name}</p>
              <ul className="gain-list">
                <li>٥ دقايق في اليوم — حاجة تقدر تكمّلها فعلًا</li>
                <li>مهمة عملية كل يوم، مش محتوى تتفرج عليه</li>
                <li>تشوف تقدّمك قدامك يوم بيوم</li>
                <li>بعد ٢٨ يوم عندك مهارة وشهادة تثبتها</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- 3. Proof ---------- */}
        <p className="mb-1 text-center text-xs tracking-wide text-neutral-400">
          كل ده جوّه الاشتراك
        </p>
        <h2 className="mb-7 text-center text-xl font-bold md:text-2xl">
          {courses.length} مسارات كاملة
        </h2>

        <div className="mb-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* ---------- 4. The price, anchored ---------- */}
        <div className="mx-auto mb-14 max-w-2xl">
          <h2 className="mb-2 text-center text-xl font-bold md:text-2xl">
            ٢٩٩ جنيه. مرة واحدة.
          </h2>
          <p className="mx-auto mb-7 max-w-md text-center text-sm leading-relaxed text-neutral-500">
            مش اشتراك شهري، ومش هيتجدّد. تدفع مرة وتفضل معاك.
          </p>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {comparisons.map((c) => (
              <div key={c.label} className={c.ours ? "anchor-card anchor-card-ours" : "anchor-card"}>
                <span className="mb-1 block text-2xl" aria-hidden>
                  {c.icon}
                </span>
                <p className="text-sm font-bold">{c.label}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{c.note}</p>
              </div>
            ))}
          </div>

          {/*
            The refund promise is off this page on purpose. It appeared here as
            "٧ أيام" while the offer page said "٣٠ يوم" — two different numbers
            for the same promise, which costs more trust than the guarantee
            buys. The free first day does the same job honestly: try it before
            paying anything.
          */}
          <div className="price-card">
            <p className="mb-1 text-xs font-bold tracking-wide text-brand-700">اشتراك واحد</p>
            {/*
              A struck-through 3000 used to sit beside the price. Nothing was
              ever sold at 3000, so it was a claim about a past that did not
              happen. The per-lesson figure below is arithmetic on numbers the
              reader can count for themselves.
            */}
            <div className="mb-2 flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold">{pricing.priceEgp}</span>
              <span className="text-sm font-bold">ج.م</span>
            </div>
            <p className="mb-3 text-xs text-neutral-400">
              يعني أقل من جنيهين للدرس — لـ{totalLessons} درس
            </p>
            <p className="mb-5 text-xs leading-relaxed text-neutral-500">
              وصول مدى الحياة · كل المسارات · كل التحديثات الجاية مجانًا
            </p>
            <Link href="/quiz" className="cta-buy w-full px-8 py-4 text-sm">
              <span>ابدأ التحدي ←</span>
            </Link>
            <p className="cta-note mt-3">
              اليوم الأول مجاني — جرّب قبل ما تدفع أي حاجة
            </p>
          </div>
        </div>

        {/* ---------- 5. Objections ---------- */}
        <h2 className="mb-7 text-center text-xl font-bold md:text-2xl">
          «بس أنا…»
        </h2>
        <div className="mb-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: "⏳",
              title: "مش فاضي",
              body: "٥ دقايق. أقل من اللي بتقضيه في السكرول قبل ما تنام.",
            },
            {
              icon: "🤷",
              title: "مش هكمّل",
              body: "عشان كده الخطوة صغيرة. المسارات اللي بتفشل هي اللي بتطلب ساعتين في اليوم.",
            },
            {
              icon: "🧑‍💻",
              title: "مش تقني",
              body: "مفيش سطر كود واحد. لو بتكتب رسالة واتساب، تقدر.",
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

        {/* ---------- 6. One action ---------- */}
        <div className="closing-cta">
          <h2 className="mb-3 text-2xl font-bold md:text-3xl">أنهي يوم هتبدأ؟</h2>
          <p className="on-brand-soft mx-auto mb-7 max-w-md text-sm leading-relaxed">
            كل يوم بتأجّل فيه هو يوم كنت هتبقى خلّصته. اليوم الأول مفتوح — ابدأ دلوقتي.
          </p>
          <Link href="/quiz" className="cta-buy px-9 py-4 text-sm">
            <span>ابدأ التحدي ←</span>
          </Link>
          <p className="on-brand-faint mt-4 text-xs">دقيقتين بس · نتيجة فورية</p>
        </div>

        {/*
          The footer answers the two questions left at the bottom of a sales
          page: how do I reach a human, and is anyone actually behind this. The
          support line does the first; the accounts do the second — for a new
          platform, a place to go and look is worth more than another claim.
        */}
        <footer className="mt-12 border-t border-black/5 pt-8 text-center">
          <p className="mb-4 text-[11px] leading-relaxed text-neutral-400">
            محتاج مساعدة؟ واتساب <span dir="ltr">{payment.supportWhatsapp}</span> ·{" "}
            {payment.supportEmail}
          </p>
          <SocialLinks className="justify-center" />
          <p className="mt-4 text-[11px] text-neutral-400">
            {brand.name}
            <span className="text-neutral-300">.com</span> · كل الحقوق محفوظة
          </p>
        </footer>
      </main>
    </div>
  );
}
