'use client'

import React, { useEffect, useRef } from 'react'

interface FastMovingLinesProps {
  className?: string
  lineCount?: number
  speed?: number
  color?: string
}

const FastMovingLines: React.FC<FastMovingLinesProps> = ({
  className = '',
  lineCount = 15,
  speed = 2,
  color = '#8b5cf6'
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Nothing needed here anymore as we're using CSS animations
  }, [lineCount, speed, color])

  // Generate CSS-based animated lines
  const renderLines = () => {
    return Array.from({ length: lineCount }).map((_, index) => {
      const duration = (Math.random() * 3 + 2) / speed
      const delay = Math.random() * 2
      const width = Math.random() * 30 + 20
      const height = Math.random() * 1.5 + 0.5
      const top = Math.random() * 100
      const opacity = Math.random() * 0.5 + 0.3
      const rotation = Math.random() * 90 - 45

      return (
        <div
          key={index}
          className="fast-line absolute"
          style={{
            top: `${top}%`,
            height: `${height}px`,
            width: `${width}%`,
            opacity: opacity,
            background: `linear-gradient(90deg, transparent, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
            transform: `rotate(${rotation}deg)`,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
            left: '-30%' // Start off-screen
          }}
        />
      )
    })
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform'
      }}
    >
      {renderLines()}
    </div>
  )
}

export default FastMovingLines
