'use client';

import { useEffect, useRef } from 'react';

type PerformanceMetrics = {
  fcp: number | null;  // First Contentful Paint
  lcp: number | null;  // Largest Contentful Paint
  cls: number | null;  // Cumulative Layout Shift
  fid: number | null;  // First Input Delay
  ttfb: number | null; // Time to First Byte
};

export function usePerformance(reportToAnalytics = false): PerformanceMetrics {
  const metricsRef = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    ttfb: null,
  });

  useEffect(() => {
    // Skip if the Web Vitals API is not available
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    try {
      // Time to First Byte (TTFB)
      if (performance && performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          metricsRef.current.ttfb = navigationEntries[0].responseStart;
        }
      }

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const fcp = entries[0] as PerformanceEntry;
          metricsRef.current.fcp = fcp.startTime;
          if (reportToAnalytics) {
            console.log('FCP:', fcp.startTime);
          }
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        metricsRef.current.lcp = lastEntry.startTime;
        if (reportToAnalytics) {
          console.log('LCP:', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as PerformanceEntry[];
        entries.forEach(entry => {
          // @ts-ignore - We know this exists on layout-shift entries
          if (!entry.hadRecentInput) {
            // @ts-ignore - We know this exists on layout-shift entries
            clsValue += entry.value;
            metricsRef.current.cls = clsValue;
            if (reportToAnalytics) {
              console.log('CLS (updated):', clsValue);
            }
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          const firstInput = entries[0] as PerformanceEventTiming;
          metricsRef.current.fid = firstInput.processingStart - firstInput.startTime;
          if (reportToAnalytics) {
            console.log('FID:', metricsRef.current.fid);
          }
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Cleanup
      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
        fidObserver.disconnect();
      };
    } catch (error) {
      console.error('Error measuring performance metrics:', error);
    }
  }, [reportToAnalytics]);

  return metricsRef.current;
}

// Performance optimization techniques
export interface OptimizationOptions {
  imageLazyLoading?: boolean;
  cssOptimization?: boolean;
  scriptOptimization?: boolean;
  fontOptimization?: boolean;
  preconnect?: boolean;
}

export function applyPerformanceOptimizations(options: OptimizationOptions = {
  imageLazyLoading: true,
  cssOptimization: true,
  scriptOptimization: true,
  fontOptimization: true,
  preconnect: true,
}) {
  if (typeof window === 'undefined') return;

  const {
    imageLazyLoading,
    cssOptimization,
    scriptOptimization,
    fontOptimization,
    preconnect,
  } = options;

  if (imageLazyLoading) {
    optimizeImageLoading();
  }

  if (cssOptimization) {
    optimizeCSSDelivery();
  }

  if (scriptOptimization) {
    optimizeScriptLoading();
  }

  if (fontOptimization) {
    optimizeFontLoading();
  }

  if (preconnect) {
    addPreconnect();
  }
}

function optimizeImageLoading() {
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach(img => {
    if (img.hasAttribute('priority') || img.hasAttribute('data-priority')) return;
    
    // Add lazy loading
    img.setAttribute('loading', 'lazy');
    
    // Add decoding async
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }

    // Add fetchpriority for important above-the-fold images
    if (isAboveTheFold(img) && !img.hasAttribute('fetchpriority')) {
      img.setAttribute('fetchpriority', 'high');
    }

    // Add srcset if missing for responsive images
    if (!img.hasAttribute('srcset') && (img as HTMLImageElement).src) {
      const originalSrc = (img as HTMLImageElement).src;
      const extension = originalSrc.split('.').pop();
      if (extension) {
        img.setAttribute('srcset', `
          ${originalSrc} 1x,
          ${originalSrc.replace(`.${extension}`, `@2x.${extension}`)} 2x
        `.trim());
      }
    }
  });
}

function optimizeCSSDelivery() {
  // Critical CSS optimization
  const styleLinks = document.querySelectorAll('link[rel="stylesheet"]');
  styleLinks.forEach(link => {
    const linkEl = link as HTMLLinkElement;
    
    if (!linkEl.hasAttribute('data-critical')) {
      // Defer non-critical CSS
      linkEl.setAttribute('media', 'print');
      linkEl.setAttribute('onload', `this.media='all'`);
    }

    // Add resource hints
    if (!linkEl.hasAttribute('data-preloaded')) {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'style';
      preloadLink.href = linkEl.href;
      document.head.appendChild(preloadLink);
    }
  });
}

function optimizeScriptLoading() {
  const scripts = document.querySelectorAll('script[src]:not([async]):not([defer])');
  scripts.forEach(script => {
    const scriptEl = script as HTMLScriptElement;
    
    // Add async for non-critical scripts
    if (!scriptEl.hasAttribute('data-critical')) {
      scriptEl.setAttribute('async', '');
    }

    // Add module if it's an ES module
    if (scriptEl.src.endsWith('.mjs')) {
      scriptEl.setAttribute('type', 'module');
    }
  });
}

function optimizeFontLoading() {
  // Add font-display swap to all font faces
  const styleSheets = document.styleSheets;
  try {
    Array.from(styleSheets).forEach(sheet => {
      try {
        const rules = sheet.cssRules || sheet.rules;
        Array.from(rules).forEach(rule => {
          if (rule instanceof CSSFontFaceRule) {
            if (!(rule.style as any).fontDisplay) {
              (rule.style as any).fontDisplay = 'swap';
            }
          }
        });
      } catch (e) {
        // Skip if can't access rules due to CORS
      }
    });
  } catch (e) {
    console.warn('Could not optimize font loading:', e);
  }
}

function addPreconnect() {
  // Add preconnect for common third-party domains
  const commonDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://ajax.googleapis.com',
  ];

  commonDomains.forEach(domain => {
    if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    }
  });
}

function isAboveTheFold(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top <= window.innerHeight;
} 