"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { brand } from "@/content/brand";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/request-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "حصل خطأ");
      return;
    }
    // devCode only comes back while email delivery is unconfigured.
    setDevCode(data.devCode ?? null);
    setStep("code");
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "حصل خطأ");
      return;
    }
    router.push(data.hasOnboarded ? "/app" : "/onboarding");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-neutral-50">
      <div className="w-full max-w-sm">
        <p className="text-center text-lg font-bold text-brand-800 mb-8">
          {brand.name}
          <span className="text-brand-400">.com</span>
        </p>

        {step === "email" ? (
          <form onSubmit={requestCode} className="bg-white rounded-2xl border border-black/5 p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-2xl mb-4">
              👤
            </div>
            <h1 className="text-xl font-bold mb-1">أهلًا بيك تاني</h1>
            <p className="text-sm text-neutral-500 mb-5">اكتب إيميلك وهنبعتلك كود دخول سريع — من غير باسورد</p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full text-center border border-black/10 rounded-xl px-3 py-3 mb-3 text-sm"
              dir="ltr"
            />
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm disabled:opacity-60"
            >
              {loading ? "..." : "إرسال كود الدخول"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="bg-white rounded-2xl border border-black/5 p-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 flex items-center justify-center text-2xl mb-4">
              ✉️
            </div>
            <h1 className="text-xl font-bold mb-1">افحص الكود</h1>
            <p className="text-sm text-neutral-500 mb-3">
              بعتنالك كود من ٦ أرقام على <span dir="ltr">{email}</span>
            </p>
            {devCode ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 text-xs text-amber-800">
                🔒 وضع تجريبي — الكود: <span className="font-bold text-base tracking-widest" dir="ltr">{devCode}</span>
              </div>
            ) : (
              <p className="mb-4 text-[11px] text-neutral-400">
                لو ما لقتش الرسالة، بصّ في الـ Spam أو Promotions.
              </p>
            )}
            <input
              inputMode="numeric"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full text-center tracking-[0.5em] border border-black/10 rounded-xl px-3 py-3 mb-3 text-lg"
              dir="ltr"
            />
            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 btn-shine text-white font-bold rounded-full py-3 text-sm disabled:opacity-60"
            >
              {loading ? "..." : "تسجيل الدخول"}
            </button>
            <button
              type="button"
              onClick={() => setStep("email")}
              className="w-full text-xs text-neutral-400 mt-3"
            >
              غيّر الإيميل
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
