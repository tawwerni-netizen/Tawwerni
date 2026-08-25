import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { activateOrder } from "@/lib/activate-order";

const VALID_STATUS = ["approved", "rejected", "pending"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { orderId } = await params;
  const { status } = await request.json();
  if (!VALID_STATUS.includes(status)) {
    return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
  }

  // Approving goes through activateOrder so the learner gets the same
  // confirmation email as an automatically matched payment.
  if (status === "approved") {
    const activated = await activateOrder(orderId, "منح وصول يدوي");
    if (!activated) return NextResponse.json({ error: "الطلب مش موجود" }, { status: 404 });
    return NextResponse.json({ ok: true, ...activated });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status, approvedAt: null },
  });

  return NextResponse.json({ ok: true, order });
}
