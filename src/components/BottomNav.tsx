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

export default function BottomNav() {
  const pathname = usePathname();

  if (/^\/app\/learn\/[^/]+\/\d+$/.test(pathname)) return null;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/5">
      <div className="mx-auto max-w-md grid grid-cols-5">
        {items.map((item) => {
          const active = item.href === "/app" ? pathname === "/app" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2.5 text-xs ${
                active ? "text-brand-600 font-bold" : "text-neutral-400"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
