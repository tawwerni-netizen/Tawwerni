import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPillar } from "@/content/hub-pillars";
import { LogoLink } from "@/components/Logo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string }>;
}): Promise<Metadata> {
  const { pillar: key } = await params;
  const pillar = getPillar(key);
  if (!pillar) return {};
  return {
    title: pillar.title,
    description: pillar.description,
    alternates: { canonical: `/hub/${key}` },
  };
}

export default async function PillarPage({ params }: { params: Promise<{ pillar: string }> }) {
  const { pillar: key } = await params;
  const pillar = getPillar(key);
  if (!pillar) notFound();

  const articles = await prisma.article.findMany({
    where: { pillar: key, status: "published" },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, excerpt: true, readingMinutes: true, icon: true },
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href="/hub" className="tap px-2 py-2 text-xs text-neutral-500">
            كل المواضيع
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 text-3xl">{pillar.icon}</div>
          <h1 className="mb-2 text-2xl font-bold text-neutral-800">{pillar.title}</h1>
          <p className="text-sm text-neutral-500">{pillar.description}</p>
        </div>

        {articles.length === 0 ? (
          <p className="rounded-2xl border border-black/5 bg-white p-6 text-center text-sm text-neutral-500">
            المقالات جاية قريب. تقدر {" "}
            <Link href="/quiz" className="font-bold text-brand-600">
              تبدأ التحدي دلوقتي
            </Link>
            {" "} لحد ما تتنشر.
          </p>
        ) : (
          <div className="space-y-3">
            {articles.map((a, i) => (
              <Link
                key={a.slug}
                href={`/hub/${key}/${a.slug}`}
                className="course-card animate-rise"
                style={{ animationDelay: `${Math.min(i, 10) * 60}ms` }}
              >
                <span className="course-card-wash" aria-hidden />
                <span className="course-card-icon" aria-hidden>
                  {a.icon}
                </span>
                <span className="course-card-body">
                  <span className="course-card-title">{a.title}</span>
                  <span className="course-card-desc">{a.excerpt}</span>
                  <span className="course-card-meta">{a.readingMinutes} دقايق قراءة</span>
                </span>
                <span className="course-card-go" aria-hidden>
                  ←
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
