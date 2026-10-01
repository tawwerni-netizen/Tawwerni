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
      className={`w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-start transition-all duration-200 active:scale-98 ${
        copied
          ? "border-emerald-400 bg-emerald-500/15 shadow-md shadow-emerald-500/10"
          : "border-white/10 bg-[#0d1614] hover:border-emerald-500/50 hover:bg-[#12211d]"
      }`}
    >
      <span className="flex items-center gap-1.5 shrink-0 text-xs font-black text-emerald-400">
        {copied ? (
          <>
            <span aria-hidden>✓</span> {isEn ? "Copied!" : "تم النسخ بنجاح!"}
          </>
        ) : (
          <>
            <span aria-hidden>📋</span> {isEn ? "Copy" : "انقر للنسخ"}
          </>
        )}
      </span>
      <span className="min-w-0 flex-1 truncate font-mono font-bold tracking-wider text-white text-sm" dir="ltr">
        {value}
      </span>
      {label && <span className="shrink-0 text-xs text-neutral-400 font-semibold">{label}</span>}
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
        body: JSON.stringify({ email, name, phone, instapayName, courseSlug, method, proofChannel, withOrderBump }),
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
        className="min-h-screen bg-[#070d0c] text-neutral-100 px-4 py-10 transition-colors flex items-center justify-center relative overflow-hidden font-sans"
      >
        {/* Ambient Glow */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 mx-auto max-w-md w-full">
          <div className="rounded-3xl border-2 border-emerald-500/40 bg-[#0d1614]/95 p-7 text-center shadow-2xl shadow-emerald-500/20 backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-3xl shadow-lg shadow-emerald-500/20 animate-pulse">
              🎉
            </div>
            <h1 className="mb-2 text-2xl font-black text-white">
              {isEn ? "Order Registered Successfully!" : "سجّلنا طلبك بنجاح!"}
            </h1>
            <p className="mb-5 text-xs sm:text-sm leading-relaxed text-neutral-300">
              {isEn ? (
                <>
                  One final quick step: transfer <b className="text-emerald-400 font-mono">{totalPrice} EGP</b> and send us the payment screenshot. We will activate your account within {payment.activationHours} hours.
                </>
              ) : (
                <>
                  خطوة واحدة فقط باقية: حوّل <b className="text-emerald-400 font-mono">{totalPrice} ج.م</b> وأرسل لنا صورة التحويل، وسنفعّل حسابك فورًا خلال {payment.activationHours} ساعة.
                </>
              )}
            </p>

            <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-start">
              <p className="mb-2 text-xs font-bold text-neutral-400">
                {isEn ? "When sending confirmation, include:" : "عند إرسال الإثبات، اكتب معه:"}
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-200">
                <li>• {isEn ? "Email:" : "الإيميل:"} <b dir="ltr" className="text-emerald-300">{email}</b></li>
                <li>• {isEn ? "Starting Track:" : "المسار الأولي:"} <b className="text-white">{selectedTitle}</b></li>
                <li>• {isEn ? "Amount:" : "المبلغ:"} <b className="font-mono text-emerald-400">{totalPrice} {isEn ? "EGP" : "ج.م"} {withOrderBump ? (isEn ? "(Includes VIP Prompts & Contracts)" : "(شامل حزمة البرومبتات والعقود VIP)") : ""}</b></li>
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
              className="mb-3 block w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 py-4 font-black text-neutral-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {proofChannel === "whatsapp"
                ? isEn ? "Send Screenshot on WhatsApp →" : "ابعت الإثبات على واتساب الآن ←"
                : isEn ? "Send Screenshot via Email →" : "ابعت الإثبات بالإيميل الآن ←"}
            </a>
            <button
              onClick={() => router.push(`/login?email=${encodeURIComponent(email)}`)}
              className="w-full rounded-full border border-white/15 py-3 text-xs sm:text-sm font-bold text-neutral-300 hover:bg-white/5 transition-colors"
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
      className="min-h-screen bg-[#070d0c] text-neutral-100 px-4 py-8 transition-colors relative overflow-hidden font-sans"
    >
      {/* Ambient Cyberpunk Glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 blur-3xl rounded-full" />
        <div className="absolute bottom-10 -right-28 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-md">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <LogoLink size={30} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Price Summary Banner */}
        <div className="mb-5 overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-[#0c1815] via-[#0d1614] to-[#12241f] p-5 sm:p-6 text-white shadow-xl shadow-emerald-500/15 relative">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/15 blur-2xl" />

          {/* Top Row: Founding Cohort Tag + Sleek Discount Chip */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-300">
              <span className="text-sm">👑</span>
              <span>{isEn ? "Founding Cohort · 1-Year Access" : "فوج التأسيس الأول · وصول سنوي"}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 px-3 py-1 text-xs font-black text-amber-300 whitespace-nowrap shrink-0 shadow-2xs">
              <span className="text-[11px] animate-pulse">⚡</span>
              <span>{isEn ? "71% OFF" : "خصم 71%"}</span>
            </span>
          </div>

          {/* Price Numbers & Savings Row */}
          <div className="flex flex-wrap items-baseline gap-2.5 my-2">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-sm" dir="ltr">
                {totalPrice}
              </span>
              <span className="text-sm sm:text-base font-black text-emerald-400">{isEn ? "EGP" : "ج.م"}</span>
            </div>

            <span className="text-sm sm:text-base text-neutral-500 line-through font-mono">
              {pricing.originalPriceEgp} {isEn ? "EGP" : "ج.م"}
            </span>

            <span className={`text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-0.5 ${isEn ? "ml-auto" : "mr-auto"}`}>
              {isEn ? "All 100 Tracks Unlocked" : "١٠٠ مسار كاملة"}
            </span>
          </div>

          {/* Urgency Counter with Pulse Beacon */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
            <p className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[11px] sm:text-xs">
                {isEn ? (
                  <>Only <b className="text-white font-mono">{pricing.cohortSeatsRemaining} seats</b> remaining at this launch price</>
                ) : (
                  <>متبقٍ <b className="text-white font-mono">{pricing.cohortSeatsRemaining} مقعدًا فقط</b> بهذا السعر المخفض</>
                )}
              </span>
            </p>

            <span className="text-[10px] text-neutral-400 hidden sm:inline">
              {isEn ? "Guaranteed rate" : "يضمن لك السعر"}
            </span>
          </div>
        </div>

        {/* Order Bump */}
        <div
          onClick={() => setWithOrderBump(!withOrderBump)}
          className={`mb-4 cursor-pointer rounded-2xl border-2 p-4 transition-all ${
            withOrderBump
              ? "border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/20"
              : "border-dashed border-amber-400/40 bg-amber-500/5 hover:border-amber-400"
          }`}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={withOrderBump}
              onChange={(e) => setWithOrderBump(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className="mt-1 h-5 w-5 rounded border-neutral-600 bg-neutral-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
            <div className="flex-1 text-start">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-amber-400 text-neutral-950 px-2 py-0.5 text-[10px] font-black">
                  ⚡ {isEn ? "Exclusive VIP Upgrade (Order Bump)" : "ترقية حصرية مضافة لطلبك"}
                </span>
                <span className="text-xs font-black text-amber-300 font-mono">
                  +{pricing.orderBumpPriceEgp} {isEn ? "EGP only" : "ج.م فقط"}
                </span>
                <span className="text-[10px] text-neutral-400 line-through font-mono">
                  450 {isEn ? "EGP" : "ج.م"}
                </span>
              </div>
              <p className="mt-1 text-xs font-bold text-white leading-snug">
                {isEn
                  ? "Secret 1,000+ Corporate AI Prompts Bank + Verified Freelance Legal Contracts"
                  : pricing.orderBumpTitle}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-300">
                {isEn
                  ? "A tested vault of 1,000+ high-precision AI prompts for marketing, sales, and software + battle-tested bilingual freelance contracts protecting your fees legally."
                  : "بنك مكوّن من +1,000 أمر ذكاء اصطناعي احترافي عالي الدقة تم اختباره للبيزنس والمبيعات والبرمجة + صِيغ عقود عمل حر تحمي أتعابك قانونيًا."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Step 1: Track Choice */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 shadow-xs">
            <label className="mb-1 block text-xs font-bold text-neutral-300">
              {isEn ? "1. Which track would you like to start with?" : "١. تحب تبدأ بأنهي مسار؟"}
            </label>
            <p className="mb-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs leading-relaxed text-emerald-300">
              {isEn
                ? "✓ Your membership unlocks ALL 100 tracks for a full year — this simply sets your customized starting point."
                : "✓ اشتراكك يفتح كل الـ ١٠٠ مسار لمدة سنة كاملة — هذا فقط لتحديد نقطة انطلاقك الأولى."}
            </p>
            <div className="space-y-2">
              {courses.slice(0, 5).map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCourseSlug(c.slug)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start transition-all ${
                    courseSlug === c.slug
                      ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                      : "border-white/5 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <span className="text-xl">{c.icon}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs sm:text-sm font-bold text-white">
                      {isEn ? (c.titleEn || c.title) : c.title}
                    </span>
                    <span className="block text-[10px] text-neutral-400">
                      {isEn ? (c.categoryEn || c.category) : c.category}
                    </span>
                  </span>
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                      courseSlug === c.slug ? "border-emerald-400 bg-emerald-400" : "border-neutral-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Contact Details */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 shadow-xs">
            <label className="mb-2 block text-xs font-bold text-neutral-300">
              {isEn ? "2. Your Information" : "٢. بياناتك"}
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? "Full name" : "اسمك بالكامل"}
              className="mb-2 w-full rounded-2xl border border-white/15 bg-neutral-950 px-3.5 py-3 text-xs sm:text-sm text-white transition-colors focus:border-emerald-400 focus:outline-hidden"
            />
            <input
              required
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mb-2 w-full rounded-2xl border border-white/15 bg-neutral-950 px-3.5 py-3 text-xs sm:text-sm text-white transition-colors focus:border-emerald-400 focus:outline-hidden"
            />
            <input
              required
              type="tel"
              inputMode="numeric"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))}
              placeholder="01xxxxxxxxx"
              className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-3.5 py-3 text-xs sm:text-sm text-white transition-colors focus:border-emerald-400 focus:outline-hidden"
            />
            <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">
              {isEn
                ? "Enter the phone/wallet number you will transfer from so we can confirm quickly. Your account will be activated on this email."
                : "اكتب رقم المحفظة التي ستحوّل منها لتسهيل المطابقة السريعة. سنفعّل اشتراكك على هذا البريد الإلكتروني."}
            </p>
          </div>

          {/* Step 3: Payment Method */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 shadow-xs">
            <label className="mb-2 block text-xs font-bold text-neutral-300">
              {isEn ? "3. Transfer Amount" : "٣. حوّل المبلغ"}
            </label>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  method === "vodafone_cash"
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5"
                }`}
              >
                <div className="mb-1 text-2xl">📱</div>
                <div className="text-xs font-bold text-white">
                  {isEn ? "Vodafone Cash" : "فودافون كاش"}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  method === "instapay"
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5"
                }`}
              >
                <div className="mb-1 text-2xl">⚡</div>
                <div className="text-xs font-bold text-white">
                  {isEn ? "InstaPay" : "إنستاباي"}
                </div>
              </button>
            </div>

            <p className="mb-2 text-xs text-neutral-300">
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
                <label className="mb-1.5 block text-xs font-bold text-amber-300">
                  {isEn ? "Name displayed on your InstaPay account" : "الاسم الظاهر على حسابك في إنستاباي"}
                </label>
                <input
                  required
                  value={instapayName}
                  onChange={(e) => setInstapayName(e.target.value)}
                  placeholder={isEn ? "Full account name as shown in app" : "الاسم بالكامل زي ما هو في البنك"}
                  className="w-full rounded-xl border border-amber-500/30 bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm text-white transition-colors focus:border-emerald-400 focus:outline-hidden"
                />
                <p className="mt-1.5 text-[11px] leading-relaxed text-amber-200/90">
                  {isEn
                    ? "InstaPay receipts display sender name rather than phone number, so exact name ensures rapid confirmation."
                    : "إشعار إنستاباي يصلنا بالاسم وليس برقم الهاتف، لذلك نطلب الاسم لتأكيد التحويل مباشرة."}
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Proof Channel */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 shadow-xs">
            <label className="mb-2 block text-xs font-bold text-neutral-300">
              {isEn ? "4. Where will you send your payment receipt?" : "٤. أين ترغب بإرسال صورة التحويل؟"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProofChannel("whatsapp")}
                className={`rounded-2xl border-2 p-3 text-center transition-all ${
                  proofChannel === "whatsapp"
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5"
                }`}
              >
                <div className="mb-1 text-xl">💬</div>
                <div className="text-xs font-bold text-white">
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
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5"
                }`}
              >
                <div className="mb-1 text-xl">✉️</div>
                <div className="text-xs font-bold text-white">
                  {isEn ? "Email" : "إيميل"}
                </div>
                <div className="truncate text-[10px] text-neutral-400 font-mono" dir="ltr">
                  {payment.supportEmail}
                </div>
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-2xl bg-red-950/40 border border-red-500/40 px-4 py-2.5 text-xs text-red-300">
              {error}
            </p>
          )}

          {/* ⭐ Accredited Certificate Trust Badge ⭐ */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-start flex items-center gap-3">
            <span className="text-2xl shrink-0">🎓</span>
            <div>
              <p className="text-xs font-black text-amber-300">
                {isEn ? "Verified QR Certificates Included for All 100 Tracks" : "شهادات إتمام معتمدة بكود QR لكافة الـ 100 مسار مشمولة مجاناً"}
              </p>
              <p className="text-[11px] text-neutral-300 mt-0.5">
                {isEn
                  ? "Earn verifiable digital credentials with 1-click LinkedIn integration as you complete courses."
                  : "تحصل على شهادات موثقة برابط دائم وكود QR تُضاف بضغطة زر واحدة لحسابك على لينكد إن وسيرتك الذاتية."}
              </p>
            </div>
          </div>

          {/* ⭐ 48-Hour Money-Back Guarantee Badge ⭐ */}
          <div className="rounded-2xl border-2 border-emerald-400/50 bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-neutral-900 p-4 shadow-xl shadow-emerald-500/15 text-start flex items-start gap-3">
            <span className="text-3xl shrink-0">🛡️</span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-300 mb-1">
                {isEn ? "48-Hour 100% Money-Back Guarantee" : "ضمان استرجاع كامل 100% خلال 48 ساعة بدون أي أسئلة"}
              </h4>
              <p className="text-[11px] sm:text-xs leading-relaxed text-neutral-200">
                {isEn
                  ? "Explore all 100 tracks and start learning immediately. If you are not 100% satisfied for any reason within 48 hours, message us and receive a prompt, full refund."
                  : "جرّب المنصة وتصفّح الـ ١٠٠ مسار وابدأ التعلم الآن.. إن لم تجدها تصنع فارقاً حقيقياً في مهاراتك خلال 48 ساعة، راسلنا واسترد كامل المبلغ فوراً وبدون أي شروط."}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 py-4 font-black text-neutral-950 shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition-all disabled:opacity-60 text-sm sm:text-base"
          >
            {loading
              ? isEn ? "Registering Order..." : "جاري التسجيل..."
              : isEn ? `Submit Order for ${totalPrice} EGP →` : `سجّل طلبي بـ ${totalPrice} ج.م فقط ←`}
          </button>

          <p className="pb-4 text-center text-xs leading-relaxed text-neutral-400">
            {isEn
              ? `After sending proof, your account is activated within ${payment.activationHours} hours on your registered email.`
              : `بعد إرسال الإثبات، سنفعّل حسابك خلال ${payment.activationHours} ساعة على بريدك الإلكتروني.`}
          </p>
        </form>
      </div>
    </div>
  );
}
