'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Audiowide } from 'next/font/google';

// Initialize the Audiowide font
const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface AIFirstAgencyPopupProps {
  isVisible: boolean;
  onClose: () => void;
}

const AIFirstAgencyPopup: React.FC<AIFirstAgencyPopupProps> = ({ isVisible, onClose }) => {
  console.log('AIFirstAgencyPopup render - isVisible:', isVisible);
  
  // Ensure popup appears immediately when welcome screen closes
  React.useEffect(() => {
    if (isVisible) {
      console.log('AI First Agency popup is now visible');
    }
  }, [isVisible]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-6"
          style={{
            top: '96px', // Slightly lower to avoid navbar overlap
            height: 'calc(100vh - 96px)', // Reduce height accordingly
            background: `
                linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(15, 15, 15, 0.3) 50%, rgba(0, 0, 0, 0.4) 100%)
              `,
            backdropFilter: 'blur(8px) saturate(150%)',
            WebkitBackdropFilter: 'blur(8px) saturate(150%)',
          }}
          onClick={onClose}
        >
          {/* Main popup container - Horizontal layout with advanced glassmorphism */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="relative max-w-5xl w-[94%] md:w-[92%] mx-auto transform-gpu"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `
                linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%),
                linear-gradient(225deg, rgba(120, 119, 198, 0.06) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(74, 144, 226, 0.06) 100%)
              `,
              backdropFilter: 'blur(15px) saturate(160%)',
              WebkitBackdropFilter: 'blur(15px) saturate(160%)',
              border: '2px solid rgba(255, 255, 255, 0.18)',
              borderRadius: '28px',
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.25),
                0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                0 0 50px rgba(147, 51, 234, 0.1)
              `,
              overflow: 'hidden',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform, opacity'
            }}
          >
            {/* Advanced glassmorphism overlay */}
            <div 
              className="absolute inset-0 rounded-[28px]"
              style={{
                background: `
                  radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(74, 144, 226, 0.1) 0%, transparent 50%)
                `,
                mixBlendMode: 'multiply'
              }}
            />
            
            {/* Neural Network Background Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[28px]">
              {/* Neural network nodes */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute inset-0"
              >
                {/* Floating nodes with connections */}
                <div className="absolute top-16 left-20 w-2 h-2 bg-purple-400/40 rounded-full"></div>
                <div className="absolute top-32 left-40 w-1.5 h-1.5 bg-blue-400/40 rounded-full"></div>
                <div className="absolute top-24 right-32 w-2 h-2 bg-cyan-400/40 rounded-full"></div>
                <div className="absolute bottom-32 left-16 w-1.5 h-1.5 bg-indigo-400/40 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-400/40 rounded-full"></div>
                <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-pink-400/40 rounded-full"></div>
                <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-violet-400/40 rounded-full"></div>
                
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ mixBlendMode: 'screen' }}>
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 3, delay: 1 }}
                    x1="80" y1="64" x2="160" y2="128" 
                    stroke="rgba(147, 51, 234, 0.3)" 
                    strokeWidth="1" 
                    strokeDasharray="2,2"
                  />
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 3, delay: 1.5 }}
                    x1="160" y1="128" x2="320" y2="96" 
                    stroke="rgba(59, 130, 246, 0.3)" 
                    strokeWidth="1" 
                    strokeDasharray="2,2"
                  />
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 3, delay: 2 }}
                    x1="64" y1="288" x2="240" y2="200" 
                    stroke="rgba(99, 102, 241, 0.3)" 
                    strokeWidth="1" 
                    strokeDasharray="2,2"
                  />
                  <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ duration: 3, delay: 2.5 }}
                    x1="240" y1="200" x2="400" y2="240" 
                    stroke="rgba(236, 72, 153, 0.3)" 
                    strokeWidth="1" 
                    strokeDasharray="2,2"
                  />
                </svg>
                
                {/* Subtle data flow particles */}
                {/* Disabled flowing particles to prevent micro-jitter */}
              </motion.div>
            </div>

            {/* Close button - Moved to left side with smooth effects */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              onMouseDown={onClose} // Immediate response on mouse down
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose(); // Immediate response on touch start
              }}
              onClick={onClose} // Fallback for accessibility
              className="absolute top-6 left-6 z-20 w-10 h-10 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-md border border-white/30 transition-all duration-150 cursor-pointer"
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
                userSelect: 'none',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.18) inset'
              }}
            >
              <span className="text-white text-lg font-bold leading-none pointer-events-none">
                ×
              </span>
            </motion.button>

            {/* Top Neon Lines - Professional Enhancement */}
            <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden rounded-t-[28px] pointer-events-none z-5">
              {/* Three different sized neon lines */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "60%", opacity: 0.8 }}
                transition={{ duration: 1.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-2 left-4 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))',
                  boxShadow: '0 0 10px rgba(147, 51, 234, 0.6)'
                }}
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "40%", opacity: 0.9 }}
                transition={{ duration: 1.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-4 right-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))',
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)'
                }}
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "25%", opacity: 0.7 }}
                transition={{ duration: 1.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-6 left-1/3 h-0.5 bg-gradient-to-r from-indigo-400 to-violet-500 shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.8))',
                  boxShadow: '0 0 6px rgba(99, 102, 241, 0.6)'
                }}
              />
            </div>

            {/* Content container - Horizontal layout with grid */}
            <div className="relative z-10 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                {/* Left Section - Logo and Branding */}
                <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center md:text-left space-y-6"
                >
                  {/* AI Stats Box */}
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg mb-6 mt-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)',
                      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                          className="text-base font-bold text-white"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          500+
                        </motion.div>
                        <div className="text-xs text-white/70">AI Models</div>
                      </div>
                      <div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.92, ease: [0.22, 1, 0.36, 1] }}
                          className="text-base font-bold text-white"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          99.9%
                        </motion.div>
                        <div className="text-xs text-white/70">Uptime</div>
                      </div>
                      <div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 0.99, ease: [0.22, 1, 0.36, 1] }}
                          className="text-base font-bold text-white"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          24/7
                        </motion.div>
                        <div className="text-xs text-white/70">Support</div>
                      </div>
                      <div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6, delay: 1.06, ease: [0.22, 1, 0.36, 1] }}
                          className="text-base font-bold text-white"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          ISO
                        </motion.div>
                        <div className="text-xs text-white/70">Certified</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Logo */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.94, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <div className="w-24 h-24 mx-auto md:mx-0 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center p-3 shadow-xl">
                      <img
                        src="https://ik.imagekit.io/u7ipvwnqb/Beige%20and%20Black%20Classic%20Initial%20Wedding%20Logo.png?updatedAt=1752254056269"
                        alt="NEX-DEVS Logo"
                        className="w-full h-full object-contain rounded-full"
                      />
                    </div>
                  </motion.div>
                  
                  {/* Brand Text */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-2"
                    style={{ willChange: 'transform, opacity' }}
                  >
                    <motion.h1
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                      className={`${audiowide.className} text-3xl md:text-4xl font-bold text-white`}
                      style={{
                        textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '1.5px',
                        willChange: 'transform, opacity'
                      }}
                    >
                      AI FIRST
                    </motion.h1>
                    <motion.h1
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.97, ease: [0.22, 1, 0.36, 1] }}
                      className={`${audiowide.className} text-3xl md:text-4xl font-bold text-white`}
                      style={{
                        textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                        letterSpacing: '1.5px',
                        willChange: 'transform, opacity'
                      }}
                    >
                      AGENCY
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.04, ease: [0.22, 1, 0.36, 1] }}
                      className={`${audiowide.className} text-lg text-white/90`}
                      style={{
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                        willChange: 'transform, opacity'
                      }}
                    >
                      Powered by NEX-DEVS
                    </motion.p>
                  </motion.div>
                </motion.div>

                {/* Center Section - Main Description */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.0, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center space-y-6"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-white/90 text-lg leading-relaxed"
                    style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      willChange: 'transform, opacity'
                    }}
                  >
                    We specialize in cutting-edge AI solutions that transform businesses through intelligent automation, 
                    custom AI integrations, and advanced machine learning applications.
                  </motion.p>
                  
                  {/* Call to action button */}
                  <motion.button
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2 } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
                    onClick={onClose}
                    className="bg-white hover:bg-gray-100 text-black px-8 py-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 font-medium shadow-lg"
                    style={{
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05) inset'
                    }}
                  >
                    Explore Our AI Services
                  </motion.button>
                  
                  {/* Bottom tagline */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                    className="text-white/70 text-sm italic"
                    style={{
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      willChange: 'transform, opacity'
                    }}
                  >
                    Where Artificial Intelligence Meets Human Innovation
                  </motion.p>
                </motion.div>
                
                {/* Right Section - Features */}
                <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1.0, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  {/* AI Expertise */}
                  <motion.div
                    initial={{ opacity: 0, x: 25, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/25 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <motion.h3
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                      className={`${audiowide.className} text-white text-base font-semibold mb-3`}
                      style={{ willChange: 'transform, opacity' }}
                    >
                      AI EXPERTISE
                    </motion.h3>
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      className="text-white/85 text-sm space-y-2"
                      style={{ willChange: 'opacity' }}
                    >
                      {['RAG Agent Development', 'NLP & Text Processing', 'Vector Embeddings', 'API Integration', 'ML Model Training', 'AI Dashboard Analytics'].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1.15 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>

                  {/* Compliance & Security */}
                  <motion.div
                    initial={{ opacity: 0, x: 25, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/25 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
                      willChange: 'transform, opacity'
                    }}
                  >
                    <motion.h3
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      className={`${audiowide.className} text-white text-base font-semibold mb-3`}
                      style={{ willChange: 'transform, opacity' }}
                    >
                      ENTERPRISE READY
                    </motion.h3>
                    <motion.ul
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      className="text-white/85 text-sm space-y-2"
                      style={{ willChange: 'opacity' }}
                    >
                      {['SOC 2 Type II Compliant', 'Enterprise API Security', 'Custom AI Dashboards', 'Multi-Model Integration'].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 1.25 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                          className="flex items-center"
                          style={{ willChange: 'transform, opacity' }}
                        >
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Neon Lines - Matching top design */}
            <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden rounded-b-[28px] pointer-events-none z-5">
              {/* Three different sized neon lines at bottom */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "45%", opacity: 0.8 }}
                transition={{ duration: 1.6, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-6 right-4 h-0.5 bg-gradient-to-r from-purple-400 to-purple-600 shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.8))',
                  boxShadow: '0 0 10px rgba(147, 51, 234, 0.6)',
                  willChange: 'width, opacity'
                }}
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "30%", opacity: 0.9 }}
                transition={{ duration: 1.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-4 left-6 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))',
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                  willChange: 'width, opacity'
                }}
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "35%", opacity: 0.7 }}
                transition={{ duration: 1.4, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute bottom-2 right-1/3 h-0.5 bg-gradient-to-r from-indigo-400 to-violet-500 shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.8))',
                  boxShadow: '0 0 6px rgba(99, 102, 241, 0.6)',
                  willChange: 'width, opacity'
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIFirstAgencyPopup;