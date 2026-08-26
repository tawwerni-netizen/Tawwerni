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
  priceEgp: 299,
  /*
   * There is no `originalPriceEgp` and no `discountPercent` here any more.
   *
   * A 3000 EGP price struck through next to 299 says the course once cost 3000.
   * It never did — nothing was ever sold at that price — so the saving, and the
   * "90% off" derived from it, were both claims about a past that did not
   * happen. That is the same category of invented number as the 100k users the
   * funnel used to advertise, and it carries real legal exposure on top.
   *
   * What replaces it is anchoring against something true: what 299 EGP buys
   * elsewhere, and what it works out to per lesson. Both are checkable, and a
   * reader who checks ends up more convinced rather than less.
   */
  offerNote: "دفعة واحدة · وصول مدى الحياة",
  /** One payment opens every track — see `lib/access.ts`. */
  grantsAllCourses: true,
} as const;

/**
 * The public accounts, in the order they matter for this audience.
 *
 * Facebook and TikTok carry the reach in Egypt; Instagram takes the same
 * vertical video for free; X is here so the handle is claimed and the
 * Organization entity in search links to it — not because it is a channel
 * worth writing for yet.
 *
 * One handle everywhere, so someone who sees it once can find the rest.
 */
export const social = [
  { key: "facebook", label: "فيسبوك", handle: "Tawwerni", url: "https://facebook.com/Tawwerni" },
  { key: "tiktok", label: "تيك توك", handle: "@Tawwerni", url: "https://tiktok.com/@Tawwerni" },
  { key: "instagram", label: "إنستجرام", handle: "@Tawwerni", url: "https://instagram.com/Tawwerni" },
  { key: "x", label: "إكس", handle: "@Tawwerni", url: "https://x.com/Tawwerni" },
] as const;

export const referral = {
  /** Paid to the referrer once the referred person's order is approved. */
  commissionEgp: 50,
  /** Withdrawals open at this balance. */
  minPayoutEgp: 500,
  /** Query parameter that carries a referral code. */
  param: "ref",
  /** How long a referral click stays attributed, in days. */
  cookieDays: 30,
} as const;

export const payment = {
  vodafoneCash: ["01200176755", "01067558133"],
  instapay: ["hhifzy@instapay", "01067558133"],
  supportWhatsapp: "01069999557",
  supportEmail: "Tawwerni@gmail.com",
  activationHours: 24,
} as const;
