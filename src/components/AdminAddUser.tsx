"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Creating an account from the panel — for a sale that happened on WhatsApp.
 *
 * Shows the password back once, because the owner has to relay it to the
 * customer. It is stored hashed like every other password, so this is the only
 * moment it exists in readable form.
 */
export default function AdminAddUser() {
  const router = useRouter();
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
    // Readable, unambiguous, and long enough — no 0/O or 1/l to misread down
    // a phone line.
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
        /* not JSON — generic message below */
      }

      if (!res.ok) {
        setError(data.error ?? "مش قادر أعمل الحساب");
        return;
      }

      setDone({ email, password, note: data.note ?? "تم" });
      reset();
      setOpen(false);
      router.refresh();
    } catch {
      setError("مفيش اتصال بالسيرفر");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-4">
      {done && (
        <div className="animate-rise mb-3 rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-xs font-bold text-green-800">✓ الحساب جاهز</p>
          <p className="mb-3 text-[11px] leading-relaxed text-green-800">{done.note}</p>
          <div className="space-y-1.5">
            <Copyable label="الإيميل" value={done.email} />
            <Copyable label="الباسورد" value={done.password} />
          </div>
          <button
            onClick={() => setDone(null)}
            className="mt-3 text-[11px] font-bold text-green-800 underline-offset-4 hover:underline"
          >
            تمام، أخفي
          </button>
        </div>
      )}

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="btn-shine rounded-full bg-brand-600 px-4 py-2.5 text-xs font-bold text-white"
        >
          + أضف مستخدم
        </button>
      ) : (
        <form
          onSubmit={submit}
          className="animate-rise rounded-2xl border border-black/10 bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold">مستخدم جديد</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              className="text-xs text-neutral-500"
            >
              إلغاء
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="email"
              required
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="الإيميل"
              className="rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم"
              className="rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
            <input
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="رقم الموبايل (اختياري)"
              className="rounded-xl border border-black/10 px-3 py-2.5 text-sm"
            />
            <div className="flex gap-2">
              <input
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="الباسورد المؤقت"
                className="min-w-0 flex-1 rounded-xl border border-black/10 px-3 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={suggest}
                className="shrink-0 rounded-xl border border-black/10 px-3 text-xs font-bold"
              >
                ولّد
              </button>
            </div>
          </div>

          <label className="mt-3 flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={grant}
              onChange={(e) => setGrant(e.target.checked)}
              className="h-4 w-4"
            />
            افتحله كل المسارات على طول (يعني دفع)
          </label>

          {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="btn-shine mt-3 w-full rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white disabled:opacity-60"
          >
            {busy ? "..." : "اعمل الحساب"}
          </button>

          <p className="mt-2 text-[11px] leading-relaxed text-neutral-400">
            الباسورد ده هيظهرلك مرة واحدة بس بعد الحفظ. العميل هيتطلب منه يغيّره أول
            ما يدخل.
          </p>
        </form>
      )}
    </div>
  );
}

function Copyable({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5">
      <span className="shrink-0 text-[10px] text-neutral-500">{label}</span>
      <span dir="ltr" className="min-w-0 flex-1 truncate text-left font-mono text-xs font-bold">
        {value}
      </span>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="shrink-0 text-[10px] font-bold text-brand-600"
      >
        {copied ? "✓" : "انسخ"}
      </button>
    </div>
  );
}
