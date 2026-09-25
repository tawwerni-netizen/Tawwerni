"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLink } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import Avatar from "@/components/Avatar";
import { openHelpCentre } from "@/lib/help-centre";
import { useI18n } from "@/components/LanguageContext";

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export default function AppHeader({
  name,
  email,
  avatarUrl,
  streak,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  streak: number;
}) {
  const pathname = usePathname();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const navItems = [
    { href: "/app", label: lang === "ar" ? "الرئيسية" : "Home", icon: "🏠" },
    { href: "/app/learn", label: lang === "ar" ? "تعلّم" : "Learn", icon: "📚" },
    { href: "/app/progress", label: lang === "ar" ? "تقدّمي" : "Progress", icon: "📊" },
    { href: "/app/referrals", label: lang === "ar" ? "اكسب" : "Earn", icon: "💰" },
    { href: "/app/profile", label: lang === "ar" ? "حسابي" : "Profile", icon: "👤" },
  ];

  return (
    <header className="app-header sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <LogoLink size={32} href="/app" />

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-pill rounded-full px-3.5 py-1.5 text-sm ${
                  active ? "nav-pill-on font-bold" : ""
                }`}
              >
                <span className="me-1.5 text-base leading-none" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ms-auto flex items-center gap-2 md:ms-0">
          {streak > 0 && (
            <span
              className="streak-chip hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-2xs"
              title={isEn ? `${streak} day streak` : `${streak} يوم متتالي`}
            >
              <span className="animate-flicker" aria-hidden>
                🔥
              </span>
              <span>{streak}</span>
            </span>
          )}

          {/*
            Help & Q&A button: bespoke multi-tone icon, AI sparkle star,
            and live pulsating beacon.
          */}
          <button
            type="button"
            onClick={() => openHelpCentre()}
            aria-label={isEn ? "Help Centre & Q&A" : "مركز المساعدة والأسئلة الشائعة"}
            title={isEn ? "Help Centre & Q&A" : "مركز المساعدة والأسئلة الشائعة"}
            className="help-btn group"
          >
            {/* Multi-tone vector Q&A icon */}
            <svg
              className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              {/* Rounded speech bubble with translucent fill */}
              <path
                d="M7.8 19.5L4 21V17.2C2.7 15.6 2 13.7 2 11.6C2 6.8 6.5 3 12 3C17.5 3 22 6.8 22 11.6C22 16.4 17.5 20.2 12 20.2C10.5 20.2 9.1 19.9 7.8 19.5Z"
                fill="currentColor"
                fillOpacity="0.14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Elegant question glyph */}
              <path
                d="M9.8 9.1A2.2 2.2 0 0 1 12 7c1.3 0 2.2.9 2.2 2 0 1.2-.9 1.7-1.5 2.2-.5.4-.7.8-.7 1.4"
                stroke="currentColor"
                strokeWidth="1.85"
                strokeLinecap="round"
              />
              <circle cx="12" cy="15.8" r="0.9" fill="currentColor" />
              {/* Glowing 4-point AI sparkle star */}
              <path
                d="M18.8 3.2L19.4 4.7L21 5.3L19.4 5.9L18.8 7.4L18.2 5.9L16.6 5.3L18.2 4.7Z"
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth="0.4"
                className="animate-pulse"
              />
            </svg>

            {/* Live pulsating beacon dot */}
            <span className="absolute -top-0.5 -end-0.5 flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-neutral-900" />
            </span>
          </button>

          <LanguageToggle />
          <ThemeToggle />

          {/* The avatar is a link to the account page */}
          <Link
            href="/app/profile"
            aria-label={isEn ? "Profile" : "حسابي"}
            className="avatar-link rounded-full outline-none ring-2 ring-black/5 dark:ring-white/10 hover:ring-brand-500/50 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Avatar name={name} email={email} avatarUrl={avatarUrl} size={36} />
          </Link>
        </div>
      </div>
    </header>
  );
}
