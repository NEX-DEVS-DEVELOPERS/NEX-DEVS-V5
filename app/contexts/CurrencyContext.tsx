'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCurrency, baseExchangeRates, getRealTimeExchangeRates, getLocationData } from '@/frontend/utils/pricing';

interface CurrencyContextType {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;
  isBaseCurrency: boolean;
  isExemptCountry: boolean;
  updateExchangeRates: () => Promise<void>;
  exchangeRates: Record<SupportedCurrency, number>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<SupportedCurrency>('PKR');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [exchangeRates, setExchangeRates] = useState<Record<SupportedCurrency, number>>(baseExchangeRates);
  const [isExemptCountry, setIsExemptCountry] = useState<boolean>(true);

  const updateExchangeRates = async () => {
    try {
      const rates = await getRealTimeExchangeRates();
      setExchangeRates(rates);
      if (currency !== 'PKR') {
        setExchangeRate(rates[currency]);
      }
    } catch (error) {
      console.error('Error updating exchange rates:', error);
    }
  };

  useEffect(() => {
    // Update exchange rates on mount and every hour
    updateExchangeRates();
    const interval = setInterval(updateExchangeRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Detect location and set initial currency
    const detectLocation = async () => {
      try {
        const locationData = await getLocationData('');
        setCurrency(locationData.currency as SupportedCurrency);
        setIsExemptCountry(locationData.isExemptCountry);
      } catch (error) {
        console.error('Error detecting location:', error);
        setCurrency('PKR');
        setIsExemptCountry(true);
      }
    };
    detectLocation();
  }, []);

  useEffect(() => {
    // Update exchange rate when currency changes
    setExchangeRate(exchangeRates[currency]);
  }, [currency, exchangeRates]);

  const value = {
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,
    isBaseCurrency: currency === 'PKR',
    isExemptCountry,
    updateExchangeRates,
    exchangeRates,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 
