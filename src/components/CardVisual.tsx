"use client";

import React from "react";
import { getTrackArtwork } from "@/content/track-artworks";
import { getTrackBySlug } from "@/content/tracks100";
import { useI18n } from "./LanguageContext";

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

/**
 * Pulls a headline statistic out of a heading like "٣٠٠ مليون+".
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
 */
function asVersus(heading: string): Visual | null {
  const m = heading.match(/^(.{3,24}?)\s+مقابل\s+(.{3,24})$/);
  if (!m) return null;

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
 */
function asQuote(heading: string, lines: string[]): Visual | null {
  if (lines.length === 0 || lines.length > 2) return null;

  const first = lines[0].trim();
  if (first.length < 30 || first.length > 90) return null;

  if (/^[-•*✅❌✓✗×\d١٢٣٤٥]/.test(first)) return null;
  if (/[:：]/.test(first)) return null;
  if (/[،,]$/.test(first)) return null;
  if (heading.trim().length > 40) return null;

  return { kind: "quote", text: first };
}

/**
 * Comprehensive topic classification to render rich, colorful thematic visual headers.
 */
const TOPIC_ICONS: [RegExp, string][] = [
  [/تحليل|بيانات|داتا|power\s*bi|tableau|excel|dashboard|لوحات|مؤشرات|إحصاء|data|bi|tableau/i, "📊"],
  [/ذكاء|اصطناعي|AI|روبوت|نموذج|prompt|gpt|llm|برومبت|neural/i, "🤖"],
  [/برمجة|كود|تطوير|موقع|ويب|react|javascript|python|frontend|backend|api|fullstack|software/i, "💻"],
  [/تصميم|figma|واجهات|ux|ui|فوتوشوب|جرافيك|ألوان|هوية|design|creative/i, "🎨"],
  [/فلوس|دخل|ربح|سعر|تسعير|ميزانية|جنيه|دولار|مال|تمويل|ثروة|finance|business|revenue/i, "💰"],
  [/عميل|زبون|سوق|بيع|تسويق|مبيعات|إعلانات|محتوى|funnel|marketing|sales/i, "🎯"],
  [/شغل|وظيفة|مهنة|مدير|فريق|شركة|عمل حر|freelance|career/i, "💼"],
  [/عادة|عادات|انضباط|تركيز|إرادة|هوية|نفس|عقل|تفكير|mindset|psychology/i, "🧠"],
  [/وقت|يوم|ساعة|دقيقة|جدول|ميعاد|إنتاجية|productivity|focus|time/i, "⏱️"],
  [/صحة|نوم|أكل|تغذية|رياضة|جسم|طاقة|حيوية|health|vitality/i, "💚"],
  [/خطأ|غلط|خطر|حذر|مشكلة|فخ|تجنب|تحذير|warning|caution/i, "⚠️"],
  [/خطوة|طريقة|إزاي|كيف|ابدأ|خارطة|مرحلة|roadmap|strategy/i, "🧭"],
  [/مثال|تطبيق|جرّب|نفّذ|تمرين|مشروع|أداة|أدوات|practice|hands-on/i, "🛠️"],
  [/سؤال|ليه|إيه|فرق|فكرة|مفتاح|insight/i, "💡"],
];

function asAccent(heading: string): Visual | null {
  const h = heading.trim();
  if (!h) return null;
  for (const [re, icon] of TOPIC_ICONS) {
    if (re.test(h)) return { kind: "accent", icon, heading: h };
  }
  return { kind: "accent", icon: "💡", heading: h };
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

export function visualConsumesHeading(heading: string, lines: string[]): boolean {
  const v = pickVisual(heading, lines);
  return v.kind === "stat" || v.kind === "versus" || v.kind === "arrow" || v.kind === "accent";
}

export function visualConsumesFirstLine(heading: string, lines: string[]): boolean {
  const v = pickVisual(heading, lines);
  if (v.kind === "quote") return true;
  if (v.kind === "stat") return v.caption.length > 0 && lines[0]?.trim().startsWith(v.caption);
  return false;
}

interface TopicArtwork {
  label: string;
  themeLight: string;
  themeDark: string;
  borderLight: string;
  borderDark: string;
  badgeGradient: string;
  glow: string;
  tagColor: string;
  svg: React.ReactNode;
}

function getTopicArtwork(icon: string): TopicArtwork {
  switch (icon) {
    case "📊":
      return {
        label: "تحليل البيانات واللوحات التفاعلية · Data Analytics & BI",
        themeLight: "from-teal-50 via-cyan-50/80 to-emerald-50",
        themeDark: "dark:from-[#062c31] dark:via-[#0a3a42] dark:to-[#041d22]",
        borderLight: "border-teal-200",
        borderDark: "dark:border-teal-500/40",
        badgeGradient: "from-teal-500 to-cyan-600",
        glow: "bg-teal-400/25",
        tagColor: "text-teal-700 dark:text-teal-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-teal-500 dark:stroke-teal-300 fill-none" strokeWidth="1.5">
            <defs>
              <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <rect x="20" y="70" width="16" height="35" rx="3" fill="url(#barGrad1)" strokeWidth="1" />
            <rect x="44" y="50" width="16" height="55" rx="3" fill="url(#barGrad2)" strokeWidth="1" />
            <rect x="68" y="32" width="16" height="73" rx="3" fill="url(#barGrad1)" strokeWidth="1" />
            <rect x="92" y="18" width="16" height="87" rx="3" fill="url(#barGrad2)" strokeWidth="1" />
            <path d="M28,65 Q56,40 76,28 T120,12" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
            <circle cx="100" cy="15" r="4" className="fill-teal-400 stroke-white dark:stroke-neutral-900" strokeWidth="1.5" />
            <circle cx="28" cy="65" r="3" className="fill-cyan-400" />
            <circle cx="76" cy="28" r="3" className="fill-emerald-400" />
          </svg>
        ),
      };
    case "🤖":
      return {
        label: "الذكاء الاصطناعي وهندسة الأوامر · AI & Intelligent Systems",
        themeLight: "from-indigo-50 via-purple-50/80 to-teal-50",
        themeDark: "dark:from-[#11193d] dark:via-[#192257] dark:to-[#0c122e]",
        borderLight: "border-indigo-200",
        borderDark: "dark:border-indigo-500/40",
        badgeGradient: "from-indigo-500 to-purple-600",
        glow: "bg-indigo-400/25",
        tagColor: "text-indigo-700 dark:text-indigo-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-indigo-400 dark:stroke-indigo-300 fill-none" strokeWidth="1.5">
            <defs>
              <linearGradient id="aiCore" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <circle cx="70" cy="60" r="38" strokeDasharray="4 4" />
            <circle cx="70" cy="60" r="22" fill="url(#aiCore)" />
            <circle cx="35" cy="35" r="8" className="fill-teal-400/30 stroke-teal-400" />
            <circle cx="105" cy="35" r="8" className="fill-purple-400/30 stroke-purple-400" />
            <circle cx="70" cy="100" r="8" className="fill-indigo-400/30 stroke-indigo-400" />
            <line x1="35" y1="35" x2="70" y2="60" stroke="#818cf8" strokeWidth="2" />
            <line x1="105" y1="35" x2="70" y2="60" stroke="#c084fc" strokeWidth="2" />
            <line x1="70" y1="100" x2="70" y2="60" stroke="#2dd4bf" strokeWidth="2" />
          </svg>
        ),
      };
    case "💻":
      return {
        label: "تطوير البرمجيات والويب · Software & Fullstack Dev",
        themeLight: "from-sky-50 via-blue-50/80 to-teal-50",
        themeDark: "dark:from-[#092238] dark:via-[#0e304f] dark:to-[#061828]",
        borderLight: "border-sky-200",
        borderDark: "dark:border-sky-500/40",
        badgeGradient: "from-sky-500 to-blue-600",
        glow: "bg-sky-400/25",
        tagColor: "text-sky-700 dark:text-sky-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-sky-400 dark:stroke-sky-300 fill-none" strokeWidth="1.5">
            <rect x="20" y="25" width="100" height="70" rx="8" className="fill-sky-500/10 stroke-sky-400" />
            <line x1="20" y1="42" x2="120" y2="42" strokeWidth="1" />
            <circle cx="32" cy="34" r="3" className="fill-rose-400" />
            <circle cx="42" cy="34" r="3" className="fill-amber-400" />
            <circle cx="52" cy="34" r="3" className="fill-emerald-400" />
            <path d="M40,65 L32,73 L40,81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M60,65 L68,73 L60,81" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="53" y1="62" x2="47" y2="84" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
      };
    case "🎨":
      return {
        label: "تصميم الواجهات وتجربة المستخدم · UI/UX & Creative Systems",
        themeLight: "from-rose-50 via-pink-50/80 to-purple-50",
        themeDark: "dark:from-[#2e0f2f] dark:via-[#3e143f] dark:to-[#210921]",
        borderLight: "border-rose-200",
        borderDark: "dark:border-rose-500/40",
        badgeGradient: "from-rose-500 to-pink-600",
        glow: "bg-rose-400/25",
        tagColor: "text-rose-700 dark:text-rose-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-pink-400 dark:stroke-pink-300 fill-none" strokeWidth="1.5">
            <path d="M30,85 C30,45 80,45 110,25" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="30" cy="85" r="4" className="fill-rose-400 stroke-white" strokeWidth="1.5" />
            <circle cx="110" cy="25" r="4" className="fill-purple-400 stroke-white" strokeWidth="1.5" />
            <rect x="55" y="55" width="45" height="40" rx="6" className="fill-pink-500/15 stroke-pink-400" />
            <circle cx="77" cy="75" r="8" className="fill-rose-500/30" />
          </svg>
        ),
      };
    case "💰":
      return {
        label: "المال والبيزنس والنمو المالي · Business, Finance & Wealth",
        themeLight: "from-emerald-50 via-teal-50/80 to-amber-50",
        themeDark: "dark:from-[#072d1e] dark:via-[#0d402b] dark:to-[#051e14]",
        borderLight: "border-emerald-200",
        borderDark: "dark:border-emerald-500/40",
        badgeGradient: "from-emerald-500 to-teal-600",
        glow: "bg-emerald-400/25",
        tagColor: "text-emerald-700 dark:text-emerald-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-emerald-400 fill-none" strokeWidth="1.5">
            <polyline points="25,95 55,68 80,78 115,30" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="98,30 115,30 115,48" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="40" cy="45" r="16" className="fill-amber-400/20 stroke-amber-400" strokeWidth="2" />
            <text x="35" y="51" fill="#f59e0b" fontSize="14" fontWeight="bold">$</text>
          </svg>
        ),
      };
    case "🎯":
      return {
        label: "التسويق وجذب العملاء · Growth Marketing & Sales",
        themeLight: "from-orange-50 via-amber-50/80 to-rose-50",
        themeDark: "dark:from-[#311808] dark:via-[#43220b] dark:to-[#210f04]",
        borderLight: "border-orange-200",
        borderDark: "dark:border-orange-500/40",
        badgeGradient: "from-orange-500 to-amber-600",
        glow: "bg-orange-400/25",
        tagColor: "text-orange-700 dark:text-orange-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-orange-400 fill-none" strokeWidth="1.5">
            <circle cx="70" cy="60" r="45" stroke="#f97316" strokeDasharray="3 3" />
            <circle cx="70" cy="60" r="30" stroke="#fb923c" />
            <circle cx="70" cy="60" r="15" className="fill-orange-500/30 stroke-orange-500" />
            <line x1="20" y1="60" x2="120" y2="60" stroke="#f97316" strokeDasharray="2 4" />
            <line x1="70" y1="10" x2="70" y2="110" stroke="#f97316" strokeDasharray="2 4" />
          </svg>
        ),
      };
    case "⏱️":
      return {
        label: "إدارة الوقت والإنتاجية الفائقة · Time Mastery & Flow",
        themeLight: "from-amber-50 via-yellow-50/80 to-teal-50",
        themeDark: "dark:from-[#2e1d06] dark:via-[#3c2608] dark:to-[#1e1302]",
        borderLight: "border-amber-200",
        borderDark: "dark:border-amber-500/40",
        badgeGradient: "from-amber-500 to-orange-600",
        glow: "bg-amber-400/25",
        tagColor: "text-amber-700 dark:text-amber-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-amber-400 fill-none" strokeWidth="1.5">
            <circle cx="70" cy="60" r="44" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="70" cy="60" r="36" stroke="#fbbf24" strokeDasharray="3 3" />
            <polyline points="70,32 70,60 92,60" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
            <circle cx="70" cy="60" r="4" className="fill-amber-500" />
          </svg>
        ),
      };
    case "🧠":
      return {
        label: "علم النفس السلوكي وصناعة العادات · Mindset Psychology",
        themeLight: "from-violet-50 via-purple-50/80 to-indigo-50",
        themeDark: "dark:from-[#1d0e3b] dark:via-[#2b1455] dark:to-[#130728]",
        borderLight: "border-violet-200",
        borderDark: "dark:border-violet-500/40",
        badgeGradient: "from-violet-500 to-purple-600",
        glow: "bg-violet-400/25",
        tagColor: "text-violet-700 dark:text-violet-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-violet-400 fill-none" strokeWidth="1.5">
            <path d="M70,20 C45,20 28,38 28,62 C28,80 40,94 58,98 L58,105 H82 L82,98 C100,94 112,80 112,62 C112,38 95,20 70,20 Z" stroke="#a78bfa" strokeWidth="2" />
            <path d="M52,50 Q70,38 88,50" stroke="#c084fc" strokeWidth="1.5" />
            <path d="M46,68 Q70,56 94,68" stroke="#c084fc" strokeWidth="1.5" />
            <line x1="70" y1="20" x2="70" y2="98" stroke="#8b5cf6" strokeDasharray="2 4" />
          </svg>
        ),
      };
    case "💚":
      return {
        label: "الصحة والطاقة الحيوية المستدامة · Vitality & Daily Energy",
        themeLight: "from-green-50 via-emerald-50/80 to-teal-50",
        themeDark: "dark:from-[#092a1b] dark:via-[#0e3b26] dark:to-[#051c11]",
        borderLight: "border-green-200",
        borderDark: "dark:border-green-500/40",
        badgeGradient: "from-green-500 to-emerald-600",
        glow: "bg-green-400/25",
        tagColor: "text-green-700 dark:text-green-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-green-400 fill-none" strokeWidth="1.5">
            <path d="M20,60 Q40,60 50,60 L56,40 L62,80 L72,28 L82,72 L88,60 Q105,60 120,60" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="70" cy="60" r="48" stroke="#86efac" strokeDasharray="4 4" />
          </svg>
        ),
      };
    case "⚠️":
      return {
        label: "تنبيه عملي وتجنب الأخطاء الشائعة · Reality Check & Caution",
        themeLight: "from-amber-50 via-rose-50/80 to-orange-50",
        themeDark: "dark:from-[#311808] dark:via-[#421e0a] dark:to-[#210d03]",
        borderLight: "border-amber-200",
        borderDark: "dark:border-amber-500/40",
        badgeGradient: "from-amber-500 to-rose-600",
        glow: "bg-amber-400/25",
        tagColor: "text-amber-700 dark:text-amber-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-amber-400 fill-none" strokeWidth="1.5">
            <path d="M70,18 L122,102 H18 Z" stroke="#f59e0b" strokeWidth="2.5" />
            <line x1="70" y1="48" x2="70" y2="74" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <circle cx="70" cy="88" r="3.5" className="fill-amber-400" />
          </svg>
        ),
      };
    case "🧭":
      return {
        label: "خارطة الطريق والاستراتيجية التنفيذية · Strategy & Milestones",
        themeLight: "from-cyan-50 via-teal-50/80 to-sky-50",
        themeDark: "dark:from-[#062931] dark:via-[#093742] dark:to-[#041a1f]",
        borderLight: "border-cyan-200",
        borderDark: "dark:border-cyan-500/40",
        badgeGradient: "from-cyan-500 to-teal-600",
        glow: "bg-cyan-400/25",
        tagColor: "text-cyan-700 dark:text-cyan-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-cyan-400 fill-none" strokeWidth="1.5">
            <circle cx="70" cy="60" r="45" stroke="#06b6d4" />
            <polygon points="70,25 78,52 105,60 78,68 70,95 62,68 35,60 62,52" className="fill-cyan-500/20 stroke-cyan-400" strokeWidth="1.5" />
          </svg>
        ),
      };
    case "🛠️":
      return {
        label: "التطبيق العملي والأدوات التنفيذية · Hands-on Execution",
        themeLight: "from-teal-50 via-emerald-50/80 to-cyan-50",
        themeDark: "dark:from-[#072d25] dark:via-[#0b3c32] dark:to-[#041e19]",
        borderLight: "border-teal-200",
        borderDark: "dark:border-teal-500/40",
        badgeGradient: "from-teal-500 to-emerald-600",
        glow: "bg-teal-400/25",
        tagColor: "text-teal-700 dark:text-teal-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-teal-400 fill-none" strokeWidth="1.5">
            <path d="M42,50 L20,65 L42,80" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M98,50 L120,65 L98,80" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="78" y1="38" x2="62" y2="92" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        ),
      };
    default:
      return {
        label: "مفتاح معرفي وتطبيقي · Key Strategic Insight",
        themeLight: "from-teal-50 via-emerald-50/80 to-cyan-50",
        themeDark: "dark:from-[#072c23] dark:via-[#0b3c31] dark:to-[#041d17]",
        borderLight: "border-teal-200",
        borderDark: "dark:border-teal-500/40",
        badgeGradient: "from-teal-500 to-emerald-600",
        glow: "bg-teal-400/25",
        tagColor: "text-teal-700 dark:text-teal-300",
        svg: (
          <svg viewBox="0 0 140 120" className="w-32 h-28 stroke-teal-400 fill-none" strokeWidth="1.5">
            <circle cx="70" cy="50" r="28" stroke="#14b8a6" />
            <path d="M58,78 H82 L78,88 H62 Z" className="fill-teal-500/20" stroke="#0d9488" />
            <line x1="65" y1="94" x2="75" y2="94" stroke="#0d9488" strokeWidth="2" />
            <line x1="70" y1="12" x2="70" y2="18" stroke="#2dd4bf" strokeLinecap="round" strokeWidth="2" />
            <line x1="100" y1="26" x2="95" y2="30" stroke="#2dd4bf" strokeLinecap="round" strokeWidth="2" />
            <line x1="40" y1="26" x2="45" y2="30" stroke="#2dd4bf" strokeLinecap="round" strokeWidth="2" />
          </svg>
        ),
      };
  }
}

export default function CardVisual({
  heading,
  lines,
  courseSlug,
  cardIndex = 0,
}: {
  heading: string;
  lines: string[];
  courseSlug?: string;
  cardIndex?: number;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const artwork = getTrackArtwork(courseSlug);
  const track = courseSlug ? getTrackBySlug(courseSlug) : undefined;
  const accentColor = track?.accentFrom || "#10b981";

  const v = pickVisual(heading, lines);

  // Render cinematic AI concept art banner on card 0 if available for this track
  const showHeroArt = artwork && cardIndex === 0;

  if (v.kind === "none" && !showHeroArt) return null;

  return (
    <div className="mb-4">
      {/* 3D Cinematic AI Concept Art Banner (When Available for Track) */}
      {showHeroArt && (
        <div className="relative mb-3.5 overflow-hidden rounded-2xl border border-black/10 dark:border-white/15 shadow-xl group">
          <div className="relative aspect-video w-full overflow-hidden bg-neutral-900">
            <img
              src={artwork.image}
              alt={isEn ? artwork.altEn : artwork.altAr}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Cinematic subtle glass gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Floating badge & tag */}
            <div className="absolute bottom-3 inset-x-3 flex items-end justify-between gap-2">
              <div className="text-white min-w-0 pr-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20 mb-1">
                  <span
                    className="h-2 w-2 rounded-full animate-pulse"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span>✨ {isEn ? artwork.badgeEn : artwork.badgeAr}</span>
                </div>
                <p className="text-xs md:text-sm font-bold text-white drop-shadow-md truncate">
                  {isEn ? artwork.altEn : artwork.altAr}
                </p>
              </div>
              <span className="shrink-0 text-[10px] font-mono font-bold bg-white/15 backdrop-blur-md text-white/90 border border-white/20 px-2.5 py-1 rounded-full shadow-md">
                3D Concept Art
              </span>
            </div>
          </div>
        </div>
      )}

      {v.kind === "stat" && (
        <Frame>
          <div className="relative px-5 py-7 text-center">
            <div className="stat-figure text-5xl font-black bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent" dir="auto">
              {v.value}
            </div>
            {v.caption && (
              <p className="vis-caption mx-auto mt-2 max-w-[26ch] text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 font-medium">
                {v.caption}
              </p>
            )}
          </div>
        </Frame>
      )}

      {v.kind === "versus" && (
        <Frame>
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 p-4">
            <Side label={v.left} tone="no" />
            <div className="vis-caption grid place-items-center px-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
              {isEn ? "VS" : "مقابل"}
            </div>
            <Side label={v.right} tone="yes" />
          </div>
        </Frame>
      )}

      {v.kind === "accent" && (
        <AccentBanner icon={v.icon} heading={v.heading} />
      )}

      {v.kind === "arrow" && (
        <Frame>
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 p-4">
            <Side label={v.from} tone="no" />
            <div className="vis-arrow grid place-items-center px-1 font-bold text-teal-600 dark:text-teal-400" aria-hidden>
              {isEn ? "→" : "←"}
            </div>
            <Side label={v.to} tone="yes" />
          </div>
        </Frame>
      )}

      {v.kind === "quote" && (
        <Frame>
          <blockquote className="relative px-6 py-6 text-center">
            <span className="vis-quote-mark text-teal-500/30 text-3xl font-serif" aria-hidden>
              ”
            </span>
            <p className="vis-quote-text font-semibold text-neutral-800 dark:text-neutral-100">{v.text}</p>
          </blockquote>
        </Frame>
      )}

      {v.kind === "keywords" && (
        <Frame>
          <div className="flex flex-wrap justify-center gap-2 p-4">
            {v.items.map((item, i) => (
              <span
                key={i}
                className="vis-chip animate-rise inline-flex items-center gap-1.5 rounded-xl border border-teal-500/20 bg-white/80 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span aria-hidden>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </Frame>
      )}

      {v.kind === "checklist" && (
        <Frame>
          <ul className="space-y-1.5 p-4">
            {v.items.map((item, i) => (
              <li
                key={i}
                className="animate-rise flex items-start gap-2.5 text-xs leading-relaxed"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span
                  className={`mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    item.good
                      ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40"
                      : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40"
                  }`}
                >
                  {item.good ? "✓" : "✕"}
                </span>
                <span className="text-neutral-800 dark:text-neutral-200 font-medium">{item.text}</span>
              </li>
            ))}
          </ul>
        </Frame>
      )}

      {v.kind === "steps" && (
        <Frame>
          <ol className="flex flex-col gap-0 p-4">
            {v.items.map((item, i) => (
              <li
                key={i}
                className="animate-rise flex items-center gap-3"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="flex flex-col items-center self-stretch">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-500/40 text-[11px] font-bold">
                    {i + 1}
                  </span>
                  {i < v.items.length - 1 && <span className="w-px flex-1 bg-teal-200/60 dark:bg-teal-500/20" />}
                </div>
                <span className="py-1 text-xs leading-relaxed text-neutral-800 dark:text-neutral-200 font-medium">{item}</span>
              </li>
            ))}
          </ol>
        </Frame>
      )}
    </div>
  );
}

function AccentBanner({ icon, heading }: { icon: string; heading: string }) {
  const topicArtwork = getTopicArtwork(icon);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border ${topicArtwork.borderLight} ${topicArtwork.borderDark} bg-gradient-to-r ${topicArtwork.themeLight} ${topicArtwork.themeDark} p-4.5 mb-2 shadow-xs dark:shadow-xl transition-all duration-300`}
    >
      {/* Luminous ambient radial glow */}
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full ${topicArtwork.glow} blur-2xl opacity-60 dark:opacity-80`}
      />
      <div className="pointer-events-none absolute -left-6 -bottom-6 h-36 w-36 rounded-full bg-teal-400/10 blur-2xl" />

      {/* Decorative dynamic SVG vector pattern */}
      <div className="absolute inset-y-0 left-2 pointer-events-none flex items-center justify-end overflow-hidden">
        {topicArtwork.svg}
      </div>

      <div className="relative z-10 flex items-center gap-3.5">
        {/* Floating 3D Badge */}
        <div
          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${topicArtwork.badgeGradient} text-2xl shadow-md ring-2 ring-white/80 dark:ring-white/20 group-hover:scale-105 transition-transform duration-300`}
        >
          <span className="drop-shadow-xs">{icon}</span>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${topicArtwork.tagColor}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
              {topicArtwork.label}
            </span>
          </div>
          <h2 className="text-sm md:text-base font-bold leading-snug text-neutral-900 dark:text-white drop-shadow-xs">
            {heading}
          </h2>
        </div>
      </div>
    </div>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-rise overflow-hidden rounded-2xl border border-teal-500/20 dark:border-teal-500/30 bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/40 dark:from-[#09221b] dark:via-[#0c2a22] dark:to-[#061814] shadow-xs dark:shadow-md">
      {children}
    </div>
  );
}

function Side({ label, tone }: { label: string; tone: "yes" | "no" }) {
  return (
    <div
      className={`rounded-xl border p-3 text-center text-xs font-bold leading-snug ${
        tone === "yes"
          ? "border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
          : "border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200"
      }`}
    >
      {label}
    </div>
  );
}
