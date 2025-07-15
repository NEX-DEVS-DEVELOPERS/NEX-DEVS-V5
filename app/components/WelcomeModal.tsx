'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose?: () => void;
  icon?: string;
  planTitle?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  icon = '🎨',
  planTitle = 'project'
}) => {
  useEffect(() => {
    const handleBodyScroll = (shouldLock: boolean) => {
      if (shouldLock) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleBodyScroll(isOpen);

    return () => {
      handleBodyScroll(false);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            className="bg-gradient-to-br from-black/90 to-purple-900/30 rounded-2xl border border-purple-500/30 p-8 max-w-md w-full shadow-xl shadow-purple-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon at the top */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-900/20 flex items-center justify-center border border-purple-500/30">
                <span className="text-3xl">{icon}</span>
              </div>
            </div>
            
            {/* Title with sparkle */}
            <div className="relative mb-6 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to Excellence!</h2>
              <div className="absolute -right-4 -top-4 text-2xl animate-pulse">✨</div>
              <p className="text-xl text-purple-200">Your vision, our expertise</p>
              <p className="text-purple-300 mt-2 text-sm">Crafting your digital masterpiece...</p>
              
              {/* Progress bar */}
              <div className="w-full h-1 bg-purple-900/30 rounded-full mt-6 mb-8 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-700"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </div>
              
              {/* Loading dots */}
              <div className="flex justify-center gap-1 mt-4">
                {[1, 2, 3].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-2 h-2 rounded-full bg-purple-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: dot * 0.2 }}
                  />
                ))}
              </div>
            </div>
            
            {/* Message */}
            <div className="text-center mb-8">
              <p className="text-gray-300">Our team is ready to assist you with your {planTitle}.</p>
            </div>
            
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4">
              <a 
                href="mailto:nexwebs.org@gmail.com" 
                className="flex items-center justify-center gap-2 py-3 px-4 bg-black/50 hover:bg-black/70 text-white rounded-lg border border-purple-500/30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Us
              </a>
              <a 
                href="/contact" 
                className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Page
              </a>
            </div>
            
            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal; 