"use client";

import { useI18n } from "./LanguageContext";

export default function LearnHeader() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div className="mb-6" dir={isEn ? "ltr" : "rtl"}>
      <h1 className="text-2xl font-black md:text-3xl text-neutral-900 dark:text-white">
        {isEn ? "The 100 Professional Tracks Catalog" : "كتالوج الـ ١٠٠ مسار الاحترافي"}
      </h1>
      <p className="mt-1.5 text-sm text-neutral-600 dark:text-neutral-400">
        {isEn
          ? "Lifetime access to all 100 tracks — pick your path and build skills with 5-minute daily practical actions."
          : "وصول مفتوح لجميع المسارات مدى الحياة — اختر مسارك وانطلق بخطوات عملية ٥ دقائق يومياً"}
      </p>
    </div>
  );
}
