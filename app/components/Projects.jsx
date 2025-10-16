'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Projects({ showcaseLocation = 'regular_grid', displayLimit = null }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (showcaseLocation && showcaseLocation !== 'regular_grid') {
          params.append('showcase', showcaseLocation);
        }
        
        const response = await fetch(`/api/projects?${params.toString()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter projects based on showcase location
        let filteredProjects = data;
        if (showcaseLocation === 'ai_solutions') {
          filteredProjects = data.filter(project => 
            project.showcase_location === 'ai_solutions' ||
            project.category?.toLowerCase().includes('ai') ||
            project.category?.toLowerCase().includes('ml') ||
            project.title?.toLowerCase().includes('ai') ||
            project.description?.toLowerCase().includes('artificial intelligence')
          );
        } else if (showcaseLocation === 'mobile_showcase') {
          filteredProjects = data.filter(project => 
            project.showcase_location === 'mobile_showcase' ||
            project.category?.toLowerCase().includes('mobile') ||
            project.category?.toLowerCase().includes('app') ||
            project.title?.toLowerCase().includes('mobile') ||
            project.title?.toLowerCase().includes('app')
          );
        } else if (showcaseLocation === 'featured_hero') {
          filteredProjects = data.filter(project => 
            project.showcase_location === 'featured_hero' || project.featured
          );
        }
        
        // Apply display limit if specified
        if (displayLimit && filteredProjects.length > displayLimit) {
          filteredProjects = filteredProjects.slice(0, displayLimit);
        }
        
        setProjects(filteredProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProjects();
  }, [showcaseLocation, displayLimit]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center p-6 bg-red-100/10 border border-red-300/20 rounded-lg">
          <div className="text-red-400 text-lg mb-2">Error loading projects</div>
          <div className="text-gray-400">{error}</div>
          <button 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-400 mb-2">No projects found</div>
          <div className="text-gray-500">Check back soon for new projects!</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      showcaseLocation === 'ai_solutions' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' :
      showcaseLocation === 'mobile_showcase' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
      showcaseLocation === 'featured_hero' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2' :
      'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }`}>
      {projects.map((project, index) => {
        // Determine display style based on display_type
        const isAIProduct = project.display_type === 'ai_product' || project.display_type === 'ai_product_new';
        const isMobileApp = project.display_type === 'mobile_app' || project.display_type === 'mobile_app_new';
        const isCodeShowcase = project.display_type === 'code_showcase';
        const isNewlyAdded = project.display_type?.includes('newly_added') || project.title?.startsWith('NEWLY ADDED');
        
        return (
          <div
            key={project.id}
            className={`${
              showcaseLocation === 'ai_solutions' && isAIProduct ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30' :
              showcaseLocation === 'mobile_showcase' && isMobileApp ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30' :
              isCodeShowcase ? 'bg-gradient-to-br from-gray-900/50 to-black/50' :
              isNewlyAdded ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/30' :
              'bg-gray-900/50'
            } rounded-xl overflow-hidden transition-all duration-300 group flex flex-col backdrop-blur-md border ${
              isAIProduct ? 'border-purple-500/30' :
              isMobileApp ? 'border-blue-500/30' :
              isCodeShowcase ? 'border-gray-600/30' :
              isNewlyAdded ? 'border-pink-500/30' :
              index % 8 === 0 ? 'neon-border-purple-base' :
              index % 8 === 1 ? 'neon-border-blue-base' :
              index % 8 === 2 ? 'neon-border-green-base' :
              index % 8 === 3 ? 'neon-border-pink-base' :
              index % 8 === 4 ? 'neon-border-cyan-base' :
              index % 8 === 5 ? 'neon-border-orange-base' :
              index % 8 === 6 ? 'neon-border-yellow-base' :
              'neon-border-violet-base'
            }`}
          >
            {/* Enhanced Badge for Special Display Types */}
            {isAIProduct && showcaseLocation === 'ai_solutions' && (
              <div className="absolute top-3 left-3 z-20">
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full border border-purple-400/30">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">AI Powered</span>
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            )}
            
            {isAIProduct && showcaseLocation !== 'ai_solutions' && (
              <div className="absolute top-3 left-3 z-20">
                <div className="flex items-center gap-2 bg-purple-600/90 backdrop-blur-md px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white text-xs font-medium">AI Powered</span>
                </div>
              </div>
            )}
            
            {isMobileApp && showcaseLocation === 'mobile_showcase' && (
              <div className="absolute top-3 right-3 z-20">
                <div className="flex items-center gap-2 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs font-medium">Mobile Ready</span>
                </div>
              </div>
            )}
            
            {isMobileApp && showcaseLocation !== 'mobile_showcase' && (
              <div className="absolute top-3 left-3 z-20">
                <div className="flex items-center gap-2 bg-blue-600/90 backdrop-blur-md px-3 py-1 rounded-full">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM6 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H7a1 1 0 01-1-1V4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs font-medium">Mobile App</span>
                </div>
              </div>
            )}
            
            {isNewlyAdded && (
              <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  NEW
                </div>
              </div>
            )}
            
            {/* Project Image */}
            <div className={`relative overflow-hidden ${
              isCodeShowcase ? 'h-72' : 'h-60'
            } w-full`}>
              {isCodeShowcase ? (
                // Code showcase display with IDE-like frame
                <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 h-full">
                  {/* IDE Header */}
                  <div className="bg-black/80 py-2 px-4 flex items-center justify-between border-b border-gray-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {project.codeTitle || project.title}
                    </div>
                  </div>
                  {/* Code Content */}
                  <div className="h-full p-4 relative">
                    <Image 
                      src={project.image_url || project.image} 
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={false}
                    />
                  </div>
                </div>
              ) : (
                // Standard image display
                <>
                  <Image 
                    src={project.image_url || project.image} 
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={false}
                  />
                  {/* Special overlay for AI projects */}
                  {isAIProduct && (
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                  )}
                </>
              )}
            </div>
            
            {/* Content */}
            <div className="p-5 flex-grow flex flex-col">
              <h3 className={`text-xl font-semibold mb-2 group-hover:transition-colors ${
                isAIProduct ? 'text-white group-hover:text-purple-400' :
                isMobileApp ? 'text-white group-hover:text-blue-400' :
                isCodeShowcase ? 'text-white group-hover:text-green-400 font-mono' :
                isNewlyAdded ? 'text-white group-hover:text-pink-400' :
                'text-white group-hover:text-purple-400'
              }`}>
                {project.title.replace('NEWLY ADDED: ', '')}
              </h3>
              
              <p className="text-gray-400 mb-4 flex-grow line-clamp-3">
                {project.description}
              </p>
              
              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(project.technologies || []).slice(0, isAIProduct ? 4 : 3).map((tech, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      isAIProduct ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
                      isMobileApp ? 'bg-blue-500/10 text-blue-300 border-blue-500/20' :
                      isCodeShowcase ? 'bg-green-500/10 text-green-300 border-green-500/20 font-mono' :
                      isNewlyAdded ? 'bg-pink-500/10 text-pink-300 border-pink-500/20' :
                      'bg-black/50 text-white border-purple-500/20'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
                {(project.technologies || []).length > (isAIProduct ? 4 : 3) && (
                  <span className="text-xs px-2 py-1 bg-gray-800 text-gray-400 rounded-full border border-gray-600">
                    +{(project.technologies || []).length - (isAIProduct ? 4 : 3)}
                  </span>
                )}
              </div>
              
              {/* Enhanced Actions for Different Types */}
              <div className="mt-auto">
                {showcaseLocation === 'ai_solutions' && isAIProduct ? (
                  <div className="flex gap-2">
                    <Link 
                      href={`/projects/${project.id}`} 
                      className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition text-sm"
                    >
                      Explore AI Solution
                    </Link>
                    <a
                      href={project.project_link || project.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-600/10 transition text-sm"
                    >
                      Demo
                    </a>
                  </div>
                ) : showcaseLocation === 'mobile_showcase' && isMobileApp ? (
                  <div className="flex gap-2">
                    <Link 
                      href={`/projects/${project.id}`} 
                      className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition text-sm"
                    >
                      View Mobile App
                    </Link>
                    <a
                      href={project.project_link || project.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-blue-500/50 text-blue-300 rounded-lg hover:bg-blue-600/10 transition text-sm"
                    >
                      Try App
                    </a>
                  </div>
                ) : isCodeShowcase ? (
                  <div className="flex gap-2">
                    <Link 
                      href={`/projects/${project.id}`} 
                      className="flex-1 text-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg font-medium hover:from-gray-600 hover:to-gray-700 transition text-sm font-mono"
                    >
                      View Code
                    </Link>
                    <a
                      href={project.project_link || project.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 border border-gray-500/50 text-gray-300 rounded-lg hover:bg-gray-600/10 transition text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                ) : (
                  // Standard project buttons
                  <Link 
                    href={project.project_link || project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center px-4 py-2 rounded-md font-medium transition text-sm ${
                      isNewlyAdded ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' :
                      'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isNewlyAdded ? 'Check it Out' : 'View Project'}
                    <svg 
                      className="w-4 h-4 ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 
