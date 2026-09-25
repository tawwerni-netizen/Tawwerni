import type { Metadata } from "next";
import { findCertificateByCode } from "@/lib/certificate";
import { ALL_100_TRACKS } from "@/content/tracks100";
import { loadUniversalCourse } from "@/lib/course-loader";
import VerifyClient from "@/components/VerifyClient";

export const metadata: Metadata = {
  title: "التحقق من شهادة · Verify Certificate",
  robots: { index: false, follow: true },
};

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const cert = await findCertificateByCode(code.toUpperCase());

  let courseTitleEn: string | undefined;
  if (cert) {
    const slug = cert.courseId.replace(/^track-/, "");
    const universal = loadUniversalCourse(slug);
    if (universal) {
      courseTitleEn = universal.titleEn;
    } else {
      const track = ALL_100_TRACKS.find(
        (t) => t.titleAr === cert.courseTitle || t.slug === slug
      );
      if (track) courseTitleEn = track.titleEn;
    }
  }

  const certData = cert
    ? {
        holderName: cert.holderName,
        courseTitle: cert.courseTitle,
        courseTitleEn,
        lessons: cert.lessons,
        avgScore: cert.avgScore,
        issuedAt: cert.issuedAt.toISOString(),
        code: cert.code,
      }
    : null;

  return <VerifyClient cert={certData} />;
}
