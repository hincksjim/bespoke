import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// This file defines the CheckoutForm component, which renders a payment form for processing payments using Stripe.
// It includes a card input field and handles the submission of payment details to Stripe.

// This component renders a checkout form for processing payments using Stripe.
// It includes a card input field and handles payment submission.
const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();

  /**
   * handleSubmit Function
   * This function handles the form submission for processing payments.
   * It retrieves the card details from the CardElement and creates a payment method using Stripe.
   * If successful, it logs the payment method; otherwise, it logs the error.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
      // Handle payment processing on the backend
    }
  };

  /**
   * Rendered Output
   * The component renders a form with a Stripe CardElement for entering card details.
   * It includes a submit button that is disabled until the Stripe object is ready.
   */
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay ${amount}
      </button>
    </form>
  );
};

export default CheckoutForm;
