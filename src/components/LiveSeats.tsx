import { prisma } from "@/lib/prisma";
import { allCourses } from "@/content/courses";
import { coursesWord } from "@/lib/arabic-plural";

/**
 * Social proof, from the database.
 *
 * Every number here is counted at request time. It would have been easy to
 * write "٣٤ شخص بيتصفحوا دلوقتي" and have it tick upward on a timer — that is
 * what most funnels do — but a fabricated number is a lie that a customer can
 * catch, and this business runs on manual WhatsApp trust. Real and modest beats
 * invented and impressive.
 *
 * When the numbers are still too small to persuade anyone, the component says
 * something true about the product instead of showing an embarrassing count.
 */
export default async function LiveSeats({ className = "" }: { className?: string }) {
  let learners = 0;
  let lessonsThisWeek = 0;

  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    [learners, lessonsThisWeek] = await Promise.all([
      prisma.user.count(),
      prisma.lessonCompletion.count({ where: { completedAt: { gt: weekAgo } } }),
    ]);
  } catch {
    // A landing page must never fail because of a database hiccup.
    return null;
  }

  // Below this the count works against us rather than for us.
  const showCounts = learners >= 25;

  return (
    <div className={`live-strip ${className}`}>
      {showCounts ? (
        <>
          <span className="live-dot" aria-hidden />
          <span>
            <b>{learners}</b> متعلّم سجّلوا
            {lessonsThisWeek > 0 && (
              <>
                {" · "}
                <b>{lessonsThisWeek}</b> درس اتخلّص الأسبوع ده
              </>
            )}
          </span>
        </>
      ) : (
        <>
          <span aria-hidden>🎁</span>
          <span>
            {/* Counted, not typed. It said “الستة” while the catalogue had nine —
                a number written once and left behind by the product. */}
            <b>اليوم الأول</b> من كل الـ{allCourses.length} {coursesWord(allCourses.length)} مفتوح — من غير دفع
          </span>
        </>
      )}
    </div>
  );
}
