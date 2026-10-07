import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit-log";
import {
  ensureEntitlementsTable,
  grantUserEntitlement,
  revokeUserEntitlement,
  hasLegacyFullAccess,
  ProductType,
} from "@/lib/entitlements";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

  const { userId } = await params;
  await ensureEntitlementsTable();

  const [user, entitlements, isLegacy] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, hasLegacyAccess: true, isAdmin: true },
    }),
    prisma.userEntitlement.findMany({
      where: { userId },
      orderBy: { grantedAt: "desc" },
    }),
    hasLegacyFullAccess(userId),
  ]);

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    user,
    isLegacyFullAccess: isLegacy,
    entitlements,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرح لك" }, { status: 401 });

  const { userId } = await params;
  const body = await request.json().catch(() => ({}));
  const { action, productType, productSlug } = body as {
    action: "grant" | "revoke";
    productType: ProductType;
    productSlug: string;
  };

  if (!action || !productType || !productSlug) {
    return NextResponse.json(
      { error: "البيانات غير مكتملة (action, productType, productSlug مطلوبة)" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
  }

  if (action === "grant") {
    await grantUserEntitlement({
      userId,
      productType,
      productSlug,
      source: "admin_grant",
    });

    await logAdminAction({
      admin,
      action: "user.entitlement_grant",
      targetType: "user",
      targetId: userId,
      detail: `Granted ${productType}:${productSlug} to ${user.email}`,
    });

    return NextResponse.json({
      ok: true,
      message: `تم منح صلاحية (${productType}: ${productSlug}) للمستخدم ${user.name || user.email} بنجاح!`,
    });
  } else if (action === "revoke") {
    await revokeUserEntitlement({
      userId,
      productType,
      productSlug,
    });

    await logAdminAction({
      admin,
      action: "user.entitlement_revoke",
      targetType: "user",
      targetId: userId,
      detail: `Revoked ${productType}:${productSlug} from ${user.email}`,
    });

    return NextResponse.json({
      ok: true,
      message: `تم سحب صلاحية (${productType}: ${productSlug}) من المستخدم ${user.name || user.email} بنجاح!`,
    });
  }

  return NextResponse.json({ error: "إجراء غير مدعوم" }, { status: 400 });
}
