import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface HeroToggleProps {
  currentHero: 'original' | 'business';
  onToggle: (hero: 'original' | 'business') => void;
  isHeroPage?: boolean;
}

export default function HeroToggle({ currentHero, onToggle, isHeroPage = false }: HeroToggleProps) {
  // Track previous hero state for animations
  const [prevHero, setPrevHero] = useState<'original' | 'business'>(currentHero);
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const toggleContainerRef = useRef<HTMLDivElement>(null);
  
  // Track glitch effect state
  const [isGlitching, setIsGlitching] = useState(false);
  
  // Get container width for calculations
  const [containerWidth, setContainerWidth] = useState(0);
  const [handleWidth, setHandleWidth] = useState(0);
  
  // Motion values for the slider with improved spring settings for smoother movement
  const x = useMotionValue(currentHero === 'original' ? 0 : containerWidth - handleWidth);
  // More optimized spring settings for smoother 60fps animation - adjusted for smoother sliding
  const springX = useSpring(x, { damping: 25, stiffness: 280, mass: 0.5 }); 
  
  // Calculate progress (0 to 1) based on slider position
  const progress = useTransform(
    springX, 
    [0, containerWidth - handleWidth], 
    [0, 1]
  );
  
  // Transform progress to background colors with smoother gradient transitions
  const sliderBgColor = useTransform(
    progress,
    [0, 0.4, 0.6, 1], // Add intermediate points for smoother transition
    [
      'linear-gradient(to right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6))',
      'linear-gradient(to right, rgba(255, 255, 255, 0.5), rgba(168, 85, 247, 0.3))',
      'linear-gradient(to right, rgba(168, 85, 247, 0.4), rgba(139, 92, 246, 0.5))',
      'linear-gradient(to right, rgba(139, 92, 246, 0.6), rgba(79, 70, 229, 0.6))'
    ]
  );
  
  // Reduced blur strength for better text visibility
  const leftBlur = useTransform(progress, [0, 0.4, 0.6, 1], [0, 0.5, 1, 1.5]); // Further reduced blur values
  const rightBlur = useTransform(progress, [0, 0.4, 0.6, 1], [1.5, 1, 0.5, 0]); // Further reduced blur values
  
  // Text opacity based on slider position - higher minimum opacity for better visibility
  const leftTextOpacity = useTransform(progress, [0, 0.4, 0.6], [1, 0.85, 0.8]);
  const rightTextOpacity = useTransform(progress, [0.4, 0.6, 1], [0.8, 0.85, 1]);
  
  // New transform values for lift-up effect - more subtle
  const heroLift = useTransform(progress, [0, 0.5, 1], [0, -8, 0]); // Reduced from -15 to -8
  const heroScale = useTransform(progress, [0, 0.5, 1], [1, 1.01, 1]); // Reduced from 1.03 to 1.01
  const heroRotate = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [0, 0.2, 0, -0.2, 0]); // Reduced rotation
  
  // Update container dimensions on mount and resize
  useEffect(() => {
    if (!toggleContainerRef.current) return;
    
    const updateDimensions = () => {
      if (toggleContainerRef.current) {
        const rect = toggleContainerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
        // Making handle thinner - 35% of container instead of 40%
        setHandleWidth(rect.width * 0.35);
        
        // Update x position based on current hero
        x.set(currentHero === 'original' ? 0 : rect.width - rect.width * 0.35);
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [currentHero, x]);
  
  // Update previous hero when current changes
  useEffect(() => {
    setPrevHero(currentHero);
  }, [currentHero]);

  // Show hint after a delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Hide hint after it's been shown for a few seconds
  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showHint]);
  
  // Trigger glitch effect when dragging - more subtle and optimized for 60fps
  useEffect(() => {
    if (isDragging) {
      setIsGlitching(true);
      
      // Add event listener to track progress changes - throttled for better performance
      let lastUpdate = 0;
      const updateInterval = 1000 / 60; // Limit to 60fps
      
      const unsubscribe = progress.onChange(value => {
        const now = performance.now();
        if (now - lastUpdate < updateInterval) return;
        lastUpdate = now;
        
        // Ensure glitching is active during drag - with less intensity
        setIsGlitching(value > 0.1 && value < 0.9);
        
        // Dispatch custom event for hero section to respond to
        const event = new CustomEvent('heroToggleProgress', { 
          detail: { 
            progress: value,
            isDragging: isDragging
          } 
        });
        window.dispatchEvent(event);
      });
      
      return () => {
        unsubscribe();
      };
    } else {
      // Small delay before turning off glitch effect
      const timer = setTimeout(() => {
        setIsGlitching(false);
      }, 200); // Reduced from 300ms
      
      return () => clearTimeout(timer);
    }
  }, [isDragging, progress]);
  
  // Handle drag end - determine which hero to show based on position
  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Get current position
    const currentPosition = springX.get();
    const threshold = containerWidth / 2 - handleWidth / 2;
    
    // Determine which hero to show based on position
    if (currentPosition < threshold) {
      // Snap to original
      springX.set(0);
      if (currentHero !== 'original') {
        setPrevHero(currentHero);
        onToggle('original');
      }
    } else {
      // Snap to business
      springX.set(containerWidth - handleWidth);
      if (currentHero !== 'business') {
    setPrevHero(currentHero);
        onToggle('business');
      }
    }
    
    // Dispatch final position event
    const finalEvent = new CustomEvent('heroToggleFinished', { 
      detail: { 
        hero: currentPosition < threshold ? 'original' : 'business'
      } 
    });
    window.dispatchEvent(finalEvent);
  };

  // Glitch animation variants - more subtle for better performance
  const glitchVariants = {
    normal: {
      x: 0,
      opacity: 1,
      skewX: 0,
    },
    glitch: {
      x: [-0.5, 0.75, -0.75, 0.5, -0.5, 0], // Reduced values
      opacity: [1, 0.9, 0.95, 0.85, 1],
      skewX: [0, 1, -1, 0.5, 0], // Reduced values
      transition: {
        duration: 0.3, // Faster animation
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`fixed left-0 right-0 w-full flex justify-center z-[60] px-4 ${
        isHeroPage ? 'top-16 sm:top-8' : 'top-16 sm:top-19'
      }`}
      style={{ transform: 'translate3d(0, 0, 0)' }}
    >
      <div className="relative">
        {/* Animated hint to slide */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute -top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            >
              <div className="bg-black/90 text-white text-xs px-3 py-1.5 rounded-full border border-purple-500/50 flex items-center gap-2 shadow-lg shadow-purple-500/20">
                <span className="animate-pulse">👆</span>
                <span>Slide to switch view</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Enhanced glow effect with animated pulse - more subtle */}
        <motion.div 
          className="absolute inset-0 -m-1 rounded-full blur-lg opacity-70"
          animate={{
            opacity: [0.5, 0.7, 0.5],
            scale: [1, 1.01, 1],
          }}
          transition={{
            duration: 4, // Slower animation
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.1))',
          }}
        ></motion.div>
        
        {/* Main slider container with frosted glass effect and black border */}
        <div
          ref={toggleContainerRef}
          className={`relative backdrop-blur-xl rounded-full border-2 border-black shadow-lg overflow-hidden ${
            isHeroPage ? 'w-56 h-8 sm:w-64 sm:h-9' : 'w-60 h-10 sm:w-64 sm:h-10'
          }`}
          style={{
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            cursor: isDragging ? 'grabbing' : 'grab',
            background: 'rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={() => setShowHint(true)}
        >
          {/* Glitch effect border overlay - more subtle */}
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            variants={glitchVariants}
            animate={isGlitching ? "glitch" : "normal"}
          >
            <div className="absolute inset-0 border-2 border-black opacity-60"></div>
            <div className="absolute inset-0 border-t-[1px] border-r-[1px] border-purple-500/40 translate-x-[0.5px] -translate-y-[0.5px]"></div>
            <div className="absolute inset-0 border-b-[1px] border-l-[1px] border-purple-500/40 -translate-x-[0.5px] translate-y-[0.5px]"></div>
          </motion.div>
          
          {/* Track with gradient background - more transparent */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{
              background: sliderBgColor,
              willChange: 'background',
              backdropFilter: 'blur(8px)'
            }}
          />
          
          {/* Left side text - Meet-ALI&TEAM */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-15 px-4"
            style={{ 
              width: handleWidth,
              opacity: leftTextOpacity,
              filter: `blur(${leftBlur}px)`,
              transition: isDragging ? 'filter 0.1s' : 'filter 0.3s',
              transform: 'translateX(2px)' // Slight right adjustment
            }}
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap pl-0.5">
              <span className="text-[12px] font-bold text-black tracking-wide">
                Meet-ALI&TEAM
              </span>
            </div>
          </motion.div>
          
          {/* Right side text - OUR-Details */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-15 px-4"
            style={{ 
              width: handleWidth,
              opacity: rightTextOpacity,
              filter: `blur(${rightBlur}px)`,
              transition: isDragging ? 'filter 0.1s' : 'filter 0.3s',
              transform: 'translateX(-2px)' // Slight left adjustment
            }}
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap pr-0.5">
              <span className="text-[12px] font-bold text-black tracking-wide">
                OUR-Details
              </span>
            </div>
          </motion.div>
          
          {/* Enhanced glass effect slider handle with black border */}
          <motion.div
            drag="x"
            dragConstraints={toggleContainerRef}
            dragElastic={0.03}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{ 
              x: springX,
              width: handleWidth,
              height: '100%',
              willChange: 'transform'
            }}
            className="absolute top-0 bottom-0 cursor-grab active:cursor-grabbing z-20"
          >
            {/* Crystal clear glass handle with enhanced effects */}
            <motion.div 
              className="h-full w-full rounded-full flex items-center justify-center relative overflow-hidden border-2 border-black"
              style={{
                background: useTransform(
                  progress,
                  [0, 0.5, 1],
                  [
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))',
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.05))',
                    'linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(139, 92, 246, 0.1))'
                  ]
                ),
                backdropFilter: 'blur(8px) saturate(180%)',
                WebkitBackdropFilter: 'blur(8px) saturate(180%)',
                boxShadow: useTransform(
                  progress,
                  [0, 0.5, 1],
                  [
                    '0 2px 8px rgba(255, 255, 255, 0.2), inset 0 0 6px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.3)',
                    '0 2px 6px rgba(200, 200, 255, 0.15), inset 0 0 6px rgba(200, 200, 255, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
                    '0 2px 8px rgba(139, 92, 246, 0.2), inset 0 0 6px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.3)'
                  ]
                ),
                willChange: 'background, box-shadow'
              }}
            >
              {/* Crystalline light reflection effect - more subtle */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, rgba(255, 255, 255, 0.08) 100%)',
                  willChange: 'opacity',
                  opacity: useTransform(progress, [0, 1], [0.5, 0.3])
                }}
              />

              {/* Subtle drag indicator with glass effect */}
              <div className="flex flex-col items-center justify-center gap-1.5">
                <motion.div 
                  className="w-4 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)'
                  }}
                />
                <motion.div 
                  className="w-4 h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  style={{
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)'
                  }}
                />
              </div>
            </motion.div>
              </motion.div>
        </div>
        
        {/* Enhanced shadow effect for depth - more subtle */}
        <motion.div 
          className="absolute inset-0 -z-10 rounded-full blur-md opacity-30"
             style={{
            background: useTransform(
              progress,
              [0, 0.5, 1],
              [
                'radial-gradient(circle, rgba(255, 255, 255, 0.7), transparent 70%)',
                'radial-gradient(circle, rgba(200, 170, 255, 0.6), transparent 70%)',
                'radial-gradient(circle, rgba(139, 92, 246, 0.7), transparent 70%)'
              ]
            ),
            transform: 'translateY(3px) scale(0.95)',
            willChange: 'background'
          }}
        />
      </div>
    </motion.div>
  );
} 