import type { Metadata } from "next";

import { LogoLink } from "@/components/Logo";
import { brand } from "@/content/brand";
import { Downloader } from "@/components/video-downloader/Downloader";
import { getDict, defaultLocale } from "@/components/video-downloader/lib/i18n";

/**
 * A private tool, reachable only by its link.
 *
 * Not linked from anywhere on the site, not in the sitemap, and `noindex`
 * below keeps it out of search. That is deliberate: traffic looking to
 * download a video has no intent to buy a course, and a domain that ranks for
 * it competes with itself on the words that actually sell — quite apart from
 * what it does to an advertising account.
 *
 * There is no auth check, and that is also deliberate: anyone the link is
 * shared with should be able to open it. The link is the permission.
 */
export const metadata: Metadata = {
  title: "أداة التحميل",
  description: "أداة داخلية.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function VideoDownloaderPage() {
  const dict = getDict(defaultLocale);

  /*
   * Whether the backend is wired up yet.
   *
   * Without it every request 404s, and the interface would report that as a
   * generic failure — which reads as a broken tool rather than an unfinished
   * deployment. Saying so plainly costs one line and saves the guesswork.
   */
  const backendReady = Boolean(process.env.VD_API_ORIGIN);

  return (
    /*
      `vd-root` is where the tool's design tokens are redefined in Tawwerni's
      palette — see globals.css. The components underneath were written against
      semantic names (`--color-accent`, `.btn-primary`, `.field`), so the whole
      interface adopts the brand without a single component being edited.
    */
    <div className="vd-root min-h-[100dvh]">
      <header className="vd-header">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
          <LogoLink size={30} href="/" />
          <span className="vd-badge">أداة خاصة</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{dict.hero.title}</h1>
          <p className="muted text-sm sm:text-base">{dict.hero.subtitle}</p>
        </div>

        {!backendReady && (
          <div className="vd-notice">
            <b>الأداة مش موصّلة بالخادم لسه.</b> الواجهة شغّالة، بس التحليل
            والتحميل محتاجين الخادم الخلفي — حطّ عنوانه في متغيّر{" "}
            <code>VD_API_ORIGIN</code> وأعد التشغيل.
          </div>
        )}

        <Downloader locale={defaultLocale} dict={dict} />

        <p className="vd-foot">
          أداة داخلية من {brand.name} · للاستخدام الشخصي ومع المحتوى اللي عندك
          حق تحميله
        </p>
      </main>
    </div>
  );
}
