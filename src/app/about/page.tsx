"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";
import SocialLinks from "@/components/SocialLinks";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useI18n } from "@/components/LanguageContext";

export default function AboutPage() {
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
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 px-3.5 py-1 text-xs font-black text-teal-700 dark:text-teal-300 border border-teal-500/20 mb-3">
            <span>🚀</span>
            <span>{isEn ? "About Tawwerni" : "عن منصة طوّرني"}</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            {isEn ? `Who is behind ${brand.nameEn}?` : `من وراء منصة ${brand.name}؟`}
          </h1>
          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            {isEn ? "Transforming micro-learning into real-world career & income progress." : "حوّل تعلّمك اليومي المصغّر لتقدّم حقيقي في مهاراتك ودخلك."}
          </p>
        </div>

        <div className="space-y-6 mb-10">
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-3">
              {isEn ? "The Story & Vision" : "القصة والرؤية"}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
              {isEn
                ? `${brand.nameEn} started from a fundamental truth: most people don't need another 40-hour video course to bookmark and forget. They need a frictionless daily micro-system they can actually complete. That is why every single track here is structured as 28 days — 5 to 15 minutes of hands-on practice.`
                : `بدأت منصة "${brand.name}" من واقع مؤلم في عالم الكورسات: أغلب الناس مش محتاجة كورس فيديو ٤٠ ساعة يتحفظ في المفضلة ويتنسي. الناس محتاجة نظام يومي مصغر ومركز يقدروا يكملوه بمتعة بدون انقطاع. لهذا السبب تم تصميم كل مسار ليكون ٢٨ يوماً — من ٥ إلى ١٥ دقيقة تطبيق عملي مركز كل يوم.`}
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed">
              {isEn
                ? "The platform includes 100 comprehensive practical tracks across 10 vital disciplines — over 1,480 hands-on lessons with infographic guides and integrated behavioral psychology focus tools."
                : "تضم المنصة ١٠٠ مسار تطبيقي شامل في ١٠ مجالات حيوية (ذكاء اصطناعي، برمجة، بيانات، فريلانس، تسويق، تصميم، بيزنس وغيرها) — أكثر من ١,٤٨٠ درس عملي مدعوم بإنفوجرافيك وأدوات دعم نفسي وتركيز ذهني."}
            </p>
          </div>

          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-6 sm:p-8 shadow-xs">
            <h2 className="mb-4 text-lg font-black text-neutral-900 dark:text-white">
              {isEn ? "Our Core Principles" : "مبادئنا وقيمنا الصارمة"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5">
                <span className="text-xl mb-1 block">🎯</span>
                <strong className="block text-neutral-900 dark:text-white mb-1">
                  {isEn ? "Zero Inflated Numbers" : "مفيش أرقام وهمية"}
                </strong>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {isEn ? "Every track, student, and community story is real." : "كل مسار وتدريب وعضو في المجتمع حقيقي وموثق بالكامل."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5">
                <span className="text-xl mb-1 block">💎</span>
                <strong className="block text-neutral-900 dark:text-white mb-1">
                  {isEn ? "Transparent Fixed Pricing" : "سعر معلن وثابت"}
                </strong>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {isEn ? "1-Year access with zero surprise monthly debits." : "اشتراك سنوي كامل بدون أي خصومات دورية متكررة أو رسوم غير معلنة."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-black/5 dark:border-white/5">
                <span className="text-xl mb-1 block">🎁</span>
                <strong className="block text-neutral-900 dark:text-white mb-1">
                  {isEn ? "Free Day 1 Preview" : "اليوم الأول مجاني دائماً"}
                </strong>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">
                  {isEn ? "Available in all 100 tracks without credit cards." : "مفتوح مجاناً في كل الـ 100 مسار لتجربة المحتوى قبل الشراء."}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200">
                <span className="text-xl mb-1 block">🛡️</span>
                <strong className="block font-bold mb-1">
                  {isEn ? "7-Day Full Guarantee" : "ضمان استرداد كامل خلال 7 أيام"}
                </strong>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  {isEn ? "100% money back if not satisfied, prompt human support." : "استرجاع كامل لأموالك فوراً بدون تعقيد لو لم ترضك التجربة."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Card */}
        <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-white to-white dark:from-teal-950/40 dark:via-neutral-900 dark:to-neutral-900 p-6 sm:p-8 shadow-md">
          <h2 className="text-lg font-black text-neutral-900 dark:text-white mb-2">
            {isEn ? "Direct Human Contact" : "تواصل معنا مباشرة"}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-4">
            {isEn
              ? "No automated bots giving canned responses. When you message us, a real human responds and helps you immediately."
              : "لا نستخدم روبوتات آلية تلقي ردوداً مكررة. عندما تراسلنا، يجيبك شخص حقيقي يستمع لك ويساعدك فوراً."}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <a
              href={`https://wa.me/2${payment.supportWhatsapp}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-4 py-2 hover:brightness-105 transition"
            >
              <span>💬</span>
              <span dir="ltr">+{payment.supportWhatsapp}</span>
            </a>
            <a
              href={`mailto:${payment.supportEmail}`}
              className="inline-flex items-center gap-2 rounded-full bg-teal-600 text-white px-4 py-2 hover:brightness-105 transition"
            >
              <span>📧</span>
              <span>{payment.supportEmail}</span>
            </a>
          </div>
        </div>

        <SocialLinks className="mt-10 justify-center" />
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "Practical Mastery · 100 Tracks" : "التعلم التطبيقي العملي · 100 مسار"}</p>
          <div className="flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
            <Link href="/tracks" className="hover:text-teal-600 transition-colors">{isEn ? "Tracks" : "المسارات"}</Link>
            <span>•</span>
            <Link href="/community" className="hover:text-teal-600 transition-colors">{isEn ? "Community" : "المجتمع"}</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-teal-600 transition-colors">{isEn ? "Terms" : "الشروط والأحكام"}</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">{isEn ? "Privacy" : "سياسة الخصوصية"}</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-teal-600 transition-colors font-semibold text-teal-700 dark:text-teal-400">{isEn ? "7-Day Refund Guarantee" : "ضمان الـ 7 أيام"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
