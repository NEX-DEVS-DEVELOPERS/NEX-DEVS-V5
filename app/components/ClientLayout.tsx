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
  // Removed duplicate scroll handler - handled in layout.tsx for better performance

  // Minimal welcome screen preparation - moved heavy logic to CSS
  useEffect(() => {
    const prepareWelcomeElements = () => {
      const welcomeElements = document.querySelectorAll('[class*="Welcome"], [class*="welcome"]');
      welcomeElements.forEach(el => {
        if (el instanceof HTMLElement && !el.dataset.prepared) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.dataset.prepared = 'true'; // Prevent re-processing
        }
      });
    };

    prepareWelcomeElements();

    // Only listen for page transitions
    const handleBarbaTransition = () => prepareWelcomeElements();
    window.addEventListener('barba:before', handleBarbaTransition);

    return () => {
      window.removeEventListener('barba:before', handleBarbaTransition);
    };
  }, []);

  // Minimal touch setup - no complex handling
  useEffect(() => {
    // Just ensure basic mobile classes are set
    const isMobile = window.innerWidth <= 768;
    document.documentElement.classList.toggle('mobile-device', isMobile);
    document.documentElement.classList.toggle('desktop-device', !isMobile);
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
        {/* Minimal inline styles - let CSS files handle the rest */}
        <style jsx global>{`
          /* Only essential welcome screen positioning */
          [class*="Welcome"], [class*="welcome"] {
            margin-top: 7rem !important;
            padding-top: 4rem !important;
          }

          /* Ensure chatbot button is always visible and clickable */
          .nexious-chat-button {
            position: relative !important;
            z-index: 1000000 !important;
            pointer-events: auto !important;
            display: flex !important;
            opacity: 1 !important;
            visibility: visible !important;
          }

          /* Prevent any layout interference with chatbot */
          .nexious-chat-container * {
            pointer-events: auto !important;
          }
        `}</style>
        {children}
      </main>
      <Footer />
      
      {/* Use portal to render chatbot outside main layout with enhanced initialization */}
      <FloatingPortal id="chatbot-portal">
        <div className="chatbot-wrapper-enhanced">
          <ChatbotClientWrapper />
        </div>
      </FloatingPortal>

      <BarbaInitializer />
    </>
  );
}