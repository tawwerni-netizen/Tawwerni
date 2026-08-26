/**
 * The user's picture, or a generated tile when they haven't set one.
 *
 * The fallback isn't a grey silhouette. It's their own initials on a gradient
 * derived from their email, so the same person always gets the same tile — an
 * account without a photo still looks like an account rather than a gap.
 *
 * Colours are literal, not Tailwind `from-*`/`to-*` pairs: the first version
 * used `from-brand-500`, a shade that doesn't exist in this theme, so Tailwind
 * emitted no gradient and the avatar was a white letter on nothing.
 */

type Tile = { from: string; to: string; glow: string };

const TILES: Tile[] = [
  { from: "#22b98a", to: "#075e49", glow: "34,185,138" },
  { from: "#f59e0b", to: "#b45309", glow: "245,158,11" },
  { from: "#38bdf8", to: "#3730a3", glow: "56,189,248" },
  { from: "#fb7185", to: "#9d174d", glow: "251,113,133" },
  { from: "#34d399", to: "#0f766e", glow: "52,211,153" },
  { from: "#a78bfa", to: "#5b21b6", glow: "167,139,250" },
  { from: "#fbbf24", to: "#c2410c", glow: "251,191,36" },
  { from: "#2dd4bf", to: "#155e75", glow: "45,212,191" },
];

function tileFor(seed: string): Tile {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TILES[h % TILES.length];
}

/**
 * Up to two initials.
 *
 * "أحمد محمد" reads better as أم than as a lone أ — but a single-word name or
 * a bare email address falls back to one character rather than inventing one.
 */
function initialsOf(name: string | null | undefined, email: string): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (email[0] ?? "؟").toUpperCase();
}

export default function Avatar({
  name,
  email,
  avatarUrl,
  size = 36,
  className = "",
  glow = false,
}: {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  /** Adds a soft coloured halo — for the large avatar on the account page. */
  glow?: boolean;
}) {
  if (avatarUrl) {
    return (
      // Plain <img>: the source is a data URI, which next/image can't optimise
      // and doesn't need to — it's already been resized in the browser.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name ?? "صورتك"}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={`avatar-tile shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  const tile = tileFor(email);
  const initials = initialsOf(name, email);

  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        // Two layers: a soft highlight from the top-left so the tile reads as a
        // rounded object rather than a flat disc, then the colour itself.
        backgroundImage: `radial-gradient(circle at 30% 22%, rgba(255,255,255,.38), transparent 58%), linear-gradient(140deg, ${tile.from}, ${tile.to})`,
        fontSize: Math.round(size * (initials.length > 1 ? 0.36 : 0.44)),
        ...(glow ? { boxShadow: `0 8px 24px -8px rgba(${tile.glow},.55)` } : {}),
      }}
      className={`avatar-tile grid shrink-0 place-items-center rounded-full font-bold tracking-tight text-white ${className}`}
    >
      {initials}
    </span>
  );
}
