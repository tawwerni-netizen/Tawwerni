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
      headline="ركّز أعمق، قرر أسرع،"
      headlineAccent="وابنِ عادات تستمر فعليًا."
      subhead="مش عن الشغل أكتر ساعات — عن التركيز، القرارات الواضحة، والعادات المستدامة. أنظمة عملية، مش نصايح عامة تنساها بعد يوم."
      primaryCta="ابدأ مسار الإنتاجية ←"
    />
  );
}
