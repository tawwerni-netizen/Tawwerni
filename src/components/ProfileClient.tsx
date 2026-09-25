"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/content/brand";
import AvatarPicker from "@/components/AvatarPicker";
import ChangePassword from "@/components/ChangePassword";
import { useI18n } from "./LanguageContext";

const PACE_OPTIONS = [
  { value: 5, labelAr: "شرارة", labelEn: "Spark", subAr: "٥ دقايق/يوم", subEn: "5 min/day" },
  { value: 10, labelAr: "زخم", labelEn: "Momentum", subAr: "١٠ دقايق/يوم", subEn: "10 min/day" },
  { value: 15, labelAr: "اندفاع", labelEn: "Accelerate", subAr: "١٥ دقيقة/يوم", subEn: "15 min/day" },
];

const FOCUS_OPTIONS = [
  { value: "all", labelAr: "جميع الـ 100 مسار", labelEn: "All 100 Tracks" },
  { value: "ai-prompting", labelAr: "الذكاء الاصطناعي وهندسة الأوامر", labelEn: "AI & Prompt Engineering" },
  { value: "software-dev", labelAr: "البرمجة وتطوير الويب", labelEn: "Software & Web Dev" },
  { value: "data-analytics", labelAr: "تحليل البيانات والذكاء التجاري", labelEn: "Data Analytics & BI" },
  { value: "freelancing", labelAr: "العمل الحر وبناء الوكالات", labelEn: "Freelancing & Client Acquisition" },
  { value: "digital-marketing", labelAr: "التسويق الرقمي ونمو المبيعات", labelEn: "Digital Marketing & Growth" },
  { value: "design-media", labelAr: "التصميم الإبداعي والميديا", labelEn: "UI/UX & Creative Media" },
  { value: "business-startups", labelAr: "ريادة الأعمال وبناء المشاريع", labelEn: "Business & Startups" },
  { value: "cybersecurity", labelAr: "الأمن السيبراني وحماية البيانات", labelEn: "Cybersecurity & Privacy" },
  { value: "leadership-negotiation", labelAr: "المهارات القيادية والتفاوض", labelEn: "Leadership & Negotiation" },
  { value: "productivity-mindset", labelAr: "الإنتاجية وإدارة الذات", labelEn: "Productivity & Mindset" },
];

function formatPaymentMethod(rawMethod: string | undefined, isEn: boolean) {
  if (!rawMethod) return isEn ? "Lifetime Access" : "وصول مدى الحياة";
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

  return (
    <div className="mx-auto max-w-2xl px-4 pt-7 sm:pt-9 pb-12" dir={isEn ? "ltr" : "rtl"}>
      <h1 className="text-2xl font-black mb-1 text-neutral-900 dark:text-neutral-100">
        {isEn ? "My Account" : "حسابي الشخصي"}
      </h1>
      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        {isEn ? "Manage your profile, learning commitment, and account settings." : "إدارة حسابك وتفضيلات التعلّم والأمان."}
      </p>

      {/* 1. Profile Picture Card */}
      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-3xl p-5 mb-5 shadow-xs">
        <AvatarPicker name={name || null} email={props.email} avatarUrl={props.avatarUrl} />
      </div>

      {/* 2. Name & Email Card */}
      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-3xl p-5 mb-5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex-1 min-w-0">
          {editingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditingName(false);
                save({ name });
              }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 text-sm border border-black/10 dark:border-white/10 dark:bg-neutral-800 rounded-xl px-3 py-2 text-neutral-900 dark:text-neutral-100"
              />
              <button type="submit" className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white shadow-xs">
                {isEn ? "Save" : "حفظ"}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
                {name || (isEn ? "Set your name" : "حدد اسمك")}
              </p>
              <button
                onClick={() => setEditingName(true)}
                className="tap px-2 py-1 text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline"
              >
                {isEn ? "Edit" : "تعديل"}
              </button>
            </div>
          )}
          <p className="text-xs text-neutral-400 font-mono mt-0.5 truncate">{props.email}</p>
        </div>
      </div>

      {/* 3. Subscription & Access Card */}
      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-3xl p-5 mb-5 shadow-xs">
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
          {isEn ? "Membership & Access" : "اشتراكي"}
        </p>
        {props.subscription ? (
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                {isEn ? `${brand.nameEn} Pro · Lifetime Access` : `${brand.name} برو · وصول دائم مدى الحياة`}
              </p>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {paymentLabel} · {props.subscription.amountEgp} {isEn ? "EGP (All 100 Tracks Unlocked)" : "جنيه (جميع الـ 100 مسار مفتوحة)"}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                {isEn ? "Free Preview Mode" : "عضوية مجانية (يوم 1 مفتوح)"}
              </p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isEn ? "Upgrade to unlock all 100 tracks permanently" : "اشترك لفتح جميع الـ 100 مسار مدى الحياة"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Learning Preferences Card */}
      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-3xl p-5 mb-5 shadow-xs">
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
          {isEn ? "Learning Preferences" : "تفضيلات التعلّم"}
        </p>
        
        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {isEn ? "Daily Time Commitment:" : "الالتزام اليومي:"}
        </p>
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {PACE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setPace(opt.value);
                save({ dailyPaceMinutes: opt.value });
              }}
              className={`rounded-2xl border p-3 text-center transition-all ${
                pace === opt.value
                  ? "border-brand-600 bg-brand-50/70 dark:bg-brand-950/40 text-brand-900 dark:text-brand-300 font-bold shadow-xs scale-102"
                  : "border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-black/20"
              }`}
            >
              <p className="text-xs font-extrabold">{isEn ? opt.labelEn : opt.labelAr}</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">{isEn ? opt.subEn : opt.subAr}</p>
            </button>
          ))}
        </div>

        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          {isEn ? "Preferred Discipline / Pillar:" : "المجال أو الركن المفضل:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFocus(opt.value);
                save({ focusCategory: opt.value });
              }}
              className={`text-xs rounded-full px-3.5 py-1.5 border transition-all ${
                focus === opt.value
                  ? "border-brand-600 bg-brand-50/80 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300 font-bold shadow-xs"
                  : "border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-black/20"
              }`}
            >
              {isEn ? opt.labelEn : opt.labelAr}
            </button>
          ))}
        </div>
      </div>

      {/* 5. XP & Streak Highlights */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 text-center shadow-xs">
          <div className="font-mono text-xl font-black text-brand-800 dark:text-brand-400">{props.totalXp}</div>
          <div className="text-[11px] text-neutral-400 font-medium mt-0.5">{isEn ? "Total XP" : "إجمالي XP"}</div>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl py-3.5 text-center shadow-xs">
          <div className="font-mono text-xl font-black text-amber-500">{props.streak} 🔥</div>
          <div className="text-[11px] text-neutral-400 font-medium mt-0.5">{isEn ? "Day Streak" : "أيام متتالية"}</div>
        </div>
      </div>

      {/* 6. Security & Password */}
      <div className="mb-6 rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
        <p className="mb-3 text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          {isEn ? "Account Security" : "الأمان وكلمة السر"}
        </p>
        <ChangePassword />
      </div>

      {/* 7. Sign Out Button */}
      <button
        onClick={signOut}
        disabled={saving}
        className="w-full text-center border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-full py-3.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-98 transition-all"
      >
        {isEn ? "Sign Out" : "تسجيل الخروج"}
      </button>
    </div>
  );
}
