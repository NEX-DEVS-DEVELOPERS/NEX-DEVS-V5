import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Footer from "@/components/layout/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import Navbar from "@/components/layout/Navbar"
import EasterEggCounter from "@/components/layout/EasterEggCounter"
import { EasterEggProvider } from "@/context/EasterEggContext"
import type { Metadata } from 'next'
import { CurrencyProvider } from '@/app/contexts/CurrencyContext'
import { TimelineProvider } from '@/app/contexts/TimelineContext'
import MobilePopup from './components/MobilePopup'
import { Analytics } from "@vercel/analytics/react"

// Optimize font loading - add display: 'swap' to show text with fallback font while custom font loads
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "NEX-WEBS - Professional Web Solutions",
  description: "Professional website developer specializing in WordPress, Shopify, and custom solutions.",
  metadataBase: new URL('https://your-domain.com'), // Replace with your actual domain
  openGraph: {
    title: "NEX-WEBS - Professional Web Solutions",
    description: "Professional website developer specializing in WordPress, Shopify, and custom solutions.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "NEX-WEBS - Professional Web Solutions",
    description: "Professional website developer specializing in WordPress, Shopify, and custom solutions.",
  },
  icons: {
    icon: [
      { url: '/icons/favicon.svg', type: 'image/svg+xml' },
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
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground flex flex-col")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <TimelineProvider>
              <EasterEggProvider>
                <MobilePopup />
                <Navbar />
                <EasterEggCounter />
                <div className="flex-1">
                  {children}
                </div>
                <Footer />
                <Analytics />
              </EasterEggProvider>
            </TimelineProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
