import { getCurrentUser } from "@/lib/auth";
import { getUserInventory } from "@/lib/entitlements";
import { getDeterministicRecommendation } from "@/lib/recommendations";
import InventoryView from "@/components/InventoryView";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "مكتبتي التعليمية | طوّرني",
  description: "مخزونك التعليمي الممتلك من المسارات المهنية والتخصصية وإنجازاتك اليومية في طوّرني.",
};

export default async function InventoryPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const inventory = await getUserInventory(user.id);
  const recommendation = getDeterministicRecommendation(inventory);

  return (
    <InventoryView
      inventory={inventory}
      recommendation={recommendation}
      userName={user.name || "يا بطل"}
    />
  );
}
