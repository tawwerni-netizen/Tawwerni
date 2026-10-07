"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";
import { faqCategories, type FaqCategory, type FaqItem } from "@/content/faq";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function FaqPage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return faqCategories
      .map((cat) => {
        if (activeCategory !== "all" && cat.key !== activeCategory) {
          return null;
        }

        const items = cat.items.filter((item) => {
          if (!q) return true;
          const qText = (item.q + " " + (item.qEn || "")).toLowerCase();
          const aText = (item.a + " " + (item.aEn || "")).toLowerCase();
          return qText.includes(q) || aText.includes(q);
        });

        if (items.length === 0) return null;
        return { ...cat, items };
      })
      .filter(Boolean) as FaqCategory[];
  }, [activeCategory, searchQuery]);

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="relative min-h-screen overflow-hidden bg-neutral-50 dark:bg-[#070e0c] text-neutral-800 dark:text-neutral-200 transition-colors selection:bg-teal-500 selection:text-white"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 dark:bg-teal-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-[30%] -right-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-[140px]" />

      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <LogoLink size={34} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-teal-600 dark:hover:text-teal-300 bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/15 transition-colors"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-5 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 dark:bg-teal-500/20 px-3.5 py-1 text-xs font-black text-teal-700 dark:text-teal-300 border border-teal-500/20 mb-3">
            <span>💡</span>
            <span>{isEn ? "Knowledge Base & Answers" : "مركز المساعدة والأسئلة الشائعة"}</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
            {isEn ? "Frequently Asked Questions" : "كل ما تحتاج معرفته عن طوّرني"}
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            {isEn
              ? "Clear, transparent answers about pricing, access models, certifications, learning mechanics, and payment methods."
              : "إجابات واضحة وشفافة حول الأسعار، مدة الاشتراك (365 يومًا)، الشهادات الرقمية، وطرق الدفع المعتمدة."}
          </p>
        </div>

        {/* Pricing Summary Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-teal-500/30 text-center shadow-xs">
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 block mb-1">
              {isEn ? "Individual Track" : "مسار تخصصي فردي"}
            </span>
            <div className="text-2xl font-black text-neutral-900 dark:text-white font-mono">
              {pricing.trackPriceEgp} {isEn ? "EGP" : "ج.م"}
            </div>
            <span className="text-3xs text-neutral-400 mt-0.5 block">
              {isEn ? "365 Days Access · 1 Skill" : "اشتراك سنوي كامل (365 يوماً)"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-emerald-500/40 text-center shadow-xs">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block mb-1">
              {isEn ? "Career Path" : "مسار مهني شامل"}
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {pricing.careerPathPriceEgp} {isEn ? "EGP" : "ج.م"}
            </div>
            <span className="text-3xs text-neutral-400 mt-0.5 block">
              {isEn ? "365 Days Access · All Path Tracks" : "اشتراك سنوي لكافة مسارات التخصص"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-amber-500/40 text-center shadow-xs">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 block mb-1">
              {isEn ? "All-Access Pass" : "الوصول الشامل الأقصى"}
            </span>
            <div className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">
              {pricing.allAccessPriceEgp} {isEn ? "EGP" : "ج.م"}
            </div>
            <span className="text-3xs text-neutral-400 mt-0.5 block">
              {isEn ? "365 Days Access · 100 Tracks + Vault" : "١٠٠ مسار + ١٢ مسار مهني + بنك البرومبت"}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isEn
                ? "Search questions (e.g. refund, vodafone cash, certificate, duration)..."
                : "ابحث في الأسئلة (مثال: الدفع، فودافون كاش، الشهادة، مدة الاشتراك)..."
            }
            className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900/90 px-4 py-3.5 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setActiveCategory("all")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeCategory === "all"
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:border-teal-500/30"
            }`}
          >
            {isEn ? "All Topics" : "كل الأسئلة"}
          </button>
          {faqCategories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:border-teal-500/30"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{isEn ? cat.titleEn : cat.title}</span>
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-6">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-neutral-900/50">
              <span className="text-4xl block mb-2">🔍</span>
              <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                {isEn ? "No matching questions found" : "لم نجد نتائج مطابقة لبحثك"}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-bold underline"
              >
                {isEn ? "Reset search filters" : "إعادة ضبط البحث"}
              </button>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.key} className="space-y-2.5">
                <div className="flex items-center gap-2 px-1 pt-2">
                  <span className="text-base">{category.icon}</span>
                  <h2 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">
                    {isEn ? category.titleEn : category.title}
                  </h2>
                  <span className="text-3xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-neutral-500">
                    {category.items.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {category.items.map((item, idx) => {
                    const itemId = `${category.key}-${idx}`;
                    const isOpen = Boolean(openItems[itemId]);
                    const question = isEn && item.qEn ? item.qEn : item.q;
                    const answer = isEn && item.aEn ? item.aEn : item.a;

                    return (
                      <div
                        key={itemId}
                        className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900/90 overflow-hidden shadow-2xs transition-all hover:border-teal-500/30"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(itemId)}
                          className="w-full flex items-center justify-between gap-3 p-4 text-start font-bold text-xs sm:text-sm text-neutral-900 dark:text-white"
                        >
                          <span className="leading-snug">{question}</span>
                          <span
                            className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 text-neutral-500 text-xs font-mono transition-transform duration-200 ${
                              isOpen ? "rotate-180 bg-teal-500/20 text-teal-600 dark:text-teal-300" : ""
                            }`}
                          >
                            ▼
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 border-t border-black/5 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-950/30">
                            <p>{answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Support & Contact Footer Callout */}
        <div className="mt-12 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-teal-500/10 p-6 sm:p-8 text-center">
          <span className="text-3xl block mb-2">💬</span>
          <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-white mb-1">
            {isEn ? "Have another question?" : "عندك سؤال إضافي مش موجود هنا؟"}
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-5 max-w-md mx-auto">
            {isEn
              ? "Our support team is available on WhatsApp and email to assist you with payments, activations, and learning questions."
              : "فريق الدعم متاح عبر واتساب للرد على كافة استفسارات الدفع والتفعيل واختيار المسار المناسب."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={`https://wa.me/201067558133?text=${encodeURIComponent(
                isEn ? "Hello Tawwerni Support, I have a question regarding the platform." : "أهلاً فريق طوّرني، عندي استفسار بخصوص المنصة."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 text-xs shadow-md transition-all"
            >
              <span>🟢</span>
              <span>{isEn ? "Chat on WhatsApp" : "تواصل معنا عبر واتساب"}</span>
            </a>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-black/10 dark:border-white/10 font-bold px-6 py-3 text-xs hover:border-teal-500/40 transition-all"
            >
              <span>🧭</span>
              <span>{isEn ? "Take Career Quiz (Free)" : "جرب اختبار المسار مجاناً"}</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
