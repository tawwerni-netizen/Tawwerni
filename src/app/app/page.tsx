import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak, getWeekDays } from "@/lib/xp";
import { brand } from "@/content/brand";
import { approvedCourseIds } from "@/lib/access";
import WeekDot from "@/components/WeekDot";
import HelpCard from "@/components/HelpCard";
import CourseTile from "@/components/CourseTile";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "صباح الخير";
  if (hour < 18) return "مساء النور";
  return "مساء الخير";
}

export default async function AppHomePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId: user.id },
    include: { lesson: { include: { module: true } } },
    orderBy: { completedAt: "desc" },
  });

  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));
  const weekDays = getWeekDays(completions.map((c) => c.completedAt));
  const completedLessonIds = new Set(completions.map((c) => c.lessonId));

  const courses = await prisma.course.findMany({
    where: { isComingSoon: false },
    orderBy: { order: "asc" },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });

  /*
   * "Today's task" follows the learner, not a hardcoded slug.
   *
   * It used to always be the AI course even for somebody who had been working
   * through the business track for a week — the card pointed at a course they
   * weren't taking. Now it picks up wherever they last left off.
   */
  const lastCourseId = completions[0]?.lesson.module.courseId;
  const active = courses.find((c) => c.id === lastCourseId) ?? courses[0];

  const unlockedIds = await approvedCourseIds(user.id);

  const tiles = courses.map((c) => {
    const lessons = c.modules.flatMap((m) => m.lessons);
    const done = lessons.filter((l) => completedLessonIds.has(l.id)).length;
    return {
      slug: c.slug,
      title: c.title,
      category: c.category,
      icon: c.icon,
      total: lessons.length,
      done,
      unlocked: unlockedIds.has(c.id),
      isActive: c.id === active?.id,
    };
  });

  const activeLessons = active?.modules.flatMap((m) => m.lessons) ?? [];
  const nextLesson = activeLessons.find((l) => !completedLessonIds.has(l.id));
  const doneCount = activeLessons.filter((l) => completedLessonIds.has(l.id)).length;

  return (
    <div className="px-4 pt-5 pb-8">
      <p className="text-xs text-neutral-400 tracking-wide mb-1">{greeting()} 👋</p>
      <h1 className="text-2xl font-bold mb-1 md:text-3xl">أهلًا، {user.name ?? "يا نجم"}!</h1>
      <p className="text-sm text-neutral-500 mb-5">أهلًا بيك في {brand.name}</p>

      {/* Two columns from `md`: the task and the week sit side by side instead
          of stacking into a long scroll on a wide screen. */}
      <div className="mb-5 grid gap-4 md:grid-cols-2 md:items-start">
        {active && (
          <div className="animate-rise rounded-2xl bg-gradient-to-l from-brand-800 to-brand-600 text-white p-5">
            <div className="flex items-center justify-between text-xs text-brand-100 mb-2">
              <span>مهمة اليوم</span>
              <span>
                {doneCount}/{activeLessons.length} يوم
              </span>
            </div>
            {nextLesson ? (
              <>
                <h2 className="text-lg font-bold mb-1">
                  يوم {nextLesson.dayNumber} · {nextLesson.title}
                </h2>
                <p className="text-xs text-brand-100 mb-4">
                  {active.title} · {nextLesson.durationMin} دقايق · {nextLesson.xp} XP
                </p>
                <Link
                  href={`/app/learn/${active.slug}/${nextLesson.dayNumber}`}
                  className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm"
                >
                  كمّل · يوم {nextLesson.dayNumber}
                </Link>
              </>
            ) : (
              <>
                <h2 className="mb-1 text-lg font-bold">خلّصت {active.title} 🎉</h2>
                <p className="mb-4 text-xs text-brand-100">
                  شهادتك جاهزة، وفيه مسارات تانية مفتوحة ليك.
                </p>
                <Link
                  href={`/app/learn/${active.slug}/certificate`}
                  className="btn-ghost-shine block rounded-full bg-white py-2.5 text-center text-sm font-bold text-brand-800"
                >
                  شوف شهادتك 🎓
                </Link>
              </>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-white border border-black/5 p-4">
          <p className="text-xs text-neutral-400 mb-3">الأسبوع ده</p>
          <div className="flex justify-between mb-4">
            {weekDays.map((d, i) => (
              <WeekDot key={d.label} label={d.label} done={d.done} isToday={d.isToday} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-50 rounded-xl py-2">
              <div className="text-lg font-bold text-brand-800">{totalXp}</div>
              <div className="text-[10px] text-neutral-400">XP</div>
            </div>
            <div className="bg-neutral-50 rounded-xl py-2">
              <div className="text-lg font-bold text-brand-800">{streak} 🔥</div>
              <div className="text-[10px] text-neutral-400">أيام متتالية</div>
            </div>
            <div className="bg-neutral-50 rounded-xl py-2">
              <div className="text-lg font-bold text-brand-800">{user.dailyPaceMinutes}</div>
              <div className="text-[10px] text-neutral-400">دقيقة/يوم</div>
            </div>
          </div>
        </div>
      </div>

      <HelpCard className="mb-5" />

      <div className="flex items-center justify-between mb-2">
        {/*
          This grid used to exclude the featured course and was labelled "other
          tracks", so the catalogue looked like it had five. Every track the
          subscription covers belongs here, with its own progress.
        */}
        <p className="text-xs text-neutral-400 tracking-wide">مساراتك · {tiles.length} مسارات</p>
        <Link href="/app/learn" className="text-xs font-bold text-brand-600">
          كل المسارات →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {tiles.map((t) => (
          <CourseTile key={t.slug} {...t} />
        ))}
      </div>
    </div>
  );
}
