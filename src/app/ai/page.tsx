import type { Metadata } from "next";
import VerticalLandingPage from "@/components/VerticalLandingPage";

export const metadata: Metadata = {
  title: "تعلّم الذكاء الاصطناعي — عملي مش نظري | Learn AI Practically",
  description:
    "مسار 28 يوم، 5 دقايق في اليوم، تتعلم فيه تستخدم الذكاء الاصطناعي في شغلك فعليًا. مش محاضرات — مهمة عملية كل يوم.",
  alternates: { canonical: "/ai" },
};

export default function AiLandingPage() {
  return (
    <VerticalLandingPage
      courseSlug="tahaddi-28-yawm"
      eyebrow="🤖 28 يوم · مهمة عملية كل يوم"
      eyebrowEn="🤖 28 Days · Daily Practical Action"
      headline="تعلّم الذكاء الاصطناعي"
      headlineEn="Master Artificial Intelligence"
      headlineAccent="بالتطبيق، مش بالمشاهدة."
      headlineAccentEn="Through Real Action, Not Watching."
      subhead="28 يوم، 5 دقايق كل يوم، مهمة عملية واحدة تنفّذها بنفسك — تلخيص، كتابة، تحليل بيانات، أتمتة. مش محاضرات نظرية."
      subheadEn="28 days, 5-15 minutes a day: one actionable task you execute yourself — prompt mastery, data analytics, automated workflows, and AI assistants."
      primaryCta="ابدأ التحدي الآن ←"
      primaryCtaEn="Start The AI Challenge Now →"
    />
  );
}
