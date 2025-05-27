import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, ArrowLeft, Copy, Check } from 'lucide-react';
import './payment.css';

// This file defines the ArtisanPaymentSuccessPage component, which displays the payment success page for artisans.
// It shows payment details, allows users to copy the order ID, and provides an option to download a receipt.

// This component displays the payment success page for artisans.
// It shows the payment details, allows users to copy the order ID, and download a receipt.

export default function ArtisanPaymentSuccessPage() {
  const [copied, setCopied] = useState(false);
  const [animate, setAnimate] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const paymentData = location.state?.paymentData;
  
  // useEffect Hook
  // This hook checks if payment data is available in the location state. If not, it redirects the user to the artisan console.
  // It also triggers an animation effect for the success card.
  useEffect(() => {
    if (!paymentData) {
      navigate('/artisan-console', { replace: true });
      return;
    }
    setAnimate(true);
  }, [paymentData, navigate]);

  // copyOrderId Function
  // This function copies the order ID to the clipboard and shows a temporary confirmation icon.
  const copyOrderId = () => {
    navigator.clipboard.writeText(paymentData.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // downloadReceipt Function
  // This function generates a text-based receipt for the subscription and triggers a download in the browser.
  const downloadReceipt = () => {
    const receiptData = `
===========================================
           BESPOKE JEWELLERY CO.
        Artisan Subscription Receipt
===========================================

SUBSCRIPTION RECEIPT
Order ID: ${paymentData.orderId}
Product: ${paymentData.product}
Amount: £${paymentData.amount.toFixed(2)}/month
Date: ${new Date(paymentData.date).toLocaleDateString('en-GB', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
Email: ${paymentData.email}

Subscription Type: ${paymentData.subscriptionType}
Next Billing Date: ${new Date(new Date().setMonth(new Date().getMonth() + 1))
  .toLocaleDateString('en-GB', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })}

===========================================
Terms & Conditions: https://bespoke.co.uk/terms
Support: support@bespoke.co.uk | +44 (0)20 1234 5678

Thank you for subscribing to our Artisan Platform.
===========================================`;

    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscription-receipt-${paymentData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!paymentData) {
    return <div></div>;
  }

  // Rendered Output
  // The component renders the subscription details, including the order ID, product name, amount, and email.
  // It also provides buttons to navigate back to the console and download the receipt.
  return (
    <div className="design-tool payment-success-page text-center max-w-2xl mx-auto p-6">
      <div className="logo-container mb-8">
        <h2 className="text-2xl font-bold text-amber-600">Ellegance Jewellry</h2>
      </div>
      
      <div className={`success-card bg-white p-8 rounded-lg shadow-lg ${animate ? 'animate-fade-in' : ''}`}>
        <CheckCircle className="mx-auto mb-4 text-amber-500" size={48} />
        <h1 className="text-2xl font-bold mb-4">Subscription Activated!</h1>

        <div className="order-details text-left space-y-3 mb-6">
          <div className="detail-row">
            <span className="font-medium">Order ID:</span>
            <div className="flex items-center">
              <span className="mr-2">{paymentData.orderId}</span>
              <button 
                onClick={copyOrderId}
                className="text-amber-600 hover:text-amber-700"
                title="Copy Order ID"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="detail-row">
            <span className="font-medium">Subscription:</span>
            <span>{paymentData.product}</span>
          </div>

          <div className="detail-row">
            <span className="font-medium">Amount:</span>
            <span>£{paymentData.amount.toFixed(2)}/month</span>
          </div>

          <div className="detail-row">
            <span className="font-medium">Email:</span>
            <span>{paymentData.email}</span>
          </div>

          <div className="detail-row">
            <span className="font-medium">Start Date:</span>
            <span>
              {new Date(paymentData.date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="subscription-info bg-amber-50 p-4 rounded-md my-4">
            <div className="text-amber-700">
              <p className="font-bold mb-2">Subscription Active</p>
              <p>Your artisan account has been activated.</p>
              <p>Next billing date: {new Date(new Date().setMonth(new Date().getMonth() + 1))
                .toLocaleDateString('en-GB', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/artisan-console')}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-white border-2 border-amber-500 text-amber-500 rounded hover:bg-amber-50"
          >
            <ArrowLeft size={20} />
            Back to Console
          </button>
          
          <button
            onClick={downloadReceipt}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            <Download size={20} />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
