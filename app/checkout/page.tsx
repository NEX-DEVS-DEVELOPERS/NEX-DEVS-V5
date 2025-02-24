'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaLock, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaUniversity, FaMobileAlt, FaDownload, FaFilePdf } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
      generateInvoice(decodeURIComponent(plan));
    }
  }, [searchParams, locationData]); // Add locationData as dependency

  useEffect(() => {
    if (invoice) {
      setEditedDetails({
        name: invoice.billingDetails?.name || '',
        email: invoice.billingDetails?.email || '',
        phone: invoice.billingDetails?.phone || '',
        address: invoice.billingDetails?.address || '',
        timeline: invoice.timeline || 'Normal (2-4 weeks)'
      });
    }
  }, [invoice]);

  const getBaseAmount = (plan: string): number => {
    const prices: { [key: string]: number } = {
      'WordPress Basic': 25000,
      'WordPress Professional': 35000,
      'WordPress Enterprise': 50000,
      'Shopify/WooCommerce': 40000,
      'Full-Stack Basic': 40000,
      'Full-Stack Professional': 60000,
      'Full-Stack Enterprise': 80000,
      'UI/UX Design': 40000,
      'Web Apps & AI Solutions': 70000,
      'SEO & Content Writing': 20000
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
      default:
        return 0;
    }
  };

  const generateInvoice = async (plan: string) => {
    const baseAmount = getBaseAmount(plan);
    
    // Get timeline from the form or use a default value
    const timelineElement = document.querySelector('select[name="timeline"]') as HTMLSelectElement;
    const timeline = timelineElement?.value || 'Normal (2-4 weeks)';
    
    // Calculate surcharge for urgent timeline
    const timelineSurcharge = getTimelineSurcharge(timeline);
    
    // Adjust price based on location if we have location data
    let adjustedBaseAmount = baseAmount;
    let currencySymbol = 'PKR';
    let exchangeRate = 1;

    try {
      const response = await fetch('/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ basePrice: baseAmount }),
      });
      
      const result = await response.json();
      if (result.success) {
        adjustedBaseAmount = result.data.amount;
        currencySymbol = result.data.currency;
        exchangeRate = result.data.exchangeRate;
      }
    } catch (error) {
      console.error('Error adjusting price for location:', error);
    }

    // Calculate surcharge amount based on adjusted base amount
    const surchargeAmount = parseFloat((adjustedBaseAmount * timelineSurcharge).toFixed(2));
    
    // Get package details
    const packageDetails = {
      'WordPress Basic': {
        details: "Professional WordPress Development with GeneratePress theme, 5 pages, and basic SEO setup",
        features: [
          "GeneratePress Theme Setup",
          "Up to 5 Pages Development",
          "Mobile-First Design",
          "2 SEO Articles",
          "5 Days Revision"
        ]
      },
      'WordPress Professional': {
        details: "Advanced WordPress Development with premium themes and comprehensive SEO optimization",
        features: [
          "Premium Theme (Foxiz/Pixwell/Phlox)",
          "Up to 10 Pages",
          "Rank Math Pro + Elementor Pro",
          "Advanced SEO Setup",
          "10 Days Revision"
        ]
      },
      'WordPress Enterprise': {
        details: "Complete WordPress solution with all premium features, hosting, and extensive optimization",
        features: [
          "All Premium Themes Access",
          "Unlimited Pages",
          "Premium Plugin Bundle",
          "6 SEO Articles + Backlinks",
          "1 Year Hosting + Domain"
        ]
      },
      'Shopify/WooCommerce': {
        details: "Complete e-commerce solution with custom design and full functionality",
        features: [
          "Custom Store Design",
          "Product Setup & Migration",
          "Payment Gateway Integration",
          "Inventory Management",
          "Analytics Integration"
        ]
      },
      'Full-Stack Basic': {
        details: "Entry-level full-stack development with essential features and modern tech stack",
        features: [
          "React/Next.js Frontend",
          "Node.js/Express Backend",
          "MongoDB Database",
          "Basic Authentication",
          "Essential API Endpoints"
        ]
      },
      'Full-Stack Professional': {
        details: "Advanced full-stack solution with robust features and scalable architecture",
        features: [
          "Next.js/TypeScript Frontend",
          "Node.js/NestJS Backend",
          "PostgreSQL with Prisma ORM",
          "OAuth & JWT Authentication",
          "Comprehensive API Suite"
        ]
      },
      'Full-Stack Enterprise': {
        details: "Enterprise-grade full-stack development with premium features and microservices architecture",
        features: [
          "Next.js 14/React Server Components",
          "Microservices Architecture",
          "Multi-Database Support",
          "Advanced Security Features",
          "CI/CD Pipeline Setup"
        ]
      },
      'UI/UX Design': {
        details: "Professional UI/UX design with modern aesthetics and user experience",
        features: [
          "Custom UI Design",
          "Interactive Prototypes",
          "Design System Creation",
          "Responsive Layouts",
          "User Flow Mapping"
        ]
      },
      'Web Apps & AI Solutions': {
        details: "Advanced web applications with AI integration and automation",
        features: [
          "AI Model Integration",
          "Custom AI Solutions",
          "Real-time Processing",
          "Data Analytics",
          "Machine Learning Pipeline"
        ]
      },
      'SEO & Content Writing': {
        details: "Comprehensive SEO optimization and content creation services",
        features: [
          "Keyword Research",
          "Content Strategy",
          "Technical SEO",
          "Content Creation",
          "Performance Tracking"
        ]
      }
    };

    const selectedPackage = packageDetails[plan as keyof typeof packageDetails];
    
    const items = [
      {
        description: plan,
        details: selectedPackage?.details || "Professional Web Development Service Package",
        features: selectedPackage?.features || [],
        quantity: 1,
        rate: baseAmount,
        amount: baseAmount
      }
    ];

    // Add surcharge as a separate item if applicable
    if (surchargeAmount > 0) {
      items.push({
        description: "Urgent Timeline Surcharge",
        details: "20% additional charge for urgent delivery (1-2 weeks)",
        features: [],
        quantity: 1,
        rate: surchargeAmount,
        amount: surchargeAmount
      });
    }

    const subTotal = baseAmount + surchargeAmount;
    const taxRate = 0;
    const taxAmount = 0;
    // Calculate discount based on package
    let discountRate = 0;
    if (plan === 'WordPress Basic') {
      discountRate = 0; // No discount
    } else if (plan === 'Full-Stack Basic') {
      discountRate = 0.10; // 10% discount
    } else {
      discountRate = 0.20; // 20% discount for other packages
    }
    const discount = parseFloat((subTotal * discountRate).toFixed(2));
    const total = parseFloat((subTotal - discount).toFixed(2));

    setInvoice({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      package: plan,
      timeline: timeline,
      amount: baseAmount,
      subTotal: subTotal,
      taxRate: taxRate,
      taxAmount: taxAmount,
      discount: discount,
      total: total,
      currency: 'PKR',
      items: items,
      billingDetails: {
        name: 'Your Name',
        email: 'your.email@example.com',
        phone: 'Your Phone',
        address: 'Your Address'
      }
    });
  };

  const downloadInvoice = (invoice: InvoiceDetails) => {
    const invoiceContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NEX-WEBS Invoice</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #fff;
            margin: 0;
            padding: 15px;
            background: linear-gradient(135deg, #000000, #1a1a1a);
            min-height: 100vh;
        }
        
        .invoice-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            background: linear-gradient(145deg, rgba(20, 20, 20, 0.95), rgba(30, 30, 30, 0.95));
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.2);
            backdrop-filter: blur(10px);
        }

        .header {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(139, 92, 246, 0.3);
        }

        .logo-section {
            text-align: center;
        }

        .logo-section h1 {
            font-size: 28px;
            background: linear-gradient(135deg, #8B5CF6, #6D28D9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 5px;
        }

        .invoice-info {
            background: rgba(139, 92, 246, 0.1);
            padding: 15px;
            border-radius: 12px;
            margin-top: 15px;
            text-align: left;
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }

        .details-section {
            background: rgba(255, 255, 255, 0.03);
            padding: 15px;
            border-radius: 12px;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }

        .details-section h2 {
            font-size: 18px;
            margin-bottom: 15px;
            color: #8B5CF6;
        }

        .contact-info p {
            font-size: 14px;
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
        }

        .contact-info strong {
            min-width: 80px;
            display: inline-block;
            color: rgba(139, 92, 246, 0.9);
        }

        .items-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 20px 0;
            font-size: 14px;
        }

        .items-table th {
            background: rgba(139, 92, 246, 0.1);
            color: #8B5CF6;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }

        .items-table td {
            background: rgba(255, 255, 255, 0.02);
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .items-table tr:last-child td {
            border-bottom: none;
        }

        .summary {
            background: rgba(139, 92, 246, 0.05);
            padding: 15px;
            border-radius: 12px;
            margin-top: 20px;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }

        .total-row {
            font-size: 20px;
            font-weight: 700;
            color: #8B5CF6;
            border-top: 2px solid rgba(139, 92, 246, 0.3);
            margin-top: 10px;
            padding-top: 10px;
        }

        .terms-section {
            background: rgba(255, 255, 255, 0.02);
            padding: 15px;
            border-radius: 12px;
            margin-top: 25px;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }

        .terms-section h3 {
            color: #8B5CF6;
            font-size: 16px;
            margin-bottom: 15px;
        }

        .terms-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .terms-category {
            background: rgba(139, 92, 246, 0.05);
            padding: 12px;
            border-radius: 8px;
        }

        .terms-category h4 {
            color: #8B5CF6;
            font-size: 15px;
            margin-bottom: 8px;
        }

        .terms-category ul {
            list-style-position: inside;
            margin: 0;
            padding: 0;
        }

        .terms-category li {
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
            margin-bottom: 6px;
            line-height: 1.4;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid rgba(139, 92, 246, 0.3);
        }

        .payment-methods {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 15px 0;
        }

        .payment-method {
            background: rgba(255, 255, 255, 0.05);
            padding: 8px 15px;
            border-radius: 8px;
            font-size: 13px;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }

        .timeline-badge {
            display: inline-block;
            background: rgba(139, 92, 246, 0.1);
            color: #8B5CF6;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            margin-top: 8px;
        }

        .status-badge {
            display: inline-block;
            background: rgba(139, 92, 246, 0.1);
            color: #8B5CF6;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 14px;
            margin: 10px 0;
        }

        .contact-support {
            margin-top: 25px;
            font-size: 13px;
        }

        .contact-support a {
            color: #8B5CF6;
            text-decoration: none;
        }

        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.1;
            font-size: 60px;
            font-weight: 800;
            color: #8B5CF6;
            transform: rotate(-45deg);
            pointer-events: none;
        }

        .discount-text {
            color: #10B981;
            font-weight: 500;
        }

        @media (min-width: 768px) {
            body {
                padding: 40px;
            }

            .invoice-container {
                padding: 40px;
            }

            .header {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
            }

            .logo-section {
                text-align: left;
            }

            .logo-section h1 {
                font-size: 36px;
            }

            .details-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
            }

            .terms-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }

            .items-table th,
            .items-table td {
                padding: 15px;
            }

            .watermark {
                font-size: 100px;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="watermark">NEX-WEBS</div>
        
        <div class="header">
            <div class="logo-section">
                <h1>NEX-WEBS</h1>
                <p>Professional Web Development Services</p>
                <div class="status-badge">INVOICE</div>
            </div>
            
            <div class="invoice-info">
                <h2>Invoice Details</h2>
                <p><strong>Invoice No:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${invoice.date}</p>
                <p><strong>Due Date:</strong> ${invoice.dueDate}</p>
            </div>
        </div>

        <div class="details-grid">
            <div class="details-section">
                <h2>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    Our Details
                </h2>
                <div class="contact-info">
                    <p><strong>Name:</strong> ALI-HASNAAT</p>
                    <p><strong>Email:</strong> nexwebs.org@gmail.com</p>
                    <p><strong>Phone:</strong> 0329-2425950</p>
                </div>
            </div>

            <div class="details-section">
                <h2>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Client Details
                </h2>
                <div class="contact-info">
                    <p><strong>Name:</strong> ${invoice.billingDetails?.name}</p>
                    <p><strong>Email:</strong> ${invoice.billingDetails?.email}</p>
                    <p><strong>Phone:</strong> ${invoice.billingDetails?.phone}</p>
                    <p><strong>Address:</strong> ${invoice.billingDetails?.address}</p>
                </div>
            </div>
        </div>

        <div class="project-details">
            <h2>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                </svg>
                Project Information
            </h2>
            <div class="contact-info">
                <p><strong>Package:</strong> ${invoice.package}</p>
                <p><strong>Timeline:</strong> <span class="timeline-badge">${invoice.timeline}</span></p>
            </div>
        </div>

        <table class="items-table">
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
                            <strong>${item.description}</strong><br>
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.9em;">${item.details}</span>
                        </td>
                        <td>${item.quantity}</td>
                        <td>PKR ${item.rate.toLocaleString()}</td>
                        <td>PKR ${item.amount.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="summary">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>PKR ${invoice.subTotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Tax (0%):</span>
                <span>PKR 0.00</span>
            </div>
            <div class="summary-row discount-text">
                <span>Discount (${selectedPlan === 'Full-Stack Basic' ? '10%' : '20%'}):</span>
                <span>-PKR ${invoice.discount.toLocaleString()}</span>
            </div>
            <div class="summary-row total-row">
                <span>Total:</span>
                <span>PKR ${invoice.total.toLocaleString()}</span>
            </div>
        </div>

        <div class="terms-section">
            <h3>Terms & Conditions</h3>
            <div class="terms-grid">
                <div class="terms-category">
                    <h4>Payment Terms</h4>
                    <ul>
                        <li>Payment is due within 7 days of invoice date</li>
                        <li>50% advance payment required to start the project</li>
                        <li>Remaining 50% payment before project delivery</li>
                        <li>All prices are in Pakistani Rupees (PKR)</li>
                        <li>Late payments will incur a 5% monthly charge</li>
                    </ul>
                </div>

                <div class="terms-category">
                    <h4>Project Terms</h4>
                    <ul>
                        <li>Timeline starts after receiving advance payment</li>
                        <li>Project scope as defined in the package details</li>
                        <li>Two rounds of revisions included</li>
                        <li>Additional revisions charged separately</li>
                        <li>Source code handover upon full payment</li>
                    </ul>
                </div>

                <div class="terms-category">
                    <h4>Delivery & Support</h4>
                    <ul>
                        <li>Delivery timeline as specified in project details</li>
                        <li>30 days of free support after project completion</li>
                        <li>Bug fixes covered under warranty period</li>
                        <li>Training session included for website management</li>
                        <li>24/7 emergency support available</li>
                    </ul>
                </div>

                <div class="terms-category">
                    <h4>Cancellation & Refund</h4>
                    <ul>
                        <li>Cancellation fee of 30% if project cancelled after start</li>
                        <li>No refund on custom development work completed</li>
                        <li>Refund processing time: 7-14 business days</li>
                        <li>Project can be put on hold for up to 30 days</li>
                        <li>Unused hours/services non-refundable</li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="footer">
            <h3>Payment Methods</h3>
            <div class="payment-methods">
                <div class="payment-method">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="payment-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Bank Transfer
                </div>
                <div class="payment-method">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="payment-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    JazzCash
                </div>
                <div class="payment-method">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="payment-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Easypaisa
                </div>
            </div>
            
            <div class="qr-section">
                <div class="qr-code">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                        <!-- Placeholder for QR code -->
                        <rect width="100" height="100" fill="#000"/>
                    </svg>
                </div>
                <p>Scan to view digital copy</p>
            </div>
            
            <div class="contact-support">
                <p style="color: #8B5CF6; margin-top: 30px; font-weight: 600;">Thank you for choosing NEX-WEBS!</p>
                <p style="color: rgba(255,255,255,0.6);">
                    For support: <a href="mailto:nexwebs.org@gmail.com" style="color: #8B5CF6; text-decoration: none;">nexwebs.org@gmail.com</a>
                </p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 20px;">
                    This is a computer-generated invoice. No signature required.
                </p>
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
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <span>← Back</span>
          </button>
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
                      <li className="pl-2">Enter amount: PKR {invoice?.total.toLocaleString()}</li>
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

            <div>
              <label className="block text-sm font-medium mb-2">Project Timeline</label>
              <select
                name="timeline"
                className="w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500 text-sm"
                onChange={(e) => {
                  if (invoice) {
                    generateInvoice(invoice.package);
                  }
                }}
              >
                <option value="Urgent (1-2 weeks)">Urgent (1-2 weeks) (+20% charge)</option>
                <option value="Normal (2-4 weeks)" selected>Normal (2-4 weeks)</option>
                <option value="Relaxed (4+ weeks)">Relaxed (4+ weeks)</option>
              </select>
            </div>
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
                        <div>
                          <label className="block text-sm font-medium mb-2">Project Timeline</label>
                          <select
                            value={editedDetails.timeline}
                            onChange={(e) => {
                              setEditedDetails({...editedDetails, timeline: e.target.value});
                              if (invoice) {
                                generateInvoice(invoice.package);
                              }
                            }}
                            className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                          >
                            <option value="Urgent (1-2 weeks)">Urgent (1-2 weeks) (+20% charge)</option>
                            <option value="Normal (2-4 weeks)">Normal (2-4 weeks)</option>
                            <option value="Relaxed (4+ weeks)">Relaxed (4+ weeks)</option>
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
                        <div className="sm:col-span-2">
                          <p><span className="text-gray-400">Timeline:</span> <span className="text-purple-400">{invoice?.timeline}</span></p>
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
                                <p className="font-medium">PKR {item.rate.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-400 text-sm">Amount</span>
                                <p className="font-medium">PKR {item.amount.toLocaleString()}</p>
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
                        <span>PKR {invoice.subTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Tax (0%):</span>
                        <span>PKR 0.00</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-medium">
                        <span>Discount ({selectedPlan === 'Full-Stack Basic' ? '10%' : '20%'}):</span>
                        <span>-PKR {invoice.discount.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span>PKR {invoice.total.toFixed(2)}</span>
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

                <div className="p-5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <div className="space-y-4 flex-1">
                      <div>
                        <h4 className="text-sm font-semibold text-purple-400 mb-2">Payment Instructions</h4>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          Please follow these steps to complete your payment:
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-black/20 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-purple-400 mb-2">Step 1: Choose Payment Method</h5>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></span>
                              <span><span className="text-purple-400 font-medium">Bank Transfer:</span> Use any of our bank accounts (HBL, Meezan Bank, or UBL)</span>
                            </li>
                            <li className="flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></span>
                              <span><span className="text-purple-400 font-medium">Mobile Wallets:</span> JazzCash (0300-1234567) or Easypaisa (0333-7654321)</span>
                            </li>
                          </ul>
                        </div>

                        <div className="bg-black/20 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-purple-400 mb-2">Step 2: Send Confirmation</h5>
                          <p className="text-sm text-gray-300 mb-2">
                            After payment, please send the following to{' '}
                            <span className="text-purple-400 font-medium">support.nexweb@gmail.com</span>:
                          </p>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                              <span>Payment screenshot/confirmation</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                              <span>Copy of your invoice</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                              <span>Your invoice number: {invoice?.invoiceNumber}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 bg-white/5 p-3 rounded-lg">
                        <strong className="text-purple-400">Note:</strong> Your project development will begin immediately after payment confirmation. We'll send you a confirmation email with next steps within 24 hours.
                      </div>
                    </div>
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

                <style jsx global>{`
                  @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-3px); }
                    50% { transform: translateX(3px); }
                    75% { transform: translateX(-3px); }
                  }
                  .animate-shake {
                    animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                  }
                `}</style>

                <p className="text-xs sm:text-sm text-gray-400 text-center mt-3 sm:mt-4">
                  Your payment is secured with SSL encryption
                </p>
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