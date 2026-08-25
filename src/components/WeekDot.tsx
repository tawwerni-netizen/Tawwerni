/**
 * One day in the week strip.
 *
 * A thin ring carrying the day's first Arabic letter. A completed day fills the
 * ring and draws a progress arc around it; today gets a soft halo. The letter
 * stays visible in every state so the row reads as a week even at a glance.
 */
export default function WeekDot({
  label,
  done,
  isToday,
  index,
}: {
  label: string;
  done: boolean;
  isToday: boolean;
  index: number;
}) {
  const letter = label.trim().charAt(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-10 w-10" style={{ animationDelay: `${index * 55}ms` }}>
        {/* Completed days get a drawn ring; the SVG sits behind the letter. */}
        {done && (
          <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-draw text-brand-600"
              pathLength={100}
            />
          </svg>
        )}

        {/*
          The letter carries the whole meaning of the dot, so it never gets
          dimmed below reading contrast — a future day is quieter than today,
          not invisible.
        */}
        <div
          className={`relative flex h-full w-full items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
            done
              ? "animate-pop weekdot-done"
              : isToday
                ? "animate-pulse-glow weekdot-today"
                : "weekdot-future"
          }`}
        >
          {letter}
        </div>

        {done && (
          <span className="absolute -bottom-0.5 -left-0.5 grid h-4 w-4 place-items-center rounded-full bg-brand-600 text-[9px] text-white shadow-sm">
            ✓
          </span>
        )}
      </div>

      <span
        className={`text-xs ${isToday ? "font-bold text-brand-700" : "text-neutral-400"}`}
      >
        {label}
      </span>
    </div>
  );
}
