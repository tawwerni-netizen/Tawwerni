import {
  CAREER_PATHS,
  getCareerPathBySlug,
  getCareerPathsForTrack,
  type CareerPath,
} from "@/content/career-paths";
import { ALL_100_TRACKS, getTrackBySlug, type Track100 } from "@/content/tracks100";
import type { UserInventory } from "@/lib/entitlements";
import { pricing } from "@/content/brand";

export type NextStepRecommendation = {
  type: "next_track_in_career_path" | "upgrade_to_career_path" | "complementary_track" | "featured_starter";
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  targetSlug: string;
  targetType: "track" | "career_path";
  ctaTextAr: string;
  ctaTextEn: string;
  ctaHref: string;
  icon: string;
  badgeAr?: string;
  badgeEn?: string;
  priceEgp?: number;
};

/**
 * Deterministically computes the user's best next learning step.
 */
export function getDeterministicRecommendation(
  inventory: UserInventory
): NextStepRecommendation {
  // 1. If user has an in-progress or owned Career Path, find the next incomplete track in it
  for (const ownedPath of inventory.ownedCareerPaths) {
    if (!ownedPath.isCompleted) {
      const fullPath = getCareerPathBySlug(ownedPath.slug);
      if (fullPath) {
        // Iterate stages and tracks in order
        for (const stage of fullPath.stages) {
          for (const trackRef of stage.tracks) {
            const trackItem = inventory.ownedTracks.find((t) => t.slug === trackRef.trackSlug);
            if (!trackItem || !trackItem.isCompleted) {
              const trackObj = getTrackBySlug(trackRef.trackSlug);
              return {
                type: "next_track_in_career_path",
                titleAr: trackObj?.titleAr || trackRef.milestoneAr,
                titleEn: trackObj?.titleEn || trackRef.milestoneEn,
                descriptionAr: `المحطة التالية في مسارك المهني (${ownedPath.titleAr}): ${trackRef.milestoneAr}`,
                descriptionEn: `Next milestone in your (${ownedPath.titleEn}) career path: ${trackRef.milestoneEn}`,
                targetSlug: trackRef.trackSlug,
                targetType: "track",
                ctaTextAr: trackItem && trackItem.progressPct > 0 ? "تابع دراسة المسار ➔" : "ابدأ هذا المسار الآن ➔",
                ctaTextEn: trackItem && trackItem.progressPct > 0 ? "Continue Track ➔" : "Start Track ➔",
                ctaHref: `/app/learn/${trackRef.trackSlug}`,
                icon: trackObj?.icon || "🎯",
                badgeAr: `المرحلة: ${stage.titleAr}`,
                badgeEn: `Stage: ${stage.titleEn}`,
              };
            }
          }
        }
      }
    }
  }

  // 2. If user owns individual tracks but NOT their parent Career Path, recommend the Career Path bundle!
  const directTracks = inventory.ownedTracks.filter((t) => t.source === "direct");
  for (const track of directTracks) {
    const parentPaths = getCareerPathsForTrack(track.slug);
    for (const { careerPath } of parentPaths) {
      if (!inventory.unlockedCareerPathSlugs.has(careerPath.slug)) {
        return {
          type: "upgrade_to_career_path",
          titleAr: careerPath.titleAr,
          titleEn: careerPath.titleEn,
          descriptionAr: `بما أنك تدرس (${track.titleAr})، يمكنك فتح خريطة طريق (${careerPath.titleAr}) كاملة بكافة مساراتها بـ ${pricing.careerPathPriceEgp} ج.م فقط!`,
          descriptionEn: `Since you own (${track.titleEn}), unlock the entire (${careerPath.titleEn}) path and all contained tracks for just ${pricing.careerPathPriceEgp} EGP!`,
          targetSlug: careerPath.slug,
          targetType: "career_path",
          ctaTextAr: `امتلك المسار المهني بالكامل (${pricing.careerPathPriceEgp} ج.م) ➔`,
          ctaTextEn: `Unlock Full Career Path (${pricing.careerPathPriceEgp} EGP) ➔`,
          ctaHref: `/quiz/checkout?type=career_path&slug=${careerPath.slug}`,
          icon: careerPath.icon || "🚀",
          badgeAr: "ترقية حزمة التخصص المهني",
          badgeEn: "Career Path Bundle",
          priceEgp: pricing.careerPathPriceEgp,
        };
      }
    }
  }

  // 3. If user completed tracks, recommend the next track in the same pillar
  const completedTracks = inventory.ownedTracks.filter((t) => t.isCompleted);
  if (completedTracks.length > 0) {
    const lastCompleted = completedTracks[0];
    const complementary = ALL_100_TRACKS.find(
      (t) => t.pillarId === lastCompleted.pillarId && !inventory.unlockedTrackSlugs.has(t.slug)
    );
    if (complementary) {
      return {
        type: "complementary_track",
        titleAr: complementary.titleAr,
        titleEn: complementary.titleEn,
        descriptionAr: `مهارة متقدمة تبني مباشرة على إنجازك في (${lastCompleted.titleAr})`,
        descriptionEn: `Advanced complementary skill building upon your success in (${lastCompleted.titleEn})`,
        targetSlug: complementary.slug,
        targetType: "track",
        ctaTextAr: `امتلك هذا المسار (${pricing.trackPriceEgp} ج.م) ➔`,
        ctaTextEn: `Get This Track (${pricing.trackPriceEgp} EGP) ➔`,
        ctaHref: `/quiz/checkout?type=track&slug=${complementary.slug}`,
        icon: complementary.icon,
        badgeAr: "المهارة المكملة المقترحة",
        badgeEn: "Suggested Next Skill",
        priceEgp: pricing.trackPriceEgp,
      };
    }
  }

  // 4. Default: Featured starting Career Path
  const defaultPath = CAREER_PATHS[0] || {
    slug: "fullstack-web-developer",
    titleAr: "مطور تطبيقات ويب متكامل",
    titleEn: "Full-Stack Web Developer",
    icon: "💻",
    descriptionAr: "الخريطة الأكثر طلباً لتأسيسك البرمجي وبناء مشاريع حقيقية لسوق العمل",
    descriptionEn: "Most in-demand roadmap for full-stack engineering and real portfolio projects",
  };

  return {
    type: "featured_starter",
    titleAr: defaultPath.titleAr,
    titleEn: defaultPath.titleEn,
    descriptionAr: defaultPath.descriptionAr,
    descriptionEn: defaultPath.descriptionEn,
    targetSlug: defaultPath.slug,
    targetType: "career_path",
    ctaTextAr: `استكشف المسار المهني (${pricing.careerPathPriceEgp} ج.م) ➔`,
    ctaTextEn: `Explore Career Path (${pricing.careerPathPriceEgp} EGP) ➔`,
    ctaHref: `/career-paths/${defaultPath.slug}`,
    icon: defaultPath.icon,
    badgeAr: "المسار الأبرز للمبتدئين",
    badgeEn: "Top Career Pathway",
    priceEgp: pricing.careerPathPriceEgp,
  };
}
