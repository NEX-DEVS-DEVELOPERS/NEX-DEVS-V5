'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import BlogCard from '@/frontend/components/BlogCard'
import BlogTestimonial from '@/frontend/components/BlogTestimonial'
import { audiowide, vt323 } from '@/frontend/utils/fonts'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  slug: string
  category: string
  date: string
  datePublished: string
  readTime: string
  image: string
  author: string
  details: string[]
}

interface Testimonial {
  content: string
  author: string
  role: string
}

interface BlogPageClientProps {
  blogPosts: BlogPost[]
  testimonials: Testimonial[]
  loading: boolean
}

export default function BlogPageClient({ blogPosts, testimonials, loading }: BlogPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const [showEasterEgg, setShowEasterEgg] = useState(false)

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(blogPosts.map(post => post.category)))]

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = blogPosts

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredPosts(filtered)
  }, [searchTerm, selectedCategory, blogPosts])

  // Easter egg functionality
  useEffect(() => {
    const handleKeySequence = (e: KeyboardEvent) => {
      // Simple easter egg trigger
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        setShowEasterEgg(true)
        setTimeout(() => setShowEasterEgg(false), 3000)
      }
    }

    window.addEventListener('keydown', handleKeySequence)
    return () => window.removeEventListener('keydown', handleKeySequence)
  }, [])

  // Console easter egg
  useEffect(() => {
    console.log(`
    🎯 Hey curious developer! 
    
    Try running this in your console:
    btoa('unlock-the-matrix')
    
    Use the result as a CSS class on any element for a surprise! 🚀
    `)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      {/* Easter Egg Modal */}
      {showEasterEgg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-8 rounded-xl border border-purple-500/50 text-center max-w-md">
            <h3 className={`text-2xl font-bold text-white mb-4 ${audiowide.className}`}>
              🎉 Matrix Unlocked!
            </h3>
            <p className={`text-green-400 mb-4 ${vt323.className}`}>
              You found the secret! Welcome to the matrix, fellow developer.
            </p>
            <div className="text-green-300 font-mono text-sm">
              <div>01001000 01100101 01101100 01101100 01101111</div>
              <div>01010111 01101111 01110010 01101100 01100100</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search and Filter Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none ${vt323.className}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                } ${vt323.className}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center">
          <p className={`text-gray-400 text-sm ${vt323.className}`}>
            Showing {filteredPosts.length} of {blogPosts.length} articles
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
      </motion.section>

      {/* Interactive Blog Grid */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BlogCard {...post} />
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
              <h3 className={`text-xl font-semibold text-white mb-4 ${audiowide.className}`}>
                No articles found
              </h3>
              <p className={`text-gray-400 mb-4 ${vt323.className}`}>
                Try adjusting your search terms or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </motion.section>

      {/* Interactive Testimonials */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center ${audiowide.className}`}>
          Reader Testimonials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <BlogTestimonial {...testimonial} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Newsletter Signup */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8">
          <h3 className={`text-2xl font-bold text-white mb-4 ${audiowide.className}`}>
            Stay Updated
          </h3>
          <p className={`text-gray-300 mb-6 ${vt323.className}`}>
            Get notified when new articles are published. No spam, just quality content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-3 bg-white/5 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:border-purple-500/50 focus:outline-none ${vt323.className}`}
            />
            <button className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </motion.section>

      {/* Hidden Easter Egg Hint */}
      <div className="mt-8 text-center">
        <p className={`text-yellow-400/50 text-xs ${vt323.className}`}>
          💡 Hint: Try Ctrl+Shift+M for a surprise!
        </p>
      </div>
    </motion.div>
  )
}

