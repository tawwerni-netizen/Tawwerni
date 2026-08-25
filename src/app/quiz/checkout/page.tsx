import { allCourses } from "@/content/courses";
import CheckoutForm from "./checkout-form";

export default function CheckoutPage() {
  const courses = allCourses.map((c) => ({
    slug: c.meta.slug,
    title: c.meta.title,
    icon: c.meta.icon,
    category: c.meta.category,
  }));

  return <CheckoutForm courses={courses} />;
}
