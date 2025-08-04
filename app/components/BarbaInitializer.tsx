"use client";

import { useEffect } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

/**
 * Client component to initialize Barba.js
 * This should be imported in the ClientLayout component
 */
export default function BarbaInitializer() {
  // Initialize Barba.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Preload common page assets
      const preloadAssets = () => {
        // Preload common images and assets that will be needed for transitions
        const assetsToPreload = [
          '/icons/favicon.svg',
          '/images/backgrounds/gradient-bg.jpg',
        ];
        
        assetsToPreload.forEach(asset => {
          const img = new Image();
          img.src = asset;
        });
      };

      // Try to preload assets
      try {
        preloadAssets();
      } catch (err) {
        console.error('Failed to preload assets:', err);
      }
      
      // Dynamically import barba initialization to avoid SSR issues
      import('@/utils/barba-init').then(({ useBarba }) => {
        // Pass custom options to Barba for better welcome screen handling
        useBarba({
          optimizeWelcomeScreen: true,
          transitionSpeed: 0.6,
          easing: [0.22, 1, 0.36, 1]
        });
        
        // Add specific styles for welcome screen transitions
        const style = document.createElement('style');
        style.textContent = `
          /* Optimize welcome screen animations */
          .barba-container [class*="Welcome"],
          .barba-container [class*="welcome"],
          .barba-container [id*="welcome"] {
            animation: welcome-fade-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            will-change: transform, opacity;
          }
          
          @keyframes welcome-fade-in {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `;
        document.head.appendChild(style);
        
        console.log('Barba.js initialized with optimized welcome screen transitions');
      })
      .catch(error => {
        console.error('Failed to initialize Barba.js:', error);
      });
    }
  }, []);

  // Initialize smooth scrolling
  useSmoothScroll();

  // This component doesn't render anything
  return null;
} 