import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";
import { payment } from "@/content/brand";
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
  for (const n of payment.vodafoneCash) {
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

  // Only money that landed in one of our own wallets can activate anything.
  // A transfer into some other wallet is somebody else's business.
  const receiver = normalizePhone(payment.receiverPhone);
  if (receiver) {
    const ours = ownWalletTails();
    if (ours.size > 0 && !ours.has(receiver)) {
      return park(`التحويل وصل على محفظة مش بتاعتنا (${payment.receiverPhone})`);
    }
  }

  // Candidate orders: still pending, for exactly this amount.
  const candidates = await prisma.order.findMany({
    where: { status: "pending", amountEgp: payment.amountEgp },
    include: { user: true, course: true },
    orderBy: { createdAt: "asc" },
  });

  let matches: typeof candidates;

  if (payment.provider === "instapay") {
    // IPN receipts carry no phone — fall back to the payer name the customer
    // gave at checkout, and only when the whole name lines up.
    const name = payment.senderName?.trim();
    if (!name) return park("رسالة إنستاباي من غير اسم المحوِّل");

    matches = candidates.filter((o) => {
      const claimed = o.instapayName ?? o.user.name;
      return claimed ? compareNames(name, claimed) === "exact" : false;
    });

    if (matches.length === 0) {
      const partial = candidates.filter((o) => {
        const claimed = o.instapayName ?? o.user.name;
        return claimed ? compareNames(name, claimed) === "partial" : false;
      });
      return park(
        partial.length
          ? `اسم قريب مش مطابق تمامًا: «${name}» — راجع بنفسك`
          : `مفيش طلب معلّق باسم «${name}» بمبلغ ${payment.amountEgp} ج.م`
      );
    }
  } else {
    if (!senderPhone) return park("الرسالة مفيهاش رقم المحوِّل");

    matches = candidates.filter(
      (o) => normalizePhone(o.senderPhone) === senderPhone || normalizePhone(o.user.phone) === senderPhone
    );

    if (matches.length === 0) {
      /*
       * Was a DB-level `contains` filter. This database has a genuine
       * collation mismatch on at least the `User.email` and `Order.senderPhone`
       * columns (`utf8mb4_unicode_ci` vs `utf8mb4_bin`) that makes MySQL's LIKE
       * operator throw `Illegal mix of collations` outright — not a partial
       * match, a hard error. That turned every Vodafone Cash transfer landing
       * with no exact phone+amount match into an uncaught exception: the
       * webhook 500'd back to the Android forwarder, and this park() call
       * (with the one diagnostic line telling the operator "same phone,
       * different amount") never ran. The `PaymentTransaction` row itself was
       * already written above, so no transfer was ever lost — but the note
       * explaining why it needs review was. `candidates` above already proves
       * this dataset is small enough to filter in memory instead of asking
       * MySQL to do it.
       */
      const phoneSuffix = senderPhone.slice(-9);
      const pendingPhones = await prisma.order.findMany({
        where: { status: "pending" },
        select: { senderPhone: true },
      });
      const anyPhone = pendingPhones.some((o) => o.senderPhone?.includes(phoneSuffix));
      return park(
        anyPhone
          ? `فيه طلب من نفس الرقم بس بمبلغ مختلف (المحوَّل ${payment.amountEgp} ج.م)`
          : "مفيش طلب معلّق بنفس الرقم والمبلغ"
      );
    }
  }

  if (matches.length > 1) {
    return park(`فيه ${matches.length} طلبات معلّقة مطابقة — اختار بنفسك`);
  }

  // Exactly one explanation — safe to activate.
  const order = matches[0];
  await prisma.paymentTransaction.update({
    where: { id: tx.id },
    data: { status: "matched", matchedOrderId: order.id, matchNote: "تفعيل تلقائي" },
  });
  await activateOrder(order.id, "تفعيل تلقائي");

  return {
    result: "activated",
    transactionId: tx.id,
    orderId: order.id,
    email: order.user.email,
    courseTitle: order.course.title,
  };
}
