"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/content/brand";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "حصل خطأ");
      return;
    }
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-neutral-50">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-2xl border border-black/5 p-6 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-2xl mb-4">
          🔐
        </div>
        <h1 className="text-lg font-bold mb-1">لوحة إدارة {brand.name}</h1>
        <p className="text-sm text-neutral-500 mb-5">ادخل كلمة السر للوصول للطلبات</p>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر"
          className="w-full text-center border border-black/10 rounded-xl px-3 py-3 mb-3 text-sm"
        />
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm disabled:opacity-60"
        >
          {loading ? "..." : "دخول"}
        </button>
      </form>
    </div>
  );
}
