import { prisma } from "@/lib/prisma";

/**
 * A course is unlocked for a user only once an order for it has been approved
 * from the admin panel — that is the manual "grant access within 24h" step.
 * Day 1 of every course stays open as a free preview so visitors can taste the
 * format before paying.
 */
export const FREE_PREVIEW_DAY = 1;

export async function approvedCourseIds(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId, status: "approved" },
    select: { courseId: true },
  });
  return new Set(orders.map((o) => o.courseId));
}

export async function hasCourseAccess(userId: string, courseId: string) {
  const order = await prisma.order.findFirst({
    where: { userId, courseId, status: "approved" },
    select: { id: true },
  });
  return order !== null;
}

export async function pendingOrderFor(userId: string, courseId: string) {
  return prisma.order.findFirst({
    where: { userId, courseId, status: "pending" },
    select: { id: true, createdAt: true, method: true },
  });
}
