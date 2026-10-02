"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { brand, pricing, payment } from "@/content/brand";
import { ALL_100_TRACKS, getTrackBySlug, Track100 } from "@/content/tracks100";
import { trackLead, trackQuizStarted } from "@/lib/analytics";
import {
  quizQuestions,
  quizInterstitials,
  computeArchetype,
  computeReadinessScore,
} from "@/content/marketing-quiz";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";

const totalLessons = ALL_100_TRACKS.reduce((sum, t) => sum + t.totalLessons, 0);

type Step =
  | { kind: "roleIntro" }
  | { kind: "socialProof" }
  | { kind: "question"; qIndex: number }
  | { kind: "interstitial"; afterN: number }
  | { kind: "leadEmail" }
  | { kind: "leadName" }
  | { kind: "result" }
  | { kind: "sales" }
  | { kind: "beforeAfter" }
  | { kind: "testimonials" }
  | { kind: "wheel" }
  | { kind: "offer" };

function buildSteps(): Step[] {
  const steps: Step[] = [{ kind: "roleIntro" }, { kind: "socialProof" }];
  quizQuestions.forEach((_, i) => {
    steps.push({ kind: "question", qIndex: i });
    const afterN = i + 1;
    if (quizInterstitials[afterN]) steps.push({ kind: "interstitial", afterN });
  });
  steps.push(
    { kind: "leadEmail" },
    { kind: "leadName" },
    { kind: "result" },
    { kind: "sales" },
    { kind: "beforeAfter" },
    { kind: "testimonials" },
    { kind: "wheel" },
    { kind: "offer" }
  );
  return steps;
}

// Lightweight native Web Audio synthesizer for dopamine micro-rewards
function playChime(type: "pop" | "fanfare" | "milestone", enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    if (type === "pop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "fanfare") {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.14, ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.45);
      });
    } else if (type === "milestone") {
      const notes = [440, 554.37, 659.25];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
      });
    }
  } catch {
    /* Silent catch if user browser restricts autoplay */
  }
}

// Canvas-based confetti burst for milestone celebrations
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const count = 48;
    const colors = ["#10b981", "#14b8a6", "#34d399", "#f59e0b", "#38bdf8", "#ec4899", "#ffffff"];

    const particles = Array.from({ length: count }).map(() => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 120,
      y: canvas.height / 3 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -7 - 3,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      opacity: 1,
    }));

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22; // gravity
        p.rotation += p.vr;
        p.opacity -= 0.007;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          ctx.restore();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      }
    }

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={320}
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto z-40 max-w-full"
    />
  );
}

export default function QuizPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const steps = useMemo(() => buildSteps(), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [xp, setXp] = useState(50);
  const [showXpFloat, setShowXpFloat] = useState(false);

  const step = steps[stepIndex];

  useEffect(() => {
    trackQuizStarted();
  }, []);

  const archetype = useMemo(() => computeArchetype(answers), [answers]);
  const score = useMemo(() => computeReadinessScore(answers), [answers]);

  // Resolve recommended real courses based on archetype
  const recommendedTracks = useMemo<Track100[]>(() => {
    const slugs = archetype.recommendedTrackSlugs || [
      "prompt-engineering-mastery",
      "ai-workplace-productivity",
      "zero-to-first-dollar-freelancer",
    ];
    return slugs.map((s) => getTrackBySlug(s)).filter((t): t is Track100 => !!t);
  }, [archetype]);

  function next() {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }

  function back() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function answerQuestion(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
    setXp((prev) => prev + 25);
    setShowXpFloat(true);
    setTimeout(() => setShowXpFloat(false), 1200);
    playChime("pop", soundEnabled);
    next();
  }

  // Sound cue on milestone & results
  useEffect(() => {
    if (step.kind === "interstitial") {
      playChime("milestone", soundEnabled);
    } else if (step.kind === "result") {
      playChime("fanfare", soundEnabled);
    }
  }, [step.kind, soundEnabled]);

  async function submitLead() {
    setSaving(true);
    try {
      await fetch("/api/quiz/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, answers: { ...answers, role } }),
      });
      trackLead();
    } finally {
      setSaving(false);
      next();
    }
  }

  function goCheckout() {
    const primarySlug = recommendedTracks[0]?.slug ?? "prompt-engineering-mastery";
    sessionStorage.setItem(
      "tawwerni_checkout",
      JSON.stringify({ email, name, courseSlug: primarySlug })
    );
    router.push("/quiz/checkout");
  }

  const questionNumber = step.kind === "question" ? step.qIndex + 1 : 0;
  const progressPercent = Math.round((questionNumber / quizQuestions.length) * 100);

  // Dynamic phase label based on current question
  const currentPhaseLabel = useMemo(() => {
    if (questionNumber <= 6) {
      return isEn ? "Phase 1: Diagnostic & Core Goals" : "المرحلة الأولى: التشخيص وتحديد الأهداف";
    }
    if (questionNumber <= 12) {
      return isEn ? "Phase 2: Tech Comfort & Skills Audit" : "المرحلة الثانية: فحص الأدوات والجاهزية";
    }
    return isEn ? "Phase 3: Income Blueprint & Daily Habit" : "المرحلة الثالثة: خطة الدخل والتطبيق اليومي";
  }, [questionNumber, isEn]);

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen relative overflow-hidden bg-[#070d0c] text-neutral-100 flex flex-col font-sans transition-colors selection:bg-emerald-500/30 selection:text-white"
    >
      {/* Ambient Cyberpunk Glow Gradients & Grid Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-b from-teal-500/20 via-emerald-500/10 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-28 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-10 -left-28 w-96 h-96 bg-emerald-600/10 blur-[120px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Quiz Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070d0c]/85 backdrop-blur-xl px-4 py-2.5">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          {/* Back Action */}
          <div className="w-20">
            {stepIndex > 0 && step.kind !== "offer" ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-emerald-400 transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
              >
                <span>{isEn ? "‹" : "›"}</span>
                <span>{isEn ? "Back" : "رجوع"}</span>
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-white/5"
              >
                <span>{isEn ? "‹" : "›"}</span>
                <span>{isEn ? "Home" : "الرئيسية"}</span>
              </Link>
            )}
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <LogoLink size={28} href="/" />
          </div>

          {/* Gamified Status Pills & Controls */}
          <div className="flex items-center gap-2">
            {/* Live XP Pill */}
            <div className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-black font-mono shadow-xs shadow-emerald-500/10">
              <span className="text-amber-400">⚡</span>
              <span>{xp} XP</span>
              {showXpFloat && (
                <span className="absolute -top-6 start-1 text-[11px] font-black text-amber-300 animate-bounce pointer-events-none drop-shadow-md">
                  +25 XP ✨
                </span>
              )}
            </div>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? (isEn ? "Mute Sound" : "كتم الصوت") : (isEn ? "Enable Sound" : "تفعيل الصوت")}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5 transition"
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>

            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Gamified Glowing Progress Bar for Questions */}
      {step.kind === "question" && (
        <div className="relative z-30 max-w-xl mx-auto w-full px-5 pt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 mb-1.5">
            <span className="text-teal-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              {currentPhaseLabel}
            </span>
            <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {questionNumber} / {quizQuestions.length} ({progressPercent}%)
            </span>
          </div>

          <div className="h-2 w-full bg-neutral-900/90 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 transition-all duration-300 shadow-md shadow-emerald-500/30"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Step Content Container */}
      <main className="relative z-10 flex-1 max-w-xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col justify-center">
        {/* ================= STEP 1: ROLE INTRO ================= */}
        {step.kind === "roleIntro" && (
          <div className="animate-fade-in">
            {/* Top Pill */}
            <div className="text-center mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 border border-emerald-500/40 px-4 py-1.5 text-xs font-black text-emerald-300 shadow-lg shadow-emerald-500/10">
                <span className="animate-spin text-amber-400">✨</span>
                <span>{isEn ? "Personalized AI Diagnostic · 2 Minutes" : "تقييم تشخيصي مجاني · دقيقتان فقط"}</span>
              </span>
            </div>

            {/* Headline */}
            <div className="mb-7 text-center">
              <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight text-white">
                {isEn ? (
                  <>
                    Discover Your High-Income Track in <br />
                    <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
                      AI & Future Technologies
                    </span>
                  </>
                ) : (
                  <>
                    اكتشف مسارك الذكي لمضاعفة دخلك <br />
                    <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-amber-300 bg-clip-text text-transparent">
                      بمهارات المستقبل والذكاء الاصطناعي
                    </span>
                  </>
                )}
              </h1>
              <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-300">
                {isEn
                  ? "Answer 18 quick questions to unlock your custom 28-day roadmap, tailored specifically to your goals and pace."
                  : "أجب عن 18 سؤالاً سريعاً لتحصل على خارطة طريق حصرية وتقرير جاهزية مصمم خصيصاً لمستواك وأهدافك."}
              </p>
            </div>

            {/* Question Prompt */}
            <p className="mb-4 text-center text-sm font-bold text-neutral-200 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{isEn ? "How do you best describe yourself?" : "كيف تصف نفسك وتطلعاتك حاليًا؟"}</span>
            </p>

            {/* 3 High-Energy Role Cards */}
            <div className="space-y-3 mb-6">
              {[
                {
                  icon: "👨‍💼",
                  badge: isEn ? "Fast Promotion Track" : "مسار الترقية السريعة",
                  badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
                  label: isEn ? "Company Professional / Career Climber" : "موظف في شركة / أسعى لترقية وزيادة راتب",
                  desc: isEn
                    ? "Multiply daily productivity, automate workflows, and become indispensable"
                    : "مضاعفة إنتاجيتي اليومية وإتقان أدوات الـ AI لأصبح الشخص الأكثر تميزاً في فريقي",
                  tag: isEn ? "High ROI ⭐" : "الخيار المفضل للمحترفين ⭐",
                  value: "employee",
                },
                {
                  icon: "💰",
                  badge: isEn ? "Income Engine & Freelance" : "مسار الدخل الحر والتوسع",
                  badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
                  label: isEn ? "Founder / Freelancer / Side-Hustler" : "صاحب مشروع / فريلانسر حر / باني دخل إضافي",
                  desc: isEn
                    ? "Launch new services, secure international clients, and build scalable automated income"
                    : "إطلاق خدمات جديدة وأتمتة المهام لرفع أرباحي وجذب عملاء دوليين على Upwork",
                  tag: isEn ? "Most Popular 🔥" : "الأعلى طلباً هذا الشهر 🔥",
                  value: "founder",
                },
                {
                  icon: "🌱",
                  badge: isEn ? "Zero-to-One Mastery" : "مسار التأسيس والتمكن",
                  badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
                  label: isEn ? "Student / Seeking a Modern Career Start" : "طالب / أبحث عن بداية مسار دخل جديد",
                  desc: isEn
                    ? "Learn highly-demanded future skills from scratch without complicated coding"
                    : "بناء مهارات تقنية مطلوبة جداً من الصفر وصنع أول مصدر دخل بدون تعقيد",
                  tag: isEn ? "Beginner Friendly 🎯" : "مثالي للمبتدئين 🎯",
                  value: "exploring",
                },
              ].map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    setRole(o.value);
                    next();
                  }}
                  className="group relative w-full flex items-start gap-4 p-4 sm:p-5 rounded-3xl border-2 border-white/10 bg-[#0d1614]/90 hover:border-emerald-400 hover:bg-emerald-950/30 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 active:scale-98 text-start overflow-hidden backdrop-blur-xl"
                >
                  {/* Glowing squircle icon */}
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-3xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-transform">
                    {o.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${o.badgeColor}`}>
                        {o.badge}
                      </span>
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {o.tag}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300 transition-colors">
                      {o.label}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {o.desc}
                    </p>
                  </div>

                  <span className="shrink-0 self-center text-neutral-500 text-lg group-hover:text-emerald-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all">
                    {isEn ? "→" : "←"}
                  </span>
                </button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-neutral-400 font-semibold pt-2 border-t border-white/5">
              <span className="flex items-center justify-center gap-1">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{isEn ? "2 Minutes Only" : "دقيقتان فقط"}</span>
              </span>
              <span className="flex items-center justify-center gap-1">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{isEn ? "Instant Custom Report" : "خطة فورية مخصصة"}</span>
              </span>
              <span className="flex items-center justify-center gap-1">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{isEn ? "Day 1 Free" : "اليوم الأول مجاني"}</span>
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SOCIAL PROOF ================= */}
        {step.kind === "socialProof" && (
          <div className="text-center animate-fade-in">
            <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-5xl mb-4 shadow-xl shadow-emerald-500/20 animate-pulse">
              🚀
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">
              {isEn ? "A Complete Professional Ecosystem Awaits" : "منظومة تدريبية متكاملة تصنع لك فارقاً حقيقياً"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mb-6 max-w-md mx-auto leading-relaxed">
              {isEn
                ? "Bilingual (Arabic / English) hands-on curriculum built upon behavioral psychology, daily 15-minute micro-habits, and instant portfolio projects."
                : "محتوى ثنائي اللغة (عربي / إنجليزي) مبني على أحدث علوم النفس السلوكية والتطبيق العملي في 15 دقيقة يومياً بدون أي حشو."}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { n: "100", l: isEn ? "Pro Tracks" : "مسار احترافي", sub: isEn ? "10 Domains" : "في ١٠ أركان" },
                { n: `${totalLessons}+`, l: isEn ? "Practical Lessons" : "درس تطبيقي", sub: isEn ? "Infographics" : "مع جرافيكس" },
                { n: "15", l: isEn ? "Mins / Day" : "دقيقة يومياً", sub: isEn ? "Micro Habit" : "وتيرة ذهبية" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-[#0d1614] border border-white/10 p-3.5 shadow-lg shadow-black/40 hover:border-emerald-500/40 transition"
                >
                  <p className="text-2xl sm:text-3xl font-black text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text font-mono">
                    {s.n}
                  </p>
                  <p className="text-xs font-bold text-white mt-1">{s.l}</p>
                  <p className="text-[10px] text-neutral-400">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Day 1 Free Guarantee Callout */}
            <div className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-neutral-900 border-2 border-emerald-500/40 p-4 text-xs text-neutral-200 mb-6 shadow-xl leading-relaxed text-start flex items-center gap-3">
              <span className="text-2xl shrink-0">🎁</span>
              <div>
                <p className="font-bold text-emerald-300">
                  {isEn ? "100% Risk-Free Experience" : "تجربة مجانية مضمونة بدون أي مخاطرة"}
                </p>
                <p className="text-[11px] text-neutral-300 mt-0.5">
                  {isEn
                    ? "Day 1 of ALL 100 tracks is 100% free — test the method and quality first-hand before committing."
                    : "اليوم الأول في كل الـ ١٠٠ مسار مفتوح مجاناً بالكامل — جرّب بنفسك أسلوب التعلم الممتع وجودة التطبيق قبل أي قرار."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition-all"
            >
              {isEn ? "Start Assessment (2 Mins) →" : "ابدأ التقييم الآن (دقيقتان فقط) ←"}
            </button>
          </div>
        )}

        {/* ================= STEP: QUESTION ================= */}
        {step.kind === "question" && (
          <div className="animate-fade-in">
            {/* Question Header Card */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-neutral-300 mb-2">
                <span className="text-amber-400">⚡ Q{questionNumber}</span>
                <span>·</span>
                <span className="text-emerald-400 font-mono">+25 XP</span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                {isEn ? quizQuestions[step.qIndex].questionEn : quizQuestions[step.qIndex].question}
              </h2>

              {(quizQuestions[step.qIndex].subtitle || quizQuestions[step.qIndex].subtitleEn) && (
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {isEn ? quizQuestions[step.qIndex].subtitleEn : quizQuestions[step.qIndex].subtitle}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {quizQuestions[step.qIndex].options.map((opt, idx) => {
                const letter = isEn
                  ? String.fromCharCode(65 + idx)
                  : ["أ", "ب", "ج", "د", "هـ", "و"][idx] ?? `${idx + 1}`;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => answerQuestion(quizQuestions[step.qIndex].id, opt.value)}
                    className={`group w-full flex items-center gap-3.5 rounded-2xl border-2 p-3.5 sm:p-4 text-xs sm:text-sm text-start transition-all duration-200 active:scale-98 ${
                      opt.highlight
                        ? "border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400 hover:bg-emerald-950/40 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                        : "border-white/10 bg-[#0d1614]/80 hover:border-emerald-500/60 hover:bg-[#12211d] hover:shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Letter Key Pill */}
                    <span className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-neutral-300 group-hover:bg-emerald-500 group-hover:text-neutral-950 font-bold text-xs flex items-center justify-center shrink-0 transition-colors">
                      {letter}
                    </span>

                    {/* Icon */}
                    {opt.icon && (
                      <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                        {opt.icon}
                      </span>
                    )}

                    {/* Label & Optional Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-100 group-hover:text-white">
                          {isEn ? opt.labelEn || opt.label : opt.label}
                        </span>
                        {(opt.badge || opt.badgeEn) && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {isEn ? opt.badgeEn : opt.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow / Chevron */}
                    <span className="text-neutral-500 text-sm group-hover:text-emerald-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all">
                      {isEn ? "›" : "‹"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP: INTERSTITIAL MILESTONES ================= */}
        {step.kind === "interstitial" && (
          <div className="relative text-center animate-fade-in py-2">
            <ConfettiCanvas />

            <div className="inline-block p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-2 border-amber-400/40 text-5xl mb-4 shadow-xl shadow-amber-500/20 animate-bounce">
              {quizInterstitials[step.afterN].icon}
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-black mb-3">
              <span>🏆</span>
              <span>
                {isEn ? "Milestone Achieved · Top 20% Tier" : "إنجاز مرحلي · أنت متقدم على 80% من محيطك"}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black mb-3 text-white">
              {isEn ? quizInterstitials[step.afterN].headingEn : quizInterstitials[step.afterN].heading}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed max-w-md mx-auto">
              {isEn ? quizInterstitials[step.afterN].bodyEn : quizInterstitials[step.afterN].body}
            </p>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base"
            >
              {isEn ? quizInterstitials[step.afterN].ctaEn : quizInterstitials[step.afterN].cta}
            </button>
          </div>
        )}

        {/* ================= STEP: LEAD EMAIL ================= */}
        {step.kind === "leadEmail" && (
          <div className="animate-fade-in text-center">
            <span className="text-xs font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 inline-flex items-center gap-1.5 mb-3">
              <span className="text-amber-400">✨</span>
              <span>{isEn ? "Diagnostic Complete · 98% Confidence" : "اكتمل التقييم التشخيصي بنجاح"}</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">
              {isEn ? (
                <>
                  Enter your email to unlock your <br />
                  <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Personalized AI Blueprint
                  </span>
                </>
              ) : (
                <>
                  أدخل بريدك الإلكتروني لعرض <br />
                  <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    خطتك التشخيصية ومؤشر جاهزيتك
                  </span>
                </>
              )}
            </h2>

            {/* Key Outcomes Pills */}
            <div className="flex flex-wrap justify-center gap-2 text-xs text-neutral-300 my-4">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                📊 {isEn ? "AI Readiness Score" : "مؤشر الجاهزية للذكاء الاصطناعي"}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                🎯 {isEn ? "Top 3 Matched Tracks" : "ترشيح أفضل ٣ مسارات"}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                ⏱️ {isEn ? "15 Mins / Day Plan" : "خطة الـ 15 دقيقة"}
              </span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
              className="mt-6"
            >
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-center border-2 border-white/15 bg-[#0d1614] text-white rounded-2xl px-4 py-3.5 mb-4 text-sm focus:border-emerald-400 focus:outline-hidden transition"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base"
              >
                {isEn ? "Unlock My Roadmap Now →" : "افتح خطتي التشخيصية الآن ←"}
              </button>
            </form>

            <p className="text-[11px] text-neutral-400 mt-4 flex items-center justify-center gap-1.5">
              <span>🔒</span>
              <span>
                {isEn
                  ? "We respect your privacy. No spam. Instant access."
                  : "نلتزم بحماية خصوصيتك بنسبة 100%. بدون أي رسائل مزعجة إطلاقاً."}
              </span>
            </p>
          </div>
        )}

        {/* ================= STEP: LEAD NAME ================= */}
        {step.kind === "leadName" && (
          <div className="animate-fade-in text-center">
            <div className="text-4xl mb-3">🎓</div>
            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">
              {isEn ? "What is your full name?" : "ما هو اسمك الكريم؟"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mb-6 max-w-sm mx-auto">
              {isEn
                ? "We personalize your official diagnostic certificate and roadmap to this name."
                : "لنخصص خطتك الرسمية وشهادات إتمام المسارات باسمك المعتمد."}
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitLead();
              }}
            >
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? "Your full name" : "اكتب اسمك الثلاثي أو الأول"}
                className="w-full text-center border-2 border-white/15 bg-[#0d1614] text-white rounded-2xl px-4 py-3.5 mb-4 text-sm focus:border-emerald-400 focus:outline-hidden transition"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base disabled:opacity-60"
              >
                {saving
                  ? isEn ? "Generating Your Blueprint..." : "جاري بناء خطتك..."
                  : isEn ? "View My Blueprint Now →" : "استعرض خطتي المخصصة الآن ←"}
              </button>
            </form>
          </div>
        )}

        {/* ================= STEP: RESULT & BLUEPRINT (THE CLIMAX) ================= */}
        {step.kind === "result" && (
          <div className="text-center animate-fade-in relative">
            <ConfettiCanvas />

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black mb-3">
              <span>✨</span>
              <span>{isEn ? `Verified Diagnostic Blueprint for ${name || "Learner"}` : `الخطة التشخيصية الرسمية لـ ${name || "المتعلم"}`}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-1 text-white">
              {isEn ? `${name || "Friend"}, Here is Your AI Blueprint` : `يا ${name || "بطل"}، هذه خارطة طريقك الاستراتيجية`}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mb-5">
              {isEn
                ? "Based on your 18 answers, here is your high-impact transformation blueprint"
                : "بناءً على إجاباتك، قمنا بحساب مؤشر جاهزيتك وتحديد مساراتك المباشرة"}
            </p>

            {/* Score & Tier Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0e1a17] via-[#0d1614] to-[#12241e] border-2 border-emerald-500/40 p-6 mb-5 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start shadow-2xl shadow-emerald-500/20 overflow-hidden">
              <div className="pointer-events-none absolute -right-12 -top-12 w-40 h-40 rounded-full bg-emerald-500/20 blur-3xl" />

              {/* Radial Score Gauge */}
              <div className="relative shrink-0 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 blur-lg opacity-50 animate-pulse" />
                <div
                  className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl"
                  style={{
                    background: `conic-gradient(#10b981 0deg, #14b8a6 ${score * 2.5}deg, #f59e0b ${score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                  }}
                >
                  <div className="w-22 h-22 rounded-full bg-[#070d0c] border border-white/10 flex flex-col items-center justify-center shadow-inner">
                    <span className="font-black text-3xl leading-none bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-mono">
                      {score}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400 mt-0.5">/ 100</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-black border border-emerald-500/30 mb-2">
                  <span>🏆</span>
                  <span>{isEn ? "Top 12% Digital Readiness Tier" : "أعلى ١٢٪ في مؤشر الجاهزية والذكاء الرقمي"}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isEn
                    ? "Exceptional potential for rapid monetization and AI adoption."
                    : "إمكانيات استثنائية للتفوق ومضاعفة الدخل بأدوات الذكاء الاصطناعي."}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {isEn
                    ? "Your responses demonstrate high adaptability and commitment to daily 15-minute micro-habits."
                    : "إجاباتك تبرهن على رغبة حقيقية واستعداد كامل لالتزام ١٥ دقيقة يومياً لصنع تحول جذري في مهاراتك."}
                </p>
              </div>
            </div>

            {/* Archetype Card */}
            <div className="rounded-3xl bg-[#0d1614] border-2 border-teal-500/40 p-6 mb-5 text-start shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-black text-teal-400 tracking-wider">
                  {isEn ? "YOUR LEADERSHIP ARCHETYPE" : "نمطك القيادي في عالم الذكاء الاصطناعي"}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  ✨ Verified Blueprint
                </span>
              </div>

              <p className="text-xl sm:text-2xl font-black mb-1 text-white flex items-center gap-3">
                <span className="text-3xl">{archetype.icon}</span>
                <span>{isEn ? archetype.titleEn : archetype.title}</span>
              </p>
              <p className="text-xs text-teal-300 font-bold mb-3">
                {isEn ? archetype.subtitleEn : archetype.subtitle}
              </p>

              {/* Income Potential Pill */}
              <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
                <span className="text-xl">💰</span>
                <div>
                  <p className="text-[10px] font-bold text-amber-300">
                    {isEn ? "Target Supplemental Income Potential:" : "الدخل الإضافي المستهدف لهذا المسار:"}
                  </p>
                  <p className="text-sm font-black text-white font-mono">
                    {isEn ? archetype.salaryRangeEn : archetype.salaryRangeAr}
                  </p>
                </div>
              </div>

              {/* Superpowers */}
              <div className="mb-3">
                <p className="text-[11px] font-bold text-neutral-400 mb-2">
                  {isEn ? "Key Superpowers to Master:" : "أهم المهارات الخارقة التي ستكتسبها:"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(isEn ? archetype.superpowersEn : archetype.superpowersAr).map((sp) => (
                    <span
                      key={sp}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-emerald-300"
                    >
                      ✓ {sp}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs italic text-neutral-300 border-s-2 border-teal-400 ps-3 py-1 leading-relaxed bg-white/5 rounded-e-xl mt-3">
                &ldquo;{isEn ? archetype.quoteEn : archetype.quote}&rdquo;
              </p>
            </div>

            {/* Top Recommended Tracks from the 100 tracks catalog */}
            <div className="rounded-3xl bg-[#0d1614] border border-white/10 p-5 mb-6 text-start">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase text-neutral-300 flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>{isEn ? "Your Top 3 Curated Tracks" : "أفضل ٣ مسارات مرشحة لك من الـ ١٠٠ مسار"}</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {isEn ? "Day 1 Free On All" : "اليوم الأول مجاني في الكل"}
                </span>
              </div>

              <div className="space-y-2.5">
                {recommendedTracks.map((t, idx) => (
                  <div
                    key={t.slug}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition"
                  >
                    <span className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-2xl flex items-center justify-center shrink-0">
                      {t.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-amber-300 font-mono">
                          #{idx + 1}
                        </span>
                        <p className="text-xs font-bold text-white truncate">
                          {isEn ? t.titleEn : t.titleAr}
                        </p>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {t.totalLessons} {isEn ? "lessons" : "درس تطبيقي"} · {isEn ? t.levelEn : t.levelAr} · +{t.totalXp} XP
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {isEn ? "Day 1 Free" : "مجاني اليوم"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all"
            >
              {isEn ? "See Your 28-Day Transformation Blueprint →" : "استعرض خطة التحوّل خلال ٢٨ يوم ←"}
            </button>
          </div>
        )}

        {/* ================= STEP: SALES & PSYCHOLOGICAL CLARITY ================= */}
        {step.kind === "sales" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-2 text-white">
              {isEn ? "Future Skills Made Effortless" : "الذكاء الاصطناعي أسهل بكثير مما تتخيل"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 text-center mb-6 max-w-md mx-auto leading-relaxed">
              {isEn
                ? "Engineered specifically to help you build real momentum — right from Day 1"
                : "مصمم بدقة لمساعدتك على بناء مهارات ملموسة — من أول يوم وبدون أي تعقيد أو تشتت"}
            </p>

            <div className="rounded-2xl bg-teal-500/10 border border-teal-500/30 p-3.5 mb-5 text-center">
              <p className="text-[11px] text-teal-300 font-bold mb-0.5">
                {isEn ? "Customized Specifically For:" : "مخصص وموجه لـ:"}
              </p>
              <p className="font-black text-sm text-white flex items-center justify-center gap-2">
                <span>{archetype.icon}</span>
                <span>{isEn ? archetype.titleEn : archetype.title}</span>
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm mb-6 bg-[#0d1614] p-5 rounded-3xl border border-white/10">
              {[
                isEn
                  ? "Zero prior coding or technical experience needed — starts from complete scratch"
                  : "لا تشترط أي خبرة برمجية مسبقة — نبدأ معك من الصفر تماماً",
                isEn
                  ? "Overcoming overwhelm: structured 5-to-15 minute micro-lessons"
                  : "وداعاً للتشتت: دروس ميكرو مدتها من ٥ إلى ١٥ دقيقة فقط يومياً",
                isEn
                  ? "Progress at your own pace with streak freeze protection and mood check-in"
                  : "تعلم بوتيرتك المريحة مع حماية السلسلة وفحص الطاقة والمزاج اليومي",
                isEn
                  ? "Master the tools everyone is talking about (ChatGPT, Claude, Gemini, Automations)"
                  : "أتقن الأدوات التي يتحدث عنها العالم (ChatGPT, Claude, Gemini, Midjourney)",
                isEn
                  ? "High-impact hands-on task in every lesson to produce real portfolio pieces"
                  : "تطبيق عملي مباشر في كل درس لبناء مشاريع واقعية يمكنك الاستفادة منها",
                isEn
                  ? "Bilingual learning (Arabic/English) with accredited completion certificates"
                  : "منصة ثنائية اللغة عربي/إنجليزي مع شهادات إتمام معتمدة لملفك الشخصي",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold text-base leading-none">✓</span>
                  <span className="text-neutral-200">{t}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all"
            >
              {isEn ? "Continue to Transformation Blueprint →" : "متابعة ←"}
            </button>
          </div>
        )}

        {/* ================= STEP: BEFORE & AFTER (LOSS AVERSION) ================= */}
        {step.kind === "beforeAfter" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-1 text-white">
              {isEn ? "Your 28-Day Transformation" : "تحوّلك الحقيقي خلال ٢٨ يوم"}
            </h2>
            <p className="text-xs text-neutral-300 text-center mb-6">
              {isEn
                ? "Gain career momentum and verifiable future skills in just 28 days"
                : "تكتسب مهارات حقيقية وشهادة معتمدة في غضون ٢٨ يوماً من اليوم"}
            </p>

            {/* Without Tawwerni */}
            <div className="rounded-3xl border border-red-500/30 bg-red-950/20 p-5 mb-4">
              <p className="text-sm font-bold text-red-300 mb-2 flex items-center gap-2">
                <span>😟</span>
                <span>{isEn ? `Without ${brand.name}` : `بدون ${brand.name}`}</span>
              </p>
              <ul className="text-xs text-red-200/90 space-y-2 leading-relaxed">
                <li>• {isEn ? "Stuck saving tutorials without taking real action" : "حفظ فيديوهات وبوستات بدون تطبيق عملي حقيقي"}</li>
                <li>• {isEn ? "Watching peers advance while you stay in the same spot" : "مشاهدة الآخرين يتقدمون بينما تظل مكانك بنفس الدخل"}</li>
                <li>• {isEn ? "Confusion about what to learn or where to focus" : "تشتت مستمر وشعور بالعجز أمام تسارع التكنولوجيا"}</li>
              </ul>
            </div>

            {/* With Tawwerni */}
            <div className="rounded-3xl border-2 border-emerald-500/40 bg-emerald-950/20 p-5 mb-6 shadow-xl shadow-emerald-500/10">
              <p className="text-sm font-bold text-emerald-300 mb-2 flex items-center gap-2">
                <span>😊</span>
                <span>{isEn ? `With ${brand.name}` : `مع ${brand.name}`}</span>
              </p>
              <ul className="text-xs text-emerald-200/90 space-y-2 leading-relaxed">
                <li>• {isEn ? "Just 15 minutes daily — guaranteed frictionless consistency" : "١٥ دقيقة فقط يومياً — استمرارية سلسة بدون إحباط"}</li>
                <li>• {isEn ? "Tangible projects and portfolio pieces from week one" : "نتائج ومشاريع عملية ملموسة من الأسبوع الأول"}</li>
                <li>• {isEn ? "Continuous psychological support (Pomodoro, Alpha waves, Streak Freeze)" : "دعم نفسي وتركيز فائق مدمج يمنع الانقطاع والتسويف"}</li>
                <li>• {isEn ? "Direct roadmap to freelance income and career promotion" : "مسار واضح لزيادة الدخل والتميز في سوق العمل"}</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all"
            >
              {isEn ? "Continue to Deliverables →" : "متابعة ←"}
            </button>
          </div>
        )}

        {/* ================= STEP: DELIVERABLES / WHAT YOU RECEIVE ================= */}
        {step.kind === "testimonials" && (
          <div className="animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-1 text-white">
              {isEn ? "What You Receive Inside Tawwerni" : "ما ستحصل عليه بالضبط عند الانضمام"}
            </h2>
            <p className="text-xs text-neutral-300 text-center mb-5">
              {isEn
                ? "One-time payment for 1-year access — no monthly recurring subscription"
                : "دفعة واحدة فقط لمدة سنة كاملة — بدون أي اشتراكات شهرية متكررة"}
            </p>

            <div className="space-y-2.5 mb-6">
              {[
                {
                  i: "🎯",
                  t: isEn ? "100 Complete Professional Tracks" : "١٠٠ مسار احترافي كامل في ١٠ مجالات حيوية",
                  s: isEn
                    ? `Over ${totalLessons}+ actionable lessons with visual infographic guides`
                    : `أكثر من ${totalLessons}+ درس تطبيقي مع رسوم بيانية وجرافيكس لكل درس`,
                },
                {
                  i: "🌐",
                  t: isEn ? "100% Fully Bilingual (Arabic / English)" : "منصة ثنائية اللغة بالكامل (عربي / إنجليزي)",
                  s: isEn
                    ? "Toggle language anytime with one click, with verified global terminology"
                    : "بدّل اللغة بنقرة زر في أي وقت مع مصطلحات تقنية عالمية مشروحة",
                },
                {
                  i: "🧠",
                  t: isEn ? "Built-in Psychological & Focus Tools" : "أدوات الدعم النفسي والتركيز الفائق المدمجة",
                  s: isEn
                    ? "Integrated Pomodoro timer, Alpha focus waves, and daily mood pacing"
                    : "مؤقت بومودورو مدمج، موجات ألفا للتركيز، وفحص مزاج وطاقة يومي",
                },
                {
                  i: "👥",
                  t: isEn ? "300+ Verified Community Members" : "مجتمع يضم أكثر من ٣٠٠ عضو حقيقي وقصص نجاح",
                  s: isEn
                    ? "Connect and learn from founders, freelancers, and engineers across the Arab region"
                    : "تواصل واستفد من خبرات رواد أعمال وفريلانسرز ومبرمجين في كل الدول العربية",
                },
                {
                  i: "🎁",
                  t: isEn ? "Day 1 Free on Every Track" : "اليوم الأول متاح مجاناً في كل مسار",
                  s: isEn
                    ? "Try the quality and teaching style hands-on with zero risk"
                    : "تجرّب بنفسك أسلوب التعلم وجودة المحتوى بدون أي مخاطرة",
                },
                {
                  i: "⚡",
                  t: isEn ? "Instant Automated Access" : "تفعيل فوري وآمن خلال دقائق",
                  s: isEn
                    ? "Direct activation via Vodafone Cash or InstaPay"
                    : "تفعيل مباشر عبر فودافون كاش أو إنستاباي بدون أي تعقيد",
                },
              ].map((f) => (
                <div
                  key={f.t}
                  className="flex gap-3 rounded-2xl bg-[#0d1614] border border-white/10 p-3.5 shadow-sm hover:border-teal-500/40 transition"
                >
                  <span className="text-2xl leading-none">{f.i}</span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">{f.t}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                      {f.s}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base"
            >
              {isEn ? "See Your Special Founding Offer →" : "اكتشف عرض فوج التأسيس الخاص بك ←"}
            </button>
          </div>
        )}

        {/* ================= STEP: OFFER & 7-DAY GUARANTEE ================= */}
        {step.kind === "wheel" && (
          <div className="text-center animate-fade-in">
            <div className="text-4xl mb-2">🎁</div>

            {/* Scarcity Tag */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black mb-3">
              <span>👑</span>
              <span>
                {isEn
                  ? `Founding Cohort Offer · Only ${pricing.cohortSeatsRemaining} seats remaining`
                  : `عرض فوج التأسيس الأول الحصري · متبقي ${pricing.cohortSeatsRemaining} مقعداً فقط`}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-1 text-white">
              {isEn ? `Your Special Launch Rate, ${name || "Champion"}` : `سعرك الاستثنائي، ${name || "يا بطل"}`}
            </h2>
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 px-3.5 py-1 text-xs font-black text-white shadow-md shadow-rose-500/25 border border-white/20">
                <span className="text-[11px] text-yellow-200 animate-pulse">⚡</span>
                <span>
                  {isEn
                    ? "71% OFF for Founding Cohort members — this special rate will not be repeated"
                    : "خصم 71% للأعضاء المؤسسين — هذا السعر المخفض لن يتكرر مجدداً"}
                </span>
              </span>
            </div>

            {/* Giant Pricing Card */}
            <div className="rounded-3xl border-2 border-emerald-500/50 bg-[#0d1614] p-6 sm:p-8 mb-5 shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-16 -left-16 w-36 h-36 rounded-full bg-emerald-500/15 blur-2xl" />

              <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs font-semibold mb-1">
                <span>{isEn ? "Standard Value:" : "السعر الأصلي:"}</span>
                <span className="line-through font-mono font-bold text-sm text-neutral-500">
                  {pricing.originalPriceEgp} {isEn ? "EGP" : "ج.م"}
                </span>
              </div>

              <div className="flex items-baseline justify-center gap-2 my-2 font-mono">
                <span className="text-5xl sm:text-6xl font-black text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text tracking-tight">
                  {pricing.priceEgp}
                </span>
                <span className="text-base font-bold text-neutral-300">
                  {isEn ? "EGP" : "ج.م"}
                </span>
              </div>

              <p className="text-xs font-bold text-emerald-300 mt-1 mb-4">
                {isEn
                  ? `One-time payment · 1-Year access to all 100 tracks · ${totalLessons}+ lessons · All future updates included`
                  : `دفعة واحدة فقط لسنة كاملة · كل الـ ١٠٠ مسار · أكثر من ${totalLessons}+ درس · التحديثات المستقبلية مجاناً`}
              </p>

              {/* Scarcity Bar */}
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-start">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-400 animate-ping" />
                    {isEn ? `Only ${pricing.cohortSeatsRemaining} seats left` : `باقي ${pricing.cohortSeatsRemaining} مقعداً فقط`}
                  </span>
                  <span className="text-neutral-400 font-mono">
                    {isEn ? "483 / 500 Claimed" : "٤٨٣ / ٥٠٠ مقعد"}
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 w-[96.6%]" />
                </div>
              </div>
            </div>

            {/* 👑 High-Dopamine VIP 10,000 Prompts Vault Unlock Card */}
            <div className="rounded-3xl border-2 border-amber-400/60 bg-gradient-to-br from-amber-950/70 via-[#18140b] to-neutral-900 p-5 mb-5 text-start shadow-2xl shadow-amber-500/20 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl" />
              <div className="flex items-start gap-3.5 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-neutral-950 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-amber-500/30 font-black">
                  👑
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="rounded-full bg-amber-400 text-neutral-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      🔥 {isEn ? "Secret VIP Vault" : "خزنة الـ VIP السرية"}
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 font-bold">
                      {isEn ? "+ 5 Legal Contracts" : "+ 5 عقود فريلانس قانونية"}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                    {isEn
                      ? "Executive 10,000 Corporate Prompts Bank + Freelance Legal Contracts Pack"
                      : "بنك الـ 10,000 برومبت السري للشركات (100 مجال × 100 برومبت) + حزمة عقود الفريلانس"}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-300 leading-relaxed">
                    {isEn
                      ? "Instant download in open text format. Copy-paste executive workflows in seconds + 5 bilingual contracts that safeguard your freelance income."
                      : "تحميل فوري بصيغة نصية مباشرة. انسخ أوامر ذكية جاهزة للشركات في ثوانٍ + ٥ عقود قانونية تحمي أتعابك وتمنع المماطلة وتضاعف دخلك."}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200/90 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                      ✓ {isEn ? "10,000 Prompts (100 Domains)" : "١٠,٠٠٠ برومبت (١٠٠ مجال شركات)"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-200/90 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
                      ✓ {isEn ? "5 Bilingual Contracts" : "٥ عقود فريلانس قانونية ملزمة"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-400/10 px-2.5 py-1 rounded-xl border border-emerald-400/20">
                      ✓ {isEn ? "Instant 1-Click Download" : "تحميل فوري بضغطة واحدة"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ⭐ THE 7-DAY 100% MONEY-BACK GUARANTEE BADGE ⭐ */}
            <div className="rounded-2xl border-2 border-emerald-400/50 bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-neutral-900 p-4 mb-5 text-start shadow-xl shadow-emerald-500/15">
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0">🛡️</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-emerald-300 mb-1">
                    {isEn
                      ? "100% Money-Back Guarantee for 7 Days"
                      : "ضمان استرجاع كامل 100% خلال 7 أيام بدون أي أسئلة"}
                  </h4>
                  <p className="text-[11px] sm:text-xs leading-relaxed text-neutral-200">
                    {isEn
                      ? "Try the platform, explore the 100 tracks, and test the daily lessons. If you don't feel real progress within 7 days, message us and receive an instant 100% refund — no questions asked."
                      : "جرّب المنصة وتصفّح الـ ١٠٠ مسار واستمتع بالدروس العملية.. إن لم تجدها تصنع فارقاً حقيقياً في مهاراتك ودخلك، راسلنا خلال 7 أيام واسترد كامل المبلغ فوراً وبدون أي شروط."}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-400 mb-5 font-medium">
              {isEn
                ? "💡 Less than 0.25 EGP per lesson — an investment that unlocks lasting income opportunities"
                : "💡 أقل من 25 قرشاً للدرس الواحد — استثمار رمزي يفتح لك فرص دخل حقيقية ومستمرة"}
            </p>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-teal-500/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-xl">🚀</span>
              <span>
                {isEn
                  ? "Claim Offer & Unlock 10,000 Prompts Vault →"
                  : "احصل على العرض وافتح خزنة الـ 10,000 برومبت ←"}
              </span>
            </button>
          </div>
        )}

        {/* ================= STEP: FINAL CHECKOUT CONFIRMATION & OFFER ================= */}
        {step.kind === "offer" && (
          <div className="animate-fade-in">
            {/* Account Status Card */}
            <div className="flex items-center justify-between bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 mb-5 text-xs">
              <div>
                <p className="text-neutral-400 font-medium">{isEn ? "Account Status" : "حالة الحساب"}</p>
                <p className="font-bold text-emerald-300 text-sm">
                  {isEn ? "Ready for Instant Activation" : "جاهز للتفعيل الفوري"}
                </p>
              </div>
              <div className="text-end">
                <p className="text-neutral-400 font-medium">{isEn ? "One-Time Investment" : "الاستثمار لمرة واحدة"}</p>
                <p className="font-black text-emerald-400 text-base font-mono">
                  {pricing.priceEgp} {isEn ? "EGP" : "ج.م"}{" "}
                  <span className="line-through text-neutral-500 text-xs font-normal">({pricing.originalPriceEgp})</span>
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1 text-white">
              {isEn
                ? `Your Custom Roadmap is Ready, ${name || "Champion"}!`
                : `خطتك الشخصية جاهزة للانطلاق، ${name || "يا بطل"}!`}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mb-5 leading-relaxed">
              {isEn
                ? "Welcome to your personal breakthrough. All 100 tracks and psychological focus tools are now within reach."
                : "مرحباً بك في نقطة التحوّل. الـ ١٠٠ مسار وأدوات الدعم النفسي بالكامل بين يديك الآن."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-[#0d1614] rounded-2xl p-3.5 border border-white/10 shadow-xs">
                <p className="text-neutral-400">🎯 {isEn ? "Target Discipline" : "مسار انطلاقك"}</p>
                <p className="font-bold mt-1 text-teal-300">
                  {isEn ? archetype.titleEn : archetype.title}
                </p>
              </div>
              <div className="bg-[#0d1614] rounded-2xl p-3.5 border border-white/10 shadow-xs">
                <p className="text-neutral-400">⚡ {isEn ? "Readiness Level" : "مستوى الجاهزية"}</p>
                <p className="font-bold mt-1 text-teal-300">
                  {isEn ? "Ready for Rapid Implementation" : "جاهز للتطبيق السريع"}
                </p>
              </div>
            </div>

            {/* First 4 days roadmap preview */}
            <div className="rounded-2xl border border-white/10 p-4 bg-[#0d1614] mb-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-white">
                  {isEn ? "Your First 4 Days Snapshot" : "نظرة على أول ٤ أيام من خطتك"}
                </p>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {isEn ? "Day 1 Free" : "اليوم الأول مجاناً"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                {(isEn
                  ? ["Core Fundamentals", "AI Tools & Setup", "First Practical Task", "Income Strategies"]
                  : ["أساسيات المهارة", "أدوات الذكاء وتطبيقها", "أول مشروع عملي", "استراتيجيات الدخل"]
                ).map((tool, i) => (
                  <div
                    key={tool}
                    className={`rounded-xl py-2 px-1 ${
                      i === 0
                        ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold"
                        : "bg-white/5 text-neutral-300"
                    }`}
                  >
                    <p className={`font-bold ${i === 0 ? "text-emerald-300" : "text-teal-300"}`}>
                      {isEn ? `Day ${i + 1}` : `يوم ${i + 1}`}
                    </p>
                    <p className="text-neutral-400 mt-0.5 line-clamp-1">{tool}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 👑 VIP Bonus Vault Teaser */}
            <div className="rounded-2xl border border-amber-400/50 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 p-3.5 mb-5 flex items-center justify-between gap-3 text-start">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl shrink-0">👑</span>
                <div>
                  <p className="text-xs font-black text-amber-200">
                    {isEn ? "Bonus VIP Vault: 10,000 Prompts + Contracts" : "بونص VIP متاح للتحميل: بنك الـ 10,000 برومبت + العقود"}
                  </p>
                  <p className="text-[11px] text-neutral-300">
                    {isEn ? "100 corporate domains + 5 freelance contracts ready at checkout" : "١٠٠ مجال شركات + ٥ عقود عمل حر ملزمة متاح إضافتها فوراً"}
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-black bg-amber-400 text-neutral-950 px-2.5 py-1 rounded-full">
                {isEn ? "Instant Download" : "تحميل فوري"}
              </span>
            </div>

            {/* ⭐ 7-Day Guarantee Highlight ⭐ */}
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/30 p-3.5 mb-5 flex items-center gap-3 text-start">
              <span className="text-2xl shrink-0">🛡️</span>
              <p className="text-xs text-neutral-200">
                <b>{isEn ? "7-Day Money-Back Guarantee:" : "ضمان استرجاع 100% خلال 7 أيام:"}</b>{" "}
                {isEn
                  ? "Full instant refund if you aren't satisfied, no questions asked."
                  : "استرداد كامل وفوري إذا لم تكن راضياً بنسبة 100% بدون أي تعقيد."}
              </p>
            </div>

            {/* Big Radiant CTA Button */}
            <button
              type="button"
              onClick={goCheckout}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 mb-4 shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base"
            >
              {isEn
                ? `Confirm Enrollment & Join for Only ${pricing.priceEgp} EGP →`
                : `تأكيد التسجيل والانضمام بـ ${pricing.priceEgp} ج.م فقط ←`}
            </button>

            {/* WhatsApp Support Bar */}
            <div className="rounded-2xl bg-[#0d1614] p-3.5 mb-5 text-center border border-white/10 shadow-xs">
              <p className="text-xs text-neutral-300">
                {isEn ? "Have questions before transfer? Chat with us instantly on WhatsApp: " : "عندك استفسار قبل التحويل؟ كلّمنا واتساب فوراً: "}
                <a
                  href={`https://wa.me/2${payment.supportWhatsapp}`}
                  className="font-bold text-teal-400 hover:underline"
                  dir="ltr"
                >
                  +{payment.supportWhatsapp}
                </a>
              </p>
            </div>

            {/* Deliverables Checklist */}
            <ul className="text-xs space-y-2 mb-5 text-neutral-300 bg-[#0d1614] p-4 rounded-2xl border border-white/10 shadow-xs">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <b>{isEn ? "100 Complete Professional Tracks" : "١٠٠ مسار احترافي كامل"}</b>{" "}
                  {isEn ? "across 10 vital domains" : "في ١٠ أركان حيوية"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <b>{isEn ? "Bilingual Content (Arabic / English)" : "محتوى ثنائي اللغة (عربي / إنجليزي)"}</b>{" "}
                  {isEn ? "with instant 1-click toggle" : "بنقرة واحدة"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <b>{isEn ? `Over ${totalLessons} Practical Lessons` : `أكثر من ${totalLessons} درس تطبيقي`}</b>{" "}
                  {isEn ? "with infographics for every lesson" : "مع رسوم وجرافيكس لكل درس"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <b>{isEn ? "Psychological Advantage Suite" : "أدوات الدعم النفسي"}</b>:{" "}
                  {isEn ? "Pomodoro + Alpha Binaural Beats + Daily Mood Pacing" : "بومودورو + ترددات ألفا للتركيز + فحص طاقة"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <b>{isEn ? "300+ Verified Community Network" : "مجتمع ٣٠٠+ عضو حقيقي"}</b>{" "}
                  {isEn ? "with authentic success stories" : "مع شبكة علاقات وتجارب ملهمة"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <b>{isEn ? "Accredited Certificate of Completion" : "شهادة إتمام معتمدة"}</b>{" "}
                  {isEn ? "for each track you master" : "لكل مسار تنهيه بنجاح"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  <b>{isEn ? "1-Year Full Access" : "وصول لمدة سنة كاملة"}</b> —{" "}
                  {isEn
                    ? `One-time ${pricing.priceEgp} EGP without recurring fees`
                    : `دفعة واحدة ${pricing.priceEgp} ج.م بدون أي اشتراك شهري`}
                </span>
              </li>
            </ul>

            <p className="text-center text-[11px] leading-relaxed text-neutral-400">
              🎁{" "}
              {isEn
                ? "Day 1 of every single track is 100% free — guaranteed quality before any payment"
                : "اليوم الأول من كل مسار من الـ ١٠٠ مفتوح مجاناً — جودة ومصداقية نضمنها لك"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
