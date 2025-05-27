import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthenticator } from '@aws-amplify/ui-react';
import './payment.css';

// This file defines the ArtisanPaymentPage component, which handles the payment process for artisans subscribing to a monthly plan.
// It integrates with Stripe for secure payment processing and fetches the client secret from the backend to initialize the payment flow.

// This component handles the payment process for artisans subscribing to a monthly plan.
// It integrates with Stripe to securely process payments and fetches the client secret from the backend.

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const ArtisanPaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { user } = useAuthenticator(context => [context.user]);

  const [clientSecret, setClientSecret] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('initial');
  const [subscriptionPlan] = useState({
    name: 'Artisan Monthly',
    price: 2999, // £29.99
    type: 'subscription',
    interval: 'month'
  });

  // stripePromise
  // This initializes the Stripe object using the publishable key from the environment variables.

  useEffect(() => {
    // Fetch the clientSecret from the backend
    const fetchClientSecret = async () => {
      try {
        const response = await fetch('/api/create-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user?.attributes?.email,
            plan: subscriptionPlan.name,
          }),
        });

        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('Failed to fetch client secret');
        }
      } catch (error) {
        console.error('Error fetching client secret:', error);
        setErrorMessage('Failed to initialize payment. Please try again later.');
      }
    };

    fetchClientSecret();
  }, [user, subscriptionPlan.name]);

  // useEffect Hook
  // This hook fetches the client secret from the backend when the component mounts.
  // The client secret is required to initialize the Stripe PaymentElement for processing payments.

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
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
        setErrorMessage(submitError.message);
        setPaymentStatus('failed');
        return;
      }

      // Handle successful payment
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        try {
          // Here you would update the artisan's subscription status in your backend
          
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
        } catch (error) {
          console.error('Error updating subscription:', error);
          setErrorMessage('Payment succeeded but failed to update subscription. Please contact support.');
          setPaymentStatus('failed');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An error occurred during payment');
      setPaymentStatus('failed');
    }
  };

  // handleSubmit Function
  // This function handles the form submission for the payment process.
  // It uses the Stripe API to confirm the payment and navigates to the success page upon successful payment.
  // In case of errors, it updates the error message and payment status accordingly.

  if (!clientSecret) {
    return <div>Loading payment details...</div>;
  }

  // Rendered Output
  // The component renders the subscription plan details, a Stripe PaymentElement for entering payment information, and a submit button.
  // It also displays error messages if the payment process encounters any issues.

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
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
    </Elements>
  );
};

export default ArtisanPaymentPage;
