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
      disallow: ["/admin", "/api/", "/reset-password", "/forgot-password"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
