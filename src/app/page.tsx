import StructuredData from "@/components/StructuredData";
import FaqSchema from "@/components/FaqSchema";
import LandingPageView from "@/components/LandingPageView";

export const dynamic = "force-dynamic";

export default function LandingPage() {
  return (
    <>
      <StructuredData />
      <FaqSchema />
      <LandingPageView />
    </>
  );
}
