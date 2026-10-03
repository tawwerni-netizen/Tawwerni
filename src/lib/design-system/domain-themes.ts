/**
 * TAWWERNI DOMAIN COLOR & VISUAL IDENTITY SYSTEM
 *
 * Central registry for the 10 learning pillars/domains.
 * Implements Level 2 Domain Accents with full WCAG AA contrast compliance
 * in both Light Mode and Dark Mode.
 *
 * Architecture rules:
 * - Level 1 Brand: Tawwerni platform identity (Emerald/Teal navigation & global CTAs) is NEVER overridden.
 * - Level 2 Domain: Controlled accents, glows, badges, node borders, track headers.
 * - Level 3 Semantic: Success, Error, Warning, Info, Disabled are NEVER overridden.
 */

import { ALL_100_TRACKS, TRACK_PILLARS, type Track100 } from "@/content/tracks100";

export interface DomainScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface DomainThemeSurface {
  bgSurface: string;
  border: string;
  borderSubtle: string;
  text: string;
  textMuted: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  glow: string;
}

export interface DomainTheme {
  id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  motifAr: string;
  motifEn: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    scale: DomainScale;
  };
  light: DomainThemeSurface;
  dark: DomainThemeSurface;
  gradient: string;
  gradientTailwind: string;
  cssVariables: {
    primary: string;
    secondary: string;
    accent: string;
    glowLight: string;
    glowDark: string;
    borderLight: string;
    borderDark: string;
    badgeBgLight: string;
    badgeBgDark: string;
    badgeTextLight: string;
    badgeTextDark: string;
  };
}

export const DOMAIN_THEMES: Record<number, DomainTheme> = {
  1: {
    id: 1,
    slug: "ai",
    nameAr: "الذكاء الاصطناعي وهندسة الأوامر",
    nameEn: "AI & Prompt Engineering",
    icon: "🤖",
    motifAr: "عُقد عصبية ونبضات خوارزمية ذكية",
    motifEn: "Neural nodes and algorithmic synapse pulses",
    palette: {
      primary: "#10b981",
      secondary: "#064e3b",
      accent: "#34d399",
      scale: {
        50: "#ecfdf5",
        100: "#d1fae5",
        200: "#a7f3d0",
        300: "#6ee7b7",
        400: "#34d399",
        500: "#10b981",
        600: "#059669",
        700: "#047857",
        800: "#065f46",
        900: "#064e3b",
        950: "#022c22",
      },
    },
    light: {
      bgSurface: "rgba(16, 185, 129, 0.05)",
      border: "rgba(16, 185, 129, 0.35)",
      borderSubtle: "rgba(16, 185, 129, 0.15)",
      text: "#047857",
      textMuted: "#065f46",
      badgeBg: "#d1fae5",
      badgeText: "#064e3b",
      badgeBorder: "rgba(5, 150, 105, 0.3)",
      glow: "rgba(16, 185, 129, 0.25)",
    },
    dark: {
      bgSurface: "rgba(16, 185, 129, 0.08)",
      border: "rgba(52, 211, 153, 0.3)",
      borderSubtle: "rgba(52, 211, 153, 0.12)",
      text: "#6ee7b7",
      textMuted: "#a7f3d0",
      badgeBg: "rgba(6, 78, 59, 0.65)",
      badgeText: "#6ee7b7",
      badgeBorder: "rgba(52, 211, 153, 0.4)",
      glow: "rgba(52, 211, 153, 0.2)",
    },
    gradient: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)",
    gradientTailwind: "from-emerald-500 to-teal-800",
    cssVariables: {
      primary: "#10b981",
      secondary: "#064e3b",
      accent: "#34d399",
      glowLight: "rgba(16, 185, 129, 0.25)",
      glowDark: "rgba(52, 211, 153, 0.2)",
      borderLight: "rgba(16, 185, 129, 0.35)",
      borderDark: "rgba(52, 211, 153, 0.3)",
      badgeBgLight: "#d1fae5",
      badgeBgDark: "rgba(6, 78, 59, 0.65)",
      badgeTextLight: "#064e3b",
      badgeTextDark: "#6ee7b7",
    },
  },

  2: {
    id: 2,
    slug: "programming",
    nameAr: "البرمجة وتطوير البرمجيات",
    nameEn: "Software & Web Development",
    icon: "💻",
    motifAr: "أقواس برمجية وخطوط طرفية متسلسلة",
    motifEn: "Code brackets, syntax trees and terminal flow",
    palette: {
      primary: "#6366f1",
      secondary: "#312e81",
      accent: "#818cf8",
      scale: {
        50: "#eef2ff",
        100: "#e0e7ff",
        200: "#c7d2fe",
        300: "#a5b4fc",
        400: "#818cf8",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
        800: "#3730a3",
        900: "#312e81",
        950: "#1e1b4b",
      },
    },
    light: {
      bgSurface: "rgba(99, 102, 241, 0.05)",
      border: "rgba(99, 102, 241, 0.35)",
      borderSubtle: "rgba(99, 102, 241, 0.15)",
      text: "#4338ca",
      textMuted: "#3730a3",
      badgeBg: "#e0e7ff",
      badgeText: "#312e81",
      badgeBorder: "rgba(79, 70, 229, 0.3)",
      glow: "rgba(99, 102, 241, 0.25)",
    },
    dark: {
      bgSurface: "rgba(99, 102, 241, 0.08)",
      border: "rgba(129, 140, 248, 0.3)",
      borderSubtle: "rgba(129, 140, 248, 0.12)",
      text: "#a5b4fc",
      textMuted: "#c7d2fe",
      badgeBg: "rgba(49, 46, 129, 0.65)",
      badgeText: "#a5b4fc",
      badgeBorder: "rgba(129, 140, 248, 0.4)",
      glow: "rgba(129, 140, 248, 0.2)",
    },
    gradient: "linear-gradient(135deg, #6366f1 0%, #312e81 100%)",
    gradientTailwind: "from-indigo-500 to-indigo-900",
    cssVariables: {
      primary: "#6366f1",
      secondary: "#312e81",
      accent: "#818cf8",
      glowLight: "rgba(99, 102, 241, 0.25)",
      glowDark: "rgba(129, 140, 248, 0.2)",
      borderLight: "rgba(99, 102, 241, 0.35)",
      borderDark: "rgba(129, 140, 248, 0.3)",
      badgeBgLight: "#e0e7ff",
      badgeBgDark: "rgba(49, 46, 129, 0.65)",
      badgeTextLight: "#312e81",
      badgeTextDark: "#a5b4fc",
    },
  },

  3: {
    id: 3,
    slug: "data",
    nameAr: "تحليل البيانات والذكاء التجاري",
    nameEn: "Data Analytics & BI",
    icon: "📊",
    motifAr: "مخططات متجهة وأعمدة قياس بيانية دقيقة",
    motifEn: "Metric vectors and precise analytical histograms",
    palette: {
      primary: "#06b6d4",
      secondary: "#164e63",
      accent: "#38bdf8",
      scale: {
        50: "#ecfeff",
        100: "#cffafe",
        200: "#a5f3fc",
        300: "#67e8f9",
        400: "#22d3ee",
        500: "#06b6d4",
        600: "#0891b2",
        700: "#0e7490",
        800: "#155e75",
        900: "#164e63",
        950: "#083344",
      },
    },
    light: {
      bgSurface: "rgba(6, 182, 212, 0.05)",
      border: "rgba(6, 182, 212, 0.35)",
      borderSubtle: "rgba(6, 182, 212, 0.15)",
      text: "#0e7490",
      textMuted: "#155e75",
      badgeBg: "#cffafe",
      badgeText: "#164e63",
      badgeBorder: "rgba(8, 145, 178, 0.3)",
      glow: "rgba(6, 182, 212, 0.25)",
    },
    dark: {
      bgSurface: "rgba(6, 182, 212, 0.08)",
      border: "rgba(34, 211, 238, 0.3)",
      borderSubtle: "rgba(34, 211, 238, 0.12)",
      text: "#67e8f9",
      textMuted: "#a5f3fc",
      badgeBg: "rgba(22, 78, 99, 0.65)",
      badgeText: "#67e8f9",
      badgeBorder: "rgba(34, 211, 238, 0.4)",
      glow: "rgba(34, 211, 238, 0.2)",
    },
    gradient: "linear-gradient(135deg, #06b6d4 0%, #164e63 100%)",
    gradientTailwind: "from-cyan-500 to-sky-900",
    cssVariables: {
      primary: "#06b6d4",
      secondary: "#164e63",
      accent: "#38bdf8",
      glowLight: "rgba(6, 182, 212, 0.25)",
      glowDark: "rgba(34, 211, 238, 0.2)",
      borderLight: "rgba(6, 182, 212, 0.35)",
      borderDark: "rgba(34, 211, 238, 0.3)",
      badgeBgLight: "#cffafe",
      badgeBgDark: "rgba(22, 78, 99, 0.65)",
      badgeTextLight: "#164e63",
      badgeTextDark: "#67e8f9",
    },
  },

  4: {
    id: 4,
    slug: "freelancing",
    nameAr: "العمل الحر وبناء الوكالات",
    nameEn: "Freelancing & Micro-Agencies",
    icon: "💼",
    motifAr: "ختم الصفقات، تدفق العقود ونمو الأعمال",
    motifEn: "Contract flow, deal closure seals and client growth",
    palette: {
      primary: "#f59e0b",
      secondary: "#78350f",
      accent: "#fbbf24",
      scale: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f",
        950: "#451a03",
      },
    },
    light: {
      bgSurface: "rgba(245, 158, 11, 0.05)",
      border: "rgba(245, 158, 11, 0.35)",
      borderSubtle: "rgba(245, 158, 11, 0.15)",
      text: "#b45309",
      textMuted: "#92400e",
      badgeBg: "#fef3c7",
      badgeText: "#78350f",
      badgeBorder: "rgba(217, 119, 6, 0.3)",
      glow: "rgba(245, 158, 11, 0.25)",
    },
    dark: {
      bgSurface: "rgba(245, 158, 11, 0.08)",
      border: "rgba(251, 191, 36, 0.3)",
      borderSubtle: "rgba(251, 191, 36, 0.12)",
      text: "#fcd34d",
      textMuted: "#fde68a",
      badgeBg: "rgba(120, 53, 15, 0.65)",
      badgeText: "#fcd34d",
      badgeBorder: "rgba(251, 191, 36, 0.4)",
      glow: "rgba(251, 191, 36, 0.2)",
    },
    gradient: "linear-gradient(135deg, #f59e0b 0%, #78350f 100%)",
    gradientTailwind: "from-amber-500 to-amber-900",
    cssVariables: {
      primary: "#f59e0b",
      secondary: "#78350f",
      accent: "#fbbf24",
      glowLight: "rgba(245, 158, 11, 0.25)",
      glowDark: "rgba(251, 191, 36, 0.2)",
      borderLight: "rgba(245, 158, 11, 0.35)",
      borderDark: "rgba(251, 191, 36, 0.3)",
      badgeBgLight: "#fef3c7",
      badgeBgDark: "rgba(120, 53, 15, 0.65)",
      badgeTextLight: "#78350f",
      badgeTextDark: "#fcd34d",
    },
  },

  5: {
    id: 5,
    slug: "marketing",
    nameAr: "التسويق الرقمي ونمو المبيعات",
    nameEn: "Digital Marketing & Growth",
    icon: "🚀",
    motifAr: "مسار انطلاق الصاروخ وموجات الانتشار الرقمي",
    motifEn: "Rocket trajectory and viral propagation ripples",
    palette: {
      primary: "#f43f5e",
      secondary: "#881337",
      accent: "#fb7185",
      scale: {
        50: "#fff1f2",
        100: "#ffe4e6",
        200: "#fecdd3",
        300: "#fda4af",
        400: "#fb7185",
        500: "#f43f5e",
        600: "#e11d48",
        700: "#be123c",
        800: "#9f1239",
        900: "#881337",
        950: "#4c0519",
      },
    },
    light: {
      bgSurface: "rgba(244, 63, 94, 0.05)",
      border: "rgba(244, 63, 94, 0.35)",
      borderSubtle: "rgba(244, 63, 94, 0.15)",
      text: "#be123c",
      textMuted: "#9f1239",
      badgeBg: "#ffe4e6",
      badgeText: "#881337",
      badgeBorder: "rgba(225, 29, 72, 0.3)",
      glow: "rgba(244, 63, 94, 0.25)",
    },
    dark: {
      bgSurface: "rgba(244, 63, 94, 0.08)",
      border: "rgba(251, 113, 133, 0.3)",
      borderSubtle: "rgba(251, 113, 133, 0.12)",
      text: "#fda4af",
      textMuted: "#fecdd3",
      badgeBg: "rgba(136, 19, 55, 0.65)",
      badgeText: "#fda4af",
      badgeBorder: "rgba(251, 113, 133, 0.4)",
      glow: "rgba(251, 113, 133, 0.2)",
    },
    gradient: "linear-gradient(135deg, #f43f5e 0%, #881337 100%)",
    gradientTailwind: "from-rose-500 to-rose-950",
    cssVariables: {
      primary: "#f43f5e",
      secondary: "#881337",
      accent: "#fb7185",
      glowLight: "rgba(244, 63, 94, 0.25)",
      glowDark: "rgba(251, 113, 133, 0.2)",
      borderLight: "rgba(244, 63, 94, 0.35)",
      borderDark: "rgba(251, 113, 133, 0.3)",
      badgeBgLight: "#ffe4e6",
      badgeBgDark: "rgba(136, 19, 55, 0.65)",
      badgeTextLight: "#881337",
      badgeTextDark: "#fda4af",
    },
  },

  6: {
    id: 6,
    slug: "design",
    nameAr: "التصميم والوسائط الإبداعية",
    nameEn: "UI/UX & Creative Media",
    icon: "🎨",
    motifAr: "منحنيات بيزييه وتناغم الألوان والطبقات",
    motifEn: "Bézier curves, chromatic harmony and layered vectors",
    palette: {
      primary: "#8b5cf6",
      secondary: "#4c1d95",
      accent: "#a78bfa",
      scale: {
        50: "#f5f3ff",
        100: "#ede9fe",
        200: "#ddd6fe",
        300: "#c4b5fd",
        400: "#a78bfa",
        500: "#8b5cf6",
        600: "#7c3aed",
        700: "#6d28d9",
        800: "#5b21b6",
        900: "#4c1d95",
        950: "#2e1065",
      },
    },
    light: {
      bgSurface: "rgba(139, 92, 246, 0.05)",
      border: "rgba(139, 92, 246, 0.35)",
      borderSubtle: "rgba(139, 92, 246, 0.15)",
      text: "#6d28d9",
      textMuted: "#5b21b6",
      badgeBg: "#ede9fe",
      badgeText: "#4c1d95",
      badgeBorder: "rgba(124, 58, 237, 0.3)",
      glow: "rgba(139, 92, 246, 0.25)",
    },
    dark: {
      bgSurface: "rgba(139, 92, 246, 0.08)",
      border: "rgba(167, 139, 250, 0.3)",
      borderSubtle: "rgba(167, 139, 250, 0.12)",
      text: "#c4b5fd",
      textMuted: "#ddd6fe",
      badgeBg: "rgba(76, 29, 149, 0.65)",
      badgeText: "#c4b5fd",
      badgeBorder: "rgba(167, 139, 250, 0.4)",
      glow: "rgba(167, 139, 250, 0.2)",
    },
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)",
    gradientTailwind: "from-purple-500 to-violet-950",
    cssVariables: {
      primary: "#8b5cf6",
      secondary: "#4c1d95",
      accent: "#a78bfa",
      glowLight: "rgba(139, 92, 246, 0.25)",
      glowDark: "rgba(167, 139, 250, 0.2)",
      borderLight: "rgba(139, 92, 246, 0.35)",
      borderDark: "rgba(167, 139, 250, 0.3)",
      badgeBgLight: "#ede9fe",
      badgeBgDark: "rgba(76, 29, 149, 0.65)",
      badgeTextLight: "#4c1d95",
      badgeTextDark: "#c4b5fd",
    },
  },

  7: {
    id: 7,
    slug: "business",
    nameAr: "ريادة الأعمال وبناء المشاريع",
    nameEn: "Entrepreneurship & Startups",
    icon: "🏢",
    motifAr: "الأعمدة الهندسية وقواعد البناء المؤسسي المتين",
    motifEn: "Architectural foundation, enterprise pillars and scale",
    palette: {
      primary: "#ea580c",
      secondary: "#7c2d12",
      accent: "#fb923c",
      scale: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
        950: "#431407",
      },
    },
    light: {
      bgSurface: "rgba(234, 88, 12, 0.05)",
      border: "rgba(234, 88, 12, 0.35)",
      borderSubtle: "rgba(234, 88, 12, 0.15)",
      text: "#c2410c",
      textMuted: "#9a3412",
      badgeBg: "#ffedd5",
      badgeText: "#7c2d12",
      badgeBorder: "rgba(234, 88, 12, 0.3)",
      glow: "rgba(234, 88, 12, 0.25)",
    },
    dark: {
      bgSurface: "rgba(234, 88, 12, 0.08)",
      border: "rgba(251, 146, 60, 0.3)",
      borderSubtle: "rgba(251, 146, 60, 0.12)",
      text: "#fdba74",
      textMuted: "#fed7aa",
      badgeBg: "rgba(124, 45, 18, 0.65)",
      badgeText: "#fdba74",
      badgeBorder: "rgba(251, 146, 60, 0.4)",
      glow: "rgba(251, 146, 60, 0.2)",
    },
    gradient: "linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)",
    gradientTailwind: "from-orange-500 to-amber-950",
    cssVariables: {
      primary: "#ea580c",
      secondary: "#7c2d12",
      accent: "#fb923c",
      glowLight: "rgba(234, 88, 12, 0.25)",
      glowDark: "rgba(251, 146, 60, 0.2)",
      borderLight: "rgba(234, 88, 12, 0.35)",
      borderDark: "rgba(251, 146, 60, 0.3)",
      badgeBgLight: "#ffedd5",
      badgeBgDark: "rgba(124, 45, 18, 0.65)",
      badgeTextLight: "#7c2d12",
      badgeTextDark: "#fdba74",
    },
  },

  8: {
    id: 8,
    slug: "cybersecurity",
    nameAr: "الأمن السيبراني وحماية الخصوصية",
    nameEn: "Cybersecurity & Privacy",
    icon: "🛡️",
    motifAr: "درع الحصانة المشفر وجدران الحماية الرقمية",
    motifEn: "Cryptographic defense shield and firewall perimeters",
    palette: {
      primary: "#ef4444",
      secondary: "#7f1d1d",
      accent: "#f87171",
      scale: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
        950: "#450a0a",
      },
    },
    light: {
      bgSurface: "rgba(239, 68, 68, 0.05)",
      border: "rgba(239, 68, 68, 0.35)",
      borderSubtle: "rgba(239, 68, 68, 0.15)",
      text: "#b91c1c",
      textMuted: "#991b1b",
      badgeBg: "#fee2e2",
      badgeText: "#7f1d1d",
      badgeBorder: "rgba(220, 38, 38, 0.3)",
      glow: "rgba(239, 68, 68, 0.25)",
    },
    dark: {
      bgSurface: "rgba(239, 68, 68, 0.08)",
      border: "rgba(248, 113, 113, 0.3)",
      borderSubtle: "rgba(248, 113, 113, 0.12)",
      text: "#fca5a5",
      textMuted: "#fecaca",
      badgeBg: "rgba(127, 29, 29, 0.65)",
      badgeText: "#fca5a5",
      badgeBorder: "rgba(248, 113, 113, 0.4)",
      glow: "rgba(248, 113, 113, 0.2)",
    },
    gradient: "linear-gradient(135deg, #ef4444 0%, #7f1d1d 100%)",
    gradientTailwind: "from-red-500 to-rose-950",
    cssVariables: {
      primary: "#ef4444",
      secondary: "#7f1d1d",
      accent: "#f87171",
      glowLight: "rgba(239, 68, 68, 0.25)",
      glowDark: "rgba(248, 113, 113, 0.2)",
      borderLight: "rgba(239, 68, 68, 0.35)",
      borderDark: "rgba(248, 113, 113, 0.3)",
      badgeBgLight: "#fee2e2",
      badgeBgDark: "rgba(127, 29, 29, 0.65)",
      badgeTextLight: "#7f1d1d",
      badgeTextDark: "#fca5a5",
    },
  },

  9: {
    id: 9,
    slug: "soft-skills",
    nameAr: "المهارات الناعمة والقيادة",
    nameEn: "Soft Skills & Leadership",
    icon: "🗣️",
    motifAr: "جسور التواصل الفعّال وموجات التأثير الإنساني",
    motifEn: "Connecting dialog bridges and influential resonance",
    palette: {
      primary: "#eab308",
      secondary: "#713f12",
      accent: "#fde047",
      scale: {
        50: "#fefce8",
        100: "#fef9c3",
        200: "#fef08a",
        300: "#fde047",
        400: "#facc15",
        500: "#eab308",
        600: "#ca8a04",
        700: "#a16207",
        800: "#854d0e",
        900: "#713f12",
        950: "#422006",
      },
    },
    light: {
      bgSurface: "rgba(234, 179, 8, 0.05)",
      border: "rgba(234, 179, 8, 0.35)",
      borderSubtle: "rgba(234, 179, 8, 0.15)",
      text: "#a16207",
      textMuted: "#854d0e",
      badgeBg: "#fef9c3",
      badgeText: "#713f12",
      badgeBorder: "rgba(202, 138, 4, 0.3)",
      glow: "rgba(234, 179, 8, 0.25)",
    },
    dark: {
      bgSurface: "rgba(234, 179, 8, 0.08)",
      border: "rgba(250, 204, 21, 0.3)",
      borderSubtle: "rgba(250, 204, 21, 0.12)",
      text: "#fef08a",
      textMuted: "#fde047",
      badgeBg: "rgba(113, 63, 18, 0.65)",
      badgeText: "#fef08a",
      badgeBorder: "rgba(250, 204, 21, 0.4)",
      glow: "rgba(250, 204, 21, 0.2)",
    },
    gradient: "linear-gradient(135deg, #eab308 0%, #713f12 100%)",
    gradientTailwind: "from-yellow-500 to-amber-950",
    cssVariables: {
      primary: "#eab308",
      secondary: "#713f12",
      accent: "#fde047",
      glowLight: "rgba(234, 179, 8, 0.25)",
      glowDark: "rgba(250, 204, 21, 0.2)",
      borderLight: "rgba(234, 179, 8, 0.35)",
      borderDark: "rgba(250, 204, 21, 0.3)",
      badgeBgLight: "#fef9c3",
      badgeBgDark: "rgba(113, 63, 18, 0.65)",
      badgeTextLight: "#713f12",
      badgeTextDark: "#fef08a",
    },
  },

  10: {
    id: 10,
    slug: "productivity",
    nameAr: "الإنتاجية وإدارة الذات والصحة",
    nameEn: "Productivity & Mindset",
    icon: "🧠",
    motifAr: "مدارات التركيز العميق وتدفق الطاقة والصفاء الذهني",
    motifEn: "Deep focus orbits, energy equilibrium and flow state",
    palette: {
      primary: "#14b8a6",
      secondary: "#134e4a",
      accent: "#2dd4bf",
      scale: {
        50: "#f0fdfa",
        100: "#ccfbf1",
        200: "#99f6e4",
        300: "#5eead4",
        400: "#2dd4bf",
        500: "#14b8a6",
        600: "#0d9488",
        700: "#0f766e",
        800: "#115e59",
        900: "#134e4a",
        950: "#042f2e",
      },
    },
    light: {
      bgSurface: "rgba(20, 184, 166, 0.05)",
      border: "rgba(20, 184, 166, 0.35)",
      borderSubtle: "rgba(20, 184, 166, 0.15)",
      text: "#0f766e",
      textMuted: "#115e59",
      badgeBg: "#ccfbf1",
      badgeText: "#134e4a",
      badgeBorder: "rgba(13, 148, 136, 0.3)",
      glow: "rgba(20, 184, 166, 0.25)",
    },
    dark: {
      bgSurface: "rgba(20, 184, 166, 0.08)",
      border: "rgba(45, 212, 191, 0.3)",
      borderSubtle: "rgba(45, 212, 191, 0.12)",
      text: "#5eead4",
      textMuted: "#99f6e4",
      badgeBg: "rgba(19, 78, 74, 0.65)",
      badgeText: "#5eead4",
      badgeBorder: "rgba(45, 212, 191, 0.4)",
      glow: "rgba(45, 212, 191, 0.2)",
    },
    gradient: "linear-gradient(135deg, #14b8a6 0%, #134e4a 100%)",
    gradientTailwind: "from-teal-500 to-teal-950",
    cssVariables: {
      primary: "#14b8a6",
      secondary: "#134e4a",
      accent: "#2dd4bf",
      glowLight: "rgba(20, 184, 166, 0.25)",
      glowDark: "rgba(45, 212, 191, 0.2)",
      borderLight: "rgba(20, 184, 166, 0.35)",
      borderDark: "rgba(45, 212, 191, 0.3)",
      badgeBgLight: "#ccfbf1",
      badgeBgDark: "rgba(19, 78, 74, 0.65)",
      badgeTextLight: "#134e4a",
      badgeTextDark: "#5eead4",
    },
  },
};

/**
 * Universal Deterministic Resolver for Domain Theme
 *
 * Supports input by:
 * - pillarId (1-10)
 * - trackSlug (e.g. 'chatgpt-prompt-mastery', 'python-fastapi')
 * - category / pillarName (e.g. 'Software & Web Development', 'البرمجة')
 * - raw title
 *
 * Falls back safely to Pillar 1 (Emerald/AI) if unmapped.
 */
export function resolveDomainTheme(params?: {
  pillarId?: number | null;
  trackSlug?: string | null;
  category?: string | null;
  title?: string | null;
}): DomainTheme {
  if (!params) return DOMAIN_THEMES[1];

  // 1. Direct pillarId match
  if (params.pillarId && DOMAIN_THEMES[params.pillarId]) {
    return DOMAIN_THEMES[params.pillarId];
  }

  // 2. Track Slug Lookup
  if (params.trackSlug) {
    const slug = params.trackSlug.trim().toLowerCase();
    const track = ALL_100_TRACKS.find((t) => t.slug === slug);
    if (track && DOMAIN_THEMES[track.pillarId]) {
      return DOMAIN_THEMES[track.pillarId];
    }

    // Heuristics on slug patterns if not in static list
    if (slug.includes("ai") || slug.includes("prompt") || slug.includes("gpt") || slug.includes("claude") || slug.includes("gemini") || slug.includes("llm")) {
      return DOMAIN_THEMES[1];
    }
    if (slug.includes("code") || slug.includes("dev") || slug.includes("python") || slug.includes("react") || slug.includes("js") || slug.includes("web") || slug.includes("api") || slug.includes("software") || slug.includes("git")) {
      return DOMAIN_THEMES[2];
    }
    if (slug.includes("data") || slug.includes("bi") || slug.includes("sql") || slug.includes("analytics") || slug.includes("tableau") || slug.includes("power-bi") || slug.includes("excel")) {
      return DOMAIN_THEMES[3];
    }
    if (slug.includes("freelance") || slug.includes("agency") || slug.includes("upwork") || slug.includes("fiverr") || slug.includes("client") || slug.includes("service")) {
      return DOMAIN_THEMES[4];
    }
    if (slug.includes("market") || slug.includes("growth") || slug.includes("seo") || slug.includes("ads") || slug.includes("funnel") || slug.includes("sales") || slug.includes("content")) {
      return DOMAIN_THEMES[5];
    }
    if (slug.includes("design") || slug.includes("ui") || slug.includes("ux") || slug.includes("figma") || slug.includes("video") || slug.includes("audio") || slug.includes("creative")) {
      return DOMAIN_THEMES[6];
    }
    if (slug.includes("startup") || slug.includes("business") || slug.includes("entrepreneur") || slug.includes("company") || slug.includes("fund") || slug.includes("pitch")) {
      return DOMAIN_THEMES[7];
    }
    if (slug.includes("security") || slug.includes("cyber") || slug.includes("privacy") || slug.includes("hacker") || slug.includes("pentest") || slug.includes("soc")) {
      return DOMAIN_THEMES[8];
    }
    if (slug.includes("lead") || slug.includes("negotiat") || slug.includes("speak") || slug.includes("soft-skill") || slug.includes("communicat") || slug.includes("conflict")) {
      return DOMAIN_THEMES[9];
    }
    if (slug.includes("productiv") || slug.includes("mind") || slug.includes("habit") || slug.includes("time") || slug.includes("focus") || slug.includes("health")) {
      return DOMAIN_THEMES[10];
    }
  }

  // 3. Category / Pillar Name Lookup
  if (params.category) {
    const cat = params.category.trim().toLowerCase();
    for (const [idStr, theme] of Object.entries(DOMAIN_THEMES)) {
      const id = Number(idStr);
      if (
        theme.slug.toLowerCase() === cat ||
        theme.nameEn.toLowerCase() === cat ||
        theme.nameAr.includes(cat) ||
        cat.includes(theme.slug.toLowerCase()) ||
        cat.includes(theme.nameEn.toLowerCase())
      ) {
        return theme;
      }
    }

    // Arabic category keyword matching
    if (cat.includes("ذكاء") || cat.includes("أوامر") || cat.includes("توليدي")) return DOMAIN_THEMES[1];
    if (cat.includes("برمج") || cat.includes("تطوير") || cat.includes("كود")) return DOMAIN_THEMES[2];
    if (cat.includes("بيانات") || cat.includes("إحصاء") || cat.includes("تحليل")) return DOMAIN_THEMES[3];
    if (cat.includes("حر") || cat.includes("وكال") || cat.includes("مستقل")) return DOMAIN_THEMES[4];
    if (cat.includes("تسويق") || cat.includes("مبيعات") || cat.includes("إعلان") || cat.includes("نمو")) return DOMAIN_THEMES[5];
    if (cat.includes("تصميم") || cat.includes("إبداع") || cat.includes("وسائط") || cat.includes("واجهات")) return DOMAIN_THEMES[6];
    if (cat.includes("ريادة") || cat.includes("مشاريع") || cat.includes("أعمال") || cat.includes("شركات")) return DOMAIN_THEMES[7];
    if (cat.includes("أمن") || cat.includes("سيبران") || cat.includes("خصوصية") || cat.includes("اختراق")) return DOMAIN_THEMES[8];
    if (cat.includes("ناعمة") || cat.includes("قياد") || cat.includes("تواصل") || cat.includes("إقناع")) return DOMAIN_THEMES[9];
    if (cat.includes("إنتاج") || cat.includes("ذات") || cat.includes("عادات") || cat.includes("تركيز")) return DOMAIN_THEMES[10];
  }

  // 4. Fallback: Pillar 1 (Emerald)
  return DOMAIN_THEMES[1];
}

/**
 * Returns all 10 domain themes as an ordered array.
 */
export function getAllDomainThemes(): DomainTheme[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => DOMAIN_THEMES[id]);
}

/**
 * Helper to compute inline styles for a domain pill badge.
 */
export function getDomainBadgeStyles(theme: DomainTheme, isDark: boolean): React.CSSProperties {
  const surface = isDark ? theme.dark : theme.light;
  return {
    backgroundColor: surface.badgeBg,
    color: surface.badgeText,
    borderColor: surface.badgeBorder,
  };
}

/**
 * Helper to compute card hover ambient glow and border.
 */
export function getDomainHoverGlow(theme: DomainTheme, isDark: boolean) {
  const surface = isDark ? theme.dark : theme.light;
  return {
    borderColor: surface.border,
    boxShadow: `0 16px 36px -12px ${surface.glow}`,
  };
}
