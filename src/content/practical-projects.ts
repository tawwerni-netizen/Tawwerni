/**
 * Practical Projects & Capstone Deliverables
 * (Tawwerni V4.8 Social Proof Policy & Grounded Outcomes)
 *
 * Replaces synthetic/unverified reviews with concrete, authentic deliverables
 * that learners build and document in their portfolios across the 100 tracks.
 */

export type PracticalProject = {
  id: string;
  domain: "ai" | "coding" | "freelance" | "marketing" | "data" | "design" | "business" | "productivity";
  domainAr: string;
  domainEn: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  objectiveAr: string;
  objectiveEn: string;
  deliverableAr: string;
  deliverableEn: string;
  tools: string[];
  trackSlug: string;
  trackTitleAr: string;
  trackTitleEn: string;
  estimatedDays: number;
};

export const PRACTICAL_PROJECTS: PracticalProject[] = [
  {
    id: "proj-prompt-megaprompt",
    domain: "ai",
    domainAr: "الذكاء الاصطناعي",
    domainEn: "AI & Automation",
    icon: "🤖",
    titleAr: "بناء برومبت تنفيذي متقدم (Megaprompt Architecture)",
    titleEn: "Executive Megaprompt Architecture",
    objectiveAr: "هندسة أمر تنفيذي متعدد المتغيرات لأتمتة إعداد التقارير والتحليلات المعقدة بدون أخطاء هلوسة.",
    objectiveEn: "Engineer a modular multi-variable prompt automating complex reporting with zero hallucination.",
    deliverableAr: "قالب برومبت موثق يشتمل على السياق، ومحددات الإخراج، والـ Few-Shot Examples جاهز للاستخدام الفوري.",
    deliverableEn: "Documented megaprompt template with context constraints, guardrails, and few-shot examples.",
    tools: ["Claude 3.7", "GPT-4o", "Prompt Engineering"],
    trackSlug: "prompt-engineering-mastery",
    trackTitleAr: "هندسة الأوامر المتقدمة (Prompting)",
    trackTitleEn: "Advanced Prompt Engineering",
    estimatedDays: 28,
  },
  {
    id: "proj-fullstack-landing",
    domain: "coding",
    domainAr: "البرمجة وتطوير الويب",
    domainEn: "Web Development",
    icon: "💻",
    titleAr: "بناء وتطوير تطبيق واجهات متجاوب بـ Next.js و Tailwind",
    titleEn: "Production Responsive Web App with Next.js",
    objectiveAr: "بناء واجهة مستخدم تفاعلية فائقة السرعة ومتوافقة مع مختلف الشاشات ومتصلة بقواعد البيانات.",
    objectiveEn: "Build a high-performance, fully-responsive web application connected to modern backends.",
    deliverableAr: "موقع ويب حي منشور على السيرفر برابط تجريبي مباشر وملف أعمال موثق على GitHub.",
    deliverableEn: "Live deployed web application with public link and documented GitHub repository.",
    tools: ["React 19", "Next.js", "Tailwind CSS", "TypeScript"],
    trackSlug: "frontend-react-nextjs",
    trackTitleAr: "تطوير واجهات الويب (React & Next.js)",
    trackTitleEn: "Frontend: React & Next.js",
    estimatedDays: 28,
  },
  {
    id: "proj-data-sql-dashboard",
    domain: "data",
    domainAr: "تحليل البيانات",
    domainEn: "Data Analytics",
    icon: "📊",
    titleAr: "لوحة استعلامات SQL وتحليل مؤشرات الأداء التجاري",
    titleEn: "SQL Business Intelligence & KPI Dashboard",
    objectiveAr: "كتابة استعلامات متقدمة لحساب معدلات الاحتفاظ، والـ Cohort Analysis، ومسارات التحويل.",
    objectiveEn: "Author advanced SQL queries measuring retention, cohort performance, and conversion funnels.",
    deliverableAr: "مستودع استعلامات SQL مشروحة ولوحة مؤشرات أداء تفاعلية مدعومة بالرسوم البيانية.",
    deliverableEn: "Annotated SQL script repository with an interactive KPI dashboard visualizing trends.",
    tools: ["SQL", "PostgreSQL", "Power BI", "Data Modeling"],
    trackSlug: "sql-data-analytics",
    trackTitleAr: "لغة SQL لاستخراج وتحليل البيانات",
    trackTitleEn: "SQL for Data & Business Analytics",
    estimatedDays: 28,
  },
  {
    id: "proj-freelance-portfolio",
    domain: "freelance",
    domainAr: "العمل الحر",
    domainEn: "Freelancing",
    icon: "💼",
    titleAr: "بناء بورتفوليو مهني مدمج وصياغة عروض عمل مقنعة",
    titleEn: "Client-Attracting Portfolio & Winning Proposals",
    objectiveAr: "تحديد خدماتك ذات القيمة المرتفعة، وإعداد ملف أعمال احترافي، وصياغة عروض مشاريع تفوز بالصفقات.",
    objectiveEn: "Package high-value services, construct a focused portfolio, and craft tailored proposals.",
    deliverableAr: "بروفايل عمل حر متكامل، و3 نماذج أعمال معروضة باحترافية، وقالب عرض عمل (Proposal) مخصص.",
    deliverableEn: "Complete freelance profile, 3 featured case studies, and a structured winning proposal template.",
    tools: ["Upwork", "Portfolio Design", "Client Negotiation"],
    trackSlug: "zero-to-first-dollar-freelancer",
    trackTitleAr: "من الصفر إلى أول دولار فريلانس",
    trackTitleEn: "Zero to First Dollar Freelancer",
    estimatedDays: 28,
  },
  {
    id: "proj-copywriting-campaign",
    domain: "marketing",
    domainAr: "التسويق الرقمي",
    domainEn: "Marketing & CRO",
    icon: "📈",
    titleAr: "صياغة نصوص إعلانية تحويلية وسيناريوهات فيديو بيعية",
    titleEn: "High-Converting Ad Copy & Landing Page Scripting",
    objectiveAr: "فهم نفسية العميل وصياغة نصوص تخاطب الدوافع الحقيقية والمخاوف لدفع الزائر نحو اتخاذ إجراء.",
    objectiveEn: "Analyze buyer psychology and craft compelling copy addressing core pain points and objections.",
    deliverableAr: "ملف إعلاني متكامل يحتوي على 3 زوايا إعلانية مختلفة، وسيناريو فيديو ترويجي، ونص صفحة هبوط.",
    deliverableEn: "Multi-angle ad copy deck with 3 hook variations, video script, and landing page copy.",
    tools: ["Copywriting", "Direct Response", "A/B Testing"],
    trackSlug: "high-converting-copywriting",
    trackTitleAr: "كتابة النصوص الإعلانية والإقناعية",
    trackTitleEn: "High-Converting Sales Copywriting",
    estimatedDays: 28,
  },
  {
    id: "proj-figma-design-system",
    domain: "design",
    domainAr: "التصميم والواجهات",
    domainEn: "UI/UX & Design",
    icon: "🎨",
    titleAr: "تصميم نظام واجهات متكامل (Design System) في Figma",
    titleEn: "Scalable UI Design System in Figma",
    objectiveAr: "إنشاء مكتبة عناصر تفاعلية باستخدام Auto-Layout والـ Variables والـ Component Sets لتسهيل التسليم للمطورين.",
    objectiveEn: "Create an interactive design component library utilizing Auto-Layout, variables, and component variants.",
    deliverableAr: "ملف Figma تنفيذي يحتوي على لوحة الألوان والخطوط وعناصر الواجهات ونموذج أولي تفاعلي كامل.",
    deliverableEn: "Production Figma file with tokens, typography scales, interactive components, and a prototype.",
    tools: ["Figma", "Auto-Layout", "Design Tokens", "Prototyping"],
    trackSlug: "ui-ux-design-figma",
    trackTitleAr: "أساسيات وتصميم تجربة المستخدم (Figma)",
    trackTitleEn: "UI/UX Design Fundamentals (Figma)",
    estimatedDays: 28,
  },
  {
    id: "proj-python-automation",
    domain: "coding",
    domainAr: "البرمجة والأتمتة",
    domainEn: "Python Automation",
    icon: "⚡",
    titleAr: "أتمتة سحب البيانات ومعالجة الملفات باستخدام Python",
    titleEn: "Automated Data Scraping & File Processing with Python",
    objectiveAr: "بناء سكربتات برمجية تختصر ساعات العمل اليدوي في جمع البيانات وتنسيق جداول Excel وإرسال التقارير.",
    objectiveEn: "Develop automated Python scripts to eliminate repetitive data harvesting and spreadsheet workflows.",
    deliverableAr: "مستودع سكربتات بايثون موثق يعمل تلقائياً مع معالجة الأخطاء وإنشاء تقارير ملخصة بصيغة CSV.",
    deliverableEn: "Documented Python automation pipeline with error logging and scheduled summary reports.",
    tools: ["Python 3", "Pandas", "Requests", "Automation"],
    trackSlug: "python-automation-scripting",
    trackTitleAr: "أتمتة المهام اليومية بلغة Python",
    trackTitleEn: "Python Automation & Scripting",
    estimatedDays: 28,
  },
  {
    id: "proj-meta-ads-matrix",
    domain: "marketing",
    domainAr: "التسويق الرقمي",
    domainEn: "Paid Ads & Growth",
    icon: "🎯",
    titleAr: "مصفوفة اختبار الإعلانات المدفوعة وهيكلة الحملات الرقمية",
    titleEn: "Paid Campaign Architecture & Creative Testing Matrix",
    objectiveAr: "إعداد حملات إعلانية منهجية تعتمد على عزل المتغيرات واختبار الصور والنصوص لاستهداف أفضل تكلفة للنتيجة.",
    objectiveEn: "Structure disciplined advertising campaigns isolating creatives and copy to optimize performance.",
    deliverableAr: "خطة ميزانية إعلانية ومصفوفة اختبار الكريتيف وتقرير لوحة قياس الأداء لمتابعة العائد الإعلاني.",
    deliverableEn: "Ad budget allocation framework, creative testing matrix, and performance tracking scorecard.",
    tools: ["Meta Ads Manager", "Audience Research", "Analytics"],
    trackSlug: "meta-ads-mastery",
    trackTitleAr: "احتراف إعلانات الميتا (Facebook & Instagram Ads)",
    trackTitleEn: "Meta Ads Mastery",
    estimatedDays: 28,
  },
  {
    id: "proj-deep-work-system",
    domain: "productivity",
    domainAr: "الإنتاجية وإدارة الذات",
    domainEn: "Productivity & Focus",
    icon: "🧘",
    titleAr: "بناء نظام العمل العميق وإدارة الأولويات بدون تشتت",
    titleEn: "Distraction-Free Deep Work & Priority Operating System",
    objectiveAr: "تصميم بروتوكول يومي لتنظيم الوقت وتطبيق تقنية Time-Blocking لحماية ساعات التركيز الذهني من الاحتراق.",
    objectiveEn: "Design a daily protocol applying time-blocking to protect peak mental focus and avoid burnout.",
    deliverableAr: "نظام جدولة وتتبع عادات أسبوعي مدعوم بقواعد تقليل المقاطعات الرقمية وصخرة اليوم الذهبية.",
    deliverableEn: "Weekly habit tracking and time-blocking operational template with digital hygiene rules.",
    tools: ["Time Blocking", "Eisenhower Matrix", "Habit Architecture"],
    trackSlug: "deep-work-flow-state-mastery",
    trackTitleAr: "التركيز العميق وتدفق العمل الخارق (Deep Work)",
    trackTitleEn: "Deep Work & Flow State Mastery",
    estimatedDays: 28,
  },
];
