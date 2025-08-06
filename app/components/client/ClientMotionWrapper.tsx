'use client'

import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ReactNode } from 'react'

interface ClientMotionWrapperProps {
  children: ReactNode
  className?: string
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  whileHover?: any
  whileTap?: any
  onHoverStart?: () => void
  onHoverEnd?: () => void
  onClick?: () => void
}

export function ClientMotionWrapper({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  whileHover,
  whileTap,
  onHoverStart,
  onHoverEnd,
  onClick
}: ClientMotionWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export function ClientAnimatePresence({
  children,
  mode = 'wait'
}: {
  children: ReactNode
  mode?: 'wait' | 'sync' | 'popLayout'
}) {
  return (
    <AnimatePresence mode={mode}>
      {children}
    </AnimatePresence>
  )
}

export function ClientMotionMain({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.main>
  )
}

export function ClientMotionSection({
  children,
  className,
  delay = 0
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.section>
  )
}

export function ClientMotionDiv({
  children,
  className,
  initial,
  animate,
  transition,
  whileHover,
  onClick
}: {
  children: ReactNode
  className?: string
  initial?: any
  animate?: any
  transition?: any
  whileHover?: any
  onClick?: () => void
}) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={whileHover}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

export { useAnimation } from 'framer-motion'
