import type { Metadata } from "next";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { promptCategories, totalPromptCount } from "@/content/lead-magnet-prompts";
import LeadMagnetGate from "@/components/LeadMagnetGate";

export const metadata: Metadata = {
  title: `${totalPromptCount} برومبت ذكاء اصطناعي جاهزين للاستخدام`,
  description:
    "مجموعة برومبتات حقيقية ومجربة للشغل والمذاكرة والمشروع، مقسّمة حسب الموضوع — انسخ وجرّب فورًا.",
  alternates: { canonical: "/lead-magnets/ai-prompts" },
};

export default function AiPromptsLeadMagnetPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href="/" className="tap px-2 py-2 text-xs text-neutral-500">
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mx-auto mb-8 max-w-lg text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs text-brand-800">
            🎁 مجاني · بدون كارت بنكي
          </span>
          <h1 className="mb-3 text-2xl font-bold leading-tight md:text-3xl">
            {totalPromptCount} برومبت جاهز
            <br />
            <span className="text-brand-600">تنسخه وتستخدمه دلوقتي</span>
          </h1>
          <p className="text-sm leading-relaxed text-neutral-500">
            مش برومبتات عامة زي &ldquo;اكتبلي بوست&rdquo; — دي قوالب محددة
            لمواقف حقيقية في شغلك ومذاكرتك ومشروعك، مقسّمة على{" "}
            {promptCategories.length} موضوعات.
          </p>
        </div>

        <LeadMagnetGate categories={promptCategories} />
      </main>
    </div>
  );
}
