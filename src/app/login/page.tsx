"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { brand } from "@/content/brand";

type Mode = "login" | "signup";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [mode, setMode] = useState<Mode>(params.get("signup") ? "signup" : "login");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Every path below must clear `loading`, or the button sticks forever.
    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email, password } : { email, password, name, phone }
        ),
      });

      // A crashed route returns HTML, so parsing can throw too.
      const raw = await res.text();
      let data: { error?: string; hasOnboarded?: boolean } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data.error ?? `حصل خطأ في السيرفر (${res.status}). جرّب تاني.`);
        return;
      }

      router.push(data.hasOnboarded ? "/app" : "/onboarding");
      router.refresh();
    } catch {
      setError("مفيش اتصال بالإنترنت. اتأكد من الشبكة وجرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-5 py-10">
      <p className="mb-7 text-xl font-bold text-brand-800">
        {brand.name}
        <span className="text-brand-400">.com</span>
      </p>

      <div className="animate-rise w-full max-w-sm rounded-3xl border border-black/5 bg-white p-7 shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
          {isSignup ? "✨" : "👋"}
        </div>

        <h1 className="mb-1 text-center text-xl font-bold">
          {isSignup ? "اعمل حسابك" : "أهلًا بيك تاني"}
        </h1>
        <p className="mb-6 text-center text-sm text-neutral-500">
          {isSignup
            ? "دقيقة واحدة وتبدأ أول درس"
            : "ادخل بالإيميل والباسورد بتاعك"}
        </p>

        <form onSubmit={submit} className="space-y-3">
          {isSignup && (
            <>
              <Field
                label="اسمك"
                value={name}
                onChange={setName}
                placeholder="الاسم بالكامل"
                required
              />
              <Field
                label="رقم الموبايل"
                value={phone}
                onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 11))}
                placeholder="01xxxxxxxxx"
                type="tel"
                dir="ltr"
              />
            </>
          )}

          <Field
            label="الإيميل"
            value={email}
            onChange={setEmail}
            placeholder="your@email.com"
            type="email"
            dir="ltr"
            required
          />

          <div>
            <label className="mb-1.5 block text-xs font-bold text-neutral-500">الباسورد</label>
            <div className="relative">
              <input
                required
                dir="ltr"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "٨ حروف على الأقل" : "••••••••"}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5 pl-16 text-sm transition-colors focus:border-brand-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-brand-600 transition hover:bg-brand-50"
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-shine w-full rounded-full bg-brand-600 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? "لحظة…" : isSignup ? "ابدأ دلوقتي ←" : "دخول ←"}
          </button>
        </form>

        <div className="mt-5 border-t border-black/5 pt-4 text-center">
          <p className="text-sm text-neutral-500">
            {isSignup ? "عندك حساب بالفعل؟" : "لسه مش مشترك؟"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setError("");
              }}
              className="font-bold text-brand-600 underline-offset-4 hover:underline"
            >
              {isSignup ? "سجّل دخول" : "اعمل حساب"}
            </button>
          </p>
        </div>
      </div>

      <p className="mt-5 max-w-sm text-center text-xs leading-relaxed text-neutral-400">
        نسيت الباسورد؟ كلّمنا على واتساب وهنظبطهولك.
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  dir?: "ltr" | "rtl";
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-neutral-500">{label}</label>
      <input
        required={required}
        type={type}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm transition-colors focus:border-brand-600 focus:outline-none"
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
