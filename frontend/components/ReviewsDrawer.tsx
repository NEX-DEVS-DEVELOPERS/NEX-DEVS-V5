import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaBriefcase, FaUsers, FaStar, FaCheck } from 'react-icons/fa';

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

  // Force floating behavior - only for desktop
  useEffect(() => {
    // Skip floating behavior on mobile - use fixed positioning instead
    if (isMobile) return;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);

      if (drawerRef.current && isOpen) {
        const windowHeight = window.innerHeight;
        const drawerHeight = drawerRef.current.offsetHeight || 0;
        const maxTop = windowHeight - drawerHeight - 20;

        // Apply styles directly to ensure floating behavior - desktop only
        const styles = {
          position: 'fixed',
          top: `${Math.max(20, Math.min(currentScroll + 20, maxTop))}px`,
          right: '20px',
          zIndex: '99999',
          width: '320px',
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
    .custom-scrollbar {
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(216, 180, 254, 0.3) rgba(216, 180, 254, 0.05);
    }
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

    /* Enhanced smooth scrollbar for reviews drawer */
    .custom-scrollbar-smooth {
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1);
      overscroll-behavior: contain;
    }
    .custom-scrollbar-smooth::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    .custom-scrollbar-smooth::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      margin: 4px;
    }
    .custom-scrollbar-smooth::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, rgba(147, 51, 234, 0.8) 0%, rgba(147, 51, 234, 0.6) 100%);
      border-radius: 6px;
      border: 2px solid rgba(147, 51, 234, 0.2);
      transition: all 0.3s ease;
    }
    .custom-scrollbar-smooth::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(147, 51, 234, 0.9) 0%, rgba(147, 51, 234, 0.7) 100%);
      border-color: rgba(147, 51, 234, 0.4);
      transform: scale(1.1);
    }
    .custom-scrollbar-smooth::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* Mobile-specific scrolling improvements */
    @media (max-width: 768px) {
      .custom-scrollbar {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
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
    <div>
      {/* Custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      
      {/* Mobile Button */}
      {isMobile && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile reviews button clicked, current state:', isOpen);

            // Force open the drawer with enhanced handling
            if (!isOpen) {
              setIsOpen(true);

              // Timeout fallback to guarantee opening
              setTimeout(() => {
                setIsOpen(true);
              }, 50);

              // Additional fallback
              setTimeout(() => {
                setIsOpen(true);
              }, 150);
            } else {
              setIsOpen(false);
            }
          }}
          className={`fixed bottom-6 right-6 z-[99999] bg-gradient-to-r backdrop-blur-sm rounded-full p-4 shadow-2xl transition-all border-2 active:scale-95 ${
            isOpen
              ? 'from-red-600 to-red-700 border-red-400/70 hover:from-red-700 hover:to-red-800 hover:border-red-300/80 animate-pulse'
              : 'from-purple-600 to-purple-700 border-purple-400/50 hover:from-purple-700 hover:to-purple-800 hover:border-purple-300/70 hover:shadow-purple-500/60 animate-bounce'
          }`}
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            minWidth: "64px",
            minHeight: "64px",
            boxShadow: isOpen
              ? "0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)"
              : "0 0 30px rgba(147, 51, 234, 0.6), 0 0 60px rgba(147, 51, 234, 0.3)",
            touchAction: "manipulation",
            transform: isOpen ? 'scale(1.1)' : 'scale(1)'
          }}
          aria-label={isOpen ? "Close reviews" : "Open reviews"}
        >
          <div className="flex items-center justify-center">
            {isOpen ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div className="bg-white/30 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full font-bold">
                  {displayedReviews.length}
                </div>
              </div>
            )}
          </div>
        </button>
      )}

     {/* Desktop Sidebar Toggle */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed right-0 top-20 z-[9999] bg-gradient-to-l from-purple-600/20 to-purple-500/10 backdrop-blur-lg flex flex-col items-start w-36 h-[calc(100vh-5rem)] rounded-l-2xl border-l-2 border-t-2 border-b-2 border-purple-500/40 hover:border-purple-400/60 hover:bg-gradient-to-l hover:from-purple-600/30 hover:to-purple-500/15 transition-all duration-300 p-4 gap-3 shadow-2xl shadow-purple-500/20 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{
            position: "fixed",
            right: 0,
            top: "80px", // Below navigation bar
            zIndex: 9999,
            transition: 'all 0.3s ease-out'
          }}
          aria-label={isOpen ? "Close reviews" : "Open reviews"}
        >
          <div className="w-full">
            <div className="flex items-center justify-between w-full mb-3">
              <h3 className="text-lg font-bold text-white leading-tight">Client<br/>Reviews</h3>
              <motion.div
                animate={{
                  rotate: isOpen ? 180 : 0,
                  x: isOpen ? -2 : 0
                }}
                transition={{
                  duration: 0.3,
                  ease: "anticipate"
                }}
                className="bg-purple-500/20 p-1 rounded-full"
              >
                <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
            <div className="text-green-400 text-sm font-bold mb-2">
              {currentStats.satisfactionRate}% Satisfied
            </div>
            <motion.div
              className="h-1 w-full bg-purple-900/50 rounded-full overflow-hidden mb-3"
              initial={{ opacity: 0.7, scaleX: 0.9 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
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

          <div className="flex-1 overflow-hidden space-y-3">
            <div className="text-purple-200 text-sm font-medium">Latest Reviews:</div>

            {/* First Review */}
            {reviews.length > 0 && (
              <motion.div
                className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 rounded-xl p-3 border border-purple-500/30 hover:border-purple-400/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-xs text-white font-bold">
                      {reviews[0].author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-xs font-medium">{reviews[0].author}</div>
                    <div className="text-purple-300 text-[10px]">{reviews[0].role}</div>
                  </div>
                </div>
                <div className="text-yellow-400 text-xs mb-1">★★★★★</div>
                <p className="text-purple-100 text-[10px] line-clamp-2 leading-relaxed">{reviews[0].text}</p>
              </motion.div>
            )}
            
            {/* Second Review */}
            {reviews.length > 1 && (
              <motion.div
                className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 rounded-xl p-3 border border-purple-500/30 hover:border-purple-400/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-xs text-white font-bold">
                      M
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-xs font-medium">Mariam Siddiqui</div>
                    <div className="text-purple-300 text-[10px]">Content Creator</div>
                  </div>
                </div>
                <div className="text-yellow-400 text-xs mb-1">★★★★★</div>
                <p className="text-purple-100 text-[10px] line-clamp-2 leading-relaxed">Exceptional service for my personal blog. The WordPress solution was perfect!</p>
              </motion.div>
            )}
            
            {/* Third Review */}
            {reviews.length > 2 && (
              <motion.div
                className="bg-gradient-to-br from-purple-900/40 to-purple-800/30 rounded-xl p-3 border border-purple-500/30 hover:border-purple-400/50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.35 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-xs text-white font-bold">
                      J
                    </div>
                  </div>
                  <div>
                    <div className="text-white text-xs font-medium">John Smith</div>
                    <div className="text-purple-300 text-[10px]">Photographer</div>
                  </div>
                </div>
                <div className="text-yellow-400 text-xs mb-1">★★★★★</div>
                <p className="text-purple-100 text-[10px] line-clamp-2 leading-relaxed">The perfect solution for my photography portfolio. Fast, responsive, and beautiful!</p>
              </motion.div>
            )}
          </div>

          <motion.div
            className="text-center w-full pt-4 border-t-2 border-purple-500/30 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.4 }}
          >
            <div className="text-purple-200 text-sm font-bold mb-2">
              {displayedReviews.length} Client Reviews
            </div>
            <div className="text-purple-100 text-xs flex items-center justify-center gap-2 bg-purple-500/10 px-3 py-2 rounded-full border border-purple-500/20">
              <span className="font-medium">View All Reviews</span>
              <motion.svg
                className="w-4 h-4"
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

      {/* Reviews Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            className="reviews-drawer"
            initial={{ opacity: 0, y: isMobile ? 100 : 0, x: isMobile ? 0 : '70vw' }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: isMobile ? 100 : 0, x: isMobile ? 0 : '70vw' }}
            transition={{ type: "spring", damping: 22, stiffness: 160, mass: 0.8 }}
            style={{
              position: 'fixed',
              top: '80px', // Below navigation bar
              right: '0',
              left: isMobile ? '0' : 'auto',
              bottom: '0',
              zIndex: 99998, // Below mobile button
              width: isMobile ? '100vw' : '70vw', // Increased to 70% viewport width for desktop
              height: 'calc(100vh - 80px)',
              maxHeight: 'calc(100vh - 80px)',
              background: isMobile
                ? 'rgba(10, 5, 20, 0.98)'
                : 'linear-gradient(135deg, rgba(15, 10, 30, 0.88) 0%, rgba(25, 15, 45, 0.92) 50%, rgba(20, 10, 35, 0.90) 100%)',
              backdropFilter: isMobile ? 'blur(20px)' : 'blur(30px)',
              WebkitBackdropFilter: isMobile ? 'blur(20px)' : 'blur(30px)',
              borderRadius: isMobile ? '0' : '0',
              boxShadow: isMobile
                ? '0 0 40px rgba(147, 51, 234, 0.3), inset 0 0 0 2px rgba(147, 51, 234, 0.5)'
                : '0 0 80px rgba(147, 51, 234, 0.5), inset 0 0 0 3px rgba(147, 51, 234, 0.9)',
              border: isMobile
                ? '2px solid rgba(147, 51, 234, 0.6)'
                : '3px solid rgba(147, 51, 234, 0.95)', // Enhanced neon purple border
              borderRight: isMobile ? '2px solid rgba(147, 51, 234, 0.6)' : '3px solid rgba(147, 51, 234, 0.95)',
              borderTop: isMobile ? '2px solid rgba(147, 51, 234, 0.6)' : '3px solid rgba(147, 51, 234, 0.95)',
              borderLeft: isMobile ? '2px solid rgba(147, 51, 234, 0.6)' : '3px solid rgba(147, 51, 234, 0.95)',
              borderBottom: isMobile ? '2px solid rgba(147, 51, 234, 0.6)' : '3px solid rgba(147, 51, 234, 0.95)',
              pointerEvents: 'auto',
              overflowY: 'hidden' // Prevent outer scroll
            }}
          >
            {/* Header Section - Fixed */}
            <div className="sticky top-0 z-20 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-lg p-4 md:p-6 border-b border-purple-500/30">
              {/* Close button - Only show on desktop, mobile uses floating button */}
              {!isMobile && (
                <button
                  onClick={closeWithAnimation}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-purple-700/50 rounded-full transition-all duration-200 z-30"
                  aria-label="Close reviews drawer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Scrollable Content Area */}
            <div
              className="flex-1 overflow-y-auto custom-scrollbar-smooth"
              style={{
                height: 'calc(100% - 80px)',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(147, 51, 234, 0.6) rgba(0, 0, 0, 0.1)',
                overscrollBehavior: 'contain'
              }}
            >
              <div className={`${isMobile ? 'p-4 pb-20' : 'p-8'} pt-0 space-y-4`}>

                {/* Main Header - Compact */}
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-600/20 rounded-lg">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Client Testimonials</h2>
                      <p className="text-purple-300 text-xs">What our clients say</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-xs" />
                      ))}
                    </div>
                    <span className="font-bold text-sm ml-1">5.0</span>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-400">100%</div>
                    <div className="text-sm text-green-300">Satisfaction</div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-600/10 border border-blue-500/30 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-400">248</div>
                    <div className="text-sm text-blue-300">Projects</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-violet-600/10 border border-purple-500/30 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-400">183</div>
                    <div className="text-sm text-purple-300">Clients</div>
                  </div>
                </div>

                {/* Perfect Rating Section */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 text-lg" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-white">5.0</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">Perfect Rating</div>
                      <div className="text-sm text-gray-300">Based on all reviews</div>
                    </div>
                  </div>
                </div>

                {/* Filter Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Filter Reviews:</h3>
                    <div className="text-purple-300 text-sm">
                      <span className="font-bold">{displayedReviewCount}</span> reviews
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFilteredPlan(null)}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        !filteredPlan
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      All Reviews
                    </button>
                    <button
                      onClick={() => setFilteredPlan('Full-Stack Professional')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'Full-Stack Professional'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      Full-Stack Professional
                    </button>
                    <button
                      onClick={() => setFilteredPlan('AI Agents/WebApps')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'AI Agents/WebApps'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      AI Agents/WebApps
                    </button>
                    <button
                      onClick={() => setFilteredPlan('WordPress Professional')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'WordPress Professional'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      WordPress Professional
                    </button>
                    <button
                      onClick={() => setFilteredPlan('Full-Stack Basic')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'Full-Stack Basic'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      Full-Stack Basic
                    </button>
                    <button
                      onClick={() => setFilteredPlan('SEO/Content Writing')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'SEO/Content Writing'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      SEO/Content Writing
                    </button>
                    <button
                      onClick={() => setFilteredPlan('WordPress Basic')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'WordPress Basic'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      WordPress Basic
                    </button>
                    <button
                      onClick={() => setFilteredPlan('WordPress Enterprise')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'WordPress Enterprise'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      WordPress Enterprise
                    </button>
                    <button
                      onClick={() => setFilteredPlan('Full-Stack Enterprise')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'Full-Stack Enterprise'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      Full-Stack Enterprise
                    </button>
                    <button
                      onClick={() => setFilteredPlan('UI/UX Design')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'UI/UX Design'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      UI/UX Design
                    </button>
                    <button
                      onClick={() => setFilteredPlan('Mobile App Development')}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        filteredPlan === 'Mobile App Development'
                          ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:bg-purple-600/20 hover:border-purple-500'
                      }`}
                    >
                      Mobile App Development
                    </button>
                  </div>
                </div>

                {/* Client Satisfaction Chart */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-900/40 to-gray-800/30 rounded-lg border border-gray-600/30">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Client Satisfaction
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      100% recommend
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* 5-star */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-white font-medium">5-star</span>
                      </div>
                      <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '98%' }}></div>
                      </div>
                      <span className="text-sm text-green-400 font-medium w-8">98%</span>
                    </div>

                    {/* 4-star */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-white font-medium">4-star</span>
                      </div>
                      <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                      <span className="text-sm text-green-400 font-medium w-8">78%</span>
                    </div>

                    {/* 3-star */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-white font-medium">3-star</span>
                      </div>
                      <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '21%' }}></div>
                      </div>
                      <span className="text-sm text-green-400 font-medium w-8">21%</span>
                    </div>

                    {/* 2-star */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-white font-medium">2-star</span>
                      </div>
                      <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-sm text-gray-400 font-medium w-8">0%</span>
                    </div>

                    {/* 1-star */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm text-white font-medium">1-star</span>
                      </div>
                      <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-gray-500 to-gray-400 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-sm text-gray-400 font-medium w-8">0%</span>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6 mb-8">
                  {displayedReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl border-2 border-gray-700/30 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                          {review.author[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-white text-lg">{review.author}</h4>
                              <p className="text-sm text-purple-300 font-medium">{review.role}</p>
                            </div>
                            {review.isVerified && (
                              <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 font-medium">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                              ))}
                            </div>
                            <span className="font-semibold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full text-sm border border-purple-500/20">
                              {review.planTitle}
                            </span>
                          </div>
                          <p className="text-gray-100 leading-relaxed font-medium text-base mt-3 whitespace-pre-wrap">{review.text}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Client Satisfaction Section */}
                <div className="p-6 bg-gradient-to-br from-gray-900/70 to-gray-800/50 rounded-2xl border-2 border-purple-500/20 mb-8 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Client Satisfaction</h3>
                      <p className="text-purple-300 text-sm">Performance metrics across all projects</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30">
                      <FaCheck className="text-sm" />
                      <span className="font-bold">100% recommend</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentStats.satisfactionStats.map(stat => (
                      <div key={stat.label} className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-300 font-medium">{stat.label}</span>
                          <span className="font-bold text-white text-lg">{stat.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Testimonial */}
                <div className="text-center p-6 bg-gradient-to-r from-purple-900/30 to-purple-800/20 rounded-2xl border-2 border-purple-500/20 mb-6">
                  <blockquote className="text-purple-100 italic text-lg leading-relaxed">
                    "Working with NEX-DEVS has been a game-changer for our business. Their professional approach and technical excellence exceeded all expectations!"
                  </blockquote>
                  <cite className="text-purple-300 text-sm font-medium mt-3 block">— Satisfied Client</cite>
                </div>
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
    </div>
  );
};

export default ReviewsDrawer; 