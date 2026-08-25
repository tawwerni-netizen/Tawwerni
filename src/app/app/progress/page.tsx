import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { computeLevel, computeStreak, getWeekDays } from "@/lib/xp";
import { badgeDefs } from "@/content/badges";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [completions, userBadges, courses] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      include: { lesson: { include: { module: { include: { course: true } } } } },
    }),
    prisma.userBadge.findMany({ where: { userId: user.id }, include: { badge: true } }),
    prisma.course.findMany({ where: { isComingSoon: false } }),
  ]);

  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);
  const streak = computeStreak(completions.map((c) => c.completedAt));
  const weekDays = getWeekDays(completions.map((c) => c.completedAt));
  const level = computeLevel(totalXp);
  const earnedKeys = new Set(userBadges.map((ub) => ub.badge.key));

  const progressPercent = level.xpForNextLevel
    ? Math.min(100, Math.round((level.xpIntoLevel / level.xpForNextLevel) * 100))
    : 100;

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="text-xl font-bold mb-1">تقدّمي</h1>
      <p className="text-sm text-neutral-500 mb-5">تابع رحلتك التعليمية</p>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="bg-white border border-black/5 rounded-xl py-3 text-center">
          <div className="text-xl font-bold text-brand-800">{totalXp}</div>
          <div className="text-[10px] text-neutral-400">إجمالي XP</div>
        </div>
        <div className="bg-white border border-black/5 rounded-xl py-3 text-center">
          <div className="text-xl font-bold text-brand-800">{streak} 🔥</div>
          <div className="text-[10px] text-neutral-400">أيام متتالية</div>
        </div>
        <div className="bg-white border border-black/5 rounded-xl py-3 text-center">
          <div className="text-xl font-bold text-brand-800">{completions.length}</div>
          <div className="text-[10px] text-neutral-400">دروس مكتملة</div>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs bg-brand-50 text-brand-800 rounded-full px-2 py-1 font-bold">
            مستوى {level.levelNumber}
          </span>
          <span className="font-bold text-sm">{level.name}</span>
        </div>
        {level.nextName && (
          <p className="text-xs text-neutral-400 mb-2">
            {level.xpToNext} XP لمستوى &quot;{level.nextName}&quot;
          </p>
        )}
        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-2xl p-4 mb-5">
        <p className="text-xs text-neutral-400 mb-3">الأسبوع ده</p>
        <div className="flex justify-between">
          {weekDays.map((d, i) => (
            <div key={d.label} className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                  d.done
                    ? "bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-md shadow-brand-600/30"
                    : d.isToday
                      ? "animate-pulse-glow border-2 border-brand-600 bg-brand-50 text-brand-700"
                      : "border border-dashed border-neutral-300 bg-neutral-50 text-neutral-300"
                }`}
                style={d.done ? { animationDelay: `${i * 60}ms` } : undefined}
              >
                {d.done ? (
                  <span className="animate-pop text-base">🔥</span>
                ) : d.isToday ? (
                  <span className="text-base">🎯</span>
                ) : (
                  <span className="text-xs">·</span>
                )}
              </div>
              <span
                className={`text-xs ${d.isToday ? "font-bold text-brand-700" : "text-neutral-400"}`}
              >
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-400 mb-2 tracking-wide">كورساتي</p>
      <div className="space-y-2 mb-6">
        {courses.map((course) => {
          const courseCompletions = completions.filter((c) => c.lesson.module.course.id === course.id);
          const percent = course.totalLessons ? Math.round((courseCompletions.length / course.totalLessons) * 100) : 0;
          const xpEarned = courseCompletions.reduce((s, c) => s + c.xpEarned, 0);
          return (
            <div key={course.id} className="bg-white border border-black/5 rounded-xl p-3">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-lg">{course.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{course.title}</p>
                  <p className="text-[10px] text-neutral-400">
                    {courseCompletions.length}/{course.totalLessons} · {percent}٪ · +{xpEarned} XP
                  </p>
                </div>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-600" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-neutral-400 mb-2 tracking-wide">
        الشارات · {earnedKeys.size}/{badgeDefs.length}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {badgeDefs.map((badge) => {
          const earned = earnedKeys.has(badge.key);
          return (
            <div
              key={badge.key}
              className={`rounded-xl border p-3 flex items-center gap-2 ${
                earned ? "bg-amber-50 border-amber-100" : "bg-neutral-50 border-black/5 opacity-60"
              }`}
            >
              <span className="text-xl">{earned ? badge.icon : "🔒"}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{badge.title}</p>
                <p className="text-[10px] text-neutral-400 truncate">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
