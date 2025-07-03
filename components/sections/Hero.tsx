"use client"

import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useIsMobile } from '@/app/utils/deviceDetection'
import TechStackSection from "./TechStackSection"
import NeuralNetwork from '../animations/NeuralNetwork'

// Move static data outside component to prevent recreation
const expertise = [
  {
    title: "Website Development with Ai",
    description: "Full-stack development with modern AI technologies",
    imageUrl: "https://cdn1.vectorstock.com/i/1000x1000/62/55/web-developer-icon-on-white-background-flat-vector-19806255.jpg", // Using local image from public folder
    isNew: false
  },
  {
    title: "WordPress & Shopify",
    description: "E-commerce and CMS solutions",
    imageUrl: "https://www.binstellar.com/wp-content/uploads/2024/03/Group-36629.png",
    isNew: false
  },
  {
    title: "UI/UX Design",
    description: "Figma & Framer expert",
    imageUrl: "data:image/png;base64,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",
    isNew: false
  },
  {
    title: "SEO & Content",
    description: "Strategic content & optimization",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNEzlSETp19JIeAv_dyI5QIE_NF8sIflSVht5xx2D8_3t4aVeRLYyP7q7HaU2BgR34q3s&usqp=CAU",
    isNew: false
  },
  {
    title: "AI Chat Bot Integration",
    description: "Advanced AI chatbot solutions",
    imageUrl: "https://www.shutterstock.com/image-vector/simple-chat-bot-logo-icon-600nw-2449965521.jpg",
    isNew: true
  },
  {
    title: "AI Business Integration",
    description: "Seamless AI business processes",
    imageUrl: "https://as2.ftcdn.net/v2/jpg/09/88/50/11/1000_F_988501143_wJzQIHvY1B49pMp3QgiQDhtdfF3dU1Wv.jpg",
    isNew: true
  },
  {
    title: "AI Voice Assistant",
    description: "Ask AI voice-powered solutions",
    imageUrl: "https://cdn.vectorstock.com/i/500p/44/19/support-chatbot-icon-smiling-robot-vector-38664419.jpg",
    isNew: true
  },
  {
    title: "MOBILE APP Development (Ai Based App)",
    description: "Cross-platform native mobile experiences",
    imageUrl: "https://thumbs.dreamstime.com/b/mobile-app-icon-set-ui-ux-design-smartphone-applications-android-ios-interface-illustrations-mobile-app-icon-set-ui-ux-design-369815182.jpg",
    isNew: true
  }
]

const workProcess = [
  {
    step: "01",
    title: "Discovery & Planning",
    description: "Deep dive into requirements, tech stack selection, and project roadmap creation",
    icon: "🎯"
  },
  {
    step: "02",
    title: "Design & Architecture",
    description: "Creating scalable solutions with modern architecture patterns",
    icon: "⚡"
  },
  {
    step: "03",
    title: "Development & Testing",
    description: "Agile development with continuous integration and testing",
    icon: "🛠️"
  },
  {
    step: "04",
    title: "Launch & Support",
    description: "Smooth deployment and ongoing maintenance",
    icon: "🚀"
  }
]

const funFacts = [
  {
    icon: "🧙‍♂️",
    title: "Code Wizard",
    fact: "I once debugged a production issue while sleeping! (In my dreams, of course)"
  },
  {
    icon: "🎮",
    title: "Gaming Dev",
    fact: "I love adding creative features to my projects for users to discover"
  },
  {
    icon: "☕",
    title: "Coffee Powered",
    fact: "My code runs on a special fuel: Coffee.parseInt('espresso')"
  },
  {
    icon: "🌙",
    title: "Night Owl",
    fact: "Best code commits happen at 3 AM when the bugs are sleeping"
  },
  {
    icon: "🎵",
    title: "Code & Music",
    fact: "I listen to lofi beats while coding. It's my debugging soundtrack!"
  }
]

// AI-focused skills data with 4 slides
const aiSkills = [
  {
    category: "Enterprise AI Partnerships",
    skills: [
      { name: "OPENAI", level: 95, icon: "https://w7.pngwing.com/pngs/704/673/png-transparent-openai-chatgpt-logo.png", description: "GPT-4 & DALL-E integration specialist" },
      { name: "ANTHROPIC", level: 92, icon: "https://img.icons8.com/?size=100&id=H5H0mqCCr5AV&format=png&color=000000", description: "Claude 3 Opus implementation" },
      { name: "GOOGLE AI", level: 89, icon: "https://img.icons8.com/?size=100&id=rnK88i9FvAFO&format=png&color=000000", description: "Gemini Pro & PaLM API expert" },
      { name: "MISTRAL AI", level: 91, icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/mistral-color.png", description: "Mistral Large deployment" },
      { name: "GROK AI", level: 88, icon: "https://img.icons8.com/?size=100&id=USGXKHXKl9X7&format=png&color=000000", description: "Real-time market analysis" },
      { name: "DEEPSEEK", level: 90, icon: "https://img.icons8.com/?size=100&id=YWOidjGxCpFW&format=png&color=000000", description: "Code & chat implementation" },
      { name: "META AI", level: 87, icon: "https://img.icons8.com/?size=100&id=PvvcWRWxRKSR&format=png&color=000000", description: "Llama 2 & Code Llama expert" },
      { name: "PERPLEXITY", level: 89, icon: "https://img.icons8.com/?size=100&id=5WrDC03cg9ua&format=png&color=000000", description: "AI-powered search & research" },
      { name: "COHERE", level: 86, icon: "https://images.seeklogo.com/logo-png/51/2/cohere-logo-png_seeklogo-513871.png", description: "Command & Embed API specialist" },
      { name: "NVIDIA", level: 93, icon: "https://w7.pngwing.com/pngs/728/156/png-transparent-nvidia-flat-brand-logo-icon-thumbnail.png", description: "GPU acceleration & AI compute" },
      { name: "STABILITY AI", level: 88, icon: "https://www.arm.com/-/media/global/Why%20Arm/partner/Partner%20Ecosystem/catalog/stability-ai-/Logo_Black_Red_Dot.png?rev=8e4eac6c7a3c4e649deca9b821b388c8&revision=8e4eac6c-7a3c-4e64-9dec-a9b821b388c8", description: "Stable Diffusion & image generation" },
      { name: "INFLECTION AI", level: 87, icon: "https://media.licdn.com/dms/image/sync/v2/D4D27AQFjYf-pxIJPew/articleshare-shrink_800/articleshare-shrink_800/0/1732629799492?e=2147483647&v=beta&t=9RREaMKqZvaJuf6FmMHTyDKM4g6pn_5VGPks8cesURw", description: "Pi personal AI assistant" },
      { name: "RUNWAY ML", level: 89, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDXIK2WqGiQST-IzoCfRsLUP5IrFPBnCTEnA&s", description: "Gen-2 video generation models" },
      { name: "MANUS AI", level: 86, icon: "https://play-lh.googleusercontent.com/7RIeDBEnjVVn3d1yr441p7u0BK9eT8E6P9i__XYTcJAzOe7sqVgJp7pmlypqY9NBqjI" , description:"Advanced AI orchestration platform" },
      { name: "KIMI", level: 85, icon: "https://images.seeklogo.com/logo-png/61/2/kimi-logo-png_seeklogo-611650.png", description: "Contextual knowledge assistant" },
      { name: "QWEN", level: 87, icon: "https://opencv.org/wp-content/uploads/2025/01/MIhJKlK5yVR3axxgE7_gHL-rsKjliShJKd3asUqg5KDdEsdOGut-9mCW4Ti1x7i2y8zCkxeZHQFR00sQg6BfYA.png", description: "Alibaba's multilingual LLM" }
    ]
  },
  {
    category: "AI AUTOMATION TOOLS",
    skills: [
      { name: "N8N", level: 96, icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/n8n-color.png", description: "Enterprise workflow automation" },
      { name: "MAKE.COM", level: 94, icon: "https://cdn.freelogovectors.net/wp-content/uploads/2023/11/make-logo-freelogovectors.net_.png", description: "Advanced integrated workflows" },
      { name: "ZAPIER", level: 93, icon: "https://w7.pngwing.com/pngs/84/464/png-transparent-zapier-logo-world-wide-web-product-mobile-app-automation-text-orange-logo-thumbnail.png", description: "App integration specialist" },
      { name: "MICROSOFT POWER AUTOMATE", level: 92, icon: "https://store-images.s-microsoft.com/image/apps.24143.13592668300764735.55b49f05-a58f-437f-95f4-f51ea7542976.f30e5790-6318-41e4-86ef-6b813b3b2a17", description: "Enterprise RPA solutions" },
      { name: "WORKATO", level: 91, icon: "https://upload.wikimedia.org/wikipedia/en/9/97/Workato-logo.png", description: "Enterprise integration platform" },
      { name: "TRAY.IO", level: 90, icon: "https://logowik.com/content/uploads/images/trayio5490.jpg", description: "Advanced API integrations" },
      { name: "UIPATH", level: 89, icon: "https://seekvectors.com/files/download/Ui%20path-02.png", description: "Robotic process automation" },
      { name: "AUTOMATE.IO", level: 88, icon: "https://images.seeklogo.com/logo-png/48/2/automate-logo-png_seeklogo-485541.png", description: "Business workflow automation" },
      { name: "ACTIVECAMPAIGN", level: 87, icon: "https://images.seeklogo.com/logo-png/42/1/activecampaign-logo-png_seeklogo-428040.png", description: "Marketing automation expert" },
      { name: "APPSMITH", level: 86, icon: "https://pbs.twimg.com/profile_images/1303358775693197312/MP67Vhnv_400x400.png", description: "Low-code automation platform" }
    ]
  },
  {
    category: "LLM Expertise & Deployment",
    skills: [
      { name: "OLLAMA", level: 94, icon: "https://images.seeklogo.com/logo-png/59/2/ollama-logo-png_seeklogo-593420.png", description: "Local LLM deployment & optimization" },
      { name: "OPENROUTER", level: 92, icon: "https://images.seeklogo.com/logo-png/61/2/openrouter-logo-png_seeklogo-611674.png", description: "Multi-model routing & fallbacks" },
      { name: "HUGGING FACE", level: 90, icon: "https://w7.pngwing.com/pngs/839/288/png-transparent-hugging-face-favicon-logo-tech-companies-thumbnail.png", description: "Model fine-tuning & hosting" },
      { name: "REPLICATE", level: 88, icon: "https://logowik.com/content/uploads/images/replicate-ai23359.logowik.com.webp", description: "Cloud inference & model serving" },
      { name: "TOGETHER AI", level: 89, icon: "https://images.seeklogo.com/logo-png/61/2/together-ai-logo-png_seeklogo-611707.png", description: "Enterprise LLM infrastructure" },
      { name: "PERPLEXITY AI", level: 87, icon: "https://images.seeklogo.com/logo-png/61/1/perplexity-ai-icon-black-logo-png_seeklogo-611679.png", description: "Search-augmented generation" }
    ]
  },
  {
    category: "AI Integration Technologies",
    skills: [
      { name: "LANGCHAIN", level: 94, icon: "https://images.seeklogo.com/logo-png/61/1/langchain-icon-logo-png_seeklogo-611655.png", description: "Advanced agent frameworks" },
      { name: "LLAMAINDEX", level: 91, icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/llamaindex-color.png", description: "RAG & knowledge retrieval" },
      { name: "VECTOR DATABASES", level: 93, icon: "https://icons.veryicon.com/png/o/miscellaneous/streamline/database-39.png", description: "Pinecone, Chroma, Weaviate" },
      { name: "EMBEDDINGS", level: 89, icon: "https://static.thenounproject.com/png/3147500-200.png", description: "Text & image embedding systems" },
      { name: "LANGSMITH", level: 88, icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langsmith-color.png", description: "LLM app observability platform" },
      { name: "FLOWISE", level: 86, icon: "https://docs.flowiseai.com/~gitbook/image?url=https%3A%2F%2F4068692976-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FUiD7nOmFRK805sNuiieJ%252Fuploads%252FXxve37yNH63uTNoBYJ1Y%252FFlowise%2520Cropped%2520White%2520High%2520Res.png%3Falt%3Dmedia%26token%3De022b6af-b237-4724-9e4c-7b895cc3cdbe&width=768&dpr=4&quality=100&sign=8f7e6694&sv=2", description: "Visual LLM workflow builder" },
      { name: "SEMANTIC KERNEL", level: 85, icon: "https://devblogs.microsoft.com/semantic-kernel/wp-content/uploads/sites/78/2024/03/Large_SK_Logo.png", description: "Microsoft's AI orchestration" }
    ]
  },
  {
    category: "AI VOICE AGENTS",
    skills: [
      { name: "ELEVEN LABS", level: 95, icon: "https://www.drupal.org/files/project-images/elevenlabs.png", description: "Realistic voice synthesis & cloning" },
      { name: "GOOGLE SPEECH", level: 93, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS53Dp2fSoxMy2QZZJSw-BRl6Elna-20PeTmw&s", description: "Advanced speech recognition & TTS" },
      { name: "PLAY.HT", level: 91, icon: "https://www.traineasy.com/wp-content/uploads/2024/12/playCube-DarkMode.svg", description: "AI voice generation platform" },
      { name: "RESEMBLE AI", level: 89, icon: "https://pbs.twimg.com/profile_images/1496504056436727818/Flpn3gIT_400x400.jpg", description: "Voice cloning & emotion control" },
      { name: "WELLSAID LABS", level: 90, icon: "https://www.fahimai.com/wp-content/uploads/2024/09/CTA-22.png", description: "Enterprise voice production" },
      { name: "MURF AI", level: 88, icon: "https://mma.prnewswire.com/media/2561848/Murf_AI_Logo.jpg?p=facebook", description: "Studio-quality voice generation" },
      { name: "COQUI AI", level: 87, icon: "https://docs.coqui.ai/en/dev/_static/logo.png", description: "Open-source TTS solutions" }
    ]
  },
  {
    category: "AI Training & Optimization",
    skills: [
      { name: "MODEL FINE-TUNING", level: 90, icon: "⚙️", description: "Custom model adaptation" },
      { name: "PROMPT ENGINEERING", level: 93, icon: "✨", description: "Advanced prompt techniques" },
      { name: "INFERENCE OPTIMIZATION", level: 91, icon: "⚡", description: "Latency & throughput tuning" },
      { name: "QUANTIZATION", level: 87, icon: "📉", description: "Model size & performance balancing" }
    ]
  },
  {
    category: "Enterprise AI Solutions",
    skills: [
      { name: "MULTI-AGENT SYSTEMS", level: 92, icon: "👥", description: "Collaborative AI workflows" },
      { name: "CUSTOM AI WORKFLOWS", level: 89, icon: "🔧", description: "Business process integration" },
      { name: "REAL-TIME PROCESSING", level: 91, icon: "⏱️", description: "Streaming & event processing" },
      { name: "AI SECURITY & PRIVACY", level: 94, icon: "🔐", description: "Enterprise-grade safeguards" }
    ]
  }
]

// Pre-define animation variants with optimized values
const fadeInUpVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
}

const scaleInVariant = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 }
}

// Define sparkle animation with reduced complexity
const sparkleVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "linear"
    }
  }
}

// Optimize bounce animation
const bounceVariants = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "linear"
    }
  }
}

// Add optimized skill card animation
const skillCardVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    x: -10,
    transition: {
      duration: 0.1,
      ease: "easeIn"
    }
  }
}

// AI Model Settings - Leaky Code Effect
const proModeSettings = {
  model: 'claude4opus',
  temperature: 0.6,
  maxTokens: 6000,
  topP: 0.8,
  presencePenalty: 0,
  frequencyPenalty: 0.1,
  timeout: 15000,
  thinkingTime: 800,
}

// Leaky code animation variants
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

// Add type definitions for skill items
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

// Enhanced scroll optimization styles
const enhancedScrollStyles = `
  /* Core optimizations */
  .scroll-container {
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform;
    contain: content;
    scroll-behavior: smooth;
  }

  /* Smooth reveal animations */
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .reveal.active {
    opacity: 1;
    transform: translateY(0);
  }

  /* Prevent reload flicker */
  .no-reload {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }

  /* Smooth scroll sections */
  .scroll-section {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .scroll-section.in-view {
    opacity: 1;
    transform: translateY(0);
  }

  /* Prevent layout shifts */
  .content-stable {
    contain: layout style paint;
    content-visibility: auto;
    contain-intrinsic-size: 0 500px;
  }

  /* Smooth background parallax */
  .parallax-bg {
    transform: translateZ(0);
    will-change: transform;
    transition: transform 0.1s linear;
  }

  /* Enhanced sticky behavior */
  .enhanced-sticky {
    position: sticky;
    top: 0;
    z-index: 10;
    transform: translateZ(0);
  }

  /* Smooth skill animations */
  .skill-item {
    opacity: 1;
    transform: none;
    transition: background-color 0.3s ease;
  }

  .skill-item:hover {
    background-color: rgba(255, 255, 255, 0.03);
  }

  /* Prevent icon reload */
  .skill-icon {
    opacity: 1;
    transform: none;
    transition: transform 0.3s ease;
  }

  .skill-icon:hover {
    transform: scale(1.1);
  }

  /* Smooth text animations */
  .text-reveal {
    opacity: 1;
    transform: none;
  }

  /* Optimize gradients */
  .gradient-bg {
    transform: translateZ(0);
    will-change: transform;
    backface-visibility: hidden;
  }
`

// Add styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = enhancedScrollStyles
  document.head.appendChild(style)
}

export default function Hero() {
  const [showSecretPanel, setShowSecretPanel] = useState(false)
  const isMobile = useIsMobile()
  const [funFactIndex, setFunFactIndex] = useState(0)
  const [activeSkillSet, setActiveSkillSet] = useState(0)
  const [isAutoAnimating, setIsAutoAnimating] = useState(true)
  
  // Add new state for hero animation effects
  const [heroTransition, setHeroTransition] = useState({
    lift: 0,
    scale: 1,
    rotate: 0,
    glitching: false,
    switching: false
  })
  
  // Hero section ref for animation
  const heroSectionRef = useRef<HTMLDivElement>(null)

  // Listen for toggle progress events - optimized for 60fps
  useEffect(() => {
    let lastUpdate = 0;
    const updateInterval = 1000 / 60; // Limit to 60fps
    
    const handleToggleProgress = (event: CustomEvent) => {
      const now = performance.now();
      if (now - lastUpdate < updateInterval) return;
      lastUpdate = now;
      
      const { progress, isDragging } = event.detail;
      
      // Calculate lift, scale and rotation based on progress - more subtle
      const lift = progress > 0.1 && progress < 0.9 ? -6 * Math.sin(progress * Math.PI) : 0; // Reduced from -15 to -6
      const scale = 1 + (0.01 * Math.sin(progress * Math.PI)); // Reduced from 0.03 to 0.01
      const rotate = progress < 0.5 ? 
        0.15 * Math.sin(progress * Math.PI * 2) : // Reduced from 0.5 to 0.15
        -0.15 * Math.sin(progress * Math.PI * 2);
      
      setHeroTransition({
        lift,
        scale,
        rotate,
        glitching: isDragging && progress > 0.1 && progress < 0.9, // Less glitching
        switching: false
      });
    };
    
    const handleToggleFinished = (event: CustomEvent) => {
      const { hero } = event.detail;
      
      // Trigger switching animation when toggle is complete - more subtle
      setHeroTransition(prev => ({
        ...prev,
        switching: true,
        glitching: false
      }));
      
      // Reset after animation completes - faster transition
      setTimeout(() => {
        setHeroTransition({
          lift: 0,
          scale: 1,
          rotate: 0,
          glitching: false,
          switching: false
        });
      }, 400); // Reduced from 600ms
    };
    
    // Add event listeners
    window.addEventListener('heroToggleProgress', handleToggleProgress as EventListener);
    window.addEventListener('heroToggleFinished', handleToggleFinished as EventListener);
    
    return () => {
      window.removeEventListener('heroToggleProgress', handleToggleProgress as EventListener);
      window.removeEventListener('heroToggleFinished', handleToggleFinished as EventListener);
    };
  }, []);

  // Memoize handlers
  const nextFunFact = useCallback(() => {
    setFunFactIndex((prev) => (prev + 1) % funFacts.length)
  }, [])

  const toggleSecretPanel = useCallback(() => {
    setShowSecretPanel(prev => !prev)
  }, [])

  // Add carousel navigation
  const nextSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev + 1) % aiSkills.length)
  }, [])

  const prevSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev - 1 + aiSkills.length) % aiSkills.length)
  }, [])

  // Add auto-animation toggle handler
  const toggleAutoAnimation = useCallback(() => {
    setIsAutoAnimating(prev => !prev)
  }, [])

  // Add another callback to manually navigate in vertical direction
  const nextVerticalSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev + 1) % aiSkills.length)
  }, [])

  const prevVerticalSkillSet = useCallback(() => {
    setActiveSkillSet((prev) => (prev - 1 + aiSkills.length) % aiSkills.length)
  }, [])

  // Auto advance carousel only when auto-animation is enabled
  useEffect(() => {
    // Don't set up any interval if auto-animation is disabled
    if (!isAutoAnimating) return;
    
    let intervalId: NodeJS.Timeout;
    
    const startAutoAdvance = () => {
      // Clear any existing interval first
      if (intervalId) clearInterval(intervalId);
      
      // Set up new interval
      intervalId = setInterval(() => {
        // Only advance if document is visible and auto-animation is still enabled
        if (!document.hidden && isAutoAnimating) {
          nextSkillSet();
        }
      }, 8000); // 8 seconds interval
    };
    
    // Start auto-advance
    startAutoAdvance();
    
    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Clear interval when tab is hidden
        clearInterval(intervalId);
      } else if (isAutoAnimating) {
        // Restart interval when tab becomes visible again
        startAutoAdvance();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up function
    return () => {
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [nextSkillSet, isAutoAnimating]);

  // Memoize current fun fact
  const currentFunFact = useMemo(() => funFacts[funFactIndex], [funFactIndex])
  // Memoize current skill set
  const currentSkillSet: SkillSet = useMemo(() => aiSkills[activeSkillSet], [activeSkillSet])

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const mobileVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  // Enhanced scroll observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
          // Prevent re-animation on scroll
          entry.target.classList.add('no-reload')
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    // Observe all scrollable sections
    document.querySelectorAll('.scroll-section').forEach(element => {
      observer.observe(element)
    })

    // Add initial no-reload class to prevent first load animation
    document.querySelectorAll('.skill-item, .skill-icon, .text-reveal').forEach(element => {
      element.classList.add('no-reload')
    })

    return () => observer.disconnect()
  }, [])

  return (
    <motion.section
      ref={heroSectionRef}
      initial={false} // Prevent initial animation
      animate={{ 
        opacity: 1,
        y: heroTransition.lift,
        scale: heroTransition.scale,
        rotate: heroTransition.rotate,
        transition: {
          y: { type: "spring", stiffness: 400, damping: 40 }, // More responsive springs
          scale: { type: "spring", stiffness: 400, damping: 40 },
          rotate: { type: "spring", stiffness: 400, damping: 40 }
        }
      }}
      className={`relative min-h-screen flex flex-col justify-start items-center py-8 px-6 mt-8 sm:mt-10 bg-black scroll-container content-stable ${
        heroTransition.switching ? 'animate-pulse' : ''
      }`}
      style={{
        backfaceVisibility: 'hidden',
        perspective: '1000px',
        contentVisibility: 'auto',
        contain: 'style layout paint',
        boxShadow: heroTransition.glitching ? 
          '0 0 0 1px rgba(0,0,0,0.7), 0 0 0 2px rgba(168,85,247,0.4)' : // More subtle shadow
          'none',
        borderRadius: heroTransition.glitching ? '8px' : '0px', // Smaller radius
        willChange: 'transform, opacity', // Optimize for hardware acceleration
        transformStyle: 'preserve-3d' // Better 3D rendering
      }}
    >
      {/* Glitch effect borders - more subtle */}
      {heroTransition.glitching && (
        <>
          <motion.div 
            className="absolute inset-0 pointer-events-none border-[1px] border-black z-10"
            animate={{
              x: [-0.5, 0.75, -0.75, 0.5, -0.5, 0],
              opacity: [1, 0.9, 0.95, 0.85, 1],
              skewX: [0, 1, -1, 0.5, 0],
            }}
            transition={{
              duration: 0.3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ borderRadius: '8px' }}
          />
          <motion.div 
            className="absolute inset-0 pointer-events-none border-t-[1px] border-r-[1px] border-purple-500/40 z-10"
            animate={{
              x: [0.5, -0.75, 0.75, -0.5, 0.5, 0],
              y: [-0.5, 0.75, -0.75, 0.5, -0.5, 0],
              opacity: [0.7, 0.8, 0.75, 0.85, 0.7],
            }}
            transition={{
              duration: 0.35,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ borderRadius: '8px' }}
          />
          <motion.div 
            className="absolute inset-0 pointer-events-none border-b-[1px] border-l-[1px] border-purple-500/40 z-10"
            animate={{
              x: [-0.5, 0.75, -0.75, 0.5, -0.5, 0],
              y: [0.5, -0.75, 0.75, -0.5, 0.5, 0],
              opacity: [0.7, 0.8, 0.75, 0.85, 0.7],
            }}
            transition={{
              duration: 0.32,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{ borderRadius: '8px' }}
          />
        </>
      )}

      {/* Add Langflow Dialog API Background Image */}
      <div className="absolute inset-0 z-[0] pointer-events-none overflow-hidden opacity-10">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="https://www.langflow.org/_next/image?url=%2Fimages%2Fdialog-api.png&w=1920&q=75&dpl=dpl_61CbaxayM8My3RQJ5dKv9E7f3oq1"
            alt="Background Effect"
            width={100}
            height={120}
            className="object-contain opacity-20 scale-75 blur-[2px] mix-blend-luminosity"
            priority
          />
        </div>
      </div>

      {/* Neural Network Background - Top, Left, Right Areas */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <NeuralNetwork
          color="#a855f7"
          lineColor="#8b5cf6"
          pointCount={isMobile ? 40 : 60}
          connectionRadius={isMobile ? 200 : 250}
          speed={isMobile ? 0.15 : 0.5} // Further reduced speed for mobile
          containerBounds={true}
        />
      </div>

      {/* Optimize background layers with hardware acceleration */}
      <div className="fixed inset-0 bg-[#050509]/85 z-[-2] gradient-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050509]/60 via-[#07051a]/60 to-[#050509]/60 opacity-70 z-[-1] gradient-bg" />
      
      {/* Optimize gradient effects */}
      <div className="absolute inset-0 overflow-hidden z-[-1] hardware-accelerated">
        {/* Optimize vignette effect */}
        <div className="absolute inset-0 z-0 hardware-accelerated prevent-cls"
             style={{ 
               background: 'radial-gradient(circle, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.85) 100%)',
               transform: 'translate3d(0, 0, 0)',
               backfaceVisibility: 'hidden',
               contain: 'paint layout'
             }}></div>
        
        {/* Optimize gradient blobs with hardware acceleration */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[40px] hardware-accelerated prevent-cls"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-900/15 rounded-full blur-[40px] hardware-accelerated prevent-cls"></div>
        <div className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-900/10 rounded-full blur-[40px] hardware-accelerated prevent-cls"></div>
             
        {/* Optimize gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-purple-950/5 to-black/70 opacity-80 hardware-accelerated prevent-cls"></div>
      </div>

      {/* Main content - Optimize with containment */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 relative z-[1] overflow-x-hidden content-stable">
        {/* Left Column */}
        <div className="space-y-8 sm:space-y-10 mt-8 md:mt-0 px-2 sm:px-4 scroll-section">
          <motion.div 
            variants={fadeInUpVariant}
            initial="hidden"
            animate="visible"
            transition={{
              duration: isMobile ? 0.3 : 0.2,
              ease: "easeOut"
            }}
            className="space-y-4 sm:space-y-6 text-reveal"
          >
            {/* Optimized "HELLO, I AM" text with pure purple color and no background */}
            <motion.div 
              className="text-sm font-medium text-purple-500 uppercase tracking-wider inline-block"
              initial={{ opacity: 0, y: -5 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              style={{ 
                willChange: 'transform',
                transform: 'translate3d(0, 0, 0)',
                textShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
              }}
            >
              <span className="relative inline-block">
                <span className="relative z-10">Hello, I am</span>
                <motion.span 
                  className="absolute -bottom-0.5 left-0 right-0 h-[1px] bg-purple-500/50"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: '100%',
                    transition: {
                      duration: 0.5,
                      delay: 0.2,
                      ease: "easeOut"
                    }
                  }}
                />
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <motion.div 
                className="text-white cursor-pointer relative group inline-block"
                onClick={toggleSecretPanel}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ 
                  duration: isMobile ? 0.3 : 0.2,
                  ease: "easeOut"
                }}
              >
                {/* Fun Fact Indicator - Visible on all devices */}
                <div className="absolute -top-8 left-[75%] transform -translate-x-1/2 text-sm text-purple-400 whitespace-nowrap
                              flex items-center gap-2">
                  <motion.span 
                    className="text-base rotate-[180deg]"
                    animate={isMobile ? {} : { y: [0, -3, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear"
                    }}
                  >
                    👆
                  </motion.span>
                  <span className="text-xs font-medium bg-black/80 px-2 py-1 rounded-full border border-purple-500/30 backdrop-blur-sm">
                    Click for fun fact!
                  </span>
                </div>
                
                ALI <span className="bg-white text-black px-2 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">HASNAAT</span>
              </motion.div>
              <div className="block mt-6 md:mt-4">
                <span className="border-2 border-white text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base tracking-widest hover:bg-white hover:text-black transition-all duration-300 cursor-default inline-block">
                  FULLSTACK & AI SYSTEMS DEVELOPER
                </span>
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    delay: 0.2,
                    duration: isMobile ? 0.3 : 0.2,
                    ease: "easeOut"
                  }}
                  className="relative inline-flex items-center ml-2 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-full blur-sm transform group-hover:scale-110 transition-transform duration-300"></div>
                  <span className="relative px-2 py-0.5 text-[10px] font-medium bg-black/50 text-purple-300 rounded-full border border-purple-500/30 backdrop-blur-sm
                                 group-hover:text-purple-200 group-hover:border-purple-500/50 transition-all duration-300 tracking-wider flex items-center gap-1">
                    <motion.span 
                      animate={isMobile ? {} : { scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={isMobile ? "" : "animate-pulse"}
                    >
                      ✨
                    </motion.span>
                    Ai-Is OUR TOP PRIORITY
                  </span>
                </motion.div>
              </div>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.05,
                duration: 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="space-y-8 md:space-y-6 mt-6 md:mt-2 px-2 py-4"
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)'
              }}
              suppressHydrationWarning
            >
              <div className="space-y-6">
                <div className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed">
                  Crafting exceptional digital experiences through clean code, innovative solutions, and intelligent AI integration — leveraging tools like LangChain, GPT, and NLP to build smarter, scalable systems.
                </div>
                <div className="flex flex-wrap gap-3 items-center text-sm text-gray-400">
                  <span className="flex items-center gap-2 px-3 py-2 bg-black/30 rounded-lg border border-white/10">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Available for new projects
                  </span>
                  <span className="hidden sm:inline px-2">•</span>
                  <span className="px-3 py-2 bg-black/30 rounded-lg border border-white/10">Based in Pakistan</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Work Process - Mobile Optimized */}
          <div className="space-y-2 sm:space-y-6 mt-6 sm:mt-12">
            <h3 className="text-lg sm:text-xl font-semibold text-white/90 px-1 mb-2 sm:mb-4">How I Work</h3>
            <div className="grid grid-cols-1 gap-2 sm:gap-4">
              {workProcess.map((process, index) => (
                <motion.div
                  key={process.step}
                  variants={fadeInUpVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl border border-white/10 
                           hover:border-purple-500/50 transition-all bg-white/5 hover:bg-white/10"
                >
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/10 
                               border border-purple-500/20 shrink-0">
                    <span className="text-base sm:text-xl">{process.icon}</span>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-purple-400/80">{process.step}</span>
                      <h4 className="font-medium text-sm sm:text-base text-white/90">{process.title}</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{process.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link 
              href="/contact" 
              className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-100 transition group flex items-center gap-2 text-sm sm:text-base"
            >
              Let's Talk 
              <motion.span 
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Link>
            <Link 
              href="/projects" 
              className="border-2 border-white text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-white hover:text-black transition flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              View Projects
              <motion.span 
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </div>

        {/* Right Column - Mobile Optimized */}
        <motion.div 
          variants={isMobile ? mobileVariants : scaleInVariant}
          initial="hidden"
          animate="visible"
          transition={{ duration: isMobile ? 0.3 : 0.5 }}
          className="flex flex-col gap-4 sm:gap-6 scroll-section"
        >
          {/* Replace the Text Showcase Section with Tech Skills Carousel */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-2 pt-2"
          >
            {/* Professional heading above the box with leaky code effect */}
            <div className="mb-12 relative">
              <motion.div 
                variants={leakyCodeVariants}
                initial="hidden"
                animate="visible"
                className="absolute -top-10 left-0 right-0 overflow-hidden select-none pointer-events-none text-[10px] sm:text-xs font-mono text-purple-400/90 text-left px-2 z-20"
                style={{ marginTop: "-20px" }}
              >
                <div className="overflow-x-auto scrollbar-none whitespace-nowrap bg-black/40 backdrop-blur-sm p-2 rounded-md border border-purple-500/20">
                  <span className="text-purple-300/90">// AI Model Configuration</span><br />
                  <span className="text-purple-500/90">const</span> <span className="text-purple-300/90">proModeSettings</span> = {'{'}
                  <span className="text-emerald-400/90"> model: </span>
                  <span className="text-amber-300/90">'claude4opus'</span>,
                  <span className="text-emerald-400/90"> temperature: </span>
                  <span className="text-purple-300/90">0.6</span>,
                  <span className="text-emerald-400/90"> maxTokens: </span>
                  <span className="text-purple-300/90">6000</span>,
                  <span className="text-emerald-400/90"> topP: </span>
                  <span className="text-purple-300/90">0.8</span>,
                  <span className="text-emerald-400/90"> presencePenalty: </span>
                  <span className="text-purple-300/90">0</span>,
                  <span className="text-emerald-400/90"> frequencyPenalty: </span>
                  <span className="text-purple-300/90">0.1</span>,
                  <span className="text-emerald-400/90"> timeout: </span>
                  <span className="text-purple-300/90">15000</span>,
                  <span className="text-emerald-400/90"> thinkingTime: </span>
                  <span className="text-purple-300/90">800</span> {'}'}
                </div>
              </motion.div>
              <div className="mt-10 mb-0 flex flex-col items-center">
                <h2 className="text-base sm:text-lg font-semibold tracking-wider bg-gradient-to-r from-purple-400 via-purple-300 to-purple-500 text-transparent bg-clip-text uppercase">
                  NEX-DEVS ADVANCED AI CAPABILITIES
                </h2>
                <div className="font-mono text-[10px] sm:text-xs text-purple-300/80 mt-1 flex items-center gap-1.5">
                  <span className="text-purple-500/90">import</span> {'{'}
                  <span className="text-amber-300/90">optimizeModels</span>,
                  <span className="text-amber-300/90">enhanceCapabilities</span>,
                  <span className="text-amber-300/90">deployAI</span> {'}'}
                  <span className="text-purple-500/90">from</span>
                  <span className="text-green-400/90">'@nexdevs/ai-core'</span>
                </div>
              </div>
            </div>
            
            {/* Optimized skills showcase with pure frosted glass effect */}
            <div className="relative h-[230px] sm:h-[270px] w-[95%] mx-auto group overflow-hidden rounded-xl sm:rounded-2xl content-stable">
              {/* Pure frosted glass effect - optimized layers */}
              <div className="absolute inset-0 backdrop-blur-2xl bg-transparent"></div>
              <div className="absolute inset-0 backdrop-blur-xl bg-black/5"></div>
              
              {/* Subtle gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Purple neon border with subtle glow */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl border-2 border-purple-500/70 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
              
              {/* Purple neon accent lines */}
              <div className="absolute top-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent"></div>
              <div className="absolute bottom-0 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-purple-400/80 to-transparent"></div>
              
              <div className="h-full w-full p-3 sm:p-5 relative z-10">
                <div className="h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <h3 className="text-sm sm:text-base font-medium flex items-center gap-1.5 sm:gap-2">
                      <span className="text-white/90">{currentSkillSet.category}</span>
                      <motion.span 
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          repeatDelay: 3 
                        }}
                        className="text-white/70"
                      >
                        {currentSkillSet.category === "Enterprise AI Partnerships" ? "🤝" : 
                         currentSkillSet.category === "LLM Expertise & Deployment" ? "🦙" :
                         currentSkillSet.category === "AI Integration Technologies" ? "⛓️" :
                         currentSkillSet.category === "AI Training & Optimization" ? "⚙️" : "👥"}
                      </motion.span>
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Enhanced auto/manual toggle with neon effect */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-white/80 font-medium">{isAutoAnimating ? "Auto" : "Manual"}</span>
                        <motion.button
                          onClick={toggleAutoAnimation}
                          className="relative h-6 rounded-full transition-all duration-300 overflow-hidden flex items-center px-1 border"
                          style={{
                            background: isAutoAnimating ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                            width: '36px',
                            borderColor: isAutoAnimating ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.2)',
                            boxShadow: isAutoAnimating ? '0 0 5px rgba(139, 92, 246, 0.5)' : 'none'
                          }}
                        >
                          <motion.div
                            animate={{
                              x: isAutoAnimating ? 18 : 0,
                              backgroundColor: isAutoAnimating ? 'rgba(139, 92, 246, 0.9)' : 'rgba(255, 255, 255, 0.5)',
                              boxShadow: isAutoAnimating ? '0 0 5px rgba(139, 92, 246, 0.8)' : 'none'
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-4 h-4 rounded-full"
                          />
                          <span className="sr-only">{isAutoAnimating ? 'Auto mode' : 'Manual mode'}</span>
                        </motion.button>
                      </div>

                      {/* Compact navigation controls */}
                      <div className="flex gap-1 sm:gap-1.5">
                        <motion.button 
                          onClick={prevSkillSet}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/10
                                   border border-white/10 hover:border-purple-500/30
                                   transition-all duration-300 group"
                          aria-label="Previous skill set"
                        >
                          <span className="text-xs sm:text-sm text-white/70 group-hover:text-white/90 transition-colors">←</span>
                        </motion.button>
                        <motion.button 
                          onClick={nextSkillSet}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-1 sm:p-1.5 rounded-lg bg-white/5 hover:bg-white/10
                                   border border-white/10 hover:border-purple-500/30
                                   transition-all duration-300 group"
                          aria-label="Next skill set"
                        >
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
                        style={{ 
                          willChange: 'transform, opacity',
                          transform: 'translate3d(0, 0, 0)',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <div className="grid auto-rows-min gap-1.5 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent pr-1 py-0.5"
                             style={{ contain: 'paint layout' }}>
                          {currentSkillSet.skills.map((skill: Skill, idx: number) => (
                            <motion.div
                              key={skill.name}
                              initial={false} // Prevent initial animation
                              className="skill-item flex items-center gap-2 p-1.5 rounded-lg h-[42px]"
                              style={{
                                willChange: 'transform',
                                transform: 'translateZ(0)',
                                contain: 'layout paint'
                              }}
                            >
                              <div className={`skill-icon ${typeof skill.icon === 'string' && skill.icon.startsWith('http') ? 'w-10 h-10 bg-white' : 'w-10 h-10 bg-black/10'} flex items-center justify-center rounded-md
                                           border border-purple-500/30 group-hover:border-purple-500/50
                                           transition-colors duration-200 p-1`}>
                                {typeof skill.icon === 'string' && skill.icon.startsWith('http') ? (
                                  <img
                                    src={skill.icon}
                                    alt={skill.name}
                                    className="w-8 h-8 object-contain"
                                    loading="lazy"
                                    style={{ 
                                      filter: 'brightness(1.1) contrast(1.3) saturate(1.1)',
                                      transform: 'translateZ(0)'
                                    }}
                                  />
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
                                      style={{
                                        background: "linear-gradient(90deg, rgba(139,92,246,0.6) 0%, rgba(168,85,247,0.7) 100%)",
                                        willChange: 'width, transform',
                                        transform: 'translate3d(0, 0, 0)',
                                        backfaceVisibility: 'hidden'
                                      }}
                                      initial={{ width: 0 }}
                                      animate={{ 
                                        width: `${skill.level}%`,
                                        transition: { 
                                          duration: 0.4,
                                          delay: idx * 0.02,
                                          ease: "easeOut"
                                        }
                                      }}
                                    >
                                      <div className="absolute right-0 top-0 h-full w-[1px] bg-purple-300/80"></div>
                                    </motion.div>
                                  </div>
                                  <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 + idx * 0.05 }}
                                    className="text-[8px] text-white/50 hidden sm:block"
                                  >
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

                  {/* Optimized carousel indicators */}
                  <div className="flex justify-center gap-1.5 pt-2">
                    {aiSkills.map((skillSet, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveSkillSet(idx)}
                        className="group flex flex-col items-center"
                        aria-label={`Go to ${skillSet.category} skills`}
                        style={{ 
                          transform: 'translateZ(0)',
                          backfaceVisibility: 'hidden'
                        }}
                      >
                        <div 
                          className={`h-0.5 rounded-full transition-all duration-200 ${
                            idx === activeSkillSet 
                              ? 'bg-purple-500 w-5' 
                              : 'bg-white/10 group-hover:bg-white/20 w-2.5'
                          }`}
                          style={{ 
                            willChange: 'width, background-color',
                            transform: 'translateZ(0)'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 px-2 scroll-section">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="border border-white/20 p-5 sm:p-6 rounded-xl hover:border-white transition-colors bg-black/30 backdrop-blur-sm shadow-lg"
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)'
              }}
            >
              <h4 className="text-2xl sm:text-3xl font-bold text-white mb-2">50+</h4>
              <p className="text-xs sm:text-sm text-gray-400">Projects Completed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.15,
                duration: 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="border border-white/20 p-5 sm:p-6 rounded-xl hover:border-white transition-colors bg-black/30 backdrop-blur-sm shadow-lg"
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)'
              }}
            >
              <h4 className="text-2xl sm:text-3xl font-bold text-white mb-2">4+</h4>
              <p className="text-xs sm:text-sm text-gray-400">Years Experience</p>
            </motion.div>
          </div>

          {/* Skills Section - Bento Layout Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: 0.15,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="space-y-3 scroll-section"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <h4 className="text-lg font-semibold text-white mb-3 text-center">Skills & Expertise</h4>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-fr">
              {expertise.map((skill, index) => (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.25 + index * 0.03,
                    duration: 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{
                    willChange: 'transform, opacity',
                    transform: 'translate3d(0, 0, 0)',
                    contain: 'layout paint style',
                    backfaceVisibility: 'hidden'
                  }}
                  className="relative p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group min-h-[100px] flex items-center justify-center"
                >
                  {skill.isNew && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <span className="backdrop-blur-md bg-white/20 border border-white/30 text-white text-[8px] font-medium px-1 py-0.5 rounded-full shadow-lg">
                        NEW
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col items-center text-center space-y-2 w-full">
                    <div className="w-12 h-12 bg-gradient-to-b from-white to-gray-100 rounded-lg border border-purple-500/30 flex items-center justify-center mb-2 overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300 p-0">
                      {skill.imageUrl ? (
                        <Image
                          src={skill.imageUrl}
                          alt={skill.title}
                          width={36}
                          height={36}
                          className="w-10 h-10 object-contain transform hover:scale-110 transition-transform duration-300"
                          unoptimized={skill.imageUrl.startsWith('http')}
                          style={{
                            filter: 'contrast(1.1) brightness(1.05)',
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                          <div className="w-6 h-6 bg-purple-500/20 rounded-md" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-white text-sm font-semibold leading-tight">{skill.title}</h5>
                      <p className="text-gray-400 text-xs leading-tight opacity-80">{skill.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Tech Stack Section */}
      <motion.div
        initial={false} // Prevent initial animation
        className="w-full mt-12 sm:mt-16 max-w-7xl mx-auto relative scroll-section"
      >
        <TechStackSection />
      </motion.div>

      {/* Fun Facts Modal - Mobile Optimized */}
      <AnimatePresence>
        {showSecretPanel && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:fixed sm:top-1/2 sm:left-1/2 
                      sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2
                      bg-black/95 sm:rounded-xl border-t border-purple-500/50 sm:border
                      backdrop-blur-lg w-full sm:w-[90%] sm:max-w-md mx-auto 
                      shadow-2xl shadow-purple-500/20"
          >
            <div className="relative p-6">
              <div className="absolute right-4 top-4 sm:-top-3 sm:-right-3">
                <button 
                  onClick={toggleSecretPanel}
                  className="w-8 h-8 bg-black/80 rounded-full flex items-center justify-center 
                            text-white hover:bg-purple-500/40 transition-colors 
                            border-2 border-purple-500/50 shadow-lg text-lg"
                >
                  ×
                </button>
              </div>
              
              <motion.div
                key={funFactIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="text-center space-y-4 pt-2"
              >
                <div className="bg-gradient-to-r from-purple-500/20 via-purple-400/20 to-purple-500/20 
                              p-5 rounded-lg border border-purple-500/30">
                  <span className="text-4xl sm:text-5xl block mb-2">{currentFunFact.icon}</span>
                  <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                    {currentFunFact.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-gray-300 px-2 leading-relaxed">
                  {currentFunFact.fact}
                </p>
                <button
                  onClick={nextFunFact}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-purple-600/20 
                           rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 
                           transition-all duration-300 text-white text-sm font-medium 
                           border-2 border-purple-500/30 hover:border-purple-500/50 
                           active:scale-95 shadow-lg shadow-purple-500/20
                           flex items-center justify-center gap-2"
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
