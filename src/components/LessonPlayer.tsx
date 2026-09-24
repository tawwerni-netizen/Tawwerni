"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToolChip, detectTools } from "@/components/ToolIcon";
import { pricing } from "@/content/brand";
import PaywallPrompt from "@/components/PaywallPrompt";
import CardVisual, {
  visualConsumesHeading,
  visualConsumesFirstLine,
} from "@/components/CardVisual";
import { trackLessonCompleted } from "@/lib/analytics";
import { useI18n } from "@/components/LanguageContext";

export type InfoCard = {
  type: "info";
  heading: string;
  body: { lines: string[]; tools?: string[] };
};
export type TaskCard = { type: "task"; heading: string; body: { instructions: string[]; prompt?: string } };
export type Card = InfoCard | TaskCard;

type QuizQ = {
  id: string;
  type: "mcq" | "tf";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Props = {
  courseSlug: string;
  moduleTitle: string;
  moduleTitleEn?: string;
  dayNumber: number;
  totalDays: number;
  lessonId: string;
  lessonTitle: string;
  lessonTitleEn?: string;
  /** Screen recording, when one has been produced for this lesson. */
  videoUrl?: string | null;
  cards: Card[];
  quiz: QuizQ[];
  xp: number;
  nextDayNumber: number | null;
  courseTitle: string;
  courseTitleEn?: string;
  /** unlocked = paid · pending = transfer under review · unpaid = never ordered */
  accessState: "unlocked" | "pending" | "unpaid";
  /** Other live tracks the learner hasn't bought yet — used for the mid-journey offer. */
  promoCourses: { slug: string; icon: string; category: string }[];
};

/** Days where the cross-sell offer appears, once the learner is invested. */
const PROMO_DAYS = [7, 14, 21];

type Phase = "cards" | "quizIntro" | "quiz" | "complete";

export default function LessonPlayer(props: Props) {
  const router = useRouter();
  const { lang, t } = useI18n();
  const isEn = lang === "en";

  const moduleTitle = isEn && props.moduleTitleEn ? props.moduleTitleEn : props.moduleTitle;
  const courseTitle = isEn && props.courseTitleEn ? props.courseTitleEn : props.courseTitle;
  const lessonTitle = isEn && props.lessonTitleEn ? props.lessonTitleEn : props.lessonTitle;

  const [phase, setPhase] = useState<Phase>("cards");
  const [cardIndex, setCardIndex] = useState(0);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    xpEarned: number;
    totalXp: number;
    streak: number;
    newBadges: { key: string; title: string; icon: string }[];
  } | null>(null);

  const totalSteps = props.cards.length;
  const [promoDismissed, setPromoDismissed] = useState(false);
  const showPromo =
    !promoDismissed &&
    props.promoCourses.length > 0 &&
    PROMO_DAYS.includes(props.dayNumber);

  const card = props.cards[cardIndex];

  // Show brand chips for any AI tool the card names — explicit list wins,
  // otherwise detect mentions (Arabic or English) from the card's own text.
  const cardTools = useMemo(() => {
    if (card?.type !== "info") return [];
    if (card.body.tools?.length) return card.body.tools;
    return detectTools([card.heading, ...card.body.lines].join(" "));
  }, [card]);

  function goHome() {
    router.push(`/app/learn/${props.courseSlug}`);
  }

  function nextCard() {
    if (cardIndex < totalSteps - 1) {
      setCardIndex((i) => i + 1);
    } else {
      setPhase("quizIntro");
    }
  }

  function prevCard() {
    if (cardIndex > 0) setCardIndex((i) => i - 1);
  }

  function selectAnswer(i: number) {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === props.quiz[qIndex].correctIndex) setScore((s) => s + 1);
  }

  async function nextQuestion() {
    if (qIndex < props.quiz.length - 1) {
      setQIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
      return;
    }
    const res = await fetch(`/api/lessons/${props.lessonId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, totalQuestions: props.quiz.length }),
    });
    const data = await res.json();
    setResult(data);
    setPhase("complete");
    trackLessonCompleted(props.courseSlug, props.dayNumber);
  }

  function copyPrompt(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // No `min-h-screen` on the wrapper below.
  //
  // This sits inside a layout that is already a full viewport tall, under a
  // 3.5rem header. Forcing another 100vh stacked a second screen underneath the
  // first, so on a short card the Next button sat ~8rem below the fold and every
  // single card needed a scroll to continue. Across a 157-lesson course that is
  // hundreds of scrolls for a button that should never move.
  //
  // The player now takes the height of its content, and the action bar sticks to
  // the bottom of the viewport instead — see `.lesson-actions` in globals.css.
  return (
    <div className="flex flex-1 flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white" dir={isEn ? "ltr" : "rtl"}>
      <div className="px-4 pt-4 pb-3 border-b border-black/5 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          {/* Was 13×22 — the smallest control on the site, and the one people
              reach for when they want out. Now a real 40px square. */}
          <button
            onClick={goHome}
            aria-label={isEn ? "Close lesson" : "اقفل الدرس"}
            className="tap -m-2 grid h-10 w-10 place-items-center rounded-full text-base text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            ✕
          </button>
          <div className="text-center">
            <p className="text-[10px] text-neutral-400 tracking-wide">{moduleTitle}</p>
            <p className="text-xs font-bold">
              {phase === "quiz" || phase === "quizIntro"
                ? (isEn ? "Quick Quiz" : "كويز سريع")
                : (isEn ? `Day ${props.dayNumber} of ${props.totalDays}` : `يوم ${props.dayNumber} من ${props.totalDays}`)}
            </p>
          </div>
          <div className="w-4" />
        </div>
        {phase === "cards" && (
          <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 transition-all"
              style={{ width: `${((cardIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        )}
        {phase === "quiz" && (
          <div className="flex gap-1">
            {props.quiz.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= qIndex ? "bg-teal-600" : "bg-neutral-100 dark:bg-neutral-800"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {phase === "cards" && cardIndex === 0 && props.videoUrl && (
          <div className="lesson-video mb-5">
            <video
              src={props.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full"
            />
            <p className="lesson-video-note">
              {isEn ? "Watch the steps in action — refer to the text below." : "شوف الخطوات وهي بتتعمل — والنص تحت مرجع ترجعله."}
            </p>
          </div>
        )}

        {phase === "cards" && card.type === "info" && (
          <div>
            <CardVisual heading={card.heading} lines={card.body.lines} courseSlug={props.courseSlug} cardIndex={cardIndex} />
            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-neutral-800 p-4">
            {!visualConsumesHeading(card.heading, card.body.lines) && (
              <h2 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">{card.heading}</h2>
            )}
            <div className="space-y-2">
              {card.body.lines
                .filter(
                  (_, i) =>
                    !(i === 0 && visualConsumesFirstLine(card.heading, card.body.lines))
                )
                .map((line, i) => (
                  <p key={i} className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {line}
                  </p>
                ))}
            </div>
            {cardTools.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 dark:border-neutral-800 pt-3">
                {cardTools.map((t) => (
                  <ToolChip key={t} tool={t} />
                ))}
              </div>
            )}
            </div>
          </div>
        )}

        {phase === "cards" && card.type === "task" && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🎯</span>
              <div>
                <p className="text-[10px] text-neutral-400">{isEn ? "Today's Mission" : "مهمة اليوم"}</p>
                <p className="text-sm font-bold">{isEn ? "Before you proceed" : "قبل ما تكمل"}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 p-4">
              <h3 className="font-bold mb-2 text-neutral-900 dark:text-white">{card.heading}</h3>
              <div className="space-y-1.5 mb-3">
                {card.body.instructions.map((line, i) => (
                  <p key={i} className="text-sm text-neutral-800 dark:text-neutral-200">
                    {line}
                  </p>
                ))}
              </div>
              {card.body.prompt && (
                <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/5 dark:border-neutral-800 p-3 flex items-start justify-between gap-2">
                  <code className="text-xs text-neutral-700 dark:text-neutral-300 flex-1 font-mono">{card.body.prompt}</code>
                  <button
                    onClick={() => copyPrompt(card.body.prompt!)}
                    className="text-[10px] shrink-0 bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 rounded-full px-2.5 py-1 font-bold"
                  >
                    {copied ? (isEn ? "✓ Copied" : "✓ اتنسخ") : (isEn ? "Copy" : "نسخ")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === "quizIntro" && (
          <div className="text-center pt-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-3xl mb-4">
              📝
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wide mb-1">
              {isEn ? `Cards finished · Day ${props.dayNumber} of ${props.totalDays}` : `الكروت خلصت · يوم ${props.dayNumber} من ${props.totalDays}`}
            </p>
            <h2 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white">{isEn ? "Ready for the quiz?" : "جاهز للكويز؟"}</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5 max-w-sm mx-auto">
              {isEn
                ? `You've read all the cards. Answer ${props.quiz.length} quick questions to cement what you learned and earn ⚡ ${props.xp} XP.`
                : `قريت كل الكروت. جاوب على ${props.quiz.length} أسئلة سريعة وثبّت اللي اتعلمته واكسب ⚡ ${props.xp} XP.`}
            </p>
          </div>
        )}

        {phase === "quiz" && (
          <div>
            <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full px-2.5 py-1 font-semibold">
              {props.quiz[qIndex].type === "mcq" ? (isEn ? "Multiple Choice" : "اختيار من متعدد") : (isEn ? "True or False" : "صح أو غلط")}
            </span>
            <h2 className="text-lg font-bold mt-3 mb-4 text-neutral-900 dark:text-white">{props.quiz[qIndex].question}</h2>
            <div className="space-y-2">
              {props.quiz[qIndex].options.map((opt, i) => {
                const isCorrect = i === props.quiz[qIndex].correctIndex;
                const isSelected = i === selected;
                let cls = "border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-900";
                if (answered && isCorrect) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100";
                else if (answered && isSelected && !isCorrect) cls = "border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100";
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`w-full text-start rounded-2xl border p-3.5 text-sm flex items-center gap-3 transition-colors ${cls}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[11px] font-bold shrink-0">
                      {answered && isCorrect ? "✓" : String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
            {answered && (
              <div
                className={`mt-4 rounded-2xl p-4 text-sm ${
                  selected === props.quiz[qIndex].correctIndex
                    ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/20"
                    : "bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-500/20"
                }`}
              >
                <p className="font-bold mb-1">
                  {selected === props.quiz[qIndex].correctIndex
                    ? (isEn ? "Correct! 🎉" : "صح! 🎉")
                    : (isEn ? "Not quite right" : "مش قصادها")}
                </p>
                <p className="text-xs leading-relaxed">{props.quiz[qIndex].explanation}</p>
              </div>
            )}
          </div>
        )}

        {phase === "complete" && result && (
          <div className="text-center pt-6">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-4xl mb-4 shadow-inner">
              🏆
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wide mb-1">
              {isEn ? `Day ${props.dayNumber} · Quiz Complete` : `يوم ${props.dayNumber} · الكويز خلص`}
            </p>
            <h2 className="text-xl font-black mb-4 text-neutral-900 dark:text-white">
              {score === props.quiz.length
                ? (isEn ? "Perfect Score! 🌟" : "نتيجة مثالية! 🌟")
                : (isEn ? "Day Completed!" : "خلصت اليوم ده!")}
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-neutral-800 rounded-2xl py-3">
                <div className="font-bold text-teal-800 dark:text-teal-400 font-mono text-base">
                  {score}/{props.quiz.length}
                </div>
                <div className="text-[10px] text-neutral-400">{isEn ? "Score" : "النتيجة"}</div>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-neutral-800 rounded-2xl py-3">
                <div className="font-bold text-teal-800 dark:text-teal-400 font-mono text-base">⚡ {result.xpEarned}</div>
                <div className="text-[10px] text-neutral-400">{isEn ? "XP Earned" : "XP اتكسبت"}</div>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-900 border border-black/5 dark:border-neutral-800 rounded-2xl py-3">
                <div className="font-bold text-teal-800 dark:text-teal-400 font-mono text-base">{result.streak} 🔥</div>
                <div className="text-[10px] text-neutral-400">{isEn ? "Day Streak" : "أيام متتالية"}</div>
              </div>
            </div>
            {result.newBadges.length > 0 && (
              <div className="space-y-2 mb-6 text-start">
                {result.newBadges.map((b) => (
                  <div key={b.key} className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-3">
                    <span className="text-xl">{b.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                        {isEn ? `New Badge: ${b.title}` : `شارة جديدة: ${b.title}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showPromo && (
              <div className="mb-6 overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-teal-600 to-emerald-700 p-5 text-start text-white shadow-lg">
                <p className="mb-1 text-sm font-bold">
                  {isEn ? "🎁 Halfway There — Unlock the Full Catalogue!" : "🎁 وصلت نص الطريق — الحق العرض!"}
                </p>
                <p className="mb-3 text-xs leading-relaxed text-white/90">
                  {isEn
                    ? `Get all 100 tracks for just ${pricing.priceEgp} EGP — ${pricing.offerNote}.`
                    : `المسارات التانية بـ ${pricing.priceEgp} ج.م — ${pricing.offerNote}.`}
                </p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {props.promoCourses.map((c) => (
                    <span
                      key={c.slug}
                      className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold"
                    >
                      {c.icon} {c.category}
                    </span>
                  ))}
                </div>
                <Link
                  href="/quiz/checkout"
                  className="block rounded-full bg-white py-2.5 text-center text-xs font-bold text-teal-900 shadow-md hover:bg-neutral-50 transition-colors"
                >
                  {isEn ? "Subscribe Now →" : "اشترك دلوقتي ←"}
                </Link>
                <button
                  type="button"
                  onClick={() => setPromoDismissed(true)}
                  className="mt-2 w-full text-center text-[11px] text-white/60 hover:text-white"
                >
                  {isEn ? "Not now" : "مش دلوقتي"}
                </button>
              </div>
            )}

            {props.accessState !== "unlocked" ? (
              <PaywallPrompt
                state={props.accessState}
                totalLessons={props.totalDays}
                courseTitle={courseTitle}
              />
            ) : props.nextDayNumber ? (
              <Link
                href={`/app/learn/${props.courseSlug}/${props.nextDayNumber}`}
                className="block text-center bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold rounded-full py-3.5 text-sm shadow-md active:scale-98 transition-all"
              >
                {isEn ? `Next Lesson · Day ${props.nextDayNumber} →` : `الدرس الجاي · يوم ${props.nextDayNumber} ←`}
              </Link>
            ) : (
              <button
                onClick={goHome}
                className="w-full text-center bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold rounded-full py-3.5 text-sm shadow-md active:scale-98 transition-all"
              >
                {isEn ? "🎉 Completed Course! View Certificate" : "🎉 أكملت الكورس! استلم الشهادة"}
              </button>
            )}
          </div>
        )}
      </div>

      {(phase === "cards" || phase === "quizIntro") && (
        <div className="lesson-actions flex gap-2 px-4 pb-4 pt-3 border-t border-black/5 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
          {phase === "cards" && cardIndex > 0 && (
            <button
              onClick={prevCard}
              aria-label="Previous card"
              className="w-12 h-12 rounded-full border border-black/10 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center shrink-0 transition-colors"
            >
              {isEn ? "‹" : "›"}
            </button>
          )}
          <button
            onClick={phase === "cards" ? nextCard : () => setPhase("quiz")}
            className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold rounded-full py-3.5 text-sm shadow-md active:scale-98 transition-all"
          >
            {phase === "quizIntro"
              ? (isEn ? "Start Quiz →" : "ابدأ الكويز ←")
              : card.type === "task"
              ? (isEn ? "Take Quiz →" : "ابدأ الكويز ←")
              : (isEn ? "Next Card →" : "التالي ‹")}
          </button>
        </div>
      )}

      {phase === "quiz" && answered && (
        <div className="lesson-actions px-4 pb-4 pt-3 border-t border-black/5 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
          <button
            onClick={nextQuestion}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white font-bold rounded-full py-3.5 text-sm shadow-md active:scale-98 transition-all"
          >
            {qIndex < props.quiz.length - 1
              ? (isEn ? "Next Question →" : "السؤال التالي ‹")
              : (isEn ? "View Results 🎉" : "شوف النتيجة 🎉")}
          </button>
        </div>
      )}
    </div>
  );
}
