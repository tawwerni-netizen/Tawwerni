/**
 * Parsers for the payment SMS formats we actually receive.
 *
 * Built from real message samples, not guesses. Every pattern here was written
 * against a captured SMS and is covered by a test in `scripts/test-parsers.ts`.
 *
 * Design note: parsing lives on the server rather than only in the Android app
 * so a format change can be fixed with a deploy instead of reinstalling the APK
 * on the receiving handset. The app still forwards `raw_sms`, which is what
 * these functions consume.
 */

export type ParsedSms = {
  provider: "vodafone_cash" | "instapay";
  amountEgp: number;
  /** Full precision amount — matching uses the rounded pound value. */
  amountExact: number;
  transactionRef: string | null;
  senderPhone: string | null;
  senderName: string | null;
  receiverPhone: string | null;
  /** InstaPay only exposes the last 4 digits of the destination account. */
  receiverAccountTail: string | null;
  transactionAt: Date | null;
};

/** "5,000.00" and "500.00" both mean a number; the comma is a thousands mark. */
function toNumber(raw: string): number {
  return Number(raw.replace(/,/g, ""));
}

/** Egyptian mobile in any of the shapes the networks emit. */
const EG_MOBILE = /(?:\+?20)?(01\d{9})/;

function normalizeMobile(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const m = raw.match(EG_MOBILE);
  return m ? m[1] : null;
}

/**
 * Vodafone Cash writes the year first with two digits: "21:50 26-08-19"
 * is 19 Aug 2026 at 21:50. Times are local (Africa/Cairo, UTC+3 in summer)
 * but we keep them naive — matching never depends on the timestamp.
 */
function vodafoneDate(time: string, ymd: string): Date | null {
  const t = time.match(/^(\d{1,2}):(\d{2})$/);
  const d = ymd.match(/^(\d{2})-(\d{2})-(\d{2})$/);
  if (!t || !d) return null;
  const [, hh, mm] = t;
  const [, yy, mo, dd] = d;
  const date = new Date(Date.UTC(2000 + Number(yy), Number(mo) - 1, Number(dd), Number(hh), Number(mm)));
  return Number.isNaN(date.getTime()) ? null : date;
}

/** InstaPay writes day-first with a full year: "28-02-2026 ... 16:50". */
function instapayDate(dmy: string, time: string): Date | null {
  const d = dmy.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const t = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!d || !t) return null;
  const [, dd, mo, yyyy] = d;
  const [, hh, mm] = t;
  const date = new Date(Date.UTC(Number(yyyy), Number(mo) - 1, Number(dd), Number(hh), Number(mm)));
  return Number.isNaN(date.getTime()) ? null : date;
}

/* ------------------------------------------------------------------ */
/* Vodafone Cash                                                       */
/* ------------------------------------------------------------------ */

const VF = {
  /** Only incoming transfers. "تم استلام" is the receipt wording. */
  isReceipt: /تم\s+استلام\s+مبلغ/,
  /**
   * Anchored to the receipt phrase so the balance line
   * ("رصيدك الحالي: 3909.52 جنيه") can never be read as the amount.
   */
  amount: /تم\s+استلام\s+مبلغ\s*([\d,]+(?:\.\d{1,2})?)\s*جنيه/,
  /** Both "من رقم 015…" and "من 010…؛" appear in the wild. */
  sender: /من\s+(?:رقم\s+)?((?:\+?20)?01\d{9})/,
  receiver: /محفظتك\s*((?:\+?20)?01\d{9})/,
  /** Name runs until the next clause; Arabic and Latin both occur. */
  senderName: /المسجل\s+بإسم\s+([^\n؛.]+?)\s*(?:على\s+رقم|\n|؛|$)/,
  reference: /رقم\s+العملية:?\s*(\d+)/,
  /** "تاريخ العملية: 21:50 26-08-19" or "بتاريخ 20:32 26-08-02." */
  dateTime: /(?:تاريخ\s+العملية:?|بتاريخ)\s*(\d{1,2}:\d{2})\s+(\d{2}-\d{2}-\d{2})/,
};

export function parseVodafoneCash(sms: string): ParsedSms | null {
  const text = sms.replace(/ /g, " ");
  if (!VF.isReceipt.test(text)) return null;

  const amountMatch = text.match(VF.amount);
  if (!amountMatch) return null;
  const amountExact = toNumber(amountMatch[1]);
  if (!Number.isFinite(amountExact) || amountExact <= 0) return null;

  const dt = text.match(VF.dateTime);

  return {
    provider: "vodafone_cash",
    amountEgp: Math.round(amountExact),
    amountExact,
    transactionRef: text.match(VF.reference)?.[1] ?? null,
    senderPhone: normalizeMobile(text.match(VF.sender)?.[1]),
    senderName: text.match(VF.senderName)?.[1]?.trim() ?? null,
    receiverPhone: normalizeMobile(text.match(VF.receiver)?.[1]),
    receiverAccountTail: null,
    transactionAt: dt ? vodafoneDate(dt[1], dt[2]) : null,
  };
}

/* ------------------------------------------------------------------ */
/* InstaPay (IPN)                                                      */
/* ------------------------------------------------------------------ */

const IPN = {
  isReceipt: /استقبلت\s+تحويل|تحويل\s+لحظي/,
  amount: /بمبلغ\s*([\d,]+(?:\.\d{1,2})?)\s*(?:جم|جنيه|EGP)/i,
  /** Destination is masked to its last four digits. */
  receiverTail: /على\s+(\d{4})\s+بمبلغ/,
  /** Sender is a NAME — IPN messages carry no sender phone number. */
  senderName: /من\s+([^\n]+?)\s+يوم\s/,
  reference: /رقم\s+المعامل[ةه]\s*([0-9a-zA-Z]+)/,
  dateTime: /يوم\s*(\d{2}-\d{2}-\d{4})\s*الساعة\s*(\d{1,2}:\d{2})/,
};

export function parseInstaPay(sms: string): ParsedSms | null {
  const text = sms.replace(/ /g, " ");
  if (!IPN.isReceipt.test(text)) return null;

  const amountMatch = text.match(IPN.amount);
  if (!amountMatch) return null;
  const amountExact = toNumber(amountMatch[1]);
  if (!Number.isFinite(amountExact) || amountExact <= 0) return null;

  const dt = text.match(IPN.dateTime);

  return {
    provider: "instapay",
    amountEgp: Math.round(amountExact),
    amountExact,
    transactionRef: text.match(IPN.reference)?.[1] ?? null,
    // Deliberately null: IPN receipts identify the sender by name only.
    senderPhone: null,
    senderName: text.match(IPN.senderName)?.[1]?.trim() ?? null,
    receiverPhone: null,
    receiverAccountTail: text.match(IPN.receiverTail)?.[1] ?? null,
    transactionAt: dt ? instapayDate(dt[1], dt[2]) : null,
  };
}

/* ------------------------------------------------------------------ */

/** Cheap pre-filter so non-payment SMS never leave the device. */
export function looksLikePayment(sms: string): boolean {
  return VF.isReceipt.test(sms) || IPN.isReceipt.test(sms);
}

/** Try every parser; returns null when the text is not a payment receipt. */
export function parsePaymentSms(sms: string): ParsedSms | null {
  return parseVodafoneCash(sms) ?? parseInstaPay(sms);
}
