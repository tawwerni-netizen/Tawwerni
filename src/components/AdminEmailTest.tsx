"use client";

import { useState } from "react";

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
          ? { ok: true, message: `اتبعت ✓ عن طريق ${data.via === "smtp" ? "SMTP" : "Resend"}. شوف بريدك (وSpam).` }
          : { ok: false, message: data.error ?? "فشل الإرسال" }
      );
    } catch {
      setResult({ ok: false, message: "مفيش اتصال" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <h2 className="mb-1 text-sm font-bold">حالة الإيميل</h2>

      {configured ? (
        <div className="mb-3 rounded-xl bg-green-50 p-3">
          <p className="text-xs font-bold text-green-800">
            ✓ متظبط عن طريق {via === "smtp" ? "SMTP" : "Resend"}
          </p>
          <p className="mt-1 text-xs text-green-700" dir="ltr">
            {via === "smtp" && smtpHost ? `${smtpHost} · ` : ""}
            {from}
          </p>
        </div>
      ) : (
        <div className="mb-3 rounded-xl bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-900">⚠ الإيميل مش متظبط</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            دلوقتي كود الدخول بيظهر على الشاشة بدل ما يتبعت. حط متغيّرات SMTP أو
            Resend في إعدادات الاستضافة واعمل Restart.
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
          placeholder="ابعت تجربة على إيميلك"
          className="flex-1 rounded-xl border border-black/10 px-3 py-2.5 text-sm focus:border-brand-600 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !configured}
          className="btn-shine shrink-0 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {busy ? "..." : "ابعت"}
        </button>
      </form>

      {result && (
        <p className={`mt-2 text-xs ${result.ok ? "text-green-700" : "text-red-600"}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
