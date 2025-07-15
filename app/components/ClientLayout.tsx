"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import BarbaInitializer from './BarbaInitializer';
import ChatbotClientWrapper from './ChatbotClientWrapper';
import FloatingPortal from '@/components/FloatingPortal';

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
    
    // Apply rounded corners to hero elements with more specific targeting
    const applyRoundedCorners = () => {
      // Target hero name elements with more precise selectors
      const heroElements = document.querySelectorAll(
        '[id*="ali"], [id*="hasnaat"], .hero-title, .fullstack-title, span.bg-white.text-black, .border-2.border-white'
      );
      heroElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.borderRadius = '12px';
          el.style.overflow = 'hidden';
        }
      });
      
      // Target buttons specifically
      const buttons = document.querySelectorAll(
        'a[href="/contact"], a[href="/projects"], .bg-white.text-black, .border-2.border-white.text-white'
      );
      buttons.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.borderRadius = '10px';
          el.style.overflow = 'hidden';
        }
      });
      
      // Target skill sections with deeper specificity
      const skillElements = document.querySelectorAll(
        '[class*="skill"], [class*="expertise"], .fullstack-title, .p-4.rounded-lg, .space-y-2.sm\\:space-y-3.p-3'
      );
      skillElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.borderRadius = '12px';
          el.style.overflow = 'hidden';
        }
      });
      
      // Target tech stack sections specifically
      const techStackElements = document.querySelectorAll(
        '.rounded-2xl, .rounded-xl, [class*="TechStack"]'
      );
      techStackElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.borderRadius = '16px';
          el.style.overflow = 'hidden';
        }
      });
      
      // Adjust welcome screen position and style
      const welcomeElements = document.querySelectorAll(
        '[class*="Welcome"], [class*="welcome"], [id*="welcome"]'
      );
      welcomeElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.marginTop = '3rem';
          el.style.paddingTop = '2rem';
          el.style.borderRadius = '16px';
          el.style.overflow = 'hidden';
        }
      });
    };
    
    // Apply on load and after any page transition
    applyRoundedCorners();
    document.addEventListener('barba:after', applyRoundedCorners);
    
    // Additional DOM mutation observer to catch dynamically loaded elements
    const observer = new MutationObserver(() => {
      applyRoundedCorners();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Run again after a short delay to catch any dynamically loaded content
    setTimeout(applyRoundedCorners, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('barba:after', applyRoundedCorners);
      observer.disconnect();
    };
  }, []);
  
  return (
    <>
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
        {/* Apply global styles for section rounding and scroll optimization */}
        <style jsx global>{`
          /* Round all major sections */
          section, 
          [class*="section"],
          .hero-container,
          .content-card,
          .feature-box,
          .skill-card {
            border-radius: 16px !important;
            overflow: hidden !important;
          }
          
          /* Hero name and skills rounding */
          [id*="ali"], 
          [id*="hasnaat"],
          .hero-title, 
          .fullstack-title,
          span.bg-white.text-black,
          .border-2.border-white.px-4,
          .border-2.border-white.text-white {
            border-radius: 12px !important;
            overflow: hidden !important;
          }
          
          /* Buttons need explicit rounded corners */
          a[href="/contact"],
          a[href="/projects"],
          .bg-white.text-black.px-4,
          .border-2.text-white.px-4,
          button.bg-white,
          button.border-2 {
            border-radius: 10px !important;
            overflow: hidden !important;
          }
          
          /* More specific targeting for skill sections */
          .ai-powered,
          .full-stack,
          .ai-integrations,
          .automation-systems,
          .rag,
          .expertise-card, 
          .skill-card,
          .skill-item,
          .p-4.rounded-lg,
          [class*="skill-"] {
            border-radius: 12px !important;
            overflow: hidden !important;
            padding: 0 0.25rem;
          }
          
          /* Target tech stack section specifically */
          [class*="TechStack"],
          .space-y-2.sm\\:space-y-3.p-3,
          .relative.bg-black.rounded-2xl,
          .p-3.sm\\:p-4.rounded-lg.bg-black.border-2 {
            border-radius: 16px !important;
            overflow: hidden !important;
          }
          
          /* Welcome screen adjustments */
          [class*="Welcome"], 
          [class*="welcome"],
          [id*="welcome"] {
            margin-top: 3rem !important;
            padding-top: 2rem !important;
            border-radius: 16px !important;
            overflow: hidden !important;
          }
          
          /* Welcome screen buttons */
          [class*="welcome"] button,
          [class*="welcome"] a,
          [id*="discover"],
          [id*="see-what"] {
            border-radius: 10px !important;
            overflow: hidden !important;
          }
          
          /* Optimize all section containers */
          .section-container {
            border-radius: 16px;
            margin: 1rem 0;
            overflow: hidden;
            will-change: auto; /* Auto instead of transform to reduce GPU pressure */
          }
          
          /* Fix scroll behavior */
          .optimized-scroll {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: none !important;
          }
          
          /* Reduce animation impact during scroll */
          body.is-scrolling * {
            animation-play-state: paused;
          }
          
          /* Ensure containers don't cause scrolling issues */
          [data-barba="container"] {
            will-change: opacity;
            transform: none !important;
            transition: opacity 0.5s ease !important;
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