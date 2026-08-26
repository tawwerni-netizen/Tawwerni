import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { payment } from "@/content/brand";
import { getCurrentUser } from "@/lib/auth";
import { hashPassword, verifyPassword, passwordProblem } from "@/lib/password";
import { sendEmail } from "@/lib/email";
import { passwordChangedEmail } from "@/lib/email-templates";
import { rateLimit, clientIp, tooMany } from "@/lib/rate-limit";

/**
 * Changes the signed-in user's own password.
 *
 * The current password is required even though the session already proves who
 * they are: a session can be an unlocked laptop or a stolen cookie, and this
 * is the one action that would hand the account over permanently.
 *
 * Works for admins too — the owner changes their panel password here.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "لازم تسجّل دخول الأول" }, { status: 401 });

  // Guessing the current password from inside a session is still guessing.
  const gate = rateLimit(`chpw:${user.id}`, 10, 900);
  if (!gate.ok) return tooMany(gate, "محاولات كتير. استنى شوية.");

  const { currentPassword, newPassword } = await request.json();

  const problem = passwordProblem(newPassword);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "حسابك مش عليه باسورد. استخدم «نسيت الباسورد» عشان تحط واحدة." },
      { status: 400 }
    );
  }

  const ok =
    typeof currentPassword === "string" &&
    (await verifyPassword(currentPassword, user.passwordHash));

  if (!ok) {
    return NextResponse.json({ error: "الباسورد الحالي غلط" }, { status: 401 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ error: "الباسورد الجديد زي القديم" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hashPassword(newPassword), mustChangePassword: false },
  });

  // Any outstanding reset link is now stale — kill it, so an old email in an
  // inbox cannot undo the change they just made.
  await prisma.passwordReset
    .updateMany({ where: { userId: user.id, consumedAt: null }, data: { consumedAt: new Date() } })
    .catch(() => {});

  const tpl = passwordChangedEmail({ name: user.name });
  await sendEmail({
    to: user.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: payment.supportEmail,
  });

  return NextResponse.json({ ok: true });
}
