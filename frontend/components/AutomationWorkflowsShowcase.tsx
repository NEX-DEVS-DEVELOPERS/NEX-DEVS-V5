'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { AutomationWorkflow } from '@/app/api/automation-workflows/route'
import { audiowide, vt323 } from '@/frontend/utils/fonts'

// Custom Video Player Component
const CustomVideoPlayer = ({ src, poster, className = "", isSmall = false }: {
  src: string
  poster?: string
  className?: string
  isSmall?: boolean
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Additional useEffect to ensure playback rate is maintained
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = playbackRate
  }, [playbackRate])

  // Force update when video loads
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      video.playbackRate = playbackRate
      if (video.duration) {
        setDuration(video.duration)
      }
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('canplaythrough', handleCanPlay)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('canplaythrough', handleCanPlay)
    }
  }, [playbackRate])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch(console.error)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = (parseFloat(e.target.value) / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = parseFloat(e.target.value) / 100
    video.volume = newVolume
    setVolume(newVolume)
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const changePlaybackRate = () => {
    const video = videoRef.current
    if (!video) return

    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextIndex = (currentIndex + 1) % rates.length
    const newRate = rates[nextIndex]
    
    video.playbackRate = newRate
    setPlaybackRate(newRate)
    
    // Force video to apply the new playback rate
    if (!video.paused) {
      video.pause()
      video.play().catch(console.error)
    }
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercentage = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.5);
        }
        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.6);
        }
        .progress-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #8B5CF6;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.6);
        }
      `}</style>
      
      {/* NEX-DEVS Branding */}
      <div className={`absolute ${isSmall ? 'top-2 left-2' : 'top-3 left-3'} z-20 bg-black/80 backdrop-blur-sm ${isSmall ? 'px-2 py-1' : 'px-3 py-1'} rounded-lg ${isSmall ? 'text-xs' : 'text-xs'} text-purple-300 border border-purple-500/30 font-medium`}>
        Powered by NEX-DEVS
      </div>
      
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        preload="metadata"
        poster={poster}
        onClick={togglePlayPause}
        onLoadedMetadata={() => {
          const video = videoRef.current
          if (video) {
            setDuration(video.duration)
            video.playbackRate = playbackRate
          }
        }}
        onTimeUpdate={() => {
          const video = videoRef.current
          if (video) {
            setCurrentTime(video.currentTime)
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false)
          setCurrentTime(0)
        }}
        style={{ outline: 'none' }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Custom Video Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button 
            onClick={togglePlayPause}
            className={`${isSmall ? 'w-12 h-12' : 'w-16 h-16'} bg-purple-600/90 hover:bg-purple-500 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-xl shadow-purple-500/40 backdrop-blur-sm border border-purple-400/50 hover:scale-110`}
          >
            {isPlaying ? (
              <svg className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className={`${isSmall ? 'w-4 h-4 ml-0.5' : 'w-5 h-5 ml-1'}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>
        </div>
        
        {/* Bottom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 ${isSmall ? 'p-3' : 'p-4'}`}>
          {/* Progress Bar */}
          <div className={`w-full ${isSmall ? 'h-1' : 'h-1.5'} bg-white/20 rounded-full ${isSmall ? 'mb-2' : 'mb-3'} overflow-hidden cursor-pointer relative`}>
            <div 
              className={`h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-150`} 
              style={{ width: `${progressPercentage}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleProgressChange}
              className="w-full h-full opacity-0 cursor-pointer absolute top-0 left-0 progress-slider"
            />
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              {/* Volume Control */}
              <button 
                onClick={toggleMute}
                className={`${isSmall ? 'p-1' : 'p-1.5'} hover:text-purple-300 transition-colors hover:bg-black/30 rounded`}
              >
                <svg className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 24 24">
                  {isMuted ? (
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  ) : (
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  )}
                </svg>
              </button>
              
              {/* Volume Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume * 100}
                onChange={changeVolume}
                className={`${isSmall ? 'w-12' : 'w-16'} h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider`}
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${isMuted ? 0 : volume * 100}%, rgba(255,255,255,0.2) ${isMuted ? 0 : volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              
              {/* Time Display */}
              <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-purple-200 font-mono ml-1`}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Speed Control */}
              <button 
                onClick={changePlaybackRate}
                className={`${isSmall ? 'px-2 py-0.5 text-xs' : 'px-2 py-1 text-sm'} hover:text-purple-300 transition-colors bg-black/50 hover:bg-black/70 rounded border border-purple-500/30 min-w-[${isSmall ? '28px' : '32px'}] font-mono`}
                title={`Current speed: ${playbackRate}x`}
              >
                {playbackRate}x
              </button>
              
              {/* Fullscreen */}
              <button 
                onClick={toggleFullscreen}
                className={`${isSmall ? 'p-1' : 'p-1.5'} hover:text-purple-300 transition-colors hover:bg-black/30 rounded`}
              >
                <svg className={`${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AutomationWorkflowsShowcase() {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [featuredCurrentPage, setFeaturedCurrentPage] = useState(0)
  const [expandedWorkflow, setExpandedWorkflow] = useState<number | null>(null)
  const [expandedFeaturedWorkflow, setExpandedFeaturedWorkflow] = useState<number | null>(null)
  const [mediaView, setMediaView] = useState<{[key: number]: 'video' | 'image'}>({}) // Track media view per workflow
  const [featuredMediaView, setFeaturedMediaView] = useState<{[key: number]: 'video' | 'image'}>({}) // Track featured media view
  const itemsPerPage = 5
  const featuredItemsPerPage = 3

  useEffect(() => {
    fetchWorkflows()
  }, [])

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/automation-workflows')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched workflows:', data.length)
        setWorkflows(data)
      } else {
        setError('Failed to fetch workflows')
      }
    } catch (err) {
      setError('Error fetching workflows')
      console.error('Error fetching workflows:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpandWorkflow = (workflowId: number) => {
    setExpandedWorkflow(expandedWorkflow === workflowId ? null : workflowId)
  }

  const toggleExpandFeaturedWorkflow = (workflowId: number) => {
    setExpandedFeaturedWorkflow(expandedFeaturedWorkflow === workflowId ? null : workflowId)
  }

  const toggleMediaView = (workflowId: number, type: 'video' | 'image') => {
    setMediaView(prev => ({ ...prev, [workflowId]: type }))
  }

  const toggleFeaturedMediaView = (workflowId: number, type: 'video' | 'image') => {
    setFeaturedMediaView(prev => ({ ...prev, [workflowId]: type }))
  }

  const getWorkflowTypeIcon = (type: string) => {
    switch (type) {
      case 'n8n':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )
      case 'make':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      case 'zapier':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'custom_ai':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'ai_agent':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'business_automation':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
    }
  }

  const getWorkflowTypeName = (type: string) => {
    switch (type) {
      case 'n8n':
        return 'n8n Workflow'
      case 'make':
        return 'Make.com'
      case 'zapier':
        return 'Zapier'
      case 'custom_ai':
        return 'Custom AI'
      case 'ai_agent':
        return 'AI Agent'
      case 'business_automation':
        return 'Business Automation'
      default:
        return 'Automation'
    }
  }

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-600/20 text-green-300 border-green-500/30'
      case 'intermediate':
        return 'bg-blue-600/20 text-blue-300 border-blue-500/30'
      case 'advanced':
        return 'bg-orange-600/20 text-orange-300 border-orange-500/30'
      case 'expert':
        return 'bg-red-600/20 text-red-300 border-red-500/30'
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500/30'
    }
  }

  const categories = ['all', 'n8n', 'make', 'zapier', 'custom_ai', 'ai_agent', 'business_automation']
  const filteredWorkflows = selectedCategory === 'all' 
    ? workflows 
    : workflows.filter(w => w.workflow_type === selectedCategory)

  // Pagination logic
  const totalPages = Math.ceil(filteredWorkflows.length / itemsPerPage)
  const currentWorkflows = filteredWorkflows.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Reset pagination when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(0)
  }

  // Featured workflows with pagination
  const featuredWorkflows = workflows.filter(w => w.featured)
  const featuredTotalPages = Math.ceil(featuredWorkflows.length / featuredItemsPerPage)
  const currentFeaturedWorkflows = featuredWorkflows.slice(
    featuredCurrentPage * featuredItemsPerPage,
    (featuredCurrentPage + 1) * featuredItemsPerPage
  )

  const nextFeaturedPage = () => {
    if (featuredCurrentPage < featuredTotalPages - 1) {
      setFeaturedCurrentPage(featuredCurrentPage + 1)
    }
  }

  const prevFeaturedPage = () => {
    if (featuredCurrentPage > 0) {
      setFeaturedCurrentPage(featuredCurrentPage - 1)
    }
  }

  // Modal function placeholder
  const openModal = (workflow: AutomationWorkflow) => {
    // TODO: Implement modal functionality
    console.log('Opening modal for workflow:', workflow.title)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center py-16 bg-black rounded-xl border border-gray-800">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">Error Loading Workflows</h3>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.section 
      className="bg-black min-h-screen w-full py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span className="px-4 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
              AI Automation Hub
            </span>
          </div>
          
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${audiowide.className}`}>
            <span className="inline-flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-white">
                AI Automation & Workflows
              </span>
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Intelligent automation solutions powered by n8n, Make.com, Zapier, and custom AI agents to streamline your business processes
          </p>
        </motion.div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-20"
      >
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedCategory === category
                  ? 'bg-white !text-black border-white transform scale-105'
                  : 'bg-white/10 !text-white hover:bg-white hover:!text-black border-white/20 hover:border-white'
              }`}
            >
              {category === 'all' ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  All Automations
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <div className="w-4 h-4">{getWorkflowTypeIcon(category)}</div>
                  {getWorkflowTypeName(category)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* All Workflows - Recently Launched Style */}
        <div className="mb-16">
          <h3 className={`text-2xl font-bold text-white mb-8 text-center ${audiowide.className}`}>
            <span className="inline-flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recently Launched Automations
            </span>
          </h3>
          
          {currentWorkflows.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center py-16"
            >
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-purple-300 mb-2">No workflows found</h3>
              <p className="text-purple-400/70">
                {selectedCategory === 'all' 
                  ? 'No automation workflows available yet.' 
                  : `No ${getWorkflowTypeName(selectedCategory)} workflows found.`}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {currentWorkflows.map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black border border-purple-500/50 rounded-xl overflow-hidden hover:border-purple-400 shadow-lg shadow-purple-500/20 transition-all duration-300"
                >
                  {/* Main Workflow Card */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                      {/* Left - Image */}
                      <div className="lg:col-span-1">
                        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                          {workflow.image_url ? (
                            <img
                              src={workflow.image_url}
                              alt={workflow.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <div className="text-center">
                                <div className="p-3 bg-gray-800 rounded-lg text-purple-400 mb-2 inline-block">
                                  {getWorkflowTypeIcon(workflow.workflow_type)}
                                </div>
                                <p className="text-xs text-gray-500">Preview</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Middle - Content */}
                      <div className="lg:col-span-2 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-800 rounded-lg text-purple-400">
                            {getWorkflowTypeIcon(workflow.workflow_type)}
                          </div>
                          <span className="text-sm text-purple-300 font-medium">
                            {getWorkflowTypeName(workflow.workflow_type)}
                          </span>
                          {workflow.featured && (
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          )}
                        </div>

                        <h4 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                          {workflow.title}
                        </h4>
                        
                        <p className="text-gray-400 text-sm line-clamp-2">
                          {workflow.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getComplexityColor(workflow.complexity_level)}`}>
                            {workflow.complexity_level}
                          </span>
                          {workflow.estimated_setup_time && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-600">
                              ⏱️ {workflow.estimated_setup_time}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right - Stats & Actions */}
                      <div className="lg:col-span-1 space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <div className="text-lg font-semibold text-white">{workflow.success_rate_percentage}%</div>
                            <div className="text-xs text-purple-300">Success</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-white">{workflow.difficulty_rating}/5</div>
                            <div className="text-xs text-purple-300">Rating</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {workflow.demo_video_url && (
                            <a
                              href={workflow.demo_video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs text-center transition-colors border border-purple-400 shadow-lg shadow-purple-500/30"
                            >
                              Demo
                            </a>
                          )}
                          <button
                            onClick={() => toggleExpandWorkflow(workflow.id || 0)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-xs transition-colors border border-purple-400 shadow-lg shadow-purple-500/30"
                          >
                            {expandedWorkflow === workflow.id ? 'Less' : 'Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details Section */}
                  {expandedWorkflow === workflow.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-purple-500/50 bg-black p-6"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left - Media */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h5 className="text-lg font-semibold text-white mb-3">Media Preview</h5>
                            <div className="flex gap-2 mb-3">
                              {/* Show Image button when video is active and image exists */}
                              {workflow.agent_video_url && workflow.image_url && (mediaView[workflow.id || 0] || 'video') === 'video' && (
                                <button
                                  onClick={() => toggleMediaView(workflow.id || 0, 'image')}
                                  className="px-3 py-1 rounded-lg text-xs transition-colors border bg-purple-600 text-white border-purple-400 hover:bg-purple-700"
                                >
                                  <span className="inline-flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Image
                                  </span>
                                </button>
                              )}
                              {/* Show Video button when image is active and video exists */}
                              {workflow.agent_video_url && workflow.image_url && (mediaView[workflow.id || 0] || 'video') === 'image' && (
                                <button
                                  onClick={() => toggleMediaView(workflow.id || 0, 'video')}
                                  className="px-3 py-1 rounded-lg text-xs transition-colors border bg-purple-600 text-white border-purple-400 hover:bg-purple-700"
                                >
                                  <span className="inline-flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V8a2 2 0 012-2h2a2 2 0 012 2v2" />
                                    </svg>
                                    Video
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Dynamic Media Display */}
                          {(mediaView[workflow.id || 0] || 'video') === 'video' && workflow.agent_video_url ? (
                            <div className="mb-4">
                              <CustomVideoPlayer
                                src={workflow.agent_video_url}
                                poster={workflow.image_url}
                                className="aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/50 shadow-lg shadow-purple-500/20"
                                isSmall={true}
                              />
                              <p className="text-xs text-gray-500 mt-2">Agent Demo Video</p>
                            </div>
                          ) : workflow.image_url ? (
                            <div className="mb-4">
                              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-700">
                                <img
                                  src={workflow.image_url}
                                  alt={workflow.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Workflow Screenshot</p>
                            </div>
                          ) : (
                            <div className="mb-4">
                              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="p-3 bg-gray-800 rounded-lg text-purple-400 mb-2 inline-block">
                                    {getWorkflowTypeIcon(workflow.workflow_type)}
                                  </div>
                                  <p className="text-xs text-gray-500">No Media Available</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right - Detailed Info */}
                        <div className="space-y-6">
                          <div>
                            <h5 className="text-lg font-semibold text-white mb-3">Performance Metrics</h5>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-black p-3 rounded-lg border border-purple-500/50">
                                <div className="text-lg font-semibold text-white">{workflow.monthly_executions.toLocaleString()}</div>
                                <div className="text-xs text-purple-300">Monthly Executions</div>
                              </div>
                              <div className="bg-black p-3 rounded-lg border border-purple-500/50">
                                <div className="text-lg font-semibold text-white">{workflow.error_rate_percentage}%</div>
                                <div className="text-xs text-purple-300">Error Rate</div>
                              </div>
                            </div>
                          </div>

                          {workflow.automation_tools && workflow.automation_tools.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-purple-300 mb-2">Technologies</h5>
                              <div className="flex flex-wrap gap-1">
                                {workflow.automation_tools.map((tool, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-black text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/50"
                                  >
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {workflow.use_cases && workflow.use_cases.length > 0 && (
                            <div>
                              <h5 className="text-sm font-semibold text-blue-300 mb-2">Use Cases</h5>
                              <div className="flex flex-wrap gap-1">
                                {workflow.use_cases.map((useCase, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-black text-blue-300 px-2 py-1 rounded text-xs border border-purple-500/50"
                                  >
                                    {useCase}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {workflow.business_impact && (
                            <div>
                              <h5 className="text-sm font-semibold text-green-300 mb-2">Business Impact</h5>
                              <p className="text-gray-400 text-sm leading-relaxed">
                                {workflow.business_impact}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {workflow.github_workflow_url && (
                              <a
                                href={workflow.github_workflow_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors border border-purple-400 shadow-lg shadow-purple-500/30"
                              >
                                View Code
                              </a>
                            )}
                            {workflow.live_demo_url && (
                              <a
                                href={workflow.live_demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm text-center transition-colors border border-purple-400 shadow-lg shadow-purple-500/30"
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-white hover:bg-gray-200 disabled:bg-gray-300 disabled:opacity-50 text-black rounded-lg transition-colors border border-white disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-black text-sm">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <span className="text-black/70 text-xs">
                  ({filteredWorkflows.length} total workflows)
                </span>
              </div>
              
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-white hover:bg-gray-200 disabled:bg-gray-300 disabled:opacity-50 text-black rounded-lg transition-colors border border-white disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Featured Workflows */}
        {featuredWorkflows.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h3 className={`text-2xl font-bold text-white mb-12 text-center ${audiowide.className}`}>
              <span className="inline-flex items-center gap-2">
                <svg className="w-6 h-6 text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Featured Automations
                </span>
              </span>
            </h3>
            
            {currentFeaturedWorkflows.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center py-16"
              >
                <div className="mb-4">
                  <svg className="w-16 h-16 mx-auto text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-purple-300 mb-2">No featured workflows found</h3>
                <p className="text-purple-400/70">
                  No featured automation workflows available yet.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {currentFeaturedWorkflows.map((workflow, index) => (
                  <motion.div
                    key={workflow.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-black border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 group hover:shadow-lg hover:shadow-purple-500/10"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Image Section - Left */}
                      <div className="relative">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                          {workflow.image_url ? (
                            <img
                              src={workflow.image_url}
                              alt={workflow.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 bg-black">
                              <div className="text-center">
                                <div className="p-4 bg-black rounded-lg text-purple-400 mb-4 inline-block border border-purple-500/30">
                                  {getWorkflowTypeIcon(workflow.workflow_type)}
                                </div>
                                <p className="text-sm text-gray-500">Workflow Preview</p>
                              </div>
                            </div>
                          )}
                        </div>
                        {workflow.badge_text && (
                          <div className="absolute top-4 left-4">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium bg-black/50 backdrop-blur-sm border"
                              style={{ 
                                color: workflow.highlight_color || '#8B5CF6',
                                borderColor: `${workflow.highlight_color || '#8B5CF6'}40`
                              }}
                            >
                              {workflow.badge_text}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Details Section - Right */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg text-purple-400 border border-purple-500/30">
                            {getWorkflowTypeIcon(workflow.workflow_type)}
                          </div>
                          <span className="text-sm text-purple-300 capitalize font-medium">
                            {getWorkflowTypeName(workflow.workflow_type)}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-2xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3 group-hover:from-purple-300 group-hover:to-blue-300 transition-all duration-300">
                            {workflow.title}
                          </h4>
                          <p className="text-gray-400 leading-relaxed">
                            {workflow.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getComplexityColor(workflow.complexity_level)} shadow-sm`}>
                            {workflow.complexity_level}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 border border-purple-500/30">
                            {getWorkflowTypeName(workflow.workflow_type)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <span className="text-purple-300 text-sm">Success Rate</span>
                            <div className="text-xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                              {workflow.success_rate_percentage}%
                            </div>
                          </div>
                          <div>
                            <span className="text-purple-300 text-sm">Monthly Executions</span>
                            <div className="text-xl font-semibold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                              {workflow.monthly_executions.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {workflow.automation_tools && workflow.automation_tools.length > 0 && (
                          <div>
                            <span className="text-purple-300 text-sm mb-2 block font-medium">Technologies Used</span>
                            <div className="flex flex-wrap gap-1">
                              {workflow.automation_tools.slice(0, 4).map((tool, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 px-2 py-1 rounded text-xs border border-purple-500/30 hover:border-purple-400/50 transition-colors"
                                >
                                  {tool}
                                </span>
                              ))}
                              {workflow.automation_tools.length > 4 && (
                                <span className="text-gray-500 text-xs px-2 py-1">
                                  +{workflow.automation_tools.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3">
                          {workflow.demo_video_url && (
                            <a
                              href={workflow.demo_video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center border border-purple-500/30 hover:border-purple-400/50"
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V8a2 2 0 012-2h2a2 2 0 012 2v2" />
                                </svg>
                                Watch Demo
                              </span>
                            </a>
                          )}
                          {workflow.github_workflow_url && (
                            <a
                              href={workflow.github_workflow_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center border border-blue-500/30 hover:border-blue-400/50"
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                View Code
                              </span>
                            </a>
                          )}
                          <button
                            onClick={() => toggleExpandFeaturedWorkflow(workflow.id || 0)}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-center border border-purple-400 shadow-lg shadow-purple-500/30"
                          >
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {expandedFeaturedWorkflow === workflow.id ? 'Hide Details' : 'View Details'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Featured Workflow Expanded Details Section */}
                    {expandedFeaturedWorkflow === workflow.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-purple-500/50 bg-black p-6 mt-6"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left - Enhanced Media Section */}
                          <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                              <h5 className="text-xl font-semibold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                AI Agent Showcase
                              </h5>
                              <div className="flex gap-2">
                                {/* Show Image button when video is active and image exists */}
                                {workflow.agent_video_url && workflow.image_url && (featuredMediaView[workflow.id || 0] || 'video') === 'video' && (
                                  <button
                                    onClick={() => toggleFeaturedMediaView(workflow.id || 0, 'image')}
                                    className="px-3 py-1 rounded-lg text-xs transition-colors border bg-purple-600 text-white border-purple-400 hover:bg-purple-700"
                                  >
                                    <span className="inline-flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Image
                                    </span>
                                  </button>
                                )}
                                {/* Show Video button when image is active and video exists */}
                                {workflow.agent_video_url && workflow.image_url && (featuredMediaView[workflow.id || 0] || 'video') === 'image' && (
                                  <button
                                    onClick={() => toggleFeaturedMediaView(workflow.id || 0, 'video')}
                                    className="px-3 py-1 rounded-lg text-xs transition-colors border bg-purple-600 text-white border-purple-400 hover:bg-purple-700"
                                  >
                                    <span className="inline-flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V8a2 2 0 012-2h2a2 2 0 012 2v2" />
                                      </svg>
                                      Video
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Dynamic Featured Media Display */}
                            {(featuredMediaView[workflow.id || 0] || 'video') === 'video' && workflow.agent_video_url ? (
                              <div className="mb-6">
                                <CustomVideoPlayer
                                  src={workflow.agent_video_url}
                                  poster={workflow.image_url}
                                  className="aspect-video bg-black rounded-xl overflow-hidden border border-purple-500/50 shadow-lg shadow-purple-500/20"
                                  isSmall={false}
                                />
                                <div className="mt-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                  <p className="text-sm text-purple-300 font-medium">Live AI Agent Demo</p>
                                </div>
                              </div>
                            ) : workflow.image_url ? (
                              <div className="mb-6">
                                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-purple-500/50 shadow-lg shadow-purple-500/20">
                                  <img
                                    src={workflow.image_url}
                                    alt={workflow.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                  <p className="text-sm text-blue-300 font-medium">Workflow Interface</p>
                                </div>
                              </div>
                            ) : (
                              <div className="mb-6">
                                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-purple-500/50 shadow-lg shadow-purple-500/20 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="p-4 bg-purple-600/20 rounded-lg text-purple-400 mb-4 inline-block border border-purple-500/30">
                                      {getWorkflowTypeIcon(workflow.workflow_type)}
                                    </div>
                                    <p className="text-sm text-purple-400">Media Coming Soon</p>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  <p className="text-sm text-gray-400 font-medium">Placeholder Content</p>
                                </div>
                              </div>
                            )}

                            {/* Workflow Screenshot Gallery */}
                            {workflow.image_url && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/30">
                                  <img
                                    src={workflow.image_url}
                                    alt={`${workflow.title} - Main Interface`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                                {/* Placeholder for additional screenshots */}
                                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-purple-500/30 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="p-3 bg-purple-600/20 rounded-lg text-purple-400 mb-2 inline-block">
                                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                    </div>
                                    <p className="text-xs text-purple-400">Analytics Dashboard</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Right - Comprehensive AI Agent Details */}
                          <div className="space-y-6">
                            {/* AI Agent Capabilities */}
                            <div className="bg-black border border-purple-500/30 rounded-xl p-6">
                              <h6 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                AI Agent Capabilities
                              </h6>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="text-purple-300 font-medium text-sm">Natural Language Processing</p>
                                    <p className="text-gray-400 text-xs">Advanced NLP for understanding complex business queries and commands</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="text-blue-300 font-medium text-sm">Intelligent Decision Making</p>
                                    <p className="text-gray-400 text-xs">Context-aware automation decisions with 95%+ accuracy</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <div>
                                    <p className="text-green-300 font-medium text-sm">Multi-Platform Integration</p>
                                    <p className="text-gray-400 text-xs">Seamless connection with 50+ business tools and APIs</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="bg-black border border-purple-500/30 rounded-xl p-6">
                              <h6 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Advanced Metrics
                              </h6>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black border border-purple-500/50 p-4 rounded-lg text-center">
                                  <div className="text-2xl font-bold text-purple-400">{workflow.success_rate_percentage}%</div>
                                  <div className="text-xs text-purple-300">Success Rate</div>
                                  <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                                </div>
                                <div className="bg-black border border-purple-500/50 p-4 rounded-lg text-center">
                                  <div className="text-2xl font-bold text-blue-400">{workflow.monthly_executions.toLocaleString()}</div>
                                  <div className="text-xs text-blue-300">Executions</div>
                                  <div className="text-xs text-gray-500 mt-1">Monthly avg</div>
                                </div>
                                <div className="bg-black border border-purple-500/50 p-4 rounded-lg text-center">
                                  <div className="text-2xl font-bold text-green-400">{workflow.difficulty_rating}/5</div>
                                  <div className="text-xs text-green-300">Rating</div>
                                  <div className="text-xs text-gray-500 mt-1">User feedback</div>
                                </div>
                                <div className="bg-black border border-purple-500/50 p-4 rounded-lg text-center">
                                  <div className="text-2xl font-bold text-orange-400">{workflow.error_rate_percentage}%</div>
                                  <div className="text-xs text-orange-300">Error Rate</div>
                                  <div className="text-xs text-gray-500 mt-1">Minimal issues</div>
                                </div>
                              </div>
                            </div>

                            {/* Technology Stack */}
                            {workflow.automation_tools && workflow.automation_tools.length > 0 && (
                              <div className="bg-black border border-purple-500/30 rounded-xl p-6">
                                <h6 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Tech Stack & Integrations
                                </h6>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {workflow.automation_tools.map((tool, idx) => (
                                    <div
                                      key={idx}
                                      className="bg-black text-purple-300 px-3 py-2 rounded-lg text-xs border border-purple-500/50 text-center hover:border-purple-400 transition-colors"
                                    >
                                      {tool}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Business Impact */}
                            {workflow.business_impact && (
                              <div className="bg-black border border-purple-500/30 rounded-xl p-6">
                                <h6 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                  <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                  Business Impact & ROI
                                </h6>
                                <p className="text-gray-300 leading-relaxed text-sm mb-4">
                                  {workflow.business_impact}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-xs text-green-300">Time Saved: 75% reduction</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <span className="text-xs text-blue-300">Cost Reduction: 60%</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <span className="text-xs text-purple-300">Error Reduction: 95%</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <span className="text-xs text-yellow-300">ROI: 300%+ in 6 months</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                              {workflow.github_workflow_url && (
                                <a
                                  href={workflow.github_workflow_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center border border-purple-400 shadow-lg shadow-purple-500/30"
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    View Source Code
                                  </span>
                                </a>
                              )}
                              {workflow.live_demo_url && (
                                <a
                                  href={workflow.live_demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center border border-blue-400 shadow-lg shadow-blue-500/30"
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V8a2 2 0 012-2h2a2 2 0 012 2v2" />
                                    </svg>
                                    Try Live Demo
                                  </span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Featured Workflows Pagination Controls */}
            {featuredTotalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  onClick={prevFeaturedPage}
                  disabled={featuredCurrentPage === 0}
                  className="px-4 py-2 bg-white hover:bg-gray-200 disabled:bg-gray-300 disabled:opacity-50 text-black rounded-lg transition-colors border border-white disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-black text-sm">
                    Page {featuredCurrentPage + 1} of {featuredTotalPages}
                  </span>
                  <span className="text-black/70 text-xs">
                    ({featuredWorkflows.length} featured workflows)
                  </span>
                </div>
                
                <button
                  onClick={nextFeaturedPage}
                  disabled={featuredCurrentPage === featuredTotalPages - 1}
                  className="px-4 py-2 bg-white hover:bg-gray-200 disabled:bg-gray-300 disabled:opacity-50 text-black rounded-lg transition-colors border border-white disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-20 text-center bg-black border border-gray-800 rounded-2xl p-8"
      >
        <h3 className={`text-2xl font-bold mb-4 ${audiowide.className}`}>
          <span className="inline-flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Automate Your Business?
            </span>
          </span>
        </h3>
        <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
          Let us help you build custom automation workflows that save time, reduce errors, and scale your operations. 
          From simple task automation to complex AI-driven processes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-200 px-8 py-3 rounded-lg font-semibold transition-all duration-200 border border-purple-500/30 hover:border-purple-400/50"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Your Automation Project
            </span>
          </Link>
          <Link
            href="/services"
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-200 px-8 py-3 rounded-lg font-semibold transition-all duration-200 border border-blue-500/30 hover:border-blue-400/50"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Services
            </span>
          </Link>
        </div>
      </motion.div>
      </div>
    </motion.section>
  )
}