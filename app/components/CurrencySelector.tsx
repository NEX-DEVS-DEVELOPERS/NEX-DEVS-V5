'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { SupportedCurrency, currencySymbols, getPriceBreakdown, getLocationData } from '@/app/utils/pricing';

// Currency flag icons mapping
const currencyFlags: Record<SupportedCurrency, string> = {
  PKR: '🇵🇰',
  USD: '🇺🇸',
  GBP: '🇬🇧',
  INR: '🇮🇳',
  AED: '🇦🇪'
};

// Add this type definition
type RestrictedCurrency = 'GBP' | 'AED' | 'INR' | 'USD';

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
  const [showUSLocationNotice, setShowUSLocationNotice] = useState(false);
  const [selectorOpenCount, setSelectorOpenCount] = useState(0);
  const [timeline, setTimeline] = useState('Urgent (1-2 weeks)');
  const [currentCurrency, setCurrentCurrency] = useState<SupportedCurrency>(currency);
  const [hasChangedToPKR, setHasChangedToPKR] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [locationError, setLocationError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isUSLocation, setIsUSLocation] = useState(false);
  const [showQuickReadWarning, setShowQuickReadWarning] = useState(false);
  const [noticeShowTime, setNoticeShowTime] = useState<number | null>(null);
  const [hasReadOnce, setHasReadOnce] = useState(false);
  const [showPakistanWarning, setShowPakistanWarning] = useState(false);

  const currencies: SupportedCurrency[] = ['PKR', 'USD', 'GBP', 'INR', 'AED'];

  // Add this near the top of the component
  const restrictedCurrencies: RestrictedCurrency[] = ['GBP', 'AED', 'INR', 'USD'];

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
    // Allow Pakistani users to change currency with warnings
    if (currency === 'PKR' || userLocation.toLowerCase().includes('pakistan')) {
      if (currency === 'PKR' && newCurrency !== 'PKR') {
        setShowPakistanWarning(true);
        setCurrentCurrency(newCurrency);
      return;
    }
    setCurrency(newCurrency);
    setShowDropdown(false);
    setShowBreakdown(true);
    setTimeout(() => setShowBreakdown(false), 5000);
    } else {
      setShowInternationalWarning(true);
      return;
    }
  };
    
  const handleCurrencyClick = () => {
    // Check if user is from Pakistan
    if (currency === 'PKR' || userLocation.toLowerCase().includes('pakistan')) {
    setSelectorOpenCount(prev => prev + 1);
    if (selectorOpenCount === 0) {
      setShowNotice(true);
    } else {
      setShowSecondWarning(true);
      }
    } else {
      setShowInternationalWarning(true);
    }
  };

  const samplePrice = 1000;
  const breakdown = getPriceBreakdown(samplePrice, currency, exchangeRates[currency], isExemptCountry, timeline);

  const shouldShowInternationalFee = () => {
    return !isExemptCountry && currency !== 'PKR';
  };

  // Simplify dropdown animations for better performance
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -8,
      // Remove scaleY transform to improve performance
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween", // Change from spring to tween for better performance
        duration: 0.2,
        staggerChildren: 0.02, // Reduce stagger time
        delayChildren: 0.02 // Reduce delay
      }
    },
    exit: {
      opacity: 0,
      y: -4,
      transition: {
        duration: 0.15, // Faster exit animation
      }
    }
  };

  // Simplify item animations for better performance
  const itemVariants = {
    hidden: { 
      opacity: 0,
      x: -5, // Reduced movement
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "tween", // Change from spring to tween
        duration: 0.2,
        delay: 0.02 // Reduced delay
      }
    },
    hover: {
      x: 3, // Reduced movement on hover
      backgroundColor: "rgba(139, 92, 246, 0.15)",
      transition: {
        duration: 0.2 // Faster transition
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  // Simplify button animations
  const buttonVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    hover: { 
      scale: 1.01,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.99,
      transition: { duration: 0.1 }
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

  // Add these helper functions
  const getCurrencyRegion = (curr: SupportedCurrency): string => {
    const regions: Record<SupportedCurrency, string> = {
      GBP: 'United Kingdom',
      AED: 'United Arab Emirates',
      INR: 'India',
      PKR: 'Pakistan',
      USD: 'United States'
    };
    return regions[curr];
  };

  const getCurrencySymbol = (curr: SupportedCurrency): string => {
    const symbols: Record<SupportedCurrency, string> = {
      GBP: '£',
      AED: 'د.إ',
      INR: '₹',
      PKR: '₨',
      USD: '$'
    };
    return symbols[curr];
  };

  const handleUSNoticeClose = () => {
    const timeShown = noticeShowTime ? Date.now() - noticeShowTime : 0;
    setShowQuickReadWarning(true); // Always show the quick read warning
    if (timeShown >= 2000) {
      setShowUSLocationNotice(false);
    }
    setHasReadOnce(true);
  };

  useEffect(() => {
    if (showUSLocationNotice) {
      setNoticeShowTime(Date.now());
    }
  }, [showUSLocationNotice]);

  useEffect(() => {
    // Check if user is from US when component mounts
    const checkUSLocation = async () => {
      try {
        const locationData = await getLocationData('');
        if (locationData.country === 'US') {
          setIsUSLocation(true);
          setShowUSLocationNotice(true);
        }
      } catch (error) {
        console.error('Error checking location:', error);
      }
    };
    checkUSLocation();
  }, []);

  return (
    <div className="relative flex flex-col items-center w-full px-4">
      <div className="w-full max-w-[280px] mx-auto relative z-20">
        <motion.button
          variants={buttonVariants}
          initial="initial"
          animate="animate"
          whileHover={isLocked ? undefined : "hover"}
          whileTap={isLocked ? undefined : "tap"}
          onClick={handleCurrencyClick}
          className={`group flex items-center justify-between space-x-2 w-full
            ${isLocked 
              ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
              : 'bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 hover:from-zinc-800/90 hover:to-zinc-700/90'
            }
            px-3 py-2 rounded-xl border border-white/10 hover:border-purple-500/30 
            transition-all duration-200
            shadow-lg hover:shadow-purple-500/10`}
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <motion.span 
                className="text-xl filter drop-shadow-lg"
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
                  className="absolute -top-2 -right-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-0.5 shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                >
                  <span className="text-xs">🔒</span>
                </motion.div>
              )}
            </div>
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-semibold text-white">{currency}</span>
                {isLocked && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-medium text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full border border-orange-500/20"
                  >
                    Locked
                  </motion.span>
                )}
              </div>
              <span className="text-[10px] text-gray-400">{getCurrencyName(currency)}</span>
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

        {/* Modern Location Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="absolute -bottom-6 left-0 right-0 flex justify-center"
        >
          <div className="relative group cursor-default">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-violet-500/20 to-purple-500/10 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className={`relative flex items-center justify-center space-x-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg border
              ${isLocked ? 'border-orange-500/20' : 'border-violet-500/20'}`}
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
                className={`w-1.5 h-1.5 rounded-full ${isLocked ? 'bg-orange-500' : 'bg-violet-500'}`}
              />
              <div className="flex items-center space-x-1.5">
                <motion.span 
                  className={`text-[10px] font-medium tracking-wide
                    ${isLocked 
                      ? 'text-orange-200'
                      : 'text-violet-200'
                    }`}
                >
                  {isLocked ? 'REGION LOCKED' : 'REGION DETECTED'}
                </motion.span>
                <motion.span
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-sm opacity-80"
                >
                  {isLocked ? '🔒' : '📍'}
                </motion.span>
              </div>
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
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[200] p-2"
              onClick={() => setShowNotice(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-zinc-900 to-black border border-yellow-500/20 rounded-xl p-3 max-w-[280px] sm:max-w-[350px] md:max-w-[420px] w-full shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-center mb-3">
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
                      <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                        Security Notice
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/10">
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
                      <p className="text-gray-300 text-[10px] sm:text-xs">
                        Currency changes are monitored for security. Only proceed if:
                      </p>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Location Error</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Support Directed</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Business Need</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-gray-300">
                        <span className="text-yellow-500">•</span>
                        <span>Payment Issue</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">
                    <h4 className="text-yellow-400 text-[10px] sm:text-xs font-medium mb-1 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Transaction Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          International transactions incur a <span className="text-yellow-400">30% service fee</span> for payment processing and support
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Currency changes may trigger <span className="text-yellow-400">additional verification</span> to prevent fraudulent activities
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-yellow-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Exchange rates are <span className="text-yellow-400">locked at checkout</span> to protect against market fluctuations
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-2">
                    <div className="flex items-center space-x-1">
                      <svg className="w-3 h-3 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-yellow-200/80 text-[10px] sm:text-xs">
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
                      className="flex-1 py-1 sm:py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black text-[10px] sm:text-xs font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>I Understand</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowNotice(false)}
                      className="flex-1 py-1 sm:py-1.5 bg-transparent border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/5 text-[10px] sm:text-xs font-medium rounded-lg transition-colors"
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
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[200] p-2"
              onClick={() => setShowSecondWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-red-900/10 backdrop-blur-md rounded-xl p-3 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px] mx-auto relative border border-red-500/30"
              >
                <div className="space-y-3">
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
                        <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-red-200 to-red-400 bg-clip-text text-transparent">
                          Final Currency Warning
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-500/5 rounded-lg p-3 border border-red-500/10">
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
                      <p className="text-gray-300 text-[10px] sm:text-xs">
                        Multiple currency changes may trigger additional security verification. Are you sure you want to proceed?
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                    <h4 className="text-red-400 text-[10px] sm:text-xs font-medium mb-1 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Security Notice
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Multiple currency changes within a short period may flag your account for review
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Additional verification steps may be required for your next transaction
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-red-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
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
                      className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>Proceed Anyway</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowSecondWarning(false)}
                      className="w-full py-1.5 sm:py-2 bg-transparent border border-red-500/20 text-red-300 hover:bg-red-500/5 text-xs sm:text-sm font-medium rounded-lg transition-colors"
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
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[200] p-2"
              onClick={() => setShowPakistanVerification(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-green-900/10 backdrop-blur-md rounded-xl p-3 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px] mx-auto relative border border-green-500/30"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-green-500/30 to-green-500/20 rounded-lg blur"></div>
                      <span className="text-xl">🇵🇰</span>
                      <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-green-200 to-green-400 bg-clip-text text-transparent">
                        Pakistan Verification
                      </h3>
                    </div>
                  </div>

                  <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
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
                        className="text-xl mt-0.5 flex items-center justify-center"
                      >
                        <span className="mr-1">⚠️</span><span>🔒</span>
                      </motion.div>
                      <p className="text-gray-300 text-[10px] sm:text-xs">
                        To switch to PKR, please confirm that you are physically located in Pakistan. This is a one-time change and cannot be reversed.
                      </p>
                    </div>
                  </div>

                  {/* Location Input Section */}
                  <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                    <h4 className="text-green-400 text-[10px] sm:text-xs font-medium mb-3 flex items-center">
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
                          className="w-full bg-black/50 border border-green-500/20 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-[10px] sm:text-xs focus:outline-none focus:border-green-500/50 transition-colors"
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

                  <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-3">
                    <h4 className="text-green-400 text-[10px] sm:text-xs font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Notice
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <span className="text-green-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          This change is permanent and can only be made once
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          False verification may result in service restrictions
                        </p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <span className="text-green-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Your IP and location data will be verified
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleVerifyLocation}
                      className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                    >
                      <span>Verify & Switch to PKR</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setShowPakistanVerification(false)}
                      className="w-full py-1.5 sm:py-2 bg-transparent border border-green-500/20 text-green-300 hover:bg-green-500/5 text-xs sm:text-sm font-medium rounded-lg transition-colors"
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
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[200] p-2"
              onClick={() => setShowLockedWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-orange-900/10 backdrop-blur-md rounded-xl p-3 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px] mx-auto relative border border-orange-500/30"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-orange-500/30 to-orange-500/20 rounded-lg blur"></div>
                      <span className="text-xl">🔒</span>
                      <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-orange-200 to-orange-400 bg-clip-text text-transparent">
                        Currency Locked
                      </h3>
                    </div>
                  </div>

                  <div className="bg-orange-500/5 rounded-lg p-3 border border-orange-500/10">
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
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Your currency has been locked to PKR after verification. Any attempts to change currency now will:
                        </p>
                        <ul className="list-disc list-inside text-[10px] sm:text-xs text-gray-400 space-y-1 ml-1">
                          <li className="text-[10px] sm:text-xs">Incur a mandatory 30% international service fee</li>
                          <li className="text-[10px] sm:text-xs">Require additional identity verification</li>
                          <li className="text-[10px] sm:text-xs">Flag your account for security review</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-3">
                    <h4 className="text-orange-400 text-[10px] sm:text-xs font-medium mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Need Help?
                    </h4>
                    <p className="text-gray-300 text-[10px] sm:text-xs">
                      If you believe this is an error or need to change your currency for legitimate business purposes, please contact our support team.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowLockedWarning(false)}
                    className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
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
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[200] p-2"
              onClick={() => setShowInternationalWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-black/95 to-blue-900/10 backdrop-blur-md rounded-xl p-3 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px] mx-auto relative border border-blue-500/30"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-blue-500/30 to-blue-500/20 rounded-lg blur"></div>
                      <span className="text-xl">{currencyFlags[currency]}</span>
                      <h3 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent">
                        Location Restricted
                      </h3>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">⚠️</div>
                      <div className="space-y-2">
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Currency changes are not allowed for users in {getCurrencyRegion(currency as SupportedCurrency)}. Your location has been automatically detected and {currency} ({getCurrencySymbol(currency)}) has been set as your currency.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3">
                    <h4 className="text-blue-400 text-[10px] sm:text-xs font-medium mb-1 flex items-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Information
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          Our system has detected your location and set {currency} as your currency
                        </p>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          International transactions include a 30% service fee for payment processing
                        </p>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-blue-500 text-xs mt-1">•</span>
                        <p className="text-gray-300 text-[10px] sm:text-xs">
                          For special currency requirements, please contact our support team
                        </p>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowInternationalWarning(false)}
                    className="w-full py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-[10px] sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <span>I Understand</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Read Warning Modal */}
        <AnimatePresence>
          {showQuickReadWarning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[200] p-2"
              onClick={() => setShowQuickReadWarning(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }
                }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-[#1E1E2E] to-[#2D2D44] backdrop-blur-xl rounded-2xl p-8 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px] mx-auto relative overflow-hidden border border-white/10"
              >
                {/* Animated background effect */}
                <motion.div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.1) 0%, transparent 50%)`,
                    backgroundSize: '200% 200%'
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '100% 100%'],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />

                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl" />

                <div className="relative space-y-6">
                  {/* Header section */}
                  <div className="flex items-center justify-center">
                    <motion.div 
                      className="relative"
                      animate={{ 
                        y: [0, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-violet-500/20 rounded-full blur-lg" />
                      <span className="relative text-4xl sm:text-5xl">🧐</span>
                    </motion.div>
                  </div>

                  {/* Content section */}
                  <div className="text-center space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-200 via-purple-200 to-violet-200 bg-clip-text text-transparent">
                        Speed Reader?
                      </h3>
                      <div className="h-0.5 w-16 mx-auto mt-2 bg-gradient-to-r from-violet-500/0 via-purple-500/50 to-violet-500/0" />
                    </motion.div>
                    
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-300 text-base sm:text-lg leading-relaxed"
                    >
                      Did you really read it in a second?
                      <motion.span
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="inline-block ml-2"
                      >
                        🤨
                      </motion.span>
                    </motion.p>
                  </div>

                  {/* Buttons section */}
                  <div className="flex flex-col gap-3">
                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowQuickReadWarning(false);
                        setShowUSLocationNotice(false);
                      }}
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 p-px focus:outline-none"
                    >
                      <div className="relative bg-black/30 backdrop-blur-md rounded-xl p-3">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold text-white text-sm sm:text-base">Yes, I Did</span>
                          <motion.span
                            animate={{
                              x: [0, 3, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          >
                            ⚡️
                          </motion.span>
                        </div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowQuickReadWarning(false);
                        setShowUSLocationNotice(true);
                        setNoticeShowTime(Date.now());
                      }}
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-600/20 p-px focus:outline-none"
                    >
                      <div className="relative bg-black/30 backdrop-blur-md rounded-xl p-3 group-hover:bg-black/40 transition-colors">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="font-semibold text-violet-200">Let me read again</span>
                          <motion.span
                            animate={{
                              rotate: [0, 10, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className="inline-block"
                          >
                            📖
                          </motion.span>
                        </div>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* US Location Notice Modal */}
        <AnimatePresence>
          {showUSLocationNotice && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[200] p-4"
              onClick={() => handleUSNoticeClose()}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className={`backdrop-blur-md rounded-xl p-5 w-full max-w-[280px] sm:max-w-[350px] md:max-w-[420px] mx-auto relative border shadow-[0_0_25px_-5px_rgba(59,130,246,0.3)] ${
                  hasReadOnce 
                    ? 'bg-gradient-to-br from-[#2A0A2B] to-[#4A1A4B] border-purple-500/30'
                    : 'bg-gradient-to-br from-[#0A0A1B] to-[#1A1A3A] border-blue-500/30'
                }`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className={`absolute -inset-1 bg-gradient-to-r rounded-lg blur-sm ${
                          hasReadOnce
                            ? 'from-purple-500/20 via-purple-500/30 to-purple-500/20'
                            : 'from-blue-500/20 via-blue-500/30 to-blue-500/20'
                        }`}></div>
                        <span className="relative text-2xl">🇺🇸</span>
                      </div>
                      <div>
                        <h3 className={`text-lg sm:text-xl font-semibold bg-gradient-to-r bg-clip-text text-transparent ${
                          hasReadOnce
                            ? 'from-purple-300 to-purple-100'
                            : 'from-blue-300 to-blue-100'
                        }`}>
                          Welcome to NEX-WEBS
                        </h3>
                      </div>
                    </div>
                  </div>
                  
                  {/* Main Content */}
                  <div className={`rounded-lg p-3 border ${
                    hasReadOnce
                      ? 'bg-purple-500/10 border-purple-500/20'
                      : 'bg-blue-500/10 border-blue-500/20'
                  }`}>
                    <div className="flex items-start space-x-2">
                      <span className="text-lg mt-0.5">ℹ️</span>
                      <p className={`text-sm sm:text-base leading-relaxed ${
                        hasReadOnce ? 'text-purple-50' : 'text-blue-50'
                      }`}>
                        For your convenience, USD has been set as your default currency. We support global transactions with flexible payment options.
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className={`rounded-lg p-3 border ${
                    hasReadOnce
                      ? 'bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-600/20'
                      : 'bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-600/20'
                  }`}>
                    <h4 className={`text-xs sm:text-sm font-medium mb-2 flex items-center ${
                      hasReadOnce ? 'text-purple-300' : 'text-blue-300'
                    }`}>
                      <svg className={`w-4 h-4 mr-1.5 ${
                        hasReadOnce ? 'text-purple-400' : 'text-blue-400'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Payment Information
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className={`text-xs mt-1 ${
                          hasReadOnce ? 'text-purple-400' : 'text-blue-400'
                        }`}>•</span>
                        <p className="text-gray-200 text-xs sm:text-sm">
                          All prices are displayed in USD for US-based clients
                        </p>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className={`text-xs mt-1 ${
                          hasReadOnce ? 'text-purple-400' : 'text-blue-400'
                        }`}>•</span>
                        <p className="text-gray-200 text-xs sm:text-sm">
                          Alternative currencies available upon request
                        </p>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className={`text-xs mt-1 ${
                          hasReadOnce ? 'text-purple-400' : 'text-blue-400'
                        }`}>•</span>
                        <p className="text-gray-200 text-xs sm:text-sm">
                          Secure payments via credit cards and PayPal
                        </p>
                      </li>
                    </ul>
                  </div>

                  {/* Pro Tip */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-lg p-3 border border-emerald-500/20">
                    <div className="flex items-start space-x-2">
                      <span className="text-emerald-400 text-lg">💡</span>
                      <p className="text-emerald-200 text-xs sm:text-sm">
                        Pro Tip: Need a different currency? Contact us for custom payment arrangements.
                      </p>
                    </div>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => handleUSNoticeClose()}
                    className={`w-full mt-2 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 ${
                      hasReadOnce
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30'
                    }`}
                  >
                    <span>Got it, thanks!</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Currency Dropdown */}
        <AnimatePresence>
          {showDropdown && (currency === 'PKR' || userLocation.toLowerCase().includes('pakistan')) && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md rounded-xl border border-white/10 shadow-xl z-[150] overflow-hidden"
            >
              {currencies.map((curr) => (
                <motion.button
                  key={curr}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleCurrencyChange(curr)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-left text-xs text-white hover:text-white/90 transition-colors"
                >
                  <span className="text-sm">{currencyFlags[curr]}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-xs">{curr}</span>
                    <span className="text-[10px] text-gray-400">{getCurrencyName(curr)}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CurrencySelector;