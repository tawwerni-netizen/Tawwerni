"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useI18n } from "./LanguageContext";

export default function GoogleLoginButton() {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const hiddenBtnRef = useRef<HTMLDivElement>(null);

  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) return;
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (isEn ? "Google sign-in failed. Please try again." : "فشل تسجيل الدخول بجوجل. حاول مرة أخرى."));
        setLoading(false);
        return;
      }

      window.location.href = data.hasOnboarded ? "/app" : "/onboarding";
    } catch {
      setError(isEn ? "Network connection error. Try again." : "مشكلة في الاتصال بالإنترنت. جرّب مجدداً.");
      setLoading(false);
    }
  };

  const setupGoogleGsi = () => {
    if (typeof window === "undefined") return;
    const google = (window as any).google;
    if (!google?.accounts?.id || !hiddenBtnRef.current) return;

    try {
      google.accounts.id.initialize({
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "643238889542-rb62aecd5jamlo29snr0f52e18osft6o.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
      });

      hiddenBtnRef.current.innerHTML = "";
      google.accounts.id.renderButton(hiddenBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: isEn ? "continue_with" : "continue_with",
        shape: "pill",
        logo_alignment: "left",
        width: 340,
        locale: isEn ? "en" : "ar",
      });
      setScriptLoaded(true);
    } catch (e) {
      console.error("GSI Init error:", e);
    }
  };

  useEffect(() => {
    setupGoogleGsi();
  }, [isEn]);

  const handleCustomBtnClick = () => {
    if (typeof window === "undefined") return;
    const google = (window as any).google;

    if (google?.accounts?.id) {
      // Trigger Google One Tap / account prompt directly
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // If prompt blocked, click the rendered hidden button if available
          const btn = hiddenBtnRef.current?.querySelector("div[role=button]") as HTMLElement;
          if (btn) btn.click();
        }
      });
    } else {
      setError(isEn ? "Loading Google service, please wait..." : "جارٍ تحميل خدمة جوجل، يرجى الانتظار...");
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={setupGoogleGsi}
      />

      {/* Styled Interactive Google Button Container */}
      <div className="w-full relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300"></div>

        {/* Hidden or active container where Google iframe mounts */}
        <div className="relative w-full flex justify-center">
          <div
            ref={hiddenBtnRef}
            className="w-full flex justify-center min-h-[44px] overflow-hidden rounded-full shadow-xs hover:shadow-md transition-all duration-200"
          />
        </div>
      </div>

      {loading && (
        <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 animate-pulse">
          <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{isEn ? "Authenticating with Google..." : "جارٍ التحقق وتأكيد حساب جوجل..."}</span>
        </div>
      )}

      {error && (
        <p className="mt-2.5 text-xs text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 rounded-xl px-3 py-1.5 text-center font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
