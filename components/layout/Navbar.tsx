'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import { useIsMobile } from '@/app/utils/deviceDetection'

export default function Navbar() {
  const isMobile = useIsMobile()

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === '/') {
      // Force a hard redirect for the home link
      window.location.href = '/';
      e.preventDefault();
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: isMobile ? 0.3 : 0.5 }}
      className="fixed top-0 w-full py-4 px-6 z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
        <Logo />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            ['Home', '/'],
            ['What we offer', '/services'],
            ['About Me', '/about'],
            ['My Projects', '/work'],
            ['My Blogs', '/blog'],
            ['FAQs', '/faqs'],
            ['Contact/Checkout', '/contact'],
            ['Pricing', '/pricing']
          ].map(([text, href], index) => (
            <motion.div
              key={text}
              initial={isMobile ? { opacity: 1 } : { opacity: 0, y: -20 }}
              animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={isMobile ? { duration: 0 } : { delay: index * 0.1 }}
              whileHover={isMobile ? {} : { y: -3 }}
              className="preserve-transition"
            >
              <Link 
                href={href} 
                className="hover:text-gray-300"
                onClick={(e) => handleNavClick(e, href)}
              >
                {text}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </motion.nav>
  )
} 