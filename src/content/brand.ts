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
  priceEgp: 349,
  originalPriceEgp: 1200,
  priceUsd: 29,
  originalPriceUsd: 99,
  priceSar: 99,
  originalPriceSar: 299,
  orderBumpPriceEgp: 99,
  orderBumpTitle: "بنك الـ 1,000 برومبت السري للشركات + حزمة عقود الفريلانس القانونية",
  cohortSeatsTotal: 500,
  cohortSeatsRemaining: 47,
  offerNote: "عرض فوج التأسيس الأول · وصول مدى الحياة لـ 100 مسار",
  guaranteeNote: "ضمان استرداد كامل خلال 14 يوماً بدون أي أسئلة",
  grantsAllCourses: true,
} as const;

export const social = [
  { key: "facebook", label: "فيسبوك", handle: "Tawwerni", url: "https://facebook.com/Tawwerni" },
  { key: "tiktok", label: "تيك توك", handle: "@Tawwerni", url: "https://tiktok.com/@Tawwerni" },
  { key: "instagram", label: "إنستجرام", handle: "@Tawwerni", url: "https://instagram.com/Tawwerni" },
  { key: "x", label: "إكس", handle: "@Tawwerni", url: "https://x.com/Tawwerni" },
] as const;

export const referral = {
  /** Paid to the referrer once the referred person's order is approved. */
  commissionEgp: 75,
  minPayoutEgp: 150,
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
