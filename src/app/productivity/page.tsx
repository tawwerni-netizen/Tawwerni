import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "زوّد إنتاجيتك بالعربي — تركيز وقرارات وعادات تستمر فعليًا",
  description:
    "مسار 28 يوم لإدارة الوقت والتركيز واتخاذ القرار وبناء عادات مستدامة — أنظمة عملية تكمّل عليها فعلًا.",
  alternates: { canonical: "/productivity" },
};

export default function ProductivityLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="el-entagiya"
      eyebrow="⚡ 28 يوم · أنظمة تكمّل عليها فعلًا"
      eyebrowEn="⚡ 28 Days · Sustainable Peak Performance Systems"
      headline="ركّز أعمق، قرر أسرع،"
      headlineEn="Focus Deeper, Decide Faster,"
      headlineAccent="وابنِ عادات تستمر فعليًا."
      headlineAccentEn="And Build Atomic Habits That Stick."
      subhead="مش عن الشغل أكتر ساعات — عن التركيز، القرارات الواضحة، والعادات المستدامة. أنظمة عملية، مش نصايح عامة تنساها بعد يوم."
      subheadEn="Not about working more brutal hours — it's about sharp cognitive focus, rapid executive decisions, and sustainable momentum."
      primaryCta="ابدأ مسار الإنتاجية ←"
      primaryCtaEn="Start Productivity Track Now →"
    />
  );
}
