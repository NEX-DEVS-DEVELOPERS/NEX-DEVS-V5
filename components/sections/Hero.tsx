"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useCallback } from "react"
import { useIsMobile } from '@/app/utils/deviceDetection'

// Move static data outside component to prevent recreation
const expertise = [
  {
    title: "Website Development",
    description: "Full-stack development with modern technologies",
    icon: "💻"
  },
  {
    title: "WordPress & Shopify",
    description: "E-commerce and CMS solutions",
    icon: "🛍️"
  },
  {
    title: "UI/UX Design",
    description: "Figma & Framer expert",
    icon: "🎨"
  },
  {
    title: "SEO & Content",
    description: "Strategic content writing & optimization",
    icon: "📝"
  },
  {
    title: "AI & Web Apps",
    description: "Custom AI agents and web applications",
    icon: "🤖"
  }
]

const workProcess = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "Deep dive into requirements, tech stack selection, and project roadmap creation",
    icon: "🎯"
  },
  {
    step: "02",
    title: "Design & Architecture",
    description: "Creating scalable solutions with modern architecture patterns",
    icon: "⚡"
  },
  {
    step: "03",
    title: "Development & Testing",
    description: "Agile development with continuous integration and testing",
    icon: "🛠️"
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Smooth deployment and ongoing maintenance",
    icon: "🚀"
  }
]

const funFacts = [
  {
    icon: "🚀",
    title: "Code Wizard",
    fact: "I once debugged a production issue while sleeping! (In my dreams, of course)"
  },
  {
    icon: "🎮",
    title: "Gaming Dev",
    fact: "I hide easter eggs in all my projects. Can you find them all?"
  },
  {
    icon: "☕",
    title: "Coffee Powered",
    fact: "My code runs on a special fuel: Coffee.parseInt('espresso')"
  },
  {
    icon: "🌙",
    title: "Night Owl",
    fact: "Best code commits happen at 3 AM when the bugs are sleeping"
  },
  {
    icon: "🎵",
    title: "Code & Music",
    fact: "I listen to lofi beats while coding. It's my debugging soundtrack!"
  }
]

// Pre-define animation variants
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
}

export default function Hero() {
  const [showSecretPanel, setShowSecretPanel] = useState(false)
  const isMobile = useIsMobile()
  const [funFactIndex, setFunFactIndex] = useState(0)

  // Memoize handlers
  const nextFunFact = useCallback(() => {
    setFunFactIndex((prev) => (prev + 1) % funFacts.length)
  }, [])

  const toggleSecretPanel = useCallback(() => {
    setShowSecretPanel(prev => !prev)
  }, [])

  // Memoize current fun fact
  const currentFunFact = useMemo(() => funFacts[funFactIndex], [funFactIndex])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const mobileVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={isMobile ? mobileVariants : variants}
      transition={{ duration: isMobile ? 0.3 : 0.5 }}
      className="relative min-h-screen flex flex-col justify-center items-center py-20 px-6 mt-16 sm:mt-20"
    >
      {/* Optimize gradient effects by reducing blur radius and containing them */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[32px] will-change-transform translate-x-0" 
             style={{ animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[32px] will-change-transform translate-x-0" 
             style={{ animation: 'pulse 4s ease-in-out infinite 1s' }} />
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[32px] will-change-transform" 
             style={{ animation: 'pulse 4s ease-in-out infinite 2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 relative z-10 overflow-x-hidden">
        {/* Left Column - Adjusted for mobile */}
        <div className="space-y-8 sm:space-y-12 mt-8 md:mt-0">
          <motion.div 
            variants={fadeInUpVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.2 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="text-sm bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              hello I am
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <motion.div 
                className="text-white cursor-pointer relative group inline-block"
                onClick={toggleSecretPanel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Fun Fact Indicator - Visible on all devices */}
                <div className="absolute -top-8 left-[75%] transform -translate-x-1/2 text-sm text-purple-400 whitespace-nowrap
                              flex items-center gap-2 animate-bounce">
                  <span className="text-base rotate-[180deg]">👆</span>
                  <span className="text-xs font-medium bg-black/80 px-2 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm">
                    Click for fun fact!
                  </span>
                </div>
                
                ALI <span className="bg-white text-black px-2 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">HASNAAT</span>
              </motion.div>
              <div className="block mt-6 md:mt-4">
                <span className="border-2 border-white text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-default inline-block">
                  FULLSTACK DEVELOPER
                </span>
              </div>
            </h1>

            {/* Mobile Easter Egg Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sm:hidden mt-4 relative"
            >
              <button
                onClick={toggleSecretPanel}
                className="w-full px-4 py-3 rounded-xl border border-purple-500/30 
                         bg-gradient-to-r from-purple-500/10 to-purple-600/10
                         hover:from-purple-500/20 hover:to-purple-600/20 
                         backdrop-blur-sm transition-all duration-300
                         flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl animate-pulse">✨</span>
                  <div className="text-left">
                    <p className="text-white/90 text-sm font-medium">Discover Fun Facts</p>
                    <p className="text-purple-400/80 text-xs">Tap to reveal secrets!</p>
                  </div>
                </div>
                <span className="text-purple-400/80 text-lg group-hover:translate-x-1 transition-transform duration-300">→</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6 md:space-y-4 mt-4 md:mt-0"
              suppressHydrationWarning
            >
              <div className="space-y-4">
                <div className="text-base sm:text-lg text-gray-400 max-w-xl">
                  Crafting exceptional digital experiences through clean code and innovative solutions.
                </div>
                <div className="flex flex-wrap gap-2 items-center text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Available for new projects
                  </span>
                  <span className="hidden sm:inline px-2">•</span>
                  <span>Based in Pakistan</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Work Process - Mobile Optimized */}
          <div className="space-y-2 sm:space-y-6 mt-6 sm:mt-12">
            <h3 className="text-lg sm:text-xl font-semibold text-white/90 px-1 mb-2 sm:mb-4">How I Work</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-4">
              {workProcess.map((process, index) => (
                <motion.div
                  key={process.step}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl border border-white/10 
                           hover:border-purple-500/50 transition-all bg-white/5 hover:bg-white/10"
                >
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 
                               border border-purple-500/20 shrink-0">
                    <span className="text-base sm:text-xl">{process.icon}</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-purple-400/80">{process.step}</span>
                      <h4 className="font-medium text-sm sm:text-base text-white/90">{process.title}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{process.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link 
              href="/contact" 
              className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition group flex items-center gap-2 text-sm sm:text-base"
            >
              Let's Talk 
              <motion.span 
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Link>
            <Link 
              href="/projects" 
              className="border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-white hover:text-black transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              View Projects
              <motion.span 
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </div>

        {/* Right Column - Mobile Optimized */}
        <motion.div 
          variants={isMobile ? mobileVariants : scaleInVariant}
          initial="hidden"
          animate="visible"
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
          className="flex flex-col gap-4 sm:gap-6"
        >
          {/* Text Showcase Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[250px] sm:h-[300px] group"
          >
            <div className="absolute inset-0 border border-white/20 rounded-2xl overflow-hidden">
              <div className="h-full w-full p-4 sm:p-8 bg-gradient-to-br from-white/5 to-white/10 
                            backdrop-blur-sm group-hover:from-white/10 group-hover:to-white/15 
                            transition-all duration-500">
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-white transition-colors">
                      Transforming Ideas
                      <span className="block text-gray-400 group-hover:text-white transition-colors">
                        Into Digital Reality
                      </span>
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 group-hover:text-gray-200 transition-colors">
                      Specialized in crafting modern web experiences 
                      that combine aesthetics with functionality
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-white/5 border 
                                 border-white/10 text-gray-300 group-hover:border-white/50 
                                 group-hover:bg-white group-hover:text-black transition-all">
                      Modern Stack
                    </span>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-white/5 border 
                                 border-white/10 text-gray-300 group-hover:border-white/50 
                                 group-hover:bg-white group-hover:text-black transition-all">
                      Clean Code
                    </span>
                    <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-white/5 border 
                                 border-white/10 text-gray-300 group-hover:border-white/50 
                                 group-hover:bg-white group-hover:text-black transition-all">
                      Best Practices
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-white/20 p-3 sm:p-4 rounded-xl hover:border-white transition-colors"
            >
              <h4 className="text-2xl sm:text-3xl font-bold text-white">50+</h4>
              <p className="text-xs sm:text-sm text-gray-400">Projects Completed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-white/20 p-3 sm:p-4 rounded-xl hover:border-white transition-colors"
            >
              <h4 className="text-2xl sm:text-3xl font-bold text-white">5+</h4>
              <p className="text-xs sm:text-sm text-gray-400">Years Experience</p>
            </motion.div>
          </div>

          {/* Skills Section - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3 sm:space-y-4"
          >
            <h4 className="text-sm sm:text-base font-medium text-white mb-2 sm:mb-4">Skills & Expertise</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {expertise.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="border border-white/20 p-2 sm:p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl">{skill.icon}</span>
                    <div>
                      <h5 className="text-white text-xs sm:text-sm font-medium">{skill.title}</h5>
                      <p className="text-gray-400 text-xs">{skill.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Fun Facts Modal - Mobile Optimized */}
      <AnimatePresence>
        {showSecretPanel && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:fixed sm:top-1/2 sm:left-1/2 
                      sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2
                      bg-black/95 sm:rounded-xl border-t border-purple-500/50 sm:border
                      backdrop-blur-lg w-full sm:w-[90%] sm:max-w-md mx-auto 
                      shadow-2xl shadow-purple-500/20"
          >
            <div className="relative p-6">
              <div className="absolute right-4 top-4 sm:-top-3 sm:-right-3">
                <button 
                  onClick={toggleSecretPanel}
                  className="w-8 h-8 bg-black/80 rounded-full flex items-center justify-center 
                            text-white hover:bg-purple-500/40 transition-colors 
                            border-2 border-purple-500/50 shadow-lg text-lg"
                >
                  ×
                </button>
              </div>
              
              <motion.div
                key={funFactIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="text-center space-y-4 pt-2"
              >
                <div className="bg-gradient-to-r from-purple-500/20 via-purple-400/20 to-purple-500/20 
                              p-5 rounded-lg border border-purple-500/30">
                  <span className="text-4xl sm:text-5xl block mb-2">{currentFunFact.icon}</span>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                    {currentFunFact.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 px-2 leading-relaxed">
                  {currentFunFact.fact}
                </p>
                <button
                  onClick={nextFunFact}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 
                           rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 
                           transition-all duration-300 text-white text-sm font-medium 
                           border-2 border-purple-500/30 hover:border-purple-500/50 
                           active:scale-95 shadow-lg shadow-purple-500/20
                           flex items-center justify-center gap-2"
                >
                  <span>Next Fun Fact</span>
                  <span className="text-lg">→</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isMobile && (
        <div className="text-center text-sm text-gray-800 bg-white p-4 rounded shadow-md border border-gray-300 mt-4">
          <p>Preview this website in laptop or desktop view. The animations and effects are off for mobile users for a better experience.</p>
        </div>
      )}
    </motion.section>
  )
} 