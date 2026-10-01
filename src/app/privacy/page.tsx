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
        <p className="mb-6 text-xs text-neutral-400">
          {isEn ? "Last updated: October 2026" : "آخر تحديث: أكتوبر 2026"}
        </p>

        <p className="mb-6 text-neutral-700 dark:text-neutral-300">
          {isEn
            ? `This Privacy Policy outlines how ${brand.nameEn} (Tawwerni.com) collects, uses, and safeguards your personal data, particularly regarding authentication and third-party integrations like Google Sign-In.`
            : `توضح سياسة الخصوصية هذه كيفية قيام منصة "${brand.name}" (Tawwerni.com) بجمع واستخدام وحماية بياناتك الشخصية، وبشكل خاص فيما يتعلق بخدمات تسجيل الدخول والربط بحسابات جوجل.`}
        </p>

        <div className="space-y-6">
          {/* Section 1 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "1. Google Sign-In Integration" : "1. استخدام تسجيل الدخول عبر حسابات جوجل (Google Sign-In)"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "Our platform integrates Google OAuth authentication services to facilitate a secure, seamless, and expedited registration and login experience for our users."
                : "تستخدم منصة طوّرني خدمة تسجيل الدخول المعتمدة من شركة جوجل (Google OAuth) لتسهيل وتسريع تجربة المستخدم، وتوفير وسيلة دخول آمنة دون الحاجة لتعقيدات كلمات المرور التقليدية."}
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "2. Data We Collect via Google" : "2. البيانات المجمّعة من حساب جوجل"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              {isEn
                ? "When you authenticate using Google Sign-In, the data we access and collect is strictly limited to the basic profile information granted by your consent:"
                : "عند استخدامك لخاصية تسجيل الدخول عبر جوجل، فإن البيانات التي نصل إليها ونقوم بجمعها تقتصر فقط وبشكل صارم على:"}
            </p>
            <ul className="list-disc ps-5 space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>{isEn ? "Full Name:" : "الاسم الشخصي:"}</strong>{" "}
                {isEn ? "To personalize your profile and certificates." : "لتخصيص حسابك وعرض اسمك على الشهادات المعتمدة."}
              </li>
              <li>
                <strong>{isEn ? "Email Address:" : "عنوان البريد الإلكتروني:"}</strong>{" "}
                {isEn ? "To uniquely identify your account and send critical updates." : "لتمييز حسابك وإرسال الإشعارات الضرورية الخاصة بتعلمك."}
              </li>
            </ul>
            <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "We do not access your contacts, files, Google Drive, or any other sensitive personal information."
                : "نحن لا نطلب ولا نصل أبدًا إلى جهات اتصالك، ملفاتك، أو أي بيانات حساسة أخرى في حساب جوجل الخاص بك."}
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "3. Purpose of Data Processing" : "3. الغرض من جمع واستخدام البيانات"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "The sole and exclusive purpose of collecting this information is to create, operate, and manage your learner account on Tawwerni, maintain your course progress, and enable full access to our educational platform."
                : "الغرض الوحيد والأساسي من جمع هذه البيانات هو إنشاء وإدارة حسابك التعليمي على منصة \"طوّرني\"، وحفظ مسار تقدمك في الدروس والكورسات، وتسهيل وصولك لخدمات الموقع."}
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "4. Strict Non-Disclosure & Sharing Policy" : "4. الالتزام التام بعدم بيع أو مشاركة البيانات"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "We maintain a strict zero-tolerance policy against commercializing user data. We do not sell, rent, trade, or share your personal information or Google user data with any third parties, advertisers, or external marketing entities under any circumstances."
                : "نلتزم التزاماً قاطعاً بعدم بيع، أو تأجير، أو مشاركة أي بيانات شخصية تخص المستخدمين (بما فيها البيانات القادمة من جوجل) مع أي أطراف ثالثة أو شركات إعلانية أو جهات تسويقية لأي غرض كان."}
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "5. User Rights & Account/Data Deletion" : "5. حقوق المستخدم وحذف البيانات"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              {isEn
                ? "You retain full ownership and control over your personal data. You have the right to request access, correction, or permanent deletion of your account and all associated data from our servers at any time."
                : "يحق لك في أي وقت ممارسة حقوقك في حماية بياناتك الشخصية، بما في ذلك طلب مراجعة أو تعديل أو حذف بياناتك وحسابك بالكامل من خوادمنا بشكل نهائي وبدون أي قيود."}
            </p>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "To request complete data deletion, please contact our administrative team directly:"
                : "لطلب حذف البيانات والحساب نهائياً، يمكنك مراسلتنا مباشرة عبر:"}
            </p>
            <div className="mt-3 rounded-2xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-4">
              <p className="text-sm">
                📧 <strong>{isEn ? "Email:" : "البريد الإلكتروني:"}</strong>{" "}
                <a href={`mailto:${payment.supportEmail}`} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                  {payment.supportEmail}
                </a>
              </p>
              <p className="text-sm mt-1">
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

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-10 border-t border-black/5 dark:border-neutral-800 pt-6">
          {isEn
            ? "Tawwerni complies with standard internet safety and privacy frameworks. For any additional compliance queries, reach out to our privacy officer."
            : "منصة طوّرني تلتزم بأعلى معايير حماية وخصوصية البيانات الرقمية المتبعة دولياً."}
        </p>
      </main>
    </div>
  );
}
