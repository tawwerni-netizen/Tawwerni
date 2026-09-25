import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم العمل الحر بالعربي — من مهارة لأول عميل مش نظريات",
  description:
    "مسار 28 يوم يحوّل مهارة عندك بالفعل لدخل حقيقي. اختيار خدمة، بناء بروفايل، وأول عميل — خطوة بخطوة.",
  alternates: { canonical: "/freelancing" },
};

export default function FreelancingLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="el-3amal-el-horr"
      eyebrow="💻 28 يوم · من مهارة لأول عميل"
      eyebrowEn="💻 28 Days · From Skill to Paying Clients"
      headline="حوّل مهارة عندك بالفعل"
      headlineEn="Turn Skills You Already Have"
      headlineAccent="لدخل حقيقي من العمل الحر."
      headlineAccentEn="Into Substantial Freelance Income."
      subhead="مش كلام عام عن الفريلانسينج — خطوات عملية: اختيار خدمة تقدر تبيعها، بناء بروفايل يقنع، وكتابة عرض يوصلك لأول عميل حقيقي."
      subheadEn="No generic advice: packaged high-demand offers, magnetic portfolio positioning, client acquisition proposals, and pricing protecting your work."
      primaryCta="ابدأ مسار العمل الحر ←"
      primaryCtaEn="Start Freelancing Track Now →"
    />
  );
}
