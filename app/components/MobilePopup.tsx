'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MobilePopup = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Run check immediately
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
            className="mx-4 p-8 text-center bg-gradient-to-br from-purple-900/20 via-black/20 to-purple-800/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/20 max-w-md"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
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