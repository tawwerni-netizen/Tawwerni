"use client";

import { useEffect } from "react";
import { trackArticleView } from "@/lib/analytics";

export default function ArticleViewPixel({ slug, pillar }: { slug: string; pillar: string }) {
  useEffect(() => {
    trackArticleView(slug, pillar);
  }, [slug, pillar]);

  return null;
}
