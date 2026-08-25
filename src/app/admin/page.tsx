import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminOrders from "@/components/AdminOrders";
import AdminPayments from "@/components/AdminPayments";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  const [orders, unmatched] = await Promise.all([
    prisma.order.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      include: { user: true, course: true },
      take: 200,
    }),
    prisma.paymentTransaction.findMany({
      where: { status: "unmatched" },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const pendingOrders = orders
    .filter((o) => o.status === "pending")
    .map((o) => ({
      id: o.id,
      email: o.user.email,
      name: o.user.name,
      senderPhone: o.senderPhone ?? o.user.phone,
      courseTitle: o.course.title,
      amountEgp: o.amountEgp,
    }));

  return (
    <div className="min-h-screen bg-neutral-50">
      {unmatched.length > 0 && (
        <div className="mx-auto max-w-md px-4 pt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold">تحويلات محتاجة مراجعة</p>
            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-900">
              {unmatched.length}
            </span>
          </div>
          <p className="mb-3 text-[11px] leading-relaxed text-neutral-400">
            التحويلات دي وصلت بس النظام ما قدرش يحدد الطلب بتاعها بتأكيد كامل، فاستنى قرارك.
          </p>
          <AdminPayments
            transactions={unmatched.map((t) => ({
              id: t.id,
              provider: t.provider,
              amountEgp: t.amountEgp,
              senderPhone: t.senderPhone,
              rawSms: t.rawSms,
              matchNote: t.matchNote,
              createdAt: t.createdAt.toISOString(),
            }))}
            pendingOrders={pendingOrders}
          />
        </div>
      )}

      <AdminOrders
        orders={orders.map((o) => ({
          id: o.id,
          email: o.user.email,
          name: o.user.name,
          senderPhone: o.senderPhone ?? o.user.phone,
          courseTitle: o.course.title,
          courseIcon: o.course.icon,
          method: o.method,
          amountEgp: o.amountEgp,
          status: o.status,
          proofChannel: o.proofChannel,
          createdAt: o.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
