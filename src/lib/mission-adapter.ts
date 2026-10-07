import { loadUniversalLesson, findTrackOrHandcrafted } from "@/lib/course-loader";
import { getTrackSkillTree, getCurrentTargetSkill, SkillNode } from "@/content/skill-trees";
import { getDayArchetype } from "@/content/day-archetypes";

export type MissionRubricCriterion = {
  id: string;
  nameAr: string;
  nameEn: string;
  weight: number;
  descriptionAr: string;
  descriptionEn: string;
};

export type MissionObjective = {
  accomplishAr: string;
  accomplishEn: string;
  produceAr: string;
  produceEn: string;
  successCriteriaAr: string[];
  successCriteriaEn: string[];
};

export type MissionData = {
  id: string;
  slug: string;
  dayNumber: number;
  totalDays: number;
  titleAr: string;
  titleEn: string;
  estimatedMinutes: number;
  xpReward: number;
  isCapstone: boolean;
  targetSkill: SkillNode;
  objective: MissionObjective;
  learnCards: Array<{ heading: string; lines: string[] }>;
  goldenExample: {
    titleAr: string;
    titleEn: string;
    content: string;
    explanationAr: string;
    explanationEn: string;
  };
  practice: {
    instructionsAr: string[];
    instructionsEn: string[];
    starterPrompt?: string;
    starterTemplate?: string;
    placeholderAr: string;
    placeholderEn: string;
  };
  rubric: MissionRubricCriterion[];
};

/**
 * Domain classifier to customize deliverables, golden models, and practice templates
 */
function getDomainClassification(pillarOrCategory: string): {
  type: "ai" | "dev" | "data" | "freelance" | "marketing" | "design" | "business" | "cyber" | "soft" | "productivity";
} {
  const p = pillarOrCategory.toLowerCase();
  if (p.includes("ذكاء") || p.includes("أوامر") || p.includes("ai") || p.includes("prompt")) return { type: "ai" };
  if (p.includes("برمج") || p.includes("كود") || p.includes("تطوير") || p.includes("dev") || p.includes("software")) return { type: "dev" };
  if (p.includes("بيانات") || p.includes("تحليل") || p.includes("مالي") || p.includes("data") || p.includes("kpi")) return { type: "data" };
  if (p.includes("حر") || p.includes("freelanc") || p.includes("عملاء")) return { type: "freelance" };
  if (p.includes("تسويق") || p.includes("إعلان") || p.includes("market") || p.includes("مبيعات")) return { type: "marketing" };
  if (p.includes("تصميم") || p.includes("ميديا") || p.includes("فيديو") || p.includes("design") || p.includes("video")) return { type: "design" };
  if (p.includes("أعمال") || p.includes("رياد") || p.includes("بزنس") || p.includes("business") || p.includes("startup")) return { type: "business" };
  if (p.includes("أمن") || p.includes("سيبران") || p.includes("cyber") || p.includes("حماي")) return { type: "cyber" };
  if (p.includes("ناعم") || p.includes("تواصل") || p.includes("إقناع") || p.includes("soft")) return { type: "soft" };
  return { type: "productivity" };
}

export function loadMission(slug: string, dayNumber: number): MissionData | null {
  const lessonData = loadUniversalLesson(slug, dayNumber);
  if (!lessonData) return null;

  const { course, lesson } = lessonData;
  const tree = getTrackSkillTree(slug, [], dayNumber);
  const targetSkill = getCurrentTargetSkill(tree, dayNumber);
  const isCapstone = dayNumber === course.totalLessons;

  // Extract learning cards
  const learnCards = lesson.cards.map((c) => ({
    heading: c.heading || (lesson.titleAr || "مفهوم عملي"),
    lines: c.type === "info" ? c.body.lines : c.body.instructions,
  }));

  const domain = getDomainClassification(course.categoryAr || targetSkill.domain || "");
  const lessonTitleAr = lesson.titleAr || `يوم ${dayNumber}: مهارة عملية في ${course.titleAr}`;
  const lessonTitleEn = lesson.titleEn || `Day ${dayNumber}: Practical Skill in ${course.titleEn}`;
  const archetype = getDayArchetype(dayNumber, course.totalLessons);

  // Tailored tangible deliverable and objectives
  let deliverableAr = `صياغة ${archetype.subTopicAr} وفق المعايير التنفيذية لتطبيق "${lessonTitleAr}"`;
  let deliverableEn = `Production deliverable applying "${lessonTitleEn}" (${archetype.subTopicEn})`;
  let accomplishAr = `إتقان ${archetype.subTopicAr} في ${targetSkill.nameAr} وتطبيقها عملياً على مهمة تنفيذية مباشرة في ${course.titleAr}.`;
  let accomplishEn = `Mastering ${archetype.subTopicEn} in ${targetSkill.nameEn} and applying it directly to a production task in ${course.titleEn}.`;

  // Domain-specific deliverable naming
  switch (domain.type) {
    case "ai":
      deliverableAr = `صياغة برومبت تنفيذي متقدم (RTCC) أو سلسلة أوامر ذكاء اصطناعي موجهة لـ "${lessonTitleAr}" مع معايير جودة صارمة.`;
      deliverableEn = `Production prompt architecture (RTCC) or automated workflow for "${lessonTitleEn}".`;
      break;
    case "dev":
      deliverableAr = `بناء كود برمجي أو مكون تقني متكامل يطبق "${lessonTitleAr}" مع معالجة سيناريوهات الأخطاء.`;
      deliverableEn = `Functional code component or API module applying "${lessonTitleEn}" with error handling.`;
      break;
    case "data":
      deliverableAr = `بناء مصفوفة مؤشرات أداء (KPIs) أو نموذج تحليلي لحساب وتقييم "${lessonTitleAr}".`;
      deliverableEn = `Quantitative KPI framework or analytic data model evaluating "${lessonTitleEn}".`;
      break;
    case "freelance":
      deliverableAr = `صياغة مسودة مقترح عمل رابح (Winning Proposal) أو نطاق عمل رسمي لمشروع يخص "${lessonTitleAr}".`;
      deliverableEn = `Winning client proposal or project scope document applying "${lessonTitleEn}".`;
      break;
    case "marketing":
      deliverableAr = `صياغة نص تسويقي تحويلي (High-Converting Copy) أو خطة حملة إعلانية مخصصة لـ "${lessonTitleAr}".`;
      deliverableEn = `High-converting campaign copy or growth framework applying "${lessonTitleEn}".`;
      break;
    case "design":
      deliverableAr = `تصميم مخطط بصري أو سكريبت فيديو وبرومبتات لقطات سينمائية لتنفيذ "${lessonTitleAr}".`;
      deliverableEn = `Visual storyboard, prompt system, or video direction asset for "${lessonTitleEn}".`;
      break;
    case "business":
      deliverableAr = `إعداد وثيقة نموذج عمل (Business Canvas) أو دراسة جدوى استراتيجية لتطبيق "${lessonTitleAr}".`;
      deliverableEn = `Business model canvas or strategic feasibility blueprint applying "${lessonTitleEn}".`;
      break;
    case "cyber":
      deliverableAr = `إعداد مصفوفة تدقيق أمني وضبط صلاحيات وسياسات حماية لـ "${lessonTitleAr}".`;
      deliverableEn = `Security audit matrix and credential protection policy for "${lessonTitleEn}".`;
      break;
    case "soft":
      deliverableAr = `صياغة سيناريو إقناع أو إطار تفاوض استراتيجي لتطبيق "${lessonTitleAr}".`;
      deliverableEn = `Persuasion scenario or negotiation framework applying "${lessonTitleEn}".`;
      break;
    case "productivity":
    default:
      deliverableAr = `بناء نظام تشغيل شخصي (SOP) وجدول زمني لحصار المشتتات وتطبيق "${lessonTitleAr}".`;
      deliverableEn = `Personal standard operating procedure (SOP) and execution habit system for "${lessonTitleEn}".`;
      break;
  }

  // Specific high-impact overrides for flagship courses
  if (slug === "tahaddi-28-yawm" || slug === "prompt-engineering-mastery") {
    if (dayNumber === 1) {
      accomplishAr = "فهم منطق عمل نماذج الذكاء الاصطناعي وبناء أول حوار توجيهي مخصص لعملك.";
      deliverableAr = "صياغة أول برومبت تعريفي استراتيجي يوجه الذكاء لفهم مجال تخصصك.";
    } else if (dayNumber === 3) {
      accomplishAr = "تقمص دور مستشار خبير (Expert Persona) بدقة للحصول على استشارات عميقة.";
      deliverableAr = "برومبت استشاري متكامل يحدد الهوية، سنوات الخبرة، ومعايير القرار الصارمة.";
    } else if (dayNumber === 6) {
      accomplishAr = "بناء قيود سلبية صارمة تمنع الذكاء من تقديم إجابات مبتذلة أو حشو مكرر.";
      deliverableAr = "أمر متقدم يتضمن قائمة شروط سلبية (Negative Constraints) واضحة المعالم.";
    } else if (isCapstone) {
      accomplishAr = "مشروع التخرج: هندسة سلسلة وكلاء ذكاء اصطناعي تدير مشروعاً كاملاً من الألف إلى الياء.";
      deliverableAr = "ملف نظام عمل ذكي (Executive AI Pipeline) كامل وجاهز للنشر في بورتفوليو أعمالك.";
    }
  } else if (slug === "zero-to-first-dollar-freelancer" || slug === "el-3amal-el-horr") {
    if (dayNumber === 1) {
      accomplishAr = "تحديد تخصصك الدقيق وتحديد المشكلة التي يدفع العملاء لحلها فوراً.";
      deliverableAr = "بيان تحديد التخصص والقيمة (Niche Statement) من سطرين يوضح مجالك وجمهورك.";
    } else if (dayNumber === 7) {
      accomplishAr = "هندسة مقترح عمل رابح على Upwork يجبر العميل على بدء المقابلة.";
      deliverableAr = "مسودة مقترح عمل (Proposal Hook) مخصصة لوظيفة حقيقية مع معالجة مخاوف العميل.";
    }
  }

  // Domain-specific Golden Standard Benchmarks (100/100 Model)
  let goldenContent = "";
  let starterTemplate = "";
  let placeholderAr = "";

  switch (domain.type) {
    case "ai":
      goldenContent = [
        `[الدور المطلوب]: أنت كبير مستشاري استراتيجيات الأعمال والذكاء الاصطناعي بخبرة 15 عاماً.`,
        `[السياق والمجال]: تطبيق أساليب ${lessonTitleAr} على بيئة عمل إنتاجية وتطوير تدفق عمل حقيقي.`,
        `[المهمة الأساسية]: حلل المعطيات المقدمة واستخرج خطة العمل التنفيذية من 3 محطات محددة.`,
        `[القيود الصارمة (Negative Constraints)]: ممنوع استخدام العبارات الإنشائية العامة، ركّز فقط على أرقام وحلول قابلة للقياس، واذكر المخاطر وكيفية معالجتها.`,
        `[صيغة المخرج النهائي]: جدول من 4 أعمدة (الخطوة التنفيذية، الأداة المستخدمة، مؤشر النجاح، الإجراء البديل).`,
      ].join("\n");
      starterTemplate = `[الدور المطلوب]: عين هوية الخبير وخبرته...\n[السياق والمجال]: اذكر مجالك وخلفية المهمة...\n[المهمة الأساسية]: وضح المطلوب بدقة...\n[القيود الصارمة]: اذكر ما يجب تجنبه (Negative Constraints)...\n[صيغة المخرج النهائي]: حدد شكل المخرج (جدول/نقاط/كود)...`;
      placeholderAr = "اكتب هنا برومبتك التنفيذي المتكامل وفق معايير RTCC...";
      break;

    case "dev":
      goldenContent = [
        `// ========================================================`,
        `// نموذج ذهبي معياري: تطبيق ${lessonTitleAr}`,
        `// ========================================================`,
        `export async function handleProductionService(payload: ServiceRequest): Promise<ServiceResponse> {`,
        `  // 1. التحقق الصارم من صحة المدخلات`,
        `  if (!payload || !payload.id || payload.amount <= 0) {`,
        `    throw new Error("Invalid request payload: Schema validation failed.");`,
        `  }`,
        `  `,
        `  // 2. التنفيذ الفعلي مع معالجة سيناريوهات الأخطاء`,
        `  try {`,
        `    const result = await executeCoreOperation(payload);`,
        `    return { success: true, code: 200, data: result };`,
        `  } catch (error) {`,
        `    logger.error("Operation failed gracefully", { error });`,
        `    return { success: false, code: 500, fallback: triggerGracefulFallback(payload) };`,
        `  }`,
        `}`,
      ].join("\n");
      starterTemplate = `// [الهدف]: وصف ما ينفذه الكود هنا...\n// [المدخلات والمخرجات]: حدد نوع البيانات المتوقعة...\n// [المنطق والتنفيذ]: اكتب هنا الدالة أو المكون البرمجي...\n// [معالجة الأخطاء]: حدد سيناريوهات الاستثناء (Edge cases)...`;
      placeholderAr = "اكتب هنا الكود أو المعمارية البرمجية المنفذة للمهمة...";
      break;

    case "data":
      goldenContent = [
        `[مصفوفة مؤشرات الأداء والتحليل المالي: ${lessonTitleAr}]`,
        `---------------------------------------------------------------------`,
        `• المؤشر الأول (CAC): تكلفة الاستحواذ = نفقات التسويق ÷ العملاء الجدد = $42`,
        `• المؤشر الثاني (LTV): القيمة الدائمة للعميل = متوسط الفاتورة × التكرار = $210`,
        `• نسبة الصحة المالية (LTV:CAC): 5.0x (تتجاوز المعيار العالمي المطلوب 3.0x)`,
        `• التوصية التنفيذية: تركيز 70% من الميزانية على القناة الأكثر ربحية، وإلغاء القناة ذات العائد السلبي.`,
      ].join("\n");
      starterTemplate = `[المؤشر والهدف التحليلي]: حدد ما تقيسه ولماذا...\n[مصدر البيانات والمدخلات]: اذكر الأعمدة والبيانات المطلوبة...\n[المعادلة ومنطق الحساب]: اشرح طريقة استخراج النتيجة...\n[القرار التنفيذي المقترح]: ما هو الإجراء الموصى به بناءً على الأرقام...`;
      placeholderAr = "اكتب هنا مصفوفة المؤشرات والتحليل الرقمي للمهمة...";
      break;

    case "freelance":
      goldenContent = [
        `مرحباً [اسم العميل]،`,
        `قرأت متطلبات مشروعك حول ${lessonTitleAr} ولاحظت أن العائق الأكبر أمامك هو [المشكلة التشغيلية الحقيقية].`,
        `نفذت مشروعاً مطابقاً مؤخراً حقق [النتيجة بالأرقام]، وهذه خطتي لتنفيذ طلبك بدقة:`,
        `1. تحليل وتشخيص أولي للمتطلبات (يوم واحد).`,
        `2. تسليم مسودة العمل الأولى للمراجعة (3 أيام).`,
        `3. الضبط النهائي وتدريب فريقك على التشغيل (يومان).`,
        `إذا كان وقتك يسمح بمحادثة سريعة لـ 10 دقائق، يمكنني إرسال نموذج أولي مخصص مجاناً اليوم.`,
      ].join("\n");
      starterTemplate = `[تشخيص مشكلة العميل]: أظهر فهمك العميق لألمه التشغيلي...\n[خطة التنفيذ ومحطات التسليم]: حدد الخطوات الزمنية لتنفيذ الحل...\n[سابقة الأعمال والإثبات العملي]: اذكر نتائج سابقة تبرهن كفاءتك...\n[عرض السعر ودعوة للبدء]: قدم الخيارات والخطوة التالية...`;
      placeholderAr = "اكتب هنا مسودة مقترح العمل (Proposal) أو خطة تقديم الخدمة للعميل...";
      break;

    case "marketing":
      goldenContent = [
        `[الهوك الصادم (Hook - أول 3 ثوان)]: 80% من الشركات تهدر ميزانياتها الإعلانية بسبب خطأ واحد في ${lessonTitleAr}...`,
        `[المشكلة المؤلمة (Pain Point)]: الاعتماد على أساليب عشوائية يرفع تكلفة الإعلان دون أي عائد ملموس.`,
        `[الحل وعرض القيمة (UVP)]: نظامنا يمنحك تدفق عمل مجرب يضاعف العائد على الإنفاق الإعلاني (ROAS) بنسبة 3x.`,
        `[الدعوة للفعل وضمان عدم المخاطرة (CTA)]: احجز استشارتك الآن مع ضمان استرداد كامل إذا لم تحقق هدفك.`,
      ].join("\n");
      starterTemplate = `[الجمهور المستهدف وشريحة العميل]: حدد بدقة من تخاطب...\n[المشكلة المؤلمة والعقبة الأساسية]: صف الألم الذي يعاني منه العميل...\n[الحل وعرض القيمة الفريد (UVP)]: كيف يحل منتجك/خدمتك هذه المشكلة جذرياً...\n[الدعوة للفعل وضمان عدم المخاطرة (CTA & Risk Reversal)]: اطلب الخطوة القادمة بوضوح...`;
      placeholderAr = "اكتب هنا النص التسويقي أو زاوية الحملة الإعلانية للمهمة...";
      break;

    default:
      goldenContent = [
        `[إطار العمل التنفيذي: ${lessonTitleAr}]`,
        `---------------------------------------------------------------------`,
        `• الهدف الاستراتيجي: تحقيق نتيجة قابلة للقياس خلال 10 دقائق من العمل المركز.`,
        `• الخطوة الأولى: التجهيز وحصار المشتتات والبدء بنسخة أولية مبسطة (MVP).`,
        `• الخطوة الثانية: تطبيق أفضل الممارسات المعتمدة وتجنب العشوائية.`,
        `• المخرج النهائي: ملف موثق جاهز للاستخدام الفوري وإضافته لبورتفوليو الإنجازات.`,
      ].join("\n");
      starterTemplate = `[السياق والمجال]: اكتب هنا مجالك وسياق المهمة...\n[الهدف المباشر]: وضح المطلوب بدقة...\n[الخطوات التنفيذية]: اذكر ما ستطبقه خطوة بخطوة...\n[المخرج النهائي]: حدد شكل الإنجاز الذي حققته...`;
      placeholderAr = "اكتب هنا مخرجك العملي التطبيقي للمهمة...";
      break;
  }

  const goldenExample = {
    titleAr: `النموذج الذهبي المعياري لمهمة اليوم: ${archetype.titleAr} (تقييم 100/100):`,
    titleEn: `Golden Standard Reference Benchmark: ${archetype.titleEn} (100/100 Score):`,
    content: goldenContent,
    explanationAr: "لاحظ كيف يحتوي النموذج على تحديد دقيق، خلو تام من الحشو والإنشاء، قيود واضحة، ومخرج نهائي جاهز للاستخدام العملي الفوري.",
    explanationEn: "Notice the surgical precision, lack of ambiguous fluff, clear constraints, and directly actionable output format.",
  };

  const practice = {
    instructionsAr: archetype.stepsAr(course.titleAr, archetype.subTopicAr),
    instructionsEn: archetype.stepsEn(course.titleEn, archetype.subTopicEn),
    starterTemplate,
    placeholderAr,
    placeholderEn: "Write your tangible mission deliverable here...",
  };

  const rubric: MissionRubricCriterion[] = [
    {
      id: "specificity",
      nameAr: "التحديد والدقة (Specificity)",
      nameEn: "Specificity & Context",
      weight: 0.35,
      descriptionAr: "وضوح الأهداف والتوجيهات وغياب العبارات العامة الفضفاضة.",
      descriptionEn: "Clarity of directives and elimination of ambiguous generic phrases.",
    },
    {
      id: "constraints",
      nameAr: "إدارة القيود والشروط (Constraints)",
      nameEn: "Constraint Management",
      weight: 0.35,
      descriptionAr: "تحديد ما يجب تجنبه وضبط النبرة وشكل الإخراج النهائي.",
      descriptionEn: "Setting strict boundary rules and defining the exact output format.",
    },
    {
      id: "realism",
      nameAr: "القيمة العملية والتنفيذ (Actionability)",
      nameEn: "Workplace Actionability",
      weight: 0.3,
      descriptionAr: "قابلية المخرج للاستخدام الفوري في بيئة العمل الحقيقية.",
      descriptionEn: "Readiness for instant real-world workplace execution.",
    },
  ];

  return {
    id: `mission-${slug}-${dayNumber}`,
    slug,
    dayNumber,
    totalDays: course.totalLessons,
    titleAr: lessonTitleAr,
    titleEn: lessonTitleEn,
    estimatedMinutes: Math.max(10, lesson.durationMin || 10),
    xpReward: 180,
    isCapstone,
    targetSkill,
    objective: {
      accomplishAr,
      accomplishEn,
      produceAr: deliverableAr,
      produceEn: deliverableEn,
      successCriteriaAr: [
        "وضوح الهدف والسياق بنسبة لا تقل عن 75%",
        "تحديد قيود صريحة تمنع العشوائية",
        "مخرج نهائي جاهز للاستخدام العملي المباشر",
      ],
      successCriteriaEn: [
        "Context and directives clarity score ≥ 75%",
        "Explicit constraints preventing ambiguous fluff",
        "Actionable output ready for immediate production",
      ],
    },
    learnCards,
    goldenExample,
    practice,
    rubric,
  };
}
