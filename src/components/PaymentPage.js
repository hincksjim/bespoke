// Updated PaymentPage.js with better error handling for 502 errors

"use client"

import React, { useState, useEffect } from "react"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { fetchAuthSession } from "aws-amplify/auth"
import { generateClient } from "aws-amplify/api"
import { useNavigate } from "react-router-dom"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useUserData } from "./UserContext"
import "./payment.css"

// Get API_ENDPOINT from environment variable with fallback
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "https://be7a3cwy69.execute-api.eu-west-2.amazonaws.com/dev"

// Payment Status as a const object
const PaymentStatus = {
  IDLE: "IDLE",
  PROCESSING: "PROCESSING", 
  SUCCESS: "SUCCESS",
  FAILED: "FAILED"
}

const PaymentPage = () => {
  const stripe = useStripe()
  const elements = useElements()
  
  // Enhanced logging for Stripe initialization
  console.log("Stripe instance loaded:", !!stripe);
  console.log("Stripe publishable key check:", 
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY ? 
    "Environment variable present with length: " + process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY.length : 
    "Environment variable NOT present");
  
  const [errorMessage, setErrorMessage] = useState("")
  const [paymentStatus, setPaymentStatus] = useState(PaymentStatus.IDLE)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [userData, setUserData] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [debugInfo, setDebugInfo] = useState(null)
  const navigate = useNavigate()

  // Try to get user data from context hook
  const { userData: contextUserData } = useUserData()

  const plans = [
    { name: "Basic", credits: 50, price: 1000 },
    { name: "Standard", credits: 120, price: 2000 },
    { name: "Premium", credits: 265, price: 4000 },
  ]

  useEffect(() => {
    getUserData()
  }, [])

  // Get user data from multiple sources
  const getUserData = async () => {
    try {
      const userPoolType = localStorage.getItem("userPoolType")
      console.log("Getting user data. Pool type:", userPoolType)

      // Try to get user ID from session
      let userId = ""
      let email = ""
      let firstName = "User"
      let lastName = ""
      let credits = 0

      try {
        // Try to get session tokens
        const { tokens } = await fetchAuthSession()
        if (tokens && tokens.idToken) {
          // Parse the JWT token to get user info
          const tokenPayload = JSON.parse(atob(tokens.idToken.toString().split(".")[1]))
          console.log("Token payload:", tokenPayload)

          userId = tokenPayload.sub || ""
          email = tokenPayload.email || ""

          // Basic info from token
          if (tokenPayload.given_name) firstName = tokenPayload.given_name
          if (tokenPayload.family_name) lastName = tokenPayload.family_name
        }
      } catch (sessionError) {
        console.log("Could not get session tokens, using fallback data", sessionError)
      }

      // If we're using secondary authentication
      if (userPoolType === "secondary") {
        const secondaryIdToken = localStorage.getItem("secondaryIdToken")
        if (secondaryIdToken) {
          try {
            // Parse the JWT token to get user info
            const tokenPayload = JSON.parse(atob(secondaryIdToken.split(".")[1]))
            console.log("Secondary token payload:", tokenPayload)

            userId = tokenPayload.sub || ""
            email = tokenPayload.email || ""
            if (tokenPayload.given_name) firstName = tokenPayload.given_name
            if (tokenPayload.family_name) lastName = tokenPayload.family_name
          } catch (tokenError) {
            console.log("Error parsing secondary token:", tokenError)
          }
        }
      }

      // Try to get data from UserContext if available
      if (contextUserData) {
        console.log("Found user data in context:", contextUserData)
        const contextData = contextUserData

        if (contextData.fields) {
          // Extract data from fields array
          const fieldsMap = {}
          contextData.fields.forEach((field) => {
            fieldsMap[field.key] = field.value
          })

          if (fieldsMap.firstName) firstName = fieldsMap.firstName
          if (fieldsMap.lastName) lastName = fieldsMap.lastName
          if (fieldsMap.email) email = fieldsMap.email
          if (fieldsMap.credits) credits = Number.parseInt(fieldsMap.credits, 10) || 0
        } else {
          // Direct properties
          if (contextData.firstName) firstName = contextData.firstName
          if (contextData.lastName) lastName = contextData.lastName
          if (contextData.email) email = contextData.email
          if (contextData.credits) credits = contextData.credits
        }
      }

      // If we have a userId, try to fetch complete data from GraphQL
      if (userId) {
        try {
          console.log("Fetching user data from GraphQL for ID:", userId)
          const client = generateClient()
          const response = await client.graphql({
            query: getClientQuery,
            variables: { id: userId },
          })

          console.log("GraphQL response:", response)

          if (response.data && response.data.getClient) {
            const clientData = response.data.getClient
            firstName = clientData.firstName || firstName
            lastName = clientData.lastName || lastName
            email = clientData.email || email
            credits = clientData.credits || credits
            console.log("Updated user data from GraphQL:", clientData)
          }
        } catch (graphqlError) {
          console.error("Error fetching user data from GraphQL:", graphqlError)
          // Continue with what we have
        }
      }

      // Set user data with what we have
      const userDataObj = {
        id: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        credits: credits,
      }

      console.log("Using user data:", userDataObj)
      setUserData(userDataObj)
    } catch (error) {
      console.error("Error getting user data:", error)
      // Set default user data as fallback
      setUserData({
        id: "unknown",
        firstName: "User",
        lastName: "",
        email: "",
        credits: 0,
      })
      setErrorMessage("Unable to fetch your profile data. You can still make a purchase.")
    }
  }

  // Function to check the API status
  const checkApiStatus = async () => {
    try {
      // Add a timestamp to bypass caching
      const timestamp = new Date().getTime();
      const response = await fetch(`${API_ENDPOINT}/health?t=${timestamp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return { status: "OK", details: data };
      } else {
        return { status: "ERROR", code: response.status, text: response.statusText };
      }
    } catch (error) {
      return { status: "ERROR", message: error.message };
    }
  };

  // Render different status messages based on payment status
  const renderStatusMessage = () => {
    switch (paymentStatus) {
      case PaymentStatus.PROCESSING:
        return (
          <div className="status-message processing">
            <Loader2 className="animate-spin mr-2" size={24} />
            Processing your payment...
          </div>
        )
      case PaymentStatus.SUCCESS:
        return (
          <div className="status-message success">
            <CheckCircle className="mr-2" size={24} color="green" />
            Payment Successful! {selectedPlan.credits} credits have been added to your account.
          </div>
        )
      case PaymentStatus.FAILED:
        return (
          <div className="status-message error">
            <XCircle className="mr-2" size={24} color="red" />
            {errorMessage || "Payment Failed. Please try again."}
            
            {/* Show retry button if it's a 502 error */}
            {errorMessage.includes("502") && (
              <button 
                className="retry-button"
                onClick={() => handleRetry()}
              >
                Retry Payment
              </button>
            )}
            
            {/* Show debug info button if we have it */}
            {debugInfo && (
              <div className="debug-info">
                <details>
                  <summary><AlertTriangle size={16} /> Technical Details</summary>
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  // Handle retry after 502 error
  const handleRetry = async () => {
    // Only allow a few retries
    if (retryCount >= 3) {
      setErrorMessage("Maximum retry attempts reached. Please try again later or contact support.");
      return;
    }
    
    setRetryCount(prev => prev + 1);
    
    // Check API health before retrying
    const apiStatus = await checkApiStatus();
    setDebugInfo({ 
      ...debugInfo, 
      apiHealthCheck: apiStatus,
      retryAttempt: retryCount + 1
    });
    
    // If the API health check fails, update the error message
    if (apiStatus.status === "ERROR") {
      setErrorMessage(`API appears to be unavailable (${apiStatus.code || 'Unknown error'}). Please try again later.`);
      return;
    }
    
    // Try the payment again
    handleSubmit(new Event('retry'));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setErrorMessage("");
    setPaymentStatus(PaymentStatus.PROCESSING);
    setDebugInfo(null);

    if (!selectedPlan) {
      setErrorMessage("Please select a plan");
      setPaymentStatus(PaymentStatus.FAILED);
      return;
    }

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded.");
      setErrorMessage("Stripe has not loaded yet. Please try again.");
      setPaymentStatus(PaymentStatus.FAILED);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error("CardElement is null");
      setErrorMessage("Please enter your card information.");
      setPaymentStatus(PaymentStatus.FAILED);
      return;
    }

    try {
      const userPoolType = localStorage.getItem("userPoolType");
      let authHeaders = {};

      if (userPoolType === "secondary") {
        const secondaryIdToken = localStorage.getItem("secondaryIdToken");
        if (secondaryIdToken) {
          authHeaders = {
            Authorization: `Bearer ${secondaryIdToken}`,
          };
        }
      } else {
        try {
          const { tokens } = await fetchAuthSession();
          if (tokens && tokens.idToken) {
            authHeaders = {
              Authorization: `Bearer ${tokens.idToken.toString()}`,
            };
          }
        } catch (error) {
          console.error("Error getting auth session:", error);
        }
      }

      // Log the auth headers to verify they're being set correctly
      console.log("Auth headers being used:", JSON.stringify(authHeaders));

      // Create the payment intent with improved error handling
      let paymentResponse;
      try {
        // Add timestamp for cache busting
        const cacheBuster = new Date().getTime();
        paymentResponse = await fetch(`${API_ENDPOINT}/payment?_=${cacheBuster}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          credentials: "include",
          body: JSON.stringify({
            amount: selectedPlan.price,
            currency: "gbp",
            userId: userData?.id || "unknown",
          }),
        });
      } catch (networkError) {
        console.error("Network error during payment request:", networkError);
        
        // Check if it's a CORS error
        let errorDetail = networkError.message || "Unknown network error";
        let isCorsError = false;
        
        if (errorDetail.includes("CORS") || networkError.name === "TypeError") {
          isCorsError = true;
          errorDetail = "Cross-Origin Resource Sharing (CORS) issue detected. This is likely an API configuration problem.";
        }
        
        setDebugInfo({
          error: "NETWORK_ERROR",
          details: errorDetail,
          possibleCorsError: isCorsError,
          endpoint: API_ENDPOINT
        });
        
        throw new Error(`Network error: ${errorDetail}`);
      }

      if (!paymentResponse.ok) {
        let errorData = {};
        
        // Try to get error details if possible
        try {
          errorData = await paymentResponse.json();
        } catch (e) {
          console.log("Could not parse error response:", e);
        }
        
        // Collect debug info
        setDebugInfo({
          endpoint: `${API_ENDPOINT}/payment`,
          statusCode: paymentResponse.status,
          statusText: paymentResponse.statusText,
          errorData: errorData,
          headers: Object.fromEntries(paymentResponse.headers)
        });
        
        // Special handling for 502 errors
        if (paymentResponse.status === 502) {
          throw new Error(`Failed to create payment intent: 502 - The server is temporarily unavailable. This is often a temporary issue, please try again.`);
        }
        
        throw new Error(errorData.error || `Failed to create payment intent: ${paymentResponse.status}`);
      }

      const { clientSecret, paymentIntentId } = await paymentResponse.json();
      console.log("paymentStatus:", paymentStatus);  
      console.log("paymentResponse:", paymentResponse);    
      console.log("clientSecret:", clientSecret ? "Received" : "Missing");
      console.log("paymentIntentId:", paymentIntentId);

      // Make sure we have a valid client secret before proceeding
      if (!clientSecret) {
        throw new Error("Did not receive a valid client secret from the server");
      }

      // Confirm the card payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${userData?.firstName || "User"} ${userData?.lastName || ""}`.trim(),
            email: userData?.email || "",
          },
        },
      });

      if (error) {
        console.error("Stripe payment error:", error);
        setErrorMessage(error.message);
        setPaymentStatus(PaymentStatus.FAILED);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Update user credits after successful payment
        const updateResponse = await fetch(`${API_ENDPOINT}/update-credits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,  // Use the same auth headers here
          },
          credentials: "include",
          body: JSON.stringify({
            userId: userData?.id || "unknown",
            credits: selectedPlan.credits,
            paymentIntentId: paymentIntentId,  // Make sure this is included
          }),
        });

        if (!updateResponse.ok) {
          const errorDetails = await updateResponse.json().catch(() => ({}));
          setErrorMessage(`Payment succeeded but failed to update credits: ${errorDetails.error || "Unknown error"}`);
          setPaymentStatus(PaymentStatus.FAILED);
        } else {
          const updateData = await updateResponse.json();
          setUserData(prev => ({
            ...prev,
            credits: updateData.newCredits || (prev.credits + selectedPlan.credits),
          }));
          setPaymentStatus(PaymentStatus.SUCCESS);
          setTimeout(() => navigate("/design"), 2000);
        }
      } else {
        // Payment intent returned but not succeeded
        setErrorMessage(`Payment processing failed. Status: ${paymentIntent.status}`);
        setPaymentStatus(PaymentStatus.FAILED);
      }
    } catch (err) {
      console.error("Payment exception:", err);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setPaymentStatus(PaymentStatus.FAILED);
    }
  };

  return (
    <div className="design-tool payment-page">
      <div className="options-container">
        <div className="option-box">
          <h2>Purchase Credits</h2>
          {userData && (
            <div className="welcome-section">
              <p>Welcome, {userData.firstName} {userData.lastName}!</p>
              <p>Your Current Credits: {userData.credits}</p>
            </div>
          )}
          <div className="plans-container">
            {plans.map((plan) => (
              <div key={plan.name} className="plan-option">
                <button
                  className={`option-button ${selectedPlan === plan ? "selected" : ""}`}
                  onClick={() => setSelectedPlan(plan)}
                  disabled={paymentStatus === PaymentStatus.PROCESSING}
                >
                  <h3>{plan.name}</h3>
                  <p>
                    {plan.credits} credits for £{(plan.price / 100).toFixed(2)}
                  </p>
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="card-element-container">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
            <button 
              type="submit" 
              className="submit-button" 
              disabled={
                paymentStatus === PaymentStatus.PROCESSING || 
                !selectedPlan || 
                !stripe
              }
            >
              {paymentStatus === PaymentStatus.PROCESSING ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Processing...
                </>
              ) : (
                `Buy ${selectedPlan ? selectedPlan.name : "Selected"} Plan`
              )}
            </button>
          </form>
          
          {/* Status message rendering */}
          {renderStatusMessage()}

          <div className="test-card-info">
            <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
            <p>Use any future expiration date and any 3 digits for CVC</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// GraphQL query to get client data - moved outside the function
const getClientQuery = `
  query GetClient($id: ID!) {
    getClient(id: $id) {
      id
      firstName
      lastName
      email
      credits
    }
  }
`;

export default PaymentPage;
