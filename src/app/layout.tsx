import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { brand, pricing } from "@/content/brand";
import { allCourses, courseStats } from "@/content/courses";
import { ALL_100_TRACKS } from "@/content/tracks100";
import { coursesWord } from "@/lib/arabic-plural";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { LanguageProvider } from "@/components/LanguageContext";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

/*
 * The preview card is the whole distribution channel.
 */
const total100Lessons = ALL_100_TRACKS.reduce((sum, t) => sum + t.totalLessons, 0);

const shareTitle = `${brand.name} — الموقع ده اتبنى بالذكاء الاصطناعي`;

const description = `١٠٠ مسار احترافي وأكثر من ${total100Lessons} درس تطبيقي بالعربية والإنجليزية، ٥ دقايق في اليوم. اشتراك واحد ${pricing.priceEgp} ج.م مدى الحياة — واليوم الأول من كل مسار مجانًا.`;

/**
 * Metadata, including the link preview card.
 *
 * The site previously shipped a title and one line of description and nothing
 * else — so a link pasted into WhatsApp appeared as bare blue text with no
 * image and no context. For an Arabic audience where WhatsApp is the main way
 * anything spreads, that is the difference between a link that gets opened and
 * one that gets ignored. `opengraph-image.tsx` next to this file draws the card.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description,
  applicationName: brand.name,
  keywords: [
    "تعلم الذكاء الاصطناعي بالعربي",
    "كورس ذكاء اصطناعي",
    "تطوير الذات",
    "كورسات عربية",
    "ChatGPT بالعربي",
    "كلود لمديري المشاريع",
    "دخل إضافي",
  ],
  authors: [{ name: brand.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: brand.name,
    title: shareTitle,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Pinch-zoom stays available: capping it is an accessibility problem, not a
  // polish detail — plenty of readers need it.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7faf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1210" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/*
          Runs before first paint so nobody sees a flash of the wrong theme.

          Dark is the default for a first-time visitor — it is the look the
          brand is built around, and this is a product people open at night.
          A saved choice always wins; the OS preference is deliberately not
          consulted, because a visitor whose laptop is set to light would
          otherwise never see the design as intended.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var s=localStorage.getItem('tawwerni-theme');
              document.documentElement.dataset.theme=s==='light'?'light':'dark';
              var l=localStorage.getItem('tawwerni-lang')||'ar';
              document.documentElement.lang=l;
              document.documentElement.dir=l==='en'?'ltr':'rtl';
            }catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
