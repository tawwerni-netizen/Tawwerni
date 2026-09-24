"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/components/LanguageContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { lang } = useI18n();

  const items = [
    { href: "/app", label: lang === "ar" ? "الرئيسية" : "Home", icon: "🏠" },
    { href: "/app/learn", label: lang === "ar" ? "تعلّم" : "Learn", icon: "📚" },
    { href: "/app/progress", label: lang === "ar" ? "تقدّمي" : "Progress", icon: "📊" },
    { href: "/app/referrals", label: lang === "ar" ? "اكسب" : "Earn", icon: "💰" },
    { href: "/app/profile", label: lang === "ar" ? "حسابي" : "Profile", icon: "👤" },
  ];

  // The lesson player is a focus surface — nothing competes with it.
  if (/^\/app\/learn\/[^/]+\/\d+$/.test(pathname)) return null;

  return (
    <nav className="bottom-nav fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active =
            item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`nav-tab flex flex-col items-center gap-1 py-2.5 text-xs ${
                active ? "nav-tab-on font-bold" : ""
              }`}
            >
              <span className="nav-tab-icon text-lg leading-none" aria-hidden>
                {item.icon}
              </span>
              <span className="nav-tab-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
