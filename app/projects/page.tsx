'use client'

import { motion } from 'framer-motion'
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

// Adding smooth scrolling behavior to the body
const GlobalStyles = () => (
  <style jsx global>{`
    body {
      scroll-behavior: smooth;
    }
  `}</style>
);

export default function ProjectsPage() {
  const [easterEggCount, setEasterEggCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [hasProjects, setHasProjects] = useState(false)
  
  // Check if projects data is loaded
  useEffect(() => {
    const checkProjectsData = async () => {
      try {
        const response = await fetch('/api/projects')
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
    <div className="min-h-screen pt-32 px-6 bg-[#0a0a0a]">
      <GlobalStyles />
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
          My Projects
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl drop-shadow-[0_0_10px_rgba(147,51,234,0.2)]">
          Explore my complete portfolio of projects, from web applications to design work.
        </p>
        {showEasterEgg && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-black/90 rounded-xl border border-purple-500/30 z-50 backdrop-blur-md"
          >
            <p className="text-white text-lg font-medium">{easterEggMessage}</p>
          </motion.div>
        )}
      </div>

      {isLoading ? (
        <div className="max-w-7xl mx-auto py-16 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      ) : hasProjects ? (
        <>
          {/* Project Image Gallery Section */}
          <ProjectImageGallery />

          {/* New Section (Below Featured Project) */}
          <NewlyAddedProjects />

          {/* Featured Project */}
          <FeaturedProject />

      {/* Easter Egg Hint */}
      <section className="max-w-7xl mx-auto -mt-6 md:-mt-8 mb-8 md:mb-12">
        <div className="text-center">
          <p className="text-xs md:text-sm text-purple-400/70 cursor-default">
            👆 Click any project title 10 times for a surprise! 
          </p>
        </div>
      </section>

      {/* Projects Grid */}
          <ProjectsGrid />
        </>
      ) : (
        <div className="max-w-7xl mx-auto py-16 text-center">
          <div className="bg-gray-900/50 rounded-xl p-8 border border-purple-500/20">
            <h3 className="text-xl font-semibold text-purple-300 mb-3">No projects found</h3>
            <p className="text-gray-400">Check back later for exciting new projects!</p>
          </div>
        </div>
      )}

      {/* Coming Soon Section */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
        <div className="relative overflow-hidden rounded-xl p-6 md:p-8 border border-purple-500/20 bg-purple-500/5">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              New Projects Coming Soon
            </h2>
            <pre className="text-purple-400 text-xs mb-4 opacity-70 font-mono leading-none hidden md:block select-none">
              {AsciiDecorations.terminal}
            </pre>
            <p className="text-base md:text-lg text-purple-200/80 mb-4 md:mb-6">
              Stay tuned for exciting new projects! Follow me on social media for updates.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm md:text-base border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center gap-2">
                Follow Updates
                <LoadingDots />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 