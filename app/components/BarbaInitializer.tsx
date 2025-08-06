"use client";

import { useEffect } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

/**
 * Client component to initialize Barba.js
 * This should be imported in the ClientLayout component
 */
export default function BarbaInitializer() {
  // Minimal Barba.js initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Skip asset preloading for better initial performance

      // Dynamically import barba initialization
      import('@/utils/barba-init').then(({ useBarba }) => {
        useBarba({
          optimizeWelcomeScreen: true,
          transitionSpeed: 0.3, // Faster transitions
          easing: [0.22, 1, 0.36, 1]
        });

        // Minimal inline styles - moved most to CSS files
        const style = document.createElement('style');
        style.textContent = `
          .barba-container [class*="Welcome"],
          .barba-container [class*="welcome"] {
            animation: welcome-fade-in 0.4s ease-out forwards;
          }

          @keyframes welcome-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `;
        document.head.appendChild(style);
      })
      .catch(() => {
        // Silent fail for better performance
      });
    }
  }, []);

  // Initialize smooth scrolling
  useSmoothScroll();

  return null;
}