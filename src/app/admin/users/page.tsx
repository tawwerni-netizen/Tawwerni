import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import { computeStreak } from "@/lib/xp";

export const dynamic = "force-dynamic";

/**
 * Operator view of every learner: who they are, when they joined, what they
 * paid for, and how far they actually got in each track.
 */
export default async function AdminUsersPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  const [users, courses] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      include: {
        orders: { include: { course: true }, orderBy: { createdAt: "desc" } },
        completions: {
          include: { lesson: { include: { module: true } } },
          orderBy: { completedAt: "desc" },
        },
      },
    }),
    prisma.course.findMany({
      where: { isComingSoon: false },
      select: { id: true, title: true, icon: true, totalLessons: true },
      orderBy: { order: "asc" },
    }),
  ]);

  const lessonCounts = new Map(courses.map((c) => [c.id, c.totalLessons]));

  const rows = users.map((u) => {
    const totalXp = u.completions.reduce((s, c) => s + c.xpEarned, 0);
    const streak = computeStreak(u.completions.map((c) => c.completedAt));
    const paid = u.orders.some((o) => o.status === "approved");
    const pending = u.orders.some((o) => o.status === "pending");

    // Completed lessons grouped by the course each lesson belongs to.
    const perCourse = new Map<string, number>();
    for (const c of u.completions) {
      const courseId = c.lesson.module.courseId;
      perCourse.set(courseId, (perCourse.get(courseId) ?? 0) + 1);
    }

    const progress = courses
      .map((c) => {
        const done = perCourse.get(c.id) ?? 0;
        const total = lessonCounts.get(c.id) ?? 0;
        return { ...c, done, total, percent: total ? Math.round((done / total) * 100) : 0 };
      })
      .filter((c) => c.done > 0);

    return {
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      joined: u.createdAt,
      lastActive: u.completions[0]?.completedAt ?? null,
      totalXp,
      streak,
      lessonsDone: u.completions.length,
      paid,
      pending,
      progress,
      orders: u.orders,
    };
  });

  const paidCount = rows.filter((r) => r.paid).length;
  const activeCount = rows.filter((r) => r.lessonsDone > 0).length;
  const revenue = rows.reduce(
    (s, r) => s + r.orders.filter((o) => o.status === "approved").reduce((a, o) => a + o.amountEgp, 0),
    0
  );

  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" }).format(d);

  return (
    <div className="min-h-screen bg-neutral-50 pb-10">
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="flex-1 text-xl font-bold">المستخدمون</h1>
          <Link href="/admin" className="text-sm font-bold text-brand-600">
            الطلبات ←
          </Link>
        </div>

        <div className="mb-5 grid grid-cols-4 gap-2">
          <Stat label="مسجّل" value={rows.length} />
          <Stat label="دافع" value={paidCount} accent="text-green-600" />
          <Stat label="نشِط" value={activeCount} />
          <Stat label="إجمالي" value={`${revenue}`} suffix="ج" accent="text-brand-700" />
        </div>

        {rows.length === 0 ? (
          <p className="rounded-2xl border border-black/5 bg-white p-6 text-center text-sm text-neutral-400">
            لسه مفيش مستخدمين مسجّلين.
          </p>
        ) : (
          <div className="space-y-3">
            {rows.map((u) => (
              <div key={u.id} className="rounded-2xl border border-black/5 bg-white p-4">
                <div className="mb-2 flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 font-bold text-white">
                    {(u.name ?? u.email)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold" dir="ltr">
                      {u.email}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {u.name ?? "بدون اسم"}
                      {u.phone && (
                        <span dir="ltr" className="mr-2 text-neutral-400">
                          · {u.phone}
                        </span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                      u.paid
                        ? "bg-green-50 text-green-700"
                        : u.pending
                          ? "bg-amber-50 text-amber-700"
                          : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {u.paid ? "مشترك" : u.pending ? "في الانتظار" : "مجاني"}
                  </span>
                </div>

                <div className="mb-3 grid grid-cols-4 gap-2 rounded-xl bg-neutral-50 p-2 text-center">
                  <Mini label="XP" value={u.totalXp} />
                  <Mini label="دروس" value={u.lessonsDone} />
                  <Mini label="متتالية" value={`${u.streak}🔥`} />
                  <Mini label="اشترك" value={fmt(u.joined)} small />
                </div>

                {u.progress.length > 0 ? (
                  <div className="space-y-2">
                    {u.progress.map((c) => (
                      <div key={c.id}>
                        <div className="mb-1 flex items-center gap-2 text-xs">
                          <span>{c.icon}</span>
                          <span className="flex-1 truncate">{c.title}</span>
                          <span className="shrink-0 font-bold text-brand-700">
                            {c.done}/{c.total} · {c.percent}٪
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-brand-600"
                            style={{ width: `${c.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">لسه ما بدأش أي درس.</p>
                )}

                {u.lastActive && (
                  <p className="mt-2 text-xs text-neutral-400">آخر نشاط: {fmt(u.lastActive)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-black/5 bg-white py-3 text-center">
      <div className={`text-lg font-bold ${accent ?? "text-neutral-800"}`}>
        {value}
        {suffix && <span className="text-xs font-normal"> {suffix}</span>}
      </div>
      <div className="text-xs text-neutral-400">{label}</div>
    </div>
  );
}

function Mini({ label, value, small }: { label: string; value: number | string; small?: boolean }) {
  return (
    <div>
      <div className={`font-bold text-neutral-700 ${small ? "text-xs" : "text-sm"}`}>{value}</div>
      <div className="text-xs text-neutral-400">{label}</div>
    </div>
  );
}
