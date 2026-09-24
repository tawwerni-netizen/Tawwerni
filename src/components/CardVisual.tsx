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
  | { kind: "quote"; text: string }
  | { kind: "keywords"; items: { icon: string; text: string }[] }
  | { kind: "arrow"; from: string; to: string }
  | { kind: "accent"; icon: string; heading: string }
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

/** "من X لـ Y" — a change of state, drawn as a transition. */
function asArrow(heading: string): Visual | null {
  const m = heading.match(/^من\s+(.{2,20}?)\s+(?:لـ?|إلى|ل)\s*(.{2,20})$/);
  if (!m) return null;
  return { kind: "arrow", from: m[1].trim(), to: m[2].trim() };
}

/**
 * Lines that are each "مصطلح: شرح" read as a glossary rather than prose.
 * Needs at least two, or a single colon in a sentence would trigger it.
 */
function asKeywords(lines: string[]): Visual | null {
  const pairs = lines
    .map((l) => l.match(/^\s*(?:[-•*]\s*)?([^:：]{2,22})\s*[:：]\s*(.{6,})$/))
    .filter(Boolean) as RegExpMatchArray[];

  if (pairs.length < 2) return null;

  const ICONS = ["🔹", "🔸", "🔷", "🔶"];
  return {
    kind: "keywords",
    items: pairs.slice(0, 4).map((m, i) => ({
      icon: ICONS[i % ICONS.length],
      text: m[1].trim(),
    })),
  };
}

/**
 * A pull quote, for cards that really are one statement.
 *
 * The first cut of this fired on any opening line between 25 and 110
 * characters, which turned out to be three quarters of every card in the
 * course. A treatment that appears on three quarters of cards is not emphasis,
 * it's the new body text — so this now only fires when the card genuinely IS a
 * single short thought: one or two lines, and a sentence that ends.
 */
function asQuote(heading: string, lines: string[]): Visual | null {
  if (lines.length === 0 || lines.length > 2) return null;

  const first = lines[0].trim();
  if (first.length < 30 || first.length > 90) return null;

  // A list item or a labelled line belongs to another visual.
  if (/^[-•*✅❌✓✗×\d١٢٣٤٥]/.test(first)) return null;
  if (/[:：]/.test(first)) return null;

  // A trailing comma means the thought continues into the next line.
  if (/[،,]$/.test(first)) return null;

  // Only when the heading isn't already carrying the card.
  if (heading.trim().length > 40) return null;

  return { kind: "quote", text: first };
}

/**
 * The floor: every info card gets *something*.
 *
 * A page of unbroken Arabic body text is what the learner called boring, and
 * the earlier heuristics only fire on cards shaped a particular way. This picks
 * an icon from what the heading is about and sets it as a banner — not
 * decoration for its own sake, but a marker that tells you at a glance what
 * kind of card you're on.
 */
const TOPIC_ICONS: [RegExp, string][] = [
  [/ذكاء|اصطناعي|AI|روبوت|نموذج/i, "🤖"],
  [/فلوس|دخل|ربح|سعر|تسعير|ميزانية|جنيه/, "💰"],
  [/وقت|يوم|ساعة|دقيقة|جدول|ميعاد/, "⏱️"],
  [/صحة|نوم|أكل|تغذية|رياضة|جسم|طاقة/, "💚"],
  [/عميل|زبون|سوق|بيع|تسويق/, "🎯"],
  [/شغل|وظيفة|مهنة|مدير|فريق|شركة/, "💼"],
  [/عادة|عادات|انضباط|تركيز|إرادة|هوية/, "🧠"],
  [/خطأ|غلط|خطر|حذر|مشكلة|فخ/, "⚠️"],
  [/خطوة|طريقة|إزاي|كيف|ابدأ/, "🧭"],
  [/مثال|تطبيق|جرّب|نفّذ/, "🛠️"],
  [/سؤال|ليه|إيه|فرق/, "💡"],
];

function asAccent(heading: string): Visual | null {
  const h = heading.trim();
  if (!h || h.length > 60) return null;
  for (const [re, icon] of TOPIC_ICONS) {
    if (re.test(h)) return { kind: "accent", icon, heading: h };
  }
  return { kind: "accent", icon: "📌", heading: h };
}

export function pickVisual(heading: string, lines: string[]): Visual {
  return (
    asVersus(heading) ??
    asArrow(heading) ??
    asStat(heading, lines[0] ?? "") ??
    asChecklist(lines) ??
    asSteps(lines) ??
    asKeywords(lines) ??
    asQuote(heading, lines) ??
    asAccent(heading) ?? { kind: "none" }
  );
}

/**
 * True when the graphic already renders the heading, so the card below should
 * drop it rather than printing the same words twice.
 */
export function visualConsumesHeading(heading: string, lines: string[]): boolean {
  const v = pickVisual(heading, lines);
  return v.kind === "stat" || v.kind === "versus" || v.kind === "arrow" || v.kind === "accent";
}

/**
 * True when the graphic already shows the card's first line, so the body drops
 * it rather than printing the same words again immediately underneath.
 *
 * Covers the stat card too: its caption IS the first line, and leaving both in
 * made the big-number card read the same sentence twice in a row.
 */
export function visualConsumesFirstLine(heading: string, lines: string[]): boolean {
  const v = pickVisual(heading, lines);
  if (v.kind === "quote") return true;
  // Only when the caption wasn't truncated — a cut-off caption still needs the
  // full line underneath it.
  if (v.kind === "stat") return v.caption.length > 0 && lines[0]?.trim().startsWith(v.caption);
  return false;
}

function getTopicArtwork(icon: string) {
  switch (icon) {
    case "🤖":
      return {
        label: "الذكاء الاصطناعي والتكنولوجيا · AI Tech",
        color: "from-teal-600 to-emerald-800",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-teal-400 fill-none" strokeWidth="1.5">
            <circle cx="60" cy="60" r="40" strokeDasharray="4 4" />
            <circle cx="60" cy="60" r="18" className="fill-teal-500/20" />
            <circle cx="30" cy="40" r="8" className="fill-emerald-500/30" />
            <circle cx="90" cy="40" r="8" className="fill-emerald-500/30" />
            <circle cx="60" cy="95" r="8" className="fill-teal-500/30" />
            <line x1="30" y1="40" x2="60" y2="60" />
            <line x1="90" y1="40" x2="60" y2="60" />
            <line x1="60" y1="95" x2="60" y2="60" />
          </svg>
        ),
      };
    case "💰":
      return {
        label: "المال والبيزنس والنمو · Business & Finance",
        color: "from-emerald-600 to-teal-800",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-emerald-400 fill-none" strokeWidth="1.5">
            <polyline points="20,95 45,70 70,80 100,35" strokeWidth="2.5" />
            <polyline points="85,35 100,35 100,50" strokeWidth="2.5" />
            <rect x="25" y="75" width="10" height="20" className="fill-emerald-500/20" />
            <rect x="50" y="60" width="10" height="35" className="fill-emerald-500/20" />
            <rect x="75" y="45" width="10" height="50" className="fill-emerald-500/30" />
          </svg>
        ),
      };
    case "⏱️":
      return {
        label: "إدارة الوقت والإنتاجية · Productivity",
        color: "from-amber-600 to-orange-800",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-amber-400 fill-none" strokeWidth="1.5">
            <circle cx="60" cy="60" r="45" />
            <circle cx="60" cy="60" r="38" strokeDasharray="3 3" />
            <polyline points="60,30 60,60 80,60" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="10" x2="60" y2="15" strokeWidth="3" />
            <line x1="110" y1="60" x2="105" y2="60" strokeWidth="3" />
            <line x1="60" y1="110" x2="60" y2="105" strokeWidth="3" />
            <line x1="10" y1="60" x2="15" y2="60" strokeWidth="3" />
          </svg>
        ),
      };
    case "💚":
      return {
        label: "الصحة والطاقة الحيوية · Vitality & Health",
        color: "from-green-600 to-emerald-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-green-400 fill-none" strokeWidth="1.5">
            <path d="M15,60 Q35,60 45,60 L50,40 L55,80 L65,30 L75,70 L80,60 Q95,60 105,60" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="60" cy="60" r="45" strokeDasharray="6 6" />
          </svg>
        ),
      };
    case "🎯":
      return {
        label: "التسويق والمبيعات والعملاء · Growth & Marketing",
        color: "from-rose-600 to-pink-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-rose-400 fill-none" strokeWidth="1.5">
            <circle cx="60" cy="60" r="45" />
            <circle cx="60" cy="60" r="30" />
            <circle cx="60" cy="60" r="15" className="fill-rose-500/20" />
            <line x1="10" y1="60" x2="110" y2="60" strokeDasharray="2 4" />
            <line x1="60" y1="10" x2="60" y2="110" strokeDasharray="2 4" />
          </svg>
        ),
      };
    case "💼":
      return {
        label: "المسار المهني والقيادة · Career & Leadership",
        color: "from-blue-600 to-indigo-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-blue-400 fill-none" strokeWidth="1.5">
            <rect x="25" y="40" width="70" height="50" rx="8" />
            <path d="M45,40 V28 Q45,25 48,25 H72 Q75,25 75,28 V40" strokeWidth="2" />
            <line x1="25" y1="58" x2="95" y2="58" />
            <circle cx="60" cy="68" r="4" className="fill-blue-400" />
          </svg>
        ),
      };
    case "🧠":
      return {
        label: "العقلية وعلم النفس السلوكي · Mindset Psychology",
        color: "from-purple-600 to-violet-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-purple-400 fill-none" strokeWidth="1.5">
            <path d="M60,25 C40,25 25,40 25,60 C25,75 35,88 50,92 L50,98 H70 L70,92 C85,88 95,75 95,60 C95,40 80,25 60,25 Z" />
            <path d="M45,50 Q60,40 75,50" />
            <path d="M40,65 Q60,55 80,65" />
            <line x1="60" y1="25" x2="60" y2="92" strokeDasharray="2 4" />
          </svg>
        ),
      };
    case "⚠️":
      return {
        label: "تنبيه وتحذير عملي · Critical Caution",
        color: "from-amber-600 to-red-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-amber-400 fill-none" strokeWidth="1.5">
            <path d="M60,20 L105,95 H15 Z" strokeWidth="2.5" />
            <line x1="60" y1="48" x2="60" y2="70" strokeWidth="3" strokeLinecap="round" />
            <circle cx="60" cy="82" r="3" className="fill-amber-400" />
          </svg>
        ),
      };
    case "🧭":
      return {
        label: "الاستراتيجية وخارطة الطريق · Strategy & Steps",
        color: "from-cyan-600 to-teal-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-cyan-400 fill-none" strokeWidth="1.5">
            <circle cx="60" cy="60" r="45" />
            <polygon points="60,25 67,53 95,60 67,67 60,95 53,67 25,60 53,53" className="fill-cyan-500/20" strokeWidth="1.5" />
          </svg>
        ),
      };
    case "🛠️":
      return {
        label: "التطبيق العملي والأدوات · Hands-on Tools",
        color: "from-indigo-600 to-blue-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-indigo-400 fill-none" strokeWidth="1.5">
            <path d="M35,45 L15,60 L35,75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M85,45 L105,60 L85,75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="68" y1="35" x2="52" y2="85" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ),
      };
    default:
      return {
        label: "مفتاح معرفي وتطبيقي · Key Insight",
        color: "from-brand-600 to-teal-900",
        svg: (
          <svg viewBox="0 0 120 120" className="w-24 h-24 stroke-teal-300 fill-none" strokeWidth="1.5">
            <circle cx="60" cy="50" r="28" />
            <path d="M48,78 H72 L68,88 H52 Z" />
            <line x1="55" y1="94" x2="65" y2="94" strokeWidth="2" />
            <line x1="60" y1="12" x2="60" y2="18" strokeLinecap="round" />
            <line x1="90" y1="26" x2="85" y2="30" strokeLinecap="round" />
            <line x1="30" y1="26" x2="35" y2="30" strokeLinecap="round" />
          </svg>
        ),
      };
  }
}

export default function CardVisual({ heading, lines }: { heading: string; lines: string[] }) {
  const v = pickVisual(heading, lines);
  if (v.kind === "none") return null;

  if (v.kind === "stat") {
    return (
      <Frame>
        <div className="relative px-5 py-7 text-center">
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

  if (v.kind === "accent") {
    const topicArtwork = getTopicArtwork(v.icon);
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-brand-500/20 bg-gradient-to-br from-neutral-900 via-neutral-900 to-brand-950 p-4 mb-4 shadow-lg text-white transition-all">
        {/* Ambient radial glow */}
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-emerald-500/15 blur-2xl" />

        {/* Decorative dynamic SVG vector pattern */}
        <div className="absolute inset-y-0 left-2 pointer-events-none opacity-25 flex items-center justify-end overflow-hidden">
          {topicArtwork.svg}
        </div>

        <div className="relative z-10 flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-700 text-2xl shadow-md ring-2 ring-white/10 group-hover:scale-105 transition-transform duration-300">
            {v.icon}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-300/90 mb-0.5">
              {topicArtwork.label}
            </span>
            <h2 className="text-sm md:text-base font-bold leading-snug text-white drop-shadow-sm">
              {v.heading}
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (v.kind === "arrow") {
    return (
      <Frame>
        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 p-4">
          <Side label={v.from} tone="no" />
          <div className="vis-arrow grid place-items-center px-1" aria-hidden>
            ←
          </div>
          <Side label={v.to} tone="yes" />
        </div>
      </Frame>
    );
  }

  if (v.kind === "quote") {
    return (
      <Frame>
        <blockquote className="relative px-6 py-6 text-center">
          <span className="vis-quote-mark" aria-hidden>
            ”
          </span>
          <p className="vis-quote-text">{v.text}</p>
        </blockquote>
      </Frame>
    );
  }

  if (v.kind === "keywords") {
    return (
      <Frame>
        <div className="flex flex-wrap justify-center gap-2 p-4">
          {v.items.map((item, i) => (
            <span
              key={i}
              className="vis-chip animate-rise"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span aria-hidden>{item.icon}</span>
              {item.text}
            </span>
          ))}
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
