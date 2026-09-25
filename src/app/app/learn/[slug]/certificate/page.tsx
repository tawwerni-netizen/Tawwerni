import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { hasCourseAccess } from "@/lib/access";
import { getOrCreateCertificate } from "@/lib/certificate";
import { brand } from "@/content/brand";
import { loadUniversalCourse } from "@/lib/course-loader";
import { ensureDbCourse } from "@/lib/db-course";
import Certificate from "@/components/Certificate";
import CertificateLockedClient from "@/components/CertificateLockedClient";
import CertificateEarnedPixel from "@/components/CertificateEarnedPixel";

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

  const course = loadUniversalCourse(slug);
  if (!course) notFound();

  const lessons = course.modules.flatMap((m) => m.lessons);
  const lessonIds = new Set(lessons.map((l) => l.id));

  const allCompletions = await prisma.lessonCompletion.findMany({
    where: { userId: user.id },
    select: {
      lessonId: true,
      completedAt: true,
      xpEarned: true,
      score: true,
      totalQuestions: true,
    },
    orderBy: { completedAt: "asc" },
  });

  const completions = allCompletions.filter((c) => lessonIds.has(c.lessonId));
  const doneIds = new Set(completions.map((c) => c.lessonId));
  const done = lessons.filter((l) => doneIds.has(l.id)).length;
  const complete = lessons.length > 0 && done >= lessons.length;
  const unlocked = await hasCourseAccess(user.id, course.id);

  if (!complete) {
    return (
      <CertificateLockedClient
        courseSlug={course.slug}
        courseTitleAr={course.titleAr}
        courseTitleEn={course.titleEn}
        done={done}
        total={lessons.length}
        unlocked={unlocked}
      />
    );
  }

  // Ensure course row exists in database for foreign key constraint
  const dbCourse = await ensureDbCourse(slug);
  const courseId = dbCourse ? dbCourse.id : course.id;

  const holderName = user.name ?? user.email;
  const cert = await getOrCreateCertificate({
    userId: user.id,
    courseId,
    holderName,
    courseTitle: course.titleAr,
    completions,
  });

  const verifyUrl = `${siteUrl}/verify/${cert.code}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 });

  return (
    <>
      <CertificateEarnedPixel courseSlug={course.slug} />
      <Certificate
        holder={cert.holderName}
        courseTitleAr={course.titleAr}
        courseTitleEn={course.titleEn}
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
    </>
  );
}
