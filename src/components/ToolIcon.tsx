type ToolKey =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "copilot"
  | "midjourney"
  | "perplexity"
  | "canva"
  | "notion"
  | "dalle"
  | "elevenlabs"
  | "zapier"
  | "excel"
  | "powerpoint"
  | "word";

const TOOL_META: Record<ToolKey, { label: string; bg: string; fg: string }> = {
  chatgpt: { label: "ChatGPT", bg: "#0f9d78", fg: "#ffffff" },
  claude: { label: "Claude", bg: "#d97757", fg: "#ffffff" },
  gemini: { label: "Gemini", bg: "#1f6feb", fg: "#ffffff" },
  copilot: { label: "Copilot", bg: "#0a5ca8", fg: "#ffffff" },
  midjourney: { label: "Midjourney", bg: "#111827", fg: "#ffffff" },
  perplexity: { label: "Perplexity", bg: "#0f7c8a", fg: "#ffffff" },
  canva: { label: "Canva", bg: "#00c4cc", fg: "#08343a" },
  notion: { label: "Notion", bg: "#111827", fg: "#ffffff" },
  dalle: { label: "DALL·E", bg: "#7c3aed", fg: "#ffffff" },
  elevenlabs: { label: "ElevenLabs", bg: "#111827", fg: "#ffffff" },
  zapier: { label: "Zapier", bg: "#ff4f00", fg: "#ffffff" },
  excel: { label: "Excel", bg: "#136c3a", fg: "#ffffff" },
  powerpoint: { label: "PowerPoint", bg: "#b7472a", fg: "#ffffff" },
  word: { label: "Word", bg: "#1a4f96", fg: "#ffffff" },
};

function Glyph({ tool, fg }: { tool: ToolKey; fg: string }) {
  switch (tool) {
    case "chatgpt":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5.4 16.6 8v5.2L12 15.8 7.4 13.2V8z" />
          <path d="M12 5.4v4.3l4.6 2.6M12 9.7 7.4 12.3M12 15.8v-3.5" />
        </g>
      );
    case "claude":
      return (
        <g fill={fg}>
          <path d="M9.6 6.3h1.9l3.1 11.4h-2l-.7-2.8H9.2l-.7 2.8h-2zM9.7 13h2.9l-1.4-5.3z" opacity="0.95" />
        </g>
      );
    case "gemini":
      return (
        <path
          d="M12 4.4c.5 3.6 3.6 6.7 7.2 7.2v.8c-3.6.5-6.7 3.6-7.2 7.2h-.8c-.5-3.6-3.6-6.7-7.2-7.2v-.8c3.6-.5 6.7-3.6 7.2-7.2z"
          fill={fg}
        />
      );
    case "copilot":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.7" strokeLinecap="round">
          <path d="M5 13.5c0-3 2-5.5 4.5-5.5S13 10 13 13.5" />
          <path d="M11 13.5c0-3 2-5.5 4.5-5.5S19 10.5 19 13.5" />
          <path d="M5 13.5c0 2.2 3 3.5 7 3.5s7-1.3 7-3.5" />
        </g>
      );
    case "midjourney":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c2-6 5-9.5 9-10.5-1.5 3-1.5 6 0 8.5-2.5.5-5 1.2-9 2z" />
          <path d="M12.5 14.5c2.5.3 4.5 1 6.5 2.5-.5-4-2-7-5-9" />
        </g>
      );
    case "perplexity":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.6" strokeLinecap="round">
          <circle cx="11" cy="11" r="4.6" />
          <path d="M14.6 14.6 19 19" />
        </g>
      );
    case "canva":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="7" />
          <path d="M14.4 9.8c-1.6-1.4-4.2-.6-4.6 1.8-.4 2.3 1.7 3.9 3.5 2.9" />
        </g>
      );
    case "notion":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round">
          <rect x="5.5" y="5" width="13" height="14" rx="2" />
          <path d="M9 15V9l6 6V9" strokeLinecap="round" />
        </g>
      );
    case "dalle":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round">
          <rect x="5" y="5.5" width="14" height="13" rx="2.5" />
          <circle cx="9.5" cy="10" r="1.4" fill={fg} stroke="none" />
          <path d="M5.5 16.5 10 12l3 3 2.5-2.2 3 3" strokeLinecap="round" />
        </g>
      );
    case "elevenlabs":
      return (
        <g stroke={fg} strokeWidth="1.8" strokeLinecap="round">
          <path d="M7 9.5v5M10.3 7v10M13.7 8.5v7M17 10.5v3" />
        </g>
      );
    case "zapier":
      return (
        <path d="M12 4.5 13.7 10h5.8l-4.7 3.4 1.8 5.6L12 15.6 7.4 19l1.8-5.6L4.5 10h5.8z" fill={fg} />
      );
    case "excel":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="5.5" width="14" height="13" rx="2" />
          <path d="M5 10h14M10.5 5.5v13" />
          <path d="M13.2 12.4 16.4 16M16.4 12.4 13.2 16" />
        </g>
      );
    case "powerpoint":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4.5" y="5.5" width="15" height="10" rx="2" />
          <path d="M12 15.5v3M9 18.5h6" />
          <circle cx="12" cy="10.5" r="2.4" />
        </g>
      );
    case "word":
      return (
        <g fill="none" stroke={fg} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="5.5" width="14" height="13" rx="2" />
          <path d="M8.2 9.5 10 14.5l2-3.6 2 3.6 1.8-5" />
        </g>
      );
  }
}

export function ToolIcon({ tool, size = 40 }: { tool: string; size?: number }) {
  const key = tool.toLowerCase() as ToolKey;
  const meta = TOOL_META[key];
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center justify-center rounded-xl shrink-0"
      style={{ width: size, height: size, background: meta.bg }}
      title={meta.label}
      aria-label={meta.label}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" aria-hidden="true">
        <Glyph tool={key} fg={meta.fg} />
      </svg>
    </span>
  );
}

export function ToolChip({ tool }: { tool: string }) {
  const key = tool.toLowerCase() as ToolKey;
  const meta = TOOL_META[key];
  if (!meta) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white border border-black/5 pr-1.5 pl-3 py-1">
      <ToolIcon tool={tool} size={22} />
      <span className="text-xs font-bold text-neutral-700">{meta.label}</span>
    </span>
  );
}

export const KNOWN_TOOLS = Object.keys(TOOL_META);

export function detectTools(text: string): string[] {
  const map: Record<string, ToolKey> = {
    chatgpt: "chatgpt",
    "شات جي": "chatgpt",
    claude: "claude",
    كلود: "claude",
    gemini: "gemini",
    جيميني: "gemini",
    copilot: "copilot",
    midjourney: "midjourney",
    perplexity: "perplexity",
    canva: "canva",
    notion: "notion",
    "dall": "dalle",
    elevenlabs: "elevenlabs",
    zapier: "zapier",
    excel: "excel",
    powerpoint: "powerpoint",
  };
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [needle, key] of Object.entries(map)) {
    if (lower.includes(needle)) found.add(key);
  }
  return [...found];
}
