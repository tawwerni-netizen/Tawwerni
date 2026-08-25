"use client";

import { useMemo, useState } from "react";
import { faqCategories, type FaqItem } from "@/content/faq";
import { payment } from "@/content/brand";

export default function FaqWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    const matches: (FaqItem & { cat: string })[] = [];
    for (const cat of faqCategories) {
      for (const item of cat.items) {
        if (item.q.includes(q) || item.a.includes(q)) matches.push({ ...item, cat: cat.title });
      }
    }
    return matches.slice(0, 12);
  }, [query]);

  const current = faqCategories.find((c) => c.key === activeCat);

  return (
    <>
      {open && (
        <div className="fixed inset-x-3 bottom-24 z-50 mx-auto max-w-sm rounded-2xl bg-white shadow-2xl border border-black/10 flex flex-col overflow-hidden max-h-[70vh] sm:left-4 sm:right-auto sm:inset-x-auto">
          <div className="bg-brand-800 text-white px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-brand-200 flex items-center justify-center text-lg">💡</div>
            <div className="flex-1">
              <div className="font-bold text-sm">مركز المساعدة</div>
              <div className="text-xs text-brand-100">إجابات جاهزة لأشهر الأسئلة</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white text-lg" aria-label="إغلاق">
              ✕
            </button>
          </div>

          <div className="p-3 border-b border-black/5 shrink-0">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveCat(null);
              }}
              placeholder="ابحث عن سؤالك…"
              className="w-full text-sm px-3 py-2 rounded-full bg-neutral-100 outline-none focus:ring-2 ring-brand-200"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {results ? (
              results.length ? (
                <div className="space-y-2">
                  {results.map((item, i) => (
                    <AccordionRow
                      key={i}
                      item={item}
                      isOpen={openItem === `s${i}`}
                      onToggle={() => setOpenItem(openItem === `s${i}` ? null : `s${i}`)}
                      badge={item.cat}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-neutral-500 mb-3">مالقيناش إجابة للسؤال ده</p>
                  <a
                    href={`https://wa.me/2${payment.supportWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block text-xs bg-brand-600 btn-shine text-white rounded-full px-4 py-2 font-bold"
                  >
                    اسألنا على واتساب
                  </a>
                </div>
              )
            ) : current ? (
              <div>
                <button onClick={() => setActiveCat(null)} className="text-xs text-brand-600 mb-3">
                  ‹ كل الأقسام
                </button>
                <div className="space-y-2">
                  {current.items.map((item, i) => (
                    <AccordionRow
                      key={i}
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
                    className="rounded-xl border border-black/10 p-3 text-right hover:border-brand-600 transition"
                  >
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-bold leading-tight">{cat.title}</div>
                    <div className="text-[10px] text-neutral-400 mt-1">{cat.items.length} سؤال</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-black/5 p-2.5 flex gap-2 shrink-0 bg-neutral-50">
            <a
              href={`https://wa.me/2${payment.supportWhatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center text-xs bg-brand-600 btn-shine text-white rounded-full py-2 font-bold"
            >
              كلّمنا واتساب
            </a>
            <a
              href={`mailto:${payment.supportEmail}`}
              className="flex-1 text-center text-xs border border-black/10 rounded-full py-2"
            >
              إيميل
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 left-4 z-40 w-14 h-14 rounded-full bg-brand-600 btn-shine text-white text-2xl shadow-lg flex items-center justify-center active:scale-95 transition"
        aria-label="مركز المساعدة"
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
    <div className="rounded-xl border border-black/10 overflow-hidden">
      <button onClick={onToggle} className="w-full text-right px-3 py-2.5 flex items-start gap-2">
        <span className="flex-1 text-xs font-bold leading-relaxed">{item.q}</span>
        <span className={`text-neutral-400 text-xs transition ${isOpen ? "rotate-180" : ""}`}>▾</span>
      </button>
      {isOpen && (
        <div className="px-3 pb-3 -mt-0.5">
          {badge && <span className="text-[9px] text-neutral-400 block mb-1">{badge}</span>}
          <p className="text-xs text-neutral-600 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  );
}
