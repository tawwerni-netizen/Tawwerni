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
                <span className="ml-1.5 text-base leading-none" aria-hidden>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mr-auto flex items-center gap-2 md:mr-0">
          {streak > 0 && (
            <span
              className="streak-chip hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex"
              title={isEn ? `${streak} day streak` : `${streak} يوم متتالي`}
            >
              <span className="animate-flicker" aria-hidden>
                🔥
              </span>
              {streak}
            </span>
          )}

          {/*
            Help lives in the header as well as in the floating button. The
            floating one sits above the tab bar and gets covered by whatever
            the page puts at the bottom; this one is in the same place on every
            screen and can't be obscured by anything.
          */}
          <button
            type="button"
            onClick={() => openHelpCentre()}
            aria-label={isEn ? "Help Centre" : "مركز المساعدة"}
            title={isEn ? "Help Centre" : "مركز المساعدة"}
            className="help-btn"
          >
            {isEn ? "?" : "؟"}
          </button>

          <LanguageToggle />
          <ThemeToggle />

          {/* The avatar is a link to the account page — it looked clickable
              long before it was, which is its own kind of broken. */}
          <Link
            href="/app/profile"
            aria-label={isEn ? "Profile" : "حسابي"}
            className="avatar-link rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Avatar name={name} email={email} avatarUrl={avatarUrl} size={34} />
          </Link>
        </div>
      </div>
    </header>
  );
}
