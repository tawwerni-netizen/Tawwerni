import Link from "next/link";

/**
 * One track in the home grid.
 *
 * Carries its own progress, so the grid answers "where am I in each of these"
 * at a glance rather than being six identical cards. The ring fills as days are
 * completed; the track currently being worked on is marked, because that is the
 * one piece of state the learner looks for first.
 */
export default function CourseTile({
  slug,
  title,
  category,
  icon,
  total,
  done,
  unlocked,
  isActive,
}: {
  slug: string;
  title: string;
  category: string;
  icon: string;
  total: number;
  done: number;
  unlocked: boolean;
  isActive: boolean;
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done >= total;

  return (
    <Link
      href={`/app/learn/${slug}`}
      className={`tile-press relative block rounded-xl border bg-white p-3 text-center ${
        isActive ? "border-brand-400" : "border-black/5"
      }`}
    >
      {isActive && (
        <span className="absolute right-2 top-2 rounded-full bg-brand-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
          شغّال
        </span>
      )}
      {complete && (
        <span className="absolute right-2 top-2 text-sm" title="خلصته">
          🎓
        </span>
      )}

      <div className="mb-1 text-xl" aria-hidden>
        {icon}
      </div>
      <div className="truncate text-xs font-bold" title={title}>
        {category}
      </div>

      <div className="mt-2">
        <div className="progress-track" role="presentation">
          <span className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-1 text-[10px] text-neutral-400">
          {done}/{total} يوم
        </div>
      </div>

      <div className="mt-1 text-[10px] text-brand-600">
        {unlocked ? "مفتوح ✓" : "ضمن الاشتراك"}
      </div>
    </Link>
  );
}
