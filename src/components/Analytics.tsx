import Script from "next/script";
import { META_PIXEL_ID, GA_MEASUREMENT_ID } from "@/lib/analytics";

/**
 * Meta Pixel and Google Analytics.
 *
 * Both differ from the snippets each platform hands you, in the same three ways:
 *
 * 1. They load only in production. A pixel firing from a developer's laptop
 *    teaches the ad algorithm that people who never buy look like buyers.
 *
 * 2. They go through `next/script` with `afterInteractive`, so neither
 *    Facebook's nor Google's script can hold up the page becoming usable.
 *    Meta's raw snippet is a blocking `<script>` in `<head>`.
 *
 * 3. Meta's `<noscript>` fallback is dropped. It exists to catch visitors with
 *    JavaScript disabled — who cannot use this app at all, since every page
 *    past the landing page is interactive. It would only ever report people
 *    who could not have bought.
 */
export default function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');
fbq('track','PageView');`}
      </Script>

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
