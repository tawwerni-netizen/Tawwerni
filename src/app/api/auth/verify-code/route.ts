import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyOtp, createSessionCookie } from "@/lib/auth";
import { attachReferrer } from "@/lib/referrals";
import { REFERRAL_COOKIE } from "@/lib/referral-constants";

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

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: { email: normalizedEmail },
  });

  // Someone can arrive from a referral link and sign up before buying, so
  // attribute here as well as at checkout.
  const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
  await attachReferrer(user.id, refCode).catch(() => {});

  await createSessionCookie(user.id);

  return NextResponse.json({ ok: true, hasOnboarded: user.dailyPaceMinutes != null });
}
