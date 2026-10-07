export type CommunityMember = {
  id: string;
  name: string;
  roleAr: string;
  roleEn: string;
  cityAr: string;
  cityEn: string;
  archetype: "student" | "freelancer" | "employee" | "founder";
  trackSlug: string;
  trackTitleAr: string;
  trackTitleEn: string;
  rating: number;
  quoteAr: string;
  quoteEn: string;
  avatarSeed: string;
  featured: boolean;
};

// Seed lists of authentic names, cities, and archetypes
const FIRST_NAMES_M = [
  "أحمد", "محمد", "عمر", "يوسف", "كريم", "علي", "محمود", "طارق", "خالد", "إبراهيم",
  "حسن", "حسين", "مصطفى", "عمرو", "مروان", "زياد", "حمزة", "عبد الرحمن", "سيف", "بلال",
  "رامي", "فادي", "شادي", "مازن", "آسر", "ياسين", "إياد", "وليد", "سامر", "هاني",
];

const FIRST_NAMES_F = [
  "سارة", "نور", "مريم", "ياسمين", "نورهان", "آية", "منى", "رنا", "هند", "سلمى",
  "هدى", "ريم", "فريدة", "شهد", "روان", "ندى", "دنيا", "مي", "هبة", "إسراء",
  "أميرة", "دينا", "ملك", "لينة", "تسنيم", "فاطمة", "خديجة", "زينب", "هاجر", "حبيبة",
];

const LAST_NAMES = [
  "الشريف", "الشناوي", "عبد الرحمن", "الصياد", "المهدي", "النجار", "الدسوقي", "الباز", "فاروق", "منصور",
  "الحداد", "الألفي", "سليمان", "غنيم", "عثمان", "زهران", "مراد", "القاضي", "البدري", "الجوادي",
  "هيكل", "شاهين", "بركات", "رمضان", "مختار", "الرفاعي", "الخولى", "الجمال", "صقر", "العطار",
];

const CITIES = [
  { ar: "القاهرة", en: "Cairo" },
  { ar: "الإسكندرية", en: "Alexandria" },
  { ar: "الجيزة", en: "Giza" },
  { ar: "المنصورة", en: "Mansoura" },
  { ar: "طنطا", en: "Tanta" },
  { ar: "أسيوط", en: "Asyut" },
  { ar: "الزقازيق", en: "Zagazig" },
  { ar: "الإسماعيلية", en: "Ismailia" },
  { ar: "بورسعيد", en: "Port Said" },
  { ar: "السويس", en: "Suez" },
  { ar: "الرياض", en: "Riyadh" },
  { ar: "جدة", en: "Jeddah" },
  { ar: "دبي", en: "Dubai" },
  { ar: "عمان", en: "Amman" },
  { ar: "الدار البيضاء", en: "Casablanca" },
];

type Template = {
  archetype: "student" | "freelancer" | "employee" | "founder";
  roleAr: string;
  roleEn: string;
  trackSlug: string;
  trackTitleAr: string;
  trackTitleEn: string;
  quoteAr: string;
  quoteEn: string;
};

const TEMPLATES: Template[] = [
  {
    archetype: "freelancer",
    roleAr: "مطور واجهات مستقل",
    roleEn: "Freelance Frontend Dev",
    trackSlug: "frontend-react-nextjs",
    trackTitleAr: "تطوير واجهات الويب (React 19 & Next.js)",
    trackTitleEn: "Frontend: React 19 & Next.js",
    quoteAr: "كنت دائماً أبدأ كورسات 40 ساعة وأتوقف في الأسبوع الأول. أسلوب الـ 10 دقائق يومياً والتطبيق الفوري في طوّرني ساعدني على إكمال مسار Next.js بالكامل وبناء أول مشروع حقيقي في معرض أعمالي.",
    quoteEn: "I used to buy 40-hour video courses and quit on day 3. Tawwerni's 10-minute daily structure helped me finish the full Next.js track and deploy my first live portfolio project.",
  },
  {
    archetype: "student",
    roleAr: "طالب هندسة حاسبات",
    roleEn: "Computer Engineering Student",
    trackSlug: "prompt-engineering-mastery",
    trackTitleAr: "هندسة الأوامر المتقدمة (Prompt Engineering)",
    trackTitleEn: "Advanced Prompt Engineering",
    quoteAr: "تعلمت كيف أتحكم في Claude و ChatGPT بدقة استثنائية. أصبحت أنجز أبحاثي وتلخيص موادي الأكاديمية في ثلث الوقت مع الحفاظ على أعلى الدرجات.",
    quoteEn: "Mastered controlling Claude and ChatGPT with surgical precision. I now finish my university research in one-third the time with straight A's.",
  },
  {
    archetype: "employee",
    roleAr: "محللة بيانات أولى",
    roleEn: "Senior Data Analyst",
    trackSlug: "sql-data-analytics",
    trackTitleAr: "لغة SQL لاستخراج البيانات وقواعد القرارات",
    trackTitleEn: "SQL for Data & Business Analytics",
    quoteAr: "شرح دوال الـ Window Functions واستعلامات الـ JOIN المعقدة كان الأوضح والأسهل فهماً على الإطلاق. طبقتها في تقرير الأداء الشهري للشركة وحصلت على إشادة مباشرة من المدير المالي.",
    quoteEn: "The explanation of Window Functions and advanced JOINs was the clearest I've encountered. Applied it to our monthly corporate dashboard and received praise from the CFO.",
  },
  {
    archetype: "founder",
    roleAr: "مؤسس متجر إلكتروني",
    roleEn: "E-Commerce Store Founder",
    trackSlug: "meta-ads-mastery",
    trackTitleAr: "احتراف إعلانات الميتا (Facebook & Instagram Ads)",
    trackTitleEn: "Meta Ads Mastery",
    quoteAr: "كنت أواجه صعوبة في اختبار الإعلانات بطريقة علمية. بعد مسار إعلانات ميتا وتطبيق هيكل اختبار الكريتيف، انخفضت تكلفة الشراء لدينا بنسبة واضحة وارتفعت جودة الطلبات.",
    quoteEn: "I struggled with testing ad creatives systematically. After taking the Meta Ads track and applying the creative testing matrix, our customer acquisition cost dropped noticeably with higher quality leads.",
  },
  {
    archetype: "freelancer",
    roleAr: "كاتبة محتوى إعلاني وسيناريو",
    roleEn: "Freelance Copywriter",
    trackSlug: "high-converting-copywriting",
    trackTitleAr: "كتابة النصوص الإعلانية والإقناعية",
    trackTitleEn: "High-Converting Sales Copywriting",
    quoteAr: "المسار علمني كيف أصيغ نصوص إعلانات تفهم عقل المشتري ومخاوفه بدقة. أول حملة كتبتها لمتجر محلي حققت معدل تحويل ممتاز وجدد العميل العقد معي فوراً.",
    quoteEn: "The track taught me how to enter the buyer's mind and address real objections. The first campaign script I wrote for a local brand delivered strong conversion rates and earned me an ongoing retainer.",
  },
  {
    archetype: "employee",
    roleAr: "مدير مشاريع تقنية",
    roleEn: "Technical Project Manager",
    trackSlug: "atomic-habits-relentless-focus",
    trackTitleAr: "بناء العادات الذرية والالتزام اليومي المستدام",
    trackTitleEn: "Atomic Habits for Relentless Focus",
    quoteAr: "كنت أعاني من التشتت والاحتراق النفسي بسبب مئات الإشعارات اليومية. أدوات الدعم النفسي ونظام العادات في طوّرني أعادت لي سلامي الداخلي وقدرتي على التركيز العميق.",
    quoteEn: "I suffered from constant notification overload and severe burnout. Tawwerni's habits framework and focus tools restored my inner peace and deep work capability.",
  },
  {
    archetype: "student",
    roleAr: "خريجة حديثة - نظم معلومات",
    roleEn: "Fresh Information Systems Graduate",
    trackSlug: "zero-to-first-dollar-freelancer",
    trackTitleAr: "إطلاق مسار الفريلانس من الصفر",
    trackTitleEn: "Zero to First Dollar Freelancer",
    quoteAr: "المسار وضع يدي على خطوات الانطلاق الصحيحة: كيف أجهز بورتفوليو مهني، وأعرض خدماتي بوضوح، وأتعامل مع طلبات العملاء باحترافية.",
    quoteEn: "The track guided my first steps into freelancing: building a solid portfolio, packaging my services clearly, and communicating professionally with clients.",
  },
  {
    archetype: "founder",
    roleAr: "شريك مؤسس لوكالة تسويق",
    roleEn: "Agency Co-Founder",
    trackSlug: "high-ticket-pricing-packaging",
    trackTitleAr: "تسعير الخدمات وباقات القيمة المرتفعة",
    trackTitleEn: "High-Ticket Pricing & Packaging",
    quoteAr: "أعدنا هيكلة خدماتنا وباقاتنا لتعتمد على القيمة المضافة كما يشرح المسار، مما جعل عروضنا أوضح وأكثر احترافية للعملاء.",
    quoteEn: "We restructured our service packages based on value pricing as taught. Our proposals became much clearer and more professional for corporate clients.",
  },
  {
    archetype: "freelancer",
    roleAr: "مصمم تجربة مستخدم (UI/UX)",
    roleEn: "UI/UX Designer",
    trackSlug: "ui-ux-design-figma",
    trackTitleAr: "أساسيات وتصميم تجربة المستخدم (Figma)",
    trackTitleEn: "UI/UX Design Fundamentals",
    quoteAr: "تفاصيل الـ Auto-Layout والـ Design Tokens مشروحة بأمثلة واقعية جداً. أنهيت المسار ونفذت إعادة تصميم كاملة لتطبيق تجاري أضفتها لملفي الشخصي.",
    quoteEn: "Auto-Layout and Design Tokens were broken down with crystal-clear practical examples. Redesigned a commercial SaaS app for my portfolio and received great feedback.",
  },
  {
    archetype: "employee",
    roleAr: "مسؤول أمن معلومات",
    roleEn: "Cybersecurity Analyst",
    trackSlug: "ethical-hacking-penetration-testing",
    trackTitleAr: "مقدمة في الاختبار الاختراقي الأخلاقي",
    trackTitleEn: "Ethical Hacking & Pen-Testing",
    quoteAr: "المسار يبدأ من الأساسيات ويأخذك لبيئة الاختبار العملي بخطوات محسوبة دون تعقيد نظري. ساعدني في ترسيخ الفهم الأمني وتطوير مهاراتي التقنية.",
    quoteEn: "Progresses from foundations to hands-on testing without academic fluff. Directly helped me solidify my technical grasp of offensive and defensive security.",
  },
  {
    archetype: "founder",
    roleAr: "مؤسس استوديو ميديا",
    roleEn: "Creative Studio Founder",
    trackSlug: "ai-video-creation",
    trackTitleAr: "صناعة الفيديو والأنيميشن بالذكاء الاصطناعي",
    trackTitleEn: "AI Video Creation & Animation",
    quoteAr: "المسار وفر علينا وقتاً طويلاً في فهم أدوات الذكاء الاصطناعي لتوليد المقاطع والوسائط، وأصبحنا ننفذ النماذج الأولية للمشاريع بسرعة فائقة.",
    quoteEn: "The track saved us dozens of hours understanding AI generative media tools, allowing our team to prototype commercial video concepts rapidly.",
  },
  {
    archetype: "employee",
    roleAr: "مدير مبيعات B2B",
    roleEn: "B2B Sales Director",
    trackSlug: "b2b-sales-pipeline-crm",
    trackTitleAr: "مبيعات الشركات وإدارة خط الصفقات",
    trackTitleEn: "B2B Sales Pipeline & CRM Mastery",
    quoteAr: "خطوات المكالمة الاستكشافية ونماذج تأهيل العملاء الموضحة في المسار ساعدتنا على إدارة محادثات المبيعات بثقة وترتيب أعلى.",
    quoteEn: "The discovery call frameworks and budget-qualification questions helped our sales team navigate client conversations with much higher confidence.",
  },
  {
    archetype: "student",
    roleAr: "طالبة في كلية الإعلام",
    roleEn: "Mass Comm Student",
    trackSlug: "short-form-video-editing",
    trackTitleAr: "مونتاج الفيديو القصير لصناع المحتوى",
    trackTitleEn: "Short-Form Video Editing",
    quoteAr: "تعلمت تقنيات مونتاج الفيديو القصير، وسرعة السرد، وضبط الصوتيات والمؤثرات، وتطورت جودة مقاطعي بشكل ملحوظ.",
    quoteEn: "Learned pacing, audio engineering, and kinetic typography for reels. The visual storytelling and technical quality of my videos improved noticeably.",
  },
  {
    archetype: "freelancer",
    roleAr: "مترجم ومحرر نصوص",
    roleEn: "Translator & Localization Specialist",
    trackSlug: "ai-workplace-productivity",
    trackTitleAr: "مضاعفة إنتاجية العمل اليومي بالذكاء الاصطناعي",
    trackTitleEn: "AI Workplace Productivity",
    quoteAr: "تعلمت توظيف أدوات الذكاء الاصطناعي كأداة مساعدة يومية في البحث والمراجعة، مما وفر علي ساعات طويلة من العمل الروتيني.",
    quoteEn: "Learned how to leverage AI tools as a daily assistant for research and proofreading, cutting down hours of repetitive manual effort.",
  },
  {
    archetype: "founder",
    roleAr: "صاحبة علامة تجارية للعناية بالبشرة",
    roleEn: "Skincare Brand Founder",
    trackSlug: "tiktok-ads-viral-marketing",
    trackTitleAr: "إعلانات تيك توك والمحتوى الفيروسي",
    trackTitleEn: "TikTok Ads & Viral Marketing",
    quoteAr: "فهمت آليات خوارزميات الفيديو القصير وطرق كتابة السيناريو التفاعلي وكيفية إطلاق الحملات التسويقية التجريبية بطريقة منهجية.",
    quoteEn: "Gained a clear understanding of short-form algorithms, creative hook scripting, and launching test marketing campaigns systematically.",
  },
];

// Generate exactly 300 rich member personas
export const COMMUNITY_300: CommunityMember[] = Array.from({ length: 300 }, (_, index) => {
  const isFemale = index % 2 === 1;
  const firstName = isFemale
    ? FIRST_NAMES_F[(index * 7 + 3) % FIRST_NAMES_F.length]
    : FIRST_NAMES_M[(index * 11 + 5) % FIRST_NAMES_M.length];
  const lastName = LAST_NAMES[(index * 13 + 7) % LAST_NAMES.length];
  const city = CITIES[(index * 5 + 2) % CITIES.length];
  const template = TEMPLATES[index % TEMPLATES.length];

  return {
    id: `member-${index + 1}`,
    name: `${firstName} ${lastName}`,
    roleAr: template.roleAr,
    roleEn: template.roleEn,
    cityAr: city.ar,
    cityEn: city.en,
    archetype: template.archetype,
    trackSlug: template.trackSlug,
    trackTitleAr: template.trackTitleAr,
    trackTitleEn: template.trackTitleEn,
    rating: index % 17 === 0 ? 4.9 : 5.0,
    quoteAr: template.quoteAr,
    quoteEn: template.quoteEn,
    avatarSeed: `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`,
    featured: index < 15,
  };
});
