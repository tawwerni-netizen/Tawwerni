"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useI18n } from "./LanguageContext";
import { payment, pricing } from "@/content/brand";
import type { LegalContract, PromptTemplate } from "@/content/vip-vault-data";

export interface DomainMeta {
  id: string;
  slug: string;
  trackKey: string;
  trackTitleAr: string;
  trackTitleEn: string;
  trackIcon: string;
  titleAr: string;
  titleEn: string;
  promptCount: number;
  startNumber: number;
  endNumber: number;
}

interface Props {
  isVip: boolean;
  userName: string;
  userEmail: string;
  prompts: PromptTemplate[];
  domains?: DomainMeta[];
  contracts: LegalContract[];
  totalPromptsCount?: number;
  totalDomainsCount?: number;
}

export const VAULT_TRACKS = [
  { key: "all", titleAr: "جميع المسارات (10,000 برومبت)", titleEn: "All Tracks (10,000 Prompts)", icon: "🌐" },
  { key: "strategy", titleAr: "القيادة والاستراتيجية التنفيذية", titleEn: "Executive Strategy & Leadership", icon: "🏛️" },
  { key: "sales", titleAr: "المبيعات وإغلاق الصفقات", titleEn: "Sales & Deal Closing", icon: "💼" },
  { key: "marketing", titleAr: "التسويق والنمو والإعلانات", titleEn: "Marketing & Growth", icon: "🚀" },
  { key: "freelance", titleAr: "العمل الحر والعملاء المرموقين", titleEn: "High-Ticket Freelance", icon: "🎯" },
  { key: "engineering", titleAr: "هندسة البرمجيات والأنظمة", titleEn: "Software & System Engineering", icon: "💻" },
  { key: "product", titleAr: "إدارة المنتجات و UX", titleEn: "Product Management & UX", icon: "💡" },
  { key: "operations", titleAr: "أتمتة العمليات و SOPs", titleEn: "Operations & Business Automation", icon: "⚙️" },
  { key: "finance", titleAr: "المالية والتسعير واستثمار الشركات", titleEn: "Finance & Corporate Investment", icon: "💰" },
  { key: "hr", titleAr: "الموارد البشرية والتوظيف المتقدم", titleEn: "HR & Talent Acquisition", icon: "👥" },
  { key: "retention", titleAr: "خدمة العملاء والاحتفاظ بالعقود", titleEn: "Customer Retention & VIP Support", icon: "🤝" },
];

export default function VipVaultClient({
  isVip,
  userName,
  userEmail,
  prompts,
  domains = [],
  contracts,
  totalPromptsCount = 10000,
  totalDomainsCount = 100,
}: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [activeTab, setActiveTab] = useState<"prompts" | "contracts">("prompts");
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // In-memory cache for API requests to avoid redundant fetches
  const promptsCache = useRef<Record<string, any>>({});
  const [, startTransition] = useTransition();

  // Current prompts loaded from API
  const [displayedPrompts, setDisplayedPrompts] = useState<any[]>(() => prompts.slice(0, 24));
  const [filteredCount, setFilteredCount] = useState<number>(totalPromptsCount);
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(totalPromptsCount / 24));
  const [isLoading, setIsLoading] = useState(false);

  // Contracts state
  const [selectedContractSlug, setSelectedContractSlug] = useState(contracts[0]?.slug ?? "");
  const selectedContract = contracts.find((c) => c.slug === selectedContractSlug) || contracts[0];

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

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch prompts whenever track, domain, search, or page changes
  useEffect(() => {
    let isCancelled = false;
    const cacheKey = `${selectedTrack}:${selectedDomain}:${debouncedSearch}:${currentPage}`;

    if (promptsCache.current[cacheKey]) {
      const cached = promptsCache.current[cacheKey];
      setDisplayedPrompts(cached.prompts);
      setFilteredCount(cached.filteredCount);
      setTotalPages(cached.totalPages);
      return;
    }

    setIsLoading(true);
    const params = new URLSearchParams({
      track: selectedTrack,
      domain: selectedDomain,
      search: debouncedSearch,
      page: String(currentPage),
      limit: "24",
    });

    fetch(`/api/vip-vault/prompts?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled) return;
        if (data.prompts) {
          promptsCache.current[cacheKey] = data;
          startTransition(() => {
            setDisplayedPrompts(data.prompts);
            setFilteredCount(data.filteredCount);
            setTotalPages(data.totalPages);
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching VIP prompts:", err);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedTrack, selectedDomain, debouncedSearch, currentPage]);

  // Filter available domains based on selected track
  const availableDomains = domains.filter((d) => {
    if (selectedTrack === "all") return true;
    return d.trackKey === selectedTrack;
  });

  // Find active domain metadata
  const currentDomainMeta = domains.find((d) => d.id === selectedDomain || d.slug === selectedDomain);

  const handleTrackChange = (trackKey: string) => {
    setSelectedTrack(trackKey);
    setSelectedDomain("all");
    setCurrentPage(1);
  };

  const handleDomainChange = (domainId: string) => {
    setSelectedDomain(domainId);
    setCurrentPage(1);
  };

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

  const handleDownload = async (type: "all" | "track" | "domain") => {
    if (!isVip) return;
    setDownloading(type);
    try {
      let url = "/api/vip-vault/download";
      if (type === "track" && selectedTrack !== "all") {
        url += `?track=${selectedTrack}`;
      } else if (type === "domain" && selectedDomain !== "all") {
        url += `?domain=${selectedDomain}`;
      }
      window.location.href = url;
    } finally {
      setTimeout(() => setDownloading(null), 2000);
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

  const upgradeMessage = encodeURIComponent(
    `السلام عليكم، أنا مشترك في منصة طوّرني (إيميلي: ${userEmail}) وحوّلت 199 جنيه لترقية حسابي لخزنة VIP (قاعدة بيانات الـ 10,000 برومبت التنفيذي للشركات + حزمة عقود الفريلانس القانونية). برجاء التفعيل.`
  );
  const waUpgradeUrl = `https://wa.me/2${payment.supportWhatsapp}?text=${upgradeMessage}`;

  return (
    <div className="relative px-4 pt-6 sm:pt-8 pb-24 min-h-screen text-neutral-900 dark:text-neutral-100" dir={isEn ? "ltr" : "rtl"}>
      {/* Luxury ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/3 h-96 w-96 rounded-full bg-amber-500/10 dark:bg-amber-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none fixed bottom-1/4 right-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

      {/* Header Banner */}
      <div className="mx-auto max-w-6xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-black text-amber-700 dark:text-amber-300 mb-2">
              <span className="text-base animate-pulse">👑</span>
              <span>
                {isVip
                  ? isEn
                    ? "VIP Vault · Enterprise Access Unlocked"
                    : "خزنة VIP · وصول تنفيذي غير محدود طوال اشتراكك"
                  : isEn
                    ? "VIP Vault · Upgrade Required (+199 EGP)"
                    : "خزنة VIP · خاصة بالمشتركين في ترقية الـ 199 ج.م"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
              {isEn
                ? "Enterprise 10,000 Prompts Database & Legal Contracts Pack"
                : "قاعدة بيانات الـ 10,000 برومبت للشركات + حزمة عقود الفريلانس"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
              {isEn
                ? "An authentic indexed corporate database: 100 specialized domains × 100 battle-tested executive prompts = 10,000 prompts, plus 5 bilingual legal contracts protecting your freelance revenue."
                : "قاعدة بيانات مفهرسة ومصنفة بعناية: 100 مجال أعمال وشركات × 100 برومبت تنفيذي مجرّب = 10,000 برومبت عملي جاهز للنسخ + 5 عقود عمل حر ثنائية اللغة تحمي أتعابك قانونياً وتمنع المماطلة."}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/app"
              className="text-xs font-bold px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {isEn ? "← Back to Home" : "← العودة للرئيسية"}
            </Link>
          </div>
        </div>

        {/* Upgrade Banner for Non-VIP */}
        {!isVip && (
          <div className="mt-6 rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-neutral-900/90 to-emerald-950/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/20 blur-2xl" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="inline-block rounded-lg bg-amber-400 text-neutral-950 px-2.5 py-1 text-xs font-black mb-3">
                  ⚡ {isEn ? "Upgrade for 199 EGP Only (Save 80%)" : "ترقية حصرية بـ 199 ج.م فقط (وفر ٨٠٪)"}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {isEn
                    ? "Unlock the 10,000 Prompts Database & 5 Ironclad Contracts"
                    : "افتح قاعدة بيانات الـ 10,000 برومبت بالكامل و 5 عقود فريلانس قانونية موثوقة"}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                  {isEn
                    ? `Upgrade with an add-on fee of +${pricing.orderBumpPriceEgp} EGP for full access to the complete 10,000 executive prompts catalog and downloadable contracts pack.`
                    : `احصل على خزنة VIP بالكامل بإضافة (+199 ج.م فقط) واحمِ مستحقاتك وضاعف مبيعاتك وسرعة إنجازك طوال اشتراكك.`}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-amber-200/90 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">✓</span>
                    <span>{isEn ? "10,000 Prompts across 100 Corporate Domains" : "١٠,٠٠٠ برومبت مقسمة على ١٠٠ مجال شركات"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">✓</span>
                    <span>{isEn ? "5 Bilingual Freelance Legal Contracts" : "٥ عقود فريلانس ثنائية اللغة تحمي أتعابك"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">✓</span>
                    <span>{isEn ? "Instant 1-Click Copy & TXT Downloads" : "نسخ وتحميل مباشر بضغطة زر"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400">✓</span>
                    <span>{isEn ? "Full Access & Updates Included" : "وصول شامل وتحديثات مستمرة في حسابك"}</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2.5 sm:min-w-[260px]">
                <a
                  href={waUpgradeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 px-6 py-4 text-center text-sm font-black text-neutral-950 shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-98 transition-all"
                >
                  {isEn ? "Upgrade via WhatsApp (+199 EGP) →" : "ترقية الحساب الآن (+199 ج.م) ←"}
                </a>
                <div className="rounded-xl bg-white/5 border border-white/10 p-2.5 text-center text-[11px] text-neutral-300 space-y-1">
                  <p className="font-bold text-amber-300">
                    {isEn ? "Vodafone Cash & InstaPay" : "فودافون كاش & إنستاباي:"}
                  </p>
                  <p className="font-mono text-white text-xs select-all">01200176755</p>
                  <p className="font-mono text-white text-xs select-all">hhifzy@instapay</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("prompts")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === "prompts"
                ? "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-2 border-amber-500/40 shadow-sm"
                : "bg-white/50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <span className="text-base">⚡</span>
            <span>
              {isEn
                ? `10,000 Prompts Database (${totalDomainsCount} Domains)`
                : `قاعدة الـ 10,000 برومبت (${totalDomainsCount} مجال × 100 برومبت)`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("contracts")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-black transition-all cursor-pointer ${
              activeTab === "contracts"
                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-2 border-emerald-500/40 shadow-sm"
                : "bg-white/50 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            <span className="text-base">⚖️</span>
            <span>
              {isEn
                ? `Freelance Legal Contracts Pack (${contracts.length})`
                : `حزمة عقود الفريلانس القانونية (${contracts.length} عقود)`}
            </span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl">
        {/* ======================================================== */}
        {/* TAB 1: 10,000 PROMPTS DATABASE */}
        {/* ======================================================== */}
        {activeTab === "prompts" && (
          <div className="space-y-6">
            {/* Database Control Bar: Search & Top Downloads */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-neutral-900/60 p-4 sm:p-6 backdrop-blur-md space-y-4 shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isEn
                        ? "Search 10,000 prompts by keyword, role, domain, or ID..."
                        : "ابحث في الـ 10,000 برومبت بالمجال، الكلمات المفتاحية، الوظيفة، أو الكود..."
                    }
                    className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-neutral-950 px-4 py-3 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden focus:border-amber-500 font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white px-2 py-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Download Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Download Active Domain (100 prompts) */}
                  {selectedDomain !== "all" && (
                    <button
                      type="button"
                      onClick={() => handleDownload("domain")}
                      disabled={!isVip || downloading === "domain"}
                      className={`rounded-2xl px-4 py-3 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                        isVip
                          ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 active:scale-95"
                          : "bg-black/5 dark:bg-white/5 text-neutral-400 border border-black/5 dark:border-white/10 opacity-70"
                      }`}
                      title={isVip ? "تحميل برومبتات هذا المجال (100 برومبت) كملف نصي" : "متاح لأعضاء VIP"}
                    >
                      <span>{downloading === "domain" ? "⏳" : isVip ? "📥" : "🔒"}</span>
                      <span>
                        {isEn
                          ? "Download Domain (100 Prompts)"
                          : "تحميل هذا المجال (100 برومبت .txt)"}
                      </span>
                    </button>
                  )}

                  {/* Download Entire Vault (10,000 Prompts) */}
                  <button
                    type="button"
                    onClick={() => handleDownload("all")}
                    disabled={!isVip || downloading === "all"}
                    className={`rounded-2xl px-5 py-3 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      isVip
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-neutral-950 hover:brightness-110 active:scale-95"
                        : "bg-black/5 dark:bg-white/5 text-neutral-500 dark:text-neutral-400 border border-black/5 dark:border-white/10 hover:border-amber-500/30"
                    }`}
                    title={isVip ? "تحميل قاعدة الـ 10,000 برومبت كاملة كملف نصي منظم" : "متاح لأعضاء VIP"}
                  >
                    <span>{downloading === "all" ? "⏳" : isVip ? "📥" : "🔒"}</span>
                    <span>
                      {isEn
                        ? `Download All 10,000 Prompts (.txt)`
                        : `تحميل الخزنة كاملة (10,000 برومبت .txt)`}
                    </span>
                  </button>
                </div>
              </div>

              {/* 1. Track Selector (10 Core Tracks) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
                    {isEn ? "1. Select Executive Track (10 Tracks)" : "١. اختر المسار التنفيذي (١٠ مسارات كبرى):"}
                  </span>
                  <span className="text-[11px] text-amber-500 font-bold font-mono">
                    {selectedTrack === "all" ? "10,000 Prompts" : "1,000 Prompts / Track"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {VAULT_TRACKS.map((t) => {
                    const isSelected = selectedTrack === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => handleTrackChange(t.key)}
                        className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? "bg-amber-500 text-neutral-950 font-black shadow-xs"
                            : "bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10"
                        }`}
                      >
                        <span className="text-sm">{t.icon}</span>
                        <span>{isEn ? t.titleEn : t.titleAr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Specialized Domains Selector (100 Corporate Domains) */}
              {availableDomains.length > 0 && (
                <div className="pt-2 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-neutral-400 uppercase tracking-wider">
                      {isEn
                        ? `2. Select Specialized Domain (${availableDomains.length} Domains)`
                        : `٢. اختر المجال التخصصي (${availableDomains.length} مجال · ١٠٠ برومبت لكل مجال):`}
                    </span>
                    {selectedDomain !== "all" && (
                      <button
                        onClick={() => setSelectedDomain("all")}
                        className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                      >
                        {isEn ? "Show all domains in this track" : "عرض كل مجالات هذا المسار"}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1 no-scrollbar">
                    <button
                      onClick={() => handleDomainChange("all")}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        selectedDomain === "all"
                          ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-black"
                          : "bg-black/5 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-black/10 dark:hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      {isEn ? "All Domains" : "جميع مجالات المسار"}
                    </button>
                    {availableDomains.map((d) => {
                      const isSelected = selectedDomain === d.id || selectedDomain === d.slug;
                      return (
                        <button
                          key={d.id}
                          onClick={() => handleDomainChange(d.id)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-amber-500 text-neutral-950 font-black shadow-xs"
                              : "bg-black/5 dark:bg-white/5 text-neutral-700 dark:text-neutral-300 hover:bg-black/10 dark:hover:bg-white/10 border border-black/5 dark:border-white/5"
                          }`}
                        >
                          <span className="text-xs">{d.trackIcon}</span>
                          <span>{isEn ? d.titleEn : d.titleAr}</span>
                          <span
                            className={`text-[10px] rounded-md px-1.5 py-0.2 font-mono ${
                              isSelected
                                ? "bg-neutral-950/20 text-neutral-950"
                                : "bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400"
                            }`}
                          >
                            100
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Active Domain Info Box (if specific domain selected) */}
            {currentDomainMeta && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    {currentDomainMeta.trackIcon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                        {currentDomainMeta.id.toUpperCase()} · البرومبتات #{currentDomainMeta.startNumber} - #{currentDomainMeta.endNumber}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {isEn ? currentDomainMeta.trackTitleEn : currentDomainMeta.trackTitleAr}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-neutral-900 dark:text-white mt-0.5">
                      {isEn ? currentDomainMeta.titleEn : currentDomainMeta.titleAr}
                    </h3>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                    {isEn ? "100 Practical Prompts" : "١٠٠ برومبت عملي قابل للنسخ"}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownload("domain")}
                    disabled={!isVip}
                    className="rounded-xl px-3 py-1.5 text-xs font-bold bg-amber-400 text-neutral-950 hover:bg-amber-300 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    📥 {isEn ? "Save 100 Prompts" : "تحميل المجال"}
                  </button>
                </div>
              </div>
            )}

            {/* Results Counter & Pagination Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-neutral-500 dark:text-neutral-400">
              <p className="font-semibold flex items-center gap-2">
                {isLoading && <span className="animate-spin text-amber-500">⏳</span>}
                <span>
                  {isEn
                    ? `Showing ${filteredCount === 0 ? 0 : (currentPage - 1) * 24 + 1}-${Math.min(currentPage * 24, filteredCount)} of ${filteredCount.toLocaleString("en-US")} prompts`
                    : `عرض ${filteredCount === 0 ? 0 : ((currentPage - 1) * 24 + 1).toLocaleString("ar-EG")} إلى ${Math.min(currentPage * 24, filteredCount).toLocaleString("ar-EG")} من أصل ${filteredCount.toLocaleString("ar-EG")} برومبت`}
                </span>
              </p>
              {filteredCount > 0 && (
                <p className="text-[11px] font-mono">
                  {isEn ? `Page ${currentPage} of ${totalPages}` : `الصفحة ${currentPage} من ${totalPages}`}
                </p>
              )}
            </div>

            {/* Prompts Cards Grid */}
            {displayedPrompts.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-black/15 dark:border-white/15 p-12 text-center">
                <span className="text-4xl block mb-2">🔍</span>
                <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  {isEn ? "No matching prompts found" : "لم يتم العثور على برومبتات مطابقة للبحث"}
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  {isEn
                    ? "Try adjusting your search query, or clear filters."
                    : "جرّب تغيير كلمات البحث أو اختيار مسار ومجال آخر."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTrack("all");
                    setSelectedDomain("all");
                    setCurrentPage(1);
                  }}
                  className="mt-4 rounded-xl px-4 py-2 text-xs font-bold bg-amber-500 text-neutral-950 cursor-pointer"
                >
                  {isEn ? "Reset All Filters" : "إعادة ضبط الفلاتر"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedPrompts.map((p, index) => {
                  const promptNum = p.globalIndex || (currentPage - 1) * 24 + index + 1;
                  // If user is not VIP, allow free preview for prompts 1 and 2 only
                  const isLocked = !isVip && promptNum > 2;
                  const promptText = isEn ? p.promptTextEn || p.promptTextAr : p.promptTextAr;

                  return (
                    <div
                      key={p.id || index}
                      className={`rounded-3xl border p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                        isLocked
                          ? "border-black/5 dark:border-white/5 bg-neutral-100/40 dark:bg-neutral-900/40 blur-[1px] select-none"
                          : "border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-amber-500/40 shadow-xs hover:shadow-lg"
                      }`}
                    >
                      {isLocked && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/65 backdrop-blur-xs p-4 text-center">
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
                            {isEn ? "Unlock Vault (+199 EGP) →" : "افتح الخزنة بـ +199 ج.م ←"}
                          </a>
                        </div>
                      )}

                      <div>
                        {/* Domain & Model Badges */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-black text-amber-700 dark:text-amber-300">
                            {p.domainTitleAr || p.categoryAr || "مجال تنفيذي"}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500">
                            <span className="rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5">
                              ⚡ {p.recommendedModel || "GPT-4o / Claude"}
                            </span>
                            <span className="rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 font-bold">
                              {p.difficulty || "Executive"}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-black text-neutral-900 dark:text-white leading-snug">
                          {isEn ? p.titleEn || p.titleAr : p.titleAr}
                        </h3>

                        {/* Target Role */}
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {isEn
                            ? `Target Role: ${p.targetRoleEn || p.targetRoleAr}`
                            : `المستهدف: ${p.targetRoleAr || "المؤسسون والمديرون التنفيذيون"}`}
                        </p>

                        {/* Prompt Box */}
                        <div className="mt-4 rounded-2xl bg-neutral-100 dark:bg-neutral-950/80 p-3.5 border border-black/5 dark:border-white/5 font-mono text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed max-h-48 overflow-y-auto no-scrollbar">
                          <p className="whitespace-pre-wrap">{promptText}</p>
                        </div>

                        {/* Usage Tip */}
                        {(p.usageTipAr || p.usageTipEn) && (
                          <p className="mt-2.5 text-[11px] text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                            💡 {isEn ? p.usageTipEn || p.usageTipAr : p.usageTipAr}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Global ID and Copy Button */}
                      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 font-mono">
                          #{promptNum} · {p.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyText(promptText, p.id)}
                          disabled={isLocked}
                          className={`whitespace-nowrap shrink-0 rounded-xl px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
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
                    ? `Page ${currentPage} of ${totalPages} · (${filteredCount.toLocaleString("en-US")} prompts)`
                    : `الصفحة ${currentPage} من ${totalPages} · (${filteredCount.toLocaleString("ar-EG")} برومبت)`}
                </div>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 380, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="rounded-xl px-3 py-1.5 text-xs font-bold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    {isEn ? "← Prev" : "← السابق"}
                  </button>

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
                            window.scrollTo({ top: 380, behavior: "smooth" });
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
                      window.scrollTo({ top: 380, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="rounded-xl px-3 py-1.5 text-xs font-bold border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                  >
                    {isEn ? "Next →" : "التالي ←"}
                  </button>
                </div>
              </div>
            )}
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
                  className={`rounded-2xl p-3 text-start transition-all border cursor-pointer ${
                    selectedContractSlug === c.slug
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-white shadow-xs font-black"
                      : "border-black/5 dark:border-white/5 bg-white/60 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 hover:border-black/20 dark:hover:border-white/20"
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
                        : "احمِ مشاريعك وأتعابك وأكوادك البرمجية من المماطلة وصِغ عقودك باحترافية كاملة معتمدة قانونياً."}
                    </p>
                    <a
                      href={waUpgradeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 rounded-xl bg-amber-400 px-6 py-2.5 text-xs font-black text-neutral-950 shadow-lg hover:bg-amber-300 transition-all"
                    >
                      {isEn ? "Upgrade for 199 EGP Only →" : "ترقية الحساب بـ 199 ج.م فقط ←"}
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
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-neutral-400">
                      {isEn ? "Formatted Legal Agreement Text:" : "النص القانوني الملزم والنهائي للعقد:"}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyText(getRenderedContract(selectedContract), selectedContract.id)}
                        className={`whitespace-nowrap shrink-0 rounded-xl px-4 py-2 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
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
                        className="whitespace-nowrap shrink-0 rounded-xl border border-black/10 dark:border-white/10 px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
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
