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

      {/* Project Stats Section - Optimized rendering */}
      <section className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all duration-300 group">
            <pre className="text-purple-400 text-xs mb-4 opacity-70 font-mono leading-none hidden md:block select-none">
              {AsciiDecorations.rocket}
            </pre>
            <div className="flex flex-col">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-300 mb-2 group-hover:text-purple-200 bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">15+</h3>
              <p className="text-gray-400 group-hover:text-gray-300 text-xs sm:text-sm">Completed Projects</p>
              </div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-300 group">
            <pre className="text-blue-400 text-xs mb-4 opacity-70 font-mono leading-none hidden md:block select-none">
              {AsciiDecorations.laptop}
            </pre>
            <div className="flex flex-col">
              <h3 className="text-3xl sm:text-4xl font-bold text-blue-300 mb-2 group-hover:text-blue-200 bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">5+</h3>
              <p className="text-gray-400 group-hover:text-gray-300 text-sm sm:text-base">Years Experience</p>
        </div>
          </div>
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_0_15px_rgba(147,51,234,0.2)] hover:shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all duration-300 group sm:col-span-2 md:col-span-1">
            <pre className="text-purple-400 text-xs mb-4 opacity-70 font-mono leading-none hidden md:block select-none">
              {AsciiDecorations.diamond}
            </pre>
            <div className="flex flex-col">
              <h3 className="text-3xl sm:text-4xl font-bold text-purple-300 mb-2 group-hover:text-purple-200 bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">100%</h3>
              <p className="text-gray-400 group-hover:text-gray-300 text-sm sm:text-base">Client Satisfaction</p>
          </div>
          </div>
        </div>
      </section>

      {/* Category Filter - Optimized with reduced effects */}
      <section className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category
                  ? 'bg-purple-500/20 text-white border border-purple-500/50'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

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
                <h3 className="text-base md:text-lg font-semibold text-purple-300 mb-1 md:mb-2 group-hover:text-purple-200">�� Backlink Checker</h3>
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