import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminUser, isSuperAdminEmail } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit-log";

/**
 * Endpoint to promote any user to Admin or revoke Admin status.
 *
 * Security safeguards:
 * - Only an authenticated admin can access this route.
 * - Super admin accounts (hhifzy@gmail.com, tawwerni@gmail.com) can never have their admin status revoked.
 * - The calling admin cannot revoke admin from their own account to prevent lockouts.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرّح لك بالدخول" }, { status: 401 });
  }

  const { userId } = await params;
  let body: { grant?: boolean } = {};
  try {
    body = await request.json();
  } catch {
    body = { grant: true };
  }
  const shouldGrant = body.grant !== false;

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, isAdmin: true },
  });

  if (!target) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  // Security checks when revoking admin rights
  if (!shouldGrant) {
    if (isSuperAdminEmail(target.email)) {
      return NextResponse.json(
        { error: "لا يمكن إلغاء صلاحية الأدمن عن حساب المالك الرئيسي للمنصة." },
        { status: 403 }
      );
    }
    if (target.id === admin.id) {
      return NextResponse.json(
        { error: "لا يمكنك إلغاء صلاحية الأدمن عن حسابك الحالي لتجنب إغلاق لوحة التحكم." },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isAdmin: shouldGrant },
    select: { id: true, email: true, name: true, isAdmin: true },
  });

  await logAdminAction({
    admin,
    action: shouldGrant ? "user.admin_grant" : "user.admin_revoke",
    targetType: "user",
    targetId: target.id,
    detail: `${shouldGrant ? "Promoted to Admin" : "Revoked Admin from"} ${target.email}`,
  });

  return NextResponse.json({
    ok: true,
    isAdmin: updated.isAdmin,
    message: shouldGrant
      ? `تم ترقية ${target.name || target.email} إلى مسؤول (Admin) بنجاح! 🛡️`
      : `تم إلغاء صلاحيات المسؤول عن ${target.name || target.email} بنجاح.`,
  });
}
