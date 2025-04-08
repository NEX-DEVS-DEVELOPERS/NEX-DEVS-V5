'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
  
  // Add state for carousel with memoized values
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0)
  const [bannerProjects, setBannerProjects] = useState<Project[]>([])
  
  // Add refs for carousel optimization
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartXRef = useRef<number | null>(null)

  // Fetch all projects with caching using useMemo
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchProjects = async () => {
      try {
        // Use cache headers for better performance
        const response = await fetch('/api/projects', {
          signal: controller.signal,
          next: { revalidate: 300 } // Cache for 5 minutes
        })
        
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json()
        
        // Filter projects that have valid images
        const projectsWithImages = data.filter((project: Project) => 
          project.image && 
          !project.image.includes('placeholder')
        )
        
        // Sort projects by image priority - use stable sort for better performance
        const sortedProjects = [...projectsWithImages].sort((a: Project, b: Project) => {
          // Handle numeric priority (this is the primary way to sort)
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
        
        // Find all projects with priority 1 for the banner carousel
        const priority1Projects = sortedProjects.filter(
          (p: Project) => typeof p.imagePriority === 'number' && p.imagePriority === 1
        );
        
        setBannerProjects(priority1Projects);
        setProjects(sortedProjects)
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          // Ignore abort errors
          return;
        }
        console.error('Error fetching projects for gallery:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
    
    return () => {
      controller.abort();
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    }
  }, [])

  // Memoize non-carousel projects for better performance
  const regularProjects = useMemo(() => {
    return projects.filter(project => 
      !(typeof project.imagePriority === 'number' && project.imagePriority === 1)
    );
  }, [projects]);

  // Use requestAnimationFrame for smoother carousel animation
  useEffect(() => {
    if (bannerProjects.length <= 1) return;
    
    const startAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      
      autoplayRef.current = setInterval(() => {
        setCurrentBannerIndex(prevIndex => 
          prevIndex === bannerProjects.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Rotate every 5 seconds
    };
    
    startAutoplay();
    
    // Pause carousel on tab/window inactive to save resources
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
          autoplayRef.current = null;
        }
      } else {
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
  }, [bannerProjects.length]);

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

  // Handle banner navigation with debounce for better performance
  const goToBanner = useCallback((index: number) => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    
    setCurrentBannerIndex(index);
    
    // Restart autoplay after 10 seconds of user inactivity
    autoplayRef.current = setTimeout(() => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
        autoplayRef.current = setInterval(() => {
          setCurrentBannerIndex(prevIndex => 
            prevIndex === bannerProjects.length - 1 ? 0 : prevIndex + 1
          );
        }, 5000);
      }
    }, 10000);
  }, [bannerProjects.length]);

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
        setCurrentBannerIndex(prev => 
          prev === bannerProjects.length - 1 ? 0 : prev + 1
        );
      } else {
        // Swipe right - go to previous
        setCurrentBannerIndex(prev => 
          prev === 0 ? bannerProjects.length - 1 : prev - 1
        );
      }
    }
    
    touchStartXRef.current = null;
  }, [bannerProjects.length]);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto mb-16">
        <div className="relative overflow-hidden rounded-xl bg-black/20 border border-purple-500/20 p-4">
          <div className="h-40 flex justify-center items-center">
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
    <section className="max-w-7xl mx-auto mb-16 px-4 md:px-0">
      <div className="relative overflow-hidden rounded-xl bg-black/20 border border-purple-500/20 p-4 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
            Project Gallery
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Visual showcase of my projects. Click any image to learn more.
          </p>
        </div>
        
        {/* Enlarged Image Overlay */}
        {enlargedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setEnlargedImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full">
              <button 
                className="absolute -top-12 right-0 text-white hover:text-purple-300 transition-colors"
                onClick={() => setEnlargedImage(null)}
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative w-full" style={{ height: 'calc(90vh - 48px)' }}>
                <Image 
                  src={enlargedImage.image} 
                  alt="Enlarged project view"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  quality={95}
                  priority
                />
              </div>
              {/* Project with the enlarged image */}
              {projects.find(p => p.id === enlargedImage.projectId)?.secondImage && (
                <div className="absolute bottom-4 right-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const project = projects.find(p => p.id === enlargedImage.projectId);
                      if (project && project.secondImage) {
                        // If current enlarged image is the main image, switch to second image
                        if (enlargedImage.image === project.image) {
                          setEnlargedImage({
                            projectId: enlargedImage.projectId,
                            image: project.secondImage
                          });
                        } else {
                          // Otherwise switch back to main image
                          setEnlargedImage({
                            projectId: enlargedImage.projectId,
                            image: project.image
                          });
                        }
                      }
                    }}
                    className="px-3 py-2 bg-purple-600/80 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Switch View
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Featured Projects Carousel Banner */}
        {bannerProjects.length > 0 && (
          <div className="mb-8">
            {/* Carousel Container */}
            <div 
              ref={carouselRef} 
              className="relative aspect-[16/9] sm:aspect-[16/9] rounded-lg overflow-hidden border-2 border-purple-500/50 shadow-[0_0_20px_rgba(147,51,234,0.3)]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Show the current banner project */}
              {bannerProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className={`absolute inset-0 will-change-transform transition-all duration-700 ${
                    index === currentBannerIndex ? 'opacity-100 z-10 translate-x-0' : 
                    index < currentBannerIndex ? 'opacity-0 -translate-x-full z-0' : 'opacity-0 translate-x-full z-0'
                  } cursor-pointer`}
                  onClick={() => handleImageClick(project.id)}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{ 
                    transform: `translateX(${index === currentBannerIndex ? 0 : index < currentBannerIndex ? -100 : 100}%)`,
                    WebkitBackfaceVisibility: 'hidden', 
                    backfaceVisibility: 'hidden',
                    perspective: 1000
                  }}
                >
                  {project.secondImage && project.showBothImagesInPriority ? (
                    <div className="flex h-full w-full">
                      <div className="w-1/2 relative h-full">
                        <Image 
                          src={project.image} 
                          alt={project.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 35vw, 600px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority={index === currentBannerIndex}
                          quality={index === currentBannerIndex ? 95 : 70}
                          loading={index === currentBannerIndex ? 'eager' : 'lazy'}
                          fetchPriority={index === currentBannerIndex ? 'high' : 'low'}
                          onClick={(e) => handleImageEnlarge(e, project.id, project.image)}
                        />
                      </div>
                      <div className="w-1/2 relative h-full">
                        <Image 
                          src={project.secondImage} 
                          alt={`${project.title} - alternate view`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 40vw, (max-width: 1024px) 35vw, 600px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority={index === currentBannerIndex}
                          quality={index === currentBannerIndex ? 95 : 70}
                          loading={index === currentBannerIndex ? 'eager' : 'lazy'}
                          fetchPriority={index === currentBannerIndex ? 'high' : 'low'}
                          onClick={(e) => handleImageEnlarge(e, project.id, project.secondImage || '')}
                        />
                      </div>
                      
                      {/* Enlarge indicator */}
                      {index === currentBannerIndex && (
                        <div 
                          className={`absolute top-4 left-4 transition-opacity duration-200 ${
                            hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div className="bg-black/60 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-md flex items-center gap-2 shadow-lg">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v5m4-2h-4" />
                            </svg>
                            <span>Click to enlarge</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative h-full w-full">
                      <Image 
                        src={project.image} 
                        alt={project.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 1200px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority={index === currentBannerIndex || index === ((currentBannerIndex + 1) % bannerProjects.length)}
                        quality={index === currentBannerIndex ? 95 : 70}
                        loading={index === currentBannerIndex || index === ((currentBannerIndex + 1) % bannerProjects.length) ? 'eager' : 'lazy'}
                        fetchPriority={index === currentBannerIndex ? 'high' : 'low'}
                        onClick={(e) => handleImageEnlarge(e, project.id, project.image)}
                      />
                      
                      {/* Display Switch Image button when hovered */}
                      {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && !project.showBothImagesInPriority && (
                        <div 
                          className={`absolute bottom-4 right-4 transition-opacity duration-200 ${
                            hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <button
                            onClick={(e) => handleSwitchImage(e, project.id)}
                            className="bg-purple-600/70 hover:bg-purple-600 text-white p-2 rounded-lg transition-colors flex items-center gap-2"
                            aria-label="Switch image"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            <span className="text-xs font-medium">Switch View</span>
                          </button>
                        </div>
                      )}
                      
                      {/* Enlarge indicator */}
                      {index === currentBannerIndex && (
                        <div 
                          className={`absolute top-4 left-4 transition-opacity duration-200 ${
                            hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <div className="bg-black/60 backdrop-blur-sm text-white text-xs py-1.5 px-3 rounded-md flex items-center gap-2 shadow-lg">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v5m4-2h-4" />
                            </svg>
                            <span>Click to enlarge</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Overlay with project title on hover */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-4 md:p-6 lg:p-8 transition-opacity duration-300 ${
                      hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="max-w-3xl">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white">
                        {project.title}
                      </h3>
                      <p className="text-sm md:text-base text-purple-300">
                        {project.category}
                      </p>
                      <div className="mt-2 md:mt-3 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-500/30 text-white text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Priority badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-full border border-purple-400/30 shadow-lg">
                    Top Featured
                  </div>
                </div>
              ))}
              
              {/* Navigation Dots (only if more than one banner project) */}
              {bannerProjects.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {bannerProjects.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToBanner(index);
                      }}
                      className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                        index === currentBannerIndex 
                          ? 'bg-white scale-110' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              
              {/* Navigation Arrows (only if more than one banner project) */}
              {bannerProjects.length > 1 && (
                <>
                  <button 
                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentBannerIndex(prev => 
                        prev === 0 ? bannerProjects.length - 1 : prev - 1
                      );
                    }}
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentBannerIndex(prev => 
                        prev === bannerProjects.length - 1 ? 0 : prev + 1
                      );
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
          </div>
        )}
        
        {/* Regular Grid - Skip all banner projects (priority 1) - Use CSS Grid for better responsive layout */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-4">
          {regularProjects.map((project) => (
            <div 
              key={project.id}
              className={`relative aspect-square rounded-lg overflow-hidden border ${
                (typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                (typeof project.imagePriority === 'number' && project.imagePriority <= 3) 
                  ? 'border-purple-500/50 shadow-[0_0_15px_rgba(147,51,234,0.2)]' 
                  : 'border-purple-500/30'
              } group cursor-pointer transform transition-all duration-300 hover:-translate-y-1 will-change-transform`}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => handleImageClick(project.id)}
            >
              {project.secondImage && project.showBothImagesInPriority ? (
                <div className="flex h-full w-full">
                  <div className="w-1/2 relative h-full">
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12.5vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading={
                        (typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                        (typeof project.imagePriority === 'number' && project.imagePriority <= 3) 
                          ? 'eager' 
                          : 'lazy'
                      }
                      quality={
                        (typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                        (typeof project.imagePriority === 'number' && project.imagePriority <= 3) 
                          ? 85 
                          : 75
                      }
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${btoa(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="#18181B"/>
                        </svg>`
                      )}`}
                      onClick={(e) => handleImageEnlarge(e, project.id, project.image)}
                    />
                  </div>
                  <div className="w-1/2 relative h-full">
                    <Image 
                      src={project.secondImage} 
                      alt={`${project.title} - secondary view`}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12.5vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      loading={
                        (typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                        (typeof project.imagePriority === 'number' && project.imagePriority <= 3) 
                          ? 'eager' 
                          : 'lazy'
                      }
                      quality={
                        (typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                        (typeof project.imagePriority === 'number' && project.imagePriority <= 3) 
                          ? 85 
                          : 75
                      }
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${btoa(
                        `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="#18181B"/>
                        </svg>`
                      )}`}
                      onClick={(e) => handleImageEnlarge(e, project.id, project.secondImage || '')}
                    />
                  </div>
                  
                  {/* Enlarge indicator */}
                  <div 
                    className={`absolute top-2 left-2 transition-opacity duration-200 ${
                      hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="bg-black/60 text-white text-[10px] p-1 rounded-md flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v5m4-2h-4" />
                      </svg>
                      <span>Tap to enlarge</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading={
                      (typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                      (typeof project.imagePriority === 'number' && project.imagePriority <= 3) 
                        ? 'eager' 
                        : 'lazy'
                    }
                    quality={
                      (typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                      (typeof project.imagePriority === 'number' && project.imagePriority <= 3) 
                        ? 85 
                        : 75
                    }
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${btoa(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                        <rect width="100" height="100" fill="#18181B"/>
                      </svg>`
                    )}`}
                    onClick={(e) => handleImageEnlarge(e, project.id, project.image)}
                  />
                  
                  {/* Display Switch Image button when hovered */}
                  {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && !project.showBothImagesInPriority && (
                    <div 
                      className={`absolute bottom-2 right-2 transition-opacity duration-200 ${
                        hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <button
                        onClick={(e) => handleSwitchImage(e, project.id)}
                        className="bg-purple-600/70 hover:bg-purple-600 text-white p-1.5 rounded-full transition-colors"
                        aria-label="Switch image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Enlarge indicator */}
                  <div 
                    className={`absolute top-2 left-2 transition-opacity duration-200 ${
                      hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="bg-black/60 text-white text-[10px] p-1 rounded-md flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v5m4-2h-4" />
                      </svg>
                      <span>Tap to enlarge</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Overlay with project title on hover - Optimized for better performance */}
              <div 
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-3 transition-opacity duration-200 ${
                  hoveredProject === project.id ? 'opacity-100' : 'md:opacity-0 opacity-100'
                }`}
              >
                <div>
                  <h3 className="text-white text-xs md:text-base font-medium line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-purple-300 text-[10px] md:text-xs mt-1">
                    {project.category}
                  </p>
                </div>
              </div>
              
              {/* Priority badge for high priority images */}
              {((typeof project.imagePriority === 'boolean' && project.imagePriority === true) || 
                (typeof project.imagePriority === 'number' && project.imagePriority <= 3)) && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-purple-600/80 text-white text-[10px] rounded-full">
                  Priority
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 