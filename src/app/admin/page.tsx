import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminOrders from "@/components/AdminOrders";
import AdminPayments from "@/components/AdminPayments";
import AdminEmailTest from "@/components/AdminEmailTest";
import { emailStatus } from "@/lib/email";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) return <AdminLogin />;

  let orders: Awaited<ReturnType<typeof loadOrders>> = [];
  let unmatched: Awaited<ReturnType<typeof loadUnmatched>> = [];

  try {
    [orders, unmatched] = await Promise.all([loadOrders(), loadUnmatched()]);
  } catch (err) {
    // Almost always a schema that hasn't caught up with the code. Say so
    // instead of throwing a blank 500 at whoever is trying to run the business.
    return <DatabaseProblem detail={err instanceof Error ? err.message : String(err)} />;
  }

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

  const mail = emailStatus();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-md px-4 pt-5">
        <AdminEmailTest
          configured={mail.configured}
          via={mail.via}
          from={mail.from}
          smtpHost={mail.smtpHost}
        />
      </div>

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

function loadOrders() {
  return prisma.order.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { user: true, course: true },
    take: 200,
  });
}

function loadUnmatched() {
  return prisma.paymentTransaction.findMany({
    where: { status: "unmatched" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

function DatabaseProblem({ detail }: { detail: string }) {
  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-white p-6">
        <div className="mb-3 text-3xl">🛠️</div>
        <h1 className="mb-2 text-lg font-bold">قاعدة البيانات محتاجة تحديث</h1>
        <p className="mb-4 text-sm leading-relaxed text-neutral-600">
          الكود المرفوع فيه جداول مش موجودة في قاعدة البيانات على السيرفر. ده بيحصل
          لما ترفع نسخة جديدة من غير ما تحدّث القاعدة.
        </p>
        <p className="mb-2 text-sm font-bold">الحل — شغّل الأمر ده من Terminal في hPanel:</p>
        <pre
          dir="ltr"
          className="mb-4 overflow-x-auto rounded-xl bg-neutral-900 p-3 text-left text-xs text-green-300"
        >
          npx prisma db push
        </pre>
        <p className="mb-4 text-xs leading-relaxed text-neutral-500">
          الأمر ده <b>بيضيف الناقص بس</b> — مش بيمسح أي بيانات موجودة. بعده اعمل
          Restart للتطبيق.
        </p>
        <details className="text-xs text-neutral-400">
          <summary className="cursor-pointer">تفاصيل الخطأ التقني</summary>
          <pre dir="ltr" className="mt-2 overflow-x-auto whitespace-pre-wrap text-left">
            {detail}
          </pre>
        </details>
      </div>
    </div>
  );
}
