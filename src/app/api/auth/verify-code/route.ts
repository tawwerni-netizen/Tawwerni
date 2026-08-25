import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyOtp, createSessionCookie } from "@/lib/auth";
import { attachReferrer } from "@/lib/referrals";
import { REFERRAL_COOKIE } from "@/lib/referral-constants";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

export async function POST(request: Request) {
  const { email, code } = await request.json();
  if (typeof email !== "string" || typeof code !== "string") {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const isValid = await verifyOtp(normalizedEmail, code.trim());
  if (!isValid) {
    return NextResponse.json({ error: "الكود غلط أو منتهي الصلاحية" }, { status: 401 });
  }

  // Knowing whether this is a first sign-in decides if the welcome mail goes
  // out — it must never be re-sent on a later login.
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true, welcomedAt: true, name: true, dailyPaceMinutes: true },
  });

  const user =
    existing ??
    (await prisma.user.create({
      data: { email: normalizedEmail },
      select: { id: true, welcomedAt: true, name: true, dailyPaceMinutes: true },
    }));

  if (!user.welcomedAt) {
    const tpl = welcomeEmail({ name: user.name });
    const sent = await sendEmail({
      to: normalizedEmail,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
    // Only mark it welcomed once it actually left, so a mail outage doesn't
    // silently cost this learner their onboarding email.
    if (sent.ok && sent.delivered) {
      await prisma.user.update({ where: { id: user.id }, data: { welcomedAt: new Date() } });
    }
  }

  // Someone can arrive from a referral link and sign up before buying, so
  // attribute here as well as at checkout.
  const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
  await attachReferrer(user.id, refCode).catch(() => {});

  await createSessionCookie(user.id);

  return NextResponse.json({ ok: true, hasOnboarded: user.dailyPaceMinutes != null });
}
