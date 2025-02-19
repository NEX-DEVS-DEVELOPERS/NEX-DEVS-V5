'use client'

import { motion, useMotionValue } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useEasterEggs } from '@/context/EasterEggContext'

export default function EasterEggCounter() {
  const { foundEasterEggs, totalEasterEggs, getEasterEggDescription } = useEasterEggs()
  const [isDragging, setIsDragging] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Load saved position
  useEffect(() => {
    const savedPosition = localStorage.getItem('easterEggPosition')
    if (savedPosition) {
      const { x: savedX, y: savedY } = JSON.parse(savedPosition)
      x.set(savedX)
      y.set(savedY)
    }
  }, [])

  const handleDragEnd = () => {
    setIsDragging(false)
    localStorage.setItem('easterEggPosition', JSON.stringify({ 
      x: x.get(), 
      y: y.get() 
    }))
  }

  return (
    <motion.div
      drag
      dragMomentum={false}
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      className={`fixed top-4 right-4 z-50 cursor-move
                 rounded-xl border backdrop-blur-sm
                 shadow-lg transition-all duration-200
                 hidden sm:block
                 ${isDragging 
                   ? 'bg-purple-500/30 border-purple-400/50 shadow-purple-500/20' 
                   : 'bg-black/80 border-purple-500/50 hover:bg-black/90'}`}
    >
      <div 
        className="px-3 py-1.5 sm:px-4 sm:py-2 flex items-center gap-2"
        onClick={() => !isDragging && setIsExpanded(!isExpanded)}
      >
        <span className="text-base sm:text-lg select-none">🎯</span>
        <div className="flex items-center gap-1">
          <span className="text-xs sm:text-sm font-medium text-white/90 select-none whitespace-nowrap">
            Easter Eggs:
          </span>
          <span className="text-xs sm:text-sm font-bold text-purple-400">
            {foundEasterEggs.size}/{totalEasterEggs}
          </span>
        </div>
        <motion.span 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-xs text-white/60 select-none ml-1"
        >
          ▼
        </motion.span>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-3 sm:px-4 pb-2 sm:pb-3 border-t border-purple-500/20"
        >
          <div className="mt-2 space-y-1.5 max-h-[200px] overflow-y-auto">
            {[...foundEasterEggs].map((eggName) => (
              <div key={eggName} className="flex items-start gap-2">
                <span className="text-xs text-purple-300 mt-0.5">✓</span>
                <span className="text-xs text-white/70 leading-tight">{getEasterEggDescription(eggName)}</span>
              </div>
            ))}
            {foundEasterEggs.size < totalEasterEggs && (
              <div className="text-xs text-purple-300/80 italic mt-2 font-medium">
                {totalEasterEggs - foundEasterEggs.size} more to discover!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 