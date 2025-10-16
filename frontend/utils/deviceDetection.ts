import { useState, useEffect } from 'react';

// Enhanced mobile detection that works in browser dev tools mobile preview
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;

  // Primary check: screen width (works in dev tools mobile preview)
  const isSmallScreen = window.innerWidth <= 768;

  // Secondary checks for actual mobile devices
  const userAgent = navigator.userAgent;
  const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Media query check (works in dev tools)
  const mediaQueryMobile = window.matchMedia('(max-width: 768px)').matches;

  // Enhanced Dev tools mobile preview detection
  const isDevToolsMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  // Additional DevTools detection patterns
  const isDevToolsChrome = userAgent.includes('Chrome') && isSmallScreen;
  const hasDevToolsViewport = window.outerWidth !== window.innerWidth && isSmallScreen;

  // CRITICAL: Enhanced DevTools compatibility
  // Consider mobile if ANY of these conditions are met:
  // 1. Small screen (primary for DevTools)
  // 2. Media query matches (DevTools responsive mode)
  // 3. DevTools mobile simulation detected
  // 4. Chrome DevTools mobile preview
  // 5. Traditional mobile device detection
  return isSmallScreen || mediaQueryMobile || isDevToolsMobile ||
         isDevToolsChrome || hasDevToolsViewport ||
         (isSmallScreen && (isTouchDevice || isMobileUserAgent));
};

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = isMobileDevice();
      setIsMobile(newIsMobile);

      // CRITICAL: DevTools compatibility enhancement
      // Update document classes for CSS targeting
      document.documentElement.classList.toggle('mobile-device', newIsMobile);
      document.documentElement.classList.toggle('desktop-device', !newIsMobile);

      // Set CSS custom properties for enhanced targeting
      document.documentElement.style.setProperty('--is-mobile', newIsMobile ? '1' : '0');

      // Force touch event handling for DevTools mobile preview
      if (newIsMobile && window.innerWidth <= 768) {
        document.documentElement.style.setProperty('touch-action', 'manipulation');

        // Ensure all interactive elements are properly configured for DevTools
        setTimeout(() => {
          const interactiveElements = document.querySelectorAll('button, a[href], [role="button"], input, textarea, select');
          interactiveElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.touchAction = 'manipulation';
              el.style.pointerEvents = 'auto';
              el.style.webkitTapHighlightColor = 'transparent';
            }
          });
        }, 50);
      }
    };

    // Initial check
    checkMobile();

    // Enhanced event listeners for DevTools compatibility
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    // Additional DevTools-specific listeners
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');

    const handleMediaChange = () => {
      setTimeout(checkMobile, 10); // Small delay for DevTools
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    touchQuery.addEventListener('change', handleMediaChange);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
      mediaQuery.removeEventListener('change', handleMediaChange);
      touchQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  return isMobile;
};