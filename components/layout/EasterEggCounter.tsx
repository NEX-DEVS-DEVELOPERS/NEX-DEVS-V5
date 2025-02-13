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
    // Save position
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
      className={`fixed top-20 right-4 z-50 cursor-move
                 rounded-xl border backdrop-blur-sm
                 shadow-lg transition-all duration-200
                 ${isDragging 
                   ? 'bg-purple-500/30 border-purple-400/50 shadow-purple-500/20' 
                   : 'bg-black/40 border-purple-500/30 hover:bg-black/60'}`}
    >
      <div 
        className="px-4 py-2 flex items-center gap-2"
        onClick={() => !isDragging && setIsExpanded(!isExpanded)}
      >
        <span className="text-lg select-none">🎯</span>
        <span className="text-sm font-medium text-white/90 select-none whitespace-nowrap">
          Easter Eggs: {foundEasterEggs.size}/{totalEasterEggs}
        </span>
        <motion.span 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-xs text-white/40 select-none"
        >
          ▼
        </motion.span>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-4 pb-3 border-t border-purple-500/20"
        >
          <div className="mt-2 space-y-1.5">
            {[...foundEasterEggs].map((eggName) => (
              <div key={eggName} className="flex items-center gap-2">
                <span className="text-xs text-purple-300">✓</span>
                <span className="text-xs text-white/70">{getEasterEggDescription(eggName)}</span>
              </div>
            ))}
            {foundEasterEggs.size < totalEasterEggs && (
              <div className="text-xs text-white/50 italic mt-2">
                {totalEasterEggs - foundEasterEggs.size} more to discover!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 