export const brand = {
  name: "طوّرني",
  nameEn: "Tawwerni",
  domain: "tawwerni.com",
  tagline: "حوّل تعلّمك اليومي لتقدّم حقيقي",
  coachName: "فهيم",
  colors: {
    teal50: "#E1F5EE",
    teal100: "#9FE1CB",
    teal200: "#5DCAA5",
    teal400: "#1D9E75",
    teal600: "#0F6E56",
    teal800: "#085041",
    teal900: "#04342C",
  },
} as const;

export const pricing = {
  trackPriceEgp: 59,
  originalTrackPriceEgp: 59,
  careerPathPriceEgp: 149,
  originalCareerPathPriceEgp: 149,
  allAccessPriceEgp: 399,
  originalAllAccessPriceEgp: 399,
  priceEgp: 59,
  bundlePriceEgp: 149,
  originalPriceEgp: 59,
  priceUsd: 10,
  originalPriceUsd: 10,
  priceSar: 25,
  originalPriceSar: 25,
  legacySubscriptionPriceEgp: 399,
  orderBumpPriceEgp: 199,
  orderBumpTitle: "قاعدة بيانات الـ 10,000 برومبت التنفيذي للشركات (100 مجال × 100 برومبت) + حزمة عقود الفريلانس القانونية",
  orderBumpTitleEn: "Executive 10,000 Corporate Prompts Vault (100 Domains × 100 Prompts) + Freelance Legal Contracts",
  cohortSeatsTotal: 500,
  offerNote: "اشتراك لمدة سنة كاملة: المسار الفردي بـ 59 ج.م، المسار المهني بـ 149 ج.م، أو الوصول الشامل بـ 399 ج.م",
  offerNoteEn: "1-Year access: Single Track for 59 EGP, Career Path for 149 EGP, or All-Access Pass for 399 EGP",
  allAccessTitle: "الوصول الشامل لكافة الكورسات والمسارات المهنية",
  allAccessTitleEn: "All-Access Pass (All 100 Tracks & All Career Paths)",
  guaranteeNote: "اشتراك لمدة سنة كاملة (365 يوماً) وتفعيل فوري · اليوم الأول متاح مجاناً للتجربة",
  guaranteeNoteEn: "1-Year full access (365 days) · Free Day 1 preview on all tracks",
  grantsAllCourses: false,
} as const;

export const social = [
  { key: "facebook", label: "فيسبوك", labelEn: "Facebook", handle: "Tawwerni", url: "https://facebook.com/Tawwerni" },
  { key: "tiktok", label: "تيك توك", labelEn: "TikTok", handle: "@Tawwerni", url: "https://tiktok.com/@Tawwerni" },
  { key: "instagram", label: "إنستجرام", labelEn: "Instagram", handle: "@Tawwerni", url: "https://instagram.com/Tawwerni" },
  { key: "x", label: "إكس", labelEn: "X", handle: "@Tawwerni", url: "https://x.com/Tawwerni" },
] as const;

export const referral = {
  /** Paid to the referrer once the referred person's order is approved. */
  commissionEgp: 25,
  minPayoutEgp: 100,
  param: "ref",
  cookieDays: 30,
} as const;

export const referralsToBreakEven = Math.ceil(pricing.priceEgp / referral.commissionEgp);

export const payment = {
  vodafoneCash: ["01200176755", "01067558133"],
  instapay: ["hhifzy@instapay", "01067558133"],
  supportWhatsapp: "01069999557",
  supportEmail: "Tawwerni@gmail.com",
  activationHours: 24,
} as const;
