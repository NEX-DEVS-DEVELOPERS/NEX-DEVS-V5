"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import BarbaInitializer from './BarbaInitializer';
import ChatbotClientWrapper from './ChatbotClientWrapper';
import FloatingPortal from '@/components/FloatingPortal';
import MobileHeroToggle from './MobileHeroToggle';

// Dynamic imports for better client-side code splitting
const Footer = dynamic(() => import("@/components/layout/Footer"), {
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
  // Add scroll optimization effect
  useEffect(() => {
    // Fix for any uplift effect during scroll
    const handleScroll = () => {
      document.body.classList.add('is-scrolling');
      
      // Remove class after scrolling stops
      clearTimeout(window.scrollTimer);
      window.scrollTimer = setTimeout(() => {
        document.body.classList.remove('is-scrolling');
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add welcome screen optimization effect
  useEffect(() => {
    // Apply initial styles for welcome screen elements to prepare for animations
    const prepareWelcomeScreenAnimations = () => {
      const welcomeElements = document.querySelectorAll('[class*="Welcome"], [class*="welcome"]');
      welcomeElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Set initial state for entrance animation
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px) scale(0.98)';
        }
      });
    };

    // Execute immediately for first page load
    prepareWelcomeScreenAnimations();

    // Attach to Barba.js events
    window.addEventListener('barba:before', prepareWelcomeScreenAnimations);

    return () => {
      window.removeEventListener('barba:before', prepareWelcomeScreenAnimations);
    };
  }, []);

  // Add mobile touch interaction fixes
  useEffect(() => {
    const fixMobileTouchInteractions = () => {
      // Ensure all interactive elements have proper touch handling
      const interactiveElements = document.querySelectorAll(
        'button, a[href], [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      interactiveElements.forEach(el => {
        if (el instanceof HTMLElement) {
          // Ensure proper touch action
          if (!el.style.touchAction) {
            el.style.touchAction = 'manipulation';
          }

          // Ensure pointer events are enabled
          if (el.style.pointerEvents === 'none') {
            el.style.pointerEvents = 'auto';
          }

          // Add webkit tap highlight removal
          el.style.webkitTapHighlightColor = 'transparent';
        }
      });

      // Special handling for mobile menu button
      const mobileMenuButton = document.querySelector('button[aria-label*="Menu"]');
      if (mobileMenuButton instanceof HTMLElement) {
        mobileMenuButton.style.touchAction = 'manipulation';
        mobileMenuButton.style.pointerEvents = 'auto';
        mobileMenuButton.style.zIndex = '1002';
        mobileMenuButton.style.position = 'relative';
      }

      // Special handling for close buttons
      const closeButtons = document.querySelectorAll('button[title="Close"], button[aria-label*="Close"], .close-button');
      closeButtons.forEach(btn => {
        if (btn instanceof HTMLElement) {
          btn.style.touchAction = 'manipulation';
          btn.style.pointerEvents = 'auto';
          btn.style.zIndex = '9999';
          btn.style.position = 'relative';
          btn.style.minHeight = '44px';
          btn.style.minWidth = '44px';
        }
      });
    };

    // Run immediately
    fixMobileTouchInteractions();

    // Run after DOM changes
    const observer = new MutationObserver(() => {
      fixMobileTouchInteractions();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
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
        <style jsx global>{`
          /* Welcome screen optimizations */
          [class*="Welcome"], [class*="welcome"], [id*="welcome"] {
            margin-top: 7rem !important;
            padding-top: 4rem !important;
            transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), 
                        transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) !important;
            will-change: opacity, transform;
          }
          
          /* Better backdrop filter performance */
          .backdrop-blur-sm, .backdrop-blur-md, .backdrop-blur-lg {
            will-change: backdrop-filter;
            backface-visibility: hidden;
          }
          
          /* Optimize animations */
          @media (prefers-reduced-motion: no-preference) {
            .transition-opacity, 
            .transition-transform, 
            .transition-all {
              will-change: opacity, transform;
            }
          }
        `}</style>
        {children}
      </main>
      <Footer />
      
      {/* Use portal to render chatbot outside main layout */}
      <FloatingPortal id="chatbot-portal">
        <ChatbotClientWrapper />
      </FloatingPortal>

      <BarbaInitializer />
    </>
  );
}