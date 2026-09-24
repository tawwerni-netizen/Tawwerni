import { TRACKS_1_50 } from "./tracks-data-1-50";
import { TRACKS_51_100 } from "./tracks-data-51-100";

export type Track100 = {
  id: number;
  slug: string;
  order: number;
  pillarId: number;
  pillarNameAr: string;
  pillarNameEn: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  levelAr: "مبتدئ" | "متوسط" | "متقدم";
  levelEn: "Beginner" | "Intermediate" | "Advanced";
  totalLessons: number;
  durationHours: number;
  totalXp: number;
  icon: string;
  accentFrom: string;
  accentTo: string;
  outcomesAr: string[];
  outcomesEn: string[];
  realityAr: string;
  realityEn: string;
  badgeTitleAr: string;
  badgeTitleEn: string;
};

export const TRACK_PILLARS = [
  { id: 1, nameAr: "الذكاء الاصطناعي وهندسة الأوامر", nameEn: "AI & Prompt Engineering", icon: "🤖", color: "from-emerald-500 to-teal-700" },
  { id: 2, nameAr: "البرمجة وتطوير البرمجيات", nameEn: "Software & Web Development", icon: "💻", color: "from-blue-500 to-indigo-700" },
  { id: 3, nameAr: "تحليل البيانات والذكاء التجاري", nameEn: "Data Analytics & BI", icon: "📊", color: "from-cyan-500 to-blue-700" },
  { id: 4, nameAr: "العمل الحر وبناء الوكالات", nameEn: "Freelancing & Micro-Agencies", icon: "💼", color: "from-amber-500 to-orange-700" },
  { id: 5, nameAr: "التسويق الرقمي ونمو المبيعات", nameEn: "Digital Marketing & Growth", icon: "🚀", color: "from-rose-500 to-pink-700" },
  { id: 6, nameAr: "التصميم والوسائط الإبداعية", nameEn: "UI/UX & Creative Media", icon: "🎨", color: "from-purple-500 to-violet-700" },
  { id: 7, nameAr: "ريادة الأعمال وبناء المشاريع", nameEn: "Entrepreneurship & Startups", icon: "🏢", color: "from-teal-500 to-emerald-800" },
  { id: 8, nameAr: "الأمن السيبراني وحماية الخصوصية", nameEn: "Cybersecurity & Privacy", icon: "🛡️", color: "from-red-500 to-rose-800" },
  { id: 9, nameAr: "المهارات الناعمة والقيادة", nameEn: "Soft Skills & Leadership", icon: "🗣️", color: "from-amber-400 to-yellow-600" },
  { id: 10, nameAr: "الإنتاجية وإدارة الذات والصحة", nameEn: "Productivity & Mindset", icon: "🧠", color: "from-teal-400 to-sky-700" },
] as const;

export const ALL_100_TRACKS: Track100[] = [
  ...TRACKS_1_50,
  ...TRACKS_51_100,
];

export function getTrackBySlug(slug: string): Track100 | undefined {
  return ALL_100_TRACKS.find((t) => t.slug === slug);
}

export function getTracksByPillar(pillarId: number): Track100[] {
  return ALL_100_TRACKS.filter((t) => t.pillarId === pillarId);
}
