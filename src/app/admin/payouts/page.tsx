import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminPayouts from "@/components/AdminPayouts";
import AdminShell from "@/components/AdminShell";
import AdminStats from "@/components/AdminStats";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [requested, settled] = await Promise.all([
    prisma.payout.findMany({
      where: { status: "requested" },
      orderBy: { requestedAt: "asc" },
      include: { user: { select: { email: true, name: true, id: true } } },
    }),
    prisma.payout.findMany({
      where: { status: { not: "requested" } },
      orderBy: { settledAt: "desc" },
      take: 30,
      include: { user: { select: { email: true } } },
    }),
  ]);

  const counts = await Promise.all(
    requested.map((p) => prisma.user.count({ where: { referredById: p.user.id } }))
  );

  const totalOwed = requested.reduce((s, p) => s + p.amountEgp, 0);
  const paidOut = settled
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amountEgp, 0);
  const pendingOrders = await prisma.order.count({ where: { status: "pending" } });

  return (
    <AdminShell
      title="طلبات السحب"
      subtitle={
        requested.length > 0
          ? `${requested.length} طلب مستني تحويل`
          : "مفيش طلبات منتظرة — كله متسدّد ✓"
      }
      admin={admin}
      badges={{ "/admin": pendingOrders, "/admin/payouts": requested.length }}
    >
      <AdminStats
        stats={[
          {
            label: "مستني تحويل",
            value: requested.length,
            icon: "⏳",
            tone: requested.length ? "warn" : "good",
          },
          { label: "المبلغ المستحق", value: `${totalOwed} ج.م`, icon: "💸", tone: requested.length ? "warn" : "neutral" },
          { label: "اتحوّل قبل كده", value: `${paidOut} ج.م`, icon: "✅", tone: "good" },
          { label: "إجمالي الطلبات", value: requested.length + settled.length, icon: "📊" },
        ]}
      />

      <div className="mx-auto max-w-2xl">
        <AdminPayouts
          payouts={requested.map((p, i) => ({
            id: p.id,
            email: p.user.email,
            name: p.user.name,
            amountEgp: p.amountEgp,
            method: p.method,
            destination: p.destination,
            requestedAt: p.requestedAt.toISOString(),
            referredCount: counts[i],
          }))}
        />

        {settled.length > 0 && (
          <>
            <h2 className="mb-2 mt-6 text-sm font-bold text-neutral-500">سجل السحوبات</h2>
            <div className="space-y-2">
              {settled.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-3"
                >
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${
                      p.status === "paid"
                        ? "bg-green-50 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {p.status === "paid" ? "اتحوّل" : "مرفوض"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs" dir="ltr">
                    {p.user.email}
                  </span>
                  <span className="shrink-0 text-sm font-bold">{p.amountEgp} ج.م</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
