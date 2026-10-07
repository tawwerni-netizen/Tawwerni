import { pricing } from "@/content/brand";
import { getTrackBySlug } from "@/content/tracks100";
import { getCareerPathBySlug } from "@/content/career-paths";

export type ProductType = "track" | "career_path";

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
    type === "career_path" || type === "bundle" ? "career_path" : "track";

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
      originalPriceEgp: pricing.originalCareerPathPriceEgp,
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
    originalPriceEgp: pricing.originalTrackPriceEgp,
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
