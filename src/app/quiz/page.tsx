"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { brand, pricing, referral, payment } from "@/content/brand";
import { allCourses, courseStats } from "@/content/courses";
import { ALL_100_TRACKS } from "@/content/tracks100";
import { coursesWord } from "@/lib/arabic-plural";
import { trackLead, trackQuizStarted } from "@/lib/analytics";
import {
  quizQuestions,
  quizInterstitials,
  computeArchetype,
  computeReadinessScore,
} from "@/content/marketing-quiz";

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
    // Fires once on mount — starting the quiz, not every step within it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="px-4 pt-4 pb-3 border-b border-black/5 flex items-center justify-between max-w-lg mx-auto w-full">
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
        <div className="max-w-lg mx-auto w-full px-4 pt-2">
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

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-6">
        {step.kind === "roleIntro" && (
          <div>
            {/*
              The old version stacked four centred lines of near-equal weight,
              so the title wrapped mid-phrase and nothing led the eye. There is
              one question on this screen; everything else is scaffolding for it.
            */}
            <div className="mb-8 text-center">
              {/* No "·" between the words and the number: in RTL the separator
                  sits right against ٢٨ and the two read as "٢٨٠". */}
              <span className="quiz-eyebrow">تحدي الذكاء الاصطناعي في ٢٨ يوم</span>
              <h1 className="quiz-title mt-3">
                خلّي الذكاء الاصطناعي
                <br />
                <span className="text-brand-600">يشتغل لصالحك</span>
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-neutral-500">
                جاوب على كام سؤال سريع، وهنجهّزلك خطة ٢٨ يوم على مقاسك.
              </p>
            </div>

            <p className="mb-4 text-center text-base font-bold">بتوصف نفسك إزاي؟</p>

            <div className="mb-3 grid grid-cols-2 gap-3">
              {[
                { icon: "👨‍💼", label: "بشتغل في شركة", value: "employee" },
                { icon: "👩‍💼", label: "بابني مشروعي", value: "founder" },
              ].map((o, i) => (
                <button
                  key={o.value}
                  onClick={() => {
                    setRole(o.value);
                    next();
                  }}
                  className="role-card animate-rise"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="role-card-icon" aria-hidden>
                    {o.icon}
                  </span>
                  <span className="role-card-label">{o.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setRole("exploring");
                next();
              }}
              className="role-card role-card-wide animate-rise"
              style={{ animationDelay: "160ms" }}
            >
              <span className="role-card-icon" aria-hidden>
                🌱
              </span>
              <span className="role-card-label">بستكشف الموضوع لنفسي</span>
            </button>

            <p className="mt-6 text-center text-[11px] text-neutral-400">
              ✓ دقيقتين بس · ✓ نتيجة فورية · ✓ من غير بطاقة بنكية
            </p>
          </div>
        )}

        {/*
          What this platform actually is, in numbers that can be counted.

          This step used to claim a hundred thousand users and a 4.9 rating from
          twelve thousand reviews. There were zero of both. The content below is
          the real inventory — and a funnel that runs on WhatsApp trust cannot
          afford a number the reader can disprove by asking one question.
        */}
        {step.kind === "socialProof" && (
          <div className="text-center pt-4">
            <div className="text-4xl mb-3">🚀</div>
            <h2 className="text-2xl font-black mb-2">منظومة تعليمية متكاملة بانتظارك</h2>
            <p className="text-sm text-neutral-500 mb-5">محتوى ثنائي اللغة (عربي / إنجليزي) مبني على أحدث علوم النفس السلوكية والتطبيق العملي</p>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {[
                { n: "١٠٠", l: "مسار احترافي" },
                { n: `${totalLessons}+`, l: "درس عملي" },
                { n: "١٥", l: "دقيقة/يوم" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-white border border-brand-100 shadow-sm py-3 transition hover:shadow-md">
                  <p className="text-2xl font-black text-brand-800">{s.n}</p>
                  <p className="text-[11px] font-medium text-neutral-500 mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-teal-50 border border-brand-200/60 p-3.5 text-sm text-brand-900 mb-5 shadow-sm">
              ✨ اليوم الأول في <b>كل الـ ١٠٠ مسار</b> مفتوح مجانًا بالكامل — جرّب عمليًا قبل ما تقرر
            </div>

            <p className="font-bold text-neutral-800 mb-4 text-sm">خلّينا نبني خطتك الشخصية والمسار الأنسب لأهدافك — دقيقتين بس</p>
            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3.5 shadow-md hover:bg-brand-700 transition">
              ابدأ التقييم الآن ←
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

        {/*
          Three invented customers used to sit here, with invented job titles
          and an invented outcome each. They are gone. Until real learners say
          something worth quoting, the honest substitute is what the buyer
          actually receives — which is checkable, and stronger than praise
          nobody wrote.
        */}
        {step.kind === "testimonials" && (
          <div>
            <h2 className="text-xl font-bold text-center mb-1">اللي بتاخده بالظبط عند الانضمام</h2>
            <p className="text-xs text-neutral-400 text-center mb-5">دفعة واحدة فقط مدى الحياة — بدون أي اشتراك شهري</p>

            <div className="space-y-2.5 mb-6">
              {[
                { i: "🎯", t: "١٠٠ مسار احترافي في ١٠ مجالات حيوية", s: `أكثر من ${totalLessons}+ درس عملي وتطبيقي مع رسوم بيانية وجرافيكس لكل درس` },
                { i: "🌐", t: "منصة ثنائية اللغة بالكامل (عربي / إنجليزي)", s: "بدّل اللغة بنقرة زر في أي وقت مع مصطلحات تقنية عالمية مشروحة" },
                { i: "🧠", t: "أدوات الدعم النفسي والتركيز الفائق المدمجة", s: "مؤقت بومودورو مدمج، ترددات ألفا الذهنية، واختبار طاقة ومزاج يومي" },
                { i: "👥", t: "مجتمع يضم أكثر من ٣٠٠ عضو وقصص نجاح حقيقية", s: "تواصل واستفد من خبرات رواد أعمال وفريلانسرز ومبرمجين في كل الدول العربية" },
                { i: "🎁", t: "اليوم الأول مجاني في كل مسار", s: "تجرّب بنفسك أسلوب التعلم وجودة المحتوى بدون أي مخاطرة" },
                { i: "⚡", t: "تفعيل فوري وآمن خلال دقائق", s: "تحويل مباشر عبر فودافون كاش أو إنستاباي بدون أي عمولات وسيطة" },
              ].map((f) => (
                <div key={f.t} className="flex gap-3 rounded-xl bg-white border border-brand-100/80 p-3 shadow-sm hover:border-brand-300 transition">
                  <span className="text-xl leading-none">{f.i}</span>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">{f.t}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{f.s}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3.5 shadow-md hover:bg-brand-700 transition">
              كمّل وشوف سعرك المخصص ←
            </button>
          </div>
        )}

        {step.kind === "wheel" && (
          <div className="text-center">
            <div className="text-4xl mb-2">🎁</div>
            <span className="inline-block bg-amber-100 text-amber-800 text-[11px] font-bold px-3 py-1 rounded-full mb-3">
              عرض فوج التأسيس الأول · متبقي {pricing.cohortSeatsRemaining} مقعدًا فقط
            </span>
            <h2 className="text-2xl font-black mb-1">سعرك الاستثنائي، {name || "يا بطل"}</h2>
            <p className="text-xs text-neutral-500 mb-5">خصم 71% للأعضاء المؤسسين — لن يتكرر هذا السعر</p>

            <div className="rounded-2xl border-2 border-brand-500 bg-gradient-to-b from-brand-50 to-white p-5 mb-4 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-center gap-3 my-2">
                <span className="text-xl text-neutral-400 line-through font-bold">{pricing.originalPriceEgp} ج.م</span>
                <span className="text-5xl font-black text-brand-800">{pricing.priceEgp}</span>
                <span className="text-sm font-bold text-brand-800 mb-1">ج.م</span>
              </div>
              <p className="text-xs font-bold text-brand-900 mt-2">
                دفعة واحدة فقط · وصول مدى الحياة لكل الـ ١٠٠ مسار · {totalLessons}+ درس · كل التحديثات المستقبلية مجاناً
              </p>
            </div>

            <p className="text-xs text-neutral-500 mb-6">
              يعني أقل من 25 قرشاً للدرس الواحد — استثمار بسيط يفتحلك مصادر دخل بمئات وآلاف الجنيهات!
            </p>

            <button onClick={next} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3.5 shadow-md hover:bg-brand-700 transition">
              احصل على العرض والتحق بالفوج ←
            </button>
          </div>
        )}

        {step.kind === "offer" && (
          <div>
            <div className="flex items-center justify-between bg-brand-50 border border-brand-200/80 rounded-xl p-3 mb-5 text-xs">
              <div>
                <p className="text-neutral-500">التفعيل</p>
                <p className="font-bold text-brand-800">تلقائي وفوري خلال دقائق</p>
              </div>
              <div className="text-left">
                <p className="text-neutral-500">الاستثمار الكامل</p>
                <p className="font-bold text-brand-800">{pricing.priceEgp} ج.م فقط (بدل {pricing.originalPriceEgp})</p>
              </div>
            </div>

            <h2 className="text-2xl font-black mt-2 mb-1">
              خطتك الشخصية جاهزة للانطلاق، {name || "يا بطل"}!
            </h2>
            <p className="text-sm text-neutral-500 mb-5">
              مرحبًا بك في نقطة التحوّل. الـ ١٠٠ مسار وأدوات الدعم النفسي بالكامل بين يديك الآن.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
              <div className="bg-neutral-50 rounded-xl p-3 border border-black/5">
                <p className="text-neutral-400">🎯 مسار انطلاقك</p>
                <p className="font-bold mt-1 text-brand-800">
                  {answers.goal === "build-income" ? "بناء دخل ومشاريع" : archetype.title}
                </p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-3 border border-black/5">
                <p className="text-neutral-400">⚡ مستوى الانطلاق</p>
                <p className="font-bold mt-1 text-brand-800">جاهز للتطبيق السريع</p>
              </div>
            </div>

            <div className="rounded-xl border border-black/5 p-3.5 bg-white mb-5 shadow-sm">
              <p className="text-xs font-bold mb-2">أول ٤ أيام من خطتك</p>
              <div className="grid grid-cols-4 gap-2 text-[10px] text-center">
                {["أساسيات المهارة", "أدوات الذكاء وتطبيقها", "أول مشروع عملي", "استراتيجيات الدخل"].map((tool, i) => (
                  <div key={tool} className="bg-brand-50 rounded-lg py-2 px-1">
                    <p className="font-bold text-brand-800">يوم {i + 1}</p>
                    <p className="text-neutral-600 mt-0.5 line-clamp-1">{tool}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={goCheckout} className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3.5 mb-4 shadow-lg hover:bg-brand-700 transition">
              تأكيد التسجيل والانضمام بـ {pricing.priceEgp} ج.م فقط ←
            </button>

            <div className="rounded-xl bg-neutral-50 p-3 mb-5 text-center border border-black/5">
              <p className="text-[11px] text-neutral-500">
                عندك استفسار قبل التحويل؟ كلّمنا واتساب فورًا:{" "}
                <a href={`https://wa.me/2${payment.supportWhatsapp}`} className="font-bold text-brand-700 hover:underline" dir="ltr">
                  {payment.supportWhatsapp}
                </a>
              </p>
            </div>

            <ul className="text-xs space-y-2 mb-5 text-neutral-700 bg-white p-4 rounded-xl border border-black/5 shadow-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>١٠٠ مسار احترافي كامل</b> في ١٠ أركان حيوية</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>محتوى ثنائي اللغة (عربي / إنجليزي)</b> بنقرة واحدة</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>أكثر من {totalLessons} درس تطبيقي</b> مع رسوم وجرافيكس لكل درس</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>أدوات الدعم النفسي</b>: بومودورو + ترددات ألفا للتركيز + فحص طاقة</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>مجتمع ٣٠٠+ عضو حقيقي</b> مع شبكة علاقات وتجارب ملهمة</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>شهادة إتمام معتمدة</b> لكل مسار تنهيه بنجاح</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>وصول مدى الحياة</b> — دفعة واحدة {pricing.priceEgp} ج.م بدون أي اشتراك شهري</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span><b>{pricing.guaranteeNote}</b></span>
              </li>
            </ul>

            <p className="text-center text-[11px] leading-relaxed text-neutral-400">
              🎁 اليوم الأول من كل مسار من الـ ١٠٠ مفتوح مجانًا — جودة ومصداقية نضمنها لك
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
