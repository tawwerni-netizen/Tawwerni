/**
 * The user's picture, or their initial when they haven't set one.
 *
 * The fallback isn't a grey silhouette — it's their own letter on a colour
 * derived from their email, so the same person always gets the same tile and
 * an account without a photo still looks like an account, not a gap.
 */

/**
 * Written as explicit gradients rather than Tailwind `from-*`/`to-*` pairs.
 *
 * The first version used `from-brand-500 to-brand-700`; neither shade exists in
 * this project's theme, so Tailwind emitted no gradient at all and the avatar
 * was a white letter on a transparent tile — invisible in the light header.
 * Literal colours can't fail that way.
 */
const TILES = [
  "linear-gradient(135deg,#1d9e75,#085041)",
  "linear-gradient(135deg,#f59e0b,#d97706)",
  "linear-gradient(135deg,#0ea5e9,#4f46e5)",
  "linear-gradient(135deg,#f43f5e,#be185d)",
  "linear-gradient(135deg,#10b981,#0f766e)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
];

function tileFor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TILES[h % TILES.length];
}

export default function Avatar({
  name,
  email,
  avatarUrl,
  size = 36,
  className = "",
}: {
  name?: string | null;
  email: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
}) {
  const letter = (name?.trim() || email)[0]?.toUpperCase() ?? "؟";

  if (avatarUrl) {
    return (
      // Plain <img>: the source is a data URI or an uploaded blob, both of
      // which next/image would have to be told about host by host.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name ?? "صورتك"}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ring-2 ring-white/40 ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        backgroundImage: tileFor(email),
      }}
      className={`grid shrink-0 place-items-center rounded-full font-bold text-white ring-2 ring-white/25 ${className}`}
    >
      {letter}
    </span>
  );
}
