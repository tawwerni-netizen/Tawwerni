import type { MetadataRoute } from "next";
import { brand } from "@/content/brand";

/**
 * Makes "أضف إلى الشاشة الرئيسية" produce a real app icon rather than a
 * browser bookmark — it opens without the address bar and sits on the home
 * screen like anything else. On a daily-habit product that matters: the
 * difference between an icon the learner sees every morning and a URL they
 * have to remember to type is most of the retention.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brand.name} — ${brand.tagline}`,
    short_name: brand.name,
    description: "درس واحد كل يوم في ٥ دقايق، بالعربي.",
    start_url: "/app",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7faf9",
    theme_color: "#0F6E56",
    dir: "rtl",
    lang: "ar",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
