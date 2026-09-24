import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import StructuredData from "@/components/StructuredData";
import FaqSchema from "@/components/FaqSchema";
import LandingPageView from "@/components/LandingPageView";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const userId = await getSessionUserId();
  if (userId) {
    redirect("/app");
  }

  return (
    <>
      <StructuredData />
      <FaqSchema />
      <LandingPageView />
    </>
  );
}
