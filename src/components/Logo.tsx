import Link from "next/link";

/**
 * The brand mark.
 *
 * An upward arrow cut out of a rounded tile — the negative space reads as both
 * a rising line and a stylised "ط". Drawn as inline SVG rather than an emoji or
 * image so it stays crisp at any size, inherits the theme, and costs no request.
 */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="طوّرني"
      className={className}
    >
      <defs>
        <linearGradient id="tw-tile" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--brand-400)" />
          <stop offset="55%" stopColor="var(--brand-600)" />
          <stop offset="100%" stopColor="var(--brand-900)" />
        </linearGradient>
        {/* A soft sheen across the upper-left, so the tile reads as a solid object. */}
        <linearGradient id="tw-sheen" x1="0" y1="0" x2="26" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="13" fill="url(#tw-tile)" />
      <rect width="48" height="48" rx="13" fill="url(#tw-sheen)" />

      {/* Rising path — three steps climbing to the right. */}
      <path
        d="M13 32.5 L20.5 25 L26 30.5 L35.5 19"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead, opened rather than closed so it stays light at small sizes. */}
      <path
        d="M30 18.5 L36 18.5 L36 24.5"
        stroke="#ffffff"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* The dot of the ط — the one accent that isn't white. */}
      <circle cx="13" cy="16" r="2.6" fill="var(--brand-100)" />
    </svg>
  );
}

/** Mark plus wordmark, used in headers. */
export function Logo({
  size = 32,
  showWord = true,
  className = "",
}: {
  size?: number;
  showWord?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark size={size} />
      {showWord && (
        <span className="text-lg font-bold leading-none text-brand-800">
          طوّرني
          <span className="text-brand-400">.com</span>
        </span>
      )}
    </span>
  );
}

/**
 * The header logo: alive, and a way home.
 *
 * The tile breathes on a long slow cycle and a highlight sweeps across it every
 * so often, so the corner of the screen is never completely static — but the
 * motion is slow and low-contrast enough to sit behind reading. Hovering makes
 * it lift and the arrow redraw, which is the affordance that it's a link.
 *
 * Every part of this is inside `prefers-reduced-motion` guards in globals.css:
 * a decorative loop that cannot be turned off is a real accessibility problem,
 * not a style preference.
 */
export function LogoLink({
  size = 34,
  showWord = true,
  href = "/app",
  className = "",
}: {
  size?: number;
  showWord?: boolean;
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="طوّرني — الصفحة الرئيسية"
      className={`logo-link group inline-flex items-center gap-2 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${className}`}
    >
      <span className="logo-tile relative inline-block">
        <LogoMark size={size} />
        <span className="logo-gleam" aria-hidden />
      </span>
      {showWord && (
        <span className="text-lg font-bold leading-none text-brand-800">
          طوّرني
          <span className="text-brand-400">.com</span>
        </span>
      )}
    </Link>
  );
}
