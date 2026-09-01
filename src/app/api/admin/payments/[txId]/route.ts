import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { activateOrder } from "@/lib/activate-order";
import { logAdminAction } from "@/lib/audit-log";

/**
 * Manual resolution for transfers the matcher parked.
 *
 * "link" attaches the transfer to an order and activates it; "ignore" marks it
 * as handled without activating anything (refunds, wrong sender, test sends).
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ txId: string }> }) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { txId } = await params;
  const { action, orderId } = await readJson(request);

  const tx = await prisma.paymentTransaction.findUnique({ where: { id: txId } });
  if (!tx) return NextResponse.json({ error: "التحويل مش موجود" }, { status: 404 });
  if (tx.status === "matched") {
    return NextResponse.json({ error: "التحويل ده متربط بطلب بالفعل" }, { status: 409 });
  }

  if (action === "ignore") {
    await prisma.paymentTransaction.update({
      where: { id: txId },
      data: { status: "ignored", matchNote: "اتجاهل يدويًا" },
    });
    await logAdminAction({ admin, action: "payment.ignore", targetType: "payment_transaction", targetId: txId });
    return NextResponse.json({ ok: true });
  }

  if (action !== "link" || typeof orderId !== "string") {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, course: true },
  });
  if (!order) return NextResponse.json({ error: "الطلب مش موجود" }, { status: 404 });

  await prisma.paymentTransaction.update({
    where: { id: txId },
    data: { status: "matched", matchedOrderId: order.id, matchNote: "ربط يدوي" },
  });
  await activateOrder(order.id, "ربط يدوي");
  await logAdminAction({
    admin,
    action: "payment.link",
    targetType: "payment_transaction",
    targetId: txId,
    detail: `order ${order.id} · ${order.user.email}`,
  });

  return NextResponse.json({
    ok: true,
    email: order.user.email,
    courseTitle: order.course.title,
  });
}
