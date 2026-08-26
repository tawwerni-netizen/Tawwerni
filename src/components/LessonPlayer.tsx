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
  dayNumber: number;
  totalDays: number;
  lessonId: string;
  lessonTitle: string;
  cards: Card[];
  quiz: QuizQ[];
  xp: number;
  nextDayNumber: number | null;
  courseTitle: string;
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
  }

  function copyPrompt(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="px-4 pt-4 pb-3 border-b border-black/5">
        <div className="flex items-center justify-between mb-2">
          {/* Was 13×22 — the smallest control on the site, and the one people
              reach for when they want out. Now a real 40px square. */}
          <button
            onClick={goHome}
            aria-label="اقفل الدرس"
            className="tap -m-2 grid h-10 w-10 place-items-center rounded-full text-base text-neutral-400 transition hover:bg-neutral-100"
          >
            ✕
          </button>
          <div className="text-center">
            <p className="text-[10px] text-neutral-400 tracking-wide">{props.moduleTitle}</p>
            <p className="text-xs font-bold">
              {phase === "quiz" || phase === "quizIntro"
                ? "كويز سريع"
                : `يوم ${props.dayNumber} من ${props.totalDays}`}
            </p>
          </div>
          <div className="w-4" />
        </div>
        {phase === "cards" && (
          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all"
              style={{ width: `${((cardIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
        )}
        {phase === "quiz" && (
          <div className="flex gap-1">
            {props.quiz.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${i <= qIndex ? "bg-brand-600" : "bg-neutral-100"}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {phase === "cards" && card.type === "info" && (
          <div>
            <CardVisual heading={card.heading} lines={card.body.lines} />
            <div className="rounded-2xl bg-neutral-50 border border-black/5 p-4">
            {!visualConsumesHeading(card.heading, card.body.lines) && (
              <h2 className="font-bold text-lg mb-2">{card.heading}</h2>
            )}
            <div className="space-y-2">
              {card.body.lines
                // A pull quote already shows the first line; printing it again
                // right underneath reads like a stutter.
                .filter(
                  (_, i) =>
                    !(i === 0 && visualConsumesFirstLine(card.heading, card.body.lines))
                )
                .map((line, i) => (
                  <p key={i} className="text-sm text-neutral-700 leading-relaxed">
                    {line}
                  </p>
                ))}
            </div>
            {cardTools.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-3">
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
                <p className="text-[10px] text-neutral-400">مهمة اليوم</p>
                <p className="text-sm font-bold">قبل ما تكمل</p>
              </div>
            </div>
            <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
              <h3 className="font-bold mb-2">{card.heading}</h3>
              <div className="space-y-1.5 mb-3">
                {card.body.instructions.map((line, i) => (
                  <p key={i} className="text-sm text-neutral-700">
                    {line}
                  </p>
                ))}
              </div>
              {card.body.prompt && (
                <div className="bg-white rounded-xl border border-black/5 p-3 flex items-start justify-between gap-2">
                  <code className="text-xs text-neutral-700 flex-1">{card.body.prompt}</code>
                  <button
                    onClick={() => copyPrompt(card.body.prompt!)}
                    className="text-[10px] shrink-0 bg-brand-50 text-brand-800 rounded-full px-2 py-1"
                  >
                    {copied ? "✓ اتنسخ" : "نسخ"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === "quizIntro" && (
          <div className="text-center pt-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-3xl mb-4">
              📝
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wide mb-1">
              الكروت خلصت · يوم {props.dayNumber} من {props.totalDays}
            </p>
            <h2 className="text-lg font-bold mb-2">جاهز للكويز؟</h2>
            <p className="text-sm text-neutral-500 mb-5">
              قريت كل الكروت. جاوب على {props.quiz.length} أسئلة سريعة وثبّت اللي اتعلمته واكسب ⚡ {props.xp} XP.
            </p>
          </div>
        )}

        {phase === "quiz" && (
          <div>
            <span className="text-[10px] bg-neutral-100 text-neutral-500 rounded-full px-2 py-1">
              {props.quiz[qIndex].type === "mcq" ? "اختيار من متعدد" : "صح أو غلط"}
            </span>
            <h2 className="text-lg font-bold mt-3 mb-4">{props.quiz[qIndex].question}</h2>
            <div className="space-y-2">
              {props.quiz[qIndex].options.map((opt, i) => {
                const isCorrect = i === props.quiz[qIndex].correctIndex;
                const isSelected = i === selected;
                let cls = "border-black/10";
                if (answered && isCorrect) cls = "border-green-400 bg-green-50";
                else if (answered && isSelected && !isCorrect) cls = "border-red-300 bg-red-50";
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(i)}
                    className={`w-full text-right rounded-xl border p-3 text-sm flex items-center gap-3 ${cls}`}
                  >
                    <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-[11px] shrink-0">
                      {answered && isCorrect ? "✓" : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div
                className={`mt-4 rounded-xl p-3 text-sm ${
                  selected === props.quiz[qIndex].correctIndex
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <p className="font-bold mb-1">
                  {selected === props.quiz[qIndex].correctIndex ? "صح! 🎉" : "مش قصادها"}
                </p>
                <p className="text-xs">{props.quiz[qIndex].explanation}</p>
              </div>
            )}
          </div>
        )}

        {phase === "complete" && result && (
          <div className="text-center pt-6">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-4xl mb-4">
              🏆
            </div>
            <p className="text-[10px] text-neutral-400 tracking-wide mb-1">
              يوم {props.dayNumber} · الكويز خلص
            </p>
            <h2 className="text-xl font-bold mb-4">
              {score === props.quiz.length ? "نتيجة مثالية!" : "خلصت اليوم ده!"}
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-5">
              <div className="bg-neutral-50 rounded-xl py-3">
                <div className="font-bold text-brand-800">
                  {score}/{props.quiz.length}
                </div>
                <div className="text-[10px] text-neutral-400">النتيجة</div>
              </div>
              <div className="bg-neutral-50 rounded-xl py-3">
                <div className="font-bold text-brand-800">⚡ {result.xpEarned}</div>
                <div className="text-[10px] text-neutral-400">XP اتكسبت</div>
              </div>
              <div className="bg-neutral-50 rounded-xl py-3">
                <div className="font-bold text-brand-800">{result.streak} 🔥</div>
                <div className="text-[10px] text-neutral-400">أيام متتالية</div>
              </div>
            </div>
            {result.newBadges.length > 0 && (
              <div className="space-y-2 mb-6 text-right">
                {result.newBadges.map((b) => (
                  <div key={b.key} className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <span className="text-xl">{b.icon}</span>
                    <div>
                      <p className="text-sm font-bold">شارة جديدة: {b.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showPromo && (
              <div className="mb-6 overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-right text-white">
                <p className="mb-1 text-sm font-bold">🎁 وصلت نص الطريق — الحق العرض!</p>
                <p className="mb-3 text-xs leading-relaxed text-white/80">
                  المسارات التانية بـ <b>{pricing.priceEgp} ج.م</b> — {pricing.offerNote}.
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
                  className="block rounded-full bg-white py-2.5 text-center text-sm font-bold text-brand-800"
                >
                  اشترك دلوقتي →
                </Link>
                <button
                  type="button"
                  onClick={() => setPromoDismissed(true)}
                  className="mt-2 w-full text-center text-[11px] text-white/60"
                >
                  مش دلوقتي
                </button>
              </div>
            )}
            {/*
              A locked learner who just finished the free day sees the offer
              here instead of a "next lesson" button that would only bounce
              them back to the course page.
            */}
            {props.accessState !== "unlocked" ? (
              <PaywallPrompt
                state={props.accessState}
                totalLessons={props.totalDays}
                courseTitle={props.courseTitle}
              />
            ) : props.nextDayNumber ? (
              <Link
                href={`/app/learn/${props.courseSlug}/${props.nextDayNumber}`}
                className="block text-center bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm"
              >
                الدرس الجاي →
              </Link>
            ) : (
              <button
                onClick={goHome}
                className="w-full text-center bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm"
              >
                أكملت الكورس! 🎉
              </button>
            )}
          </div>
        )}
      </div>

      {(phase === "cards" || phase === "quizIntro") && (
        <div className="px-4 pb-6 pt-2 flex gap-2">
          {phase === "cards" && cardIndex > 0 && (
            <button onClick={prevCard} className="w-11 h-11 rounded-full border border-black/10 text-neutral-500 shrink-0">
              ›
            </button>
          )}
          <button
            onClick={phase === "cards" ? nextCard : () => setPhase("quiz")}
            className="flex-1 bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm"
          >
            {phase === "quizIntro"
              ? "ابدأ الكويز"
              : card.type === "task"
              ? "ابدأ الكويز"
              : "التالي ‹"}
          </button>
        </div>
      )}

      {phase === "quiz" && answered && (
        <div className="px-4 pb-6 pt-2">
          <button onClick={nextQuestion} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm">
            {qIndex < props.quiz.length - 1 ? "السؤال الجاي ‹" : "شوف النتيجة"}
          </button>
        </div>
      )}
    </div>
  );
}
