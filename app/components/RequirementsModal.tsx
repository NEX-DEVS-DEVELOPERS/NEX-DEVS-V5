'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Check, Loader2, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workflowType?: 'standard' | 'enterprise';
}

interface StepData {
  title: string;
  question: string;
  type?: 'single' | 'multiple' | 'input' | 'slider' | 'textarea' | 'roadmap';
  options?: {
    label: string;
    value: string;
    action?: 'redirect' | 'next' | 'other';
    description?: string;
    tooltip?: string;
    followUp?: string[];
  }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
  skipConditions?: string[];
}

interface TechStackOption {
  label: string;
  value: string;
  popular?: boolean;
}

interface AIModelOption {
  label: string;
  value: string;
  provider: string;
  popular?: boolean;
}

interface EnterpriseStepData {
  title: string;
  question: string;
  type: 'single' | 'multiple' | 'input' | 'slider' | 'textarea' | 'roadmap';
  options?: {
    label: string;
    value: string;
    description?: string;
    tooltip?: string;
    followUp?: string[];
  }[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  helpText?: string;
  skipConditions?: string[];
}

// Enhanced Tooltip Component with proper z-index layering
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-help"
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[9999] px-4 py-3 bg-slate-800 text-white text-sm rounded-xl
                       shadow-2xl border border-purple-500/30 backdrop-blur-sm max-w-xs
                       pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              {text}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0
                            border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ProjectRoadmap {
  websiteStatus: string;
  aiModel: string;
  timeline: string;
  budget: number;
  platforms: string[];
  businessNiche: string;
  securityRequirements: string[];
  userVolume: string;
  integrationComplexity: string;
  dataVolume: string;
  performanceRequirements: string;
  maintenancePreference: string;
  additionalDetails: string;
}

const RequirementsModal: React.FC<RequirementsModalProps> = ({
  isOpen,
  onClose,
  workflowType = 'standard'
}) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [customTechStack, setCustomTechStack] = useState('');
  const [enterpriseData, setEnterpriseData] = useState<Record<string, any>>({});
  const [budgetValue, setBudgetValue] = useState(5000);
  const [customBudget, setCustomBudget] = useState('');
  const [showCustomBudget, setShowCustomBudget] = useState(false);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, string>>({});
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  // Budget tiers for granular pricing
  const budgetTiers = [
    1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 7500, 8000, 9000, 10000,
    12500, 15000, 17500, 20000, 22500, 25000, 27500, 30000, 32500, 35000, 37500, 40000,
    42500, 45000, 47500, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000
  ];

  // Function to get the closest budget tier
  const getClosestBudgetTier = (value: number) => {
    return budgetTiers.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  // Function to format budget display
  const formatBudget = (value: number) => {
    if (value >= 100000) return '$100,000+';
    return `$${value.toLocaleString()}`;
  };

  // Function to calculate ASAP surcharge (15%)
  const calculateASAPSurcharge = (baseBudget: number) => {
    const timeline = enterpriseData[3]; // Timeline step
    if (timeline === 'asap') {
      return Math.round(baseBudget * 0.15);
    }
    return 0;
  };

  // Function to get final budget with surcharges
  const getFinalBudget = () => {
    const baseBudget = showCustomBudget && customBudget ?
      parseInt(customBudget.replace(/[^0-9]/g, '')) || budgetValue :
      budgetValue;
    const asapSurcharge = calculateASAPSurcharge(baseBudget);
    return baseBudget + asapSurcharge;
  };

  // Validation function
  const validateStep = (step: number): boolean => {
    const currentStepData = currentSteps[step];
    if (!currentStepData?.required) return true;

    if (currentStepData.type === 'textarea') {
      if (!textareaValue.trim()) {
        setValidationErrors(prev => ({ ...prev, [step]: 'This field is required' }));
        return false;
      }
    } else if (currentStepData.type === 'slider') {
      if (!budgetValue) {
        setValidationErrors(prev => ({ ...prev, [step]: 'Please select a budget range' }));
        return false;
      }
    } else {
      if (!enterpriseData[step]) {
        setValidationErrors(prev => ({ ...prev, [step]: 'Please make a selection' }));
        return false;
      }
    }

    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[step];
      return newErrors;
    });
    return true;
  };

  // Storage keys for one-time display logic
  const MODAL_SHOWN_KEY = 'requirements-modal-shown';
  const MODAL_SESSION_KEY = 'requirements-modal-session';

  // AI Model Options for Enterprise workflow
  const aiModelOptions: AIModelOption[] = [
    { label: 'Let NEX-DEVS find the best AI model for you', value: 'nex-devs-choice', provider: 'NEX-DEVS', popular: true },
    { label: 'OpenAI GPT-4', value: 'openai-gpt4', provider: 'OpenAI', popular: true },
    { label: 'OpenAI GPT-3.5 Turbo', value: 'openai-gpt35', provider: 'OpenAI', popular: true },
    { label: 'Anthropic Claude', value: 'anthropic-claude', provider: 'Anthropic', popular: true },
    { label: 'Google Gemini', value: 'google-gemini', provider: 'Google' },
    { label: 'Google PaLM', value: 'google-palm', provider: 'Google' },
    { label: 'Meta LLaMA', value: 'meta-llama', provider: 'Meta' },
    { label: 'Cohere Command', value: 'cohere-command', provider: 'Cohere' },
    { label: 'Hugging Face Models', value: 'huggingface', provider: 'Hugging Face' }
  ];

  // Progress saving key
  const PROGRESS_KEY = `requirements-progress-${workflowType}`;

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      // Try to load saved progress
      if (typeof window !== 'undefined') {
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        if (savedProgress) {
          try {
            const progress = JSON.parse(savedProgress);
            setCurrentStep(progress.currentStep || 1);
            setEnterpriseData(progress.enterpriseData || {});
            setBudgetValue(progress.budgetValue || 5000);
            setCustomBudget(progress.customBudget || '');
            setShowCustomBudget(progress.showCustomBudget || false);
            setTextareaValue(progress.textareaValue || '');
            setSelectedOptions(progress.selectedOptions || {});
          } catch (error) {
            console.warn('Failed to load saved progress:', error);
          }
        } else {
          // Reset to initial state
          setCurrentStep(1);
          setSelectedOptions({});
          setEnterpriseData({});
          setBudgetValue(5000);
          setCustomBudget('');
          setShowCustomBudget(false);
          setTextareaValue('');
        }

        setIsAnimating(false);
        setIsNavigating(false);
        setCustomTechStack('');
        setValidationErrors({});

        // Mark as shown in session storage
        sessionStorage.setItem(MODAL_SESSION_KEY, 'true');
      }
    }
  }, [isOpen, PROGRESS_KEY, MODAL_SESSION_KEY]);

  // Save progress whenever data changes
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const progress = {
        currentStep,
        enterpriseData,
        budgetValue,
        customBudget,
        showCustomBudget,
        textareaValue,
        selectedOptions,
        timestamp: Date.now()
      };
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  }, [isOpen, currentStep, enterpriseData, budgetValue, customBudget, showCustomBudget, textareaValue, selectedOptions, PROGRESS_KEY]);

  // Technology stack options for "Other" selection
  const techStackOptions: TechStackOption[] = [
    { label: "Vue.js", value: "vue", popular: true },
    { label: "Angular", value: "angular", popular: true },
    { label: "Svelte", value: "svelte", popular: false },
    { label: "Laravel", value: "laravel", popular: true },
    { label: "Django", value: "django", popular: true },
    { label: "Ruby on Rails", value: "rails", popular: false },
    { label: "ASP.NET", value: "aspnet", popular: false },
    { label: "Spring Boot", value: "spring", popular: false },
    { label: "Express.js", value: "express", popular: true },
    { label: "Flask", value: "flask", popular: false },
    { label: "Custom/Other", value: "custom", popular: false }
  ];

  const steps: Record<number, StepData> = {
    1: {
      title: "Requirements Assessment",
      question: "Do you already have a website?",
      options: [
        { label: "Yes, I have a website", value: "yes", action: "next" },
        { label: "No, I need a website", value: "no", action: "redirect" }
      ]
    },
    2: {
      title: "Technology Stack",
      question: "What technology stack is your website built with?",
      options: [
        { label: "TypeScript/JavaScript", value: "typescript", action: "next" },
        { label: "React/Next.js", value: "react", action: "next" },
        { label: "WordPress", value: "wordpress", action: "next" },
        { label: "Custom PHP", value: "php", action: "next" },
        { label: "Other", value: "other", action: "other" }
      ]
    },
    3: {
      title: "Technology Stack Details",
      question: "Which technology stack are you currently using?",
      options: techStackOptions.map(tech => ({
        label: tech.label,
        value: tech.value,
        action: "next" as const
      }))
    },
    4: {
      title: "AI Integration Plan",
      question: "Based on your selections, here are our recommended AI integration plans:",
      options: [
        { label: "Continue with Consultation", value: "continue", action: "next" }
      ]
    }
  };

  // Enterprise Consultation Steps
  const enterpriseSteps: Record<number, EnterpriseStepData> = {
    1: {
      title: "Website Assessment",
      question: "Do you have an existing website?",
      type: "single",
      options: [
        { label: "Yes, I have a website", value: "yes" },
        { label: "No, I need a new website", value: "no" },
        { label: "I'm planning to build one", value: "planning" }
      ],
      required: true
    },
    2: {
      title: "AI Model Selection",
      question: "Which SDK or AI model do you want to work with?",
      type: "single",
      options: aiModelOptions.map(model => ({
        label: model.label,
        value: model.value,
        description: model.provider
      })),
      required: true
    },
    3: {
      title: "Project Timeline",
      question: "What is your project timeline?",
      type: "single",
      options: [
        { label: "ASAP (Rush delivery)", value: "asap", description: "1-2 weeks" },
        { label: "Standard timeline", value: "standard", description: "3-4 weeks" },
        { label: "Extended timeline", value: "extended", description: "1-2 months" },
        { label: "Flexible timeline", value: "flexible", description: "3+ months" }
      ],
      required: true
    },
    4: {
      title: "Budget Range",
      question: "What is your budget range for this project?",
      type: "slider",
      min: 1000,
      max: 100000,
      step: 500,
      required: true,
      helpText: "Based on your requirements, we'll recommend the best integration approach for your needs.",
      options: [
        { label: "Use Budget Slider", value: "slider" },
        { label: "Custom Budget Amount", value: "custom" }
      ]
    },
    5: {
      title: "Platform Integration",
      question: "Which platform needs AI integration?",
      type: "multiple",
      options: [
        { label: "Web Application", value: "web" },
        { label: "Mobile App (iOS/Android)", value: "mobile" },
        { label: "Desktop Application", value: "desktop" },
        { label: "API/Backend Service", value: "api" },
        { label: "E-commerce Platform", value: "ecommerce" },
        { label: "CRM System", value: "crm" },
        { label: "Other", value: "other" }
      ],
      required: true
    },
    6: {
      title: "Business Niche",
      question: "What is your business niche/industry?",
      type: "single",
      options: [
        { label: "E-commerce & Retail", value: "ecommerce" },
        { label: "Healthcare & Medical", value: "healthcare" },
        { label: "Finance & Banking", value: "finance" },
        { label: "Education & E-learning", value: "education" },
        { label: "Real Estate", value: "realestate" },
        { label: "Technology & Software", value: "technology" },
        { label: "Marketing & Advertising", value: "marketing" },
        { label: "Legal Services", value: "legal" },
        { label: "Manufacturing", value: "manufacturing" },
        { label: "Hospitality & Travel", value: "hospitality" },
        { label: "Other", value: "other" }
      ],
      required: true
    },
    7: {
      title: "Security Requirements",
      question: "What are your security and compliance requirements?",
      type: "multiple",
      options: [
        { label: "GDPR Compliance", value: "gdpr" },
        { label: "HIPAA Compliance", value: "hipaa" },
        { label: "SOC 2 Compliance", value: "soc2" },
        { label: "PCI DSS Compliance", value: "pci" },
        { label: "Data Encryption", value: "encryption" },
        { label: "On-premise Deployment", value: "onpremise" },
        { label: "Custom Security Policies", value: "custom" },
        { label: "No specific requirements", value: "none" }
      ],
      required: false
    },
    8: {
      title: "User Volume",
      question: "What is your expected user volume?",
      type: "single",
      options: [
        { label: "Small scale (1-100 users)", value: "small", description: "Personal projects, small teams" },
        { label: "Medium scale (100-1,000 users)", value: "medium", description: "Growing businesses, departments" },
        { label: "Large scale (1,000-10,000 users)", value: "large", description: "Established companies, organizations" },
        { label: "Enterprise scale (10,000+ users)", value: "enterprise", description: "Large corporations, platforms" }
      ],
      required: true,
      helpText: "This helps us recommend the right infrastructure and pricing model."
    },
    9: {
      title: "Integration Complexity",
      question: "What level of integration complexity do you need?",
      type: "single",
      options: [
        {
          label: "Simple API integration",
          value: "simple",
          description: "Basic chatbot, single endpoint",
          tooltip: "REST API integration with minimal customization"
        },
        {
          label: "Moderate integration",
          value: "moderate",
          description: "Multiple features, custom workflows",
          tooltip: "Custom UI components with advanced features"
        },
        {
          label: "Complex multi-system",
          value: "complex",
          description: "Enterprise systems, custom architecture",
          tooltip: "Integration with CRM, databases, and third-party services"
        },
        {
          label: "Full custom solution",
          value: "full-custom",
          description: "Completely tailored AI platform",
          tooltip: "Custom-built AI platform with proprietary features"
        }
      ],
      required: true,
      helpText: "Integration complexity affects development time and cost."
    },
    10: {
      title: "Data & Storage",
      question: "What are your data volume and storage requirements?",
      type: "single",
      options: [
        { label: "Minimal data (< 1GB)", value: "minimal", description: "Basic conversations, small datasets" },
        { label: "Moderate data (1-10GB)", value: "moderate", description: "Extended conversations, medium datasets" },
        { label: "Large data (10-100GB)", value: "large", description: "Extensive history, large datasets" },
        { label: "Enterprise data (100GB+)", value: "enterprise", description: "Massive datasets, long-term storage" }
      ],
      required: true,
      helpText: "Data requirements impact storage costs and performance optimization."
    },
    11: {
      title: "Performance Requirements",
      question: "What are your performance expectations?",
      type: "single",
      options: [
        { label: "Standard performance", value: "standard", description: "2-5 second response time" },
        { label: "Fast performance", value: "fast", description: "1-2 second response time" },
        { label: "Real-time performance", value: "realtime", description: "< 1 second response time" },
        { label: "Ultra-fast performance", value: "ultra", description: "< 500ms response time" }
      ],
      required: true,
      helpText: "Performance requirements affect infrastructure and optimization needs."
    },
    12: {
      title: "Maintenance & Support",
      question: "What level of ongoing maintenance and support do you need?",
      type: "single",
      options: [
        { label: "Self-managed", value: "self", description: "You handle all maintenance" },
        { label: "Basic support", value: "basic", description: "Email support, documentation" },
        { label: "Standard support", value: "standard", description: "Priority support, regular updates" },
        { label: "Premium support", value: "premium", description: "24/7 support, dedicated account manager" }
      ],
      required: true,
      helpText: "Support level affects ongoing costs and service quality."
    },
    13: {
      title: "Additional Details",
      question: "Please provide any additional requirements or details about your project:",
      type: "textarea",
      placeholder: "Describe your specific needs, expected features, special requirements, or any other important details...",
      required: false
    },
    14: {
      title: "Project Roadmap",
      question: "Review your project roadmap and pricing",
      type: "roadmap",
      required: false
    }
  };

  // Choose which steps to use based on workflow type
  const currentSteps = workflowType === 'enterprise' ? enterpriseSteps : steps;
  const totalSteps = Object.keys(currentSteps).length;

  const handleOptionSelect = useCallback(async (option: any) => {
    if (isAnimating) return;

    setIsAnimating(true);

    // Handle Enterprise workflow differently
    if (workflowType === 'enterprise') {
      setEnterpriseData(prev => ({ ...prev, [currentStep]: option.value }));

      // Check if this is the roadmap step
      if (currentStep === 14) {
        // Show roadmap and handle checkout
        setShowRoadmap(true);
        setTimeout(() => {
          // Clear saved progress
          if (typeof window !== 'undefined') {
            localStorage.removeItem(PROGRESS_KEY);
          }
          // Redirect to checkout with enterprise data
          const consultationData = {
            ...enterpriseData,
            budget: budgetValue,
            additionalDetails: textareaValue,
            timestamp: Date.now()
          };
          router.push('/checkout?source=enterprise&data=' + encodeURIComponent(JSON.stringify(consultationData)));
          onClose();
          setIsAnimating(false);
        }, 2000);
        return;
      }

      // For Enterprise workflow, just go to next step
      let nextStep = currentStep + 1;
      if (nextStep <= totalSteps) {
        setTimeout(() => {
          setCurrentStep(nextStep);
          setIsAnimating(false);
        }, 200);
      } else {
        // Final step - show roadmap
        setTimeout(() => {
          setCurrentStep(14); // Go to roadmap step
          setIsAnimating(false);
        }, 200);
      }
      return;
    }

    // Standard workflow
    setSelectedOptions(prev => ({ ...prev, [currentStep]: option.value }));

    // Handle different actions
    if (option.action === 'redirect') {
      // Mark as permanently shown when user chooses "No, I need a website"
      if (typeof window !== 'undefined') {
        localStorage.setItem(MODAL_SHOWN_KEY, 'true');
      }

      setIsNavigating(true);

      // Close modal and redirect to pricing page
      setTimeout(() => {
        onClose();

        // Navigate to pricing page
        setTimeout(() => {
          router.push('/pricing');

          // Scroll to and highlight Full-Stack plans after navigation
          setTimeout(() => {
            highlightFullStackPlans();
          }, 1500); // Increased delay for better UX
        }, 300);
      }, 200);

    } else if (option.action === 'other') {
      // Handle "Other" selection - go to technology stack details
      setTimeout(() => {
        setCurrentStep(3); // Go to step 3 (Technology Stack Details)
        setIsAnimating(false);
      }, 200);

    } else if (option.action === 'next') {
      // Determine next step based on current step and selection
      let nextStep = currentStep + 1;

      // Skip step 3 if not coming from 'Other' selection
      if (currentStep === 2 && option.value !== 'other') {
        nextStep = 4; // Skip to AI Integration Plan
      }

      if (nextStep <= totalSteps) {
        setTimeout(() => {
          setCurrentStep(nextStep);
          setIsAnimating(false);
        }, 200);
      } else {
        // Final step - mark as shown and close modal
        if (typeof window !== 'undefined') {
          localStorage.setItem(MODAL_SHOWN_KEY, 'true');
        }

        setTimeout(() => {
          onClose();
          setIsAnimating(false);
        }, 500);
      }
    }
  }, [isAnimating, currentStep, totalSteps, onClose, router, MODAL_SHOWN_KEY]);

  const highlightFullStackPlans = useCallback(() => {
    try {
      // Multiple selectors to find pricing section
      const pricingSection = document.querySelector('.pricing-grid') ||
                            document.querySelector('[class*="pricing"]') ||
                            document.querySelector('.pricing-card') ||
                            document.querySelector('main');

      if (pricingSection) {
        // Smooth scroll to pricing section
        pricingSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Highlight Full-Stack plans with enhanced targeting
        setTimeout(() => {
          // Try multiple selectors for Full-Stack cards
          const fullStackCards = document.querySelectorAll(
            '[class*="Full-Stack"], .pricing-card:has([class*="Full-Stack"]), .pricing-card:has(*:contains("Full-Stack"))'
          );

          // Fallback: look for cards containing "Full-Stack" text
          if (fullStackCards.length === 0) {
            const allCards = document.querySelectorAll('.pricing-card');
            allCards.forEach(card => {
              if (card.textContent?.includes('Full-Stack')) {
                card.classList.add('highlight-pulse');
                addPointingAnimation(card);
              }
            });
          } else {
            fullStackCards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('highlight-pulse');
                addPointingAnimation(card);
              }, index * 300); // Increased delay for better visual effect
            });
          }
        }, 800); // Increased delay to ensure page is loaded
      } else {
        console.warn('Pricing section not found for highlighting');
      }
    } catch (error) {
      console.error('Error highlighting Full-Stack plans:', error);
    }
  }, []);

  const addPointingAnimation = (card: Element) => {
    try {
      // Add pointing animation
      const pointer = document.createElement('div');
      pointer.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce z-10';
      pointer.innerHTML = '👆';
      pointer.style.pointerEvents = 'none';
      pointer.style.fontSize = '24px';
      pointer.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';

      const cardParent = card.parentElement || card;
      if (cardParent && cardParent instanceof HTMLElement) {
        cardParent.style.position = 'relative';
        cardParent.appendChild(pointer);

        // Remove pointer and highlighting after 4 seconds
        setTimeout(() => {
          try {
            if (pointer.parentElement) {
              pointer.parentElement.removeChild(pointer);
            }
            card.classList.remove('highlight-pulse');
          } catch (cleanupError) {
            console.warn('Error cleaning up pointing animation:', cleanupError);
          }
        }, 4000);
      }
    } catch (error) {
      console.error('Error adding pointing animation:', error);
    }
  };

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1 && !isAnimating) {
      let prevStep = currentStep - 1;

      // Skip step 3 if going back from step 4 and step 2 wasn't "other"
      if (currentStep === 4 && selectedOptions[2] !== 'other') {
        prevStep = 2;
      }

      setCurrentStep(prevStep);
    }
  }, [currentStep, isAnimating, selectedOptions]);

  // Function to check if modal should be shown (one-time display logic)
  const shouldShowModal = useCallback(() => {
    if (typeof window === 'undefined') return true;

    const hasShownPermanent = localStorage.getItem(MODAL_SHOWN_KEY) === 'true';
    const hasShownSession = sessionStorage.getItem(MODAL_SESSION_KEY) === 'true';

    // Don't show if permanently marked as shown, but allow session-based showing
    return !hasShownPermanent;
  }, [MODAL_SHOWN_KEY, MODAL_SESSION_KEY]);

  // Function to mark modal as permanently shown
  const markAsShown = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(MODAL_SHOWN_KEY, 'true');
    }
  }, [MODAL_SHOWN_KEY]);

  const getRecommendationText = useCallback(() => {
    const websiteChoice = selectedOptions[1];
    const techStack = selectedOptions[2];
    const specificTech = selectedOptions[3];

    if (websiteChoice === 'yes') {
      if (techStack === 'other' && specificTech) {
        // Handle specific technology from 'Other' selection
        switch (specificTech) {
          case 'vue':
            return "Excellent! Vue.js is a fantastic framework. Our API-based integration will work seamlessly with your Vue application.";
          case 'angular':
            return "Great choice! Angular's robust architecture pairs perfectly with our enterprise AI solutions.";
          case 'laravel':
            return "Perfect! Laravel's elegant syntax makes our API integration straightforward and efficient.";
          case 'django':
            return "Excellent! Django's 'batteries included' philosophy aligns well with our comprehensive AI solutions.";
          case 'custom':
            return "No problem! Our flexible API can integrate with any custom technology stack you're using.";
          default:
            return `Great! Our flexible API can seamlessly integrate with ${specificTech} and provide powerful AI capabilities.`;
        }
      } else if (techStack) {
        // Handle standard technology selections
        switch (techStack) {
          case 'typescript':
          case 'react':
            return "Perfect! Your modern tech stack is ideal for our Advanced AI Chatbot plan with seamless integration.";
          case 'wordpress':
            return "Great! We have specialized WordPress integration options that work perfectly with your existing setup.";
          case 'php':
            return "Excellent! Our API-based integration will work smoothly with your custom PHP application.";
          default:
            return "No problem! Our flexible API can integrate with any technology stack.";
        }
      }
    }
    return "Based on your requirements, we'll recommend the best integration approach for your needs.";
  }, [selectedOptions]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9998] p-4"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          willChange: 'opacity',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
        onClick={onClose}
      >
        {/* Loading overlay for navigation */}
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
          >
            <div className="bg-black/80 rounded-2xl p-6 flex items-center gap-3">
              <Loader2 className="animate-spin text-purple-400" size={24} />
              <span className="text-white font-medium">Redirecting to pricing...</span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.15
          }}
          className="bg-gradient-to-br from-black/95 via-slate-900/95 to-purple-900/30
                     backdrop-blur-xl rounded-3xl border border-purple-500/40
                     w-full max-w-md mx-auto relative shadow-2xl overflow-hidden"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px 0 rgba(147, 51, 234, 0.3), 0 0 0 1px rgba(147, 51, 234, 0.1)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            zIndex: 9999
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-4 border-b border-purple-500/30">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <h2 className="text-lg font-bold text-white mb-1">
                    {currentSteps[currentStep]?.title}
                  </h2>
                  {/* Progress indicator */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i + 1 <= currentStep
                            ? 'w-6 bg-purple-500 shadow-lg shadow-purple-500/50'
                            : 'w-3 bg-gray-600'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1.5">
                      {currentStep} of {totalSteps}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-all duration-200
                         hover:scale-105 active:scale-95"
              >
                <X size={18} className="text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <h3 className="text-base text-gray-100 mb-3 leading-relaxed font-medium">
                  {currentSteps[currentStep]?.question}
                </h3>

                {/* Special content for final step */}
                {currentStep === 4 && (
                  <div className="mb-3 p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10
                                rounded-lg border border-purple-500/30">
                    <div className="flex items-start gap-2">
                      <Check className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                      <p className="text-xs text-purple-100 leading-relaxed">
                        {getRecommendationText()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Render different content based on workflow type */}
                {workflowType === 'enterprise' ? (
                  // Enterprise workflow rendering
                  <div className="space-y-3">
                    {currentSteps[currentStep]?.type === 'slider' ? (
                      // Enhanced Budget slider for Enterprise with custom option and ASAP surcharge
                      <div className="space-y-4">
                        {/* Budget Type Selection */}
                        <div className="flex gap-2 mb-4">
                          <button
                            onClick={() => setShowCustomBudget(false)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              !showCustomBudget
                                ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                                : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
                            }`}
                          >
                            Budget Slider
                          </button>
                          <button
                            onClick={() => setShowCustomBudget(true)}
                            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              showCustomBudget
                                ? 'bg-purple-500/30 text-purple-200 border border-purple-500/50'
                                : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
                            }`}
                          >
                            Custom Budget
                          </button>
                        </div>

                        {!showCustomBudget ? (
                          // Standard Budget Slider
                          <>
                            <div className="flex justify-between text-sm text-gray-300">
                              <span>$1,000</span>
                              <span className="font-semibold text-purple-400">
                                {formatBudget(budgetValue)}
                              </span>
                              <span>$100,000+</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={budgetTiers.length - 1}
                              step={1}
                              value={budgetTiers.indexOf(getClosestBudgetTier(budgetValue))}
                              onChange={(e) => setBudgetValue(budgetTiers[Number(e.target.value)])}
                              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                                       [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500
                                       [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4
                                       [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:border-0"
                            />
                            <div className="grid grid-cols-6 gap-1 text-xs text-gray-500 mt-2">
                              <span>$1K</span>
                              <span>$1.5K</span>
                              <span>$10K</span>
                              <span>$25K</span>
                              <span>$50K</span>
                              <span>$100K+</span>
                            </div>
                          </>
                        ) : (
                          // Custom Budget Input
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                              Enter your custom budget amount:
                            </label>
                            <input
                              type="text"
                              value={customBudget}
                              onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setCustomBudget(value ? `$${parseInt(value).toLocaleString()}` : '');
                              }}
                              placeholder="e.g., $15,000"
                              className="w-full px-3 py-2 bg-black/30 border border-gray-600/50
                                       rounded-lg text-white placeholder-gray-400 text-sm
                                       focus:border-purple-500/50 focus:outline-none focus:ring-2
                                       focus:ring-purple-500/20 transition-all duration-200"
                            />
                            <p className="text-xs text-gray-400">
                              Enter any amount above $1,000 for your custom AI solution
                            </p>
                          </div>
                        )}

                        {/* ASAP Surcharge Display */}
                        {enterpriseData[3] === 'asap' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2 text-orange-300">
                              <span className="text-sm font-medium">⚡ ASAP Rush Delivery Surcharge:</span>
                              <span className="font-bold">+15%</span>
                            </div>
                            <div className="text-xs text-orange-200 mt-1">
                              Base: {showCustomBudget && customBudget ? customBudget : formatBudget(budgetValue)} +
                              Surcharge: {formatBudget(calculateASAPSurcharge(
                                showCustomBudget && customBudget ?
                                parseInt(customBudget.replace(/[^0-9]/g, '')) || budgetValue :
                                budgetValue
                              ))} =
                              Total: {formatBudget(getFinalBudget())}
                            </div>
                          </motion.div>
                        )}

                        {currentSteps[currentStep]?.helpText && (
                          <div className="text-xs text-gray-400 text-center">
                            <Check className="inline w-3 h-3 mr-1 text-purple-400" />
                            {currentSteps[currentStep].helpText}
                          </div>
                        )}

                        {/* Special message for budgets over $2,000 */}
                        {((!showCustomBudget && budgetValue > 2000) ||
                          (showCustomBudget && customBudget && parseInt(customBudget.replace(/[^0-9]/g, '')) > 2000)) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-yellow-500/20
                                     border border-purple-500/30 rounded-lg relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-yellow-500/10
                                          animate-pulse"></div>
                            <div className="relative flex items-center justify-center gap-2">
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.6, repeat: 2 }}
                                className="text-2xl"
                              >
                                🎉
                              </motion.div>
                              <div className="text-center">
                                <p className="text-lg font-bold bg-gradient-to-r from-purple-300 to-yellow-300
                                           bg-clip-text text-transparent">
                                  Your first website is on NEX-DEVS - ENJOY!
                                </p>
                                <p className="text-xs text-gray-300 mt-1">
                                  Special offer for premium budget selections
                                </p>
                              </div>
                              <motion.div
                                animate={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.6, repeat: 2, delay: 0.1 }}
                                className="text-2xl"
                              >
                                🎉
                              </motion.div>
                            </div>
                          </motion.div>
                        )}

                        <button
                          onClick={() => {
                            const finalBudget = showCustomBudget && customBudget ?
                              parseInt(customBudget.replace(/[^0-9]/g, '')) || budgetValue :
                              budgetValue;
                            handleOptionSelect({ value: finalBudget.toString() });
                          }}
                          disabled={showCustomBudget && !customBudget}
                          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30
                                   border border-purple-500/50 rounded-lg text-purple-200
                                   font-medium transition-all duration-200 hover:scale-[1.01]
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Continue with {showCustomBudget && customBudget ? customBudget : formatBudget(budgetValue)} budget
                          {enterpriseData[3] === 'asap' && (
                            <span className="block text-xs text-orange-300 mt-1">
                              (Total with ASAP surcharge: {formatBudget(getFinalBudget())})
                            </span>
                          )}
                        </button>
                      </div>
                    ) : currentSteps[currentStep]?.type === 'textarea' ? (
                      // Textarea for additional details
                      <div className="space-y-3">
                        <textarea
                          value={textareaValue}
                          onChange={(e) => setTextareaValue(e.target.value)}
                          placeholder={currentSteps[currentStep]?.placeholder}
                          className={`w-full h-32 px-3 py-2 bg-black/30 border rounded-lg text-white
                                   placeholder-gray-400 text-sm resize-none focus:outline-none focus:ring-2
                                   transition-all duration-200 ${
                                     validationErrors[currentStep]
                                       ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                                       : 'border-gray-600/50 focus:border-purple-500/50 focus:ring-purple-500/20'
                                   }`}
                        />
                        {validationErrors[currentStep] && (
                          <p className="text-red-400 text-xs">{validationErrors[currentStep]}</p>
                        )}
                        {currentSteps[currentStep]?.helpText && (
                          <p className="text-gray-400 text-xs">{currentSteps[currentStep].helpText}</p>
                        )}
                        <button
                          onClick={() => {
                            if (currentSteps[currentStep]?.required && !textareaValue.trim()) {
                              setValidationErrors(prev => ({ ...prev, [currentStep]: 'Please provide additional details' }));
                              return;
                            }
                            handleOptionSelect({ value: textareaValue || 'No additional details provided' });
                          }}
                          className="w-full py-3 bg-purple-500/20 hover:bg-purple-500/30
                                   border border-purple-500/50 rounded-lg text-purple-200
                                   font-medium transition-all duration-200 hover:scale-[1.01]"
                        >
                          {currentStep === 13 ? 'Continue to Roadmap' : 'Complete Consultation'}
                        </button>
                      </div>
                    ) : currentSteps[currentStep]?.type === 'roadmap' ? (
                      // Enhanced Project Roadmap Display with Neural Network Theme
                      <div className="space-y-4">
                        {/* Neural Network Background Pattern */}
                        <div className="relative bg-gradient-to-br from-purple-500/10 via-slate-800/50 to-blue-500/10
                                      rounded-xl p-6 border border-purple-500/30 overflow-hidden">
                          {/* Animated background pattern */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                            <div className="absolute bottom-6 left-8 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-700"></div>
                            <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-500"></div>
                            {/* Connection lines */}
                            <svg className="absolute inset-0 w-full h-full" style={{ filter: 'blur(0.5px)' }}>
                              <line x1="20" y1="20" x2="80%" y2="40%" stroke="rgba(147, 51, 234, 0.3)" strokeWidth="1" />
                              <line x1="80%" y1="40%" x2="20%" y2="80%" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
                              <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="rgba(147, 51, 234, 0.2)" strokeWidth="1" />
                            </svg>
                          </div>

                          <div className="relative z-10">
                            <h4 className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-300 to-blue-300
                                         bg-clip-text mb-4 flex items-center gap-2">
                              🧠 AI Project Roadmap Summary
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">Website Status:</span>
                                  <span className="text-white font-semibold">{enterpriseData[1] || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">AI Model:</span>
                                  <span className="text-purple-300 font-semibold">
                                    {enterpriseData[2] === 'nex-devs-choice' ? 'NEX-DEVS Recommended' : (enterpriseData[2] || 'Not specified')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">Timeline:</span>
                                  <span className={`font-semibold ${enterpriseData[3] === 'asap' ? 'text-orange-300' : 'text-white'}`}>
                                    {enterpriseData[3] === 'asap' ? '⚡ ASAP (Rush)' : (enterpriseData[3] || 'Not specified')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">Base Budget:</span>
                                  <span className="text-purple-300 font-bold">{formatBudget(budgetValue)}</span>
                                </div>
                                {enterpriseData[3] === 'asap' && (
                                  <div className="flex items-center justify-between p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                                    <span className="text-orange-300 font-medium">ASAP Surcharge (15%):</span>
                                    <span className="text-orange-300 font-bold">+{formatBudget(calculateASAPSurcharge(budgetValue))}</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">User Volume:</span>
                                  <span className="text-white font-semibold">{enterpriseData[8] || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">Integration:</span>
                                  <span className="text-white font-semibold">{enterpriseData[9] || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">Performance:</span>
                                  <span className="text-white font-semibold">{enterpriseData[11] || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg">
                                  <span className="text-gray-300 font-medium">Support Level:</span>
                                  <span className="text-white font-semibold">{enterpriseData[12] || 'Not specified'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Pricing Summary */}
                        <div className="bg-gradient-to-r from-slate-800/80 to-purple-900/30 rounded-xl p-5 border border-purple-500/40">
                          <h5 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                            💎 Recommended AI Solution Package
                          </h5>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Package Type:</span>
                              <span className="text-purple-300 font-bold">Enterprise AI Solution</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">Estimated Timeline:</span>
                              <span className="text-white font-semibold">
                                {enterpriseData[3] === 'asap' ? '1-2 weeks (Rush)' :
                                 enterpriseData[3] === 'standard' ? '3-4 weeks' :
                                 enterpriseData[3] === 'extended' ? '1-2 months' :
                                 enterpriseData[3] === 'flexible' ? '3+ months' : '4-6 weeks'}
                              </span>
                            </div>
                            <div className="border-t border-gray-600/50 pt-3">
                              <div className="flex items-center justify-between text-lg">
                                <span className="text-gray-300 font-medium">Total Investment:</span>
                                <span className="text-purple-300 font-bold text-xl">
                                  {formatBudget(getFinalBudget())}
                                </span>
                              </div>
                              {enterpriseData[3] === 'asap' && (
                                <p className="text-xs text-orange-300 mt-1 text-right">
                                  Includes 15% rush delivery surcharge
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <motion.button
                          onClick={() => handleOptionSelect({ value: 'checkout' })}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600
                                   rounded-xl text-white font-bold text-lg transition-all duration-300
                                   shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
                                   border border-purple-400/30 hover:border-purple-400/50"
                        >
                          🚀 Proceed to Checkout
                        </motion.button>
                      </div>
                    ) : (
                      // Standard options for Enterprise
                      <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1
                                    scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent"
                           style={{
                             willChange: 'scroll-position',
                             transform: 'translateZ(0)',
                             WebkitOverflowScrolling: 'touch'
                           }}>
                        {currentSteps[currentStep]?.options?.map((option, index) => {
                          const isNexDevsChoice = option.value === 'nex-devs-choice';
                          const isPopular = isNexDevsChoice ||
                                          (currentStep === 2 && ['openai-gpt4', 'anthropic-claude', 'openai-gpt35'].includes(option.value));

                          return (
                            <motion.button
                              key={option.value}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, ease: "easeOut" }}
                              onClick={() => handleOptionSelect(option)}
                              disabled={isAnimating}
                              className={`w-full p-3 text-left transition-all duration-300 group
                                       rounded-lg border relative overflow-hidden
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       ${isNexDevsChoice
                                         ? 'bg-gradient-to-r from-purple-500/25 to-blue-500/20 border-purple-400/70 hover:border-purple-300 shadow-lg shadow-purple-500/20'
                                         : isPopular
                                         ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/10 border-purple-500/50 hover:border-purple-400'
                                         : 'bg-white/5 hover:bg-purple-500/15 border-gray-600/30 hover:border-purple-500/40'
                                       }
                                       hover:scale-[1.01] hover:shadow-md hover:shadow-purple-500/20
                                       active:scale-[0.99]`}
                            >
                              {isNexDevsChoice && (
                                <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs
                                              px-2 py-0.5 rounded-full font-bold shadow-lg">
                                  ⭐ Recommended
                                </div>
                              )}
                              {isPopular && !isNexDevsChoice && (
                                <div className="absolute top-2 right-2 bg-purple-500 text-white text-xs
                                              px-2 py-0.5 rounded-full font-medium">
                                  Popular
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex-1 pr-2">
                                  <div className="flex items-center gap-2">
                                    {isNexDevsChoice && (
                                      <span className="text-lg">🧠</span>
                                    )}
                                    <span className={`font-medium text-sm ${
                                      isNexDevsChoice ? 'text-purple-200' : 'text-white'
                                    }`}>
                                      {option.label}
                                    </span>
                                    {option.tooltip && (
                                      <Tooltip text={option.tooltip}>
                                        <HelpCircle size={12} className="text-gray-400 hover:text-purple-400" />
                                      </Tooltip>
                                    )}
                                  </div>
                                  {option.description && (
                                    <span className={`text-xs mt-1 block ${
                                      isNexDevsChoice ? 'text-purple-300' : 'text-gray-400'
                                    }`}>
                                      {isNexDevsChoice ? 'Our AI experts will analyze your needs and select the optimal model' : option.description}
                                    </span>
                                  )}
                                </div>
                                <ChevronRight
                                  size={14}
                                  className={`transition-all duration-200 group-hover:translate-x-1 flex-shrink-0 ${
                                    isNexDevsChoice ? 'text-purple-300 group-hover:text-purple-200' : 'text-gray-400 group-hover:text-purple-400'
                                  }`}
                                />
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  // Standard workflow rendering
                  <div className={`${currentStep === 3 ? 'max-h-[240px] overflow-y-auto pr-1' : ''}
                                 space-y-1.5 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent`}
                       style={{
                         willChange: 'scroll-position',
                         transform: 'translateZ(0)',
                         WebkitOverflowScrolling: 'touch'
                       }}>
                    {currentSteps[currentStep]?.options?.map((option, index) => {
                      const isPopular = currentStep === 3 &&
                        techStackOptions.find(tech => tech.value === option.value)?.popular;

                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, ease: "easeOut" }}
                        onClick={() => handleOptionSelect(option)}
                        disabled={isAnimating}
                        className={`w-full p-2.5 text-left transition-all duration-300 group
                                 rounded-lg border relative overflow-hidden
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 ${isPopular
                                   ? 'bg-gradient-to-r from-purple-500/15 to-blue-500/10 border-purple-500/50 hover:border-purple-400'
                                   : 'bg-white/5 hover:bg-purple-500/15 border-gray-600/30 hover:border-purple-500/40'
                                 }
                                 hover:scale-[1.01] hover:shadow-md hover:shadow-purple-500/20
                                 active:scale-[0.99]`}
                      >
                        {/* Popular badge */}
                        {isPopular && (
                          <div className="absolute top-1 right-1 bg-purple-500 text-white text-xs
                                        px-1.5 py-0.5 rounded-full font-medium">
                            Popular
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium pr-2 text-sm">
                            {option.label}
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-gray-400 group-hover:text-purple-400
                                     transition-all duration-200 group-hover:translate-x-1"
                          />
                        </div>
                      </motion.button>
                    );
                  })}
                  </div>
                )}

                {/* Custom tech stack input for step 3 - only for standard workflow */}
                {workflowType === 'standard' && currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-gray-600/30"
                  >
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Or specify your custom technology:
                    </label>
                    <input
                      type="text"
                      value={customTechStack}
                      onChange={(e) => setCustomTechStack(e.target.value)}
                      placeholder="e.g., Nuxt.js, Gatsby, Custom Framework..."
                      className="w-full px-3 py-2 bg-black/30 border border-gray-600/50
                               rounded-lg text-white placeholder-gray-400 text-sm
                               focus:border-purple-500/50 focus:outline-none focus:ring-2
                               focus:ring-purple-500/20 transition-all duration-200"
                    />
                    {customTechStack.trim() && (
                      <button
                        onClick={() => handleOptionSelect({
                          label: customTechStack.trim(),
                          value: 'custom-' + customTechStack.trim().toLowerCase().replace(/\s+/g, '-'),
                          action: 'next'
                        })}
                        className="mt-2 w-full py-2 px-3 bg-purple-500/20 hover:bg-purple-500/30
                                 border border-purple-500/50 rounded-lg text-purple-200 text-sm
                                 font-medium transition-all duration-200 hover:scale-[1.01]"
                      >
                        Continue with {customTechStack.trim()}
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          {currentStep > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-purple-500/30
                          bg-gradient-to-r from-transparent to-purple-500/5">
              <button
                onClick={goToPreviousStep}
                disabled={isAnimating}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400
                         hover:text-white transition-all duration-200 rounded-lg
                         hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed
                         active:scale-95"
              >
                <ChevronLeft size={14} />
                <span className="font-medium text-sm">Back</span>
              </button>

              <div className="text-xs text-gray-400 font-medium">
                Step {currentStep} of {totalSteps}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RequirementsModal;

