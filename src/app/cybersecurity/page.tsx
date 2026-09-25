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
      eyebrowEn="🔒 28 Days · Practical Security For Everyday Life"
      headline="احمِ حساباتك وفلوسك"
      headlineEn="Protect Your Digital Accounts & Money"
      headlineAccent="من النصب اللي بيحصل فعليًا كل يوم."
      headlineAccentEn="From Modern Scams Happening Daily."
      subhead="مش للمبرمجين بس — لأي حد عنده موبايل وواتساب. اعرف تكتشف رسايل النصب، تحمي حساباتك، وتحمي عيلتك."
      subheadEn="Not just for software engineers — for anyone using WhatsApp and online banking. Spot phishing scams immediately, secure family accounts, and bulletproof passwords."
      primaryCta="ابدأ مسار الأمن السيبراني ←"
      primaryCtaEn="Start Cybersecurity Track Now →"
    />
  );
}
