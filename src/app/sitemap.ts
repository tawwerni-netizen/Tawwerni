import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";
import { allCourses } from "@/content/courses";
import { pillars } from "@/content/hub-pillars";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

/**
 * Only the pages a stranger can actually open.
 *
 * Everything under /app and /admin needs a session, so listing them would send
 * Google to a redirect and waste the crawl. Course pages are listed because
 * their day-one preview is public-facing value worth being found for.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const coursePages: MetadataRoute.Sitemap = allCourses.map((c) => ({
    url: `${siteUrl}/app/learn/${c.meta.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Published articles only — a draft or an empty pillar page has nothing
  // for Google to index and shouldn't be submitted at all.
  const articles = await prisma.article.findMany({
    where: { status: "published" },
    select: { slug: true, pillar: true, updatedAt: true },
  });

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/hub/${a.pillar}/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const pillarsWithContent = new Set(articles.map((a) => a.pillar));
  const pillarPages: MetadataRoute.Sitemap =
    pillarsWithContent.size > 0
      ? [
          { url: `${siteUrl}/hub`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
          ...pillars
            .filter((p) => pillarsWithContent.has(p.key))
            .map((p) => ({
              url: `${siteUrl}/hub/${p.key}`,
              lastModified: now,
              changeFrequency: "weekly" as const,
              priority: 0.5,
            })),
        ]
      : [];

  return [...staticPages, ...coursePages, ...pillarPages, ...articlePages];
}
