"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

interface MobileHeroToggleProps {
  className?: string;
}

export default function MobileHeroToggle({ className = '' }: MobileHeroToggleProps) {
  const [currentHero, setCurrentHero] = useState<'original' | 'business'>('original');
  const [isMobile, setIsMobile] = useState(false);
  const [isHomePage, setIsHomePage] = useState(false);
  const [isBusinessPage, setIsBusinessPage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if we're on mobile and home page
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsHomePage(pathname === '/');
    // Only show on business hero page, not the business integration page
    setIsBusinessPage(false);
  }, [pathname]);

  // Add scroll detection for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for hero toggle events from the main page
  useEffect(() => {
    const handleHeroToggle = (event: CustomEvent) => {
      setCurrentHero(event.detail.hero);
    };

    window.addEventListener('heroToggleFinished', handleHeroToggle as EventListener);

    return () => {
      window.removeEventListener('heroToggleFinished', handleHeroToggle as EventListener);
    };
  }, []);

  // Listen for welcome screen state changes
  useEffect(() => {
    const handleWelcomeScreenStateChange = (event: CustomEvent) => {
      setShowWelcome(event.detail.showWelcome);
    };

    window.addEventListener('welcomeScreenStateChange', handleWelcomeScreenStateChange as EventListener);

    return () => {
      window.removeEventListener('welcomeScreenStateChange', handleWelcomeScreenStateChange as EventListener);
    };
  }, []);

  // Handle mobile button click
  const handleToggle = () => {
    const newHero = currentHero === 'original' ? 'business' : 'original';
    setCurrentHero(newHero);

    // Only works on home page - dispatch event to sync with main toggle
    if (isHomePage) {
      const event = new CustomEvent('mobileHeroToggle', {
        detail: { hero: newHero }
      });
      window.dispatchEvent(event);
    }
  };

  // Only show on mobile, hide during welcome screen, and only show on home page
  if (!isMobile || showWelcome || !isHomePage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isScrolled ? 0.9 : 1
      }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 right-0 w-full flex justify-center px-4 ${className}`}
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        top: isScrolled ? '20px' : '100px', // Enhanced sticky positioning
        zIndex: showWelcome ? 10 : 60, // Higher z-index for better visibility
        pointerEvents: showWelcome ? 'none' : 'auto',
        position: 'fixed' // Ensure it stays sticky
      }}
    >
      <div className="relative">
        {/* Simple touch button for mobile */}
        <motion.button
          onClick={handleToggle}
          whileTap={{ scale: 0.95 }}
          className="relative backdrop-blur-xl rounded-full overflow-hidden px-6 py-3 flex items-center gap-3 mt-2"
          style={{
            background: 'rgba(0, 0, 0, 0.85)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
            touchAction: 'manipulation',
            minHeight: '44px' // Ensure proper touch target size
          }}
        >
          {/* Current mode indicator */}
          <div className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: currentHero === 'original' ? '#a855f7' : '#06b6d4'
              }}
            />
            <span className="text-white text-sm font-medium">
              {currentHero === 'original' ? 'Personal' : 'Business'}
            </span>
          </div>

          {/* Arrow indicator */}
          <motion.div
            animate={{ rotate: currentHero === 'original' ? 0 : 180 }}
            transition={{ duration: 0.3 }}
            className="text-white/70"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path 
                d="M3 4.5L6 7.5L9 4.5" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.button>

        {/* Subtle glow effect */}
        <motion.div 
          className="absolute inset-0 -m-1 rounded-full blur-lg pointer-events-none"
          style={{
            background: currentHero === 'original' 
              ? 'radial-gradient(circle, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1), transparent 70%)'
              : 'radial-gradient(circle, rgba(6, 182, 212, 0.3), rgba(6, 182, 212, 0.1), transparent 70%)',
            willChange: 'opacity, transform'
          }}
        />
      </div>
    </motion.div>
  );
}
