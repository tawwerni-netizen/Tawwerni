/**
 * RTL Arabic email templates.
 *
 * Written with tables and inline styles because Gmail, Outlook and most Arabic
 * webmail clients strip <style> blocks and ignore flex/grid. Every template
 * ships a plain-text twin — clients that block HTML still get a usable message,
 * and it keeps us out of spam filters that penalise HTML-only mail.
 */

import { brand, pricing, payment, social } from "@/content/brand";

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
      <p style="margin:0 0 8px;font-size:12px;color:${MUTED};">
        ${social
          .map((s) => `<a href="${s.url}" style="color:${TEAL};text-decoration:none;">${s.label}</a>`)
          .join(" &nbsp;·&nbsp; ")}
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
        أهلًا${opts.name ? ` ${opts.name}` : ""}، سجّلنا طلبك. اشتراك واحد بيفتحلك <b style="color:${INK};">كل المسارات</b> — وهتبدأ بـ <b style="color:${INK};">${opts.courseTitle}</b>.
        فاضل خطوة واحدة بس.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;background:#E1F5EE;border-radius:12px;">
        <tr><td style="padding:16px;">
          <p style="margin:0 0 4px;font-size:12px;color:${TEAL_DARK};">المبلغ المطلوب</p>
          <p style="margin:0;font-size:26px;font-weight:bold;color:${TEAL_DARK};">
            ${pricing.priceEgp} ج.م
          </p>
        </td></tr>
      </table>

      <p style="margin:0 0 10px;font-size:13px;font-weight:bold;color:${INK};">حوّل عن طريق ${methodLabel} على:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${numbersHtml}</table>

      <p style="margin:0 0 20px;font-size:13px;color:${MUTED};line-height:1.9;">
        بعد التحويل، هنفعّل اشتراكك على الإيميل ده خلال <b style="color:${INK};">${payment.activationHours} ساعة</b> على الأكثر —
        وغالبًا أسرع بكتير.
      </p>
    </td></tr>`,
    `فاضل خطوة واحدة: حوّل ${pricing.priceEgp} ج.م`
  );

  const text = `سجّلنا طلبك — اشتراك واحد بيفتح كل المسارات.
هتبدأ بـ: ${opts.courseTitle}

المبلغ: ${pricing.priceEgp} ج.م

حوّل عن طريق ${methodLabel} على:
${numbers.map((n) => `  ${n}`).join("\n")}

بعد التحويل هنفعّل اشتراكك خلال ${payment.activationHours} ساعة.

محتاج مساعدة؟ واتساب ${payment.supportWhatsapp} أو ${payment.supportEmail}
${brand.name} · ${brand.domain}`;

  return { subject: `طلبك اتسجّل — خطوة واحدة وتبدأ`, html, text };
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
        وصلنا تحويلك — و<b style="color:${INK};">كل المسارات</b> مفتوحة دلوقتي على حسابك، مش بس <b style="color:${INK};">${opts.courseTitle}</b>.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border:1px solid rgba(0,0,0,.08);border-radius:12px;">
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:${MUTED};">بدأت بـ</td>
          <td style="padding:12px 16px;font-size:13px;font-weight:bold;color:${INK};text-align:left;">${opts.courseTitle}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:${MUTED};border-top:1px solid rgba(0,0,0,.05);">المبلغ</td>
          <td style="padding:12px 16px;font-size:13px;font-weight:bold;color:${INK};text-align:left;border-top:1px solid rgba(0,0,0,.05);">${opts.amountEgp} ج.م</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;color:${MUTED};border-top:1px solid rgba(0,0,0,.05);">الوصول</td>
          <td style="padding:12px 16px;font-size:13px;font-weight:bold;color:${TEAL};text-align:left;border-top:1px solid rgba(0,0,0,.05);">كل المسارات · مدى الحياة</td>
        </tr>
      </table>

      ${button(url, "ابدأ اليوم الأول ←")}

      <p style="margin:16px 0 20px;font-size:12px;color:${MUTED};line-height:1.9;">
        نصيحة: خلّي درس واحد كل يوم في نفس الميعاد. الاستمرارية هي اللي بتفرق — مش السرعة.
      </p>
    </td></tr>`,
    `كل المسارات مفتوحة دلوقتي على حسابك`
  );

  const text = `تم تفعيل اشتراكك! 🎉

كل المسارات مفتوحة دلوقتي على حسابك.
بدأت بـ: ${opts.courseTitle}
المبلغ: ${opts.amountEgp} ج.م
الوصول: كل المسارات · مدى الحياة

ابدأ من هنا: ${url}

${brand.name} · ${brand.domain}`;

  return { subject: `تم تفعيل اشتراكك — كل المسارات مفتوحة 🎉`, html, text };
}

/* ------------------------------------------------------------------ */

/**
 * Sent once, the first time an account is created. Its job is to get the
 * learner into lesson one while the intent is still fresh.
 */
export function welcomeEmail(opts: { name: string | null }) {
  const url = `https://${brand.domain}/app`;

  const html = shell(
    `<tr><td style="padding:28px 24px 8px;">
      <div style="font-size:40px;line-height:1;margin:0 0 10px;">👋</div>
      <h1 style="margin:0 0 8px;font-size:21px;color:${INK};">أهلًا بيك في ${brand.name}!</h1>
      <p style="margin:0 0 18px;font-size:14px;color:${MUTED};line-height:1.8;">
        ${opts.name ? `أهلًا ${opts.name}. ` : ""}حسابك اتفتح. من دلوقتي، كل يوم فيه
        درس واحد قصير — تقراه، تنفّذ مهمة صغيرة، وتجاوب على كام سؤال يثبّتوا المعلومة.
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#E1F5EE;border-radius:12px;">
        <tr><td style="padding:16px;">
          <p style="margin:0 0 8px;font-size:13px;font-weight:bold;color:${TEAL_DARK};">الطريقة اللي بتنجح</p>
          <p style="margin:0 0 5px;font-size:13px;color:${TEAL_DARK};line-height:1.9;">١. درس واحد بس في اليوم — متستعجلش.</p>
          <p style="margin:0 0 5px;font-size:13px;color:${TEAL_DARK};line-height:1.9;">٢. في نفس الميعاد كل يوم.</p>
          <p style="margin:0;font-size:13px;color:${TEAL_DARK};line-height:1.9;">٣. نفّذ المهمة العملية — دي الجزء اللي بيثبّت.</p>
        </td></tr>
      </table>

      ${button(url, "ابدأ أول درس ←")}

      <p style="margin:16px 0 20px;font-size:12px;color:${MUTED};line-height:1.9;">
        اليوم الأول من كل مسار مفتوح مجانًا — جرّب الأسلوب الأول قبل أي حاجة.
      </p>
    </td></tr>`,
    `حسابك جاهز — ابدأ أول درس`
  );

  const text = `أهلًا بيك في ${brand.name}!

حسابك اتفتح. كل يوم فيه درس واحد قصير: تقراه، تنفّذ مهمة، وتجاوب على أسئلة.

الطريقة اللي بتنجح:
1. درس واحد بس في اليوم
2. في نفس الميعاد كل يوم
3. نفّذ المهمة العملية

ابدأ من هنا: ${url}

${brand.name} · ${brand.domain}`;

  return { subject: `أهلًا بيك في ${brand.name} 👋`, html, text };
}

/* ------------------------------------------------------------------ */

export function passwordResetEmail(opts: { name: string | null; url: string; minutes: number }) {
  const html = shell(
    `<tr><td style="padding:28px 24px 8px;">
      <div style="font-size:40px;line-height:1;margin:0 0 10px;">🔑</div>
      <h1 style="margin:0 0 8px;font-size:21px;color:${INK};">تغيير كلمة السر</h1>
      <p style="margin:0 0 20px;font-size:14px;color:${MUTED};line-height:1.8;">
        ${opts.name ? `أهلًا ${opts.name}، ` : ""}وصلنا طلب لتغيير كلمة السر بتاعة حسابك.
        دوس الزرار وحط واحدة جديدة. اللينك ده صالح <b style="color:${INK};">${opts.minutes} دقيقة</b> بس،
        وبيشتغل <b style="color:${INK};">مرة واحدة</b>.
      </p>

      ${button(opts.url, "حط كلمة سر جديدة")}

      <p style="margin:16px 0 20px;font-size:12px;color:${MUTED};line-height:1.8;">
        لو الزرار مش شغّال، انسخ اللينك ده:<br>
        <span style="color:${TEAL};word-break:break-all;direction:ltr;display:inline-block;">${opts.url}</span>
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;background:#FFF7E6;border-radius:12px;">
        <tr><td style="padding:14px 16px;">
          <p style="margin:0;font-size:12px;color:#8a6100;line-height:1.8;">
            <b>لو مش إنت اللي طلبت ده</b> — تجاهل الرسالة. كلمة السر بتاعتك زي ما هي،
            ومحدش يقدر يغيّرها من غير اللينك ده.
          </p>
        </td></tr>
      </table>
    </td></tr>`,
    `لينك تغيير كلمة السر — صالح ${opts.minutes} دقيقة`
  );

  const text = `تغيير كلمة السر — ${brand.name}

وصلنا طلب لتغيير كلمة السر بتاعة حسابك.

افتح اللينك ده وحط واحدة جديدة:
${opts.url}

اللينك صالح ${opts.minutes} دقيقة بس، وبيشتغل مرة واحدة.

لو مش إنت اللي طلبت ده، تجاهل الرسالة — كلمة السر بتاعتك زي ما هي.

${brand.name} · ${brand.domain}`;

  return { subject: "تغيير كلمة السر", html, text };
}

/* ------------------------------------------------------------------ */

export function passwordChangedEmail(opts: { name: string | null }) {
  const html = shell(
    `<tr><td style="padding:28px 24px 8px;">
      <div style="font-size:40px;line-height:1;margin:0 0 10px;">✅</div>
      <h1 style="margin:0 0 8px;font-size:21px;color:${INK};">كلمة السر اتغيّرت</h1>
      <p style="margin:0 0 20px;font-size:14px;color:${MUTED};line-height:1.8;">
        ${opts.name ? `${opts.name}، ` : ""}كلمة السر بتاعة حسابك اتغيّرت دلوقتي.
        لو إنت اللي عملت كده، مفيش حاجة مطلوبة منك.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;background:#FFF1F1;border-radius:12px;">
        <tr><td style="padding:14px 16px;">
          <p style="margin:0;font-size:12px;color:#9b1c1c;line-height:1.8;">
            <b>لو مش إنت</b> — كلّمنا فورًا على واتساب
            <span dir="ltr">${payment.supportWhatsapp}</span> عشان نأمّن حسابك.
          </p>
        </td></tr>
      </table>
    </td></tr>`,
    `كلمة السر بتاعة حسابك اتغيّرت`
  );

  const text = `كلمة السر بتاعة حسابك على ${brand.name} اتغيّرت.

لو إنت اللي عملت كده، مفيش حاجة مطلوبة.
لو مش إنت — كلّمنا فورًا على واتساب ${payment.supportWhatsapp}.

${brand.name} · ${brand.domain}`;

  return { subject: "كلمة السر بتاعة حسابك اتغيّرت", html, text };
}
