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
  quiz: {
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

      const cards: Card[] = [
        {
          type: "info",
          heading: `المفهوم الجوهري · Core Concept`,
          body: {
            lines: [
              `الهدف من خطوة اليوم هو إتقان: ${outcomeAr}.`,
              `لا تحتاج لساعات طويلة؛ القاعدة هي التركيز على خطوة واحدة واضحة وقابلة للقياس.`,
              `الأدوات تتغير باستمرار، لكن المبادئ المنهجية التي تتعلمها هنا ستمنحك ميزة تنافسية دائمة.`,
            ],
            tools: [track.titleEn.split(" ")[0]],
          },
        },
        {
          type: "info",
          heading: `خطوات التنفيذ العملي · Step-by-Step Execution`,
          body: {
            lines: [
              `١. افتح مساحة عملك وحدد النتيجة المستهدفة بدقة قبل أن تبدأ.`,
              `٢. طبّق التكنيك خطوة بخطوة مع مراعاة الجودة وسرعة الإنجاز.`,
              `٣. وثّق ما تعلمته في ملف إنجازك الشخصي لترجع إليه وقت الحاجة.`,
              `٤. لا تبحث عن الكمال؛ الإنجاز المكتمل بنسبة 80% أفضل بكثير من خطة مثالية لم تُنفّذ.`,
            ],
          },
        },
        {
          type: "info",
          heading: `الحقيقة الواقعية وتجنب الفخاخ · Reality Check`,
          body: {
            lines: [
              `⚠️ تذكر دائماً: ${track.realityAr}`,
              `الشعور بالتردد أو الصعوبة في البداية طبيعي تماماً ويصيب كل من يتعلم مهارة جديدة.`,
              `الاستمرار اليومي لمدة 5 دقائق يعطيك نتائج مضاعفة 10 مرات مقارنة بحماس يوم واحد ينقطع بعده.`,
            ],
          },
        },
        {
          type: "task",
          heading: `تحدي اليوم التطبيقي (5 دقائق)`,
          body: {
            instructions: [
              `قم بتنفيذ تمرين اليوم العملي حول: "${outcomeAr}".`,
              `سجل النتيجة أو خذ لقطة شاشة لإنجازك لتثبيت العادة في عقلك.`,
              `اضغط على زر إتمام الكويز بالأسفل لتثبيت تقدمك وحصد نقاط الـ XP.`,
            ],
            prompt: `كيف أطبّق ${outcomeAr} بأفضل الممارسات المتبعة في عام 2026؟`,
          },
        },
      ];

      const quiz = [
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
        cards,
        quiz,
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
      const cards: Card[] = [
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

      return {
        id: lessonId,
        moduleId,
        dayNumber: l.day,
        title: l.title,
        titleAr: l.title,
        titleEn: `Day ${l.day}: ${l.title}`,
        durationMin: l.durationMin,
        xp: l.xp,
        order: l.day,
        isCheckpoint: !!l.isCheckpoint,
        videoUrl: l.videoUrl || null,
        cards,
        quiz: l.quiz.map((q, qIdx) => ({
          id: `q-${lessonId}-${qIdx + 1}`,
          type: q.type,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        })),
      };
    });

    return {
      id: moduleId,
      courseId: meta.slug,
      order: mIdx + 1,
      title: m.title,
      titleAr: m.title,
      titleEn: `Module ${mIdx + 1}: ${m.title}`,
      description: m.description,
      descriptionAr: m.description,
      descriptionEn: m.description,
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
