import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasVipAccess } from "@/lib/access";
import VipVaultClient from "@/components/VipVaultClient";
import {
  LEGAL_CONTRACTS,
  PROMPTS_VAULT,
  TOTAL_PROMPTS_COUNT,
  DOMAINS_INDEX,
  TOTAL_DOMAINS_COUNT,
} from "@/content/vip-vault-data";

export const metadata: Metadata = {
  title: "خزنة VIP · قاعدة الـ 10,000 برومبت وعقود الفريلانس القانونية",
  description:
    "خزنة حصرية مخصصة لأعضاء الترقية: قاعدة بيانات الـ 10,000 برومبت تنفيذي للشركات (100 مجال × 100 برومبت) وحزمة العقود القانونية لحماية الأتعاب.",
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
      domains={DOMAINS_INDEX}
      contracts={LEGAL_CONTRACTS}
      totalPromptsCount={TOTAL_PROMPTS_COUNT}
      totalDomainsCount={TOTAL_DOMAINS_COUNT}
    />
  );
}
