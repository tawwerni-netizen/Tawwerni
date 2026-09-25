"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function TermsPage() {
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
          {isEn ? "Terms of Service" : "الشروط والأحكام"}
        </h1>
        <p className="mb-8 text-xs text-neutral-400">
          {isEn ? "Last updated: September 2026" : "آخر تحديث: سبتمبر 2026"}
        </p>

        <p className="mb-6">
          {isEn
            ? `By accessing and using ${brand.nameEn}, you agree to these transparent terms. They are written in plain, clear language so you know exactly what you are agreeing to.`
            : `استخدامك لـ${brand.name} معناه موافقتك على الشروط دي. اتكتبت بوضوح عشان تعرف بالظبط اللي بتوافق عليه، مش عشان تكون عائق.`}
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "1. What You Receive" : "١. إيه اللي بتشتريه"}
        </h2>
        <p className="mb-6">
          {isEn
            ? `A single one-time payment of ${pricing.priceEgp} EGP unlocks lifetime all-inclusive access to all 100 professional tracks on the platform, including any newly added tracks. No recurring subscriptions, no surprise charges. Day 1 of every track is free for all registered users.`
            : `دفعة واحدة ${pricing.priceEgp} جنيه بتفتحلك وصول مدى الحياة لكل مسارات المنصة، بما فيها أي مسار جديد ننزّله بعد كده. مش اشتراك شهري، ومفيش تجديد تلقائي ومفيش رسوم خفية. اليوم الأول من كل مسار مفتوح مجانًا لأي حساب قبل ما تدفع.`}
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "2. User Accounts" : "٢. حسابك"}
        </h2>
        <ul className="mb-6 list-disc space-y-1.5 ps-5 text-neutral-700 dark:text-neutral-300">
          <li>{isEn ? "Accounts are personal — your registration details should be authentic." : "الحساب شخصي — بياناتك اللي بتدخل بيها لازم تكون حقيقية"}</li>
          <li>{isEn ? "You are responsible for maintaining the confidentiality of your password." : "انت مسؤول عن سرّية كلمة السر بتاعتك"}</li>
          <li>{isEn ? "One account per person. Fraudulent or duplicate accounts will be terminated." : "حساب واحد للشخص الواحد. حسابات مكررة أو وهمية بنقفلها من غير إشعار مسبق"}</li>
        </ul>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "3. Intellectual Property" : "٣. الملكية الفكرية للمحتوى"}
        </h2>
        <p className="mb-6">
          {isEn
            ? `All track curricula, infographics, exercises, and quizzes are the exclusive intellectual property of ${brand.nameEn}. Access is granted solely for your personal non-commercial educational use. Content may not be redistributed, scraped, or resold.`
            : `كل محتوى المسارات — الدروس والمهام والكويزات — ملك ${brand.name}. وصولك ليه شخصي لاستخدامك انت بس. مش مسموح تنسخه أو تعيد بيعه أو توزّعه لحد تاني.`}
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "4. Referrals & Rewards Program" : "٤. الإحالة والمكافآت"}
        </h2>
        <p className="mb-6">
          {isEn
            ? `Our affiliate program rewards you with legitimate cash commissions for genuine referrals who subscribe through your personal link. Any fraudulent activities (self-referrals, bot traffic) forfeit all accumulated payouts.`
            : `نظام الإحالة بيدّيك عمولة حقيقية عن كل حد يشترك فعليًا بلينكك. أي محاولة تلاعب — إحالة نفسك بحساب تاني أو حسابات وهمية — بتلغي المكافأة وتقفل الحساب.`}
        </p>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-10 border-t border-black/5 dark:border-neutral-800 pt-6">
          {isEn ? "Questions regarding these terms? Contact us at: " : "عندك أي استفسار بخصوص الشروط؟ تواصل معنا: "}
          <a href={`mailto:${payment.supportEmail}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
            {payment.supportEmail}
          </a>
        </p>
      </main>
    </div>
  );
}
