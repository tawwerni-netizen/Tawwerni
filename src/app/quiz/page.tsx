"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { brand, pricing, payment } from "@/content/brand";
import { ALL_100_TRACKS, getTrackBySlug, Track100 } from "@/content/tracks100";
import { getCareerPathsForTrack } from "@/content/career-paths";
import { trackLead, trackQuizStarted } from "@/lib/analytics";
import {
  quizQuestions,
  computeArchetype,
  computeReadinessScore,
} from "@/content/marketing-quiz";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";

const totalLessons = ALL_100_TRACKS.reduce((sum, t) => sum + t.totalLessons, 0);

type Step =
  | { kind: "question"; qIndex: number }
  | { kind: "lead" }
  | { kind: "result" };

function buildSteps(): Step[] {
  const steps: Step[] = [];
  quizQuestions.forEach((_, i) => {
    steps.push({ kind: "question", qIndex: i });
  });
  steps.push({ kind: "lead" }, { kind: "result" });
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

const QUIZ_OPTION_THEMES = [
  // 0: Sky Blue / Cyan (Strategic, Focus, Professionalism) -> Option A (أ)
  {
    border: "border-sky-500/40 hover:border-sky-300 focus:border-sky-300",
    bg: "bg-gradient-to-r from-sky-950/40 via-neutral-900/90 to-[#0c1614]",
    hoverBg: "hover:from-sky-950/60 hover:to-[#0f211c]",
    shadow: "shadow-xs hover:shadow-lg hover:shadow-sky-500/20",
    letterBg: "bg-sky-500/20 border-sky-400/60 text-sky-200 group-hover:bg-sky-400 group-hover:text-neutral-950",
    iconBg: "bg-sky-500/15 border-sky-400/30 text-sky-200",
    badgeBg: "bg-sky-400/20 text-sky-100 border-sky-400/50",
    chevronColor: "text-sky-400",
    accentBar: "bg-sky-400",
  },
  // 1: Royal Violet / Electric Purple (High Prestige, Innovation, Future) -> Option B (ب)
  {
    border: "border-purple-500/40 hover:border-purple-300 focus:border-purple-300",
    bg: "bg-gradient-to-r from-purple-950/40 via-neutral-900/90 to-[#0c1614]",
    hoverBg: "hover:from-purple-950/60 hover:to-[#181124]",
    shadow: "shadow-xs hover:shadow-lg hover:shadow-purple-500/20",
    letterBg: "bg-purple-500/20 border-purple-400/60 text-purple-200 group-hover:bg-purple-400 group-hover:text-white",
    iconBg: "bg-purple-500/15 border-purple-400/30 text-purple-200",
    badgeBg: "bg-purple-400/20 text-purple-100 border-purple-400/50",
    chevronColor: "text-purple-400",
    accentBar: "bg-purple-400",
  },
  // 2: Vivid Emerald / Mint (Growth, Income, Action) -> Option C (ج)
  {
    border: "border-emerald-500/40 hover:border-emerald-300 focus:border-emerald-300",
    bg: "bg-gradient-to-r from-emerald-950/40 via-neutral-900/90 to-[#0c1614]",
    hoverBg: "hover:from-emerald-950/60 hover:to-[#0f241d]",
    shadow: "shadow-xs hover:shadow-lg hover:shadow-emerald-500/20",
    letterBg: "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 group-hover:bg-emerald-400 group-hover:text-neutral-950",
    iconBg: "bg-emerald-500/15 border-emerald-400/30 text-emerald-200",
    badgeBg: "bg-emerald-400/20 text-emerald-100 border-emerald-400/50",
    chevronColor: "text-emerald-400",
    accentBar: "bg-emerald-400",
  },
  // 3: Luminous Golden Amber (Wealth, Expansion, Mastery) -> Option D (د)
  {
    border: "border-amber-500/40 hover:border-amber-300 focus:border-amber-300",
    bg: "bg-gradient-to-r from-amber-950/40 via-neutral-900/90 to-[#0c1614]",
    hoverBg: "hover:from-amber-950/60 hover:to-[#1a170f]",
    shadow: "shadow-xs hover:shadow-lg hover:shadow-amber-500/20",
    letterBg: "bg-amber-400/20 border-amber-300/60 text-yellow-100 group-hover:bg-amber-300 group-hover:text-neutral-950",
    iconBg: "bg-amber-500/15 border-amber-400/30 text-yellow-100",
    badgeBg: "bg-amber-400/20 text-yellow-100 border-amber-300/50",
    chevronColor: "text-amber-300",
    accentBar: "bg-amber-400",
  },
  // 4: Rose / Coral Crimson (Creative, Breakthrough, Momentum) -> Option E (هـ)
  {
    border: "border-rose-500/40 hover:border-rose-300 focus:border-rose-300",
    bg: "bg-gradient-to-r from-rose-950/40 via-neutral-900/90 to-[#0c1614]",
    hoverBg: "hover:from-rose-950/60 hover:to-[#221118]",
    shadow: "shadow-xs hover:shadow-lg hover:shadow-rose-500/20",
    letterBg: "bg-rose-500/20 border-rose-400/60 text-rose-200 group-hover:bg-rose-400 group-hover:text-white",
    iconBg: "bg-rose-500/15 border-rose-400/30 text-rose-200",
    badgeBg: "bg-rose-400/20 text-rose-100 border-rose-400/50",
    chevronColor: "text-rose-400",
    accentBar: "bg-rose-400",
  },
  // 5: Teal / Aquamarine (Clarity, Balance, Expansion) -> Option F (و)
  {
    border: "border-teal-500/40 hover:border-teal-300 focus:border-teal-300",
    bg: "bg-gradient-to-r from-teal-950/40 via-neutral-900/90 to-[#0c1614]",
    hoverBg: "hover:from-teal-950/60 hover:to-[#0f2422]",
    shadow: "shadow-xs hover:shadow-lg hover:shadow-teal-500/20",
    letterBg: "bg-teal-500/20 border-teal-400/60 text-teal-200 group-hover:bg-teal-400 group-hover:text-neutral-950",
    iconBg: "bg-teal-500/15 border-teal-400/30 text-teal-200",
    badgeBg: "bg-teal-400/20 text-teal-100 border-teal-400/50",
    chevronColor: "text-teal-400",
    accentBar: "bg-teal-400",
  },
];

export default function QuizPage() {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const steps = useMemo(() => buildSteps(), []);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [xp, setXp] = useState(25);
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

  const primarySlug = recommendedTracks[0]?.slug ?? "prompt-engineering-mastery";
  const primaryTrack = recommendedTracks[0];
  const relatedCareerPaths = useMemo(() => {
    return getCareerPathsForTrack(primarySlug);
  }, [primarySlug]);
  const primaryCareerPath = relatedCareerPaths[0]?.careerPath;

  const selectedGoalDef = useMemo(() => {
    const goalQ = quizQuestions.find((q) => q.id === "goal");
    return goalQ?.options.find((o) => o.value === answers["goal"]);
  }, [answers]);

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

  async function submitLead(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSaving(true);
    try {
      await fetch("/api/quiz/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, answers }),
      });
      trackLead();
    } catch {
      /* continue smoothly even on connection glitch */
    } finally {
      setSaving(false);
      playChime("fanfare", soundEnabled);
      next();
    }
  }

  function goCheckout(productType: "track" | "career_path" | "all_access" = "career_path", customSlug?: string) {
    const slug =
      customSlug ||
      (productType === "all_access"
        ? "all-access"
        : productType === "career_path" && primaryCareerPath
        ? primaryCareerPath.slug
        : primarySlug);
    sessionStorage.setItem(
      "tawwerni_checkout",
      JSON.stringify({ email, name, courseSlug: slug, productType })
    );
    router.push(`/quiz/checkout?type=${productType}&slug=${encodeURIComponent(slug)}`);
  }

  function startMissionOne() {
    const targetUrl = `/app/learn/${primarySlug}/1`;
    router.push(
      `/login?email=${encodeURIComponent(email)}&signup=1&next=${encodeURIComponent(targetUrl)}`
    );
  }

  const questionNumber = step.kind === "question" ? step.qIndex + 1 : 0;
  const progressPercent = Math.round((questionNumber / quizQuestions.length) * 100);

  const phaseLabelsAr = [
    "الهدف والأولوية القصوى",
    "المستوى والجاهزية الحالية",
    "أكبر عائق وتحدي سابق",
    "الوتيرة والالتزام اليومي",
  ];
  const phaseLabelsEn = [
    "Primary Goal & Focus",
    "Current Experience Level",
    "Past Roadblocks & Friction",
    "Daily Commitment & Pace",
  ];

  const currentPhase = isEn
    ? phaseLabelsEn[questionNumber - 1] ?? "Diagnostic"
    : phaseLabelsAr[questionNumber - 1] ?? "التشخيص";

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
            {stepIndex > 0 ? (
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

      {/* Gamified Progress Bar for Questions */}
      {step.kind === "question" && (
        <div className="relative z-30 max-w-xl mx-auto w-full px-5 pt-3">
          <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 mb-1.5">
            <span className="text-teal-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span>{currentPhase}</span>
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
        {/* ================= STEP 1 TO 4: DIAGNOSTIC QUESTIONS ================= */}
        {step.kind === "question" && (
          <div className="animate-fade-in">
            {/* Top diagnostic reassurance pill on first question */}
            {step.qIndex === 0 && (
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-black text-emerald-300 shadow-sm">
                  <span className="text-amber-400">⚡</span>
                  <span>{isEn ? "60-Second Diagnostic · Personalized Roadmap" : "تشخيص مخصص في ٦٠ ثانية · يحدد مسارك وخطة عملك"}</span>
                </span>
              </div>
            )}

            {/* Question Header Card */}
            <div className="mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-neutral-300 mb-2.5">
                <span className="text-amber-300 font-black">Q{questionNumber}</span>
                <span className="text-neutral-500">·</span>
                <span className="text-emerald-400 font-mono">+25 XP</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {isEn ? quizQuestions[step.qIndex].questionEn : quizQuestions[step.qIndex].question}
              </h1>

              {(quizQuestions[step.qIndex].subtitle || quizQuestions[step.qIndex].subtitleEn) && (
                <p className="text-xs sm:text-sm text-neutral-300 mt-1.5 leading-relaxed">
                  {isEn ? quizQuestions[step.qIndex].subtitleEn : quizQuestions[step.qIndex].subtitle}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {quizQuestions[step.qIndex].options.map((opt, idx) => {
                const theme = QUIZ_OPTION_THEMES[idx % QUIZ_OPTION_THEMES.length];
                const letter = isEn
                  ? String.fromCharCode(65 + idx)
                  : ["أ", "ب", "ج", "د", "هـ", "و", "ز", "ح"][idx] ?? `${idx + 1}`;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => answerQuestion(quizQuestions[step.qIndex].id, opt.value)}
                    className={`group relative w-full flex items-center gap-3.5 sm:gap-4 rounded-2xl border-2 p-3.5 sm:p-4 text-xs sm:text-sm text-start transition-all duration-200 active:scale-98 cursor-pointer overflow-hidden backdrop-blur-md ${theme.border} ${theme.bg} ${theme.hoverBg} ${theme.shadow} hover:-translate-y-0.5 ${
                      opt.highlight ? "ring-1 ring-white/20 shadow-lg" : ""
                    }`}
                  >
                    {/* Visual Active Indicator Bar */}
                    <span
                      className={`absolute start-0 top-0 bottom-0 w-1.5 rounded-s ${theme.accentBar}`}
                    />

                    {/* Letter Key Pill */}
                    <span
                      className={`w-9 h-9 rounded-xl border-2 font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-all duration-200 shadow-xs ${theme.letterBg}`}
                    >
                      {letter}
                    </span>

                    {/* Icon in frosted pill */}
                    {opt.icon && (
                      <span
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center text-xl sm:text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${theme.iconBg}`}
                      >
                        {opt.icon}
                      </span>
                    )}

                    {/* Label & Optional Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-white text-xs sm:text-sm leading-snug drop-shadow-xs group-hover:text-white">
                          {isEn ? opt.labelEn || opt.label : opt.label}
                        </span>

                        {(opt.badge || opt.badgeEn) && (
                          <span
                            className={`text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-xs ${theme.badgeBg}`}
                          >
                            {isEn ? opt.badgeEn : opt.badge}
                          </span>
                        )}

                        {opt.highlight && !opt.badge && (
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-xs ${theme.badgeBg}`}>
                            {isEn ? "Recommended ⭐" : "موصى به ⭐"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow / Chevron */}
                    <span
                      className={`text-base font-black shrink-0 transition-all duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${theme.chevronColor}`}
                    >
                      {isEn ? "›" : "‹"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 5: FRICTIONLESS LEAD CAPTURE ================= */}
        {step.kind === "lead" && (
          <div className="animate-fade-in text-center">
            <span className="text-xs font-black text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 inline-flex items-center gap-1.5 mb-3">
              <span className="text-amber-400">✨</span>
              <span>{isEn ? "Diagnostic Complete · Ready to Unlock" : "اكتمل التقييم التشخيصي بنجاح"}</span>
            </span>

            <h2 className="text-2xl sm:text-3xl font-black mb-2 text-white">
              {isEn ? (
                <>
                  Enter your details to reveal your <br />
                  <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    Personalized 28-Day Blueprint
                  </span>
                </>
              ) : (
                <>
                  أدخل اسمك وبريدك لعرض <br />
                  <span className="bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">
                    خطتك التشخيصية ومهمتك الأولى
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto mb-6 leading-relaxed">
              {isEn
                ? "We tailor your daily execution habit, compute your AI Readiness Score, and prepare your Day 1 free mission."
                : "سنقوم بتهيئة خطة التعلم اليومية لمدة ٢٨ يومًا، واحتساب مؤشر جاهزيتك، وتفعيل مهمة اليوم الأول مجاناً فوراً."}
            </p>

            <form onSubmit={submitLead} className="space-y-3.5 max-w-md mx-auto text-start">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isEn ? "Your Full Name" : "اسمك الكريم"}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? "e.g. Ahmed Ali" : "مثال: أحمد علي"}
                  className="w-full border-2 border-white/15 bg-[#0d1614] text-white rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:outline-hidden transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                  {isEn ? "Email Address" : "البريد الإلكتروني"}
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full border-2 border-white/15 bg-[#0d1614] text-white rounded-2xl px-4 py-3.5 text-sm focus:border-emerald-400 focus:outline-hidden transition"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !email.includes("@") || !name.trim()}
                className="w-full mt-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-neutral-950 font-black rounded-full py-4 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base disabled:opacity-50 cursor-pointer"
              >
                {saving
                  ? isEn ? "Generating Your Blueprint..." : "جاري بناء خطتك التشخيصية..."
                  : isEn ? "Reveal My Blueprint & Mission #1 →" : "استعرض خطتي ومهمتي الأولى الآن ←"}
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 mt-5">
              <span className="flex items-center gap-1">
                <span>🔒</span>
                <span>{isEn ? "Zero Spam" : "حماية كاملة للخصوصية"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>⚡</span>
                <span>{isEn ? "Instant Access" : "عرض فوري مباشر"}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>🎁</span>
                <span>{isEn ? "Day 1 Free" : "اليوم الأول مجاني"}</span>
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 6: DIAGNOSTIC REPORT, MISSION #1 & PRO OFFER ================= */}
        {step.kind === "result" && (
          <div className="animate-fade-in relative text-center">
            <ConfettiCanvas />

            {/* Official Certification Ribbon */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black mb-3">
              <span>✨</span>
              <span>{isEn ? `Diagnostic Blueprint for ${name || "Learner"}` : `الخطة التشخيصية الرسمية لـ ${name || "المتعلم"}`}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black mb-1 text-white">
              {isEn ? `${name || "Friend"}, Here is Your Strategic Blueprint` : `يا ${name || "بطل"}، هذه خارطة طريقك العملية`}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mb-5">
              {isEn
                ? "Based on your diagnosis, here is your customized role, readiness score, and Day 1 action plan"
                : "بناءً على تشخيص أهدافك، حددنا نمطك القيادي، مؤشر جاهزيتك، ومهمتك الأولى للبدء فوراً"}
            </p>

            {/* Score & Tier Card */}
            <div className="relative rounded-3xl bg-gradient-to-br from-[#0e1a17] via-[#0d1614] to-[#12241e] border-2 border-emerald-500/40 p-5 sm:p-6 mb-5 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start shadow-2xl shadow-emerald-500/20 overflow-hidden">
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
                  <span>{isEn ? "Top 15% Digital Execution Potential" : "أعلى ١٥٪ في مؤشر الجاهزية والتطبيق السريع"}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isEn
                    ? "High potential for rapid career momentum & skill monetization"
                    : "إمكانيات ممتازة لتحقيق تقدم مهني وصنع قيمة عملية ملموسة"}
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  {isEn
                    ? "Your responses indicate high readiness to convert 10-15 minutes of daily practice into real momentum without overwhelm."
                    : "تشخيصك يثبت أنك جاهز لتحويل ١٠ إلى ١٥ دقيقة يومياً من التطبيق المباشر إلى مهارة قوية قابلة للتسييل وبناء السمعة المهنية."}
                </p>
              </div>
            </div>

            {/* Clear Strategic Recommendation Rationale ("Why this recommendation") */}
            <div className="rounded-3xl bg-gradient-to-br from-teal-950/60 via-[#0d1c18] to-emerald-950/40 border-2 border-teal-500/40 p-5 sm:p-6 mb-5 text-start shadow-xl shadow-teal-500/10 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 text-sm">
                  🎯
                </span>
                <span className="text-xs font-black text-teal-300 uppercase tracking-wider">
                  {isEn ? "Why This Exact Recommendation For You?" : "لماذا هذا الترشيح تحديدًا لخطة نجاحك؟"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                {isEn ? (
                  <>
                    Because your stated priority is{" "}
                    <b className="text-white">
                      &ldquo;{selectedGoalDef?.labelEn || "Mastering high-impact skills"}&rdquo;
                    </b>
                    , the essential foundational skill you need first is{" "}
                    <b className="text-emerald-300">
                      &ldquo;{primaryTrack?.titleEn || archetype.titleEn}&rdquo;
                    </b>
                    . Instead of getting overwhelmed by dozens of scattered tutorials, Day 1 gives you a focused 10-minute micro-mission so you experience real momentum today.
                  </>
                ) : (
                  <>
                    لأنك حددت أولويتك الأساسية:{" "}
                    <b className="text-white">
                      «{selectedGoalDef?.label || "تطوير مهارات عملية جديدة"}»
                    </b>
                    ، فإن المهارة الأولى والحاسمة التي تحتاج لإتقانها أولاً هي:{" "}
                    <b className="text-emerald-300">
                      «{primaryTrack?.titleAr || archetype.title}»
                    </b>
                    . وبدل التشتت بين مئات الفيديوهات والمصادر غير المرتبة، اليوم الأول يضعك أمام مهمة تطبيقية واحدة مدتها ١٠ دقائق لتخرج بأول نتيجة حقيقية بيدك اليوم.
                  </>
                )}
              </p>
            </div>

            {/* Archetype Profile Card */}
            <div className="rounded-3xl bg-[#0d1614] border-2 border-teal-500/40 p-5 sm:p-6 mb-5 text-start shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-black text-teal-400 tracking-wider">
                  {isEn ? "YOUR TARGET LEADERSHIP ARCHETYPE" : "نمطك المهني المستهدف في طوّرني"}
                </span>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  ✨ {isEn ? "Personalized Match" : "مسارك المخصص"}
                </span>
              </div>

              <p className="text-xl sm:text-2xl font-black mb-1 text-white flex items-center gap-3">
                <span className="text-3xl">{archetype.icon}</span>
                <span>{isEn ? archetype.titleEn : archetype.title}</span>
              </p>
              <p className="text-xs text-teal-300 font-bold mb-3">
                {isEn ? archetype.subtitleEn : archetype.subtitle}
              </p>

              {/* Market Demand Pill */}
              <div className="mb-4 p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center gap-2.5">
                <span className="text-xl">📈</span>
                <div>
                  <p className="text-[10px] font-bold text-teal-300">
                    {isEn ? "Market Demand & Practical Application:" : "مستوى الطلب وسوق التطبيق العملي:"}
                  </p>
                  <p className="text-xs sm:text-sm font-black text-white">
                    {isEn ? archetype.salaryRangeEn : archetype.salaryRangeAr}
                  </p>
                </div>
              </div>

              {/* Superpowers */}
              <div className="mb-3">
                <p className="text-[11px] font-bold text-neutral-400 mb-2">
                  {isEn ? "Core Superpowers You Will Build:" : "المهارات العملية التي ستتقنها خطوة بخطوة:"}
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

            {/* 28-Day Execution Milestones Roadmap */}
            <div className="rounded-3xl bg-[#0d1614] border border-white/10 p-5 mb-5 text-start shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-black uppercase text-neutral-200 flex items-center gap-1.5">
                  <span>🗺️</span>
                  <span>{isEn ? "Your 28-Day Execution Roadmap" : "خارطة طريقك خلال ٢٨ يومًا (١٠ دقائق يوميًا)"}</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {isEn ? "Zero Overwhelm" : "بدون تشتت"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  {
                    week: isEn ? "Week 1 (Days 1–7)" : "الأسبوع الأول (الأيام ١–٧)",
                    title: isEn ? "Core Foundation & First Tangible Win" : "التأسيس العملي وإنتاج أول مخرج ملموس بيدك",
                    badge: isEn ? "Day 1 Free 🎁" : "اليوم الأول مجاني 🎁",
                  },
                  {
                    week: isEn ? "Week 2 (Days 8–14)" : "الأسبوع الثاني (الأيام ٨–١٤)",
                    title: isEn ? "Tool Mastery & Workflow Automation" : "إتقان الأدوات الذكية وأتمتة المهام اليومية",
                    badge: isEn ? "Speed ⚡" : "تسارع ⚡",
                  },
                  {
                    week: isEn ? "Week 3 (Days 15–21)" : "الأسبوع الثالث (الأيام ١٥–٢١)",
                    title: isEn ? "Live Real-World Projects & Portfolio" : "بناء مشاريع واقعية ومعرض أعمال ملموس",
                    badge: isEn ? "Portfolio 💼" : "معرض أعمال 💼",
                  },
                  {
                    week: isEn ? "Week 4 (Days 22–28)" : "الأسبوع الرابع (الأيام ٢٢–٢٨)",
                    title: isEn ? "Monetization, Client Outreach & Verified Digital Certification" : "تسعير الخدمات، اقتناص العملاء وشهادة الإتمام الرقمية الموثقة",
                    badge: isEn ? "Income 💰" : "دخل وشهادة إتمام 🎓",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-amber-300 font-mono">{item.week}</span>
                      <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-white mt-1">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= HERO ACTION 1: MISSION #1 TEST DRIVE (FREE) ================= */}
            <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-950/70 via-[#0b1c17] to-neutral-900 p-5 sm:p-6 mb-5 text-start shadow-2xl shadow-emerald-500/20 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl" />

              <div className="flex items-start gap-3.5 relative z-10 mb-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-neutral-950 flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-emerald-500/30 font-black">
                  🚀
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-emerald-400 text-neutral-950 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      {isEn ? "TEST DRIVE · DAY 1 FREE" : "مهمتك الأولى · اليوم الأول مجاني بالكامل"}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug">
                    {isEn ? archetype.firstMissionTitleEn : archetype.firstMissionTitleAr}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-300 leading-relaxed">
                    {isEn ? archetype.firstMissionGoalEn : archetype.firstMissionGoalAr}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={startMissionOne}
                className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🚀</span>
                <span>{isEn ? "Start Mission #1 Free Now (Day 1) →" : "ابدأ مهمتك الأولى الآن مجانًا (Day 1) ←"}</span>
              </button>

              <p className="text-center text-[10px] text-neutral-400 mt-2.5">
                {isEn
                  ? "✓ 100% Free · No credit card required · Test the practical methodology firsthand"
                  : "✓ مجاني ١٠٠٪ بدون بطاقة بنكية · جرّب بنفسك أسلوب التعلم وجودة التطبيق"}
              </p>
            </div>

            {/* ================= HERO ACTION 2: CAREER PATH BUNDLE ================= */}
            <div className="rounded-3xl border-2 border-emerald-400 bg-gradient-to-br from-[#0e221b] via-[#0d1c18] to-[#0c1815] p-5 sm:p-7 mb-4 text-start shadow-2xl shadow-emerald-500/15 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-16 -left-16 w-40 h-40 rounded-full bg-emerald-400/15 blur-2xl" />

              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/40 text-xs font-black">
                  <span>🌟</span>
                  <span>{isEn ? "Recommended Career Path Bundle" : "المسار المهني المتكامل الموصى به"}</span>
                </span>

                <span className="text-[11px] font-black text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                  {isEn ? "Complete Career Roadmap" : "خريطة طريق مهنية متكاملة"}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                {primaryCareerPath
                  ? (isEn ? primaryCareerPath.titleEn : primaryCareerPath.titleAr)
                  : (isEn ? "Full Professional Roadmap" : "خارطة طريق وظيفية متكاملة")}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                {isEn
                  ? "Unlocks your recommended track PLUS all included companion tracks with a 1-year full access pass."
                  : "يفتح مسارك الموصى به بالكامل بالإضافة إلى كافة المسارات التخصصية المندرجة في هذا التخصص باشتراك سنوي كامل (365 يوماً)."}
              </p>

              {/* Price Banner */}
              <div className="my-4 p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-baseline justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2" dir="ltr">
                    <span className="text-4xl sm:text-5xl font-black font-mono text-white">
                      {pricing.careerPathPriceEgp}
                    </span>
                    <span className="text-base font-black text-emerald-400">
                      {isEn ? "EGP" : "ج.م"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {isEn ? "1-Year Full Access · 365 Days · Unlocks all bundle tracks" : "اشتراك لمدة عام كامل · 365 يوماً · يفتح كافة مسارات الحزمة"}
                  </p>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <ul className="space-y-2 text-xs text-neutral-200 mb-5">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><b>{isEn ? "All Included Specialized Tracks Unlocked" : "فتح شامل لكافة المسارات التخصصية المندرجة"}</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><b>{isEn ? "Complete Multi-Project Portfolio" : "بورتفوليو مشاريع متكامل يؤهلك لسوق العمل والحر"}</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><b>{isEn ? "Verified Digital Certificates" : "شهادات إتمام رقمية موثقة برمز QR لكل مسار منجز"}</b></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><b>{isEn ? "24/7 AI Mentor (Faheem)" : "كوتش الذكاء الاصطناعي (فهيم) يرشدك خطوة بخطوة"}</b></span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => goCheckout("career_path")}
                className="w-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-neutral-950 font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>⚡</span>
                <span>{isEn ? `Get Full Career Path (${pricing.careerPathPriceEgp} EGP / Year) →` : `اشترك في المسار المهني المتكامل (${pricing.careerPathPriceEgp} ج.م / سنة) ←`}</span>
              </button>
            </div>

            {/* ================= HERO ACTION 3: INDIVIDUAL TRACK ================= */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#121815] to-[#0a0f0d] p-5 sm:p-6 mb-5 text-start shadow-lg relative">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-neutral-300 border border-white/10 text-xs font-bold">
                  <span>🎯</span>
                  <span>{isEn ? "Or Get Just This Single Track" : "أو اشترك في هذا المسار الفردي فقط"}</span>
                </span>
                <span className="text-xs font-mono font-bold text-teal-400">
                  {pricing.trackPriceEgp} {isEn ? "EGP" : "ج.م / سنة"}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">
                {primaryTrack ? (isEn ? primaryTrack.titleEn : primaryTrack.titleAr) : (isEn ? "Single Track" : "المسار الفردي")}
              </h4>
              <p className="text-xs text-neutral-400 mb-4">
                {isEn
                  ? "Master this single specific skill with its full 28-day roadmap, practical mission outputs, and verifiable completion certificate."
                  : "أتقن هذه المهارة المحددة بمفردها مع خطتها الـ 28 يومًا ومشاريعها وشهادتها الرقمية الموثقة برمز QR."}
              </p>

              <button
                type="button"
                onClick={() => goCheckout("track")}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-bold rounded-full py-3 text-xs sm:text-sm border border-white/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isEn ? `Get Single Track Only (${pricing.trackPriceEgp} EGP / Year) →` : `اشترك في هذا المسار فقط (${pricing.trackPriceEgp} ج.م / سنة) ←`}</span>
              </button>
            </div>

            {/* ================= HERO ACTION 4: ALL-ACCESS PASS ================= */}
            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-[#14120e] to-[#0a0f0d] p-5 sm:p-6 mb-5 text-start shadow-xl relative">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                  <span>👑</span>
                  <span>{isEn ? "All-Access Pass · Full Library" : "المفتاح الشامل · كل المنصة"}</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {pricing.allAccessPriceEgp} {isEn ? "EGP / Year" : "ج.م / سنة"}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">
                {isEn ? "All-Access Pass (All 100 Tracks & 12 Career Paths)" : "الوصول الشامل لكافة الكورسات والمسارات المهنية"}
              </h4>
              <p className="text-xs text-neutral-300 mb-4">
                {isEn
                  ? "Unlock all 100 practical tracks, all 12 career paths, the 10,000 Prompts Vault, and continuous updates for 1 full year."
                  : "المفتاح الذهبي لفتح كافة الـ 100 مسار، والـ 12 مساراً مهنياً، وبنك الـ 10,000 برومبت وكافة التحديثات لمدة عام كامل (365 يوماً)."}
              </p>

              <button
                type="button"
                onClick={() => goCheckout("all_access")}
                className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-neutral-950 font-black rounded-full py-3.5 text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>👑</span>
                <span>{isEn ? `Get All-Access Pass (${pricing.allAccessPriceEgp} EGP / Year) →` : `اشترك في الوصول الشامل لكافة الكورسات (${pricing.allAccessPriceEgp} ج.م / سنة) ←`}</span>
              </button>
            </div>

            {/* 💎 1-Year Full Access & Free Preview Reassurance 💎 */}
            <div className="rounded-2xl border border-teal-400/40 bg-teal-500/10 p-3.5 mb-5 flex items-start gap-2.5">
              <span className="text-2xl shrink-0">💎</span>
              <div>
                <p className="text-xs font-bold text-teal-300">
                  {isEn ? "1-Year Full Access · Day 1 Free Preview" : "اشتراك لمدة عام كامل (365 يومًا) · اليوم الأول مجاني بالكامل"}
                </p>
                <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                  {isEn
                    ? "Full access for 365 days from activation with zero hidden fees. You can start Day 1 completely free before checkout. Verified digital certificates and all updates during your year are included."
                    : "صلاحية وصول كاملة لمدة 365 يوماً من تاريخ التفعيل بدون أي رسوم خفية. يمكنك تجربة اليوم الأول مجاناً بالكامل قبل الدفع. شهادات الإتمام الموثقة برمز QR وكافة تحديثات المنصة مشمولة طوال فترة اشتراكك."}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Assistance */}
            <div className="rounded-2xl bg-[#0d1614] p-3.5 mb-2 text-center border border-white/10 shadow-xs">
              <p className="text-xs text-neutral-300">
                {isEn ? "Have questions? Chat directly with our team on WhatsApp: " : "عندك أي استفسار؟ كلّمنا واتساب مباشرة: "}
                <a
                  href={`https://wa.me/2${payment.supportWhatsapp}`}
                  className="font-bold text-teal-400 hover:underline"
                  dir="ltr"
                >
                  +{payment.supportWhatsapp}
                </a>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
