'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'
import FeaturedProject from '../components/FeaturedProject'
import NewlyAddedProjects from '../components/NewlyAddedProjects'
import ProjectsGrid from '../components/ProjectsGrid'
import ProjectImageGallery from '../components/ProjectImageGallery'
import { audiowide, vt323 } from '@/app/utils/fonts'

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

  return (
    <>
      <style jsx global>{scrollStyles}</style>
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-500 transform-gpu will-change-transform z-50"
        style={{ scaleX, transformOrigin: '0%' }}
      />
      
      <div className="min-h-screen pt-12 px-2 sm:px-4 md:px-6 bg-[#0a0a0a] content-wrapper">
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
            {/* Featured Projects Section */}
            <motion.div
              className="scroll-optimize transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <h2 className={`text-3xl font-bold text-white mb-8 ${audiowide.className}`}>Featured Projects</h2>
                <FeaturedProject />
              </div>
            </motion.div>

            {/* Project Gallery Carousel */}
            <motion.div
              className="scroll-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <ProjectImageGallery />
            </motion.div>

            {/* Cutting-Edge Technologies Section */}
            <motion.div
              className="scroll-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <h2 className={`text-3xl font-bold text-white mb-8 ${audiowide.className}`}>Cutting-Edge Technologies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Frontend Technologies */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold text-purple-400 ${audiowide.className}`}>Frontend</h3>
                    <ul className={`space-y-2 text-gray-300 ${vt323.className}`}>
                      <li>React & Next.js</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Framer Motion</li>
                    </ul>
                  </div>
                  {/* Backend Technologies */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold text-purple-400 ${audiowide.className}`}>Backend</h3>
                    <ul className={`space-y-2 text-gray-300 ${vt323.className}`}>
                      <li>Node.js & Express</li>
                      <li>Python & Django</li>
                      <li>PostgreSQL & MongoDB</li>
                      <li>Redis & Prisma</li>
                    </ul>
                  </div>
                  {/* Cloud & DevOps */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold text-purple-400 ${audiowide.className}`}>Cloud & DevOps</h3>
                    <ul className={`space-y-2 text-gray-300 ${vt323.className}`}>
                      <li>AWS & Vercel</li>
                      <li>Docker & Kubernetes</li>
                      <li>CI/CD Pipelines</li>
                      <li>Monitoring & Analytics</li>
                    </ul>
                  </div>
                  {/* AI & Tools */}
                  <div className="space-y-4">
                    <h3 className={`text-xl font-semibold text-purple-400 ${audiowide.className}`}>AI & Tools</h3>
                    <ul className={`space-y-2 text-gray-300 ${vt323.className}`}>
                      <li>OpenAI Integration</li>
                      <li>Machine Learning</li>
                      <li>Design Systems</li>
                      <li>Performance Optimization</li>
                    </ul>
                  </div>
                </div>
              </section>
            </motion.div>

            {/* AI Integration Section */}
            <motion.div
              className="scroll-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <h2 className={`text-3xl font-bold text-white mb-8 ${audiowide.className}`}>AI Integration & AI Controlled Websites</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                    <h3 className={`text-xl font-semibold text-purple-300 mb-4 ${audiowide.className}`}>AI-Powered Features</h3>
                    <ul className={`space-y-2 text-gray-300 ${vt323.className}`}>
                      <li>• Intelligent chatbots with natural language processing</li>
                      <li>• Automated content generation and optimization</li>
                      <li>• Smart recommendation systems</li>
                      <li>• Predictive analytics and insights</li>
                    </ul>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                    <h3 className={`text-xl font-semibold text-purple-300 mb-4 ${audiowide.className}`}>AI Integration Services</h3>
                    <ul className={`space-y-2 text-gray-300 ${vt323.className}`}>
                      <li>• Custom AI model training and deployment</li>
                      <li>• API integration with leading AI platforms</li>
                      <li>• Workflow automation with AI decision making</li>
                      <li>• Real-time data processing and analysis</li>
                    </ul>
                  </div>
                </div>
              </section>
            </motion.div>

            {/* Projects Grid */}
            <motion.div
              className="scroll-optimize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <ProjectsGrid />
            </motion.div>
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
