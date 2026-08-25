import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionCookie } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";

/** Wrong attempts allowed before the account is briefly locked. */
const MAX_ATTEMPTS = 8;
const LOCK_MINUTES = 15;

export async function POST(request: Request) {
  const { email, password } = await request.json();

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

  await createSessionCookie(user.id);

  return NextResponse.json({
    ok: true,
    hasOnboarded: user.dailyPaceMinutes != null,
    mustChangePassword: user.mustChangePassword,
  });
}
