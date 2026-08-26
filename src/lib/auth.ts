import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "tawwerni_session";
const SESSION_TTL_DAYS = 30;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

/*
 * The one-time-code sign-in that used to live here has been removed.
 *
 * It was a second way into any account that never asked for a password, and
 * when email delivery was not configured the endpoint returned the code in its
 * own HTTP response — so anyone who could name an address could take that
 * account, the owner's included. Sign-in is email and password now; there is
 * no second door.
 */

/**
 * Signs a session for a user.
 *
 * The token carries the account's current `sessionVersion`. Bumping that
 * column invalidates every token already issued — which is what has to happen
 * when a password changes, because otherwise "I changed my password because I
 * think someone got in" leaves the intruder logged in indefinitely.
 */
export async function createSessionCookie(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sessionVersion: true },
  });

  const token = await new SignJWT({ userId, v: user?.sessionVersion ?? 0 })
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

  let userId: string;
  let version: number;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.userId !== "string") return null;
    userId = payload.userId;
    version = typeof payload.v === "number" ? payload.v : 0;
  } catch {
    return null;
  }

  // A valid signature is not enough — the token also has to be from the
  // current generation for this account.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { sessionVersion: true },
  });
  if (!user || user.sessionVersion !== version) return null;

  return userId;
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
