'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'

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
  const projectRefs = useRef<{ [key: number]: HTMLDivElement | null }>({})

  // Fetch newly added projects with memoization
  useEffect(() => {
    const controller = new AbortController()
    
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects', {
          signal: controller.signal,
          next: { revalidate: 300 } // Cache for 5 minutes
        })
        const data = await response.json()
        
        // Filter projects with "NEWLY ADDED" in title or status is set
        const filtered = data.filter((project: Project) => 
          project.title.startsWith('NEWLY ADDED:') || 
          (project.status && ['In Development', 'Beta Testing', 'Recently Launched'].includes(project.status))
        )
        
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
                for (const project of projectsToUpdate) {
                  await fetch(`/api/projects/${project.id}`, {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ...project,
                      featured: true
                    })
                  });
                }
              } catch (error) {
                console.error('Error updating projects to featured:', error);
              }
            };
            
            updateFeaturedProjects();
          }
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          console.error('Error fetching newly added projects:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
    
    return () => controller.abort()
  }, [])

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
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-800/40 to-blue-800/40 border border-purple-600/30 p-6">
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

  if (newlyAddedProjects.length === 0) {
    return null
  }

  return (
    <>
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
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-4">
      {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 md:p-5 mb-4 md:mb-6 border border-purple-500/30 will-change-transform">
          <div className="flex items-center gap-2 md:gap-3">
          <div className="relative flex items-center">
              <div className="absolute -left-1 md:-left-1.5 -top-1 md:-top-1.5 w-6 md:w-8 h-6 md:h-8 bg-purple-500/20 rounded-full animate-ping"></div>
              <div className="relative w-4 md:w-5 h-4 md:h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mr-1.5 md:mr-2 flex items-center justify-center">
                <svg className="w-2.5 md:w-3 h-2.5 md:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
              <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent">
              New Projects
            </h2>
          </div>
            <span className="px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">
            Recently Added
          </span>
        </div>
      </div>
      
      {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 will-change-transform">
        {newlyAddedProjects.map((project) => {
          // Get animation classes based on project's visualEffects but only apply when not expanded
          const animationClasses = expandedProject === project.id ? '' : 
            project.visualEffects?.animation === 'pulse' ? 'animate-slowPulse' : 
            project.visualEffects?.animation === 'bounce' ? 'animate-bounce-slow' : 
            project.visualEffects?.animation === 'fade' ? 'animate-fade' : 
            project.visualEffects?.animation === 'reveal' ? 'animate-reveal' :
            project.visualEffects?.animation === 'float' ? 'animate-float' : 
            project.visualEffects?.animation === 'flip' ? 'hover:rotate-1 hover:scale-[1.02]' :
            project.visualEffects?.animation === 'slide-right' ? 'animate-slide-right' :
            project.visualEffects?.animation === 'glitch' ? 'animate-glitch' :
            project.visualEffects?.animation === 'swing' ? 'animate-swing' :
            project.visualEffects?.animation === 'spiral' ? 'animate-spiral' :
            project.visualEffects?.animation === 'elastic' ? 'animate-elastic' :
            project.visualEffects?.animation === 'jello' ? 'animate-jello' :
            project.visualEffects?.animation === 'vibrate' ? 'animate-vibrate' :
            project.visualEffects?.animation === 'pop' ? 'animate-pop' :
            project.visualEffects?.animation === 'shimmer' ? 'animate-shimmer' :
            project.visualEffects?.animation === 'morph' ? 
              project.visualEffects?.animationIntensity === 'subtle' ? 'animate-morph-subtle' : 
              project.visualEffects?.animationIntensity === 'medium' ? 'animate-morph-medium' : 
              project.visualEffects?.animationIntensity === 'strong' ? 'animate-morph-strong' : 
              'animate-morph' :
            project.visualEffects?.animation === 'wave' ? 'animate-wave' :
            project.visualEffects?.animation === 'float-smooth' ? 'animate-float-smooth' :
            '';
          
          // Get shadow classes - apply based on expanded state
          const shadowClasses = expandedProject === project.id ? 'shadow-md' :
            project.visualEffects?.shadows === 'soft' ? 'shadow-lg' :
            project.visualEffects?.shadows === 'hard' ? 'shadow-xl' :
            project.visualEffects?.shadows === 'neon' ? 'shadow-[0_0_20px_5px_rgba(147,51,234,0.4)]' :
            project.visualEffects?.shadows === 'gradient' ? 'shadow-[0_0_30px_5px_rgba(147,51,234,0.4),0_0_30px_10px_rgba(59,130,246,0.3)]' :
            project.visualEffects?.shadows === '3d' ? 'shadow-3d' :
            project.visualEffects?.shadows === 'layered' ? 'shadow-layered' :
            project.visualEffects?.shadows === 'ambient' ? 'shadow-ambient' :
            project.visualEffects?.shadows === 'highlight' ? 'shadow-highlight' :
            'shadow-md';
          
          // Get border classes - apply simpler border when expanded
          const borderClasses = expandedProject === project.id ? 'border border-purple-500/30' :
            project.visualEffects?.border === 'solid' ? 'border-2 border-purple-500/50' :
            project.visualEffects?.border === 'dashed' ? 'border-2 border-dashed border-purple-500/50' :
            project.visualEffects?.border === 'gradient' ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-[1px]' :
            project.visualEffects?.border === 'glow' ? 'border-2 border-purple-500/50 shadow-[0_0_10px_1px_rgba(147,51,234,0.4)]' :
            project.visualEffects?.border === 'animated' ? 'border-2 border-purple-500/50 animate-borderGlow' :
            project.visualEffects?.border === 'glowing' ? 'border-glowing' :
            project.visualEffects?.border === 'pulsating' ? 'border-pulsating' :
            project.visualEffects?.border === 'double' ? 'border-double' :
            project.visualEffects?.border === 'gradient-border' ? 'border-gradient' :
            'border border-purple-600/20';
            
          // Combined classes - only apply effect classes when not expanded
            const cardClasses = `relative overflow-hidden rounded-xl 
            ${expandedProject === project.id ? '' : project.visualEffects?.morphTransition ? 'morph-transition' : ''}
            ${expandedProject === project.id ? '' : project.visualEffects?.rippleEffect ? 'ripple-effect' : ''}
            ${expandedProject === project.id ? '' : project.visualEffects?.floatingElements ? 'floating-elements' : ''}
            ${expandedProject === project.id ? '' : project.visualEffects?.shimmering ? 'shimmering' : ''}
              ${shadowClasses} ${borderClasses} 
              transition-all duration-300 
              ${expandedProject === project.id ? 'md:col-span-2 ring-2 ring-purple-500/50' : ''}
              ${animationClasses}`;
          
          // Animation timing classes based on intensity if provided, but only when not expanded
          const animationTimingClass = expandedProject === project.id ? '' : 
            project.visualEffects?.animationTiming === 'fast' ? 'animation-duration-500' :
            project.visualEffects?.animationTiming === 'slow' ? 'animation-duration-3000' :
            project.visualEffects?.animationTiming === 'very-slow' ? 'animation-duration-5000' : '';
          
          return (
            <div 
              key={project.id}
              ref={(el) => {
                projectRefs.current[project.id] = el;
              }}
              className={`${cardClasses} ${animationTimingClass}`}
              style={{ 
                willChange: 'transform, opacity, border-radius',
                backdropFilter: project.visualEffects?.border === 'gradient' ? 'blur(12px)' : 'none',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {/* Wrapper for border gradient if needed */}
              <div 
                className={`${
                project.visualEffects?.border === 'gradient' 
                  ? 'rounded-xl h-full bg-gray-900/90 border border-purple-500/30' 
                  : 'bg-gray-900/50'
                }`}
                data-expanded={expandedProject === project.id}
              >

                {/* New Badge - Only show if visualEffects.showBadge is true */}
                {project.visualEffects?.showBadge && <NewBadge />}
                
                {/* Spotlight Effect - only when not expanded */}
                {project.visualEffects?.spotlight && expandedProject !== project.id && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-56 h-56 bg-purple-500/20 rounded-full blur-3xl opacity-50 animate-slowPulse"></div>
                    <div className="absolute -left-20 -bottom-20 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl opacity-50 animate-slowPulse" style={{ animationDelay: '2s' }}></div>
                  </div>
                )}
                
                {/* Background Effects - only when not expanded */}
                {expandedProject !== project.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                )}
                  
                {/* Particle Effects - only when not expanded */}
                {project.visualEffects?.particles && expandedProject !== project.id && (
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="particle particle-1"></div>
                      <div className="particle particle-2"></div>
                      <div className="particle particle-3"></div>
                      <div className="particle particle-4"></div>
                    </div>
                  )}
                  
                {/* Glassmorphism Effect - only when not expanded */}
                {project.visualEffects?.glassmorphism && expandedProject !== project.id && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20"></div>
                  )}
                
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  {project.showBothImagesInPriority && project.secondImage && project.secondImage !== '/projects/placeholder.jpg' ? (
                    // Show both images side by side when showBothImagesInPriority is true
                    <div className="w-full h-full flex">
                      <div className="w-1/2 h-full relative">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            expandedProject === project.id ? 'opacity-8' : 'opacity-10'
                          } ${project.visualEffects?.animationIntensity === 'subtle' ? 'filter-brightness-90' : ''}`}
                          sizes="50vw"
                          loading="lazy"
                          quality={expandedProject === project.id ? 85 : 70}
                          decoding="async"
                          fetchPriority={expandedProject === project.id ? "high" : "low"}
                        />
                      </div>
                      <div className="w-1/2 h-full relative">
                        <Image
                          src={project.secondImage}
                          alt={`Second view of ${project.title}`}
                          fill
                          className={`object-cover transition-opacity duration-300 ${
                            expandedProject === project.id ? 'opacity-8' : 'opacity-10'
                          } ${project.visualEffects?.animationIntensity === 'subtle' ? 'filter-brightness-90' : ''}`}
                          sizes="50vw"
                          loading="lazy"
                          quality={expandedProject === project.id ? 85 : 70}
                          decoding="async"
                          fetchPriority={expandedProject === project.id ? "high" : "low"}
                        />
                      </div>
                    </div>
                  ) : (
                    // Show only the main image when showBothImagesInPriority is false
                    project.image && (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className={`object-cover transition-opacity duration-300 ${
                          expandedProject === project.id ? 'opacity-8' : 'opacity-10'
                        } ${project.visualEffects?.animationIntensity === 'subtle' ? 'filter-brightness-90' : ''}`}
                        sizes={expandedProject === project.id 
                          ? "(max-width: 768px) 100vw, 100vw" 
                          : "(max-width: 768px) 100vw, 50vw"
                        }
                        loading="lazy"
                        quality={expandedProject === project.id ? 85 : 70}
                        decoding="async"
                        fetchPriority={expandedProject === project.id ? "high" : "low"}
                      />
                    )
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/80 to-black/80" />
                </div>
                
                {/* Content */}
                  <div className="relative z-10 p-3 md:p-5">
                  {/* Header with Status */}
                    <div className={`flex flex-wrap items-center justify-between gap-2 mb-3 md:mb-4 ${expandedProject === project.id ? 'pb-2 border-b border-purple-500/20' : ''}`}>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                        project.status === 'In Development' 
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                          : project.status === 'Beta Testing'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-green-500/20 text-green-300 border border-green-500/30'
                      }`}>
                          <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-current rounded-full mr-1 md:mr-1.5 animate-pulse"></span>
                        {project.status || 'In Development'}
                      </span>
                        <span className={`text-[10px] md:text-xs text-gray-400 flex items-center ${expandedProject === project.id ? 'bg-gray-800/50 px-2 py-0.5 rounded-full' : ''}`}>
                          <svg className="w-2.5 md:w-3 h-2.5 md:h-3 mr-0.5 md:mr-1 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {project.updatedDays || 1} days ago
                      </span>
                    </div>
                    
                    {/* Expand/Collapse Button */}
                    <button 
                      onClick={() => handleProjectExpand(project.id)}
                        className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded text-[10px] md:text-xs font-medium ${
                          expandedProject === project.id 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500' 
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700/50'
                        } flex items-center gap-1 md:gap-1.5 transition`}
                      aria-label={expandedProject === project.id ? "Collapse details" : "Expand details"}
                    >
                      {expandedProject === project.id ? (
                        <>
                            <svg className="w-3 md:w-3.5 h-3 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Collapse
                        </>
                      ) : (
                        <>
                            <svg className="w-3 md:w-3.5 h-3 md:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          Details
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Title and Description */}
                    <div className="mb-3 md:mb-4">
                      <h3 className={`${expandedProject === project.id ? 'project-title' : 'text-xl md:text-2xl font-bold text-white mb-1 md:mb-2'} ${expandedProject === project.id ? '' : 'line-clamp-1'}`}>
                      {project.title.startsWith('NEWLY ADDED:') 
                        ? project.title.replace('NEWLY ADDED:', '') 
                        : project.title}
                    </h3>
                      <p className={`${expandedProject === project.id ? 'project-description' : 'text-gray-300 text-xs md:text-sm'} ${expandedProject === project.id ? '' : 'line-clamp-2'}`}>
                      {project.description}
                    </p>
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
                  
                  {/* Expanded View Details */}
                  {expandedProject === project.id && (
                    <div className="mt-6 mb-5 grid grid-cols-1 md:grid-cols-3 gap-4 project-content">
                      {/* Left: Project Image Larger View */}
                      <div className="md:col-span-1">
                        <div className="relative aspect-square overflow-hidden rounded-lg border border-purple-600/30">
                          {project.image && (
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className="object-cover"
                              loading="eager"
                              quality={85}
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          )}
                        </div>
                        
                        {/* Second Image Toggle Button - Only show if there's a second image */}
                        {project.secondImage && project.secondImage !== '/projects/placeholder.jpg' && (
                          <div className="mt-2 flex justify-center">
                            <button 
                              onClick={() => {
                                // Create a temporary variable to hold the current project
                                const updatedProject = {...project};
                                // Swap the images
                                const temp = updatedProject.image;
                                updatedProject.image = updatedProject.secondImage || '';
                                updatedProject.secondImage = temp;
                                
                                // Update the project in the state
                                setNewlyAddedProjects(newlyAddedProjects.map(p => 
                                  p.id === project.id ? updatedProject : p
                                ));
                              }}
                              className="px-3 py-1.5 bg-blue-600/40 text-blue-300 text-xs rounded-lg border border-blue-600/40 hover:bg-blue-600/60 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                              </svg>
                              Switch Image
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
                  <div className={`flex gap-3 ${expandedProject === project.id ? 'mt-6' : ''}`}>
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
                          ? 'w-auto px-4 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition text-sm' 
                          : 'w-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition'
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
    </section>
    </>
  )
} 