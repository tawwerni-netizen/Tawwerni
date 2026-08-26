"use client";

import { useState } from "react";
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
 * One learner in the admin list, with the password controls attached.
 *
 * There is no "show password" here and there never will be — passwords are
 * one-way scrypt hashes, so there is nothing to show. What the owner actually
 * needs when a customer says "I can't get in" is a way to get them back in,
 * which is what these two buttons do.
 */
export default function AdminUserRow({ user }: { user: AdminUserRowData }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [temp, setTemp] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

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
    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <div className="mb-2 flex items-start gap-3">
        <Avatar name={user.name} email={user.email} avatarUrl={user.avatarUrl} size={40} />

        <div className="min-w-0 flex-1">
          <p className="truncate font-bold" dir="ltr">
            {user.email}
          </p>
          <p className="text-sm text-neutral-500">
            {user.name ?? "بدون اسم"}
            {user.phone && (
              <span dir="ltr" className="mr-2 text-neutral-400">
                · {user.phone}
              </span>
            )}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          {user.isAdmin && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-800">
              أدمن
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              user.paid
                ? "bg-green-50 text-green-700"
                : user.pending
                  ? "bg-amber-50 text-amber-700"
                  : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {user.paid ? "مشترك" : user.pending ? "في الانتظار" : "مجاني"}
          </span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-4 gap-2 rounded-xl bg-neutral-50 p-2 text-center">
        <Mini label="XP" value={user.totalXp} />
        <Mini label="دروس" value={user.lessonsDone} />
        <Mini label="متتالية" value={`${user.streak}🔥`} />
        <Mini label="اشترك" value={fmt(user.joined)} small />
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
          </div>
        )}
      </div>
    </div>
  );
}

function Mini({ label, value, small }: { label: string; value: number | string; small?: boolean }) {
  return (
    <div>
      <div className={`font-bold text-neutral-700 ${small ? "text-xs" : "text-sm"}`}>{value}</div>
      <div className="text-xs text-neutral-400">{label}</div>
    </div>
  );
}
