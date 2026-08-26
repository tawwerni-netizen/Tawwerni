"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetForm />
    </Suspense>
  );
}

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("الباسوردين مش زي بعض");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const raw = await res.text();
      let data: { error?: string; hasOnboarded?: boolean } = {};
      try {
        data = JSON.parse(raw);
      } catch {
        /* not JSON — generic message below */
      }

      if (!res.ok) {
        setError(data.error ?? "اللينك مش شغّال. اطلب واحد جديد.");
        return;
      }

      // Reset signs them straight in, so send them where they belong.
      router.push(data.hasOnboarded ? "/app" : "/onboarding");
      router.refresh();
    } catch {
      setError("مفيش اتصال بالسيرفر. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Shell>
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-2xl">
            ⚠️
          </div>
          <h1 className="mb-2 text-lg font-bold">اللينك ناقص</h1>
          <p className="mb-5 text-sm leading-relaxed text-neutral-600">
            افتح اللينك من الإيميل زي ما هو. لو نسخته، اتأكد إنك نسخته كامل.
          </p>
          <Link href="/forgot-password" className="text-sm font-bold text-brand-600">
            اطلب لينك جديد ←
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <form onSubmit={submit}>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
          🔒
        </div>
        <h1 className="mb-1 text-center text-lg font-bold">حط كلمة سر جديدة</h1>
        <p className="mb-5 text-center text-sm leading-relaxed text-neutral-500">
          ٨ حروف على الأقل. اختار حاجة تفتكرها.
        </p>

        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة السر الجديدة"
            className="w-full rounded-xl border border-black/10 px-3 py-3 text-center text-sm"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500"
          >
            {show ? "إخفاء" : "إظهار"}
          </button>
        </div>

        <input
          type={show ? "text" : "password"}
          required
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="اكتبها تاني"
          className="mb-3 w-full rounded-xl border border-black/10 px-3 py-3 text-center text-sm"
        />

        {error && <p className="mb-3 text-center text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-shine w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "..." : "احفظ وادخل"}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <Link href="/" className="mb-8">
        <Logo size={42} />
      </Link>
      <div className="animate-rise w-full max-w-sm rounded-3xl border border-black/5 bg-white p-6">
        {children}
      </div>
    </div>
  );
}
