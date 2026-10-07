"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for diagnostics
    console.error("[Tawwerni App Error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl">
        <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-3xl">
          ⚡
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-2">
          حدث تحديث في جلسة التعلّم
        </h2>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
          نظام طوّرني يقوم بمزامنة تقدمك حالياً. يمكنك إعادة تحميل الصفحة للمتابعة مباشرة، أو العودة للصفحة الرئيسية.
        </p>

        {error?.digest && (
          <p className="text-[10px] font-mono text-neutral-400 mb-6 bg-neutral-100 dark:bg-neutral-800/60 py-1 px-2 rounded-lg inline-block">
            رمز التحقق: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-teal-600/20 active:scale-98 cursor-pointer"
          >
            <span>🔄</span>
            <span>إعادة المحاولة الآن</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs sm:text-sm font-bold transition-all border border-neutral-200 dark:border-neutral-700"
          >
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
