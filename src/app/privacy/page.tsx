"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, payment } from "@/content/brand";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function PrivacyPage() {
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
          {isEn ? "Privacy Policy" : "سياسة الخصوصية"}
        </h1>
        <p className="mb-8 text-xs text-neutral-400">
          {isEn ? "Last updated: September 2026" : "آخر تحديث: سبتمبر 2026"}
        </p>

        <p className="mb-6">
          {isEn
            ? `This policy explains transparently what data ${brand.nameEn} collects from you, why, and how we safeguard it. No convoluted legal jargon — our goal is complete clarity.`
            : `الصفحة دي بتشرح بوضوح إيه البيانات اللي ${brand.name} بيجمعها منك، ليه، وإزاي بنستخدمها. مفيش لغة قانونية معقّدة — الهدف إنك تفهم بالظبط اللي بيحصل.`}
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "1. Information We Collect" : "البيانات اللي بنجمعها"}
        </h2>
        <ul className="mb-6 list-disc space-y-1.5 ps-5 text-neutral-700 dark:text-neutral-300">
          <li>{isEn ? "Name, email, and phone number when creating an account." : "الاسم والإيميل ورقم الموبايل — لما تعمل حساب"}</li>
          <li>{isEn ? "Passwords are cryptographically hashed using one-way scrypt — impossible for anyone (including us) to view as plaintext." : "كلمة السر — متخزنة مشفّرة باتجاه واحد (scrypt)، مستحيل ترجع نص واضح حتى لينا"}</li>
          <li>{isEn ? "Sender phone number or InstaPay display name to match and verify your payment confirmation." : "رقم الموبايل اللي هتحوّل منه، أو اسمك على إنستاباي — عشان نطابق تحويلك أوتوماتيك"}</li>
          <li>{isEn ? "Learning progress: completed lesson days, earned XP, badges, and accredited certificates." : "إجابات الكويز التعريفي، وتقدّمك في الدروس (نقاط الكويز، الشارات، الأيام اللي خلّصتها)"}</li>
          <li>{isEn ? `Messages sent to Coach ${brand.coachName} within the AI support widget.` : `أي رسالة تبعتها لمساعد "${brand.coachName}" داخل المنصة`}</li>
        </ul>

        <p className="mb-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 p-4 text-xs leading-relaxed text-teal-900 dark:text-teal-200">
          {isEn
            ? "We NEVER collect or store banking card credentials. Payment is executed directly through your mobile wallet (Vodafone Cash or InstaPay), and confirmation screenshots are verified by human staff."
            : "مبنجمعش بيانات بطاقات بنكية أبدًا. الدفع بيتم بتحويل مباشر من محفظتك (فودافون كاش أو إنستاباي)، وإثبات التحويل بتبعته لينا يدويًا على واتساب أو إيميل."}
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "2. How We Use Your Data" : "إزاي بنستخدم البيانات دي"}
        </h2>
        <ul className="mb-6 list-disc space-y-1.5 ps-5 text-neutral-700 dark:text-neutral-300">
          <li>{isEn ? "Authenticating your account and personalizing your dashboard." : "تشغيل حسابك وتسجيل دخولك"}</li>
          <li>{isEn ? "Verifying bank transfer orders and unlocking your 100 tracks." : "مطابقة تحويلك المالي بطلبك وتفعيل وصولك للمسارات"}</li>
          <li>{isEn ? "Tracking streaks, XP milestones, and generating verifiable certificates." : "تتبّع تقدّمك (XP، الشارات، الشهادات) وعرضه لك"}</li>
          <li>{isEn ? "Sending critical transactional notifications (welcome, payment receipt, password reset)." : "إرسال إيميلات ضرورية: أهلًا بيك، إيصال الطلب، تفعيل الاشتراك، تنبيهات الأمان"}</li>
          <li>{isEn ? "Promptly addressing customer support inquiries via WhatsApp or email." : "الرد على استفساراتك لما تكلّمنا على واتساب أو إيميل"}</li>
        </ul>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "3. Data Security & Retention" : "أمان البيانات وحذفها"}
        </h2>
        <p className="mb-6">
          {isEn
            ? "All platform traffic is encrypted in transit via SSL/TLS. You have full right to export or request complete deletion of your account and learning records anytime by contacting support."
            : "كل اتصالات المنصة مشفرة عبر بروتوكول SSL/TLS. يحق لك في أي وقت طلب تصدير بياناتك أو حذف حسابك وسجلاتك بالكامل بالتواصل المباشر معنا."}
        </p>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-10 border-t border-black/5 dark:border-neutral-800 pt-6">
          {isEn ? "Questions regarding your privacy? Contact us: " : "عندك أي استفسار بخصوص خصوصيتك؟ تواصل معنا: "}
          <a href={`mailto:${payment.supportEmail}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
            {payment.supportEmail}
          </a>
        </p>
      </main>
    </div>
  );
}
