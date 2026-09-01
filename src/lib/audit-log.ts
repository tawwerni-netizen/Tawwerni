import { prisma } from "@/lib/prisma";

/**
 * Records one admin action. Never throws into the caller — a logging failure
 * must not be the reason an order approval or a payout settlement fails, so
 * this swallows its own errors and reports them to the server console instead.
 */
export async function logAdminAction({
  admin,
  action,
  targetType,
  targetId,
  detail,
}: {
  admin: { id: string; email: string };
  action: string;
  targetType: string;
  targetId?: string;
  detail?: string;
}) {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId: admin.id,
        adminEmail: admin.email,
        action,
        targetType,
        targetId,
        detail,
      },
    });
  } catch (err) {
    console.error("audit log write failed:", err);
  }
}
