"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoLink } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Avatar from "@/components/Avatar";
import { openHelpCentre } from "@/lib/help-centre";

const NAV = [
  { href: "/app", label: "الرئيسية", icon: "🏠" },
  { href: "/app/learn", label: "تعلّم", icon: "📚" },
  { href: "/app/progress", label: "تقدّمي", icon: "📊" },
  { href: "/app/referrals", label: "اكسب", icon: "💰" },
  { href: "/app/profile", label: "حسابي", icon: "👤" },
];

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

/**
 * The bar that never leaves.
 *
 * Every page used to draw its own header, so the logo and the theme switch
 * appeared on the home screen and nowhere else — you could get three screens
 * deep with no way back and no way to change the theme. This is now one sticky
 * bar across the whole app.
 *
 * On desktop it also carries the primary navigation, because a bottom tab bar
 * pinned to the foot of a 1400px window is a phone control stranded on a
 * monitor. The bottom bar hides itself above `md` for the same reason.
 */
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

  return (
    <header className="app-header sticky top-0 z-40">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <LogoLink size={32} />

        <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {NAV.map((item) => {
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
              title={`${streak} يوم متتالي`}
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
            aria-label="مركز المساعدة"
            title="مركز المساعدة"
            className="help-btn"
          >
            ؟
          </button>

          <ThemeToggle />

          {/* The avatar is a link to the account page — it looked clickable
              long before it was, which is its own kind of broken. */}
          <Link
            href="/app/profile"
            aria-label="حسابي"
            className="avatar-link rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Avatar name={name} email={email} avatarUrl={avatarUrl} size={34} />
          </Link>
        </div>
      </div>
    </header>
  );
}
