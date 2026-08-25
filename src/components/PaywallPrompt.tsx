"use client";

import Link from "next/link";
import { pricing, payment } from "@/content/brand";

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
  if (state === "pending") {
    return (
      <div className="animate-rise rounded-3xl border border-amber-200 bg-amber-50 p-6 text-center">
        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white text-3xl">
          ⏳
        </div>
        <h2 className="mb-2 text-lg font-bold text-amber-900">طلبك تحت المراجعة</h2>
        <p className="mb-4 text-sm leading-relaxed text-amber-800">
          وصلنا طلبك وبنراجع التحويل. هنفعّلك خلال{" "}
          <b>{payment.activationHours} ساعة</b> على الأكثر — وغالبًا أسرع بكتير.
        </p>
        {/* A token, not `bg-white/70` — that stayed light in night mode and put
            pale gold text on a pale ground. */}
        <div className="rounded-2xl p-3 text-right pending-note">
          <p className="mb-1 text-xs font-bold text-amber-900">لسه ما بعتّش إثبات التحويل؟</p>
          <p className="text-xs leading-relaxed text-amber-800">
            ابعت صورة التحويل + إيميلك على واتساب{" "}
            <b dir="ltr">{payment.supportWhatsapp}</b> عشان نلاقيه بسرعة.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 text-white">
      <div className="p-6 text-center">
        <div className="mx-auto mb-3 grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-4xl">
          🎉
        </div>
        <p className="mb-1 text-xs font-bold tracking-wide text-brand-100">
          خلّصت اليوم الأول
        </p>
        <h2 className="mb-2 text-xl font-bold">حلو! كمّل الباقي</h2>
        <p className="mx-auto mb-5 max-w-xs text-sm leading-relaxed text-white/85">
          فاضلك <b className="text-white">{Math.max(0, totalLessons - 1)} يوم</b> في
          {" "}{courseTitle} — واشتراك واحد بيفتحلك <b className="text-white">كل المسارات</b>.
        </p>

        <div className="mb-5 inline-flex items-baseline gap-2 rounded-2xl bg-white/10 px-5 py-3">
          <span className="text-3xl font-bold">{pricing.priceEgp}</span>
          <span className="text-sm">ج.م</span>
          <span className="text-sm text-white/50 line-through" dir="ltr">
            {pricing.originalPriceEgp}
          </span>
        </div>

        <Link
          href="/quiz/checkout"
          className="btn-ghost-shine mb-3 block rounded-full bg-white py-3.5 text-sm font-bold text-brand-800"
        >
          افتح كل المسارات ←
        </Link>
        <p className="text-xs text-white/60">
          دفعة واحدة · وصول مدى الحياة · ضمان استرجاع ٧ أيام
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-px bg-white/10 text-right text-xs">
        {[
          ["📚", "٦ مسارات كاملة"],
          ["🎯", "مهمة عملية كل يوم"],
          ["🏅", "شارات وشهادات"],
          ["♾️", "تحديثات مجانية"],
        ].map(([icon, label]) => (
          <li key={label} className="flex items-center gap-2 bg-brand-800/60 px-4 py-3">
            <span aria-hidden>{icon}</span>
            <span className="text-white/90">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
