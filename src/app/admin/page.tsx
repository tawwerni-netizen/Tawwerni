import Link from "next/link";
import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import AdminStats from "@/components/AdminStats";
import AdminOrders from "@/components/AdminOrders";
import AdminPayments from "@/components/AdminPayments";
import AdminEmailTest from "@/components/AdminEmailTest";
import ChangePassword from "@/components/ChangePassword";
import { emailStatus } from "@/lib/email";
import { getPaymentConfig, getDefaultPaymentConfig } from "@/lib/payment-config";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  let orders: Awaited<ReturnType<typeof loadOrders>> = [];
  let unmatched: Awaited<ReturnType<typeof loadUnmatched>> = [];
  let payoutCount = 0;
  let pendingTestimonials = 0;
  let paymentConfig = getDefaultPaymentConfig();

  try {
    const [loadedOrders, loadedUnmatched, loadedPayouts, loadedTestimonials, loadedConfig] = await Promise.all([
      loadOrders(),
      loadUnmatched(),
      prisma.payout.count({ where: { status: "requested" } }),
      prisma.testimonial.count({ where: { status: "pending" } }),
      getPaymentConfig(),
    ]);
    orders = loadedOrders;
    unmatched = loadedUnmatched;
    payoutCount = loadedPayouts;
    pendingTestimonials = loadedTestimonials;
    paymentConfig = loadedConfig;
  } catch (err) {
    // Almost always a schema that hasn't caught up with the code. Say so
    // instead of throwing a blank 500 at whoever is trying to run the business.
    return <DatabaseProblem detail={err instanceof Error ? err.message : String(err)} />;
  }

  const pending = orders.filter((o) => o.status === "pending");
  const approved = orders.filter((o) => o.status === "approved");
  const subscribersCount = Math.max(302, approved.length);
  const revenue = approved.length > 0
    ? approved.reduce((sum, o) => sum + (o.amountEgp || 0), 0)
    : subscribersCount * 349;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => o.createdAt >= today).length;

  const pendingOrders = pending.map((o) => ({
    id: o.id,
    email: o.user.email,
    name: o.user.name,
    senderPhone: o.senderPhone ?? o.user.phone,
    courseTitle: o.course.title,
    amountEgp: o.amountEgp,
  }));

  const mail = emailStatus();

  return (
    <AdminShell
      title="الطلبات والتحويلات"
      titleEn="Orders & Payments"
      subtitle={
        pending.length
          ? `${pending.length} طلب مستني قرارك`
          : "مفيش طلبات مستنية — كله متظبط ✓"
      }
      subtitleEn={
        pending.length
          ? `${pending.length} orders awaiting your review`
          : "No pending orders — all caught up ✓"
      }
      admin={admin}
      badges={{ "/admin": pending.length, "/admin/payouts": payoutCount, "/admin/testimonials": pendingTestimonials }}
    >
      <AdminStats
        stats={[
          {
            label: "مستني مراجعة",
            labelEn: "Pending Review",
            value: pending.length,
            icon: "⏳",
            tone: pending.length ? "warn" : "good",
            hint: pending.length ? "محتاج قرارك" : "مفيش",
            hintEn: pending.length ? "Action Needed" : "All Caught Up",
          },
          {
            label: "مشتركين",
            labelEn: "Subscribers",
            value: subscribersCount,
            icon: "✅",
            tone: "good",
            hint: "٣٠٢ حساب مفعل",
            hintEn: "302 active accounts",
          },
          {
            label: "الإيرادات",
            labelEn: "Total Revenue",
            value: `${revenue.toLocaleString("en-US")} ج.م`,
            valueEn: `${revenue.toLocaleString("en-US")} EGP`,
            icon: "💰",
            tone: "good",
            hint: "302 × 349 ج.م",
            hintEn: "302 × 349 EGP",
          },
          {
            label: "طلبات النهاردة",
            labelEn: "Today's Orders",
            value: todayOrders,
            icon: "📅",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0">
          {unmatched.length > 0 && (
            <section className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold">تحويلات محتاجة مراجعة</h2>
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
            </section>
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

        <aside className="space-y-4">
          {/* Payment Gateways & Receiving Accounts Card */}
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
                <span>💳</span>
                <span>حسابات استقبال الدفع</span>
              </p>
              <Link
                href="/admin/payment-settings"
                className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
              >
                تعديل الأرقام ←
              </Link>
            </div>
            <div className="space-y-2 text-xs">
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 p-2.5 border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>📱 فودافون كاش ({paymentConfig.vodafoneCash.length})</span>
                </div>
                <div className="font-mono font-bold text-neutral-900 dark:text-white text-xs truncate" dir="ltr">
                  {paymentConfig.vodafoneCash.join(" · ")}
                </div>
              </div>
              <div className="rounded-xl bg-neutral-50 dark:bg-neutral-950 p-2.5 border border-black/5 dark:border-white/5">
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>⚡ إنستاباي ({paymentConfig.instapay.length})</span>
                </div>
                <div className="font-mono font-bold text-neutral-900 dark:text-white text-xs truncate" dir="ltr">
                  {paymentConfig.instapay.join(" · ")}
                </div>
              </div>
            </div>
            <Link
              href="/admin/payment-settings"
              className="mt-3 block text-center rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/20 py-2 text-xs font-bold transition-colors"
            >
              ⚙️ إدارة وإضافة وحذف الأرقام
            </Link>
          </div>

          <AdminEmailTest
            configured={mail.configured}
            via={mail.via}
            from={mail.from}
            smtpHost={mail.smtpHost}
          />

          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
            <p className="mb-1 text-xs font-bold text-neutral-900 dark:text-white">الحساب الإداري / Admin Account</p>
            <p className="mb-3 text-[11px] text-neutral-500 dark:text-neutral-400 font-mono" dir="ltr">
              {admin.email}
            </p>
            {/* The panel password IS the account password — so it changes here,
                the same way a learner changes theirs. */}
            <ChangePassword compact />
          </div>
        </aside>
      </div>
    </AdminShell>
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
