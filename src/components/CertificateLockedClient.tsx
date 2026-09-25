"use client";

import Link from "next/link";
import { useI18n } from "./LanguageContext";

export default function CertificateLockedClient({
  courseSlug,
  courseTitleAr,
  courseTitleEn,
  done,
  total,
  unlocked,
}: {
  courseSlug: string;
  courseTitleAr: string;
  courseTitleEn: string;
  done: number;
  total: number;
  unlocked: boolean;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const remaining = Math.max(0, total - done);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="px-4 pt-6 pb-10">
      <Link href={`/app/learn/${courseSlug}`} className="text-xs text-brand-600">
        {isEn ? "← Back to Track" : "← رجوع للمسار"}
      </Link>

      <div className="animate-rise mx-auto mt-6 max-w-md rounded-3xl border border-black/5 bg-white dark:bg-neutral-900 p-6 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-3xl grayscale">
          🎓
        </div>
        <h1 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">
          {isEn ? "Certificate is still locked" : "الشهادة لسه مقفولة"}
        </h1>
        <p className="mb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
          {isEn ? (
            <>
              The certificate unlocks when you complete the entire track. You completed{" "}
              <b className="text-brand-600">
                {done} of {total}
              </b>{" "}
              lessons — {remaining} left.
            </>
          ) : (
            <>
              الشهادة بتتفتح لما تخلّص المسار كله. إنت خلّصت{" "}
              <b className="text-brand-600">
                {done} من {total}
              </b>{" "}
              درس — فاضلك {remaining}.
            </>
          )}
        </p>

        <div className="progress-track mb-5">
          <span className="progress-fill" style={{ width: `${percent}%` }} />
        </div>

        <Link
          href={`/app/learn/${courseSlug}`}
          className="btn-shine block rounded-full bg-brand-600 py-3 text-sm font-bold text-white shadow-md hover:bg-brand-700 transition-colors"
        >
          {isEn
            ? unlocked
              ? "Continue Track →"
              : "Unlock Track →"
            : unlocked
            ? "كمّل المسار ←"
            : "افتح المسار ←"}
        </Link>
      </div>
    </div>
  );
}
