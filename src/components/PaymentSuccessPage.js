import { useState, useEffect } from 'react';
import { CheckCircle, Download, Mail, ArrowLeft, Copy, Check } from 'lucide-react';

export default function PaymentSuccessPage() {
  const [copied, setCopied] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Mock payment data - in real app, this would come from URL params or API
  const paymentData = {
    orderId: 'ORD-2024-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    amount: 49.99,
    currency: 'USD',
    product: 'Premium Subscription',
    email: 'customer@example.com',
    paymentMethod: '•••• 4242',
    date: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  useEffect(() => {
    setAnimate(true);
  }, []);

  const copyOrderId = () => {
    navigator.clipboard.writeText(paymentData.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReceipt = () => {
    // Mock download functionality
    const receiptData = `
PAYMENT RECEIPT
Order ID: ${paymentData.orderId}
Product: ${paymentData.product}
Amount: $${paymentData.amount}
Date: ${paymentData.date}
Payment Method: ${paymentData.paymentMethod}
Email: ${paymentData.email}
    `.trim();
    
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentData.orderId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Success Card */}
        <div className={`bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-700 ${
          animate ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}>
          
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute inset-0 w-20 h-20 bg-green-200 rounded-full mx-auto animate-ping opacity-20"></div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{paymentData.orderId}</span>
                  <button
                    onClick={copyOrderId}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Product</span>
                <span className="font-medium">{paymentData.product}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-lg">${paymentData.amount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span>{paymentData.paymentMethod}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-sm">{paymentData.date}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={downloadReceipt}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
              <Mail className="w-5 h-5" />
              Email Receipt
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              A confirmation email has been sent to <br />
              <span className="font-medium text-gray-700">{paymentData.email}</span>
            </p>
            
            <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}