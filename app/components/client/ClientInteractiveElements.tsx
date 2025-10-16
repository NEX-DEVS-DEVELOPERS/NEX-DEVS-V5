'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Client-side interactive state management
export function useClientState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue)
  return [state, setState] as const
}

// Client-side effect hook wrapper
export function useClientEffect(effect: () => void | (() => void), deps?: any[]) {
  useEffect(effect, deps)
}

// Interactive hover state component
export function ClientHoverCard({
  children,
  className,
  hoverClassName,
  onHover,
  onLeave
}: {
  children: React.ReactNode
  className?: string
  hoverClassName?: string
  onHover?: () => void
  onLeave?: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`${className} ${isHovered ? hoverClassName : ''}`}
      onMouseEnter={() => {
        setIsHovered(true)
        onHover?.()
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onLeave?.()
      }}
    >
      {children}
    </div>
  )
}

// Interactive expandable content
export function ClientExpandableContent({
  children,
  trigger,
  className,
  isExpanded: controlledExpanded,
  onToggle
}: {
  children: React.ReactNode
  trigger: React.ReactNode
  className?: string
  isExpanded?: boolean
  onToggle?: (expanded: boolean) => void
}) {
  const [internalExpanded, setInternalExpanded] = useState(false)
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded

  const handleToggle = () => {
    const newExpanded = !isExpanded
    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded)
    }
    onToggle?.(newExpanded)
  }

  return (
    <div className={className}>
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Client-side loading state
export function ClientLoadingState({
  isLoading,
  children,
  fallback
}: {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        {fallback || (
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        )}
      </div>
    )
  }

  return <>{children}</>
}

// Interactive button with client-side state
export function ClientInteractiveButton({
  children,
  onClick,
  className,
  disabled = false,
  loading = false
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  loading?: boolean
}) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = () => {
    if (disabled || loading) return
    
    setIsClicked(true)
    onClick?.()
    
    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 200)
  }

  return (
    <motion.button
      className={`${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  )
}

// Client-side scroll trigger
export function useClientScrollTrigger(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold])

  return [ref, isVisible] as const
}

// Client-side animated counter
export function ClientAnimatedCounter({
  end,
  duration = 2000,
  className
}: {
  end: number
  duration?: number
  className?: string
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const startCount = 0

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * (end - startCount) + startCount))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className={className}>
      {count}
    </div>
  )
}

// Client-side form state management
export function useClientForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = (key: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }))
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }))
    }
  }

  const setError = (key: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [key]: error }))
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setError,
    setIsSubmitting,
    reset
  }
}

