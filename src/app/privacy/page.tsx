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
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors relative overflow-hidden flex flex-col"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-40 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <LogoLink size={34} href="/" />
            <span className="text-xs text-neutral-400 hidden sm:inline">|</span>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hidden sm:inline">
              {isEn ? "Privacy Policy" : "وثيقة الخصوصية"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-all"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 text-sm leading-relaxed flex-1 w-full">
        {/* Top badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 mb-4 shadow-2xs">
          <span>🔒</span>
          <span>{isEn ? "User Data Protection & Google Compliance" : "حماية البيانات وامتثال جوجل المعتمد"}</span>
        </span>

        <h1 className="mb-2 text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
          {isEn ? "Privacy Policy" : "سياسة الخصوصية"}
        </h1>
        <p className="mb-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          {isEn ? "Last updated: October 2026 · Official Document" : "آخر تحديث: أكتوبر 2026 · وثيقة رسمية معتمدة"}
        </p>

        <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-500/20 text-teal-900 dark:text-teal-200 text-xs sm:text-sm mb-8 leading-relaxed">
          {isEn
            ? `This Privacy Policy outlines how ${brand.nameEn} (${brand.domain}) collects, uses, and safeguards your personal data, particularly regarding authentication and third-party integrations like Google Sign-In.`
            : `توضح سياسة الخصوصية هذه كيفية قيام منصة "${brand.name}" (${brand.domain}) بجمع واستخدام وحماية بياناتك الشخصية، وبشكل خاص فيما يتعلق بخدمات تسجيل الدخول والربط بحسابات جوجل.`}
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">1.</span>
              <span>{isEn ? "Google Sign-In Integration" : "استخدام تسجيل الدخول عبر حسابات جوجل (Google Sign-In)"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "Our platform integrates Google OAuth authentication services to facilitate a secure, seamless, and expedited registration and login experience for our users."
                : "تستخدم منصة طوّرني خدمة تسجيل الدخول المعتمدة من شركة جوجل (Google OAuth) لتسهيل وتسريع تجربة المستخدم، وتوفير وسيلة دخول آمنة دون الحاجة لتعقيدات كلمات المرور التقليدية."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">2.</span>
              <span>{isEn ? "Data We Collect via Google" : "البيانات المجمّعة من حساب جوجل"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3">
              {isEn
                ? "When you authenticate using Google Sign-In, the data we access and collect is strictly limited to the basic profile information granted by your consent:"
                : "عند استخدامك لخاصية تسجيل الدخول عبر جوجل، فإن البيانات التي نصل إليها ونقوم بجمعها تقتصر فقط وبشكل صارم على:"}
            </p>
            <ul className="list-disc ps-5 space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>{isEn ? "Full Name:" : "الاسم الشخصي:"}</strong>{" "}
                {isEn ? "To personalize your profile and verified certificates." : "لتخصيص حسابك وعرض اسمك على الشهادات المعتمدة."}
              </li>
              <li>
                <strong>{isEn ? "Email Address:" : "عنوان البريد الإلكتروني:"}</strong>{" "}
                {isEn ? "To uniquely identify your account and send critical updates." : "لتمييز حسابك وإرسال الإشعارات الضرورية الخاصة بتعلمك."}
              </li>
            </ul>
            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/60 p-3 rounded-xl">
              {isEn
                ? "🛡️ We do not access your contacts, files, Google Drive, or any other sensitive personal data."
                : "🛡️ نحن لا نطلب ولا نصل أبدًا إلى جهات اتصالك، ملفاتك، أو أي بيانات حساسة أخرى في حساب جوجل الخاص بك."}
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">3.</span>
              <span>{isEn ? "Purpose of Data Processing" : "الغرض من جمع واستخدام البيانات"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "The sole and exclusive purpose of collecting this information is to create, operate, and manage your learner account on Tawwerni, maintain your course progress, and enable full access to our educational platform."
                : "الغرض الوحيد والأساسي من جمع هذه البيانات هو إنشاء وإدارة حسابك التعليمي على منصة \"طوّرني\"، وحفظ مسار تقدمك في الدروس والكورسات، وتسهيل وصولك لخدمات الموقع."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">4.</span>
              <span>{isEn ? "Strict Non-Disclosure & Anti-Selling Policy" : "الالتزام التام بعدم بيع أو مشاركة البيانات"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "We maintain a strict zero-tolerance policy against commercializing user data. We do not sell, rent, trade, or share your personal information or Google user data with any third parties, advertisers, or external marketing entities under any circumstances."
                : "نلتزم التزاماً قاطعاً بعدم بيع، أو تأجير، أو مشاركة أي بيانات شخصية تخص المستخدمين (بما فيها البيانات القادمة من جوجل) مع أي أطراف ثالثة أو شركات إعلانية أو جهات تسويقية لأي غرض كان."}
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">5.</span>
              <span>{isEn ? "User Rights & Account/Data Deletion" : "حقوق المستخدم وحذف البيانات بالكامل"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3">
              {isEn
                ? "You retain full ownership and control over your personal data. You have the right to request access, correction, or permanent deletion of your account and all associated data from our servers at any time."
                : "يحق لك في أي وقت ممارسة حقوقك في حماية بياناتك الشخصية، بما في ذلك طلب مراجعة أو تعديل أو حذف بياناتك وحسابك بالكامل من خوادمنا بشكل نهائي وبدون أي قيود."}
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3">
              {isEn
                ? "To request complete data deletion, please contact our administrative team directly:"
                : "لطلب حذف البيانات والحساب نهائياً، يمكنك مراسلتنا مباشرة عبر:"}
            </p>
            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-black/10 dark:border-white/10 p-4 space-y-2">
              <p className="text-xs sm:text-sm">
                📧 <strong>{isEn ? "Email:" : "البريد الإلكتروني:"}</strong>{" "}
                <a href={`mailto:${payment.supportEmail}`} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                  {payment.supportEmail}
                </a>
              </p>
              <p className="text-xs sm:text-sm">
                💬 <strong>{isEn ? "WhatsApp Support:" : "الدعم الفني عبر واتساب:"}</strong>{" "}
                <a
                  href={`https://wa.me/2${payment.supportWhatsapp}`}
                  dir="ltr"
                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  +{payment.supportWhatsapp}
                </a>
              </p>
            </div>
          </section>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-10 border-t border-black/5 dark:border-neutral-800 pt-6 text-center">
          {isEn
            ? "Tawwerni complies with international data privacy and internet safety best practices."
            : "منصة طوّرني تلتزم بأعلى معايير حماية وخصوصية البيانات الرقمية المتبعة دولياً."}
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "Privacy & Data Protection" : "الخصوصية وحماية البيانات"}</p>
          <div className="flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
            <Link href="/about" className="hover:text-teal-600 transition-colors">{isEn ? "About Us" : "من نحن"}</Link>
            <span>•</span>
            <Link href="/tracks" className="hover:text-teal-600 transition-colors">{isEn ? "Tracks" : "المسارات"}</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-teal-600 transition-colors">{isEn ? "Terms" : "الشروط والأحكام"}</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-teal-600 transition-colors font-semibold text-teal-700 dark:text-teal-400">{isEn ? "7-Day Refund Guarantee" : "ضمان الـ 7 أيام"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
