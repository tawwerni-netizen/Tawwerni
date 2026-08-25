import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { referral } from "@/content/brand";
import { REFERRAL_COOKIE } from "@/lib/referral-constants";

/**
 * Referral programme.
 *
 * A commission is created only when a referred person's order is *approved* —
 * never when the order is merely placed. That keeps the balance honest: money
 * shown as earned is money actually received.
 */

export { REFERRAL_COOKIE };

/** Unambiguous alphabet: no 0/O, no 1/I/L — these get read aloud and retyped. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomCode(length = 7): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/** Returns the user's code, minting one on first use. */
export async function ensureReferralCode(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (user?.referralCode) return user.referralCode;

  // Collisions are vanishingly unlikely but cheap to retry.
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    try {
      await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
      return code;
    } catch {
      // Unique constraint hit — try another code.
    }
  }
  throw new Error("could not allocate a referral code");
}

/**
 * Links a new user to whoever referred them.
 *
 * Attribution is permanent and one-way: it is only ever set when currently
 * empty, so a later click on somebody else's link cannot steal the credit.
 */
export async function attachReferrer(userId: string, code: string | null | undefined) {
  if (!code) return;

  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return;

  const [user, referrer] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { referredById: true } }),
    prisma.user.findUnique({ where: { referralCode: trimmed }, select: { id: true } }),
  ]);

  if (!user || !referrer) return;
  if (user.referredById) return; // already attributed
  if (referrer.id === userId) return; // nobody refers themselves

  await prisma.user.update({ where: { id: userId }, data: { referredById: referrer.id } });
}

/**
 * Credits the referrer for an approved order.
 *
 * Idempotent: `orderId` is unique on ReferralEarning, so replaying an approval
 * cannot pay the same commission twice.
 */
export async function creditReferral(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, userId: true, user: { select: { referredById: true } } },
  });

  if (!order || order.status !== "approved") return null;

  const referrerId = order.user.referredById;
  if (!referrerId) return null;

  const existing = await prisma.referralEarning.findUnique({ where: { orderId } });
  if (existing) return existing;

  try {
    return await prisma.referralEarning.create({
      data: {
        userId: referrerId,
        referredUserId: order.userId,
        orderId,
        amountEgp: referral.commissionEgp,
        status: "available",
      },
    });
  } catch {
    // Lost a race with a concurrent approval — the other one won, which is fine.
    return prisma.referralEarning.findUnique({ where: { orderId } });
  }
}

export type ReferralSummary = {
  code: string;
  totalReferred: number;
  paidReferred: number;
  availableEgp: number;
  lockedEgp: number;
  paidEgp: number;
  canWithdraw: boolean;
};

export async function referralSummary(userId: string): Promise<ReferralSummary> {
  const code = await ensureReferralCode(userId);

  const [referredUsers, earnings] = await Promise.all([
    prisma.user.count({ where: { referredById: userId } }),
    prisma.referralEarning.findMany({
      where: { userId },
      select: { amountEgp: true, status: true },
    }),
  ]);

  const sum = (status: string) =>
    earnings.filter((e) => e.status === status).reduce((s, e) => s + e.amountEgp, 0);

  const availableEgp = sum("available");

  return {
    code,
    totalReferred: referredUsers,
    paidReferred: earnings.length,
    availableEgp,
    lockedEgp: sum("locked"),
    paidEgp: sum("paid"),
    canWithdraw: availableEgp >= referral.minPayoutEgp,
  };
}

/**
 * Moves the whole available balance into a payout request.
 *
 * The earnings are flipped to `locked` in the same transaction that creates the
 * request, so a double-submit cannot withdraw the same money twice.
 */
export async function requestPayout(opts: {
  userId: string;
  method: string;
  destination: string;
}) {
  const available = await prisma.referralEarning.findMany({
    where: { userId: opts.userId, status: "available" },
    select: { id: true, amountEgp: true },
  });

  const total = available.reduce((s, e) => s + e.amountEgp, 0);
  if (total < referral.minPayoutEgp) {
    return { ok: false as const, error: `أقل مبلغ للسحب ${referral.minPayoutEgp} ج.م` };
  }

  const payout = await prisma.$transaction(async (tx) => {
    const created = await tx.payout.create({
      data: {
        userId: opts.userId,
        amountEgp: total,
        method: opts.method,
        destination: opts.destination,
        status: "requested",
      },
    });

    await tx.referralEarning.updateMany({
      where: { id: { in: available.map((e) => e.id) }, status: "available" },
      data: { status: "locked", payoutId: created.id },
    });

    return created;
  });

  return { ok: true as const, payout };
}
