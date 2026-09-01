import { NextResponse } from "next/server";
import { readJson, isOneOf } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { activateOrder } from "@/lib/activate-order";
import { logAdminAction } from "@/lib/audit-log";

const VALID_STATUS = ["approved", "rejected", "pending"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { orderId } = await params;
  const { status } = await readJson(request);
  if (!isOneOf(status, VALID_STATUS)) {
    return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
  }

  // Approving goes through activateOrder so the learner gets the same
  // confirmation email as an automatically matched payment.
  if (status === "approved") {
    const activated = await activateOrder(orderId, "منح وصول يدوي");
    if (!activated) return NextResponse.json({ error: "الطلب مش موجود" }, { status: 404 });
    await logAdminAction({ admin, action: "order.approve", targetType: "order", targetId: orderId });
    return NextResponse.json({ ok: true, ...activated });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status, approvedAt: null },
  });
  await logAdminAction({
    admin,
    action: status === "rejected" ? "order.reject" : "order.set_pending",
    targetType: "order",
    targetId: orderId,
  });

  return NextResponse.json({ ok: true, order });
}
