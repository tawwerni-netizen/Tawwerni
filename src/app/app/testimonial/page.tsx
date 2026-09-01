import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import TestimonialForm from "@/components/TestimonialForm";

const MIN_COMPLETIONS = 3;

export default async function TestimonialPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [completions, existing] = await Promise.all([
    prisma.lessonCompletion.findMany({
      where: { userId: user.id },
      select: { lesson: { select: { module: { select: { courseId: true } } } } },
    }),
    prisma.testimonial.findFirst({ where: { userId: user.id } }),
  ]);

  if (existing) {
    const STATUS_COPY: Record<string, string> = {
      pending: "لسه بنراجعه — هيظهر على الموقع لو مناسب.",
      approved: "اتوافق عليه! ممكن يظهر على الموقع.",
      rejected: "شكرًا على وقتك — قررنا ما نعرضهوش دلوقتي.",
    };
    return (
      <div className="px-4 pt-6 pb-10 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-black/5 bg-white p-6">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl">
            🙏
          </div>
          <h1 className="mb-2 text-lg font-bold">بعتّ رأيك خلاص</h1>
          <p className="text-sm leading-relaxed text-neutral-500">
            {STATUS_COPY[existing.status] ?? ""}
          </p>
        </div>
      </div>
    );
  }

  if (completions.length < MIN_COMPLETIONS) {
    return (
      <div className="px-4 pt-6 pb-10 text-center">
        <div className="mx-auto max-w-md rounded-3xl border border-black/5 bg-white p-6">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-neutral-100 text-2xl grayscale">
            🔒
          </div>
          <h1 className="mb-2 text-lg font-bold">كمّل شوية أول</h1>
          <p className="mb-5 text-sm leading-relaxed text-neutral-500">
            محتاج تخلّص {MIN_COMPLETIONS} دروس على الأقل الأول عشان يبقى عندك
            تجربة فعلية تشاركها. إنت خلّصت {completions.length} لحد دلوقتي.
          </p>
          <Link
            href="/app/learn"
            className="btn-shine inline-block rounded-full bg-brand-600 px-6 py-2.5 text-sm font-bold text-white"
          >
            كمّل مسارك ←
          </Link>
        </div>
      </div>
    );
  }

  // The course they've put the most work into — the one they actually have
  // something to say about, not whichever one happens first alphabetically.
  const perCourse = new Map<string, number>();
  for (const c of completions) {
    const id = c.lesson.module.courseId;
    perCourse.set(id, (perCourse.get(id) ?? 0) + 1);
  }
  const topCourseId = [...perCourse.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  return (
    <div className="px-4 pt-6 pb-10">
      <TestimonialForm courseId={topCourseId} />
    </div>
  );
}
