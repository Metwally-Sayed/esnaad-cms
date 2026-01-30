'use client';

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// Track custom events
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    (window as unknown as { gtag: (command: string, eventName: string, params?: Record<string, unknown>) => void }).gtag('event', eventName, eventParams);
  }
}

// Track page views (useful for SPA navigation)
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && 'gtag' in window && GA_MEASUREMENT_ID) {
    (window as unknown as { gtag: (command: string, id: string, params: Record<string, unknown>) => void }).gtag('config', GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
}
