import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { pillars } from "@/content/hub-pillars";
import { LogoLink } from "@/components/Logo";

export const metadata: Metadata = {
  title: "مركز الذكاء الاصطناعي",
  description: "مقالات عملية عن استخدام الذكاء الاصطناعي — من غير كلام عام.",
  alternates: { canonical: "/hub" },
};

export default async function HubIndexPage() {
  const counts = await prisma.article.groupBy({
    by: ["pillar"],
    where: { status: "published" },
    _count: { _all: true },
  });
  const countMap = new Map(counts.map((c) => [c.pillar, c._count._all]));

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href="/" className="tap px-2 py-2 text-xs text-neutral-500">
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-neutral-800">مركز الذكاء الاصطناعي</h1>
          <p className="text-sm text-neutral-500">مقالات عملية، مقسّمة حسب الموضوع.</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Link
              key={p.key}
              href={`/hub/${p.key}`}
              className="course-card animate-rise"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="course-card-wash" aria-hidden />
              <span className="course-card-icon" aria-hidden>
                {p.icon}
              </span>
              <span className="course-card-body">
                <span className="course-card-title">{p.title}</span>
                <span className="course-card-desc">{p.description}</span>
                <span className="course-card-meta">{countMap.get(p.key) ?? 0} مقال</span>
              </span>
              <span className="course-card-go" aria-hidden>
                ←
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
