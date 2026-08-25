import nodemailer, { type Transporter } from "nodemailer";
import { brand } from "@/content/brand";

/**
 * Transactional email.
 *
 * Two ways to deliver, checked in order:
 *
 *  1. SMTP  — set SMTP_HOST / SMTP_USER / SMTP_PASS. Works with the mailbox
 *             that comes free with Hostinger, so mail is sent from your own
 *             domain with no third-party signup.
 *  2. Resend — set RESEND_API_KEY. Better deliverability at volume.
 *
 * With neither configured the message is logged instead of sent, so the site
 * stays fully usable before email is wired up.
 */

export type SendResult =
  | { ok: true; id: string; delivered: true; via: "smtp" | "resend" }
  | { ok: true; id: null; delivered: false; reason: "not_configured" }
  | { ok: false; error: string };

function fromAddress(): string {
  const addr = process.env.EMAIL_FROM ?? `noreply@${brand.domain}`;
  return `${brand.name} <${addr}>`;
}

/** Reuse one connection pool — a new one per email is slow and gets throttled. */
let transporter: Transporter | null = null;

function smtpTransport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    transporter = nodemailer.createTransport({
      host,
      port,
      // 465 is implicit TLS; 587 upgrades with STARTTLS.
      secure: port === 465,
      auth: { user, pass },
      pool: true,
      maxConnections: 3,
    });
  }
  return transporter;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<SendResult> {
  const smtp = smtpTransport();

  if (smtp) {
    try {
      const info = await smtp.sendMail({
        from: fromAddress(),
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        replyTo: opts.replyTo,
      });
      return { ok: true, id: info.messageId, delivered: true, via: "smtp" };
    } catch (err) {
      // Never throw at the caller — a failed receipt must not fail a payment.
      console.error("[email:smtp-failed]", err instanceof Error ? err.message : err);
      return { ok: false, error: "smtp" };
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress(),
          to: [opts.to],
          subject: opts.subject,
          html: opts.html,
          text: opts.text,
          ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error(`[email:resend-failed] ${res.status} ${detail.slice(0, 300)}`);
        return { ok: false, error: `resend_${res.status}` };
      }

      const data = (await res.json()) as { id?: string };
      return { ok: true, id: data.id ?? "sent", delivered: true, via: "resend" };
    } catch (err) {
      console.error("[email:resend-error]", err);
      return { ok: false, error: "network" };
    }
  }

  // Not an error: the site is fully usable before email is wired up.
  console.info(
    `[email:not-sent] to=${opts.to} subject="${opts.subject}"\n` +
      `${opts.text}\n` +
      `(set SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY to deliver this)`
  );
  return { ok: true, id: null, delivered: false, reason: "not_configured" };
}

/** Used by the admin diagnostics page to show what is actually configured. */
export function emailStatus() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const smtpReady = Boolean(host && user && pass);
  const resendReady = Boolean(process.env.RESEND_API_KEY);

  return {
    configured: smtpReady || resendReady,
    via: smtpReady ? ("smtp" as const) : resendReady ? ("resend" as const) : null,
    smtpHost: host ?? null,
    from: process.env.EMAIL_FROM ?? `noreply@${brand.domain}`,
  };
}
