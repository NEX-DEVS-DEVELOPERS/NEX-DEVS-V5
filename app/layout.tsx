import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/barba-transitions.css" // Import Barba.js transition styles
import "../styles/color-consistency.css" // Import color consistency styles
import "../styles/hero-and-scroll-fixes.css" // Import hero section and scrolling fixes
import "../styles/neon-borders.css" // Import neon border styles
import "../styles/smooth-scrolling.css" // Import smooth scrolling optimizations
import "../styles/mobile-touch-fixes.css" // Import mobile touch interaction fixes
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground flex flex-col optimized-scroll")} data-barba="wrapper">
        <div className="transition-overlay" id="transition-overlay"></div>
        <div className="progress-bar" id="progress-bar"></div>

        {/* Transition overlay for smooth page transitions */}
        <div id="transition-overlay">
          <div className="transition-spinner"></div>
        </div>

        {/* Add chatbot blur overlay - Fixed z-index to prevent mobile interaction blocking */}
        <div id="chatbot-overlay" className="fixed inset-0 bg-black/30 backdrop-blur-md z-[9998] pointer-events-none opacity-0 transition-opacity duration-300 invisible"></div>
        
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

        {/* Add script to detect scroll and optimize performance */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Detect scroll to optimize performance
          let scrollTimer;
          document.addEventListener('scroll', function() {
            document.body.classList.add('is-scrolling');
            
            // Remove class after scrolling stops
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
              document.body.classList.remove('is-scrolling');
            }, 150);
          }, { passive: true });
          
          // Fix rounded edges and enhance welcome screen animations after DOM loads
          document.addEventListener('DOMContentLoaded', function() {
            // Fix rounded edges for specific elements
            const fixRoundedEdges = () => {
              // Fix hero name elements
              const nameElements = document.querySelectorAll('[id*="ali"], [id*="hasnaat"], .bg-white.text-black');
              nameElements.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.style.borderRadius = '12px';
                  el.style.overflow = 'hidden';
                }
              });
              
              // Fix buttons
              const buttons = document.querySelectorAll('a[href="/contact"], a[href="/projects"], .button');
              buttons.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.style.borderRadius = '10px';
                  el.style.overflow = 'hidden';
                }
              });
              
              // Fix tech stack sections
              const techSections = document.querySelectorAll('.space-y-2, .rounded-lg, .rounded-xl, .rounded-2xl');
              techSections.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.style.borderRadius = '16px';
                  el.style.overflow = 'hidden';
                }
              });
              
              // Optimize welcome screen animations
              const welcomeScreens = document.querySelectorAll('[class*="Welcome"], [class*="welcome"]');
              welcomeScreens.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.style.marginTop = '7rem';
                  el.style.paddingTop = '4rem';
                  el.style.borderRadius = '16px';
                  el.style.position = 'relative';
                  
                  // Add a more elegant glass effect
                  const existingBefore = el.querySelector('.welcome-bg-effect');
                  if (!existingBefore) {
                    const bgEffect = document.createElement('div');
                    bgEffect.className = 'welcome-bg-effect';
                    bgEffect.style.position = 'absolute';
                    bgEffect.style.inset = '0';
                    bgEffect.style.background = 'rgba(10, 10, 30, 0.3)';
                    bgEffect.style.backdropFilter = 'blur(24px)';
                    bgEffect.style.webkitBackdropFilter = 'blur(24px)';
                    bgEffect.style.border = '1px solid rgba(139, 92, 246, 0.2)';
                    bgEffect.style.borderRadius = '16px';
                    bgEffect.style.zIndex = '-1';
                    bgEffect.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                    el.style.backgroundColor = 'transparent';
                    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                    el.insertBefore(bgEffect, el.firstChild);
                    
                    // Add entrance animation with slight delay
                    setTimeout(() => {
                      el.style.opacity = '1';
                      el.style.transform = 'translateY(0) scale(1)';
                    }, 100);
                  }
                }
              });
              
              // Enhanced welcome screen buttons
              const welcomeButtons = document.querySelectorAll('[class*="welcome"] button, [class*="welcome"] a, [id*="discover"], [id*="see-what"]');
              welcomeButtons.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.style.backdropFilter = 'blur(10px)';
                  el.style.webkitBackdropFilter = 'blur(10px)';
                  el.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                  el.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                  el.style.transition = 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)';
                }
              });
            };
            
            // Run on load and after any page transitions
            fixRoundedEdges();
            document.addEventListener('barba:after', fixRoundedEdges);
            
            // Run again after a short delay to catch any dynamically loaded content
            setTimeout(fixRoundedEdges, 1000);
            // Additional check after all content is fully loaded
            window.addEventListener('load', fixRoundedEdges);
            
            // Try to load our enhancement script if it hasn't loaded already
            if (typeof enhanceWelcomeScreen === 'undefined') {
              try {
                const script = document.createElement('script');
                script.src = '/utils/welcome-screen-enhancements.js';
                script.async = true;
                document.head.appendChild(script);
              } catch (err) {
                console.log('Welcome screen enhancement script already loaded or failed to load.');
              }
            }

            // Setup chatbot overlay toggling - Fixed for mobile minimized state
            const setupChatbotBlurEffect = () => {
              // Monitor for the chat-open class on body
              const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                  if (mutation.attributeName === 'class') {
                    const body = document.body;
                    const overlay = document.getElementById('chatbot-overlay');
                    if (!overlay) return;

                    // Check if we're on mobile
                    const isMobile = window.innerWidth <= 768;

                    // Only show blur when chat is open AND not minimized
                    // For mobile: completely hide overlay when minimized to prevent interaction blocking
                    if (body.classList.contains('chat-open') && !body.classList.contains('chat-minimized')) {
                      overlay.classList.remove('invisible');
                      overlay.style.pointerEvents = 'none'; // Always ensure no interaction blocking
                      overlay.style.display = '';
                      overlay.style.zIndex = '9998'; // Lower z-index to prevent blocking

                      // Restore blur effects when maximizing
                      overlay.style.backdropFilter = '';
                      overlay.style.webkitBackdropFilter = '';
                      overlay.style.backgroundColor = '';

                      setTimeout(() => {
                        overlay.classList.remove('opacity-0');
                        overlay.classList.add('opacity-100');
                      }, 10);
                    } else {
                      // When minimized or closed, completely remove overlay effects
                      overlay.classList.remove('opacity-100');
                      overlay.classList.add('opacity-0');
                      overlay.style.pointerEvents = 'none';
                      overlay.style.zIndex = '-1'; // Move completely behind content

                      // Forcefully remove all blur effects when minimized
                      overlay.style.backdropFilter = 'none';
                      overlay.style.webkitBackdropFilter = 'none';
                      overlay.style.backgroundColor = 'transparent';

                      setTimeout(() => {
                        overlay.classList.add('invisible');
                        // Always hide overlay when minimized to ensure no background effects
                        if (body.classList.contains('chat-minimized')) {
                          overlay.style.display = 'none';
                        } else {
                          overlay.style.display = '';
                        }
                      }, 300); // Match transition duration
                    }
                  }
                });
              });

              observer.observe(document.body, { attributes: true });
            };

            setupChatbotBlurEffect();
          });
        `}} />
      </body>
    </html>
  )
}
