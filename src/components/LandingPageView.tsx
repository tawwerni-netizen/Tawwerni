"use client";

import Link from "next/link";
import { brand, pricing, payment, referral, referralsToBreakEven } from "@/content/brand";
import { ALL_100_TRACKS, TRACK_PILLARS } from "@/content/tracks100";
import { LogoLink } from "@/components/Logo";
import LiveSeats from "@/components/LiveSeats";
import SocialLinks from "@/components/SocialLinks";
import ShareInvite from "@/components/ShareInvite";
import ExitIntentPrompt from "@/components/ExitIntentPrompt";
import Testimonials from "@/components/Testimonials";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import TrackCardVisual from "@/components/TrackCardVisual";
import FocusPlayer from "@/components/FocusPlayer";
import { useI18n } from "./LanguageContext";

export default function LandingPageView() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const totalLessons = ALL_100_TRACKS.reduce((s, t) => s + t.totalLessons, 0);

  // 6 featured tracks
  const featuredTracks = [
    ALL_100_TRACKS[0],  // ChatGPT & Prompting
    ALL_100_TRACKS[10], // Fullstack AI
    ALL_100_TRACKS[30], // Freelancing
    ALL_100_TRACKS[40], // Digital Marketing
    ALL_100_TRACKS[50], // UI/UX
    ALL_100_TRACKS[90], // Habits & Psychology
  ].filter(Boolean);

  const comparisons = isEn
    ? [
        { icon: "☕", label: "3 Specialty Coffees", note: "Consumed in an hour" },
        { icon: "🍔", label: "Takeout Meal for Two", note: "Gone in 30 minutes" },
        { icon: "🌟", label: `100 Tracks & ${totalLessons}+ Lessons`, note: "Continuous investment unlocking lifelong income", ours: true },
      ]
    : [
        { icon: "☕", label: "٣ قعدات قهوة", note: "تنتهي في ساعة واحدة" },
        { icon: "🍔", label: "وجبة سريعة لشخصين", note: "تنتهي في نصف ساعة" },
        { icon: "🌟", label: `١٠٠ مسار و${totalLessons}+ درس`, note: "استثمار دائم يفتح لك مصادر دخل مستمرة", ours: true },
      ];

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors"
    >
      {/* Floating Pomodoro & Binaural Beats Focus Tool */}
      <FocusPlayer />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <LogoLink size={34} href="/" />
            <Link
              href="/tracks"
              className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:opacity-80 transition-opacity hidden sm:inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full"
            >
              <span>🌟</span>
              <span>{isEn ? "100 Tracks" : "الـ 100 مسار"}</span>
            </Link>
            <Link
              href="/community"
              className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors hidden md:inline-flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-3 py-1.5 rounded-full"
            >
              <span>👥</span>
              <span>{isEn ? "Community (300+)" : "المجتمع (٣٠٠+)"}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/login"
              className="tap px-2.5 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
            >
              {isEn ? "Sign In" : "دخول"}
            </Link>
            <Link
              href="/quiz"
              className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold text-xs px-4 sm:px-5 py-2.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <span>{isEn ? "Start Free" : "ابدأ مجانًا"}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-16">
        {/* ---------- 1. HERO SECTION ---------- */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <Link
            href="/tracks"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-all hover:scale-105 shadow-2xs"
          >
            <span className="animate-pulse">✨</span>
            <span>
              {isEn
                ? "The Premier Bilingual Catalog: 100 Pro Tracks · Explore Now →"
                : "الكتالوج الأكبر عربيًا: ١٠٠ مسار احترافي ثنائي اللغة · تصفّح الآن ←"}
            </span>
          </Link>

          <h1 className="mb-4 text-3xl font-black leading-tight sm:text-5xl md:text-6xl tracking-tight text-neutral-900 dark:text-white">
            {isEn ? (
              <>
                5 Minutes a Day. 28 Days.
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  A Real High-Income Skill in AI & Future Tech.
                </span>
              </>
            ) : (
              <>
                ٥ دقائق في اليوم. ٢٨ يومًا.
                <br />
                <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  مهارة حقيقية تصنع لك دخلًا بالذكاء الاصطناعي والمستقبل.
                </span>
              </>
            )}
          </h1>

          <p className="mx-auto mb-5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-base">
            {isEn ? (
              <>
                <b>100 complete practical tracks</b> across 10 vital disciplines (AI, Web & App Development, Data Analytics, Freelancing, Business, Marketing, UI/UX, and more) — every single lesson is an actionable step backed by behavioral psychology and focus tools.
              </>
            ) : (
              <>
                <b>١٠٠ مسار تطبيقي كامل</b> مقسمة على ١٠ أركان حيوية (ذكاء اصطناعي، برمجة، بيانات، فريلانس، بيزنس، تسويق، تصميم، وأكثر) — كل درس خطوة عملية مدعومة بأنظمة الدعم النفسي والتركيز الذهني.
              </>
            )}
          </p>

          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 px-4 py-2 text-xs text-amber-800 dark:text-amber-300 font-bold">
            <span>🔥</span>
            <span>
              {isEn
                ? `Founding Cohort Offer: Only ${pricing.priceEgp} EGP (was ${pricing.originalPriceEgp} EGP) · 71% OFF · Lifetime Access · Day 1 Free`
                : `عرض فوج التأسيس الأول: ${pricing.priceEgp} ج.م فقط (بدل ${pricing.originalPriceEgp} ج.م) · خصم 71% · وصول مدى الحياة · اليوم الأول مجاني`}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/quiz"
              className="w-full sm:w-auto rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold px-8 py-4 text-sm shadow-lg hover:brightness-110 active:scale-98 transition-all text-center"
            >
              <span>{isEn ? "Take Free Assessment & Find Your Path →" : "ابدأ التقييم وحدد مسارك مجانًا ←"}</span>
            </Link>
            <Link
              href="/tracks"
              className="w-full sm:w-auto rounded-full border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900 px-7 py-4 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:border-teal-500 hover:shadow-md transition-all text-center"
            >
              {isEn ? "Explore 100 Tracks Catalog 🧭" : "استكشف كتالوج الـ 100 مسار 🧭"}
            </Link>
          </div>

          <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
            {isEn
              ? "✓ No credit card required · ✓ Day 1 of every track 100% free · ✓ Instant automated access"
              : "✓ بدون بطاقة بنكية · ✓ اليوم الأول من كل مسار مفتوح مجانًا · ✓ تفعيل فوري وآمن"}
          </p>
        </div>

        <div className="text-center mb-14">
          <LiveSeats />
        </div>

        {/* ---------- 2. PSYCHOLOGICAL ADVANTAGE SUITE ---------- */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/20">
              {isEn ? "Behavioral Psychology & Hyper-Learning" : "علم النفس السلوكي والتعلم الفائق"}
            </span>
            <h2 className="mt-3 text-2xl font-black md:text-3xl text-neutral-900 dark:text-white">
              {isEn
                ? "Why Tawwerni Succeeds Where Other Courses Fail"
                : "ليه طوّرني بتنجح مكان ما كورسات تانية بتفشل؟"}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {isEn
                ? "Engineered with micro-habits, dopamine reinforcement, and focus wave pacing to guarantee consistent daily momentum without burnout."
                : "صممنا المنصة على أساس هرمونات الدوبامين ونظرية الخطوات الميكرو اليومية لضمان استمرارك بدون إحباط أو تسويف."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-teal-500/20 bg-white dark:bg-neutral-900 p-5 shadow-xs hover:border-teal-500/40 hover:shadow-md transition">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-2xl">
                🧘‍♂️
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                {isEn ? "Focus & Flow Generator" : "مولّد التركيز الذهني"}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {isEn
                  ? "Integrated Pomodoro timer with alpha binaural beats engineered to trigger deep flow state and maximize retention."
                  : "مؤقت بومودورو مدمج مع نغمات ألفا ثنائية التردد للدخول في حالة التدفق الذهني ورفع الاستيعاب بنسبة 300%."}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-white dark:bg-neutral-900 p-5 shadow-xs hover:border-amber-500/40 hover:shadow-md transition">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-2xl">
                ⚡
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                {isEn ? "Streak Freeze Protection" : "تجميد السلسلة (Streak Freeze)"}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {isEn
                  ? "Smart safety valve protects your hard-earned streak if emergencies strike. Consistent progress becomes an effortless addiction."
                  : "حماية خاصة تمنع انكسار عزيمتك لو انشغلت يومًا طارئًا. نظام يحفز الدوبامين ويجعل التقدم اليومي إدمانًا إيجابيًا ممتعًا."}
              </p>
            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-white dark:bg-neutral-900 p-5 shadow-xs hover:border-purple-500/40 hover:shadow-md transition">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-2xl">
                🎭
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                {isEn ? "Daily Mood & Energy Pacing" : "فحص الطاقة والمزاج اليومي"}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {isEn
                  ? "Adapts lesson intensity based on your cognitive energy level, completely eliminating guilt and study fatigue."
                  : "يقيس جاهزيتك النفسية ويخصص وتيرة الدرس طبقًا لمستوى طاقتك لضمان عدم الشعور بالذنب أو الإرهاق."}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-500/20 bg-white dark:bg-neutral-900 p-5 shadow-xs hover:border-blue-500/40 hover:shadow-md transition">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-2xl">
                🤖
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                {isEn ? "AI Empathetic Coach 'Faheem'" : "كوتش الدعم النفسي «فهيم»"}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {isEn
                  ? "Interactive AI mentor trained to dismantle imposter syndrome and procrastination, keeping you moving forward."
                  : "ذكاء اصطناعي تفاعلي مدرب على معالجة متلازمة المحتال والتسويف، وتوجيهك خطوة بخطوة."}
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 3. THE 100 TRACKS SPOTLIGHT & 10 PILLARS ---------- */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div className="text-center sm:text-start">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                {isEn ? "The Comprehensive Curriculum" : "الكتالوج الشامل"}
              </span>
              <h2 className="mt-1 text-2xl font-black md:text-3xl text-neutral-900 dark:text-white">
                {isEn ? "100 Tracks Across 10 Vital Domains" : "١٠٠ مسار في ١٠ مجالات حيوية"}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {isEn
                  ? "Every track is fully bilingual (Arabic / English) with bite-sized infographics and immediate practice"
                  : "كل مسار ثنائي اللغة (عربي / إنجليزي) مع بطاقات معرفية مكثفة وتطبيق فوري"}
              </p>
            </div>
            <Link
              href="/tracks"
              className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-5 py-2.5 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 transition-all hover:scale-105"
            >
              <span>{isEn ? "Browse All 100 Tracks" : "تصفّح كل الـ 100 مسار"}</span>
              <span>→</span>
            </Link>
          </div>

          {/* 10 Pillars Badge Cloud */}
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {TRACK_PILLARS.map((p) => (
              <Link
                key={p.id}
                href={`/tracks?pillar=${p.id}`}
                className="group flex flex-col p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-teal-500/40 hover:shadow-md transition text-start"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl group-hover:scale-110 transition-transform">{p.icon}</span>
                  <span className="text-[10px] font-bold text-neutral-400 group-hover:text-teal-500">
                    {isEn ? "10 Tracks" : "10 مسارات"}
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-teal-600 transition-colors">
                  {isEn ? p.nameEn : p.nameAr}
                </p>
                <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                  {isEn ? p.nameAr : p.nameEn}
                </p>
              </Link>
            ))}
          </div>

          {/* 6 Featured Tracks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredTracks.map((track) => (
              <TrackCardVisual key={track.slug} track={track} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/tracks"
              className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold inline-flex items-center gap-2 px-8 py-3.5 text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-98 transition"
            >
              <span>
                {isEn
                  ? "Explore the Complete 100 Tracks Directory & Preview Day 1 →"
                  : "افتح دليل الـ 100 مسار بالكامل واكتشف مسارك المفضل ←"}
              </span>
            </Link>
          </div>
        </section>

        {/* ---------- 4. BEFORE & AFTER (LOSS AVERSION) ---------- */}
        <div className="mx-auto mb-16 max-w-3xl">
          <h2 className="mb-2 text-center text-xl font-black md:text-2xl text-neutral-900 dark:text-white">
            {isEn
              ? "Last year flew by. The next year will too."
              : "السنة الماضية مرت سريعًا. والشهور القادمة ستمر أيضًا."}
          </h2>
          <p className="mx-auto mb-7 max-w-lg text-center text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {isEn
              ? "The only question: Where will you stand? In the exact same spot, or owning future skills that transform your income?"
              : "السؤال الوحيد: أين ستكون حينها؟ في نفس المكان بنفس الدخل، أم متسلحًا بمهارات تغير مستقبلك المالي؟"}
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border border-red-500/20 bg-red-50/50 dark:bg-red-950/20 p-5 rounded-2xl">
              <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-1.5">
                <span>😟</span>
                <span>{isEn ? "Without a structured system:" : "بدون نظام وطريقة مدروسة:"}</span>
              </p>
              <ul className="space-y-2 text-xs leading-relaxed text-red-800 dark:text-red-300">
                <li>• {isEn ? "Start a long course, get motivated for 2 days, abandon it by day 3" : "تبدأ كورس طويل، تتحمس يومين، وتسيبه بعد ٣ أيام"}</li>
                <li>• {isEn ? "Bookmark dozens of tutorials without writing a single line of practice" : "تحفظ فيديوهات وبوستات كثيرة وما تنفذش تطبيق واحد"}</li>
                <li>• {isEn ? "Watch peers adopt new tech while your skill set stagnates" : "تشوف زملاءك بيتعلموا أدوات المستقبل وأنت واقف مكانك"}</li>
                <li>• {isEn ? "Find yourself in 12 months with the exact same income and overwhelm" : "بعد سنة تلاقي نفسك بنفس الدخل ونفس التشتت"}</li>
              </ul>
            </div>

            <div className="border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl">
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-1.5">
                <span>😊</span>
                <span>{isEn ? `With ${brand.name} & The 100 Tracks:` : `مع ${brand.name} ومنظومة الـ 100 مسار:`}</span>
              </p>
              <ul className="space-y-2 text-xs leading-relaxed text-emerald-900 dark:text-emerald-200">
                <li>• {isEn ? "5 to 15 minutes daily — guaranteed frictionless habit loop" : "٥ إلى ١٥ دقيقة يوميًا — جرعة خفيفة تضمن استمرارك للأبد"}</li>
                <li>• {isEn ? "Actionable micro-task in every lesson with zero fluff" : "مهمة عملية وتطبيق مباشر بكل درس بدون حشو نظري"}</li>
                <li>• {isEn ? "Integrated psychological support (Pomodoro, Alpha waves, Streak Freeze)" : "دعم نفسي متواصل (بومودورو، نغمات ألفا، وتجميد السلسلة)"}</li>
                <li>• {isEn ? "100 tracks opening doors to freelance income, promotion, and startups" : "١٠٠ مسار تفتح لك أبواب الدخل الحر والترقي ومشاريعك الخاصة"}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ---------- 5. COMMUNITY OF 300+ MEMBERS ---------- */}
        <section className="mb-16">
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/20">
                  {isEn ? "Authentic Network & Full Credibility" : "شبكة حقيقية ومصداقية كاملة"}
                </span>
                <h2 className="mt-3 text-2xl font-black md:text-3xl text-neutral-900 dark:text-white">
                  {isEn
                    ? "Over 300 Verified Members & Real Success Stories"
                    : "أكثر من ٣٠٠ عضو حقيقي وقصص نجاح موثقة"}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  {isEn
                    ? "Join an active community of engineers, freelancers, founders, and students across the Arab world."
                    : "انضم إلى مجتمع نشط من المطورين، الفريلانسرز، رواد الأعمال، والطلبة من كافة العواصم العربية."}
                </p>
              </div>

              <Link
                href="/community"
                className="shrink-0 px-6 py-3 text-xs font-bold rounded-full border border-teal-500/30 hover:bg-teal-500/10 text-teal-700 dark:text-teal-300 transition"
              >
                {isEn ? "View Community Wall (300+ Members) →" : "شاهد حائط المجتمع (٣٠٠+ عضو) ←"}
              </Link>
            </div>

            <Testimonials />
          </div>
        </section>

        {/* ---------- 6. THE HONEST PRICE, ANCHORED & TRANSPARENT ---------- */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-block bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-bold px-3.5 py-1 rounded-full border border-amber-500/30 mb-3">
            {isEn ? "Founding Cohort Offer · 71% OFF" : "عرض فوج التأسيس الأول · خصم 71%"}
          </span>
          <h2 className="text-2xl font-black md:text-3xl mb-2 text-neutral-900 dark:text-white">
            {isEn
              ? `Only ${pricing.priceEgp} EGP. One-Time Payment for Lifetime Access.`
              : `٣٤٩ جنيه فقط. دفعة واحدة مدى الحياة.`}
          </h2>
          <p className="mx-auto mb-7 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {isEn
              ? "Not a recurring monthly subscription. Pay once and unlock all 100 tracks plus future updates forever."
              : "مش اشتراك شهري ولا تجديد دوري. تدفع مرة واحدة وتفتح لك كل الـ ١٠٠ مسار وكل التحديثات القادمة مجانًا للأبد."}
          </p>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {comparisons.map((c) => (
              <div
                key={c.label}
                className={`rounded-2xl p-4 border text-center transition ${
                  c.ours
                    ? "border-teal-500 bg-teal-500/10 dark:bg-teal-950/40 shadow-xs ring-1 ring-teal-500/30"
                    : "border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900"
                }`}
              >
                <span className="mb-2 block text-3xl" aria-hidden>
                  {c.icon}
                </span>
                <p className="text-sm font-bold text-neutral-900 dark:text-white">{c.label}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{c.note}</p>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border-2 border-teal-500 bg-white dark:bg-neutral-900 p-6 md:p-8 shadow-xl text-center relative overflow-hidden">
            <div className={`absolute top-4 ${isEn ? "right-4" : "left-4"} bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-xs`}>
              {isEn ? "Saved 850 EGP" : "وفرت 850 ج.م"}
            </div>

            <p className="mb-1 text-xs font-bold tracking-wide text-teal-700 dark:text-teal-400">
              {isEn ? "Exclusive Founding Lifetime Access" : pricing.offerNote}
            </p>

            <div className="my-3 flex items-baseline justify-center gap-3 font-mono">
              <span className="text-xl text-neutral-400 line-through font-bold">
                {pricing.originalPriceEgp} {isEn ? "EGP" : "ج.م"}
              </span>
              <span className="text-5xl font-black text-teal-700 dark:text-teal-400 tracking-tight">
                {pricing.priceEgp}
              </span>
              <span className="text-base font-bold text-neutral-700 dark:text-neutral-300">
                {isEn ? "EGP" : "ج.م"}
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
              <span>🔥</span>
              <span>
                {isEn ? (
                  <>Only <b>{pricing.cohortSeatsRemaining} seats remaining</b> at this launch price</>
                ) : (
                  <>باقي <b>{pricing.cohortSeatsRemaining} مقعدًا فقط</b> بهذا السعر الاستثنائي</>
                )}
              </span>
            </div>

            <p className="mb-4 text-xs text-neutral-500 dark:text-neutral-400">
              {isEn
                ? `Less than 0.25 EGP per lesson — for all 100 tracks and ${totalLessons}+ actionable lessons`
                : `أقل من ٢٥ قرشًا للدرس الواحد — لـ ١٠٠ مسار و${totalLessons}+ درس تطبيقي كامل`}
            </p>

            <p className="mb-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 p-3.5 text-xs leading-relaxed text-teal-900 dark:text-teal-200 border border-teal-200/50 dark:border-teal-800/40">
              {isEn ? (
                <>
                  <b>Refer 3 friends with your link = 100% investment returned + profit!</b>{" "}
                  Earn {referral.commissionEgp} EGP cash on each friend, with instant withdrawal from {referral.minPayoutEgp} EGP.
                </>
              ) : (
                <>
                  <b>{referralsToBreakEven} أصدقاء يشتركون برابطك = استرجعت اشتراكك بالكامل وزيادة!</b>{" "}
                  عمولة {referral.commissionEgp} ج.م كاش عن كل مشترك، والسحب فوري من {referral.minPayoutEgp} ج.م.
                </>
              )}
            </p>

            <p className="mb-5 text-xs text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "Lifetime access · All 100 tracks · Arabic & English · 14-Day Money-Back Guarantee"
                : "وصول مدى الحياة · كل الـ ١٠٠ مسار · محتوى عربي وإنجليزي · ضمان استرداد كامل خلال ١٤ يومًا"}
            </p>

            <Link
              href="/quiz"
              className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold w-full py-4 text-sm shadow-lg hover:brightness-110 active:scale-98 transition block text-center"
            >
              <span>
                {isEn
                  ? `Enroll Now & Claim Seat for Only ${pricing.priceEgp} EGP →`
                  : `انضم الآن واحجز مقعدك بـ ${pricing.priceEgp} ج.م فقط ←`}
              </span>
            </Link>

            <p className="mt-3 text-xs text-neutral-400">
              {isEn
                ? "Day 1 of every track is 100% open and free — try it before paying anything"
                : "اليوم الأول من كل مسار مفتوح مجانًا بالكامل — جرّب قبل ما تدفع أي حاجة"}
            </p>
          </div>
        </div>

        {/* ---------- 7. OBJECTIONS HANDLING ---------- */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-xl font-black md:text-2xl text-neutral-900 dark:text-white">
            {isEn ? "Still on the Fence? Common Questions Answered" : "«متردد لسه؟ إجابات على أسئلتك قبل ما تبدأ»"}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: "⏳",
                title: isEn ? "Super Busy with No Time?" : "مش فاضي خالص؟",
                body: isEn
                  ? "5 to 15 minutes a day. Less time than you spend scrolling videos in bed before sleeping."
                  : "٥ إلى ١٥ دقيقة في اليوم. وقت أقل من اللي بتقضيه في تقليب الفيديوهات على السرير قبل النوم.",
              },
              {
                icon: "🤷",
                title: isEn ? "Worried You Won't Finish?" : "خايف ما تكمّلش؟",
                body: isEn
                  ? "That's why we built psychological tools and streak protection — designed to adapt to your life, not burden you."
                  : "عشان كده صممنا أدوات الدعم النفسي ونظام تجميد السلسلة — المسار بيراعي نفسيتك وظروفك مش بيضغط عليك.",
              },
              {
                icon: "🧑‍💻",
                title: isEn ? "Not Technical / No Experience?" : "مش تقني ومعندكش خبرة؟",
                body: isEn
                  ? "All tracks start from complete absolute zero with crystal-clear steps and zero complex prerequisites."
                  : "كل المسارات بتبدأ من الصفر تمامًا بلغة عربية مبسطة وبدون أي أكواد معقدة.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs"
              >
                <span className="mb-2 block text-2xl" aria-hidden>
                  {f.icon}
                </span>
                <p className="mb-1 text-sm font-bold text-neutral-900 dark:text-white">{f.title}</p>
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- 8. SHARE & CLOSING CTA ---------- */}
        <ShareInvite className="mx-auto mb-14 max-w-lg" />

        <div className="rounded-3xl bg-gradient-to-r from-teal-800 via-teal-900 to-neutral-950 p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />
          <h2 className="mb-3 text-2xl font-black md:text-4xl">
            {isEn ? "Which Day Will You Start?" : "أنهي يوم هتبدأ؟"}
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-xs sm:text-sm text-teal-100 leading-relaxed">
            {isEn
              ? "Every day delayed is a day you could have completed your first track. 100 tracks are ready for you, and Day 1 is completely free."
              : "كل يوم بتأجّل فيه هو يوم كان ممكن تخلّص فيه مسارك الأول. الـ ١٠٠ مسار بانتظارك، واليوم الأول مفتوح مجانًا."}
          </p>
          <Link
            href="/quiz"
            className="rounded-full bg-white text-teal-900 font-bold px-10 py-4 text-xs sm:text-sm shadow-lg hover:bg-neutral-100 active:scale-95 transition inline-block"
          >
            <span>{isEn ? "Start Free Assessment Now →" : "ابدأ التقييم مجانًا الآن ←"}</span>
          </Link>
          <p className="mt-4 text-xs text-teal-200/80">
            {isEn
              ? "Just 2 minutes · Personalized roadmap · No credit card required"
              : "دقيقتان فقط · خطة مخصصة لك فورًا · بدون بطاقة بنكية"}
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-black/5 dark:border-white/10 pt-8 text-center">
          <p className="mb-4 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {isEn ? "Need assistance or have questions? Chat directly on WhatsApp: " : "محتاج مساعدة أو استفسار؟ تواصل معنا مباشرة عبر واتساب: "}
            <a
              href={`https://wa.me/2${payment.supportWhatsapp}`}
              className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
              dir="ltr"
            >
              +{payment.supportWhatsapp}
            </a>{" "}
            {isEn ? "or email: " : "أو عبر الإيميل: "}
            <span className="font-mono">{payment.supportEmail}</span>
          </p>
          <SocialLinks className="justify-center" />
          <nav className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-500 dark:text-neutral-400">
            <Link href="/about" className="hover:text-teal-600 transition">{isEn ? "About Us" : "من نحن"}</Link>
            <Link href="/tracks" className="hover:text-teal-600 transition">{isEn ? "100 Tracks" : "الـ 100 مسار"}</Link>
            <Link href="/community" className="hover:text-teal-600 transition">{isEn ? "Community" : "المجتمع"}</Link>
            <Link href="/terms" className="hover:text-teal-600 transition">{isEn ? "Terms" : "الشروط والأحكام"}</Link>
            <Link href="/privacy" className="hover:text-teal-600 transition">{isEn ? "Privacy" : "سياسة الخصوصية"}</Link>
            <Link href="/refund" className="hover:text-teal-600 transition">{isEn ? "Refund Policy" : "سياسة الاسترجاع"}</Link>
          </nav>
          <p className="mt-5 text-xs text-neutral-400">
            {brand.name}
            <span className="text-teal-600">.com</span> · {isEn ? `All Rights Reserved ${new Date().getFullYear()} ©` : `جميع الحقوق محفوظة ${new Date().getFullYear()} ©`}
          </p>
        </footer>
      </main>

      <ExitIntentPrompt />
    </div>
  );
}
