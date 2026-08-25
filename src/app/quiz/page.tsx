"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/content/brand";
import {
  quizQuestions,
  quizInterstitials,
  computeArchetype,
  computeReadinessScore,
} from "@/content/marketing-quiz";

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

const WHEEL_SEGMENTS = ["10%", "30%", "40%", "97%", "20%", "15%"];
const WINNING_INDEX = 3; // "97%"

const AVATARS = [
  { icon: "🧑‍💻", name: "sarah.m***" },
  { icon: "👩‍💼", name: "ahmed.k***" },
  { icon: "👨‍🎓", name: "mona.r***" },
  { icon: "👩‍🔬", name: "tarek.b***" },
  { icon: "🧑‍🏫", name: "yara.s***" },
];

export default function QuizPage() {
  const router = useRouter();
  const steps = useMemo(buildSteps, []);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelDone, setWheelDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);
  const [saving, setSaving] = useState(false);

  const step = steps[stepIndex];

  useEffect(() => {
    if (step.kind !== "offer") return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [step.kind]);

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
    } finally {
      setSaving(false);
      next();
    }
  }

  function spinWheel() {
    if (wheelSpinning || wheelDone) return;
    setWheelSpinning(true);
    const segmentAngle = 360 / WHEEL_SEGMENTS.length;
    const targetCenter = WINNING_INDEX * segmentAngle + segmentAngle / 2;
    const finalRotation = 360 * 5 + (360 - targetCenter);
    setWheelRotation(finalRotation);
    setTimeout(() => {
      setWheelSpinning(false);
      setWheelDone(true);
    }, 3200);
  }

  function goCheckout() {
    sessionStorage.setItem(
      "tawwerni_checkout",
      JSON.stringify({ email, name, discountPercent: 97 })
    );
    router.push("/quiz/checkout");
  }

  const questionNumber = step.kind === "question" ? step.qIndex + 1 : 0;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-black/5 flex items-center justify-between max-w-md mx-auto w-full">
        {stepIndex > 0 && step.kind !== "offer" ? (
          <button onClick={back} className="text-neutral-400 text-sm">
            ‹ رجوع
          </button>
        ) : (
          <span />
        )}
        <div className="font-bold text-sm text-brand-800">
          {brand.name}
          <span className="text-brand-400">.com</span>
        </div>
        <span className="w-8" />
      </div>

      {step.kind === "question" && (
        <div className="max-w-md mx-auto w-full px-4 pt-2">
          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden mb-1">
            <div
              className="h-full bg-brand-600 transition-all"
              style={{ width: `${(questionNumber / quizQuestions.length) * 100}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            سؤال {questionNumber} من {quizQuestions.length}
          </p>
        </div>
      )}

      <div className="flex-1 max-w-md mx-auto w-full px-5 py-6">
        {step.kind === "roleIntro" && (
          <div>
            <h1 className="text-2xl font-bold text-center mb-1">تحدي الذكاء الاصطناعي - ٢٨ يوم</h1>
            <p className="text-center text-brand-600 font-bold mb-6">احصل على شهادتك في الذكاء الاصطناعي</p>
            <p className="text-center font-bold mb-4">بتوصف نفسك إزاي؟</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { icon: "👨‍💼", label: "بشتغل في شركة", value: "employee" },
                { icon: "👩‍💼", label: "بابني مشروعي", value: "founder" },
              ].map((o) => (
                <button
                  key={o.value}
                  onClick={() => {
                    setRole(o.value);
                    next();
                  }}
                  className="border-2 border-brand-600 rounded-2xl p-4 text-center"
                >
                  <div className="text-3xl mb-2">{o.icon}</div>
                  <div className="text-white bg-brand-600 rounded-lg text-xs font-bold py-1.5">{o.label}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setRole("exploring");
                next();
              }}
              className="w-full border border-black/10 rounded-xl p-3 flex items-center gap-2 text-sm"
            >
              🌱 بستكشف الموضوع لنفسي
            </button>
            <p className="text-center text-[11px] text-neutral-400 mt-5">
              ✓ دقيقتين بس · ✓ نتيجة فورية
            </p>
          </div>
        )}

        {step.kind === "socialProof" && (
          <div className="text-center pt-4">
            <div className="text-3xl mb-3">✨</div>
            <h2 className="text-xl font-bold mb-3">انت في صحبة كويسة</h2>
            <p className="bg-neutral-50 rounded-xl p-3 text-sm text-neutral-600 mb-4">
              أكتر من ١٠٠ ألف محترف استخدموا {brand.name} عشان يفضلوا في المقدمة مع الذكاء الاصطناعي
            </p>
            <div className="flex justify-center -space-x-2 space-x-reverse mb-2">
              {AVATARS.map((a) => (
                <div
                  key={a.name}
                  className="w-8 h-8 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-sm"
                >
                  {a.icon}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400 mb-5">انضموا الأسبوع ده</p>
            <p className="font-bold mb-4">خلّينا نبني خطتك الشخصية — هياخد دقيقتين بس</p>
            <p className="text-amber-500 text-sm mb-6">★★★★★ ٤.٩/٥ من ١٢,٤٠٠+ متعلم</p>
            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
              ابدأ ←
            </button>
          </div>
        )}

        {step.kind === "question" && (
          <div>
            <h2 className="text-lg font-bold mb-1">{quizQuestions[step.qIndex].question}</h2>
            {quizQuestions[step.qIndex].subtitle && (
              <p className="text-xs text-neutral-400 mb-4">{quizQuestions[step.qIndex].subtitle}</p>
            )}
            <div className="space-y-2 mt-4">
              {quizQuestions[step.qIndex].options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => answerQuestion(quizQuestions[step.qIndex].id, opt.value)}
                  className="w-full flex items-center gap-3 rounded-xl border border-black/10 p-3.5 text-sm text-right hover:border-brand-600"
                >
                  {opt.icon && <span className="text-lg shrink-0">{opt.icon}</span>}
                  <span className="flex-1">{opt.label}</span>
                  <span className="text-neutral-300">›</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step.kind === "interstitial" && (
          <div className="text-center pt-6">
            <div className="text-3xl mb-4">{quizInterstitials[step.afterN].icon}</div>
            <h2 className="text-lg font-bold mb-3">{quizInterstitials[step.afterN].heading}</h2>
            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{quizInterstitials[step.afterN].body}</p>
            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
              {quizInterstitials[step.afterN].cta} ←
            </button>
          </div>
        )}

        {step.kind === "leadEmail" && (
          <div>
            <p className="text-center text-xs text-green-700 bg-green-50 rounded-full inline-block px-3 py-1 mb-4 mx-auto w-full text-center">
              ✓ خطتك جاهزة
            </p>
            <h2 className="text-xl font-bold text-center mb-4">
              اكتب إيميلك عشان تاخد <span className="text-brand-600">خطتك الشخصية!</span>
            </h2>
            <div className="flex justify-center gap-4 text-xs text-neutral-500 mb-5">
              <span>📅 مسار ٢٨ يوم</span>
              <span>🎯 خطة شخصية</span>
              <span>🏆 وصول حصري</span>
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
                placeholder="your@email.com"
                className="w-full text-center border border-black/10 rounded-xl px-3 py-3 mb-4 text-sm"
              />
              <button type="submit" className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
                افتح خطتي ←
              </button>
            </form>
            <p className="text-[10px] text-neutral-400 text-center mt-3">🔒 مش هنشارك إيميلك مع حد. تقدر تلغي الاشتراك أي وقت.</p>
          </div>
        )}

        {step.kind === "leadName" && (
          <div>
            <h2 className="text-xl font-bold text-center mb-1">إيه اسمك؟</h2>
            <p className="text-sm text-neutral-500 text-center mb-6">هنخصصلك خطتك بالاسم ده</p>
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
                placeholder="اكتب اسمك الأول"
                className="w-full text-center border border-black/10 rounded-xl px-3 py-3 mb-4 text-sm"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3 disabled:opacity-60"
              >
                {saving ? "..." : "كمّل ←"}
              </button>
            </form>
          </div>
        )}

        {step.kind === "result" && (
          <div className="text-center">
            <span className="text-[11px] bg-brand-50 text-brand-800 rounded-full px-3 py-1">
              الملف الشخصي لـ {name || "زائرنا"}
            </span>
            <h2 className="text-xl font-bold mt-3 mb-1">{name}، دي خطتك الشخصية</h2>
            <p className="text-sm text-neutral-500 mb-5">بناءً على إجاباتك، بنينا خارطة طريق ٢٨ يوم مخصصة ليك</p>

            <div className="rounded-2xl bg-white border border-black/5 p-5 mb-4 flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: `conic-gradient(#0f6e56 ${score * 3.6}deg, #e1f5ee 0deg)`,
                }}
              >
                <div className="w-14 h-14 rounded-full bg-white flex flex-col items-center justify-center">
                  <span className="font-bold text-lg leading-none">{score}</span>
                  <span className="text-[9px] text-neutral-400">/100</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-400">نسبة جاهزيتك للذكاء الاصطناعي</p>
                <p className="text-sm font-bold mt-1">انت متقدم عن أغلب الناس. خلّينا نكبّر الفرق ده.</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-black/5 p-5 mb-6 text-right">
              <p className="text-[10px] text-neutral-400 mb-1">شخصيتك في عالم الذكاء الاصطناعي</p>
              <p className="text-lg font-bold mb-1">
                {archetype.icon} {archetype.title}
              </p>
              <p className="text-xs text-neutral-500 mb-3">{archetype.subtitle}</p>
              <p className="text-sm italic text-neutral-600">&quot;{archetype.quote}&quot;</p>
            </div>

            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
              شوف خطتي ←
            </button>
          </div>
        )}

        {step.kind === "sales" && (
          <div>
            <h2 className="text-2xl font-bold text-center mb-2">
              الذكاء الاصطناعي أسهل مما تتخيل
            </h2>
            <p className="text-sm text-neutral-500 text-center mb-6">
              مصمم يساعدك تبني {archetype.title === "باني الأعمال" ? "مشروع جانبي مربح" : "مسارك الخاص"} — من أول يوم
            </p>
            <div className="rounded-xl bg-brand-50 p-4 mb-5 text-center">
              <p className="text-[10px] text-brand-800 mb-1">مصمم خصيصًا لـ</p>
              <p className="font-bold text-brand-800">
                {archetype.icon} {archetype.title}
              </p>
            </div>
            <ul className="space-y-3 text-sm mb-6">
              {[
                "متقلقش، مش محتاج خبرة سابقة بالذكاء الاصطناعي",
                "متقلقش من التعقيد — هنبسّط كل حاجة خطوة بخطوة",
                "اشتغل بالسرعة اللي تناسبك انت",
                "اتقن أدوات الذكاء الاصطناعي اللي الكل بيتكلم عنها",
                "ابنِ مهارات عملية تقدر تستخدمها من أول يوم",
                "احصل على شهادة ذكاء اصطناعي تميّزك عن غيرك",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
              كمّل ←
            </button>
          </div>
        )}

        {step.kind === "beforeAfter" && (
          <div>
            <h2 className="text-xl font-bold text-center mb-1">تحوّلك خلال ٢٨ يوم</h2>
            <p className="text-xs text-neutral-400 text-center mb-6">
              متوقعين تكون حاصل على شهادتك خلال ٢٨ يوم من دلوقتي
            </p>
            <div className="rounded-xl border border-red-100 bg-red-50 p-4 mb-3">
              <p className="text-sm font-bold text-red-700 mb-2">😟 من غير {brand.name}</p>
              <ul className="text-xs text-red-700 space-y-1">
                <li>مفيش وقت تتعلم مهارات جديدة</li>
                <li>بتتأخر عن زمايلك يوم بعد يوم</li>
                <li>حاسس بالضياع وعدم القدرة على البدء</li>
              </ul>
            </div>
            <div className="rounded-xl border border-green-100 bg-green-50 p-4 mb-6">
              <p className="text-sm font-bold text-green-700 mb-2">😊 مع {brand.name}</p>
              <ul className="text-xs text-green-700 space-y-1">
                <li>١٥ دقيقة بس يوميًا — نتايج مضمونة</li>
                <li>تتقدم أسرع من زمايلك في المهارات الجديدة</li>
                <li>نتايج ملموسة من أول أسبوع</li>
                <li>مسار واضح لدخل إضافي بالذكاء الاصطناعي ✓</li>
              </ul>
            </div>
            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
              كمّل ←
            </button>
          </div>
        )}

        {step.kind === "testimonials" && (
          <div>
            <h2 className="text-xl font-bold text-center mb-1">انضم لـ ١٠٠ ألف+ متعلم</h2>
            <p className="text-xs text-neutral-400 text-center mb-5">ناس زيك بالظبط اخدوا الخطوة الأولى</p>
            <div className="grid grid-cols-3 gap-2 text-center mb-6">
              <div>
                <p className="font-bold text-brand-800">١٠٠ ألف+</p>
                <p className="text-[10px] text-neutral-400">متعلم حول العالم</p>
              </div>
              <div>
                <p className="font-bold text-brand-800">٤.٨⭐</p>
                <p className="text-[10px] text-neutral-400">متوسط التقييم</p>
              </div>
              <div>
                <p className="font-bold text-brand-800">٩٣٪</p>
                <p className="text-[10px] text-neutral-400">شافوا نتيجة من أول أسبوع</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { n: "سارة م.", role: "مديرة تسويق", t: "من صفر معرفة بالذكاء الاصطناعي لاستخدامه يوميًا في شغلي. الأسلوب اليومي خلاه سهل جدًا." },
                { n: "كريم ت.", role: "مصمم فريلانسر", t: "وفرت ٣ ساعات أسبوعيًا بمهارات من أول ٧ أيام بس. كنت اتمنى أبدأ من زمان." },
                { n: "منى ع.", role: "بتغيّر مسارها المهني", t: "أخدت الشهادة ولقيت فرصة جديدة خلال ٦ أسابيع من إما خلصت." },
              ].map((r) => (
                <div key={r.n} className="rounded-xl bg-neutral-50 p-3">
                  <p className="text-xs text-neutral-600 mb-2">&quot;{r.t}&quot;</p>
                  <p className="text-[11px] font-bold">
                    {r.n} <span className="text-neutral-400 font-normal">· {r.role}</span>
                  </p>
                </div>
              ))}
            </div>
            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
              ابدأ تحدي الـ٢٨ يوم ←
            </button>
          </div>
        )}

        {step.kind === "wheel" && (
          <div className="text-center">
            <h2 className="text-xl font-bold mb-1">لُف واكسب خصمك الشخصي!</h2>
            <p className="text-sm text-neutral-500 mb-6">متفوتش فرصتك تتقن الذكاء الاصطناعي بخصم مخصص ليك 🎁</p>

            <div className="relative w-64 h-64 mx-auto mb-6">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 text-2xl">▼</div>
              <div
                className="w-full h-full rounded-full border-8 border-brand-600 relative overflow-hidden"
                style={{
                  transform: `rotate(${wheelRotation}deg)`,
                  transition: wheelSpinning ? "transform 3.2s cubic-bezier(0.15,0.9,0.25,1)" : "none",
                  background: `conic-gradient(#e1f5ee 0deg 60deg, #ffffff 60deg 120deg, #e1f5ee 120deg 180deg, #9fe1cb 180deg 240deg, #e1f5ee 240deg 300deg, #ffffff 300deg 360deg)`,
                }}
              >
                {WHEEL_SEGMENTS.map((label, i) => {
                  const angle = i * 60 + 30;
                  return (
                    <div
                      key={label}
                      className="absolute top-1/2 left-1/2 text-sm font-bold text-brand-800"
                      style={{
                        transform: `rotate(${angle}deg) translate(0, -85px) rotate(${-angle}deg)`,
                      }}
                    >
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>

            {!wheelDone ? (
              <button
                onClick={spinWheel}
                disabled={wheelSpinning}
                className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3 disabled:opacity-60"
              >
                {wheelSpinning ? "بتلف..." : "لُف العجلة"}
              </button>
            ) : (
              <div>
                <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 mb-4">
                  <p className="font-bold text-amber-800">🎉 مبروك! كسبت خصم ٩٧٪!</p>
                  <p className="text-xs text-amber-700 mt-1">{name}، هيتطبق الخصم تلقائيًا</p>
                </div>
                <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3">
                  استلم خصمي
                </button>
              </div>
            )}
          </div>
        )}

        {step.kind === "offer" && (
          <div>
            <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3 mb-5 text-xs">
              <div>
                <p className="text-neutral-400">العرض بينتهي خلال</p>
                <p className="font-bold text-red-600" dir="ltr">
                  {mm}:{ss}
                </p>
              </div>
              <div className="text-left">
                <p className="text-neutral-400">ابدأ بـ</p>
                <p className="font-bold text-brand-800">٩ جنيه بس</p>
              </div>
            </div>

            <span className="text-[11px] bg-amber-100 text-amber-800 rounded-full px-3 py-1">🎁 خصم خاص: ٩٧٪</span>
            <h2 className="text-xl font-bold mt-3 mb-1">
              خطتك الشخصية جاهزة، {name || "يا نجم"}!
            </h2>
            <p className="text-sm text-neutral-500 mb-5">
              اللي بيتفوقوا في اضطراب الذكاء الاصطناعي هما اللي بيتعلموه دلوقتي — وده بالظبط اللي انت هتعمله.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-neutral-400">🎯 هدفك</p>
                <p className="font-bold mt-1">
                  {answers.goal === "build-income" ? "بناء دخل إضافي" : archetype.title}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-neutral-400">⚡ مستواك</p>
                <p className="font-bold mt-1">جاهز للذكاء الاصطناعي</p>
              </div>
            </div>

            <div className="rounded-xl border border-black/5 p-3 mb-5">
              <p className="text-xs font-bold mb-2">لمحة من خطتك</p>
              <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                {["ChatGPT", "Claude", "Canva", "Midjourney"].map((tool, i) => (
                  <div key={tool} className="bg-brand-50 rounded-lg py-2">
                    <p className="font-bold text-brand-800">يوم {i + 1}</p>
                    <p className="text-neutral-500">{tool}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={goCheckout} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3.5 mb-5">
              احصل على خطتي ←
            </button>

            <div className="rounded-xl bg-neutral-50 p-3 mb-5">
              <p className="text-[11px] font-bold mb-2">🔥 ١,٢٤٧ شخص بدأوا خطتهم الأسبوع ده</p>
              <div className="space-y-1 text-[10px] text-neutral-400">
                {AVATARS.map((a, i) => (
                  <p key={a.name}>
                    {a.name} اشترك · من {i + 1} دقيقة
                  </p>
                ))}
              </div>
            </div>

            <ul className="text-xs space-y-1.5 mb-5 text-neutral-600">
              <li>✓ ٢٨ درس يومي مترابط (١٥ دقيقة بس)</li>
              <li>✓ خطة مخصصة لـ {archetype.title}</li>
              <li>✓ مكتبة أدوات وقوالب وبرومبتات جاهزة</li>
              <li>✓ شهادة إتمام</li>
              <li>✓ إلغاء الاشتراك في أي وقت</li>
            </ul>

            <p className="text-center text-[11px] text-neutral-400">🛡️ ضمان استرجاع الفلوس خلال ٣٠ يوم</p>
          </div>
        )}
      </div>
    </div>
  );
}
