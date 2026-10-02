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
import InteractiveDopaminePreview from "@/components/InteractiveDopaminePreview";
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

          {/* Top Announcement Pill */}
          <Link
            href="/tracks"
            className="group mb-6 inline-flex items-center gap-2 rounded-full bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 px-4 py-1.5 text-xs font-black text-teal-700 dark:text-teal-300 transition-all hover:scale-105 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>
              {isEn
                ? "⚡ The #1 Bilingual Hands-On Learning Platform · 100 Career Tracks →"
                : "⚡ المنصة الأولى عربياً للتعلم التطبيقي المباشر · الكتالوج الأضخم بـ 100 مسار احترافي ←"}
            </span>
          </Link>

          {/* High-Dopamine Punchy Headline */}
          <h1 className="mb-6 text-4xl sm:text-6xl md:text-7xl font-black leading-[1.14] tracking-tight text-neutral-900 dark:text-white">
            {isEn ? (
              <>
                Learn Smart. Apply in Minutes.
                <br />
                <span className="text-teal-600 dark:text-emerald-400 font-black">
                  Build Skills That Actually Pay in the AI Era.
                </span>
              </>
            ) : (
              <>
                تعلّم بذكاء. طبّق في دقائق.
                <br />
                <span className="text-teal-600 dark:text-emerald-400 font-black">
                  واصنع دخلك بمهارات المستقبل والذكاء الاصطناعي.
                </span>
              </>
            )}
          </h1>

          {/* Compelling Value Proposition Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 font-medium">
            {isEn ? (
              <>
                <b>100 practical career tracks</b> that take you from beginner to hired or freelancing — zero boring theory, engineered with micro-actions and dopamine loops that give you an instant sense of victory every single day.
              </>
            ) : (
              <>
                <b>١٠٠ مسار مهني وتطبيقي متكامل</b> ينقلك من الصفر حتى اقتناص الفرص والعملاء — بدون حشو نظري، وبنظام جرعات يومية سريعة تمنحك إنجازاً ملموساً وشعوراً فورياً بالانتصار والتفوق كل يوم.
              </>
            )}
          </p>

          {/* VIP Founding Cohort Offer Badge */}
          <div className="mx-auto mb-8 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 px-5 py-2.5 text-xs text-amber-900 dark:text-amber-200 font-black shadow-lg backdrop-blur-md">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span>
              {isEn
                ? `🔥 Founding Cohort Special: Only ${pricing.priceEgp} EGP/year (Regular ${pricing.originalPriceEgp} EGP) · 71% OFF · Unlimited 1-Year Access`
                : `🔥 عرض فوج التأسيس الأول: ${pricing.priceEgp} ج.م فقط لعام كامل (بدل ${pricing.originalPriceEgp} ج.م) · خصم 71% شامل كافة الـ 100 مسار`}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] font-bold border border-amber-500/30">
              {isEn ? "7-Day Guarantee" : "ضمان استرداد 7 أيام"}
            </span>
          </div>

          {/* Giant Radiant Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
            <Link
              href="/quiz"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-white font-black px-9 py-4 text-base shadow-xl shadow-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/50 hover:scale-102 active:scale-98 transition-all text-center"
            >
              <span className="text-xl">🚀</span>
              <span>{isEn ? "Take Free Assessment & Start Now →" : "ابدأ التقييم وحدد مسارك مجانًا ←"}</span>
            </Link>
            <Link
              href="/tracks"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-black/10 dark:border-white/15 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md hover:border-teal-500/50 px-8 py-4 text-base font-black text-neutral-800 dark:text-neutral-200 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-lg transition-all text-center"
            >
              <span>🧭</span>
              <span>{isEn ? "Explore 100 Tracks (Day 1 Free)" : "استكشف كتالوج الـ 100 مسار 🧭"}</span>
            </Link>
          </div>

          {/* Dopamine-Charged VIP Vault Quick Teaser */}
          <div className="mb-8 flex justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs font-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/10"
            >
              <span className="text-sm animate-bounce">👑</span>
              <span>
                {isEn
                  ? "Bonus: 10,000 Corporate Prompts Vault + Legal Contracts Ready for Instant Download"
                  : "بونص VIP حصري: بنك الـ 10,000 برومبت السري للشركات + عقود الفريلانس متاح للتحميل"}
              </span>
              <span className="rounded-md bg-amber-400 text-neutral-950 px-2 py-0.5 text-[10px] font-black shrink-0">
                {isEn ? "Claim Now →" : "احصل عليه ←"}
              </span>
            </Link>
          </div>

          {/* 4 Pillars of Peace of Mind & Trust */}
          <div className="mx-auto max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-10">
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span>🛡️</span>
              <span>{isEn ? "7-Day Guarantee" : "ضمان استرداد 7 أيام"}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span>🎁</span>
              <span>{isEn ? "Day 1 Free (No Card)" : "اليوم الأول مجاني بدون كارت"}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span>🎓</span>
              <span>{isEn ? "Verified Certificates" : "شهادة معتمدة لكل مسار"}</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
              <span>⚡</span>
              <span>{isEn ? "15 Mins / Day Only" : "١٥ دقيقة فقط يومياً"}</span>
            </div>
          </div>

          {/* Top In-Demand Sectors Quick Pills */}
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
              {isEn ? "Top In-Demand Career Tracks You Will Master" : "أبرز التخصصات العملية الأكثر طلباً التي ستحترفها بالمنصة"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { icon: "🤖", ar: "هندسة الأوامر والـ AI", en: "Prompt Engineering & AI" },
                { icon: "💻", ar: "البرمجة وتطوير الويب", en: "Full-Stack Web Dev" },
                { icon: "📊", ar: "تحليل البيانات والذكاء التجاري", en: "Data Analytics & BI" },
                { icon: "💼", ar: "العمل الحر واقتناص العملاء", en: "Freelance Mastery" },
                { icon: "📈", ar: "التسويق الرقمي والمبيعات", en: "Digital Growth & Marketing" },
                { icon: "🎨", ar: "تصميم الواجهات UI/UX", en: "UI/UX & Creative Media" },
                { icon: "🏢", ar: "ريادة الأعمال وبناء المشاريع", en: "Business & Startups" },
              ].map((pillar, idx) => (
                <Link
                  key={idx}
                  href="/tracks"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 hover:border-teal-500/50 hover:bg-teal-500/10 text-neutral-700 dark:text-neutral-300 hover:text-teal-600 dark:hover:text-teal-400 transition-all hover:scale-105 shadow-2xs"
                >
                  <span>{pillar.icon}</span>
                  <span>{isEn ? pillar.en : pillar.ar}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <LiveSeats />
        </div>

        {/* Interactive Dopamine 30-Second Micro-Mission */}
        <InteractiveDopaminePreview />

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
                      <span>شهادة إتمام معتمدة بكود تحقق QR لكل مسار تنجزه.</span>
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
                    {isEn ? "Certificate of Practical Completion" : "شهادة إتمام وتأهيل عملي معتمدة"}
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

        {/* ---------- 5.5 SECRET 10,000 CORPORATE PROMPTS & LEGAL CONTRACTS VAULT ---------- */}
        <section className="mb-16">
          <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-neutral-900 to-emerald-950/70 p-6 md:p-10 shadow-2xl shadow-amber-500/15">
            {/* Ambient Background Lights */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black mb-4">
                <span className="text-sm">👑</span>
                <span>
                  {isEn ? "Exclusive VIP Digital Vault" : "خزنة الـ VIP السرية للشركات والفريلانسرز"}
                </span>
                <span className="rounded-md bg-amber-400 text-neutral-950 px-2 py-0.5 text-[10px] font-black">
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
                className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-12 py-3.5 sm:py-4.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-neutral-950 font-black text-xs sm:text-lg shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 hover:scale-102 active:scale-98 transition-all"
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

        {/* ---------- 6. THE HONEST PRICE, ANCHORED & TRANSPARENT ---------- */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-md shadow-rose-500/25 border border-white/20 mb-3">
            <span className="text-yellow-200 animate-pulse text-[11px]">⚡</span>
            <span>{isEn ? "Founding Cohort Offer · 71% OFF" : "عرض فوج التأسيس الأول · خصم 71%"}</span>
          </span>
          <h2 className="text-2xl font-black md:text-3xl mb-2 text-neutral-900 dark:text-white">
            {isEn
              ? `Only ${pricing.priceEgp} EGP. One-Time Payment for 1-Year Access.`
              : `${pricing.priceEgp} جنيه فقط. دفعة واحدة لمدة سنة.`}
          </h2>
          <p className="mx-auto mb-7 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {isEn
              ? "Not a recurring monthly subscription. Pay once and unlock all 100 tracks plus future updates for a full year."
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

          <div className="rounded-3xl border-2 border-emerald-500/50 bg-white dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-10 shadow-2xl shadow-emerald-500/10 text-center relative overflow-hidden ring-1 ring-emerald-500/30">
            {/* Ambient luminous glow effects */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-60 h-60 rounded-full bg-emerald-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 w-60 h-60 rounded-full bg-teal-500/15 blur-3xl" />

            {/* Prominent VIP Discount Ribbon */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 text-white border border-white/20 text-xs font-black mb-4 shadow-md shadow-rose-500/25">
              <span>👑</span>
              <span>
                {isEn
                  ? "Exclusive Founding Cohort · Save 850 EGP (71% OFF)"
                  : "عرض فوج التأسيس الأول الحصري · وفّرت 850 ج.م (خصم 71%)"}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-1">
              {isEn ? "1-Year All-Access Pass to 100 Tracks" : "عضوية الوصول الشامل لمدة سنة لـ 100 مسار"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              {isEn
                ? "One-time investment · Zero recurring subscriptions · Future tracks included for a full year"
                : "دفعة واحدة فقط · بدون أي اشتراكات دورية أو تجديد شهري · كل التحديثات القادمة مجانًا للأبد"}
            </p>

            {/* Clear Separated Price Typography */}
            <div className="my-5 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/50 flex flex-col items-center justify-center">
              <div className="flex items-center gap-2 text-neutral-400 text-sm font-semibold mb-1">
                <span>{isEn ? "Standard Value:" : "السعر الأصلي:"}</span>
                <span className="line-through font-mono font-bold text-base">
                  {pricing.originalPriceEgp} {isEn ? "EGP" : "ج.م"}
                </span>
              </div>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl sm:text-6xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                  {pricing.priceEgp}
                </span>
                <span className="text-lg font-black text-neutral-800 dark:text-neutral-200">
                  {isEn ? "EGP" : "ج.م"}
                </span>
              </div>
              <div className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {isEn ? "⚡ Pay Once, Learn Forever" : "⚡ استثمار لمرة واحدة يدوم معك للأبد"}
              </div>
            </div>

            {/* Visual Animated Scarcity Progress Bar */}
            <div className="mx-auto max-w-md my-4 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  {isEn
                    ? `Only ${pricing.cohortSeatsRemaining} seats remaining at this launch price`
                    : `متبقي ${pricing.cohortSeatsRemaining} مقعدًا فقط بهذا السعر الاستثنائي`}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400 text-[11px] font-mono font-bold">
                  {isEn ? "453 / 500 Claimed" : "٤٥٣ / ٥٠٠ مقعد"}
                </span>
              </div>
              <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 w-[90.6%]" />
              </div>
              <p className="mt-2 text-[11px] text-amber-800 dark:text-amber-200 font-medium">
                {isEn
                  ? "Once the 500 founding seats are filled, pricing increases to 599 EGP."
                  : "فور اكتمال الـ ٥٠٠ مقعد الأولى سيتم رفع الاشتراك إلى ٥٩٩ ج.م."}
              </p>
            </div>

            {/* Cost-per-lesson Value Anchor */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/40 mb-4">
              <span>💡</span>
              <span>
                {isEn
                  ? `Less than 0.25 EGP per lesson — for 100 tracks and ${totalLessons}+ actionable modules`
                  : `أقل من ٢٥ قرشًا للدرس الواحد — لـ ١٠٠ مسار و${totalLessons}+ درس تطبيقي كامل`}
              </span>
            </div>

            <div className="mb-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 p-4 text-xs leading-relaxed text-teal-950 dark:text-teal-200 border border-teal-200/60 dark:border-teal-800/60 flex items-start gap-3 text-start">
              <span className="text-2xl shrink-0">💸</span>
              <div>
                <p className="font-bold text-teal-900 dark:text-teal-100 text-sm">
                  {isEn ? "Recover 100% of Your Investment + Profit!" : "استرجع اشتراكك بالكامل وزيادة كاش!"}
                </p>
                <p className="mt-1 text-teal-800 dark:text-teal-300 text-xs leading-relaxed">
                  {isEn
                    ? `Refer 5 friends with your personal affiliate link = ${referral.commissionEgp * 5} EGP cash in your pocket. Instant withdrawal starting at ${referral.minPayoutEgp} EGP via Vodafone Cash or InstaPay.`
                    : `٥ أصدقاء يشتركون برابطك الشخصي = ٣٧٥ ج.م كاش فوري في محفظتك (عمولة ٧٥ ج.م عن كل صديق، والسحب فوري من ١٥٠ ج.م عبر فودافون كاش أو إنستاباي).`}
                </p>
              </div>
            </div>

            {/* VIP Prompts Vault & Legal Contracts Hook */}
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 p-4 sm:p-5 text-xs leading-relaxed border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-start">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">👑</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-amber-900 dark:text-amber-200 text-sm">
                      {isEn
                        ? "Exclusive VIP Upgrade: 10,000 Prompts Database + 5 Freelance Legal Contracts"
                        : "ترقية VIP الحصرية: قاعدة الـ 10,000 برومبت تنفيذي + 5 عقود فريلانس قانونية"}
                    </p>
                    <span className="rounded-md bg-amber-400 text-neutral-950 px-2 py-0.5 text-[10px] font-black">
                      +{pricing.orderBumpPriceEgp} {isEn ? "EGP" : "ج.م"}
                    </span>
                  </div>
                  <p className="mt-1 text-neutral-700 dark:text-neutral-300 text-xs leading-relaxed">
                    {isEn
                      ? "Available at checkout: 100 specialized business domains × 100 copy-pasteable executive prompts (10,000 total) + 5 bilingual contracts preventing client non-payment and scope creep."
                      : "متاحة اختياريًا عند الدفع: 100 مجال شركات × 100 برومبت تنفيذي جاهز للنسخ (10,000 برومبت) + 5 عقود عمل حر ثنائية اللغة تحمي أتعابك قانونيًا وتمنع المماطلة."}
                  </p>
                </div>
              </div>
              <Link
                href="/quiz"
                className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-neutral-950 font-black text-xs hover:brightness-105 active:scale-95 transition-all shadow-md shadow-amber-500/20"
              >
                <span>📥</span>
                <span>{isEn ? "Claim with VIP →" : "احصل عليها مع اشتراكك ←"}</span>
              </Link>
            </div>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 mb-6 text-start">
              {[
                isEn ? "Instant access to all 100 professional tracks" : "فتح فوري لكافة الـ ١٠٠ مسار تخصصي",
                isEn ? `Over ${totalLessons}+ micro-lessons with visual infographics` : `أكثر من ${totalLessons}+ درس عملي مصغر برسوم بيانية`,
                isEn ? "Fully bilingual content (Arabic & English)" : "محتوى ثنائي اللغة بالكامل (عربي وإنجليزي)",
                isEn ? "Psychological focus tools (Pomodoro & Alpha waves)" : "أدوات التركيز وبومودورو وموجات ألفا",
                isEn ? "Verified community wall with 300+ real members" : "حائط المجتمع وقصص نجاح أكثر من ٣٠٠ عضو",
                isEn ? "7-Day 100% Money-Back Guarantee" : "ضمان استرداد كامل خلال 7 أيام بدون أي تعقيد",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* High-Converting Radiant CTA Button */}
            <Link
              href="/quiz"
              className="w-full inline-flex items-center justify-center py-4 px-8 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white font-black text-sm sm:text-base shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:brightness-110 active:scale-98 transition-all"
            >
              <span>
                {isEn
                  ? `Enroll Now & Claim Seat for Only ${pricing.priceEgp} EGP →`
                  : `انضم الآن واحجز مقعدك بـ ${pricing.priceEgp} ج.م فقط ←`}
              </span>
            </Link>

            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "Day 1 of every track is 100% open and free — try it first before paying anything"
                : "اليوم الأول من كل مسار مفتوح مجانًا بالكامل — جرّب عمليًا قبل ما تدفع أي حاجة"}
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
