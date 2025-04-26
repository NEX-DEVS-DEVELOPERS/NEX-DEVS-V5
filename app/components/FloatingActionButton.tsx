'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Phone } from 'lucide-react'

const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    // Show the button after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-50"
        >
          <Link
            href="/discovery-call"
            className="group flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 
                     hover:from-violet-500 hover:to-purple-500 text-white rounded-full shadow-lg 
                     hover:shadow-purple-500/25 transform hover:-translate-y-0.5 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Phone className="w-4 h-4 text-purple-200 flex-shrink-0" />
            <span className={`text-sm font-medium tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
              isHovered ? 'max-w-[150px] opacity-100 ml-1' : 'max-w-0 opacity-0 ml-0'
            }`}>
              Book Call
            </span>
            <Calendar className={`w-4 h-4 flex-shrink-0 transition-all duration-300 ${
              isHovered ? 'opacity-100 ml-1' : 'opacity-0 w-0 ml-0'
            }`} />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FloatingActionButton