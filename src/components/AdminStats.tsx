/**
 * The numbers that answer "how is the business doing" without scrolling.
 *
 * Each one carries a tone so the eye lands on what needs action first: an
 * amber count means somebody is waiting on you.
 */
export type AdminStat = {
  label: string;
  value: string | number;
  hint?: string;
  tone?: "neutral" | "good" | "warn";
  icon?: string;
};

export default function AdminStats({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className={`admin-stat admin-stat-${s.tone ?? "neutral"}`}>
          <div className="mb-1 flex items-center gap-1.5">
            {s.icon && (
              <span className="text-sm" aria-hidden>
                {s.icon}
              </span>
            )}
            <span className="admin-stat-label">{s.label}</span>
          </div>
          <div className="admin-stat-value">{s.value}</div>
          {s.hint && <div className="admin-stat-hint">{s.hint}</div>}
        </div>
      ))}
    </div>
  );
}
