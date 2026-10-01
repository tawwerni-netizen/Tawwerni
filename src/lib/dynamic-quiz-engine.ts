import type { Track100 } from "@/content/tracks100";

export type QuizItem = {
  id: string;
  type: "mcq" | "tf";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

// ============================================================================
// 1. DEDICATED CURRICULUM FOR PROMPT ENGINEERING MASTERY (24 Days)
// ============================================================================
const PROMPT_ENGINEERING_CURRICULUM: Record<
  number,
  { quizAr: QuizItem[]; quizEn: QuizItem[] }
> = {
  1: {
    quizAr: [
      {
        id: "q-pe-1-1",
        type: "mcq",
        question:
          "ما هي العناصر الأربعة الجوهرية (RTCC) التي تحول أي برومبت عادي إلى أمر احترافي دقيق من أول محاولة؟",
        options: [
          "تحديد الدور (Role)، المهمة (Task)، السياق (Context)، والقيود والمخرجات (Constraints)",
          "كتابة نصوص شعرية طويلة ومجاملة نموذج الذكاء الاصطناعي في بداية الرسالة",
          "تكرار نفس الكلمة المفتاحية 10 مرات متتالية للتأكيد على أهميتها",
          "استخدام علامات التعجب والخط العريض لإجبار النموذج على الانتباه",
        ],
        correctIndex: 0,
        explanation:
          "إطار RTCC يضبط آليات الانتباه في النموذج (Attention Mechanism) ويحصر الفضاء الاحتمالي لإنتاج مخرجات مطابقة تماماً للمطلوب دون تشتت.",
      },
      {
        id: "q-pe-1-2",
        type: "tf",
        question:
          "الاعتماد على جمل عامة مثل 'اكتب لي خطة عمل ممتازة' يمنح النموذج حرية إبداعية كافية لإنتاج نتائج مخصصة لبيزنسك دون الحاجة لتزويده بأي سياق.",
        options: ["صح", "غلط"],
        correctIndex: 1,
        explanation:
          "غلط! النماذج اللغوية لا تقرأ الأفكار؛ غياب السياق والقيود يضطر النموذج لتوليد إجابات عامة وسطحية تناسب الجميع ولا تفيد أحداً.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-1-1",
        type: "mcq",
        question:
          "What are the four foundational components (RTCC) that transform a generic prompt into an enterprise-grade instruction?",
        options: [
          "Role, Task, Context, and Constraints/Output Format",
          "Extensive polite greetings and flattering the model",
          "Repeating the same keyword ten times to emphasize priority",
          "Using excessive exclamation marks to force model attention",
        ],
        correctIndex: 0,
        explanation:
          "The RTCC framework anchors the model's attention mechanism and narrows down token probability space for surgical precision.",
      },
      {
        id: "q-pe-1-2",
        type: "tf",
        question:
          "Relying on vague instructions like 'write me an amazing business plan' yields tailored results without needing specific context.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation:
          "False! Without explicit context, the model defaults to generic median training distributions.",
      },
    ],
  },

  2: {
    quizAr: [
      {
        id: "q-pe-2-1",
        type: "mcq",
        question:
          "متى يكون أسلوب التلقين بالأمثلة (Few-Shot Prompting) متفوقاً وحاسماً مقارنة بالتلقين المباشر (Zero-Shot)؟",
        options: [
          "عندما تسأل النموذج عن عاصمة دولة معروفة وموثقة تاريخياً",
          "عندما تحتاج لإلزام النموذج بنمط تنسيق معقد، نبرة مخصصة، أو استخراج بيانات بشكل صارم",
          "عندما تريد توفير استهلاك التوكنز لأدنى حد ممكن",
          "عند إجراء محادثة ترفيهية سريعة بدون أي قيود",
        ],
        correctIndex: 1,
        explanation:
          "الـ Few-Shot يوفر للنموذج أمثلة على المدخل والمخرج داخل السياق (In-Context Learning)، مما يضمن تطابق النمط المطلوب بنسبة 100% دون تخمين.",
      },
      {
        id: "q-pe-2-2",
        type: "mcq",
        question:
          "كم عدد الأمثلة عالية الجودة (Few-Shot Examples) التي يُنصح بتقديمها عادة لتحقيق أفضل توازن بين الدقة واستهلاك التوكنز؟",
        options: [
          "لا تحتاج لأي مثال إطلاقاً",
          "من 2 إلى 5 أمثلة دقيقة ومتنوعة تمثل حالات واقعية",
          "يجب تقديم أكثر من 50 مثالاً على الأقل",
          "مثال واحد خاطئ ومثال واحد صحيح فقط",
        ],
        correctIndex: 1,
        explanation:
          "تقديم 2 إلى 5 أمثلة يمنح النموذج فهماً إحصائياً واضحاً للنمط مع الحفاظ على مساحة نافذة السياق وتكلفة التوكنز.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-2-1",
        type: "mcq",
        question:
          "When is Few-Shot Prompting strictly superior to Zero-Shot Prompting?",
        options: [
          "When asking for established historical facts",
          "When enforcing rigid output formats, customized tones, or strict data extraction",
          "When minimizing token consumption to absolute zero",
          "When engaging in casual conversational chit-chat",
        ],
        correctIndex: 1,
        explanation:
          "Few-shot prompting provides in-context demonstrations that lock down syntax, tone, and formatting deterministically.",
      },
      {
        id: "q-pe-2-2",
        type: "mcq",
        question:
          "What is the sweet spot for the number of high-quality Few-Shot examples in production prompts?",
        options: [
          "Zero examples are always sufficient",
          "2 to 5 diverse, accurate input-output demonstrations",
          "At least 50 full examples",
          "Only negative examples of what to avoid",
        ],
        correctIndex: 1,
        explanation:
          "2 to 5 targeted examples establish the pattern distribution without bloating the context window or API latency.",
      },
    ],
  },

  3: {
    quizAr: [
      {
        id: "q-pe-3-1",
        type: "mcq",
        question:
          "لماذا تؤدي إضافة عبارة 'فكر خطوة بخطوة واشرح تسلسل تفكيرك' (Chain-of-Thought) إلى قفزة هائلة في دقة المسائل المنطقية والحسابية؟",
        options: [
          "لأنها تجبر النموذج على توليد توكنز استدلال وسيطة تمنعه من القفز المتسرع لاستنتاج إحصائي خاطئ",
          "لأنها تزيد من سرعة استجابة السيرفر وتضغط البيانات",
          "لأنها تجعل النموذج ينسخ الإجابة مباشرة من محركات البحث",
          "لأنها تعطل أنظمة الأمان داخل واجهة البرمجة",
        ],
        correctIndex: 0,
        explanation:
          "نماذج اللغة تتوقع الكلمة التالية؛ كتابة خطوات الاستدلال واحدة تلو الأخرى يبني سياقاً تراكمياً يقود حتمياً إلى الاستنتاج الصحيح في نهاية السلسلة.",
      },
      {
        id: "q-pe-3-2",
        type: "tf",
        question:
          "تقنية Chain-of-Thought مفيدة فقط في المسائل الرياضية ولا تفيد في تصحيح الأكواد البرمجية أو تحليل العقود القانونية.",
        options: ["صح", "غلط"],
        correctIndex: 1,
        explanation:
          "غلط! التفكير المتسلسل أداة جبارة في تتبع مسارات الأخطاء البرمجية (Debugging)، واستخراج الثغرات التعاقدية في النصوص القانونية المعقدة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-3-1",
        type: "mcq",
        question:
          "Why does Chain-of-Thought (CoT) prompting drastically boost accuracy in multi-step reasoning tasks?",
        options: [
          "It forces the generation of intermediate reasoning tokens, preventing premature stochastic leaps",
          "It reduces server computation latency and token usage",
          "It causes the LLM to scrape live internet databases directly",
          "It disables safety and alignment filters",
        ],
        correctIndex: 0,
        explanation:
          "LLMs predict token-by-token. Emitting reasoning steps builds the foundational context required to conclude correctly.",
      },
      {
        id: "q-pe-3-2",
        type: "tf",
        question:
          "Chain-of-Thought is exclusively useful for basic arithmetic and offers no value in software debugging or contract analysis.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation:
          "False! Step-by-step reasoning is standard for identifying race conditions in code and spotting ambiguous contractual loopholes.",
      },
    ],
  },

  4: {
    quizAr: [
      {
        id: "q-pe-4-1",
        type: "mcq",
        question:
          "ما هي الفائدة التقنية الرئيسية من استخدام المحددات (Delimiters) مثل علامات التنصيص الثلاثية (```) أو وسوم XML مثل `<context>` داخل الأوامر؟",
        options: [
          "فصل التعليمات الحاكمة عن نصوص المدخلات والبيانات الخام لمنع الخلط وتفادي هجمات حقن الأوامر",
          "جعل البرومبت يبدو ككود برمجي للزينة فقط",
          "تخفيض التكلفة المالية للاشتراك الشهري في النموذج",
          "إلغاء الحاجة لكتابة أي سياق توضيحي",
        ],
        correctIndex: 0,
        explanation:
          "المحددات تعزل مدخلات المستخدم عن تعليمات النظام، مما يمنع النموذج من التعامل مع بيانات المستخدم كأوامر تنفيذية قد تفسد المنطق.",
      },
      {
        id: "q-pe-4-2",
        type: "mcq",
        question:
          "أي من النماذج الرائدة التالية تفضل بشكل رسمي استخدام وسوم XML المهيكلة (مثل `<instructions>` و `<examples>`) لتوجيه انتباهها بدقة استثنائية؟",
        options: [
          "محركات البحث التقليدية المبنية على الكلمات المفتاحية",
          "نماذج Claude (من Anthropic) ونماذج Gemini الحديثة",
          "برامج تحرير الصور النقطية البسيطة",
          "نماذج توليد الأصوات القديمة",
        ],
        correctIndex: 1,
        explanation:
          "توثيق Anthropic الرسمي يوصي صراحة باستخدام وسوم XML لتنظيم السياق والتعليمات والمدخلات بدقة بالغة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-4-1",
        type: "mcq",
        question:
          "What is the primary architectural purpose of using delimiters such as triple quotes (```) or XML tags (`<context>`) in prompts?",
        options: [
          "Explicitly isolating control instructions from untrusted data inputs to prevent instruction injection",
          "Pure cosmetic styling to make prompts look technical",
          "Lowering monthly subscription costs with the vendor",
          "Bypassing token limits automatically",
        ],
        correctIndex: 0,
        explanation:
          "Delimiters prevent semantic confusion by demarcating instructions from data payloads.",
      },
      {
        id: "q-pe-4-2",
        type: "mcq",
        question:
          "Which leading frontier model family explicitly recommends XML structuring tags in its official system documentation?",
        options: [
          "Traditional boolean search indexes",
          "Anthropic's Claude and Google's Gemini models",
          "Raster graphics editors",
          "Legacy text-to-speech engines",
        ],
        correctIndex: 1,
        explanation:
          "Anthropic's prompt engineering guidelines specifically advise using XML tags to structure complex enterprise prompts.",
      },
    ],
  },

  5: {
    quizAr: [
      {
        id: "q-pe-5-1",
        type: "mcq",
        question:
          "ما هو الدور الأساسي لرسالة النظام (System Prompt) مقارنة برسالة المستخدم (User Prompt) في تطبيقات الذكاء الاصطناعي؟",
        options: [
          "رسالة النظام تحدد الهوية الثابتة، القواعد الصارمة، وحدود الأمان للجلسة بأكملها، بينما رسالة المستخدم تمثل الطلب الحالي",
          "رسالة النظام تظهر للعميل في واجهة المحادثة ورسالة المستخدم تكون مخفية",
          "لا يوجد أي فرق بينهما؛ النماذج تعاملهما بنفس الوزن الإحصائي تماماً",
          "رسالة النظام مخصصة فقط لتحديد اسم المستخدم وكلمة المرور",
        ],
        correctIndex: 0,
        explanation:
          "الـ System Prompt يتمتع بأولوية عليا في توجيه سلوك النموذج عبر كل جولات المحادثة المتعددة ويصعب على المستخدم العادي تجاوزه.",
      },
      {
        id: "q-pe-5-2",
        type: "tf",
        question:
          "وضع قيود الأمان ونبرة الصوت وسياسات الخصوصية داخل System Prompt أكثر استقراراً بكثير من تكرارها يدparamوياً في كل رسالة مستخدم.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! رسالة النظام تشكل الإطار الحاكم للذاكرة التراكمية وتضمن الاتساق عبر كامل دورة حياة المحادثة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-5-1",
        type: "mcq",
        question:
          "What is the fundamental role of a System Prompt compared to a User Prompt?",
        options: [
          "Setting persistent behavioral boundaries, personas, and safety guardrails across the entire session",
          "Displaying customer UI alerts while keeping user prompts hidden",
          "There is zero functional distinction; both are identical token streams",
          "Storing database credentials exclusively",
        ],
        correctIndex: 0,
        explanation:
          "System prompts establish the overarching context and governing constraints that steer multi-turn conversations.",
      },
      {
        id: "q-pe-5-2",
        type: "tf",
        question:
          "Embedding safety guardrails and persona tone in the System Prompt is far more robust than re-injecting them in every user turn.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! System instructions carry persistent architectural weight across conversational context turns.",
      },
    ],
  },

  6: {
    quizAr: [
      {
        id: "q-pe-6-1",
        type: "mcq",
        question:
          "ما هو التكنيك الأقوى لمنع النموذج من اختلاق معلومات غير حقيقية (الهلوسة) عند سؤاله عن وثيقة أو تقرير محدد؟",
        options: [
          "أمر النموذج بالثقة المطلقة في ذاكرته العامة وتجاهل الوثيقة",
          "تقييد النموذج بالإجابة حصراً من النص المقدم وإعطاؤه رخصة صريحة لقول: 'غير مذكور في الوثيقة' إن لم يجد المعلومة",
          "رفع درجة الحرارة (Temperature) إلى أقصى حد متاح",
          "حذف التواريخ والأرقام من النص المرفق",
        ],
        correctIndex: 1,
        explanation:
          "إلزام النموذج بالاستناد الحصري (Grounding) ومنحه مخرجاً مشروعاً للاعتراف بعدم وجود المعلومة يقضي على الهلوسة بنسبة تكاد تلامس 100%.",
      },
      {
        id: "q-pe-6-2",
        type: "tf",
        question:
          "النماذج اللغوية تتوقف تلقائياً عن الإجابة وتعترف بجهلها إذا سألتها عن معلومة نادرة أو غير مؤكدة دون الحاجة لأي توجيه في البرومبت.",
        options: ["صح", "غلط"],
        correctIndex: 1,
        explanation:
          "غلط! النماذج مدربة على إكمال التوقع الإحصائي للنصوص، وستميل لاختلاق إجابات تبدو مقنعة ولغتها فصيحة ما لم تُقيد بصرامة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-6-1",
        type: "mcq",
        question:
          "What is the most effective prompt engineering technique for eliminating hallucinations when querying factual documents?",
        options: [
          "Instructing the model to rely solely on internal weights while ignoring the text",
          "Grounding the model strictly to the provided text and explicitly instructing: 'State: Not found in source if absent'",
          "Setting temperature to its maximum allowed value",
          "Stripping all citations and dates from the prompt context",
        ],
        correctIndex: 1,
        explanation:
          "Strict grounding and granting an explicit negative fallback permission ('If not found, reply with X') suppresses speculative hallucination.",
      },
      {
        id: "q-pe-6-2",
        type: "tf",
        question:
          "Large Language Models will naturally refuse to answer and admit ignorance on rare facts without any prompt constraints.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation:
          "False! Due to autoregressive next-token prediction, models generate plausible-sounding falsehoods unless constrained.",
      },
    ],
  },

  7: {
    quizAr: [
      {
        id: "q-pe-7-1",
        type: "mcq",
        question:
          "كيف تختبر ما إذا كان البرومبت الذي صممته جاهزاً للإنتاج التجاري للشركات (Production Readiness)؟",
        options: [
          "تجربته مرة واحدة على سؤال سهل ورؤية نتيجة مقبولة",
          "إخضاعه لمصفوفة اختبار معيارية (Eval Suite) تضم 20+ حالة عادية وحالات حافة شاذة (Edge Cases) وقياس نسبة الخطأ",
          "التأكد من أن البرومبت يحتوي على أكثر من ألف كلمة",
          "سؤال النموذج نفسه: 'هل هذا البرومبت ممتاز؟'",
        ],
        correctIndex: 1,
        explanation:
          "الاختبارات المعيارية المنهجية (Evals) هي الفيصل الهندسي؛ نجاح البرومبت في تجربة واحدة عشوائية لا يضمن استقراره في الإنتاج الحقيقي.",
      },
      {
        id: "q-pe-7-2",
        type: "tf",
        question:
          "فحص حالات الحافة الشاذة (Edge Cases مثل نصوص فارغة، مدخلات بلغات غير متوقعة، أو أسئلة محرفة) جزء إلزامي من تقييم البرومبتات التجارية.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح تماماً! حالات الحافة هي ما يميز النظام البرمجي المتماسك عن النماذج التجريبية الهشة في عالم الأعمال.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-7-1",
        type: "mcq",
        question:
          "How do you verify whether a newly engineered prompt is production-ready for enterprise deployment?",
        options: [
          "Testing it once on an easy happy-path input",
          "Running an evaluation suite across 20+ varied inputs including adversarial and edge cases to measure accuracy",
          "Verifying that the prompt text exceeds 1,000 words",
          "Asking the model: 'Do you consider this prompt high quality?'",
        ],
        correctIndex: 1,
        explanation:
          "Systematic evaluation suites (Evals) measuring edge cases and failure modes are required for enterprise reliability.",
      },
      {
        id: "q-pe-7-2",
        type: "tf",
        question:
          "Stress-testing edge cases (empty strings, unexpected languages, malformed queries) is mandatory before deploying prompts to production.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Robust error handling under unexpected inputs separates toy prototypes from production software.",
      },
    ],
  },

  8: {
    quizAr: [
      {
        id: "q-pe-8-1",
        type: "mcq",
        question:
          "ما هو الإجراء الأكثر فاعلية لضمان الحصول على كائن JSON نقي وصالح برمجياً بنسبة 100% دون أي نصوص ترحيبية أو markdown غير مرغوب فيه؟",
        options: [
          "تحديد هيكل المخطط (JSON Schema) بدقة، وتضمين أمر صريح: 'أخرج فقط JSON صالح بدون نصوص تمهيدية'، وتفعيل وضع JSON Mode إن توفر",
          "الرجاء من النموذج أن يتذكر أنك مبرمج جافاسكريبت",
          "كتابة كلمة JSON عدة مرات في بداية ونهاية البرومبت",
          "السماح للنموذج بكتابة مقدمة يشرح فيها ما هو الـ JSON",
        ],
        correctIndex: 0,
        explanation:
          "توفير المخطط الصارم وإلغاء المقدمات التوضيحية (No preamble) يمنع أخطاء JSON.parse في التطبيقات البرمجية وقواعد البيانات.",
      },
      {
        id: "q-pe-8-2",
        type: "tf",
        question:
          "استخراج البيانات المنظمة (Structured JSON) يمثل حجر الأساس لربط مخرجات نماذج الذكاء الاصطناعي مع واجهات التطبيقات (APIs) وقواعد البيانات.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! بدون بيانات مهيكلة بصيغ قياسية مثل JSON، يستحيل بناء أتمتة مؤسسية موثوقة تعتمد على الذكاء الاصطناعي.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-8-1",
        type: "mcq",
        question:
          "What is the most robust technique to guarantee raw, 100% parseable JSON without conversational preambles or markdown backticks?",
        options: [
          "Specifying an exact JSON schema, commanding 'Return only valid JSON without explanation', and enabling JSON Mode",
          "Pleading with the model to remember you are a frontend developer",
          "Typing the word JSON ten times in capital letters",
          "Allowing the model to include educational commentary on JSON syntax",
        ],
        correctIndex: 0,
        explanation:
          "Schema enforcement combined with negative preamble constraints ensures reliable JSON parsing in downstream code.",
      },
      {
        id: "q-pe-8-2",
        type: "tf",
        question:
          "Extracting structured JSON is the primary bridge connecting LLM outputs to backend databases and web applications.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Structured data extraction turns generative text into actionable data objects.",
      },
    ],
  },

  9: {
    quizAr: [
      {
        id: "q-pe-9-1",
        type: "mcq",
        question:
          "متى يجب عليك تقسيم المهمة إلى سلسلة أوامر متعاقبة (Prompt Chaining) بدلاً من كتابة برومبت واحد عملاق؟",
        options: [
          "عندما تتكون العملية من مهام فرعية متعددة ومعقدة (مثل: البحث ثم التلخيص ثم الترجمة ثم التدقيق)، حيث يؤدي دمجها لتشتت جودة النموذج",
          "عندما يكون الطلب بسيطاً ومباشراً مثل تلخيص جملة من ثلاث كلمات",
          "إذا أردت استهلاك المزيد من الوقت بدون داعٍ",
          "إذا كان النموذج غير قادر على قراءة اللغة الإنجليزية",
        ],
        correctIndex: 0,
        explanation:
          "سلاسل الأوامر تجعل كل مرحلة تركز على هدف واحد فائق الدقة، وتمرر مخرجاتها النقية كمدخل موثوق للمرحلة التالية.",
      },
      {
        id: "q-pe-9-2",
        type: "tf",
        question:
          "دمج 6 متطلبات معرفية معقدة في برومبت واحد ضخم يعطي دائماً نتائج أفضل من تقسيمها لمراحل تسلسلية متتابعة.",
        options: ["صح", "غلط"],
        correctIndex: 1,
        explanation:
          "غلط! تكديس الأهداف المعقدة في برومبت واحد يشتت شبكات الانتباه ويؤدي لتجاهل بعض التعليمات الحرجة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-9-1",
        type: "mcq",
        question:
          "When should you decompose a workflow into a sequential Prompt Chain instead of using a single monolithic prompt?",
        options: [
          "When the workflow comprises multiple cognitive steps (e.g. search -> extract -> synthesize -> audit) that degrade if bundled",
          "When executing a trivial one-word dictionary lookup",
          "When deliberately seeking higher API bills without reason",
          "When the LLM only understands basic commands",
        ],
        correctIndex: 0,
        explanation:
          "Prompt chaining isolates cognitive load per step, allowing verification checkpoints between pipeline stages.",
      },
      {
        id: "q-pe-9-2",
        type: "tf",
        question:
          "Bundling six intricate cognitive instructions into one massive prompt always outperforms chaining them into focused sequential phases.",
        options: ["True", "False"],
        correctIndex: 1,
        explanation:
          "False! Monolithic prompts frequently suffer from instruction omission and diluted attention distributions.",
      },
    ],
  },

  10: {
    quizAr: [
      {
        id: "q-pe-10-1",
        type: "mcq",
        question:
          "كيف تصيغ برومبتاً يعكس نبرة صوت وشخصية علامة تجارية محددة بدقة متناهية ودون تفاوت؟",
        options: [
          "تحديد هوية الجمهور المستهدف، قائمة الكلمات الممنوعة والمفضلة، ومستوى الرسمية، وتضمين 3 نماذج لكتابات الشركة السابقة",
          "قول 'اكتب بأسلوب شاعري جميل' فقط في سطر واحد",
          "استخدام علامات تعجب في كل جملة لإظهار الحماس",
          "إخبار النموذج أن يتحدث كإنسان آلي من أفلام الخيال العلمي",
        ],
        correctIndex: 0,
        explanation:
          "نبرة الصوت تُنقل بدقة عبر القواعد المحددة والأمثلة الحية (Few-shot) وقوائم المفردات المعتمدة والمحظورة.",
      },
      {
        id: "q-pe-10-2",
        type: "tf",
        question:
          "تقديم نماذج من منشورات أو مقالات سابقة للشركة هو أسرع وأدق أسلوب لتعليم النموذج نبرة الصوت المحددة دون تنظير طويل.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! النماذج تلتقط الإيقاع اللغوي والمفردات من الأمثلة الواقعية بكفاءة استثنائية تفوق مجرد الشرح الوصفي.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-10-1",
        type: "mcq",
        question:
          "How do you architect a prompt to mirror a precise corporate brand voice consistently?",
        options: [
          "Defining target audience, vocabulary whitelists/blacklists, formality tier, and providing 3 past approved copy samples",
          "Simply requesting: 'Write in a cool, inspiring style'",
          "Placing exclamation points at the end of every sentence",
          "Instructing the model to speak like a sci-fi robot",
        ],
        correctIndex: 0,
        explanation:
          "Brand persona requires deterministic lexical constraints, tone definitions, and in-context reference samples.",
      },
      {
        id: "q-pe-10-2",
        type: "tf",
        question:
          "Providing actual reference excerpts of past published copy is the fastest way to align an LLM with a specific brand voice.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! In-context examples convey sentence cadence, vocabulary choices, and nuance better than abstract descriptions.",
      },
    ],
  },

  11: {
    quizAr: [
      {
        id: "q-pe-11-1",
        type: "mcq",
        question:
          "إذا كنت تصمم برومبت لاستخراج أكواد برمجية أو حسابات مالية دقيقة لا تحتمل أي خطأ، فما هو الإعداد الأمثل لدرجة الحرارة (Temperature)؟",
        options: [
          "قيمة منخفضة جداً (من 0.0 إلى 0.2) لتقليل التباين العشوائي وجعل الإجابات حتمية ومستقرة",
          "قيمة مرتفعة جداً (من 1.5 إلى 2.0) لزيادة الخيال والإثارة",
          "درجة الحرارة لا تؤثر على الإجابة لأنها تؤثر فقط على حرارة معالج الحاسوب",
          "أعلى قيمة ممكنة لإنتاج نتائج مفاجئة وغير متوقعة",
        ],
        correctIndex: 0,
        explanation:
          "الـ Temperature المنخفضة تجعل النموذج يختار دائماً التوكنات ذات الاحتمالية الرياضية الأعلى، مما يضمن ثبات ودقة النتائج الرياضية والبرمجية.",
      },
      {
        id: "q-pe-11-2",
        type: "mcq",
        question:
          "ما فائدة رفع قيمة Temperature إلى 0.8 أو 0.9 في مهام كتابة المحتوى والتسويق؟",
        options: [
          "تخفيض تكلفة استهلاك الكهرباء",
          "زيادة تنوع المفردات وكسر التكرار النمطي لإنتاج أفكار إبداعية غير مألوفة",
          "إصلاح الأخطاء الإملائية تلقائياً",
          "منع انقطاع الاتصال بالسيرفر",
        ],
        correctIndex: 1,
        explanation:
          "القيم المرتفعة تفتح المجال لاختيار توكنات أقل شيوعاً إحصائياً، مما يمنح النصوص الإبداعية حيوية وتنوعاً بعيداً عن الكليشيهات المكررة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-11-1",
        type: "mcq",
        question:
          "When configuring an LLM for code generation or financial ledger auditing, what is the optimal Temperature setting?",
        options: [
          "Very low (0.0 to 0.2) to minimize stochastic variance and maximize deterministic correctness",
          "Very high (1.5 to 2.0) to stimulate artistic imagination",
          "Temperature only controls physical GPU temperature and has no impact on tokens",
          "Maximum allowable setting to produce unexpected variations",
        ],
        correctIndex: 0,
        explanation:
          "Low temperature flattens token sampling toward the argmax probabilities, enforcing reliable factual determinism.",
      },
      {
        id: "q-pe-11-2",
        type: "mcq",
        question:
          "Why would a prompt engineer deliberately increase Temperature to 0.8 or 0.9 for marketing ideation?",
        options: [
          "To lower server electrical draw",
          "To broaden the token sampling pool and spark diverse, non-cliché creative angles",
          "To automatically fix spelling errors",
          "To prevent socket timeout errors",
        ],
        correctIndex: 1,
        explanation:
          "Higher temperature introduces exploratory stochasticity, breaking rigid conventional language patterns for brainstorming.",
      },
    ],
  },

  12: {
    quizAr: [
      {
        id: "q-pe-12-1",
        type: "mcq",
        question:
          "ما هي ظاهرة 'الإبرة في كومة القش' (Lost in the Middle / Needle in a Haystack) عند التعامل مع نوافذ السياق الضخمة (100k+ tokens)؟",
        options: [
          "ميل النماذج لتذكر المعلومات الموجودة في بداية ونهاية البرومبت بدقة عالية، وتراجع انتباهها للمعلومات المدفونة في المنتصف",
          "فقدان الاتصال بالإنترنت أثناء رفع الملفات الطويلة",
          "عدم قدرة النموذج على قراءة ملفات النصوص العربية",
          "حظر حساب المستخدم بسبب طول النص",
        ],
        correctIndex: 0,
        explanation:
          "آليات الانتباه (Attention) تظهر انحيازاً للبداية والنهاية (Primacy & Recency Bias)؛ لذا يجب وضع التعليمات الحيوية في نهاية البرومبت مباشرة.",
      },
      {
        id: "q-pe-12-2",
        type: "tf",
        question:
          "وضع أهم تعليمات التنسيق والقيود في نهاية البرومبت مباشرة (بعد نصوص المراجع الطويلة) يرفع التزام النموذج بها بشكل ملحوظ.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! انتباه النموذج يتأثر بشدة بآخر ما يقرأه قبل بدء التوليد، وهو ما يُعرف بـ Recency Effect في هندسة الأوامر.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-12-1",
        type: "mcq",
        question:
          "What is the 'Lost in the Middle' phenomenon observed in long-context window models (100k+ tokens)?",
        options: [
          "Models attend effectively to information at the beginning and end of context, but recall degrades for data in the middle",
          "Network packets dropping during large document uploads",
          "The inability of models to parse Arabic glyphs",
          "Account suspensions due to payload size",
        ],
        correctIndex: 0,
        explanation:
          "Transformer attention mechanisms display U-shaped attention curves, favoring context boundaries over internal depths.",
      },
      {
        id: "q-pe-12-2",
        type: "tf",
        question:
          "Placing crucial constraints and instructions at the very end of the prompt (after large source references) significantly improves adherence.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Recency bias ensures the model's final attention activations anchor on your core instructions.",
      },
    ],
  },

  13: {
    quizAr: [
      {
        id: "q-pe-13-1",
        type: "mcq",
        question:
          "كيف يعمل نمط ReAct (Reason + Act) واستدعاء الأدوات (Tool / Function Calling) داخل تطبيقات الذكاء الاصطناعي؟",
        options: [
          "النموذج يحلل المسألة، يقرر استدعاء أداة خارجية (مثل آلة حاسبة أو استعلام قاعدة بيانات)، يتلقى النتيجة، ثم يصيغ الإجابة النهائية بناءً عليها",
          "النموذج ينفذ أوامر عشوائية دون أي تفكير مسبق",
          "الأداة الخارجية هي التي تكتب البرومبت بدلاً من المستخدم",
          "النموذج يقوم بتوليد صورة لكل سؤال نصي",
        ],
        correctIndex: 0,
        explanation:
          "نمط ReAct يدمج التفكير والاستدعاء التكراري، مما يمكن النموذج من تجاوز حدوده المعرفية والوصول لبيانات حية ودقيقة من مصادر خارجية.",
      },
      {
        id: "q-pe-13-2",
        type: "tf",
        question:
          "نماذج الذكاء الاصطناعي لا تستطيع إجراء عمليات حسابية معقدة بدقة متناهية دون ربطها بأدوات خارجية (مثل Python أو آلة حاسبة) عبر Function Calling.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! النماذج مبنية على توقع النصوص وليس الحساب الرياضي؛ ربطها بأداة خارجية يضمن دقة الأرقام بنسبة 100%.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-13-1",
        type: "mcq",
        question:
          "How does the ReAct (Reason + Act) design pattern operate in LLM tool calling workflows?",
        options: [
          "The model reasons about the goal, emits a structured tool invocation, ingests the environment output, and synthesizes the answer",
          "The model executes arbitrary bash commands without intermediate reasoning",
          "The external tool writes the user prompt autonomously",
          "The model converts every text prompt into an image",
        ],
        correctIndex: 0,
        explanation:
          "ReAct interleaves reasoning traces and task-specific actions, granting the LLM verifiable ground-truth external execution.",
      },
      {
        id: "q-pe-13-2",
        type: "tf",
        question:
          "LLMs cannot reliably perform complex mathematical calculations without delegating to an external tool (e.g. Python runtime) via function calling.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! LLMs are stochastic token estimators, not deterministic arithmetic engines.",
      },
    ],
  },

  14: {
    quizAr: [
      {
        id: "q-pe-14-1",
        type: "mcq",
        question:
          "ما هو المعيار الأهم لضمان نجاح نظام أتمتة برومبتات في خدمة عملاء شركة تجارية كبرى؟",
        options: [
          "وجود حواجز أمان صارمة (Guardrails)، وخطوات واضحة لتحويل الحالات المعقدة لموظف بشري (Human Escalation)، والتعامل الدقيق مع الحالات الشاذة",
          "سرعة كتابة الردود حتى لو كانت تحتوي على معلومات خاطئة ومختلقة",
          "منح الذكاء الاصطناعي صلاحية إعطاء خصومات غير محدودة دون رقابة",
          "استخدام كلمات عامية غير مفهومة في كل رسالة",
        ],
        correctIndex: 0,
        explanation:
          "في بيئات الأعمال الحقيقية، الموثوقية وتجنب الوعود الزائفة وتوفر مسار تحويل بشري عند الشك هما ما يحمي سمعة وميزانية الشركة.",
      },
      {
        id: "q-pe-14-2",
        type: "tf",
        question:
          "إطلاق روبوت ذكاء اصطناعي للتعامل المباشر مع العملاء دون تحديد حالات الرجوع للموظف البشري (Fallbacks) هو مخاطرة تجارية فادحة.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح تماماً! أي نظام ذكاء اصطناعي تجاري يجب أن يمتلك آلية واضحة للتعامل مع ما لا يعرفه دون تأليف أو تصرف عشوائي.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-14-1",
        type: "mcq",
        question:
          "What is the single most critical standard for deploying an automated LLM customer service agent in production?",
        options: [
          "Strict safety guardrails, a seamless human-in-the-loop escalation pathway, and robust handling of ambiguous edge cases",
          "Raw response generation speed regardless of factual inaccuracies",
          "Granting the LLM unconstrained authority to issue arbitrary refunds",
          "Using slang in all communications",
        ],
        correctIndex: 0,
        explanation:
          "Enterprise production systems require determinism, fallback safety rails, and human escalation when confidence is low.",
      },
      {
        id: "q-pe-14-2",
        type: "tf",
        question:
          "Deploying a customer-facing AI agent without fallback human escalation procedures represents an unacceptable commercial risk.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Failure modes without human handoff can cause reputational damage and contractual liabilities.",
      },
    ],
  },

  15: {
    quizAr: [
      {
        id: "q-pe-15-1",
        type: "mcq",
        question:
          "ما هو هجوم حقن الأوامر غير المباشر (Indirect Prompt Injection) وكيف يمثل خطراً أمنياً على الأنظمة؟",
        options: [
          "قيام المستخدم بقطع كابل الإنترنت عن الخادم",
          "دس تعليمات خبيثة خفية داخل صفحة ويب أو مستند يقوم الذكاء الاصطناعي بقراءته وتلخيصه، مما يجعله ينفذ تلك التعليمات بدلاً من أوامر مالك النظام",
          "محاولة تخمين كلمة مرور حساب البريد الإلكتروني",
          "استخدام نموذج ذكاء اصطناعي قديم في الكتابة",
        ],
        correctIndex: 1,
        explanation:
          "حقن الأوامر غير المباشر يستغل قراءة النموذج لمصادر خارجية غير موثوقة تحتوي على نصوص تخدع النموذج لسرقة بيانات أو تجاوز الصلاحيات.",
      },
      {
        id: "q-pe-15-2",
        type: "tf",
        question:
          "فصل مدخلات البيانات غير الموثوقة واستخدام نماذج تدقيق أمني موازية (Guardrail LLMs) يقلل بشكل جذري من مخاطر حقن الأوامر.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! الدفاع في العمق (Defense in Depth) عبر فحص المدخلات وتحديد الصلاحيات هو المعيار القياسي للأمان السيبراني للذكاء الاصطناعي.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-15-1",
        type: "mcq",
        question:
          "What is an Indirect Prompt Injection attack and why is it dangerous in automated workflows?",
        options: [
          "Severing the physical ethernet cable of the host server",
          "Embedding hidden adversarial instructions inside untrusted third-party documents/webpages that hijack the model's control flow",
          "Brute-forcing an administrator email password",
          "Using an outdated LLM version",
        ],
        correctIndex: 1,
        explanation:
          "Indirect injection embeds malicious instructions into external data retrieved by the model, hijacking its runtime execution.",
      },
      {
        id: "q-pe-15-2",
        type: "tf",
        question:
          "Isolating untrusted user payloads with delimiters and utilizing secondary guardrail LLM checkers drastically reduces prompt injection vulnerabilities.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Multi-layered defense-in-depth is the established industry security standard for LLM applications.",
      },
    ],
  },

  16: {
    quizAr: [
      {
        id: "q-pe-16-1",
        type: "mcq",
        question:
          "لماذا يُعتبر استخدام التوجيه الإيجابي (مثل: 'اكتب بإيجاز وركز على النقاط الثلاث الأساسية') أفضل بكثير من التوجيه السلبي المتكرر (مثل: 'لا تكن طويلاً، لا تكتب تفاصيل، لا تستخدم أسلوباً معقداً')؟",
        options: [
          "لأن التوجيه الإيجابي يرسم مساراً واضحاً لما يجب على النموذج إنتاجه، بينما كثرة النفي تلفت انتباه شبكة الانتباه للكلمات المحظورة بالخطأ",
          "لأن النماذج اللغوية تتأثر نفسياً بالكلمات السلبية",
          "لأن استخدام كلمة 'لا' محظور في خوارزميات الذكاء الاصطناعي",
          "لتوفير عدد الحروف على الشاشة فقط",
        ],
        correctIndex: 0,
        explanation:
          "شبكات الانتباه في النماذج تمنح وزناً للتوكنات المذكورة في النص؛ فتكرار النهي عن شيء قد يرفع احتمالية ذكره. التوجيه المباشر للبديل هو الأضمن.",
      },
      {
        id: "q-pe-16-2",
        type: "tf",
        question:
          "إخبار النموذج بما يجب عليه فعله تحديداً أكثر موثوقية وثباتاً في البرومبتات من مجرد سرد قائمة طويلة بما يجب ألا يفعله.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح تماماً! تحديد النتيجة المستهدفة بوضوح يوجه النموذج في مسار احتمالي مستقر وناجح من أول مرة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-16-1",
        type: "mcq",
        question:
          "Why is positive instruction framing ('Write concisely and focus on three key points') far superior to negative constraint listing ('Do not write long text, do not add details')?",
        options: [
          "Positive framing gives the model a deterministic generation target, whereas negative framing activates attention on the forbidden tokens",
          "Because neural networks have emotional feelings that get hurt by negation",
          "Because the word 'not' is syntactically illegal in LLM tokenizers",
          "Purely to save cosmetic pixel width",
        ],
        correctIndex: 0,
        explanation:
          "Attention heads attend to mentioned concepts. Specifying what to do rather than what not to do steers probability mass directly.",
      },
      {
        id: "q-pe-16-2",
        type: "tf",
        question:
          "Directly prescribing the desired output state is far more consistent than maintaining an exhaustive list of prohibited actions.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Prescriptive instructions eliminate ambiguity and constrain the generative distribution effectively.",
      },
    ],
  },

  17: {
    quizAr: [
      {
        id: "q-pe-17-1",
        type: "mcq",
        question:
          "عند تلخيص تقرير مالي أو دراسة حالة ضخمة تتجاوز 40 صفحة، ما هو الأسلوب الهندسي الذي يضمن عدم تفويت الأرقام والقرارات الجوهرية؟",
        options: [
          "طلب تلخيص المستند بأكمله في سطر واحد عشوائي دون أي توجيه",
          "تفكيك التلخيص إلى أقسام هيكلية (Executive Summary, Financial Metrics, Risks) مع إلزام النموذج باقتباس الأرقام حرفياً ومطابقتها",
          "حذف الجداول والرسوم البيانية من المستند قبل إرساله",
          "تكرار الأمر: 'لخص كل شيء بسرعة'",
        ],
        correctIndex: 1,
        explanation:
          "التلخيص الهيكلي مع اشتراط اقتباس الأرقام بالنص الأصلي يمنع التقريب العشوائي أو التخمين ويضمن سلامة التدقيق المالي.",
      },
      {
        id: "q-pe-17-2",
        type: "tf",
        question:
          "طلب توثيق الاقتباسات بذكر رقم الصفحة أو الفقرة الأصلية في المخرجات يسهل التحقق البشري السريع ويكشف أي هلوسة فوراً.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! التوثيق المرجعي (Citation Grounding) هو الركيزة الأساسية للثقة في المستندات القانونية والمالية الحساسة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-17-1",
        type: "mcq",
        question:
          "When synthesizing a 40-page financial report, what prompt architecture ensures no critical numeric metrics or risks are omitted?",
        options: [
          "Requesting a one-sentence summary without constraints",
          "Decomposing the synthesis into explicit structural categories and enforcing verbatim citation of all numerical metrics",
          "Deleting tables and charts before providing context",
          "Typing 'summarize faster' in all caps",
        ],
        correctIndex: 1,
        explanation:
          "Category-based structural synthesis combined with exact numeric quotation anchors factual fidelity.",
      },
      {
        id: "q-pe-17-2",
        type: "tf",
        question:
          "Mandating paragraph or page citations in synthesized deliverables enables instant human verification and catches hallucinations immediately.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Citation grounding transforms untrusted model generation into auditable, enterprise-grade analysis.",
      },
    ],
  },

  18: {
    quizAr: [
      {
        id: "q-pe-18-1",
        type: "mcq",
        question:
          "كيف تصيغ برومبتاً لتوليد كود برمجي خالي من الثغرات، سريع، ومتوافق تماماً مع مشروعك؟",
        options: [
          "تحديد لغة البرمجة والإصدار، والمكتبات المعتمدة، ومعايير الأداء، وطلب كتابة اختبارات الوحدة (Unit Tests) لتغطية حالات الحافة",
          "كتابة: 'اكتب لي كود رائع مثل فيسبوك' دون تفاصيل",
          "أمر النموذج بكتابة الكود بدون أي أسماء للمتغيرات",
          "الاعتماد على النماذج التوليدية القديمة التي لا تدعم الكود",
        ],
        correctIndex: 0,
        explanation:
          "تحديد الإصدار والمكتبات وطلب اختبارات الوحدة يوجه النموذج لاتباع أفضل الممارسات وتفادي كتابة كود متهالك أو غير متوافق.",
      },
      {
        id: "q-pe-18-2",
        type: "tf",
        question:
          "طلب كتابة اختبارات الوحدة (Unit Tests) جنباً إلى جنب مع الكود البرمجي يجبر النموذج على التفكير العميق في الأخطاء المحتملة وحالات الانهيار.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح تماماً! اختبارات الوحدة تكشف فوراً ما إذا كان المنطق البرمجي سليماً وتوفر توكنات استدلالية تحسن جودة الكود نفسه.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-18-1",
        type: "mcq",
        question:
          "How do you craft an engineering prompt to generate robust, production-grade code that integrates seamlessly into your codebase?",
        options: [
          "Specifying runtime version, permitted libraries, architecture constraints, and demanding accompanying unit tests for edge cases",
          "Writing 'build me an app like Facebook' with no further details",
          "Instructing the model to omit variable names entirely",
          "Relying on deprecated non-code models",
        ],
        correctIndex: 0,
        explanation:
          "Precise environment framing, library boundary constraints, and test-driven prompting guarantee deployable code.",
      },
      {
        id: "q-pe-18-2",
        type: "tf",
        question:
          "Requiring unit tests alongside generated code forces the LLM to model failure states and edge cases during token generation.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Test requirements act as programmatic reasoning checks that elevate the quality of the synthesized code.",
      },
    ],
  },

  19: {
    quizAr: [
      {
        id: "q-pe-19-1",
        type: "mcq",
        question:
          "عند استخدام الذكاء الاصطناعي لكتابة نصوص إعلانية أو صفحات هبوط (Copywriting)، ما هو الإطار الأكثر فاعلية لرفع معدل التحويل (Conversion Rate)؟",
        options: [
          "استخدام إطار إعلاني مثبت (مثل PAS: المشكلة، الإثارة، الحل) مع تحديد مشاعر وألم العميل المستهدف ودعوة واضحة لاتخاذ إجراء (CTA)",
          "مدح المنتج بشكل مبالغ فيه باستخدام كلمات مثل 'الأفضل في المجرة'",
          "كتابة نصوص طويلة جداً بدون أي فواصل أو عناوين",
          "تكرار اسم الشركة في كل سطر خمس مرات",
        ],
        correctIndex: 0,
        explanation:
          "الأطر التسويقية المجربة (مثل PAS أو AIDA) تمنح النموذج هيكلية نفسية تركز على إقناع العميل وحل مشكلته بدلاً من الكلام الإنشائي السطحي.",
      },
      {
        id: "q-pe-19-2",
        type: "tf",
        question:
          "إخبار النموذج بالاعتراضات المتوقعة من العميل وطريقة الرد عليها مسبقاً ينتج نصوصاً تسويقية أكثر إقناعاً وقوة بنسبة ملحوظة.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! تفكيك اعتراضات العميل مسبقاً داخل البرومبت يمنح النص النهائي واقعية ومصداقية ترفع ثقة المشتري فوراً.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-19-1",
        type: "mcq",
        question:
          "When directing an LLM to generate high-converting landing page copy, which methodology yields the highest conversion rates?",
        options: [
          "Constraining generation with proven direct-response frameworks (e.g. PAS: Problem-Agitate-Solution) and explicit target ICP pains",
          "Using hyper-exaggerated buzzwords like 'revolutionary game-changer' repeatedly",
          "Generating wall-to-wall unstructured blocks of text with no visual headers",
          "Keyword-stuffing the company name five times per paragraph",
        ],
        correctIndex: 0,
        explanation:
          "Established conversion frameworks structure LLM generation around user pain points and quantifiable value propositions.",
      },
      {
        id: "q-pe-19-2",
        type: "tf",
        question:
          "Providing the model with anticipated customer objections and preemptive counter-arguments produces substantially more persuasive copy.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Preempting buyer friction builds immediate authentic credibility in marketing deliverables.",
      },
    ],
  },

  20: {
    quizAr: [
      {
        id: "q-pe-20-1",
        type: "mcq",
        question:
          "كيف تستفيد بأقصى درجة عند إرسال صورة أو مخطط بياني إلى نموذج يدعم الرؤية (Multimodal Vision Model)؟",
        options: [
          "توجيه سؤال محدد جداً (مثل: 'اقرأ محور السينات، حدد شهر الانخفاض، واحسب النسبة المئوية للتراجع') مع طلب الإجابة في جدول منظم",
          "إرسال الصورة بدون كتابة أي كلمة والانتظار حتى يخمن النموذج ما تريده",
          "تقليل دقة الصورة حتى تصبح مبكسلة وغير واضحة تماماً",
          "الافتراض أن النموذج يرى المشاعر الخفية في الصورة دون معطيات بصرية",
        ],
        correctIndex: 0,
        explanation:
          "النماذج متعددة الوسائط تحتاج لتوجيه هندسي دقيق يركز انتباهها على المنطقة أو البيانات المطلوب استخراجها من الصورة بدلاً من الوصف السطحي العام.",
      },
      {
        id: "q-pe-20-2",
        type: "tf",
        question:
          "نماذج الرؤية المتقدمة قادرة على قراءة رسم تخطيطي مرسوم باليد (Wireframe) وتحويله إلى كود HTML و Tailwind CSS نظيف إذا وُجّهت ببرومبت سليم.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! هندسة الأوامر البصرية تتيح تحويل الاسكتشات والواجهات إلى مكونات برمجية قابلة للتشغيل في دقائق معدودة.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-20-1",
        type: "mcq",
        question:
          "How do you achieve maximum analytical precision when prompting multimodal vision models with charts and diagrams?",
        options: [
          "Asking explicit, targeted coordinate questions (e.g. 'Read the X-axis, pinpoint the lowest month, calculate percent dip') in a markdown table",
          "Uploading the image with zero prompt instructions and letting the model guess",
          "Downscaling the image into a blurry thumbnail before uploading",
          "Assuming the model can infer psychic intent without visual tokens",
        ],
        correctIndex: 0,
        explanation:
          "Targeted spatial and categorical directives channel the visual encoder's embeddings toward exact coordinates and numeric extraction.",
      },
      {
        id: "q-pe-20-2",
        type: "tf",
        question:
          "Frontier multimodal models can analyze hand-drawn UI wireframes and generate working Tailwind CSS and HTML components accurately.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Multimodal visual-to-code pipelines are a standard enterprise use-case for rapid prototyping.",
      },
    ],
  },

  21: {
    quizAr: [
      {
        id: "q-pe-21-1",
        type: "mcq",
        question:
          "ما هي العلاقة الجوهرية بين تقنية الـ RAG (Retrieval-Augmented Generation) وبين هندسة الأوامر (Prompt Engineering)؟",
        options: [
          "الـ RAG يسترجع النصوص والمعلومات الحديثة من قاعدة البيانات، بينما مهندس الأوامر يصيغ كيفية دمج تلك النصوص وتوجيه النموذج للاستناد عليها بدقة",
          "الـ RAG يلغي الحاجة تماماً لكتابة أي برومبت",
          "هندسة الأوامر مخصصة فقط لتوليد الصور والـ RAG مخصص للموسيقى",
          "لا توجد أي علاقة بينهما فهما تقنيتان متناقضتان",
        ],
        correctIndex: 0,
        explanation:
          "الـ RAG وهندسة الأوامر يكملان بعضهما؛ فمهما كانت دقة النصوص المسترجعة، فإن البرومبت النهائي هو الذي يحدد كيفية قراءتها والرد على المستخدم دون هلوسة.",
      },
      {
        id: "q-pe-21-2",
        type: "tf",
        question:
          "استخدام تقنية RAG مع برومبتات استناد صارمة يتيح للشركات الإجابة من آلاف المستندات الخاصة المتغيرة يومياً دون الحاجة لإعادة تدريب النموذج بتكلفة باهظة.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! الـ RAG الموجه بهندسة أوامر احترافية يوفر ملايين الدولارات مقارنة بإعادة تدريب النماذج من الصفر.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-21-1",
        type: "mcq",
        question:
          "What is the symbiotic relationship between Retrieval-Augmented Generation (RAG) and Prompt Engineering?",
        options: [
          "RAG retrieves relevant dynamic context embeddings from a vector store, while prompt engineering formats and constrains how the LLM synthesizes them",
          "RAG completely eliminates the need for prompts or system instructions",
          "Prompt engineering is exclusively for image generation while RAG is for audio synthesis",
          "They are mutually exclusive, contradictory technologies",
        ],
        correctIndex: 0,
        explanation:
          "RAG supplies external dynamic ground truth; prompt engineering dictates synthesis constraints, tone, and citation mechanics.",
      },
      {
        id: "q-pe-21-2",
        type: "tf",
        question:
          "Deploying RAG with strict prompt grounding allows enterprises to query dynamic proprietary data without costly full model fine-tuning.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! In-context grounding via RAG is vastly more cost-efficient and agile than parameter weight re-training.",
      },
    ],
  },

  22: {
    quizAr: [
      {
        id: "q-pe-22-1",
        type: "mcq",
        question:
          "كيف تطبق منهجية 'الذكاء الاصطناعي كحكم' (LLM-as-a-Judge) لاختبار وتفضيل البرومبتات آلياً في الشركات؟",
        options: [
          "استخدام نموذج متقدم ذو قدرات استدلال عالية، وتزويده بمعايير ومصفوفة تقييم صارمة لفحص مخرجات البرومبتات المختلفة ومقارنتها بالأرقام",
          "نشر استطلاع رأي عشوائي على منصات التواصل الاجتماعي",
          "الاعتماد على الحدس الشخصي دون تدوين أي معايير",
          "افتراض أن أول نتيجة تظهر هي النتيجة المثالية دائماً",
        ],
        correctIndex: 0,
        explanation:
          "منهجية LLM-as-a-Judge تتيح تقييم آلاف المخرجات آلياً وبسرعة فائقة وبتكلفة منخفضة، مما يمكن الشركات من إجراء اختبارات A/B دقيقة.",
      },
      {
        id: "q-pe-22-2",
        type: "tf",
        question:
          "المقارنة العلمية بين نسختين من البرومبت (A/B Testing) وقياس معدل نجاح كل نسخة بالأرقام يمنحك قرارات تطوير مدعومة بالبيانات.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! في هندسة الأوامر الاحترافية، الأرقام والاختبارات المقارنة هي التي تثبت كفاءة التعديلات وليس الانطباعات الذاتية.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-22-1",
        type: "mcq",
        question:
          "How does the 'LLM-as-a-Judge' methodology automate enterprise prompt evaluation at scale?",
        options: [
          "Using a superior reasoning model equipped with rigorous rubrics to evaluate and score prompt outputs programmatically",
          "Publishing random Twitter polls to judge output quality",
          "Relying entirely on subjective gut intuition without recording criteria",
          "Assuming the first generated response is always optimal",
        ],
        correctIndex: 0,
        explanation:
          "LLM-as-a-Judge enables scalable, automated regression testing and A/B benchmarking across thousands of edge cases.",
      },
      {
        id: "q-pe-22-2",
        type: "tf",
        question:
          "Programmatic A/B testing between two prompt iterations measuring empirical pass rates provides data-driven deployment confidence.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Engineering discipline demands empirical benchmarks over anecdotal intuition.",
      },
    ],
  },

  23: {
    quizAr: [
      {
        id: "q-pe-23-1",
        type: "mcq",
        question:
          "ما هي الطريقة الأكثر احترافية وربحية لبيع مهارات هندسة الأوامر للشركات كفريلانسر أو مستشار؟",
        options: [
          "بيع 'حلول أعمال متكاملة توفر الساعات وتزيد الأرباح' (مثل: أتمتة الردود على العملاء بدقة 95%) بدلاً من بيع مجرد ملف نصوص برومبتات",
          "بيع ملف Word يحتوي على 100 برومبت منسوخ من الإنترنت بسعر بخس",
          "إخبار العميل أنك ستستبدل كل موظفي شركته غداً بالذكاء الاصطناعي",
          "العمل مجاناً دون فرض أي مقابل للجهد والخبرة",
        ],
        correctIndex: 0,
        explanation:
          "أصحاب الأعمال والشركات يدفعون مقابل النتائج المالية وتوفير الوقت وحل المشكلات، ولا يدفعون لمجرد كلمات نصية عادية.",
      },
      {
        id: "q-pe-23-2",
        type: "tf",
        question:
          "تسعير خدمات هندسة الأوامر بناءً على القيمة والعائد المالي الذي يحققه العميل (Value-Based Pricing) يمنحك أرباحاً مضاعفة مقارنة بالحساب بالساعة.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! إذا وفرت لنظام العميل 50,000 دولار سنوياً، فإن طلب 5,000 دولار كأتعاب يعتبر صفقة ممتازة له ومربحة جداً لك.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-23-1",
        type: "mcq",
        question:
          "What is the most profitable and professional way to commercialize prompt engineering consulting for business clients?",
        options: [
          "Packaging measurable workflow outcomes (e.g. automating lead qualification with 95% accuracy) rather than selling raw text prompts",
          "Selling generic copy-pasted Word documents containing basic prompts for pennies",
          "Promising clients that AI will fire all human staff tomorrow",
          "Offering all engineering services for free indefinitely",
        ],
        correctIndex: 0,
        explanation:
          "Enterprise decision-makers buy risk reduction, operational hours saved, and top-line ROI, not raw prompt text.",
      },
      {
        id: "q-pe-23-2",
        type: "tf",
        question:
          "Value-based pricing tied to client operational cost savings yields significantly higher margins than charging commoditized hourly rates.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Capturing a percentage of created business value aligns incentives and maximizes professional fees.",
      },
    ],
  },

  24: {
    quizAr: [
      {
        id: "q-pe-24-1",
        type: "mcq",
        question:
          "في ملف إنجازك النهائي (Portfolio) كمهندس أوامر معتمد، ما هو المحتوى الذي يقنع أصحاب الأعمال والشركات بتوظيفك فوراً؟",
        options: [
          "دراسة حالة موثقة بالأرقام: المشكلة التجارية، البرومبت الأولي وفشله، البنية الهندسية للحل المطور، ومقارنة قبل وبعد توضح توفير الوقت ودقة النتائج",
          "لقطات شاشة لمحادثات ترفيهية مع روبوتات الدردشة",
          "شهادات ورقية عامة دون أي مشروع عملي مرفق",
          "ادعاء معرفة كل أسرار التكنولوجيا دون إظهار أي كود أو مخرجات",
        ],
        correctIndex: 0,
        explanation:
          "دراسات الحالة العملية المدعومة بالأرقام قبل وبعد تثبت قدرتك على تحويل الذكاء الاصطناعي إلى أداة إنتاجية مربحة للشركات.",
      },
      {
        id: "q-pe-24-2",
        type: "tf",
        question:
          "هندسة الأوامر ليست مجرد صيحة عابرة، بل هي لغة التفكير المنطقي والتعاون الدقيق بين الإنسان والأنظمة الذكية لعقود قادمة.",
        options: ["صح", "غلط"],
        correctIndex: 0,
        explanation:
          "صح! القدرة على صياغة المشكلات بدقة واستخراج أقصى طاقة من النماذج الذكية هي المهارة الأعلى طلباً وقيمة في الاقتصاد الرقمي الحديث.",
      },
    ],
    quizEn: [
      {
        id: "q-pe-24-1",
        type: "mcq",
        question:
          "What content in a prompt engineer's capstone portfolio provides definitive proof of mastery to prospective clients and employers?",
        options: [
          "Data-backed case studies detailing the business problem, failure of naive prompts, advanced prompt architecture, and quantified accuracy ROI",
          "Casual screenshots of joking with chat interfaces",
          "Theoretical certificates without any demonstrable code or artifacts",
          "Unverified claims of mastering all technology without deliverables",
        ],
        correctIndex: 0,
        explanation:
          "Quantified before-and-after case studies prove engineering competence and measurable business problem-solving ability.",
      },
      {
        id: "q-pe-24-2",
        type: "tf",
        question:
          "Prompt engineering is fundamentally the architecture of logical problem formulation and structured human-AI collaboration.",
        options: ["True", "False"],
        correctIndex: 0,
        explanation:
          "True! Precision direction of cognitive engines is the defining competitive superpower of the modern digital knowledge economy.",
      },
    ],
  },
};

// ============================================================================
// 2. PILLAR VOCABULARY & DOMAIN CONTEXT MATRIX FOR THE REMAINING 99 TRACKS
// ============================================================================
type PillarDomain = {
  keywordAr: string;
  keywordEn: string;
  coreToolAr: string;
  coreToolEn: string;
  beginnerTrapAr: string;
  beginnerTrapEn: string;
  bestPracticeAr: string;
  bestPracticeEn: string;
  metricAr: string;
  metricEn: string;
};

const PILLAR_DOMAINS: Record<number, PillarDomain> = {
  1: {
    // AI & Prompts
    keywordAr: "النماذج اللغوية وسياق التوليد",
    keywordEn: "LLMs, context tokens, and inference parameters",
    coreToolAr: "هندسة الأوامر ونوافذ السياق وحواجز الأمان",
    coreToolEn: "prompt architecture, context windows, and guardrails",
    beginnerTrapAr: "الاعتماد على أوامر عامة غامضة دون قيود أو أمثلة",
    beginnerTrapEn: "relying on vague zero-shot prompts with zero formatting constraints",
    bestPracticeAr: "تقييد المخرجات بنماذج محددة (Few-Shot) واختبار حالات الحافة",
    bestPracticeEn: "enforcing structured schema outputs with few-shot examples and eval suites",
    metricAr: "دقة المخرجات ونسبة انعدام الهلوسة واستقرار التنسيق",
    metricEn: "output precision, zero hallucination rate, and schema adherence",
  },
  2: {
    // Software & Web Dev
    keywordAr: "الكود النظيف وبناء الأنظمة وقواعد البيانات",
    keywordEn: "clean architecture, APIs, and robust codebases",
    coreToolAr: "أدوات التطوير الحديثة وإدارة الإصدارات بـ Git والـ APIs",
    coreToolEn: "modern developer toolchains, Git versioning, and modular APIs",
    beginnerTrapAr: "كتابة كود متكدس بدون اختبارات أو تقسيم معياري",
    beginnerTrapEn: "writing spaghetti code without automated tests or modular architecture",
    bestPracticeAr: "اتباع مبادئ Clean Code وبناء وحدات معزولة وسهلة الصيانة",
    bestPracticeEn: "following Clean Code principles and isolated modular test-driven units",
    metricAr: "سرعة الأداء وخلو الشيفرة من الثغرات وسهولة الصيانة",
    metricEn: "execution throughput, zero security defects, and maintainability index",
  },
  3: {
    // Data Analytics & BI
    keywordAr: "تحليل البيانات واستخراج الرؤى ومؤشرات الأداء",
    keywordEn: "data transformation, BI dashboards, and KPIs",
    coreToolAr: "معالجة البيانات ونماذج الـ SQL ولوحات الـ Dashboard التفاعلية",
    coreToolEn: "SQL data pipelines, analytics transforms, and dynamic BI dashboards",
    beginnerTrapAr: "بناء الرسوم البيانية قبل تنظيف البيانات والتحقق من صحتها",
    beginnerTrapEn: "visualizing raw charts before cleansing and validating data integrity",
    bestPracticeAr: "توحيد مصادر البيانات والتأكد من جودة المدخلات وسلامة المؤشرات",
    bestPracticeEn: "normalizing data sources and rigorously auditing statistical outliers",
    metricAr: "دقة المؤشرات وسرعة التحديث ووضوح القرار التجاري المبني عليها",
    metricEn: "metric accuracy, pipeline refresh latency, and decision clarity",
  },
  4: {
    // Freelancing & Micro-Agencies
    keywordAr: "العلاقة مع العملاء وتسعير الخدمات والعقود",
    keywordEn: "client acquisition, value pricing, and contract deliverables",
    coreToolAr: "نماذج تسعير القيمة والعقود المحمية وملفات الأعمال الاحترافية",
    coreToolEn: "value-based pricing proposals, ironclad contracts, and high-converting portfolios",
    beginnerTrapAr: "حساب السعر بالساعة والبدء بالعمل دون دفعة مقدمة أو عقد رسمي",
    beginnerTrapEn: "billing hourly without upfront deposits or signed scope boundaries",
    bestPracticeAr: "التسعير القائم على القيمة وربط الدفعات بمراحل تسليم موثقة",
    bestPracticeEn: "anchoring on value-based pricing and milestone-gated payment schedules",
    metricAr: "متوسط قيمة الصفقة وسرعة التحصيل ورضا العميل المستدام",
    metricEn: "average deal size, payment collection velocity, and client retention",
  },
  5: {
    // Digital Marketing & Growth
    keywordAr: "مسارات التحويل واكتساب العملاء والعائد الإعلاني",
    keywordEn: "conversion funnels, customer acquisition, and campaign ROAS",
    coreToolAr: "صفحات الهبوط المجهزة واختبارات A/B وأدوات التتبع التحليلي",
    coreToolEn: "high-converting landing pages, rigorous A/B splits, and attribution pixels",
    beginnerTrapAr: "إنفاق الميزانية على الإعلانات دون تحسين صفحة العرض والخطاف التسويقي",
    beginnerTrapEn: "scaling ad spend before validating offer hooks and funnel conversion",
    bestPracticeAr: "صياغة خطافات قوية (Hooks) واختبار الفرضيات التسويقية بالبيانات",
    bestPracticeEn: "deploying high-retention hooks and iterating on empirical conversion data",
    metricAr: "معدل التحويل (CR) وتكلفة الاستحواذ (CAC) والعائد على الإنفاق (ROAS)",
    metricEn: "Conversion Rate (CR), Customer Acquisition Cost (CAC), and Return on Ad Spend (ROAS)",
  },
  6: {
    // UI/UX & Creative Media
    keywordAr: "التصميم وتجربة المستخدم والتسلسل البصري",
    keywordEn: "visual hierarchy, design systems, and seamless UX",
    coreToolAr: "شبكات التصميم الموحدة وتباين الألوان وإمكانية الوصول (A11y)",
    coreToolEn: "design system tokens, color contrast, and accessibility standards",
    beginnerTrapAr: "تفضيل الزخرفة المعقدة على حساب سهولة الاستخدام وسرعة التصفح",
    beginnerTrapEn: "sacrificing clarity and intuitive navigation for excessive visual clutter",
    bestPracticeAr: "الالتزام بأنظمة التصميم (Design Systems) واختبار تدفق المستخدم",
    bestPracticeEn: "leveraging reusable design tokens and conducting empirical usability walkthroughs",
    metricAr: "سهولة التنقل ووضوح التسلسل البصري وسرعة إتمام المهمة",
    metricEn: "intuitive task completion velocity and visual clarity scoring",
  },
  7: {
    // Entrepreneurship & Startups
    keywordAr: "بناء المشاريع والتحقق من السوق ونمو الإيرادات",
    keywordEn: "business models, market validation, and revenue velocity",
    coreToolAr: "النموذج الأولي السريع (MVP) واختبارات الجاهزية ومقابلات العملاء",
    coreToolEn: "lean Minimum Viable Products, customer discovery loops, and unit economics",
    beginnerTrapAr: "بناء منتج ضخم ومكلف لشهور قبل التأكد من وجود عملاء مستعدين للدفع",
    beginnerTrapEn: "building complex features for months before securing a paying customer",
    bestPracticeAr: "إطلاق نموذج أولي مبكر والتحقق من رغبة الشراء الحقيقية بالدفع الفعلي",
    bestPracticeEn: "validating product-market fit through rapid pre-sales and lean MVPs",
    metricAr: "الوقت اللازم لأول إيراد حقيقي ومعدل تكرار الشراء والوحدة الاقتصادية",
    metricEn: "speed to first revenue, organic retention, and positive unit economics",
  },
  8: {
    // Cybersecurity & Privacy
    keywordAr: "الحماية الرقمية والتشفير وتفادي الاختراق",
    keywordEn: "threat mitigation, zero-trust security, and encryption",
    coreToolAr: "مبدأ أقل الصلاحيات والمصادقة متعددة العوامل وإدارة المفاتيح",
    coreToolEn: "principle of least privilege, multi-factor authentication, and key management",
    beginnerTrapAr: "الاعتماد على كلمات مرور مكررة أو تخزين أسرار البرمجة في كود مكشوف",
    beginnerTrapEn: "hardcoding production secrets or relying on perimeter-only security",
    bestPracticeAr: "تطبيق بنية عدم الثقة (Zero Trust) وتحديث الأنظمة والتشفير المستمر",
    bestPracticeEn: "enforcing Zero Trust architecture, secret rotation, and continuous auditing",
    metricAr: "انعدام الثغرات الحرجة وسرعة التصدي للحوادث وسلامة النسخ الاحتياطية",
    metricEn: "zero critical vulnerabilities, rapid mean time to detect, and encrypted backups",
  },
  9: {
    // Soft Skills & Leadership
    keywordAr: "التواصل الفعال وإدارة المفاوضات والقيادة",
    keywordEn: "executive communication, negotiations, and strategic influence",
    coreToolAr: "الاستماع النشط وهيكلة المحادثات الصعبة والتفاوض القائم على المصلحة",
    coreToolEn: "active listening frameworks, non-defensive feedback, and win-win negotiation",
    beginnerTrapAr: "التحدث أكثر من الاستماع والتعامل مع الاختلافات كانتقاد شخصي",
    beginnerTrapEn: "dominating conversations and interpreting feedback as personal confrontation",
    bestPracticeAr: "التركيز على الأهداف المشتركة والوضوح المباشر وطرح الأسئلة الذكية",
    bestPracticeEn: "anchoring on mutual outcomes, radical clarity, and empathetic inquiry",
    metricAr: "وضوح المخرجات وسرعة حسم القرارات وبناء الثقة طويلة الأمد",
    metricEn: "alignment velocity, trust index, and conflict de-escalation rate",
  },
  10: {
    // Productivity & Mindset
    keywordAr: "إدارة الطاقة والتركيز العميق والأنظمة الشخصية",
    keywordEn: "deep work blocks, habit architecture, and cognitive stamina",
    coreToolAr: "جلسات العمل العميق والأنظمة بدلاً من الأهداف وإدارة الطاقة اليومية",
    coreToolEn: "time-blocking deep work, habit triggers, and cognitive energy management",
    beginnerTrapAr: "الاعتماد على الحماس اللحظي ومحاولة إنجاز كل شيء دفعة واحدة دون نظام",
    beginnerTrapEn: "relying on sporadic willpower spikes instead of resilient environmental triggers",
    bestPracticeAr: "بناء عادات تراكمية يومية صغيرة وحماية أوقات التركيز من المشتتات",
    bestPracticeEn: "establishing small daily compounding routines and safeguarding focus blocks",
    metricAr: "الاستمرارية اليومية ومعدل إنجاز المهام الحرجة دون احتراق نفسي",
    metricEn: "daily execution consistency, high-leverage task completion, and zero burnout",
  },
};

// ============================================================================
// 3. SYNTHESIS QUIZ GENERATOR FOR ANY OF THE 100 TRACKS & ANY DAY
// ============================================================================
export function generateUniversalTrackQuiz(params: {
  track: Track100;
  day: number;
  totalLessons: number;
  outcomeAr: string;
  outcomeEn: string;
  titleAr: string;
  titleEn: string;
  lessonId: string;
}): { quizAr: QuizItem[]; quizEn: QuizItem[] } {
  const { track, day, totalLessons, outcomeAr, outcomeEn, lessonId } = params;

  // 1. If this is Prompt Engineering Mastery, return the custom 24-day curriculum!
  if (track.slug === "prompt-engineering-mastery" && PROMPT_ENGINEERING_CURRICULUM[day]) {
    return PROMPT_ENGINEERING_CURRICULUM[day];
  }

  // 2. Derive domain and day phase
  const pillar = PILLAR_DOMAINS[track.pillarId] || PILLAR_DOMAINS[1];
  const isFirstDay = day === 1;
  const isFinalDay = day === totalLessons;
  const isCheckpoint = day % 7 === 0 || isFinalDay;
  const phaseIndex = Math.min(3, Math.floor(((day - 1) / totalLessons) * 4)); // 0: Foundations, 1: Core Tech, 2: Real Projects, 3: Monetization

  // Deterministic seed based on track and day so correct index & variation rotate predictably
  const seed = (track.id * 37 + day * 19 + phaseIndex * 13) % 100;
  const mcqCorrectIndex = seed % 4; // Rotates among 0, 1, 2, 3!
  const tfCorrectIsPositive = seed % 2 === 0;
  // --------------------------------------------------------------------------
  // 28 UNIQUE DAY ARCHETYPES FOR UNIVERSAL TRACKS
  // --------------------------------------------------------------------------
  const dayKey = ((day - 1) % 28) + 1;

  let q1Ar = "";
  let q1En = "";
  let q1CorrectAr = "";
  let q1CorrectEn = "";
  let q1DistractorsAr: string[] = [];
  let q1DistractorsEn: string[] = [];
  let q1ExplanationAr = "";
  let q1ExplanationEn = "";

  let q2Ar = "";
  let q2En = "";
  let q2OptionsAr: string[] = [];
  let q2OptionsEn: string[] = [];
  let q2CorrectIndex = 0;
  let q2ExplanationAr = "";
  let q2ExplanationEn = "";

  switch (dayKey) {
    case 1:
      q1Ar = `ما هو الإجراء العملي الأهم لضمان انطلاقة ناجحة ومستدامة في مسار "${track.titleAr}" من اليوم الأول؟`;
      q1En = `What is the most crucial practical step to guarantee a successful start in "${track.titleEn}" from Day 1?`;
      q1CorrectAr = `تجهيز مساحة العمل وتحديد مخرجات واضحة وقابلة للقياس، مع الالتزام بتطبيق خطوة ملموسة يومياً`;
      q1CorrectEn = `Setting up your dedicated workspace, defining clear measurable deliverables, and committing to daily execution`;
      q1DistractorsAr = [
        `الانتظار حتى حفظ كل المصطلحات النظرية بنسبة 100% قبل فتح أي أداة تطبيقية`,
        `شراء البرامج والاشتراكات السنوية الأكثر تكلفة قبل تجربة الأدوات الأساسية`,
        `التخطيط لأسابيع كاملة دون تنفيذ أي تمرين تجريبي مباشر`,
      ];
      q1DistractorsEn = [
        `Waiting to memorize 100% of theoretical terminology before touching any hands-on tools`,
        `Purchasing the most expensive annual software tiers prior to testing foundational workflows`,
        `Spending weeks in abstract planning meetings without building a single prototype deliverable`,
      ];
      q1ExplanationAr = `البداية السريعة بخطوة عملية واضحة تبني الثقة والزخم العصبي، وتجنب الوقوع في فخ التسويف والتنظير غير المفيد.`;
      q1ExplanationEn = `Immediate practical execution generates momentum and muscle memory, breaking the barrier of theoretical procrastination.`;

      q2Ar = `عند بدء مسار ${track.titleAr}، ما هو المفهوم الخاطئ الأكثر انتشاراً بين المبتدئين الذي يجب عليك تجنبه فوراً؟`;
      q2En = `When embarking on ${track.titleEn}, what is the single most common beginner trap you must avoid immediately?`;
      q2OptionsAr = [
        `توقع احتراف المهارة بين ليلة وضحاها دون تدريب يومي تراكمي`,
        `البدء بمشروع صغير لتثبيت الأساسيات أولاً`,
        `تدوين الملاحظات وتوثيق الأخطاء للتعلم منها`,
        `سؤال مجتمع المتعلمين عند مواجهة صعوبة`,
      ];
      q2OptionsEn = [
        `Expecting overnight mastery without compounding daily practice`,
        `Starting with small micro-tasks to anchor foundational fundamentals`,
        `Documenting code snippets and runtime notes for future reference`,
        `Asking fellow practitioners when encountering roadblocks`,
      ];
      q2CorrectIndex = (seed + 1) % 4;
      q2ExplanationAr = `المهارة الحقيقية تُبنى بالتكرار اليومي البسيط وليس بضربة حظ سريعة؛ التدرج هو سر الاحتراف المستدام.`;
      q2ExplanationEn = `Enduring competence compounds through small daily iterations rather than overnight miracles.`;
      break;

    case 2:
      q1Ar = `عند تنفيذ أول خطوة عملية في "${outcomeAr}"، ما هو المبدأ الأساسي للوصول لنتيجة ملموسة دون تشتت؟`;
      q1En = `When taking your first practical step in "${outcomeEn}", what is the core principle for producing a tangible result without cognitive overwhelm?`;
      q1CorrectAr = `التركيز على إنجاز الحد الأدنى القابل للتطبيق (MVP)، والتحقق من صحة المخرج قبل إضافة أي تفاصيل إضافية`;
      q1CorrectEn = `Focusing on the smallest working Minimum Viable Deliverable and validating output before adding complexity`;
      q1DistractorsAr = [
        `محاولة تطبيق كافة الحالات المعقدة والنادرة في أول محاولة تدريبية`,
        `إعادة كتابة العمل عشرات المرات بحثاً عن كمال نظري قبل رؤية أي نتيجة`,
        `تجاهل متطلبات المدخلات والاعتماد على التخمين العشوائي`,
      ];
      q1DistractorsEn = [
        `Attempting to solve every rare edge case in your very first practice exercise`,
        `Rewriting the deliverable dozens of times seeking perfection before producing any visible output`,
        `Ignoring input parameters and guessing blindly without checking instructions`,
      ];
      q1ExplanationAr = `التركيز على مخرج بسيط ومكتمل بنسبة 100% يمنحك التغذية الراجعة السريعة ويثبت الفهم العملي للمهارة.`;
      q1ExplanationEn = `Completing a functional baseline provides instant visual feedback and solidifies foundational comprehension.`;

      q2Ar = `واجهت صعوبة في فهم أول تطبيق تقني أثناء ممارسة "${outcomeAr}". ما هو التصرف الاحترافي السليم؟`;
      q2En = `You encounter initial friction when executing your first task in "${outcomeEn}". What is the professional course of action?`;
      q2OptionsAr = [
        `الاستسلام والتراجع والظن بأن المجال غير مناسب لك`,
        `تفكيك الخطوة إلى أجزاء أصغر والرجوع لبطاقات الدرس لتطبيقها خطوة بخطوة`,
        `تخطي الخطوة بالكامل دون فهمها والقفز لدروس متقدمة`,
        `إلقاء اللوم على جهاز الحاسوب دون مراجعة الخطوات`,
      ];
      q2OptionsEn = [
        `Giving up immediately and assuming the domain is beyond your abilities`,
        `Decomposing the task into smaller sub-steps and referencing lesson cards step-by-step`,
        `Skipping the foundational concept entirely and jumping into advanced topics`,
        `Blaming hardware configurations without auditing operational steps`,
      ];
      q2CorrectIndex = 1;
      q2ExplanationAr = `الشعور بالمقاومة المعرفية في البداية أمر طبيعي ومؤشر على اكتساب مهارة جديدة؛ تفكيك المشكلة هو الحل الحاسم.`;
      q2ExplanationEn = `Initial friction indicates real neural skill acquisition; systematic task decomposition reliably restores momentum.`;
      break;

    case 3:
      q1Ar = `كيف تختصر الوقت وتضاعف سرعة إنجازك عند ممارسة "${outcomeAr}" في بيئة عمل حقيقية؟`;
      q1En = `How do you eliminate execution friction and accelerate your workflow when practicing "${outcomeEn}"?`;
      q1CorrectAr = `إعداد قوالب عمل مسبقة وتوثيق الأوامر المتكررة واستخدام اختصارات الأدوات الأساسية`;
      q1CorrectEn = `Creating reusable templates, bookmarking proven prompts/snippets, and utilizing core tool hotkeys`;
      q1DistractorsAr = [
        `التسرع وحذف خطوات التحقق والمراجعة للتسليم في وقت أسرع`,
        `العمل دون فترات راحة حتى استنزاف طاقتك الذهنية بالكامل`,
        `الاعتماد على حفظ كل شيء في الذاكرة الذهنية دون تدوين أي قوالب`,
      ];
      q1DistractorsEn = [
        `Rushing carelessly and omitting verification gates to finish marginally faster`,
        `Working without breaks until cognitive exhaustion diminishes judgment quality`,
        `Relying on mental memory alone without maintaining a repository of snippets`,
      ];
      q1ExplanationAr = `المحترفون لا يكررون كتابة نفس الأشياء من الصفر؛ استخدام القوالب والأصول الجاهزة يوفر ساعات العمل الشاقة.`;
      q1ExplanationEn = `Top practitioners leverage reusable components and systematized templates to deliver high leverage without burnout.`;

      q2Ar = `الاستمرار في التعلم والتطبيق لمدة 10 إلى 15 دقيقة يومياً يبني مهارة احترافية مستدامة أكثر من جلسات التعلم المتباعدة والمكثفة في ${track.titleAr}.`;
      q2En = `Consistent daily micro-practice of 10 to 15 minutes builds far stronger procedural expertise than sporadic, exhausting marathons in ${track.titleEn}.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! الأثر التراكمي للتكرار المتباعد يرسخ الذاكرة الإجرائية ويزيل مقاومة البدء، مما يصنع تفوقاً مستداماً.`;
      q2ExplanationEn = `True! Spaced daily repetition solidifies procedural memory and eliminates cognitive friction, fueling compounding returns.`;
      break;

    case 4:
      q1Ar = `ما هو المعيار الأكثر موثوقية لفحص وتقييم جودة مخرجاتك في "${outcomeAr}" والتأكد من مطابقتها للمعايير؟`;
      q1En = `What is the most objective benchmark to audit the quality of your output in "${outcomeEn}" against professional standards?`;
      q1CorrectAr = `مقارنة المخرجات بقائمة معايير الجودة (Checklist) واختبار أدائها مع حالات حقيقية متنوعة`;
      q1CorrectEn = `Auditing outputs against an objective quality checklist and stress-testing functionality against diverse real-world inputs`;
      q1DistractorsAr = [
        `الاكتفاء بنظرة عابرة سريعة والافتراض أن كل شيء على ما يرام طالما لم يظهر تنبيه أحمر`,
        `سؤال الأصدقاء غير المتخصصين عن انطباعهم العام دون معايير واضحة`,
        `الاعتماد فقط على الشعور الداخلي بالرضا دون أي قياس ملموس للأرقام والنتائج`,
      ];
      q1DistractorsEn = [
        `Settling for a cursory glance and assuming success as long as no fatal error popped up`,
        `Asking non-technical friends for casual aesthetic opinions with zero testing rubrics`,
        `Relying entirely on subjective gut feel without empirical verification of metrics`,
      ];
      q1ExplanationAr = `قوائم التدقيق المعيارية تحميك من الأخطاء الساذجة وتضمن أن كل مخرج يسلم للعميل يفي بأعلى درجات الموثوقية.`;
      q1ExplanationEn = `Structured audit checklists prevent human oversight and guarantee that deliverables satisfy rigorous industry baselines.`;

      q2Ar = `أظهر الفحص الأولي لمشروعك وجود تفاوت في دقة المخرجات لـ "${outcomeAr}". ما هو الإجراء التشخيصي الأول؟`;
      q2En = `An initial audit reveals inconsistency in output fidelity for "${outcomeEn}". What is your immediate diagnostic step?`;
      q2OptionsAr = [
        `إعادة تشغيل المشروع 10 مرات متتالية دون تغيير أي شيء وتمني أن تختفي المشكلة`,
        `عزل المتغيرات ومراجعة جودة البيانات والتعليمات المدخلة ومقارنتها بالحالات الناجحة`,
        `حذف مجلد المشروع بأكمله والبدء من جديد من الصفر`,
        `إخفاء نتائج الفحص عن العميل وادعاء أن النظام يعمل بكفاءة تامة`,
      ];
      q2OptionsEn = [
        `Re-running the workflow ten times without modifications and hoping the discrepancy vanishes`,
        `Isolating variables, auditing input data/instructions, and benchmarking against known successful runs`,
        `Deleting the entire workspace directory and restarting from scratch`,
        `Concealing discrepancies from the client and claiming flawless execution`,
      ];
      q2CorrectIndex = 1;
      q2ExplanationAr = `التشخيص المنهجي بعزل المتغيرات يكشف السبب الحقيقي للتفاوت ويمنحك القدرة على ضبطه بثقة واستقرار.`;
      q2ExplanationEn = `Systematic variable isolation reveals the root cause of variance, empowering you to enforce deterministic stability.`;
      break;

    case 5:
      q1Ar = `عند دمج أدوات وتقنيات "${outcomeAr}" ضمن مسار عمل متكامل (Pipeline)، ما هو العامل الحاسم لمنع التعارض؟`;
      q1En = `When connecting methods and tools for "${outcomeEn}" into a cohesive pipeline, what is the critical factor to prevent system friction?`;
      q1CorrectAr = `توحيد صيغ البيانات المتبادلة بين الأدوات وتحديد مسؤولية كل مرحلة بوضوح ودقة`;
      q1CorrectEn = `Standardizing shared data interchange formats and defining clear boundaries for each stage`;
      q1DistractorsAr = [
        `استخدام 15 أداة مختلفة للمهمة الواحدة دون أي ترابط منظم بينها`,
        `تجاهل توثيق مسار تدفق البيانات والاعتماد على التحويل اليدوي العشوائي`,
        `تحديث جميع الأدوات تلقائياً في بيئة الإنتاج دون اختبار التوافق المسبق`,
      ];
      q1DistractorsEn = [
        `Stacking 15 disconnected software tools for a single job with zero coherent architecture`,
        `Omitting data flow documentation and relying on error-prone manual copy-pasting`,
        `Auto-updating all production software without testing backwards compatibility in staging`,
      ];
      q1ExplanationAr = `الأنظمة المتماسكة تعتمد على وضوح المدخلات والمخرجات بين المراحل؛ التوحيد القياسي يمنع هدر الوقت في التوافقية.`;
      q1ExplanationEn = `Resilient pipelines rely on standardized data interfaces between stages, eliminating conversion friction.`;

      q2Ar = `هل يكفي الاعتماد على أداة واحدة معزولة دون ربطها بباقي منظومة العمل في ${track.titleAr} لتحقيق أقصى إنتاجية؟`;
      q2En = `Is relying on a single isolated tool without integrating it into the broader workflow of ${track.titleEn} sufficient for peak productivity?`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 1;
      q2ExplanationAr = `غلط! القوة الحقيقية في سوق العمل تكمن في القدرة على ربط الأدوات المختلفة في منظومة متكاملة تنجز المهام بسلاسة وسرعة.`;
      q2ExplanationEn = `False! True market leverage comes from orchestrating multiple specialized tools into an integrated pipeline.`;
      break;

    case 6:
      q1Ar = `كيف تجهز وتغلف مخرجات "${outcomeAr}" لتقديمها للعميل أو الفريق بأسلوب مهني مقنع؟`;
      q1En = `How do you package and document your deliverables in "${outcomeEn}" for clients or team members to maximize credibility?`;
      q1CorrectAr = `تقديم تقرير موجز يلخص القيمة المحققة، مع إرفاق دليل تشغيل واضح وأرقام تثبت النتائج`;
      q1CorrectEn = `Delivering an executive summary of created value, accompanied by operational documentation and measurable metrics`;
      q1DistractorsAr = [
        `إرسال ملفات خام مبعثرة دون أي شرح أو دليل يوضح كيفية استخدامها`,
        `كتابة بريد إلكتروني من 20 صفحة مليء بالمصطلحات المعقدة دون ذكر الفائدة للعميل`,
        `الطلب من العميل أن يكتشف بنفسه أين توجد النتائج وماذا تعني`,
      ];
      q1DistractorsEn = [
        `Sending unstructured raw files without instructions or documentation on how to use them`,
        `Writing an unreadable 20-page email stuffed with jargon while ignoring actual client benefits`,
        `Asking the stakeholder to figure out what the deliverables mean without guidance`,
      ];
      q1ExplanationAr = `التغليف الاحترافي للمخرجات هو ما يحول العمل التقني الجيد إلى قيمة تجارية يشعر بها العميل ويدفع مقابلها بسخاء.`;
      q1ExplanationEn = `Professional packaging bridges technical execution and commercial perception, validating client investment.`;

      q2Ar = `أبدى أحد الزملاء أو العملاء تشككاً في جدوى مخرجات "${outcomeAr}". كيف توضح القيمة المضافة باحترافية؟`;
      q2En = `A stakeholder expresses skepticism regarding the ROI of "${outcomeEn}". How do you articulate business value objectively?`;
      q2OptionsAr = [
        `الانفعال والدخول في جدال شخصي حول من هو الأكثر علماً بالتكنولوجيا`,
        `عرض مقارنة عملية قبل وبعد (Before & After) توضح بالأرقام الوقت الموفر والدقة المحققة`,
        `التراجع فوراً والاعتذار عن تنفيذ المهمة حتى لو كانت سليمة تماماً`,
        `تجاهل العميل تماماً وعدم الرد على استفساراته`,
      ];
      q2OptionsEn = [
        `Reacting defensively and arguing over who has greater technical credentials`,
        `Presenting an empirical Before & After case study proving hours saved and accuracy gains`,
        `Capitulating immediately and apologizing even when the deliverable is technically sound`,
        `Ignoring the stakeholder's concerns and refusing to communicate`,
      ];
      q2CorrectIndex = 1;
      q2ExplanationAr = `الأرقام والمقارنات العملية تحسم أي جدال؛ توضيح العائد بالأرقام يبني الثقة المهنية الراسخة.`;
      q2ExplanationEn = `Quantified before-and-after evidence resolves skepticism and establishes unshakeable professional credibility.`;
      break;

    case 7:
      q1Ar = `في محطة المراجعة الأولى، ما هو الأسلوب الهندسي لعزل المشكلات التقنية وتشخيص الأخطاء في "${outcomeAr}"؟`;
      q1En = `At this milestone review, what structured debugging methodology isolates root causes in "${outcomeEn}"?`;
      q1CorrectAr = `إعادة بناء المشكلة في بيئة معزولة وفحص السجلات ومقارنة المخرجات بالمعايير المعتمدة`;
      q1CorrectEn = `Reproducing the issue in an isolated environment, inspecting logs, and benchmarking against established ground-truth`;
      q1DistractorsAr = [
        `تغيير كافة الإعدادات والملفات عشوائياً وتمني أن يعمل النظام بالصدفة`,
        `تجاهل الأخطاء طالما أنها لا توقف النظام فوراً`,
        `افتراض أن العطل دائم ولا يمكن حله دون شراء أداة جديدة`,
      ];
      q1DistractorsEn = [
        `Mutating dozens of configurations simultaneously hoping luck fixes the issue`,
        `Ignoring warning logs as long as the system has not crashed entirely`,
        `Assuming defects cannot be resolved without purchasing expensive replacement software`,
      ];
      q1ExplanationAr = `المراجعة الدورية وتشخيص الأخطاء خطوة بخطوة هي الركيزة التي تمنع تراكم الديون التقنية والمشاكل الخفية.`;
      q1ExplanationEn = `Systematic root-cause analysis at checkpoints prevents technical debt and compound failures down the road.`;

      q2Ar = `حقيقة مهنية: "${track.realityAr}" — كيف يحميك هذا الوعي الواقعي من الإحباط والتوقعات الزائفة؟`;
      q2En = `Reality check: "${track.realityEn}" — How does internalizing this professional truth protect you from disillusionment?`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً. الوعي بطبيعة التحديات الواقعية يمنحك مناعة نفسية وتركيزاً على التطور التراكمي المستمر.`;
      q2ExplanationEn = `Absolutely true! Grounded realism preserves cognitive stamina and anchors your focus on compounding daily gains.`;
      break;

    case 8:
      q1Ar = `عند الانتقال للمستوى المتقدم في "${outcomeAr}"، كيف تضبط الإعدادات والمعاملات الدقيقة للوصول لأقصى كفاءة؟`;
      q1En = `When advancing to sophisticated workflows in "${outcomeEn}", how do you fine-tune core parameters for maximum leverage?`;
      q1CorrectAr = `تعديل معامل واحد في كل تجربة، وقياس أثره على مصفوفة الدقة قبل الانتقال لتعديل المعامل التالي`;
      q1CorrectEn = `Tuning one parameter per experiment run and measuring delta against an evaluation rubric before proceeding`;
      q1DistractorsAr = [
        `تغيير كافة الإعدادات دفعة واحدة بأقصى قيم متاحة دون اختبار مسبق`,
        `استخدام الإعدادات الافتراضية دائماً والظن بأن الشركات لا تعدلها أبداً`,
        `الاعتماد على نصائح غير مجربة من مصادر مجهولة دون التحقق من التوثيق`,
      ];
      q1DistractorsEn = [
        `Dialing all parameters to maximum settings simultaneously without controlled tests`,
        `Leaving factory defaults everywhere under the false assumption that defaults are always optimal`,
        `Adopting anecdotal advice from untrusted sources without auditing documentation`,
      ];
      q1ExplanationAr = `الضبط الدقيق يتطلب عزل التجارب (Controlled Experiments) لمعرفة التأثير الفعلي لكل تعديل بدقة علمية.`;
      q1ExplanationEn = `Rigorous optimization requires controlled variable testing to identify exact sensitivity factors.`;

      q2Ar = `تعديل عدة متغيرات تقنية في نفس اللحظة أثناء معالجة "${outcomeAr}" يمنعك من تحديد أي إعداد أصلح الخلل وأيها أفسده.`;
      q2En = `Tuning multiple configuration variables simultaneously while debugging "${outcomeEn}" makes it impossible to isolate cause and effect.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! المنهج العلمي يفرض تغيير متغير واحد في كل مرة لضمان وضوح الأسباب والنتائج.`;
      q2ExplanationEn = `True! Scientific debugging demands changing one variable at a time to maintain causality tracking.`;
      break;

    case 9:
      q1Ar = `ما هي الاستراتيجية المثالية لأتمتة المهام المتكررة المتعلقة بـ "${outcomeAr}" دون المساس بجودة المخرجات؟`;
      q1En = `What is the optimal strategy for automating recurring friction in "${outcomeEn}" without sacrificing quality?`;
      q1CorrectAr = `أتمتة الخطوات المحددة مسبقاً ذات النتائج المتوقعة، مع إبقاء نقاط مراجعة وتدقيق بشري للحالات الحساسة`;
      q1CorrectEn = `Automating predictable, deterministic steps while preserving human-in-the-loop review gates for high-stakes deliverables`;
      q1DistractorsAr = [
        `أتمتة كل شيء بشكل أعمى وإلغاء أي رقابة بشرية تماماً حتى لو حدثت أخطاء فادحة`,
        `رفض الأتمتة بالكامل وتنفيذ كل خطوة يدوياً حتى لو استغرقت عشر ساعات يومياً`,
        `الاعتماد على سكربتات غير مستقرة تتوقف عند أول مدخل غير مألوف دون إشعار`,
      ];
      q1DistractorsEn = [
        `Blindly automating everything with zero telemetry or human oversight regardless of catastrophic defects`,
        `Rejecting all automation and laboring through manual repetitive tasks for ten hours every day`,
        `Relying on brittle scripts that crash silently on unexpected input types without alerts`,
      ];
      q1ExplanationAr = `الأتمتة الذكية تجمع بين سرعة التنفيذ الآلي ويقظة الرقابة البشرية (Human-in-the-Loop) للحفاظ على معايير الجودة.`;
      q1ExplanationEn = `Smart automation pairs deterministic machine throughput with strategic human-in-the-loop governance.`;

      q2Ar = `عند بناء أتمتة لـ "${outcomeAr}"، ما هو صمام الأمان الإلزامي لمنع حدوث أخطاء تراكمية صامتة؟`;
      q2En = `When deploying automated workflows for "${outcomeEn}", what mandatory guardrail prevents silent error cascading?`;
      q2OptionsAr = [
        `إيقاف الإشعارات تماماً لتفادي الإزعاج`,
        `تضمين اختبارات تحقق وتنبيهات فورية عند تجاوز الحدود المقبولة للخطأ`,
        `حذف سجلات الأخطاء أوتوماتيكياً كل دقيقة`,
        `الاعتماد على حسن النية بأن الكود لن يتعطل أبداً`,
      ];
      q2OptionsEn = [
        `Disabling all notification channels to avoid noise`,
        `Implementing validation assertions and automated alerts whenever error thresholds trip`,
        `Automatically deleting log files every sixty seconds`,
        `Trusting blindly that automation scripts never experience edge-case failure`,
      ];
      q2CorrectIndex = 1;
      q2ExplanationAr = `نظم التنبيه والرصد الآلي (Monitoring & Alerts) هي العين الساهرة التي تكتشف المشاكل قبل أن تصل للعملاء.`;
      q2ExplanationEn = `Automated alerting thresholds catch system regressions before they propagate to production stakeholders.`;
      break;

    case 10:
      q1Ar = `ما هو الفخ الأكثر خطورة (Beginner Trap) الذي يقع فيه الممارسون أثناء تطبيق "${outcomeAr}" وكيف تتفاداه؟`;
      q1En = `What is the most dangerous beginner trap in "${outcomeEn}", and how do elite practitioners neutralize it?`;
      q1CorrectAr = `الوقوع في فخ ${pillar.beginnerTrapAr}؛ ويتم تجنبه بتطبيق ${pillar.bestPracticeAr}`;
      q1CorrectEn = `Falling into ${pillar.beginnerTrapEn}; neutralized by enforcing ${pillar.bestPracticeEn}`;
      q1DistractorsAr = [
        `التركيز المفرط على كتابة الكود النظيف والملاحظات الموثقة`,
        `الالتزام بمعايير الأمان وقواعد البيانات وتفادي الاختراق`,
        `اختبار العمل في بيئة تجريبية قبل النشر المباشر للجمهور`,
      ];
      q1DistractorsEn = [
        `Over-emphasizing clean documentation and test coverage`,
        `Rigorously adhering to security protocols and data integrity policies`,
        `Testing code in staging sandboxes prior to live deployment`,
      ];
      q1ExplanationAr = `معرفة الفخاخ الشائعة في مجالك يوفر عليك أشهراً من المحاولات الفاشلة ويوجه طاقتك للممارسات المثبتة علمياً.`;
      q1ExplanationEn = `Recognizing domain pitfalls prevents months of wasted cycles and channels effort toward proven industry practices.`;

      q2Ar = `هل يمكن الوصول لنتائج احترافية في ${track.titleAr} بالاعتماد فقط على نسخ القوالب الجاهزة دون فهم منطقها الداخلي؟`;
      q2En = `Can you build enduring authority in ${track.titleEn} solely by copying pre-made templates without internalizing core mechanics?`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 1;
      q2ExplanationAr = `غلط! النسخ السطحي يجعلك عاجزاً عند أول مشكلة حقيقية؛ الفهم الهيكلي هو الذي يمنحك المرونة والقدرة على الابتكار.`;
      q2ExplanationEn = `False! Blind copying crumbles at the first edge case. Deep structural comprehension creates true professional agility.`;
      break;

    case 11:
      q1Ar = `عندما يتضاعف حجم العمل أو البيانات في "${outcomeAr}" عشر مرات، ما هي الركيزة الأساسية للحفاظ على استقرار الأداء؟`;
      q1En = `When scaling the throughput or complexity of "${outcomeEn}" by 10x, what is the architectural foundation that preserves stability?`;
      q1CorrectAr = `تصميم بنية معيارية قابلة للتوسع وتوزيع المهام واستخدام التخزين المؤقت وحواجز الأمان`;
      q1CorrectEn = `Designing modular scalable architectures, batching workloads, leveraging caching, and enforcing concurrency limits`;
      q1DistractorsAr = [
        `الاستمرار في نفس الحلول المؤقتة للنماذج الأولية وتكديس البيانات في ملف واحد`,
        `تجاهل مؤشرات استهلاك الذاكرة وسرعة المعالجة حتى ينهار النظام`,
        `إلغاء قيود الأمان لزيادة سرعة معالجة البيانات بأي ثمن`,
      ];
      q1DistractorsEn = [
        `Persisting with fragile prototype workarounds and stuffing all records into a single monolithic file`,
        `Ignoring memory consumption metrics until the host server crashes completely`,
        `Disabling security controls to squeeze micro-seconds of processing speed at all costs`,
      ];
      q1ExplanationAr = `قابلية التوسع (Scalability) تتطلب تفكيراً معمارياً يمنع نقاط الانهيار المفردة (Single Points of Failure) ويحافظ على سرعة الاستجابة.`;
      q1ExplanationEn = `Architectural scalability eliminates single points of failure and maintains high throughput under peak load.`;

      q2Ar = `مواجهة مشروع ضخم ومعقد في ${track.titleAr} تتطلب تفكيكه إلى مهام مصغرة معزولة ومستقلة قابلة للاختبار.`;
      q2En = `Tackling massive complexity in ${track.titleEn} demands modular decomposition into testable, decoupled components.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! تفكيك التعقيد إلى وحدات مصغرة (Modular Design) هو جوهر الهندسة الناجحة للمشاريع الكبرى.`;
      q2ExplanationEn = `True! Modular breakdown isolates cognitive and architectural complexity into manageable, robust milestones.`;
      break;

    case 12:
      q1Ar = `ما هي اللمسات النهائية ومعايير التدقيق المهني التي ترفع عملك في "${outcomeAr}" إلى المعايير المؤسسية؟`;
      q1En = `What production audit checklist elevates your project deliverable in "${outcomeEn}" to enterprise-grade compliance?`;
      q1CorrectAr = `التدقيق الشامل لتوافق المعايير والأمان والأداء، والتأكد من وضوح التوثيق وسهولة الصيانة`;
      q1CorrectEn = `End-to-end audits of compliance, security, and performance, paired with clear maintainability documentation`;
      q1DistractorsAr = [
        `تسليم العمل بمجرد أن يعمل على جهازك الشخصي دون تجربة على أجهزة أو بيئات أخرى`,
        `حذف كل الملاحظات البرمجية والتوثيق حتى لا يفهم أحد كيف بنيت المشروع`,
        `إضافة زخارف ورسوم متحركة عشوائية لتشتيت الانتباه عن الأخطاء الوظيفية`,
      ];
      q1DistractorsEn = [
        `Shipping deliverables the moment they compile on localhost without testing in target staging environments`,
        `Scrubbing all code comments so no future maintainer can understand architecture`,
        `Adding flashy animations to distract stakeholders from unhandled runtime defects`,
      ];
      q1ExplanationAr = `اللمسات المهنية الأخيرة والتوثيق المكتمل هما ما يميز المحترف الموثوق عن الهواة في عيون الشركات الكبرى.`;
      q1ExplanationEn = `Rigorous finishing touches and pristine documentation distinguish enterprise professionals from amateur hobbyists.`;

      q2Ar = `التدقيق المزدوج واختبار مخرجات "${outcomeAr}" في بيئة تجريبية قبل النشر المباشر يحميك من الأخطاء الكارثية.`;
      q2En = `Pre-flight validation of "${outcomeEn}" in a staging sandbox prior to live release prevents costly failures.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! البيئة التجريبية (Staging Environment) هي حائط الصد الذي يحمي سمعة عملك وثقة عملائك.`;
      q2ExplanationEn = `True! A staging sandbox provides a protective buffer that defends production data and professional reputation.`;
      break;

    case 13:
      q1Ar = `قبل البدء في بناء المشروع العملي الكامل، ما هو المخطط الهيكلي الأكثر أهمية لتحديد نطاق عمل "${outcomeAr}"؟`;
      q1En = `Prior to engineering your full project, what blueprint document best defines the operational scope of "${outcomeEn}"?`;
      q1CorrectAr = `وثيقة المتطلبات والمخطط المعماري (Architecture Blueprint) التي توضح مسار التدفق والمخرجات المحددة`;
      q1CorrectEn = `A technical architecture blueprint and scope specification detailing data flow and expected deliverables`;
      q1DistractorsAr = [
        `ورقة ملاحظات عشوائية تحتوي على أفكار غير مترابطة دون أي تحديد للوقت أو التكلفة`,
        `عقد شفهي غير مسجل يترك كل التفاصيل مفتوحة للتخمين والتأويل`,
        `الافتراض بأن المشروع سيبني نفسه تلقائياً دون الحاجة لأي تخطيط مسبق`,
      ];
      q1DistractorsEn = [
        `A disorganized napkin scratchpad with unlinked ideas and zero timeline or budgetary boundaries`,
        `An informal verbal agreement leaving technical parameters open to arbitrary interpretation`,
        `Assuming the application will architect itself autonomously without deliberate design`,
      ];
      q1ExplanationAr = `المخطط الهيكلي المسبق يوفر ما يصل إلى 50% من الوقت المستهلك في إعادة العمل ويمنع الانحراف عن الأهداف الرئيسية.`;
      q1ExplanationEn = `A deliberate architecture specification prevents scope drift and eliminates up to 50% of wasted re-work hours.`;

      q2Ar = `البدء الفوري في التنفيذ دون مخطط هيكلي واضح يؤدي حتماً إلى إهدار ساعات طويلة في إعادة العمل والتعديلات العشوائية.`;
      q2En = `Rushing into execution without a structured blueprint invariably wastes hours on re-work and unstructured firefighting.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! التخطيط المنهجي هو أسرع طريق للتنفيذ الناجح، بينما التسرع العشوائي هو أسرع طريق للإحباط.`;
      q2ExplanationEn = `True! Methodical blueprinting is the fastest pathway to successful execution, while blind haste breeds friction.`;
      break;

    case 14:
      q1Ar = `في محطة المراجعة النصفية، كيف تختبر مدى تكامل أجزاء المشروع المختلفة المبنية على "${outcomeAr}"؟`;
      q1En = `At this mid-course integration checkpoint, how do you validate end-to-end synergy across components in "${outcomeEn}"?`;
      q1CorrectAr = `إجراء اختبار شامل لنهاية المسار (End-to-End Test) يحاكي رحلة المستخدم الحقيقية بدقة`;
      q1CorrectEn = `Executing comprehensive End-to-End simulation tests mirroring authentic user journeys from start to finish`;
      q1DistractorsAr = [
        `اختبار كل جزء بمفرده وافتراض أنهما سيعملان معاً حتماً دون تجربة الدمج`,
        `تجاهل المدخلات الخاطئة والافتراض أن المستخدم سيدخل دائماً بيانات مثالية`,
        `الاكتفاء بنجاح الاختبار لمرة واحدة في بيئة محلية دون رصد النتائج`,
      ];
      q1DistractorsEn = [
        `Testing components in isolation and blindly assuming they will integrate flawlessly without pipeline runs`,
        `Ignoring invalid inputs under the naive assumption that end users enter pristine data`,
        `Considering a single local pass sufficient without documenting test outcomes or benchmarks`,
      ];
      q1ExplanationAr = `اختبارات التكامل الشاملة تكشف الاحتكاكات الصامتة بين المكونات وتضمن تجربة مستخدم خالية من العثرات.`;
      q1ExplanationEn = `End-to-end integration testing exposes boundary incompatibilities, ensuring frictionless user journeys.`;

      q2Ar = `واجهت تعارضاً تقنياً معقداً بين أداتين أساسيتين في مشروع "${outcomeAr}". ما هي الخطوة الأكثر فاعلية لحل المعضلة؟`;
      q2En = `You encounter an integration deadlock between two primary toolchains in "${outcomeEn}". What is the most effective troubleshooting step?`;
      q2OptionsAr = [
        `عزل نقطة التقاء الأداتين وفحص تنسيق البيانات المتبادلة بينهما بدقة لتحديد مكمن الاختلاف`,
        `حذف إحدى الأداتين والتخلي عن نصف وظائف المشروع المطلوبة للعميل`,
        `تجاهل التعارض وترك البرنامج يتوقف فجأة أمام العميل`,
        `إلقاء اللوم على مزود السيرفر وكتابة شكوى هجومية للدعم الفني`,
      ];
      q2OptionsEn = [
        `Isolating the interface boundary and inspecting payload schemas to pinpoint payload incompatibilities`,
        `Deleting one of the tools and abandoning half the promised client deliverable`,
        `Ignoring the crash and letting the application fail visibly in production`,
        `Blaming infrastructure hosting providers and filing angry support tickets without investigating`,
      ];
      q2CorrectIndex = 0;
      q2ExplanationAr = `التعارضات التقنية تكمن في الغالب في عدم تطابق تنسيق البيانات عند نقطة الوصل؛ فحص المدخلات والمخرجات يحل المشكلة سريعاً.`;
      q2ExplanationEn = `Interface friction almost always stems from schema mismatch at connection boundaries; verifying contracts resolves issues swiftly.`;
      break;

    case 15:
      q1Ar = `ما هي الإجراءات الاحترازية الأساسية لحماية البيانات وسرية العمل عند التعامل مع "${outcomeAr}"؟`;
      q1En = `What baseline security protocols protect data confidentiality and integrity when operationalizing "${outcomeEn}"?`;
      q1CorrectAr = `تطبيق مبدأ أقل الصلاحيات (Least Privilege) وتشفير البيانات الحساسة واستخدام متغيرات البيئة السرية`;
      q1CorrectEn = `Enforcing principle of least privilege, encrypting sensitive payloads, and managing keys via environment variables`;
      q1DistractorsAr = [
        `حفظ كلمات المرور والمفاتيح السرية داخل الكود البرمجي المفتوح أو في ملفات قابلة للتحميل`,
        `منح جميع الحسابات صلاحيات المدير الكامل (Admin) لتسهيل العمل دون قيود`,
        `تعطيل أنظمة التشفير لتوفير بعض المعالجة على الخادم`,
      ];
      q1DistractorsEn = [
        `Hardcoding API keys and database credentials into public source code repositories`,
        `Granting root admin privileges to all service workers to avoid setting granular roles`,
        `Disabling encryption protocols to minimize CPU processing cycles`,
      ];
      q1ExplanationAr = `الأمان السيبراني ليس رفاهية؛ حماية بيانات العمcredentials يقي من خسائر فادحة وعواقب قانونية مدمرة.`;
      q1ExplanationEn = `Rigorous secret management and encryption protocols protect organizations from devastating security liabilities.`;

      q2Ar = `مشاركة البيانات الحساسة أو المفاتيح السرية في ملفات مفتوحة أثناء تنفيذ "${outcomeAr}" يمثل خرقاً أمنياً خطيراً يهدد المشروع.`;
      q2En = `Exposing sensitive credentials or unencrypted data payloads during "${outcomeEn}" tasks creates catastrophic security vulnerabilities.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! الأمان الرقمي وحفظ الأسرار هو الخط الفاصل بين المشاريع المسؤولة والتجارب الهشة.`;
      q2ExplanationEn = `True! Sound secret isolation and zero-trust configuration distinguish professional software systems from fragile experiments.`;
      break;

    case 16:
      q1Ar = `كيف تبني مناعة تقنية داخل نظامك تجعله يتعامل بسلاسة مع حالات الحافة الشاذة (Edge Cases) في "${outcomeAr}"؟`;
      q1En = `How do you architect system resilience against obscure edge cases and malformed inputs in "${outcomeEn}"?`;
      q1CorrectAr = `إضافة التحقق الصارم من صحة المدخلات وتوفير مسارات بديلة ومعالجة استباقية لكافة سيناريوهات الخطأ`;
      q1CorrectEn = `Implementing rigorous input sanitation, graceful degradation fallbacks, and comprehensive error handling blocks`;
      q1DistractorsAr = [
        `الافتراض أن المستخدمين لن يدخلوا أبداً بيانات غير متوقعة أو مدخلات غير صحيحة`,
        `كتم رسائل الخطأ بالكامل حتى لا يلاحظ أحد حدوث أي عطل`,
        `إيقاف تشغيل الخادم بالكامل عند مصادفة أول إدخال غير مألوف`,
      ];
      q1DistractorsEn = [
        `Assuming end users will strictly adhere to anticipated happy-path workflows at all times`,
        `Suppressing all error logs silently so defects remain hidden from telemetry`,
        `Crashing the entire runtime instance when encountering unexpected payload formats`,
      ];
      q1ExplanationAr = `النظام القوي هو الذي يصمد أمام المدخلات المشوهة والظروف الاستثنائية دون أن يفقد اتزانه أو يسرب بيانات.`;
      q1ExplanationEn = `Resilient architectures gracefully catch malformed payloads without crashing runtime processes.`;

      q2Ar = `الأنظمة الاحترافية تصمم بحيث تفشل بنعومة (Graceful Degradation) وتوفر مسارات بديلة بدلاً من الانهيار التام.`;
      q2En = `Robust production architectures incorporate graceful degradation patterns and clear telemetry instead of catastrophic crashes.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! الانهيار الناعم يضمن استمرار الخدمات الأساسية ويعطي المستخدم توجيهاً واضحاً دون ذعر.`;
      q2ExplanationEn = `True! Graceful fallbacks maintain core system availability and communicate actionable context to users.`;
      break;

    case 17:
      q1Ar = `ما هي أسرع وسيلة للحصول على تغذية راجعة موضوعية (Feedback) لتطوير تطبيقك لـ "${outcomeAr}"؟`;
      q1En = `What is the highest-signal mechanism to solicit actionable feedback on your implementation of "${outcomeEn}"?`;
      q1CorrectAr = `عرض نموذج أولي حي على عينة من المستخدمين الحقيقيين ومراقبة طريقة تفاعلهم وتدوين نقاط الاحتكاك`;
      q1CorrectEn = `Deploying an interactive prototype to a small cohort of real users and observing actual workflow friction points`;
      q1DistractorsAr = [
        `سؤال نفسك في المرآة عما إذا كان عملك ممتازاً واكتفاء بذلك`,
        `الانتظار لعدة أشهر دون إظهار العمل لأي شخص خوفاً من النقد`,
        `تجاهل ملاحظات المستخدمين والظن بأنهم لا يفهمون عبقرية التصميم`,
      ];
      q1DistractorsEn = [
        `Relying purely on solitary self-assessment without consulting external users`,
        `Concealing progress for months out of fear of constructive critique`,
        `Dismissing user friction points under the assumption that users lack technical sophistication`,
      ];
      q1ExplanationAr = `المستخدم الحقيقي يرى في دقيقة واحدة ما قد تعجز عن رؤيته في شهر من العمل المنفرد؛ التغذية الراجعة المبكرة هي أقوى مسرّع للتطور.`;
      q1ExplanationEn = `Real user walkthroughs uncover UX friction faster than weeks of isolated planning.`;

      q2Ar = `التعامل مع ملاحظات المراجعين كانتقاد بنّاء لتطوير المخرج وليس كتقليل شخصي هو سمة الخبير الناضج في ${track.titleAr}.`;
      q2En = `Treating peer critiques as diagnostic telemetry rather than personal judgment is the hallmark of professional maturity in ${track.titleEn}.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! الملاحظات النقدية هي البيانات الخام التي تبني بها منتجاً صلباً يكتسح السوق بثقة.`;
      q2ExplanationEn = `True! Constructive critique is the primary empirical fuel for elevating project quality and user delight.`;
      break;

    case 18:
      q1Ar = `كيف تحسن أداء استهلاك الموارد (ذاكرة، وقت، تكلفة) أثناء تشغيل مخرجات "${outcomeAr}" دون التضحية بالدقة؟`;
      q1En = `How do you optimize resource throughput, runtime latency, and computational cost in "${outcomeEn}" while preserving fidelity?`;
      q1CorrectAr = `تحليل نقاط الاختناق (Profiling) وتحسين العمليات الثقيلة وتفعيل التخزين المؤقت للبيانات المتكررة`;
      q1CorrectEn = `Profiling execution bottlenecks, optimizing heavy compute pathways, and caching repetitive computations`;
      q1DistractorsAr = [
        `تقليل جودة المخرجات بنسبة 90% للحصول على سرعة وهمية لا قيمة لها`,
        `إلغاء عمليات التحقق من الأمان لتسريع معالجة البيانات بالثواني`,
        `شراء خوادم بأسعار فلكية بدلاً من تحسين الكود والمنطق المتبع`,
      ];
      q1DistractorsEn = [
        `Slashing output quality by 90% to chase illusory latency gains with broken deliverables`,
        `Removing security verification layers to shave off milliseconds dangerously`,
        `Throwing expensive cloud hardware at un-optimized code instead of refactoring algorithmic bottlenecks`,
      ];
      q1ExplanationAr = `التحسين الفعال يبدأ بالقياس الدقيق لنقاط الاختناق؛ معالجة السبب الجذري يمنحك أداءً خارقاً بأقل التكاليف.`;
      q1ExplanationEn = `Effective optimization starts with precise profiling; addressing core bottlenecks yields maximum ROI.`;

      q2Ar = `التحسين المفرط المبكر قبل اكتمال الوظائف الأساسية (Premature Optimization) قد يضيع وقتاً ثميناً دون جدوى حقيقية.`;
      q2En = `Premature optimization before core functionality stabilizes wastes precious engineering sprints without meaningful returns.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! القاعدة الهندسية الذهبية: اجعل النظام يعمل أولاً بشكل صحيح، ثم اجعله سريعاً وموفراً للموارد.`;
      q2ExplanationEn = `True! The classic engineering maxim holds: make it work, make it right, make it fast — in that exact sequence.`;
      break;

    case 19:
      q1Ar = `عند صياغة القيمة التجارية لمهارتك في "${outcomeAr}" أمام الشركات، ما هو الجانب الذي يجذب اهتمامهم فوراً؟`;
      q1En = `When framing your proficiency in "${outcomeEn}" for commercial clients, what aspect commands immediate executive attention?`;
      q1CorrectAr = `توضيح كيف يوفر حلك التكاليف التشغيلية ويسرّع الإنتاجية ويحمي الأعمال من المخاطر بالأرقام`;
      q1CorrectEn = `Quantifying how your deliverable slashes operating overhead, accelerates throughput, and de-risks execution`;
      q1DistractorsAr = [
        `التحدث فقط عن المصطلحات التقنية المعقدة دون ربطها بالعائد المادي أو التجاري`,
        `تقديم نفسك كأرخص منفذ في السوق يقبل بأي مقابل بخس دون مراعاة الجودة`,
        `ادعاء امتلاك قدرات سحرية لا تستند لأي منهجية علمية قابلة للقياس`,
      ];
      q1DistractorsEn = [
        `Speaking exclusively in abstract technical jargon disconnected from bottom-line ROI`,
        `Positioning yourself as the cheapest commodity vendor racing to the bottom on price`,
        `Claiming mythical superpowers with zero verifiable business methodology`,
      ];
      q1ExplanationAr = `الشركات تستثمر في الحلول التي تؤثر على ميزانيتها وأرباحها؛ التعبير عن مهارتك بلغة العائد الاستثماري (ROI) هو مفتاح الصفقات الكبرى.`;
      q1ExplanationEn = `Enterprises invest in solutions that move the needle on financial statements; articulating ROI unlocks premium contracts.`;

      q2Ar = `الشركات وأصحاب الأعمال لا يدفعون مقابل ساعات الجهد، بل يدفعون مقابل حل المشكلات المؤلمة وتوفير التكاليف وزيادة الأرباح.`;
      q2En = `Decision-makers do not buy effort hours; they invest in quantifiable risk reduction, cost elimination, and revenue acceleration.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! التركيز على النتيجة والقيمة هو جوهر التسعير الاحترافي والانتقال من مرحلة العمالة إلى مرحلة الاستشارات.`;
      q2ExplanationEn = `True! Focusing on value delivered transforms you from a commoditized hourly laborer into an indispensable strategic consultant.`;
      break;

    case 20:
      q1Ar = `ما هي العناصر الأساسية لعرض العمل (Proposal) المقنع الذي يبرز كفاءتك في "${outcomeAr}" ويفوز بالعقد؟`;
      q1En = `What structural ingredients make a project proposal for "${outcomeEn}" compelling enough to close high-ticket contracts?`;
      q1CorrectAr = `تشخيص دقيق لمشكلة العميل، وخطة تسليم بمراحل واضحة (Milestones)، مع نماذج سابقة وتوضيح صريح للعائد`;
      q1CorrectEn = `Accurate diagnosis of the prospect's pain point, milestone-gated deliverables, past proof, and clear ROI justification`;
      q1DistractorsAr = [
        `إرسال سيرة ذاتية عامة من 10 صفحات دون ذكر اسم العميل أو مشكلته الخاصة`,
        `كتابة سعر عشوائي في سطر واحد وطلب تحويل المبلغ قبل أي اتفاق`,
        `إرسال عروض منسوخة حرفياً لـ 100 عميل دون أي تخصيص لاحتياجاتهم`,
      ];
      q1DistractorsEn = [
        `Sending a generic 10-page resume that never addresses the prospect's explicit operational roadblock`,
        `Quoting an arbitrary price on a single line demanding wire transfers before aligning on scope`,
        `Blasting identical copy-pasted templates to 100 prospects with zero customization`,
      ];
      q1ExplanationAr = `العرض الفائز هو الذي يشعر العميل بأنك فهمت ألمه التشغيلي بدقة وأنك تملك الحل الهندسي المحكم لإنهائه.`;
      q1ExplanationEn = `Winning proposals demonstrate profound empathetic comprehension of client pain, paired with surgical execution clarity.`;

      q2Ar = `إرسال عروض عامة مكررة لا تذكر تفاصيل مشكلة العميل واحتياجه الخاص يؤدي لتجاهل عرضك بنسبة تتجاوز 90%.`;
      q2En = `Blasting boilerplate copy-pasted proposals that fail to diagnose the client's explicit pain points guarantees a 90%+ rejection rate.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! التخصيص والتشخيص الدقيق هو العامل رقم 1 في جذب اهتمام متخذي القرار وإتمام التعاقدات.`;
      q2ExplanationEn = `True! Customized diagnosis is the single highest predictor of prospect response rates and deal velocity.`;
      break;

    case 21:
      q1Ar = `في محطة التدقيق التجاري، كيف تقيم مدى جاهزية مهاراتك في "${outcomeAr}" لتقديم خدمات مدفوعة لعملاء حقيقيين؟`;
      q1En = `During this commercial audit checkpoint, how do you stress-test your readiness to deliver paid services in "${outcomeEn}"?`;
      q1CorrectAr = `التحقق من قدرتك على تنفيذ متطلبات العميل وفق معايير الجودة والوقت، وامتلاك عقد رسمي وعملية تسليم موثقة`;
      q1CorrectEn = `Verifying reliable execution velocity under deadlines, possessing ironclad contract templates, and established delivery protocols`;
      q1DistractorsAr = [
        `الافتراض بأن الجاهزية تعني عدم وجود أي مجال للخطأ إطلاقاً حتى في أصعب الظروف`,
        `بدء العمل دون أي نماذج أو عقود أو نظام لاستلام الدفعات المالية`,
        `قبول أي مشروع بغض النظر عن توافقه مع خبرتك الحالية لمجرد الحصول على مال سريع`,
      ];
      q1DistractorsEn = [
        `Believing readiness requires perfection across every hypothetical scenario before ever speaking to a buyer`,
        `Commencing client projects without contracts, invoices, or secure payment gateways`,
        `Accepting completely misaligned engagements outside your competencies purely out of desperation`,
      ];
      q1ExplanationAr = `الجاهزية التجارية تجمع بين الكفاءة التقنية والنضج الإداري لحماية نفسك والعميل وضمان استمرارية النجاح.`;
      q1ExplanationEn = `Commercial readiness pairs technical competence with operational discipline, safeguarding margins and client trust.`;

      q2Ar = `تذكر الواقع المهني: "${track.realityAr}" — كيف تضع حدوداً واضحة لتوقعات العميل لتفادي الخلافات والنزاعات؟`;
      q2En = `Heed the industry reality: "${track.realityEn}" — How do you set transparent boundary expectations to prevent disputes?`;
      q2OptionsAr = [
        `إعطاء وعود خيالية غير واقعية لإرضاء العميل لحظياً ثم الصدمة عند التسليم`,
        `شرح الحدود والنتائج المتوقعة بمصداقية وصراحة في وثيقة نطاق العمل قبل توقيع العقد`,
        `تجنب الحديث عن أي صعوبات محتملة والتظاهر بأن كل شيء سهل وخارق`,
        `التراجع والتنازل عن أتعابك بالكامل عند أول ملاحظة يطرحها العميل`,
      ];
      q2OptionsEn = [
        `Over-promising astronomical outcomes to close the deal, leading to catastrophe at delivery`,
        `Transparently communicating boundaries and deliverables inside a written scope of work before signing`,
        `Refusing to disclose technical trade-offs and pretending outcomes are magic`,
        `Waiving your entire fee the moment a client raises an ordinary operational revision`,
      ];
      q2CorrectIndex = 1;
      q2ExplanationAr = `إدارة التوقعات بمصداقية واحترافية منذ اليوم الأول تبني ثقة متينة وتمنع الخلافات وتضمن تسليماً سلساً ومرضياً للطرفين.`;
      q2ExplanationEn = `Proactive expectation management anchors client alignment and eliminates post-delivery friction.`;
      break;

    case 22:
      q1Ar = `كيف تحمي حقوقك المالية وتمنع تمدد نطاق العمل (Scope Creep) عند التعاقد على مشروع يخص "${outcomeAr}"؟`;
      q1En = `How do you enforce scope boundaries and protect profit margins against scope creep when contracting for "${outcomeEn}"?`;
      q1CorrectAr = `تحديد المخرجات وعدد جولات التعديل بدقة في العقد، واشتراط ميزانية إضافية لأي طلبات جديدة خارج النطاق`;
      q1CorrectEn = `Stipulating deliverables and revision cycles in the contract, and treating scope extensions as paid Phase 2 change orders`;
      q1DistractorsAr = [
        `الموافقة الشفهية على أي إضافات يطلبها العميل مجاناً دون تسجيل لتفادي إزعاجه`,
        `العمل بدون أي عقد رسمي والاعتماد على الثقة غير الموثقة في استلام المستحقات`,
        `التهديد بمقاضاة العميل فوراً عند سؤاله عن إمكانية إضافة ميزة بسيطة`,
      ];
      q1DistractorsEn = [
        `Verbally absorbing all extra client requests for free out of fear of causing friction`,
        `Working on handshakes without signed contracts or defined scope limits`,
        `Threatening legal escalation whenever a client inquires about an exploratory feature`,
      ];
      q1ExplanationAr = `حماية النطاق بأسلوب مهني ولبق تضمن لك ربحية المشروع وتحفظ احترام العميل لاحترافيتك وتقديره لوقتك.`;
      q1ExplanationEn = `Firm, diplomatic scope management preserves project profitability and cements client respect for your professional boundaries.`;

      q2Ar = `تقسيم المدفوعات على مراحل تسليم واضحة وموثقة (Milestones) يحفظ حقوق الطرفين ويضمن تدفقاً نقدياً آمناً.`;
      q2En = `Tying payment disbursements to explicit, documented milestone deliverables protects both parties and eliminates payment disputes.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! الدفعات المرحلية مع دفعة مقدمة إلزامية هي الممارسة القياسية عالمياً في العمل الحر والاستشارات.`;
      q2ExplanationEn = `True! Milestone-gated disbursements with an upfront deposit represent the established gold standard for client engagements.`;
      break;

    case 23:
      q1Ar = `كيف تحول المشروع الذي نفذته في "${outcomeAr}" إلى أصل قابل لإعادة الاستخدام ودراسة حالة تسويقية؟`;
      q1En = `How do you package your completed engagement in "${outcomeEn}" into a reusable intellectual property asset and public case study?`;
      q1CorrectAr = `حفظ القوالب والأنظمة المنفذة، وتوثيق قصة النجاح بالأرقام (المشكلة، الحل، والنتائج) في ملف إنجازك`;
      q1CorrectEn = `Abstracting reusable workflow components, and writing a metrics-driven case study detailing problem, solution, and results`;
      q1DistractorsAr = [
        `حذف كل ملفات المشروع بمجرد استلام المقابل المادي دون الاحتفاظ بأي توثيق`,
        `نشر أسرار العميل وبياناته الخاصة الحساسة علناً دون إذنه وموافقته`,
        `الافتراض أن العملاء القادمين لن يهتموا برؤية ما أنجزته من قبل`,
      ];
      q1DistractorsEn = [
        `Deleting all project artifacts the moment the invoice is cleared without retaining templates`,
        `Publishing proprietary client secrets and confidential customer data publicly without authorization`,
        `Assuming future prospects will never ask to inspect past verified track records`,
      ];
      q1ExplanationAr = `دراسات الحالة الموثقة هي التي تصنع لك سلطة مهنية وتجعل إقناع العملاء الجدد سهلاً وسريعاً للغاية.`;
      q1ExplanationEn = `Compelling case studies serve as permanent inbound marketing assets, dramatically reducing sales cycles with future clients.`;

      q2Ar = `توثيق دراسة الحالة بالأرقام والمقارنات قبل وبعد هو أقوى أداة تسويقية تضمن لك تدفقاً مستمراً من العملاء والفرص.`;
      q2En = `A quantified before-and-after case study serves as permanent inbound proof that attracts premium inbound opportunities.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! العملاء لا يقتنعون بالوعود النظرية، بل يقتنعون بالأدلة الحقيقية السابقة والنتائج المثبتة.`;
      q2ExplanationEn = `True! Decision-makers disregard abstract marketing promises; they look for empirical proof of prior client breakthroughs.`;
      break;

    case 24:
      q1Ar = `في اليوم الختامي لمسار ${track.titleAr}، ما هي الخطوة الحاسمة لتسليم المشروع النهائي بنجاح للعميل أو أصحاب المصلحة؟`;
      q1En = `On the capstone delivery day of ${track.titleEn}, what final operational step ensures seamless handover and client delight?`;
      q1CorrectAr = `إجراء جلسة تسليم توضيحية، وتقديم ملف التوثيق الشامل، والتأكد من عمل النظام بسلاسة في بيئة العميل`;
      q1CorrectEn = `Conducting a live walkthrough session, providing comprehensive documentation, and verifying smooth deployment in client production`;
      q1DistractorsAr = [
        `قطع الاتصال بالعميل فور تسليم الملفات دون أي شرح أو دعم للتأكد من تشغيلها`,
        `تسليم كود غير مكتمل وطلب الرصيد المتبقي دون فحص النظام`,
        `تجاهل توثيق بيانات الدخول والروابط الأساسية`,
      ];
      q1DistractorsEn = [
        `Disconnecting immediately after dropping files with zero orientation or handover support`,
        `Handing off broken deliverables while aggressively demanding immediate final payment`,
        `Omitting system credentials, documentation links, and access configurations entirely`,
      ];
      q1ExplanationAr = `التسليم الاحترافي المكتمل يترك انطباعاً استثنائياً ويدفع العميل لتوصيتك لشبكة معارفه والتعاقد معك مجدداً.`;
      q1ExplanationEn = `Excellence at project handover cements lasting client delight, unlocking repeat retainers and high-value referrals.`;

      q2Ar = `الوصول لليوم الأخير ليس نهاية المطاف، بل هو بداية الاحتراف الحقيقي والانطلاق لتطبيق المهارة في مشاريع أكبر.`;
      q2En = `Completing this track marks the inception of real mastery, equipping you to deploy high-leverage systems across ambitious projects.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! المهارات الحقيقية تتسع وتزدهر بالتطبيق المستمر في العالم الحقيقي؛ أنت الآن مجهز بأقوى الأدوات.`;
      q2ExplanationEn = `True! Practical skills expand exponentially through continuous real-world execution; you are now equipped with elite capabilities.`;
      break;

    case 25:
      q1Ar = `كيف تحافظ على تفوقك وتواكب التطورات المتسارعة في مجال "${track.titleAr}" بعد إنهاء المنهج الأساسي؟`;
      q1En = `How do you maintain a durable competitive edge amidst rapid technological changes in "${track.titleEn}"?`;
      q1CorrectAr = `متابعة الإصدارات الرسمية والتجارب الميدانية لقادة المجال وتخصيص وقت أسبوعي لاختبار الأدوات الجديدة`;
      q1CorrectEn = `Tracking official releases, following domain pioneers, and dedicating weekly exploration blocks to test emerging toolchains`;
      q1DistractorsAr = [
        `التوقف عن القراءة والاطلاع والظن بأن المعرفة القديمة ستكفيك لسنوات دون تحديث`,
        `التبديل اليومي للأدوات دون إتقان أي منها وملاحقة كل صيحة عشوائية`,
        `الاعتماد على منشورات التواصل الاجتماعي الترويجية دون تجربة عملية شخصية`,
      ];
      q1DistractorsEn = [
        `Halting all learning under the delusion that current knowledge remains static indefinitely`,
        `Switching toolchains daily without mastering any core stack, chasing shiny objects`,
        `Consuming sensationalist social media hype without personally validating tools`,
      ];
      q1ExplanationAr = `المحترف الحقيقي يحافظ على مرونته المعرفية؛ متابعة الميدان تمنحك ميزة استباقية تجعلك دائماً متقدماً على المنافسين.`;
      q1ExplanationEn = `Ongoing deliberate curiosity keeps your technical arsenal sharp and maintains competitive superiority.`;

      q2Ar = `تخصيص ساعة أسبوعياً للاطلاع على أحدث الأدوات والبحوث في مجالك يمنحك ميزة تنافسية دائمة لا تزول.`;
      q2En = `Dedication of a recurring weekly sprint to inspect frontier tools and documentation sustains lasting technical leadership.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! التعلم المستمر هو الضمان الوحيد للبقاء في صدارة النخبة في الاقتصاد الرقمي الحديث.`;
      q2ExplanationEn = `True! Compounding lifelong learning is the sole guarantee of enduring authority in the modern knowledge economy.`;
      break;

    case 26:
      q1Ar = `ما هي الاستراتيجية الأكثر فاعلية لبناء سمعة مهنية قوية تجعل العملاء يبحثون عنك في "${track.titleAr}"؟`;
      q1En = `What outbound strategy establishes inbound authority in "${track.titleEn}" so opportunities pursue you?`;
      q1CorrectAr = `نشر محتوى تعليمي ودراسات حالة واقعية توضح منهجيتك في حل المشكلات ومشاركة إنجازاتك علناً`;
      q1CorrectEn = `Publishing educational case studies breaking down your problem-solving process and sharing deliverables publicly`;
      q1DistractorsAr = [
        `إرسال رسائل سبام مزعجة لمئات الأشخاص على الخاص دون إظهار أي عمل أو قيمة`,
        `الحديث عن نفسك بغرور دون إظهار أي مشاريع عملية ملموسة`,
        `إخفاء أعمالك ومعرفتك بالكامل بدافع الخوف غير المبرر من المنافسين`,
      ];
      q1DistractorsEn = [
        `Spamming hundreds of direct messages cold without demonstrating proof or value`,
        `Boasting about credentials while refusing to display functional projects`,
        `Hoarding all insights in secret out of irrational fear of competitors`,
      ];
      q1ExplanationAr = `مشاركة المعرفة العملية وبناء السمعة علناً يبني سلطة مهنية تجعل العملاء يثقون بك ويسعون للتعاقد معك.`;
      q1ExplanationEn = `Transparently demonstrating competence in public builds magnetic authority and generates recurring inbound client pipeline.`;

      q2Ar = `مشاركة ما تتعلمه وتبنيه علناً (Build in Public) يجذب إليك الفرص والشراكات دون الحاجة للإعلانات المدفوعة.`;
      q2En = `Building in public and publishing architectural breakdowns attracts organic inbound enterprise contracts effortlessly.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! التوثيق العلني للإنجازات هو أقوى مغناطيس لجذب العملاء المتميزين والشراكات المربحة.`;
      q2ExplanationEn = `True! Public execution telemetry attracts high-caliber clients who value demonstrable competence over marketing fluff.`;
      break;

    case 27:
      q1Ar = `كيف تستفيد من مجتمعات المحترفين والأقران لمراجعة وتطوير مشاريعك في "${track.titleAr}"؟`;
      q1En = `How do you leverage high-caliber peer networks and developer communities to stress-test your work in "${track.titleEn}"?`;
      q1CorrectAr = `طلب مراجعة الكود والأنظمة (Code/Design Review) من ممارسين متقدمين ومناقشة الحلول البديلة بنضج`;
      q1CorrectEn = `Requesting rigorous peer code/architecture reviews from advanced practitioners and exploring alternative design choices`;
      q1DistractorsAr = [
        `الدخول في نقاشات عقيمة حول أي أداة هي الأفضل دون تقديم أي عمل ملموس`,
        `التحسس من أي ملاحظة نقدية والتعامل مع المجتمع كساحة صراع`,
        `الاعتماد على المجتمع لحل واجباتك البسيطة دون بذل أي جهد شخصي في البحث`,
      ];
      q1DistractorsEn = [
        `Engaging in endless tribal tool wars online without writing a single line of working code`,
        `Taking technical reviews personally and turning discussions into confrontational battles`,
        `Treating peer communities as a crutch for spoon-feeding answers without personal effort`,
      ];
      q1ExplanationAr = `مراجعات الأقران تفتح عينيك على زوايا خفية وممارسات فضلى قد تحتاج لسنوات لاكتشافها بمفردك.`;
      q1ExplanationEn = `Rigorous peer reviews reveal blind spots and expose you to battle-tested workflows cultivated across diverse teams.`;

      q2Ar = `الانعزال عن مجتمع الممارسين يجعلك تكرر أخطاء شائعة تجاوزها الآخرون منذ سنوات.`;
      q2En = `Working in total isolation causes costly regression into well-documented pitfalls that peer networks solved years ago.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! التواصل الإيجابي مع مجتمع التخصص يسرع من نضجك المهني ويحميك من الدوران في حلقات مفرغة.`;
      q2ExplanationEn = `True! Active engagement with top practitioner circles eliminates redundant learning curves and accelerates professional velocity.`;
      break;

    case 28:
    default:
      q1Ar = `مع تخرجك الرسمي وحصولك على الشهادة المعتمدة في "${track.titleAr}"، كيف تعرض إنجازك على LinkedIn وسيرتك الذاتية؟`;
      q1En = `Upon earning your verified certification in "${track.titleEn}", how do you showcase your credential on LinkedIn and resumes?`;
      q1CorrectAr = `إضافة الشهادة برابط التحقق الرقمي المباشر، مرفقة برابط المشروع الحي ودراسة الحالة في ملف إنجازك`;
      q1CorrectEn = `Adding the credential with its direct digital verification URL, linked directly to the live capstone case study`;
      q1DistractorsAr = [
        `نشر الشهادة دون أي شرح لمحتوى المسار أو ما قمت ببنائه بالفعل`,
        `الادعاء أنك لا تحتاج لمشاركة أي دليل على مهاراتك لأنك متأكد من نفسك`,
        `إخفاء رابط التحقق خوفاً من أن يتأكد الناس من مصداقية الشهادة`,
      ];
      q1DistractorsEn = [
        `Posting an image of the certificate with zero narrative on what you actually engineered or built`,
        `Assuming you need no verifiable proof because self-confidence alone wins contracts`,
        `Hiding verification credentials out of anxiety regarding scrutiny`,
      ];
      q1ExplanationAr = `الشهادة المعتمدة المدعومة بمشروع تطبيقي ورابط تحقق رقمي تمنحك مصداقية فورية تفتح لك أبواب الفرص والتوظيف.`;
      q1ExplanationEn = `An accredited credential anchored by verifiable capstone artifacts establishes instant professional credibility with employers.`;

      q2Ar = `شهادة الإتمام المقترنة برابط مشروع حقيقي حي ومفحوص تمنحك مصداقية تفوق عشرات الشهادات النظرية المجردة.`;
      q2En = `An accredited certificate paired with a live verifiable production artifact delivers authoritative credibility unmatched by generic degrees.`;
      q2OptionsAr = ["صح", "غلط"];
      q2OptionsEn = ["True", "False"];
      q2CorrectIndex = 0;
      q2ExplanationAr = `صحيح تماماً! سوق العمل الحديث يبحث عن الإثبات العملي القاطع للقدرة على الإنجاز، وليس مجرد الأوراق.`;
      q2ExplanationEn = `True! The modern digital economy values verifiable proof of execution far above empty theoretical credentials.`;
      break;
  }

  // Assemble Q1 Options with rotated correct index
  const q1OptionsAr = [...q1DistractorsAr];
  q1OptionsAr.splice(mcqCorrectIndex, 0, q1CorrectAr);

  const q1OptionsEn = [...q1DistractorsEn];
  q1OptionsEn.splice(mcqCorrectIndex, 0, q1CorrectEn);

  // If Q2 is MCQ with 4 options and needs assembling:
  if (q2OptionsAr.length === 4) {
    // Already set in specific switch cases
  }

  // --------------------------------------------------------------------------
  // ASSEMBLE BILINGUAL QUIZ LISTS
  // --------------------------------------------------------------------------
  const quizAr: QuizItem[] = [
    {
      id: `q-${lessonId}-1`,
      type: "mcq",
      question: q1Ar,
      options: q1OptionsAr,
      correctIndex: mcqCorrectIndex,
      explanation: q1ExplanationAr,
    },
    {
      id: `q-${lessonId}-2`,
      type: q2OptionsAr.length === 2 ? "tf" : "mcq",
      question: q2Ar,
      options: q2OptionsAr,
      correctIndex: q2CorrectIndex,
      explanation: q2ExplanationAr,
    },
  ];

  const quizEn: QuizItem[] = [
    {
      id: `q-${lessonId}-1`,
      type: "mcq",
      question: q1En,
      options: q1OptionsEn,
      correctIndex: mcqCorrectIndex,
      explanation: q1ExplanationEn,
    },
    {
      id: `q-${lessonId}-2`,
      type: q2OptionsEn.length === 2 ? "tf" : "mcq",
      question: q2En,
      options: q2OptionsEn,
      correctIndex: q2CorrectIndex,
      explanation: q2ExplanationEn,
    },
  ];

  return { quizAr, quizEn };
}
