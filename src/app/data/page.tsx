import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم تحليل البيانات بالعربي — إكسل و AI من غير تعقيد",
  description:
    "مسار 28 يوم من جدول أرقام مربك لقرار واضح مبني على بيانات حقيقية. إكسل، تنظيف بيانات، وتحليل بمساعدة AI.",
  alternates: { canonical: "/data" },
};

export default function DataLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="tahlil-el-bayanat"
      eyebrow="📊 28 يوم · إكسل وتحليل عملي"
      headline="اقرا أرقام شغلك صح،"
      headlineAccent="بدل ما تخمّن وتتمنى."
      subhead="تنظيف بيانات، معادلات إكسل الأساسية، رسوم بيانية، وتحليل بمساعدة AI — مهارة تستخدمها في أي شغل أو مشروع."
      primaryCta="ابدأ مسار تحليل البيانات ←"
    />
  );
}
