import { prisma } from "@/lib/prisma";
import { pricing } from "@/content/brand";

/**
 * Access rules.
 *
 * A single approved order is an all-access pass: whichever track the learner
 * paid through, every track opens. Day 1 of every course stays free so a
 * visitor can taste the format before paying.
 */
export const FREE_PREVIEW_DAY = 1;

/** True once the learner has any approved order at all. */
export async function hasAnyApprovedOrder(userId: string) {
  const order = await prisma.order.findFirst({
    where: { userId, status: "approved" },
    select: { id: true },
  });
  return order !== null;
}

export async function approvedCourseIds(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true, email: true },
  });
  const isAdmin = user?.isAdmin || user?.email?.toLowerCase() === "hhifzy@gmail.com";

  if (isAdmin || pricing.grantsAllCourses) {
    const hasOrder = isAdmin ? true : await hasAnyApprovedOrder(userId);
    if (hasOrder) {
      const all = await prisma.course.findMany({
        where: { isComingSoon: false },
        select: { id: true },
      });
      return new Set(all.map((c) => c.id));
    }
  }

  const orders = await prisma.order.findMany({
    where: { userId, status: "approved" },
    select: { courseId: true },
  });

  return new Set(orders.map((o) => o.courseId));
}

export async function hasCourseAccess(userId: string, courseId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true, email: true },
  });
  if (user?.isAdmin || user?.email?.toLowerCase() === "hhifzy@gmail.com") {
    return true;
  }

  if (pricing.grantsAllCourses) return hasAnyApprovedOrder(userId);

  const order = await prisma.order.findFirst({
    where: { userId, courseId, status: "approved" },
    select: { id: true },
  });
  return order !== null;
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
