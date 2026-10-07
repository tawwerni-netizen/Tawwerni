import { prisma } from "@/lib/prisma";
import { pricing } from "@/content/brand";
import {
  CAREER_PATHS,
  getCareerPathBySlug,
  getCareerPathsForTrack,
  type CareerPath,
} from "@/content/career-paths";
import { ALL_100_TRACKS, getTrackBySlug, type Track100 } from "@/content/tracks100";

export const FREE_PREVIEW_DAY = 1;

export type ProductType = "track" | "career_path" | "legacy_full_access" | "all_access";

export type AccessReason =
  | "ADMIN"
  | "LEGACY_FULL_ACCESS"
  | "ALL_ACCESS_PASS"
  | "DIRECT_TRACK"
  | "CAREER_PATH_BUNDLE"
  | "ORDER_APPROVED"
  | "FREE_PREVIEW"
  | "NONE";

export type TrackAccessResult = {
  hasAccess: boolean;
  reason: AccessReason;
  careerPathSlug?: string;
  careerPathTitleAr?: string;
  careerPathTitleEn?: string;
};

export type CareerPathAccessResult = {
  hasAccess: boolean;
  reason: AccessReason;
};

export type OwnedTrackItem = {
  slug: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  pillarId: number;
  pillarNameAr: string;
  pillarNameEn: string;
  totalLessons: number;
  completedLessons: number;
  progressPct: number;
  isCompleted: boolean;
  source: "direct" | "career_path" | "legacy" | "all_access";
  viaCareerPathSlug?: string;
  viaCareerPathTitleAr?: string;
  viaCareerPathTitleEn?: string;
};

export type OwnedCareerPathItem = {
  slug: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  icon: string;
  totalTracks: number;
  completedTracks: number;
  totalLessons: number;
  completedLessons: number;
  progressPct: number;
  isCompleted: boolean;
  trackSlugs: string[];
};

export type UserInventory = {
  userId: string;
  isLegacyFullAccess: boolean;
  isAllAccess: boolean;
  userPaidAmountEgp: number;
  isAdmin: boolean;
  ownedCareerPaths: OwnedCareerPathItem[];
  ownedTracks: OwnedTrackItem[];
  unlockedTrackSlugs: Set<string>;
  unlockedCareerPathSlugs: Set<string>;
  totalCompletedTracks: number;
  totalCompletedLessons: number;
  totalEarnedXp: number;
  lastActiveTrackSlug?: string;
};

let tableInitialized = false;

/**
 * Ensures the UserEntitlement table exists in MariaDB/MySQL without breaking migrations.
 */
export async function ensureEntitlementsTable(): Promise<void> {
  if (tableInitialized) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`UserEntitlement\` (
        \`id\` VARCHAR(191) NOT NULL PRIMARY KEY,
        \`userId\` VARCHAR(191) NOT NULL,
        \`productType\` VARCHAR(191) NOT NULL,
        \`productSlug\` VARCHAR(191) NOT NULL,
        \`source\` VARCHAR(191) NOT NULL DEFAULT 'direct_purchase',
        \`orderId\` VARCHAR(191) NULL,
        \`grantedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE KEY \`UserEntitlement_userId_productType_productSlug_key\` (\`userId\`, \`productType\`, \`productSlug\`),
        INDEX \`UserEntitlement_userId_idx\` (\`userId\`),
        INDEX \`UserEntitlement_productSlug_idx\` (\`productSlug\`),
        INDEX \`UserEntitlement_productType_idx\` (\`productType\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
    tableInitialized = true;
  } catch (err) {
    // If table already exists or permissions restrict DDL, continue gracefully
    tableInitialized = true;
  }
}

/**
 * Check if user is an admin.
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true, email: true },
    });
    return Boolean(user?.isAdmin || user?.email?.toLowerCase() === "hhifzy@gmail.com");
  } catch {
    return false;
  }
}

/**
 * Check if user has Legacy Full Access.
 * Guaranteed backward compatibility:
 * - Admin
 * - User flagged with hasLegacyAccess
 * - Entitlement row with productType === "legacy_full_access"
 * - Approved order with amountEgp >= 300 (legacy 349/350 EGP subscription)
 * - User is marked VIP or has VIP order
 */
export async function hasLegacyFullAccess(userId: string): Promise<boolean> {
  if (!userId) return false;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true, email: true, hasLegacyAccess: true },
    });

    if (user?.isAdmin || user?.email?.toLowerCase() === "hhifzy@gmail.com") {
      return true;
    }

    if (user?.hasLegacyAccess) {
      return true;
    }

    // Check entitlement table
    await ensureEntitlementsTable();
    const legacyEntitlement = await prisma.userEntitlement.findFirst({
      where: {
        userId,
        productType: { in: ["legacy_full_access", "all_access", "all_access_pass"] },
      },
      select: { id: true },
    });
    if (legacyEntitlement) return true;

    // Backward-compatibility fallback: check if user has any approved legacy order >= 300 EGP or all_access
    const legacyOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: "approved",
        OR: [
          { amountEgp: { gte: 300 } },
          { productType: { in: ["legacy_full_access", "all_access", "all_access_pass"] } },
          { proofChannel: "vip_vault" },
        ],
      },
      select: { id: true },
    });

    if (legacyOrder) {
      // Auto-backfill user flag so future checks are immediate
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { hasLegacyAccess: true },
        });
      } catch {}
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Determine whether a user can access a specific Track.
 */
export async function canUserAccessTrack(
  userId: string,
  trackSlug: string
): Promise<TrackAccessResult> {
  if (!userId || !trackSlug) {
    return { hasAccess: false, reason: "NONE" };
  }

  // 1. Admin check
  if (await isUserAdmin(userId)) {
    return { hasAccess: true, reason: "ADMIN" };
  }

  // 2. Legacy / All-Access pass check
  if (await hasLegacyFullAccess(userId)) {
    return { hasAccess: true, reason: "ALL_ACCESS_PASS" };
  }

  await ensureEntitlementsTable();

  // 3. Direct track entitlement
  const directTrack = await prisma.userEntitlement.findFirst({
    where: {
      userId,
      productType: "track",
      productSlug: trackSlug,
    },
    select: { id: true },
  });
  if (directTrack) {
    return { hasAccess: true, reason: "DIRECT_TRACK" };
  }

  // 4. Career path bundle entitlement: Check if user owns ANY career path containing this track
  const parentPaths = getCareerPathsForTrack(trackSlug);
  if (parentPaths.length > 0) {
    const parentPathSlugs = parentPaths.map((p) => p.careerPath.slug);
    const ownedPath = await prisma.userEntitlement.findFirst({
      where: {
        userId,
        productType: "career_path",
        productSlug: { in: parentPathSlugs },
      },
      select: { productSlug: true },
    });

    if (ownedPath) {
      const cp = getCareerPathBySlug(ownedPath.productSlug);
      return {
        hasAccess: true,
        reason: "CAREER_PATH_BUNDLE",
        careerPathSlug: ownedPath.productSlug,
        careerPathTitleAr: cp?.titleAr,
        careerPathTitleEn: cp?.titleEn,
      };
    }
  }

  // 5. Fallback: check approved direct orders
  const directOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: "approved",
      OR: [
        { productSlug: trackSlug },
        { course: { slug: trackSlug } },
      ],
    },
    select: { id: true },
  });
  if (directOrder) {
    return { hasAccess: true, reason: "ORDER_APPROVED" };
  }

  return { hasAccess: false, reason: "NONE" };
}

/**
 * Determine whether a user can access a specific Career Path.
 */
export async function canUserAccessCareerPath(
  userId: string,
  careerPathSlug: string
): Promise<CareerPathAccessResult> {
  if (!userId || !careerPathSlug) {
    return { hasAccess: false, reason: "NONE" };
  }

  // 1. Admin check
  if (await isUserAdmin(userId)) {
    return { hasAccess: true, reason: "ADMIN" };
  }

  // 2. Legacy full access check
  if (await hasLegacyFullAccess(userId)) {
    return { hasAccess: true, reason: "LEGACY_FULL_ACCESS" };
  }

  await ensureEntitlementsTable();

  // 3. Career path entitlement
  const ownedPath = await prisma.userEntitlement.findFirst({
    where: {
      userId,
      productType: "career_path",
      productSlug: careerPathSlug,
    },
    select: { id: true },
  });
  if (ownedPath) {
    return { hasAccess: true, reason: "CAREER_PATH_BUNDLE" };
  }

  // 4. Approved order for this career path
  const pathOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: "approved",
      productType: "career_path",
      productSlug: careerPathSlug,
    },
    select: { id: true },
  });
  if (pathOrder) {
    return { hasAccess: true, reason: "ORDER_APPROVED" };
  }

  return { hasAccess: false, reason: "NONE" };
}

/**
 * Grant entitlement to a user (Idempotent).
 */
export async function grantUserEntitlement({
  userId,
  productType,
  productSlug,
  source = "direct_purchase",
  orderId,
}: {
  userId: string;
  productType: ProductType;
  productSlug: string;
  source?: string;
  orderId?: string;
}): Promise<void> {
  await ensureEntitlementsTable();

  if (productType === "legacy_full_access" || productType === "all_access") {
    await prisma.user.update({
      where: { id: userId },
      data: { hasLegacyAccess: true },
    });
  }

  await prisma.userEntitlement.upsert({
    where: {
      userId_productType_productSlug: {
        userId,
        productType,
        productSlug,
      },
    },
    update: {
      source,
      orderId: orderId ?? undefined,
    },
    create: {
      userId,
      productType,
      productSlug,
      source,
      orderId: orderId ?? null,
    },
  });
}

/**
 * Revoke entitlement from a user.
 */
export async function revokeUserEntitlement({
  userId,
  productType,
  productSlug,
}: {
  userId: string;
  productType: ProductType;
  productSlug: string;
}): Promise<void> {
  await ensureEntitlementsTable();

  if (productType === "legacy_full_access") {
    await prisma.user.update({
      where: { id: userId },
      data: { hasLegacyAccess: false },
    });
  }

  await prisma.userEntitlement.deleteMany({
    where: {
      userId,
      productType,
      productSlug,
    },
  });
}

/**
 * Calculates user's verified settled purchase credit ledger for upgrades.
 */
export async function getEligiblePurchaseCredit(userId: string): Promise<{
  totalPaidEgp: number;
  eligibleCreditEgp: number;
  settledOrders: {
    id: string;
    productType: string;
    productSlug: string;
    amountEgp: number;
    createdAt: Date;
  }[];
}> {
  if (!userId) {
    return { totalPaidEgp: 0, eligibleCreditEgp: 0, settledOrders: [] };
  }

  // Only approved orders, not refunded or cancelled
  const orders = await prisma.order.findMany({
    where: {
      userId,
      status: "approved",
    },
    select: {
      id: true,
      productType: true,
      productSlug: true,
      amountEgp: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const totalPaid = orders.reduce((sum, o) => sum + (o.amountEgp || 0), 0);
  const eligibleCredit = Math.min(399, totalPaid);

  return {
    totalPaidEgp: totalPaid,
    eligibleCreditEgp: eligibleCredit,
    settledOrders: orders.map((o) => ({
      id: o.id,
      productType: o.productType || "track",
      productSlug: o.productSlug || "",
      amountEgp: o.amountEgp,
      createdAt: o.createdAt,
    })),
  };
}

/**
 * Retrieve raw user entitlements list.
 */
export async function getUserEntitlements(userId: string) {
  if (!userId) return [];
  await ensureEntitlementsTable();
  return prisma.userEntitlement.findMany({
    where: { userId },
    orderBy: { grantedAt: "desc" },
  });
}

/**
 * Get explainable source of access for a track.
 */
export async function getTrackAccessSource(userId: string, trackSlug: string): Promise<string> {
  const result = await canUserAccessTrack(userId, trackSlug);
  return result.reason;
}

/**
 * Get explainable source of access for a career path.
 */
export async function getCareerPathAccessSource(userId: string, careerPathSlug: string): Promise<string> {
  const result = await canUserAccessCareerPath(userId, careerPathSlug);
  return result.reason;
}

export const canAccessTrack = canUserAccessTrack;
export const canAccessCareerPath = canUserAccessCareerPath;

/**
 * Get comprehensive learning inventory for a user.
 */
export async function getUserInventory(userId: string): Promise<UserInventory> {
  const isAdmin = await isUserAdmin(userId);
  const isLegacy = await hasLegacyFullAccess(userId);

  await ensureEntitlementsTable();

  // Load user entitlements
  const entitlements = await prisma.userEntitlement.findMany({
    where: { userId },
    select: { productType: true, productSlug: true, source: true },
  });

  // Load user lesson completions
  const completions = await prisma.lessonCompletion.findMany({
    where: { userId },
    select: {
      lessonId: true,
      score: true,
      xpEarned: true,
      lesson: {
        select: {
          module: {
            select: {
              course: {
                select: { slug: true },
              },
            },
          },
        },
      },
    },
  });

  // Calculate lesson completions count per track slug
  const completedLessonsByTrackSlug = new Map<string, number>();
  let totalEarnedXp = 0;
  for (const c of completions) {
    totalEarnedXp += c.xpEarned;
    const trackSlug = c.lesson?.module?.course?.slug;
    if (trackSlug) {
      completedLessonsByTrackSlug.set(
        trackSlug,
        (completedLessonsByTrackSlug.get(trackSlug) || 0) + 1
      );
    }
  }

  const directTrackEntitlements = new Set(
    entitlements.filter((e) => e.productType === "track").map((e) => e.productSlug)
  );

  const careerPathEntitlements = new Set(
    entitlements.filter((e) => e.productType === "career_path").map((e) => e.productSlug)
  );

  // If user has approved orders that aren't yet in UserEntitlement, add them
  const approvedOrders = await prisma.order.findMany({
    where: { userId, status: "approved" },
    include: { course: true },
  });
  let userPaidAmountEgp = 0;
  for (const order of approvedOrders) {
    userPaidAmountEgp += order.amountEgp;
    if (order.productType === "career_path" && order.productSlug) {
      careerPathEntitlements.add(order.productSlug);
    } else if (order.productSlug) {
      directTrackEntitlements.add(order.productSlug);
    } else if (order.course?.slug) {
      directTrackEntitlements.add(order.course.slug);
    }
  }

  const isAllAccess =
    isAdmin ||
    isLegacy ||
    entitlements.some((e) => e.productType === "all_access" || e.productType === "legacy_full_access") ||
    approvedOrders.some((o) => o.productType === "all_access" || o.amountEgp >= 300);

  const unlockedTrackSlugs = new Set<string>();
  const unlockedCareerPathSlugs = new Set<string>();

  // If Admin, Legacy, or All-Access, every career path and every track is unlocked!
  if (isAdmin || isLegacy || isAllAccess) {
    for (const cp of CAREER_PATHS) {
      unlockedCareerPathSlugs.add(cp.slug);
    }
    for (const track of ALL_100_TRACKS) {
      unlockedTrackSlugs.add(track.slug);
    }
  } else {
    // Add explicitly owned career paths
    for (const slug of careerPathEntitlements) {
      unlockedCareerPathSlugs.add(slug);
    }
    // Add explicitly owned tracks
    for (const slug of directTrackEntitlements) {
      unlockedTrackSlugs.add(slug);
    }
    // Add tracks included in owned career paths
    for (const cpSlug of unlockedCareerPathSlugs) {
      const cp = getCareerPathBySlug(cpSlug);
      if (cp) {
        for (const stage of cp.stages) {
          for (const t of stage.tracks) {
            unlockedTrackSlugs.add(t.trackSlug);
          }
        }
      }
    }
  }

  // Build owned career paths items
  const ownedCareerPaths: OwnedCareerPathItem[] = [];
  const targetCareerPaths = (isAdmin || isLegacy || isAllAccess)
    ? CAREER_PATHS
    : CAREER_PATHS.filter((cp) => unlockedCareerPathSlugs.has(cp.slug));

  for (const cp of targetCareerPaths) {
    const pathTrackSlugs = cp.stages.flatMap((s) => s.tracks.map((t) => t.trackSlug));
    let completedTracksCount = 0;
    let totalLessonsCount = 0;
    let completedLessonsCount = 0;

    for (const tSlug of pathTrackSlugs) {
      const trackObj = getTrackBySlug(tSlug);
      const totalL = trackObj?.totalLessons || 28;
      const completedL = completedLessonsByTrackSlug.get(tSlug) || 0;
      totalLessonsCount += totalL;
      completedLessonsCount += Math.min(completedL, totalL);

      if (completedL >= totalL) {
        completedTracksCount += 1;
      }
    }

    const progressPct =
      totalLessonsCount > 0
        ? Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100))
        : 0;

    ownedCareerPaths.push({
      slug: cp.slug,
      titleAr: cp.titleAr,
      titleEn: cp.titleEn,
      taglineAr: cp.taglineAr,
      taglineEn: cp.taglineEn,
      icon: cp.icon,
      totalTracks: pathTrackSlugs.length,
      completedTracks: completedTracksCount,
      totalLessons: totalLessonsCount,
      completedLessons: completedLessonsCount,
      progressPct,
      isCompleted: completedTracksCount === pathTrackSlugs.length && pathTrackSlugs.length > 0,
      trackSlugs: pathTrackSlugs,
    });
  }

  // Build owned tracks items
  const ownedTracks: OwnedTrackItem[] = [];
  let totalCompletedTracks = 0;
  let totalCompletedLessons = 0;

  for (const trackSlug of unlockedTrackSlugs) {
    const trackObj = getTrackBySlug(trackSlug);
    if (!trackObj) continue;

    const totalLessons = trackObj.totalLessons || 28;
    const completedLessons = completedLessonsByTrackSlug.get(trackSlug) || 0;
    const isCompleted = completedLessons >= totalLessons;
    const progressPct = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

    if (isCompleted) totalCompletedTracks++;
    totalCompletedLessons += completedLessons;

    let source: "direct" | "career_path" | "legacy" | "all_access" = "direct";
    let viaCareerPathSlug: string | undefined;
    let viaCareerPathTitleAr: string | undefined;
    let viaCareerPathTitleEn: string | undefined;

    if (isAdmin || isLegacy) {
      source = "legacy";
    } else if (isAllAccess) {
      source = "all_access";
    } else if (directTrackEntitlements.has(trackSlug)) {
      source = "direct";
    } else {
      // Find which owned career path granted it
      const parentPaths = getCareerPathsForTrack(trackSlug);
      const matchedPath = parentPaths.find((p) =>
        unlockedCareerPathSlugs.has(p.careerPath.slug)
      );
      if (matchedPath) {
        source = "career_path";
        viaCareerPathSlug = matchedPath.careerPath.slug;
        viaCareerPathTitleAr = matchedPath.careerPath.titleAr;
        viaCareerPathTitleEn = matchedPath.careerPath.titleEn;
      }
    }

    ownedTracks.push({
      slug: trackObj.slug,
      titleAr: trackObj.titleAr,
      titleEn: trackObj.titleEn,
      icon: trackObj.icon,
      pillarId: trackObj.pillarId,
      pillarNameAr: trackObj.pillarNameAr,
      pillarNameEn: trackObj.pillarNameEn,
      totalLessons,
      completedLessons,
      progressPct,
      isCompleted,
      source,
      viaCareerPathSlug,
      viaCareerPathTitleAr,
      viaCareerPathTitleEn,
    });
  }

  // Sort tracks: in-progress first, then new, then completed
  ownedTracks.sort((a, b) => {
    if (a.progressPct > 0 && !a.isCompleted && (b.progressPct === 0 || b.isCompleted)) return -1;
    if (b.progressPct > 0 && !b.isCompleted && (a.progressPct === 0 || a.isCompleted)) return 1;
    return b.progressPct - a.progressPct;
  });

  // Calculate last active track slug
  let lastActiveTrackSlug: string | undefined;
  if (completions.length > 0) {
    const lastComp = completions[completions.length - 1];
    lastActiveTrackSlug = lastComp?.lesson?.module?.course?.slug;
  }
  if (!lastActiveTrackSlug && ownedTracks.length > 0) {
    const inProgress = ownedTracks.find((t) => t.progressPct > 0 && !t.isCompleted);
    lastActiveTrackSlug = inProgress?.slug || ownedTracks[0]?.slug;
  }

  return {
    userId,
    isLegacyFullAccess: isLegacy,
    isAllAccess,
    userPaidAmountEgp,
    isAdmin,
    ownedCareerPaths,
    ownedTracks,
    unlockedTrackSlugs,
    unlockedCareerPathSlugs,
    totalCompletedTracks,
    totalCompletedLessons,
    totalEarnedXp,
    lastActiveTrackSlug,
  };
}
