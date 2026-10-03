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

function CopyField({
  value,
  label,
  method,
}: {
  value: string;
  label?: string;
  method?: "vodafone_cash" | "instapay";
}) {
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

  const isPhone = /^01\d{9}$/.test(value);
  const displayValue = isPhone
    ? `${value.slice(0, 4)} ${value.slice(4, 7)} ${value.slice(7)}`
    : value;

  return (
    <div
      onClick={copy}
      role="button"
      tabIndex={0}
      className={`w-full cursor-pointer flex items-center justify-between gap-3 rounded-2xl border px-3.5 sm:px-4 py-3 text-start transition-all duration-200 active:scale-98 select-none ${
        copied
          ? "border-emerald-400 bg-emerald-500/20 shadow-md shadow-emerald-500/15"
          : "border-white/10 bg-black/40 hover:border-emerald-500/50 hover:bg-[#12211d]"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-sm shrink-0">
          {method === "instapay" ? "⚡" : "📱"}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-mono font-black tracking-wider text-white text-sm sm:text-base"
              dir="ltr"
            >
              {displayValue}
            </span>
            {label && (
              <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-md font-sans">
                {label}
              </span>
            )}
          </div>
          <span className="block text-[10px] text-neutral-400 truncate">
            {isEn ? "Tap to copy" : "انقر للنسخ المباشر"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          copy();
        }}
        className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${
          copied
            ? "bg-emerald-500 text-neutral-950 shadow-xs shadow-emerald-500/30 font-black"
            : "bg-white/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 border border-emerald-500/20"
        }`}
      >
        {copied ? (
          <>
            <span aria-hidden>✓</span>
            <span>{isEn ? "Copied" : "تم النسخ"}</span>
          </>
        ) : (
          <>
            <span aria-hidden>📋</span>
            <span>{isEn ? "Copy" : "نسخ"}</span>
          </>
        )}
      </button>
    </div>
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
                <li>• {isEn ? "Amount:" : "المبلغ:"} <b className="font-mono text-emerald-400">{totalPrice} {isEn ? "EGP" : "ج.م"} {withOrderBump ? (isEn ? "(Includes 10,000 Prompts Database & Legal Contracts VIP)" : "(شامل قاعدة بيانات الـ 10,000 برومبت وعقود الفريلانس VIP)") : ""}</b></li>
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

      <div className="relative z-10 mx-auto max-w-xl w-full px-1 sm:px-0">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <LogoLink size={30} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* Price Summary Banner */}
        <div className="mb-5 overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-[#0c1815] via-[#0d1614] to-[#12241f] p-4 sm:p-6 text-white shadow-xl shadow-emerald-500/15 relative">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/15 blur-2xl" />

          {/* Top Row: Founding Cohort Tag + High-Contrast Radiant Discount Chip */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-300">
              <span className="text-base">👑</span>
              <span>{isEn ? "Founding Cohort · 1-Year Access" : "فوج التأسيس الأول · وصول سنوي شامل"}</span>
            </span>

            {/* High-Contrast, Radiant 71% Discount Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 px-3.5 py-1 text-xs font-black text-white shadow-md shadow-rose-500/30 border border-white/30 whitespace-nowrap shrink-0">
              <span className="text-[11px] text-yellow-200 animate-pulse">⚡</span>
              <span className="tracking-wide">{isEn ? "71% OFF" : "خصم 71%"}</span>
            </span>
          </div>

          {/* Hero Symmetrical Price & Value Showcase */}
          <div className="my-3 rounded-2xl bg-black/40 border border-white/10 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-baseline gap-2.5">
              <div className="flex items-baseline gap-1.5" dir="ltr">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white drop-shadow-sm">
                  {totalPrice}
                </span>
                <span className="text-base sm:text-lg font-black text-emerald-400">
                  {isEn ? "EGP" : "ج.م"}
                </span>
              </div>

              <span className="text-sm sm:text-base text-neutral-400 line-through font-mono">
                {pricing.originalPriceEgp} {isEn ? "EGP" : "ج.م"}
              </span>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t border-white/5 pt-2.5 sm:border-0 sm:pt-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1">
                <span>🔓</span>
                <span>{isEn ? "All 100 Tracks Unlocked" : "١٠٠ مسار كاملة"}</span>
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {isEn ? "365 Days" : "٣٦٥ يومًا"}
              </span>
            </div>
          </div>

          {/* Urgency Counter with Pulse Beacon & Symmetrical Guarantee */}
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-300">
            <p className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] sm:text-xs">
                {isEn ? (
                  <>1-Year All-Access Pass · All 100 tracks & updates included</>
                ) : (
                  <>عضوية الوصول الشامل لمدة سنة · تشمل كافة المسارات والتحديثات</>
                )}
              </span>
            </p>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
              <span>🛡️</span>
              <span>{isEn ? "7-Day Money-Back Guarantee" : "ضمان استرجاع 100% خلال 7 أيام"}</span>
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
            <div className="pt-0.5">
              <input
                type="checkbox"
                checked={withOrderBump}
                onChange={(e) => setWithOrderBump(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                className="h-5 w-5 rounded border-neutral-600 bg-neutral-900 text-amber-500 focus:ring-amber-500 cursor-pointer"
              />
            </div>
            <div className="flex-1 text-start">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="rounded-md bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 px-2.5 py-0.5 text-[11px] font-black shadow-xs">
                    ⚡ {isEn ? "VIP Vault Upgrade (Save 80%)" : "ترقية حصرية مضافة لطلبك (وفر ٨٠٪)"}
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                    🔥 {isEn ? "92% of members choose this" : "يختاره ٩٢٪ من المشتركين"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xs font-black text-amber-300">
                    +{pricing.orderBumpPriceEgp} {isEn ? "EGP only" : "ج.م فقط"}
                  </span>
                  <span className="text-[10px] text-neutral-400 line-through">
                    950 {isEn ? "EGP" : "ج.م"}
                  </span>
                </div>
              </div>
              <p className="mt-1.5 text-xs sm:text-sm font-black text-white leading-snug">
                {isEn
                  ? "Executive 10,000 Corporate Prompts Database (100 Domains × 100 Prompts) + Freelance Legal Contracts Pack"
                  : pricing.orderBumpTitle}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-neutral-300">
                {isEn
                  ? "An authentic indexed database of 10,000 executive AI prompts covering 100 corporate domains + 5 verified bilingual freelance legal contracts safeguarding your fees and stopping revisions scope creep."
                  : "قاعدة بيانات مفهرسة تضم 10,000 أمر ذكاء اصطناعي عملي موزعة على 100 مجال تخصصي للشركات + 5 صِيغ عقود عمل حر ثنائية اللغة تحمي أتعابك قانونيًا وتمنع المماطلة تمامًا."}
              </p>
              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] sm:text-[11px] text-amber-200/90 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>{isEn ? "10,000 Prompts across 100 Corporate Domains" : "١٠,٠٠٠ برومبت مقسمة على ١٠٠ مجال شركات"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>{isEn ? "5 Ironclad Bilingual Legal Contracts" : "٥ عقود فريلانس قانونية ملزمة (عربي/إنجليزي)"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>{isEn ? "One-click copy & instant .txt download" : "نسخ مباشر وتحميل فوري بضغطة زر"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400">✓</span>
                  <span>{isEn ? "Permanent download & account updates" : "تحميل دائم وتحديثات مستمرة في حسابك"}</span>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black">
                <span>📥</span>
                <span>{isEn ? "Download button unlocks immediately in your dashboard upon activation" : "زر التحميل الكامل يفتح مباشرة في لوحة تحكمك فور التفعيل"}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* Step 1: Track Choice */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs sm:text-sm font-black text-white">
                {isEn ? "1. Which track would you like to start with?" : "١. تحب تبدأ بأنهي مسار؟"}
              </label>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {isEn ? "100 Tracks Included" : "١٠٠ مسار مشمولة"}
              </span>
            </div>
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
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start transition-all cursor-pointer ${
                    courseSlug === c.slug
                      ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                      : "border-white/5 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <span className="text-xl shrink-0">{c.icon}</span>
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

          {/* Step 2: Contact Details & Symmetrical Egyptian Phone Input */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-black text-white">
                {isEn ? "2. Your Account & Activation Details" : "٢. بيانات الحساب والتفعيل الفوري"}
              </label>
              <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                {isEn ? "Required" : "مطلوب لتفعيل حسابك"}
              </span>
            </div>

            {/* Name Input */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-neutral-300">
                {isEn ? "Full Name" : "الاسم بالكامل"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-sm text-neutral-400">
                  👤
                </span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isEn ? "Your full name" : "اسمك الثلاثي كما يظهر في التحويل"}
                  className="w-full rounded-2xl border border-white/15 bg-neutral-950 ps-10 pe-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-emerald-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-neutral-300">
                {isEn ? "Email Address (Login Access)" : "البريد الإلكتروني (لتسجيل الدخول الفوري)"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-sm text-neutral-400">
                  ✉️
                </span>
                <input
                  required
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full rounded-2xl border border-white/15 bg-neutral-950 ps-10 pe-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-emerald-400 focus:outline-hidden text-start"
                />
              </div>
            </div>

            {/* Symmetrical Phone Input with Egyptian Telecom Format */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-neutral-300">
                  {isEn ? "Transfer Wallet / Phone Number" : "رقم هاتف المحفظة التي ستحوّل منها"}
                </label>
                {phone && (
                  <span
                    className={`text-[11px] font-bold ${
                      phone.length === 11 && /^01[0125]/.test(phone)
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  >
                    {phone.length === 11 && /^01[0125]/.test(phone)
                      ? isEn ? "✓ Valid Number" : "✓ رقم هاتف صحيح ومطابق"
                      : `${phone.length}/11`}
                  </span>
                )}
              </div>

              {/* Compound Phone Input */}
              <div
                dir="ltr"
                className="flex items-stretch rounded-2xl border border-white/15 bg-neutral-950 overflow-hidden focus-within:border-emerald-400 transition-colors"
              >
                {/* Egyptian Prefix Tile */}
                <div className="flex items-center gap-1.5 bg-white/5 border-r border-white/10 px-3 py-3 text-xs font-bold text-neutral-200 select-none shrink-0">
                  <span className="text-base leading-none">🇪🇬</span>
                  <span className="font-mono text-neutral-300">+20</span>
                </div>

                {/* Phone Digits Input */}
                <input
                  required
                  type="tel"
                  inputMode="numeric"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))}
                  placeholder="01X XXXX XXXX"
                  className="w-full bg-transparent px-3.5 py-3 text-xs sm:text-sm font-mono tracking-wider text-white placeholder:text-neutral-500 placeholder:tracking-normal focus:outline-hidden"
                />

                {/* Live Checkmark Indicator */}
                {phone.length === 11 && /^01[0125]/.test(phone) && (
                  <div className="flex items-center pe-3 text-emerald-400 text-sm select-none">
                    ✓
                  </div>
                )}
              </div>

              {/* Automated Sync Explainer */}
              <div className="mt-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[11px] leading-relaxed text-emerald-300 flex items-start gap-2">
                <span className="text-sm shrink-0">⚡</span>
                <span>
                  {isEn
                    ? "Instant automated activation: Our platform matches your wallet transfer number automatically to activate your account upon receiving payment without delay."
                    : "ربط وتفعيل تلقائي فوري: يقوم نظام المنصة بمطابقة رقم محفظتك مع إشعار التحويل لتفعيل حسابك فور استلام المبلغ تلقائياً دون أي تأخير."}
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Payment Method & Transfer Numbers */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs sm:text-sm font-black text-white">
                {isEn ? "3. Choose Payment Method & Transfer" : "٣. اختر طريقة الدفع وحوّل المبلغ"}
              </label>
              <span className="text-xs font-mono font-black text-emerald-400">
                {totalPrice} {isEn ? "EGP" : "ج.م"}
              </span>
            </div>

            <div className="mb-3.5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`rounded-2xl border-2 p-3 sm:p-3.5 text-center transition-all cursor-pointer ${
                  method === "vodafone_cash"
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="mb-1 text-2xl">📱</div>
                <div className="text-xs sm:text-sm font-black text-white">
                  {isEn ? "Vodafone Cash" : "فودافون كاش"}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {isEn ? "All Egyptian Wallets" : "كافة المحافظ الإلكترونية"}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`rounded-2xl border-2 p-3 sm:p-3.5 text-center transition-all cursor-pointer ${
                  method === "instapay"
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="mb-1 text-2xl">⚡</div>
                <div className="text-xs sm:text-sm font-black text-white">
                  {isEn ? "InstaPay" : "إنستاباي"}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">
                  {isEn ? "Bank to Bank / IPA" : "حساب بنكي / بطاقة ميزة"}
                </div>
              </button>
            </div>

            <p className="mb-2.5 text-xs font-bold text-neutral-300">
              {method === "vodafone_cash"
                ? isEn
                  ? `Transfer exact amount (${totalPrice} EGP) to any of these numbers:`
                  : `حوّل المبلغ المطلوب (${totalPrice} ج.م) لأي رقم من أرقام فودافون كاش التالية:`
                : isEn
                ? `Transfer exact amount (${totalPrice} EGP) to:`
                : `حوّل المبلغ المطلوب (${totalPrice} ج.م) لحساب إنستاباي التالي:`}
            </p>

            <div className="space-y-2">
              {(method === "vodafone_cash" ? payment.vodafoneCash : payment.instapay).map((v) => (
                <CopyField
                  key={v}
                  value={v}
                  method={method}
                  label={
                    method === "vodafone_cash"
                      ? (isEn ? "Vodafone Cash" : "فودافون كاش")
                      : (v.includes("@") ? (isEn ? "InstaPay Handle" : "عنوان إنستاباي") : (isEn ? "InstaPay Mobile" : "رقم هاتف إنستاباي"))
                  }
                />
              ))}
            </div>

            {method === "instapay" && (
              <div className="mt-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <label className="mb-1.5 block text-xs font-bold text-amber-300">
                  {isEn ? "Name displayed on your InstaPay account" : "الاسم الظاهر على حسابك في إنستاباي"}
                </label>
                <input
                  required
                  value={instapayName}
                  onChange={(e) => setInstapayName(e.target.value)}
                  placeholder={isEn ? "Full account name as shown in app" : "الاسم بالكامل كما يظهر في تطبيق إنستاباي"}
                  className="w-full rounded-xl border border-amber-500/30 bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm text-white transition-colors focus:border-emerald-400 focus:outline-hidden"
                />
                <p className="mt-1.5 text-[11px] leading-relaxed text-amber-200/90">
                  {isEn
                    ? "InstaPay notifications display sender name, so your exact name ensures instant automatic matching."
                    : "إشعار إنستاباي يصلنا بالاسم، لذا كتابة الاسم بدقة تضمن ربط وتفعيل حسابك تلقائياً."}
                </p>
              </div>
            )}
          </div>

          {/* Step 4: Proof Channel */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs">
            <label className="mb-2 block text-xs sm:text-sm font-black text-white">
              {isEn ? "4. Where will you send your payment receipt?" : "٤. أين ترغب بإرسال صورة التحويل؟"}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setProofChannel("whatsapp")}
                className={`rounded-2xl border-2 p-3 text-center transition-all cursor-pointer ${
                  proofChannel === "whatsapp"
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="mb-1 text-xl">💬</div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {isEn ? "WhatsApp" : "واتساب"}
                </div>
                <div className="text-[10px] text-neutral-400 font-mono mt-0.5" dir="ltr">
                  +{payment.supportWhatsapp}
                </div>
              </button>
              <button
                type="button"
                onClick={() => setProofChannel("email")}
                className={`rounded-2xl border-2 p-3 text-center transition-all cursor-pointer ${
                  proofChannel === "email"
                    ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 hover:border-white/20"
                }`}
              >
                <div className="mb-1 text-xl">✉️</div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {isEn ? "Email" : "إيميل"}
                </div>
                <div className="truncate text-[10px] text-neutral-400 font-mono mt-0.5" dir="ltr">
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
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 sm:p-4 text-start flex items-center gap-3">
            <span className="text-2xl sm:text-3xl shrink-0">🎓</span>
            <div>
              <p className="text-xs sm:text-sm font-black text-amber-300">
                {isEn ? "Verified QR Certificates Included for All 100 Tracks" : "شهادات إتمام معتمدة بكود QR لكافة الـ 100 مسار مشمولة مجاناً"}
              </p>
              <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                {isEn
                  ? "Earn verifiable digital credentials with 1-click LinkedIn integration as you complete courses."
                  : "تحصل على شهادات موثقة برابط دائم وكود QR تُضاف بضغطة زر واحدة لحسابك على لينكد إن وسيرتك الذاتية."}
              </p>
            </div>
          </div>

          {/* ⭐ 7-Day Money-Back Guarantee Badge ⭐ */}
          <div className="rounded-2xl border-2 border-emerald-400/50 bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-neutral-900 p-4 sm:p-5 shadow-xl shadow-emerald-500/15 text-start flex items-start gap-3">
            <span className="text-3xl shrink-0">🛡️</span>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-emerald-300 mb-1">
                {isEn ? "7-Day 100% Money-Back Guarantee" : "ضمان استرجاع كامل 100% خلال 7 أيام بدون أي أسئلة"}
              </h4>
              <p className="text-[11px] sm:text-xs leading-relaxed text-neutral-200">
                {isEn
                  ? "Explore all 100 tracks and start learning immediately. If you are not 100% satisfied for any reason within 7 days, message us and receive a prompt, full refund."
                  : "جرّب المنصة وتصفّح الـ ١٠٠ مسار وابدأ التعلم الآن.. إن لم تجدها تصنع فارقاً حقيقياً في مهاراتك خلال 7 أيام، راسلنا واسترد كامل المبلغ فوراً وبدون أي شروط."}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl sm:rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 py-4 font-black text-neutral-950 shadow-xl shadow-emerald-500/30 hover:brightness-110 active:scale-98 transition-all disabled:opacity-60 text-sm sm:text-base cursor-pointer"
          >
            {loading
              ? isEn ? "Registering Order..." : "جاري تسجيل طلبك..."
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
