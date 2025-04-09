'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  exclusiveFeatures?: string[]
  imagePriority?: number | boolean
  showBothImagesInPriority?: boolean
  visualEffects?: {
    glow: boolean
    animation: string
    showBadge: boolean
    shadows?: string
    border?: string
    spotlight?: boolean
  }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [effectsLoaded, setEffectsLoaded] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Enhanced cache busting mechanism for Vercel deployment
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000000);
        const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV || '';
        
        const response = await fetch(`/api/projects?t=${timestamp}&r=${random}&forceRefresh=true&env=${vercelEnv}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Force-Refresh': 'true'
          },
          next: { revalidate: 0 } // Next.js 13 cache control
        })
        const projects = await response.json()
        
        // Safely handle params.id with appropriate type checking
        const projectId = typeof params?.id === 'string' ? parseInt(params.id, 10) : 0
        
        if (isNaN(projectId) || projectId <= 0) {
          setError('Invalid project ID')
          setIsLoading(false)
          return
        }
        
        const foundProject = projects.find((p: Project) => p.id === projectId)
        
        if (foundProject) {
          setProject(foundProject)
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
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Projects
        </Link>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Project Image */}
          <div 
            className={`w-full md:w-1/2 relative aspect-square rounded-xl overflow-hidden ${
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
            
            {/* Border Gradient Wrapper */}
            <div className={`w-full h-full ${
              project.visualEffects?.border === 'gradient' 
                ? 'bg-gradient-to-br from-gray-900 to-black border border-purple-500/30 rounded-xl' 
                : ''
            }`}>
              {project.secondImage && project.showBothImagesInPriority ? (
                <div className="flex h-full w-full">
                  <div className="w-1/2 relative h-full">
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
                      quality={95}
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        WebkitPerspective: 1000, 
                        WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                        objectFit: 'cover',
                        transform: 'translateZ(0)'
                      }}
                      unoptimized={project.image.startsWith('data:')}
                    />
                  </div>
                  <div className="w-1/2 relative h-full">
                    <Image 
                      src={project.secondImage}
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
                      quality={95}
                      style={{ 
                        WebkitBackfaceVisibility: 'hidden', 
                        WebkitPerspective: 1000, 
                        WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
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
                  className={`object-cover transform-gpu ${
                    project.visualEffects?.animation === 'pulse' ? 'animate-slowPulse' : 
                    project.visualEffects?.animation === 'bounce' ? 'animate-bounce-slow' : 
                    project.visualEffects?.animation === 'fade' ? 'animate-fade' : 
                    project.visualEffects?.animation === 'float' ? 'animate-float' : ''
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  quality={95}
                  style={{ 
                    WebkitBackfaceVisibility: 'hidden', 
                    WebkitPerspective: 1000, 
                    WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.02)',
                    objectFit: 'cover',
                    transform: 'translateZ(0)'
                  }}
                  unoptimized={project.image.startsWith('data:')}
                />
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
            
            {/* Second Image Toggle Button - Only show if there's a second image but not showing both */}
            {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && !project.showBothImagesInPriority && (
              <div className="mt-3 flex justify-center">
                <button 
                  onClick={() => {
                    // Create temporary updated project with swapped images
                    const updatedProject = {...project};
                    const temp = updatedProject.image;
                    updatedProject.image = updatedProject.secondImage || '';
                    updatedProject.secondImage = temp;
                    
                    // Update the project state
                    setProject(updatedProject);
                  }}
                  className="px-3 py-1.5 bg-blue-600/40 text-blue-300 text-xs rounded-lg border border-blue-600/40 hover:bg-blue-600/60 transition-colors flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Switch Image View
                </button>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent mb-4">
              {project.title}
            </h1>
            
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
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none text-center px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Live
              </a>
              <a
                href={`${project.link}/code`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none text-center px-5 py-3 bg-transparent text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-900/20 transition-colors"
              >
                Source Code
              </a>
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

        {/* Exclusive Features Section */}
        {project?.exclusiveFeatures && project.exclusiveFeatures.length > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-black/30 rounded-xl border border-purple-500/30 p-6 mb-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-600/10 rounded-full blur-xl"></div>
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-600/10 rounded-full blur-xl"></div>
            
            <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Exclusive Features
            </h3>
            
            <ul className="space-y-3">
              {project.exclusiveFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-5 h-5 bg-purple-500/20 text-purple-400 rounded-full">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-200">{feature}</p>
                </li>
              ))}
            </ul>
            
            <div className="mt-4 flex justify-end">
              <span className="text-xs text-purple-300 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                Limited Time Availability
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 