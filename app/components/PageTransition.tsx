'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  isPresent: boolean;
  onExitComplete?: () => void;
}

export default function PageTransition({ isPresent, onExitComplete }: PageTransitionProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isPresent) {
      setIsAnimating(true);
    }
  }, [isPresent]);

  return (
    <>
      <motion.div
        initial={false}
        animate={
          isPresent 
            ? { scaleY: 0, transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1] } }
            : { scaleY: 1, transition: { duration: 0.5, ease: [0.645, 0.045, 0.355, 1] } }
        }
        onAnimationComplete={() => {
          setIsAnimating(false);
          if (!isPresent && onExitComplete) {
            onExitComplete();
          }
        }}
        style={{
          originY: isPresent ? 0 : 1,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
          zIndex: 999,
        }}
      />
      
      {/* Sliding content effect */}
      <motion.div
        initial={false}
        animate={
          isPresent
            ? { 
                y: 0,
                opacity: 1,
                transition: { 
                  duration: 0.5,
                  ease: [0.645, 0.045, 0.355, 1],
                  delay: 0.2
                }
              }
            : { 
                y: 100,
                opacity: 0,
                transition: { 
                  duration: 0.5,
                  ease: [0.645, 0.045, 0.355, 1]
                }
              }
        }
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          pointerEvents: 'none',
        }}
      >
        <div className="text-white text-4xl font-bold tracking-wider">
          {isPresent ? 'Welcome' : 'See you soon!'}
        </div>
      </motion.div>
    </>
  );
} 