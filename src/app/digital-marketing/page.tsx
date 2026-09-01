import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم التسويق الرقمي بالعربي — محتوى وإعلانات تجيب عملاء",
  description:
    "مسار 28 يوم من صفحة سوشيال ميديا فاضية لاستراتيجية محتوى وإعلانات بتحوّل مشاهد لعميل فعلي.",
  alternates: { canonical: "/digital-marketing" },
};

export default function DigitalMarketingLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="el-tasweeq-el-raqamy"
      eyebrow="📣 28 يوم · محتوى وإعلانات عملية"
      headline="سوّق مشروعك بنفسك،"
      headlineAccent="مش بس بوستات من غير نتيجة."
      subhead="من تحديد جمهورك لكتابة محتوى يحقق تفاعل لإدارة أول حملة إعلانية وقياس نتيجتها الحقيقية — مش نظريات تسويق."
      primaryCta="ابدأ مسار التسويق الرقمي ←"
    />
  );
}
