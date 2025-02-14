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

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan) {
      setSelectedPlan(decodeURIComponent(plan));
      // Generate invoice details
      generateInvoice(decodeURIComponent(plan));
    }
  }, [searchParams]);

  const getBaseAmount = (plan: string): number => {
    const prices: { [key: string]: number } = {
      'WordPress Development': 999,
      'Shopify/WooCommerce': 1499,
      'FULLSTACK WEBSITE': 2499,
      'UI/UX Design': 799,
      'Web Apps & AI Solutions': 3999,
      'SEO & Content Writing': 599,
      'Full-Stack Website': 2499,
      'Figma/Framer': 799,
      'AI Agents/WebApps': 3999,
      'SEO/Content Writing': 599
    };
    
    const matchingKey = Object.keys(prices).find(
      key => key.toLowerCase() === plan.toLowerCase()
    );
    
    return matchingKey ? prices[matchingKey] : 0;
  };

  const generateInvoice = (plan: string) => {
    const baseAmount = getBaseAmount(plan);
    const items = [
      {
        description: plan,
        details: "Professional Web Development Service Package",
        quantity: 1,
        rate: baseAmount,
        amount: baseAmount
      }
    ];

    const subTotal = baseAmount;
    const taxRate = 0.16; // 16% tax rate for Pakistan
    const taxAmount = parseFloat((subTotal * taxRate).toFixed(2));
    const discount = parseFloat((subTotal * 0.2).toFixed(2)); // 20% discount
    const total = parseFloat((subTotal + taxAmount - discount).toFixed(2));

    setInvoice({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      package: plan,
      amount: baseAmount,
      subTotal: subTotal,
      taxRate: taxRate,
      taxAmount: taxAmount,
      discount: discount,
      total: total,
      currency: 'USD',
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
NEX-WEBS INVOICE
===============================

Invoice Number: ${invoice.invoiceNumber}
Date: ${invoice.date}
Due Date: ${invoice.dueDate}

BILLING DETAILS
--------------
Name: ${invoice.billingDetails?.name}
Email: ${invoice.billingDetails?.email}
Phone: ${invoice.billingDetails?.phone}
Address: ${invoice.billingDetails?.address}

INVOICE ITEMS
------------
${invoice.items.map(item => `
Description: ${item.description}
Quantity: ${item.quantity}
Rate: $${item.rate}
Amount: $${item.amount}
`).join('\n')}

SUMMARY
-------
Sub Total: $${invoice.subTotal}
Tax (${(invoice.taxRate * 100).toFixed(0)}%): $${invoice.taxAmount}
Discount (20%): $${invoice.discount}
Total Amount: $${invoice.total}

Payment Terms
------------
Please make the payment within 7 days of invoice date.
For support, contact: support@nexwebs.com

Thank you for choosing NEX-WEBS!
`;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${invoice.invoiceNumber}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
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
                      <li>Enter amount: ${invoice?.total}</li>
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
                    <h3 className="font-semibold mb-3">Billing Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><span className="text-gray-400">Name:</span> {invoice.billingDetails?.name}</p>
                        <p><span className="text-gray-400">Email:</span> {invoice.billingDetails?.email}</p>
                      </div>
                      <div>
                        <p><span className="text-gray-400">Phone:</span> {invoice.billingDetails?.phone}</p>
                        <p><span className="text-gray-400">Address:</span> {invoice.billingDetails?.address}</p>
                      </div>
                    </div>
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
                              <p className="font-medium">${item.rate.toFixed(2)}</p>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Amount</span>
                              <p className="font-medium">${item.amount.toFixed(2)}</p>
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
                        <span>${invoice.subTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tax ({(invoice.taxRate * 100).toFixed(0)}%):</span>
                        <span>${invoice.taxAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-400">
                        <span>Discount (20%):</span>
                        <span>-${invoice.discount.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex justify-between text-xl font-bold">
                          <span>Total:</span>
                          <span>${invoice.total.toFixed(2)}</span>
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