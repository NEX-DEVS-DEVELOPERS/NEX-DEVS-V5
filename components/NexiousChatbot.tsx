'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Send, X, Minimize2, Bot, Code, Phone, ShoppingCart, Zap, Pause } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { initializeChatbotAnimations, animateOpenChat, animateCloseChat, animateMinimize, animateMaximize, animateChatButton, chatbotStyles } from '@/lib/gsap-chatbot';

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
  AIModelSettings,
  FallbackModelConfig
} from '@/utils/nexiousAISettings';

// Import NLP and conversation memory systems for human-like responses
import nlpProcessor, { generateNLPContext, humanizeResponse, addHumanTouches } from '@/utils/nlpProcessor';
import conversationMemory, { generateUserID, updateUserProfile, generateConversationContext, generateContextualGreeting, generateContextualReferences } from '@/utils/conversationMemory';
import responseTraining, { generateContextualResponse, trainingExamples } from '@/utils/responseTraining';

// Import performance monitoring for smooth 60fps experience
import performanceMonitor, { PerformanceMetrics } from '@/utils/performanceMonitor';

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
  size: 5,
  members: [
    { name: "Ali Hasnaat", role: "Fullstack Developer & Team Lead" },
    { name: "EMAN-ALI", role: "UI/UX Designer" },
    { name: "ANNS-BASHIR", role: "AI AGENT DEVELOPER (N8N.MAKE.COM etc)" },
    { name: "MUDASSIR-AHMAD", role: "Ai workflows for bussiness" },
    { name: "USMAN-AFTAB", role: "AI databse (vector database expert) & DevOps" }
  ],
  founded: "2018",
  projects: "50+"
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
    description: "Team Assistant",
    gradientFrom: "from-blue-800",
    gradientTo: "to-indigo-900",
    systemPromptAddition: "You are currently on the About page. Focus on our team information, founding story, and company values. Highlight our experience and expertise.",
  },
  contact: {
    icon: <Bot size={18} className="text-white" />,
    title: "Contact",
    description: "Support Assistant",
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
    description: "AI Assistant",
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
      content: 'Welcome to Nexious PRO Mode. How can I help you?',
      timestamp: Date.now()
    };
  }

  // More concise greetings for standard mode
  const standardGreetings = [
    "How may I assist you?",
    "What would you like to know?",
    "How can I help you today?",
    "I'm here to help. What do you need?",
    "How can I assist you with your project?"
  ];

  return {
    role: 'assistant',
    content: standardGreetings[Math.floor(Math.random() * standardGreetings.length)],
    timestamp: Date.now()
  };
};

// Add after the createInitialMessage function to restore missing code

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
  
  // Initialize state from localStorage or default to closed
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('nexious-chat-open') === 'true';
    }
    return false;
  });
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showPromo, setShowPromo] = useState(true); // State to control promotional area visibility
  const [showMobilePopup, setShowMobilePopup] = useState(false); // Add state for mobile popup
  
  // Add new states for adjustable chat size, text size, and PRO mode
  const [chatSize, setChatSize] = useState({ width: 380, height: 520 }); // Increased size for better mobile experience
  const [isResizing, setIsResizing] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState(''); // Track current section of the page
  const [isFullscreen, setIsFullscreen] = useState(false); // For mobile fullscreen mode
  const [minimizedPosition, setMinimizedPosition] = useState({ left: '1.25rem', bottom: '1.25rem' }); // Track minimized position
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
  // Add state for Pro Mode maintenance popup
  const [showProMaintenancePopup, setShowProMaintenancePopup] = useState(false);
  // Add state for countdown timer
  const [proModeCountdown, setProModeCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  // Add state for Standard Mode request count (for real-time updates)
  const [standardRequestCount, setStandardRequestCount] = useState(0);

  // AI Model Info Panel State
  const [showAIModelInfo, setShowAIModelInfo] = useState(true); // Show by default for visibility

  // Auto-scroll functionality state
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true); // Auto-scroll enabled by default

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
  
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Add more AI model parameter states
  const [topP, setTopP] = useState(isProMode ? 0.7 : 0.8);
  const [maxTokens, setMaxTokens] = useState(isProMode ? 700 : 1024);
  const [presencePenalty, setPresencePenalty] = useState(0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0);
  
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
  const [showFallbackNotification, setShowFallbackNotification] = useState(false);
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

  // New state variables for streaming functionality with performance optimization
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingText, setThinkingText] = useState('');
  const [streamedMessageId, setStreamedMessageId] = useState<string | null>(null);

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
  
  // Standard Mode Cooldown Timer
  const [showCooldownTimer, setShowCooldownTimer] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<{hours: number, minutes: number, seconds: number}>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
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

  // Simulate thinking animation
  const simulateThinking = async () => {
    setIsThinking(true);
    setThinkingText('');
    
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
    
    // Get the thinking time from the appropriate mode settings
    const settings = getModelSettings(isProMode);
    const thinkingTime = settings.thinkingTime;
    
    // Updated thinking animation with new phrases
    await new Promise(resolve => {
      const thinkingPhrases = isProMode ?
        ['Thinking...', 'Looking for content...', 'Analyzing content...' ,'searching for details...'] :
        ['Thinking...', 'Looking for content...', 'Analyzing content...'];

      let index = 0;
      const interval = setInterval(() => {
        if (index < thinkingPhrases.length) {
          setThinkingText(thinkingPhrases[index]);
          index++;
        } else {
          clearInterval(interval);
          resolve(true);
        }
      }, 0); // No delay between phrases

      // Auto-resolve immediately
      setTimeout(() => {
        clearInterval(interval);
        resolve(true);
      }, 0);
    });
    
    setIsThinking(false);
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

  // Detect mobile devices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);

        // Reset fullscreen mode if device is no longer mobile
        if (window.innerWidth >= 768 && isFullscreen) {
          setIsFullscreen(false);
        }
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [isFullscreen]);

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
  
  // Update chat open state in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CHAT_IS_OPEN_KEY, isOpen ? 'true' : 'false');
      
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

  // Optimized scroll to bottom function with performance optimization and auto-scroll control
  const scrollToBottom = useCallback(() => {
    // Only scroll if auto-scroll is enabled
    if (messagesEndRef.current && isOpen && autoScrollEnabled) {
      // Use requestAnimationFrame for smooth scrolling
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
  }, [isOpen, autoScrollEnabled]);

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

  // Optimized scroll handler with performance monitoring
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    performanceMonitor.markScrollStart();
    setIsScrolling(true);

    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }

    const timeout = setTimeout(() => {
      setIsScrolling(false);
      performanceMonitor.markScrollEnd();
    }, 150);

    setScrollTimeout(timeout);
  }, [scrollTimeout]);

  // Optimized streaming text renderer with performance monitoring
  const renderStreamingText = useCallback((text: string, targetElement: HTMLElement | null) => {
    if (!targetElement || !text) return;

    performanceMonitor.markRenderStart();

    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime;

    // Throttle rendering to 60fps for smooth performance
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

    // Use textContent for better performance than innerHTML when possible
    if (targetElement.textContent !== text) {
      targetElement.textContent = text;
    }

    setLastRenderTime(currentTime);
    performanceMonitor.markRenderEnd();

    // Smooth scroll to bottom during streaming - only if auto-scroll is enabled
    if (!isScrolling && messagesEndRef.current && autoScrollEnabled) {
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

  // Optimized scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesContainerRef.current && preserveScrollPosition) {
      // Save current scroll position before navigating between chats
      setLastScrollPosition(messagesContainerRef.current.scrollTop);
    } else if (!isScrolling && !preserveScrollPosition) {
      // Only auto-scroll if we're not preserving position and not actively scrolling
      scrollToBottom();
    } else if (messagesContainerRef.current && preserveScrollPosition && lastScrollPosition > 0) {
      // Restore previous scroll position when switching between chats
      messagesContainerRef.current.scrollTop = lastScrollPosition;
    }
  }, [messages, typingEffect, currentTypingMessage, isOpen, scrollToBottom, isScrolling, preserveScrollPosition, lastScrollPosition]);

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
      }, 20); // Faster typing for better performance
      
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
    setIsThinking(true);
    setThinkingText('thinking');

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

            // Show fallback notification to user
            if (getFallbackNotificationSettings().enabled) {
              setShowFallbackNotification(true);
              setTimeout(() => setShowFallbackNotification(false), 3000);
            }

            // Try each fallback model in priority order
            for (let i = 0; i < fallbackModels.length && i < 3; i++) {
              const fallbackModel = fallbackModels[i];
              setCurrentFallbackModel(fallbackModel);
              setFallbackAttempts(i + 1);

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
                    
                    // Format the accumulated response
                    const formattedResponse = processStreamedText(accumulatedResponse);
                    
                    // Update the streamed response
                    setStreamedResponse(formattedResponse);
                    
                    // Update the message in the messages array with optimized rendering
                    setMessages(prev => prev.map(msg =>
                      msg.id === messageId ? { ...msg, content: formattedResponse } : msg
                    ));

                    // Optimized smooth scroll to latest message - only if auto-scroll is enabled
                    if (!isScrolling && messagesEndRef.current && !preserveScrollPosition && autoScrollEnabled) {
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
    }
  };

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
    // Instant popup for mobile users with optimized check
    if (isMobileDevice) {
      setShowMobilePopup(true);
      return;
    }
    
    const newState = !isOpen;
    
    if (newState) {
      // If we're opening, check if we need to reset the chat
      if (typeof window !== 'undefined' && localStorage.getItem(CHAT_IS_OPEN_KEY) !== 'true') {
        resetChat();
      }
      
      // Use GSAP for opening animation
      if (chatWindowRef.current) {
        animateOpenChat(chatWindowRef.current);
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
      
      // Prevent scrolling when opening on mobile (only if fullscreen or not minimized)
      if (typeof document !== 'undefined' && isMobile && !isMinimized) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('chat-open');
        // Add touch optimization
        document.body.style.touchAction = 'none';
      }
    } else {
      // If we're closing the chat, mark it as closed in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(CHAT_IS_OPEN_KEY, 'false');
      }
      
      // Use GSAP for closing animation
      if (chatWindowRef.current) {
        animateCloseChat(chatWindowRef.current);
      }
      
      // Reset fullscreen mode when closing chat
      if (isFullscreen) {
        setIsFullscreen(false);
      }
      
      // Always enable body scrolling when chat is closed
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
        document.body.classList.remove('chat-open');
      }
      
      // Make sure sidebar is closed when chat is closed
      if (showSidebar) {
        setShowSidebar(false);
      }
    }
    
    // Update state
    setIsOpen(newState);
    setIsMinimized(false);
    setHasNewMessages(false);
    
    // Store the chat state in localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('nexious-chat-open', newState.toString());
    }
  };

  // Updated toggleMinimize function to use GSAP animations
  const toggleMinimize = () => {
    const willBeMinimized = !isMinimized;
    
    // Save the current position for reopening when minimizing
    if (!isMinimized) {
      // Calculate and store current position
      const posLeft = isMobile ? '1.25rem' : '1.25rem'; 
      const posBottom = isMobile ? '1.25rem' : '1.25rem';
      setMinimizedPosition({ left: posLeft, bottom: posBottom });
      
      // Use GSAP for minimizing animation
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
      
      // Explicitly enable scrolling when minimizing
      if (typeof document !== 'undefined' && isMobile) {
        document.body.style.overflow = '';
        document.body.classList.remove('chat-open');
        document.body.style.touchAction = 'auto'; // Enable touch actions
      }
      
      // Remember sidebar state before minimizing
      if (showSidebar) {
        setShowSidebar(false);
        localStorage.setItem('nexious-sidebar-was-open', 'true');
      }
    } else {
      // Use GSAP for maximizing animation
      const minimizedElement = document.querySelector('.nexious-minimized-chat') as HTMLElement;
      const fullElement = chatWindowRef.current;
      if (minimizedElement && fullElement) {
        animateMaximize(minimizedElement, fullElement);
      }
      
      // When maximizing, prevent scrolling on mobile
      if (typeof document !== 'undefined' && isMobile) {
        document.body.style.overflow = 'hidden';
        document.body.classList.add('chat-open');
        document.body.style.touchAction = 'none'; // Disable touch actions to prevent background scrolling
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
    // Don't open sidebar when minimized
    if (isMinimized && !showSidebar) return;

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
        
      // Only process these if needed (performance optimization)
      if (content.includes('`') && !content.includes('```')) {
        // Inline code - more efficient regex
        content = content.replace(/`([^`]+)`/g, '<code class="bg-gray-800 px-2 py-0.5 rounded-full text-gray-200 border border-gray-700/30" style="font-family: monospace; font-size: 0.9em;">$1</code>');
      }
      
      // Markdown only if these characters are present (optimize performance)
      if (content.includes('**')) {
        // Bold
        content = content.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-100">$1</strong>');
      }
      
      if (content.includes('*') && !content.includes('**')) {
        // Italic - only process if there's a single asterisk but not double
        content = content.replace(/\*([^*]+)\*/g, '<em class="text-gray-300 italic">$1</em>');
      }
      
      if (content.includes('#')) {
        // Headers - only process if there are headers
        content = content
        .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold my-2 text-gray-100">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold my-2.5 text-gray-100">$1</h2>')
          .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold my-3 text-gray-100">$1</h1>');
      }
      
      if (content.includes('-') || content.includes('*')) {
        // Lists - unordered - only process if there are list markers
        content = content.replace(/^\s*[-*] (.*$)/gm, '<div class="flex my-1"><span class="mr-2 text-gray-400">•</span><span>$1</span></div>');
      }
      
      if (/^\s*\d+\./.test(content)) {
        // Lists - ordered - only process if there are numbered lists
        content = content.replace(/^\s*(\d+)\. (.*$)/gm, '<div class="flex my-1"><span class="mr-2 text-gray-400 min-w-[20px]">$1.</span><span>$2</span></div>');
      }
      
      if (content.includes('[') && content.includes(']') && content.includes('(') && content.includes(')')) {
        // Links - only process if there are potential links
        content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer">$1</a>');
      }
    }
    
    // Basic linebreak conversion for all modes
    return content.replace(/\n/g, '<br>');
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
    
    if (isFullscreen) {
      return {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 9999,
        borderRadius: 0,
        width: '100%',
        height: '100%',
        maxWidth: 'none',
        maxHeight: 'none'
      };
    }
    
    return {
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      maxWidth: '100%',
      zIndex: 1050
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

  // Detect mobile devices and handle orientation changes
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
      };
      
      checkMobile();
      window.addEventListener('resize', checkMobile);
      
      return () => {
        window.removeEventListener('resize', checkMobile);
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

  // Add a new function to pause/resume the AI response generation
  const toggleResponsePause = () => {
    // This function acts as an alternative stop button with different styling
    if (responseController) {
      console.log('Pausing AI response generation');
      responseController.abort();
      setResponseController(null);
      
      // Immediately reset all streaming and thinking states
      setIsStreaming(false);
      setIsThinking(false);
      setIsLoading(false);
      
      // Add a message indicating the response was paused
      setMessages(prev => {
        // Check if the last message is from the assistant
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          // Always append a new message for better UX
          return [...prev, { 
            role: 'assistant', 
            content: "I paused my response. Let me know if you want me to continue or try a different approach.",
            timestamp: Date.now()
          }];
        } else {
          // Fallback case - should rarely happen
          return [...prev, { 
            role: 'assistant', 
            content: "Response paused. How would you like to proceed?",
            timestamp: Date.now()
          }];
        }
      });
      
      // Reset streamedMessageId to ensure no message is still in streaming state
      setStreamedMessageId(null);
      
      // Focus the input field with a small delay to ensure UI has updated
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    } else {
      // Even if no controller, ensure states are reset
      console.log('No active response to pause, resetting states');
      setIsStreaming(false);
      setIsThinking(false);
      setIsLoading(false);
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

    console.log(`Temperature changed to: ${newTemperature} (${newTemperature < 0.3 ? 'Precise' : newTemperature > 0.7 ? 'Creative' : 'Balanced'})`);

    // Store preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexious-temperature', newTemperature.toString());
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

  // Initialize chatbot animations when the component mounts
  useEffect(() => {
    const chatbotContainer = document.getElementById('nexious-chat-container');
    if (chatbotContainer) {
      initializeChatbotAnimations(chatbotContainer);
    }
    
    // Add GSAP styles to document head
    if (typeof document !== 'undefined') {
      const styleElement = document.createElement('style');
      styleElement.textContent = chatbotStyles;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, []);
  
  return (
    <>
      {/* Background blur overlay when chatbot is open */}
      {isOpen && !isMinimized && (
        <div 
          className="fixed inset-0 z-[998] pointer-events-none"
          style={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            transition: 'all 0.3s ease-in-out'
          }}
        />
      )}
      
      <div ref={chatWindowRef} id="nexious-chat-container" className="nexious-chat-container" style={{ maxHeight: isMobile ? '100vh' : 'calc(100vh - 80px)' }}>
      
      {/* Chat Button - Visible when chat is not open */}
      {!isOpen && (
        <button 
          onClick={toggleChat}
          className="group cursor-pointer px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-black/40"
          aria-label="Open AI Chat Assistant"
        >
          <span 
            className="text-sm font-semibold text-white/90" 
            style={{ textShadow: '0 0 8px rgba(255,255,255,0.3)' }}
          >
            Chat with Nexious
          </span>
        </button>
      )}

      {/* AI Model Info Section - Desktop Only */}
      {!isMobile && isOpen && !isMinimized && (
        <div
          className="fixed z-[998] ai-model-info-section transition-all duration-500 ease-out"
          style={{
            left: 'calc(100% + 90px)', // 90px spacing from chatbot container
            top: '50%',
            transform: 'translateY(-50%)',
            width: '340px',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        >
          {/* Main Info Panel */}
          <div
            className="relative rounded-2xl shadow-2xl border border-purple-500/30 p-6 text-white transform-gpu overflow-hidden animate-in slide-in-from-right-4 duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.92) 0%, rgba(31, 41, 55, 0.95) 50%, rgba(17, 24, 39, 0.92) 100%)',
              backdropFilter: 'blur(24px) saturate(150%)',
              WebkitBackdropFilter: 'blur(24px) saturate(150%)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Enhanced Glassmorphism Layers */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-white/8 via-white/4 to-transparent opacity-70"
              style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/6 via-blue-500/6 to-purple-500/6 opacity-90"
              style={{
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/2 to-transparent animate-pulse opacity-50" />

            {/* Content Container */}
            <div className="relative z-10">
              {/* Header with Icon */}
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-blue-600 to-purple-700 flex items-center justify-center mr-4 shadow-lg border border-purple-400/30">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    <path d="M19 11L19.74 13.74L22.5 14.5L19.74 15.26L19 18L18.26 15.26L15.5 14.5L18.26 13.74L19 11Z" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.6"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-300 tracking-wide">AI Model Info <span className="text-sm text-gray-400 ml-2">Independent Agency</span></h3>
                  <p className="text-xs text-gray-400 mt-0.5">Transparent Technology</p>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4 text-sm leading-relaxed">
                {/* Independent Agency Section */}
                <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/25 rounded-xl p-4 backdrop-blur-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-purple-200 font-medium mb-1">Independent Innovation</p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        We're an independent development agency led by a passionate 19-year-old entrepreneur,
                        building cutting-edge solutions with determination and innovation.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technology Stack Section */}
                <div>
                  <p className="text-gray-200 mb-3">
                    <span className="text-blue-300 font-semibold">Nexious</span> leverages advanced AI models from
                    <span className="text-purple-300 font-semibold"> OpenRouter</span>,
                    <span className="text-blue-300 font-semibold"> Hugging Face</span>, and
                   <span className="text-green-300 font-semibold"> Google</span> to deliver intelligent responses.
                  </p>

                  <div className="bg-blue-900/25 border border-blue-500/25 rounded-xl p-3 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-blue-300 font-medium text-xs">Advanced Fallback System</span>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      Our intelligent fallback system ensures seamless conversations by automatically switching
                      between models for optimal performance and reliability.
                    </p>
                  </div>
                </div>

                {/* Transparency Section */}
                <div className="bg-orange-900/20 border border-orange-500/25 rounded-xl p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-4 h-4 text-orange-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-orange-300 font-medium text-xs">Honest Communication</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Any response delays are due to free model limitations, not our system.
                    We're actively pursuing premium partnerships with Claude and OpenAI for enhanced performance.
                  </p>
                </div>

                {/* Gratitude Section */}
                <div className="pt-3 border-t border-gray-700/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61C19.5 3.28 17.45 3.28 16.11 4.61L12 8.69L7.89 4.61C6.55 3.28 4.5 3.28 3.16 4.61C1.82 5.95 1.82 8 3.16 9.34L12 18.16L20.84 9.34C22.18 8 22.18 5.95 20.84 4.61Z" fill="currentColor"/>
                      </svg>
                      <span className="text-pink-300 font-medium text-xs">Thank You</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <span className="text-green-400 text-xs font-semibold">Active</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed mt-2">
                    Your patience and support fuel our journey toward building exceptional AI experiences.
                    Together, we're shaping the future of intelligent assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Model Info Section - Enhanced with White Frosted Glass & Connecting Lines */}
      {isOpen && !isMinimized && !isMobile && showAIModelInfo && (
        <div
          className="fixed z-[998] ai-model-info-panel transition-all duration-300 ease-out"
          style={{
            left: `calc(${isMobile ? '100%' : (isProMode ? '520px' : `${Math.max(chatSize.width, 460)}px`)} + 90px)`, // 90px spacing from chat
            top: `calc(50% + 40px)`, // Position slightly lower than chatbot center
            transform: 'translateY(-50%)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        >
          {/* Slim Information Panel with Dark Transparent Frosted Glass */}
          <div
            className="relative rounded-xl shadow-xl border border-purple-400/30 p-3 text-white transform-gpu overflow-hidden animate-in slide-in-from-right-4 duration-500"
            style={{
              width: '260px', // Made slimmer
              height: `${(isMobile ? 520 : (isProMode ? 680 : chatSize.height + 80)) * 0.75}px`, // Reduced height to 75%
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0.4) 100%)', // Dark transparent
              backdropFilter: 'blur(24px) saturate(120%)',
              WebkitBackdropFilter: 'blur(24px) saturate(120%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              willChange: 'transform',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Enhanced Dark Frosted Glass Background */}
            <div
              className="absolute inset-0 bg-gradient-to-br from-black/20 via-gray-900/30 to-black/20 opacity-80"
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-900/10 to-transparent animate-pulse opacity-30" />



            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Close button - Enhanced for better visibility and functionality */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('AI Model Info close button clicked');
                  setShowAIModelInfo(false);
                }}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600/80 hover:bg-red-500 flex items-center justify-center transition-all duration-200 group border border-red-400/50 shadow-lg hover:shadow-xl z-20 cursor-pointer"
                aria-label="Close AI Model Info panel"
                title="Close AI Model Info"
                style={{
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <svg className="w-4 h-4 text-white group-hover:text-red-100 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Compact Header */}
              <div className="flex items-center mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mr-2.5 shadow-md border border-purple-400/40">
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    <path d="M19 11L19.74 13.74L22.5 14.5L19.74 15.26L19 18L18.26 15.26L15.5 14.5L18.26 13.74L19 11Z" fill="currentColor"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">AI Model Info</h3>
                  <p className="text-xs text-gray-300/80">Independent Agency</p>
                </div>
              </div>

              {/* Compact Content - Scrollable */}
              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139, 92, 246, 0.3) transparent' }}>
                {/* Agency Description */}
                <div className="bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-lg p-2.5 border border-gray-600/30">
                  <p className="text-gray-100 leading-relaxed">
                    We're an <span className="text-white font-medium">independent development agency</span> led by a passionate{' '}
                    <span className="text-gray-200 font-medium">19-year-old entrepreneur</span>, building AI-powered solutions.
                  </p>
                </div>

                {/* AI System Features */}
                <div className="bg-gradient-to-r from-gray-700/30 to-gray-800/30 rounded-lg p-2.5 border border-gray-600/30">
                  <p className="text-gray-100 leading-relaxed">
                    Our AI system leverages <span className="text-white font-medium">free models</span> from OpenRouter, HuggingFace, and Google
                    with an <span className="text-gray-200 font-medium">advanced fallback system</span> ensuring seamless experiences.
                  </p>
                </div>

                {/* Advanced Fallback System */}
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-600/30 rounded-lg p-2.5 border border-gray-600/30">
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white mb-1">Advanced Fallback System</h4>
                  <p className="text-gray-300 text-xs leading-relaxed">
                    Any response delays are due to free model limitations. Our intelligent routing ensures optimal performance.
                  </p>
                      <p className="text-gray-300 leading-relaxed">
                        Any response delays are due to free model limitations.
                        Our intelligent routing ensures optimal performance.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Partnerships */}
                <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg p-2.5 border border-gray-600/30">
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white mb-1">Premium Partnerships</h4>
                      <p className="text-gray-300 leading-relaxed">
                        We're actively in discussions with <span className="text-white font-medium">Claude</span> and{' '}
                        <span className="text-white font-medium">OpenAI</span> for premium partnerships.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thank You Message */}
                <div className="bg-gradient-to-br from-gray-600/30 to-gray-800/30 rounded-lg p-2.5 border border-gray-600/30">
                  <div className="flex items-start">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61A5.5 5.5 0 0 0 15.5 3H12V21L15.5 18.5C18.14 18.5 20.84 16.36 20.84 13.39V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.16 4.61A5.5 5.5 0 0 1 8.5 3H12V21L8.5 18.5C5.86 18.5 3.16 16.36 3.16 13.39V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white mb-1">Thank You</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Your patience and support fuel our journey toward building exceptional
                        AI experiences. <span className="text-white font-medium">Together, we're shaping the future.</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-gray-600/30">
                  <span className="text-gray-400 text-xs font-medium">Powered by NEX-DEVS</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <span className="text-green-400 text-xs font-semibold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Curved Connecting Lines - AI Model Info to Nexious Chatbot */}
      {isOpen && !isMinimized && !isMobile && showAIModelInfo && (
        <svg
          className="fixed z-[995] pointer-events-none"
          style={{
            left: `calc(${isMobile ? '100%' : (isProMode ? '520px' : `${Math.max(chatSize.width, 460)}px`)} + 5px)`,
            top: `calc(50% + 40px)`,
            transform: 'translateY(-50%)',
            width: '85px',
            height: `${(isMobile ? 520 : (isProMode ? 680 : chatSize.height + 80)) * 0.75}px`,
            willChange: 'transform, opacity'
          }}
        >
          {/* Top connecting line - from middle of AI Model Info to top middle of chatbot header */}
          <path
            d="M 0 80 Q 20 60 45 40 Q 65 20 85 0"
            stroke="url(#topLineGradientEnhanced)"
            strokeWidth="2"
            fill="none"
            className="animate-draw-line-top-enhanced"
            style={{
              strokeDasharray: '140',
              strokeDashoffset: '140',
              filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 16px rgba(139, 92, 246, 0.4))',
              opacity: 0,
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            }}
          />

          {/* Bottom connecting line - from bottom middle of AI Model Info to middle bottom of chatbot footer */}
          <path
            d={`M 0 ${(isMobile ? 520 : (isProMode ? 680 : chatSize.height + 80)) * 0.75 - 80} Q 25 ${(isMobile ? 520 : (isProMode ? 680 : chatSize.height + 80)) * 0.75 - 60} 50 ${(isMobile ? 520 : (isProMode ? 680 : chatSize.height + 80)) * 0.75 - 40} Q 70 ${(isMobile ? 520 : (isProMode ? 680 : chatSize.height + 80)) * 0.75 - 20} 85 ${(isMobile ? 520 : (isProMode ? 680 : chatSize.height + 80)) * 0.75}`}
            stroke="url(#bottomLineGradientEnhanced)"
            strokeWidth="2.5"
            fill="none"
            className="animate-draw-line-bottom-enhanced"
            style={{
              strokeDasharray: '160',
              strokeDashoffset: '160',
              filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
              opacity: 0,
              strokeLinecap: 'round',
              strokeLinejoin: 'round'
            }}
          />

          {/* Enhanced Gradient definitions with purple/blue theme */}
          <defs>
            <linearGradient id="topLineGradientEnhanced" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.9)" />
              <stop offset="50%" stopColor="rgba(147, 51, 234, 0.8)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0.7)" />
            </linearGradient>
            <linearGradient id="bottomLineGradientEnhanced" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.9)" />
              <stop offset="50%" stopColor="rgba(37, 99, 235, 0.8)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.7)" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Mobile overlay when chat is open and fullscreen */}
      {isMobile && isOpen && isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1000]" 
          onClick={toggleChat} 
          style={{
            opacity: showSidebar ? 0.8 : 0.7,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Mobile backdrop for sidebar - improved touch handling */}
      {isMobile && isOpen && showSidebar && (
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]" onClick={() => setShowProMaintenancePopup(false)} />

          <div className="fixed z-[9999] pro-maintenance-popup" style={{
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

      {/* Advanced Fallback System Notification */}
      {showFallbackNotification && (
        <div className="fixed z-[9999] fallback-notification" style={{
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isMobile ? 'calc(100% - 40px)' : '400px',
          maxWidth: isMobile ? '320px' : '400px'
        }}>
          <div className="bg-gradient-to-r from-blue-900/95 to-purple-900/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-blue-500/40 relative animate-in slide-in-from-top-4 duration-300">
            {/* Notification header */}
            <div className={`${isMobile ? 'p-3' : 'p-4'} text-white`}>
              <h4 className={`font-semibold text-blue-300 ${isMobile ? 'mb-2' : 'mb-3'} flex items-center ${isMobile ? 'text-sm' : 'text-base'}`}>
                <svg className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                AI Model Switched
              </h4>

              <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-200 leading-relaxed ${isMobile ? 'mb-2' : 'mb-3'}`}>
                {fallbackNotificationMessage}
              </div>

              {currentFallbackModel && (
                <div className={`bg-blue-900/30 border border-blue-700/30 rounded-xl ${isMobile ? 'p-2' : 'p-3'}`}>
                  <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-blue-300 ${isMobile ? 'mb-1' : 'mb-1'} font-medium`}>
                    Now using: {currentFallbackModel.description}
                  </div>
                  <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-300`}>
                    Priority: {currentFallbackModel.priority} | Attempt: {fallbackAttempts}
                  </div>
                </div>
              )}
            </div>

            {/* Notification footer */}
            <div className={`bg-gray-800/80 ${isMobile ? 'p-2' : 'p-3'} flex justify-between items-center`}>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-400`}>
                <span className="text-blue-300">Enhanced</span> performance active
              </div>
              <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-blue-300 font-medium`}>
                Auto-dismiss in 3s
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRO Features Popup - Fixed z-index and optimized for mobile */}
      {showProFeaturesPopup && isProMode && (
        <div className="fixed z-[9999] pro-features-popup" style={{
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
                      <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 3 12 3C17.5228 3 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      )}
      
      {/* Chat Label - only shown when chat is closed */}
      {!isOpen && (
        <div 
          className={`absolute ${isMobile ? '-top-14 left-0 ml-0.5' : '-top-14 left-1'} rounded-full shadow-xl flex items-center justify-center overflow-hidden material-shadow`}
          style={{
            background: `linear-gradient(135deg, ${pageContext.gradientFrom.replace('from-', '')} 0%, ${pageContext.gradientTo.replace('to-', '')} 100%)`,
            padding: '8px 20px',
            height: isMobile ? '32px' : '36px',
            zIndex: 55,
            maxWidth: isMobile ? '160px' : '190px',
            animation: 'float-gentle 3s ease-in-out infinite, appear 0.5s ease-out',
          }}
        >
          {/* Material design glass effect */}
          <div 
            className="absolute inset-0 backdrop-blur-sm rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
              animation: 'pulse-subtle 3s ease-in-out infinite'
            }}
          ></div>
          
          {/* Enhanced glow effect */}
          <div className="absolute inset-0 opacity-60 animate-glow-pulse rounded-full" style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.6), transparent 70%)'
          }}></div>
          
          {/* Material design shine animation */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute top-0 -left-[100%] h-full w-[40%] bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-[15deg] animate-material-shine"></div>
          </div>
          
          {/* Text content with enhanced styling */}
          <div className="flex items-center justify-center relative z-10 w-full">
            <span 
              className={`font-medium text-white ${isMobile ? 'text-[10px]' : 'text-sm'} tracking-wide whitespace-nowrap text-center`} 
              style={{
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)',
                letterSpacing: '0.05em',
              }}
            >
              Chat with Nexious
            </span>
          </div>
        </div>
      )}
      
      {/* Chat bubble button for closed state */}
      {!isOpen && (
        <div className="flex items-center gap-2">
          {/* PRO mode toggle button for closed state - Enhanced for mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleProMode();
            }}
            onTouchStart={(e) => {
              // Enhanced mobile touch feedback
              e.currentTarget.style.transform = 'scale(0.92)';
              if (navigator.vibrate) {
                navigator.vibrate(30);
              }
            }}
            onTouchEnd={(e) => {
              setTimeout(() => {
                e.currentTarget.style.transform = 'scale(1)';
              }, 150);
            }}
            className={`flex items-center justify-center ${isMobile ? 'w-6 h-6' : 'w-14 h-14'} ${isMobile ? 'rounded-full' : 'rounded-full'} ${isProMode ? 'bg-gradient-to-br from-blue-600 to-blue-800' : 'bg-gradient-to-br from-gray-700 to-gray-900'} text-white material-shadow hover:scale-105 transition-all duration-300 relative overflow-hidden ${isMobile ? 'touch-manipulation' : ''}`}
            aria-label={isProMode ? "Disable PRO mode" : "Enable PRO mode"}
            title={isProMode ? "Disable PRO mode" : "Enable PRO mode"}
            style={isMobile ? {
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              minHeight: '24px',
              minWidth: '24px',
              borderRadius: '999px',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
            } : {}}
          >
            {/* Material design ripple effect */}
            <div className="absolute inset-0 bg-white/10 rounded-full material-ripple-circle"></div>

            <Zap size={isMobile ? 14 : 24} className={`${isProMode ? 'text-white animate-pulse' : 'text-gray-200'} relative z-10`} />
            {isProMode && (
              <span className={`absolute -top-1 -right-1 ${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-purple-500 border border-purple-700 rounded-full animate-pulse`}></span>
            )}
          </button>
          
          {/* Plain chat button - Smaller size */}
          <button
            onClick={toggleChat}
            onTouchStart={(e) => {
              if (navigator.vibrate) {
                navigator.vibrate(20);
              }
            }}
            className={`flex items-center justify-center ${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700 transition-all duration-200 relative overflow-hidden ${isMobile ? 'touch-manipulation' : ''}`}
            aria-label="Open chat"
            style={{
              ...(isMobile ? {
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
                minHeight: '40px',
                minWidth: '40px'
              } : {})
            }}
          >
            {/* Material design ripple effect */}
            <div className="absolute inset-0 bg-white/10 rounded-full material-ripple-circle"></div>

            <div className="relative flex items-center justify-center">
              {hasNewMessages && !isChatbotDisabled && (
                <div className={`absolute -top-2 -right-2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'} rounded-full bg-red-500 border border-red-700 animate-pulse`}></div>
              )}
              {!hasNewMessages && !isChatbotDisabled && (
                <div className={`absolute -top-2 -right-2 ${isMobile ? 'w-3 h-3' : 'w-3.5 h-3.5'} rounded-full bg-green-400 material-glow`}></div>
              )}
              {isChatbotDisabled && (
                <div className={`absolute -top-2 -right-2 ${isMobile ? 'w-4 h-4' : 'w-4 h-4'} rounded-full bg-red-500 border border-red-700 animate-pulse`}></div>
              )}
              
              {/* Dynamic AI Chat Icon based on page context - Enhanced for mobile */}
              <div className={`${isMobile ? 'w-10 h-10' : 'w-11 h-11'} flex items-center justify-center relative`}>
                {isChatbotDisabled ? (
                  <svg className={`${isMobile ? 'w-7 h-7' : 'w-7 h-7'} text-white z-10`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : pathname?.includes('contact') ? (
                  <svg className={`${isMobile ? 'w-7 h-7' : 'w-7 h-7'} text-white z-10`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 20V19C5 15.6863 7.68629 13 11 13H13C16.3137 13 19 15.6863 19 19V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : pathname?.includes('pricing') ? (
                  <svg className={`${isMobile ? 'w-7 h-7' : 'w-7 h-7'} text-white z-10`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 8.00003L8.00003 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 7.99997C12.5523 7.99997 13 7.55226 13 6.99997C13 6.44769 12.5523 5.99997 12 5.99997C11.4477 5.99997 11 6.44769 11 6.99997C11 7.55226 11.4477 7.99997 12 7.99997Z" fill="currentColor"/>
                    <path d="M12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18Z" fill="currentColor"/>
                  </svg>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Material design AI brain animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`${isMobile ? 'w-6 h-6' : 'w-6 h-6'} bg-purple-400/20 rounded-full animate-ping-pulse`}></div>
                    </div>
                    <svg className={`${isMobile ? 'w-7 h-7' : 'w-7 h-7'} text-white z-10`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12C21 12 18 18 12 18C6 18 3 12 3 12C3 12 6 6 12 6C18 6 21 12 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" fillOpacity="0.2"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Minimized Chat Bar - with Material design */}
      {isOpen && isMinimized && (
        <div 
          className="nexious-minimized-chat bg-gray-900/90 backdrop-blur-lg rounded-full shadow-2xl flex items-center cursor-pointer animate-material-slideIn material-shadow"
          onClick={() => setIsMinimized(false)}
          style={{
            position: 'fixed',
            bottom: minimizedPosition.bottom,
            left: minimizedPosition.left,
            width: isMobile ? '190px' : '260px',
            height: isMobile ? '44px' : '54px',
            padding: isMobile ? '0.5rem' : '0.75rem',
            zIndex: 999
          }}
        >
          <div className="flex items-center flex-1 pl-3">
            <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} rounded-full bg-gradient-to-br ${pageContext.gradientFrom} ${pageContext.gradientTo} flex items-center justify-center material-shadow mr-2.5`}>
              <svg className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12C21 12 18 18 12 18C6 18 3 12 3 12C3 12 6 6 12 6C18 6 21 12 21 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor" fillOpacity="0.2"/>
              </svg>
            </div>
            <div className="font-medium text-white">
              <span className={`${isMobile ? 'text-sm' : 'text-base'}`}>Nexious</span>
              <span className={`ml-1.5 ${isMobile ? 'text-2xs' : 'text-xs'} text-gray-400`}>minimized</span>
            </div>
          </div>
          <div className="flex gap-1.5 pr-3">
            {/* Material design PRO mode toggle button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleProMode();
              }}
              className={`flex items-center justify-center ${isMobile ? 'h-6 px-1.5' : 'h-6 px-1.5'} ${isMobile ? 'rounded-md' : 'rounded-full'} transition-all duration-300 ${
                isProModeUnderMaintenance()
                  ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                  : isProMode
                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                    : 'bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white'
              } ${isMobile ? 'text-2xs' : 'text-2xs'} font-medium relative ${isMobile ? 'touch-manipulation' : ''}`}
              title={isProModeUnderMaintenance() ? 'Pro Mode is under maintenance - Click for details' : (isProMode ? 'Disable Pro Mode' : 'Enable Pro Mode')}
              style={isMobile ? {
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              } : {}}
            >
              <Zap size={isMobile ? 9 : 10} className="mr-0.5" />
              {isProModeUnderMaintenance() ? (
                <span className="flex items-center">
                  PRO
                  {shouldShowProModeCountdown() && (
                    <span className="ml-1 text-2xs opacity-80">
                      {proModeCountdown.days}d {proModeCountdown.hours}h
                    </span>
                  )}
                </span>
              ) : (
                'PRO'
              )}
              {isProModeUnderMaintenance() && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
              )}
            </button>
            
            {/* Material design maximize button */}
            <button
              onClick={toggleMinimize}
              className="text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 rounded-full p-1.5 transition-all duration-200 material-button-effect"
              aria-label="Maximize chat"
              title="Maximize chat"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 14H10V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 10H14V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 10L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 21L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Material design close button */}
            <button
              onClick={toggleChat}
              className="text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 rounded-full p-1.5 transition-all duration-200 material-button-effect"
              aria-label="Close chat"
              title="Close chat"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}


      {/* Chat window - Enhanced for mobile */}
      {isOpen && !isMinimized && (
        <div
          ref={chatWindowRef}
          id="chat-window"
          className={`${
            isMobile 
              ? 'fixed inset-0 z-[1000]' 
              : 'relative'
          } bg-gray-950/98 backdrop-blur-xl ${
            isMobile ? 'rounded-none' : 'rounded-3xl'
          } flex flex-col overflow-hidden border border-gray-800/50 shadow-2xl ${
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
            position: isMobile ? 'fixed' : 'relative',
            transition: isMobile ? 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            transform: isMobile ? (isMinimized ? 'translateY(120%)' : 'translateY(0)') : 'none',
            borderRadius: isMobile ? '0' : '24px',
            boxShadow: isMobile ? 'none' : '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >

          {/* Mobile-Optimized Compact Header */}
          <div
            className={`flex items-center justify-between ${isMobile ? 'px-2 py-1' : 'px-3 py-1.5'} bg-gray-800/40 ${isMobile && isFullscreen ? '' : (isMobile ? 'rounded-t-2xl' : 'rounded-t-3xl')} ${isProMode ? 'pro-mode-header' : ''}`}
            style={{
              height: isMobile ? '40px' : '52px',
              borderBottom: 'none',
              minHeight: isMobile ? '40px' : '52px'
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
                {/* Mobile-optimized avatar container */}
                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${isMobile ? 'mr-1.5' : 'mr-2'} overflow-hidden relative p-1`}>
                  {/* New AI Logo Image */}
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/5291/5291454.png"
                    alt="Nexious AI Logo"
                    className={`${isMobile ? 'w-3 h-3' : 'w-5 h-5'} object-contain filter brightness-0 invert`}
                    style={{
                      filter: 'brightness(0) invert(1)', // Makes the icon white
                      imageRendering: 'crisp-edges'
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
                    className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-white`}
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

                {/* Mobile-optimized title and subtitle - Larger for mobile */}
                <div className="flex flex-col">
                  <h1 className={`font-bold text-white ${isMobile ? 'text-sm' : 'text-base'} flex items-center tracking-wide`}>
                    <span className="nexious-title-modern nexious-title-animation">
                      NEXIOUS
                    </span>
                    {isProMode && (
                                    <span className="ml-1.5 text-2xs font-medium bg-blue-500 text-white px-1.5 py-0.5 rounded-full flex items-center justify-center" style={{ maxHeight: '16px', fontSize: '8px', lineHeight: '1' }}>
                      PRO
                    </span>
                    )}
                  </h1>
                  <div className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-xs'} font-normal flex items-center mt-0.5`}>
                    <div className="w-1 h-1 rounded-full bg-green-400 mr-1"></div>
                    Active now
                  </div>
                </div>
              </div>

              {/* Control buttons with consistent styling - Organized and optimized */}
              <div className="flex items-center gap-1">
                {/* PRO MODE button */}
                <button
                  onClick={toggleProMode}
                  className={`flex items-center justify-center ${isMobile ? 'h-5 px-1.5 min-w-[32px] text-[9px]' : 'h-6 px-2 text-2xs'} rounded-full transition-all duration-300 ${
                    isProModeUnderMaintenance()
                      ? 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                      : isProMode
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                        : 'bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white'
                  } font-semibold relative ${isMobile ? 'touch-manipulation' : ''}`}
                  title={isProModeUnderMaintenance() ? 'Pro Mode is under maintenance - Click for details' : (isProMode ? 'Disable Pro Mode' : 'Enable Pro Mode')}
                  style={isMobile ? {
                    WebkitTouchCallout: 'none',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    borderRadius: '999px',
                    boxShadow: isProMode ? '0 2px 8px rgba(220, 38, 38, 0.3)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                    fontSize: '9px',
                    lineHeight: '1'
                  } : {}}
                >
                  <Zap size={isMobile ? 8 : 10} className={isMobile ? 'mr-0.5' : 'mr-0.5'} />
                  {isProModeUnderMaintenance() ? (
                    <span className="flex items-center">
                      PRO
                      {shouldShowProModeCountdown() && !isMobile && (
                        <span className="ml-1 text-2xs opacity-80">
                          {proModeCountdown.days}d {proModeCountdown.hours}h
                        </span>
                      )}
                    </span>
                  ) : (
                    'PRO'
                  )}
                  {isProModeUnderMaintenance() && (
                    <span className={`absolute ${isMobile ? '-top-0.5 -right-0.5 w-1 h-1' : '-top-0.5 -right-0.5 w-1.5 h-1.5'} bg-orange-400 rounded-full animate-pulse`}></span>
                  )}
                </button>

                {/* For Desktop: Keep original buttons */}
                {!isMobile && (
                  <>
                    {/* Auto-scroll toggle button */}
                    <button
                      onClick={() => {
                        setAutoScrollEnabled(!autoScrollEnabled);
                        console.log('Auto-scroll toggled:', !autoScrollEnabled);
                      }}
                      className="flex items-center justify-center h-6 px-2 text-2xs rounded-full transition-all duration-300 bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white font-semibold relative"
                      title={`Auto-scroll: ${autoScrollEnabled ? 'Enabled' : 'Disabled'}`}
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {autoScrollEnabled ? (
                          <>
                            <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 6L12 11L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </>
                        ) : (
                          <>
                            <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                            <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                          </>
                        )}
                      </svg>
                    </button>

                    {/* AI Model Info toggle button */}
                    <button
                      onClick={() => setShowAIModelInfo(!showAIModelInfo)}
                      className="flex items-center justify-center h-6 px-2 text-2xs rounded-full transition-all duration-300 bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white font-semibold relative"
                      title="AI Model Info"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                        <path d="M19 11L19.74 13.74L22.5 14.5L19.74 15.26L19 18L18.26 15.26L15.5 14.5L18.26 13.74L19 11Z" fill="currentColor"/>
                      </svg>
                    </button>

                    {/* Sidebar settings toggle button */}
                    <button
                      onClick={toggleSidebar}
                      className="flex items-center justify-center h-6 px-2 text-2xs rounded-full transition-all duration-300 bg-gray-700/60 hover:bg-gray-600/60 text-gray-300 hover:text-white font-semibold relative"
                      title="Settings"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}

                {/* For Mobile: Replace with close, new chat, and minimize buttons */}
                {isMobile && (
                  <>
                    {/* Close button */}
                    <button
                      onClick={toggleChat}
                      className="flex items-center justify-center h-4 w-4 rounded-full bg-red-600 hover:bg-red-700 transition-all duration-300 touch-manipulation"
                      title="Close"
                    >
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* New chat button */}
                    <button
                      onClick={resetChat}
                      className="flex items-center justify-center h-4 w-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 touch-manipulation"
                      title="New Chat"
                    >
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Minimize button */}
                    <button
                      onClick={toggleMinimize}
                      className="flex items-center justify-center h-4 w-4 rounded-full bg-gray-600 hover:bg-gray-700 transition-all duration-300 touch-manipulation"
                      title="Minimize"
                    >
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Status indicators - iPhone style - Smaller */}
          {!isMinimized && (
            <div className="bg-gray-900/40 py-1 px-2 text-xs text-gray-400 flex items-center justify-center border-b border-gray-800/30">
              <div className="flex items-center gap-1 justify-center">
                {/* Standard Mode Request Counter */}
                {!isProMode && (
                  <div className="flex items-center bg-blue-900/30 px-1 py-0.5 rounded-full text-xs">
                    <span className="text-blue-300 font-medium text-2xs">
                      {standardRequestCount}/{getStandardModeConfig().requestLimit} msgs
                    </span>
                  </div>
                )}

                {/* Compact MULTI AI MODELS & Powered by NEX-DEVS PRO in one line */}
                <div className="flex items-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 px-1 py-0.5 rounded-full text-xs border border-purple-500/20">
                  <svg className="w-1.5 h-1.5 text-purple-400 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
                    <path d="M19 11L19.74 13.74L22.5 14.5L19.74 15.26L19 18L18.26 15.26L15.5 14.5L18.26 13.74L19 11Z" fill="currentColor"/>
                  </svg>
                  <span className="text-purple-300 font-medium text-2xs">MULTI AI (10+)</span>
                  <span className="text-gray-500 mx-0.5 text-2xs">•</span>
                  <svg className="w-1.5 h-1.5 text-blue-400 mr-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor"/>
                  </svg>
                  <span className="text-blue-300 font-medium text-2xs">NEX-DEVS PRO</span>
                </div>

                {isProMode && (
                  <div className="flex items-center bg-purple-900/30 px-1 py-0.5 rounded-full text-xs animate-pulse-slow transition-all duration-500">
                    <Zap size={6} className="text-purple-400 mr-0.5 animate-pulse" />
                    <span className="text-purple-300 font-medium text-2xs">PRO</span>
                  </div>
                )}
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
                  background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.1), rgba(17, 24, 39, 0.05))',
                  ...(isMobile ? { padding: '10px' } : {}) // Smaller padding for mobile
                }}
              >
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
                    
                    return (
                      <div
                        key={`${message.id || index}-${message.content.length}`}
                        className={`${isMobile ? 'px-3 py-2' : 'px-4 py-3'} max-w-[90%] ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white ml-auto message-slide-in user-message shadow-lg'
                            : 'bg-gray-800/90 text-gray-100 mr-auto message-slide-in assistant-message border border-gray-700/30'
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
                        {isThinkingMessage ? (
                          // Enhanced AI Robot Thinking Animation
                          <div className="flex items-center min-h-[50px]">
                            <div className="relative w-10 h-10 mr-3 bg-gradient-to-br from-purple-500 via-blue-600 to-purple-700 rounded-xl flex items-center justify-center overflow-hidden border border-purple-400/40 shadow-lg">
                              {/* Animated background glow */}
                              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-500/20 to-purple-600/20 animate-pulse"></div>

                              {/* Professional AI Robot Icon */}
                              <div className="relative w-full h-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white ai-robot-thinking" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  {/* Robot head */}
                                  <rect x="6" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" className="robot-head"/>

                                  {/* Robot eyes with blinking animation */}
                                  <circle cx="9" cy="12" r="1" fill="currentColor" className="robot-eye-left animate-pulse"/>
                                  <circle cx="15" cy="12" r="1" fill="currentColor" className="robot-eye-right animate-pulse"/>

                                  {/* Robot mouth/speaker */}
                                  <rect x="10.5" y="14.5" width="3" height="1.5" rx="0.75" stroke="currentColor" strokeWidth="1" fill="none" className="robot-mouth"/>

                                  {/* Robot antenna with signal */}
                                  <line x1="12" y1="8" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" className="robot-antenna"/>
                                  <circle cx="12" cy="5" r="1" fill="currentColor" className="robot-signal animate-ping"/>

                                  {/* Robot body connection */}
                                  <line x1="12" y1="18" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5"/>

                                  {/* Processing indicators */}
                                  <circle cx="7.5" cy="10" r="0.5" fill="currentColor" className="processing-dot-1" opacity="0.6"/>
                                  <circle cx="16.5" cy="10" r="0.5" fill="currentColor" className="processing-dot-2" opacity="0.6"/>
                                </svg>
                              </div>

                              {/* Rotating processing ring */}
                              <div className="absolute inset-0 border-2 border-transparent border-t-purple-300 border-r-blue-300 rounded-xl animate-spin opacity-60"></div>
                            </div>

                            <div className="thinking-pulse bg-gradient-to-r from-gray-800/80 to-gray-900/80 px-4 py-2 rounded-2xl backdrop-blur-sm border border-purple-500/20 shadow-lg">
                              <span className="font-medium text-purple-200 text-sm flex items-center">
                                {isProMode ? (
                                  <>
                                    <span className="mr-2 text-purple-400">⚡</span>
                                    <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent font-semibold">
                                      {thinkingText}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <span className="mr-2 text-blue-400">🤖</span>
                                    <span className="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent font-semibold">
                                      {thinkingText}
                                    </span>
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        ) : isStreamingMessage ? (
                          // Streaming response with optimized cursor and smooth rendering - 16px text
                          <div className="text-base leading-relaxed font-normal message-text streaming-message"
                          style={{
                            transform: 'translateZ(0)', // Force hardware acceleration
                            willChange: 'contents', // Optimize for content changes
                            backfaceVisibility: 'hidden' // Smooth text rendering
                          }}>
                            <div
                              ref={isStreamingMessage ? streamingTextRef : undefined}
                              dangerouslySetInnerHTML={{
                                __html: processStreamedText(cleanText(displayContent))
                              }}
                              style={{
                                transform: 'translateZ(0)', // Force hardware acceleration for text
                                willChange: 'contents'
                              }}
                            />
                            <span
                              className="cursor-blink"
                              style={{
                                transform: 'translateZ(0)', // Smooth cursor animation
                                willChange: 'opacity'
                              }}
                            ></span>


                          </div>
                        ) : (
                          // Regular message with enhanced styling - 16px text
                        <div className="text-base leading-relaxed font-normal message-text"
                        style={{ fontSize: '16px' }}>
                            {message.role === 'user' ? (
                              <div className="flex items-start">
                                <div className="flex-grow">
                                  {displayContent}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start">
                                <div className="flex-grow">
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
                      width: 6px;
                      height: 6px;
                      border-radius: 50%;
                      margin-right: 4px;
                      background: #a78bfa;
                      animation: typing-animation 1.4s infinite ease-in-out both;
                      transform: translateZ(0);
                      will-change: transform, opacity;
                      backface-visibility: hidden;
                    }

                    .typing-animation .dot:nth-child(1) {
                      animation-delay: -0.32s;
                    }

                    .typing-animation .dot:nth-child(2) {
                      animation-delay: -0.16s;
                    }

                    @keyframes typing-animation {
                      0%, 80%, 100% {
                        transform: scale(0.6) translateZ(0);
                        opacity: 0.6;
                      }
                      40% {
                        transform: scale(1) translateZ(0);
                        opacity: 1;
                      }
                    }

                    .cursor-blink {
                      display: inline-block;
                      width: 2px;
                      height: 1em;
                      background: currentColor;
                      margin-left: 2px;
                      animation: cursor-blink 1s infinite;
                      transform: translateZ(0);
                      will-change: opacity;
                    }

                    @keyframes cursor-blink {
                      0%, 50% { opacity: 1; }
                      51%, 100% { opacity: 0; }
                    }

                    .streaming-message {
                      transform: translateZ(0);
                      will-change: contents;
                      backface-visibility: hidden;
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
                <div className="px-4 mb-3 animate-material-slideUp" style={{ animationDelay: '0.2s' }}>
                  <p className={`${isMobile ? 'text-sm' : 'text-xs'} text-gray-400 mb-3 font-medium`}>Suggested questions:</p>
                  <div className={`flex flex-wrap gap-${isMobile ? '3' : '2'}`}>
                    {getPageSuggestedQuestions(pathname).map((question, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          setInputValue(question);
                          if (inputRef.current) {
                            inputRef.current.focus();
                            // Trigger send immediately on mobile for better UX
                            if (isMobile) {
                              setTimeout(() => {
                                handleSendMessage();
                              }, 100);
                            }
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
                        className={`${isMobile ? 'text-sm px-5 py-4' : 'text-xs px-4 py-2'} bg-gray-700/60 text-gray-200 rounded-2xl hover:bg-gray-600/60 hover:text-white transition-all duration-200 active:scale-95 ${isMobile ? 'min-h-[52px] touch-manipulation font-medium' : ''} border border-gray-600/30 hover:border-purple-500/40`}
                        style={{
                          animationDelay: `${0.1 + (index * 0.05)}s`,
                          WebkitTouchCallout: 'none',
                          WebkitUserSelect: 'none',
                          userSelect: 'none',
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
              <div className="relative flex items-center p-2 bg-gray-900/50 rounded-b-3xl border-t border-gray-800/40">
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
                    className={`absolute ${isMobile ? 'right-4' : 'right-4'} ${isMobile ? 'p-3' : 'p-1.5'} rounded-full bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-black transition-all duration-300 flex items-center justify-center ${isMobile ? 'touch-manipulation' : ''} shadow-lg`}
                    style={{
                      width: isMobile ? '52px' : '36px',
                      height: isMobile ? '52px' : '36px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      ...(isMobile ? {
                        WebkitTouchCallout: 'none',
                        WebkitUserSelect: 'none',
                        userSelect: 'none',
                        minHeight: '52px',
                        minWidth: '52px'
                      } : {})
                    }}
                    aria-label="Pause generation"
                    title="Pause generation"
                  >
                    <Pause size={isMobile ? 20 : 16} />
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
                    className={`absolute ${isMobile ? 'right-3' : 'right-3'} ${isMobile ? 'p-2.5' : 'p-2'} rounded-full ${
                      (!inputValue.trim() && (!isCodeMode || !codeSnippet.trim()))
                        ? 'bg-gray-600/50 text-gray-400'
                        : isCodeMode
                          ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white'
                    } transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center ${isMobile ? 'touch-manipulation' : ''} shadow-lg`}
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
                    aria-label="Send message"
                    title="Send message"
                >
                    <Send size={isMobile ? 18 : 18} className={`${(inputValue.trim() || (isCodeMode && codeSnippet.trim())) ? 'transform rotate-45' : ''} transition-transform duration-200`} />
                </button>
                )}
              </div>
              
              {/* iPhone-style footer */}
              <div className="px-4 py-2 bg-gray-900/60 text-left flex items-center justify-between rounded-b-3xl border-t border-gray-800/30">
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

      {/* Sidebar for settings and controls - optimized for mobile */}
      <div
        className={`absolute right-0 top-0 bottom-0 bg-gradient-to-b from-gray-900/98 via-gray-950/98 to-gray-900/98 backdrop-blur-xl border-l ${isProMode ? 'border-purple-500/30' : 'border-gray-700/40'} flex flex-col chatbot-sidebar ${showSidebar && !isMinimized ? 'visible' : ''} shadow-2xl`}
        style={{
          borderTopRightRadius: isMobile && isFullscreen ? '0' : '1.5rem',
          borderBottomRightRadius: isMobile && isFullscreen ? '0' : '1.5rem',
          width: isMobile ? '95px' : '80px', // Increased width for better mobile touch targets and visibility
          transform: (!showSidebar || isMinimized) ?
            (isMobile ? 'translateX(100%)' : 'translateX(120%)') :
            'translateX(0)',
          opacity: (!showSidebar || isMinimized) ? 0 : 1,
          transition: isMobile ?
            'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease, box-shadow 0.3s ease' :
            'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
          boxShadow: showSidebar ?
            (isMobile ? '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)' : '0 0 25px rgba(0, 0, 0, 0.4)') :
            'none',
          pointerEvents: (!showSidebar || isMinimized) ? 'none' : 'auto',
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
            
            {/* AI Model Settings button - PRO mode only */}
            {isProMode && (
              <button
                onClick={() => switchSidebarPanel('model')}
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
                className={`flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-11 h-11'} mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white transition-all duration-300 shadow-lg sidebar-btn active:scale-95`}
                aria-label="AI Model Settings"
                title="AI Model Settings"
                style={{
                  touchAction: 'manipulation',
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none'
                }}
              >
                <svg className={`${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
            
            {/* Temperature control - make it more mobile friendly */}
            <div className="mt-auto flex flex-col items-center">
              <span className="text-xs text-gray-400 mb-2">Temp</span>
              <div 
                className="relative h-28 w-6 bg-gray-800 rounded-full flex flex-col items-center cursor-pointer temperature-slider"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const height = rect.height;
                  const y = e.clientY - rect.top;
                  const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                  handleTemperatureChange(percentage);
                }}
              >
                <div 
                  className="absolute bottom-0 rounded-full bg-gradient-to-t from-blue-500 to-purple-500 w-full slider-track"
                  style={{ 
                    height: `${(temperature / 1) * 100}%`
                  }}
                />
                <div 
                  className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[10px] font-medium text-gray-900 shadow-md slider-thumb"
                  style={{ 
                    bottom: `calc(${(temperature / 1) * 100}% - 10px)`
                  }}
                >
                  {temperature.toFixed(1)}
                </div>
              </div>
              <div className="mt-2 text-[10px] text-gray-400 text-center slider-label">
                {temperature < 0.3 ? "Precise" : temperature < 0.6 ? "Balanced" : "Creative"}
              </div>
            </div>
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
            
            {/* Sliders container - more compact layout */}
            <div className="flex flex-col gap-5 items-center py-1">
              {/* Top-P slider - more compact */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Top-P</span>
                <div 
                  className="relative h-24 w-6 bg-gray-800 rounded-full flex flex-col items-center cursor-pointer temperature-slider"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handleTopPChange(percentage);
                  }}
                >
                  <div 
                    className="absolute bottom-0 rounded-full bg-gradient-to-t from-blue-500 to-cyan-400 w-full slider-track"
                    style={{ 
                      height: `${(topP / 1) * 100}%`
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[10px] font-medium text-gray-900 shadow-md slider-thumb"
                    style={{ 
                      bottom: `calc(${(topP / 1) * 100}% - 10px)`
                    }}
                  >
                    {topP.toFixed(1)}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-500 text-center slider-label">
                  Diversity
                </div>
              </div>
              
              {/* Max Tokens slider - more compact */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">Tokens</span>
                <div 
                  className="relative h-24 w-6 bg-gray-800 rounded-full flex flex-col items-center cursor-pointer temperature-slider"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handleMaxTokensChange(percentage);
                  }}
                >
                  <div 
                    className="absolute bottom-0 rounded-full bg-gradient-to-t from-teal-500 to-emerald-400 w-full slider-track"
                    style={{ 
                      height: `${((maxTokens - 100) / 1900) * 100}%` // Normalize from range 100-2000
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[10px] font-medium text-gray-900 shadow-md slider-thumb"
                    style={{ 
                      bottom: `calc(${((maxTokens - 100) / 1900) * 100}% - 10px)`
                    }}
                  >
                    {maxTokens}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-500 text-center slider-label">
                  Length
                </div>
              </div>
              
              {/* Presence Penalty slider - more compact */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">P-Pen</span>
                <div 
                  className="relative h-24 w-6 bg-gray-800 rounded-full flex flex-col items-center cursor-pointer temperature-slider"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handlePresencePenaltyChange(percentage);
                  }}
                >
                  <div className="absolute h-px w-full bg-gray-600" style={{ bottom: '50%' }}></div>
                  <div 
                    className={`absolute rounded-full w-full slider-track ${presencePenalty >= 0 ? 'bg-gradient-to-t from-transparent to-amber-500' : 'bg-gradient-to-b from-transparent to-amber-500'}`}
                    style={{ 
                      height: `${Math.abs(presencePenalty / 2) * 50}%`,
                      bottom: presencePenalty >= 0 ? '50%' : 'auto',
                      top: presencePenalty < 0 ? '50%' : 'auto'
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[10px] font-medium text-gray-900 shadow-md slider-thumb"
                    style={{ 
                      bottom: `calc(50% + ${(presencePenalty / 2) * 50}% - 10px)`
                    }}
                  >
                    {presencePenalty.toFixed(1)}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-500 text-center slider-label">
                  Topic Focus
                </div>
              </div>
              
              {/* Frequency Penalty slider - more compact */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 mb-1">F-Pen</span>
                <div 
                  className="relative h-24 w-6 bg-gray-800 rounded-full flex flex-col items-center cursor-pointer temperature-slider"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const height = rect.height;
                    const y = e.clientY - rect.top;
                    const percentage = Math.max(0, Math.min(1, 1 - (y / height)));
                    handleFrequencyPenaltyChange(percentage);
                  }}
                >
                  <div className="absolute h-px w-full bg-gray-600" style={{ bottom: '50%' }}></div>
                  <div 
                    className={`absolute rounded-full w-full slider-track ${frequencyPenalty >= 0 ? 'bg-gradient-to-t from-transparent to-orange-500' : 'bg-gradient-to-b from-transparent to-orange-500'}`}
                    style={{ 
                      height: `${Math.abs(frequencyPenalty / 2) * 50}%`,
                      bottom: frequencyPenalty >= 0 ? '50%' : 'auto',
                      top: frequencyPenalty < 0 ? '50%' : 'auto'
                    }}
                  />
                  <div 
                    className="absolute rounded-full bg-white w-5 h-5 flex items-center justify-center text-[10px] font-medium text-gray-900 shadow-md slider-thumb"
                    style={{ 
                      bottom: `calc(50% + ${(frequencyPenalty / 2) * 50}% - 10px)`
                    }}
                  >
                    {frequencyPenalty.toFixed(1)}
                  </div>
                </div>
                <div className="mt-1 text-[9px] text-gray-500 text-center slider-label">
                  Repetition
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
      </div>
    </div>
    </>
  );
} 