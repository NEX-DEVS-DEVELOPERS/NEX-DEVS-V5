"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// import BarbaInitializer from './BarbaInitializer'; // Disabled to prevent button conflicts
import ChatbotClientWrapper from './ChatbotClientWrapper';
import FloatingPortal from '@/frontend/components/FloatingPortal';
import MobileHeroToggle from './MobileHeroToggle';

// Dynamic imports for better client-side code splitting
const Footer = dynamic(() => import('@/frontend/components/layout/Footer'), {
  loading: () => <div className="h-20 bg-black" />
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Extend Window interface to allow for scrollTimer
declare global {
  interface Window {
    scrollTimer: ReturnType<typeof setTimeout>;
  }
}

/**
 * Client-side layout wrapper that contains client components
 * This separates client from server components properly
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  // Removed duplicate scroll handler - handled in layout.tsx for better performance

  // Optimized welcome screen preparation - 60fps focused
  useEffect(() => {
    const prepareWelcomeElements = () => {
      const welcomeElements = document.querySelectorAll('[class*="Welcome"], [class*="welcome"]');
      welcomeElements.forEach(el => {
        if (el instanceof HTMLElement && !el.dataset.prepared) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px) translateZ(0)';
          el.style.backfaceVisibility = 'hidden';
          el.dataset.prepared = 'true';
        }
      });
    };

    prepareWelcomeElements();

    // Only listen for page transitions - use requestAnimationFrame
    const handleBarbaTransition = () => {
      requestAnimationFrame(prepareWelcomeElements);
    };
    window.addEventListener('barba:before', handleBarbaTransition);

    return () => {
      window.removeEventListener('barba:before', handleBarbaTransition);
    };
  }, []);

  // Enhanced mobile interactions for 60fps performance
  useEffect(() => {
    const setupMobileInteractions = () => {
      const isMobile = window.innerWidth <= 768;
      document.documentElement.classList.toggle('mobile-device', isMobile);
      document.documentElement.classList.toggle('desktop-device', !isMobile);

      // 60fps mobile preview support
      if (isMobile) {
        console.log('Mobile mode detected - optimizing for 60fps touch interactions');

        // Ensure interactive elements maintain touch capabilities
        const interactiveElements = document.querySelectorAll('button, a[href], [role="button"], input, textarea, select, [onclick]');
        interactiveElements.forEach(el => {
          if (el instanceof HTMLElement) {
            // Skip chatbot elements to avoid conflicts
            if (el.closest('#nexious-chat-container') || el.closest('.nexious-chat-container')) {
              return;
            }

            // GPU acceleration for touch elements
            el.style.transform = 'translateZ(0)';
            el.style.backfaceVisibility = 'hidden';
            
            if (!el.style.touchAction) {
              el.style.touchAction = 'manipulation';
            }
            if (!el.style.pointerEvents || el.style.pointerEvents === 'none') {
              el.style.pointerEvents = 'auto';
            }
            (el.style as any).webkitTapHighlightColor = 'transparent';
            
            // Ensure minimum touch target size
            if (el.offsetHeight < 44 && !el.style.minHeight) {
              el.style.minHeight = '44px';
            }
            if (el.offsetWidth < 44 && !el.style.minWidth) {
              el.style.minWidth = '44px';
            }
          }
        });

        // Ensure project gallery specifically works
        const projectGalleries = document.querySelectorAll('[class*="project"], [class*="Project"], [class*="gallery"], [class*="Gallery"]');
        projectGalleries.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.pointerEvents = 'auto';
            el.style.touchAction = 'manipulation';
          }
        });

        // Ensure carousel containers work
        const carouselElements = document.querySelectorAll('.flex[style*="translateX"], [class*="carousel"]');
        carouselElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.pointerEvents = 'auto';
            el.style.touchAction = 'pan-x';
          }
        });

        // CRITICAL: Ensure MobileHeroToggle works properly
        const mobileHeroToggles = document.querySelectorAll('[class*="MobileHero"], [class*="mobile-hero"], .mobile-hero-toggle, [class*="HeroToggle"]');
        mobileHeroToggles.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.pointerEvents = 'auto';
            el.style.touchAction = 'manipulation';
            el.style.zIndex = '1000';
            el.style.position = 'relative';
          }
        });

        // Passive touch event listeners for better performance
        document.addEventListener('touchstart', (e) => {
          // Only log if not chatbot related
          if (!e.target || !(e.target as Element).closest('#nexious-chat-container')) {
            console.log('Touch start detected on:', e.target);
          }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
          // Only log if not chatbot related
          if (!e.target || !(e.target as Element).closest('#nexious-chat-container')) {
            console.log('Touch end detected on:', e.target);
          }
        }, { passive: true });
      }
    };

    setupMobileInteractions();

    // Throttled resize for 60fps
    let resizeTimer: number;
    const throttledResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        requestAnimationFrame(setupMobileInteractions);
      }, 16); // 60fps timing
    };

    window.addEventListener('resize', throttledResize);

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimer);
    };
  }, []);
  
  return (
    <>
      {/* Mobile Hero Toggle - positioned below navbar, mobile only */}
      <MobileHeroToggle />

      {/* Use main tag with optimized scrolling and rounded sections */}
      <main
        className="flex-1 w-full min-h-screen optimized-scroll"
        style={{
          backgroundColor: 'var(--nex-dark-bg)',
          color: '#f8fafc',
          overflowX: 'hidden'
        }}
        data-page-content="true"
      >
        {/* 60fps optimized styles - smooth scrolling focus */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Welcome screen positioning - maintaining user requirements */
            [class*="Welcome"], [class*="welcome"] {
              margin-top: 7rem !important;
              padding-top: 4rem !important;
              transform: translateZ(0); /* GPU acceleration */
              backface-visibility: hidden;
            }

            /* 60fps hero section optimizations */
            .hero-optimized {
              transform: translateZ(0);
              backface-visibility: hidden;
              contain: layout style paint;
            }

            .smooth-60fps {
              will-change: auto;
              transform: translateZ(0);
            }

            /* Chatbot container - completely non-blocking for performance */
            #nexious-chat-container {
              pointer-events: none !important;
              width: auto !important;
              height: auto !important;
              transform: translateZ(0);
            }

            /* Button interactions only when chat is closed - 60fps optimized */
            body:not(.chat-open) #nexious-chat-container .nexious-chat-button {
              pointer-events: auto !important;
              position: fixed !important;
              bottom: 20px !important;
              right: 20px !important;
              left: auto !important;
              z-index: 1000000 !important;
              display: flex !important;
              opacity: 1 !important;
              visibility: visible !important;
              transform: translateZ(0);
              backface-visibility: hidden;
            }

            /* Disable other children for performance */
            body:not(.chat-open) #nexious-chat-container *:not(.nexious-chat-button) {
              pointer-events: none !important;
            }

            /* Chat open state - maintain 60fps */
            body.chat-open #nexious-chat-container {
              pointer-events: auto !important;
            }
            body.chat-open #nexious-chat-container * {
              pointer-events: auto !important;
            }

            /* CRITICAL: Ensure MobileHeroToggle always works */
            .mobile-hero-toggle,
            [class*="MobileHero"],
            [class*="mobile-hero"],
            [class*="HeroToggle"] {
              pointer-events: auto !important;
              touch-action: manipulation !important;
              z-index: 1000 !important;
              position: relative !important;
            }

            .mobile-hero-toggle button,
            [class*="MobileHero"] button,
            [class*="mobile-hero"] button,
            [class*="HeroToggle"] button {
              pointer-events: auto !important;
              touch-action: manipulation !important;
              min-height: 44px !important;
              min-width: 44px !important;
              z-index: 1001 !important;
            }
          `
        }} />
        {children}
      </main>
      <Footer />
      
      {/* Use portal to render chatbot outside main layout with enhanced initialization */}
      <FloatingPortal id="chatbot-portal">
        <div className="chatbot-wrapper-enhanced">
          <ChatbotClientWrapper />
        </div>
      </FloatingPortal>

      {/* BarbaInitializer disabled to prevent button interaction conflicts */}
      {/* <BarbaInitializer /> */}
    </>
  );
}