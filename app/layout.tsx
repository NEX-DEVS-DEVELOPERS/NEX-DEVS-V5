import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import Footer from "@/components/layout/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import Navbar from "@/components/layout/Navbar"
import EasterEggCounter from "@/components/layout/EasterEggCounter"
import { EasterEggProvider } from "@/context/EasterEggContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Ali Hasnaat - Website Developer",
  description: "Professional website developer specializing in WordPress, Shopify, and custom solutions.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={cn(inter.className, "min-h-screen bg-background text-foreground flex flex-col")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <EasterEggProvider>
            <Navbar />
            <EasterEggCounter />
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </EasterEggProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
