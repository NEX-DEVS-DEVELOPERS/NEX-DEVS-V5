'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CodeHighlighter from './CodeHighlighter'

// Project type definition
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
  status?: string
  updatedDays?: number
  progress?: number
  features?: string[]
  imagePriority?: boolean | number
  showBothImagesInPriority?: boolean
  visualEffects?: {
    glow: boolean
    animation: string
    showBadge: boolean
  }
}

export default function ProjectImageGallery() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [enlargedImage, setEnlargedImage] = useState<{projectId: number, image: string} | null>(null)
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null)
  const projectsCache = useRef<{data: Project[], timestamp: number} | null>(null)
  
  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  
  // Fetch all projects with improved caching
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchProjects = async () => {
      try {
        // Check if we have cached data and it's less than 5 minutes old
        const currentTime = new Date().getTime();
        if (
          projectsCache.current && 
          projectsCache.current.data.length > 0 && 
          currentTime - projectsCache.current.timestamp < 5 * 60 * 1000
        ) {
          console.log('[ProjectImageGallery] Using cached projects data');
          setProjects(projectsCache.current.data);
          setIsLoading(false);
          setLastFetchTime(projectsCache.current.timestamp);
          return;
        }
        
        // Enhanced cache busting with multiple random values
        const timestamp = currentTime;
        const randomValue = Math.floor(Math.random() * 10000000);
        const cache = `nocache=${timestamp}-${randomValue}`;
        
        console.log(`[ProjectImageGallery] Fetching projects at timestamp: ${timestamp}`);
        setFetchError(null);
        
        const response = await fetch(`/api/projects?t=${timestamp}&r=${randomValue}&${cache}`, {
          signal: controller.signal,
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Force-Refresh': 'true',
            'X-Random-Value': randomValue.toString()
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json()
        console.log(`[ProjectImageGallery] Received ${data.length} projects`);
        
        // Filter projects that have valid images and exclude code screenshots
        const projectsWithImages = data.filter((project: Project) => 
          project.image && 
          !project.image.includes('placeholder')
          // Code screenshots are now included
        )
        
        console.log(`[ProjectImageGallery] After filtering: ${projectsWithImages.length} projects with valid images`);
        
        // Sort projects - featured first, then by priority if available
        const sortedProjects = [...projectsWithImages].sort((a: Project, b: Project) => {
          // Handle numeric priority
          if (typeof a.imagePriority === 'number' && typeof b.imagePriority === 'number') {
            return a.imagePriority - b.imagePriority;
          }
          
          // If only one has numeric priority, it takes precedence
          if (typeof a.imagePriority === 'number') return -1;
          if (typeof b.imagePriority === 'number') return 1;
          
          // Handle boolean priority as fallback
          if (a.imagePriority === true && b.imagePriority !== true) return -1;
          if (a.imagePriority !== true && b.imagePriority === true) return 1;
          
          // Finally sort by featured and ID
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          
          return a.id - b.id;
        });
        
        // Update cache
        projectsCache.current = {
          data: sortedProjects,
          timestamp: currentTime
        };
        
        setProjects(sortedProjects);
        setLastFetchTime(currentTime);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          // Ignore abort errors
          return;
        }
        console.error('Error fetching projects for gallery:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to load projects');
        
        // If we have cached data, use it as fallback
        if (projectsCache.current && projectsCache.current.data.length > 0) {
          console.log('[ProjectImageGallery] Using cached data as fallback after error');
          setProjects(projectsCache.current.data);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
    
    return () => {
      controller.abort();
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    }
  }, []);

  // Setup autoplay carousel
  useEffect(() => {
    if (projects.length <= 1 || !isAutoplayEnabled) return;
    
    const startAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === projects.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Rotate every 5 seconds
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
  }, [projects.length, isAutoplayEnabled]);

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
      if (newState && projects.length > 1) {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => 
            prevIndex === projects.length - 1 ? 0 : prevIndex + 1
          );
        }, 5000);
      }
      
      return newState;
    });
  }, [projects.length]);

  // Handle image click to navigate to project
  const handleImageClick = useCallback((projectId: number) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      router.push(`/projects/${projectId}`)
    }
  }, [projects, router]);

  // Handle image enlargement
  const handleImageEnlarge = useCallback((e: React.MouseEvent, projectId: number, image: string) => {
    e.stopPropagation(); // Prevent navigation
    setEnlargedImage({ projectId, image });
  }, []);

  // Switch images for a project
  const handleSwitchImage = useCallback((e: React.MouseEvent, projectId: number) => {
    e.stopPropagation(); // Prevent navigation
    
    setProjects(prevProjects => 
      prevProjects.map(project => {
        if (project.id === projectId && project.secondImage) {
          // Swap the images
          return {
            ...project,
            image: project.secondImage,
            secondImage: project.image
          };
        }
        return project;
      })
    );
  }, []);

  // Navigate carousel 
  const goToSlide = useCallback((index: number) => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    
    setCurrentIndex(index);
    
    // Restart autoplay after 10 seconds of user inactivity
    autoplayRef.current = setTimeout(() => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
        autoplayRef.current = setInterval(() => {
          setCurrentIndex(prevIndex => 
            prevIndex === projects.length - 1 ? 0 : prevIndex + 1
          );
        }, 5000);
      }
    }, 10000);
  }, [projects.length]);

  // Previous/Next navigation
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? projects.length - 1 : prevIndex - 1);
  }, [projects.length]);
  
  const goToNext = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === projects.length - 1 ? 0 : prevIndex + 1);
  }, [projects.length]);

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

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto mb-16 px-2 sm:px-4 md:px-0">
        <div className="relative overflow-hidden rounded-xl bg-black/20 border border-purple-500/20 p-4">
          <div className="h-60 md:h-80 flex justify-center items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto mb-16 px-2 sm:px-4 md:px-0">
      <div className="relative overflow-hidden rounded-xl bg-black/20 border border-purple-500/20 p-4 md:p-6">
        <div className="mb-6 flex justify-between items-center">
          <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
            Project Gallery
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Visual showcase of my projects. Swipe or use arrows to browse. Click any image to learn more.
          </p>
          </div>
          
          {/* Autoplay toggle button */}
          {projects.length > 1 && (
            <button
              onClick={toggleAutoplay}
              className="flex items-center gap-2 px-3 py-2 bg-black/50 rounded-lg border border-purple-500/30 hover:bg-black/70 transition-colors"
              aria-label={isAutoplayEnabled ? "Switch to manual slideshow" : "Switch to automatic slideshow"}
            >
              {isAutoplayEnabled ? (
                <>
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-purple-300 hidden sm:inline">Auto</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-purple-300 hidden sm:inline">Manual</span>
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Enlarged Image Overlay */}
        {enlargedImage && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-10"
            onClick={() => setEnlargedImage(null)}
          >
            <div className="relative max-w-7xl w-full h-[80vh] rounded-xl overflow-hidden">
              <div 
                className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-black/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setEnlargedImage(null);
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <div className="h-full w-full relative" onClick={(e) => e.stopPropagation()}>
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-black/5 z-10"></div>
                    <Image 
                      src={enlargedImage.image} 
                      alt={projects.find(p => p.id === enlargedImage.projectId)?.title || ''}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 1200px"
                      className="object-contain transition-transform duration-500"
                      priority={true}
                      quality={100}
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        WebkitPerspective: 1000, 
                        WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                        transform: 'translateZ(0)'
                      }}
                      unoptimized={enlargedImage.image.startsWith('data:')}
                    />
                  
                  {/* Gradient overlay for text readability */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                </div>
                
                {/* Toggle between images - ALWAYS VISIBLE */}
                {projects.find(p => p.id === enlargedImage.projectId)?.secondImage && (
                  <div className="absolute top-4 left-4 z-10">
                    <button 
                      className="bg-purple-600/90 hover:bg-purple-600 text-white p-2.5 rounded-lg shadow-lg transition-colors flex items-center gap-2 border border-purple-400/30"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Enlarged image switch view button clicked');
                        const project = projects.find(p => p.id === enlargedImage.projectId);
                        if (project && project.secondImage) {
                          // Check if current enlarged image is primary or secondary
                          if (enlargedImage.image === project.image) {
                            // Switch to secondary
                            setEnlargedImage({
                              projectId: enlargedImage.projectId,
                              image: project.secondImage
                            });
                          } else {
                            // Switch to primary
                            setEnlargedImage({
                              projectId: enlargedImage.projectId, 
                              image: project.image
                            });
                          }
                        }
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      <span className="text-xs font-medium">Switch View</span>
                    </button>
                  </div>
                )}
                
                {/* Project details overlay on enlarged image */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">
                      {projects.find(p => p.id === enlargedImage.projectId)?.title || ''}
                    </h3>
                  <p className="text-sm text-gray-300 mb-1 line-clamp-2">
                    {projects.find(p => p.id === enlargedImage.projectId)?.description}
                  </p>
                  <p className="text-xs text-purple-300">
                    {enlargedImage.image === projects.find(p => p.id === enlargedImage.projectId)?.image ? 
                      'Primary View' : 'Secondary View'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Main Carousel */}
        <div 
          ref={carouselRef} 
          className="relative rounded-xl overflow-hidden will-change-transform"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel container */}
          <div className="relative aspect-[16/9] sm:aspect-[16/8] rounded-lg overflow-hidden border-2 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.3)] transform-gpu">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0 cursor-pointer overflow-hidden transform-gpu"
                onClick={() => handleImageClick(projects[currentIndex].id)}
                onMouseEnter={() => setHoveredProject(projects[currentIndex].id)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                {projects[currentIndex].secondImage && projects[currentIndex].showBothImagesInPriority ? (
                  <div className="flex h-full w-full">
                    <div className="w-1/2 relative h-full border-r border-purple-500/20 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-black/5 z-10"></div>
                      <Image 
                        src={projects[currentIndex].image} 
                        alt={projects[currentIndex].title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 35vw, 600px"
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.02] transform-gpu"
                        priority={true}
                        quality={85}
                        onClick={(e) => handleImageEnlarge(e, projects[currentIndex].id, projects[currentIndex].image)}
                        style={{ 
                          WebkitBackfaceVisibility: 'hidden', 
                          WebkitPerspective: 1000, 
                          WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                          objectFit: 'contain',
                          transform: 'translateZ(0)',
                          willChange: 'transform'
                        }}
                        unoptimized={projects[currentIndex].image.startsWith('data:')}
                      />
                      
                      {/* Image info overlay on hover - with improved performance */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 transform-gpu">
                        <h4 className="text-white font-semibold text-lg">{projects[currentIndex].title} - Primary</h4>
                        <p className="text-gray-300 text-sm line-clamp-1">{projects[currentIndex].description}</p>
                      </div>
                      
                      {/* Primary label */}
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-md z-20">
                        Primary
                      </div>
                    </div>
                    <div className="w-1/2 relative h-full group">
                      {/* Similar optimizations for second image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-black/5 z-10"></div>
                      <Image 
                        src={projects[currentIndex].secondImage || ''} 
                        alt={`${projects[currentIndex].title} - alternate view`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 35vw, 600px"
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.02] transform-gpu"
                        priority={true}
                        quality={85}
                        onClick={(e) => handleImageEnlarge(e, projects[currentIndex].id, projects[currentIndex].secondImage || '')}
                        style={{ 
                          WebkitBackfaceVisibility: 'hidden', 
                          WebkitPerspective: 1000, 
                          WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                          objectFit: 'contain',
                          transform: 'translateZ(0)',
                          willChange: 'transform'
                        }}
                        unoptimized={projects[currentIndex].secondImage?.startsWith('data:')}
                      />
                      
                      {/* Image info overlay with improved performance */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 transform-gpu">
                        <h4 className="text-white font-semibold text-lg">{projects[currentIndex].title} - Secondary</h4>
                        <p className="text-gray-300 text-sm line-clamp-1">{projects[currentIndex].description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative h-full w-full group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/5 to-black/5 z-10"></div>
                    <Image 
                      src={projects[currentIndex].image} 
                      alt={projects[currentIndex].title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 1200px"
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.01] transform-gpu"
                      priority={true}
                      quality={85}
                      onClick={(e) => handleImageEnlarge(e, projects[currentIndex].id, projects[currentIndex].image)}
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        WebkitPerspective: 1000, 
                        WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                        objectFit: 'contain',
                        transform: 'translateZ(0)',
                        willChange: 'transform'
                      }}
                      unoptimized={projects[currentIndex].image.startsWith('data:')}
                    />
                    
                    {/* Optimized gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20 transform-gpu">
                      <h3 className="text-white font-bold text-xl sm:text-2xl">{projects[currentIndex].title}</h3>
                      <p className="text-gray-300 text-sm sm:text-base line-clamp-2 mt-1 max-w-3xl">{projects[currentIndex].description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {projects[currentIndex].technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="px-2 py-1 bg-purple-500/30 text-white text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                        {projects[currentIndex].technologies.length > 3 && (
                          <span className="px-2 py-1 bg-purple-500/20 text-white text-xs rounded-full">
                            +{projects[currentIndex].technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Optimized navigation dots */}
          {projects.length > 1 && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-1.5 max-w-full py-2 will-change-transform">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 transform-gpu ${
                    index === currentIndex 
                      ? 'bg-white scale-110' 
                      : 'bg-white/30 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Optimized navigation arrows */}
          {projects.length > 1 && (
            <>
              <button 
                className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-30 transform-gpu"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-30 transform-gpu"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                aria-label="Next slide"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Project Info Card */}
        <div className="mt-12 p-4 md:p-6 bg-gradient-to-br from-gray-900/80 to-black/80 border border-purple-500/20 rounded-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
            <div>
            <h3 className="text-lg md:text-xl font-semibold text-white">Current Project: {projects[currentIndex].title}</h3>
              {projects[currentIndex].secondImage && (
                <p className="text-xs text-purple-300 mt-1">This project has multiple views available</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleImageClick(projects[currentIndex].id)}
                className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
              >
                View Details
              </button>
              <a
                href={projects[currentIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-transparent border border-purple-500/50 text-purple-300 text-sm rounded-md hover:bg-purple-500/10 transition-colors"
              >
                Live Preview
              </a>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-4 line-clamp-2 md:line-clamp-none">
            {projects[currentIndex].description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {projects[currentIndex].technologies.map((tech, index) => (
              <span 
                key={index} 
                className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
              >
                {tech}
              </span>
            ))}
          </div>
          
          {/* Agency info & upcoming projects section */}
          <div className="mt-6 pt-6 border-t border-purple-500/20 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md text-purple-300 font-medium mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Why Choose NEX-DEVS
              </h4>
              <p className="text-xs text-gray-400 mb-2">
                At NEX-DEVS, we combine technical expertise with creative innovation to deliver cutting-edge solutions that transform businesses and user experiences.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 bg-purple-900/20 text-purple-300 text-[10px] rounded border border-purple-500/20">
                  Expert Development
                </span>
                <span className="px-2 py-0.5 bg-purple-900/20 text-purple-300 text-[10px] rounded border border-purple-500/20">
                  Modern Tech Stack
                </span>
                <span className="px-2 py-0.5 bg-purple-900/20 text-purple-300 text-[10px] rounded border border-purple-500/20">
                  Creative Solutions
                </span>
                <span className="px-2 py-0.5 bg-purple-900/20 text-purple-300 text-[10px] rounded border border-purple-500/20">
                  Client-Focused
                </span>
              </div>
            </div>
            
            <div>
              <h4 className="text-md text-blue-300 font-medium mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Upcoming Projects
              </h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  <p className="text-xs text-gray-300">AI-Enhanced Portfolio Builder <span className="text-blue-400 text-[10px]">86% Complete</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <p className="text-xs text-gray-300">Web3 Integration Framework <span className="text-green-400 text-[10px]">Coming Soon</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                  <p className="text-xs text-gray-300">Cross-Platform Mobile Solutions <span className="text-yellow-400 text-[10px]">In Planning</span></p>
                </div>
              </div>
              <div className="mt-2">
                <Link href="/contact" className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
                  Discuss a custom project →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Show error message if database load failed */}
      {fetchError && !isLoading && projects.length === 0 && (
        <div className="mt-4 p-3 bg-red-500/20 text-red-200 rounded-lg text-sm border border-red-500/30">
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {fetchError}
          </p>
          <p className="text-xs mt-1 text-gray-300">Please refresh the page to try again.</p>
        </div>
      )}
      
      {/* Last fetch time indicator for debugging */}
      {lastFetchTime && (
        <div className="hidden">
          Last fetch: {new Date(lastFetchTime).toLocaleTimeString()}
        </div>
      )}
    </section>
  )
} 