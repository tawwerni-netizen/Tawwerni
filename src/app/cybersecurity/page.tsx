import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم الأمن السيبراني بالعربي — احمِ حساباتك وفلوسك من النصب",
  description:
    "مسار 28 يوم يحميك من النصب الرقمي المنتشر — كلمات سر، تحقق ثنائي، وطرق كشف الاحتيال الشائعة في مصر.",
  alternates: { canonical: "/cybersecurity" },
};

export default function CybersecurityLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="el-aman-el-raqamy"
      eyebrow="🔒 28 يوم · حماية حقيقية لأي حد"
      headline="احمِ حساباتك وفلوسك"
      headlineAccent="من النصب اللي بيحصل فعليًا كل يوم."
      subhead="مش للمبرمجين بس — لأي حد عنده موبايل وواتساب. اعرف تكتشف رسايل النصب، تحمي حساباتك، وتحمي عيلتك."
      primaryCta="ابدأ مسار الأمن السيبراني ←"
    />
  );
}
