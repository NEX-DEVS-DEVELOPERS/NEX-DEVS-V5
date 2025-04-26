'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Project type definition with essential fields
type Project = {
  id: number
  title: string
  description: string
  image: string
  secondImage?: string
  category: string
  technologies: string[]
  link: string
  featured: boolean
  visualEffects?: {
    animation?: string
    glow?: boolean
    showBadge?: boolean
  }
}

export default function HomeProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const [imgLoadError, setImgLoadError] = useState<Record<number, boolean>>({})
  
  // Fetch projects from API - with optimized caching strategy
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Add timestamp to force fresh data and prevent browser caching
        const timestamp = new Date().getTime()
        const randomValue = Math.floor(Math.random() * 10000000)
        const cache = `nocache=${timestamp}-${randomValue}`
        
        const response = await fetch(`/api/projects?featured=true&t=${timestamp}&r=${randomValue}&${cache}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await response.json()
        
        // Filter and process the data to ensure it has all required fields
        const processedData = data
          .filter((project: Project) => project && project.image && project.title) // Only include projects with required fields
          .slice(0, 4) // Limit to 4 projects max for better performance
        
        setProjects(processedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching projects:', error)
        setIsLoading(false)
      }
    }
    
    fetchProjects()
    
    // Refresh data less frequently (every 2 minutes) when tab is visible to reduce API calls
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchProjects()
      }
    }, 120000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Handle image loading errors
  const handleImageError = (projectId: number) => {
    setImgLoadError(prev => ({
      ...prev,
      [projectId]: true
    }))
  }

  // Setup autoplay carousel with improved performance
  useEffect(() => {
    if (!isAutoplayEnabled || projects.length <= 1) return
    
    const startAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
      
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === projects.length - 1 ? 0 : prevIndex + 1
        )
      }, 6000) // Rotate every 6 seconds (slower rotation for smoother experience)
    }
    
    startAutoplay()
    
    // Pause carousel on tab/window inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current)
          autoplayRef.current = null
        }
      } else if (isAutoplayEnabled) {
        startAutoplay()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [isAutoplayEnabled, projects.length])

  // Toggle autoplay function
  const toggleAutoplay = useCallback(() => {
    setIsAutoplayEnabled(prev => {
      const newState = !prev
      
      // Clear existing interval if turning off
      if (!newState && autoplayRef.current) {
        clearInterval(autoplayRef.current)
        autoplayRef.current = null
      }
      
      // Start new interval if turning on
      if (newState && projects.length > 1) {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current)
        }
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => 
            prevIndex === projects.length - 1 ? 0 : prevIndex + 1
          )
        }, 6000)
      }
      
      return newState
    })
  }, [projects.length])

  // Previous/Next navigation
  const goToPrevious = useCallback(() => {
    if (projects.length <= 1) return
    setCurrentIndex(prevIndex => prevIndex === 0 ? projects.length - 1 : prevIndex - 1)
  }, [projects.length])
  
  const goToNext = useCallback(() => {
    if (projects.length <= 1) return
    setCurrentIndex(prevIndex => prevIndex === projects.length - 1 ? 0 : prevIndex + 1)
  }, [projects.length])

  // Add swipe functionality for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX
    
    // Require at least 50px swipe to register
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - go to next
        goToNext()
      } else {
        // Swipe right - go to previous
        goToPrevious()
      }
    }
    
    touchStartXRef.current = null
  }, [goToNext, goToPrevious])

  // If loading or no projects, show appropriate UI
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto mt-10 sm:mt-14 mb-12 px-2 sm:px-4 md:px-0">
        <div className="relative overflow-hidden rounded-xl bg-black/20 border border-purple-500/20 p-4 backdrop-blur-sm h-[280px] flex items-center justify-center">
          <div className="flex space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto mt-10 sm:mt-14 mb-12 px-2 sm:px-4 md:px-0 will-change-transform"
             style={{
               transform: 'translate3d(0, 0, 0)',
               backfaceVisibility: 'hidden',
               perspective: '1000px'
             }}>
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-black/40 to-black/20 border border-purple-500/20 p-2 sm:p-4 backdrop-blur-sm shadow-lg will-change-transform"
           style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 right-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-900/10 rounded-full blur-[120px] will-change-transform" 
               style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }} />
          <div className="absolute bottom-0 left-1/4 w-[150px] sm:w-[300px] h-[150px] sm:h-[300px] bg-indigo-900/10 rounded-full blur-[120px] will-change-transform"
               style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }} />
        </div>
        
        <div className="mb-2 sm:mb-4 flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-0.5 sm:mb-1">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm hidden sm:block">
              Visual showcase of my latest work
            </p>
          </div>
          
          {/* Improved autoplay toggle button */}
          {projects.length > 1 && (
            <motion.button
              onClick={toggleAutoplay}
              className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 bg-black/50 rounded-lg border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300"
              aria-label={isAutoplayEnabled ? "Switch to manual slideshow" : "Switch to automatic slideshow"}
              whileTap={{ scale: 0.97 }}
              whileHover={{ 
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                boxShadow: "0 0 8px rgba(167, 139, 250, 0.3)" 
              }}
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
            </motion.button>
          )}
        </div>
        
        {/* More compact carousel */}
        <div 
          className="relative rounded-xl overflow-hidden z-10 will-change-transform"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
        >
          {/* Reduced height for all devices */}
          <div className="w-full h-[220px] sm:h-[300px] md:h-[420px] relative will-change-transform"
               style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
            {/* Optimized carousel animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.25, 0.1, 0.25, 1.0],
                  opacity: { duration: 0.3 }
                }}
                className="absolute inset-0 w-full h-full will-change-transform"
                style={{
                  transform: 'translate3d(0, 0, 0)',
                  backfaceVisibility: 'hidden',
                  perspective: '1000px'
                }}
              >
                {/* Project display - Mobile: single column with image focus, Desktop: two columns with details */}
                <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-3 will-change-transform"
                     style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}>
                  {/* Project image - Always shown */}
                  <div 
                    className="relative h-full w-full overflow-hidden rounded-lg border border-purple-500/10 group shadow-md will-change-transform"
                    onMouseEnter={() => setHoveredProject(projects[currentIndex].id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    style={{ transform: 'translate3d(0, 0, 0)', backfaceVisibility: 'hidden' }}
                  >
                    {/* Optimized gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/20 to-black/40 z-10 opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                    
                    {/* Reduced decorative elements for better performance */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-purple-500/5 rounded-full blur-xl z-0 hidden sm:block"></div>
                    
                    <div className="relative h-full w-full overflow-hidden">
                      {/* Reduced motion for better performance */}
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ 
                          scale: [1, 1.03, 1],
                          transition: { 
                            duration: 20, 
                            repeat: Infinity, 
                            repeatType: "reverse",
                            ease: "easeInOut" 
                          }
                        }}
                        className="h-full w-full will-change-transform"
                      >
                        <Image 
                          src={projects[currentIndex].image}
                          alt={projects[currentIndex].title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 600px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                          priority={true}
                          quality={90} // Slightly reduced for performance
                          onError={() => handleImageError(projects[currentIndex].id)}
                          style={{ 
                            objectFit: 'cover',
                            backfaceVisibility: 'hidden', // Performance optimization
                            transform: 'translateZ(0)', // Force GPU acceleration
                            filter: 'contrast(1.05) brightness(0.95)'
                          }}
                        />
                      </motion.div>
                    </div>
                    
                    {/* Category badge - Smaller on mobile */}
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20">
                      <span className="text-[10px] sm:text-xs font-medium text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-purple-600/80 backdrop-blur-sm shadow-sm">
                        {projects[currentIndex].category}
                      </span>
                    </div>
                    
                    {/* Project title overlay - Compact for mobile */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
                        {projects[currentIndex].title}
                      </h3>
                      {/* Only on mobile: Brief tag display */}
                      <div className="flex items-center gap-1 mt-1 md:hidden">
                        <span className="text-[10px] text-purple-200">
                          {projects[currentIndex].technologies.slice(0, 2).join(', ')}
                          {projects[currentIndex].technologies.length > 2 && '...'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Improved hover animation for view project button */}
                    <AnimatePresence>
                      {hoveredProject === projects[currentIndex].id && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 15 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 30 
                          }}
                          className="absolute bottom-14 left-4 z-20 hidden sm:block"
                        >
                          <Link
                            href={`/projects/${projects[currentIndex].id}`}
                            className="px-4 py-2 bg-purple-500/80 hover:bg-purple-600/90 rounded-lg text-white text-sm font-medium backdrop-blur-sm transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-purple-500/20 hover:translate-y-[-2px]"
                          >
                            <span>View Project</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-0.5">
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Project details - Hidden on mobile, shown on desktop */}
                  <div className="hidden md:flex flex-col justify-center h-full p-4 space-y-3 bg-black/30 rounded-lg border border-purple-500/10 shadow-md backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        delay: 0.1
                      }}
                    >
                      <span className="text-xs font-medium text-purple-400 mb-2 inline-block px-2 py-0.5 rounded-full bg-purple-900/20 border border-purple-500/20">
                        {projects[currentIndex].category}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                        {projects[currentIndex].title}
                      </h3>
                      <p className="text-gray-300 mb-3 md:text-sm line-clamp-3">
                        {projects[currentIndex].description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-purple-300">Technologies</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {projects[currentIndex].technologies.slice(0, 5).map(tech => (
                            <span 
                              key={tech} 
                              className="px-2 py-0.5 bg-black/40 border border-purple-500/20 rounded-lg text-xs text-purple-200 shadow-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Link
                        href={`/projects/${projects[currentIndex].id}`}
                        className="mt-auto inline-flex items-center text-sm text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        <span>View Project Details</span>
                        <motion.span 
                          className="ml-1 inline-block"
                          initial={{ x: 0 }}
                          whileHover={{ x: 3 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          →
                        </motion.span>
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Improved navigation buttons */}
          {projects.length > 1 && (
            <>
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 -left-1 sm:-left-2 md:left-1 z-10"
                whileHover={{ scale: 1.05, x: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <button
                  onClick={goToPrevious}
                  className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 border border-white/10 hover:border-purple-500/40 shadow-lg hover:shadow-purple-500/20"
                  aria-label="Previous project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              </motion.div>
              
              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 -right-1 sm:-right-2 md:right-1 z-10"
                whileHover={{ scale: 1.05, x: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <button
                  onClick={goToNext}
                  className="p-1.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-300 border border-white/10 hover:border-purple-500/40 shadow-lg hover:shadow-purple-500/20"
                  aria-label="Next project"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:hidden">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </motion.div>
            </>
          )}
        </div>
        
        {/* Improved pagination dots */}
        {projects.length > 1 && (
          <div className="flex justify-center mt-2 gap-1 sm:gap-1.5">
            {projects.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-4 sm:w-5 bg-purple-500 shadow-md' 
                    : 'w-1.5 sm:w-1.5 bg-white/30 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* View All Projects Button */}
        <div className="flex justify-center mt-3 sm:mt-5">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ y: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            style={{ willChange: 'transform' }}
          >
            <Link 
              href="/projects" 
              className="group px-4 py-2 sm:px-5 sm:py-2.5 bg-black/40 backdrop-blur-md border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-white text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/20"
            >
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-purple-200 to-purple-100 text-transparent bg-clip-text">View All Projects</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text blur-sm" aria-hidden="true">View All Projects</span>
              </span>
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="inline-block text-purple-300 group-hover:text-purple-200"
              >→</motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}