'use client'

import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'

interface ModernIPhoneMockupProps {
  project?: {
    id: number
    title: string
    description: string
    image: string
    technologies: string[]
    link: string
  }
  size?: 'small' | 'medium' | 'large'
}

// iPhone model component
function IPhoneModel({ project }: { project?: ModernIPhoneMockupProps['project'] }) {
  // Use a simplified model for better performance
  const iPhoneRef = useRef<THREE.Group>(null)
  const [screenTexture, setScreenTexture] = useState<THREE.Texture | null>(null)
  
  // Create dynamic screen texture based on project
  useEffect(() => {
    if (!project) return
    
    // Create a canvas to render the project info
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1024
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      // Draw a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, '#111')
      gradient.addColorStop(1, '#000')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add status bar
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas.width, 40)
      
      // Add time
      ctx.fillStyle = '#fff'
      ctx.font = '24px Arial'
      ctx.textAlign = 'left'
      ctx.fillText('9:41', 20, 30)
      
      // Add battery
      ctx.strokeStyle = '#fff'
      ctx.strokeRect(canvas.width - 50, 15, 30, 15)
      ctx.fillStyle = '#0f0'
      ctx.fillRect(canvas.width - 48, 17, 26, 11)
      
      // Create a placeholder for the project image
      ctx.fillStyle = '#111'
      ctx.fillRect(20, 60, canvas.width - 40, 300)
      
      // Add project title
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 32px Arial'
      ctx.textAlign = 'left'
      ctx.fillText(project.title.length > 20 ? project.title.substring(0, 20) + '...' : project.title, 20, 390)
      
      // Add project description
      ctx.fillStyle = '#aaa'
      ctx.font = '20px Arial'
      const words = project.description.split(' ')
      let line = ''
      let y = 420
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > canvas.width - 40) {
          ctx.fillText(line, 20, y)
          line = words[i] + ' '
          y += 28
          if (y > 580) break // Limit description height
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 20, y)
      
      // Add technologies
      ctx.fillStyle = '#222'
      let techX = 20
      let techY = 620
      
      for (let i = 0; i < Math.min(project.technologies.length, 3); i++) {
        const tech = project.technologies[i]
        ctx.fillRect(techX, techY, tech.length * 10 + 20, 30)
        ctx.fillStyle = '#6366f1'
        ctx.fillText(tech, techX + 10, techY + 20)
        ctx.fillStyle = '#222'
        techX += tech.length * 10 + 40
        if (techX > canvas.width - 100) {
          techX = 20
          techY += 40
        }
      }
      
      // Add view button
      ctx.fillStyle = '#3b82f6'
      ctx.fillRect(20, 700, canvas.width - 40, 50)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 24px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('View Project', canvas.width / 2, 735)
      
      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas)
      setScreenTexture(texture)
    }
  }, [project])
  
  // Animation
  useFrame((state) => {
    if (iPhoneRef.current) {
      iPhoneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })
  
  // Simplified iPhone model
  return (
    <group ref={iPhoneRef} position={[0, 0, 0]} scale={[1, 1, 1]}>
      {/* Phone body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 5.8, 0.4]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Screen */}
      <mesh position={[0, 0, 0.22]} receiveShadow>
        <boxGeometry args={[2.6, 5.6, 0.05]} />
        <meshStandardMaterial 
          color="#000" 
          metalness={0.5} 
          roughness={0.2}
          map={screenTexture || undefined} 
        />
      </mesh>
      
      {/* Notch */}
      <mesh position={[0, 2.7, 0.25]} castShadow>
        <boxGeometry args={[0.8, 0.2, 0.1]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* Camera */}
      <mesh position={[-1, 2.5, 0.25]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Button */}
      <mesh position={[-1.45, 1, 0]} castShadow>
        <boxGeometry args={[0.1, 0.5, 0.1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Volume buttons */}
      <mesh position={[-1.45, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[-1.45, -0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.3, 0.1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Power button */}
      <mesh position={[1.45, 0.5, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

const ModernIPhoneMockup = ({ project, size = 'medium' }: ModernIPhoneMockupProps) => {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])
  
  // Determine container dimensions based on size
  const containerClass = size === 'small' 
    ? 'h-96 w-72' 
    : size === 'large' 
      ? 'h-[600px] w-full max-w-md' 
      : 'h-[500px] w-full max-w-sm'
  
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
    <div className={`relative ${containerClass} mx-auto`}>
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Shadow element */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/30 blur-xl rounded-full"></div>
          
          {/* Three.js Canvas */}
          <div className="w-full h-full">
            <Suspense fallback={null}>
              <Canvas
                camera={{ position: [0, 0, 8], fov: 35 }}
                shadows
                dpr={[1, 2]}
              >
                <ambientLight intensity={0.5} />
                <spotLight 
                  position={[10, 10, 10]} 
                  angle={0.15} 
                  penumbra={1} 
                  intensity={1} 
                  castShadow 
                />
                <spotLight 
                  position={[-10, -10, -10]} 
                  angle={0.15} 
                  penumbra={1} 
                  intensity={0.5} 
                  castShadow={false}
                />
                
                <PresentationControls
                  global
                  rotation={[0, 0, 0]}
                  polar={[-Math.PI / 4, Math.PI / 4]}
                  azimuth={[-Math.PI / 4, Math.PI / 4]}
                  config={{ mass: 2, tension: 400 }}
                  snap={{ mass: 4, tension: 300 }}
                >
                  <IPhoneModel project={project} />
                </PresentationControls>
                
                <Environment preset="city" />
              </Canvas>
            </Suspense>
          </div>
          
          {/* Project Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-4 rounded-xl border border-gray-800/50">
            <h3 className="text-white font-medium text-sm truncate">{project.title}</h3>
            <div className="flex items-center mt-2">
              <div className="flex-1">
                <div className="flex gap-1">
                  {project.technologies.slice(0, 2).map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-blue-600/20 text-blue-300 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ModernIPhoneMockup
