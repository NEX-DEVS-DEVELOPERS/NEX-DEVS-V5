'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

// Dynamic imports for better code splitting and performance
const Hero = dynamic(() => import("@/components/sections/Hero"), {
  loading: () => <div className="h-screen bg-black animate-pulse" />,
  ssr: true
})
const BusinessHero = dynamic(() => import("@/components/sections/BusinessHero"), {
  loading: () => <div className="h-screen bg-black animate-pulse" />,
  ssr: true
})
const HeroToggle = dynamic(() => import("@/components/sections/HeroToggle"), {
  ssr: true
})
const HomeProjectGallery = dynamic(() => import("@/components/HomeProjectGallery"), {
  loading: () => <div className="h-96 bg-black/50 animate-pulse rounded-lg" />
})
const TeamSection = dynamic(() => import("@/components/sections/TeamSection"), {
  loading: () => <div className="h-96 bg-black/50 animate-pulse rounded-lg" />
})
const GraphsSection = dynamic(() => import("@/components/sections/GraphsSection"), {
  loading: () => <div className="h-96 bg-black/50 animate-pulse rounded-lg" />
})
const WelcomeScreen = dynamic(() => import('@/app/components/WelcomeScreen'), {
  ssr: false
})
const FloatingActionButton = dynamic(() => import('@/app/components/FloatingActionButton'), {
  ssr: false
})
const ClientTestimonials = dynamic(() => import('@/components/TestimonialsSection'), {
  loading: () => <div className="h-96 bg-black/50 animate-pulse rounded-lg" />
})
const AIFeatures = dynamic(() => import('@/components/sections/AIFeatures'), {
  loading: () => <div className="h-96 bg-black/50 animate-pulse rounded-lg" />
})

/**
 * Home Page Component
 * 
 * This is the main landing page of the portfolio website.
 * It showcases key information about the developer and their skills.
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
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0, top: 0, bottom: 0 })
  // New state for hero section toggle
  const [currentHero, setCurrentHero] = useState<'original' | 'business'>('original')
  
  // Refs for scroll animations
  const pageRef = useRef<HTMLDivElement>(null);

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
      title: "MODERN AI BASED SAAS PRODUCT",
      description: "Enterprise-grade SaaS solutions with advanced AI integration",
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
          "A full-stack developer with expertise in React, Next.js, and TypeScript.",
          "Passionate about creating beautiful, functional, and performant web applications.",
          "Experienced in building responsive websites and web applications.",
          "A passionate developer who loves creating innovative solutions,",
          "Always learning and exploring new technologies.\n"
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

  // Update Konami code handler to not use Easter Egg functionality
  const handleKonamiComplete = () => {
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

  // Update handleDragEnd to not use Easter Egg functionality
  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false)
    // Remove Easter Egg related localStorage
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
      <main className="relative" ref={pageRef}>
        <Suspense fallback={<div className="h-screen bg-black" />}>
          {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
        </Suspense>
        
        {/* Hero Section Toggle */}
        <AnimatePresence mode="wait" initial={false}>
          {currentHero === 'original' ? (
            <motion.div
              key="original-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="hero-section-container"
            >
              <HeroToggle
                currentHero={currentHero}
                onToggle={(hero) => setCurrentHero(hero)}
                isHeroPage={true}
              />
              <Hero />
            </motion.div>
          ) : (
            <motion.div
              key="business-hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="hero-section-container"
            >
              <HeroToggle
                currentHero={currentHero}
                onToggle={(hero) => setCurrentHero(hero)}
                isHeroPage={false}
              />
              <BusinessHero />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* AI Integration Section - Modern Professional AI Section */}
        <section className="py-16 sm:py-24 relative overflow-hidden">
          {/* Pure Black Background */}
          <div className="absolute inset-0 pointer-events-none bg-black">
            {/* AI Matrix Code Animation */}
            <div className="absolute inset-0 opacity-[0.15] matrix-animation"></div>
          </div>
          
          {/* Advanced Neural Network Visualization */}
          <div className="absolute inset-0 pointer-events-none neural-network-visualization">
            <div className="neural-connection absolute top-1/4 left-1/3 w-[300px] h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-blue-500/0 neural-pulse"></div>
            <div className="neural-connection absolute top-1/3 right-1/4 w-[200px] h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-purple-500/0 neural-pulse-alt"></div>
            <div className="neural-connection absolute bottom-1/3 left-1/4 w-[250px] h-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-purple-500/0 neural-pulse"></div>
          </div>
          
          {/* Leaky Code Animation Containers - Enhanced */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none leaky-code-container">
            <div className="leaky-code-left absolute left-0 top-0 bottom-0 w-32 sm:w-52 opacity-20"></div>
            <div className="leaky-code-right absolute right-0 top-0 bottom-0 w-32 sm:w-52 opacity-20"></div>
            
            {/* Code Snippets - AI Chatbot Related */}
            <div className="code-snippet absolute left-[5%] top-[15%] p-2 rounded bg-black/80 border border-purple-500/20 font-mono text-[8px] sm:text-xs text-purple-400/70 opacity-70 transform rotate-2 shadow-lg backdrop-blur-sm">
              <div className="text-blue-400/80">// AI Model Configuration</div>
              <div>const proModeSettings = {'{'}</div>
              <div>&nbsp;&nbsp;model: <span className="text-green-400/80">'deepseek/deepseek-r1-0528:free'</span>,</div>
              <div>&nbsp;&nbsp;temperature: 0.6,</div>
              <div>&nbsp;&nbsp;maxTokens: 6000,</div>
              <div>&nbsp;&nbsp;topP: 0.8,</div>
              <div>&nbsp;&nbsp;timeout: 15000,</div>
              <div>&nbsp;&nbsp;thinkingTime: 800</div>
              <div>{'}'}</div>
            </div>
            
            <div className="code-snippet absolute right-[8%] top-[25%] p-2 rounded bg-black/80 border border-blue-500/20 font-mono text-[8px] sm:text-xs text-blue-400/70 opacity-70 transform -rotate-1 shadow-lg backdrop-blur-sm">
              <div className="text-amber-400/80">// Advanced Fallback System</div>
              <div>const FALLBACK_CONFIG = {'{'}</div>
              <div>&nbsp;&nbsp;enabled: true,</div>
              <div>&nbsp;&nbsp;primaryTimeout: 6500,</div>
              <div>&nbsp;&nbsp;fallbackModels: [</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;{'{'} model: <span className="text-green-400/80">'qwen/qwen3-235b-a22b:free'</span> {'}'},</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;{'{'} model: <span className="text-green-400/80">'meta-llama/llama-3.1-8b'</span> {'}'}</div>
              <div>&nbsp;&nbsp;]</div>
              <div>{'}'}</div>
            </div>
            
            <div className="code-snippet absolute left-[12%] bottom-[30%] p-2 rounded bg-black/80 border border-amber-500/20 font-mono text-[8px] sm:text-xs text-amber-400/70 opacity-70 transform rotate-1 shadow-lg backdrop-blur-sm">
              <div className="text-purple-400/80">// AI Request Preparation</div>
              <div>export const prepareAPIRequest = async (</div>
              <div>&nbsp;&nbsp;mode: <span className="text-green-400/80">'standard'</span> | <span className="text-green-400/80">'pro'</span>,</div>
              <div>&nbsp;&nbsp;messages: any[],</div>
              <div>&nbsp;&nbsp;systemPrompt: string</div>
              <div>) {`=>`} {`{`}</div>
              <div>&nbsp;&nbsp;const settings = mode === <span className="text-green-400/80">'standard'</span> </div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;? standardSettings : proSettings;</div>
              <div>{'}'}</div>
            </div>
            
            <div className="code-snippet absolute right-[15%] bottom-[20%] p-2 rounded bg-black/80 border border-indigo-500/20 font-mono text-[8px] sm:text-xs text-indigo-400/70 opacity-70 transform -rotate-2 shadow-lg backdrop-blur-sm">
              <div className="text-blue-400/80">// OpenAI Function Calling</div>
              <div>const functions = [</div>
              <div>&nbsp;&nbsp;{`{`}</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;name: <span className="text-green-400/80">"search_knowledge_base"</span>,</div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;description: <span className="text-green-400/80">"Search for information"</span></div>
              <div>&nbsp;&nbsp;{`}`}</div>
              <div>];</div>
              <div>const response = await openai.chat.completions.create({`{`}</div>
              <div>&nbsp;&nbsp;functions</div>
              <div>{`}`});</div>
            </div>
            
            <div className="code-snippet absolute left-[25%] top-[65%] p-2 rounded bg-black/80 border border-green-500/20 font-mono text-[8px] sm:text-xs text-green-400/70 opacity-70 transform rotate-1 shadow-lg backdrop-blur-sm">
              <div className="text-amber-400/80">// LangChain RAG Implementation</div>
              <div>import RetrievalQAChain from <span className="text-purple-400/80">"langchain/chains"</span>;</div>
              <div>import ChatOpenAI from <span className="text-purple-400/80">"langchain/chat_models"</span>;</div>
              <div>const model = new ChatOpenAI({'{'}</div>
              <div>&nbsp;&nbsp;modelName: <span className="text-green-400/80">"gpt-4"</span>,</div>
              <div>&nbsp;&nbsp;temperature: 0.7</div>
              <div>{'}'});</div>
              <div>const chain = RetrievalQAChain.fromLLM(model, retriever);</div>
            </div>
          </div>

          {/* Enhanced Neural Network Nodes */}
          <div className="absolute inset-0 pointer-events-none neural-network-overlay">
            <div className="neural-node absolute top-[20%] left-[10%] w-3 h-3 bg-purple-500/40 rounded-full glow-effect"></div>
            <div className="neural-node absolute top-[30%] left-[25%] w-2 h-2 bg-blue-500/40 rounded-full glow-effect"></div>
            <div className="neural-node absolute top-[60%] left-[15%] w-3 h-3 bg-indigo-500/40 rounded-full glow-effect"></div>
            <div className="neural-node absolute top-[70%] left-[35%] w-2 h-2 bg-purple-500/40 rounded-full glow-effect"></div>
            <div className="neural-node absolute top-[40%] right-[20%] w-3 h-3 bg-blue-500/40 rounded-full glow-effect"></div>
            <div className="neural-node absolute top-[25%] right-[30%] w-2 h-2 bg-indigo-500/40 rounded-full glow-effect"></div>
            <div className="neural-node absolute top-[75%] right-[15%] w-3 h-3 bg-purple-500/40 rounded-full glow-effect"></div>
            <div className="neural-node absolute top-[55%] right-[25%] w-2 h-2 bg-blue-500/40 rounded-full glow-effect"></div>
            
            {/* Binary Data Particles */}
            <div className="binary-particles absolute inset-0 opacity-30"></div>
          </div>
          
          {/* AI Processor Animation */}
          <div className="absolute bottom-10 left-10 w-24 h-24 opacity-20 pointer-events-none processor-animation">
            <div className="absolute inset-2 border-2 border-purple-500/30 rounded"></div>
            <div className="absolute inset-5 border border-blue-500/30 rounded-sm"></div>
            <div className="absolute inset-8 border border-indigo-500/30 rounded-sm"></div>
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 gap-1">
              {Array.from({length: 16}).map((_, i) => (
                <div key={i} className="processor-cell"></div>
              ))}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="text-center mb-16 sm:mb-20 space-y-6 sm:space-y-8"
            >
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full text-purple-400 text-sm sm:text-base font-medium backdrop-blur-sm border border-purple-500/30">
                Advanced AI Solutions
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white leading-tight relative">
                AI INTEGRATION & AI <span className="bg-white text-black px-4 py-2 rounded-lg relative">CONTROLLED</span> WEBSITES
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Transform your business with cutting-edge AI integration solutions and intelligent website automation that adapts to user behavior and business needs.
              </p>
            </motion.div>

            {/* AI Services Grid - Enhanced Professional Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  title: "AI-Powered Chatbots",
                  description: "Advanced conversational agents built with transformer models that understand context, remember conversations, and provide human-like responses",
                  icon: "🤖",
                  iconBg: "from-purple-700/30 to-pink-700/20",
                  features: ["Large Language Model Integration", "Context-Aware Responses", "Custom Knowledge Base", "24/7 Availability"]
                },
                {
                  title: "Smart Website Automation",
                  description: "AI-driven websites that analyze user behavior to dynamically adapt content, layout, and functionality for maximum engagement",
                  icon: "🧠",
                  iconBg: "from-blue-700/30 to-indigo-700/20",
                  features: ["Behavior Pattern Recognition", "Personalized User Journeys", "A/B Testing Automation", "Predictive Content Delivery"]
                },
                {
                  title: "Business Process AI",
                  description: "Intelligent automation systems that streamline operations, analyze data patterns, and enable data-driven decision making",
                  icon: "⚡",
                  iconBg: "from-amber-700/30 to-orange-700/20",
                  features: ["Workflow Intelligence", "Decision Support Systems", "Performance Analytics", "Anomaly Detection"]
                }
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + index * 0.05,
                    duration: 0.2,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="group relative p-8 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500"
                >
                  {/* Service Content */}
                  <div className="relative z-10">
                  <div className="mb-6">
                      <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center text-4xl bg-gradient-to-br ${service.iconBg} border border-white/5 shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-500`}>
                        <span className="group-hover:scale-110 transition-transform duration-300">{service.icon}</span>
                      </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
                      {service.title}
                    </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                    <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:bg-purple-400 group-hover:animate-pulse transition-all"></span>
                        {feature}
                      </div>
                    ))}
                    </div>
                  </div>

                  {/* Technical scanlines effect */}
                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none opacity-0 group-hover:opacity-30 transition-opacity duration-700 bg-scanlines"></div>
                  
                  {/* Enhanced border effect */}
                  <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-purple-500/30 transition-all duration-700"></div>
                </motion.div>
              ))}
            </div>

            {/* AI Technology Stack - Enterprise Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="p-10 rounded-xl bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              <div className="text-center mb-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">AI Infrastructure</span>
                </h3>
                <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
                  Our solutions leverage cutting-edge AI technologies that seamlessly integrate with your existing systems
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { name: "Neural Networks", description: "Deep learning architecture powering advanced pattern recognition", icon: "🧠", color: "purple" },
                  { name: "Vector Database", description: "Semantic search and similarity matching at scale", icon: "🔍", color: "blue" },
                  { name: "LLM Integration", description: "State-of-the-art language model implementation", icon: "📝", color: "amber" },
                  { name: "Attention Mechanisms", description: "Transformer-based contextual understanding", icon: "🔄", color: "indigo" }
                ].map((tech) => (
                  <div key={tech.name} className="text-center group">
                    <div className={`w-20 h-20 mx-auto mb-4 bg-black border-2 border-${tech.color}-500/30 rounded-xl flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(139,92,246,0.15)]`}>
                      <span className="group-hover:scale-125 transition-transform duration-500">{tech.icon}</span>
                    </div>
                    <h4 className="text-white font-semibold text-base mb-1 group-hover:text-purple-200 transition-colors">{tech.name}</h4>
                    <p className="text-gray-400 text-sm">{tech.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <style jsx>{`
            @keyframes matrix-fall {
              0% { background-position: 0 0; }
              100% { background-position: 0 1000px; }
            }
            
            @keyframes neural-pulse {
              0% { opacity: 0.2; transform: scaleX(0.95); }
              50% { opacity: 0.5; transform: scaleX(1.05); }
              100% { opacity: 0.2; transform: scaleX(0.95); }
            }
            
            @keyframes neural-pulse-alt {
              0% { opacity: 0.1; transform: scaleX(1.05); }
              50% { opacity: 0.4; transform: scaleX(0.95); }
              100% { opacity: 0.1; transform: scaleX(1.05); }
            }
            
            @keyframes node-pulse {
              0%, 100% { transform: scale(1); opacity: 0.4; }
              50% { transform: scale(1.5); opacity: 0.8; }
            }
            
            @keyframes code-fall {
              0% { background-position: 0 0; }
              100% { background-position: 0 1000px; }
            }
            
            @keyframes float-particle {
              0%, 100% { transform: translate(0, 0); }
              25% { transform: translate(3px, -3px); }
              50% { transform: translate(0, -5px); }
              75% { transform: translate(-3px, -3px); }
            }
            
            @keyframes processor-activity {
              0%, 100% { opacity: 0.1; }
              50% { opacity: 0.4; }
            }
            
            .matrix-animation {
              background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='10' y='20' fill='rgba(139, 92, 246, 0.3)' font-family='monospace' font-size='10'%3E10110%3C/text%3E%3Ctext x='10' y='40' fill='rgba(99, 102, 241, 0.3)' font-family='monospace' font-size='10'%3E01001%3C/text%3E%3C/svg%3E");
              animation: matrix-fall 25s linear infinite;
            }
            
            .neural-pulse {
              animation: neural-pulse 4s infinite ease-in-out;
            }
            
            .neural-pulse-alt {
              animation: neural-pulse-alt 5s infinite ease-in-out;
            }
            
            .leaky-code-left, .leaky-code-right {
              background: linear-gradient(0deg, transparent, rgba(139, 92, 246, 0.1), transparent);
              background-size: 40px 40px;
              animation: code-fall 20s linear infinite;
              background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='5' y='15' fill='rgba(139, 92, 246, 0.3)' font-family='monospace'%3E{%3C/text%3E%3Ctext x='5' y='30' fill='rgba(139, 92, 246, 0.3)' font-family='monospace'%3E}%3C/text%3E%3C/svg%3E");
            }
            
            .code-snippet {
              animation: float-particle 10s infinite ease-in-out;
            }
            
            .glow-effect {
              animation: node-pulse 4s infinite ease-in-out;
              box-shadow: 0 0 10px currentColor;
            }
            
            .glow-effect:nth-child(odd) {
              animation-delay: 1s;
            }
            
            .glow-effect:nth-child(3n) {
              animation-delay: 2s;
            }
            
            .glow-effect:nth-child(3n+1) {
              animation-delay: 3s;
            }
            
            .binary-particles {
              background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='2' y='10' fill='rgba(139, 92, 246, 0.3)' font-family='monospace' font-size='6'%3E01%3C/text%3E%3C/svg%3E");
              background-repeat: repeat;
            }
            
            .processor-animation {
              animation: processor-activity 3s infinite ease-in-out;
            }
            
            .processor-cell {
              background: rgba(139, 92, 246, 0.1);
              animation: processor-activity 2s infinite ease-in-out;
            }
            
            .processor-cell:nth-child(odd) {
              animation-delay: 0.5s;
            }
            
            .processor-cell:nth-child(3n) {
              animation-delay: 1s;
            }
            
            .processor-cell:nth-child(4n+1) {
              animation-delay: 1.5s;
            }
            
            .bg-scanlines {
              background: repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 2px,
                rgba(139, 92, 246, 0.05) 2px,
                rgba(139, 92, 246, 0.05) 4px
              );
              animation: scanline 8s linear infinite;
            }
            
            @keyframes scanline {
              0% { background-position: 0 0; }
              100% { background-position: 0 100%; }
            }
          `}</style>
        </section>
        
        {/* Project Gallery Section */}
        <HomeProjectGallery />

      {/* Client Testimonials Section */}
      <ClientTestimonials />

      {/* Team Section */}
      <TeamSection />
      
      {/* Graphs Section */}
      <GraphsSection />
      
      {/* Services Section */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
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
      <section className="py-12 sm:py-20 relative">
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

      {/* Work Process Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] opacity-50" />
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
                {/* Process Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="w-full lg:w-[45%] p-6 rounded-xl border border-white/10 
                           hover:border-purple-500/50 transition-all 
                           bg-black/40 backdrop-blur-xl group relative overflow-hidden"
                >
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

                {/* Connection Point */}
                <div className="hidden lg:flex w-[10%] justify-center items-center">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/50
                             hover:border-purple-400 hover:bg-purple-500/30 transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
        
      {/* Admin Link */}
        <div className="fixed bottom-2 right-2 opacity-30 hover:opacity-100 transition-opacity">
          <Link href="/hasnaat/login" className="text-xs text-gray-500 hover:text-gray-300">Admin</Link>
        </div>
      
      {/* Terminal (if active) */}
      {showTerminal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:w-96 h-64 bg-black/90 border border-gray-700 rounded-lg p-4 text-green-400 text-xs font-mono overflow-hidden z-50"
          drag
          dragConstraints={dragConstraints}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs">~/terminal</div>
            <div 
              className="text-gray-400 cursor-pointer hover:text-white"
              onClick={() => setShowTerminal(false)}
            >
              ✕
            </div>
          </div>
          <div className="h-44 overflow-y-auto mb-2 terminal-output">
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
              className="flex-1 bg-transparent outline-none text-green-400"
              autoFocus
            />
          </div>
        </motion.div>
      )}
      </main>
  )
}
