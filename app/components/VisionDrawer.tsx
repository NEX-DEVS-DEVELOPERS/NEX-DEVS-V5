'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { audiowide, vt323 } from '@/app/utils/fonts'

const VisionDrawer = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDrawer = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Drawer Button - Attached to Left Screen Edge */}
      <motion.button
        onClick={toggleDrawer}
        className={`fixed top-1/2 left-0 transform -translate-y-1/2 z-50 ${
          isOpen ? 'translate-x-[45vw] md:translate-x-[40vw]' : 'translate-x-0'
        } transition-transform duration-500 ease-out-expo`}
        initial={{ opacity: 0, x: -50, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          delay: 0.3, 
          duration: 0.8,
          type: "spring",
          stiffness: 120,
          damping: 15
        }}
        whileHover={{ 
          scale: 1.08,
          x: 12,
          transition: { duration: 0.25, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative group">
          {/* Enhanced neon glow effect */}
          <div className="absolute inset-0 bg-cyan-400/40 rounded-r-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gray-900/90 rounded-r-xl blur-sm opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Main button container - wider and more polished with frosted black */}
          <div className="relative bg-black/80 backdrop-blur-xl border-2 border-cyan-400/70 border-l-0 rounded-r-xl px-8 py-4 flex items-center gap-4 hover:border-cyan-300/90 hover:shadow-xl hover:shadow-cyan-400/25 transition-all duration-300 min-w-[160px] shadow-lg shadow-black/50">
            {/* Animated arrow icon */}
            <motion.div
              animate={{ 
                rotate: isOpen ? 180 : 0,
                x: isOpen ? 2 : 0
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <svg 
                className="w-5 h-5 text-cyan-300 group-hover:text-cyan-100 transition-colors duration-300 drop-shadow-sm" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </motion.div>
            
            {/* Text with enhanced styling - wider and more prominent */}
            <motion.span 
              className={`text-cyan-100 font-bold text-sm tracking-widest ${audiowide.className} group-hover:text-white transition-colors duration-300 drop-shadow-sm`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              NEX-STACK
            </motion.span>
          </div>
        </div>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={toggleDrawer}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 22, 
              stiffness: 180,
              duration: 0.6,
              opacity: { duration: 0.4 }
            }}
            className="fixed left-0 top-20 bottom-0 w-[45vw] md:w-[40vw] z-50"
          >
            <div className="h-full bg-black/80 backdrop-blur-xl border-r-2 border-cyan-400/60 overflow-hidden rounded-r-2xl shadow-2xl shadow-cyan-400/15">
              {/* Header */}
              <div className="p-6 border-b border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-2xl font-bold text-white mb-2 ${audiowide.className}`}>
                      Tech Stack & Capabilities
                    </h2>
                    <p className="text-gray-300 text-sm">
                      Technologies, AI Solutions & Security Standards
                    </p>
                  </div>
                  <button
                    onClick={toggleDrawer}
                    className="p-2 rounded-xl bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 transition-colors duration-200"
                  >
                    <svg 
                      className="w-5 h-5 text-gray-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12" 
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Scrollable Content - 60fps optimized with smooth scrolling */}
              <div className="h-full overflow-y-auto smooth-scroll-optimized">
                <div className="p-6 space-y-8">
                  
                  {/* Development Capabilities Section */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className={`text-xl font-bold text-white ${audiowide.className}`}>
                          Development Capabilities
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        Delivering comprehensive solutions across web development, mobile applications, and artificial intelligence integration with enterprise-grade quality and performance.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {/* Web Development */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <h4 className="text-white font-semibold text-lg">Web Development</h4>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          Full-stack web applications using modern frameworks like Next.js, React, and TypeScript with responsive design and optimized performance.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                            <span>React & Next.js Applications</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                            <span>TypeScript Development</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                            <span>API Integration & Backend</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Applications */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="text-white font-semibold text-lg">Mobile Applications</h4>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          Cross-platform mobile solutions for iOS and Android with native performance, intuitive user interfaces, and seamless user experiences.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                            <span>React Native Development</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                            <span>iOS & Android Deployment</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                            <span>Native Performance Optimization</span>
                          </div>
                        </div>
                      </div>

                      {/* AI Integration */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h4 className="text-white font-semibold text-lg">AI Integration</h4>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          Advanced artificial intelligence solutions including natural language processing, retrieval-augmented generation, and intelligent automation systems.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                            <span>RAG & Vector Databases</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                            <span>NLP & Language Models</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                            <span>Workflow Automation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Technical Specifications */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <h3 className={`text-xl font-bold text-white ${audiowide.className}`}>
                          Technical Specifications
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* AI & Machine Learning */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className="text-white font-semibold mb-4 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          AI & Machine Learning
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-gray-300 font-medium mb-2 text-sm">Retrieval-Augmented Generation (RAG)</h5>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              Implementation of RAG systems using vector embeddings, semantic search, and knowledge retrieval for enhanced AI responses.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-gray-300 font-medium mb-2 text-sm">Natural Language Processing</h5>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              Advanced NLP solutions including sentiment analysis, text classification, and conversational AI interfaces.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-gray-300 font-medium mb-2 text-sm">Vector Databases</h5>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              Integration with vector databases like Pinecone, Weaviate, and Chroma for efficient similarity search.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Automation & Integration */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className="text-white font-semibold mb-4 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          Automation & Integration
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-gray-300 font-medium mb-2 text-sm">Workflow Automation</h5>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              Intelligent automation solutions for business processes, data pipelines, and decision-making workflows.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-gray-300 font-medium mb-2 text-sm">API Development & Integration</h5>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              RESTful and GraphQL APIs with real-time capabilities and microservices architecture.
                            </p>
                          </div>
                          <div>
                            <h5 className="text-gray-300 font-medium mb-2 text-sm">Data Processing & Analytics</h5>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              Real-time data processing, ETL pipelines, and predictive analytics with machine learning models.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Cutting-Edge Technologies */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h3 className={`text-xl font-bold text-white ${audiowide.className}`}>
                          Cutting-Edge Technologies
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Frontend */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className={`text-lg font-semibold text-purple-400 mb-3 ${audiowide.className}`}>Frontend</h4>
                        <ul className={`space-y-2 text-gray-300 text-sm ${vt323.className}`}>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                            React & Next.js
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                            TypeScript
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                            Tailwind CSS
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                            Framer Motion
                          </li>
                        </ul>
                      </div>

                      {/* Backend */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className={`text-lg font-semibold text-blue-400 mb-3 ${audiowide.className}`}>Backend</h4>
                        <ul className={`space-y-2 text-gray-300 text-sm ${vt323.className}`}>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                            Node.js & Express
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                            Python & Django
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                            PostgreSQL & MongoDB
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                            Redis & Prisma
                          </li>
                        </ul>
                      </div>

                      {/* Cloud & DevOps */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className={`text-lg font-semibold text-green-400 mb-3 ${audiowide.className}`}>Cloud & DevOps</h4>
                        <ul className={`space-y-2 text-gray-300 text-sm ${vt323.className}`}>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                            AWS & Vercel
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                            Docker & Kubernetes
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                            CI/CD Pipelines
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                            Monitoring & Analytics
                          </li>
                        </ul>
                      </div>

                      {/* AI & Tools */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className={`text-lg font-semibold text-orange-400 mb-3 ${audiowide.className}`}>AI & Tools</h4>
                        <ul className={`space-y-2 text-gray-300 text-sm ${vt323.className}`}>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3"></div>
                            OpenAI Integration
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3"></div>
                            Machine Learning
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3"></div>
                            Design Systems
                          </li>
                          <li className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-3"></div>
                            Performance Optimization
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.section>

                  {/* Advanced AI & Machine Learning */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className={`text-xl font-bold text-white ${audiowide.className}`}>
                          Advanced AI & Machine Learning
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Custom ML Models */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className="text-white font-semibold text-lg mb-3">Custom ML Models</h4>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          Development and deployment of custom machine learning models including computer vision, predictive analytics, and deep learning solutions.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></div>
                            <span>TensorFlow & PyTorch Integration</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></div>
                            <span>Computer Vision & Image Recognition</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Enterprise Security & Compliance */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h3 className={`text-xl font-bold text-white ${audiowide.className}`}>
                          Enterprise Security & Compliance
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* SOC 2 & Compliance */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className="text-white font-semibold text-lg mb-3">SOC 2 & Regulatory Compliance</h4>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          Implementation of SOC 2 Type II controls, GDPR compliance, HIPAA security measures, and enterprise-grade security protocols.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></div>
                            <span>SOC 2 Type II Implementation</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-red-400 rounded-full mr-3"></div>
                            <span>GDPR & CCPA Compliance</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Intelligent Automation */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <div className="mb-6">
                      <h3 className={`text-xl font-bold text-white ${audiowide.className}`}>
                        Intelligent Automation Systems
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {/* RPA & Process Automation */}
                      <div className="bg-gray-900/40 border border-gray-600/50 rounded-2xl p-4">
                        <h4 className="text-white font-semibold text-lg mb-3">RPA & Business Process Automation</h4>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                            <span>Document Processing & OCR</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3"></div>
                            <span>Workflow Orchestration</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Bottom Padding for Scroll - Increased for better visibility */}
                  <div className="h-20"></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles - 60fps optimized with smooth scrolling */}
      <style jsx global>{`
        .smooth-scroll-optimized {
          scrollbar-width: thin;
          scrollbar-color: rgba(75, 85, 99, 0.5) transparent;
          overflow-y: auto;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          will-change: scroll-position;
          transform: translateZ(0);
          backface-visibility: hidden;
          scroll-snap-type: y proximity;
          overscroll-behavior: contain;
        }
        
        .smooth-scroll-optimized::-webkit-scrollbar {
          width: 8px;
        }
        
        .smooth-scroll-optimized::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        .smooth-scroll-optimized::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(75, 85, 99, 0.6), rgba(107, 114, 128, 0.8));
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
          transition: all 0.3s ease;
        }
        
        .smooth-scroll-optimized::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(107, 114, 128, 0.8), rgba(156, 163, 175, 0.9));
          transform: scaleY(1.1);
        }
        
        .ease-out-expo {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .gpu-optimized {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform;
        }
      `}</style>
    </>
  )
}

export default VisionDrawer