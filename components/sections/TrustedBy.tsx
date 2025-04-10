import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useIsMobile } from '@/app/utils/deviceDetection'

// Updated with better styling and structure
const companies = [
  { name: 'Webflow', symbol: '~', color: 'from-purple-500/10 to-blue-500/10' },
  { name: 'Spline', symbol: '+', color: 'from-violet-500/10 to-indigo-500/10' },
  { name: 'Fiverr', symbol: '$', color: 'from-green-500/10 to-emerald-500/10' },
  { name: 'Upwork', symbol: '_', color: 'from-blue-500/10 to-sky-500/10' },
  { name: 'LinkedIn', symbol: '•', color: 'from-blue-600/10 to-blue-400/10' },
  { name: 'Netlify', symbol: '*', color: 'from-purple-600/10 to-indigo-400/10' },
  { name: 'Vercel', symbol: '△', color: 'from-gray-500/10 to-gray-300/10' },
  { name: 'Dribbble', symbol: '.', color: 'from-pink-500/10 to-rose-400/10' },
  { name: 'Supabase', symbol: '◆', color: 'from-emerald-500/10 to-green-300/10' },
]

export default function TrustedBy() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) return
    
    const scrollAnimation = () => {
      setScrollPosition((prev) => (prev + 1) % 3000)
    }

    const interval = setInterval(scrollAnimation, 30)
    return () => clearInterval(interval)
  }, [isMobile])

  // Fade-in animation variants
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

  // Glow animation for individual companies
  const glowVariant = {
    animate: {
      opacity: [0.7, 1, 0.7],
      scale: [1, 1.02, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear"
      }
    }
  }

  return (
    <div className="w-full py-8 sm:py-12 overflow-hidden relative">
      {/* Main background with texture */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
      
      {/* Static gradient overlay - stays in place */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70 opacity-70"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90 pointer-events-none z-10"></div>
      
      {/* Rainbow gradient band - stays in place */}
      <div className="absolute top-1/2 left-0 right-0 h-16 -translate-y-1/2 bg-gradient-to-r from-purple-900/5 via-blue-900/5 to-emerald-900/5 blur-3xl opacity-40"></div>
      
      {/* Background glow spots - stays in place */}
      <div className="absolute left-1/4 top-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute right-1/4 bottom-1/3 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute left-2/3 top-1/2 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl opacity-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        <motion.h2 
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          className="text-center text-sm sm:text-base text-gray-400 font-medium mb-8 tracking-wider"
        >
          TRUSTED BY
        </motion.h2>

        {/* Mobile Grid Layout */}
        <div className="block sm:hidden">
          <div className="grid grid-cols-3 gap-6 text-center">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: fadeInUpVariant.hidden,
                  visible: {
                    ...fadeInUpVariant.visible,
                    transition: {
                      ...fadeInUpVariant.visible.transition,
                      delay: index * 0.1
                    }
                  },
                  animate: glowVariant.animate
                }}
                whileHover="animate"
                className="flex flex-col items-center justify-center group"
              >
                <div className={`w-10 h-10 flex items-center justify-center mb-1 bg-gradient-to-br ${company.color} rounded-full bg-opacity-10 backdrop-blur-sm`}>
                  <span className="text-xs text-gray-300 font-medium">{company.symbol}</span>
                </div>
                <span className="text-sm text-gray-300 font-medium group-hover:text-white group-hover:text-opacity-90 transition-colors">
                  {company.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Desktop Sleek Infinite Scroll */}
        <div className="hidden sm:block relative" ref={containerRef}>
          {/* Static edge fade mask - stays in place */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none opacity-80" 
            style={{ maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,1) 100%)' }}
          />
          
          <div className="flex whitespace-nowrap overflow-hidden">
            <div 
              className="flex gap-16 items-center"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
                willChange: 'transform',
              }}
            >
              {[...companies, ...companies, ...companies].map((company, index) => (
                <motion.div
                  key={`${company.name}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover="animate"
                  variants={glowVariant}
                  className="flex-shrink-0 flex flex-col items-center group"
                >
                  <div className={`w-12 h-12 flex items-center justify-center mb-2 bg-gradient-to-br ${company.color} rounded-full bg-opacity-10 backdrop-blur-sm relative`}>
                    <div className="absolute inset-0 rounded-full bg-black/10 backdrop-blur-sm"></div>
                    <span className="text-sm text-gray-300 font-medium relative z-10">{company.symbol}</span>
                  </div>
                  <span className="text-base text-gray-300 font-medium group-hover:text-white group-hover:text-opacity-90 transition-colors">
                    {company.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 