'use client'

import React from 'react'
import { motion } from 'framer-motion'

const flowchartItems = [
  {
    id: 'design',
    title: 'Design & Brand',
    iconFallback: '🎨',
    items: [
      'Strategic Brand Identity',
      'Clear Visual Messaging',
      'Unique Market Positioning',
      'Cohesive Design System'
    ]
  },
  {
    id: 'conversion',
    title: 'Conversion & Marketing',
    iconFallback: '📈',
    items: [
      'Optimized Sales Funnel',
      'High-Conversion Elements',
      'Psychological Triggers',
      'A/B Testing Framework'
    ]
  },
  {
    id: 'copywriting',
    title: 'Copywriting',
    iconFallback: '✍️',
    items: [
      'SEO-Optimized Content',
      'Conversion-Focused Copy',
      'Brand Voice & Storytelling',
      'Trust-Building Narratives'
    ]
  },
  {
    id: 'psychology',
    title: 'Laws & Psychology',
    iconFallback: '🧠',
    items: [
      'Design Psychology Principles',
      'Persuasive Copywriting',
      'Cognitive Bias Utilization',
      'Behavioral Economics'
    ]
  }
]

// Reduced centerBoxSize from 220 to 180
const boxSize = 180;
const centerBoxSize = 180;
const svgSize = 700; // Increased from 600 to 700 for more space
const center = svgSize / 2;
const offset = 240; // Increased from 200 to 240 for more space

const positions = [
  { x: center - offset, y: center - offset }, // Top Left
  { x: center + offset, y: center - offset }, // Top Right
  { x: center - offset, y: center + offset }, // Bottom Left
  { x: center + offset, y: center + offset }  // Bottom Right
];

// Comparison data
const comparisonData = [
  {
    nexdev: 'Top Experienced Team',
    others: 'Inexperienced Juniors',
    icon: '👥'
  },
  {
    nexdev: 'High-conversion, Sales & business growth approach',
    others: 'No focus on conversion, growth, & Sales',
    icon: '📈'
  },
  {
    nexdev: 'Use Proven NEX-SHFT Methodology',
    others: 'Old & typical',
    icon: '🛠️'
  },
  {
    nexdev: 'Lightning Fast Implementation',
    others: 'Slow Implementation',
    icon: '⚡'
  },
  {
    nexdev: 'World-class designer & dev team',
    others: 'Lack of Creativity & Implementation Power',
    icon: '🎨'
  },
  {
    nexdev: 'Planned & strategic approach',
    others: 'No Plan & Strategy',
    icon: '📝'
  },
  {
    nexdev: 'Always go for Extraordinary',
    others: 'Settle for Ordinary',
    icon: '🚀'
  }
];

const NexShiftFlowchart = () => {
  return (
    <div className="w-full flex flex-col items-center py-16 md:py-24">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-3xl md:text-4xl font-bold text-white mb-20"
      >
        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">NEX-SHFT</span> Methodology
      </motion.h2>

      <div className="relative" style={{ width: svgSize, height: svgSize, maxWidth: '100%' }}>
        {/* SVG Lines */}
        <svg width={svgSize} height={svgSize} className="absolute left-0 top-0 w-full h-full pointer-events-none z-10">
          {positions.map((pos, i) => (
            <motion.line
              key={i}
              x1={center}
              y1={center}
              x2={pos.x}
              y2={pos.y}
              stroke="url(#lineGradient)"
              strokeWidth="6" // Increased from 4 to 6
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
            />
          ))}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center NEX-SHFT Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="absolute z-20 flex items-center justify-center"
          style={{
            left: center - centerBoxSize / 2,
            top: center - centerBoxSize / 2,
            width: centerBoxSize,
            height: centerBoxSize
          }}
        >
          <div className="w-full h-full rounded-2xl border-2 border-purple-600 bg-black/90 backdrop-blur-lg flex justify-center items-center shadow-lg shadow-purple-500/20">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-center">NEX-SHFT</h3>
          </div>
        </motion.div>

        {/* Four Detail Boxes */}
        {flowchartItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
            className="absolute z-20 flex flex-col items-center"
            style={{
              left: positions[i].x - boxSize / 2,
              top: positions[i].y - boxSize / 2,
              width: boxSize,
              height: boxSize
            }}
          >
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-700/40 to-indigo-700/30 border border-purple-500/50 backdrop-blur-sm flex items-center justify-center mb-3 shadow-lg shadow-purple-500/10">
              <span className="text-3xl">{item.iconFallback}</span>
            </div>
            <h4 className="text-white text-center font-semibold text-lg mb-2">{item.title}</h4>
            <ul className="space-y-2 text-sm">
              {item.items.map((listItem, idx) => (
                <motion.li
                  key={idx}
                  className="flex items-center text-purple-200/90"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + (idx * 0.1) }}
                >
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mr-2"></span>
                  {listItem}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Methodology Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="max-w-3xl mx-auto mt-24 text-center px-4"
      >
        <p className="text-purple-200/80 leading-relaxed">
          Our NEX-SHFT methodology brings together four critical domains of expertise to create high-converting digital experiences. 
          By seamlessly integrating design, marketing psychology, strategic copywriting, and behavioral science principles, 
          we develop solutions that don't just look impressive — they deliver measurable business results.
        </p>
      </motion.div>

      {/* Agency Comparison Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="w-full max-w-5xl mx-auto mt-28 px-4"
      >
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">NeXDev</span> <span className="text-gray-300">vs</span> <span className="text-gray-400">Other Agencies</span>
        </h2>

        <div className="relative flex flex-col">
          {/* Column Headers */}
          <div className="grid grid-cols-2 mb-6">
            <div className="text-center md:text-right text-xl font-bold text-white px-4">
              NeXDev Solutions
            </div>
            <div className="text-center md:text-left text-xl font-bold text-gray-400 px-4">
              Other Agencies / Freelancers
            </div>
          </div>
          
          {/* VS Circle in Center */}
          <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-black/80 border-2 border-purple-500/70 text-purple-400 items-center justify-center font-bold shadow-lg shadow-purple-500/20">VS</div>
          
          {/* Decorative Line */}
          <div className="hidden md:block absolute left-1/2 top-12 bottom-0 w-px bg-gradient-to-b from-purple-500/20 via-purple-500/40 to-purple-500/10 transform -translate-x-1/2 z-0"></div>
          
          {/* Comparison Rows */}
          <div className="space-y-3">
            {comparisonData.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 relative">
                <motion.div 
                  className="flex items-center bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 md:flex-row-reverse shadow-md"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-700/40 to-indigo-700/30 flex items-center justify-center text-lg mr-0 md:ml-3 md:mr-0 flex-shrink-0 shadow-sm shadow-purple-500/20">
                    {item.icon}
                  </div>
                  <div className="flex-1 md:text-right ml-3 md:ml-0 md:mr-3">
                    <p className="text-white text-sm md:text-base">{item.nexdev}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center bg-black/40 backdrop-blur-sm border border-gray-800/50 rounded-lg p-3 shadow-md"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-900/80 flex items-center justify-center text-lg mr-3 flex-shrink-0">
                    ❌
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-sm md:text-base">{item.others}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="max-w-3xl mx-auto mt-16 text-center"
        >
          <p className="text-xl md:text-2xl text-white italic mb-2">
            "Excellence is not a skill, it's an attitude."
          </p>
          <p className="text-lg text-purple-300/80">
            We treat your business as if it were our own
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NexShiftFlowchart