import { ALL_100_TRACKS, Track100, getTrackBySlug } from "@/content/tracks100";
import { allCourses, getCourseBySlug } from "@/content/courses";
import type { CourseDefinition, LessonContent, ModuleContent } from "@/content/course-types";
import type { Card } from "@/components/LessonPlayer";
import { generateUniversalTrackQuiz } from "./dynamic-quiz-engine";

export type UniversalLesson = {
  id: string;
  moduleId: string;
  dayNumber: number;
  title: string;
  titleAr: string;
  titleEn: string;
  durationMin: number;
  xp: number;
  order: number;
  isCheckpoint: boolean;
  videoUrl: string | null;
  cards: Card[];
  cardsAr: Card[];
  cardsEn: Card[];
  quiz: {
    id: string;
    type: "mcq" | "tf";
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  quizAr: {
    id: string;
    type: "mcq" | "tf";
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  quizEn: {
    id: string;
    type: "mcq" | "tf";
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
};

export type UniversalModule = {
  id: string;
  courseId: string;
  order: number;
  title: string;
  titleAr: string;
  titleEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  lessons: UniversalLesson[];
};

export type UniversalCourse = {
  id: string;
  slug: string;
  order: number;
  title: string;
  titleAr: string;
  titleEn: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  category: string;
  categoryAr: string;
  categoryEn: string;
  badge: string | null;
  level: string;
  levelAr: string;
  levelEn: string;
  totalLessons: number;
  totalXp: number;
  isComingSoon: boolean;
  accentFrom: string;
  accentTo: string;
  outcomesAr: string[];
  outcomesEn: string[];
  realityAr: string;
  realityEn: string;
  modules: UniversalModule[];
};

// Cache generated courses in memory for fast instant loading
const courseCache = new Map<string, UniversalCourse>();

/**
 * Bidirectional mapping bridging the 15 deep, handcrafted courses to their
 * corresponding modern English-kebab slugs in ALL_100_TRACKS.
 */
export const HANDCRAFTED_TO_TRACK_SLUG_MAP: Record<string, string> = {
  "tahaddi-28-yawm": "prompt-engineering-mastery",
  "ebni-mansetak": "building-launching-mvp",
  "el-3amal-el-horr": "zero-to-first-dollar-freelancer",
  "kalod-modeer-ebdaay": "creative-direction-pitching",
  "enta-fi-ay-makan": "ai-video-creation",
  "claude-lel-mashroaat": "ai-workplace-productivity",
  "bina-el-amal": "business-model-canvas-monetization",
  "nomo-mehany": "career-transitions-adaptability",
  "el-tasweeq-el-raqamy": "integrated-digital-marketing-strategy",
  "tahlil-el-bayanat": "data-driven-decision-making",
  "el-aman-el-raqamy": "personal-cyber-hygiene-opsec",
  "fan-el-tawasol": "art-of-persuasion-influence",
  "el-entagiya": "atomic-habits-relentless-focus",
  "namat-el-nagah": "growth-mindset-psychological-grit",
  "sehha-w-taqa": "energy-management-sleep-architecture",
};

export const TRACK_TO_HANDCRAFTED_SLUG_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(HANDCRAFTED_TO_TRACK_SLUG_MAP).map(([h, t]) => [t, h])
);

/**
 * Finds either a track from ALL_100_TRACKS or a handcrafted course from allCourses,
 * utilizing the bidirectional bridge so handcrafted depth powers the 100 catalog.
 */
export function findTrackOrHandcrafted(slug: string): { track?: Track100; handcrafted?: CourseDefinition } {
  let track = getTrackBySlug(slug);
  let handcrafted = getCourseBySlug(slug);

  // Cross-resolution via mapping bridge
  if (track && !handcrafted) {
    const pairedHandcraftedSlug = TRACK_TO_HANDCRAFTED_SLUG_MAP[slug];
    if (pairedHandcraftedSlug) {
      handcrafted = getCourseBySlug(pairedHandcraftedSlug);
    }
  } else if (handcrafted && !track) {
    const pairedTrackSlug = HANDCRAFTED_TO_TRACK_SLUG_MAP[slug];
    if (pairedTrackSlug) {
      track = getTrackBySlug(pairedTrackSlug);
    }
  }

  if (track || handcrafted) {
    return { track, handcrafted };
  }

  // Alias checks (e.g. Arabic slug variants)
  const fallbackTrack = ALL_100_TRACKS.find(
    (t) => t.slug === slug || t.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
  if (fallbackTrack) {
    const pairedHandcraftedSlug = TRACK_TO_HANDCRAFTED_SLUG_MAP[fallbackTrack.slug];
    const pairedHandcrafted = pairedHandcraftedSlug ? getCourseBySlug(pairedHandcraftedSlug) : undefined;
    return { track: fallbackTrack, handcrafted: pairedHandcrafted };
  }

  return {};
}

/**
 * Synthesizes a high-value, comprehensive curriculum for any of the 100 tracks.
 */
function synthesizeTrackCourse(track: Track100): UniversalCourse {
  const totalLessons = track.totalLessons || 24;
  const lessonsPerModule = Math.ceil(totalLessons / 4);

  const moduleBlueprints = [
    {
      titleAr: "الأسس والانطلاقة العملية الفورية",
      titleEn: "Foundations & Immediate Action Setup",
      descriptionAr: `فهم أصول ${track.titleAr}، تجهيز الأدوات، وتطبيق أول خطوة بدون تسويف.`,
      descriptionEn: `Understand the core principles of ${track.titleEn}, configure your workspace, and secure your Day 1 win.`,
      icon: "🧭",
    },
    {
      titleAr: "الترسانة التقنية والمهارات الجوهرية",
      titleEn: "Core Toolkit & Essential Techniques",
      descriptionAr: "تعلم الأوامر، النماذج، وسلاسل العمل الاحترافية المتبعة لدى أفضل الممارسين في العالم.",
      descriptionEn: "Master industry frameworks, prompts, automation recipes, and daily workflows.",
      icon: "⚡",
    },
    {
      titleAr: "المشاريع الواقعية والتنفيذ الشامل",
      titleEn: "Real-World Projects & Production Delivery",
      descriptionAr: "بناء نماذج أعمال حقيقية وملفات إنجاز تثبت كفاءتك أمام العملاء وسوق العمل.",
      descriptionEn: "Execute complete client-ready case studies and build a tangible portfolio of deliverables.",
      icon: "🛠️",
    },
    {
      titleAr: "تحقيق الدخل، التسويق، والاحتراف المستدام",
      titleEn: "Monetization, Client Acquisition & Sustainable Mastery",
      descriptionAr: "تحويل المهارة لعائد مادي حقيقي، تسعير خدماتك، وبناء عادات تدريب مستمرة بدون احتراق.",
      descriptionEn: "Monetize your expertise, price your services, acquire paying clients, and sustain long-term growth.",
      icon: "🚀",
    },
  ];

  let currentDay = 1;
  const modules: UniversalModule[] = moduleBlueprints.map((blueprint, mIdx) => {
    const moduleId = `mod-${track.slug}-${mIdx + 1}`;
    const moduleLessons: UniversalLesson[] = [];
    const countThisModule = Math.min(lessonsPerModule, totalLessons - currentDay + 1);

    for (let i = 0; i < countThisModule && currentDay <= totalLessons; i++) {
      const day = currentDay++;
      const isCheckpoint = day % 7 === 0 || day === totalLessons;
      const lessonId = `les-${track.slug}-${day}`;

      // Derive outcome focus
      const outcomeIndex = (day - 1) % track.outcomesAr.length;
      const outcomeAr = track.outcomesAr[outcomeIndex] || track.titleAr;
      const outcomeEn = track.outcomesEn[outcomeIndex] || track.titleEn;

      let titleAr = `يوم ${day}: خطوة عملية في ${track.titleAr}`;
      let titleEn = `Day ${day}: Practical Step in ${track.titleEn}`;

      if (day === 1) {
        titleAr = `اليوم الأول: خارطة طريق ${track.titleAr} وتثبيت الأساس`;
        titleEn = `Day 1: The ${track.titleEn} Roadmap & Core Setup`;
      } else if (day === totalLessons) {
        titleAr = `اليوم الأخير: تسليم المشروع والتخرج بشهادة إتمام رقمية موثقة`;
        titleEn = `Final Day: Project Capstone & Verifiable Completion Certificate`;
      } else if (isCheckpoint) {
        titleAr = `محطة المراجعة والتطبيق: قياس التطور في ${outcomeAr}`;
        titleEn = `Milestone Review: Progress Assessment in ${outcomeEn}`;
      } else {
        const subTopicsAr = [
          `تطبيق تقنية ${outcomeAr}`,
          `حل المعضلات الشائعة وسرعة التنفيذ`,
          `أتمتة الخطوات المكررة وتوفير الساعات`,
          `اختبار المخرجات وفق أعلى المعايير`,
          `دمج الأدوات في تدفق عمل واحد سلس`,
          `تجهيز نموذج العرض والمشاركة مع الفريق`,
        ];
        const subTopicsEn = [
          `Mastering: ${outcomeEn}`,
          `Overcoming Pitfalls & Execution Speed`,
          `Automating Repetitive Tasks & Saving Hours`,
          `Benchmarking Outputs with Industry Standards`,
          `Integrating Tools into One Cohesive Pipeline`,
          `Packaging Deliverables for Clients & Team`,
        ];
        const subIdx = (day - 2) % subTopicsAr.length;
        titleAr = `يوم ${day}: ${subTopicsAr[subIdx]}`;
        titleEn = `Day ${day}: ${subTopicsEn[subIdx]}`;
      }

      const moduleStepsAr = [
        [
          `١. افتح مساحة عملك وجهز بيئة التدريب لتطبيق "${outcomeAr}" في دقائق معدودة.`,
          `٢. ابدأ بنسخة أولية مبسطة تركز على المفهوم الجوهري وتمنحك أول إنجاز ملموس اليوم.`,
          `٣. دوّن ملاحظاتك الأولى عن المخرجات وقارنها بالمعايير المهنية المتبعة في ${track.titleAr}.`,
          `٤. ركّز على كسر حاجز البداية؛ 10 دقائق من التنفيذ الحقيقي تهزم ساعات من التردد والتنظير.`,
        ],
        [
          `١. ادمج الأدوات المتخصصة في ${track.titleAr} لبناء تدفق عمل شبه آلي حول "${outcomeAr}".`,
          `٢. طبّق أفضل الممارسات وضبط المتغيرات للحصول على مخرجات دقيقة وتجنب الهدر والبطء.`,
          `٣. احفظ الأوامر والقوالب الناجحة في مكتبتك الشخصية لتختصر وقت العمل في المستقبل.`,
          `٤. اختبر حدود الأداة واكتشف الحالات الاستثنائية لتبني فهماً عميقاً يتجاوز الاستخدام السطحي.`,
        ],
        [
          `١. حوّل تطبيقك لـ "${outcomeAr}" إلى جزء متكامل من مشروع حقيقي يحاكي طلبات سوق العمل.`,
          `٢. أجرِ اختباراً شاملاً للتأكد من خلو المخرج من الأخطاء وجاهزيته للعرض أمام العملاء.`,
          `٣. جهّز ملف التوثيق ودراسة الحالة التي تبرز القيمة العملية التي بنيتها بيدك.`,
          `٤. اطلب مراجعة أو قارن مخرجك بالنموذج الذهبي لتضمن وصولك لمستوى الاحتراف الكامل.`,
        ],
        [
          `١. حدد القيمة التجارية لـ "${outcomeAr}" وكيف تترجمها لعرض عمل أو تسعير مجزٍ للعملاء.`,
          `٢. صغ مقترحاً أو دراسة حالة تركز على حل المشكلات وخفض التكاليف للمستفيد النهائي.`,
          `٣. ضع نظاماً أسبوعياً لمتابعة تحديثات ${track.titleAr} وتطوير خدماتك باستمرار.`,
          `٤. وثّق إنجازاتك في بورتفوليو احترافي لتبني سمعة مهنية تجذب إليك أفضل الفرص.`,
        ],
      ];

      const moduleStepsEn = [
        [
          `1. Configure your workspace and eliminate setup friction to apply "${outcomeEn}" rapidly.`,
          `2. Build a minimal viable prototype focused strictly on the core mechanic for today's win.`,
          `3. Benchmark initial outputs against industry standards in ${track.titleEn}.`,
          `4. Value momentum over hesitation — 10 minutes of execution outperforms hours of overthinking.`,
        ],
        [
          `1. Integrate dedicated toolchains in ${track.titleEn} into an automated pipeline for "${outcomeEn}".`,
          `2. Calibrate parameters and apply production safeguards to ensure pristine output quality.`,
          `3. Save battle-tested templates and scripts into your vault to compound your daily velocity.`,
          `4. Stress-test edge cases to build architectural depth beyond superficial tool familiarity.`,
        ],
        [
          `1. Contextualize your work in "${outcomeEn}" into a client-grade deliverable addressing real needs.`,
          `2. Conduct end-to-end regression testing to ensure your build is deployment-ready.`,
          `3. Document architectural decisions and measurable metrics to construct an authoritative case study.`,
          `4. Audit outputs against the golden standard benchmark to ensure 100/100 workplace fidelity.`,
        ],
        [
          `1. Articulate the commercial ROI of "${outcomeEn}" to command premium service rates.`,
          `2. Frame proposals around quantifiable client risk reduction and operational cost savings.`,
          `3. Institute recurring weekly sprints to benchmark newly emerging updates in ${track.titleEn}.`,
          `4. Publish deliverables to your portfolio to build magnetic inbound professional reputation.`,
        ],
      ];

      const activeStepsAr = moduleStepsAr[Math.min(mIdx, moduleStepsAr.length - 1)];
      const activeStepsEn = moduleStepsEn[Math.min(mIdx, moduleStepsEn.length - 1)];

      const cardsAr: Card[] = [
        {
          type: "info",
          heading: `المفهوم الجوهري: ${outcomeAr}`,
          body: {
            lines: [
              `الهدف الأساسي من خطوة اليوم هو إتقان: ${outcomeAr}.`,
              `لا تحتاج لساعات طويلة من التنظير؛ القاعدة الذهبية هي التركيز على خطوة واحدة واضحة وقابلة للقياس والتنفيذ الفوري.`,
              `الأدوات والتقنيات تتغير باستمرار، لكن المبادئ المنهجية التي تكتسبها هنا تمنحك ميزة تنافسية دائمة في ${track.titleAr}.`,
            ],
            tools: [track.titleEn.split(" ")[0]],
          },
        },
        {
          type: "info",
          heading: `خطوات التنفيذ العملي خطوة بخطوة`,
          body: {
            lines: activeStepsAr,
          },
        },
        {
          type: "info",
          heading: `الحقيقة الواقعية وتجنب الفخاخ`,
          body: {
            lines: [
              `⚠️ تذكر دائماً: ${track.realityAr}`,
              `الشعور بالتردد أو الصعوبة في البداية طبيعي تماماً ويصيب كل من يتعلم مهارة جديدة ومتطورة.`,
              `الاستمرار اليومي لمدة 5 إلى 15 دقيقة يمنحك نتائج تراكمية مضاعفة 10 مرات مقارنة بحماس يوم واحد ينقطع بعده.`,
            ],
          },
        },
        {
          type: "task",
          heading: `تحدي اليوم التطبيقي (5 دقائق)`,
          body: {
            instructions: [
              `قم بتنفيذ تمرين اليوم العملي حول: "${outcomeAr}".`,
              `سجل النتيجة أو خذ لقطة شاشة لإنجازك لتثبيت العادة في عقلك وترسيخ المهارة.`,
              `اضغط على زر إتمام الكويز بالأسفل لتثبيت تقدمك وحصد نقاط الـ XP.`,
            ],
            prompt: `كيف أطبّق ${outcomeAr} بأفضل الممارسات المتبعة في عام 2026 في ${track.titleAr}؟`,
          },
        },
      ];

      const cardsEn: Card[] = [
        {
          type: "info",
          heading: `Core Concept: ${outcomeEn}`,
          body: {
            lines: [
              `The primary objective of today's lesson is mastering: ${outcomeEn}.`,
              `You do not need endless hours of theory; the proven standard is focused, measurable, and rapid execution.`,
              `While tools and software evolve constantly, the architectural thinking and workflow discipline you build here give you a permanent competitive edge in ${track.titleEn}.`,
            ],
            tools: [track.titleEn.split(" ")[0]],
          },
        },
        {
          type: "info",
          heading: `Step-by-Step Practical Blueprint`,
          body: {
            lines: activeStepsEn,
          },
        },
        {
          type: "info",
          heading: `Industry Reality & Pitfall Avoidance`,
          body: {
            lines: [
              `⚠️ Pro Reality Check: ${track.realityEn}`,
              `Feeling cognitive resistance or friction when adopting a new workflow is completely normal — it indicates real skill acquisition.`,
              `Consistent 5 to 15-minute daily focused practice yields 10x higher compounding returns than sporadic, exhausting marathon sessions.`,
            ],
          },
        },
        {
          type: "task",
          heading: `Today's Hands-on Challenge (5-10 Minutes)`,
          body: {
            instructions: [
              `Execute today's practical exercise focusing on: "${outcomeEn}".`,
              `Save your deliverable or screenshot your completed workflow to lock in muscle memory.`,
              `Click the quiz button below to test your understanding, lock in your progress, and claim your XP.`,
            ],
            prompt: `How do I apply ${outcomeEn} using modern industry best practices and automated workflows in ${track.titleEn}?`,
          },
        },
      ];

      const { quizAr, quizEn } = generateUniversalTrackQuiz({
        track,
        day,
        totalLessons,
        outcomeAr,
        outcomeEn,
        titleAr,
        titleEn,
        lessonId,
      });

      moduleLessons.push({
        id: lessonId,
        moduleId,
        dayNumber: day,
        title: titleAr,
        titleAr,
        titleEn,
        durationMin: 5 + (day % 4) * 2,
        xp: Math.round(track.totalXp / totalLessons),
        order: day,
        isCheckpoint,
        videoUrl: null,
        cards: cardsAr,
        cardsAr,
        cardsEn,
        quiz: quizAr,
        quizAr,
        quizEn,
      });
    }

    return {
      id: moduleId,
      courseId: track.slug,
      order: mIdx + 1,
      title: blueprint.titleAr,
      titleAr: blueprint.titleAr,
      titleEn: blueprint.titleEn,
      description: blueprint.descriptionAr,
      descriptionAr: blueprint.descriptionAr,
      descriptionEn: blueprint.descriptionEn,
      icon: blueprint.icon,
      lessons: moduleLessons,
    };
  });

  return {
    id: `course-${track.slug}`,
    slug: track.slug,
    order: track.order,
    title: track.titleAr,
    titleAr: track.titleAr,
    titleEn: track.titleEn,
    description: track.descriptionAr,
    descriptionAr: track.descriptionAr,
    descriptionEn: track.descriptionEn,
    icon: track.icon,
    category: track.pillarNameAr,
    categoryAr: track.pillarNameAr,
    categoryEn: track.pillarNameEn,
    badge: track.badgeTitleAr,
    level: track.levelAr,
    levelAr: track.levelAr,
    levelEn: track.levelEn,
    totalLessons,
    totalXp: track.totalXp,
    isComingSoon: false,
    accentFrom: track.accentFrom,
    accentTo: track.accentTo,
    outcomesAr: track.outcomesAr,
    outcomesEn: track.outcomesEn,
    realityAr: track.realityAr,
    realityEn: track.realityEn,
    modules,
  };
}

/**
 * Converts a handcrafted CourseDefinition into our UniversalCourse structure.
 */
function convertHandcrafted(def: CourseDefinition, matchingTrack?: Track100, requestedSlug?: string): UniversalCourse {
  const meta = def.meta;
  const finalSlug = requestedSlug || matchingTrack?.slug || meta.slug;
  const totalLessons = def.modules.flatMap((m) => m.lessons).length;
  const totalXp = def.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.xp, 0);

  const titleAr = matchingTrack?.titleAr || meta.title;
  const titleEn = matchingTrack?.titleEn || meta.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const descAr = matchingTrack?.descriptionAr || meta.description;
  const descEn = matchingTrack?.descriptionEn || `Comprehensive 28-day practical curriculum in ${titleEn}.`;
  const catAr = matchingTrack?.pillarNameAr || meta.category;
  const catEn = matchingTrack?.pillarNameEn || meta.category;

  const modules: UniversalModule[] = def.modules.map((m, mIdx) => {
    const moduleId = `mod-${finalSlug}-${mIdx + 1}`;
    const lessons: UniversalLesson[] = m.lessons.map((l, lIdx) => {
      const lessonId = `les-${finalSlug}-${l.day}`;
      const cardsAr: Card[] = [
        ...l.cards.map((c) => ({
          type: "info" as const,
          heading: c.heading,
          body: { lines: c.lines, tools: c.tools },
        })),
        {
          type: "task" as const,
          heading: "تحدي اليوم التطبيقي",
          body: { instructions: l.task.instructions, prompt: l.task.prompt },
        },
      ];

      const outcomeEn = matchingTrack?.outcomesEn?.[(l.day - 1) % (matchingTrack.outcomesEn.length || 1)] || titleEn;
      const realityEn = matchingTrack?.realityEn || "Focus on daily practical momentum over sporadic perfectionism.";

      const cardsEn: Card[] = [
        {
          type: "info",
          heading: `Core Concept · Day ${l.day}: ${outcomeEn}`,
          body: {
            lines: [
              `The primary objective of this session is mastering: ${outcomeEn}.`,
              `True capability comes from rapid, focused daily execution rather than passive observation.`,
              `Apply this technique step-by-step to maintain your daily compounding momentum in ${titleEn}.`,
            ],
            tools: l.cards[0]?.tools || [titleEn.split(" ")[0]],
          },
        },
        {
          type: "info",
          heading: `Step-by-Step Practical Blueprint`,
          body: {
            lines: [
              `1. Open your workspace and prepare your environment for today's objective.`,
              `2. Execute the workflow step-by-step, following modern industry standards.`,
              `3. Document your finished solution and reusable prompts in your personal vault for future reference.`,
              `4. Commit your output and move directly to the verification quiz below.`,
            ],
          },
        },
        {
          type: "info",
          heading: `Reality Check & Pro Insights`,
          body: {
            lines: [
              `⚠️ Pro Reality Check: ${realityEn}`,
              `Feeling cognitive resistance when adopting a new workflow is completely normal — it indicates real skill acquisition.`,
              `Consistent 15-minute daily focus outperforms sporadic marathon sessions every single time.`,
            ],
          },
        },
        {
          type: "task",
          heading: `Today's Practical Mission (5-10 Minutes)`,
          body: {
            instructions: [
              `Execute today's practical mission focusing on: "${outcomeEn}".`,
              `Capture your deliverable or save your output to solidify muscle memory.`,
              `Take the quick quiz below to solidify your retention and claim your XP.`,
            ],
            prompt: l.task.prompt || `How do I master ${outcomeEn} using modern best practices in 2026?`,
          },
        },
      ];

      const quizAr = l.quiz.map((q, qIdx) => ({
        id: `q-${lessonId}-${qIdx + 1}`,
        type: q.type,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }));

      const fallbackTrack: Track100 = matchingTrack ?? {
        id: 900 + (l.day % 50),
        slug: meta.slug,
        order: 1,
        pillarId: 1,
        pillarNameAr: meta.category,
        pillarNameEn: catEn,
        titleAr: meta.title,
        titleEn,
        descriptionAr: meta.description,
        descriptionEn: descEn,
        levelAr: "مبتدئ",
        levelEn: "Beginner",
        totalLessons,
        durationHours: 4,
        totalXp,
        icon: meta.icon,
        accentFrom: meta.accentFrom,
        accentTo: meta.accentTo,
        outcomesAr: meta.outcomes,
        outcomesEn: meta.outcomes,
        realityAr: meta.reality,
        realityEn: meta.reality,
        badgeTitleAr: meta.badge || "محترف معتمد",
        badgeTitleEn: "Certified Specialist",
      };

      const outcomeEnVal =
        fallbackTrack.outcomesEn[(l.day - 1) % (fallbackTrack.outcomesEn.length || 1)] || l.title;

      const dynamicEn = generateUniversalTrackQuiz({
        track: fallbackTrack,
        day: l.day,
        totalLessons,
        outcomeAr: l.title,
        outcomeEn: outcomeEnVal,
        titleAr: l.title,
        titleEn: `Day ${l.day}: ${fallbackTrack.titleEn}`,
        lessonId,
      });

      const quizEn = dynamicEn.quizEn;

      const lessonTitleEn = matchingTrack?.titleEn 
        ? `Day ${l.day}: Practical Step in ${matchingTrack.titleEn}` 
        : `Day ${l.day}: Practical Step in ${titleEn}`;

      return {
        id: lessonId,
        moduleId,
        dayNumber: l.day,
        title: l.title,
        titleAr: l.title,
        titleEn: lessonTitleEn,
        durationMin: l.durationMin,
        xp: l.xp,
        order: l.day,
        isCheckpoint: !!l.isCheckpoint,
        videoUrl: l.videoUrl || null,
        cards: cardsAr,
        cardsAr,
        cardsEn,
        quiz: quizAr,
        quizAr,
        quizEn,
      };
    });

    const moduleTitleEn = matchingTrack?.pillarNameEn
      ? `Module ${mIdx + 1}: ${matchingTrack.pillarNameEn}`
      : `Module ${mIdx + 1}: Foundations & Core Skills`;
    const moduleDescEn = `Core techniques and daily practical workflows for ${titleEn}.`;

    return {
      id: moduleId,
      courseId: meta.slug,
      order: mIdx + 1,
      title: m.title,
      titleAr: m.title,
      titleEn: moduleTitleEn,
      description: m.description,
      descriptionAr: m.description,
      descriptionEn: moduleDescEn,
      icon: m.icon,
      lessons,
    };
  });

  return {
    id: `course-${finalSlug}`,
    slug: finalSlug,
    order: matchingTrack?.order || 1,
    title: titleAr,
    titleAr,
    titleEn,
    description: descAr,
    descriptionAr: descAr,
    descriptionEn: descEn,
    icon: meta.icon,
    category: catAr,
    categoryAr: catAr,
    categoryEn: catEn,
    badge: meta.badge || matchingTrack?.badgeTitleAr || null,
    level: meta.level,
    levelAr: matchingTrack?.levelAr || "مبتدئ",
    levelEn: matchingTrack?.levelEn || "Beginner",
    totalLessons,
    totalXp,
    isComingSoon: false,
    accentFrom: meta.accentFrom,
    accentTo: meta.accentTo,
    outcomesAr: meta.outcomes,
    outcomesEn: matchingTrack?.outcomesEn || meta.outcomes,
    realityAr: meta.reality,
    realityEn: matchingTrack?.realityEn || meta.reality,
    modules,
  };
}

/**
 * Loads a course by slug. Guarantees a non-null return if the track exists in
 * either ALL_100_TRACKS or allCourses. Never throws 404 for any of the 100 tracks!
 */
export function loadUniversalCourse(slug: string): UniversalCourse | null {
  if (courseCache.has(slug)) {
    return courseCache.get(slug)!;
  }

  const { track, handcrafted } = findTrackOrHandcrafted(slug);

  if (!track && !handcrafted) {
    return null;
  }

  let course: UniversalCourse;
  if (handcrafted) {
    course = convertHandcrafted(handcrafted, track, slug);
  } else if (track) {
    course = synthesizeTrackCourse(track);
  } else {
    return null;
  }

  courseCache.set(slug, course);
  return course;
}

/**
 * Loads a specific lesson day for a given course slug.
 */
export function loadUniversalLesson(slug: string, dayNumber: number) {
  const course = loadUniversalCourse(slug);
  if (!course) return null;

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const lesson = allLessons.find((l) => l.dayNumber === dayNumber);
  if (!lesson) return null;

  const module = course.modules.find((m) => m.id === lesson.moduleId)!;
  const nextLesson = allLessons.find((l) => l.dayNumber === dayNumber + 1) || null;

  return {
    course,
    module,
    lesson,
    allLessons,
    nextLesson,
  };
}

/**
 * Returns all 100 courses.
 */
export function getAllUniversalCourses(): UniversalCourse[] {
  return ALL_100_TRACKS.map((t) => loadUniversalCourse(t.slug)!);
}
