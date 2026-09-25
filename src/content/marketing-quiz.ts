export type QuizOption = {
  icon?: string;
  label: string;
  labelEn?: string;
  value: string;
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
    id: "ai_today",
    question: "الذكاء الاصطناعي بالنسبالك دلوقتي إيه؟",
    questionEn: "What is your current relationship with Artificial Intelligence?",
    subtitle: "جاوب بصراحة — النتيجة هتتبني على ده",
    subtitleEn: "Answer honestly — your personalized roadmap depends on this",
    options: [
      { icon: "🌫️", label: "كلام بسمعه كتير ومش عارف أستخدمه", labelEn: "A buzzword I hear everywhere but don't know how to use", value: "aware-unused" },
      { icon: "🧪", label: "جرّبته مرة أو اتنين وسيبته", labelEn: "Tried it once or twice, then stopped", value: "tried-quit" },
      { icon: "🔁", label: "بستخدمه في حاجات بسيطة", labelEn: "I use it occasionally for basic tasks", value: "casual" },
      { icon: "⚡", label: "بستخدمه يوميًا وعايز أطوّر", labelEn: "I use it daily and want to reach mastery", value: "daily" },
      { icon: "😟", label: "قلقان منه على شغلي", labelEn: "Worried it might threaten my job security", value: "worried" },
    ],
  },
  {
    id: "goal",
    question: "إيه هدفك الأساسي من الذكاء الاصطناعي؟",
    questionEn: "What is your primary goal with AI & modern skills?",
    options: [
      { icon: "📈", label: "أتقدّم في وظيفتي الحالية", labelEn: "Excel and get promoted in my current career", value: "grow-role" },
      { icon: "🔄", label: "أغيّر مساري المهني أو أترقّى", labelEn: "Pivot into a high-paying future career", value: "career-change" },
      { icon: "💰", label: "أبني مشروع أو دخل إضافي", labelEn: "Build a profitable side-hustle or online business", value: "build-income" },
      { icon: "🎨", label: "أستخدمه في مشاريع إبداعية", labelEn: "Supercharge my creative projects and content", value: "creative" },
      { icon: "🛡️", label: "أفضل مطّلع ومتأخرش عن الركب", labelEn: "Stay ahead of the curve and future-proof myself", value: "stay-informed" },
      { icon: "✳️", label: "حاجة تانية", labelEn: "Something else", value: "other" },
    ],
  },
  {
    id: "field",
    question: "بتشتغل في مجال إيه؟",
    questionEn: "Which industry or field do you operate in?",
    options: [
      { icon: "💻", label: "تقنية وبرمجة", labelEn: "Tech, Software & IT", value: "tech" },
      { icon: "💳", label: "مالية ومحاسبة", labelEn: "Finance & Accounting", value: "finance" },
      { icon: "📣", label: "تسويق وإعلام", labelEn: "Marketing, Media & Growth", value: "marketing" },
      { icon: "🏥", label: "صحة وطب", labelEn: "Healthcare & Medicine", value: "health" },
      { icon: "📚", label: "تعليم وتدريب", labelEn: "Education & Coaching", value: "education" },
      { icon: "📊", label: "مبيعات وتطوير أعمال", labelEn: "Sales & Business Development", value: "sales" },
      { icon: "⚙️", label: "عمليات وإدارة", labelEn: "Operations & Management", value: "operations" },
      { icon: "🌐", label: "حاجة تانية", labelEn: "Other discipline", value: "other" },
    ],
  },
  {
    id: "age",
    question: "كم عمرك؟",
    questionEn: "What is your age bracket?",
    options: [
      { label: "أقل من ٢٥ سنة", labelEn: "Under 25", value: "under25" },
      { label: "٢٥ – ٣٤ سنة", labelEn: "25 – 34", value: "25-34" },
      { label: "٣٥ – ٤٤ سنة", labelEn: "35 – 44", value: "35-44" },
      { label: "٤٥ – ٥٤ سنة", labelEn: "45 – 54", value: "45-54" },
      { label: "٥٥ سنة فأكثر", labelEn: "55+", value: "55plus" },
    ],
  },
  {
    id: "comfort",
    question: "إيه مستوى راحتك مع أدوات التكنولوجيا والذكاء الاصطناعي؟",
    questionEn: "How comfortable are you using modern tech tools?",
    options: [
      { icon: "💪", label: "مرتاح جدًا وسريع التعلّم", labelEn: "Very confident and quick to adapt", value: "very-comfortable" },
      { icon: "🙂", label: "بتدبر أموري، بس بواجه صعوبة أحيانًا", labelEn: "I manage, but struggle sometimes", value: "manage" },
      { icon: "😅", label: "بواجه صعوبة ومحتاج تبسيط خطوة بخطوة", labelEn: "I find it overwhelming and need step-by-step guidance", value: "struggle" },
      { icon: "👀", label: "لسه ما جربتش تقريبًا", labelEn: "Complete beginner, haven't tried yet", value: "barely-tried" },
    ],
  },
  {
    id: "worry",
    question: "قد إيه قلقان إن الذكاء الاصطناعي يأثر على وظيفتك أو دخلك؟",
    questionEn: "How concerned are you about AI disrupting your role or income?",
    options: [
      { icon: "😱", label: "قلقان جدًا ومحتاج حل سريع", labelEn: "Extremely concerned — I need to take action now", value: "very-worried" },
      { icon: "😟", label: "قلقان إلى حد ما", labelEn: "Somewhat concerned", value: "somewhat-worried" },
      { icon: "🤷", label: "مش قلقان أوي", labelEn: "Not particularly worried", value: "a-little" },
      { icon: "🚀", label: "مش قلقان خالص — بشوفه أعظم فرصة لصنع ثروة", labelEn: "Not worried at all — I see it as a massive opportunity", value: "opportunity" },
    ],
  },
  {
    id: "experience",
    question: "إيه اللي بيوصف خبرتك مع الذكاء الاصطناعي لحد دلوقتي؟",
    questionEn: "How would you describe your AI experience so far?",
    options: [
      { icon: "🌱", label: "مبتدئ تمامًا من الصفر", labelEn: "Total beginner from scratch", value: "beginner" },
      { icon: "🔍", label: "جربت كذا أداة وموقع", labelEn: "Experimented with a few popular tools", value: "tried-few" },
      { icon: "⚡", label: "باستخدمه بانتظام في يومي", labelEn: "Regular user in daily workflow", value: "regular" },
      { icon: "🛠️", label: "ببني سير عمل وأتمتة متقدمة", labelEn: "Advanced user building automations and workflows", value: "advanced" },
    ],
  },
  {
    id: "favoriteTool",
    question: "إيه الأداة اللي انت أكتر واحدة متعرّف عليها أو بتسمع عنها؟",
    questionEn: "Which AI tool are you most familiar with or curious about?",
    options: [
      { icon: "🤔", label: "لسه جديد على كل الأدوات دي", labelEn: "Completely new to these tools", value: "new" },
      { label: "ChatGPT & OpenAI", labelEn: "ChatGPT & OpenAI", value: "chatgpt" },
      { label: "Claude AI", labelEn: "Claude AI", value: "claude" },
      { label: "Google Gemini", labelEn: "Google Gemini", value: "gemini" },
      { label: "Microsoft Copilot", labelEn: "Microsoft Copilot", value: "copilot" },
      { label: "Midjourney & Image Gen", labelEn: "Midjourney & Creative AI", value: "midjourney" },
    ],
  },
  {
    id: "blocker",
    question: "إيه أكبر عائق واقف قدام استمرارك في التعلّم؟",
    questionEn: "What is your biggest roadblock to consistent learning?",
    options: [
      { icon: "🗺️", label: "مفيش نظام أو خطة يومية واضحة ومحددة", labelEn: "Lack of a structured daily roadmap", value: "no-plan" },
      { icon: "⏰", label: "مفيش وقت كفاية في يومي", labelEn: "Not enough time in my busy day", value: "no-time" },
      { icon: "😵", label: "حاسس إنه معقد ومليان كلام نظري", labelEn: "Feels overly complex and theoretical", value: "too-complex" },
      { icon: "🤷", label: "مش عارف أبدأ منين بالظبط", labelEn: "Information overload — don't know where to start", value: "dont-know-start" },
    ],
  },
  {
    id: "stage",
    question: "إيه اللي بيوصف وضعك الحالي بالظبط؟",
    questionEn: "Which statement best describes your current career stage?",
    options: [
      { icon: "🎓", label: "طالب أو خريج جديد بستكشف سوق العمل", labelEn: "Student or recent graduate entering the job market", value: "student" },
      { icon: "💼", label: "في وظيفة وبابني مسيرتي المهنية", labelEn: "Employed professional building my career", value: "building-career" },
      { icon: "👥", label: "مدير أو قائد فريق مسؤول عن نتائج", labelEn: "Manager or team lead driving results", value: "manager" },
      { icon: "🏢", label: "صاحب مشروع خاص أو فريلانسر حر", labelEn: "Business owner or independent freelancer", value: "business-owner" },
      { icon: "🌀", label: "في مرحلة تحول وببحث عن بداية جديدة", labelEn: "In career transition seeking a fresh start", value: "transitioning" },
    ],
  },
  {
    id: "firstHelp",
    question: "عايز الذكاء الاصطناعي يساعدك في إيه الأول؟",
    questionEn: "Where do you want AI to make the biggest immediate impact?",
    options: [
      { icon: "✍️", label: "الكتابة وصناعة المحتوى الاحترافي", labelEn: "Professional writing & content creation", value: "writing" },
      { icon: "📊", label: "تحليل البيانات والبحث الدقيق السريع", labelEn: "Data analysis & rapid research", value: "research" },
      { icon: "🎨", label: "تصميم الجرافيكس والصور والإبداع", labelEn: "Design, graphics & visual creation", value: "creative" },
      { icon: "⚙️", label: "أتمتة المهام الروتينية وتوفير الساعات", labelEn: "Automating repetitive tasks & saving hours", value: "automation" },
      { icon: "🧠", label: "التعلّم والمذاكرة بشكل أسرع وأذكى ٣ أضعاف", labelEn: "Learning & studying 3x faster and smarter", value: "learning" },
    ],
  },
  {
    id: "biggestConcern",
    question: "لما تفكر في مستقبلك مع التكنولوجيا، إيه أكتر حاجة بتشغل تفكيرك؟",
    questionEn: "When thinking about your career future, what is your main concern?",
    options: [
      { icon: "🏃", label: "إن غيري يسبقني في المهارات الجديدة", labelEn: "Falling behind peers who adopt newer skills", value: "colleagues-ahead" },
      { icon: "🤖", label: "إن وظيفتي تتمتت وتقل الحاجة إليها", labelEn: "My role becoming automated or obsolete", value: "role-automated" },
      { icon: "📉", label: "عدم امتلاك مهارات دخل حقيقية تضمن مستقبلي", labelEn: "Lacking high-value income skills for the future", value: "skills-gap" },
      { icon: "💡", label: "مفيش قلق — شايفها فرصة عظيمة للتميز والتفوق", labelEn: "No anxiety — I see this as the ultimate competitive edge", value: "advantage" },
    ],
  },
  {
    id: "triedBefore",
    question: "هل جربت كورسات أو محتوى لتعليم التكنولوجيا قبل كده؟",
    questionEn: "Have you attempted learning tech or AI skills before?",
    options: [
      { icon: "🆕", label: "لأ، دي أول تجربة حقيقية ليا", labelEn: "No, this is my first real attempt", value: "first-time" },
      { icon: "📺", label: "نعم، من يوتيوب ومقالات مجانية بس بدون نظام", labelEn: "Yes, free YouTube videos & blogs without structure", value: "free-content" },
      { icon: "💳", label: "نعم، اشتريت كورس مدفوع وما كملتوش", labelEn: "Yes, enrolled in a paid course but didn't finish", value: "paid-course" },
      { icon: "🔧", label: "باستخدم بعض الأدوات، بس محتاج نظام احترافي كامل", labelEn: "I use tools, but crave a complete, structured system", value: "want-structure" },
    ],
  },
  {
    id: "onlineLearning",
    question: "ما هو مدى تقبلك للتعلم التفاعلي عبر الإنترنت؟",
    questionEn: "How comfortable are you with online interactive micro-learning?",
    options: [
      { icon: "✅", label: "مرتاح جدًا وبتعلم أونلاين بانتظام", labelEn: "Very comfortable — I learn online regularly", value: "always" },
      { icon: "🤔", label: "مستعد وجاهز لتجربة نظام منظم ومريح", labelEn: "Eager to try a structured, friction-free system", value: "open" },
      { icon: "🙈", label: "بفضّل التدريب العملي المباشر بدون حشو نظري", labelEn: "Prefer 100% hands-on tasks with zero theoretical fluff", value: "prefer-hands-on" },
    ],
  },
  {
    id: "sevenDayGoal",
    question: "ما هي النتيجة الملموسة التي ترغب بتحقيقها في أول ٧ أيام؟",
    questionEn: "What concrete win do you want within your first 7 days?",
    options: [
      { icon: "💬", label: "كتابة أوامر ذكاء اصطناعي (Prompts) احترافية", labelEn: "Writing professional AI prompts that produce magic", value: "first-prompt" },
      { icon: "⚙️", label: "أتمتة مهمة كاملة في شغلي وتوفير ساعات أسبوعية", labelEn: "Automating a complete work task to save hours weekly", value: "automate-task" },
      { icon: "✍️", label: "إنتاج محتوى وتصاميم متميزة بجودة احترافية", labelEn: "Producing studio-quality content and visual assets", value: "create-content" },
      { icon: "💡", label: "إطلاق أول مشروع جانبي أو خدمة للعمل الحر", labelEn: "Launching a monetizable freelance gig or side-project", value: "start-side-project" },
    ],
  },
  {
    id: "incomeTarget",
    question: "كم تتمنى أن يكون الدخل الإضافي الشهري الذي تطمح لتحقيقه؟",
    questionEn: "What monthly supplemental income would make a real difference?",
    options: [
      { icon: "🪙", label: "٢,٠٠٠ إلى ٥,٠٠٠ ج.م شهريًا (بداية ممتازة)", labelEn: "$100 – $250 / mo (Great starting baseline)", value: "2k" },
      { icon: "💵", label: "٥,٠٠٠ إلى ١٠,٠٠٠ ج.م شهريًا (دخل جانبي ملموس)", labelEn: "$250 – $500 / mo (Solid side-income)", value: "5-10k" },
      { icon: "💰", label: "١٥,٠٠٠ إلى ٢٥,٠٠٠ ج.م شهريًا (يضاهي وظيفة كاملة)", labelEn: "$500 – $1,200 / mo (Matches a full-time role)", value: "15-25k" },
      { icon: "💎", label: "أكثر من ٢٥,٠٠٠ ج.م شهريًا (استقلال مالي كامل)", labelEn: "$1,200+ / mo (Full financial independence)", value: "25k-plus" },
      { icon: "😎", label: "مش محتاج دخل — تركيزي على التميز المعرفي فقط", labelEn: "Not focused on income — purely for knowledge mastery", value: "none" },
    ],
  },
  {
    id: "dailyTime",
    question: "كم من الوقت تستطيع تخصيصه يوميًا للتعلم الميكرو؟",
    questionEn: "How much focused time can you realistically invest daily?",
    subtitle: "كن صادقًا مع نفسك — الاستمرارية اليومية أهم من الكثافة المتقطعة",
    subtitleEn: "Be realistic — micro-consistency beats sporadic cramming every time",
    options: [
      { icon: "⏱️", label: "٥ إلى ١٠ دقائق يوميًا (جرعة خفيفة مضمونة)", labelEn: "5 – 10 minutes / day (Effortless daily micro-step)", value: "10" },
      { icon: "⏱️", label: "١٥ دقيقة يوميًا (الوتيرة الذهبية الموصى بها)", labelEn: "15 minutes / day (The optimal golden pace)", value: "15" },
      { icon: "⏱️", label: "٢٠ إلى ٣٠ دقيقة يوميًا (تسارع ممتاز)", labelEn: "20 – 30 minutes / day (Accelerated track)", value: "20" },
      { icon: "⏱️", label: "٣٠ دقيقة فأكثر يوميًا (انغماس مكثف)", labelEn: "30+ minutes / day (Deep immersive focus)", value: "30" },
    ],
  },
  {
    id: "reward",
    question: "عند إتمام تحدي الـ ٢٨ يوم بنجاح، كيف ستكافئ نفسك؟",
    questionEn: "When you successfully complete your 28-day challenge, how will you celebrate?",
    subtitle: "تؤكد الأبحاث النفسية أن ربط الهدف بمكافأة يرفع احتمالية إكماله ٣ أضعاف",
    subtitleEn: "Psychology shows that pre-committing to a reward triples goal completion rates",
    options: [
      { icon: "✈️", label: "رحلة أو إجازة ممتعة لتصفية الذهن", labelEn: "A refreshing weekend trip or getaway", value: "trip" },
      { icon: "🍽️", label: "عشاء فاخر للاحتفال بالإنجاز", labelEn: "A celebratory fine dinner with loved ones", value: "dinner" },
      { icon: "💻", label: "أداة تقنية أو جهاز جديد يدعم إنتاجيتي", labelEn: "A new gadget or tech tool for productivity", value: "tech" },
      { icon: "💰", label: "تحويل الأرباح للمدخرات وبناء مستقبلي", labelEn: "Investing the returns directly into my savings", value: "savings" },
      { icon: "👨‍👩‍👧", label: "هدية تسعد بها عائلتي ومن أحب", labelEn: "A thoughtful gift for my family", value: "family" },
      { icon: "✳️", label: "مكافأة أخرى خاصة", labelEn: "Another personal celebration", value: "other" },
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
> = {
  5: {
    icon: "✨",
    heading: "أنت متقدم بالفعل على 80% من محيطك",
    headingEn: "You are already ahead of 80% of your peers",
    body: "87% من مشتركي طوّرني شعروا بثقة حقيقية وقدرة على التطبيق خلال الأسبوع الأول فقط. مجرد وصولك لهذه الخطوة يثبت أنك جاد في تطوير مهاراتك وصناعة الفارق في مستقبلك.",
    bodyEn: "87% of Tawwerni learners report real practical confidence within their very first week. Simply taking this action puts you into the forward-thinking top 20% of your field.",
    cta: "تابع الخطوات ←",
    ctaEn: "Continue ←",
  },
  12: {
    icon: "🎓",
    heading: "نافذة الفرص مفتوحة الآن — لكنها لن تنتظر طويلًا",
    headingEn: "The window of opportunity is open — but won't wait for a full year",
    body: "«الذكاء الاصطناعي لن يستبدل الإنسان.. ولكن الإنسان الذي يتقن الذكاء الاصطناعي سيستبدل من لا يتقنه». المنصة مصممة خصيصًا لتمنحك هذه الأسبقية في أقل من 15 دقيقة يوميًا.",
    bodyEn: "\"AI won't replace humans, but humans using AI will replace those who don't.\" Tawwerni is engineered to give you that undeniable unfair advantage in just 15 minutes a day.",
    cta: "أكمل التقييم ←",
    ctaEn: "Finish Quiz ←",
  },
};

export type Archetype = {
  key: string;
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  icon: string;
  quote: string;
  quoteEn: string;
};

export const archetypes: Record<string, Archetype> = {
  "grow-role": {
    key: "grow-role",
    title: "المحترف الطموح",
    titleEn: "The Ambitious Achiever",
    subtitle: "نمو مهني متسارع وسرعة إنجاز فائقة",
    subtitleEn: "Accelerated career growth & effortless high output",
    icon: "📈",
    quote: "الناجحون في سوق العمل هم من يتبنون أدوات المستقبل مبكرًا — وهذا تحديدًا ما تفعله الآن.",
    quoteEn: "Top performers don't work harder; they master the tools of the future early. That's exactly what you are doing.",
  },
  "career-change": {
    key: "career-change",
    title: "صانع التحوّل",
    titleEn: "The Career Pivoter",
    subtitle: "مسار مهني جديد بمهارات عالية الطلب والدخل",
    subtitleEn: "A high-demand career path powered by modern skills",
    icon: "🔄",
    quote: "التحول المهني يصبح أسهل وأسرع عندما تتسلح بالمهارات التي يبحث عنها السوق بشغف.",
    quoteEn: "Pivoting careers becomes natural when you possess the exact skills the market is urgently seeking.",
  },
  "build-income": {
    key: "build-income",
    title: "رائد الأعمال وباني الدخل",
    titleEn: "The Income Builder",
    subtitle: "إطلاق مشاريع ودخل حر إضافي بالذكاء الاصطناعي",
    subtitleEn: "Unlocking profitable freelancing and automated income streams",
    icon: "💼",
    quote: "الفرص الكبرى تُصنع في أوقات التغيير. إتقانك لأدوات اليوم يفتح لك أبواب ثروة حقيقية.",
    quoteEn: "Huge opportunities are unlocked during technology shifts. Mastering today's tools creates lasting income.",
  },
  creative: {
    key: "creative",
    title: "المبدع المستقبلي",
    titleEn: "The Creative Pioneer",
    subtitle: "إبداع بصري ومحتوى استثنائي بمضاعفة سرعتك",
    subtitleEn: "Stunning visual creativity & content with 10x output speed",
    icon: "🎨",
    quote: "أدوات الذكاء الاصطناعي ليست بديلًا عن خيالك وإبداعك — بل هي جناحيك للتحليق أسرع وأعلى.",
    quoteEn: "Modern AI doesn't replace your artistic soul — it serves as the ultimate creative multiplier.",
  },
  "stay-informed": {
    key: "stay-informed",
    title: "المستكشف الواعي",
    titleEn: "The Future-Proof Explorer",
    subtitle: "دائمًا في المقدمة ومستعد لكل تطور",
    subtitleEn: "Always ahead, informed, and completely future-proof",
    icon: "🛡️",
    quote: "من يفهمون التكنولوجيا في بداياتها لا يخشون أي مفاجآت في المستقبل.",
    quoteEn: "Those who grasp the fundamentals early never need to fear what the future brings.",
  },
  other: {
    key: "other",
    title: "رائد الاستكشاف",
    titleEn: "The Visionary Explorer",
    subtitle: "رحلتك الفريدة لبناء مهارات لا تُستبدل",
    subtitleEn: "A bespoke journey to building irreplaceable capabilities",
    icon: "🧭",
    quote: "كل نجاح عظيم بدأ بخطوة فضولية واثقة — وأنت اتخذت تلك الخطوة اليوم.",
    quoteEn: "Every monumental achievement begins with a curious first step — you took yours today.",
  },
};

export function computeArchetype(answers: Record<string, string>): Archetype {
  const goal = answers.goal ?? "other";
  return archetypes[goal] ?? archetypes.other;
}

export function computeReadinessScore(answers: Record<string, string>): number {
  let score = 48;
  const bump: Record<string, number> = {
    comfort: answers.comfort === "very-comfortable" ? 10 : answers.comfort === "manage" ? 5 : 0,
    experience:
      answers.experience === "advanced" ? 15 : answers.experience === "regular" ? 10 : answers.experience === "tried-few" ? 5 : 0,
    worry: answers.worry === "opportunity" ? 8 : answers.worry === "a-little" ? 4 : 0,
    onlineLearning: answers.onlineLearning === "always" ? 6 : answers.onlineLearning === "open" ? 3 : 0,
    triedBefore: answers.triedBefore === "want-structure" ? 6 : answers.triedBefore === "paid-course" ? 4 : 0,
  };
  score += Object.values(bump).reduce((a, b) => a + b, 0);
  return Math.max(35, Math.min(98, score));
}
