'use client';

import { useEffect, useRef, RefObject } from 'react';
import { usePerformance } from '@/hooks/usePerformance';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface ComponentPerformanceOptions {
  threshold?: number;
  rootMargin?: string;
  trackPerformance?: boolean;
  reportToAnalytics?: boolean;
  componentName?: string;
}

interface ComponentPerformanceResult<T extends Element> {
  ref: RefObject<T>;
  isVisible: boolean;
  metrics: {
    fcp: number | null;
    lcp: number | null;
    cls: number | null;
    fid: number | null;
    ttfb: number | null;
  };
}

/**
 * Unified performance hook that combines intersection observer for lazy loading
 * with Core Web Vitals tracking for performance monitoring
 */
export function useComponentPerformance<T extends Element>(
  options: ComponentPerformanceOptions = {}
): ComponentPerformanceResult<T> {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    trackPerformance = true,
    reportToAnalytics = false,
    componentName = 'Component'
  } = options;

  // Track performance metrics
  const metrics = usePerformance(reportToAnalytics);
  
  // Track visibility with intersection observer
  const [ref, isVisible] = useIntersectionObserver<T>({
    threshold,
    rootMargin,
    enabled: true
  });

  // Log performance when component becomes visible
  const hasLogged = useRef(false);
  
  useEffect(() => {
    if (isVisible && trackPerformance && !hasLogged.current) {
      hasLogged.current = true;
      
      // Log performance metrics when component enters viewport
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} visible:`, {
          fcp: metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A',
          lcp: metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A',
          cls: metrics.cls ? metrics.cls.toFixed(4) : 'N/A',
          fid: metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A',
          ttfb: metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'N/A'
        });
      }
    }
  }, [isVisible, trackPerformance, componentName, metrics]);

  return {
    ref,
    isVisible,
    metrics
  };
}

