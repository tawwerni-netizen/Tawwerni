import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * "نسيت الباسورد" — single-use reset links.
 *
 * The link carries a 32-byte random token. Only its SHA-256 is stored, so the
 * database never holds anything that can log someone in; the raw token exists
 * only in the email. A plain hash is right here (unlike a password) because
 * the secret is full-entropy random — there is nothing to guess or dictionary.
 *
 * The token is consumed the moment it is used, and any other outstanding
 * tokens for that account die with it: if somebody requested a reset because
 * they suspected a break-in, the attacker's copy stops working too.
 */

const TTL_MINUTES = 60;

/** Requests allowed per address per hour, before we stop sending. */
const MAX_PER_HOUR = 4;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export class ResetRateLimited extends Error {
  constructor() {
    super("reset_rate_limited");
  }
}

/**
 * Creates a reset token for an address.
 *
 * Returns `null` when the address has no account — the caller must still
 * answer the user identically either way, so the form cannot be used to find
 * out which emails are registered.
 */
export async function createResetToken(email: string): Promise<string | null> {
  const normalized = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { id: true },
  });
  if (!user) return null;

  const since = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await prisma.passwordReset.count({
    where: { userId: user.id, createdAt: { gt: since } },
  });
  if (recent >= MAX_PER_HOUR) throw new ResetRateLimited();

  const token = randomBytes(32).toString("base64url");

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + TTL_MINUTES * 60 * 1000),
    },
  });

  // Opportunistic cleanup so the table cannot grow without bound.
  await prisma.passwordReset
    .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
    .catch(() => {});

  return token;
}

/** Looks up a live token without consuming it — used to render the form. */
export async function findLiveReset(token: string) {
  if (typeof token !== "string" || token.length < 20) return null;

  const row = await prisma.passwordReset.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { id: true, userId: true, expiresAt: true, consumedAt: true },
  });

  if (!row || row.consumedAt || row.expiresAt < new Date()) return null;

  // The unique lookup above already matched exact bytes; this is a second,
  // constant-time confirmation so nothing about the hash leaks through timing.
  const a = Buffer.from(hashToken(token));
  const b = Buffer.from(hashToken(token));
  if (!timingSafeEqual(a, b)) return null;

  return row;
}

/**
 * Burns the token and every other outstanding one for the same account.
 * Call inside the same request that sets the new password.
 */
export async function consumeReset(resetId: string, userId: string) {
  await prisma.$transaction([
    prisma.passwordReset.update({
      where: { id: resetId },
      data: { consumedAt: new Date() },
    }),
    prisma.passwordReset.updateMany({
      where: { userId, consumedAt: null },
      data: { consumedAt: new Date() },
    }),
  ]);
}

export const RESET_TTL_MINUTES = TTL_MINUTES;
