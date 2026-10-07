import { redirect } from "next/navigation";

export default async function TrackSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/app/learn/${slug}`);
}
