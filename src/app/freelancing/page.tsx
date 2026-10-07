import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم العمل الحر بالعربي — بناء خدمات وبورتفوليو مهني",
  description:
    "مسار 28 يوم يحوّل مهارة عندك لخدمات عملية قابلة للعرض. اختيار خدمة، بناء بروفايل، وصياغة عروض مقنعة — خطوة بخطوة.",
  alternates: { canonical: "/freelancing" },
};

export default function FreelancingLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="el-3amal-el-horr"
      eyebrow="💻 28 يوم · بناء خدماتك ومعرض أعمالك"
      eyebrowEn="💻 28 Days · Package Services & Build Portfolio"
      headline="حوّل مهاراتك الشخصية"
      headlineEn="Turn Your Specialized Skills"
      headlineAccent="لخدمات احترافية في العمل الحر."
      headlineAccentEn="Into Professional Freelance Services."
      subhead="مش كلام عام عن الفريلانسينج — خطوات عملية: اختيار خدمة تتقنها، بناء بروفايل مقنع، وصياغة عروض مشاريع احترافية."
      subheadEn="No generic fluff: packaged service offerings, magnetic portfolio positioning, and structured client proposals."
      primaryCta="ابدأ مسار العمل الحر ←"
      primaryCtaEn="Start Freelancing Track Now →"
    />
  );
}
