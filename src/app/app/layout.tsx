import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak } from "@/lib/xp";
import { PUBLIC_COURSE_PAGE } from "@/lib/public-routes";
import { resolveUserLearningProgress } from "@/lib/recent-learning-server";
import AppClientShell from "@/components/AppClientShell";

export const dynamic = "force-dynamic";

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

  let completions: Array<{ completedAt: Date }> = [];
  let cookieStore: any = undefined;
  try {
    const [c, cs] = await Promise.all([
      prisma.lessonCompletion
        .findMany({
          where: { userId: user.id },
          select: { completedAt: true },
        })
        .catch(() => []),
      cookies(),
    ]);
    completions = c;
    cookieStore = cs;
  } catch (err) {
    console.error("[AppLayout] Error fetching completions or cookies:", err);
  }

  const streak = computeStreak((completions || []).map((c) => c.completedAt));

  let initialResume = null;
  try {
    const { activeTrack } = await resolveUserLearningProgress(user.id, cookieStore);
    if (activeTrack) {
      initialResume = {
        slug: activeTrack.slug,
        dayNumber: activeTrack.nextDayNumber,
        titleAr: activeTrack.titleAr,
        titleEn: activeTrack.titleEn,
        icon: activeTrack.icon,
      };
    }
  } catch (err) {
    console.error("[AppLayout] Error resolving active track:", err);
  }

  return (
    <AppClientShell
      user={{
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        isAdmin: Boolean(user.isAdmin),
      }}
      streak={streak}
      initialResume={initialResume}
    >
      {children}
    </AppClientShell>
  );
}
