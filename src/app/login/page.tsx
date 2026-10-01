"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { brand, payment } from "@/content/brand";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";
import GoogleLoginButton from "@/components/GoogleLoginButton";

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
        setLoading(false);
        return;
      }

      window.location.href = data.hasOnboarded ? "/app" : "/onboarding";
    } catch {
      setError(isEn ? "No internet connection. Please check your network and try again." : "مفيش اتصال بالإنترنت. اتأكد من الشبكة وجرّب تاني.");
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-50 dark:bg-[#070e0c] text-neutral-900 dark:text-neutral-100 px-4 py-8 sm:py-12 transition-colors selection:bg-teal-500 selection:text-white"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-teal-500/15 dark:bg-teal-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 blur-[120px]" />

      {/* Top Header Bar */}
      <header className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 flex items-center justify-between z-20">
        <LogoLink size={34} href="/" />
        <div className="flex items-center gap-2 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5 dark:border-white/10 shadow-2xs">
          <LanguageToggle />
          <div className="h-3.5 w-px bg-black/10 dark:bg-white/10" />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-[420px] mt-10 sm:mt-4">
        {/* Glow behind card */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-teal-500/20 via-transparent to-emerald-500/10 blur-xl -z-10" />

        <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-xl transition-all">
          {/* Top Mode Segmented Switch */}
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-neutral-100 dark:bg-neutral-950 p-1 border border-black/5 dark:border-white/5">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-xl py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                !isSignup
                  ? "bg-white dark:bg-neutral-800 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {isEn ? "Sign In" : "تسجيل الدخول"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`rounded-xl py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                isSignup
                  ? "bg-white dark:bg-neutral-800 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {isEn ? "Create Account" : "حساب جديد"}
            </button>
          </div>

          {/* Title and subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              {isSignup
                ? isEn ? "Join Tawwerni 🚀" : "ابدأ رحلتك في طوّرني 🚀"
                : isEn ? "Welcome Back 👋" : "أهلاً بك مجدداً 👋"}
            </h1>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {isSignup
                ? isEn ? "Master AI and high-income skills in 5 mins a day" : "تعلّم مهارات الذكاء الاصطناعي في ٥ دقائق يومياً"
                : isEn ? "Continue your daily practical learning streak" : "تابع تقدمك اليومي واستكمل رحلة التعلم"}
            </p>
          </div>

          {/* Prominent Google Sign-in Section */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                {isEn ? "Fast 1-Click Access" : "الدخول السريع بضغطة واحدة"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 dark:bg-teal-400/10 px-2 py-0.5 text-[10px] font-bold text-teal-600 dark:text-teal-400 border border-teal-500/20">
                ⚡ {isEn ? "Instant" : "موصى به"}
              </span>
            </div>
            <GoogleLoginButton />
          </div>

          {/* Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-black/10 dark:border-white/10" />
            <span className="absolute bg-white dark:bg-neutral-900 px-3 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {isEn ? "Or with email" : "أو بالبريد الإلكتروني"}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {isEn ? "Full Name" : "الاسم بالكامل"}
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isEn ? "e.g. John Doe" : "مثال: أحمد محمد"}
                    className="w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 px-4 py-2.5 text-base sm:text-sm text-neutral-900 dark:text-white transition-all focus:border-teal-500 focus:bg-white dark:focus:bg-black focus:ring-3 focus:ring-teal-500/20 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {isEn ? "Mobile / WhatsApp" : "رقم الموبايل / واتساب"}
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                    placeholder="01xxxxxxxxx"
                    className="w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 px-4 py-2.5 text-base sm:text-sm text-neutral-900 dark:text-white transition-all focus:border-teal-500 focus:bg-white dark:focus:bg-black focus:ring-3 focus:ring-teal-500/20 focus:outline-hidden text-start"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {isEn ? "Email Address" : "البريد الإلكتروني"}
              </label>
              <input
                required
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 px-4 py-2.5 text-base sm:text-sm text-neutral-900 dark:text-white transition-all focus:border-teal-500 focus:bg-white dark:focus:bg-black focus:ring-3 focus:ring-teal-500/20 focus:outline-hidden text-start"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {isEn ? "Password" : "كلمة المرور"}
                </label>
                {!isSignup && (
                  <Link
                    href="/forgot-password"
                    className="text-[11px] font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    {isEn ? "Forgot password?" : "نسيت كلمة السر؟"}
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  required
                  dir="ltr"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? (isEn ? "8+ characters" : "٨ حروف على الأقل") : "••••••••"}
                  className="w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 px-4 py-2.5 pe-16 text-base sm:text-sm text-neutral-900 dark:text-white transition-all focus:border-teal-500 focus:bg-white dark:focus:bg-black focus:ring-3 focus:ring-teal-500/20 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className={`absolute ${isEn ? "right-2.5" : "left-2.5"} top-1/2 -translate-y-1/2 rounded-lg px-2.5 py-1 text-xs font-bold text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 transition`}
                >
                  {showPassword ? (isEn ? "Hide" : "إخفاء") : (isEn ? "Show" : "إظهار")}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 p-3 text-xs leading-relaxed text-red-600 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-teal-600/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{isEn ? "Processing..." : "لحظة واحدة…"}</span>
                </>
              ) : isSignup ? (
                <span>{isEn ? "Create Account & Start →" : "إنشاء الحساب وبدء التعلم ←"}</span>
              ) : (
                <span>{isEn ? "Sign In →" : "دخول المنصة ←"}</span>
              )}
            </button>
          </form>
        </div>

        {/* Security & Support footer */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {isEn ? (
              <>
                Need assistance? WhatsApp Support:{" "}
                <a
                  href={`https://wa.me/2${payment.supportWhatsapp}`}
                  dir="ltr"
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  +{payment.supportWhatsapp}
                </a>
              </>
            ) : (
              <>
                تواجه مشكلة في الدخول؟ تواصل عبر واتساب:{" "}
                <a
                  href={`https://wa.me/2${payment.supportWhatsapp}`}
                  dir="ltr"
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  +{payment.supportWhatsapp}
                </a>
              </>
            )}
          </p>

          <p className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
            <span>🔒</span>
            <span>{isEn ? "256-bit SSL encrypted & secure" : "اتصال مشفر وآمن بالكامل"}</span>
          </p>
        </div>
      </div>
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
