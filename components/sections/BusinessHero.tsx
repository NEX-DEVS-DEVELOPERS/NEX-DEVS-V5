'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useIsMobile } from '@/app/utils/deviceDetection'
import { Button } from '@/components/ui/button'
import NexShiftFlowchart from './NexShiftFlowchart'
import NeuralNetwork from '../animations/NeuralNetwork'
import FastMovingLines from '../animations/FastMovingLines'
import { Audiowide } from 'next/font/google'

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
});

// Business benefits for showcase
const businessBenefits = [
  {
    title: "AI Automation",
    description: "Automate repetitive tasks and workflows with intelligent AI systems",
    icon: "🤖"
  },
  {
    title: "Data Analysis",
    description: "Gain insights through advanced AI-powered data analysis",
    icon: "📊"
  },
  {
    title: "Smart Decisions",
    description: "Make data-backed decisions with predictive AI models",
    icon: "🧠"
  },
  {
    title: "Scale Efficiently",
    description: "AI solutions that grow with your business needs",
    icon: "🚀"
  }
]

// Advanced technology features
const advancedFeatures = [
  {
    title: "AI Integration",
    description: "Custom AI solutions that adapt to your business needs",
    icon: "🧠",
    details: ["Chatbot Integration", "Smart Content Generation", "User Behavior Analysis"]
  },
  {
    title: "Machine Learning",
    description: "ML models that learn and improve from your business data",
    icon: "📈",
    details: ["Predictive Analytics", "Pattern Recognition", "Decision Support"]
  },
  {
    title: "Natural Language Processing",
    description: "Process and understand human language for better customer engagement",
    icon: "💬",
    details: ["Sentiment Analysis", "Text Classification", "Language Generation"]
  },
  {
    title: "Computer Vision",
    description: "AI systems that can analyze and interpret visual information",
    icon: "👁️",
    details: ["Image Recognition", "Object Detection", "Visual Search"]
  }
]

// Core technologies
const coreTechnologies = [
  { name: "TensorFlow & AI", level: 95, color: "bg-orange-500" },
  { name: "Python ML Stack", level: 93, color: "bg-blue-500" },
  { name: "NLP & LLMs", level: 90, color: "bg-green-500" },
  { name: "Computer Vision", level: 88, color: "bg-purple-500" },
  { name: "Data Engineering", level: 92, color: "bg-yellow-500" },
  { name: "Cloud AI Services", level: 94, color: "bg-blue-400" }
]

interface CounterAnimationProps {
  end: number;
  label: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

// Counter animation for metrics
const CounterAnimation = ({ end, label, duration = 2, prefix = '', suffix = '' }: CounterAnimationProps) => {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | undefined;
    let frameId: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };
    
    frameId = window.requestAnimationFrame(step);
    
    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [end, duration]);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
        {prefix}{count}{suffix}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  )
}

export default function BusinessHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Neural line animation refs and state
  const neuralLineRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [svgPath, setSvgPath] = useState('');

  // Ultra-smooth toggle progress events with immediate response
  useEffect(() => {
    const handleToggleProgress = (event: CustomEvent) => {
      const { progress } = event.detail;
      if (pathRef.current && neuralLineRef.current && pathLength > 0) {
        // Immediate animation without delay - invert progress for right-to-left drawing
        const offset = pathLength * progress;
        pathRef.current.style.strokeDashoffset = offset.toString();

        // Enhanced glow intensity for better visibility
        const glowIntensity = 0.5 + ((1 - progress) * 1.5);
        neuralLineRef.current.style.setProperty('--glow-intensity', glowIntensity.toString());
      }
    };

    const handleToggleFinished = (event: CustomEvent) => {
      const { hero } = event.detail;
      const targetProgress = hero === 'business' ? 1 : 0;

      if (pathRef.current && neuralLineRef.current && pathLength > 0) {
        // Immediate animation without delay - invert progress for right-to-left drawing
        const offset = pathLength * targetProgress;
        pathRef.current.style.strokeDashoffset = offset.toString();

        // Enhanced glow intensity for better visibility
        const glowIntensity = 0.5 + ((1 - targetProgress) * 1.5);
        neuralLineRef.current.style.setProperty('--glow-intensity', glowIntensity.toString());
      }
    };
    
    window.addEventListener('heroToggleProgress', handleToggleProgress as EventListener);
    window.addEventListener('heroToggleFinished', handleToggleFinished as EventListener);
    
    return () => {
      window.removeEventListener('heroToggleProgress', handleToggleProgress as EventListener);
      window.removeEventListener('heroToggleFinished', handleToggleFinished as EventListener);
    };
  }, [pathLength]);

  useEffect(() => {
    const updatePath = () => {
      if (neuralLineRef.current) {
        const { offsetWidth: width, offsetHeight: height } = neuralLineRef.current;
        // Reversed path to draw from right-to-left
        const d = `M ${width - 2},${height - 2} L ${width - 2},22 C ${width - 2},10 ${width - 12},2 ${width - 22},2 L 22,2 C 12,2 2,10 2,22 L 2,${height - 2}`;
        setSvgPath(d);
      }
    };

    updatePath();

    const resizeObserver = new ResizeObserver(updatePath);
    if (neuralLineRef.current) {
      resizeObserver.observe(neuralLineRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      pathRef.current.style.strokeDasharray = `${length} ${length}`;
      pathRef.current.style.strokeDashoffset = length.toString();

      // Set initial glow intensity
      if (neuralLineRef.current) {
        neuralLineRef.current.style.setProperty('--glow-intensity', '0.5');
      }
    }
  }, [svgPath]);

  return (
    <motion.section
      ref={containerRef}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 mt-6 sm:mt-8 will-change-transform overflow-hidden"
      style={{
        transform: 'translate3d(0, 0, 0)',
        background: '#000000 !important',
        backgroundColor: '#000000 !important'
      }}
    >
      {/* Forcefully Black Background */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[-4]"
        style={{
          background: '#000000 !important',
          backgroundColor: '#000000 !important',
          transform: 'translate3d(0, 0, 0)'
        }}>
      </div>

      {/* Animated Blue Neon Line Border */}
      {!isMobile && (
        <div
          ref={neuralLineRef}
          className="absolute inset-x-4 inset-y-4 sm:inset-x-8 sm:inset-y-8 pointer-events-none z-10"
          style={{ '--glow-intensity': '0.3' } as React.CSSProperties}
        >
          <svg width="100%" height="100%" className="overflow-visible">
            <defs>
              <linearGradient id="blue-line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(96, 165, 250, 1)" />
                <stop offset="20%" stopColor="rgba(59, 130, 246, 1)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0.2)" />
              </linearGradient>
              <filter id="blue-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              ref={pathRef}
              d={svgPath}
              stroke="url(#blue-line-gradient)"
              strokeWidth="3"
              fill="none"
              style={{
                transition: 'none', // Remove transition for immediate response
                filter: 'url(#blue-glow)',
                opacity: 'var(--glow-intensity)',
              }}
            />
          </svg>
        </div>
      )}

      {/* Neural Network Animation Background - More Visible */}
      <div className="fixed inset-0 z-[-2] pointer-events-none">
        <NeuralNetwork
          color="#6366f1"
          lineColor="#4f46e5"
          pointCount={60}
          connectionRadius={180}
          speed={1.2}
        />
      </div>

      {/* Langflow Background Image - OPTIMIZED FOR TEXT READABILITY */}
      <div className="absolute inset-0 z-[-3] pointer-events-none opacity-25 mix-blend-screen">
        <div className="relative w-full h-full max-w-5xl mx-auto">
          <Image
            src="https://www.langflow.org/_next/image?url=%2Fimages%2Fdrag-drop-deploy.png&w=2048&q=75&dpl=dpl_61CbaxayM8My3RQJ5dKv9E7f3oq1"
            alt="Langflow Background"
            fill
            className="object-contain object-top scale-90"
            priority
            quality={80}
            style={{ filter: 'blur(0.5px)' }}
          />
        </div>
      </div>

      {/* Mobile-specific background blur for better text readability */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-[-1] sm:hidden"
           style={{ transform: 'translate3d(0, 0, 0)' }}></div>

      {/* Reduced empty space for HeroToggle */}
      <div className="h-12 sm:h-14"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full relative z-10">
        {/* Main hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center relative">
          {/* Left content - enhanced copy */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-700/30 text-purple-300 text-xs sm:text-sm">
                <span className="mr-2">✨</span>NEX-DEVS Technology Solutions
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                <span className={audiowide.className}>Grow Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">Business</span> With AI Automated Driven Results</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl">
                We help transform your business operations with AI-powered solutions, delivering up to <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-400 font-semibold">55% higher efficiency</span>.
              </p>
              
              {/* Key points with icons - simplified */}
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 sm:pt-4">
                {[
                  { text: "AI-Powered Solutions", icon: "🧠" },
                  { text: "Machine Learning Models", icon: "🤖" },
                  { text: "Natural Language Processing", icon: "💬" },
                  { text: "Predictive Analytics", icon: "📊" }
                ].map((point, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-purple-900/20 flex items-center justify-center">
                      <span>{point.icon}</span>
                    </div>
                    <span className="text-gray-300 text-xs sm:text-sm">{point.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 sm:gap-4 pt-2"
            >
              <Link href="/discovery-call">
                <Button className="bg-purple-700 hover:bg-purple-800 text-white px-4 sm:px-6 py-4 sm:py-6 h-auto text-sm sm:text-base rounded-lg shadow-lg shadow-purple-900/20 flex items-center gap-2">
                  Book Free Discovery Call
                  <span className="text-lg">→</span>
                </Button>
              </Link>
              
              <Link href="/projects">
                <Button variant="outline" className="border-purple-800/30 text-white hover:bg-purple-900/10 px-4 sm:px-6 py-4 sm:py-6 h-auto text-sm sm:text-base rounded-lg">
                  View Case Studies
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right content - Business metrics - more compact */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-5 mt-6 sm:mt-0"
          >
            <div className="bg-black/60 backdrop-blur-lg border border-purple-900/20 rounded-xl p-4 sm:p-6 shadow-xl">
              <h3 className="text-base sm:text-lg text-white font-semibold mb-3 sm:mb-5 flex items-center gap-2">
                <span className="text-purple-400">★</span> Our Impact in Numbers
              </h3>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 rounded-lg bg-black/30 neon-border-purple-base">
                  <CounterAnimation end={55} suffix="%" label="Higher Efficiency" />
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-black/30 neon-border-blue-base">
                  <CounterAnimation end={200} suffix="+" label="Satisfied Clients" />
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-black/30 neon-border-green-base">
                  <CounterAnimation end={40} suffix="%" label="Cost Reduction" />
                </div>
                <div className="p-2 sm:p-3 rounded-lg bg-black/30 neon-border-pink-base">
                  <CounterAnimation end={83} suffix="%" label="Client Retention" />
                </div>
              </div>

              {/* Tech skills showcase - simplified */}
              <div className="mt-3 sm:mt-5 pt-3 sm:pt-5 border-t border-purple-900/20">
                <h4 className="text-sm sm:text-base text-white/80 font-medium mb-2 sm:mb-3">AI Technologies</h4>
                <div className="space-y-1.5 sm:space-y-2">
                  {coreTechnologies.map((tech, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">{tech.name}</span>
                        <span className="text-gray-400">{tech.level}%</span>
                      </div>
                      <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tech.level}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className={`h-full ${tech.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* AI Models and Automation Tools Section - Replacing Advanced AI Solutions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-20"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">AI ECOSYSTEM</h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">Leveraging cutting-edge AI models and automation tools to deliver exceptional results</p>
          </div>
          
          {/* Two columns: AI Models and Automation Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
            {/* AI Models Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-black/40 backdrop-blur-lg border border-purple-900/20 rounded-xl p-5 sm:p-6"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <span className="text-purple-400 text-2xl">🧠</span> 
                AI MODELS WE LEVERAGE (YET WE ARE IN DISCUSSION WITH REST)

           </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "OpenAI",
                    description: "Advanced language model for natural text generation and understanding",
                    metrics: "175B parameters",
                    imagePlaceholder: false,
                    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_l5XeqAPsaIp3eTI7zZFhV5VsJWQcxKLoA&s"
                  },
                  {
                    name: "Anthropic Claude 4 sonnet / opus 4",
                    description: "Specialized in nuanced conversations and complex reasoning",
                    metrics: "200K context window",
                    imagePlaceholder: false,
                    imageUrl: "https://i.pinimg.com/736x/9b/a3/26/9ba3260ec0c415fecc86cf76eb4ab127.jpg"
                  },
                  {
                    name: "GROK AI",
                    description: "State-of-the-art image generation and manipulation",
                    metrics: "1B+ training images",
                    imagePlaceholder: false,
                    imageUrl: "https://logowik.com/content/uploads/images/grok8766.logowik.com.webp"
                  },
                  {
                    name: "GOOGLE/GEMINI",
                    description: "Enterprise-grade language models for business applications",
                    metrics: "99.7% accuracy",
                    imagePlaceholder: false,
                    imageUrl: "https://i.pinimg.com/736x/96/82/6c/96826cc153b5f2b00a8bb3ef0dedbdea.jpg"
                  }
                ].map((model, i) => (
                  <div
                    key={i}
                    className={`bg-black/30 rounded-lg p-3 sm:p-4 flex flex-col ${
                      i % 5 === 0 ? 'neon-border-cyan-base' :
                      i % 5 === 1 ? 'neon-border-orange-base' :
                      i % 5 === 2 ? 'neon-border-yellow-base' :
                      i % 5 === 3 ? 'neon-border-violet-base' :
                      'neon-border-lime-base'
                    }`}
                  >
                    <div className="aspect-video bg-black/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {model.imagePlaceholder ? (
                        <div className="text-center p-4">
                          <div className="text-3xl mb-2">🤖</div>
                          <p className="text-xs text-gray-500">(Model image placeholder)</p>
                        </div>
                      ) : (
                        <Image 
                          src={model.imageUrl || ''}
                          alt={`${model.name} logo`}
                          width={180}
                          height={100}
                          className={`object-contain p-3 bg-white rounded-lg ${model.name === "Anthropic Claude 4 sonnet / opus 4" ? "h-28" : "h-20"}`}
                        />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{model.name}</h4>
                    <p className="text-xs text-gray-400 mb-2 flex-grow">{model.description}</p>
                    <div className="text-xs bg-purple-900/20 rounded-full px-2 py-1 text-purple-300 inline-block">
                      {model.metrics}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* AI Automation Tools Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-black/40 backdrop-blur-lg border border-purple-900/20 rounded-xl p-5 sm:p-6"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                <span className="text-purple-400 text-2xl">⚙️</span> 
                AUTOMATION TOOLS WE MASTER 
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    name: "N8N",
                    description: "Open source workflow automation with powerful integrations",
                    metrics: "1000+ nodes",
                    imagePlaceholder: false,
                    imageUrl: "https://miro.medium.com/v2/resize:fit:1155/0*G-5F38rBStjlMNwd.png"
                  },
                  {
                    name: "Make.com",
                    description: "Visual automation platform for complex business processes",
                    metrics: "99.9% uptime",
                    imagePlaceholder: false,
                    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpad3kQ9jxPrEfSkgdXDDi7Jk9792oTshEDA&s"
                  },
                  {
                    name: "Langchain",
                    description: "Framework for developing applications powered by language models",
                    metrics: "50+ integrations",
                    imagePlaceholder: false,
                    imageUrl: "https://images.seeklogo.com/logo-png/61/1/langchain-logo-png_seeklogo-611654.png"
                  },
                  {
                    name: "Zapier",
                    description: "Connect apps and automate workflows without coding",
                    metrics: "5000+ app connections",
                    imagePlaceholder: false,
                    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8QHGq30ozaZQoj2k_tgjyEuaXsO5UB6ng5Tc5zIRdsupDKSxzSRltoEROiLY_yeycD7g&usqp=CAU"
                  }
                ].map((tool, i) => (
                  <div
                    key={i}
                    className={`bg-black/30 rounded-lg p-3 sm:p-4 flex flex-col ${
                      i % 4 === 0 ? 'neon-border-red-base' :
                      i % 4 === 1 ? 'neon-border-cyan-base' :
                      i % 4 === 2 ? 'neon-border-orange-base' :
                      'neon-border-yellow-base'
                    }`}
                  >
                    <div className="aspect-video bg-black/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {tool.imagePlaceholder ? (
                        <div className="text-center p-4">
                          <div className="text-3xl mb-2">⚙️</div>
                          <p className="text-xs text-gray-500">(Tool image placeholder)</p>
                        </div>
                      ) : (
                        <Image 
                          src={tool.imageUrl || ''}
                          alt={`${tool.name} logo`}
                          width={180}
                          height={100}
                          className={`object-contain p-3 bg-white rounded-lg ${tool.name === "Langchain" ? "h-28" : "h-20"}`}
                        />
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1">{tool.name}</h4>
                    <p className="text-xs text-gray-400 mb-2 flex-grow">{tool.description}</p>
                    <div className="text-xs bg-purple-900/20 rounded-full px-2 py-1 text-purple-300 inline-block">
                      {tool.metrics}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { value: "15+", label: "AI Models Integrated", icon: "🧠" },
              { value: "10+", label: "Automation Platforms", icon: "⚙️" },
              { value: "99.9%", label: "Automation Reliability", icon: "✓" },
              { value: "60%", label: "Cost Reduction", icon: "💰" }
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-black/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center ${
                  i % 4 === 0 ? 'neon-border-purple-base' :
                  i % 4 === 1 ? 'neon-border-blue-base' :
                  i % 4 === 2 ? 'neon-border-green-base' :
                  'neon-border-pink-base'
                }`}
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Langchain Special Section - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 sm:mt-20"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">LANGCHAIN</span> INTEGRATION HUB
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto">
              Powering intelligent AI applications with advanced language model orchestration and seamless integrations
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Left side: Langchain Workflow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="lg:col-span-7 bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-5 sm:p-6 overflow-hidden"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <span className="text-blue-400 text-2xl">🔗</span> 
                  ADVANCED LLM ORCHESTRATION FRAMEWORK
                </h3>
                <p className="text-gray-300 text-sm">Building sophisticated AI applications with composable components</p>
              </div>
              
              <div className="aspect-video bg-black/50 rounded-lg border border-blue-900/30 flex items-center justify-center mb-4 overflow-hidden">
                <Image 
                  src="https://miro.medium.com/v2/1*nTyNjaSZV1dszs4ZUdhZrw.png" 
                  alt="Langchain Workflow Visualization" 
                  width={700} 
                  height={400}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/30 rounded-lg p-3 border border-blue-900/20">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <span className="text-blue-400">🔄</span> Chain Components
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Document Loaders
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Text Splitters
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Vector Stores
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Embeddings
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Memory Systems
                    </li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-blue-900/20">
                  <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                    <span className="text-blue-400">🧩</span> Integration Capabilities
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Multi-LLM Support
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Custom Knowledge Bases
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      API Connectors
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Structured Output
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                      Tool Calling Framework
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Right side: AI Chatbot & Integration Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="lg:col-span-5 flex flex-col gap-4"
            >
              {/* AI Chatbot Features */}
              <div className="bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-5 sm:p-6 h-1/2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                  <span className="text-blue-400 text-xl">💬</span> 
                  AI CHATBOT SOLUTIONS
                </h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm">🤖</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Contextual Understanding</h4>
                      <p className="text-xs text-gray-400">Advanced memory systems for coherent, personalized conversations</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm">📚</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Knowledge Base Integration</h4>
                      <p className="text-xs text-gray-400">Connect to your business data for accurate, relevant responses</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm">🔄</span>
                  </div>
                  <div>
                      <h4 className="text-sm font-medium text-white">Multi-channel Deployment</h4>
                      <p className="text-xs text-gray-400">Website, mobile, Slack, Teams, and custom application integration</p>
                    </div>
                  </div>
                </div>

                {/* Additional Langchain Images with connecting lines */}
                <div className="mt-4 grid grid-cols-2 gap-3 relative">
                  {/* Connecting lines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-40"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-full w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-40"></div>
                  </div>
                  
                  {/* First additional image */}
                  <div className="aspect-video bg-black/50 rounded-lg border border-blue-900/30 overflow-hidden z-10 p-1">
                    <Image 
                      src="https://codemag.com/Article/Image/2403051/image4.png" 
                      alt="Langchain Integration Diagram" 
                      width={150} 
                      height={85}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Second additional image */}
                  <div className="aspect-video bg-black/50 rounded-lg border border-blue-900/30 overflow-hidden z-10 p-1">
                    <Image 
                      src="https://codemag.com/Article/Image/2403051/image9.png" 
                      alt="Langchain Architecture" 
                      width={150} 
                      height={85}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              
              {/* AI Integration Features */}
              <div className="bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-5 sm:p-6 h-1/2">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                  <span className="text-blue-400 text-xl">🔌</span> 
                  BUSINESS SYSTEM INTEGRATION
                </h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm">📊</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">CRM & ERP Connection</h4>
                      <p className="text-xs text-gray-400">Seamless AI integration with Salesforce, SAP, and custom systems</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm">🔍</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Semantic Search</h4>
                      <p className="text-xs text-gray-400">Advanced document retrieval with natural language understanding</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-blue-400 text-sm">⚙️</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Workflow Automation</h4>
                      <p className="text-xs text-gray-400">AI-triggered actions based on data insights and user interactions</p>
                    </div>
                  </div>
                  </div>
                </div>
              </motion.div>
          </div>
          
          {/* Langchain Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-6 grid grid-cols-4 gap-4"
          >
            {[
              { title: "Rapid Development", icon: "⚡", desc: "Build complex AI apps in days, not months" },
              { title: "Enterprise Ready", icon: "🏢", desc: "Production-grade reliability and security" },
              { title: "Flexible Architecture", icon: "🧩", desc: "Adapt to changing business requirements" },
              { title: "Future-Proof", icon: "🚀", desc: "Stay current with evolving AI capabilities" }
            ].map((benefit, i) => (
              <div
                key={i}
                className={`bg-black/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center ${
                  i % 4 === 0 ? 'neon-border-cyan-base' :
                  i % 4 === 1 ? 'neon-border-orange-base' :
                  i % 4 === 2 ? 'neon-border-yellow-base' :
                  'neon-border-violet-base'
                }`}
              >
                <div className="text-2xl mb-2">{benefit.icon}</div>
                <h4 className="text-sm font-medium text-white mb-1">{benefit.title}</h4>
                <p className="text-xs text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Langflow Business Optimization Section - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 sm:mt-16"
        >
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">LANGFLOW</span> SIMPLIFIES BUSINESS AI IMPLEMENTATION
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-3xl mx-auto">
              Visual interface for building, testing, and deploying AI workflows without complex coding
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Langflow Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="lg:col-span-7 bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-4 sm:p-5 overflow-hidden"
            >
              <div className="aspect-[16/9] bg-black/50 rounded-lg border border-blue-900/30 flex items-center justify-center overflow-hidden">
                <Image 
                  src="https://www.langflow.org/_next/image?url=%2Fimages%2Frun-share-collab.png&w=2048&q=75&dpl=dpl_61CbaxayM8My3RQJ5dKv9E7f3oq1" 
                  alt="Langflow Visual Interface" 
                  width={900} 
                  height={506}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </motion.div>
            
            {/* Business Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="lg:col-span-5 flex flex-col gap-4"
            >
              <div className="bg-black/40 backdrop-blur-lg border border-blue-900/30 rounded-xl p-5 sm:p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                  <span className="text-blue-400 text-2xl">⚡</span> 
                  BUSINESS OPTIMIZATION
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-black/30 rounded-lg p-4 border border-blue-900/20">
                    <h4 className="text-base font-medium text-white mb-2 flex items-center gap-2">
                      <span className="text-blue-400 text-lg">🔄</span> Rapid Prototyping
                    </h4>
                    <p className="text-sm text-gray-400">
                      Reduce AI implementation time from months to days with visual workflow building and instant testing
                    </p>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-4 border border-blue-900/20">
                    <h4 className="text-base font-medium text-white mb-2 flex items-center gap-2">
                      <span className="text-blue-400 text-lg">👥</span> Team Collaboration
                    </h4>
                    <p className="text-sm text-gray-400">
                      Enable technical and non-technical team members to collaborate on AI solutions with visual interfaces
                    </p>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-4 border border-blue-900/20">
                    <h4 className="text-base font-medium text-white mb-2 flex items-center gap-2">
                      <span className="text-blue-400 text-lg">💼</span> Business Integration
                    </h4>
                    <p className="text-sm text-gray-400">
                      Seamlessly connect AI workflows to existing business systems and processes with minimal disruption
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 backdrop-blur-sm neon-border-lime-base rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">85%</div>
                  <p className="text-xs text-gray-400">Faster Development</p>
                </div>
                <div className="bg-black/30 backdrop-blur-sm neon-border-red-base rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">60%</div>
                  <p className="text-xs text-gray-400">Cost Reduction</p>
                </div>
                <div className="bg-black/30 backdrop-blur-sm neon-border-cyan-base rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">3x</div>
                  <p className="text-xs text-gray-400">Faster Iteration</p>
                </div>
                <div className="bg-black/30 backdrop-blur-sm neon-border-orange-base rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">90%</div>
                  <p className="text-xs text-gray-400">Team Adoption</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* N8N and Make.com Workflows Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 sm:mt-24"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">OUR N8N WORKFLOWS AND MAKE.COM SOME WORKFLOWS!</h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">Powerful automation workflows that drive business efficiency and intelligence</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* N8N Workflows */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-black/40 backdrop-blur-lg border border-purple-900/20 rounded-xl p-5 sm:p-6 overflow-hidden"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <span className="text-purple-400 text-2xl">⚙️</span> 
                  AI AUTOMATED PRODUCT MANAGEMENT AGENT!
                </h3>
                <p className="text-gray-300 text-sm">Enterprise-grade workflow automation for complex business processes</p>
              </div>
              
              <div className="aspect-video bg-black/50 rounded-lg border border-purple-900/30 flex items-center justify-center mb-4 overflow-hidden">
                <Image 
                  src="https://public-files.gumroad.com/yd32phma5g0maf9t1l5oqihl8681" 
                  alt="N8N Workflow Visualization" 
                  width={600} 
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Additional N8N workflow images with connecting lines */}
              <div className="grid grid-cols-2 gap-4 mb-4 relative">
                {/* Connecting lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-50"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-full w-1 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-50"></div>
                </div>
                
                {/* First additional image */}
                <div className="aspect-video bg-black/50 rounded-lg border border-purple-900/30 overflow-hidden z-10">
                  <Image 
                    src="https://n8niostorageaccount.blob.core.windows.net/n8nio-strapi-blobs-prod/assets/Home_Dev_O_Ps_43aa01a07b.webp" 
                    alt="N8N DevOps Workflow" 
                    width={300} 
                    height={170}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Second additional image */}
                <div className="aspect-video bg-black/50 rounded-lg border border-purple-900/30 overflow-hidden z-10">
                  <Image 
                    src="https://preview.redd.it/from-bridge-troll-to-8-figure-boss-all-thanks-to-one-simple-v0-lbkmy9pulu0f1.jpeg?width=640&crop=smart&auto=webp&s=d1f9e7b8b24dabf27f0ced3ff1026a35c2bb3d7b" 
                    alt="N8N Results Visualization" 
                    width={300} 
                    height={170}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3 border border-purple-900/20">
                  <h4 className="text-sm font-medium text-white mb-1">Trigger Points</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• API Webhooks</li>
                    <li>• Scheduled Events</li>
                    <li>• Database Changes</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-purple-900/20">
                  <h4 className="text-sm font-medium text-white mb-1">Output Actions</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• Data Processing</li>
                    <li>• API Integrations</li>
                    <li>• Notification Systems</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Make.com Workflows */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-black/40 backdrop-blur-lg border border-purple-900/20 rounded-xl p-5 sm:p-6 overflow-hidden"
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
                  <span className="text-purple-400 text-2xl">🔌</span> 
                  THE TOOL HOLDING BUSINESS SALES!
                </h3>
                <p className="text-gray-300 text-sm">Visual automation scenarios that connect apps and automate workflows</p>
              </div>
              
              <div className="aspect-video bg-black/50 rounded-lg border border-purple-900/30 flex items-center justify-center mb-4 overflow-hidden">
                <Image 
                  src="https://images.squarespace-cdn.com/content/v1/6516da875d4cda040bcc69c4/d665f4d7-2655-442e-98ad-4801d4fd55ee/Make.com+complex+automation.png" 
                  alt="Make.com Scenario Visualization" 
                  width={600} 
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Additional Make.com workflow images with connecting lines */}
              <div className="grid grid-cols-2 gap-4 mb-4 relative">
                {/* Connecting lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-50"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-full w-1 bg-gradient-to-b from-purple-500 to-indigo-500 opacity-50"></div>
                </div>
                
                {/* First additional image */}
                <div className="aspect-video bg-black/50 rounded-lg border border-purple-900/30 overflow-hidden z-10">
                  <Image 
                    src="https://cdn3.f-cdn.com//files/download/228855173/do-automation-in-make-com-made-com-integromat-zapier-notion-airtable-googlesheet.png?fit=crop" 
                    alt="Make.com Automation" 
                    width={300} 
                    height={170}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Second additional image */}
                <div className="aspect-video bg-black/50 rounded-lg border border-purple-900/30 overflow-hidden z-10">
                  <Image 
                    src="https://appsumo2-cdn.appsumo.com/media/selfsubmissions/images/5690197f-8b9a-4f78-9d03-db22e799133c.png?width=1280&height=720&aspect_ratio=16:9&optimizer=gif" 
                    alt="Make.com Results" 
                    width={300} 
                    height={170}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/30 rounded-lg p-3 border border-purple-900/20">
                  <h4 className="text-sm font-medium text-white mb-1">Integration Types</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• CRM Systems</li>
                    <li>• Marketing Platforms</li>
                    <li>• Data Services</li>
                  </ul>
                </div>
                <div className="bg-black/30 rounded-lg p-3 border border-purple-900/20">
                  <h4 className="text-sm font-medium text-white mb-1">Business Impact</h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• 70% Time Savings</li>
                    <li>• Error Reduction</li>
                    <li>• Real-time Processing</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Key Benefits of Automation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { title: "24/7 Operation", icon: "⏰", desc: "Continuous workflow execution" },
              { title: "Error-Free Processing", icon: "✓", desc: "Eliminate human errors" },
              { title: "Scalable Performance", icon: "📈", desc: "Handles growing workloads" },
              { title: "Instant Insights", icon: "💡", desc: "Real-time business intelligence" }
            ].map((benefit, i) => (
              <div
                key={i}
                className={`bg-black/30 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center ${
                  i % 4 === 0 ? 'neon-border-yellow-base' :
                  i % 4 === 1 ? 'neon-border-violet-base' :
                  i % 4 === 2 ? 'neon-border-lime-base' :
                  'neon-border-red-base'
                }`}
              >
                <div className="text-2xl mb-2">{benefit.icon}</div>
                <h4 className="text-sm font-medium text-white mb-1">{benefit.title}</h4>
                <p className="text-xs text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Business benefits - simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 sm:mt-16"
        >
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white">How AI Transforms Your Business</h2>
            <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2 max-w-2xl mx-auto">Our AI-driven approach helps your business thrive</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {businessBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`bg-black/40 backdrop-blur-lg rounded-lg p-3 sm:p-4 relative overflow-hidden ${
                  index % 6 === 0 ? 'neon-border-purple-base' :
                  index % 6 === 1 ? 'neon-border-blue-base' :
                  index % 6 === 2 ? 'neon-border-green-base' :
                  index % 6 === 3 ? 'neon-border-pink-base' :
                  index % 6 === 4 ? 'neon-border-cyan-base' :
                  'neon-border-orange-base'
                }`}
              >
                <div className="relative">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-purple-900/20 border border-purple-900/30 mb-2 sm:mb-3 text-base sm:text-lg">
                    {benefit.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* NEX-SHFT Methodology Flowchart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 sm:mt-20 pt-5 sm:pt-8 border-t border-purple-900/20 relative overflow-hidden"
        >
          {/* Fast Moving Lines Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <FastMovingLines
              lineCount={20}
              speed={3}
              color="#8b5cf6"
              className="opacity-40"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <NexShiftFlowchart />
          </div>
        </motion.div>

        {/* CTA section - simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10 sm:mt-16 relative rounded-xl p-5 sm:p-8 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/40 border border-purple-900/20 rounded-xl z-0"></div>
          
          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Ready to Transform Your Business with AI?</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-6">Book a free discovery call to explore how our AI solutions can help achieve your business goals.</p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
              <Link href="/discovery-call">
                <Button className="bg-purple-700 hover:bg-purple-800 text-white px-4 sm:px-5 py-4 sm:py-5 h-auto text-sm sm:text-base rounded-lg shadow-lg">
                  Schedule Your Free AI Consultation
                  <span className="ml-2">→</span>
                </Button>
              </Link>
              
              <Link href="/ai-services">
                <Button variant="outline" className="border-purple-900/30 text-white hover:bg-purple-900/10 px-4 sm:px-5 py-4 sm:py-5 h-auto text-sm sm:text-base rounded-lg">
                  Explore AI Services
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
} 