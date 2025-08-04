'use client'

import { useEffect } from 'react'

// Dynamic import for Barba.js to avoid SSR issues
const initializeBarba = async () => {
  if (typeof window !== 'undefined') {
    try {
      const { useBarba } = await import('@/utils/barba-init')
      useBarba({
        optimizeWelcomeScreen: true,
        transitionSpeed: 0.4,
        easing: [0.22, 1, 0.36, 1]
      })
    } catch (error) {
      console.log('Barba.js initialization skipped:', error)
    }
  }
}

export default function SmoothScrollInitializer() {
  useEffect(() => {
    // Only run on client and ensure DOM is available
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    // Initialize smooth scrolling for anchor links
    const initSmoothScrolling = () => {
      const anchorLinks = document.querySelectorAll('a[href^="#"]')

      anchorLinks.forEach(link => {
        const handleClick = (e: Event) => {
          e.preventDefault()

          const href = link.getAttribute('href')
          if (!href) return

          const targetElement = document.querySelector(href)
          if (targetElement) {
            // Use native smooth scrolling with offset for header
            const headerOffset = 80
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }

        // Remove existing listener to prevent duplicates
        link.removeEventListener('click', handleClick)
        link.addEventListener('click', handleClick)
      })
    }

    // Initialize Barba.js first
    initializeBarba()

    // Initialize on mount - wait for DOM to be ready
    const initialize = () => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmoothScrolling)
      } else {
        initSmoothScrolling()
      }
    }

    initialize()

    // Re-initialize when new content is added
    const observer = new MutationObserver(() => {
      initSmoothScrolling()
    })

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    }

    // Add scroll to top button
    const addScrollToTop = () => {
      // Check if button already exists
      if (document.querySelector('.scroll-to-top-btn')) return

      const scrollToTopBtn = document.createElement('button')
      scrollToTopBtn.innerHTML = '↑'
      scrollToTopBtn.className = 'scroll-to-top-btn fixed bottom-5 right-5 w-12 h-12 rounded-full bg-white text-black border-none text-xl font-bold cursor-pointer z-50 opacity-0 transform translate-y-5 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110'
      
      scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      })

      if (document.body) {
        document.body.appendChild(scrollToTopBtn)
      }

      // Show/hide scroll to top button
      const toggleScrollToTop = () => {
        const scrollY = window.scrollY
        const isMobile = window.innerWidth <= 768
        const shouldShow = scrollY > 300 && !isMobile // Hide on mobile

        if (shouldShow) {
          scrollToTopBtn.style.opacity = '1'
          scrollToTopBtn.style.transform = 'translateY(0)'
        } else {
          scrollToTopBtn.style.opacity = '0'
          scrollToTopBtn.style.transform = 'translateY(20px)'
        }
      }

      window.addEventListener('scroll', toggleScrollToTop, { passive: true })
      toggleScrollToTop() // Initial check
    }

    // Add scroll to top button
    addScrollToTop()

    // Cleanup
    return () => {
      observer.disconnect()
      const scrollToTopBtn = document.querySelector('.scroll-to-top-btn')
      if (scrollToTopBtn) {
        scrollToTopBtn.remove()
      }
    }
  }, [])

  return null // This component doesn't render anything
}
