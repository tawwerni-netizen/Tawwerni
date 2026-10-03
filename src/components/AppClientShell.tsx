"use client";

import { usePathname } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import FaqWidget from "@/components/FaqWidget";

export default function AppClientShell({
  user,
  streak,
  initialResume,
  children,
}: {
  user: { name: string | null; email: string; avatarUrl: string | null; isAdmin?: boolean };
  streak: number;
  initialResume: {
    slug: string;
    dayNumber: number;
    titleAr?: string;
    titleEn?: string;
    icon?: string;
  } | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Lesson & mission player pages are focused, distraction-free surfaces.
  const isLessonPage = /^\/app\/learn\/[^/]+\/\d+$/.test(pathname);

  if (isLessonPage) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#070d0c] text-neutral-100 flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <AppHeader
        name={user.name}
        email={user.email}
        avatarUrl={user.avatarUrl}
        streak={streak}
        initialResume={initialResume}
        isAdmin={user.isAdmin}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col pb-20 md:pb-8">
        {children}
      </main>

      <FaqWidget />
      <BottomNav isAdmin={user.isAdmin} />
    </div>
  );
}
