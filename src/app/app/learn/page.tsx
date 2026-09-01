import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { approvedCourseIds } from "@/lib/access";
import { coursesWord } from "@/lib/arabic-plural";
import CourseCard from "@/components/CourseCard";
import ShareRow from "@/components/ShareRow";

export default async function LearnPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [courses, completions, unlockedIds] = await Promise.all([
    prisma.course.findMany({
      where: { isComingSoon: false },
      orderBy: { order: "asc" },
      include: { modules: { include: { lessons: { select: { id: true } } } } },
    }),
    prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      select: { lessonId: true },
    }),
    approvedCourseIds(user.id),
  ]);

  const doneIds = new Set(completions.map((c) => c.lessonId));

  const cards = courses.map((c) => {
    const lessons = c.modules.flatMap((m) => m.lessons);
    return {
      slug: c.slug,
      title: c.title,
      description: c.description,
      icon: c.icon,
      badge: c.badge,
      totalLessons: lessons.length,
      totalXp: c.totalXp,
      done: lessons.filter((l) => doneIds.has(l.id)).length,
      unlocked: unlockedIds.has(c.id),
    };
  });

  const totalLessons = cards.reduce((s, c) => s + c.totalLessons, 0);
  const totalDone = cards.reduce((s, c) => s + c.done, 0);

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="mb-1 text-xl font-bold md:text-2xl">كل المسارات</h1>
      <p className="mb-4 text-sm text-neutral-500">
        اشتراك واحد بيفتحلك كل ده — ابدأ من أي مكان وارجع في أي وقت.
      </p>

      <div className="mb-6 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-800">
          {cards.length} {coursesWord(cards.length)}
        </span>
        <span className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-800">
          {totalLessons} درس
        </span>
        {totalDone > 0 && (
          <span className="rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-800">
            خلّصت {totalDone}
          </span>
        )}
      </div>

      {/*
        One column on a phone, two from `md`. A single 1152px-wide row per
        course wastes most of a laptop screen and makes six items feel like a
        long list instead of a catalogue you can take in at once.
      */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {cards.map((c, i) => (
          <CourseCard key={c.slug} {...c} index={i} />
        ))}
      </div>

      <ShareRow
        className="mt-8"
        title="عجبك المحتوى؟"
        note="ابعت المنصة لحد تعرفه — وخد 50 ج.م عن كل واحد يشترك من لينكك."
      />
    </div>
  );
}
