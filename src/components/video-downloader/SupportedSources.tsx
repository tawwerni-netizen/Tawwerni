import type { Dict } from "@/components/video-downloader/lib/i18n";

const SOURCES = [
  "YouTube",
  "TikTok",
  "Instagram",
  "X",
  "Vimeo",
  "Reddit",
  "Facebook",
];

/**
 * Named sources are the ones with dedicated handling. Everything else is
 * attempted with generic extraction, so the copy says "and many more" rather
 * than implying a closed list.
 */
export function SupportedSources({ dict }: { dict: Dict }) {
  return (
    <div className="animate-in flex flex-col items-center gap-3 text-center">
      <span className="muted text-xs font-semibold uppercase tracking-wider">
        {dict.hero.supported}
      </span>

      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
        {SOURCES.map((source) => (
          <li key={source} className="chip">
            {source}
          </li>
        ))}
        <li className="muted px-1 text-sm">{dict.hero.supportedMore}</li>
      </ul>
    </div>
  );
}
