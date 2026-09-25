"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brand, pricing, payment } from "@/content/brand";
import { trackInitiateCheckout } from "@/lib/analytics";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";

type CourseOption = {
  slug: string;
  title: string;
  titleEn?: string;
  icon: string;
  category: string;
  categoryEn?: string;
};
type Method = "vodafone_cash" | "instapay";
type Channel = "whatsapp" | "email";

function waLink(local: string) {
  return `https://wa.me/20${local.replace(/^0/, "")}`;
}

function CopyField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const { lang } = useI18n();
  const isEn = lang === "en";

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
      className="w-full flex items-center justify-between gap-3 rounded-2xl border border-black/10 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 px-3.5 py-3 text-start transition hover:border-teal-500 active:scale-98"
    >
      <span className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-teal-600 dark:text-teal-400">
        {copied ? (
          <>
            <span aria-hidden>✓</span> {isEn ? "Copied" : "تم النسخ"}
          </>
        ) : (
          <>
            <span aria-hidden>📋</span> {isEn ? "Copy" : "انسخ"}
          </>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono font-bold tracking-wide text-neutral-800 dark:text-neutral-200" dir="ltr">
        {value}
      </span>
      {label && <span className="shrink-0 text-xs text-neutral-400">{label}</span>}
    </button>
  );
}

export default function CheckoutForm({ courses }: { courses: CourseOption[] }) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

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
    trackInitiateCheckout(pricing.priceEgp);
  }, []);

  const selected = courses.find((c) => c.slug === courseSlug);
  const selectedTitle = isEn ? (selected?.titleEn || selected?.title) : selected?.title;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^01\d{9}$/.test(phone)) {
      setError(isEn ? "Mobile number must be 11 digits starting with 01" : "رقم الموبايل يجب أن يكون ١١ رقمًا ويبدأ بـ 01");
      return;
    }
    if (method === "instapay" && instapayName.trim().length < 3) {
      setError(isEn ? "Please enter your name as displayed on your InstaPay account" : "اكتب اسمك كما هو مسجل في حساب إنستاباي");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone, instapayName, courseSlug, method, proofChannel }),
      });

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
            (isEn
              ? `Server error (${res.status}). Please try again, or WhatsApp us at +${payment.supportWhatsapp}.`
              : `حصل خطأ في السيرفر (${res.status}). جرّب تاني، ولو فضلت المشكلة كلمنا على واتساب ${payment.supportWhatsapp}.`)
        );
        return;
      }

      sessionStorage.removeItem("tawwerni_checkout");
      setDone(true);
    } catch {
      setError(isEn ? "No internet connection. Please verify your connection." : "مفيش اتصال بالإنترنت. اتأكد من الشبكة وجرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) return null;

  if (done) {
    return (
      <div
        dir={isEn ? "ltr" : "rtl"}
        className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-4 py-10 transition-colors"
      >
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-7 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-3xl">
              ⏳
            </div>
            <h1 className="mb-2 text-2xl font-black text-neutral-900 dark:text-white">
              {isEn ? "Order Registered Successfully!" : "سجّلنا طلبك بنجاح!"}
            </h1>
            <p className="mb-5 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {isEn ? (
                <>
                  One final quick step: transfer <b className="text-teal-600 dark:text-teal-400 font-mono">{totalPrice} EGP</b> and send us the payment screenshot. We will activate your account within {payment.activationHours} hours.
                </>
              ) : (
                <>
                  خطوة واحدة فقط باقية: حوّل <b className="text-teal-600 dark:text-teal-400 font-mono">{totalPrice} ج.م</b> وأرسل لنا لقطة شاشة التحويل، وسنفعّل حسابك فورًا خلال {payment.activationHours} ساعة.
                </>
              )}
            </p>

            <div className="mb-5 rounded-2xl border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/50 p-4 text-start">
              <p className="mb-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                {isEn ? "When sending confirmation, include:" : "عند إرسال الإثبات، اكتب معه:"}
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                <li>• {isEn ? "Email:" : "الإيميل:"} <b dir="ltr">{email}</b></li>
                <li>• {isEn ? "Starting Track:" : "المسار الأولي:"} <b>{selectedTitle}</b></li>
                <li>• {isEn ? "Amount:" : "المبلغ:"} <b className="font-mono">{totalPrice} {isEn ? "EGP" : "ج.م"} {withOrderBump ? (isEn ? "(Includes VIP Prompts & Contracts)" : "(شامل حزمة البرومبتات والعقود VIP)") : ""}</b></li>
                <li>• {isEn ? "Sender Phone / Wallet Number" : "الرقم أو المحفظة المحوّل منها"}</li>
              </ul>
            </div>

            <a
              href={
                proofChannel === "whatsapp"
                  ? waLink(payment.supportWhatsapp)
                  : `mailto:${payment.supportEmail}?subject=${encodeURIComponent("Payment Proof - " + (selectedTitle ?? ""))}&body=${encodeURIComponent(`Email: ${email}\nTrack: ${selectedTitle ?? ""}\nAmount: ${totalPrice} EGP\nSender Phone: `)}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3.5 font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {proofChannel === "whatsapp"
                ? isEn ? "Send Screenshot on WhatsApp →" : "ابعت الإثبات على واتساب ←"
                : isEn ? "Send Screenshot via Email →" : "ابعت الإثبات بالإيميل ←"}
            </a>
            <button
              onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}
              className="w-full rounded-full border border-black/10 dark:border-neutral-700 py-3 text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {isEn ? "Create / Access My Account Now" : "أنشئ حسابي الآن"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-4 py-8 transition-colors"
    >
      <div className="mx-auto max-w-md">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Price summary card */}
        <div className="mb-4 overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-800 via-teal-900 to-neutral-950 p-5 text-white shadow-lg relative">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-teal-200">
              {isEn ? "Founding Cohort · Lifetime Access" : pricing.offerNote}
            </span>
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-black text-neutral-950 shadow-xs">
              {isEn ? "71% OFF" : "خصم 71%"}
            </span>
          </div>
          <div className="flex items-end gap-2.5 my-1">
            <span className="text-4xl font-black font-mono tracking-tight" dir="ltr">
              {totalPrice}
            </span>
            <span className="pb-1 text-sm font-bold">{isEn ? "EGP" : "ج.م"}</span>
            <span className="text-sm text-white/50 line-through pb-1 font-mono">
              {pricing.originalPriceEgp} {isEn ? "EGP" : "ج.م"}
            </span>
            <span className={`mb-1 ${isEn ? "ml-auto" : "mr-auto"} rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm`}>
              {isEn ? "100 Tracks · Lifetime" : "١٠٠ مسار · مدى الحياة"}
            </span>
          </div>
          <p className="mt-2 text-xs text-white/80 flex items-center gap-1.5">
            <span>🔥</span>
            <span>
              {isEn ? (
                <>Only <b>{pricing.cohortSeatsRemaining} seats remaining</b> at this launch rate</>
              ) : (
                <>باقي <b>{pricing.cohortSeatsRemaining} مقعدًا فقط</b> في فوج التأسيس الأول بالسعر المخفض</>
              )}
            </span>
          </p>
        </div>

        {/* Order Bump */}
        <div
          onClick={() => setWithOrderBump(!withOrderBump)}
          className={`mb-4 cursor-pointer rounded-2xl border-2 p-4 transition-all ${
            withOrderBump
              ? "border-amber-500 bg-amber-500/10 shadow-md ring-2 ring-amber-400/20"
              : "border-dashed border-amber-400/40 bg-amber-50/30 dark:bg-amber-950/20 hover:border-amber-400"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={withOrderBump}
              onChange={(e) => setWithOrderBump(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 h-5 w-5 rounded border-neutral-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
            />
            <div className="flex-1 text-start">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-200 px-2 py-0.5 text-[10px] font-black">
                  ⚡ {isEn ? "Exclusive VIP Upgrade (Order Bump)" : "ترقية حصرية مضافة لطلبك"}
                </span>
                <span className="text-xs font-black text-amber-700 dark:text-amber-300 font-mono">
                  +{pricing.orderBumpPriceEgp} {isEn ? "EGP only" : "ج.م فقط"}
                </span>
                <span className="text-[10px] text-neutral-400 line-through font-mono">
                  450 {isEn ? "EGP" : "ج.م"}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-neutral-900 dark:text-white leading-snug">
                {isEn
                  ? "Secret 1,000+ Corporate AI Prompts Bank + Verified Freelance Legal Contracts"
                  : pricing.orderBumpTitle}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                {isEn
                  ? "A tested vault of 1,000+ high-precision AI prompts for marketing, sales, and software + battle-tested bilingual freelance contracts protecting your fees legally."
                  : "بنك مكوّن من +1,000 أمر ذكاء اصطناعي احترافي عالي الدقة تم اختباره للبيزنس والمبيعات والبرمجة + صِيغ عقود عمل حر تحمي أتعابك قانونيًا."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Step 1: Track Choice */}
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <label className="mb-1 block text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {isEn ? "1. Which track would you like to start with?" : "١. تحب تبدأ بأنهي مسار؟"}
            </label>
            <p className="mb-3 rounded-xl bg-teal-500/10 px-3 py-2 text-xs leading-relaxed text-teal-800 dark:text-teal-300">
              {isEn
                ? "✓ Your membership unlocks ALL 100 tracks for life — this simply sets your customized starting point."
                : "✓ اشتراكك يفتح كل الـ ١٠٠ مسار مدى الحياة — هذا فقط لتحديد نقطة انطلاقك الأولى."}
            </p>
            <div className="space-y-2">
              {courses.slice(0, 5).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCourseSlug(c.slug)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start transition-all ${
                    courseSlug === c.slug
                      ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/40"
                      : "border-black/5 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-black/20"
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">
                      {isEn ? (c.titleEn || c.title) : c.title}
                    </span>
                    <span className="block text-[10px] text-neutral-400">
                      {isEn ? (c.categoryEn || c.category) : c.category}
                    </span>
                  </span>
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      courseSlug === c.slug ? "border-teal-600 bg-teal-600" : "border-neutral-300 dark:border-neutral-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Contact Details */}
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <label className="mb-2 block text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {isEn ? "2. Your Information" : "٢. بياناتك"}
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? "Full name" : "اسمك بالكامل"}
              className="mb-2 w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
            />
            <input
              required
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mb-2 w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
            />
            <input
              required
              type="tel"
              inputMode="numeric"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))}
              placeholder="01xxxxxxxxx"
              className="w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3.5 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "Enter the phone/wallet number you will transfer from so we can confirm quickly. Your account will be activated on this email."
                : "اكتب رقم المحفظة التي ستحوّل منها لتسهيل المطابقة السريعة. سنفعّل اشتراكك على هذا البريد الإلكتروني."}
            </p>
          </div>

          {/* Step 3: Payment Method */}
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <label className="mb-2 block text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {isEn ? "3. Transfer Amount" : "٣. حوّل المبلغ"}
            </label>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  method === "vodafone_cash"
                    ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/40"
                    : "border-black/5 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="mb-1 text-xl">📱</div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isEn ? "Vodafone Cash" : "فودافون كاش"}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  method === "instapay"
                    ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/40"
                    : "border-black/5 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="mb-1 text-xl">⚡</div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isEn ? "InstaPay" : "إنستاباي"}
                </div>
              </button>
            </div>

            <p className="mb-2 text-xs text-neutral-600 dark:text-neutral-400">
              {method === "vodafone_cash"
                ? isEn
                  ? `Transfer ${totalPrice} EGP to any of these numbers:`
                  : `حوّل ${totalPrice} ج.م على أي رقم من التالي:`
                : isEn
                ? `Transfer ${totalPrice} EGP to:`
                : `حوّل ${totalPrice} ج.م على:`}
            </p>
            <div className="space-y-2">
              {(method === "vodafone_cash" ? payment.vodafoneCash : payment.instapay).map((v) => (
                <CopyField key={v} value={v} />
              ))}
            </div>

            {method === "instapay" && (
              <div className="mt-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <label className="mb-1.5 block text-xs font-bold text-amber-900 dark:text-amber-200">
                  {isEn ? "Name displayed on your InstaPay account" : "الاسم الظاهر على حسابك في إنستاباي"}
                </label>
                <input
                  required
                  value={instapayName}
                  onChange={(e) => setInstapayName(e.target.value)}
                  placeholder={isEn ? "Full account name as shown in app" : "الاسم بالكامل زي ما هو في البنك"}
                  className="w-full rounded-xl border border-amber-500/30 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
                />
                <p className="mt-1.5 text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  {isEn
                    ? "InstaPay receipts display sender name rather than phone number, so exact name ensures rapid confirmation."
                    : "إشعار إنستاباي يصلنا بالاسم وليس برقم الهاتف، لذلك نطلب الاسم لتأكيد التحويل مباشرة."}
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Proof Channel */}
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <label className="mb-2 block text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {isEn ? "4. Where will you send your payment receipt?" : "٤. أين ترغب بإرسال صورة التحويل؟"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProofChannel("whatsapp")}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  proofChannel === "whatsapp"
                    ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/40"
                    : "border-black/5 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="mb-1 text-lg">💬</div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isEn ? "WhatsApp" : "واتساب"}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono" dir="ltr">
                  +{payment.supportWhatsapp}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProofChannel("email")}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  proofChannel === "email"
                    ? "border-teal-600 bg-teal-50/50 dark:bg-teal-950/40"
                    : "border-black/5 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                }`}
              >
                <div className="mb-1 text-lg">✉️</div>
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  {isEn ? "Email" : "إيميل"}
                </div>
                <div className="truncate text-[10px] text-neutral-400 font-mono" dir="ltr">
                  {payment.supportEmail}
                </div>
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-4 py-2.5 text-xs text-red-600 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-4 font-bold text-white shadow-lg hover:brightness-110 active:scale-98 transition-all disabled:opacity-60 text-sm"
          >
            {loading
              ? isEn ? "Registering Order..." : "جاري التسجيل..."
              : isEn ? `Submit Order for ${totalPrice} EGP →` : `سجّل طلبي بـ ${totalPrice} ج.م فقط ←`}
          </button>

          <p className="pb-4 text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {isEn
              ? `After sending proof, your account is activated within ${payment.activationHours} hours on your registered email.`
              : `بعد إرسال الإثبات، سنفعّل حسابك خلال ${payment.activationHours} ساعة على بريدك الإلكتروني.`}
          </p>
        </form>
      </div>
    </div>
  );
}
