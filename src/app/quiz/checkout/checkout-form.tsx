"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { brand, pricing, payment } from "@/content/brand";
import { trackInitiateCheckout } from "@/lib/analytics";

type CourseOption = { slug: string; title: string; icon: string; category: string };
type Method = "vodafone_cash" | "instapay";
type Channel = "whatsapp" | "email";

function waLink(local: string) {
  return `https://wa.me/20${local.replace(/^0/, "")}`;
}

function CopyField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="w-full flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-neutral-50 px-3 py-2.5 text-right transition hover:border-brand-400 hover:bg-brand-50/50 active:scale-[0.99]"
    >
      <span className="flex items-center gap-2 shrink-0 text-[11px] font-bold text-brand-700">
        {copied ? (
          <>
            <span aria-hidden>✓</span> اتنسخ
          </>
        ) : (
          <>
            <span aria-hidden>📋</span> انسخ
          </>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-left font-bold tracking-wide text-neutral-800" dir="ltr">
        {value}
      </span>
      {label && <span className="shrink-0 text-[11px] text-neutral-400">{label}</span>}
    </button>
  );
}

export default function CheckoutForm({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instapayName, setInstapayName] = useState("");
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? "");
  const [method, setMethod] = useState<Method>("vodafone_cash");
  const [proofChannel, setProofChannel] = useState<Channel>("whatsapp");
  const [withOrderBump, setWithOrderBump] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const totalPrice = pricing.priceEgp + (withOrderBump ? pricing.orderBumpPriceEgp : 0);

  useEffect(() => {
    const raw = sessionStorage.getItem("tawwerni_checkout");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.email) setEmail(data.email);
        if (data.name) setName(data.name);
        if (data.courseSlug) setCourseSlug(data.courseSlug);
      } catch {
        /* ignore malformed session data */
      }
    }
    setReady(true);
    // Reaching the payment screen — the last step before money moves. This is
    // the signal Meta can optimise toward before there are enough real
    // purchases to learn from.
    trackInitiateCheckout(pricing.priceEgp);
  }, []);

  const selected = courses.find((c) => c.slug === courseSlug);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^01\d{9}$/.test(phone)) {
      setError("رقم الموبايل لازم يكون ١١ رقم ويبدأ بـ 01");
      return;
    }
    if (method === "instapay" && instapayName.trim().length < 3) {
      setError("اكتب اسمك زي ما هو على حسابك في إنستاباي");
      return;
    }

    setLoading(true);

    // Everything below must reset `loading`, otherwise the button sticks on
    // "جاري التسجيل…" forever and the customer has no way to retry.
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone, instapayName, courseSlug, method, proofChannel }),
      });

      // A crashed route returns an HTML error page, so parsing can throw too.
      const raw = await res.text();
      let data: { error?: string } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(
          data.error ??
            `حصل خطأ في السيرفر (${res.status}). جرّب تاني، ولو فضلت المشكلة كلّمنا على واتساب ${payment.supportWhatsapp}.`
        );
        return;
      }

      sessionStorage.removeItem("tawwerni_checkout");
      setDone(true);
    } catch {
      setError("مفيش اتصال بالإنترنت. اتأكد من الشبكة وجرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  if (done) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-8">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-black/5 bg-white p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-3xl">
              ⏳
            </div>
            <h1 className="mb-2 text-xl font-bold">سجّلنا طلبك!</h1>
            <p className="mb-5 text-sm leading-relaxed text-neutral-500">
              فاضل خطوة واحدة بس: حوّل <b className="text-brand-700">{totalPrice} ج.م</b> وابعتلنا صورة
              التحويل، وهنفعّل حسابك خلال {payment.activationHours} ساعة.
            </p>

            <div className="mb-5 rounded-xl border border-black/5 bg-neutral-50 p-3 text-right">
              <p className="mb-2 text-[11px] font-bold text-neutral-400">لما تبعت الإثبات، اكتب معاه:</p>
              <ul className="space-y-1 text-xs text-neutral-600">
                <li>• الإيميل: <b dir="ltr">{email}</b></li>
                <li>• هيبدأ بـ: <b>{selected?.title}</b></li>
                <li>• المبلغ: <b>{totalPrice} ج.م {withOrderBump ? "(شامل حزمة البرومبتات والعقود VIP)" : ""}</b></li>
                <li>• الرقم اللي حوّلت منه</li>
              </ul>
            </div>

            <a
              href={
                proofChannel === "whatsapp"
                  ? waLink(payment.supportWhatsapp)
                  : `mailto:${payment.supportEmail}?subject=${encodeURIComponent("إثبات دفع - " + (selected?.title ?? ""))}&body=${encodeURIComponent(`الإيميل: ${email}\nالمسار: ${selected?.title ?? ""}\nالمبلغ: ${totalPrice} ج.م\nالرقم اللي حوّلت منه: `)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block w-full rounded-full bg-brand-600 btn-shine py-3 font-bold text-white shadow-md hover:bg-brand-700"
            >
              {proofChannel === "whatsapp" ? "ابعت الإثبات على واتساب ←" : "ابعت الإثبات بالإيميل ←"}
            </a>
            <button
              onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}
              className="w-full rounded-full border border-black/10 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-100"
            >
              أنشئ حسابي دلوقتي
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto max-w-md">
        <p className="mb-6 text-center font-bold text-brand-800">
          {brand.name}
          <span className="text-brand-400">.com</span>
        </p>

        {/* Price summary with anchor & cohort urgency */}
        <div className="mb-4 overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-700 via-brand-800 to-teal-900 p-5 text-white shadow-lg relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-teal-200">{pricing.offerNote}</span>
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-black text-neutral-950 shadow-sm">
              خصم 71%
            </span>
          </div>
          <div className="flex items-end gap-2.5">
            <span className="text-4xl font-black tracking-tight" dir="ltr">
              {totalPrice}
            </span>
            <span className="pb-1 text-sm font-bold">ج.م</span>
            <span className="text-sm text-white/50 line-through pb-1">
              {pricing.originalPriceEgp} ج.م
            </span>
            <span className="mb-1 mr-auto rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm">
              ١٠٠ مسار · مدى الحياة
            </span>
          </div>
          <p className="mt-2 text-[11px] text-white/80 flex items-center gap-1.5">
            <span>🔥</span>
            <span>باقي <b>{pricing.cohortSeatsRemaining} مقعدًا فقط</b> في فوج التأسيس الأول بالسعر المخفض</span>
          </p>
        </div>

        {/* Order Bump Special Offer */}
        <div
          onClick={() => setWithOrderBump(!withOrderBump)}
          className={`mb-4 cursor-pointer rounded-2xl border-2 p-4 transition-all ${
            withOrderBump
              ? "border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-400/20"
              : "border-dashed border-amber-300 bg-amber-50/30 hover:border-amber-400"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={withOrderBump}
              onChange={(e) => setWithOrderBump(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 h-5 w-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div className="flex-1 text-right">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[10px] font-black text-amber-900">
                  ⚡ ترقية حصرية مضافة لطلبك (Order Bump)
                </span>
                <span className="text-xs font-black text-brand-800">+{pricing.orderBumpPriceEgp} ج.م فقط</span>
                <span className="text-[10px] text-neutral-400 line-through">٤٥٠ ج.م</span>
              </div>
              <p className="mt-1 text-xs font-bold text-neutral-900 leading-snug">
                {pricing.orderBumpTitle}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-600">
                بنك مكوّن من +1,000 أمر ذكاء اصطناعي احترافي عالي الدقة تم اختباره للبيزنس والمبيعات والبرمجة + صِيغ عقود عمل حر تحمي أتعابك قانونيًا.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Course */}
          <div className="rounded-2xl border border-black/5 bg-white p-4">
            <label className="mb-1 block text-xs font-bold text-neutral-500">
              ١. تحب تبدأ بأنهي مسار؟
            </label>
            <p className="mb-3 rounded-lg bg-brand-50 px-3 py-2 text-xs leading-relaxed text-brand-800">
              ✓ اشتراكك بيفتح <b>كل الـ ١٠٠ مسار</b> مدى الحياة — ده بس عشان نجهّزلك نقطة البداية المخصصة.
            </p>
            <div className="space-y-2">
              {courses.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCourseSlug(c.slug)}
                  className={`card-lift flex w-full items-center gap-3 rounded-xl border-2 p-3 text-right ${
                    courseSlug === c.slug
                      ? "border-brand-600 bg-brand-50"
                      : "border-black/10 bg-white hover:border-black/20"
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{c.title}</span>
                    <span className="block text-[11px] text-neutral-400">{c.category}</span>
                  </span>
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      courseSlug === c.slug ? "border-brand-600 bg-brand-600" : "border-black/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="rounded-2xl border border-black/5 bg-white p-4">
            <label className="mb-2 block text-xs font-bold text-neutral-500">٢. بياناتك</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك بالكامل"
              className="mb-2 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
            />
            <input
              required
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mb-2 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
            />
            <input
              required
              type="tel"
              inputMode="numeric"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))}
              placeholder="01xxxxxxxxx"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">
              اكتب <b className="text-neutral-500">رقم المحفظة اللي هتحوّل منه</b> — بنستخدمه عشان
              نلاقي تحويلك بسرعة. وهنفعّل اشتراكك على الإيميل ده، فتأكد إنه صح.
            </p>
          </div>

          {/* Payment method */}
          <div className="rounded-2xl border border-black/5 bg-white p-4">
            <label className="mb-2 block text-xs font-bold text-neutral-500">٣. حوّل المبلغ</label>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`card-lift rounded-xl border-2 p-3 text-center ${
                  method === "vodafone_cash" ? "border-brand-600 bg-brand-50" : "border-black/10 bg-white"
                }`}
              >
                <div className="mb-1 text-xl">📱</div>
                <div className="text-[11px] font-bold">فودافون كاش</div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`card-lift rounded-xl border-2 p-3 text-center ${
                  method === "instapay" ? "border-brand-600 bg-brand-50" : "border-black/10 bg-white"
                }`}
              >
                <div className="mb-1 text-xl">⚡</div>
                <div className="text-[11px] font-bold">إنستاباي</div>
              </button>
            </div>

            <p className="mb-2 text-[11px] text-neutral-500">
              {method === "vodafone_cash"
                ? `حوّل ${totalPrice} ج.م على أي رقم من دول:`
                : `حوّل ${totalPrice} ج.م على:`}
            </p>
            <div className="space-y-2">
              {(method === "vodafone_cash" ? payment.vodafoneCash : payment.instapay).map((v) => (
                <CopyField key={v} value={v} />
              ))}
            </div>

            {method === "instapay" && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                <label className="mb-1.5 block text-[11px] font-bold text-amber-900">
                  الاسم الظاهر على حسابك في إنستاباي
                </label>
                <input
                  required
                  value={instapayName}
                  onChange={(e) => setInstapayName(e.target.value)}
                  placeholder="الاسم بالكامل زي ما هو في البنك"
                  className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
                />
                <p className="mt-1.5 text-[11px] leading-relaxed text-amber-800">
                  رسالة إنستاباي بتوصلنا بالاسم من غير رقم، فمحتاجين الاسم بالظبط
                  عشان نعرف التحويل بتاعك.
                </p>
              </div>
            )}
          </div>

          {/* Proof channel */}
          <div className="rounded-2xl border border-black/5 bg-white p-4">
            <label className="mb-2 block text-xs font-bold text-neutral-500">
              ٤. هتبعتلنا صورة التحويل فين؟
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProofChannel("whatsapp")}
                className={`card-lift rounded-xl border-2 p-3 text-center ${
                  proofChannel === "whatsapp" ? "border-brand-600 bg-brand-50" : "border-black/10 bg-white"
                }`}
              >
                <div className="mb-1 text-lg">💬</div>
                <div className="text-[11px] font-bold">واتساب</div>
                <div className="text-[10px] text-neutral-400" dir="ltr">
                  {payment.supportWhatsapp}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProofChannel("email")}
                className={`card-lift rounded-xl border-2 p-3 text-center ${
                  proofChannel === "email" ? "border-brand-600 bg-brand-50" : "border-black/10 bg-white"
                }`}
              >
                <div className="mb-1 text-lg">✉️</div>
                <div className="text-[11px] font-bold">إيميل</div>
                <div className="truncate text-[10px] text-neutral-400" dir="ltr">
                  {payment.supportEmail}
                </div>
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 btn-shine py-3.5 font-bold text-white disabled:opacity-60"
          >
            {loading ? "جاري التسجيل..." : "سجّل طلبي ←"}
          </button>

          <p className="pb-4 text-center text-[11px] leading-relaxed text-neutral-400">
            بعد ما تبعت الإثبات، هنفعّل اشتراكك خلال {payment.activationHours} ساعة على الإيميل اللي كتبته.
          </p>
        </form>
      </div>
    </div>
  );
}
