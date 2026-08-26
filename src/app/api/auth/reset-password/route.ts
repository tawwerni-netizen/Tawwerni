import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { payment } from "@/content/brand";
import { hashPassword, passwordProblem } from "@/lib/password";
import { findLiveReset, consumeReset } from "@/lib/password-reset";
import { createSessionCookie } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { passwordChangedEmail } from "@/lib/email-templates";
import { rateLimit, clientIp, tooMany } from "@/lib/rate-limit";

/** Finishes a reset: verify the token, set the new password, sign them in. */
export async function POST(request: Request) {
  // A 32-byte token is not guessable, but an unlimited endpoint is still a
  // free way to hammer the server.
  const gate = rateLimit(`reset:${clientIp(request)}`, 20, 3600);
  if (!gate.ok) return tooMany(gate, "محاولات كتير. استنى شوية.");

  const { token, password } = await request.json();

  const problem = passwordProblem(password);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const reset = await findLiveReset(token);
  if (!reset) {
    return NextResponse.json(
      { error: "اللينك ده منتهي أو اتستخدم قبل كده. اطلب واحد جديد." },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: reset.userId },
    data: {
      passwordHash,
      mustChangePassword: false,
      // A successful reset clears any lockout — otherwise someone locked out
      // by an attacker's guessing would still be shut out of their own account.
      loginAttempts: 0,
      lockedUntil: null,
    },
  });

  await consumeReset(reset.id, reset.userId);

  const user = await prisma.user.findUnique({
    where: { id: reset.userId },
    select: { email: true, name: true, dailyPaceMinutes: true },
  });

  // Tell them it happened. If this lands and they didn't ask for it, that
  // notice is the only warning they get.
  if (user) {
    const tpl = passwordChangedEmail({ name: user.name });
    await sendEmail({
      to: user.email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      replyTo: payment.supportEmail,
    });
  }

  await createSessionCookie(reset.userId);

  return NextResponse.json({
    ok: true,
    hasOnboarded: user?.dailyPaceMinutes != null,
  });
}
