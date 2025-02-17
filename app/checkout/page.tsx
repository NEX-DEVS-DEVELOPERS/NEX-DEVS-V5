'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaLock, FaCreditCard, FaPaypal, FaApplePay, FaGooglePay, FaBitcoin, FaUniversity, FaMobileAlt, FaDownload, FaFilePdf } from 'react-icons/fa';
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
  { id: 'credit-card', icon: FaCreditCard, label: 'Credit Card' },
  { id: 'bank-transfer', icon: FaUniversity, label: 'Bank Transfer' },
  { id: 'jazzcash', icon: FaMobileAlt, label: 'JazzCash' },
  { id: 'easypaisa', icon: FaMobileAlt, label: 'Easypaisa' },
  { id: 'paypal', icon: FaPaypal, label: 'PayPal' },
  { id: 'crypto', icon: FaBitcoin, label: 'Cryptocurrency' },
];

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('credit-card');
  const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    timeline: 'Normal (2-4 weeks)'
  });

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setSelectedPlan(decodeURIComponent(plan));
      // Generate invoice details
      generateInvoice(decodeURIComponent(plan));
    }
  }, [searchParams]);

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
      'WordPress Development': 30000,
      'Shopify/WooCommerce': 40000,
      'FULLSTACK WEBSITE': 60000,
      'UI/UX Design': 40000,
      'Web Apps & AI Solutions': 70000,
      'SEO & Content Writing': 20000,
      'Full-Stack Website': 60000,
      'Figma/Framer': 40000,
      'AI Agents/WebApps': 70000,
      'SEO/Content Writing': 20000
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

  const generateInvoice = (plan: string) => {
    const baseAmount = getBaseAmount(plan);
    
    // Get timeline from the form or use a default value
    const timelineElement = document.querySelector('select[name="timeline"]') as HTMLSelectElement;
    const timeline = timelineElement?.value || 'Normal (2-4 weeks)';
    
    // Calculate surcharge for urgent timeline
    const timelineSurcharge = getTimelineSurcharge(timeline);
    const surchargeAmount = parseFloat((baseAmount * timelineSurcharge).toFixed(2));
    
    const items = [
      {
        description: plan,
        details: "Professional Web Development Service Package",
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
        quantity: 1,
        rate: surchargeAmount,
        amount: surchargeAmount
      });
    }

    const subTotal = baseAmount + surchargeAmount;
    const taxRate = 0;
    const taxAmount = 0;
    const discount = parseFloat((subTotal * 0.2).toFixed(2));
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
    <title>NEX-WEBS Invoice</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #fff;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #000000, #1a1a1a);
            min-height: 100vh;
        }

        @media (min-width: 768px) {
            body {
                padding: 40px;
            }
        }
        
        .invoice-container {
            max-width: 1000px;
            margin: 0 auto;
            background: linear-gradient(145deg, rgba(20, 20, 20, 0.95), rgba(30, 30, 30, 0.95));
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
            border: 1px solid rgba(139, 92, 246, 0.2);
            backdrop-filter: blur(10px);
        }

        @media (min-width: 768px) {
            .invoice-container {
                padding: 40px;
            }
        }

        .header {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(139, 92, 246, 0.3);
        }

        @media (min-width: 768px) {
            .header {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 40px;
                padding-bottom: 30px;
            }
        }

        .details-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        @media (min-width: 768px) {
            .details-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 40px;
                margin-bottom: 40px;
            }
        }

        .items-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
            margin: 30px 0;
            display: block;
            overflow-x: auto;
        }

        @media (min-width: 768px) {
            .items-table {
                display: table;
            }
        }

        .items-table th,
        .items-table td {
            white-space: nowrap;
            padding: 12px;
        }

        @media (min-width: 768px) {
            .items-table th,
            .items-table td {
                padding: 15px;
            }
        }

        .summary {
            margin-left: auto;
            width: 100%;
            background: rgba(139, 92, 246, 0.05);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }

        @media (min-width: 768px) {
            .summary {
                width: 350px;
                padding: 25px;
            }
        }

        .payment-methods {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }

        @media (min-width: 768px) {
            .payment-methods {
                gap: 20px;
            }
        }

        .terms-section {
            background: rgba(255, 255, 255, 0.02);
            padding: 20px;
            border-radius: 12px;
            margin-top: 30px;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }

        .terms-section h3 {
            color: #8B5CF6;
            margin: 0 0 15px 0;
        }

        .terms-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
        }

        @media (min-width: 768px) {
            .terms-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
            }
        }

        .terms-category {
            background: rgba(139, 92, 246, 0.05);
            padding: 15px;
            border-radius: 8px;
        }

        .terms-category h4 {
            color: #8B5CF6;
            margin: 0 0 10px 0;
            font-size: 16px;
        }

        .terms-category ul {
            margin: 0;
            padding-left: 20px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
        }

        .terms-category li {
            margin-bottom: 8px;
        }

        .terms-category li:last-child {
            margin-bottom: 0;
        }
        
        .logo-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
        }
        
        .logo-section h1 {
            color: #8B5CF6;
            margin: 0;
            font-size: 36px;
            font-weight: 800;
            letter-spacing: -1px;
            background: linear-gradient(135deg, #8B5CF6, #6D28D9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .invoice-info {
            text-align: right;
            background: rgba(139, 92, 246, 0.1);
            padding: 20px;
            border-radius: 12px;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .invoice-info h2 {
            color: #8B5CF6;
            margin: 0 0 10px 0;
            font-size: 24px;
        }
        
        .details-section {
            background: rgba(255, 255, 255, 0.03);
            padding: 25px;
            border-radius: 12px;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }
        
        .details-section h2 {
            color: #8B5CF6;
            margin: 0 0 20px 0;
            font-size: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .details-section h2 svg {
            width: 20px;
            height: 20px;
        }
        
        .contact-info {
            display: grid;
            gap: 12px;
        }
        
        .contact-info p {
            margin: 0;
            display: flex;
            align-items: center;
            gap: 10px;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .contact-info strong {
            color: rgba(139, 92, 246, 0.9);
            font-weight: 500;
            min-width: 100px;
        }
        
        .project-details {
            background: rgba(139, 92, 246, 0.05);
            padding: 25px;
            border-radius: 12px;
            margin: 30px 0;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }
        
        .items-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
            margin: 30px 0;
        }
        
        .items-table th {
            background: rgba(139, 92, 246, 0.1);
            color: #8B5CF6;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            border-radius: 8px;
        }
        
        .items-table td {
            background: rgba(255, 255, 255, 0.02);
            padding: 15px;
        }
        
        .items-table tr td:first-child {
            border-radius: 8px 0 0 8px;
        }
        
        .items-table tr td:last-child {
            border-radius: 0 8px 8px 0;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .total-row {
            font-size: 24px;
            font-weight: 700;
            color: #8B5CF6;
            border-top: 2px solid rgba(139, 92, 246, 0.3);
            margin-top: 15px;
            padding-top: 15px;
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid rgba(139, 92, 246, 0.3);
        }
        
        .footer h3 {
            color: #8B5CF6;
            margin-bottom: 15px;
        }
        
        .payment-methods {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 20px 0;
        }
        
        .payment-method {
            background: rgba(255, 255, 255, 0.05);
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .timeline-badge {
            display: inline-block;
            background: rgba(139, 92, 246, 0.1);
            color: #8B5CF6;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            margin-top: 10px;
            border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .discount {
            color: #10B981;
            font-weight: 500;
        }
        
        .qr-section {
            text-align: center;
            margin-top: 30px;
        }
        
        .qr-code {
            background: white;
            padding: 15px;
            border-radius: 12px;
            display: inline-block;
            margin-bottom: 10px;
        }
        
        .status-badge {
            display: inline-block;
            background: rgba(139, 92, 246, 0.1);
            color: #8B5CF6;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 500;
            margin-bottom: 20px;
        }
        
        .terms-section {
            background: rgba(255, 255, 255, 0.02);
            padding: 20px;
            border-radius: 12px;
            margin-top: 30px;
            border: 1px solid rgba(139, 92, 246, 0.15);
        }
        
        .terms-section h3 {
            color: #8B5CF6;
            margin: 0 0 15px 0;
        }
        
        .terms-section ul {
            margin: 0;
            padding-left: 20px;
            color: rgba(255, 255, 255, 0.8);
        }
        
        .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.1;
            font-size: 100px;
            font-weight: 800;
            color: #8B5CF6;
            transform: rotate(-45deg);
            pointer-events: none;
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
            <div class="summary-row discount">
                <span>Discount (20%):</span>
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
    <main className="min-h-screen bg-black text-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <span>← Back</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Payment Details */}
          <div className="space-y-8">
            <div className="bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border border-white/5">
              <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {paymentMethods.map(({ id, icon: Icon, label }) => (
                  <div
                    key={id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      paymentMethod === id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setPaymentMethod(id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-6 h-6" />
                      <span>{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank-transfer' && (
              <div className="bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border border-white/5">
                <h3 className="text-xl font-bold mb-4">Bank Account Details</h3>
                <div className="space-y-6">
                  {pakistaniBanks.map((bank, index) => (
                    <div key={index} className="p-4 rounded-lg border border-white/10 space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-lg">{bank.bank}</h4>
                        <button 
                          onClick={() => navigator.clipboard.writeText(bank.accountNumber)}
                          className="text-sm text-purple-400 hover:text-purple-300"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-400">Account Title:</span> {bank.accountTitle}</p>
                        <p><span className="text-gray-400">Account Number:</span> {bank.accountNumber}</p>
                        <p><span className="text-gray-400">IBAN:</span> {bank.iban}</p>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-yellow-400 mt-4">
                    Please send your payment proof to support@nexwebs.com after making the transfer
                  </p>
                </div>
              </div>
            )}

            {/* Mobile Wallet Details */}
            {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
              <div className="bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border border-white/5">
                <h3 className="text-xl font-bold mb-4">
                  {paymentMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Details
                </h3>
                <div className="space-y-6">
                  {mobileWallets
                    .filter(wallet => wallet.name.toLowerCase() === paymentMethod)
                    .map((wallet, index) => (
                      <div key={index} className="p-4 rounded-lg border border-white/10 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-lg">{wallet.name}</h4>
                          <button 
                            onClick={() => navigator.clipboard.writeText(wallet.number)}
                            className="text-sm text-purple-400 hover:text-purple-300"
                          >
                            Copy Number
                          </button>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="text-gray-400">Account Title:</span> {wallet.accountTitle}</p>
                          <p><span className="text-gray-400">Number:</span> {wallet.number}</p>
                        </div>
                      </div>
                    ))}
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-yellow-400">
                      Please follow these steps:
                    </p>
                    <ol className="text-sm text-gray-300 list-decimal list-inside space-y-1">
                      <li>Open your {paymentMethod === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} app</li>
                      <li>Select "Send Money"</li>
                      <li>Enter the number shown above</li>
                      <li>Enter amount: PKR ${invoice?.total}</li>
                      <li>Complete the transaction</li>
                      <li>Send the transaction ID to support@nexwebs.com</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Existing Credit Card Form */}
            {paymentMethod === 'credit-card' && (
              <div className="bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border border-white/5">
                <h3 className="text-xl font-bold mb-4">Card Details</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name on Card</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
                      placeholder="John Doe"
                    />
                  </div>
                </form>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Project Timeline</label>
              <select
                name="timeline"
                className="w-full px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-purple-500"
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
          <div className="space-y-8">
            {invoice && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border border-white/5"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Invoice Details</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadInvoice(invoice)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaDownload className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors"
                    >
                      <FaFilePdf className="w-4 h-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Company and Invoice Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2">NEX-WEBS</h3>
                      <p className="text-sm text-gray-400">Professional Web Development Services</p>
                      <p className="text-sm text-gray-400">support@nexwebs.com</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Invoice Number:</span>
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span>{invoice.date}</span>
                      </div>
                      <div className="flex justify-between">
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
                        <div className="grid md:grid-cols-2 gap-4">
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
                        <div className="grid md:grid-cols-2 gap-4">
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
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><span className="text-gray-400">Name:</span> {invoice?.billingDetails?.name}</p>
                          <p><span className="text-gray-400">Email:</span> {invoice?.billingDetails?.email}</p>
                      </div>
                      <div>
                          <p><span className="text-gray-400">Phone:</span> {invoice?.billingDetails?.phone}</p>
                          <p><span className="text-gray-400">Address:</span> {invoice?.billingDetails?.address}</p>
                        </div>
                        <div className="md:col-span-2">
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
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                              <span className="text-gray-400 text-sm">Description</span>
                              <p className="font-medium">{item.description}</p>
                              {item.details && (
                                <p className="text-sm text-gray-400">{item.details}</p>
                              )}
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Rate</span>
                              <p className="font-medium">PKR {item.rate.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Amount</span>
                              <p className="font-medium">PKR {item.amount.toFixed(2)}</p>
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
                      <div className="flex justify-between text-green-400">
                        <span>Discount (20%):</span>
                        <span>-PKR {invoice.discount.toFixed(2)}</span>
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
                  <div className="border-t border-white/10 pt-4 text-sm text-gray-400">
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

            <div className="bg-zinc-900/50 p-6 rounded-xl backdrop-blur-sm border border-white/5">
              <button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                onClick={() => {/* Handle payment */}}
              >
                <FaLock className="w-4 h-4" />
                <span>Pay Now</span>
              </button>
              <p className="text-sm text-gray-400 text-center mt-4">
                Your payment is secured with SSL encryption
              </p>
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