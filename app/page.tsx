'use client'
import Hero from "@/components/sections/Hero"
// import Details from "@/components/sections/Details"
// import Work from "@/components/sections/Work"
// import Footer from "@/components/sections/Footer"
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'

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
  const [konamiIndex, setKonamiIndex] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [techClickCounts, setTechClickCounts] = useState<{ [key: string]: number }>({})
  const [showTerminal, setShowTerminal] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentJoke, setCurrentJoke] = useState(PROGRAMMING_JOKES[0])
  const [showJoke, setShowJoke] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to the secret terminal! Try these commands:",
    "$ help - Show available commands",
    "$ joke - Tell me a programming joke",
    "$ about - About the developer",
    "$ clear - Clear terminal",
    "$ exit - Close terminal"
  ])

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

  // Modify Konami code handler to show random joke
  const handleKonamiComplete = () => {
    setCurrentJoke(getRandomJoke())
    setShowEasterEgg(true)
    setKonamiIndex(0)
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
        alert(`🎉 You've unlocked the ${techName} achievement! You must really love ${techName}!`)
      }
      return { ...prev, [techName]: newCount }
    })
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
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16 space-y-4"
          >
            <h2 className="text-4xl font-bold text-white">
              Our{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-white text-black px-4 py-1 rounded-lg">
                  Services
                </span>
              </span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-6 w-64 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                           hover:border-purple-500/50 transition-all duration-300 shadow-lg"
              >
                <div className="mb-4">
                  <span className="text-4xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-400">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Gradient Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        </div>

        {/* Modified Konami Code Easter Egg */}
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       z-50 bg-black/90 p-8 rounded-xl border border-purple-500 backdrop-blur-lg
                       max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-purple-400 mb-4">🎮 Konami Code Master!</h3>
            <div className="space-y-4">
              <p className="text-gray-300">You've discovered the secret! Here's a virtual cookie: 🍪</p>
              <div className="bg-purple-500/10 p-4 rounded-lg">
                <p className="text-purple-200 mb-2">{currentJoke.setup}</p>
                <p className="text-purple-300 font-medium">{currentJoke.punchline}</p>
              </div>
              <button 
                onClick={() => setShowEasterEgg(false)}
                className="mt-4 px-4 py-2 bg-purple-500/20 rounded-lg hover:bg-purple-500/30 transition-colors w-full"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}

        {/* Enhanced Terminal with Joke Support */}
        {showTerminal && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 h-96 bg-black/95 border-t border-purple-500/30
                       backdrop-blur-lg p-4 font-mono text-green-400 z-50"
          >
            <div className="flex justify-between items-center mb-2">
              <span>~/secret-terminal</span>
              <button 
                onClick={() => setShowTerminal(false)}
                className="text-gray-400 hover:text-white"
              >
                × Close
              </button>
            </div>
            <div className="overflow-auto h-[calc(100%-4rem)] mb-2">
              {terminalOutput.map((line, i) => (
                <p key={i} className="whitespace-pre-wrap">{line}</p>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">$</span>
              <input
                type="text"
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand(terminalInput)}
                className="bg-transparent border-none outline-none flex-1 text-green-400 font-mono"
                placeholder="Type 'help' for commands..."
                autoFocus
              />
            </div>
          </motion.div>
        )}

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-16 space-y-4"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold inline-block"
            >
              <span className="text-white">
                Tech{" "}
                <span className="bg-white text-black px-3 py-1 rounded-lg">
                  Stack
                </span>
              </span>
            </motion.h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Modern technologies I work with to build powerful solutions
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => handleTechClick(tech.name)}
                className="group relative flex flex-col items-center p-6 rounded-xl 
                          bg-black/40 border border-white/10 backdrop-blur-sm
                          hover:border-purple-500/50 hover:bg-black/60
                          transition-all duration-300 ease-out cursor-pointer"
              >
                {/* Easter Egg: Show click count animation */}
                {techClickCounts[tech.name] && techClickCounts[tech.name] > 1 && (
                  <motion.div
                    initial={{ opacity: 1, y: -20 }}
                    animate={{ opacity: 0, y: -40 }}
                    className="absolute -top-2 text-purple-400 font-mono"
                  >
                    +{techClickCounts[tech.name]}
                  </motion.div>
                )}
                
                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                             bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className={`w-12 h-12 flex items-center justify-center mb-3 
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
                  <span className="text-sm font-medium text-gray-400 
                                group-hover:text-white transition-colors duration-300">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tech Categories */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="group p-6 rounded-xl border border-white/10 
                         hover:border-purple-500/50
                         relative overflow-hidden backdrop-blur-sm"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 
                              group-hover:opacity-30 transition-opacity duration-300`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-2 
                              group-hover:text-purple-200 transition-colors duration-300">
                    {category.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">{category.description}</p>
                  <p className="text-sm text-white/80 font-mono">{category.tools}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Showcase Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <span className="text-2xl mb-4 block group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </span>
                  <h4 className="text-3xl font-bold text-white mb-1">{stat.number}</h4>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Featured Work */}
          <div className="space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">Featured Projects</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Delivering exceptional digital experiences through innovative solutions and cutting-edge technology
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} 
                                opacity-20 rounded-xl blur-xl group-hover:opacity-30 transition-opacity duration-500`} />
                  <div className="relative p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                                hover:border-purple-500/50 transition-all duration-300">
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-6">{project.description}</p>
                    
                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2">
                      {project.metrics.map((metric) => (
                        <div key={metric} className="flex items-center gap-2 text-sm text-gray-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50"></span>
                          {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add this View All Projects button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-12"
            >
              <Link
                href="/projects"
                className="group relative inline-flex items-center gap-2 px-8 py-4 
                         rounded-xl overflow-hidden transition-all duration-300"
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 
                             transition-all duration-300 group-hover:bg-white" />
                <span className="relative z-10 text-white group-hover:text-black font-medium transition-colors duration-300">
                  View All Projects
                </span>
                <motion.span
                  className="relative z-10 text-white group-hover:text-black transition-colors duration-300"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            {/* Client Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative max-w-4xl mx-auto text-center mt-24"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-6xl text-white/20">
                "
              </div>
              <blockquote className="text-2xl text-gray-300 font-light italic leading-relaxed px-8">
                Working with NEX-WEBS has been transformative for our business. Their technical expertise 
                and innovative solutions helped us achieve our digital goals beyond expectations.
              </blockquote>
              <div className="mt-8 text-gray-400">
                <p className="font-medium text-lg text-white/80">John Smith</p>
                <p className="text-sm text-gray-500">CEO, Tech Innovations Inc</p>
              </div>
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
