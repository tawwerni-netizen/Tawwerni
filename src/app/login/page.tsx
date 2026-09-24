"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { brand, payment } from "@/content/brand";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";

type Mode = "login" | "signup";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { lang } = useI18n();
  const isEn = lang === "en";

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

    try {
      const res = await fetch(mode === "login" ? "/api/auth/login" : "/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login" ? { email, password } : { email, password, name, phone }
        ),
      });

      const raw = await res.text();
      let data: { error?: string; hasOnboarded?: boolean } = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data.error ?? (isEn ? `Server error (${res.status}). Please try again.` : `حصل خطأ في السيرفر (${res.status}). جرّب تاني.`));
        return;
      }

      router.push(data.hasOnboarded ? "/app" : "/onboarding");
      router.refresh();
    } catch {
      setError(isEn ? "No internet connection. Please check your network and try again." : "مفيش اتصال بالإنترنت. اتأكد من الشبكة وجرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-5 py-10 transition-colors"
    >
      {/* Top Bar with Toggles */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="mb-7">
        <LogoLink size={38} href="/" />
      </div>

      <div className="animate-rise w-full max-w-sm rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-7 shadow-xs transition-colors">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-2xl">
          {isSignup ? "✨" : "👋"}
        </div>

        <h1 className="mb-1 text-center text-xl font-bold text-neutral-900 dark:text-white">
          {isSignup
            ? isEn ? "Create Your Account" : "اعمل حسابك الجديد"
            : isEn ? "Welcome Back" : "أهلًا بك مجددًا"}
        </h1>
        <p className="mb-6 text-center text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          {isSignup
            ? isEn ? "One minute to launch your first lesson" : "دقيقة واحدة وتبدأ أول درس"
            : isEn ? "Enter your email and password to continue" : "ادخل ببريدك الإلكتروني وكلمة المرور"}
        </p>

        <form onSubmit={submit} className="space-y-3.5">
          {isSignup && (
            <>
              <Field
                label={isEn ? "Your Full Name" : "اسمك بالكامل"}
                value={name}
                onChange={setName}
                placeholder={isEn ? "Full name" : "الاسم بالكامل"}
                required
              />
              <Field
                label={isEn ? "Mobile / WhatsApp Number" : "رقم الموبايل"}
                value={phone}
                onChange={(v) => setPhone(v.replace(/\D/g, "").slice(0, 11))}
                placeholder="01xxxxxxxxx"
                type="tel"
                dir="ltr"
              />
            </>
          )}

          <Field
            label={isEn ? "Email Address" : "البريد الإلكتروني"}
            value={email}
            onChange={setEmail}
            placeholder="name@example.com"
            type="email"
            dir="ltr"
            required
          />

          <div>
            <label className="mb-1.5 block text-xs font-bold text-neutral-600 dark:text-neutral-400">
              {isEn ? "Password" : "كلمة المرور"}
            </label>
            <div className="relative">
              <input
                required
                dir="ltr"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? (isEn ? "At least 8 characters" : "٨ حروف على الأقل") : "••••••••"}
                className="w-full rounded-xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 pe-16 text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className={`absolute ${isEn ? "right-2" : "left-2"} top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-bold text-teal-600 dark:text-teal-400 transition hover:bg-teal-50 dark:hover:bg-neutral-800`}
              >
                {showPassword ? (isEn ? "Hide" : "إخفاء") : (isEn ? "Show" : "إظهار")}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-xs leading-relaxed text-red-600 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition-all disabled:opacity-60"
          >
            {loading ? (isEn ? "Loading..." : "لحظة…") : isSignup ? (isEn ? "Start Now →" : "ابدأ دلوقتي ←") : (isEn ? "Sign In →" : "دخول ←")}
          </button>
        </form>

        {!isSignup && (
          <p className="mt-3 text-center">
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-teal-600 dark:text-teal-400 underline-offset-4 hover:underline"
            >
              {isEn ? "Forgot password?" : "نسيت كلمة السر؟"}
            </Link>
          </p>
        )}

        <div className="mt-5 border-t border-black/5 dark:border-white/10 pt-4 text-center">
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            {isSignup
              ? isEn ? "Already have an account?" : "عندك حساب بالفعل؟"
              : isEn ? "Don't have an account yet?" : "لسه مش مشترك؟"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setError("");
              }}
              className="font-bold text-teal-600 dark:text-teal-400 underline-offset-4 hover:underline"
            >
              {isSignup ? (isEn ? "Sign in" : "سجّل دخول") : (isEn ? "Sign up" : "اعمل حساب")}
            </button>
          </p>
        </div>
      </div>

      <p className="mt-5 max-w-sm text-center text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        {isEn ? (
          <>
            Need help signing in? Chat directly on WhatsApp:{" "}
            <a href={`https://wa.me/2${payment.supportWhatsapp}`} dir="ltr" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              +{payment.supportWhatsapp}
            </a>
          </>
        ) : (
          <>
            بتواجه مشكلة في الدخول؟ كلّمنا على واتساب:{" "}
            <a href={`https://wa.me/2${payment.supportWhatsapp}`} dir="ltr" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              +{payment.supportWhatsapp}
            </a>
          </>
        )}
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
      <label className="mb-1.5 block text-xs font-bold text-neutral-600 dark:text-neutral-400">{label}</label>
      <input
        required={required}
        type={type}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2.5 text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
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
