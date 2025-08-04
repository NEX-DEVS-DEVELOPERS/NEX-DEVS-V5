import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTimeline } from '../contexts/TimelineContext';
import { formatPrice } from '../utils/pricing';
import TimelineSelector from './TimelineSelector';
import InvoiceCalculator from './InvoiceCalculator';
import WelcomeModal from './WelcomeModal';

interface PricingPlan {
  id: string;
  title: string;
  basePrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  isNew?: boolean;
  icon?: string;
  highlightedFeatures?: string[]; // Features to highlight at the top
  category?: string; // Service category
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    basePrice: 50000,
    description: 'Professional UI/UX design services with modern interfaces and seamless user experiences',
    category: 'Design',
    features: [
      'Custom UI Design in Figma',
      'Interactive Prototypes',
      'Responsive Design System',
      'User Flow Diagrams',
      'Design Components Library',
      'Animation with Framer',
      'Design Handoff',
      'Design Documentation',
      'Collaboration Sessions',
      '3 Revision Rounds'
    ],
    highlightedFeatures: [
      'Custom UI Design in Figma',
      'Interactive Prototypes',
      'Responsive Design System'
    ],
    isNew: true,
    icon: '🎨'
  },
  {
    id: 'wordpress-basic',
    title: 'WordPress Basic',
    basePrice: 35000,
    description: 'Streamlined WordPress solution perfect for small businesses beginning their online journey',
    category: 'WordPress',
    features: [
      'Custom WordPress Theme',
      'Mobile Responsive Design',
      '5 Pages',
      'Basic SEO Setup',
      'Contact Form',
      '2 Revisions'
    ],
    highlightedFeatures: [
      'Custom WordPress Theme',
      'Mobile Responsive Design',
      'Basic SEO Setup'
    ],
    icon: '🎯'
  },
  {
    id: 'wordpress-pro',
    title: 'WordPress Professional',
    basePrice: 45000,
    description: 'Enhanced WordPress solution with advanced features for growing businesses seeking expansion',
    category: 'WordPress',
    features: [
      'Everything in Basic',
      'E-commerce Integration',
      '10 Pages',
      'Advanced SEO',
      'Social Media Integration',
      'Premium Plugins',
      '4 Revisions'
    ],
    highlightedFeatures: [
      'E-commerce Integration',
      'Advanced SEO',
      'Premium Plugins'
    ],
    popular: true,
    icon: '⚡'
  },
  {
    id: 'fullstack-basic',
    title: 'Full-Stack Basic',
    basePrice: 55000,
    description: 'Complete custom web application with modern frontend and robust backend architecture',
    category: 'Development',
    features: [
      'Custom Frontend & Backend',
      'User Authentication',
      'Database Integration',
      'API Development',
      'Basic Admin Panel',
      '3 Revisions'
    ],
    highlightedFeatures: [
      'Custom Frontend & Backend',
      'User Authentication',
      'Database Integration'
    ],
    icon: '💻'
  }
];

const PricingPlans: React.FC = () => {
  const { currency, isExemptCountry } = useCurrency();
  const { getTimelineMultiplier } = useTimeline();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Handle Get Started button click
  const handleGetStarted = (plan: PricingPlan) => {
    // Set the selected plan which will be passed to the modal
    setSelectedPlan(plan);
    // Show the modal
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Separate new plan from others
  const newPlan = pricingPlans.find(plan => plan.isNew);
  const regularPlans = pricingPlans.filter(plan => !plan.isNew);

  // Feature list components with optimized rendering
  const FeatureList = useMemo(() => ({ features, highlight = false }: { features: string[], highlight?: boolean }) => (
    <ul className={`space-y-${highlight ? '3' : '4'} ${highlight ? 'mb-5' : 'mb-8'}`}>
      {features.map((feature, index) => (
        <li key={index} className={`flex items-center ${highlight ? 'text-white' : 'text-purple-100/90'}`}>
          <svg 
            className={`${highlight ? 'w-6 h-6 text-purple-400' : 'w-5 h-5 text-purple-500'} mr-3 flex-shrink-0`} 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span className={`${highlight ? 'text-base font-medium' : 'text-sm'}`}>{feature}</span>
        </li>
      ))}
    </ul>
  ), []);

  return (
    <div className="space-y-12 pt-4 md:pt-0">
      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        icon={selectedPlan?.icon}
        planTitle={selectedPlan?.title}
      />
      
      {/* New Plan - Full Width */}
      {newPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-900/20 neon-border-red-base backdrop-blur-sm shadow-lg shadow-purple-900/10"
        >
          <TimelineSelector />
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan details - Enhanced */}
            <div>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-800/30 backdrop-blur-sm rounded-lg">
                  <span className="text-3xl">{newPlan.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-white">{newPlan.title}</h3>
                    {newPlan.isNew && (
                      <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full shadow-sm shadow-purple-500/20 flex items-center">
                        <span className="mr-1">✦</span> NEW
                      </span>
                    )}
                  </div>
                  {newPlan.category && (
                    <span className="text-xs text-purple-300">{newPlan.category.toUpperCase()}</span>
                  )}
                </div>
              </div>
              
              {/* Enhanced description */}
              <div className="mt-5 p-4 bg-black/30 rounded-xl border border-purple-500/20">
                <p className="text-gray-300 leading-relaxed">{newPlan.description}</p>
              </div>
              
              {/* Key Features - Highlighted */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Key Features
                </h4>
                {newPlan.highlightedFeatures ? (
                  <FeatureList features={newPlan.highlightedFeatures} highlight={true} />
                ) : (
                  <FeatureList features={newPlan.features.slice(0, 3)} highlight={true} />
                )}
              </div>
              
              {/* All Features */}
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  All Included
                </h4>
                <FeatureList features={newPlan.features} />
              </div>
            </div>
            {/* Pricing details - Enhanced */}
            <div>
              <div className="bg-black/30 rounded-xl p-6 border border-purple-500/20">
                <h4 className="text-lg font-semibold text-white mb-4">Pricing Details</h4>
                <InvoiceCalculator basePrice={newPlan.basePrice} />
                <button 
                  onClick={() => handleGetStarted(newPlan)}
                  className="mt-6 w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 transition-all duration-300 text-white font-semibold shadow-lg shadow-purple-700/20 flex items-center justify-center gap-2"
                >
                  <span>Get Started</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
              
              {/* Timeline indicator */}
              <div className="mt-5 flex items-center justify-center gap-2 bg-purple-900/20 py-3 px-4 rounded-lg border border-purple-500/20">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-purple-200">Estimated Timeline: <span className="font-semibold">2-3 weeks</span></span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Regular Plans Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {regularPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative transition-transform duration-150 will-change-transform"
          >
            <div className={`
              rounded-2xl p-6 backdrop-blur-lg
              ${plan.popular
                ? 'bg-gradient-to-br from-purple-900/40 to-purple-900/20 neon-border-purple-base'
                : 'bg-gradient-to-br from-black/80 to-purple-900/20'
              }
              ${!plan.popular ? (
                plan.id === 'ui-ux-design' ? 'neon-border-pink-base' :
                plan.id === 'web-development' ? 'neon-border-blue-base' :
                plan.id === 'mobile-app-development' ? 'neon-border-green-base' :
                plan.id === 'ai-integration' ? 'neon-border-cyan-base' :
                plan.id === 'e-commerce-solutions' ? 'neon-border-orange-base' :
                plan.id === 'seo-content-creation' ? 'neon-border-yellow-base' :
                plan.id === 'ai-automation' ? 'neon-border-violet-base' :
                'neon-border-lime-base'
              ) : ''}
              hover:shadow-xl hover:shadow-purple-500/10 
              transition-shadow duration-150 
            `}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md shadow-purple-600/20 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                    </svg>
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{plan.title}</h3>
                    {plan.category && (
                      <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded-full">
                        {plan.category}
                      </span>
                    )}
                  </div>
                </div>
                {plan.icon && (
                  <div className="p-2 bg-purple-800/20 backdrop-blur-sm rounded-lg">
                    <span className="text-2xl">{plan.icon}</span>
                  </div>
                )}
              </div>

              {/* Enhanced pricing section */}
              <div className="mb-5">
                <div className="flex items-center justify-between gap-2 mb-3 p-3 bg-black/30 rounded-lg border border-purple-500/10">
                  <div>
                    <div className="text-xs text-purple-300 mb-1">Starting From</div>
                    <div className="text-2xl font-bold text-white">
                      {formatPrice(plan.basePrice, currency, 1, isExemptCountry, plan.title)}
                    </div>
                  </div>
                  {['USD', 'GBP', 'AED'].includes(currency) && (
                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                      UPDATED
                    </span>
                  )}
                </div>
                <p className="text-purple-200/70 text-sm leading-relaxed">{plan.description}</p>
              </div>
              
              {/* Key Features Section */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Key Features
                </h4>
                <ul className="space-y-2.5 mb-5">
                  {(plan.highlightedFeatures || plan.features.slice(0, 3)).map((feature, index) => (
                    <li key={index} className="flex items-center text-white">
                      <svg className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Expanded Features */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    All Features
                  </h4>
                  <span className="text-xs text-purple-300">{plan.features.length} total</span>
                </div>
                <div className="p-3 bg-black/20 rounded-lg border border-purple-500/10 max-h-[180px] overflow-y-auto custom-mini-scrollbar">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-purple-100/90">
                        <svg className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <button
                onClick={() => handleGetStarted(plan)}
                className={`
                  w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                  ${plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-lg shadow-purple-700/20'
                    : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-100 border border-purple-500/30'
                  }
                `}
              >
                <span>Get Started</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Debug button - hidden in production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const randomPlan = pricingPlans[Math.floor(Math.random() * pricingPlans.length)];
              handleGetStarted(randomPlan);
            }}
            className="py-2 px-4 bg-gray-800 text-gray-300 text-xs rounded-md"
          >
            Test Welcome Modal
          </button>
        </div>
      )}
      
      {/* Custom mini scrollbar style */}
      <style jsx global>{`
        .custom-mini-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-mini-scrollbar::-webkit-scrollbar-track {
          background: rgba(168, 85, 247, 0.05);
          border-radius: 4px;
        }
        .custom-mini-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.2);
          border-radius: 4px;
        }
        .custom-mini-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.3);
        }
      `}</style>
    </div>
  );
};

export default PricingPlans;