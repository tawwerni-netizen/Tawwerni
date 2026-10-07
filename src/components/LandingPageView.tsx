"use client";

import Link from "next/link";
import { brand, pricing, payment, referral, referralsToBreakEven } from "@/content/brand";
import { ALL_100_TRACKS, TRACK_PILLARS } from "@/content/tracks100";
import { CAREER_PATHS } from "@/content/career-paths";
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
import InteractiveDopaminePreview from "@/components/InteractiveDopaminePreview";
import { useI18n } from "./LanguageContext";
import { resolveDomainTheme } from "@/lib/design-system/domain-themes";

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
      className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-[#070e0c] text-neutral-900 dark:text-neutral-100 transition-colors selection:bg-teal-500 selection:text-white"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 dark:bg-teal-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[30%] -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-[140px]" />

      {/* Floating Pomodoro & Binaural Beats Focus Tool */}
      <FocusPlayer />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <LogoLink size={34} href="/" />
            <Link
              href="/career-paths"
              className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:opacity-80 transition-opacity hidden sm:inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 rounded-full"
            >
              <span>🧭</span>
              <span>{isEn ? "Career Paths" : "المسارات المهنية"}</span>
            </Link>
            <Link
              href="/tracks"
              className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 transition-all hidden sm:inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-full shadow-xs"
            >
              <span>🌟</span>
              <span>{isEn ? "100 Tracks" : "الـ 100 مسار"}</span>
            </Link>
            <Link
              href="/community"
              className="text-xs font-bold text-indigo-800 dark:text-indigo-300 hover:bg-indigo-500/20 transition-all hidden md:inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/25 px-3 py-1.5 rounded-full shadow-xs"
            >
              <span>👥</span>
              <span>{isEn ? "Community (300+)" : "المجتمع (٣٠٠+)"}</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/login"
              className="tap px-2 sm:px-2.5 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors shrink-0"
            >
              {isEn ? "Sign In" : "دخول"}
            </Link>
            <Link
              href="/quiz"
              className="whitespace-nowrap shrink-0 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-black text-xs px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <span>{isEn ? "Start Free" : "ابدأ مجانًا"}</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 pb-16">
        {/* ---------- 1. HERO SECTION ---------- */}
        <div className="relative mx-auto mb-16 max-w-4xl text-center">
          {/* Radiant Hero Glow Spotlight */}
          <div className="pointer-events-none absolute left-1/2 -top-16 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-b from-teal-500/25 via-emerald-500/10 to-transparent blur-3xl -z-10" />

          {/* Focused Positioning Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300 shadow-xs">
            <span>🎯</span>
            <span>
              {isEn
                ? "The Guided Daily Learning System for In-Demand Skills"
                : "منظومة التعلم اليومي الموجه لتحويل مهارات المستقبل إلى دخل"}
            </span>
          </div>

          {/* High-Impact Problem & Outcome Headline */}
          <h1 className="mb-6 text-3xl sm:text-5xl md:text-6xl font-black leading-[1.2] tracking-tight text-neutral-900 dark:text-white">
            {isEn ? (
              <>
                Your problem isn&apos;t learning.
                <br />
                <span className="text-teal-600 dark:text-emerald-400">
                  It&apos;s knowing where to start and how to stay consistent.
                </span>
              </>
            ) : (
              <>
                مشكلتك مش إنك مش بتتعلم.
                <br />
                <span className="text-teal-600 dark:text-emerald-400">
                  مشكلتك إنك مش عارف تبدأ منين وتستمر إزاي.
                </span>
              </>
            )}
          </h1>

          {/* Calm, Direct Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-base sm:text-xl leading-relaxed text-neutral-600 dark:text-neutral-300 font-medium">
            {isEn ? (
              <>
                Tawwerni turns your career goal into a <b>28-day practical execution plan</b> — just <b>10 minutes daily</b> with hands-on missions and zero theoretical fluff.
              </>
            ) : (
              <>
                طوّرني يحوّل هدفك المهني إلى <b>خطة تعلم عملية لمدة ٢٨ يومًا</b> — <b>١٠ دقائق يوميًا فقط</b> بمهام تطبيقية مباشرة وبدون حشو نظري.
              </>
            )}
          </p>

          {/* Primary Action Button + Reassuring Microcopy */}
          <div className="flex flex-col items-center justify-center gap-3 mb-8">
            <Link
              href="/quiz"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-white font-black px-10 py-4.5 text-base sm:text-lg shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-102 active:scale-98 transition-all text-center"
            >
              <span>🧭</span>
              <span>{isEn ? "Discover Your Custom Path (Free) →" : "اعرف مسارك المناسب مجانًا ←"}</span>
            </Link>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>
                {isEn
                  ? "Takes only 60 seconds · No credit card required · Day 1 is 100% free"
                  : "خلال 60 ثانية فقط · بدون أي بطاقة بنكية · اليوم الأول مجاني بالكامل"}
              </span>
            </p>
          </div>

          {/* 3 Pillars of Frictionless Reassurance */}
          <div className="mx-auto max-w-xl grid grid-cols-3 gap-2.5 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-8">
            <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-2xs">
              <span className="block text-lg mb-1">⏱️</span>
              <span>{isEn ? "10 Mins / Day" : "١٠ دقائق يوميًا"}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-2xs">
              <span className="block text-lg mb-1">🛠️</span>
              <span>{isEn ? "Hands-On Mission" : "مهمة عملية بكل درس"}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 shadow-2xs">
              <span className="block text-lg mb-1">👑</span>
              <span>{isEn ? "Lifetime Access" : "ملكية دائمة مدى الحياة"}</span>
            </div>
          </div>

          {/* 3-Tier Time Hierarchy Clarification */}
          <div className="mx-auto max-w-3xl mb-12 p-4 sm:p-5 rounded-3xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-teal-500/20 backdrop-blur-md">
            <div className="text-center mb-3.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 dark:text-teal-300">
                {isEn ? "How Structured Learning Works on Tawwerni · No Burnout, No Guesswork" : "هيكل التعلّم والتطبيق على طوّرني · بدون إرهاق وبدون تشتت"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-start">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950/70 border border-black/5 dark:border-white/10 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300 font-black text-xs font-mono">1</span>
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white">
                    {isEn ? "Daily Micro-Mission" : "الجرعة اليومية"}
                  </h4>
                </div>
                <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mb-1">
                  {isEn ? "10–15 Mins / Day" : "١٠ إلى ١٥ دقيقة يوميًا"}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {isEn ? "A focused concept + actionable task to build an atomic habit without study fatigue." : "فكرة مركزة + تطبيق عملي مباشر لبناء عادة الاستمرار دون انقطاع أو تسويف."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950/70 border border-black/5 dark:border-white/10 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300 font-black text-xs font-mono">2</span>
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white">
                    {isEn ? "28-Day Track Challenge" : "تحدي المسار (٢٨ يومًا)"}
                  </h4>
                </div>
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1">
                  {isEn ? "1 Focused Skill / Month" : "إتقان أداة أو مهارة محددة"}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {isEn ? "Master one tool completely and graduate with a finished real-world project & QR certificate." : "تخرج من كل مسار بمشروع تطبيقي حقيقي في بورتفوليو أعمالك وشهادة إتمام رقمية."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-950/70 border border-black/5 dark:border-white/10 shadow-2xs">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 font-black text-xs font-mono">3</span>
                  <h4 className="text-xs font-black text-neutral-900 dark:text-white">
                    {isEn ? "Full Career Path" : "المسار المهني الكامل"}
                  </h4>
                </div>
                <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {isEn ? "48–60 Total Hours (4–8 Tracks)" : "٤٨ إلى ٦٠ ساعة (٤–٨ مسارات)"}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {isEn ? "A comprehensive roadmap taking you from complete beginner to career-ready professional." : "رحلة تراكمية مرتبة من الصفر تؤهلك لسوق العمل والوظائف أو الفريلانس الدولي."}
                </p>
              </div>
            </div>
          </div>

          {/* 3 Hero Acquisition Products Showcase */}
          <div className="text-start mt-8">
            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                {isEn ? "3 High-Demand Hero Paths" : "٣ مسارات بطلة تصنع الفارق في دخلك"}
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                {isEn ? "Where would you like to start your 28-day challenge?" : "تحب تبدأ تحدي الـ 28 يوم في أنهي مجال؟"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Hero 1: AI */}
              <div className="rounded-3xl border-2 border-teal-500/30 bg-white dark:bg-neutral-900 p-6 shadow-sm hover:shadow-md hover:border-teal-500/60 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">🤖</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/30">
                      {isEn ? "Highest Demand" : "الأعلى طلباً"}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white mb-2">
                    {isEn ? "AI & Workplace Automation" : "الذكاء الاصطناعي في بيئة العمل"}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {isEn
                      ? "Stop spending hours writing reports and emails. Master prompt engineering and AI tools to complete 80% of routine work in minutes."
                      : "توقف عن تضييع ساعات في كتابة التقارير والإيميلات. احترف أوامر الذكاء الاصطناعي وأدواته لإنجاز 80% من مهامك اليومية في دقائق."}
                  </p>
                </div>
                <Link
                  href="/quiz"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-bold border border-teal-500/30 transition"
                >
                  {isEn ? "Start AI Path Free →" : "ابدأ مسار الـ AI مجانًا ←"}
                </Link>
              </div>

              {/* Hero 2: Freelancing */}
              <div className="rounded-3xl border-2 border-amber-500/30 bg-white dark:bg-neutral-900 p-6 shadow-sm hover:shadow-md hover:border-amber-500/60 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">💼</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      {isEn ? "Direct Income" : "دخل مباشر"}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white mb-2">
                    {isEn ? "Freelancing: 0 to First Client" : "العمل الحر: من الصفر لأول عميل"}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {isEn
                      ? "Build an authentic micro-portfolio, write winning proposals on Upwork, and close your first paid gig with zero prior experience."
                      : "ابنِ معرض أعمال حقيقي، واكتب عروض عمل احترافية على منصات الفريلانس العالمية، واقتنص أول عميل مدفوع بدون خبرة سابقة معقدة."}
                  </p>
                </div>
                <Link
                  href="/quiz"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/30 transition"
                >
                  {isEn ? "Start Freelance Path Free →" : "ابدأ مسار الفريلانس مجانًا ←"}
                </Link>
              </div>

              {/* Hero 3: Growth Marketing */}
              <div className="rounded-3xl border-2 border-emerald-500/30 bg-white dark:bg-neutral-900 p-6 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">📈</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      {isEn ? "Business Growth" : "مبيعات ونمو"}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white mb-2">
                    {isEn ? "High-Converting Copy & Ads" : "التسويق الرقمي وكتابة الإعلانات"}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                    {isEn
                      ? "Learn to write persuasive copy that enters the buyer's subconscious mind and launch profitable paid ad campaigns on Meta."
                      : "تعلّم كيف تكتب نصوصاً إعلانية تقنع المشتري بمخاوفه الحقيقية وتطلق حملاتك الأولى على ميتا وتيك توك بدون هدر ميزانية."}
                  </p>
                </div>
                <Link
                  href="/quiz"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/30 transition"
                >
                  {isEn ? "Start Marketing Path Free →" : "ابدأ مسار التسويق مجانًا ←"}
                </Link>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "✨ Any path you choose includes Day 1 free. Own individual tracks for 50 EGP or complete Career Path bundles for 100 EGP with lifetime ownership."
                : "✨ أي مسار تختاره اليوم الأول فيه مجاني بالكامل. امتلك مسارك الفردي بـ 50 ج.م فقط أو المسار المهني الشامل بـ 100 ج.م بامتلاك دائم وبدون أي اشتراكات متكررة."}
            </p>
          </div>
        </div>

        {/* ---------- 1.5 WHY TAWWERNI VS CHATGPT, YOUTUBE & TRADITIONAL COURSES ---------- */}
        <section className="mb-16 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900/90 p-6 sm:p-10 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/20">
            {isEn ? "The True Unfair Advantage" : "الفارق الحقيقي في طوّرني"}
          </span>
          <h2 className="mt-3 text-2xl font-black md:text-3xl text-neutral-900 dark:text-white">
            {isEn
              ? "Why Tawwerni? (When ChatGPT & YouTube are Free)"
              : "ليه طوّرني؟ (طالما يوتيوب وChatGPT متاحين مجانًا)"}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
            {isEn
              ? "The internet doesn't lack information. It lacks direction, daily action, and a structured path that stops procrastination."
              : "المشكلة اليوم ليست نقص المعلومات؛ يوتيوب وChatGPT يملكون مليارات الإجابات. المشكلة هي: ماذا تتعلم أولاً؟ ماذا تطبق اليوم؟ وكيف تضمن أنك أنجزت؟"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-start">
            <div className="p-5 rounded-2xl border border-red-500/20 bg-red-50/40 dark:bg-red-950/20">
              <span className="text-2xl mb-2 block">📺</span>
              <h3 className="text-sm font-bold text-red-900 dark:text-red-300 mb-1">
                {isEn ? "YouTube & Free Tutorials" : "فيديوهات يوتيوب المجانية"}
              </h3>
              <p className="text-xs text-red-800/80 dark:text-red-300/80 leading-relaxed">
                {isEn
                  ? "Endless scattered playlists, zero structured accountability. You watch passively for hours, bookmark 50 videos, and build nothing."
                  : "محتوى مبعثر وغير مرتب وبدون متابعة. تقضي ساعات في المشاهدة السلبية، تحفظ 50 فيديو في المفضلة، ولا تبني مشروعًا واحدًا."}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-50/40 dark:bg-amber-950/20">
              <span className="text-2xl mb-2 block">🤖</span>
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">
                {isEn ? "ChatGPT & AI Alone" : "الاعتماد على ChatGPT فقط"}
              </h3>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
                {isEn
                  ? "Great at answering what you ask, but won't tell you what to ask next, how to structure your 28-day milestones, or test your real skill."
                  : "ممتاز في الإجابة عما تسأله، لكنه لن يحدد لك بالترتيب ماذا تدرس كل يوم، ولن يلزمك بمهمة عملية تقيس مستواك الحقيقي."}
              </p>
            </div>

            <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500/30">
              <span className="text-2xl mb-2 block">🎯</span>
              <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-200 mb-1">
                {isEn ? "Tawwerni Guided Engine" : "نظام طوّرني الموجه للنتائج"}
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                {isEn
                  ? "A battle-tested daily execution system: 10 mins a day · Exact mission to apply · Instant active feedback · Real portfolio outcome."
                  : "نظام تدريب تطبيقي موجه: ١٠ دقائق يوميًا · مهمة عملية محددة · تأكيد فوري للإنجاز · وتخرج في نهاية المسار بمشروع حقيقي يثري سيرتك."}
              </p>
            </div>
          </div>
        </section>

        {/* Interactive 30-Second Micro-Mission */}
        <InteractiveDopaminePreview />

        {/* ---------- 2. PSYCHOLOGICAL ADVANTAGE SUITE ---------- */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-500/10 px-3.5 py-1 rounded-full border border-teal-500/20">
              {isEn ? "Habit Science & Sustainable Momentum" : "علم العادات والاستمرارية المستدامة"}
            </span>
            <h2 className="mt-3 text-2xl font-black md:text-3xl text-neutral-900 dark:text-white">
              {isEn
                ? "Engineered for People Who Struggle to Finish Courses"
                : "مصمم لمن يجدون صعوبة في إكمال الكورسات الطويلة"}
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {isEn
                ? "Built on atomic habits and frictionless pacing to guarantee consistent daily progress without cognitive overload."
                : "نظام تدريب يومي قصير مبني على علم العادات الصغيرة (Atomic Habits) لضمان استمرارك يومًا بعد يوم دون تسويف أو انقطاع."}
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
                  ? "Integrated Pomodoro timer with alpha binaural beats engineered to trigger deep focus and lock in practical takeaways."
                  : "مؤقت بومودورو مدمج مع نغمات ألفا للتركيز الذهني العميق وتثبيت المهارة التطبيقية في دقائق معدودة."}
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
                  ? "Smart safety valve protects your progress if emergencies strike, allowing seamless resumption without guilt."
                  : "حماية تضمن استمرارية حماسك لو انشغلت يومًا طارئًا، لتستأنف تقدمك بسهولة وتراكم إنجازاتك."}
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
                {isEn ? "AI Empathetic Coach 'Faheem'" : "كوتش الدعم العملي «فهيم»"}
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                {isEn
                  ? "Interactive AI mentor trained to review your solutions and answer your technical questions instantly 24/7."
                  : "ذكاء اصطناعي تفاعلي مدرب على مراجعة مهامك العملية والإجابة على تساؤلاتك ومساعدتك خطوة بخطوة."}
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 2.9 CAREER PATHS ROADMAP SHOWCASE ---------- */}
        <section className="mb-20 rounded-3xl border-2 border-teal-500/30 bg-gradient-to-b from-teal-500/15 via-neutral-900/60 to-neutral-950 p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
              <div className="text-center sm:text-start max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/15 px-3.5 py-1 text-xs font-black text-teal-700 dark:text-teal-300 mb-2.5">
                  <span>🧭</span>
                  <span>{isEn ? "Goal-Driven Career Paths" : "المسارات المهنية المتكاملة"}</span>
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white leading-[1.3] tracking-tight">
                  {isEn ? "Stop Guessing Where to Start." : "لا تسأل: أي كورس أبدأ؟"}
                  <span className="block mt-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    {isEn ? "Choose Your Goal. Follow the Roadmap." : "حدد هدفك المهني، واتبع خارطة الطريق."}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed font-medium">
                  {isEn
                    ? "Step into sequenced roadmaps taking you from foundations to verified capstone projects that prove competence to clients and employers."
                    : "بدل التشتت بين 100 كورس، صممنا لك مسارات مرتبة على مراحل واقعية تنتهي ببناء بورتفوليو حقيقي يثبت مهارتك في سوق العمل."}
                </p>
              </div>

              <Link
                href="/career-paths"
                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-white font-black px-7 py-3.5 text-xs sm:text-sm shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
              >
                <span>{isEn ? "Explore All 12 Career Paths" : "استكشف كل المسارات المهنية الـ 12"}</span>
                <span>➔</span>
              </Link>
            </div>

            {/* Grid of 6 Featured Career Paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAREER_PATHS.slice(0, 6).map((cp) => (
                <div
                  key={cp.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/95 shadow-sm transition-all duration-300 hover:border-teal-500/50 hover:shadow-xl hover:-translate-y-1"
                >
                  {/* Card Cover Artwork */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={cp.coverImage}
                      alt={isEn ? cp.titleEn : cp.titleAr}
                      className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/30" />

                    {/* Top Badges - Spacious, Never Overflowing */}
                    <div className="absolute inset-x-3.5 top-3.5 flex items-center justify-between gap-2 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-1 text-2xs font-extrabold text-white shadow-sm shrink-0 whitespace-nowrap">
                        <span className="text-xs">{cp.icon}</span>
                        <span>{isEn ? cp.levelEn : (cp.levelAr || "كافة المستويات")}</span>
                      </span>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950/85 backdrop-blur-md border border-teal-500/40 px-2.5 py-1 text-2xs font-bold text-teal-300 shadow-sm whitespace-nowrap shrink-0">
                        <span>⏱️ {isEn ? `${cp.estimatedHours}h` : `${cp.estimatedHours} ساعة`}</span>
                      </span>
                    </div>

                    {/* Speech Bubble - Fully Legible */}
                    <div className="absolute inset-x-3 bottom-3 z-10">
                      <div className="inline-flex items-center gap-2 rounded-xl bg-neutral-950/90 backdrop-blur-md border border-teal-400/40 px-3 py-1.5 text-xs font-bold text-teal-200 shadow-md w-full">
                        <span className="text-xs shrink-0">💬</span>
                        <span className="leading-snug text-2xs sm:text-xs">
                          {isEn ? cp.goalPromptEn : cp.goalPromptAr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white group-hover:text-teal-400 transition-colors leading-snug">
                          {isEn ? cp.titleEn : cp.titleAr}
                        </h3>
                        <p className="text-2xs font-mono font-bold text-teal-600 dark:text-teal-400/90 mt-0.5">
                          {isEn ? cp.titleAr : cp.titleEn}
                        </p>
                      </div>

                      {/* Metadata Badges: Target Role + Track Count */}
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 text-2xs font-extrabold text-teal-800 dark:text-teal-300">
                          <span>💼</span>
                          <span>
                            {isEn ? `Role: ${cp.targetRoleEn}` : `الوظيفة: ${cp.targetRoleAr}`}
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 px-2 py-0.5 text-2xs font-bold text-neutral-700 dark:text-neutral-200">
                          <span>📚</span>
                          <span>
                            {isEn ? `${cp.stages.reduce((acc, s) => acc + s.tracks.length, 0)} Tracks` : `${cp.stages.reduce((acc, s) => acc + s.tracks.length, 0)} مسارات تدريبية`}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-2">
                        {isEn ? cp.taglineEn : cp.taglineAr}
                      </p>

                      {/* Mini Milestone Pathway Preview */}
                      <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                        {cp.stages.slice(0, 4).map((st, sIdx) => (
                          <div key={st.id} className="flex items-center gap-1">
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-md font-mono text-3xs font-black border ${
                                sIdx === 0
                                  ? "bg-teal-500/20 border-teal-400/40 text-teal-700 dark:text-teal-300"
                                  : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-neutral-500 dark:text-neutral-400"
                              }`}
                            >
                              0{sIdx + 1}
                            </span>
                            {sIdx < Math.min(cp.stages.length, 4) - 1 && (
                              <span className="text-3xs text-neutral-300 dark:text-neutral-600">➔</span>
                            )}
                          </div>
                        ))}
                        {cp.stages.length > 4 && (
                          <span className="text-3xs text-neutral-400 font-bold">+{cp.stages.length - 4}</span>
                        )}
                        <span className="ms-auto text-3xs font-extrabold text-teal-700 dark:text-teal-300">
                          {cp.stages.length} {isEn ? "milestones" : "مراحل متتالية"}
                        </span>
                      </div>

                      {/* Capstone Box */}
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-2xs">
                        <span className="font-extrabold text-amber-800 dark:text-amber-300 block mb-0.5">
                          🏆 {isEn ? "Capstone Deliverable:" : "المشروع الختامي للبورتفوليو:"}
                        </span>
                        <span className="text-neutral-700 dark:text-neutral-200 font-semibold leading-relaxed block">
                          {isEn ? cp.portfolioProjectEn : cp.portfolioProjectAr}
                        </span>
                      </div>
                    </div>

                    {/* High-Contrast Action Button */}
                    <div className="pt-3 border-t border-black/10 dark:border-white/10">
                      <Link
                        href={`/career-paths/${cp.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-white font-black text-xs py-3 px-4 shadow-md shadow-teal-500/20 hover:shadow-teal-500/35 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer text-center"
                      >
                        <span>{isEn ? "View Roadmap & Milestones" : "استعرض خارطة الطريق والمراحل"}</span>
                        <span>➔</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
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
            {TRACK_PILLARS.map((p) => {
              const theme = resolveDomainTheme({ pillarId: p.id });
              return (
                <Link
                  key={p.id}
                  href={`/tracks?pillar=${p.id}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${theme.palette.primary}66`;
                    e.currentTarget.style.boxShadow = `0 12px 28px -10px ${theme.palette.primary}33`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                  className="group flex flex-col p-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 transition-all text-start"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl group-hover:scale-110 transition-transform">{p.icon}</span>
                    <span
                      className="text-[10px] font-bold text-neutral-400 transition-colors"
                      style={{ color: undefined }}
                    >
                      {isEn ? "10 Tracks" : "10 مسارات"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white line-clamp-1 transition-colors">
                    {isEn ? p.nameEn : p.nameAr}
                  </p>
                  <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                    {isEn ? p.nameAr : p.nameEn}
                  </p>
                </Link>
              );
            })}
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

        {/* ---------- 3.5 ACCREDITED CERTIFICATES SHOWCASE ---------- */}
        <section className="mb-16">
          <div className="rounded-3xl border-2 border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-neutral-100/80 dark:via-neutral-900/60 to-emerald-500/10 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Text Side (7 cols) */}
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1 text-xs font-black text-amber-700 dark:text-amber-300 mb-4">
                  <span>🎓</span>
                  <span>{isEn ? "Career Credibility & Proof of Work" : "توثيق مهني رسمي يثبت كفاءتك للشركات"}</span>
                </span>

                <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 dark:text-white leading-tight tracking-tight">
                  {isEn ? (
                    <>
                      <span>Verified Certificates with Instant QR Code.</span>
                      <span className="block mt-2 text-amber-600 dark:text-amber-300 text-lg sm:text-2xl font-black">
                        100 Tracks = 100 Credentials for Your CV & LinkedIn.
                      </span>
                    </>
                  ) : (
                    <>
                      <span>شهادة إتمام رقمية موثقة بكود تحقق QR لكل مسار تنجزه.</span>
                      <span className="block mt-2 text-amber-600 dark:text-amber-300 text-lg sm:text-2xl font-black">
                        ١٠٠ مسار = ١٠٠ شهادة موثقة تثري سيرتك الذاتية و LinkedIn.
                      </span>
                    </>
                  )}
                </h2>

                <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                  {isEn
                    ? "Unlike platforms that charge extra hundreds for certificates or hand them out for passive video watching — every track on Tawwerni earns you a tamper-proof digital certificate backed by an official verification URL and real hands-on milestone completions."
                    : "على عكس المنصات التي تطلب مئات الدولارات الإضافية لكل شهادة أو تمنحها لمجرد المشاهدة الصامتة — كل مسار تنهيه في طوّرني يمنحك شهادة رقمية رسمية برابط تحقق دائم تثبت للعملاء وأصحاب العمل أنك نفذت التطبيقات العملية بيدك."}
                </p>

                {/* 4 Feature Cards */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-950/60 p-3.5">
                    <div className="flex items-center gap-2 font-black text-xs text-neutral-900 dark:text-white mb-1">
                      <span>📱</span>
                      <span>{isEn ? "Instant QR Verification" : "تحقق فوري بكاميرا الهاتف (QR)"}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {isEn ? "Employers scan the QR to see your authentic graduate record on tawwerni.com." : "أي عميل يمسح الكود يتأكد فوراً من سجلك الرسمي وتاريخ تخرجك بدون أي مجال للتزييف."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-950/60 p-3.5">
                    <div className="flex items-center gap-2 font-black text-xs text-neutral-900 dark:text-white mb-1">
                      <span>💼</span>
                      <span>{isEn ? "1-Click LinkedIn Integration" : "إضافة مباشرة لـ LinkedIn و CV"}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {isEn ? "Add to your Licenses & Certifications section in 1 click to attract recruiters." : "بنقرة واحدة تضاف إلى قسم الشهادات والتراخيص بملفك الشخصي لجذب مسؤولي التوظيف."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-950/60 p-3.5">
                    <div className="flex items-center gap-2 font-black text-xs text-neutral-900 dark:text-white mb-1">
                      <span>⚡</span>
                      <span>{isEn ? "Proof of Hands-On Work" : "إثبات تطبيقي وليس نظرياً"}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {isEn ? "Issued only after completing all daily challenges and quiz masteries." : "لا تصدر إلا بعد إنجاز كافة المهام التفاعلية والكويزات، مما يعطيها وزناً حقيقياً أمام العملاء."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-neutral-950/60 p-3.5">
                    <div className="flex items-center gap-2 font-black text-xs text-neutral-900 dark:text-white mb-1">
                      <span>🖨️</span>
                      <span>{isEn ? "Print-Ready Vector PDF" : "طباعة وتصدير عالي الدقة PDF"}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {isEn ? "Engineered with guilloche borders and print styles for physical portfolios." : "مهيأة للطباعة المباشرة بأبعاد عالية الدقة وبوردرات ملكية لملفك الورقي والمقابلات."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href="/quiz"
                    className="rounded-full bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-500 px-7 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-teal-500/20 hover:brightness-110 active:scale-95 transition-all"
                  >
                    {isEn ? "Start Your First Track Free →" : "ابدأ أول مسار لك مجانًا الآن ←"}
                  </Link>
                  <Link
                    href="/tracks"
                    className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-teal-600 dark:hover:text-teal-400 underline"
                  >
                    {isEn ? "Browse 100 Available Track Certificates →" : "استكشف الـ ١٠٠ مسار وشهاداتهم المتاحة ←"}
                  </Link>
                </div>
              </div>

              {/* Visual Certificate Card Mockup (5 cols) */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl border-2 border-amber-400/40 bg-gradient-to-b from-[#0e1a16] to-[#070d0c] p-5 sm:p-6 text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                  {/* Gold seal stamp */}
                  <div className="absolute top-4 end-4 text-3xl filter drop-shadow-md">
                    🎖️
                  </div>

                  {/* Header in Mockup */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">🚀</span>
                    <span className="text-sm font-black text-emerald-400 font-mono tracking-wider">
                      TAWWERNI.COM
                    </span>
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-amber-300/90 font-black mb-1">
                    {isEn ? "Certificate of Practical Completion" : "شهادة إتمام وتأهيل عملي موثقة"}
                  </p>

                  <div className="h-0.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-transparent my-2" />

                  <p className="text-[10px] text-neutral-400">{isEn ? "Presented to Graduate:" : "تُمنح للخريج المتميز:"}</p>
                  <p className="text-lg font-black text-white my-1">
                    {isEn ? "Sarah Mohamed Ibrahim" : "سارة محمد إبراهيم"}
                  </p>

                  <p className="text-[10px] text-neutral-400">{isEn ? "For completing all milestones in:" : "لإتمامها بنجاح كافة مشاريع مسار:"}</p>
                  <p className="text-xs font-black text-emerald-300 mb-4">
                    {isEn ? "AI Prompt Engineering & Business Automation" : "هندسة أوامر الذكاء الاصطناعي وأتمتة البيزنس"}
                  </p>

                  {/* Mockup stats */}
                  <div className="grid grid-cols-3 gap-1.5 bg-white/5 rounded-xl p-2.5 text-center text-[10px] mb-4 border border-white/5">
                    <div>
                      <p className="font-mono font-bold text-emerald-300 text-xs">28</p>
                      <p className="text-neutral-400 text-[9px]">{isEn ? "Lessons" : "درسًا"}</p>
                    </div>
                    <div>
                      <p className="font-mono font-bold text-amber-300 text-xs">1,400</p>
                      <p className="text-neutral-400 text-[9px]">XP</p>
                    </div>
                    <div>
                      <p className="font-mono font-bold text-teal-300 text-xs">98%</p>
                      <p className="text-neutral-400 text-[9px]">{isEn ? "Score" : "تقييم"}</p>
                    </div>
                  </div>

                  {/* Bottom Verification & QR */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[9px]">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-lg bg-white p-0.5 text-neutral-950 flex items-center justify-center font-mono font-black text-[9px]">
                        QR
                      </div>
                      <div>
                        <p className="font-bold text-white">ID: TW-AI2026-984</p>
                        <p className="text-emerald-400 font-mono">tawwerni.com/verify/...</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 font-bold border border-emerald-500/30">
                      ✓ {isEn ? "Verified" : "موثقة رسميًا"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
                <li>• {isEn ? "10 to 15 minutes daily — guaranteed frictionless habit loop" : "١٠ إلى ١٥ دقيقة يوميًا — جرعة خفيفة تضمن استمرارك دون انقطاع"}</li>
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

        {/* ---------- 5.5 SECRET 10,000 CORPORATE PROMPTS & LEGAL CONTRACTS VAULT ---------- */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-neutral-900 to-emerald-950/70 p-6 md:p-10 shadow-2xl shadow-amber-500/15">
            {/* Ambient Background Lights */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/25 via-yellow-500/30 to-amber-500/25 border-2 border-amber-400/80 shadow-lg shadow-amber-500/20 text-xs sm:text-sm font-black mb-4 backdrop-blur-md">
                <span className="text-base animate-pulse">👑</span>
                <span className="text-amber-100 font-black tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {isEn ? "Exclusive VIP Digital Vault" : "خزنة الـ VIP السرية للشركات والفريلانسرز"}
                </span>
                <span className="rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-black shadow-sm shrink-0">
                  +10,000 Prompts
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-3">
                {isEn
                  ? "Download the 10,000 Secret Corporate AI Prompts Bank + 5 Legal Freelance Contracts"
                  : "بنك الـ 10,000 برومبت السري للشركات + حزمة عقود الفريلانس القانونية"}
              </h2>

              <p className="text-xs sm:text-base text-neutral-200 leading-relaxed mb-6 max-w-2xl">
                {isEn
                  ? "An authentic indexed vault covering 100 enterprise domains × 100 copy-pasteable executive prompts + 5 ironclad bilingual contracts protecting your freelance fees and killing scope creep."
                  : "قاعدة بيانات مفهرسة تضم ١٠٠ مجال شركات متخصص × ١٠٠ برومبت تنفيذي جاهز للنسخ المباشر = ١٠,٠٠٠ أمر احترافي مطبق عملياً.. بالإضافة إلى ٥ عقود عمل حر ثنائية اللغة تحمي أتعابك قانونياً وتمنع المماطلة تماماً."}
              </p>

              {/* Sample Domain Pills Showcase */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {[
                  { icon: "🤖", ar: "هندسة الأوامر والوكلاء الذكية", en: "Prompt & AI Agent Systems" },
                  { icon: "📈", ar: "نمو المبيعات و الـ B2B Lead Gen", en: "B2B Sales & Outbound Growth" },
                  { icon: "⚖️", ar: "٥ عقود فريلانس تحمي أتعابك", en: "5 Ironclad Freelance Contracts" },
                  { icon: "🎯", ar: "الإعلانات والحملات الممولة", en: "Paid Ads & Media Buying" },
                  { icon: "💻", ar: "هندسة البرمجيات والـ Full Stack", en: "Full-Stack Development" },
                  { icon: "📊", ar: "تحليل البيانات والذكاء التجاري", en: "Data Analytics & BI" },
                  { icon: "🏢", ar: "+ ٩٤ مجالاً إضافياً مفهرساً", en: "+ 94 More Indexed Domains" },
                ].map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 border border-white/15 text-neutral-200 backdrop-blur-md shadow-2xs"
                  >
                    <span>{item.icon}</span>
                    <span>{isEn ? item.en : item.ar}</span>
                  </span>
                ))}
              </div>

              {/* High-Dopamine Giant Action Button */}
              <Link
                href="/quiz"
                className="btn-amber group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-12 py-3.5 sm:py-4.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black text-xs sm:text-lg shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-102 active:scale-98 transition-all"
              >
                <span className="text-2xl animate-bounce">📥</span>
                <span>
                  {isEn
                    ? "Download the 10,000 Prompts Vault & Contracts Pack →"
                    : "تحميل بنك الـ 10,000 برومبت السري للشركات + العقود ←"}
                </span>
                <span className="rounded-full bg-black/10 px-2.5 py-1 text-xs font-black">
                  {isEn ? "VIP Unlock" : "متاح للـ VIP"}
                </span>
              </Link>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-neutral-400 font-medium">
                <span className="flex items-center gap-1 text-emerald-400">
                  <span>✓</span>
                  <span>{isEn ? "One-click copy & open .txt download" : "نسخ مباشر وتحميل فوري بصيغة TXT"}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span>✓</span>
                  <span>{isEn ? "Bilingual Arabic & English" : "ثنائي اللغة بالكامل (عربي وإنجليزي)"}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span>✓</span>
                  <span>{isEn ? "Available optionally at checkout (+199 EGP)" : "متاح إضافته عند الاشتراك (+199 ج.م فقط)"}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 6. THE HONEST, CALM & TRANSPARENT 3-TIER PRICING ---------- */}
        <div className="mx-auto mb-16 max-w-6xl text-center">
          <span className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-800 dark:text-teal-300 text-xs font-black px-4 py-1.5 rounded-full border border-teal-500/30 mb-3">
            <span>✨</span>
            <span>{isEn ? "Transparent Ownership · Zero Recurring Subscriptions" : "ملكية واضحة · امتلاك دائم بدون اشتراكات متكررة"}</span>
          </span>
          <h2 className="text-2xl font-black md:text-3xl mb-2 text-neutral-900 dark:text-white">
            {isEn
              ? "Choose Your Path · Own It Forever"
              : "اختر ما تحتاجه بدقة · وامتلكه للأبد"}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {isEn
              ? "One-time payment per product with zero recurring monthly fees. Start with a focused skill track, unlock an entire career roadmap, or get the complete master key to all 100 courses."
              : "دفعة واحدة لمرة واحدة بدون أي اشتراكات شهرية متجددة أو رسوم خفية. ابدأ بمهارة محددة، أو امتلك مساراً مهنياً متكاملاً، أو احصل على المفتاح الشامل لكافة الـ 100 كورس."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            {/* Card 1: Individual Track (50 EGP) */}
            <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-lg flex flex-col justify-between relative">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-500/20 text-2xs font-black mb-3">
                  <span>🎯</span>
                  <span>{isEn ? "Individual Skill Track" : "مسار تخصصي فردي"}</span>
                </div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1">
                  {isEn ? "Single Track Access" : "امتلاك مسار تخصصي فردي"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 min-h-[32px]">
                  {isEn
                    ? "Master one specific in-demand skill with 28 daily missions and a verified portfolio project."
                    : "إتقان مهارة تخصصية محددة من الصفر حتى مشروع عملي جاهز للبورتفوليو."}
                </p>

                {/* Clean Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/50">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">
                      {pricing.trackPriceEgp}
                    </span>
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      {isEn ? "EGP" : "جنيه فقط"}
                    </span>
                  </div>
                  <div className="text-2xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1">
                    {isEn ? "One-time payment · Lifetime ownership" : "دفعة واحدة لمرة واحدة · امتلاك دائم مدى الحياة"}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 mb-6">
                  {[
                    isEn ? "Full 28-day actionable missions in your track" : "خطة الـ 28 يوماً العملية خطوة بخطوة في المسار المختار",
                    isEn ? "Hands-on micro-tasks with real output" : "مهام يومية تطبيقية تنتهي بمشروع عملي حقيقي",
                    isEn ? "Verified digital certificate with authentic QR link" : "شهادة إتمام رقمية معتمدة برابط رسمي وكود QR",
                    isEn ? "24/7 AI mentor (Faheem) reviewing your submissions" : "كوتش الذكاء الاصطناعي (فهيم) يتابعك ويراجع تطبيقاتك",
                    isEn ? "Day 1 100% free to try before paying" : "اليوم الأول مفتوح للتجربة العملية مجاناً بالكامل",
                    isEn ? "Upgradeable anytime: paid amount is credited" : "قابل للترقية في أي وقت: يُخصم ما دفعته من الباقات الأكبر",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-500 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href="/tracks"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 font-black text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-98 transition-all text-center"
                >
                  <span>
                    {isEn
                      ? `Browse Tracks (${pricing.trackPriceEgp} EGP) →`
                      : `استعرض المسارات التخصصية (${pricing.trackPriceEgp} ج.م) ←`}
                  </span>
                </Link>
                <div className="text-center mt-2 text-3xs text-neutral-400">
                  {isEn ? "Added to your permanent learning inventory" : "يضاف فوراً لمكتبتك التعليمية الدائمة"}
                </div>
              </div>
            </div>

            {/* Card 2: Complete Career Path (100 EGP) - Best Value */}
            <div className="rounded-3xl border-2 border-emerald-500 bg-white dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xl shadow-emerald-500/10 flex flex-col justify-between relative ring-2 ring-emerald-500/20 overflow-hidden">
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-emerald-500/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-teal-500/15 blur-3xl" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 text-2xs font-black mb-3">
                  <span>🌟</span>
                  <span>{isEn ? "Career Roadmap Bundle" : "المسار المهني الشامل"}</span>
                </div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1">
                  {isEn ? "Career Path Bundle" : "المسار المهني المتكامل"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 min-h-[32px]">
                  {isEn
                    ? "Full career roadmap unlocking all bundled tracks, multiple projects & credentials."
                    : "خارطة طريق وظيفية شاملة تفتح جميع المسارات التخصصية المندرجة تحتها."}
                </p>

                {/* Clean Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/30 border border-emerald-500/30">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      {pricing.careerPathPriceEgp}
                    </span>
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      {isEn ? "EGP" : "جنيه فقط"}
                    </span>
                  </div>
                  <div className="text-2xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {isEn ? "One-time payment · Unlocks ALL included tracks" : "دفعة واحدة لمرة واحدة · تفتح كافة المسارات المندرجة للأبد"}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 mb-6">
                  {[
                    isEn ? "Unlocks ALL 4 to 8 tracks inside this career path" : "فتح شامل لـ ٤ إلى ٨ مسارات تخصصية مندرجة في المسار",
                    isEn ? "Combined overall roadmap + per-track independent progress" : "خارطة شاملة ومتابعة دقيقة لتقدم المسار المهني والمسارات الفرعية",
                    isEn ? "Multi-project portfolio qualifying you for freelance & jobs" : "بورتفوليو مشاريع متكامل يؤهلك للعمل الحر والوظائف",
                    isEn ? "Verified digital certificates for each completed track" : "شهادات إتمام رقمية معتمدة بروابط وأكواد QR لكل مسار منجز",
                    isEn ? "24/7 AI mentor (Faheem) for personalized guidance" : "كوتش الذكاء الاصطناعي (فهيم) يرشدك في مسارك المهني 24/7",
                    isEn ? "Upgradeable to All-Access: paid amount credited" : "قابل للترقية للوصول الشامل في أي وقت بدفع الفارق فقط",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href="/career-paths"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:brightness-110 active:scale-98 transition-all text-center"
                >
                  <span>
                    {isEn
                      ? `Explore Career Paths (${pricing.careerPathPriceEgp} EGP) →`
                      : `استعرض المسارات المهنية (${pricing.careerPathPriceEgp} ج.م) ←`}
                  </span>
                </Link>
                <div className="text-center mt-2 text-3xs text-neutral-400">
                  {isEn ? "Best value for full career preparation" : "الخيار الأفضل لإتقان مهنة كاملة"}
                </div>
              </div>
            </div>

            {/* Card 3: All-Access Pass (350 EGP) - Complete Mastery */}
            <div className="rounded-3xl border-2 border-amber-400/50 bg-white dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xl shadow-amber-500/10 flex flex-col justify-between relative ring-2 ring-amber-400/20 overflow-hidden">
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-500/15 blur-3xl" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 text-2xs font-black mb-3">
                  <span>👑</span>
                  <span>{isEn ? "All-Access Master Key" : "الوصول الشامل الأقصى"}</span>
                </div>
                <h3 className="text-lg font-black text-neutral-900 dark:text-white mb-1">
                  {isEn ? "All-Access Pass" : "الوصول الشامل لكافة الكورسات"}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5 min-h-[32px]">
                  {isEn
                    ? "Unlocks all 100 tracks, all 11 career paths, and all future content additions."
                    : "المفتاح الكامل لجميع الـ 100 مسار تخصصي وكافة المسارات المهنية الـ 11 للأبد."}
                </p>

                {/* Clean Price Display */}
                <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-950/30 border border-amber-500/30">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-amber-500 dark:text-amber-400 font-mono">
                      {pricing.allAccessPriceEgp}
                    </span>
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      {isEn ? "EGP" : "جنيه فقط"}
                    </span>
                  </div>
                  <div className="text-2xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                    {isEn ? "One-time payment · Complete library lifetime access" : "دفعة واحدة لمرة واحدة · وصول شامل لجميع المحتويات مدى الحياة"}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 mb-6">
                  {[
                    isEn ? "Permanent access to ALL 100 specialized tracks" : "فتح فوري لكافة الـ 100 مسار تخصصي (2,800 مهمة وكويز)",
                    isEn ? "ALL 11 complete career paths & portfolio capstones" : "جميع المسارات المهنية الـ 11 ومشاريع البورتفوليو الكبرى",
                    isEn ? "Verified digital certificates with QR validation for all" : "شهادات إتمام معتمدة لجميع المسارات مع روابط التحقق الرسمية",
                    isEn ? "All future course launches and updates included free" : "جميع التحديثات والكورسات الجديدة مستقبلاً بدون أي رسوم",
                    isEn ? "10,000 Corporate AI Prompts Vault & Contracts included" : "قاعدة بيانات الـ 10,000 برومبت وعقود الفريلانس مشمولة",
                    isEn ? "Priority AI feedback and human support channel" : "أولوية عليا في المراجعة الذكية والدعم الفني المباشر",
                  ].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <Link
                  href="/quiz/checkout?type=all_access"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110 active:scale-98 transition-all text-center"
                >
                  <span>
                    {isEn
                      ? `Get All-Access Pass (${pricing.allAccessPriceEgp} EGP) →`
                      : `احصل على الوصول الشامل (${pricing.allAccessPriceEgp} ج.م) ←`}
                  </span>
                </Link>
                <div className="text-center mt-2 text-3xs text-neutral-400">
                  {isEn ? "The ultimate pass for serious learners & professionals" : "الخيار الأقصى للمتعلمين الجادين والباحثين عن التميز"}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
            {isEn
              ? "Try Day 1 hands-on in any track before you decide — zero risk, no credit card required"
              : "جرّب اليوم الأول عمليًا بيدك في أي مسار قبل أن تدفع أي شيء — لا نطلب أي بيانات بنكية"}
          </p>
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
                  ? "10 to 15 minutes a day. Less time than you spend scrolling videos in bed before sleeping."
                  : "١٠ إلى ١٥ دقيقة في اليوم. وقت أقل من اللي بتقضيه في تقليب الفيديوهات على السرير قبل النوم.",
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

        <div className="rounded-3xl bg-gradient-to-br from-neutral-900 via-teal-950 to-neutral-950 p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden border border-teal-500/30">
          {/* Ambient luminous glow effects */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-teal-400/20 blur-3xl" />

          {/* Top Floating Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-400/30 text-xs font-bold mb-5 shadow-xs">
            <span>✨</span>
            <span>
              {isEn
                ? "One Step Changes Everything · Day 1 Is 100% Free"
                : "خطوة واحدة تصنع فارقًا حقيقيًا · اليوم الأول مجانًا بالكامل"}
            </span>
          </div>

          <h2 className="mb-4 text-3xl font-black md:text-5xl tracking-tight leading-tight">
            {isEn ? (
              <>
                Which Day Will You{" "}
                <span className="text-emerald-400 font-black">
                  Start?
                </span>
              </>
            ) : (
              <>
                أنهي يوم{" "}
                <span className="text-emerald-400 font-black">
                  هتبدأ؟
                </span>
              </>
            )}
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            {isEn
              ? "Every day you delay is a day you could have completed your first track, built a real project, and acquired a high-income skill. 100 tracks are ready for you right now."
              : "كل يوم بتأجّل فيه هو يوم كان ممكن تخلّص فيه أول مسار لك، وتطبّق أول مشروع، وتكسب مهارة تفتح لك فرص دخل جديدة. الـ ١٠٠ مسار بانتظارك واليوم الأول متاح للتجربة فورًا."}
          </p>

          {/* Glowing High-Contrast CTA Button */}
          <Link
            href="/quiz"
            className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-neutral-950 font-black px-7 sm:px-10 py-3.5 sm:py-4.5 text-sm sm:text-base shadow-[0_0_35px_rgba(52,211,153,0.4)] hover:shadow-[0_0_50px_rgba(52,211,153,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 whitespace-nowrap shrink-0"
          >
            <span>{isEn ? "Start Free Assessment Now →" : "ابدأ التقييم مجانًا الآن ←"}</span>
            <span className="text-lg transition-transform group-hover:translate-x-1">🚀</span>
          </Link>

          {/* 3 Trust pillars */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-teal-200/90 font-medium">
            <span className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>{isEn ? "2 Minutes Only" : "دقيقتان فقط"}</span>
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5">
              <span>🎯</span>
              <span>{isEn ? "Personalized Roadmap" : "خطة مخصصة لك فورًا"}</span>
            </span>
            <span className="hidden sm:inline opacity-40">•</span>
            <span className="flex items-center gap-1.5">
              <span>🔒</span>
              <span>{isEn ? "No Credit Card Needed" : "بدون بطاقة بنكية وبدون مخاطرة"}</span>
            </span>
          </div>
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
            <Link href="/refund" className="hover:text-teal-600 transition">{isEn ? "Digital Goods Policy" : "سياسة المنتجات الرقمية"}</Link>
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
