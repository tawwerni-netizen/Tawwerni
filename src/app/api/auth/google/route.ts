import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { maybeSendWelcome } from "@/lib/welcome";
import { OAuth2Client } from "google-auth-library";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "643238889542-rb62aecd5jamlo29snr0f52e18osft6o.apps.googleusercontent.com";

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const { token } = await readJson(request);

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 400 });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || "";

    // Find or create the user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: "", // No password for Google users initially
        },
      });

      const { cookies } = await import("next/headers");
      const { attachReferrer } = await import("@/lib/referrals");
      const { REFERRAL_COOKIE } = await import("@/lib/referral-constants");
      const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
      if (refCode) {
        await attachReferrer(user.id, refCode).catch(() => {});
      }

      await maybeSendWelcome(user.id);
    } else {
      // Clear any lockouts if they successfully logged in with Google
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, lockedUntil: null },
      });
    }

    await createSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      hasOnboarded: user.dailyPaceMinutes != null,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.json({ error: "فشل التحقق من حساب جوجل" }, { status: 401 });
  }
}
