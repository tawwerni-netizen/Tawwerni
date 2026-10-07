import { prisma } from "@/lib/prisma";
import { pricing } from "@/content/brand";
import {
  canUserAccessTrack,
  canUserAccessCareerPath,
  hasLegacyFullAccess,
  getUserInventory,
  grantUserEntitlement,
  revokeUserEntitlement,
  FREE_PREVIEW_DAY,
  type TrackAccessResult,
  type CareerPathAccessResult,
  type UserInventory,
} from "@/lib/entitlements";

export {
  FREE_PREVIEW_DAY,
  canUserAccessTrack,
  canUserAccessCareerPath,
  hasLegacyFullAccess,
  getUserInventory,
  grantUserEntitlement,
  revokeUserEntitlement,
  type TrackAccessResult,
  type CareerPathAccessResult,
  type UserInventory,
};

/** True once the learner has any approved order at all. */
export async function hasAnyApprovedOrder(userId: string) {
  const order = await prisma.order.findFirst({
    where: { userId, status: "approved" },
    select: { id: true },
  });
  return order !== null;
}

export async function approvedCourseIds(userId: string): Promise<Set<string>> {
  const inventory = await getUserInventory(userId);
  if (inventory.isAdmin || inventory.isLegacyFullAccess) {
    const all = await prisma.course.findMany({
      where: { isComingSoon: false },
      select: { id: true },
    });
    return new Set<string>(all.map((c: { id: string }) => c.id));
  }

  // Get courses matching unlocked tracks
  const unlockedSlugs = Array.from(inventory.unlockedTrackSlugs);
  const matchedCourses = await prisma.course.findMany({
    where: { slug: { in: unlockedSlugs } },
    select: { id: true },
  });

  // Also include any direct course orders for backwards compatibility
  const directOrders = await prisma.order.findMany({
    where: { userId, status: "approved" },
    select: { courseId: true },
  });

  const ids = new Set<string>(matchedCourses.map((c: { id: string }) => c.id));
  for (const o of directOrders) {
    if (o.courseId) ids.add(o.courseId);
  }

  return ids;
}

export async function hasCourseAccess(userId: string, courseIdOrSlug: string) {
  if (!userId || !courseIdOrSlug) return false;

  // Find course slug if an ID was passed, or check directly
  let slug = courseIdOrSlug;
  if (courseIdOrSlug.length > 20 && !courseIdOrSlug.includes("-")) {
    const course = await prisma.course.findUnique({
      where: { id: courseIdOrSlug },
      select: { slug: true },
    });
    if (course) slug = course.slug;
  }

  const result = await canUserAccessTrack(userId, slug);
  return result.hasAccess;
}

/**
 * A pending order blocking this course. With all-access pricing any pending
 * order counts, since paying once is what unlocks everything.
 */
export async function pendingOrderFor(userId: string, courseId: string) {
  return prisma.order.findFirst({
    where: {
      userId,
      status: "pending",
      ...(pricing.grantsAllCourses ? {} : { courseId }),
    },
    select: { id: true, createdAt: true, method: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * True if user unlocked the VIP Vault (has approved order with amountEgp >= 440, or is admin).
 */
export async function hasVipAccess(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true, email: true },
  });
  if (user?.isAdmin || user?.email?.toLowerCase() === "hhifzy@gmail.com") {
    return true;
  }

  const vipOrder = await prisma.order.findFirst({
    where: {
      userId,
      status: "approved",
      OR: [
        { amountEgp: { gte: 440 } },
        { amountEgp: { in: [199, 200, 99, 100] } },
        { method: { in: ["admin_vip_grant", "vip_upgrade"] } },
        { proofChannel: "vip_vault" },
      ],
    },
    select: { id: true },
  });
  return vipOrder !== null;
}

