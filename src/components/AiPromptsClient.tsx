"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useI18n } from "@/components/LanguageContext";
import LeadMagnetGate from "@/components/LeadMagnetGate";
import type { PromptCategory } from "@/content/lead-magnet-prompts";

export default function AiPromptsClient({
  categories,
  totalCount,
}: {
  categories: PromptCategory[];
  totalCount: number;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors" dir={isEn ? "ltr" : "rtl"}>
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <LogoLink size={32} href="/" />
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="tap px-2 py-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10">
        <div className="mx-auto mb-8 max-w-lg text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-50 dark:bg-brand-950/40 border border-brand-200/50 dark:border-brand-800/40 px-3.5 py-1.5 text-xs font-semibold text-brand-800 dark:text-brand-300">
            {isEn ? "🎁 100% Free · No Card Required" : "🎁 مجاني · بدون كارت بنكي"}
          </span>
          <h1 className="mb-3 text-2xl font-black leading-tight sm:text-3xl text-neutral-900 dark:text-white">
            {isEn ? (
              <>
                {totalCount} Battle-Tested Prompts
                <br />
                <span className="text-brand-600 dark:text-brand-400">Ready to Copy & Deploy Today</span>
              </>
            ) : (
              <>
                {totalCount} برومبت جاهز
                <br />
                <span className="text-brand-600 dark:text-brand-400">تنسخه وتستخدمه دلوقتي</span>
              </>
            )}
          </h1>
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            {isEn
              ? `Not generic prompts like "write me a post" — these are battle-tested, structured frameworks for real work, study, and business across ${categories.length} specialized categories.`
              : `مش برومبتات عامة زي "اكتبلي بوست" — دي قوالب محددة لمواقف حقيقية في شغلك ومذاكرتك ومشروعك، مقسّمة على ${categories.length} موضوعات.`}
          </p>
        </div>

        <LeadMagnetGate categories={categories} />
      </main>
    </div>
  );
}
