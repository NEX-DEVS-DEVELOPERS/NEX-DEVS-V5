'use client'
import Hero from "@/components/sections/Hero"
import HomeProjectGallery from "@/components/HomeProjectGallery"
// import TrustedCompanies from "@/components/sections/TrustedCompanies"
// import TrustedSection from "@/components/sections/TrustedSection"
// import Details from "@/components/sections/Details"
// import Work from "@/components/sections/Work"
// import Footer from "@/components/sections/Footer"
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { useEasterEggs } from '@/context/EasterEggContext'
import WelcomeScreen from './components/WelcomeScreen'
import FloatingActionButton from './components/FloatingActionButton'

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
  const [showTerminal, setShowTerminal] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentJoke, setCurrentJoke] = useState(PROGRAMMING_JOKES[0])
  const [showJoke, setShowJoke] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [counterPosition, setCounterPosition] = useState({ x: 16, y: 16 }) // Start from top-left with padding
  const [isDragging, setIsDragging] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [mounted, setMounted] = useState(false)
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
  const addFoundEasterEgg = (eggName: "konami" | "terminal" | "tech-achievement" | "source-code" | "work-achievement" | "stats-master") => {
    addEasterEgg(eggName)
  }

  const technologies = [
    { 
      name: 'React', 
      icon: '/icons/react.svg',
      iconColor: '#61DAFB'
    },
    { 
      name: 'Next.js', 
      icon: '/icons/nextjs.svg',
      iconColor: '#ffffff'
    },
    { 
      name: 'TypeScript', 
      icon: '/icons/typescript.svg',
      iconColor: '#3178C6'
    },
    { 
      name: 'Node.js', 
      icon: '/icons/nodejs.svg',
      iconColor: '#339933'
    },
    { 
      name: 'Python', 
      icon: '/icons/python.svg',
      iconColor: '#3776AB'
    },
    { 
      name: 'AWS', 
      icon: '/icons/aws.svg',
      iconColor: '#FF9900'
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
    },
    {
      title: "Mobile App Development",
      description: "Cross-platform native app development for iOS and Android",
      icon: "📱"
    },
    {
      title: "AI Integrated Website",
      description: "Smart websites with integrated AI-powered features and chatbots",
      icon: "🧠"
    },
    {
      title: "3D Business Websites",
      description: "Immersive 3D experiences with Three.js and WebGL for modern brands",
      icon: "🌐"
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

  // Check if this is the first visit and handle mounting
  useEffect(() => {
    setMounted(true);
    
    // Always show welcome screen on refresh
    // Remove welcomeScreenShown from localStorage to ensure welcome screen shows on every reload
    localStorage.removeItem('welcomeScreenShown');
    setShowWelcome(true);

    // Add event listener for storage changes (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'welcomeScreenShown') {
        setShowWelcome(!e.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    setShowWelcome(false)
  }

  if (!mounted) return null;

  return (
    <main className="relative smooth-scroll transition-all will-change-transform"
          style={{
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            scrollBehavior: 'smooth'
          }}>
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
      <div className="smooth-scroll transition-all duration-300 ease-in-out will-change-transform"
           style={{
             transform: 'translate3d(0, 0, 0)',
             backfaceVisibility: 'hidden'
           }}>
        <Hero />
        
        {/* Project Gallery Section - Added below Hero */}
        <HomeProjectGallery />
        
        {/* Services Section */}
        <section className="py-12 sm:py-20 relative overflow-hidden transition-all duration-500 ease-in-out will-change-transform"
                 style={{
                   transform: 'translate3d(0, 0, 0)',
                   backfaceVisibility: 'hidden'
                 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
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
        <section className="py-12 sm:py-20 relative transition-all duration-500 ease-in-out will-change-transform"
                 style={{
                   transform: 'translate3d(0, 0, 0)',
                   backfaceVisibility: 'hidden'
                 }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3">
                <span className="text-white">Tech </span>
                <span className="bg-white text-black px-3 py-1 rounded-lg">Stack</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
                Modern technologies I work with to build powerful solutions
              </p>
            </div>
            
            {/* Tech Icons - Minimalist Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 mb-12 sm:mb-16">
              {technologies.map((tech) => (
                <div
                  key={tech.name}
                  className="flex flex-col items-center"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3 flex items-center justify-center 
                                bg-black p-2 sm:p-3 rounded-lg border border-white/5 
                                hover:border-purple-500/70 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] 
                                transition-all duration-300">
                    <Image 
                      src={tech.icon} 
                      alt={tech.name} 
                      width={40} 
                      height={40} 
                      className="object-contain w-8 h-8 sm:w-10 sm:h-10 brightness-125 
                               hover:brightness-150 transition-all duration-300"
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-400 group-hover:text-purple-300 transition-colors duration-300">{tech.name}</span>
                </div>
              ))}
            </div>

            {/* Tech Categories - Clean Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: "Frontend",
                  description: "Modern UI development",
                  tools: "React, Next.js, TypeScript",
                  icon: "💻"
                },
                {
                  title: "Backend",
                  description: "Scalable server solutions",
                  tools: "Node.js, Python, AWS",
                  icon: "⚙️"
                },
                {
                  title: "DevOps",
                  description: "Deployment & CI/CD",
                  tools: "Docker, GitHub Actions, Vercel",
                  icon: "🚀"
                }
              ].map((category) => (
                <div
                  key={category.title}
                  className="group p-5 sm:p-6 border border-white/10 rounded-lg bg-black 
                           hover:border-purple-500/50 hover:bg-black/80
                           transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <h3 className="text-lg sm:text-xl font-medium text-white group-hover:text-purple-200 transition-colors duration-300">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{category.description}</p>
                  <div className="pt-3 border-t border-white/10 group-hover:border-purple-500/20 transition-colors duration-300">
                    <p className="text-sm text-white/70 font-mono group-hover:text-purple-200/80 transition-colors duration-300">{category.tools}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Work Showcase Section */}
        <section className="py-12 sm:py-24 relative overflow-hidden transition-all duration-500 ease-in-out will-change-transform"
                 style={{
                   transform: 'translate3d(0, 0, 0)',
                   backfaceVisibility: 'hidden'
                 }}>
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
                <h2 className="text-2xl sm:text-4xl font-bold text-white">FEATURED PROJECT DETAILS</h2>
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
                  VIEW PROJECTS DETAILS →
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Work Process Sitemap */}
        <section className="py-20 relative overflow-hidden transition-all duration-500 ease-in-out will-change-transform"
                 style={{
                   transform: 'translate3d(0, 0, 0)',
                   backfaceVisibility: 'hidden'
                 }}>
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
      </div>
      <div className="fixed bottom-2 right-2 opacity-30 hover:opacity-100 transition-opacity">
        <Link href="/admin/login" className="text-xs text-gray-500 hover:text-gray-300">Admin</Link>
      </div>
    </main>
  )
}
