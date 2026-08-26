import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak } from "@/lib/xp";
import ProfileClient from "@/components/ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [completions, latestOrder] = await Promise.all([
    prisma.lessonCompletion.findMany({ where: { userId: user.id } }),
    prisma.order.findFirst({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
  ]);

  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));

  return (
    <ProfileClient
      name={user.name}
      email={user.email}
      dailyPaceMinutes={user.dailyPaceMinutes ?? 15}
      focusCategory={user.focusCategory}
      avatarUrl={user.avatarUrl}
      totalXp={totalXp}
      streak={streak}
      subscription={
        latestOrder
          ? { method: latestOrder.method, amountEgp: latestOrder.amountEgp, createdAt: latestOrder.createdAt.toISOString() }
          : null
      }
    />
  );
}
