import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AdminPaymentSettings from "@/components/AdminPaymentSettings";
import { getPaymentConfig } from "@/lib/payment-config";

export const dynamic = "force-dynamic";

export default async function AdminPaymentSettingsPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [config, pendingOrders, payoutCount, pendingTestimonials] = await Promise.all([
    getPaymentConfig(),
    prisma.order.count({ where: { status: "pending" } }).catch(() => 0),
    prisma.payout.count({ where: { status: "requested" } }).catch(() => 0),
    prisma.testimonial.count({ where: { status: "pending" } }).catch(() => 0),
  ]);

  return (
    <AdminShell
      title="إعدادات طرق الدفع"
      titleEn="Payment Gateways & Accounts"
      subtitle="إدارة أرقام فودافون كاش وإنستاباي المعروضة عند بوابة الدفع مباشرة"
      subtitleEn="Manage Vodafone Cash and InstaPay receiving accounts live on checkout"
      admin={admin}
      badges={{
        "/admin": pendingOrders,
        "/admin/payouts": payoutCount,
        "/admin/testimonials": pendingTestimonials,
      }}
    >
      <AdminPaymentSettings initialConfig={config} />
    </AdminShell>
  );
}
