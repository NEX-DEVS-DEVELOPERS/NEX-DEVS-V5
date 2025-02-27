'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaLock, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaUniversity, FaMobileAlt, FaDownload, FaFilePdf } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useCurrency } from '@/app/contexts/CurrencyContext';
import { formatPrice, convertPrice, baseExchangeRates } from '@/app/utils/pricing';
import type { SupportedCurrency } from '@/app/utils/pricing';

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
    accountTitle: "NEX-WEBS",
    accountNumber: "1234-5678-9012-3456",
    iban: "PK36HABB0000123456789012"
  },
  {
    bank: "Meezan Bank",
    accountTitle: "NEX-WEBS",
    accountNumber: "9876-5432-1098-7654",
    iban: "PK36MEZN0000987654321098"
  },
  {
    bank: "UBL",
    accountTitle: "NEX-WEBS",
    accountNumber: "4567-8901-2345-6789",
    iban: "PK36UNIL0000456789012345"
  }
];

const mobileWallets = [
  {
    name: "JazzCash",
    number: "0300-1234567",
    accountTitle: "NEX-WEBS"
  },
  {
    name: "Easypaisa",
    number: "0333-7654321",
    accountTitle: "NEX-WEBS"
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

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currency, isExemptCountry, exchangeRate } = useCurrency();
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
    const plan = searchParams.get('plan');
    if (plan) {
      setSelectedPlan(decodeURIComponent(plan));
      // Generate invoice details
      if (selectedPlan) {
        generateInvoice(selectedPlan);
      }
    }
  }, [searchParams, locationData]); // Add locationData as dependency

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

  const getBaseAmount = (plan: string): number => {
    const prices: { [key: string]: number } = {
      'WordPress Basic': 35000,
      'WordPress Professional': 45000,
      'WordPress Enterprise': 65000,
      'Shopify/WooCommerce': 55000,
      'Full-Stack Basic': 55000,
      'Full-Stack Professional': 75000,
      'Full-Stack Enterprise': 95000,
      'UI/UX Design': 50000,
      'Web Apps & AI Solutions': 85000,
      'SEO & Content Writing': 30000
    };
    
    const matchingKey = Object.keys(prices).find(
      key => key.toLowerCase() === plan.toLowerCase()
    );
    
    return matchingKey ? prices[matchingKey] : 0;
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

  const generateInvoice = async (plan: string) => {
    try {
      const baseAmount = getBaseAmount(plan);
      
      if (!exchangeRate) {
        console.error('Exchange rate not available');
        return;
      }

      const convertedAmount = Math.round(baseAmount * exchangeRate);
      const currentTimeline = editedDetails.timeline;
      const timelineSurchargeRate = getTimelineSurcharge(currentTimeline);
      const timelineSurchargeAmount = Math.round(convertedAmount * timelineSurchargeRate);
      const subTotal = convertedAmount;
      const discountPercentage = plan === 'Full-Stack Basic' ? 10 : 20;
      const discountAmount = Math.round((subTotal * discountPercentage) / 100);
      const taxRate = 0;
      const taxAmount = Math.round((subTotal * taxRate) / 100);
      const total = subTotal + timelineSurchargeAmount - discountAmount + taxAmount;

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
        total: total,
        currency: currency,
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
      const discountPercentage = selectedPlan === 'Full-Stack Basic' ? 10 : 20;
      const discountAmount = Math.round((subTotal * discountPercentage) / 100);
      const total = subTotal + timelineSurchargeAmount - discountAmount;

      console.log('Calculated amounts:', {
        baseAmount,
        convertedAmount,
        timelineSurchargeRate,
        timelineSurchargeAmount,
        total
      });

      const newInvoice: InvoiceDetails = {
        invoiceNumber: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        package: selectedPlan,
        timeline: value,
        amount: convertedAmount,
        subTotal: subTotal,
        discount: discountAmount,
        total: total,
        currency: currency,
        taxRate: 0,
        taxAmount: 0,
        items: [
          {
            description: `${selectedPlan} Package`,
            quantity: 1,
            rate: convertedAmount,
            amount: convertedAmount,
            features: []
          }
        ],
        billingDetails: invoice?.billingDetails || {
          name: editedDetails.name,
          email: editedDetails.email,
          phone: editedDetails.phone,
          address: editedDetails.address
        }
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

  // Add effect to regenerate invoice when currency or exchange rate changes
  useEffect(() => {
    if (selectedPlan && exchangeRate) {
      generateInvoice(selectedPlan);
    }
  }, [currency, exchangeRate, isExemptCountry]);

  const downloadInvoice = (invoiceData: InvoiceDetails) => {
    const invoiceContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEX-WEBS Invoice</title>
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
                    <div class="logo">NEX-WEBS</div>
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
                    <span>Discount (${selectedPlan === 'Full-Stack Basic' ? '10%' : '20%'}):</span>
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
    setButtonShake(true);
    setTimeout(() => setButtonShake(false), 500);
    const modal = document.getElementById('angryWarningModal');
    if (modal) modal.classList.remove('hidden');
  };

  return (
    <main className="min-h-screen bg-black text-white py-8 px-4 sm:py-20 sm:px-6">
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

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column - Project Timeline and Payment Details */}
          <div className="space-y-6">
            {/* Project Timeline Section */}
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
                      <li className="pl-2">Enter amount: PKR ${invoice?.total.toLocaleString()}</li>
                      <li className="pl-2">Complete the transaction</li>
                      <li className="pl-2">Send the transaction ID to support@nexwebs.com</li>
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
            {invoice && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold">Invoice Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDownloadClick}
                      className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                    >
                      <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                    >
                      <FaFilePdf className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {/* Company and Invoice Info */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold mb-2">NEX-WEBS</h3>
                      <p className="text-xs sm:text-sm text-gray-400">Professional Web Development Services</p>
                      <p className="text-xs sm:text-sm text-gray-400">support@nexwebs.com</p>
                    </div>
                    <div className="space-y-2">
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
                          {currency} {!isExemptCountry && currency !== 'PKR' && '(International Rate)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Billing Details */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold">Billing Details</h3>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2"
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
                      <div className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                              type="text"
                              value={editedDetails.name}
                              onChange={(e) => setEditedDetails({...editedDetails, name: e.target.value})}
                              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                              placeholder="Your Name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              value={editedDetails.email}
                              onChange={(e) => setEditedDetails({...editedDetails, email: e.target.value})}
                              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                              placeholder="your.email@example.com"
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Phone</label>
                            <input
                              type="tel"
                              value={editedDetails.phone}
                              onChange={(e) => setEditedDetails({...editedDetails, phone: e.target.value})}
                              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                              placeholder="Your Phone"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Address</label>
                            <input
                              type="text"
                              value={editedDetails.address}
                              onChange={(e) => setEditedDetails({...editedDetails, address: e.target.value})}
                              className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                              placeholder="Your Address"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <label className="block text-sm font-medium mb-2">Select Timeline</label>
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
                          <button
                            onClick={handleSaveDetails}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Save Details
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="text-gray-400">Name:</span> {invoice?.billingDetails?.name}</p>
                          <p><span className="text-gray-400">Email:</span> {invoice?.billingDetails?.email}</p>
                        </div>
                        <div>
                          <p><span className="text-gray-400">Phone:</span> {invoice?.billingDetails?.phone}</p>
                          <p><span className="text-gray-400">Address:</span> {invoice?.billingDetails?.address}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Invoice Items */}
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="font-semibold mb-3">Invoice Items</h3>
                    <div className="space-y-3">
                      {invoice.items.map((item, index) => (
                        <div key={index} className="bg-zinc-800/50 p-3 rounded-lg">
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <span className="text-gray-400 text-sm">Description</span>
                              <p className="font-medium">{item.description}</p>
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
                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div>
                                <span className="text-gray-400 text-sm">Rate</span>
                                <p className="font-medium">{formatPrice(item.rate, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-sm">Amount</span>
                                <p className="font-medium">{formatPrice(item.amount, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sub Total:</span>
                        <span>{formatPrice(invoice.subTotal, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
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
                        <span>Discount ({selectedPlan === 'Full-Stack Basic' ? '10%' : '20%'}):</span>
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

                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span>{formatPrice(invoice.total, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
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
            )}

            <div className="bg-zinc-900/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm border border-white/5">
              {/* Payment Note */}
              <div className="space-y-4">
                {/* Contact Information Section */}
                <div className="bg-gradient-to-br from-purple-900/20 to-purple-800/5 rounded-xl p-6 border border-purple-500/20 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-purple-400">📞</span>
                    Our Support Team Is Here For You
                  </h3>
                  <p className="text-gray-300 mb-4">Be patient, here's our contact information:</p>
                  <div className="space-y-3">
                          {['03089080171', '03098795492', '03292425950'].map((number, index) => (
                      <div key={index} className="flex items-center justify-between bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                        <span className="text-white font-medium">{number}</span>
                              <button 
                          onClick={() => navigator.clipboard.writeText(number)}
                          className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 bg-purple-500/10 rounded transition-colors"
                              >
                                Copy
                              </button>
                            </div>
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

                <div className="bg-gradient-to-br from-red-900/20 to-red-800/5 rounded-xl p-6 border border-red-500/20 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">⚡</span>
                    <div className="space-y-2">
                      <p className="text-gray-300 text-sm">
                        Since Stripe isn't available in Pakistan, we are actively working on implementing new secure payment methods. 
                        Meanwhile, we offer several trusted local payment options for your convenience.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['Bank Transfer', 'JazzCash', 'EasyPaisa'].map((method, index) => (
                          <span key={index} className="text-xs bg-red-500/10 text-red-300 px-3 py-1 rounded-full border border-red-500/20">
                            {method}
                          </span>
                        ))}
                    </div>
                  </div>
                    </div>
                  </div>

                {/* International Payment Methods */}
                <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/5 rounded-xl p-6 border border-blue-500/20 backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-400">🌐</span>
                    International Payment Methods
                  </h3>
                  
                  <div className="space-y-4">
                    {/* PayPal */}
                    <div className="bg-blue-500/5 rounded-lg p-4 border border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#003087] p-2 rounded-lg">
                            <FaPaypal className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">PayPal</h4>
                            <p className="text-xs text-gray-400">Send to: nexwebs.org@gmail.com</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText('nexwebs.org@gmail.com')}
                          className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 bg-blue-500/10 rounded transition-colors"
                        >
                          Copy Email
                        </button>
                      </div>
                    </div>

                    {/* Apple Pay */}
                    <div className="bg-zinc-500/5 rounded-lg p-4 border border-zinc-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-black p-2 rounded-lg">
                            <FaApplePay className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Apple Pay</h4>
                            <p className="text-xs text-gray-400">ID: nexwebs@apple.pay</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText('nexwebs@apple.pay')}
                          className="text-xs text-gray-400 hover:text-gray-300 px-2 py-1 bg-zinc-500/10 rounded transition-colors"
                        >
                          Copy ID
                        </button>
                      </div>
                    </div>

                    {/* Google Pay */}
                    <div className="bg-[#4285f4]/5 rounded-lg p-4 border border-[#4285f4]/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-white p-2 rounded-lg">
                            <FaGooglePay className="w-6 h-6 text-[#4285f4]" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white">Google Pay</h4>
                            <p className="text-xs text-gray-400">UPI: nexwebs@gpay</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText('nexwebs@gpay')}
                          className="text-xs text-[#4285f4] hover:text-blue-300 px-2 py-1 bg-[#4285f4]/10 rounded transition-colors"
                        >
                          Copy UPI
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-400 text-sm">ℹ️</span>
                        <p className="text-xs text-gray-400">
                          International payments are subject to a 30% service fee. After payment, please send the transaction ID to support@nexwebs.com for verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning modal */}
              <div id="angryWarningModal" className="hidden fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-red-900/30 to-black p-8 rounded-2xl border border-red-500/20 max-w-md w-full mx-4">
                  <div className="text-center space-y-4">
                    <div className="bg-red-500/10 rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                      <span className="text-4xl">⚠️</span>
                          </div>
                    <h3 className="text-xl font-bold text-red-400">Payment Not Available</h3>
                    <div className="space-y-2">
                      <p className="text-gray-300">
                        We currently don't accept Stripe payments in Pakistan.
                      </p>
                      <p className="text-sm text-gray-400">
                        Please use one of our secure local payment methods listed above:
                      </p>
                      <div className="flex justify-center gap-2 mt-2">
                        {['Bank Transfer', 'JazzCash', 'EasyPaisa'].map((method, index) => (
                          <span key={index} className="text-xs bg-red-500/10 text-red-300 px-3 py-1 rounded-full border border-red-500/20">
                            {method}
                          </span>
                        ))}
                            </div>
                    </div>
                    <button 
                      onClick={() => {
                        const modal = document.getElementById('angryWarningModal');
                        if (modal) modal.classList.add('hidden');
                      }}
                      className="w-full py-3 bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-zinc-700 hover:to-zinc-800 text-white rounded-lg font-medium transition-all duration-200 border border-red-500/20"
                    >
                      I Understand
                    </button>
                            </div>
                          </div>
                        </div>

              {/* Add click handler for pay button */}
              <div className="flex justify-end mt-6">
                  <motion.button
                  className={`pay-button w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${buttonShake ? 'animate-shake' : ''}`}
                  whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  onClick={handlePayClick}
                  >
                    <FaLock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Pay Now</span>
                  </motion.button>
              </div>

                  <p className="text-xs sm:text-sm text-gray-400 text-center mt-3 sm:mt-4">
                    Your payment is secured with SSL encryption
                  </p>
            </div>
          </div>
        </div>
      </div>

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
    </main>
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