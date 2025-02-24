import axios from 'axios';

interface GeoLocation {
  country: string;
  currency: string;
  exchangeRate: number;
}

const countryPricingFactors: { [key: string]: number } = {
  'PK': 1.0,  // Base price for Pakistan
  'US': 1.2,  // 20% higher for US
  'GB': 1.2,  // 20% higher for UK
  'EU': 1.15, // 15% higher for EU countries
  'AU': 1.2,  // 20% higher for Australia
  'CA': 1.2,  // 20% higher for Canada
  'default': 1.1 // 10% higher for other countries
};

const currencySymbols: { [key: string]: string } = {
  'PKR': 'PKR',
  'USD': '$',
  'GBP': '£',
  'EUR': '€',
  'AUD': 'A$',
  'CAD': 'C$'
};

export const getExchangeRates = async (currency: string): Promise<number> => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/PKR`);
    return response.data.rates[currency] || 1;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return 1;
  }
};

export const getLocationData = async (ip: string): Promise<GeoLocation> => {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    const { countryCode, currency } = response.data;
    
    const exchangeRate = await getExchangeRates(currency);
    
    return {
      country: countryCode,
      currency: currency || 'PKR',
      exchangeRate: exchangeRate
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    return {
      country: 'PK',
      currency: 'PKR',
      exchangeRate: 1
    };
  }
};

export const adjustPriceForCountry = (basePrice: number, country: string, currency: string, exchangeRate: number): {
  amount: number;
  formattedPrice: string;
} => {
  const pricingFactor = countryPricingFactors[country] || countryPricingFactors.default;
  const adjustedPrice = basePrice * pricingFactor;
  const convertedPrice = adjustedPrice * exchangeRate;
  
  const currencySymbol = currencySymbols[currency] || currency;
  const formattedPrice = `${currencySymbol} ${Math.round(convertedPrice).toLocaleString()}`;
  
  return {
    amount: Math.round(convertedPrice),
    formattedPrice
  };
}; 