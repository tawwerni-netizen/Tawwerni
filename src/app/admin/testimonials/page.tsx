import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AdminStats from "@/components/AdminStats";
import AdminTestimonials from "@/components/AdminTestimonials";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [pending, decided, pendingOrders, requestedPayouts] = await Promise.all([
    prisma.testimonial.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: { course: { select: { title: true } } },
    }),
    prisma.testimonial.findMany({
      where: { status: { not: "pending" } },
      orderBy: [{ featured: "desc" }, { decidedAt: "desc" }],
      take: 60,
      include: { course: { select: { title: true } } },
    }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.payout.count({ where: { status: "requested" } }),
  ]);

  const toItem = (t: (typeof pending)[number]) => ({
    id: t.id,
    holderName: t.holderName,
    quote: t.quote,
    rating: t.rating,
    courseTitle: t.course?.title ?? null,
    status: t.status,
    featured: t.featured,
    createdAt: t.createdAt.toISOString(),
  });

  const approvedCount = decided.filter((t) => t.status === "approved").length;

  return (
    <AdminShell
      title="آراء المتعلمين"
      subtitle={
        pending.length > 0
          ? `${pending.length} رأي مستني مراجعة`
          : "مفيش آراء مستنية مراجعة — كله متابَع ✓"
      }
      admin={admin}
      badges={{ "/admin": pendingOrders, "/admin/payouts": requestedPayouts, "/admin/testimonials": pending.length }}
    >
      <AdminStats
        stats={[
          { label: "مستني مراجعة", value: pending.length, icon: "⏳", tone: pending.length ? "warn" : "good" },
          { label: "موافَق عليه", value: approvedCount, icon: "✅", tone: "good" },
          { label: "مُبرز", value: decided.filter((t) => t.featured).length, icon: "⭐" },
        ]}
      />

      <div className="mx-auto max-w-2xl space-y-6">
        {pending.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-bold text-neutral-500">مستني مراجعة</h2>
            <AdminTestimonials items={pending.map(toItem)} />
          </div>
        )}

        <div>
          <h2 className="mb-2 text-sm font-bold text-neutral-500">قرارات سابقة</h2>
          <AdminTestimonials items={decided.map(toItem)} />
        </div>
      </div>
    </AdminShell>
  );
}
