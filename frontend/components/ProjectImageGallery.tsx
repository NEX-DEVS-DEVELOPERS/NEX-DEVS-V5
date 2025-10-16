'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CodeHighlighter from './CodeHighlighter'
import { audiowide } from '@/frontend/utils/fonts'

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  secondImage?: string
  category: string
  technologies: string[]
  link?: string
  project_link?: string
  featured: boolean
  status?: string
  updatedDays?: number
  progress?: number
  features?: string[]
  imagePriority?: boolean | number
  showBothImagesInPriority?: boolean
  showcase_location?: string
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
        
        // Filter projects that have valid images - now include AI projects
        const projectsWithImages = data.filter((project: Project) => 
          project.image && 
          !project.image.includes('placeholder') &&
          // Include both web development and AI projects, exclude only mobile
          project.category !== 'Mobile Applications & Experiences' &&
          project.showcase_location !== 'mobile_showcase'
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

  // Manual refresh function
  const handleManualRefresh = useCallback(() => {
    setIsLoading(true);
    setFetchError(null);
    
    // Clear cache to force fresh data
    projectsCache.current = null;
    
    // Fetch fresh projects data
    const fetchFreshData = async () => {
      try {
        const timestamp = new Date().getTime();
        const randomValue = Math.floor(Math.random() * 10000000);
        const cache = `nocache=${timestamp}-${randomValue}`;
        
        console.log(`[ProjectImageGallery] Manual refresh at timestamp: ${timestamp}`);
        
        const response = await fetch(`/api/projects?t=${timestamp}&r=${randomValue}&${cache}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Force-Refresh': 'true',
            'X-Random-Value': randomValue.toString()
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Filter and sort projects
        // Exclude projects that belong to dedicated showcase sections
        const projectsWithImages = data.filter((project: Project) => 
          project.image && 
          !project.image.includes('placeholder') &&
          // Exclude projects that belong to AI Solutions showcase
          project.category !== 'Intelligent Systems & AI Solutions' &&
          project.showcase_location !== 'ai_solutions' &&
          // Exclude projects that belong to Mobile Applications showcase
          project.category !== 'Mobile Applications & Experiences' &&
          project.showcase_location !== 'mobile_showcase'
        );
        
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
          timestamp
        };
        
        setProjects(sortedProjects);
        setLastFetchTime(timestamp);
        setCurrentIndex(0); // Reset to first project
      } catch (error) {
        console.error('Error fetching projects during manual refresh:', error);
        setFetchError(error instanceof Error ? error.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFreshData();
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

  // Handle image click to show enlarged view
  const handleImageClick = useCallback((projectId: number, imageSource?: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    // If imageSource is provided, use it directly
    if (imageSource) {
      setEnlargedImage({
        projectId,
        image: imageSource
      });
      return;
    }
    
    // Otherwise use the primary image
    setEnlargedImage({
      projectId,
      image: project.image
    });
  }, [projects]);

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
    if (projects.length <= 1) return;
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  }, [projects.length]);
  
  const goToNext = useCallback(() => {
    if (projects.length <= 1) return;
    setCurrentIndex(prevIndex => 
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
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
        <div className="relative overflow-hidden rounded-xl bg-black border border-purple-500/20 p-4">
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
    <section className="max-w-7xl mx-auto mb-16 px-4 md:px-6">
      {/* Gallery Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
          <h2 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 ${audiowide.className}`}>
            NEX-WEBS SPECIALITY
          </h2>
          <p className="text-gray-400 text-lg">Explore web development projects and Intelligent Systems & AI Solutions</p>
        </div>
              </div>
              
      {/* Main Gallery */}
      <div className="relative overflow-hidden rounded-2xl bg-black border border-purple-500/20 p-4 md:p-6">
        {/* Decorative elements - Removed for consistency */}
                
        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="flex space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Main carousel */}
        <div 
          ref={carouselRef} 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
              {projects.map((project, index) => (
                <div 
                  key={`project-${project.id}-${index}`}
                  className="w-full flex-shrink-0"
                >
                  <div className="flex flex-col space-y-6">
                    {/* Project Image Section */}
                    <div className="relative aspect-[16/9] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden group">
                      {/* Main Image */}
                      <div className="relative w-full h-full transform transition-all duration-700 group-hover:scale-105">
                      <Image 
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          priority={typeof project.imagePriority === 'boolean' ? project.imagePriority : false}
                          sizes="(max-width: 1280px) 100vw, 1280px"
                          quality={95}
                        />
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex items-start justify-between">
                            <div>
                              {project.category && (
                                <span className="bg-purple-600/90 text-white text-sm px-3 py-1 rounded-full mb-3 inline-block">
                                  {project.category}
                                </span>
                              )}
                              <h3 className="text-2xl font-bold text-white mt-2">{project.title}</h3>
                            </div>
                            <div className="flex space-x-2">
                              {project.secondImage && (
                                <button
                                  onClick={(e) => handleSwitchImage(e, project.id)}
                                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg transition-colors border border-white/10"
                                  title="Switch Image"
                                >
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={(e) => handleImageEnlarge(e, project.id, project.image)}
                                className="bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg transition-colors border border-white/10"
                                title="View Fullsize"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Project Details Section */}
                    <div className="max-w-4xl mx-auto w-full">
                      <div className="bg-black rounded-xl border border-purple-500/10 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                          {/* Left Column - Status & Progress */}
                          <div className="lg:col-span-4 space-y-4">
                            {project.status && (
                              <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  project.status === 'In Development' 
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                                    : project.status === 'Completed'
                                      ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                  {project.status}
                                  {project.updatedDays && project.updatedDays < 7 && (
                                    <span className="ml-2 flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                            {project.progress !== undefined && (
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-400">Project Progress</span>
                                  <span className="text-sm text-purple-300">{typeof project.progress === 'number' ? project.progress.toFixed(1) : '0'}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500" 
                                    style={{ width: `${typeof project.progress === 'number' ? project.progress : 0}%` }}
                                  />
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                  Last updated: {project.updatedDays ? `${project.updatedDays} days ago` : 'Recently'}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Middle Column - Technologies & Description */}
                          <div className="lg:col-span-5 space-y-4">
                            <div>
                              <h4 className="text-sm text-purple-300 mb-2 font-medium">Project Overview</h4>
                              <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
                            </div>
                            <div>
                              <h4 className="text-sm text-purple-300 mb-2 font-medium">Technologies Used:</h4>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(project.technologies) ? (
                                  project.technologies.map((tech, techIndex) => (
                                    <span 
                                      key={`tech-${project.id}-${techIndex}`}
                                      className="bg-gray-800/80 border border-purple-500/10 text-gray-300 px-3 py-1.5 rounded-lg text-sm"
                                    >
                                      {tech}
                                    </span>
                                  ))
                                ) : (
                                  <span className="bg-gray-800/80 border border-purple-500/10 text-gray-300 px-3 py-1.5 rounded-lg text-sm">
                                    {project.technologies}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Actions */}
                          <div className="lg:col-span-3 flex flex-col justify-center space-y-3">
                            <a
                              href={project.link || project.project_link || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>View Project</span>
                            </a>
                            <button
                              onClick={() => setCurrentIndex(index)}
                              className="inline-flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>View Details</span>
                            </button>
                      </div>
                    </div>
                  </div>

                      {/* Related Projects Section */}
                      <div className="mt-6 bg-black rounded-xl border border-purple-500/10 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                          </svg>
                          Related Projects
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {projects
                            .filter(p => p.id !== project.id && p.category === project.category)
                            .slice(0, 3)
                            .map((relatedProject) => (
                              <div 
                                key={`related-${relatedProject.id}`}
                                className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-[1.02]"
                                onClick={() => setCurrentIndex(projects.findIndex(p => p.id === relatedProject.id))}
                              >
                                <Image
                                  src={relatedProject.image}
                                  alt={relatedProject.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h5 className="text-white font-medium text-sm mb-2">{relatedProject.title}</h5>
                                    {relatedProject.progress !== undefined && (
                                      <div className="flex items-center space-x-2">
                                        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                                            style={{ width: `${typeof relatedProject.progress === 'number' ? relatedProject.progress : 0}%` }}
                                          />
                                        </div>
                                        <span className="text-xs font-medium text-purple-300 bg-black px-2 py-1 rounded-full">
                                          {typeof relatedProject.progress === 'number' ? `${Math.round(relatedProject.progress)}%` : '0%'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
          </div>
              ))}
            </div>
          
            {/* Navigation Controls */}
          {projects.length > 1 && (
            <>
              <div className="absolute left-4 top-1/3 -translate-y-1/2 flex flex-col gap-2 z-10">
                <button 
                  onClick={goToPrevious}
                  className="bg-black hover:bg-black text-white p-3 rounded-full transition-all duration-300 border border-white/10 hover:border-purple-500/40 hover:scale-105"
                  aria-label="Previous project"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={toggleAutoplay}
                  className={`bg-black hover:bg-black text-white p-3 rounded-full transition-all duration-300 border ${
                    isAutoplayEnabled ? 'border-purple-500/40' : 'border-white/10'
                  } hover:border-purple-500/40 hover:scale-105`}
                  aria-label={isAutoplayEnabled ? 'Pause slideshow' : 'Play slideshow'}
                >
                  {isAutoplayEnabled ? (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </button>
              </div>

              <button 
                onClick={goToNext}
                className="absolute right-4 top-1/3 -translate-y-1/2 bg-black hover:bg-black text-white p-3 rounded-full z-10 transition-all duration-300 border border-white/10 hover:border-purple-500/40 hover:scale-105"
                aria-label="Next project"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

            {/* Enhanced Pagination with Numbers */}
            {projects.length > 1 && (
              <div className="flex justify-center items-center mt-6 space-x-3">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentIndex(currentIndex === 0 ? projects.length - 1 : currentIndex - 1)}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
                  aria-label="Previous project"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-2">
                  {projects.map((_, index) => {
                    const isActive = currentIndex === index;
                    const showNumber = projects.length <= 8 || 
                                     index === 0 || 
                                     index === projects.length - 1 || 
                                     Math.abs(index - currentIndex) <= 2;
                    
                    if (!showNumber && index !== 1 && index !== projects.length - 2) {
                      // Show ellipsis for gaps
                      if (index === Math.floor(projects.length / 2) && currentIndex < 3) {
                        return (
                          <span key={`ellipsis-${index}`} className="text-gray-500 px-1">...</span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <button
                        key={`page-${index}`}
                        onClick={() => setCurrentIndex(index)}
                        className={`min-w-[2.5rem] h-10 rounded-lg font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25' 
                            : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white'
                        }`}
                        aria-label={`Go to project ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>
                
                {/* Next Button */}
                <button
                  onClick={() => setCurrentIndex(currentIndex === projects.length - 1 ? 0 : currentIndex + 1)}
                  className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 text-gray-300 hover:text-white transition-all duration-200"
                  aria-label="Next project"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Project Counter */}
                <div className="ml-4 text-sm text-gray-400">
                  {currentIndex + 1} of {projects.length}
                </div>
              </div>
            )}
          </div>
        )}
          </div>
          
      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEnlargedImage(null);
              }}
              className="absolute -top-14 right-0 bg-black hover:bg-gray-900 text-white p-2.5 rounded-full z-10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={enlargedImage.image}
                alt="Enlarged project image"
                width={1920}
                height={1080}
                className="max-h-[90vh] w-auto object-contain rounded-lg shadow-2xl"
                quality={100}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
} 