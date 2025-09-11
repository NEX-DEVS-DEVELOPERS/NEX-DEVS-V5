'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

interface FloatingProjectsIndicatorProps {
  className?: string
  position?: 'right' | 'left'
  offset?: {
    x?: number
    y?: number
  }
  showOnLoad?: boolean
  hideOnMobile?: boolean
  autoHide?: boolean
  theme?: 'purple' | 'blue' | 'green' | 'orange'
}

// Configuration for the guide sections with proper SVG icons
const guideSections = [
  { 
    name: "NEX-WEBS SPECIALITY", 
    shortName: "Web Development",
    nextSection: "Mobile Applications",
    id: "nex-webs-specialty", 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    ),
    color: "text-green-400" 
  },
  { 
    name: "Mobile Applications", 
    shortName: "Mobile Apps",
    nextSection: "Recently Launched",
    id: "mobile-showcase", 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zM8 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm3 10a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
    color: "text-blue-400" 
  },
  { 
    name: "Recently Launched", 
    shortName: "New Projects",
    nextSection: "Intelligent Systems & AI Solutions",
    id: "newly-added", 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832L14 10.202a1 1 0 000-1.404l-4.445-2.63z" clipRule="evenodd" />
      </svg>
    ),
    color: "text-orange-400" 
  },
  { 
    name: "Intelligent Systems & AI Solutions", 
    shortName: "AI Integration",
    nextSection: "Advanced AI Technologies",
    id: "ai-solutions", 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    ),
    color: "text-purple-400" 
  },
  { 
    name: "Advanced AI Technologies", 
    shortName: "Advanced AI",
    nextSection: "AI Automation & Workflows",
    id: "advanced-ai", 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-yellow-400" 
  },
  { 
    name: "AI Automation & Workflows", 
    shortName: "AI Automation",
    nextSection: "Featured Automations",
    id: "automation-workflows", 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
      </svg>
    ),
    color: "text-cyan-400" 
  },
  { 
    name: "Featured Automations", 
    shortName: "Featured Automations",
    nextSection: "Complete",
    id: "featured-automations", 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
    color: "text-pink-400" 
  },
  { 
    name: "Complete", 
    shortName: "Complete",
    nextSection: "Thank you!",
    id: "end", 
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    color: "text-emerald-400" 
  }
]

const FloatingProjectsIndicator: React.FC<FloatingProjectsIndicatorProps> = ({
  className = '',
  position = 'right',
  offset = { x: 24, y: 0 },
  showOnLoad = true,
  hideOnMobile = false,
  autoHide = false,
  theme = 'purple'
}) => {
  const { scrollYProgress } = useScroll()
  const [currentSection, setCurrentSection] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasProjects, setHasProjects] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [shouldAutoHide, setShouldAutoHide] = useState(false)
  const [sectionsFound, setSectionsFound] = useState<boolean[]>(new Array(guideSections.length).fill(false))
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const autoHideTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastDetectedSection = useRef<number>(0)

  // Theme configurations
  const themeConfig = {
    purple: {
      primary: 'purple-400',
      secondary: 'purple-500',
      border: 'purple-500/50',
      glow: 'purple-500/20',
      shadow: 'purple-500/25'
    },
    blue: {
      primary: 'blue-400',
      secondary: 'blue-500', 
      border: 'blue-500/50',
      glow: 'blue-500/20',
      shadow: 'blue-500/25'
    },
    green: {
      primary: 'green-400',
      secondary: 'green-500',
      border: 'green-500/50', 
      glow: 'green-500/20',
      shadow: 'green-500/25'
    },
    orange: {
      primary: 'orange-400',
      secondary: 'orange-500',
      border: 'orange-500/50',
      glow: 'orange-500/20', 
      shadow: 'orange-500/25'
    }
  }

  const currentTheme = themeConfig[theme]

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)
      if (process.env.NODE_ENV === 'development') {
        console.log(`📱 Mobile detection: ${isMobileDevice ? 'Mobile' : 'Desktop'} (${window.innerWidth}px)`)
      }
    }

    // Initial check
    checkMobile()

    // Listen for resize events
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // Check if projects are available and validate sections
  useEffect(() => {
    const checkProjects = () => {
      // Check if any of the project sections exist and mark them as found
      const foundSections = guideSections.map(section => {
        const element = document.getElementById(section.id)
        const exists = !!element
        if (exists && process.env.NODE_ENV === 'development') {
          console.log(`✓ Section found: ${section.name} (${section.id})`)
        } else if (process.env.NODE_ENV === 'development') {
          console.warn(`⚠ Section missing: ${section.name} (${section.id})`)
        }
        return exists
      })
      
      setSectionsFound(foundSections)
      const hasAnyProjects = foundSections.some(found => found)
      setHasProjects(hasAnyProjects)
      
      if (hasAnyProjects && showOnLoad) {
        setIsVisible(true)
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 FloatingProjectsIndicator initialized with ${foundSections.filter(f => f).length}/${foundSections.length} sections found`)
        }
      }
    }

    // Initial check
    checkProjects()
    
    // Set up interval to check periodically (in case content loads dynamically)
    const interval = setInterval(checkProjects, 1000)
    
    // Clean up interval after 10 seconds
    const cleanup = setTimeout(() => {
      clearInterval(interval)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Section detection monitoring stopped')
      }
    }, 10000)
    
    return () => {
      clearInterval(interval)
      clearTimeout(cleanup)
    }
  }, [showOnLoad])

  // Handle scroll-based section detection with enhanced intersection observer
  useEffect(() => {
    if (!hasProjects) return

    const sectionIds = guideSections.map(section => section.id)
    
    // Initialize with first section
    setCurrentSection(0)
    
    // Create a more robust intersection observer with multiple thresholds
    const observerOptions = {
      threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
      rootMargin: '-10% 0px -10% 0px' // Improved root margin for better detection
    }
    
    // Track visibility ratios for each section
    const sectionVisibility = new Map<string, number>()
    
    const observers = sectionIds.map((id, index) => {
      const element = document.getElementById(id)
      if (!element) {
        console.warn(`Section element not found: ${id}`)
        return null
      }
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const sectionId = entry.target.id
            const visibilityRatio = entry.intersectionRatio
            
            // Update visibility tracking
            sectionVisibility.set(sectionId, visibilityRatio)
            
            // Log for debugging
            if (process.env.NODE_ENV === 'development') {
              console.log(`Section ${sectionId}: ${(visibilityRatio * 100).toFixed(1)}% visible`)
            }
            
            // Find the section with the highest visibility ratio above threshold
            let mostVisibleSection = 0
            let highestRatio = 0
            
            sectionIds.forEach((sid, idx) => {
              const ratio = sectionVisibility.get(sid) || 0
              if (ratio >= 0.4 && ratio > highestRatio) { // Use 40% threshold as per memory specs
                highestRatio = ratio
                mostVisibleSection = idx
              }
            })
            
            // Fallback: if no section meets threshold, use the one with highest ratio
            if (highestRatio === 0) {
              sectionIds.forEach((sid, idx) => {
                const ratio = sectionVisibility.get(sid) || 0
                if (ratio > highestRatio) {
                  highestRatio = ratio
                  mostVisibleSection = idx
                }
              })
            }
            
            // Update current section if it changed
            setCurrentSection(prevSection => {
              if (prevSection !== mostVisibleSection) {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Section changed: ${prevSection} → ${mostVisibleSection} (${guideSections[mostVisibleSection]?.name})`)
                }
                return mostVisibleSection
              }
              return prevSection
            })
          })
        },
        observerOptions
      )
      
      observer.observe(element)
      return observer
    })
    
    // Additional scroll-based fallback detection
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      // Check each section's position
      sectionIds.forEach((id, index) => {
        const element = document.getElementById(id)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height
          
          // If scroll position is within this section
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setCurrentSection(prevSection => {
              if (prevSection !== index) {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Scroll fallback: Section ${index} (${guideSections[index]?.name})`)
                }
                return index
              }
              return prevSection
            })
          }
        }
      })
    }
    
    // Throttle scroll handler
    let scrollTimeout: NodeJS.Timeout
    const throttledScrollHandler = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 100)
    }
    
    window.addEventListener('scroll', throttledScrollHandler, { passive: true })
    
    // Initial check
    setTimeout(() => {
      handleScroll()
    }, 500)
    
    return () => {
      observers.forEach(observer => observer?.disconnect())
      window.removeEventListener('scroll', throttledScrollHandler)
      clearTimeout(scrollTimeout)
      sectionVisibility.clear()
    }
  }, [hasProjects])

  // Track scroll progress for smooth animations
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest)
  })

  // Auto-hide functionality
  useEffect(() => {
    if (!autoHide) return

    const handleUserActivity = () => {
      setShouldAutoHide(false)
      
      // Clear existing timeout
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
      
      // Set new timeout to hide after 3 seconds of inactivity
      autoHideTimeoutRef.current = setTimeout(() => {
        setShouldAutoHide(true)
      }, 3000)
    }

    // Listen for user activity
    const events = ['mousemove', 'scroll', 'keydown', 'click']
    events.forEach(event => {
      window.addEventListener(event, handleUserActivity)
    })

    // Initial timeout
    handleUserActivity()

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleUserActivity)
      })
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current)
      }
    }
  }, [autoHide])

  // Enhanced smooth scroll to section with validation
  const scrollToSection = (sectionId: string, index: number) => {
    const element = document.getElementById(sectionId)
    if (element) {
      // Temporarily set the current section for immediate feedback
      setCurrentSection(index)
      lastDetectedSection.current = index
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`🎯 Manually navigating to section: ${guideSections[index]?.name} (${sectionId})`)
      }
      
      // Enhanced scroll behavior
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      })
      
      // Fallback for browsers that don't support smooth scrolling
      setTimeout(() => {
        const elementRect = element.getBoundingClientRect()
        const offsetTop = elementRect.top + window.scrollY - (window.innerHeight / 2) + (elementRect.height / 2)
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
      }, 100)
    } else {
      console.warn(`⚠ Cannot scroll to section: Element not found (${sectionId})`)
    }
  }

  // Get dynamic positioning styles - adjusted for better middle positioning
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      top: '45%', // Slightly above middle
      transform: 'translateY(-50%)',
      zIndex: 50
    }

    if (position === 'right') {
      return {
        ...baseStyles,
        right: `${offset.x}px`,
        left: 'auto'
      }
    } else {
      return {
        ...baseStyles,
        left: `${offset.x}px`,
        right: 'auto'
      }
    }
  }

  // Don't render if no projects, should auto-hide, or is mobile device
  if (!hasProjects || !isVisible || (autoHide && shouldAutoHide && !isHovered) || isMobile) {
    return null
  }

  // Check if should hide on mobile (legacy prop)
  if (hideOnMobile && typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  return (
    <motion.div
      ref={indicatorRef}
      className={`${className}`}
      style={getPositionStyles()}
      initial={{ 
        opacity: 0, 
        x: position === 'right' ? 120 : -120, 
        scale: 0.7,
        y: -20
      }}
      animate={{ 
        opacity: 1, 
        x: isMinimized ? (position === 'right' ? 40 : -40) : 0, 
        scale: 1,
        y: 0
      }}
      exit={{ 
        opacity: 0, 
        x: position === 'right' ? 120 : -120, 
        scale: 0.7,
        y: -20
      }}
      transition={{ 
        delay: 0.6, 
        duration: 1.8,
        type: "spring",
        stiffness: 80,
        damping: 25,
        mass: 1.2
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative group">
        {/* Enhanced glow background */}
        <div className={`absolute inset-0 bg-${currentTheme.glow} rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        {/* Toggle Button - Smaller, Better Aligned */}
        <motion.button
          className={`absolute ${position === 'right' ? '-left-6' : '-right-6'} top-1/2 transform -translate-y-1/2 z-20 bg-black/90 backdrop-blur-sm border border-${currentTheme.border} rounded-full w-5 h-5 flex items-center justify-center hover:bg-${currentTheme.primary}/20 transition-all duration-400 shadow-lg`}
          onClick={() => setIsMinimized(!isMinimized)}
          whileHover={{ 
            scale: 1.15,
            boxShadow: `0 0 12px rgba(147, 51, 234, 0.4)`
          }}
          whileTap={{ scale: 0.9 }}
          title={isMinimized ? 'Show Indicator' : 'Hide Indicator'}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 1.4,
            duration: 0.6,
            type: "spring",
            stiffness: 120,
            damping: 15
          }}
        >
          <motion.svg 
            className={`w-2.5 h-2.5 text-${currentTheme.primary}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={3}
            animate={{ 
              rotate: isMinimized 
                ? (position === 'right' ? 180 : 0) 
                : (position === 'right' ? 0 : 180),
              scale: isMinimized ? 0.9 : 1
            }}
            transition={{ 
              duration: 0.5,
              type: "spring",
              stiffness: 150,
              damping: 20
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.button>
        
        {/* Main clean container - enhanced animations */}
        <motion.div 
          className={`relative bg-black/90 backdrop-blur-sm border border-${currentTheme.border} rounded-2xl shadow-2xl hover:shadow-${currentTheme.shadow} transition-all duration-500 hover:border-${currentTheme.primary}/70`}
          animate={{
            width: isMinimized ? '44px' : '200px',
            height: isMinimized ? '44px' : 'auto',
            padding: isMinimized ? '10px' : '12px',
            borderRadius: isMinimized ? '22px' : '16px'
          }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "tween"
          }}
          whileHover={{
            scale: isMinimized ? 1.05 : 1.02,
            boxShadow: `0 8px 32px rgba(147, 51, 234, 0.15)`
          }}
        >
          {/* Minimized State - Enhanced animations */}
          {isMinimized ? (
            <motion.div 
              className="flex flex-col items-center justify-center h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut"
              }}
            >
              <motion.div 
                className={`${guideSections[currentSection]?.color || 'text-purple-400'} mb-1`}
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                {guideSections[currentSection]?.icon}
              </motion.div>
              <div className="w-4 h-0.5 bg-gray-700/30 rounded-full relative overflow-hidden">
                <motion.div
                  className={`absolute left-0 top-0 h-full bg-gradient-to-r from-${currentTheme.primary} to-${currentTheme.secondary} rounded-full`}
                  style={{
                    width: `${scrollProgress * 100}%`
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ) : (
            /* Full State - Enhanced entry animations */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ 
                duration: 0.5,
                delay: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              {/* Current Section Display */}
              <div className="text-center mb-3">
                <motion.div 
                  className="flex items-center justify-center mb-2"
                  key={currentSection}
                  initial={{ scale: 0.7, opacity: 0, y: -5 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120,
                    damping: 15
                  }}
                >
                  <div className={`${guideSections[currentSection]?.color || 'text-purple-400'} mr-2`}>
                    {guideSections[currentSection]?.icon}
                  </div>
                  <span className="text-xs text-gray-300 font-medium">
                    {guideSections[currentSection]?.shortName}
                  </span>
                </motion.div>
              </div>
              
              {/* Next Section Guidance - Enhanced animation */}
              <div className="text-center mb-4 px-2">
                <motion.div 
                  className="text-[10px] text-gray-400 uppercase tracking-wide mb-1 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  NEXT IS
                </motion.div>
                <motion.div 
                  className={`text-sm font-bold ${currentTheme.primary === 'purple-400' ? 'text-purple-300' : `text-${currentTheme.primary}`}`}
                  key={guideSections[currentSection]?.nextSection}
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 140,
                    damping: 18
                  }}
                >
                  {guideSections[currentSection]?.nextSection || 'Thank you! 🎉'}
                </motion.div>
              </div>
              
              {/* Compact progress dots - staggered animation */}
              <motion.div 
                className="flex justify-center space-x-2 mb-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {guideSections.map((section, index) => {
                  const sectionExists = sectionsFound[index]
                  return (
                    <motion.div
                      key={section.id}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        !sectionExists 
                          ? 'bg-red-500/50 opacity-50'
                          : index === currentSection
                          ? `bg-${currentTheme.primary} scale-125`
                          : index < currentSection
                          ? `bg-${currentTheme.secondary}/70`
                          : 'bg-gray-600/40 hover:bg-gray-500/60'
                      }`}
                      whileHover={{ scale: sectionExists ? 1.4 : 1.0 }}
                      whileTap={{ scale: sectionExists ? 0.8 : 1.0 }}
                      onClick={() => sectionExists && scrollToSection(section.id, index)}
                      title={sectionExists ? section.name : `Missing: ${section.name}`}
                      style={{
                        cursor: sectionExists ? 'pointer' : 'not-allowed'
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: 0.5 + (index * 0.05),
                        duration: 0.3,
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                    />
                  )
                })}
              </motion.div>
              
              {/* Enhanced progress bar */}
              <motion.div 
                className="w-full h-1 bg-gray-700/30 rounded-full relative overflow-hidden mb-2"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <motion.div
                  className={`absolute left-0 top-0 h-full bg-gradient-to-r from-${currentTheme.primary} to-${currentTheme.secondary} rounded-full`}
                  style={{
                    width: `${scrollProgress * 100}%`
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.div>
              
              {/* Progress percentage - final element */}
              <motion.div 
                className={`text-[10px] text-${currentTheme.primary}/80 text-center font-mono font-bold`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                {Math.round(scrollProgress * 100)}%
              </motion.div>
            </motion.div>
          )}
        </motion.div>
        
        {/* Floating shadow */}
        <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-${currentTheme.primary}/20 blur-lg rounded-full`}></div>
      </div>
    </motion.div>
  )
}

export default FloatingProjectsIndicator