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

export default function Footer() {
  return (
    <footer className="relative bg-black text-white border-t border-white/10 overflow-hidden">
      {/* Enhanced Glow Effects */}
      <GlowEffect 
        color="rgba(147, 51, 234, 0.15)" 
        className="w-[700px] h-[700px] top-0 left-0 -translate-x-1/2 animate-pulse"
      />
      <GlowEffect 
        color="rgba(168, 85, 247, 0.15)" 
        className="w-[800px] h-[800px] top-1/2 right-0 translate-x-1/2 animate-pulse-slow"
      />
      <GlowEffect 
        color="rgba(139, 92, 246, 0.1)" 
        className="w-[500px] h-[500px] bottom-0 left-1/2 -translate-x-1/2 animate-pulse-slower"
      />

      {/* Brand Logo Section */}
      <div className="container pt-8 sm:pt-16 text-center px-4">
        <div className="inline-flex items-center space-x-2 mb-8 sm:mb-12 relative group">
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">NEX-</span>
          <span className="text-2xl sm:text-3xl font-bold bg-white text-black px-2 sm:px-3 py-1 rounded-md transform 
                          group-hover:scale-105 transition-all duration-300 
                          hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            WEBS
          </span>
          <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-r from-purple-500/20 to-transparent 
                          opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-500 blur-xl -z-10"></div>
        </div>
      </div>

      {/* Modern Project Starter Section */}
      <div className="container py-8 sm:py-16 text-center relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 
                         blur-3xl opacity-50 rounded-3xl transform rotate-3"></div>
          <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 p-4 sm:p-8 rounded-2xl
                         hover:border-purple-500/30 transition-all duration-500 group">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Start Your Next Project
              </span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto">
              From concept to deployment, let's build something extraordinary together. 
              Your vision, powered by modern technology and creative excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link href="/contact">
                <Button 
                  size="lg"
                  className="relative group/btn bg-white text-black hover:bg-purple-50
                             transition-all duration-500 transform hover:scale-105 
                             hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]
                             text-sm sm:text-base px-4 sm:px-8 py-2 sm:py-3"
                >
                  <span className="relative z-10 font-medium group-hover/btn:text-purple-600 transition-colors duration-300">
                    Let's Start a Project
                  </span>
                </Button>
              </Link>
              <Link href="/projects">
                <Button 
                  size="lg"
                  variant="outline"
                  className="relative group/btn border-white/20 hover:border-purple-500/50
                             transition-all duration-500 transform hover:scale-105
                             text-sm sm:text-base px-4 sm:px-8 py-2 sm:py-3"
                >
                  <span className="relative z-10 font-medium">
                    View Portfolio
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/10 
                                 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                </Button>
              </Link>
            </div>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
              {[
                { icon: "🚀", label: "Fast Delivery" },
                { icon: "💡", label: "Creative Solutions" },
                { icon: "⚡", label: "Modern Tech" },
                { icon: "🛡️", label: "Best Practices" }
              ].map((feature, index) => (
                <div key={index} className="p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 
                                          hover:border-purple-500/30 transition-all duration-300
                                          hover:bg-white/10 group/feature">
                  <span className="text-xl sm:text-2xl block mb-1 sm:mb-2 transform group-hover/feature:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400 group-hover/feature:text-white transition-colors duration-300">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links and Info */}
      <div className="container py-8 sm:py-12 border-t border-white/10 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12">
          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-xl font-bold text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <nav className="flex flex-col space-y-2 sm:space-y-3">
              {[
                ['About', '/about'],
                ['Portfolio', '/portfolio'],
                ['Services', '/services'],
                ['Blog', '/blog'],
                ['Contact', '/contact']
              ].map(([label, href]) => (
                <Link 
                  key={label}
                  href={href} 
                  className="text-sm sm:text-base text-gray-400 hover:text-white transition-all duration-300 
                             hover:translate-x-2 inline-block relative group w-fit"
                >
                  <span>{label}</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all 
                                 duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-xl font-bold text-white relative inline-block">
              Contact
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <div className="space-y-2 sm:space-y-4">
              <a 
                href="mailto:nexwebs.org@gmail.com" 
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-400 hover:text-white 
                           transition-all duration-300 group w-fit"
              >
                <MailIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300 
                                   group-hover:text-purple-500" />
                <span className="relative">
                   nexwebs.org@gmail.com
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all 
                                 duration-300 group-hover:w-full"></span>
                </span>
              </a>
              <a 
                href="tel:+92 329-2425-950" 
                className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-gray-400 hover:text-white 
                           transition-all duration-300 group w-fit"
              >
                <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300 
                                    group-hover:text-purple-500" />
                <span className="relative">
                  +92 329-2425-950
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all 
                                 duration-300 group-hover:w-full"></span>
                </span>
              </a>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-xl font-bold text-white relative inline-block">
              Connect
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <div className="flex space-x-4 sm:space-x-6">
              {[
                { icon: <TwitterIcon className="h-5 w-5 sm:h-6 sm:w-6" />, href: "https://twitter.com/username" },
                { icon: <LinkedinIcon className="h-5 w-5 sm:h-6 sm:w-6" />, href: "https://linkedin.com/in/username" },
                { icon: <GithubIcon className="h-5 w-5 sm:h-6 sm:w-6" />, href: "https://github.com/username" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-500 transition-all duration-300 
                             transform hover:scale-110 hover:-translate-y-1 relative group"
                >
                  {social.icon}
                  <span className="absolute -inset-2 bg-purple-500/20 rounded-full opacity-0 
                                 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-xl font-bold text-white relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <div className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2 group">
              <p className="font-medium relative inline-block">
                © {new Date().getFullYear()} NEX-WEBS
                <span className="absolute -inset-1 bg-purple-500/10 rounded opacity-0 
                               group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              </p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 