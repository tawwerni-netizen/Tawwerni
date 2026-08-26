import { NextResponse } from "next/server";
import { readJson } from "@/lib/read-json";
import { timingSafeEqual } from "crypto";
import { rateLimit, clientIp, tooMany, testBypass } from "@/lib/rate-limit";
import { recordAndMatch, type IncomingPayment } from "@/lib/payment-matching";
import { parsePaymentSms } from "@/lib/sms-parsers";

/**
 * Ingest endpoint for the Android SMS receiver.
 *
 * The phone is a dumb reporter: it forwards what it read and this endpoint
 * decides whether anything gets activated. Auth is a static bearer token
 * because exactly one known device ever calls it.
 */

const VALID_PROVIDERS = ["vodafone_cash", "instapay"];

function authorized(request: Request): boolean {
  const expected = process.env.PAYMENT_INGEST_TOKEN;
  if (!expected) return false;

  const header = request.headers.get("authorization") ?? "";
  const presented = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!presented) return false;

  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  /*
   * Throttled before the token is even checked. The bearer token is the only
   * thing standing between the open internet and the payment ledger, and an
   * unthrottled endpoint lets it be guessed at whatever rate the network
   * allows. One phone posts a handful of messages a day — this cap is far
   * above anything real traffic will hit.
   */
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`payin:${clientIp(request)}`, 60, 300);
  if (!gate.ok) return tooMany(gate, "Too many requests");

  if (!authorized(request)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await readJson(request);
  } catch {
    return NextResponse.json({ success: false, message: "Malformed JSON" }, { status: 400 });
  }

  const provider = String(body.provider ?? "");
  if (!VALID_PROVIDERS.includes(provider)) {
    return NextResponse.json({ success: false, message: "Unknown provider" }, { status: 422 });
  }

  // Accept "500" or 500 or "500.00", but never a zero/negative/absurd amount.
  const rawAmount = typeof body.amount === "string" ? Number(body.amount) : body.amount;
  const amountEgp = typeof rawAmount === "number" && Number.isFinite(rawAmount) ? Math.round(rawAmount) : NaN;
  if (!Number.isFinite(amountEgp) || amountEgp <= 0 || amountEgp > 1_000_000) {
    return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 422 });
  }

  const rawSms = typeof body.raw_sms === "string" ? body.raw_sms : "";
  if (!rawSms.trim()) {
    return NextResponse.json({ success: false, message: "Missing raw_sms" }, { status: 422 });
  }

  // Re-parse the raw SMS here and let the server's reading win. The phone's own
  // parse is only a fallback, so a format change can be fixed with a deploy
  // instead of reinstalling the APK on the receiving handset.
  const reparsed = parsePaymentSms(rawSms);

  const payment: IncomingPayment = {
    provider: reparsed?.provider ?? provider,
    amountEgp: reparsed?.amountEgp ?? amountEgp,
    transactionRef:
      reparsed?.transactionRef ??
      ((typeof body.transaction_id === "string" && body.transaction_id.trim()) ||
        (typeof body.reference_number === "string" && body.reference_number.trim()) ||
        null),
    senderPhone:
      reparsed?.senderPhone ?? (typeof body.sender_phone === "string" ? body.sender_phone : null),
    senderName: reparsed?.senderName ?? (typeof body.sender_name === "string" ? body.sender_name : null),
    receiverPhone:
      reparsed?.receiverPhone ?? (typeof body.receiver_phone === "string" ? body.receiver_phone : null),
    transactionAt: reparsed?.transactionAt ?? parseDate(body.transaction_date),
    smsReceivedAt: parseDate(body.sms_received_at) ?? new Date(),
    rawSms: rawSms.slice(0, 2000),
  };

  const outcome = await recordAndMatch(payment);

  switch (outcome.result) {
    case "duplicate":
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate transaction",
          transaction_id: outcome.transactionId,
          status: outcome.status,
        },
        { status: 409 }
      );

    case "activated":
      return NextResponse.json({
        success: true,
        message: "Payment verified",
        transaction_id: outcome.transactionId,
        order_id: outcome.orderId,
        user_email: outcome.email,
        course_title: outcome.courseTitle,
        activated: true,
      });

    case "unmatched":
      // 200, not an error: the phone did its job. A human resolves it from /admin.
      return NextResponse.json({
        success: false,
        message: "Payment not matched",
        transaction_id: outcome.transactionId,
        reason: outcome.reason,
        activated: false,
      });
  }
}
