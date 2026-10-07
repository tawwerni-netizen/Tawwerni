export type UniversalDayArchetype = {
  dayKey: number;
  phaseIndex: number; // 0: Foundations, 1: Core Tech, 2: Real Projects, 3: Monetization
  titleAr: string;
  titleEn: string;
  subTopicAr: string;
  subTopicEn: string;
  coreConceptAr: (trackTitleAr: string, outcomeAr: string) => string[];
  coreConceptEn: (trackTitleEn: string, outcomeEn: string) => string[];
  stepsAr: (trackTitleAr: string, outcomeAr: string) => string[];
  stepsEn: (trackTitleEn: string, outcomeEn: string) => string[];
  pitfallAr: (realityAr: string) => string[];
  pitfallEn: (realityEn: string) => string[];
  challengeAr: (outcomeAr: string) => string[];
  challengeEn: (outcomeEn: string) => string[];
  promptQuery: (trackTitleAr: string, outcomeAr: string) => string;
};

export const UNIVERSAL_DAY_ARCHETYPES: Record<number, UniversalDayArchetype> = {
  1: {
    dayKey: 1,
    phaseIndex: 0,
    titleAr: "خارطة طريق المسار وتثبيت بيئة العمل",
    titleEn: "Roadmap Architecture & Workspace Setup",
    subTopicAr: "تجهيز بيئة العمل والانطلاقة السريعة",
    subTopicEn: "Workspace Setup & Rapid Ignition",
    coreConceptAr: (track, outcome) => [
      `مرحباً بك في اليوم الأول من مسار ${track}! البداية الصحيحة تحدد 80% من سرعة وصولك للاحتراف.`,
      `في هذا اليوم، سنكسر حاجز البداية عبر تجهيز بيئة التدريب، فتح الأدوات الأساسية، وتثبيت أول خطوة تطبيقية في: ${outcome}.`,
      `القاعدة الذهبية اليوم: التركيز على خطوة صغيرة ومكتملة تمنحك أول انتصار عملي فوري بدلاً من استنزاف طاقتك في المقارنات النظرية.`,
    ],
    coreConceptEn: (track, outcome) => [
      `Welcome to Day 1 of ${track}! A frictionless setup accounts for 80% of your long-term execution momentum.`,
      `Today, we eliminate launch friction by setting up your primary tools, establishing your workflow baseline, and achieving your first tangible win in: ${outcome}.`,
      `The Golden Rule: Prioritize a small, 100% completed deliverable over exhausting theoretical overthinking.`,
    ],
    stepsAr: (track, outcome) => [
      `١. افتح الأداة المعتمدة لمسار ${track} وتأكد من عمل حسابك وتفعيل الإعدادات الأساسية.`,
      `٢. ابنِ أول مسودة عمل تجريبية تركز على ${outcome} دون القلق بشأن الكمال.`,
      `٣. دوّن ملاحظاتك الأولى عن المخرجات وقارنها بالمعايير المهنية المتبعة.`,
      `٤. احفظ إنجازك في مجلد مخصص للمشاريع اليومية لتبني سجلاً تراكمياً لأعمالك.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Open the primary toolsuite for ${track} and verify your account configurations.`,
      `2. Build your very first baseline prototype applying ${outcome} without seeking initial perfection.`,
      `3. Note down your first execution impressions and benchmark them against industry baselines.`,
      `4. Save your deliverable into a dedicated daily projects folder to establish compounding momentum.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `فخ اليوم الأول: قضاء ساعات في مقارنة البرامج أو شراء أدوات مدفوعة معقدة قبل تجربة الأساسيات المجانية.`,
      `الحل: ابدأ بأبسط أداة متاحة الآن، فالتنفيذ المباشر هو ما يصنع الخبرة الحقيقية.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `Day 1 Beginner Trap: Spending hours comparing peripheral software before running a single hands-on test.`,
      `The Antidote: Start with the simplest accessible setup today — raw execution breeds genuine competence.`,
    ],
    challengeAr: (outcome) => [
      `قم بفتح مساحة عملك وتطبيق أول نموذج مصغر لـ "${outcome}".`,
      `التقط لقطة شاشة أو احفظ مخرجك في ملف نصي لتثبيت إنجاز اليوم.`,
      `أجب عن أسئلة كويز التثبيت بالأسفل لتوثيق نقاط خبرتك (XP).`,
    ],
    challengeEn: (outcome) => [
      `Launch your workspace and produce your first baseline deliverable for "${outcome}".`,
      `Capture a screenshot or save the resulting artifact in your repository.`,
      `Complete the knowledge audit quiz below to bank your Day 1 XP.`,
    ],
    promptQuery: (track, outcome) => `ما هي أسرع طريقة لتجهيز مساحة العمل وتطبيق ${outcome} بدون أخطاء في ${track}؟`,
  },

  2: {
    dayKey: 2,
    phaseIndex: 0,
    titleAr: "تفكيك المنطق الجوهري وبناء أول مخرج",
    titleEn: "Core Logic Deconstruction & First Output",
    subTopicAr: "فهم آلية المدخلات والمخرجات",
    subTopicEn: "Inputs, Parameters & Core Mechanics",
    coreConceptAr: (track, outcome) => [
      `الآن بعد أن ثبتنا بيئة العمل، حان الوقت لفهم الميكانيكا العميقة التي تحرك ${outcome}.`,
      `المحترفون لا يعتمدون على التخمين العشوائي؛ بل يفهمون بدقة كيف تتحول المدخلات والتعليمات إلى نتائج مبهرة في ${track}.`,
      `اليوم ستتعلم تفكيك المشكلة الكبيرة إلى معطيات محددة، شروط واضحة، ونتيجة متوقعة بدقة متناهية.`,
    ],
    coreConceptEn: (track, outcome) => [
      `With your workspace established, today is about mastering the underlying mechanics governing ${outcome}.`,
      `Elite practitioners never guess blindly; they understand precisely how structured inputs translate into high-fidelity outputs in ${track}.`,
      `Today you learn to decompose complex problems into clear parameters, explicit boundaries, and predictable results.`,
    ],
    stepsAr: (track, outcome) => [
      `١. حدد بوضوح المدخلات والمعطيات المطلوبة قبل كتابة أي أمر أو تنفيذ أي خطوة في ${outcome}.`,
      `٢. طبّق أسلوب التفكيك: قسّم العملية إلى 3 خطوات متتابعة بدلاً من محاولة إنجازها دفعة واحدة.`,
      `٣. افحص المخرج الأولي وتأكد من أن كل مدخل أنتج النتيجة المطلوبة في ${track}.`,
      `٤. حدد الفارق بين النتيجة المقبولة والنتيجة الاستثنائية ودوّن السبب في ملاحظاتك.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Clearly define all necessary input parameters before triggering any operation in ${outcome}.`,
      `2. Apply task decomposition: break the execution into 3 sequential steps rather than one bulk run.`,
      `3. Inspect your output baseline and verify that each input mapped correctly to its expected state.`,
      `4. Identify the delta between average outputs and elite benchmarks in ${track}.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `فخ اليوم الثاني: التسرع في إنتاج مخرجات معقدة قبل إتقان القواعد الأبسط.`,
      `الحل: التزم بإتقان النموذج المصغر، فالمشروعات الكبيرة ما هي إلا نماذج مصغرة مكررة بإتقان.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `Day 2 Beginner Trap: Rushing into complex production before securing foundational mechanics.`,
      `The Antidote: Master the micro-unit first; enterprise architectures are merely compounded micro-units.`,
    ],
    challengeAr: (outcome) => [
      `فكك مهمة اليوم إلى مدخل ومخرج محددين وطبق "${outcome}".`,
      `تأكد من خلو مخرجك من أي غموض أو عناصر غير مفهومة.`,
      `أجب عن كويز اليوم لترسيخ الفهم وحصد نقاط الـ XP.`,
    ],
    challengeEn: (outcome) => [
      `Deconstruct today's task into structured inputs and outputs applying "${outcome}".`,
      `Verify that your artifact is free of ambiguous assumptions.`,
      `Pass the knowledge check below to solidify your understanding and claim XP.`,
    ],
    promptQuery: (track, outcome) => `كيف أفكك المشكلات المعقدة وأحدد المدخلات بدقة عند تطبيق ${outcome} في ${track}؟`,
  },

  3: {
    dayKey: 3,
    phaseIndex: 0,
    titleAr: "القوالب الذكية ومضاعفة سرعة التنفيذ",
    titleEn: "Smart Templates & 2x Execution Velocity",
    subTopicAr: "استخراج الأنماط والقوالب القابلة لإعادة الاستخدام",
    subTopicEn: "Reusable Snippets & Pattern Extraction",
    coreConceptAr: (track, outcome) => [
      `الفرق بين المبتدئ والمحترف الذي يتقاضى أعلى الأجور هو السرعة والأنظمة المتكررة.`,
      `اليوم ستبني ترسانتك الأولى من القوالب الجاهزة (Templates) لتطبيق ${outcome} في نصف الوقت المعتاد.`,
      `عندما تمتلك قوالب مجربة ومبنية على أفضل الممارسات في ${track}، تصبح إنتاجيتك مضاعفة وتوفر ساعات من الجهد المكرر.`,
    ],
    coreConceptEn: (track, outcome) => [
      `The difference between a struggling amateur and a high-earning practitioner is systematized speed.`,
      `Today you build your first repository of reusable operational templates for ${outcome}, cutting execution time in half.`,
      `Possessing battle-tested frameworks in ${track} multiplies your delivery velocity without risking burnout.`,
    ],
    stepsAr: (track, outcome) => [
      `١. حدد الأجزاء المكررة التي تكتبها أو تنفذها باستمرار عند التعامل مع ${outcome}.`,
      `٢. حوّل هذه الأجزاء إلى قالب مرن يحتوي على متغيرات (Placeholders) واضحة المعالم.`,
      `٣. اختبر القالب مع 3 سيناريوهات عمل مختلفة للتأكد من مرونته وقوته.`,
      `٤. احفظ القالب في ملف مرجعي سريع الوصول على سطح مكتبك أو في مساحة ملاحظاتك.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Identify repetitive operational steps you repeatedly write when executing ${outcome}.`,
      `2. Abstract these components into a modular template parameterized with clear placeholders.`,
      `3. Stress-test the template across 3 distinct test cases to verify adaptability.`,
      `4. Index your template in an instant-access snippet repository or personal knowledge vault.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `فخ اليوم الثالث: الاعتماد على الذاكرة الذهنية وحدها وكتابة كل شيء من الصفر في كل مرة.`,
      `الحل: التوثيق والقوالب هما سلاح المحترفين الحقيقي لتحقيق إنتاجية خارقة.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `Day 3 Trap: Relying on mental memory alone and reinventing the wheel on every project.`,
      `The Antidote: Modular templates represent the true secret of high-leverage operators.`,
    ],
    challengeAr: (outcome) => [
      `ابنِ قالباً تنفيذياً متكاملاً يتضمن خانات متغيرة لتطبيق "${outcome}".`,
      `اختبر تعبئة القالب في تمرين سريع للتأكد من توفيره للوقت.`,
      `انتقل لكويز اليوم لتثبيت المعلومة وحصد النقاط.`,
    ],
    challengeEn: (outcome) => [
      `Construct a modular execution template with explicit parameter fields for "${outcome}".`,
      `Run a dry-run test to verify it reduces setup time by at least 50%.`,
      `Complete today's quiz to verify retention and bank your XP.`,
    ],
    promptQuery: (track, outcome) => `ما هو أفضل هيكل قالب تنفيذي مرن لتطبيق ${outcome} بسرعة في ${track}؟`,
  },

  4: {
    dayKey: 4,
    phaseIndex: 0,
    titleAr: "تشخيص الأخطاء وحصار الهلوسة والعشوائية",
    titleEn: "Error Diagnostics, Hallucination Guards & Edge Cases",
    subTopicAr: "معالجة الحالات الاستثنائية والقيود الصارمة",
    subTopicEn: "Negative Constraints & Resilient Fallbacks",
    coreConceptAr: (track, outcome) => [
      `أي شخص يمكنه إنتاج نتيجة عندما تسير الأمور بسلاسة، ولكن الكفاءة الحقيقية تظهر عندما تحدث الأخطاء غير المتوقعة.`,
      `اليوم ستتعلم هندسة القيود السلبية (Negative Constraints) وحصار الأخطاء الشائعة والهلوسة في ${outcome}.`,
      `ستكتشف كيف تضع حواجز أمان تمنع المخرجات المبتذلة أو الإجابات المشوهة، وكيف تبني خطط بديلة ذكية في ${track}.`,
    ],
    coreConceptEn: (track, outcome) => [
      `Anyone can generate output when conditions are ideal; true professional mastery is proven when things break unexpectedly.`,
      `Today you learn to engineer negative constraints, isolate failure modes, and eliminate hallucinations in ${outcome}.`,
      `You will discover how to erect guardrails preventing generic filler and how to construct elegant fallback systems in ${track}.`,
    ],
    stepsAr: (track, outcome) => [
      `١. حدد أسوأ 3 أخطاء شائعة يقع فيها المبتدئون عند تطبيق ${outcome}.`,
      `٢. صغ قائمة قيود سلبية صريحة (ممنوع كذا، تجنب كذا، لا تستخدم كذا) لحصار المشكلة.`,
      `٣. اختبر النظام مع مدخلات مشوهة أو ناقصة وشاهد كيف يتعامل معها بذكاء.`,
      `٤. ضع إجراء طوارئ بديل (Fallback) يضمن عدم توقف العمل عند فشل الأداة الأساسية.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Identify the 3 most frequent amateur failure modes when executing ${outcome}.`,
      `2. Formulate explicit negative constraints (Do NOT include X, Avoid Y, Strictly omit Z).`,
      `3. Stress-test your setup with incomplete or malformed inputs to verify error tolerance.`,
      `4. Implement a graceful fallback mechanism ensuring zero workflow disruption upon tool failure.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `فخ اليوم الرابع: افتراض أن الأداة تفهم ما تريده ضمنياً دون وضع شروط وقيود واضحة.`,
      `الحل: الشروط الصريحة والقيود السلبية هي التي تضمن دقة 100% دون مفاجآت سيئة.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `Day 4 Trap: Assuming tools understand implicit human intent without strict boundary constraints.`,
      `The Antidote: Explicit boundaries and negative constraints guarantee 100% predictable fidelity.`,
    ],
    challengeAr: (outcome) => [
      `طبق قائمة قيود سلبية واضحة تعالج الحالات الاستثنائية لـ "${outcome}".`,
      `تأكد من أن مخرجك يخلو تماماً من الحشو والعبارات العامة المبتذلة.`,
      `أجب عن أسئلة الكويز أدناه لتوثيق تفوقك في تشخيص الأخطاء.`,
    ],
    challengeEn: (outcome) => [
      `Deploy a rigorous negative constraint checklist covering edge cases for "${outcome}".`,
      `Verify your artifact is completely stripped of generic corporate fluff.`,
      `Take the quiz below to audit your error-handling mastery.`,
    ],
    promptQuery: (track, outcome) => `ما هي أهم القيود السلبية والأخطاء الخفية التي يجب تجنبها عند ${outcome} في ${track}؟`,
  },

  5: {
    dayKey: 5,
    phaseIndex: 0,
    titleAr: "الضبط الدقيق للمعايير والتحكم في المخرجات",
    titleEn: "Fine-Tuning, Parameter Calibration & Tone Control",
    subTopicAr: "المعايرة الدقيقة ورفع جودة الإنتاج",
    subTopicEn: "Calibration, Output Formatting & Quality Tuning",
    coreConceptAr: (track, outcome) => [
      `المسافة بين المخرج الجيد والمخرج المبهر الذي يدفع العملاء آلاف الجنيهات مقابله هي دقة المعايرة والضبط.`,
      `اليوم ستتعلم ضبط المتغيرات الدقيقة، نبرة الصوت، التنسيق البصري الصارم، وتوجيه ${outcome} ليتطابق مع أعلى معايير الشركات العالمية.`,
      `ستتعلم كيف تطلب تنسيقات جداول، هياكل شجرية، أو نصوص تنفيذية جافة خالية من الإنشاء في ${track}.`,
    ],
    coreConceptEn: (track, outcome) => [
      `The delta between acceptable output and world-class work that commands premium pricing lies in surgical calibration.`,
      `Today you master fine-tuning parameters, tonal modulation, rigid schema formatting, and tailoring ${outcome} to enterprise standards.`,
      `You will learn how to enforce structured tabular schemas, hierarchical trees, and executive prose in ${track}.`,
    ],
    stepsAr: (track, outcome) => [
      `١. حدد شكل الإخراج النهائي بدقة بالغة (جدول من 4 أعمدة، نقاط تنفيذية، هيكل JSON، كود موثق).`,
      `٢. عاير نبرة الصوت: اختر بين (مستشار استراتيجي، مراجع تقني، صانع محتوى تحويلي).`,
      `٣. أضف شروط الدقة الرقمية: اطلب نسباً مئوية وأرقاماً وتواريخ محددة بدلاً من الكلمات العامة.`,
      `٤. راجع المخرج وقارنه بمخرجات الخبراء الكبار في مسار ${track}.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Specify exact schema structures (4-column tables, bulleted executive summaries, typed JSON, documented code).`,
      `2. Calibrate tonal posture: toggle between strategic consultant, technical auditor, or conversion copywriter.`,
      `3. Enforce empirical metrics: mandate percentages, benchmark numbers, and explicit dates over vague prose.`,
      `4. Benchmark the generated deliverable against senior industry outputs in ${track}.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `فخ اليوم الخامس: الرضا بمخرجات فضفاضة تقبل أكثر من تأويل.`,
      `الحل: التحديد الرياضي والشكل الهندسي للمخرج هما علامة المحترف الحقيقي.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `Day 5 Trap: Settling for loose, subjective outputs that leave room for ambiguous interpretation.`,
      `The Antidote: Mathematical specificity and rigid output schemas define true professional execution.`,
    ],
    challengeAr: (outcome) => [
      `أعد إنتاج مخرج محدد لـ "${outcome}" وفق تنسيق هندسي صارم (مثل جدول أو هيكل نقاط مرقم).`,
      `تأكد من احتوائه على أرقام ومؤشرات واضحة بدلاً من العبارات الإنشائية.`,
      `حقق الدرجة الكاملة في كويز اليوم لتوثيق تقدمك.`,
    ],
    challengeEn: (outcome) => [
      `Produce an artifact for "${outcome}" adhering strictly to a rigid schema (e.g. structured table or numbered matrix).`,
      `Ensure it contains quantitative metrics rather than vague conversational prose.`,
      `Score 100% on today's quiz to certify your calibration skills.`,
    ],
    promptQuery: (track, outcome) => `كيف أضبط النبرة وتنسيق المخرجات الهندسية بدقة عالية عند ${outcome} في ${track}؟`,
  },

  6: {
    dayKey: 6,
    phaseIndex: 0,
    titleAr: "تجميع أول خط إنتاج متكامل",
    titleEn: "End-to-End Pipeline Assembly & Mini-Capstone",
    subTopicAr: "ربط المهارات في تدفق عمل واحد سلس",
    subTopicEn: "Multi-Step Workflow Synthesis",
    coreConceptAr: (track, outcome) => [
      `لقد أتقنت الأساس، القوالب، معالجة الأخطاء، والضبط الدقيق. اليوم هو يوم التتويج للأسبوع الأول!`,
      `سنقوم بربط كل هذه الأدوات في خط إنتاج متكامل (End-to-End Pipeline) ينفذ مهمة كاملة في ${outcome} من البداية حتى التسليم.`,
      `هذا التدفق سيكون نواتك لبناء مشروعات حقيقية وتوفير ساعات من العمل الشاق في ${track}.`,
    ],
    coreConceptEn: (track, outcome) => [
      `You have conquered setups, modular templates, error guards, and fine-tuning. Today marks the synthesis of Week 1!`,
      `We assemble these discrete mechanics into a cohesive end-to-end pipeline executing a complete deliverable in ${outcome} from intake to finish.`,
      `This pipeline serves as your foundational engine for tackling real client work and saving massive hours in ${track}.`,
    ],
    stepsAr: (track, outcome) => [
      `١. ارسم تدفق العمل على ورقة: المحطة ١ (المدخلات)، المحطة ٢ (المعالجة والفلترة)، المحطة ٣ (المخرج النهائي).`,
      `٢. نفذ التدفق بالكامل في جلسة عمل واحدة دون انقطاع.`,
      `٣. قِس الوقت الإجمالي المستغرق لملاحظة التحسن الهائل مقارنة باليوم الأول.`,
      `٤. وثق خط الإنتاج كملف عمل جاهز للاستخدام الدائم في مجالك.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Diagram your operational pipeline: Stage 1 (Intake), Stage 2 (Processing & Filtering), Stage 3 (Final Output).`,
      `2. Execute the complete pipeline in a single uninterrupted execution sprint.`,
      `3. Measure total execution time to benchmark your exponential speed gains since Day 1.`,
      `4. Archive this pipeline blueprint as a permanent operational SOP in your vault.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `فخ اليوم السادس: ترك المهارات مفككة في جزر منعزلة بدلاً من دمجها في خط عمل متصل.`,
      `الحل: القوة الحقيقية تأتي من تسلسل الأدوات وتكاملها معاً.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `Day 6 Trap: Leaving skills isolated as discrete exercises rather than connecting them into a unified pipeline.`,
      `The Antidote: Explosive leverage stems from fluid tool chaining and sequential execution.`,
    ],
    challengeAr: (outcome) => [
      `شغّل خط إنتاجك المتكامل ونفذ مهمة شاملة تطبق "${outcome}".`,
      `احفظ المخرج النهائي المتكامل كأول إنجاز محوري في مسارك.`,
      `أجب عن كويز اليوم واقترب من محطة مراجعة الأسبوع الأول.`,
    ],
    challengeEn: (outcome) => [
      `Run your integrated pipeline to produce an end-to-end deliverable for "${outcome}".`,
      `Save this composite artifact as your first milestone project.`,
      `Pass today's quiz and prepare for the Week 1 milestone audit.`,
    ],
    promptQuery: (track, outcome) => `كيف أربط خطوات ${outcome} في خط إنتاج متكامل وسلس في ${track}؟`,
  },

  7: {
    dayKey: 7,
    phaseIndex: 0,
    titleAr: "محطة التدقيق المعياري ومراجعة الأسبوع الأول",
    titleEn: "Week 1 Milestone Audit & Mastery Quality Gate",
    subTopicAr: "قياس التطور والتدقيق بقائمة المعايير المهنية",
    subTopicEn: "Empirical Skill Audit & Quality Rubrics",
    coreConceptAr: (track, outcome) => [
      `مبروك إتمام الأسبوع الأول! في هذه المحطة الاحتفالية، نقيس التطور الحقيقي بالأرقام وليس بالمشاعر.`,
      `سنقارن مخرجاتك بقائمة تدقيق الجودة العالمية (Quality Rubric) للتأكد من رسوخ مهارات ${outcome} في عقلك.`,
      `ستكتشف نقاط قوتك الخارقة وما تحتاجه للارتقاء لمستوى المحترفين الكبار في ${track}.`,
    ],
    coreConceptEn: (track, outcome) => [
      `Congratulations on conquering Week 1! At this milestone gate, we audit your empirical progress with objective metrics.`,
      `We audit your work against industry-standard rubrics to verify that core competencies in ${outcome} are deeply anchored.`,
      `You will calibrate your technical strengths and pinpoint exact growth areas heading into advanced modules in ${track}.`,
    ],
    stepsAr: (track, outcome) => [
      `١. راجع المشروعات الستة التي بنيتها خلال الأسبوع وقارنها بأول محاولة لك.`,
      `٢. طبّق مصفوفة التقييم الثلاثية: التحديد (Specificity)، إدارة القيود (Constraints)، والقيمة العملية (Realism).`,
      `٣. حدد أهم خطأ تخلصت منه وأهم مهارة سرعة اكتسبتها حتى الآن.`,
      `٤. استعد نفسياً للانتقال إلى المرحلة المتقدمة وبناء الحلول البرمجية والإنتاجية الكبرى في ${track}.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Review the 6 deliverables produced over the past week and benchmark them against your Day 1 baseline.`,
      `2. Apply the tripartite evaluation rubric: Specificity, Constraint Management, and Workplace Realism.`,
      `3. Identify the single biggest amateur habit you eradicated and your fastest workflow acceleration.`,
      `4. Prime yourself mentally for Week 2: deep technical automation and enterprise architectures in ${track}.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `فخ اليوم السابع: التردد أو التوقف بعد تحقيق أول نجاح؛ الأسبوع القادم هو الذي يحول المهارة لمصدر دخل.`,
      `الحل: حافظ على سلسلة استمراريتك اليومية (Streak) ولا تكسر الزخم.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `Day 7 Trap: Slowing down after early wins; Week 2 is where skills translate into tangible commercial leverage.`,
      `The Antidote: Protect your active learning streak and maintain compounding momentum.`,
    ],
    challengeAr: (outcome) => [
      `أجرِ فحصاً شاملاً لمخرجاتك في "${outcome}" وسجل درجاتك وفق المعايير الثلاثة.`,
      `اكتب ملخصاً من سطرين يوضح أكبر نقلة نوعية حققتها هذا الأسبوع.`,
      `أنهِ كويز محطة الأسبوع الأول واحصد أوسمة التميز.`,
    ],
    challengeEn: (outcome) => [
      `Perform a comprehensive rubric self-audit on your work in "${outcome}" across all 3 criteria.`,
      `Summarize your single biggest technical breakthrough in two crisp sentences.`,
      `Complete the Week 1 milestone quiz and unlock your achievement badge.`,
    ],
    promptQuery: (track, outcome) => `كيف أقيس جودة مخرجاتي في ${outcome} وأتأكد من وصولي للمستوى الاحترافي في ${track}؟`,
  },
};

/**
 * Returns a rich, tailored archetype for any given day (1..totalDays)
 */
export function getDayArchetype(dayNumber: number, totalDays: number): UniversalDayArchetype {
  const dayKey = ((dayNumber - 1) % 28) + 1;
  const existing = UNIVERSAL_DAY_ARCHETYPES[dayKey];
  if (existing) return existing;

  // Dynamic fallback for any day beyond 7 that maintains non-repetitive progression
  const phaseIndex = Math.min(3, Math.floor(((dayNumber - 1) / totalDays) * 4));
  return {
    dayKey,
    phaseIndex,
    titleAr: `يوم ${dayNumber}: تطبيق تكتيكي متقدم ومحطة تنفيذية`,
    titleEn: `Day ${dayNumber}: Advanced Tactical Application & Execution Gate`,
    subTopicAr: `إتقان تقنيات المحطة ${dayNumber} بجودة 100%`,
    subTopicEn: `Mastering Stage ${dayNumber} Techniques with High Fidelity`,
    coreConceptAr: (track, outcome) => [
      `في اليوم ${dayNumber} من مسار ${track}، ننتقل لمستوى متقدم يركز على التطبيق التكتيكي المباشر في ${outcome}.`,
      `لا مجال هنا للعموميات؛ العمل يتم وفق معايير إنتاجية صارمة تضمن جاهزية المخرج لسوق العمل وبيئات العمل الحقيقية.`,
      `ستتعلم كيف تتجاوز العقبات التقنية المعقدة وتبني حلولاً مستدامة وموثقة تبرهن على كفاءتك.`,
    ],
    coreConceptEn: (track, outcome) => [
      `On Day ${dayNumber} of ${track}, we advance into high-leverage tactical execution in ${outcome}.`,
      `Zero room for vague generalities; execution adheres to strict enterprise standards ready for production deployment.`,
      `You master navigating edge-case friction and constructing resilient, documented deliverables proving competence.`,
    ],
    stepsAr: (track, outcome) => [
      `١. حدد الهدف التنفيذي المباشر لمهمة اليوم في ${outcome} واجمع المعطيات اللازمة.`,
      `٢. طبق أفضل الممارسات المعتمدة في ${track} مع توثيق الأوامر والقرارات التقنية.`,
      `٣. أجرِ فحصاً دقيقاً للمخرج وقارنه بالنموذج الذهبي المعياري للتأكد من خلوه من الثغرات.`,
      `٤. احفظ المخرج في ملف إنجازاتك اليومية لترسيخ الذاكرة الإجرائية وبناء البورتفوليو.`,
    ],
    stepsEn: (track, outcome) => [
      `1. Specify today's objective in ${outcome} and collect all required parameters.`,
      `2. Execute industry-standard best practices in ${track}, documenting decisions.`,
      `3. Stress-test your deliverable against the golden benchmark standard to ensure zero defects.`,
      `4. Commit the final asset to your daily portfolio repository to anchor procedural memory.`,
    ],
    pitfallAr: (reality) => [
      `⚠️ الحقيقة الواقعية: ${reality}`,
      `تذكر دائماً أن التحدي الحقيقي ليس في جمع الأدوات، بل في الصبر على إتقان التفاصيل الدقيقة وحل المشكلات بذكاء.`,
      `كل دقيقة تقضيها في التطبيق العملي اليوم تعود عليك بأضعاف قيمتها في سوق العمل.`,
    ],
    pitfallEn: (reality) => [
      `⚠️ Reality Check: ${reality}`,
      `True leverage comes not from hoarding tools, but from mastering surgical details and systematic problem-solving.`,
      `Every focused minute invested in hands-on production yields compounding career dividends.`,
    ],
    challengeAr: (outcome) => [
      `نفذ مهمة اليوم العملية وركز على الدقة وسرعة التنفيذ في "${outcome}".`,
      `تأكد من اكتمال عناصر المخرج وجاهزيته للاستخدام المباشر.`,
      `أجب عن أسئلة الكويز لترسيخ مهاراتك وحصد نقاط الـ XP.`,
    ],
    challengeEn: (outcome) => [
      `Execute today's practical mission focusing on precision and velocity in "${outcome}".`,
      `Verify all rubric elements are met and ready for immediate deployment.`,
      `Pass the audit quiz below to bank your XP and maintain momentum.`,
    ],
    promptQuery: (track, outcome) => `ما هي أفضل الاستراتيجيات لتنفيذ ${outcome} باحترافية وسرعة في ${track}؟`,
  };
}
