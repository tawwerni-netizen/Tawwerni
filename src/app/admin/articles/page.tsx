import Link from "next/link";
import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getPillar } from "@/content/hub-pillars";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AdminStats from "@/components/AdminStats";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [articles, pendingOrders, requestedPayouts, pendingTestimonials] = await Promise.all([
    prisma.article.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.payout.count({ where: { status: "requested" } }),
    prisma.testimonial.count({ where: { status: "pending" } }),
  ]);

  const published = articles.filter((a) => a.status === "published");

  return (
    <AdminShell
      title="المقالات"
      subtitle={`${published.length} منشور · ${articles.length - published.length} مسودة`}
      admin={admin}
      badges={{ "/admin": pendingOrders, "/admin/payouts": requestedPayouts, "/admin/testimonials": pendingTestimonials }}
    >
      <AdminStats
        stats={[
          { label: "منشور", value: published.length, icon: "✅", tone: "good" },
          { label: "مسودة", value: articles.length - published.length, icon: "📝" },
          { label: "الإجمالي", value: articles.length, icon: "📚" },
        ]}
      />

      <div className="mx-auto max-w-2xl">
        <Link
          href="/admin/articles/new"
          className="btn-shine mb-4 block rounded-full bg-brand-600 py-3 text-center text-sm font-bold text-white"
        >
          + مقال جديد
        </Link>

        {articles.length === 0 ? (
          <p className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            مفيش مقالات لسه.
          </p>
        ) : (
          <div className="space-y-2">
            {articles.map((a) => {
              const pillar = getPillar(a.pillar);
              return (
                <Link
                  key={a.id}
                  href={`/admin/articles/${a.id}/edit`}
                  className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-3.5 hover:border-brand-500/30 transition shadow-xs"
                >
                  <span className="text-xl">{a.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-neutral-900 dark:text-white">{a.title}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      {pillar?.title ?? a.pillar}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-black shadow-xs ${
                      a.status === "published"
                        ? "bg-emerald-600 text-white border border-emerald-500"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-black/10 dark:border-white/10"
                    }`}
                  >
                    {a.status === "published" ? "✓ منشور" : "مسودة"}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
