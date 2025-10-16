import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for the reviews
interface Review {
  text: string;
  author: string;
  role: string;
  company?: string;
  country?: string;
  rating?: number;
  avatar?: string;
  isInternational?: boolean;
  highlightedPhrase?: string; // Optional phrase to highlight in the review
}

interface ReviewsCarouselProps {
  reviews: Review[];
  autoplayInterval?: number;
  isPaused?: boolean;
  title?: string;
}

const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ 
  reviews: initialReviews, 
  autoplayInterval = 4000,
  isPaused = false,
  title = "What Our Clients Say"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(isPaused);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Fetch new reviews from the API when the component mounts
  useEffect(() => {
    const fetchNewReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        const data = await response.json();
        
        if (data.success && data.reviews && Array.isArray(data.reviews)) {
          // Add any new reviews to the carousel
          // Convert from PlanReview structure to Review structure for the carousel
          const newCarouselReviews = data.reviews.map((review: any) => ({
            text: review.text,
            author: review.author,
            role: review.role,
            company: review.company,
            country: review.country,
            rating: review.rating,
            isInternational: review.isInternational,
            // Select a phrase to highlight (first sentence or first 50 chars)
            highlightedPhrase: review.text.split('.')[0]
          }));
          
          // Add new reviews to the state
          if (newCarouselReviews.length > 0) {
            setReviews([...newCarouselReviews, ...initialReviews]);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews for carousel:', error);
      }
    };
    
    fetchNewReviews();
  }, [initialReviews]);

  // Setup autoplay carousel
  useEffect(() => {
    if (isAutoplayPaused || isHovered || reviews.length <= 1) return;
    
    const startAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
      }, autoplayInterval);
    };
    
    startAutoplay();
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [autoplayInterval, isAutoplayPaused, isHovered, reviews.length]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? reviews.length - 1 : prevIndex - 1);
  }, [reviews.length]);
  
  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === reviews.length - 1 ? 0 : prevIndex + 1);
  }, [reviews.length]);

  // Touch event handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    
    // Require at least 50px swipe to register
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - go to next
        goToNext();
      } else {
        // Swipe right - go to previous
        goToPrevious();
      }
    }
    
    touchStartXRef.current = null;
  }, [goToNext, goToPrevious]);

  // Format review text to highlight specific phrases
  const formatReviewText = (text: string, highlight?: string) => {
    if (!highlight) return text;
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <span key={i} className="text-purple-300 font-medium">{part}</span> : 
            part
        )}
      </>
    );
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    setIsAutoplayPaused(prev => !prev);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-4xl mx-auto my-4 md:my-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Enhanced top gradient decoration with animation */}
      <motion.div 
        animate={{ 
          opacity: [0.5, 0.7, 0.5],
          width: ['100%', '98%', '100%']
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute -top-2 left-0 right-0 mx-auto w-full h-6 md:h-8 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 blur-md"
      />
      
      {/* Enhanced Title with animation */}
      <div className="text-center mb-4 md:mb-6">
        <motion.h3 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base md:text-xl font-bold text-white flex items-center justify-center gap-1 md:gap-2"
        >
          <motion.span 
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg md:text-xl"
          >
            🗣️
          </motion.span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent relative">
            {title}
            <motion.span 
              className="absolute bottom-0 left-0 right-0 h-[1px] md:h-[2px] bg-gradient-to-r from-purple-400/50 to-pink-400/50" 
              animate={{ width: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </span>
          <motion.span 
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg md:text-xl"
          >
            🗣️
          </motion.span>
        </motion.h3>
      </div>
      
      <div className="overflow-hidden rounded-xl relative bg-gradient-to-br from-purple-900/10 to-black/50 p-1">
        {/* Main carousel with enhanced styling */}
        <div className="relative h-[120px] md:h-[140px] rounded-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute w-full h-full"
            >
              <div className="p-3 md:p-6 backdrop-blur-lg bg-gradient-to-r from-purple-900/30 to-black/50 rounded-xl border border-purple-500/30 h-full flex flex-col justify-center shadow-lg shadow-purple-900/10 hover:border-purple-500/50 transition-colors">
                <div className="relative">
                  {/* Enhanced quote marks */}
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -top-2 md:-top-4 -left-1 md:-left-2 text-2xl md:text-4xl text-purple-600/40 font-serif"
                  >
                    "
                  </motion.span>
                  <p className="text-xs md:text-base text-gray-300 italic mb-2 md:mb-4 px-2 relative z-10 leading-relaxed line-clamp-2 md:line-clamp-none">
                    {formatReviewText(reviews[currentIndex].text, reviews[currentIndex].highlightedPhrase)}
                  </p>
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute -bottom-4 -right-1 text-2xl md:text-4xl text-purple-600/40 font-serif"
                  >
                    "
                  </motion.span>
                </div>
                
                {/* Enhanced author section */}
                <div className="flex items-center justify-between mt-1 md:mt-2">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-1.5 md:gap-2"
                  >
                    {reviews[currentIndex].avatar ? (
                      <motion.img 
                        whileHover={{ scale: 1.1 }}
                        src={reviews[currentIndex].avatar} 
                        alt={reviews[currentIndex].author} 
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border border-purple-500/50 shadow-md shadow-purple-500/20"
                      />
                    ) : (
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-md shadow-purple-600/20"
                      >
                        {reviews[currentIndex].author.charAt(0)}
                      </motion.div>
                    )}
                    <div>
                      <p className="text-white text-xs md:text-sm font-semibold flex items-center gap-1">
                        {reviews[currentIndex].author}
                        {reviews[currentIndex].isInternational && (
                          <motion.span 
                            animate={{ rotate: [-5, 5, -5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block w-3 h-3 md:w-4 md:h-4 ml-0.5 md:ml-1 opacity-80"
                          >
                            🌎
                          </motion.span>
                        )}
                      </p>
                      <p className="text-purple-300 text-[10px] md:text-xs">{reviews[currentIndex].role}</p>
                    </div>
                  </motion.div>
                  {reviews[currentIndex].rating && (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center text-yellow-400"
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span 
                          key={i} 
                          className="text-xs md:text-sm"
                          animate={i < reviews[currentIndex].rating! ? { 
                            scale: [1, 1.2, 1],
                            opacity: [0.8, 1, 0.8]
                          } : {}}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                        >
                          {i < reviews[currentIndex].rating! ? "★" : "☆"}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced navigation buttons with better animation */}
        {reviews.length > 1 && (
          <>
            <motion.button 
              onClick={goToPrevious}
              whileHover={{ scale: 1.15, x: -2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
              className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-purple-800/60 transition-colors z-10 border border-purple-500/40 shadow-lg shadow-purple-800/10"
              aria-label="Previous review"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button 
              onClick={goToNext}
              whileHover={{ scale: 1.15, x: 2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
              className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-purple-800/60 transition-colors z-10 border border-purple-500/40 shadow-lg shadow-purple-800/10"
              aria-label="Next review"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </>
        )}

        {/* Enhanced indicators with animation */}
        {reviews.length > 1 && (
          <div className="absolute -bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-2 z-10">
            {reviews.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.2 }}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 w-4 md:w-6 h-1.5 md:h-2 shadow-sm shadow-purple-500/30' 
                    : 'bg-purple-500/30 hover:bg-purple-500/50 w-1.5 md:w-2 h-1.5 md:h-2'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Autoplay control button */}
        <motion.button
          onClick={toggleAutoplay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-purple-800/40 transition-colors z-10 border border-purple-500/30"
          aria-label={isAutoplayPaused ? "Play" : "Pause"}
        >
          {isAutoplayPaused ? (
            <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg className="w-2.5 h-2.5 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          )}
        </motion.button>
      </div>
      
      {/* Counter indicator */}
      <div className="absolute -bottom-4 md:-bottom-6 right-2 md:right-4 text-[10px] md:text-xs text-purple-400 font-medium">
        {currentIndex + 1} / {reviews.length}
      </div>
      
      {/* Enhanced bottom gradient decoration with animation */}
      <motion.div 
        animate={{ 
          opacity: [0.5, 0.7, 0.5],
          width: ['100%', '98%', '100%']
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2.5
        }}
        className="absolute -bottom-2 md:-bottom-4 left-0 right-0 mx-auto w-full h-6 md:h-8 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 blur-md"
      />
    </motion.div>
  );
};

export default ReviewsCarousel; 
