import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeStreak, getWeekDays } from "@/lib/xp";
import { courseSlug } from "@/content/course-28-day-ai";
import { brand, pricing } from "@/content/brand";
import { approvedCourseIds } from "@/lib/access";
import ThemeToggle from "@/components/ThemeToggle";
import WeekDot from "@/components/WeekDot";
import { Logo } from "@/components/Logo";

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
    include: { lesson: true },
    orderBy: { completedAt: "desc" },
  });

  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));
  const weekDays = getWeekDays(completions.map((c) => c.completedAt));
  const completedLessonIds = new Set(completions.map((c) => c.lessonId));

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });

  const allLessons = course?.modules.flatMap((m) => m.lessons) ?? [];

  const unlockedIds = await approvedCourseIds(user.id);
  const otherCourses = (
    await prisma.course.findMany({
      where: { isComingSoon: false, slug: { not: courseSlug } },
      orderBy: { order: "asc" },
      select: { id: true, slug: true, icon: true, category: true },
    })
  ).map((c) => ({ ...c, unlocked: unlockedIds.has(c.id) }));
  const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id));
  const doneCount = allLessons.filter((l) => completedLessonIds.has(l.id)).length;

  return (
    <div className="px-4 pt-5 pb-8">
      <header className="flex items-center justify-between mb-5">
        <Logo size={34} />
        <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
          {(user.name ?? user.email)[0].toUpperCase()}
        </div>
        </div>
      </header>

      <p className="text-xs text-neutral-400 tracking-wide mb-1">{greeting()} 👋</p>
      <h1 className="text-2xl font-bold mb-1">أهلًا، {user.name ?? "يا نجم"}!</h1>
      <p className="text-sm text-neutral-500 mb-5">أهلًا بيك في {brand.name}</p>

      {course && (
        <div className="rounded-2xl bg-gradient-to-l from-brand-800 to-brand-600 text-white p-5 mb-5">
          <div className="flex items-center justify-between text-xs text-brand-100 mb-2">
            <span>مهمة اليوم</span>
            <span>
              {doneCount}/{allLessons.length} يوم
            </span>
          </div>
          {nextLesson ? (
            <>
              <h2 className="text-lg font-bold mb-1">
                يوم {nextLesson.dayNumber} · {nextLesson.title}
              </h2>
              <p className="text-xs text-brand-100 mb-4">
                {course.title} · {nextLesson.durationMin} دقايق · {nextLesson.xp} XP
              </p>
              <Link
                href={`/app/learn/${course.slug}/${nextLesson.dayNumber}`}
                className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm"
              >
                كمّل · يوم {nextLesson.dayNumber}
              </Link>
            </>
          ) : (
            <p className="text-sm font-bold">أكملت الكورس بالكامل! 🎉</p>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-black/5 p-4 mb-5">
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

      <div className="rounded-2xl bg-white border border-black/5 p-4 mb-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-xl">💬</div>
        <div>
          <p className="text-sm font-bold">مركز المساعدة</p>
          <p className="text-xs text-neutral-400">إجابات جاهزة لأكتر من ١٠٠ سؤال شائع</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-neutral-400 tracking-wide">اكتشف مسارات تانية</p>
        <Link href="/app/learn" className="text-xs font-bold text-brand-600">
          كل المسارات →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {otherCourses.map((c) => (
          <Link
            key={c.slug}
            href={`/app/learn/${c.slug}`}
            className="card-lift rounded-xl bg-white border border-black/5 p-3 text-center"
          >
            <div className="text-xl mb-1">{c.icon}</div>
            <div className="text-xs font-bold">{c.category}</div>
            {/*
              One subscription opens everything, so never price a single track
              here — it reads as "each of these costs 299".
            */}
            <div className="text-[10px] mt-0.5 text-brand-600">
              {c.unlocked ? "مفتوح ✓" : "ضمن الاشتراك"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
