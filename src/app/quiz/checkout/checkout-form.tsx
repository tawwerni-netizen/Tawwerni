"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { brand, pricing, payment } from "@/content/brand";
import type { PaymentConfig } from "@/lib/payment-config";
import { trackInitiateCheckout } from "@/lib/analytics";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";

export type CourseOption = {
  slug: string;
  title: string;
  titleEn?: string;
  icon: string;
  category: string;
  categoryEn?: string;
};

export type CareerPathOption = {
  slug: string;
  title: string;
  titleEn?: string;
  icon: string;
  targetRoleAr: string;
  targetRoleEn?: string;
  tracksCount: number;
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

export default function CheckoutForm({
  courses,
  careerPaths = [],
  initialPaymentConfig,
}: {
  courses: CourseOption[];
  careerPaths?: CareerPathOption[];
  initialPaymentConfig?: PaymentConfig;
}) {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(
    initialPaymentConfig ?? {
      vodafoneCash: [...payment.vodafoneCash],
      instapay: [...payment.instapay],
      supportWhatsapp: payment.supportWhatsapp,
      supportEmail: payment.supportEmail,
      activationHours: payment.activationHours,
    }
  );

  const [ready, setReady] = useState(false);
  const [productType, setProductType] = useState<"track" | "career_path" | "all_access">("career_path");
  const [selectedTrackSlug, setSelectedTrackSlug] = useState(courses[0]?.slug ?? "");
  const [selectedCareerPathSlug, setSelectedCareerPathSlug] = useState(careerPaths[0]?.slug ?? "");
  const [searchFilter, setSearchFilter] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instapayName, setInstapayName] = useState("");
  const [method, setMethod] = useState<Method>("vodafone_cash");
  const [proofChannel, setProofChannel] = useState<Channel>("whatsapp");
  const [withOrderBump, setWithOrderBump] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Price calculation
  const basePrice =
    productType === "all_access"
      ? pricing.allAccessPriceEgp // 399 EGP
      : productType === "career_path"
      ? pricing.careerPathPriceEgp // 149 EGP
      : pricing.trackPriceEgp; // 59 EGP

  const totalPrice = basePrice + (withOrderBump ? pricing.orderBumpPriceEgp : 0);

  useEffect(() => {
    // Dynamically retrieve active payment receiving accounts
    fetch("/api/payment-config")
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && data.config) {
          setPaymentConfig(data.config);
        }
      })
      .catch(() => {});

    // Check URL parameters for pre-selected product
    try {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get("type");
      const slugParam = params.get("slug");

      if (typeParam === "all_access" || slugParam === "all_access" || slugParam === "all-access") {
        setProductType("all_access");
      } else if (typeParam === "track" && slugParam) {
        setProductType("track");
        setSelectedTrackSlug(slugParam);
      } else if (typeParam === "career_path" && slugParam) {
        setProductType("career_path");
        setSelectedCareerPathSlug(slugParam);
      } else if (slugParam) {
        // Find if slug belongs to career path or track
        const isPath = careerPaths.some((cp) => cp.slug === slugParam);
        if (isPath) {
          setProductType("career_path");
          setSelectedCareerPathSlug(slugParam);
        } else {
          setProductType("track");
          setSelectedTrackSlug(slugParam);
        }
      }
    } catch {}

    const raw = sessionStorage.getItem("tawwerni_checkout");
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.email) setEmail(data.email);
        if (data.name) setName(data.name);
        if (data.productType) setProductType(data.productType);
        if (data.productSlug) {
          if (data.productType === "career_path") setSelectedCareerPathSlug(data.productSlug);
          else if (data.productType === "track") setSelectedTrackSlug(data.productSlug);
        } else if (data.courseSlug) {
          setSelectedTrackSlug(data.courseSlug);
        }
      } catch {}
    }
    setReady(true);
    trackInitiateCheckout(basePrice);
  }, [careerPaths, basePrice]);

  const selectedTrack = courses.find((c) => c.slug === selectedTrackSlug) || courses[0];
  const selectedCareerPath =
    careerPaths.find((cp) => cp.slug === selectedCareerPathSlug) || careerPaths[0];

  const currentTitle =
    productType === "all_access"
      ? isEn
        ? "All-Access Pass (All 100 Tracks & Career Paths)"
        : "الوصول الشامل لكافة الـ 100 كورس والمسارات المهنية"
      : productType === "career_path"
      ? isEn
        ? selectedCareerPath?.titleEn || selectedCareerPath?.title
        : selectedCareerPath?.title
      : isEn
      ? selectedTrack?.titleEn || selectedTrack?.title
      : selectedTrack?.title;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!/^01\d{9}$/.test(phone)) {
      setError(
        isEn
          ? "Mobile number must be 11 digits starting with 01"
          : "رقم الموبايل يجب أن يكون ١١ رقمًا ويبدأ بـ 01"
      );
      return;
    }
    if (method === "instapay" && instapayName.trim().length < 3) {
      setError(
        isEn
          ? "Please enter your name as displayed on your InstaPay account"
          : "اكتب اسمك كما هو مسجل في حساب إنستاباي"
      );
      return;
    }

    setLoading(true);

    const activeSlug =
      productType === "all_access"
        ? "all_access"
        : productType === "career_path"
        ? selectedCareerPathSlug
        : selectedTrackSlug;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          phone,
          instapayName,
          productType,
          productSlug: activeSlug,
          courseSlug: activeSlug,
          method,
          proofChannel,
          withOrderBump,
        }),
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
              ? `Server error (${res.status}). Please try again, or WhatsApp us at +${paymentConfig.supportWhatsapp}.`
              : `حصل خطأ في السيرفر (${res.status}). جرّب تاني، ولو فضلت المشكلة كلمنا على واتساب ${paymentConfig.supportWhatsapp}.`)
        );
        return;
      }

      sessionStorage.removeItem("tawwerni_checkout");
      setDone(true);
    } catch {
      setError(
        isEn
          ? "No internet connection. Please verify your connection."
          : "مفيش اتصال بالإنترنت. اتأكد من الشبكة وجرّب تاني."
      );
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
                  One final quick step: transfer{" "}
                  <b className="text-emerald-400 font-mono">{totalPrice} EGP</b> and send us the
                  payment screenshot. We will activate your account within {paymentConfig.activationHours} hours.
                </>
              ) : (
                <>
                  خطوة واحدة فقط باقية: حوّل{" "}
                  <b className="text-emerald-400 font-mono">{totalPrice} ج.م</b> وأرسل لنا صورة
                  التحويل، وسنفعّل حسابك فورًا خلال {paymentConfig.activationHours} ساعة.
                </>
              )}
            </p>

            <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-start">
              <p className="mb-2 text-xs font-bold text-neutral-400">
                {isEn ? "When sending confirmation, include:" : "عند إرسال الإثبات، اكتب معه:"}
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-200">
                <li>
                  • {isEn ? "Email:" : "الإيميل:"}{" "}
                  <b dir="ltr" className="text-emerald-300">
                    {email}
                  </b>
                </li>
                <li>
                  • {productType === "career_path" ? (isEn ? "Career Path:" : "المسار المهني:") : (isEn ? "Track:" : "المسار:")}{" "}
                  <b className="text-white">{currentTitle}</b>
                </li>
                <li>
                  • {isEn ? "Amount:" : "المبلغ:"}{" "}
                  <b className="font-mono text-emerald-400">
                    {totalPrice} {isEn ? "EGP" : "ج.م"}{" "}
                    {withOrderBump
                      ? isEn
                        ? "(Includes 10,000 Prompts Database & Legal Contracts VIP)"
                        : "(شامل قاعدة بيانات الـ 10,000 برومبت وعقود الفريلانس VIP)"
                      : ""}
                  </b>
                </li>
                <li>• {isEn ? "Sender Phone / Wallet Number" : "الرقم أو المحفظة المحوّل منها"}</li>
              </ul>
            </div>

            <a
              href={
                proofChannel === "whatsapp"
                  ? waLink(paymentConfig.supportWhatsapp)
                  : `mailto:${paymentConfig.supportEmail}?subject=${encodeURIComponent(
                      "Payment Proof - " + (currentTitle ?? "")
                    )}&body=${encodeURIComponent(
                      `Email: ${email}\nProduct: ${currentTitle ?? ""}\nAmount: ${totalPrice} EGP\nSender Phone: `
                    )}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 block w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 py-4 font-black text-neutral-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm"
            >
              {proofChannel === "whatsapp"
                ? isEn
                  ? "Send Screenshot on WhatsApp →"
                  : "ابعت الإثبات على واتساب الآن ←"
                : isEn
                ? "Send Screenshot via Email →"
                : "ابعت الإثبات بالإيميل الآن ←"}
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

  // Filtered tracks for search
  const filteredTracks = courses.filter((c) => {
    if (!searchFilter.trim()) return true;
    const term = searchFilter.toLowerCase().trim();
    return (
      c.title.toLowerCase().includes(term) ||
      (c.titleEn && c.titleEn.toLowerCase().includes(term)) ||
      c.category.toLowerCase().includes(term)
    );
  });

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

        {/* STEP 0: PRODUCT MODEL SELECTION (Track 50 EGP vs Career Path 100 EGP) */}
        <div className="mb-6 rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              <span>🎯</span>
              <span>{isEn ? "Choose Your Learning Model" : "اختر نموذج التملك المهاري"}</span>
            </span>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {isEn ? "Transparent One-Time Fee" : "دفعة واحدة بدون تجديد دوري"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Individual Track Option */}
            <button
              type="button"
              onClick={() => setProductType("track")}
              className={`relative rounded-2xl border-2 p-3.5 text-start transition-all cursor-pointer flex flex-col justify-between ${
                productType === "track"
                  ? "border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-400/20"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-lg">🎯</span>
                  <div className="flex items-baseline gap-1 font-mono" dir="ltr">
                    <span className="text-2xl font-black text-white">{pricing.trackPriceEgp}</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {isEn ? "EGP" : "ج.م"}
                    </span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-black text-white mb-1">
                  {isEn ? "Individual Track" : "مسار تخصصي فردي"}
                </h3>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {isEn
                    ? "Master 1 specific skill with missions and project."
                    : "إتقان مهارة محددة من الصفر حتى مشروع جاهز."}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-300 font-bold">
                <span>{isEn ? "1 Track · 28 Days" : "مسار واحد · ٢٨ يوماً"}</span>
                <span
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    productType === "track"
                      ? "border-emerald-400 bg-emerald-400 text-neutral-950 text-[10px]"
                      : "border-neutral-600"
                  }`}
                >
                  {productType === "track" && "✓"}
                </span>
              </div>
            </button>

            {/* Career Path Option (Recommended) */}
            <button
              type="button"
              onClick={() => setProductType("career_path")}
              className={`relative rounded-2xl border-2 p-3.5 text-start transition-all cursor-pointer flex flex-col justify-between ${
                productType === "career_path"
                  ? "border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-400/20"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="absolute -top-2.5 start-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                ⭐ {isEn ? "Career Roadmap" : "خارطة مهنية شاملة"}
              </div>

              <div>
                <div className="flex items-center justify-between mt-1 mb-1.5">
                  <span className="text-lg">🚀</span>
                  <div className="flex items-baseline gap-1 font-mono" dir="ltr">
                    <span className="text-2xl font-black text-white">
                      {pricing.careerPathPriceEgp}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {isEn ? "EGP" : "ج.م"}
                    </span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-black text-white mb-1">
                  {isEn ? "Career Path" : "مسار مهني متكامل"}
                </h3>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {isEn
                    ? "Full roadmap containing multiple specialized tracks."
                    : "خريطة شاملة تضم عدة مسارات تخصصية مترابطة."}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-300 font-bold">
                <span>{isEn ? "4-8 Tracks Included" : "يشمل ٤ إلى ٨ مسارات"}</span>
                <span
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    productType === "career_path"
                      ? "border-emerald-400 bg-emerald-400 text-neutral-950 text-[10px]"
                      : "border-neutral-600"
                  }`}
                >
                  {productType === "career_path" && "✓"}
                </span>
              </div>
            </button>

            {/* All-Access Pass Option (350 EGP) */}
            <button
              type="button"
              onClick={() => setProductType("all_access")}
              className={`relative rounded-2xl border-2 p-3.5 text-start transition-all cursor-pointer flex flex-col justify-between ${
                productType === "all_access"
                  ? "border-amber-400 bg-amber-950/40 shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/20"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="absolute -top-2.5 start-3 bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                👑 {isEn ? "All 100 Tracks" : "الوصول الشامل الأقصى"}
              </div>

              <div>
                <div className="flex items-center justify-between mt-1 mb-1.5">
                  <span className="text-lg">👑</span>
                  <div className="flex items-baseline gap-1 font-mono" dir="ltr">
                    <span className="text-2xl font-black text-amber-300">
                      {pricing.allAccessPriceEgp}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {isEn ? "EGP" : "ج.م"}
                    </span>
                  </div>
                </div>

                <h3 className="text-xs sm:text-sm font-black text-white mb-1">
                  {isEn ? "All-Access Pass" : "الوصول الشامل لكافة الكورسات"}
                </h3>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  {isEn
                    ? "Unlocks all 100 tracks & all 11 career paths permanently."
                    : "فتح شامل لجميع الـ 100 تراك وكافة المسارات المهنية."}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-300 font-bold">
                <span>{isEn ? "100 Tracks · All Paths" : "الـ ١٠٠ مسار كاملة"}</span>
                <span
                  className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                    productType === "all_access"
                      ? "border-amber-400 bg-amber-400 text-neutral-950 text-[10px]"
                      : "border-neutral-600"
                  }`}
                >
                  {productType === "all_access" && "✓"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* ORDER VALUE SUMMARY CARD */}
        <div className="mb-6 rounded-3xl border-2 border-emerald-500/30 bg-[#0d1614] p-4 sm:p-5 shadow-2xl shadow-emerald-500/10">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-300">
              <span className="text-base">
                {productType === "all_access" ? "👑" : productType === "career_path" ? "🚀" : "🎯"}
              </span>
              <span>
                {productType === "all_access"
                  ? isEn
                    ? "All-Access Pass (Lifetime)"
                    : "باقة الوصول الشامل لجميع الكورسات"
                  : productType === "career_path"
                  ? isEn
                    ? "Career Path Bundle Access"
                    : "حزمة المسار المهني الشامل"
                  : isEn
                  ? "Single Track Mastery"
                  : "تملّك المسار التخصصي الفردي"}
              </span>
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-300 border border-emerald-400/30 whitespace-nowrap shrink-0">
              <span>✓</span>
              <span>{isEn ? "Lifetime Ownership" : "ملكية دائمة مدى الحياة"}</span>
            </span>
          </div>

          {/* Clean, Honest Price Display */}
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
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end border-t border-white/5 pt-2.5 sm:border-0 sm:pt-0">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-3 py-1">
                <span>🔓</span>
                <span>
                  {productType === "all_access"
                    ? isEn
                      ? "All 100 Tracks & 11 Career Paths"
                      : "كافة الـ 100 مسار وجميع المسارات المهنية"
                    : productType === "career_path"
                    ? isEn
                      ? `Includes ${selectedCareerPath?.tracksCount || 4} Specialized Tracks`
                      : `يشمل ${selectedCareerPath?.tracksCount || 4} مسارات متخصصة`
                    : isEn
                    ? "Full 28-Day Mission Stepper & Project"
                    : "الـ ٢٨ يوماً والمشروع العملي والشهادة"}
                </span>
              </span>
            </div>
          </div>

          {/* Transparent Digital Access Note */}
          <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-300">
            <p className="flex items-center gap-2">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[11px] sm:text-xs">
                {isEn ? (
                  <>Immediate activation · Added permanently to your learning inventory</>
                ) : (
                  <>تفعيل فوري · إضافة دائمة لمخزونك التعليمي في لوحة تحكمك</>
                )}
              </span>
            </p>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
              <span>⚡</span>
              <span>{isEn ? "Free Day 1 Preview on all tracks" : "اليوم الأول متاح مجاناً للتجربة"}</span>
            </span>
          </div>
        </div>

        {/* Order Bump (VIP Prompts & Contracts) */}
        <div
          onClick={() => setWithOrderBump(!withOrderBump)}
          className={`mb-5 cursor-pointer rounded-2xl border-2 p-4 transition-all ${
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
                    ⚡ {isEn ? "Executive AI Vault Add-on" : "إضافة اختيارية: حزمة الأصول التنفيذية"}
                  </span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                    🔥 {isEn ? "Recommended for Professionals" : "قيمة إضافية للمحترفين"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xs font-black text-amber-300">
                    +{pricing.orderBumpPriceEgp} {isEn ? "EGP" : "ج.م"}
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
                  ? "An authentic indexed database of 10,000 executive AI prompts covering 100 corporate domains + 5 verified bilingual freelance legal contracts safeguarding your fees."
                  : "قاعدة بيانات مفهرسة تضم 10,000 أمر ذكاء اصطناعي عملي موزعة على 100 مجال تخصصي للشركات + 5 صِيغ عقود عمل حر ثنائية اللغة تحمي أتعابك قانونيًا."}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          {/* PRODUCT SELECTION ACCORDING TO TYPE */}
          {productType === "all_access" ? (
            <div className="rounded-3xl border-2 border-amber-400/30 bg-[#0d1614] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-black text-white flex items-center gap-2">
                  <span>👑</span>
                  <span>{isEn ? `All-Access Pass Selected (${pricing.allAccessPriceEgp} EGP)` : `باقة الوصول الشامل المختارة (${pricing.allAccessPriceEgp} ج.م)`}</span>
                </label>
                <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  {isEn ? "All 100 Tracks Unlocked" : "فتح كافة الـ 100 مسار"}
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-neutral-300">
                {isEn
                  ? "No need to choose a single track or path. You will immediately unlock all 100 specialized tracks, all 11 career paths, quizzes, and future additions permanently."
                  : "لا داعي لاختيار مسار منفرد. سيتم تفعيل وصولك لكافة الـ 100 مسار وجميع المسارات المهنية الـ 11 ومشاريعها وكافة التحديثات القادمة فوراً ومدى الحياة."}
              </p>
              <div className="rounded-2xl border border-white/5 bg-black/40 p-3 space-y-1.5 text-xs text-neutral-300">
                <div className="flex items-center gap-2 text-emerald-300">
                  <span>✓</span>
                  <span>{isEn ? "All 100 Tracks with 2,800 daily interactive missions" : "جميع الـ 100 تراك مع 2,800 مهمة تدريبية تطبيقية"}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <span>✓</span>
                  <span>{isEn ? "All 11 Career Path Roadmaps & Capstone Portfolio Projects" : "جميع المسارات المهنية الـ 11 ومشاريع البورتفوليو الكبرى"}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <span>✓</span>
                  <span>{isEn ? "Verified QR-linked Certificates for every completed track" : "شهادات إتمام رقمية معتمدة لكل مسار تنجزه"}</span>
                </div>
              </div>
            </div>
          ) : productType === "career_path" ? (
            <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-black text-white">
                  {isEn ? `1. Select Career Path (${pricing.careerPathPriceEgp} EGP Bundle)` : `١. حدد المسار المهني المطلوب (${pricing.careerPathPriceEgp} ج.م)`}
                </label>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {isEn ? "Unlocks all included tracks" : "يفتح جميع مسارات الخريطة"}
                </span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-neutral-300">
                {isEn
                  ? "Select the career destination you want to reach. You will own the full roadmap and all contained tracks."
                  : "اختر الوجهة المهنية التي تسعى للوصول إليها. ستتملك خريطة الطريق بالكامل وكافة مساراتها المتخصصة."}
              </p>
              <div className="space-y-2">
                {careerPaths.map((cp) => (
                  <button
                    key={cp.slug}
                    type="button"
                    onClick={() => setSelectedCareerPathSlug(cp.slug)}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start transition-all cursor-pointer ${
                      selectedCareerPathSlug === cp.slug
                        ? "border-emerald-400 bg-emerald-950/40 shadow-md shadow-emerald-500/10"
                        : "border-white/5 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <span className="text-2xl shrink-0">{cp.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs sm:text-sm font-black text-white">
                          {isEn ? (cp.titleEn || cp.title) : cp.title}
                        </span>
                        <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md font-mono">
                          {isEn ? `${cp.tracksCount} tracks` : `${cp.tracksCount} مسارات مشمولة`}
                        </span>
                      </div>
                      <span className="block text-[11px] text-neutral-400 mt-0.5">
                        {isEn ? (cp.targetRoleEn || cp.targetRoleAr) : cp.targetRoleAr}
                      </span>
                    </div>
                    <span
                      className={`h-4 w-4 shrink-0 rounded-full border-2 ${
                        selectedCareerPathSlug === cp.slug
                          ? "border-emerald-400 bg-emerald-400"
                          : "border-neutral-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-black text-white">
                  {isEn ? `1. Select Learning Track (${pricing.trackPriceEgp} EGP)` : `١. حدد المسار التدريبي (${pricing.trackPriceEgp} ج.م)`}
                </label>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {isEn ? "100 Tracks Available" : "١٠٠ مسار متاح"}
                </span>
              </div>

              {/* Search input for tracks */}
              <div className="relative mb-3">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-neutral-400 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder={isEn ? "Search among 100 tracks..." : "ابحث في الـ ١٠٠ مسار..."}
                  className="w-full rounded-xl border border-white/10 bg-black/40 ps-8 pe-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:border-emerald-400 focus:outline-hidden"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pe-1">
                {filteredTracks.slice(0, 15).map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => setSelectedTrackSlug(c.slug)}
                    className={`flex w-full items-center gap-3 rounded-2xl border-2 p-2.5 text-start transition-all cursor-pointer ${
                      selectedTrackSlug === c.slug
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
                        selectedTrackSlug === c.slug
                          ? "border-emerald-400 bg-emerald-400"
                          : "border-neutral-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: USER DETAILS */}
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
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-white/15 bg-neutral-950 ps-10 pe-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 transition-colors focus:border-emerald-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-neutral-300">
                {isEn ? "Transfer Mobile Number" : "رقم الموبايل / المحفظة المحوّل منها"}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-sm text-neutral-400">
                  📱
                </span>
                <input
                  required
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="01xxxxxxxxx"
                  className="w-full rounded-2xl border border-white/15 bg-neutral-950 ps-10 pe-3.5 py-3 text-xs sm:text-sm text-white placeholder:text-neutral-500 font-mono transition-colors focus:border-emerald-400 focus:outline-hidden"
                />
              </div>
              <span className="mt-1 block text-[10px] text-neutral-400">
                {isEn
                  ? "Required to automatically link your incoming payment"
                  : "ضروري لمطابقة التحويل برقم العملية وتفعيل حسابك تلقائيًا"}
              </span>
            </div>
          </div>

          {/* STEP 3: PAYMENT METHOD */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-black text-white">
                {isEn ? "3. Select Payment Method" : "٣. اختر طريقة الدفع المباشر"}
              </label>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                {isEn ? "Instant Transfer" : "تحويل فوري"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod("vodafone_cash")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  method === "vodafone_cash"
                    ? "border-emerald-400 bg-emerald-950/40 text-white shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 text-neutral-400 hover:border-white/20"
                }`}
              >
                <span className="text-xl mb-1">📱</span>
                <span className="text-xs font-bold">
                  {isEn ? "Vodafone Cash" : "فودافون كاش"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMethod("instapay")}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  method === "instapay"
                    ? "border-emerald-400 bg-emerald-950/40 text-white shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 text-neutral-400 hover:border-white/20"
                }`}
              >
                <span className="text-xl mb-1">⚡</span>
                <span className="text-xs font-bold">
                  {isEn ? "InstaPay IPN" : "إنستاباي (InstaPay)"}
                </span>
              </button>
            </div>

            {/* Receiving accounts display */}
            <div className="space-y-2 pt-1">
              <span className="block text-[11px] font-bold text-neutral-400">
                {method === "vodafone_cash"
                  ? isEn
                    ? "Transfer to any of our official Vodafone Cash wallets:"
                    : "حوّل إلى أي من محافظ فودافون كاش المعتمدة:"
                  : isEn
                  ? "Transfer to our official InstaPay account:"
                  : "حوّل إلى حساب إنستاباي المعتمد:"}
              </span>

              {method === "vodafone_cash" ? (
                <div className="space-y-2">
                  {paymentConfig.vodafoneCash.map((num, idx) => (
                    <CopyField
                      key={num}
                      value={num}
                      method="vodafone_cash"
                      label={idx === 0 ? (isEn ? "Primary" : "أساسي") : (isEn ? "Alternative" : "بديل")}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {paymentConfig.instapay.map((acc, idx) => (
                    <CopyField
                      key={acc}
                      value={acc}
                      method="instapay"
                      label={idx === 0 ? (isEn ? "Primary" : "أساسي") : (isEn ? "Alternative" : "بديل")}
                    />
                  ))}

                  <div className="pt-2">
                    <label className="mb-1 block text-xs font-bold text-neutral-300">
                      {isEn ? "Your InstaPay Account Name" : "اسم حسابك في إنستاباي"}
                    </label>
                    <input
                      required={method === "instapay"}
                      value={instapayName}
                      onChange={(e) => setInstapayName(e.target.value)}
                      placeholder={isEn ? "e.g. yourname@instapay" : "الاسم المسجل في تطبيق إنستاباي"}
                      className="w-full rounded-2xl border border-white/15 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:border-emerald-400 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 4: SCREENSHOT CHANNEL */}
          <div className="rounded-3xl border border-white/10 bg-[#0d1614] p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-black text-white">
                {isEn ? "4. Preferred Confirmation Channel" : "٤. أين ترسل إثبات التحويل؟"}
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProofChannel("whatsapp")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  proofChannel === "whatsapp"
                    ? "border-emerald-400 bg-emerald-950/40 text-white shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 text-neutral-400 hover:border-white/20"
                }`}
              >
                <span>💬</span>
                <span className="text-xs font-bold">{isEn ? "WhatsApp" : "واتساب"}</span>
              </button>

              <button
                type="button"
                onClick={() => setProofChannel("email")}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  proofChannel === "email"
                    ? "border-emerald-400 bg-emerald-950/40 text-white shadow-md shadow-emerald-500/10"
                    : "border-white/5 bg-white/5 text-neutral-400 hover:border-white/20"
                }`}
              >
                <span>✉️</span>
                <span className="text-xs font-bold">{isEn ? "Email" : "البريد الإلكتروني"}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-300 text-center">
              ⚠️ {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 py-4 font-black text-neutral-950 shadow-xl shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all text-sm sm:text-base cursor-pointer disabled:opacity-60"
          >
            {loading
              ? isEn
                ? "Processing your request..."
                : "جارٍ تسجيل طلبك والتفعيل..."
              : isEn
              ? `Confirm & Get Payment Details (${totalPrice} EGP) →`
              : `تأكيد الطلب والانتقال للدفع (${totalPrice} ج.م فقط) ←`}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-neutral-400">
          {isEn
            ? "By completing this order, you agree to Tawwerni's Terms of Service and Digital Educational Goods Policy."
            : "بتأكيد الطلب، أنت توافق على شروط خدمة طوّرني وسياسة المنتجات والخدمات التعليمية الرقمية."}
        </p>
      </div>
    </div>
  );
}
