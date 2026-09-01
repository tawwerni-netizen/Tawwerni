import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "طوّر مسارك المهني بالعربي — وضوح حقيقي مش شهادات فاضية",
  description:
    "مسار 28 يوم يبني وضوح مهني حقيقي: CV يعدّي الفلاتر، مقابلات بثقة، وخطة واضحة لخطوتك الجاية.",
  alternates: { canonical: "/career" },
};

export default function CareerLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="nomo-mehany"
      eyebrow="💼 28 يوم · وضوح مهني حقيقي"
      headline="اعرف انت فين، رايح فين،"
      headlineAccent="وإزاي توصل فعليًا."
      subhead="مش مجرد شهادات وكورسات. CV بيعكس نتايج حقيقية، تحضير مقابلات بثقة، وخطة واضحة لخطوتك المهنية الجاية."
      primaryCta="ابدأ مسار النمو المهني ←"
    />
  );
}
