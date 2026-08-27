export type QuizOption = { icon?: string; label: string; value: string };
export type QuizQuestionDef = {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestionDef[] = [
  /*
   * The opener earns the next seventeen questions.
   *
   * This used to be "how old are you?" — a form field, asked before the
   * visitor had any reason to fill one in. It gathers data and gives nothing
   * back, and it is the single easiest place to lose someone.
   *
   * This one costs no thought and returns something: whichever answer they
   * pick is a small admission about where they stand, and people who have just
   * admitted something keep going. Age moves further down, once the exchange
   * has started.
   */
  {
    id: "ai_today",
    question: "الذكاء الاصطناعي بالنسبالك دلوقتي إيه؟",
    subtitle: "جاوب بصراحة — النتيجة هتتبني على ده",
    options: [
      { icon: "🌫️", label: "كلام بسمعه كتير ومش عارف أستخدمه", value: "aware-unused" },
      { icon: "🧪", label: "جرّبته مرة أو اتنين وسيبته", value: "tried-quit" },
      { icon: "🔁", label: "بستخدمه في حاجات بسيطة", value: "casual" },
      { icon: "⚡", label: "بستخدمه يوميًا وعايز أطوّر", value: "daily" },
      { icon: "😟", label: "قلقان منه على شغلي", value: "worried" },
    ],
  },
  {
    id: "goal",
    question: "إيه هدفك الأساسي من الذكاء الاصطناعي؟",
    options: [
      { icon: "📈", label: "أتقدّم في وظيفتي الحالية", value: "grow-role" },
      { icon: "🔄", label: "أغيّر مساري المهني أو أترقّى", value: "career-change" },
      { icon: "💰", label: "أبني مشروع أو دخل إضافي", value: "build-income" },
      { icon: "🎨", label: "أستخدمه في مشاريع إبداعية", value: "creative" },
      { icon: "🛡️", label: "أفضل مطّلع ومتأخرش عن الركب", value: "stay-informed" },
      { icon: "✳️", label: "حاجة تانية", value: "other" },
    ],
  },
  {
    id: "field",
    question: "بتشتغل في مجال إيه؟",
    options: [
      { icon: "💻", label: "تقنية وبرمجة", value: "tech" },
      { icon: "💳", label: "مالية ومحاسبة", value: "finance" },
      { icon: "📣", label: "تسويق وإعلام", value: "marketing" },
      { icon: "🏥", label: "صحة", value: "health" },
      { icon: "📚", label: "تعليم", value: "education" },
      { icon: "📊", label: "مبيعات وتطوير أعمال", value: "sales" },
      { icon: "⚙️", label: "عمليات وإدارة", value: "operations" },
      { icon: "🌐", label: "حاجة تانية", value: "other" },
    ],
  },
  {
    id: "age",
    question: "كام عمرك؟",
    options: [
      { label: "أقل من ٢٥", value: "under25" },
      { label: "٢٥ – ٣٤", value: "25-34" },
      { label: "٣٥ – ٤٤", value: "35-44" },
      { label: "٤٥ – ٥٤", value: "45-54" },
      { label: "٥٥+", value: "55plus" },
    ],
  },
  {
    id: "comfort",
    question: "إيه مستوى راحتك مع أدوات الذكاء الاصطناعي دلوقتي؟",
    options: [
      { icon: "💪", label: "مرتاح جدًا", value: "very-comfortable" },
      { icon: "🙂", label: "بتدبر، بس بواجه صعوبة أحيانًا", value: "manage" },
      { icon: "😅", label: "بواجه صعوبة كبيرة", value: "struggle" },
      { icon: "👀", label: "لسه ما جربتش تقريبًا", value: "barely-tried" },
    ],
  },
  {
    id: "worry",
    question: "قد إيه قلقان إن الذكاء الاصطناعي يأثر على وظيفتك أو دخلك؟",
    options: [
      { icon: "😱", label: "قلقان جدًا", value: "very-worried" },
      { icon: "😟", label: "قلقان شوية", value: "somewhat-worried" },
      { icon: "🤷", label: "مش قلقان أوي", value: "a-little" },
      { icon: "🚀", label: "مش قلقان خالص — بشوفه فرصة", value: "opportunity" },
    ],
  },
  {
    id: "experience",
    question: "إيه اللي بيوصف خبرتك مع الذكاء الاصطناعي لحد دلوقتي؟",
    options: [
      { icon: "🌱", label: "مبتدئ تمامًا", value: "beginner" },
      { icon: "🔍", label: "جربت كذا أداة", value: "tried-few" },
      { icon: "⚡", label: "باستخدمه بانتظام", value: "regular" },
      { icon: "🛠️", label: "ببني سير عمل بالذكاء الاصطناعي", value: "advanced" },
    ],
  },
  {
    id: "favoriteTool",
    question: "إيه الأداة اللي انت أكتر واحدة متعرف عليها؟",
    options: [
      { icon: "🤔", label: "لسه جديد على الأدوات دي", value: "new" },
      { label: "ChatGPT", value: "chatgpt" },
      { label: "Claude AI", value: "claude" },
      { label: "Google Gemini", value: "gemini" },
      { label: "Microsoft Copilot", value: "copilot" },
      { label: "Midjourney", value: "midjourney" },
    ],
  },
  {
    id: "blocker",
    question: "إيه أكتر حاجة واقفة قدامك؟",
    options: [
      { icon: "🗺️", label: "مفيش نظام أو خطة واضحة", value: "no-plan" },
      { icon: "⏰", label: "مفيش وقت كفاية", value: "no-time" },
      { icon: "😵", label: "حاسس إنه معقد أوي", value: "too-complex" },
      { icon: "🤷", label: "مش عارف أبدأ منين", value: "dont-know-start" },
    ],
  },
  {
    id: "stage",
    question: "إيه اللي بيوصف مكانك دلوقتي بالظبط؟",
    options: [
      { icon: "🎓", label: "طالب أو لسه في البداية", value: "student" },
      { icon: "💼", label: "في وظيفة وبابني مسيرتي", value: "building-career" },
      { icon: "👥", label: "مدير أو قائد فريق", value: "manager" },
      { icon: "🏢", label: "بشغّل مشروعي الخاص", value: "business-owner" },
      { icon: "🌀", label: "باخد وقت للتفكير أو التحول", value: "transitioning" },
    ],
  },
  {
    id: "firstHelp",
    question: "عايز الذكاء الاصطناعي يساعدك في إيه الأول؟",
    options: [
      { icon: "✍️", label: "الكتابة والتواصل", value: "writing" },
      { icon: "📊", label: "البيانات والبحث", value: "research" },
      { icon: "🎨", label: "الصور والإبداع", value: "creative" },
      { icon: "⚙️", label: "أتمتة المهام", value: "automation" },
      { icon: "🧠", label: "التعلّم بشكل أسرع وأذكى", value: "learning" },
    ],
  },
  {
    id: "biggestConcern",
    question: "لما تفكر في الذكاء الاصطناعي ومستقبلك، إيه أكتر حاجة بتقلقك؟",
    options: [
      { icon: "🏃", label: "زمايلي يسبقوني", value: "colleagues-ahead" },
      { icon: "🤖", label: "وظيفتي تتمتت بالكامل", value: "role-automated" },
      { icon: "📉", label: "متبقاش عندي المهارات المطلوبة", value: "skills-gap" },
      { icon: "💡", label: "مفيش حاجة — بشوفه ميزة ليا", value: "advantage" },
    ],
  },
  {
    id: "triedBefore",
    question: "جربت تتعلم الذكاء الاصطناعي قبل كده؟",
    options: [
      { icon: "🆕", label: "لأ، دي أول مرة", value: "first-time" },
      { icon: "📺", label: "آه، من يوتيوب أو مقالات مجانية", value: "free-content" },
      { icon: "💳", label: "آه، كورس مدفوع", value: "paid-course" },
      { icon: "🔧", label: "باستخدمه، بس عايز نظام مرتب", value: "want-structure" },
    ],
  },
  {
    id: "onlineLearning",
    question: "مرتاح تتعلم مهارات جديدة أونلاين؟",
    options: [
      { icon: "✅", label: "آه، بتعلم أونلاين طول الوقت", value: "always" },
      { icon: "🤔", label: "مستعد أجرب", value: "open" },
      { icon: "🙈", label: "مش قوي — بفضّل التعلّم العملي المباشر", value: "prefer-hands-on" },
    ],
  },
  {
    id: "sevenDayGoal",
    question: "عايز توصل لنتيجة إيه في أول ٧ أيام؟",
    options: [
      { icon: "💬", label: "أكتب أول برومبت ليا", value: "first-prompt" },
      { icon: "⚙️", label: "أتمت مهمة في شغلي", value: "automate-task" },
      { icon: "✍️", label: "أنتج محتوى بالذكاء الاصطناعي", value: "create-content" },
      { icon: "💡", label: "أبدأ مشروع جانبي بالذكاء الاصطناعي", value: "start-side-project" },
    ],
  },
  {
    id: "incomeTarget",
    question: "قد إيه دخل إضافي هيفرق فعلًا في حياتك؟",
    options: [
      { icon: "🪙", label: "٢,٠٠٠ جنيه شهريًا", value: "2k" },
      { icon: "💵", label: "٥,٠٠٠ – ١٠,٠٠٠ جنيه شهريًا", value: "5-10k" },
      { icon: "💰", label: "١٥,٠٠٠ – ٢٥,٠٠٠ جنيه شهريًا", value: "15-25k" },
      { icon: "💎", label: "٢٥,٠٠٠+ جنيه شهريًا", value: "25k-plus" },
      { icon: "😎", label: "مش محتاج دخل إضافي", value: "none" },
    ],
  },
  {
    id: "dailyTime",
    question: "قد إيه وقت تقدر تلتزم بيه كل يوم؟",
    subtitle: "كن صادق مع نفسك — الاستمرارية أهم من الكثافة",
    options: [
      { icon: "⏱️", label: "١٠ دقايق", value: "10" },
      { icon: "⏱️", label: "١٥ دقيقة", value: "15" },
      { icon: "⏱️", label: "٢٠ دقيقة", value: "20" },
      { icon: "⏱️", label: "٣٠+ دقيقة", value: "30" },
    ],
  },
  {
    id: "reward",
    question: "لما تخلّص تحدي الـ٢٨ يوم، هتكافئ نفسك بإيه؟",
    subtitle: "الأبحاث بتقول إن تحديد مكافأة بيزوّد فرصة إكمالك ٣ أضعاف",
    options: [
      { icon: "✈️", label: "أخطط رحلة", value: "trip" },
      { icon: "🍽️", label: "عشا حلو برا", value: "dinner" },
      { icon: "💻", label: "جهاز أو أداة تقنية جديدة", value: "tech" },
      { icon: "💰", label: "أوفرها في المدخرات", value: "savings" },
      { icon: "👨‍👩‍👧", label: "حاجة للعيلة", value: "family" },
      { icon: "✳️", label: "حاجة تانية", value: "other" },
    ],
  },
];

export const quizInterstitials: Record<number, { icon: string; heading: string; body: string; cta: string }> = {
  5: {
    icon: "✨",
    heading: "انت بالفعل متقدم عن الأغلبية",
    body: "٨٧٪ من متعلمي طوّرني حسّوا بثقة في استخدام الذكاء الاصطناعي خلال أول أسبوع. أغلب الناس عارفين إن الذكاء الاصطناعي مهم بس ملقوش خطوة أولى — وإنك هنا معناه إنك بالفعل في أفضل ٢٠٪.",
    cta: "كمّل",
  },
  12: {
    icon: "🎓",
    heading: "النافذة مفتوحة — بس مش للأبد",
    body: "\"الذكاء الاصطناعي مش هياخد وظيفتك. اللي هياخدها هو حد بيستخدم الذكاء الاصطناعي.\" الشركات دلوقتي بتوظّف على أساس إتقان الذكاء الاصطناعي — وتحدي الـ٢٨ يوم مصمم يخليك الشخص ده بسرعة.",
    cta: "كمّل",
  },
};

export type Archetype = { key: string; title: string; subtitle: string; icon: string; quote: string };

export const archetypes: Record<string, Archetype> = {
  "grow-role": {
    key: "grow-role",
    title: "الموظف الطموح",
    subtitle: "نمو مهني متسارع بالذكاء الاصطناعي",
    icon: "📈",
    quote: "اللي بيتفوقوا في الشغل دلوقتي هما اللي بيتعلموا الذكاء الاصطناعي بدري — وده بالظبط اللي انت بتعمله.",
  },
  "career-change": {
    key: "career-change",
    title: "الباحث عن التحوّل",
    subtitle: "مسار مهني جديد بمهارات ذكاء اصطناعي",
    icon: "🔄",
    quote: "التحول المهني بيبقى أسهل لما يكون معاك مهارة السوق بيدوّر عليها فعلًا.",
  },
  "build-income": {
    key: "build-income",
    title: "باني الأعمال",
    subtitle: "نمو مشروعك بالذكاء الاصطناعي",
    icon: "💼",
    quote: "اللي بيتفوقوا في اضطراب الذكاء الاصطناعي هما اللي بيتعلموه دلوقتي — وده بالظبط اللي انت بتعمله.",
  },
  creative: {
    key: "creative",
    title: "الصانع المبدع",
    subtitle: "إبداع أسرع بالذكاء الاصطناعي",
    icon: "🎨",
    quote: "الذكاء الاصطناعي مش بديل عن إبداعك — هو مضاعف له.",
  },
  "stay-informed": {
    key: "stay-informed",
    title: "المستكشف الواعي",
    subtitle: "دايمًا في الصورة، دايمًا مستعد",
    icon: "🛡️",
    quote: "اللي فاهمين الذكاء الاصطناعي دلوقتي هيكونوا مستعدين لأي تغيير جاي.",
  },
  other: {
    key: "other",
    title: "المستكشف",
    subtitle: "بداية رحلتك الخاصة مع الذكاء الاصطناعي",
    icon: "🧭",
    quote: "كل رحلة كبيرة بتبدأ بخطوة أولى فضولية — وانت بدأتها بالفعل.",
  },
};

export function computeArchetype(answers: Record<string, string>): Archetype {
  const goal = answers.goal ?? "other";
  return archetypes[goal] ?? archetypes.other;
}

export function computeReadinessScore(answers: Record<string, string>): number {
  let score = 45;
  const bump: Record<string, number> = {
    comfort: answers.comfort === "very-comfortable" ? 10 : answers.comfort === "manage" ? 5 : 0,
    experience:
      answers.experience === "advanced" ? 15 : answers.experience === "regular" ? 10 : answers.experience === "tried-few" ? 5 : 0,
    worry: answers.worry === "opportunity" ? 8 : answers.worry === "a-little" ? 4 : 0,
    onlineLearning: answers.onlineLearning === "always" ? 6 : answers.onlineLearning === "open" ? 3 : 0,
    triedBefore: answers.triedBefore === "want-structure" ? 6 : answers.triedBefore === "paid-course" ? 4 : 0,
  };
  score += Object.values(bump).reduce((a, b) => a + b, 0);
  return Math.max(30, Math.min(97, score));
}
