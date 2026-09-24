import Link from "next/link";
import { brand } from "@/content/brand";
import CommunityWall from "@/components/CommunityWall";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";

export const metadata = {
  title: "مجتمع طوّرني — 300 قصة نجاح موثقة من أرض الواقع",
  description: "اكتشف تجارب وقصص نجاح 300 عضو حقيقي في منصة طوّرني وتعرف على تحولاتهم المهنية في الذكاء الاصطناعي والعمل الحر.",
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <LogoLink size={34} />
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-white transition-colors hidden sm:inline"
            >
              ← العودة للرئيسية
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/tracks"
              className="text-xs text-neutral-300 hover:text-white transition-colors hidden sm:inline"
            >
              تصفح الـ 100 مسار
            </Link>
            <Link
              href="/app"
              className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/15"
            >
              انضم للمجتمع
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <CommunityWall />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} {brand.name} ({brand.domain}) · مجتمع الرواد الأوائل</p>
      </footer>
    </div>
  );
}
