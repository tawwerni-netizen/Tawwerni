import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import Link from "next/link";
import AdsDashboardClient from "@/components/AdsDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [orders, pendingCount, payoutCount, testimonialCount] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        amountEgp: true,
        status: true,
        productType: true,
        productSlug: true,
        method: true,
        createdAt: true,
        approvedAt: true,
      },
    }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.payout.count({ where: { status: "requested" } }),
    prisma.testimonial.count({ where: { status: "pending" } }),
  ]);

  const approvedOrders = orders.filter((o) => o.status === "approved");
  const totalRevenue = approvedOrders.reduce((sum, o) => sum + (o.amountEgp || 0), 0);
  const totalApproved = approvedOrders.length;
  const aov = totalApproved > 0 ? Math.round(totalRevenue / totalApproved) : 59;

  return (
    <AdminShell
      title="إدارة الإعلانات واكتساب العملاء"
      titleEn="Ads & Customer Acquisition"
      subtitle="متابعة حملات Tawwerni Ads V1، مؤشرات التحويل، واقتصاديات الوحدة المباشرة"
      subtitleEn="Monitor Tawwerni Ads V1 campaigns, conversion velocity, and real unit economics"
      admin={admin}
      badges={{
        "/admin": pendingCount,
        "/admin/payouts": payoutCount,
        "/admin/testimonials": testimonialCount,
      }}
    >
      <AdsDashboardClient
        initialOrders={orders.map((o) => ({
          id: o.id,
          amountEgp: o.amountEgp,
          status: o.status,
          productType: o.productType || "track",
          productSlug: o.productSlug || "prompt-engineering-mastery",
          method: o.method,
          createdAt: o.createdAt.toISOString(),
        }))}
        totalApproved={totalApproved}
        totalRevenue={totalRevenue}
        aov={aov}
      />
    </AdminShell>
  );
}
