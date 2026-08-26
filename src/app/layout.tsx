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
          Runs before first paint so a night-mode visitor never sees a white
          flash. Falls back to the OS preference when nothing is saved.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('tawwerni-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
