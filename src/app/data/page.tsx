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
      eyebrowEn="📊 28 Days · Excel, SQL & Practical Analytics"
      headline="اقرا أرقام شغلك صح،"
      headlineEn="Read Your Business Numbers Correctly,"
      headlineAccent="بدل ما تخمّن وتتمنى."
      headlineAccentEn="Instead of Guessing and Hoping."
      subhead="تنظيف بيانات، معادلات إكسل الأساسية، رسوم بيانية، وتحليل بمساعدة AI — مهارة تستخدمها في أي شغل أو مشروع."
      subheadEn="Data cleaning, pivot dashboards, automated reporting, and AI-accelerated analytics — essential capabilities applicable to any company or venture."
      primaryCta="ابدأ مسار تحليل البيانات ←"
      primaryCtaEn="Start Data Analytics Track Now →"
    />
  );
}
