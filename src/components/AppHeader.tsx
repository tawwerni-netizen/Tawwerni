"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoLink } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import Avatar from "@/components/Avatar";
import { openHelpCentre } from "@/lib/help-centre";
import { useI18n } from "@/components/LanguageContext";
import HeaderResumeButton from "@/components/HeaderResumeButton";

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export default function AppHeader({
  name,
  email,
  avatarUrl,
  streak,
  initialResume,
  isAdmin,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  streak: number;
  initialResume?: {
    slug: string;
    dayNumber: number;
    titleAr?: string;
    titleEn?: string;
    icon?: string;
  } | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click or escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  // The lesson / mission player is a dedicated focus cockpit — hide global header so it doesn't double-stack.
  if (/^\/app\/learn\/[^/]+\/\d+$/.test(pathname)) return null;

  // Streamlined primary navigation items
  const navItems = [
    { href: "/app", labelAr: "الرئيسية", labelEn: "Home", icon: "🏠" },
    { href: "/app/inventory", labelAr: "مكتبتي", labelEn: "My Library", icon: "🎒" },
    { href: "/career-paths", labelAr: "المسارات", labelEn: "Tracks", icon: "🧭" },
    { href: "/app/learn", labelAr: "تعلّم", labelEn: "Learn", icon: "📚" },
    { href: "/app/progress", labelAr: "تقدّمي", labelEn: "Progress", icon: "📊" },
    { href: "/app/vip-vault", labelAr: "خزنة VIP", labelEn: "VIP Vault", icon: "👑", isVip: true },
    { href: "/app/referrals", labelAr: "اكسب", labelEn: "Earn", icon: "💰", hideOnMd: true },
  ];

  return (
    <header className="app-header sticky top-0 z-40">
      <div className="mx-auto flex h-14 w-full max-w-[1400px] items-center justify-between gap-2 px-3 sm:px-4 lg:px-6">
        {/* Brand Logo */}
        <div className="shrink-0 flex items-center">
          <LogoLink size={30} href="/app" />
        </div>

        {/* Central Navigation Pills - Desktop */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-1.5 min-w-0">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href);
            const label = isEn ? item.labelEn : item.labelAr;

            if (item.isVip) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs lg:text-sm font-black transition-all cursor-pointer ${
                    active
                      ? "bg-gradient-to-r from-amber-500/25 via-yellow-500/30 to-amber-500/25 border border-amber-500/60 text-amber-900 dark:text-amber-200 shadow-xs"
                      : "border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:border-amber-400 shadow-2xs hover:scale-102"
                  }`}
                >
                  <span className="text-sm leading-none animate-pulse" aria-hidden>
                    👑
                  </span>
                  <span>{label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nav-pill whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs lg:text-sm font-medium transition-all ${
                  item.hideOnMd ? "hidden lg:inline-flex" : ""
                } ${active ? "nav-pill-on font-bold" : ""}`}
              >
                <span className="text-sm leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & User Identity */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Resume Learning Button */}
          <HeaderResumeButton initialResume={initialResume} />

          {/* Daily Streak Chip */}
          {streak > 0 && (
            <span
              className="streak-chip hidden xl:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-2xs shrink-0 select-none"
              title={isEn ? `${streak} day streak` : `${streak} يوم متتالي`}
            >
              <span className="animate-flicker" aria-hidden>
                🔥
              </span>
              <span>{streak}</span>
            </span>
          )}

          {/* Help & Q&A Button */}
          <button
            type="button"
            onClick={() => openHelpCentre()}
            aria-label={isEn ? "Help Centre & Q&A" : "مركز المساعدة والأسئلة الشائعة"}
            title={isEn ? "Help Centre & Q&A" : "مركز المساعدة والأسئلة الشائعة"}
            className="help-btn group shrink-0"
          >
            <svg
              className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7.8 19.5L4 21V17.2C2.7 15.6 2 13.7 2 11.6C2 6.8 6.5 3 12 3C17.5 3 22 6.8 22 11.6C22 16.4 17.5 20.2 12 20.2C10.5 20.2 9.1 19.9 7.8 19.5Z"
                fill="currentColor"
                fillOpacity="0.14"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.8 9.1A2.2 2.2 0 0 1 12 7c1.3 0 2.2.9 2.2 2 0 1.2-.9 1.7-1.5 2.2-.5.4-.7.8-.7 1.4"
                stroke="currentColor"
                strokeWidth="1.85"
                strokeLinecap="round"
              />
              <circle cx="12" cy="15.8" r="0.9" fill="currentColor" />
              <path
                d="M18.8 3.2L19.4 4.7L21 5.3L19.4 5.9L18.8 7.4L18.2 5.9L16.6 5.3L18.2 4.7Z"
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth="0.4"
                className="animate-pulse"
              />
            </svg>
            <span className="absolute -top-0.5 -end-0.5 flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white dark:ring-neutral-900" />
            </span>
          </button>

          {/* Admin Control Button (Prominent & High-Visibility for Admins) */}
          {isAdmin && (
            <Link
              href="/admin"
              aria-label={isEn ? "Admin Panel" : "لوحة الإدارة"}
              title={isEn ? "Admin Control Panel" : "لوحة الإدارة والتحكم"}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-black bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 text-red-600 dark:text-red-400 border border-red-500/40 hover:bg-red-500/30 hover:border-red-500 hover:scale-105 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <span className="text-sm leading-none" aria-hidden>
                🛡️
              </span>
              <span className="font-sans whitespace-nowrap">
                {isEn ? "Admin" : "لوحة الإدارة"}
              </span>
            </Link>
          )}

          {/* Language Switcher */}
          <LanguageToggle className="shrink-0" />

          {/* Dark / Light Mode Switcher */}
          <ThemeToggle className="shrink-0" />

          {/* User Profile Avatar with Interactive Dropdown */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={isEn ? "Open user menu" : "فتح قائمة الحساب"}
              aria-expanded={menuOpen}
              className="rounded-full outline-hidden ring-2 ring-black/5 dark:ring-white/10 hover:ring-brand-500/50 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-400 cursor-pointer flex items-center justify-center"
            >
              <Avatar name={name} email={email} avatarUrl={avatarUrl} size={34} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                dir={isEn ? "ltr" : "rtl"}
                className="absolute end-0 top-full mt-2.5 w-64 rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                {/* User info card */}
                <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-950/80 p-3 mb-1.5 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={name} email={email} avatarUrl={avatarUrl} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-neutral-900 dark:text-white truncate">
                        {name || (isEn ? "Tawwerni Learner" : "طالب طوّرني")}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono truncate" dir="ltr">
                        {email}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[10px] font-black text-red-600 dark:text-red-400">
                      <span>🛡️</span>
                      <span>{isEn ? "System Administrator" : "مسؤول المنصة (Admin)"}</span>
                    </div>
                  )}
                </div>

                {/* Primary Student Navigation */}
                <div className="space-y-0.5">
                  <Link
                    href="/app/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span>👤</span>
                    <span>{isEn ? "My Profile & Settings" : "حسابي وإعدادات التعلّم"}</span>
                  </Link>

                  <Link
                    href="/app/inventory"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span>🎒</span>
                    <span>{isEn ? "My Learning Library" : "مكتبتي ومخزوني التعليمي"}</span>
                  </Link>

                  <Link
                    href="/app/progress"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span>📊</span>
                    <span>{isEn ? "My Learning Progress" : "تقدّمي وإنجازاتي"}</span>
                  </Link>

                  <Link
                    href="/app/vip-vault"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-500/10 transition-colors"
                  >
                    <span>👑</span>
                    <span>{isEn ? "VIP Vault & Legal Contracts" : "خزنة VIP وعقود الفريلانس"}</span>
                  </Link>

                  <Link
                    href="/app/referrals"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span>💰</span>
                    <span>{isEn ? "Earn with Affiliate Program" : "اكسب مع برنامج التسويق"}</span>
                  </Link>
                </div>

                {/* Admin Quick Links */}
                {isAdmin && (
                  <div className="mt-1.5 pt-1.5 border-t border-black/5 dark:border-white/5 space-y-0.5">
                    <p className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-500/80">
                      {isEn ? "Admin Controls" : "إدارة المنصة"}
                    </p>
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <span>🧾</span>
                      <span>{isEn ? "Orders & Reviews" : "الطلبات والمراجعة"}</span>
                    </Link>
                    <Link
                      href="/admin/payment-settings"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                    >
                      <span>💳</span>
                      <span>{isEn ? "Payment Gateways (VF & Insta)" : "أرقام الدفع (كاش وإنستاباي)"}</span>
                    </Link>
                    <Link
                      href="/admin/users"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <span>👥</span>
                      <span>{isEn ? "Users Management" : "إدارة المستخدمين"}</span>
                    </Link>
                  </div>
                )}

                {/* Sign Out */}
                <div className="mt-1.5 pt-1.5 border-t border-black/5 dark:border-white/5">
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    <span>🚪</span>
                    <span>{isEn ? "Sign Out" : "تسجيل الخروج"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
