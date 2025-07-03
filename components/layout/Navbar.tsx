'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import { useIsMobile } from '@/app/utils/deviceDetection'
import { PhoneIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
  const isMobile = useIsMobile()
  const navRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [showCallButton, setShowCallButton] = useState(true)

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === '/') {
      // Force a hard redirect for the home link
      window.location.href = '/';
      e.preventDefault();
    }
  };

  // Apply CSS-based sticky behavior and handle scroll effects
  useEffect(() => {
    if (!navRef.current || typeof window === 'undefined') return;

    // Apply initial styles to ensure the navbar is fixed and sticky
    const applyStyles = () => {
      if (!navRef.current) return;
      
      // Add data attributes for navbar identification
      navRef.current.setAttribute('data-navbar', 'true');
    };
    
    // Apply styles immediately
    applyStyles();
    
    // Handle scroll events for navbar background change
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Re-apply styles on resize with debounce for better performance
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        applyStyles();
      }, 100);
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <motion.nav 
      ref={navRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
      }}
      className={`navbar gpu-accelerated ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        padding: '1rem 1.5rem',
        zIndex: 50,
        backgroundColor: 'transparent',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      data-navbar="true"
    >
      <div 
        className={`navbar-inner max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-4 py-2 border transform-gpu transition-all duration-300 ease-out ${
          scrolled 
            ? 'bg-black/80 border-white/20 shadow-lg shadow-white/10' 
            : 'bg-white/5 border-white/10'
        }`}
        style={{
          height: scrolled ? '60px' : '75px',
          transform: `scale(${scrolled ? 0.98 : 1})`,
          padding: scrolled ? '0 1rem' : '0 1.5rem',
          borderWidth: '1px',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
        }}
      >
        <Logo />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <AnimatePresence mode="wait">
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
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: 0.2,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                className="transform-gpu seq-item"
              >
                <Link 
                  href={href} 
                  className="text-sm hover:text-gray-300 whitespace-nowrap transition-colors duration-200 ease-out"
                  onClick={(e) => handleNavClick(e, href)}
                >
                  {text}
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Modern Discovery Call Button - Always visible but with animated appearance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1,
              scale: 1,
              x: 0
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="ml-2"
          >
            <Link 
              href="/discovery-call"
              className="discovery-call-button flex items-center gap-2 py-1.5 px-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>Discovery Call</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </motion.nav>
  )
} 