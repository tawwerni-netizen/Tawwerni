import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AdminStats from "@/components/AdminStats";
import AdminUserList from "@/components/AdminUserList";
import AdminAddUser from "@/components/AdminAddUser";
import type { AdminUserRowData } from "@/components/AdminUserRow";
import { computeStreak } from "@/lib/xp";

export const dynamic = "force-dynamic";

/**
 * Operator view of every learner: who they are, when they joined, what they
 * paid for, how far they got in each track, and how to get them back in when
 * they're locked out.
 */
export default async function AdminUsersPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [users, courses, pendingOrders, pendingPayouts] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: {
        orders: { select: { status: true, amountEgp: true } },
        completions: {
          select: {
            xpEarned: true,
            completedAt: true,
            lesson: { select: { module: { select: { courseId: true } } } },
          },
          orderBy: { completedAt: "desc" },
        },
      },
    }),
    prisma.course.findMany({
      where: { isComingSoon: false },
      select: { id: true, title: true, icon: true, totalLessons: true },
      orderBy: { order: "asc" },
    }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.payout.count({ where: { status: "requested" } }),
  ]);

  const lessonCounts = new Map(courses.map((c) => [c.id, c.totalLessons]));

  const rows: AdminUserRowData[] = users.map((u) => {
    const totalXp = u.completions.reduce((s, c) => s + c.xpEarned, 0);
    const streak = computeStreak(u.completions.map((c) => c.completedAt));
    const paid = u.orders.some((o) => o.status === "approved");
    const pending = u.orders.some((o) => o.status === "pending");

    const perCourse = new Map<string, number>();
    for (const c of u.completions) {
      const courseId = c.lesson.module.courseId;
      perCourse.set(courseId, (perCourse.get(courseId) ?? 0) + 1);
    }

    const progress = courses
      .map((c) => {
        const done = perCourse.get(c.id) ?? 0;
        const total = lessonCounts.get(c.id) ?? 0;
        return {
          id: c.id,
          title: c.title,
          icon: c.icon,
          done,
          total,
          percent: total ? Math.round((done / total) * 100) : 0,
        };
      })
      .filter((c) => c.done > 0);

    return {
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      avatarUrl: u.avatarUrl,
      joined: u.createdAt.toISOString(),
      lastActive: u.completions[0]?.completedAt.toISOString() ?? null,
      totalXp,
      streak,
      lessonsDone: u.completions.length,
      paid,
      pending,
      isAdmin: u.isAdmin,
      progress,
    };
  });

  const paidCount = rows.filter((r) => r.paid).length;
  const activeCount = rows.filter((r) => r.lessonsDone > 0).length;
  const revenue = users.reduce(
    (s, u) => s + u.orders.filter((o) => o.status === "approved").reduce((a, o) => a + o.amountEgp, 0),
    0
  );

  return (
    <AdminShell
      title="المستخدمون"
      subtitle={`${rows.length} حساب مسجّل · ${paidCount} مشترك`}
      admin={admin}
      badges={{ "/admin": pendingOrders, "/admin/payouts": pendingPayouts }}
    >
      <AdminStats
        stats={[
          { label: "مسجّل", value: rows.length, icon: "👥" },
          { label: "مشترك", value: paidCount, icon: "✅", tone: "good" },
          { label: "نشِط", value: activeCount, icon: "⚡" },
          { label: "الإيرادات", value: `${revenue} ج.م`, icon: "💰" },
        ]}
      />

      <AdminAddUser />

      <AdminUserList users={rows} />
    </AdminShell>
  );
}
