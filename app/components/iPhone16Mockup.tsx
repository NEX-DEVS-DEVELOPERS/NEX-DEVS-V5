'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface iPhone16MockupProps {
  project?: {
    id: number
    title: string
    description: string
    image: string
    technologies: string[]
    link: string
  }
}

const iPhone16Mockup = ({ project }: iPhone16MockupProps) => {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (!project) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-48 h-96 mx-auto mb-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] border border-gray-700 flex items-center justify-center">
            <span className="text-gray-500">No Mobile Project</span>
          </div>
          <p className="text-gray-400 text-sm">Select a mobile project to preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center py-12">
      {/* iPhone 16 Pro Frame */}
      <div className="relative group">
        {/* Phone Shadow */}
        <div className="absolute inset-0 bg-black/20 blur-xl transform translate-y-8 scale-95 rounded-[3rem]" />
        
        {/* Phone Body */}
        <div 
          className={`
            relative w-72 h-[600px] bg-gradient-to-br from-gray-900 via-black to-gray-800 
            rounded-[3rem] border-4 border-gray-700 shadow-2xl transform transition-all duration-700
            ${isLoading ? 'scale-95 opacity-70' : 'scale-100 opacity-100 hover:scale-105'}
          `}
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1)
            `
          }}
        >
          {/* Dynamic Island */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full border border-gray-800" />
          
          {/* Screen */}
          <div className="absolute top-12 left-4 right-4 bottom-12 bg-black rounded-[2.5rem] overflow-hidden border border-gray-800">
            {/* Screen Content */}
            <div className="relative w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20">
              {/* Status Bar */}
              <div className="flex justify-between items-center px-6 py-2 text-white text-xs">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                  <div className="w-6 h-3 border border-white rounded-sm">
                    <div className="w-4 h-2 bg-green-500 rounded-sm m-0.5" />
                  </div>
                </div>
              </div>
              
              {/* App Content */}
              <div className="flex-1 p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    {/* App Image */}
                    <div className="relative h-48 mb-4 rounded-2xl overflow-hidden bg-gray-800">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    
                    {/* App Info */}
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-600/30 text-purple-300 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* Download Button */}
                      <div className="mt-auto">
                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium">
                          View Project
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Side Buttons */}
          <div className="absolute left-0 top-24 w-1 h-12 bg-gray-600 rounded-r" />
          <div className="absolute left-0 top-40 w-1 h-8 bg-gray-600 rounded-r" />
          <div className="absolute left-0 top-52 w-1 h-8 bg-gray-600 rounded-r" />
          <div className="absolute right-0 top-32 w-1 h-16 bg-gray-600 rounded-l" />
          
          {/* Camera Bump (back) */}
          <div className="absolute -right-2 top-20 w-4 h-4 bg-gray-800 rounded-full border-2 border-gray-700" />
        </div>
        
        {/* Reflection Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 pointer-events-none" />
      </div>
    </div>
  )
}

export default iPhone16Mockup
