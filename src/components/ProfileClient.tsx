"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { brand, payment } from "@/content/brand";
import AvatarPicker from "@/components/AvatarPicker";
import ChangePassword from "@/components/ChangePassword";
import { useI18n } from "./LanguageContext";

const PACE_OPTIONS = [
  { value: 5, icon: "⚡", labelAr: "شرارة", labelEn: "Spark", subAr: "٥ دقايق / يوم", subEn: "5 min/day" },
  { value: 10, icon: "🔥", labelAr: "زخم", labelEn: "Momentum", subAr: "١٠ دقايق / يوم", subEn: "10 min/day" },
  { value: 15, icon: "🚀", labelAr: "اندفاع", labelEn: "Accelerate", subAr: "١٥ دقيقة / يوم", subEn: "15 min/day" },
];

const FOCUS_OPTIONS = [
  { value: "all", icon: "🌟", labelAr: "جميع الـ 100 مسار", labelEn: "All 100 Tracks" },
  { value: "ai-prompting", icon: "🤖", labelAr: "الذكاء الاصطناعي وهندسة الأوامر", labelEn: "AI & Prompt Engineering" },
  { value: "software-dev", icon: "💻", labelAr: "البرمجة وتطوير الويب", labelEn: "Software & Web Dev" },
  { value: "data-analytics", icon: "📊", labelAr: "تحليل البيانات والذكاء التجاري", labelEn: "Data Analytics & BI" },
  { value: "freelancing", icon: "💼", labelAr: "العمل الحر واقتناص العملاء", labelEn: "Freelancing & Client Acquisition" },
  { value: "digital-marketing", icon: "📈", labelAr: "التسويق الرقمي ونمو المبيعات", labelEn: "Digital Marketing & Growth" },
  { value: "design-media", icon: "🎨", labelAr: "التصميم الإبداعي والميديا", labelEn: "UI/UX & Creative Media" },
  { value: "business-startups", icon: "🏢", labelAr: "ريادة الأعمال وبناء المشاريع", labelEn: "Business & Startups" },
  { value: "cybersecurity", icon: "🛡️", labelAr: "الأمن السيبراني وحماية البيانات", labelEn: "Cybersecurity & Privacy" },
  { value: "leadership-negotiation", icon: "🤝", labelAr: "المهارات القيادية والتفاوض", labelEn: "Leadership & Negotiation" },
  { value: "productivity-mindset", icon: "🧠", labelAr: "الإنتاجية وإدارة الذات", labelEn: "Productivity & Mindset" },
];

function formatPaymentMethod(rawMethod: string | undefined, isEn: boolean) {
  if (!rawMethod) return isEn ? "1-Year Access" : "وصول لمدة سنة";
  const m = rawMethod.toLowerCase();
  if (m.includes("vodafone") || m.includes("فودافون") || m.includes("cash") || m.includes("كاش")) {
    return isEn ? "Vodafone Cash" : "فودافون كاش";
  }
  if (m.includes("insta") || m.includes("انستا") || m.includes("إنستا")) {
    return isEn ? "InstaPay" : "إنستاباي";
  }
  if (m.includes("visa") || m.includes("فيزا") || m.includes("card") || m.includes("كارت")) {
    return isEn ? "Credit / Debit Card" : "فيزا / ماستركارد";
  }
  return rawMethod;
}

type Props = {
  name: string | null;
  email: string;
  dailyPaceMinutes: number;
  focusCategory: string | null;
  avatarUrl: string | null;
  totalXp: number;
  streak: number;
  subscription: { method: string; amountEgp: number; createdAt: string } | null;
  isAdmin?: boolean;
};

export default function ProfileClient(props: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const router = useRouter();
  const [name, setName] = useState(props.name ?? "");
  const [editingName, setEditingName] = useState(false);
  const [pace, setPace] = useState(props.dailyPaceMinutes);
  const [focus, setFocus] = useState(props.focusCategory ?? "all");
  const [saving, setSaving] = useState(false);

  async function save(patch: Record<string, unknown>) {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSaving(false);
    router.refresh();
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  const paymentLabel = formatPaymentMethod(props.subscription?.method, isEn);

  // Student level tier for dopamine
  const studentLevel = props.totalXp >= 2000 ? (isEn ? "Elite Master 👑" : "خبير النخبة 👑")
    : props.totalXp >= 1000 ? (isEn ? "Advanced Pro ⚡" : "محترف متقدم ⚡")
    : props.totalXp >= 400 ? (isEn ? "Active Explorer 🚀" : "مستكشف نشط 🚀")
    : (isEn ? "Rising Pioneer 🌱" : "رائد واعد 🌱");

  return (
    <div className="relative mx-auto max-w-2xl px-4 pt-7 sm:pt-9 pb-16 text-neutral-900 dark:text-white" dir={isEn ? "ltr" : "rtl"}>
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-10 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />

      {/* Header Banner */}
      <div className="mb-6">
        <span className="text-xs font-black tracking-wider uppercase text-teal-600 dark:text-teal-400">
          {isEn ? "Learner Profile" : "الملف الشخصي للطالب"}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
          {isEn ? "My Account & Settings" : "حسابي وتفضيلات التعلّم"}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          {isEn ? "Manage your personal identity, daily learning pace, and account security." : "إدارة بياناتك الشخصية، الوتيرة اليومية، ومسارات تركيزك المفضلة بكل سهولة."}
        </p>
      </div>

      {/* ⭐ Admin Management Portal Card ⭐ */}
      {props.isAdmin && (
        <div className="rounded-3xl border-2 border-red-500/40 bg-gradient-to-br from-red-950/40 via-[#0d1614] to-neutral-900 p-5 sm:p-6 mb-6 shadow-xl shadow-red-500/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/20 text-2xl border border-red-500/30 text-red-400 shrink-0">
                🛡️
              </span>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <span>{isEn ? "Administrator Portal" : "لوحة إدارة وتحكم المنصة"}</span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                    Admin
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {isEn ? "Full operational and financial control over the platform" : "الوصول الكامل لإدارة الطلبات، المدفوعات، والمستخدمين"}
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-red-500 hover:bg-red-600 px-5 py-2.5 text-xs font-black text-white transition-all shadow-md active:scale-95 shrink-0"
            >
              <span>{isEn ? "Open Admin Panel" : "فتح لوحة الإدارة"}</span>
              <span>{isEn ? "→" : "←"}</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            <Link
              href="/admin"
              className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-3 text-center transition-all group"
            >
              <div className="text-lg mb-1 group-hover:scale-110 transition-transform">🧾</div>
              <div className="text-xs font-bold text-white">{isEn ? "Orders & Reviews" : "الطلبات والمراجعة"}</div>
            </Link>
            <Link
              href="/admin/payment-settings"
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 p-3 text-center transition-all group"
            >
              <div className="text-lg mb-1 group-hover:scale-110 transition-transform">💳</div>
              <div className="text-xs font-bold text-emerald-300">{isEn ? "Payment Gateways" : "أرقام الدفع والحسابات"}</div>
            </Link>
            <Link
              href="/admin/users"
              className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-3 text-center transition-all group col-span-2 sm:col-span-1"
            >
              <div className="text-lg mb-1 group-hover:scale-110 transition-transform">👥</div>
              <div className="text-xs font-bold text-white">{isEn ? "Users Management" : "إدارة المستخدمين"}</div>
            </Link>
          </div>
        </div>
      )}

      {/* 1. Profile Identity Hero Card */}
      <div className="rounded-3xl border border-black/5 dark:border-teal-900/30 bg-white/95 dark:bg-[#0d1614] backdrop-blur-xl p-6 sm:p-7 mb-5 shadow-sm relative overflow-hidden">
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-teal-500/10 blur-2xl" />

        <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
          <div className="shrink-0">
            <AvatarPicker name={name || null} email={props.email} avatarUrl={props.avatarUrl} />
          </div>

          <div className="flex-1 text-center sm:text-start min-w-0 w-full">
            {/* Badges row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 text-teal-800 dark:text-teal-300 text-xs font-black">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isEn ? "Verified Active Member" : "عضو موثق ونشط"}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 shadow-xs">
                {studentLevel}
              </span>
            </div>

            {/* Name + Edit */}
            {editingName ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEditingName(false);
                  save({ name });
                }}
                className="flex items-center justify-center sm:justify-start gap-2 max-w-sm mb-2"
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 text-base font-bold border-2 border-teal-500 bg-white dark:bg-neutral-800 rounded-xl px-3 py-1.5 text-neutral-900 dark:text-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-teal-600 hover:bg-teal-500 px-4 py-2 text-xs font-black text-white shadow-xs"
                >
                  {isEn ? "Save" : "حفظ"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingName(false)}
                  className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  {isEn ? "Cancel" : "إلغاء"}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
                  {name || (isEn ? "Champion Learner" : "بطل طوّرني")}
                </h2>
                <button
                  onClick={() => setEditingName(true)}
                  className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-bold hover:underline px-2.5 py-1 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-transparent hover:border-teal-500/20 transition-all"
                  title={isEn ? "Edit display name" : "تعديل الاسم"}
                >
                  <span>✏️</span>
                  <span>{isEn ? "Edit" : "تعديل"}</span>
                </button>
              </div>
            )}

            {/* Email */}
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <span>✉️</span>
              <span className="truncate">{props.email}</span>
            </div>
          </div>
        </div>

        {/* Gamified 2-Card XP & Streak Bar */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-black/5 dark:border-white/5">
          <div className="bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/40 dark:to-neutral-900/90 rounded-2xl p-3.5 text-center border border-teal-500/30 shadow-xs relative overflow-hidden">
            <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono flex items-center justify-center gap-1.5">
              <span>💎</span>
              <span>{props.totalXp}</span>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 font-bold mt-1">
              {isEn ? "Earned XP" : "نقاط الخبرة XP"}
            </div>
          </div>

          <div className="bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/40 dark:to-neutral-900/90 rounded-2xl p-3.5 text-center border border-amber-500/30 shadow-xs relative overflow-hidden">
            <div className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono flex items-center justify-center gap-1.5">
              <span className="animate-pulse">🔥</span>
              <span>{props.streak}</span>
            </div>
            <div className="text-xs text-neutral-600 dark:text-neutral-300 font-bold mt-1">
              {isEn ? "Day Streak" : "أيام متتالية"}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subscription & Access Card */}
      <div className="rounded-3xl border border-black/5 dark:border-teal-900/30 bg-white/95 dark:bg-[#0d1614] backdrop-blur-xl p-6 sm:p-7 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <span>💳</span>
            <span>{isEn ? "Membership & Access Plan" : "خطة العضوية والاشتراك"}</span>
          </span>
          {props.subscription && (
            <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {isEn ? "Active 1-Year Access" : "اشتراك نشط لمدة عام"}
            </span>
          )}
        </div>

        {props.subscription ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-base font-black text-neutral-900 dark:text-white">
                {isEn ? `${brand.nameEn} Pro · Unlimited 1-Year Membership` : `${brand.name} برو · اشتراك سنوي شامل الـ 100 مسار`}
              </p>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              {paymentLabel} · {props.subscription.amountEgp} {isEn ? "EGP (All 100 Tracks Unlocked)" : "جنيه (كافة الـ 100 مسار مفتوحة بالكامل)"}
            </p>

            {/* VIP Status Badge */}
            <div className="mt-4 rounded-2xl border p-3.5 flex items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-900/60 border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">👑</span>
                <div>
                  <p className="text-xs font-black text-neutral-900 dark:text-white">
                    {props.subscription.amountEgp >= 440
                      ? isEn ? "VIP Vault Unlocked (+1,000 Prompts & Contracts)" : "خزنة VIP مفعلة (+1,000 برومبت وعقود الفريلانس)"
                      : isEn ? "VIP Vault Upgrade Available (+99 EGP)" : "ترقية خزنة VIP متاحة (+99 ج.م فقط)"}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    {props.subscription.amountEgp >= 440
                      ? isEn ? "Lifetime access to enterprise prompts & legal contracts" : "وصول دائم لأوامر الذكاء الاصطناعي وعقود العمل الحر"
                      : isEn ? "Unlock the 1,000 prompts bank and legal contract pack" : "احصل على بنك الأوامر وعقود العمل الحر لحماية أتعابك"}
                  </p>
                </div>
              </div>

              <Link
                href="/app/vip-vault"
                className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all ${
                  props.subscription.amountEgp >= 440
                    ? "bg-amber-400 text-neutral-950 hover:bg-amber-300"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                }`}
              >
                {props.subscription.amountEgp >= 440
                  ? (isEn ? "Open Vault ↗" : "دخول الخزنة ↗")
                  : (isEn ? "Upgrade ↗" : "ترقية الحساب ↗")}
              </Link>
            </div>

            {/* Guarantee and Support badge */}
            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-teal-700 dark:text-teal-300 font-bold flex items-center gap-1.5">
                <span>🛡️</span>
                <span>{isEn ? "7-Day Money-Back Guarantee Included" : "مشمول بضمان استرداد كامل خلال 7 أيام"}</span>
              </span>
              <a
                href={`https://wa.me/2${payment.supportWhatsapp}`}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>💬</span>
                <span>{isEn ? "VIP WhatsApp Support" : "الدعم الفني المباشر"}</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black text-neutral-900 dark:text-white">
                {isEn ? "Free Preview Mode (Day 1 Unlocked)" : "عضوية تجريبية (اليوم الأول مجاني في كل مسار)"}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {isEn ? "Upgrade to unlock all 100 tracks with 7-day guarantee." : "اشترك الآن لفتح كافة الـ 100 مسار مع ضمان استرجاع 7 أيام."}
              </p>
            </div>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-black text-xs shadow-md shadow-teal-500/20 active:scale-95 transition-all shrink-0"
            >
              {isEn ? "Upgrade to Pro →" : "اشترك في برو الآن ←"}
            </Link>
          </div>
        )}
      </div>

      {/* 3. Learning Preferences Card */}
      <div className="rounded-3xl border border-black/5 dark:border-teal-900/30 bg-white/95 dark:bg-[#0d1614] backdrop-blur-xl p-6 sm:p-7 mb-5 shadow-sm">
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <span>⚙️</span>
          <span>{isEn ? "Learning Habits & Preferences" : "تفضيلات العادة اليومية والتعلّم"}</span>
        </p>

        {/* Daily Pace Options */}
        <p className="text-xs font-black text-neutral-800 dark:text-neutral-200 mb-2.5">
          {isEn ? "Daily Time Commitment:" : "الالتزام الزمني اليومي المقترح:"}
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {PACE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setPace(opt.value);
                save({ dailyPaceMinutes: opt.value });
              }}
              className={`rounded-2xl border p-3.5 text-center transition-all ${
                pace === opt.value
                  ? "border-teal-500 bg-gradient-to-b from-teal-50 to-white dark:from-teal-950/40 dark:to-neutral-900 text-teal-950 dark:text-teal-300 font-black shadow-sm ring-2 ring-teal-500/20 scale-102"
                  : "border-black/5 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 hover:border-teal-500/30"
              }`}
            >
              <div className="text-lg mb-1">{opt.icon}</div>
              <p className="text-xs font-black">{isEn ? opt.labelEn : opt.labelAr}</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">{isEn ? opt.subEn : opt.subAr}</p>
            </button>
          ))}
        </div>

        {/* Focus Pillar Chips */}
        <p className="text-xs font-black text-neutral-800 dark:text-neutral-200 mb-2.5">
          {isEn ? "Your Primary Focus Pillar:" : "المجال أو الركن الأكثر أهمية لك حالياً:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFocus(opt.value);
                save({ focusCategory: opt.value });
              }}
              className={`inline-flex items-center gap-1.5 text-xs rounded-full px-3.5 py-1.5 border transition-all ${
                focus === opt.value
                  ? "border-teal-500 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-black shadow-xs ring-1 ring-teal-500/30"
                  : "border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-400 hover:border-teal-500/30"
              }`}
            >
              <span>{opt.icon}</span>
              <span>{isEn ? opt.labelEn : opt.labelAr}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Security & Password Card */}
      <div className="rounded-3xl border border-black/5 dark:border-teal-900/30 bg-white/95 dark:bg-[#0d1614] backdrop-blur-xl p-6 sm:p-7 mb-6 shadow-sm">
        <p className="mb-3 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <span>🔒</span>
          <span>{isEn ? "Account Security" : "الأمان وكلمة السر"}</span>
        </p>
        <ChangePassword />
      </div>

      {/* 5. Sign Out Button */}
      <button
        onClick={signOut}
        disabled={saving}
        className="w-full text-center border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-black rounded-full py-3.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-98 transition-all shadow-xs"
      >
        {isEn ? "Sign Out from Account" : "تسجيل الخروج من الحساب"}
      </button>

      {/* Footer Assurance */}
      <div className="mt-8 text-center text-xs text-neutral-400 space-y-1">
        <p>
          {isEn ? "Tawwerni Educational Platform · Protected by 7-Day Guarantee" : "منصة طوّرني للتعليم العملي · مشمولة بضمان استرداد 7 أيام"}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/privacy" className="hover:text-teal-600 underline">{isEn ? "Privacy" : "الخصوصية"}</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-teal-600 underline">{isEn ? "Terms" : "الشروط"}</Link>
          <span>•</span>
          <Link href="/refund" className="hover:text-teal-600 underline">{isEn ? "Refund Policy" : "الاسترجاع"}</Link>
        </div>
      </div>
    </div>
  );
}
