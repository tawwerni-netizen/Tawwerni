import { parsePaymentSms, looksLikePayment } from "../src/lib/sms-parsers";

/** Real captured messages — do not "tidy" these, the spacing is meaningful. */
const VF_1 = `تم استلام مبلغ 500.00 جنيه من رقم 01515339319 المسجل بإسم أمنيه محمد شقره على رقم محفظتك  01069999557.
رصيدك الحالي: 3909.52 جنيه
تاريخ العملية: 21:50 26-08-19
رقم العملية: 022857190374
تابع كل مصروفاتك من تاريخ المعاملات على أبلكيشن أنا فودافون http://vf.eg/vfcash`;

const VF_2 = `تم استلام مبلغ 400.00 جنيه من 01067558133؛
المسجل بإسم Hifzy Hifzy Abd El Kareem Ahmed
على رقم محفظتك 01069999557 بتاريخ 20:32 26-08-02.
رصيدك الحالي: 4144.75 جنيه
رقم العملية: 022304890518
 تقدر تتابع كل مصروفاتك من تاريخ المعاملات على أبلكيشن أنا فودافون http://vf.eg/vfcash`;

const IPN_1 = `لقد استقبلت تحويل لحظي على  0540 بمبلغ 5,000.00 جم عبر IPN من محمد فريد احمد محمود يوم  28-02-2026 الساعة  16:50 رقم المعاملة 9def186b للمساعدة www.mashreq.com/mashreqipn`;

/** Messages that must NEVER be treated as an incoming payment. */
const NEGATIVES: [string, string][] = [
  ["outgoing transfer", "تم تحويل مبلغ 200.00 جنيه من محفظتك الى 01234567890"],
  ["balance enquiry", "رصيدك الحالي: 3909.52 جنيه"],
  ["promo", "اشحن الآن واربح! تم استلام عرضك الجديد من فودافون"],
  ["otp", "كود التفعيل الخاص بك هو 123456 لا تشاركه مع أحد"],
  ["empty", ""],
];

let failures = 0;

function check(label: string, actual: unknown, expected: unknown) {
  const a = actual instanceof Date ? actual.toISOString() : actual;
  const e = expected instanceof Date ? expected.toISOString() : expected;
  const ok = a === e;
  if (!ok) failures++;
  console.log(`   ${ok ? "✓" : "✗"} ${label.padEnd(22)} ${ok ? String(a) : `got ${JSON.stringify(a)} — expected ${JSON.stringify(e)}`}`);
}

console.log("\n── فودافون كاش · رسالة ١ (صيغة «من رقم» + «تاريخ العملية») ──");
{
  const p = parsePaymentSms(VF_1);
  if (!p) { console.log("   ✗ لم يتم التعرف على الرسالة"); failures++; }
  else {
    check("provider", p.provider, "vodafone_cash");
    check("amount", p.amountEgp, 500);
    check("sender", p.senderPhone, "01515339319");
    check("senderName", p.senderName, "أمنيه محمد شقره");
    check("receiver", p.receiverPhone, "01069999557");
    check("reference", p.transactionRef, "022857190374");
    check("date", p.transactionAt, new Date(Date.UTC(2026, 7, 19, 21, 50)));
  }
}

console.log("\n── فودافون كاش · رسالة ٢ (صيغة «من» + «بتاريخ» + اسم لاتيني) ──");
{
  const p = parsePaymentSms(VF_2);
  if (!p) { console.log("   ✗ لم يتم التعرف على الرسالة"); failures++; }
  else {
    check("provider", p.provider, "vodafone_cash");
    check("amount", p.amountEgp, 400);
    check("sender", p.senderPhone, "01067558133");
    check("senderName", p.senderName, "Hifzy Hifzy Abd El Kareem Ahmed");
    check("receiver", p.receiverPhone, "01069999557");
    check("reference", p.transactionRef, "022304890518");
    check("date", p.transactionAt, new Date(Date.UTC(2026, 7, 2, 20, 32)));
  }
}

console.log("\n── إنستاباي ──");
{
  const p = parsePaymentSms(IPN_1);
  if (!p) { console.log("   ✗ لم يتم التعرف على الرسالة"); failures++; }
  else {
    check("provider", p.provider, "instapay");
    check("amount (5,000.00)", p.amountEgp, 5000);
    check("senderName", p.senderName, "محمد فريد احمد محمود");
    check("senderPhone (لا يوجد)", p.senderPhone, null);
    check("receiver tail", p.receiverAccountTail, "0540");
    check("reference", p.transactionRef, "9def186b");
    check("date", p.transactionAt, new Date(Date.UTC(2026, 1, 28, 16, 50)));
  }
}

console.log("\n── رسائل يجب رفضها ──");
for (const [label, sms] of NEGATIVES) {
  const parsed = parsePaymentSms(sms);
  const flagged = looksLikePayment(sms);
  const ok = parsed === null && !flagged;
  if (!ok) failures++;
  console.log(`   ${ok ? "✓" : "✗"} ${label.padEnd(22)} ${ok ? "مرفوضة" : "⚠ تم قبولها بالخطأ!"}`);
}

console.log("\n── التأكد أن الرصيد لا يُقرأ كمبلغ ──");
{
  const p = parsePaymentSms(VF_1)!;
  const balanceInMessage = 3909.52;
  const ok = p.amountEgp === 500 && p.amountExact !== balanceInMessage;
  if (!ok) failures++;
  console.log(`   ${ok ? "✓" : "✗"} المبلغ ${p.amountEgp} وليس الرصيد ${balanceInMessage}`);
}

console.log(
  failures === 0
    ? "\n✅ كل الاختبارات نجحت\n"
    : `\n❌ ${failures} اختبار فشل\n`
);
process.exit(failures === 0 ? 0 : 1);
