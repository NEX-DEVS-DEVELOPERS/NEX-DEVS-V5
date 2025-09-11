'use client'

import { useState, useEffect, use } from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import CodeHighlighter from '../../components/CodeHighlighter'

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
  exclusiveFeatures?: string[]
  imagePriority?: number | boolean
  showBothImagesInPriority?: boolean
  isCodeScreenshot?: boolean
  codeLanguage?: string
  codeTitle?: string
  codeContent?: string
  useDirectCodeInput?: boolean
  visualEffects?: {
    glow: boolean
    animation: string
    showBadge: boolean
    shadows?: string
    border?: string
    spotlight?: boolean
  }
}

export default function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [effectsLoaded, setEffectsLoaded] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Add timestamp to force fresh data and prevent browser caching
        const timestamp = new Date().getTime();
        
        // Safely handle params.id with appropriate type checking
        const projectId = typeof params?.id === 'string' ? parseInt(params.id, 10) : 0
        
        if (isNaN(projectId) || projectId <= 0) {
          setError('Invalid project ID')
          setIsLoading(false)
          return
        }
        
        // Use the dedicated API endpoint for fetching a single project
        const response = await fetch(`/api/projects/${projectId}?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`)
        }
        
        const projectData = await response.json()
        
        if (projectData) {
          setProject(projectData)
          // Add a small delay before enabling effects to ensure smooth animation
          setTimeout(() => {
            setEffectsLoaded(true)
          }, 100)
        } else {
          setError('Project not found')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [params?.id]) // Use optional chaining to prevent errors

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 px-6">
        <div className="max-w-4xl mx-auto flex justify-center items-center py-20">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 px-6">
        <div className="max-w-4xl mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">{error || 'Project not found'}</h2>
          <Link 
            href="/projects" 
            className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link 
          href="/projects"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8"
          onClick={(e) => {
            console.log("Back to Projects clicked");
            e.preventDefault();
            router.push('/projects');
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Project Image Container with Fixed Box Layout */}
          <div 
            className={`w-full md:w-1/2 relative rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm ${
              project.visualEffects?.shadows === 'soft' ? 'shadow-lg' :
              project.visualEffects?.shadows === 'hard' ? 'shadow-xl' :
              project.visualEffects?.shadows === 'neon' ? 'shadow-[0_0_20px_5px_rgba(147,51,234,0.4)]' :
              project.visualEffects?.shadows === 'gradient' ? 'shadow-[0_0_30px_5px_rgba(147,51,234,0.4),0_0_30px_10px_rgba(59,130,246,0.3)]' :
              'shadow-md'
            } ${
              project.visualEffects?.border === 'solid' ? 'border-2 border-purple-500/50' :
              project.visualEffects?.border === 'dashed' ? 'border-2 border-dashed border-purple-500/50' :
              project.visualEffects?.border === 'gradient' ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-[1px]' :
              project.visualEffects?.border === 'glow' ? 'border-2 border-purple-500/50 shadow-[0_0_10px_1px_rgba(147,51,234,0.4)]' :
              project.visualEffects?.border === 'animated' ? 'border-2 border-purple-500/50 animate-borderGlow' :
              'border border-purple-500/30'
            } ${effectsLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          >
            {/* Spotlight Effect */}
            {project.visualEffects?.spotlight && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -right-32 -top-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 animate-spotlight"></div>
                <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 animate-spotlight" style={{ animationDelay: '4s' }}></div>
              </div>
            )}
            
            {/* Background Glow */}
            {project.visualEffects?.glow && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 to-blue-500/15 opacity-60 z-0"></div>
            )}
            
            {/* Fixed aspect ratio container */}
            <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-black">
              {project.secondImage && project.showBothImagesInPriority ? (
                <div className="flex h-full w-full">
                  <div className="w-1/2 relative h-full border-r border-purple-500/20">
                    <Image 
                      src={project.image}
                      alt={project.title}
                      fill
                      className={`object-cover transform-gpu ${
                        project.visualEffects?.animation === 'pulse' ? 'animate-slowPulse' : 
                        project.visualEffects?.animation === 'bounce' ? 'animate-bounce-slow' : 
                        project.visualEffects?.animation === 'fade' ? 'animate-fade' : 
                        project.visualEffects?.animation === 'float' ? 'animate-float' : ''
                      }`}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority
                      quality={100}
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        WebkitPerspective: 1000, 
                        WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                        objectFit: 'cover',
                        transform: 'translateZ(0)'
                      }}
                      unoptimized={project.image.startsWith('data:')}
                    />
                    
                    {/* Image label */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-md">
                      Primary
                    </div>
                  </div>
                  <div className="w-1/2 relative h-full">
                    <Image 
                      src={project.secondImage || ''}
                      alt={`${project.title} - alternate view`}
                      fill
                      className={`object-cover transform-gpu ${
                        project.visualEffects?.animation === 'pulse' ? 'animate-slowPulse' : 
                        project.visualEffects?.animation === 'bounce' ? 'animate-bounce-slow' : 
                        project.visualEffects?.animation === 'fade' ? 'animate-fade' : 
                        project.visualEffects?.animation === 'float' ? 'animate-float' : ''
                      }`}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority
                      quality={100}
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        WebkitPerspective: 1000, 
                        WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                        objectFit: 'cover',
                        transform: 'translateZ(0)'
                      }}
                      unoptimized={project.secondImage?.startsWith('data:')}
                    />
                    
                    {/* Image label */}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs py-1 px-2 rounded-md">
                      Secondary
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                <Image 
                  src={project.image}
                  alt={project.title}
                  fill
                  className={`object-cover transform-gpu ${
                    project.visualEffects?.animation === 'pulse' ? 'animate-slowPulse' : 
                    project.visualEffects?.animation === 'bounce' ? 'animate-bounce-slow' : 
                    project.visualEffects?.animation === 'fade' ? 'animate-fade' : 
                    project.visualEffects?.animation === 'float' ? 'animate-float' : ''
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                    quality={100}
                  style={{ 
                    WebkitBackfaceVisibility: 'hidden', 
                    WebkitPerspective: 1000, 
                    WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                    objectFit: 'cover',
                    transform: 'translateZ(0)'
                  }}
                  unoptimized={project.image.startsWith('data:')}
                />
                  
                  {/* View Alternate button - always visible */}
                  {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && !project.showBothImagesInPriority && (
                    <div className="absolute bottom-4 right-4 z-10">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          // Log that button was clicked (for debugging)
                          console.log('View Alternate button clicked - swapping images');
                          
                          // Create temporary updated project with swapped images
                          const updatedProject = {...project};
                          const temp = updatedProject.image;
                          updatedProject.image = updatedProject.secondImage || '';
                          updatedProject.secondImage = temp;
                          
                          // Force re-render by updating state
                          setProject(updatedProject);
                          
                          // Force browser to recognize the image change
                          const imgElement = document.querySelector(`[alt="${updatedProject.title}"]`) as HTMLImageElement;
                          if (imgElement && imgElement.src) {
                            const currentSrc = imgElement.src;
                            imgElement.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // blank
                            setTimeout(() => {
                              imgElement.src = currentSrc;
                            }, 50);
                          }
                        }}
                        className="bg-purple-600/90 hover:bg-purple-600 text-white p-2.5 rounded-lg shadow-lg transition-colors flex items-center gap-2 border border-purple-400/30"
                        aria-label="Switch image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        <span className="text-xs font-medium">View Alternate</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* New Badge */}
              {project.visualEffects?.showBadge && (
                <div className="absolute -left-3 -top-3 z-20 flex items-center justify-center">
                  <div className="absolute w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full opacity-30 blur-lg animate-pulse"></div>
                  <div className="relative w-11 h-11 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-full border border-purple-400/30 shadow-lg">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">New</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Project Image Thumbnails Slider */}
            {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && (
              <div className="mt-4 bg-black/40 backdrop-blur-sm p-3 rounded-lg border border-purple-500/20">
                <h4 className="text-sm font-semibold text-white mb-2">Project Images</h4>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
                  <div className="flex gap-3 min-w-max p-1">
                    <div 
                      className={`cursor-pointer relative w-24 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        project.image !== project.secondImage ? 
                        'border-purple-500 shadow-[0_0_8px_rgba(147,51,234,0.5)]' : 'border-transparent'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Primary thumbnail clicked');
                        // Always set primary image to the original image
                        const updatedProject = {...project};
                        
                        // Only swap if we're not already showing the primary image
                        if (updatedProject.image === updatedProject.secondImage) {
                          const temp = updatedProject.image;
                          updatedProject.image = updatedProject.secondImage;
                          updatedProject.secondImage = temp;
                          setProject(updatedProject);
                        }
                      }}
                    >
                      <Image 
                        src={project.secondImage === project.image ? project.secondImage : project.image}
                        alt={`${project.title} - main view`}
                        fill
                        className="object-cover"
                        sizes="96px"
                        quality={80}
                      />
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-[10px] text-center text-white">Primary</div>
                    </div>
                    
                    <div 
                      className={`cursor-pointer relative w-24 h-16 rounded-md overflow-hidden border-2 transition-all ${
                        project.image === project.secondImage ? 
                        'border-purple-500 shadow-[0_0_8px_rgba(147,51,234,0.5)]' : 'border-transparent'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('Secondary thumbnail clicked');
                    const updatedProject = {...project};
                        
                        // Only swap if not already showing secondary image
                        if (updatedProject.image !== updatedProject.secondImage) {
                    const temp = updatedProject.image;
                    updatedProject.image = updatedProject.secondImage || '';
                    updatedProject.secondImage = temp;
                          setProject(updatedProject);
                        }
                      }}
                    >
                      <Image 
                        src={project.secondImage === project.image ? project.image : project.secondImage || ''}
                        alt={`${project.title} - alternate view`}
                        fill
                        className="object-cover"
                        sizes="96px"
                        quality={80}
                      />
                      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors"></div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 text-[10px] text-center text-white">Secondary</div>
                    </div>
                    
                    {/* Additional mockup images */}
                    <div className="cursor-pointer relative w-24 h-16 rounded-md overflow-hidden border-2 border-transparent hover:border-purple-500/50 transition-all">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                        <svg className="w-6 h-6 text-purple-500 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 text-center text-[10px] text-gray-400 pb-1">Coming Soon</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
              {project.title}
            </h1>
            
            {/* Status badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Featured
                </span>
              )}
              {project.status && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30">
                  {project.status}
                </span>
              )}
              {project.secondImage && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  Multiple Views
                </span>
              )}
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              {project.description}
            </p>
            
            {/* Technology Stack */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-md text-sm font-medium bg-black/50 text-gray-200 border border-purple-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!project.link || project.link === "#" || project.link === "") {
                    alert("This project doesn't have a live link yet.");
                  } else {
                    console.log("View Live clicked:", project.link);
                    window.open(project.link, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="flex-1 md:flex-none text-center px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Live
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!project.link || project.link === "#" || project.link === "") {
                    alert("Source code is not available yet.");
                  } else {
                    console.log("Source Code clicked:", `${project.link}/code`);
                    window.open(`${project.link}/code`, '_blank', 'noopener,noreferrer');
                  }
                }}
                className="flex-1 md:flex-none text-center px-5 py-3 bg-transparent text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-900/20 transition-colors"
              >
                Source Code
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar for Newly Added Projects */}
        {project.progress !== undefined && (
          <div className="bg-black/30 rounded-xl border border-purple-500/20 p-6 mb-10">
            <h3 className="text-xl font-semibold text-white mb-4">Development Progress</h3>
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000" 
                style={{ width: `${project.progress}%` }} 
              />
            </div>
          </div>
        )}

        {/* Features List for Newly Added Projects */}
        {project.features && project.features.length > 0 && (
          <div className="bg-black/30 rounded-xl border border-purple-500/20 p-6 mb-10">
            <h3 className="text-xl font-semibold text-white mb-4">Project Features</h3>
            <ul className="space-y-3">
              {project.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-300">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Code Details Section - Only show for code projects */}
        {project.isCodeScreenshot && project.codeContent && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Code Implementation
            </h3>
            <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-0.5 rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.15)]">
              <div className="rounded-xl overflow-hidden flex flex-col">
                {/* Fixed height container for code highlighting */}
                <div className="h-[450px] flex flex-col">
                  <CodeHighlighter 
                    code={project.codeContent}
                    language={project.codeLanguage || 'javascript'}
                    lineNumbers={true}
                    projectImage={project.image}
                    projectTitle={project.codeTitle || `${project.title}.${project.codeLanguage || 'js'}`}
                    maxHeight="450px"
                  />
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/50 to-black/60 p-4 border-t border-purple-500/20">
                  <div className="flex flex-wrap gap-4 items-center">
                    {/* Language badge */}
                    <div className="px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/30 text-sm flex items-center">
                    <span className="font-semibold text-purple-300">Language:</span> 
                    <span className="ml-2 text-white">{project.codeLanguage || 'JavaScript'}</span>
                  </div>
                    
                    {/* File name badge */}
                  {project.codeTitle && (
                      <div className="px-4 py-2 bg-purple-900/30 rounded-lg border border-purple-500/30 text-sm flex items-center">
                      <span className="font-semibold text-purple-300">File:</span> 
                      <span className="ml-2 text-white">{project.codeTitle}</span>
                    </div>
                  )}
                    
                    {/* Copy button with success state */}
                  <button 
                      className="px-4 py-2 bg-blue-600/30 text-blue-300 rounded-lg border border-blue-500/30 text-sm hover:bg-blue-600/40 transition-colors flex items-center gap-2 ml-auto group"
                    onClick={() => {
                      if (navigator.clipboard && project.codeContent) {
                        navigator.clipboard.writeText(project.codeContent);
                          
                          // Create and append the tooltip
                          const button = document.activeElement;
                          if (button) {
                            const tooltip = document.createElement('div');
                            tooltip.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-900/90 text-green-300 px-2 py-1 rounded text-xs';
                            tooltip.textContent = 'Copied!';
                            button.classList.add('relative');
                            button.appendChild(tooltip);
                            
                            // Remove the tooltip after a delay
                            setTimeout(() => {
                              button.removeChild(tooltip);
                              button.classList.remove('relative');
                            }, 2000);
                          }
                      }
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                      <span>Copy Code</span>
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-900/90 text-green-300 px-2 py-1 rounded text-xs opacity-0 group-active:opacity-100 transition-opacity pointer-events-none">Copied!</span>
                  </button>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-400 bg-gray-800/30 p-3 rounded-lg border border-gray-700/30">
                    <p className="flex items-start">
                      <svg className="w-4 h-4 mr-2 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        This code snippet demonstrates a key component of the {project.title} project. 
                        Explore the implementation details and feel free to copy the code using the button above.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive Project Details */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Project Overview
          </h3>
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-0.5 rounded-xl">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/60 rounded-xl border border-purple-500/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg text-purple-300 mb-3 font-medium">About this Project</h4>
                  <p className="text-gray-300 leading-relaxed mb-4">{project.description}</p>
                  
                  {/* Status and timeline */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    {project.status && (
                      <div className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-300 text-sm border border-green-500/30">
                        Status: {project.status}
                      </div>
                    )}
                    {project.updatedDays !== undefined && (
                      <div className="px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/30">
                        Updated: {project.updatedDays} days ago
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg text-purple-300 mb-3 font-medium">Technical Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                      <div>
                        <h5 className="text-white font-medium mb-1">Technology Stack</h5>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span key={index} className="px-2.5 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md border border-purple-500/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <h5 className="text-white font-medium mb-1">Key Highlights</h5>
                        <ul className="list-disc list-inside text-gray-300 ml-0.5 space-y-1 text-sm">
                          {project.features && project.features.length > 0 ? (
                            project.features.slice(0, 3).map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))
                          ) : (
                            <>
                              <li>Professional design and user experience</li>
                              <li>Full-stack implementation with modern technologies</li>
                              <li>Responsive and accessible across all devices</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Agency context and client value */}
              <div className="mt-6 pt-6 border-t border-purple-500/20">
                <h4 className="text-lg text-purple-300 mb-3 font-medium">Project Value & Context</h4>
                <p className="text-gray-300 mb-4">
                  At NEX-DEVS, we specialize in creating innovative digital solutions that combine cutting-edge technology with exceptional user experiences. This {project.category.toLowerCase()} project showcases our expertise in {project.technologies.slice(0, 3).join(", ")} and our commitment to delivering high-quality, scalable solutions.
                </p>
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h5 className="text-white font-medium mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Why Choose NEX-DEVS for Your Next Project?
                  </h5>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-gray-300 text-sm mt-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Dedicated team of expert developers
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Transparent communication and process
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Modern technological solutions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Commitment to excellence and innovation
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Tailored solutions for your business needs
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      Ongoing support and maintenance
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (!project.link || project.link === "#" || project.link === "") {
                      alert("This project doesn't have a live link yet.");
                    } else {
                      console.log("Visit Live Project clicked:", project.link);
                      window.open(project.link, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visit Live Project
                </button>
                <Link 
                  href="/contact"
                  className="px-5 py-3 bg-transparent text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-900/20 transition-colors flex items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Discuss Similar Project clicked");
                    router.push('/contact');
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Discuss Similar Project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Related Projects Section */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Related & Upcoming Projects
          </h3>
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 p-0.5 rounded-xl">
            <div className="bg-gradient-to-br from-gray-900/50 to-black/60 rounded-xl border border-purple-500/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg text-purple-300 mb-3 font-medium">Upcoming Innovations</h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-white font-medium">AI-Enhanced User Experience</h5>
                        <p className="text-sm text-gray-400 mt-1">Advanced AI-powered features to deliver personalized user experiences and intelligent automation in our upcoming projects.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-white font-medium">Blockchain Integration</h5>
                        <p className="text-sm text-gray-400 mt-1">Secure and transparent solutions leveraging blockchain technology for next-generation web applications and services.</p>
                      </div>
                </li>
            </ul>
                </div>
                
                <div>
                  <h4 className="text-lg text-purple-300 mb-3 font-medium">Why Work With Us</h4>
                  <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-4 rounded-lg border border-purple-500/30">
                    <p className="text-gray-300 mb-4">
                      NEX-DEVS is a forward-thinking development agency that combines technical expertise with creative problem-solving. We're dedicated to building solutions that drive real business value while pushing the boundaries of what's possible.
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-300">50+</div>
                          <div className="text-xs text-gray-400">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-300">98%</div>
                          <div className="text-xs text-gray-400">Client Satisfaction</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-300">24/7</div>
                          <div className="text-xs text-gray-400">Support</div>
                        </div>
                      </div>
                      
                      <Link 
                        href="/contact" 
                        className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log("Start a Project clicked");
                          router.push('/contact');
                        }}
                      >
                        Start a Project
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 