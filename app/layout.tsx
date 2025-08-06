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

// Initialize database only on server side
import { initializeDatabase } from './lib/database-init'

// Initialize the database when the server starts
if (typeof window === 'undefined') {
  initializeDatabase()
    .then(() => console.log('Database initialized in layout'))
    .catch(err => console.error('Failed to initialize database:', err));
}

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
          // Simple mobile detection and DevTools fix
          const isMobile = window.innerWidth <= 768;
          document.documentElement.classList.toggle('mobile-device', isMobile);

          // DevTools mobile preview fix - force all interactions to work
          if (isMobile) {
            console.log('Mobile preview detected - enabling all interactions');

            // Remove any pointer-events: none from all elements except specific overlays
            const style = document.createElement('style');
            style.textContent = \`
              .mobile-device * { pointer-events: auto !important; }
              .mobile-device #chatbot-overlay,
              .mobile-device #transition-overlay,
              .mobile-device .barba-overlay { pointer-events: none !important; }
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
            webkitUserSelect: 'none',
            webkitTouchCallout: 'none'
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

        {/* ULTRA-OPTIMIZED scroll detection and chatbot initialization - minimal overhead */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Minimal scroll handler with RAF throttling
          let ticking = false;
          let scrollTimer;

          function optimizedScrollHandler() {
            if (!ticking) {
              requestAnimationFrame(() => {
                document.body.classList.add('is-scrolling');
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(() => {
                  document.body.classList.remove('is-scrolling');
                }, 150);
                ticking = false;
              });
              ticking = true;
            }
          }

          document.addEventListener('scroll', optimizedScrollHandler, { passive: true });

          // Enhanced DOM initialization for robust chatbot functionality
          document.addEventListener('DOMContentLoaded', function() {
            // Minimal welcome screen activation
            const activateWelcomeScreens = () => {
              const welcomeElements = document.querySelectorAll('[class*="Welcome"], [class*="welcome"]');
              welcomeElements.forEach(el => {
                if(el instanceof HTMLElement && !el.classList.contains('loaded')) {
                  el.classList.add('loaded');
                }
              });
            };

            // Activate welcome screens with slight delay for smooth appearance
            setTimeout(activateWelcomeScreens, 100);

            // Re-activate on page transitions
            document.addEventListener('barba:after', () => {
              setTimeout(activateWelcomeScreens, 50);
            });

            // Simplified chatbot system for DevTools compatibility
            const setupChatbotSystem = () => {
              // Ensure chatbot container exists
              let container = document.getElementById('nexious-chat-container');
              if (!container) {
                container = document.createElement('div');
                container.id = 'nexious-chat-container';
                container.className = 'fixed-bottom-right nexious-chat-container';
                container.style.cssText = 'position: fixed !important; bottom: 20px !important; right: 24px !important; z-index: 999999 !important; pointer-events: auto !important; touch-action: manipulation !important;';
                document.body.appendChild(container);
              }

              // Ensure overlay never blocks interactions
              const overlay = document.getElementById('chatbot-overlay');
              if (overlay) {
                overlay.style.pointerEvents = 'none';
                overlay.style.touchAction = 'none';
                overlay.style.display = 'none';
              }
            };

              // Ensure chatbot remains functional on page transitions
              document.addEventListener('barba:after', () => {
                setTimeout(() => {
                  ensureChatbotContainer();
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
