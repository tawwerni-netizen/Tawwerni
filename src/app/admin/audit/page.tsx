import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  "order.approve": "وافق على طلب ✓",
  "order.reject": "رفض طلب",
  "order.set_pending": "رجّع طلب لمعلّق",
  "payment.link": "ربط تحويل بطلب",
  "payment.ignore": "اتجاهل تحويل",
  "payout.paid": "حوّل مبلغ سحب",
  "payout.reject": "رفض طلب سحب",
  "user.create": "أنشأ حساب",
  "user.delete": "مسح حساب",
  "user.password_temp_issued": "طلّع باسورد مؤقت",
  "user.password_reset_sent": "بعت لينك تغيير باسورد",
};

function formatWhen(d: Date) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/**
 * Who did what, and when — read-only.
 *
 * There is exactly one owner account today, so this mostly matters as a
 * record of what the automation vs. the human decided, and as the answer to
 * "did I actually approve that?" six months from now. It starts paying for
 * itself the day a second admin gets added.
 */
export default async function AdminAuditPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const [entries, pendingOrders, requestedPayouts] = await Promise.all([
    prisma.adminAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.payout.count({ where: { status: "requested" } }),
  ]);

  return (
    <AdminShell
      title="سجل الإجراءات"
      subtitle={
        entries.length > 0
          ? `آخر ${entries.length} إجراء من كل الأدمنز`
          : "لسه مفيش إجراءات مسجّلة"
      }
      admin={admin}
      badges={{ "/admin": pendingOrders, "/admin/payouts": requestedPayouts }}
    >
      <div className="mx-auto max-w-3xl space-y-2">
        {entries.length === 0 && (
          <p className="rounded-2xl border border-black/5 bg-white p-6 text-center text-sm text-neutral-500">
            كل إجراء إداري (موافقة طلب، ربط تحويل، تسوية سحب، مسح حساب…) هيظهر هنا
            أول ما يحصل.
          </p>
        )}

        {entries.map((e) => (
          <div
            key={e.id}
            className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-xl border border-black/5 bg-white px-4 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-bold">{ACTION_LABELS[e.action] ?? e.action}</p>
              <p className="mt-0.5 truncate text-xs text-neutral-400">
                {e.adminEmail}
                {e.detail ? ` · ${e.detail}` : ""}
              </p>
            </div>
            <span className="shrink-0 text-xs text-neutral-400" dir="ltr">
              {formatWhen(e.createdAt)}
            </span>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
