import { loadUniversalLesson, findTrackOrHandcrafted } from "@/lib/course-loader";
import { getTrackSkillTree, getCurrentTargetSkill, SkillNode } from "@/content/skill-trees";

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

  // Derive tangible deliverable and objectives based on track & day
  let deliverableAr = `صياغة مخرج عملي متكامل يطبق مهارة ${targetSkill.nameAr}`;
  let deliverableEn = `Production deliverable applying ${targetSkill.nameEn}`;
  let accomplishAr = `إتقان ${targetSkill.nameAr} وتطبيقها على مهمة واقعية مباشرة دون تنظير.`;
  let accomplishEn = `Mastering ${targetSkill.nameEn} and applying it directly to a production task.`;

  // Specific high-impact mappings for hero tracks
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
  } else if (slug === "zero-to-first-dollar-freelancer") {
    if (dayNumber === 1) {
      accomplishAr = "تحديد تخصصك الدقيق وتحديد المشكلة التي يدفع العملاء لحلها فوراً.";
      deliverableAr = "بيان تحديد التخصص والقيمة (Niche Statement) من سطرين يوضح مجالك وجمهورك.";
    } else if (dayNumber === 7) {
      accomplishAr = "هندسة مقترح عمل رابح على Upwork يجبر العميل على بدء المقابلة.";
      deliverableAr = "مسودة مقترح عمل (Proposal Hook) مخصصة لوظيفة حقيقية مع معالجة مخاوف العميل.";
    }
  }

  // Golden standard example
  const goldenExample = {
    titleAr: `النموذج الذهبي المعياري لمهمة اليوم:`,
    titleEn: `Golden Standard Reference Benchmark:`,
    content: lesson.quiz[0]?.explanation || [
      `[الدور]: أنت كبير مستشاري استراتيجيات الأعمال بخبرة 15 عاماً في قيادة نمو الشركات.`,
      `[المهمة]: قم بتحليل البيانات المرفقة واستخرج أهم 3 فرص نمو غير مستغلة.`,
      `[القيود]: ممنوع استخدام المصطلحات الإنشائية العامة، ركّز فقط على أرقام قابلة للقياس، واذكر المخاطر المحتملة لكل فرصة.`,
      `[المخرج]: جدول مقارنة من 4 أعمدة (الفرصة، العائد المتوقع، المخاطر، خطوة البداية اليوم).`,
    ].join("\n"),
    explanationAr: "لاحظ كيف يحتوي النموذج على هوية محددة، مهمة مباشرة، قيود سلبية تمنع السطحية، وشكل إخراج نهائي واضح تماماً.",
    explanationEn: "Notice the clear persona instantiation, direct directive, negative constraints, and explicit output schema.",
  };

  // Practice specifications
  const practice = {
    instructionsAr: [
      "اقرأ النموذج الذهبي أعلاه جيداً ولاحظ هيكل الصياغة.",
      "افتح مساحة العمل أدناه وطبّق المهارة على مجال عملك أو تخصصك الحقيقي.",
      "تأكد من توافر معايير التقييم المعلنة (الوضوح، القيود، وتحديد المخرج).",
      "اضغط زر «إرسال للتفتيش والتقييم الذكي» لتحصل على مراجعة فورية لمستواك.",
    ],
    instructionsEn: [
      "Review the golden standard above and examine its structural components.",
      "Use the workspace below to apply this exact skill to your own domain.",
      "Ensure all published rubric criteria are fulfilled before submission.",
      "Click 'Submit for AI Evaluation' to receive instant structured feedback.",
    ],
    starterTemplate: `[السياق والمجال]: اكتب هنا مجالك وسياق المهمة...\n[الدور المطلوب]: عين هوية الخبير...\n[المهمة الأساسية]: وضح المطلوب بدقة...\n[القيود الصارمة]: اذكر ما يجب تجنبه...\n[صيغة المخرج النهائي]: حدد شكل الإجابة...`,
    placeholderAr: "اكتب هنا مخرجك العملي التطبيقي للمهمة (البرومبت، العرض، المسودة، أو الكود)...",
    placeholderEn: "Write your tangible mission deliverable here (prompt, proposal, copy, or code)...",
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
    titleAr: lesson.titleAr,
    titleEn: lesson.titleEn,
    estimatedMinutes: Math.max(10, lesson.durationMin || 12),
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
