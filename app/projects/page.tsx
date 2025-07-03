'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import FeaturedProject from '../components/FeaturedProject'
import NewlyAddedProjects from '../components/NewlyAddedProjects'
import ProjectsGrid from '../components/ProjectsGrid'
import ProjectImageGallery from '../components/ProjectImageGallery'

// Add fun facts array
const funFacts = [
  "My code is so clean, it makes soap jealous! ✨",
  "I named all my bugs 'Feature' - now the client loves them! 🐛",
  "My keyboard has worn-out Ctrl, C, and V keys... I wonder why 🤔",
  "I don't always test my code, but when I do, I do it in production 😎",
];

// Add ASCII art decorations
const AsciiDecorations = {
  rocket: `
  ▲
 ▲ ▲
█████
 ███
  █
`,
  laptop: `
 ┌───────┐
 │ >_    │
 │       │
 └───────┘
`,
  terminal: `
┌──────────┐
│ $ code . │
└──────────┘
`,
  diamond: `
   ╱╲
  ╱  ╲
  ╲  ╱
   ╲╱
`
};

// Add loading animation component
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
);

// Add scroll optimization styles
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

export default function ProjectsPage() {
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
    const factIndex = Math.floor(Math.random() * funFacts.length);
    setRandomFact(funFacts[factIndex]);
  }, []);
  
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
      }
    }
    
    checkProjectsData()
  }, [])

  return (
    <>
      <style jsx global>{scrollStyles}</style>
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-purple-500 transform-gpu will-change-transform"
        style={{ scaleX, transformOrigin: '0%' }}
      />
      
      <div className="min-h-screen pt-24 lg:pt-32 px-2 sm:px-4 md:px-6 bg-[#0a0a0a] content-wrapper">
        {/* Hero Section */}
        <motion.div 
          className="max-w-7xl mx-auto mb-8 md:mb-12 scroll-optimize"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(147,51,234,0.5)] tracking-tight">
                My Projects
              </h1>
              <p className="text-base text-gray-300 max-w-xl">
                Explore my complete portfolio of projects, from web applications to design work.
              </p>
            </div>
            
            <div className="hidden md:block bg-black/30 p-3 rounded-lg border border-purple-500/20 max-w-xs">
              <p className="text-purple-300 text-sm italic">💡 {randomFact}</p>
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
            {/* Featured Projects Section - Directly after hero */}
            <motion.div
              className="scroll-optimize transform-gpu will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <h2 className="text-3xl font-bold text-white mb-8">Featured Projects</h2>
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
                <h2 className="text-3xl font-bold text-white mb-8">Cutting-Edge Technologies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Frontend Technologies */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-purple-400">Frontend</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>React & Next.js</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>Framer Motion</li>
                    </ul>
                  </div>
                  {/* Backend Technologies */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-purple-400">Backend</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>Node.js & Express</li>
                      <li>Python & Django</li>
                      <li>PostgreSQL & MongoDB</li>
                      <li>Redis & Prisma</li>
                    </ul>
                  </div>
                  {/* Cloud & DevOps */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-purple-400">Cloud & DevOps</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li>AWS & Vercel</li>
                      <li>Docker & Kubernetes</li>
                      <li>CI/CD Pipelines</li>
                      <li>Monitoring & Analytics</li>
                    </ul>
                  </div>
                  {/* AI & Tools */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-purple-400">AI & Tools</h3>
                    <ul className="space-y-2 text-gray-300">
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
                <h2 className="text-3xl font-bold text-white mb-8">AI Integration & AI Controlled Websites</h2>
                {/* AI Integration content */}
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
                <h3 className="text-xl font-semibold text-purple-300 mb-3">No projects found</h3>
                <p className="text-gray-400">Check back later for exciting new projects!</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Coming Soon Section */}
        <motion.section 
          className="max-w-7xl mx-auto mb-12 md:mb-16 scroll-optimize"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="bg-black/60 rounded-xl overflow-hidden">
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
                  <Link href="#" className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base transition-all duration-300 flex items-center gap-2 font-medium">
                    <span>Follow Updates</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                  
                  <Link href="#" className="px-6 py-3 rounded-full border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-sm md:text-base transition-all duration-300">
                    View Roadmap
                  </Link>
                </div>
              </div>
              
              <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-black to-[#121212] p-0 relative overflow-hidden rounded-r-xl border-l border-gray-800">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600 opacity-80"></div>
                <div className="absolute right-10 top-28 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl -z-10"></div>
                <div className="absolute left-10 bottom-10 w-40 h-40 rounded-full bg-blue-600/10 blur-3xl -z-10"></div>
                
                {/* Code editor header */}
                <div className="bg-black/80 backdrop-blur-sm py-2 px-4 flex items-center justify-between border-b border-gray-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-500 font-mono">Upcoming-Projects.tsx</div>
                  <div className="w-4"></div> {/* Spacer for balance */}
                </div>
                
                {/* Code content */}
                <div className="p-6 font-mono text-sm text-gray-300 h-full overflow-hidden relative">
                  {/* Line numbers */}
                  <div className="absolute left-2 top-6 text-right text-gray-600 select-none">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                      <div key={num} className="h-6 text-xs">{num}</div>
                    ))}
                  </div>
                  
                  {/* Code with syntax highlighting */}
                  <div className="ml-8">
                    <div className="h-6 text-purple-400">// Next project in development</div>
                    <div className="h-6 flex">
                      <span className="text-purple-400">const </span>
                      <span className="text-green-400 ml-1">upcomingProjects</span>
                      <span className="text-white ml-1">= </span>
                      <span className="text-blue-300">[</span>
                    </div>
                    <div className="h-6 text-blue-300">{'  {'}</div>
                    <div className="h-6 pl-4 flex">
                      <span className="text-yellow-400">name</span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-500 ml-1">"AI-Powered Portfolio Builder"</span>
                      <span className="text-gray-400">,</span>
                    </div>
                    <div className="h-6 pl-4 flex">
                      <span className="text-yellow-400">progress</span>
                      <span className="text-gray-400">: </span>
                      <span className="text-blue-300 ml-1">86</span>
                      <span className="text-gray-400">,</span>
                    </div>
                    <div className="h-6 pl-4 flex">
                      <span className="text-yellow-400">eta</span>
                      <span className="text-gray-400">: </span>
                      <span className="text-green-500 ml-1">"2 weeks"</span>
                    </div>
                    <div className="h-6 text-blue-300">{'  }'}</div>
                    <div className="h-6 text-purple-400">{'  // More exciting projects coming...'}</div>
                    <div className="h-6 text-blue-300">{']'}</div>
                    
                    {/* Blinking cursor */}
                    <div className="h-1.5 w-2.5 bg-white absolute ml-1 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </>
  )
} 