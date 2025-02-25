'use client';

import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center relative">
        {/* Main loading container with pulsing background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center relative"
        >
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl w-32 h-32 animate-pulse" />
          
          {/* Loading spinner container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-6">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute inset-0 border-2 sm:border-[3px] border-purple-500/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle rotating ring */}
            <motion.div
              className="absolute inset-2 border-2 sm:border-[3px] border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner rotating ring */}
            <motion.div
              className="absolute inset-4 border-2 sm:border-[3px] border-t-purple-400 border-r-purple-400 border-b-transparent border-l-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Center dot */}
            <motion.div
              className="absolute inset-[45%] bg-purple-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Text animations */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <motion.h2
              className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide"
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Loading Prices
            </motion.h2>
            
            <div className="flex items-center justify-center gap-1">
              <motion.span
                className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
              />
              <motion.span
                className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
              />
              <motion.span
                className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen; 