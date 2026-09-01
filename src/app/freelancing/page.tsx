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
      headline="حوّل مهارة عندك بالفعل"
      headlineAccent="لدخل حقيقي من العمل الحر."
      subhead="مش كلام عام عن الفريلانسينج — خطوات عملية: اختيار خدمة تقدر تبيعها، بناء بروفايل يقنع، وكتابة عرض يوصلك لأول عميل حقيقي."
      primaryCta="ابدأ مسار العمل الحر ←"
    />
  );
}
