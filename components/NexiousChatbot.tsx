'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Send, X, Minimize2, Bot, Code, Phone, ShoppingCart, Zap, Pause } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { audiowide, getAudiowideStyle } from '@/app/utils/fonts';

// Add CSS animations at the beginning of the component
const cssAnimations = `
  @keyframes chatSlideIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes chatSlideOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.8);
    }
  }

  @keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(124, 58, 237, 0); }
    100% { box-shadow: 0 0 0 0 rgba(124, 58, 237, 0); }
  }

  /* Remove any leftover boxes that might appear with chatbot */
  .nexious-ai-box-legacy,
  .ai-model-info,
  .ai-info-box,
  [class*="ai-model"]:not(.nexious-chat-container *),
  [id*="ai-module"]:not(.nexious-chat-container *) {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
    position: absolute !important;
    z-index: -9999 !important;
  }

  .nexious-chat-button {
    animation: pulseGlow 2s infinite;
    opacity: 1 !important;
    visibility: visible !important;
    display: flex !important;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  .nexious-chat-button:hover {
    transform: translateY(-2px) scale(1.02) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  .chat-animate-in {
    animation: chatSlideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .chat-animate-out {
    animation: chatSlideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .chat-fixed {
    position: fixed !important;
    bottom: 20px !important;
    right: 24px !important;
    z-index: 999999 !important;
  }
`;

// Optimized animation functions with better performance
const animateOpenChat = (chatElement: HTMLElement | null) => {
  if (!chatElement) return;

  // Hide any potential leftover model info boxes
  const legacyElements = document.querySelectorAll('.ai-model-info, .ai-info-box, [class*="ai-model"], [id*="ai-module"]');
  legacyElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.display = 'none';
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      el.classList.add('nexious-ai-box-legacy');
    }
  });

  // Set fixed position with optimized positioning
  chatElement.classList.add('chat-fixed');
  chatElement.style.willChange = 'transform, opacity';

  // Remove any existing animation classes
  chatElement.classList.remove('chat-animate-out');

  // Add slide in animation with better timing
  requestAnimationFrame(() => {
    chatElement.classList.add('chat-animate-in');
  });
};

const animateCloseChat = (chatElement: HTMLElement | null) => {
  if (!chatElement) return;

  // Remove any existing animation classes
  chatElement.classList.remove('chat-animate-out');
  chatElement.style.willChange = 'transform, opacity';

  // Add slide out animation with better timing
  requestAnimationFrame(() => {
    chatElement.classList.add('chat-animate-out');
  });

  // Clean up after animation
  setTimeout(() => {
    chatElement.style.willChange = 'auto';
  }, 250);
};

const animateMinimize = (
  fullElement: HTMLElement | null,
  minimizedElement: HTMLElement | null
) => {
  if (!fullElement || !minimizedElement) return;

  // Optimize performance
  fullElement.style.willChange = 'transform, opacity';
  minimizedElement.style.willChange = 'transform, opacity';

  // Animate full chatbot out
  fullElement.classList.add('chat-animate-out');

  // After animation completes with reduced timing
  setTimeout(() => {
    fullElement.style.display = 'none';
    fullElement.classList.remove('chat-animate-out');
    fullElement.style.willChange = 'auto';

    // Setup minimized version
    minimizedElement.style.display = 'flex';
    minimizedElement.classList.add('chat-fixed');

    // Animate minimized version in
    requestAnimationFrame(() => {
      minimizedElement.classList.add('chat-animate-in');
    });

    // Clean up after animation
    setTimeout(() => {
      minimizedElement.style.willChange = 'auto';
    }, 250);
  }, 180);
};

const animateMaximize = (
  minimizedElement: HTMLElement | null,
  fullElement: HTMLElement | null
) => {
  if (!minimizedElement || !fullElement) return;

  // Optimize performance
  minimizedElement.style.willChange = 'transform, opacity';
  fullElement.style.willChange = 'transform, opacity';

  // Animate minimized version out
  minimizedElement.classList.add('chat-animate-out');

  // After animation completes with reduced timing
  setTimeout(() => {
    minimizedElement.style.display = 'none';
    minimizedElement.classList.remove('chat-animate-out');
    minimizedElement.style.willChange = 'auto';

    // Setup full version
    fullElement.style.display = 'flex';
    fullElement.classList.add('chat-fixed');

    // Animate full version in
    requestAnimationFrame(() => {
      fullElement.classList.add('chat-animate-in');
    });

    // Clean up after animation
    setTimeout(() => {
      fullElement.style.willChange = 'auto';
    }, 250);
  }, 180);
};

import {
  websiteInformation,
  serviceCategories,
  workingProcess,
  frequentlyAskedQuestions,
  companyValues,
  developerSkills,
  ownerPersonalInformation,
  stepByStepProcedures,
  nexShftMethodology,
  technicalCapabilities,
  projectExamples
} from '@/lib/nexious-knowledge';

// Import AI settings - SINGLE SOURCE OF TRUTH
import aiSettings, {
  getAPIKey,
  setAPIKey,
  getModelSettings,
  prepareAPIRequest,
  prepareBackupAPIRequest,
  prepareFallbackAPIRequest,
  getBackupAPIKey,
  getFallbackModels,
  isProModeUnderMaintenance,
  getProModeMaintenanceMessage,
  getProModeTimeRemaining,
  shouldShowProModeCountdown,
  getStandardModeConfig,
  getStandardModeRequestCount,
  isStandardModeOnCooldown,
  getStandardModeCooldownRemaining,
  getFallbackSystemConfig,
  isFallbackSystemEnabled,
  getFallbackModelsByPriority,
  getPrimaryModelTimeout,
  getFallbackNotificationSettings,
  getUserTemperature,
  setUserTemperature,
  getUserMaxTokens,
  setUserMaxTokens,
  getEffectiveModelSettings,
  AIModelSettings,
  FallbackModelConfig
} from '@/utils/nexiousAISettings';

// Import NLP and conversation memory systems for human-like responses
import nlpProcessor, { generateNLPContext, humanizeResponse, addHumanTouches } from '@/utils/nlpProcessor';
import conversationMemory, { generateUserID, updateUserProfile, generateConversationContext, generateContextualGreeting, generateContextualReferences } from '@/utils/conversationMemory';
import responseTraining, { generateContextualResponse, trainingExamples } from '@/utils/responseTraining';

// Import performance monitoring for smooth 60fps experience
import performanceMonitor, { PerformanceMetrics } from '@/utils/performanceMonitor';

// Import model status indicator component
import ModelStatusIndicator from './ModelStatusIndicator';
import ThinkingContainer from './ThinkingContainer';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
  id?: string;
}

// Define PageContext interface
interface PageContext {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  systemPromptAddition: string;
}

interface MinimizedPosition {
  right: string;
  bottom: string;
}

// Define a maintenance message constant
const MAINTENANCE_MESSAGE = "Nexious is currently under maintenance. Please try again later.";

/**
 * Nexious AI Chatbot Component
 *
 * This component now uses centralized AI configuration from utils/nexiousAISettings.ts
 * All API keys, model settings, and configurations are managed centrally to prevent duplication.
 *
 * Features:
 * - Standard Mode: 15 message limit with 2-hour cooldown
 * - Pro Mode: Currently under maintenance (locked)
 * - Centralized API key management with backup fallback
 * - Professional maintenance messaging
 */

// localStorage key for persisting chat history
const CHAT_STORAGE_KEY = 'nexious-chat-history';
// Key to track if chat is open
const CHAT_IS_OPEN_KEY = 'nexious-chat-open';
// Key to track if PRO mode is enabled
const PRO_MODE_KEY = 'nexious-pro-mode';

// Team information
const teamInfo = {
  size: 7,
  members: [
    { name: "Ali Hasnaat", role: "Founder & Lead Developer" },
    { name: "Mudassir Ahmad", role: "AI Workflows for Business Specialist" },
    { name: "Faizan Khan", role: "UI/UX Designer" },
    { name: "Eman Ali", role: "Backend Developer" },
    { name: "Anns Bashir", role: "AI Agent Developer (N8N, Make.com Specialist)" },
    { name: "Hassam Baloch", role: "AI Agent Developer (N8N, Make.com Specialist)" },
    { name: "Usman Aftab", role: "AI Database & DevOps Specialist" }
  ],
  founded: "2018",
  projects: "950+"
};

// Competitor comparison data
const competitorData = {
  advantages: [
    "AI-augmented development process",
    "NEX-SHFT methodology for optimized results",
    "Specialized expertise in both design and development",
    "Transparent pricing with no hidden costs",
    "Dedicated project manager for each client",
    "Comprehensive post-launch support",
    "Data-driven approach to web development",
    "Focus on conversion optimization, not just aesthetics"
  ],
  comparisons: [
    {
      category: "Development Process",
      nexdevs: "AI-enhanced, data-driven approach with NEX-SHFT methodology",
      others: "Traditional waterfall or basic agile methods"
    },
    {
      category: "Technology Stack",
      nexdevs: "Modern stack with Next.js, React, TypeScript, and AI integration",
      others: "Often outdated technologies or limited tech stack"
    },
    {
      category: "Team Expertise",
      nexdevs: "Specialized experts in design, development, and optimization",
      others: "Often junior developers or outsourced talent"
    },
    {
      category: "Project Timeline",
      nexdevs: "Efficient delivery with AI-assisted development",
      others: "Typically longer timelines with multiple revisions"
    },
    {
      category: "Pricing Structure",
      nexdevs: "Transparent pricing with clear deliverables and milestones",
      others: "Often hidden costs and unexpected charges"
    },
    {
      category: "Client Communication",
      nexdevs: "Dedicated project manager and regular updates",
      others: "Limited communication and unclear project status"
    },
    {
      category: "Post-Launch Support",
      nexdevs: "Comprehensive support packages and maintenance options",
      others: "Limited support or expensive maintenance contracts"
    },
    {
      category: "Performance Optimization",
      nexdevs: "Built-in optimization for speed, SEO, and conversions",
      others: "Basic optimization requiring additional services"
    }
  ],
  commonCompetitors: [
    {
      name: "Typical Freelancers",
      strengths: ["Lower initial cost", "Simple project handling"],
      weaknesses: ["Limited expertise", "Unreliable timelines", "No team support", "Basic implementation"]
    },
    {
      name: "Traditional Agencies",
      strengths: ["Established processes", "Multiple team members"],
      weaknesses: ["Higher costs", "Slower delivery", "Outdated technologies", "Less innovation"]
    },
    {
      name: "DIY Website Builders",
      strengths: ["Low cost", "Quick setup"],
      weaknesses: ["Limited customization", "Poor performance", "No unique design", "Limited functionality"]
    },
    {
      name: "Offshore Development Teams",
      strengths: ["Lower rates", "Large teams"],
      weaknesses: ["Communication barriers", "Quality inconsistency", "Time zone challenges", "Limited business understanding"]
    }
  ]
};

// Other AI products
const otherProducts = [
  {
    name: "PET-GPT",
    description: "Specialized AI assistant for pet owners and animal lovers",
    useCase: "pet care, training advice, breed information, nutrition guidance"
  }
];

// Timeout for API responses (in milliseconds)
const RESPONSE_TIMEOUT = 25000; // 30 seconds to allow for more buffer time


// Define refined page contexts with improved color schemes and pathways
const pageContexts: Record<string, PageContext> = {
  home: {
    icon: <Bot size={18} className="text-white" />,
    title: "Nexious",
    description: "AI Assistant",
    gradientFrom: "from-purple-800",
    gradientTo: "to-indigo-900",
    systemPromptAddition: "You are currently on the Home page. Emphasize our core services and introduce our team. Guide the user to explore our services or get in touch.",
  },
  about: {
    icon: <Bot size={18} className="text-white" />,
    title: "About Us",
    description: "",
    gradientFrom: "from-blue-800",
    gradientTo: "to-indigo-900",
    systemPromptAddition: "You are currently on the About page. Focus on our team information, founding story, and company values. Highlight our experience and expertise.",
  },
  contact: {
    icon: <Bot size={18} className="text-white" />,
    title: "Contact",
    description: "",
    gradientFrom: "from-teal-800",
    gradientTo: "to-emerald-900",
    systemPromptAddition: "You are currently on the Contact page. Help users reach out to us effectively. Our contact email is contact@nex-devs.com, and we typically respond within 24 hours. Offer to guide them through project inquiries.",
  },
  pricing: {
    icon: <Bot size={18} className="text-white" />,
    title: "Pricing",
    description: "Quote Assistant",
    gradientFrom: "from-amber-800",
    gradientTo: "to-orange-900",
    systemPromptAddition: "You are currently on the Pricing page. Provide accurate pricing information and help users understand our pricing structure. Be prepared to explain the following key points: 1) Our pricing is shown in different currencies based on user geographic location, 2) The currency cannot be manually changed as it's tied to your region, 3) We offer installment payment plans for projects $1000+ or at least $500, 4) International customers are charged in USD with a service fee, 5) Each project has an exact price that you should provide when asked (WordPress Basic: $385, WordPress Professional: $495, WordPress Enterprise: $715, Full-Stack Basic: $605, etc.). If asked about payment methods, mention we accept Credit Card, PayPal, and Bank Transfer.",
  },
  checkout: {
    icon: <ShoppingCart size={18} className="text-white" />,
    title: "Checkout",
    description: "Payment Assistant",
    gradientFrom: "from-lime-800",
    gradientTo: "to-emerald-900",
    systemPromptAddition: "You are currently on the Checkout page. Help users complete their purchase and understand the payment process. We don't have a public checkout page - all payments are processed after direct consultation. Users should contact us via the Contact page (Home > Contact) or email contact@nex-devs.com to discuss payment options. We accept credit cards, bank transfers, and cryptocurrency. For users in Pakistan, we also accept JazzCash, EasyPaisa, SadaPay, and NayaPay. Explain that after consultation, we'll generate a custom invoice based on their needs and provide payment instructions.",
  },
  services: {
    icon: <Bot size={18} className="text-white" />,
    title: "Services",
    description: "Service Assistant",
    gradientFrom: "from-blue-600",
    gradientTo: "to-cyan-800",
    systemPromptAddition: "You are currently on the Services page. Provide detailed information about our service offerings, including features, pricing, and timelines. Highlight our expertise in web development, design, and custom solutions.",
  },
  "e-commerce-services": {
    icon: <ShoppingCart size={18} className="text-white" />,
    title: "E-Commerce",
    description: "E-Commerce Assistant",
    gradientFrom: "from-green-600",
    gradientTo: "to-emerald-800",
    systemPromptAddition: "You are currently on the E-Commerce Services page. Provide information about our e-commerce solutions, including Shopify, WooCommerce, and custom e-commerce development. Highlight our expertise in creating online stores with secure payment gateways, inventory management, and user-friendly interfaces.",
  },
  portfolio: {
    icon: <Bot size={18} className="text-white" />,
    title: "Portfolio",
    description: "Projects Assistant",
    gradientFrom: "from-violet-700",
    gradientTo: "to-purple-900",
    systemPromptAddition: "You are currently on the Portfolio page. Showcase our past projects and case studies. Highlight the technologies used, challenges overcome, and results achieved for our clients.",
  },
  work: {
    icon: <Bot size={18} className="text-white" />,
    title: "Our Work",
    description: "Projects Assistant",
    gradientFrom: "from-violet-700",
    gradientTo: "to-purple-900",
    systemPromptAddition: "You are currently on the Our Work page. This page showcases our portfolio of completed projects. Highlight the diverse range of industries we've worked with and the quality of our deliverables.",
  },
  "featured-projects": {
    icon: <Bot size={18} className="text-white" />,
    title: "Featured Projects",
    description: "Showcase Assistant",
    gradientFrom: "from-pink-700",
    gradientTo: "to-rose-900",
    systemPromptAddition: "You are currently on the Featured Projects page. This page highlights our most impressive and successful projects. Discuss the unique challenges and innovative solutions we implemented for these special cases.",
  },
  projects: {
    icon: <Bot size={18} className="text-white" />,
    title: "Projects",
    description: "Projects Assistant",
    gradientFrom: "from-violet-700",
    gradientTo: "to-purple-900",
    systemPromptAddition: "You are currently on the Projects page. This page provides a comprehensive list of our completed projects. Help users filter and find projects relevant to their interests or industry.",
  },
  blog: {
    icon: <Bot size={18} className="text-white" />,
    title: "Blog",
    description: "Content Assistant",
    gradientFrom: "from-emerald-700",
    gradientTo: "to-teal-900",
    systemPromptAddition: "You are currently on the Blog page. Discuss our articles on web development, design trends, and industry insights. Recommend relevant posts based on user interests.",
  },
  "discovery-call": {
    icon: <Phone size={18} className="text-white" />,
    title: "Discovery Call",
    description: "Consultation Assistant",
    gradientFrom: "from-blue-700",
    gradientTo: "to-indigo-900",
    systemPromptAddition: "You are currently on the Discovery Call page. This page allows potential clients to schedule an initial consultation with our team. Explain the purpose of discovery calls, what clients can expect, and how to prepare for the call.",
  },
  discovery: {
    icon: <Phone size={18} className="text-white" />,
    title: "Discovery",
    description: "Consultation Assistant",
    gradientFrom: "from-blue-700",
    gradientTo: "to-indigo-900",
    systemPromptAddition: "You are currently on the Discovery page. This page explains our project discovery process, where we learn about client needs and goals. Highlight the importance of this phase for project success.",
  },
  faqs: {
    icon: <Bot size={18} className="text-white" />,
    title: "FAQ",
    description: "Help Assistant",
    gradientFrom: "from-orange-700",
    gradientTo: "to-red-800",
    systemPromptAddition: "You are currently on the FAQ page. Answer common questions about our services, process, and policies. Direct users to relevant sections for more detailed information.",
  },
  terms: {
    icon: <Bot size={18} className="text-white" />,
    title: "Terms",
    description: "Policy Assistant",
    gradientFrom: "from-gray-700",
    gradientTo: "to-gray-900",
    systemPromptAddition: "You are currently on the Terms of Service page. Explain our legal terms and conditions in simple language. Highlight key points about intellectual property, payment terms, and service delivery.",
  },
  privacy: {
    icon: <Bot size={18} className="text-white" />,
    title: "Privacy",
    description: "Policy Assistant",
    gradientFrom: "from-gray-700",
    gradientTo: "to-gray-900",
    systemPromptAddition: "You are currently on the Privacy Policy page. Explain how we collect, use, and protect user data. Highlight our compliance with data protection regulations.",
  },
  default: {
    icon: <Bot size={18} className="text-white" />,
    title: "Nexious",
    description: "",
    gradientFrom: "from-purple-800",
    gradientTo: "to-indigo-900",
    systemPromptAddition: "You are on the NEX-DEVS website. Offer general help about our services, team, and process.",
  }
};

// Function to get the current page context based on pathname
const getPageContext = (pathname: string): PageContext => {
  if (!pathname || pathname === '/') return pageContexts.home;
  if (pathname.includes('/about')) return pageContexts.about;
  if (pathname.includes('/contact')) return pageContexts.contact;
  if (pathname.includes('/pricing')) return pageContexts.pricing;
  if (pathname.includes('/checkout')) return pageContexts.checkout;
  if (pathname.includes('/e-commerce-services')) return pageContexts["e-commerce-services"];
  if (pathname.includes('/discovery-call')) return pageContexts["discovery-call"];
  if (pathname.includes('/discovery')) return pageContexts.discovery;
  if (pathname.includes('/services')) return pageContexts.services;
  if (pathname.includes('/featured-projects')) return pageContexts["featured-projects"];
  if (pathname.includes('/portfolio')) return pageContexts.portfolio;
  if (pathname.includes('/work')) return pageContexts.work;
  if (pathname.includes('/projects')) return pageContexts.projects;
  if (pathname.includes('/blog')) return pageContexts.blog;
  if (pathname.includes('/faqs')) return pageContexts.faqs;
  if (pathname.includes('/terms')) return pageContexts.terms;
  if (pathname.includes('/privacy')) return pageContexts.privacy;
  return pageContexts.default;
};

// Page-specific knowledge
const pageSpecificKnowledge = {
  contact: {
    email: "contact@nex-devs.com",
    phone: "+92 3292425950",
    address: "Remote team, serving globally",
    responseTime: "24 hours",
    preferredContact: "Email is our preferred contact method for initial inquiries"
  },
  pricing: {
    currency: "USD",
    paymentMethods: ["Credit Card", "PayPal","jazz cash","easy paisa","Bank Transfer","sada pay",],
    internationalPricing: "We use USD for all pricing to ensure consistency for our international clients",
    customQuotes: "Custom quotes are available for projects with specific requirements",
    installmentProgram: "We offer installment payment plans for projects above $1000 or at least $500",
    regionSpecificPricing: "Our website shows pricing in different currencies based on your location. This cannot be changed manually."
  },
  checkout: {
    securityMeasures: "256-bit SSL encryption for all transactions",
    paymentProcessors: ["Stripe", "PayPal"],
    confirmation: "All customers receive an email confirmation after successful payment",
    support: "For payment issues, contact us at billing@nex-devs.com"
  },
  policies: {
    termsOfService: "All services are provided subject to our Terms of Service agreement available at /terms",
    privacyPolicy: "We collect and process personal data in accordance with our Privacy Policy at /privacy",
    refundPolicy: "Refund requests must be made within 48 hours of payment for eligible consideration",
    intellectualProperty: "Clients receive full ownership of deliverables upon complete payment",
    supportTerms: "30 days free support is included after project completion, covering only bug fixes"
  }
};

// Generate a comprehensive system prompt using the knowledge base
const generateSystemPrompt = (additionalContext: string = "", isProMode: boolean = false, isExplicitlyAskingForCode?: boolean) => {
  let prompt = "";

  if (isProMode) {
    prompt = `You are Nexious, a specialized AI assistant for the ${websiteInformation.name} website, running in PRO PREVIEW mode.
You are an expert technical consultant providing advanced, professional assistance with complete accuracy and comprehensive detail.

${additionalContext}

**PRO MODE PROFESSIONAL STANDARDS:**
1. Deliver EXPERT-LEVEL technical guidance with complete accuracy
2. Provide COMPREHENSIVE solutions that address all aspects of the query
3. Maintain PROFESSIONAL technical communication standards
4. Ensure all code examples are PRODUCTION-READY and well-documented

**IMPORTANT Response Formatting Rules for PRO Mode:**
1. If the user asks for code, or if providing a code example is the best way to answer, you **MUST** provide the code within a standard markdown code block, like this: \`\`\`language
// your code here
\`\`\`
Our system will automatically render this code block with syntax highlighting in a styled box.
2. For ALL other text in your response (explanations, descriptions, general answers), you **MUST use PLAIN TEXT ONLY.** Do not use any other markdown formatting (like ##, **, *, -, lists, or headers) for non-code parts of your answer.
3. Focus on technical accuracy and helpful code when appropriate.
${isExplicitlyAskingForCode ? 'The user is EXPLICITLY asking for code. Please provide a relevant and runnable code example in a single markdown code block.' : 'If providing code, ensure it is well-formatted in a markdown code block. Otherwise, provide clear, plain text technical explanations.'}
`;
  } else {
    // Standard Mode - Optimized for concise, professional responses
    prompt = `You are Nexious, a professional AI assistant for NEX-DEVS, a premier web development company. You represent our brand with excellence and professionalism.

${additionalContext}

**PROFESSIONAL RESPONSE STANDARDS:**
1. Provide COMPLETE, COMPREHENSIVE, and ACCURATE responses that fully address user queries
2. Maintain PROFESSIONAL, BUSINESS-APPROPRIATE language and tone at all times
3. Ensure responses are WELL-STRUCTURED with clear, logical flow and proper formatting
4. Deliver ACTIONABLE information that helps users make informed decisions
2. Be PROFESSIONAL yet CONVERSATIONAL - friendly but authoritative
3. Provide ESSENTIAL information only - avoid unnecessary details
4. Use BULLET POINTS for lists to improve readability
5. Focus on the MOST IMPORTANT details that answer the user's question
6. Avoid repetitive or redundant information
7. End with a clear NEXT STEP or call-to-action when appropriate
8. Use PLAIN TEXT formatting - no excessive markdown

**RESPONSE EFFICIENCY STANDARDS:**
- Answer directly and concisely within 800 tokens maximum
- Prioritize the most important information first
- Include specific pricing, timelines only when directly asked
- Mention NEX-SHFT methodology only when relevant
- Provide actionable information users can act on immediately
- Avoid lengthy explanations unless specifically requested

Focus on being concise, professional, and actionable while representing NEX-DEVS effectively.
`;
  }

  // Add website information (common for both modes, but PRO might use it for context)
  prompt += `\n\n### About ${websiteInformation.name}:\n${websiteInformation.description}\nContact: ${websiteInformation.contact.email}`;

  // For standard mode, provide comprehensive knowledge base access for complete responses
  if (!isProMode) {
    prompt += `\n\nKNOWLEDGE BASE ACCESS: You have full access to all NEX-DEVS information including the NEX-SHFT methodology, technical capabilities, project examples, and company details. Use this information to provide complete, informative responses that fully answer user questions.

### NEX-SHFT Methodology:
${nexShftMethodology.description}

Core Benefits:
${nexShftMethodology.benefits.slice(0, 4).map(benefit => `- ${benefit}`).join('\n')}

### Technical Capabilities:
Frontend: ${technicalCapabilities.frontendTechnologies.primary.join(', ')}
Backend: ${technicalCapabilities.backendTechnologies.primary.join(', ')}
Databases: ${technicalCapabilities.backendTechnologies.databases.join(', ')}
Specializations: ${technicalCapabilities.specializedServices.ecommerce.join(', ')}

### Industry Experience:
${technicalCapabilities.industryExperience.slice(0, 5).join(', ')} and more.

### Project Examples:
We've successfully delivered projects including ${projectExamples.ecommerceProjects[0].name}, ${projectExamples.businessApplications[0].name}, and ${projectExamples.portfolioWebsites[0].name} with excellent results.`;
  } else {
    // Add detailed information only for PRO mode
  prompt += `\n\nWEBSITE STRUCTURE AND NAVIGATION:
Our website has the following pages and routes:
1. Home (/) - Main landing page with overview of services
2. About (/about) - Information about our team and company
3. Contact (/contact) - Contact information and inquiry form
4. Pricing (/pricing) - Service pricing and packages
5. Checkout (/checkout) - Payment processing page for services
6. Services (/services) - Detailed service offerings
7. E-Commerce Services (/e-commerce-services) - Specialized e-commerce solutions
8. Portfolio (/portfolio) - Showcase of our work
9. Work (/work) - Alternative view of our portfolio
10. Featured Projects (/featured-projects) - Highlighted case studies
11. Projects (/projects) - Complete project listings
12. Blog (/blog) - Articles and insights
13. Discovery Call (/discovery-call) - Schedule consultation
14. Discovery (/discovery) - Our project discovery process
15. FAQs (/faqs) - Frequently asked questions
16. Terms (/terms) - Terms of service
17. Privacy (/privacy) - Privacy policy

When users ask about specific pages or how to navigate the site, refer to this structure.`;
  }

  // Add services information - simplified for standard mode
  prompt += `\n\n### Our Services:`;
  if (isProMode) {
  serviceCategories.forEach(category => {
    prompt += `\n\n${category.name}:`;
    category.services.forEach(service => {
      prompt += `\n- ${service.name}: ${service.description}
  Tech: ${service.technologies.join(', ')}
  Time: ${service.timeline}
  Price: ${service.exactPrice ? '$' + service.exactPrice : service.priceRange}`;

      if (service.popular) {
        prompt += ` (popular)`;
      }
    });
  });
  } else {
    // Simplified service information for standard mode
    serviceCategories.forEach(category => {
      prompt += `\n\n${category.name}:`;
      category.services.forEach(service => {
        prompt += `\n- ${service.name}: ${service.description.split('.')[0]}.`;
        if (service.popular) {
          prompt += ` (popular)`;
        }
      });
    });
  }

  // Add working process - simplified for standard mode
  prompt += `\n\n### Process:`;
  if (isProMode) {
  workingProcess.forEach(stage => {
    prompt += `\n\n${stage.stage} (${stage.timeline}): ${stage.description}`;
  });
  } else {
    // Simplified process for standard mode
    workingProcess.forEach(stage => {
      prompt += `\n\n${stage.stage}: ${stage.description.split('.')[0]}.`;
    });
  }

  // Add developer skills (more relevant for PRO mode, but good context for standard)
  prompt += `\n\n### Skills (Primarily for PRO mode context, summarize for standard):`;
  if (isProMode) {
    developerSkills.forEach(skill => {
      prompt += `\n\n${skill.title}: ${skill.description}`;
    });
  } else {
    developerSkills.slice(0, 5).forEach(skill => { // Keep it brief for standard
      prompt += `\n\n${skill.title}: Briefly, ${skill.description.substring(0, 100)}...`;
    });
  }


  // Add FAQs - simplified for standard mode
  prompt += `\n\n### FAQs:`;
  if (isProMode) {
  frequentlyAskedQuestions.forEach(faq => {
    prompt += `\n\nQ: ${faq.question}\nA: ${faq.answer}`;
  });
  } else {
    // Only include most important FAQs for standard mode
    frequentlyAskedQuestions.slice(0, 5).forEach(faq => {
      prompt += `\n\nQ: ${faq.question}\nA: ${faq.answer.split('.')[0]}.`;
    });
  }

  // Add team info
  prompt += `\n\nTeam: ${teamInfo.members.map(m => m.name).join(', ')} - Founded ${teamInfo.founded} - ${teamInfo.projects} projects`;

  // Add competitor comparison data - only in PRO mode
  if (isProMode) {
  prompt += `\n\n### Competitor Comparisons:`;
  prompt += `\n\nNEX-DEVS Advantages:`;
  competitorData.advantages.forEach(advantage => {
    prompt += `\n- ${advantage}`;
  });
  prompt += `\n\nDetailed Comparison Points:`;
  competitorData.comparisons.forEach(comp => {
    prompt += `\n\n${comp.category}:`;
    prompt += `\n- NEX-DEVS: ${comp.nexdevs}`;
    prompt += `\n- Others: ${comp.others}`;
  });
  prompt += `\n\nCommon Competitors Analysis:`;
  competitorData.commonCompetitors.forEach(competitor => {
    prompt += `\n\n${competitor.name}:`;
    prompt += `\n- Strengths: ${competitor.strengths.join(', ')}`;
    prompt += `\n- Weaknesses: ${competitor.weaknesses.join(', ')}`;
  });
  } else {
    // Just a brief mention of competitive advantages for standard mode
    prompt += `\n\nNEX-DEVS stands out with personalized service, transparent pricing, and quality code.`;
  }

  // Add step-by-step procedures information (full details for PRO, summary for standard)
  if (isProMode) {
  prompt += `\n\n### Step-by-Step Procedures:`;
  Object.values(stepByStepProcedures).forEach(procedure => {
    prompt += `\n\n${procedure.title}: ${procedure.description}`;
      procedure.steps.forEach(step => {
        prompt += `\n  ${step.stepNumber}. ${step.title}: ${step.description}`;
        if (step.details) {
          prompt += `\n     Details: ${step.details}`;
        }
      });
    });
  }

  // Final reminder for standard mode to provide concise, professional responses
  if (!isProMode) {
    prompt += `\n\nFINAL REMINDERS FOR STANDARD MODE:
1. Keep responses SHORT and TO THE POINT - maximum 2-4 sentences
2. Be PROFESSIONAL yet CONVERSATIONAL - maintain expertise while being approachable
3. Include ONLY the most essential information needed to answer the question
4. Use BULLET POINTS for multiple items to improve readability
5. Focus on being ACTIONABLE and HELPFUL - provide clear next steps
6. Avoid lengthy explanations unless specifically requested
7. End responses with a clear call-to-action or next step when appropriate

**HUMAN-LIKE RESPONSE ELEMENTS:**
- Use natural conversational language with contractions (we're, you'll, it's)
- Include empathy markers ("I understand," "That makes sense," "Great question!")
- Add personal touches ("In my experience," "We've found that," "I'd love to help")
- Use conversational connectors ("So," "Well," "Actually," "Here's the thing:")
- Show genuine enthusiasm for helping ("Excited to work with you," "Can't wait to see your project")
- Match the user's energy level and communication style
- Sound like a knowledgeable friend, not a robot`;
  }

  return prompt;
};

// Update getTextSizeClass function to accept parameters
const getTextSizeClass = (role: string, isProMode: boolean = false, isDesktop: boolean = false) => {
  if (role === 'system') return 'text-xs';

  if (isProMode && isDesktop) {
    return 'text-[13px] leading-relaxed'; // Make text smaller for PRO mode on desktop
  }

  // Use medium font weight for PRO mode but keep text smaller
  if (isProMode) {
    return 'text-sm font-medium leading-relaxed';
  }

  return 'text-base'; // Standard text size for other cases
};

  // Professional welcome message optimized for NEX-DEVS brand standards
const createInitialMessage = (isProEnabled: boolean = false) => {
  if (isProEnabled) {
    return {
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };
  }

  return {
    role: 'assistant',
    content: '',
    timestamp: Date.now()
  };
};

// Function to analyze query complexity for appropriate response length
const analyzeQueryComplexity = (query: string): string => {
  // Convert to lowercase for easier pattern matching
  const lowerQuery = query.toLowerCase();

  // Check for comparison requests
  if (
    lowerQuery.includes('compare') ||
    lowerQuery.includes('vs') ||
    lowerQuery.includes('versus') ||
    lowerQuery.includes('difference between') ||
    lowerQuery.includes('how does nex-devs compare')
  ) {
    return 'comparison';
  }

  // Check for code requests
  if (
    lowerQuery.includes('code') ||
    lowerQuery.includes('function') ||
    lowerQuery.includes('implementation') ||
    lowerQuery.includes('syntax') ||
    lowerQuery.includes('example of') ||
    lowerQuery.includes('how to implement')
  ) {
    return 'code';
  }

  // Check for technical explanation requests
  if (
    lowerQuery.includes('explain') ||
    lowerQuery.includes('how does') ||
    lowerQuery.includes('what is') ||
    lowerQuery.includes('concept of') ||
    lowerQuery.includes('understand')
  ) {
    return 'technical';
  }

  // Check for step-by-step guides
  if (
    lowerQuery.includes('step') ||
    lowerQuery.includes('guide') ||
    lowerQuery.includes('process') ||
    lowerQuery.includes('how to') ||
    lowerQuery.includes('instructions')
  ) {
    return 'guide';
  }

  // Check for pricing or service inquiries (should be concise)
  if (
    lowerQuery.includes('price') ||
    lowerQuery.includes('cost') ||
    lowerQuery.includes('service') ||
    lowerQuery.includes('offering') ||
    lowerQuery.includes('package')
  ) {
    return 'service';
  }

  // Check for simple questions
  if (
    lowerQuery.split(' ').length < 8 ||
    lowerQuery.endsWith('?') && lowerQuery.split(' ').length < 10
  ) {
    return 'simple';
  }

  // Default to moderate complexity
  return 'moderate';
};

// Promotion text variations to add after each response
const promotionTexts = [
  "Discover our specialized AI chatbot: PET-GPT for all pet-related inquiries.",
  "Check out PET-GPT, our dedicated AI assistant for pet owners.",
  "For pet-related questions, try our specialized PET-GPT chatbot.",
  "Need help with pets? Visit our PET-GPT chatbot for expert advice.",
  "PET-GPT, our AI for pet lovers, is now available. Check it out!"
];

// Get a random promotion text
const getRandomPromotion = () => {
  const index = Math.floor(Math.random() * promotionTexts.length);
  return promotionTexts[index];
};

// Page-specific suggested questions (3 per page)
const getPageSuggestedQuestions = (pathname: string | null): string[] => {
  if (!pathname || pathname === '/') {
    return [
      "What services do you offer?",
      "Tell me about your team",
      "How does your process work?"
    ];
  }
  if (pathname.includes('/about')) {
    return [
      "Tell me about your team experience",
      "What makes your team unique?",
      "When was the company founded?"
    ];
  }
  if (pathname.includes('/contact')) {
    return [
      "What's your response time?",
      "How can I start a project?",
      "Do you work internationally?"
    ];
  }
  if (pathname.includes('/pricing')) {
    return [
      "Do you offer installment plans?",
      "What's included in each package?",
      "Do you have custom pricing options?"
    ];
  }
  if (pathname.includes('/checkout')) {
    return [
      "Is my payment secure?",
      "What payment methods do you accept?",
      "What happens after payment?"
    ];
  }
  if (pathname.includes('/services')) {
    return [
      "What's your development approach?",
      "How long does a project take?",
      "Do you offer maintenance services?"
    ];
  }
  if (pathname.includes('/e-commerce-services')) {
    return [
      "What e-commerce platforms do you work with?",
      "Can you integrate payment gateways?",
      "How do you handle product inventory?"
    ];
  }
  if (pathname.includes('/portfolio') || pathname.includes('/work')) {
    return [
      "Can I see examples of your work?",
      "What industries have you worked with?",
      "What technologies do you use most often?"
    ];
  }
  if (pathname.includes('/featured-projects')) {
    return [
      "What's your most successful project?",
      "Can you explain this case study?",
      "What challenges did you overcome?"
    ];
  }
  if (pathname.includes('/projects')) {
    return [
      "How many projects have you completed?",
      "Do you have experience in my industry?",
      "What was your most challenging project?"
    ];
  }
  if (pathname.includes('/blog')) {
    return [
      "What topics do you write about?",
      "What's your latest article?",
      "Do you have content about web development?"
    ];
  }
  if (pathname.includes('/discovery') || pathname.includes('/discovery-call')) {
    return [
      "How does the discovery process work?",
      "How long is a discovery call?",
      "What should I prepare for the call?"
    ];
  }
  if (pathname.includes('/faqs')) {
    return [
      "What's your typical timeline?",
      "How do revisions work?",
      "What happens if I'm not satisfied?"
    ];
  }
  // Default fallback questions
  return [
    "What services do you offer?",
    "How can you help my business?",
    "What's your development approach?"
  ];
};

// Add the chat logging function after getPageSuggestedQuestions
const logChatRequest = async (request: string, response: string, responseTime: number, status: string) => {
  try {
    // Only log if we're in a browser environment
    if (typeof window === 'undefined') return;

    const logData = {
      timestamp: Date.now(),
      request,
      response,
      responseTime,
      status
    };

    // Use simple localStorage logging first for persistence
    // This will be used as a fallback if the API call fails
    try {
      const existingLogs = JSON.parse(localStorage.getItem('nexious-chat-logs') || '[]');
      existingLogs.push(logData);
      // Keep only the last 100 logs
      if (existingLogs.length > 100) {
        existingLogs.splice(0, existingLogs.length - 100);
      }
      localStorage.setItem('nexious-chat-logs', JSON.stringify(existingLogs));
    } catch (e) {
      console.error('Error storing logs in localStorage:', e);
    }

    // Also try to send to server API
    try {
      await fetch('/api/chatbot/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData)
      });
    } catch (e) {
      console.error('Error sending log to server:', e);
    }
  } catch (error) {
    console.error('Error logging chat request:', error);
  }
};

// Add chatbot enabled check function
const isChatbotEnabled = async () => {
  try {
    // Check in localStorage first for faster response, but with very short cache time
    const cachedSettingsStr = localStorage.getItem('nexious-chatbot-settings');
    if (cachedSettingsStr) {
      const cachedSettings = JSON.parse(cachedSettingsStr);
      // Only use cached settings if they're very recent (less than 5 seconds old)
      const isCacheValid = Date.now() - cachedSettings.timestamp < 5 * 1000;
      if (isCacheValid) {
        return cachedSettings.enabled;
      }
    }

    // Always add a cache-busting timestamp
    const timestamp = Date.now();

    // If no valid cache, check with the server
    const response = await fetch(`/api/chatbot/settings/public?t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'X-Requested-With': 'fetch'
      }
    });

    if (response.ok) {
      const data = await response.json();
      // Cache the result with timestamp
      localStorage.setItem('nexious-chatbot-settings', JSON.stringify({
        enabled: data.enabled,
        timestamp: Date.now()
      }));

      // Log status change for debugging
      console.log(`Chatbot status: ${data.enabled ? 'Enabled' : 'Disabled'}`);

      return data.enabled;
    }

    // If we can't reach the server, check localStorage regardless of time
    // This is a fallback to prevent constant API calls if the server is down
    if (cachedSettingsStr) {
      try {
        const cachedSettings = JSON.parse(cachedSettingsStr);
        return cachedSettings.enabled;
      } catch (e) {
        console.error('Error parsing cached settings:', e);
      }
    }

    // Default to disabled if we can't determine status
    return false;
  } catch (error) {
    console.error('Error checking if chatbot is enabled:', error);
    // Default to disabled if there's an error
    return false;
  }
};

// All API keys and configurations are now managed centrally in utils/nexiousAISettings.ts

// Add a specific error handler for the 402 Payment Required error
const handle402Error = async (errorDetails: string, userMessage: string) => {
  // Log the error
  console.error('OpenRouter API 402 Error:', errorDetails);

  // Notify admin
  notifyApiKeyIssue('BILLING_ERROR', `402 Payment Required - ${errorDetails}`);

  // Create a professional user-friendly message that doesn't mention billing
  const fallbackResponse = "I apologize, but our AI service is currently undergoing scheduled maintenance to improve performance. Our team has been notified. In the meantime, I can still assist with questions about our web development services, including custom solutions tailored to your specific needs.";

  // Try to use the backup API key from centralized settings
  try {
    console.log('Attempting to use backup API key...');

    // Use the centralized backup API request preparation
    const backupRequest = await prepareBackupAPIRequest(userMessage);

    const response = await fetch(backupRequest.url, {
      method: 'POST',
      headers: backupRequest.headers,
      body: JSON.stringify(backupRequest.body)
    });

    // Check if backup request succeeded
    if (response.ok) {
      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        const backupResponse = data.choices[0].message.content;
        console.log('Successfully used backup API key');
        return {
          error: 'Used backup API key',
          status: 200,
          fallbackResponse: backupResponse
        };
      }
    }
  } catch (backupError) {
    console.error('Backup API key also failed:', backupError);
  }

  // If backup fails, return the professional message
  return {
    error: 'System maintenance or resource optimization in progress',
    status: 402,
    fallbackResponse
  };
};

// Update the getApiKey function to use the new module
const getApiKey = async () => {
  try {
    // Use the new module's getAPIKey function - we can use either mode since they share the same key now
    const apiKey = await getAPIKey('standard');

    if (!apiKey) {
      throw new Error('No API key available');
    }

    // Basic validation for API key format
    if (!apiKey.startsWith('sk-or-')) {
      console.error('Invalid OpenRouter API key format. API key should start with sk-or-');
      throw new Error('Invalid API key format');
    }

    return apiKey;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    notifyApiKeyIssue('retrieval_error', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

// Add model selection function
const getSelectedModel = async (): Promise<string> => {
  // Always return the latest DeepSeek model for both modes
  return 'deepseek/deepseek-r1-0528:free';
};

// Add a new helper function for notifying about API key issues
const notifyApiKeyIssue = async (errorType: string, errorDetails: string) => {
  try {
    // Try to log the error to the server for admin notification
    await fetch('/api/chatbot/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errorType,
        errorDetails,
        timestamp: Date.now()
      })
    }).catch(err => console.error('Failed to send API error notification:', err));

    // Also store in localStorage for admin panel to display
    try {
      const existingErrors = JSON.parse(localStorage.getItem('nexious-api-errors') || '[]');
      existingErrors.push({
        type: errorType,
        details: errorDetails,
        timestamp: Date.now()
      });
      // Keep only the last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      localStorage.setItem('nexious-api-errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('Error storing API errors in localStorage:', e);
    }
  } catch (error) {
    console.error('Failed to notify about API key issue:', error);
  }
};

// Mobile popup component
function MobilePopup({ onClose }: { onClose: () => void }) {
  // Optimize initial render
  useEffect(() => {
    const container = document.getElementById('mobile-popup-container');
    if (container) {
      container.style.opacity = '1';
    }
  }, []);

  return (
    <div
      id="mobile-popup-container"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[6px] transform-gpu opacity-0 transition-opacity duration-150"
      style={{
        transform: 'translate3d(0,0,0)',
        willChange: 'transform, opacity',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 max-w-[90vw] w-[320px] shadow-2xl border border-gray-700/50 transform-gpu"
        style={{
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="flex flex-col items-center text-center">
          {/* Optimized Icon */}
          <div className="w-14 h-14 mb-3 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center transform-gpu">
            <svg className="w-7 h-7 text-white" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12C21 12 18 18 12 18C6 18 3 12 3 12C3 12 6 6 12 6C18 6 21 12 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Optimized Title */}
          <h3 className="text-lg font-semibold text-white mb-2">
            Nexious AI Experience
          </h3>

          {/* Optimized Message */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            We're excited to have you try our powerful AI chat! 🌟 For the smoothest experience, we recommend using a desktop device as our mobile version is currently being optimized.
          </p>

          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            Our team is working hard to bring you the best mobile experience soon. Thank you for your patience! 💜
          </p>

          {/* Optimized Button with touch feedback */}
          <button
            onClick={onClose}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
              if (navigator.vibrate) navigator.vibrate(20);
            }}
            onTouchEnd={(e) => {
              setTimeout(() => {
                e.currentTarget.style.transform = 'scale(1)';
              }, 100);
            }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg transform-gpu active:scale-95"
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NexiousChatbot() {
  const pathname = usePathname();
  const pageContext = getPageContext(pathname || '');

  // Flag to control display of the decorative floating label above the chat button. Disabled to avoid duplicate labels.
  const showFloatingLabel = false;

  // Inject global CSS animations once the component is mounted (valid hook usage)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const styleTag = document.createElement('style');
      styleTag.innerHTML = cssAnimations;
      document.head.appendChild(styleTag);
      return () => {
        document.head.removeChild(styleTag);
      };
    }
  }, []);

  // Initialize state to always closed on page load
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showPromo, setShowPromo] = useState(true); // State to control promotional area visibility
  // Removed mobile popup - now using direct mobile chat experience

  // Add new states for adjustable chat size, text size, and PRO mode
  const [chatSize, setChatSize] = useState({ width: 380, height: 520 }); // Increased size for better mobile experience
  const [isResizing, setIsResizing] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState(''); // Track current section of the page
  const [currentPage, setCurrentPage] = useState(''); // Track current page for positioning
  const [isFullscreen, setIsFullscreen] = useState(false); // For mobile fullscreen mode
  const [minimizedPosition, setMinimizedPosition] = useState({ right: '24px', bottom: '24px' }); // Track minimized position
  const [isChatbotDisabled, setIsChatbotDisabled] = useState(false); // Track disabled status
  const [isProMode, setIsProMode] = useState(() => {
    // Initialize PRO mode from localStorage if available
    if (typeof window !== 'undefined') {
      return localStorage.getItem(PRO_MODE_KEY) === 'true';
    }
    return false;
  });

  // Add state for PRO mode features popup
  const [showProFeaturesPopup, setShowProFeaturesPopup] = useState(false);
  // Add state for fullscreen suggestion
  const [showFullscreenSuggestion, setShowFullscreenSuggestion] = useState(false);

  // AI Model state (simplified - no popup switching)
  const [currentAIModel, setCurrentAIModel] = useState('deepseek/deepseek-r1-0528:free');
  const [isModelSwitching, setIsModelSwitching] = useState(false);
  // Add state for Pro Mode maintenance popup
  const [showProMaintenancePopup, setShowProMaintenancePopup] = useState(false);
  // Add state for countdown timer
  const [proModeCountdown, setProModeCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  // Add state for Standard Mode request count (for real-time updates)
  const [standardRequestCount, setStandardRequestCount] = useState(0);

  // AI Model Info Panel State
  const [showAIModelInfo, setShowAIModelInfo] = useState(true); // Show by default for visibility

  // Intelligent auto-scroll state - tracks user scroll behavior
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  // Add state for API keys
  const [standardApiKey, setStandardApiKey] = useState('');
  const [proApiKey, setProApiKey] = useState('');

  // Add temperature state and sidebar state with localStorage persistence
  const [temperature, setTemperature] = useState(() => {
    // Load temperature preference from localStorage
    if (typeof window !== 'undefined') {
      const savedTemp = localStorage.getItem('nexious-temperature');
      if (savedTemp) {
        return parseFloat(savedTemp);
      }
    }
    return isProMode ? 0.3 : 0.4;
  });

  const [showSidebar, setShowSidebar] = useState(false); // Always initialize sidebar as closed

  // Add more AI model parameter states
  const [topP, setTopP] = useState(isProMode ? 0.7 : 0.8);
  const [maxTokens, setMaxTokens] = useState(isProMode ? 700 : 1024);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);

  // Standard mode user-customizable settings
  const [standardTemperature, setStandardTemperature] = useState(() => getUserTemperature('standard'));
  const [standardMaxTokens, setStandardMaxTokens] = useState(() => getUserMaxTokens('standard'));

  // NEW: Additional professional sliders for enhanced control
  const [responseSpeed, setResponseSpeed] = useState(1.0); // 0.1 to 2.0 range
  const [focusLevel, setFocusLevel] = useState(0.7); // 0.0 to 1.0 range
  const [creativityBoost, setCreativityBoost] = useState(0.5); // 0.0 to 1.0 range
  const [precisionMode, setPrecisionMode] = useState(0.6); // 0.0 to 1.0 range

  // Add state to track which settings panel is active in the sidebar
  const [activeSidebarPanel, setActiveSidebarPanel] = useState('controls'); // 'controls' or 'model'

  // Add new state for code snippet mode
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');

  // Advanced Fallback System State
  const [fallbackSystemEnabled, setFallbackSystemEnabled] = useState(false);
  const [currentFallbackModel, setCurrentFallbackModel] = useState<FallbackModelConfig | null>(null);
  const [fallbackAttempts, setFallbackAttempts] = useState(0);
  const [fallbackNotificationMessage, setFallbackNotificationMessage] = useState('');
  const [primaryModelTimeout, setPrimaryModelTimeout] = useState(9000);
  const [fallbackModels, setFallbackModels] = useState<FallbackModelConfig[]>([]);

  // Add new state for message count, cooldown, and message emotions
  const [messageCount, setMessageCount] = useState(0);
  const [promoCount, setPromoCount] = useState(0); // Track how many times promo has been shown
  const [onCooldown, setOnCooldown] = useState(false);
  const [messageMood, setMessageMood] = useState('neutral');
  const [isAnimating, setIsAnimating] = useState(false); // New state for message animations

  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      // Check if chat was previously open when the user left
      const chatWasOpen = localStorage.getItem(CHAT_IS_OPEN_KEY) === 'true';

      // Only restore chat history if the chat was open when the user left
      if (chatWasOpen) {
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedMessages) {
          try {
            const parsedMessages = JSON.parse(savedMessages);
            // If we have stored messages, use them
            if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
              return parsedMessages;
            }
          } catch (error) {
            console.error('Error parsing saved chat:', error);
          }
        }
      }
    }

    // Create system prompt with page-specific context
    const contextualSystemPrompt = generateSystemPrompt(
      pageContext.systemPromptAddition,
      isProMode
    );

    // Default initial messages
    return [
      { role: 'system', content: contextualSystemPrompt, timestamp: Date.now() },
      createInitialMessage(isProMode)
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [typingEffect, setTypingEffect] = useState(false);
  const [currentTypingMessage, setCurrentTypingMessage] = useState('');
  const [userIsTyping, setUserIsTyping] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  // New state variables for streaming functionality with performance optimization
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [streamedMessageId, setStreamedMessageId] = useState<string | null>(null);
  const [isThinkingCollapsed, setIsThinkingCollapsed] = useState(false);
  const [thinkingHistory, setThinkingHistory] = useState<string[]>([]);

  // Enhanced thinking state management
  const [isThinkingModelActive, setIsThinkingModelActive] = useState(false);
  const [thinkingStreamText, setThinkingStreamText] = useState('');
  const [isThinkingContainerVisible, setIsThinkingContainerVisible] = useState(false);
  const [thinkingAutoCollapseTimer, setThinkingAutoCollapseTimer] = useState<NodeJS.Timeout | null>(null);
  const [currentUserQuery, setCurrentUserQuery] = useState('');

  // Performance optimization states
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [renderBuffer, setRenderBuffer] = useState<string>('');
  const [lastRenderTime, setLastRenderTime] = useState(0);
  const [frameId, setFrameId] = useState<number | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [performanceStatus, setPerformanceStatus] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const streamingTextRef = useRef<HTMLDivElement>(null);
  const renderBufferRef = useRef<string>('');
  const animationFrameRef = useRef<number | null>(null);

  // Add new state for AbortController
  const [responseController, setResponseController] = useState<AbortController | null>(null);

  // NLP and conversation memory states for human-like responses
  const [userID, setUserID] = useState<string>('');
  const [conversationContext, setConversationContext] = useState<any>(null);
  const [isFirstInteraction, setIsFirstInteraction] = useState(true);
  const [lastUserEmotion, setLastUserEmotion] = useState<string>('neutral');

  // FPS meter state
  const [currentFPS, setCurrentFPS] = useState<number>(60);
  const [isFPSOptimal, setIsFPSOptimal] = useState<boolean>(true);

  // Chat scroll position state
  const [preserveScrollPosition, setPreserveScrollPosition] = useState<boolean>(false);
  const [lastScrollPosition, setLastScrollPosition] = useState<number>(0);

  // Website scroll position preservation
  const [websiteScrollPosition, setWebsiteScrollPosition] = useState<number>(0);

  // Settings refresh state
  const [lastRefreshCheck, setLastRefreshCheck] = useState<number>(0);

  // Standard Mode Cooldown Timer
  const [showCooldownTimer, setShowCooldownTimer] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<{hours: number, minutes: number, seconds: number}>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Effect to ensure Pro Features popup is cleared when Pro Mode is disabled
  useEffect(() => {
    if (!isProMode) {
      setShowProFeaturesPopup(false);
      setShowFullscreenSuggestion(false);
    }
  }, [isProMode]);

  // Effect to check for settings refresh signals
  useEffect(() => {
    const checkForRefreshSignal = async () => {
      try {
        const response = await fetch('/api/chatbot/force-refresh', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer nex-devs919'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasRefreshSignal && data.timestamp > lastRefreshCheck) {
            console.log('Chatbot refresh signal detected, reloading settings...');
            setLastRefreshCheck(data.timestamp);

            // Force enable the chatbot
            setIsChatbotDisabled(false);

            // Clear localStorage cache to force fresh settings check
            localStorage.removeItem('nexious-chatbot-settings');

            // Clear the refresh signal
            try {
              await fetch('/api/chatbot/force-refresh', {
                method: 'DELETE',
                headers: {
                  'Authorization': 'Bearer nex-devs919'
                }
              });
            } catch (error) {
              console.error('Error clearing refresh signal:', error);
            }

            // Force reload the page to apply new settings
            if (typeof window !== 'undefined') {
              setTimeout(() => {
                window.location.reload();
              }, 1000); // Small delay to show the enable status first
            }
          }
        }
      } catch (error) {
        console.error('Error checking for refresh signal:', error);
      }
    };

    // Check for refresh signals every 5 seconds when chatbot is open
    let intervalId: NodeJS.Timeout | null = null;
    if (isOpen) {
      intervalId = setInterval(checkForRefreshSignal, 5000);
      // Also check immediately when opening
      checkForRefreshSignal();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOpen, lastRefreshCheck]);

  // Add a new function to stop the AI response generation
  const stopResponseGeneration = () => {
    if (responseController) {
      console.log('Stopping AI response generation');
      responseController.abort();
      setResponseController(null);

      // End streaming and thinking states immediately
      setIsStreaming(false);
      setIsThinking(false);
      setIsLoading(false);
      setShowTypingIndicator(false);

      // Update FPS meter to show optimal performance
      setCurrentFPS(60);
      setIsFPSOptimal(true);

      // Add a message indicating the response was stopped
      setMessages(prev => {
        // Check if the last message is from the assistant and has little content
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' &&
            (!lastMessage.content || lastMessage.content.length < 20)) {
          // If the message is very short, replace it
          return prev.map((msg, idx) =>
            idx === prev.length - 1 ?
            { ...msg, content: "I stopped my response. Would you like me to try again or answer differently?" } :
            msg
          );
        } else {
          // Otherwise add a new message
          return [...prev, {
        role: 'assistant',
            content: "I stopped my response. Would you like me to try again or answer differently?",
        timestamp: Date.now()
          }];
        }
      });
    } else {
      // Even if no controller, ensure states are reset
      setIsStreaming(false);
      setIsThinking(false);
      setIsLoading(false);
      setShowTypingIndicator(false);
    }

    // Reset streamedMessageId to ensure no message is still in streaming state
    setStreamedMessageId(null);

    // Ensure input is enabled
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Detect current section on scroll
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const detectVisibleSections = () => {
        const sections = document.querySelectorAll('section[id], div[id].section');
        let currentSectionId = '';
        let maxVisibility = 0;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Calculate how much of the section is visible in the viewport
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
          const visiblePercentage = visibleHeight > 0 ? visibleHeight / rect.height : 0;

          if (visiblePercentage > maxVisibility) {
            maxVisibility = visiblePercentage;
            currentSectionId = section.id;
          }
        });

        if (currentSectionId && currentSectionId !== currentSection) {
          setCurrentSection(currentSectionId);
          // Update system message with section context if needed
          updateSystemMessageWithSection(currentSectionId);
        }
      };

      window.addEventListener('scroll', detectVisibleSections);
      detectVisibleSections(); // Run once on mount

      return () => window.removeEventListener('scroll', detectVisibleSections);
    }
  }, [isOpen, pathname, currentSection]);

  // Update system message with current section context
  const updateSystemMessageWithSection = (sectionId: string) => {
    const sectionContext = getSectionContext(sectionId);
    if (!sectionContext) return messages; // Return unchanged messages if no context found

    const updatedSystemPrompt = generateSystemPrompt(
      pageContext.systemPromptAddition + "\n\n" + sectionContext,
      isProMode
    );

    return setMessages(prevMessages => {
      return prevMessages.map(msg => {
        if (msg.role === 'system') {
          return { ...msg, content: updatedSystemPrompt };
        }
        return msg;
      });
    });
  };

  // Function to detect if current model is a thinking model
  const isThinkingModel = (modelName: string): boolean => {
    const thinkingModels = [
      'deepseek/deepseek-r1',
      'deepseek/deepseek-r1-0528',
      'openai/o1-preview',
      'openai/o1-mini',
      'anthropic/claude-3-5-sonnet-thinking'
    ];

    return thinkingModels.some(thinkingModel =>
      modelName.toLowerCase().includes(thinkingModel.toLowerCase())
    );
  };

  // Enhanced function to extract thinking text from response with better separation
  const extractThinkingText = (fullResponse: string): { thinking: string; response: string } => {
    // For DeepSeek R1 models, thinking text is typically enclosed in <think> tags
    const thinkingMatch = fullResponse.match(/<think>([\s\S]*?)<\/think>/);

    if (thinkingMatch) {
      const thinking = thinkingMatch[1].trim();
      const response = fullResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      return { thinking, response };
    }

    // Enhanced patterns for better thinking text detection
    const patterns = [
      // Common thinking model patterns
      /^(.*?)\n\n---+\n\n([\s\S]*)$/,  // Thinking separated by --- (multiple dashes)
      /^Thinking:([\s\S]*?)\n\nResponse:([\s\S]*)$/i,  // Explicit thinking/response labels
      /^\*\*Thinking\*\*:([\s\S]*?)\n\n([\s\S]*)$/i,  // Bold thinking label
      /^# Thinking([\s\S]*?)\n\n# Response([\s\S]*)$/i,  // Markdown headers
      /^<thinking>([\s\S]*?)<\/thinking>([\s\S]*)$/i,  // XML-style thinking tags
      /^Reasoning:([\s\S]*?)\n\nAnswer:([\s\S]*)$/i,  // Reasoning/Answer format
      /^Internal thoughts:([\s\S]*?)\n\nFinal response:([\s\S]*)$/i,  // Internal thoughts format
    ];

    for (const pattern of patterns) {
      const match = fullResponse.match(pattern);
      if (match) {
        const thinking = match[1].trim();
        const response = match[2].trim();
        // Ensure we don't return empty responses
        if (response.length > 0) {
          return { thinking, response };
        }
      }
    }

    // Advanced heuristic: If response starts with thinking-like content, try to separate
    const lines = fullResponse.split('\n');
    let thinkingEndIndex = -1;

    // Look for transition indicators
    const transitionIndicators = [
      'Based on this analysis',
      'Given this information',
      'Therefore',
      'In conclusion',
      'To answer your question',
      'Here\'s my response',
      'My answer is',
      'The solution is'
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (transitionIndicators.some(indicator => line.includes(indicator.toLowerCase()))) {
        thinkingEndIndex = i;
        break;
      }
    }

    if (thinkingEndIndex > 0) {
      const thinking = lines.slice(0, thinkingEndIndex).join('\n').trim();
      const response = lines.slice(thinkingEndIndex).join('\n').trim();
      if (thinking.length > 50 && response.length > 10) { // Reasonable length checks
        return { thinking, response };
      }
    }

    // If no thinking pattern found, return empty thinking and full response
    return { thinking: '', response: fullResponse };
  };

  // Enhanced thinking simulation with streaming text
  const simulateThinking = async () => {
    const currentModel = getModelSettings(isProMode).model;
    const isThinkingModelActive = isThinkingModel(currentModel);

    setIsThinking(true);
    setThinkingStreamText('');

    // Show thinking container for all models now
    setIsThinkingContainerVisible(true);
    setIsThinkingCollapsed(false);

    // Generate a random ID for this streamed message
    const messageId = `thinking-${Date.now()}`;
    setStreamedMessageId(messageId);

    // Add an empty assistant message that will be updated with the streaming content
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      id: messageId
    }]);

    // Clear any existing auto-collapse timer
    if (thinkingAutoCollapseTimer) {
      clearTimeout(thinkingAutoCollapseTimer);
      setThinkingAutoCollapseTimer(null);
    }

    return messageId;
  };

  // Add formatMessage function if it doesn't exist
  const formatMessage = (text: string): string => {
    // Basic formatting for messages
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>');
  };

  const processStreamedText = (text: string): string => {
    // First apply the regular message formatting
    let formattedText = formatMessage(text);

    // Handle markdown code blocks properly even if incomplete
    const codeBlockRegex = /```([a-zA-Z0-9]*)([\s\S]*?)```/g;
    const openCodeBlockRegex = /```([a-zA-Z0-9]*)([\s\S]*?)$/;

    // If there's an open code block (starts with ``` but doesn't end with ```)
    if (openCodeBlockRegex.test(formattedText) && !formattedText.trim().endsWith('```')) {
      // Temporarily close it for proper syntax highlighting
      const language = formattedText.match(openCodeBlockRegex)?.[1] || '';
      const code = formattedText.match(openCodeBlockRegex)?.[2] || '';

      // Replace the open code block with a properly formatted one
      formattedText = formattedText.replace(openCodeBlockRegex, '```$1$2```');
    }

    // Add subtle highlights to important phrases
    formattedText = formattedText.replace(
      /(important|note|key|remember|tip):/gi,
      '<span class="highlight">$1:</span>'
    );

    // Add animation delays to list items
    let liIndex = 0;
    formattedText = formattedText.replace(
      /<li>/g,
      () => `<li style="--li-index: ${liIndex++}">`
    );

    // Add smooth reveal animation to paragraphs that aren't in code blocks
    formattedText = formattedText.replace(
      /(<p>(?!<code>).*?<\/p>)/g,
      (match: string) => `<div class="reveal-text">${match}</div>`
    );

    return formattedText;
  };

  // Get context for specific sections
  const getSectionContext = (sectionId: string) => {
    const sections: Record<string, {name: string, guidance: string}> = {
      'hero': {
        name: 'Welcome/Hero',
        guidance: 'Offer assistance with finding services or learning more about the team. Suggest exploring the portfolio or checking out pricing options.'
      },
      'services': {
        name: 'Services',
        guidance: 'Provide detailed information about the specific services we offer. Explain our expertise in web development, UI/UX design, and custom solutions.'
      },
      'pricing': {
        name: 'Pricing',
        guidance: 'Explain our pricing structure, package details, and payment options including installment plans for projects over $500.'
      },
      'portfolio': {
        name: 'Portfolio',
        guidance: 'Highlight our past successful projects and explain technologies used in different case studies.'
      },
      'testimonials': {
        name: 'Testimonials',
        guidance: 'Emphasize client satisfaction and reference specific feedback about our quality, reliability, and results.'
      },
      'team': {
        name: 'Team',
        guidance: 'Share information about our team members, their expertise, and how we collaborate on projects.'
      },
      'contact': {
        name: 'Contact',
        guidance: 'Help with contact form questions or explain how our consultation process works. Mention response times and next steps.'
      },
      'faq': {
        name: 'FAQ',
        guidance: 'Reference relevant FAQs and provide additional clarity on policies, processes, and services.'
      }
    };

    return sections[sectionId];
  };

  // Toggle fullscreen mode for mobile
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Initialize NLP and conversation memory system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Generate or retrieve user ID
      const id = generateUserID();
      setUserID(id);

      // Generate initial conversation context
      const context = generateConversationContext(id, '');
      setConversationContext(context);

      // Set first interaction flag
      setIsFirstInteraction(context.conversationFlow === 'initial');
    }
  }, []);

  // Initialize fallback system configuration
  useEffect(() => {
    try {
      const fallbackConfig = getFallbackSystemConfig();
      setFallbackSystemEnabled(fallbackConfig.enabled);
      setPrimaryModelTimeout(fallbackConfig.primaryTimeout);
      setFallbackModels(getFallbackModelsByPriority());

      const notificationSettings = getFallbackNotificationSettings();
      setFallbackNotificationMessage(notificationSettings.message);

      console.log(`🔧 NEXIOUS FALLBACK: System initialized - Enabled: ${fallbackConfig.enabled}`);
      console.log(`⏱️ NEXIOUS FALLBACK: Primary timeout: ${fallbackConfig.primaryTimeout}ms`);
      console.log(`📋 NEXIOUS FALLBACK: ${fallbackModels.length} fallback models configured`);
    } catch (error) {
      console.error('Error initializing fallback system:', error);
    }
  }, []);

  // Enhanced mobile detection with keyboard handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);

        // Reset fullscreen mode if device is no longer mobile
        if (window.innerWidth >= 768 && isFullscreen) {
          setIsFullscreen(false);
        }
      };

      // Enhanced mobile keyboard handling with better detection
      const handleViewportChange = () => {
        if (isMobile && isOpen) {
          const viewportHeight = window.visualViewport?.height || window.innerHeight;
          const windowHeight = window.innerHeight;
          const keyboardHeight = windowHeight - viewportHeight;

          // Adjust chat container when keyboard appears
          const chatWindow = document.getElementById('chat-window');
          if (chatWindow) {
            if (keyboardHeight > 150) { // Keyboard is open (threshold increased for better detection)
              chatWindow.style.height = `${viewportHeight}px`;
              chatWindow.style.paddingBottom = '0px';
              chatWindow.classList.add('keyboard-open');

              // Ensure header remains visible
              const header = chatWindow.querySelector('.flex.items-center.justify-between');
              if (header) {
                (header as HTMLElement).style.position = 'sticky';
                (header as HTMLElement).style.top = '0';
                (header as HTMLElement).style.zIndex = '1000';
              }

              // Adjust input area to be visible above keyboard
              const inputArea = chatWindow.querySelector('.flex.items-end.gap-2');
              if (inputArea) {
                (inputArea as HTMLElement).style.paddingBottom = '10px';
                (inputArea as HTMLElement).style.position = 'sticky';
                (inputArea as HTMLElement).style.bottom = '0';
                (inputArea as HTMLElement).style.zIndex = '999';
              }
            } else { // Keyboard is closed
              chatWindow.style.height = '100vh';
              chatWindow.style.paddingBottom = '0px';
              chatWindow.classList.remove('keyboard-open');

              // Reset header positioning
              const header = chatWindow.querySelector('.flex.items-center.justify-between');
              if (header) {
                (header as HTMLElement).style.position = '';
                (header as HTMLElement).style.top = '';
                (header as HTMLElement).style.zIndex = '';
              }

              // Reset input area positioning
              const inputArea = chatWindow.querySelector('.flex.items-end.gap-2');
              if (inputArea) {
                (inputArea as HTMLElement).style.paddingBottom = '';
                (inputArea as HTMLElement).style.position = '';
                (inputArea as HTMLElement).style.bottom = '';
                (inputArea as HTMLElement).style.zIndex = '';
              }
            }
          }
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      // Add viewport change listener for keyboard handling
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
      }

      return () => {
        window.removeEventListener('resize', checkMobile);
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleViewportChange);
        }
      };
    }
  }, [isFullscreen, isMobile, isOpen]);

  // Handle chat resizing
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && chatWindowRef.current) {
      // Set minimum and maximum sizes
      const newWidth = Math.max(320, Math.min(600, e.clientX - chatWindowRef.current.getBoundingClientRect().left));
      const newHeight = Math.max(400, Math.min(800, e.clientY - chatWindowRef.current.getBoundingClientRect().top));

      setChatSize({ width: newWidth, height: newHeight });
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Don't update chat open state in localStorage to prevent auto-opening on reload
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Don't store open state to prevent auto-opening on reload

      // If chat is closed, remove chat history
      if (!isOpen) {
        // We don't immediately clear messages from state to allow for a smooth UX if reopened
        // But when the page refreshes, history will be cleared if chat was closed
      }
    }
  }, [isOpen]);

  // Set new messages indicator when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > 2) {
      // Check if there are any assistant messages in the last 2 minutes
      const recentMessages = messages.filter(
        msg => msg.role === 'assistant' &&
        msg.timestamp &&
        (Date.now() - msg.timestamp < 2 * 60 * 1000)
      );

      if (recentMessages.length > 0) {
        setHasNewMessages(true);
      }
    }
  }, [isOpen, messages]);

  // Strict scroll to bottom function - only when user hasn't scrolled up
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && isOpen && !isUserScrolledUp && !isStreaming) {
      // Use requestAnimationFrame for smooth scrolling
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end'
          });
        }
      });
    }
  }, [isOpen, isUserScrolledUp, isStreaming]);

  // Optimized smooth scroll handler with debouncing
  const handleSmoothScroll = useCallback((element: HTMLElement, targetScrollTop: number) => {
    const startScrollTop = element.scrollTop;
    const distance = targetScrollTop - startScrollTop;
    const duration = 300; // ms
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const easedProgress = easeInOutCubic(progress);

      element.scrollTop = startScrollTop + distance * easedProgress;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  }, []);

  // Enhanced scroll handler with strict user control detection
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    performanceMonitor.markScrollStart();
    setIsScrolling(true);

    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    // Check if user is at the very bottom (within 10px for strict detection)
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

    // Detect any manual scroll up from the user - be very sensitive
    const scrolledUp = scrollTop < lastScrollTop;

    // If user scrolls up even slightly, respect their intention
    if (scrolledUp) {
      setIsUserScrolledUp(true);
    } else if (isAtBottom) {
      // Only reset when user is back at the bottom
      setIsUserScrolledUp(false);
    }

    setLastScrollTop(scrollTop);

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    const timeout = setTimeout(() => {
      setIsScrolling(false);
      performanceMonitor.markScrollEnd();
    }, 150);

    setScrollTimeout(timeout);
  }, [scrollTimeout, lastScrollTop]);

  // Smooth streaming text renderer without blinking animations
  const renderStreamingText = useCallback((text: string, targetElement: HTMLElement | null) => {
    if (!targetElement || !text) return;

    performanceMonitor.markRenderStart();

    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime;

    // Throttle rendering to 60fps for smooth performance without blinking
    if (timeSinceLastRender < 16.67) { // ~60fps
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      const newFrameId = requestAnimationFrame(() => {
        renderStreamingText(text, targetElement);
      });
      setFrameId(newFrameId);
      return;
    }

    // Update render buffer and display with optimized DOM manipulation
    renderBufferRef.current = text;

    // Use innerHTML for rich formatting with smooth updates (no blinking)
    const processedText = processStreamedText(cleanText(text));
    if (targetElement.innerHTML !== processedText) {
      // Direct update without transition effects to prevent blinking
      targetElement.innerHTML = processedText;
    }

    setLastRenderTime(currentTime);
    performanceMonitor.markRenderEnd();

    // Smooth scroll to bottom - only when not streaming to prevent jitter
    if (!isScrolling && messagesEndRef.current && !isUserScrolledUp && !isStreaming) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        });
      });
    }
  }, [lastRenderTime, frameId, isScrolling]);

  // Optimized text buffer for smooth streaming
  const updateStreamingBuffer = useCallback((newText: string) => {
    setRenderBuffer(prev => {
      const updated = prev + newText;

      // Use requestAnimationFrame for smooth text updates
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        if (streamingTextRef.current) {
          renderStreamingText(updated, streamingTextRef.current);
        }
      });

      return updated;
    });
  }, [renderStreamingText]);

  // Virtual scrolling for large chat histories
  const VISIBLE_MESSAGE_COUNT = 50; // Show only 50 messages at a time for performance
  const visibleMessages = useMemo(() => {
    const filteredMessages = messages.filter(message => message.role !== 'system');

    // For large chat histories, show only recent messages
    if (filteredMessages.length > VISIBLE_MESSAGE_COUNT) {
      return filteredMessages.slice(-VISIBLE_MESSAGE_COUNT);
    }

    return filteredMessages;
  }, [messages]);

  // Performance-optimized message rendering with memoization
  const renderMessage = useCallback((message: Message, index: number) => {
    const isThinkingMessage = isThinking && message.id === streamedMessageId;
    const isStreamingMessage = isStreaming && message.id === streamedMessageId;

    // Use stable key for React optimization
    const messageKey = `${message.id || index}-${message.content.length}-${isThinkingMessage}-${isStreamingMessage}`;

    return messageKey; // Return key for external rendering
  }, [isThinking, isStreaming, streamedMessageId]);

  // Optimized message list rendering
  const messageElements = useMemo(() => {
    return visibleMessages.map((message, index) => {
      const key = renderMessage(message, index);
      return { message, index, key };
    });
  }, [visibleMessages, renderMessage]);

  // Optimized scroll to bottom of chat when messages change - enhanced with user scroll detection
  useEffect(() => {
    if (messagesContainerRef.current && preserveScrollPosition) {
      // Save current scroll position before navigating between chats
      setLastScrollPosition(messagesContainerRef.current.scrollTop);
    } else if (!isScrolling && !preserveScrollPosition && !isUserScrolledUp) {
      // Only auto-scroll if user hasn't manually scrolled up
      scrollToBottom();
    } else if (messagesContainerRef.current && preserveScrollPosition && lastScrollPosition > 0) {
      // Restore previous scroll position when switching between chats
      messagesContainerRef.current.scrollTop = lastScrollPosition;
    }
  }, [messages, typingEffect, currentTypingMessage, isOpen, scrollToBottom, isScrolling, preserveScrollPosition, lastScrollPosition, isUserScrolledUp]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // Initialize performance monitoring when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      performanceMonitor.startMonitoring((metrics) => {
        setPerformanceMetrics(metrics);
        setPerformanceStatus(performanceMonitor.getPerformanceStatus());

        // Auto-optimize performance if needed
        if (metrics.fps < 45 || metrics.scrollPerformance < 70) {
          performanceMonitor.optimizePerformance();
        }
      });
    } else {
      performanceMonitor.stopMonitoring();
    }

    return () => {
      performanceMonitor.stopMonitoring();
    };
  }, [isOpen, isMinimized]);

  // Cleanup animation frames on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      performanceMonitor.stopMonitoring();
    };
  }, [frameId, scrollTimeout]);

  // Typing effect for the first assistant message on chat open
  useEffect(() => {
    if (isOpen && !typingEffect) {
      const assistantMessage = createInitialMessage(isProMode).content;
      setCurrentTypingMessage('');
      setTypingEffect(true);

      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < assistantMessage.length) {
          setCurrentTypingMessage(prev => prev + assistantMessage[i]);
          i++;
        } else {
          clearInterval(typeInterval);
          setTypingEffect(false);
        }
      }, 5); // Ultra-fast typing with no delay for smooth experience

      return () => clearInterval(typeInterval);
    }
  }, [isOpen, isProMode]);

  // Update system message when page changes or PRO mode changes
  useEffect(() => {
    // Create a new system message with the updated context
    const updatedSystemPrompt = generateSystemPrompt(
      pageContext.systemPromptAddition,
      isProMode
    );

    // Update the system message in the messages array
    setMessages(prev => {
      // Find the system message index
      const systemMessageIndex = prev.findIndex(msg => msg.role === 'system');

      // If no system message exists, add one
      if (systemMessageIndex === -1) {
        return [
          { role: 'system', content: updatedSystemPrompt, timestamp: Date.now() },
          ...prev
        ];
      }

      // Create a new array with the updated system message
      const newMessages = [...prev];
      newMessages[systemMessageIndex] = {
        role: 'system',
        content: updatedSystemPrompt,
        timestamp: Date.now()
      };

      return newMessages;
    });
  }, [pathname, isProMode, pageContext]); // Re-run when pathname, PRO mode, or pageContext changes

  // Add minimal professional touches to responses
  const addEmotionalCues = (content: string): string => {
    // Don't modify content in PRO mode - keep it professional and technical
    if (isProMode) {
      return content;
    }

    // For standard mode, keep responses professional with minimal modifications
    // Only add very subtle professional touches without changing the core content
    let mood = 'neutral';
    const lowerContent = content.toLowerCase();

    // Technical-focused moods
    if (lowerContent.includes('issue') || lowerContent.includes('problem') || lowerContent.includes('error')) {
      mood = 'technical';
    } else if (lowerContent.includes('service') || lowerContent.includes('feature') || lowerContent.includes('option')) {
      mood = 'informative';
    } else if (lowerContent.includes('help') || lowerContent.includes('assist') || lowerContent.includes('support')) {
      mood = 'helpful';
    } else if (lowerContent.includes('price') || lowerContent.includes('cost') || lowerContent.includes('payment')) {
      mood = 'precise';
    } else if (lowerContent.includes('improve') || lowerContent.includes('upgrade') || lowerContent.includes('enhance')) {
      mood = 'solution';
    }

    // Store mood for potential animation
    setMessageMood(mood);

    // Keep responses professional with minimal modifications
    let modifiedContent = content;

    // Only add very subtle professional touches without changing the core content
    // Remove most of the intrusive modifications to maintain response quality

    // Minimal professional processing - keep the original content intact
    // Only make very subtle adjustments if absolutely necessary

    return modifiedContent;
  };

  // Modify the handleSendMessage function to use the new AI settings
  const handleSendMessage = async () => {
    if (isCodeMode) {
      // Handle code snippet submission
      if (!codeSnippet.trim()) return;

      // Format the code for sending
      const formattedCode = "```" + codeLanguage + "\n" + codeSnippet + "\n```";
      const messagePrefix = "Here's my code snippet. Can you help me with this?";
      const fullMessage = messagePrefix + "\n\n" + formattedCode;

      // Set the message in the input value temporarily
      setInputValue(fullMessage);

      // Reset code mode and snippet
      setIsCodeMode(false);
      setCodeSnippet('');

      // Use setTimeout to ensure state is updated before sending
      setTimeout(() => {
        handleNormalSendMessage();
      }, 0);
    } else {
      // Normal message handling
      handleNormalSendMessage();
    }
  };

  // Original send message logic moved to a separate function
  const handleNormalSendMessage = async () => {
    // Only block if input is empty - allow multiple messages even during processing
    if (!inputValue.trim()) return;

    // Enhanced logging for debugging response generation
    console.log(`🚀 NEXIOUS: Starting message processing for: "${inputValue.trim()}"`);
    console.log(`🔍 NEXIOUS: Current states - isLoading: ${isLoading}, isStreaming: ${isStreaming}, isThinking: ${isThinking}`);

    // Check Standard Mode request limits (only for standard mode)
    if (!isProMode) {
      if (isStandardModeOnCooldown()) {
        const cooldownRemaining = getStandardModeCooldownRemaining();
        const cooldownMessage = `You've reached the 15-message limit for Standard Mode. Please wait ${cooldownRemaining.hours}h ${cooldownRemaining.minutes}m before sending more messages, or contact us for unlimited access.`;

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: cooldownMessage,
          timestamp: Date.now()
        }]);
        return;
      }

      const currentCount = getStandardModeRequestCount();
      const limit = getStandardModeConfig().requestLimit;

      if (currentCount >= limit) {
        const limitMessage = `You've reached the ${limit}-message limit for Standard Mode today. The chat will be locked for 2 hours. For unlimited access, please contact us at contact@nex-devs.com.`;

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: limitMessage,
          timestamp: Date.now()
        }]);
        return;
      }
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setUserIsTyping(false);

    // Store current user query for thinking container
    setCurrentUserQuery(userMessage);

    // Enhanced logging for debugging
    console.log(`📝 NEXIOUS: Processing user message: "${userMessage}"`);
    console.log(`⚙️ NEXIOUS: Mode: ${isProMode ? 'PRO' : 'STANDARD'}`);

    // NLP Processing: Analyze user input for human-like response generation
    const nlpContext = generateNLPContext(userMessage);
    const currentConversationContext = generateConversationContext(userID, userMessage);

    // Update conversation context and user emotion
    setConversationContext(currentConversationContext);
    setLastUserEmotion(nlpContext.userEmotion);
    setIsFirstInteraction(false);

    // Enhanced check if the user is explicitly asking for code
    const isExplicitlyAskingForCode = /(\bshow me (the|some|a) code\b|\bgive me (the|some|a) code\b|\bcode example\b|\bhow to implement\b|\bhow to code\b|\bwrite (the|a|some) code\b|\bshare (the|some|a) code\b|\bprovide (the|some|a) code\b)/i.test(userMessage);

    // Set animation state to true
    setIsAnimating(true);

    // Add user message to chat with timestamp and immediately start processing
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    }]);

    console.log(`✅ NEXIOUS: User message added to chat`);

    // Immediate state updates for zero-delay response initiation
    setIsLoading(true);
    setShowTypingIndicator(true); // Show typing indicator immediately
    setIsThinking(true);
    setThinkingText('thinking');
    setIsThinkingCollapsed(false); // Show thinking container
    setThinkingHistory([]); // Clear previous thinking history

    console.log(`🔄 NEXIOUS: States updated - Starting AI response generation`);

    // Reset animation state after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 200); // Faster animation

    const startTime = Date.now();

    try {
      // Start the thinking animation and get the message ID with minimal delay
      const messageId = await simulateThinking();
      setStreamedMessageId(messageId);

    // Enhanced retry mechanism with immediate response guarantee
      const MAX_RETRIES = 3;
      const BACKUP_RETRIES = 2;
    let attempts = 0;
    let backupAttempts = 0;

    while (attempts < MAX_RETRIES) {
      attempts++;
        console.log(`🔄 NEXIOUS: Primary attempt ${attempts}/${MAX_RETRIES} to send message`);

        try {
        // Create system prompt with the current page context, PRO mode status, and pathway
        let contextualSystemPrompt = generateSystemPrompt(
          pageContext.systemPromptAddition,
          isProMode,
          isExplicitlyAskingForCode
        );

        console.log(`📋 NEXIOUS: System prompt generated for ${isProMode ? 'PRO' : 'STANDARD'} mode`);

        // Apply NLP humanization to the system prompt for more natural responses
        if (!isProMode && userID && conversationContext) {
          const humanizedPrompt = humanizeResponse(userMessage, contextualSystemPrompt);
          contextualSystemPrompt = humanizedPrompt.processedPrompt;
          console.log(`🧠 NEXIOUS: Applied NLP humanization to system prompt`);
        }

          // Use the prepareAPIRequest function to get request details
          const mode = isProMode ? 'pro' : 'standard';
          console.log(`🌐 NEXIOUS: Preparing API request for ${mode} mode`);

          const request = await prepareAPIRequest(
            mode,
            messages,
            contextualSystemPrompt,
            userMessage,
            messageId,
            {
              temperature,
              topP,
              maxTokens,
              presencePenalty,
              frequencyPenalty
            }
          );

          console.log(`✅ NEXIOUS: API request prepared - URL: ${request.url}`);
          console.log(`📊 NEXIOUS: Request body contains ${JSON.stringify(request.body).length} characters`);

          // Create AbortController for timeout handling
          const controller = new AbortController();
        setResponseController(controller);

          const settings = getModelSettings(isProMode);

          // Use advanced fallback system timeout if enabled
          const timeoutDuration = fallbackSystemEnabled ? primaryModelTimeout : settings.timeout + 2000;

          const timeoutId = setTimeout(() => {
            controller.abort();
            console.log(`⏰ NEXIOUS: Primary model timeout reached (${timeoutDuration}ms)`);
          }, timeoutDuration);

          // Ensure the thinking state is fully completed before starting streaming
          await new Promise(resolve => setTimeout(resolve, isProMode ? 50 : 20));

          // Start streaming mode
          setIsStreaming(true);
          setStreamedResponse('');

          console.log(`🚀 NEXIOUS: Sending primary API request to ${request.url}`);
          console.log(`📡 NEXIOUS: Request method: POST, Headers: ${Object.keys(request.headers).join(', ')}`);
          console.log(`⏱️ NEXIOUS: Primary timeout: ${timeoutDuration}ms, Fallback enabled: ${fallbackSystemEnabled}`);

          let primaryResponse: Response | null = null;
          let primaryError: Error | null = null;

          try {
            primaryResponse = await fetch(request.url, {
              method: 'POST',
              headers: request.headers,
              body: JSON.stringify(request.body),
              signal: controller.signal
            });
          } catch (error) {
            primaryError = error as Error;
            console.error(`❌ NEXIOUS: Primary model request failed:`, error);
          }

          // Clear the primary timeout
          clearTimeout(timeoutId);

          let response = primaryResponse;

          // Advanced Fallback System Logic
          if ((!response || !response.ok || primaryError) && fallbackSystemEnabled && fallbackModels.length > 0) {
            console.log(`🔄 NEXIOUS FALLBACK: Primary model failed, attempting fallback models`);

            // Show model switching in header via ModelStatusIndicator
            setIsModelSwitching(true);

            // Try each fallback model in priority order
            for (let i = 0; i < fallbackModels.length && i < 3; i++) {
              const fallbackModel = fallbackModels[i];
              setCurrentFallbackModel(fallbackModel);
              setFallbackAttempts(i + 1);

              // Update current model to show in header
              setCurrentAIModel(fallbackModel.model);

              console.log(`🔄 NEXIOUS FALLBACK: Attempting fallback ${i + 1}/${fallbackModels.length} - ${fallbackModel.model}`);

              try {
                // Create new controller for fallback request
                const fallbackController = new AbortController();
                setResponseController(fallbackController);

                // Prepare fallback request
                const fallbackRequest = await prepareFallbackAPIRequest(
                  mode,
                  messages,
                  contextualSystemPrompt,
                  userMessage,
                  fallbackModel,
                  messageId
                );

                // Set fallback timeout
                const fallbackTimeoutId = setTimeout(() => {
                  fallbackController.abort();
                  console.log(`⏰ NEXIOUS FALLBACK: Timeout reached for ${fallbackModel.model}`);
                }, fallbackModel.timeout);

                // Add delay between fallback attempts
                if (i > 0) {
                  await new Promise(resolve => setTimeout(resolve, getFallbackSystemConfig().fallbackDelay));
                }

                // Attempt fallback request
                const fallbackResponse = await fetch(fallbackRequest.url, {
                  method: 'POST',
                  headers: fallbackRequest.headers,
                  body: JSON.stringify(fallbackRequest.body),
                  signal: fallbackController.signal
                });

                clearTimeout(fallbackTimeoutId);

                if (fallbackResponse.ok) {
                  console.log(`✅ NEXIOUS FALLBACK: Success with ${fallbackModel.model}`);
                  response = fallbackResponse;
                  break; // Exit fallback loop on success
                } else {
                  console.warn(`⚠️ NEXIOUS FALLBACK: ${fallbackModel.model} returned status ${fallbackResponse.status}`);
                }
              } catch (fallbackError) {
                console.error(`❌ NEXIOUS FALLBACK: ${fallbackModel.model} failed:`, fallbackError);
                continue; // Try next fallback model
              }
            }

            // Reset fallback states
            setCurrentFallbackModel(null);
            setFallbackAttempts(0);
            setIsModelSwitching(false);
          }

          // Final check - if still no valid response, throw error
          if (!response) {
            throw new Error('All AI models failed to respond. Please try again.');
          }

          console.log(`📥 NEXIOUS: Final response - Status: ${response.status} ${response.statusText}`);

          if (!response.ok) {
            // Handle error responses
            console.error(`❌ NEXIOUS: Final API request failed with status ${response.status}`);
            const errorData = await response.json();
            console.error(`❌ NEXIOUS: Error details:`, errorData);
            throw new Error(errorData.error?.message || `API returned status ${response.status}`);
          }

          // Handle streaming response
          const reader = response.body?.getReader();
          if (!reader) {
            console.error(`❌ NEXIOUS: Response body reader not available`);
            throw new Error('Response body reader not available');
          }

          console.log(`📖 NEXIOUS: Starting to read streaming response`);
          let accumulatedResponse = '';
          let chunkCount = 0;

          // Start thinking animation during streaming
          const thinkingPhrases = [
            'Processing your request',
            'Analyzing context',
            'Generating response',
            'Optimizing output',
            'Refining content',
            'Structuring information',
            'Applying knowledge',
            'Crafting response'
          ];
          let thinkingIndex = 0;
          const thinkingInterval = setInterval(() => {
            if (isThinking) {
              setThinkingText(thinkingPhrases[thinkingIndex % thinkingPhrases.length]);
              thinkingIndex++;
            }
          }, 800); // Update thinking text every 800ms

          // Process the stream
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log(`✅ NEXIOUS: Streaming complete - Total chunks: ${chunkCount}, Final response length: ${accumulatedResponse.length}`);
              break;
            }
            chunkCount++;

            // Convert the chunk to text
            const chunk = new TextDecoder().decode(value);

            // OpenRouter/API sends data: prefix for each chunk
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(5).trim();

                // Check for the [DONE] marker
                if (data === '[DONE]') {
                  continue;
                }

                try {
                  const parsedData = JSON.parse(data);
                  const content = parsedData.choices?.[0]?.delta?.content || '';

                  if (content) {
                    // Accumulate the response
                    accumulatedResponse += content;

                    // Hide typing indicator once content starts arriving
                    if (showTypingIndicator && accumulatedResponse.trim()) {
                      setShowTypingIndicator(false);
                    }

                    // Check if this is a thinking model and extract thinking text
                    const currentModel = getModelSettings(isProMode).model;
                    if (isThinkingModel(currentModel)) {
                      const { thinking, response } = extractThinkingText(accumulatedResponse);

                      // Update thinking text if available (keep it separate)
                      if (thinking && thinking !== thinkingStreamText) {
                        setThinkingStreamText(thinking);
                      }

                      // Format the main response (without thinking text) - only show actual response
                      const formattedResponse = processStreamedText(response);
                      setStreamedResponse(formattedResponse);

                      // Update the message with ONLY the main response (no thinking text)
                      setMessages(prev => prev.map(msg =>
                        msg.id === messageId ? { ...msg, content: formattedResponse } : msg
                      ));
                    } else {
                      // For non-thinking models, process normally
                      const formattedResponse = processStreamedText(accumulatedResponse);
                      setStreamedResponse(formattedResponse);

                      setMessages(prev => prev.map(msg =>
                        msg.id === messageId ? { ...msg, content: formattedResponse } : msg
                      ));
                    }

                    // Completely disable auto-scroll during streaming for smooth experience
                    // Auto-scroll will be handled after response completion
                  }
                } catch (e) {
                  console.error('Error parsing streaming data:', e);
                }
              }
            }
          }

          // Clear the controller from state since the request is complete
          setResponseController(null);
          clearTimeout(timeoutId); // Clear timeout

          // End streaming mode with slight delay to ensure a smooth transition
          setTimeout(() => {
            setIsStreaming(false);
            setIsThinking(false);

            // Auto-collapse thinking container for thinking models
            const currentModel = getModelSettings(isProMode).model;
            if (isThinkingModel(currentModel) && isThinkingContainerVisible) {
              const timer = setTimeout(() => {
                setIsThinkingContainerVisible(false);
                setIsThinkingCollapsed(true);
              }, 3000); // Auto-collapse after 3 seconds

              setThinkingAutoCollapseTimer(timer);
            }

            // Update FPS meter to show optimal status when response is complete
            setCurrentFPS(60);
            setIsFPSOptimal(true);
          }, 100);

          // Validate and process the final response with enhanced formatting
          let processedResponse = '';

          if (accumulatedResponse && validateResponse(accumulatedResponse, userMessage)) {
            processedResponse = isProMode ? formatMessage(accumulatedResponse) : addEmotionalCues(formatMessage(accumulatedResponse));
          } else {
            console.warn('Response validation failed, attempting backup...');
            // Try backup response if validation fails
            const backupResult = await attemptBackupResponse(userMessage);
            if (backupResult.success && backupResult.response) {
              processedResponse = isProMode ? formatMessage(backupResult.response) : addEmotionalCues(formatMessage(backupResult.response));
            } else {
              // Final failsafe
              processedResponse = generateFailsafeResponse(userMessage, isProMode);
            }
          }

          // Apply NLP human touches for more natural responses (Standard Mode only)
          if (!isProMode && userID && conversationContext && nlpContext) {
            processedResponse = addHumanTouches(processedResponse, nlpContext);

            // Update conversation memory with this interaction
            updateUserProfile(userID, userMessage, processedResponse, nlpContext.userEmotion, nlpContext.userIntent);
          }

          // Update the final message
          setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, content: processedResponse } : msg
          ));

        // Update request count for Standard Mode
        if (!isProMode) {
          const newCount = getStandardModeRequestCount();
          setStandardRequestCount(newCount);
        }

        // Log successful request
        await logChatRequest(userMessage, processedResponse, Date.now() - startTime, 'success');

        // Successfully got response, exit retry loop
        break;

        } catch (error: any) { // Add type annotation
        // Clear the controller from state
        setResponseController(null);

        // Check if this was an abort error (user clicked stop)
        if (error.name === 'AbortError') {
          console.log('Request was aborted by user');
          break; // Exit the retry loop
        }

        console.error(`Chat error (attempt ${attempts}/${MAX_RETRIES}):`, error);

        // Get the error message but intercept specific messages
          let errorMsg = error.toString();

        // Replace specific rate limit error messages with professional alternatives
        if (errorMsg.includes('Rate limit exceeded: free-models-per-day') ||
            errorMsg.includes('Add 10 credits to unlock 1000 free model')) {
          errorMsg = 'AI service currently experiencing high demand';
          console.log('Replaced rate limit error with professional message');
        }

        if (attempts >= MAX_RETRIES) {
            // End streaming mode
            setIsStreaming(false);

          // Create a professional error message that doesn't explicitly mention rate limits
          let professionalErrorMessage = "";

          if (errorMsg.includes("rate limit") || errorMsg.includes("quota exceeded") ||
              errorMsg.includes("high demand") || errorMsg.includes("free-models-per-day")) {
            // For rate limit errors, provide a professional alternative message
            professionalErrorMessage =
              "I apologize, but our AI service is currently experiencing high demand. " +
              "Our systems are optimizing resources to ensure quality service for all users. " +
              "Please try again in a few moments while we enhance processing capacity.";
          } else if (errorMsg.includes("402") || errorMsg.includes("billing")) {
            // For billing errors
            professionalErrorMessage =
              "I apologize, but we're currently performing scheduled maintenance on our AI systems. " +
              "Our team is working to complete this process as quickly as possible. " +
              "Please try again shortly.";
          } else {
            // For other errors
            professionalErrorMessage =
              "I apologize, but I encountered a technical limitation. " +
              "Our systems are working to resolve this. " +
              "Please try again in a moment.";
          }

            // Update the message with the error
            setMessages(prev => prev.map(msg =>
              msg.id === messageId ? { ...msg, content: professionalErrorMessage } : msg
            ));

          // Log error request with original error for debugging
            await logChatRequest(userMessage, `Error: ${errorMsg}`, Date.now() - startTime, 'error');

        } else {
          console.log(`Retrying after error: ${errorMsg}`);
          // Add shorter backoff delay
          const delayTime = Math.min(300 * attempts, 1000);
          await new Promise(resolve => setTimeout(resolve, delayTime));
        }
      }
    }

    // If all primary attempts failed, try backup API with guaranteed response
    if (attempts >= MAX_RETRIES) {
      console.log('Primary API failed, attempting backup API with guaranteed response...');

      try {
        const backupResult = await attemptBackupResponse(userMessage);
        if (backupResult.success && backupResult.response) {
          // Process backup response
          const processedBackupResponse = isProMode ?
            formatMessage(backupResult.response) :
            addEmotionalCues(formatMessage(backupResult.response));

          // Update the message with backup response
          setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, content: processedBackupResponse } : msg
          ));

          // Log backup success
          await logChatRequest(userMessage, processedBackupResponse, Date.now() - startTime, 'backup_success');

          console.log('Backup API provided successful response');
        } else {
          throw new Error('Backup API also failed');
        }
      } catch (backupError) {
        console.error('Backup API failed:', backupError);

        // Final failsafe: provide a guaranteed response
        const failsafeResponse = generateFailsafeResponse(userMessage, isProMode);
        setMessages(prev => prev.map(msg =>
          msg.id === messageId ? { ...msg, content: failsafeResponse } : msg
        ));

        await logChatRequest(userMessage, failsafeResponse, Date.now() - startTime, 'failsafe');
      }
    }
    } catch (error: any) { // Add type annotation
      console.error('Error in chat flow:', error);

      // Ensure streaming and thinking states are reset in case of errors
      setIsStreaming(false);
      setIsThinking(false);

      // Add a fallback error message if something went wrong with the thinking animation
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, but I encountered an unexpected error. Please try again.",
        timestamp: Date.now()
      }]);
    } finally {
      // Always make sure loading state is reset
      setIsLoading(false);
      setIsStreaming(false);
      setIsThinking(false);
      setShowTypingIndicator(false); // Reset typing indicator

      // Clear any thinking auto-collapse timer
      if (thinkingAutoCollapseTimer) {
        clearTimeout(thinkingAutoCollapseTimer);
        setThinkingAutoCollapseTimer(null);
      }

      // Reset thinking container visibility
      setIsThinkingContainerVisible(false);
      setThinkingStreamText('');
    }
  };

  // Enhanced keyboard handling with comprehensive desktop shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent sending message with Enter key if already loading
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      // Only process if not already loading
      if (!isLoading) {
        handleSendMessage();
      }
    } else {
      setUserIsTyping(true);
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (!inputValue.trim()) {
      setUserIsTyping(false);
    }
  };



  // Add a state variable to track if we've shown the stop button notification
  const [hasShownStopButtonNotification, setHasShownStopButtonNotification] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexious-stop-button-notification-shown') === 'true';
    }
    return false;
  });

  // Update the toggleChat function to show the notification when chat is opened
  // Memoize mobile check for better performance
  const isMobileDevice = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  }, []);

  const toggleChat = () => {
    // For mobile users, open chat directly in fullscreen mode
    if (isMobileDevice || isMobile) {
      const newState = !isOpen;

      if (newState) {
        // Save current scroll position before opening chatbot on mobile
        if (typeof window !== 'undefined') {
          const currentScrollY = window.scrollY || document.documentElement.scrollTop;
          setWebsiteScrollPosition(currentScrollY);
        }
      }

      setIsOpen(newState);

      if (newState) {
        // Open in fullscreen mode for mobile
        setIsFullscreen(true);
        setIsMinimized(false);

        // Reset chat if needed
        if (messages.length === 0) {
          resetChat();
        }

        // Use CSS animation for opening
        if (chatWindowRef.current) {
          animateOpenChat(chatWindowRef.current);
        }

        // Prevent body scrolling on mobile and ensure full coverage
        if (typeof document !== 'undefined') {
          document.body.classList.add('chat-open');
          document.body.style.overflow = 'hidden';
          document.body.style.touchAction = 'none';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
          document.body.style.height = '100%';
          document.body.style.top = '0';
          document.body.style.left = '0';

          // Ensure chatbot container has highest z-index
          const chatContainer = document.getElementById('nexious-chat-container');
          if (chatContainer) {
            chatContainer.style.zIndex = '999999';
          }

          // Hide navbar for mobile full preview
          const navbar = document.querySelector('nav, .navbar, [role="navigation"]');
          if (navbar) {
            (navbar as HTMLElement).style.zIndex = '1';
          }
        }
      } else {
        // Close chat
        if (chatWindowRef.current) {
          animateCloseChat(chatWindowRef.current);
        }

        // Reset fullscreen mode when closing chat
        if (isFullscreen) {
          setIsFullscreen(false);
        }

        // Restore body scrolling and navbar
        if (typeof document !== 'undefined') {
          document.body.classList.remove('chat-open');
          document.body.style.overflow = '';
          document.body.style.touchAction = 'auto';
          document.body.style.position = '';
          document.body.style.width = '';
          document.body.style.height = '';
          document.body.style.top = '';
          document.body.style.left = '';

          // Restore navbar z-index
          const navbar = document.querySelector('nav, .navbar, [role="navigation"]');
          if (navbar) {
            (navbar as HTMLElement).style.zIndex = '';
          }

          // Restore the website scroll position for mobile after a brief delay
          setTimeout(() => {
            if (typeof window !== 'undefined' && websiteScrollPosition > 0) {
              window.scrollTo({
                top: websiteScrollPosition,
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      }
      return;
    }

    const newState = !isOpen;

    if (newState) {
      // Save current scroll position before opening chatbot
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;
        setWebsiteScrollPosition(currentScrollY);
      }

      // If we're opening, check if we need to reset the chat
      if (typeof window !== 'undefined' && localStorage.getItem(CHAT_IS_OPEN_KEY) !== 'true') {
        resetChat();
      }

      // Use CSS animation for opening
      if (chatWindowRef.current) {
        animateOpenChat(chatWindowRef.current);
      }

      // Add chat-open class to body - CSS will handle mobile vs desktop behavior
      if (typeof document !== 'undefined') {
        document.body.classList.add('chat-open');

        // For desktop, ensure we don't interfere with scrolling
        if (!isMobile && !isMobileDevice) {
          // Explicitly allow scrolling on desktop
          document.body.style.overflow = 'auto';
          document.body.style.position = 'static';
          document.body.style.touchAction = 'auto';
        }
      }

      // Show the stop button notification if we haven't shown it before
      if (!hasShownStopButtonNotification) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "✨ New Feature: You can now stop AI responses while they're being generated by clicking the red X button that appears during generation.",
            timestamp: Date.now()
          }]);

          // Mark the notification as shown
          setHasShownStopButtonNotification(true);
          localStorage.setItem('nexious-stop-button-notification-shown', 'true');
        }, 1000);
      }

      // Auto-open AI Model Info popup when chatbot opens (desktop only)
      if (!isMobile) {
        setTimeout(() => {
          setShowAIModelInfo(true);
        }, 500); // Delay to allow chatbot to fully open first
      }
    } else {
      // Don't store chat state in localStorage when closing

      // Use CSS animation for closing
      if (chatWindowRef.current) {
        animateCloseChat(chatWindowRef.current);
      }

          // Reset fullscreen mode when closing chat
    if (isFullscreen) {
      setIsFullscreen(false);
    }

    // Remove chat-open class from body to restore scrolling
    if (typeof document !== 'undefined') {
      document.body.classList.remove('chat-open');
      document.body.classList.remove('chat-minimized'); // Also remove minimized class when closing

      // Ensure scrolling is restored on all devices
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.touchAction = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';

      // Restore the website scroll position after a brief delay to ensure DOM is ready
      setTimeout(() => {
        if (typeof window !== 'undefined' && websiteScrollPosition > 0) {
          window.scrollTo({
            top: websiteScrollPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }

    // Close AI Model Info popup when chatbot closes
    setShowAIModelInfo(false);
  }

  // Update state
  setIsOpen(newState);
  setIsMinimized(false);
  setHasNewMessages(false);

      // Don't store chat state in localStorage to prevent auto-opening on reload
    console.log("Chat toggled:", newState ? "opened" : "closed");
  };

  // Updated toggleMinimize function to use CSS animations
  const toggleMinimize = () => {
    const willBeMinimized = !isMinimized;

    // Save the current position for reopening when minimizing
    if (!isMinimized) {
      // Calculate and store current position
      const posRight = isMobile ? '24px' : '24px';
      const posBottom = isMobile ? '24px' : '40px';
      setMinimizedPosition({ right: posRight, bottom: posBottom });

      // Use CSS animation for minimizing
      const fullElement = chatWindowRef.current;
      // The minimized element might not exist yet, so create it if needed
      let minimizedElement = document.querySelector('.nexious-minimized-chat') as HTMLElement;
      if (fullElement) {
        if (!minimizedElement) {
          // Just use state change since element doesn't exist yet
          setIsMinimized(true);
        } else {
          animateMinimize(fullElement, minimizedElement);
        }
      }

      // Explicitly enable scrolling when minimizing and remove all overlays
      if (typeof document !== 'undefined') {
        // Apply to both mobile and desktop to ensure scrolling works
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.touchAction = 'auto'; // Enable touch actions
        document.body.classList.remove('chat-open'); // Remove chat-open class
        document.body.classList.add('chat-minimized'); // Add minimized class for layout

        // Forcefully remove all blur effects and overlays when minimized
        const overlay = document.getElementById('chatbot-overlay');
        if (overlay) {
          overlay.style.display = 'none';
          overlay.classList.add('invisible');
          overlay.classList.add('opacity-0');
          overlay.style.pointerEvents = 'none';
          overlay.style.backdropFilter = 'none';
          (overlay.style as any).webkitBackdropFilter = 'none';
          overlay.style.backgroundColor = 'transparent';
        }

        // Remove any remaining blur effects from body or html
        document.documentElement.style.filter = 'none';
        document.body.style.filter = 'none';
        document.documentElement.style.backdropFilter = 'none';
        document.body.style.backdropFilter = 'none';

        // Reset fullscreen state when minimizing
        if (isFullscreen) {
          setIsFullscreen(false);
        }

        // Restore the website scroll position when minimizing
        setTimeout(() => {
          if (typeof window !== 'undefined' && websiteScrollPosition > 0) {
            window.scrollTo({
              top: websiteScrollPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }

      // Remember sidebar state before minimizing
      if (showSidebar) {
        setShowSidebar(false);
        localStorage.setItem('nexious-sidebar-was-open', 'true');
      }
    } else {
      // Use CSS animation for maximizing
      const minimizedElement = document.querySelector('.nexious-minimized-chat') as HTMLElement;
      const fullElement = chatWindowRef.current;
      if (minimizedElement && fullElement) {
        animateMaximize(minimizedElement, fullElement);
      }

      // When maximizing, prevent scrolling and restore blur effects
      if (typeof document !== 'undefined') {
        // Apply to both mobile and desktop
        document.body.style.overflow = 'hidden';
        document.body.classList.add('chat-open');
        document.body.classList.remove('chat-minimized'); // Remove minimized class

        if (isMobile) {
          document.body.style.touchAction = 'none'; // Disable touch actions to prevent background scrolling
        }

        // Restore overlay and blur effects when maximizing
        const overlay = document.getElementById('chatbot-overlay');
        if (overlay) {
          overlay.style.display = '';
          overlay.classList.remove('invisible');
          overlay.classList.remove('opacity-0');
          overlay.classList.add('opacity-100');
          overlay.style.pointerEvents = 'none'; // Keep it non-interactive

          // Restore blur effects
          overlay.style.backdropFilter = '';
          (overlay.style as any).webkitBackdropFilter = '';
          overlay.style.backgroundColor = '';
        }

        // Clear any forced removal of blur effects
        document.documentElement.style.filter = '';
        document.body.style.filter = '';
        document.documentElement.style.backdropFilter = '';
        document.body.style.backdropFilter = '';
      }

      // Restore sidebar state after a slight delay
      setTimeout(() => {
        const sidebarWasOpen = localStorage.getItem('nexious-sidebar-was-open') === 'true';
        if (sidebarWasOpen) {
          setShowSidebar(true);
          localStorage.removeItem('nexious-sidebar-was-open');
        }
      }, 300);
    }

    // Update state
    setIsMinimized(willBeMinimized);
  };

  // Update toggleSidebar to be mobile-friendly with improved touch handling
  const toggleSidebar = () => {
    // Don't open sidebar when minimized or chat is closed
    if ((isMinimized && !showSidebar) || !isOpen) return;

    setShowSidebar(prev => {
      const newState = !prev;

      // For mobile, adjust body scroll and add proper touch handling
      if (isMobile) {
        if (newState) {
          // Opening sidebar - ensure we have proper mobile styling
          document.body.classList.add('sidebar-open');

          // Add a subtle vibration feedback on mobile devices if supported
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }

          // Prevent background scrolling on mobile when sidebar is open
          document.body.style.overflow = 'hidden';
        } else {
          // Closing sidebar
          document.body.classList.remove('sidebar-open');

          // Add a subtle vibration feedback on mobile devices if supported
          if (navigator.vibrate) {
            navigator.vibrate(25);
          }

          // Restore scrolling if chat is not in fullscreen
          if (!isFullscreen) {
            document.body.style.overflow = '';
          }
        }
      }

      return newState;
    });
  };

  // Update switchSidebarPanel
  const switchSidebarPanel = (panel: string) => {
    setActiveSidebarPanel(panel);
  };

  // Update backToControls to also close sidebar if needed
  const backToControls = () => {
    setActiveSidebarPanel('controls');
    // Optionally close the sidebar if user clicks back
    if (showSidebar) {
      setShowSidebar(false);
    }
  };

  const resetChat = () => {
    setMessages([
      { role: 'system', content: generateSystemPrompt(pageContext.systemPromptAddition, isProMode), timestamp: Date.now() },
      { role: 'assistant', content: pageContext.description, timestamp: Date.now() }
    ]);
    setInputValue('');
    setIsLoading(false);
    setShowTypingIndicator(false);
  };



  // Dynamic border color function for assistant messages
  const getBorderColor = (messageIndex: number) => {
    const colors = [
      'border-cyan-400 shadow-cyan-400/20', // Neon blue
      'border-purple-400 shadow-purple-400/20', // Purple
      'border-yellow-400 shadow-yellow-400/20', // Yellow
      'border-green-400 shadow-green-400/20', // Green
    ];
    return colors[messageIndex % colors.length];
  };

  // Enhanced text cleaning with markdown support for PRO mode
  const cleanText = (content: string) => {
    // For PRO mode, enhanced markdown conversion
    if (isProMode) {
      // First check if the content contains code blocks to avoid unnecessary processing
      if (content.includes('```')) {
        // Multi-line code blocks with proper syntax highlighting and performance optimization
        content = content.replace(/```([\w-]+)?\n([\s\S]*?)```/g, (match, lang, code) => {
          // Determine the language for syntax highlighting
          const language = lang || 'text';

          // Sanitize code but only what's necessary to prevent XSS
          const safeCode = code
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');

          // Create a unique ID for each code block (for copy functionality)
          const blockId = `code-block-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

          // Optimized code block template with better styling and performance
          return `
          <div class="code-block bg-gray-900 border border-gray-700/50 rounded-xl overflow-hidden my-3 shadow-lg">
            <div class="flex items-center justify-between py-2 px-3 bg-gray-800 border-b border-gray-700/50">
              <div class="flex items-center">
                <svg class="w-3.5 h-3.5 mr-1.5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
                <div class="text-gray-300 text-xs font-medium">${language}</div>
              </div>
              <button
                class="code-copy-btn bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-white text-xs px-2 py-1 rounded-full transition-colors flex items-center gap-1.5"
                onclick="navigator.clipboard.writeText(decodeURIComponent('${encodeURIComponent(code)}')).then(() => {
                  this.innerHTML = '<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'12\\' height=\\'12\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><polyline points=\\'20 6 9 17 4 12\\'></polyline></svg> Copied!';
                  this.classList.add('bg-green-500/20', 'text-green-400');
                  setTimeout(() => {
                    this.innerHTML = '<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'12\\' height=\\'12\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><rect x=\\'9\\' y=\\'9\\' width=\\'13\\' height=\\'13\\' rx=\\'2\\' ry=\\'2\\'></rect><path d=\\'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\\'></path></svg> Copy';
                    this.classList.remove('bg-green-500/20', 'text-green-400');
                  }, 2000);
                });"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copy
              </button>
            </div>
            <pre class="p-3 text-gray-200 text-sm font-mono overflow-x-auto leading-relaxed">${safeCode}</pre>
          </div>`;
        });
      }

      // Enhanced inline code styling for dark theme
      if (content.includes('`') && !content.includes('```')) {
        // Inline code - enhanced with better dark theme styling
        content = content.replace(/`([^`]+)`/g, '<code class="bg-black border-2 border-purple-500/50 px-3 py-1.5 rounded-lg text-purple-200 font-mono font-semibold shadow-lg" style="font-family: \'SF Mono\', \'Monaco\', \'Consolas\', monospace; font-size: 0.95em; letter-spacing: 0.5px;">$1</code>');
      }

      // Enhanced markdown formatting with dark theme styling
      if (content.includes('**')) {
        // Bold - enhanced with better contrast and styling
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white bg-purple-900/30 px-1 py-0.5 rounded border border-purple-500/30">$1</strong>');
      }

      if (content.includes('*') && !content.includes('**')) {
        // Italic - enhanced with better styling for dark theme
        content = content.replace(/\*([^*]+)\*/g, '<em class="text-gray-100 italic font-medium bg-gray-800/30 px-1 py-0.5 rounded">$1</em>');
      }

      if (content.includes('#')) {
        // Enhanced Headers with better typography, spacing, and dark theme styling
        content = content
        .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold my-4 text-white leading-tight border-l-4 border-purple-500 pl-4 bg-gray-900/30 py-2 rounded-r-lg">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold my-5 text-white leading-tight border-b-2 border-purple-500/50 pb-3 bg-gray-900/20 px-3 py-2 rounded-lg">$1</h2>')
          .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold my-6 text-white leading-tight border-b-3 border-purple-600 pb-4 bg-gradient-to-r from-gray-900/40 to-purple-900/20 px-4 py-3 rounded-lg shadow-lg">$1</h1>');
      }

      if (content.includes('-') || content.includes('*')) {
        // Enhanced Lists - unordered with better spacing, styling, and dark theme
        content = content.replace(/^\s*[-*] (.*$)/gm, '<div class="flex my-3 leading-relaxed bg-gray-900/20 px-3 py-2 rounded-lg border-l-3 border-purple-400/50"><span class="mr-4 text-purple-400 font-bold text-lg mt-0.5 min-w-[16px]">•</span><span class="text-white font-medium">$1</span></div>');
      }

      if (/^\s*\d+\./.test(content)) {
        // Enhanced Lists - ordered with better typography and dark theme
        content = content.replace(/^\s*(\d+)\. (.*$)/gm, '<div class="flex my-3 leading-relaxed bg-gray-900/20 px-3 py-2 rounded-lg border-l-3 border-blue-400/50"><span class="mr-4 text-blue-400 font-bold text-lg min-w-[32px] mt-0.5">$1.</span><span class="text-white font-medium">$2</span></div>');
      }

      if (content.includes('[') && content.includes(']') && content.includes('(') && content.includes(')')) {
        // Links - only process if there are potential links
        content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer">$1</a>');
      }
    } else {
      // Standard mode - enhanced dark theme formatting
      if (content.includes('#')) {
        // Enhanced headers for standard mode with dark theme
        content = content
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-4 text-white leading-tight border-b border-purple-500/40 pb-2 bg-gray-900/20 px-2 py-1 rounded">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold my-3 text-white leading-snug border-l-2 border-purple-400 pl-3 bg-gray-900/10 py-1">$1</h3>');
      }

      if (content.includes('-') || content.includes('*')) {
        // Enhanced lists for standard mode with dark theme
        content = content.replace(/^\s*[-*] (.*$)/gm, '<div class="flex my-2.5 leading-relaxed bg-gray-900/15 px-2 py-1.5 rounded border-l-2 border-purple-400/40"><span class="mr-3 text-purple-400 font-bold text-base">•</span><span class="text-white font-medium">$1</span></div>');
      }

      // Enhanced basic formatting for standard mode with dark theme
      if (content.includes('**')) {
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white bg-purple-900/20 px-1 py-0.5 rounded">$1</strong>');
      }

      if (content.includes('*') && !content.includes('**')) {
        content = content.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-100 font-medium bg-gray-800/20 px-1 py-0.5 rounded">$1</em>');
      }

      if (content.includes('`') && !content.includes('```')) {
        content = content.replace(/`([^`]+)`/g, '<code class="bg-black border border-purple-500/40 px-2 py-1 rounded text-purple-200 font-mono font-semibold" style="font-family: \'SF Mono\', \'Monaco\', \'Consolas\', monospace; font-size: 0.9em;">$1</code>');
      }
    }

    // Enhanced linebreak conversion with proper spacing for dark theme
    return content
      .replace(/\n\n\n/g, '<div class="my-6 border-t border-gray-800/30 pt-4"></div>') // Triple line breaks with separator
      .replace(/\n\n/g, '<div class="my-5"></div>') // Double line breaks become larger spacers
      .replace(/\n/g, '<br class="leading-relaxed my-1">'); // Single line breaks with better spacing
  };

  // Function to dismiss the promotional area
  const dismissPromo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPromo(false);
  };

  // Hide any site elements that might block the chatbot on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      // Find and hide potentially blocking elements
      const elementsToHide = [
        document.querySelector('.reviews-section'),
        document.querySelector('.testimonials-section'),
        document.querySelector('.cookie-banner'),
        document.querySelector('.floating-cta'),
        document.querySelector('.newsletter-popup')
      ];

      elementsToHide.forEach(el => {
        if (el) {
          (el as HTMLElement).style.display = 'none';
        }
      });

      // Prevent body scrolling on mobile when chat is open
      document.body.style.overflow = 'hidden';

      return () => {
        // Restore elements when chat is closed
        elementsToHide.forEach(el => {
          if (el) {
            (el as HTMLElement).style.display = '';
          }
        });

        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isOpen]);

  // Adjust mobile display styling
  const getMobileStyles = () => {
    if (!isMobile) return {};

    if (isFullscreen || (isMobile && isOpen)) {
      return {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999999, // Higher z-index to ensure it's above everything
        borderRadius: 0,
        width: '100vw',
        height: '100vh',
        maxWidth: '100vw',
        maxHeight: '100vh'
      };
    }

    return {
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      maxWidth: '100%',
      zIndex: 999999 // Consistent high z-index
    };
  };

  // Initialize system with optimized knowledge for better performance
  useEffect(() => {
    // Pre-process knowledge for faster access
    const optimizeKnowledge = () => {
      // Cache common responses for quick access
      const cachedResponses = {
        services: serviceCategories.map(c => c.name).join(', '),
        pricing: 'Pricing varies from $137.45 to $900 based on service tier.',
        team: teamInfo.members.map(m => m.name).join(', ')
      };

      // Make it available in window scope for faster access
      if (typeof window !== 'undefined') {
        (window as any).__nexiousCache = cachedResponses;
      }
    };

    optimizeKnowledge();
  }, []);

  // Detect mobile devices and handle orientation changes - Run this effect first with highest priority
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        const wasMobile = isMobile;
        const newIsMobile = window.innerWidth < 768;
        setIsMobile(newIsMobile);

        // Reset fullscreen mode if device is no longer mobile
        if (wasMobile && !newIsMobile && isFullscreen) {
          setIsFullscreen(false);
        }

        // Handle scrolling based on status
        if (isOpen && newIsMobile && !isMinimized) {
          document.body.style.overflow = 'hidden';
        } else if (!isOpen || isMinimized) {
          document.body.style.overflow = '';
        }

        // Ensure chat is closed on mobile when resizing to mobile from desktop
        if (newIsMobile && !wasMobile && isOpen) {
          setIsOpen(false);
          // Don't store chat state in localStorage
        }
      };

      // Detect current page for positioning
      const detectCurrentPage = () => {
        const pathname = window.location.pathname;
        setCurrentPage(pathname);
      };

      checkMobile();
      detectCurrentPage();
      window.addEventListener('resize', checkMobile);
      window.addEventListener('popstate', detectCurrentPage);

      return () => {
        window.removeEventListener('resize', checkMobile);
        window.removeEventListener('popstate', detectCurrentPage);
        // Always restore scrolling when component unmounts
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, isMinimized, isFullscreen, isMobile]);

  // Add an effect to check if chatbot is disabled on mount and periodically
  useEffect(() => {
    const checkChatbotStatus = async () => {
      try {
        const enabled = await isChatbotEnabled();
        setIsChatbotDisabled(!enabled);
      } catch (error) {
        console.error('Error checking chatbot status:', error);
      }
    };

    // Check immediately on mount
    checkChatbotStatus();

    // Set up periodic checks (every 10 seconds)
    const statusInterval = setInterval(checkChatbotStatus, 10000);

    return () => clearInterval(statusInterval);
  }, []);

  // Add effect to update Pro Mode countdown timer
  useEffect(() => {
    if (!shouldShowProModeCountdown()) return;

    const updateCountdown = () => {
      const timeRemaining = getProModeTimeRemaining();
      setProModeCountdown(timeRemaining);
    };

    // Update immediately
    updateCountdown();

    // Update every second
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  // Add effect to update Standard Mode request count and cooldown timer
  useEffect(() => {
    const updateRequestCount = () => {
      if (!isProMode) {
        const count = getStandardModeRequestCount();
        setStandardRequestCount(count);

        // Check if we're on cooldown and need to show the timer
        const isCooldown = isStandardModeOnCooldown();
        setOnCooldown(isCooldown);
        setShowCooldownTimer(isCooldown);

        if (isCooldown) {
          // Update cooldown timer immediately
          const timeRemaining = getStandardModeCooldownRemaining();
          setCooldownRemaining(timeRemaining);
        }
      }
    };

    // Update immediately
    updateRequestCount();

    // Update when chat opens or mode changes
    if (isOpen) {
      updateRequestCount();
    }

    // Set up interval to update cooldown timer every second if needed
    let intervalId: NodeJS.Timeout | null = null;

    if (showCooldownTimer && !isProMode) {
      intervalId = setInterval(() => {
        const timeRemaining = getStandardModeCooldownRemaining();
        setCooldownRemaining(timeRemaining);

        // Stop timer when cooldown is over
        if (timeRemaining.hours === 0 && timeRemaining.minutes === 0 && timeRemaining.seconds === 0) {
          setShowCooldownTimer(false);
          setOnCooldown(false);
          if (intervalId) clearInterval(intervalId);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, isProMode, showCooldownTimer]);

  // Toggle PRO mode - Now shows maintenance message
  const toggleProMode = () => {
    // Check if Pro Mode is under maintenance
    if (isProModeUnderMaintenance()) {
      // Show maintenance popup instead of toggling
      setShowProMaintenancePopup(true);

      // Auto-hide popup after 8 seconds
      setTimeout(() => {
        setShowProMaintenancePopup(false);
      }, 8000);

      return; // Don't proceed with toggle
    }

    // Original toggle logic (will only run if maintenance is disabled)
    setIsProMode(!isProMode);
    localStorage.setItem(PRO_MODE_KEY, (!isProMode).toString());

    // Add animation classes for activation/deactivation
    const chatContainer = document.getElementById('nexious-chat-container');
    if (chatContainer) {
      if (!isProMode) {
        // Activating PRO mode
        chatContainer.classList.add('activating-pro-mode');
        setTimeout(() => {
          chatContainer.classList.remove('activating-pro-mode');
        }, 1000);

        // Show PRO mode popup
        setShowProFeaturesPopup(true);
        setTimeout(() => {
          setShowProFeaturesPopup(false);
        }, 5000);

        // Suggest fullscreen mode for mobile users
        if (isMobile && !isFullscreen) {
          setShowFullscreenSuggestion(true);
          setTimeout(() => {
            setShowFullscreenSuggestion(false);
          }, 5000);
        }
      } else {
        // Deactivating PRO mode
        chatContainer.classList.add('deactivating-pro-mode');
        setTimeout(() => {
          chatContainer.classList.remove('deactivating-pro-mode');
        }, 1000);

        // Immediately hide Pro Features popup when disabling Pro Mode
        setShowProFeaturesPopup(false);
        // Also hide fullscreen suggestion if it's showing
        setShowFullscreenSuggestion(false);
      }
    }

    // Update the system message with the new PRO mode status
    const newSystemContent = generateSystemPrompt(pageContext.systemPromptAddition, !isProMode);

    // Add a concise notification message about PRO mode change
    const notificationMessage = !isProMode ?
      "PRO Mode enabled. Advanced technical capabilities activated." :
      "PRO Mode disabled.";

    setMessages(prevMessages => {
      // Find and update the system message
      const updatedMessages = prevMessages.map(msg =>
        msg.role === 'system' ? { ...msg, content: newSystemContent } : msg
      );

      // Add the notification message
      return [...updatedMessages, {
        role: 'assistant',
        content: notificationMessage,
        timestamp: Date.now()
      }];
    });
  };

  // Enhanced function to immediately halt AI response generation
  const toggleResponsePause = () => {
    console.log('🛑 NEXIOUS: Immediate response halt requested');

    try {
      // Abort any active API request
      if (responseController) {
        console.log('🛑 NEXIOUS: Aborting active API request');
        responseController.abort();
        setResponseController(null);
      }

      // Clear any active timeouts
      if (thinkingAutoCollapseTimer) {
        clearTimeout(thinkingAutoCollapseTimer);
        setThinkingAutoCollapseTimer(null);
      }

      // Immediately reset all streaming and thinking states
      setIsStreaming(false);
      setIsThinking(false);
      setIsLoading(false);
      setShowTypingIndicator(false);
      setThinkingText('');
      setThinkingStreamText('');
      setIsThinkingContainerVisible(false);
      setIsThinkingCollapsed(true);

      // Reset message streaming state
      setStreamedMessageId(null);
      setStreamedResponse('');

      // Add a professional completion message
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content.trim() === '') {
          // Remove empty assistant message and add completion message
          return [...prev.slice(0, -1), {
            role: 'assistant',
            content: "Response stopped. How can I help you further?",
            timestamp: Date.now()
          }];
        } else if (lastMessage && lastMessage.role === 'assistant') {
          // Add completion message after existing content
          return [...prev, {
            role: 'assistant',
            content: "Response stopped. Feel free to ask me anything else.",
            timestamp: Date.now()
          }];
        } else {
          // Fallback case
          return [...prev, {
            role: 'assistant',
            content: "Ready to help. What would you like to know?",
            timestamp: Date.now()
          }];
        }
      });

      // Update performance indicators
      setCurrentFPS(60);
      setIsFPSOptimal(true);

      // Focus input field for immediate user interaction
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      console.log('✅ NEXIOUS: Response halt completed successfully');
    } catch (error) {
      console.error('❌ NEXIOUS: Error during response halt:', error);
      // Ensure states are reset even if error occurs
      setIsStreaming(false);
      setIsThinking(false);
      setIsLoading(false);
      setShowTypingIndicator(false);
      setStreamedMessageId(null);
    }
  };

  // Enhanced backup response function with guaranteed delivery
  const attemptBackupResponse = async (userMessage: string): Promise<{success: boolean, response?: string}> => {
    try {
      console.log('Attempting backup API response...');

      // Use the centralized backup API request preparation
      const backupRequest = await prepareBackupAPIRequest(userMessage);

      const response = await fetch(backupRequest.url, {
        method: 'POST',
        headers: backupRequest.headers,
        body: JSON.stringify(backupRequest.body)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          const backupResponse = data.choices[0].message.content;
          console.log('Backup API successful');
          return { success: true, response: backupResponse };
        }
      }

      throw new Error('Backup API response invalid');
    } catch (error) {
      console.error('Backup API failed:', error);
      return { success: false };
    }
  };

  // Failsafe response generator - guarantees a response
  const generateFailsafeResponse = (userMessage: string, isProMode: boolean): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Intelligent response based on message content
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
      return "I'd be happy to help with pricing information. Our services are competitively priced based on project requirements. Please contact us directly for a detailed quote tailored to your specific needs.";
    }

    if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
      return "NEX-DEVS specializes in professional web development services including custom websites, e-commerce solutions, and AI integration. We deliver high-quality, modern web solutions tailored to your business needs.";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      return "You can contact NEX-DEVS through our contact form on the website, or reach out to us directly. We're always ready to discuss your project requirements and provide professional assistance.";
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('who') || lowerMessage.includes('about')) {
      return "NEX-DEVS is led by Ali Hasanaat (Founder) with 5+ years of industry experience, supported by core developers including Eman-Ali, Hanan-Shoukat, Mohammed Ahmad, and Us. We're a dedicated team focused on delivering exceptional web solutions.";
    }

    if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('development')) {
      return isProMode ?
        "I'm here to help with your coding and development questions. While I'm experiencing some technical difficulties, I can still assist with programming concepts, code review, and development guidance. Please feel free to share your specific coding question." :
        "I can help with development-related questions. Our team specializes in modern web technologies and can assist with various programming challenges. What specific development topic would you like to discuss?";
    }

    // Default professional response
    return "Thank you for your message. I'm experiencing some technical difficulties but want to ensure you receive assistance. Please feel free to rephrase your question, and I'll do my best to provide helpful information about NEX-DEVS services and capabilities.";
  };

  // Response validation function to ensure completeness
  const validateResponse = (response: string, userMessage: string): boolean => {
    if (!response || response.trim().length === 0) {
      console.warn('Response validation failed: Empty response');
      return false;
    }

    // Check for minimum response length (at least 10 characters)
    if (response.trim().length < 10) {
      console.warn('Response validation failed: Response too short');
      return false;
    }

    // Check for incomplete sentences (basic validation)
    const trimmedResponse = response.trim();
    const lastChar = trimmedResponse[trimmedResponse.length - 1];

    // Response should end with proper punctuation or be a complete thought
    if (trimmedResponse.length > 20 && !'.!?:'.includes(lastChar) && !trimmedResponse.includes('\n')) {
      console.warn('Response validation failed: Potentially incomplete sentence');
      return false;
    }

    // Check for common error patterns
    const errorPatterns = [
      /^error/i,
      /^sorry.*error/i,
      /^i apologize.*error/i,
      /^something went wrong/i,
      /^unable to process/i,
      /^failed to/i
    ];

    for (const pattern of errorPatterns) {
      if (pattern.test(trimmedResponse)) {
        console.warn('Response validation failed: Error pattern detected');
        return false;
      }
    }

    // Check for minimum relevance (basic keyword matching)
    const userKeywords = userMessage.toLowerCase().split(' ').filter(word => word.length > 3);
    const responseText = response.toLowerCase();

    // If user message has keywords, response should contain at least one relevant term
    if (userKeywords.length > 0) {
      const hasRelevantContent = userKeywords.some(keyword =>
        responseText.includes(keyword) ||
        responseText.includes('nex-devs') ||
        responseText.includes('service') ||
        responseText.includes('help') ||
        responseText.includes('development') ||
        responseText.includes('website')
      );

      if (!hasRelevantContent && response.length < 100) {
        console.warn('Response validation failed: Potentially irrelevant response');
        return false;
      }
    }

    console.log('Response validation passed');
    return true;
  };

  // Add a function to handle temperature changes with enhanced functionality and logging
  const handleTemperatureChange = (value: number) => {
    const newTemperature = parseFloat(value.toFixed(2));
    setTemperature(newTemperature);

    console.log(`🌡️ NEXIOUS TEMPERATURE: Changed to ${newTemperature} (${newTemperature < 0.3 ? 'Precise' : newTemperature > 0.7 ? 'Creative' : 'Balanced'})`);

    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexious-temperature', newTemperature.toString());
    }

    // Update the settings in nexiousAISettings.ts
    try {
      const { updateModelSettings } = require('../utils/nexiousAISettings');
      const mode = isProMode ? 'pro' : 'standard';
      updateModelSettings(mode, { temperature: newTemperature });
      console.log(`🔧 NEXIOUS SETTINGS: Updated ${mode} mode temperature to ${newTemperature}`);
    } catch (error) {
      console.error('❌ NEXIOUS SETTINGS: Failed to update temperature in settings file:', error);
    }
  };

  // Add functions to handle new AI model parameters
  const handleTopPChange = (value: number) => {
    setTopP(parseFloat(value.toFixed(2)));
  };

  const handleMaxTokensChange = (value: number) => {
    const tokenRange = { min: 100, max: 2000 };
    const scaledValue = Math.floor(tokenRange.min + value * (tokenRange.max - tokenRange.min));
    setMaxTokens(scaledValue);
  };

  const handlePresencePenaltyChange = (value: number) => {
    // Scale from 0-1 to -2.0 to 2.0
    const scaledValue = (value * 4) - 2;
    setPresencePenalty(parseFloat(scaledValue.toFixed(2)));
  };

  const handleFrequencyPenaltyChange = (value: number) => {
    // Scale from 0-1 to -2.0 to 2.0
    const scaledValue = (value * 4) - 2;
    setFrequencyPenalty(parseFloat(scaledValue.toFixed(2)));
  };

  // Standard mode handlers for user-customizable settings
  const handleStandardTemperatureChange = (value: number) => {
    const newTemperature = parseFloat(value.toFixed(2));
    setStandardTemperature(newTemperature);
    setUserTemperature('standard', newTemperature);
    console.log(`🌡️ NEXIOUS STANDARD TEMPERATURE: Changed to ${newTemperature}`);
  };

  const handleStandardMaxTokensChange = (value: number) => {
    const tokenRange = { min: 500, max: 6000 };
    const scaledValue = Math.floor(tokenRange.min + value * (tokenRange.max - tokenRange.min));
    setStandardMaxTokens(scaledValue);
    setUserMaxTokens('standard', scaledValue);
    console.log(`📝 NEXIOUS STANDARD MAX TOKENS: Changed to ${scaledValue}`);
  };

  // Modify the settings UI to include a single API key input
  const renderSettingsPanel = () => {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-4 space-y-4">
          <h3 className="text-lg font-semibold text-white mb-3">Settings</h3>

          {/* Pro Mode Toggle */}
          <div className="flex flex-col space-y-2">
            <label className="flex items-center justify-between">
              <span className="text-gray-200 font-medium">Pro Mode</span>
              <button
                onClick={toggleProMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isProMode ? 'bg-purple-800' : 'bg-gray-600'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isProMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
            <p className="text-xs text-gray-400">
              {isProMode ?
                'Pro Mode: Advanced features with Claude 3 Opus' :
                'Standard Mode: DeepSeek R1 with simplified responses'}
            </p>
          </div>

          {/* Current Model Info */}
          <div className="pt-3 pb-2 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">Active Model</h4>
              <span className={`px-2.5 py-1 rounded-full text-xs ${isProMode ? 'bg-purple-900/30 text-purple-300 border border-purple-700/30' : 'bg-purple-900/30 text-purple-300 border border-purple-700/30'}`}>
                {isProMode ? 'Claude 3 Opus' : 'DeepSeek R1'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {isProMode ?
                'Advanced reasoning, longer context, code expertise' :
                'Fast responses, friendly chat, basic assistance'}
            </p>
          </div>

          {/* OpenRouter API Key (single field for both modes) */}
          <div className="pt-4 pb-2 border-t border-gray-700/50">
            <h4 className="text-sm font-medium text-gray-300 mb-2">OpenRouter API Key</h4>
            <div className="flex space-x-2">
              <input
                type="password"
                className="flex-1 bg-gray-800 rounded-lg text-white text-sm px-3 py-2 border border-gray-700/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                placeholder="sk-or-..."
                value={standardApiKey || ''}
                onChange={(e) => setStandardApiKey(e.target.value)}
              />
              <button
                onClick={() => saveApiKey('standard', standardApiKey)}
                className="px-3 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                Save
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Enter your OpenRouter API key starting with sk-or-
              <span className="block mt-1">The same API key is used for both Standard and Pro modes</span>
            </p>
          </div>

          {/* Temperature Control - Standard Mode Only - ALWAYS VISIBLE IN STANDARD MODE */}
          {!isProMode && (
            <div className="mt-4 p-4 bg-blue-900/30 border border-blue-600/50 rounded-lg shadow-sm">
              <h4 className="text-sm font-semibold text-blue-200 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 4V10C15.1046 10 16 10.8954 16 12C16 13.1046 15.1046 14 14 14V20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20V14C8.89543 14 8 13.1046 8 12C8 10.8954 8.89543 10 10 10V4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Standard Mode Temperature
              </h4>
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-gray-200 font-medium">Temperature</span>
                  <span className="text-blue-300 font-semibold">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${temperature * 100}%, #374151 ${temperature * 100}%, #374151 100%)`
                  }}
                />
                <div className="flex justify-between text-gray-400 text-xs mt-2">
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
                <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                  Controls AI response creativity: Lower values for focused answers, higher for creative responses
                </p>
              </div>
            </div>
          )}

          {/* Pro Mode Settings */}
          {isProMode && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
              <h4 className="text-sm font-medium text-purple-300 mb-2 flex items-center">
                <Zap size={14} className="mr-1.5" />
                Pro Mode Settings
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300">Temperature</span>
                    <span className="text-purple-300">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-gray-500 text-xs mt-1">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-300">Max Tokens</span>
                    <span className="text-purple-300">{maxTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={(maxTokens - 100) / 1900}
                    onChange={(e) => handleMaxTokensChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-gray-500 text-xs mt-1">
                    <span>Shorter</span>
                    <span>Longer</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Standard Mode is using default settings */}
          {!isProMode && (
            <div className="mt-4 p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
              <h4 className="text-sm font-medium text-purple-300 mb-2">Standard Mode Settings</h4>
              <p className="text-xs text-gray-400">
                Standard mode uses optimized settings for friendly, concise responses.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Function to save API key (now for both modes)
  const saveApiKey = async (mode: 'standard' | 'pro', key: string) => {
    if (!key) {
      console.error(`No API key provided`);
      return;
    }

    try {
      // Use the setAPIKey function from our settings module - this now saves for both modes
      const success = await setAPIKey(key);
      if (success) {
        console.log(`API key saved successfully`);
        // Also update the proApiKey state to keep it in sync
        setProApiKey(key);
        // You can add a UI notification here
      } else {
        console.error(`Failed to save API key`);
      }
    } catch (error) {
      console.error(`Error saving API key:`, error);
    }
  };

  // Load API keys on init
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        // We only need to load the API key once since it's shared
        const apiKey = await getAPIKey('standard');

        if (apiKey) {
          setStandardApiKey(apiKey);
          setProApiKey(apiKey); // Keep both state variables in sync
        }
      } catch (error) {
        console.error('Error loading API key:', error);
      }
    };

    loadApiKeys();
  }, []);

  // Toggle between normal chat and code snippet mode (Pro mode only)
  const toggleCodeMode = () => {
    if (!isProMode) return; // Only allow in Pro mode

    setIsCodeMode(!isCodeMode);

    // Reset inputs when switching modes
    if (isCodeMode) {
      // When switching from code mode to normal mode
      setCodeSnippet('');
      setInputValue('');
    } else {
      // When switching to code mode
      setInputValue('');
      setCodeSnippet('');
    }

    // Focus the appropriate input after transition
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Function to handle code language selection
  const handleCodeLanguageChange = (lang: string) => {
    setCodeLanguage(lang);
  };

  // AI Model switching functions
  const handleModelSwitch = async (modelId: string) => {
    if (modelId === currentAIModel || isModelSwitching) return;

    setIsModelSwitching(true);
    console.log(`🔄 NEXIOUS MODEL: Switching from ${currentAIModel} to ${modelId}`);

    try {
      // Simulate model switching delay (in real implementation, this would update the AI settings)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCurrentAIModel(modelId);

      // Add a system message to indicate model switch
      const modelName = modelId.split('/')[1]?.replace(':free', '').replace('-', ' ') || 'AI Model';
      setMessages(prev => [...prev, {
        role: 'system',
        content: `🤖 Switched to ${modelName}. I'm ready to assist you with enhanced capabilities!`,
        timestamp: Date.now()
      }]);

      console.log(`✅ NEXIOUS MODEL: Successfully switched to ${modelId}`);
    } catch (error) {
      console.error('❌ NEXIOUS MODEL: Failed to switch model:', error);

      // Add error message
      setMessages(prev => [...prev, {
        role: 'system',
        content: '⚠️ Failed to switch AI model. Please try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsModelSwitching(false);
    }
  };



  // Initialize chatbot fixed positioning
  useEffect(() => {
    const chatbotContainer = document.getElementById('nexious-chat-container');
    if (chatbotContainer) {
      // Apply fixed positioning directly
      chatbotContainer.style.position = 'fixed';
      chatbotContainer.style.bottom = '20px';
      chatbotContainer.style.right = '20px';
      chatbotContainer.style.zIndex = '999999';
      chatbotContainer.style.transform = 'none'; // Reset any transforms
      chatbotContainer.style.transition = 'none'; // Disable transitions
      // Move container out of any transformed ancestors so fixed positioning sticks to viewport
      if (chatbotContainer.parentElement !== document.body) {
        document.body.appendChild(chatbotContainer);
      }
    }

    // Add custom styles to document head
    if (typeof document !== 'undefined') {
      const fixedPositionStyles = document.createElement('style');
      fixedPositionStyles.textContent = `
        #nexious-chat-container {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 999999 !important;
          transform: none !important;
          transition: none !important;
          will-change: auto !important;
        }

        .nexious-chat-container {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 999999 !important;
          transform: none !important;
          transition: none !important;
          will-change: auto !important;
        }

        .nexious-minimized-chat {
          position: fixed !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 999999 !important;
          transform: none !important;
        }

        /* Prevent scrolling when chat is open - ONLY on mobile devices */
        @media (max-width: 768px) {
          body.chat-open {
            overflow: hidden !important;
            position: fixed !important;
            width: 100% !important;
            height: 100% !important;
            touch-action: none !important;
            -webkit-overflow-scrolling: touch !important;
          }
        }

        /* On desktop, allow background scrolling when chat is open */
        @media (min-width: 769px) {
          body.chat-open {
            /* Allow normal scrolling on desktop */
            overflow: auto !important;
            position: static !important;
            touch-action: auto !important;
          }
        }

        /* Special animation class for pulsing effect */
        .pulse-effect {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(139, 92, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
          }
        }

        /* Material design animation classes */
        .animate-material-slideIn {
          animation: material-slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes material-slideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Sidebar position fixes */
        .chatbot-sidebar {
          position: absolute !important;
          right: 0 !important;
          left: auto !important;
          top: 0 !important;
          bottom: 0 !important;
          transform: translateX(100%) !important;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease !important;
        }

        .chatbot-sidebar.visible {
          transform: translateX(0) !important;
        }
      `;
      document.head.appendChild(fixedPositionStyles);

      return () => {
        document.head.removeChild(fixedPositionStyles);
      };
    }
  }, []);

  // Global keyboard shortcuts handler for desktop users
  const handleGlobalKeyDown = useCallback((e: KeyboardEvent) => {
    // Only apply shortcuts on desktop (not mobile)
    if (isMobileDevice) return;

    // Escape key - Close modals and chat
    if (e.key === 'Escape') {
      e.preventDefault();

      // Priority order: Close popups first, then modals, then chat
      if (showProFeaturesPopup) {
        setShowProFeaturesPopup(false);
      } else if (showFullscreenSuggestion) {
        setShowFullscreenSuggestion(false);
      } else if (showSidebar) {
        setShowSidebar(false);
      } else if (isOpen && !isMinimized) {
        toggleChat();
      }
      return;
    }

    // Ctrl/Cmd + Enter - Send message (alternative to Enter)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && !isLoading && inputValue.trim()) {
        handleSendMessage();
      }
      return;
    }

    // Ctrl/Cmd + K - Focus input and clear it
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
        setInputValue('');
      }
      return;
    }

    // Ctrl/Cmd + M - Toggle minimize/maximize
    if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
      e.preventDefault();
      if (isOpen) {
        toggleMinimize();
      }
      return;
    }

    // Ctrl/Cmd + Shift + S - Toggle sidebar
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      if (isOpen) {
        setShowSidebar(!showSidebar);
      }
      return;
    }

    // Ctrl/Cmd + Shift + P - Toggle Pro mode
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
      e.preventDefault();
      if (isOpen) {
        toggleProMode();
      }
      return;
    }

    // Ctrl/Cmd + Shift + C - Clear chat history
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      if (isOpen && !isLoading) {
        resetChat();
      }
      return;
    }

    // Ctrl/Cmd + / - Show keyboard shortcuts help
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      if (isOpen) {
        // Add a help message to the chat
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `🎹 **Keyboard Shortcuts:**
• **Enter** - Send message
• **Ctrl/Cmd + Enter** - Send message (alternative)
• **Escape** - Close chat/modals
• **Ctrl/Cmd + K** - Focus and clear input
• **Ctrl/Cmd + M** - Toggle minimize
• **Ctrl/Cmd + Shift + S** - Toggle sidebar
• **Ctrl/Cmd + Shift + P** - Toggle Pro mode
• **Ctrl/Cmd + Shift + C** - Clear chat
• **Ctrl/Cmd + /** - Show this help`,
          timestamp: Date.now()
        }]);
      }
      return;
    }

    // Alt + N - Open/toggle Nexious chat
    if (e.altKey && e.key === 'n') {
      e.preventDefault();
      if (!isOpen) {
        toggleChat();
      } else if (isMinimized) {
        toggleMinimize();
      } else {
        toggleChat();
      }
      return;
    }

    // Ctrl/Cmd + Shift + F - Toggle fullscreen (mobile)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      if (isOpen && isMobile) {
        setIsFullscreen(!isFullscreen);
      }
      return;
    }
  }, [
    isMobileDevice, showProFeaturesPopup, showFullscreenSuggestion,
    showSidebar, isOpen, isMinimized, isLoading, inputValue, isMobile, isFullscreen,
    toggleChat, toggleMinimize, toggleProMode, resetChat, handleSendMessage
  ]);

  // Add global keyboard event listeners for desktop shortcuts
  useEffect(() => {
    // Only add global shortcuts on desktop
    if (!isMobileDevice) {
      document.addEventListener('keydown', handleGlobalKeyDown);

      return () => {
        document.removeEventListener('keydown', handleGlobalKeyDown);
      };
    }
  }, [handleGlobalKeyDown, isMobileDevice]);

  return (
    <>
      {/* Background blur overlay when chatbot is open - ONLY for desktop and NOT minimized */}
      {isOpen && !isMinimized && !isMobile && (
        <div
          className="fixed inset-0 z-[998] pointer-events-none"
          style={{
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            backgroundColor: 'rgba(10, 10, 20, 0.2)',
            transition: 'all 0.3s ease-in-out'
          }}
        />
      )}

      <div
        ref={chatWindowRef}
        id="nexious-chat-container"
        className="nexious-chat-container"
        style={{
          position: 'fixed',
          bottom: isMobile && isOpen ? '0' : '20px',
          right: isMobile && isOpen ? '0' : '20px',
          top: isMobile && isOpen ? '0' : 'auto',
          left: isMobile && isOpen ? '0' : 'auto',
          width: isMobile && isOpen ? '100vw' : 'auto',
          height: isMobile && isOpen ? '100vh' : 'auto',
          zIndex: 999999,
          transform: 'none',
          maxHeight: isMobile ? '100vh' : 'calc(100vh - 80px)',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          touchAction: isOpen ? 'none' : 'auto'
        }}>

      {/* Chat Button - Visible when chat is not open OR when mobile and minimized */}
      {(!isOpen || (isMobile && isMinimized)) && (
        <button
          onClick={isMobile && isMinimized ? toggleMinimize : toggleChat}
          className="nexious-chat-button group fixed cursor-pointer px-3 py-2 rounded-full bg-white backdrop-blur-sm border-2 transition-all duration-300 hover:bg-white/90 flex items-center gap-1 shadow-lg pulse-effect"
          aria-label={isMobile && isMinimized ? "Restore AI Chat" : "Open AI Chat Assistant"}
          style={{
            position: 'fixed',
            bottom: isMobile ? '20px' : '32px', // Moved down slightly
            right: isMobile && currentPage === '/pricing' ? 'auto' : (isMobile ? '16px' : '16px'), // Move to left on pricing page for mobile
            left: isMobile && currentPage === '/pricing' ? '16px' : 'auto', // Position on left for pricing page mobile
            zIndex: 999999,
            transform: 'translateZ(0)',
            display: 'flex',
            opacity: '1',
            visibility: 'visible',
            borderRadius: '25px', // More rounded edges
            minWidth: (isMinimized || (isMobile && !isOpen)) ? (isMobile ? '48px' : '56px') : '164px',
            height: isMobile ? '48px' : '48px',
            padding: (isMinimized || (isMobile && !isOpen)) ? '0px' : '12px 16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)', // Clean shadow without glow
            border: '3px solid #8b5cf6', // Bold neon purple border
            willChange: 'transform'
          }}
        >
          <div className="flex items-center justify-center bg-white rounded-full" style={{
            width: (isMinimized || (isMobile && !isOpen)) ? (isMobile ? '40px' : '44px') : '34px', // Smaller on mobile
            height: (isMinimized || (isMobile && !isOpen)) ? (isMobile ? '40px' : '44px') : '34px', // Smaller on mobile
            minWidth: (isMinimized || (isMobile && !isOpen)) ? (isMobile ? '40px' : '44px') : '34px',
            margin: (isMinimized || (isMobile && !isOpen)) ? '2px' : '0 1px 0 0'
          }}>
            <img
              src="https://ik.imagekit.io/u7ipvwnqb/Beige%20and%20Black%20Classic%20Initial%20Wedding%20Logo.png?updatedAt=1752254056269"
              alt="Nexious Logo"
              className="rounded-full object-cover"
              style={{ width: (isMinimized || (isMobile && !isOpen)) ? (isMobile ? '36px' : '40px') : '30px', height: (isMinimized || (isMobile && !isOpen)) ? (isMobile ? '36px' : '40px') : '30px' }}
            />
          </div>
          {!(isMinimized || (isMobile && !isOpen)) && <span className={`${audiowide.className} text-black whitespace-nowrap text-sm tracking-tight font-medium`}>Ask Nexious</span>}
        </button>
      )}

      {/* Minimized Chat - Circular Logo Only */}
      {isOpen && isMinimized && (
        <div
          onClick={toggleMinimize}
          className={`nexious-minimized-chat cursor-pointer transition-all duration-300 hover:scale-110 group ${
            !isMobile ? 'bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 border border-gray-700/40 shadow-2xl hover:shadow-3xl' : ''
          }`}
          style={{
            position: 'fixed',
            bottom: isMobile ? '20px' : '20px', // Bottom edge positioning
            right: isMobile ? '20px' : '20px',
            zIndex: 999999,
            borderRadius: '50%', // Perfect circle
            padding: !isMobile ? '8px' : '0', // Padding only for desktop
            width: isMobile ? '56px' : '60px',
            height: isMobile ? '56px' : '60px',
            // Desktop gets background, mobile gets clean look
            boxShadow: !isMobile ? '0 6px 25px rgba(0, 0, 0, 0.15), 0 3px 10px rgba(0, 0, 0, 0.08)' : 'none',
            willChange: 'transform'
          }}
          title="Click to restore NEXIOUS AI Chat"
        >
          <div className="flex items-center justify-center w-full h-full relative">
            {/* Nexious Logo - White background for desktop, clean for mobile */}
            <div
              className={`flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
                !isMobile ? 'bg-white' : ''
              }`}
              style={{
                width: isMobile ? '56px' : '44px',
                height: isMobile ? '56px' : '44px'
              }}
            >
              <img
                src="https://ik.imagekit.io/u7ipvwnqb/Beige%20and%20Black%20Classic%20Initial%20Wedding%20Logo.png?updatedAt=1752254056269"
                alt="Nexious Logo"
                className="rounded-full object-cover"
                style={{
                  width: isMobile ? '56px' : '40px',
                  height: isMobile ? '56px' : '40px',
                  boxShadow: isMobile ? '0 4px 12px rgba(0, 0, 0, 0.3)' : 'none'
                }}
              />
            </div>

            {/* Pro Mode Indicator - Small badge */}
            {isProMode && (
              <div
                className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full flex items-center justify-center border-2 border-gray-900"
                style={{ width: '16px', height: '16px', fontSize: '8px', fontWeight: 'bold' }}
              >
                P
              </div>
            )}

            {/* Active indicator dot */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
          </div>
        </div>
      )}
      {/* New AI Model Info Popup - Left side of chatbot with proper spacing */}
      {isOpen && !isMinimized && !isMobile && showAIModelInfo && (
        <div
          className="fixed z-[997] ai-model-info-popup transition-all duration-300 ease-out"
          style={{
            right: `calc(100% + 20px)`, // Position to left of chatbot with 20px spacing
            top: '50%',
            transform: 'translateY(-50%)',
            width: '260px', // Significantly narrower than chatbot
            maxHeight: '65vh', // Increased height for more content space
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        >
          {/* Main Info Panel with solid black background and neon borders */}
          <div
            className="relative rounded-lg text-white transform-gpu overflow-hidden animate-in slide-in-from-left-4 duration-300"
            style={{
              background: 'rgba(0, 0, 0, 0.2)', // More transparent frosted background
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '2px solid #8b5cf6', // Neon purple border, no glow
              boxShadow: 'none', // No glow effects
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >

            {/* Close button - Enhanced functionality with proper top-right alignment */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('AI Model Info close button clicked');
                setShowAIModelInfo(false);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-red-400/50"
              aria-label="Close AI Model Info panel"
              title="Close AI Model Info"
              style={{
                top: '8px',
                right: '8px',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Content Container with scrollable area */}
            <div className="relative z-10 h-full flex flex-col p-4">
              {/* Header with Nexious Logo - Compact */}
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center mr-3">
                  <img
                    src="https://ik.imagekit.io/u7ipvwnqb/Beige%20and%20Black%20Classic%20Initial%20Wedding%20Logo.png?updatedAt=1752254056269"
                    alt="Nexious Logo"
                    className="rounded-lg object-cover"
                    style={{ width: '36px', height: '36px' }}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">NEXIOUS AI</h3>
                  <p className="text-xs text-purple-400">Advanced AI Technology</p>
                </div>
              </div>

              {/* Scrollable Content Area - Optimized for 60fps */}
              <div
                className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent pr-1"
                style={{
                  maxHeight: 'calc(65vh - 100px)',
                  scrollBehavior: 'smooth',
                  willChange: 'scroll-position',
                  transform: 'translateZ(0)', // Hardware acceleration
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="space-y-3 text-xs leading-relaxed">
                  {/* AI Technology Overview */}
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: '#000000',
                      border: '1px solid #8b5cf6', // Muted purple border
                      transform: 'translateZ(0)', // Hardware acceleration
                      willChange: 'transform'
                    }}
                  >
                    <h4 className="font-bold text-purple-400 mb-2 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                        <path d="M19 11L19.74 13.74L22.5 14.5L19.74 15.26L19 18L18.26 15.26L15.5 14.5L18.26 13.74L19 11Z" fill="currentColor"/>
                      </svg>
                      Advanced AI Technology
                    </h4>
                    <p className="text-gray-300">
                      NEXIOUS leverages FREE AI models For Now, from <span className="text-purple-400">Claude</span>, <span className="text-blue-400">OpenRouter</span>, <span className="text-green-400">Hugging Face</span>, <span className="text-yellow-400">Google Gemini 27B</span>, <span className="text-red-400">DeepSeek</span>, and other premium providers.
                    </p>
                  </div>

                  {/* Developer & Technology */}
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: '#000000',
                      border: '1px solid #6366f1', // Muted blue border
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  >
                    <h4 className="font-bold text-blue-400 mb-2 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 14C16.4183 14 20 17.5817 20 22H4C4 17.5817 7.58172 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Innovation & Development
                    </h4>
                    <p className="text-gray-300">
                      Developed by a dedicated 19-year-old developer with passion for AI, NEXIOUS utilizes advanced <span className="text-blue-400">Vector databases</span> and <span className="text-purple-400">Natural Language Processing</span> algorithms.
                    </p>
                  </div>

                  {/* Fallback System */}
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: '#000000',
                      border: '1px solid #22c55e', // Muted green border
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  >
                    <h4 className="font-bold text-green-400 mb-2 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      World's First Fallback AI System
                    </h4>
                    <p className="text-gray-300">
                      We're proud to introduce the <span className="text-green-400 font-bold">world's first Fallback AI System</span>, employing backup models to ensure 100% request completion with natural responses using free model access.
                    </p>
                  </div>

                  {/* Performance & Partnerships */}
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: '#000000',
                      border: '1px solid #facc15', // Muted yellow border
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  >
                    <h4 className="font-bold text-yellow-400 mb-2 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Performance & Partnerships
                    </h4>
                    <p className="text-gray-300">
                      Response delays are due to free API limitations. We collaborate with <span className="text-yellow-400">Claude</span>, <span className="text-blue-400">Google</span>, and <span className="text-purple-400">Grok</span> to integrate models like <span className="text-green-400">KIMI K2</span>.
                    </p>
                  </div>

                  {/* Appreciation Message */}
                  <div
                    className="rounded-lg p-3 text-center"
                    style={{
                      background: '#000000',
                      border: '1px solid #f472b6', // Muted pink border
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  >
                    <h4 className="font-bold text-pink-400 mb-2 flex items-center justify-center text-sm">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Thank You for Your Support
                    </h4>
                    <p className="text-gray-300 italic">
                      We appreciate your support as we democratize AI access. Your patience helps us provide free, high-quality AI assistance worldwide.
                    </p>
                  </div>

                  {/* Technical Specifications */}
                  <div
                    className="rounded-lg p-3"
                    style={{
                      background: '#000000',
                      border: '1px solid #9ca3af', // Muted gray border
                      transform: 'translateZ(0)',
                      willChange: 'transform'
                    }}
                  >
                    <h4 className="font-bold text-gray-400 mb-2 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                        <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Technical Specifications
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div
                        className="rounded p-2"
                        style={{ background: '#000000', border: '1px solid #8b5cf6' }}
                      >
                        <span className="text-purple-400 font-medium">Architecture:</span>
                        <br />
                        <span className="text-gray-400">Vector DB + NLP</span>
                      </div>
                      <div
                        className="rounded p-2"
                        style={{ background: '#000000', border: '1px solid #6366f1' }}
                      >
                        <span className="text-blue-400 font-medium">Response:</span>
                        <br />
                        <span className="text-gray-400">1-10 seconds</span>
                      </div>
                      <div
                        className="rounded p-2"
                        style={{ background: '#000000', border: '1px solid #22c55e' }}
                      >
                        <span className="text-green-400 font-medium">Uptime:</span>
                        <br />
                        <span className="text-gray-400">79.9%</span>
                      </div>
                      <div
                        className="rounded p-2"
                        style={{ background: '#000000', border: '1px solid #facc15' }}
                      >
                        <span className="text-yellow-400 font-medium">Models:</span>
                        <br />
                        <span className="text-gray-400">10+ providers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay when chat is open and fullscreen */}
      {isMobile && isOpen && !isMinimized && isFullscreen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]"
          onClick={toggleChat}
          style={{
            opacity: showSidebar ? 0.8 : 0.7,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Mobile backdrop for sidebar - improved touch handling */}
      {isMobile && isOpen && !isMinimized && showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999]"
          onClick={toggleSidebar}
          onTouchStart={(e) => e.preventDefault()}
          style={{
            touchAction: 'manipulation',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        />
      )}

      {/* Pro Mode Maintenance Popup - Fixed z-index with backdrop */}
      {showProMaintenancePopup && (
        <>
          {/* Popup backdrop for better visibility */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" style={{ zIndex: 9999998 }} onClick={() => setShowProMaintenancePopup(false)} />

          <div className="fixed pro-maintenance-popup" style={{
            zIndex: 9999999,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? 'calc(100% - 40px)' : '340px',
            maxWidth: isMobile ? '280px' : '340px'
          }}>
            <div className="bg-gray-900/98 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-orange-500/40 relative animate-in slide-in-from-bottom-4 duration-300">
              {/* Maintenance popup header */}
              <div className={`${isMobile ? 'p-3' : 'p-4'} text-white`}>
                <h4 className={`font-semibold text-orange-300 ${isMobile ? 'mb-2' : 'mb-3'} flex items-center ${isMobile ? 'text-sm' : 'text-base'}`}>
                  <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Pro Mode Maintenance
              </h4>

              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-200 leading-relaxed ${isMobile ? 'mb-3' : 'mb-4'}`}>
                {getProModeMaintenanceMessage()}
              </div>

              {/* Countdown Timer */}
              {shouldShowProModeCountdown() && (
                <div className={`bg-orange-900/30 border border-orange-700/30 rounded-xl ${isMobile ? 'p-2' : 'p-3'} ${isMobile ? 'mb-3' : 'mb-4'}`}>
                  <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-orange-300 ${isMobile ? 'mb-1' : 'mb-2'} font-medium text-center`}>Available again in:</div>
                  <div className={`flex items-center justify-center ${isMobile ? 'space-x-2' : 'space-x-3'} text-white`}>
                    <div className="text-center">
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-orange-300`}>{proModeCountdown.days}</div>
                      <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-400`}>Days</div>
                    </div>
                    <div className="text-orange-300 font-bold">:</div>
                    <div className="text-center">
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-orange-300`}>{proModeCountdown.hours}</div>
                      <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-400`}>Hours</div>
                    </div>
                  </div>
                </div>
              )}

              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-300 leading-relaxed`}>
                Standard Mode remains fully functional with all essential features.
              </div>
            </div>

            {/* Maintenance popup footer */}
            <div className={`bg-gray-800/80 ${isMobile ? 'p-3' : 'p-3'} flex justify-between items-center`}>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-400`}>
                <span className="text-orange-300">Maintenance</span> in progress
              </div>
              <button
                onClick={() => setShowProMaintenancePopup(false)}
                className={`bg-orange-800/80 hover:bg-orange-700 text-white ${isMobile ? 'text-xs px-3 py-2' : 'text-xs px-3 py-1.5'} rounded-full transition-colors ${isMobile ? 'min-h-[36px] touch-manipulation' : ''}`}
                style={{
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                Understood
                </button>
              </div>
            </div>
          </div>
        </>
      )}



      {/* PRO Features Popup - Higher z-index to appear above chatbot */}
      {showProFeaturesPopup && isProMode && (
        <>
          {/* Popup backdrop for better visibility */}
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" style={{ zIndex: 99999998 }} onClick={() => setShowProFeaturesPopup(false)} />

          <div className="fixed pro-features-popup" style={{
            zIndex: 99999999, // Much higher z-index to ensure it appears above chatbot
            bottom: isMobile ? '90px' : '100px',
            left: isMobile ? '50%' : '24px',
            transform: isMobile ? 'translateX(-50%)' : 'none',
            width: isMobile ? 'calc(100% - 24px)' : '360px',
            maxWidth: isMobile ? '85vw' : '400px'
          }}>
          {/* Pop-up header */}
          <div className="bg-gray-900/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
            {/* Pop-up body */}
            <div className="p-3 md:p-4 text-white">
              <h4 className="font-semibold text-purple-300 mb-2 flex items-center text-sm md:text-base">
                <svg className="w-4 h-4 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 3 12 3C17.5228 3 21 6.47715 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                PRO Features Enabled
              </h4>

              <ul className="space-y-2 mt-2">
                <li className="flex items-start text-xs md:text-sm">
                  <div className="bg-purple-800/20 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-200">Increased Context Window</span>
                    <p className="text-gray-300 text-xs">Handles more complex conversations</p>
                  </div>
                </li>
                <li className="flex items-start text-xs md:text-sm">
                  <div className="bg-purple-800/20 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 3 12 3C17.5228 3 21 6.47715 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-200">Enhanced Thinking</span>
                    <p className="text-gray-300 text-xs">Deeper analysis of complex problems</p>
                  </div>
                </li>
                <li className="flex items-start text-xs md:text-sm">
                  <div className="bg-purple-800/20 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 9L12 5L16 9M16 15L12 19L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-200">Code Generation</span>
                    <p className="text-gray-300 text-xs">Advanced code examples with syntax highlighting</p>
                  </div>
                </li>
                <li className="flex items-start text-xs md:text-sm">
                  <div className="bg-purple-800/20 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 9H9.01M15 9H15.01M8 13H16M9.5 18C6.46 18 4 15.54 4 12.5C4 9.46 6.46 7 9.5 7H14.5C17.54 7 20 9.46 20 12.5C20 15.54 17.54 18 14.5 18H9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-200">Enhanced Readability</span>
                    <p className="text-gray-300 text-xs">Better formatted responses with markdown</p>
                  </div>
                </li>
                <li className="flex items-start text-xs md:text-sm">
                  <div className="bg-purple-800/20 rounded-full p-1 mr-2 mt-0.5">
                    <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V12M12 12V15M12 12H15M12 12H9M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium text-purple-200">Error Debugging</span>
                    <p className="text-gray-300 text-xs">Expert analysis of complex code errors</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Pop-up footer */}
            <div className="bg-gray-800/80 p-2.5 md:p-3 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                <span className="text-purple-300">PRO</span> mode is now active
              </div>
              <button
                onClick={() => setShowProFeaturesPopup(false)}
                className="bg-purple-800/80 hover:bg-purple-700 text-white text-xs px-3 py-1 rounded-full transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
          </div>
        </>
      )}


      {/* Chat window - Enhanced for mobile */}
      {isOpen && !isMinimized && (
        <div
          ref={chatWindowRef}
          id="chat-window"
          className={`${
            isMobile
              ? 'fixed inset-0 z-[99999]'
              : 'relative'
          } bg-black/90 backdrop-blur-xl ${isMobile ? 'rounded-none' : 'rounded-2xl'} shadow-2xl flex flex-col overflow-hidden ${
            isMobile ? 'animate-mobile-chat-slide' : 'animate-material-slideIn'
          }`}
          style={{
            width: isMobile ? '100vw' : (isProMode ? '520px' : '480px'),
            height: isMobile ? '100vh' : (isProMode ? '680px' : '620px'),
            maxHeight: isMobile ? '100vh' : 'none',
            margin: '0',
            maxWidth: isMobile ? '100vw' : (isProMode ? '520px' : '480px'),
            minHeight: isMobile ? '100vh' : '520px',
            top: isMobile ? '0' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : 'auto',
            bottom: isMobile ? '0' : 'auto',
            position: isMobile ? 'fixed' : 'relative',
            zIndex: isMobile ? 999999 : 'auto', // Ensure mobile chatbot is above everything
            transition: isMobile ? 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            transform: isMobile ? (isMinimized ? 'translateY(120%)' : 'translateY(0)') : 'none',
            borderRadius: isMobile ? '16px' : '24px',
            boxShadow: isMobile ? 'none' : '0 20px 40px rgba(0, 0, 0, 0.5)',
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '2px solid #8b5cf6',
          }}
        >

          {/* Mobile-Optimized Header with proper touch targets */}
          <div
            className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-3 py-1.5'} ${isMobile && isFullscreen ? '' : (isMobile ? 'rounded-t-2xl' : 'rounded-t-3xl')} ${isProMode ? 'pro-mode-header' : ''}`}
            style={{
              height: isMobile ? '60px' : '52px',
              borderBottom: 'none',
              minHeight: isMobile ? '60px' : '52px',
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
          >
            {/* Modern particles background effect */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              <div className="particles-container">
                {/* Background particles animation will be handled by CSS */}
              </div>
            </div>

            {/* Moving code text background for PRO mode */}
            {isProMode && (
              <div className="absolute inset-0 overflow-hidden opacity-20">
                <div className="code-scroll-bg">
                  <pre className="text-xs font-mono whitespace-pre-wrap leading-relaxed">
                    <span className="code-keyword">const</span> <span className="code-var">nexiousPro</span> = () =&gt; {'{'}
                      <span className="code-keyword">function</span> <span className="code-function">enhancedResponse</span>(<span className="code-param">query</span>) {'{'}
                        <span className="code-keyword">return</span> <span className="code-string">"Professional answers"</span>;
                      {'}'}
                      <span className="code-keyword">const</span> <span className="code-var">styles</span> = {'{'}
                        codeHighlighting: <span className="code-boolean">true</span>,
                        formatting: <span className="code-string">"perfect"</span>,
                        mode: <span className="code-string">"professional"</span>
                      {'}'};
                      <span className="code-comment">// Advanced technical capabilities</span>
                      <span className="code-keyword">class</span> <span className="code-class">DeveloperTools</span> {'{'}
                        <span className="code-function">debugCode</span>() {'{'}
                          <span className="code-keyword">return</span> <span className="code-string">"Solved!"</span>;
                        {'}'}
                      {'}'}
                    {'}'};
                  </pre>
                </div>
              </div>
            )}

            {/* Modern sleek header layout */}
            <div className="flex items-center justify-between w-full relative z-10">
              {/* Logo and title section */}
              <div className="flex items-center">
                {/* Mobile-optimized avatar container - Larger on mobile */}
                <div className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-white flex items-center justify-center ${isMobile ? 'mr-3' : 'mr-2'} overflow-hidden relative p-1`}>
                  {/* New AI Logo Image */}
                  <img
                    src="https://ik.imagekit.io/u7ipvwnqb/Beige%20and%20Black%20Classic%20Initial%20Wedding%20Logo.png?updatedAt=1752254056269"
                    alt="Nexious AI Logo"
                    className={`${isMobile ? 'w-8 h-8' : 'w-6 h-6'} object-contain`}
                    style={{
                      background: 'white',
                      borderRadius: '50%',
                      padding: '1px'
                    }}
                    onError={(e) => {
                      // Fallback to original SVG if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallbackSvg = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallbackSvg) fallbackSvg.style.display = 'block';
                    }}
                  />
                  {/* Fallback SVG (hidden by default) */}
                  <svg
                    className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'} text-white`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'none' }}
                  >
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    <path d="M19 11L19.74 13.74L22.5 14.5L19.74 15.26L19 18L18.26 15.26L15.5 14.5L18.26 13.74L19 11Z" fill="currentColor"/>
                    <path d="M5 11L5.74 13.74L8.5 14.5L5.74 15.26L5 18L4.26 15.26L1.5 14.5L4.26 13.74L5 11Z" fill="currentColor"/>
                  </svg>
                </div>

                {/* Mobile-optimized title and subtitle - Larger and clearer for mobile */}
                <div className="flex flex-col">
                  <h1 className={`font-bold text-white ${isMobile ? 'text-lg' : 'text-base'} flex items-center tracking-wide`}>
                    <span className="nexious-title-modern nexious-title-animation">
                      NEXIOUS
                    </span>
                    {/* BETA Label with Curly Brackets - Larger on mobile */}
                    <span className={`ml-2 font-medium bg-gray-600/80 text-gray-300 px-2 py-1 rounded border border-gray-500/50 flex items-center justify-center ${isMobile ? 'text-xs' : 'text-2xs'}`} style={{ maxHeight: isMobile ? '20px' : '16px', fontSize: isMobile ? '10px' : '8px', lineHeight: '1' }}>
                      {`{BETA}`}
                    </span>
                    {isProMode && (
                      <span className={`ml-1.5 font-medium bg-blue-500 text-white px-2 py-1 rounded-full flex items-center justify-center ${isMobile ? 'text-xs' : 'text-2xs'}`} style={{ maxHeight: isMobile ? '20px' : '16px', fontSize: isMobile ? '10px' : '8px', lineHeight: '1' }}>
                        PRO
                      </span>
                    )}
                  </h1>
                  <div className={`text-gray-300 ${isMobile ? 'text-sm' : 'text-xs'} font-normal flex items-center mt-1`}>
                    <div className={`${isMobile ? 'w-2 h-2' : 'w-1 h-1'} rounded-full bg-green-400 mr-2`}></div>
                    Active now
                  </div>
                </div>
              </div>

              {/* Control buttons with consistent styling - Organized and optimized */}
              <div className="flex items-center gap-1.5">
                {/* PRO MODE button - Consistent size with other buttons */}
                <button
                  onClick={toggleProMode}
                  className={`flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 ${
                    isProModeUnderMaintenance()
                      ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer border border-orange-400'
                      : isProMode
                        ? 'bg-white hover:bg-gray-50 text-black border border-gray-300 shadow-md'
                        : 'bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white'
                  } font-bold relative ${isMobile ? 'touch-manipulation' : ''}`}
                  title={isProModeUnderMaintenance() ? 'Pro Mode is under maintenance - Click for details' : (isProMode ? 'Disable Pro Mode' : 'Enable Pro Mode')}
                  style={isMobile ? {
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    minHeight: '36px',
                    minWidth: '36px'
                  } : {}}
                >
                  <Zap size={isMobile ? 12 : 10} />
                  {isProModeUnderMaintenance() && (
                    <span className={`absolute ${isMobile ? '-top-1 -right-1 w-2 h-2' : '-top-0.5 -right-0.5 w-1.5 h-1.5'} bg-orange-400 rounded-full animate-pulse`}></span>
                  )}
                </button>

                {/* For Desktop: Add close, minimize, and settings buttons */}
                {!isMobile && (
                  <>
                    {/* Close button with dash icon - White background with black icon */}
                    <button
                      onClick={toggleChat}
                      className="flex items-center justify-center h-7 w-7 rounded-full transition-all duration-300 bg-white hover:bg-gray-100 text-black border border-gray-300 shadow-sm font-semibold"
                      title="Close Chatbot"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Minimize button - matching settings gear styling */}
                    <button
                      onClick={toggleMinimize}
                      className="flex items-center justify-center h-7 w-7 rounded-full transition-all duration-300 bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white font-semibold"
                      title="Minimize Chatbot"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Settings/Sidebar toggle button */}
                    <button
                      onClick={toggleSidebar}
                      className="flex items-center justify-center h-7 px-2 text-2xs rounded-full transition-all duration-300 bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white font-semibold"
                      title="Settings & Controls"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 17.28 19.71L17.22 19.65C16.9843 19.4195 16.685 19.2648 16.3606 19.206C16.0362 19.1472 15.7016 19.1869 15.4 19.32C15.1042 19.4468 14.852 19.6572 14.6743 19.9255C14.4966 20.1938 14.4013 20.5082 14.4 20.83V21C14.4 21.5304 14.1893 22.0391 13.8142 22.4142C13.4391 22.7893 12.9304 23 12.4 23C11.8696 23 11.3609 22.7893 10.9858 22.4142C10.6107 22.0391 10.4 21.5304 10.4 21V20.91C10.3923 20.579 10.2851 20.258 10.0925 19.9887C9.8999 19.7194 9.63074 19.5143 9.32 19.4C9.01838 19.2669 8.68381 19.2272 8.35941 19.286C8.03502 19.3448 7.73568 19.4995 7.5 19.73L7.44 19.79C7.25425 19.976 7.03368 20.1235 6.79088 20.2241C6.54808 20.3248 6.28783 20.3766 6.025 20.3766C5.76217 20.3766 5.50192 20.3248 5.25912 20.2241C5.01632 20.1235 4.79575 19.976 4.61 19.79C4.42405 19.6043 4.27653 19.3837 4.17588 19.1409C4.07523 18.8981 4.02343 18.6378 4.02343 18.375C4.02343 18.1122 4.07523 17.8519 4.17588 17.6091C4.27653 17.3663 4.42405 17.1457 4.61 16.96L4.67 16.9C4.90054 16.6643 5.05519 16.365 5.114 16.0406C5.17282 15.7162 5.13312 15.3816 5 15.08C4.87324 14.7842 4.66276 14.532 4.39447 14.3543C4.12618 14.1766 3.81179 14.0813 3.49 14.08H3.32C2.78957 14.08 2.28086 13.8693 1.90579 13.4942C1.53071 13.1191 1.32 12.6104 1.32 12.08C1.32 11.5496 1.53071 11.0409 1.90579 10.6658C2.28086 10.2907 2.78957 10.08 3.32 10.08H3.41C3.74099 10.0723 4.062 9.96512 4.3313 9.77251C4.60059 9.5799 4.80572 9.31074 4.92 9C5.05312 8.69838 5.09282 8.36381 5.034 8.03941C4.97519 7.71502 4.82054 7.41568 4.59 7.18L4.53 7.12C4.34405 6.93425 4.19653 6.71368 4.09588 6.47088C3.99523 6.22808 3.94343 5.96783 3.94343 5.705C3.94343 5.44217 3.99523 5.18192 4.09588 4.93912C4.19653 4.69632 4.34405 4.47575 4.53 4.29C4.71575 4.10405 4.93632 3.95653 5.17912 3.85588C5.42192 3.75523 5.68217 3.70343 5.945 3.70343C6.20783 3.70343 6.46808 3.75523 6.71088 3.85588C6.95368 3.95653 7.17425 4.10405 7.36 4.29L7.42 4.35C7.65568 4.58054 7.95502 4.73519 8.27941 4.794C8.60381 4.85282 8.93838 4.81312 9.24 4.68H9.32C9.61577 4.55324 9.86802 4.34276 10.0457 4.07447C10.2234 3.80618 10.3187 3.49179 10.32 3.17V3C10.32 2.46957 10.5307 1.96086 10.9058 1.58579C11.2809 1.21071 11.7896 1 12.32 1C12.8504 1 13.3591 1.21071 13.7342 1.58579C14.1093 1.96086 14.32 2.46957 14.32 3V3.09C14.3213 3.41179 14.4166 3.72618 14.5943 3.99447C14.772 4.26276 15.0242 4.47324 15.32 4.6C15.6216 4.73312 15.9562 4.77282 16.2806 4.714C16.605 4.65519 16.9043 4.50054 17.14 4.27L17.2 4.21C17.3857 4.02405 17.6063 3.87653 17.8491 3.77588C18.0919 3.67523 18.3522 3.62343 18.615 3.62343C18.8778 3.62343 19.1381 3.67523 19.3809 3.77588C19.6237 3.87653 19.8443 4.02405 20.03 4.21C20.216 4.39575 20.3635 4.61632 20.4641 4.85912C20.5648 5.10192 20.6166 5.36217 20.6166 5.625C20.6166 5.88783 20.5648 6.14808 20.4641 6.39088C20.3635 6.63368 20.216 6.85425 20.03 7.04L19.97 7.1C19.7395 7.33568 19.5848 7.63502 19.526 7.95941C19.4672 8.28381 19.5069 8.61838 19.64 8.92V9C19.7668 9.29577 19.9772 9.54802 20.2455 9.72569C20.5138 9.90337 20.8282 9.99872 21.15 10H21.32C21.8504 10 22.3591 10.2107 22.7342 10.5858C23.1093 10.9609 23.32 11.4696 23.32 12C23.32 12.5304 23.1093 13.0391 22.7342 13.4142C22.3591 13.7893 21.8504 14 21.32 14H21.23C20.9082 14.0013 20.5938 14.0966 20.3255 14.2743C20.0572 14.452 19.8468 14.7042 19.72 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}

                {/* For Mobile: Optimized buttons with proper touch targets */}
                {isMobile && (
                  <>
                    {/* Close button - Consistent styling */}
                    <button
                      onClick={toggleChat}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white transition-all duration-200 touch-manipulation"
                      title="Close"
                      style={{
                        minHeight: '36px',
                        minWidth: '36px',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                      }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* New chat button - Consistent styling */}
                    <button
                      onClick={resetChat}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white transition-all duration-200 touch-manipulation"
                      title="New Chat"
                      style={{
                        minHeight: '36px',
                        minWidth: '36px',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                      }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Minimize button - Consistent styling */}
                    <button
                      onClick={toggleMinimize}
                      className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white transition-all duration-200 touch-manipulation"
                      title="Minimize"
                      style={{
                        minHeight: '36px',
                        minWidth: '36px',
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none'
                      }}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14L12 9L17 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Optimized Header Status Bar - Reduced spacing and better alignment */}
          {!isMinimized && (
            <div className="py-1 px-3 text-xs text-gray-400 flex items-center justify-between border-b border-gray-800/30" style={{
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}>
              {/* Left side - Message Counter */}
              <div className="flex items-center">
                {/* Standard Mode Request Counter */}
                {!isProMode && (
                  <div className="flex items-center bg-blue-900/30 px-2 py-1 rounded-full text-xs">
                    <span className="text-blue-300 font-medium text-2xs">
                      {standardRequestCount}/{getStandardModeConfig().requestLimit} msgs
                    </span>
                  </div>
                )}

                {/* Pro Mode Indicator */}
                {isProMode && (
                  <div className="flex items-center bg-purple-900/30 px-2 py-1 rounded-full text-xs animate-pulse-slow transition-all duration-500">
                    <Zap size={6} className="text-purple-400 mr-0.5 animate-pulse" />
                    <span className="text-purple-300 font-medium text-2xs">PRO</span>
                  </div>
                )}
              </div>

              {/* Right side - Enhanced Model Status Indicator */}
              <div className="flex items-center">
                <ModelStatusIndicator
                  currentModel={currentAIModel}
                  isLoading={isLoading}
                  isSwitching={isModelSwitching}
                  isProMode={isProMode}
                  isMobile={isMobile}
                  isThinking={isThinking}
                  thinkingText={thinkingText}
                  className="shadow-sm"
                />
              </div>
            </div>
          )}

          {/* Chat body - Material design */}
          {!isMinimized && (
            <>
              <div
                ref={messagesContainerRef}
                className="flex-1 p-4 overflow-y-auto bg-transparent scrollbar-thin scrollbar-thumb-gray-500/50 scrollbar-track-transparent"
                onScroll={handleScroll}
                style={{
                  scrollBehavior: 'smooth',
                  willChange: isStreaming ? 'scroll-position' : 'auto',
                  transform: 'translateZ(0)', // Force hardware acceleration
                  backfaceVisibility: 'hidden', // Optimize for smooth scrolling
                  background: 'transparent',
                  // Enhanced 60fps scroll optimization
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'thin',
                  ...(isMobile ? { padding: '10px' } : {}) // Smaller padding for mobile
                }}
              >
                {!visibleMessages.some(m => m.role === 'user') && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                    <div className="text-center text-white/90 p-4">
                      <p className="font-bold text-xl tracking-wide mb-2">
                        Welcome to Nexious AI
                      </p>
                      <p className="text-sm text-white/80 mb-3">
                        Your intelligent assistant powered by NEX-DEVS
                      </p>
                      <p className="text-xs text-white/70 leading-relaxed">
                        I'm here to help you explore our premium web development services, answer questions about our solutions, and guide you toward the perfect digital experience for your business.
                      </p>
                    </div>
                  </div>
                )}

                {/* New Dedicated Thinking Container */}
                <ThinkingContainer
                  isVisible={isThinkingContainerVisible}
                  isThinking={isThinking}
                  thinkingText={thinkingStreamText}
                  isCollapsed={isThinkingCollapsed}
                  onToggleCollapse={() => setIsThinkingCollapsed(!isThinkingCollapsed)}
                  onAutoCollapse={() => {
                    setIsThinkingContainerVisible(false);
                    setIsThinkingCollapsed(true);
                  }}
                  autoCollapseDelay={3000}
                  currentModel={getModelSettings(isProMode).model}
                  userQuery={currentUserQuery}
                  isThinkingModel={isThinkingModel(getModelSettings(isProMode).model)}
                />

                <div
                  className={`flex flex-col ${isMobile ? 'gap-2' : 'gap-4'} nexious-chat`}
                  style={{
                    transform: 'translateZ(0)', // Force hardware acceleration
                    willChange: isStreaming ? 'contents' : 'auto'
                  }}
                >
                  {visibleMessages.map((message, index) => {
                    // Check if this is a thinking message
                    const isThinkingMessage = isThinking && message.id === streamedMessageId;
                    // Check if this is a streaming message
                    const isStreamingMessage = isStreaming && message.id === streamedMessageId;

                    // Only apply typing effect to the first assistant message when index is 0
                    const isFirstAssistantMessage = message.role === 'assistant' && index === 0 && typingEffect;
                    const displayContent = isFirstAssistantMessage ? currentTypingMessage : message.content;

                    // Count assistant messages to determine border color
                    const assistantMessageIndex = visibleMessages.slice(0, index + 1).filter(msg => msg.role === 'assistant').length - 1;
                    const dynamicBorderColor = message.role === 'assistant' ? getBorderColor(assistantMessageIndex) : '';

                    return (
                      <div
                        key={`${message.id || index}-${message.content.length}`}
                        className={`${isMobile ? 'px-4 py-3' : 'px-5 py-4'} max-w-[90%] ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white ml-auto message-slide-in user-message shadow-lg'
                            : `bg-black text-white mr-auto message-slide-in assistant-message border-2 ${dynamicBorderColor} shadow-lg`
                        } ${isAnimating && index === messages.length - 1 ? 'animate-material-popIn' : ''}`}
                        style={{
                          borderRadius: message.role === 'user' ?
                            (isMobile ? '16px 16px 4px 16px' : '20px 20px 4px 20px') :
                            (isMobile ? '16px 16px 16px 4px' : '20px 20px 20px 4px'),
                          animationDelay: `${index * 0.05}s`,
                          transform: 'translateZ(0)',
                          willChange: isStreamingMessage ? 'contents' : 'auto',
                          backfaceVisibility: 'hidden',
                          boxShadow: 'none'
                        }}
                      >
                        {isStreamingMessage ? (
                          // Smooth streaming response without blinking animations
                          <div className="text-base leading-relaxed font-medium message-text streaming-message"
                          style={{
                            transform: 'translateZ(0)', // Force hardware acceleration
                            willChange: 'contents', // Optimize for content changes
                            backfaceVisibility: 'hidden', // Smooth text rendering
                            color: '#ffffff', // Ensure white text
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)' // Better text contrast
                          }}>
                            {/* Show typing indicator if no content yet */}
                            {showTypingIndicator && !displayContent.trim() ? (
                              <div className="typing-animation">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                              </div>
                            ) : (
                              <div
                                ref={isStreamingMessage ? streamingTextRef : undefined}
                                dangerouslySetInnerHTML={{
                                  __html: processStreamedText(cleanText(displayContent))
                                }}
                                style={{
                                  transform: 'translateZ(0)', // Force hardware acceleration for text
                                  willChange: 'contents',
                                  color: '#ffffff' // Ensure white text in content
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          // Enhanced regular message with dark theme styling
                        <div className="text-base leading-relaxed font-medium message-text"
                        style={{
                          fontSize: '16px',
                          color: message.role === 'assistant' ? '#ffffff' : 'inherit',
                          textShadow: message.role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                        }}>
                            {message.role === 'user' ? (
                              <div className="flex items-start">
                                <div className="flex-grow">
                                  {displayContent}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start">
                                <div className="flex-grow" style={{ color: '#ffffff' }}>
                                  <div dangerouslySetInnerHTML={{ __html: cleanText(displayContent) }} />
                                </div>
                              </div>
                          )}
                        </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />

                  {/* Performance-optimized loading indicator */}
                  {(isLoading || isStreaming || isThinking) && (
                    <div className="flex justify-center py-4">
                      <div
                        className="loading-spinner"
                        style={{
                          transform: 'translateZ(0)',
                          willChange: 'transform'
                        }}
                      >
                        <div className="spinner-ring"></div>
                      </div>
                    </div>
                  )}

                  {/* Optimized CSS for smooth animations and performance */}
                  <style jsx>{`
                    .typing-animation {
                      display: flex;
                      align-items: center;
                      transform: translateZ(0);
                      will-change: transform;
                    }

                    .typing-animation .dot {
                      display: inline-block;
                      width: 5px;
                      height: 5px;
                      border-radius: 50%;
                      margin-right: 3px;
                      background: #a78bfa;
                      animation: typing-animation 1.6s infinite ease-in-out both;
                      transform: translateZ(0);
                      will-change: transform, opacity;
                      backface-visibility: hidden;
                      box-shadow: 0 1px 3px rgba(167, 139, 250, 0.3);
                    }

                    .typing-animation .dot:nth-child(1) {
                      animation-delay: -0.4s;
                    }

                    .typing-animation .dot:nth-child(2) {
                      animation-delay: -0.2s;
                    }

                    .typing-animation .dot:nth-child(3) {
                      animation-delay: 0s;
                    }

                    @keyframes typing-animation {
                      0%, 80%, 100% {
                        transform: translateY(0) scale(0.8) translateZ(0);
                        opacity: 0.6;
                      }
                      40% {
                        transform: translateY(-4px) scale(1) translateZ(0);
                        opacity: 1;
                      }
                    }



                    .streaming-message {
                      transform: translateZ(0);
                      will-change: contents;
                      backface-visibility: hidden;
                      color: #ffffff !important;
                      text-rendering: optimizeLegibility;
                      -webkit-font-smoothing: antialiased;
                      -moz-osx-font-smoothing: grayscale;
                    }

                    .streaming-message * {
                      color: inherit !important;
                    }

                    /* Dynamic neon border effects */
                    .border-cyan-400 {
                      border-color: #22d3ee !important;
                      box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.1) !important;
                    }

                    .border-purple-400 {
                      border-color: #c084fc !important;
                      box-shadow: 0 0 20px rgba(192, 132, 252, 0.3), inset 0 0 20px rgba(192, 132, 252, 0.1) !important;
                    }

                    .border-yellow-400 {
                      border-color: #facc15 !important;
                      box-shadow: 0 0 20px rgba(250, 204, 21, 0.3), inset 0 0 20px rgba(250, 204, 21, 0.1) !important;
                    }

                    .border-green-400 {
                      border-color: #4ade80 !important;
                      box-shadow: 0 0 20px rgba(74, 222, 128, 0.3), inset 0 0 20px rgba(74, 222, 128, 0.1) !important;
                    }

                    .nexious-chat {
                      transform: translateZ(0);
                      will-change: scroll-position;
                    }

                    .message-slide-in {
                      transform: translateZ(0);
                      backface-visibility: hidden;
                    }

                    /* Optimize scrollbar for smooth performance */
                    .scrollbar-thin::-webkit-scrollbar {
                      width: 6px;
                    }

                    .scrollbar-thin::-webkit-scrollbar-track {
                      background: rgba(17, 24, 39, 0.3);
                      border-radius: 3px;
                    }

                    .scrollbar-thin::-webkit-scrollbar-thumb {
                      background: rgba(75, 85, 99, 0.7);
                      border-radius: 3px;
                      transition: background 0.2s ease;
                    }

                    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                      background: rgba(107, 114, 128, 0.9);
                    }

                    /* Performance-optimized loading spinner */
                    .loading-spinner {
                      width: 24px;
                      height: 24px;
                      position: relative;
                      transform: translateZ(0);
                      will-change: transform;
                    }

                    .spinner-ring {
                      width: 100%;
                      height: 100%;
                      border: 2px solid rgba(168, 85, 247, 0.2);
                      border-top: 2px solid #a855f7;
                      border-radius: 50%;
                      animation: spin 1s linear infinite;
                      transform: translateZ(0);
                      will-change: transform;
                      backface-visibility: hidden;
                    }

                    @keyframes spin {
                      0% { transform: rotate(0deg) translateZ(0); }
                      100% { transform: rotate(360deg) translateZ(0); }
                    }
                  `}</style>
                </div>
              </div>

              {/* Enhanced suggested questions for mobile */}
              {messages.length <= 3 && !isLoading && (
                <div className="px-4 mb-3 animate-material-slideUp relative z-30" style={{ animationDelay: '0.2s', pointerEvents: 'auto' }}>
                  <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-400 mb-3 font-medium`}>Suggested questions:</p>
                  <div className={`flex flex-wrap gap-${isMobile ? '3' : '2'}`} style={{ pointerEvents: 'auto' }}>
                    {getPageSuggestedQuestions(pathname).map((question, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Suggested question clicked:', question);
                          console.log('Input ref current:', inputRef.current);
                          console.log('Is mobile:', isMobile);

                          // Set the input value
                          setInputValue(question);

                          // Focus the input and handle sending
                          if (inputRef.current) {
                            inputRef.current.focus();
                            inputRef.current.value = question;

                            // Trigger send immediately on mobile for better UX
                            if (isMobile) {
                              setTimeout(() => {
                                console.log('Auto-sending on mobile:', question);
                                handleSendMessage();
                              }, 150);
                            }
                          } else {
                            console.warn('Input ref not available');
                          }
                        }}
                        onTouchStart={(e) => {
                          // Enhanced mobile touch feedback
                          e.currentTarget.style.transform = 'scale(0.92)';
                          e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.3)';
                          // Add haptic feedback if available
                          if (navigator.vibrate) {
                            navigator.vibrate(30);
                          }
                        }}
                        onTouchEnd={(e) => {
                          // Reset transform after touch
                          setTimeout(() => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = '';
                          }, 150);
                        }}
                        className={`${isMobile ? 'text-sm px-5 py-4' : 'text-xs px-4 py-2'} bg-gray-700/60 text-gray-200 rounded-2xl hover:bg-gray-600/60 hover:text-white transition-all duration-200 active:scale-95 ${isMobile ? 'min-h-[52px] touch-manipulation font-medium' : ''} border border-gray-600/30 hover:border-purple-500/40 cursor-pointer relative z-50`}
                        style={{
                          animationDelay: `${0.1 + (index * 0.05)}s`,
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none',
                          userSelect: 'none',
                          pointerEvents: 'auto',
                          ...(isMobile ? {
                            minWidth: '120px',
                            textAlign: 'center',
                            lineHeight: '1.3'
                          } : {})
                        }}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                  {isMobile && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Tap a question to send it instantly
                    </p>
                  )}
                </div>
              )}

              {/* iPhone iMessage-style input area - Smaller */}
              <div className="relative flex items-center p-2 rounded-b-3xl border-t border-gray-800/40" style={{
                background: 'rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}>
                {/* Code mode toggle button for Pro mode */}
                {isProMode && (
                  <button
                    onClick={toggleCodeMode}
                    className={`p-2.5 mr-2 rounded-2xl transition-all duration-300 ${
                      isCodeMode
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700/60 text-gray-300 hover:bg-gray-600/60 hover:text-white'
                    } ${isMobile ? 'min-h-[44px] min-w-[44px] touch-manipulation' : ''}`}
                    title={isCodeMode ? "Switch to chat mode" : "Switch to code mode"}
                    style={{
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none'
                    }}
                  >
                    <Code size={isMobile ? 20 : 18} />
                  </button>
                )}

                {/* Enhanced chat input for mobile */}
                {!isCodeMode && (
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  placeholder={isMobile ? "Ask me anything..." : "Ask me about our services..."}
                  className={`${isMobile ? 'w-10/12' : 'w-full'} bg-gray-800/80 text-white placeholder-gray-500 ${isMobile ? 'rounded-2xl' : 'rounded-3xl'} ${isMobile ? 'py-2 px-3' : 'py-2.5 px-3.5'} outline-none resize-none border border-gray-700/40 focus:border-purple-500/50 transition-colors ${isMobile ? 'touch-manipulation' : ''}`}
                  style={{
                    fontSize: '16px', // Set to 16px as requested
                    minHeight: isMobile ? '40px' : '44px', // Smaller height for mobile
                    maxHeight: isMobile ? '100px' : '150px',
                    border: 'none',
                    boxShadow: 'none',
                    lineHeight: isMobile ? '1.4' : '1.5',
                    ...(isMobile ? {
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'text',
                      userSelect: 'text'
                    } : {})
                  }}
                />
                )}

                {/* Code snippet input for Pro mode */}
                {isCodeMode && (
                  <div className="w-full flex flex-col">
                    <div className="flex items-center mb-2">
                      <span className="text-xs text-gray-300 mr-2">Language:</span>
                      <select
                        value={codeLanguage}
                        onChange={(e) => handleCodeLanguageChange(e.target.value)}
                        className={`bg-gray-700/80 text-white rounded-2xl px-3 py-2 border border-gray-600/50 ${isMobile ? 'text-sm min-h-[44px] touch-manipulation' : 'text-xs'}`}
                        style={{
                          WebkitAppearance: 'none',
                          appearance: 'none'
                        }}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="cpp">C++</option>
                        <option value="php">PHP</option>
                        <option value="sql">SQL</option>
                        <option value="bash">Bash</option>
                        <option value="json">JSON</option>
                      </select>
                    </div>
                    <textarea
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="Paste your code here..."
                      className={`w-full bg-gray-900/80 text-white font-mono placeholder-gray-500 rounded-2xl py-3 px-4 outline-none resize-none border border-gray-700/50 ${isMobile ? 'text-sm' : 'text-sm'}`}
                      style={{
                        minHeight: isMobile ? '140px' : '120px',
                        maxHeight: '300px',
                        fontSize: isMobile ? '16px' : '14px',
                        WebkitAppearance: 'none'
                      }}
                    />
                  </div>
                )}

                {/* Enhanced Stop/Send Button for mobile */}
                {(isLoading || isStreaming || isThinking) ? (
                  <button
                    onClick={toggleResponsePause}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'translateY(-50%) scale(0.9)';
                      if (navigator.vibrate) navigator.vibrate(25);
                    }}
                    onTouchEnd={(e) => {
                      setTimeout(() => {
                        e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                      }, 100);
                    }}
                    className={`absolute ${isMobile ? 'right-3' : 'right-4'} ${isMobile ? 'p-2.5' : 'p-2'} rounded-full bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white border border-gray-500/50 transition-all duration-300 flex items-center justify-center ${isMobile ? 'touch-manipulation' : ''} shadow-md`}
                    style={{
                      width: isMobile ? '44px' : '40px',
                      height: isMobile ? '44px' : '40px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      ...(isMobile ? {
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        minHeight: '44px',
                        minWidth: '44px'
                      } : {})
                    }}
                    aria-label="Stop generation"
                    title="Stop generation"
                  >
                    <X size={isMobile ? 18 : 16} />
                  </button>
                ) : (
                <button
                  onClick={handleSendMessage}
                  onTouchStart={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.transform = 'translateY(-50%) scale(0.9)';
                      if (navigator.vibrate) navigator.vibrate(30);
                    }
                  }}
                  onTouchEnd={(e) => {
                    setTimeout(() => {
                      e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                    }, 100);
                  }}
                    disabled={!inputValue.trim() && (!isCodeMode || !codeSnippet.trim())}
                    className={`absolute ${isMobile ? 'right-3' : 'right-4'} ${isMobile ? 'p-2.5' : 'p-2'} rounded-full ${
                      (!inputValue.trim() && (!isCodeMode || !codeSnippet.trim()))
                        ? 'bg-gray-600/50 text-gray-400'
                        : isCodeMode
                          ? 'bg-white hover:bg-gray-50 active:bg-gray-100 text-black border border-gray-300'
                          : 'bg-white hover:bg-gray-50 active:bg-gray-100 text-black border border-gray-300'
                    } transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center ${isMobile ? 'touch-manipulation' : ''} shadow-md`}
                  style={{
                    width: isMobile ? '44px' : '42px',
                    height: isMobile ? '44px' : '42px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    ...(isMobile ? {
                      WebkitTouchCallout: 'none',
                      WebkitUserSelect: 'none',
                      userSelect: 'none',
                      minHeight: '44px',
                      minWidth: '44px'
                    } : {})
                  }}
                    aria-label="Send message"
                    title="Send message"
                >
                    <Send size={isMobile ? 18 : 18} className={`${(inputValue.trim() || (isCodeMode && codeSnippet.trim())) ? 'transform rotate-45' : ''} transition-transform duration-200`} />
                </button>
                )}
              </div>

              {/* iPhone-style footer */}
              <div className="px-4 py-2 text-left flex items-center justify-between rounded-b-3xl border-t border-gray-800/30" style={{
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}>
                {showCooldownTimer && !isProMode ? (
                  <div className="flex items-center text-xs">
                    <span className="font-semibold text-amber-400">Message limit reached:</span>
                    <span className="ml-1.5 text-amber-300 font-mono">
                      {`${cooldownRemaining.hours.toString().padStart(2, '0')}:${cooldownRemaining.minutes.toString().padStart(2, '0')}:${cooldownRemaining.seconds.toString().padStart(2, '0')}`}
                    </span>
                  </div>
                ) : (
                  <p className={`text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500`}>
                    {isProMode ?
                      'Trained by NEX-DEVS PRO Developers' :
                      'Trained by NEX-DEVS'}
                  </p>
                )}

                {/* Performance indicator */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isFPSOptimal ? 'bg-green-400' :
                      performanceStatus === 'excellent' ? 'bg-green-400' :
                      performanceStatus === 'good' ? 'bg-yellow-400' :
                      performanceStatus === 'fair' ? 'bg-orange-400' : 'bg-red-400'
                    }`}
                    title={`Performance: ${isFPSOptimal ? 'Optimal' : performanceStatus} (${currentFPS}fps)`}
                  />
                  <span className="text-xs text-gray-400">
                    {currentFPS}fps
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Resize handle - Only show when not minimized and not on mobile */}
          {!isMinimized && !isMobile && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
              onMouseDown={startResizing}
              style={{
                background: 'transparent',
                zIndex: 10
              }}
            >
              <div className="w-2 h-2 bg-gray-500 rounded-full absolute bottom-1.5 right-1.5"></div>
            </div>
          )}
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {isMobile && showSidebar && !isMinimized && (
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
          style={{
            transition: 'opacity 0.3s ease',
            borderRadius: isFullscreen ? '0' : '1.5rem'
          }}
        />
      )}

      {/* Sidebar for settings and controls - Hidden on mobile */}
      {isOpen && !isMinimized && !isMobile && (
      <div
        className={`absolute right-0 top-0 bottom-0 bg-gradient-to-b from-gray-900/98 via-gray-950/98 to-gray-900/98 backdrop-blur-xl border-l ${isProMode ? 'border-purple-500/30' : 'border-gray-700/40'} flex flex-col chatbot-sidebar ${showSidebar ? 'visible' : ''} shadow-2xl`}
        style={{
          borderTopRightRadius: isMobile && isFullscreen ? '0' : '1.5rem',
          borderBottomRightRadius: isMobile && isFullscreen ? '0' : '1.5rem',
          width: isMobile ? '95px' : '80px', // Increased width for better mobile touch targets and visibility
          transform: !showSidebar ?
            (isMobile ? 'translateX(100%)' : 'translateX(120%)') :
            'translateX(0)',
          opacity: !showSidebar ? 0 : 1,
          transition: isMobile ?
            'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, box-shadow 0.3s ease' :
            'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          boxShadow: showSidebar ?
            (isMobile ? '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)' : '0 0 25px rgba(0, 0, 0, 0.4)') :
            'none',
          pointerEvents: !showSidebar ? 'none' : 'auto',
          touchAction: 'manipulation', // Improve touch responsiveness
          zIndex: isMobile ? 60 : 50,
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          transformOrigin: 'right center'
        }}
      >
        {/* Main Controls Panel */}
        {activeSidebarPanel === 'controls' && (
          <div className="flex flex-col items-center py-4 h-full w-full sidebar-panel">
            {/* Back/Close button for sidebar */}
            <button
              onClick={toggleSidebar}
              onTouchStart={(e) => {
                // Add touch feedback for mobile
                e.currentTarget.style.transform = 'scale(0.95)';
                if (navigator.vibrate) {
                  navigator.vibrate(25);
                }
              }}
              onTouchEnd={(e) => {
                setTimeout(() => {
                  e.currentTarget.style.transform = 'scale(1)';
                }, 100);
              }}
              className={`flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-11 h-11'} mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-300 shadow-lg sidebar-btn active:scale-95`}
              aria-label="Close sidebar"
              title="Close sidebar"
              style={{
                touchAction: 'manipulation',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <svg className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Minimize button */}
            <button
              onClick={toggleMinimize}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                if (navigator.vibrate) {
                  navigator.vibrate(25);
                }
              }}
              onTouchEnd={(e) => {
                setTimeout(() => {
                  e.currentTarget.style.transform = 'scale(1)';
                }, 100);
              }}
              className={`flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-11 h-11'} mb-4 rounded-2xl bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white transition-all duration-300 shadow-md sidebar-btn active:scale-95`}
              aria-label="Minimize chat"
              title="Minimize chat"
              style={{
                touchAction: 'manipulation',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <Minimize2 size={isMobile ? 22 : 20} />
            </button>



            {/* Reset chat button */}
            <button
              onClick={resetChat}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                if (navigator.vibrate) {
                  navigator.vibrate(25);
                }
              }}
              onTouchEnd={(e) => {
                setTimeout(() => {
                  e.currentTarget.style.transform = 'scale(1)';
                }, 100);
              }}
              className={`flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-11 h-11'} mb-4 rounded-2xl bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white transition-all duration-300 shadow-md sidebar-btn active:scale-95`}
              aria-label="Reset chat"
              title="Reset chat"
              style={{
                touchAction: 'manipulation',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <svg className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8L16 12M16 12L12 16M16 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Close button */}
            <button
              onClick={toggleChat}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
                if (navigator.vibrate) {
                  navigator.vibrate(25);
                }
              }}
              onTouchEnd={(e) => {
                setTimeout(() => {
                  e.currentTarget.style.transform = 'scale(1)';
                }, 100);
              }}
              className={`flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-11 h-11'} mb-4 rounded-2xl bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white transition-all duration-300 shadow-md sidebar-btn active:scale-95`}
              aria-label="Close chat"
              title="Close chat"
              style={{
                touchAction: 'manipulation',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              <X size={isMobile ? 22 : 20} />
            </button>

            {/* Divider */}
            <div className="w-10 h-px bg-gray-700 my-2"></div>

            {/* Settings button for Standard mode */}
            {!isProMode && (
              <button
                onClick={() => setActiveSidebarPanel('standard-settings')}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                  if (navigator.vibrate) {
                    navigator.vibrate(25);
                  }
                }}
                onTouchEnd={(e) => {
                  setTimeout(() => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }, 100);
                }}
                className={`flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-11 h-11'} mb-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all duration-300 shadow-lg sidebar-btn active:scale-95`}
                aria-label="AI Settings"
                title="AI Settings"
                style={{
                  touchAction: 'manipulation',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                {/* Professional AI Brain Icon - Removed Duplicate Settings Icon */}
                <svg className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 2C8.11929 2 7 3.11929 7 4.5V5.5C7 6.88071 8.11929 8 9.5 8H14.5C15.8807 8 17 6.88071 17 5.5V4.5C17 3.11929 15.8807 2 14.5 2H9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 12H16C18.2091 12 20 13.7909 20 16V18C20 20.2091 18.2091 22 16 22H8C5.79086 22 4 20.2091 4 18V16C4 13.7909 5.79086 12 8 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 16H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 19H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Model Settings Panel - PRO mode only - make it more mobile friendly */}
        {activeSidebarPanel === 'model' && isProMode && (
          <div className="flex flex-col items-center py-4 h-full w-full overflow-y-auto sidebar-panel">
            {/* Smaller, more professional back button with gradient */}
            <div className="w-full flex justify-between items-center mb-3 px-1">
              <button
                onClick={backToControls}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-md transition-all duration-300 sidebar-btn group"
                aria-label="Back to main controls"
                title="Back to main controls"
              >
                <svg className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Title with back button */}
              <div className="text-center relative cursor-pointer" onClick={backToControls}>
                <div className="text-xs font-semibold text-blue-400 flex items-center">
                  <svg className="w-3 h-3 mr-1 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  AI Model
                </div>
                <div className="text-[10px] text-gray-400">Settings</div>
              </div>

              {/* Empty div for balance */}
              <div className="w-7"></div>
            </div>

            {/* Enhanced Sliders container - Professional Design */}
            <div className="flex flex-col gap-8 items-center py-4">
              {/* Enhanced Temperature slider */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-300 mb-2 font-semibold">Temperature</span>
                <div
                  className="relative h-28 w-7 bg-gradient-to-t from-gray-800/90 to-gray-700/90 rounded-xl flex flex-col items-center cursor-pointer temperature-slider shadow-lg border border-gray-600/30"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handleTemperatureChange(percentage);
                  }}
                >
                  <div
                    className="absolute bottom-0 rounded-xl bg-gradient-to-t from-purple-600 to-pink-500 w-full slider-track shadow-inner"
                    style={{
                      height: `${(temperature / 1) * 100}%`
                    }}
                  />
                  <div
                    className="absolute rounded-full bg-white w-6 h-6 flex items-center justify-center text-[10px] font-bold text-gray-900 shadow-xl border-2 border-gray-100 slider-thumb"
                    style={{
                      bottom: `calc(${(temperature / 1) * 100}% - 12px)`
                    }}
                  >
                    {temperature.toFixed(1)}
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 text-center slider-label font-medium">
                  Creativity Control
                </div>
              </div>

              {/* Enhanced Max Tokens slider */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-300 mb-2 font-semibold">Max Tokens</span>
                <div
                  className="relative h-28 w-7 bg-gradient-to-t from-gray-800/90 to-gray-700/90 rounded-xl flex flex-col items-center cursor-pointer temperature-slider shadow-lg border border-gray-600/30"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handleMaxTokensChange(percentage);
                  }}
                >
                  <div
                    className="absolute bottom-0 rounded-xl bg-gradient-to-t from-teal-600 to-emerald-500 w-full slider-track shadow-inner"
                    style={{
                      height: `${((maxTokens - 100) / 1900) * 100}%` // Normalize from range 100-2000
                    }}
                  />
                  <div
                    className="absolute rounded-full bg-white w-6 h-6 flex items-center justify-center text-[9px] font-bold text-gray-900 shadow-xl border-2 border-gray-100 slider-thumb"
                    style={{
                      bottom: `calc(${((maxTokens - 100) / 1900) * 100}% - 12px)`
                    }}
                  >
                    {maxTokens}
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 text-center slider-label font-medium">
                  Response Length
                </div>
              </div>
            </div>

            {/* Additional back button at the bottom */}
            <button
              onClick={backToControls}
              className="mt-4 flex items-center justify-center px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-500 text-gray-300 hover:text-white transition-all duration-300 text-xs shadow-md"
            >
              <svg className="w-3 h-3 mr-1.5 transition-transform duration-300 group-hover:translate-x-[-2px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          </div>
        )}

        {/* Standard Mode Settings Panel */}
        {activeSidebarPanel === 'standard-settings' && !isProMode && (
          <div className="flex flex-col items-center py-4 h-full w-full overflow-y-auto sidebar-panel">
            {/* Header with back button */}
            <div className="w-full flex justify-between items-center mb-3 px-1">
              <button
                onClick={() => setActiveSidebarPanel('controls')}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-md transition-all duration-300 sidebar-btn group"
                aria-label="Back to main controls"
                title="Back to main controls"
              >
                <svg className="w-4 h-4 group-hover:translate-x-[-2px] transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <div className="text-center relative cursor-pointer" onClick={() => setActiveSidebarPanel('controls')}>
                <div className="text-xs font-semibold text-blue-400 flex items-center">
                  <svg className="w-3 h-3 mr-1 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  AI Settings
                </div>
                <div className="text-[10px] text-gray-400">Standard</div>
              </div>

              <div className="w-7"></div>
            </div>

            {/* Standard mode sliders - Enhanced with 4 professional sliders */}
            <div className="flex flex-col gap-5 items-center py-1">
              {/* Temperature slider */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1 font-medium">Temp</span>
                <div
                  className="relative h-24 w-6 bg-gray-800/80 rounded-full flex flex-col items-center cursor-pointer temperature-slider shadow-inner border border-gray-700/50"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handleStandardTemperatureChange(percentage);
                  }}
                >
                  <div
                    className="absolute bottom-0 rounded-full bg-gradient-to-t from-purple-600 to-pink-500 w-full slider-track shadow-sm"
                    style={{
                      height: `${(standardTemperature / 1) * 100}%`
                    }}
                  />
                  <div
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[9px] font-bold text-gray-900 shadow-lg border border-gray-200 slider-thumb"
                    style={{
                      bottom: `calc(${(standardTemperature / 1) * 100}% - 10px)`
                    }}
                  >
                    {standardTemperature.toFixed(1)}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-400 text-center slider-label font-medium">
                  Creativity
                </div>
              </div>

              {/* Max Tokens slider */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1 font-medium">Tokens</span>
                <div
                  className="relative h-24 w-6 bg-gray-800/80 rounded-full flex flex-col items-center cursor-pointer temperature-slider shadow-inner border border-gray-700/50"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handleStandardMaxTokensChange(percentage);
                  }}
                >
                  <div
                    className="absolute bottom-0 rounded-full bg-gradient-to-t from-teal-600 to-emerald-500 w-full slider-track shadow-sm"
                    style={{
                      height: `${((standardMaxTokens - 500) / 5500) * 100}%` // Normalize from range 500-6000
                    }}
                  />
                  <div
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[9px] font-bold text-gray-900 shadow-lg border border-gray-200 slider-thumb"
                    style={{
                      bottom: `calc(${((standardMaxTokens - 500) / 5500) * 100}% - 10px)`
                    }}
                  >
                    {standardMaxTokens}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-400 text-center slider-label font-medium">
                  Length
                </div>
              </div>

              {/* NEW: Creativity Boost slider - Professional Design */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1 font-medium">Boost</span>
                <div
                  className="relative h-24 w-6 bg-gray-800/80 rounded-full flex flex-col items-center cursor-pointer temperature-slider shadow-inner border border-gray-700/50"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    setCreativityBoost(percentage);
                  }}
                >
                  <div
                    className="absolute bottom-0 rounded-full bg-gradient-to-t from-orange-600 to-yellow-500 w-full slider-track shadow-sm"
                    style={{
                      height: `${creativityBoost * 100}%`
                    }}
                  />
                  <div
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[9px] font-bold text-gray-900 shadow-lg border border-gray-200 slider-thumb"
                    style={{
                      bottom: `calc(${creativityBoost * 100}% - 10px)`
                    }}
                  >
                    {creativityBoost.toFixed(1)}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-400 text-center slider-label font-medium">
                  Creative
                </div>
              </div>

              {/* NEW: Precision Mode slider - Professional Design */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1 font-medium">Mode</span>
                <div
                  className="relative h-24 w-6 bg-gray-800/80 rounded-full flex flex-col items-center cursor-pointer temperature-slider shadow-inner border border-gray-700/50"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    setPrecisionMode(percentage);
                  }}
                >
                  <div
                    className="absolute bottom-0 rounded-full bg-gradient-to-t from-indigo-600 to-blue-500 w-full slider-track shadow-sm"
                    style={{
                      height: `${precisionMode * 100}%`
                    }}
                  />
                  <div
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[9px] font-bold text-gray-900 shadow-lg border border-gray-200 slider-thumb"
                    style={{
                      bottom: `calc(${precisionMode * 100}% - 10px)`
                    }}
                  >
                    {precisionMode.toFixed(1)}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-400 text-center slider-label font-medium">
                  Precision
                </div>
              </div>
            </div>

            {/* Back button at the bottom */}
            <button
              onClick={() => setActiveSidebarPanel('controls')}
              className="mt-4 flex items-center justify-center px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-500 text-gray-300 hover:text-white transition-all duration-300 text-xs shadow-md"
            >
              <svg className="w-3 h-3 mr-1.5 transition-transform duration-300 group-hover:translate-x-[-2px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>
          </div>
        )}
      </div>
      )}
      </div>

    </>
  );
}