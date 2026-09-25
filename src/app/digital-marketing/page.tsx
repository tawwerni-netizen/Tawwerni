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
      eyebrowEn="📣 28 Days · Content & Performance Ads"
      headline="سوّق مشروعك بنفسك،"
      headlineEn="Market Your Own Business,"
      headlineAccent="مش بس بوستات من غير نتيجة."
      headlineAccentEn="Not Just Meaningless Likes Without Sales."
      subhead="من تحديد جمهورك لكتابة محتوى يحقق تفاعل لإدارة أول حملة إعلانية وقياس نتيجتها الحقيقية — مش نظريات تسويق."
      subheadEn="From razor-sharp customer targeting to high-converting copywriting, ad campaigns, and measurable return on ad spend."
      primaryCta="ابدأ مسار التسويق الرقمي ←"
      primaryCtaEn="Start Digital Marketing Track Now →"
    />
  );
}
