import type { Metadata } from "next";
import { promptCategories, totalPromptCount } from "@/content/lead-magnet-prompts";
import AiPromptsClient from "@/components/AiPromptsClient";

export const metadata: Metadata = {
  title: `${totalPromptCount} Battle-Tested AI Prompts / برومبت ذكاء اصطناعي`,
  description:
    "Free curated collection of 100 battle-tested AI prompts for work, content, business, and study. Copy and deploy instantly.",
  alternates: { canonical: "/lead-magnets/ai-prompts" },
};

export default function AiPromptsLeadMagnetPage() {
  return <AiPromptsClient categories={promptCategories} totalCount={totalPromptCount} />;
}
