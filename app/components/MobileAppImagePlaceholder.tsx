'use client'

import React from 'react'
import Image from 'next/image'

interface MobileAppImagePlaceholderProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

const MobileAppImagePlaceholder = ({
  src,
  alt = 'Mobile App Preview',
  width = 640,
  height = 360, // 16:9 aspect ratio
  className = '',
  priority = false
}: MobileAppImagePlaceholderProps) => {
  // If src is provided, render the actual image
  if (src) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`} style={{ aspectRatio: '16/9' }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
        />
      </div>
    )
  }

  // If no src, render a placeholder
  return (
    <div 
      className={`relative bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-gray-700/50 rounded-xl flex items-center justify-center ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      <div className="text-center p-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm font-medium">Mobile App Preview</p>
        <p className="text-gray-500 text-xs mt-1">16:9 Aspect Ratio</p>
      </div>
    </div>
  )
}

export default MobileAppImagePlaceholder
