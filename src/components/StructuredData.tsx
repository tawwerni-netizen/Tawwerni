import { brand, pricing, payment } from "@/content/brand";
import { allCourses, courseStats } from "@/content/courses";

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

/**
 * Schema.org data for the landing page.
 *
 * This is what turns a plain blue search result into one that shows the price,
 * the course list and an FAQ dropdown underneath it — which is most of the
 * difference in whether the result gets clicked. Google can't infer any of it
 * from Arabic prose.
 *
 * Everything here is generated from the same constants the site sells from, so
 * a price change can't leave a stale number in the markup. Stating a price in
 * structured data that doesn't match the page is a policy violation, not just
 * an inaccuracy.
 */
export default function StructuredData() {
  const courses = allCourses.map((c) => ({ ...c.meta, ...courseStats(c) }));

  const graph = [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#org`,
      name: brand.name,
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
      email: payment.supportEmail,
      areaServed: "EG",
      sameAs: [],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#site`,
      url: siteUrl,
      name: brand.name,
      inLanguage: "ar",
      publisher: { "@id": `${siteUrl}/#org` },
    },
    {
      "@type": "Product",
      "@id": `${siteUrl}/#subscription`,
      name: `اشتراك ${brand.name}`,
      description: `وصول مدى الحياة لكل مسارات ${brand.name} — ${courses.length} مسارات بالعربي.`,
      brand: { "@id": `${siteUrl}/#org` },
      offers: {
        "@type": "Offer",
        price: String(pricing.priceEgp),
        priceCurrency: "EGP",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/quiz/checkout`,
      },
    },
    ...courses.map((c) => ({
      "@type": "Course",
      name: c.title,
      description: c.description,
      inLanguage: "ar",
      provider: { "@id": `${siteUrl}/#org` },
      // Google requires an instance; without it the Course type is dropped.
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: `PT${c.totalLessons * 5}M`,
      },
      offers: {
        "@type": "Offer",
        price: String(pricing.priceEgp),
        priceCurrency: "EGP",
        category: "Paid",
      },
    })),
  ];

  return (
    <script
      type="application/ld+json"
      // Server-rendered from constants only — no user input reaches this.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
