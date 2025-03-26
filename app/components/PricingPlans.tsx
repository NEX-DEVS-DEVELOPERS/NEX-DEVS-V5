import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTimeline } from '../contexts/TimelineContext';
import { formatPrice } from '../utils/pricing';
import TimelineSelector from './TimelineSelector';
import InvoiceCalculator from './InvoiceCalculator';

interface PricingPlan {
  id: string;
  title: string;
  basePrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  isNew?: boolean;
  icon?: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    basePrice: 50000,
    description: 'Professional UI/UX design services with Figma and Framer',
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
    isNew: true,
    icon: '🎨'
  },
  {
    id: 'wordpress-basic',
    title: 'WordPress Basic',
    basePrice: 35000,
    description: 'Perfect for small businesses starting their online journey',
    features: [
      'Custom WordPress Theme',
      'Mobile Responsive Design',
      '5 Pages',
      'Basic SEO Setup',
      'Contact Form',
      '2 Revisions'
    ],
    icon: '🎯'
  },
  {
    id: 'wordpress-pro',
    title: 'WordPress Professional',
    basePrice: 45000,
    description: 'Advanced features for growing businesses',
    features: [
      'Everything in Basic',
      'E-commerce Integration',
      '10 Pages',
      'Advanced SEO',
      'Social Media Integration',
      'Premium Plugins',
      '4 Revisions'
    ],
    popular: true,
    icon: '⚡'
  },
  {
    id: 'fullstack-basic',
    title: 'Full-Stack Basic',
    basePrice: 55000,
    description: 'Custom web application with basic features',
    features: [
      'Custom Frontend & Backend',
      'User Authentication',
      'Database Integration',
      'API Development',
      'Basic Admin Panel',
      '3 Revisions'
    ],
    icon: '💻'
  }
];

const PricingPlans: React.FC = () => {
  const { currency, isExemptCountry } = useCurrency();
  const { getTimelineMultiplier } = useTimeline();

  // Separate new plan from others
  const newPlan = pricingPlans.find(plan => plan.isNew);
  const regularPlans = pricingPlans.filter(plan => !plan.isNew);

  return (
    <div className="space-y-12 pt-4 md:pt-0">
      {/* New Plan - Full Width */}
      {newPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/30 backdrop-blur-sm"
        >
          <TimelineSelector />
          <div className="grid md:grid-cols-2 gap-8">
            {/* Plan details */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl">{newPlan.icon}</span>
                <h3 className="text-2xl font-bold text-white">{newPlan.title}</h3>
                {newPlan.isNew && (
                  <span className="px-2 py-1 text-xs font-semibold bg-purple-500 text-white rounded-full">
                    NEW
                  </span>
                )}
              </div>
              <p className="mt-4 text-gray-300">{newPlan.description}</p>
              <ul className="mt-6 space-y-4">
                {newPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <svg
                      className="w-5 h-5 mr-2 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            {/* Pricing details */}
            <div>
              <InvoiceCalculator basePrice={newPlan.basePrice} />
              <button className="mt-6 w-full py-3 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold">
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Regular Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {regularPlans.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative transition-transform duration-150 will-change-transform`}
          >
            <div className={`
              rounded-2xl p-8
              ${plan.popular 
                ? 'bg-gradient-to-br from-purple-900/40 to-purple-900/20 border-purple-500/30' 
                : 'bg-gradient-to-br from-black/80 to-purple-900/20 border-purple-500/20'
              }
              border backdrop-blur-lg
              hover:shadow-xl hover:shadow-purple-500/10 
              transition-shadow duration-150 
            `}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                {plan.icon && (
                  <span className="text-2xl">{plan.icon}</span>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-3xl font-bold text-white">
                    {formatPrice(plan.basePrice, currency, 1, isExemptCountry, plan.title)}
                  </div>
                  {['USD', 'GBP', 'AED'].includes(currency) && (
                    <span className="bg-purple-500 text-white text-[10px] md:text-xs px-1.5 py-0.5 rounded-full font-medium animate-pulse">
                      UPDATED
                    </span>
                  )}
                </div>
                <p className="text-purple-200/70">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-purple-100/90">
                    <svg className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                className={`
                  w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300
                  ${plan.popular
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-100 border border-purple-500/30'
                  }
                `}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;