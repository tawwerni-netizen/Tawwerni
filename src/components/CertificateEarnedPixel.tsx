"use client";

import { useEffect } from "react";
import { trackCertificateEarned } from "@/lib/analytics";

export default function CertificateEarnedPixel({ courseSlug }: { courseSlug: string }) {
  useEffect(() => {
    trackCertificateEarned(courseSlug);
  }, [courseSlug]);

  return null;
}
