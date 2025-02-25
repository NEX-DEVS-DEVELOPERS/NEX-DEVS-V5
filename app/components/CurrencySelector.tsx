'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { SupportedCurrency, currencySymbols, getPriceBreakdown } from '@/app/utils/pricing';

// Currency flag icons mapping
const currencyFlags: Record<SupportedCurrency, string> = {
  PKR: '🇵🇰',
  USD: '🇺🇸',
  GBP: '🇬🇧',
  INR: '🇮🇳',
  AED: '🇦🇪'
};

const CurrencySelector = () => {
  const { currency, setCurrency, exchangeRate, exchangeRates, isExemptCountry } = useCurrency();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeline, setTimeline] = useState('Urgent (1-2 weeks)');

  const currencies: SupportedCurrency[] = ['PKR', 'USD', 'GBP', 'INR', 'AED'];

  const getCurrencyName = (code: SupportedCurrency): string => {
    const names: Record<SupportedCurrency, string> = {
      PKR: 'Pakistani Rupee',
      USD: 'US Dollar',
      GBP: 'British Pound',
      INR: 'Indian Rupee',
      AED: 'UAE Dirham'
    };
    return names[code];
  };

  const handleCurrencyChange = (newCurrency: SupportedCurrency) => {
    if (!isExemptCountry && newCurrency === 'PKR') {
      setShowWarning(true);
      setShowDropdown(false);
      return;
    }
    
    setCurrency(newCurrency);
    setShowDropdown(false);
    setShowBreakdown(true);
    setTimeout(() => setShowBreakdown(false), 5000);
  };

  const samplePrice = 1000;
  const breakdown = getPriceBreakdown(samplePrice, currency, exchangeRates[currency], isExemptCountry, timeline);

  const shouldShowInternationalFee = () => {
    return !isExemptCountry && currency !== 'PKR';
  };

  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.95,
      transformOrigin: "top"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2
      }
    }),
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setShowDropdown(!showDropdown)}
        className="group flex items-center space-x-3 bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 hover:from-zinc-800/90 hover:to-zinc-700/90 
          px-4 py-2.5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300
          shadow-lg hover:shadow-purple-500/10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl filter drop-shadow-lg">{currencyFlags[currency]}</span>
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-white">{currency}</span>
            <span className="text-xs text-gray-400">{currencySymbols[currency]}</span>
          </div>
        </div>
        <motion.div
          animate={{ rotate: showDropdown ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-2"
        >
          <svg
            className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-50 mt-2 w-72 rounded-xl bg-gradient-to-b from-zinc-900/95 to-black/95 
              border border-purple-500/20 shadow-xl backdrop-blur-md overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {currencies.map((curr, index) => (
                <motion.button
                  key={curr}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onClick={() => handleCurrencyChange(curr)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all
                    ${currency === curr
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'hover:bg-zinc-800/50 text-gray-300 hover:text-white'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl filter drop-shadow-lg">{currencyFlags[curr]}</span>
                    <div>
                      <div className="font-medium">{curr}</div>
                      <div className="text-xs text-gray-400">{getCurrencyName(curr)}</div>
                    </div>
                  </div>
                  {currency === curr && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="border-t border-purple-500/10 p-3 bg-purple-500/5">
              <div className="text-xs space-y-1.5">
                <div className="flex items-center text-purple-300">
                  <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Exchange Rate: 1 PKR = {exchangeRates[currency].toFixed(4)} {currency}</span>
                </div>
                {shouldShowInternationalFee() && (
                  <div className="flex items-center text-yellow-400/80">
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Includes 30% international service fee</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {showBreakdown && !showDropdown && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 mt-2 w-72 rounded-xl bg-gradient-to-b from-zinc-900/95 to-black/95 
              border border-purple-500/20 shadow-xl backdrop-blur-md p-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
              <h4 className="text-sm font-medium text-purple-400">Price Conversion Details</h4>
            </div>
            
            <div className="space-y-2 text-sm">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-between"
              >
                <span className="text-gray-400">Base Amount:</span>
                <span className="font-medium">{currencySymbols.PKR}{samplePrice.toFixed(2)}</span>
              </motion.div>
              
              {shouldShowInternationalFee() && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-between text-yellow-400/80"
                >
                  <span>International Fee (30%):</span>
                  <span>+{currencySymbols[currency]}{breakdown.internationalMarkup.toFixed(2)}</span>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 border-t border-purple-500/10"
              >
                <div className="flex justify-between font-medium">
                  <span className="text-purple-400">Final Amount:</span>
                  <span className="text-white">
                    {currencySymbols[currency]}{breakdown.convertedAmount.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-red-500/20 rounded-xl p-6 max-w-md w-full shadow-xl"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Location Verification Notice</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Our system has detected that your current location is outside Pakistan. Please note that international service charges will be applied to maintain service quality and support.
                  </p>
                  
                  <div className="bg-black rounded-lg p-4 mb-4 border border-red-500/10">
                    <h4 className="text-sm font-medium text-red-400 mb-2">Service Fee Structure:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">International Service Fee:</span>
                        <span className="text-red-400">30%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Calculation Example:</span>
                        <span className="text-gray-300">
                          PKR 1000 + 300 = PKR 1300
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-yellow-400/80 text-xs">
                        <span className="font-medium block mb-1">Important Notice:</span>
                        Our advanced verification system operates independently of VPN services. Changing your location using a VPN will not affect the application of international service fees.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowWarning(false)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      I Understand
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurrencySelector; 