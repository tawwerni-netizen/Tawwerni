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
      className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-[#070e0c] text-neutral-800 dark:text-neutral-200 transition-colors selection:bg-teal-500 selection:text-white"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 dark:bg-teal-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[30%] -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-[140px]" />

      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <LogoLink size={34} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="px-3 py-1.5 rounded-full text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-teal-600 dark:hover:text-teal-400 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-colors"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-12 text-sm leading-relaxed">
        {/* Top Tag */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 px-3.5 py-1 text-xs font-black text-teal-700 dark:text-teal-300 border border-teal-500/20 mb-3">
            <span>🛡️</span>
            <span>{isEn ? "100% Money-Back Guarantee" : "ضمان راحة البال واسترداد الأموال"}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            {isEn ? "Refund Policy & Guarantee" : "سياسة الاسترجاع والضمان"}
          </h1>
          <p className="mt-2 text-xs text-neutral-400">
            {isEn ? "Last updated: October 2026" : "آخر تحديث: أكتوبر 2026"}
          </p>
        </div>

        {/* 7-Day Guarantee High-Dopamine Card */}
        <div className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-900 p-6 sm:p-8 text-white shadow-2xl border border-teal-400/30">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-2xl shadow-inner">
                ⚡
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {isEn ? "7-Day 100% Money-Back Guarantee" : "ضمان استرداد كامل خلال 7 أيام"}
                </h2>
                <p className="text-xs text-teal-100 font-medium">
                  {isEn ? "Zero friction · No questions asked" : "بدون أي تعقيد أو مماطلة · حقك مضمون بالكامل"}
                </p>
              </div>
            </div>
            <span
              style={{ backgroundColor: '#ffffff', color: '#042f2e', border: '1.5px solid #34d399' }}
              className="pill-guarantee-white inline-block font-black text-xs px-4 py-1.5 rounded-full shadow-md shrink-0"
            >
              {isEn ? "7-Day Peace of Mind Guarantee" : "7 أيام تجربة واسترداد كامل"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-teal-50 leading-relaxed">
            {isEn
              ? "We stand behind the practical quality of our 100 tracks. If you activate your membership and feel the learning experience is not for you, simply contact our direct support team within 7 days of activation, and we will issue a full 100% refund immediately."
              : "نحن على ثقة كاملة في القيمة التطبيقية لمساراتنا. إذا اشتركت في المنصة وشعرت خلال 7 أيام من التفعيل أن المحتوى أو الأسلوب غير مناسب لك لأي سبب، فقط راسلنا وسنعيد لك كامل المبلغ المدفوع فوراً بدون أي استجواب أو تعقيد."}
          </p>
        </div>

        <div className="space-y-6">
          {/* Card 1 */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xs hover:border-teal-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-sm border border-teal-500/30 shadow-xs shrink-0">
                1
              </div>
              <h3 className="text-base font-black text-neutral-900 dark:text-white">
                {isEn ? "Free Day 1 Preview Before You Pay" : "اليوم الأول مجاني بالكامل قبل أن تدفع"}
              </h3>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed ps-12">
              {isEn
                ? "To ensure complete satisfaction, Day 1 of every single one of our 100 tracks is open 100% free for all registered users without credit card requirements. You can test our interactive infographics, focus tools, and lesson quizzes firsthand."
                : "لتتأكد من مناسبة المنصة لك قبل الدفع، جعلنا اليوم الأول من كل مسار من الـ 100 مسار مفتوحاً ومجانياً تماماً بدون الحاجة لبطاقة بنكية. يمكنك تجربة أسلوب الشرح التفاعلي والمهام اليومية واختبار الكويزات بنفسك."}
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xs hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30 shadow-xs shrink-0">
                2
              </div>
              <h3 className="text-base font-black text-neutral-900 dark:text-white">
                {isEn ? "How to Request Your Refund" : "كيف تطلب استرداد المبلغ؟"}
              </h3>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-4 leading-relaxed ps-12">
              {isEn
                ? "No lengthy dispute tickets or automated bots. Simply message our human support with your registered email and transfer details:"
                : "لا توجد أي استمارات معقدة أو إجراءات مطولة. كل ما عليك هو مراسلة فريق الدعم البشري المباشر بإيميلك المسجل وبيانات التحويل:"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ps-0 sm:ps-12">
              <a
                href={`https://wa.me/2${payment.supportWhatsapp}?text=${encodeURIComponent("مرحباً، أود طلب استرداد الاشتراك وفق ضمان الـ 7 أيام")}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 transition-all font-bold text-xs"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-bold">{isEn ? "WhatsApp Direct Support" : "واتساب الدعم السريع"}</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono" dir="ltr">+{payment.supportWhatsapp}</p>
                </div>
              </a>

              <a
                href={`mailto:${payment.supportEmail}?subject=Refund%20Request`}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-950 dark:text-teal-200 transition-all font-bold text-xs"
              >
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-bold">{isEn ? "Official Support Email" : "البريد الإلكتروني الرسمي"}</p>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 font-mono">{payment.supportEmail}</p>
                </div>
              </a>
            </div>
          </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xs hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm border border-cyan-500/30 shadow-xs shrink-0">
                  3
                </div>
                <h3 className="text-base font-black text-neutral-900 dark:text-white">
                  {isEn ? "Instant & Frictionless 100% Refund" : "استرداد فوري وسريع وبدون أي تعقيد"}
                </h3>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed ps-12">
                {isEn
                  ? "Your learning investment is 100% risk-free. If you decide Tawwerni isn't the perfect fit within your first 7 days, our dedicated human support team will promptly issue a full 100% refund directly back to your payment method (Vodafone Cash, InstaPay, or Bank Card) with zero hassle and no questions asked."
                  : "حقك في تجربة المنصة مكفول بنسبة 100% وبدون أي مخاطرة مالية. إذا طلبت استرجاع المبلغ خلال الـ 7 أيام الأولى من التفعيل، يتم رد المبلغ فوراً وبنفس وسيلة الدفع (فودافون كاش، إنستاباي، أو البطاقة البنكية) بكل سلاسة وسرعة وبدون أي شروط تعجيزية أو أسئلة محرجة."}
              </p>
              <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 ps-12 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                <p>
                  {isEn
                    ? "⚖️ Digital Assets Fair-Use Standard: The 7-day satisfaction guarantee applies to platform exploration and daily track learning. In accordance with standard digital asset fair-use policies, accounts that have already exported or downloaded offline master file packages (such as the comprehensive 10,000 Prompts Database or open-format legal contract archives) are not eligible for a refund, as these digital assets cannot be revoked once downloaded."
                    : "⚖️ معيار الاستخدام العادل للأصول الرقمية: صُمم ضمان الاسترداد لتجربة المنصة ومحتوى المسارات التعليمية بكل طمأنينة. ووفقاً للعرف القانوني المعتمد للأصول الرقمية، يشترط للاستفادة من ضمان الـ 7 أيام عدم قيام الحساب بتنزيل أو تصدير الحزم الرقمية الكاملة القابلة للحفظ الدائم خارج المنصة (مثل قاعدة بيانات الـ 10,000 برومبت الشاملة أو ملفات العقود المفتوحة)، حيث تعتبر هذه الأصول مستهلكة نهائياً بمجرد تنزيلها لحماية حقوق الملكية الفكرية ومنع الاستغلال غير العادل."}
                </p>
              </div>
            </div>
        </div>

        {/* Transparent Pricing Note */}
        <div className="mt-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-black/5 dark:border-white/5 p-4 text-xs text-neutral-600 dark:text-neutral-400 text-center">
          <p>
            {isEn
              ? `Tawwerni membership is a single transparent payment of ${pricing.priceEgp} EGP granting 1 full year of unlimited access. There are strictly zero recurring subscriptions or hidden rebills.`
              : `اشتراك طوّرني هو دفعة واحدة فقط بقيمة ${pricing.priceEgp} ج.م لعام كامل لجميع الـ 100 مسار — لا توجد أي اشتراكات دورية خفية أو تجديد تلقائي للبطاقات.`}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "7-Day Peace of Mind Guarantee" : "ضمان راحة البال خلال 7 أيام"}</p>
          <div className="flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
            <Link href="/about" className="hover:text-teal-600 transition-colors">{isEn ? "About Us" : "من نحن"}</Link>
            <span>•</span>
            <Link href="/tracks" className="hover:text-teal-600 transition-colors">{isEn ? "Tracks" : "المسارات"}</Link>
            <span>•</span>
            <Link href="/community" className="hover:text-teal-600 transition-colors">{isEn ? "Community" : "المجتمع"}</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-teal-600 transition-colors">{isEn ? "Terms" : "الشروط والأحكام"}</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">{isEn ? "Privacy" : "سياسة الخصوصية"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
