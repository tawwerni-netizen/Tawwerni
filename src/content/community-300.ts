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
    quoteAr: "كنت دائماً أبدأ كورسات 40 ساعة وأتوقف في الأسبوع الأول. أسلوب الـ 5 دقائق يومياً في طوّرني جعلني أنهي مسار الـ Next.js بدون أي ملل، ونفذت به أول مشروع بمبلغ 650 دولار على أب ورك.",
    quoteEn: "I used to buy 40-hour video courses and quit on day 3. Tawwerni's 5-minute daily structure helped me master Next.js without burnout, landing my first $650 contract on Upwork.",
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
    quoteAr: "كنت أحرق ميزانية الإعلانات دون تحقيق مبيعات حقيقية. بعد مسار إعلانات ميتا وتطبيق هيكل اختبار الكريتيف، انخفضت تكلفة الشراء لدينا بنسبة 45% وتضاعفت مبيعات المتجر.",
    quoteEn: "I was burning ad spend with zero returns. After taking the Meta Ads track and applying the creative testing matrix, our acquisition cost dropped 45% while sales doubled.",
  },
  {
    archetype: "freelancer",
    roleAr: "كاتبة محتوى إعلاني وسيناريو",
    roleEn: "Freelance Copywriter",
    trackSlug: "high-converting-copywriting",
    trackTitleAr: "كتابة النصوص الإعلانية والإقناعية",
    trackTitleEn: "High-Converting Sales Copywriting",
    quoteAr: "المسار لم يعلمني فقط كيف أكتب، بل كيف أفكر في عقل المشتري ومخاوفه. أول نص إعلاني كتبته لعميل في الخليج حقق له مبيعات بقيمة 12 ألف ريال في 48 ساعة فقط.",
    quoteEn: "The track didn't just teach me how to write, but how to enter the buyer's subconscious mind. My first campaign script generated 12,000 SAR in 48 hours for a Gulf client.",
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
    quoteAr: "تخرجت وأنا محتارة كيف أبدأ. المسار وضع يدي على أول خطوة، وبنيت معرض أعمالي في أسبوعين. اليوم أعمل مستقلة بدخل يتجاوز ضعف الراتب التقليدي الذي عُرض علي.",
    quoteEn: "I graduated feeling completely lost. This track guided my first steps, and I launched my portfolio in 14 days. Today my freelance income is more than double the starting local salary offered to me.",
  },
  {
    archetype: "founder",
    roleAr: "شريك مؤسس لوكالة تسويق",
    roleEn: "Agency Co-Founder",
    trackSlug: "high-ticket-pricing-packaging",
    trackTitleAr: "تسعير الخدمات وباقات القيمة المرتفعة",
    trackTitleEn: "High-Ticket Pricing & Packaging",
    quoteAr: "غيرنا نظام التسعير من الساعات إلى القيمة المضافة كما يشرح المسار تماماً. رفعنا أسعار باقاتنا 3 أضعاف، والمفاجأة أن العملاء أصبحوا أكثر التزاماً وجدية في التعامل.",
    quoteEn: "We pivoted from hourly rates to value pricing exactly as taught. We tripled our service packages, and to our surprise, clients became far more respectful and committed.",
  },
  {
    archetype: "freelancer",
    roleAr: "مصمم تجربة مستخدم (UI/UX)",
    roleEn: "UI/UX Designer",
    trackSlug: "ui-ux-design-figma",
    trackTitleAr: "أساسيات وتصميم تجربة المستخدم (Figma)",
    trackTitleEn: "UI/UX Design Fundamentals",
    quoteAr: "تفاصيل الـ Auto-Layout والـ Design Tokens مشروحة بأمثلة واقعية جداً. أنهيت المسار ونفذت إعادة تصميم كاملة لتطبيق تجاري، وأضفتها لملفي الشخصي ونلت إشادة واسعة.",
    quoteEn: "Auto-Layout and Design Tokens were broken down with crystal-clear practical examples. Redesigned a commercial SaaS app for my portfolio and received tremendous client feedback.",
  },
  {
    archetype: "employee",
    roleAr: "مسؤول أمن معلومات",
    roleEn: "Cybersecurity Analyst",
    trackSlug: "ethical-hacking-penetration-testing",
    trackTitleAr: "مقدمة في الاختبار الاختراقي الأخلاقي",
    trackTitleEn: "Ethical Hacking & Pen-Testing",
    quoteAr: "المسار يبدأ من الأساسيات ويأخذك لبيئة الاختبار العملي بخطوات محسوبة دون تعقيد نظري. ساعدني في اجتياز المقابلة الفنية لوظيفتي الحالية في بنك استثماري.",
    quoteEn: "Progresses from foundations to hands-on lab tests without academic fluff. Directly helped me ace the technical whiteboard interview for my current role at an investment bank.",
  },
  {
    archetype: "founder",
    roleAr: "مؤسس استوديو ميديا",
    roleEn: "Creative Studio Founder",
    trackSlug: "ai-video-creation",
    trackTitleAr: "صناعة الفيديو والأنيميشن بالذكاء الاصطناعي",
    trackTitleEn: "AI Video Creation & Animation",
    quoteAr: "أصبحنا ننتج مشاهد وإعلانات فيديو كاملة لعملائنا في يومين بدلاً من أسبوعين من التصوير الميداني والتكاليف الباهظة. الاستثمار في هذا المسار عاد علينا بمكاسب فورية.",
    quoteEn: "We now produce commercial video clips for brands in two days instead of two weeks of expensive physical shoots. The return on investment on this track was immediate.",
  },
  {
    archetype: "employee",
    roleAr: "مدير مبيعات B2B",
    roleEn: "B2B Sales Director",
    trackSlug: "b2b-sales-pipeline-crm",
    trackTitleAr: "مبيعات الشركات وإدارة خط الصفقات",
    trackTitleEn: "B2B Sales Pipeline & CRM Mastery",
    quoteAr: "طريقة إدارة المكالمة الاستكشافية وتأهيل ميزانية العميل الموضحة في الكورس أغلقت لنا صفقتين سنويتين في أول شهر من التطبيق.",
    quoteEn: "The discovery call frameworks and budget-qualification questions directly closed two annual enterprise retainers in our very first month.",
  },
  {
    archetype: "student",
    roleAr: "طالبة في كلية الإعلام",
    roleEn: "Mass Comm Student",
    trackSlug: "short-form-video-editing",
    trackTitleAr: "مونتاج الفيديو القصير لصناع المحتوى",
    trackTitleEn: "Short-Form Video Editing",
    quoteAr: "تعلمت كيف أقطع الفيديو بدقة وأضيف النصوص المتحركة والمؤثرات الصوتية. حسابي على تيك توك كبر من 200 متابع إلى 45 ألف في أقل من شهرين.",
    quoteEn: "Learned pacing, sound design, and kinetic typography. My TikTok channel grew from 200 to 45,000 engaged followers in under two months.",
  },
  {
    archetype: "freelancer",
    roleAr: "مترجم ومحرر نصوص",
    roleEn: "Translator & Localization Specialist",
    trackSlug: "ai-workplace-productivity",
    trackTitleAr: "مضاعفة إنتاجية العمل اليومي بالذكاء الاصطناعي",
    trackTitleEn: "AI Workplace Productivity",
    quoteAr: "الذكاء الاصطناعي لم يستبدلني بل ضاعف سرعتي 4 مرات. أصبحت أسلم مشاريع الترجمة والمراجعة في ساعات بدلاً من أيام، وزادت أرباحي الشهرية بشكل ملحوظ.",
    quoteEn: "AI didn't replace me; it gave me 4x leverage. I now deliver localization projects in hours instead of days, substantially increasing my monthly revenue.",
  },
  {
    archetype: "founder",
    roleAr: "صاحبة علامة تجارية للعناية بالبشرة",
    roleEn: "Skincare Brand Founder",
    trackSlug: "tiktok-ads-viral-marketing",
    trackTitleAr: "إعلانات تيك توك والمحتوى الفيروسي",
    trackTitleEn: "TikTok Ads & Viral Marketing",
    quoteAr: "الفيديوهات التي طبقنا فيها أسلوب الـ UGC كما في الدرس حققت لنا أول فيديو فيروسي بمليون مشاهدة ونفد مخزون أول دفعة من منتجاتنا في 3 أيام!",
    quoteEn: "The native UGC angles we implemented generated our first million-view viral hit, selling out our entire inventory batch in 3 days!",
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
