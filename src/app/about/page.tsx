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
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors"
    >
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 text-sm leading-relaxed">
        <h1 className="mb-6 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          {isEn ? `Who is behind ${brand.name}?` : `من وراء ${brand.name}؟`}
        </h1>

        <p className="mb-5 text-neutral-700 dark:text-neutral-300">
          {isEn
            ? `${brand.name} started from a fundamental truth: most people don't need another 40-hour video course to bookmark and forget. They need a frictionless daily micro-system they can actually complete. That is why every single track here is structured as 28 days × 5 to 15 minutes of hands-on practice.`
            : `${brand.name} بدأ من ملاحظة بسيطة: أغلب الناس مش محتاجة كورس تاني تحفظه وتسيبه — محتاجة نظام يومي صغير يقدر يكمّله فعلًا. عشان كده كل مسار هنا مقسّم ٢٨ يومًا × ٥ إلى ١٥ دقيقة، مش ساعات فيديو طويلة حد بيتحمس لها وما يكملهاش.`}
        </p>

        <p className="mb-5 text-neutral-700 dark:text-neutral-300">
          {isEn
            ? "The platform includes 100 comprehensive practical tracks across 10 vital disciplines — over 1,480 hands-on lessons with infographic guides and integrated behavioral psychology focus tools."
            : "المنصة تضم ١٠٠ مسار تطبيقي في ١٠ مجالات حيوية، مكتوبة بالكامل خطوة بخطوة — أكثر من ١,٤٨٠ درس عملي، مش كلام نظري مكرر."}
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "Our Core Principles" : "المبادئ والقيم التي نعمل بها"}
        </h2>
        <ul className="mb-5 list-disc space-y-2 ps-5 text-neutral-700 dark:text-neutral-300">
          <li>
            {isEn
              ? "Zero inflated or fake numbers — every track, student, and community story is real."
              : "مفيش أرقام مختلقة — كل مسار وتدريب وعضو في المجتمع حقيقي وموثق."}
          </li>
          <li>
            {isEn
              ? "Zero fake countdowns or false urgency — lifetime membership is transparent and fixed."
              : "مفيش عد تنازلي وهمي أو خداع — السعر معلن وواضح وثابت."}
          </li>
          <li>
            {isEn
              ? "Day 1 of every track is 100% free with no credit card required."
              : "اليوم الأول مجاني تمامًا في كل مسار من غير بطاقة بنكية ومن غير شروط."}
          </li>
          <li>
            {isEn
              ? "14-Day Money-Back Guarantee with prompt human support."
              : "ضمان استرداد كامل خلال ١٤ يومًا مع دعم بشري فوري."}
          </li>
        </ul>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "Contact Us" : "تواصل معنا"}
        </h2>
        <p className="mb-3 text-neutral-700 dark:text-neutral-300">
          {isEn
            ? "No automated bots giving canned responses. When you message us, a real human responds."
            : "مفيش روبوتات آلية بترد برسائل مكررة. لو كلمتنا، بيرد عليك شخص فعلي بيسمعك ويساعدك."}
        </p>
        <p className="mb-6 text-neutral-700 dark:text-neutral-300">
          WhatsApp:{" "}
          <a
            href={`https://wa.me/2${payment.supportWhatsapp}`}
            dir="ltr"
            className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            +{payment.supportWhatsapp}
          </a>{" "}
          · Email:{" "}
          <a href={`mailto:${payment.supportEmail}`} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
            {payment.supportEmail}
          </a>
        </p>

        <SocialLinks className="mt-8" />
      </main>
    </div>
  );
}
