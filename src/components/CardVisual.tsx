"use client";

/**
 * The graphic that sits at the top of a lesson card.
 *
 * A lesson card is mostly text, and a wall of text is the fastest way to lose
 * someone on day one. This picks a visual from the card's own content — a big
 * number when the card leads with a statistic, a comparison when it contrasts
 * two things, a checklist when it enumerates — so the picture always says
 * something true about the words underneath it, never decorates them.
 */

type Visual =
  | { kind: "stat"; value: string; caption: string }
  | { kind: "versus"; left: string; right: string }
  | { kind: "steps"; items: string[] }
  | { kind: "checklist"; items: { text: string; good: boolean }[] }
  | { kind: "none" };

/** Arabic-Indic and Western digits both appear in the content. */
const DIGITS = /[\d٠-٩]/;

function toWestern(s: string): string {
  return s.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

/**
 * Pulls a headline statistic out of a heading like "٣٠٠ مليون+".
 * Only fires when the heading is mostly the number itself — otherwise a
 * lesson that merely mentions a year would sprout a giant meaningless figure.
 */
function asStat(heading: string, firstLine: string): Visual | null {
  const trimmed = heading.trim();
  if (!DIGITS.test(trimmed)) return null;
  if (trimmed.length > 22) return null;

  const words = trimmed.split(/\s+/);
  if (words.length > 3) return null;

  return {
    kind: "stat",
    value: trimmed,
    caption: firstLine.split("—")[0].trim().slice(0, 70),
  };
}

/**
 * Only "X مقابل Y" — an explicit comparison.
 *
 * "مش" and "بدل" were tried here and had to go: in Arabic they are usually
 * negation or substitution inside a single phrase, not a separator. A heading
 * like "إيه اللي مش صح عن الذكاء الاصطناعي" was being split into two halves
 * that meant nothing on their own.
 */
function asVersus(heading: string): Visual | null {
  const m = heading.match(/^(.{3,24}?)\s+مقابل\s+(.{3,24})$/);
  if (!m) return null;

  // Both sides must stand alone as a phrase, not read as a sentence fragment.
  const [, left, right] = m;
  if (/^(إيه|ليه|إزاي|مين|امتى)/.test(left.trim())) return null;

  return { kind: "versus", left: left.trim(), right: right.trim() };
}

/** Lines that are each a short labelled item read better as a checklist. */
function asChecklist(lines: string[]): Visual | null {
  const marked = lines.filter((l) => /^[✅❌✓✗×]/.test(l.trim()));
  if (marked.length < 2) return null;
  return {
    kind: "checklist",
    items: marked.slice(0, 4).map((l) => ({
      text: l.replace(/^[✅❌✓✗×]\s*/, "").trim().slice(0, 60),
      good: /^[✅✓]/.test(l.trim()),
    })),
  };
}

/** Numbered lines ("١. …") are a real sequence worth drawing as one. */
function asSteps(lines: string[]): Visual | null {
  const numbered = lines.filter((l) => /^\s*[١٢٣٤٥1-5][.．)]/.test(l));
  if (numbered.length < 3) return null;
  return {
    kind: "steps",
    items: numbered.slice(0, 4).map((l) => l.replace(/^\s*[١٢٣٤٥1-5][.．)]\s*/, "").trim().slice(0, 34)),
  };
}

export function pickVisual(heading: string, lines: string[]): Visual {
  return (
    asVersus(heading) ??
    asStat(heading, lines[0] ?? "") ??
    asChecklist(lines) ??
    asSteps(lines) ?? { kind: "none" }
  );
}

/**
 * True when the graphic already renders the heading, so the card below should
 * drop it rather than printing the same words twice.
 */
export function visualConsumesHeading(heading: string, lines: string[]): boolean {
  const v = pickVisual(heading, lines);
  return v.kind === "stat" || v.kind === "versus";
}

export default function CardVisual({ heading, lines }: { heading: string; lines: string[] }) {
  const v = pickVisual(heading, lines);
  if (v.kind === "none") return null;

  if (v.kind === "stat") {
    return (
      <Frame>
        <div className="relative px-5 py-7 text-center">
          {/*
            No background-clip:text here. It crops Arabic descenders — "مليون"
            lost the tail of its ن. A solid colour with a soft glow reads just
            as strong and can't clip.
          */}
          <div className="stat-figure text-5xl font-bold" dir="auto">
            {v.value}
          </div>
          {v.caption && (
            <p className="vis-caption mx-auto mt-2 max-w-[26ch] text-xs leading-relaxed">
              {v.caption}
            </p>
          )}
        </div>
      </Frame>
    );
  }

  if (v.kind === "versus") {
    return (
      <Frame>
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 p-4">
          <Side label={v.left} tone="no" />
          <div className="vis-caption grid place-items-center px-1 text-xs font-bold">مقابل</div>
          <Side label={v.right} tone="yes" />
        </div>
      </Frame>
    );
  }

  if (v.kind === "checklist") {
    return (
      <Frame>
        <ul className="space-y-1.5 p-4">
          {v.items.map((item, i) => (
            <li
              key={i}
              className="animate-rise flex items-start gap-2 text-xs leading-relaxed"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] ${
                  item.good ? "vis-mark-yes" : "vis-mark-no"
                }`}
              >
                {item.good ? "✓" : "✕"}
              </span>
              {/*
                A ✕ line here is a misconception the lesson is correcting — it is
                the point of the card, not something to skim past. It used to be
                dimmed and struck through, which made the main content the least
                readable thing on screen. The icon carries the meaning now.
              */}
              <span className="vis-item">{item.text}</span>
            </li>
          ))}
        </ul>
      </Frame>
    );
  }

  return (
    <Frame>
      <ol className="flex flex-col gap-0 p-4">
        {v.items.map((item, i) => (
          <li
            key={i}
            className="animate-rise flex items-center gap-3"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="flex flex-col items-center self-stretch">
              <span className="vis-step grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold">
                {i + 1}
              </span>
              {i < v.items.length - 1 && <span className="w-px flex-1 bg-brand-200/60" />}
            </div>
            <span className="vis-item py-1 text-xs leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-rise mb-4 overflow-hidden rounded-2xl border border-brand-200/40 bg-gradient-to-br from-brand-50 to-transparent">
      {children}
    </div>
  );
}

function Side({ label, tone }: { label: string; tone: "yes" | "no" }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center text-xs font-bold leading-snug ${
        tone === "yes"
          ? "vis-side-yes"
          : "vis-side-no"
      }`}
    >
      {label}
    </div>
  );
}
