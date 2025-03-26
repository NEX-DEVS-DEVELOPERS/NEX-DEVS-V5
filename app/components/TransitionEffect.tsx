'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/app/utils/deviceDetection';

interface TransitionEffectProps {
  isExit?: boolean;
  message?: string;
  className?: string;
}

// Modern transition messages with personality
const messages = [
  {
    greeting: "Welcome to Excellence! ✨",
    message: "Your vision, our expertise",
    details: "Crafting your digital masterpiece...",
    emoji: "🎨",
    contact: "Our team is ready to assist you"
  },
  {
    greeting: "Innovation Begins Here! 🌟",
    message: "Where creativity meets technology",
    details: "Preparing your unique experience...",
    emoji: "💫",
    contact: "Reach out anytime for support"
  },
  {
    greeting: "Let's Create Magic! ⚡",
    message: "Your success story starts now",
    details: "Building something extraordinary...",
    emoji: "✨",
    contact: "We're just a message away"
  }
];

// Geometric shapes for dynamic background
const shapes = [
  "M0,25 L25,0 L50,25 L25,50 Z", // Diamond
  "M10,0 L40,0 L50,25 L25,50 L0,25 Z", // Pentagon
  "M25,0 L50,25 L25,50 L0,25 Z", // Square Diamond
];

const TransitionEffect = ({ isExit = false }: TransitionEffectProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    // Progress animation
    const duration = 2000; // 2 seconds
    const increment = 1000 / 60; // 60fps
    const step = 100 / (duration / increment);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + step;
      });
    }, increment);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  if (isMobile) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="transition-container"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Subtle background overlay */}
        <motion.div
          className="absolute inset-0 bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* Subtle floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Main content container with glass effect */}
        <motion.div
          className="relative z-10 max-w-2xl px-8 py-10 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          {/* Message content with enhanced animations */}
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Animated emoji with subtle glow */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
                rotate: [-3, 3, -3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-0 blur-xl opacity-30 bg-white/10" />
              <div className="relative text-7xl mb-6 transform hover:scale-110 transition-transform duration-300">
                {messages[messageIndex].emoji}
              </div>
            </motion.div>

            {/* Text content with subtle effects */}
            <div className="space-y-4">
              <motion.h2 
                className="text-5xl font-bold text-white/90"
                animate={{
                  scale: [0.98, 1, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {messages[messageIndex].greeting}
              </motion.h2>
              <motion.p 
                className="text-2xl text-white/70 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {messages[messageIndex].message}
              </motion.p>
              <motion.p 
                className="text-base text-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {messages[messageIndex].details}
              </motion.p>
            </div>

            {/* Subtle progress bar */}
            <div className="w-full h-px bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/30"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            {/* Loading indicator with subtle pulse */}
            <motion.div className="flex justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-white/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
            
            {/* Contact information */}
            <motion.div 
              className="mt-6 pt-6 border-t border-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <motion.p className="text-white/60 text-center mb-2">
                {messages[messageIndex].contact}
              </motion.p>
              <div className="flex justify-center gap-4 mt-3">
                <motion.a 
                  href="mailto:contact@nex-webs.com"
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email Us</span>
                </motion.a>
                <motion.a 
                  href="/contact"
                  className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Contact Page</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionEffect; 