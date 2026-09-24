export interface TrackArtwork {
  image: string;
  altAr: string;
  altEn: string;
  badgeAr: string;
  badgeEn: string;
}

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
    altAr: "تطوير الويب المتكامل",
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
    image: "/images/tracks/ecommerce-from-scratch.jpg",
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
};

export function getTrackArtwork(slug?: string): TrackArtwork | null {
  if (!slug) return null;
  return TRACK_ARTWORKS[slug] || null;
}
