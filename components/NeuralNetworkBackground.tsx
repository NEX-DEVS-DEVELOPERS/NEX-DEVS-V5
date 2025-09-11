'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Static node interface - no velocity needed
interface Node {
  x: number
  y: number
  id: number
}

// Static connection interface
interface Connection {
  from: Node
  to: Node
  distance: number
  id: string
}

// Moving particle interface - only these move
interface Particle {
  connectionIndex: number
  progress: number
  speed: number
  direction: 1 | -1 // Forward or backward along the line
  size: number
  opacity: number
  id: string
  color: string // Add color property for rainbow effect
}

interface NeuralNetworkBackgroundProps {
  nodeCount?: number
  maxConnections?: number
  nodeSize?: number
  className?: string
}

const NeuralNetworkBackground: React.FC<NeuralNetworkBackgroundProps> = ({
  nodeCount = 45, // Increased nodes for wider coverage
  maxConnections = 6, // More connections for better spread
  nodeSize = 3,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])
  const connectionsRef = useRef<Connection[]>([])
  const particlesRef = useRef<Particle[]>([])

  // Initialize static nodes - they don't move
  const initializeNodes = (width: number, height: number) => {
    const nodes: Node[] = []
    const padding = 40 // Reduced padding to allow more spread
    const minDistance = 45 // Reduced minimum distance for wider spread
    
    for (let i = 0; i < nodeCount; i++) {
      let attempts = 0
      let validPosition = false
      let newNode: Node
      
      // Try to find a position with adequate spacing
      do {
        newNode = {
          x: padding + Math.random() * (width - 2 * padding),
          y: padding + Math.random() * (height - 2 * padding), // Full height spread
          id: i
        }
        
        // Check if this position is far enough from existing nodes
        validPosition = nodes.every(existingNode => {
          const distance = Math.sqrt(
            Math.pow(newNode.x - existingNode.x, 2) + 
            Math.pow(newNode.y - existingNode.y, 2)
          )
          return distance >= minDistance
        })
        
        attempts++
      } while (!validPosition && attempts < 50) // Limit attempts to avoid infinite loop
      
      nodes.push(newNode)
    }
    nodesRef.current = nodes
  }

  // Create static connections between nodes
  const initializeConnections = () => {
    const connections: Connection[] = []
    const nodes = nodesRef.current
    const nodeConnections: { [key: number]: number } = {}
    const maxConnectionDistance = Math.min(window.innerWidth, window.innerHeight) * 0.4 // Increased for much wider spread
    
    // Initialize connection count for each node
    nodes.forEach(node => {
      nodeConnections[node.id] = 0
    })

    // Connect each node to nearby nodes with limits
    for (let i = 0; i < nodes.length; i++) {
      if (nodeConnections[i] >= maxConnections) continue
      
      // Find closest nodes within connection distance
      const distances = nodes
        .map((node, index) => ({ 
          node, 
          index, 
          distance: Math.sqrt(Math.pow(nodes[i].x - node.x, 2) + Math.pow(nodes[i].y - node.y, 2))
        }))
        .filter(item => 
          item.index !== i && 
          nodeConnections[item.index] < maxConnections &&
          item.distance <= maxConnectionDistance // Much wider connection range
        )
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxConnections - nodeConnections[i])
      
      distances.forEach(({ node, index, distance }) => {
        if (nodeConnections[i] < maxConnections && nodeConnections[index] < maxConnections) {
          connections.push({
            from: nodes[i],
            to: node,
            distance,
            id: `${i}-${index}`
          })
          nodeConnections[i]++
          nodeConnections[index]++
        }
      })
    }

    connectionsRef.current = connections
  }

  // Initialize particles - dots that move on connection lines
  const initializeParticles = () => {
    const connections = connectionsRef.current
    const particles: Particle[] = []
    
    // Neon rainbow colors for particles
    const neonColors = [
      'rgba(255, 20, 147, 0.9)',   // Neon Pink
      'rgba(0, 255, 255, 0.9)',    // Neon Cyan
      'rgba(50, 255, 50, 0.9)',    // Neon Green
      'rgba(255, 255, 0, 0.9)',    // Neon Yellow
      'rgba(255, 100, 0, 0.9)',    // Neon Orange
      'rgba(138, 43, 226, 0.9)',   // Neon Purple
      'rgba(255, 0, 100, 0.9)',    // Neon Red-Pink
      'rgba(0, 255, 150, 0.9)',    // Neon Mint
    ]
    
    // Create 1-2 particles per connection
    connections.forEach((connection, index) => {
      const particleCount = 1 + Math.floor(Math.random() * 2) // 1-2 particles per line
      
      for (let i = 0; i < particleCount; i++) {
        const colorIndex = (index + i) % neonColors.length
        particles.push({
          connectionIndex: index,
          progress: Math.random(), // Random starting position
          speed: 0.002 + Math.random() * 0.008, // Slower, more elegant movement
          direction: Math.random() > 0.5 ? 1 : -1, // Random direction
          size: 2 + Math.random() * 2, // Variable sizes
          opacity: 0.6 + Math.random() * 0.4, // Variable opacity
          id: `${connection.id}-${i}`,
          color: neonColors[colorIndex] // Assign rainbow color
        })
      }
    })
    
    particlesRef.current = particles
  }

  // Update only particle positions
  const updateParticles = () => {
    particlesRef.current.forEach(particle => {
      // Move particle along its connection
      particle.progress += particle.speed * particle.direction
      
      // Bounce at endpoints
      if (particle.progress >= 1) {
        particle.progress = 1
        particle.direction = -1
      } else if (particle.progress <= 0) {
        particle.progress = 0
        particle.direction = 1
      }
      
      // Add slight opacity pulsing
      particle.opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(Date.now() * 0.002 + parseFloat(particle.id.split('-')[1]) * 2))
    })
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas
    
    // High DPI support for better quality
    const dpr = window.devicePixelRatio || 1
    
    // Clear canvas with anti-aliasing
    ctx.clearRect(0, 0, width, height)
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Only update particles (nodes and connections are static)
    updateParticles()

    // Draw static connections with dotted lines, higher quality and bolder appearance
    connectionsRef.current.forEach(connection => {
      const maxDistance = Math.min(width, height) * 0.5 // Much wider connection range
      const opacity = Math.max(0.4, 1 - (connection.distance / maxDistance)) // Higher minimum opacity for visibility
      
      ctx.beginPath()
      ctx.moveTo(connection.from.x, connection.from.y)
      ctx.lineTo(connection.to.x, connection.to.y)
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.85})` // White color for polished look
      ctx.lineWidth = 3.5 // Much bolder lines
      ctx.lineCap = 'round'
      
      // Create more polished dotted line pattern
      ctx.setLineDash([6, 4]) // More refined dotted pattern: 6px dash, 4px gap
      ctx.stroke()
      
      // Reset line dash for other elements
      ctx.setLineDash([])
    })

    // Draw static nodes with polished white styling
    nodesRef.current.forEach(node => {
      // Subtle outer glow with white color
      ctx.beginPath()
      ctx.arc(node.x, node.y, nodeSize + 1.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.fill()
      
      // Main node with white color
      ctx.beginPath()
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fill()
      
      // Inner highlight for polished look
      ctx.beginPath()
      ctx.arc(node.x, node.y, nodeSize * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.fill()
    })

    // Draw moving particles with rainbow neon colors
    particlesRef.current.forEach(particle => {
      const connection = connectionsRef.current[particle.connectionIndex]
      if (!connection) return
      
      // Calculate particle position on the line
      const x = connection.from.x + (connection.to.x - connection.from.x) * particle.progress
      const y = connection.from.y + (connection.to.y - connection.from.y) * particle.progress
      
      // Extract RGB values from particle color for glow effect
      const colorMatch = particle.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
      const r = colorMatch ? parseInt(colorMatch[1]) : 255
      const g = colorMatch ? parseInt(colorMatch[2]) : 255
      const b = colorMatch ? parseInt(colorMatch[3]) : 255
      
      // Outer glow with particle's rainbow color
      ctx.beginPath()
      ctx.arc(x, y, particle.size + 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity * 0.3})`
      ctx.fill()
      
      // Main particle with rainbow neon color
      ctx.beginPath()
      ctx.arc(x, y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color.replace('0.9', particle.opacity.toString())
      ctx.fill()
      
      // Inner highlight for extra neon effect
      ctx.beginPath()
      ctx.arc(x, y, particle.size * 0.5, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.8})`
      ctx.fill()
    })

    animationRef.current = requestAnimationFrame(animate)
  }

  const handleResize = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const dpr = window.devicePixelRatio || 1
    const rect = parent.getBoundingClientRect()
    
    // Set actual size in memory (scaled for high DPI)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    
    // Scale the canvas back down using CSS
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    // Scale the drawing context so everything draws at the correct size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    // Reinitialize static elements with new dimensions
    initializeNodes(rect.width, rect.height)
    initializeConnections()
    initializeParticles()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set initial canvas size with high DPI support
    handleResize()

    // Start animation
    animate()

    // Add resize listener
    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [nodeCount, maxConnections])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'transparent',
          zIndex: -1
        }}
      />
    </div>
  )
}

export default NeuralNetworkBackground