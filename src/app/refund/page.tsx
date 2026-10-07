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
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="whitespace-nowrap shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-teal-600 dark:hover:text-teal-300 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 transition-colors"
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
            <span>📜</span>
            <span>{isEn ? "Digital Products & Access Terms" : "سياسة المنتجات الرقمية وشروط الوصول"}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            {isEn ? "Digital Goods & Educational Policy" : "سياسة المنتجات الرقمية والخدمات التعليمية"}
          </h1>
          <p className="mt-2 text-xs text-neutral-400">
            {isEn ? "Last updated: October 2026" : "آخر تحديث: أكتوبر 2026"}
          </p>
        </div>

        {/* High-Clarity Policy Highlight Card */}
        <div className="mb-10 relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-800 via-emerald-800 to-teal-950 p-6 sm:p-8 text-white shadow-2xl border border-teal-400/30">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-2xl shadow-inner">
                💡
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {isEn ? "Try Before You Pay · Transparent Terms" : "جرّب بنفسك مجاناً قبل الدفع · وضوح وشفافية تامة"}
                </h2>
                <p className="text-xs text-teal-100 font-medium">
                  {isEn ? "Free Day 1 Preview on all 100 tracks · Immediate 1-year full access" : "اليوم الأول متاح للتجربة في كافة المسارات · تفعيل فوري واشتراك سنوي كامل (365 يوماً)"}
                </p>
              </div>
            </div>
            <span
              style={{ backgroundColor: '#ffffff', color: '#042f2e', border: '1.5px solid #34d399' }}
              className="inline-block font-black text-xs px-4 py-1.5 rounded-full shadow-md shrink-0 whitespace-nowrap"
            >
              {isEn ? "Free Day 1 Preview" : "اليوم الأول مجاني 100%"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-teal-50 leading-relaxed">
            {isEn
              ? "We provide a 3-day money-back guarantee subject to our fair-consumption condition (the learner must not have completed more than 3 hands-on missions or generated a verified certificate, protecting proprietary digital assets). In addition, Day 1 of every single course is open 100% free with zero payment requirements so you can test the practical value before subscribing."
              : "نقدم ضمان استرجاع كامل المبلغ خلال ٣ أيام من تاريخ الاشتراك وفق شرط الاستهلاك العادل (ألا يكون المتدرب قد أتم أكثر من ٣ مهام تطبيقية أو أصدر شهادة إتمام رقمية، لحماية الأصول الرقمية للمنصة). بالإضافة إلى ذلك، جعلنا اليوم الأول من كل مسار مفتوحاً ومجاناً بالكامل للتجربة العملية قبل اتخاذ أي قرار شراء."}
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
                {isEn ? "Day 1 Free Preview in Every Track" : "اليوم الأول مجاني بالكامل في جميع الـ 100 مسار"}
              </h3>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed ps-12">
              {isEn
                ? "Every registered learner can explore Day 1 of any track without entering any credit card or financial information. You can test our interactive infographics, step-by-step missions, and quiz engine firsthand before paying anything."
                : "يمكن لأي مستخدم مسجل استكشاف وتجربة اليوم الأول من أي مسار تخصصي بدون إدخال أي بطاقة بنكية أو بيانات دفع. يمكنك تقييم أسلوب الشرح التفاعلي وجودة المهام التطبيقية والكويزات بنفسك وبكل راحة قبل اتخاذ قرار الشراء."}
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xs hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30 shadow-xs shrink-0">
                2
              </div>
              <h3 className="text-base font-black text-neutral-900 dark:text-white">
                {isEn ? "Immediate Activation & 1-Year Full Access" : "التفعيل الفوري والوصول الشامل لمدة عام كامل"}
              </h3>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed ps-12">
              {isEn
                ? `Once your payment transfer is verified, your purchased tracks (${pricing.trackPriceEgp} EGP), career paths (${pricing.careerPathPriceEgp} EGP), or All-Access pass (${pricing.allAccessPriceEgp} EGP) are immediately added to your personal learning inventory with full 1-year access (365 days) and zero hidden fees.`
                : `بمجرد تأكيد تحويلك المالي، تتم إضافة المسار التخصصي (${pricing.trackPriceEgp} ج.م) أو المسار المهني (${pricing.careerPathPriceEgp} ج.م) أو باقة الوصول الشامل (${pricing.allAccessPriceEgp} ج.م) فوراً لمخزونك التعليمي مع وصول كامل لمدة سنة كاملة (365 يوماً) بدون أي مصاريف إضافية.`}
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-7 shadow-xs hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black text-sm border border-cyan-500/30 shadow-xs shrink-0">
                3
              </div>
              <h3 className="text-base font-black text-neutral-900 dark:text-white">
                {isEn ? "Payment Errors & Duplicate Transfer Protection" : "معالجة أخطاء التحويل والمبالغ الزائدة"}
              </h3>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm mb-4 leading-relaxed ps-12">
              {isEn
                ? "If you accidentally make a duplicate transfer, send an incorrect amount, or face a network transaction glitch, our dedicated support team is available 24/7 to resolve the issue or immediately return any surplus funds."
                : "إذا قمت بتحويل مكرر عن طريق الخطأ، أو حوّلت مبلغاً بالزيادة، أو واجهت أي تعثر تقني أثناء عملية الدفع، فإن فريق الدعم الفني متواجد على مدار الساعة لحل المشكلة فوراً أو إعادة أي مبالغ محولة بالخطأ بدون أي تأخير."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ps-0 sm:ps-12">
              <a
                href={`https://wa.me/2${payment.supportWhatsapp}?text=${encodeURIComponent("مرحباً، لدي استفسار بخصوص عملية تحويل أو تفعيل في منصة طوّرني")}`}
                className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-950 dark:text-emerald-200 transition-all font-bold text-xs"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-bold">{isEn ? "WhatsApp Direct Support" : "واتساب الدعم السريع"}</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono" dir="ltr">+{payment.supportWhatsapp}</p>
                </div>
              </a>

              <a
                href={`mailto:${payment.supportEmail}?subject=Payment%20Support`}
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
        </div>

        {/* Transparent Pricing Note */}
        <div className="mt-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-black/5 dark:border-white/5 p-4 text-xs text-neutral-600 dark:text-neutral-400 text-center">
          <p>
            {isEn
              ? `Tawwerni offers single one-time payments: ${pricing.trackPriceEgp} EGP per track, ${pricing.careerPathPriceEgp} EGP per career path, or ${pricing.allAccessPriceEgp} EGP for the All-Access pass. There are strictly zero recurring subscriptions or hidden charges.`
              : `أسعار طوّرني واضحة وثابتة: ${pricing.trackPriceEgp} ج.م للمسار التخصصي، ${pricing.careerPathPriceEgp} ج.م للمسار المهني الشامل، و${pricing.allAccessPriceEgp} ج.م لباقة الوصول الشامل — بدون أي اشتراكات متجددة أو رسوم خفية.`}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "Digital Educational Goods Policy" : "سياسة المنتجات والخدمات الرقمية"}</p>
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
