"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, useReducedMotion, Variants, useScroll, useSpring, useTransform } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useIsMobile } from '@/app/utils/deviceDetection'
import TechStackSection from "@/components/sections/TechStackSection"
import NeuralNetwork from '@/components/animations/NeuralNetwork'
import { audiowide, vt323 } from '@/app/utils/fonts';
import { useBarba } from '@/utils/barba-init'

// Type definitions
interface Skill {
  name: string;
  level: number;
  icon: string;
  description?: string;
}

interface SkillSet {
  category: string;
  skills: Skill[];
}

interface Expertise {
    title: string;
    description: string;
    imageUrl: string;
    isNew: boolean;
}

interface FunFact {
    icon: string;
    title: string;
    fact: string;
}

interface WorkProcess {
    step: string;
    title: string;
    description: string;
    icon: string;
    aiFeature: string;
}

interface HeroClientProps {
    expertise: Expertise[];
    funFacts: FunFact[];
    aiSkills: SkillSet[];
    workProcess: WorkProcess[];
}

// Enhanced Animation Variants
const fadeInUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.9, 
      ease: [0.25, 0.1, 0.25, 1],
      staggerChildren: 0.12
    } 
  }
}

const staggeredFadeInVariant: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  }
}

const scaleInVariant: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.7, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    } 
  }
}

const leakyCodeVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: [0, 0.6, 0.4, 0.6],
      y: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
}

export default function HeroClient({ expertise, funFacts, aiSkills, workProcess }: HeroClientProps) {
  const [showSecretPanel, setShowSecretPanel] = useState(false)
  const isMobile = useIsMobile()
  const [funFactIndex, setFunFactIndex] = useState(0)
  const [activeSkillSet, setActiveSkillSet] = useState(0)
  const [isAutoAnimating, setIsAutoAnimating] = useState(true)
  const shouldReduceMotion = useReducedMotion()
  
  const [heroTransition, setHeroTransition] = useState({
    glitching: false,
    switching: false
  })
  
  const heroSectionRef = useRef<HTMLDivElement>(null)
  const neuralLineRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [svgPath, setSvgPath] = useState('');

  // Initialize Barba.js
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      // Import and initialize Barba
      import('@/utils/barba-init').then(({ useBarba }) => {
        useBarba();
      });
    }
  }, []);

  // Add scroll animation references
  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"]
  });

  // Create smoother spring-based animations for scroll
  const smoothY = useSpring(scrollYProgress, { stiffness: 50, damping: 20, restDelta: 0.001 });
  const opacity = useTransform(smoothY, [0, 0.5], [1, 0.9]);
  const scale = useTransform(smoothY, [0, 0.5], [1, 0.99]);
  
  useEffect(() => {
    const handleToggleProgress = (event: CustomEvent) => {
      const { progress } = event.detail;
      if (pathRef.current && neuralLineRef.current) {
        const offset = pathLength - (pathLength * progress);
        pathRef.current.style.strokeDashoffset = offset.toString();
        const glowIntensity = 0.3 + (progress * 1.2);
        neuralLineRef.current.style.setProperty('--glow-intensity', glowIntensity.toString());
      }
    };
    
    const handleToggleFinished = (event: CustomEvent) => {
      const { hero } = event.detail;
      const targetProgress = hero === 'business' ? 1 : 0;
      if (pathRef.current && neuralLineRef.current) {
        const offset = pathLength - (pathLength * targetProgress);
        pathRef.current.style.strokeDashoffset = offset.toString();
        const glowIntensity = 0.3 + (targetProgress * 1.2);
        neuralLineRef.current.style.setProperty('--glow-intensity', glowIntensity.toString());
      }
    };
    
    window.addEventListener('heroToggleProgress', handleToggleProgress as EventListener);
    window.addEventListener('heroToggleFinished', handleToggleFinished as EventListener);
    
    // Add Barba event listeners
    const handleBarbaLeave = () => {
      // Clean up animations or save state when leaving page
      if (isAutoAnimating) setIsAutoAnimating(false);
    };
    
    const handleBarbaEnter = () => {
      // Reinitialize animations when entering page
      if (heroSectionRef.current) {
        setTimeout(() => setIsAutoAnimating(true), 500);
      }
    };
    
    window.addEventListener('barbaLeave', handleBarbaLeave);
    window.addEventListener('barbaEnter', handleBarbaEnter);
    
    return () => {
      window.removeEventListener('heroToggleProgress', handleToggleProgress as EventListener);
      window.removeEventListener('heroToggleFinished', handleToggleFinished as EventListener);
      window.removeEventListener('barbaLeave', handleBarbaLeave);
      window.removeEventListener('barbaEnter', handleBarbaEnter);
    };
  }, [pathLength, isAutoAnimating]);

  useEffect(() => {
    const updatePath = () => {
      if (neuralLineRef.current) {
        const { offsetWidth: width, offsetHeight: height } = neuralLineRef.current;
        const d = `M 2,${height - 2} L 2,22 C 2,10 12,2 22,2 L ${width - 22},2 C ${width - 12},2 ${width - 2},10 ${width - 2},22 L ${width - 2},${height - 2}`;
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
    }
  }, [svgPath]);

  const nextFunFact = useCallback(() => setFunFactIndex((p) => (p + 1) % funFacts.length), [funFacts.length])
  const toggleSecretPanel = useCallback(() => setShowSecretPanel(p => !p), [])
  const nextSkillSet = useCallback(() => setActiveSkillSet((p) => (p + 1) % aiSkills.length), [aiSkills.length])
  const prevSkillSet = useCallback(() => setActiveSkillSet((p) => (p - 1 + aiSkills.length) % aiSkills.length), [aiSkills.length])
  const toggleAutoAnimation = useCallback(() => setIsAutoAnimating(p => !p), [])
  
  useEffect(() => {
    if (!isAutoAnimating) return;
    const intervalId = setInterval(() => {
        if (!document.hidden) nextSkillSet();
    }, 8000);
    return () => clearInterval(intervalId);
  }, [isAutoAnimating, nextSkillSet]);

  const currentFunFact = useMemo(() => funFacts[funFactIndex], [funFactIndex, funFacts])
  const currentSkillSet: SkillSet = useMemo(() => aiSkills[activeSkillSet], [activeSkillSet, aiSkills])

  return (
    <motion.section
      ref={heroSectionRef}
      data-barba="container" 
      data-barba-namespace="hero"
      layoutScroll
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1], when: "beforeChildren", staggerChildren: 0.15 } }
      }}
      className={`relative min-h-screen flex flex-col justify-start items-center py-8 px-6 mt-8 sm:mt-10 bg-black content-stable ${heroTransition.switching ? 'animate-pulse' : ''}`}
      style={{
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        contentVisibility: 'auto',
        contain: 'style layout paint',
        borderRadius: heroTransition.glitching ? '8px' : '0px',
        willChange: 'auto',
        transformStyle: 'preserve-3d',
        opacity: opacity,
        scale: scale,
        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
    >
      {!isMobile && (
        <div
          ref={neuralLineRef}
          className="absolute inset-x-4 inset-y-4 sm:inset-x-8 sm:inset-y-8 pointer-events-none z-10"
          style={{ '--glow-intensity': '0.3' } as React.CSSProperties}
        >
          <svg width="100%" height="100%" className="overflow-visible">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 1)" />
                <stop offset="20%" stopColor="rgba(168, 85, 247, 1)" />
                <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              ref={pathRef}
              d={svgPath}
              stroke="url(#line-gradient)"
              strokeWidth="2"
              fill="none"
              style={{
                transition: 'stroke-dashoffset 0.2s linear',
                filter: 'url(#glow)',
                opacity: 'var(--glow-intensity)',
              }}
            />
          </svg>
        </div>
      )}

      <div className="absolute inset-0 z-[0] pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="https://www.langflow.org/_next/image?url=%2Fimages%2Fdialog-api.png&w=1920&q=75&dpl=dpl_61CbaxayM8My3RQJ5dKv9E7f3oq1"
            alt="Background Effect"
            width={100}
            height={120}
            className="object-contain opacity-20 scale-75 mix-blend-luminosity"
            priority
          />
        </div>
      </div>

      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <NeuralNetwork
          color="#a855f7"
          lineColor="#8b5cf6"
          pointCount={isMobile ? 40 : 60}
          connectionRadius={isMobile ? 200 : 250}
          speed={isMobile ? 0.15 : 0.5}
          containerBounds={true}
        />
      </div>

      <div className="fixed inset-0 bg-[#050509]/85 z-[-2] gradient-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050509]/60 via-[#07051a]/60 to-[#050509]/60 opacity-70 z-[-1] gradient-bg" />
      
      <div className="absolute inset-0 overflow-hidden z-[-1]">
        <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.85) 100%)' }}></div>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-900/15 rounded-full"></div>
        {/* <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full"></div> */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-purple-950/5 to-black/70 opacity-80"></div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 relative z-[1] overflow-x-hidden content-stable"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
              delayChildren: 0.2
            }
          }
        }}
      >
        <motion.div 
          className="space-y-8 sm:space-y-10 mt-8 md:mt-0 px-2 sm:px-4"
          variants={fadeInUpVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="space-y-4 sm:space-y-6" variants={staggeredFadeInVariant}>
            <motion.div 
              className="text-sm font-medium text-purple-500 uppercase tracking-wider inline-block"
              style={{ textShadow: '0 0 10px rgba(168, 85, 247, 0.3)' }}
              variants={staggeredFadeInVariant}
            >
              <span className="relative inline-block">
                <span className="relative z-10">Hello, I am</span>
                <motion.span 
                  className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-purple-500/50"
                  initial={{ width: 0 }}
                  animate={{ width: '100%', transition: { duration: 0.8, delay: 0.5, ease: "easeOut" } }}
                />
              </span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
              variants={staggeredFadeInVariant}
            >
              <motion.div 
                className="text-white cursor-pointer relative group inline-block"
                onClick={toggleSecretPanel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute -top-8 left-[75%] transform -translate-x-1/2 text-sm text-purple-400 whitespace-nowrap flex items-center gap-2">
                  <motion.span 
                    className="text-base rotate-[180deg]"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear" }}
                  >
                    👆
                  </motion.span>
                  <span className="text-xs font-medium bg-black/80 px-2 py-1 rounded-full border border-purple-500/30">
                    Click for fun fact!
                  </span>
                </div>
                <span className={audiowide.className}>ALI</span> <span className={`bg-white text-black px-2 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 ${audiowide.className}`}>HASNAAT</span>
              </motion.div>
            </motion.h1>

            <motion.div 
              className="mt-6"
              variants={staggeredFadeInVariant}
            >
              <span className={`border-2 border-white text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-default inline-block ${audiowide.className}`}>
                FULLSTACK & AI SYSTEMS DEVELOPER
              </span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-6 mt-6"
              variants={staggeredFadeInVariant}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-400 text-sm font-medium">Available for new projects</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300 text-sm">Based in Pakistan</span>
            </motion.div>

            <motion.div 
              className="space-y-8 md:space-y-6 mt-6 md:mt-2 px-2 py-4"
              variants={staggeredFadeInVariant}
            >
              <div className="space-y-6">
                <div className={`relative text-[1.2rem] sm:text-[1.3rem] text-gray-400 max-w-xl leading-relaxed ${vt323.className} p-4`}>
                  {/* Top-left corner bracket */}
                  <div className="absolute top-0 left-0 w-8 h-8">
                    <div className="absolute top-0 left-0 w-[3px] h-8 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] glow-effect"></div>
                    <div className="absolute top-0 left-0 w-8 h-[3px] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] glow-effect"></div>
                  </div>
                  
                  {/* Bottom-right corner bracket */}
                  <div className="absolute bottom-2 right-2 w-8 h-8">
                    <div className="absolute bottom-0 right-0 w-[3px] h-8 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] glow-effect"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-[3px] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] glow-effect"></div>
                  </div>

                  Building cutting-edge digital solutions with <span className="text-purple-400 font-semibold">AI-POWERED</span> technologies. Specializing in <span className="text-emerald-400 font-semibold">FULL-STACK</span> development, advanced <span className="text-sky-300 font-semibold">AI INTEGRATIONS</span>, and intelligent <span className="text-orange-400 font-semibold">AUTOMATION SYSTEMS</span>. Expert in creating scalable web applications, chatbots with <span className="text-cyan-400 font-semibold">RAG</span> & vector databases, and enterprise solutions using <span className="text-blue-400 font-semibold">LANGCHAIN</span>, <span className="text-green-400 font-semibold">GPT-4</span>, and modern cloud architecture. Transforming businesses through innovative technology.
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="space-y-2 sm:space-y-4 mt-6 sm:mt-10"
            variants={staggeredFadeInVariant}
          >
            <h3 className="text-lg sm:text-xl font-semibold text-white/90 px-1 mb-2 sm:mb-4 flex items-center gap-2">
              How I Work
              <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/30">AI-Enhanced</span>
            </h3>
            
            <div className="relative">
              <div className="absolute left-[20px] sm:left-[24px] top-[40px] bottom-[20px] w-[2px] bg-gradient-to-b from-blue-400/20 via-blue-500/40 to-blue-400/20 z-0 hidden sm:block">
                <div className="absolute inset-0 bg-blue-500/50 animate-pulse"></div>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="absolute left-[-4px] w-[10px] h-[10px] rounded-full bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.8)]" style={{ top: `calc(${i * 25}% + ${i * 25}px)` }}>
                    <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-50"></div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {workProcess.map((process, index) => (
                  <motion.div
                    key={process.step}
                    variants={fadeInUpVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all bg-black/40 hover:bg-black/50 relative z-10 h-[88px] sm:h-[100px] group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 shrink-0 relative">
                      <span className="text-base sm:text-xl group-hover:scale-110 transition-transform duration-300">{process.icon}</span>
                      <div className="absolute left-1/2 bottom-[-20px] w-[6px] h-[6px] rounded-full bg-blue-500/80 transform -translate-x-1/2 sm:hidden shadow-[0_0_5px_rgba(59,130,246,0.7)]"></div>
                      <div className="absolute left-1/2 top-[90%] h-[16px] w-[1px] bg-gradient-to-b from-blue-500/60 to-blue-500/0 transform -translate-x-1/2 sm:hidden"></div>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-purple-400/80">{process.step}</span>
                          <h4 className="font-medium text-sm sm:text-base text-white/90">{process.title}</h4>
                        </div>
                        <span className="text-[10px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded-full border border-purple-500/20 hidden sm:block">{process.aiFeature}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed line-clamp-2">{process.description}</p>
                    </div>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="absolute left-[20px] top-[35px] bottom-[20px] w-[1px] bg-gradient-to-b from-blue-400/10 via-blue-500/30 to-blue-400/10 z-0 sm:hidden"></div>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8"
            variants={staggeredFadeInVariant}
          >
            <Link href="/contact" className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition group flex items-center gap-2 text-sm sm:text-base">
              Let's Talk 
              <motion.span className="inline-block" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
            </Link>
            <Link href="/projects" className="border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-white hover:text-black transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
              View Projects
              <motion.span className="inline-block" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>→</motion.span>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={scaleInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-4 sm:gap-6"
        >
          <div className="text-center space-y-2 pt-2">
            <div className="mb-12 relative">
              <motion.div 
                variants={leakyCodeVariants}
                initial="hidden"
                animate="visible"
                className="absolute -top-10 left-0 right-0 overflow-hidden select-none pointer-events-none text-[10px] sm:text-xs font-mono text-purple-400/90 text-left px-2 z-20"
                style={{ marginTop: "-20px" }}
              >
                <div className="overflow-x-auto scrollbar-none whitespace-nowrap bg-black/40 p-2 rounded-md border border-purple-500/20">
                  <span className="text-purple-300/90">// AI Model Configuration</span><br />
                  <span className="text-purple-500/90">const</span> <span className="text-purple-300/90">proModeSettings</span> = {'{'}
                  <span className="text-emerald-400/90"> model: </span><span className="text-amber-300/90">'claude4opus'</span>,
                  <span className="text-emerald-400/90"> temperature: </span><span className="text-purple-300/90">0.6</span>,
                  <span className="text-emerald-400/90"> maxTokens: </span><span className="text-purple-300/90">6000</span>,
                  <span className="text-emerald-400/90"> topP: </span><span className="text-purple-300/90">0.8</span>,
                  <span className="text-emerald-400/90"> presencePenalty: </span><span className="text-purple-300/90">0</span>,
                  <span className="text-emerald-400/90"> frequencyPenalty: </span><span className="text-purple-300/90">0.1</span>,
                  <span className="text-emerald-400/90"> timeout: </span><span className="text-purple-300/90">15000</span>,
                  <span className="text-emerald-400/90"> thinkingTime: </span><span className="text-purple-300/90">800</span> {'}'}
                </div>
              </motion.div>
              <div className="mt-10 mb-0 flex flex-col items-center">
                <h2 className={`text-base sm:text-lg font-semibold tracking-wider bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-transparent bg-clip-text uppercase ${audiowide.className}`}>
                  NEX-DEVS ADVANCED AI CAPABILITIES
                </h2>
                <div className={`font-mono text-[10px] sm:text-xs text-purple-300/80 mt-1 flex items-center gap-1.5 ${vt323.className}`}>
                  <span className="text-purple-500/90">import</span> {'{'}
                  <span className="text-amber-300/90">optimizeModels</span>,
                  <span className="text-amber-300/90">enhanceCapabilities</span>,
                  <span className="text-amber-300/90">deployAI</span> {'}'}
                  <span className="text-purple-500/90">from</span>
                  <span className="text-green-400/90">'@nexdevs/ai-core'</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-[230px] sm:h-[270px] w-[95%] mx-auto group overflow-hidden rounded-xl sm:rounded-2xl content-stable">
              <div className="absolute inset-0 bg-transparent"></div>
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-purple-500/70"></div>
              <div className="absolute top-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent"></div>
              <div className="absolute bottom-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent"></div>
              
              <div className="h-full w-full p-3 sm:p-5 relative z-10">
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-medium flex items-center gap-1.5 sm:gap-2">
                      <span className="text-white/90">{currentSkillSet.category}</span>
                      <motion.span animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }} className="text-white/70">
                        {currentSkillSet.category === "Enterprise AI Partnerships" ? "🤝" : currentSkillSet.category === "LLM Expertise & Deployment" ? "🦙" : currentSkillSet.category === "AI Integration Technologies" ? "⛓️" : currentSkillSet.category === "AI Training & Optimization" ? "⚙️" : "👥"}
                      </motion.span>
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-white/80 font-medium">{isAutoAnimating ? "Auto" : "Manual"}</span>
                        <motion.button
                          onClick={toggleAutoAnimation}
                          className="relative h-6 rounded-full transition-all duration-300 overflow-hidden flex items-center px-1 border"
                          style={{
                            background: isAutoAnimating ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            width: '36px',
                            borderColor: isAutoAnimating ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <motion.div
                            animate={{ x: isAutoAnimating ? 18 : 0, backgroundColor: isAutoAnimating ? 'rgba(139, 92, 246, 0.9)' : 'rgba(255, 255, 255, 0.5)' }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-4 h-4 rounded-full"
                          />
                          <span className="sr-only">{isAutoAnimating ? 'Auto mode' : 'Manual mode'}</span>
                        </motion.button>
                      </div>
                      <div className="flex gap-1 sm:gap-1.5">
                        <motion.button onClick={prevSkillSet} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group" aria-label="Previous skill set">
                          <span className="text-xs sm:text-sm text-white/70 group-hover:text-white/90 transition-colors">←</span>
                        </motion.button>
                        <motion.button onClick={nextSkillSet} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group" aria-label="Next skill set">
                          <span className="text-xs sm:text-sm text-white/70 group-hover:text-white/90 transition-colors">→</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={activeSkillSet}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <div className="grid auto-rows-min gap-1.5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent pr-1 py-0.5">
                          {currentSkillSet.skills.map((skill: Skill, idx: number) => (
                            <motion.div key={skill.name} className="skill-item flex items-center gap-2 p-1.5 rounded-lg h-[42px]">
                              <div className={`skill-icon ${typeof skill.icon === 'string' && skill.icon.startsWith('http') ? 'w-10 h-10 bg-white' : 'w-10 h-10 bg-black/10'} flex items-center justify-center rounded-md border border-purple-500/30 group-hover:border-purple-500/50 transition-colors duration-200 p-1`}>
                                {typeof skill.icon === 'string' && skill.icon.startsWith('http') ? (
                                  <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" loading="lazy" />
                                ) : (
                                  <span className="text-lg">{skill.icon}</span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-white/90 text-xs font-medium group-hover:text-white/100 transition-colors">{skill.name}</span>
                                    <span className="text-[10px] text-white/80 font-medium tabular-nums bg-black/20 px-1.5 py-0.5 rounded-full border border-purple-500/30">{skill.level}%</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1 flex-1 bg-black/20 rounded-full overflow-hidden">
                                    <motion.div 
                                      className="h-full rounded-full relative"
                                      style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.6) 0%, rgba(168,85,247,0.7) 100%)" }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${skill.level}%`, transition: { duration: 0.4, delay: idx * 0.02, ease: "easeOut" } }}
                                    >
                                      <div className="absolute right-0 top-0 h-full w-[1px] bg-purple-300/80"></div>
                                    </motion.div>
                                  </div>
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.05 }} className="text-[8px] text-white/50 hidden sm:block">
                                    {skill.description && (
                                      <span className="whitespace-nowrap text-[8px] sm:text-[9px] text-white/50 truncate max-w-[100px] sm:max-w-[140px] block">{skill.description}</span>
                                    )}
                                  </motion.div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex justify-center gap-1.5 pt-2">
                    {aiSkills.map((_, idx: number) => (
                      <button key={idx} onClick={() => setActiveSkillSet(idx)} className="group flex flex-col items-center" aria-label={`Go to skill set ${idx + 1}`}>
                        <div className={`h-0.5 rounded-full transition-all duration-200 ${idx === activeSkillSet ? 'bg-purple-500 w-5' : 'bg-white/10 group-hover:bg-white/20 w-2.5'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 px-2">
            <motion.div className="border border-white/20 p-5 sm:p-6 rounded-xl hover:border-white transition-colors bg-black/30">
              <h4 className={`text-2xl sm:text-3xl font-bold text-white mb-2 ${audiowide.className}`}>50+</h4>
              <p className={`text-xs sm:text-sm text-gray-400 ${vt323.className}`}>Projects Completed</p>
            </motion.div>
            <motion.div className="border border-white/20 p-5 sm:p-6 rounded-xl hover:border-white transition-colors bg-black/30">
              <h4 className={`text-2xl sm:text-3xl font-bold text-white mb-2 ${audiowide.className}`}>4+</h4>
              <p className={`text-xs sm:text-sm text-gray-400 ${vt323.className}`}>Years Experience</p>
            </motion.div>
          </div>

          <motion.div className="space-y-3">
            <h4 className={`text-lg font-semibold text-white mb-3 text-center ${audiowide.className}`}>Skills & Expertise</h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
              {expertise.map((skill) => (
                <motion.div
                  key={skill.title}
                  className="relative p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group min-h-[100px] flex items-center justify-center"
                >
                  {skill.isNew && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <span className="bg-white/20 border border-white/30 text-white text-[8px] font-medium px-1 py-0.5 rounded-full">NEW</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center text-center space-y-2 w-full">
                    <div className="w-12 h-12 bg-gradient-to-b from-white to-gray-100 rounded-lg border border-purple-500/30 flex items-center justify-center mb-2 overflow-hidden hover:shadow-purple-500/20 transition-shadow duration-300 p-0">
                      {skill.imageUrl ? (
                        <Image src={skill.imageUrl} alt={skill.title} width={36} height={36} className="w-10 h-10 object-contain transform hover:scale-110 transition-transform duration-300" unoptimized={skill.imageUrl.startsWith('http')} />
                      ) : (
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                          <div className="w-6 h-6 bg-purple-500/20 rounded-md" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h5 className={`text-white text-sm font-semibold leading-tight ${audiowide.className}`}>{skill.title}</h5>
                      <p className={`text-gray-400 text-xs leading-tight opacity-80 ${vt323.className}`}>{skill.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUpVariant}
        className="w-full mt-12 sm:mt-16 max-w-7xl mx-auto relative"
      >
        <TechStackSection />
      </motion.div>

      <AnimatePresence mode="wait">
        {showSecretPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:fixed sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 bg-black/95 sm:rounded-xl border-t border-purple-500/50 sm:border w-full sm:w-[90%] sm:max-w-md mx-auto"
          >
            <div className="relative p-6">
              <button onClick={toggleSecretPanel} className="absolute right-4 top-4 sm:-top-3 sm:-right-3 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center text-white hover:bg-purple-500/40 transition-colors border-2 border-purple-500/50 text-lg">
                ×
              </button>
              <motion.div
                key={funFactIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-4 pt-2"
              >
                <div className="bg-gradient-to-r from-purple-500/20 via-purple-400/20 to-purple-500/20 p-5 rounded-lg border border-purple-500/30">
                  <span className="text-4xl sm:text-5xl block mb-2">{currentFunFact.icon}</span>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">{currentFunFact.title}</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 px-2 leading-relaxed">{currentFunFact.fact}</p>
                <button
                  onClick={nextFunFact}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 text-white text-sm font-medium border-2 border-purple-500/30 hover:border-purple-500/50 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Next Fun Fact</span>
                  <span className="text-lg">→</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
} 