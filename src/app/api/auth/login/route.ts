import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { maybeSendWelcome } from "@/lib/welcome";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";

/** Wrong attempts allowed before the account is briefly locked. */
const MAX_ATTEMPTS = 8;
const LOCK_MINUTES = 15;

export async function POST(request: Request) {
  // The per-account lockout below stops guessing at ONE account. This stops
  // one machine spraying a common password across many accounts, which the
  // lockout never sees.
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`login:${clientIp(request)}`, 20, 300);
  if (!gate.ok) return tooMany(gate, "محاولات كتير أوي. استنى شوية وجرّب تاني.");

  const { email, password } = await readJson(request);

  const normalizedEmail = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (!normalizedEmail || typeof password !== "string") {
    return NextResponse.json({ error: "اكتب الإيميل والباسورد" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      passwordHash: true,
      dailyPaceMinutes: true,
      mustChangePassword: true,
      loginAttempts: true,
      lockedUntil: true,
    },
  });

  // Same message whether the address is unknown or the password is wrong —
  // otherwise this endpoint tells an attacker which emails have accounts.
  const REJECT = NextResponse.json({ error: "الإيميل أو الباسورد غلط" }, { status: 401 });

  if (!user?.passwordHash) return REJECT;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const mins = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    return NextResponse.json(
      { error: `الحساب مقفول مؤقتًا. جرّب تاني بعد ${mins} دقيقة.` },
      { status: 429 }
    );
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    const attempts = user.loginAttempts + 1;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: attempts,
        ...(attempts >= MAX_ATTEMPTS
          ? { lockedUntil: new Date(Date.now() + LOCK_MINUTES * 60_000), loginAttempts: 0 }
          : {}),
      },
    });
    return REJECT;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { loginAttempts: 0, lockedUntil: null },
  });

  // Clears the welcome-email backlog: anyone who joined while mail was down
  // gets theirs on their next sign-in rather than never.
  await maybeSendWelcome(user.id);

  await createSessionCookie(user.id);

  return NextResponse.json({
    ok: true,
    hasOnboarded: user.dailyPaceMinutes != null,
    mustChangePassword: user.mustChangePassword,
  });
}
