'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface SimplifiedIPhoneMockupProps {
  project?: {
    id: number
    title: string
    description: string
    image: string
    technologies: string[]
    link: string
  }
  size?: 'medium' | 'large'
}

// Advanced Image Detection and Optimization System
const detectAndOptimizeImage = (imageUrl: string): Promise<{
  aspectRatio: number
  needsOptimization: boolean
  optimizedDimensions: { width: number; height: number }
  objectFit: 'cover' | 'contain' | 'fill'
  objectPosition: string
  originalDimensions: { width: number; height: number }
  imageType: 'landscape' | 'portrait' | 'square' | 'ultra-wide' | 'ultra-tall'
  quality: 'high' | 'medium' | 'low'
  compressionNeeded: boolean
}> => {
  return new Promise((resolve) => {
    const img = new window.Image()
    let isResolved = false
    let retryCount = 0
    const maxRetries = 3
    
    const resolveWithFallback = (config?: any) => {
      if (isResolved) return
      isResolved = true
      
      const fallbackConfig = {
        aspectRatio: 16/9,
        needsOptimization: false,
        optimizedDimensions: { width: 375, height: 211 },
        objectFit: 'cover' as const,
        objectPosition: 'center',
        originalDimensions: { width: 375, height: 211 },
        imageType: 'landscape' as const,
        quality: 'medium' as const,
        compressionNeeded: false
      }
      
      resolve(config || fallbackConfig)
    }
    
    // Advanced timeout with progressive delays
    const timeoutId = setTimeout(() => {
      console.warn(`🔄 Image load timeout after ${15}s:`, imageUrl)
      resolveWithFallback()
    }, 15000)
    
    const tryLoadImage = () => {
      // Clear previous handlers
      img.onload = null
      img.onerror = null
      
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        if (isResolved) return
        clearTimeout(timeoutId)
        
        try {
          const width = img.naturalWidth || img.width
          const height = img.naturalHeight || img.height
          
          if (!width || !height || width < 1 || height < 1) {
            throw new Error('Invalid image dimensions')
          }
          
          const aspectRatio = width / height
          const targetAspectRatio = 16 / 9 // Mobile target ratio
          
          // Advanced image type classification
          let imageType: 'landscape' | 'portrait' | 'square' | 'ultra-wide' | 'ultra-tall'
          if (aspectRatio > 2.5) {
            imageType = 'ultra-wide'
          } else if (aspectRatio < 0.4) {
            imageType = 'ultra-tall'
          } else if (aspectRatio > 1.3) {
            imageType = 'landscape'
          } else if (aspectRatio < 0.8) {
            imageType = 'portrait'
          } else {
            imageType = 'square'
          }
          
          // Quality assessment based on resolution
          let quality: 'high' | 'medium' | 'low'
          const totalPixels = width * height
          if (totalPixels > 2073600) { // > 1920x1080
            quality = 'high'
          } else if (totalPixels > 921600) { // > 1280x720
            quality = 'medium'
          } else {
            quality = 'low'
          }
          
          // Compression assessment
          const compressionNeeded = totalPixels > 1440000 // > 1200x1200
          
          // Advanced optimization logic - Always center align for iPhone mockup
          let objectFit: 'cover' | 'contain' | 'fill' = 'cover'
          let objectPosition = 'center' // Always center for iPhone display
          let needsOptimization = false
          
          const aspectRatioDifference = Math.abs(aspectRatio - targetAspectRatio)
          
          if (aspectRatioDifference > 0.03) { // Tighter tolerance
            needsOptimization = true
            // Always use center positioning for iPhone mockup regardless of image type
            objectFit = 'cover'
            objectPosition = 'center'
          } else {
            // Image is already close to 16:9
            objectFit = 'cover'
            objectPosition = 'center'
          }
          
          // Calculate optimized dimensions
          const mobileWidth = 375
          const mobileHeight = Math.round(mobileWidth / targetAspectRatio)
          
          const config = {
            aspectRatio,
            needsOptimization,
            optimizedDimensions: { width: mobileWidth, height: mobileHeight },
            objectFit,
            objectPosition,
            originalDimensions: { width, height },
            imageType,
            quality,
            compressionNeeded
          }
          
          resolveWithFallback(config)
          
        } catch (error) {
          console.error('Error processing image data:', error)
          if (retryCount < maxRetries) {
            retryCount++
            console.log(`🔄 Retrying image analysis (${retryCount}/${maxRetries})...`)
            setTimeout(tryLoadImage, 1000 * retryCount)
          } else {
            resolveWithFallback()
          }
        }
      }
      
      img.onerror = (error) => {
        if (isResolved) return
        console.error(`❌ Image load failed (attempt ${retryCount + 1}):`, imageUrl, error)
        
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`🔄 Retrying image load (${retryCount}/${maxRetries})...`)
          setTimeout(tryLoadImage, 2000 * retryCount) // Progressive delay
        } else {
          clearTimeout(timeoutId)
          resolveWithFallback()
        }
      }
      
      // Handle CORS and different image sources
      try {
        // Try with CORS first
        img.src = imageUrl
      } catch (corsError) {
        console.warn('CORS issue, trying without crossOrigin:', corsError)
        img.crossOrigin = ''
        img.src = imageUrl
      }
    }
    
    // Start the loading process
    tryLoadImage()
  })
}

// Advanced Hook for image optimization with enhanced features
const useImageOptimization = (imageUrl?: string) => {
  const [imageConfig, setImageConfig] = useState<{
    aspectRatio: number
    needsOptimization: boolean
    optimizedDimensions: { width: number; height: number }
    objectFit: 'cover' | 'contain' | 'fill'
    objectPosition: string
    originalDimensions: { width: number; height: number }
    imageType: 'landscape' | 'portrait' | 'square' | 'ultra-wide' | 'ultra-tall'
    quality: 'high' | 'medium' | 'low'
    compressionNeeded: boolean
    isLoading: boolean
    error: boolean
    retry: () => void
    analysisComplete: boolean
  }>(() => {
    const defaultConfig = {
      aspectRatio: 16/9,
      needsOptimization: false,
      optimizedDimensions: { width: 375, height: 211 },
      objectFit: 'cover' as const,
      objectPosition: 'center',
      originalDimensions: { width: 375, height: 211 },
      imageType: 'landscape' as const,
      quality: 'medium' as const,
      compressionNeeded: false,
      isLoading: !!imageUrl,
      error: false,
      retry: () => {},
      analysisComplete: false
    }
    return defaultConfig
  })
  
  const analyzeImage = useCallback(async () => {
    if (!imageUrl) {
      setImageConfig(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: false, 
        analysisComplete: true 
      }))
      return
    }
    
    console.log('🔍 Starting advanced image analysis...', imageUrl)
    setImageConfig(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: false, 
      analysisComplete: false 
    }))
    
    try {
      const startTime = performance.now()
      const config = await detectAndOptimizeImage(imageUrl)
      const analysisTime = performance.now() - startTime
      
      setImageConfig(prev => ({
        ...prev,
        ...config,
        isLoading: false,
        error: false,
        retry: analyzeImage,
        analysisComplete: true
      }))
      
      // Comprehensive logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('🖼️ Advanced Image Analysis Complete:', {
          url: imageUrl.substring(0, 50) + '...',
          analysisTime: `${analysisTime.toFixed(2)}ms`,
          originalAspectRatio: config.aspectRatio.toFixed(3),
          targetAspectRatio: '1.778 (16:9)',
          imageType: config.imageType,
          quality: config.quality,
          originalSize: `${config.originalDimensions.width}x${config.originalDimensions.height}`,
          optimizedSize: `${config.optimizedDimensions.width}x${config.optimizedDimensions.height}`,
          objectFit: config.objectFit,
          objectPosition: config.objectPosition,
          needsOptimization: config.needsOptimization,
          compressionNeeded: config.compressionNeeded,
          optimization: config.needsOptimization ? '✅ Applied' : '⚡ Perfect Ratio',
          status: '🚀 Ready for display'
        })
      }
    } catch (error) {
      console.error('❌ Advanced image optimization failed:', error)
      setImageConfig(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: true, 
        retry: analyzeImage,
        analysisComplete: true 
      }))
    }
  }, [imageUrl])
  
  useEffect(() => {
    analyzeImage()
  }, [analyzeImage])
  
  return imageConfig
}

// Add shine animation
const shineAnimation = `
@keyframes shine {
  0% { transform: translateX(-100%) skewX(-12deg); }
  100% { transform: translateX(200%) skewX(-12deg); }
}

.animate-shine {
  animation: shine 8s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Removed glow animation for cleaner performance */

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.animate-slideUp {
  animation: slideUp 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
  opacity: 0;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-signal {
  animation: pulse 2s ease-in-out infinite;
}

.ease-out-expo {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.clean-hover {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.clean-hover:hover {
  transform: translateY(-8px);
}

@keyframes edge-glow {
  0%, 100% { box-shadow: 0 0 0 1px rgba(147, 51, 234, 0); }
  50% { box-shadow: 0 0 0 1px rgba(147, 51, 234, 0.3), 0 0 20px rgba(147, 51, 234, 0.1); }
}

.animate-edge-glow {
  animation: edge-glow 3s ease-in-out infinite;
}

.hover-edge-glow {
  transition: box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.hover-edge-glow:hover {
  box-shadow: 0 0 0 1px rgba(147, 51, 234, 0.4), 0 0 30px rgba(147, 51, 234, 0.15);
}
`

const SimplifiedIPhoneMockup = ({ project, size = 'large' }: SimplifiedIPhoneMockupProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isDebugExpanded, setIsDebugExpanded] = useState(false)
  const imageConfig = useImageOptimization(project?.image)
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  
  // Determine container dimensions and dynamic island size based on size - only medium and large
  const containerClass = size === 'large' 
    ? 'h-[680px] w-[340px]' 
    : 'h-[550px] w-[275px]'
  
  // Dynamic island size based on iPhone size - only medium and large
  const dynamicIslandClass = size === 'large'
    ? 'w-28 h-7' // Original size for large
    : 'w-24 h-6' // Slightly smaller for medium
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-52 h-[450px] mx-auto mb-4 bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[3rem] border-4 border-gray-700 flex items-center justify-center relative overflow-hidden group clean-hover hover-edge-glow">
              {/* Simple Black Pill-Shaped Dynamic Island - medium size for placeholder */}
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 border border-gray-600"></div>
              
              {/* Compact status indicators */}
              <div className="absolute top-4 right-4 flex items-center gap-1 z-30">
                {/* Signal bars - smaller with rounded edges */}
                <div className="flex items-end gap-0.5">
                  <div className="w-0.5 h-1.5 bg-white rounded-full animate-signal" style={{ animationDelay: '0s' }}></div>
                  <div className="w-0.5 h-2 bg-white rounded-full animate-signal" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-0.5 h-2.5 bg-white rounded-full animate-signal" style={{ animationDelay: '0.4s' }}></div>
                  <div className="w-0.5 h-3 bg-white rounded-full animate-signal" style={{ animationDelay: '0.6s' }}></div>
                </div>
                {/* WiFi indicator - smaller */}
                <svg className="w-3 h-3 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.414 5 5 0 017.07 0 1 1 0 01-1.415 1.414zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {/* Battery indicator - smaller with rounded edges */}
                <div className="flex items-center gap-0.5">
                  <div className="w-4 h-2 border border-white rounded-md relative">
                    <div className="absolute inset-0.5 bg-white rounded-sm w-3/4"></div>
                  </div>
                  <div className="w-0.5 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              
              <span className="text-gray-400 text-sm">No Mobile Project Selected</span>
            </div>
            <p className="text-gray-400 text-sm">Select a mobile project to preview</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* iPhone Mockup */}
      <div className={`relative ${containerClass} mx-auto`}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Shadow element */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/30 blur-xl rounded-full"></div>
            
            {/* Enhanced iPhone Mockup with improved hover effects */}
            <div className="relative w-full h-full flex items-center justify-center group">
              {/* Enhanced Phone Body with premium styling */}
              <div className="relative w-full h-full bg-gradient-to-b from-gray-900 via-black to-gray-900 rounded-[3rem] border-[8px] border-gray-800 overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:-translate-y-3 ease-out-expo animate-float backdrop-blur-sm hover-edge-glow animate-edge-glow">
                {/* Enhanced dynamic reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent transform -skew-x-12 translate-x-full animate-shine pointer-events-none"></div>
                
                {/* Simple Black Pill-Shaped Dynamic Island - size based on phone size */}
                <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 ${dynamicIslandClass} bg-black rounded-full z-20 shadow-lg`}></div>
                
                {/* Enhanced Status Bar with smaller rounded indicators - positioned based on dynamic island size */}
                <div className={`absolute left-0 right-0 flex justify-between items-center px-5 z-30 ${
                  size === 'medium' ? 'top-3' : 'top-3'
                }`}>
                  {/* Left side - Time with size-responsive font */}
                  <div className={`text-white font-semibold ${
                    size === 'medium' ? 'text-xs' : 'text-xs'
                  }`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </div>
                  
                  {/* Right side - Compact status indicators with responsive sizing */}
                  <div className={`flex items-center ${
                    size === 'medium' ? 'gap-1.5' : 'gap-1.5'
                  }`}>
                    {/* Cellular signal bars - responsive sizing */}
                    <div className="flex items-end gap-0.5">
                      {[1.5, 2, 2.5, 3].map((height, index) => (
                        <div 
                          key={index}
                          className="w-0.5 bg-white rounded-full animate-signal"
                          style={{ 
                            height: `${height}px`,
                            animationDelay: `${index * 0.2}s` 
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* WiFi indicator - responsive sizing */}
                    <svg className={`text-white animate-pulse ${
                      size === 'medium' ? 'w-3 h-3' : 'w-3 h-3'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.414 5 5 0 017.07 0 1 1 0 01-1.415 1.414zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    
                    {/* Battery indicator - responsive sizing */}
                    <div className="flex items-center gap-0.5">
                      <div className={`border border-white rounded-md relative ${
                        size === 'medium' ? 'w-4 h-2' : 'w-4 h-2'
                      }`}>
                        <div className="absolute inset-0.5 bg-white rounded-sm w-3/4"></div>
                      </div>
                      <div className="w-0.5 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Side Buttons - responsive sizing */}
                <div className={`absolute -left-[12px] bg-gray-700 rounded-l-md shadow-lg ${
                  size === 'medium' ? 'top-32 w-1 h-12' : 'top-32 w-1 h-12'
                }`}></div>
                <div className={`absolute -left-[12px] bg-gray-700 rounded-l-md shadow-lg ${
                  size === 'medium' ? 'top-48 w-1 h-8' : 'top-48 w-1 h-8'
                }`}></div>
                <div className={`absolute -left-[12px] bg-gray-700 rounded-l-md shadow-lg ${
                  size === 'medium' ? 'top-60 w-1 h-8' : 'top-60 w-1 h-8'
                }`}></div>
                <div className={`absolute -right-[12px] bg-gray-700 rounded-r-md shadow-lg ${
                  size === 'medium' ? 'top-40 w-1 h-16' : 'top-40 w-1 h-16'
                }`}></div>
                
                {/* Enhanced Screen Content */}
                <div className="relative w-full h-full bg-black pt-16 overflow-hidden">
                  {project.image && (
                    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
                      {/* Advanced loading state with detailed progress */}
                      {imageConfig.isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="relative mb-4">
                              {/* Multi-ring loader */}
                              <div className="animate-spin w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full mx-auto" />
                              <div className="absolute inset-0 w-12 h-12 border-3 border-purple-500/20 rounded-full mx-auto" />
                              <div className="absolute inset-2 w-8 h-8 border-2 border-cyan-400 border-b-transparent rounded-full mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                            </div>
                            <div className="space-y-2">
                              <p className="text-gray-300 text-sm font-medium">Advanced Image Analysis</p>
                              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
                                  <span>Detecting dimensions</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                                  <span>Analyzing aspect ratios</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
                                  <span>Optimizing for mobile</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Advanced error state with detailed diagnostics */}
                      {imageConfig.error && (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-gray-900 to-gray-800 flex items-center justify-center">
                          <div className="text-center p-4">
                            <div className="relative mb-4">
                              <svg className="w-16 h-16 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
                                </svg>
                              </div>
                            </div>
                            <h4 className="text-red-300 font-semibold mb-2">Image Analysis Failed</h4>
                            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                              Advanced image detection could not process this image.
                              <br />This may be due to CORS, network issues, or invalid format.
                            </p>
                            <div className="flex flex-col gap-2">
                              <button 
                                onClick={imageConfig.retry}
                                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs font-medium border border-purple-500/30 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg"
                              >
                                🔄 Retry Advanced Analysis
                              </button>
                              <p className="text-gray-500 text-xs">Using fallback optimization</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Optimized image with full coverage and rounded edges */}
                      <div className="relative w-full h-full">
                        {/* Perfect aspect ratio container for full coverage */}
                        <div className="absolute inset-0 overflow-hidden rounded-lg">
                          <div className="relative w-full h-full">
                            <Image
                              src={project.image}
                              alt={project.title}
                              fill
                              className={`transition-all duration-700 group-hover:scale-110 ${
                                imageConfig.needsOptimization ? 'filter brightness-105 contrast-105' : ''
                              } ${
                                imageConfig.quality === 'low' ? 'filter brightness-110 contrast-110 saturate-110' : 
                                imageConfig.quality === 'high' ? 'filter brightness-100 contrast-100' : 
                                'filter brightness-102 contrast-102'
                              }`}
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                                transform: 'scale(1.08)', // Increased zoom for full coverage
                                imageRendering: imageConfig.quality === 'low' ? 'crisp-edges' : 'auto'
                              }}
                              sizes="(max-width: 768px) 100vw, 340px"
                              quality={imageConfig.quality === 'high' ? 95 : imageConfig.quality === 'medium' ? 85 : 75}
                              priority
                              placeholder="blur"
                              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                              onLoad={() => {
                                if (process.env.NODE_ENV === 'development') {
                                  console.log(`✅ Advanced image successfully loaded and optimized:`, {
                                    aspectRatio: imageConfig.aspectRatio.toFixed(2),
                                    imageType: imageConfig.imageType,
                                    quality: imageConfig.quality,
                                    optimization: imageConfig.needsOptimization ? 'applied' : 'perfect ratio',
                                    display: 'full coverage with rounded edges',
                                    compressionNeeded: imageConfig.compressionNeeded
                                  })
                                }
                              }}
                              onError={(e) => {
                                if (process.env.NODE_ENV === 'development') {
                                  console.warn('⚠️ Advanced image failed to load after optimization:', {
                                    url: project.image,
                                    error: e,
                                    config: imageConfig
                                  })
                                }
                                // Trigger retry mechanism
                                imageConfig.retry()
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile screen overlay for better visual consistency */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 pointer-events-none" />
                    </div>
                  )}
                  
                  {/* Enhanced Screen Reflection Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/3 pointer-events-none transition-opacity duration-500 group-hover:opacity-30"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-transparent h-20 pointer-events-none"></div>
                  
                  {/* Professional Hover Details Panel */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95 backdrop-blur-md rounded-b-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out-expo pointer-events-none group-hover:pointer-events-auto p-6 flex flex-col justify-between border border-white/5">
                    {/* Enhanced Top Section */}
                    <div className="pt-8 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                      <div className="text-center mb-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full border border-purple-500/30 mb-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-purple-300 font-medium">Powered by NEX-DEVS</span>
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-3 text-center leading-tight">{project.title}</h3>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-blue-200 rounded-full text-xs font-medium border border-blue-500/40 animate-fadeIn shadow-lg"
                            style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  
                    {/* Enhanced Middle Section */}
                    <div className="flex-grow flex items-center justify-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                      <div className="text-center px-3">
                        <p className="text-gray-200 text-sm leading-relaxed line-clamp-4 mb-3">{project.description}</p>
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M13 10V3L4 14h7v7l9-11h-7z" clipRule="evenodd" />
                            </svg>
                            <span>Native</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" clipRule="evenodd" />
                            </svg>
                            <span>Cross-Platform</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Enhanced Bottom Section */}
                    <div className="pb-8 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                      <div className="text-center">
                        <div className="inline-flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                          <span className="text-xs text-green-400 font-medium">Live Mobile Project</span>
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <p className="flex items-center justify-center gap-2">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            AI-Powered Mobile Experience
                          </p>
                          <p>Optimized Performance & User Engagement</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Home Indicator - responsive sizing */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg ${
                  size === 'medium' ? 'bottom-2 w-1/3 h-1' : 'bottom-2 w-1/3 h-1'
                }`}></div>
              </div>
              
              {/* Enhanced Phone Shadow with depth */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-6 bg-black/30 blur-xl rounded-full transition-all duration-500 group-hover:w-full group-hover:h-8 group-hover:bg-black/50"></div>
            </div>
          </>
        )}
        
        {/* Add the shine animation to the document head */}
        <style>{shineAnimation}</style>
      </div>
      
      {/* Compact Debug Tile - Outside iPhone Mockup */}
      {process.env.NODE_ENV === 'development' && imageConfig.analysisComplete && project?.image && (
        <div className="mt-3 max-w-xs mx-auto">
          {/* Compact Header Tile */}
          <div 
            className="bg-gray-900/80 border border-gray-700/60 rounded-lg p-2 backdrop-blur-sm cursor-pointer hover:bg-gray-800/80 transition-colors"
            onClick={() => setIsDebugExpanded(!isDebugExpanded)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-purple-300 font-medium text-xs">Image Analysis</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Quick Status Indicators */}
                <div className={`w-2 h-2 rounded-full ${
                  imageConfig.quality === 'high' ? 'bg-green-400' :
                  imageConfig.quality === 'medium' ? 'bg-yellow-400' :
                  'bg-orange-400'
                }`} title={`${imageConfig.quality} quality`} />
                
                {imageConfig.needsOptimization ? (
                  <div className="w-2 h-2 rounded-full bg-orange-400" title="Optimized" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-green-400" title="Perfect ratio" />
                )}
                
                <svg 
                  className={`w-3 h-3 text-gray-400 transition-transform ${
                    isDebugExpanded ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* Compact Info Row */}
            <div className="mt-1 text-xs text-gray-400 font-mono">
              {imageConfig.imageType.toUpperCase()} • {imageConfig.originalDimensions.width}×{imageConfig.originalDimensions.height}
            </div>
          </div>
          
          {/* Expandable Details */}
          {isDebugExpanded && (
            <div className="mt-2 bg-gray-900/90 border border-gray-700/60 rounded-lg p-3 backdrop-blur-sm animate-fadeIn">
              {/* Image Type and Quality */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className={`px-2 py-1 rounded text-center text-xs ${
                  imageConfig.quality === 'high' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  imageConfig.quality === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                }`}>
                  <div className="font-mono font-bold">{imageConfig.imageType.toUpperCase()}</div>
                  <div className="opacity-75">{imageConfig.quality}</div>
                </div>
                
                {imageConfig.compressionNeeded && (
                  <div className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-center border border-blue-500/30 text-xs">
                    <div className="font-mono font-bold">COMPRESS</div>
                    <div className="opacity-75">needed</div>
                  </div>
                )}
              </div>
              
              {/* Optimization Status */}
              <div className="mb-3">
                {imageConfig.needsOptimization ? (
                  <div className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded border border-orange-500/30">
                    <div className="flex items-center gap-1 text-xs">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="font-medium">Optimized</span>
                    </div>
                    <div className="text-xs mt-1 space-y-0.5">
                      <div>{imageConfig.aspectRatio.toFixed(2)} → 16:9</div>
                      <div>Fit: {imageConfig.objectFit} • Pos: {imageConfig.objectPosition}</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-500/20 text-green-300 px-2 py-1 rounded border border-green-500/30">
                    <div className="flex items-center gap-1 text-xs">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">Perfect 16:9</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Technical Details */}
              <div className="text-xs text-gray-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Display:</span>
                  <span className="font-mono">Full coverage + rounded edges</span>
                </div>
                <div className="flex justify-between">
                  <span>Target:</span>
                  <span className="font-mono">{imageConfig.optimizedDimensions.width}×{imageConfig.optimizedDimensions.height}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SimplifiedIPhoneMockup