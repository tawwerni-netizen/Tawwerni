import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin panel and the API are never useful in a search result, and
      // /reset-password carries a token in the URL that must not be indexed.
      // /VideoDownloader is a private tool shared by link. The page also carries
      // a `noindex` tag, which is the rule that actually binds — a Disallow only
      // stops the crawl, so a URL linked from elsewhere can still be listed
      // without ever being fetched. Both together close it properly.
      disallow: ["/admin", "/api/", "/reset-password", "/forgot-password", "/VideoDownloader"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
