'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

type Company = {
  name: string;
  symbol: string;
  color: string;
}

// Combine all companies into one array
const companies: Company[] = [
  {
    name: 'Fiverr',
    symbol: '$',
    color: 'text-green-400'
  },
  {
    name: 'Spline',
    symbol: '+',
    color: 'text-violet-400'
  },
  {
    name: 'Supabase',
    symbol: '◆',
    color: 'text-purple-400'
  },
  {
    name: 'LinkedIn',
    symbol: '•',
    color: 'text-blue-400'
  },
  {
    name: 'Upwork',
    symbol: '_',
    color: 'text-blue-500'
  },
  {
    name: 'Fiverr',
    symbol: '$',
    color: 'text-green-400'
  },
  {
    name: 'Spline',
    symbol: '+',
    color: 'text-violet-400'
  }
]

export default function TrustedSection() {
  const rowRef = useRef<HTMLDivElement>(null)
  const [rowOffset, setRowOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [contentWidth, setContentWidth] = useState(0)
  
  // Animation speed control (lower = slower)
  const speed = 0.05 // Reduced speed for slower animation

  // Calculate content width on mount and window resize
  useEffect(() => {
    const updateWidth = () => {
      if (rowRef.current) {
        setContentWidth(rowRef.current.scrollWidth / 3) // Divide by 3 because we tripled the content
      }
    }
    
    // Initial calculation
    updateWidth()
    
    // Update on window resize
    window.addEventListener('resize', updateWidth)
    
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

  // Improved animation frame logic for continuous movement
  useAnimationFrame((time) => {
    if (rowRef.current && !isPaused && contentWidth > 0) {
      // More robust calculation for seamless infinite scrolling
      const position = (time * speed) % contentWidth
      setRowOffset(-position)
    }
  })
  
  // Quadruple the content for guaranteed seamless scrolling on all devices
  const allCompanies = [...companies, ...companies, ...companies, ...companies]

  return (
    <div className="w-full overflow-hidden py-6 sm:py-10">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center text-xs sm:text-sm text-gray-500 font-medium mb-6 sm:mb-10 tracking-wider"
      >
        TRUSTED BY
      </motion.h2>

      {/* Single row with improved mobile support */}
      <div 
        className="overflow-hidden relative"
        onMouseEnter={() => setIsPaused(true)} 
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="inline-flex whitespace-nowrap">
          <div 
            ref={rowRef}
            className="flex gap-12 sm:gap-24 py-2 sm:py-4"
            style={{ 
              transform: `translateX(${rowOffset}px)`,
              transition: 'transform 0.1s linear', // Smoother transition
              willChange: 'transform' // Performance optimization
            }}
          >
            {allCompanies.map((company, index) => (
              <motion.div
                key={`company-${company.name}-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="flex items-center"
              >
                <span className={`text-xl sm:text-2xl ${company.color} mr-1 sm:mr-2`}>{company.symbol}</span>
                <span className="text-sm sm:text-lg text-gray-300">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 