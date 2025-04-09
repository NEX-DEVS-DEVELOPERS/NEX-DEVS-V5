'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

  // Fetch featured project
  useEffect(() => {
    const fetchFeaturedProject = async () => {
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
      <section className="max-w-7xl mx-auto mb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-8">
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
    <section className="max-w-7xl mx-auto mb-16">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-8">
        {/* Project Image Background */}
        <div className="absolute inset-0 z-0 opacity-20">
          {featuredProject.image && (
            <Image
              src={featuredProject.image}
              alt={featuredProject.title}
              fill
              className="object-cover transform-gpu hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1536px) 100vw, 1536px"
              priority
              quality={95}
              style={{ 
                WebkitBackfaceVisibility: 'hidden', 
                WebkitPerspective: 1000, 
                WebkitFilter: 'contrast(1.05) saturate(1.05) brightness(1.05)',
                objectFit: 'cover',
                transform: 'translateZ(0)'
              }}
              unoptimized={featuredProject.image.startsWith('data:')}
            />
          )}
        </div>
        <div className="relative z-10">
          <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
            🌟 Featured Project
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent">
            {featuredProject.title}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed">
            {featuredProject.description}
          </p>

          {/* Tools Grid - Only show for NEX-WEBS Tools */}
          {featuredProject.title === 'NEX-WEBS Tools' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🖼️ Image Compressor</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Optimize images without quality loss</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🔍 Plagiarism Checker</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Advanced content originality verification</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🤖 AI Detector</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Identify AI-generated content</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🎯 Keyword Positioning</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">SEO keyword rank tracking</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">✍️ Article Writer</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">AI-powered content generation</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🔑 API Access</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Developer API integration</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">📊 Domain Authority</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Website authority metrics</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🔗 Backlink Checker</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Analyze backlink profile</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">📝 Paraphrasing Tool</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Intelligent content rewriting</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
            {featuredProject.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
              >
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-3 md:gap-4 flex-col sm:flex-row">
            <Link
              href={`/projects/${featuredProject.id}`}
              className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-purple-500 text-white text-sm md:text-base font-medium hover:bg-purple-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
            >
              View Details <span className="text-lg md:text-xl">→</span>
            </Link>
            <a
              href={featuredProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-transparent text-purple-300 text-sm md:text-base font-medium border border-purple-500/30 hover:bg-purple-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              Live Preview
            </a>
          </div>
        </div>
      </div>
    </section>
  )
} 