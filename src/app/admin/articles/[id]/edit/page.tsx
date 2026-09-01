import { notFound } from "next/navigation";
import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import ArticleForm from "@/components/ArticleForm";
import ArticleStatusBar from "@/components/ArticleStatusBar";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const { id } = await params;
  const [article, courses] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.course.findMany({ where: { isComingSoon: false }, select: { id: true, title: true }, orderBy: { order: "asc" } }),
  ]);
  if (!article) notFound();

  return (
    <AdminShell title="تعديل المقال" admin={admin}>
      <ArticleStatusBar id={article.id} status={article.status} />
      <ArticleForm
        courses={courses}
        initial={{
          id: article.id,
          slug: article.slug,
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          pillar: article.pillar,
          icon: article.icon,
          seoTitle: article.seoTitle ?? "",
          seoDescription: article.seoDescription ?? "",
          readingMinutes: article.readingMinutes,
          faq: article.faq ?? "",
          relatedCourseId: article.relatedCourseId ?? "",
          ctaText: article.ctaText ?? "",
        }}
      />
    </AdminShell>
  );
}
