"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand } from "@/content/brand";
import { useI18n } from "./LanguageContext";

interface CertData {
  holderName: string;
  courseTitle: string;
  courseTitleEn?: string;
  lessons: number;
  avgScore: number | null;
  issuedAt: string;
  code: string;
}

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function formatVerifyDate(iso: string, isEn: boolean) {
  const d = new Date(iso);
  if (isEn) {
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
  return `${d.getDate()} ${MONTHS_AR[d.getMonth()]} ${d.getFullYear()}`;
}

export default function VerifyClient({ cert }: { cert: CertData | null }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href="/" className="tap px-2 py-2 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
            {isEn ? "Home" : "الرئيسية"}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-col items-center px-5 py-14 text-center">
        {cert ? (
          <>
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 dark:bg-brand-950 text-3xl">
              ✅
            </div>
            <p className="mb-1 text-xs font-bold tracking-wide text-brand-600 dark:text-brand-400">
              {isEn ? "Verified Authentic Certificate" : "شهادة حقيقية موثقة"}
            </p>
            <h1 className="mb-6 text-xl font-bold text-neutral-800 dark:text-neutral-100">
              {isEn
                ? `This certificate was officially issued by ${brand.name}`
                : `الشهادة دي صادرة فعليًا من ${brand.name}`}
            </h1>

            <div className="w-full rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-xs text-start">
              <Row label={isEn ? "Name" : "الاسم"} value={cert.holderName} />
              <Row
                label={isEn ? "Track" : "المسار"}
                value={isEn ? (cert.courseTitleEn || cert.courseTitle) : cert.courseTitle}
              />
              <Row label={isEn ? "Completed Lessons" : "عدد الدروس"} value={String(cert.lessons)} />
              {cert.avgScore != null && (
                <Row label={isEn ? "Quiz Average" : "متوسط الكويزات"} value={`${cert.avgScore}%`} />
              )}
              <Row label={isEn ? "Issue Date" : "تاريخ الإصدار"} value={formatVerifyDate(cert.issuedAt, isEn)} />
              <Row label={isEn ? "Certificate Code" : "رقم الشهادة"} value={cert.code} mono last />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-neutral-400">
              {isEn
                ? `This completion certificate from ${brand.name} confirms the learner has successfully finished the curriculum on the platform. Not an accredited government degree.`
                : `دي شهادة إتمام من ${brand.name} بتثبت إن صاحبها خلّص المسار ده فعليًا على المنصة — مش شهادة أكاديمية معتمدة من جهة حكومية.`}
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-3xl grayscale">
              ❌
            </div>
            <h1 className="mb-2 text-xl font-bold text-neutral-800 dark:text-neutral-100">
              {isEn ? "No certificate found with this code" : "مفيش شهادة بالكود ده"}
            </h1>
            <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "Please make sure you entered the code correctly or scan the QR code from the certificate again."
                : "اتأكد إنك كتبت الكود صح، أو امسح الـQR كود من على الشهادة نفسها تاني."}
            </p>
          </>
        )}
      </main>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  last,
}: {
  label: string;
  value: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 ${
        last ? "" : "border-b border-black/5 dark:border-white/5"
      }`}
    >
      <span className="text-xs text-neutral-400">{label}</span>
      <span
        className={`text-sm font-bold text-neutral-800 dark:text-neutral-200 ${
          mono ? "font-mono" : ""
        }`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}
