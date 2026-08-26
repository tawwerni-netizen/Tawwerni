import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";

/**
 * Deleting an account, permanently.
 *
 * Everything the account owns goes with it — completions, badges, orders,
 * chat history, referral records. There is no undo and no soft-delete flag,
 * because a "deleted" account that still holds someone's data is not deleted,
 * and the whole reason this exists is a customer asking to be removed.
 *
 * Two guards that matter:
 *
 *  - The caller must type the account's email back. A destructive control one
 *    click away from a list of three hundred rows will eventually be pressed
 *    on the wrong row.
 *  - An admin can never delete an admin, including themselves. Losing the only
 *    admin account locks the owner out of their own business with no way back
 *    except the command line.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { userId } = await params;
  const { confirmEmail } = await request.json().catch(() => ({}));

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, isAdmin: true },
  });
  if (!target) return NextResponse.json({ error: "المستخدم مش موجود" }, { status: 404 });

  if (target.isAdmin) {
    return NextResponse.json(
      { error: "مش هينفع تمسح حساب أدمن. شيل صلاحية الأدمن الأول من قاعدة البيانات." },
      { status: 403 }
    );
  }

  if (
    typeof confirmEmail !== "string" ||
    confirmEmail.toLowerCase().trim() !== target.email.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "اكتب إيميل الحساب بالظبط عشان تأكّد المسح." },
      { status: 400 }
    );
  }

  /*
   * Order matters — the foreign keys won't let the user row go while anything
   * still points at it. Referral earnings are checked from both sides: this
   * person may have earned commission, and may also have generated it for
   * somebody else.
   */
  await prisma.$transaction([
    prisma.passwordReset.deleteMany({ where: { userId } }),
    prisma.referralEarning.deleteMany({
      where: { OR: [{ userId }, { referredUserId: userId }] },
    }),
    prisma.payout.deleteMany({ where: { userId } }),
    prisma.lessonCompletion.deleteMany({ where: { userId } }),
    prisma.userBadge.deleteMany({ where: { userId } }),
    prisma.chatMessage.deleteMany({ where: { userId } }),
    prisma.order.deleteMany({ where: { userId } }),
    // Anyone this person referred keeps their account; they just lose the link.
    prisma.user.updateMany({ where: { referredById: userId }, data: { referredById: null } }),
    prisma.user.delete({ where: { id: userId } }),
  ]);

  return NextResponse.json({ ok: true, deleted: target.email });
}
