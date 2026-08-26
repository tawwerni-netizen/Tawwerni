import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import { brand, pricing } from "@/content/brand";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const siteUrl = process.env.PUBLIC_ORIGIN?.replace(/\/$/, "") ?? `https://${brand.domain}`;

const description = `درس واحد كل يوم في ٥ دقايق، بالعربي. ٦ مسارات كاملة — ذكاء اصطناعي، أعمال، نمو مهني، عادات، وصحة — باشتراك واحد ${pricing.priceEgp} ج.م. اليوم الأول مجانًا.`;

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
    title: `${brand.name} — ${brand.tagline}`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
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
            __html: `(function(){try{var s=localStorage.getItem('tawwerni-theme');document.documentElement.dataset.theme=s==='light'?'light':'dark';}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
