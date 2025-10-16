'use client'

import React from 'react'
import { motion } from 'framer-motion'

const AIFeatures = () => {
  const aiFeatures = [
    {
      title: "Intelligent User Analysis",
      description: "Our AI analyzes user behavior patterns to optimize conversion paths and improve engagement metrics.",
      icon: "👁️",
      color: "from-blue-600 to-cyan-400"
    },
    {
      title: "Smart Content Generation",
      description: "AI-powered content creation tools that help craft compelling copy that converts visitors to customers.",
      icon: "📝",
      color: "from-purple-600 to-pink-500"
    },
    {
      title: "Predictive Performance",
      description: "AI algorithms predict potential performance bottlenecks before they impact your users.",
      icon: "📊",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Adaptive Security",
      description: "AI-powered threat detection that evolves to protect against emerging security vulnerabilities.",
      icon: "🔒",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Personalization Engine",
      description: "Create dynamic user experiences that adapt in real-time based on user behavior and preferences.",
      icon: "🧩",
      color: "from-indigo-600 to-blue-600"
    },
    {
      title: "K-SHIGT Conversion System",
      description: "Our proprietary AI mechanism that has increased conversion rates by 55% for our clients.",
      icon: "🚀",
      color: "from-rose-500 to-red-600"
    }
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-2/3 right-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block relative mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI-Powered</span> Features
            </h2>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur rounded-lg -z-10"></div>
          </div>
          <p className="text-gray-400 max-w-3xl mx-auto">
            At NEX-DEVS, we leverage cutting-edge artificial intelligence to deliver superior digital experiences. Our AI-powered features give your business a competitive edge.
          </p>
        </motion.div>

        {/* AI Capabilities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6 bg-black/60 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/40 transition-all duration-500">
                <div className="mb-4">
                  <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r ${feature.color}`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
                
                {/* Pulsing indicator */}
                <div className="absolute top-4 right-4">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Stat Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 p-8 rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">NEX-DEVS AI Advantage</h3>
              <p className="text-gray-300 mb-6">
                Our proprietary AI technologies help businesses achieve significantly better results compared to traditional development approaches.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <p className="text-gray-400 text-sm">AI-optimized user flows that increase engagement</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <p className="text-gray-400 text-sm">Smart testing that identifies conversion barriers</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  </div>
                  <p className="text-gray-400 text-sm">Automated quality assurance with AI code review</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  </div>
                  <p className="text-gray-400 text-sm">Self-optimizing systems that improve over time</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-black/40 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                55%
              </div>
              <div className="text-xl text-white mb-1">Higher Conversion</div>
              <p className="text-sm text-gray-400 text-center">
                Average improvement in conversion rates with our AI-powered K-SHIGT mechanism
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AIFeatures 