"use client";

import Link from "next/link";
import { pricing, payment } from "@/content/brand";
import { useI18n } from "@/components/LanguageContext";

/**
 * Shown right after a non-paying learner finishes the free day, and whenever
 * a locked day is opened. Two very different states: "you haven't paid yet"
 * asks for the sale; "we're checking your transfer" reassures instead of
 * selling again to someone who already paid.
 */
export default function PaywallPrompt({
  state,
  totalLessons,
  courseTitle,
}: {
  state: "unpaid" | "pending";
  totalLessons: number;
  courseTitle: string;
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
          {isEn ? "Your Order is Under Review" : "طلبك تحت المراجعة"}
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-amber-800 dark:text-amber-300">
          {isEn ? (
            <>
              We received your order and are verifying your payment. Your account will be activated within{" "}
              <b>{payment.activationHours} hours</b> at most — usually much faster.
            </>
          ) : (
            <>
              وصلنا طلبك وبنراجع التحويل. هنفعّلك خلال{" "}
              <b>{payment.activationHours} ساعة</b> على الأكثر — وغالبًا أسرع بكتير.
            </>
          )}
        </p>
        <div className={`rounded-2xl p-3 bg-white/70 dark:bg-neutral-900/60 border border-amber-200/60 dark:border-amber-500/20 ${isEn ? "text-left" : "text-right"}`}>
          <p className="mb-1 text-xs font-bold text-amber-900 dark:text-amber-200">
            {isEn ? "Haven't sent your transfer proof yet?" : "لسه ما بعتّش إثبات التحويل؟"}
          </p>
          <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            {isEn ? (
              <>
                Send your payment screenshot + email on WhatsApp to{" "}
                <b dir="ltr">+{payment.supportWhatsapp}</b> for rapid activation.
              </>
            ) : (
              <>
                ابعت صورة التحويل + إيميلك على واتساب{" "}
                <b dir="ltr">{payment.supportWhatsapp}</b> عشان نلاقيه بسرعة.
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  const features = isEn
    ? [
        ["📚", "100 Complete Pro Tracks"],
        ["🎯", "Daily Practical Task"],
        ["🏅", "Badges & Certificates"],
        ["♾️", "Free 1-Year Updates"],
      ]
    : [
        ["📚", "١٠٠ مسار احترافي كامل"],
        ["🎯", "مهمة عملية كل يوم"],
        ["🏅", "شارات وشهادات"],
        ["♾️", "تحديثات مجانية"],
      ];

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="animate-rise overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-neutral-950 text-white shadow-xl border border-teal-500/30"
    >
      <div className="p-6 text-center">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-4xl backdrop-blur-md">
          🎉
        </div>
        <p className="mb-1 text-xs font-bold tracking-wide text-teal-200">
          {isEn ? "You Completed Day 1!" : "خلّصت اليوم الأول"}
        </p>
        <h2 className="mb-2 text-xl font-bold">
          {isEn ? "Awesome! Unlock the Full Journey" : "حلو! كمّل الباقي"}
        </h2>
        <p className="mx-auto mb-5 max-w-xs text-sm leading-relaxed text-white/90">
          {isEn ? (
            <>
              You have <b className="text-white">{Math.max(0, totalLessons - 1)} days</b> remaining in{" "}
              {courseTitle} — and a single pass unlocks <b className="text-white">all 100 tracks for life</b>.
            </>
          ) : (
            <>
              فاضلك <b className="text-white">{Math.max(0, totalLessons - 1)} يوم</b> في{" "}
              {courseTitle} — واشتراك واحد بيفتحلك <b className="text-white">كل المسارات</b>.
            </>
          )}
        </p>

        <div className="mb-5 inline-flex items-baseline gap-2 rounded-2xl bg-white/10 px-5 py-3 border border-white/10">
          <span className="text-3xl font-bold font-mono">{pricing.priceEgp}</span>
          <span className="text-sm font-semibold">{isEn ? "EGP" : "ج.م"}</span>
        </div>

        <Link
          href="/quiz/checkout"
          className="btn-ghost-shine mb-3 block rounded-full bg-white py-3.5 text-sm font-bold text-teal-950 shadow-lg hover:bg-neutral-50 transition-colors"
        >
          {isEn ? "Unlock All 100 Tracks →" : "افتح كل المسارات ←"}
        </Link>
        <p className="text-xs text-white/70">
          {isEn
            ? "One-time payment · 1-Year access · All new tracks included free"
            : "دفعة واحدة · وصول لمدة سنة · كل مسار جديد مجانًا"}
        </p>
      </div>

      <ul className={`grid grid-cols-2 gap-px bg-white/10 text-xs ${isEn ? "text-left" : "text-right"}`}>
        {features.map(([icon, label]) => (
          <li key={label} className="flex items-center gap-2 bg-teal-950/70 px-4 py-3">
            <span aria-hidden>{icon}</span>
            <span className="text-white/90 font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
