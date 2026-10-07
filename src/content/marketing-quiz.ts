export type QuizOption = {
  icon?: string;
  label: string;
  labelEn?: string;
  value: string;
  badge?: string;
  badgeEn?: string;
  highlight?: boolean;
};

export type QuizQuestionDef = {
  id: string;
  question: string;
  questionEn: string;
  subtitle?: string;
  subtitleEn?: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestionDef[] = [
  {
    id: "goal",
    question: "إيه هدفك الأساسي وأولويتك خلال الـ ٣٠ يوم الجايين؟",
    questionEn: "What is your primary goal over the next 30 days?",
    subtitle: "اختر أولوية واحدة لنخصص مسارك وخطة عملك بدقة",
    subtitleEn: "Select one primary priority to tailor your roadmap",
    options: [
      {
        icon: "🤖",
        label: "أستخدم الذكاء الاصطناعي في شغلي وأوفر ساعات يومياً",
        labelEn: "Use AI to automate daily work and save hours weekly",
        value: "ai-work",
        badge: "الأعلى طلباً 🔥",
        badgeEn: "Highest Demand",
        highlight: true,
      },
      {
        icon: "💼",
        label: "أبدأ العمل الحر (Freelancing) وأجيب أول عميل مدفوع",
        labelEn: "Start freelancing and land my first paid client",
        value: "freelance-client",
        badge: "دخل مباشر 💰",
        badgeEn: "Direct Income",
        highlight: true,
      },
      {
        icon: "📈",
        label: "أتعلم التسويق الرقمي وصناعة إعلانات تبيع",
        labelEn: "Master growth marketing & high-converting ads",
        value: "marketing-sales",
        badge: "مبيعات ونمو 🚀",
        badgeEn: "Sales & Growth",
      },
      {
        icon: "💻",
        label: "أتعلم البرمجة وبناء مواقع وتطبيقات ويب تفاعلية",
        labelEn: "Learn programming and build modern web apps",
        value: "coding-web",
        badge: "مهارة المستقبل 💻",
        badgeEn: "Core Tech",
      },
      {
        icon: "🎨",
        label: "أتعلم صناعة المحتوى وفيديوهات الـ AI والتصميم",
        labelEn: "Create AI videos, creative media & viral content",
        value: "content-design",
        badge: "صناعة المحتوى 🎬",
        badgeEn: "Media & Visuals",
      },
      {
        icon: "🧠",
        label: "أبني عادات إنتاجية وتركيز عميق دون تسويف",
        labelEn: "Build high-output habits and eliminate procrastination",
        value: "habits-focus",
        badge: "إدارة الذات ⚡",
        badgeEn: "High Focus",
      },
    ],
  },
  {
    id: "experience",
    question: "مستواك الحالي وخبرتك في هذا المجال؟",
    questionEn: "What is your current experience level in this area?",
    subtitle: "المسار يبدأ معك من نقطتك الحالية دون تعقيد",
    subtitleEn: "Your roadmap adapts to meet you exactly where you are",
    options: [
      {
        icon: "🌱",
        label: "مبتدئ تماماً من الصفر (محتاج تبسيط وخطوات عملية)",
        labelEn: "Total beginner from scratch (need practical step-by-step guidance)",
        value: "beginner",
        badge: "نقطة انطلاق 🌱",
        badgeEn: "Fresh Start",
      },
      {
        icon: "🔍",
        label: "عندي فكرة عامة وجربت بعض الأدوات، بس محتاج نظام وخطة يومية",
        labelEn: "I know the basics, but lack daily structure and execution habits",
        value: "intermediate",
        badge: "جاهز للتسارع ⚡",
        badgeEn: "Ready to Scale",
        highlight: true,
      },
      {
        icon: "⚡",
        label: "شغال بالفعل في المجال وعايز أوصل للمستوى الاحترافي المتقدم",
        labelEn: "Already active in the field and want to reach top-tier mastery",
        value: "advanced",
        badge: "مستوى احترافي 🔥",
        badgeEn: "Pro Mastery",
      },
    ],
  },
  {
    id: "roadblock",
    question: "إيه أكبر عائق واجهك قبل كده في تعلّم المهارات دي؟",
    questionEn: "What was your biggest roadblock in previous attempts?",
    options: [
      {
        icon: "📺",
        label: "كورسات طويلة ومملة (فيديوهات بالساعات بدون تطبيق عملي)",
        labelEn: "Long boring video lectures without practical application",
        value: "boring-videos",
      },
      {
        icon: "🗺️",
        label: "مش عارف أبدأ منين ومفيش خطة يومية محددة ومباشرة",
        labelEn: "Information overload — didn't know where to start daily",
        value: "no-plan",
      },
      {
        icon: "🥱",
        label: "الحماس بينتهي بعد يومين وبرجع للتسويف وفقدان الشغف",
        labelEn: "Motivation faded after 3 days and procrastination took over",
        value: "procrastination",
      },
    ],
  },
  {
    id: "daily_time",
    question: "كم من الوقت تستطيع الالتزام به يوميًا لتحقيق تقدم حقيقي؟",
    questionEn: "How much time can you realistically commit each day?",
    subtitle: "١٠ دقائق يومياً من التطبيق العملي تكفي لبناء مهارة حقيقية",
    subtitleEn: "10 minutes of daily hands-on practice is enough to transform your skill set",
    options: [
      {
        icon: "⏱️",
        label: "١٠ إلى ١٥ دقيقة يوميًا (جرعة خفيفة مضمونة تناسب يومي المشغول)",
        labelEn: "10 to 15 minutes daily (Frictionless baseline for busy schedules)",
        value: "10-15-mins",
        badge: "الوتيرة الذهبية ⭐",
        badgeEn: "Golden Pace",
        highlight: true,
      },
      {
        icon: "🚀",
        label: "٢٠ إلى ٣٠ دقيقة يوميًا (جاهز لوتيرة أسرع وتطبيقات إضافية)",
        labelEn: "20 to 30 minutes daily (Accelerated pace with extra practical tasks)",
        value: "20-30-mins",
        badge: "تسارع فائق 🚀",
        badgeEn: "Fast Track",
      },
    ],
  },
];

export const quizInterstitials: Record<
  number,
  {
    icon: string;
    heading: string;
    headingEn: string;
    body: string;
    bodyEn: string;
    cta: string;
    ctaEn: string;
  }
> = {};

export type Archetype = {
  key: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  icon: string;
  quote: string;
  quoteEn: string;
  salaryRangeAr: string;
  salaryRangeEn: string;
  superpowersAr: string[];
  superpowersEn: string[];
  recommendedTrackSlugs: string[];
  firstMissionTitleAr: string;
  firstMissionTitleEn: string;
  firstMissionGoalAr: string;
  firstMissionGoalEn: string;
};

export const archetypes: Record<string, Archetype> = {
  "ai-work": {
    key: "ai-work",
    title: "خبير إنتاجية الذكاء الاصطناعي والأتمتة",
    titleEn: "AI Workplace & Prompting Specialist",
    subtitle: "أتمتة المهام الروتينية ومضاعفة سرعة إنجازك المهني",
    subtitleEn: "Automate routine workflows and supercharge professional output",
    icon: "🤖",
    quote: "الذكاء الاصطناعي لن يستبدلك، لكن المحترف الذي يتقن أدوات الـ AI سيسبق الجميع بخطوات.",
    quoteEn: "AI won't replace you, but professionals mastering AI will outperform everyone else.",
    salaryRangeAr: "طلب مرتفع جداً في سوق العمل والشركات · أتمتة المهام اليومية",
    salaryRangeEn: "High Market Demand · Enterprise & Workplace Automation",
    superpowersAr: ["هندسة الأوامر المتقدمة (Prompting)", "أتمتة كتابة التقارير والرسائل", "استخدام نماذج الذكاء الاصطناعي كفريق عمل شخصي"],
    superpowersEn: ["Advanced Prompt Engineering", "Automated Reporting & Comms", "AI Multi-Agent Delegation"],
    recommendedTrackSlugs: ["prompt-engineering-mastery", "ai-workplace-productivity", "autonomous-ai-agents"],
    firstMissionTitleAr: "بناء أول برومبت تنفيذي متقدم ينفذ مهمة عمل معقدة في 3 دقائق",
    firstMissionTitleEn: "Build an executive-grade prompt executing complex work in 3 mins",
    firstMissionGoalAr: "صياغة أمر ذكي بهيكل Megaprompt يوفر عليك ساعتين من الكتابة اليدوية فوراً.",
    firstMissionGoalEn: "Engineer a modular megaprompt that saves you 2 hours of manual writing immediately.",
  },
  "freelance-client": {
    key: "freelance-client",
    title: "المستقل المحترف (Global Freelancer)",
    titleEn: "Global Freelance Strategist",
    subtitle: "بناء معرض أعمال مدمج واقتناص أول عميل مدفوع على المنصات الدولية",
    subtitleEn: "Build a focused portfolio and land your first paid international client",
    icon: "💼",
    quote: "العميل الدولي لا يبحث عن شهادات جامعية، بل يبحث عن شخص يفهم مشكلته ويقدم حلاً مباشراً.",
    quoteEn: "Clients don't hire generic credentials; they hire people who solve their exact bottleneck.",
    salaryRangeAr: "طلب عالمي متزايد · خدمات العمل الحر والتعاقدات عن بُعد",
    salaryRangeEn: "High Global Demand · International Remote & Freelance Contracts",
    superpowersAr: ["صياغة عروض عمل (Proposals) لا تُقاوم", "تسعير الخدمات المربحة (High-Value Packaging)", "اقتناص عملاء على Upwork ومواقع التواصل"],
    superpowersEn: ["Winning Proposal Architecture", "High-Value Service Packaging", "International Client Acquisition"],
    recommendedTrackSlugs: ["zero-to-first-dollar-freelancer", "upwork-fiverr-global-mastery", "high-ticket-pricing-packaging"],
    firstMissionTitleAr: "تحديد مهاراتك المربحة وصياغة أول بروفايل جذاب للعملاء",
    firstMissionTitleEn: "Identify high-demand skills & draft a client-attracting freelance profile",
    firstMissionGoalAr: "تحديد تخصصك الدقيق وصياغة عنوان ونبذة احترافية تجذب مدراء المشاريع.",
    firstMissionGoalEn: "Define your niche and write an irresistible hook for your freelance profile.",
  },
  "marketing-sales": {
    key: "marketing-sales",
    title: "خبير التسويق الرقمي والمبيعات",
    titleEn: "Growth Marketing & Copywriting Specialist",
    subtitle: "كتابة نصوص إعلانية تقنع المشتري وإطلاق حملات مربحة",
    subtitleEn: "Write persuasive copy that converts and run profitable ad campaigns",
    icon: "📈",
    quote: "أعظم مهارة تصنع الدخل في العالم هي معرفة كيف تحول انتباه الغريب إلى قرار شراء واثق.",
    quoteEn: "The ultimate income skill is turning a stranger's fleeting attention into a confident purchase.",
    salaryRangeAr: "مهارة أساسية مطلوبة في كافة الأنشطة التجارية والمتاجر",
    salaryRangeEn: "Core Growth Skill · High Demand Across E-commerce & Startups",
    superpowersAr: ["كتابة نصوص إعلانية تفهم عقل المشتري", "إطلاق واختبار حملات ميتا وتيك توك", "بناء قنوات تحويل (Funnels) تخفض تكلفة الاستحواذ"],
    superpowersEn: ["Psychological Sales Copywriting", "Meta & TikTok Ad Campaign Setup", "High-Converting Funnel Architecture"],
    recommendedTrackSlugs: ["high-converting-copywriting", "meta-ads-mastery", "growth-hacking-funnels"],
    firstMissionTitleAr: "كتابة أول Hook إعلاني يقنع المشتري بمخاوفه الحقيقية",
    firstMissionTitleEn: "Draft a high-converting ad hook addressing real buyer objections",
    firstMissionGoalAr: "كتابة 3 خطافات إعلانية قوية تمنع تقليب الشاشة وتجبر العميل على القراءة.",
    firstMissionGoalEn: "Craft 3 scroll-stopping ad hooks that convert curiosity into clicks.",
  },
  "coding-web": {
    key: "coding-web",
    title: "مطور تطبيقات الويب والذكاء الاصطناعي",
    titleEn: "Modern Web & AI Apps Developer",
    subtitle: "بناء مواقع وتطبيقات عصرية بأحدث التقنيات وأدوات الـ AI",
    subtitleEn: "Build modern web apps & interactive tools powered by AI",
    icon: "💻",
    quote: "البرمجة مع أدوات الذكاء الاصطناعي أصبحت أسرع 5 أضعاف — الآن يمكنك بناء مشاريع حقيقية في أيام.",
    quoteEn: "Coding with AI is 5x faster — you can now ship full production projects in days.",
    salaryRangeAr: "طلب مستمر ومرتفع في أسواق العمل المحلية والإقليمية",
    salaryRangeEn: "Consistent High Demand · Regional & Remote Web Engineering",
    superpowersAr: ["تطوير واجهات React 19 و Next.js", "ربط واجهات برمجة التطبيقات (APIs)", "استخدام أدوات المطورين الذكية لكتابة كود نظيف"],
    superpowersEn: ["React 19 & Next.js UI Engineering", "API Integration & Backend Wiring", "AI-Assisted Clean Code Development"],
    recommendedTrackSlugs: ["frontend-react-nextjs", "fullstack-javascript", "python-fundamentals"],
    firstMissionTitleAr: "فهم بنية صفحات الويب وتعديل أول كود تفاعلي بيدك",
    firstMissionTitleEn: "Understand interactive UI components and deploy your first live change",
    firstMissionGoalAr: "تعديل مكون تفاعلي مباشر ورؤية نتيجته تعمل على المتصفح في 5 دقائق.",
    firstMissionGoalEn: "Modify a live interactive UI component and see the result instantly in 5 mins.",
  },
  "content-design": {
    key: "content-design",
    title: "صانع المحتوى والفيديو بالذكاء الاصطناعي",
    titleEn: "AI Content & Video Creator",
    subtitle: "إنتاج محتوى بصري وفيديوهات سينمائية دون تكاليف باهظة",
    subtitleEn: "Produce compelling visual content & cinematic AI video without expensive gear",
    icon: "🎬",
    quote: "الإنتاج البصري لم يعد حكرًا على الاستوديوهات الكبرى؛ أدوات اليوم تمنحك استوديو كامل في يدك.",
    quoteEn: "Video production is no longer gated by big studios — you now own a full studio on your laptop.",
    salaryRangeAr: "طلب متسارع جداً في صناعة المحتوى والإعلانات الرقمية",
    salaryRangeEn: "Rapid Growth Domain · High Demand in Media & Video Creation",
    superpowersAr: ["توليد مشاهد فيديو مذهلة بأدوات الذكاء الاصطناعي", "تصميم صور احترافية بـ Midjourney", "مونتاج المحتوى القصير الفيروسي لمنصات السوشيال"],
    superpowersEn: ["Cinematic AI Video Generation", "Midjourney Visual Art Mastery", "Viral Short-Form Video Editing"],
    recommendedTrackSlugs: ["ai-video-creation", "ai-media-midjourney", "short-form-video-editing"],
    firstMissionTitleAr: "توليد أول مشهد وسيناريو إبداعي باستخدام الذكاء الاصطناعي",
    firstMissionTitleEn: "Generate your first cinematic video script & visual prompt with AI",
    firstMissionGoalAr: "كتابة سيناريو 30 ثانية وتوليد الكادر البصري الأول بجودة سينمائية فوراً.",
    firstMissionGoalEn: "Write a 30-second script and generate its visual frame with AI prompts.",
  },
  "habits-focus": {
    key: "habits-focus",
    title: "محترف الإنتاجية والتركيز الفائق",
    titleEn: "High-Output Focus Master",
    subtitle: "بناء عادات ذرية متماسكة وتجاوز عقبات التسويف",
    subtitleEn: "Build consistent atomic habits and overcome procrastination",
    icon: "⚡",
    quote: "الناجحون لا يملكون إرادة خارقة، بل يملكون نظامًا يوميًا يجعل التقدم حتمياً.",
    quoteEn: "Top performers don't rely on willpower; they build daily systems where progress is inevitable.",
    salaryRangeAr: "مهارة جوهرية حاسمة ترفع إنتاجية كل مسار تخصصي آخر",
    salaryRangeEn: "Foundational Skill · Multiplier Effect on All Professional Output",
    superpowersAr: ["بناء بيئة عمل عميق خالية من المشتتات", "تنظيم صخرة اليوم الذهبية وتفويض الباقي", "الحفاظ على الطاقة الذهنية دون احتراق نفسي"],
    superpowersEn: ["Distraction-Free Deep Work Systems", "Single-Task Golden Priority Daily Execution", "Cognitive Energy & Burnout Protection"],
    recommendedTrackSlugs: ["atomic-habits-relentless-focus", "deep-work-unbreakable-focus", "productivity-operating-system"],
    firstMissionTitleAr: "تحديد صخرة اليوم الذهبية والتخلص من مشتتات السوشيال ميديا",
    firstMissionTitleEn: "Define your daily single priority and build an unbroken focus habit",
    firstMissionGoalAr: "تنظيم جدول عملك اليومي وإتمام أهم مهمة في 45 دقيقة بدون فتح الهاتف.",
    firstMissionGoalEn: "Structure your daily golden priority and complete it in 45 focused minutes.",
  },
};

export function computeArchetype(answers: Record<string, string>): Archetype {
  const goal = answers.goal ?? "ai-work";
  return archetypes[goal] ?? archetypes["ai-work"];
}

export function computeReadinessScore(answers: Record<string, string>): number {
  let score = 70;
  if (answers.experience === "intermediate") score += 12;
  if (answers.experience === "advanced") score += 18;
  if (answers.daily_time === "20-30-mins") score += 10;
  return Math.min(96, score);
}
