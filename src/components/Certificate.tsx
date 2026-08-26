"use client";

import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { brand } from "@/content/brand";

const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function arabicDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * The completion certificate.
 *
 * Rendered as HTML rather than a generated image so it stays sharp at any zoom,
 * reads correctly to a screen reader, and prints properly — the print rules at
 * the bottom of globals.css strip the chrome so "print to PDF" gives a clean
 * sheet, which is how most people will actually save this.
 */
export default function Certificate({
  holder,
  courseTitle,
  lessons,
  totalXp,
  avgScore,
  finishedAt,
  serial,
  backHref,
}: {
  holder: string;
  courseTitle: string;
  lessons: number;
  totalXp: number;
  avgScore: number | null;
  finishedAt: string;
  serial: string;
  backHref: string;
}) {
  return (
    <div className="px-4 pt-5 pb-10">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={backHref} className="text-xs text-brand-600">
          ← رجوع للمسار
        </Link>
        <button
          onClick={() => window.print()}
          className="btn-shine rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white"
        >
          🖨️ اطبع / احفظ PDF
        </button>
      </div>

      <div className="certificate animate-rise mx-auto max-w-2xl">
        <div className="certificate-inner">
          <div className="mb-5 flex items-center justify-center gap-2">
            <LogoMark size={40} />
            <span className="text-lg font-bold text-brand-800">
              {brand.name}
              <span className="text-brand-400">.com</span>
            </span>
          </div>

          <p className="certificate-eyebrow">شهادة إتمام</p>

          <div className="certificate-rule" aria-hidden />

          <p className="mb-2 text-sm text-neutral-500">تشهد المنصة بأن</p>
          <h1 className="certificate-name">{holder}</h1>

          <p className="mx-auto mb-1 max-w-md text-sm leading-relaxed text-neutral-600">
            أتمّ بنجاح جميع دروس مسار
          </p>
          <h2 className="certificate-course">{courseTitle}</h2>

          <div className="certificate-stats">
            <Stat value={String(lessons)} label="درس" />
            <Stat value={String(totalXp)} label="نقطة خبرة" />
            {avgScore != null && <Stat value={`${avgScore}%`} label="متوسط الكويزات" />}
          </div>

          <div className="certificate-rule" aria-hidden />

          <div className="certificate-foot">
            <div>
              <p className="certificate-foot-label">تاريخ الإتمام</p>
              <p className="certificate-foot-value">{arabicDate(finishedAt)}</p>
            </div>
            <div className="certificate-seal" aria-hidden>
              🎓
            </div>
            <div>
              <p className="certificate-foot-label">رقم الشهادة</p>
              <p className="certificate-foot-value" dir="ltr">
                {serial}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="no-print mx-auto mt-4 max-w-2xl text-center text-[11px] leading-relaxed text-neutral-400">
        الشهادة دي بتثبت إنك أنهيت البرنامج فعليًا على {brand.domain} — مش مجرد
        مشاهدة. مش شهادة أكاديمية معتمدة من جهة حكومية.
      </p>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="certificate-stat-value">{value}</div>
      <div className="certificate-stat-label">{label}</div>
    </div>
  );
}
