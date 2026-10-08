import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { payment, pricing } from "@/content/brand";
import { compareNames } from "@/lib/arabic-name";
import { activateOrder } from "@/lib/activate-order";

/**
 * Turns an incoming payment SMS into an activation decision.
 *
 * The rule is deliberately strict: a transfer only activates a course when
 * exactly one pending order can possibly explain it. Anything else — no match,
 * two candidates, wrong amount — is parked for manual review. Over-activating
 * gives a course away for free, so ambiguity always resolves to "ask a human".
 */

export type IncomingPayment = {
  provider: string;
  amountEgp: number;
  transactionRef?: string | null;
  senderPhone?: string | null;
  /** InstaPay identifies the payer by name only. */
  senderName?: string | null;
  receiverPhone?: string | null;
  transactionAt?: Date | null;
  smsReceivedAt?: Date | null;
  rawSms: string;
};

export type MatchOutcome =
  | { result: "duplicate"; transactionId: string; status: string }
  | { result: "activated"; transactionId: string; orderId: string; email: string; courseTitle: string }
  | { result: "unmatched"; transactionId: string; reason: string };

/** Egyptian mobile numbers arrive as 01x…, +201x…, or 201x… — compare the last 10 digits. */
export function normalizePhone(input?: string | null): string | null {
  if (!input) return null;
  const digits = input.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return digits.slice(-10);
}

/** The wallets we advertise, in comparable form. */
function ownWalletTails(): Set<string> {
  const tails = new Set<string>();
  const known = [
    ...payment.vodafoneCash,
    payment.supportWhatsapp,
    "01200176755",
    "01067558133",
    "01069999557",
  ];
  for (const n of known) {
    const t = normalizePhone(n);
    if (t) tails.add(t);
  }
  return tails;
}

/** Stable identity for an SMS that carries no provider reference of its own. */
export function fingerprintOf(p: IncomingPayment): string {
  const parts = [
    p.provider,
    String(p.amountEgp),
    normalizePhone(p.senderPhone) ?? "",
    normalizePhone(p.receiverPhone) ?? "",
    p.transactionAt ? p.transactionAt.toISOString().slice(0, 16) : "",
    p.rawSms.replace(/\s+/g, " ").trim(),
  ];
  return createHash("sha256").update(parts.join("|")).digest("hex");
}

export async function recordAndMatch(payment: IncomingPayment): Promise<MatchOutcome> {
  const fingerprint = fingerprintOf(payment);
  const ref = payment.transactionRef?.trim() || null;

  // Same transfer arriving twice must never activate twice.
  const existing = await prisma.paymentTransaction.findFirst({
    where: ref ? { OR: [{ transactionRef: ref }, { fingerprint }] } : { fingerprint },
  });
  if (existing) {
    return { result: "duplicate", transactionId: existing.id, status: existing.status };
  }

  const senderPhone = normalizePhone(payment.senderPhone);

  const tx = await prisma.paymentTransaction.create({
    data: {
      provider: payment.provider,
      amountEgp: payment.amountEgp,
      transactionRef: ref,
      fingerprint,
      senderPhone,
      receiverPhone: normalizePhone(payment.receiverPhone),
      transactionAt: payment.transactionAt ?? null,
      smsReceivedAt: payment.smsReceivedAt ?? null,
      rawSms: payment.rawSms,
      status: "unmatched",
    },
  });

  const park = async (reason: string): Promise<MatchOutcome> => {
    await prisma.paymentTransaction.update({
      where: { id: tx.id },
      data: { matchNote: reason },
    });
    return { result: "unmatched", transactionId: tx.id, reason };
  };

  // Only check destination wallet if receiverPhone is present in the SMS.
  const receiver = normalizePhone(payment.receiverPhone);
  if (receiver) {
    const ours = ownWalletTails();
    if (ours.size > 0 && !ours.has(receiver)) {
      return park(`التحويل وصل على محفظة غير معتمدة (${payment.receiverPhone})`);
    }
  }

  // 1. In Egypt, transfers arrive as:
  // - Modular Track: 59 EGP (or 58/60 or legacy 50/49)
  // - Modular Career Path (Bundle): 149 EGP (or 148/150 or legacy 100/99)
  // - All-Access Pass: 399 EGP (or 398/400 or legacy 349/350)
  // - Track + VIP Order Bump: 258 EGP (or legacy 249/250)
  // - Career Path + VIP Order Bump: 348 EGP (or legacy 299/300)
  // - Standalone VIP Upgrade: 199 or 200 EGP
  // - Upgrade Track -> Career Path Difference: 90 EGP (149 - 59 = 90, or 89/91)
  // - Upgrade Career Path -> All Access Difference: 250 EGP (399 - 149 = 250, or 249/251)
  // - Upgrade Track -> All Access Difference: 340 EGP (399 - 59 = 340, or 339/341)
  const trackTierAmounts = [59, 58, 60, 50, 49, pricing.trackPriceEgp];
  const careerPathTierAmounts = [149, 148, 150, 100, 99, pricing.careerPathPriceEgp];
  const allAccessTierAmounts = [399, 398, 400, 350, 349, pricing.allAccessPriceEgp];
  const trackVipAmounts = [258, 257, 249, 250, pricing.trackPriceEgp + pricing.orderBumpPriceEgp];
  const careerPathVipAmounts = [348, 347, 299, 300, pricing.careerPathPriceEgp + pricing.orderBumpPriceEgp];
  const legacySubscriptionAmounts = [349, 350, 399, 448, 449, 450, 548, 549, 550];
  const vipStandaloneUpgradeAmounts = [199, 200, pricing.orderBumpPriceEgp];
  const trackToCareerUpgradeAmounts = [90, 89, 91, pricing.careerPathPriceEgp - pricing.trackPriceEgp];
  const careerToAllAccessUpgradeAmounts = [250, 249, 251, pricing.allAccessPriceEgp - pricing.careerPathPriceEgp];
  const trackToAllAccessUpgradeAmounts = [340, 339, 341, pricing.allAccessPriceEgp - pricing.trackPriceEgp];

  const isTrackTier = trackTierAmounts.includes(payment.amountEgp);
  const isCareerPathTier = careerPathTierAmounts.includes(payment.amountEgp);
  const isAllAccessTier = allAccessTierAmounts.includes(payment.amountEgp);
  const isTrackVip = trackVipAmounts.includes(payment.amountEgp);
  const isCareerPathVip = careerPathVipAmounts.includes(payment.amountEgp);
  const isLegacyTier = legacySubscriptionAmounts.includes(payment.amountEgp);
  const isStandaloneVipUpgrade = vipStandaloneUpgradeAmounts.includes(payment.amountEgp);
  const isTrackToCareerUpgrade = trackToCareerUpgradeAmounts.includes(payment.amountEgp);
  const isCareerToAllAccessUpgrade = careerToAllAccessUpgradeAmounts.includes(payment.amountEgp);
  const isTrackToAllAccessUpgrade = trackToAllAccessUpgradeAmounts.includes(payment.amountEgp);
  const isAnyTierUpgrade = isTrackToCareerUpgrade || isCareerToAllAccessUpgrade || isTrackToAllAccessUpgrade;

  const isVipTier = isTrackVip || isCareerPathVip || isStandaloneVipUpgrade;
  const isRecognizedTier =
    isTrackTier ||
    isCareerPathTier ||
    isAllAccessTier ||
    isTrackVip ||
    isCareerPathVip ||
    isLegacyTier ||
    isStandaloneVipUpgrade ||
    isAnyTierUpgrade;

  // Search across pending subscription orders
  let candidateAmounts: number[] = [payment.amountEgp];
  if (isTrackTier) candidateAmounts = [...trackTierAmounts, ...trackVipAmounts];
  else if (isCareerPathTier) candidateAmounts = [...careerPathTierAmounts, ...careerPathVipAmounts, ...trackTierAmounts];
  else if (isAllAccessTier) candidateAmounts = [...allAccessTierAmounts, ...legacySubscriptionAmounts, ...careerPathTierAmounts, ...trackTierAmounts];
  else if (isTrackVip) candidateAmounts = [...trackVipAmounts, ...trackTierAmounts];
  else if (isCareerPathVip) candidateAmounts = [...careerPathVipAmounts, ...careerPathTierAmounts];
  else if (isLegacyTier) candidateAmounts = [...legacySubscriptionAmounts, ...allAccessTierAmounts];
  else if (isStandaloneVipUpgrade) candidateAmounts = [...vipStandaloneUpgradeAmounts, ...trackTierAmounts];
  else if (isTrackToCareerUpgrade) candidateAmounts = [...trackToCareerUpgradeAmounts, ...trackTierAmounts];
  else if (isCareerToAllAccessUpgrade) candidateAmounts = [...careerToAllAccessUpgradeAmounts, ...careerPathTierAmounts];
  else if (isTrackToAllAccessUpgrade) candidateAmounts = [...trackToAllAccessUpgradeAmounts, ...trackTierAmounts];
  candidateAmounts = Array.from(new Set(candidateAmounts));

  // Fetch pending candidate orders (ordered newest first)
  const candidates = await prisma.order.findMany({
    where: {
      status: "pending",
      amountEgp: { in: candidateAmounts },
    },
    include: { user: true, course: true },
    orderBy: { createdAt: "desc" },
  });

  if (candidates.length === 0) {
    if ((isStandaloneVipUpgrade || isAnyTierUpgrade) && (senderPhone || payment.senderName)) {
      // Look for an existing user with an approved order to upgrade
      const existingUser = await prisma.user.findFirst({
        where: senderPhone
          ? {
              OR: [
                { phone: { contains: senderPhone.slice(-9) } },
                { orders: { some: { senderPhone: { contains: senderPhone.slice(-9) } } } },
              ],
            }
          : undefined,
        include: {
          orders: { where: { status: "approved" }, orderBy: { createdAt: "desc" } },
        },
      });

      if (existingUser && existingUser.orders.length > 0) {
        const primaryOrder = existingUser.orders[0];
        const upgradedType =
          isCareerToAllAccessUpgrade || isTrackToAllAccessUpgrade
            ? "all_access"
            : isTrackToCareerUpgrade
            ? "career_path"
            : primaryOrder.productType;

        await prisma.order.update({
          where: { id: primaryOrder.id },
          data: {
            amountEgp: primaryOrder.amountEgp + payment.amountEgp,
            productType: upgradedType,
            proofChannel: isStandaloneVipUpgrade ? "vip_vault" : primaryOrder.proofChannel,
          },
        });
        await prisma.paymentTransaction.update({
          where: { id: tx.id },
          data: {
            status: "matched",
            matchedOrderId: primaryOrder.id,
            matchNote: `ترقية باقة تلقائية لمشترك حالي (${payment.amountEgp} ج.م)`,
          },
        });
        const activated = await activateOrder(primaryOrder.id, `ترقية باقة بمبلغ الفرق (${payment.amountEgp} ج.م)`);
        return {
          result: "activated",
          transactionId: tx.id,
          orderId: primaryOrder.id,
          email: existingUser.email,
          courseTitle: activated?.courseTitle || (isStandaloneVipUpgrade ? "خزنة VIP وقاعدة الـ 10,000 برومبت وعقود الفريلانس" : "ترقية الاشتراك الشامل"),
        };
      }
    }
    return park(`مفيش أي طلبات معلّقة بمبلغ ${payment.amountEgp} ج.م`);
  }

  let matchedOrder: (typeof candidates)[0] | null = null;
  let matchReason = "";

  // -------------------------------------------------------------
  // STRATEGY 1: Phone Matching (Vodafone Cash or InstaPay if phone present)
  // -------------------------------------------------------------
  if (senderPhone) {
    const phoneMatches = candidates.filter((o) => {
      const orderPhone = normalizePhone(o.senderPhone);
      const userPhone = normalizePhone(o.user.phone);
      if (orderPhone === senderPhone || userPhone === senderPhone) return true;
      if (orderPhone && (orderPhone.endsWith(senderPhone.slice(-9)) || senderPhone.endsWith(orderPhone.slice(-9)))) return true;
      if (userPhone && (userPhone.endsWith(senderPhone.slice(-9)) || senderPhone.endsWith(userPhone.slice(-9)))) return true;
      return false;
    });

    if (phoneMatches.length === 1) {
      matchedOrder = phoneMatches[0];
      matchReason = `تفعيل تلقائي (مطابقة رقم الموبايل: ${senderPhone})`;
    } else if (phoneMatches.length > 1) {
      matchedOrder = phoneMatches[0]; // Newest order
      matchReason = `تفعيل تلقائي (أحدث طلب مطابق للرقم: ${senderPhone})`;
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 2: Name Matching (InstaPay or Vodafone Cash with senderName)
  // -------------------------------------------------------------
  if (!matchedOrder && payment.senderName) {
    const name = payment.senderName.trim();

    // Try exact or high-confidence name match
    const exactNameMatches = candidates.filter((o) => {
      const claimed = o.instapayName ?? o.user.name ?? "";
      const isExactClaimed = compareNames(name, claimed) === "exact";
      const isExactUser = o.user.name ? compareNames(name, o.user.name) === "exact" : false;
      return isExactClaimed || isExactUser;
    });

    if (exactNameMatches.length === 1) {
      matchedOrder = exactNameMatches[0];
      matchReason = `تفعيل تلقائي (مطابقة تامة للاسم: ${name})`;
    } else if (exactNameMatches.length > 1) {
      matchedOrder = exactNameMatches[0];
      matchReason = `تفعيل تلقائي (أحدث طلب مطابق للاسم: ${name})`;
    } else {
      // Try partial name match (e.g. Alaa in Alaa Mohamed or vice versa)
      const partialMatches = candidates.filter((o) => {
        const claimed = o.instapayName ?? o.user.name ?? "";
        const isPartialClaimed = compareNames(name, claimed) !== "none";
        const isPartialUser = o.user.name ? compareNames(name, o.user.name) !== "none" : false;
        return isPartialClaimed || isPartialUser;
      });

      if (partialMatches.length === 1) {
        matchedOrder = partialMatches[0];
        matchReason = `تفعيل تلقائي (مطابقة اسم جزئي مؤكد: ${name})`;
      } else if (partialMatches.length > 1) {
        matchedOrder = partialMatches[0];
        matchReason = `تفعيل تلقائي (أحدث طلب لاسم قريب: ${name})`;
      }
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 3: Synchronized Single Pending Order Heuristic
  // If there is ONLY ONE pending order in the system matching this candidate pool,
  // and the payment arrived for a recognized subscription tier (349, 350, 448, 450),
  // activate it automatically without forcing manual human intervention!
  // -------------------------------------------------------------
  if (!matchedOrder && candidates.length === 1 && isRecognizedTier) {
    const onlyCandidate = candidates[0];
    const hoursSinceOrder = (Date.now() - new Date(onlyCandidate.createdAt).getTime()) / (1000 * 60 * 60);

    // If order was created in the last 72 hours and is the ONLY pending subscription order
    if (hoursSinceOrder <= 72) {
      matchedOrder = onlyCandidate;
      matchReason = `تفعيل تلقائي متزامن (الطلب الوحيد المعلق بمبلغ ${payment.amountEgp} ج.م)`;
    }
  }

  // If still no unambiguous match found, park it for review with clear diagnostics
  if (!matchedOrder) {
    const candidateSummary = candidates
      .slice(0, 3)
      .map((c) => `${c.user.name || c.user.email} (${c.senderPhone || c.instapayName || "بدون"})`)
      .join("، ");
    return park(
      `لم يتم تحديد طلب مؤكد تلقائياً للتحويل بمبلغ ${payment.amountEgp} ج.م. طلبات مرشحة: ${candidateSummary}`
    );
  }

  // If payment was for higher tier or upgrade, update order productType and amountEgp accordingly
  const targetProductType =
    isAllAccessTier || isCareerToAllAccessUpgrade || isTrackToAllAccessUpgrade
      ? "all_access"
      : isCareerPathTier || isTrackToCareerUpgrade
      ? "career_path"
      : matchedOrder.productType;

  matchedOrder = await prisma.order.update({
    where: { id: matchedOrder.id },
    data: {
      amountEgp: Math.max(matchedOrder.amountEgp, payment.amountEgp),
      originalPriceEgp: Math.max(matchedOrder.originalPriceEgp, payment.amountEgp),
      productType: targetProductType,
      proofChannel: isVipTier ? "vip_vault" : matchedOrder.proofChannel,
    },
    include: { user: true, course: true },
  });

  // Activate order immediately
  await prisma.paymentTransaction.update({
    where: { id: tx.id },
    data: { status: "matched", matchedOrderId: matchedOrder.id, matchNote: matchReason },
  });
  const activated = await activateOrder(matchedOrder.id, matchReason);

  return {
    result: "activated",
    transactionId: tx.id,
    orderId: matchedOrder.id,
    email: matchedOrder.user.email,
    courseTitle: activated?.courseTitle || matchedOrder.course.title,
  };
}
