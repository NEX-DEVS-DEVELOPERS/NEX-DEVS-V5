'use client'
import Hero from "@/components/sections/Hero"
// import Details from "@/components/sections/Details"
// import Work from "@/components/sections/Work"
// import Footer from "@/components/sections/Footer"
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { useEasterEggs } from '@/context/EasterEggContext'

// Easter Egg: Hidden message in source code
/**
 * 🎉 You found the first easter egg! 
 * Here's a joke for you:
 * Why do programmers prefer dark mode?
 * Because light attracts bugs! 🐛
 */

// Konami code sequence
const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'ba']

// Programming jokes collection
const PROGRAMMING_JOKES = [
  {
    setup: "Why do programmers prefer dark mode?",
    punchline: "Because light attracts bugs! 🐛"
  },
  {
    setup: "Why do programmers always mix up Halloween and Christmas?",
    punchline: "Because Oct 31 === Dec 25! 🎃"
  },
  {
    setup: "Why was the JavaScript developer sad?",
    punchline: "Because they didn't Node how to Express their feelings! 😢"
  },
  {
    setup: "What's a programmer's favorite place in the house?",
    punchline: "The living ROM! 💾"
  },
  {
    setup: "Why did the developer go broke?",
    punchline: "Because they used up all their cache! 💸"
  },
  {
    setup: "What do you call a programmer from Finland?",
    punchline: "Nerdic! 🇫🇮"
  },
  {
    setup: "Why do programmers hate nature?",
    punchline: "It has too many bugs! 🪲"
  }
]

export default function Home() {
  const { addEasterEgg } = useEasterEggs()
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [techClickCounts, setTechClickCounts] = useState<{ [key: string]: number }>({})
  const [showTerminal, setShowTerminal] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentJoke, setCurrentJoke] = useState(PROGRAMMING_JOKES[0])
  const [showJoke, setShowJoke] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [counterPosition, setCounterPosition] = useState({ x: 16, y: 16 }) // Start from top-left with padding
  const [isDragging, setIsDragging] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to the secret terminal! Try these commands:",
    "$ help - Show available commands",
    "$ joke - Tell me a programming joke",
    "$ about - About the developer",
    "$ clear - Clear terminal",
    "$ exit - Close terminal"
  ])
  const [foundEasterEggs, setFoundEasterEggs] = useState<Set<string>>(new Set())
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })

  // Track total number of possible easter eggs
  const TOTAL_EASTER_EGGS = 4

  // Function to add found easter egg
  const addFoundEasterEgg = (eggName: string) => {
    addEasterEgg(eggName)
  }

  const technologies = [
    { 
      name: 'React', 
      icon: '/icons/react.svg',
      iconColor: '#61DAFB',  // React blue
      className: "text-[#61DAFB] hover:text-[#61DAFB]/80"
    },
    { 
      name: 'Next.js', 
      icon: '/icons/nextjs.svg',
      iconColor: '#ffffff',  // White
      className: "text-white hover:text-white/80"
    },
    { 
      name: 'TypeScript', 
      icon: '/icons/typescript.svg',
      iconColor: '#3178C6',  // TypeScript blue
      className: "text-[#3178C6] hover:text-[#3178C6]/80"
    },
    { 
      name: 'Node.js', 
      icon: '/icons/nodejs.svg',
      iconColor: '#339933',  // Node green
      className: "text-[#339933] hover:text-[#339933]/80"
    },
    { 
      name: 'Python', 
      icon: '/icons/python.svg',
      iconColor: '#3776AB',  // Python blue
      className: "text-[#3776AB] hover:text-[#3776AB]/80"
    },
    { 
      name: 'AWS', 
      icon: '/icons/aws.svg',
      iconColor: '#FF9900',  // AWS orange
      className: "text-[#FF9900] hover:text-[#FF9900]/80"
    }
  ]

  const services = [
    {
      title: "WordPress/Shopify",
      description: "Custom e-commerce solutions and CMS development",
      icon: "🛒"
    },
    {
      title: "Website Development",
      description: "Modern, responsive web development with Next.js & React",
      icon: "💻"
    },
    {
      title: "Figma/Framer",
      description: "UI/UX design and interactive prototypes",
      icon: "🎨"
    },
    {
      title: "SEO/Content Creation",
      description: "Search optimization and engaging content strategy",
      icon: "🔍"
    },
    {
      title: "Web Apps/AI Agents",
      description: "Custom web applications and AI integration",
      icon: "🤖"
    }
  ]

  const workProcess = [
    {
      step: "01",
      title: "Discovery",
      description: "Initial consultation and project scoping",
      details: [
        "Requirements gathering",
        "Technical assessment",
        "Project timeline planning",
        "Resource allocation"
      ],
      icon: "🎯"
    },
    {
      step: "02",
      title: "Design",
      description: "Creating the blueprint for success",
      details: [
        "UI/UX wireframing",
        "Architecture planning",
        "Tech stack selection",
        "Design system setup"
      ],
      icon: "✏️"
    },
    {
      step: "03",
      title: "Development",
      description: "Bringing ideas to life with code",
      details: [
        "Agile development",
        "Regular updates",
        "Code reviews",
        "Quality testing"
      ],
      icon: "💻"
    },
    {
      step: "04",
      title: "Deployment",
      description: "Launch and beyond",
      details: [
        "Performance optimization",
        "Security checks",
        "Server setup",
        "Monitoring setup"
      ],
      icon: "🚀"
    }
  ];

  // Add hints array
  const easterEggHints = [
    { title: "Konami Code", hint: "Try the classic gaming code: ↑↑↓↓←→←→BA" },
    { title: "Terminal", hint: "Press the ` key (backtick) to open a secret terminal" },
    { title: "Tech Icons", hint: "Click the tech stack icons multiple times for surprises" },
    { title: "Source Code", hint: "Check the source code for a hidden joke" }
  ]

  // Get random joke
  const getRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * PROGRAMMING_JOKES.length)
    return PROGRAMMING_JOKES[randomIndex]
  }

  // Handle terminal commands
  const handleTerminalCommand = (command: string) => {
    if (!foundEasterEggs.has('terminal')) {
      addFoundEasterEgg('terminal')
    }
    switch (command.toLowerCase()) {
      case 'joke':
        const joke = getRandomJoke()
        setTerminalOutput(prev => [...prev, `\n> ${joke.setup}`, `${joke.punchline}\n`])
        break
      case 'help':
        setTerminalOutput(prev => [...prev, 
          "\n> Available commands:",
          "joke  - Tell a programming joke",
          "about - About the developer",
          "clear - Clear terminal",
          "exit  - Close terminal\n"
        ])
        break
      case 'clear':
        setTerminalOutput([])
        break
      case 'about':
        setTerminalOutput(prev => [...prev, 
          "\n> About the Developer:",
          "A passionate developer who loves easter eggs,",
          "bad programming jokes, and clean code.",
          "Some say they dream in JavaScript...\n"
        ])
        break
      case 'exit':
        setShowTerminal(false)
        break
      default:
        setTerminalOutput(prev => [...prev, `\nCommand not found: ${command}\nType 'help' for available commands\n`])
    }
    setTerminalInput("")
  }

  // Modify Konami code handler to track easter egg
  const handleKonamiComplete = () => {
    setCurrentJoke(getRandomJoke())
    setShowEasterEgg(true)
    setKonamiIndex(0)
    addFoundEasterEgg('konami')
  }

  // Modify handleKeyDown
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (showTerminal && event.key === 'Enter') {
      handleTerminalCommand(terminalInput)
      return
    }

    if (konamiIndex < KONAMI_CODE.length - 1 && event.key === KONAMI_CODE[konamiIndex]) {
      setKonamiIndex(prev => prev + 1)
    } else if (konamiIndex === KONAMI_CODE.length - 1 && event.key === 'b') {
      // Start checking for 'ba' sequence
      const checkBa = (e: KeyboardEvent) => {
        if (e.key === 'a') {
          handleKonamiComplete()
          window.removeEventListener('keydown', checkBa)
        } else {
          setKonamiIndex(0)
          window.removeEventListener('keydown', checkBa)
        }
      }
      window.addEventListener('keydown', checkBa, { once: true })
    } else {
      setKonamiIndex(0)
    }

    if (event.key === '`') {
      setShowTerminal(prev => !prev)
    }
  }, [konamiIndex, terminalInput, showTerminal])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Handle tech stack icon clicks
  const handleTechClick = (techName: string) => {
    setTechClickCounts(prev => {
      const newCount = (prev[techName] || 0) + 1
      if (newCount === 10) {
        addFoundEasterEgg('tech-achievement')
        alert(`🎉 You've unlocked the ${techName} achievement! You must really love ${techName}!`)
      }
      return { ...prev, [techName]: newCount }
    })
  }

  // Add useEffect to check for source code easter egg
  useEffect(() => {
    const hasViewedSource = localStorage.getItem('viewed-source')
    if (hasViewedSource) {
      addFoundEasterEgg('source-code')
    }
  }, [])

  // Add keyboard shortcut listener for source code viewing
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check for Ctrl+U (view source) or Command+U on Mac
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        localStorage.setItem('viewed-source', 'true')
        addFoundEasterEgg('source-code')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Add right-click context menu handler
  useEffect(() => {
    const handleContextMenu = () => {
      localStorage.setItem('viewed-source', 'true')
      addFoundEasterEgg('source-code')
    }

    window.addEventListener('contextmenu', handleContextMenu)
    return () => window.removeEventListener('contextmenu', handleContextMenu)
  }, [])

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('easterEggCounterPosition')
    if (savedPosition) {
      setCounterPosition(JSON.parse(savedPosition))
    }
  }, [])

  // Add useEffect to calculate drag constraints based on window size
  useEffect(() => {
    const updateConstraints = () => {
      const padding = 20 // Padding from window edges
      setDragConstraints({
        left: padding - window.innerWidth / 2,
        right: window.innerWidth / 2 - padding,
        top: padding - window.innerHeight / 2,
        bottom: window.innerHeight / 2 - padding,
      })
    }

    updateConstraints()
    window.addEventListener('resize', updateConstraints)
    return () => window.removeEventListener('resize', updateConstraints)
  }, [])

  // Simplified drag end handler
  const handleDragEnd = (event: any, info: any) => {
    setCounterPosition({ x: info.offset.x, y: info.offset.y })
    setIsDragging(false)
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black"
    >
      {/* Floating Hint Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowHints(prev => !prev)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-purple-500/20 
                   rounded-full border border-purple-500/30 backdrop-blur-sm
                   hover:bg-purple-500/30 transition-all duration-300
                   text-white/80 hover:text-white flex items-center gap-2"
      >
        <span className="text-lg">🎲</span>
        <span className="text-sm">Find Easter Eggs</span>
      </motion.button>

      {/* Hints Panel */}
      {showHints && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-4 bottom-16 z-50 w-80 bg-black/90 
                     rounded-xl border border-purple-500/30 backdrop-blur-lg
                     p-4 text-white/80"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-purple-400">Easter Egg Hints</h3>
            <button 
              onClick={() => setShowHints(false)}
              className="text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="space-y-3">
            {easterEggHints.map((hint, index) => (
              <motion.div
                key={hint.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 
                          transition-colors duration-300"
              >
                <h4 className="text-sm font-medium text-purple-300">{hint.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{hint.hint}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Small indicator for Konami progress */}
      {konamiIndex > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 right-4 z-50 px-3 py-1 bg-purple-500/20 
                     rounded-full border border-purple-500/30 backdrop-blur-sm"
        >
          <span className="text-xs text-purple-300">
            {`${konamiIndex}/${KONAMI_CODE.length}`}
          </span>
        </motion.div>
      )}

      <Hero />

      {/* Services Section */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-4"
          >
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              Our{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-white text-black px-3 sm:px-4 py-1 rounded-lg">
                  Services
                </span>
              </span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-4 sm:p-6 w-[calc(50%-8px)] sm:w-64 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                           hover:border-purple-500/50 transition-all duration-300 shadow-lg"
              >
                <div className="mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-4xl">{service.icon}</span>
                </div>
                <h3 className="text-base sm:text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-base text-gray-400">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-4"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-4xl font-bold inline-block"
            >
              <span className="text-white">
                Tech{" "}
                <span className="bg-white text-black px-3 py-1 rounded-lg">
                  Stack
                </span>
              </span>
            </motion.h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Modern technologies I work with to build powerful solutions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => handleTechClick(tech.name)}
                className="group relative flex flex-col items-center p-3 sm:p-6 rounded-xl 
                          bg-black/40 border border-white/10 backdrop-blur-sm
                          hover:border-purple-500/50 hover:bg-black/60
                          transition-all duration-300 ease-out cursor-pointer"
              >
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center mb-2 sm:mb-3 
                                group-hover:scale-110 transition-transform duration-300
                                ${techClickCounts[tech.name] >= 5 ? 'animate-bounce' : ''}`}>
                    <Image 
                      src={tech.icon} 
                      alt={tech.name} 
                      width={40} 
                      height={40} 
                      className={`object-contain brightness-200 
                                 ${techClickCounts[tech.name] >= 10 ? 'animate-spin' : ''}`}
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-400 
                                group-hover:text-white transition-colors duration-300">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech Categories */}
          <div className="mt-8 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                title: "Frontend",
                description: "Modern UI development",
                tools: "React, Next.js, TypeScript",
                gradient: "from-purple-500/20 to-indigo-500/20"
              },
              {
                title: "Backend",
                description: "Scalable server solutions",
                tools: "Node.js, Python, AWS",
                gradient: "from-indigo-500/20 to-violet-500/20"
              },
              {
                title: "DevOps",
                description: "Deployment & CI/CD",
                tools: "Docker, GitHub Actions, Vercel",
                gradient: "from-violet-500/20 to-purple-500/20"
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group p-4 sm:p-6 rounded-xl border border-white/10 
                         hover:border-purple-500/50
                         relative overflow-hidden backdrop-blur-sm"
              >
                <div className="relative z-10">
                  <h3 className="text-base sm:text-xl font-semibold text-white mb-1 sm:mb-2 
                              group-hover:text-purple-200 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">{category.description}</p>
                  <p className="text-xs sm:text-sm text-white/80 font-mono">{category.tools}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Showcase Section */}
      <section className="py-12 sm:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-20">
            {[
              { number: "250+", label: "Projects Completed", icon: "🚀" },
              { number: "95%", label: "Client Satisfaction", icon: "⭐" },
              { number: "10+", label: "Years Experience", icon: "⏳" },
              { number: "50+", label: "Team Members", icon: "👥" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <div className="relative p-3 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <span className="text-xl sm:text-2xl mb-2 sm:mb-4 block group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </span>
                  <h4 className="text-xl sm:text-3xl font-bold text-white mb-1">{stat.number}</h4>
                  <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Work */}
          <div className="space-y-8 sm:space-y-16">
            <div className="text-center space-y-2 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl font-bold text-white">Featured Projects</h2>
              <p className="text-xs sm:text-base text-gray-400 max-w-2xl mx-auto">
                Delivering exceptional digital experiences through innovative solutions and cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {[
                {
                  title: "E-commerce Platform",
                  description: "Built a scalable e-commerce solution handling 100k+ monthly users",
                  tech: ["Next.js", "Node.js", "MongoDB", "AWS"],
                  metrics: ["45% faster loading", "2x conversion rate", "99.9% uptime"],
                  color: "from-blue-500/20 to-purple-500/20"
                },
                {
                  title: "AI-Powered Analytics",
                  description: "Developed custom AI solutions for enterprise data analysis",
                  tech: ["Python", "TensorFlow", "React", "GraphQL"],
                  metrics: ["85% accuracy", "3x faster insights", "50% cost reduction"],
                  color: "from-purple-500/20 to-pink-500/20"
                }
              ].map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="relative p-4 sm:p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                                hover:border-purple-500/50 transition-all duration-300">
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4 group-hover:text-purple-200 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6">{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full bg-white/5 border border-white/10 text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="space-y-1 sm:space-y-2">
                      {project.metrics.map((metric) => (
                        <div key={metric} className="flex items-center gap-2 text-xs sm:text-sm text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View All Projects button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-8 sm:mt-12"
            >
              <Link 
                href="/featured-projects" 
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium text-white bg-[#1A1A1A] rounded-lg hover:bg-[#2A2A2A] transition-colors"
              >
                View All Projects →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work Process Sitemap */}
      <section className="py-20 relative overflow-hidden">
        {/* Purple Gradient Background Effects */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">How I Work</h2>
            <p className="text-gray-400">A systematic approach to delivering exceptional results</p>
          </motion.div>

          {/* Timeline Connection Line with Glow */}
          <div className="absolute left-1/2 top-[30%] bottom-[20%] w-0.5 hidden lg:block">
            <div className="h-full bg-gradient-to-b from-purple-500/50 via-indigo-500/30 to-transparent" />
            <div className="h-full w-full absolute top-0 left-0 bg-gradient-to-b from-purple-500/50 via-indigo-500/30 to-transparent blur-sm" />
          </div>

          <div className="space-y-12 relative">
            {workProcess.map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Process Card with Enhanced Hover Effect */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="w-full lg:w-[45%] p-6 rounded-xl border border-white/10 
                           hover:border-purple-500/50 transition-all 
                           bg-black/40 backdrop-blur-xl group relative overflow-hidden"
                >
                  {/* Enhanced Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-indigo-500/0 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                        {process.icon}
                      </span>
                      <div>
                        <span className="text-sm text-purple-200/60">{process.step}</span>
                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors">
                          {process.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4 group-hover:text-purple-200/80 transition-colors">
                      {process.description}
                    </p>
                    <ul className="space-y-2">
                      {process.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-gray-400 text-sm flex items-center gap-2 group/item"
                        >
                          <span className="w-1.5 h-1.5 bg-purple-400/50 rounded-full 
                                       group-hover/item:bg-purple-400 group-hover/item:scale-110 
                                       transition-all" />
                          <span className="group-hover:text-purple-200/90 transition-colors">
                            {detail}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Enhanced Connection Point */}
                <div className="hidden lg:flex w-[10%] justify-center items-center">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/50
                             hover:border-purple-400 hover:bg-purple-500/30 transition-all duration-300
                             shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* <Details />
      <Work /> */}
    </motion.main>
  )
}
