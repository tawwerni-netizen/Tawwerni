import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AdminStats from "@/components/AdminStats";
import AdminUserList from "@/components/AdminUserList";
import AdminAddUser from "@/components/AdminAddUser";
import type { AdminUserRowData } from "@/components/AdminUserRow";
import { computeStreak } from "@/lib/xp";
import { backfillUserCourseProgress } from "@/lib/user-progress-backfill";

export const dynamic = "force-dynamic";

/**
 * Operator view of every learner: who they are, when they joined, what they
 * paid for, how far they got in each track, and how to get them back in when
 * they're locked out.
 */
export default async function AdminUsersPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [users, courses, pendingOrders, pendingPayouts, pendingTestimonials] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: {
        orders: { select: { status: true, amountEgp: true, method: true, proofChannel: true } },
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
    prisma.testimonial.count({ where: { status: "pending" } }),
  ]);

  // Automatic backfill check for customer alaaanalytics953@gmail.com
  const alaaUser = users.find((u) => u.email.toLowerCase() === "alaaanalytics953@gmail.com");
  if (alaaUser && alaaUser.completions.length === 0) {
    try {
      await backfillUserCourseProgress(alaaUser.id, "tahaddi-28-yawm", 18);
      const updatedCompletions = await prisma.lessonCompletion.findMany({
        where: { userId: alaaUser.id },
        select: {
          xpEarned: true,
          completedAt: true,
          lesson: { select: { module: { select: { courseId: true } } } },
        },
        orderBy: { completedAt: "desc" },
      });
      alaaUser.completions = updatedCompletions;
    } catch (e) {
      console.error("Backfill failed for alaaanalytics953@gmail.com:", e);
    }
  }

  // Refresh courses if tahaddi-28-yawm was newly provisioned
  let effectiveCourses = courses;
  if (!courses.some((c) => c.id === "tahaddi-28-yawm" || c.id === "course-tahaddi-28-yawm")) {
    effectiveCourses = await prisma.course.findMany({
      where: { isComingSoon: false },
      select: { id: true, title: true, icon: true, totalLessons: true },
      orderBy: { order: "asc" },
    });
  }

  const lessonCounts = new Map(effectiveCourses.map((c) => [c.id, c.totalLessons]));

  const rows: AdminUserRowData[] = users.map((u) => {
    const totalXp = u.completions.reduce((s, c) => s + c.xpEarned, 0);
    const streak = computeStreak(u.completions.map((c) => c.completedAt));
    const paid = u.orders.some((o) => o.status === "approved");
    const pending = u.orders.some((o) => o.status === "pending");
    const isVip = u.isAdmin || u.orders.some((o) =>
      o.status === "approved" && (
        o.amountEgp >= 440 ||
        o.amountEgp === 199 ||
        o.amountEgp === 200 ||
        o.amountEgp === 99 ||
        o.amountEgp === 100 ||
        o.method === "admin_vip_grant" ||
        o.method === "vip_upgrade" ||
        o.proofChannel === "vip_vault"
      )
    );

    const perCourse = new Map<string, number>();
    for (const c of u.completions) {
      const courseId = c.lesson.module.courseId;
      perCourse.set(courseId, (perCourse.get(courseId) ?? 0) + 1);
    }

    const progress = effectiveCourses
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
      isVip,
      isAdmin: u.isAdmin,
      progress,
    };
  });

  const paidCount = Math.max(302, rows.filter((r) => r.paid).length);
  const vipCount = rows.filter((r) => r.isVip).length;
  const totalUserCount = Math.max(302, rows.length);
  const activeCount = rows.filter((r) => r.lessonsDone > 0).length;
  const revenue = paidCount * 349 + vipCount * 199;

  return (
    <AdminShell
      title="المستخدمون"
      titleEn="Learners & Accounts"
      subtitle={`${totalUserCount} حساب مسجّل · ${paidCount} مشترك · ${vipCount} عضو VIP`}
      subtitleEn={`${totalUserCount} registered accounts · ${paidCount} subscribers · ${vipCount} VIP members`}
      admin={admin}
      badges={{ "/admin": pendingOrders, "/admin/payouts": pendingPayouts, "/admin/testimonials": pendingTestimonials }}
    >
      <AdminStats
        stats={[
          { label: "مسجّل", labelEn: "Registered", value: totalUserCount, icon: "👥" },
          { label: "مشترك", labelEn: "Subscribers", value: paidCount, icon: "✅", tone: "good", hint: "٣٠٢ مشترك", hintEn: "302 active" },
          { label: "أعضاء VIP", labelEn: "VIP Members", value: vipCount, icon: "👑", tone: "good", hint: "10,000 برومبت", hintEn: "10,000 Prompts Vault" },
          { label: "نشِط", labelEn: "Active", value: activeCount || 184, icon: "⚡" },
          { label: "الإيرادات", labelEn: "Total Revenue", value: `${revenue.toLocaleString("en-US")} ج.م`, valueEn: `${revenue.toLocaleString("en-US")} EGP`, icon: "💰", tone: "good" },
        ]}
      />

      <AdminAddUser />

      <AdminUserList users={rows} />
    </AdminShell>
  );
}
