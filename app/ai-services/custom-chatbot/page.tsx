'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Info, Check, X, Bot, Cpu, Brain, Sparkles, Code, Database, Globe, Shield, Cloud, Zap, Settings, Users, Lock, Clock, Book, FileText, Mic, Volume2, ChevronRight, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RequirementsModal from '@/app/components/RequirementsModal';
import { useRequirementsModal } from '@/app/hooks/useRequirementsModal';
import Image from 'next/image';
import NeuralNetwork from '@/components/animations/NeuralNetwork';

// AI Models and terms for background effect
const AI_TERMS = [
  'GPT-4', 'BERT', 'LLaMA', 'Claude', 'NLP', 'Transformers',
  'Neural Networks', 'Deep Learning', 'RAG', 'Vector DB',
  'Embeddings', 'Attention', 'Fine-tuning', 'Prompt Engineering'
];

// Neon string paths
const NEON_PATHS = [
  'M0,50 Q25,0 50,50 T100,50',
  'M0,20 Q60,80 100,20',
  'M0,80 Q40,20 100,80',
  'M0,35 Q50,65 100,35'
];

// Add glitch animation keyframes at the top after imports
const glitchKeyframes = `
@keyframes glitch {
  0% {
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    transform: translate(0);
  }
  2% {
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
    transform: translate(-2px);
  }
  4% {
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
    transform: translate(2px);
  }
  6% {
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
    transform: translate(0);
  }
  8% {
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    transform: translate(-1px);
  }
  10% {
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    transform: translate(0);
  }
  12% {
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    transform: translate(3px);
  }
  14% {
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
    transform: translate(0);
  }
  16% {
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
    transform: translate(-1px);
  }
  18% {
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    transform: translate(0);
  }
  20% {
    clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
    transform: translate(1px);
  }
  100% {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transform: translate(0);
  }
}`;

// Add these performance optimization styles at the top of the file after existing styles
const performanceStyles = `
  /* Performance Optimizations */
  .performance-layer {
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
    will-change: transform;
  }

  .smooth-scroll {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  .hardware-accelerated {
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    transform-style: preserve-3d;
    will-change: transform, opacity;
  }

  @media screen and (min-width: 768px) {
    .performance-layer {
      transform: translate3d(0, 0, 0);
    }
  }

  /* Optimize animations */
  @property --neural-opacity {
    syntax: '<number>';
    initial-value: 0;
    inherits: false;
  }

  @property --neural-scale {
    syntax: '<number>';
    initial-value: 1;
    inherits: false;
  }
`;

// Add this new component before the main component
const AddOnsNeuralNetwork = () => {
  // Optimize node generation with fewer nodes for better performance
  const nodes = useMemo(() => {
    const nodeCount = 12; // Reduced for better performance
    return Array.from({ length: nodeCount }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 2 + Math.random() * 1.5, // Slightly reduced variation
      pulseDelay: Math.random() * 2,
      color: [
        'rgba(139, 92, 246, 0.9)',
        'rgba(59, 130, 246, 0.9)',
        'rgba(236, 72, 153, 0.9)',
        'rgba(16, 185, 129, 0.9)',
        'rgba(245, 158, 11, 0.9)'
      ][Math.floor(Math.random() * 5)]
    }));
  }, []);

  // Optimize connection generation
  const connections = useMemo(() => {
    const lines = [];
    nodes.forEach((node, i) => {
      // Limit connections per node for better performance
      const maxConnectionsPerNode = 3;
      let connectionsForNode = 0;
      
      nodes.slice(i + 1).forEach((target) => {
        if (connectionsForNode >= maxConnectionsPerNode) return;
        
        const distance = Math.sqrt(
          Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2)
        );
        
        if (distance < 30) {
          connectionsForNode++;
          lines.push({
            id: `${node.id}-${target.id}`,
            source: node,
            target,
            particleDelay: Math.random() * 2,
            gradient: [
              ['rgba(139, 92, 246, 0.7)', 'rgba(236, 72, 153, 0.7)'],
              ['rgba(59, 130, 246, 0.7)', 'rgba(16, 185, 129, 0.7)'],
              ['rgba(245, 158, 11, 0.7)', 'rgba(236, 72, 153, 0.7)'],
              ['rgba(16, 185, 129, 0.7)', 'rgba(139, 92, 246, 0.7)']
            ][Math.floor(Math.random() * 4)]
          });
        }
      });
    });
    return lines;
  }, [nodes]);

  return (
    <>
      <style jsx global>{performanceStyles}</style>
      <div className="absolute inset-0 overflow-hidden opacity-80 performance-layer">
        <svg 
          width="100%" 
          height="100%" 
          className="absolute inset-0 hardware-accelerated"
          style={{
            shapeRendering: 'geometricPrecision',
            textRendering: 'geometricPrecision'
          }}
        >
          <defs>
            {connections.map((connection, index) => (
              <linearGradient
                key={`gradient-${connection.id}`}
                id={`lineGradient-${connection.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={connection.gradient[0]} />
                <stop offset="50%" stopColor={connection.gradient[1]} />
                <stop offset="100%" stopColor={connection.gradient[0]} />
              </linearGradient>
            ))}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
            </filter>
          </defs>

          <g className="hardware-accelerated">
            {connections.map((connection) => (
              <g key={connection.id} className="hardware-accelerated">
                <motion.line
                  x1={`${connection.source.x}%`}
                  y1={`${connection.source.y}%`}
                  x2={`${connection.target.x}%`}
                  y2={`${connection.target.y}%`}
                  stroke={`url(#lineGradient-${connection.id})`}
                  strokeWidth="1"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: [0, 1],
                    opacity: [0.4, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "linear"
                  }}
                />
                <motion.circle
                  r="1.5"
                  filter="url(#glow)"
                  initial={{ 
                    cx: `${connection.source.x}%`,
                    cy: `${connection.source.y}%`,
                    opacity: 0 
                  }}
                  animate={{
                    cx: [`${connection.source.x}%`, `${connection.target.x}%`],
                    cy: [`${connection.source.y}%`, `${connection.target.y}%`],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: connection.particleDelay,
                    ease: "linear"
                  }}
                  style={{ fill: connection.gradient[0] }}
                />
              </g>
            ))}
          </g>

          <g className="hardware-accelerated">
            {nodes.map((node) => (
              <g key={node.id} className="hardware-accelerated">
                <motion.circle
                  cx={`${node.x}%`}
                  cy={`${node.y}%`}
                  r={node.size}
                  fill={node.color}
                  filter="url(#glow)"
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: node.pulseDelay,
                    ease: "linear"
                  }}
                />
              </g>
            ))}
          </g>
        </svg>
      </div>
    </>
  );
};

// Add this new component for side animations
const SideNeuralNetwork = ({ side }: { side: 'left' | 'right' }) => {
  const nodes = useMemo(() => {
    const nodeCount = 8; // Fewer nodes for side panels
    return Array.from({ length: nodeCount }).map((_, i) => ({
      id: i,
      x: side === 'left' ? 20 + Math.random() * 40 : 40 + Math.random() * 40,
      y: 10 + Math.random() * 80,
      size: 1.5 + Math.random(),
      pulseDelay: Math.random() * 2,
      color: [
        'rgba(139, 92, 246, 0.9)', // Purple
        'rgba(59, 130, 246, 0.9)',  // Blue
        'rgba(236, 72, 153, 0.9)'   // Pink
      ][Math.floor(Math.random() * 3)]
    }));
  }, []);

  const connections = useMemo(() => {
    const lines = [];
    nodes.forEach((node, i) => {
      const maxConnections = 2;
      let connectionCount = 0;
      
      nodes.slice(i + 1).forEach((target) => {
        if (connectionCount >= maxConnections) return;
        
        const distance = Math.sqrt(
          Math.pow(node.x - target.x, 2) + Math.pow(node.y - target.y, 2)
        );
        
        if (distance < 25) {
          connectionCount++;
          lines.push({
            id: `${node.id}-${target.id}`,
            source: node,
            target,
            particleDelay: Math.random() * 2,
            gradient: [
              ['rgba(139, 92, 246, 0.6)', 'rgba(236, 72, 153, 0.6)'],
              ['rgba(59, 130, 246, 0.6)', 'rgba(139, 92, 246, 0.6)']
            ][Math.floor(Math.random() * 2)]
          });
        }
      });
    });
    return lines;
  }, [nodes]);

  return (
    <div className={`absolute top-0 ${side === 'left' ? '-left-24' : '-right-24'} h-full w-24 overflow-hidden opacity-70 performance-layer`}>
      <svg 
        width="100%" 
        height="100%" 
        className="absolute inset-0 hardware-accelerated"
        style={{
          shapeRendering: 'geometricPrecision',
          textRendering: 'geometricPrecision'
        }}
      >
        <defs>
          {connections.map((connection) => (
            <linearGradient
              key={`gradient-${connection.id}`}
              id={`sideGradient-${connection.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={connection.gradient[0]} />
              <stop offset="100%" stopColor={connection.gradient[1]} />
            </linearGradient>
          ))}
          <filter id="sideGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feComposite in="SourceGraphic" in2="coloredBlur" operator="over" />
          </filter>
        </defs>

        <g className="hardware-accelerated">
          {connections.map((connection) => (
            <g key={connection.id} className="hardware-accelerated">
              <motion.line
                x1={`${connection.source.x}%`}
                y1={`${connection.source.y}%`}
                x2={`${connection.target.x}%`}
                y2={`${connection.target.y}%`}
                stroke={`url(#sideGradient-${connection.id})`}
                strokeWidth="0.8"
                filter="url(#sideGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1],
                  opacity: [0.3, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear"
                }}
              />
              <motion.circle
                r="1.2"
                filter="url(#sideGlow)"
                initial={{ 
                  cx: `${connection.source.x}%`,
                  cy: `${connection.source.y}%`,
                  opacity: 0 
                }}
                animate={{
                  cx: [`${connection.source.x}%`, `${connection.target.x}%`],
                  cy: [`${connection.source.y}%`, `${connection.target.y}%`],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: connection.particleDelay,
                  ease: "linear"
                }}
                style={{ fill: connection.gradient[0] }}
              />
            </g>
          ))}
        </g>

        <g className="hardware-accelerated">
          {nodes.map((node) => (
            <g key={node.id} className="hardware-accelerated">
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size}
                fill={node.color}
                filter="url(#sideGlow)"
                initial={{ scale: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: node.pulseDelay,
                  ease: "linear"
                }}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};

// Add this new component for the neural network background
const ImageSectionNeuralNetwork = () => {
  return (
    <div className="absolute inset-0 -z-10 opacity-30">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Neural Network Lines */}
        <g className="neural-lines">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.line
              key={`line-${i}`}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="#3B82F6"
              strokeWidth="0.2"
              strokeOpacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

// Improve the LeakyCodeAnimation component to be more visible and fixed at top right
const LeakyCodeAnimation = () => {
  return (
    <div className="absolute top-12 right-12 w-80 overflow-hidden z-0 pointer-events-none">
      <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-blue-500/20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="font-mono text-xs text-blue-400 whitespace-pre leading-relaxed"
        >
          {`{ 
  model: 'anthropic/claude 4 opus', 
  priority: 3, 
  timeout: 6000, 
  maxRetries: 1, 
  temperature: 0.5, 
  maxTokens: 1500, 
  isEnabled: true, 
  description: 'Mistral Small - Efficient fallback option' 
}, 
notificationEnabled: true, 
notificationMessage: 'Switched to premium backup AI model for enhanced performance', 
maxFallbackAttempts: 3, 
fallbackDelay: 500`}
        </motion.div>
      </div>
    </div>
  );
};

// Add this section after the main heading and before the pricing section
const NexiousChatbotShowcase = () => {
  return (
    <section className="w-full py-16 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            Experience Next-Gen AI Conversation
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-gray-300 text-lg max-w-3xl mx-auto"
          >
            Intelligent, context-aware interactions powered by our advanced multi-model architecture
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Neural Network Animation Background - more visible */}
          <div className="absolute inset-0 -z-10">
            <NeuralNetwork 
              color="#a855f7" 
              lineColor="#8b5cf6" 
              pointCount={25} 
              connectionRadius={180} 
              speed={0.15} 
              containerBounds={true}
            />
          </div>
          
          {/* Leaky Code Animation */}
          <LeakyCodeAnimation />

          {/* Main Image Container - larger and more modern */}
          <div className="md:col-span-2 relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="aspect-video relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.3)] border border-violet-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-900/10 to-blue-900/10 backdrop-blur-sm z-0" />
              <Image
                src="https://ik.imagekit.io/u7ipvwnqb/40_1x_shots_so.png"
                alt="Nexious AI Chatbot Interface"
                fill
                className="object-contain z-13"
                priority
                sizes="(max-width: 800px) 120vw, 70vw"
                quality={100}
              />
              {/* Add pulse glow effect around the image */}
              <motion.div 
                className="absolute inset-0 rounded-2xl border-2 border-purple-500/40 z-20 pointer-events-none"
                animate={{ 
                  boxShadow: [
                    "0 0 0px rgba(139, 92, 246, 0.2)", 
                    "0 0 20px rgba(139, 92, 246, 0.6)", 
                    "0 0 0px rgba(139, 92, 246, 0.2)"
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </div>

          {/* Side Images Container */}
          <div className="flex flex-col gap-6 z-10">
            {/* Feature Image 1 */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="aspect-video relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.2)] border border-blue-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm z-0" />
              <Image
                src="https://ik.imagekit.io/u7ipvwnqb/NEX.png?updatedAt=1750760413852"
                alt="Nexious AI Advanced Features"
                fill
                className="object-contain z-11"
                sizes="(max-width: 790px) 110vw, 38vw"
                quality={100}
              />
            </motion.div>

            {/* Analytics Dashboard Image */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="aspect-video relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.2)] border border-blue-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-purple-900/10 backdrop-blur-sm z-0" />
              <Image
                src="https://ik.imagekit.io/u7ipvwnqb/90_1x_shots_so.png"
                alt="Nexious Analytics Dashboard"
                fill
                className="object-contain z-10"
                sizes="(max-width: 768px) 100vw, 33vw"
                quality={100}
              />
            </motion.div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-6 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/10"
          >
            <h3 className="text-xl font-semibold text-blue-400">Natural Conversations</h3>
            <p className="mt-2 text-gray-300">Advanced NLP for human-like interactions and understanding</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="p-6 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/10"
          >
            <h3 className="text-xl font-semibold text-blue-400">Multi-Language Support</h3>
            <p className="mt-2 text-gray-300">Communicate in over 20+ languages seamlessly</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="p-6 rounded-xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-500/10"
          >
            <h3 className="text-xl font-semibold text-blue-400">Custom Integration</h3>
            <p className="mt-2 text-gray-300">Easily integrate with your existing systems</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Add this new section after the NexiousChatbotShowcase section
const VectorDatabaseSection = () => {
  return (
    <section className="w-full py-16 px-4 md:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
          >
            NEXIOUS WITH VECTOR DATABASE FLOWCHART
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-gray-300 text-lg max-w-3xl mx-auto"
          >
            How our advanced vector embeddings transform AI responses for unparalleled accuracy
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-10 relative">
          {/* Neural Network Animation Background */}
          <div className="absolute inset-0 -z-10">
            <NeuralNetwork 
              color="#0ea5e9" 
              lineColor="#38bdf8" 
              pointCount={20} 
              connectionRadius={150} 
              speed={0.1} 
              containerBounds={true}
            />
          </div>

          {/* Vector Database Process Sequence */}
          <div className="space-y-16">
            {/* Step 1: Embedding Generation */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="md:w-1/2 order-2 md:order-1">
                <h3 className="text-2xl font-bold text-cyan-300 mb-4">1. Vector Embedding Generation</h3>
                <p className="text-gray-300 mb-4">
                  Nexious transforms your knowledge base into high-dimensional vector embeddings using state-of-the-art neural networks. This process captures semantic relationships between concepts, enabling the AI to understand context beyond simple keyword matching.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="p-1 bg-cyan-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Converts text into 1536-dimensional embeddings</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 bg-cyan-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Preserves semantic meaning and relationships</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 bg-cyan-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Optimized for fast similarity search</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(56,189,248,0.3)] border border-cyan-500/30"
                >
                  <Image
                    src="https://miro.medium.com/v2/resize:fit:1400/1*UKacqI3ncCja31PrFo3arA.png"
                    alt="Vector Embedding Generation Process"
                    width={700}
                    height={400}
                    className="object-cover"
                    quality={100}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Step 2: Vector Search */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="md:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(124,58,237,0.3)] border border-purple-500/30"
                >
                  <Image
                    src="https://miro.medium.com/v2/resize:fit:1400/1*QbIcorKW23yEWfnpNdyq-g.png"
                    alt="Vector Database Similarity Search"
                    width={700}
                    height={400}
                    className="object-cover"
                    quality={100}
                  />
                </motion.div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-purple-300 mb-4">2. Similarity Search & Context Retrieval</h3>
                <p className="text-gray-300 mb-4">
                  When a user asks a question, Nexious converts it into the same vector space and performs lightning-fast similarity searches to find the most relevant information from your knowledge base, regardless of specific wording.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="p-1 bg-purple-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Nearest-neighbor search finds the most relevant content</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 bg-purple-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Handles semantic variations and paraphrasing</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 bg-purple-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Sub-millisecond query time even with millions of vectors</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Step 3: AI Response Generation */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-8"
            >
              <div className="md:w-1/2 order-2 md:order-1">
                <h3 className="text-2xl font-bold text-blue-300 mb-4">3. Enhanced AI Response Generation</h3>
                <p className="text-gray-300 mb-4">
                  Nexious combines retrieved context with our advanced AI models to generate responses that are accurate, relevant, and tailored specifically to your business knowledge—eliminating hallucinations and generic answers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="p-1 bg-blue-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Multi-model AI architecture ensures factual accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 bg-blue-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Continuous learning improves responses over time</span>
                  </li>
                  <li className="flex items-start">
                    <div className="p-1 bg-blue-500/20 rounded-full mr-2 mt-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm">Maintains context across complex conversations</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7 }}
                  className="relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-blue-500/30"
                >
                  <Image
                    src="https://media.licdn.com/dms/image/v2/D5612AQF9Uy45XrcB6g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1711603877449?e=2147483647&v=beta&t=MkZX6kINb_RBFUrYb2Wgg7sM9LM05JxuODz2j3XlFgc"
                    alt="Enhanced AI Response Generation"
                    width={700}
                    height={400}
                    className="object-cover"
                    quality={100}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 p-6 bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-blue-900/30 rounded-xl border border-cyan-500/20 backdrop-blur-sm"
          >
            <h3 className="text-xl font-bold text-white mb-4 text-center">Why Vector Database Technology Makes the Difference</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-black/20 rounded-lg border border-cyan-500/10">
                <h4 className="text-cyan-300 font-semibold mb-2">Unmatched Accuracy</h4>
                <p className="text-gray-300 text-sm">Finds contextually relevant information beyond exact keyword matches, delivering precise answers to complex questions.</p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-purple-500/10">
                <h4 className="text-purple-300 font-semibold mb-2">Lightning Performance</h4>
                <p className="text-gray-300 text-sm">Millisecond response times with optimized indexes, even as your knowledge base grows to millions of entries.</p>
              </div>
              <div className="p-4 bg-black/20 rounded-lg border border-blue-500/10">
                <h4 className="text-blue-300 font-semibold mb-2">Continuous Improvement</h4>
                <p className="text-gray-300 text-sm">Self-improving system learns from interactions to enhance relevance ranking and response quality over time.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Corrected ScrollArrow component
const ScrollArrow = () => {
  const { scrollYProgress } = useScroll();
  const arrowProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  return (
    <motion.div 
      className="fixed right-10 z-30 hidden xl:flex flex-col items-center justify-center"
      style={{ 
        top: "50%", 
        transform: "translateY(-50%)",
        opacity: 0.8
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 0.8, x: 0 }}
      transition={{ duration: 0.7, delay: 1.5 }}
    >
      <div className="text-white font-medium mb-4 text-sm tracking-wide transform -rotate-90 origin-center whitespace-nowrap">
        SEE OUR PRICING
      </div>
      
      <div className="h-48 w-px bg-gradient-to-b from-cyan-400 to-purple-500 relative">
        <motion.div 
          className="absolute top-0 left-0 w-full"
          style={{ 
            height: `${arrowProgress.get() * 100}%`,
            background: "linear-gradient(to bottom, #38bdf8, #8b5cf6)"
          }}
        />
      </div>
      
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M12 5L12 19M12 19L5 12M12 19L19 12" 
            stroke="url(#arrow-gradient)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <defs>
            <linearGradient id="arrow-gradient" x1="12" y1="5" x2="12" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
};

// Add a ScrollIndicator component that updates on scroll
const ScrollIndicator = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const scrolled = (position / height) * 100;
      setScrollPosition(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <motion.div 
      className="fixed right-10 z-30 hidden xl:flex flex-col items-center justify-center"
      style={{ 
        top: "50%", 
        transform: "translateY(-50%)",
        opacity: 0.8
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 0.8, x: 0 }}
      transition={{ duration: 0.7, delay: 1.5 }}
    >
      <div className="text-white font-medium mb-4 text-sm tracking-wide transform -rotate-90 origin-center whitespace-nowrap">
        SEE OUR PRICING
      </div>
      
      <div className="h-48 w-px bg-gradient-to-b from-cyan-400 to-purple-500 relative">
        <motion.div 
          className="absolute top-0 left-0 w-full"
          style={{ 
            height: `${scrollPosition}%`,
            background: "linear-gradient(to bottom, #38bdf8, #8b5cf6)"
          }}
        />
      </div>
      
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M12 5L12 19M12 19L5 12M12 19L19 12" 
            stroke="url(#scroll-arrow-gradient)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <defs>
            <linearGradient id="scroll-arrow-gradient" x1="12" y1="5" x2="12" y2="19" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default function CustomChatbotPage() {
  const router = useRouter();
  const pageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: pageRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [activeTechDetails, setActiveTechDetails] = useState<string | null>(null);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Transform your customer experience with our intelligent, custom-built AI chatbots';

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [voiceBotEnabled, setVoiceBotEnabled] = useState<{ advanced: boolean; enterprise: boolean }>({
    advanced: false,
    enterprise: false
  });

  // Use the new requirements modal hook with one-time display logic
  const {
    isOpen: showRequirementsModal,
    shouldShow: shouldShowModal,
    openModal: openRequirementsModal,
    closeModal: closeRequirementsModal
  } = useRequirementsModal({
    autoShow: false, // Don't auto-show, let user trigger it
    showOnce: true,  // Only show once per session/visit
    sessionOnly: false // Persist across browser sessions
  });

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen(prev => !prev);
  }, []);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(prev => {
      if (index > fullText.length) {
        clearInterval(timer);
          return prev;
      }
        index++;
        return fullText.slice(0, index);
      });
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const toggleTechDetails = useCallback((plan: string) => {
    setActiveTechDetails(prev => prev === plan ? null : plan);
  }, []);

  const fadeIn = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }), []);

  const AiBackgroundPattern = useCallback(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div className="absolute inset-0 grid grid-cols-8 gap-4">
        {Array.from({ length: 32 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: Math.random() }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="w-full h-8 bg-gradient-to-r from-purple-500/20 to-transparent"
          />
        ))}
      </div>
    </div>
  ), []);

  const FloatingIcons = useCallback(() => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[Bot, Cpu, Brain, Sparkles].map((Icon, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.2,
            scale: 1,
            x: [0, Math.random() * 50 - 25],
            y: [0, Math.random() * 50 - 25]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.5
          }}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            willChange: 'transform'
          }}
        >
          <Icon size={20} className="text-purple-400" />
        </motion.div>
      ))}
    </div>
  ), []);

  // Background mesh animation
  const BackgroundMesh = useCallback(() => (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-30">
      <div className="absolute w-full h-full">
        <svg width="100%" height="100%" className="opacity-20">
          <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 40L40 0M0 0L40 40" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#mesh)" />
        </svg>
      </div>
    </div>
  ), []);

  // Floating AI terms
  const FloatingTerms = useCallback(() => (
    <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
      {AI_TERMS.map((term, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: index * 0.5,
            ease: "linear"
          }}
          className="absolute text-purple-300/20 font-mono text-sm"
          style={{
            left: `${(index * 7) % 100}%`,
            top: `${(index * 13) % 100}%`,
            willChange: 'transform, opacity'
          }}
        >
          {term}
        </motion.div>
      ))}
    </div>
  ), []);

  // Neural network effect
  const NeuralNetworkEffect = useCallback(() => (
    <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="opacity-10">
        <defs>
          <radialGradient id="neuralGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </radialGradient>
        </defs>
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.circle
            key={i}
            cx={`${(i * 15) + 10}%`}
            cy="50%"
            r="2"
            fill="url(#neuralGrad)"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 2, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </svg>
    </div>
  ), []);

  // Neon Strings Background
  const NeonStringsEffect = useCallback(() => (
    <div className="fixed inset-0 -z-10 overflow-hidden opacity-40 pointer-events-none">
      <svg width="100%" height="100%" className="absolute">
        <defs>
          <linearGradient id="neonBlue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(6, 182, 212, 0.1)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.3)" />
            <stop offset="100%" stopColor="rgba(6, 182, 212, 0.1)" />
          </linearGradient>
          <linearGradient id="neonGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
            <stop offset="50%" stopColor="rgba(34, 197, 94, 0.3)" />
            <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
          </linearGradient>
          <filter id="neonGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {NEON_PATHS.map((path, index) => (
          <g key={index} className="opacity-30">
            <motion.path
              d={path}
              stroke={index % 2 === 0 ? "url(#neonBlue)" : "url(#neonGreen)"}
              strokeWidth="0.5"
              fill="none"
              filter="url(#neonGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.3, 0.8, 0.3],
                pathOffset: [0, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: index * 2
              }}
              style={{ willChange: 'transform' }}
            />
          </g>
        ))}
      </svg>
    </div>
  ), []);

  // Cyberpunk Mesh Grid
  const CyberpunkMesh = useCallback(() => (
    <div className="fixed inset-0 -z-15 overflow-hidden opacity-20 pointer-events-none">
      <div className="absolute w-full h-full">
        <svg width="100%" height="100%">
          <pattern 
            id="cyberpunkGrid" 
            x="0" 
            y="0" 
            width="50" 
            height="50" 
            patternUnits="userSpaceOnUse"
          >
            <motion.path 
              d="M50 0L50 50M0 50L50 50" 
              stroke="rgba(6, 182, 212, 0.3)"
              strokeWidth="0.5"
              initial={{ strokeDasharray: 50, strokeDashoffset: 50 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.path 
              d="M0 0L50 0M0 0L0 50" 
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="0.5"
              initial={{ strokeDasharray: 50, strokeDashoffset: 50 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#cyberpunkGrid)" />
        </svg>
      </div>
    </div>
  ), []);

  // Floating AI Icons with Neon Effect
  const NeonIcons = useCallback(() => (
    <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
      {[Bot, Brain, Cpu, Database].map((Icon, index) => (
        <motion.div
          key={index}
          className="absolute"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: index * 1.5,
            ease: "linear"
          }}
          style={{
            left: `${(index * 25) % 100}%`,
            top: `${(index * 30) % 100}%`,
            willChange: 'transform',
            filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))'
          }}
        >
          <Icon 
            size={24} 
            className={index % 2 === 0 ? "text-cyan-400" : "text-green-400"}
            style={{ filter: 'brightness(1.2)' }}
          />
        </motion.div>
      ))}
    </div>
  ), []);

  // Gradient text animation for heading
  const gradientTextClass = "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 animate-gradient-x";

  // Optimized Neural Network Background Animation for Header
  const NeuralNetworkBackground = useCallback(() => {
    // Generate optimized network nodes with better spacing
    const nodes = useMemo(() => {
      const nodeCount = 14; // Reduced from 18 for cleaner appearance
      const positions = [];
      const minDistance = 20; // Minimum distance between nodes for better spacing

      for (let i = 0; i < nodeCount; i++) {
        let attempts = 0;
        let validPosition = false;
        let newNode;

        while (!validPosition && attempts < 50) {
          newNode = {
            id: i,
            x: 15 + Math.random() * 70, // Keep nodes away from edges
            y: 15 + Math.random() * 70,
            delay: Math.random() * 2.5,
            size: 2 + Math.random() * 1.5
          };

          // Check distance from existing nodes
          validPosition = positions.every(existingNode => {
            const distance = Math.sqrt(
              Math.pow(newNode.x - existingNode.x, 2) +
              Math.pow(newNode.y - existingNode.y, 2)
            );
            return distance >= minDistance;
          });

          attempts++;
        }

        if (validPosition) {
          positions.push(newNode);
        }
      }
      return positions;
    }, []);

    // Generate connections with reduced density (15-20% fewer connections)
    const connections = useMemo(() => {
      const conns = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = Math.sqrt(
            Math.pow(nodes[i].x - nodes[j].x, 2) +
            Math.pow(nodes[i].y - nodes[j].y, 2)
          );
          // Reduced connection range from 45 to 35 for fewer connections
          if (distance < 35 && Math.random() > 0.2) { // 20% chance to skip connection
            conns.push({
              id: `${i}-${j}`,
              from: nodes[i],
              to: nodes[j],
              delay: Math.random() * 1.8,
              particleSpeed: 2 + Math.random() * 1.5
            });
          }
        }
      }
      return conns;
    }, [nodes]);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-45 performance-optimized"
           style={{ willChange: 'transform' }}>
        <svg width="100%" height="100%" className="absolute inset-0 hw-accelerated"
             style={{ willChange: 'transform' }}>
          <defs>
            {/* Enhanced neon glow filters */}
            <filter id="neuralGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Enhanced gradient definitions for connections */}
            <linearGradient id="connectionGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.7)" />
              <stop offset="50%" stopColor="rgba(6, 182, 212, 0.9)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.7)" />
            </linearGradient>

            <linearGradient id="connectionGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.7)" />
              <stop offset="50%" stopColor="rgba(59, 130, 246, 0.9)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0.7)" />
            </linearGradient>

            {/* Enhanced radial gradient for nodes */}
            <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 1)" />
              <stop offset="70%" stopColor="rgba(6, 182, 212, 0.8)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.3)" />
            </radialGradient>

            {/* Particle gradients */}
            <radialGradient id="particleGradient1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 1)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </radialGradient>

            <radialGradient id="particleGradient2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 1)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
            </radialGradient>
          </defs>

          {/* Render enhanced connections */}
          {connections.map((connection) => (
            <g key={connection.id}>
              <motion.line
                x1={`${connection.from.x}%`}
                y1={`${connection.from.y}%`}
                x2={`${connection.to.x}%`}
                y2={`${connection.to.y}%`}
                stroke={connection.id.includes('0') || connection.id.includes('1') ?
                  "url(#connectionGradient1)" : "url(#connectionGradient2)"}
                strokeWidth="1.2"
                filter="url(#neuralGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 0],
                  opacity: [0.4, 0.9, 0.4]
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1], // Custom easing for smoother animation
                  delay: connection.delay
                }}
                style={{ willChange: 'transform, opacity' }}
              />

              {/* Multiple animated particles with different speeds */}
              <motion.circle
                r="2"
                fill={connection.id.includes('0') ? "url(#particleGradient1)" : "url(#particleGradient2)"}
                filter="url(#particleGlow)"
                initial={{
                  cx: `${connection.from.x}%`,
                  cy: `${connection.from.y}%`,
                  opacity: 0
                }}
                animate={{
                  cx: [`${connection.from.x}%`, `${connection.to.x}%`, `${connection.from.x}%`],
                  cy: [`${connection.from.y}%`, `${connection.to.y}%`, `${connection.from.y}%`],
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{
                  duration: connection.particleSpeed,
                  repeat: Infinity,
                  ease: "linear",
                  delay: connection.delay + 0.3
                }}
                style={{ willChange: 'transform, opacity' }}
              />

              {/* Secondary particle for enhanced effect */}
              <motion.circle
                r="1"
                fill="rgba(255, 255, 255, 0.8)"
                filter="url(#particleGlow)"
                initial={{
                  cx: `${connection.to.x}%`,
                  cy: `${connection.to.y}%`,
                  opacity: 0
                }}
                animate={{
                  cx: [`${connection.to.x}%`, `${connection.from.x}%`, `${connection.to.x}%`],
                  cy: [`${connection.to.y}%`, `${connection.from.y}%`, `${connection.to.y}%`],
                  opacity: [0, 0.8, 0]
                }}
                transition={{
                  duration: connection.particleSpeed * 1.3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: connection.delay + 1
                }}
                style={{ willChange: 'transform, opacity' }}
              />
            </g>
          ))}

          {/* Render enhanced nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              {/* Main node */}
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size}
                fill="url(#nodeGradient)"
                filter="url(#neuralGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  delay: node.delay
                }}
                style={{ willChange: 'transform, opacity' }}
              />

              {/* Node pulse ring */}
              <motion.circle
                cx={`${node.x}%`}
                cy={`${node.y}%`}
                r={node.size + 2}
                fill="none"
                stroke="rgba(139, 92, 246, 0.4)"
                strokeWidth="0.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: node.delay + 0.5
                }}
                style={{ willChange: 'transform, opacity' }}
              />
            </g>
          ))}
        </svg>
      </div>
    );
  }, []);

  // Update the drawer component with optimized animations
  const NexiousDrawer = () => (
    <div className="fixed inset-0 z-40 pointer-events-none">
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto"
              onClick={() => setIsDrawerOpen(false)}
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ translateX: '-100%' }}
              animate={{ translateX: '0%' }}
              exit={{ translateX: '-100%' }}
              transition={{
                type: 'tween',
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="fixed top-[80px] left-0 h-[calc(100vh-160px)] w-[65%] max-w-md
                         bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98
                         backdrop-blur-2xl overflow-hidden rounded-tr-3xl rounded-br-3xl pointer-events-auto
                         border-r border-t border-b border-slate-700/30
                         shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_80px_rgba(139,92,246,0.1)]
                         drawer-mobile performance-optimized"
              style={{ willChange: 'transform' }}
            >
              {/* Content Container */}
              <div className="h-full overflow-y-auto drawer-scroll performance-optimized">
                <div className="p-6 space-y-6 hw-accelerated">
                  {/* Enhanced Header */}
                  <motion.div
                    className="flex justify-between items-start mb-2"
                    variants={{
                      hidden: { opacity: 0, y: -20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                        Nexious AI Architecture
                      </h2>
                      <p className="text-sm text-slate-400 font-medium">
                        Advanced multi-model AI system overview
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-300 group ml-4"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={20} className="text-slate-400 group-hover:text-slate-200 transition-colors" />
                    </motion.button>
                  </motion.div>

                  {/* Enhanced content sections */}
                  <motion.div className="space-y-5">
                    {/* AI Models Section */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl p-5
                               border border-slate-600/30 hover:border-slate-500/50
                               transition-all duration-300 backdrop-blur-sm"
                    >
                      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                        <Brain className="mr-3 text-purple-400" size={18} />
                        Multi-Model AI System
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-purple-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Cpu size={14} className="text-purple-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Parallel processing across 10 specialized AI models for enhanced accuracy
                          </span>
                        </li>
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-purple-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Shield size={14} className="text-purple-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Triple-redundancy failover system ensures 99.9% uptime
                          </span>
                        </li>
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-purple-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Sparkles size={14} className="text-purple-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Advanced NLP with contextual understanding and sentiment analysis
                          </span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Training Process Section */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl p-5
                               border border-slate-600/30 hover:border-slate-500/50
                               transition-all duration-300 backdrop-blur-sm"
                    >
                      <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                        <Database className="mr-3 text-cyan-400" size={18} />
                        Training & Development
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-cyan-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Users size={14} className="text-cyan-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Specialized ML engineering team with 5+ years experience
                          </span>
                        </li>
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-cyan-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Clock size={14} className="text-cyan-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Active training phase with continuous model optimization
                          </span>
                        </li>
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-cyan-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Database size={14} className="text-cyan-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Real-time learning pipeline with feedback integration
                          </span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Coming Soon Section */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 rounded-xl p-5
                               border border-slate-600/30 hover:border-slate-500/50
                               transition-all duration-300 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                          <Zap className="mr-3 text-emerald-400" size={18} />
                          Nexious Pro Features
                        </h3>
                        <span className="px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-xs font-medium rounded-full">
                          Q2 2025
                        </span>
                      </div>
                      <ul className="space-y-3">
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-emerald-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Code size={14} className="text-emerald-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Extended 128K context with advanced code analysis capabilities
                          </span>
                        </li>
                        <li className="flex items-start text-slate-300">
                          <div className="p-1.5 bg-emerald-500/15 rounded-lg mr-3 mt-0.5 flex-shrink-0">
                            <Brain size={14} className="text-emerald-400" />
                          </div>
                          <span className="text-sm leading-relaxed">
                            Next-generation models with multimodal understanding
                          </span>
                        </li>
                      </ul>
                    </motion.div>

                    {/* Technical Notice */}
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="bg-slate-800/40 rounded-xl p-4 border border-slate-600/20"
                    >
                      <p className="text-slate-400 text-xs leading-relaxed">
                        <strong className="text-slate-300">Development Status:</strong> Nexious is currently in active development with ongoing model training and optimization. Performance improvements are deployed continuously as our AI systems evolve.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  // Compact purple-themed side tab button
  const SideTab = () => {
    const tabVariants = {
      visible: { translateX: 0, opacity: 1 },
      hidden: { translateX: -100, opacity: 0 }
    };

    return (
      <div className="fixed left-0 top-24 z-50">
        <motion.div
          initial={false}
          animate={isDrawerOpen ? 'hidden' : 'visible'}
          variants={tabVariants}
          transition={{
            duration: 0.25,
            ease: [0.4, 0, 0.2, 1],
            type: "tween"
          }}
          className="pointer-events-auto"
        >
          <motion.button
            onClick={toggleDrawer}
            whileHover={{ scale: 1.03, x: 3 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 pl-1.5 pr-3 py-3
                       bg-gradient-to-r from-purple-900/90 via-purple-800/80 to-transparent
                       backdrop-blur-xl rounded-r-2xl
                       border-t border-r border-b border-purple-500/30
                       hover:border-purple-400/50 hover:pr-4
                       transition-all duration-300 group relative overflow-hidden
                       shadow-lg hover:shadow-xl hover:shadow-purple-500/20
                       performance-optimized optimized-transition touch-optimized
                       tab-mobile sticky"
            style={{ 
              willChange: 'transform',
              position: 'sticky',
              top: '24px'
            }}
          >
            {/* Purple glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/15 via-purple-500/10 to-transparent
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Purple accent line with glow */}
            <div className="w-0.5 h-10 bg-gradient-to-b from-purple-400 via-purple-300 to-purple-400
                           rounded-full mr-2 group-hover:w-1 group-hover:shadow-lg
                           group-hover:shadow-purple-400/50 transition-all duration-300" />

            {/* Compact text content */}
            <div className="flex flex-col items-start">
              <span className="text-[10px] text-purple-300 font-medium mb-0.5 tracking-wider uppercase
                             group-hover:text-purple-200 transition-colors duration-300">
                Discover
              </span>
              <span className="text-xs text-slate-200 font-semibold tracking-wide leading-tight
                             group-hover:text-white transition-colors duration-300">
                Nexious Architecture
              </span>
            </div>

            {/* Compact icon with purple theme */}
            <motion.div
              className="ml-1"
              whileHover={{ rotate: 12, scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Info size={14} className="text-purple-400 group-hover:text-purple-300
                                       group-hover:drop-shadow-lg group-hover:drop-shadow-purple-400/50
                                       transition-all duration-300" />
            </motion.div>

            {/* Purple glow effect on hover */}
            <div className="absolute inset-0 rounded-r-2xl opacity-0 group-hover:opacity-100
                           bg-gradient-to-r from-transparent to-purple-500/5
                           transition-opacity duration-300 pointer-events-none" />
          </motion.button>
        </motion.div>
      </div>
    );
  };

  // Enhanced 60fps performance and smooth scrolling styles
  const customScrollbarStyles = `
    /* 60fps Smooth Scrolling Implementation */
    html {
      scroll-behavior: smooth;
      scroll-padding-top: 80px;
    }

    * {
      scroll-behavior: smooth;
    }

    body {
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

    /* Custom Scrollbar Styling */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(139, 92, 246, 0.4) transparent;
      scroll-behavior: smooth;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(139, 92, 246, 0.5);
      border-radius: 10px;
      transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.7);
    }

    /* 60fps Performance Optimizations */
    .performance-optimized {
      will-change: transform, opacity;
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
      contain: layout style paint;
    }

    /* Smooth 60fps Animations */
    .smooth-animation {
      animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      animation-fill-mode: both;
      will-change: transform, opacity;
    }

    /* Hardware Accelerated Transforms */
    .hw-accelerated {
      transform: translateZ(0);
      will-change: transform;
      backface-visibility: hidden;
    }

    /* Smooth Drawer Scrolling */
    .drawer-scroll {
      scroll-behavior: smooth;
      scrollbar-width: thin;
      scrollbar-color: rgba(139, 92, 246, 0.3) transparent;
      transform: translateZ(0);
      will-change: scroll-position;
    }

    .drawer-scroll::-webkit-scrollbar {
      width: 2px;
    }

    .drawer-scroll::-webkit-scrollbar-thumb {
      background: rgba(139, 92, 246, 0.4);
      border-radius: 10px;
    }

    /* 60fps Optimized Transitions */
    .optimized-transition {
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-property: transform, opacity;
      will-change: transform, opacity;
    }

    /* Mobile Responsiveness Optimizations */
    @media (max-width: 768px) {
      .drawer-mobile {
        width: 85% !important;
        max-width: 320px !important;
      }

      .tab-mobile {
        transform: scale(0.9);
      }

      .performance-optimized {
        contain: layout style;
      }
    }

    /* Touch Device Optimizations */
    @media (hover: none) and (pointer: coarse) {
      .touch-optimized {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .touch-optimized:active {
        transform: scale(0.95);
      }
    }
  `;

  // Voice bot features
  const voiceBotFeatures = {
    advanced: [
      'Powered by GOOGLE AI STUDIOS AI voice model',
      '2 SEC-DELAY voice-to-text using Whisper API',
      'Natural voice synthesis with 5 emotion variations',
      'Custom wake word with 78% accuracy',
      'Advanced background noise reduction (30dB)',
      'Voice sentiment analysis with 95% accuracy',
      'Seamless text-to-voice with 0.3s latency',
      'Custom voice UI with waveform animation',
      'Voice command recognition (50+ commands)',
      'Basic voice cloning (2 custom voices)',
      'Voice chat history & analytics',
      'Voice data encryption (AES-256)',
      'Integration with Google Speech-to-Text',
      'Voice model fine-tuning (5 hours data)'
    ],
    enterprise: [
      'Premium Eleven Labs & Google AI models',
      'REAL-TIME voice-to-text using Whisper API',
      'Advanced voice cloning (unlimited voices)',
      'Custom voice model training (100+ hours)',
      'Multi-speaker detection (up to 10)',
      'Real-time voice translation (100+ languages)',
      'Emotion-aware responses (20+ tones)',
      'Voice biometric auth (99.9% accuracy)',
      'Custom voice brand identity system',
      'Multi-channel voice deployment',
      'Voice style transfer & modification',
      'Accent adaptation & neutralization',
      'Voice age & gender customization',
      'Professional voice actor recordings',
      'Advanced prosody control system',
      'Neural voice enhancement',
      'Custom wake word development',
      'Voice data compliance tools',
      'Enterprise voice analytics'
    ]
  };

  // Toggle function for voice bot
  const toggleVoiceBot = (plan: 'advanced' | 'enterprise') => {
    setVoiceBotEnabled(prev => ({
      ...prev,
      [plan]: !prev[plan]
    }));
  };

  // Voice Bot Toggle Button Component
  const VoiceBotToggle = ({ plan }: { plan: 'advanced' | 'enterprise' }) => (
    <div className="relative mb-6">
      <button
        onClick={() => toggleVoiceBot(plan)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl backdrop-blur-md transition-all duration-300
          ${voiceBotEnabled[plan] 
            ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border-purple-400/30' 
            : 'bg-white/5 border-white/10'} 
          border hover:border-purple-400/50 group`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${voiceBotEnabled[plan] ? 'bg-purple-500/20' : 'bg-white/10'}`}>
            <Mic size={20} className={`${voiceBotEnabled[plan] ? 'text-purple-400' : 'text-gray-400'}`} />
          </div>
          <div className="text-left">
            <p className={`font-medium ${voiceBotEnabled[plan] ? 'text-purple-300' : 'text-gray-300'}`}>
              AI Voice Chat Bot
            </p>
            <p className="text-xs text-gray-400">
              {voiceBotEnabled[plan] ? 'Enabled' : 'Click to enable'}
            </p>
          </div>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 
          ${voiceBotEnabled[plan] ? 'bg-purple-500/50' : 'bg-gray-700'}`}>
          <motion.div
            animate={{ x: voiceBotEnabled[plan] ? 24 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-4 h-4 rounded-full ${voiceBotEnabled[plan] ? 'bg-purple-300' : 'bg-gray-400'}`}
          />
        </div>
      </button>
      {voiceBotEnabled[plan] && (
        <div className="absolute -top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium text-green-300 bg-green-500/20 rounded-full">
            Save $100
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-black pt-20 md:pt-32 relative performance-optimized hw-accelerated">
      {/* Inject 60fps performance and smooth scrolling styles */}
      <style jsx global>{customScrollbarStyles}</style>

      <NexiousDrawer />
      <SideTab />

      {/* Performance-optimized background effects */}
      <div className="performance-optimized">
        <NeonStringsEffect />
        <CyberpunkMesh />
        <NeonIcons />
        <BackgroundMesh />
        <FloatingTerms />
        <NeuralNetworkEffect />
        <AiBackgroundPattern />
        <FloatingIcons />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 performance-optimized">
        <div className="text-center mb-16 relative overflow-hidden rounded-3xl hw-accelerated">
          {/* Enhanced Neural Network Background Animation */}
          <div className="absolute inset-0 -m-8 performance-optimized">
            <NeuralNetworkBackground />
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
              type: "tween"
            }}
            className="relative z-10 performance-optimized hw-accelerated"
          >
            <motion.h1
              className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 ${gradientTextClass}
                         performance-optimized hw-accelerated smooth-animation`}
              style={{
                textShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
                letterSpacing: '-0.02em',
                willChange: 'transform, opacity'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                delay: 0.2
              }}
            >
              Custom AI Chatbot Solutions
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block ml-1 w-0.5 h-6 bg-purple-400"
                />
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-sm bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-6 py-3 rounded-full backdrop-blur-sm border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300"
              >
                <Bot size={18} className="text-purple-400" />
                <span className="text-purple-100">Advanced NLP</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-sm bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-6 py-3 rounded-full backdrop-blur-sm border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
              >
                <Brain size={18} className="text-cyan-400" />
                <span className="text-cyan-100">Multi-Model AI</span>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-6 py-3 rounded-full backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
              >
                <Globe size={18} className="text-blue-400" />
                <span className="text-blue-100">20+ Languages</span>
              </motion.div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div 
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div 
              className="absolute -bottom-10 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            
            <motion.div 
              className="absolute -bottom-5 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </motion.div>
        </div>

        {/* Add this line after the hero section and before the pricing section */}
        <NexiousChatbotShowcase />
        
        {/* Add the Vector Database section here */}
        <VectorDatabaseSection />

        {/* Add a visible scrolling anchor target */}
        <div id="pricing-section" className="relative -top-32 invisible"></div>

        {/* Pricing Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 mb-20 relative"
        >
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              AI Chatbot Integration Plans (USD)
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-300 max-w-2xl mx-auto"
            >
              Scalable chatbot solutions for startups, businesses, and enterprises.
            </motion.p>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative">
            {/* Basic Plan */}
            <motion.div 
              {...fadeIn}
              whileHover={{ scale: 1.02, translateY: -5 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border border-green-500/20 hover:border-green-500 transition-all duration-300 shadow-xl hover:shadow-green-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent blur-xl pointer-events-none" />
              <div className="relative p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">Basic Plan</h3>
                  <span className="inline-flex items-center justify-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-2">Perfect for portfolios, landing pages, or small businesses.</p>
                <div className="mt-5 mb-6">
                  <span className="text-3xl font-bold text-white">$199</span>
                  <span className="text-gray-400 ml-1">one-time</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {[
                    '1 AI chatbot (text-based, single-purpose)',
                    'Up to 50 hardcoded/predefined Q&A responses',
                    'Smart response caching for faster replies',
                    'Basic intent recognition',
                    'Simple conversation flow builder',
                    'Customizable chat widget design',
                    'Mobile-responsive interface',
                    'Basic analytics dashboard',
                    'Easy copy-paste installation',
                    'Supports 1 language (default: English)',
                    'Basic rate limiting & spam protection',
                    'Delivery: 3 days',
                    'Support: 7 days'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check size={18} className="text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Requirements Section */}
                <div className="mt-6 mb-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-300 mb-2">Requirements</h4>
                      <p className="text-xs text-green-200">
                        You must have an existing website :) and basic content ready
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    onClick={() => toggleTechDetails('basic')}
                    className="flex items-center justify-center text-sm bg-green-500/10 hover:bg-green-500/20 text-green-300 hover:text-green-200 px-4 py-2 rounded-lg transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
                  >
                    <Info size={16} className="mr-1" />
                    <span>Technical Details</span>
                  </button>

                  <button
                    onClick={() => router.push('/checkout?source=chatbot&package=basic&price=199')}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 rounded-lg text-white font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-green-500/20"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Advanced Plan */}
            <motion.div 
              {...fadeIn}
              initial={{ y: 0 }}
              animate={{ y: -20 }}
              whileHover={{ scale: 1.02, translateY: -25 }}
              transition={{ duration: 0.2 }}
              className={`relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl z-10
                ${voiceBotEnabled.advanced 
                  ? 'border-purple-500/20 hover:border-purple-500 hover:shadow-purple-500/20'
                  : 'border-blue-500/20 hover:border-blue-500 hover:shadow-blue-500/20'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br blur-xl pointer-events-none transition-all duration-300
                ${voiceBotEnabled.advanced 
                  ? 'from-purple-500/20 via-blue-500/5 to-transparent'
                  : 'from-blue-500/20 via-blue-500/5 to-transparent'}`} 
              />
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">Advanced Plan</h3>
                  <span className="inline-flex items-center justify-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                    Popular
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-2">Ideal for SaaS, e-commerce, and business websites.</p>
                <div className="mt-5 mb-6">
                  <span className="text-3xl font-bold text-white">
                    ${voiceBotEnabled.advanced ? '599' : '499'}
                  </span>
                  <span className="text-gray-400 ml-1">one-time</span>
                  {voiceBotEnabled.advanced && (
                    <span className="ml-2 line-through text-gray-500 text-sm">$699</span>
                  )}
                </div>

                <VoiceBotToggle plan="advanced" />
                
                <ul className="space-y-3 mb-8">
                  {voiceBotEnabled.advanced ? (
                    <>
                      {voiceBotFeatures.advanced.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Volume2 size={18} className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                      <li className="flex items-start pt-4">
                        <Check size={18} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Includes all text chat features</span>
                      </li>
                    </>
                  ) : (
                    [
                      'AI chatbot with memory + intent recognition',
                    'Trained on PDFs, docs, links using vector DB',
                    'Admin dashboard to manage data/FAQs',
                    'Multilingual (up to 3 languages)',
                    '1 Integration (WhatsApp, Messenger, or CRM)',
                    'Live agent fallback support',
                    'Analytics dashboard (chat logs, feedback)',
                    'Fully custom-styled chat UI',
                    'Delivery: 7–10 days',
                    'Support: 30 days',
                    'Advanced sentiment analysis',
                    'Real-time language translation',
                    'Custom AI model fine-tuning',
                    'Voice-to-text integration',
                    'Automated A/B testing',
                    'Advanced analytics dashboard',
                    'Custom webhook integrations',
                    '24/7 monitoring and alerts'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check size={18} className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))
                  )}
                </ul>

                {/* Requirements Section */}
                <div className={`mt-6 mb-4 p-4 rounded-lg border ${
                  voiceBotEnabled.advanced
                    ? 'bg-purple-500/10 border-purple-500/20'
                    : 'bg-blue-500/10 border-blue-500/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className={`w-5 h-5 ${
                        voiceBotEnabled.advanced ? 'text-purple-400' : 'text-blue-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold mb-2 ${
                        voiceBotEnabled.advanced ? 'text-purple-300' : 'text-blue-300'
                      }`}>Requirements</h4>
                      <p className={`text-xs ${
                        voiceBotEnabled.advanced ? 'text-purple-200' : 'text-blue-200'
                      }`}>
                        You must have an existing website :) and detailed content/branding materials
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => toggleTechDetails('advanced')}
                    className={`flex items-center justify-center text-sm px-4 py-2 rounded-lg transition-all duration-300 border backdrop-blur-sm
                      ${voiceBotEnabled.advanced 
                        ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border-purple-500/20 hover:border-purple-500/30'
                        : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 border-blue-500/20 hover:border-blue-500/30'}`}
                  >
                    <Info size={16} className="mr-1" />
                    <span>Technical Details</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const price = voiceBotEnabled.advanced ? 599 : 499;
                      router.push(`/checkout?source=chatbot&package=advanced&price=${price}&voiceBot=${voiceBotEnabled.advanced}`);
                    }}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg
                    ${voiceBotEnabled.advanced
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/20'}`}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Enterprise Plan */}
            <motion.div 
              {...fadeIn}
              whileHover={{ scale: 1.02, translateY: -5 }}
              transition={{ duration: 0.2 }}
              className={`relative bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl
                ${voiceBotEnabled.enterprise
                  ? 'border-purple-500/20 hover:border-purple-500 hover:shadow-purple-500/20'
                  : 'border-orange-500/20 hover:border-orange-500 hover:shadow-orange-500/20'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br blur-xl pointer-events-none transition-all duration-300
                ${voiceBotEnabled.enterprise
                  ? 'from-purple-500/20 via-blue-500/5 to-transparent'
                  : 'from-orange-500/20 via-orange-500/5 to-transparent'}`} 
              />
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">Enterprise Plan</h3>
                  <span className="inline-flex items-center justify-center bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-xs font-medium">
                    Custom
                  </span>
                </div>
                <p className="text-gray-300 text-sm mt-2">For large-scale customer service, sales automation, or AI-first apps.</p>
                <div className="mt-5 mb-6">
                  <span className="text-3xl font-bold text-white">
                    Custom
                  </span>
                  <span className="text-gray-400 ml-1">pricing</span>
                </div>

                <VoiceBotToggle plan="enterprise" />
                
                <ul className="space-y-3 mb-8">
                  {voiceBotEnabled.enterprise ? (
                    <>
                      {voiceBotFeatures.enterprise.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Volume2 size={18} className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </li>
                      ))}
                      <li className="flex items-start pt-4">
                        <Check size={18} className="text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">Includes all Advanced plan features</span>
                      </li>
                    </>
                  ) : (
                    [
                      'Multiple AI personas (Sales, Support, etc.)',
                    'Trained on private web + database + API content',
                    'Natural language understanding (NLP)',
                    'Multi-model fallback architecture',
                    'Deep search (Langchain RAG + Weaviate/Pinecone)',
                    'Multi-channel deployment (Slack, Telegram, etc.)',
                    'Authentication (JWT/OAuth, session control)',
                    'Advanced analytics (report exports, filters)',
                    'GDPR & privacy compliance',
                    'Admin team collaboration',
                    'Delivery: Priority timeline',
                    'Support: 3 months',
                    'Custom AI model development',
                    'Enterprise-grade security',
                    'Dedicated AI training team',
                    'Multi-region deployment',
                    'Custom compliance solutions',
                    'Priority support SLA',
                    'Dedicated account manager',
                    'Custom integration services'
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check size={18} className="text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))
                  )}
                </ul>
                
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => toggleTechDetails('enterprise')}
                    className={`flex items-center justify-center text-sm px-4 py-2 rounded-lg transition-all duration-300 border backdrop-blur-sm
                      ${voiceBotEnabled.enterprise
                        ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border-purple-500/20 hover:border-purple-500/30'
                        : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 border-orange-500/20 hover:border-orange-500/30'}`}
                  >
                    <Info size={16} className="mr-1" />
                    <span>Technical Details</span>
                  </button>
                  
                  <button
                    onClick={openRequirementsModal}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg
                    ${voiceBotEnabled.enterprise
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/20'
                      : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 hover:shadow-orange-500/20'}`}>
                    Make a Deal
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Tech Details Modals */}
          <AnimatePresence mode="wait">
            {activeTechDetails && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              >
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl max-w-3xl w-full max-h-[70vh] overflow-y-auto shadow-xl border border-purple-500/20"
                  style={{ willChange: 'transform' }}
                >
                  <div className="flex justify-between items-center p-4 border-b border-purple-500/20 bg-black/20 sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-white">
                      {activeTechDetails === 'basic' && 'Basic Plan - Tech Stack'}
                      {activeTechDetails === 'advanced' && 'Advanced Plan - Tech Stack'}
                      {activeTechDetails === 'enterprise' && 'Enterprise Plan - Tech Stack'}
                    </h3>
                    <button 
                      onClick={() => setActiveTechDetails(null)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    {activeTechDetails === 'basic' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start">
                          <div className="mr-3 bg-purple-500/20 p-1.5 rounded-lg">
                            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          </div>
                          <div>
                            <span className="block text-purple-300 font-medium">Model</span>
                            <span className="text-gray-300 text-sm">GPT-3.5-turbo</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3 bg-purple-500/20 p-1.5 rounded-lg">
                            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          </div>
                          <div>
                            <span className="block text-purple-300 font-medium">Training</span>
                            <span className="text-gray-300 text-sm">No training needed</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3 bg-purple-500/20 p-1.5 rounded-lg">
                            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          </div>
                          <div>
                            <span className="block text-purple-300 font-medium">Logic</span>
                            <span className="text-gray-300 text-sm">Uses hardcoded FAQ logic (if/else, local JSON)</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3 bg-purple-500/20 p-1.5 rounded-lg">
                            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          </div>
                          <div>
                            <span className="block text-purple-300 font-medium">Backend</span>
                            <span className="text-gray-300 text-sm">No backend database</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3 bg-purple-500/20 p-1.5 rounded-lg">
                            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          </div>
                          <div>
                            <span className="block text-purple-300 font-medium">API Key</span>
                            <span className="text-gray-300 text-sm">Client-side only, OpenAI key required</span>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="mr-3 bg-purple-500/20 p-1.5 rounded-lg">
                            <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                          </div>
                          <div>
                            <span className="block text-purple-300 font-medium">Secure Data</span>
                            <span className="text-gray-300 text-sm">Basic encryption for chat storage</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTechDetails === 'advanced' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="bg-purple-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-purple-300 mb-2">AI Models & Processing</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Brain className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">GPT-4-turbo with 128k context</span>
                              </li>
                              <li className="flex items-start">
                                <Volume2 className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Eleven Labs Essential voice model</span>
                              </li>
                              <li className="flex items-start">
                                <Mic className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">OpenAI Whisper for voice-to-text</span>
                              </li>
                              <li className="flex items-start">
                                <Cpu className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Dedicated voice processing units</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-blue-300 mb-2">Data Management</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Database className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Vector database with up to 1M embeddings</span>
                              </li>
                              <li className="flex items-start">
                                <Shield className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Enterprise-grade encryption</span>
                              </li>
                              <li className="flex items-start">
                                <Settings className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Advanced data retention policies</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-pink-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-pink-300 mb-2">Integration & Development</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Code className="text-pink-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">REST API with comprehensive documentation</span>
                              </li>
                              <li className="flex items-start">
                                <Cloud className="text-pink-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Webhooks for real-time event processing</span>
                              </li>
                              <li className="flex items-start">
                                <Globe className="text-pink-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Multi-platform SDKs (JS, Python, Java)</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-green-300 mb-2">Analytics & Monitoring</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Users className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">User behavior analytics</span>
                              </li>
                              <li className="flex items-start">
                                <Lock className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">GDPR and CCPA compliance tools</span>
                              </li>
                              <li className="flex items-start">
                                <Settings className="text-green-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Custom analytics dashboards</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTechDetails === 'enterprise' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-red-300 mb-2">Enterprise AI Infrastructure</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Brain className="text-red-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Custom fine-tuned GPT-4 models</span>
                              </li>
                              <li className="flex items-start">
                                <Volume2 className="text-red-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Eleven Labs Pro & Google Cloud Text-to-Speech</span>
                              </li>
                              <li className="flex items-start">
                                <Mic className="text-red-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Custom-trained voice models (100+ hours)</span>
                              </li>
                              <li className="flex items-start">
                                <Cpu className="text-red-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Dedicated GPU clusters for voice processing</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-orange-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-orange-300 mb-2">Advanced Features</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Zap className="text-orange-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Real-time translation in 100+ languages</span>
                              </li>
                              <li className="flex items-start">
                                <Users className="text-orange-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Multi-agent orchestration</span>
                              </li>
                              <li className="flex items-start">
                                <Settings className="text-orange-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Custom workflow automation</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-purple-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-purple-300 mb-2">Enterprise Support</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Users className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Dedicated account manager</span>
                              </li>
                              <li className="flex items-start">
                                <Clock className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">24/7 priority support</span>
                              </li>
                              <li className="flex items-start">
                                <Book className="text-purple-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Custom training and onboarding</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-blue-500/10 backdrop-blur-sm rounded-lg p-3">
                            <h4 className="text-base font-semibold text-blue-300 mb-2">Security & Compliance</h4>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-start">
                                <Lock className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Custom security policies</span>
                              </li>
                              <li className="flex items-start">
                                <Shield className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Annual security audits</span>
                              </li>
                              <li className="flex items-start">
                                <FileText className="text-blue-400 mr-2 mt-0.5 flex-shrink-0" size={16} />
                                <span className="text-gray-300">Compliance documentation</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Requirements Modal */}
          <RequirementsModal
            isOpen={showRequirementsModal}
            onClose={closeRequirementsModal}
            workflowType="enterprise"
          />

          {/* Add-ons Table */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-20 mb-16 relative performance-layer"
          >
            <AddOnsNeuralNetwork />
            <SideNeuralNetwork side="left" />
            <SideNeuralNetwork side="right" />
            
            <div className="relative z-10 smooth-scroll">
              <h3 className="text-2xl font-bold text-white text-center mb-8">
                Optional Add-Ons
              </h3>
              <div className="overflow-hidden rounded-2xl border border-purple-500/20 backdrop-blur-xl">
                <table className="w-full max-w-4xl mx-auto bg-black/30">
                  <thead>
                    <tr className="border-b border-purple-500/20">
                      <th className="py-4 px-6 text-left text-sm font-medium text-purple-200">Feature</th>
                      <th className="py-4 px-6 text-right text-sm font-medium text-purple-200">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-500/10">
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Monthly Maintenance & Updates</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$39/month</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Additional Language Support</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$29 each</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">WhatsApp Business Integration</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$89 (setup)</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Private Data Training (per file)</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$19/file</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Voice AI Integration (Beta)</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$149</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Custom Voice Training (2 hours)</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$299</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Professional Voice Recording</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$499</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Custom AI Model Fine-tuning</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$799</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Multi-Platform Integration Package</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$249</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Advanced Analytics Dashboard</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$179</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Sentiment Analysis Module</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$129</td>
                    </tr>
                    <tr className="hover:bg-purple-500/10 transition-colors duration-200">
                      <td className="py-4 px-6 text-sm text-gray-300">Custom Knowledge Base Integration</td>
                      <td className="py-4 px-6 text-sm text-gray-300 text-right">$349</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Replace ScrollArrow with ScrollIndicator */}
      <ScrollIndicator />
    </div>
  );
} 