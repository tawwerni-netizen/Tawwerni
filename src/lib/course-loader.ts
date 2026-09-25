import { ALL_100_TRACKS, Track100, getTrackBySlug } from "@/content/tracks100";
import { allCourses, getCourseBySlug } from "@/content/courses";
import type { CourseDefinition, LessonContent, ModuleContent } from "@/content/course-types";
import type { Card } from "@/components/LessonPlayer";

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
 * Finds either a track from ALL_100_TRACKS or a handcrafted course from allCourses.
 */
export function findTrackOrHandcrafted(slug: string): { track?: Track100; handcrafted?: CourseDefinition } {
  const track = getTrackBySlug(slug);
  const handcrafted = getCourseBySlug(slug);

  if (track || handcrafted) {
    return { track, handcrafted };
  }

  // Alias checks (e.g. Arabic slug variants)
  const fallbackTrack = ALL_100_TRACKS.find(
    (t) => t.slug === slug || t.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
  );
  if (fallbackTrack) {
    return { track: fallbackTrack };
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
        titleAr = `اليوم الأخير: تسليم المشروع والتخرج بشهادة معتمدة`;
        titleEn = `Final Day: Project Capstone & Official Certification`;
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
            lines: [
              `١. افتح مساحة عملك وحدد النتيجة المستهدفة بدقة قبل أن تبدأ في استخدام أي أداة.`,
              `٢. طبّق التكنيك خطوة بخطوة مع مراعاة أعلى معايير الجودة وسرعة الإنجاز.`,
              `٣. وثّق ما نفذته وما تعلمته في ملف إنجازك الشخصي لترجع إليه وقت الحاجة.`,
              `٤. لا تبحث عن الكمال الزائف؛ الإنجاز المكتمل بنسبة 80% أفضل بكثير من خطة مثالية لم تُنفّذ.`,
            ],
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
            prompt: `كيف أطبّق ${outcomeAr} بأفضل الممارسات المتبعة في عام 2026؟`,
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
            lines: [
              `1. Open your workspace and clearly define the exact target deliverable for ${outcomeEn} before touching any tool.`,
              `2. Apply the technique step-by-step, prioritizing high production quality, speed, and real-world utility.`,
              `3. Document your finished solution and reusable prompts in your personal portfolio for future reuse.`,
              `4. Prioritize momentum over perfection — an 80% complete, executed deliverable beats an unexecuted plan every time.`,
            ],
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
            prompt: `How do I apply ${outcomeEn} using modern industry best practices and automated workflows?`,
          },
        },
      ];

      const quizAr = [
        {
          id: `q-${lessonId}-1`,
          type: "mcq" as const,
          question: `ما هو المبدأ الأساسي للنجاح في تطبيق درس اليوم (${titleAr})؟`,
          options: [
            "التركيز على إنجاز خطوة عملية ملموسة بدلاً من الانتظار المثالي",
            "محاولة حفظ كل التفاصيل النظرية دون أي تطبيق عملي",
            "شراء جميع الأدوات المدفوعة قبل البدء بأي خطوة",
            "قضاء أيام كاملة في التخطيط دون كتابة سطر واحد",
          ],
          correctIndex: 0,
          explanation:
            "التطبيق السريع والمستمر هو جوهر التعلم الحقيقي؛ النتيجة الملموسة تبني الثقة وتمنحك تقدماً فورياً.",
        },
        {
          id: `q-${lessonId}-2`,
          type: "tf" as const,
          question: `الاستمرار في التعلم لـ 5 إلى 15 دقيقة يومياً يبني مهارة احترافية مستدامة أكثر من جلسات التعلم المتباعدة والمكثفة.`,
          options: ["صح", "غلط"],
          correctIndex: 0,
          explanation:
            "صحيح تماماً، الأثر التراكمي للعادة اليومية يعيد برمجة المسارات العصبية ويمنع التشتت والاحتراق النفسي.",
        },
      ];

      const quizEn = [
        {
          id: `q-${lessonId}-1`,
          type: "mcq" as const,
          question: `What is the core principle for mastering today's lesson on ${titleEn}?`,
          options: [
            "Focusing on tangible, rapid execution and measurable output over perfectionism",
            "Memorizing theoretical terminology without applying practical exercises",
            "Purchasing enterprise software before understanding the foundational workflow",
            "Spending days in planning meetings without creating a single deliverable",
          ],
          correctIndex: 0,
          explanation:
            "Consistent, rapid application is the cornerstone of true mastery. Tangible results build confidence and momentum.",
        },
        {
          id: `q-${lessonId}-2`,
          type: "tf" as const,
          question: `Consistent daily practice of 5 to 15 minutes builds far stronger expertise than sporadic, intensive study sessions.`,
          options: ["True", "False"],
          correctIndex: 0,
          explanation:
            "True! Daily spaced repetition strengthens neural pathways, prevents burnout, and ensures lifelong retention.",
        },
      ];

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
function convertHandcrafted(def: CourseDefinition, matchingTrack?: Track100): UniversalCourse {
  const meta = def.meta;
  const totalLessons = def.modules.flatMap((m) => m.lessons).length;
  const totalXp = def.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.xp, 0);

  const titleAr = matchingTrack?.titleAr || meta.title;
  const titleEn = matchingTrack?.titleEn || meta.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const descAr = matchingTrack?.descriptionAr || meta.description;
  const descEn = matchingTrack?.descriptionEn || `Comprehensive 28-day practical curriculum in ${titleEn}.`;
  const catAr = matchingTrack?.pillarNameAr || meta.category;
  const catEn = matchingTrack?.pillarNameEn || meta.category;

  const modules: UniversalModule[] = def.modules.map((m, mIdx) => {
    const moduleId = `mod-${meta.slug}-${mIdx + 1}`;
    const lessons: UniversalLesson[] = m.lessons.map((l, lIdx) => {
      const lessonId = `les-${meta.slug}-${l.day}`;
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

      const quizEn = [
        {
          id: `q-${lessonId}-1`,
          type: "mcq" as const,
          question: `What is the most effective approach to mastering Day ${l.day} in ${titleEn}?`,
          options: [
            "Executing the hands-on practical task immediately and consistently",
            "Postponing execution until all theoretical edge-cases are memorized",
            "Relying on passive reading without building real deliverables",
            "Skipping daily practice in favor of occasional intensive cramming",
          ],
          correctIndex: 0,
          explanation: "Consistent, active application ensures immediate skill retention and measurable progress.",
        },
        {
          id: `q-${lessonId}-2`,
          type: "tf" as const,
          question: `Consistent daily practice of 5 to 15 minutes builds far stronger expertise than sporadic study marathons.`,
          options: ["True", "False"],
          correctIndex: 0,
          explanation: "True! Spaced repetition and daily momentum strengthen neural retention and eliminate friction.",
        },
      ];

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
    id: `course-${meta.slug}`,
    slug: meta.slug,
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
    course = convertHandcrafted(handcrafted, track);
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
