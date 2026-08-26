"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { faqCategories, type FaqItem } from "@/content/faq";
import { payment } from "@/content/brand";
import { HELP_OPEN_EVENT, type HelpOpenDetail } from "@/lib/help-centre";

/** Normalises Arabic so a search for "الاشتراك" also finds "اشتراك". */
function fold(s: string) {
  return s
    .replace(/[ً-ْـ]/g, "") // harakat and tatweel
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase();
}

export default function FaqWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Anything on the site can ask for this panel — see lib/help-centre.
  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<HelpOpenDetail>).detail ?? {};
      setOpen(true);
      setQuery(detail.query ?? "");
      setActiveCat(detail.category ?? null);
      setOpenItem(null);
      // Let the panel mount before reaching for the field.
      setTimeout(() => searchRef.current?.focus(), 60);
    }
    window.addEventListener(HELP_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(HELP_OPEN_EVENT, onOpen);
  }, []);

  // Escape closes it — expected of anything that covers the page.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const total = useMemo(
    () => faqCategories.reduce((s, c) => s + c.items.length, 0),
    []
  );

  const results = useMemo(() => {
    const q = fold(query.trim());
    if (q.length < 2) return null;
    const words = q.split(/\s+/).filter(Boolean);

    const scored: { item: FaqItem; cat: string; score: number }[] = [];
    for (const cat of faqCategories) {
      for (const item of cat.items) {
        const fq = fold(item.q);
        const fa = fold(item.a);
        // A hit in the question is worth far more than one in the answer —
        // otherwise a common word in a long answer outranks an exact title.
        let score = 0;
        for (const w of words) {
          if (fq.includes(w)) score += 10;
          else if (fa.includes(w)) score += 2;
        }
        if (fq.startsWith(q)) score += 15;
        if (score > 0) scored.push({ item, cat: cat.title, score });
      }
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, 20);
  }, [query]);

  const current = faqCategories.find((c) => c.key === activeCat);

  return (
    <>
      {open && (
        <>
          {/* A dimmed ground: on a phone this panel is most of the screen, and
              tapping outside should close it. */}
          <div
            className="fixed inset-0 z-40 bg-black/30 md:bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="مركز المساعدة"
            className="help-panel animate-rise fixed inset-x-3 bottom-24 z-50 mx-auto flex max-h-[72vh] max-w-lg flex-col overflow-hidden rounded-2xl border border-black/10 shadow-2xl md:bottom-8 md:left-8 md:right-auto md:mx-0 md:max-h-[76vh] md:w-[26rem]"
          >
            <div className="flex shrink-0 items-center gap-3 bg-brand-800 px-4 py-3 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-200 text-lg">
                💡
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">مركز المساعدة</div>
                <div className="text-xs text-brand-100">{total} سؤال وجواب</div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-lg text-white/80 hover:text-white"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            <div className="shrink-0 border-b border-black/5 p-3">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveCat(null);
                  setOpenItem(null);
                }}
                placeholder="ابحث عن سؤالك…"
                className="w-full rounded-full bg-neutral-100 px-3 py-2 text-sm outline-none ring-brand-200 focus:ring-2"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {results ? (
                results.length ? (
                  <div className="space-y-2">
                    <p className="px-1 pb-1 text-[11px] text-neutral-400">
                      {results.length} نتيجة
                    </p>
                    {results.map((r, i) => (
                      <AccordionRow
                        key={`s${i}`}
                        item={r.item}
                        isOpen={openItem === `s${i}`}
                        onToggle={() => setOpenItem(openItem === `s${i}` ? null : `s${i}`)}
                        badge={r.cat}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="mb-3 text-sm text-neutral-500">مالقيناش إجابة للسؤال ده</p>
                    <a
                      href={`https://wa.me/2${payment.supportWhatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-shine inline-block rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white"
                    >
                      اسألنا على واتساب
                    </a>
                  </div>
                )
              ) : current ? (
                <div>
                  <button
                    onClick={() => {
                      setActiveCat(null);
                      setOpenItem(null);
                    }}
                    className="mb-3 text-xs font-bold text-brand-600"
                  >
                    ‹ كل الأقسام
                  </button>
                  <p className="mb-2 px-1 text-[11px] text-neutral-400">
                    {current.icon} {current.title} · {current.items.length} سؤال
                  </p>
                  <div className="space-y-2">
                    {current.items.map((item, i) => (
                      <AccordionRow
                        key={`c${i}`}
                        item={item}
                        isOpen={openItem === `c${i}`}
                        onToggle={() => setOpenItem(openItem === `c${i}` ? null : `c${i}`)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setActiveCat(cat.key);
                        setOpenItem(null);
                      }}
                      className="tile-press rounded-xl border border-black/10 p-3 text-right"
                    >
                      <div className="mb-1 text-xl" aria-hidden>
                        {cat.icon}
                      </div>
                      <div className="text-xs font-bold leading-tight">{cat.title}</div>
                      <div className="mt-1 text-[10px] text-neutral-400">
                        {cat.items.length} سؤال
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-black/5 bg-neutral-50 p-2.5">
              <a
                href={`https://wa.me/2${payment.supportWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-shine flex-1 rounded-full bg-brand-600 py-2 text-center text-xs font-bold text-white"
              >
                كلّمنا واتساب
              </a>
              <a
                href={`mailto:${payment.supportEmail}`}
                className="flex-1 rounded-full border border-black/10 py-2 text-center text-xs"
              >
                إيميل
              </a>
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="help-fab btn-shine fixed bottom-24 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-lg md:bottom-8"
        aria-label="مركز المساعدة"
        aria-expanded={open}
      >
        {open ? "✕" : "💡"}
      </button>
    </>
  );
}

function AccordionRow({
  item,
  isOpen,
  onToggle,
  badge,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/10">
      <button onClick={onToggle} className="flex w-full items-start gap-2 px-3 py-2.5 text-right">
        <span className="flex-1 text-xs font-bold leading-relaxed">{item.q}</span>
        <span
          className={`shrink-0 text-xs text-neutral-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {isOpen && (
        <div className="-mt-0.5 px-3 pb-3">
          {badge && <span className="mb-1 block text-[9px] text-neutral-400">{badge}</span>}
          <p className="text-xs leading-relaxed text-neutral-600">{item.a}</p>
        </div>
      )}
    </div>
  );
}
