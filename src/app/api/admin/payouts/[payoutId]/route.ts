import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { logAdminAction } from "@/lib/audit-log";

/**
 * Settles a withdrawal request.
 *
 * "paid" marks the locked earnings as paid; "rejected" releases them back to
 * available so the user can request again. Either way the earnings never
 * silently vanish.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ payoutId: string }> }) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { payoutId } = await params;
  const { action, note } = await readJson(request);

  const payout = await prisma.payout.findUnique({ where: { id: payoutId } });
  if (!payout) return NextResponse.json({ error: "الطلب مش موجود" }, { status: 404 });
  if (payout.status !== "requested") {
    return NextResponse.json({ error: "الطلب ده اتقفل قبل كده" }, { status: 409 });
  }

  if (action !== "paid" && action !== "rejected") {
    return NextResponse.json({ error: "إجراء غير صالح" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.payout.update({
      where: { id: payoutId },
      data: {
        status: action,
        settledAt: new Date(),
        note: typeof note === "string" && note.trim() ? note.trim() : null,
      },
    }),
    prisma.referralEarning.updateMany({
      where: { payoutId },
      data:
        action === "paid"
          ? { status: "paid" }
          : // Release the money back so the user isn't stuck holding a rejected request.
            { status: "available", payoutId: null },
    }),
  ]);
  await logAdminAction({
    admin,
    action: action === "paid" ? "payout.paid" : "payout.reject",
    targetType: "payout",
    targetId: payoutId,
    detail: `${payout.amountEgp} EGP`,
  });

  return NextResponse.json({ ok: true });
}
