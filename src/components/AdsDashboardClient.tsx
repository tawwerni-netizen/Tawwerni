"use client";

import { useState } from "react";
import { useI18n } from "./LanguageContext";

interface OrderSummary {
  id: string;
  amountEgp: number;
  status: string;
  productType: string;
  productSlug: string;
  method: string;
  createdAt: string;
}

const CAMPAIGN_URLS = [
  {
    nameAr: "فيديو 1: كل مرة النتيجة مختلفة (المشكلة)",
    nameEn: "Video 01: Inconsistent Results (Problem)",
    tag: "vid_problem_p01",
    url: "https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=problem_vid01",
  },
  {
    nameAr: "فيديو 2: شات جي بي تي مش جوجل (الخطأ)",
    nameEn: "Video 02: ChatGPT is not Google (Mistake)",
    tag: "vid_mistake_m01",
    url: "https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=mistake_vid02",
  },
  {
    nameAr: "فيديو 3: بدل السؤال صمم النتيجة (التحول)",
    nameEn: "Video 03: Design the Output (Transformation)",
    tag: "vid_transform_t01",
    url: "https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=transform_vid03",
  },
  {
    nameAr: "فيديو 4: بتعدل ورا الذكاء الاصطناعي؟ (الاحتكاك)",
    nameEn: "Video 04: Editing After AI? (Friction)",
    tag: "vid_friction_f01",
    url: "https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=friction_vid04",
  },
  {
    nameAr: "فيديو 5: جرب أول مهمة مجانًا (التجربة المباشرة)",
    nameEn: "Video 05: Try Day 1 Free (Direct Trial)",
    tag: "vid_trial_t01",
    url: "https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=trial_vid05",
  },
  {
    nameAr: "صورة ثابتة: المقارنة قبل وبعد",
    nameEn: "Static 01: Split Contrast Before vs After",
    tag: "sta_contrast_s01",
    url: "https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=contrast_sta01",
  },
  {
    nameAr: "كاروسيل: المشكلة والحل وهندسة الأوامر",
    nameEn: "Carousel 01: Workflow Problem to Solution",
    tag: "car_workflow_c01",
    url: "https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=workflow_car01",
  },
  {
    nameAr: "رابط مباشر لصفحة المسار (A/B Test Variant)",
    nameEn: "Direct Track Page Variant (A/B Test)",
    tag: "vid_direct_track",
    url: "https://tawwerni.com/tracks/prompt-engineering-mastery?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=problem_vid01_direct",
  },
];

const DOC_FILES = [
  { name: "strategy.md", titleAr: "الاستراتيجية الكبرى ومراحل الإطلاق", titleEn: "Master Strategy & Positioning" },
  { name: "hero-products.md", titleAr: "مصفوفة تقييم الـ 10 منتجات البطلة", titleEn: "Hero Products Scorecard" },
  { name: "prompt-engineering-campaign.md", titleAr: "مخطط حملة هندسة الأوامر الأولى", titleEn: "Campaign 1 Setup Brief" },
  { name: "creative-matrix.md", titleAr: "مصفوفة الإعلانات: الفيديوهات والتصاميم والنصوص", titleEn: "Creative Matrix & Video Briefs" },
  { name: "landing-map.md", titleAr: "خريطة صفحات الهبوط ومطابقة الرسالة", titleEn: "Landing Destinations & Message Match" },
  { name: "tracking-map.md", titleAr: "كتالوج أحداث البكسل والتحويل الدقيق", titleEn: "Tracking Events & Deduplication Map" },
  { name: "utm-map.md", titleAr: "نظام روابط الـ UTM والتتبع المزدوج", titleEn: "UTM Taxonomy & Link Directory" },
  { name: "retargeting.md", titleAr: "استراتيجية إعادة الاستهداف والجمهور المستبعد", titleEn: "Retargeting & Exclusion Rules" },
  { name: "measurement.md", titleAr: "مؤشرات الأداء واقتصاديات الوحدة الصافية", titleEn: "KPI Formulas & Unit Economics" },
  { name: "launch-checklist.md", titleAr: "قائمة التحقق النهائية قبل تفعيل الميزانية", titleEn: "Pre-Flight Launch Checklist" },
];

export default function AdsDashboardClient({
  initialOrders,
  totalApproved,
  totalRevenue,
  aov,
}: {
  initialOrders: OrderSummary[];
  totalApproved: number;
  totalRevenue: number;
  aov: number;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [adSpendInput, setAdSpendInput] = useState<string>("500");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const spendNum = parseFloat(adSpendInput) || 0;
  const cpa = totalApproved > 0 ? (spendNum / totalApproved).toFixed(1) : (spendNum > 0 ? spendNum.toFixed(1) : "0.0");
  const roas = spendNum > 0 ? (totalRevenue / spendNum).toFixed(2) : "0.00";
  const directCogs = totalApproved * 6.5; // Direct server / LLM cost
  const netContribution = Math.round(totalRevenue - spendNum - directCogs);

  async function copyToClipboard(url: string, tag: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(tag);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {}
  }

  return (
    <div className="space-y-8">
      {/* 1. TOP COMMERCIAL KPI SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {isEn ? "Approved Customers" : "العملاء المؤكدون (مبيعات)"}
          </p>
          <p className="mt-2 text-3xl font-black text-neutral-900 dark:text-white font-mono">
            {totalApproved}
          </p>
          <span className="mt-1 inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            {isEn ? "Confirmed Access" : "تفعيل حساب رسمي"}
          </span>
        </div>

        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {isEn ? "Realized Revenue" : "الإيراد النقدي المحقق"}
          </p>
          <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalRevenue.toLocaleString()} <span className="text-sm font-normal">ج.م</span>
          </p>
          <span className="mt-1 inline-block text-[11px] font-bold text-neutral-500">
            {isEn ? "Cash in Vodafone/InstaPay" : "تحويلات مؤكدة"}
          </span>
        </div>

        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {isEn ? "Average Order Value (AOV)" : "متوسط قيمة الطلب (AOV)"}
          </p>
          <p className="mt-2 text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
            {aov} <span className="text-sm font-normal">ج.م</span>
          </p>
          <span className="mt-1 inline-block text-[11px] font-bold text-neutral-500">
            {isEn ? "Track (59) + Bumps (199)" : "مسار (59) أو ترقية (+199)"}
          </span>
        </div>

        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
          <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {isEn ? "Pending Orders Pipeline" : "طلبات بانتظار التحويل"}
          </p>
          <p className="mt-2 text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
            {initialOrders.filter((o) => o.status === "pending").length}
          </p>
          <span className="mt-1 inline-block text-[11px] font-bold text-neutral-500">
            {isEn ? "Follow-up on WhatsApp" : "متابعة إيصال السداد"}
          </span>
        </div>
      </section>

      {/* 2. REAL-TIME UNIT ECONOMICS SIMULATOR */}
      <section className="rounded-3xl border border-teal-500/30 bg-gradient-to-br from-teal-950/20 via-neutral-900 to-neutral-950 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 px-3 py-1 text-2xs font-black text-teal-300 mb-2">
              🧮 {isEn ? "Live Unit Economics Calculator" : "حاسبة اقتصاديات الوحدة الحية"}
            </span>
            <h3 className="text-xl font-black">
              {isEn ? "Campaign Efficiency & Contribution Margin" : "كفاءة الحملة وهامش المساهمة الصافي"}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {isEn
                ? "Enter your actual or estimated ad spend to simulate real CPA, ROAS, and contribution profit."
                : "أدخل ميزانية الإعلانات الفعلية لاحتساب تكلفة الاكتساب (CPA) والعائد الصافي فوراً."}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-3.5 py-2 rounded-2xl">
            <span className="text-xs text-neutral-400 font-bold">{isEn ? "Ad Spend:" : "المصروف الإعلاني:"}</span>
            <input
              type="number"
              value={adSpendInput}
              onChange={(e) => setAdSpendInput(e.target.value)}
              className="w-24 bg-transparent font-mono font-black text-lg text-amber-400 focus:outline-hidden text-end"
            />
            <span className="text-xs font-bold text-neutral-400">ج.م</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
            <p className="text-2xs uppercase tracking-wider text-neutral-400 font-bold">
              {isEn ? "Estimated CPA" : "تكلفة اكتساب العميل (CPA)"}
            </p>
            <p className="mt-1 text-2xl font-black font-mono text-teal-300">
              {cpa} <span className="text-xs text-neutral-400">ج.م / عميل</span>
            </p>
            <p className="mt-1 text-[11px] text-neutral-400">
              {parseFloat(cpa) <= 40 ? "✓ أداء تجاري ممتاز (ضمن المستهدف)" : "⚠️ تنبيه: يحتاج تحسين معدل التحويل"}
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
            <p className="text-2xs uppercase tracking-wider text-neutral-400 font-bold">
              {isEn ? "Realized ROAS" : "العائد على الإنفاق الإعلاني (ROAS)"}
            </p>
            <p className="mt-1 text-2xl font-black font-mono text-emerald-400">
              {roas}x
            </p>
            <p className="mt-1 text-[11px] text-neutral-400">
              {parseFloat(roas) >= 2.0 ? "✓ رابح ويسمح بالتوسع المالي" : "مرحلة اختبار وتثبيت خط الأساس"}
            </p>
          </div>

          <div className="rounded-2xl bg-black/40 border border-white/10 p-4">
            <p className="text-2xs uppercase tracking-wider text-neutral-400 font-bold">
              {isEn ? "Net Contribution Margin" : "هامش المساهمة الصافي (الربح)"}
            </p>
            <p
              className={`mt-1 text-2xl font-black font-mono ${
                netContribution >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {netContribution.toLocaleString()} <span className="text-xs text-neutral-400">ج.م</span>
            </p>
            <p className="mt-1 text-[11px] text-neutral-400">
              {isEn ? "After deducting ad spend & direct server COGS" : "بعد خصم الإعلانات وتكلفة السيرفر المباشرة"}
            </p>
          </div>
        </div>
      </section>

      {/* 3. CAMPAIGN #1 READY-TO-USE UTM LINKS */}
      <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-lg font-black text-neutral-900 dark:text-white">
                {isEn ? "Campaign 1: Prompt Engineering Tracking Links" : "روابط تتبع الحملة الأولى: هندسة الأوامر (TW_V1_AI_PE)"}
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {isEn
                ? "Every creative asset maps to a designated UTM link preserving First-Touch and Last-Touch attribution."
                : "انسخ الرابط الخاص بكل كرييتف بضغطة واحدة لاستخدامه في Meta Ads Manager."}
            </p>
          </div>

          <span className="text-2xs font-mono bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20 px-3 py-1.5 rounded-xl font-bold shrink-0">
            Target: 59 EGP / 365 Days
          </span>
        </div>

        <div className="space-y-3">
          {CAMPAIGN_URLS.map((c) => (
            <div
              key={c.tag}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950 p-4 transition-all hover:border-teal-500/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">
                    {isEn ? c.nameEn : c.nameAr}
                  </span>
                  <span className="font-mono text-[10px] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-md text-neutral-600 dark:text-neutral-400">
                    utm_content={c.tag}
                  </span>
                </div>
                <p className="mt-1 text-2xs text-neutral-400 font-mono truncate" dir="ltr">
                  {c.url}
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(c.url, c.tag)}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  copiedUrl === c.tag
                    ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                    : "bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/20"
                }`}
              >
                {copiedUrl === c.tag ? "✓ تم النسخ بنجاح" : "📋 نسخ الرابط"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STRATEGY REPOSITORY QUICK LINKS */}
      <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 shadow-xs">
        <h3 className="text-base font-black text-neutral-900 dark:text-white mb-2">
          📚 {isEn ? "Official Ads V1 Strategy Documentation" : "مستندات استراتيجية إعلانات طوّرني (Ads V1)"}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
          {isEn
            ? "10 foundational documents saved in /docs/ads-v1/ covering positioning, briefs, scoring, and attribution."
            : "10 ملفات توثيق تفصيلية متوفرة في المسار /docs/ads-v1/ تشمل البريفات والنصوص ومصفوفة القياس."}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOC_FILES.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-black/5 dark:border-white/5 bg-neutral-50 dark:bg-neutral-950 text-xs"
            >
              <div className="min-w-0 flex-1">
                <span className="font-bold text-neutral-900 dark:text-white block truncate">
                  {isEn ? doc.titleEn : doc.titleAr}
                </span>
                <span className="font-mono text-2xs text-teal-600 dark:text-teal-400">
                  /docs/ads-v1/{doc.name}
                </span>
              </div>
              <span className="text-2xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md shrink-0">
                جاهز وموثق
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
