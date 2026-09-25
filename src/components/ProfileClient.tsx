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
  { value: "ai-tech", labelAr: "الذكاء الاصطناعي والتقنية", labelEn: "AI & Tech" },
  { value: "success-mindset", labelAr: "نمط النجاح", labelEn: "Mindset" },
  { value: "career", labelAr: "النمو المهني", labelEn: "Career Growth" },
  { value: "business", labelAr: "الأعمال", labelEn: "Business & Growth" },
  { value: "project-management", labelAr: "إدارة المشاريع", labelEn: "Project Management" },
  { value: "health", labelAr: "الصحة والطاقة", labelEn: "Health & Vitality" },
  { value: "all", labelAr: "كل التصنيفات", labelEn: "All Tracks" },
];

const METHOD_LABELS_AR: Record<string, string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "إنستاباي",
  visa: "فيزا/ماستركارد",
};

const METHOD_LABELS_EN: Record<string, string> = {
  vodafone_cash: "Vodafone Cash",
  instapay: "InstaPay",
  visa: "Visa / Mastercard",
};

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
  const [focus, setFocus] = useState(props.focusCategory ?? "ai-tech");
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

  const methodLabel = isEn
    ? (props.subscription ? METHOD_LABELS_EN[props.subscription.method] ?? props.subscription.method : "")
    : (props.subscription ? METHOD_LABELS_AR[props.subscription.method] ?? props.subscription.method : "");

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">
        {isEn ? "My Account" : "حسابي"}
      </h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-5">
        {isEn ? "Manage your profile, pacing and preferences" : "إدارة حسابك وتفضيلاتك"}
      </p>

      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-4 shadow-xs">
        <AvatarPicker name={name || null} email={props.email} avatarUrl={props.avatarUrl} />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-4 flex items-center gap-3 shadow-xs">
        <div className="flex-1 min-w-0">
          {editingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditingName(false);
                save({ name });
              }}
              className="flex gap-2"
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 text-sm border border-black/10 dark:border-white/10 dark:bg-neutral-800 rounded-lg px-2.5 py-1 text-neutral-900 dark:text-neutral-100"
              />
              <button type="submit" className="text-xs text-brand-600 dark:text-brand-400 font-bold px-2 py-1">
                {isEn ? "Save" : "حفظ"}
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                {name || (isEn ? "Set your name" : "حدد اسمك")}
              </p>
              <button
                onClick={() => setEditingName(true)}
                className="tap px-1.5 py-1 text-[11px] text-brand-600 dark:text-brand-400 font-medium"
              >
                {isEn ? "Edit" : "تعديل"}
              </button>
            </div>
          )}
          <p className="text-xs text-neutral-400 truncate">{props.email}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-4 shadow-xs">
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-2">
          {isEn ? "My Subscription" : "اشتراكي"}
        </p>
        {props.subscription ? (
          <>
            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {brand.name} {isEn ? "Pro" : "برو"}
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              {methodLabel} · {props.subscription.amountEgp} {isEn ? "EGP" : "جنيه"}
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-400">
            {isEn ? "No active subscription right now" : "مفيش اشتراك نشط دلوقتي"}
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-4 shadow-xs">
        <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3">
          {isEn ? "Learning Preferences" : "تفضيلات التعلّم"}
        </p>
        <p className="text-[11px] text-neutral-400 mb-2">
          {isEn ? "Daily Commitment" : "الالتزام اليومي"}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {PACE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setPace(opt.value);
                save({ dailyPaceMinutes: opt.value });
              }}
              className={`rounded-xl border p-2 text-center transition-colors ${
                pace === opt.value
                  ? "border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300 font-bold"
                  : "border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 hover:border-black/20"
              }`}
            >
              <p className="text-xs font-bold">{isEn ? opt.labelEn : opt.labelAr}</p>
              <p className="text-[10px] text-neutral-400">{isEn ? opt.subEn : opt.subAr}</p>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-neutral-400 mb-2">
          {isEn ? "Preferred Category" : "التصنيف المفضل"}
        </p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFocus(opt.value);
                save({ focusCategory: opt.value });
              }}
              className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
                focus === opt.value
                  ? "border-brand-600 bg-brand-50 dark:bg-brand-950/40 text-brand-800 dark:text-brand-300 font-bold"
                  : "border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-black/20"
              }`}
            >
              {isEn ? opt.labelEn : opt.labelAr}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl py-3 text-center shadow-xs">
          <div className="font-bold text-brand-800 dark:text-brand-400">{props.totalXp}</div>
          <div className="text-[10px] text-neutral-400">{isEn ? "Total XP" : "إجمالي XP"}</div>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-black/5 dark:border-white/10 rounded-xl py-3 text-center shadow-xs">
          <div className="font-bold text-brand-800 dark:text-brand-400">{props.streak} 🔥</div>
          <div className="text-[10px] text-neutral-400">{isEn ? "Day Streak" : "أيام متتالية"}</div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-4 shadow-xs">
        <p className="mb-3 text-xs font-bold text-neutral-500 dark:text-neutral-400">
          {isEn ? "Security" : "الأمان"}
        </p>
        <ChangePassword />
      </div>

      <button
        onClick={signOut}
        disabled={saving}
        className="w-full text-center border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-full py-3 text-sm hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
      >
        {isEn ? "Sign Out" : "تسجيل خروج"}
      </button>
    </div>
  );
}
