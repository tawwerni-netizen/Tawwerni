"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Avatar from "@/components/Avatar";

const NAV = [
  { href: "/admin", label: "الطلبات", icon: "🧾", exact: true },
  { href: "/admin/users", label: "المستخدمين", icon: "👥" },
  { href: "/admin/payouts", label: "السحوبات", icon: "💸" },
  { href: "/admin/testimonials", label: "آراء المتعلمين", icon: "💬" },
  { href: "/admin/audit", label: "سجل الإجراءات", icon: "📜" },
];

/**
 * The frame every admin page sits in.
 *
 * Each page used to draw its own narrow `max-w-md` column with its own ad-hoc
 * heading and no way to get to the other two — the panel was three separate
 * pages that happened to share a URL prefix. One shell means one navigation,
 * one place to sign out, and a width that suits the tables inside it.
 */
export default function AdminShell({
  children,
  title,
  subtitle,
  admin,
  badges,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  admin: { name: string | null; email: string; avatarUrl: string | null };
  badges?: Partial<Record<string, number>>;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="app-header sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <LogoMark size={30} />
            <span className="hidden text-sm font-bold sm:inline">لوحة الإدارة</span>
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
                  className={`nav-pill flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm ${
                    active ? "nav-pill-on font-bold" : ""
                  }`}
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                  {count ? <span className="admin-badge">{count}</span> : null}
                </Link>
              );
            })}
          </nav>

          <div className="mr-auto flex items-center gap-2 sm:mr-0">
            <Link href="/app" className="hidden text-xs text-neutral-500 hover:underline md:inline">
              المنصة ←
            </Link>
            <ThemeToggle />
            <Avatar name={admin.name} email={admin.email} avatarUrl={admin.avatarUrl} size={32} />
            <button
              onClick={signOut}
              className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-bold"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Phone: the nav can't fit next to the logo, so it gets its own row. */}
        <nav className="flex gap-1 overflow-x-auto border-t border-black/5 px-3 py-2 sm:hidden">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const count = badges?.[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-pill flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs ${
                  active ? "nav-pill-on font-bold" : ""
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
                {count ? <span className="admin-badge">{count}</span> : null}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>}
        </div>
        {children}
      </main>
    </div>
  );
}
