import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit-log";
import { activateOrder } from "@/lib/activate-order";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح لك بالدخول" }, { status: 401 });

  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  // Check if user already has an approved order
  const existingApproved = user.orders.find((o) => o.status === "approved");
  if (existingApproved) {
    return NextResponse.json({
      ok: true,
      message: `حساب ${user.name || user.email} مفعّل بالفعل كمشترك`,
    });
  }

  // If there's a pending order, approve it
  const pendingOrder = user.orders.find((o) => o.status === "pending");
  if (pendingOrder) {
    await activateOrder(pendingOrder.id, "تفعيل يدوي مباشر من الأدمن");
    await logAdminAction({
      admin,
      action: "order.approve",
      targetType: "order",
      targetId: pendingOrder.id,
      detail: `Direct activation of pending order for ${user.email}`,
    });
    return NextResponse.json({
      ok: true,
      message: `تم تفعيل اشتراك ${user.name || user.email} بنجاح!`,
    });
  }

  // If no order exists at all, create an all-inclusive access order directly
  let defaultCourse = await prisma.course.findFirst({
    where: { isComingSoon: false },
    select: { id: true },
  });

  if (!defaultCourse) {
    defaultCourse = { id: "tahaddi-28-yawm" };
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      courseId: defaultCourse.id,
      amountEgp: 349,
      method: "admin_grant",
      senderPhone: user.phone || "ADMIN",
      status: "approved",
      approvedAt: new Date(),
    },
  });

  await activateOrder(order.id, "تفعيل فوري من لوحة الأدمن بدون طلب مسبق");

  await logAdminAction({
    admin,
    action: "user.activate",
    targetType: "user",
    targetId: user.id,
    detail: `Granted instant all-access membership to ${user.email}`,
  });

  return NextResponse.json({
    ok: true,
    message: `تم تفعيل حساب ${user.name || user.email} بنجاح ومنحه وصولاً لجميع الـ 100 مسار! 🎉`,
  });
}
