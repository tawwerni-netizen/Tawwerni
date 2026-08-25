/**
 * Transactional email.
 *
 * Uses Resend when RESEND_API_KEY is configured, and otherwise falls back to
 * logging the message so local development never silently depends on a network
 * service. The caller never needs to know which path was taken.
 */

import { brand } from "@/content/brand";

export type SendResult =
  | { ok: true; id: string; delivered: true }
  | { ok: true; id: null; delivered: false; reason: "not_configured" }
  | { ok: false; error: string };

function fromAddress(): string {
  // e.g. "طوّرني <noreply@tawwerni.com>"
  const addr = process.env.EMAIL_FROM ?? `noreply@${brand.domain}`;
  return `${brand.name} <${addr}>`;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  /** Set for one-off account mail so it never lands in a promo tab. */
  replyTo?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Not an error: the site is fully usable before email is wired up.
    console.info(
      `[email:not-sent] to=${opts.to} subject="${opts.subject}"\n` +
        `${opts.text}\n` +
        `(set RESEND_API_KEY to deliver this for real)`
    );
    return { ok: true, id: null, delivered: false, reason: "not_configured" };
  }

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
      // Never throw at the caller — a failed receipt must not fail a payment.
      console.error(`[email:failed] ${res.status} ${detail.slice(0, 300)}`);
      return { ok: false, error: `resend_${res.status}` };
    }

    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id ?? "sent", delivered: true };
  } catch (err) {
    console.error("[email:error]", err);
    return { ok: false, error: "network" };
  }
}
