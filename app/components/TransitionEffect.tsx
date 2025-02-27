'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/app/utils/deviceDetection';

interface TransitionEffectProps {
  isExit?: boolean;
  message?: string;
}

const transactionMessages = [
  { title: "Preparing your journey...", subtitle: "Thank you for choosing NEX-WEBS ❤️", emoji: "🚀" },
  { title: "We're honored to serve you!", subtitle: "Your trust means everything to us ✨", emoji: "🙏" },
  { title: "Thank you for your business!", subtitle: "We'll exceed your expectations 💫", emoji: "💝" },
  { title: "See you soon!", subtitle: "We can't wait to create something amazing together ✨", emoji: "🌟" }
];

// Enhanced emoji collection for more celebratory feel
const floatingEmojis = ["✨", "🌟", "💫", "🎉", "🎊", "🎈", "🥳", "💝", "🌈"];

// Add celebration particles
const celebrationParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  emoji: ["🎉", "✨", "💫", "⭐", "🌟"][Math.floor(Math.random() * 5)]
}));

// Optimize page transition variants for faster initial load
const pageTransitionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
};

const overlayVariants = {
  initial: (isExit: boolean) => ({
    scaleY: isExit ? 0 : 1,
    opacity: 0
  }),
  animate: (isExit: boolean) => ({
    scaleY: isExit ? 1 : 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }),
  exit: {
    scaleY: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const contentVariants = {
  initial: { opacity: 0, y: 10, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Optimize floating emoji variants for better performance
const floatingEmojiVariants = {
  initial: {
    opacity: 0,
    y: 0,
    scale: 0.8
  },
  animate: {
    opacity: [0, 0.7, 0],
    y: [0, -100],
    scale: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

// Optimize celebration particle variants
const celebrationParticleVariants = {
  initial: { 
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: [0, 1, 0],
    scale: [0.8, 1, 0.8],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeOut"
    }
  }
};

// Optimize sparkle variants
const sparkleVariants = {
  initial: { 
    opacity: 0,
    scale: 0.8
  },
  animate: {
    opacity: [0, 0.8, 0],
    scale: [0.8, 1, 0.8],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

// Optimize loading dots variants
const loadingDotsVariants = {
  initial: { 
    scale: 1, 
    opacity: 0.4 
  },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

export default function TransitionEffect({ isExit = false, message = 'Welcome' }: TransitionEffectProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isExit) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 600); // Reduced from 800ms
      return () => clearTimeout(timer);
    }

    if (isExit) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % transactionMessages.length);
      }, 800); // Reduced from 1000ms
      return () => clearInterval(interval);
    }
  }, [isExit]);

  if (!isVisible && !isExit) return null;
  if (isMobile) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="transition-effect"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        {...pageTransitionVariants}
      >
        {/* Enhanced backdrop blur with optimized animations */}
        <motion.div
          className="absolute inset-0 backdrop-blur-lg bg-gradient-to-br from-black via-purple-950 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Optimized gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 50% 50%, rgba(88, 28, 135, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%)',
              'radial-gradient(circle at 50% 50%, rgba(126, 34, 206, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%)',
              'radial-gradient(circle at 50% 50%, rgba(88, 28, 135, 0.2) 0%, rgba(0, 0, 0, 0.8) 70%)'
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        />

        {/* Main overlay with optimized animations */}
        <motion.div
          custom={isExit}
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 origin-bottom bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black/80 to-black/90"
        >
          {/* Optimized purple glow effects */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute w-[800px] h-[800px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"
              style={{
                background: "radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(0,0,0,0) 70%)",
                willChange: "transform, opacity"
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear"
              }}
            />
          </div>

          {/* Optimized floating emojis */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingEmojis.slice(0, 6).map((emoji, index) => (
              <motion.div
                key={index}
                style={{ 
                  position: 'absolute',
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  willChange: "transform, opacity"
                }}
                variants={floatingEmojiVariants}
                initial="initial"
                animate="animate"
                transition={{ 
                  delay: index * 0.1,
                  duration: 2 + Math.random()
                }}
                className="text-2xl md:text-3xl"
              >
                {emoji}
              </motion.div>
            ))}
          </div>

          {/* Optimized celebration particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {celebrationParticles.slice(0, 12).map((particle) => (
              <motion.div
                key={particle.id}
                style={{
                  position: 'absolute',
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  willChange: "transform, opacity"
                }}
                variants={celebrationParticleVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: Math.random(),
                  duration: 1.5
                }}
                className="text-xl md:text-2xl"
              >
                {particle.emoji}
              </motion.div>
            ))}
          </div>

          {/* Optimized sparkle effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  willChange: "transform, opacity"
                }}
                variants={sparkleVariants}
                initial="initial"
                animate="animate"
                transition={{
                  delay: Math.random(),
                  duration: 0.8
                }}
              />
            ))}
          </div>

          {/* Enhanced content container with darker glass effect */}
          <motion.div
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-xl px-4"
          >
            <div className="relative backdrop-blur-xl bg-gradient-to-b from-purple-950/20 via-black/30 to-purple-950/20 
              rounded-2xl p-8 border border-purple-500/20
              shadow-[0_8px_32px_rgba(147,51,234,0.2)]
              before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/[0.05] before:to-transparent before:rounded-2xl before:-z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageIndex}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="text-center space-y-4"
                >
                  {/* Enhanced emoji animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: [0, 1.2, 1],
                      rotate: [-180, 0],
                      y: [0, -20, 0]
                    }}
                    transition={{ 
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      duration: 1
                    }}
                    className="text-5xl md:text-6xl mb-4 relative"
                  >
                    {/* Add floating celebration emojis around main emoji */}
                    <div className="absolute -inset-4 flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="flex items-center justify-center gap-2"
                      >
                        {["✨", "🎉", "✨"].map((emoji, i) => (
                          <span key={i} className="text-2xl opacity-60">{emoji}</span>
                        ))}
                      </motion.div>
                    </div>
                    {isExit ? transactionMessages[messageIndex].emoji : "👋"}
                  </motion.div>

                  {/* Enhanced text animations */}
                  <motion.h2 
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white"
                    animate={{
                      scale: [1, 1.02, 1],
                      opacity: [0.9, 1, 0.9]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    {isExit ? transactionMessages[messageIndex].title : message}
                  </motion.h2>

                  {isExit && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-purple-200 font-medium"
                    >
                      {transactionMessages[messageIndex].subtitle}
                    </motion.p>
                  )}

                  {/* Enhanced loading indicator with purple glow */}
                  <div className="flex justify-center items-center gap-2 mt-6">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        style={{ willChange: "transform, opacity" }}
                        transition={{ delay: i * 0.2 }}
                        variants={loadingDotsVariants}
                        initial="initial"
                        animate="animate"
                        className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-800
                          shadow-[0_0_12px_rgba(147,51,234,0.7)]"
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 