import { loadUniversalCourse } from "@/lib/course-loader";

export type SkillNodeStatus = "locked" | "available" | "in_progress" | "mastered";

export type SkillNode = {
  id: string;
  nameAr: string;
  nameEn: string;
  domain: string;
  icon: string;
  level: number; // 1 = Fundamental, 2 = Core, 3 = Advanced, 4 = Mastery
  descriptionAr: string;
  descriptionEn: string;
  status: SkillNodeStatus;
  evidenceCount: number;
  score: number; // 0 to 100
  unlockedAtDay: number;
};

export type TrackSkillTree = {
  trackSlug: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  skills: SkillNode[];
  finalProjectTitleAr: string;
  finalProjectTitleEn: string;
  finalProjectUnlocked: boolean;
};

// Handcrafted rich skill trees for Hero Tracks
const HERO_SKILL_TREES: Record<string, Omit<TrackSkillTree, "skills"> & { skills: Omit<SkillNode, "status" | "evidenceCount" | "score">[] }> = {
  "tahaddi-28-yawm": {
    trackSlug: "tahaddi-28-yawm",
    titleAr: "تحدي الذكاء الاصطناعي وهندسة الأوامر",
    titleEn: "AI Prompt Engineering & Automation",
    icon: "🤖",
    finalProjectTitleAr: "مشروع التخرج: بناء نظام عمل ذكي متكامل ينفذ مهام شركة كاملة",
    finalProjectTitleEn: "Capstone: Enterprise Autonomous AI System Architecture",
    finalProjectUnlocked: false,
    skills: [
      {
        id: "ai-context-framing",
        nameAr: "تأطير السياق والبيئة (Context Framing)",
        nameEn: "Context & Domain Framing",
        domain: "ai",
        icon: "🧭",
        level: 1,
        descriptionAr: "تحديد بيئة العمل والجمهور المستهدف بدقة لمنع الإجابات العامة السطحية.",
        descriptionEn: "Defining the environment and target audience to eliminate generic outputs.",
        unlockedAtDay: 1,
      },
      {
        id: "ai-role-architecture",
        nameAr: "تقمص الشخصيات الخبيرة (Role Persona)",
        nameEn: "Expert Persona Architecture",
        domain: "ai",
        icon: "🎭",
        level: 1,
        descriptionAr: "تعيين هوية خبير متخصص في مجال محدد لاستخراج مخرجات مهنية عالية.",
        descriptionEn: "Instantiating top-tier domain specialist personas for executive responses.",
        unlockedAtDay: 3,
      },
      {
        id: "ai-constraints-negative",
        nameAr: "القيود والاستبعاد السلبي (Negative Constraints)",
        nameEn: "Constraint & Negative Prompting",
        domain: "ai",
        icon: "🛡️",
        level: 2,
        descriptionAr: "وضع حدود صارمة لما يجب تجنبه كالمصطلحات المبتذلة والحشو.",
        descriptionEn: "Setting strict boundary rules and avoiding platitudes or fluff.",
        unlockedAtDay: 6,
      },
      {
        id: "ai-few-shot-examples",
        nameAr: "هندسة الأمثلة التوجيهية (Few-Shot Prompting)",
        nameEn: "Few-Shot Examples Engineering",
        domain: "ai",
        icon: "🎯",
        level: 2,
        descriptionAr: "تدريب النموذج على أمثلة واقعية (Input -> Output) لضبط النبرة والشكل.",
        descriptionEn: "Guiding LLMs with concrete high-fidelity input-output benchmarks.",
        unlockedAtDay: 9,
      },
      {
        id: "ai-structured-schemas",
        nameAr: "هندسة المخرجات المنظمة (Schema & Markdown)",
        nameEn: "Output Schema & Data Structuring",
        domain: "ai",
        icon: "📋",
        level: 3,
        descriptionAr: "إجبار النموذج على الرد بجداول، ملفات JSON، أو تقارير مهنية جاهزة للتنفيذ.",
        descriptionEn: "Enforcing markdown tables, JSON contracts, and executive ready briefs.",
        unlockedAtDay: 13,
      },
      {
        id: "ai-prompt-debugging",
        nameAr: "تنقيح الأوامر ومعالجة الهلاوس (Prompt Debugging)",
        nameEn: "Prompt Debugging & Hallucination Guardrails",
        domain: "ai",
        icon: "🔍",
        level: 3,
        descriptionAr: "فحص مخرجات الذكاء واكتشاف الأخطاء وتصحيحها بسلسلة مراجعة ذاتية.",
        descriptionEn: "Auditing LLM outputs and deploying self-correction validation loops.",
        unlockedAtDay: 17,
      },
      {
        id: "ai-multi-agent-chains",
        nameAr: "سلاسل الوكلاء المتعددة (Agent Workflows)",
        nameEn: "Multi-Agent Workflow Delegation",
        domain: "ai",
        icon: "⚡",
        level: 4,
        descriptionAr: "ربط عدة مهام ذكية معاً لتنفيذ مشروع معقد من الفكرة إلى التسليم النهائي.",
        descriptionEn: "Chaining specialized prompt agents to execute complex production pipelines.",
        unlockedAtDay: 22,
      },
    ],
  },
  "zero-to-first-dollar-freelancer": {
    trackSlug: "zero-to-first-dollar-freelancer",
    titleAr: "العمل الحر واقتناص أول عميل",
    titleEn: "Freelancing: Zero to First Paid Client",
    icon: "💼",
    finalProjectTitleAr: "مشروع التخرج: إرسال مقترح عمل حقيقي لعميل دولي وتأمين الدفعة الأولى",
    finalProjectTitleEn: "Capstone: Live International Client Pitch & Proposal Deal Close",
    finalProjectUnlocked: false,
    skills: [
      {
        id: "free-niche-definition",
        nameAr: "تحديد التخصص المربح (High-Ticket Niche)",
        nameEn: "High-Ticket Niche Positioning",
        domain: "freelance",
        icon: "🎯",
        level: 1,
        descriptionAr: "التركيز على مشكلة تجارية محددة يدفع فيها العملاء بسخاء.",
        descriptionEn: "Targeting high-urgency business problems clients pay top dollar to solve.",
        unlockedAtDay: 1,
      },
      {
        id: "free-profile-hook",
        nameAr: "صياغة بروفايل جذاب (Irresistible Profile)",
        nameEn: "Client-Attracting Profile Architecture",
        domain: "freelance",
        icon: "✨",
        level: 1,
        descriptionAr: "كتابة عنوان ونبذة احترافية تركز على نتائج العميل بدلاً من سيرتك الذاتية.",
        descriptionEn: "Crafting a results-driven headline and bio that converts visitors into leads.",
        unlockedAtDay: 3,
      },
      {
        id: "free-proposal-architecture",
        nameAr: "هندسة عروض العمل الرابحة (Winning Proposals)",
        nameEn: "High-Converting Proposal Framework",
        domain: "freelance",
        icon: "📝",
        level: 2,
        descriptionAr: "كتابة أول سطرين يجبران العميل على فتح المقترح وتجاوز المنافسين.",
        descriptionEn: "Engineering scroll-stopping proposal openings that secure interviews.",
        unlockedAtDay: 7,
      },
      {
        id: "free-pricing-packaging",
        nameAr: "تسعير وباقات الخدمات (Value-Based Pricing)",
        nameEn: "Value-Based Packaging & Pricing",
        domain: "freelance",
        icon: "💰",
        level: 2,
        descriptionAr: "الابتعاد عن التسعير بالساعة وبيع باقات مخرجات واضحة المعالم.",
        descriptionEn: "Moving away from hourly rates into value-based deliverable tiers.",
        unlockedAtDay: 12,
      },
      {
        id: "free-contracts-protection",
        nameAr: "الحماية القانونية ومنع المماطلة (Contracts & Scope)",
        nameEn: "Contract Security & Scope Creep Protection",
        domain: "freelance",
        icon: "⚖️",
        level: 3,
        descriptionAr: "استخدام بنود وشروط قانونية تحمي أتعابك وتمنع التعديلات اللانهائية.",
        descriptionEn: "Deploying ironclad terms stopping infinite revisions and payment delays.",
        unlockedAtDay: 16,
      },
      {
        id: "free-client-retention",
        nameAr: "تحويل العميل إلى تعاقد شهري (Client Retainer)",
        nameEn: "Client Retention & Monthly Retainers",
        domain: "freelance",
        icon: "🤝",
        level: 4,
        descriptionAr: "بناء علاقة طويلة الأمد تضمن تدفقاً مالياً متكرراً كل شهر.",
        descriptionEn: "Transforming one-off projects into recurring stable monthly retainers.",
        unlockedAtDay: 21,
      },
    ],
  },
  "high-converting-copywriting": {
    trackSlug: "high-converting-copywriting",
    titleAr: "كتابة النصوص الإعلانية والإقناع",
    titleEn: "High-Converting Copywriting & Psychology",
    icon: "📈",
    finalProjectTitleAr: "مشروع التخرج: إطلاق صفحة هبوط إعلانية كاملة بنصوص تقنع المشتري",
    finalProjectTitleEn: "Capstone: High-Converting Sales Funnel Launch Campaign",
    finalProjectUnlocked: false,
    skills: [
      {
        id: "copy-pain-extraction",
        nameAr: "استخراج مخاوف ورغبات العميل (Pain Research)",
        nameEn: "Customer Pain & Desire Mining",
        domain: "marketing",
        icon: "🧠",
        level: 1,
        descriptionAr: "فهم الكلمات التي يستخدمها العميل للتعبير عن ألمه الحقيقي.",
        descriptionEn: "Excavating the exact emotional language prospects use to describe friction.",
        unlockedAtDay: 1,
      },
      {
        id: "copy-hooks-attention",
        nameAr: "خطافات جذب الانتباه (Scroll-Stopping Hooks)",
        nameEn: "Scroll-Stopping Hook Engineering",
        domain: "marketing",
        icon: "🪝",
        level: 1,
        descriptionAr: "كتابة أول 3 ثوانٍ تجبر القارئ على التوقف عن تقليب الشاشة.",
        descriptionEn: "Crafting irresistible opening sentences that capture immediate focus.",
        unlockedAtDay: 4,
      },
      {
        id: "copy-persuasion-frameworks",
        nameAr: "أطر الإقناع الكلاسيكية (AIDA & PAS)",
        nameEn: "Psychological Persuasion Frameworks",
        domain: "marketing",
        icon: "📐",
        level: 2,
        descriptionAr: "بناء مسار منطقي ينقل القارئ من الانتباه إلى الرغبة ثم الفعل.",
        descriptionEn: "Structuring seamless narrative flows moving prospects from interest to purchase.",
        unlockedAtDay: 8,
      },
      {
        id: "copy-objection-crushing",
        nameAr: "إسقاط الاعتراضات والضمانات (Risk Reversal)",
        nameEn: "Objection Crushing & Risk Reversal",
        domain: "marketing",
        icon: "🛡️",
        level: 3,
        descriptionAr: "الإجابة عن كل شكوك المشتري وتقديم ضمان يزيل أي مخاطرة.",
        descriptionEn: "Neutralizing skepticism with evidence, social proof, and bold guarantees.",
        unlockedAtDay: 14,
      },
      {
        id: "copy-call-to-action",
        nameAr: "دعوة الشراء التي لا تُقاوم (Irresistible CTA)",
        nameEn: "High-Converting Action Triggers",
        domain: "marketing",
        icon: "🚀",
        level: 3,
        descriptionAr: "صياغة زر شراء يوضح القيمة الفورية ويدفع لاتخاذ القرار.",
        descriptionEn: "Triggering frictionless purchase actions with clear immediate value.",
        unlockedAtDay: 19,
      },
    ],
  },
};

/**
 * Resolves the Skill Tree for any track (handcrafted or universal),
 * calculating status (Locked, Available, In Progress, Mastered) based on completed day numbers.
 */
export function getTrackSkillTree(
  trackSlug: string,
  completedDayNumbers: number[] = [],
  currentDayNumber: number = 1
): TrackSkillTree {
  const completedSet = new Set(completedDayNumbers);

  // Check for handcrafted definition or generate dynamically from course content
  let heroTree = HERO_SKILL_TREES[trackSlug];

  if (!heroTree) {
    const course = loadUniversalCourse(trackSlug);
    if (course) {
      const skillsFromModules =
        course.modules && course.modules.length > 0
          ? course.modules.slice(0, 5).map((m, idx) => ({
              id: `skill-${trackSlug}-${m.id || idx + 1}`,
              nameAr: m.titleAr || m.title,
              nameEn: m.titleEn || `Core Competency ${idx + 1}`,
              domain: course.categoryAr || "general",
              icon: m.icon || course.icon || "⚡",
              level: Math.min(idx + 1, 4),
              descriptionAr:
                m.descriptionAr ||
                `إتقان وتطبيق تقنيات ${m.titleAr || course.titleAr} على سيناريوهات عمل واقعية.`,
              descriptionEn:
                m.descriptionEn ||
                `Mastering core workflows of ${m.titleEn || course.titleEn} in real scenarios.`,
              unlockedAtDay: m.lessons[0]?.dayNumber || idx * 5 + 1,
            }))
          : [];

      const generatedSkills =
        skillsFromModules.length > 0
          ? skillsFromModules
          : [
              {
                id: `skill-${trackSlug}-fundamentals`,
                nameAr: `الأساسيات والمفاهيم الجوهرية لـ ${course.titleAr}`,
                nameEn: `Foundations of ${course.titleEn}`,
                domain: course.categoryAr || "general",
                icon: course.icon || "🧭",
                level: 1,
                descriptionAr: `بناء الفهم الجوهري لمنظومة ${course.titleAr} والبدء في التطبيق العملي.`,
                descriptionEn: `Building foundational mastery of ${course.titleEn} and practical start.`,
                unlockedAtDay: 1,
              },
              {
                id: `skill-${trackSlug}-workflow`,
                nameAr: `إتقان بيئة العمل والأدوات التنفيذية`,
                nameEn: `Workflow & Tool Mastery`,
                domain: course.categoryAr || "general",
                icon: "🛠️",
                level: 2,
                descriptionAr: `التعامل مع الأدوات المتخصصة بكفاءة وسرعة لتنفيذ المهام المطلوبة.`,
                descriptionEn: `Executing workflows and specialized tooling with speed and accuracy.`,
                unlockedAtDay: 5,
              },
              {
                id: `skill-${trackSlug}-advanced`,
                nameAr: `التطبيق المتقدم وحل المشكلات المعقدة`,
                nameEn: `Advanced Problem Solving`,
                domain: course.categoryAr || "general",
                icon: "📐",
                level: 3,
                descriptionAr: `حل التحديات غير التقليدية وتطبيق أفضل الممارسات المعتمدة في السوق.`,
                descriptionEn: `Overcoming complex edge-cases using production-level best practices.`,
                unlockedAtDay: 12,
              },
              {
                id: `skill-${trackSlug}-automation`,
                nameAr: `هندسة الأنظمة وضبط الجودة الشاملة`,
                nameEn: `System Architecture & Quality Control`,
                domain: course.categoryAr || "general",
                icon: "⚙️",
                level: 4,
                descriptionAr: `بناء مخرجات متكاملة تخضع لمعايير الجودة الصارمة وجاهزة للعرض للعملاء.`,
                descriptionEn: `Constructing verified deliverables matching executive client standards.`,
                unlockedAtDay: 18,
              },
            ];

      heroTree = {
        trackSlug,
        titleAr: course.titleAr || course.title,
        titleEn: course.titleEn || course.title,
        icon: course.icon || "⚡",
        finalProjectTitleAr: `مشروع التخرج: إنجاز ملف عمل متكامل وموثق في ${course.titleAr}`,
        finalProjectTitleEn: `Capstone: Production Deliverable in ${course.titleEn}`,
        finalProjectUnlocked: false,
        skills: generatedSkills,
      };
    } else {
      heroTree = HERO_SKILL_TREES["tahaddi-28-yawm"];
    }
  }

  // Calculate status for each node
  const computedSkills: SkillNode[] = heroTree.skills.map((skill, index) => {
    // Condition for Mastered: user has completed the day where this skill is tested
    const isMastered = completedSet.has(skill.unlockedAtDay);

    // Condition for In Progress: current day matches or is close
    const isInProgress = !isMastered && (currentDayNumber >= skill.unlockedAtDay || index === 0);

    // Condition for Available: previous skill mastered or is first skill
    const previousSkill = index > 0 ? heroTree.skills[index - 1] : null;
    const isAvailable = index === 0 || (previousSkill && completedSet.has(previousSkill.unlockedAtDay));

    let status: SkillNodeStatus = "locked";
    if (isMastered) status = "mastered";
    else if (isInProgress) status = "in_progress";
    else if (isAvailable) status = "available";

    return {
      ...skill,
      status,
      evidenceCount: isMastered ? 1 : 0,
      score: isMastered ? 92 : isInProgress ? 45 : 0,
    };
  });

  const allSkillsMastered = computedSkills.every((s) => s.status === "mastered");

  return {
    trackSlug,
    titleAr: heroTree.titleAr,
    titleEn: heroTree.titleEn,
    icon: heroTree.icon,
    skills: computedSkills,
    finalProjectTitleAr: heroTree.finalProjectTitleAr,
    finalProjectTitleEn: heroTree.finalProjectTitleEn,
    finalProjectUnlocked: allSkillsMastered,
  };
}

/**
 * Finds the currently targeted skill for a given day in a track.
 */
export function getCurrentTargetSkill(tree: TrackSkillTree, dayNumber: number): SkillNode {
  // Find the skill closest to this day
  const matching = [...tree.skills].reverse().find((s) => s.unlockedAtDay <= dayNumber);
  return matching || tree.skills[0];
}

/**
 * Finds if the student has a weak skill that needs reinforcement.
 */
export function getWeakSkill(tree: TrackSkillTree): SkillNode | null {
  // If an in_progress skill exists, return it as the focus area
  const inProgress = tree.skills.find((s) => s.status === "in_progress");
  if (inProgress) return inProgress;
  return null;
}
