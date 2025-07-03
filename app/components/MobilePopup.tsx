'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MobilePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile - only show for actual mobile devices
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 640; // Stricter mobile detection
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Only consider it mobile if it's actually a mobile device AND has small screen
      const actuallyMobile = isMobileDevice && isSmallScreen && isTouchDevice;
      setIsMobile(actuallyMobile);

      // Only show popup for actual mobile devices, never for desktop
      if (actuallyMobile) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Run check immediately
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Never show for desktop users - double check
  if (!isMobile || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            className="mx-4 p-8 text-center bg-gradient-to-br from-black via-black/90 to-purple-950/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 max-w-md"
            style={{
              boxShadow: '0 8px 32px 0 rgba(76, 29, 149, 0.25)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h2 className="text-white text-2xl font-semibold mb-2 text-shadow">
                Mobile View Notice
              </h2>
              <p className="text-white/90 text-lg font-medium leading-relaxed">
                For the best experience, please view this portfolio on a laptop or desktop.
              </p>
              <p className="text-white/80 text-base">
                Mobile version has limited animations and effects to ensure smooth performance.
              </p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="mt-8 px-10 py-3.5 bg-gradient-to-r from-purple-600/30 to-purple-800/30 hover:from-purple-600/40 hover:to-purple-800/40 text-white rounded-full font-medium backdrop-blur-sm transition-all duration-300 border border-purple-500/30 hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/20"
            >
              Continue to Site
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const styles = {
  textShadow: {
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
  },
};

export default MobilePopup; 