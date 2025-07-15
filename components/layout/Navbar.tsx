"use client";

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import MobileMenu from './MobileMenu'
import { useIsMobile } from '@/app/utils/deviceDetection'
import { PhoneIcon } from '@heroicons/react/24/solid'
import { Audiowide } from 'next/font/google'

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
});

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
    
    // Run initial scroll check immediately
    handleScroll();
    
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
      initial={{ opacity: 1 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        padding: '1rem 1.5rem',
        zIndex: 50,
        backgroundColor: 'transparent',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'background-color 0.3s ease'
      }}
      data-navbar="true"
    >
      <div 
        className="navbar-inner max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-4 py-2 border"
        style={{
          // Fixed height to prevent size shifting
          height: '72px',
          borderWidth: '1px',
          borderColor: scrolled 
            ? 'rgba(255, 255, 255, 0.2)' 
            : 'rgba(255, 255, 255, 0.1)',
          background: scrolled 
            ? 'rgba(0, 0, 0, 0.75)' 
            : 'rgba(5, 5, 9, 0.5)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease'
        }}
      >
        <Logo />
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-4">
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
              <div key={text} className="transform-gpu">
                <Link 
                  href={href} 
                  className={`text-sm text-white/90 hover:text-white whitespace-nowrap transition-colors duration-200 ease-out tracking-wide ${audiowide.className}`}
                  onClick={(e) => handleNavClick(e, href)}
                >
                  {text}
                </Link>
              </div>
            ))}
          </div>
          
          {/* Modern Discovery Call Button - Always visible with improved hover */}
          <div className="ml-2">
            <Link 
              href="/discovery-call"
              className={`discovery-call-button flex items-center gap-1.5 py-1 px-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full text-xs font-medium shadow-md hover:shadow-lg transition-all hover:scale-105 ${audiowide.className}`}
            >
              <PhoneIcon className="h-3 w-3" />
              <span>Discovery Call</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu />
      </div>
    </motion.nav>
  )
} 