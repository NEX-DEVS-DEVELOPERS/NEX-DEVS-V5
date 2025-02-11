import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Image loading optimization
export const preloadImage = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = resolve
    img.onerror = reject
  })
}

// Accessibility helper
export const handleKeyboardSubmit = (
  callback: () => void
) => (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    callback()
  }
}

// Performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
} 