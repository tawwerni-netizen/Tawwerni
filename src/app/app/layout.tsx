import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";
import FaqWidget from "@/components/FaqWidget";

export default async function AppLayout({ children }: LayoutProps<"/app">) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.dailyPaceMinutes == null) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-md min-h-screen bg-neutral-50 pb-20">{children}</div>
      <FaqWidget />
      <BottomNav />
    </div>
  );
}
