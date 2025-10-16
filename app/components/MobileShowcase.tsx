'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { audiowide } from '@/frontend/utils/fonts'

// Add CSS for custom transitions
const customTransitions = `
.ease-out-expo {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
`

// Use the simplified mockup instead of Three.js version to avoid React reconciliation errors
import SimplifiedIPhoneMockup from './SimplifiedIPhoneMockup'

// Fallback to original iPhone mockup if needed
const iPhone16Mockup = dynamic(() => import('./iPhone16Mockup'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
    </div>
  )
})

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  category: string
  showcase_location?: string
  display_type?: string
}

export default function MobileShowcase() {
  const [mobileProjects, setMobileProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [iPhoneSize, setIPhoneSize] = useState<'medium' | 'large'>('large')

  useEffect(() => {
    fetchMobileProjects()
  }, [])

  const fetchMobileProjects = async () => {
    try {
      // Use explicit showcase_location parameter
      const response = await fetch('/api/projects?showcase_location=mobile_showcase')
      if (response.ok) {
        const data = await response.json()
        console.log('Mobile Projects API response:', data.length)
        
        // Properly filter mobile projects using showcase_location and display_type
        const mobileFiltered = data.filter((project: Project) => 
          project.showcase_location === 'mobile_showcase' || 
          project.display_type === 'mobile_app' ||
          project.category?.toLowerCase().includes('mobile') ||
          project.category?.toLowerCase().includes('app') ||
          project.title?.toLowerCase().includes('mobile') ||
          project.title?.toLowerCase().includes('app') ||
          project.description?.toLowerCase().includes('mobile') ||
          project.description?.toLowerCase().includes('ios') ||
          project.description?.toLowerCase().includes('android')
        )
        
        console.log('Mobile filtered projects:', mobileFiltered.length)
        setMobileProjects(mobileFiltered)
        if (mobileFiltered.length > 0) {
          setSelectedProject(mobileFiltered[0])
        }
      }
    } catch (error) {
      console.error('Error fetching mobile projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-gray-800 h-8 w-64 mx-auto mb-4 rounded" />
            <div className="animate-pulse bg-gray-800 h-4 w-96 mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="animate-pulse bg-gray-800 h-96 rounded-xl" />
            <div className="animate-pulse bg-gray-800 h-96 rounded-xl" />
            <div className="animate-pulse bg-gray-800 h-96 rounded-xl" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-black">
      {/* Add custom transitions CSS */}
      <style>{customTransitions}</style>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-black to-purple-900/5" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="px-4 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium">
              Mobile Excellence
            </span>
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 ${audiowide.className}`}>
            Mobile Applications & Experiences
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Native and cross-platform mobile applications designed for optimal performance, 
            user experience, and engagement across iOS and Android platforms.
          </p>
        </div>

        {mobileProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-black/95 to-gray-900/95 rounded-2xl p-12 border border-blue-500/30 backdrop-blur-lg shadow-2xl transition-all duration-700 ease-out-expo hover:shadow-blue-500/20">
              <SimplifiedIPhoneMockup />
              <h3 className="text-xl text-blue-300 mb-2 mt-8 font-semibold">Mobile Projects Portfolio</h3>
              <p className="text-gray-400">Innovative mobile applications showcasing cutting-edge development</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Focus Mode Controls - Positioned above left details panel */}
            <div className="absolute top-0 left-0 md:top-4 md:left-4 z-50 flex flex-col gap-2 mb-4">
              {/* Focus View Toggle */}
              <button
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 backdrop-blur-md ${
                  isFocusMode 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border border-purple-500'
                    : 'bg-black/70 hover:bg-black/80 text-blue-300 border border-blue-500/30 hover:border-blue-400/50'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{isFocusMode ? 'Exit Focus' : 'Focus View'}</span>
              </button>
              
              {/* iPhone Size Toggle - only medium and large */}
              <button
                onClick={() => {
                  const sizes: ('medium' | 'large')[] = ['medium', 'large']
                  const currentIndex = sizes.indexOf(iPhoneSize)
                  const nextIndex = (currentIndex + 1) % sizes.length
                  setIPhoneSize(sizes[nextIndex])
                }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2 backdrop-blur-md bg-black/70 hover:bg-black/80 text-gray-300 border border-gray-500/30 hover:border-gray-400/50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span className="capitalize">{iPhoneSize}</span>
              </button>
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all duration-500 ease-out-expo ${
              isFocusMode ? 'lg:grid-cols-1' : ''
            }`}>
            {/* Left Project Details - Compact & Professional with top margin for controls */}
            <div className={`lg:col-span-3 space-y-4 transition-all duration-500 ease-out-expo mt-24 md:mt-28 ${
              isFocusMode 
                ? 'opacity-20 blur-sm pointer-events-none lg:hidden' 
                : 'opacity-100 blur-0 pointer-events-auto'
            }`}>
              <div className="bg-gradient-to-br from-black/95 to-gray-900/90 backdrop-blur-xl rounded-xl p-6 border border-blue-500/30 shadow-xl hover:shadow-blue-500/10 transition-all duration-400 h-fit border-opacity-80">
                {selectedProject && (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                        <span className="text-green-300 text-xs font-semibold tracking-wide">Live</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
                        <svg className="w-3 h-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-blue-300 text-xs font-medium">Mobile</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3 transition-all duration-500 ease-out-expo">
                      {selectedProject.title}
                    </h3>
                    <p className="text-gray-300 mb-4 leading-relaxed text-sm transition-all duration-500 ease-out-expo line-clamp-3">
                      {selectedProject.description}
                    </p>
                    
                    {/* Compact Tech Stack */}
                    <div className="mb-4">
                      <h4 className="text-purple-300 font-medium mb-2 flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Tech Stack
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProject.technologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 rounded-lg text-xs border border-blue-500/40 transition-all duration-300 ease-out-expo hover:scale-105 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                        {selectedProject.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded-lg text-xs border border-gray-500/30">
                            +{selectedProject.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Compact Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/projects/${selectedProject.id}`}
                        className="block w-full bg-gradient-to-r from-white to-gray-100 text-gray-900 py-2.5 px-4 rounded-lg font-medium text-center hover:from-gray-50 hover:to-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ease-out-expo flex items-center justify-center gap-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        View Details
                      </Link>
                      <div className="block w-full bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/50 text-blue-200 py-2.5 px-4 rounded-lg font-medium text-center transition-all duration-300 shadow-md flex items-center justify-center gap-2 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Mobile Experience
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Compact Features */}
              <div className="bg-gradient-to-br from-black/80 to-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-gray-700/50 shadow-xl transition-all duration-500 ease-out-expo hover:shadow-lg h-fit">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Features
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: (<svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>), feature: 'Native Performance', desc: 'Optimized for mobile' },
                    { icon: (<svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>), feature: 'Cross-Platform', desc: 'iOS & Android ready' },
                    { icon: (<svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>), feature: 'Fast Loading', desc: 'Optimized performance' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-black/40 border border-gray-700/30 transition-all duration-300 ease-out-expo hover:translate-x-1 hover:bg-black/60">
                      {item.icon}
                      <div>
                        <div className="text-gray-200 font-medium text-xs">{item.feature}</div>
                        <div className="text-gray-400 text-xs">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Center iPhone Mockup - Enhanced */}
            <div className={`flex justify-center transition-all duration-500 ease-out-expo ${
              isFocusMode ? 'lg:col-span-12' : 'lg:col-span-6'
            }`}>
              <div className="relative group">
                {/* Clean subtle backdrop without glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/10 via-gray-700/5 to-gray-600/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-60 transition-all duration-400 transform group-hover:scale-110"></div>
                <div className="relative z-10 transition-all duration-400 group-hover:scale-[1.01] group-hover:-translate-y-2">
                  <SimplifiedIPhoneMockup project={selectedProject || undefined} size={iPhoneSize} />
                </div>
              </div>
            </div>
            
            {/* Right Project Selection */}
            <div className={`lg:col-span-3 space-y-4 transition-all duration-500 ease-out-expo ${
              isFocusMode 
                ? 'opacity-20 blur-sm pointer-events-none lg:hidden' 
                : 'opacity-100 blur-0 pointer-events-auto'
            }`}>
              <div className="bg-gradient-to-br from-black/95 to-gray-900/85 backdrop-blur-xl rounded-xl p-5 border border-purple-500/30 shadow-xl hover:shadow-purple-500/10 transition-all duration-400 h-fit border-opacity-80">
                <h4 className="text-white font-medium mb-4 flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Mobile Portfolio
                </h4>
                <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-gray-800/30">
                  {mobileProjects.map((project, index) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ease-out-expo transform hover:scale-[1.02] ${
                        selectedProject?.id === project.id
                          ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/20 border border-blue-500/60 shadow-lg shadow-blue-500/20'
                          : 'bg-black/70 border border-gray-800/50 hover:bg-gradient-to-r hover:from-gray-900/80 hover:to-black/80 hover:border-gray-700/60'
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg">
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white font-medium text-xs mb-1 truncate">
                            {project.title}
                          </h5>
                          <p className="text-gray-400 text-xs line-clamp-1 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            selectedProject?.id === project.id 
                              ? 'bg-blue-500 shadow-lg shadow-blue-500/50 animate-pulse' 
                              : 'bg-gray-600'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Compact Platform Statistics */}
              <div className="bg-gradient-to-br from-black/90 to-gray-900/70 backdrop-blur-xl rounded-lg p-4 border border-gray-700/60 shadow-xl transition-all duration-500 ease-out-expo hover:shadow-lg h-fit">
                <h5 className="text-white font-medium mb-3 text-xs flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Platform Support
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-blue-900/20 to-blue-800/20 border border-blue-600/30 transition-all duration-300 ease-out-expo hover:scale-[1.01]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                      </div>
                      <span className="text-gray-200 text-xs font-medium">iOS</span>
                    </div>
                    <span className="text-blue-400 text-xs font-semibold">Compatible</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-600/30 transition-all duration-300 ease-out-expo hover:scale-[1.01]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m-5.046-2.7034c-.5511 0-.9993-.4486-.9993-.9993s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m-5.046 2.7034c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997M6.05 9.0273c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993-.0001.5511-.4482.9997-.9993.9997"/>
                        </svg>
                      </div>
                      <span className="text-gray-200 text-xs font-medium">Android</span>
                    </div>
                    <span className="text-green-400 text-xs font-semibold">Optimized</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-600/30 transition-all duration-300 ease-out-expo hover:scale-[1.01]">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-md flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                      </div>
                      <span className="text-gray-200 text-xs font-medium">Web</span>
                    </div>
                    <span className="text-purple-400 text-xs font-semibold">PWA Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
    </section>
  )
}
