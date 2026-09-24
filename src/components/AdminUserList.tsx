"use client";

import { useMemo, useState } from "react";
import AdminUserRow, { type AdminUserRowData } from "@/components/AdminUserRow";
import { useI18n } from "./LanguageContext";

type Filter = "all" | "paid" | "pending" | "free" | "active";

const FILTERS: { key: Filter; labelAr: string; labelEn: string }[] = [
  { key: "all", labelAr: "الكل", labelEn: "All" },
  { key: "pending", labelAr: "في الانتظار", labelEn: "Pending" },
  { key: "paid", labelAr: "مشتركين", labelEn: "Subscribers" },
  { key: "active", labelAr: "نشِطين", labelEn: "Active" },
  { key: "free", labelAr: "مجاني", labelEn: "Free" },
];

/**
 * Search and filter over the learner list.
 *
 * Full bilingual support (Arabic / English) and dark/light modes.
 */
export default function AdminUserList({ users }: { users: AdminUserRowData[] }) {
  const { lang } = useI18n();
  const isEn = lang === "en";

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
          placeholder={isEn ? "Search by name, email, or phone number..." : "ابحث بالإيميل أو الاسم أو رقم الموبايل…"}
          className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f.key
                  ? "bg-teal-600 text-white shadow-xs font-bold"
                  : "border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              <span>{isEn ? f.labelEn : f.labelAr}</span>
              <span className={`${isEn ? "ml-1.5" : "mr-1.5"} text-[10px] opacity-75`}>({counts[f.key]})</span>
            </button>
          ))}
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-8 text-center text-sm text-neutral-400 shadow-xs">
          {query
            ? isEn
              ? `No matching results for "${query}"`
              : `مفيش نتيجة لـ "${query}"`
            : isEn
            ? "No accounts in this category."
            : "مفيش حسابات في القسم ده."}
        </p>
      ) : (
        <>
          <p className="mb-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
            {isEn ? `Showing ${shown.length} of ${users.length} accounts` : `معروض ${shown.length} من ${users.length} حساب`}
          </p>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {shown.map((u) => (
              <AdminUserRow key={u.id} user={u} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
