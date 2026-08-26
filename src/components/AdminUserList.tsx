"use client";

import { useMemo, useState } from "react";
import AdminUserRow, { type AdminUserRowData } from "@/components/AdminUserRow";

type Filter = "all" | "paid" | "pending" | "free" | "active";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "في الانتظار" },
  { key: "paid", label: "مشتركين" },
  { key: "active", label: "نشِطين" },
  { key: "free", label: "مجاني" },
];

/**
 * Search and filter over the learner list.
 *
 * At three hundred accounts a flat list is unusable — when a customer messages
 * on WhatsApp the owner needs to find *that* person by email or phone in a
 * couple of seconds, which is what this is for.
 */
export default function AdminUserList({ users }: { users: AdminUserRowData[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (filter === "paid" && !u.paid) return false;
      if (filter === "pending" && !u.pending) return false;
      if (filter === "free" && (u.paid || u.pending)) return false;
      if (filter === "active" && u.lessonsDone === 0) return false;

      if (!q) return true;
      // Phone digits are matched loosely so "1200 176" finds "01200176755".
      const digits = q.replace(/\D/g, "");
      return (
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q) ||
        (digits.length >= 3 && (u.phone ?? "").includes(digits))
      );
    });
  }, [users, query, filter]);

  const counts = useMemo(
    () => ({
      all: users.length,
      paid: users.filter((u) => u.paid).length,
      pending: users.filter((u) => u.pending).length,
      free: users.filter((u) => !u.paid && !u.pending).length,
      active: users.filter((u) => u.lessonsDone > 0).length,
    }),
    [users]
  );

  return (
    <div>
      <div className="mb-4 space-y-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالإيميل أو الاسم أو رقم الموبايل…"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none ring-brand-200 focus:ring-2"
        />

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`nav-pill rounded-full px-3 py-1.5 text-xs ${
                filter === f.key ? "nav-pill-on font-bold" : ""
              }`}
            >
              {f.label}
              <span className="mr-1.5 text-[10px] opacity-70">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-black/5 bg-white p-6 text-center text-sm text-neutral-400">
          {query ? `مفيش نتيجة لـ "${query}"` : "مفيش حسابات في القسم ده."}
        </p>
      ) : (
        <>
          <p className="mb-2 text-[11px] text-neutral-400">
            {shown.length} من {users.length}
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {shown.map((u) => (
              <AdminUserRow key={u.id} user={u} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
