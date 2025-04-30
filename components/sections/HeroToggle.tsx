import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeroToggleProps {
  currentHero: 'original' | 'business';
  onToggle: (hero: 'original' | 'business') => void;
}

export default function HeroToggle({ currentHero, onToggle }: HeroToggleProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="absolute top-5 w-full flex justify-center z-50"
    >
      <div className="relative transform translate-y-3">
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 -m-1 rounded-full blur-lg opacity-80 animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.3), rgba(59, 130, 246, 0.2))',
             }}></div>
        
        <div className="flex p-1.5 bg-black/80 backdrop-blur-xl rounded-full border border-white/20 shadow-lg relative">
          <button
            onClick={() => onToggle('original')}
            className={`relative px-4 py-1.5 text-xs sm:text-sm rounded-full transition-all duration-500 flex items-center gap-1.5
                      ${currentHero === 'original' 
                        ? 'bg-white text-black font-medium' 
                        : 'text-white/80 hover:text-white/100'}`}
            aria-label="Switch to original hero"
          >
            <span>Primary</span>
            {currentHero === 'original' && (
              <motion.div 
                layoutId="activeToggle"
                className="absolute inset-0 bg-white rounded-full -z-10"
                initial={false}
                transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
              />
            )}
          </button>
          
          <button
            onClick={() => onToggle('business')}
            className={`relative px-4 py-1.5 text-xs sm:text-sm rounded-full transition-all duration-500 flex items-center gap-1.5
                      ${currentHero === 'business' 
                        ? 'text-white font-medium' 
                        : 'text-white/80 hover:text-white/100'}`}
            aria-label="Switch to business hero"
          >
            <span>Business</span>
            {currentHero === 'business' && (
              <motion.div 
                layoutId="activeToggle"
                className="absolute inset-0 rounded-full -z-10"
                style={{
                  background: 'linear-gradient(to right, rgb(139, 92, 246), rgb(79, 70, 229))'
                }}
                initial={false}
                transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
              />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
} 