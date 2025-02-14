'use client'

import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useState } from 'react'
import { useEasterEggs } from '@/context/EasterEggContext'
import Link from 'next/link'
import { FiCode, FiLayout, FiShoppingBag, FiDatabase, FiSmartphone, FiChevronDown, FiChevronUp } from 'react-icons/fi'

// Testimonial type definition
type Testimonial = {
  id: number
  name: string
  role: string
  company: string
  content: string
  image: string
}

// Sample testimonials data
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "JUNAID KHAN",
    role: "CEO",
    company: "TechCorp",
    content: "Working with this developer was an absolute pleasure. Their attention to detail and creative solutions exceeded our expectations. The final product was exactly what we needed and more.",
    image: "/testimonials/john.jpg"
  },
  {
    id: 2,
    name: "ALI IMRAN",
    role: "Product Manager",
    company: "InnovateLabs",
    content: "The web application developed for us is not only beautiful but also highly functional. The attention to user experience and performance optimization really sets this work apart.",
    image: "/testimonials/sarah.jpg"
  },
  {
    id: 3,
    name: "MUNEEB AHMAD",
    role: "CTO",
    company: "DigitalFirst",
    content: "Exceptional work on our e-commerce platform. The implementation of modern technologies and best practices has significantly improved our conversion rates.",
    image: "/testimonials/michael.jpg"
  }
]

// Project type definition
type Project = {
  id: number
  title: string
  description: string
  icon: any
  technologies: string[]
  metrics: string[]
  link: string
  detailedInfo: {
    challenge: string
    solution: string
    features: string[]
    technicalDetails: string[]
    results: string[]
  }
}

// Enhanced featured projects data with detailed information
const featuredProjects: Project[] = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce solution built with Next.js and Shopify. Features include real-time inventory management, AI-powered recommendations, and seamless payment integration.",
    icon: FiShoppingBag,
    technologies: ["Next.js", "Shopify", "Tailwind CSS", "TypeScript"],
    metrics: ["50% faster loading", "35% higher conversion", "99.9% uptime"],
    link: "/projects/ecommerce",
    detailedInfo: {
      challenge: "The client needed a scalable e-commerce solution that could handle high traffic and provide personalized shopping experiences.",
      solution: "Implemented a headless Shopify architecture with Next.js frontend, featuring:",
      features: [
        "AI-powered product recommendations using machine learning",
        "Real-time inventory synchronization across multiple warehouses",
        "Custom checkout flow optimized for conversion",
        "Advanced analytics dashboard for business insights",
        "Mobile-first responsive design with PWA capabilities"
      ],
      technicalDetails: [
        "Server-side rendering for optimal performance",
        "Redis caching layer for fast data retrieval",
        "Elasticsearch for advanced product search",
        "WebSocket integration for real-time updates",
        "CI/CD pipeline with automated testing"
      ],
      results: [
        "Increased mobile conversion rate by 35%",
        "Reduced page load time by 50%",
        "Improved customer engagement by 40%",
        "Achieved 99.9% uptime during peak seasons"
      ]
    }
  },
  {
    id: 2,
    title: "Portfolio Platform",
    description: "A creative portfolio platform with interactive elements and dynamic content loading. Built with modern web technologies for optimal performance.",
    icon: FiLayout,
    technologies: ["React", "Framer Motion", "Three.js", "TypeScript"],
    metrics: ["Perfect Lighthouse score", "2s average load time", "60fps animations"],
    link: "/projects/portfolio",
    detailedInfo: {
      challenge: "The client needed a portfolio platform that could showcase their creative projects effectively.",
      solution: "Developed a React-based portfolio platform with Framer Motion for smooth animations and Three.js for 3D effects.",
      features: [
        "Interactive portfolio elements",
        "Dynamic content loading",
        "3D project visualization",
        "Responsive design",
        "SEO optimization"
      ],
      technicalDetails: [
        "React for frontend development",
        "Framer Motion for animations",
        "Three.js for 3D effects",
        "Tailwind CSS for styling",
        "SEO optimization"
      ],
      results: [
        "Improved project visibility",
        "Increased engagement",
        "Enhanced user experience",
        "SEO ranking improvement"
      ]
    }
  },
  {
    id: 3,
    title: "Mobile App Backend",
    description: "Scalable backend infrastructure for a fitness tracking mobile app. Handles real-time data synchronization and analytics.",
    icon: FiDatabase,
    technologies: ["Node.js", "MongoDB", "WebSocket", "AWS"],
    metrics: ["1M+ daily requests", "50ms response time", "Zero downtime deployment"],
    link: "/projects/backend",
    detailedInfo: {
      challenge: "The client needed a scalable backend infrastructure for a fitness tracking mobile app.",
      solution: "Developed a Node.js backend using MongoDB for data storage and WebSocket for real-time data synchronization.",
      features: [
        "Scalable architecture",
        "Real-time data synchronization",
        "Data storage using MongoDB",
        "WebSocket integration",
        "AWS deployment"
      ],
      technicalDetails: [
        "Node.js backend development",
        "MongoDB for data storage",
        "WebSocket for real-time data synchronization",
        "AWS deployment",
        "CI/CD pipeline with automated testing"
      ],
      results: [
        "Improved data synchronization",
        "Reduced response time",
        "Achieved zero downtime deployment",
        "Increased daily requests"
      ]
    }
  },
  {
    id: 4,
    title: "React Native App",
    description: "Cross-platform mobile application with offline capabilities and smooth animations. Features include biometric authentication and push notifications.",
    icon: FiSmartphone,
    technologies: ["React Native", "Redux", "Firebase", "Jest"],
    metrics: ["4.8★ App Store rating", "100k+ downloads", "98% crash-free sessions"],
    link: "/projects/mobile",
    detailedInfo: {
      challenge: "The client needed a cross-platform mobile application with offline capabilities and smooth animations.",
      solution: "Developed a React Native application using Redux for state management and Firebase for authentication.",
      features: [
        "Cross-platform compatibility",
        "Offline capabilities",
        "Smooth animations",
        "Biometric authentication",
        "Push notifications"
      ],
      technicalDetails: [
        "React Native for cross-platform development",
        "Redux for state management",
        "Firebase for authentication and real-time database",
        "Jest for testing",
        "CI/CD pipeline with automated testing"
      ],
      results: [
        "Increased app downloads",
        "Improved user experience",
        "Reduced crash rate",
        "Achieved high App Store rating"
      ]
    }
  }
]

// Work process details
const workProcess = [
  {
    phase: "Discovery",
    description: "Deep dive into your business needs and project requirements. We analyze market trends, user behavior, and technical constraints to create a solid foundation.",
    steps: [
      "Initial consultation",
      "Requirements gathering",
      "Market research",
      "Technical feasibility analysis"
    ]
  },
  {
    phase: "Development",
    description: "Building your solution using cutting-edge technologies and best practices. Focused on creating scalable, maintainable, and high-performance applications.",
    steps: [
      "Architecture planning",
      "Agile development",
      "Regular code reviews",
      "Continuous integration"
    ]
  },
  {
    phase: "Delivery",
    description: "Thorough testing and optimization before launch. Ensuring a smooth deployment and providing ongoing support for your success.",
    steps: [
      "Quality assurance",
      "Performance optimization",
      "Deployment strategy",
      "Post-launch support"
    ]
  }
]

export default function WorkPage() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const { addEasterEgg } = useEasterEggs()
  const [clickCount, setClickCount] = useState(0)
  const statsControls = useAnimation()
  const [lastClickedStat, setLastClickedStat] = useState<string | null>(null)

  const handleSecretClick = () => {
    setClickCount(prev => {
      if (prev + 1 === 5) {
        addEasterEgg('work-achievement')
        return 0
      }
      return prev + 1
    })
  }

  const toggleProject = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  // Simplified Easter egg handler for stats
  const handleStatClick = (label: string) => {
    // Trigger the easter egg immediately on click
    setLastClickedStat(label)
    
    // Enhanced animation sequence
    statsControls.start({
      scale: [1, 1.3, 0.9, 1.1, 1],
      rotate: [0, 15, -15, 10, 0],
      transition: { 
        duration: 1,
        ease: "easeInOut"
      }
    }).then(() => {
      // Add Easter egg after animation
      addEasterEgg('stats-master')
    })

    // Trigger a background flash effect
    document.body.style.backgroundColor = '#1a0033'
    setTimeout(() => {
      document.body.style.backgroundColor = '#000000'
    }, 300)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-700/5 rounded-full blur-[150px] animate-pulse delay-500" />
      </div>

      <div className="relative pt-24 px-6 backdrop-blur-sm">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <div className="inline-block bg-purple-500/10 text-purple-300 px-4 py-1 rounded-full mb-4 backdrop-blur-sm border border-purple-500/20">
            MY WORK
          </div>
          <h1 className="text-5xl font-bold mb-6 text-center">
            Crafting Digital <span className="inline-block bg-white text-black px-3 py-1 rounded-md">Excellence</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl">
            Transforming ideas into exceptional digital experiences. Explore my portfolio of successful projects and discover how I can help bring your vision to life.
          </p>
        </motion.section>

        {/* Enhanced Featured Projects Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="relative overflow-hidden rounded-xl bg-white/5 border border-purple-500/10 backdrop-blur-sm hover:border-purple-500/20 transition-colors"
                onHoverStart={() => setHoveredProject(project.id)}
                onHoverEnd={() => setHoveredProject(null)}
                onClick={handleSecretClick}
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <project.icon className="w-8 h-8 text-purple-400" />
                    <h3 className="text-2xl font-bold">{project.title}</h3>
                  </div>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 bg-purple-500/10 rounded-full text-purple-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {project.metrics.map((metric, index) => (
                        <div key={index} className="text-sm text-gray-400">
                          • {metric}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Read More Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleProject(project.id)
                    }}
                    className="flex items-center gap-2 mt-4 text-purple-400 hover:text-purple-300 transition-colors group"
                  >
                    <span>Read More</span>
                    {expandedProject === project.id ? (
                      <FiChevronUp className="transition-transform group-hover:-translate-y-1" />
                    ) : (
                      <FiChevronDown className="transition-transform group-hover:translate-y-1" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedProject === project.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2 }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-4 border-t border-purple-500/20">
                          <motion.div 
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/10">
                              <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                Challenge
                              </h4>
                              <p className="text-gray-400">{project.detailedInfo.challenge}</p>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                Solution
                              </h4>
                              <p className="text-gray-400">{project.detailedInfo.solution}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                {project.detailedInfo.features.map((feature, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-2 text-gray-400 bg-purple-500/5 p-2 rounded-lg"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 flex-shrink-0" />
                                    <span className="text-sm">{feature}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                  Technical Details
                                </h4>
                                <div className="space-y-2">
                                  {project.detailedInfo.technicalDetails.map((detail, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center gap-2 text-gray-400 bg-purple-500/5 p-2 rounded-lg"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 flex-shrink-0" />
                                      <span className="text-sm">{detail}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <h4 className="text-purple-300 font-semibold flex items-center gap-2">
                                  <span className="w-1 h-1 rounded-full bg-purple-500"></span>
                                  Key Results
                                </h4>
                                <div className="space-y-2">
                                  {project.detailedInfo.results.map((result, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center gap-2 text-gray-400 bg-purple-500/5 p-2 rounded-lg"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 flex-shrink-0" />
                                      <span className="text-sm">{result}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/projects" 
              className="inline-block px-8 py-3 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors border border-purple-500/20 hover:border-purple-500/30 text-purple-300"
            >
              View All Projects →
            </Link>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold mb-8">Client Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 border-2 border-purple-500/20"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-purple-300">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-300 italic">{testimonial.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Work Process Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <h2 className="text-3xl font-bold mb-8">Work Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workProcess.map((phase, index) => (
              <motion.div
                key={phase.phase}
                className="bg-white/5 p-6 rounded-xl backdrop-blur-sm border border-purple-500/10 hover:border-purple-500/20 transition-colors"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <h3 className="text-xl font-bold mb-4 text-purple-300">{phase.phase}</h3>
                <p className="text-gray-300 mb-4">{phase.description}</p>
                <ul className="space-y-2">
                  {phase.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-center gap-2 text-gray-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-7xl mx-auto mb-20"
        >
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            animate={statsControls}
          >
            {[
              { label: "Projects Completed", value: "50+" },
              { label: "Happy Clients", value: "30+" },
              { label: "Years Experience", value: "5+" },
              { label: "Technologies", value: "15+" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`text-center p-6 rounded-xl backdrop-blur-sm cursor-pointer
                  ${lastClickedStat === stat.label 
                    ? 'bg-purple-500/30 border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                    : 'bg-white/5 border-purple-500/10'} 
                  border hover:border-purple-500/30 transition-all duration-500`}
                whileHover={{ 
                  y: -8, 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleStatClick(stat.label)}
              >
                <motion.h4 
                  className="text-5xl font-bold bg-gradient-to-r from-white via-purple-300 to-purple-500 bg-clip-text text-transparent mb-3"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {stat.value}
                </motion.h4>
                <p className="text-gray-200 font-semibold">{stat.label}</p>
                {lastClickedStat === stat.label && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: [0, 1.5, 1],
                        rotate: [0, 360, 720]
                      }}
                      transition={{ duration: 1 }}
                      className="absolute top-2 right-2 w-4 h-4 rounded-full bg-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                    />
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 border-2 border-purple-400/30 rounded-xl"
                    />
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
          
          {/* Easter Egg Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 1 }}
            className="text-center text-lg text-purple-300 mt-6 italic font-bold"
          >
            ✨ Click a stat to reveal something magical! ✨
          </motion.p>
        </motion.section>
      </div>
    </div>
  )
} 