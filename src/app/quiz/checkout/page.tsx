import { ALL_100_TRACKS } from "@/content/tracks100";
import CheckoutForm from "./checkout-form";
import { getPaymentConfig } from "@/lib/payment-config";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const courses = ALL_100_TRACKS.map((t) => ({
    slug: t.slug,
    title: t.titleAr,
    titleEn: t.titleEn,
    icon: t.icon,
    category: t.pillarNameAr,
    categoryEn: t.pillarNameEn,
  }));

  const paymentConfig = await getPaymentConfig().catch(() => undefined);

  return <CheckoutForm courses={courses} initialPaymentConfig={paymentConfig} />;
}
