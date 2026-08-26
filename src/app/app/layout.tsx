import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak } from "@/lib/xp";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import FaqWidget from "@/components/FaqWidget";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.dailyPaceMinutes == null) redirect("/onboarding");

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId: user.id },
    select: { completedAt: true },
  });
  const streak = computeStreak(completions.map((c) => c.completedAt));

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader
        name={user.name}
        email={user.email}
        avatarUrl={user.avatarUrl}
        streak={streak}
      />

      {/*
        The app was a 448px column no matter the screen — on a laptop that left
        two empty gutters wider than the content itself. It now widens in steps:
        one column on a phone, and up to `max-w-6xl` on a desktop where the
        pages lay themselves out in grids.

        `pb-20` only below `md`, since that padding exists to clear the bottom
        tab bar, and the tab bar is gone at that size.
      */}
      <main className="mx-auto min-h-[calc(100vh-3.5rem)] w-full max-w-6xl pb-20 md:pb-8">
        {children}
      </main>

      <FaqWidget />
      <BottomNav />
    </div>
  );
}
