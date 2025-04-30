'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Update the slider styles at the top of the file
const sliderStyles = `
  .projects-slider {
    scrollbar-width: thin;
    scrollbar-color: rgba(147, 51, 234, 0.5) rgba(0, 0, 0, 0.2);
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
  }
  .projects-slider::-webkit-scrollbar {
    height: 8px;
  }
  .projects-slider::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  .projects-slider::-webkit-scrollbar-thumb {
    background: rgba(147, 51, 234, 0.5);
    border-radius: 4px;
  }
  .projects-slider::-webkit-scrollbar-thumb:hover {
    background: rgba(147, 51, 234, 0.7);
  }
  .project-card {
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: transform;
    contain: content;
  }
  .project-card img {
    transform: translateZ(0);
    backface-visibility: hidden;
    will-change: transform;
  }
`

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image?: string
  image_url?: string
  secondImage?: string
  second_image?: string
  category: string
  technologies: string[]
  link?: string
  project_link?: string
  featured: boolean
  status?: string
  updatedDays?: number
  updated_days?: number
  progress?: number
  developmentProgress?: number
  development_progress?: number
  features?: string[]
  showBothImagesInPriority?: boolean
  show_both_images_in_priority?: boolean
  visual_effects?: any
  visualEffects?: any
}

// Add a helper function to normalize project data for rendering
const normalizeProjectForRender = (project: Project): Project => {
  return {
    ...project,
    // Ensure all fields use the camelCase version for rendering
    image: project.image || project.image_url || '/placeholder-image.jpg',
    secondImage: project.secondImage || project.second_image || undefined,
    link: project.link || project.project_link || '#',
    updatedDays: project.updatedDays || project.updated_days || 0,
    developmentProgress: project.developmentProgress || project.development_progress || 0,
    showBothImagesInPriority: project.showBothImagesInPriority || project.show_both_images_in_priority || false,
    visualEffects: project.visualEffects || project.visual_effects || {},
    // Ensure technologies is always an array
    technologies: Array.isArray(project.technologies) ? project.technologies : []
  };
};

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const [isLoading, setIsLoading] = useState(true)
  const [easterEggCount, setEasterEggCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const timestamp = new Date().getTime();
        const randomValue = Math.floor(Math.random() * 10000000);
        const cache = `nocache=${timestamp}-${randomValue}`;
        
        const categoryParam = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
        const apiUrl = `/api/projects?t=${timestamp}&r=${randomValue}${categoryParam}&${cache}`;
        
        console.log(`Fetching projects from: ${apiUrl}`);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
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
          const errorText = await response.text().catch(() => 'Could not read error response');
          throw new Error(`Server returned ${response.status}: ${response.statusText}. Details: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('API did not return an array of projects');
        }
        
        console.log(`Received ${data.length} projects from API`);
        
        const normalizedData = data.map(normalizeProjectForRender);
        
        const regularProjects = normalizedData.filter((project: Project) => 
          !project.title.startsWith('NEWLY ADDED:')
        );
        
        setProjects(regularProjects);
        
        const projectCategories = ['All', ...Array.from(new Set(normalizedData.map((project: Project) => project.category)) as Set<string>)];
        setCategories(projectCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError((error as Error).message);
        setProjects([]);
        setIsLoading(false);
        
        // Fetch debug info when there's an error
        fetchDebugInfo();
      }
    };

    fetchProjects();
    
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchProjects();
      }
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [selectedCategory]);

  // Function to fetch debug information
  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug');
      if (response.ok) {
        const data = await response.json();
        setDebugInfo(data);
        console.log('Debug info:', data);
      }
    } catch (e) {
      console.error('Error fetching debug info:', e);
    }
  };

  // Add manual refresh function for admins
  const handleManualRefresh = () => {
    setIsLoading(true);
    // Force revalidation
    fetch('/api/revalidate?path=/projects&secret=admin-access')
      .then(() => {
        // Wait a moment for revalidation to complete
        setTimeout(() => {
          // Force reload the current page
          window.location.reload();
        }, 500);
      })
      .catch(error => {
        console.error('Error revalidating:', error);
        setIsLoading(false);
        setError('Failed to revalidate: ' + error.message);
        fetchDebugInfo();
      });
  };

  // Handle title click for easter egg
  const handleTitleClick = (project: Project) => {
    setEasterEggCount(prev => prev + 1)
    if (easterEggCount === 9) {
      const messages: Record<string, string> = {
        "NEX-WEBS Tools": "🚀 Unlocked: Secret SEO optimization mode activated!",
        "NEXTJS-WEBSITE": "✨ Found the hidden animation sequence!",
        "Morse Code Translator": "... . -.-. .-. . - (SECRET) found!",
        "WEB-APP-(Gratuity Calculator 2025)": "💰 Bonus calculator mode unlocked!",
        "Invisible Character Generator": "🔍 You found the invisible Easter egg!",
        "CPU & GPU Bottleneck Calculator": "⚡ Turbo mode activated!",
        "AI Code Assistant": "🤖 AI assistant level upgraded!",
        "3D Portfolio Showcase": "🎮 Unlocked secret 3D view!",
        "Smart Home Dashboard": "🏠 Secret room discovered!",
        "Crypto Trading Bot": "💎 Diamond hands mode activated!"
      }
      setEasterEggMessage(messages[project.title] || "🎉 You found a secret!")
      setShowEasterEgg(true)
      setTimeout(() => {
        setShowEasterEgg(false)
        setEasterEggCount(0)
      }, 3000)
    }
  }

  // Memoize filtered projects
  const filteredProjects = useMemo(() => 
    selectedCategory === 'All'
      ? projects
      : projects.filter(project => project.category === selectedCategory),
    [selectedCategory, projects]
  )

  // Optimize scroll handler with debounce
  const handleSliderScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const container = sliderRef.current;
    const scrollAmount = Math.min(container.clientWidth * 0.8, 800);
    const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    
    // Use requestAnimationFrame for smooth animation
    const startTime = performance.now();
    const startScroll = container.scrollLeft;
    const duration = 300; // Animation duration in ms
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const easedProgress = easeInOutCubic(progress);
      
      container.scrollLeft = startScroll + (targetScroll - startScroll) * easedProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-red-300 mb-2">Error Loading Projects</h3>
          <p className="text-white mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={fetchDebugInfo}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Debug Info
            </button>
          </div>
          
          {debugInfo && (
            <div className="mt-6">
              <details className="bg-black/30 rounded-md p-3 border border-red-500/30 text-left">
                <summary className="text-red-400 cursor-pointer font-medium">Debug Information</summary>
                <div className="mt-3 text-xs font-mono text-gray-300 whitespace-pre-wrap max-h-80 overflow-auto p-2 bg-black/40 rounded">
                  {JSON.stringify(debugInfo, null, 2)}
                </div>
              </details>
            </div>
          )}
        </div>
      </section>
    );
  }

  // No projects state
  if (filteredProjects.length === 0) {
    return (
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
        {/* Category Filters */}
        <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
          {categories.map((category, index) => (
            <button
              key={`category-${index}-${String(category)}`}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
          
          {/* Admin refresh button - hidden for most users */}
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 rounded-full text-sm transition-colors bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 ml-4"
            title="Admin refresh"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button
            onClick={fetchDebugInfo}
            className="px-4 py-2 rounded-full text-sm transition-colors bg-purple-600/30 text-purple-300 hover:bg-purple-600/50"
            title="Debug info"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        
        <div className="bg-gray-900/50 rounded-xl p-8 border border-purple-500/20 text-center">
          <h3 className="text-xl font-semibold text-purple-300 mb-3">
            {selectedCategory === 'All' 
              ? "No projects found" 
              : `No projects found in "${selectedCategory}" category`}
          </h3>
          <p className="text-gray-400">
            {selectedCategory === 'All' 
              ? "Check back later for exciting new projects!" 
              : "Try selecting a different category or check back later."}
          </p>
          {selectedCategory !== 'All' && (
            <button 
              onClick={() => setSelectedCategory('All')}
              className="mt-4 px-4 py-2 bg-purple-600/30 text-white rounded-md"
            >
              Show All Projects
            </button>
          )}
          
          {debugInfo && (
            <div className="mt-6 max-w-2xl mx-auto">
              <details className="bg-black/30 rounded-md p-3 border border-purple-500/30 text-left">
                <summary className="text-purple-400 cursor-pointer font-medium">Debug Information</summary>
                <div className="mt-3 text-xs font-mono text-gray-300 whitespace-pre-wrap max-h-80 overflow-auto p-2 bg-black/40 rounded">
                  {JSON.stringify(debugInfo, null, 2)}
                </div>
              </details>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Add global styles */}
      <style jsx global>{sliderStyles}</style>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap gap-2 justify-center">
        {categories.map((category, index) => (
          <button
            key={`category-${index}-${String(category)}`}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
        
        {/* Admin refresh button - hidden for most users */}
        <button
          onClick={handleManualRefresh}
          className="px-4 py-2 rounded-full text-sm transition-colors bg-blue-600/30 text-blue-300 hover:bg-blue-600/50 ml-4"
          title="Admin refresh"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <button
          onClick={fetchDebugInfo}
          className="px-4 py-2 rounded-full text-sm transition-colors bg-purple-600/30 text-purple-300 hover:bg-purple-600/50"
          title="Debug info"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Easter Egg Message */}
      {showEasterEgg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-black/90 rounded-xl border border-purple-500/30 z-50 backdrop-blur-md">
          <p className="text-white text-lg font-medium">{easterEggMessage}</p>
        </div>
      )}

      {/* Debug Info Modal */}
      {debugInfo && (
        <div className="fixed bottom-4 right-4 z-50">
          <details className="bg-black/90 backdrop-blur-md rounded-md border border-purple-500/30 p-3 max-w-sm text-left shadow-xl">
            <summary className="text-purple-400 cursor-pointer font-medium">Database Status</summary>
            <div className="mt-3 text-xs font-mono text-gray-300 whitespace-pre-wrap max-h-60 overflow-auto p-2 bg-black/40 rounded">
              <div className="text-green-400 font-semibold mb-1">Environment: {debugInfo.environment}</div>
              <div className="mb-2">Server Time: {debugInfo.serverTime}</div>
              {debugInfo.database && (
                <>
                  <div className="text-yellow-400 font-semibold mb-1">Database:</div>
                  <div className={debugInfo.database.connectivity === 'connected' ? 'text-green-400' : 'text-red-400'}>
                    Status: {debugInfo.database.connectivity}
                  </div>
                  {debugInfo.database.projects && (
                    <div className="mt-1">
                      Projects: {debugInfo.database.projects.total} 
                      (Featured: {debugInfo.database.projects.featured}, 
                      New: {debugInfo.database.projects.newlyAdded})
                    </div>
                  )}
                </>
              )}
            </div>
          </details>
        </div>
      )}

      {/* Projects Slider Section */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6 relative">
        {/* Slider Navigation Buttons */}
        <button
          onClick={() => handleSliderScroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 text-white p-2 rounded-full hover:bg-black/90 transition-all backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => handleSliderScroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/80 text-white p-2 rounded-full hover:bg-black/90 transition-all backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Projects Slider */}
        <div 
          ref={sliderRef}
          className="projects-slider overflow-x-auto pb-4 flex gap-4 md:gap-6 lg:gap-8 snap-x snap-mandatory"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: '1rem',
            scrollPaddingRight: '1rem'
          }}
        >
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card flex-none w-[300px] md:w-[350px] snap-start bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]"
              style={{ 
                height: '400px',
                contain: 'content',
              }}
            >
              {/* Project content */}
              <div className="relative h-full">
                {/* Background Image with optimized rendering */}
                <div className="absolute inset-0 z-0 opacity-30">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 300px, 350px"
                      loading="lazy"
                      quality={85}
                      style={{ 
                        objectFit: 'cover',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                        contain: 'paint'
                      }}
                    />
                  )}
                </div>

                {/* Content with optimized rendering */}
                <div className="relative z-10 h-full flex flex-col justify-between p-4 md:p-6">
                  <div>
                    <div 
                      className="mb-4 text-center py-4 bg-gradient-to-b from-purple-500/10 to-transparent rounded-lg border border-purple-500/20 cursor-pointer hover:from-purple-500/20 transition-colors"
                      onClick={() => handleTitleClick(project)}
                      style={{ transform: 'translateZ(0)' }}
                    >
                      <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-200 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-black/50 text-white rounded-full border border-purple-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-black/50 text-white rounded-full border border-purple-500/20">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 text-center text-sm px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-100 transition-colors"
                    >
                      View Details
                    </Link>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-sm px-4 py-2 rounded-md bg-black text-white border border-white/50 hover:bg-black/80 transition-colors"
                    >
                      Live Link
                    </a>
                  </div>
                </div>

                {project.featured && (
                  <div className="absolute top-3 right-3 bg-white text-black text-xs px-3 py-1 rounded-full border border-purple-500/20 z-30 font-medium">
                    Featured
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section - Keep only one instance */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="bg-black/60 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row">
            <div className="p-8 lg:p-12 lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-6">
                New Projects Coming Soon
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-500 mb-8"></div>
              
              <p className="text-base md:text-lg text-purple-100/90 mb-8 max-w-xl">
                Stay tuned for exciting new projects! Follow me on social media for updates on upcoming releases and behind-the-scenes development.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link href="#" className="w-full sm:w-auto px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                  <span>Follow Updates</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <Link href="#" className="w-full sm:w-auto px-6 py-3 rounded-full border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-sm md:text-base transition-all duration-300 text-center">
                  View Roadmap
                </Link>
              </div>
            </div>
            
            <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-[#121212] p-6 lg:p-12 relative overflow-hidden rounded-r-xl border-l border-gray-800">
              {/* Code editor content */}
              <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800">
                <div className="py-2 px-4 flex items-center justify-between border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">upcoming-projects.tsx</div>
                </div>
                
                <div className="p-4 font-mono text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <p className="text-blue-300">AI Portfolio Builder <span className="text-xs text-blue-400">90% Complete</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <p className="text-green-300">Web3 Integration <span className="text-xs text-green-400">In Progress</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                      <p className="text-yellow-300">Mobile Solutions <span className="text-xs text-yellow-400">Planning</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 