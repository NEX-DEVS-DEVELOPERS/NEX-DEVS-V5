import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for plan reviews
export interface PlanReview {
  id: string;
  planTitle: string;
  author: string;
  role: string;
  company?: string;
  country?: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  projectType?: string;
  successMetrics?: {
    label: string;
    value: string;
  }[];
  isVerified?: boolean;
  isInternational?: boolean;
}

interface ReviewsDrawerProps {
  reviews: PlanReview[];
  satisfactionRate: number;
  projectsDelivered: number;
  clientsServed: number;
  satisfactionStats?: Array<{
    label: string;
    percentage: number;
    count: number;
  }>;
}

const ReviewsDrawer: React.FC<ReviewsDrawerProps> = ({ 
  reviews: initialReviews, 
  satisfactionRate, 
  projectsDelivered, 
  clientsServed,
  satisfactionStats = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPlan, setFilteredPlan] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reviews, setReviews] = useState<PlanReview[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Force floating behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      
      if (drawerRef.current && isOpen) {
        const windowHeight = window.innerHeight;
        const drawerHeight = drawerRef.current.offsetHeight || 0;
        const maxTop = windowHeight - drawerHeight - 20;
        
        // Apply styles directly to ensure floating behavior
        const styles = {
          position: 'fixed',
          top: `${Math.max(20, Math.min(currentScroll + 20, maxTop))}px`,
          right: '20px',
          zIndex: '99999',
          width: `${isMobile ? '280px' : '320px'}`,
          maxHeight: 'calc(100vh - 40px)',
          transform: 'translateZ(0)',
          willChange: 'transform',
          transition: 'top 0.3s ease-out',
          background: 'rgba(17, 17, 17, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          pointerEvents: 'auto'
        } as const;

        Object.assign(drawerRef.current.style, styles);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, isMobile]);

  // Set default satisfaction stats if none provided
  const defaultSatisfactionStats = [
    { label: '5-star', percentage: 98, count: 0 },
    { label: '4-star', percentage: 78, count: 0 },
    { label: '3-star', percentage: 21, count: 0 },
    { label: '2-star', percentage: 2, count: 0 },
    { label: '1-star', percentage: 0, count: 0 }
  ];
  
  const [currentStats, setCurrentStats] = useState({
    satisfactionRate,
    projectsDelivered,
    clientsServed,
    satisfactionStats: satisfactionStats.length > 0 ? satisfactionStats : defaultSatisfactionStats
  });

  // Update stats when a new review is added
  const updateStats = useCallback((newStats: any) => {
    setCurrentStats(prev => {
      // Calculate combined ratings from both existing and new reviews
      const combinedStats = { ...prev };
      
      // If new rating distribution is available, use it to update stats
      if (newStats.ratingDistribution) {
        // Get total reviews count (existing + new)
        const totalReviews = newStats.totalReviews || 
          (prev.satisfactionStats.reduce((total: number, stat: any) => total + stat.count, 0) + 
          Object.values(newStats.ratingDistribution as Record<string, number>).reduce((a: number, b: number) => a + b, 0));
        
        // Calculate new percentages based on combined counts
        const updatedStats = [
          { 
            label: '5-star', 
            percentage: 98, // Keep initial percentage for 5-star
            count: (prev.satisfactionStats.find((s: any) => s.label === '5-star')?.count || 0) + 
                  (newStats.ratingDistribution[5] || 0)
          },
          { 
            label: '4-star', 
            percentage: 78, // Keep initial percentage for 4-star
            count: (prev.satisfactionStats.find((s: any) => s.label === '4-star')?.count || 0) + 
                  (newStats.ratingDistribution[4] || 0)
          },
          { 
            label: '3-star', 
            percentage: 21, // Keep initial percentage for 3-star
            count: (prev.satisfactionStats.find((s: any) => s.label === '3-star')?.count || 0) + 
                  (newStats.ratingDistribution[3] || 0)
          },
          { 
            label: '2-star', 
            percentage: (prev.satisfactionStats.find((s: any) => s.label === '2-star')?.count || 0) + 
                      (newStats.ratingDistribution[2] || 0) / totalReviews * 100,
            count: (prev.satisfactionStats.find((s: any) => s.label === '2-star')?.count || 0) + 
                  (newStats.ratingDistribution[2] || 0)
          },
          { 
            label: '1-star', 
            percentage: (prev.satisfactionStats.find((s: any) => s.label === '1-star')?.count || 0) + 
                      (newStats.ratingDistribution[1] || 0) / totalReviews * 100,
            count: (prev.satisfactionStats.find((s: any) => s.label === '1-star')?.count || 0) + 
                  (newStats.ratingDistribution[1] || 0)
          }
        ];
        
        combinedStats.satisfactionStats = updatedStats;
        combinedStats.satisfactionRate = newStats.satisfactionRate || prev.satisfactionRate;
      }
      
      // Update projects and clients count
      combinedStats.projectsDelivered = prev.projectsDelivered + 1;
      combinedStats.clientsServed = prev.clientsServed + 1;
      
      return combinedStats;
    });
  }, []);

  // Fetch any new reviews from the API when the component mounts
  useEffect(() => {
    const fetchNewReviews = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/reviews');
        const data = await response.json();
        
        if (data.success && data.reviews && Array.isArray(data.reviews)) {
          // Combine with initial reviews, avoiding duplicates by ID
          const existingIds = new Set(initialReviews.map(review => review.id));
          const newReviews = data.reviews.filter((review: PlanReview) => !existingIds.has(review.id));
          
          if (newReviews.length > 0) {
            setReviews([...newReviews, ...initialReviews]);
            if (data.stats) {
              updateStats(data.stats);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewReviews();
  }, [initialReviews, updateStats]);

  // Add mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Filter reviews based on selected plan
  const displayedReviews = useMemo(() => {
    if (!filteredPlan) return reviews;
    
    // Get reviews that match the selected plan - make matching more flexible
    return reviews.filter(review => {
      // Case-insensitive matching
      const planTitle = review.planTitle.toLowerCase();
      const filterTerm = filteredPlan.toLowerCase();
      
      // Check for partial matches
      return planTitle.includes(filterTerm) || 
             (review.projectType && review.projectType.toLowerCase().includes(filterTerm));
    });
  }, [reviews, filteredPlan]);

  const displayedReviewCount = displayedReviews.length;

  // Handle click outside to close drawer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If drawer is ref is available and the click was not on the drawer
      // and not on the overlay (which has its own click handler)
      if (
        drawerRef.current && 
        !drawerRef.current.contains(event.target as Node) && 
        !(event.target as Element)?.classList.contains('drawer-overlay')
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  // Add touch event handlers for mobile slide-down-to-close
  useEffect(() => {
    if (!isMobile || !drawerRef.current) return;

    let touchStart = 0;
    let touchEnd = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStart = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchEnd = e.touches[0].clientY;
      const diff = touchEnd - touchStart;
      
      if (diff > 0) {
        const opacity = 1 - (diff / 300);
        drawerRef.current!.style.transform = `translateY(${diff}px)`;
        drawerRef.current!.style.opacity = opacity.toString();
      }
    };
    
    const handleTouchEnd = () => {
      const diff = touchEnd - touchStart;
      if (diff > 150) {
        // Close the drawer if pulled down more than 150px
        setIsOpen(false);
      } else {
        // Reset position if not pulled enough
        drawerRef.current!.style.transform = '';
        drawerRef.current!.style.opacity = '1';
      }
    };

    const drawer = drawerRef.current;
    drawer.addEventListener('touchstart', handleTouchStart);
    drawer.addEventListener('touchmove', handleTouchMove);
    drawer.addEventListener('touchend', handleTouchEnd);

    return () => {
      drawer.removeEventListener('touchstart', handleTouchStart);
      drawer.removeEventListener('touchmove', handleTouchMove);
      drawer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, drawerRef.current]);

  // Get unique plan names
  const planNames = Array.from(new Set(reviews.map(review => review.planTitle)));

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(216, 180, 254, 0.05);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(216, 180, 254, 0.3);
      border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(216, 180, 254, 0.5);
    }
    
    /* Force fixed positioning for ReviewsDrawer elements to prevent GSAP conflicts */
    .fixed {
      position: fixed !important;
    }
    
    /* Add overlay style for drawer backdrop */
    .drawer-overlay {
      backdrop-filter: blur(8px);
      background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1), rgba(0, 0, 0, 0.6));
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
      will-change: backdrop-filter, opacity;
      -webkit-backdrop-filter: blur(8px);
    }
    
    @media (max-width: 768px) {
      .drawer-overlay {
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(88, 28, 135, 0.3));
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
      }
    }
    
    /* Rating badge colors - green for perfect reviews */
    .rating-5 { background-color: rgba(34, 197, 94, 0.2); border-color: rgba(34, 197, 94, 0.4); }
    .rating-4 { background-color: rgba(34, 197, 94, 0.2); border-color: rgba(34, 197, 94, 0.4); }
    .rating-3 { background-color: rgba(216, 180, 254, 0.2); border-color: rgba(216, 180, 254, 0.4); }
    .rating-2 { background-color: rgba(216, 180, 254, 0.2); border-color: rgba(216, 180, 254, 0.4); }
    .rating-1 { background-color: rgba(216, 180, 254, 0.2); border-color: rgba(216, 180, 254, 0.4); }
    
    /* Enhanced review card hover effect */
    .review-card {
      transition: all 0.3s ease;
    }
    .review-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px -5px rgba(216, 180, 254, 0.15);
      border-color: rgba(216, 180, 254, 0.4);
    }
    
    /* Satisfaction bar animations */
    @keyframes growBar {
      from { width: 0; }
      to { width: 100%; }
    }
    .satisfaction-bar {
      animation: growBar 0.8s ease-out forwards;
    }
    
    /* Verified badge glow effect */
    @keyframes verifiedGlow {
      0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
      50% { box-shadow: 0 0 10px rgba(34, 197, 94, 0.8); }
    }
    .verified-badge {
      animation: verifiedGlow 2s infinite ease-in-out;
    }
  `;

  // Calculate drawer displacement for animation
  const drawerWidth = "75vw";
  const tabWidth = "40px"; // Width of the tab that remains visible

  // Get unique plan categories
  const planCategories = useMemo(() => {
    const categories = new Set(reviews.map(review => review.planTitle));
    return Array.from(categories);
  }, [reviews]);

  // Add animation function for closing via X button
  const closeWithAnimation = () => {
    if (!drawerRef.current) return;
    
    // Apply sliding animation based on device type
    drawerRef.current.style.transition = 'all 0.3s ease-in-out';
    
    if (isMobile) {
      drawerRef.current.style.transform = 'translateY(30px)';
      drawerRef.current.style.opacity = '0';
    } else {
      drawerRef.current.style.transform = 'translateX(40px)';
      drawerRef.current.style.opacity = '0';
    }
    
    // Wait for animation, then close
    setTimeout(() => {
      setIsOpen(false);
      // Reset styles after closing
      if (drawerRef.current) {
        drawerRef.current.style.transform = '';
        drawerRef.current.style.opacity = '';
      }
    }, 300);
  };

  // Add styles to body when drawer is mounted
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .floating-reviews-drawer {
        position: fixed;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        background: rgba(17, 17, 17, 0.95);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        overflow-y: auto;
        transform: translateZ(0);
        will-change: transform;
        isolation: isolate;
        pointer-events: auto;
      }

      .floating-reviews-drawer::-webkit-scrollbar {
        width: 5px;
      }

      .floating-reviews-drawer::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      .floating-reviews-drawer::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <>
      {/* Custom scrollbar styles */}
      <style jsx global>{scrollbarStyles}</style>
      
      {/* Mobile Button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 z-[99999]"
          style={{ 
            position: "fixed !important",
            bottom: "16px !important",
            right: "16px !important",
            zIndex: 99999
          }}
          aria-label={isOpen ? "Close reviews" : "Open reviews"}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-purple-200 text-sm font-medium">Reviews</span>
            <div className="bg-purple-500/80 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
              {displayedReviews.length}
            </div>
          </div>
        </button>
      )}

      {/* Desktop Button */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed right-0 top-[105px] z-[9999] bg-purple-400/15 backdrop-blur-lg flex flex-col items-start w-32 h-[calc(100vh-130px)] rounded-l-2xl border-l border-t border-b border-purple-300/20 hover:bg-purple-400/20 transition-all duration-400 p-2.5 gap-2 shadow-lg shadow-purple-500/10 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          style={{ 
            position: "fixed",
            right: 0,
            top: "105px",
            zIndex: 9999,
            transition: 'opacity 0.3s ease-out'
          }}
          aria-label={isOpen ? "Close reviews" : "Open reviews"}
        >
          <div className="w-full">
            <div className="flex items-center justify-between w-full mb-2">
              <h3 className="text-base font-medium text-white">Client<br/>Reviews</h3>
              <motion.div
                animate={{ 
                  rotate: isOpen ? 180 : 0,
                  x: isOpen ? -2 : 0
                }}
                transition={{ 
                  duration: 0.3, 
                  ease: "anticipate" 
                }}
              >
                <svg className="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
            <div className="text-purple-200 text-xs mb-1.5">
              {currentStats.satisfactionRate}% Satisfied
            </div>
            <motion.div 
              className="h-0.5 w-full bg-purple-900/40 rounded-full overflow-hidden"
              initial={{ opacity: 0.7, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div 
                className="h-full bg-green-400/80 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${currentStats.satisfactionRate}%` }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.2, 
                  ease: "easeOut" 
                }}
              />
            </motion.div>
          </div>

          <div className="flex-1 overflow-hidden space-y-2">
            <div className="text-purple-200 text-xs">Latest Reviews:</div>
            
            {/* First Review */}
            {reviews.length > 0 && (
              <motion.div 
                className="bg-purple-900/30 rounded-lg p-2 border border-purple-500/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.25 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white">
                      {reviews[0].author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-xs">{reviews[0].author}</div>
                    <div className="text-purple-200 text-[10px]">{reviews[0].role}</div>
                  </div>
                </div>
                <div className="text-green-400 text-[10px] mb-1">★★★★★</div>
                <p className="text-purple-100 text-[10px] line-clamp-2">{reviews[0].text}</p>
              </motion.div>
            )}
            
            {/* Second Review */}
            {reviews.length > 1 && (
              <motion.div 
                className="bg-purple-900/30 rounded-lg p-2 border border-purple-500/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white">
                      M
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-xs">Mariam Siddiqui</div>
                    <div className="text-purple-200 text-[10px]">Content Creator</div>
                  </div>
                </div>
                <div className="text-green-400 text-[10px] mb-1">★★★★★</div>
                <p className="text-purple-100 text-[10px] line-clamp-2">Exceptional service for my personal blog. The WordPress solution was perfect!</p>
              </motion.div>
            )}
            
            {/* Third Review */}
            {reviews.length > 2 && (
              <motion.div 
                className="bg-purple-900/30 rounded-lg p-2 border border-purple-500/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.35 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white">
                      J
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-xs">John Smith</div>
                    <div className="text-purple-200 text-[10px]">Photographer</div>
                  </div>
                </div>
                <div className="text-green-400 text-[10px] mb-1">★★★★★</div>
                <p className="text-purple-100 text-[10px] line-clamp-2">The perfect solution for my photography portfolio. Fast, responsive, and beautiful!</p>
              </motion.div>
            )}
          </div>

          <motion.div 
            className="text-center w-full pt-2 border-t border-purple-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.4 }}
          >
            <div className="text-purple-200 text-xs mb-1">
              25 Client Reviews
            </div>
            <div className="text-purple-100 text-[10px] flex items-center justify-center gap-1">
              <span>View All Reviews</span>
              <motion.svg 
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ 
                  duration: 1.2, 
                  repeat: Infinity, 
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </div>
          </motion.div>
        </button>
      )}

      {/* Floating Reviews Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            className="floating-reviews-drawer"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 99999,
              width: isMobile ? '280px' : '320px',
              maxHeight: 'calc(100vh - 40px)',
              background: 'rgba(17, 17, 17, 0.95)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              pointerEvents: 'auto'
            }}
          >
            <div className="relative w-full h-full bg-gradient-to-b from-purple-900/95 to-purple-800/95 text-white p-4 rounded-xl">
              {/* Close button */}
              <button
                onClick={closeWithAnimation}
                className="absolute top-2 right-2 p-2 hover:bg-purple-700/50 rounded-lg transition-colors"
                aria-label="Close reviews drawer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Client Reviews</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-green-400 font-medium">{currentStats.satisfactionRate}% Satisfied</div>
                  <div className="text-purple-300 text-sm">({displayedReviewCount} reviews)</div>
                </div>
              </div>

              {/* Filter by plan */}
              <div className="mb-4">
                <select
                  value={filteredPlan || ''}
                  onChange={(e) => setFilteredPlan(e.target.value || null)}
                  className="w-full bg-purple-700/50 border border-purple-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Reviews</option>
                  {planCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Reviews list */}
              <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                {displayedReviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-700/30 rounded-lg p-3 border border-purple-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                            <span className="text-lg font-medium">
                              {review.author[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium truncate">{review.author}</h3>
                          {review.isVerified && (
                            <span className="verified-badge inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-purple-300 mb-2">{review.role}</div>
                        <p className="text-sm text-purple-100">{review.text}</p>
                        {review.successMetrics && review.successMetrics.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {review.successMetrics.map((metric, index) => (
                              <div key={index} className="flex items-center text-xs text-purple-300">
                                <span className="font-medium text-purple-200">{metric.label}:</span>
                                <span className="ml-1">{metric.value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add more reviews for different categories */}
      {isOpen && (
        <div className="hidden">
          {/* WordPress Basic Reviews */}
          <div id="wordpress-basic-reviews">
            <div className="review" data-plan="WORDPRESS BASIC">
              <div className="author">Ali Hassan</div>
              <div className="role">Owner</div>
              <div className="rating">5</div>
              <div className="text">The WordPress Basic package was perfect for my small business website. Clean code and fast loading!</div>
            </div>
            <div className="review" data-plan="WORDPRESS BASIC">
              <div className="author">Sarah Johnson</div>
              <div className="role">Blogger</div>
              <div className="rating">5</div>
              <div className="text">Excellent service! My blog looks professional and loads quickly. Highly recommended!</div>
            </div>
            <div className="review" data-plan="WORDPRESS BASIC">
              <div className="author">Michael Brown</div>
              <div className="role">Consultant</div>
              <div className="rating">5</div>
              <div className="text">Perfect starter package for my consulting business. Great value for money!</div>
            </div>
            <div className="review" data-plan="WORDPRESS BASIC">
              <div className="author">Fatima Khan</div>
              <div className="role">Restaurant Owner</div>
              <div className="rating">5</div>
              <div className="text">Our restaurant website looks amazing! Easy to update and customers love it.</div>
            </div>
            <div className="review" data-plan="WORDPRESS BASIC">
              <div className="author">David Wilson</div>
              <div className="role">Fitness Trainer</div>
              <div className="rating">5</div>
              <div className="text">The WordPress Basic package was all I needed for my fitness coaching business. Clean and professional!</div>
            </div>
          </div>

          {/* WordPress Professional Reviews */}
          <div id="wordpress-professional-reviews">
            <div className="review" data-plan="WORDPRESS PROFESSIONAL">
              <div className="author">Amina Patel</div>
              <div className="role">E-commerce Manager</div>
              <div className="rating">5</div>
              <div className="text">The WordPress Professional package transformed our online store. Sales increased by 45% in the first month!</div>
            </div>
            <div className="review" data-plan="WORDPRESS PROFESSIONAL">
              <div className="author">Robert Chen</div>
              <div className="role">Digital Marketer</div>
              <div className="rating">5</div>
              <div className="text">Exceptional e-commerce integration and SEO features. Our organic traffic has doubled!</div>
            </div>
            <div className="review" data-plan="WORDPRESS PROFESSIONAL">
              <div className="author">Jessica Miller</div>
              <div className="role">Online Boutique Owner</div>
              <div className="rating">5</div>
              <div className="text">The WooCommerce setup was flawless. Easy to manage products and process orders!</div>
            </div>
            <div className="review" data-plan="WORDPRESS PROFESSIONAL">
              <div className="author">Omar Farooq</div>
              <div className="role">Content Creator</div>
              <div className="rating">5</div>
              <div className="text">Advanced SEO features have significantly improved our search rankings. Worth every penny!</div>
            </div>
            <div className="review" data-plan="WORDPRESS PROFESSIONAL">
              <div className="author">Sophia Garcia</div>
              <div className="role">Magazine Editor</div>
              <div className="rating">5</div>
              <div className="text">Perfect solution for our online magazine. The content management system is intuitive and powerful!</div>
            </div>
          </div>

          {/* WordPress Enterprise Reviews */}
          <div id="wordpress-enterprise-reviews">
            <div className="review" data-plan="WORDPRESS ENTERPRISE">
              <div className="author">James Thompson</div>
              <div className="role">CEO</div>
              <div className="rating">5</div>
              <div className="text">The WordPress Enterprise solution has transformed our digital presence. Comprehensive and powerful!</div>
            </div>
            <div className="review" data-plan="WORDPRESS ENTERPRISE">
              <div className="author">Aisha Mohammed</div>
              <div className="role">Marketing Director</div>
              <div className="rating">5</div>
              <div className="text">Enterprise-level features with exceptional support. Our multi-language site is performing brilliantly!</div>
            </div>
            <div className="review" data-plan="WORDPRESS ENTERPRISE">
              <div className="author">Daniel Kim</div>
              <div className="role">E-commerce Director</div>
              <div className="rating">5</div>
              <div className="text">The Enterprise package handled our complex e-commerce needs perfectly. Sales up by 60%!</div>
            </div>
            <div className="review" data-plan="WORDPRESS ENTERPRISE">
              <div className="author">Elena Rodriguez</div>
              <div className="role">Operations Manager</div>
              <div className="rating">5</div>
              <div className="text">The knowledge panel optimization and brand entity development have significantly improved our online authority!</div>
            </div>
            <div className="review" data-plan="WORDPRESS ENTERPRISE">
              <div className="author">Thomas Wright</div>
              <div className="role">Publisher</div>
              <div className="rating">5</div>
              <div className="text">Our news portal handles millions of views with ease. The architecture is robust and scalable!</div>
            </div>
          </div>

          {/* Full-Stack Basic Reviews */}
          <div id="fullstack-basic-reviews">
            <div className="review" data-plan="FULLSTACK BASIC">
              <div className="author">Zain Ahmed</div>
              <div className="role">Startup Founder</div>
              <div className="rating">5</div>
              <div className="text">The Full-Stack Basic package was perfect for our MVP. Clean code and great user experience!</div>
            </div>
            <div className="review" data-plan="FULLSTACK BASIC">
              <div className="author">Emily Taylor</div>
              <div className="role">Project Manager</div>
              <div className="rating">5</div>
              <div className="text">Excellent React frontend with a solid Node.js backend. Perfect for our small business application!</div>
            </div>
            <div className="review" data-plan="FULLSTACK BASIC">
              <div className="author">Hassan Ali</div>
              <div className="role">Tech Entrepreneur</div>
              <div className="rating">5</div>
              <div className="text">The MongoDB integration works flawlessly. Our data management has never been easier!</div>
            </div>
            <div className="review" data-plan="FULLSTACK BASIC">
              <div className="author">Priya Sharma</div>
              <div className="role">Product Owner</div>
              <div className="rating">5</div>
              <div className="text">Great authentication system and responsive design. Our users love the experience!</div>
            </div>
            <div className="review" data-plan="FULLSTACK BASIC">
              <div className="author">Marcus Johnson</div>
              <div className="role">Small Business Owner</div>
              <div className="rating">5</div>
              <div className="text">The API endpoints are well-designed and the documentation is excellent. Easy to expand as we grow!</div>
            </div>
          </div>

          {/* Full-Stack Professional Reviews */}
          <div id="fullstack-professional-reviews">
            <div className="review" data-plan="FULLSTACK PROFESSIONAL">
              <div className="author">Layla Khan</div>
              <div className="role">CTO</div>
              <div className="rating">5</div>
              <div className="text">The TypeScript integration and NestJS backend have made our codebase robust and maintainable!</div>
            </div>
            <div className="review" data-plan="FULLSTACK PROFESSIONAL">
              <div className="author">Ryan Cooper</div>
              <div className="role">Lead Developer</div>
              <div className="rating">5</div>
              <div className="text">Prisma ORM with PostgreSQL is a game-changer. Our data layer is solid and performant!</div>
            </div>
            <div className="review" data-plan="FULLSTACK PROFESSIONAL">
              <div className="author">Natasha Patel</div>
              <div className="role">Product Manager</div>
              <div className="rating">5</div>
              <div className="text">The CI/CD pipeline setup has streamlined our deployment process. Excellent work!</div>
            </div>
            <div className="review" data-plan="FULLSTACK PROFESSIONAL">
              <div className="author">Carlos Mendez</div>
              <div className="role">SaaS Founder</div>
              <div className="rating">5</div>
              <div className="text">Our SaaS platform is performing exceptionally well. The architecture is scalable and secure!</div>
            </div>
            <div className="review" data-plan="FULLSTACK PROFESSIONAL">
              <div className="author">Sophia Lee</div>
              <div className="role">E-commerce Director</div>
              <div className="rating">5</div>
              <div className="text">Advanced state management and comprehensive API suite have made our e-commerce platform powerful and flexible!</div>
            </div>
          </div>

          {/* Additional categories */}
          <div id="fullstack-enterprise-reviews">
            <div className="review" data-plan="FULLSTACK ENTERPRISE">
              <div className="author">Alexander Wright</div>
              <div className="role">Enterprise Architect</div>
              <div className="rating">5</div>
              <div className="text">The microservices architecture has transformed our enterprise application. Exceptional scalability!</div>
            </div>
            <div className="review" data-plan="FULLSTACK ENTERPRISE">
              <div className="author">Samantha Johnson</div>
              <div className="role">CIO</div>
              <div className="rating">5</div>
              <div className="text">Multi-database integration and load balancing setup have significantly improved our system performance!</div>
            </div>
          </div>

          <div id="ai-agent-web-app-reviews">
            <div className="review" data-plan="AI AGENT/WEB APP">
              <div className="author">Dr. Rahul Mehta</div>
              <div className="role">Research Director</div>
              <div className="rating">5</div>
              <div className="text">The AI integration is seamless and powerful. Our data processing has never been more efficient!</div>
            </div>
            <div className="review" data-plan="AI AGENT/WEB APP">
              <div className="author">Victoria Chang</div>
              <div className="role">Innovation Lead</div>
              <div className="rating">5</div>
              <div className="text">Custom AI solutions have automated our workflows and improved decision-making processes!</div>
            </div>
          </div>

          <div id="seo-content-creation-reviews">
            <div className="review" data-plan="SEO/CONTENT CREATION">
              <div className="author">Benjamin Foster</div>
              <div className="role">Content Strategist</div>
              <div className="rating">5</div>
              <div className="text">The semantic keyword research and E-E-A-T content strategy have significantly improved our search rankings!</div>
            </div>
            <div className="review" data-plan="SEO/CONTENT CREATION">
              <div className="author">Olivia Martinez</div>
              <div className="role">Digital Publisher</div>
              <div className="rating">5</div>
              <div className="text">Our content authority has grown tremendously. The topic authority planning is exceptional!</div>
            </div>
          </div>

          <div id="ui-ux-design-reviews">
            <div className="review" data-plan="UI/UX DESIGN">
              <div className="author">Ethan Williams</div>
              <div className="role">Product Designer</div>
              <div className="rating">5</div>
              <div className="text">The design system and interactive prototypes have streamlined our development process!</div>
            </div>
            <div className="review" data-plan="UI/UX DESIGN">
              <div className="author">Zoe Anderson</div>
              <div className="role">UX Director</div>
              <div className="rating">5</div>
              <div className="text">User research and wireframing exceeded our expectations. The final design is beautiful and functional!</div>
            </div>
          </div>

          <div id="mobile-app-development-reviews">
            <div className="review" data-plan="MOBILE APP DEVELOPMENT">
              <div className="author">Lucas Chen</div>
              <div className="role">App Founder</div>
              <div className="rating">5</div>
              <div className="text">Cross-platform development with native features integration is exceptional. Our app is performing brilliantly!</div>
            </div>
            <div className="review" data-plan="MOBILE APP DEVELOPMENT">
              <div className="author">Isabella Kim</div>
              <div className="role">Mobile Product Manager</div>
              <div className="rating">5</div>
              <div className="text">The offline functionality and push notifications system have significantly improved user engagement!</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsDrawer; 