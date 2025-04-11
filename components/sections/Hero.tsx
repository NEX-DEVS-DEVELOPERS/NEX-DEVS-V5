"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useCallback, useEffect } from "react"
import { useIsMobile } from '@/app/utils/deviceDetection'
import TrustedBy from './TrustedBy'

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
    title: "AI AGENTS & WEB APP",
    description: "Custom AI agents and web applications",
    icon: "🤖",
    isTrending: true // Flag to indicate this is trending
  },
  {
    title: "MOBILE APP Development",
    description: "Cross-platform native mobile experiences",
    icon: "📱",
    isNew: true // Flag to indicate this is newly added
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

// Update the tech skills data with the requested percentages
const techSkills = [
  {
    category: "Fullstack",
    skills: [
      { name: "NEXTJS", level: 99, icon: "⚛️" },
      { name: "REACT", level: 84, icon: "⚛️" },
      { name: "REACT NATIVE", level: 81, icon: "📱" },
      { name: "NODE+EXPRESS", level: 89, icon: "🚀" },
      { name: "DJANGO", level: 86, icon: "🐍" }
    ]
  },
  {
    category: "Languages",
    skills: [
      { name: "TYPESCRIPT", level: 95, icon: "📘" },
      { name: "JAVASCRIPT", level: 95, icon: "💛" },
      { name: "PYTHON", level: 85, icon: "🐍" },
      { name: "PHP", level: 82, icon: "🐘" },
      { name: "C#", level: 87, icon: "🔷" },
      { name: "JS", level: 96, icon: "📜" }
    ]
  },
  {
    category: "UI Libraries",
    skills: [
      { name: "SPLINE", level: 88, icon: "🎮" },
      { name: "THREE.JS", level: 85, icon: "🌟" },
      { name: "TAILWIND", level: 92, icon: "🎨" },
      { name: "SHADCN", level: 90, icon: "✨" },
      { name: "V0 BY VERCEL", level: 86, icon: "⚡" }
    ]
  },
  {
    category: "Mobile Development",
    skills: [
      { name: "FLUTTER", level: 79, icon: "📱" },
      { name: "LYNX", level: 73, icon: "📱" },
      { name: "REACT EXPO", level: 90, icon: "📱" }
    ]
  },
  {
    category: "Frontend",
    skills: [
      { name: "HTML", level: 95, icon: "🌐" },
      { name: "CSS", level: 95, icon: "🎨" },
      { name: "JS", level: 95, icon: "💛" }
    ]
  },
  {
    category: "Backend",
    skills: [
      { name: "NODE.JS", level: 92, icon: "🟢" },
      { name: "PYTHON", level: 88, icon: "🐍" },
      { name: "JAVA", level: 85, icon: "☕" }
    ]
  },
  {
    category: "Databases",
    skills: [
      { name: "MYSQL", level: 90, icon: "🐬" },
      { name: "POSTGRES", level: 88, icon: "🐘" },
      { name: "MONGODB", level: 85, icon: "🍃" },
      { name: "SQLITE", level: 88, icon: "🗃️" }
    ]
  },
  {
    category: "DevOps & Tools",
    skills: [
      { name: "DOCKER", level: 88, icon: "🐳" },
      { name: "GIT", level: 92, icon: "📝" }
    ]
  }
]

// Pre-define animation variants with optimized values
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
}

// Define sparkle animation with reduced complexity
const sparkleVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "linear"
    }
  }
}

// Optimize bounce animation
const bounceVariants = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "linear"
    }
  }
}

// Add optimized skill card animation
const skillCardVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: {
      duration: 0.15,
      ease: "easeIn"
    }
  }
}

export default function Hero() {
  const [showSecretPanel, setShowSecretPanel] = useState(false)
  const isMobile = useIsMobile()
  const [funFactIndex, setFunFactIndex] = useState(0)
  const [activeSkillSet, setActiveSkillSet] = useState(0)
  // Add new state for auto animation toggle
  const [isAutoAnimating, setIsAutoAnimating] = useState(true)

  // Memoize handlers
  const nextFunFact = useCallback(() => {
    setFunFactIndex((prev) => (prev + 1) % funFacts.length)
  }, [])

  const toggleSecretPanel = useCallback(() => {
    setShowSecretPanel(prev => !prev)
  }, [])

  // Add carousel navigation
  const nextSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev + 1) % techSkills.length)
  }, [])

  const prevSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev - 1 + techSkills.length) % techSkills.length)
  }, [])

  // Add auto-animation toggle handler
  const toggleAutoAnimation = useCallback(() => {
    setIsAutoAnimating(prev => !prev)
  }, [])

  // Add another callback to manually navigate in vertical direction
  const nextVerticalSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev + 1) % techSkills.length)
  }, [])

  const prevVerticalSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev - 1 + techSkills.length) % techSkills.length)
  }, [])

  // Auto advance carousel every 6 seconds, only if auto-animation is enabled
  useEffect(() => {
    if (!isAutoAnimating) return;
    
    let animationFrameId: number;
    let lastTime = performance.now();
    const interval = 6000; // 6 seconds
    
    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= interval) {
        nextSkillSet();
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    // Add a check to pause animation when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [nextSkillSet, isAutoAnimating]);

  // Memoize current fun fact
  const currentFunFact = useMemo(() => funFacts[funFactIndex], [funFactIndex])
  // Memoize current skill set
  const currentSkillSet = useMemo(() => techSkills[activeSkillSet], [activeSkillSet])

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
      {/* Optimize gradient effects by reducing blur radius and using will-change */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[24px] will-change-transform" 
             style={{ transform: 'translate3d(0, 0, 0)' }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[24px] will-change-transform" 
             style={{ transform: 'translate3d(0, 0, 0)' }} />
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[24px] will-change-transform" 
             style={{ transform: 'translate3d(0, 0, 0)' }} />
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
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative inline-flex items-center ml-2 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="relative px-2 py-0.5 text-[10px] font-medium bg-black/50 text-purple-300 rounded-full border border-purple-500/30 backdrop-blur-sm
                                 group-hover:text-purple-200 group-hover:border-purple-500/50 transition-all duration-300 tracking-wider flex items-center gap-1">
                    <span className="animate-pulse">✨</span> VIBE CODER
                  </span>
                </motion.div>
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
          {/* Replace the Text Showcase Section with Tech Skills Carousel */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[240px] sm:h-[280px] w-full group"
          >
            <div className="absolute inset-0 rounded-[24px] overflow-hidden backdrop-blur-xl">
              {/* Simplified, consistent background for all slides */}
              <div className="absolute inset-0 bg-white/[0.03] border border-white/10 z-0"></div>
              
              {/* Subtle glass effect */}
              <div className="absolute inset-0 backdrop-blur-sm backdrop-saturate-150 z-0"></div>
              
              <div className="h-full w-full p-4 sm:p-5 relative z-10 transition-all duration-300">
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base sm:text-lg font-medium flex items-center gap-2">
                      <span className="text-white/90">{currentSkillSet.category}</span>
                      <motion.span 
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          repeatDelay: 3 
                        }}
                        className="text-white/70"
                      >
                        {currentSkillSet.category === "Fullstack" ? "⚛️" : 
                         currentSkillSet.category === "Languages" ? "📜" : 
                         currentSkillSet.category === "Backend" ? "🛢️" : "✨"}
                      </motion.span>
                    </h3>
                    <div className="flex gap-2 items-center">
                      <button 
                        onClick={toggleAutoAnimation}
                        className={`text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1.5
                                    ${isAutoAnimating 
                                      ? 'bg-white/10 text-white/90' 
                                      : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                        aria-label={isAutoAnimating ? "Turn off auto-slide" : "Turn on auto-slide"}
                      >
                        <span className={`text-xs ${isAutoAnimating ? 'text-white/90' : 'text-white/70'}`}>
                          {isAutoAnimating ? '🔄' : '⏸️'}
                        </span>
                        <span className="text-xs font-medium">
                          {isAutoAnimating ? 'Auto' : 'Manual'}
                        </span>
                      </button>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={prevSkillSet}
                          className="p-1.5 rounded-full bg-white/5 hover:bg-white/10
                                   active:scale-95 transition-all group"
                          aria-label="Previous skill set"
                        >
                          <span className="text-base text-white/70 group-hover:text-white/90 transition-colors">←</span>
                        </button>
                        <button 
                          onClick={nextSkillSet}
                          className="p-1.5 rounded-full bg-white/5 hover:bg-white/10
                                   active:scale-95 transition-all group"
                          aria-label="Next skill set"
                        >
                          <span className="text-base text-white/70 group-hover:text-white/90 transition-colors">→</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto thin-scrollbar pr-1">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeSkillSet}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="space-y-3"
                      >
                        {currentSkillSet.skills.map((skill, idx) => (
                          <motion.div
                            key={skill.name}
                            variants={skillCardVariants}
                            transition={{ 
                              duration: 0.15,
                              delay: idx * 0.03,
                              ease: "easeOut"
                            }}
                            className="flex items-center gap-2.5 transition-all group/skill hover:bg-white/[0.05] p-1.5 rounded-lg"
                            style={{
                              willChange: 'transform, opacity',
                              transform: 'translate3d(0, 0, 0)'
                            }}
                          >
                            <div className="w-8 h-8 flex items-center justify-center rounded-lg 
                                         bg-white/[0.05] group-hover/skill:bg-white/[0.08] transition-all duration-300">
                              <span className="text-base group-hover/skill:scale-110 transition-transform duration-300">{skill.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-white/90 text-sm font-medium group-hover/skill:text-white/100 transition-colors">{skill.name}</span>
                                <span className="text-xs text-white/70 font-medium tabular-nums bg-white/[0.05] px-1.5 py-0.5 rounded-full group-hover/skill:text-white/90 group-hover/skill:bg-white/[0.08] transition-all">{skill.level}%</span>
                              </div>
                              <div className="h-1.5 bg-white/[0.03] rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div 
                                  className="h-full rounded-full"
                                  style={{
                                    background: "linear-gradient(90deg, rgba(139,92,246,0.6) 0%, rgba(168,85,247,0.8) 100%)",
                                    boxShadow: "0 0 8px rgba(139,92,246,0.2)",
                                    willChange: 'width',
                                    transform: 'translate3d(0, 0, 0)'
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${skill.level}%`,
                                    transition: { 
                                      duration: 0.5,
                                      delay: idx * 0.03,
                                      ease: "easeOut"
                                    }
                                  }}
                                  whileHover={{ 
                                    boxShadow: "0 0 12px rgba(139,92,246,0.4)"
                                  }}
                                ></motion.div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Updated carousel indicators */}
                  <div className="flex justify-center gap-1.5 pt-4">
                    {techSkills.map((skillSet, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSkillSet(idx)}
                        className="group flex flex-col items-center"
                        aria-label={`Go to ${skillSet.category} skills`}
                      >
                        <span className="text-[10px] text-white/50 group-hover:text-white/80 transition-colors mb-1.5 hidden sm:block">
                          {skillSet.category.substring(0, 3)}
                        </span>
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${
                            idx === activeSkillSet 
                              ? 'bg-gradient-to-r from-purple-500 to-purple-400 w-6 shadow-[0_0_8px_rgba(139,92,246,0.3)]' 
                              : 'bg-white/10 group-hover:bg-white/20 w-3'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {expertise.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={`relative border border-white/20 p-2 sm:p-3 rounded-xl hover:border-white hover:bg-white/5 transition-colors
                            ${skill.isNew ? 'border-purple-400/50' : ''}
                            ${skill.isTrending ? 'border-blue-400/50' : ''}`}
                >
                  {/* Add sparkling effect and "newly added" badge for new items */}
                  {skill.isNew && (
                    <>
                      <div className="absolute -top-1 -right-1 z-10">
                        <div className="relative">
                          <motion.span
                            variants={sparkleVariants}
                            animate="animate"
                            className="absolute -top-1 -left-1 text-yellow-300 text-xs"
                          >
                            ✨
                          </motion.span>
                          <motion.span
                            variants={sparkleVariants}
                            animate="animate"
                            transition={{ delay: 0.4 }}
                            className="absolute top-0 -right-1 text-yellow-300 text-xs"
                          >
                            ✨
                          </motion.span>
                          <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                            NEW
                          </span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Add trending badge with bounce animation */}
                  {skill.isTrending && (
                    <motion.div 
                      className="absolute -top-1 -right-1 z-10"
                      variants={bounceVariants}
                      animate="animate"
                    >
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                        TRENDING
                      </span>
                    </motion.div>
                  )}

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
    </motion.section>
  )
} 