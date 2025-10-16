'use client'

import { useEffect } from 'react'

// DISABLED: Barba initialization moved to prevent conflicts
const initializeBarba = async () => {
  // Barba initialization disabled to prevent button interaction conflicts
  // Only initialize if specifically needed and not already initialized
  return;
}

export default function SmoothScrollInitializer() {
  useEffect(() => {
    // Only run on client and ensure DOM is available
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // ULTRA-OPTIMIZED: Minimal anchor scrolling
    const initAnchorScrolling = () => {
      // Use event delegation for better performance
      const handleAnchorClick = (e: Event) => {
        const target = e.target as HTMLElement
        const link = target.closest('a[href^="#"]')
        if (!link) return

        e.preventDefault()
        const href = link.getAttribute('href')
        if (!href) return

        const targetElement = document.querySelector(href)
        if (targetElement) {
          const headerOffset = 80
          const elementPosition = targetElement.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }

      // Single event listener on document for all anchor links
      document.removeEventListener('click', handleAnchorClick)
      document.addEventListener('click', handleAnchorClick)
    }

    // Initialize Barba.js first
    initializeBarba()

    // Initialize anchor scrolling immediately
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAnchorScrolling)
    } else {
      initAnchorScrolling()
    }

    // No mutation observer needed with event delegation

    // Optimized scroll to top button - desktop only
    const addScrollToTop = () => {
      if (document.querySelector('.scroll-to-top-btn') || window.innerWidth <= 768) return

      const scrollToTopBtn = document.createElement('button')
      scrollToTopBtn.innerHTML = '↑'
      scrollToTopBtn.className = 'scroll-to-top-btn fixed bottom-5 right-5 w-12 h-12 rounded-full bg-white text-black border-none text-xl font-bold cursor-pointer z-50 opacity-0 transition-opacity duration-200'

      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })

      document.body?.appendChild(scrollToTopBtn)

      // Throttled scroll handler for button visibility
      let scrollTimer: number
      const toggleScrollToTop = () => {
        clearTimeout(scrollTimer)
        scrollTimer = window.setTimeout(() => {
          scrollToTopBtn.style.opacity = window.scrollY > 300 ? '1' : '0'
        }, 100)
      }

      window.addEventListener('scroll', toggleScrollToTop, { passive: true })
      toggleScrollToTop()
    }

    addScrollToTop()

    // Minimal cleanup
    return () => {
      document.querySelector('.scroll-to-top-btn')?.remove()
    }
  }, [])

  return null // This component doesn't render anything
}
