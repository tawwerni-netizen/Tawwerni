import { adminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import AdminLogin from "@/components/AdminLogin";
import AdminShell from "@/components/AdminShell";
import ArticleForm from "@/components/ArticleForm";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const admin = await adminUser();
  if (!admin) return <AdminLogin />;

  const courses = await prisma.course.findMany({
    where: { isComingSoon: false },
    select: { id: true, title: true },
    orderBy: { order: "asc" },
  });

  return (
    <AdminShell title="مقال جديد" admin={admin}>
      <ArticleForm courses={courses} />
    </AdminShell>
  );
}
