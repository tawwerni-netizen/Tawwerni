"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "./LanguageContext";
import { payment, pricing } from "@/content/brand";
import type { LegalContract, PromptTemplate } from "@/content/vip-vault-data";

interface Props {
  isVip: boolean;
  userName: string;
  userEmail: string;
  prompts: PromptTemplate[];
  contracts: LegalContract[];
  totalPromptsCount: number;
}

export default function VipVaultClient({
  isVip,
  userName,
  userEmail,
  prompts,
  contracts,
  totalPromptsCount,
}: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [activeTab, setActiveTab] = useState<"prompts" | "contracts">("prompts");
  const [promptCategory, setPromptCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const PROMPTS_PER_PAGE = 24;

  // Selected contract state
  const [selectedContractSlug, setSelectedContractSlug] = useState(contracts[0]?.slug ?? "");
  const selectedContract = contracts.find((c) => c.slug === selectedContractSlug) || contracts[0];

  // Dynamic field values for selected contract
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {
      FREELANCER_NAME: userName || "محمد أحمد علي",
    };
    contracts.forEach((c) => {
      c.fillableFields.forEach((f) => {
        if (!initial[f.key]) initial[f.key] = f.defaultValue;
      });
    });
    return initial;
  });

  const handleFieldChange = (key: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }));
  };

  const copyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch {
      /* ignore clipboard error */
    }
  };

  // Compile contract text with injected variables
  const getRenderedContract = (contract: LegalContract) => {
    let text = isEn ? contract.contentEn : contract.contentAr;
    contract.fillableFields.forEach((field) => {
      const val = fieldValues[field.key] || field.defaultValue;
      text = text.replaceAll(`[${field.key}]`, val);
    });
    return text;
  };

  const downloadContract = (contract: LegalContract) => {
    const text = getRenderedContract(contract);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contract.slug}-${isEn ? "en" : "ar"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered prompts
  const filteredPrompts = prompts.filter((p) => {
    const matchesCat = promptCategory === "all" || p.category === promptCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesQuery =
      p.titleAr.toLowerCase().includes(q) ||
      p.titleEn.toLowerCase().includes(q) ||
      p.promptTextAr.toLowerCase().includes(q) ||
      p.categoryAr.toLowerCase().includes(q) ||
      p.categoryEn.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const categories = [
    { key: "all", labelAr: "الكل", labelEn: "All" },
    { key: "sales", labelAr: "المبيعات وإغلاق الصفقات", labelEn: "Sales & Deals" },
    { key: "marketing", labelAr: "التسويق والإعلانات", labelEn: "Marketing & Growth" },
    { key: "freelance", labelAr: "العمل الحر والعملاء", labelEn: "Freelance & Clients" },
    { key: "engineering", labelAr: "البرمجة وهندسة النظم", labelEn: "Software Engineering" },
    { key: "strategy", labelAr: "استراتيجية الشركات", labelEn: "Strategy & Scaling" },
    { key: "product", labelAr: "إدارة المنتجات و UX", labelEn: "Product & UX" },
    { key: "operations", labelAr: "أتمتة العمليات و SOPs", labelEn: "Operations & AI" },
    { key: "finance", labelAr: "المالية والتسعير", labelEn: "Finance & Pricing" },
    { key: "hr", labelAr: "الموارد البشرية والتوظيف", labelEn: "HR & Talent" },
    { key: "retention", labelAr: "خدمة العملاء والاحتفاظ", labelEn: "Retention & Churn" },
    { key: "data", labelAr: "تحليل البيانات و BI", labelEn: "Data Analytics & BI" },
  ];

  const getCatCount = (catKey: string) => {
    if (catKey === "all") return prompts.length;
    return prompts.filter((p) => p.category === catKey).length;
  };

  const downloadFullVault = () => {
    const lines: string[] = [];
    lines.push("================================================================================");
    lines.push("👑 بنك الـ 1,000 برومبت السري للشركات والمستقلين المحترفين · منصة طوّرني Tawwerni.com");
    lines.push("👑 The Secret 1,000 Enterprise Prompts Vault · Tawwerni Platform");
    lines.push(`المشترك: ${userName} (${userEmail})`);
    lines.push(`تاريخ الاستخراج: ${new Date().toLocaleDateString("ar-EG")}`);
    lines.push("================================================================================\n");

    prompts.forEach((p, idx) => {
      lines.push(`--------------------------------------------------------------------------------`);
      lines.push(`[#${idx + 1}] ${isEn ? p.titleEn : p.titleAr} (${p.id})`);
      lines.push(`التصنيف: ${isEn ? p.categoryEn : p.categoryAr} | الموديل: ${p.recommendedModel} | المستوى: ${p.difficulty}`);
      lines.push(`المستهدف: ${isEn ? p.targetRoleEn : p.targetRoleAr}`);
      lines.push(`نصيحة الاستخدام: ${isEn ? p.usageTipEn : p.usageTipAr}`);
      lines.push(`\nنص البرومبت التنفيذي:\n`);
      lines.push(isEn ? p.promptTextEn : p.promptTextAr);
      lines.push(`\n`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Tawwerni-1000-Prompts-Vault-${(userName || "VIP").replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const upgradeMessage = encodeURIComponent(
    `السلام عليكم، أنا مشترك في منصة طوّرني (إيميلي: ${userEmail}) وحوّلت 99 جنيه لترقية حسابي لخزنة VIP (بنك الـ 1,000 برومبت السري + عقود الفريلانس القانونية). برجاء التفعيل.`
  );
  const waUpgradeUrl = `https://wa.me/2${payment.supportWhatsapp}?text=${upgradeMessage}`;

  return (
    <div className="relative px-4 pt-6 sm:pt-8 pb-20 min-h-screen text-neutral-900 dark:text-neutral-100" dir={isEn ? "ltr" : "rtl"}>
      {/* Ambient VIP luxury glow */}
      <div className="pointer-events-none fixed top-0 left-1/3 h-96 w-96 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none fixed bottom-1/4 right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

      {/* Header Banner */}
      <div className="mx-auto max-w-5xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-700 dark:text-amber-300 mb-2">
              <span className="text-base animate-pulse">👑</span>
              <span>
                {isVip
                  ? isEn
                    ? "VIP Vault · Lifetime Unlocked Pass"
                    : "خزنة VIP · وصول حصري غير محدود مدى الحياة"
                  : isEn
                  ? "VIP Vault · Premium Upgrade Required"
                  : "خزنة VIP · خاصة بالمشتركين في ترقية الـ 99 ج.م"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              {isEn
                ? "Secret 1,000+ Corporate Prompts & Legal Freelance Contracts"
                : "بنك الـ 1,000 برومبت السري للشركات + حزمة عقود الفريلانس"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              {isEn
                ? "Enterprise-grade tested AI prompt architectures for high-ticket business, sales, and coding + ironclad freelance legal contracts protecting your income."
                : "أوامر ذكاء اصطناعي احترافية عالية الدقة تم اختبارها للبيزنس والمبيعات والبرمجة + صِيغ عقود عمل حر ملزمة تحمي أتعابك قانونيًا وتمنع المماطلة."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/app"
              className="text-xs font-bold px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {isEn ? "← Back to Home" : "← العودة للرئيسية"}
            </Link>
          </div>
        </div>

        {/* Lock Overlay / Upgrade Prompt if NOT VIP */}
        {!isVip && (
          <div className="mt-6 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-neutral-900/90 to-emerald-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="inline-block rounded-lg bg-amber-400 text-neutral-950 px-2.5 py-1 text-xs font-black mb-3">
                  ⚡ {isEn ? "Upgrade for 99 EGP Only" : "ترقية حصرية بـ 99 ج.م فقط"}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {isEn
                    ? "Unlock the Entire Secret Prompts Vault & 5 Legal Contracts"
                    : "افتح كامل بنك الـ 1,000 برومبت و 5 عقود فريلانس قانونية موثوقة"}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {isEn
                    ? `You are currently on the standard 100-tracks subscription. Add the VIP Vault for a one-time fee of +${pricing.orderBumpPriceEgp} EGP (448/450 EGP total) to unlock instant lifetime access.`
                    : `أنت مشترك حالياً بالباقة الأساسية (349 ج.م). احصل على خزنة VIP بالكامل بدفع فارق الترقية (+99 ج.م فقط ليكون الإجمالي 448 أو 450 ج.م) واستمتع بحماية أتعابك ومضاعفة أرباحك.`}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-amber-200/90 font-medium">
                  <span>✓ {isEn ? "1,000+ Corporate Prompts" : "+1,000 برومبت تنفيذي للشركات"}</span>
                  <span>•</span>
                  <span>✓ {isEn ? "5 Bilingual Freelance Contracts" : "5 عقود فريلانس عربية/إنجليزية"}</span>
                  <span>•</span>
                  <span>✓ {isEn ? "Instant 1-Click Copy" : "نسخ وتحميل مباشر بضغطة زر"}</span>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2.5 sm:min-w-[240px]">
                <a
                  href={waUpgradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-6 py-3.5 text-center text-sm font-black text-neutral-950 shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
                >
                  {isEn ? "Upgrade via WhatsApp (+99 EGP) →" : "ترقية الحساب الآن (+99 ج.م) ←"}
                </a>
                <p className="text-[11px] text-center text-neutral-400">
                  {isEn
                    ? `Transfer 99 EGP to ${payment.supportWhatsapp} (VF Cash / InstaPay)`
                    : `حوّل 99 ج.م على فودافون كاش أو إنستاباي (${payment.supportWhatsapp})`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("prompts")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs sm:text-sm font-black transition-all ${
              activeTab === "prompts"
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-2 border-amber-500/40 shadow-sm"
                : "bg-white/50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <span>⚡</span>
            <span>
              {isEn
                ? `Corporate AI Prompts Bank (+${totalPromptsCount})`
                : `بنك الـ 1,000 برومبت السري للشركات`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contracts")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-xs sm:text-sm font-black transition-all ${
              activeTab === "contracts"
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-2 border-emerald-500/40 shadow-sm"
                : "bg-white/50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <span>⚖️</span>
            <span>
              {isEn
                ? `Freelance Legal Contracts Pack (${contracts.length})`
                : `حزمة عقود الفريلانس القانونية (${contracts.length})`}
            </span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="mx-auto max-w-5xl">
        {/* ======================================================== */}
        {/* TAB 1: PROMPTS VAULT */}
        {/* ======================================================== */}
        {activeTab === "prompts" && (
          <div className="space-y-6">
            {/* Search and Category Filters */}
            {/* Search and Category Filters */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 p-4 sm:p-5 backdrop-blur-md space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder={
                      isEn
                        ? "Search 1,000 prompts by topic, keywords, or role..."
                        : "ابحث في الـ 1,000 برومبت بالمجال، الكلمات المفتاحية، أو الوظيفة..."
                    }
                    className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-950 px-4 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentPage(1);
                      }}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white px-2 py-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* VIP Download Full Vault Button */}
                <button
                  type="button"
                  onClick={downloadFullVault}
                  className={`rounded-2xl px-4 py-3 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                    isVip
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 hover:brightness-110 active:scale-95"
                      : "bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:border-amber-500/30"
                  }`}
                  title={isVip ? "تحميل بنك الـ 1,000 برومبت كاملاً كملف نصي منظم" : "متاح لأعضاء VIP"}
                >
                  <span>{isVip ? "📥" : "🔒"}</span>
                  <span>
                    {isEn
                      ? `Download All ${prompts.length} Prompts (.txt)`
                      : `تحميل البنك كاملاً (${prompts.length.toLocaleString("ar-EG")} برومبت)`}
                  </span>
                </button>
              </div>

              {/* Categories scrollable pill list with counts */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => {
                  const count = getCatCount(cat.key);
                  const isSelected = promptCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => {
                        setPromptCategory(cat.key);
                        setCurrentPage(1);
                      }}
                      className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-neutral-950 font-black shadow-xs"
                          : "bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10"
                      }`}
                    >
                      <span>{isEn ? cat.labelEn : cat.labelAr}</span>
                      <span
                        className={`text-[10px] rounded-md px-1.5 py-0.2 font-mono ${
                          isSelected
                            ? "bg-neutral-950/20 text-neutral-950"
                            : "bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Counter & Active Category Header */}
            {(() => {
              const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE));
              const startIndex = (currentPage - 1) * PROMPTS_PER_PAGE;
              const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + PROMPTS_PER_PAGE);

              return (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <p className="font-semibold">
                      {isEn
                        ? `Showing ${filteredPrompts.length === 0 ? 0 : startIndex + 1}-${Math.min(startIndex + PROMPTS_PER_PAGE, filteredPrompts.length)} of ${filteredPrompts.length} prompts`
                        : `عرض ${filteredPrompts.length === 0 ? 0 : (startIndex + 1).toLocaleString("ar-EG")} إلى ${Math.min(startIndex + PROMPTS_PER_PAGE, filteredPrompts.length).toLocaleString("ar-EG")} من أصل ${filteredPrompts.length.toLocaleString("ar-EG")} برومبت`}
                    </p>
                    {filteredPrompts.length > 0 && (
                      <p className="text-[11px] font-mono">
                        {isEn ? `Page ${currentPage} of ${totalPages}` : `الصفحة ${currentPage} من ${totalPages}`}
                      </p>
                    )}
                  </div>

                  {/* Prompts Grid */}
                  {paginatedPrompts.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-black/15 dark:border-white/15 p-12 text-center">
                      <span className="text-4xl block mb-2">🔍</span>
                      <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        {isEn ? "No matching prompts found" : "لم يتم العثور على برومبتات مطابقة للبحث"}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1">
                        {isEn ? "Try adjusting your search query or category filter." : "جرّب تغيير كلمات البحث أو اختيار تصنيف آخر."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setPromptCategory("all");
                          setCurrentPage(1);
                        }}
                        className="mt-4 rounded-xl px-4 py-2 text-xs font-bold bg-amber-500 text-neutral-950"
                      >
                        {isEn ? "Reset Filters" : "إعادة ضبط الفلاتر"}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paginatedPrompts.map((p, index) => {
                        const globalIndex = startIndex + index;
                        const isLocked = !isVip && globalIndex >= 2;
                        return (
                          <div
                            key={p.id}
                            className={`rounded-3xl border p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                              isLocked
                                ? "border-black/5 dark:border-white/5 bg-neutral-100/40 dark:bg-neutral-900/40 blur-[1px] select-none"
                                : "border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-amber-500/40 shadow-xs hover:shadow-lg"
                            }`}
                          >
                            {isLocked && (
                              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs p-4 text-center">
                                <span className="text-3xl mb-1">🔒</span>
                                <p className="text-xs font-black text-amber-300">
                                  {isEn ? "Locked for VIP Members" : "مغلق لأعضاء ترقية VIP"}
                                </p>
                                <a
                                  href={waUpgradeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 text-[11px] font-bold text-white underline"
                                >
                                  {isEn ? "Unlock for +99 EGP →" : "افتح الخزنة بـ +99 ج.م ←"}
                                </a>
                              </div>
                            )}

                            <div>
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-700 dark:text-amber-300">
                                  {isEn ? p.categoryEn : p.categoryAr}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
                                  <span className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5">
                                    ⚡ {p.recommendedModel}
                                  </span>
                                  <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 font-bold">
                                    {isEn ? p.impactBadgeEn : p.impactBadgeAr}
                                  </span>
                                </div>
                              </div>

                              <h3 className="text-base font-black text-neutral-900 dark:text-white leading-snug">
                                {isEn ? p.titleEn : p.titleAr}
                              </h3>

                              <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                {isEn ? `Target Role: ${p.targetRoleEn}` : `موجه لـ: ${p.targetRoleAr}`}
                              </p>

                              <div className="mt-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950/80 p-3.5 border border-black/5 dark:border-white/5 font-mono text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed max-h-48 overflow-y-auto no-scrollbar">
                                <p className="whitespace-pre-wrap">
                                  {isEn ? p.promptTextEn : p.promptTextAr}
                                </p>
                              </div>

                              <p className="mt-2.5 text-[11px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                                💡 {isEn ? p.usageTipEn : p.usageTipAr}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                              <span className="text-[10px] text-neutral-400 font-mono">
                                #{globalIndex + 1} · {p.id}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyText(isEn ? p.promptTextEn : p.promptTextAr, p.id)}
                                disabled={isLocked}
                                className={`rounded-xl px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                                  copiedId === p.id
                                    ? "bg-emerald-600 text-white"
                                    : "bg-amber-400 text-neutral-950 hover:bg-amber-300 active:scale-95 shadow-xs"
                                }`}
                              >
                                <span>{copiedId === p.id ? "✓" : "📋"}</span>
                                <span>
                                  {copiedId === p.id
                                    ? isEn ? "Copied!" : "تم النسخ بنجاح!"
                                    : isEn ? "Copy Prompt" : "نسخ البرومبت"}
                                </span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Symmetrical Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/10 dark:border-white/10">
                      <div className="text-xs text-neutral-500 font-medium order-2 sm:order-1">
                        {isEn
                          ? `Page ${currentPage} of ${totalPages} · (${filteredPrompts.length} prompts)`
                          : `الصفحة ${currentPage} من ${totalPages} · (${filteredPrompts.length.toLocaleString("ar-EG")} برومبت)`}
                      </div>

                      <div className="flex items-center gap-1.5 order-1 sm:order-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            window.scrollTo({ top: 350, behavior: "smooth" });
                          }}
                          disabled={currentPage === 1}
                          className="rounded-xl px-3 py-1.5 text-xs font-bold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        >
                          {isEn ? "← Prev" : "← السابق"}
                        </button>

                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = currentPage;
                            if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            if (pageNum < 1 || pageNum > totalPages) return null;
                            const isCurrent = currentPage === pageNum;
                            return (
                              <button
                                key={pageNum}
                                type="button"
                                onClick={() => {
                                  setCurrentPage(pageNum);
                                  window.scrollTo({ top: 350, behavior: "smooth" });
                                }}
                                className={`h-8 w-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                  isCurrent
                                    ? "bg-amber-500 text-neutral-950 shadow-xs"
                                    : "border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setCurrentPage((p) => Math.min(totalPages, p + 1));
                            window.scrollTo({ top: 350, behavior: "smooth" });
                          }}
                          disabled={currentPage === totalPages}
                          className="rounded-xl px-3 py-1.5 text-xs font-bold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                        >
                          {isEn ? "Next →" : "التالي ←"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: LEGAL CONTRACTS PACK */}
        {/* ======================================================== */}
        {activeTab === "contracts" && (
          <div className="space-y-6">
            {/* Contract Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {contracts.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setSelectedContractSlug(c.slug)}
                  className={`rounded-2xl p-3 text-start transition-all border ${
                    selectedContractSlug === c.slug
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-white shadow-xs"
                      : "border-black/5 dark:border-white/5 bg-white/60 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 hover:border-black/20"
                  }`}
                >
                  <span className="block text-base mb-1">📜</span>
                  <span className="block text-xs font-black leading-snug line-clamp-2">
                    {isEn ? c.titleEn : c.titleAr}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Contract Viewer */}
            {selectedContract && (
              <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-md relative overflow-hidden">
                {!isVip && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs p-6 text-center">
                    <span className="text-4xl mb-2">⚖️</span>
                    <h3 className="text-lg font-black text-amber-300">
                      {isEn ? "Full Legal Contracts Unlocked for VIP" : "حزمة العقود متاحة حصرياً لأعضاء ترقية VIP"}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-300 max-w-md">
                      {isEn
                        ? "Protect your freelance projects, code, and revenue from non-paying clients with tested Egyptian & international clauses."
                        : "احمِ مشاريعك وأتعابك وأكوادك البرمجية من المماطلة وصيغ عقودك باحترافية كاملة معتمدة قانونياً."}
                    </p>
                    <a
                      href={waUpgradeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-black text-neutral-950 shadow-lg hover:bg-amber-300 transition-all"
                    >
                      {isEn ? "Upgrade for 99 EGP Only →" : "ترقية الحساب بـ 99 ج.م فقط ←"}
                    </a>
                  </div>
                )}

                {/* Contract Meta & Risk Savings */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/10 dark:border-white/10">
                  <div>
                    <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[10px] font-black">
                      {isEn ? selectedContract.categoryEn : selectedContract.categoryAr}
                    </span>
                    <h2 className="mt-2 text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                      {isEn ? selectedContract.titleEn : selectedContract.titleAr}
                    </h2>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      {isEn ? selectedContract.taglineEn : selectedContract.taglineAr}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-start sm:items-end gap-1">
                    <span className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                      💰 {isEn ? `Saves ~${selectedContract.estimatedLegalCostSavedEgp} EGP Lawyer Fees` : `يوفّر ~${selectedContract.estimatedLegalCostSavedEgp} ج.م أتعاب صياغة`}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      🛡️ {isEn ? selectedContract.riskAvoidedEn : selectedContract.riskAvoidedAr}
                    </span>
                  </div>
                </div>

                {/* Fillable Fields (Dynamic Customizer) */}
                <div className="mt-6 rounded-2xl bg-neutral-50 dark:bg-neutral-950 p-4 border border-black/5 dark:border-white/5">
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-1.5">
                    <span>✏️</span>
                    <span>
                      {isEn
                        ? "Customize Variables (Real-Time Live Injection):"
                        : "تخصيص البيانات (تحديث فوري داخل نصوص العقد):"}
                    </span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedContract.fillableFields.map((field) => (
                      <div key={field.key}>
                        <label className="block text-[11px] font-bold text-neutral-500 mb-1">
                          {isEn ? field.labelEn : field.labelAr}
                        </label>
                        <input
                          type="text"
                          value={fieldValues[field.key] || field.defaultValue}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rendered Contract Text Area */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-neutral-400">
                      {isEn ? "Formatted Legal Agreement Text:" : "النص القانوني الملزم والنهائي للعقد:"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyText(getRenderedContract(selectedContract), selectedContract.id)}
                        className={`rounded-xl px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 ${
                          copiedId === selectedContract.id
                            ? "bg-emerald-600 text-white"
                            : "bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95 shadow-xs"
                        }`}
                      >
                        <span>{copiedId === selectedContract.id ? "✓" : "📋"}</span>
                        <span>
                          {copiedId === selectedContract.id
                            ? isEn ? "Copied!" : "تم النسخ بنجاح!"
                            : isEn ? "Copy Full Agreement" : "نسخ نص العقد بالكامل"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => downloadContract(selectedContract)}
                        className="rounded-xl border border-black/10 dark:border-white/10 px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        💾 {isEn ? "Save .TXT" : "حفظ ملف نصي"}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-950/80 p-5 font-mono text-xs leading-loose text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {getRenderedContract(selectedContract)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
