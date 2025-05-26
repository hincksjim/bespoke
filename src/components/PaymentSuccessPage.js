import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, ArrowLeft, Copy, Check, AlertTriangle } from 'lucide-react';
import './payment.css';

export default function PaymentSuccessPage() {
  const [copied, setCopied] = useState(false);
  const [animate, setAnimate] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const paymentData = location.state?.paymentData;
  
  useEffect(() => {
    if (!paymentData) {
      navigate('/payment', { replace: true });
      return;
    }
    // Debug logging
    console.log("Payment Data received:", paymentData);
    console.log("Payment Method details:", paymentData.paymentMethod);
    setAnimate(true);
  }, [paymentData, navigate]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(paymentData.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    const receiptData = `
===========================================
           BESPOKE JEWELLERY CO.
        Custom Design & Fabrication
===========================================

PAYMENT RECEIPT
Order ID: ${paymentData.orderId}
Product: ${paymentData.product}
Amount: £${paymentData.amount.toFixed(2)}
Date: ${new Date(paymentData.date).toLocaleDateString('en-GB', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
Card: ${paymentData.paymentMethod.brand.toUpperCase()} **** ${paymentData.paymentMethod.last4}
Email: ${paymentData.email}
${paymentData.creditsUpdateFailed 
  ? `Credits Status: Failed to add ${paymentData.plannedCredits} credits - Please contact support
Current Credits: ${paymentData.newCreditsTotal}` 
  : `Credits Added: ${paymentData.creditsAdded}
New Total Credits: ${paymentData.newCreditsTotal}`}

===========================================
Terms & Conditions: https://bespoke.co.uk/terms
Support: support@bespoke.co.uk | +44 (0)20 1234 5678

Thank you for choosing Bespoke Jewellery Co.
Your trusted partner in custom jewellery design.
===========================================`;

    // Create blob and download
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Return empty div if no payment data to prevent errors
  if (!paymentData) {
    return <div></div>;
  }

  return (    <div className="design-tool payment-success-page text-center max-w-2xl mx-auto p-6">      
      <div className="logo-container mb-8">
        <h2 className="text-2xl font-bold text-amber-600">Ellegance Jewellry</h2>
      </div>
      
      <div className={`success-card bg-white p-8 rounded-lg shadow-lg ${animate ? 'animate-fade-in' : ''}`}>
        {paymentData.creditsUpdateFailed ? (
          <AlertTriangle className="mx-auto mb-4 text-amber-500" size={48} />
        ) : (
          <CheckCircle className="mx-auto mb-4 text-amber-500" size={48} />
        )}
        
        <h1 className="text-2xl font-bold mb-4">
          {paymentData.creditsUpdateFailed 
            ? 'Payment Processed - Action Required' 
            : 'Payment Successful!'}
        </h1>

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
            <span className="font-medium">Amount:</span>
            <span>£{paymentData.amount.toFixed(2)}</span>
          </div>          <div className="detail-row">
            <span className="font-medium">Card:</span>
            <span>
              {paymentData.paymentMethod.brand.charAt(0).toUpperCase() + 
               paymentData.paymentMethod.brand.slice(1)} •••• {paymentData.paymentMethod.last4}
            </span>
          </div>
          <div className="detail-row">
            <span className="font-medium">Email:</span>
            <span>{paymentData.email}</span>
          </div>

          <div className="detail-row">
            <span className="font-medium">Date:</span>
            <span>
              {new Date(paymentData.date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="credits-info bg-amber-50 p-4 rounded-md my-4">
            {paymentData.creditsUpdateFailed ? (
              <div className="text-amber-700">
                <p className="font-bold mb-2">Credits Update Failed</p>
                <p>We were unable to add {paymentData.plannedCredits} credits to your account.</p>
                <p>Current credits: {paymentData.newCreditsTotal}</p>
                <p className="text-sm mt-2">Please contact support with your order ID for assistance.</p>
              </div>
            ) : (
              <div className="text-amber-700">
                <p className="font-bold mb-2">Credits Updated</p>
                <p>Credits added: {paymentData.creditsAdded}</p>
                <p>New total: {paymentData.newCreditsTotal}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            onClick={() => navigate('/portal/design-tool')}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-white border-2 border-amber-500 text-amber-500 rounded hover:bg-amber-50"
          >
            <ArrowLeft size={20} />
            Back to Design Tool
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