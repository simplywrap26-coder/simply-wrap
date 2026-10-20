declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void }
}
const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

/** Loads GA4 only if an ID is set. Add your consent banner before calling this if your region requires one. */
export function initAnalytics() {
  if (!gaId || window.gtag) return;
  const s = document.createElement('script');
  s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { (window.dataLayer as unknown[]).push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', gaId, { send_page_view: false });
}

/** Single integration point: add Meta Pixel, TikTok, etc. calls here. */
export function track(event: string, params: Record<string, unknown> = {}) {
  window.gtag?.('event', event, params);
  window.fbq?.('trackCustom', event, params);
}
