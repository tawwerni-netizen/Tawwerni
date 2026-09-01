"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const SHOWN_KEY = "tw_exit_intent_shown";

/**
 * Catches a visitor about to leave — once, and without asking for the sale.
 *
 * "Buy now" to someone already halfway out the door reads as pressure and
 * gets ignored. A question does not: it turns "I'm not sure this is for me"
 * into a two-minute quiz instead of a closed tab. Fires on the classic
 * desktop signal (mouse leaving toward the browser chrome, `clientY <= 0`) —
 * there is no reliable mobile equivalent that isn't itself annoying, so this
 * simply does nothing on touch devices, which is the honest trade-off.
 *
 * Once per browser session (sessionStorage, not localStorage): a visitor who
 * comes back tomorrow gets a fresh chance to see it, but won't get asked
 * twice in the same visit.
 */
export default function ExitIntentPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return;
    } catch {
      /* private browsing — just skip the frequency cap, still show once */
    }

    function trigger(e: MouseEvent) {
      if (e.clientY > 0) return;
      setShow(true);
      try {
        sessionStorage.setItem(SHOWN_KEY, "1");
      } catch {
        /* nothing to persist to — fine, this tab just won't remember */
      }
      document.removeEventListener("mouseleave", trigger);
    }

    document.addEventListener("mouseleave", trigger);
    return () => document.removeEventListener("mouseleave", trigger);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5"
      onClick={() => setShow(false)}
    >
      <div
        className="animate-pop relative w-full max-w-sm rounded-3xl border border-black/5 bg-white p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShow(false)}
          aria-label="إغلاق"
          className="tap absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-50"
        >
          ✕
        </button>

        <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-3xl">
          🤔
        </div>
        <h2 className="mb-2 text-lg font-bold text-neutral-800">
          لسه محتار تبدأ منين؟
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-neutral-500">
          اعمل اختبار المهارات في دقيقتين، وهنقولّك المسار الأنسب ليك بالظبط.
        </p>

        <Link
          href="/quiz"
          onClick={() => setShow(false)}
          className="cta-buy block w-full px-6 py-3.5 text-sm"
        >
          <span>اكتشف مسارك ←</span>
        </Link>
      </div>
    </div>
  );
}
