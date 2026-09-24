import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak, getWeekDays } from "@/lib/xp";
import { brand } from "@/content/brand";
import { approvedCourseIds } from "@/lib/access";
import { coursesWord } from "@/lib/arabic-plural";
import WeekDot from "@/components/WeekDot";
import HelpCard from "@/components/HelpCard";
import CourseTile from "@/components/CourseTile";
import ShareRow from "@/components/ShareRow";
import Greeting from "@/components/Greeting";
import ReminderPrompt from "@/components/ReminderPrompt";
import PurchasePixel from "@/components/PurchasePixel";
import MoodCheckIn from "@/components/MoodCheckIn";
import FocusPlayer from "@/components/FocusPlayer";

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

  /*
   * The sale, reported to Meta only once the money actually arrived.
   *
   * An order is `pending` until a transfer is matched to it, so the checkout
   * screen is the wrong place to report a purchase — it would count everyone
   * who filled the form and never sent the money. This is the earliest point
   * where payment is confirmed.
   */
  const paidOrder = await prisma.order.findFirst({
    where: { userId: user.id, status: "approved" },
    orderBy: { approvedAt: "asc" },
    select: { id: true, amountEgp: true },
  });

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
    <div className="px-4 pt-5 pb-8 min-h-screen">
      {paidOrder && <PurchasePixel orderId={paidOrder.id} amountEgp={paidOrder.amountEgp} />}
      <Greeting className="mb-1 text-xs tracking-wide text-neutral-500 dark:text-neutral-400" />
      <h1 className="text-2xl font-black mb-1 md:text-3xl text-neutral-900 dark:text-white">
        أهلًا بك، <span className="text-brand-600 dark:text-brand-400 font-extrabold">{user.name ?? "يا بطل"}</span> 👋
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-5">
        جاهز لإنجاز خطوة اليوم في {brand.name}؟
      </p>

      {/* Psychological Well-being & Mood Check-in */}
      <MoodCheckIn />
      <FocusPlayer />

      {/* Two columns from `md`: the task and the week sit side by side */}
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start">
        {active && (
          <div className="animate-rise rounded-2xl bg-gradient-to-l from-brand-800 to-brand-600 text-white p-5 shadow-sm">
            <div className="on-brand-soft mb-2 flex items-center justify-between text-xs">
              <span className="font-bold">مهمة اليوم التطبيقية</span>
              <span>
                {doneCount}/{activeLessons.length} يوم
              </span>
            </div>
            {nextLesson ? (
              <>
                <h2 className="text-lg font-bold mb-1">
                  يوم {nextLesson.dayNumber} · {nextLesson.title}
                </h2>
                <p className="on-brand-soft mb-4 text-xs">
                  {active.title} · {nextLesson.durationMin} دقايق · {nextLesson.xp} XP
                </p>
                <Link
                  href={`/app/learn/${active.slug}/${nextLesson.dayNumber}`}
                  className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm shadow-md hover:bg-neutral-50 transition-colors"
                >
                  كمّل · يوم {nextLesson.dayNumber} ←
                </Link>
              </>
            ) : (
              <>
                <h2 className="mb-1 text-lg font-bold">خلّصت {active.title} 🎉</h2>
                <p className="on-brand-soft mb-4 text-xs">
                  شهادتك جاهزة، وكل الـ ١٠٠ مسار مفتوحة ليك بالكامل.
                </p>
                <Link
                  href={`/app/learn/${active.slug}/certificate`}
                  className="btn-ghost-shine block rounded-full bg-white py-2.5 text-center text-sm font-bold text-brand-800 shadow-md"
                >
                  استلم شهادتك المعتمدة 🎓
                </Link>
              </>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 p-4 shadow-xs">
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3 font-semibold">نشاطك هذا الأسبوع</p>
          <div className="flex justify-between mb-4">
            {weekDays.map((d, i) => (
              <WeekDot key={d.label} label={d.label} done={d.done} isToday={d.isToday} index={i} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl py-2.5 border border-black/5 dark:border-neutral-700/40">
              <div className="text-lg font-bold text-brand-700 dark:text-brand-300 font-mono">{totalXp}</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">XP المكتسبة</div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl py-2.5 border border-black/5 dark:border-neutral-700/40">
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">{streak} 🔥</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">أيام متتالية</div>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-xl py-2.5 border border-black/5 dark:border-neutral-700/40">
              <div className="text-lg font-bold text-teal-700 dark:text-teal-300 font-mono">{user.dailyPaceMinutes ?? 15}</div>
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">دقيقة/يوم</div>
            </div>
          </div>
        </div>
      </div>

      <ReminderPrompt hasCompletions={completions.length > 0} />
      <HelpCard className="mb-6" />

      {/* 100 Tracks Showcase Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <div>
          <h2 className="text-lg font-black text-neutral-900 dark:text-white">
            مساراتك المفتوحة (١٠٠ مسار كامل)
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            اشتراكك يمنحك وصولًا شاملاً لجميع المسارات الـ 100 في 10 مجالات حيوية
          </p>
        </div>
        <Link
          href="/app/learn"
          className="tap inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-brand-500/10 border border-brand-500/20 px-3.5 py-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 hover:bg-brand-500/20 transition-all shadow-2xs"
        >
          <span>تصفح كل الـ 100 مسار</span>
          <span>←</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {tiles.map((t) => (
          <CourseTile key={t.slug} {...t} />
        ))}
      </div>

      <ShareRow className="mt-8" />
    </div>
  );
}
