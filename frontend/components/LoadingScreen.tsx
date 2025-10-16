'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Mobile-specific loading animation
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 px-4">
        {/* Simple, modern mobile loading animation */}
        <div className="w-full max-w-[280px] flex flex-col items-center">
          {/* Pulsing logo */}
          <motion.div
            className="w-16 h-16 bg-purple-600 rounded-full mb-8 flex items-center justify-center"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 0 0 rgba(168, 85, 247, 0.7)',
                '0 0 0 10px rgba(168, 85, 247, 0)',
                '0 0 0 0 rgba(168, 85, 247, 0)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-white text-2xl font-bold">$</span>
          </motion.div>
          
          {/* Loading text */}
          <motion.h2
            className="text-xl font-bold text-white mb-6"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading Pricing
          </motion.h2>
          
          {/* Modern loading bar */}
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
              initial={{ width: '0%', x: '-100%' }}
              animate={{ 
                width: '100%', 
                x: '0%',
                transition: { duration: 1, ease: "easeInOut" }
              }}
              exit={{ 
                x: '100%',
                transition: { duration: 1, ease: "easeInOut" }
              }}
              transition={{
                repeat: Infinity,
                repeatType: "loop",
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </div>
          
          {/* Loading message */}
          <div className="mt-4 flex items-center justify-center">
            <motion.p
              className="text-purple-300 text-sm"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Preparing your experience
            </motion.p>
            <motion.div
              className="flex ml-2"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 h-1 bg-purple-400 rounded-full mx-0.5"
                  animate={{ 
                    y: [0, -3, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop loading animation (original)
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center relative">
        {/* Animated circles in background */}
        <div className="absolute">
          <motion.div
            className="w-32 h-32 rounded-full border-2 border-purple-500/20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="w-48 h-48 rounded-full border-2 border-purple-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: -360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Dollar sign icon */}
        <motion.div
          className="relative z-10 mb-6"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-4xl text-purple-400 font-bold">$</div>
        </motion.div>

        {/* Main loading spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-400 border-b-purple-300 border-l-transparent rounded-full shadow-lg shadow-purple-500/20"
        />
        
        {/* Loading Text */}
        <motion.h2
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mt-6"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Loading Pricing
        </motion.h2>

        {/* Status Text with animated dots */}
        <div className="flex items-center gap-1 mt-2">
          <motion.p
            className="text-purple-300/70 text-sm font-medium tracking-wide"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Calculating best offers
          </motion.p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-purple-400"
                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 