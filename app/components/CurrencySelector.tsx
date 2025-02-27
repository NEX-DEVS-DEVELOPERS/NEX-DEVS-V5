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
  const [showNotice, setShowNotice] = useState(false);
  const [showSecondWarning, setShowSecondWarning] = useState(false);
  const [showPakistanVerification, setShowPakistanVerification] = useState(false);
  const [showLockedWarning, setShowLockedWarning] = useState(false);
  const [showInternationalWarning, setShowInternationalWarning] = useState(false);
  const [selectorOpenCount, setSelectorOpenCount] = useState(0);
  const [timeline, setTimeline] = useState('Urgent (1-2 weeks)');
  const [currentCurrency, setCurrentCurrency] = useState<SupportedCurrency>(currency);
  const [hasChangedToPKR, setHasChangedToPKR] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isLocked, setIsLocked] = useState(false);

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
    if (newCurrency === 'PKR' && !hasChangedToPKR && ['USD', 'GBP', 'INR', 'AED'].includes(currency)) {
      setCurrentCurrency(currency);
      setShowPakistanVerification(true);
      setShowDropdown(false);
      return;
    }
    
    setCurrency(newCurrency);
    setShowDropdown(false);
    setShowBreakdown(true);
    setTimeout(() => setShowBreakdown(false), 5000);
  };

  const handleCurrencyClick = () => {
    if (isLocked) {
      setShowLockedWarning(true);
      return;
    }
    
    // For international users, show the international warning
    if (!isExemptCountry && currency !== 'PKR') {
      setShowInternationalWarning(true);
      return;
    }
    
    setSelectorOpenCount(prev => prev + 1);
    if (selectorOpenCount === 0) {
      setShowNotice(true);
    } else {
      setShowSecondWarning(true);
    }
  };

  const samplePrice = 1000;
  const breakdown = getPriceBreakdown(samplePrice, currency, exchangeRates[currency], isExemptCountry, timeline);

  const shouldShowInternationalFee = () => {
    return !isExemptCountry && currency !== 'PKR';
  };

  // Optimize animations for better performance
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
      scale: 0.99,
      transformOrigin: "top center"
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1], // Optimized spring-like easing
        staggerChildren: 0.03,
        delayChildren: 0.02
      }
    },
    exit: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: [0.36, 0, 0.66, -0.56]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }),
    hover: {
      scale: 1.02,
      x: 4,
      backgroundColor: "rgba(139, 92, 246, 0.15)",
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: { 
      scale: 1.01,
      y: -1,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    tap: { 
      scale: 0.99,
      transition: {
        duration: 0.1,
        ease: "easeOut"
      }
    }
  };

  const handleVerifyLocation = () => {
    if (!userLocation.trim()) {
      setLocationError('Please enter your location');
      return;
    }
    
    // Basic validation for Pakistan cities/regions
    const pakistanCities = [
      'islamabad', 'lahore', 'karachi', 'peshawar', 'quetta', 'multan', 
      'faisalabad', 'rawalpindi', 'gujranwala', 'sialkot', 'hyderabad',
      'punjab', 'sindh', 'balochistan', 'khyber pakhtunkhwa', 'gilgit baltistan'
    ];
    
    const normalizedLocation = userLocation.trim().toLowerCase();
    const isValidPakistanLocation = pakistanCities.some(city => 
      normalizedLocation.includes(city) || city.includes(normalizedLocation)
    );

    if (!isValidPakistanLocation) {
      setLocationError('Please enter a valid location in Pakistan');
      return;
    }

    setLocationError('');
    setShowPakistanVerification(false);
    setCurrency('PKR');
    setHasChangedToPKR(true);
    setIsLocked(true);
    setShowBreakdown(true);
    setTimeout(() => setShowBreakdown(false), 5000);
  };

  return (
    <div className="relative flex flex-col items-center w-full px-4">
      <div className="w-full max-w-[300px] mx-auto relative">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover={isLocked ? undefined : "hover"}
          whileTap={isLocked ? undefined : "tap"}
          onClick={handleCurrencyClick}
          className={`group flex items-center justify-between space-x-3 w-full
            ${isLocked 
              ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
              : 'bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 hover:from-zinc-800/90 hover:to-zinc-700/90'
            }
            px-4 py-3 rounded-xl border border-white/10 hover:border-purple-500/30 
            transition-all duration-200
            shadow-lg hover:shadow-purple-500/10`}
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <motion.span 
                className="text-2xl filter drop-shadow-lg"
                animate={{ 
                  rotate: showDropdown ? [0, -5, 5, -3, 0] : [0, 5, 0, -5, 0], 
                  scale: showDropdown ? [1, 1.15, 1] : [1, 1.1, 1],
                  transition: {
                    duration: showDropdown ? 0.3 : 0.5
                  }
                }}
              >
                {currencyFlags[currency]}
              </motion.span>
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-1 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                >
                  <span className="text-sm">🔒</span>
                </motion.div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-white">{currency}</span>
                {isLocked && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-medium text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20"
                  >
                    Locked
                  </motion.span>
                )}
              </div>
              <span className="text-xs text-gray-400">{getCurrencyName(currency)}</span>
            </div>
          </div>
          <motion.div
            animate={{ 
              rotate: showDropdown ? 180 : 0,
              y: showDropdown ? 2 : 0,
              scale: showDropdown ? 1.1 : 1
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.34, 1.56, 0.64, 1]
            }}
          >
            <svg
              className={`w-4 h-4 ${isLocked ? 'text-orange-400' : 'text-purple-400 group-hover:text-purple-300'} transition-colors`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>

        {/* Location Text - Enhanced with Lock Status */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="absolute -bottom-12 left-0 right-0 flex justify-center"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-yellow-500/30 to-yellow-500/20 rounded-lg blur"></div>
            <div className={`relative flex items-center justify-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border
              ${isLocked ? 'border-orange-500/30' : 'border-yellow-500/30'}`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-orange-500' : 'bg-yellow-500'}`}
              />
              <span className={`text-xs font-medium tracking-wider
                ${isLocked 
                  ? 'bg-gradient-to-r from-orange-200 to-orange-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent'
                }`}
              >
                {isLocked ? 'CURRENCY LOCKED TO PKR' : 'YOUR LOCATION IS AUTOMATICALLY SET'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Notice Modal */}
        <AnimatePresence>
          {showNotice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowNotice(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-zinc-900 to-black border-2 border-yellow-500/20 rounded-xl p-6 max-w-md w-full shadow-xl relative overflow-hidden"
              >
                {/* Warning Pulse Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.1, 0.15, 0.1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 bg-yellow-500/10 pointer-events-none"
                />

                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/20 via-yellow-500/30 to-yellow-500/20 rounded-lg blur"></div>
                    <div className="relative flex items-center space-x-2 px-4 py-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-2 bg-yellow-500 rounded-full"
                      />
                      <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                        Security Notice
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-500/5 rounded-lg p-4 border border-yellow-500/10">
                    <div className="flex items-start space-x-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-xl mt-0.5"
                      >
                        ⚠️
                      </motion.div>
                      <p className="text-gray-300 text-sm">
                        Currency changes are monitored for security. Only proceed if:
                      </p>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Location Error</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Support Directed</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Business Need</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Payment Issue</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-4">
                    <h4 className="text-yellow-400 text-xs font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Transaction Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          International transactions incur a <span className="text-yellow-400">30% service fee</span> for payment processing and support
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          Currency changes may trigger <span className="text-yellow-400">additional verification</span> to prevent fraudulent activities
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          Exchange rates are <span className="text-yellow-400">locked at checkout</span> to protect against market fluctuations
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-yellow-200/80 text-xs">
                        Unauthorized changes will trigger security verification and may delay your transaction
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setShowNotice(false);
                        setShowDropdown(true);
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>I Understand</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowNotice(false)}
                      className="flex-1 py-2 bg-transparent border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/5 text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Second Warning Modal */}
        <AnimatePresence>
          {showSecondWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowSecondWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-red-900/10 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto relative border border-red-500/30"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-red-500/30 to-red-500/20 rounded-lg blur"></div>
                      <div className="relative flex items-center space-x-2 px-4 py-2">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-2 h-2 bg-red-500 rounded-full"
                        />
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-red-200 to-red-400 bg-clip-text text-transparent">
                          Final Currency Warning
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                    <div className="flex items-start space-x-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-xl mt-0.5"
                      >
                        ⚠️
                      </motion.div>
                      <p className="text-gray-300 text-sm">
                        Multiple currency changes may trigger additional security verification. Are you sure you want to proceed?
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                    <h4 className="text-red-400 text-xs font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Security Notice
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          Multiple currency changes within a short period may flag your account for review
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          Additional verification steps may be required for your next transaction
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          This action will be logged for security purposes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setShowSecondWarning(false);
                        setShowDropdown(true);
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>Proceed Anyway</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowSecondWarning(false)}
                      className="flex-1 py-2 bg-transparent border border-red-500/20 text-red-300 hover:bg-red-500/5 text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pakistan Verification Modal */}
        <AnimatePresence>
          {showPakistanVerification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowPakistanVerification(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-green-900/10 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto relative border border-green-500/30"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-500/20 rounded-lg blur"></div>
                      <div className="relative flex items-center space-x-2 px-4 py-2">
                        <span className="text-2xl">🇵🇰</span>
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-green-200 to-green-400 bg-clip-text text-transparent">
                          Pakistan Verification
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/5 rounded-lg p-4 border border-green-500/10">
                    <div className="flex items-start space-x-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-2xl mt-0.5 flex items-center justify-center"
                      >
                        <span className="mr-1">⚠️</span><span>🔒</span>
                      </motion.div>
                      <p className="text-gray-300 text-sm">
                        To switch to PKR, please confirm that you are physically located in Pakistan. This is a one-time change and cannot be reversed.
                      </p>
                    </div>
                  </div>

                  {/* Location Input Section */}
                  <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                    <h4 className="text-green-400 text-xs font-medium mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Your Location in Pakistan
                    </h4>
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type="text"
                          value={userLocation}
                          onChange={(e) => {
                            setUserLocation(e.target.value);
                            setLocationError('');
                          }}
                          placeholder="Enter your city/region in Pakistan"
                          className="w-full bg-black/50 border border-green-500/20 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                        />
                        {locationError && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-6 left-0 text-red-400 text-xs"
                          >
                            {locationError}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4">
                    <h4 className="text-green-400 text-xs font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Notice
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-green-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          This change is permanent and can only be made once
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          False verification may result in service restrictions
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          Your IP and location data will be verified
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleVerifyLocation}
                      className="flex-1 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>Verify & Switch to PKR</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowPakistanVerification(false)}
                      className="flex-1 py-2 bg-transparent border border-green-500/20 text-green-300 hover:bg-green-500/5 text-sm font-medium rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Locked Warning Modal */}
        <AnimatePresence>
          {showLockedWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowLockedWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-orange-900/10 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto relative border border-orange-500/30"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-orange-500/30 to-orange-500/20 rounded-lg blur"></div>
                      <div className="relative flex items-center space-x-2 px-4 py-2">
                        <span className="text-2xl">🔒</span>
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-200 to-orange-400 bg-clip-text text-transparent">
                          Currency Locked
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/5 rounded-lg p-4 border border-orange-500/10">
                    <div className="flex items-start space-x-3">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-xl mt-0.5"
                      >
                        ⚠️
                      </motion.div>
                      <div className="space-y-2">
                        <p className="text-gray-300 text-sm">
                          Your currency has been locked to PKR after verification. Any attempts to change currency now will:
                        </p>
                        <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 ml-2">
                          <li>Incur a mandatory 30% international service fee</li>
                          <li>Require additional identity verification</li>
                          <li>Flag your account for security review</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-4">
                    <h4 className="text-orange-400 text-xs font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Need Help?
                    </h4>
                    <p className="text-gray-300 text-xs">
                      If you believe this is an error or need to change your currency for legitimate business purposes, please contact our support team.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowLockedWarning(false)}
                    className="w-full py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>I Understand</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* International User Warning Modal */}
        <AnimatePresence>
          {showInternationalWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setShowInternationalWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-blue-900/10 backdrop-blur-md rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto relative border border-blue-500/30"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-blue-500/30 to-blue-500/20 rounded-lg blur"></div>
                      <div className="relative flex items-center space-x-2 px-4 py-2">
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                        />
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                          Location Restricted
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/10">
                    <div className="flex items-start space-x-3">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-2xl mt-0.5 flex items-center justify-center"
                      >
                        <span className="mr-1">⚠️</span><span>🔒</span>
                      </motion.div>
                      <p className="text-gray-300 text-sm">
                        <span className="text-blue-300 font-semibold">Currency changes are not allowed for international users.</span> Your location has been automatically detected and the appropriate currency has been set for your region.
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                    <h4 className="text-blue-400 text-xs font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          Our system has detected your location and set the appropriate currency
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          International transactions include a 30% service fee for payment processing
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-xs">
                          For special currency requirements, please contact our support team
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowInternationalWarning(false)}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>I Understand</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute left-0 right-0 top-full mt-2 z-50 w-full rounded-xl bg-gradient-to-b from-zinc-900/95 to-black/95 
                border border-purple-500/20 shadow-xl backdrop-blur-md overflow-hidden"
              style={{ 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 15px -5px rgba(139, 92, 246, 0.3)"
              }}
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
                        ? 'bg-purple-500/20 text-purple-300 backdrop-blur-sm'
                        : 'hover:bg-zinc-800/50 text-gray-300 hover:text-white'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.span 
                        className="text-2xl filter drop-shadow-lg"
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, 5, 0, -5, 0],
                          transition: { 
                            duration: 0.6,
                            ease: "easeInOut"
                          }
                        }}
                      >
                        {currencyFlags[curr]}
                      </motion.span>
                      <div>
                        <div className="font-medium">{curr}</div>
                        <div className="text-xs text-gray-400">{getCurrencyName(curr)}</div>
                      </div>
                    </div>
                    {currency === curr && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 17 
                        }}
                      >
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.2,
                    duration: 0.3
                  }
                }}
                className="border-t border-purple-500/10 p-3 bg-purple-500/5"
              >
                <div className="text-xs space-y-1.5">
                  <motion.div 
                    className="flex items-center text-purple-300"
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>Exchange Rate: 1 PKR = {exchangeRates[currency].toFixed(4)} {currency}</span>
                  </motion.div>
                  {shouldShowInternationalFee() && (
                    <motion.div 
                      className="flex items-center text-yellow-400/80"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Includes 30% international service fee</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {showBreakdown && !showDropdown && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.97 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.4,
                  ease: [0.34, 1.56, 0.64, 1]
                }
              }}
              exit={{ 
                opacity: 0, 
                y: 10, 
                scale: 0.95,
                transition: {
                  duration: 0.25,
                  ease: [0.36, 0, 0.66, -0.56]
                }
              }}
              className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-gradient-to-b from-zinc-900/95 to-black/95 
                border border-purple-500/30 shadow-xl backdrop-blur-md p-5"
              style={{ 
                boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.8), 0 0 20px -5px rgba(139, 92, 246, 0.3)"
              }}
            >
              <div className="flex items-center justify-center space-x-2 mb-4 border-b border-purple-500/20 pb-2">
                <motion.div 
                  className="w-2 h-2 bg-purple-500 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.div>
                <h4 className="text-sm font-medium text-purple-300">Price Conversion Details</h4>
              </div>
              
              <div className="space-y-3 text-sm">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-300 font-medium">Base Amount:</span>
                  <span className="font-medium text-white bg-purple-900/20 px-2 py-1 rounded">
                    {currencySymbols.PKR}{samplePrice.toFixed(2)}
                  </span>
                </motion.div>
                
                {shouldShowInternationalFee() && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-yellow-400 font-medium">International Fee (30%):</span>
                    <span className="text-yellow-300 bg-yellow-900/20 px-2 py-1 rounded">
                      +{currencySymbols[currency]}{breakdown.internationalMarkup.toFixed(2)}
                    </span>
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: {
                      delay: 0.3,
                      duration: 0.3
                    }
                  }}
                  className="pt-3 border-t border-purple-500/20 mt-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 font-medium">Final Amount:</span>
                    <motion.span 
                      className="font-semibold bg-purple-500/20 text-white px-3 py-1.5 rounded-lg"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 0px rgba(139, 92, 246, 0)",
                          "0 0 10px rgba(139, 92, 246, 0.3)",
                          "0 0 0px rgba(139, 92, 246, 0)"
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {currencySymbols[currency]}{breakdown.convertedAmount.toFixed(2)}
                    </motion.span>
                  </div>
                </motion.div>
              </div>

              {/* Close button */}
              <motion.button
                className="absolute top-2 right-2 text-gray-400 hover:text-white p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowBreakdown(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
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
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.95, 
                  y: 20,
                  transition: {
                    duration: 0.2
                  }
                }}
                className="bg-[#0A0A0A] border border-red-500/20 rounded-xl p-6 max-w-md w-full shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <motion.div 
                    className="p-2 bg-red-500/10 rounded-lg"
                    animate={{
                      boxShadow: ["0 0 0px rgba(239, 68, 68, 0)", "0 0 15px rgba(239, 68, 68, 0.3)", "0 0 0px rgba(239, 68, 68, 0)"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Location Verification Notice</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      Our system has detected that your current location is using {getCurrencyName(currentCurrency)} ({currentCurrency}). Please note that international service charges will be applied to maintain service quality and support.
                    </p>
                    
                    <motion.div 
                      className="bg-black rounded-lg p-4 mb-4 border border-red-500/10"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-sm font-medium text-red-400 mb-2">Service Fee Structure:</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">International Service Fee:</span>
                          <span className="text-red-400">30%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Calculation Example:</span>
                          <span className="text-gray-300">
                            {currencySymbols[currentCurrency]}{1000} + {currencySymbols[currentCurrency]}{300} = {currencySymbols[currentCurrency]}{1300}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3 mb-4"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-start space-x-2">
                        <svg className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-yellow-400/80 text-xs">
                          <span className="font-medium block mb-1">Important Notice:</span>
                          Our advanced verification system operates independently of VPN services. Changing your location using a VPN will not affect the application of international service fees.
                        </p>
                      </div>
                    </motion.div>

                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(239, 68, 68, 0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowWarning(false)}
                        className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
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
    </div>
  );
};

export default CurrencySelector;