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
      
      // Adjust welcome screen position and style with enhanced frosted glass effect
      const welcomeElements = document.querySelectorAll(
        '[class*="Welcome"], [class*="welcome"], [id*="welcome"]'
      );
      welcomeElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.marginTop = '5rem';
          el.style.paddingTop = '3rem';
          el.style.paddingBottom = '3rem';
          el.style.borderRadius = '16px';
          el.style.overflow = 'hidden';
          el.style.position = 'relative';
          // Enhanced frosted glass effect
          el.style.background = 'rgba(5, 5, 9, 0.5)';
          el.style.backdropFilter = 'blur(16px)';
          el.style.setProperty('-webkit-backdrop-filter', 'blur(16px)');
          el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
          el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          
          // Add subtle purple glow
          if (!el.querySelector('.welcome-glow')) {
            const glow = document.createElement('div');
            glow.className = 'welcome-glow';
            glow.style.position = 'absolute';
            glow.style.inset = '0';
            glow.style.background = 'radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 60%)';
            glow.style.zIndex = '-1';
            glow.style.pointerEvents = 'none';
            el.appendChild(glow);
          }
          
          // Add inner glass effect
          if (!el.querySelector('.welcome-inner-glass')) {
            const innerGlass = document.createElement('div');
            innerGlass.className = 'welcome-inner-glass';
            innerGlass.style.position = 'absolute';
            innerGlass.style.inset = '0';
            innerGlass.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%)';
            innerGlass.style.zIndex = '-1';
            innerGlass.style.pointerEvents = 'none';
            el.appendChild(innerGlass);
          }
        }
      });
      
      // Enhance welcome screen buttons with glass effect
      const welcomeButtons = document.querySelectorAll(
        '[class*="welcome"] button, [class*="welcome"] a, [id*="discover"], [id*="see-what"]'
      );
      welcomeButtons.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.borderRadius = '10px';
          el.style.overflow = 'hidden';
          el.style.backdropFilter = 'blur(8px)';
          el.style.setProperty('-webkit-backdrop-filter', 'blur(8px)');
          el.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))';
          el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
          
          // Add hover effect using event listeners
          if (!el.dataset.hoverInitialized) {
            el.dataset.hoverInitialized = 'true';
            
            el.addEventListener('mouseenter', () => {
              el.style.transform = 'translateY(-2px)';
              el.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
              el.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.15))';
            });
            
            el.addEventListener('mouseleave', () => {
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
              el.style.background = 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1))';
            });
          }
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
          
          /* Welcome screen adjustments with enhanced frosted glass effect */
          [class*="Welcome"], 
          [class*="welcome"],
          [id*="welcome"] {
            margin-top: 5rem !important;
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
            border-radius: 16px !important;
            overflow: hidden !important;
            position: relative;
            background: rgba(5, 5, 9, 0.5) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          
          /* Welcome screen background glow */
          [class*="Welcome"]::before,
          [class*="welcome"]::before,
          [id*="welcome"]::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent 60%);
            z-index: -1;
            pointer-events: none;
          }
          
          /* Welcome screen inner glass effect */
          [class*="Welcome"]::after,
          [class*="welcome"]::after,
          [id*="welcome"]::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 100%);
            z-index: -1;
            pointer-events: none;
          }
          
          /* Welcome screen buttons with enhanced glass effect */
          [class*="welcome"] button,
          [class*="welcome"] a,
          [id*="discover"],
          [id*="see-what"] {
            border-radius: 10px !important;
            overflow: hidden !important;
            backdrop-filter: blur(8px) !important;
            -webkit-backdrop-filter: blur(8px) !important;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1)) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease !important;
          }
          
          /* Welcome screen buttons hover effect */
          [class*="welcome"] button:hover,
          [class*="welcome"] a:hover,
          [id*="discover"]:hover,
          [id*="see-what"]:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.15)) !important;
          }
          
          /* Welcome screen title enhancements */
          [class*="welcome"] h1,
          [class*="welcome"] h2,
          [class*="welcome"] .title,
          [class*="NEX-DEVS"] {
            margin-top: 2rem !important;
            line-height: 1.2 !important;
            text-shadow: 0 2px 10px rgba(139, 92, 246, 0.5) !important;
          }
          
          /* Welcome screen text enhancements */
          [class*="welcome"] p,
          [class*="welcome"] span {
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3) !important;
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