import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { adminUser } from "@/lib/admin";
import { payment, brand } from "@/content/brand";
import { hashPassword, generateTempPassword } from "@/lib/password";
import { createResetToken, RESET_TTL_MINUTES } from "@/lib/password-reset";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import { logAdminAction } from "@/lib/audit-log";

/**
 * Operator-triggered password recovery.
 *
 * Two shapes, because customers ask in two different ways:
 *
 *  - `send_link`  — mails them a reset link. Preferred: the owner never
 *                   handles the password, and the customer picks their own.
 *  - `temp`       — mints a temporary password and shows it once, for the
 *                   customer on WhatsApp whose email isn't reaching them.
 *                   Flagged `mustChangePassword` so it cannot stay in use.
 *
 * What is deliberately absent: any way to read an existing password. They are
 * scrypt hashes — one-way by construction. Being able to look one up would
 * mean anyone who got into this panel could log in as any paying customer,
 * and would make every account here only as safe as this one screen.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const admin = await adminUser();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });

  const { userId } = await params;
  const { mode } = await readJson(request);

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, isAdmin: true },
  });
  if (!target) return NextResponse.json({ error: "المستخدم مش موجود" }, { status: 404 });

  // One admin must not be able to seize another admin's account from here.
  if (target.isAdmin && target.id !== admin.id) {
    return NextResponse.json(
      { error: "مش هينفع تغيّر باسورد أدمن تاني من هنا." },
      { status: 403 }
    );
  }

  if (mode === "temp") {
    const temp = generateTempPassword();
    await prisma.user.update({
      where: { id: target.id },
      data: {
        passwordHash: await hashPassword(temp),
        mustChangePassword: true,
        loginAttempts: 0,
        lockedUntil: null,
        // Whoever was signed in on the old password is signed out.
        sessionVersion: { increment: 1 },
      },
    });

    // Old links would still work against the account otherwise.
    await prisma.passwordReset
      .updateMany({ where: { userId: target.id, consumedAt: null }, data: { consumedAt: new Date() } })
      .catch(() => {});

    await logAdminAction({
      admin,
      action: "user.password_temp_issued",
      targetType: "user",
      targetId: target.id,
      detail: target.email,
    });

    return NextResponse.json({
      ok: true,
      mode: "temp",
      tempPassword: temp,
      note: "الباسورد المؤقت ده بيظهر مرة واحدة بس. ابعته للعميل، وهيتطلب منه يغيّره أول ما يدخل.",
    });
  }

  const token = await createResetToken(target.email);
  if (!token) return NextResponse.json({ error: "مش قادر أعمل لينك" }, { status: 500 });

  const origin = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;
  const tpl = passwordResetEmail({
    name: target.name,
    url: `${origin}/reset-password?token=${encodeURIComponent(token)}`,
    minutes: RESET_TTL_MINUTES,
  });

  const sent = await sendEmail({
    to: target.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: payment.supportEmail,
  });

  // `ok` alone isn't enough: with no mail channel configured the send
  // "succeeds" by logging to the console, and the owner would sit waiting for
  // a link that was never going to arrive.
  const delivered = sent.ok && sent.delivered === true;

  await logAdminAction({
    admin,
    action: "user.password_reset_sent",
    targetType: "user",
    targetId: target.id,
    detail: target.email,
  });

  return NextResponse.json({
    ok: true,
    mode: "send_link",
    delivered,
    note: delivered
      ? `اتبعت لينك على ${target.email} — صالح ${RESET_TTL_MINUTES} دقيقة.`
      : "الإيميل مش متظبط، فاللينك ما وصلش. استخدم الباسورد المؤقت بدله.",
  });
}
