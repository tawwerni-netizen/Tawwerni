"use client";

import { useI18n } from "./LanguageContext";

/**
 * The numbers that answer "how is the business doing" without scrolling.
 *
 * Full bilingual support (Arabic / English) with adaptive dark/light styling.
 */
export type AdminStat = {
  label: string;
  labelEn?: string;
  value: string | number;
  valueEn?: string | number;
  hint?: string;
  hintEn?: string;
  tone?: "neutral" | "good" | "warn";
  icon?: string;
};

const STAT_LABELS: Record<string, string> = {
  "مستني مراجعة": "Pending Review",
  "مشتركين": "Subscribers",
  "مشترك": "Subscribers",
  "مسجّل": "Registered",
  "نشِط": "Active",
  "الإيرادات": "Total Revenue",
  "طلبات النهاردة": "Today's Orders",
  "محتاج قرارك": "Needs Action",
  "مفيش": "All Caught Up",
};

export default function AdminStats({ stats }: { stats: AdminStat[] }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => {
        const label = isEn ? s.labelEn || STAT_LABELS[s.label] || s.label : s.label;
        let value = s.value;
        if (isEn) {
          if (s.valueEn !== undefined) {
            value = s.valueEn;
          } else if (typeof s.value === "string" && s.value.includes("ج.م")) {
            value = s.value.replace("ج.م", "EGP");
          }
        }
        const hint = isEn ? s.hintEn || (s.hint ? STAT_LABELS[s.hint] || s.hint : undefined) : s.hint;

        const toneCls =
          s.tone === "good"
            ? "border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100"
            : s.tone === "warn"
            ? "border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100"
            : "border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white";

        return (
          <div
            key={s.label}
            className={`rounded-2xl border p-4 shadow-xs transition-all hover:scale-[1.01] ${toneCls}`}
          >
            <div className="mb-1 flex items-center justify-between gap-1.5">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</span>
              {s.icon && (
                <span className="text-base" aria-hidden>
                  {s.icon}
                </span>
              )}
            </div>
            <div className="text-xl md:text-2xl font-black font-mono tracking-tight">{value}</div>
            {hint && <div className="mt-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400">{hint}</div>}
          </div>
        );
      })}
    </div>
  );
}
