"use client";

/**
 * One day in the week strip.
 *
 * A high-contrast, crystal-clear ring carrying the day's letter and label.
 * - Completed: drawn progress ring + checkmark badge
 * - Today: solid luminous teal fill + white bold letter + active ping beacon
 * - Future: clean neutral border with legible muted letter
 */
export default function WeekDot({
  label,
  letter,
  done,
  isToday,
  index,
}: {
  label: string;
  letter?: string;
  done: boolean;
  isToday: boolean;
  index: number;
}) {
  const displayLetter = letter || label.trim().charAt(0);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-10 w-10 flex items-center justify-center" style={{ animationDelay: `${index * 55}ms` }}>
        {/* Completed days get a drawn ring */}
        {done && (
          <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="#0d9488"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-draw text-teal-600"
              pathLength={100}
            />
          </svg>
        )}

        <div
          className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm font-extrabold transition-all duration-300 ${
            done
              ? "bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 shadow-xs"
              : isToday
                ? "bg-teal-600 text-white shadow-md ring-3 ring-teal-500/30 scale-105"
                : "bg-neutral-100/90 dark:bg-neutral-800/80 border border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {displayLetter}
        </div>

        {done && (
          <span className="absolute -bottom-0.5 -left-0.5 grid h-4 w-4 place-items-center rounded-full bg-teal-600 text-[9px] text-white shadow-sm font-bold">
            ✓
          </span>
        )}

        {isToday && !done && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5" title="Today">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
        )}
      </div>

      <span
        className={`text-[11px] transition-colors ${
          isToday
            ? "font-extrabold text-teal-700 dark:text-teal-300 scale-105"
            : "font-medium text-neutral-500 dark:text-neutral-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
