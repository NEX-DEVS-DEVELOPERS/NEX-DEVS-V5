'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useIsMobile } from '@/app/utils/deviceDetection'
import { PhoneIcon } from '@heroicons/react/24/solid'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const [navbarHeight, setNavbarHeight] = useState(75)

  // Get navbar height dynamically
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('[data-navbar="true"]')
      if (navbar) {
        const navbarRect = navbar.getBoundingClientRect()
        setNavbarHeight(navbarRect.height)
      }
    }

    // Initial update
    updateNavbarHeight()

    // Update on resize and scroll
    window.addEventListener('resize', updateNavbarHeight)
    window.addEventListener('scroll', updateNavbarHeight)

    return () => {
      window.removeEventListener('resize', updateNavbarHeight)
      window.removeEventListener('scroll', updateNavbarHeight)
    }
  }, [])

  // Add body class to prevent scrolling and apply blur when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open')
      document.documentElement.style.setProperty('--page-blur', '8px')
    } else {
      document.body.classList.remove('menu-open')
      document.documentElement.style.setProperty('--page-blur', '0px')
    }
    
    return () => {
      document.body.classList.remove('menu-open')
      document.documentElement.style.setProperty('--page-blur', '0px')
    }
  }, [isOpen])

  const menuVariants: Variants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 250,
        when: "afterChildren",
        duration: 0.3,
      }
    },
    open: {
      x: '0%',
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 180,
        mass: 0.8,
        staggerChildren: 0.04,
        delayChildren: 0.05,
        duration: 0.3,
      }
    }
  }

  const itemVariants: Variants = {
    closed: {
      y: 8,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 250,
        duration: 0.15
      }
    },
    open: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 180,
        mass: 0.8,
      }
    }
  }

  const menuItems = [
    ['Home', '/'],
    ['Services', '/services'],
    ['About', '/about'],
    ['Work', '/work'],
    ['Blog', '/blog'],
    ['FAQs', '/faqs'],
    ['Contact', '/contact'],
    ['Pricing', '/pricing']
  ]

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="relative z-50 p-2 group"
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
      >
        <div className="flex flex-col justify-between w-6 h-5">
          <motion.span
            animate={isOpen 
              ? { rotate: 45, y: 8, backgroundColor: "#8b5cf6" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-3/4"
          />
          <motion.span
            animate={isOpen 
              ? { opacity: 0, x: -10, backgroundColor: "#8b5cf6" } 
              : { opacity: 1, x: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-3/4 h-[2px] bg-current block transition-all duration-300 group-hover:w-full"
          />
          <motion.span
            animate={isOpen 
              ? { rotate: -45, y: -8, backgroundColor: "#8b5cf6" } 
              : { rotate: 0, y: 0, backgroundColor: "currentColor" }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-full h-[2px] bg-current block transition-all duration-300 group-hover:w-1/2"
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleMenu}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed right-4 h-auto max-h-[70vh] w-[220px] rounded-xl bg-black/90 z-40 origin-top-right overflow-hidden border border-purple-500"
            style={{
              top: `${navbarHeight + 5}px`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), 0 0 8px rgba(139, 92, 246, 0.4)'
            }}
          >
            {/* Animated corner accents */}
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 rounded-tr-xl" />
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500 rounded-tl-xl" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500 rounded-br-xl" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500 rounded-bl-xl" />
            
            {/* Content container */}
            <div className="relative flex flex-col justify-start h-full px-4 pt-6 pb-4">
              <div className="space-y-3 overflow-y-auto custom-scrollbar max-h-[60vh]">
                {menuItems.map(([text, href], index) => (
                  <motion.div
                    key={text}
                    custom={index}
                    variants={itemVariants}
                    className="overflow-hidden"
                  >
                    <Link
                      href={href}
                      className="group relative block text-sm font-medium text-white/95 transition-all duration-300 hover:text-white"
                      onClick={toggleMenu}
                    >
                      <span className="relative z-10 block transform transition-all duration-200 ease-out group-hover:translate-x-1">
                        {text}
                        <span className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-purple-500 to-transparent w-0 group-hover:w-full transition-all duration-200" />
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  variants={itemVariants}
                  className="pt-3"
                >
                  <Link 
                    href="/discovery-call"
                    className="discovery-call-button flex items-center gap-2 w-full justify-center py-2 text-sm relative overflow-hidden group bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-md border border-purple-500/30 hover:border-purple-500/60 transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    <PhoneIcon className="h-3 w-3 relative z-10" />
                    <span className="relative z-10">Discovery Call</span>
                  </Link>
                </motion.div>
              </div>
            </div>

            <style jsx global>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 2px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(139, 92, 246, 0.4);
                border-radius: 20px;
              }
              .menu-open {
                overflow: hidden;
              }
              .menu-open #__next > *:not(.md\\:hidden) {
                filter: blur(var(--page-blur));
                transition: filter 0.3s ease-in-out;
              }
              :root {
                --page-blur: 0px;
              }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}