import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/performance-optimizations.css" // CRITICAL: Performance optimizations for 60fps scrolling
import "../styles/barba-transitions.css" // Import Barba.js transition styles
import "../styles/color-consistency.css" // Import color consistency styles
import "../styles/hero-and-scroll-fixes.css" // Import hero section and scrolling fixes
import "../styles/neon-borders.css" // Import neon border styles
import "../styles/smooth-scrolling.css" // Import smooth scrolling optimizations
import { cn } from "@/lib/utils"
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { fontVariables, audiowide, vt323 } from "@/app/utils/fonts"

// Import ClientLayout which wraps all client components
import ClientLayout from './components/ClientLayout'

// Import Navbar directly to ensure mobile menu works properly
import Navbar from "@/components/layout/Navbar"

// Import directly since dynamic import was causing type issues
import { ThemeProvider } from "@/components/ThemeProvider"
import { CurrencyProvider } from '@/app/contexts/CurrencyContext'
import { TimelineProvider } from '@/app/contexts/TimelineContext'

// Import SmoothScrollInitializer directly
import SmoothScrollInitializer from '@/app/components/SmoothScrollInitializer'

// Optimize font loading - add display: 'swap' to show text with fallback font while custom font loads
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'NEX-DEVS | AI-Powered Development Solutions',
  description: 'NEX-DEVS specializes in AI-powered development solutions including intelligent web applications, AI automation, chatbots, and custom AI integrations for businesses seeking cutting-edge technology.',
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  openGraph: {
    title: "NEX-DEVS - AI-Powered Development Solutions",
    description: "Leading AI development company specializing in intelligent applications, automation, and AI integrations with 950+ successful projects.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "NEX-DEVS - AI-Powered Development Solutions",
    description: "Leading AI development company specializing in intelligent applications, automation, and AI integrations with 950+ successful projects.",
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/favicon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    shortcut: '/icons/favicon.svg',
    apple: '/icons/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fontVariables}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/icons/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/favicon.svg" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preload critical fonts */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* DevTools Mobile Preview Fix */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Enhanced mobile detection with immediate execution (IIFE)
          (function() {
            const isMobile = window.innerWidth <= 768;
            document.documentElement.classList.toggle('mobile-device', isMobile);
            
            // Immediate hero section optimization
            document.documentElement.style.setProperty('--hero-loaded', '1');
            document.documentElement.classList.add('layout-optimized');
          })();
          
          // DevTools mobile preview fix - force only interactive elements to work
          if (window.innerWidth <= 768) {
            console.log('Mobile preview detected - enabling interactive elements');

            // Only force interactive elements to work, preserve overlays
            const style = document.createElement('style');
            style.textContent = \`
              .mobile-device button:not(#nexious-chat-container button),
              .mobile-device a[href]:not(#nexious-chat-container a),
              .mobile-device [role="button"]:not(#nexious-chat-container [role="button"]),
              .mobile-device input,
              .mobile-device textarea,
              .mobile-device select,
              .mobile-device [onclick]:not(#nexious-chat-container [onclick]) {
                pointer-events: auto !important;
                touch-action: manipulation !important;
                min-height: 44px !important;
                min-width: 44px !important;
              }
              
              /* Specifically ensure project gallery touch works */
              .mobile-device .max-w-7xl .relative .flex[style*="translateX"] {
                pointer-events: auto !important;
                touch-action: pan-x !important;
              }
              
              /* CRITICAL: Ensure MobileHeroToggle always works on mobile */
              .mobile-device .mobile-hero-toggle,
              .mobile-device [class*="MobileHero"],
              .mobile-device [class*="mobile-hero"],
              .mobile-device [class*="HeroToggle"] {
                pointer-events: auto !important;
                touch-action: manipulation !important;
                z-index: 1000 !important;
                position: relative !important;
              }
              
              .mobile-device .mobile-hero-toggle button,
              .mobile-device [class*="MobileHero"] button,
              .mobile-device [class*="mobile-hero"] button,
              .mobile-device [class*="HeroToggle"] button {
                pointer-events: auto !important;
                touch-action: manipulation !important;
                min-height: 44px !important;
                min-width: 44px !important;
                z-index: 1001 !important;
              }
              
              .mobile-device #chatbot-overlay,
              .mobile-device #transition-overlay,
              .mobile-device .barba-overlay,
              .mobile-device [class*="overlay"]:not([class*="project"]):not([class*="gallery"]) {
                pointer-events: none !important;
              }
            \`;
            document.head.appendChild(style);
          }
        `}} />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground flex flex-col optimized-scroll")} data-barba="wrapper">
        {/* Progress bar - non-blocking */}
        <div className="progress-bar" id="progress-bar" style={{pointerEvents: 'none'}}></div>

        {/* Single transition overlay - non-blocking */}
        <div
          id="transition-overlay"
          className="transition-overlay"
          style={{
            pointerEvents: 'none',
            touchAction: 'none',
            zIndex: '9999',
            display: 'none'
          }}
        >
          <div className="transition-spinner"></div>
        </div>

        {/* Chatbot overlay - completely non-blocking */}
        <div
          id="chatbot-overlay"
          className="fixed inset-0 bg-black/30 backdrop-blur-md opacity-0 transition-opacity duration-300 invisible"
          style={{
            zIndex: '9998',
            pointerEvents: 'none',
            display: 'none',
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        ></div>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <TimelineProvider>
              <SmoothScrollInitializer />
              <Navbar />
              {/* ClientLayout wraps all client-side components with proper spacing for fixed navbar */}
              <div className="navbar-spacer">
                <ClientLayout>
                  {children}
                </ClientLayout>
              </div>
            </TimelineProvider>
          </CurrencyProvider>
        </ThemeProvider>

        {/* 60FPS OPTIMIZED scroll detection - no reload effects */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Ultra-smooth 60fps scroll handler - no reload effects
          let ticking = false;
          let scrollTimer;
          let lastScrollY = 0;
          let isAtTop = true;

          function ultraSmoothScrollHandler() {
            if (!ticking) {
              requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
                isAtTop = currentScrollY < 5;
                
                // Smooth scroll state management - no reload effects
                document.body.classList.toggle('is-scrolling', true);
                document.body.classList.toggle('at-top', isAtTop);
                document.body.classList.toggle('scrolling-down', scrollDirection === 'down');
                document.body.classList.toggle('scrolling-up', scrollDirection === 'up');
                
                lastScrollY = currentScrollY;
                
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                  document.body.classList.remove('is-scrolling');
                }, 50); // Faster response for 60fps feel
                ticking = false;
              });
              ticking = true;
            }
          }

          document.addEventListener('scroll', ultraSmoothScrollHandler, { passive: true });

          // Enhanced DOM initialization for robust chatbot functionality
          document.addEventListener('DOMContentLoaded', function() {
            // 60fps hero section activation - no reload effects
            const activateHeroSection = () => {
              const heroElements = document.querySelectorAll('[class*="hero"], [class*="Hero"], .hero-section');
              heroElements.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.classList.add('loaded', 'hero-optimized', 'smooth-60fps');
                  el.style.transform = 'translateZ(0)'; // GPU acceleration
                  el.style.backfaceVisibility = 'hidden'; // Prevent flickering
                  el.style.willChange = 'auto'; // Remove will-change after load
                }
              });
            };
            
            // Optimized welcome screen activation
            const activateWelcomeScreens = () => {
              const welcomeElements = document.querySelectorAll('[class*="Welcome"], [class*="welcome"]');
              welcomeElements.forEach(el => {
                if(el instanceof HTMLElement && !el.classList.contains('loaded')) {
                  el.classList.add('loaded');
                }
              });
            };
            
            // Fix TechStack section reload effects
            const optimizeTechStack = () => {
              const techStackElements = document.querySelectorAll('[class*="TechStack"], [class*="tech-stack"], .tech-stack-section');
              techStackElements.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.classList.add('tech-optimized');
                  el.style.backfaceVisibility = 'hidden';
                  el.style.transform = 'translateZ(0)';
                }
              });
            };

            // Immediate activation without delays
            activateHeroSection();
            activateWelcomeScreens();
            optimizeTechStack();

            // Re-activate on page transitions - maintain 60fps optimization
            document.addEventListener('barba:after', () => {
              requestAnimationFrame(() => {
                activateHeroSection();
                activateWelcomeScreens();
                optimizeTechStack();
              });
            });

            // Simplified chatbot system for DevTools compatibility
            const setupChatbotSystem = () => {
              // Ensure chatbot container exists
              let container = document.getElementById('nexious-chat-container');
              if (!container) {
                container = document.createElement('div');
                container.id = 'nexious-chat-container';
                container.className = 'fixed-bottom-right nexious-chat-container';
                container.style.cssText = 'position: fixed !important; bottom: 20px !important; right: 24px !important; z-index: 999999 !important; pointer-events: none !important; touch-action: manipulation !important; width: auto !important; height: auto !important;';
                document.body.appendChild(container);
              }

              // Ensure overlay never blocks interactions
              const overlay = document.getElementById('chatbot-overlay');
              if (overlay) {
                overlay.style.pointerEvents = 'none';
                overlay.style.touchAction = 'none';
                overlay.style.display = 'none';
              }

              // CRITICAL: Ensure other interactive elements are not affected
              const protectInteractiveElements = () => {
                // Protect project gallery and other interactive sections
                const interactiveSections = document.querySelectorAll(
                  '.max-w-7xl, [class*="project"], [class*="Project"], [class*="gallery"], [class*="Gallery"], .relative > .flex[style*="translateX"]'
                );
                
                interactiveSections.forEach(el => {
                  if (el instanceof HTMLElement && !el.closest('#nexious-chat-container')) {
                    el.style.pointerEvents = 'auto';
                    el.style.touchAction = 'manipulation';
                  }
                });

                // Protect all buttons outside chatbot
                const buttons = document.querySelectorAll('button:not(#nexious-chat-container button), [role="button"]:not(#nexious-chat-container [role="button"])');
                buttons.forEach(btn => {
                  if (btn instanceof HTMLElement) {
                    btn.style.pointerEvents = 'auto';
                    btn.style.touchAction = 'manipulation';
                  }
                });

                // CRITICAL: Specifically protect MobileHeroToggle
                const mobileHeroToggles = document.querySelectorAll(
                  '.mobile-hero-toggle, [class*="MobileHero"], [class*="mobile-hero"], [class*="HeroToggle"]'
                );
                mobileHeroToggles.forEach(toggle => {
                  if (toggle instanceof HTMLElement) {
                    toggle.style.pointerEvents = 'auto';
                    toggle.style.touchAction = 'manipulation';
                    toggle.style.zIndex = '1000';
                    toggle.style.position = 'relative';
                    
                    // Ensure all buttons within the toggle work
                    const toggleButtons = toggle.querySelectorAll('button');
                    toggleButtons.forEach(btn => {
                      if (btn instanceof HTMLElement) {
                        btn.style.pointerEvents = 'auto';
                        btn.style.touchAction = 'manipulation';
                        btn.style.minHeight = '44px';
                        btn.style.minWidth = '44px';
                      }
                    });
                  }
                });
              };

              // Run protection immediately and on mutations
              protectInteractiveElements();
              
              // Set up mutation observer to protect new elements
              const observer = new MutationObserver(() => {
                protectInteractiveElements();
              });
              observer.observe(document.body, { childList: true, subtree: true });
            };

              // Ensure chatbot remains functional on page transitions
              document.addEventListener('barba:after', () => {
                setTimeout(() => {
                  // Re-apply non-blocking container each transition
                  const container = document.getElementById('nexious-chat-container');
                  if (container) {
                    container.style.pointerEvents = 'none';
                    container.style.width = 'auto';
                    container.style.height = 'auto';
                  }

                  // Re-protect MobileHeroToggle after transitions
                  const mobileHeroToggles = document.querySelectorAll(
                    '.mobile-hero-toggle, [class*="MobileHero"], [class*="mobile-hero"], [class*="HeroToggle"]'
                  );
                  mobileHeroToggles.forEach(toggle => {
                    if (toggle instanceof HTMLElement) {
                      toggle.style.pointerEvents = 'auto';
                      toggle.style.touchAction = 'manipulation';
                      toggle.style.zIndex = '1000';
                      
                      const toggleButtons = toggle.querySelectorAll('button');
                      toggleButtons.forEach(btn => {
                        if (btn instanceof HTMLElement) {
                          btn.style.pointerEvents = 'auto';
                          btn.style.touchAction = 'manipulation';
                        }
                      });
                    }
                  });
                }, 100);
              });
            };

            setupChatbotSystem();

            // Pre-warm chatbot settings for instant availability
            const preWarmChatbotSettings = async () => {
              try {
                const timestamp = Date.now();
                const response = await fetch('/api/chatbot/settings/public?t=' + timestamp, {
                  method: 'GET',
                  headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                  }
                });

                if (response.ok) {
                  const data = await response.json();
                  localStorage.setItem('nexious-chatbot-settings', JSON.stringify({
                    enabled: data.enabled,
                    timestamp: Date.now()
                  }));
                  console.log('Chatbot settings pre-warmed:', data.enabled ? 'Enabled' : 'Disabled');
                }
              } catch (error) {
                console.error('Error pre-warming chatbot settings:', error);
              }
            };

            // Pre-warm settings immediately
            preWarmChatbotSettings();
          });
        `}} />


      </body>
    </html>
  )
}
