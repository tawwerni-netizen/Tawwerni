import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { hasCourseAccess, pendingOrderFor } from "@/lib/access";
import { loadUniversalCourse } from "@/lib/course-loader";
import CourseDetailClient from "@/components/CourseDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = loadUniversalCourse(slug);
  if (!course) return {};

  return {
    title: `${course.titleAr} / ${course.titleEn}`,
    description: course.descriptionAr,
    alternates: { canonical: `/app/learn/${course.slug}` },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = loadUniversalCourse(slug);
  if (!course) notFound();

  const user = await getCurrentUser();

  let doneIds: string[] = [];
  let unlocked = false;
  let pending = false;
  let relatedArticles: {
    slug: string;
    pillar: string;
    title: string;
    excerpt: string;
    icon: string;
    readingMinutes: number;
  }[] = [];

  if (user) {
    try {
      unlocked = await hasCourseAccess(user.id, course.id);
      if (!unlocked) {
        const p = await pendingOrderFor(user.id, course.id);
        pending = p !== null;
      }
    } catch {
      unlocked = false;
    }

    try {
      const completions = await prisma.lessonCompletion.findMany({
        where: { userId: user.id },
        select: { lessonId: true },
      });
      doneIds = completions.map((c) => c.lessonId);
    } catch {
      doneIds = [];
    }
  }

  try {
    relatedArticles = await prisma.article.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { slug: true, pillar: true, title: true, excerpt: true, icon: true, readingMinutes: true },
    });
  } catch {
    relatedArticles = [];
  }

  return (
    <CourseDetailClient
      course={course}
      isLoggedIn={!!user}
      unlocked={unlocked}
      pendingOrder={pending}
      doneIds={doneIds}
      relatedArticles={relatedArticles}
    />
  );
}
