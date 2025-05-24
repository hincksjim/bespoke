import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { post } from 'aws-amplify/api';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import './payment.css';

// Configure Amplify
Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'stripeAPI',
        endpoint: 'YOUR_API_ENDPOINT_URL'
      }
    ]
  }
});

const PaymentPage = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const plans = [
        { name: 'Basic', credits: 50, price: 1000 },
        { name: 'Standard', credits: 120, price: 2000 },
        { name: 'Premium', credits: 265, price: 4000 }
    ];

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const { accessToken, idToken } = (await fetchAuthSession()).tokens ?? {};
            const attributes = await fetchUserAttributes();
            setUserData({
                id: attributes.sub,
                firstName: attributes.given_name,
                lastName: attributes.family_name,
                email: attributes.email,
                credits: 0 // You might need to fetch this from your backend
            });
            console.log('User data fetched successfully:', attributes);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setErrorMessage('Unable to fetch user data. Please try again.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedPlan) {
            setErrorMessage('Please select a plan');
            return;
        }
        setIsProcessing(true);

        if (!stripe || !elements) {
            setErrorMessage('Stripe has not loaded yet. Please try again.');
            setIsProcessing(false);
            return;
        }

        try {
            console.log('Initiating payment process...');
            const response = await post({
                apiName: 'stripeAPI',
                path: '/payment',
                options: {
                    body: {
                        amount: selectedPlan.price,
                        currency: 'gbp',
                    }
                }
            });

            console.log('Payment initiation response:', response);
            const { clientSecret } = response;

            console.log('Confirming card payment...');
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: `${userData.firstName} ${userData.lastName}`,
                        email: userData.email
                    },
                },
            });

            if (error) {
                console.error('Payment confirmation error:', error);
                setErrorMessage(error.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                console.log('Payment successful:', paymentIntent);

                console.log('Updating user credits...');
                await post({
                    apiName: 'stripeAPI',
                    path: '/update-credits',
                    options: {
                        body: {
                            userId: userData.id,
                            credits: selectedPlan.credits
                        }
                    }
                });

                setIsProcessing(false);
                navigate('/design');
            }
        } catch (err) {
            console.error('Error in payment process:', err);
            setErrorMessage('An error occurred while processing your payment. Please try again.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="design-tool payment-page">
            <div className="options-container">
                <div className="option-box">
                    <h2>Purchase Credits</h2>
                    {userData && (
                        <div className="welcome-section">
                            <p>Welcome, {userData.firstName}!</p>
                            <p>Your Current Credits: {userData.credits}</p>
                        </div>
                    )}
                    <div className="plans-container">
                        {plans.map((plan) => (
                            <div key={plan.name} className="plan-option">
                                <button
                                    className={`option-button ${selectedPlan === plan ? 'selected' : ''}`}
                                    onClick={() => setSelectedPlan(plan)}
                                >
                                    <h3>{plan.name}</h3>
                                    <p>{plan.credits} credits for £{(plan.price / 100).toFixed(2)}</p>
                                </button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="card-element-container">
                            <CardElement options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}/>
                        </div>
                        <button type="submit" className="submit-button" disabled={isProcessing || !selectedPlan}>
                            {isProcessing ? (
                                <>
                                    <Loader2 className="animate-spin" size={24} />
                                    Processing...
                                </>
                            ) : (
                                `Buy ${selectedPlan ? selectedPlan.name : 'Selected'} Plan`
                            )}
                        </button>
                    </form>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;