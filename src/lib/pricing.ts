import { pricing } from "@/content/brand";
export { pricing };
import { getTrackBySlug } from "@/content/tracks100";
import { getCareerPathBySlug } from "@/content/career-paths";

export type ProductType = "track" | "career_path" | "all_access";

export type ProductDetails = {
  type: ProductType;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  priceEgp: number;
  originalPriceEgp: number;
  includedTracksCount?: number;
};

/**
 * Resolves product information strictly server-side.
 */
export function resolveProduct(
  type: string = "track",
  slug: string
): ProductDetails | null {
  if (!slug) return null;

  const normalizedType: ProductType =
    type === "all_access" || slug === "all_access" || slug === "all-access" || slug === "global_all_access"
      ? "all_access"
      : type === "career_path" || type === "bundle"
      ? "career_path"
      : "track";

  if (normalizedType === "all_access") {
    return {
      type: "all_access",
      slug: "all_access",
      titleAr: "الوصول الشامل لكافة الكورسات والمسارات المهنية (All-Access Pass)",
      titleEn: "All-Access Pass (All 100 Tracks & Career Paths)",
      descriptionAr: "فتح فوري لكافة الـ 100 مسار تخصصي وجميع المسارات المهنية الـ 11 ومحتويات المنصة مدى الحياة",
      descriptionEn: "Unrestricted lifetime access to all 100 tracks, all 11 career paths, and future content",
      icon: "👑",
      priceEgp: pricing.allAccessPriceEgp, // strictly 350 EGP
      originalPriceEgp: pricing.allAccessPriceEgp,
      includedTracksCount: 100,
    };
  }

  if (normalizedType === "career_path") {
    const cp = getCareerPathBySlug(slug);
    if (!cp) return null;

    const totalTracks = cp.stages.reduce((acc, s) => acc + s.tracks.length, 0);

    return {
      type: "career_path",
      slug: cp.slug,
      titleAr: cp.titleAr,
      titleEn: cp.titleEn,
      descriptionAr: cp.descriptionAr,
      descriptionEn: cp.descriptionEn,
      icon: cp.icon,
      priceEgp: pricing.careerPathPriceEgp, // strictly 100 EGP
      originalPriceEgp: pricing.careerPathPriceEgp,
      includedTracksCount: totalTracks,
    };
  }

  // Otherwise individual track
  const track = getTrackBySlug(slug);
  if (!track) return null;

  return {
    type: "track",
    slug: track.slug,
    titleAr: track.titleAr,
    titleEn: track.titleEn,
    descriptionAr: track.descriptionAr,
    descriptionEn: track.descriptionEn,
    icon: track.icon,
    priceEgp: pricing.trackPriceEgp, // strictly 50 EGP
    originalPriceEgp: pricing.trackPriceEgp,
    includedTracksCount: 1,
  };
}

/**
 * Validates product price on the server side to guarantee zero client-side tampering.
 */
export function calculateOrderPrice({
  productType,
  productSlug,
  withOrderBump = false,
}: {
  productType?: string;
  productSlug: string;
  withOrderBump?: boolean;
}): {
  product: ProductDetails;
  basePriceEgp: number;
  orderBumpPriceEgp: number;
  totalPriceEgp: number;
} | null {
  const product = resolveProduct(productType, productSlug);
  if (!product) return null;

  const basePriceEgp = product.priceEgp;
  const orderBumpPriceEgp = withOrderBump ? pricing.orderBumpPriceEgp : 0;
  const totalPriceEgp = basePriceEgp + orderBumpPriceEgp;

  return {
    product,
    basePriceEgp,
    orderBumpPriceEgp,
    totalPriceEgp,
  };
}

/**
 * Calculates smart upgrade price by crediting already-paid amounts.
 */
export function calculateUpgradePrice({
  userPaidAmountEgp = 0,
  targetProductType,
  targetProductSlug,
}: {
  userPaidAmountEgp?: number;
  targetProductType: ProductType;
  targetProductSlug: string;
}): {
  fullPriceEgp: number;
  creditEgp: number;
  upgradePriceEgp: number;
} {
  const product = resolveProduct(targetProductType, targetProductSlug);
  const fullPriceEgp = product?.priceEgp ?? (targetProductType === "all_access" ? 350 : targetProductType === "career_path" ? 100 : 50);
  const creditEgp = Math.min(userPaidAmountEgp, fullPriceEgp);
  const upgradePriceEgp = Math.max(0, fullPriceEgp - creditEgp);
  return {
    fullPriceEgp,
    creditEgp,
    upgradePriceEgp,
  };
}
