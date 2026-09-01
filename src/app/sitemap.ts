import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";
import { allCourses } from "@/content/courses";

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

/**
 * Only the pages a stranger can actually open.
 *
 * Everything under /app and /admin needs a session, so listing them would send
 * Google to a redirect and waste the crawl. Course pages are listed because
 * their day-one preview is public-facing value worth being found for.
 */
export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...staticPages, ...coursePages];
}
