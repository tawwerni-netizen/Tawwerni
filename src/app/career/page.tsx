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
      eyebrowEn="💼 28 Days · Real Career Clarity"
      headline="اعرف انت فين، رايح فين،"
      headlineEn="Know Where You Stand, Where You're Going,"
      headlineAccent="وإزاي توصل فعليًا."
      headlineAccentEn="And Exactly How to Reach It."
      subhead="مش مجرد شهادات وكورسات. CV بيعكس نتايج حقيقية، تحضير مقابلات بثقة، وخطة واضحة لخطوتك المهنية الجاية."
      subheadEn="Not just paper certificates. Build an ATS-beating resume, master high-stakes interviews with calm confidence, and craft a step-by-step career acceleration roadmap."
      primaryCta="ابدأ مسار النمو المهني ←"
      primaryCtaEn="Start Career Track Now →"
    />
  );
}
