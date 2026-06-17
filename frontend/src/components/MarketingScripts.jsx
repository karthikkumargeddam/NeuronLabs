"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { captureUTMParams, trackEvent } from "@/lib/analytics";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function MarketingScripts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Capture UTM params on every navigation
  useEffect(() => {
    captureUTMParams();
  }, [pathname, searchParams]);

  // Track SPA page views on route change
  useEffect(() => {
    trackEvent("page_view", { page_path: pathname });
  }, [pathname]);

  return (
    <>
      {/* ── Google Tag Manager ── */}
      {GTM_ID && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* ── Microsoft Clarity ── */}
      {CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.bing.com/clarity/s/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}
    </>
  );
}
