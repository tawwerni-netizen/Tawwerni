"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brand } from "@/content/brand";
import AvatarPicker from "@/components/AvatarPicker";
import ChangePassword from "@/components/ChangePassword";

const PACE_OPTIONS = [
  { value: 5, label: "شرارة", sub: "٥ دقايق/يوم" },
  { value: 10, label: "زخم", sub: "١٠ دقايق/يوم" },
  { value: 15, label: "اندفاع", sub: "١٥ دقيقة/يوم" },
];

const FOCUS_OPTIONS = [
  { value: "ai-tech", label: "الذكاء الاصطناعي والتقنية" },
  { value: "success-mindset", label: "نمط النجاح" },
  { value: "career", label: "النمو المهني" },
  { value: "business", label: "الأعمال" },
  { value: "project-management", label: "إدارة المشاريع" },
  { value: "health", label: "الصحة والطاقة" },
  { value: "all", label: "كل التصنيفات" },
];

const METHOD_LABELS: Record<string, string> = {
  vodafone_cash: "فودافون كاش",
  instapay: "إنستاباي",
  visa: "فيزا/ماستركارد",
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

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-xl font-bold mb-1">حسابي</h1>
      <p className="text-sm text-neutral-500 mb-5">إدارة حسابك وتفضيلاتك</p>

      <div className="bg-white border border-black/5 rounded-2xl p-4 mb-4">
        <AvatarPicker name={name || null} email={props.email} avatarUrl={props.avatarUrl} />
      </div>

      <div className="bg-white border border-black/5 rounded-2xl p-4 mb-4 flex items-center gap-3">
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
                className="flex-1 text-sm border border-black/10 rounded-lg px-2 py-1"
              />
              <button type="submit" className="text-xs text-brand-600 font-bold">
                حفظ
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm">{name || "حدد اسمك"}</p>
              <button onClick={() => setEditingName(true)} className="tap px-1 py-1 text-[11px] text-brand-600">
                تعديل
              </button>
            </div>
          )}
          <p className="text-xs text-neutral-400 truncate">{props.email}</p>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-2xl p-4 mb-4">
        <p className="text-xs font-bold text-neutral-500 mb-2">اشتراكي</p>
        {props.subscription ? (
          <>
            <p className="text-sm font-bold">{brand.name} برو</p>
            <p className="text-xs text-neutral-400 mt-1">
              {METHOD_LABELS[props.subscription.method] ?? props.subscription.method} · {props.subscription.amountEgp} جنيه
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-400">مفيش اشتراك نشط دلوقتي</p>
        )}
      </div>

      <div className="bg-white border border-black/5 rounded-2xl p-4 mb-4">
        <p className="text-xs font-bold text-neutral-500 mb-3">تفضيلات التعلّم</p>
        <p className="text-[11px] text-neutral-400 mb-2">الالتزام اليومي</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {PACE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setPace(opt.value);
                save({ dailyPaceMinutes: opt.value });
              }}
              className={`rounded-xl border p-2 text-center ${
                pace === opt.value ? "border-brand-600 bg-brand-50" : "border-black/10"
              }`}
            >
              <p className="text-xs font-bold">{opt.label}</p>
              <p className="text-[10px] text-neutral-400">{opt.sub}</p>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-neutral-400 mb-2">التصنيف المفضل</p>
        <div className="flex flex-wrap gap-2">
          {FOCUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setFocus(opt.value);
                save({ focusCategory: opt.value });
              }}
              className={`text-xs rounded-full px-3 py-1.5 border ${
                focus === opt.value ? "border-brand-600 bg-brand-50 text-brand-800" : "border-black/10 text-neutral-500"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="bg-white border border-black/5 rounded-xl py-3 text-center">
          <div className="font-bold text-brand-800">{props.totalXp}</div>
          <div className="text-[10px] text-neutral-400">إجمالي XP</div>
        </div>
        <div className="bg-white border border-black/5 rounded-xl py-3 text-center">
          <div className="font-bold text-brand-800">{props.streak} 🔥</div>
          <div className="text-[10px] text-neutral-400">أيام متتالية</div>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-black/5 bg-white p-4">
        <p className="mb-3 text-xs font-bold text-neutral-500">الأمان</p>
        <ChangePassword />
      </div>

      <button
        onClick={signOut}
        disabled={saving}
        className="w-full text-center border border-red-200 text-red-600 font-bold rounded-full py-3 text-sm"
      >
        تسجيل خروج
      </button>
    </div>
  );
}
