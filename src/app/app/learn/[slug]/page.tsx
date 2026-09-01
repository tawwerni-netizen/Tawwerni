import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { hasCourseAccess, pendingOrderFor, FREE_PREVIEW_DAY } from "@/lib/access";
import { pricing, payment, brand } from "@/content/brand";

async function loadCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });
}

/**
 * Per-course title, description and canonical.
 *
 * Every course page used to inherit the site-wide default metadata — the
 * exact same title on nine different pages is a duplicate-content signal,
 * not nine chances to rank for nine different searches.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await loadCourse(slug);
  if (!course || course.isComingSoon) return {};

  const lessonCount = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return {
    title: course.title,
    description: `${course.description} — ${lessonCount} درس، ${pricing.priceEgp} جنيه دفعة واحدة، اليوم الأول مجاني.`,
    alternates: { canonical: `/app/learn/${course.slug}` },
    openGraph: { title: `${course.title} · ${brand.name}`, description: course.description },
  };
}

async function loadRelatedArticles(courseId: string) {
  return prisma.article.findMany({
    where: { relatedCourseId: courseId, status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: { slug: true, pillar: true, title: true, excerpt: true, icon: true, readingMinutes: true },
  });
}

/**
 * Gated behind `getCurrentUser()` used to mean gated from Google too: an
 * anonymous request — including a crawler — got `return null`, a blank page,
 * on all nine URLs the sitemap explicitly submits for indexing on the
 * strength of their "public-facing" curriculum. A logged-out visitor now
 * gets the course overview and full curriculum outline (titles only — no
 * lesson content, which still requires an account); everything below that
 * branch is unchanged for logged-in learners.
 */
export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const course = await loadCourse(slug);
  if (!course || course.isComingSoon) notFound();

  const relatedArticles = await loadRelatedArticles(course.id);

  if (!user) return <PublicCourseView course={course} relatedArticles={relatedArticles} />;

  const completions = await prisma.lessonCompletion.findMany({
    where: { userId: user.id, lesson: { module: { courseId: course.id } } },
    select: { lessonId: true },
  });
  const doneIds = new Set(completions.map((c) => c.lessonId));
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const doneCount = allLessons.filter((l) => doneIds.has(l.id)).length;
  const nextLesson = allLessons.find((l) => !doneIds.has(l.id)) ?? allLessons[0];

  const unlocked = await hasCourseAccess(user.id, course.id);
  const pending = unlocked ? null : await pendingOrderFor(user.id, course.id);
  const canOpen = (dayNumber: number) => unlocked || dayNumber === FREE_PREVIEW_DAY;

  return (
    <div className="pb-8">
      <div className="bg-gradient-to-l from-brand-800 to-brand-600 text-white px-4 pt-6 pb-6">
        <Link href="/app/learn" className="tap inline-block py-1 text-xs text-brand-100">
          ← رجوع
        </Link>
        <div className="text-3xl mt-3">{course.icon}</div>
        <h1 className="text-xl font-bold mt-2">{course.title}</h1>
        <p className="text-sm text-brand-100 mt-1">{course.description}</p>
        <div className="flex gap-2 mt-4 text-xs">
          <span className="bg-white/15 rounded-full px-3 py-1">{allLessons.length} يوم</span>
          <span className="bg-white/15 rounded-full px-3 py-1">{course.modules.length} وحدات</span>
          <span className="bg-white/15 rounded-full px-3 py-1">{course.totalXp} XP</span>
        </div>
        {unlocked && doneCount >= allLessons.length ? (
          <Link
            href={`/app/learn/${course.slug}/certificate`}
            className="btn-ghost-shine mt-4 block rounded-full bg-white py-2.5 text-center text-sm font-bold text-brand-800"
          >
            🎓 شوف شهادتك
          </Link>
        ) : unlocked ? (
          <Link
            href={`/app/learn/${course.slug}/${nextLesson.dayNumber}`}
            className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm mt-4"
          >
            {doneCount === 0 ? "ابدأ يوم ١" : `كمّل · يوم ${nextLesson.dayNumber}`} →
          </Link>
        ) : (
          <Link
            href={`/app/learn/${course.slug}/${FREE_PREVIEW_DAY}`}
            className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm mt-4"
          >
            جرّب اليوم الأول مجانًا →
          </Link>
        )}
      </div>

      <div className="px-4 pt-5">
        {!unlocked &&
          (pending ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-5">
              <p className="text-sm font-bold text-amber-900 mb-1">⏳ طلبك تحت المراجعة</p>
              <p className="text-xs leading-relaxed text-amber-800">
                لو بعتّ إثبات التحويل، هنفعّل المسار خلال {payment.activationHours} ساعة. لسه ما بعتّهوش؟
                ابعته على واتساب <b dir="ltr">{payment.supportWhatsapp}</b> أو{" "}
                <b dir="ltr">{payment.supportEmail}</b>.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-brand-600 to-brand-800 p-4 mb-5 text-white">
              <p className="text-sm font-bold mb-1">🔓 افتح كل المسارات</p>
              <p className="text-xs text-white/80 mb-3">
                اليوم الأول مجاني. اشتراك واحد بـ <b>{pricing.priceEgp} ج.م</b>{" "}
                بيفتحلك باقي الـ {allLessons.length - 1} يوم هنا{" "}
                <b>وكل المسارات التانية كمان</b> — {pricing.offerNote}.
              </p>
              <Link
                href="/quiz/checkout"
                className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm"
              >
                اشترك دلوقتي →
              </Link>
            </div>
          ))}

        <div className="rounded-2xl bg-white border border-black/5 p-4 mb-5">
          <p className="text-xs font-bold text-neutral-500 mb-2">الكورس يشمل</p>
          <ul className="text-sm space-y-1.5 text-neutral-700">
            <li>🧠 {course.modules.length} وحدات مهارية من الأساسيات للربح</li>
            <li>🎯 مهمة عملية واحدة كل يوم</li>
            <li>📝 كويزات بشرح كامل بعد كل درس</li>
            <li>🏅 نقاط خبرة، أيام متتالية، وشارات إنجاز</li>
            <li>
              🎓{" "}
              <Link href={`/app/learn/${course.slug}/certificate`} className="font-bold text-brand-600">
                شهادة إتمام الكورس
              </Link>{" "}
              — بتتفتح لما تخلّص كل الأيام
            </li>
          </ul>
        </div>

        <p className="text-xs text-neutral-400 mb-2 tracking-wide">
          {doneCount}/{allLessons.length} درس · مسارك التعليمي
        </p>
        <div className="space-y-4">
          {course.modules.map((module) => {
            const moduleDone = module.lessons.filter((l) => doneIds.has(l.id)).length;
            return (
              <div key={module.id} className="rounded-2xl bg-white border border-black/5 overflow-hidden">
                <div className="p-3 border-b border-black/5 flex items-center gap-2">
                  <span className="text-lg">{module.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{module.title}</p>
                    <p className="text-[11px] text-neutral-400">{module.description}</p>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    {moduleDone}/{module.lessons.length}
                  </span>
                </div>
                <div className="divide-y divide-black/5">
                  {module.lessons.map((lesson) => {
                    const done = doneIds.has(lesson.id);
                    const open = canOpen(lesson.dayNumber);
                    const inner = (
                      <>
                        {/*
                          A locked row is a sales surface: the learner has to be
                          able to read the title to want it. Only the chip and
                          the "مقفول" tag are dimmed — never the title itself.
                        */}
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 ${
                            done ? "bg-brand-600 text-white" : "lesson-chip"
                          }`}
                        >
                          {done ? "✓" : open ? lesson.dayNumber : "🔒"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate lesson-title">
                            {lesson.isCheckpoint ? "🏁 " : ""}
                            {lesson.title}
                          </p>
                        </div>
                        <span className="text-[10px] shrink-0 lesson-meta">
                          {open ? `${lesson.durationMin} د` : "مقفول"}
                        </span>
                      </>
                    );

                    return open ? (
                      <Link
                        key={lesson.id}
                        href={`/app/learn/${course.slug}/${lesson.dayNumber}`}
                        className="flex items-center gap-3 px-3 py-2.5"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div
                        key={lesson.id}
                        // `bg-neutral-50/60` was used here and stayed light in
                        // night mode — opacity variants are separate classes and
                        // slip past the theme overrides. Use a token instead.
                        className="flex items-center gap-3 px-3 py-2.5 lesson-row-locked"
                        aria-disabled="true"
                      >
                        {inner}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <RelatedArticles articles={relatedArticles} />
      </div>
    </div>
  );
}

type CourseWithLessons = NonNullable<Awaited<ReturnType<typeof loadCourse>>>;
type RelatedArticle = Awaited<ReturnType<typeof loadRelatedArticles>>[number];

/**
 * Free enrichment content, not a nav destination.
 *
 * The AI Hub has no permanent spot in the app's bottom nav or the landing
 * page's primary CTA — either would compete with the 5-minutes-a-day loop
 * this product is built around. This is the alternative: 1-3 articles this
 * specific course already has a `relatedCourseId` link to, surfaced right
 * where someone deciding on (or already inside) this course would want them.
 * Renders on both the public and authenticated view, since the public one is
 * also what Google indexes.
 */
function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <div className="mt-5">
      <p className="text-xs font-bold text-neutral-500 mb-2">مقالات تساعدك أكتر</p>
      <div className="space-y-2">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/hub/${a.pillar}/${a.slug}`}
            className="flex items-start gap-3 rounded-2xl bg-white border border-black/5 p-3 tap"
          >
            <span className="text-lg leading-none shrink-0">{a.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-800 truncate">{a.title}</p>
              <p className="text-[11px] text-neutral-500 line-clamp-1">{a.excerpt}</p>
            </div>
            <span className="text-[10px] text-neutral-400 shrink-0 mr-auto">{a.readingMinutes} د</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/** The curriculum outline a stranger — or a crawler — actually gets to see. */
function PublicCourseView({
  course,
  relatedArticles,
}: {
  course: CourseWithLessons;
  relatedArticles: RelatedArticle[];
}) {
  const allLessons = course.modules.flatMap((m) => m.lessons);

  return (
    <div className="pb-8">
      <div className="bg-gradient-to-l from-brand-800 to-brand-600 text-white px-4 pt-6 pb-6">
        <Link href="/" className="tap inline-block py-1 text-xs text-brand-100">
          ← الرئيسية
        </Link>
        <div className="text-3xl mt-3">{course.icon}</div>
        <h1 className="text-xl font-bold mt-2">{course.title}</h1>
        <p className="text-sm text-brand-100 mt-1">{course.description}</p>
        <div className="flex gap-2 mt-4 text-xs">
          <span className="bg-white/15 rounded-full px-3 py-1">{allLessons.length} يوم</span>
          <span className="bg-white/15 rounded-full px-3 py-1">{course.modules.length} وحدات</span>
          <span className="bg-white/15 rounded-full px-3 py-1">{course.totalXp} XP</span>
        </div>
        <Link
          href="/login?signup=1"
          className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm mt-4"
        >
          جرّب اليوم الأول مجانًا →
        </Link>
      </div>

      <div className="px-4 pt-5">
        <div className="rounded-2xl border border-black/5 bg-gradient-to-br from-brand-600 to-brand-800 p-4 mb-5 text-white">
          <p className="text-sm font-bold mb-1">🔓 افتح كل المسارات</p>
          <p className="text-xs text-white/80 mb-3">
            اليوم الأول مجاني، من غير بطاقة بنكية. اشتراك واحد بـ{" "}
            <b>{pricing.priceEgp} ج.م</b> بيفتحلك باقي الـ{allLessons.length - 1} يوم
            هنا <b>وكل المسارات التانية كمان</b> — {pricing.offerNote}.
          </p>
          <Link
            href="/login?signup=1"
            className="btn-ghost-shine block text-center bg-white text-brand-800 font-bold rounded-full py-2.5 text-sm"
          >
            اعمل حساب مجاني →
          </Link>
        </div>

        <p className="text-xs text-neutral-400 mb-2 tracking-wide">منهج المسار — {allLessons.length} درس</p>
        <div className="space-y-4">
          {course.modules.map((module) => (
            <div key={module.id} className="rounded-2xl bg-white border border-black/5 overflow-hidden">
              <div className="p-3 border-b border-black/5 flex items-center gap-2">
                <span className="text-lg">{module.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{module.title}</p>
                  <p className="text-[11px] text-neutral-400">{module.description}</p>
                </div>
              </div>
              <div className="divide-y divide-black/5">
                {module.lessons.map((lesson) => {
                  const free = lesson.dayNumber === FREE_PREVIEW_DAY;
                  return (
                    <div key={lesson.id} className="flex items-center gap-3 px-3 py-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 ${
                          free ? "bg-brand-600 text-white" : "lesson-chip"
                        }`}
                      >
                        {free ? lesson.dayNumber : "🔒"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate lesson-title">
                          {lesson.isCheckpoint ? "🏁 " : ""}
                          {lesson.title}
                        </p>
                      </div>
                      <span className="text-[10px] shrink-0 lesson-meta">
                        {free ? "مجاني" : `${lesson.durationMin} د`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <RelatedArticles articles={relatedArticles} />
      </div>
    </div>
  );
}
