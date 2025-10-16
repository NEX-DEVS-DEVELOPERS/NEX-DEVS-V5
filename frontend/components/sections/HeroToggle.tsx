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
  const [isMobile, setIsMobile] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const toggleContainerRef = useRef<HTMLDivElement>(null);
  
  // Get container width for calculations
  const [containerWidth, setContainerWidth] = useState(0);
  const [handleWidth, setHandleWidth] = useState(0);
  
  // Motion values for the slider with ultra-smooth spring settings
  const x = useMotionValue(currentHero === 'original' ? 0 : containerWidth - handleWidth);
  // Even smoother spring settings
  const springX = useSpring(x, { damping: 50, stiffness: 500, mass: 0.3 }); 
  
  // Calculate progress (0 to 1) based on slider position
  const progress = useTransform(
    springX, 
    [0, containerWidth - handleWidth], 
    [0, 1]
  );
  
  // Text opacity based on slider position
  const leftTextOpacity = useTransform(progress, [0, 0.4], [1, 0.5]);
  const rightTextOpacity = useTransform(progress, [0.6, 1], [0.5, 1]);
  
  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setIsMobile(isMobileDevice && isSmallScreen && isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for welcome screen state changes
  useEffect(() => {
    const handleWelcomeScreenStateChange = (event: CustomEvent) => {
      setShowWelcome(event.detail.showWelcome);
    };

    window.addEventListener('welcomeScreenStateChange', handleWelcomeScreenStateChange as EventListener);

    return () => {
      window.removeEventListener('welcomeScreenStateChange', handleWelcomeScreenStateChange as EventListener);
    };
  }, []);

  // Update container dimensions on mount and resize
  useEffect(() => {
    if (!toggleContainerRef.current) return;

    const updateDimensions = () => {
      if (toggleContainerRef.current) {
        const rect = toggleContainerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
        // Set handle width to 50% of container for the pill design
        setHandleWidth(rect.width * 0.5);

        // Update x position based on current hero
        x.set(currentHero === 'original' ? 0 : rect.width - rect.width * 0.5);
      }
    };

    updateDimensions();

    // Use ResizeObserver for better performance
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(toggleContainerRef.current);

    return () => {
      resizeObserver.disconnect();
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
  
  // Handle drag events with ultra-smooth performance
  useEffect(() => {
    // Always listen to progress changes for immediate border animation
    let lastUpdate = 0;
    const updateInterval = 1000 / 240; // Target 240fps for ultra-smooth response

    const unsubscribe = progress.onChange(value => {
      const now = performance.now();
      if (now - lastUpdate < updateInterval) return;
      lastUpdate = now;

      // Immediate event dispatch without requestAnimationFrame for faster response
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
  }, [isDragging, progress]);
  
  // Handle mobile click toggle
  const handleMobileClick = () => {
    if (!isMobile) return;

    const newHero = currentHero === 'original' ? 'business' : 'original';
    setPrevHero(currentHero);
    onToggle(newHero);

    // Calculate positions
    const startPosition = springX.get();
    const targetPosition = newHero === 'original' ? 0 : containerWidth - handleWidth;
    const maxPosition = containerWidth - handleWidth;

    // Dispatch immediate start progress event
    const startProgress = maxPosition > 0 ? Math.max(0, Math.min(1, startPosition / maxPosition)) : 0;
    const startProgressEvent = new CustomEvent('heroToggleProgress', {
      detail: {
        progress: startProgress,
        isDragging: false
      }
    });
    window.dispatchEvent(startProgressEvent);

    // Use spring animation for smooth border animation
    springX.set(targetPosition);

    // Dispatch target progress event immediately for instant border response
    const targetProgress = newHero === 'original' ? 0 : 1;
    const targetProgressEvent = new CustomEvent('heroToggleProgress', {
      detail: {
        progress: targetProgress,
        isDragging: false
      }
    });
    window.dispatchEvent(targetProgressEvent);

    // Dispatch finished event after a short delay to ensure animation completes
    setTimeout(() => {
      const finishedEvent = new CustomEvent('heroToggleFinished', {
        detail: { hero: newHero }
      });
      window.dispatchEvent(finishedEvent);
    }, 100);
  };

  // Handle drag end with optimized snap animation
  const handleDragEnd = () => {
    if (isMobile) return; // Disable drag on mobile

    setIsDragging(false);

    // Get current position
    const currentPosition = springX.get();
    const threshold = containerWidth / 2 - handleWidth / 2;

    // Determine which hero to show based on position
    if (currentPosition < threshold) {
      // Snap to original - immediate for better responsiveness
      springX.set(0);
      if (currentHero !== 'original') {
        setPrevHero(currentHero);
        onToggle('original');
      }
    } else {
      // Snap to business - immediate for better responsiveness
      springX.set(containerWidth - handleWidth);
      if (currentHero !== 'business') {
    setPrevHero(currentHero);
        onToggle('business');
      }
    }

    // Dispatch final position event using requestAnimationFrame for better performance
    requestAnimationFrame(() => {
    const finalEvent = new CustomEvent('heroToggleFinished', {
      detail: {
        hero: currentPosition < threshold ? 'original' : 'business'
      }
    });
    window.dispatchEvent(finalEvent);
    });
  };

  // Hide during welcome screen
  if (showWelcome) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 right-0 w-full flex justify-center z-[60] px-4 ${
        isHeroPage ? 'top-15 sm:top-1' : 'top-15 sm:top-1'
      }`}
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        pointerEvents: 'none' // Make container not block interactions
      }}
    >
      <div className="relative" style={{ pointerEvents: 'auto' }}>
        {/* Animated hint to slide - positioned below */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-9 left-2 whitespace-nowrap"
            >
              <div className="bg-black/90 text-white text-xs px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1.5 shadow-lg shadow-black/20">
                <span className="text-yellow-400">👍</span>
                <span>{isMobile ? 'Tap to switch' : 'Slide to switch'}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Subtle glow effect */}
        <motion.div 
          className="absolute inset-0 -m-1 rounded-full blur-lg"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1), transparent 70%)',
            willChange: 'opacity, transform'
          }}
        ></motion.div>
        
        {/* Main slider container - black pill design with white border */}
        <div
          ref={toggleContainerRef}
          className={`relative backdrop-blur-xl rounded-full overflow-hidden w-64 h-15 sm:w-80 sm:h-9`}
          style={{
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            cursor: isDragging ? 'grabbing' : 'grab',
            background: 'rgba(0, 0, 0, 0.85)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={() => setShowHint(true)}
        >
          {/* Left label - Primary */}
          <div
            className="absolute left-0 top-0 bottom-0 flex items-center justify-center z-15 px-4"
            style={{ 
              width: '50%',
              pointerEvents: 'none'
            }}
          >
            <motion.div 
              className="flex items-center justify-center whitespace-nowrap"
              style={{ opacity: leftTextOpacity }}
            >
              <span className="text-sm font-medium text-white">
                Primary
              </span>
            </motion.div>
            </div>
          
          {/* Right label - Business */}
          <div
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center z-15 px-4"
            style={{ 
              width: '50%',
              pointerEvents: 'none'
            }}
          >
            <motion.div 
              className="flex items-center justify-center whitespace-nowrap"
              style={{ opacity: rightTextOpacity }}
            >
              <span className="text-sm font-medium text-gray-300">
                Business
              </span>
            </motion.div>
            </div>
          
          {/* Sliding pill handle with white border */}
          <motion.div
            drag={isMobile ? false : "x"}
            dragConstraints={toggleContainerRef}
            dragElastic={0.03} // Less elasticity for more precise control
            dragMomentum={false}
            onDragStart={() => {
              if (!isMobile) {
                setIsDragging(true);
                // Dispatch immediate progress event to start border animation
                const currentPosition = springX.get();
                const maxPosition = containerWidth - handleWidth;
                const currentProgress = maxPosition > 0 ? Math.max(0, Math.min(1, currentPosition / maxPosition)) : 0;

                const progressEvent = new CustomEvent('heroToggleProgress', {
                  detail: {
                    progress: currentProgress,
                    isDragging: true
                  }
                });
                window.dispatchEvent(progressEvent);
              }
            }}
            onDragEnd={handleDragEnd}
            onClick={handleMobileClick}
            style={{
              x: springX,
              width: handleWidth,
              height: '100%',
              willChange: 'transform'
            }}
            className={`absolute top-0 bottom-0 z-20 ${
              isMobile ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            {/* White pill with blur effect and border */}
            <motion.div 
              className="h-full w-full rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
              }}
            >
              {/* Active label text */}
              <motion.div
                style={{
                  opacity: useTransform(progress, [0, 1], [1, 0]),
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <span className="text-sm font-medium text-black">Meet-ALI</span>
              </motion.div>
              
                <motion.div 
                  style={{
                  opacity: useTransform(progress, [0, 1], [0, 1]),
                  position: 'absolute',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                  }}
              >
                <span className="text-sm font-medium text-black">OUR-Experties</span>
              </motion.div>
            </motion.div>
              </motion.div>
        </div>
        
        {/* Subtle shadow for depth */}
        <motion.div 
          className="absolute inset-0 -z-10 rounded-full blur-md"
             style={{
            background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3), transparent 70%)',
            transform: 'translateY(2px) scale(0.98)',
            willChange: 'background'
          }}
        />
      </div>
    </motion.div>
  );
} 