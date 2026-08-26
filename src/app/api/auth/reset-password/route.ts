import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { payment } from "@/content/brand";
import { hashPassword, passwordProblem, isValidPassword } from "@/lib/password";
import { findLiveReset, consumeReset } from "@/lib/password-reset";
import { createSessionCookie } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { passwordChangedEmail } from "@/lib/email-templates";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";

/** Finishes a reset: verify the token, set the new password, sign them in. */
export async function POST(request: Request) {
  // A 32-byte token is not guessable, but an unlimited endpoint is still a
  // free way to hammer the server.
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`reset:${clientIp(request)}`, 20, 3600);
  if (!gate.ok) return tooMany(gate, "محاولات كتير. استنى شوية.");

  const { token, password } = await readJson(request);

  const problem = passwordProblem(password);
  if (problem || !isValidPassword(password)) {
    return NextResponse.json({ error: problem ?? "باسورد غير صالح" }, { status: 400 });
  }

  if (typeof token !== "string") {
    return NextResponse.json({ error: "اللينك ناقص" }, { status: 400 });
  }

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
      // And kicks out every session that existed before this reset.
      sessionVersion: { increment: 1 },
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
