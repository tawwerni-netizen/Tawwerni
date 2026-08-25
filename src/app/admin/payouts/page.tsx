import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminPayouts from "@/components/AdminPayouts";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  if (!(await isAdmin())) return <AdminLogin />;

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

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-1 flex items-center gap-3">
          <h1 className="flex-1 text-xl font-bold">طلبات السحب</h1>
          <Link href="/admin" className="text-sm font-bold text-brand-600">
            الطلبات ←
          </Link>
        </div>
        <p className="mb-4 text-sm text-neutral-500">
          {requested.length > 0
            ? `${requested.length} طلب · إجمالي ${totalOwed} ج.م`
            : "مفيش طلبات منتظرة"}
        </p>

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
    </div>
  );
}
