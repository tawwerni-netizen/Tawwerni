"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "./LanguageContext";

const SHOWN_KEY = "tw_exit_intent_shown";

export default function ExitIntentPrompt() {
  const [show, setShow] = useState(false);
  const { lang } = useI18n();
  const isEn = lang === "en";

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return;
    } catch {
      /* private browsing */
    }

    function trigger(e: MouseEvent) {
      if (e.clientY > 0) return;
      setShow(true);
      try {
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {
        /* storage unavailable */
      }
      document.removeEventListener("mouseleave", trigger);
    }

    document.addEventListener("mouseleave", trigger);
    return () => document.removeEventListener("mouseleave", trigger);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-5 backdrop-blur-xs animate-fade-in"
      onClick={() => setShow(false)}
    >
      <div
        dir={isEn ? "ltr" : "rtl"}
        className="relative w-full max-w-sm rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 text-center shadow-2xl transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShow(false)}
          aria-label={isEn ? "Close" : "إغلاق"}
          className={`tap absolute top-3 ${isEn ? "right-3" : "left-3"} grid h-8 w-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors`}
        >
          ✕
        </button>

        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-3xl">
          🤔
        </div>
        <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "Unsure where to begin?" : "محتار تبدأ من أي مهارة؟"}
        </h2>
        <p className="mb-5 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {isEn
            ? "Take our 2-minute skills assessment to identify the most profitable track for your goals."
            : "خذ تقييم المهارات في دقيقتين فقط، وسنرشح لك المسار الأكثر توافقًا مع طموحك ووقتك."}
        </p>

        <Link
          href="/quiz"
          onClick={() => setShow(false)}
          className="cta-buy block w-full px-6 py-3.5 text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-98 transition-all"
        >
          <span>{isEn ? "Discover Your Path Now →" : "اكتشف مسارك مجانًا ←"}</span>
        </Link>
      </div>
    </div>
  );
}
