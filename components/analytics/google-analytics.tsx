/**
 * Google Analytics 4 Component
 * Loads gtag.js and initializes GA4 tracking
 * Only loads in production when GA_MEASUREMENT_ID is set
 */

import Script from 'next/script';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * GoogleAnalytics Component
 * Add to root layout to enable site-wide tracking
 * Requires NEXT_PUBLIC_GA_MEASUREMENT_ID env variable (format: G-XXXXXXXXXX)
 */
export function GoogleAnalytics() {
  // Don't render in development or if no measurement ID
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* Load gtag.js */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      {/* Initialize GA4 */}
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

/**
 * Track custom events in GA4
 * Usage: trackEvent('button_click', { button_name: 'signup' })
 */
export function trackEvent(
  action: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    window.gtag?.('event', action, params);
  }
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}
