import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم البرمجة وتطوير الويب بالعربي — أساسيات وتطبيقات عملية | Learn Web Development",
  description:
    "مسار 28 يوم من الصفر لبناء مشاريع وتطبيقات حقيقية. مهارة برمجية عملية كل يوم بدون تعقيد ولا حشو نظري.",
  alternates: { canonical: "/coding" },
};

export default function CodingLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="modern-coding-fundamentals"
      eyebrow="💻 28 يوم · بناء برمجيات وتطبيقات حقيقية"
      eyebrowEn="💻 28 Days · Real Software & Web Development"
      headline="تعلّم البرمجة الحديثة"
      headlineEn="Master Modern Web Development"
      headlineAccent="بالكود والتطبيق من أول يوم."
      headlineAccentEn="Through Real Code & Projects From Day 1."
      subhead="مش محاضرات نظرية عن تاريخ الحواسيب — 28 يوم تبني فيهم أدوات ومواقع حقيقية، تفهم كيف تفكر كمبرمج وتطور تطبيقاتك بنفسك."
      subheadEn="No boring computer history: 28 days of building real interactive web projects, thinking algorithmically, and launching functional applications."
      primaryCta="ابدأ مسار البرمجة الآن ←"
      primaryCtaEn="Start Coding Track Now →"
    />
  );
}
