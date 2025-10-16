'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const flowchartItems = [
  {
    id: 'design',
    title: 'Design & Brand',
    iconFallback: '🎨',
    items: [
      'Strategic Brand Identity',
      'Clear Visual Messaging',
      'Market Positioning',
      'Cohesive Design'
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
      'Brand Voice',
      'Trust-Building Narratives'
    ]
  },
  {
    id: 'psychology',
    title: 'Laws & Psychology',
    iconFallback: '🧠',
    items: [
      'Design Psychology',
      'Persuasive Copywriting',
      'Cognitive Bias',
      'Behavioral Economics'
    ]
  }
]

// Optimized sizing for better presentation and more compact appearance
const boxSize = 150; // Reduced box size
const centerBoxSize = 160;
const svgSize = 680; 
const center = svgSize / 2;
const offset = 230;

// Add mobile responsive sizes
const mobileSvgSize = 320;
const mobileCenter = mobileSvgSize / 2;
const mobileOffset = 110;
const mobileBoxSize = 90;
const mobileCenterBoxSize = 100;

const positions = [
  { x: center - offset, y: center - offset }, // Top Left
  { x: center + offset, y: center - offset }, // Top Right
  { x: center - offset, y: center + offset }, // Bottom Left
  { x: center + offset, y: center + offset }  // Bottom Right
];

// Mobile positions
const mobilePositions = [
  { x: mobileCenter - mobileOffset, y: mobileCenter - mobileOffset }, // Top Left
  { x: mobileCenter + mobileOffset, y: mobileCenter - mobileOffset }, // Top Right
  { x: mobileCenter - mobileOffset, y: mobileCenter + mobileOffset }, // Bottom Left
  { x: mobileCenter + mobileOffset, y: mobileCenter + mobileOffset }  // Bottom Right
];

// Comparison data - enhanced with AI features
const comparisonData = [
  {
    nexdev: 'AI-Augmented Expert Team',
    others: 'Inexperienced Juniors',
    icon: '🧠'
  },
  {
    nexdev: 'ML-Powered Conversion Strategy',
    others: 'No focus on conversion & growth',
    icon: '📈'
  },
  {
    nexdev: 'AI-Optimized NEX-SHFT Method',
    others: 'Old & typical approaches',
    icon: '🛠️'
  },
  {
    nexdev: 'Automated Fast Implementation',
    others: 'Slow Development',
    icon: '⚡'
  },
  {
    nexdev: 'AI-Assisted Design & Development',
    others: 'Limited expertise',
    icon: '🎨'
  },
  {
    nexdev: 'Data-Driven Strategic Approach',
    others: 'No clear strategy',
    icon: '📝'
  },
  {
    nexdev: 'AI Quality Assurance Systems',
    others: 'Average results',
    icon: '🚀'
  }
];

const sideDetails = [
  {
    side: 'left',
    top: 120,
    title: 'AI-Powered Insights',
    desc: 'We leverage advanced AI to analyze user behavior and market trends, ensuring every decision is data-driven.',
    arrowDir: 'right',
    arrowDelay: 0.1
  },
  {
    side: 'left',
    top: 380,
    title: 'Continuous Learning',
    desc: 'Our systems adapt and improve over time, delivering ever-better results for your business.',
    arrowDir: 'right',
    arrowDelay: 0.3
  },
  {
    side: 'right',
    top: 120,
    title: 'Conversion Optimization',
    desc: 'AI identifies high-impact opportunities, maximizing your conversion rates beyond industry standards.',
    arrowDir: 'left',
    arrowDelay: 0.2
  },
  {
    side: 'right',
    top: 380,
    title: 'Bias-Free Decisions',
    desc: 'Remove guesswork: our AI bases every strategy on proven data, not assumptions.',
    arrowDir: 'left',
    arrowDelay: 0.4
  }
];

// Add AI benefits data
const aiUseCases = [
  {
    title: "Predictive User Behavior",
    description: "Our AI algorithms analyze user patterns to predict behaviors and optimize conversion paths before issues arise.",
    icon: "🧠",
    color: "from-purple-600/20 to-indigo-600/20"
  },
  {
    title: "Intelligent A/B Testing",
    description: "AI-powered testing identifies winning variations faster by adapting test parameters in real-time based on user responses.",
    icon: "🔬",
    color: "from-blue-600/20 to-violet-600/20"
  },
  {
    title: "Personalized Experiences",
    description: "Dynamic content customization for each visitor based on their behavior, preferences, and demographic data.",
    icon: "👤",
    color: "from-indigo-600/20 to-purple-600/20"
  },
  {
    title: "Automated Optimization",
    description: "24/7 performance monitoring with AI that automatically adjusts parameters to maintain peak conversion rates.",
    icon: "⚙️",
    color: "from-violet-600/20 to-fuchsia-600/20"
  }
];

const NexShiftFlowchart = () => {
  // Add state to track viewport width
  const [isMobile, setIsMobile] = useState(false);
  
  // Effect to track viewport width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Create mobile-optimized shortened description
  const getDescription = () => {
    if (isMobile) {
      return "Our NEX-SHFT methodology combines design, marketing, copy, and psychology to create high-converting digital experiences.";
    } else {
      return "Our NEX-SHFT methodology integrates four critical domains of expertise to create high-converting digital experiences. By combining design, marketing psychology, strategic copywriting, and behavioral science principles, we develop solutions that deliver measurable business results.";
    }
  };
  
  // Helper for truncating text on mobile
  const truncateForMobile = (text: string, maxLength = 12) => {
    if (isMobile && text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`;
    }
    return text;
  };
  
  return (
    <div className="w-full flex flex-col items-center py-6 sm:py-10 md:py-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-white mb-8 sm:mb-14"
      >
        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">NEX-SHFT</span> Methodology
      </motion.h2>

      <div className="relative w-full flex justify-center">
        <div className="relative" style={{ 
          width: isMobile ? mobileSvgSize : svgSize, 
          height: isMobile ? mobileSvgSize : svgSize, 
          maxWidth: '100%'
        }}>
          {/* Side detail boxes with animated arrows - hide on mobile */}
          {sideDetails.map((detail, idx) => (
            <motion.div
              key={detail.title}
              initial={{ opacity: 0, x: detail.side === 'left' ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + idx * 0.1 }}
              className={`absolute z-30 hidden sm:flex flex-col items-${detail.side === 'left' ? 'end' : 'start'} w-[270px]`}
              style={{
                top: detail.top,
                left: detail.side === 'left' ? -280 : undefined,
                right: detail.side === 'right' ? -280 : undefined
              }}
            >
              <div className="bg-black/90 backdrop-blur-sm border border-purple-700/50 rounded-lg p-4 mb-3 shadow-lg max-w-xs hover:border-purple-600/60 transition-all duration-300 hover:shadow-purple-900/10 hover:shadow-xl">
                <div className="w-8 h-8 rounded-md bg-purple-900/40 border border-purple-600/40 flex items-center justify-center mb-2 text-purple-400 text-lg shadow-inner">
                  {idx === 0 ? '🧠' : idx === 1 ? '⚙️' : idx === 2 ? '📈' : '🔍'}
                </div>
                <h5 className="text-purple-300 font-semibold text-sm mb-1.5 tracking-wide">{detail.title}</h5>
                <p className="text-gray-300/90 text-xs leading-relaxed">{detail.desc}</p>
              </div>
              
              {/* Improved animated guiding arrow */}
              <motion.div
                initial={{ x: 0, opacity: 0.7 }}
                animate={{ 
                  x: detail.arrowDir === 'right' ? [0, 12, 0] : [0, -12, 0],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: detail.arrowDelay, 
                  ease: 'easeInOut' 
                }}
                className="flex items-center"
              >
                <svg 
                  width="60" 
                  height="24" 
                  viewBox="0 0 60 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-md"
                >
                  <path 
                    d={detail.arrowDir === 'right'
                      ? 'M4 12H50M50 12L42 4M50 12L42 20'
                      : 'M56 12H10M10 12L18 4M10 12L18 20'}
                    stroke="url(#arrowGradient)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient 
                      id="arrowGradient" 
                      x1={detail.arrowDir === 'right' ? "4" : "56"} 
                      y1="12" 
                      x2={detail.arrowDir === 'right' ? "50" : "10"} 
                      y2="12" 
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0" stopColor="#9061F9" stopOpacity="0.4" />
                      <stop offset="1" stopColor="#A855F7" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            </motion.div>
          ))}

          {/* SVG Lines with minimal styling */}
          <svg width={isMobile ? mobileSvgSize : svgSize} height={isMobile ? mobileSvgSize : svgSize} className="absolute left-0 top-0 w-full h-full pointer-events-none z-10">
            {(isMobile ? mobilePositions : positions).map((pos, i) => (
              <motion.line
                key={i}
                x1={isMobile ? mobileCenter : center}
                y1={isMobile ? mobileCenter : center}
                x2={pos.x}
                y2={pos.y}
                stroke="rgba(139, 92, 246, 0.6)"
                strokeWidth={isMobile ? "2" : "3"}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
              />
            ))}
          </svg>

          {/* Central NEX-SHFT box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="absolute z-20 flex items-center justify-center"
            style={{
              left: isMobile ? mobileCenter - mobileCenterBoxSize / 2 : center - centerBoxSize / 2,
              top: isMobile ? mobileCenter - mobileCenterBoxSize / 2 : center - centerBoxSize / 2,
              width: isMobile ? mobileCenterBoxSize : centerBoxSize,
              height: isMobile ? mobileCenterBoxSize : centerBoxSize
            }}
          >
            <div className="w-full h-full rounded-xl border-2 border-purple-700/80 bg-black/90 flex justify-center items-center shadow-lg">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold text-purple-400 text-center">NEX-SHFT</h3>
            </div>
          </motion.div>

          {/* Four methodology boxes - simplified */}
          {flowchartItems.map((item, i) => {
            const pos = isMobile ? mobilePositions[i] : positions[i];
            const bSize = isMobile ? mobileBoxSize : boxSize;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                className="absolute z-20 flex flex-col items-center"
                style={{
                  left: pos.x - bSize / 2,
                  top: pos.y - bSize / 2,
                  width: bSize,
                  height: bSize
                }}
              >
                <div className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} rounded-lg bg-purple-900/30 border border-purple-700/40 flex items-center justify-center mb-2 sm:mb-3 shadow-md`}>
                  <span className={`${isMobile ? 'text-base' : 'text-xl'}`}>{item.iconFallback}</span>
                </div>
                <h4 className="text-white text-center font-semibold text-xs sm:text-base mb-1.5 sm:mb-2">{truncateForMobile(item.title, 15)}</h4>
                <ul className={`space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs`}>
                  {/* Show only 2 items on mobile */}
                  {item.items.slice(0, isMobile ? 2 : 4).map((listItem, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-center text-purple-100/80"
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + (idx * 0.1) }}
                    >
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-600 rounded-full mr-1 sm:mr-1.5"></span>
                      {truncateForMobile(listItem, 10)}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Methodology description - with more spacing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="max-w-3xl mx-auto mt-10 sm:mt-20 text-center px-4"
      >
        <p className="text-xs sm:text-sm md:text-base text-purple-100/80 leading-relaxed mb-8 sm:mb-10">
          {getDescription()}
        </p>
      </motion.div>

      {/* Enhanced Comparison section - more professional and aligned */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="w-full max-w-4xl mx-auto mt-8 sm:mt-16 px-4"
      >
        <h2 className="text-center text-lg sm:text-xl md:text-2xl font-bold mb-8 sm:mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-500">NeXDev</span> <span className="text-gray-300">vs</span> <span className="text-gray-500">Other Agencies</span>
        </h2>

        <div className="relative flex flex-col">
          {/* Enhanced VS Circle with gradient border */}
          <div className="hidden md:flex absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 z-10 w-14 h-14 rounded-full bg-black/80 border-2 border-transparent p-[2px] shadow-lg text-purple-300 items-center justify-center font-bold" 
               style={{ background: 'linear-gradient(to right, #000 0%, #000 100%), linear-gradient(to right, rgba(149, 86, 245, 0.8), rgba(114, 92, 211, 0.8))', 
                      backgroundClip: 'padding-box, border-box',
                      backgroundOrigin: 'padding-box, border-box' }}>
            <span className="text-sm font-bold tracking-wider">VS</span>
          </div>
          
          {/* Improved Divider Line with gradient */}
          <div className="hidden md:block absolute left-1/2 top-12 bottom-0 w-[2px] bg-gradient-to-b from-purple-600/40 via-purple-500/20 to-transparent transform -translate-x-1/2 z-0"></div>
          
          {/* Column Headers with improved styling */}
          <div className="grid grid-cols-2 mb-4 sm:mb-6">
            <div className="text-center md:text-right text-sm sm:text-base font-semibold text-white px-2 sm:px-4 py-2">
              <span className="inline-flex items-center justify-end w-full">
                <span className="mr-2 bg-gradient-to-r from-purple-500 to-violet-500 bg-clip-text text-transparent">AI-Powered NeXDev Solutions</span>
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full"></span>
              </span>
            </div>
            <div className="text-center md:text-left text-sm sm:text-base font-semibold text-gray-400 px-2 sm:px-4 py-2">
              <span className="inline-flex items-center w-full">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-600 rounded-full"></span>
                <span className="ml-2">Other Agencies</span>
              </span>
            </div>
          </div>
          
          {/* Enhanced Comparison Rows - better alignment */}
          <div className="space-y-2.5 sm:space-y-3.5">
            {/* Show fewer comparison items on mobile */}
            {comparisonData.slice(0, isMobile ? 4 : comparisonData.length).map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 sm:gap-4 relative">
                <motion.div 
                  className="flex items-center bg-black/60 backdrop-blur-sm border border-purple-700/30 rounded-lg p-2.5 sm:p-3.5 md:flex-row-reverse shadow-lg hover:border-purple-600/40 transition-all duration-300"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-purple-800/40 to-indigo-800/30 flex items-center justify-center text-sm sm:text-base mr-0 md:ml-3 md:mr-0 flex-shrink-0 border border-purple-600/40 shadow-inner">
                    {item.icon}
                  </div>
                  <div className="flex-1 md:text-right ml-2 sm:ml-3 md:ml-0 md:mr-3">
                    <p className="text-white text-xs sm:text-sm font-medium">{truncateForMobile(item.nexdev, 20)}</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center bg-black/60 backdrop-blur-sm border border-gray-800/40 rounded-lg p-2.5 sm:p-3.5 shadow-lg"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * index }}
                >
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gray-900/80 flex items-center justify-center text-sm sm:text-base mr-2 sm:mr-3 flex-shrink-0 border border-gray-700/30 shadow-inner">
                    ❌
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs sm:text-sm">{truncateForMobile(item.others, 18)}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Comparison annotation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mt-6 sm:mt-8 rounded-lg bg-purple-900/10 border border-purple-800/20 p-2.5 sm:p-3 text-center"
          >
            <p className="text-[10px] sm:text-xs text-purple-200/70 italic">
              Our AI-driven approach consistently outperforms traditional methods across all key metrics
            </p>
          </motion.div>
        </div>

        {/* New AI Benefits Section - show only 2 cards on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="mt-16 sm:mt-28 mb-12 sm:mb-16"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="inline-block text-xl sm:text-2xl md:text-3xl font-bold relative">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400">
                {isMobile ? "AI For Perfect Results" : "How We Use AI For Perfect Results"}
              </span>
              <span className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-[4px] sm:h-[6px] bg-gradient-to-r from-purple-600/20 via-violet-600/40 to-indigo-600/20 rounded-full blur-sm"></span>
              <span className="absolute -bottom-2 sm:-bottom-3 left-[5%] right-[5%] h-[1px] sm:h-[2px] bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 rounded-full"></span>
            </h2>
            <p className="text-gray-400 mt-4 sm:mt-6 max-w-xl mx-auto text-xs sm:text-sm">
              {isMobile ? "AI systems delivering exceptional results through advanced technology" : "Our proprietary AI systems elevate your projects beyond typical solutions, delivering exceptional results through advanced technology"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
            {/* Show only 2 cards on mobile */}
            {aiUseCases.slice(0, isMobile ? 2 : aiUseCases.length).map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.7 + (index * 0.1) }}
                className="bg-black/60 backdrop-blur-lg border border-purple-900/30 rounded-xl p-3.5 sm:p-5 relative overflow-hidden group"
              >
                {/* Background gradient */}
                <div className="absolute top-0 right-0 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-bl opacity-10 rounded-bl-full" 
                     style={{background: `linear-gradient(to bottom left, ${useCase.color.split(' ')[0].replace('/20', '/40')}, transparent)`}}></div>
                
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 mt-1 rounded-lg bg-gradient-to-br border border-purple-700/40 flex items-center justify-center text-base sm:text-xl shadow-md" 
                       style={{background: `linear-gradient(to bottom right, ${useCase.color})`}}>
                    <span>{useCase.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 sm:mb-2 tracking-wide">
                      {truncateForMobile(useCase.title, 18)}
                    </h3>
                    <p className="text-purple-100/70 text-[11px] sm:text-xs leading-relaxed">
                      {isMobile ? 
                        useCase.description.split(" ").slice(0, 10).join(" ") + "..." : 
                        useCase.description}
                    </p>
                  </div>
                </div>
                
                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-8 sm:h-8 overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-10 h-10 sm:w-16 sm:h-16 -mb-5 -mr-5 sm:-mb-8 sm:-mr-8 rounded-full border-2 border-purple-500/10"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Bottom Quote - simplified for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="max-w-2xl mx-auto mt-8 sm:mt-12 text-center"
        >
          <div className="p-4 sm:p-6 bg-black/50 backdrop-blur-sm border border-purple-900/30 rounded-xl relative overflow-hidden">
            {/* Subtle light effect */}
            <div className="absolute top-0 left-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            <p className="text-base sm:text-lg md:text-xl text-white italic mb-2 sm:mb-3 relative z-10">
              "Excellence is not a skill, it's an attitude."
            </p>
            {!isMobile && (
              <p className="text-sm sm:text-base text-purple-300/80 mt-2 sm:mt-3 relative z-10">
                We treat your business as if it were our own
              </p>
            )}
            
            {/* Subtle accent in corner */}
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 opacity-20">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0L100 100M20 0L100 80M40 0L100 60M60 0L100 40M80 0L100 20" stroke="url(#quoteLines)" strokeWidth="1"/>
                <defs>
                  <linearGradient id="quoteLines" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#A855F7" stopOpacity="0"/>
                    <stop offset="1" stopColor="#A855F7"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NexShiftFlowchart