"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { faqCategories, type FaqItem } from "@/content/faq";
import { payment } from "@/content/brand";
import { HELP_OPEN_EVENT, type HelpOpenDetail } from "@/lib/help-centre";
import { useI18n } from "./LanguageContext";

const CATEGORY_TITLES_EN: Record<string, string> = {
  "getting-started": "Getting Started & Signup",
  "payment": "Payment & Membership",
  "learning": "Learning & Lessons",
  "account-security": "Account & Security",
  "certificates": "Certificates",
  "referrals": "Referral Program",
  "technical": "Technical Support",
  "motivation": "Consistency & Mindset",
  "about": "About Tawwerni",
  "track-ai": "AI & Prompt Engineering",
  "track-claude-pm": "Claude for Project Managers",
  "track-career": "Career Growth & Freelance",
  "track-business": "Business & Startups",
  "track-mindset": "Success Mindset & Habits",
  "track-health": "Health, Energy & Vitality",
};

/** Normalises text for searching */
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
  const { lang } = useI18n();
  const isEn = lang === "en";

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
      setTimeout(() => searchRef.current?.focus(), 60);
    }
    window.addEventListener(HELP_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(HELP_OPEN_EVENT, onOpen);
  }, []);

  // Escape closes it
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
      const catTitle = isEn ? CATEGORY_TITLES_EN[cat.key] ?? cat.title : cat.title;
      for (const item of cat.items) {
        const itemQ = (isEn && item.qEn) ? item.qEn : item.q;
        const itemA = (isEn && item.aEn) ? item.aEn : item.a;
        const fq = fold(itemQ);
        const fa = fold(itemA);
        let score = 0;
        for (const w of words) {
          if (fq.includes(w)) score += 10;
          else if (fa.includes(w)) score += 2;
        }
        if (fq.startsWith(q)) score += 15;
        if (score > 0) scored.push({ item, cat: catTitle, score });
      }
    }
    return scored.sort((a, b) => b.score - a.score).slice(0, 20);
  }, [query, isEn]);

  const current = faqCategories.find((c) => c.key === activeCat);
  const currentTitle = current ? (isEn ? CATEGORY_TITLES_EN[current.key] ?? current.title : current.title) : "";

  return (
    <>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 md:bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? "Help Center" : "مركز المساعدة"}
            className="help-panel animate-rise fixed inset-x-3 bottom-24 z-50 mx-auto flex max-h-[72vh] max-w-lg flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 shadow-2xl md:bottom-8 md:left-8 md:right-auto md:mx-0 md:max-h-[76vh] md:w-[26rem]"
          >
            <div className="flex shrink-0 items-center gap-3 bg-brand-800 text-white px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-200 text-brand-900 text-lg">
                💡
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{isEn ? "Help Center" : "مركز المساعدة"}</div>
                <div className="text-xs text-brand-100">
                  {isEn ? `${total} questions & answers` : `${total} سؤال وجواب`}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-lg text-white/80 hover:text-white px-2"
                aria-label={isEn ? "Close" : "إغلاق"}
              >
                ✕
              </button>
            </div>

            <div className="shrink-0 border-b border-black/5 dark:border-white/10 p-3">
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveCat(null);
                  setOpenItem(null);
                }}
                placeholder={isEn ? "Search your question..." : "ابحث عن سؤالك…"}
                className="w-full rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 px-3.5 py-2 text-sm outline-none ring-brand-200 focus:ring-2"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {results ? (
                results.length ? (
                  <div className="space-y-2">
                    <p className="px-1 pb-1 text-[11px] text-neutral-400">
                      {isEn ? `${results.length} results` : `${results.length} نتيجة`}
                    </p>
                    {results.map((r, i) => (
                      <AccordionRow
                        key={`s${i}`}
                        item={r.item}
                        isEn={isEn}
                        isOpen={openItem === `s${i}`}
                        onToggle={() => setOpenItem(openItem === `s${i}` ? null : `s${i}`)}
                        badge={r.cat}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
                      {isEn ? "No answers found for this search" : "مالقيناش إجابة للسؤال ده"}
                    </p>
                    <a
                      href={`https://wa.me/2${payment.supportWhatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-shine inline-block rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700 transition-colors"
                    >
                      {isEn ? "Ask us on WhatsApp" : "اسألنا على واتساب"}
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
                    className="mb-3 text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1"
                  >
                    <span>{isEn ? "‹ All Categories" : "‹ كل الأقسام"}</span>
                  </button>
                  <p className="mb-2 px-1 text-[11px] text-neutral-400">
                    {current.icon} {currentTitle} · {current.items.length}{" "}
                    {isEn ? "questions" : "سؤال"}
                  </p>
                  <div className="space-y-2">
                    {current.items.map((item, i) => (
                      <AccordionRow
                        key={`c${i}`}
                        item={item}
                        isEn={isEn}
                        isOpen={openItem === `c${i}`}
                        onToggle={() => setOpenItem(openItem === `c${i}` ? null : `c${i}`)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {faqCategories.map((cat) => {
                    const title = isEn ? CATEGORY_TITLES_EN[cat.key] ?? cat.title : cat.title;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => {
                          setActiveCat(cat.key);
                          setOpenItem(null);
                        }}
                        className="tile-press rounded-xl border border-black/10 dark:border-white/10 dark:bg-neutral-800/50 p-3 text-start hover:border-brand-500/40 transition-colors"
                      >
                        <div className="mb-1 text-xl" aria-hidden>
                          {cat.icon}
                        </div>
                        <div className="text-xs font-bold leading-tight text-neutral-900 dark:text-neutral-100">
                          {title}
                        </div>
                        <div className="mt-1 text-[10px] text-neutral-400">
                          {cat.items.length} {isEn ? "questions" : "سؤال"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex shrink-0 gap-2 border-t border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/80 p-2.5">
              <a
                href={`https://wa.me/2${payment.supportWhatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="btn-shine flex-1 rounded-full bg-brand-600 py-2 text-center text-xs font-bold text-white hover:bg-brand-700 transition-colors"
              >
                {isEn ? "Chat on WhatsApp" : "كلّمنا واتساب"}
              </a>
              <a
                href={`mailto:${payment.supportEmail}`}
                className="flex-1 rounded-full border border-black/10 dark:border-white/10 py-2 text-center text-xs text-neutral-700 dark:text-neutral-300 hover:border-black/20 transition-colors"
              >
                {isEn ? "Email Support" : "إيميل"}
              </a>
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="help-fab btn-shine fixed bottom-24 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-lg md:bottom-8 hover:bg-brand-700 transition-transform active:scale-95"
        aria-label={isEn ? "Help Center" : "مركز المساعدة"}
        aria-expanded={open}
      >
        {open ? "✕" : "💡"}
      </button>
    </>
  );
}

function AccordionRow({
  item,
  isEn = false,
  isOpen,
  onToggle,
  badge,
}: {
  item: FaqItem;
  isEn?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
}) {
  const q = isEn && item.qEn ? item.qEn : item.q;
  const a = isEn && item.aEn ? item.aEn : item.a;

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900">
      <button
        onClick={onToggle}
        className={`flex w-full items-start gap-2 px-3 py-2.5 ${isEn ? "text-left" : "text-right"}`}
      >
        <span className="flex-1 text-xs font-bold leading-relaxed text-neutral-800 dark:text-neutral-100">{q}</span>
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
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">{a}</p>
        </div>
      )}
    </div>
  );
}
