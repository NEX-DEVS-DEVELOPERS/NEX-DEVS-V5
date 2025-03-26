import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

export default function Logo() {
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPopup && !logoRef.current?.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPopup]);

  const handleLogoClick = (e: React.MouseEvent) => {
    // Force a hard redirect to the root URL
    window.location.href = '/';
    e.preventDefault();
  };

  const handleDevsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only show popup for non-mobile devices
    if (!isMobile) {
      setShowPopup(!showPopup); // Toggle popup
    }
  };

  return (
    <div ref={logoRef} className="relative">
      <Link href="/" onClick={handleLogoClick}>
        <motion.div 
          className="flex items-center gap-6 px-5 py-2.5 group cursor-pointer relative rounded-full"
          initial={{ background: 'rgba(255, 255, 255, 0)' }}
          whileHover={{ 
            background: 'rgba(255, 255, 255, 0.03)',
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.97 }}
          suppressHydrationWarning
        >
          {/* Modern Glassmorphism Effect */}
          <motion.div
            className="absolute inset-0 rounded-full -z-10 opacity-0 backdrop-blur-sm"
            whileHover={{
              opacity: 1,
              boxShadow: [
                "0 0 0 1px rgba(255,255,255,0.05)",
                "0 0 30px 1px rgba(168,85,247,0.2)"
              ],
              transition: { duration: 0.4 }
            }}
          />

          {/* Modern Logo Text */}
          <div className="relative">
            <motion.div 
              className="text-xl font-extrabold tracking-tight flex items-center gap-1"
            >
              <span className="bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
                NEX-
              </span>
              <motion.span
                className="relative cursor-pointer bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent"
                onClick={handleDevsClick}
                whileHover={{
                  scale: 1.05,
                  textShadow: [
                    "0 0 10px rgba(255,215,0,0.5)",
                    "0 0 15px rgba(255,215,0,0.3)",
                  ],
                }}
                animate={{
                  y: [0, -3, 0],
                  textShadow: [
                    "0 0 5px rgba(255,215,0,0.2)",
                    "0 0 10px rgba(255,215,0,0.1)",
                    "0 0 5px rgba(255,215,0,0.2)"
                  ],
                }}
                transition={{
                  y: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  textShadow: {
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              >
                DEVS
                <motion.div
                  className="absolute -left-4 top-1/2 w-2 h-2 text-amber-400"
                  animate={{
                    x: [0, 3, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  →
                </motion.div>
              </motion.span>
            </motion.div>

            {/* Modern Underline Effect */}
            <motion.div 
              className="absolute -bottom-0.5 left-0 right-0 h-[1px]"
              initial={{ background: 'linear-gradient(90deg, transparent, transparent)' }}
              whileHover={{ 
                background: [
                  'linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent)',
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                ],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            />
          </div>
          
          {/* Modern Separator */}
          <motion.div 
            className="hidden md:block w-[1px] h-4"
            initial={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent)' }}
            whileHover={{
              background: 'linear-gradient(to bottom, transparent, rgba(255,215,0,0.2), transparent)',
              height: "20px",
              transition: { duration: 0.3 }
            }}
          />
          
          {/* Modern Tagline */}
          <motion.div className="hidden md:block relative overflow-hidden">
            <motion.div 
              className="text-[10px] font-medium tracking-wider uppercase text-white/50"
              whileHover={{
                color: "rgba(255, 255, 255, 0.7)",
                transition: { duration: 0.3 }
              }}
            >
              Innovation in Development
              
              {/* Modern Line Through Effect */}
              <motion.div
                className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{
                  x: '100%',
                  transition: {
                    duration: 0.8,
                    ease: "easeInOut",
                    repeat: Infinity
                  }
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </Link>

      {/* Fixed Position Modern Popup - Only shown on non-mobile devices */}
      <AnimatePresence>
        {showPopup && !isMobile && (
          <motion.div
            className="absolute top-full left-0 mt-2 z-50 w-80"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.div 
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-gray-900 border border-indigo-500/30 shadow-xl shadow-purple-900/10"
            >
              {/* Detailed glass effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5" />
              
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-amber-500/10 blur-xl rounded-full" />
              <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/5 blur-xl rounded-full" />
              
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-5" style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")',
                backgroundSize: '20px 20px'
              }} />
              
              {/* Content container */}
              <div className="relative p-5 backdrop-blur-sm">
                {/* Enhanced close button */}
                <motion.button
                  className="absolute right-3 top-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-white/70 text-xs border border-white/10"
                  onClick={() => setShowPopup(false)}
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(255,255,255,0.2)",
                    borderColor: "rgba(255,255,255,0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  ✕
                </motion.button>
                
                {/* Enhanced title with animated underline */}
                <div className="relative mb-4">
                  <h3 className="text-base font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    NEX-DEVS Evolution
                  </h3>
                  <motion.div 
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                
                {/* Brand evolution message */}
                <motion.div
                  className="mb-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <p className="text-xs text-gray-300 leading-relaxed">
                    <span className="font-semibold text-white">From NEX-WEBS to NEX-DEVS:</span> We've expanded our expertise beyond web development to deliver comprehensive mobile solutions with advanced AI integration.
                  </p>
                </motion.div>
                
                {/* Enhanced content with more detail */}
                <div className="space-y-3 text-sm text-gray-300/90">
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </span>
                    <div>
                      <p className="font-medium text-white">Advanced AI Research</p>
                      <p className="text-xs text-gray-400 mt-0.5">Our dedicated AI research team develops cutting-edge solutions for mobile applications</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </span>
                    <div>
                      <p className="font-medium text-white">Cross-Platform Expertise</p>
                      <p className="text-xs text-gray-400 mt-0.5">Full-service development team creating native apps for iOS and Android platforms</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-gradient-to-br from-pink-500 to-amber-600 flex items-center justify-center">
                      <span className="text-white text-[8px]">✓</span>
                    </span>
                    <div>
                      <p className="font-medium text-white">Enterprise Solutions</p>
                      <p className="text-xs text-gray-400 mt-0.5">Scalable applications with real-time analytics and machine learning capabilities</p>
                    </div>
                  </motion.div>
                </div>
                
                {/* Enhanced divider */}
                <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />
                
                {/* Enhanced animated button */}
                <motion.button
                  className="w-full py-2 rounded-lg text-xs font-medium relative overflow-hidden group"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  onClick={() => setShowPopup(false)}
                >
                  <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300 uppercase tracking-wider">
                    Discover Our Capabilities
                  </span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    initial={{ y: "100%" }}
                    whileHover={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 