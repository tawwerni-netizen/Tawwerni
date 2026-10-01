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

function authorized(request: Request, body?: Record<string, unknown>): boolean {
  const expected = process.env.PAYMENT_INGEST_TOKEN;
  if (!expected) return false;

  // 1. Authorization header (Bearer or raw)
  const header = request.headers.get("authorization") ?? "";
  let presented = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();

  // 2. Custom API key headers
  if (!presented) {
    presented =
      request.headers.get("x-api-key")?.trim() ||
      request.headers.get("x-token")?.trim() ||
      "";
  }

  // 3. Fallback to token inside JSON body
  if (!presented && body) {
    if (typeof body.token === "string") presented = body.token.trim();
    else if (typeof body.api_key === "string") presented = body.api_key.trim();
    else if (typeof body.apiKey === "string") presented = body.apiKey.trim();
    else if (typeof body.secret === "string") presented = body.secret.trim();
  }

  if (!presented) return false;

  const a = Buffer.from(presented);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function normalizeProvider(raw: unknown, rawSms: string): "vodafone_cash" | "instapay" | null {
  const p = String(raw ?? "").toLowerCase().trim();
  if (["vodafone_cash", "vodafone", "vfcash", "vf_cash", "vodafonecash", "vf"].includes(p)) {
    return "vodafone_cash";
  }
  if (["instapay", "insta_pay", "ipn", "insta"].includes(p)) {
    return "instapay";
  }
  // Auto-detect from SMS keywords
  if (rawSms.includes("محفظتك") || rawSms.includes("فودافون") || rawSms.includes("vfcash") || rawSms.includes("vf.eg")) {
    return "vodafone_cash";
  }
  if (rawSms.includes("IPN") || rawSms.includes("تحويل لحظي") || rawSms.includes("استقبلت تحويل") || rawSms.includes("انستاباي") || rawSms.includes("InstaPay")) {
    return "instapay";
  }
  return null;
}

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  /*
   * Throttled before the token is even checked. One phone posts a handful of
   * messages a day — this cap is far above anything real traffic will hit.
   */
  const gate = testBypass(request) ? ({ ok: true } as const) : rateLimit(`payin:${clientIp(request)}`, 60, 300);
  if (!gate.ok) return tooMany(gate, "Too many requests");

  let body: Record<string, unknown> = {};
  try {
    body = await readJson(request);
  } catch {
    return NextResponse.json({ success: false, message: "Malformed JSON" }, { status: 400 });
  }

  if (!authorized(request, body)) {
    return NextResponse.json({ success: false, message: "Unauthorized: Invalid or missing token" }, { status: 401 });
  }

  const rawSms = typeof body.raw_sms === "string" ? body.raw_sms : "";
  if (!rawSms.trim()) {
    return NextResponse.json({ success: false, message: "Missing raw_sms: SMS text is required" }, { status: 422 });
  }

  // Re-parse the raw SMS on server so any regex improvement applies instantly
  const reparsed = parsePaymentSms(rawSms);

  const provider = normalizeProvider(body.provider, rawSms) ?? reparsed?.provider;
  if (!provider) {
    return NextResponse.json({ success: false, message: "Unknown provider: expected vodafone_cash or instapay" }, { status: 422 });
  }

  // Parse amount with flexible formats: 349, 350, "349", "350.00", "350 ج.م"
  let parsedAmount = NaN;
  if (typeof body.amount === "number" && Number.isFinite(body.amount)) {
    parsedAmount = Math.round(body.amount);
  } else if (typeof body.amount === "string") {
    const cleaned = body.amount.replace(/,/g, "").replace(/[^\d.]/g, "");
    const num = Number(cleaned);
    if (Number.isFinite(num)) parsedAmount = Math.round(num);
  }

  const amountEgp = reparsed?.amountEgp ?? parsedAmount;
  if (!Number.isFinite(amountEgp) || amountEgp <= 0 || amountEgp > 1_000_000) {
    return NextResponse.json({ success: false, message: "Invalid amount" }, { status: 422 });
  }

  const payment: IncomingPayment = {
    provider,
    amountEgp,
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
