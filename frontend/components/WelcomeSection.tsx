'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function WelcomeSection() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <motion.div 
        className="bg-black/50 backdrop-blur-sm border border-gray-600 rounded-xl shadow-lg text-white p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-bold text-purple-300">
          Welcome to <span className="text-purple-500">NEX-DEVS</span>
        </h1>

        <p className="text-base text-gray-300 mt-2">
          AI is the Future – and We're Here to Build It Together
        </p>

        <p className="text-sm text-gray-400 mt-1">
          Transform your digital presence with our <span className="text-cyan-400 underline">cutting-edge AI solutions</span>
        </p>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <motion.button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Services
            <span className="text-lg">→</span>
          </motion.button>
          
          <motion.button
            className="bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-900/20 px-4 py-2 rounded-lg flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Projects
            <span className="text-lg">→</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
} 