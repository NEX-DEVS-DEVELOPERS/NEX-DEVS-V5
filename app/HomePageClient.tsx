'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { audiowide, vt323 } from '@/frontend/utils/fonts'
import { ClientComponentErrorBoundary } from '@/frontend/components/ErrorBoundary'

// Dynamic imports for client-side components
const Hero = dynamic(() => import('@/frontend/components/sections/Hero'), {
  loading: () => <div className="h-screen bg-black animate-pulse" />,
  ssr: false
})
const HeroToggle = dynamic(() => import('@/frontend/components/sections/HeroToggle'), {
  ssr: false
})

// Programming jokes for easter egg
const PROGRAMMING_JOKES = [
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs! 🐛"
  },
  {
    setup: "How many programmers does it take to change a light bulb?",
    punchline: "None. That's a hardware problem! 💡"
  },
  {
    setup: "Why do Java developers wear glasses?",
    punchline: "Because they can't C# 👓"
  },
  {
    setup: "What's a programmer's favorite hangout place?",
    punchline: "Foo Bar! 🍺"
  },
  {
    setup: "Why do programmers hate nature?",
    punchline: "It has too many bugs! 🪲"
  }
]

export default function HomePageClient() {
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentJoke, setCurrentJoke] = useState(PROGRAMMING_JOKES[0])
  const [showJoke, setShowJoke] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [counterPosition, setCounterPosition] = useState({ x: 16, y: 16 })
  const [isDragging, setIsDragging] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to the secret terminal! Try these commands:",
    "$ help - Show available commands",
    "$ joke - Tell me a programming joke",
    "$ about - About the developer",
    "$ clear - Clear terminal",
    "$ exit - Close terminal"
  ])
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  const [currentHero, setCurrentHero] = useState<'original' | 'business'>('original')
  const [showMobilePopup, setShowMobilePopup] = useState(false)
  
  const pageRef = useRef<HTMLDivElement>(null)

  // Konami code sequence
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ]

  // Enhanced mobile detection that works in browser dev tools
  useEffect(() => {
    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 768;
      const mediaQueryMobile = window.matchMedia('(max-width: 768px)').matches;
      const isDevToolsMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      // Enhanced detection for browser dev tools mobile preview
      const actuallyMobile = isSmallScreen || mediaQueryMobile || isDevToolsMobile ||
                            (isSmallScreen && isTouchDevice);
      setIsMobile(actuallyMobile);
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    setMounted(true)

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // Konami code detection
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === konamiCode[konamiIndex]) {
        setKonamiIndex(prev => prev + 1)
        if (konamiIndex === konamiCode.length - 1) {
          setShowEasterEgg(true)
          setKonamiIndex(0)
          setTimeout(() => setShowEasterEgg(false), 5000)
        }
      } else {
        setKonamiIndex(0)
      }

      // Terminal toggle
      if (event.ctrlKey && event.key === '`') {
        event.preventDefault()
        setShowTerminal(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [konamiIndex])

  // Terminal command handler
  const handleTerminalCommand = useCallback((command: string) => {
    const cmd = command.toLowerCase().trim()
    let response: string[] = []

    switch (cmd) {
      case 'help':
        response = [
          "Available commands:",
          "$ help - Show this help",
          "$ joke - Random programming joke",
          "$ about - About the developer",
          "$ clear - Clear terminal",
          "$ exit - Close terminal",
          "$ konami - Activate easter egg",
          "$ hint - Show hidden features"
        ]
        break
      case 'joke':
        const randomJoke = PROGRAMMING_JOKES[Math.floor(Math.random() * PROGRAMMING_JOKES.length)]
        setCurrentJoke(randomJoke)
        response = [randomJoke.setup, randomJoke.punchline]
        break
      case 'about':
        response = [
          "Ali Hasnaat - Full Stack Developer",
          "Specializing in AI-powered web applications",
          "Technologies: React, Next.js, TypeScript, Python",
          "Contact: ali@nexdevs.com"
        ]
        break
      case 'clear':
        setTerminalOutput([])
        return
      case 'exit':
        setShowTerminal(false)
        return
      case 'konami':
        setShowEasterEgg(true)
        setTimeout(() => setShowEasterEgg(false), 5000)
        response = ["Easter egg activated! 🎉"]
        break
      case 'hint':
        setShowHints(true)
        response = [
          "Hidden features unlocked!",
          "• Try the Konami code: ↑↑↓↓←→←→BA",
          "• Ctrl + ` opens this terminal",
          "• Look for hidden interactive elements"
        ]
        break
      default:
        response = [`Command not found: ${command}`, "Type 'help' for available commands"]
    }

    setTerminalOutput(prev => [...prev, `$ ${command}`, ...response, ""])
  }, [])

  // Handle terminal input
  const handleTerminalKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTerminalCommand(terminalInput)
      setTerminalInput('')
    }
  }

  // Drag constraints calculation
  useEffect(() => {
    const updateConstraints = () => {
      if (typeof window !== 'undefined') {
        setDragConstraints({
          left: 0,
          right: window.innerWidth - 400,
          top: 0,
          bottom: window.innerHeight - 300
        })
      }
    }

    updateConstraints()
    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [])

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    setCounterPosition({
      x: Math.max(0, Math.min(info.point.x, window.innerWidth - 200)),
      y: Math.max(0, Math.min(info.point.y, window.innerHeight - 100))
    })
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <ClientComponentErrorBoundary>
      <div ref={pageRef} className="relative">
        {/* Hero Toggle */}
        <div className="fixed top-20 right-4 z-50">
          <HeroToggle 
            currentHero={currentHero}
            onToggle={setCurrentHero}
          />
        </div>

        {/* Conditional Hero Rendering */}
        <AnimatePresence mode="wait">
          {currentHero === 'original' && (
            <motion.div
              key="original-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Easter Egg Modal */}
        <AnimatePresence>
          {showEasterEgg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-8 rounded-xl border border-purple-500/50 text-center max-w-md">
                <h3 className={`text-2xl font-bold text-white mb-4 ${audiowide.className}`}>
                  🎉 Konami Code Activated!
                </h3>
                <p className={`text-green-400 mb-4 ${vt323.className}`}>
                  You found the secret! Welcome to the matrix, fellow developer.
                </p>
                <div className="text-green-300 font-mono text-sm">
                  <div>01001000 01100101 01101100 01101100 01101111</div>
                  <div>01010111 01101111 01110010 01101100 01100100</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terminal */}
        <AnimatePresence>
          {showTerminal && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-96 h-64 bg-black/90 border border-gray-700 rounded-lg p-4 text-green-400 text-xs font-mono overflow-hidden z-50"
              drag
              dragConstraints={dragConstraints}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-xs">~/terminal</div>
                <button 
                  className="text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => setShowTerminal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="h-44 overflow-y-auto mb-2">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))}
              </div>
              <div className="flex items-center">
                <span className="text-purple-400 mr-2">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyPress={handleTerminalKeyPress}
                  className="flex-1 bg-transparent outline-none text-green-400"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hints Display */}
        <AnimatePresence>
          {showHints && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed top-1/2 right-4 transform -translate-y-1/2 bg-black/90 border border-purple-500/50 rounded-lg p-4 text-sm max-w-xs z-40"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className={`text-purple-300 font-semibold ${audiowide.className}`}>Hidden Features</h4>
                <button 
                  onClick={() => setShowHints(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <ul className={`text-gray-300 space-y-1 ${vt323.className}`}>
                <li>• Konami Code: ↑↑↓↓←→←→BA</li>
                <li>• Terminal: Ctrl + `</li>
                <li>• Drag terminal around</li>
                <li>• Try terminal commands</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Link */}
        <div className="fixed bottom-2 right-2 opacity-30 hover:opacity-100 transition-opacity z-30">
          <Link href="/hasnaat/login" className="text-xs text-gray-500 hover:text-gray-300">
            Admin
          </Link>
        </div>
      </div>
    </ClientComponentErrorBoundary>
  )
}

