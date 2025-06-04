import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './payment.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Separate the payment form component that uses Stripe hooks
const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuthenticator(context => [context.user]);

  const [clientSecret, setClientSecret] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('initial');
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionPlan] = useState({
    name: 'Artisan Monthly',
    price: 2999, // £29.99
    type: 'subscription',
    interval: 'month'
  });

  useEffect(() => {
    // Fetch the clientSecret from the backend
    const fetchClientSecret = async () => {
      try {
        setIsLoading(true);
        setErrorMessage('');
        
        console.log('Fetching client secret for user:', user?.attributes?.email);
        
        const response = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user?.attributes?.email,
            plan: subscriptionPlan.name,
            priceId: 'price_YOUR_STRIPE_PRICE_ID', // Replace with your actual Stripe price ID
          }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // Check if the response is OK
        if (!response.ok) {
          const errorText = await response.text();
          console.error('HTTP error response:', errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const responseText = await response.text();
          console.error('Non-JSON response:', responseText);
          throw new Error('Server returned non-JSON response. API endpoint may not exist.');
        }

        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          console.log('Client secret set successfully');
        } else {
          throw new Error('No client secret in response');
        }
      } catch (error) {
        console.error('Error fetching client secret:', error);
        
        // More specific error messages based on error type
        if (error.message.includes('Failed to fetch')) {
          setErrorMessage('Cannot connect to payment server. Please check if your backend is running.');
        } else if (error.message.includes('non-JSON response') || error.message.includes('Unexpected token')) {
          setErrorMessage('Payment API not configured. The /api/create-subscription endpoint may not exist.');
        } else if (error.message.includes('HTTP error! status: 404')) {
          setErrorMessage('Payment endpoint not found. Please ensure /api/create-subscription is implemented.');
        } else if (error.message.includes('HTTP error! status: 500')) {
          setErrorMessage('Payment server error. Please check your backend logs.');
        } else {
          setErrorMessage(`Failed to initialize payment: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.attributes?.email) {
      fetchClientSecret();
    } else {
      setErrorMessage('User email not available. Please ensure you are logged in.');
      setIsLoading(false);
    }
  }, [user, subscriptionPlan.name]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setErrorMessage('Stripe is not loaded. Please refresh the page.');
      return;
    }

    if (!clientSecret) {
      setErrorMessage('Payment not initialized. Please refresh the page.');
      return;
    }

    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/artisan-payment-success`,
          payment_method_data: {
            billing_details: {
              email: user?.attributes?.email
            }
          }
        },
        redirect: 'if_required'
      });

      if (submitError) {
        console.error('Payment confirmation error:', submitError);
        setErrorMessage(submitError.message);
        setPaymentStatus('failed');
        return;
      }

      // Handle successful payment
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        
        try {
          // Optional: Update subscription status in your backend
          await fetch('/api/update-subscription-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user?.attributes?.email,
              paymentIntentId: paymentIntent.id,
              subscriptionId: paymentIntent.subscription,
            }),
          });
        } catch (updateError) {
          console.warn('Failed to update subscription status:', updateError);
          // Don't block the success flow for this
        }

        // Navigate to success page
        navigate('/artisan-payment-success', {
          state: {
            paymentData: {
              orderId: paymentIntent.id,
              amount: subscriptionPlan.price / 100,
              product: `${subscriptionPlan.name} Subscription`,
              email: user?.attributes?.email,
              date: new Date().toISOString(),
              paymentMethod: {
                brand: 'card',
                last4: '****'
              },
              subscriptionType: 'monthly'
            }
          },
          replace: true
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred during payment');
      setPaymentStatus('failed');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="design-tool payment-page">
        <div className="payment-container">
          <h1>Artisan Subscription</h1>
          <div className="loading-message">
            <p>Loading payment details...</p>
            <p>Initializing secure payment form...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show error but still show plan details
  if (errorMessage && !clientSecret) {
    return (
      <div className="design-tool payment-page">
        <div className="payment-container">
          <h1>Artisan Subscription</h1>
          <div className="plan-details">
            <h2>{subscriptionPlan.name}</h2>
            <p className="price">£{(subscriptionPlan.price / 100).toFixed(2)} / month</p>
            <ul className="features">
              <li>Full access to artisan console</li>
              <li>Unlimited quote responses</li>
              <li>Priority support</li>
              <li>Analytics and reporting</li>
            </ul>
          </div>

          <div className="error-message">
            <h3>Payment Setup Required</h3>
            <p>{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show payment form
  return (
    <div className="design-tool payment-page">
      <div className="payment-container">
        <h1>Artisan Subscription</h1>
        <div className="plan-details">
          <h2>{subscriptionPlan.name}</h2>
          <p className="price">£{(subscriptionPlan.price / 100).toFixed(2)} / month</p>
          <ul className="features">
            <li>Full access to artisan console</li>
            <li>Unlimited quote responses</li>
            <li>Priority support</li>
            <li>Analytics and reporting</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <button
            type="submit"
            disabled={!stripe || paymentStatus === 'processing'}
            className="payment-button"
          >
            {paymentStatus === 'processing' ? 'Processing...' : 'Subscribe Now'}
          </button>
        </form>

        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

// Main component that wraps the payment form with Elements provider
const ArtisanPaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default ArtisanPaymentPage;
