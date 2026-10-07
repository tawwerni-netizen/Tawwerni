"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Tawwerni Global Error]", error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#071310] text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-[#0d221c] border border-teal-500/20 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 flex items-center justify-center text-3xl">
            ⚡
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            طوّرني — جارٍ تحديث النظام
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
            حدثت استجابة غير متوقعة أثناء معالجة الطلب. يمكنك إعادة المحاولة الآن وسيتم استئناف الصفحة تلقائياً.
          </p>
          {error?.digest && (
            <p className="text-[10px] font-mono text-neutral-400 mb-6 bg-black/30 py-1 px-2.5 rounded-lg inline-block border border-white/5">
              Ref: {error.digest}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-neutral-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-teal-500/20 active:scale-98 cursor-pointer"
            >
              <span>🔄 إعادة المحاولة</span>
            </button>
            <a
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm transition-all border border-white/10"
            >
              الصفحة الرئيسية
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
