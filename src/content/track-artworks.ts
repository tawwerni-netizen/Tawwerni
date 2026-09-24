import { ALL_100_TRACKS } from "./tracks100";

export interface TrackArtwork {
  image: string;
  altAr: string;
  altEn: string;
  badgeAr: string;
  badgeEn: string;
}

/**
 * Dedicated custom artworks for specific flagship courses.
 */
export const TRACK_ARTWORKS: Record<string, TrackArtwork> = {
  "powerbi-tableau-visualization": {
    image: "/images/tracks/powerbi-tableau-visualization.jpg",
    altAr: "لوحة بيانات ذكاء الأعمال التفاعلية ثلاثية الأبعاد",
    altEn: "3D Holographic Business Intelligence Dashboard",
    badgeAr: "تصور البيانات التفاعلية",
    badgeEn: "Interactive Data Visuals",
  },
  "prompt-engineering-mastery": {
    image: "/images/tracks/prompt-engineering-mastery.jpg",
    altAr: "هندسة الأوامر والشبكات العصبية للذكاء الاصطناعي",
    altEn: "AI Neural Pathways & Prompt Engineering",
    badgeAr: "هندسة أوامر الذكاء الاصطناعي",
    badgeEn: "Prompt Engineering",
  },
  "ai-everyday": {
    image: "/images/tracks/ai-everyday.jpg",
    altAr: "الذكاء الاصطناعي في العمل اليومي",
    altEn: "Everyday AI Workflow",
    badgeAr: "تطبيقات الذكاء الاصطناعي",
    badgeEn: "Practical AI",
  },
  "frontend-mastery-react": {
    image: "/images/tracks/frontend-mastery-react.jpg",
    altAr: "واجهة برمجة الويب وتطبيقات React الحديثة",
    altEn: "Modern React & Frontend Engineering",
    badgeAr: "برمجة الواجهات الحديثة",
    badgeEn: "Modern Frontend",
  },
  "fullstack-web-modern": {
    image: "/images/tracks/fullstack-web-modern.jpg",
    altAr: "تطوير الويب المتكامل الشامل",
    altEn: "Fullstack Web Development",
    badgeAr: "التطوير المتكامل الشامل",
    badgeEn: "Fullstack Web",
  },
  "growth-marketing-funnels": {
    image: "/images/tracks/growth-marketing-funnels.jpg",
    altAr: "قمع المبيعات والتسويق الرقمي والنمو المالي",
    altEn: "Growth Marketing Funnel & Revenue Intelligence",
    badgeAr: "أقماع النمو والمبيعات",
    badgeEn: "Growth Funnels",
  },
  "freelancing-global-income": {
    image: "/images/tracks/freelancing-global-income.jpg",
    altAr: "العمل الحر والدخل العالمي",
    altEn: "Global Freelancing Mastery",
    badgeAr: "احتراف العمل الحر",
    badgeEn: "Global Freelancing",
  },
  "ecommerce-from-scratch": {
    image: "/images/tracks/ecommerce-digital-store-artwork.jpg",
    altAr: "التجارة الإلكترونية وبناء المتاجر الرقمية",
    altEn: "E-commerce & Digital Stores",
    badgeAr: "التجارة الإلكترونية",
    badgeEn: "E-Commerce",
  },
  "ui-ux-figma-mastery": {
    image: "/images/tracks/ui-ux-figma-mastery.jpg",
    altAr: "تصميم واجهات المستخدم ونظم التصميم في Figma",
    altEn: "Figma UI/UX Design System",
    badgeAr: "تصميم الواجهات Figma",
    badgeEn: "UI/UX Design Systems",
  },
  "motion-graphics-after-effects": {
    image: "/images/tracks/motion-graphics-after-effects.jpg",
    altAr: "تصميم الموشن جرافيكس والتحريك الإبداعي",
    altEn: "Motion Graphics & Visual Animation",
    badgeAr: "الموشن جرافيكس",
    badgeEn: "Motion Graphics",
  },
  "cybersecurity-fundamentals": {
    image: "/images/tracks/cybersecurity-fundamentals.jpg",
    altAr: "أساسيات الأمن السيبراني وحماية الأنظمة",
    altEn: "Cybersecurity & Cloud Defense Fundamentals",
    badgeAr: "الأمن السيبراني والدفاع السحابي",
    badgeEn: "Cybersecurity & Defense",
  },
  "deep-work-hyperfocus": {
    image: "/images/tracks/deep-work-hyperfocus.jpg",
    altAr: "العمل العميق والإنتاجية الفائقة وإدارة الوقت",
    altEn: "Deep Work, Focus Mastery & Peak Productivity",
    badgeAr: "الإنتاجية وإدارة الوقت",
    badgeEn: "Time Mastery & Deep Work",
  },
  "executive-leadership-presence": {
    image: "/images/tracks/executive-leadership-presence.jpg",
    altAr: "القيادة التنفيذية واستراتيجيات اتخاذ القرار",
    altEn: "Executive Leadership & Strategic Decision Making",
    badgeAr: "القيادة والاستراتيجية",
    badgeEn: "Executive Strategy",
  },
  "business-english-career": {
    image: "/images/tracks/business-english-career.jpg",
    altAr: "الإنجليزية المهنية والتواصل الدولي المؤثر",
    altEn: "International English Communication & Career Elevation",
    badgeAr: "التواصل واللغة الدولية",
    badgeEn: "Global Communication",
  },
};

/**
 * Flagship Pillar Artworks ensuring 100% of all 100 tracks have high-end visual artworks.
 */
const PILLAR_ARTWORKS: Record<number, { image: string; badgeAr: string; badgeEn: string }> = {
  1: {
    image: "/images/tracks/prompt-engineering-mastery.jpg",
    badgeAr: "الذكاء الاصطناعي والأتمتة",
    badgeEn: "AI & Intelligent Automation",
  },
  2: {
    image: "/images/tracks/frontend-mastery-react.jpg",
    badgeAr: "هندسة البرمجيات والويب",
    badgeEn: "Software & Web Engineering",
  },
  3: {
    image: "/images/tracks/powerbi-tableau-visualization.jpg",
    badgeAr: "البيانات والذكاء التجاري",
    badgeEn: "Data Analytics & Business Intelligence",
  },
  4: {
    image: "/images/tracks/freelancing-global-income.jpg",
    badgeAr: "العمل الحر وبناء الوكالات",
    badgeEn: "Global Freelancing & Agency",
  },
  5: {
    image: "/images/tracks/growth-marketing-funnels.jpg",
    badgeAr: "التسويق الرقمي والنمو",
    badgeEn: "Growth Marketing & Funnels",
  },
  6: {
    image: "/images/tracks/ui-ux-figma-mastery.jpg",
    badgeAr: "التصميم وتجربة المستخدم",
    badgeEn: "UI/UX & Creative Direction",
  },
  7: {
    image: "/images/tracks/pillar-ecommerce.jpg",
    badgeAr: "المشاريع والتجارة الرقمية",
    badgeEn: "Digital Commerce & Ventures",
  },
  8: {
    image: "/images/tracks/pillar-cybersecurity.jpg",
    badgeAr: "الأمن السيبراني والخصوصية",
    badgeEn: "Cybersecurity & Cloud Defense",
  },
  9: {
    image: "/images/tracks/pillar-leadership.jpg",
    badgeAr: "القيادة والتفاوض والاستراتيجية",
    badgeEn: "Leadership & High-Stakes Strategy",
  },
  10: {
    image: "/images/tracks/pillar-productivity.jpg",
    badgeAr: "الإنتاجية وصناعة العادات",
    badgeEn: "Productivity & Peak Performance",
  },
};

/**
 * Resolves artwork for any track among the 100 tracks.
 * Returns either custom track artwork or the pillar's flagship 3D AI concept artwork.
 */
export function getTrackArtwork(slug?: string): TrackArtwork | null {
  if (!slug) return null;

  // 1. Direct match
  if (TRACK_ARTWORKS[slug]) {
    return TRACK_ARTWORKS[slug];
  }

  // 2. Lookup track from the 100 catalog to resolve by pillar
  const track = ALL_100_TRACKS.find((t) => t.slug === slug);
  if (track) {
    const pillarArt = PILLAR_ARTWORKS[track.pillarId] || PILLAR_ARTWORKS[1];
    return {
      image: pillarArt.image,
      altAr: track.titleAr,
      altEn: track.titleEn,
      badgeAr: pillarArt.badgeAr,
      badgeEn: pillarArt.badgeEn,
    };
  }

  // 3. Fallback for handcrafted or external courses
  return {
    image: "/images/tracks/powerbi-tableau-visualization.jpg",
    altAr: "مسار عملي متقدم في طوّرني",
    altEn: "Practical Track in Tawwerni",
    badgeAr: "مسار تدريبي معتمد",
    badgeEn: "Verified Practical Track",
  };
}
