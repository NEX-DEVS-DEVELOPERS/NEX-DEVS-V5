'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  link: string
  featured: boolean
}

export default function FeaturedProject() {
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Fetch featured project
  useEffect(() => {
    const fetchFeaturedProject = async () => {
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
        
        // Filter for NEX-WEBS Tools project or just take the first featured project
        const nexWebsProject = data.find((p: Project) => p.title === 'NEX-WEBS Tools')
        const firstFeatured = data.find((p: Project) => p.featured)
        
        setFeaturedProject(nexWebsProject || firstFeatured || null)
      } catch (error) {
        console.error('Error fetching featured project:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedProject()
  }, [])

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto mb-16 px-2 sm:px-4 md:px-0">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 p-4 sm:p-6 md:p-8 shadow-lg">
          <div className="flex justify-center items-center h-40">
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

  if (!featuredProject) {
    return null
  }

  return (
    <section className="w-full">
      <motion.div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 shadow-lg transform-gpu will-change-transform"
        initial={{ opacity: 0.8, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.3 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Featured Project Header */}
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-black/40 border-b border-purple-500/20 backdrop-blur-sm">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Latest Featured Project</h2>
        </div>
        
        {/* Project Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Project Image (Mobile: top, Desktop: left) */}
          <div className="w-full lg:w-1/2 aspect-video lg:aspect-auto relative overflow-hidden">
            {featuredProject.image && (
              <motion.div
                className="relative w-full h-full"
                initial={false}
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  className="object-cover transform-gpu will-change-transform"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  quality={85}
                  style={{ 
                    objectFit: 'cover',
                    WebkitBackfaceVisibility: 'hidden',
                    WebkitPerspective: 1000,
                    WebkitFilter: 'contrast(1.05) saturate(1.05)',
                  }}
                  unoptimized={featuredProject.image.startsWith('data:')}
                />
              </motion.div>
            )}
            {/* Gradient overlay with optimized backdrop-filter */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent transform-gpu will-change-transform"></div>
            
            {/* Mobile title with optimized transforms */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 lg:hidden transform-gpu will-change-transform"
              initial={false}
              animate={{ y: isHovered ? -5 : 0, opacity: isHovered ? 0.9 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-1">
                {featuredProject.title}
              </h2>
              <p className="text-sm text-purple-300">
                {featuredProject.category}
              </p>
            </motion.div>
          </div>
          
          {/* Project Details with optimized animations */}
          <motion.div 
            className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 transform-gpu will-change-transform"
            initial={false}
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Desktop title */}
            <div className="hidden lg:block mb-4">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent transform-gpu will-change-transform"
                initial={false}
                animate={{ scale: isHovered ? 1.02 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {featuredProject.title}
              </motion.h2>
              <p className="text-base text-purple-300 mt-1">
                {featuredProject.category}
              </p>
            </div>
            
            <p className="text-sm md:text-base text-gray-300 mb-6 leading-relaxed">
              {featuredProject.description}
            </p>

            {/* Tools Grid with optimized hover effects */}
            {featuredProject.title === 'NEX-WEBS Tools' &&
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {[
                  { icon: '🖼️', title: 'Image Compressor', desc: 'Optimize images without quality loss' },
                  { icon: '🔍', title: 'Plagiarism Checker', desc: 'Content originality verification' },
                  { icon: '🤖', title: 'AI Detector', desc: 'Identify AI-generated content' },
                  { icon: '🎯', title: 'Keyword Positioning', desc: 'SEO keyword rank tracking' }
                ].map((tool, index) => (
                  <motion.div
                    key={tool.title}
                    className="bg-black/30 p-3 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group transform-gpu will-change-transform"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  >
                    <h3 className="text-sm md:text-base font-semibold text-purple-300 mb-1 group-hover:text-purple-200">
                      {tool.icon} {tool.title}
                    </h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300">{tool.desc}</p>
                  </motion.div>
                ))}
              </div>
            }

            {/* Technologies tags with optimized animations */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredProject.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 transform-gpu will-change-transform"
                  initial={false}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
            
            {/* Action buttons with optimized hover effects */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={`/projects/${featuredProject.id}`}
                  className="px-4 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10 transform-gpu will-change-transform"
                >
                  View Details <span className="text-lg">→</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href={featuredProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-lg bg-transparent text-purple-300 text-sm font-medium border border-purple-500/30 hover:bg-purple-500/10 transition-all flex items-center justify-center transform-gpu will-change-transform"
                >
                  Live Preview
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
} 