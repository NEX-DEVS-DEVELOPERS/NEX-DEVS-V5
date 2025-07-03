'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'

const trustedCompanies = [
  {
    name: 'Spline',
    icon: '✨',
    color: '#8B5CF6',
    link: 'https://spline.design'
  },
  {
    name: 'Supabase',
    icon: '💎',
    color: '#6366F1',
    link: 'https://supabase.com'
  },
  {
    name: 'LinkedIn',
    icon: '🔗',
    color: '#0A66C2',
    link: 'https://linkedin.com'
  },
  {
    name: 'Upwork',
    icon: '💼',
    color: '#14A800',
    link: 'https://upwork.com'
  },
  {
    name: 'Fiverr',
    icon: '💫',
    color: '#1DBF73',
    link: 'https://fiverr.com'
  },
  {
    name: 'Spline',
    icon: '✨',
    color: '#8B5CF6',
    link: 'https://spline.design'
  }
]

export default function TrustedSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Smooth infinite scroll animation
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let lastTime = performance.now()
    const speed = 0.5 // pixels per frame
    let position = 0

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      position += speed * (deltaTime / 16.67) // Normalize to 60fps
      if (position >= scrollContainer.scrollWidth / 2) {
        position = 0
      }

      scrollContainer.style.transform = `translate3d(${-position}px, 0, 0)`
      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return (
    <div className="w-full py-8 sm:py-12 relative overflow-hidden" ref={containerRef}>
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h3 className="text-gray-400 text-sm sm:text-base uppercase tracking-wider font-medium">
          TRUSTED BY
        </h3>
      </motion.div>

      {/* Scrolling container */}
      <div className="relative flex overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-12 sm:gap-16 items-center py-4 will-change-transform"
          style={{
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {/* Double the items for seamless loop */}
          {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
            <motion.a
              key={`${company.name}-${index}`}
              href={company.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl 
                       bg-gradient-to-br from-white/5 to-white/[0.02] 
                       hover:from-white/10 hover:to-white/[0.05]
                       border border-white/10 hover:border-white/20
                       transition-all duration-300 min-w-[160px] sm:min-w-[180px]"
              style={{ 
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl
                         bg-gradient-to-br from-[#1A1A1A] to-black
                         border border-white/10 group-hover:border-white/20
                         shadow-lg transition-all duration-300"
                style={{ 
                  boxShadow: `0 4px 20px ${company.color}15`,
                  transform: 'translate3d(0, 0, 0)'
                }}
              >
                {company.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-white text-sm sm:text-base font-medium">{company.name}</span>
                <span className="text-gray-400 text-xs">Verified Partner</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  )
} 