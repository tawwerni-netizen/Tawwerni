"use client";

import Link from "next/link";
import { pricing, payment } from "@/content/brand";
import { useI18n } from "@/components/LanguageContext";
import { getCareerPathsForTrack } from "@/content/career-paths";

/**
 * Shown right after a learner finishes the free preview day, or when accessing
 * locked content in a track.
 * Presents clear V3 modular options:
 * 1. Own this Track for 59 EGP (lifetime)
 * 2. Own the full Career Path Bundle for 149 EGP
 * 3. Own the All-Access Pass for 399 EGP
 */
export default function PaywallPrompt({
  state,
  totalLessons,
  courseTitle,
  courseSlug,
}: {
  state: "unpaid" | "pending";
  totalLessons: number;
  courseTitle: string;
  courseSlug?: string;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  if (state === "pending") {
    return (
      <div className="animate-rise rounded-3xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-950/20 p-6 text-center" dir={isEn ? "ltr" : "rtl"}>
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white dark:bg-neutral-900 text-3xl shadow-xs">
          ⏳
        </div>
        <h2 className="mb-2 text-lg font-bold text-amber-900 dark:text-amber-200">
          {isEn ? "Your Order is Under Review" : "طلبك قيد المراجعة والتفعيل"}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
          {isEn ? (
            <>
              We received your order and are verifying your transfer. Your track will be added to your inventory within{" "}
              <b>{payment.activationHours} hours</b> at most — usually much faster.
            </>
          ) : (
            <>
              وصلنا طلبك وجارٍ مراجعة التحويل. سيتم إضافة المسار لمكتبتك التعليمية وتفعيله خلال{" "}
              <b>{payment.activationHours} ساعة</b> على الأكثر — وغالبًا خلال دقائق.
            </>
          )}
        </p>
        <div className={`rounded-2xl p-3 bg-white/70 dark:bg-neutral-900/60 border border-amber-200/60 dark:border-amber-500/20 ${isEn ? "text-left" : "text-right"}`}>
          <p className="mb-1 text-xs font-bold text-amber-900 dark:text-amber-200">
            {isEn ? "Haven't sent your transfer proof yet?" : "لم ترسل إثبات التحويل بعد؟"}
          </p>
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            {isEn ? (
              <>
                Send your payment screenshot + email on WhatsApp to{" "}
                <b dir="ltr">+{payment.supportWhatsapp}</b> for immediate activation.
              </>
            ) : (
              <>
                أرسل صورة التحويل + إيميلك على واتساب{" "}
                <b dir="ltr">{payment.supportWhatsapp}</b> للتفعيل الفوري.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  const matchedCareerPaths = courseSlug ? getCareerPathsForTrack(courseSlug) : [];
  const primaryCareerPath = matchedCareerPaths[0]?.careerPath;

  const trackCheckoutUrl = courseSlug
    ? `/quiz/checkout?type=track&slug=${encodeURIComponent(courseSlug)}`
    : "/quiz/checkout?type=track";

  const careerPathCheckoutUrl = primaryCareerPath
    ? `/quiz/checkout?type=career_path&slug=${encodeURIComponent(primaryCareerPath.slug)}`
    : "/career-paths";

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="animate-rise overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1e19] via-[#0d2a23] to-[#081512] text-white shadow-2xl border-2 border-emerald-500/40"
    >
      <div className="p-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-3xl backdrop-blur-md shadow-inner border border-white/10">
          🎉
        </div>
        <p className="mb-1 text-xs font-black tracking-wide text-emerald-300">
          {isEn ? "Day 1 Complete · Ready for Next Steps!" : "أنهيت اليوم الأول بنجاح · جاهز للخطوة التالية!"}
        </p>
        <h2 className="mb-2 text-xl sm:text-2xl font-black text-white">
          {isEn ? `Own ${courseTitle} Forever` : `امتلك مسار ${courseTitle} للأبد`}
        </h2>
        <p className="mx-auto mb-6 max-w-sm text-xs sm:text-sm leading-relaxed text-neutral-300">
          {isEn ? (
            <>
              You have <b className="text-white">{Math.max(0, totalLessons - 1)} practical days</b> remaining. Choose between owning just this single track, or unlocking the complete career path roadmap.
            </>
          ) : (
            <>
              متبقي لك <b className="text-white">{Math.max(0, totalLessons - 1)} مهمة عملية</b>. يمكنك امتلاك هذا المسار التخصصي بمفرده، أو فتح المسار المهني الشامل بالكامل بامتلاك دائم لجميع مساراته.
            </>
          )}
        </p>

        {/* Dual Modular Purchase Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6 text-start">
          {/* Option 1: Track Only */}
          <div className="rounded-2xl border border-white/15 bg-white/5 p-4 flex flex-col justify-between hover:border-white/30 transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                  {isEn ? "Single Track" : "مسار فردي فقط"}
                </span>
                <span className="text-sm font-black font-mono text-teal-300">
                  {pricing.trackPriceEgp} {isEn ? "EGP" : "ج.م"}
                </span>
              </div>
              <h3 className="text-xs font-black text-white mb-1">
                {courseTitle}
              </h3>
              <p className="text-3xs text-neutral-400 mb-3">
                {isEn
                  ? "Full 28-day missions + AI mentor + verified certificate"
                  : "خطة الـ 28 يوماً كاملة + كوتش الذكاء الاصطناعي + شهادة موثقة"}
              </p>
            </div>
            <Link
              href={trackCheckoutUrl}
              className="w-full block text-center rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 text-xs transition border border-white/20"
            >
              {isEn ? `Own This Track (${pricing.trackPriceEgp} EGP) →` : `امتلك هذا المسار فقط (${pricing.trackPriceEgp} ج.م) ←`}
            </Link>
          </div>

          {/* Option 2: Full Career Path - Best Value */}
          <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-500/10 p-4 flex flex-col justify-between relative shadow-lg shadow-emerald-500/10">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xs font-black px-2 py-0.5 rounded-full bg-emerald-400 text-neutral-950">
                  {isEn ? "🌟 Complete Roadmap" : "🌟 خريطة طريق متكاملة"}
                </span>
                <span className="text-sm font-black font-mono text-emerald-300">
                  {pricing.careerPathPriceEgp} {isEn ? "EGP" : "ج.م"}
                </span>
              </div>
              <h3 className="text-xs font-black text-white mb-1">
                {primaryCareerPath
                  ? (isEn ? primaryCareerPath.titleEn : primaryCareerPath.titleAr)
                  : (isEn ? "Complete Career Path" : "المسار المهني المتكامل")}
              </h3>
              <p className="text-3xs text-emerald-200/80 mb-3">
                {isEn
                  ? "Unlocks this track + ALL companion roadmap tracks permanently"
                  : "يفتح هذا المسار + كافة مسارات التخصص المندرجة للأبد"}
              </p>
            </div>
            <Link
              href={careerPathCheckoutUrl}
              className="w-full block text-center rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 text-neutral-950 font-black py-2.5 text-xs shadow-md hover:brightness-110 active:scale-98 transition"
            >
              {isEn ? `Get Full Path (${pricing.careerPathPriceEgp} EGP) →` : `المسار المهني الشامل (${pricing.careerPathPriceEgp} ج.م) ←`}
            </Link>
          </div>
        </div>

        {/* Ownership Callout */}
        <p className="text-2xs text-neutral-400 mb-1">
          {isEn
            ? "✓ One-time payment · Lifetime ownership · Instant access"
            : "✓ دفعة واحدة لمرة واحدة · امتلاك دائم مدى الحياة · تفعيل فوري ومباشر"}
        </p>
      </div>

      {/* Feature Strip */}
      <ul className={`grid grid-cols-2 gap-px bg-white/10 text-2xs ${isEn ? "text-left" : "text-right"}`}>
        {[
          ["🎯", isEn ? "Practical Micro-Tasks" : "مهام تطبيقية يومية"],
          ["🤖", isEn ? "24/7 AI Coach (Faheem)" : "كوتش الذكاء الاصطناعي فهيم"],
          ["🏅", isEn ? "Verifiable QR Certificate" : "شهادة إتمام معتمدة بكود QR"],
          ["♾️", isEn ? "Lifetime Ownership" : "امتلاك دائم بدون تجديد تلقائي"],
        ].map(([icon, label]) => (
          <li key={label} className="flex items-center gap-2 bg-[#061511] px-4 py-2.5">
            <span aria-hidden>{icon}</span>
            <span className="text-neutral-300 font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
