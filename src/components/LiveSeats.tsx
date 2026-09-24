"use client";

import { useI18n } from "./LanguageContext";

export default function LiveSeats({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-4 py-2 text-xs font-semibold text-teal-800 dark:text-teal-300 transition-colors shadow-2xs ${className}`}
    >
      <span aria-hidden className="animate-pulse">
        🎁
      </span>
      <span>
        {isEn ? (
          <>
            <b>Day 1</b> of ALL 100 tracks is open — 100% free, no credit card required
          </>
        ) : (
          <>
            <b>اليوم الأول</b> من كل الـ ١٠٠ مسار مفتوح مجانًا — جرّب عمليًا بدون أي بطاقة بنكية
          </>
        )}
      </span>
    </div>
  );
}
