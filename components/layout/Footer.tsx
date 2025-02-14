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
      <div className="container pt-16 text-center">
        <div className="inline-flex items-center space-x-2 mb-12 relative group">
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-purple-300 bg-clip-text text-transparent">NEX-</span>
          <span className="text-3xl font-bold bg-white text-black px-3 py-1 rounded-md transform 
                          group-hover:scale-105 transition-all duration-300 
                          hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            WEBS
          </span>
          <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-r from-purple-500/20 to-transparent 
                          opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-500 blur-xl -z-10"></div>
        </div>
      </div>

      {/* Let's Work Together Section */}
      <div className="container py-16 text-center relative">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white 
                         bg-clip-text text-transparent animate-gradient-x">
            Let's Work Together
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500">
            Ready to bring your digital vision to life? I'm here to help transform your ideas into 
            stunning, functional websites that drive results.
          </p>
          <Button 
            size="lg"
            className="relative group bg-white text-black hover:bg-purple-50
                       transition-all duration-500 transform hover:scale-105 
                       hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
          >
            <span className="relative z-10 font-medium group-hover:text-purple-600 transition-colors duration-300">
              Start a Project
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 transform translate-y-[102%] 
                          group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
          </Button>
        </div>
      </div>

      {/* Footer Links and Info */}
      <div className="container py-12 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-white relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <nav className="flex flex-col space-y-3">
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
                  className="text-gray-400 hover:text-white transition-all duration-300 
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
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-white relative inline-block">
              Contact
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <div className="space-y-4">
              <a 
                href="nexwebs.org@gmail.com" 
                className="flex items-center gap-3 text-gray-400 hover:text-white 
                           transition-all duration-300 group w-fit"
              >
                <MailIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300 
                                   group-hover:text-purple-500" />
                <span className="relative">
                   nexwebs.org@gmail.com
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all 
                                 duration-300 group-hover:w-full"></span>
                </span>
              </a>
              <a 
                href="tel:+92 329-2425-950" 
                className="flex items-center gap-3 text-gray-400 hover:text-white 
                           transition-all duration-300 group w-fit"
              >
                <PhoneIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300 
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
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-white relative inline-block">
              Connect
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <div className="flex space-x-6">
              {[
                { icon: <TwitterIcon className="h-6 w-6" />, href: "https://twitter.com/username" },
                { icon: <LinkedinIcon className="h-6 w-6" />, href: "https://linkedin.com/in/username" },
                { icon: <GithubIcon className="h-6 w-6" />, href: "https://github.com/username" }
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
          <div className="space-y-6">
            <h3 className="font-bold text-xl text-white relative inline-block">
              Legal
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-purple-500"></span>
            </h3>
            <div className="text-sm text-gray-400 space-y-2 group">
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