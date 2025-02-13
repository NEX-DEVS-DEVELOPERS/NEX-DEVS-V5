'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

// Add fun facts array
const funFacts = [
  "My code is so clean, it makes soap jealous! ✨",
  "I named all my bugs 'Feature' - now the client loves them! 🐛",
  "My keyboard has worn-out Ctrl, C, and V keys... I wonder why 🤔",
  "I don't always test my code, but when I do, I do it in production 😎",
];

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
    description: "A comprehensive suite of web tools including XML Sitemap Generator, Image Compressor, and SEO tools.",
    image: "/projects/ecommerce.jpg",
    category: "Web Development",
    technologies: ["Next.js", "Tailwind CSS", "TypeScript"],
    link: "https://nex-webs-tools.netlify.app/",
    featured: true
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "A creative portfolio website with interactive elements and smooth animations, showcasing various projects and skills.",
    image: "/projects/portfolio.jpg",
    category: "Web Development",
    technologies: ["React", "Framer Motion", "Tailwind CSS", "TypeScript"],
    link: "/projects/portfolio",
    featured: true
  },
  {
    id: 3,
    title: "Mobile App UI Design",
    description: "A sleek and intuitive mobile app interface design for a fitness tracking application.",
    image: "/projects/mobile-ui.jpg",
    category: "UI/UX Design",
    technologies: ["Figma", "Adobe XD", "Prototyping"],
    link: "/projects/mobile-ui",
    featured: false
  },
  {
    id: 4,
    title: "AI-Powered Analytics Dashboard",
    description: "A sophisticated analytics platform featuring real-time data visualization,AI-driven insights.",
    image: "/projects/analytics.jpg",
    category: "Web Development",
    technologies: ["React", "TensorFlow.js","Node.js"],
    link: "/projects/analytics",
    featured: true
  },
  {
    id: 5,
    title: "Social Media Management Tool",
    description: "An all-in-one social media management platform with scheduling, analytics, and AI-powered content suggestions.",
    image: "/projects/social-media.jpg",
    category: "Web Development",
    technologies: ["Vue.js", "Firebase", "TailwindCSS", "Python"],
    link: "/projects/social-media",
    featured: false
  },
  {
    id: 6,
    title: "NFT Marketplace Design",
    description: "A modern and intuitive NFT marketplace design with dark theme and glass-morphism effects.",
    image: "/projects/nft-marketplace.jpg",
    category: "UI/UX Design",
    technologies: ["Figma", "Blender", "After Effects"],
    link: "/projects/nft-marketplace",
    featured: true
  }
]

// Get unique categories from projects
const categories = ['All', ...new Set(projects.map(project => project.category))]

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
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [easterEggCount, setEasterEggCount] = useState(0)
  const [foundEasterEggs, setFoundEasterEggs] = useState<Set<string>>(new Set())
  const [clickCount, setClickCount] = useState(0)
  const [currentFact, setCurrentFact] = useState(0);
  const [easterEggAnimation, setEasterEggAnimation] = useState(false);

  // Update the easterEggs object with hints
  const easterEggs = {
    title: "Found the secret title click! 🎉 You're a curious one!",
    projects: "You found all project Easter eggs! 🌟 You're amazing!",
    konami: "⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️ Konami Code Master! 🎮",
    special: "You discovered the hidden message! 💫",
    nexwebs: "You found the NEX-WEBS secret! 🚀",
    nft: "NFT Easter egg unlocked! 🎨",
    analytics: "You discovered the hidden analytics! 📊"
  }

  // Add hints object
  const easterEggHints = {
    nexwebs: "Hover over NEX-WEBS Tools to discover a secret!",
    nft: "Click the NFT Marketplace card 3 times",
    analytics: "Keep hovering over the Analytics Dashboard..."
  }

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory)

  const handleProjectClick = (title: string) => {
    setExpandedProject(expandedProject === title ? null : title)
  }

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!foundEasterEggs.has('title')) {
      setEasterEggCount(prev => prev + 1)
      setFoundEasterEggs(new Set([...foundEasterEggs, 'title']))
    }
  }

  const handleProjectEasterEgg = (title: string) => {
    if (!foundEasterEggs.has(title)) {
      setEasterEggCount(prev => prev + 1)
      setFoundEasterEggs(new Set([...foundEasterEggs, title]))
      
      // Check if all project Easter eggs are found
      if ([...foundEasterEggs].filter(egg => projects.some(p => p.title === egg)).length === projects.length - 1) {
        if (!foundEasterEggs.has('projects')) {
          setEasterEggCount(prev => prev + 1)
          setFoundEasterEggs(new Set([...foundEasterEggs, 'projects']))
        }
      }
    }
  }

  const showNextFact = () => {
    setCurrentFact((prev) => (prev + 1) % funFacts.length);
  };

  const handleProjectHover = (project: Project) => {
    setHoveredProject(project.id);
    
    // Project-specific Easter eggs
    if (project.title === "NEX-WEBS Tools" && !foundEasterEggs.has('nexwebs')) {
      setFoundEasterEggs(new Set([...foundEasterEggs, 'nexwebs']));
      setEasterEggCount(prev => prev + 1);
      triggerEasterEggAnimation();
    }
    
    if (project.title === "NFT Marketplace Design" && clickCount === 2 && !foundEasterEggs.has('nft')) {
      setFoundEasterEggs(new Set([...foundEasterEggs, 'nft']));
      setEasterEggCount(prev => prev + 1);
      triggerEasterEggAnimation();
    }
    
    if (project.title === "AI-Powered Analytics Dashboard" && 
        hoveredProject === project.id && 
        !foundEasterEggs.has('analytics')) {
      setTimeout(() => {
        if (hoveredProject === project.id) {
          setFoundEasterEggs(new Set([...foundEasterEggs, 'analytics']));
          setEasterEggCount(prev => prev + 1);
          triggerEasterEggAnimation();
        }
      }, 2000); // Trigger after 2 seconds of hovering
    }
  }

  const triggerEasterEggAnimation = () => {
    setEasterEggAnimation(true);
    setTimeout(() => {
      setEasterEggAnimation(false);
    }, 1000); // Animation duration
  }

  return (
    <div className="min-h-screen pt-24 px-6 bg-[#0a0a0a]">
      {/* Hero Section with enhanced purple glow */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(147,51,234,0.5)]">
          My Projects
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl drop-shadow-[0_0_10px_rgba(147,51,234,0.2)]">
          Explore my complete portfolio of projects, from web applications to design work.
        </p>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-purple-400">Easter Eggs Found: {easterEggCount}</span>
          {easterEggCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-3 py-1 bg-purple-500/20 rounded-full text-sm text-purple-300"
            >
              {Array.from(foundEasterEggs).slice(-1)[0] && easterEggs[Array.from(foundEasterEggs).slice(-1)[0] as keyof typeof easterEggs]}
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Easter Egg Hints Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <h3 className="text-purple-300 font-semibold mb-2">🎯 Easter Egg Hints</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(easterEggHints).map(([key, hint]) => (
              <div 
                key={key}
                className={`p-3 rounded-lg ${
                  foundEasterEggs.has(key) 
                    ? 'bg-green-500/20 border border-green-500/20' 
                    : 'bg-purple-500/5 border border-purple-500/20'
                }`}
              >
                <p className="text-sm text-gray-300">
                  {foundEasterEggs.has(key) ? '✅ Found!' : hint}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Project Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
            <h3 className="text-2xl font-bold text-purple-300 mb-2">15+</h3>
            <p className="text-gray-400">Completed Projects</p>
          </div>
          <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <h3 className="text-2xl font-bold text-blue-300 mb-2">5+</h3>
            <p className="text-gray-400">Years Experience</p>
          </div>
          <div className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/20 shadow-[0_0_15px_rgba(147,51,234,0.2)]">
            <h3 className="text-2xl font-bold text-purple-300 mb-2">100%</h3>
            <p className="text-gray-400">Client Satisfaction</p>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Category Filter with glow */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="flex flex-wrap gap-4">
          {categories.map((category) => (
            <button 
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 border shadow-lg ${
                selectedCategory === category
                  ? 'bg-blue-500/20 text-white border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Projects Grid with modern cards */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-7xl mx-auto mb-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:border-purple-500/30 min-h-[500px]"
              whileHover={{ y: -5 }}
              onHoverStart={() => handleProjectHover(project)}
              onClick={() => {
                setClickCount(prev => prev + 1);
                if (project.title === "NFT Marketplace Design" && !foundEasterEggs.has('nft')) {
                  if (clickCount === 2) { // Will trigger on third click
                    handleProjectHover(project);
                  }
                }
              }}
            >
              <div className="h-full relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="object-cover w-full h-[200px]"
                />
                <div className="absolute inset-0 p-8 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-4 bg-black/40 px-6 py-3 rounded-lg inline-block backdrop-blur-sm text-white">
                      {project.title}
                    </h3>
                    <p className="text-base mb-6 mt-4 text-gray-200">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-sm px-4 py-2 bg-black/40 text-purple-300 rounded-full border border-purple-500/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 bg-black/60 p-4 rounded-xl backdrop-blur-sm border border-purple-500/20">
                    <span className="text-sm font-semibold text-white mb-1">Project Links:</span>
                    <div className="flex gap-3">
                      <Link
                        href={project.link}
                        className="flex-1 text-center text-sm px-4 py-1.5 rounded-md bg-purple-500/40 text-white border border-purple-500/50 hover:bg-purple-500/60 transition-all duration-300 shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                      >
                        Live Demo
                      </Link>
                      <Link
                        href={`${project.link}/code`}
                        className="flex-1 text-center text-sm px-4 py-1.5 rounded-md bg-blue-500/40 text-white border border-blue-500/50 hover:bg-blue-500/60 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      >
                        Source Code
                      </Link>
                    </div>
                  </div>
                </div>
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-blue-500 text-xs px-3 py-1 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)] border border-white/20">
                    Featured
                  </div>
                )}
                {/* Easter egg notification with animation */}
                {foundEasterEggs.has(project.title.toLowerCase().replace(/\s+/g, '')) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={easterEggAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-3 left-3 bg-purple-500/80 text-white px-3 py-1 rounded-full text-sm"
                  >
                    🎉 Easter Egg Found!
                  </motion.div>
                )}
                
                {/* Hint for NFT Easter egg */}
                {project.title === "NFT Marketplace Design" && (
                  <div className="absolute bottom-20 left-3 text-xs text-purple-300/60 text-center">
                    Hint: Click me 3 times!
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Enhanced "Coming Soon" Section with loading animation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto mb-16"
      >
        <div className="relative overflow-hidden rounded-xl p-8 border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm shadow-[0_0_30px_rgba(147,51,234,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              New Projects Coming Soon
            </h2>
            <p className="text-lg text-purple-200/80 mb-6">
              Stay tuned for exciting new projects! Follow me on social media for updates.
            </p>
            <div className="flex items-center gap-4">
              <button className="px-6 py-2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center gap-2">
                Follow Updates
                <LoadingDots />
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
} 