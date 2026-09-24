import Link from "next/link";
import { brand, pricing, payment, referral, referralsToBreakEven } from "@/content/brand";
import { allCourses, courseStats } from "@/content/courses";
import { ALL_100_TRACKS, TRACK_PILLARS } from "@/content/tracks100";
import { COMMUNITY_300 } from "@/content/community-300";
import { coursesWord } from "@/lib/arabic-plural";
import { LogoLink } from "@/components/Logo";
import LiveSeats from "@/components/LiveSeats";
import StructuredData from "@/components/StructuredData";
import FaqSchema from "@/components/FaqSchema";
import SocialLinks from "@/components/SocialLinks";
import ShareInvite from "@/components/ShareInvite";
import ExitIntentPrompt from "@/components/ExitIntentPrompt";
import Testimonials from "@/components/Testimonials";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import TrackCardVisual from "@/components/TrackCardVisual";
import FocusPlayer from "@/components/FocusPlayer";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  const courses = allCourses.map((c) => ({ ...c.meta, ...courseStats(c) }));
  const totalLessons = ALL_100_TRACKS.reduce((s, t) => s + t.totalLessons, 0);

  // Featured 6 tracks for homepage showcase
  const featuredTracks = [
    ALL_100_TRACKS[0],  // ChatGPT & Prompting
    ALL_100_TRACKS[10], // Fullstack AI
    ALL_100_TRACKS[30], // Freelancing
    ALL_100_TRACKS[40], // Digital Marketing
    ALL_100_TRACKS[50], // UI/UX
    ALL_100_TRACKS[90], // Habits & Psychology
  ].filter(Boolean);

  const comparisons = [
    { icon: "☕", label: "٣ قعدات قهوة", note: "بتخلص في ساعة واحدة" },
    { icon: "🍔", label: "وجبة سريعة لاتنين", note: "بتخلص في نص ساعة" },
    { icon: "🌟", label: `١٠٠ مسار و${totalLessons}+ درس`, note: "استثمار مستمر يفتحلك مصادر دخل مدى الحياة", ours: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <StructuredData />
      <FaqSchema />

      {/* Floating Pomodoro & Binaural Beats Player for psychological focus */}
      <FocusPlayer />

      {/* Header */}
      <header className="sticky top-0 z-40 app-header backdrop-blur-md border-b border-black/5 dark:border-white/10">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <LogoLink size={32} href="/" />
            <Link
              href="/tracks"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:opacity-80 transition-opacity hidden sm:inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full"
            >
              <span>🌟</span>
              <span>الـ 100 مسار</span>
            </Link>
            <Link
              href="/community"
              className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 transition-colors hidden md:inline-flex items-center gap-1 bg-black/5 dark:bg-white/5 border border-black/5 px-2.5 py-1 rounded-full"
            >
              <span>👥</span>
              <span>المجتمع (٣٠٠+)</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/login" className="tap px-2.5 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-brand-600">
              دخول
            </Link>
            <Link href="/quiz" className="cta-buy px-4 sm:px-5 py-2 text-xs font-bold shadow-md hover:scale-105 transition-transform">
              <span>ابدأ مجانًا</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pt-8 pb-16">
        {/* ---------- 1. HERO SECTION ---------- */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Link
            href="/tracks"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-all hover:scale-105 shadow-xs"
          >
            <span className="animate-pulse">✨</span>
            <span>الكتالوج الأكبر عربيًا: ١٠٠ مسار احترافي ثنائي اللغة · تصفّح الآن ←</span>
          </Link>

          <h1 className="mb-4 text-3xl font-black leading-tight sm:text-4xl md:text-5xl tracking-tight">
            ٥ دقايق في اليوم. ٢٨ يوم.
            <br />
            <span className="text-brand-600 bg-gradient-to-r from-brand-600 to-teal-600 bg-clip-text text-transparent">
              مهارة حقيقية تصنع لك دخلاً بالذكاء الاصطناعي والمستقبل.
            </span>
          </h1>

          <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-base">
            <b>١٠٠ مسار تطبيقي كامل</b> مقسمة على ١٠ أركان حيوية (ذكاء اصطناعي، برمجة، بيانات، فريلانس، بيزنس، تسويق، تصميم، وأكثر) — كل درس خطوة عملية مدعومة بأنظمة الدعم النفسي والتركيز الذهني.
          </p>

          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 text-xs text-amber-800 dark:text-amber-300 font-semibold">
            <span>🔥</span>
            <span>عرض فوج التأسيس الأول: {pricing.priceEgp} ج.م فقط (بدل {pricing.originalPriceEgp} ج.م) · وصول مدى الحياة · اليوم الأول مجاني</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/quiz" className="cta-buy w-full sm:w-auto px-9 py-4 text-sm font-bold shadow-lg hover:scale-105 transition-all">
              <span>ابدأ التقييم وحدد مسارك مجانًا ←</span>
            </Link>
            <Link href="/tracks" className="cta-ghost w-full sm:w-auto px-7 py-4 text-sm font-bold border border-black/10 dark:border-white/15 hover:border-brand-500 transition-colors">
              استكشف كتالوج الـ 100 مسار 🧭
            </Link>
          </div>

          <p className="cta-note mt-4 text-xs text-neutral-500">
            ✓ بدون بطاقة بنكية · ✓ اليوم الأول من كل مسار مفتوح مجانًا · ✓ تفعيل فوري
          </p>
        </div>

        <LiveSeats className="mx-auto mb-14 max-w-md" />

        {/* ---------- 2. PSYCHOLOGICAL ADVANTAGE SUITE ---------- */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              علم النفس السلوكي والتعلم الفائق
            </span>
            <h2 className="mt-3 text-2xl font-black md:text-3xl">
              ليه طوّرني بتنجح مكان ما كورسات تانية بتفشل؟
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-500">
              صممنا المنصة على أساس هرمونات الدوبامين، ونظرية الخطوات الميكرو (Micro-Habits)، لضمان استمرارك بدون إحباط أو تسويف.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-50/60 to-white dark:from-teal-950/30 dark:to-neutral-900 p-5 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-2xl">
                🧘‍♂️
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                مولّد التركيز الذهني
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                مؤقت بومودورو مدمج مع نغمات ألفا ثنائية التردد (Binaural Beats) مركبة صوتياً بدون مشتتات لزيادة استيعابك بنسبة 300%.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/30 dark:to-neutral-900 p-5 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-2xl">
                ⚡
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                تجميد السلسلة (Streak Freeze)
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                حماية خاصة تمنع انكسار عزيمتك لو انشغلت يومًا طارئًا. نظام يحفز الدوبامين ويجعل التقدم اليومي إدمانًا إيجابيًا ممتعًا.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-50/60 to-white dark:from-purple-950/30 dark:to-neutral-900 p-5 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-2xl">
                🎭
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                فحص الطاقة والمزاج اليومي
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                يقيس جاهزيتك النفسية ويخصص وتيرة الدرس طبقًا لمستوى طاقتك لضمان عدم الشعور بالذنب أو الإرهاق.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-50/60 to-white dark:from-blue-950/30 dark:to-neutral-900 p-5 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl">
                🤖
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                كوتش الدعم النفسي «فهيم»
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                ذكاء اصطناعي تفاعلي مدرب على معالجة متلازمة المحتال (Imposter Syndrome) والتسويف، وتوجيهك خطوة بخطوة.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 3. THE 100 TRACKS SPOTLIGHT & 10 PILLARS ---------- */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center sm:text-right">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                الكتالوج الشامل
              </span>
              <h2 className="mt-1 text-2xl font-black md:text-3xl">
                ١٠٠ مسار في ١٠ مجالات حيوية
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                كل مسار ثنائي اللغة (عربي / إنجليزي) مع بطاقات معرفية مكثفة وتطبيق فوري
              </p>
            </div>
            <Link
              href="/tracks"
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-5 py-2.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-all hover:scale-105"
            >
              <span>تصفّح كل الـ 100 مسار</span>
              <span>←</span>
            </Link>
          </div>

          {/* 10 Pillars Badge Cloud */}
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {TRACK_PILLARS.map((p) => (
              <Link
                key={p.id}
                href={`/tracks?pillar=${p.id}`}
                className="group flex flex-col p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-teal-500/40 hover:shadow-md transition text-right"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl group-hover:scale-110 transition-transform">{p.icon}</span>
                  <span className="text-[10px] font-bold text-neutral-400 group-hover:text-teal-500">
                    10 مسارات
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1 group-hover:text-teal-600 transition-colors">
                  {p.nameAr}
                </p>
                <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                  {p.nameEn}
                </p>
              </Link>
            ))}
          </div>

          {/* 6 Featured Tracks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTracks.map((track) => (
              <TrackCardVisual
                key={track.slug}
                track={track}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/tracks"
              className="cta-buy inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold shadow-md hover:scale-105 transition"
            >
              <span>افتح دليل الـ 100 مسار بالكامل واكتشف مسارك المفضل ←</span>
            </Link>
          </div>
        </section>

        {/* ---------- 4. BEFORE & AFTER (LOSS AVERSION) ---------- */}
        <div className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-2 text-center text-xl font-bold md:text-2xl">
            السنة اللي فاتت عدّت. والجاية هتعدّي برضه.
          </h2>
          <p className="mx-auto mb-7 max-w-lg text-center text-sm leading-relaxed text-neutral-500">
            السؤال الوحيد: هتبقى فين لما تعدّي؟ هل في نفس المكان، أم ممتلكًا لمهارات تغير دخلك وحياتك؟
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="loss-card border-red-200/80 bg-red-50/50 dark:bg-red-950/20 p-5 rounded-2xl border">
              <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-1.5">
                <span>😟</span>
                <span>من غير نظام وطريقة مدروسة:</span>
              </p>
              <ul className="space-y-2 text-xs leading-relaxed text-red-800 dark:text-red-300">
                <li>• تفتح كورس، تتحمّس يومين، وتسيبه بعد ٣ أيام</li>
                <li>• تحفظ فيديوهات وبوستات كتير وماتنفّذش سطر واحد</li>
                <li>• تشوف زمايلك بيتعلموا أدوات المستقبل وإنت واقف مكانك</li>
                <li>• بعد سنة تلاقي نفسك بنفس الدخل ونفس التشتت</li>
              </ul>
            </div>

            <div className="gain-card border-teal-200/80 bg-teal-50/50 dark:bg-teal-950/20 p-5 rounded-2xl border">
              <p className="text-xs font-bold text-teal-800 dark:text-teal-300 mb-3 flex items-center gap-1.5">
                <span>😊</span>
                <span>مع {brand.name} ومنظومة الـ 100 مسار:</span>
              </p>
              <ul className="space-y-2 text-xs leading-relaxed text-teal-900 dark:text-teal-200">
                <li>• ٥ إلى ١٥ دقيقة يوميًا — جرعة خفيفة تضمن استمرارك للأبد</li>
                <li>• مهمة عملية وتطبيق مباشر بكل درس بدون حشو نظري</li>
                <li>• دعم نفسي متواصل (بومودورو، نغمات ألفا، وتجميد السلسلة)</li>
                <li>• ١٠٠ مسار تفتح لك أبواب الدخل الحر والترقي الوظيفي ومشاريع خاصة</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- 5. COMMUNITY OF 300+ MEMBERS ---------- */}
        <section className="mb-16">
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-gradient-to-br from-white to-teal-50/30 dark:from-neutral-900 dark:to-neutral-950 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                  شبكة حقيقية ومصداقية كاملة
                </span>
                <h2 className="mt-3 text-2xl font-black md:text-3xl">
                  أكثر من ٣٠٠ عضو حقيقي وقصص نجاح موثقة
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  انضم إلى مجتمع نشط من المطورين، الفريلانسرز، رواد الأعمال، والطلبة من كافة العواصم العربية.
                </p>
              </div>

              <Link
                href="/community"
                className="cta-ghost shrink-0 px-6 py-3 text-xs font-bold rounded-full border border-teal-500/30 hover:bg-teal-500/10 transition"
              >
                شاهد حائط المجتمع (٣٠٠+ عضو) ←
              </Link>
            </div>

            {/* Testimonials snippet */}
            <Testimonials />
          </div>
        </section>

        {/* ---------- 6. THE PRICE, ANCHORED & HONEST ---------- */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-block bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 mb-3">
            عرض فوج التأسيس الأول · خصم 71%
          </span>
          <h2 className="text-2xl font-black md:text-3xl mb-2">
            ٣٤٩ جنيه فقط. دفعة واحدة مدى الحياة.
          </h2>
          <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-neutral-500">
            مش اشتراك شهري ولا تجديد دوري. تدفع مرة واحدة وتفتح لك كل الـ ١٠٠ مسار وكل التحديثات القادمة مجانًا للأبد.
          </p>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {comparisons.map((c) => (
              <div
                key={c.label}
                className={`rounded-2xl p-4 border text-center transition ${
                  c.ours
                    ? "border-brand-500 bg-brand-500/10 dark:bg-brand-950/40 shadow-sm ring-1 ring-brand-500/30"
                    : "border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900"
                }`}
              >
                <span className="mb-2 block text-3xl" aria-hidden>
                  {c.icon}
                </span>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{c.label}</p>
                <p className="mt-1 text-xs text-neutral-500">{c.note}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border-2 border-brand-500 bg-white dark:bg-neutral-900 p-6 md:p-8 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
              وفرت 850 ج.م
            </div>

            <p className="mb-1 text-xs font-bold tracking-wide text-brand-700 dark:text-brand-400">
              {pricing.offerNote}
            </p>

            <div className="my-3 flex items-baseline justify-center gap-3">
              <span className="text-xl text-neutral-400 line-through font-bold">
                {pricing.originalPriceEgp} ج.م
              </span>
              <span className="text-5xl font-black text-brand-700 dark:text-brand-300 tracking-tight">
                {pricing.priceEgp}
              </span>
              <span className="text-base font-bold text-neutral-700 dark:text-neutral-300">ج.م</span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-brand-50 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <span>🔥</span>
              <span>باقي <b>{pricing.cohortSeatsRemaining} مقعدًا فقط</b> بهذا السعر الاستثنائي</span>
            </div>

            <p className="mb-4 text-xs text-neutral-500">
              أقل من ٢٥ قرشًا للدرس الواحد — لـ ١٠٠ مسار و{totalLessons}+ درس تطبيقي كامل
            </p>

            <p className="mb-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 p-3 text-xs leading-relaxed text-teal-900 dark:text-teal-200 border border-teal-200/50 dark:border-teal-800/40">
              <b>{referralsToBreakEven} أصحاب يشتركوا بلينكك = رجّعت اشتراكك بالكامل وزيادة!</b>{" "}
              عمولة {referral.commissionEgp} ج.م كاش عن كل مشترك، والسحب فوري من {referral.minPayoutEgp} ج.م.
            </p>

            <p className="mb-5 text-xs text-neutral-500">
              وصول مدى الحياة · كل الـ ١٠٠ مسار · محتوى عربي وإنجليزي · ضمان استرداد كامل خلال ١٤ يومًا
            </p>

            <Link href="/quiz" className="cta-buy w-full py-4 text-sm font-bold shadow-lg hover:scale-102 transition block text-center">
              <span>انضم الآن واحجز مقعدك بـ {pricing.priceEgp} ج.م فقط ←</span>
            </Link>

            <p className="cta-note mt-3 text-xs text-neutral-400">
              اليوم الأول من كل مسار مفتوح مجانًا بالكامل — جرّب قبل ما تدفع أي حاجة
            </p>
          </div>
        </div>

        {/* ---------- 7. OBJECTIONS HANDLING ---------- */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-xl font-black md:text-2xl">
            «متردد لسه؟ إجابات على أسئلتك قبل ما تبدأ»
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: "⏳",
                title: "مش فاضي خالص؟",
                body: "٥ دقائق في اليوم. وقت أقل من اللي بتقضيه في تقليب الفيديوهات على السرير قبل النوم.",
              },
              {
                icon: "🤷",
                title: "خايف ما تكمّلش؟",
                body: "عشان كده صممنا أدوات الدعم النفسي ونظام تجميد السلسلة — المسار بيراعي نفسيتك وظروفك مش بيضغط عليك.",
              },
              {
                icon: "🧑‍💻",
                title: "مش تقني ومعندكش خبرة؟",
                body: "كل المسارات بتبدأ من الصفر تمامًا بلغة عربية مبسطة وبدون أي أكواد معقدة.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
                <span className="mb-2 block text-2xl" aria-hidden>
                  {f.icon}
                </span>
                <p className="mb-1 text-sm font-bold text-neutral-900 dark:text-white">{f.title}</p>
                <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- 8. SHARE & CLOSING CTA ---------- */}
        <ShareInvite className="mx-auto mb-14 max-w-lg" />

        <div className="closing-cta rounded-3xl bg-gradient-to-r from-brand-700 via-brand-800 to-teal-900 p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />
          <h2 className="mb-3 text-2xl font-black md:text-4xl">أنهي يوم هتبدأ؟</h2>
          <p className="mx-auto mb-8 max-w-lg text-sm text-teal-100 leading-relaxed">
            كل يوم بتأجّل فيه هو يوم كان ممكن تخلّص فيه مسارك الأول. الـ ١٠٠ مسار بانتظارك، واليوم الأول مفتوح مجانًا.
          </p>
          <Link href="/quiz" className="cta-buy px-10 py-4 text-sm font-bold shadow-lg hover:scale-105 transition inline-block">
            <span>ابدأ التقييم مجانًا الآن ←</span>
          </Link>
          <p className="mt-4 text-xs text-teal-200/80">دقيقتين فقط · خطة مخصصة لك فورًا · بدون بطاقة بنكية</p>
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-black/5 dark:border-white/10 pt-8 text-center">
          <p className="mb-4 text-xs leading-relaxed text-neutral-500">
            محتاج مساعدة أو استفسار؟ تواصل معنا مباشرة عبر واتساب:{" "}
            <a href={`https://wa.me/2${payment.supportWhatsapp}`} className="font-bold text-brand-600 hover:underline" dir="ltr">
              {payment.supportWhatsapp}
            </a>{" "}
            أو عبر الإيميل: {payment.supportEmail}
          </p>
          <SocialLinks className="justify-center" />
          <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-500">
            <Link href="/about" className="hover:text-brand-600 transition">من نحن</Link>
            <Link href="/tracks" className="hover:text-brand-600 transition">الـ 100 مسار</Link>
            <Link href="/community" className="hover:text-brand-600 transition">المجتمع</Link>
            <Link href="/hub" className="hover:text-brand-600 transition">المقالات والمعرفة</Link>
            <Link href="/terms" className="hover:text-brand-600 transition">الشروط والأحكام</Link>
            <Link href="/privacy" className="hover:text-brand-600 transition">سياسة الخصوصية</Link>
            <Link href="/refund" className="hover:text-brand-600 transition">سياسة الاسترجاع</Link>
          </nav>
          <p className="mt-5 text-xs text-neutral-400">
            {brand.name}
            <span className="text-teal-600">.com</span> · جميع الحقوق محفوظة {new Date().getFullYear()} ©
          </p>
        </footer>
      </main>

      <ExitIntentPrompt />
    </div>
  );
}
