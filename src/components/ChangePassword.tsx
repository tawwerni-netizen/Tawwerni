"use client";

import { useState } from "react";
import { useI18n } from "./LanguageContext";

/**
 * Change-your-own-password panel.
 *
 * Used on the learner's account page and inside the admin panel — the owner's
 * panel password is just their account password, so there is one place this
 * behaviour lives rather than two that can drift apart.
 */
export default function ChangePassword({ compact = false }: { compact?: boolean }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function reset() {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (next !== confirm) {
      setError(isEn ? "New passwords do not match" : "الباسوردين الجداد مش زي بعض");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });

      const raw = await res.text();
      let data: { error?: string } = {};
      try {
        data = JSON.parse(raw);
      } catch {
        /* not JSON — generic message below */
      }

      if (!res.ok) {
        setError(data.error ?? (isEn ? "Failed to change password" : "مش قادر أغيّر الباسورد"));
        return;
      }

      reset();
      setDone(true);
      setOpen(false);
      setTimeout(() => setDone(false), 6000);
    } catch {
      setError(isEn ? "Server connection failed" : "مفيش اتصال بالسيرفر");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`rounded-full border border-black/10 dark:border-white/10 px-4 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:border-brand-500/40 transition-colors ${
            compact ? "" : "w-full"
          }`}
        >
          {isEn ? "🔒 Change Password" : "🔒 غيّر كلمة السر"}
        </button>
        {done && (
          <p className="animate-rise mt-2 text-center text-[11px] font-bold text-green-700 dark:text-green-400">
            {isEn
              ? "✓ Password successfully changed! We sent you a confirmation email."
              : "✓ كلمة السر اتغيّرت، وبعتنالك إيميل يأكّد ده"}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="animate-rise rounded-2xl border border-black/10 dark:border-white/10 p-3">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
          {isEn ? "Change Password" : "تغيير كلمة السر"}
        </p>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            reset();
          }}
          className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          {isEn ? "Cancel" : "إلغاء"}
        </button>
      </div>

      {/* A hidden username field so password managers know which account this
          new password belongs to. Without it they save it unattached. */}
      <input type="text" autoComplete="username" className="hidden" tabIndex={-1} readOnly />

      <input
        type={show ? "text" : "password"}
        required
        autoComplete="current-password"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        placeholder={isEn ? "Current Password" : "كلمة السر الحالية"}
        className="mb-2 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-neutral-800 px-3 py-2.5 text-sm"
      />
      <input
        type={show ? "text" : "password"}
        required
        autoComplete="new-password"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        placeholder={isEn ? "New Password (at least 8 chars)" : "كلمة السر الجديدة (٨ حروف على الأقل)"}
        className="mb-2 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-neutral-800 px-3 py-2.5 text-sm"
      />
      <input
        type={show ? "text" : "password"}
        required
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder={isEn ? "Confirm New Password" : "اكتب الجديدة تاني"}
        className="mb-2 w-full rounded-xl border border-black/10 dark:border-white/10 dark:bg-neutral-800 px-3 py-2.5 text-sm"
      />

      <label className="mb-3 flex items-center gap-2 text-[11px] text-neutral-500">
        <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
        {isEn ? "Show passwords" : "أظهر كلمات السر"}
      </label>

      {error && <p className="mb-2 text-[11px] text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="btn-shine w-full rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white disabled:opacity-60 hover:bg-brand-700 transition-colors"
      >
        {busy ? "..." : isEn ? "Save New Password" : "احفظ كلمة السر الجديدة"}
      </button>
    </form>
  );
}
