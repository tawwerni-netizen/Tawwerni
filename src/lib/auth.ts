import { createHash, randomInt } from "crypto";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "tawwerni_session";
const OTP_TTL_MINUTES = 10;
const SESSION_TTL_DAYS = 30;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function generateOtpCode() {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** Codes a single address may request per hour, before we start refusing. */
const MAX_CODES_PER_HOUR = 5;

/** Wrong guesses allowed against one code. 6 digits is only 10^6 of entropy. */
const MAX_ATTEMPTS = 5;

export class OtpRateLimited extends Error {
  constructor() {
    super("otp_rate_limited");
  }
}

export async function requestOtp(email: string) {
  const normalizedEmail = email.toLowerCase().trim();

  // Throttle per address: stops inbox-flooding a victim and stops an attacker
  // minting fresh codes to sidestep the per-code attempt cap.
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await prisma.emailOtp.count({
    where: { email: normalizedEmail, createdAt: { gt: since } },
  });
  if (recent >= MAX_CODES_PER_HOUR) throw new OtpRateLimited();

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await prisma.emailOtp.create({
    data: { email: normalizedEmail, codeHash: hashCode(code), expiresAt },
  });

  // Opportunistic cleanup so the table cannot grow without bound.
  await prisma.emailOtp
    .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
    .catch(() => {});

  return code;
}

export async function verifyOtp(email: string, code: string) {
  const normalizedEmail = email.toLowerCase().trim();

  // Look the code up by address first, not by hash. Matching on hash alone
  // would let an attacker guess unlimited times, since a wrong guess would
  // simply find no row and leave no trace.
  const otp = await prisma.emailOtp.findFirst({
    where: { email: normalizedEmail, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return false;

  if (otp.attempts >= MAX_ATTEMPTS) {
    // Burn it rather than leaving a half-guessed code alive.
    await prisma.emailOtp.update({
      where: { id: otp.id },
      data: { consumedAt: new Date() },
    });
    return false;
  }

  if (otp.codeHash !== hashCode(code)) {
    await prisma.emailOtp.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.emailOtp.update({ where: { id: otp.id }, data: { consumedAt: new Date() } });
  return true;
}

export async function createSessionCookie(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return typeof payload.userId === "string" ? payload.userId : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
