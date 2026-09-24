"use client";

import { useState } from "react";
import { useI18n } from "./LanguageContext";

export default function AdminEmailTest({
  configured,
  via,
  from,
  smtpHost,
}: {
  configured: boolean;
  via: "smtp" | "resend" | null;
  from: string;
  smtpHost: string | null;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [to, setTo] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to }),
      });
      const data = await res.json().catch(() => ({}));
      setResult(
        res.ok
          ? {
              ok: true,
              message: isEn
                ? `Sent ✓ via ${data.via === "smtp" ? "SMTP" : "Resend"}. Check your inbox (and Spam).`
                : `اتبعت ✓ عن طريق ${data.via === "smtp" ? "SMTP" : "Resend"}. شوف بريدك (وSpam).`,
            }
          : { ok: false, message: data.error ?? (isEn ? "Failed to send" : "فشل الإرسال") }
      );
    } catch {
      setResult({ ok: false, message: isEn ? "Network error" : "مفيش اتصال بالسيرفر" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
      <h2 className="mb-2 text-sm font-bold text-neutral-900 dark:text-white">
        {isEn ? "Email System Status" : "حالة نظام البريد"}
      </h2>

      {configured ? (
        <div className="mb-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 p-3">
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
            ✓ {isEn ? `Configured via ${via === "smtp" ? "SMTP" : "Resend"}` : `متظبط عن طريق ${via === "smtp" ? "SMTP" : "Resend"}`}
          </p>
          <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-mono" dir="ltr">
            {via === "smtp" && smtpHost ? `${smtpHost} · ` : ""}
            {from}
          </p>
        </div>
      ) : (
        <div className="mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 p-3">
          <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
            ⚠ {isEn ? "Email service not configured" : "الإيميل مش متظبط"}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-200">
            {isEn
              ? "Login codes appear on screen for now. Set SMTP or Resend credentials in host environment variables."
              : "دلوقتي كود الدخول بيظهر على الشاشة بدل ما يتبعت. حط متغيّرات SMTP أو Resend في إعدادات الاستضافة واعمل Restart."}
          </p>
        </div>
      )}

      <form onSubmit={send} className="flex gap-2">
        <input
          required
          type="email"
          dir="ltr"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={isEn ? "Send test to your email..." : "ابعت تجربة على إيميلك"}
          className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-xs text-neutral-900 dark:text-white focus:outline-teal-500"
        />
        <button
          type="submit"
          disabled={busy || !configured}
          className="shrink-0 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-50 transition"
        >
          {busy ? "..." : isEn ? "Send" : "ابعت"}
        </button>
      </form>

      {result && (
        <p className={`mt-2 text-xs font-medium ${result.ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
