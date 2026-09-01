"use client";

import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { brand, referral } from "@/content/brand";
import ShareRow from "@/components/ShareRow";

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
  verifyUrl,
  qrDataUrl,
  backHref,
}: {
  holder: string;
  courseTitle: string;
  lessons: number;
  totalXp: number;
  avgScore: number | null;
  finishedAt: string;
  serial: string;
  verifyUrl: string;
  qrDataUrl: string;
  backHref: string;
}) {
  return (
    <div className="px-4 pt-5 pb-10">
      <div className="no-print mb-4 flex items-center justify-between">
        <Link href={backHref} className="tap inline-block py-1 text-xs text-brand-600">
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

          {/*
            Printed too, not just on-screen — a scanned QR only means
            something on the copy someone actually holds. Anyone who scans it,
            or types the code by hand, lands on a page that confirms this
            exact certificate independently of whoever is showing it to them.
          */}
          <div className="certificate-verify">
            <img src={qrDataUrl} alt="" width={72} height={72} className="certificate-qr" />
            <div className="text-right">
              <p className="certificate-foot-label">تحقق من صحة الشهادة</p>
              <p className="certificate-foot-value" dir="ltr">
                {verifyUrl.replace(/^https?:\/\//, "")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*
        The moment someone finishes a course is the single best moment to ask
        them to tell anyone — they just did the work and they're proud of it.
        Anywhere else on the site this prompt is an interruption; here it is
        the natural next thing.
      */}
      <ShareRow
        className="no-print mx-auto mt-6 max-w-2xl"
        title="قول لأصحابك 🎉"
        note={`خلّصت ${courseTitle} — شارك إنجازك وخد ${referral.commissionEgp} ج.م عن كل واحد يشترك من لينكك.`}
        message={`خلّصت "${courseTitle}" على ${brand.name} 🎓 — درس واحد كل يوم في ٥ دقايق، بالعربي.`}
      />

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
