'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies: string[]
  link: string
  category: string
  showcase_location?: string
}

export default function AISolutionsShowcase() {
  const [aiProjects, setAiProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [expandedTechnology, setExpandedTechnology] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [projectsPerPage] = useState(5) // Show 5 projects per page

  useEffect(() => {
    fetchAIProjects()
  }, [])

  const fetchAIProjects = async () => {
    try {
      const response = await fetch('/api/projects?showcase_location=ai_solutions')
      if (response.ok) {
        const data = await response.json()
        
        const aiFiltered = data.filter((project: Project) => 
          project.showcase_location === 'ai_solutions' || 
          project.category?.toLowerCase().includes('ai') || 
          project.category?.toLowerCase().includes('ml') ||
          project.title?.toLowerCase().includes('ai') ||
          project.description?.toLowerCase().includes('artificial intelligence') ||
          project.description?.toLowerCase().includes('machine learning')
        )
        
        setAiProjects(aiFiltered)
      }
    } catch (error) {
      console.error('Error fetching AI projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { 
      id: 'all', 
      name: 'All Solutions', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      )
    },
    { 
      id: 'ml', 
      name: 'Machine Learning', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'nlp', 
      name: 'NLP & RAG', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      id: 'vision', 
      name: 'Computer Vision', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    { 
      id: 'automation', 
      name: 'AI Automation', 
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  const aiTechnologies = [
    {
      title: 'Machine Learning',
      category: 'ML',
      description: 'Transform raw data into intelligent insights through predictive models and automated decision-making systems.',
      detailedDescription: [
        'Build predictive models that learn from your data patterns to forecast trends, customer behavior, and business outcomes with high accuracy.',
        'Implement automated classification systems for image recognition, text analysis, and data categorization to streamline operations.',
        'Deploy real-time recommendation engines that personalize user experiences and increase engagement through intelligent content delivery.',
        'Create anomaly detection systems that monitor your processes 24/7, identifying unusual patterns before they become critical issues.',
        'Optimize business processes through intelligent automation that adapts and improves performance based on historical data.',
        'Develop custom neural networks tailored to your specific industry needs, from financial risk assessment to medical diagnosis.'
      ],
      nexDevUsage: [
        'Integrate TensorFlow.js for client-side ML inference without server round-trips',
        'Use Next.js API routes to serve ML models with edge computing capabilities',
        'Implement real-time data streaming with WebSockets for live ML predictions',
        'Deploy serverless ML functions using Vercel Edge Functions for global performance'
      ],
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      features: ['Predictive Analytics', 'Pattern Recognition', 'Automated Decision Making', 'Real-time Processing'],
      technologies: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'XGBoost'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'NLP & RAG',
      category: 'NLP',
      description: 'Enable machines to understand, interpret, and generate human language with context-aware intelligence.',
      detailedDescription: [
        'Build intelligent chatbots and virtual assistants that understand natural language and provide contextually relevant responses.',
        'Implement document analysis systems that extract key information, summarize content, and answer questions from large text datasets.',
        'Create semantic search engines that understand user intent beyond keywords, delivering more accurate and relevant results.',
        'Develop multilingual translation systems that preserve context and meaning across different languages and cultural nuances.',
        'Deploy sentiment analysis tools to understand customer emotions and feedback from social media, reviews, and communications.',
        'Build knowledge retrieval systems that combine your documents with AI to provide instant, accurate answers to complex queries.'
      ],
      nexDevUsage: [
        'Integrate OpenAI API with Next.js for real-time chat interfaces and content generation',
        'Use Pinecone vector database with Next.js to build semantic search applications',
        'Implement streaming responses for better UX in conversational AI applications',
        'Deploy RAG systems using Next.js middleware for intelligent document querying'
      ],
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      features: ['Natural Language Understanding', 'Document Q&A', 'Semantic Search', 'Content Generation'],
      technologies: ['OpenAI GPT', 'LangChain', 'Pinecone', 'Hugging Face'],
      color: 'from-green-500 to-blue-600'
    },
    {
      title: 'Computer Vision',
      category: 'CV',
      description: 'Give machines the power to see, understand, and interpret visual information from the world around us.',
      detailedDescription: [
        'Develop object detection and recognition systems that identify and classify items in real-time video streams or static images.',
        'Create facial recognition and biometric systems for security, authentication, and personalized user experiences.',
        'Build quality control systems for manufacturing that automatically detect defects and ensure product standards.',
        'Implement medical imaging analysis tools that assist healthcare professionals in diagnosis and treatment planning.',
        'Deploy autonomous navigation systems for robotics and vehicles using real-time visual processing and decision making.',
        'Create augmented reality applications that overlay digital information onto the physical world through camera feeds.'
      ],
      nexDevUsage: [
        'Use Next.js with MediaPipe for real-time computer vision in web browsers',
        'Implement WebRTC for live video processing and analysis in Next.js applications',
        'Deploy TensorFlow.js models for client-side image recognition without server dependencies',
        'Build progressive web apps with camera access for mobile computer vision applications'
      ],
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      features: ['Object Detection', 'Image Recognition', 'Real-time Analysis', 'AR Integration'],
      technologies: ['OpenCV', 'YOLO', 'MediaPipe', 'TensorFlow Vision'],
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'AI Agent Orchestration',
      category: 'AGENTS',
      description: 'Create intelligent autonomous agents that work together to solve complex tasks and automate workflows.',
      detailedDescription: [
        'Build multi-agent systems where specialized AI agents collaborate to handle complex business processes and decision-making.',
        'Create intelligent workflow automation that adapts to changing conditions and optimizes processes in real-time.',
        'Develop autonomous customer service agents that can handle inquiries, escalate issues, and learn from interactions.',
        'Implement smart scheduling and resource management systems that coordinate tasks across teams and departments.',
        'Deploy intelligent monitoring agents that watch your systems, predict issues, and take corrective actions automatically.',
        'Build AI assistants that can use tools, access databases, and coordinate with other systems to complete complex tasks.'
      ],
      nexDevUsage: [
        'Use Next.js API routes to orchestrate multiple AI agents and coordinate their responses',
        'Implement WebSocket connections for real-time agent communication and status updates',
        'Deploy agent workflows using Next.js serverless functions for scalable automation',
        'Build agent dashboards with Next.js for monitoring and controlling AI agent activities'
      ],
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      features: ['Multi-Agent Systems', 'Workflow Automation', 'Intelligent Coordination', 'Adaptive Learning'],
      technologies: ['LangChain', 'CrewAI', 'AutoGen', 'LangGraph'],
      color: 'from-orange-500 to-red-600'
    }
  ]

  const filteredProjects = selectedCategory === 'all' 
    ? aiProjects 
    : aiProjects.filter(project => {
        const category = selectedCategory.toLowerCase()
        return project.category?.toLowerCase().includes(category) ||
               project.title?.toLowerCase().includes(category) ||
               project.description?.toLowerCase().includes(category)
      })

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const startIndex = (currentPage - 1) * projectsPerPage
  const endIndex = startIndex + projectsPerPage
  const currentProjects = filteredProjects.slice(startIndex, endIndex)

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const toggleProjectExpansion = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  const toggleTechnologyExpansion = (category: string) => {
    setExpandedTechnology(expandedTechnology === category ? null : category)
  }

  if (isLoading) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-gray-800 h-8 w-64 mx-auto mb-4 rounded" />
            <div className="animate-pulse bg-gray-800 h-4 w-96 mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-800 h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (aiProjects.length === 0) {
    return (
      <section className="py-20 px-4 bg-black relative overflow-hidden">
        {/* Modern Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-2 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90 w-96 h-2 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🤖</span>
            </div>
            <span className="px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/10">
              AI Solutions Hub
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Intelligent Systems & AI Solutions
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
            Advanced AI solutions are currently in development. Stay tuned for cutting-edge implementations.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-black">
      {/* Modern Background Effects */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        {/* Floating Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Neural Network Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="url(#neuralGradient)" strokeWidth="1" className="animate-pulse" />
          <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="url(#neuralGradient)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }} />
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <span className="px-6 py-2 bg-purple-600/20 backdrop-blur-sm text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
              Next-Gen AI Solutions
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: 'Audiowide, monospace' }}>
            Intelligent Systems &
            <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Solutions
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
            Transforming businesses with cutting-edge artificial intelligence, advanced RAG systems, 
            and intelligent automation solutions that drive innovation and efficiency.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 border border-gray-700 hover:border-purple-500/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                selectedCategory === category.id
                  ? 'bg-white/20'
                  : 'bg-purple-600/20'
              }`}>
                {category.icon}
              </div>
              {category.name}
            </button>
          ))}
        </div>

        {/* AI Projects - Professional Horizontal Layout */}
        <div className="space-y-5 mb-12">
          {currentProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative"
            >
              <div className="bg-black rounded-3xl border border-gray-800/50 overflow-hidden hover:border-purple-500/50 transition-all duration-500 shadow-2xl">
                <div className="flex flex-col lg:flex-row min-h-[320px]">
                  {/* Project Image - Left Side (40%) */}
                  <div className="lg:w-[40%] relative">
                    <div className="relative h-64 lg:h-full overflow-hidden rounded-l-3xl">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/60" />
                      
                      {/* AI Badge - Modern Design */}
                      <div className="absolute top-6 left-6">
                        <div className="flex items-center gap-2 bg-purple-600 rounded-full px-4 py-2 shadow-xl border border-purple-400/30">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-white text-xs font-bold tracking-wide">AI POWERED</span>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-6 right-6">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-gray-700">
                          <span className="text-purple-300 text-xs font-medium">{project.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Details - Right Side (60%) */}
                  <div className="lg:w-[60%] p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="mb-6">
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-gray-300 text-base leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                      
                      {/* Technologies - Enhanced Design */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wider">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-purple-600/10 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-600/20 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Professional Design */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => toggleProjectExpansion(project.id)}
                        className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-600/25"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {expandedProject === project.id ? 'Hide AI Details' : 'AI Details'}
                      </button>
                      <Link
                        href={`/projects/${project.id}`}
                        className="bg-gray-800/80 text-white py-3 px-6 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Project
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Collapsible Project Details with Smooth 60fps Animation */}
                <AnimatePresence mode="wait">
                  {expandedProject === project.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.98 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto', 
                        scale: 1,
                        transition: {
                          duration: 0.6,
                          ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic bezier for smooth 60fps
                          opacity: { duration: 0.4 },
                          height: { duration: 0.6 },
                          scale: { duration: 0.5, delay: 0.1 }
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0, 
                        scale: 0.98,
                        transition: {
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          opacity: { duration: 0.3 },
                          height: { duration: 0.5, delay: 0.1 },
                          scale: { duration: 0.4 }
                        }
                      }}
                      style={{ overflow: 'hidden' }}
                      className="border-t border-gray-800 bg-black will-change-transform"
                    >
                      <div className="p-6 lg:p-8">
                        {/* Project Implementation Details - Focused on Actual Projects */}
                        <div className="mb-6">
                          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            Project Implementation
                          </h4>
                          
                          {/* Project-Specific Details */}
                          <div className="bg-purple-600/5 rounded-xl p-5 border border-purple-500/20 mb-4">
                            <p className="text-gray-300 text-sm leading-relaxed mb-3">
                              <strong className="text-white">Real Project Implementation:</strong> This project demonstrates practical AI integration 
                              with modern web technologies, focusing on actual functionality over theoretical capabilities.
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs border border-green-500/30">Live Project</span>
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs border border-blue-500/30">Production Ready</span>
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs border border-purple-500/30">AI Integration</span>
                            </div>
                          </div>

                          {/* Key Implementation Features - Compact */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
                              <h5 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                                <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                Core AI Features
                              </h5>
                              <div className="space-y-1">
                                <div className="text-gray-300 text-xs flex items-center gap-2">
                                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                                  <span>Intelligent Processing</span>
                                </div>
                                <div className="text-gray-300 text-xs flex items-center gap-2">
                                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                                  <span>Real-time Responses</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
                              <h5 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                Performance
                              </h5>
                              <div className="space-y-1">
                                <div className="text-gray-300 text-xs flex items-center gap-2">
                                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                                  <span>Fast Response Time</span>
                                </div>
                                <div className="text-gray-300 text-xs flex items-center gap-2">
                                  <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                  <span>Scalable Architecture</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sleek Pagination System */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center mb-16">
            {/* Page Info */}
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} AI projects
              </p>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  currentPage === 1
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 hover:border-purple-500 transform hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, current page +/- 1, and last page
                  const showPage = 
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  
                  if (!showPage) {
                    // Show ellipsis
                    if (pageNum === 2 && currentPage > 3) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-500 text-sm">
                          ...
                        </span>
                      )
                    }
                    if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                      return (
                        <span key={pageNum} className="px-2 text-gray-500 text-sm">
                          ...
                        </span>
                      )
                    }
                    return null
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 transform scale-105'
                          : 'bg-gray-800/50 text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 border border-gray-700 hover:border-purple-500/50 transform hover:scale-105'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  currentPage === totalPages
                    ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                    : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 hover:border-purple-500 transform hover:scale-105'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Quick Jump to Pages */}
            {totalPages > 10 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-gray-400 text-xs">Jump to page:</span>
                <select
                  value={currentPage}
                  onChange={(e) => setCurrentPage(Number(e.target.value))}
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <option key={pageNum} value={pageNum}>
                      Page {pageNum}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        
        {/* Advanced AI Technologies - Focused on Top Essentials Only */}
        {aiProjects.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Audiowide, monospace' }}>
                Core AI Capabilities
              </h3>
              <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
                Essential AI technologies powering our project solutions. Focus on real implementations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiTechnologies.slice(0, 4).map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="group relative"
                >
                  <div className="bg-black rounded-2xl border border-gray-800/50 overflow-hidden hover:border-purple-500/50 transition-all duration-300 shadow-lg group-hover:shadow-purple-600/10">
                    {/* Compact Technology Card */}
                    <div className="p-6">
                      {/* Header with Icon */}
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300`}>
                          {tech.icon}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                          {tech.title}
                        </h4>
                        <p className="text-gray-400 text-sm leading-relaxed text-center">
                          {tech.description.split('.')[0]}.{/* Only first sentence */}
                        </p>
                      </div>
                      
                      {/* Essential Technologies Only */}
                      <div className="mb-4">
                        <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-2 text-center">Core Tech</div>
                        <div className="flex flex-wrap justify-center gap-1">
                          {tech.technologies.slice(0, 2).map((technology, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-600/10 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                              {technology}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {/* Quick Features */}
                      <div className="space-y-1">
                        {tech.features.slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-center gap-2 text-xs text-gray-300">
                            <div className="w-1 h-1 bg-purple-400 rounded-full flex-shrink-0" />
                            <span className="group-hover:text-white transition-colors text-center">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Compact Implementation Note */}
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm italic">
                Technologies integrated into our project solutions above
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
