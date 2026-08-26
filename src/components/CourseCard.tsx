import Link from "next/link";

/**
 * A course in the catalogue.
 *
 * Built to reward the cursor: the whole card lifts, a wash of the brand colour
 * sweeps in behind it, the icon tile scales and tilts, and an arrow slides out
 * from the edge. On a phone none of that fires — there is no hover — so the
 * card carries its own weight through the progress bar and the badge instead.
 */
export default function CourseCard({
  slug,
  title,
  description,
  icon,
  badge,
  totalLessons,
  totalXp,
  done,
  unlocked,
  index,
}: {
  slug: string;
  title: string;
  description: string;
  icon: string;
  badge: string | null;
  totalLessons: number;
  totalXp: number;
  done: number;
  unlocked: boolean;
  index: number;
}) {
  const pct = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  const started = done > 0;
  const complete = totalLessons > 0 && done >= totalLessons;

  return (
    <Link
      href={`/app/learn/${slug}`}
      className="course-card animate-rise group"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <span className="course-card-wash" aria-hidden />

      <span className="course-card-icon" aria-hidden>
        {icon}
      </span>

      <span className="course-card-body">
        <span className="mb-1 flex flex-wrap items-center gap-2">
          <span className="course-card-title">{title}</span>
          {complete ? (
            <span className="course-chip course-chip-done">🎓 خلصته</span>
          ) : badge ? (
            <span className="course-chip">{badge}</span>
          ) : null}
        </span>

        <span className="course-card-desc">{description}</span>

        <span className="course-card-meta">
          {totalLessons} درس · {totalXp} XP
          {!unlocked && <span className="course-card-lock"> · 🔒 ضمن الاشتراك</span>}
        </span>

        {started && (
          <span className="mt-2 block">
            <span className="progress-track">
              <span className="progress-fill" style={{ width: `${pct}%` }} />
            </span>
            <span className="course-card-progress">
              {done}/{totalLessons} · {pct}٪
            </span>
          </span>
        )}
      </span>

      <span className="course-card-go" aria-hidden>
        ←
      </span>
    </Link>
  );
}
