import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasVipAccess } from "@/lib/access";
import VipVaultClient from "@/components/VipVaultClient";
import { LEGAL_CONTRACTS, PROMPTS_VAULT, TOTAL_PROMPTS_COUNT } from "@/content/vip-vault-data";

export const metadata: Metadata = {
  title: "خزنة VIP · بنك الـ 1,000 برومبت وعقود الفريلانس القانونية",
  description: "خزنة حصرية مخصصة لأعضاء الترقية: بنك برومبتات الذكاء الاصطناعي للشركات وحزمة العقود القانونية لحماية الأتعاب.",
};

export default async function VipVaultPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isVip = await hasVipAccess(user.id);

  return (
    <VipVaultClient
      isVip={isVip}
      userName={user.name ?? user.email}
      userEmail={user.email}
      prompts={PROMPTS_VAULT}
      contracts={LEGAL_CONTRACTS}
      totalPromptsCount={TOTAL_PROMPTS_COUNT}
    />
  );
}
