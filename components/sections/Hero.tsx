"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useCallback } from "react"

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

  return (
    <div className="w-full bg-black text-white pt-32 pb-20 relative overflow-hidden">
      {/* Optimize gradient effects by reducing blur radius */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[64px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[64px] animate-pulse delay-700" />
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[64px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        {/* Left Column */}
        <div className="space-y-12">
          <motion.div 
            variants={fadeInUpVariant}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <motion.div
              variants={fadeInUpVariant}
              className="text-sm bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text"
            >
              hello I am
            </motion.div>

            <h1 className="text-6xl font-bold leading-tight">
              <motion.span 
                className="text-white cursor-pointer relative group"
                onClick={toggleSecretPanel}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                ALI <span className="bg-white text-black px-2 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">HASNAAT</span>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm text-purple-400 whitespace-nowrap">
                  <span className="animate-bounce inline-block">👆</span> Click for a fun fact!
                </span>
              </motion.span>
              <motion.span 
                variants={fadeInUpVariant}
                className="block mt-4"
              >
                <span className="border-2 border-white text-white px-6 py-2 rounded-lg text-base tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-default inline-block">
                  FULLSTACK DEVELOPER
                </span>
              </motion.span>
            </h1>
            <div className="space-y-4">
              <p className="text-gray-400 text-lg max-w-xl">
                Crafting exceptional digital experiences through clean code and innovative solutions.
              </p>
              <div className="flex gap-2 items-center text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Available for new projects
                </span>
                <span className="px-2">•</span>
                <span>Based in Pakistan</span>
              </div>
            </div>
          </motion.div>

          {/* Work Process - Use windowing for long lists if needed */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">How I Work</h3>
            <div className="grid grid-cols-1 gap-4">
              {workProcess.map((process, index) => (
                <motion.div
                  key={process.step}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all bg-white/5"
                >
                  <span className="text-2xl">{process.icon}</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{process.step}</span>
                      <h4 className="font-medium">{process.title}</h4>
                    </div>
                    <p className="text-sm text-gray-400">{process.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Link 
              href="/contact" 
              className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition group flex items-center gap-2"
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
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition"
            >
              View Projects
            </Link>
          </div>
        </div>

        {/* Right Column - Optimize animations */}
        <motion.div 
          variants={scaleInVariant}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Text Showcase Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[300px] group"
          >
            <div className="absolute inset-0 border border-white/20 rounded-2xl overflow-hidden">
              <div className="h-full w-full p-8 bg-gradient-to-br from-white/5 to-white/10 
                            backdrop-blur-sm group-hover:from-white/10 group-hover:to-white/15 
                            transition-all duration-500">
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-white transition-colors">
                      Transforming Ideas
                      <span className="block text-gray-400 group-hover:text-white transition-colors">
                        Into Digital Reality
                      </span>
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                      Specialized in crafting modern web experiences 
                      that combine aesthetics with functionality
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 text-sm rounded-full bg-white/5 border 
                                 border-white/10 text-gray-300 group-hover:border-white/50 
                                 group-hover:bg-white group-hover:text-black transition-all">
                      Modern Stack
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full bg-white/5 border 
                                 border-white/10 text-gray-300 group-hover:border-white/50 
                                 group-hover:bg-white group-hover:text-black transition-all">
                      Clean Code
                    </span>
                    <span className="px-3 py-1 text-sm rounded-full bg-white/5 border 
                                 border-white/10 text-gray-300 group-hover:border-white/50 
                                 group-hover:bg-white group-hover:text-black transition-all">
                      Best Practices
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats and Details */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-white/20 p-4 rounded-xl hover:border-white transition-colors"
            >
              <h4 className="text-3xl font-bold text-white">50+</h4>
              <p className="text-gray-400 text-sm">Projects Completed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-white/20 p-4 rounded-xl hover:border-white transition-colors"
            >
              <h4 className="text-3xl font-bold text-white">5+</h4>
              <p className="text-gray-400 text-sm">Years Experience</p>
            </motion.div>
          </div>

          {/* Achievement Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-white font-medium mb-4">Skills & Expertise</h4>
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="border border-white/20 p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">💻</span>
                  <div>
                    <h5 className="text-white text-sm font-medium">Website Development</h5>
                    <p className="text-gray-400 text-xs">Full-stack solutions</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="border border-white/20 p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛍️</span>
                  <div>
                    <h5 className="text-white text-sm font-medium">WordPress/Shopify</h5>
                    <p className="text-gray-400 text-xs">E-commerce expert</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border border-white/20 p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎨</span>
                  <div>
                    <h5 className="text-white text-sm font-medium">Figma/Framer</h5>
                    <p className="text-gray-400 text-xs">Design tools master</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="border border-white/20 p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <div>
                    <h5 className="text-white text-sm font-medium">UI/UX Design</h5>
                    <p className="text-gray-400 text-xs">Creative solutions</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="border border-white/20 p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🤖</span>
                  <div>
                    <h5 className="text-white text-sm font-medium">AI/Web Apps</h5>
                    <p className="text-gray-400 text-xs">Custom solutions</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="border border-white/20 p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  <div>
                    <h5 className="text-white text-sm font-medium">SEO/Content</h5>
                    <p className="text-gray-400 text-xs">Strategic writing</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Optimize modal rendering with AnimatePresence */}
      <AnimatePresence>
        {showSecretPanel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      z-50 bg-black/95 p-8 rounded-xl border border-purple-500 backdrop-blur-lg
                      w-full max-w-md"
          >
            <div className="relative">
              <button 
                onClick={toggleSecretPanel}
                className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full
                          flex items-center justify-center text-white hover:bg-purple-500/40
                          transition-colors"
              >
                ×
              </button>
              
              <motion.div
                key={funFactIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="text-center space-y-4"
              >
                <span className="text-4xl">{currentFunFact.icon}</span>
                <h3 className="text-xl font-bold text-purple-400">
                  {currentFunFact.title}
                </h3>
                <p className="text-gray-300">
                  {currentFunFact.fact}
                </p>
                <button
                  onClick={nextFunFact}
                  className="px-4 py-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30
                            transition-colors text-white mt-4 w-full"
                >
                  Next Fun Fact →
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 