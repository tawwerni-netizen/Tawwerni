import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak } from "@/lib/xp";
import { PUBLIC_COURSE_PAGE } from "@/lib/public-routes";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";
import FaqWidget from "@/components/FaqWidget";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const user = await getCurrentUser();

  if (!user) {
    // `proxy.ts` already lets an anonymous request through to exactly this
    // one route shape; this check exists so the two gates can't drift apart
    // and this layout doesn't quietly redirect the visitor proxy.ts just let
    // in. The page itself (`app/learn/[slug]/page.tsx`) renders its own
    // public view — this layout contributes no chrome to it at all, since
    // the authenticated header/nav/streak below all assume a signed-in user.
    const pathname = (await headers()).get("x-pathname") ?? "";
    if (PUBLIC_COURSE_PAGE.test(pathname)) return children;
    redirect("/login");
  }
  if (user.dailyPaceMinutes == null) redirect("/onboarding");

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId: user.id },
    select: { completedAt: true },
  });
  const streak = computeStreak(completions.map((c) => c.completedAt));

  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral-50">
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
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col pb-20 md:pb-8">
        {children}
      </main>

      <FaqWidget />
      <BottomNav />
    </div>
  );
}
