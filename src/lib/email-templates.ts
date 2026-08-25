/**
 * RTL Arabic email templates.
 *
 * Written with tables and inline styles because Gmail, Outlook and most Arabic
 * webmail clients strip <style> blocks and ignore flex/grid. Every template
 * ships a plain-text twin — clients that block HTML still get a usable message,
 * and it keeps us out of spam filters that penalise HTML-only mail.
 */

import { brand, pricing, payment } from "@/content/brand";

const TEAL = "#0F6E56";
const TEAL_DARK = "#085041";
const INK = "#0a1f1a";
const MUTED = "#6b7280";
const BG = "#f4f7f6";

const FONT =
  "'Segoe UI', Tahoma, Arial, 'Helvetica Neue', Helvetica, sans-serif";

function shell(bodyHtml: string, preheader: string): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${brand.name}</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:${FONT};direction:rtl;text-align:right;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,.06);">
  <tr>
    <td style="background:${TEAL_DARK};padding:20px 24px;text-align:center;">
      <span style="color:#ffffff;font-size:20px;font-weight:bold;">${brand.name}</span><span style="color:#5DCAA5;font-size:20px;font-weight:bold;">.com</span>
    </td>
  </tr>
  ${bodyHtml}
  <tr>
    <td style="padding:18px 24px;background:#fafafa;border-top:1px solid rgba(0,0,0,.05);">
      <p style="margin:0 0 6px;font-size:12px;color:${MUTED};line-height:1.7;">
        محتاج مساعدة؟ واتساب <span dir="ltr">${payment.supportWhatsapp}</span>
        أو <a href="mailto:${payment.supportEmail}" style="color:${TEAL};text-decoration:none;">${payment.supportEmail}</a>
      </p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        وصلتك الرسالة دي لأن عندك حساب على ${brand.name}. دي رسالة خدمة عن حسابك.
      </p>
    </td>
  </tr>
</table>
<p style="margin:14px 0 0;font-size:11px;color:#9ca3af;">© ${new Date().getFullYear()} ${brand.name} · ${brand.domain}</p>
</td></tr>
</table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 4px;">
    <tr><td style="background:${TEAL};border-radius:999px;">
      <a href="${href}" style="display:inline-block;padding:13px 30px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none;">${label}</a>
    </td></tr>
  </table>`;
}

/* ------------------------------------------------------------------ */

export function otpEmail(code: string) {
  const html = shell(
    `<tr><td style="padding:28px 24px 8px;">
      <h1 style="margin:0 0 8px;font-size:21px;color:${INK};">كود الدخول بتاعك</h1>
      <p style="margin:0 0 20px;font-size:14px;color:${MUTED};line-height:1.8;">
        استخدم الكود ده عشان تدخل حسابك. صالح لمدة <b>١٠ دقايق</b> بس.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        <tr><td align="center" style="background:#E1F5EE;border:1px solid #9FE1CB;border-radius:14px;padding:20px;">
          <div style="font-size:34px;font-weight:bold;letter-spacing:10px;color:${TEAL_DARK};direction:ltr;">${code}</div>
        </td></tr>
      </table>
      <p style="margin:0 0 22px;font-size:12px;color:${MUTED};line-height:1.8;">
        لو مش انت اللي طلبت الكود ده، تجاهل الرسالة — محدش هيقدر يدخل حسابك من غيره.
        <b style="color:${INK};">وما تبعتش الكود ده لأي حد.</b>
      </p>
    </td></tr>`,
    `كود الدخول: ${code}`
  );

  const text = `كود الدخول بتاعك: ${code}

صالح لمدة ١٠ دقايق.
لو مش انت اللي طلبته، تجاهل الرسالة. وما تبعتش الكود لأي حد.

${brand.name} · ${brand.domain}`;

  return { subject: `كود الدخول: ${code}`, html, text };
}

/* ------------------------------------------------------------------ */

export function orderReceivedEmail(opts: {
  name: string | null;
  courseTitle: string;
  method: "vodafone_cash" | "instapay" | string;
}) {
  const methodLabel = opts.method === "instapay" ? "إنستاباي" : "فودافون كاش";
  const numbers =
    opts.method === "instapay" ? payment.instapay : payment.vodafoneCash;

  const numbersHtml = numbers
    .map(
      (n) =>
        `<tr><td style="padding:7px 12px;background:#ffffff;border:1px solid rgba(0,0,0,.08);border-radius:9px;font-size:15px;font-weight:bold;direction:ltr;text-align:left;color:${INK};">${n}</td></tr>
         <tr><td style="height:7px;line-height:7px;">&nbsp;</td></tr>`
    )
    .join("");

  const html = shell(
    `<tr><td style="padding:28px 24px 8px;">
      <h1 style="margin:0 0 8px;font-size:21px;color:${INK};">سجّلنا طلبك ✅</h1>
      <p style="margin:0 0 18px;font-size:14px;color:${MUTED};line-height:1.8;">
        أهلًا${opts.name ? ` ${opts.name}` : ""}، سجّلنا طلبك لمسار <b style="color:${INK};">${opts.courseTitle}</b>.
        فاضل خطوة واحدة بس.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#E1F5EE;border-radius:12px;">
        <tr><td style="padding:16px;">
          <p style="margin:0 0 4px;font-size:12px;color:${TEAL_DARK};">المبلغ المطلوب</p>
          <p style="margin:0;font-size:26px;font-weight:bold;color:${TEAL_DARK};">
            ${pricing.priceEgp} ج.م
            <span style="font-size:14px;font-weight:normal;color:#6b8f83;text-decoration:line-through;">${pricing.originalPriceEgp}</span>
          </p>
        </td></tr>
      </table>

      <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:${INK};">حوّل عن طريق ${methodLabel} على:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${numbersHtml}</table>

      <p style="margin:0 0 20px;font-size:13px;color:${MUTED};line-height:1.9;">
        بعد التحويل، هنفعّل المسار على الإيميل ده خلال <b style="color:${INK};">${payment.activationHours} ساعة</b> على الأكثر —
        وغالبًا أسرع بكتير.
      </p>
    </td></tr>`,
    `فاضل خطوة واحدة: حوّل ${pricing.priceEgp} ج.م`
  );

  const text = `سجّلنا طلبك لمسار: ${opts.courseTitle}

المبلغ: ${pricing.priceEgp} ج.م (بدل ${pricing.originalPriceEgp})

حوّل عن طريق ${methodLabel} على:
${numbers.map((n) => `  ${n}`).join("\n")}

بعد التحويل هنفعّل المسار خلال ${payment.activationHours} ساعة.

محتاج مساعدة؟ واتساب ${payment.supportWhatsapp} أو ${payment.supportEmail}
${brand.name} · ${brand.domain}`;

  return { subject: `طلبك اتسجّل — ${opts.courseTitle}`, html, text };
}

/* ------------------------------------------------------------------ */

export function courseActivatedEmail(opts: {
  name: string | null;
  courseTitle: string;
  courseSlug: string;
  amountEgp: number;
}) {
  const url = `https://${brand.domain}/app/learn/${opts.courseSlug}`;

  const html = shell(
    `<tr><td style="padding:28px 24px 8px;">
      <div style="font-size:40px;line-height:1;margin:0 0 10px;">🎉</div>
      <h1 style="margin:0 0 8px;font-size:21px;color:${INK};">تم تفعيل مسارك!</h1>
      <p style="margin:0 0 20px;font-size:14px;color:${MUTED};line-height:1.8;">
        ${opts.name ? `مبروك ${opts.name}! ` : "مبروك! "}
        وصلنا تحويلك و<b style="color:${INK};">${opts.courseTitle}</b> مفتوح دلوقتي بالكامل على حسابك.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid rgba(0,0,0,.08);border-radius:12px;">
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:${MUTED};">المسار</td>
          <td style="padding:12px 16px;font-size:13px;font-weight:bold;color:${INK};text-align:left;">${opts.courseTitle}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:${MUTED};border-top:1px solid rgba(0,0,0,.05);">المبلغ</td>
          <td style="padding:12px 16px;font-size:13px;font-weight:bold;color:${INK};text-align:left;border-top:1px solid rgba(0,0,0,.05);">${opts.amountEgp} ج.م</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:${MUTED};border-top:1px solid rgba(0,0,0,.05);">الوصول</td>
          <td style="padding:12px 16px;font-size:13px;font-weight:bold;color:${TEAL};text-align:left;border-top:1px solid rgba(0,0,0,.05);">مدى الحياة</td>
        </tr>
      </table>

      ${button(url, "ابدأ اليوم الأول ←")}

      <p style="margin:16px 0 20px;font-size:12px;color:${MUTED};line-height:1.9;">
        نصيحة: خلّي درس واحد كل يوم في نفس الميعاد. الاستمرارية هي اللي بتفرق — مش السرعة.
      </p>
    </td></tr>`,
    `${opts.courseTitle} مفتوح دلوقتي على حسابك`
  );

  const text = `تم تفعيل مسارك! 🎉

المسار: ${opts.courseTitle}
المبلغ: ${opts.amountEgp} ج.م
الوصول: مدى الحياة

ابدأ من هنا: ${url}

${brand.name} · ${brand.domain}`;

  return { subject: `تم تفعيل ${opts.courseTitle} 🎉`, html, text };
}
