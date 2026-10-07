"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { brand, referral } from "@/content/brand";
import ShareRow from "@/components/ShareRow";

import { useI18n } from "./LanguageContext";

const MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

function formatDate(iso: string, isEn: boolean) {
  const d = new Date(iso);
  if (isEn) {
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }
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
  courseTitleAr,
  courseTitleEn,
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
  courseTitle?: string;
  courseTitleAr?: string;
  courseTitleEn?: string;
  lessons: number;
  totalXp: number;
  avgScore: number | null;
  finishedAt: string;
  serial: string;
  verifyUrl: string;
  qrDataUrl: string;
  backHref: string;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const resolvedTitle = isEn
    ? (courseTitleEn || courseTitle || "")
    : (courseTitleAr || courseTitle || "");

  const [copiedLink, setCopiedLink] = useState(false);

  const linkedInCertUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(resolvedTitle)}&organizationName=${encodeURIComponent("Tawwerni - طوّرني")}&issueYear=${new Date(finishedAt).getFullYear()}&issueMonth=${new Date(finishedAt).getMonth() + 1}&certUrl=${encodeURIComponent(verifyUrl)}&certId=${encodeURIComponent(serial)}`;

  const copyVerify = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="px-4 pt-5 pb-12">
      {/* Top Action Toolbar */}
      <div className="no-print mb-6 mx-auto max-w-2xl flex flex-wrap items-center justify-between gap-2.5">
        <Link href={backHref} className="tap inline-flex items-center gap-1.5 py-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">
          <span>{isEn ? "← Back to Track" : "← رجوع لصفحة المسار"}</span>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={linkedInCertUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0077b5] hover:bg-[#006097] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
            title={isEn ? "Add to your LinkedIn profile" : "أضف الشهادة لحسابك على لينكد إن"}
          >
            <span>💼</span>
            <span>{isEn ? "Add to LinkedIn" : "إضافة إلى LinkedIn"}</span>
          </a>

          <button
            type="button"
            onClick={copyVerify}
            className="rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-xs"
          >
            {copiedLink ? (isEn ? "✓ Copied!" : "✓ تم نسخ الرابط!") : (isEn ? "🔗 Copy Link" : "🔗 نسخ الرابط")}
          </button>

          <button
            onClick={() => window.print()}
            className="btn-shine rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:brightness-110 px-4 py-2 text-xs font-black text-white shadow-md active:scale-95 transition-all"
          >
            {isEn ? "🖨️ Print / Save PDF" : "🖨️ اطبع / احفظ PDF"}
          </button>
        </div>
      </div>

      {/* The Certificate Sheet */}
      <div className="certificate animate-rise mx-auto max-w-2xl shadow-2xl relative">
        <div className="certificate-inner relative overflow-hidden">
          {/* Subtle Guilloche & Radial Corner Accents */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

          {/* Platform Identity */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <LogoMark size={44} />
            <span className="text-xl font-black text-brand-800 dark:text-emerald-300 tracking-tight">
              {isEn ? brand.nameEn : brand.name}
              <span className="text-amber-500 font-mono">.com</span>
            </span>
          </div>

          <p className="certificate-eyebrow font-black tracking-widest text-xs uppercase text-amber-700 dark:text-amber-300">
            {isEn ? "Digital Certificate of Practical Course Completion" : "شهادة إتمام رقمية قابلة للتحقق عبر QR"}
          </p>

          <div className="certificate-rule my-4" aria-hidden />

          <p className="mb-2 text-xs text-neutral-500 dark:text-neutral-400 font-semibold tracking-wide">
            {isEn ? "THIS IS OFFICIALLY PRESENTED TO" : "تَشْهَدُ إِدَارَةُ المَنَصَّةِ بِأَنَّ"}
          </p>

          <h1 className="certificate-name text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white my-2">
            {holder}
          </h1>

          <p className="mx-auto mb-2 max-w-md text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {isEn
              ? "has successfully completed all intensive curriculum milestones and real-world project challenges in"
              : "قَدْ أَتَمَّ بِنَجَاحٍ كَافَّةَ مَرَاحِلِ وَمَهَامِ المَسَارِ التَّطْبِيقِيِّ"}
          </p>

          <h2 className="certificate-course text-xl sm:text-2xl font-black text-brand-700 dark:text-emerald-400 my-2">
            {resolvedTitle}
          </h2>

          {/* Stats Bar */}
          <div className="certificate-stats my-5 grid grid-cols-3 gap-2 bg-neutral-50 dark:bg-neutral-900/60 border border-black/5 dark:border-white/10 rounded-2xl p-3">
            <Stat value={String(lessons)} label={isEn ? "Lessons Completed" : "درسًا تطبيقيًا"} />
            <Stat value={String(totalXp)} label={isEn ? "XP Earned" : "نقطة خبرة مكتسبة"} />
            {avgScore != null && (
              <Stat value={`${avgScore}%`} label={isEn ? "Quiz Mastery" : "متوسط الكويزات"} />
            )}
          </div>

          <div className="certificate-rule my-4" aria-hidden />

          {/* Signatures & Seal */}
          <div className="certificate-foot flex items-center justify-between text-start pt-2">
            <div>
              <p className="certificate-foot-label text-[10px] text-neutral-400 uppercase font-bold">{isEn ? "Completion Date" : "تاريخ الإتمام"}</p>
              <p className="certificate-foot-value text-xs font-bold text-neutral-800 dark:text-neutral-200">{formatDate(finishedAt, isEn)}</p>
            </div>

            <div className="certificate-seal text-3xl sm:text-4xl filter drop-shadow-md" aria-hidden title="Official Verified Seal">
              🎖️
            </div>

            <div className="text-end">
              <p className="certificate-foot-label text-[10px] text-neutral-400 uppercase font-bold">{isEn ? "Certificate Serial ID" : "كود التحقق الرقمي"}</p>
              <p className="certificate-foot-value text-xs font-mono font-black text-emerald-600 dark:text-emerald-400" dir="ltr">
                {serial}
              </p>
            </div>
          </div>

          {/* QR Code Verification Section */}
          <div className="certificate-verify mt-5 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={qrDataUrl}
                alt="Verification QR Code"
                width={68}
                height={68}
                className="certificate-qr rounded-xl border border-black/10 dark:border-white/20 p-1 bg-white"
              />
              <div className={isEn ? "text-left" : "text-right"}>
                <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-200">
                  {isEn ? "Instant Public Verification:" : "التحقق الفوري من صحة الشهادة:"}
                </p>
                <p className="text-[10px] text-neutral-500 font-mono" dir="ltr">
                  {verifyUrl.replace(/^https?:\/\//, "")}
                </p>
                <p className="text-[9px] text-neutral-400 mt-0.5">
                  {isEn ? "Scan QR code or click link to verify graduate credentials" : "امسح الكود بكاميرا الموبايل لتأكيد صحة وتاريخ التخرج"}
                </p>
              </div>
            </div>

            <div className="hidden sm:block text-end">
              <p className="text-[10px] text-neutral-400 font-bold">{isEn ? "Authorized by" : "اعتماد منصة"}</p>
              <p className="text-xs font-black text-neutral-800 dark:text-neutral-200">Tawwerni.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share With Friends Row */}
      <ShareRow
        className="no-print mx-auto mt-6 max-w-2xl"
        title={isEn ? "Share your achievement with friends 🎉" : "شارك إنجازك وافخر بشهادتك 🎉"}
        note={
          isEn
            ? `Finished ${resolvedTitle} — Share your achievement and earn ${referral.commissionEgp} EGP for every friend who joins.`
            : `أتممت ${resolvedTitle} — شارك إنجازك وشهادتك مع أصدقائك واكسب ${referral.commissionEgp} ج.م عن كل مشترك جديد.`
        }
        message={
          isEn
            ? `I just finished "${resolvedTitle}" and earned my verified certificate on ${brand.nameEn}.com! 🎓 Check it out: ${verifyUrl}`
            : `أتممت مسار "${resolvedTitle}" وحصلت على شهادة الإتمام الرقمية الموثقة من منصة ${brand.name}.com! 🎓 تقدر تتحقق من الشهادة هنا: ${verifyUrl}`
        }
      />

      <p className="no-print mx-auto mt-4 max-w-2xl text-center text-[11px] leading-relaxed text-neutral-400">
        {isEn
          ? `This verified certificate confirms hands-on mastery on ${brand.domain}. Permanent verification record hosted securely at ${brand.domain}.`
          : `هذه الشهادة تثبت إتمام التطبيق العملي لكافة دروس وتحديات المسار على ${brand.domain}. سجل التحقق دائم ومتاح لأصحاب العمل والعملاء.`}
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
