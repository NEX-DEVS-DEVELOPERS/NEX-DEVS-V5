import { Inter } from "next/font/google"
import "./globals.css"
import "../styles/barba-transitions.css" // Import Barba.js transition styles
import "../styles/color-consistency.css" // Import color consistency styles
import "../styles/hero-and-scroll-fixes.css" // Import hero section and scrolling fixes
import { cn } from "@/lib/utils"
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { fontVariables, audiowide, vt323 } from "@/app/utils/fonts"

// Import ClientLayout which wraps all client components
import ClientLayout from './components/ClientLayout'

// Dynamic import for Navbar (can stay here because it needs to be outside ClientLayout)
const Navbar = dynamic(() => import("@/components/layout/Navbar"), {
  loading: () => <div className="h-16 bg-black" />
})

// Import directly since dynamic import was causing type issues
import { ThemeProvider } from "@/components/ThemeProvider"
import { CurrencyProvider } from '@/app/contexts/CurrencyContext'
import { TimelineProvider } from '@/app/contexts/TimelineContext'

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
  title: 'NEX-DEVS | Professional Web Development Solutions',
  description: 'NEX-DEVS provides professional web development services including custom websites, applications, and digital solutions for businesses of all sizes.',
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  openGraph: {
    title: "NEX-WEBS - Professional Web Solutions",
    description: "Professional website developer specializing in WordPress, Shopify, and custom solutions.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "NEX-DEVS - Professional Web Solutions",
    description: "Professional website developer specializing in WordPress, Shopify, and custom solutions.",
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
        {/* CSS fixes for floating elements, scroll behavior, and color consistency */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --animation-enabled: true;
            --font-audiowide: ${audiowide.style.fontFamily};
            --font-vt323: ${vt323.style.fontFamily};
            --nex-dark-bg: #050509;
            --nex-darker-bg: #010102;
            --nex-navbar-bg: rgba(0, 0, 0, 0.9);
            --nex-navbar-scrolled-bg: rgba(0, 0, 0, 0.95);
            --nex-navbar-border: rgba(255, 255, 255, 0.1);
            --nex-navbar-scrolled-border: rgba(255, 255, 255, 0.2);
            --border-radius-lg: 16px;
            --border-radius-md: 12px;
            --border-radius-sm: 8px;
            --border-radius-btn: 10px;
          }
          
          @media (prefers-reduced-motion: reduce) {
            :root {
              --animation-enabled: false;
            }
          }
          
          /* Basic float animation */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          
          .float {
            animation: float 3s ease-in-out infinite !important;
          }
          
          /* Essential fixes for sticky and floating UI */
          html {
            scroll-behavior: smooth;
            background-color: var(--nex-darker-bg);
          }
          
          body {
            overflow-x: hidden;
            width: 100%;
            min-height: 100vh;
            overscroll-behavior-y: none;
            background-color: var(--nex-dark-bg);
            color: #f8fafc;
          }
          
          /* Fix for Hero name elements - Apply rounded corners */
          [id*="ali"], 
          [id*="hasnaat"],
          h1.hero-title,
          .fullstack-title,
          span[class*=${audiowide.className}],
          .border-2.border-white,
          .group-hover\\:bg-purple-500,
          .bg-white.text-black {
            border-radius: var(--border-radius-md) !important;
            overflow: hidden !important;
          }
          
          /* Fix button elements with rounded edges */
          a[href="/contact"], 
          a[href="/projects"],
          button,
          .button,
          a.bg-white,
          a.border-2 {
            border-radius: var(--border-radius-btn) !important;
            overflow: hidden !important;
          }
          
          /* Fix for expertise and skill cards */
          .expertise-card, 
          .skill-card,
          .skill-item,
          .p-4.rounded-lg,
          [class*="skill"] {
            border-radius: var(--border-radius-md) !important;
            overflow: hidden !important;
          }
          
          /* Fix for tech stack section */
          [class*="techstack"],
          .rounded-2xl,
          .rounded-xl,
          .rounded-lg {
            border-radius: var(--border-radius-lg) !important;
            overflow: hidden !important;
          }
          
          /* Ensure proper sticky elements with consistent colors */
          .navbar, nav, header {
            position: sticky !important;
            top: 0 !important;
            z-index: 1000 !important;
            width: 100% !important;
            background-color: var(--nex-navbar-bg) !important;
            transition: background-color 0.3s ease !important;
            will-change: transform;
          }
          
          /* Fix navbar color transitions */
          .navbar-inner {
            background-color: transparent !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border-color: var(--nex-navbar-border) !important;
            transition: border-color 0.3s ease, backdrop-filter 0.3s ease !important;
            border-radius: var(--border-radius-lg) !important;
          }
          
          .navbar.scrolled .navbar-inner {
            border-color: var(--nex-navbar-scrolled-border) !important;
            backdrop-filter: blur(16px) !important;
            -webkit-backdrop-filter: blur(16px) !important;
          }
          
          /* Optimize Hero section */
          [class*="hero-section"],
          [class*="Hero"],
          section[data-barba="container"] {
            contain: layout style;
            border-radius: var(--border-radius-lg) !important;
            overflow: hidden !important;
          }
          
          /* Welcome screen adjustments */
          [class*="Welcome"],
          [class*="welcome"] {
            margin-top: 3rem !important;
            padding-top: 2rem !important;
            border-radius: var(--border-radius-lg) !important;
            overflow: hidden !important;
          }
          
          /* Improved smooth scrolling without uplift effect */
          .smooth-scroll {
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: none !important;
          }
          
          /* Fixed positioning fixes for floating elements */
          .fixed-element,
          [class*="chatbot"],
          .floating-button {
            position: fixed !important;
            z-index: 9999;
            transform: translateZ(0);
          }
          
          /* Disable animations on mobile */
          @media (max-width: 768px) {
            .float {
              animation: none !important;
            }
          }
          
          /* Barba.js transition overlay */
          .transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.5s ease;
          }
          
          /* TechStackSection fixes */
          .space-y-2.sm\\:space-y-3.p-3.sm\\:p-4.rounded-lg,
          .relative.bg-black.rounded-2xl {
            border-radius: var(--border-radius-lg) !important;
            overflow: hidden !important;
          }
          
          /* Welcome screen buttons */
          .welcome-screen button,
          .welcome-screen a,
          [id*="discover"],
          [id*="see-what"] {
            border-radius: var(--border-radius-btn) !important;
            overflow: hidden !important;
          }
        `}} />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground flex flex-col optimized-scroll")} data-barba="wrapper">
        <div className="transition-overlay" id="transition-overlay"></div>
        <div className="progress-bar" id="progress-bar"></div>
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <TimelineProvider>
              <Navbar />
              {/* ClientLayout wraps all client-side components */}
              <ClientLayout>
                {children}
              </ClientLayout>
            </TimelineProvider>
          </CurrencyProvider>
        </ThemeProvider>

        {/* Add script to detect scroll and optimize performance */}
        <script dangerouslySetInnerHTML={{ __html: `
          // Detect scroll to optimize performance
          let scrollTimer;
          document.addEventListener('scroll', function() {
            document.body.classList.add('is-scrolling');
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(function() {
              document.body.classList.remove('is-scrolling');
            }, 150);
          }, { passive: true });
          
          // Fix rounded edges after DOM loads
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
              
              // Adjust welcome screen position
              const welcomeScreens = document.querySelectorAll('[class*="Welcome"], [class*="welcome"]');
              welcomeScreens.forEach(el => {
                if(el instanceof HTMLElement) {
                  el.style.marginTop = '3rem';
                  el.style.paddingTop = '2rem';
                  el.style.borderRadius = '16px';
                }
              });
            };
            
            // Run on load and after any page transitions
            fixRoundedEdges();
            document.addEventListener('barba:after', fixRoundedEdges);
            
            // Run again after a short delay to catch any dynamically loaded content
            setTimeout(fixRoundedEdges, 1000);
          });
        `}} />
      </body>
    </html>
  )
}
