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
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    timeline: 'Normal (2-4 weeks)'
  });
  const [timelineOptions, setTimelineOptions] = useState<string>('Normal (2-4 weeks)');

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
    switch (timeline) {
      case 'Urgent (1-2 weeks)':
        return 0.20; // 20% surcharge for urgent projects
      case 'Normal (2-4 weeks)':
        return 0; // No surcharge for normal timeline
      case 'Relaxed (4+ weeks)':
        return -0.05; // 5% discount for relaxed timeline
      default:
        return 0;
    }
  };

  const generateInvoice = async (plan: string) => {
    try {
      // Get the base amount in PKR
      const baseAmount = getBaseAmount(plan);
      
      // Wait for exchangeRate to be available
      if (!exchangeRate) {
        console.error('Exchange rate not available');
        return;
      }

      // Convert amount using the current exchange rate
      const convertedAmount = Math.round(baseAmount * exchangeRate);
      
      // Calculate timeline surcharge
      const timelineSurchargeRate = getTimelineSurcharge(editedDetails.timeline);
      const timelineSurchargeAmount = Math.round(convertedAmount * timelineSurchargeRate);
      
      // Calculate subtotal (base amount)
      const subTotal = convertedAmount + timelineSurchargeAmount;
      
      // Calculate discount - 20% for all plans except Full-Stack Basic which gets 10%
      const discountPercentage = selectedPlan === 'Full-Stack Basic' ? 10 : 20;
      const discountAmount = Math.round((subTotal * discountPercentage) / 100);
      
      // Calculate tax (currently 0)
      const taxRate = 0;
      const taxAmount = Math.round((subTotal * taxRate) / 100);
      
      // Calculate final total including surcharge
      const total = subTotal - discountAmount + taxAmount;

      const newInvoice: InvoiceDetails = {
        invoiceNumber: `INV-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        package: plan,
        timeline: editedDetails.timeline || 'Normal (2-4 weeks)',
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

      // Add timeline surcharge as a separate line item if applicable
      if (timelineSurchargeAmount > 0) {
        newInvoice.items.push({
          description: 'Urgent Timeline Surcharge (20%)',
          quantity: 1,
          rate: timelineSurchargeAmount,
          amount: timelineSurchargeAmount,
          details: 'Additional charge for urgent delivery (1-2 weeks)',
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
    setEditedDetails(prev => ({ ...prev, timeline: value }));
    if (selectedPlan) {
      generateInvoice(selectedPlan);
    }
  };

  // Add a function to display timeline surcharge warning
  const getTimelineSurchargeWarning = (timeline: string) => {
    if (timeline === 'Urgent (1-2 weeks)') {
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

  const downloadInvoice = (invoice: InvoiceDetails) => {
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
            background: var(--secondary-background);
            padding: 1.5rem;
            border-radius: 12px;
            margin: 2rem 0;
        }

        .project-details h3 {
            color: var(--primary-color);
            margin: 0 0 1rem 0;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .project-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }

        .project-detail-item {
            background: rgba(0, 0, 0, 0.2);
            padding: 1rem;
            border-radius: 8px;
        }

        .project-detail-item h4 {
            color: var(--text-color);
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            font-weight: 500;
        }

        .project-detail-item p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.95rem;
            margin: 0;
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
            padding: 1.5rem;
            border-radius: 12px;
        }

        .terms h3 {
            color: var(--primary-color);
            margin: 0 0 1.5rem 0;
            font-size: 1.25rem;
            font-weight: 600;
        }

        .terms-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
        }

        .terms-section h4 {
            color: var(--text-color);
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
            font-weight: 500;
        }

        .terms-section ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
            color: rgba(255, 255, 255, 0.7);
        }

        .terms-section li {
            margin: 0.75rem 0;
            padding-left: 1.5rem;
            position: relative;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .terms-section li:before {
            content: "•";
            color: var(--primary-color);
            position: absolute;
            left: 0;
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
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="watermark">NEX-WEBS</div>
        <div class="content">
            <div class="header">
                <div class="company-info">
                    <div class="logo">NEX-WEBS</div>
                    <div class="company-details">
                        Professional Web Development Services<br>
                        support@nexwebs.com<br>
                        +92 329-2425950
                    </div>
                </div>
                
                <div class="invoice-details">
                    <h2>Invoice Details</h2>
                    <p><strong style="color: var(--green-color);">Invoice No:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${invoice.date}</p>
                    <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
                    <p><strong>Timeline:</strong> ${invoice.timeline}</p>
                </div>
            </div>

            <div class="project-info">
                <h3>Project Information</h3>
                <div class="project-details">
                    <h3>Project Details</h3>
                    <p><strong>Package:</strong> ${invoice.package}</p>
                    <p><strong>Timeline:</strong> ${invoice.timeline}</p>
                    <p><strong>Amount:</strong> ${formatPrice(invoice.amount, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</p>
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
                        <span>${invoice.billingDetails?.name || 'Your Name'}</span>
                    </div>
                    <div class="details-row">
                        <strong>Email:</strong>
                        <span>${invoice.billingDetails?.email || 'your.email@example.com'}</span>
                    </div>
                    <div class="details-row">
                        <strong>Phone:</strong>
                        <span>${invoice.billingDetails?.phone || 'Your Phone'}</span>
                    </div>
                    <div class="details-row">
                        <strong>Address:</strong>
                        <span>${invoice.billingDetails?.address || 'Your Address'}</span>
                    </div>
                </div>
            </div>

            <div className="project-info">
                
                <h2 className="project-details bg-zinc-800 p-4 rounded-lg shadow-lg"</h2>
                    <h4 className="text-md font-semibold">Project Timeline</h4>
                    <div className="flex flex-col">
                        <label className="block text-sm font-medium mb-2">Select Timeline</label>
                        <select
                            value={editedDetails.timeline}
                            onChange={(e) => handleTimelineChange(e.target.value)}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 transition duration-200 focus:outline-none focus:ring focus:ring-purple-500 text-yellow-300 shadow-lg hover:shadow-xl"
                        >
                            <option value="Urgent (1-2 weeks)">Urgent (1-2 weeks) +20% surcharge</option>
                            <option value="Normal (2-4 weeks)">Normal (2-4 weeks)</option>
                            <option value="Relaxed (4+ weeks)">Relaxed (4+ weeks) +5% discount</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-3 p-2 bg-red-500 text-red-300 rounded-lg text-sm">
                <span className="text-red-600 font-bold">Warning:</span> 
                <span className="text-yellow-300">Change the timeline according to your liking, please. Otherwise, we will charge you.</span>
            </div>

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
                    ${invoice.items.map(item => `
                        <tr>
                            <td>
                                ${item.description}
                                ${item.details ? `<br><small>${item.details}</small>` : ''}
                            </td>
                            <td>${item.quantity}</td>
                            <td>${formatPrice(item.rate, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                            <td>${formatPrice(item.amount, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>${formatPrice(invoice.subTotal, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (${invoice.taxRate}%):</span>
                    <span>${formatPrice(invoice.taxAmount, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
                <div class="summary-row">
                    <span>Discount (${selectedPlan === 'Full-Stack Basic' ? '10%' : '20%'}):</span>
                    <span>-${formatPrice(invoice.discount, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span style="color: var(--green-color);">${formatPrice(invoice.total, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
                </div>
            </div>

            <div class="terms">
                <h3>Terms & Conditions</h3>
                <div className="terms-grid">
                    <div className="terms-section">
                        <h4>Payment Terms</h4>
                        <ul>
                            <li>Payment is due within 7 days of invoice date</li>
                            <li>50% advance payment required to start the project</li>
                            <li>Remaining 50% payment before project delivery</li>
                            <li>All prices are in ${invoice.currency}</li>
                            <li>Late payments will incur a 5% monthly charge</li>
                            <li>Refund requests must be made within 48 hours of payment</li>
                            <li>Transaction fees are responsibility of the client</li>
                            <li>Payment plans available for enterprise projects</li>
                        </ul>
                    </div>
                    <div className="terms-section">
                        <h4>Project Terms</h4>
                        <ul>
                            <li>Timeline starts after receiving advance payment</li>
                            <li>Project scope as defined in the package details</li>
                            <li>Two rounds of revisions included</li>
                            <li>Additional revisions charged separately</li>
                            <li>Source code handover upon full payment</li>
                            <li>All deliverables will be provided in digital format</li>
                            <li>Client is responsible for providing necessary content and feedback</li>
                            <li>Any additional features requested will be quoted separately</li>
                            <li>Regular progress updates via email/chat</li>
                            <li>24/7 support during development phase</li>
                        </ul>
                    </div>
                    <div className="terms-section">
                        <h4>Intellectual Property</h4>
                        <ul>
                            <li>Client receives full ownership of final deliverables</li>
                            <li>Source code rights transfer upon final payment</li>
                            <li>NEX-WEBS retains right to showcase work in portfolio</li>
                            <li>Third-party assets licensed separately</li>
                            <li>Client responsible for content copyright</li>
                        </ul>
                    </div>
                    <div className="terms-section">
                        <h4>Support & Maintenance</h4>
                        <ul>
                            <li>30 days of free support after project completion</li>
                            <li>Bug fixes covered during support period</li>
                            <li>Server maintenance not included</li>
                            <li>Optional maintenance plans available</li>
                            <li>Emergency support available at premium rates</li>
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
    a.download = `Invoice-${invoice.invoiceNumber}.html`;
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
          {/* Left Column - Payment Details */}
          <div className="space-y-6">
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
                      onClick={() => downloadInvoice(invoice)}
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
                            <option value="Urgent (1-2 weeks)">Urgent (1-2 weeks) +20%</option>
                            <option value="Normal (2-4 weeks)">Normal (2-4 weeks)</option>
                            <option value="Relaxed (4+ weeks)">Relaxed (4+ weeks) +5% discount</option>
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
                      {invoice.items.find(item => item.description.includes('Urgent Timeline Surcharge')) && (
                        <div className="flex justify-between text-yellow-400">
                          <span>Urgent Timeline Surcharge (20%):</span>
                          <span>+{formatPrice(invoice.items.find(item => item.description.includes('Urgent Timeline Surcharge'))?.amount || 0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</span>
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
                            {Boolean(invoice.items.find(item => item.description.includes('Urgent Timeline Surcharge'))) && (
                              <li>• Urgent delivery surcharge (20%): {formatPrice(invoice.items.find(item => item.description.includes('Urgent Timeline Surcharge'))?.amount || 0, invoice.currency as SupportedCurrency, 1, isExemptCountry)}</li>
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
                <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg border border-purple-500/20">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div className="space-y-3 flex-1">
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Our Support Team Is Here For You</h4>
                        <p className="text-sm text-gray-300 leading-relaxed mb-4">
                          Be patient, here's our contact information:
                        </p>
                      </div>
                      <div className="flex flex-col space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                          {['03089080171', '03098795492', '03292425950'].map((number, index) => (
                            <div 
                              key={index} 
                              className="flex items-center space-x-2 bg-black/20 px-4 py-2 rounded-lg"
                            >
                              <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-sm font-medium text-white tracking-wider whitespace-nowrap">{number}</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(number);
                                  const button = document.getElementById(`copy-btn-${index}`);
                                  if (button) {
                                    button.textContent = 'Copied!';
                                    button.classList.add('bg-green-500/20', 'text-green-400');
                                    setTimeout(() => {
                                      button.textContent = 'Copy';
                                      button.classList.remove('bg-green-500/20', 'text-green-400');
                                    }, 2000);
                                  }
                                }}
                                id={`copy-btn-${index}`}
                                className="ml-2 text-xs text-purple-400 hover:text-purple-300 px-2 py-1 bg-purple-500/10 hover:bg-purple-500/20 rounded-md transition-all duration-300"
                              >
                                Copy
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-yellow-200/80 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3">
                          <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>Please call one time after you've completed the payment to confirm your order</span>
                        </div>
                        <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3">
                          <div className="flex items-center space-x-2 text-sm text-gray-300">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Our workers are always ready to assist you 24/7</span>
                          </div>
                        </div>
                      </div>

                      <style jsx global>{`
                        @media (max-width: 768px) {
                          .flex-wrap {
                            justify-content: center;
                          }
                          
                          .flex-wrap > div {
                            width: 100%;
                            justify-content: space-between;
                          }
                        }

                        @keyframes copySuccess {
                          0% { transform: scale(1); }
                          50% { transform: scale(1.1); }
                          100% { transform: scale(1); }
                        }
                      `}</style>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-sm text-yellow-200/80">
                        Since Stripe isn't available in Pakistan, we are actively working on implementing new secure payment methods. Meanwhile, we offer several trusted local payment options for your convenience.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  {showMessage && (
                    <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-xl shadow-2xl border border-purple-500/20 max-w-md w-full mx-4"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="bg-purple-500/10 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">Payment Method Unavailable</h3>
                            <p className="text-gray-300 text-sm leading-relaxed mb-4">
                              Direct card payments are currently unavailable in Pakistan. Please use our secure local payment options listed above.
                            </p>
                            <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-3 mb-4">
                              <h4 className="text-sm font-medium text-purple-400 mb-2">Available Payment Methods:</h4>
                              <ul className="text-sm text-gray-300 space-y-1">
                                <li className="flex items-center space-x-2">
                                  <FaUniversity className="w-4 h-4 text-purple-400" />
                                  <span>Bank Transfer</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                  <FaMobileAlt className="w-4 h-4 text-purple-400" />
                                  <span>JazzCash / Easypaisa</span>
                                </li>
                              </ul>
                            </div>
                            <div className="flex justify-end space-x-3">
                              <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: 'rgb(139, 92, 246)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowMessage(false)}
                                className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Use Local Payment Methods
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  <motion.button
                    className={`w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${buttonShake ? 'animate-shake' : ''}`}
                    onClick={() => {
                      setButtonShake(true);
                      setTimeout(() => setButtonShake(false), 500);
                      setShowMessage(true);
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)'
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaLock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Pay Now</span>
                  </motion.button>

                  <p className="text-xs sm:text-sm text-gray-400 text-center mt-3 sm:mt-4">
                    Your payment is secured with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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