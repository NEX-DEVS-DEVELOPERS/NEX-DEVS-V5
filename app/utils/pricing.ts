import axios from 'axios';

interface GeoLocation {
  country: string;
  currency: string;
  exchangeRate: number;
  isExemptCountry: boolean;
}

export type SupportedCurrency = 'PKR' | 'USD' | 'GBP' | 'INR' | 'AED';

// Base exchange rates (to be updated with real-time rates)
export const baseExchangeRates: { [key in SupportedCurrency]: number } = {
  PKR: 1,      // Base currency
  USD: 0.0036, // 1 PKR = 0.0036 USD (1 USD = ~278 PKR)
  INR: 0.30,   // 1 PKR = 0.30 INR (1 INR = ~3.33 PKR)
  GBP: 0.0028, // 1 PKR = 0.0028 GBP (1 GBP = ~357 PKR)
  AED: 0.013   // 1 PKR = 0.013 AED (1 AED = ~77 PKR)
};

export const currencySymbols: { [key in SupportedCurrency]: string } = {
  PKR: '₨',
  USD: '$',
  GBP: '£',
  AED: 'د.إ',
  INR: '₹'
};

export const getExchangeRates = async (currency: string): Promise<number> => {
  try {
    return baseExchangeRates[currency as SupportedCurrency] || baseExchangeRates.USD;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return baseExchangeRates[currency as SupportedCurrency] || baseExchangeRates.USD;
  }
};

export const getLocationData = async (ip: string): Promise<GeoLocation> => {
  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    // Map specific countries to their currencies
    const countryCurrencyMap: Record<string, SupportedCurrency> = {
      PK: 'PKR',
      GB: 'GBP',
      IN: 'INR',
      AE: 'AED'
    };

    // If country is in our specific list, use their currency, otherwise use USD
    const currency = countryCurrencyMap[data.country_code] || 'USD';

    // Only apply international rate for countries not in our specific list
    const isExemptCountry = ['PK', 'GB', 'IN', 'AE'].includes(data.country_code);

    return {
      country: data.country_code,
      currency,
      exchangeRate: baseExchangeRates[currency as SupportedCurrency],
      isExemptCountry
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return {
      country: 'Unknown',
      currency: 'PKR' as SupportedCurrency,
      exchangeRate: 1,
      isExemptCountry: true
    };
  }
};

// Function to check if a package is eligible for basic package discount
export const isBasicPackage = (packageName: string): boolean => {
  const basicPackages = ['WordPress Basic', 'Full-Stack Basic'];
  return basicPackages.includes(packageName);
};

export const formatPrice = (
  amount: number,
  currency: SupportedCurrency,
  exchangeRate: number = 1,
  isExemptCountry: boolean = false,
  packageName?: string
): string => {
  // Apply 5% discount for basic packages
  let discountedAmount = amount;
  if (packageName && isBasicPackage(packageName)) {
    discountedAmount = amount * 0.95; // 5% discount
  }

  // For exempt countries or PKR, don't apply any markup
  const adjustedAmount = discountedAmount * exchangeRate;
  
  // Format the number based on currency
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(adjustedAmount);

  return `${currencySymbols[currency]}${formattedNumber}`;
};

export const convertPrice = (
  amount: number,
  fromCurrency: SupportedCurrency,
  toCurrency: SupportedCurrency,
  customRate?: number
): number => {
  const rate = customRate || baseExchangeRates[toCurrency] / baseExchangeRates[fromCurrency];
  return amount * rate;
};

// Function to get real-time exchange rates (to be implemented with a real API)
export const getRealTimeExchangeRates = async (): Promise<Record<SupportedCurrency, number>> => {
  // In a real implementation, you would fetch rates from an API
  // For now, return static rates
  return baseExchangeRates;
};

// Function to get timeline surcharge percentage
export const getTimelineSurcharge = (timeline: string): number => {
  switch (timeline.toLowerCase()) {
    case 'urgent':
    case 'urgent (1-2 weeks)':
      return 0.2; // 20% surcharge for urgent delivery
    case 'relaxed':
    case 'relaxed (4+ weeks)':
      return -0.05; // 5% discount for relaxed timeline
    default:
      return 0; // No surcharge for normal timeline
  }
};

// Function to calculate price breakdown
export const getPriceBreakdown = (
  basePrice: number,
  currency: SupportedCurrency,
  exchangeRate: number,
  isExemptCountry: boolean = false,
  timeline: string = 'Normal (2-4 weeks)'
) => {
  // Calculate timeline surcharge first
  const timelineSurcharge = basePrice * getTimelineSurcharge(timeline);
  
  // Add timeline surcharge to base price
  const priceWithTimeline = basePrice + timelineSurcharge;
  
  // Apply international pricing adjustments
  let internationalMarkup = 0;
  let internationalDiscount = 0;
  let pkrDiscount = 0;
  
  if (currency === 'PKR') {
    // Apply 20% discount for PKR users
    pkrDiscount = priceWithTimeline * 0.2;
  } else if (!isExemptCountry) {
    // Apply 10% international fee
    internationalMarkup = priceWithTimeline * 0.1;
    // Apply 20% international discount
    internationalDiscount = priceWithTimeline * 0.2;
  }
  
  const subtotal = priceWithTimeline + internationalMarkup - internationalDiscount - pkrDiscount;
  const convertedAmount = subtotal * exchangeRate;

  return {
    basePrice,
    timelineSurcharge,
    internationalMarkup,
    internationalDiscount,
    pkrDiscount,
    subtotal,
    convertedAmount,
    currency,
    exchangeRate
  };
};