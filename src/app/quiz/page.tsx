"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { brand, pricing, payment } from "@/content/brand";
import { ALL_100_TRACKS } from "@/content/tracks100";
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

const total100Tracks = ALL_100_TRACKS.length;
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

  const step = steps[stepIndex];

  useEffect(() => {
    trackQuizStarted();
  }, []);

  const archetype = useMemo(() => computeArchetype(answers), [answers]);
  const score = useMemo(() => computeReadinessScore(answers), [answers]);

  function next() {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }
  function back() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function answerQuestion(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
    next();
  }

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
    sessionStorage.setItem("tawwerni_checkout", JSON.stringify({ email, name }));
    router.push("/quiz/checkout");
  }

  const questionNumber = step.kind === "question" ? step.qIndex + 1 : 0;

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors"
    >
      {/* Quiz Top Navigation Bar */}
      <div className="sticky top-0 z-30 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <div>
            {stepIndex > 0 && step.kind !== "offer" ? (
              <button
                type="button"
                onClick={back}
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                {isEn ? "‹ Back" : "‹ رجوع"}
              </button>
            ) : (
              <Link
                href="/"
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                {isEn ? "‹ Home" : "‹ الرئيسية"}
              </Link>
            )}
          </div>

          <LogoLink size={28} href="/" />

          <div className="flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Progress Bar for Questions */}
      {step.kind === "question" && (
        <div className="max-w-lg mx-auto w-full px-4 pt-3">
          <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${(questionNumber / quizQuestions.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            <span>
              {isEn
                ? `Question ${questionNumber} of ${quizQuestions.length}`
                : `سؤال ${questionNumber} من ${quizQuestions.length}`}
            </span>
            <span>{Math.round((questionNumber / quizQuestions.length) * 100)}%</span>
          </div>
        </div>
      )}

      {/* Step Content Container */}
      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-6">
        {/* Step 1: Role Intro */}
        {step.kind === "roleIntro" && (
          <div className="animate-fade-in">
            <div className="mb-7 text-center">
              <span className="inline-block rounded-full bg-teal-500/10 border border-teal-500/30 px-3.5 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 mb-3">
                {isEn ? "The 28-Day Future Skills Challenge" : "تحدي مهارات المستقبل في ٢٨ يوم"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                {isEn ? (
                  <>
                    Make AI & Future Tech <br />
                    <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                      Work Directly For You
                    </span>
                  </>
                ) : (
                  <>
                    اجعل الذكاء الاصطناعي والتكنولوجيا <br />
                    <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
                      تعمل لصالحك وتحقق أهدافك
                    </span>
                  </>
                )}
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                {isEn
                  ? "Answer a few quick questions to customize your personalized 28-day roadmap."
                  : "جاوب على بضعة أسئلة سريعة لنبني خطتك المخصصة والمثالية ليومك."}
              </p>
            </div>

            <p className="mb-4 text-center text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {isEn ? "How do you best describe yourself?" : "كيف تصف نفسك وتطلعاتك حاليًا؟"}
            </p>

            <div className="mb-3.5 grid grid-cols-2 gap-3.5">
              {[
                {
                  icon: "👨‍💼",
                  badge: isEn ? "Career Track" : "مسار وظيفي",
                  label: isEn ? "Company Professional" : "موظف في شركة",
                  desc: isEn ? "Accelerate promotion & AI mastery" : "أريد الترقية والتميز بالذكاء الاصطناعي",
                  value: "employee",
                },
                {
                  icon: "🚀",
                  badge: isEn ? "Growth Track" : "مسار دخل",
                  label: isEn ? "Founder / Freelancer" : "صاحب مشروع أو فريلانسر",
                  desc: isEn ? "Build profitable income streams" : "أريد زيادة دخلي وتوسيع أعمالي",
                  value: "founder",
                },
              ].map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    setRole(o.value);
                    next();
                  }}
                  className="relative flex flex-col items-center justify-center p-4 rounded-3xl border-2 border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 active:scale-95 group text-center overflow-hidden"
                >
                  <div className="mb-2 w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {o.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 mb-0.5 tracking-wider">
                    {o.badge}
                  </span>
                  <span className="text-xs font-black text-neutral-900 dark:text-white mb-1">
                    {o.label}
                  </span>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-snug">
                    {o.desc}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setRole("exploring");
                next();
              }}
              className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-teal-500 hover:bg-teal-500/5 hover:shadow-md transition-all active:scale-98 text-xs font-bold text-neutral-800 dark:text-neutral-200"
            >
              <span className="text-lg">🌱</span>
              <span>{isEn ? "Exploring for personal mastery & learning" : "أستكشف المجال لشغفي الشخصي وبناء المعرفة"}</span>
            </button>

            <p className="mt-6 text-center text-[11px] text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "✓ 2 Minutes · ✓ Instant Analysis · ✓ No Credit Card Required"
                : "✓ دقيقتان فقط · ✓ نتيجة فورية · ✓ بدون بطاقة بنكية"}
            </p>
          </div>
        )}

        {/* Step 2: Social Proof & Platform Inventory */}
        {step.kind === "socialProof" && (
          <div className="text-center pt-2 animate-fade-in">
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="text-2xl font-black mb-2">
              {isEn ? "A Complete Professional Ecosystem Awaits" : "منظومة تعليمية متكاملة بانتظارك"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-5 max-w-sm mx-auto leading-relaxed">
              {isEn
                ? "Bilingual (Arabic / English) hands-on curriculum built upon behavioral psychology and micro-habits"
                : "محتوى ثنائي اللغة (عربي / إنجليزي) مبني على أحدث علوم النفس السلوكية والتطبيق اليومي"}
            </p>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                {
                  n: "100",
                  l: isEn ? "Pro Tracks" : "مسار احترافي",
                },
                {
                  n: `${totalLessons}+`,
                  l: isEn ? "Practical Lessons" : "درس عملي",
                },
                {
                  n: "15",
                  l: isEn ? "Mins / Day" : "دقيقة/يوم",
                },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-3 shadow-xs"
                >
                  <p className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">{s.n}</p>
                  <p className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200/60 dark:border-teal-800/60 p-3.5 text-xs text-teal-950 dark:text-teal-200 mb-6 shadow-xs leading-relaxed">
              ✨{" "}
              {isEn ? (
                <>
                  <b>Day 1 of ALL 100 tracks is 100% free</b> — experience the method first-hand before deciding.
                </>
              ) : (
                <>
                  <b>اليوم الأول في كل الـ ١٠٠ مسار مفتوح مجانًا بالكامل</b> — جرّب عمليًا وبنفسك قبل أي التزام.
                </>
              )}
            </div>

            <p className="font-bold text-neutral-800 dark:text-neutral-200 mb-4 text-xs sm:text-sm">
              {isEn
                ? "Let's build your tailored roadmap in 2 minutes:"
                : "دعنا نحدد المسار الأنسب لطموحاتك — دقيقتان فقط:"}
            </p>
            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {isEn ? "Start Assessment Now →" : "ابدأ التقييم الآن ←"}
            </button>
          </div>
        )}

        {/* Step: Questions */}
        {step.kind === "question" && (
          <div className="animate-fade-in">
            <h2 className="text-base sm:text-lg font-bold mb-1 leading-snug">
              {isEn ? quizQuestions[step.qIndex].questionEn : quizQuestions[step.qIndex].question}
            </h2>
            {(quizQuestions[step.qIndex].subtitle || quizQuestions[step.qIndex].subtitleEn) && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                {isEn ? quizQuestions[step.qIndex].subtitleEn : quizQuestions[step.qIndex].subtitle}
              </p>
            )}

            <div className="space-y-3 mt-4">
              {quizQuestions[step.qIndex].options.map((opt, idx) => {
                const letter = isEn
                  ? String.fromCharCode(65 + idx)
                  : ["أ", "ب", "ج", "د", "هـ"][idx] ?? `${idx + 1}`;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => answerQuestion(quizQuestions[step.qIndex].id, opt.value)}
                    className="group w-full flex items-center gap-3.5 rounded-2xl border-2 border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 text-xs sm:text-sm text-start hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-200 active:scale-98"
                  >
                    <span className="w-7 h-7 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-emerald-500 group-hover:text-white font-bold text-xs flex items-center justify-center shrink-0 transition-colors">
                      {letter}
                    </span>
                    {opt.icon && (
                      <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">
                        {opt.icon}
                      </span>
                    )}
                    <span className="flex-1 font-semibold text-neutral-800 dark:text-neutral-100">
                      {isEn ? opt.labelEn || opt.label : opt.label}
                    </span>
                    <span className="text-neutral-400 text-sm group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all">
                      {isEn ? "›" : "‹"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step: Interstitial Psychological Reinforcement */}
        {step.kind === "interstitial" && (
          <div className="text-center pt-4 animate-fade-in">
            <div className="text-4xl mb-3">{quizInterstitials[step.afterN].icon}</div>
            <h2 className="text-lg sm:text-xl font-bold mb-3">
              {isEn ? quizInterstitials[step.afterN].headingEn : quizInterstitials[step.afterN].heading}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed max-w-sm mx-auto">
              {isEn ? quizInterstitials[step.afterN].bodyEn : quizInterstitials[step.afterN].body}
            </p>
            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {isEn ? quizInterstitials[step.afterN].ctaEn : quizInterstitials[step.afterN].cta}
            </button>
          </div>
        )}

        {/* Step: Lead Email Capture */}
        {step.kind === "leadEmail" && (
          <div className="animate-fade-in text-center">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/20 rounded-full px-3.5 py-1 inline-block mb-3">
              {isEn ? "✓ Your Personalized Plan is Ready" : "✓ خطتك المخصصة جاهزة الآن"}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mb-2">
              {isEn ? (
                <>
                  Enter your email to view your <span className="text-teal-600 dark:text-teal-400">custom plan</span>
                </>
              ) : (
                <>
                  أدخل بريدك الإلكتروني لعرض <span className="text-teal-600 dark:text-teal-400">خطتك الشخصية</span>
                </>
              )}
            </h2>
            <div className="flex justify-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              <span>📅 {isEn ? "28-Day Pace" : "مسار ٢٨ يوم"}</span>
              <span>🎯 {isEn ? "Tailored Track" : "خطة موجهة"}</span>
              <span>🏆 {isEn ? "Lifetime Access" : "وصول حصري"}</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                next();
              }}
            >
              <input
                type="email"
                required
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-center border border-black/15 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl px-4 py-3.5 mb-4 text-sm focus:border-teal-500 focus:outline-hidden"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
              >
                {isEn ? "Unlock My Roadmap →" : "افتح خطتي الآن ←"}
              </button>
            </form>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-4">
              {isEn
                ? "🔒 We respect your privacy. No spam. You can unsubscribe anytime."
                : "🔒 نلتزم بحماية خصوصيتك بالكامل. بدون أي رسائل مزعجة."}
            </p>
          </div>
        )}

        {/* Step: Lead Name */}
        {step.kind === "leadName" && (
          <div className="animate-fade-in text-center">
            <h2 className="text-xl sm:text-2xl font-black mb-1">
              {isEn ? "What is your name?" : "ما هو اسمك الكريم؟"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6">
              {isEn ? "We will tailor your roadmap and certificate to this name" : "لنخصص خطتك وشهاداتك باسمك الرسمي"}
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
                placeholder={isEn ? "Your first name" : "اكتب اسمك الأول"}
                className="w-full text-center border border-black/15 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-2xl px-4 py-3.5 mb-4 text-sm focus:border-teal-500 focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm disabled:opacity-60"
              >
                {saving ? "..." : isEn ? "Continue →" : "متابعة ←"}
              </button>
            </form>
          </div>
        )}

        {/* Step: Result / Archetype & Readiness Score */}
        {step.kind === "result" && (
          <div className="text-center animate-fade-in">
            <span className="text-xs bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold rounded-full px-3.5 py-1 mb-3 inline-block">
              {isEn ? `Profile for ${name || "Learner"}` : `الملف الشخصي لـ ${name || "المتعلم"}`}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1">
              {isEn ? `${name || "Friend"}, Here is Your Blueprint` : `${name || "صديقنا"}، هذه خطتك الشخصية`}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-5">
              {isEn
                ? "Based on your unique profile, here is your high-impact roadmap"
                : "بناءً على إجاباتك، بنينا لك خارطة طريق ٢٨ يوم مصممة لظروفك"}
            </p>

            {/* Celebratory Score donut meter with multi-stop conic gradient & glow */}
            <div className="relative rounded-3xl bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-teal-950/30 border-2 border-emerald-500/30 p-6 mb-5 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start shadow-xl shadow-emerald-500/10 overflow-hidden">
              <div className="pointer-events-none absolute -right-12 -top-12 w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl" />

              <div className="relative shrink-0 flex items-center justify-center">
                {/* Pulsing Aura */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 blur-md opacity-40 animate-pulse" />
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    background: `conic-gradient(#10b981 0deg, #14b8a6 ${score * 2.5}deg, #f59e0b ${score * 3.6}deg, rgba(20,184,166,0.12) 0deg)`,
                  }}
                >
                  <div className="w-18 h-18 rounded-full bg-white dark:bg-neutral-900 flex flex-col items-center justify-center shadow-inner">
                    <span className="font-black text-2xl leading-none bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent font-mono">
                      {score}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400">/ 100</span>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/30 mb-1.5">
                  <span>🏆</span>
                  <span>{isEn ? "Top 12% Digital Readiness Tier" : "أعلى ١٢٪ في مؤشر الجاهزية والذكاء الرقمي"}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white">
                  {isEn
                    ? "Exceptional potential for rapid monetization and AI adoption."
                    : "إمكانيات استثنائية للتفوق وبناء مهارات دخل حقيقية بالذكاء الاصطناعي."}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                  {isEn
                    ? "Your responses demonstrate high adaptability and readiness for daily 15-minute micro-habits."
                    : "إجاباتك تبرهن على رغبة حقيقية واستعداد كامل لالتزام ١٥ دقيقة يوميًا لصنع تحول جذري."}
                </p>
              </div>
            </div>

            {/* Archetype VIP blueprint card */}
            <div className="rounded-3xl bg-white dark:bg-neutral-900 border-2 border-teal-500/30 p-6 mb-6 text-start shadow-lg shadow-teal-500/5 relative overflow-hidden">
              <div className="pointer-events-none absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-teal-500/10 blur-xl" />
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                  {isEn ? "YOUR FUTURE LEADERSHIP ARCHETYPE" : "نمطك القيادي في عالم الذكاء الاصطناعي"}
                </p>
                <span className="text-xs font-bold text-amber-500">✨ Verified Blueprint</span>
              </div>
              <p className="text-lg sm:text-xl font-black mb-1 text-neutral-900 dark:text-white flex items-center gap-2.5">
                <span className="text-2xl">{archetype.icon}</span>
                <span>{isEn ? archetype.titleEn : archetype.title}</span>
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold mb-3">
                {isEn ? archetype.subtitleEn : archetype.subtitle}
              </p>
              <p className="text-xs italic text-neutral-600 dark:text-neutral-300 border-s-2 border-teal-500 ps-3 py-0.5 leading-relaxed bg-neutral-50/60 dark:bg-neutral-800/40 rounded-e-xl">
                &ldquo;{isEn ? archetype.quoteEn : archetype.quote}&rdquo;
              </p>
            </div>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {isEn ? "View My Roadmap Blueprint →" : "استعرض تفاصيل خطتي ←"}
            </button>
          </div>
        )}

        {/* Step: Sales & Psychological Clarity */}
        {step.kind === "sales" && (
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-2">
              {isEn ? "Future Skills Made Effortless" : "الذكاء الاصطناعي أسهل بكثير مما تتخيل"}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 text-center mb-6">
              {isEn
                ? "Engineered specifically to help you build real momentum — right from Day 1"
                : "مصمم بدقة لمساعدتك على بناء مهارات ملموسة — من أول يوم وبدون أي تعقيد"}
            </p>

            <div className="rounded-2xl bg-teal-500/10 border border-teal-500/20 p-4 mb-5 text-center">
              <p className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold mb-0.5">
                {isEn ? "Specially customized for" : "مخصص وموجه لـ"}
              </p>
              <p className="font-bold text-sm text-teal-900 dark:text-teal-200">
                {archetype.icon} {isEn ? archetype.titleEn : archetype.title}
              </p>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm mb-6">
              {[
                isEn
                  ? "Zero prior coding or technical experience needed — starts from complete scratch"
                  : "لا تشترط أي خبرة برمجية مسبقة — نبدأ معك من الصفر تمامًا",
                isEn
                  ? "Overcoming overwhelm: structured 5-to-15 minute micro-lessons"
                  : "وداعًا للتشتت: دروس ميكرو مدتها من ٥ إلى ١٥ دقيقة فقط يوميًا",
                isEn
                  ? "Progress at your own pace with streak protection and mood check-in"
                  : "تعلم بوتيرتك المريحة مع حماية السلسلة وفحص الطاقة اليومي",
                isEn
                  ? "Master the tools everyone is talking about (ChatGPT, Claude, Gemini, Automations)"
                  : "أتقن الأدوات التي يتحدث عنها العالم (ChatGPT, Claude, Gemini, Midjourney)",
                isEn
                  ? "High-impact hands-on task in every lesson to produce real portfolio pieces"
                  : "تطبيق عملي مباشر في كل درس لبناء مشاريع واقعية يمكنك الاستفادة منها",
                isEn
                  ? "Bilingual learning with accredited completion certificates"
                  : "منصة ثنائية اللغة عربي/إنجليزي مع شهادات إتمام معتمدة لملفك الشخصي",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold text-base leading-none">✓</span>
                  <span className="text-neutral-700 dark:text-neutral-300">{t}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {isEn ? "Continue →" : "متابعة ←"}
            </button>
          </div>
        )}

        {/* Step: Before & After (Loss Aversion) */}
        {step.kind === "beforeAfter" && (
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-1">
              {isEn ? "Your 28-Day Transformation" : "تحوّلك الحقيقي خلال ٢٨ يوم"}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mb-6">
              {isEn
                ? "Gain career momentum and verifiable future skills in just 28 days"
                : "تكتسب مهارات حقيقية وشهادة معتمدة في غضون ٢٨ يومًا من اليوم"}
            </p>

            <div className="rounded-2xl border border-red-500/20 bg-red-50/50 dark:bg-red-950/20 p-4 mb-3.5">
              <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5">
                <span>😟</span>
                <span>{isEn ? `Without ${brand.name}` : `بدون ${brand.name}`}</span>
              </p>
              <ul className="text-xs text-red-800 dark:text-red-300 space-y-1.5 leading-relaxed">
                <li>• {isEn ? "Stuck saving tutorials without taking real action" : "حفظ فيديوهات وبوستات بدون تطبيق عملي حقيقي"}</li>
                <li>• {isEn ? "Watching peers advance while you stay in the same spot" : "مشاهدة الآخرين يتقدمون بينما تظل مكانك"}</li>
                <li>• {isEn ? "Confusion about what to learn or where to focus" : "تشتت مستمر وشعور بالعجز أمام تسارع التكنولوجيا"}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 mb-6">
              <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-1.5">
                <span>😊</span>
                <span>{isEn ? `With ${brand.name}` : `مع ${brand.name}`}</span>
              </p>
              <ul className="text-xs text-emerald-900 dark:text-emerald-200 space-y-1.5 leading-relaxed">
                <li>• {isEn ? "Just 15 minutes daily — guaranteed frictionless consistency" : "١٥ دقيقة فقط يوميًا — استمرارية سلسة بدون إحباط"}</li>
                <li>• {isEn ? "Tangible projects and portfolio pieces from week one" : "نتايج ومشاريع عملية ملموسة من الأسبوع الأول"}</li>
                <li>• {isEn ? "Continuous psychological support (Pomodoro, Alpha waves, Streak Freeze)" : "دعم نفسي وتركيز فائق مدمج يمنع الانقطاع والتسويف"}</li>
                <li>• {isEn ? "Direct roadmap to freelance income and career promotion" : "مسار واضح لزيادة الدخل والتميز في سوق العمل"}</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {isEn ? "Continue →" : "متابعة ←"}
            </button>
          </div>
        )}

        {/* Step: What You Receive (Deliverables) */}
        {step.kind === "testimonials" && (
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-black text-center mb-1">
              {isEn ? "What You Receive Inside Tawwerni" : "ما ستحصل عليه بالضبط عند الانضمام"}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mb-5">
              {isEn
                ? "One-time payment for lifetime access — no monthly subscription"
                : "دفعة واحدة فقط مدى الحياة — بدون أي اشتراكات شهرية متكررة"}
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
                  t: isEn ? "Day 1 Free on Every Track" : "اليوم الأول متاح مجانًا في كل مسار",
                  s: isEn
                    ? "Try the quality and teaching style hands-on with zero risk"
                    : "تجرّب بنفسك أسلوب التعلم وجودة المحتوى بدون أي مخاطرة",
                },
                {
                  i: "⚡",
                  t: isEn ? "Instant Automated Access" : "تفعيل فوري وآمن خلال دقائق",
                  s: isEn
                    ? "Direct activation via Vodafone Cash, InstaPay, or credit card"
                    : "تفعيل مباشر عبر فودافون كاش أو إنستاباي بدون عمولات وسيطة",
                },
              ].map((f) => (
                <div
                  key={f.t}
                  className="flex gap-3 rounded-2xl bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 p-3.5 shadow-xs hover:border-teal-500/40 transition"
                >
                  <span className="text-2xl leading-none">{f.i}</span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">{f.t}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      {f.s}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-bold rounded-full py-3.5 shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {isEn ? "See Your Special Founding Offer →" : "اكتشف عرض فوج التأسيس الخاص بك ←"}
            </button>
          </div>
        )}

        {/* Step: Offer & Discount Anchor */}
        {step.kind === "wheel" && (
          <div className="text-center animate-fade-in">
            <div className="text-4xl mb-2">🎁</div>
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-black mb-3">
              <span>👑</span>
              <span>
                {isEn
                  ? `Founding Cohort Offer · Only ${pricing.cohortSeatsRemaining} seats remaining`
                  : `عرض فوج التأسيس الأول الحصري · متبقي ${pricing.cohortSeatsRemaining} مقعدًا فقط`}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-1 text-neutral-900 dark:text-white">
              {isEn ? `Your Special Launch Rate, ${name || "Champion"}` : `سعرك الاستثنائي، ${name || "يا بطل"}`}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
              {isEn
                ? "71% OFF for Founding Cohort members — this special rate will not be repeated"
                : "خصم 71% للأعضاء المؤسسين — هذا السعر الحصري لن يتكرر مجددًا"}
            </p>

            <div className="rounded-3xl border-2 border-emerald-500/50 bg-white dark:bg-neutral-900 p-6 md:p-8 mb-5 shadow-2xl shadow-emerald-500/10 relative overflow-hidden ring-1 ring-emerald-500/20">
              <div className="pointer-events-none absolute -top-16 -left-16 w-36 h-36 rounded-full bg-emerald-500/15 blur-2xl" />

              <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs font-semibold mb-1">
                <span>{isEn ? "Standard Value:" : "السعر الأصلي:"}</span>
                <span className="line-through font-mono font-bold text-sm">
                  {pricing.originalPriceEgp} {isEn ? "EGP" : "ج.م"}
                </span>
              </div>

              <div className="flex items-baseline justify-center gap-2 my-2 font-mono">
                <span className="text-5xl sm:text-6xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                  {pricing.priceEgp}
                </span>
                <span className="text-base font-bold text-neutral-800 dark:text-neutral-200">
                  {isEn ? "EGP" : "ج.م"}
                </span>
              </div>

              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mt-1 mb-4">
                {isEn
                  ? `One-time payment · Lifetime access to all 100 tracks · ${totalLessons}+ lessons · All future updates included`
                  : `دفعة واحدة فقط مدى الحياة · كل الـ ١٠٠ مسار · أكثر من ${totalLessons}+ درس · كل التحديثات المستقبلية مجانًا`}
              </p>

              {/* Scarcity Bar */}
              <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-start">
                <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                  <span className="text-amber-800 dark:text-amber-300 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    {isEn ? `Only ${pricing.cohortSeatsRemaining} seats left` : `باقي ${pricing.cohortSeatsRemaining} مقعدًا فقط`}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-mono">
                    {isEn ? "453 / 500 Claimed" : "٤٥٣ / ٥٠٠ مقعد"}
                  </span>
                </div>
                <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-400 w-[90.6%]" />
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-medium">
              {isEn
                ? "💡 Less than 0.25 EGP per lesson — an investment that unlocks lasting income opportunities"
                : "💡 أقل من 25 قرشًا للدرس الواحد — استثمار رمزي يفتح لك فرص دخل حقيقية ومستمرة"}
            </p>

            <button
              type="button"
              onClick={next}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white font-black rounded-full py-4 text-sm sm:text-base shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:brightness-110 active:scale-98 transition-all"
            >
              {isEn ? "Claim Offer & Join Cohort Now →" : "احصل على العرض والتحق بالفوج الآن ←"}
            </button>
          </div>
        )}

        {/* Step: Final Checkout Confirmation & Offer */}
        {step.kind === "offer" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-5 text-xs">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 font-medium">{isEn ? "Account Status" : "حالة الحساب"}</p>
                <p className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                  {isEn ? "Ready for Instant Activation" : "جاهز للتفعيل الفوري"}
                </p>
              </div>
              <div className="text-end">
                <p className="text-neutral-500 dark:text-neutral-400 font-medium">{isEn ? "One-Time Investment" : "الاستثمار لمرة واحدة"}</p>
                <p className="font-black text-emerald-600 dark:text-emerald-400 text-base font-mono">
                  {pricing.priceEgp} {isEn ? "EGP" : "ج.م"}{" "}
                  <span className="line-through text-neutral-400 text-xs font-normal">({pricing.originalPriceEgp})</span>
                </p>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black mt-2 mb-1 text-neutral-900 dark:text-white">
              {isEn
                ? `Your Custom Roadmap is Ready, ${name || "Champion"}!`
                : `خطتك الشخصية جاهزة للانطلاق، ${name || "يا بطل"}!`}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-5 leading-relaxed">
              {isEn
                ? "Welcome to your personal breakthrough. All 100 tracks and psychological focus tools are now within reach."
                : "مرحبًا بك في نقطة التحوّل. الـ ١٠٠ مسار وأدوات الدعم النفسي بالكامل بين يديك الآن."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border border-black/5 dark:border-white/10 shadow-xs">
                <p className="text-neutral-500 dark:text-neutral-400">🎯 {isEn ? "Target Discipline" : "مسار انطلاقك"}</p>
                <p className="font-bold mt-1 text-teal-700 dark:text-teal-300">
                  {isEn ? archetype.titleEn : archetype.title}
                </p>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-3.5 border border-black/5 dark:border-white/10 shadow-xs">
                <p className="text-neutral-500 dark:text-neutral-400">⚡ {isEn ? "Readiness Level" : "مستوى الجاهزية"}</p>
                <p className="font-bold mt-1 text-teal-700 dark:text-teal-300">
                  {isEn ? "Ready for Rapid Implementation" : "جاهز للتطبيق السريع"}
                </p>
              </div>
            </div>

            {/* First 4 days roadmap preview */}
            <div className="rounded-2xl border border-black/5 dark:border-white/10 p-4 bg-white dark:bg-neutral-900 mb-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isEn ? "Your First 4 Days Snapshot" : "نظرة على أول ٤ أيام من خطتك"}
                </p>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300/40">
                  {isEn ? "Day 1 Free" : "اليوم الأول مجانًا"}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                {(isEn
                  ? ["Core Fundamentals", "AI Tools & Setup", "First Practical Task", "Income Strategies"]
                  : ["أساسيات المهارة", "أدوات الذكاء وتطبيقها", "أول مشروع عملي", "استراتيجيات الدخل"]
                ).map((tool, i) => (
                  <div key={tool} className={`rounded-xl py-2 px-1 ${i === 0 ? "bg-emerald-500/15 border border-emerald-500/30" : "bg-teal-500/10"}`}>
                    <p className={`font-bold ${i === 0 ? "text-emerald-800 dark:text-emerald-300" : "text-teal-800 dark:text-teal-300"}`}>
                      {isEn ? `Day ${i + 1}` : `يوم ${i + 1}`}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 line-clamp-1">{tool}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={goCheckout}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white font-black rounded-full py-4 mb-4 shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base font-sans"
            >
              {isEn
                ? `Confirm Enrollment & Join for Only ${pricing.priceEgp} EGP →`
                : `تأكيد التسجيل والانضمام بـ ${pricing.priceEgp} ج.م فقط ←`}
            </button>

            <div className="rounded-2xl bg-white dark:bg-neutral-900 p-3.5 mb-5 text-center border border-black/5 dark:border-white/10 shadow-xs">
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                {isEn ? "Have questions before transfer? Chat with us instantly on WhatsApp: " : "عندك استفسار قبل التحويل؟ كلّمنا واتساب فورًا: "}
                <a
                  href={`https://wa.me/2${payment.supportWhatsapp}`}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                  dir="ltr"
                >
                  +{payment.supportWhatsapp}
                </a>
              </p>
            </div>

            <ul className="text-xs space-y-2 mb-5 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-xs">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <b>{isEn ? "100 Complete Professional Tracks" : "١٠٠ مسار احترافي كامل"}</b>{" "}
                  {isEn ? "across 10 vital domains" : "في ١٠ أركان حيوية"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <b>{isEn ? "Bilingual Content (Arabic / English)" : "محتوى ثنائي اللغة (عربي / إنجليزي)"}</b>{" "}
                  {isEn ? "with instant 1-click toggle" : "بنقرة واحدة"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <b>{isEn ? `Over ${totalLessons} Hands-on Lessons` : `أكثر من ${totalLessons} درس تطبيقي`}</b>{" "}
                  {isEn ? "with infographics for every lesson" : "مع رسوم وجرافيكس لكل درس"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <b>{isEn ? "Psychological Advantage Suite" : "أدوات الدعم النفسي"}</b>:{" "}
                  {isEn ? "Pomodoro + Alpha Binaural Beats + Daily Mood Pacing" : "بومودورو + ترددات ألفا للتركيز + فحص طاقة"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <b>{isEn ? "300+ Verified Community Network" : "مجتمع ٣٠٠+ عضو حقيقي"}</b>{" "}
                  {isEn ? "with authentic success stories" : "مع شبكة علاقات وتجارب ملهمة"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <b>{isEn ? "Accredited Certificate of Completion" : "شهادة إتمام معتمدة"}</b>{" "}
                  {isEn ? "for each track you master" : "لكل مسار تنهيه بنجاح"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>
                  <b>{isEn ? "Lifetime Access" : "وصول مدى الحياة"}</b> —{" "}
                  {isEn
                    ? `One-time ${pricing.priceEgp} EGP without recurring fees`
                    : `دفعة واحدة ${pricing.priceEgp} ج.م بدون أي اشتراك شهري`}
                </span>
              </li>
            </ul>

            <p className="text-center text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              🎁{" "}
              {isEn
                ? "Day 1 of every single track is 100% free — guaranteed quality before any payment"
                : "اليوم الأول من كل مسار من الـ ١٠٠ مفتوح مجانًا — جودة ومصداقية نضمنها لك"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
