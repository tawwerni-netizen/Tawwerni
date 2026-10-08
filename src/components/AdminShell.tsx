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
  { href: "/admin/payment-settings", labelAr: "طرق الدفع", labelEn: "Payment Gateways", icon: "💳" },
  { href: "/admin/ads", labelAr: "الحملات والإعلانات", labelEn: "Ads & Attribution", icon: "📈" },
  { href: "/admin/users", labelAr: "المستخدمين", labelEn: "Users", icon: "👥" },
  { href: "/admin/payouts", labelAr: "السحوبات", labelEn: "Payouts", icon: "💸" },
  { href: "/admin/testimonials", labelAr: "آراء المتعلمين", labelEn: "Reviews", icon: "💬" },
  { href: "/admin/articles", labelAr: "المقالات", labelEn: "Articles", icon: "📚" },
  { href: "/admin/audit", labelAr: "سجل الإجراءات", labelEn: "Audit Log", icon: "📜" },
];

const TITLE_TRANSLATIONS: Record<string, string> = {
  "الطلبات والتحويلات": "Orders & Payments",
  "إعدادات طرق الدفع": "Payment Gateways & Accounts",
  "إدارة الإعلانات واكتساب العملاء": "Ads & Customer Acquisition",
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
      <header className="app-header sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-2xs">
        {/* Tier 1: Brand & User Controls (Guaranteed never cut off) */}
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex shrink-0 items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <LogoMark size={32} />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight text-neutral-900 dark:text-white">
                  {isEn ? "Tawwerni" : "طوّرني"}
                </span>
                <span className="rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-700 dark:text-teal-300 px-2 py-0.5 text-[10px] font-black">
                  {isEn ? "Admin Panel" : "لوحة الإدارة"}
                </span>
              </div>
            </Link>

            <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">|</span>

            <Link
              href="/app"
              className="hidden sm:flex text-xs font-semibold text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 transition items-center gap-1"
            >
              <span>{isEn ? "Platform" : "المنصة"}</span>
              <span className="text-[10px]">{isEn ? "↗" : "←"}</span>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <Link
              href="/app"
              className="sm:hidden text-xs font-semibold text-neutral-500 hover:text-teal-600 dark:hover:text-teal-400 transition flex items-center gap-1"
              title={isEn ? "Go to Platform" : "الذهاب إلى المنصة"}
            >
              <span>{isEn ? "Platform" : "المنصة"}</span>
              <span className="text-[10px]">{isEn ? "↗" : "←"}</span>
            </Link>
            <LanguageToggle />
            <ThemeToggle />
            <div className="hidden sm:block h-4 w-px bg-black/10 dark:bg-white/10 mx-0.5" />
            <div className="flex items-center gap-2">
              <Avatar name={admin.name} email={admin.email} avatarUrl={admin.avatarUrl} size={30} />
              <div className="hidden lg:block text-right">
                <p className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
                  {admin.name || "المدير"}
                </p>
                <p className="text-[10px] text-neutral-400 leading-tight truncate max-w-[130px]" dir="ltr">
                  {admin.email}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="rounded-full border border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 text-xs font-bold hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition flex items-center gap-1 cursor-pointer shrink-0"
              title={isEn ? "Sign out" : "تسجيل الخروج من لوحة الإدارة"}
            >
              <span>🚪</span>
              <span>{isEn ? "Sign out" : "خروج"}</span>
            </button>
          </div>
        </div>

        {/* Tier 2: Dedicated Full Navigation Bar with Smooth Scroll */}
        <div className="border-t border-black/5 dark:border-white/10 bg-neutral-50/70 dark:bg-neutral-950/50 backdrop-blur-xs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
              {NAV.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const count = badges?.[item.href];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`nav-pill flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      active
                        ? "nav-pill-on bg-teal-500/15 text-teal-700 dark:text-teal-300 font-black border border-teal-500/30 shadow-2xs"
                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <span aria-hidden>{item.icon}</span>
                    <span>{isEn ? item.labelEn : item.labelAr}</span>
                    {count ? (
                      <span className="admin-badge mr-1 px-1.5 py-0.5 text-[10px] rounded-full bg-amber-400 text-neutral-950 font-black">
                        {count}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold md:text-2xl text-neutral-900 dark:text-white">{displayTitle}</h1>
          {displaySubtitle && <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{displaySubtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
