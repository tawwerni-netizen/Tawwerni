"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { payment } from "@/content/brand";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const raw = await res.text();
      let data: { error?: string } = {};
      try {
        data = JSON.parse(raw);
      } catch {
        /* an HTML error page from the host — fall through to the generic message */
      }

      if (!res.ok) {
        setError(data.error ?? "حصل خطأ. جرّب تاني.");
        return;
      }

      setSent(true);
    } catch {
      setError("مفيش اتصال بالسيرفر. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-10">
      <Link href="/" className="mb-8">
        <Logo size={42} />
      </Link>

      <div className="animate-rise w-full max-w-sm rounded-3xl border border-black/5 bg-white p-6">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-3xl">
              📬
            </div>
            <h1 className="mb-2 text-lg font-bold">بصّ في إيميلك</h1>
            <p className="mb-5 text-sm leading-relaxed text-neutral-600">
              لو <b dir="ltr">{email}</b> عنده حساب عندنا، هيوصله لينك تحط منه كلمة سر
              جديدة. اللينك صالح <b>ساعة واحدة</b> وبيشتغل مرة واحدة بس.
            </p>
            <p className="mb-5 rounded-2xl bg-neutral-50 p-3 text-xs leading-relaxed text-neutral-500">
              ما وصلش؟ بصّ في الـSpam. ولو لسه مش لاقيه، كلّمنا على واتساب{" "}
              <b dir="ltr">{payment.supportWhatsapp}</b> وهنحلّها معاك.
            </p>
            <Link href="/login" className="tap inline-block py-1 text-sm font-bold text-brand-600">
              رجوع لتسجيل الدخول ←
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
              🔑
            </div>
            <h1 className="mb-1 text-center text-lg font-bold">نسيت كلمة السر؟</h1>
            <p className="mb-5 text-center text-sm leading-relaxed text-neutral-500">
              اكتب إيميلك وهنبعتلك لينك تحط منه واحدة جديدة.
            </p>

            <input
              type="email"
              required
              autoComplete="username"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="الإيميل بتاعك"
              className="mb-3 w-full rounded-xl border border-black/10 px-3 py-3 text-center text-sm"
            />

            {error && <p className="mb-3 text-center text-xs text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-shine mb-4 w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "..." : "ابعتلي اللينك"}
            </button>

            <p className="text-center text-xs text-neutral-500">
              فاكرها؟{" "}
              <Link href="/login" className="font-bold text-brand-600">
                سجّل دخول
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
