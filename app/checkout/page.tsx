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
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #000;
        }
        .invoice-container {
            background: linear-gradient(145deg, #000000, #1a1a1a);
            border: 1px solid #333;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            color: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #8B5CF6;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #8B5CF6;
            margin: 0;
            font-size: 28px;
        }
        .invoice-details {
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
        }
        .billing-details {
            background: rgba(139, 92, 246, 0.1);
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .section-title {
            color: #8B5CF6;
            font-size: 18px;
            margin-bottom: 15px;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background: rgba(139, 92, 246, 0.2);
            color: #8B5CF6;
            padding: 12px;
            text-align: left;
        }
        .items-table td {
            padding: 12px;
            border-bottom: 1px solid #333;
        }
        .summary {
            margin-left: auto;
            width: 300px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #333;
        }
        .total-row {
            font-size: 20px;
            font-weight: bold;
            color: #8B5CF6;
            border-top: 2px solid #8B5CF6;
            margin-top: 10px;
            padding-top: 10px;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #8B5CF6;
            color: #666;
        }
        .discount {
            color: #10B981;
        }
        .company-details {
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(139, 92, 246, 0.1);
            border-radius: 8px;
        }
        .company-details h2 {
            color: #8B5CF6;
            margin: 0 0 10px 0;
            font-size: 20px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            margin-bottom: 30px;
        }
        .contact-info {
            font-size: 14px;
            color: #fff;
            line-height: 1.6;
        }
        .contact-info strong {
            color: #8B5CF6;
            display: inline-block;
            width: 80px;
        }
        .project-details {
            background: rgba(139, 92, 246, 0.1);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .project-details h2 {
            color: #8B5CF6;
            margin: 0 0 10px 0;
            font-size: 20px;
        }
        .timeline-badge {
            display: inline-block;
            background: rgba(139, 92, 246, 0.2);
            color: #8B5CF6;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 14px;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <h1>NEX-WEBS</h1>
            <p>Professional Web Development Services</p>
        </div>

        <div class="details-grid">
            <div class="company-details">
                <h2>Our Details</h2>
                <div class="contact-info">
                    <p><strong>Name:</strong> ALI-HASNAAT</p>
                    <p><strong>Email:</strong> nexwebs.org@gmail.com</p>
                    <p><strong>Phone:</strong> 0329-2425950</p>
                </div>
            </div>

            <div class="company-details">
                <h2>Client Details</h2>
                <div class="contact-info">
                    <p><strong>Name:</strong> ${invoice.billingDetails?.name}</p>
                    <p><strong>Email:</strong> ${invoice.billingDetails?.email}</p>
                    <p><strong>Phone:</strong> ${invoice.billingDetails?.phone}</p>
                    <p><strong>Address:</strong> ${invoice.billingDetails?.address}</p>
                </div>
            </div>
        </div>

        <div class="project-details">
            <h2>Project Information</h2>
            <div class="contact-info">
                <p><strong>Package:</strong> ${invoice.package}</p>
                <p><strong>Timeline:</strong> <span class="timeline-badge">${invoice.timeline}</span></p>
            </div>
        </div>

        <div class="invoice-details">
            <div>
                <div class="section-title">Invoice Details</div>
                <p>Invoice Number: ${invoice.invoiceNumber}</p>
                <p>Date: ${invoice.date}</p>
                <p>Due Date: ${invoice.dueDate}</p>
            </div>
        </div>

        <div class="section-title">Invoice Items</div>
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
                            ${item.description}<br>
                            <small style="color: #666;">${item.details}</small>
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
                <span>Sub Total:</span>
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

        <div class="footer">
            <p><strong>Payment Terms</strong></p>
            <p>Please make the payment within 7 days of invoice date.</p>
            <p>For support, contact: nexwebs.org@gmail.com</p>
            <p style="color: #8B5CF6;">Thank you for choosing NEX-WEBS!</p>
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