"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/components/LanguageContext";
import Avatar from "@/components/Avatar";

const NAV = [
  { href: "/admin", labelAr: "الطلبات", labelEn: "Orders", icon: "🧾", exact: true },
  { href: "/admin/users", labelAr: "المستخدمين", labelEn: "Users", icon: "👥" },
  { href: "/admin/payouts", labelAr: "السحوبات", labelEn: "Payouts", icon: "💸" },
  { href: "/admin/testimonials", labelAr: "آراء المتعلمين", labelEn: "Reviews", icon: "💬" },
  { href: "/admin/articles", labelAr: "المقالات", labelEn: "Articles", icon: "📚" },
  { href: "/admin/audit", labelAr: "سجل الإجراءات", labelEn: "Audit Log", icon: "📜" },
];

const TITLE_TRANSLATIONS: Record<string, string> = {
  "الطلبات والتحويلات": "Orders & Payments",
  "المستخدمون": "Learners & Users",
  "السحوبات": "Affiliate Payouts",
  "آراء المتعلمين": "Learner Testimonials",
  "المقالات": "Articles & Knowledge",
  "سجل الإجراءات": "Admin Audit Log",
};

/**
 * The frame every admin page sits in.
 *
 * Full bilingual support (Arabic / English) with LanguageToggle, ThemeToggle,
 * and adaptive RTL / LTR layout.
 */
export default function AdminShell({
  children,
  title,
  titleEn,
  subtitle,
  subtitleEn,
  admin,
  badges,
}: {
  children: React.ReactNode;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  admin: { name: string | null; email: string; avatarUrl: string | null };
  badges?: Partial<Record<string, number>>;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang } = useI18n();
  const isEn = lang === "en";

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const displayTitle = isEn ? titleEn || TITLE_TRANSLATIONS[title] || title : title;
  const displaySubtitle = isEn
    ? subtitleEn || (subtitle?.includes("مفيش طلبات")
        ? "No pending orders — all caught up ✓"
        : subtitle?.includes("طلب مستني")
        ? subtitle.replace("طلب مستني قرارك", "orders awaiting your review")
        : subtitle)
    : subtitle;

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors"
    >
      <header className="app-header sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark size={30} />
            <span className="hidden text-sm font-bold sm:inline text-neutral-900 dark:text-white">
              {isEn ? "Admin Panel" : "لوحة الإدارة"}
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 sm:flex">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const count = badges?.[item.href];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nav-pill flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs md:text-sm font-semibold transition ${
                    active
                      ? "nav-pill-on bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span aria-hidden>{item.icon}</span>
                  <span>{isEn ? item.labelEn : item.labelAr}</span>
                  {count ? <span className="admin-badge ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-white font-bold">{count}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className={`${isEn ? "ml-auto" : "mr-auto"} flex items-center gap-2 sm:mr-0`}>
            <Link
              href="/app"
              className="hidden text-xs text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 hover:underline md:inline"
            >
              {isEn ? "Platform →" : "المنصة ←"}
            </Link>
            <LanguageToggle />
            <ThemeToggle />
            <Avatar name={admin.name} email={admin.email} avatarUrl={admin.avatarUrl} size={32} />
            <button
              onClick={signOut}
              className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1.5 text-[11px] font-bold hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition"
            >
              {isEn ? "Sign out" : "خروج"}
            </button>
          </div>
        </div>

        {/* Phone: the nav can't fit next to the logo, so it gets its own row. */}
        <nav className="flex gap-1 overflow-x-auto border-t border-black/5 dark:border-white/10 px-3 py-2 sm:hidden">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const count = badges?.[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-pill flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                  active
                    ? "nav-pill-on bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                <span>{isEn ? item.labelEn : item.labelAr}</span>
                {count ? <span className="admin-badge ml-1 px-1.5 py-0.5 text-[9px] rounded-full bg-amber-500 text-white font-bold">{count}</span> : null}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold md:text-2xl text-neutral-900 dark:text-white">{displayTitle}</h1>
          {displaySubtitle && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{displaySubtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
