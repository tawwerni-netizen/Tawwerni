"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageContext";

/**
 * Creating an account from the panel — for a sale that happened on WhatsApp.
 *
 * Full bilingual support (Arabic / English) and dark/light modes.
 */
export default function AdminAddUser() {
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [grant, setGrant] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ email: string; password: string; note: string } | null>(null);

  function suggest() {
    const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
    let out = "";
    const bytes = new Uint8Array(10);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < 10; i++) out += alphabet[bytes[i] % alphabet.length];
    setPassword(out);
  }

  function reset() {
    setEmail("");
    setName("");
    setPhone("");
    setPassword("");
    setGrant(true);
    setError("");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, phone, password, grantAccess: grant }),
      });

      const raw = await res.text();
      let data: { error?: string; note?: string } = {};
      try {
        data = JSON.parse(raw);
      } catch {
        /* fallback */
      }

      if (!res.ok) {
        setError(data.error ?? (isEn ? "Failed to create user" : "حصل مشكلة في إنشاء الحساب"));
        return;
      }

      setDone({
        email,
        password,
        note:
          data.note ??
          (grant
            ? isEn
              ? "All tracks unlocked. Please send this temporary password to the learner."
              : "كل المسارات اتفتحت. ابعت الباسورد المؤقت ده للعميل في واتساب."
            : isEn
            ? "Account created without active subscription."
            : "الحساب اتعمل بس المسارات لسه مقفولة."),
      });
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setError(isEn ? "Connection error" : "مفيش اتصال بالسيرفر");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-4">
      {done && (
        <div className="animate-rise mb-3 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 shadow-xs">
          <p className="mb-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            {isEn ? "✓ Account Successfully Created" : "✓ الحساب جاهز"}
          </p>
          <p className="mb-3 text-[11px] leading-relaxed text-emerald-900 dark:text-emerald-200">{done.note}</p>
          <div className="space-y-1.5">
            <Copyable label={isEn ? "Email" : "الإيميل"} value={done.email} isEn={isEn} />
            <Copyable label={isEn ? "Password" : "الباسورد"} value={done.password} isEn={isEn} />
          </div>
          <button
            onClick={() => setDone(null)}
            className="mt-3 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 underline-offset-4 hover:underline"
          >
            {isEn ? "Dismiss" : "تمام، أخفي"}
          </button>
        </div>
      )}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 hover:brightness-110 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition"
        >
          {isEn ? "+ Add New Learner" : "+ أضف مستخدم"}
        </button>
      ) : (
        <form
          onSubmit={submit}
          className="animate-rise rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              {isEn ? "New Learner Account" : "مستخدم جديد"}
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

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isEn ? "Email address" : "الإيميل"}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-teal-500"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? "Full Name" : "الاسم"}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-teal-500"
            />
            <input
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={isEn ? "Phone number (optional)" : "رقم الموبايل (اختياري)"}
              className="rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-teal-500"
            />
            <div className="flex gap-2">
              <input
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEn ? "Temporary password" : "الباسورد المؤقت"}
                className="min-w-0 flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3 py-2.5 text-sm text-neutral-900 dark:text-white focus:outline-teal-500 font-mono"
              />
              <button
                type="button"
                onClick={suggest}
                className="shrink-0 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-700 px-3 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100"
              >
                {isEn ? "Generate" : "ولّد"}
              </button>
            </div>
          </div>

          <label className="mt-3 flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
            <input
              type="checkbox"
              checked={grant}
              onChange={(e) => setGrant(e.target.checked)}
              className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500"
            />
            <span>
              {isEn
                ? "Unlock all 100 tracks immediately (marked as paid)"
                : "افتحله كل المسارات على طول (يعني دفع)"}
            </span>
          </label>

          {error && <p className="mt-2 text-[11px] text-red-600 dark:text-red-400 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-3 w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-2.5 text-xs font-bold text-white shadow-xs hover:brightness-110 disabled:opacity-60 transition"
          >
            {busy ? "..." : isEn ? "Create Account" : "اعمل الحساب"}
          </button>

          <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">
            {isEn
              ? "This temporary password will only be visible once upon saving. Share it securely with the learner."
              : "الباسورد ده هيظهرلك مرة واحدة بس بعد الحفظ. العميل هيتطلب منه يغيّره أول ما يدخل."}
          </p>
        </form>
      )}
    </div>
  );
}

function Copyable({ label, value, isEn }: { label: string; value: string; isEn: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white dark:bg-neutral-800 border border-black/5 dark:border-white/10 px-3 py-2">
      <span className="shrink-0 text-[10px] text-neutral-500 dark:text-neutral-400">{label}</span>
      <span dir="ltr" className="min-w-0 flex-1 truncate text-left font-mono text-xs font-bold text-neutral-900 dark:text-white">
        {value}
      </span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
      >
        {copied ? (isEn ? "✓ Copied" : "✓ تم النسخ") : isEn ? "Copy" : "انسخ"}
      </button>
    </div>
  );
}
