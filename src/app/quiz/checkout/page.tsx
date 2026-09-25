import { ALL_100_TRACKS } from "@/content/tracks100";
import CheckoutForm from "./checkout-form";

export default function CheckoutPage() {
  const courses = ALL_100_TRACKS.map((t) => ({
    slug: t.slug,
    title: t.titleAr,
    titleEn: t.titleEn,
    icon: t.icon,
    category: t.pillarNameAr,
    categoryEn: t.pillarNameEn,
  }));

  return <CheckoutForm courses={courses} />;
}
