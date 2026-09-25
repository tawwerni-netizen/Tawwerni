"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function RefundPage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors"
    >
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="tap px-2 py-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10 text-sm leading-relaxed">
        <h1 className="mb-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          {isEn ? "Refund Policy & Guarantee" : "سياسة الاسترجاع والضمان"}
        </h1>
        <p className="mb-8 text-xs text-neutral-400">
          {isEn ? "Last updated: September 2026" : "آخر تحديث: سبتمبر 2026"}
        </p>

        <div className="mb-8 rounded-3xl border border-teal-500/30 bg-teal-50/70 dark:bg-teal-950/40 p-5 text-neutral-900 dark:text-white shadow-xs">
          <p className="font-bold text-teal-900 dark:text-teal-200 text-base mb-1">
            🛡️ {isEn ? "14-Day 100% Money-Back Guarantee" : "ضمان استرداد كامل خلال ١٤ يومًا"}
          </p>
          <p className="text-xs sm:text-sm text-teal-800 dark:text-teal-300 leading-relaxed">
            {isEn
              ? "If you subscribe and feel the platform does not deliver genuine practical value to your personal or professional growth, simply message us within 14 days of activation for a full refund."
              : "لو اشتركت وحسيت إن المنصة مأضافتش ليك قيمة عملية حقيقية في تطوير مهاراتك أو دخلك، كلّمنا خلال ١٤ يومًا من التفعيل ونرجعلك كامل المبلغ بدون أي تعقيد."}
          </p>
        </div>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "1. Free Day 1 Preview Before Purchase" : "١. جرّب اليوم الأول مجانًا أولًا"}
        </h2>
        <p className="mb-6">
          {isEn
            ? "To ensure total peace of mind, Day 1 of every single one of our 100 tracks is completely free. You can experience the lesson cards, interactive quiz, and hands-on mission before paying a single cent."
            : "لتضمن رضاك التام، اليوم الأول في كل مسار من الـ ١٠٠ مسار مفتوح مجانًا لأي حساب مسجل. تقدر تقرأ البطاقات وتختبر الكويز التفاعلي وتشوف الأسلوب بنفسك قبل ما تدفع أي حاجة."}
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "2. How to Request a Refund" : "٢. كيف تطلب الاسترداد"}
        </h2>
        <p className="mb-4">
          {isEn
            ? "No lengthy dispute forms or automated roadblocks. Just send your registered email and transfer details to our official human support team:"
            : "بدون أي نماذج معقدة. كل اللي عليك تبعت إيميلك المسجل وبيانات التحويل لفريق الدعم البشري المباشر:"}
        </p>
        <ul className="mb-6 list-disc space-y-1.5 ps-5 text-neutral-700 dark:text-neutral-300">
          <li>
            WhatsApp:{" "}
            <a href={`https://wa.me/2${payment.supportWhatsapp}`} dir="ltr" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              +{payment.supportWhatsapp}
            </a>
          </li>
          <li>
            Email:{" "}
            <a href={`mailto:${payment.supportEmail}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              {payment.supportEmail}
            </a>
          </li>
        </ul>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "3. Incorrect Transfers" : "٣. التحويلات الخاطئة"}
        </h2>
        <p className="mb-6">
          {isEn
            ? "If you mistakenly transferred to a wrong wallet number or an unmatched amount, alert our support immediately on WhatsApp with your transfer receipt and we will reconcile it with you within hours."
            : "لو حوّلت لرقم غير مطابق أو حصل أي لبس في إرسال المبلغ، تواصل معنا فورًا على واتساب مع صورة التحويل وسنحل المشكلة معك فورًا."}
        </p>

        <div className="mt-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900 p-4 text-xs text-neutral-600 dark:text-neutral-400">
          <p>
            {isEn
              ? `Tawwerni membership is a one-time payment of ${pricing.priceEgp} EGP granting lifetime access. There are zero recurring monthly debits or unexpected fees.`
              : `اشتراك طوّرني هو دفعة واحدة بقيمة ${pricing.priceEgp} ج.م لمدى الحياة — لا توجد أي خصومات شهرية متكررة أو رسوم غير معلنة.`}
          </p>
        </div>
      </main>
    </div>
  );
}
