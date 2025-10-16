'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { audiowide } from '@/frontend/utils/fonts'

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  secondImage?: string
  showBothImagesInPriority?: boolean
  category: string
  technologies: string[]
  link: string
  featured: boolean
  status?: string
  updatedDays?: number
  progress?: number
  features?: string[]
  imagePriority?: number
  visualEffects?: {
    // New modern animations replacing basic effects
    morphTransition?: boolean
    rippleEffect?: boolean
    floatingElements?: boolean
    shimmering?: boolean
    // Keeping existing effects
    animation?: string
    showBadge?: boolean
    spotlight?: boolean
    shadows?: string
    border?: string
    glassmorphism?: boolean
    particles?: boolean
    // Advanced animation options
    animationTiming?: string
    animationIntensity?: string
  }
  exclusiveFeatures?: string[]
}

// New badge component with animation
const NewBadge = () => (
  <div className="absolute -left-3 -top-3 z-20 flex items-center justify-center">
    <div className="absolute w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full opacity-30 blur-lg animate-pulse"></div>
    <div className="relative w-11 h-11 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 rounded-full border border-purple-400/30 shadow-lg">
      <span className="text-[10px] font-bold text-white uppercase tracking-wider">New</span>
    </div>
  </div>
);

export default function NewlyAddedProjects() {
  const [newlyAddedProjects, setNewlyAddedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [enlargedImage, setEnlargedImage] = useState<{projectId: number, image: string} | null>(null)
  const projectRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  // Fetch newly added projects with memoization
  useEffect(() => {
    const controller = new AbortController()
    
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Enhanced cache busting with multiple random values
        const timestamp = new Date().getTime();
        const randomValue = Math.floor(Math.random() * 10000000);
        const cache = `nocache=${timestamp}-${randomValue}`;
        const response = await fetch(`/api/projects?t=${timestamp}&r=${randomValue}&${cache}`, {
          method: 'GET',
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
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (!Array.isArray(data)) {
          throw new Error('API did not return an array of projects')
        }
        
        // Filter projects with "NEWLY ADDED" in title or status is set, excluding mobile-related projects
        const filtered = data.filter((project: Project) => {
          const isMobileRelated = project.category?.toLowerCase().includes('mobile') || 
                                 project.title.toLowerCase().includes('mobile') ||
                                 project.description.toLowerCase().includes('mobile app') ||
                                 project.technologies.some(tech => 
                                   tech.toLowerCase().includes('react native') ||
                                   tech.toLowerCase().includes('flutter') ||
                                   tech.toLowerCase().includes('ionic') ||
                                   tech.toLowerCase().includes('swift') ||
                                   tech.toLowerCase().includes('kotlin')
                                 )
          
          return !isMobileRelated && (
            project.title.startsWith('NEWLY ADDED:') || 
            (project.status && ['In Development', 'Beta Testing', 'Recently Launched'].includes(project.status))
          )
        })
        
        // Sort projects by updatedDays (newest first)
        const sorted = filtered.sort((a: Project, b: Project) => {
          const daysA = a.updatedDays || 999;
          const daysB = b.updatedDays || 999;
          return daysA - daysB;
        });
        
        setNewlyAddedProjects(sorted)
        
        // Auto-update featured status after 3 days
        if (sorted.length > 0) {
          const projectsToUpdate: Project[] = sorted.filter((project: Project) => 
            project.updatedDays && project.updatedDays >= 3 && !project.featured
          );
          
          if (projectsToUpdate.length > 0) {
            const updateFeaturedProjects = async () => {
              try {
                let updateResults = []
                for (const project of projectsToUpdate) {
                  const updateResponse = await fetch(`/api/projects/${project.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
                      'Pragma': 'no-cache',
                      'Expires': '0',
                      'X-Force-Refresh': 'true',
                    },
                    body: JSON.stringify({
                      ...project,
                      featured: true,
                      // Include a few fields in both camelCase and snake_case for compatibility
                      status: project.status,
                      updatedDays: project.updatedDays,
                      updated_days: project.updatedDays
                    })
                  });
                  
                  if (!updateResponse.ok) {
                    const errorText = await updateResponse.text()
                    updateResults.push({
                      id: project.id,
                      success: false,
                      status: updateResponse.status,
                      error: errorText
                    })
                  } else {
                    updateResults.push({
                      id: project.id,
                      success: true
                    })
                  }
                }
                
                // Fetch debug info if there were errors
                if (updateResults.some(r => !r.success)) {
                  fetchDebugInfo()
                }
                
                // Add update results to debug info
                setDebugInfo((prev: any) => ({
                  ...prev,
                  updateResults
                }))
                
              } catch (error) {
                console.error('Error updating projects to featured:', error);
                setDebugInfo((prev: any) => ({
                  ...prev,
                  updateError: error instanceof Error ? error.message : String(error)
                }))
              }
            };
            
            updateFeaturedProjects();
          }
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error fetching newly added projects:', error)
          setError(error instanceof Error ? error.message : String(error))
          fetchDebugInfo() // Get debug info when there's an error
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
    
    return () => controller.abort()
  }, [])
  
  // Function to fetch debug information when there's an error
  const fetchDebugInfo = async () => {
    try {
      const response = await fetch('/api/debug')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error fetching debug info:', error)
    }
  }

  // Function to handle project expansion and scroll to it
  const handleProjectExpand = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
    
    // Smooth scroll to the project card when expanded
    if (expandedProject !== projectId && projectRefs.current[projectId]) {
      setTimeout(() => {
        projectRefs.current[projectId]?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }
  }

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto mb-16 px-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-800/40 to-blue-800/40 neon-border-purple-base p-6">
          <div className="flex justify-center items-center h-32">
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
  
  // Show error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto mb-16 px-4">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-800/40 to-purple-800/40 neon-border-red-base p-6">
          <div className="flex flex-col justify-center items-center">
            <div className="text-red-400 text-xl font-bold mb-3">Error Loading New Projects</div>
            <div className="text-white mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
            
            {debugInfo && (
              <div className="mt-6 w-full max-w-2xl mx-auto">
                <details className="bg-black/30 rounded-md p-3 border border-purple-500/30">
                  <summary className="text-purple-400 cursor-pointer">Debug Information</summary>
                  <div className="mt-2 text-xs font-mono text-gray-300 whitespace-pre-wrap max-h-40 overflow-auto">
                    {JSON.stringify(debugInfo, null, 2)}
                  </div>
                </details>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (newlyAddedProjects.length === 0) {
    return null
  }

  return (
    <>
      {/* Full-size Image Preview Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-6xl max-h-full">
            <button 
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative">
              <Image
                src={enlargedImage.image}
                alt="Full size preview"
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] rounded-lg"
                quality={95}
              />
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .neon-ring-effect {
          box-shadow: 0 0 15px rgba(147, 51, 234, 0.3);
          position: relative;
        }
        
        .neon-ring-effect::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: inherit;
          padding: 3px;
          background: linear-gradient(to right, #8b5cf6, #3b82f6);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .neon-ring-effect:hover::after {
          opacity: 1;
        }
        
        .magnetic-hover {
          transform-style: preserve-3d;
          transform: perspective(1000px);
          transition: transform 0.2s;
        }
        
        .tilt-effect {
          transform-style: preserve-3d;
          transition: transform 0.2s;
        }
        
        .tilt-effect:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
        }
        
        .color-shift-effect {
          position: relative;
        }
        
        .color-shift-effect::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4, #a18cd1);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        .color-shift-effect:hover::before {
          opacity: 0.15;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          pointer-events: none;
        }
        
        .particle-1 {
          top: 20%;
          left: 20%;
          animation: float 6s infinite ease-in-out;
        }
        
        .particle-2 {
          top: 80%;
          left: 80%;
          animation: float 8s infinite ease-in-out;
          animation-delay: 1s;
        }
        
        .particle-3 {
          top: 20%;
          left: 80%;
          animation: float 7s infinite ease-in-out;
          animation-delay: 2s;
        }
        
        .particle-4 {
          top: 80%;
          left: 20%;
          animation: float 9s infinite ease-in-out;
          animation-delay: 3s;
        }

        /* New Modern Animation Effects */
        .morph-transition {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        .morph-transition::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
          opacity: 0;
          transition: opacity 0.5s ease;
          border-radius: inherit;
          z-index: 1;
        }
        
        .morph-transition:hover {
          transform: translateY(-5px);
        }
        
        .morph-transition:hover::before {
          opacity: 1;
        }
        
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
          transform: translate(-50%, -50%) scale(0);
          border-radius: 50%;
          opacity: 0;
          transition: transform 1s ease, opacity 1s ease;
        }
        
        .ripple-effect:hover::after {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        
        .floating-elements {
          position: relative;
        }
        
        .floating-elements::before,
        .floating-elements::after {
          content: '';
          position: absolute;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0) 70%);
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .floating-elements::before {
          width: 100px;
          height: 100px;
          top: -30px;
          right: -30px;
          animation: float-element 8s ease-in-out infinite;
        }
        
        .floating-elements::after {
          width: 80px;
          height: 80px;
          bottom: -20px;
          left: -20px;
          animation: float-element 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .floating-elements:hover::before,
        .floating-elements:hover::after {
          opacity: 1;
        }
        
        @keyframes float-element {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(15px, -15px);
          }
        }
        
        .shimmering {
          position: relative;
          overflow: hidden;
        }
        
        .shimmering::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transform: skewX(-25deg);
          animation: shimmer-animation 3s infinite;
        }
        
        @keyframes shimmer-animation {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }
        
        /* Enhanced shadow effects */
        .shadow-3d {
          box-shadow: 
            0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -4px rgba(0, 0, 0, 0.2),
            0 -2px 10px -3px rgba(147, 51, 234, 0.1) inset;
        }
        
        .shadow-layered {
          box-shadow:
            0 0 0 1px rgba(147, 51, 234, 0.1),
            0 4px 10px -2px rgba(147, 51, 234, 0.2),
            0 8px 20px -4px rgba(59, 130, 246, 0.2);
        }
        
        .shadow-ambient {
          box-shadow:
            0 0 20px 10px rgba(147, 51, 234, 0.1),
            0 0 0 1px rgba(147, 51, 234, 0.1);
        }
        
        .shadow-highlight {
          box-shadow:
            0 0 15px 2px rgba(255, 255, 255, 0.1),
            0 0 30px 5px rgba(147, 51, 234, 0.2);
        }
        
        /* New border styles */
        .border-glowing {
          position: relative;
        }
        
        .border-glowing::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(
            45deg,
            #8b5cf6,
            #3b82f6,
            #8b5cf6,
            #3b82f6
          );
          border-radius: inherit;
          z-index: -1;
          animation: border-rotate 4s linear infinite;
        }
        
        @keyframes border-rotate {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }
        
        .border-pulsating {
          position: relative;
        }
        
        .border-pulsating::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: transparent;
          border-radius: inherit;
          border: 2px solid rgba(147, 51, 234, 0.5);
          animation: border-pulse 2s ease-in-out infinite;
        }
        
        @keyframes border-pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
        
        .border-double {
          box-shadow:
            0 0 0 1px rgba(147, 51, 234, 0.3),
            0 0 0 4px rgba(147, 51, 234, 0.1);
        }
        
        .border-gradient {
          position: relative;
          background-clip: padding-box;
          border: 2px solid transparent;
        }
        
        .border-gradient::before {
          content: '';
          position: absolute;
          inset: 0;
          margin: -2px;
          border-radius: inherit;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6);
          z-index: -1;
        }

        /* Expanded view specific styles */
        [data-expanded="true"] {
          position: relative;
          background-color: rgba(17, 24, 39, 0.9);
          transition: all 0.3s ease;
        }
        
        [data-expanded="true"] .project-content {
          position: relative;
          z-index: 10;
        }
        
        [data-expanded="true"] .project-title {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.025em;
          margin-bottom: 0.75rem;
        }
        
        [data-expanded="true"] .project-description {
          line-height: 1.5;
          font-size: 0.875rem;
        }
        
        [data-expanded="true"] .project-details {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 1rem;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        [data-expanded="true"] .project-timeline {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        [data-expanded="true"] .project-timeline-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        [data-expanded="true"] .timeline-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        
        [data-expanded="true"] .timeline-line {
          flex: 1;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.1);
        }
      `}</style>
      <section className="relative py-20 px-4 bg-black">
        {/* Professional Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/5 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Professional Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="px-4 py-2 bg-purple-600/10 text-purple-300 rounded-full text-sm font-semibold border border-purple-600/20">
                Latest Releases
              </span>
            </div>
            
            <h2 className={`text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight ${audiowide.className}`}>
              Recently Launched
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed mb-8">
              Fresh from development - explore our newest additions featuring cutting-edge 
              technology, innovative design, and exclusive features that push the boundaries of modern web development.
            </p>
            
            {/* Professional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {[
                { label: 'New Projects', value: newlyAddedProjects.length, color: 'purple' },
                { label: 'In Development', value: newlyAddedProjects.filter(p => p.status === 'In Development').length, color: 'blue' },
                { label: 'Beta Testing', value: newlyAddedProjects.filter(p => p.status === 'Beta Testing').length, color: 'green' },
                { label: 'Launched', value: newlyAddedProjects.filter(p => p.status === 'Recently Launched').length, color: 'yellow' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${
                    stat.color === 'purple' ? 'text-purple-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'green' ? 'text-green-400' :
                    'text-yellow-400'
                  }`}>{stat.value}</div>
                  <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Professional Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'New Projects', value: newlyAddedProjects.length, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
              { label: 'In Development', value: newlyAddedProjects.filter(p => p.status === 'In Development').length, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
              { label: 'Beta Testing', value: newlyAddedProjects.filter(p => p.status === 'Beta Testing').length, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
              { label: 'Launched', value: newlyAddedProjects.filter(p => p.status === 'Recently Launched').length, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' }
            ].map((stat, index) => (
              <div key={index} className={`${stat.bg} ${stat.border} border rounded-xl p-4 text-center transition-all duration-300 hover:scale-105`}>
                <div className={`text-2xl md:text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Clean Projects List Layout */}
          <div className="space-y-6">
            {newlyAddedProjects.map((project, index) => {
              const isExpanded = expandedProject === project.id;
              
              return (
                <div 
                  key={project.id}
                  ref={(el) => {
                    projectRefs.current[project.id] = el;
                  }}
                  className={`
                    relative overflow-hidden rounded-xl transition-all duration-500 ease-out
                    ${isExpanded 
                      ? 'bg-black border border-purple-500/30 shadow-2xl shadow-purple-900/20' 
                      : 'bg-black border border-gray-700/50 hover:border-purple-500/30'
                    }
                  `}
                >
                  {/* Professional New Badge */}
                  {project.visualEffects?.showBadge && (
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-black border border-purple-500/50 text-purple-300 text-xs font-semibold px-3 py-1 rounded-full">
                        NEW
                      </div>
                    </div>
                  )}
                  
                  {/* Organized Content Layout */}
                  <div className={`${isExpanded ? 'grid lg:grid-cols-5 gap-6' : 'grid md:grid-cols-4 gap-4'} p-6`}>
                    
                    {/* Project Image Section - Clean Layout */}
                    <div className={`${isExpanded ? 'lg:col-span-2' : 'md:col-span-1'} relative`}>
                      <div className={`relative ${isExpanded ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden rounded-lg border border-gray-600/50 cursor-pointer group`}
                           onClick={() => setEnlargedImage({projectId: project.id, image: project.image})}>
                        {project.showBothImagesInPriority && project.secondImage && project.secondImage !== '/projects/placeholder.jpg' ? (
                          <div className="w-full h-full flex">
                            <div className="w-1/2 h-full relative">
                              <Image
                                src={project.image}
                                alt={project.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="25vw"
                                loading="lazy"
                                quality={75}
                              />
                            </div>
                            <div className="w-1/2 h-full relative">
                              <Image
                                src={project.secondImage}
                                alt={`Second view of ${project.title}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="25vw"
                                loading="lazy"
                                quality={75}
                              />
                            </div>
                          </div>
                        ) : (
                          project.image && (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes={isExpanded ? "40vw" : "25vw"}
                              loading="lazy"
                              quality={isExpanded ? 85 : 75}
                            />
                          )
                        )}
                        
                        {/* Zoom overlay icon */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-full p-2">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Image Controls */}
                      {isExpanded && project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && (
                        <div className="mt-3 flex justify-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const updatedProject = {...project};
                              const temp = updatedProject.image;
                              updatedProject.image = updatedProject.secondImage || '';
                              updatedProject.secondImage = temp;
                              setNewlyAddedProjects(newlyAddedProjects.map(p => 
                                p.id === project.id ? updatedProject : p
                              ));
                            }}
                            className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/50 text-purple-300 text-xs rounded-lg hover:bg-purple-600/30 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                            Show Secondary Image
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnlargedImage({projectId: project.id, image: project.secondImage || project.image});
                            }}
                            className="px-3 py-1.5 bg-blue-600/20 border border-blue-500/50 text-blue-300 text-xs rounded-lg hover:bg-blue-600/30 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            Full Preview
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Project Information Section - Organized */}
                    <div className={`${isExpanded ? 'lg:col-span-3' : 'md:col-span-3'} space-y-4`}>
                      
                      {/* Header with Status and Controls */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {/* Status Badge */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
                              project.status === 'In Development' 
                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30' 
                                : project.status === 'Beta Testing'
                                  ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                                  : 'bg-green-500/10 text-green-300 border-green-500/30'
                            }`}>
                              <span className="w-2 h-2 bg-current rounded-full mr-2 animate-pulse"></span>
                              {project.status || 'In Development'}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center">
                              <svg className="w-3 h-3 mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {project.updatedDays || 1} days ago
                            </span>
                          </div>
                          
                          {/* Title and Description */}
                          <h3 className={`font-bold text-white mb-2 ${
                            isExpanded ? 'text-2xl' : 'text-xl line-clamp-1'
                          }`}>
                            {project.title.startsWith('NEWLY ADDED:') 
                              ? project.title.replace('NEWLY ADDED:', '') 
                              : project.title}
                          </h3>
                          <p className={`text-gray-300 text-sm leading-relaxed ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}>
                            {project.description}
                          </p>
                        </div>
                        
                        {/* Expand/Collapse Button */}
                        <button 
                          onClick={() => handleProjectExpand(project.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                            isExpanded 
                              ? 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500' 
                              : 'bg-black hover:bg-gray-900 text-gray-300 border border-gray-600/50'
                          }`}
                          aria-label={isExpanded ? "Collapse details" : "Expand details"}
                        >
                          {isExpanded ? (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              Collapse
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                              Details
                            </>
                          )}
                        </button>
                      </div>
                  
                  {/* Progress Bar */}
                  {project.progress !== undefined && (
                    <div className="mb-5">
                      <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                          style={{ width: `${project.progress}%`, willChange: 'width' }}
                        />
                      </div>
                      {expandedProject === project.id && (
                        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                          <span>Development Progress</span>
                          <span>{project.progress}% Complete</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Technologies */}
                    <div className="flex flex-wrap gap-1 md:gap-1.5 mb-3 md:mb-5">
                      {(expandedProject === project.id ? project.technologies : project.technologies.slice(0, 3)).map((tech, index) => (
                      <span
                        key={index}
                          className="px-1.5 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                      {expandedProject !== project.id && project.technologies.length > 3 && (
                        <span className="px-1.5 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-medium bg-gray-800 text-gray-400">
                          +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  {/* Features Preview */}
                  {project.features && project.features.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {(expandedProject === project.id ? project.features : project.features.slice(0, 2)).map((feature, index) => (
                          <li key={index} className="flex items-start text-xs text-gray-400">
                            <svg className="w-3 h-3 text-purple-400 mr-1.5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className={expandedProject === project.id ? '' : 'line-clamp-1'}>{feature}</span>
                          </li>
                        ))}
                        {expandedProject !== project.id && project.features.length > 2 && (
                          <li className="text-xs text-gray-500">+{project.features.length - 2} more features</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* Image Controls for Expanded View - Show Secondary Image Button */}
                  {expandedProject === project.id && (
                    <div className="mb-5">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Image Options:</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* Always show full size view button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEnlargedImage({projectId: project.id, image: project.image});
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/50 text-blue-300 text-sm rounded-lg hover:from-blue-600/30 hover:to-green-600/30 transition-all flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                          View Full Size
                        </button>
                        
                        {/* Show secondary image controls if available */}
                        {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' ? (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedProject = {...project};
                                const temp = updatedProject.image;
                                updatedProject.image = updatedProject.secondImage || '';
                                updatedProject.secondImage = temp;
                                setNewlyAddedProjects(newlyAddedProjects.map(p => 
                                  p.id === project.id ? updatedProject : p
                                ));
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 text-purple-300 text-sm rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 transition-all flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                              Show Secondary Image
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEnlargedImage({projectId: project.id, image: project.secondImage || project.image});
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-green-600/20 to-yellow-600/20 border border-green-500/50 text-green-300 text-sm rounded-lg hover:from-green-600/30 hover:to-yellow-600/30 transition-all flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              View Secondary Full Size
                            </button>
                          </>
                        ) : (
                          <div className="px-4 py-2 bg-gray-800/50 border border-gray-600/50 text-gray-400 text-sm rounded-lg flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            No secondary image available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Expanded View Details */}
                  {expandedProject === project.id && (
                    <div className="mt-6 mb-5 grid grid-cols-1 md:grid-cols-3 gap-4 project-content">
                      {/* Left: Project Image Larger View */}
                      <div className="md:col-span-1">
                        <div className="relative aspect-square overflow-hidden rounded-lg border border-purple-600/30 cursor-pointer group"
                             onClick={() => setEnlargedImage({projectId: project.id, image: project.image})}>
                          {project.image && (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="eager"
                              quality={85}
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          )}
                          
                          {/* Zoom overlay icon */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 rounded-full p-3">
                              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Second Image Controls - Only show if there's a second image */}
                        {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && (
                          <div className="mt-3 flex flex-col gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const updatedProject = {...project};
                                const temp = updatedProject.image;
                                updatedProject.image = updatedProject.secondImage || '';
                                updatedProject.secondImage = temp;
                                
                                setNewlyAddedProjects(newlyAddedProjects.map(p => 
                                  p.id === project.id ? updatedProject : p
                                ));
                              }}
                              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/50 text-purple-300 text-sm rounded-lg hover:from-purple-600/30 hover:to-blue-600/30 transition-all flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                              Show Secondary Image
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setEnlargedImage({projectId: project.id, image: project.secondImage || project.image});
                              }}
                              className="w-full px-4 py-2 bg-gradient-to-r from-blue-600/20 to-green-600/20 border border-blue-500/50 text-blue-300 text-sm rounded-lg hover:from-blue-600/30 hover:to-green-600/30 transition-all flex items-center justify-center gap-2"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                              View Secondary in Full Size
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {/* Right: Additional Details */}
                      <div className="md:col-span-2 space-y-4">
                        {/* Timeline */}
                        <div className="project-details">
                          <h4 className="text-sm font-medium text-purple-300 mb-2">Development Timeline</h4>
                          <div className="project-timeline">
                            <div className="project-timeline-item">
                              <div className="timeline-dot bg-green-400"></div>
                              <div className="text-xs text-gray-300">Project Started</div>
                              <div className="timeline-line"></div>
                              <div className="text-xs text-gray-400">{project.updatedDays ? project.updatedDays + 14 : 15} days ago</div>
                            </div>
                            <div className="project-timeline-item">
                              <div className="timeline-dot bg-blue-400"></div>
                              <div className="text-xs text-gray-300">Last Updated</div>
                              <div className="timeline-line"></div>
                              <div className="text-xs text-gray-400">{project.updatedDays || 1} days ago</div>
                            </div>
                            <div className="project-timeline-item">
                              <div className="timeline-dot bg-purple-400"></div>
                              <div className="text-xs text-gray-300">Estimated Completion</div>
                              <div className="timeline-line"></div>
                              <div className="text-xs text-gray-400">
                                {project.progress !== undefined
                                  ? project.progress >= 100 
                                    ? 'Completed'
                                    : `In ${Math.ceil((100 - project.progress) / 10)} weeks`
                                  : 'TBD'}
                              </div>
                            </div>
                            <div className="project-timeline-item">
                              <div className="timeline-dot bg-yellow-400"></div>
                              <div className="text-xs text-gray-300">Featured Status</div>
                              <div className="timeline-line"></div>
                              <div className="text-xs text-gray-400">
                                {project.featured ? 'Featured' : (project.updatedDays && project.updatedDays >= 3) 
                                  ? 'Will be featured soon'
                                  : project.updatedDays 
                                    ? `In ${3 - project.updatedDays} days` 
                                    : 'In 3 days'}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Technical Overview */}
                        <div className="project-details">
                          <h4 className="text-sm font-medium text-purple-300 mb-2">Technical Overview</h4>
                          <div className="text-xs text-gray-400 space-y-1.5">
                            <p>
                              This project utilizes {project.technologies.slice(0, 3).join(', ')} 
                              {project.technologies.length > 3 ? ` and ${project.technologies.length - 3} other technologies` : ''} to 
                              deliver a seamless user experience.
                            </p>
                            <p>
                              Currently at {project.progress || 50}% completion, with active development on 
                              {project.features && project.features.length > 0 
                                ? ` ${project.features[0].toLowerCase()}`
                                : ' core features'}.
                            </p>
                          </div>
                        </div>
                        
                        {/* Exclusive Features - Display with new effects but only when expanded (don't apply extra effects) */}
                        {project.exclusiveFeatures && project.exclusiveFeatures.length > 0 && (
                          <div className={`${expandedProject === project.id ? 'project-details' : 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-3 border border-purple-500/30'} relative overflow-hidden`}>
                            {expandedProject !== project.id && (
                              <>
                            <div className="absolute -right-6 -top-6 w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-full blur-xl"></div>
                            <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-gradient-to-tr from-purple-600/20 to-blue-500/20 rounded-full blur-xl"></div>
                              </>
                            )}
                            
                            <h4 className="text-sm font-medium bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2 flex items-center">
                              <span className="inline-block w-4 h-4 mr-1.5">
                                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                              </span>
                              Exclusive Features
                            </h4>
                            
                            <ul className="space-y-1.5 relative">
                              {project.exclusiveFeatures.map((feature, index) => (
                                <li key={index} className="flex items-start text-xs">
                                  <span className="inline-flex items-center justify-center w-4 h-4 bg-purple-500/20 text-purple-400 rounded-full mr-1.5 flex-shrink-0 mt-0.5">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                                    </svg>
                                  </span>
                                  <span className="text-gray-300">{feature}</span>
                                </li>
                              ))}
                              {expandedProject !== project.id && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                              )}
                            </ul>
                            
                            <div className="mt-2 flex justify-end">
                              <span className="text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                                Only in this version
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className={`flex gap-3 ${expandedProject === project.id ? 'mt-6' : 'hidden'}`}>
                    <Link 
                      href={`/projects/${project.id}`} 
                      className={`flex-1 text-center py-2.5 rounded-lg ${
                        expandedProject === project.id 
                          ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white font-medium text-sm hover:from-purple-700 hover:to-purple-900 shadow-md' 
                          : 'bg-purple-600 text-white font-medium text-sm hover:bg-purple-700'
                      } transition`}
                    >
                      View Details
                    </Link>
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`${
                        expandedProject === project.id 
                          ? 'w-auto px-4 flex items-center justify-center rounded-lg bg-gray-800/60 backdrop-blur-sm text-gray-300 hover:bg-gray-700/60 transition text-sm' 
                          : 'w-10 flex items-center justify-center rounded-lg bg-gray-800/60 backdrop-blur-sm text-gray-300 hover:bg-gray-700/60 transition'
                      }`}
                    >
                      {expandedProject === project.id ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Visit Project
                        </>
                      ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      )}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
          </div>
        </div>
      </section>
    </>
  )
} 