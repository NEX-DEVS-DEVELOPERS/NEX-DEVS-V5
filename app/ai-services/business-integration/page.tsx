'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, ArrowRight, Zap, Bot, Mic, Building2, Info, X, Brain, Cpu, Database, ChevronLeft, Flag, ExternalLink, Calendar, TrendingUp, Sparkles, Cloud, ImageIcon, Wind } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import NeuralNetwork from '@/components/animations/NeuralNetwork';
import { audiowide, vt323, getVT323Style, getAudiowideStyle } from '@/app/utils/fonts';

// Types for Neural Network
interface NetworkNode {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
}

interface NetworkConnection {
  id: string;
  from: NetworkNode;
  to: NetworkNode;
  delay: number;
  duration: number;
}

// Optimized Neural Network Component for 60fps performance
const TitleNeuralNetwork = () => {
  const nodes = useMemo(() => {
    const nodeCount = 20; // Slightly reduced for better performance
    const positions: NetworkNode[] = [];
    const minDistance = 18;

    for (let i = 0; i < nodeCount; i++) {
      let attempts = 0;
      let validPosition = false;
      let newNode: NetworkNode = {
        id: i,
        x: 10 + Math.random() * 80, // Wider spread
        y: 10 + Math.random() * 80,
        delay: Math.random() * 0.8,
        size: 2.5 + Math.random() * 1.5 // Slightly larger nodes
      };

      while (!validPosition && attempts < 50) {
        validPosition = positions.every((existingNode) => {
          const distance = Math.sqrt(
            Math.pow(newNode.x - existingNode.x, 2) +
            Math.pow(newNode.y - existingNode.y, 2)
          );
          return distance >= minDistance;
        });
        if (!validPosition) {
          newNode = {
            ...newNode,
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 80
          };
        }
        attempts++;
      }
      if (validPosition) {
        positions.push(newNode);
      }
    }
    return positions;
  }, []);

  const connections = useMemo(() => {
    const conns: NetworkConnection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2)
        );
        if (distance < 40 && Math.random() > 0.3) { // Slightly reduced connections for performance
          conns.push({
            id: `${i}-${j}`,
            from: nodes[i],
            to: nodes[j],
            delay: Math.random() * 0.8,
            duration: 1.4 + Math.random() * 0.3 // Slightly faster animations
          });
        }
      }
    }
    return conns;
  }, [nodes]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="absolute inset-0" style={{ transform: 'scale(1.2)' }}>
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(96, 165, 250, 0.7)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.7)" />
          </linearGradient>
          
          {/* Add marker for path animation */}
          <marker id="dot" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="4" markerHeight="4">
            <circle cx="4" cy="4" r="2" fill="rgba(120, 180, 255, 0.9)" />
          </marker>
          
          {/* Add a glow filter */}
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Add filter for stronger pulse effect */}
          <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Dynamic connection lines - More visible */}
        {connections.map((connection) => (
          <motion.line
            key={`connection-${connection.id}`}
            x1={`${connection.from.x}%`}
            y1={`${connection.from.y}%`}
            x2={`${connection.to.x}%`}
            y2={`${connection.to.y}%`}
            stroke="rgba(120, 180, 255, 0.25)"
            strokeWidth="1.2"
            strokeDasharray="2,3"
            style={{ willChange: 'opacity' }}
          />
        ))}
        
        {/* Animated data flow paths */}
        {connections.map((connection) => (
          <motion.path
            key={`path-${connection.id}`}
            d={`M${connection.from.x}%,${connection.from.y}% L${connection.to.x}%,${connection.to.y}%`}
            fill="none"
            stroke="rgba(150, 210, 255, 0.8)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, strokeWidth: 1 }}
            animate={{ 
              pathLength: [0, 1, 0],
              strokeWidth: [1, 2, 1]
            }}
            transition={{
              duration: connection.duration * 2,
              repeat: Infinity,
              ease: "linear", // Linear for 60fps
              delay: connection.delay,
              repeatDelay: Math.random() * 1
            }}
            style={{ willChange: 'stroke-dashoffset' }}
            filter="url(#glow)"
          />
        ))}
        
        {/* Additional random moving paths for more dynamic connections - optimized */}
        {connections.filter((_, i) => i % 4 === 0).map((connection) => { // Reduced for performance
          const midX = (connection.from.x + connection.to.x) / 2 + (Math.random() * 8 - 4);
          const midY = (connection.from.y + connection.to.y) / 2 + (Math.random() * 8 - 4);
          return (
            <motion.path
              key={`curved-${connection.id}`}
              d={`M${connection.from.x}%,${connection.from.y}% Q${midX}%,${midY}% ${connection.to.x}%,${connection.to.y}%`}
              fill="none"
              stroke="rgba(170, 220, 255, 0.7)"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
              }}
              transition={{
                duration: connection.duration * 2,
                repeat: Infinity,
                ease: "linear", // Linear for 60fps
                delay: connection.delay + 0.5,
                repeatDelay: Math.random() * 1.5
              }}
              style={{ willChange: 'stroke-dashoffset' }}
              filter="url(#glow)"
            />
          );
        })}
        
        {/* Animated moving dots along paths - optimized */}
        {connections.filter((_, i) => i % 2 === 0).map((connection) => ( // Reduced for performance
          <motion.circle
            key={`dot-${connection.id}`}
            cx={`${connection.from.x}%`}
            cy={`${connection.from.y}%`}
            r="2.5"
            fill="rgba(180, 230, 255, 1)"
            filter="url(#strongGlow)"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              cx: [`${connection.from.x}%`, `${connection.to.x}%`],
              cy: [`${connection.from.y}%`, `${connection.to.y}%`],
            }}
            transition={{
              duration: connection.duration * 2.2,
              repeat: Infinity,
              ease: "linear", // Linear for 60fps
              delay: connection.delay + 0.2,
              repeatDelay: Math.random() * 1,
              times: [0, 0.1, 0.9, 1]
            }}
            style={{ willChange: 'transform' }}
          />
        ))}

        {/* Opposite direction data flow - optimized */}
        {connections.filter((_, i) => i % 3 === 0).map((connection) => ( // Reduced for performance
          <motion.circle
            key={`dot-reverse-${connection.id}`}
            cx={`${connection.to.x}%`}
            cy={`${connection.to.y}%`}
            r="2.2"
            fill="rgba(200, 240, 255, 1)"
            filter="url(#strongGlow)"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              cx: [`${connection.to.x}%`, `${connection.from.x}%`],
              cy: [`${connection.to.y}%`, `${connection.from.y}%`],
            }}
            transition={{
              duration: connection.duration * 2.5,
              repeat: Infinity,
              ease: "linear", // Linear for 60fps
              delay: connection.delay + 0.8,
              repeatDelay: Math.random() * 1.5,
              times: [0, 0.1, 0.9, 1]
            }}
            style={{ willChange: 'transform' }}
          />
        ))}
        
        {/* Node pulses - with enhanced glow effect */}
        {nodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size}
            fill="rgba(150, 210, 255, 0.9)"
            filter="url(#strongGlow)"
            initial={{ scale: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "linear", // Linear for 60fps
              delay: node.delay
            }}
            style={{ willChange: 'transform', transformOrigin: `${node.x}% ${node.y}%` }}
          />
        ))}
        
        {/* Outer glow for nodes - optimized */}
        {nodes.filter((_, i) => i % 4 === 0).map((node) => ( // Reduced for performance
          <motion.circle
            key={`glow-${node.id}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r={node.size * 3}
            fill="none"
            stroke="rgba(150, 210, 255, 0.25)"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{
              scale: [0.6, 1.5, 0.6],
              opacity: [0.15, 0.4, 0.15]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear", // Linear for 60fps
              delay: node.delay + 0.5
            }}
            style={{ willChange: 'transform', transformOrigin: `${node.x}% ${node.y}%` }}
          />
        ))}
        
        {/* Connection bursts - optimized */}
        {nodes.filter((_, i) => i % 8 === 0).map((node) => ( // Reduced for performance
          <motion.circle
            key={`burst-${node.id}`}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="1"
            fill="rgba(255, 255, 255, 0.9)"
            filter="url(#strongGlow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 15, 20],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "linear", // Linear for 60fps
              delay: node.delay + Math.random() * 5,
              repeatDelay: Math.random() * 8 + 4
            }}
            style={{ willChange: 'transform', transformOrigin: `${node.x}% ${node.y}%` }}
          />
        ))}
      </svg>
    </div>
  );
};

interface TechnicalDetails {
  aiModel: string;
  company: string;
  stack: string;
  responseTime: string;
  concurrentUsers: string;
  integration: string;
  customization: string;
  analytics: string;
  security?: string;
  support: string;
}

interface PricingTier {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonLink: string;
  badge?: string;
  technicalDetails: TechnicalDetails;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    title: 'Essential AI Chatbot',
    price: '$499',
    originalPrice: '$699',
    description: 'Perfect starter solution for small to medium businesses looking to automate customer support',
    icon: <Bot className="w-8 h-8" />,
    badge: 'STARTER',
    features: [
      'Custom AI Chatbot Development',
      'GPT-3.5 Turbo Integration',
      'Website & Mobile Integration',
      'Pre-built Response Templates',
      'Email & SMS Notifications',
      'Basic Analytics Dashboard',
      'Brand Customization',
      '30-day Support & Maintenance'
    ],
    buttonText: 'Get Started',
    buttonLink: '/checkout?plan=basic-ai-integration',
    technicalDetails: {
      aiModel: 'GPT-3.5 Turbo',
      company: 'OpenAI',
      stack: 'React.js, Node.js, MongoDB',
      responseTime: '< 2 seconds average response time',
      concurrentUsers: 'Up to 100 simultaneous users',
      integration: 'Website embed, REST API, webhooks',
      customization: 'Brand colors, logo, basic personality tuning',
      analytics: 'Conversation metrics, user engagement tracking',
      support: '30-day email support & maintenance included'
    }
  },
  {
    id: 'advanced',
    title: 'Professional AI Suite',
    price: '$999',
    originalPrice: '$1,299',
    description: 'Advanced AI solution with voice capabilities, CRM integration, and enterprise features',
    icon: <Mic className="w-8 h-8" />,
    badge: 'MOST POPULAR',
    features: [
      'GPT-4 Advanced LLM Integration',
      'Voice AI & Speech Recognition',
      'Multi-language Support (15+ languages)',
      'Custom Training & Fine-tuning',
      'Advanced Analytics & Insights',
      'CRM & Third-party Integration',
      'API Access & Custom Webhooks',
      'Priority Support & Training Sessions'
    ],
    highlighted: true,
    buttonText: 'Choose Professional',
    buttonLink: '/checkout?plan=advanced-ai-integration',
    technicalDetails: {
      aiModel: 'GPT-4 Turbo',
      company: 'OpenAI',
      stack: 'Next.js, Python, Azure Speech Services, PostgreSQL',
      responseTime: '< 1 second average response time',
      concurrentUsers: 'Up to 500 simultaneous users',
      integration: 'Multi-platform, CRM sync, API endpoints, webhooks',
      customization: 'Full brand customization, personality tuning, custom workflows',
      analytics: 'Advanced insights, sentiment analysis, conversion tracking',
      support: '60-day priority support & training sessions included'
    }
  },
  {
    id: 'enterprise',
    title: 'Enterprise AI Ecosystem',
    price: 'Custom Quote',
    description: 'Complete AI transformation solution for large organizations with custom requirements',
    icon: <Building2 className="w-8 h-8" />,
    badge: 'ENTERPRISE',
    features: [
      'Custom AI Model Development',
      'Enterprise-grade Security & Compliance',
      'Multi-platform Integration Suite',
      'Advanced Workflow Automation',
      'Dedicated Development Team',
      'Custom SLA & Support Agreement',
      'Ongoing Optimization & Updates',
      'White-label Solutions Available'
    ],
    buttonText: 'Contact Enterprise Sales',
    buttonLink: '/checkout?plan=enterprise-ai-integration',
    technicalDetails: {
      aiModel: 'Custom LLM / Claude 3.5 Sonnet',
      company: 'Anthropic / Custom',
      stack: 'Microservices, Kubernetes, Enterprise APIs',
      responseTime: '< 500ms average response time',
      concurrentUsers: 'Unlimited with auto-scaling infrastructure',
      integration: 'Enterprise systems, SSO, custom APIs, legacy systems',
      customization: 'Complete customization, white-label options, custom UI/UX',
      analytics: 'Enterprise dashboards, custom reporting, BI integration',
      security: 'SOC2, GDPR compliance, enterprise SSO, data encryption',
      support: '24/7 dedicated team, custom SLA, on-site support available'
    }
  },
  {
    id: 'voice',
    title: 'Voice AI Enhancement',
    price: '$899',
    originalPrice: '$1,199',
    description: 'Add advanced voice capabilities to any existing plan or standalone implementation',
    icon: <Zap className="w-8 h-8" />,
    badge: 'ADD-ON',
    features: [
      'Advanced Voice Recognition',
      'Natural Text-to-Speech',
      'Multi-accent & Dialect Support',
      'Real-time Voice Processing',
      'Voice Command Integration',
      'Audio Analytics & Insights',
      'Cross-platform Compatibility',
      'Seamless Integration with Existing Systems'
    ],
    buttonText: 'Add Voice AI',
    buttonLink: '/checkout?plan=voice-ai-addon',
    technicalDetails: {
      aiModel: 'Azure Neural Voices / Google WaveNet',
      company: 'Microsoft / Google',
      stack: 'Azure Speech, Google Cloud Speech, WebRTC, Real-time APIs',
      responseTime: '< 300ms voice processing latency',
      concurrentUsers: 'Scales with base plan capacity',
      integration: 'Web, mobile, phone systems, existing chatbot platforms',
      customization: 'Voice personality, accent selection, speech patterns',
      analytics: 'Voice interaction metrics, sentiment analysis from speech',
      support: '45-day implementation & optimization support'
    }
  }
];

// Project type definition for AI projects
interface AIProject {
  id: number;
  title: string;
  description: string;
  detailedDescription?: string;
  image: string;
  secondImage?: string;
  showBothImagesInPriority?: boolean;
  category: string;
  technologies: string[];
  link: string;
  featured: boolean;
  status?: string;
  updatedDays?: number;
  progress?: number | string;
  features?: string[];
  exclusiveFeatures?: string[];
  visualEffects?: any;
}

// Project Card Component for AI Projects
const ProjectCard = ({ project, isMobile }: { project: AIProject, isMobile?: boolean }) => {
  const [imageError, setImageError] = useState(false);
  const [secondImageError, setSecondImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [secondImageLoading, setSecondImageLoading] = useState(true);

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'recently launched':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'beta testing':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'in development':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500';
    if (progress >= 60) return 'from-yellow-500 to-orange-500';
    if (progress >= 40) return 'from-blue-500 to-cyan-500';
    return 'from-purple-500 to-pink-500';
  };

  const progressValue = typeof project.progress === 'string'
    ? parseInt(project.progress) || 0
    : project.progress || 0;

  // Handle image loading states
  const handleImageLoad = () => setImageLoading(false);
  const handleSecondImageLoad = () => setSecondImageLoading(false);
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };
  const handleSecondImageError = () => {
    setSecondImageError(true);
    setSecondImageLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative bg-black border rounded-xl overflow-hidden transition-all duration-300 will-change-transform ${
        isHovered
          ? 'border-cyan-400/60 shadow-lg shadow-cyan-400/20'
          : 'border-gray-800/50'
      }`}
      style={{
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        contain: 'layout style paint'
      }}
    >
      <div className="relative">
        {/* Optimized Project Image Container */}
        <div className={`relative w-full overflow-hidden bg-gray-900 ${
          isMobile ? 'aspect-[4/3]' : 'aspect-[16/9]'
        }`}>
          {/* Loading skeleton */}
          {(imageLoading || (project.secondImage && secondImageLoading && isHovered)) && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <Brain className="w-8 h-8 text-gray-600 animate-pulse" />
            </div>
          )}

          {/* Primary Image - Optimized for no distortion */}
          {!imageError && (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={`object-cover object-center transition-opacity duration-500 ${
                isHovered && project.secondImage && !secondImageError ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes={isMobile ? "(max-width: 768px) 100vw" : "(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 55vw"}
              quality={90}
              priority={false}
              style={{
                transform: 'translateZ(0)',
                willChange: 'opacity'
              }}
            />
          )}

          {/* Secondary Image (shown on hover) - Optimized */}
          {project.secondImage && !secondImageError && (
            <Image
              src={project.secondImage}
              alt={`${project.title} - Secondary View`}
              fill
              className={`object-cover object-center transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleSecondImageLoad}
              onError={handleSecondImageError}
              sizes={isMobile ? "(max-width: 768px) 100vw" : "(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 55vw"}
              quality={90}
              priority={false}
              style={{
                transform: 'translateZ(0)',
                willChange: 'opacity'
              }}
            />
          )}

          {/* Error state */}
          {imageError && (!project.secondImage || secondImageError) && (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Brain className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <span className="text-xs text-gray-500">Image unavailable</span>
              </div>
            </div>
          )}

          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-full p-1.5 backdrop-blur-sm">
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              </div>
            </div>
          )}

          {/* Status badge */}
          {project.status && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
          )}
        </div>

        {/* Project Details */}
        <div className="p-5">
          {/* Project Title */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-white leading-tight" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {project.title}
            </h3>
          </div>

          {/* Project Description */}
          <p className="text-sm text-gray-400 mb-4 leading-relaxed" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {project.description}
          </p>

          {/* Progress Bar */}
          {progressValue > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">Progress</span>
                <span className="text-xs font-semibold text-cyan-400">{progressValue}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressValue}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getProgressColor(progressValue)} rounded-full`}
                  style={{ willChange: 'width' }}
                />
              </div>
            </div>
          )}

          {/* Technologies */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className={`px-2 py-1 bg-gray-900 border rounded-md text-xs font-medium transition-colors duration-200 ${
                  isHovered
                    ? 'border-emerald-400/50 text-emerald-300'
                    : 'border-gray-700 text-gray-400'
                }`}
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2 py-1 bg-gray-900 border border-gray-700 rounded-md text-xs text-gray-500">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>

          {/* AI Features */}
          {project.features && project.features.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Brain className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-500 font-medium">AI Features</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.features.slice(0, 2).map((feature, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 bg-gray-900 border rounded-md text-xs font-medium transition-colors duration-200 ${
                      isHovered
                        ? 'border-violet-400/50 text-violet-300'
                        : 'border-gray-700 text-gray-400'
                    }`}
                  >
                    {feature}
                  </span>
                ))}
                {project.features.length > 2 && (
                  <span className="px-2 py-1 bg-gray-900 border border-gray-700 rounded-md text-xs text-gray-500">
                    +{project.features.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button and Meta Info */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-800">
            <div className="text-xs text-gray-600">
              {project.updatedDays !== undefined && (
                <span>{project.updatedDays}d ago</span>
              )}
            </div>
            <Link
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border rounded-lg text-xs font-medium transition-all duration-200 ${
                isHovered
                  ? 'border-cyan-400/50 text-cyan-300 shadow-sm shadow-cyan-400/20'
                  : 'border-gray-700 text-gray-400'
              }`}
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Side Drawer for Projects with enhanced styling
const ProjectsDrawer = ({ isOpen, onClose, isMobile }: { isOpen: boolean, onClose: () => void, isMobile: boolean }) => {
  const [aiProjects, setAiProjects] = useState<AIProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAIProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all projects and filter for AI integration projects
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const allProjects = await response.json();

      // Filter projects with case-insensitive category matching
      const aiProjects = allProjects.filter((project: any) =>
        project.category &&
        project.category.toLowerCase().includes('web development with ai')
      );

      setAiProjects(aiProjects);
    } catch (err) {
      console.error('Error fetching AI projects:', err);
      setError('Failed to load AI projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch AI projects when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchAIProjects();
    }
  }, [isOpen, fetchAIProjects]);

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className={`fixed inset-0 bg-black/80 backdrop-blur-md ${isMobile ? 'z-[9998]' : 'z-40'}`}
            onClick={onClose}
            style={{ willChange: "opacity" }}
          />
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '-100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            className={`fixed bg-black shadow-2xl overflow-hidden ${
              isMobile
                ? 'top-[95px] left-0 right-0 h-[75vh] w-full rounded-t-2xl border-t border-purple-500/20 z-[9999]'
                : 'top-[80px] left-0 h-[calc(100vh-180px)] w-[90vw] md:w-[70vw] lg:w-[55vw] max-w-[900px] min-w-[320px] border-r border-purple-500/20 rounded-r-2xl z-50'
            }`}
            style={{ willChange: "transform" }}
          >
            <div className="h-full flex flex-col">
              {/* Neural Network Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <RoadmapNeuralNetwork />
              </div>

              {/* Enhanced Header */}
              <div className={`relative px-4 md:px-8 py-4 md:py-6 bg-black border-b border-purple-500/20 ${
                isMobile ? 'rounded-t-2xl' : 'rounded-tr-2xl'
              }`}>
                <div className="relative z-10">
                  <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 tracking-tight">
                    AI-BASED PROJECTS
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs md:text-sm font-medium text-gray-400 tracking-wide">BY</span>
                    <span className="text-xs md:text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      NEX-DEVS
                    </span>
                  </div>
                  <div className="mt-2 md:mt-3 text-xs text-gray-500">
                    Showcasing Web Development with AI Integration projects
                  </div>
                  {/* Project count indicator */}
                  {!loading && !error && (
                    <div className="mt-2 text-xs text-purple-400/70">
                      {aiProjects.length} project{aiProjects.length !== 1 ? 's' : ''} found
                    </div>
                  )}
                </div>
                {/* Projects Drawer Close Button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-4 md:top-6 right-4 md:right-6 rounded-full hover:bg-gray-800 transition-all duration-200 bg-gray-900/90 border border-gray-600 shadow-lg hover:shadow-xl hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center group z-50 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}
                  style={{ minWidth: '44px', minHeight: '44px' }} // Ensure minimum touch target
                  aria-label="Close projects drawer"
                >
                  <motion.div
                    className="w-full h-full flex items-center justify-center"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className={`text-white group-hover:text-blue-400 transition-colors ${
                      isMobile ? 'w-4 h-4' : 'w-5 h-5'
                    }`} />
                  </motion.div>
                </motion.button>
              </div>

              {/* Content Area - Fixed height with internal scrolling */}
              <div
                className="flex-1 p-4 md:p-5 overflow-y-auto bg-black relative"
                style={{
                  willChange: "scroll-position",
                  transform: 'translateZ(0)',
                  maxHeight: isMobile ? 'calc(85vh - 120px)' : 'calc(100vh - 280px)',
                  backfaceVisibility: 'hidden',
                  contain: 'layout style paint',
                  scrollBehavior: 'smooth'
                }}
              >
                {/* Simplified background for better performance */}
                <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
                  <div className="w-full h-full bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
                </div>

                <div className="relative z-10">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="flex flex-col items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-gray-700 border-t-cyan-400 rounded-full"
                          style={{ willChange: 'transform' }}
                        />
                        <p className="text-gray-500 text-sm">Loading projects...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center px-4">
                        <p className="text-red-400 text-sm mb-3">{error}</p>
                        <button
                          onClick={fetchAIProjects}
                          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:border-cyan-400/50 hover:text-cyan-300 transition-colors text-sm"
                        >
                          Retry
                        </button>
                      </div>
                    </div>
                  ) : aiProjects.length === 0 ? (
                    <div className="text-center text-gray-500 py-16 px-4">
                      <Brain className="w-10 h-10 mx-auto mb-3 text-gray-600" />
                      <p className="text-base mb-2">No AI Projects Found</p>
                      <p className="text-sm text-gray-600">AI integration projects will appear here when available.</p>
                    </div>
                  ) : (
                    <div
                      className="space-y-4"
                      style={{
                        contain: 'layout style',
                        willChange: 'contents'
                      }}
                    >
                      {aiProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} isMobile={isMobile} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Optimized Neural Network for Roadmap Background
const RoadmapNeuralNetwork = () => {
  const nodes = useMemo(() => {
    const nodeCount = 12; // Reduced for better performance in background
    const positions: NetworkNode[] = [];
    const minDistance = 20;

    for (let i = 0; i < nodeCount; i++) {
      let attempts = 0;
      let validPosition = false;
      let newNode: NetworkNode = {
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        delay: Math.random() * 0.8,
        size: 2 + Math.random() * 1
      };

      while (!validPosition && attempts < 40) {
        validPosition = positions.every((existingNode) => {
          const distance = Math.sqrt(
            Math.pow(newNode.x - existingNode.x, 2) +
            Math.pow(newNode.y - existingNode.y, 2)
          );
          return distance >= minDistance;
        });
        if (!validPosition) {
          newNode = {
            ...newNode,
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 80
          };
        }
        attempts++;
      }
      if (validPosition) {
        positions.push(newNode);
      }
    }
    return positions;
  }, []);

  const connections = useMemo(() => {
    const conns: NetworkConnection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2)
        );
        if (distance < 40 && Math.random() > 0.5) {
          conns.push({
            id: `${i}-${j}`,
            from: nodes[i],
            to: nodes[j],
            delay: Math.random() * 0.8,
            duration: 1.5 + Math.random() * 0.5
          });
        }
      }
    }
    return conns;
  }, [nodes]);

  return (
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <linearGradient id="roadmapConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.5)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.5)" />
        </linearGradient>

        <filter id="roadmapGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Connection lines */}
      {connections.map((connection) => (
        <motion.line
          key={`connection-${connection.id}`}
          x1={`${connection.from.x}%`}
          y1={`${connection.from.y}%`}
          x2={`${connection.to.x}%`}
          y2={`${connection.to.y}%`}
          stroke="rgba(147, 51, 234, 0.15)"
          strokeWidth="1"
          strokeDasharray="2,3"
          style={{ willChange: 'opacity' }}
        />
      ))}

      {/* Animated data paths - reduced for performance */}
      {connections.filter((_, i) => i % 3 === 0).map((connection) => (
        <motion.path
          key={`path-${connection.id}`}
          d={`M${connection.from.x}%,${connection.from.y}% L${connection.to.x}%,${connection.to.y}%`}
          fill="none"
          stroke="rgba(147, 51, 234, 0.4)"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 0],
          }}
          transition={{
            duration: connection.duration * 2,
            repeat: Infinity,
            ease: "linear",
            delay: connection.delay,
            repeatDelay: Math.random()
          }}
          style={{ willChange: 'stroke-dashoffset' }}
          filter="url(#roadmapGlow)"
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.circle
          key={node.id}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r={node.size}
          fill="rgba(147, 51, 234, 0.5)"
          filter="url(#roadmapGlow)"
          initial={{ scale: 0 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
            delay: node.delay
          }}
          style={{ willChange: 'transform', transformOrigin: `${node.x}% ${node.y}%` }}
        />
      ))}
    </svg>
  );
};

// Optimized Neural Network for Pricing Section Background
const PricingNeuralNetwork = () => {
  const nodes = useMemo(() => {
    const nodeCount = 15; // Slightly more nodes for pricing section
    const positions: NetworkNode[] = [];
    const minDistance = 18;

    for (let i = 0; i < nodeCount; i++) {
      let attempts = 0;
      let validPosition = false;
      let newNode: NetworkNode = {
        id: i,
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        delay: Math.random() * 1.2,
        size: 1.5 + Math.random() * 1
      };

      while (!validPosition && attempts < 50) {
        validPosition = positions.every((existingNode) => {
          const distance = Math.sqrt(
            Math.pow(newNode.x - existingNode.x, 2) +
            Math.pow(newNode.y - existingNode.y, 2)
          );
          return distance >= minDistance;
        });
        if (!validPosition) {
          newNode = {
            ...newNode,
            x: 5 + Math.random() * 90,
            y: 5 + Math.random() * 90
          };
        }
        attempts++;
      }
      if (validPosition) {
        positions.push(newNode);
      }
    }
    return positions;
  }, []);

  const connections = useMemo(() => {
    const conns: NetworkConnection[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) +
          Math.pow(nodes[i].y - nodes[j].y, 2)
        );
        if (distance < 35 && Math.random() > 0.4) {
          conns.push({
            id: `${i}-${j}`,
            from: nodes[i],
            to: nodes[j],
            delay: Math.random() * 1.2,
            duration: 1.8 + Math.random() * 0.6
          });
        }
      }
    }
    return conns;
  }, [nodes]);

  return (
    <svg width="100%" height="100%" className="absolute inset-0">
      <defs>
        <linearGradient id="pricingConnectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.3)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.3)" />
        </linearGradient>

        <filter id="pricingGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Connection lines */}
      {connections.map((connection) => (
        <motion.line
          key={`connection-${connection.id}`}
          x1={`${connection.from.x}%`}
          y1={`${connection.from.y}%`}
          x2={`${connection.to.x}%`}
          y2={`${connection.to.y}%`}
          stroke="rgba(147, 51, 234, 0.1)"
          strokeWidth="0.8"
          strokeDasharray="1,2"
          style={{ willChange: 'opacity' }}
        />
      ))}

      {/* Animated data paths - reduced for performance */}
      {connections.filter((_, i) => i % 4 === 0).map((connection) => (
        <motion.path
          key={`path-${connection.id}`}
          d={`M${connection.from.x}%,${connection.from.y}% L${connection.to.x}%,${connection.to.y}%`}
          fill="none"
          stroke="rgba(147, 51, 234, 0.3)"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{
            pathLength: [0, 1, 0],
          }}
          transition={{
            duration: connection.duration * 2.5,
            repeat: Infinity,
            ease: "linear",
            delay: connection.delay,
            repeatDelay: Math.random() * 2
          }}
          style={{ willChange: 'stroke-dashoffset' }}
          filter="url(#pricingGlow)"
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.circle
          key={node.id}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r={node.size}
          fill="rgba(147, 51, 234, 0.4)"
          filter="url(#pricingGlow)"
          initial={{ scale: 0 }}
          animate={{
            scale: [0.6, 1.1, 0.6],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
            delay: node.delay
          }}
          style={{ willChange: 'transform', transformOrigin: `${node.x}% ${node.y}%` }}
        />
      ))}
    </svg>
  );
};

// Roadmap Drawer Component
const RoadmapDrawer = ({ isOpen, onClose, isMobile }: { isOpen: boolean, onClose: () => void, isMobile: boolean }) => {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className={`fixed inset-0 bg-black/80 backdrop-blur-md ${isMobile ? 'z-[9998]' : 'z-40'}`}
            onClick={onClose}
            style={{ willChange: "opacity" }}
          />
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            className={`fixed bg-black shadow-2xl overflow-hidden ${
              isMobile
                ? 'top-[95px] left-0 right-0 h-[75vh] w-full rounded-t-2xl border-t border-blue-500/20 z-[9999]'
                : 'top-[80px] right-0 h-[calc(100vh-120px)] w-[40vw] border-l border-blue-500/20 rounded-l-2xl z-50'
            }`}
            style={{ willChange: "transform" }}
          >
            <div className="h-full flex flex-col">
              {/* Neural Network Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <RoadmapNeuralNetwork />
              </div>
              
              {/* Header */}
              <div className={`relative px-4 md:px-8 py-4 md:py-6 bg-black border-b border-blue-500/20 ${
                isMobile ? 'rounded-t-2xl' : 'rounded-tl-2xl'
              }`}>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 tracking-tight">
                    AI IMPLEMENTATION ROADMAP
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-gray-400 tracking-wide">BY</span>
                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      NEX-SHFT™ METHODOLOGY
                    </span>
                  </div>
                </div>
                {/* Roadmap Drawer Close Button */}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`absolute top-6 right-6 rounded-full hover:bg-gray-800 transition-all duration-200 bg-gray-900/90 border border-gray-600 shadow-lg hover:shadow-xl hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center group z-50 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}
                  style={{ minWidth: '44px', minHeight: '44px' }} // Ensure minimum touch target
                  aria-label="Close roadmap drawer"
                >
                  <motion.div
                    className="w-full h-full flex items-center justify-center"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className={`text-white group-hover:text-purple-400 transition-colors ${
                      isMobile ? 'w-4 h-4' : 'w-5 h-5'
                    }`} />
                  </motion.div>
                </motion.button>
              </div>

              {/* Content Area - Fixed height with internal scrolling */}
              <div
                className="flex-1 p-4 md:p-8 overflow-y-auto bg-black relative"
                style={{
                  willChange: "scroll-position",
                  maxHeight: isMobile ? 'calc(75vh - 120px)' : 'calc(100vh - 220px)'
                }}
              >
                <div className="relative">
                  {/* Central Timeline Line */}
                  <div className="absolute left-[50px] top-2 bottom-0 w-1.5 bg-gradient-to-b from-blue-500/80 via-purple-500/80 to-blue-500/80 rounded-full"></div>

                  {/* Animated Pulse Dots along the timeline */}
                  <div className="absolute left-[45px] top-[100px] w-3 h-3 rounded-full bg-blue-400/80 shadow-lg shadow-blue-500/30">
                    <motion.div
                      animate={{
                        y: [0, 400, 0],
                        opacity: [0.7, 1, 0.7],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="absolute inset-0 rounded-full bg-blue-400/80"
                      style={{ willChange: "transform, opacity" }}
                    />
                  </div>
                  
                  {/* 6 Steps of the Roadmap */}
                  <div className="space-y-16">
                    {/* Step 1 */}
                    <div className="relative">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Step Number - Moved to Left */}
                        <div className="flex-shrink-0 w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-blue-500/20 border-2 border-blue-400/30 flex items-center justify-center">
                          <span className="text-base md:text-lg font-bold text-blue-400">1</span>
                        </div>

                        <div className="relative flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2 md:pr-4">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Needs Assessment</h3>
                              <p className="text-sm text-gray-400 mb-3">Understanding your business requirements and AI opportunities</p>
                              <div className="bg-gray-900/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 shadow-md">
                                <div className="flex items-start gap-2 mb-2">
                                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Initial business process analysis</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Data source identification & evaluation</span>
                                </div>
                              </div>
                            </div>

                            {/* Flag Icon at the End - Mobile Responsive */}
                            <div className="ml-2 md:ml-4 mt-2 flex-shrink-0">
                              <motion.div
                                animate={{
                                  rotateY: [0, 10, 0, -10, 0],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                style={{ willChange: "transform" }}
                              >
                                <Flag className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Connecting line to next node - Hidden on mobile for cleaner look */}
                          <div className="hidden md:block absolute top-[59px] left-[-30px] h-[80px] w-[100px] border-l-2 border-b-2 border-dashed border-blue-500/40 rounded-bl-3xl z-0"></div>
                          <div className="hidden md:block absolute top-[140px] left-[65px] w-3 h-3 border-b-2 border-r-2 border-blue-500/40 rotate-45 z-0"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="relative">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Step Number - Moved to Left */}
                        <div className="flex-shrink-0 w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-purple-500/20 border-2 border-purple-400/30 flex items-center justify-center">
                          <span className="text-base md:text-lg font-bold text-purple-400">2</span>
                        </div>

                        <div className="relative flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2 md:pr-4">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-2">AI Model Selection</h3>
                              <p className="text-sm text-gray-400 mb-3">Choosing the optimal AI technologies for your specific needs</p>
                              <div className="bg-gray-900/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 shadow-md">
                                <div className="flex items-start gap-2 mb-2">
                                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">LLM evaluation and selection</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Cost-benefit analysis of AI solutions</span>
                                </div>
                              </div>
                            </div>

                            {/* Flag Icon at the End - Mobile Responsive */}
                            <div className="ml-2 md:ml-4 mt-2 flex-shrink-0">
                              <motion.div
                                animate={{
                                  rotateY: [0, 10, 0, -10, 0],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 0.5
                                }}
                                style={{ willChange: "transform" }}
                              >
                                <Flag className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Connecting line to next node - Hidden on mobile for cleaner look */}
                          <div className="hidden md:block absolute top-[59px] left-[-30px] h-[80px] w-[100px] border-l-2 border-b-2 border-dashed border-purple-500/40 rounded-bl-3xl z-0"></div>
                          <div className="hidden md:block absolute top-[140px] left-[65px] w-3 h-3 border-b-2 border-r-2 border-purple-500/40 rotate-45 z-0"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="relative">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Step Number - Moved to Left */}
                        <div className="flex-shrink-0 w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-blue-500/20 border-2 border-blue-400/30 flex items-center justify-center">
                          <span className="text-base md:text-lg font-bold text-blue-400">3</span>
                        </div>

                        <div className="relative flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2 md:pr-4">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Data Preparation</h3>
                              <p className="text-sm text-gray-400 mb-3">Processing your data for optimal AI performance</p>
                              <div className="bg-gray-900/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 shadow-md">
                                <div className="flex items-start gap-2 mb-2">
                                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Data cleaning and normalization</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Vector database implementation</span>
                                </div>
                              </div>
                            </div>

                            {/* Flag Icon at the End - Mobile Responsive */}
                            <div className="ml-2 md:ml-4 mt-2 flex-shrink-0">
                              <motion.div
                                animate={{
                                  rotateY: [0, 10, 0, -10, 0],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 1.0
                                }}
                                style={{ willChange: "transform" }}
                              >
                                <Flag className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Connecting line to next node - Hidden on mobile for cleaner look */}
                          <div className="hidden md:block absolute top-[59px] left-[-30px] h-[80px] w-[100px] border-l-2 border-b-2 border-dashed border-blue-500/40 rounded-bl-3xl z-0"></div>
                          <div className="hidden md:block absolute top-[140px] left-[65px] w-3 h-3 border-b-2 border-r-2 border-blue-500/40 rotate-45 z-0"></div>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Step Number - Moved to Left */}
                        <div className="flex-shrink-0 w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-purple-500/20 border-2 border-purple-400/30 flex items-center justify-center">
                          <span className="text-base md:text-lg font-bold text-purple-400">4</span>
                        </div>

                        <div className="relative flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2 md:pr-4">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Model Training</h3>
                              <p className="text-sm text-gray-400 mb-3">Customizing AI models to your specific domain</p>
                              <div className="bg-gray-900/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 shadow-md">
                                <div className="flex items-start gap-2 mb-2">
                                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Fine-tuning and parameter optimization</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Performance testing and model evaluation</span>
                                </div>
                              </div>
                            </div>

                            {/* Flag Icon at the End - Mobile Responsive */}
                            <div className="ml-2 md:ml-4 mt-2 flex-shrink-0">
                              <motion.div
                                animate={{
                                  rotateY: [0, 10, 0, -10, 0],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 1.5
                                }}
                                style={{ willChange: "transform" }}
                              >
                                <Flag className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Connecting line to next node - Hidden on mobile for cleaner look */}
                          <div className="hidden md:block absolute top-[59px] left-[-30px] h-[80px] w-[100px] border-l-2 border-b-2 border-dashed border-purple-500/40 rounded-bl-3xl z-0"></div>
                          <div className="hidden md:block absolute top-[140px] left-[65px] w-3 h-3 border-b-2 border-r-2 border-purple-500/40 rotate-45 z-0"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 5 */}
                    <div className="relative">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Step Number - Moved to Left */}
                        <div className="flex-shrink-0 w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-blue-500/20 border-2 border-blue-400/30 flex items-center justify-center">
                          <span className="text-base md:text-lg font-bold text-blue-400">5</span>
                        </div>

                        <div className="relative flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2 md:pr-4">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-2">System Integration</h3>
                              <p className="text-sm text-gray-400 mb-3">Connecting AI with your existing business systems</p>
                              <div className="bg-gray-900/30 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 shadow-md">
                                <div className="flex items-start gap-2 mb-2">
                                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">API development and connection</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Workflow automation implementation</span>
                                </div>
                              </div>
                            </div>

                            {/* Flag Icon at the End - Mobile Responsive */}
                            <div className="ml-2 md:ml-4 mt-2 flex-shrink-0">
                              <motion.div
                                animate={{
                                  rotateY: [0, 10, 0, -10, 0],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 2.0
                                }}
                                style={{ willChange: "transform" }}
                              >
                                <Flag className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                              </motion.div>
                            </div>
                          </div>

                          {/* Connecting line to next node - Hidden on mobile for cleaner look */}
                          <div className="hidden md:block absolute top-[59px] left-[-30px] h-[80px] w-[100px] border-l-2 border-b-2 border-dashed border-blue-500/40 rounded-bl-3xl z-0"></div>
                          <div className="hidden md:block absolute top-[140px] left-[65px] w-3 h-3 border-b-2 border-r-2 border-blue-500/40 rotate-45 z-0"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step 6 */}
                    <div className="relative">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Step Number - Moved to Left */}
                        <div className="flex-shrink-0 w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full bg-purple-500/20 border-2 border-purple-400/30 flex items-center justify-center">
                          <span className="text-base md:text-lg font-bold text-purple-400">6</span>
                        </div>

                        <div className="relative flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2 md:pr-4">
                              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Deployment & Monitoring</h3>
                              <p className="text-sm text-gray-400 mb-3">Launch and continuous improvement of your AI solution</p>
                              <div className="bg-gray-900/30 backdrop-blur-sm border border-purple-500/20 rounded-lg p-3 shadow-md">
                                <div className="flex items-start gap-2 mb-2">
                                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Security implementation and compliance</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-xs text-gray-300">Performance monitoring and optimization</span>
                                </div>
                              </div>

                              <div className="mt-4 flex justify-start">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-400/30 backdrop-blur-sm">
                                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                                  <span className="text-[10px] font-semibold text-purple-300 tracking-wider">AI INTEGRATION COMPLETE</span>
                                </div>
                              </div>
                            </div>

                            {/* Flag Icon at the End - Mobile Responsive */}
                            <div className="ml-2 md:ml-4 mt-2 flex-shrink-0">
                              <motion.div
                                animate={{
                                  rotateY: [0, 10, 0, -10, 0],
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: 2.5
                                }}
                                style={{ willChange: "transform" }}
                              >
                                <Flag className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress indicator at bottom */}
                <div className="mt-10 backdrop-blur-md rounded-xl p-4 border border-blue-500/20">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-blue-400 text-xs font-bold tracking-wider flex items-center">
                      IMPLEMENTATION PROGRESS
                    </h4>
                    <div className="text-xs font-medium text-gray-400">6 Steps</div>
                  </div>
                  <div className="bg-gray-800/50 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      style={{ willChange: "width" }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-2 text-[10px] text-gray-500">
                    <span>Assessment</span>
                    <span>Selection</span>
                    <span>Preparation</span>
                    <span>Training</span>
                    <span>Integration</span>
                    <span>Deployment</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Roadmap Tab Button - Mobile optimized
const RoadmapTab = ({ onClick, isMobile }: { onClick: () => void, isMobile?: boolean }) => {
  return (
    <motion.button
      id="roadmap-fixed-button"
      onClick={onClick}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-black/90 to-gray-900/90
                 backdrop-blur-xl border-blue-500/40 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30
                 transition-all duration-300 group ${
                   isMobile
                     ? 'px-4 py-3 rounded-full border-2'
                     : 'pl-4 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-4 rounded-l-xl border-t border-l border-b'
                 }`}
      style={{
        willChange: "transform",
        transformOrigin: isMobile ? "center" : "right center",
        minHeight: isMobile ? '48px' : 'auto', // Ensure minimum touch target size
        minWidth: isMobile ? '48px' : 'auto'
      }}
    >
      <div className="flex flex-col items-end">
        <span className="text-xs sm:text-sm font-bold text-white">ROADMAP</span>
        <span className="text-[9px] sm:text-[10px] font-medium text-blue-400 mt-0.5">NEX-SHFT™ PROCESS</span>
      </div>
      <div className={`flex items-center justify-center rounded-lg bg-blue-500/15 group-hover:bg-blue-500/30 transition-colors ${
        isMobile ? 'w-10 h-10' : 'w-7 h-7 sm:w-8 sm:h-8'
      }`}>
        <motion.div
          whileHover={{ rotate: 15 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronLeft className={`text-blue-400 rotate-180 ${
            isMobile ? 'w-5 h-5' : 'w-4 h-4 sm:w-[18px] sm:h-[18px]'
          }`} />
        </motion.div>
      </div>
      
      {/* Animated pulse indicator */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-full opacity-70"
      />
    </motion.button>
  );
};

// Enhanced Side Tab Button - Mobile optimized
const SideTab = ({ onClick, isMobile }: { onClick: () => void, isMobile?: boolean }) => {
  return (
    <motion.button
      id="projects-fixed-button"
      onClick={onClick}
      whileHover={{ scale: 1.05, x: 8 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-black/90 via-purple-900/20 to-black/90
                 backdrop-blur-xl border-purple-500/50 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40
                 transition-all duration-300 group relative ${
                   isMobile
                     ? 'px-4 py-3 rounded-full border-2'
                     : 'pl-3 sm:pl-4 pr-4 sm:pr-6 py-3 sm:py-4 rounded-r-xl border-t border-r border-b'
                 }`}
      style={{
        willChange: "transform",
        transformOrigin: isMobile ? "center" : "left center",
        minHeight: isMobile ? '48px' : 'auto', // Ensure minimum touch target size
        minWidth: isMobile ? '48px' : 'auto'
      }}
    >
      <div className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300 ${
        isMobile ? 'w-10 h-10' : 'w-8 h-8 sm:w-10 sm:h-10'
      }`}>
        <motion.div
          whileHover={{ rotate: -15, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          style={{ willChange: "transform" }}
        >
          <Brain className={`text-purple-400 group-hover:text-purple-300 ${
            isMobile ? 'w-5 h-5' : 'w-4 h-4 sm:w-5 sm:h-5'
          }`} />
        </motion.div>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-200 transition-colors">AI PROJECTS</span>
        <span className="text-[9px] sm:text-[10px] font-medium text-purple-400 mt-0.5 group-hover:text-purple-300 transition-colors">BY NEX-DEVS</span>
      </div>

      {/* Animated indicator */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-10 bg-gradient-to-b from-purple-500 to-blue-500 rounded-l-full opacity-70"
      />
    </motion.button>
  );
};

// Custom simple tabs implementation
const CustomTabs = ({ 
  defaultTab, 
  tabs 
}: { 
  defaultTab: string, 
  tabs: { id: string, label: React.ReactNode, content: React.ReactNode }[] 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-md p-1 rounded-full">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        {tabs.map(tab => (
          <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

// Add this new component for the macOS-style window frame with code leaks
const MacOSWindow = ({ 
  children, 
  title, 
  variant = "blue" 
}: { 
  children: React.ReactNode; 
  title: string;
  variant?: "blue" | "purple";
}) => {
  return (
    <div className="relative group">
      {/* Left side AI code leak - Extended and optimized */}
      <div className={`absolute -left-16 -top-8 -bottom-8 w-40 opacity-0 group-hover:opacity-100 
        transition-all duration-700 ease-in-out transform group-hover:-translate-x-2
        flex items-center overflow-hidden ${
        variant === "blue" ? "text-blue-400/90" : "text-purple-400/90"
      }`}>
        <div className="text-[11px] font-mono leading-[1.15] whitespace-pre py-6" 
             style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          {`// Advanced AI Language Model Pipeline
interface LLMConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  stopSequences: string[];
}

class LanguageModelController {
  private config: LLMConfig;
  private vectorDB: VectorStore;
  private tokenizer: Tokenizer;
  private contextWindow: number;
  
  constructor() {
    this.config = {
      model: "gpt-4-turbo",
      temperature: 0.7,
      maxTokens: 4096,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      stopSequences: ["###"]
    };
    this.contextWindow = 128000;
    this.initializeComponents();
  }

  private async initializeComponents() {
    this.vectorDB = await VectorStore.initialize({
      engine: "pinecone",
      dimension: 1536,
      metric: "cosine"
    });
    
    this.tokenizer = new GPTTokenizer({
      model: this.config.model,
      addSpecialTokens: true
    });
  }

  async generateResponse(
    input: string,
    context?: string[]
  ): Promise<AIResponse> {
    const tokens = await this.tokenizer
      .encode(input);
    
    const relevantContext = context || 
      await this.retrieveContext(tokens);
      
    const enhancedPrompt = 
      this.constructPrompt({
        input: tokens,
        context: relevantContext,
        systemPrompt: this.getSystemPrompt()
      });

    return this.llm.generate({
      prompt: enhancedPrompt,
      ...this.config,
      stream: true,
      callbacks: {
        onToken: this.handleToken,
        onComplete: this.handleComplete
      }
    });
  }

  private async retrieveContext(
    query: number[]
  ): Promise<string[]> {
    const embedding = await this.llm
      .embeddings.create({
        input: query,
        model: "text-embedding-3-large"
      });

    const results = await this.vectorDB
      .search({
        vector: embedding,
        namespace: "knowledge-base",
        topK: 5,
        minScore: 0.8,
        filter: {
          metadata: {
            type: "documentation",
            status: "active"
          }
        }
      });

    return results.map(doc => doc.content);
  }
}`}
        </div>
      </div>
      
      {/* Right side AI code leak - Extended and optimized */}
      <div className={`absolute -right-16 -top-8 -bottom-8 w-40 opacity-0 group-hover:opacity-100 
        transition-all duration-700 ease-in-out transform group-hover:translate-x-2
        flex items-center overflow-hidden ${
        variant === "blue" ? "text-blue-400/90" : "text-purple-400/90"
      }`}>
        <div className="text-[11px] font-mono leading-[1.15] whitespace-pre py-6" 
             style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          {`// Neural Network Architecture
interface TransformerConfig {
  layers: number;
  heads: number;
  hiddenSize: number;
  intermediateSize: number;
  maxPositions: number;
  dropout: number;
  activation: "gelu" | "relu";
}

class TransformerModel {
  private config: TransformerConfig;
  private embeddings: Embeddings;
  private encoderLayers: EncoderLayer[];
  private layerNorm: LayerNorm;
  private dropout: Dropout;
  
  constructor(config: TransformerConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize() {
    this.embeddings = new Embeddings({
      vocabSize: 50257,
      hiddenSize: this.config.hiddenSize,
      maxPositions: this.config.maxPositions,
      dropout: this.config.dropout
    });

    this.encoderLayers = Array(this.config.layers)
      .fill(null)
      .map(() => new EncoderLayer({
        hiddenSize: this.config.hiddenSize,
        numHeads: this.config.heads,
        intermediateSize: 
          this.config.intermediateSize,
        dropout: this.config.dropout,
        activation: this.config.activation
      }));

    this.layerNorm = new LayerNorm(
      this.config.hiddenSize
    );
    
    this.dropout = new Dropout(
      this.config.dropout
    );
  }

  forward(
    input: Tensor,
    mask?: Tensor
  ): Tensor {
    // Input embeddings
    let hidden = this.embeddings(input);
    hidden = this.dropout(hidden);

    // Process through transformer layers
    for (const layer of this.encoderLayers) {
      // Self-attention mechanism
      const attention = layer.attention({
        query: hidden,
        key: hidden,
        value: hidden,
        mask: mask
      });

      // Add & Norm
      hidden = this.layerNorm(
        hidden + attention
      );

      // Feed-forward network
      const intermediate = layer.feedForward(
        hidden
      );
      
      // Final layer norm
      hidden = this.layerNorm(
        hidden + intermediate
      );
    }

    return this.outputProjection(hidden);
  }

  private outputProjection(
    hidden: Tensor
  ): Tensor {
    return hidden.matmul(
      this.embeddings.weight.transpose()
    );
  }
}`}
        </div>
      </div>

      {/* macOS window frame with enhanced shadow and border */}
      <div className={`relative border ${
        variant === "blue" ? "border-blue-500/30" : "border-purple-500/30"
      } rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-black/90 backdrop-blur-sm`}>
        {/* Window header with improved contrast */}
        <div className={`p-3 ${
          variant === "blue" ? "bg-gray-900/90 border-b border-blue-500/20" : "bg-gray-900/90 border-b border-purple-500/20"
        } flex items-center backdrop-blur-md`}>
          {/* Traffic light buttons with hover effect */}
          <div className="flex items-center space-x-2 mr-4">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors"></div>
          </div>
          {/* Window title with improved typography */}
          <div className={`text-sm ${
            variant === "blue" ? "text-blue-300" : "text-purple-300"
          } font-medium flex-1 text-center tracking-wide`}>
            {title}
          </div>
          <div className="w-12"></div> {/* Spacer for alignment */}
        </div>
        
        {/* Window content with subtle inner shadow */}
        <div className="relative shadow-inner">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function BusinessIntegrationPage() {
  const [selectedTechDetails, setSelectedTechDetails] = useState<PricingTier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mutual exclusivity: close other drawer when one opens
  const handleDrawerOpen = useCallback(() => {
    if (isRoadmapOpen) setIsRoadmapOpen(false);
    setIsDrawerOpen(true);
  }, [isRoadmapOpen]);

  const handleRoadmapOpen = useCallback(() => {
    if (isDrawerOpen) setIsDrawerOpen(false);
    setIsRoadmapOpen(true);
  }, [isDrawerOpen]);

  // Optimized animation variants
  const fadeInUpVariant = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }), []);

  const staggerContainer = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }), []);

  const modalVariants = useMemo(() => ({
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  }), []);

  const handleTechDetailsClick = useCallback((tier: PricingTier) => {
    setSelectedTechDetails(tier);
  }, []);

  const closeTechDetails = useCallback(() => {
    setSelectedTechDetails(null);
  }, []);

  return (
    <div className="min-h-screen bg-black pt-16 sm:pt-20 md:pt-32 relative overflow-hidden">
      {/* Project Drawer - Fixed positioning with mobile optimization */}
        <div id="projects-fixed-container" className={`fixed z-50 ${
          isMobile ? 'bottom-4 left-4' : 'left-0 top-36 sm:top-32'
        }`} style={{ position: 'fixed', transform: 'none' }}>
        <ProjectsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} isMobile={isMobile} />
        {!isRoadmapOpen && <SideTab onClick={handleDrawerOpen} isMobile={isMobile} />}
      </div>

      {/* Roadmap Drawer - Fixed positioning with mobile optimization */}
        <div id="roadmap-fixed-container" className={`fixed z-50 ${
          isMobile ? 'bottom-4 right-4' : 'right-0 top-36 sm:top-32'
        }`} style={{ position: 'fixed', transform: 'none' }}>
        <RoadmapDrawer isOpen={isRoadmapOpen} onClose={() => setIsRoadmapOpen(false)} isMobile={isMobile} />
        {!isDrawerOpen && <RoadmapTab onClick={handleRoadmapOpen} isMobile={isMobile} />}
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 relative z-[1]">
          {/* Title Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-12 sm:mb-16 md:mb-24 relative"
        >
          {/* Neural Network Animation specifically behind title */}
          <div className="absolute inset-0 h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
            <TitleNeuralNetwork />
          </div>

          {/* Enhanced Frosted Background for Title with Checkered Pattern - Mobile optimized - FORCED BEHIND TITLE */}
          <div className="absolute inset-x-0 top-[30px] sm:top-[40px] md:top-[50px] h-[200px] sm:h-[250px] md:h-[300px]
               bg-gradient-to-r from-blue-900/15 via-purple-900/20 to-blue-900/15
               backdrop-blur-[12px] sm:backdrop-blur-[15px] md:backdrop-blur-[18px] rounded-2xl sm:rounded-3xl mx-auto w-[95%] sm:w-[92%] max-w-4xl
               border border-blue-400/20 shadow-[0_0_30px_rgba(120,180,255,0.2)] sm:shadow-[0_0_40px_rgba(120,180,255,0.25)] md:shadow-[0_0_50px_rgba(120,180,255,0.3)]"
               style={{
                 zIndex: -50,
                 position: 'absolute',
                 transform: 'translateZ(-1px)'
               }}>

            {/* Checkered/Grid Pattern Background - Hidden on mobile, visible on desktop */}
            <div className="absolute inset-0 opacity-15 sm:opacity-20 overflow-hidden rounded-2xl sm:rounded-3xl hidden sm:block">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 20px,
                      rgba(120,180,255,0.3) 20px,
                      rgba(120,180,255,0.3) 22px
                    ),
                    repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 20px,
                      rgba(120,180,255,0.3) 20px,
                      rgba(120,180,255,0.3) 22px
                    )
                  `,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Additional grid intersections for more detail */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20px 20px, rgba(120,180,255,0.4) 1px, transparent 1px),
                    radial-gradient(circle at 40px 40px, rgba(120,180,255,0.4) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            {/* AI circuit pattern overlay - Mobile optimized */}
            <div className="absolute inset-0 opacity-8 sm:opacity-10 overflow-hidden rounded-2xl sm:rounded-3xl">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M10,30 L90,30" stroke="rgba(150,210,255,0.8)" strokeWidth="0.3" fill="none" />
                <path d="M10,70 L90,70" stroke="rgba(150,210,255,0.8)" strokeWidth="0.3" fill="none" />
                <path d="M30,10 L30,90" stroke="rgba(150,210,255,0.8)" strokeWidth="0.3" fill="none" />
                <path d="M70,10 L70,90" stroke="rgba(150,210,255,0.8)" strokeWidth="0.3" fill="none" />
                <circle cx="30" cy="30" r="1.5" fill="rgba(150,210,255,0.8)" />
                <circle cx="70" cy="30" r="1.5" fill="rgba(150,210,255,0.8)" />
                <circle cx="30" cy="70" r="1.5" fill="rgba(150,210,255,0.8)" />
                <circle cx="70" cy="70" r="1.5" fill="rgba(150,210,255,0.8)" />
              </svg>
            </div>
          </div>

          {/* Title Content - Mobile optimized - FORCED IN FRONT */}
          <div className="relative" style={{
            zIndex: 100,
            position: 'relative',
            transform: 'translateZ(1px)'
          }}>
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-4 sm:mb-6"
          >
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] sm:text-xs font-semibold text-blue-300 tracking-wider">POWERED BY NEX-SHFT™</span>
                <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-400 rounded-full animate-pulse"></div>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeInUpVariant}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 relative"
            >
              {/* AI-related effect: Binary code overlay on text - Mobile optimized */}
              <div className="absolute inset-0 overflow-hidden opacity-8 sm:opacity-10 -z-10">
                <div className="absolute inset-0 text-[6px] sm:text-[8px] text-blue-300 font-mono opacity-70 leading-2 sm:leading-3 select-none"
                     style={{transform: 'rotate(5deg)'}}>
                  {'10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101 10110010 01001101'.repeat(3)}
                </div>
              </div>

              <span className={`${audiowide.className} bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 drop-shadow-[0_0_8px_rgba(120,180,255,0.3)] sm:drop-shadow-[0_0_10px_rgba(120,180,255,0.3)]`}>
                AI-INTEGRATION
            </span>
            <br />
              <span className={`${audiowide.className} text-white relative`}>
                IN BUSINESS
                <motion.span
                  className="absolute -right-3 sm:-right-4 md:-right-6 top-0.5 sm:top-1 text-xl sm:text-2xl md:text-3xl text-blue-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  _
                </motion.span>
            </span>
          </motion.h1>

            <motion.p
            variants={fadeInUpVariant}
              className={`${vt323.className} text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0`}
              style={{ fontSize: '14px' }}
            >
              Enterprise-grade AI solutions with NLP & Vector DB technology
            </motion.p>

            {/* Modern subtitle with tech-inspired design - Mobile optimized */}
            <motion.div
              variants={fadeInUpVariant}
              className="mt-4 sm:mt-6 flex justify-center px-2"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-5 text-center max-w-3xl w-full">
                <div className="flex flex-col items-center">
                  <Brain className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-blue-400 mb-1 sm:mb-2" />
                  <span className={`${vt323.className} text-xs sm:text-sm text-gray-400 font-medium`} style={{ fontSize: '12px' }}>NEX-SHFT™</span>
                </div>
                <div className="flex flex-col items-center">
                  <Cpu className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-purple-400 mb-1 sm:mb-2" />
                  <span className={`${vt323.className} text-xs sm:text-sm text-gray-400 font-medium`} style={{ fontSize: '12px' }}>NLP Engine</span>
                </div>
                <div className="flex flex-col items-center">
                  <Database className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-blue-400 mb-1 sm:mb-2" />
                  <span className={`${vt323.className} text-xs sm:text-sm text-gray-400 font-medium`} style={{ fontSize: '12px' }}>Vector DB</span>
                </div>
                <div className="flex flex-col items-center">
                  <Bot className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-purple-400 mb-1 sm:mb-2" />
                  <span className={`${vt323.className} text-xs sm:text-sm text-gray-400 font-medium`} style={{ fontSize: '12px' }}>LLM Tuning</span>
                </div>
              </div>
            </motion.div>

            {/* Dedicated LLM Platform Buttons - Mobile optimized */}
            <motion.div
              variants={fadeInUpVariant}
              className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4 md:gap-6 px-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500/20 to-blue-500/30 rounded-full
                           border border-blue-500/40 backdrop-blur-sm flex items-center gap-1.5 sm:gap-2
                           hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 text-sm sm:text-base"
                onClick={() => {
                  const element = document.getElementById('openrouter-images');
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <Cpu className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />
                <span className={`${vt323.className} text-xs sm:text-sm font-medium text-blue-300`} style={{ fontSize: '12px' }}>OpenRouter</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500/20 to-purple-500/30 rounded-full
                           border border-purple-500/40 backdrop-blur-sm flex items-center gap-1.5 sm:gap-2
                           hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 text-sm sm:text-base"
                onClick={() => {
                  const element = document.getElementById('huggingface-images');
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <Brain className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
                <span className={`${vt323.className} text-xs sm:text-sm font-medium text-purple-300`} style={{ fontSize: '12px' }}>Hugging Face</span>
              </motion.button>
            </motion.div>
          </div>
            </motion.div>
            
        {/* OpenRouter and Hugging Face Images Section - Mobile optimized */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 relative bg-black/40 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800/50 mx-2 sm:mx-0"
        >
            <motion.div
              variants={fadeInUpVariant}
            className="px-4 z-10 relative"
            >
              {/* OpenRouter Images */}
              <div id="openrouter-images" className="mb-8">
                <h3 className={`${audiowide.className} text-blue-300 font-medium text-center mb-4 flex items-center justify-center gap-2`}>
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <span>OpenRouter Configuration</span>
                </h3>
                
              <div className="flex flex-col items-center space-y-8">
                {/* Image 1 - Model Configuration */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl w-full"
                  >
                  <MacOSWindow title="OpenRouter - Model Selection" variant="blue">
                    <div className="relative aspect-[16/9]">
                    <Image 
                      src="https://ik.imagekit.io/u7ipvwnqb/OPEN.png" 
                      alt="OpenRouter Configuration" 
                      width={700}
                      height={380}
                        className="w-full object-cover"
                      priority
                    />
                    </div>
                  </MacOSWindow>
                    <p className={`${vt323.className} text-sm text-gray-400 mt-2 text-center`} style={{ fontSize: '16px' }}>Primary model selection with routing preferences</p>
                  </motion.div>
                  
                {/* Image 2 - Advanced Settings */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl w-full"
                  >
                  <MacOSWindow title="OpenRouter - Advanced Configuration" variant="blue">
                    <div className="relative aspect-[16/9]">
                    <Image 
                      src="https://ik.imagekit.io/u7ipvwnqb/OPEN%202%20.png" 
                      alt="OpenRouter Advanced Settings" 
                      width={700}
                      height={380}
                        className="w-full object-cover"
                      priority
                    />
                    </div>
                  </MacOSWindow>
                    <p className="text-sm text-gray-400 mt-2 text-center">Advanced settings for fine-tuning response parameters</p>
                  </motion.div>
                </div>
              </div>
              
            {/* Hugging Face Images - With macOS-style windows */}
              <div id="huggingface-images" className="mt-16">
                <h3 className={`${audiowide.className} text-purple-300 font-medium text-center mb-4 flex items-center justify-center gap-2`}>
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>Hugging Face Integration</span>
                </h3>
                
              <div className="flex flex-col items-center space-y-8">
                {/* Image 1 - Model Hub */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl w-full"
                  >
                  <MacOSWindow title="Hugging Face - Model Hub" variant="purple">
                    <div className="relative aspect-[16/9]">
                    <Image 
                      src="https://miro.medium.com/v2/resize:fit:3840/format:webp/quality:75/1*kzEHq-JVe6AyNm6xUPIWzg.png" 
                      alt="Hugging Face Model Hub" 
                      width={700}
                      height={380}
                        className="w-full object-cover"
                      priority
                    />
                    </div>
                  </MacOSWindow>
                    <p className={`${vt323.className} text-sm text-gray-400 mt-2 text-center`} style={{ fontSize: '16px' }}>Model hub with extensive pre-trained models collection</p>
                  </motion.div>
                  
                {/* Image 2 - API Integration */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-3xl w-full"
                  >
                  <MacOSWindow title="Hugging Face - API Integration" variant="purple">
                    <div className="relative aspect-[16/9] overflow-hidden">
                    <Image 
                      src="https://huggingface.co/datasets/huggingface/documentation-images/resolve/0d113f24102e375a9bbe7a1f697bedd87377b450/hub/code_snippet-dark.png?download=true" 
                      alt="Hugging Face API Integration" 
                      width={700}
                      height={380}
                        className="w-full object-cover object-top" /* Changed to object-top to cut off bottom section */
                      priority
                    />
                    </div>
                  </MacOSWindow>
                    <p className={`${vt323.className} text-sm text-gray-400 mt-2 text-center`} style={{ fontSize: '16px' }}>API integration with streamlined code implementation</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
        </motion.div>

        {/* Four Pricing Tiers - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 sm:mt-10 md:mt-12 mb-12 sm:mb-16 md:mb-20 relative"
        >
          {/* Background Glow Effects */}
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

          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-4">
          <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${audiowide.className} text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4`}
          >
              AI Integration Plans (USD)
          </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${vt323.className} text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed`}
              style={{ fontSize: '14px' }}
            >
              Scalable AI solutions for startups, businesses, and enterprises.
            </motion.p>
          </div>

          {/* Pricing Cards - Mobile optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 relative">
            {pricingTiers.map((tier) => {
               const cardColors = {
                basic: { border: 'border-green-500/20', hoverBorder: 'hover:border-green-500', shadow: 'hover:shadow-green-500/20', gradient: 'from-green-500/10' },
                advanced: { border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500', shadow: 'hover:shadow-blue-500/20', gradient: 'from-blue-500/10' },
                enterprise: { border: 'border-orange-500/20', hoverBorder: 'hover:border-orange-500', shadow: 'hover:shadow-orange-500/20', gradient: 'from-orange-500/10' },
                voice: { border: 'border-pink-500/20', hoverBorder: 'hover:border-pink-500', shadow: 'hover:shadow-pink-500/20', gradient: 'from-pink-500/10' },
              };
              const colors = cardColors[tier.id as keyof typeof cardColors] || cardColors.basic;

              return (
              <motion.div
                key={tier.id}
                variants={fadeInUpVariant}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.2 }}
                className={`relative bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl overflow-hidden border ${colors.border} ${colors.hoverBorder} transition-all duration-300 shadow-xl ${colors.shadow}
                  ${tier.highlighted ? 'sm:scale-105 sm:-mt-4 !border-purple-500/30 hover:!border-purple-500 hover:!shadow-purple-500/20' : ''}
                `}
              >
                 <div className={`absolute inset-0 bg-gradient-to-br ${tier.highlighted ? 'from-purple-500/20' : colors.gradient} via-transparent to-transparent blur-xl pointer-events-none`} />

                {/* Card content - Mobile optimized */}
                  <div className="relative h-full p-4 sm:p-5 md:p-6 lg:p-8">
                  {/* Badge - Mobile optimized */}
                  {tier.badge && (
                    <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`
                        text-white text-[10px] sm:text-xs px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full font-bold flex items-center justify-center gap-1 sm:gap-1.5 shadow-lg
                        ${tier.highlighted
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 ring-1 sm:ring-2 ring-purple-400/30'
                          : tier.id === 'basic'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 ring-1 sm:ring-2 ring-green-400/30'
                            : tier.id === 'enterprise'
                              ? 'bg-gradient-to-r from-orange-500 to-amber-600 ring-1 sm:ring-2 ring-orange-400/30'
                              : tier.id === 'voice'
                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 ring-1 sm:ring-2 ring-pink-400/30'
                                : 'bg-gradient-to-r from-gray-700 to-gray-900 ring-1 sm:ring-2 ring-gray-500/30'
                        }
                      `}>
                        {tier.highlighted && <Star className="w-2.5 sm:w-3 md:w-3.5 h-2.5 sm:h-3 md:h-3.5" />}
                        {tier.badge}
                      </div>
                    </div>
                  )}

                  {/* Icon & Title - Mobile optimized */}
                  <div className='flex items-start gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4'>
                  <div className={`
                      mt-0.5 sm:mt-1 p-2 sm:p-2.5 md:p-3 rounded-lg inline-flex
                      ${tier.highlighted ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/10 text-blue-400'}
                  `}>
                    <div className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8">
                      {tier.icon}
                    </div>
                  </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 leading-tight">
                    {tier.title}
                  </h3>
                        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                          {tier.description}
                        </p>
                    </div>
                  </div>

                  {/* Price - Mobile optimized */}
                  <div className="my-3 sm:my-4">
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className={`
                        text-2xl sm:text-3xl md:text-4xl font-bold
                        ${tier.highlighted ? 'text-purple-300' : 'text-blue-300'}
                      `}>
                        {tier.price}
                      </span>
                      {tier.originalPrice && (
                        <span className="text-gray-500 text-sm sm:text-base md:text-lg line-through">
                          {tier.originalPrice}
                        </span>
                      )}
                    </div>
                    {tier.price !== 'Custom Quote' && (
                      <span className="text-gray-400 text-xs sm:text-sm">one-time setup</span>
                    )}
                  </div>

                  {/* Features - Mobile optimized */}
                    <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-6 sm:mb-7 md:mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 sm:gap-2.5 md:gap-3 text-xs sm:text-sm">
                        <Check className={`
                          w-3.5 sm:w-4 md:w-5 h-3.5 sm:h-4 md:h-5 mt-0.5 flex-shrink-0
                            ${tier.highlighted ? 'text-purple-400' : tier.id === 'basic' ? 'text-green-400' : tier.id === 'enterprise' ? 'text-orange-400' : tier.id === 'voice' ? 'text-pink-400' : 'text-blue-400'}
                        `} />
                          <span className="text-gray-300 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                    {/* Technical Details Button - Mobile optimized */}
                    <div className="flex flex-col space-y-3 sm:space-y-4">
                      <button
                    onClick={() => handleTechDetailsClick(tier)}
                        className={`
                          flex items-center justify-center text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 border backdrop-blur-sm
                          ${tier.highlighted
                            ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 border-purple-500/20 hover:border-purple-500/30'
                            : tier.id === 'basic'
                              ? 'bg-green-500/10 hover:bg-green-500/20 text-green-300 hover:text-green-200 border-green-500/20 hover:border-green-500/30'
                              : tier.id === 'enterprise'
                                ? 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 hover:text-orange-200 border-orange-500/20 hover:border-orange-500/30'
                                : tier.id === 'voice'
                                  ? 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-pink-200 border-pink-500/20 hover:border-pink-500/30'
                                  : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 border-blue-500/20 hover:border-blue-500/30'
                          }
                        `}
                      >
                        <Info size={14} className="mr-1 sm:mr-1.5" />
                        <span>Tech Details</span>
                      </button>

                      {/* CTA Button - Mobile optimized */}
                      <Link href={tier.buttonLink}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                            w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-white text-sm sm:text-base font-medium transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg
                        ${tier.highlighted
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 hover:shadow-purple-500/20'
                              : tier.id === 'basic'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 hover:shadow-green-500/20'
                                : tier.id === 'enterprise'
                                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 hover:shadow-orange-500/20'
                                  : tier.id === 'voice'
                                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 hover:shadow-pink-500/20'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 hover:shadow-blue-500/20'
                        }
                      `}
                    >
                      {tier.buttonText}
                    </motion.button>
                  </Link>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Premium AI Models Section - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-16 sm:mb-20 md:mb-24 lg:mb-32 relative"
            >
          {/* Background Glow Effects - Mobile optimized */}
              <motion.div
            className="absolute -top-10 sm:-top-15 md:-top-20 left-1/3 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-blue-500/5 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-4">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4"
            >
              Premium AI Model Integrations
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Integrate with the world's most advanced AI models through our streamlined API documentation
            </motion.p>
          </div>

          <div className="space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24">
            {/* Anthropic Section - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative px-4"
            >
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-purple-900/20 rounded-xl">
                      <Image
                        src="https://i.pinimg.com/736x/9b/a3/26/9ba3260ec0c415fecc86cf76eb4ab127.jpg"
                        alt="Anthropic Logo"
                        width={48}
                        height={48}
                        className="w-8 sm:w-10 h-8 sm:h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      Anthropic Claude
                      </h3>
                    </div>
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      State-of-the-art AI model with enhanced reasoning capabilities and robust safety features.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-purple-900/20 text-purple-400 rounded-full">Claude 3</span>
                      <span className="px-2.5 sm:px-3 py-1 text-xs sm:text-sm bg-purple-900/20 text-purple-400 rounded-full">Constitutional AI</span>
                  </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="Anthropic API Documentation" variant="purple">
                    <Image
                      src="https://i.ytimg.com/vi/QdG13VnV0B0/maxresdefault.jpg"
                      alt="Anthropic API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* OpenAI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-900/20 rounded-xl">
                      <Image
                        src="https://platform.theverge.com/wp-content/uploads/sites/2/2025/02/openai-old-logo.png?quality=90&strip=all&crop=7.8125%2C0%2C84.375%2C100&w=2400"
                        alt="OpenAI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                      OpenAI GPT-4
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Leading multimodal AI model with exceptional language understanding and generation capabilities.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">GPT-4 Turbo</span>
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">Vision API</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="OpenAI API Documentation" variant="blue">
                    <Image
                      src="https://images.ctfassets.net/lzny33ho1g45/5Lqdm4ItzwUbAr1V0jrQwO/b97cfd118263872e50c9d3a911afd8d1/openai-api-image17.png?w=1400"
                      alt="OpenAI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* Google Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-900/20 rounded-xl">
                      <Image
                        src="https://logospng.org/download/google-gemini/google-gemini-1024.png"
                        alt="Google Gemini Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      Google Gemini
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Advanced multimodal AI model with superior coding and mathematical reasoning abilities.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Gemini Pro</span>
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Ultra Vision</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="Google AI API Documentation" variant="blue">
                    <Image
                      src="https://assets.apidog.com/blog-next/2025/04/image-537.png"
                      alt="Google API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* DeepSeek Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative mb-12 sm:mb-16 md:mb-20 lg:mb-24"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-900/20 rounded-xl">
                      <Image 
                        src="https://graphicsinn1.com/wp-content/uploads/2025/01/deepseek-AI-vector-logo-graphicsinn1-scaled.jpg"
                        alt="DeepSeek Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                      DeepSeek Coder
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Specialized AI model for code generation and technical documentation with deep programming expertise.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-cyan-900/20 text-cyan-400 rounded-full">Code Generation</span>
                      <span className="px-3 py-1 text-sm bg-cyan-900/20 text-cyan-400 rounded-full">Technical Writing</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="DeepSeek API Documentation" variant="blue">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/DEEPSEEK.png"
                      alt="DeepSeek API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* GROK AI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-4"
            >
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-900/20 rounded-xl">
                      <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwGLjIYF5J3EJzmKaKFjLzLnCQl5fmrwoIA&s"
                        alt="GROK AI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      GROK AI
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      X's conversational AI model with real-time knowledge and distinctive personality.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Real-time Data</span>
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Multimodal</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="GROK AI API Documentation" variant="blue">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/GROK.png"
                      alt="GROK AI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* Perplexity AI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-4"
            >
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-purple-900/20 rounded-xl">
                      <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpPv1KMnK1H9jPpIRzMvNRjyGSauDIOsOONQ&s"
                        alt="Perplexity AI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      Perplexity AI
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Advanced AI-powered search engine with real-time information retrieval and citation capabilities.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-purple-900/20 text-purple-400 rounded-full">Research</span>
                      <span className="px-3 py-1 text-sm bg-purple-900/20 text-purple-400 rounded-full">Citations</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="Perplexity AI API Documentation" variant="purple">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/PERPLEXITY.png"
                      alt="Perplexity AI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* QWEN AI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative mb-12 sm:mb-16 md:mb-20 lg:mb-24 px-4"
            >
              <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16">
                <div className="flex-1 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 bg-emerald-900/20 rounded-xl">
                      <Image
                        src="https://logowik.com/content/uploads/images/qwen-ai9316.logowik.com.webp"
                        alt="QWEN AI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                      QWEN AI
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Alibaba's advanced multilingual AI model with exceptional performance in diverse language tasks.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">Multilingual</span>
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">Code Generation</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="QWEN AI API Documentation" variant="blue">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/QWEN.png"
                      alt="QWEN AI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* Temporarily Unavailable Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
            >
              {/* Cohere Section */}
              <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 border border-indigo-700/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                      <Image
                        src="https://logowik.com/content/uploads/images/cohere-new9011.logowik.com.webp"
                        alt="Cohere Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Cohere</h3>
                    <p className="text-gray-400 text-sm">Command & Generate</p>
                  </div>
                </div>
                <div className="bg-indigo-900/10 rounded-lg p-4 border border-indigo-700/20">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">API integration temporarily unavailable. Our team is working with Cohere to restore service as soon as possible.</p>
                  </div>
                </div>
              </div>

              {/* Mistral AI Section */}
              <div className="bg-gradient-to-br from-violet-900/20 to-violet-800/10 border border-violet-700/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-violet-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                      <Image
                        src="https://logosandtypes.com/wp-content/uploads/2025/02/Mistral-AI.png"
                        alt="Mistral AI Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">Mistral AI</h3>
                    <p className="text-gray-400 text-sm">Mixtral & Mistral</p>
                  </div>
                </div>
                <div className="bg-violet-900/10 rounded-lg p-4 border border-violet-700/20">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">API integration temporarily unavailable. Our team is working with Mistral AI to restore service as soon as possible.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Why Choose Our AI Solutions - Mobile optimized */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="mb-8 sm:mb-12 md:mb-16 relative px-4"
        >
          {/* Neural Network Background for Why Choose Section */}
          <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
            <PricingNeuralNetwork />
          </div>

          <motion.h2
            variants={fadeInUpVariant}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12 relative z-10"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Why Choose NEX-DEVS AI Solutions?
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <motion.div
              variants={fadeInUpVariant}
              className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast Implementation</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Get your AI solution up and running in days, not months. Our streamlined process ensures rapid deployment without compromising quality.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUpVariant}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise-Grade Security</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Bank-level security with SOC2 compliance, data encryption, and enterprise SSO integration to protect your business data.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUpVariant}
              className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
                <Star className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">24/7 Expert Support</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Dedicated support team with AI specialists available around the clock to ensure your systems run smoothly.
              </p>
            </motion.div>
          </div>
        </motion.div>



        {/* Call to Action */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariant}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Transform Your Business with AI?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join hundreds of businesses already leveraging our AI solutions to improve customer engagement,
              reduce operational costs, and drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/ai-services/custom-chatbot">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Your AI Journey
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link href="/contact?service=ai-consultation">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border border-blue-500/50 text-blue-400 px-8 py-3 rounded-lg font-semibold hover:bg-blue-500/10 transition-all duration-300"
                >
                  Schedule Consultation
                </motion.button>
              </Link>
          </div>
          </div>
        </motion.div>

        {/* Premium AI Models Documentation Section - Mobile optimized */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 mb-16 sm:mb-20 md:mb-24 lg:mb-32 relative"
        >
          {/* Background Glow Effects - Mobile optimized */}
          <motion.div
            className="absolute -top-10 sm:-top-15 md:-top-20 left-1/3 w-48 sm:w-64 md:w-80 lg:w-96 h-48 sm:h-64 md:h-80 lg:h-96 bg-blue-500/5 rounded-full blur-2xl sm:blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 px-4">
          <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4"
          >
              Premium AI Model Integrations
          </motion.h2>
          <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Integrate with the world's most advanced AI models through our streamlined API documentation
          </motion.p>
                    </div>

          <div className="space-y-24">
            {/* Anthropic Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-900/20 rounded-xl">
                      <Image
                        src="https://i.pinimg.com/736x/9b/a3/26/9ba3260ec0c415fecc86cf76eb4ab127.jpg"
                        alt="Anthropic Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                      </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      Anthropic Claude
                    </h3>
                              </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      State-of-the-art AI model with enhanced reasoning capabilities and robust safety features.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-purple-900/20 text-purple-400 rounded-full">Claude 3</span>
                      <span className="px-3 py-1 text-sm bg-purple-900/20 text-purple-400 rounded-full">Constitutional AI</span>
                            </div>
                          </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="Anthropic API Documentation" variant="purple">
                            <Image 
                      src="https://ik.imagekit.io/u7ipvwnqb/image.png"
                      alt="Anthropic API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                          </div>
                          </div>
                        </motion.div>
                        
            {/* OpenAI Section */}
                        <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-900/20 rounded-xl">
                            <Image 
                        src="https://platform.theverge.com/wp-content/uploads/sites/2/2025/02/openai-old-logo.png?quality=90&strip=all&crop=7.8125%2C0%2C84.375%2C100&w=2400"
                        alt="OpenAI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                            />
                          </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                      OpenAI GPT-4
                    </h3>
                          </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Leading multimodal AI model with exceptional language understanding and generation capabilities.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">GPT-4 Turbo</span>
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">Vision API</span>
                      </div>
                          </div>
                        </div>
                <div className="flex-1">
                  <MacOSWindow title="OpenAI API Documentation" variant="blue">
                    <Image
                      src="https://images.ctfassets.net/lzny33ho1g45/5Lqdm4ItzwUbAr1V0jrQwO/b97cfd118263872e50c9d3a911afd8d1/openai-api-image17.png?w=1400"
                      alt="OpenAI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                        </div>
                      </div>
                    </motion.div>

            {/* Google Section */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-900/20 rounded-xl">
                      <Image
                        src="https://logospng.org/download/google-gemini/google-gemini-1024.png"
                        alt="Google Gemini Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                      </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      Google Gemini
                    </h3>
                              </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Advanced multimodal AI model with superior coding and mathematical reasoning abilities.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Gemini Pro</span>
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Ultra Vision</span>
                            </div>
                          </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="Google AI API Documentation" variant="blue">
                            <Image 
                      src="https://assets.apidog.com/blog-next/2025/04/image-537.png"
                      alt="Google API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                          </div>
                          </div>
                        </motion.div>
                        
            {/* DeepSeek Section */}
                        <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative mb-24"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-cyan-900/20 rounded-xl">
                            <Image 
                        src="https://graphicsinn1.com/wp-content/uploads/2025/01/deepseek-AI-vector-logo-graphicsinn1-scaled.jpg"
                        alt="DeepSeek Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                            />
                          </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                      DeepSeek Coder
                    </h3>
                          </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Specialized AI model for code generation and technical documentation with deep programming expertise.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-cyan-900/20 text-cyan-400 rounded-full">Code Generation</span>
                      <span className="px-3 py-1 text-sm bg-cyan-900/20 text-cyan-400 rounded-full">Technical Writing</span>
                      </div>
                          </div>
                        </div>
                <div className="flex-1">
                  <MacOSWindow title="DeepSeek API Documentation" variant="blue">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/DEEPSEEK.png"
                      alt="DeepSeek API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                        </div>
                      </div>
                    </motion.div>

            {/* GROK AI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative mb-24"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-900/20 rounded-xl">
                      <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwGLjIYF5J3EJzmKaKFjLzLnCQl5fmrwoIA&s"
                        alt="GROK AI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                      GROK AI
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      X's conversational AI model with real-time knowledge and distinctive personality.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Real-time Data</span>
                      <span className="px-3 py-1 text-sm bg-blue-900/20 text-blue-400 rounded-full">Multimodal</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="GROK AI API Documentation" variant="blue">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/GROK.png"
                      alt="GROK AI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* Perplexity AI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="relative mb-24"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-900/20 rounded-xl">
                      <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpPv1KMnK1H9jPpIRzMvNRjyGSauDIOsOONQ&s"
                        alt="Perplexity AI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      Perplexity AI
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Advanced AI-powered search engine with real-time information retrieval and citation capabilities.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-purple-900/20 text-purple-400 rounded-full">Research</span>
                      <span className="px-3 py-1 text-sm bg-purple-900/20 text-purple-400 rounded-full">Citations</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="Perplexity AI API Documentation" variant="purple">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/PERPLEXITY.png"
                      alt="Perplexity AI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* QWEN AI Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="relative mb-24"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-900/20 rounded-xl">
                      <Image
                        src="https://logowik.com/content/uploads/images/qwen-ai9316.logowik.com.webp"
                        alt="QWEN AI Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 object-contain rounded-sm"
                      />
                    </div>
                    <h3 className="text-2xl font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                      QWEN AI
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      Alibaba's advanced multilingual AI model with exceptional performance in diverse language tasks.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">Multilingual</span>
                      <span className="px-3 py-1 text-sm bg-emerald-900/20 text-emerald-400 rounded-full">Code Generation</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <MacOSWindow title="QWEN AI API Documentation" variant="blue">
                    <Image
                      src="https://ik.imagekit.io/u7ipvwnqb/QWEN.png"
                      alt="QWEN AI API Documentation"
                      width={800}
                      height={450}
                      className="rounded-lg"
                    />
                  </MacOSWindow>
                </div>
              </div>
            </motion.div>

            {/* Temporarily Unavailable Sections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16"
            >
              {/* Cohere Section */}
              <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-800/10 border border-indigo-700/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-indigo-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                      <Image
                        src="https://logowik.com/content/uploads/images/cohere-new9011.logowik.com.webp"
                        alt="Cohere Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">Cohere</h3>
                    <p className="text-gray-400 text-sm">Command & Generate</p>
                  </div>
                </div>
                <div className="bg-indigo-900/10 rounded-lg p-4 border border-indigo-700/20">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">API integration temporarily unavailable. Our team is working with Cohere to restore service as soon as possible.</p>
                  </div>
                </div>
              </div>

              {/* Mistral AI Section */}
              <div className="bg-gradient-to-br from-violet-900/20 to-violet-800/10 border border-violet-700/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-violet-900/20 rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                      <Image
                        src="https://logosandtypes.com/wp-content/uploads/2025/02/Mistral-AI.png"
                        alt="Mistral AI Logo"
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">Mistral AI</h3>
                    <p className="text-gray-400 text-sm">Mixtral & Mistral</p>
                  </div>
                </div>
                <div className="bg-violet-900/10 rounded-lg p-4 border border-violet-700/20">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">API integration temporarily unavailable. Our team is working with Mistral AI to restore service as soon as possible.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}