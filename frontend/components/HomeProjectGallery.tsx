'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  category: string
}

// Sample project data with fallback images
const sampleProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern online shopping experience with React and Node.js",
    image: "/projects/c7685869-492d-46ea-be5c-d83e5c546fbd.png",
    technologies: ["Next.js", "Node.js", "MongoDB"],
    link: "/projects/1",
    category: "Web Development"
  },
  {
    id: 2,
    title: "AI-Powered Analytics",
    description: "Data visualization platform with machine learning insights",
    image: "/projects/6a884659-4632-4f13-b004-104d446ceda0.png",
    technologies: ["Python", "TensorFlow", "React"],
    link: "/projects/2",
    category: "AI & Machine Learning"
  },
  {
    id: 3,
    title: "Mobile Fitness App",
    description: "Cross-platform application for workout tracking",
    image: "/projects/e57d43a7-3f12-4c1f-891b-c1a3d66b3bb9.png",
    technologies: ["React Native", "Firebase", "Redux"],
    link: "/projects/3",
    category: "Mobile Development"
  },
  {
    id: 4,
    title: "Business Portfolio",
    description: "Corporate website with advanced animations",
    image: "/projects/e7352369-2f82-4f97-99fc-9bf4e36071d3.png",
    technologies: ["Three.js", "GSAP", "Next.js"],
    link: "/projects/4",
    category: "Web Development"
  },
  {
    id: 5,
    title: "Podcast Platform",
    description: "Audio streaming service with creator tools",
    image: "/projects/9289c8e1-3f27-48e0-afaf-1ad087bce119.png",
    technologies: ["React", "Node.js", "AWS"],
    link: "/projects/5",
    category: "Web Development"
  },
  {
    id: 6,
    title: "Wellness Platform",
    description: "Mental health and wellness tracking application",
    image: "/projects/8836a47d-e499-472e-bce5-e5c9361b6a7c.png",
    technologies: ["React", "Firebase", "Tailwind"],
    link: "/projects/6",
    category: "Web Development"
  }
];

export default function HomeProjectGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const [imgLoadError, setImgLoadError] = useState<Record<number, boolean>>({})
  
  // Handle image loading errors
  const handleImageError = (projectId: number) => {
    setImgLoadError(prev => ({
      ...prev,
      [projectId]: true
    }))
  }

  // Setup autoplay carousel
  useEffect(() => {
    if (!isAutoplayEnabled) return;
    
    const startAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === sampleProjects.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Rotate every 4 seconds
    };
    
    startAutoplay();
    
    // Pause carousel on tab/window inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
          autoplayRef.current = null;
        }
      } else if (isAutoplayEnabled) {
        startAutoplay();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isAutoplayEnabled]);

  // Toggle autoplay function
  const toggleAutoplay = useCallback(() => {
    setIsAutoplayEnabled(prev => {
      const newState = !prev;
      
      // Clear existing interval if turning off
      if (!newState && autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      
      // Start new interval if turning on
      if (newState) {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => 
            prevIndex === sampleProjects.length - 1 ? 0 : prevIndex + 1
          );
        }, 4000);
      }
      
      return newState;
    });
  }, []);

  // Navigate carousel 
  const goToSlide = useCallback((index: number) => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    
    setCurrentIndex(index);
    
    // Restart autoplay after user inactivity
    if (isAutoplayEnabled) {
      autoplayRef.current = setTimeout(() => {
        if (autoplayRef.current) {
          clearTimeout(autoplayRef.current);
          autoplayRef.current = setInterval(() => {
            setCurrentIndex(prevIndex => 
              prevIndex === sampleProjects.length - 1 ? 0 : prevIndex + 1
            );
          }, 4000);
        }
      }, 8000);
    }
  }, [isAutoplayEnabled]);

  // Previous/Next navigation
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? sampleProjects.length - 1 : prevIndex - 1);
  }, []);
  
  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === sampleProjects.length - 1 ? 0 : prevIndex + 1);
  }, []);

  // Add swipe functionality for mobile
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

  return (
    <section className="max-w-7xl mx-auto mt-12 sm:mt-16 mb-16 px-2 sm:px-4 md:px-0">
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-black/40 to-black/20 border border-purple-500/20 p-4 md:p-6 backdrop-blur-sm">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-indigo-900/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="mb-6 flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Visual showcase of my latest work. Swipe or use arrows to browse.
            </p>
          </div>
          
          {/* Autoplay toggle button */}
          <button
            onClick={toggleAutoplay}
            className="flex items-center gap-2 px-3 py-2 bg-black/50 rounded-lg border border-purple-500/30 hover:bg-black/70 transition-colors"
            aria-label={isAutoplayEnabled ? "Switch to manual slideshow" : "Switch to automatic slideshow"}
          >
            <span className={`text-sm ${isAutoplayEnabled ? 'text-purple-300' : 'text-gray-400'}`}>
              {isAutoplayEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </span>
            <span className="text-sm hidden sm:inline font-medium">
              {isAutoplayEnabled ? 'Auto' : 'Manual'}
            </span>
          </button>
        </div>
        
        {/* Main Carousel */}
        <div 
          className="relative rounded-xl overflow-hidden z-10"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Dynamic height container for the carousel */}
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] relative">
            {/* Carousel animation container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {/* Project display */}
                <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-4">
                  {/* Project image */}
                  <div 
                    className="relative h-full w-full overflow-hidden rounded-lg border border-purple-500/10 group"
                    onMouseEnter={() => setHoveredProject(sampleProjects[currentIndex].id)}
                    onMouseLeave={() => setHoveredProject(null)}
                  >
                    {/* Enhanced gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/20 to-black/40 z-10 group-hover:opacity-60 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 h-40 w-40 bg-purple-500/5 rounded-full blur-xl z-0"></div>
                    <div className="absolute bottom-0 left-0 h-40 w-40 bg-blue-500/5 rounded-full blur-xl z-0"></div>
                    
                    <div className="relative h-full w-full overflow-hidden">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          transition: { duration: 15, repeat: Infinity, repeatType: "reverse" }
                        }}
                        className="h-full w-full"
                      >
                        <Image 
                          src={sampleProjects[currentIndex].image}
                          alt={sampleProjects[currentIndex].title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 600px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority={true}
                          quality={95}
                          onError={() => handleImageError(sampleProjects[currentIndex].id)}
                          style={{ 
                            objectFit: 'cover',
                            transform: 'translateZ(0)',
                            filter: 'contrast(1.05) brightness(0.95)'
                          }}
                        />
                      </motion.div>
                    </div>
                    
                    {/* Project title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {sampleProjects[currentIndex].title}
                      </h3>
                    </div>
                    
                    {/* Show view project button on hover */}
                    <AnimatePresence>
                      {hoveredProject === sampleProjects[currentIndex].id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.2 }}
                          className="absolute bottom-16 left-4 z-20"
                        >
                          <Link
                            href={sampleProjects[currentIndex].link}
                            className="px-4 py-2 bg-purple-500/80 hover:bg-purple-600/90 rounded-lg text-white text-sm font-medium backdrop-blur-sm transition-all duration-300 flex items-center gap-2"
                          >
                            <span>View Project</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Project details */}
                  <div className="flex flex-col justify-center h-full p-4 space-y-4 bg-black/30 rounded-lg border border-purple-500/10">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <span className="text-xs font-medium text-purple-400 mb-2 inline-block px-2 py-1 rounded-full bg-purple-900/20 border border-purple-500/20">
                        {sampleProjects[currentIndex].category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {sampleProjects[currentIndex].title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {sampleProjects[currentIndex].description}
                      </p>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-purple-300">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {sampleProjects[currentIndex].technologies.map(tech => (
                            <span 
                              key={tech} 
                              className="px-2 py-1 bg-black/40 border border-purple-500/20 rounded-lg text-xs text-purple-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    
                    <Link
                      href={sampleProjects[currentIndex].link}
                      className="mt-auto inline-flex items-center text-sm text-purple-300 hover:text-purple-200 transition-colors group"
                    >
                      <span>View Project Details</span>
                      <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation buttons */}
          <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10 pointer-events-auto">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors border border-white/10 hover:border-purple-500/30 touch-manipulation"
              aria-label="Previous project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </div>

          <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10 pointer-events-auto">
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors border border-white/10 hover:border-purple-500/30 touch-manipulation"
              aria-label="Next project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Pagination with numbered buttons */}
        <div className="flex justify-center mt-4 gap-2">
          {sampleProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-8 min-w-8 px-2 rounded-lg border-2 transition-all flex items-center justify-center text-xs font-semibold tracking-wide ${
                index === currentIndex
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-black/50 text-purple-200 border-purple-500/40 hover:bg-black/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {/* View All Projects Button */}
        <div className="flex justify-center mt-8">
          <Link 
            href="/projects" 
            className="px-5 py-3 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-600 hover:to-indigo-600 rounded-lg text-white font-medium transition-all duration-300 group flex items-center gap-2"
          >
            <span>View All Projects</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
} 