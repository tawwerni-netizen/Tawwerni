import type { Metadata } from "next";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand } from "@/content/brand";
import { findCertificateByCode } from "@/lib/certificate";

export const metadata: Metadata = {
  title: "التحقق من شهادة",
  robots: { index: false, follow: true },
};

const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function arabicDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * The page a QR code or a typed-in code lands on.
 *
 * Public and unauthenticated on purpose — the person checking is usually not
 * the learner. An employer scanning a printed certificate, or someone typing
 * the code off it, needs to land somewhere with no login wall in the way.
 * Only what a certificate already shows is repeated here: no email, no phone,
 * nothing that was not already on the printed page.
 */
export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await findCertificateByCode(code.toUpperCase());

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href="/" className="tap px-2 py-2 text-xs text-neutral-500">
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-col items-center px-5 py-14 text-center">
        {cert ? (
          <>
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-3xl">
              ✅
            </div>
            <p className="mb-1 text-xs font-bold tracking-wide text-brand-600">
              شهادة حقيقية
            </p>
            <h1 className="mb-6 text-xl font-bold text-neutral-800">
              الشهادة دي صادرة فعليًا من {brand.name}
            </h1>

            <div className="w-full rounded-3xl border border-black/5 bg-white p-6 text-right">
              <Row label="الاسم" value={cert.holderName} />
              <Row label="المسار" value={cert.courseTitle} />
              <Row label="عدد الدروس" value={String(cert.lessons)} />
              {cert.avgScore != null && <Row label="متوسط الكويزات" value={`${cert.avgScore}%`} />}
              <Row label="تاريخ الإصدار" value={arabicDate(cert.issuedAt)} />
              <Row label="رقم الشهادة" value={cert.code} mono last />
            </div>

            <p className="mt-6 text-xs leading-relaxed text-neutral-400">
              دي شهادة إتمام من {brand.name} بتثبت إن صاحبها خلّص المسار ده فعليًا
              على المنصة — مش شهادة أكاديمية معتمدة من جهة حكومية.
            </p>
          </>
        ) : (
          <>
            <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-neutral-100 text-3xl grayscale">
              ❌
            </div>
            <h1 className="mb-2 text-xl font-bold text-neutral-800">
              مفيش شهادة بالكود ده
            </h1>
            <p className="text-sm leading-relaxed text-neutral-500">
              اتأكد إنك كتبت الكود صح، أو امسح الـQR كود من على الشهادة نفسها
              تاني.
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
    <div className={`flex items-center justify-between py-2.5 ${last ? "" : "border-b border-black/5"}`}>
      <span className="text-xs text-neutral-400">{label}</span>
      <span className={`text-sm font-bold text-neutral-800 ${mono ? "font-mono" : ""}`} dir={mono ? "ltr" : undefined}>
        {value}
      </span>
    </div>
  );
}
