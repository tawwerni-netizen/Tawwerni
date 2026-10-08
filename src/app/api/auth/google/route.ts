import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { maybeSendWelcome } from "@/lib/welcome";
import { ensureDatabaseSchema } from "@/lib/db-schema-sync";
import { OAuth2Client } from "google-auth-library";

const DEFAULT_CLIENT_ID =
  "643238889542-rb62aecd5jamlo29snr0f52e18osft6o.apps.googleusercontent.com";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  process.env.GOOGLE_CLIENT_ID ||
  DEFAULT_CLIENT_ID;

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  const { token } = await readJson(request);

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "لم يتم استلام توكن جوجل" }, { status: 400 });
  }

  // 1. Verify Google ID Token
  let payload: { email?: string; name?: string } | undefined;
  try {
    const audienceList = Array.from(
      new Set(
        [
          GOOGLE_CLIENT_ID,
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_ID,
          DEFAULT_CLIENT_ID,
        ].filter((x): x is string => typeof x === "string" && x.length > 0)
      )
    );

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: audienceList.length === 1 ? audienceList[0] : audienceList,
    });

    payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: "بيانات توكن جوجل غير صالحة" }, { status: 400 });
    }
  } catch (tokenError: any) {
    console.error("[GoogleAuth] Token verification failed:", tokenError?.message || tokenError);
    return NextResponse.json(
      { error: "فشل التحقق من حساب جوجل. حاول مرة أخرى أو استخدم البريد وكلمة المرور." },
      { status: 401 }
    );
  }

  const email = payload.email.toLowerCase().trim();
  const name = payload.name || "";

  // 2. Synchronize Database & Create/Update User
  try {
    // Ensure DB columns exist (e.g. hasLegacyAccess)
    await ensureDatabaseSchema(prisma).catch(() => {});

    // Explicit select protects against unmigrated columns crashing the query
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        dailyPaceMinutes: true,
        sessionVersion: true,
      },
    });

    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: "", // No password for Google users initially
        },
        select: {
          id: true,
          email: true,
          name: true,
          dailyPaceMinutes: true,
          sessionVersion: true,
        },
      });

      const { cookies } = await import("next/headers");
      const { attachReferrer } = await import("@/lib/referrals");
      const { REFERRAL_COOKIE } = await import("@/lib/referral-constants");
      const refCode = (await cookies()).get(REFERRAL_COOKIE)?.value;
      if (refCode) {
        await attachReferrer(user.id, refCode).catch(() => {});
      }

      await maybeSendWelcome(user.id).catch(() => {});
    } else {
      // Clear any previous failed login lockouts
      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: 0, lockedUntil: null },
        select: { id: true },
      });
    }

    await createSessionCookie(user.id);

    return NextResponse.json({
      ok: true,
      hasOnboarded: user.dailyPaceMinutes != null,
      isNewUser,
    });
  } catch (dbError: any) {
    console.error("[GoogleAuth] Database operation failed:", dbError?.message || dbError);
    return NextResponse.json(
      { error: "حصل خطأ في حفظ بيانات الحساب. يرجى إعادة المحاولة." },
      { status: 500 }
    );
  }
}
