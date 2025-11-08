import { onCLS, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';

const sendToAnalytics = (metric: Metric) => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
  }

  // Send to your analytics service in production
  // Example: Google Analytics
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag;
    gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_value: metric.value,
      metric_delta: metric.delta,
      metric_rating: metric.rating,
    });
  }
};

export const initWebVitals = () => {
  onCLS(sendToAnalytics);
  onFCP(sendToAnalytics); // First Contentful Paint
  onINP(sendToAnalytics); // Interaction to Next Paint (replaces FID)
  onLCP(sendToAnalytics); // Largest Contentful Paint
  onTTFB(sendToAnalytics); // Time to First Byte
};
