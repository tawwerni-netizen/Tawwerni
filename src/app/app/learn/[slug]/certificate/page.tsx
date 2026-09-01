import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { hasCourseAccess } from "@/lib/access";
import { getOrCreateCertificate } from "@/lib/certificate";
import { brand } from "@/content/brand";
import Certificate from "@/components/Certificate";

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

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

  const holderName = user.name ?? user.email;
  const cert = await getOrCreateCertificate({
    userId: user.id,
    courseId: course.id,
    holderName,
    courseTitle: course.title,
    completions,
  });

  const verifyUrl = `${siteUrl}/verify/${cert.code}`;
  // A data URL, not a file — the certificate is either printed straight from
  // the page or saved as a PDF via the browser, and either way needs the
  // image inlined rather than pointing at a route that will not exist in
  // that PDF's context.
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 });

  return (
    <Certificate
      holder={cert.holderName}
      courseTitle={cert.courseTitle}
      lessons={cert.lessons}
      totalXp={cert.totalXp}
      avgScore={cert.avgScore}
      finishedAt={cert.issuedAt.toISOString()}
      serial={cert.code}
      verifyUrl={verifyUrl}
      qrDataUrl={qrDataUrl}
      backHref={`/app/learn/${course.slug}`}
    />
  );
}
