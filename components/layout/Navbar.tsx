"use client";

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === '/') {
      // Force a hard redirect for the home link
      window.location.href = '/';
      e.preventDefault();
    }
    // Close mobile menu when navigating
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Mobile menu items
  const mobileMenuItems = [
    ['Home', '/'],
    ['What we offer', '/services'],
    ['About Me', '/about'],
    ['My Projects', '/work'],
    ['My Blogs', '/blog'],
    ['FAQs', '/faqs'],
    ['Contact/Checkout', '/contact'],
    ['Pricing', '/pricing']
  ];

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
      className={`navbar ${scrolled ? 'scrolled' : ''} relative`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        padding: '1rem 1.5rem',
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'background-color 0.3s ease, backdrop-filter 0.3s ease'
      }}
      data-navbar="true"
    >
      <div
        className="navbar-inner max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-4 py-2 border"
        style={{
          // Fixed height to prevent size shifting
          height: '72px',
          borderWidth: '2px',
          borderColor: scrolled
            ? 'rgba(168, 85, 247, 0.8)'
            : 'rgba(168, 85, 247, 0.6)',
          background: scrolled
            ? 'rgba(0, 0, 0, 0.85)'
            : 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="relative z-[65] p-3 group rounded-lg hover:bg-purple-500/10 transition-all duration-200"
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              touchAction: 'manipulation'
            }}
          >
            <div className="flex flex-col justify-between w-6 h-5">
              <motion.span
                animate={mobileMenuOpen
                  ? { rotate: 45, y: 8, backgroundColor: "#a855f7" }
                  : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="w-full h-[2px] bg-white block transition-all duration-200 origin-center"
              />
              <motion.span
                animate={mobileMenuOpen
                  ? { opacity: 0, x: -8, scale: 0.8 }
                  : { opacity: 1, x: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="w-4/5 h-[2px] bg-white block transition-all duration-200"
              />
              <motion.span
                animate={mobileMenuOpen
                  ? { rotate: -45, y: -8, backgroundColor: "#a855f7" }
                  : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="w-full h-[2px] bg-white block transition-all duration-200 origin-center"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.3 },
              y: { duration: 0.4 }
            }}
            className="md:hidden fixed left-0 right-0 z-[1001] overflow-hidden"
            style={{
              top: '100px', // Fixed position below navbar
              background: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderTop: '2px solid rgba(168, 85, 247, 0.6)',
              borderLeft: '2px solid rgba(168, 85, 247, 0.6)',
              borderRight: '2px solid rgba(168, 85, 247, 0.6)',
              borderBottom: '2px solid rgba(168, 85, 247, 0.6)',
              borderTopLeftRadius: '0px',
              borderTopRightRadius: '0px',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              marginLeft: '1.5rem',
              marginRight: '1.5rem',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="px-6 py-6">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {mobileMenuItems.map(([text, href], index) => (
                  <motion.div
                    key={text}
                    initial={{ y: -15, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -10, opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: index * 0.08,
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    <Link
                      href={href}
                      className={`block text-sm text-white/90 hover:text-white py-3 px-4 rounded-lg hover:bg-purple-500/10 transition-all duration-200 text-center border border-white/10 hover:border-purple-500/30 ${audiowide.className}`}
                      onClick={handleNavClick}
                      style={{
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        touchAction: 'manipulation'
                      }}
                    >
                      {text}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Discovery Call Button */}
              <motion.div
                initial={{ y: -15, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -10, opacity: 0, scale: 0.9 }}
                transition={{
                  delay: 0.5,
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="flex justify-center"
              >
                <Link
                  href="/discovery-call"
                  className={`flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105 ${audiowide.className}`}
                  onClick={handleNavClick}
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>Discovery Call</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] md:hidden"
            style={{ top: '100px' }} // Start below navbar
          />
        )}
      </AnimatePresence>
    </motion.nav>
  )
}