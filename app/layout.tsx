import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import type { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Import the client component wrapper that will handle the chatbot
import ChatbotClientWrapper from './components/ChatbotClientWrapper'

// Dynamic imports for better code splitting
const Footer = dynamic(() => import("@/components/layout/Footer"), {
  loading: () => <div className="h-20 bg-black" />
})
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
    <html lang="en" suppressHydrationWarning className={inter.variable}>
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
        {/* Add CSS animation optimization flags */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --animation-enabled: true;
          }
          
          @media (prefers-reduced-motion: reduce) {
            :root {
              --animation-enabled: false;
            }
          }
          
          /* Chatbot positioning handled by GSAP */
          
          /* Optimize float animation */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          
          .float {
            animation: float 3s ease-in-out infinite !important;
          }
          
          /* Performance optimizations */
          body {
            overscroll-behavior-y: none;
          }
          
          /* Ensure proper sticky elements */
          .navbar, nav, header {
            position: sticky;
            top: 0;
            z-index: 1000;
          }
          
          /* Optimize Hero section */
          [class*="hero-section"],
          [class*="Hero"] {
            contain: layout style;
          }
          
          /* Disable animations on mobile */
          @media (max-width: 768px) {
            .float {
              animation: none !important;
            }
          }
        `}} />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground flex flex-col smooth-scroll optimized-element")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <TimelineProvider>
              <Navbar />
              <div className="flex-1 gpu-accelerated overflow-visible" style={{ contain: 'paint style' }} data-page-content="true">
                {children}
              </div>
              <Footer />
              <ChatbotClientWrapper />
            </TimelineProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
