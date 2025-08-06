'use client'

import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import dynamic from 'next/dynamic'
import { audiowide, vt323 } from '@/app/utils/fonts'
import { generatePersonSchema, generateOrganizationSchema, generateWebSiteSchema, generateLocalBusinessSchema, injectStructuredData } from '@/app/lib/seo'
import Head from 'next/head'

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
const MobilePopup = dynamic(() => import('@/app/components/MobilePopup'), {
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
  // Generate structured data for SEO
  const personSchema = generatePersonSchema()
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()
  const localBusinessSchema = generateLocalBusinessSchema()

  const [konamiIndex, setKonamiIndex] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [currentJoke, setCurrentJoke] = useState(PROGRAMMING_JOKES[0])

  // Barba.js initialization is now handled by SmoothScrollInitializer in layout
  const [showJoke, setShowJoke] = useState(false)
  const [terminalInput, setTerminalInput] = useState("")
  const [counterPosition, setCounterPosition] = useState({ x: 16, y: 16 }) // Start from top-left with padding
  const [isDragging, setIsDragging] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false) // Disabled to prevent reload effect
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
  // New state for hero section toggle
  const [currentHero, setCurrentHero] = useState<'original' | 'business'>('original')
  // State for mobile popup
  const [showMobilePopup, setShowMobilePopup] = useState(false)
  
  // Refs for scroll animations
  const pageRef = useRef<HTMLDivElement>(null);

  // Client-side SEO handling
  useEffect(() => {
    // Set document title and meta tags
    document.title = "NEX-DEVS - AI-Powered Web Development & Automation Solutions"

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transform your business with AI-powered web applications, intelligent automation, and cutting-edge development solutions. 950+ successful projects delivered.')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = 'Transform your business with AI-powered web applications, intelligent automation, and cutting-edge development solutions. 950+ successful projects delivered.'
      document.head.appendChild(meta)
    }

    // Set Open Graph tags
    const setMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    setMetaTag('og:title', 'NEX-DEVS - AI-Powered Web Development & Automation Solutions')
    setMetaTag('og:description', 'Transform your business with AI-powered web applications, intelligent automation, and cutting-edge development solutions. 950+ successful projects delivered.')
    setMetaTag('og:type', 'website')
    setMetaTag('og:url', 'https://nexdevs.com')
    setMetaTag('og:image', 'https://nexdevs.com/og-image.jpg')
  }, [])

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
    
    // Add Barba event listeners
    const handleBarbaLeave = () => {
      // Clean up animations or save state when leaving page
      if (showTerminal) setShowTerminal(false);
    };
    
    const handleBarbaEnter = () => {
      // Reinitialize animations or state when entering page
      // Reset any page-specific state if needed
    };
    
    window.addEventListener('barbaLeave', handleBarbaLeave);
    window.addEventListener('barbaEnter', handleBarbaEnter);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('barbaLeave', handleBarbaLeave);
      window.removeEventListener('barbaEnter', handleBarbaEnter);
    }
  }, [handleKeyDown, showTerminal]);

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

  // Fix the handleDragEnd function typing
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    setCounterPosition({
      x: info.point.x - 30, // Adjust for element width/height
      y: info.point.y - 30
    })
  }

  // Check if this is the first visit and handle mounting
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()

    // Check URL parameters for hero selection
    const urlParams = new URLSearchParams(window.location.search);
    const heroParam = urlParams.get('hero');
    if (heroParam === 'business' || heroParam === 'original') {
      setCurrentHero(heroParam);
    }

    // Always show welcome screen on mount
    setShowWelcome(true);

    // Dispatch event to notify other components
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('welcomeScreenStateChange', {
        detail: { showWelcome: true }
      }));
    }, 100);

    // Listen for storage changes (for cross-tab synchronization)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'welcomeScreenShown') {
        // Reset welcome screen state when storage changes
        setShowWelcome(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Listen for mobile hero toggle events
  useEffect(() => {
    const handleMobileHeroToggle = (event: CustomEvent) => {
      setCurrentHero(event.detail.hero);
    };

    window.addEventListener('mobileHeroToggle', handleMobileHeroToggle as EventListener);

    return () => {
      window.removeEventListener('mobileHeroToggle', handleMobileHeroToggle as EventListener);
    };
  }, []);

  // Handle welcome screen completion
  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeScreenShown', 'true');

    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('welcomeScreenStateChange', {
      detail: { showWelcome: false }
    }));

    // Show mobile popup for mobile users after welcome screen completion
    if (isMobile) {
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowMobilePopup(true);
      }, 500);
    }
  };

  // Add function to reset welcome screen (for testing)
  const resetWelcomeScreen = () => {
    localStorage.removeItem('welcomeScreenShown');
    setShowWelcome(true);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Inject structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(personSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(organizationSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(websiteSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(localBusinessSchema)
        }}
      />

      <main
        className="relative"
        ref={pageRef}
        data-barba="wrapper"
      >
      <div data-barba="container" data-barba-namespace="home">
        <Suspense fallback={<div className="h-screen bg-black" />}>
          {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}
        </Suspense>

        {/* Mobile Popup - Show after welcome screen completion for mobile users */}
        {showMobilePopup && isMobile && (
          <Suspense fallback={null}>
            <MobilePopup onClose={() => setShowMobilePopup(false)} />
          </Suspense>
        )}
        
        {/* Hero Section Toggle - OPTIMIZED for performance */}
        {currentHero === 'original' ? (
          <div
            className="hero-section-container hero-optimized"
            data-barba="container"
            data-barba-namespace="original-hero"
          >
            <HeroToggle
              currentHero={currentHero}
              onToggle={(hero) => setCurrentHero(hero)}
              isHeroPage={true}
            />
            <Hero />
          </div>
        ) : (
          <div
            className="hero-section-container hero-optimized"
            data-barba="container"
            data-barba-namespace="business-hero"
          >
            <HeroToggle
              currentHero={currentHero}
              onToggle={(hero) => setCurrentHero(hero)}
              isHeroPage={false}
            />
            <BusinessHero />
          </div>
        )}
        
        {/* AI Integration Section - Modern Professional AI Section */}
        <section 
          className="py-16 sm:py-24 relative overflow-hidden"
          data-barba="container" 
          data-barba-namespace="ai-section"
        >
          {/* Pure Black Background */}
          <div className="absolute inset-0 pointer-events-none bg-black">
            {/* AI Matrix Code Animation */}
            <div className="absolute inset-0 opacity-[0.15] matrix-animation"></div>
          </div>
          
          {/* SIMPLIFIED: Static neural network for performance */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-1/4 left-1/3 w-[300px] h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-blue-500/0"></div>
            <div className="absolute top-1/3 right-1/4 w-[200px] h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-purple-500/0"></div>
            <div className="absolute bottom-1/3 left-1/4 w-[250px] h-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-purple-500/0"></div>
          </div>
          
          {/* REMOVED: Heavy code animations for better performance */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute left-0 top-0 bottom-0 w-32 sm:w-52 bg-gradient-to-r from-purple-500/5 to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 sm:w-52 bg-gradient-to-l from-purple-500/5 to-transparent"></div>
            
            {/* REMOVED: Heavy floating code snippets for better performance */}
          </div>

          {/* REMOVED: Heavy neural network nodes for better performance */}
          
          {/* REMOVED: Heavy processor animation for better performance */}

          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <div
              className="text-center mb-16 sm:mb-20 space-y-6 sm:space-y-8"
            >
              <div className="inline-block px-5 py-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-full text-purple-400 text-sm sm:text-base font-medium backdrop-blur-sm border border-purple-500/30">
                Advanced AI Solutions
              </div>
              <h2 className={`${audiowide.className} text-3xl sm:text-5xl font-bold text-white leading-tight relative`}>
                AI INTEGRATION & AI <span className="bg-white text-black px-4 py-2 rounded-lg relative">CONTROLLED</span> WEBSITES
              </h2>
              <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Transform your business with cutting-edge AI integration solutions and intelligent website automation that adapts to user behavior and business needs.
              </p>
            </div>

            {/* AI Services Grid - Enhanced Professional Design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  title: "AI-Powered Chatbots",
                  description: "Advanced conversational agents built with transformer models that understand context, remember conversations, and provide human-like responses",
                  imagePath: "https://www.shutterstock.com/image-vector/chatbot-icon-line-vector-isolate-600nw-1841577400.jpg",
                  color: "purple",
                  features: ["Large Language Model Integration", "Context-Aware Responses", "Custom Knowledge Base", "24/7 Availability"]
                },
                {
                  title: "Smart Website Automation",
                  description: "AI-driven websites that analyze user behavior to dynamically adapt content, layout, and functionality for maximum engagement",
                  imagePath: "https://www.seekpng.com/png/detail/107-1070746_desktop-computer-on-black-square-background-vector-desktop.png",
                  color: "blue",
                  features: ["Behavior Pattern Recognition", "Personalized User Journeys", "A/B Testing Automation", "Predictive Content Delivery"]
                },
                {
                  title: "Business Process AI",
                  description: "Intelligent automation systems that streamline operations, analyze data patterns, and enable data-driven decision making",
                  imagePath: "https://www.shutterstock.com/image-vector/abstract-ai-logo-set-sleek-600nw-2590920659.jpg",
                  color: "amber",
                  features: ["Workflow Intelligence", "Decision Support Systems", "Performance Analytics", "Anomaly Detection"]
                }
              ].map((service, index) => (
                <div
                  key={service.title}
                  className="group relative p-8 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500"
                >
                  {/* Service Content */}
                  <div className="relative z-10">
                    <div className="mb-6">
                      <div className={`relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-black/80 to-black/40 border border-${service.color}-500/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.15)] backdrop-blur-sm hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] transition-all duration-300 group-hover:border-${service.color}-400/50`}>
                        <div className="absolute inset-0 flex items-center justify-center p-3">
                          <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                            <Image
                              src={service.imagePath}
                              alt={`${service.title} illustration`}
                              width={64}
                              height={64}
                              className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-all duration-500 filter brightness-110 group-hover:brightness-125"
                              priority
                              style={{ 
                                objectFit: 'contain',
                                borderRadius: '12px'
                              }}
                            />
                          </div>
                        </div>
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
                </div>
              ))}
            </div>

            {/* AI Technology Stack - Enterprise Focus */}
            <div
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
                  { 
                    name: "Neural Networks", 
                    description: "Deep learning architecture powering advanced pattern recognition", 
                    imagePath: "https://victorzhou.com/media/nn-series/network.svg",
                    color: "purple",
                    imageSize: { width: 64, height: 64 }
                  },
                  { 
                    name: "Vector Database", 
                    description: "Semantic search and similarity matching at scale", 
                    imagePath: "https://st2.depositphotos.com/2492527/48334/v/450/depositphotos_483344206-stock-illustration-database-share-icon-vector-eps.jpg",
                    color: "blue",
                    imageSize: { width: 64, height: 64 }
                  },
                  { 
                    name: "LLM Integration", 
                    description: "State-of-the-art language model implementation", 
                    imagePath: "https://images.seeklogo.com/logo-png/59/1/ollama-logo-png_seeklogo-593420.png",
                    color: "amber",
                    imageSize: { width: 72, height: 72 }
                  },
                  { 
                    name: "Attention Mechanisms", 
                    description: "Transformer-based contextual understanding", 
                    imagePath: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FprTT1%2FbtqChF6Z2BM%2FyKmITHEga1J0ZYFWEMr8Y0%2Fimg.png",
                    color: "indigo",
                    imageSize: { width: 64, height: 64 }
                  }
                ].map((tech) => (
                  <div key={tech.name} className="text-center group">
                    <div className={`relative w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-black/80 to-black/40 border border-${tech.color}-500/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.15)] backdrop-blur-sm hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] transition-all duration-300 group-hover:border-${tech.color}-400/50`}>
                      <div className="absolute inset-0 flex items-center justify-center p-3">
                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40 flex items-center justify-center">
                          <Image
                            src={tech.imagePath}
                            alt={`${tech.name} illustration`}
                            width={tech.imageSize.width}
                            height={tech.imageSize.height}
                            className="w-[85%] h-[85%] object-contain group-hover:scale-110 transition-all duration-500 filter brightness-110 group-hover:brightness-125"
                            priority
                            unoptimized={tech.imagePath.includes('http')}
                            style={{ 
                              objectFit: 'contain',
                              borderRadius: '12px'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-white font-semibold text-base mb-1 group-hover:text-purple-200 transition-colors">{tech.name}</h4>
                    <p className="text-gray-400 text-sm max-w-[200px] mx-auto">{tech.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* REMOVED: Heavy CSS animations for 60fps performance */}
        </section>
        
        {/* Project Gallery Section */}
        <div data-barba="container" data-barba-namespace="projects">
          <HomeProjectGallery />
        </div>

      {/* Client Testimonials Section */}
      {!isMobile && (
        <div data-barba="container" data-barba-namespace="testimonials">
          <ClientTestimonials />
        </div>
      )}

      {/* Team Section */}
      <div data-barba="container" data-barba-namespace="team">
        <TeamSection />
      </div>
      
      {/* Graphs Section */}
      <div data-barba="container" data-barba-namespace="graphs">
        <GraphsSection />
      </div>
      
      {/* Services Section */}
      <section 
        className="py-12 sm:py-20 relative overflow-hidden"
        data-barba="container" 
        data-barba-namespace="services"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div
            className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-4"
          >
            <h2 className={`${audiowide.className} text-2xl sm:text-4xl font-bold text-white`}>
              Our{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-white text-black px-3 sm:px-4 py-1 rounded-lg">
                  Services
                </span>
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={`group relative p-4 sm:p-6 w-[calc(50%-8px)] sm:w-64 rounded-xl bg-black/50 backdrop-blur-lg transition-all duration-300 shadow-lg ${
                  index % 8 === 0 ? 'neon-border-purple-base' :
                  index % 8 === 1 ? 'neon-border-blue-base' :
                  index % 8 === 2 ? 'neon-border-green-base' :
                  index % 8 === 3 ? 'neon-border-pink-base' :
                  index % 8 === 4 ? 'neon-border-cyan-base' :
                  index % 8 === 5 ? 'neon-border-orange-base' :
                  index % 8 === 6 ? 'neon-border-yellow-base' :
                  'neon-border-violet-base'
                }`}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section 
        className="py-12 sm:py-20 relative"
        data-barba="container" 
        data-barba-namespace="technologies"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className={`${audiowide.className} text-2xl sm:text-4xl font-bold text-white mb-3`}>
              <span className="text-white">Tech </span>
              <span className="bg-white text-black px-3 py-1 rounded-lg">Stack</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              Modern technologies I work with to build powerful solutions
            </p>
        </div>

          {/* Tech Icons - Minimalist Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {technologies.map((tech, index) => (
              <div
                key={tech.name}
                className="flex flex-col items-center"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 mb-2 sm:mb-3 flex items-center justify-center bg-black p-2 sm:p-3 rounded-lg transition-all duration-300 ${
                  index % 6 === 0 ? 'neon-border-purple-base' :
                  index % 6 === 1 ? 'neon-border-blue-base' :
                  index % 6 === 2 ? 'neon-border-green-base' :
                  index % 6 === 3 ? 'neon-border-pink-base' :
                  index % 6 === 4 ? 'neon-border-cyan-base' :
                  'neon-border-orange-base'
                }`}>
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
            ].map((category, index) => (
              <div
                key={category.title}
                className={`group p-5 sm:p-6 rounded-lg bg-black hover:bg-black/80 transition-all duration-300 ${
                  index === 0 ? 'neon-border-yellow-base' :
                  index === 1 ? 'neon-border-violet-base' :
                  'neon-border-lime-base'
                }`}
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
      <section 
        className="py-20 relative overflow-hidden"
        data-barba="container" 
        data-barba-namespace="work-process"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[128px] opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[128px] opacity-50" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div
            className="text-center mb-16"
          >
            <h2 className={`${audiowide.className} text-3xl font-bold text-white mb-4`}>How I Work</h2>
            <p className={`${vt323.className} text-gray-400`} style={{ fontSize: '16px' }}>A systematic approach to delivering exceptional results</p>
          </div>

          <div className="space-y-12 relative">
            {workProcess.map((process, index) => (
              <div
                key={process.step}
                className={`flex flex-col lg:flex-row gap-8 items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Process Card */}
                <div
                  className={`w-full lg:w-[45%] p-6 rounded-xl transition-all bg-black/40 backdrop-blur-xl group relative overflow-hidden ${
                    index % 4 === 0 ? 'neon-border-purple-base' :
                    index % 4 === 1 ? 'neon-border-blue-base' :
                    index % 4 === 2 ? 'neon-border-green-base' :
                    'neon-border-pink-base'
                  }`}
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
                        <li
                          key={i}
                          className="text-gray-400 text-sm flex items-center gap-2 group/item"
                        >
                          <span className="w-1.5 h-1.5 bg-purple-400/50 rounded-full 
                                       group-hover/item:bg-purple-400 group-hover/item:scale-110 
                                       transition-all" />
                          <span className="group-hover:text-purple-200/90 transition-colors">
                            {detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Connection Point */}
                <div className="hidden lg:flex w-[10%] justify-center items-center">
                  <div
                    className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500/50
                             hover:border-purple-400 hover:bg-purple-500/30 transition-all duration-300"
                  />
                </div>
              </div>
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
        <div
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
        </div>
      )}
      </div>
    </main>
    </>
  )
}
