'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useCallback, useMemo } from 'react'
import Image from 'next/image'

// Add fun facts array
const funFacts = [
  "My code is so clean, it makes soap jealous! ✨",
  "I named all my bugs 'Feature' - now the client loves them! 🐛",
  "My keyboard has worn-out Ctrl, C, and V keys... I wonder why 🤔",
  "I don't always test my code, but when I do, I do it in production 😎",
];

// Add ASCII art decorations
const AsciiDecorations = {
  rocket: `
  ▲
 ▲ ▲
█████
 ███
  █
`,
  laptop: `
 ┌───────┐
 │ >_    │
 │       │
 └───────┘
`,
  terminal: `
┌──────────┐
│ $ code . │
└──────────┘
`,
  diamond: `
   ╱╲
  ╱  ╲
  ╲  ╱
   ╲╱
`
};

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  link: string
  featured: boolean
}

// Updated projects data with proper image paths
const projects: Project[] = [
  {
    id: 1,
    title: "NEX-WEBS Tools",
    description: "A comprehensive suite of web tools including XML Sitemap Generator, Image Compressor, and SEO tools.(just need an API key for some tools to work)",
    image: "/projects/ecommerce.jpg",
    category: "Web Development",
    technologies: ["Next.js", "Tailwind CSS", "TypeScript"],
    link: "https://1-project-nex-webs.netlify.app/",
    featured: true
  },
  {
    id: 2,
    title: "NEXTJS-WEBSITE",
    description: "A creative portfolio website with interactive elements and smooth animations, showcasing various projects and skills.",
    image: "/projects/portfolio.jpg",
    category: "Web Development",
    technologies: ["React", "Framer Motion", "Tailwind CSS", "TypeScript"],
    link: "https://nex-webs-project2.netlify.app/",
    featured: true
  },
  {
    id: 3,
    title: "Morse Code Translator(Web-App)",
    description: "Express yourself with unique Morse Code products—perfect for personalized gifts, home decor, and more. Speak in dots and dashes today!",
    image: "/projects/mobile-ui.jpg",
    category: "UI/UX Design",
    technologies: ["Figma", "Adobe XD", "Prototyping"],
    link: "https://nex-webs-project-6.netlify.app/",
    featured: false
  },
  {
    id: 4,
    title: "WEB-APP-(Gratuity Calculator 2025)",
    description: "This tool simplifies the complex process of gratuity calculation, ensuring you have a clear understanding of your entitlements.",
    image: "/projects/analytics.jpg",
    category: "Web Development",
    technologies: ["React", "TensorFlow.js","Node.js"],
    link: "https://nex-webs-project-9.netlify.app/",
    featured: true
  },
  {
    id: 5,
    title: "Invisible Character Generator(Web-App)",
    description: "This tool is designed to help you generate and copy invisible characters easily.",
    image: "/projects/social-media.jpg",
    category: "Web Development",
    technologies: ["Vue.js", "Firebase", "TailwindCSS", "Python"],
    link: "https://nex-webs-project-4.netlify.app/",
    featured: false
  },
  {
    id: 6,
    title: "CPU & GPU Bottleneck Calculator(AI-Agent)",
    description: "A modern and intuitive NFT marketplace design with dark theme and glass-morphism effects.",
    image: "/projects/nft-marketplace.jpg",
    category: "UI/UX Design",
    technologies: ["Figma", "Blender", "After Effects"],
    link: "https://project-4-updated.vercel.app/",
    featured: true
  },
  {
    id: 7,
    title: "AI Code Assistant(AI-Agent)",
    description: "UNDER PROGRESS..........",
    image: "/projects/ai-code.jpg",
    category: "Web Development",
    technologies: ["Python", "TensorFlow", "FastAPI", "React"],
    link: "https://ai-code-assistant.vercel.app",
    featured: true
  },
  {
    id: 8,
    title: "3D Portfolio Showcase",
    description: "UNDER PROGRESS....",
    image: "/projects/3d-portfolio.jpg",
    category: "UI/UX Design",
    technologies: ["Three.js", "React Three Fiber", "GSAP", "Blender"],
    link: "https://3d-portfolio-showcase.vercel.app",
    featured: true
  },
  {
    id: 9,
    title: "Smart Home Dashboard",
    description: "UNDER PROGRESS..(YEAH LAZY ASS)",
    image: "/projects/smart-home.jpg",
    category: "Web Development",
    technologies: ["Next.js", "Socket.io", "MQTT", "Chart.js"],
    link: "https://smart-home-dashboard.vercel.app",
    featured: false
  },
  {
    id: 10,
    title: "Crypto Trading Bot",
    description: "WORKING ASSOFF FOR COMPLETION..(STAY TUNED) ",
    image: "/projects/crypto-bot.jpg",
    category: "Web Development",
    technologies: ["Node.js", "MongoDB", "WebSocket", "TradingView API"],
    link: "https://crypto-trading-bot.vercel.app",
    featured: false
  }
]

// Get unique categories from projects
const categories = ['All', ...Array.from(new Set(projects.map(project => project.category)))]

// Add loading animation component
const LoadingDots = () => (
  <div className="flex space-x-1">
    {[1, 2, 3].map((dot) => (
      <div
        key={dot}
        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
        style={{ animationDelay: `${dot * 0.2}s` }}
      />
    ))}
  </div>
);

// Adding 'NEWLY ADDED' text to project names in NewSection
const NewSection = () => (
  <section className="max-w-7xl mx-auto mb-16">
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-800/40 to-blue-800/40 border border-purple-600/30 p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-400 bg-clip-text text-transparent">
            New Projects
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 animate-pulse">
            Recently Added
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 3D Portfolio Website Card */}
          <div className="group relative p-6 rounded-lg bg-gray-800/50 border border-purple-600/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-800/60 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            
            {/* Project Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                </span>
                In Development
              </span>
              <span className="text-xs text-gray-400">Updated 2 days ago</span>
            </div>

            <h3 className="text-2xl font-bold text-purple-300 mb-3 group-hover:text-purple-200 transition-colors">
              NEWLY ADDED: 3D Portfolio Website
            </h3>
            
            {/* Project Description */}
            <div className="space-y-3 mb-4">
              <p className="text-base text-gray-300">A 3D website showcasing immersive experiences with interactive elements and stunning animations.</p>
              
              {/* Features List */}
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Interactive 3D models and animations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom shader effects
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Responsive 3D environments
                </li>
              </ul>
            </div>

            {/* Technology Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">Three.js</span>
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">React Three Fiber</span>
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">GSAP</span>
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">WebGL</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Development Progress</span>
                <span>99%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-[99%] h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="https://3d-portfolio-showcase.vercel.app" className="px-4 py-2 rounded-md bg-purple-600 text-white no-underline hover:bg-purple-700 transition-colors flex items-center gap-2">
                <span>Live Preview</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <Link href="https://github.com/your-username/3d-portfolio" className="px-4 py-2 rounded-md bg-gray-700 text-white no-underline hover:bg-gray-600 transition-colors flex items-center gap-2">
                <span>Source Code</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Fullstack Dashboard Card */}
          <div className="group relative p-6 rounded-lg bg-gray-800/50 border border-purple-600/20 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-gray-800/60 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
            
            {/* Project Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Beta Testing
              </span>
              <span className="text-xs text-gray-400">Updated 5 days ago</span>
            </div>

            <h3 className="text-2xl font-bold text-purple-300 mb-3 group-hover:text-purple-200 transition-colors">
              NEWLY ADDED: Fullstack Dashboard
            </h3>
            
            {/* Project Description */}
            <div className="space-y-3 mb-4">
              <p className="text-base text-gray-300">A complete dashboard solution with authentication, analytics, and real-time data visualization.</p>
              
              {/* Features List */}
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  OAuth 2.0 Authentication
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time Analytics
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Data Visualization
                </li>
              </ul>
            </div>

            {/* Technology Stack */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white border border-white/20">Next.js 14</span>
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Tailwind CSS</span>
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">Prisma</span>
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30">MongoDB</span>
            </div>

            {/* Progress Bar for Fullstack Dashboard */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Development Progress</span>
                <span>50%</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="https://fullstack-dashboard.vercel.app" className="px-4 py-2 rounded-md bg-purple-600 text-white no-underline hover:bg-purple-700 transition-colors flex items-center gap-2">
                <span>Live Preview</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <Link href="https://github.com/your-username/fullstack-dashboard" className="px-4 py-2 rounded-md bg-gray-700 text-white no-underline hover:bg-gray-600 transition-colors flex items-center gap-2">
                <span>Source Code</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Adding smooth scrolling behavior to the body
const GlobalStyles = () => (
  <style jsx global>{`
    body {
      scroll-behavior: smooth;
    }
  `}</style>
);

export default function ProjectsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [easterEggCount, setEasterEggCount] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggMessage, setEasterEggMessage] = useState('')

  // Enhanced Easter egg handler
  const handleTitleClick = useCallback((project: Project) => {
          setEasterEggCount(prev => prev + 1)
    if (easterEggCount === 9) {
      const messages: Record<string, string> = {
        "NEX-WEBS Tools": "🚀 Unlocked: Secret SEO optimization mode activated!",
        "NEXTJS-WEBSITE": "✨ Found the hidden animation sequence!",
        "Morse Code Translator": "... . -.-. .-. . - (SECRET) found!",
        "WEB-APP-(Gratuity Calculator 2025)": "💰 Bonus calculator mode unlocked!",
        "Invisible Character Generator": "🔍 You found the invisible Easter egg!",
        "CPU & GPU Bottleneck Calculator": "⚡ Turbo mode activated!",
        "AI Code Assistant": "🤖 AI assistant level upgraded!",
        "3D Portfolio Showcase": "🎮 Unlocked secret 3D view!",
        "Smart Home Dashboard": "🏠 Secret room discovered!",
        "Crypto Trading Bot": "💎 Diamond hands mode activated!"
      }
      setEasterEggMessage(messages[project.title] || "🎉 You found a secret!")
      setShowEasterEgg(true)
      setTimeout(() => {
        setShowEasterEgg(false)
        setEasterEggCount(0)
      }, 3000)
    }
  }, [easterEggCount])

  // Memoize filtered projects
  const filteredProjects = useMemo(() => 
    selectedCategory === 'All'
      ? projects
      : projects.filter(project => project.category === selectedCategory),
    [selectedCategory]
  )

  return (
    <div className="min-h-screen pt-24 px-6 bg-[#0a0a0a]">
      <GlobalStyles />
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-7xl mx-auto mb-8 md:mb-12"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
          My Projects
        </h1>
        <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl drop-shadow-[0_0_10px_rgba(147,51,234,0.2)]">
          Explore my complete portfolio of projects, from web applications to design work.
        </p>
        {showEasterEgg && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-8 py-4 bg-black/90 rounded-xl border border-purple-500/30 z-50 backdrop-blur-md"
            >
            <p className="text-white text-lg font-medium">{easterEggMessage}</p>
            </motion.div>
          )}
      </motion.section>

      {/* New Section (Below Featured Project) */}
      <NewSection />

      {/* Featured Project */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 p-8">
          <div className="relative z-10">
            <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🌟 Featured Project
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-purple-300 to-blue-300 bg-clip-text text-transparent">
              NEX-WEBS Tools
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-300 mb-6 leading-relaxed">
              A comprehensive suite of web tools including XML Sitemap Generator, Image Compressor, and SEO tools.
            </p>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🖼️ Image Compressor</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Optimize images without quality loss</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🔍 Plagiarism Checker</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Advanced content originality verification</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🤖 AI Detector</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Identify AI-generated content</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🎯 Keyword Positioning</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">SEO keyword rank tracking</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">✍️ Article Writer</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">AI-powered content generation</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🔑 API Access</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Developer API integration</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">📊 Domain Authority</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Website authority metrics</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">🔗 Backlink Checker</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Analyze backlink profile</p>
              </div>
              <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all group">
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">📝 Paraphrasing Tool</h3>
                <p className="text-xs md:text-sm text-gray-400 group-hover:text-gray-300">Intelligent content rewriting</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
              {["Next.js", "Tailwind CSS", "TypeScript"].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20 transition-all"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex gap-3 md:gap-4 flex-col sm:flex-row">
              <Link
                href="https://1-project-nex-webs.netlify.app/"
                className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-purple-500 text-white text-sm md:text-base font-medium hover:bg-purple-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                View Project <span className="text-lg md:text-xl">→</span>
              </Link>
              <Link
                href="https://1-project-nex-webs.netlify.app/code"
                className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-transparent text-purple-300 text-sm md:text-base font-medium border border-purple-500/30 hover:bg-purple-500/20 hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                Source Code
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Easter Egg Hint */}
      <section className="max-w-7xl mx-auto -mt-6 md:-mt-8 mb-8 md:mb-12">
        <div className="text-center">
          <p className="text-xs md:text-sm text-purple-400/70 cursor-default">
            👆 Click any project title 10 times for a surprise! 
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {filteredProjects.filter(project => project.id !== 1).map((project) => (
            <div
              key={project.id}
              className="relative overflow-hidden rounded-xl bg-black/40 border border-white/10 min-h-[350px] md:min-h-[400px] backdrop-blur-sm"
            >
              <div className="h-full relative">
                <div className="p-4 md:p-6">
                  <div 
                    className="mb-4 md:mb-6 text-center py-6 md:py-8 bg-gradient-to-b from-purple-500/10 to-transparent rounded-lg border border-purple-500/20 cursor-pointer hover:from-purple-500/20 transition-colors"
                    onClick={() => handleTitleClick(project)}
                  >
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-200 mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] md:text-xs px-2 md:px-3 py-1 bg-black/50 text-white rounded-full border border-purple-500/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 md:gap-3">
                    <Link
                      href={project.link}
                      className="flex-1 text-center text-xs md:text-sm px-3 md:px-4 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-100 transition-colors"
                    >
                      LIVE LINK
                    </Link>
                    <Link
                      href={`${project.link}/code`}
                      className="flex-1 text-center text-xs md:text-sm px-3 md:px-4 py-2 rounded-md bg-black text-white border border-white/50 hover:bg-black/80 transition-colors"
                    >
                      Source Code
                    </Link>
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white text-black text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-purple-500/20 z-30 font-medium">
                    Featured
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-16 px-4 md:px-6">
        <div className="relative overflow-hidden rounded-xl p-6 md:p-8 border border-purple-500/20 bg-purple-500/5">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              New Projects Coming Soon
            </h2>
            <pre className="text-purple-400 text-xs mb-4 opacity-70 font-mono leading-none hidden md:block select-none">
              {AsciiDecorations.terminal}
            </pre>
            <p className="text-base md:text-lg text-purple-200/80 mb-4 md:mb-6">
              Stay tuned for exciting new projects! Follow me on social media for updates.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-4 md:px-6 py-1.5 md:py-2 rounded-full bg-purple-500/20 text-purple-300 text-sm md:text-base border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center gap-2">
                Follow Updates
                <LoadingDots />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 