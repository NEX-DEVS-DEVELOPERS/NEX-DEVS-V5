'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
  showBothImagesInPriority?: boolean
}

export default function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState(['All'])
  const [isLoading, setIsLoading] = useState(true)
  const [easterEggCount, setEasterEggCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState('')

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        
        // Enhanced cache busting with multiple random values
        const timestamp = new Date().getTime();
        const randomValue = Math.floor(Math.random() * 10000000);
        const cache = `nocache=${timestamp}-${randomValue}`;
        
        // Build the API URL with category filter if selected
        const categoryParam = selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
        const apiUrl = `/api/projects?t=${timestamp}&r=${randomValue}${categoryParam}&${cache}`;
        
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
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        let data = [];
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          // Return empty array if JSON parsing fails
          data = [];
        }
        
        // Verify data is an array
        if (!Array.isArray(data)) {
          console.error('Invalid data format received, expected array but got:', typeof data);
          data = [];
        }
        
        console.log('Fetched projects data:', data.length, 'projects');
        
        // Only filter out projects with 'NEWLY ADDED:' prefix in title
        // Include all projects regardless of status
        const regularProjects = data.filter((project: Project) => 
          !project.title.startsWith('NEWLY ADDED:')
        );
        
        console.log('Regular projects count:', regularProjects.length);
        setProjects(regularProjects);
        
        try {
          // Extract unique categories from the fetched data
          const categoriesResponse = await fetch(`/api/projects?t=${timestamp}&action=categories`, {
            cache: 'no-store'
          });
          
          if (!categoriesResponse.ok) {
            throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
          }
          
          const fetchedCategories = await categoriesResponse.json();
          
          // Ensure we have unique categories by using a Set
          const uniqueCategories = Array.from(new Set(['All', ...(Array.isArray(fetchedCategories) ? fetchedCategories : [])]));
          setCategories(uniqueCategories);
        } catch (categoryError) {
          console.error('Error fetching categories:', categoryError);
          // Ensure we always have at least 'All' category
          setCategories(['All']);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Clear projects and set to empty array on error
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
    
    // Set up an interval to refresh data more frequently when tab is visible
    const refreshInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchProjects();
      }
    }, 30000); // Refresh every 30 seconds when tab is visible
    
    // Clean up the interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [selectedCategory]);

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

  return (
    <>
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
      </div>

      {/* Easter Egg Message */}
      {showEasterEgg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-black/90 rounded-xl border border-purple-500/30 z-50 backdrop-blur-md">
          <p className="text-white text-lg font-medium">{easterEggMessage}</p>
        </div>
      )}

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="relative overflow-hidden rounded-xl bg-black/40 border border-white/10 min-h-[350px] md:min-h-[400px] backdrop-blur-sm"
            >
              {/* Project Image */}
              <div className="absolute inset-0 z-0 opacity-30">
                {project.image && (
                  project.secondImage && project.showBothImagesInPriority ? (
                    // Show both images side by side when configured
                    <div className="flex h-full w-full">
                      <div className="w-1/2 relative h-full">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          loading="lazy"
                          quality={95}
                          style={{ 
                            WebkitBackfaceVisibility: 'hidden', 
                            WebkitPerspective: 1000, 
                            WebkitFilter: 'contrast(1.05) saturate(1.05)',
                            objectFit: 'cover',
                            transform: 'translateZ(0)'
                          }}
                          unoptimized={project.image.startsWith('data:')}
                        />
                      </div>
                      <div className="w-1/2 relative h-full">
                        <Image
                          src={project.secondImage}
                          alt={`${project.title} - secondary view`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                          loading="lazy"
                          quality={95}
                          style={{ 
                            WebkitBackfaceVisibility: 'hidden', 
                            WebkitPerspective: 1000, 
                            WebkitFilter: 'contrast(1.05) saturate(1.05)',
                            objectFit: 'cover',
                            transform: 'translateZ(0)'
                          }}
                          unoptimized={project.secondImage?.startsWith('data:')}
                        />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      quality={95}
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        WebkitPerspective: 1000, 
                        WebkitFilter: 'contrast(1.05) saturate(1.05)',
                        objectFit: 'cover',
                        transform: 'translateZ(0)'
                      }}
                      unoptimized={project.image.startsWith('data:')}
                    />
                  )
                )}
              </div>
              <div className="h-full relative z-10">
                <div className="p-4 md:p-6">
                  <div 
                    className="mb-4 md:mb-6 text-center py-6 md:py-8 bg-gradient-to-b from-purple-500/10 to-transparent rounded-lg border border-purple-500/20 cursor-pointer hover:from-purple-500/20 transition-colors shadow-sm"
                    onClick={() => handleTitleClick(project)}
                  >
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent tracking-tight drop-shadow-[0_0_5px_rgba(147,51,234,0.3)]">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-200 mb-4 antialiased leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-black/50 text-white rounded-full border border-purple-500/20 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 text-center text-xs md:text-sm px-3 md:px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg"
                    >
                      View Details
                    </Link>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs md:text-sm px-3 md:px-4 py-2 rounded-md bg-black text-white border border-white/50 hover:bg-black/80 transition-colors shadow-md hover:shadow-lg"
                    >
                      Live Link
                    </a>
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white text-black text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-purple-500/20 z-30 font-medium shadow-md">
                    Featured
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
} 