'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function DiscoveryCallButton() {
  const [isVisible, setIsVisible] = useState(true) // Start visible by default
  const [pulseEffect, setPulseEffect] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // Show button immediately and handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsVisible(true) // Always keep visible, regardless of scroll position
    }
    
    // Run initial check
    handleScroll()
    
    // Add scroll listener with passive flag for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Add pulse animation effect every few seconds
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setPulseEffect(true)
        setTimeout(() => setPulseEffect(false), 1000)
      }, 5000)
      
      return () => clearInterval(interval)
    }
  }, [isVisible])
  
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 transform-gpu"
      initial={{ opacity: 1, scale: 1, rotate: 0 }} // Start fully visible
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? (pulseEffect ? 1.1 : isHovered ? 1.05 : 1) : 0.8,
        y: isVisible ? 0 : 20,
        rotate: isVisible ? 0 : -5,
      }}
      transition={{ 
        duration: 0.3, 
        ease: [0.19, 1.0, 0.22, 1.0], // Custom easing
        scale: { duration: pulseEffect ? 0.4 : 0.3 }
      }}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    >
      <Link 
        href="/discovery-call"
        className="flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 text-white rounded-full shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 relative overflow-hidden group transform-gpu"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          willChange: 'transform, box-shadow',
          transform: 'translateZ(0)'
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-white opacity-0 rounded-full group-hover:opacity-10 transition-opacity"
          initial={{ scale: 0 }}
          animate={{ scale: pulseEffect || isHovered ? 1.4 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)'
          }}
        />
        <div className="absolute inset-0 rounded-full flex flex-col text-[9px] justify-center items-center text-center font-medium rotate-[20deg] z-10">
          <span className="block -mb-0.5">DISCOVER</span>
          <motion.span 
            className="text-xl mb-1"
            animate={{ y: pulseEffect || isHovered ? -2 : 0 }}
            transition={{ duration: 0.3, yoyo: pulseEffect || isHovered ? 1 : 0 }}
            style={{
              willChange: 'transform',
              transform: 'translateZ(0)'
            }}
          >↗</motion.span>
          <span className="block -mt-0.5">PROJECT</span>
        </div>
      </Link>
    </motion.div>
  )
} 