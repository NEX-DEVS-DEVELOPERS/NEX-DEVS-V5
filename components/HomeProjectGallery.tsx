'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Project type definition with essential fields
interface Project {
  id: string | number;
  title: string;
  description: string;
  image: string;
  secondImage?: string;
  category: string;
  technologies: string[] | string;
  link: string;
  visualEffects?: {
    glow?: boolean;
    animation?: string;
    showBadge?: boolean;
  };
}

export default function HomeProjectGallery() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const [imgLoadError, setImgLoadError] = useState<Record<string, boolean>>({})
  const [showSecondaryImage, setShowSecondaryImage] = useState<Record<string, boolean>>({})
  
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
  const handleImageError = (projectId: string) => {
    console.error(`Failed to load image for project ${projectId}`);
    setImgLoadError(prev => ({
      ...prev,
      [projectId]: true
    }));
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

  // Function to toggle between primary and secondary images
  const toggleSecondaryImage = (projectId: string) => {
    setShowSecondaryImage(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }))
  }

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
        {isLoading ? (
          <div className="h-[280px] flex items-center justify-center">
            <div className="flex space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Projects</h2>
              <div className="flex gap-2">
                <button 
              onClick={toggleAutoplay}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
                    isAutoplayEnabled
                      ? 'bg-purple-600/40 text-purple-300 hover:bg-purple-600/60'
                      : 'bg-gray-800/70 text-gray-400 hover:bg-gray-700'
                  }`}
                  aria-label={isAutoplayEnabled ? 'Disable autoplay' : 'Enable autoplay'}
                  title={isAutoplayEnabled ? 'Disable autoplay' : 'Enable autoplay'}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isAutoplayEnabled ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    )}
                  </svg>
                  <span>{isAutoplayEnabled ? 'Pause' : 'Play'}</span>
                </button>
              </div>
        </div>
        
            <div className="relative">
        <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
              >
                {projects.map((project, index) => (
                  <div 
                    key={`project-${project.id}-${index}`}
                    className="w-full flex-shrink-0"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      {/* Project Image */}
                      <div className="w-full md:w-1/2">
                        <div 
                          className={`relative rounded-xl overflow-hidden aspect-video border ${
                            project.visualEffects?.glow ? 'border-purple-500/40 shadow-glow' : 'border-gray-700/50'
                          } transition-all duration-500`}
                          onMouseEnter={() => setHoveredProject(project.id.toString())}
                          onMouseLeave={() => setHoveredProject(null)}
                        >
                          {/* Badge */}
                          {project.visualEffects?.showBadge && (
                            <div className="absolute top-3 left-3 z-10 bg-purple-600/90 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm">
                              {project.category}
                            </div>
                          )}
                          
                          {/* Toggle Image Button - Only show if secondImage exists */}
                          {project.secondImage && (
                            <button
                              onClick={() => toggleSecondaryImage(project.id.toString())}
                              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                              aria-label="Toggle image view"
                              title="Toggle image view"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </button>
                          )}
                          
                          {/* Image */}
                          <div 
                            className={`relative w-full h-full ${
                              project.visualEffects?.animation === 'zoom' && hoveredProject === project.id.toString()
                                ? 'scale-110'
                                : 'scale-100'
                            } transition-all duration-700 ease-in-out`}
                      >
                        <Image 
                              src={showSecondaryImage[project.id.toString()] && project.secondImage ? project.secondImage : project.image}
                              alt={project.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover object-center"
                              onError={() => handleImageError(project.id.toString())}
                              priority={index === 0}
                            />
                            
                            {/* Image indicator for secondary/primary */}
                            {project.secondImage && (
                              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm">
                                {showSecondaryImage[project.id.toString()] ? 'Secondary View' : 'Primary View'}
                    </div>
                            )}
                            
                            {/* Hover overlay */}
                            <div 
                              className={`absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300`}
                            >
                              <div className="text-white text-center p-4">
                                <h3 className="font-bold text-lg mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-300 mb-3 line-clamp-2">{project.description}</p>
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded-lg transition-colors text-sm"
                                >
                                  <span>View Project</span>
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          </div>
                    </div>
                      </div>
                      
                      {/* Project Info */}
                      <div className="w-full md:w-1/2 p-2">
                        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                        <p className="text-gray-300 mb-4 text-sm">{project.description}</p>
                        
                        {/* Technologies */}
                        <div className="mb-4">
                          <h4 className="text-xs text-gray-400 mb-2">Technologies:</h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(project.technologies) ? (
                              project.technologies.slice(0, 5).map((tech, techIndex) => (
                                <span 
                                  key={`tech-${project.id}-${techIndex}`}
                                  className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {tech}
                                </span>
                              ))
                            ) : (
                              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                                {project.technologies}
                              </span>
                            )}
                            
                            {Array.isArray(project.technologies) && project.technologies.length > 5 && (
                              <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
                                +{project.technologies.length - 5} more
                        </span>
                            )}
                      </div>
                    </div>
                    
                        {/* Link Button */}
                        <div className="flex gap-3">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-1.5 px-3 rounded-lg transition-colors text-sm"
                          >
                            <span>View Project</span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          
                          {/* Toggle Image Button - Alternative location */}
                          {project.secondImage && (
                            <button
                              onClick={() => toggleSecondaryImage(project.id.toString())}
                              className="inline-flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white py-1.5 px-3 rounded-lg transition-colors text-sm"
                            >
                              <span>{showSecondaryImage[project.id.toString()] ? 'Show Primary' : 'Show Secondary'}</span>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          
              {/* Navigation controls */}
          {projects.length > 1 && (
            <>
                <button
                  onClick={goToPrevious}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 transition-colors"
                  aria-label="Previous project"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                  
                <button
                  onClick={goToNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full z-10 transition-colors"
                  aria-label="Next project"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
            </>
          )}
        
              {/* Pagination dots */}
        {projects.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
            {projects.map((_, index) => (
                    <button
                      key={`dot-${index}`}
                onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentIndex === index
                          ? 'bg-purple-500 w-4'
                          : 'bg-gray-600 hover:bg-gray-500'
                      }`}
                      aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        )}
        
              {/* View All Projects button */}
              <div className="flex justify-center mt-6">
            <Link 
              href="/projects" 
                  className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  <span>View All Projects</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
            </Link>
              </div>
        </div>
          </>
        )}
      </div>
    </section>
  )
}