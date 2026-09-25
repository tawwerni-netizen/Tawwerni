"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoLink } from "@/components/Logo";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

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

  const { lang } = useI18n();
  const isEn = lang === "en";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError(isEn ? "Passwords do not match." : "الباسوردين مش زي بعض");
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
        /* fallback */
      }

      if (!res.ok) {
        setError(data.error ?? (isEn ? "Reset link is invalid or expired. Please request a new one." : "اللينك مش شغّال. اطلب واحد جديد."));
        return;
      }

      router.push(data.hasOnboarded ? "/app" : "/onboarding");
      router.refresh();
    } catch {
      setError(isEn ? "No internet connection. Please check your network and try again." : "مفيش اتصال بالسيرفر. جرّب تاني.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Shell isEn={isEn}>
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-2xl">
            ⚠️
          </div>
          <h1 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
            {isEn ? "Invalid Reset Link" : "اللينك ناقص"}
          </h1>
          <p className="mb-5 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {isEn
              ? "Please click the link directly from your email, and make sure the full URL is copied."
              : "افتح اللينك من الإيميل زي ما هو. لو نسخته، اتأكد إنك نسخته كامل."}
          </p>
          <Link href="/forgot-password" className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:underline">
            {isEn ? "Request New Link →" : "اطلب لينك جديد ←"}
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell isEn={isEn}>
      <form onSubmit={submit}>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/10 text-2xl">
          🔒
        </div>
        <h1 className="mb-1 text-center text-lg font-bold text-neutral-900 dark:text-white">
          {isEn ? "Set a New Password" : "حط كلمة سر جديدة"}
        </h1>
        <p className="mb-5 text-center text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
          {isEn ? "At least 8 characters. Choose something you will remember." : "٨ حروف على الأقل. اختار حاجة تفتكرها."}
        </p>

        <div className="relative mb-3">
          <input
            type={show ? "text" : "password"}
            required
            autoComplete="new-password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isEn ? "New password" : "كلمة السر الجديدة"}
            className="w-full rounded-xl border border-black/10 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-3 text-center text-sm text-neutral-900 dark:text-white transition-colors focus:border-teal-500 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className={`absolute ${isEn ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-xs font-bold text-teal-600 dark:text-teal-400`}
          >
            {show ? (isEn ? "Hide" : "إخفاء") : (isEn ? "Show" : "إظهار")}
          </button>
        </div>

        <input
          type={show ? "text" : "password"}
          required
          autoComplete="new-password"
          dir="ltr"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={isEn ? "Confirm new password" : "اكتبها تاني"}
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
          className="btn-shine w-full rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-bold text-white shadow-md active:scale-98 transition-all disabled:opacity-60"
        >
          {loading ? "..." : (isEn ? "Save & Sign In →" : "احفظ وادخل")}
        </button>
      </form>
    </Shell>
  );
}

function Shell({ children, isEn }: { children: React.ReactNode; isEn: boolean }) {
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
        {children}
      </div>
    </div>
  );
}
