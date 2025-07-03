'use client'

import { useState, useEffect, useRef } from 'react'
import { PhoneIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Show button after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Handle scroll events to show/hide button
  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled past 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        // Keep visible if already shown
        setIsVisible(prev => prev)
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      }
  }, [])

  // Ensure button visibility after page transitions
  useEffect(() => {
    const handleRouteChange = () => {
      if (buttonRef.current) {
        buttonRef.current.style.opacity = '1'
        buttonRef.current.style.visibility = 'visible'
        buttonRef.current.style.transform = 'scale(1)'
      }
    }
    
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      }
  }, [])

  return (
        <div
          ref={buttonRef}
      className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ease-out gpu-accelerated ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      style={{
        visibility: isVisible ? 'visible' : 'hidden',
        transform: `scale(${isVisible ? 1 : 0.9})`,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
          >
      <Link href="/discovery-call">
        <div 
          className={`
            rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-3 shadow-lg 
            hover:shadow-purple-500/30 transition-all duration-300 
            float ${isHovered ? 'hover-glow' : ''}
          `}
          style={{
            boxShadow: isHovered 
              ? '0 0 20px rgba(147, 51, 234, 0.5)' 
              : '0 4px 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          <PhoneIcon className="h-6 w-6 text-white" />
        </div>
      </Link>
    </div>
  )
}