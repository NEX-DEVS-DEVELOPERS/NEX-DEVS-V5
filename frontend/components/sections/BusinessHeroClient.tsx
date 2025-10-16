'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { useIsMobile } from '@/frontend/utils/deviceDetection'
import NexShiftFlowchart from './NexShiftFlowchart'
import NeuralNetwork from '@/frontend/components/animations/NeuralNetwork'
import FastMovingLines from '@/frontend/components/animations/FastMovingLines'
import { ClientComponentErrorBoundary, AnimationErrorBoundary } from '@/frontend/components/ErrorBoundary'

interface HeroData {
  businessBenefits: Array<{
    title: string
    description: string
    icon: string
  }>
  advancedFeatures: Array<{
    title: string
    description: string
    icon: string
    details: string[]
  }>
  stats: {
    projectsCompleted: string
    clientSatisfaction: string
    yearsExperience: string
    technologiesUsed: string
  }
  services: Array<{
    title: string
    description: string
    features: string[]
  }>
}

interface BusinessHeroClientProps {
  heroData: HeroData
}

export default function BusinessHeroClient({ heroData }: BusinessHeroClientProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const isMobile = useIsMobile()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % heroData.advancedFeatures.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [heroData.advancedFeatures.length])

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <ClientComponentErrorBoundary>
      <div ref={containerRef} className="absolute inset-0 pointer-events-none">
        {/* Animated Background Effects */}
        <AnimationErrorBoundary>
          <motion.div
            className="absolute inset-0"
            style={{ y, opacity }}
          >
            {/* Neural Network Animation */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-30">
              <NeuralNetwork />
            </div>

            {/* Fast Moving Lines */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 opacity-20">
              <FastMovingLines />
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                  }}
                  animate={{
                    y: [null, -20, 20, -20],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </AnimationErrorBoundary>

        {/* Interactive Feature Showcase */}
        <motion.div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="bg-black/50 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6 max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">
                {heroData.advancedFeatures[currentFeature]?.title}
              </h3>
              <span className="text-2xl">
                {heroData.advancedFeatures[currentFeature]?.icon}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">
              {heroData.advancedFeatures[currentFeature]?.description}
            </p>
            
            <div className="space-y-2">
              {heroData.advancedFeatures[currentFeature]?.details.map((detail, index) => (
                <motion.div
                  key={detail}
                  className="flex items-center text-xs text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                  {detail}
                </motion.div>
              ))}
            </div>

            {/* Progress indicators */}
            <div className="flex space-x-2 mt-4">
              {heroData.advancedFeatures.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentFeature ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                  onClick={() => setCurrentFeature(index)}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Interactive Stats Animation */}
        <motion.div
          className="absolute top-1/2 right-10 transform -translate-y-1/2 pointer-events-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 50 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-black/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 space-y-3">
            {Object.entries(heroData.stats).map(([key, value], index) => (
              <motion.div
                key={key}
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
              >
                <div className="text-lg font-bold text-purple-400">{value}</div>
                <div className="text-xs text-gray-400 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Flowchart Integration */}
        {!isMobile && (
          <motion.div
            className="absolute bottom-10 right-10 pointer-events-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <div className="w-64 h-48">
              <NexShiftFlowchart />
            </div>
          </motion.div>
        )}

        {/* Interactive Hover Effects for Benefits */}
        <div className="absolute inset-0 pointer-events-none">
          {heroData.businessBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="absolute pointer-events-auto"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
              }}
              whileHover={{ scale: 1.1, z: 10 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 0.7 : 0 }}
              transition={{ delay: 2 + index * 0.2 }}
            >
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full flex items-center justify-center text-lg hover:bg-purple-500/40 transition-colors cursor-pointer">
                {benefit.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-5 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 3 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1 h-3 bg-purple-500 rounded-full mt-2"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    </ClientComponentErrorBoundary>
  )
}
