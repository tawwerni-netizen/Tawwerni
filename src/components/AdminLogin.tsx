"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/content/brand";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Wrapped: an unparseable response (an HTML error page from the host, a
    // dropped connection) used to leave the button spinning forever with no
    // explanation.
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const raw = await res.text();
        let message = "الإيميل أو الباسورد غلط";
        try {
          message = JSON.parse(raw).error ?? message;
        } catch {
          /* not JSON — keep the default */
        }
        setError(message);
        return;
      }

      router.refresh();
    } catch {
      setError("مفيش اتصال بالسيرفر. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-black/5 bg-white p-6 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
          🔐
        </div>
        <h1 className="mb-1 text-lg font-bold">لوحة إدارة {brand.name}</h1>
        <p className="mb-5 text-sm text-neutral-500">ادخل بحساب المالك</p>

        <input
          type="email"
          required
          autoComplete="username"
          dir="ltr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="الإيميل"
          className="mb-3 w-full rounded-xl border border-black/10 px-3 py-3 text-center text-sm"
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر"
          className="mb-3 w-full rounded-xl border border-black/10 px-3 py-3 text-center text-sm"
        />

        {error && <p className="mb-3 text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-shine w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
