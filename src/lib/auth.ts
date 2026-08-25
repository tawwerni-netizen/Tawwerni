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

export async function requestOtp(email: string) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
  await prisma.emailOtp.create({
    data: { email: email.toLowerCase().trim(), codeHash: hashCode(code), expiresAt },
  });
  return code;
}

export async function verifyOtp(email: string, code: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const codeHash = hashCode(code);
  const otp = await prisma.emailOtp.findFirst({
    where: {
      email: normalizedEmail,
      codeHash,
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
  if (!otp) return false;
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
