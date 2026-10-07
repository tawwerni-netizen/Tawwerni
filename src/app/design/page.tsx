import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم تصميم واجهات المستخدم وتجربة المستخدم بالعربي — فيجما وتطبيقات واقعية | UI/UX Design",
  description:
    "مسار 28 يوم من الصفر لتصميم واجهات وتطبيقات احترافية بأداة فيجما Figma. مهارة تصميمية عملية كل يوم تنتهي ببورتفوليو حقيقي.",
  alternates: { canonical: "/design" },
};

export default function DesignLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="ui-ux-design-figma"
      eyebrow="🎨 28 يوم · تصميم واجهات احترافية بفجما"
      eyebrowEn="🎨 28 Days · Figma Mastery & UI/UX Design"
      headline="احترف تصميم الـ UI/UX"
      headlineEn="Master UI/UX Design with Figma"
      headlineAccent="وابنِ بورتفوليو يجذب العملاء."
      headlineAccentEn="And Build a High-Converting Portfolio."
      subhead="من أساسيات شبكات التصميم والألوان والتايبوجرافي إلى مكونات فيجما التفاعلية وتصميم تطبيقات كاملة — خطوة بخطوة ومهام يومية مركزة."
      subheadEn="From responsive grids, color theory, and typography to advanced interactive Figma design systems and mobile app mockups."
      primaryCta="ابدأ مسار التصميم الآن ←"
      primaryCtaEn="Start UI/UX Track Now →"
    />
  );
}
