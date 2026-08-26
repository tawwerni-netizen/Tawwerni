import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { hasCourseAccess } from "@/lib/access";
import Certificate from "@/components/Certificate";

/**
 * The certificate the course page has been promising.
 *
 * Deliberately gated on actually finishing: every lesson completed, not just
 * paid for. A certificate you can get without doing the work is worth nothing
 * to the person holding it, which makes it worth nothing as a reason to finish.
 */
export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) return null;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: { modules: { include: { lessons: true } } },
  });
  if (!course || course.isComingSoon) notFound();

  const lessons = course.modules.flatMap((m) => m.lessons);
  const completions = await prisma.lessonCompletion.findMany({
    where: { userId: user.id, lesson: { module: { courseId: course.id } } },
    select: {
      lessonId: true,
      completedAt: true,
      xpEarned: true,
      score: true,
      totalQuestions: true,
    },
    orderBy: { completedAt: "asc" },
  });

  const doneIds = new Set(completions.map((c) => c.lessonId));
  const done = lessons.filter((l) => doneIds.has(l.id)).length;
  const complete = lessons.length > 0 && done >= lessons.length;
  const unlocked = await hasCourseAccess(user.id, course.id);

  if (!complete) {
    return (
      <div className="px-4 pt-6 pb-10">
        <Link href={`/app/learn/${course.slug}`} className="text-xs text-brand-600">
          ← رجوع للمسار
        </Link>

        <div className="animate-rise mx-auto mt-6 max-w-md rounded-3xl border border-black/5 bg-white p-6 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-neutral-100 text-3xl grayscale">
            🎓
          </div>
          <h1 className="mb-2 text-lg font-bold">الشهادة لسه مقفولة</h1>
          <p className="mb-5 text-sm leading-relaxed text-neutral-600">
            الشهادة بتتفتح لما تخلّص المسار كله. إنت خلّصت{" "}
            <b className="text-brand-600">
              {done} من {lessons.length}
            </b>{" "}
            درس — فاضلك {lessons.length - done}.
          </p>

          <div className="progress-track mb-5">
            <span
              className="progress-fill"
              style={{ width: `${Math.round((done / lessons.length) * 100)}%` }}
            />
          </div>

          <Link
            href={`/app/learn/${course.slug}`}
            className="btn-shine block rounded-full bg-brand-600 py-3 text-sm font-bold text-white"
          >
            {unlocked ? "كمّل المسار ←" : "افتح المسار ←"}
          </Link>
        </div>
      </div>
    );
  }

  const finishedAt = completions[completions.length - 1]?.completedAt ?? new Date();
  const totalXp = completions.reduce((s, c) => s + c.xpEarned, 0);

  /*
   * Average quiz score, as a percentage.
   *
   * `score` is a count of correct answers, not a percentage — averaging the
   * raw counts printed "4%" on a certificate where every quiz was perfect.
   * Each lesson is converted to its own percentage first, so a 4-question and
   * a 10-question quiz weigh the same.
   */
  const scored = completions.filter(
    (c) => typeof c.score === "number" && (c.totalQuestions ?? 0) > 0
  );
  const avgScore = scored.length
    ? Math.round(
        (scored.reduce((s, c) => s + (c.score ?? 0) / (c.totalQuestions ?? 1), 0) /
          scored.length) *
          100
      )
    : null;

  return (
    <Certificate
      holder={user.name ?? user.email}
      courseTitle={course.title}
      lessons={lessons.length}
      totalXp={totalXp}
      avgScore={avgScore}
      finishedAt={finishedAt.toISOString()}
      serial={`${course.slug.slice(0, 4).toUpperCase()}-${user.id.slice(-6).toUpperCase()}`}
      backHref={`/app/learn/${course.slug}`}
    />
  );
}
