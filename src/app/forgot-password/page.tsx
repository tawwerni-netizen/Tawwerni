"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { payment } from "@/content/brand";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function ForgotPasswordPage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

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
        /* fallback */
      }

      if (!res.ok) {
        setError(data.error ?? (isEn ? "Something went wrong. Please try again." : "حصل خطأ. جرّب تاني."));
        return;
      }

      setSent(true);
    } catch {
      setError(isEn ? "No internet connection. Please check your network and try again." : "مفيش اتصال بالسيرفر. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 px-6 py-10 transition-colors"
    >
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <LogoLink size={38} href="/" />
      </div>

      <div className="animate-rise w-full max-w-sm rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-7 shadow-xs transition-colors">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-teal-500/10 text-3xl">
              📬
            </div>
            <h1 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "Check Your Inbox" : "بصّ في إيميلك"}
            </h1>
            <p className="mb-5 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {isEn ? (
                <>
                  If <b dir="ltr">{email}</b> has an account, you will receive a password reset link. The link is valid for <b>1 hour</b> and can only be used once.
                </>
              ) : (
                <>
                  لو <b dir="ltr">{email}</b> عنده حساب عندنا، هيوصله لينك تحط منه كلمة سر جديدة. اللينك صالح <b>ساعة واحدة</b> وبيشتغل مرة واحدة بس.
                </>
              )}
            </p>
            <p className="mb-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 p-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              {isEn ? (
                <>
                  Didn&apos;t receive it? Check your Spam folder. If still not found, WhatsApp us at{" "}
                  <b dir="ltr">+{payment.supportWhatsapp}</b>.
                </>
              ) : (
                <>
                  ما وصلش؟ بصّ في الـSpam. ولو لسه مش لاقيه، كلّمنا على واتساب{" "}
                  <b dir="ltr">+{payment.supportWhatsapp}</b> وهنحلّها معاك.
                </>
              )}
            </p>
            <Link href="/login" className="tap inline-block py-1 text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">
              {isEn ? "← Back to Sign In" : "رجوع لتسجيل الدخول ←"}
            </Link>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl">
              🔑
            </div>
            <h1 className="mb-1 text-center text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "Forgot Your Password?" : "نسيت كلمة السر؟"}
            </h1>
            <p className="mb-5 text-center text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {isEn
                ? "Enter your email address and we'll send you a link to reset it."
                : "اكتب إيميلك وهنبعتلك لينك تحط منه واحدة جديدة."}
            </p>

            <input
              type="email"
              required
              autoComplete="username"
              dir="ltr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isEn ? "name@example.com" : "الإيميل بتاعك"}
              className="mb-3 w-full rounded-xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-3 text-center text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
            />

            {error && (
              <p className="mb-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 px-3 py-2 text-center text-xs text-red-600 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-shine mb-4 w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-bold text-white shadow-md active:scale-98 transition-all disabled:opacity-60"
            >
              {loading ? "..." : (isEn ? "Send Reset Link →" : "ابعتلي اللينك")}
            </button>

            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              {isEn ? "Remembered it?" : "فاكرها؟"}{" "}
              <Link href="/login" className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
                {isEn ? "Sign in" : "سجّل دخول"}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
