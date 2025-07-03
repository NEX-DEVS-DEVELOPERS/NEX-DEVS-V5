'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaLock, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaUniversity, FaMobileAlt, FaDownload, FaFilePdf, FaRegCheckCircle, FaRocket, FaClipboardCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { formatPrice, convertPrice, baseExchangeRates } from '@/app/utils/pricing';
import type { SupportedCurrency } from '@/app/utils/pricing';

// Add this keyframe animation for the modal
const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
`;

interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  package: string;
  timeline: string;
  amount: number;
  discount: number;
  total: number;
  currency: string;
  taxRate: number;
  taxAmount: number;
  subTotal: number;
  items: {
    description: string;
    details?: string;
    features?: string[];
    quantity: number;
    rate: number;
    amount: number;
  }[];
  billingDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface BankAccount {
  bank: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
}

const pakistaniBanks: BankAccount[] = [
  {
    bank: "HBL",
    accountTitle: "NEX-DEVS",
    accountNumber: "CURRENTLY-NOT AVAILABLE",
    iban: "PK36HABB0000123456789012"
  },
  {
    bank: "Meezan Bank",
    accountTitle: "NEX-DEVS",
    accountNumber: "CURRENTLY-NOT AVAILABLE",
    iban: "PK36MEZN0000987654321098"
  },
  {
    bank: "UBL",
    accountTitle: "NEX-DEVS",
    accountNumber: "CURRENTLY-NOT AVAILABLE",
    iban: "PK36UNIL0000456789012345"
  }
];

const mobileWallets = [
  {
    name: "JazzCash",
    number: "0300-1234567",
    accountTitle: "NEX-DEVS"
  },
  {
    name: "Easypaisa",
    number: "0333-7654321",
    accountTitle: "NEX-DEVS"
  }
];

const paymentMethods = [
  { id: 'credit-card', icon: FaCreditCard, label: 'Credit/Debit Card' },
  { id: 'american-express', icon: FaCreditCard, label: 'American Express' },
  { id: 'bank-transfer', icon: FaUniversity, label: 'Bank Transfer' },
  { id: 'jazzcash', icon: FaMobileAlt, label: 'JazzCash' },
  { id: 'easypaisa', icon: FaMobileAlt, label: 'Easypaisa' },
  { id: 'paypal', icon: FaPaypal, label: 'PayPal' },
  { id: 'apple-pay', icon: FaApplePay, label: 'Apple Pay' },
  { id: 'google-pay', icon: FaGooglePay, label: 'Google Pay' }
];

function LoadingInvoice() {
  return (
    <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="h-6 w-40 bg-zinc-800/70 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-8 w-24 bg-zinc-800/70 rounded animate-pulse"></div>
          <div className="h-8 w-20 bg-zinc-800/70 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Company and Invoice Info */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="h-5 w-32 bg-zinc-800/70 rounded animate-pulse"></div>
            <div className="h-4 w-40 bg-zinc-800/70 rounded animate-pulse"></div>
            <div className="h-4 w-36 bg-zinc-800/70 rounded animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-zinc-800/70 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-zinc-800/70 rounded animate-pulse"></div>
            <div className="h-4 w-full bg-zinc-800/70 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-[1px] w-full bg-zinc-800/70 animate-pulse"></div>
        
        {/* Billing Details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-5 w-32 bg-zinc-800/70 rounded animate-pulse"></div>
            <div className="h-5 w-20 bg-zinc-800/70 rounded animate-pulse"></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-800/70 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-zinc-800/70 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-zinc-800/70 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-zinc-800/70 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="h-[1px] w-full bg-zinc-800/70 animate-pulse"></div>
        
        {/* Items */}
        <div className="space-y-3">
          <div className="h-5 w-32 bg-zinc-800/70 rounded animate-pulse"></div>
          <div className="space-y-3">
            <div className="h-20 w-full bg-zinc-800/70 rounded animate-pulse"></div>
            <div className="h-20 w-full bg-zinc-800/70 rounded animate-pulse"></div>
          </div>
        </div>
        
        {/* Summary */}
        <div className="space-y-3 mt-5">
          <div className="h-[1px] w-full bg-zinc-800/70 animate-pulse"></div>
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-zinc-800/70 rounded animate-pulse"></div>
            <div className="h-7 w-24 bg-zinc-800/70 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const availableAddOns: AddOn[] = [
  {
    id: 'monthly-maintenance',
    name: 'Monthly Maintenance & Updates',
    description: 'Regular updates, bug fixes, and performance optimization',
    price: 39,
    category: 'maintenance'
  },
  {
    id: 'additional-language',
    name: 'Additional Language Support',
    description: 'Support for one additional language (per language)',
    price: 29,
    category: 'features'
  },
  {
    id: 'whatsapp-integration',
    name: 'WhatsApp Business Integration',
    description: 'Connect your chatbot to WhatsApp Business API',
    price: 89,
    category: 'integrations'
  },
  {
    id: 'private-training',
    name: 'Private Data Training (per file)',
    description: 'Train the AI on your private documents and data',
    price: 19,
    category: 'ai'
  },
  {
    id: 'voice-integration',
    name: 'Voice AI Integration (Beta)',
    description: 'Add voice input/output capabilities to your chatbot',
    price: 149,
    category: 'ai'
  },
  {
    id: 'voice-training',
    name: 'Custom Voice Training (2 hours)',
    description: 'Train a custom voice model for your brand',
    price: 299,
    category: 'ai'
  },
  {
    id: 'voice-recording',
    name: 'Professional Voice Recording',
    description: 'High-quality voice recording for custom voice models',
    price: 499,
    category: 'ai'
  },
  {
    id: 'model-finetuning',
    name: 'Custom AI Model Fine-tuning',
    description: 'Fine-tune AI model specifically for your use case',
    price: 799,
    category: 'ai'
  },
  {
    id: 'multi-platform',
    name: 'Multi-Platform Integration Package',
    description: 'Deploy across multiple platforms (Slack, Discord, Telegram)',
    price: 249,
    category: 'integrations'
  },
  {
    id: 'analytics-dashboard',
    name: 'Advanced Analytics Dashboard',
    description: 'Detailed analytics with custom reports and insights',
    price: 179,
    category: 'analytics'
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis Module',
    description: 'Real-time sentiment analysis of user interactions',
    price: 129,
    category: 'analytics'
  }
];

function CheckoutPageContent() {
  const router = useRouter();
  const urlParams = useSearchParams();
  const { isExemptCountry, exchangeRate } = useCurrency();
  
  // Get all URL parameters once
  const planParam = urlParams?.get('plan');
  const sourceParam = urlParams?.get('source') || '';
  const packageParam = urlParams?.get('package');
  const priceParam = urlParams?.get('price');
  const voiceBotParam = urlParams?.get('voiceBot');
  const dataParam = urlParams?.get('data');
  const isFromMainPage = sourceParam === 'page' || planParam?.includes('ai-integration');

  // Define available add-ons for AI chatbot services
  const availableAddOns: AddOn[] = [
    {
      id: 'monthly-maintenance',
      name: 'Monthly Maintenance & Updates',
      description: 'Regular updates, bug fixes, and performance optimization',
      price: 39,
      category: 'maintenance'
    },
    {
      id: 'additional-language',
      name: 'Additional Language Support',
      description: 'Support for one additional language (per language)',
      price: 29,
      category: 'features'
    },
    {
      id: 'whatsapp-integration',
      name: 'WhatsApp Business Integration',
      description: 'Connect your chatbot to WhatsApp Business API',
      price: 89,
      category: 'integrations'
    },
    {
      id: 'private-training',
      name: 'Private Data Training (per file)',
      description: 'Train the AI on your private documents and data',
      price: 19,
      category: 'ai'
    },
    {
      id: 'voice-integration',
      name: 'Voice AI Integration (Beta)',
      description: 'Add voice input/output capabilities to your chatbot',
      price: 149,
      category: 'ai'
    },
    {
      id: 'voice-training',
      name: 'Custom Voice Training (2 hours)',
      description: 'Train a custom voice model for your brand',
      price: 299,
      category: 'ai'
    },
    {
      id: 'voice-recording',
      name: 'Professional Voice Recording',
      description: 'High-quality voice recording for custom voice models',
      price: 499,
      category: 'ai'
    },
    {
      id: 'model-finetuning',
      name: 'Custom AI Model Fine-tuning',
      description: 'Fine-tune AI model specifically for your use case',
      price: 799,
      category: 'ai'
    },
    {
      id: 'multi-platform',
      name: 'Multi-Platform Integration Package',
      description: 'Deploy across multiple platforms (Slack, Discord, Telegram)',
      price: 249,
      category: 'integrations'
    },
    {
      id: 'analytics-dashboard',
      name: 'Advanced Analytics Dashboard',
      description: 'Detailed analytics with custom reports and insights',
      price: 179,
      category: 'analytics'
    },
    {
      id: 'sentiment-analysis',
      name: 'Sentiment Analysis Module',
      description: 'Real-time sentiment analysis of user interactions',
      price: 129,
      category: 'analytics'
    }
  ];

  // Keep our forced USD currency declaration
  const [currency, setCurrency] = useState<string>("USD");
  
  // Initialize state based on URL parameters
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [buttonShake, setButtonShake] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string>('Normal Time (2-3 weeks)');
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    timeline: 'Normal Time (2-3 weeks)'
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const [requestLimitReached, setRequestLimitReached] = useState(false);

  // New state for chatbot checkout
  const [checkoutSource, setCheckoutSource] = useState<string | null>(null);
  const [chatbotPackage, setChatbotPackage] = useState<string | null>(null);
  const [chatbotPrice, setChatbotPrice] = useState<number>(0);
  const [voiceBotEnabled, setVoiceBotEnabled] = useState<boolean>(false);
  const [enterpriseData, setEnterpriseData] = useState<any>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addOnPrices, setAddOnPrices] = useState<Record<string, number>>({});
  const [addOnsCollapsed, setAddOnsCollapsed] = useState<boolean>(false);

  // Initialize from URL params
  useEffect(() => {
    // Always set currency to USD
    setCurrency("USD");
    
    // Handle AI chatbot specific params
    if (sourceParam === 'chatbot') {
      setCheckoutSource('chatbot');
      
      if (packageParam) {
        setChatbotPackage(packageParam);
        setSelectedPlan(packageParam === 'basic' ? 'Basic Plan' : 
                       packageParam === 'advanced' ? 'Advanced Plan' : 
                       packageParam === 'enterprise' ? 'Enterprise Plan' : null);
      }
      
      // If price is provided in URL, use it directly
      if (priceParam) {
        const price = parseInt(priceParam, 10);
        if (!isNaN(price)) {
          setChatbotPrice(price);
          
          // Generate invoice immediately with the correct price
          setTimeout(() => {
            const planName = packageParam === 'basic' ? 'Basic Plan' : 
                            packageParam === 'advanced' ? 'Advanced Plan' : 
                            packageParam === 'enterprise' ? 'Enterprise Plan' : '';
            
            generateInvoiceWithPrice(planName, price);
          }, 300);
        }
      }
      
      // Handle voice bot option
      if (voiceBotParam === 'true') {
        setVoiceBotEnabled(true);
      }
    }
  }, []);

  useEffect(() => {
    // Fetch location data when component mounts
    fetch('/api/location')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setLocationData(data.data);
        }
      })
      .catch(error => console.error('Error fetching location data:', error));
  }, []);

  useEffect(() => {
    const plan = urlParams?.get('plan');
    const source = urlParams?.get('source');
    const packageType = urlParams?.get('package');
    const price = urlParams?.get('price');
    const voiceBot = urlParams?.get('voiceBot');
    const data = urlParams?.get('data');

    // Handle traditional plan-based checkout
    if (plan) {
      setSelectedPlan(decodeURIComponent(plan));
      setCheckoutSource('traditional');
      if (selectedPlan) {
        generateInvoice(selectedPlan);
      }
    }

    // Handle new chatbot/enterprise checkout
    if (source && (source === 'chatbot' || source === 'enterprise')) {
      setCheckoutSource(source);

      if (source === 'chatbot' && packageType && price) {
        setChatbotPackage(packageType);
        setChatbotPrice(parseInt(price));
        setVoiceBotEnabled(voiceBot === 'true');

        // Set plan name for chatbot packages
        const planName = `AI Chatbot ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Plan`;
        setSelectedPlan(planName);

        // Force USD currency for chatbot packages
        if (typeof window !== 'undefined') {
          localStorage.setItem('preferredCurrency', 'USD');
        }
      }

      if (source === 'enterprise' && data) {
        try {
          const enterpriseInfo = JSON.parse(decodeURIComponent(data));
          setEnterpriseData(enterpriseInfo);
          setSelectedPlan('Enterprise AI Solution');
          setChatbotPrice(enterpriseInfo.budget || 5000);

          // Force USD currency for enterprise AI services
          if (typeof window !== 'undefined') {
            localStorage.setItem('preferredCurrency', 'USD');
          }
        } catch (error) {
          console.error('Error parsing enterprise data:', error);
        }
      }
    }
  }, [urlParams, locationData, selectedPlan]);

  useEffect(() => {
    if (invoice) {
      setEditedDetails({
        name: invoice.billingDetails?.name || '',
        email: invoice.billingDetails?.email || '',
        phone: invoice.billingDetails?.phone || '',
        address: invoice.billingDetails?.address || '',
        timeline: invoice.timeline || 'normal'
      });
    }
  }, [invoice]);

  // Set default timeline
  useEffect(() => {
    if (!editedDetails.timeline) {
      setEditedDetails(prev => ({ ...prev, timeline: 'Normal Time (2-3 weeks)' }));
    }
  }, []);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add this useEffect to simulate invoice loading
  useEffect(() => {
    if (selectedPlan) {
      setIsInvoiceLoading(true);
      const timer = setTimeout(() => {
        generateInvoice(selectedPlan);
        setIsInvoiceLoading(false);
      }, 800); // Simulate loading for better UX
      return () => clearTimeout(timer);
    }
  }, [selectedPlan, currency, exchangeRate]);

  const getBaseAmount = (plan: string): number => {
    // Return prices in USD
    switch (plan.toLowerCase()) {
      case 'basic-ai-integration':
        return 499;
      case 'advanced-ai-integration':
        return voiceBotEnabled ? 999 : 899;
      case 'enterprise-ai-integration':
        return 1499;
      case 'voice-ai-addon':
        return 899;
      default:
        return 0;
    }
  };

  const getTimelineSurcharge = (timeline: string): number => {
    console.log('Calculating surcharge for timeline:', timeline);
    let surcharge = 0;
    
    switch (timeline) {
      case 'Urgent Project (1-2 weeks)':
        surcharge = 0.20; // 20% surcharge
        break;
      case 'Relaxed (4 weeks)':
        surcharge = -0.05; // 5% discount (negative surcharge)
        break;
      case 'Normal Time (2-3 weeks)':
      default:
        surcharge = 0; // no surcharge
        break;
    }
    
    console.log('Calculated surcharge:', surcharge);
    return surcharge;
  };

  const getInternationalTransactionFee = (currency: string, amount: number): number => {
    // Since we're always using USD, we can simplify this function
    return 0; // No international fee for USD
  };

  // Add-on management functions
  const toggleAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => {
      if (prev.includes(addOnId)) {
        return prev.filter(id => id !== addOnId);
      } else {
        return [...prev, addOnId];
      }
    });
  };

  const getAddOnPrice = (addOnId: string): number => {
    const addOn = availableAddOns.find((addon: AddOn) => addon.id === addOnId);
    return addOn ? addOn.price : 0;
  };

  const getTotalAddOnPrice = (): number => {
        return selectedAddOns.reduce((acc, addOnId) => acc + getAddOnPrice(addOnId), 0);
  };

  const shouldShowAddOns = (): boolean => {
    return checkoutSource === 'chatbot' || checkoutSource === 'enterprise';
  };

  // Add a new function to generate invoice with direct price
  const generateInvoiceWithPrice = (plan: string, directPrice: number) => {
    // Set the selectedPlan state to trigger invoice generation
    setSelectedPlan(plan);
    
    // Create invoice with direct price
    const newInvoice: InvoiceDetails = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      package: plan,
      timeline: 'Normal Time (2-3 weeks)',
      amount: directPrice,
      discount: 0,
      subTotal: directPrice,
      taxRate: 0,
      taxAmount: 0,
      total: directPrice,
      currency: "USD",
      items: [
        {
          description: `${plan} Package`,
          quantity: 1,
          rate: directPrice,
          amount: directPrice,
          features: []
        }
      ],
      billingDetails: {
        name: '',
        email: '',
        phone: '',
        address: ''
      }
    };
    
    setInvoice(newInvoice);
    setIsInvoiceLoading(false);
  };

  // Modify the generateInvoice function to ensure it uses chatbotPrice for chatbot packages
  const generateInvoice = async (plan: string) => {
    try {
      // For chatbot packages, use the chatbotPrice if available
      let baseAmount = 0;
      
      if (checkoutSource === 'chatbot' && chatbotPrice > 0) {
        baseAmount = chatbotPrice;
      } else {
        baseAmount = getBaseAmount(plan);
      }
      
      if (!exchangeRate) {
        console.error('Exchange rate not available');
        return;
      }

      // For AI services (chatbot and enterprise), use direct USD pricing without conversion
      const convertedAmount = (checkoutSource === 'chatbot' || checkoutSource === 'enterprise') ? baseAmount : Math.round(baseAmount * exchangeRate);
      const currentTimeline = editedDetails.timeline;
      const timelineSurchargeRate = getTimelineSurcharge(currentTimeline);
      const timelineSurchargeAmount = Math.round(convertedAmount * timelineSurchargeRate);

      // Calculate add-ons total (always in USD for AI services)
      const addOnsTotal = getTotalAddOnPrice();
      const convertedAddOnsTotal = (checkoutSource === 'chatbot' || checkoutSource === 'enterprise') ? addOnsTotal : Math.round(addOnsTotal * exchangeRate);

      const subTotal = convertedAmount + convertedAddOnsTotal;

      // No discount for AI services (chatbot and enterprise) or users from page.tsx
      let discountPercentage = 0;
      if (!isFromMainPage && checkoutSource !== 'chatbot' && checkoutSource !== 'enterprise') {
        discountPercentage = plan === 'Full-Stack Basic' ? 10 : 20;
      }

      const discountAmount = Math.round((convertedAmount * discountPercentage) / 100); // Only apply discount to base amount
      const taxRate = 0;
      const taxAmount = Math.round((subTotal * taxRate) / 100);

      // Calculate international transaction fee
      const internationalFee = getInternationalTransactionFee(currency, subTotal);

      // Calculate final total, ensuring it's not zero if we have a base amount
      const calculatedTotal = subTotal + timelineSurchargeAmount - discountAmount + taxAmount + internationalFee;
      const finalTotal = calculatedTotal <= 0 && baseAmount > 0 ? baseAmount : calculatedTotal;

      const newInvoice: InvoiceDetails = {
        invoiceNumber: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        package: plan,
        timeline: currentTimeline,
        amount: convertedAmount,
        discount: discountAmount,
        subTotal: subTotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        total: finalTotal,
        currency: "USD", // Force USD here
        items: [
          {
            description: `${plan} Package`,
            quantity: 1,
            rate: convertedAmount,
            amount: convertedAmount,
            features: []
          }
        ],
        billingDetails: invoice?.billingDetails
      };

      // Add timeline adjustment only if there is a surcharge or discount
      if (timelineSurchargeAmount !== 0) {
        const timelineItem = currentTimeline === 'Urgent Project (1-2 weeks)' 
          ? {
              description: 'Urgent Timeline Surcharge (1-2 weeks)',
              details: 'Additional charge for urgent delivery (1-2 weeks): 20% of base price',
              amount: timelineSurchargeAmount
            }
          : {
              description: 'Timeline Discount - Relaxed (4 weeks)',
              details: 'Discount for relaxed delivery timeline (4 weeks): 5% of base price',
              amount: timelineSurchargeAmount
            };

        newInvoice.items.push({
          ...timelineItem,
          quantity: 1,
          rate: Math.abs(timelineSurchargeAmount),
          features: []
        });
      }

      // Add selected add-ons to invoice
      selectedAddOns.forEach(addOnId => {
        const addOn = availableAddOns.find(addon => addon.id === addOnId);
        if (addOn) {
          const convertedAddOnPrice = Math.round(addOn.price * exchangeRate);
          newInvoice.items.push({
            description: addOn.name,
            details: addOn.description,
            quantity: 1,
            rate: convertedAddOnPrice,
            amount: convertedAddOnPrice,
            features: []
          });
        }
      });

      // Add international transaction fee if applicable
      if (internationalFee > 0) {
        newInvoice.items.push({
          description: 'International Transaction Fee',
          details: '10% fee for international transactions',
          quantity: 1,
          rate: internationalFee,
          amount: internationalFee,
          features: []
        });
      }

      setInvoice(newInvoice);
    } catch (error) {
      console.error('Error generating invoice:', error);
    }
  };

  // Update the timeline selection to show the surcharge more prominently
  const handleTimelineChange = (value: string) => {
    console.log('Timeline change initiated:', value);
    
    // Update both states synchronously
    setSelectedTimeline(value);
    setEditedDetails(prev => ({ ...prev, timeline: value }));
    
    // Only generate new invoice if we have a selected plan
    if (selectedPlan) {
      console.log('Generating new invoice for plan:', selectedPlan, 'with timeline:', value);
      const baseAmount = getBaseAmount(selectedPlan);
      
      if (!exchangeRate) {
        console.error('Exchange rate not available');
        return;
      }

      const convertedAmount = Math.round(baseAmount * exchangeRate);
      const timelineSurchargeRate = getTimelineSurcharge(value);
      const timelineSurchargeAmount = Math.round(convertedAmount * timelineSurchargeRate);
      const subTotal = convertedAmount;
      const calculatedTotal = subTotal + timelineSurchargeAmount;

      // No discount for AI services (chatbot and enterprise) or users from page.tsx
      let discountPercentage = 0;
      if (!isFromMainPage && checkoutSource !== 'chatbot' && checkoutSource !== 'enterprise') {
        discountPercentage = selectedPlan === 'Full-Stack Basic' ? 10 : 20;
      }

      const discountAmount = Math.round((convertedAmount * discountPercentage) / 100);
      const taxRate = 0;
      const taxAmount = Math.round((subTotal * taxRate) / 100);

      console.log('Calculated amounts:', {
        baseAmount,
        convertedAmount,
        timelineSurchargeRate,
        timelineSurchargeAmount,
        total
      });

      // Create new invoice with updated timeline
      const newInvoice: InvoiceDetails = {
        ...invoice!,
        timeline: value,
        amount: convertedAmount,
        discount: discountAmount,
        subTotal: subTotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        total: calculatedTotal,
        currency: "USD", // Force USD here
        items: [
          {
            description: `${selectedPlan} Package`,
            quantity: 1,
            rate: convertedAmount,
            amount: convertedAmount,
            features: []
          }
        ]
      };

      // Add timeline adjustment item if applicable
      if (timelineSurchargeAmount !== 0) {
        newInvoice.items.push({
          description: value === 'Urgent Project (1-2 weeks)' 
            ? 'Urgent Timeline Surcharge (1-2 weeks)'
            : 'Timeline Discount - Relaxed (4 weeks)',
          quantity: 1,
          rate: Math.abs(timelineSurchargeAmount),
          amount: timelineSurchargeAmount,
          details: value === 'Urgent Project (1-2 weeks)'
            ? 'Additional charge for urgent delivery (1-2 weeks): 20% of base price'
            : 'Discount for relaxed delivery timeline (4 weeks): 5% of base price',
          features: []
        });
      }

      console.log('Setting new invoice:', newInvoice);
      setInvoice(newInvoice);
    }
  };

  // Add a function to display timeline surcharge warning
  const getTimelineSurchargeWarning = (timeline: string) => {
    if (timeline === 'Urgent Project (1-2 weeks)') {
      return (
        <div className="mt-2 text-yellow-400 text-sm flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>20% surcharge applies for urgent timeline</span>
        </div>
      );
    }
    return null;
  };

  // Add effect to regenerate invoice when currency, exchange rate, or add-ons change
  useEffect(() => {
    if (selectedPlan && exchangeRate) {
      generateInvoice(selectedPlan);
    }
  }, [currency, exchangeRate, isExemptCountry, selectedAddOns]);

  const downloadInvoice = (invoiceData: InvoiceDetails) => {
    const invoiceContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEX-DEVS Invoice</title>
    <style>
        :root {
            --primary-color: #8B5CF6;
            --text-color: #FFFFFF;
            --background-color: #000000;
            --card-background: #1a1a1a;
            --secondary-background: #27272a;
            --border-color: rgba(255, 255, 255, 0.1);
            --green-color: #38a169;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            margin: 0;
            padding: 2rem;
            background: var(--background-color);
            min-height: 100vh;
        }
        
        .invoice-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 3rem;
            background: var(--card-background);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            position: relative;
            overflow: hidden;
        }

        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 8rem;
            opacity: 0.03;
            color: var(--primary-color);
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
            z-index: 0;
        }

        .content {
            position: relative;
            z-index: 1;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 3rem;
            gap: 2rem;
        }

        .company-info {
            flex: 1;
        }

        .logo {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--primary-color);
            margin-bottom: 0.5rem;
            letter-spacing: -1px;
        }

        .company-details {
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
        }

        .invoice-details {
            background: var(--secondary-background);
            padding: 1.5rem;
            border-radius: 12px;
            min-width: 300px;
        }

        .invoice-details h2 {
            color: var(--text-color);
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
        }

        .invoice-details p {
            display: flex;
            justify-content: space-between;
            margin: 0.5rem 0;
            color: rgba(255, 255, 255, 0.7);
        }

        .invoice-details strong {
            color: var(--green-color);
        }

        .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .details-section {
            background: var(--secondary-background);
            padding: 1.5rem;
            border-radius: 12px;
        }

        .details-section h3 {
            color: var(--primary-color);
            margin: 0 0 1rem 0;
            font-size: 1.2rem;
        }

        .details-row {
            display: flex;
            justify-content: space-between;
            margin: 0.5rem 0;
            color: rgba(255, 255, 255, 0.7);
        }

        .details-row strong {
            color: var(--text-color);
            min-width: 120px;
        }

        .project-info {
            margin: 2rem 0;
            background: var(--secondary-background);
            padding: 1.5rem;
            border-radius: 12px;
        }

        .project-info h3 {
            color: var(--primary-color);
            margin: 0 0 1rem 0;
        }

        .project-details {
            background: rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            border-radius: 12px;
        }

        .timeline-item {
                color: ${invoiceData.timeline === 'Urgent Project (1-2 weeks)' ? '#fbbf24' : 
                       invoiceData.timeline === 'Relaxed (4 weeks)' ? '#10b981' : '#8b5cf6'};
            font-weight: bold;
        }

        .timeline-description {
            margin-top: 0.5rem;
            padding: 0.75rem;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            color: rgba(255, 255, 255, 0.8);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            background: var(--secondary-background);
            border-radius: 12px;
            overflow: hidden;
        }

        th {
            background: rgba(139, 92, 246, 0.1);
            color: var(--primary-color);
            font-weight: 600;
            text-align: left;
            padding: 1rem;
        }

        td {
            padding: 1rem;
            border-bottom: 1px solid var(--border-color);
            color: rgba(255, 255, 255, 0.7);
        }

        tr:last-child td {
            border-bottom: none;
        }

        .summary {
            margin-left: auto;
            width: 350px;
            background: var(--secondary-background);
            padding: 1.5rem;
            border-radius: 12px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            color: rgba(255, 255, 255, 0.7);
        }

        .total {
            font-size: 1.25rem;
            font-weight: bold;
            color: var(--green-color);
            border-top: 1px solid var(--border-color);
            padding-top: 1rem;
            margin-top: 1rem;
        }

        .terms {
            margin-top: 3rem;
            background: var(--secondary-background);
            padding: 2rem;
            border-radius: 1rem;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .terms h3 {
            color: var(--primary-color);
            margin: 0 0 2rem 0;
            font-size: 1.5rem;
            font-weight: 600;
            text-align: center;
        }

        .terms .grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
        }

        @media (max-width: 768px) {
            .terms .grid {
                grid-template-columns: 1fr;
            }
        }

        .terms-box {
            background: rgba(0, 0, 0, 0.2);
            padding: 1.5rem;
            border-radius: 0.75rem;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .terms-box h4 {
            color: var(--primary-color);
            margin: 0 0 1rem 0;
            font-size: 1.2rem;
            font-weight: 500;
        }

        .terms-box ul {
            list-style: none;
            padding: 0;
            margin: 0;
            color: rgba(255, 255, 255, 0.8);
        }

        .terms-box li {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            margin: 0.75rem 0;
            line-height: 1.5;
        }

        .terms-box li span:first-child {
            color: var(--primary-color);
            margin-top: 0.25rem;
        }

        .terms-box li span:last-child {
            flex: 1;
        }

        .signature {
            margin-top: 3rem;
            text-align: right;
        }

        .signature p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 0.5rem;
        }

        .signature-text {
            font-family: 'Brush Script MT', cursive;
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-top: 1rem;
        }

        .security-features {
            position: absolute;
            bottom: 2rem;
            left: 3rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
        }

        .secure-stamp {
            position: absolute;
            right: 3rem;
            bottom: 3rem;
            width: 120px;
            height: 120px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            transform: rotate(-15deg);
            opacity: 0.8;
            background: rgba(139, 92, 246, 0.1);
        }

        .secure-stamp-content {
            color: var(--primary-color);
        }

        .secure-stamp-title {
            font-weight: bold;
            font-size: 1rem;
            margin-bottom: 0.25rem;
        }

        .secure-stamp-subtitle {
            font-size: 0.75rem;
        }

            @media print {
                .mobile-warning {
                    display: none;
                }
            }

            .mobile-warning {
                background: #2D1657;
                color: #fff;
                padding: 1rem;
                margin: -2rem -2rem 2rem -2rem;
                text-align: center;
                border-radius: 16px 16px 0 0;
                border-bottom: 1px solid rgba(139, 92, 246, 0.3);
                font-family: 'Segoe UI', sans-serif;
            }
            
            .mobile-warning strong {
                color: #8B5CF6;
                display: block;
                margin-bottom: 0.5rem;
            }
            
            .mobile-warning p {
                margin: 0;
                font-size: 0.9rem;
                line-height: 1.5;
            }

        @media print {
            .mobile-warning {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
            ${isMobile ? `
                <div class="mobile-warning">
                    <strong>⚠️ Mobile Device Detected</strong>
                    <p>For the best viewing experience, please open this invoice on a laptop or desktop computer.</p>
                </div>
            ` : ''}
        <div class="watermark">INVOICE</div>
        <div class="content">
            <div class="header">
                <div class="company-info">
                    <div class="logo">NEX-DEVS</div>
                    <div class="company-details">
                        <p>Professional Web Development Services</p>
                        <p>Pakistan</p>
                        <p>nexwebs.org@gmail.com</p>
                        <p>0329-2425950</p>
                    </div>
                </div>
                
                <div class="invoice-details">
                    <h2>INVOICE</h2>
                        <p><strong>Invoice #:</strong> <span>${invoiceData.invoiceNumber}</span></p>
                        <p><strong>Date:</strong> <span>${invoiceData.date}</span></p>
                        <p><strong>Due Date:</strong> <span>${invoiceData.dueDate}</span></p>
                </div>
            </div>
             </div>

            <div class="details-grid">
                <div class="details-section">
                    <h3>Our Details</h3>
                    <div class="details-row">
                        <strong style="color: var(--green-color);">Name:</strong>
                        <span>ALI-HASNAAT</span>
                    </div>
                    <div class="details-row">
                        <strong>Email:</strong>
                        <span>nexwebs.org@gmail.com</span>
                    </div>
                    <div class="details-row">
                        <strong>Phone:</strong>
                        <span>0329-2425950</span>
                    </div>
                </div>
                
                <div class="details-section">
                    <h3>Client Details</h3>
                    <div class="details-row">
                        <strong>Name:</strong>
                            <span>${invoiceData.billingDetails?.name || 'Your Name'}</span>
                    </div>
                    <div class="details-row">
                        <strong>Email:</strong>
                            <span>${invoiceData.billingDetails?.email || 'your.email@example.com'}</span>
                    </div>
                    <div class="details-row">
                        <strong>Phone:</strong>
                            <span>${invoiceData.billingDetails?.phone || 'Your Phone'}</span>
                    </div>
                    <div class="details-row">
                        <strong>Address:</strong>
                            <span>${invoiceData.billingDetails?.address || 'Your Address'}</span>
                    </div>
                </div>
            </div>

            <div class="project-info">
                <h3>Project Information</h3>
                <div class="project-details">
                        <p><strong>Package:</strong> ${invoiceData.package}</p>
                        <p><strong>Timeline:</strong> ${invoiceData.timeline}</p>
                        <p><strong>Amount:</strong> ${formatPrice(invoiceData.amount, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</p>
                </div>
            </div>

            <div class="project-info">
                <h3>Project Timeline</h3>
                <div class="project-details">
                    <p><strong>Selected Timeline:</strong> 
                            <span class="timeline-item">${invoiceData.timeline}</span>
                    </p>
                    
                    <div class="timeline-description">
                            ${invoiceData.timeline === 'Urgent Project (1-2 weeks)' 
                          ? 'Accelerated development schedule with priority resource allocation. 20% surcharge applies.' 
                              : invoiceData.timeline === 'Normal Time (2-3 weeks)' 
                              ? 'Standard development timeline with balanced resource allocation.' 
                              : 'Relaxed development schedule with extended planning and review periods. 5% discount applies.'}
                    </div>
                </div>
           

            <div className="project-info">
             

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                        ${invoiceData.items.map(item => `
                        <tr>
                            <td>
                                ${item.description}
                                ${item.details ? `<br><small>${item.details}</small>` : ''}
                            </td>
                            <td>${item.quantity}</td>
                                <td>${formatPrice(item.rate, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                                <td>${formatPrice(item.amount, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                        </tr>
                    `).join('')}
                    
                        ${invoiceData.timeline === 'Urgent Project (1-2 weeks)' ? `
                        <tr>
                            <td>
                                Urgent Timeline Surcharge (1-2 weeks)
                                <br><small>Additional charge for urgent delivery: 20% of base price</small>
                            </td>
                            <td>1</td>
                                <td>${formatPrice(getTimelineSurcharge(invoiceData.timeline) * invoiceData.amount, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                                <td>${formatPrice(getTimelineSurcharge(invoiceData.timeline) * invoiceData.amount, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                        </tr>
                        ` : invoiceData.timeline === 'Normal Time (2-3 weeks)' ? `
                        <tr>
                            <td>
                                Timeline - Normal (2-3 weeks)
                                <br><small>Standard delivery timeline</small>
                            </td>
                            <td>1</td>
                                <td>${formatPrice(0, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                                <td>${formatPrice(0, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                        </tr>
                    ` : `
                        <tr>
                            <td>
                                Timeline Discount - Relaxed (4 weeks)
                                <br><small>Discount for relaxed delivery timeline: 5% of base price</small>
                            </td>
                            <td>1</td>
                                <td>-${formatPrice(Math.abs(getTimelineSurcharge(invoiceData.timeline) * invoiceData.amount), invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                                <td>-${formatPrice(Math.abs(getTimelineSurcharge(invoiceData.timeline) * invoiceData.amount), invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                        </tr>
                    `}
                </tbody>
            </table>

            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                        <span>${formatPrice(invoiceData.subTotal, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
                <div class="summary-row">
                        <span>Tax (${invoiceData.taxRate}%):</span>
                        <span>${formatPrice(invoiceData.taxAmount, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
                <div class="summary-row">
                    <span>Discount (${checkoutSource === 'chatbot' || checkoutSource === 'enterprise' ? '0%' : selectedPlan === 'Full-Stack Basic' ? '10%' : '20%'}):</span>
                        <span>-${formatPrice(invoiceData.discount, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                        <span style="color: var(--green-color);">${formatPrice(invoiceData.total, invoiceData.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
            </div>

            <div class="terms">
                <h3 class="text-2xl font-bold text-purple-400 mb-6">Terms & Conditions</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="terms-box bg-zinc-900/80 p-6 rounded-xl border border-purple-500/20">
                        <h4 class="text-lg font-semibold text-purple-400 mb-4">Payment Terms</h4>
                        <ul class="space-y-3">
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Payment due within 7 days of invoice date</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">50% advance payment required to start</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Remaining 50% before project delivery</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                    <span class="text-gray-300">All prices in ${invoiceData.currency}</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">5% monthly charge on late payments</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Refund requests within 48 hours of payment</span>
                            </li>
                        </ul>
                    </div>

                    <div class="terms-box bg-zinc-900/80 p-6 rounded-xl border border-purple-500/20">
                        <h4 class="text-lg font-semibold text-purple-400 mb-4">Project Terms</h4>
                        <ul class="space-y-3">
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Timeline starts after advance payment</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Project scope as defined in package</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Two revision rounds included</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Additional revisions charged separately</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Source code handover upon full payment</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">24/7 support during development</span>
                            </li>
                        </ul>
                    </div>

                    <div class="terms-box bg-zinc-900/80 p-6 rounded-xl border border-purple-500/20">
                        <h4 class="text-lg font-semibold text-purple-400 mb-4">Intellectual Property</h4>
                        <ul class="space-y-3">
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Client receives full ownership of deliverables</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Source code rights transfer after payment</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Third-party assets licensed separately</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Client responsible for content copyright</span>
                            </li>
                        </ul>
                    </div>

                    <div class="terms-box bg-zinc-900/80 p-6 rounded-xl border border-purple-500/20">
                        <h4 class="text-lg font-semibold text-purple-400 mb-4">Support & Maintenance</h4>
                        <ul class="space-y-3">
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">30 days free support after completion</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Bug fixes covered in support period</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Server maintenance not included</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Optional maintenance plans available</span>
                            </li>
                            <li class="flex items-start gap-2">
                                <span class="text-purple-400 mt-1">•</span>
                                <span class="text-gray-300">Emergency support at premium rates</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="signature">
                <p>Authorized Signature</p>
                <div class="signature-text">NEX-WEBS</div>
            </div>

            <div class="security-features">
                <span>🔒 Secured with SSL encryption</span>
                <span>• Generated on ${new Date().toLocaleString()}</span>
                <span>• Document ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </div>

            <div class="secure-stamp">
                <div className="secure-stamp-content">
                    <div className="secure-stamp-title">VERIFIED</div>
                    <div className="secure-stamp-subtitle">NEX-WEBS</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;

    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoiceData.invoiceNumber}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSaveDetails = () => {
    if (invoice) {
      setInvoice({
        ...invoice,
        billingDetails: {
          name: editedDetails.name,
          email: editedDetails.email,
          phone: editedDetails.phone,
          address: editedDetails.address
        },
        timeline: editedDetails.timeline
      });
    }
    setIsEditing(false);
  };

  const handleDownloadClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDownload = () => {
    setShowConfirmDialog(false);
    if (invoice) {
      downloadInvoice(invoice);
    }
  };

  const handlePayClick = () => {
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleReviewClick = () => {
    // Check if request limit has been reached
    const storedRequestCount = localStorage.getItem('reviewRequestCount') || '0';
    const storedRequestDate = localStorage.getItem('reviewRequestDate');
    const today = new Date().toDateString();
    
    let currentCount = parseInt(storedRequestCount);
    
    // Reset count if it's a new day
    if (storedRequestDate !== today) {
      currentCount = 0;
      localStorage.setItem('reviewRequestDate', today);
    }
    
    if (currentCount >= 19) {
      setRequestLimitReached(true);
      setShowReviewModal(true);
      return;
    }
    
    // Increment request count
    currentCount += 1;
    localStorage.setItem('reviewRequestCount', currentCount.toString());
    localStorage.setItem('reviewRequestDate', today);
    
    setRequestCount(currentCount);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewSuccess(false);
  };

  const getPackageFeatures = (packageName: string) => {
    const featuresByPackage: { [key: string]: string[] } = {
      'WordPress Basic': [
        'Responsive Design',
        'SEO Optimization',
        'Contact Form',
        'Social Media Integration',
        '1 Month Support'
      ],
      'WordPress Professional': [
        'All Basic Features',
        'Custom Design',
        'E-commerce Ready',
        'Performance Optimization',
        '3 Months Support'
      ],
      'WordPress Enterprise': [
        'All Professional Features',
        'Advanced Security',
        'Custom Functionality',
        'Multi-language Support',
        '6 Months Support'
      ],
      'WordPress E-commerce': [
        'Full E-commerce Functionality',
        'Payment Gateway Integration',
        'Inventory Management',
        'Customer Accounts',
        '12 Months Support'
      ],
      'Shopify Store': [
        'Custom Theme Design',
        'Product Setup',
        'Payment Gateway Integration',
        'Shipping Configuration',
        '3 Months Support'
      ],
      'Shopify/WooCommerce': [
        'Platform Setup',
        'Product Migration',
        'Custom Extensions',
        'Analytics Integration',
        '3 Months Support'
      ],
      'Full-Stack Basic': [
        'Front-end Development',
        'Back-end API',
        'Database Integration',
        'User Authentication',
        '3 Months Support'
      ],
      'Full-Stack Professional': [
        'All Basic Features',
        'Advanced API Development',
        'Third-party Integrations',
        'Performance Optimization',
        '6 Months Support'
      ],
      'Full-Stack Enterprise': [
        'All Professional Features',
        'Scalable Architecture',
        'Load Balancing',
        'Custom Admin Dashboard',
        '12 Months Support'
      ],
      'UI/UX Design': [
        'User Research',
        'Wireframing',
        'Interactive Prototypes',
        'Visual Design',
        'Usability Testing'
      ],
      'Web Apps & AI Solutions': [
        'Custom Web Application',
        'AI Integration',
        'Data Processing',
        'API Development',
        '6 Months Support'
      ],
      'SEO & Content Writing': [
        'Keyword Research',
        'On-page Optimization',
        'Content Strategy',
        'Link Building',
        '3 Months Support'
      ]
    };

    return featuresByPackage[packageName] || [
      'Custom Development',
      'Responsive Design',
      'SEO Optimization',
      'Technical Support',
      'Regular Updates'
    ];
  };

  // Add this utility function for generating unique IDs
  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `NEX-${timestamp}-${randomStr}`;
  };

  const submitProjectReview = async () => {
    // Validate that a base package is selected
    if (!selectedPlan) {
      alert('Please select a package before proceeding.');
      return;
    }

    if (!invoice || !invoice.billingDetails?.email) {
      setButtonShake(true);
      setTimeout(() => setButtonShake(false), 500);
      return;
    }

    setIsSubmitting(true);

    // Generate a unique request ID
    const requestId = generateUniqueId();

    try {
      // Format client details with proper validation
      const clientName = invoice.billingDetails?.name?.trim() || 'Not provided';
      const clientEmail = invoice.billingDetails?.email?.trim() || 'Not provided';
      const clientPhone = invoice.billingDetails?.phone?.trim() || 'Not provided';
      const clientAddress = invoice.billingDetails?.address?.trim() || 'Not provided';

      // Prepare add-ons information
      const addOnsInfo = selectedAddOns.length > 0
        ? selectedAddOns.map(addOnId => {
            const addOn = availableAddOns.find(a => a.id === addOnId);
            return addOn ? `- ${addOn.name}: $${addOn.price}` : '';
          }).filter(Boolean).join('\n')
        : 'None selected';

      // Email configuration with improved formatting
      const emailData = {
        to: "nexdevs.org@gmail.com",
        from: clientEmail !== 'Not provided' ? clientEmail : "system@nexdevs.org",
        subject: `New Project Review: ${invoice.package} - ${requestId}`,
        text: `
New Project Review Submission (ID: ${requestId})

PROJECT DETAILS:
Package: ${invoice.package}
Timeline: ${invoice.timeline}
Amount: ${formatPrice(invoice.total, invoice.currency as SupportedCurrency, 1, isExemptCountry)}
${checkoutSource === 'chatbot' || checkoutSource === 'enterprise' ? `
SELECTED ADD-ONS:
${addOnsInfo}
Total Add-ons Cost: $${getTotalAddOnPrice()}
` : ''}
${checkoutSource === 'enterprise' && enterpriseData ? `
ENTERPRISE CONSULTATION DATA:
${Object.entries(enterpriseData).map(([key, value]) => `${key}: ${value}`).join('\n')}
` : ''}

CLIENT DETAILS:
Name: ${clientName}
Email: ${clientEmail}
Phone: ${clientPhone}
Address: ${clientAddress}

Invoice Number: ${invoice.invoiceNumber}
Request ID: ${requestId}
Submission Date: ${new Date().toLocaleString()}
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Review</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .container { padding: 20px; }
    .header { background: #4f46e5; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
    .section { background: #f9fafb; padding: 15px; border-radius: 5px; margin-bottom: 15px; }
    .id-box { background: #4f46e5; color: white; padding: 10px; border-radius: 5px; font-weight: bold; text-align: center; margin: 15px 0; }
    h2 { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
    h3 { color: #4f46e5; margin-top: 0; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; vertical-align: top; }
    .label { font-weight: bold; width: 120px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Project Review Submission</h2>
    
    <div class="id-box">
      Request ID: ${requestId}
    </div>
    
    <div class="section">
      <h3>Project Details</h3>
      <table>
        <tr>
          <td class="label">Package:</td>
          <td>${invoice.package}</td>
        </tr>
        <tr>
          <td class="label">Timeline:</td>
          <td>${invoice.timeline}</td>
        </tr>
        <tr>
          <td class="label">Amount:</td>
          <td>${formatPrice(invoice.total, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</td>
        </tr>
      </table>
    </div>

    ${(checkoutSource === 'chatbot' || checkoutSource === 'enterprise') && selectedAddOns.length > 0 ? `
    <div class="section">
      <h3>Selected Add-ons</h3>
      <table>
        ${selectedAddOns.map(addOnId => {
          const addOn = availableAddOns.find(a => a.id === addOnId);
          return addOn ? `
            <tr>
              <td class="label">${addOn.name}:</td>
              <td>$${addOn.price}</td>
            </tr>
          ` : '';
        }).join('')}
        <tr style="border-top: 1px solid #ddd; font-weight: bold;">
          <td class="label">Total Add-ons:</td>
          <td>$${getTotalAddOnPrice()}</td>
        </tr>
      </table>
    </div>
    ` : ''}

    ${checkoutSource === 'enterprise' && enterpriseData ? `
    <div class="section">
      <h3>Enterprise Consultation Data</h3>
      <table>
        ${Object.entries(enterpriseData).map(([key, value]) => `
          <tr>
            <td class="label">${key}:</td>
            <td>${value}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    ` : ''}
    
    <div class="section">
      <h3>Client Details</h3>
      <table>
        <tr>
          <td class="label">Name:</td>
          <td>${clientName}</td>
        </tr>
        <tr>
          <td class="label">Email:</td>
          <td>${clientEmail}</td>
        </tr>
        <tr>
          <td class="label">Phone:</td>
          <td>${clientPhone}</td>
        </tr>
        <tr>
          <td class="label">Address:</td>
          <td>${clientAddress}</td>
        </tr>
      </table>
    </div>
    
    <div class="section">
      <h3>Additional Information</h3>
      <table>
        <tr>
          <td class="label">Invoice Number:</td>
          <td>${invoice.invoiceNumber}</td>
        </tr>
        <tr>
          <td class="label">Submission Date:</td>
          <td>${new Date().toLocaleString()}</td>
        </tr>
      </table>
    </div>
    
    <div class="footer">
      <p>This is an automated message from the NEX-DEVS Project Review System.</p>
    </div>
  </div>
</body>
</html>
        `
      };

      // Direct email sending with proper error handling
      try {
        // Create a structured email payload
        const emailPayload = {
          recipientEmail: "nexdevs.org@gmail.com",
          appPassword: "emcu oyjc armd ychz",
          subject: `New Project Request: ${invoice.package} (${requestId})`,
          clientName: clientName,
          clientEmail: clientEmail,
          clientPhone: clientPhone,
          clientAddress: clientAddress,
          projectDetails: {
            package: invoice.package,
            timeline: invoice.timeline,
            amount: formatPrice(invoice.total, invoice.currency as SupportedCurrency, 1, isExemptCountry),
            invoiceNumber: invoice.invoiceNumber,
            requestId: requestId,
            submissionDate: new Date().toLocaleString()
          },
          htmlContent: emailData.html
        };
        
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Email sending failed: ${response.status} - ${errorText}`);
        }
        
        const responseData = await response.json();
        console.log('Email sent successfully:', responseData);
      } catch (error: any) {
        console.error('Error sending email:', error.message || error);
        // Continue with the process even if email fails
      }

      // Store the request ID for display to the user
      localStorage.setItem('lastRequestId', requestId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setReviewSuccess(true);
    } catch (error: any) {
      console.error('Error submitting project review:', error.message || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure formatting functions always use USD
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      <style jsx global>{globalStyles}</style>
      <main className="min-h-screen bg-black text-white py-8 px-4 pt-20 sm:pt-28 sm:py-20 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group">
              <svg 
                className="w-4 h-4 md:w-5 md:h-5 transform transition-transform group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-xs md:text-sm font-medium">Back</span>
            </div>
          </div>

          {/* Selected Package Display - For AI Chatbot Services */}
          {(checkoutSource === 'chatbot' || checkoutSource === 'enterprise') && (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4 mb-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Selected Package</h3>
                  <p className="text-purple-200 text-sm">{selectedPlan}</p>
                  {checkoutSource === 'chatbot' && voiceBotEnabled && (
                    <div className="mt-2">
                      <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded font-medium">
                        + Voice Bot Integration
                      </span>
                    </div>
                  )}
                  {checkoutSource === 'enterprise' && enterpriseData && (
                    <div className="mt-2 text-xs text-gray-300">
                      <p>Custom solution based on your consultation requirements</p>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-300">
                    ${chatbotPrice.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Base Price</div>
                </div>
              </div>
            </div>
          )}

          {/* Updated Pricing Notice */}
          {['USD', 'GBP', 'AED'].includes(currency) && (
            <div className="bg-gradient-to-r from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-xl p-4 mt-4 md:mt-0 mb-6 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="bg-purple-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                  UPDATED
                </div>
                <h3 className="text-lg font-semibold text-white">Pricing Update Notice</h3>
              </div>
              <p className="text-purple-100 mt-2 text-sm">
                We've updated our pricing for {currency} to reflect current market conditions. The new rates provide better value while maintaining our premium service quality.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Left Column - Project Timeline and Payment Details */}
            <div className="space-y-6">
              {/* Project Timeline Section - Hidden for AI integration plans */}
              {!isFromMainPage && (
                <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Project Timeline</h2>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* Urgent Timeline Option */}
                  <div 
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      selectedTimeline === 'Urgent Project (1-2 weeks)'
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => handleTimelineChange('Urgent Project (1-2 weeks)')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTimeline === 'Urgent Project (1-2 weeks)'
                            ? 'border-yellow-500'
                            : 'border-gray-500'
                        }`}>
                          {selectedTimeline === 'Urgent Project (1-2 weeks)' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-yellow-400">Urgent Project</h3>
                          <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded font-medium">+20% Charge</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Delivery in 1-2 weeks</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Normal Timeline Option */}
                  <div 
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      selectedTimeline === 'Normal Time (2-3 weeks)'
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => handleTimelineChange('Normal Time (2-3 weeks)')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTimeline === 'Normal Time (2-3 weeks)'
                            ? 'border-purple-500'
                            : 'border-gray-500'
                        }`}>
                          {selectedTimeline === 'Normal Time (2-3 weeks)' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-purple-400">Normal Time</h3>
                          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded font-medium">Standard</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Delivery in 2-3 weeks</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Relaxed Timeline Option */}
                  <div 
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                      selectedTimeline === 'Relaxed (4 weeks)'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => handleTimelineChange('Relaxed (4 weeks)')}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTimeline === 'Relaxed (4 weeks)'
                            ? 'border-green-500'
                            : 'border-gray-500'
                        }`}>
                          {selectedTimeline === 'Relaxed (4 weeks)' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-green-400">Relaxed</h3>
                          <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded font-medium">5% Discount</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Delivery in 4 weeks</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-zinc-800/50 p-3 rounded-lg text-sm text-gray-300">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Choose a timeline that suits your project needs. Your selection will affect the final price.</p>
                  </div>
                </div>
              </div>
              )}

              {/* Enterprise Roadmap Display - Only for enterprise AI consultation users */}
              {checkoutSource === 'enterprise' && enterpriseData && (
                <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5 relative overflow-hidden">
                  {/* Neural Network Background */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 400 300" fill="none">
                      {/* Neural Network Nodes */}
                      <circle cx="50" cy="50" r="3" fill="#8B5CF6" className="animate-pulse" />
                      <circle cx="150" cy="40" r="3" fill="#3B82F6" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                      <circle cx="250" cy="60" r="3" fill="#10B981" className="animate-pulse" style={{animationDelay: '1s'}} />
                      <circle cx="350" cy="45" r="3" fill="#F59E0B" className="animate-pulse" style={{animationDelay: '1.5s'}} />

                      <circle cx="80" cy="120" r="3" fill="#EF4444" className="animate-pulse" style={{animationDelay: '2s'}} />
                      <circle cx="180" cy="110" r="3" fill="#8B5CF6" className="animate-pulse" style={{animationDelay: '2.5s'}} />
                      <circle cx="280" cy="130" r="3" fill="#3B82F6" className="animate-pulse" style={{animationDelay: '3s'}} />

                      <circle cx="60" cy="190" r="3" fill="#10B981" className="animate-pulse" style={{animationDelay: '3.5s'}} />
                      <circle cx="160" cy="180" r="3" fill="#F59E0B" className="animate-pulse" style={{animationDelay: '4s'}} />
                      <circle cx="260" cy="200" r="3" fill="#EF4444" className="animate-pulse" style={{animationDelay: '4.5s'}} />
                      <circle cx="360" cy="185" r="3" fill="#8B5CF6" className="animate-pulse" style={{animationDelay: '5s'}} />

                      <circle cx="120" cy="250" r="3" fill="#3B82F6" className="animate-pulse" style={{animationDelay: '5.5s'}} />
                      <circle cx="220" cy="240" r="3" fill="#10B981" className="animate-pulse" style={{animationDelay: '6s'}} />
                      <circle cx="320" cy="260" r="3" fill="#F59E0B" className="animate-pulse" style={{animationDelay: '6.5s'}} />

                      {/* Neural Network Connections */}
                      <path d="M50 50 L150 40" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M150 40 L250 60" stroke="#3B82F6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M250 60 L350 45" stroke="#10B981" strokeWidth="0.5" opacity="0.3" />
                      <path d="M50 50 L80 120" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M150 40 L180 110" stroke="#3B82F6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M250 60 L280 130" stroke="#10B981" strokeWidth="0.5" opacity="0.3" />
                      <path d="M80 120 L180 110" stroke="#EF4444" strokeWidth="0.5" opacity="0.3" />
                      <path d="M180 110 L280 130" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M80 120 L60 190" stroke="#EF4444" strokeWidth="0.5" opacity="0.3" />
                      <path d="M180 110 L160 180" stroke="#8B5CF6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M280 130 L260 200" stroke="#3B82F6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M350 45 L360 185" stroke="#F59E0B" strokeWidth="0.5" opacity="0.3" />
                      <path d="M60 190 L160 180" stroke="#10B981" strokeWidth="0.5" opacity="0.3" />
                      <path d="M160 180 L260 200" stroke="#F59E0B" strokeWidth="0.5" opacity="0.3" />
                      <path d="M260 200 L360 185" stroke="#EF4444" strokeWidth="0.5" opacity="0.3" />
                      <path d="M60 190 L120 250" stroke="#10B981" strokeWidth="0.5" opacity="0.3" />
                      <path d="M160 180 L220 240" stroke="#F59E0B" strokeWidth="0.5" opacity="0.3" />
                      <path d="M260 200 L320 260" stroke="#EF4444" strokeWidth="0.5" opacity="0.3" />
                      <path d="M120 250 L220 240" stroke="#3B82F6" strokeWidth="0.5" opacity="0.3" />
                      <path d="M220 240 L320 260" stroke="#10B981" strokeWidth="0.5" opacity="0.3" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Project Roadmap Summary
                    </h2>

                    <div className="space-y-4">
                      {/* Neural Network Style Configuration Overview - All 14 Data Points */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Row 1 - Core Configuration */}
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-purple-600/5 rounded-lg border border-purple-500/20 relative">
                          <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50 animate-pulse"></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Website Status</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[1] || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/5 rounded-lg border border-blue-500/20 relative">
                          <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">AI Model</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[2] || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-lg border border-green-500/20 relative">
                          <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50 animate-pulse" style={{animationDelay: '1s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-green-300 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Timeline</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[3] || 'Not specified'}</span>
                          </div>
                        </div>

                        {/* Row 2 - Business Configuration */}
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 rounded-lg border border-yellow-500/20 relative">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-pulse" style={{animationDelay: '1.5s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Budget</span>
                            <span className="text-sm font-medium text-purple-300">{enterpriseData.budget ? `$${enterpriseData.budget.toLocaleString()}` : 'Custom pricing'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 rounded-lg border border-indigo-500/20 relative">
                          <div className="w-3 h-3 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50 animate-pulse" style={{animationDelay: '2s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-indigo-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Platform</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[5] || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-pink-500/10 to-pink-600/5 rounded-lg border border-pink-500/20 relative">
                          <div className="w-3 h-3 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50 animate-pulse" style={{animationDelay: '2.5s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Business Niche</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[6] || 'Not specified'}</span>
                          </div>
                        </div>

                        {/* Row 3 - Security & Compliance */}
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-500/10 to-red-600/5 rounded-lg border border-red-500/20 relative">
                          <div className="w-3 h-3 bg-red-400 rounded-full shadow-lg shadow-red-400/50 animate-pulse" style={{animationDelay: '3s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-red-300 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Security</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[7] || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-500/10 to-orange-600/5 rounded-lg border border-orange-500/20 relative">
                          <div className="w-3 h-3 bg-orange-400 rounded-full shadow-lg shadow-orange-400/50 animate-pulse" style={{animationDelay: '3.5s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-orange-300 rounded-full animate-ping" style={{animationDelay: '3.5s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">User Volume</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[8] || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-500/10 to-teal-600/5 rounded-lg border border-teal-500/20 relative">
                          <div className="w-3 h-3 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50 animate-pulse" style={{animationDelay: '4s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-teal-300 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Integration</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[9] || 'Not specified'}</span>
                          </div>
                        </div>

                        {/* Row 4 - Performance & Storage */}
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 rounded-lg border border-cyan-500/20 relative">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse" style={{animationDelay: '4.5s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-300 rounded-full animate-ping" style={{animationDelay: '4.5s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Data Storage</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[10] || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-500/10 to-violet-600/5 rounded-lg border border-violet-500/20 relative">
                          <div className="w-3 h-3 bg-violet-400 rounded-full shadow-lg shadow-violet-400/50 animate-pulse" style={{animationDelay: '5s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-violet-300 rounded-full animate-ping" style={{animationDelay: '5s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Performance</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[11] || 'Not specified'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-lg border border-emerald-500/20 relative">
                          <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50 animate-pulse" style={{animationDelay: '5.5s'}}></div>
                          <div className="absolute top-1 right-1 w-1 h-1 bg-emerald-300 rounded-full animate-ping" style={{animationDelay: '5.5s'}}></div>
                          <div>
                            <span className="text-xs text-gray-400 block">Support Level</span>
                            <span className="text-sm font-medium text-white">{enterpriseData[12] || 'Not specified'}</span>
                          </div>
                        </div>

                        {/* Row 5 - Additional Details */}
                        {enterpriseData.additionalDetails && (
                          <div className="md:col-span-2 lg:col-span-3 flex items-start gap-3 p-3 bg-gradient-to-r from-slate-500/10 to-slate-600/5 rounded-lg border border-slate-500/20 relative">
                            <div className="w-3 h-3 bg-slate-400 rounded-full shadow-lg shadow-slate-400/50 animate-pulse mt-1" style={{animationDelay: '6s'}}></div>
                            <div className="absolute top-1 right-1 w-1 h-1 bg-slate-300 rounded-full animate-ping" style={{animationDelay: '6s'}}></div>
                            <div className="flex-1">
                              <span className="text-xs text-gray-400 block">Additional Details</span>
                              <span className="text-sm font-medium text-white">{enterpriseData.additionalDetails}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Neural Network Style Recommended Package */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20 relative overflow-hidden">
                        {/* Animated connection lines */}
                        <div className="absolute inset-0 opacity-20">
                          <svg className="w-full h-full" viewBox="0 0 300 100">
                            <path d="M0 50 Q75 20 150 50 T300 50" stroke="#8B5CF6" strokeWidth="1" fill="none" opacity="0.5">
                              <animate attributeName="stroke-dasharray" values="0,300;150,150;300,0" dur="3s" repeatCount="indefinite" />
                            </path>
                          </svg>
                        </div>
                        <div className="relative z-10">
                          <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            Recommended Solution
                          </h4>
                          <p className="text-sm text-gray-300">
                            Based on your consultation, we recommend our <span className="text-purple-300 font-semibold">Enterprise AI Solution</span>
                            with custom configuration to meet your specific requirements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Optional Add-ons Section - Only for AI Chatbot Services */}
              {shouldShowAddOns() && (
                <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold">Optional Add-ons</h2>
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded font-medium">
                        {selectedAddOns.length} selected
                      </div>
                      <button
                        onClick={() => setAddOnsCollapsed(!addOnsCollapsed)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700/50 hover:bg-zinc-600/50 rounded-lg text-xs font-medium transition-all duration-200 border border-white/10 hover:border-white/20"
                      >
                        <span>{addOnsCollapsed ? 'Show' : 'Hide'}</span>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${addOnsCollapsed ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Collapsed Summary */}
                  {addOnsCollapsed && selectedAddOns.length > 0 && (
                    <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-300">
                          {selectedAddOns.length} add-on{selectedAddOns.length !== 1 ? 's' : ''} selected
                        </span>
                        <span className="text-lg font-bold text-purple-300">
                          ${getTotalAddOnPrice()}
                        </span>
                      </div>
                    </div>
                  )}

                  <motion.div
                    initial={false}
                    animate={{
                      height: addOnsCollapsed ? 0 : 'auto',
                      opacity: addOnsCollapsed ? 0 : 1
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                      opacity: { duration: 0.2 }
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="space-y-3">
                    {/* Group add-ons by category */}
                    {['maintenance', 'features', 'integrations', 'ai', 'analytics'].map(category => {
                      const categoryAddOns = availableAddOns.filter(addon => addon.category === category);
                      if (categoryAddOns.length === 0) return null;

                      const categoryNames = {
                        maintenance: 'Maintenance & Support',
                        features: 'Additional Features',
                        integrations: 'Platform Integrations',
                        ai: 'AI Enhancements',
                        analytics: 'Analytics & Insights'
                      };

                      return (
                        <div key={category} className="space-y-2">
                          <h3 className="text-sm font-semibold text-purple-300 border-b border-purple-500/20 pb-1">
                            {categoryNames[category as keyof typeof categoryNames]}
                          </h3>
                          {categoryAddOns.map(addon => (
                            <div
                              key={addon.id}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                                selectedAddOns.includes(addon.id)
                                  ? 'border-purple-500 bg-purple-500/10'
                                  : 'border-white/10 hover:border-white/30'
                              }`}
                              onClick={() => toggleAddOn(addon.id)}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className="mt-0.5">
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                      selectedAddOns.includes(addon.id)
                                        ? 'border-purple-500 bg-purple-500'
                                        : 'border-gray-500'
                                    }`}>
                                      {selectedAddOns.includes(addon.id) && (
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-white text-sm">{addon.name}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{addon.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-purple-300 font-semibold text-sm">
                                    ${addon.price}
                                  </span>
                                  {addon.id === 'additional-language' && (
                                    <p className="text-xs text-gray-500">per language</p>
                                  )}
                                  {addon.id === 'private-training' && (
                                    <p className="text-xs text-gray-500">per file</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>

                  {selectedAddOns.length > 0 && (
                    <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-purple-300">
                          Total Add-ons ({selectedAddOns.length} items):
                        </span>
                        <span className="text-lg font-bold text-purple-300">
                          ${getTotalAddOnPrice()}
                        </span>
                      </div>
                    </div>
                  )}

                    <div className="mt-4 bg-zinc-800/50 p-3 rounded-lg text-sm text-gray-300">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Add-ons enhance your AI chatbot with additional features and capabilities. Select only what you need - you can always add more later.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Payment Method Section */}
              <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Payment Method</h2>
                
                <div className="grid gap-3 sm:gap-4">
                  {paymentMethods.map(({ id, icon: Icon, label }) => (
                    <div
                      key={id}
                      className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                        paymentMethod === id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      onClick={() => setPaymentMethod(id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Transfer Details */}
              {paymentMethod === 'bank-transfer' && (
                <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                  <h3 className="text-lg font-bold mb-4">Bank Account Details</h3>
                  <div className="space-y-4">
                    {pakistaniBanks.map((bank, index) => (
                      <div key={index} className="p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <h4 className="font-semibold text-base">{bank.bank}</h4>
                          <button 
                            onClick={() => navigator.clipboard.writeText(bank.accountNumber)}
                            className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 bg-purple-500/10 rounded"
                          >
                            Copy
                          </button>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-gray-400">Account Title:</span>
                            <span className="font-medium">{bank.accountTitle}</span>
                          </p>
                          <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-gray-400">Account Number:</span>
                            <span className="font-medium">{bank.accountNumber}</span>
                          </p>
                          <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="text-gray-400">IBAN:</span>
                            <span className="font-medium break-all">{bank.iban}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Wallet Details */}
              {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                  <h3 className="text-lg font-bold mb-4">
                    {paymentMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Details
                  </h3>
                  <div className="space-y-4">
                    {mobileWallets
                      .filter(wallet => wallet.name.toLowerCase() === paymentMethod)
                      .map((wallet, index) => (
                        <div key={index} className="p-3 sm:p-4 rounded-lg border border-white/10 space-y-2">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <h4 className="font-semibold text-base">{wallet.name}</h4>
                            <button 
                              onClick={() => navigator.clipboard.writeText(wallet.number)}
                              className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 bg-purple-500/10 rounded"
                            >
                              Copy Number
                            </button>
                          </div>
                          <div className="space-y-1.5 text-sm">
                            <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="text-gray-400">Account Title:</span>
                              <span className="font-medium">{wallet.accountTitle}</span>
                            </p>
                            <p className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                              <span className="text-gray-400">Number:</span>
                              <span className="font-medium">{wallet.number}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-yellow-400 font-medium">
                        Please follow these steps:
                      </p>
                      <ol className="text-sm text-gray-300 list-decimal list-inside space-y-2">
                        <li className="pl-2">Open your {paymentMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} app</li>
                        <li className="pl-2">Select "Send Money"</li>
                        <li className="pl-2">Enter the number shown above</li>
                        <li className="pl-2">Enter amount: (for-pak-PKR) ($-GBP-AED)-{invoice?.total.toLocaleString()}</li>
                        <li className="pl-2">Complete the transaction</li>
                        <li className="pl-2">Send the transaction ID to support@nex-web-official.com</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Card Form */}
              {(paymentMethod === 'credit-card' || paymentMethod === 'american-express') && (
                <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className="text-lg font-bold">Card Details</h3>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-2 py-1 bg-[#1A1F36] rounded border border-white/10 text-xs font-semibold text-white/70">
                        VISA
                      </div>
                      <div className="px-2 py-1 bg-[#1A1F36] rounded border border-white/10 text-xs font-semibold text-white/70">
                        MASTERCARD
                      </div>
                      <div className="px-2 py-1 bg-[#1A1F36] rounded border border-white/10 text-xs font-semibold text-white/70">
                        AMEX
                      </div>
                      <div className="px-2 py-1 bg-[#1A1F36] rounded border border-white/10 text-xs font-semibold text-white/70">
                        DISCOVER
                      </div>
                    </div>
                  </div>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-3 sm:px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 text-sm sm:text-base pl-10"
                          placeholder="1234 5678 9012 3456"
                        />
                        <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="text-xs font-mono text-gray-400 tracking-wider">
                            {paymentMethod === 'american-express' ? 'AMEX' : 'CARD'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="block text-xs sm:text-sm font-medium mb-2">Expiry Date</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 text-sm sm:text-base"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium mb-2">CVV</label>
                        <div className="relative">
                          <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 text-sm sm:text-base"
                            placeholder={paymentMethod === 'american-express' ? '4DIG' : 'CVV'}
                            maxLength={paymentMethod === 'american-express' ? 4 : 3}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-help group">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 w-48 p-2 bg-black text-xs text-gray-300 rounded-lg">
                              {paymentMethod === 'american-express' 
                                ? '4 digits on the front of your card'
                                : '3 digits on the back of your card'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Name on Card</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 text-sm sm:text-base"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <FaLock className="w-3 h-3" />
                        <span>Secured with encryption</span>
                      </div>
                      <div className="text-xs text-purple-400">
                        Powered by NEX-WEBS
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Column - Invoice & Summary */}
            <div className="space-y-6">
              {isInvoiceLoading ? (
                <LoadingInvoice />
              ) : invoice ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all duration-300 shadow-xl hover:shadow-purple-900/5"
                >
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Invoice Details</h2>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadClick}
                        className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
                      >
                        <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Download</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg shadow-black/20"
                      >
                        <FaFilePdf className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Print</span>
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Company and Invoice Info */}
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 p-4 rounded-lg bg-gradient-to-br from-zinc-800/20 to-zinc-900/30 border border-white/5">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold mb-2 text-white">NEX-WEBS</h3>
                        <p className="text-xs sm:text-sm text-gray-400">Professional Web Development Services</p>
                        <p className="text-xs sm:text-sm text-gray-400">support@nexwebs.com</p>
                      </div>
                      <div className="space-y-2 bg-zinc-800/30 p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-400">Invoice Number:</span>
                          <span className="font-medium">{invoice.invoiceNumber}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-400">Date:</span>
                          <span>{invoice.date}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-400">Due Date:</span>
                          <span>{invoice.dueDate}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-400">Currency:</span>
                          <span className="font-medium text-purple-400">
                            {currency} 
                            {!isExemptCountry && currency !== 'PKR' && ' (International Rate)'}
                            {['USD', 'GBP', 'AED'].includes(currency) && (
                              <span className="bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded ml-2 animate-pulse">
                                UPDATED
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Billing Details */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-white">Billing Details</h3>
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 transition-colors"
                        >
                          {isEditing ? (
                            <span>Cancel</span>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                              <span>Edit Details</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      {isEditing ? (
                        <div className="space-y-4 bg-zinc-800/20 p-4 rounded-lg border border-white/5">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-300">Name</label>
                              <input
                                type="text"
                                value={editedDetails.name}
                                onChange={(e) => setEditedDetails({...editedDetails, name: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring focus:ring-purple-500/20 transition-all duration-200"
                                placeholder="Your Name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-300">Email</label>
                              <input
                                type="email"
                                value={editedDetails.email}
                                onChange={(e) => setEditedDetails({...editedDetails, email: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring focus:ring-purple-500/20 transition-all duration-200"
                                placeholder="your.email@example.com"
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-300">Phone</label>
                              <input
                                type="tel"
                                value={editedDetails.phone}
                                onChange={(e) => setEditedDetails({...editedDetails, phone: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring focus:ring-purple-500/20 transition-all duration-200"
                                placeholder="Your Phone"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-300">Address</label>
                              <input
                                type="text"
                                value={editedDetails.address}
                                onChange={(e) => setEditedDetails({...editedDetails, address: e.target.value})}
                                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 focus:ring focus:ring-purple-500/20 transition-all duration-200"
                                placeholder="Your Address"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <label className="block text-sm font-medium mb-2 text-gray-300">Select Timeline</label>
                            <select
                              value={editedDetails.timeline}
                              onChange={(e) => handleTimelineChange(e.target.value)}
                              className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 transition duration-200 focus:outline-none focus:ring focus:ring-purple-500 text-yellow-300 shadow-lg hover:shadow-xl"
                            >
                              <option value="Urgent Project (1-2 weeks)">Urgent Project (1-2 weeks) +20%</option>
                              <option value="Normal Time (2-3 weeks)">Normal Time (2-3 weeks)</option>
                              <option value="Relaxed (4 weeks)">Relaxed (4 weeks) +5% discount</option>
                            </select>
                          </div>
                          <div className="flex justify-end mt-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleSaveDetails}
                              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg"
                            >
                              Save Details
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-4 text-sm p-3 bg-zinc-800/20 rounded-lg border border-white/5">
                          <div>
                            <p className="mb-1"><span className="text-gray-400">Name:</span> <span className="font-medium text-white">{invoice?.billingDetails?.name || 'Not provided'}</span></p>
                            <p><span className="text-gray-400">Email:</span> <span className="font-medium text-white">{invoice?.billingDetails?.email || 'Not provided'}</span></p>
                          </div>
                          <div>
                            <p className="mb-1"><span className="text-gray-400">Phone:</span> <span className="font-medium text-white">{invoice?.billingDetails?.phone || 'Not provided'}</span></p>
                            <p><span className="text-gray-400">Address:</span> <span className="font-medium text-white">{invoice?.billingDetails?.address || 'Not provided'}</span></p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Invoice Items */}
                    <div className="border-t border-white/10 pt-4">
                      <h3 className="font-semibold mb-3 text-white">Invoice Items</h3>
                      <div className="space-y-3">
                        {invoice.items.map((item, index) => (
                          <div key={index} className="bg-zinc-800/30 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <span className="text-gray-400 text-sm">Description</span>
                                <p className="font-medium text-white">{item.description}</p>
                                {item.details && (
                                  <p className="text-sm text-gray-400 mt-1">{item.details}</p>
                                )}
                                {item.features && item.features.length > 0 && (
                                  <div className="mt-3 space-y-1">
                                    <span className="text-sm text-purple-400">Key Features:</span>
                                    <ul className="text-sm text-gray-400 list-disc list-inside">
                                      {item.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-3 mt-1 bg-black/20 p-2 rounded-lg">
                                <div>
                                  <span className="text-gray-400 text-sm">Rate</span>
                                  <p className="font-medium text-white">{formatPrice(item.rate, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</p>
                                </div>
                                <div>
                                  <span className="text-gray-400 text-sm">Amount</span>
                                  <p className="font-medium text-white">{formatPrice(item.amount, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-white/10 pt-4">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-zinc-800/30 to-zinc-900/50 border border-white/5">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Sub Total:</span>
                            <span className="text-white">{formatPrice(invoice.subTotal, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                          </div>
                          
                          {/* Timeline Adjustments */}
                          {editedDetails.timeline === 'Urgent Project (1-2 weeks)' && (
                            <div className="flex justify-between text-yellow-400">
                              <span>Urgent Timeline Surcharge (20%):</span>
                              <span>+{formatPrice(invoice.items.find(item => item.description.includes('Urgent Timeline'))?.amount || 0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                            </div>
                          )}
                          {editedDetails.timeline === 'Normal Time (2-3 weeks)' && (
                            <div className="flex justify-between text-gray-400">
                              <span>Timeline - Normal (2-3 weeks):</span>
                              <span>{formatPrice(0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                            </div>
                          )}
                          {editedDetails.timeline === 'Relaxed (4 weeks)' && (
                            <div className="flex justify-between text-green-400">
                              <span>Timeline Discount - Relaxed (4 weeks):</span>
                              <span>{formatPrice(invoice.items.find(item => item.description.includes('Timeline Discount'))?.amount || 0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between text-gray-400">
                            <span>Tax (0%):</span>
                            <span>{formatPrice(0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                          </div>
                          <div className="flex justify-between text-emerald-400 font-medium">
                            <span>Discount ({checkoutSource === 'chatbot' || checkoutSource === 'enterprise' ? '0%' : selectedPlan === 'Full-Stack Basic' ? '10%' : '20%'}):</span>
                            <span>-{formatPrice(invoice.discount, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                          </div>
                          
                          {/* Currency Information */}
                          {!isExemptCountry && currency !== 'PKR' && invoice && (
                            <div className="mt-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                              <p className="text-sm text-purple-300 mb-2">International Pricing Information:</p>
                              <ul className="text-xs space-y-1 text-gray-400">
                                <li>• Base price in PKR: {formatPrice(invoice.subTotal / 1.3, 'PKR', 1, true)}</li>
                                <li>• International service fee (30%): {formatPrice(invoice.subTotal - (invoice.subTotal / 1.3), invoice.currency as SupportedCurrency, 1, isExemptCountry)}</li>
                                {Boolean(invoice.items.find(item => item.description.includes('Urgent Timeline'))) && (
                                  <li>• Urgent delivery surcharge (20%): {formatPrice(invoice.items.find(item => item.description.includes('Urgent Timeline'))?.amount || 0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</li>
                                )}
                                {Boolean(invoice.items.find(item => item.description.includes('Timeline Discount'))) && (
                                  <li>• Relaxed timeline discount (5%): {formatPrice(invoice.items.find(item => item.description.includes('Timeline Discount'))?.amount || 0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</li>
                                )}
                                <li>• Current exchange rate: 1 PKR = {baseExchangeRates[currency as SupportedCurrency]} {currency}</li>
                              </ul>
                            </div>
                          )}

                          <div className="border-t border-white/10 pt-3 mt-3">
                            <div className="flex justify-between text-xl font-bold">
                              <span className="text-white">Total:</span>
                              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">{formatPrice(invoice.total, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="border-t border-white/10 pt-4 text-xs sm:text-sm text-gray-400">
                      <p className="font-medium text-yellow-400 mb-2">Payment Instructions:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Please make the payment within 7 days of invoice date</li>
                        <li>Include invoice number in payment reference</li>
                        <li>Send payment confirmation to support@nexwebs.com</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-300">No Invoice Generated</h3>
                    <p className="mt-2 text-sm text-gray-400">
                      Please select a plan and timeline to generate your invoice.
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
                {/* Payment Note */}
                <div className="space-y-5">
                  {/* Contact Information Section */}
                  <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/5 rounded-xl p-6 border border-purple-500/20 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span className="text-purple-400">📞</span>
                      Our Support Team Is Here For You
                    </h3>
                    <p className="text-gray-300 mb-4">Be patient, here's our contact information:</p>
                    <div className="space-y-3">
                      {['03089080171', '03098795492', '03292425950'].map((number, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center justify-between bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 hover:bg-purple-500/15 transition-all duration-300"
                          whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)' }}
                        >
                          <span className="text-white font-medium">{number}</span>
                          <motion.button 
                            onClick={() => navigator.clipboard.writeText(number)}
                            className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 bg-purple-500/10 rounded transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Copy
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-yellow-500 text-xl">⚠️</span>
                        <p className="text-yellow-200/90 text-sm">
                          Please call one time after you've completed the payment to confirm your order
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Updated with Review & Start button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <motion.button
                    className={`review-button bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 text-sm sm:text-base shadow-lg shadow-blue-900/20 ${buttonShake ? 'animate-shake' : ''}`}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReviewClick}
                  >
                    <FaClipboardCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Review & Start</span>
                  </motion.button>
                  
                  <motion.button
                    className={`pay-button bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 text-sm sm:text-base shadow-lg shadow-purple-900/20 ${buttonShake ? 'animate-shake' : ''}`}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePayClick}
                  >
                    <FaLock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Pay Now</span>
                  </motion.button>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 text-center mt-4">
                  <span className="flex items-center justify-center gap-2">
                    <FaLock className="w-3 h-3 text-purple-400" />
                    Your payment is secured with SSL encryption
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Processing Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn">
            <div className="relative bg-gradient-to-br from-zinc-900 to-zinc-950 p-5 sm:p-6 rounded-xl border border-purple-500/20 max-w-sm w-full mx-4 shadow-2xl shadow-purple-900/10">
              <motion.button
                initial={{ opacity: 0.6 }}
                whileHover={{ opacity: 1 }}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={closePaymentModal}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center bg-purple-500/10 rounded-full p-2.5 mx-auto">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white">Payment Process Update</h3>
                  <p className="text-gray-300 text-xs mt-1">
                    We're enhancing our payment system to prioritize your security.
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 py-2">
                  {[
                    { name: 'JazzCash', icon: FaMobileAlt, color: 'bg-red-600', onClick: () => setPaymentMethod('jazzcash') },
                    { name: 'EasyPaisa', icon: FaMobileAlt, color: 'bg-green-600', onClick: () => setPaymentMethod('easypaisa') },
                    { name: 'Bank Transfer', icon: FaUniversity, color: 'bg-blue-600', onClick: () => setPaymentMethod('bank-transfer') }
                  ].map((method, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center cursor-pointer"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={method.onClick}
                    >
                      <div className={`${method.color} rounded-lg p-2 mx-auto w-10 h-10 flex items-center justify-center mb-1`}>
                        <method.icon className="text-white text-sm" />
                      </div>
                      <p className="text-[10px] font-medium text-gray-300">{method.name}</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-left">
                  <div className="flex gap-2">
                    <span className="text-yellow-500 text-sm flex-shrink-0">ⓘ</span>
                    <p className="text-xs text-yellow-200/90">
                      After completing your transaction, please contact our support team with your receipt for verification.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setPaymentMethod('jazzcash');
                      closePaymentModal();
                    }}
                    className="py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-lg shadow-purple-900/20"
                  >
                    Continue to Payment
                  </motion.button>
                  <button
                    onClick={closePaymentModal}
                    className="py-2 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                
                <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1.5 pt-1">
                  <FaLock className="w-2.5 h-2.5" />
                  <span>Your security is our priority</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-xl border border-purple-500/20 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <svg className="w-12 h-12 text-purple-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Download Invoice</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Please note that this invoice contains important information about your project terms and conditions.
                </p>
                <div className="mt-2 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <p className="text-yellow-400 text-sm font-medium mb-2">
                    ⚠️ Important Notice
                  </p>
                  <p className="text-gray-300 text-sm">
                    This invoice serves as your official proof of agreement and payment evidence. Please ensure all details are accurate and keep it securely for your records.
                  </p>
                </div>
                {isMobile && (
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-yellow-400 text-sm">
                      ⚠️ You are on a mobile device. For the best viewing experience, we recommend opening the invoice on a laptop or desktop computer.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleConfirmDownload}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  I Understand, Continue
                </button>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Project Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 transition-all duration-300 animate-fadeIn overflow-y-auto pt-16 pb-6">
            <div className="relative bg-zinc-900 p-4 sm:p-5 rounded-lg border border-indigo-500/20 max-w-2xl w-full mx-4 shadow-xl">
              <motion.button
                initial={{ opacity: 0.6 }}
                whileHover={{ opacity: 1 }}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={closeReviewModal}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              {requestLimitReached ? (
                <div className="text-center py-5 space-y-4">
                  <div className="inline-flex items-center justify-center bg-yellow-500/20 rounded-full p-3 mx-auto">
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Request Limit Reached</h3>
                    <p className="text-gray-300 text-sm max-w-md mx-auto">
                      You've reached the maximum of 2 project review requests per day. Please try again tomorrow or contact our support team directly.
                    </p>
                  </div>
                  
                  <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-500/20 max-w-md mx-auto">
                    <div className="flex items-start gap-2">
                      <div className="bg-indigo-500/30 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-indigo-300">Contact Support</h4>
                        <p className="text-xs text-gray-300 mt-1">
                          Please call our support team at 03089080171 for immediate assistance with your project.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3">
                    <button
                      onClick={closeReviewModal}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : reviewSuccess ? (
                <div className="text-center py-5 space-y-4">
                  <div className="inline-flex items-center justify-center bg-green-500/20 rounded-full p-3 mx-auto">
                    <FaRegCheckCircle className="w-10 h-10 text-green-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">Project Review Submitted!</h3>
                    <p className="text-gray-300 text-sm max-w-md mx-auto">
                      Your project is being reviewed and our team will contact you within 30 minutes to discuss next steps.
                    </p>
                  </div>
                  
                  <div className="bg-indigo-900/30 rounded-lg p-3 border border-indigo-500/20 max-w-md mx-auto">
                    <div className="flex items-start gap-2">
                      <div className="bg-indigo-500/30 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-indigo-300">What happens next?</h4>
                        <p className="text-xs text-gray-300 mt-1">
                          A dedicated consultant will be assigned to your project and will contact you within 30 minutes to discuss your requirements in detail.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-600/20 rounded-lg p-3 border border-indigo-500/20 max-w-md mx-auto">
                    <h4 className="text-sm font-semibold text-indigo-300 mb-1">Your Request ID</h4>
                    <div className="bg-indigo-900/50 p-2 rounded border border-indigo-500/30 font-mono text-base text-white tracking-wider">
                      {localStorage.getItem('lastRequestId')}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Please save this ID for reference when contacting support.
                    </p>
                  </div>
                  
                  <div className="pt-3">
                    <button
                      onClick={closeReviewModal}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-center mb-2">
                    <div className="inline-flex items-center justify-center bg-indigo-500/20 rounded-full p-2 mx-auto mb-2">
                      <FaRocket className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Review Your Project</h3>
                    <p className="text-gray-400 text-xs mt-1 max-w-lg mx-auto">
                      Submit your project for review and our team will contact you within 30 minutes.
                    </p>
                  </div>
                  
                  {invoice ? (
                    <div className="space-y-3">
                      <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
                        {/* Project Details */}
                        <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/20">
                          <h4 className="text-base font-semibold text-indigo-300 mb-2">Project Details</h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <div>
                                <span className="text-gray-400 text-xs">Package:</span>
                                <p className="font-medium text-white text-sm">{invoice.package}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs">Timeline:</span>
                                <p className="font-medium text-white text-sm">{invoice.timeline}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs">Total Amount:</span>
                                <p className="font-medium text-green-400 text-sm">{formatPrice(invoice.total, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</p>
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-400 text-xs">Key Features:</span>
                              <ul className="mt-1 space-y-0.5">
                                {getPackageFeatures(invoice.package).map((feature, index) => (
                                  <li key={index} className="flex items-start gap-1.5 text-xs">
                                    <svg className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-gray-300">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        {/* Client Details */}
                        <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/20">
                          <h4 className="text-base font-semibold text-indigo-300 mb-2">Client Details</h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <div>
                                <span className="text-gray-400 text-xs">Name:</span>
                                <p className="font-medium text-white text-sm">{invoice.billingDetails?.name || 'Not provided'}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs">Email:</span>
                                <p className="font-medium text-white text-sm">{invoice.billingDetails?.email || 'Not provided'}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="text-gray-400 text-xs">Phone:</span>
                                <p className="font-medium text-white text-sm">{invoice.billingDetails?.phone || 'Not provided'}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-xs">Address:</span>
                                <p className="font-medium text-white text-sm">{invoice.billingDetails?.address || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                          
                          {(!invoice.billingDetails?.name || !invoice.billingDetails?.email) && (
                            <div className="mt-3 p-2 bg-yellow-900/20 rounded-md border border-yellow-500/20">
                              <div className="flex items-start gap-2">
                                <svg className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p className="text-yellow-100 text-xs">
                                  Please complete your billing details before submitting for review.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Process Information */}
                        <div className="bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/20">
                          <h4 className="text-base font-semibold text-indigo-300 mb-2">Our Process</h4>
                          <ol className="space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="bg-indigo-500/30 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-200 text-xs font-medium">1</span>
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">Project Review</p>
                                <p className="text-xs text-gray-400">Our team will review your project requirements within 30 minutes.</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="bg-indigo-500/30 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-200 text-xs font-medium">2</span>
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">Dedicated Consultant</p>
                                <p className="text-xs text-gray-400">A dedicated consultant will be assigned to your project.</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="bg-indigo-500/30 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-200 text-xs font-medium">3</span>
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">Payment Processing</p>
                                <p className="text-xs text-gray-400">We'll guide you through the payment process once requirements are confirmed.</p>
                              </div>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="bg-indigo-500/30 h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-200 text-xs font-medium">4</span>
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">Project Kickoff</p>
                                <p className="text-xs text-gray-400">Development begins with regular updates throughout the process.</p>
                              </div>
                            </li>
                          </ol>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-3">
                        <motion.button
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          disabled={isSubmitting || !invoice.billingDetails?.email}
                          onClick={submitProjectReview}
                          className={`px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                            (isSubmitting || !invoice.billingDetails?.email) ? 'opacity-70 cursor-not-allowed' : ''
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaRocket className="w-3.5 h-3.5" />
                              Submit for Review
                            </>
                          )}
                        </motion.button>
                      </div>
                      
                      <div className="text-center text-xs text-gray-500 pt-1">
                        <p>You have {2 - requestCount} review requests remaining today</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center bg-indigo-500/20 rounded-full p-2 mx-auto mb-3">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-white">No Project Details</h4>
                      <p className="text-gray-400 text-xs mt-2">
                        Please select a plan and complete your billing details first.
                      </p>
                      <button
                        onClick={closeReviewModal}
                        className="mt-4 px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
}