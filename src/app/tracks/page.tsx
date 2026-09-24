import Link from "next/link";
import { brand } from "@/content/brand";
import TrackExplorer from "@/components/TrackExplorer";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { LogoLink } from "@/components/Logo";

export const metadata = {
  title: "100 مسار احترافي في الذكاء الاصطناعي، البرمجة، والعمل الحر",
  description: "استكشف 100 مسار تدريبي متاحين باشتراك واحد مدى الحياة في منصة طوّرني (Tawwerni.com)",
};

export default function TracksPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Top Header */}
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
              href="/app"
              className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 px-4 py-2 text-xs font-bold text-neutral-950 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-teal-500/15"
            >
              ابدأ التعلّم
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 px-4 sm:px-6 border-b border-neutral-900">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-bold text-teal-300 mb-4 animate-fade-in">
            <span>✨</span>
            <span>الكتالوج الشامل · 100 مسار احترافي متكامل</span>
          </span>

          <h1 className="text-3xl font-black sm:text-5xl tracking-tight text-white mb-4">
            كل مهارات المستقبل، <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
              في اشتراك واحد مدى الحياة
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            100 مسار عملي مقسمة على 10 قطاعات أساسية. كل درس مدته 5 دقائق فقط مع تدريب عملي ومساعد ذكاء اصطناعي لدعمك في كل خطوة.
          </p>
        </div>
      </section>

      {/* Explorer Component */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex-1 w-full">
        <TrackExplorer />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} {brand.name} ({brand.domain}) · {brand.tagline}</p>
      </footer>
    </div>
  );
}
