import Script from "next/script";
import { PIXEL_ID } from "@/lib/pixel";

/**
 * The Meta Pixel.
 *
 * Three things differ from the snippet Meta hands you:
 *
 * 1. It loads only in production. A pixel firing from a developer's laptop
 *    teaches the ad algorithm that people who never buy look like buyers.
 *
 * 2. It goes through `next/script` with `afterInteractive`, so Facebook's
 *    script cannot block the page from becoming usable. The raw snippet is a
 *    blocking `<script>` in `<head>`.
 *
 * 3. The `<noscript>` pixel is dropped. It exists to catch visitors with
 *    JavaScript disabled — who cannot use this app at all, since every page
 *    past the landing page is interactive. It would only ever report people
 *    who could not have bought.
 */
export default function MetaPixel() {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');
fbq('track','PageView');`}
    </Script>
  );
}
