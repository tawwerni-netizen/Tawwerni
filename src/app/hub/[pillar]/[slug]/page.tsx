import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getPillar } from "@/content/hub-pillars";
import { brand, pricing } from "@/content/brand";
import { ArticleBody } from "@/lib/markdown-lite";
import { ldJson } from "@/lib/ld-json";
import { LogoLink } from "@/components/Logo";

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

async function loadArticle(pillarKey: string, slug: string) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { relatedCourse: { select: { slug: true, title: true, icon: true } } },
  });
  if (!article || article.pillar !== pillarKey || article.status !== "published") return null;
  return article;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}): Promise<Metadata> {
  const { pillar, slug } = await params;
  const article = await loadArticle(pillar, slug);
  if (!article) return {};

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    alternates: { canonical: `/hub/${pillar}/${slug}` },
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ pillar: string; slug: string }>;
}) {
  const { pillar: pillarKey, slug } = await params;
  const pillar = getPillar(pillarKey);
  if (!pillar) notFound();

  const article = await loadArticle(pillarKey, slug);
  if (!article) notFound();

  let faqItems: { q: string; a: string }[] = [];
  if (article.faq) {
    try {
      const parsed = JSON.parse(article.faq);
      if (Array.isArray(parsed)) faqItems = parsed;
    } catch {
      /* malformed FAQ JSON — skip the schema, still show the article */
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: ldJson({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: ldJson({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            author: { "@type": "Organization", name: brand.name },
            publisher: { "@type": "Organization", name: brand.name },
            datePublished: article.publishedAt?.toISOString(),
            dateModified: article.updatedAt.toISOString(),
            mainEntityOfPage: `${siteUrl}/hub/${pillarKey}/${slug}`,
          }),
        }}
      />

      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href={`/hub/${pillarKey}`} className="tap px-2 py-2 text-xs text-neutral-500">
            {pillar.icon} {pillar.title}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <p className="mb-2 text-xs font-bold text-brand-600">
          {pillar.icon} {pillar.title} · {article.readingMinutes} دقايق قراءة
        </p>
        <h1 className="mb-4 text-2xl font-bold leading-tight text-neutral-800 md:text-3xl">
          {article.title}
        </h1>
        <p className="mb-8 text-sm leading-relaxed text-neutral-500">{article.excerpt}</p>

        <ArticleBody content={article.content} />

        {faqItems.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 text-lg font-bold text-neutral-800">أسئلة شائعة</h2>
            <div className="space-y-2">
              {faqItems.map((f, i) => (
                <details key={i} className="rounded-xl border border-black/5 bg-white p-3">
                  <summary className="cursor-pointer text-sm font-bold text-neutral-800">{f.q}</summary>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {article.relatedCourse && (
          <div className="mt-10 rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-center text-white">
            <p className="mb-1 text-lg font-bold">عايز تتعلم ده عمليًا؟</p>
            <p className="mb-4 text-sm text-white/80">
              {article.ctaText || `مسار "${article.relatedCourse.title}" بياخدك خطوة بخطوة — اليوم الأول مجاني.`}
            </p>
            <Link
              href={`/app/learn/${article.relatedCourse.slug}`}
              className="btn-ghost-shine inline-block rounded-full bg-white px-6 py-3 text-sm font-bold text-brand-800"
            >
              {article.relatedCourse.icon} جرّب اليوم الأول مجانًا ←
            </Link>
            <p className="mt-3 text-xs text-white/70">
              {pricing.priceEgp} جنيه دفعة واحدة لكل المسارات · وصول مدى الحياة
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
