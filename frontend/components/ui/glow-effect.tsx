'use client'

import { motion } from 'framer-motion'
import { useIsMobile } from '@/frontend/utils/deviceDetection'

interface GlowEffectProps {
  color?: string
  blur?: number
  className?: string
}

export const GlowEffect = ({ 
  color = 'rgba(255, 255, 255, 0.1)', 
  blur = 100,
  className = ''
}: GlowEffectProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={isMobile ? { opacity: 0.4 } : { 
        opacity: [0.4, 0.6, 0.4],
        scale: [1, 1.1, 1],
      }}
      transition={isMobile ? { duration: 0 } : {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`absolute pointer-events-none ${className}`}
      style={{
        background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
        filter: `blur(${blur}px)`,
      }}
    />
  )
} 