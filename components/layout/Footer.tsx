'use client'

import { memo, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GlowEffect } from '@/components/ui/glow-effect'
import { 
  TwitterIcon, 
  LinkedinIcon, 
  GithubIcon, 
  MailIcon, 
  PhoneIcon
} from 'lucide-react'

// Memoize static content
const QUICK_LINKS = [
  ['About', '/about'],
  ['Portfolio', '/portfolio'],
  ['Services', '/services'],
  ['Blog', '/blog'],
  ['Contact', '/contact']
]

const SOCIAL_LINKS = [
  { icon: TwitterIcon, href: "https://twitter.com/username" },
  { icon: LinkedinIcon, href: "https://linkedin.com/in/username" },
  { icon: GithubIcon, href: "https://github.com/username" }
]

const FEATURES = [
  { icon: "🚀", label: "Fast Delivery" },
  { icon: "💡", label: "Creative Solutions" },
  { icon: "⚡", label: "Modern Tech" },
  { icon: "🛡️", label: "Best Practices" }
]

// Memoize Button components
const ContactButton = memo(() => (
  <Link href="/contact">
    <Button 
      size="lg"
      className="bg-white text-black text-sm sm:text-base px-4 sm:px-8 py-2 sm:py-3 transform-gpu hover:scale-[1.02] transition-transform"
    >
      <span className="font-medium">Let's Start a Project</span>
    </Button>
  </Link>
))
ContactButton.displayName = 'ContactButton'

const PortfolioButton = memo(() => (
  <Link href="/projects">
    <Button 
      size="lg"
      variant="outline"
      className="border-white/20 text-sm sm:text-base px-4 sm:px-8 py-2 sm:py-3 transform-gpu hover:scale-[1.02] transition-transform"
    >
      <span className="font-medium">View Portfolio</span>
    </Button>
  </Link>
))
PortfolioButton.displayName = 'PortfolioButton'

// Main Footer component
export default function Footer() {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <footer className="relative bg-black text-white border-t border-white/10 will-change-transform">
      {/* Optimized Glow Effects */}
      <GlowEffect 
        color="rgba(147, 51, 234, 0.1)" 
        className="w-[600px] h-[600px] top-0 left-0 opacity-30 transform-gpu"
      />
      <GlowEffect 
        color="rgba(168, 85, 247, 0.1)" 
        className="w-[600px] h-[600px] bottom-0 right-0 opacity-30 transform-gpu"
      />

      {/* Brand Logo Section */}
      <div className="container pt-8 sm:pt-12 text-center px-4">
        <div className="inline-flex items-center space-x-2 mb-6 sm:mb-8 transform-gpu">
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent will-change-transform">NEX-</span>
          <span className="text-2xl sm:text-3xl font-bold bg-white text-black px-2 sm:px-3 py-1 rounded-md will-change-transform">
            WEBS
          </span>
        </div>
      </div>

      {/* Modern Project Starter Section - Optimized */}
      <div className="container py-8 sm:py-12 text-center relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 p-4 sm:p-8 rounded-2xl transform-gpu">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent will-change-transform">
                Start Your Next Project
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
              From concept to deployment, let's build something extraordinary together. 
              Your vision, powered by modern technology and creative excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <ContactButton />
              <PortfolioButton />
            </div>
            
            {/* Optimized Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
              {FEATURES.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 transform-gpu hover:scale-[1.02] transition-transform"
                >
                  <span className="text-xl sm:text-2xl block mb-1 sm:mb-2">
                    {feature.icon}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links and Info - Optimized */}
      <div className="container py-8 sm:py-12 border-t border-white/10 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12">
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-xl font-bold text-white">
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-2">
              {QUICK_LINKS.map(([label, href]) => (
                <Link 
                  key={label}
                  href={href} 
                  className="text-sm sm:text-base text-gray-400 transform-gpu hover:scale-[1.02] transition-transform"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-xl font-bold text-white">
              Contact
            </h3>
            <div className="space-y-2">
              <a 
                href="mailto:nexwebs.org@gmail.com" 
                className="flex items-center gap-2 text-sm sm:text-base text-gray-400 transform-gpu hover:scale-[1.02] transition-transform"
              >
                <MailIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>nexwebs.org@gmail.com</span>
              </a>
              <a 
                href="tel:+92 329-2425-950" 
                className="flex items-center gap-2 text-sm sm:text-base text-gray-400 transform-gpu hover:scale-[1.02] transition-transform"
              >
                <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>+92 329-2425-950</span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-xl font-bold text-white">
              Connect
            </h3>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social, index) => {
                const Icon = social.icon
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 transform-gpu hover:scale-[1.1] transition-transform"
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-xl font-bold text-white">
              Legal
            </h3>
            <div className="text-xs sm:text-sm text-gray-400 space-y-1">
              <p className="font-medium">
                © {currentYear} NEX-WEBS
              </p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}