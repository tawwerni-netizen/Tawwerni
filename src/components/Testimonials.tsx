"use client";

import Link from "next/link";
import { COMMUNITY_300 } from "@/content/community-300";
import { useI18n } from "./LanguageContext";

const STARS = (n: number | null) => (n ? "⭐".repeat(Math.round(n)) : "⭐⭐⭐⭐⭐");

export default function Testimonials() {
  const { lang, t } = useI18n();
  const isEn = lang === "en";

  const displayItems = COMMUNITY_300.slice(0, 9).map((m) => ({
    id: m.id,
    rating: m.rating,
    quote: isEn ? m.quoteEn : m.quoteAr,
    holderName: isEn ? `${m.name} (${m.roleEn} · ${m.cityEn})` : `${m.name} (${m.roleAr} · ${m.cityAr})`,
    courseTitle: isEn ? m.trackTitleEn : m.trackTitleAr,
  }));

  return (
    <div className="mx-auto mb-14 max-w-5xl">
      <div className="text-center mb-7">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-400 mb-2">
          <span>👥</span>
          <span>{isEn ? "Authentic Community Stories" : "قصص نجاح من مجتمع طوّرني"}</span>
        </span>
        <h2 className="text-xl font-bold md:text-2xl text-neutral-900 dark:text-white">
          {isEn
            ? "Real Experiences from Learners Transforming Their Careers"
            : "تجارب حقيقية لمتعلمين غيرت المنصة مسارهم المهني"}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between hover:border-teal-500/30 transition-colors"
          >
            <div>
              {item.rating && (
                <p className="mb-2 text-sm" dir="ltr">
                  {STARS(item.rating)}
                </p>
              )}
              <p className="mb-3 text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">{item.holderName}</p>
              {item.courseTitle && (
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">{item.courseTitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          <span>
            {isEn
              ? "Browse all 300+ member stories & verified reviews →"
              : "تصفح قصص باقي الـ 300 عضو في المجتمع ←"}
          </span>
        </Link>
      </div>
    </div>
  );
}
