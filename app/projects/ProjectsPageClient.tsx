'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import Link from 'next/link'
import NewlyAddedProjects from '@/frontend/components/NewlyAddedProjects'
import ProjectsGrid from '@/frontend/components/ProjectsGrid'
import ProjectImageGallery from '@/frontend/components/ProjectImageGallery'
import AISolutionsShowcase from '@/frontend/components/AISolutionsShowcase'
import MobileShowcase from '@/frontend/components/MobileShowcase'
import AutomationWorkflowsShowcase from '@/frontend/components/AutomationWorkflowsShowcase'
import VisionDrawer from '@/frontend/components/VisionDrawer'
import FloatingProjectsIndicator from '../../components/FloatingProjectsIndicator'
import { audiowide, vt323 } from '@/frontend/utils/fonts'

interface ProjectCategory {
  id: string
  name: string
  description: string
  count: number
  featured: boolean
}

interface ProjectsData {
  funFacts: string[]
  asciiDecorations: {
    rocket: string
    laptop: string
    terminal: string
    diamond: string
  }
  projectCategories: ProjectCategory[]
  stats: {
    totalProjects: number
    completedProjects: number
    activeProjects: number
    clientSatisfaction: number
  }
}

interface ProjectsPageClientProps {
  projectsData: ProjectsData
  loading: boolean
}

// Loading animation component
const LoadingDots = () => (
  <div className="flex space-x-1">
    {[1, 2, 3].map((dot) => (
      <div
        key={dot}
        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
        style={{ animationDelay: `${dot * 0.2}s` }}
      />
    ))}
  </div>
)

// Scroll optimization styles
const scrollStyles = `
  html {
    scroll-behavior: smooth;
  }
  
  body {
    overflow-y: overlay;
    -webkit-overflow-scrolling: touch;
  }
  
  /* Optimize scrolling performance */
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* Custom scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
    background: transparent;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(147, 51, 234, 0.5);
    border-radius: 5px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(147, 51, 234, 0.7);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  /* Optimize animations */
  .scroll-optimize {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform;
  }
  
  /* Prevent layout shifts */
  .content-wrapper {
    contain: content;
    content-visibility: auto;
  }
  
  /* Smooth anchor scrolling */
  html {
    scroll-padding-top: 2rem;
  }
  
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
  }
`

export default function ProjectsPageClient({ projectsData, loading }: ProjectsPageClientProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  const [isLoading, setIsLoading] = useState(true)
  const [hasProjects, setHasProjects] = useState(false)
  const [randomFact, setRandomFact] = useState<string>('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  

  
  // Select a random fun fact on load
  useEffect(() => {
    const factIndex = Math.floor(Math.random() * projectsData.funFacts.length);
    setRandomFact(projectsData.funFacts[factIndex]);
  }, [projectsData.funFacts]);
  
  // Check if projects data is loaded
  useEffect(() => {
    const checkProjectsData = async () => {
      try {
        // Add timestamp to force fresh data and prevent browser caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/projects?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        const data = await response.json()
        setHasProjects(data.length > 0)
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking projects data:', error)
        setIsLoading(false)
        // Assume we have projects if API fails
        setHasProjects(true)
      }
    }
    
    checkProjectsData()
  }, [])
  

  
  // Track scroll progress for smooth animations
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest)
  })
  
  useEffect(() => {
    // Initialize component
  }, [])
  
  // Auto-hide timer - removed
  // Component handles itself

  return (
    <>
      <style jsx global>{scrollStyles}</style>
      
      {/* Vision Drawer */}
      <VisionDrawer />
      
      {/* Floating Projects Indicator - Independent Component */}
      <FloatingProjectsIndicator 
        position="right"
        offset={{ x: 20, y: 0 }}
        showOnLoad={!isLoading && hasProjects}
        hideOnMobile={false}
        autoHide={false}
        theme="purple"
        className="transition-all duration-300"
      />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-500 transform-gpu will-change-transform z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />
      
      <div ref={containerRef} className="min-h-screen pt-12 px-2 sm:px-4 md:px-6 bg-[#0a0a0a] content-wrapper relative">
        

        
        {/* Floating Action Button - Scroll to Top */}
        <motion.button
          className="fixed bottom-8 right-8 z-50 bg-purple-600 hover:bg-purple-500 text-white p-4 rounded-full shadow-lg transition-all duration-300"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: scrollProgress > 0.1 ? 1 : 0,
            scale: scrollProgress > 0.1 ? 1 : 0
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
        {/* Fun Fact Section */}
        <motion.div 
          className="max-w-7xl mx-auto mb-8 md:mb-12 scroll-optimize"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="md:hidden bg-black/30 p-3 rounded-lg border border-purple-500/20 w-full">
              <p className={`text-purple-300 text-sm italic ${vt323.className}`}>💡 {randomFact}</p>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.section 
            className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6 scroll-optimize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto py-16 flex justify-center">
              <LoadingDots />
            </div>
          </motion.section>
        ) : hasProjects ? (
          <motion.div
            className="scroll-optimize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >


            {/* Project Gallery Carousel */}
            <motion.div
              className="scroll-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div id="nex-webs-specialty" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 bg-black rounded-2xl py-12">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="px-4 py-1 bg-green-600/20 text-green-300 rounded-full text-sm font-medium">
                      Visual Gallery
                    </span>
                  </div>
                  
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${audiowide.className}`}>NEX-WEBS SPECIALITY</h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    A visual journey through our web development projects and general portfolio work
                  </p>
                </div>
                <ProjectImageGallery />
              </div>
            </motion.div>

            {/* Mobile Applications Showcase */}
            <motion.div
              className="scroll-optimize transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Add ID for scroll targeting */}
              <div id="mobile-showcase" className="bg-black rounded-2xl py-12 mx-4 sm:mx-6 lg:mx-8">
                <MobileShowcase />
              </div>
            </motion.div>

            {/* AI Integration Section */}
            <motion.div
              className="scroll-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <section id="advanced-ai" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 bg-black rounded-2xl py-12">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <span className="px-4 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium">
                      AI Intelligence
                    </span>
                  </div>
                  
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${audiowide.className}`}>AI Integration & Controlled Websites</h2>
                  <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                    Advanced artificial intelligence integration services for websites, applications, and automated business processes
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
                    <h3 className={`text-xl font-semibold text-purple-300 mb-6 ${audiowide.className}`}>AI-Powered Features</h3>
                    <ul className={`space-y-3 text-gray-300 ${vt323.className}`}>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Intelligent chatbots with natural language processing</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Automated content generation and optimization</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Smart recommendation systems</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        <span>Predictive analytics and insights</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/30 rounded-xl p-8">
                    <h3 className={`text-xl font-semibold text-blue-300 mb-6 ${audiowide.className}`}>AI Integration Services</h3>
                    <ul className={`space-y-3 text-gray-300 ${vt323.className}`}>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Custom AI model training and deployment</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>API integration with leading AI platforms</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Workflow automation with AI decision making</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span>Real-time data processing and analysis</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
            </motion.div>

            {/* Newly Added Projects Section */}
            <motion.div
              className="scroll-optimize transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div id="newly-added" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 bg-black rounded-2xl py-12">
                <NewlyAddedProjects />
              </div>
            </motion.div>

            {/* AI Solutions Showcase */}
            <motion.div
              className="scroll-optimize transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div id="ai-solutions">
                <AISolutionsShowcase />
              </div>
            </motion.div>







            {/* AI Automation & Workflows Showcase */}
            <motion.div
              className="scroll-optimize transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div id="automation-workflows" className="bg-black rounded-2xl py-12 mx-4 sm:mx-6 lg:mx-8">
                <AutomationWorkflowsShowcase />
              </div>
            </motion.div>
            
            {/* Featured Automations Section */}
            <motion.div
              className="scroll-optimize transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div id="featured-automations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 bg-black rounded-2xl py-12">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className="px-4 py-1 bg-green-600/20 text-green-300 rounded-full text-sm font-medium">
                      Featured Automations
                    </span>
                  </div>
                  
                  <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${audiowide.className}`}>Automation Excellence</h2>
                  <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                    Showcasing our most successful automation implementations and workflow optimizations
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* End Section */}
            <div id="end" className="h-20"></div>
          </motion.div>
        ) : (
          <motion.section 
            className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6 scroll-optimize"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-7xl mx-auto py-16 text-center">
              <div className="bg-gray-900/50 rounded-xl p-8 border border-purple-500/20">
                <h3 className={`text-xl font-semibold text-purple-300 mb-3 ${audiowide.className}`}>No projects found</h3>
                <p className={`text-gray-400 ${vt323.className}`}>Check back later for exciting new projects!</p>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </>
  )
}

