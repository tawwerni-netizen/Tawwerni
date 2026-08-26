"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/app", label: "الرئيسية", icon: "🏠" },
  { href: "/app/learn", label: "تعلّم", icon: "📚" },
  { href: "/app/progress", label: "تقدّمي", icon: "📊" },
  { href: "/app/referrals", label: "اكسب", icon: "💰" },
  { href: "/app/profile", label: "حسابي", icon: "👤" },
];

/**
 * Phone navigation.
 *
 * Hidden from `md` up, where the header carries the same links — a thumb bar
 * stuck to the bottom of a desktop window is a control in the wrong place.
 *
 * Each tab reacts on hover and on press: the icon lifts and scales, the label
 * brightens, and the active tab keeps a small dot under it so the current
 * position stays legible without relying on colour alone.
 */
export default function BottomNav() {
  const pathname = usePathname();

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
