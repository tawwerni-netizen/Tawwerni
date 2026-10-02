"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";

export type AdminUserRowData = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  joined: string;
  lastActive: string | null;
  totalXp: number;
  streak: number;
  lessonsDone: number;
  paid: boolean;
  pending: boolean;
  isVip?: boolean;
  hasDownloadedVault?: boolean;
  downloadedVaultAt?: string | null;
  isAdmin: boolean;
  progress: { id: string; title: string; icon: string; done: number; total: number; percent: number }[];
};

function fmt(iso: string) {
  return new Intl.DateTimeFormat("ar-EG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Short form for the four-across stats strip.
 *
 * The full date ("٢٦ أغسطس ٢٠٢٦") pushed that row 11px past the viewport on a
 * 375px phone — the only horizontal overflow left on the site. The year is
 * dropped because every one of these is recent; the full date is still on the
 * row itself under "آخر نشاط".
 */
function fmtShort(iso: string) {
  return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short" }).format(
    new Date(iso)
  );
}

/**
 * One learner in the admin list, with the password controls attached.
 *
 * There is no "show password" here and there never will be — passwords are
 * one-way scrypt hashes, so there is nothing to show. What the owner actually
 * needs when a customer says "I can't get in" is a way to get them back in,
 * which is what these two buttons do.
 */
export default function AdminUserRow({ user }: { user: AdminUserRowData }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [temp, setTemp] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [syncDays, setSyncDays] = useState(18);
  const [syncCourse, setSyncCourse] = useState("tahaddi-28-yawm");
  const [syncSuccess, setSyncSuccess] = useState("");
  const [activating, setActivating] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState("");
  const [togglingVip, setTogglingVip] = useState(false);
  const [vipSuccess, setVipSuccess] = useState("");

  async function handleToggleVip(grant = !user.isVip) {
    const promptMsg = grant
      ? `هل أنت متأكد من ترقية ${user.name || user.email} إلى VIP ومنحه قاعدة بيانات الـ 10,000 برومبت وحزمة العقود القانونية فوراً؟`
      : `هل تريد إلغاء ترقية VIP للمستخدم ${user.name || user.email}؟`;
    if (!confirm(promptMsg)) return;

    setTogglingVip(true);
    setError("");
    setVipSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}/vip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grant }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "فشل تحديث صلاحية VIP");
        return;
      }
      setVipSuccess(data.message || (grant ? "تمت ترقية العضو إلى VIP بنجاح!" : "تم إلغاء ترقية VIP"));
      user.isVip = grant;
      if (grant) {
        user.paid = true;
        user.pending = false;
      }
      setTimeout(() => router.refresh(), 1200);
    } catch {
      setError("خطأ في الاتصال بالسيرفر");
    } finally {
      setTogglingVip(false);
    }
  }

  async function handleActivateUser() {
    if (!confirm(`هل أنت متأكد من تفعيل اشتراك ${user.name || user.email} فوراً ومنحه وصولاً كاملاً لكل المسارات؟`)) {
      return;
    }
    setActivating(true);
    setError("");
    setActivationSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}/activate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "فشل تفعيل الحساب");
        return;
      }
      setActivationSuccess(data.message || "تم تفعيل الحساب بنجاح!");
      user.paid = true;
      user.pending = false;
      setTimeout(() => router.refresh(), 1200);
    } catch {
      setError("خطأ في الاتصال بالسيرفر");
    } finally {
      setActivating(false);
    }
  }

  async function handleSyncProgress() {
    setBusy(true);
    setError("");
    setSyncSuccess("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}/sync-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: syncCourse, completedDayCount: syncDays }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "فشل مزامنة التقدم");
        return;
      }
      setSyncSuccess(`تم تسجيل إنجاز ${syncDays} درس بنجاح!`);
      setTimeout(() => router.refresh(), 1000);
    } catch {
      setError("خطأ في الاتصال");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmEmail }),
      });
      const raw = await res.text();
      let data: { error?: string } = {};
      try { data = JSON.parse(raw); } catch { /* not JSON */ }
      if (!res.ok) { setError(data.error ?? "مش قادر أمسح الحساب"); return; }
      router.refresh();
    } catch {
      setError("مفيش اتصال بالسيرفر");
    } finally {
      setBusy(false);
    }
  }

  async function reset(mode: "send_link" | "temp") {
    setBusy(true);
    setError("");
    setNote("");
    setTemp(null);

    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });

      const raw = await res.text();
      let data: { error?: string; note?: string; tempPassword?: string } = {};
      try {
        data = JSON.parse(raw);
      } catch {
        /* not JSON — generic message below */
      }

      if (!res.ok) {
        setError(data.error ?? "مش قادر أعمل ده");
        return;
      }

      setNote(data.note ?? "تم");
      if (data.tempPassword) setTemp(data.tempPassword);
    } catch {
      setError("مفيش اتصال بالسيرفر");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar name={user.name} email={user.email} avatarUrl={user.avatarUrl} size={42} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="truncate font-bold text-neutral-900 dark:text-white text-sm sm:text-base" dir="ltr">
                {user.email}
              </p>
              {user.isVip && (
                <span className="rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 px-2 py-0.5 text-[10px] font-black flex items-center gap-1">
                  <span>👑</span>
                  <span>VIP (10,000 برومبت)</span>
                </span>
              )}
              {user.hasDownloadedVault && (
                <span
                  title={user.downloadedVaultAt ? `قام بتحميل قاعدة الـ 10,000 برومبت في: ${fmt(user.downloadedVaultAt)} (يسقط حق الاسترداد)` : "قام بتحميل البرومبتات"}
                  className="rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-black flex items-center gap-1 shadow-2xs"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 font-black">✓</span>
                  <span>حمّل البرومبتات</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {user.name ?? "بدون اسم"}
              {user.phone && (
                <span dir="ltr" className="mr-2 text-neutral-400 font-mono">
                  · {user.phone}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 self-end sm:self-auto">
          {user.isAdmin && (
            <span className="rounded-full bg-brand-50 text-brand-800 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-500/30 px-2 py-0.5 text-[10px] font-bold">
              أدمن
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              user.paid
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/20"
                : user.pending
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-500/20"
                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
            }`}
          >
            {user.paid ? "مشترك ✓" : user.pending ? "في الانتظار" : "مجاني"}
          </span>

          {/* 1-Click VIP Upgrade Button */}
          <button
            type="button"
            onClick={() => handleToggleVip(!user.isVip)}
            disabled={togglingVip}
            className={`rounded-full px-3 py-1 text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 select-none ${
              user.isVip
                ? "bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25"
                : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-95 text-neutral-950 shadow-xs"
            }`}
            title={user.isVip ? "إلغاء أو تعديل VIP" : "ترقية هذا العضو للحصول على 10,000 برومبت فوراً"}
          >
            <span>👑</span>
            <span>{togglingVip ? "..." : user.isVip ? "VIP مفعّل ✓" : "ترقية VIP (10,000 برومبت)"}</span>
          </button>

          {!user.paid && (
            <button
              type="button"
              onClick={handleActivateUser}
              disabled={activating}
              className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-95 text-white px-3 py-1 text-[11px] font-bold shadow-xs transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            >
              <span>⚡</span>
              <span>{activating ? "..." : "تفعيل الحساب"}</span>
            </button>
          )}
        </div>
      </div>

      {activationSuccess && (
        <div className="mb-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 text-xs text-emerald-800 dark:text-emerald-200 font-bold animate-pulse">
          {activationSuccess}
        </div>
      )}

      {vipSuccess && (
        <div className="mb-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 p-2.5 text-xs text-amber-800 dark:text-amber-200 font-black animate-pulse flex items-center gap-2">
          <span>👑</span>
          <span>{vipSuccess}</span>
        </div>
      )}

      <div className="mb-3 grid grid-cols-4 gap-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 p-2 text-center border border-black/5 dark:border-white/5">
        <Mini label="XP" value={user.totalXp} />
        <Mini label="دروس" value={user.lessonsDone} />
        <Mini label="متتالية" value={`${user.streak}🔥`} />
        <Mini label="اشترك" value={fmtShort(user.joined)} small />
      </div>

      {user.progress.length > 0 ? (
        <div className="space-y-2">
          {user.progress.map((c) => (
            <div key={c.id}>
              <div className="mb-1 flex items-center gap-2 text-xs">
                <span aria-hidden>{c.icon}</span>
                <span className="flex-1 truncate">{c.title}</span>
                <span className="shrink-0 font-bold text-brand-700">
                  {c.done}/{c.total} · {c.percent}٪
                </span>
              </div>
              <div className="progress-track">
                <span className="progress-fill" style={{ width: `${c.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-400">لسه ما بدأش أي درس.</p>
      )}

      {user.lastActive && (
        <p className="mt-2 text-xs text-neutral-400">آخر نشاط: {fmt(user.lastActive)}</p>
      )}

      <div className="mt-3 border-t border-black/5 pt-3">
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="text-[11px] font-bold text-brand-600"
          >
            🔑 مشكلة في الدخول؟
          </button>
        ) : (
          <div className="animate-rise">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-bold">استرجاع الدخول</p>
              <button onClick={() => setOpen(false)} className="text-[11px] text-neutral-500">
                إخفاء
              </button>
            </div>

            <div className="mb-2 flex flex-wrap gap-2">
              <button
                onClick={() => reset("send_link")}
                disabled={busy}
                className="rounded-full bg-brand-600 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-50"
              >
                {busy ? "..." : "📧 ابعتله لينك"}
              </button>
              <button
                onClick={() => reset("temp")}
                disabled={busy}
                className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-bold disabled:opacity-50"
              >
                🔢 باسورد مؤقت
              </button>
            </div>

            {temp && (
              <div className="mb-2 rounded-xl bg-amber-50 p-3">
                <p className="mb-1 text-[10px] font-bold text-amber-900">
                  الباسورد المؤقت — بيظهر مرة واحدة بس
                </p>
                <p
                  dir="ltr"
                  className="select-all rounded-lg bg-white px-2 py-1.5 text-center font-mono text-sm font-bold"
                >
                  {temp}
                </p>
              </div>
            )}

            {note && <p className="text-[11px] leading-relaxed text-neutral-500">{note}</p>}
            {error && <p className="text-[11px] text-red-600">{error}</p>}

            <p className="mt-2 text-[10px] leading-relaxed text-neutral-400">
              كلمات السر مخزّنة مشفّرة في اتجاه واحد — مفيش طريقة تشوف باسورد
              العميل، لا من هنا ولا من قاعدة البيانات.
            </p>

            {/* Progress sync / manual credit control */}
            <div className="mt-3 border-t border-black/5 dark:border-neutral-800 pt-3">
              <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                ⚡ مزامنة / تعديل تقدّم الدروس للعميل
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={syncCourse}
                  onChange={(e) => setSyncCourse(e.target.value)}
                  className="rounded-lg border border-black/10 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-xs"
                >
                  <option value="tahaddi-28-yawm">تحدي الذكاء الاصطناعي - 28 يوم</option>
                  <option value="prompt-engineering-mastery">هندسة الأوامر بالذكاء الاصطناعي</option>
                  <option value="ai-business-automation">أتمتة الأعمال بالـ AI</option>
                </select>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-neutral-500">الدروس المنجزة:</span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={syncDays}
                    onChange={(e) => setSyncDays(Number(e.target.value))}
                    className="w-16 rounded-lg border border-black/10 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-xs text-center font-bold"
                  />
                </div>
                <button
                  onClick={handleSyncProgress}
                  disabled={busy}
                  className="rounded-full bg-teal-600 hover:bg-teal-500 text-white px-3 py-1 text-[11px] font-bold disabled:opacity-50 transition-colors shadow-xs"
                >
                  {busy ? "جاري الحفظ..." : "تثبيت التقدم"}
                </button>
              </div>
              {syncSuccess && <p className="text-[11px] text-emerald-600 mt-1 font-semibold">{syncSuccess}</p>}
            </div>

            {/* VIP Vault Management */}
            <div className="mt-3 border-t border-black/5 dark:border-white/10 pt-3">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <span>👑</span>
                  <span>خزنة VIP وقاعدة الـ 10,000 برومبت</span>
                </p>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  user.isVip
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}>
                  {user.isVip ? "مفعّلة ✓" : "غير مفعّلة"}
                </span>
              </div>
              {user.hasDownloadedVault && (
                <div className="mb-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 p-2.5 text-xs text-amber-900 dark:text-amber-200 font-bold flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <span>📥</span>
                    <span>
                      قام بتحميل قاعدة الـ 10,000 برومبت بتاريخ:{" "}
                      <span className="font-mono text-neutral-900 dark:text-white">
                        {fmt(user.downloadedVaultAt!)}
                      </span>
                    </span>
                  </div>
                  <span className="rounded-full bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30 px-2 py-0.5 text-[10px] font-black">
                    غير مؤهل للاسترجاع (أصول محملة) 🚫
                  </span>
                </div>
              )}
              <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-2">
                {user.isVip
                  ? "العضو يمتلك صلاحية الوصول الكاملة لقاعدة الـ 10,000 برومبت وعقود الفريلانس القانونية."
                  : "يمكنك ترقية العضو ومنحه وصولاً فورياً لقاعدة الـ 10,000 برومبت وحزمة العقود بضغطة زر واحدة."}
              </p>
              <button
                type="button"
                onClick={() => handleToggleVip(!user.isVip)}
                disabled={togglingVip}
                className={`rounded-full px-3.5 py-1.5 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  user.isVip
                    ? "bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-600 dark:text-red-400"
                    : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-95 text-neutral-950 shadow-xs"
                }`}
              >
                <span>👑</span>
                <span>{togglingVip ? "جارٍ التحديث..." : user.isVip ? "إلغاء ترقية VIP" : "ترقية فورية إلى VIP (10,000 برومبت)"}</span>
              </button>
            </div>

            {!user.isAdmin && (
              <div className="mt-3 border-t border-black/5 pt-3">
                {!confirming ? (
                  <button
                    onClick={() => setConfirming(true)}
                    className="text-[11px] font-bold text-red-600"
                  >
                    🗑️ امسح الحساب نهائيًا
                  </button>
                ) : (
                  <div className="animate-rise rounded-xl bg-red-50 p-3">
                    <p className="mb-2 text-[11px] font-bold leading-relaxed text-red-800">
                      ده هيمسح الحساب وكل تقدّمه وطلباته — مفيش رجوع.
                    </p>
                    <p className="mb-2 text-[10px] text-red-700">
                      اكتب <b dir="ltr">{user.email}</b> عشان تأكّد:
                    </p>
                    <input
                      dir="ltr"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      placeholder="الإيميل"
                      className="mb-2 w-full rounded-lg border border-red-200 px-2.5 py-2 text-xs"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={remove}
                        disabled={busy || confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()}
                        className="rounded-full bg-red-600 px-3 py-1.5 text-[11px] font-bold text-white disabled:opacity-40"
                      >
                        {busy ? "..." : "امسح"}
                      </button>
                      <button
                        onClick={() => {
                          setConfirming(false);
                          setConfirmEmail("");
                        }}
                        className="rounded-full border border-black/10 px-3 py-1.5 text-[11px]"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({ label, value, small }: { label: string; value: number | string; small?: boolean }) {
  return (
    <div className="min-w-0">
      <div className={`truncate font-bold text-neutral-800 dark:text-neutral-200 ${small ? "text-xs" : "text-sm"}`}>
        {value}
      </div>
      <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">{label}</div>
    </div>
  );
}
