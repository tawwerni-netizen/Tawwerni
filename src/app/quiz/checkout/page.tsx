import { ALL_100_TRACKS } from "@/content/tracks100";
import { CAREER_PATHS } from "@/content/career-paths";
import CheckoutForm from "./checkout-form";
import { getPaymentConfig } from "@/lib/payment-config";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const tracks = ALL_100_TRACKS.map((t) => ({
    slug: t.slug,
    title: t.titleAr,
    titleEn: t.titleEn,
    icon: t.icon,
    category: t.pillarNameAr,
    categoryEn: t.pillarNameEn,
  }));

  const careerPaths = CAREER_PATHS.map((cp) => ({
    slug: cp.slug,
    title: cp.titleAr,
    titleEn: cp.titleEn,
    icon: cp.icon,
    targetRoleAr: cp.targetRoleAr,
    targetRoleEn: cp.targetRoleEn,
    tracksCount: cp.stages.reduce((acc, s) => acc + s.tracks.length, 0),
  }));

  const paymentConfig = await getPaymentConfig().catch(() => undefined);

  return (
    <CheckoutForm
      courses={tracks}
      careerPaths={careerPaths}
      initialPaymentConfig={paymentConfig}
    />
  );
}
