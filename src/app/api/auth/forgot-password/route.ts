import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { brand } from "@/content/brand";
import { payment } from "@/content/brand";
import { sendEmail } from "@/lib/email";
import { passwordResetEmail } from "@/lib/email-templates";
import { createResetToken, ResetRateLimited, RESET_TTL_MINUTES } from "@/lib/password-reset";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";

/**
 * Starts a password reset.
 *
 * Always answers the same way, whether or not the address has an account. An
 * endpoint that says "no such user" is a free tool for working out who is
 * registered here — and the accounts on this site are paying customers.
 */
export async function POST(request: Request) {
  // Per-account throttling lives in createResetToken; this caps one machine
  // walking a list of addresses to see which ones exist.
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`forgot:${clientIp(request)}`, 10, 3600);
  if (!gate.ok) return tooMany(gate, "طلبات كتير. استنى شوية وجرّب تاني.");

  const { email } = await readJson(request);

  const normalized = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (!normalized.includes("@")) {
    return NextResponse.json({ error: "اكتب إيميل صحيح" }, { status: 400 });
  }

  const SAME_ANSWER = NextResponse.json({
    ok: true,
    message: "لو الإيميل ده عنده حساب، هيوصله لينك تغيير كلمة السر خلال دقيقة.",
  });

  let token: string | null;
  try {
    token = await createResetToken(normalized);
  } catch (err) {
    if (err instanceof ResetRateLimited) {
      // Worth saying out loud: it stops someone hammering the button and
      // wondering why nothing arrives, and it reveals nothing new — they
      // already know they typed this address.
      return NextResponse.json(
        { error: "طلبت اللينك كذا مرة. استنى شوية وجرّب تاني." },
        { status: 429 }
      );
    }
    throw err;
  }

  if (!token) return SAME_ANSWER;

  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { name: true },
  });

  const origin = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;
  const tpl = passwordResetEmail({
    name: user?.name ?? null,
    url: `${origin}/reset-password?token=${encodeURIComponent(token)}`,
    minutes: RESET_TTL_MINUTES,
  });

  await sendEmail({
    to: normalized,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: payment.supportEmail,
  });

  return SAME_ANSWER;
}
