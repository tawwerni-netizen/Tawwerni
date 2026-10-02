import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit-log";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح لك بالدخول" }, { status: 401 });

  const { userId } = await params;
  let body: { grant?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    body = { grant: true };
  }
  const shouldGrant = body.grant !== false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  if (shouldGrant) {
    const existingApproved = user.orders.find((o) => o.status === "approved");

    if (existingApproved) {
      if (
        existingApproved.amountEgp >= 440 ||
        existingApproved.method === "admin_vip_grant" ||
        existingApproved.proofChannel === "vip_vault"
      ) {
        return NextResponse.json({
          ok: true,
          isVip: true,
          message: `المستخدم ${user.name || user.email} لديه وصول VIP بالفعل ومكتبة الـ 1000 برومبت مفعّلة!`,
        });
      }

      await prisma.order.update({
        where: { id: existingApproved.id },
        data: {
          amountEgp: 448,
          proofChannel: "vip_vault",
        },
      });
    } else {
      let defaultCourse = await prisma.course.findFirst({
        where: { isComingSoon: false },
        select: { id: true },
      });
      if (!defaultCourse) {
        defaultCourse = { id: "tahaddi-28-yawm" };
      }

      await prisma.order.create({
        data: {
          userId: user.id,
          courseId: defaultCourse.id,
          amountEgp: 448,
          method: "admin_vip_grant",
          proofChannel: "vip_vault",
          senderPhone: user.phone || "ADMIN",
          status: "approved",
          approvedAt: new Date(),
        },
      });
    }

    await logAdminAction({
      admin,
      action: "user.vip_grant",
      targetType: "user",
      targetId: user.id,
      detail: `Granted VIP Vault & 1000 Prompts library to ${user.email}`,
    });

    return NextResponse.json({
      ok: true,
      isVip: true,
      message: `تمت ترقية ${user.name || user.email} إلى VIP ومنحه مكتبة الـ 1000 برومبت وعقود الفريلانس بنجاح! 👑`,
    });
  } else {
    for (const order of user.orders) {
      if (order.method === "admin_vip_grant") {
        await prisma.order.delete({ where: { id: order.id } });
      } else if (order.proofChannel === "vip_vault" || order.amountEgp >= 440) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            amountEgp: 349,
            proofChannel: null,
          },
        });
      }
    }

    await logAdminAction({
      admin,
      action: "user.vip_revoke",
      targetType: "user",
      targetId: user.id,
      detail: `Revoked VIP access from ${user.email}`,
    });

    return NextResponse.json({
      ok: true,
      isVip: false,
      message: `تم إلغاء ترقية VIP للمستخدم ${user.name || user.email}`,
    });
  }
}
