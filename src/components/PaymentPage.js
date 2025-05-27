// Fixed PaymentPage.js with proper postal code handling

"use client"

import React, { useState, useEffect, useCallback } from "react"
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

// GraphQL query to get client data - moved outside the component
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
`

/**
 * This component handles the payment process using Stripe.
 * It includes a form for entering payment details and manages payment status.
 */
const PaymentPage = () => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  
  // Enhanced logging for Stripe initialization
  console.log("Stripe instance loaded:", !!stripe);
  console.log("Stripe Elements loaded:", !!elements);
  console.log("Stripe publishable key:", stripe|| "Not set");

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
  const [postalCode, setPostalCode] = useState("") // Add separate postal code state

  // Try to get user data from context hook
  const { userData: contextUserData } = useUserData() || { userData: null }

  const plans = [
    { name: "Basic", credits: 50, price: 1000 },
    { name: "Standard", credits: 120, price: 2000 },
    { name: "Premium", credits: 265, price: 4000 },
  ]

  // Get user data from multiple sources - wrapped in useCallback to prevent infinite re-renders
  const getUserData = useCallback(async () => {
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

        if (contextData.fields && Array.isArray(contextData.fields)) {
          // Extract data from fields array
          const fieldsMap = {}
          contextData.fields.forEach((field) => {
            if (field && field.key && field.value !== undefined) {
              fieldsMap[field.key] = field.value
            }
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
  }, [contextUserData]) // Add contextUserData as dependency

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
    setDebugInfo(prevDebugInfo => ({ 
      ...prevDebugInfo, 
      apiHealthCheck: apiStatus,
      retryAttempt: retryCount + 1
    }));
    
    // If the API health check fails, update the error message
    if (apiStatus.status === "ERROR") {
      setErrorMessage(`API appears to be unavailable (${apiStatus.code || 'Unknown error'}). Please try again later.`);
      return;
    }
    
    // Try the payment again
    const retryEvent = { preventDefault: () => {} };
    handleSubmit(retryEvent);
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
            Payment Successful! {selectedPlan?.credits || 0} credits have been added to your account.
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
                onClick={handleRetry}
                type="button"
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

  const handleSubmit = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    
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
            currency: "GBP",
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

      const paymentResponseData = await paymentResponse.json();
      console.log("=== PAYMENT INTENT CREATION RESPONSE ===");
      console.log("Full payment response data:", JSON.stringify(paymentResponseData, null, 2));
      console.log("Response keys:", Object.keys(paymentResponseData));
      
      const { clientSecret, paymentIntentId } = paymentResponseData;
      
      // Detailed validation of payment intent response
      console.log("=== PAYMENT INTENT VALIDATION ===");
      console.log("clientSecret exists:", !!clientSecret);
      console.log("clientSecret type:", typeof clientSecret);
      console.log("clientSecret length:", clientSecret ? clientSecret.length : 'N/A');
      console.log("clientSecret starts with 'pi_':", clientSecret ? clientSecret.startsWith('pi_') : false);
      console.log("paymentIntentId:", paymentIntentId);
      console.log("paymentIntentId type:", typeof paymentIntentId);
      
      // Log other important data
      console.log("=== CONTEXT DATA ===");
      console.log("paymentStatus:", paymentStatus);  
      console.log("selectedPlan:", JSON.stringify(selectedPlan, null, 2));
      console.log("userData:", JSON.stringify(userData, null, 2));
      console.log("authHeaders:", JSON.stringify(authHeaders, null, 2));
      console.log("stripe instance:", !!stripe);
      console.log("cardElement:", !!cardElement); 

      // Make sure we have a valid client secret before proceeding
      if (!clientSecret) {
        console.error("=== CLIENT SECRET VALIDATION FAILED ===");
        console.error("clientSecret is falsy:", !clientSecret);
        console.error("Full response was:", JSON.stringify(paymentResponseData, null, 2));
        throw new Error("Did not receive a valid client secret from the server");
      }

      // Validate client secret format
      if (typeof clientSecret !== 'string') {
        console.error("=== CLIENT SECRET TYPE ERROR ===");
        console.error("Expected string, got:", typeof clientSecret);
        console.error("Value:", clientSecret);
        throw new Error(`Client secret must be a string, received: ${typeof clientSecret}`);
      }

      if (!clientSecret.startsWith('pi_')) {
        console.error("=== CLIENT SECRET FORMAT ERROR ===");
        console.error("Client secret should start with 'pi_', got:", clientSecret.substring(0, 10) + "...");
        throw new Error("Client secret format appears invalid");
      }

      // IMPORTANT: Using clientSecret (NOT publishable key) for payment confirmation
      console.log("=== STRIPE PAYMENT CONFIRMATION ===");
      console.log("About to confirm payment with clientSecret:", clientSecret.substring(0, 20) + "...");
      console.log("Stripe instance ready:", !!stripe);
      console.log("CardElement ready:", !!cardElement);
      
      // Log billing details that will be sent
      const billingDetails = {
        name: `${userData?.firstName || "User"} ${userData?.lastName || ""}`.trim(),
        email: userData?.email || "",
        address: {
          postal_code: postalCode || undefined, // Use our separate postal code field
        },
      };
      console.log("Billing details:", JSON.stringify(billingDetails, null, 2));
      
      // Confirm the card payment with Stripe - Using clientSecret correctly
      console.log("Calling stripe.confirmCardPayment...");
      const stripeResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingDetails,
        },
        return_url: window.location.origin + '/payment-success', // Add return URL
      });
      
      console.log("=== STRIPE CONFIRMATION RESULT ===");
      console.log("Stripe result keys:", Object.keys(stripeResult));
      console.log("Error exists:", !!stripeResult.error);
      console.log("PaymentIntent exists:", !!stripeResult.paymentIntent);
      
      if (stripeResult.error) {
        console.log("Stripe error details:", JSON.stringify(stripeResult.error, null, 2));
      }
      
      if (stripeResult.paymentIntent) {
        console.log("PaymentIntent status:", stripeResult.paymentIntent.status);
        console.log("PaymentIntent ID:", stripeResult.paymentIntent.id);
        console.log("PaymentIntent amount:", stripeResult.paymentIntent.amount);
        console.log("PaymentIntent currency:", stripeResult.paymentIntent.currency);      console.log("Payment method details:", stripeResult.paymentIntent.payment_method ? "Present" : "Missing");
        
        // Log complete payment method details
        console.log("Complete payment method:", JSON.stringify(stripeResult.paymentIntent.payment_method, null, 2));
      }

      const { error, paymentIntent } = stripeResult;

      if (error) {
        console.error("=== STRIPE PAYMENT ERROR ===");
        console.error("Error type:", error.type);
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Error decline code:", error.decline_code);
        console.error("Full error object:", JSON.stringify(error, null, 2));
        
        // Handle different types of Stripe errors
        let errorMsg = error.message;
        if (error.type === 'card_error' || error.type === 'validation_error') {
          errorMsg = error.message;
        } else {
          errorMsg = 'An unexpected error occurred. Please try again.';
        }
        
        setErrorMessage(errorMsg);
        setPaymentStatus(PaymentStatus.FAILED);
        return;
      }

      // Check payment intent status more thoroughly
      console.log("=== PAYMENT INTENT STATUS CHECK ===");
      console.log("PaymentIntent object:", !!paymentIntent);
      
      if (!paymentIntent) {
        console.error("PaymentIntent is null or undefined");
        setErrorMessage("Payment processing failed - no payment intent returned. Please try again.");
        setPaymentStatus(PaymentStatus.FAILED);
        return;
      }
      
      console.log("PaymentIntent status:", paymentIntent.status);
      console.log("PaymentIntent ID:", paymentIntent.id);
      console.log("PaymentIntent amount received:", paymentIntent.amount_received);
      console.log("PaymentIntent amount:", paymentIntent.amount);
        if (paymentIntent.status === "succeeded") {
        console.log("=== PAYMENT SUCCEEDED - PROCESSING CREDITS ===");
        
        // Initialize payment method details
        let cardLast4 = "****";
        let cardBrand = "card";
        let paymentMethodDetails = null;
          try {
            const paymentMethodId = paymentIntent.payment_method;
            console.log("Payment method ID:", paymentMethodId);
            
            if (paymentMethodId && stripe) {
                paymentMethodDetails = await stripe.paymentMethods.retrieve(paymentMethodId);
                console.log("Retrieved payment method:", JSON.stringify(paymentMethodDetails, null, 2));
                
                if (paymentMethodDetails?.card) {
                    cardLast4 = paymentMethodDetails.card.last4;
                    cardBrand = paymentMethodDetails.card.brand;
                }
            }
        } catch (error) {
            console.error("Failed to retrieve payment method details:", error);
            console.error("Full error:", {
                message: error.message,
                stack: error.stack,
                type: error.type,
                raw: error
            });
            // Continue with default values since payment was still successful
        }          try {            console.log("=== UPDATING CREDITS ===");
            console.log("About to update credits via GraphQL");
            console.log("User ID:", userData?.id);
            console.log("Current credits:", userData?.credits);
            console.log("Credits to add:", selectedPlan.credits);
            console.log("Payment Intent ID:", paymentIntent.id);
            
            const newTotalCredits = (userData?.credits || 0) + selectedPlan.credits;
            
            // Initialize the GraphQL client
            const client = generateClient();

            // Define the GraphQL mutation for updating client credits
            const updateClientMutation = `
              mutation UpdateClient($input: UpdateClientInput!) {
                updateClient(input: $input) {
                  id
                  credits
                }
              }
            `;
            
            const updateResponse = await client.graphql({
              query: updateClientMutation,
              variables: {
                input: {
                  id: userData?.id,
                  credits: newTotalCredits
                }
              }
            });

            console.log("GraphQL Update Response:", JSON.stringify(updateResponse, null, 2));

            if (!updateResponse.data?.updateClient) {
              console.error("=== CREDITS UPDATE FAILED ===");
              console.error("GraphQL response:", updateResponse);
              
              // Navigate to success page with error info
              const successData = {
                orderId: paymentIntent.id,
                amount: selectedPlan.price / 100,
                currency: 'GBP',
                product: `${selectedPlan.name} Plan - ${selectedPlan.credits} Credits`,
                email: userData?.email || 'N/A',
                paymentMethod: {
                  brand: cardBrand || 'card',
                  last4: cardLast4 || '****',
                  type: paymentMethodDetails?.card?.funding || 'unknown'
                },
                date: new Date().toISOString(),
                creditsAdded: 0,
                planName: selectedPlan.name,
                plannedCredits: selectedPlan.credits,
                creditsUpdateFailed: true,
                errorDetails: "Failed to update credits in database",
                newCreditsTotal: userData?.credits || 0
              };
              
              navigate('/payment-success', { 
                state: { paymentData: successData },
                replace: true 
              });
            }

            const updateData = updateResponse.data.updateClient;
            console.log("=== CREDITS UPDATE SUCCESSFUL ===");
            console.log("Update response data:", JSON.stringify(updateData, null, 2));
              // Prepare navigation data
            const successData = {
              orderId: paymentIntent.id,
              amount: selectedPlan.price / 100,
              currency: 'GBP',
              product: `${selectedPlan.name} Plan - ${selectedPlan.credits} Credits`,
              email: userData?.email || 'N/A',              paymentMethod: {
                brand: paymentMethodDetails?.card?.brand || cardBrand || 'card',
                last4: paymentMethodDetails?.card?.last4 || cardLast4 || '****',
                type: paymentMethodDetails?.card?.funding || 'unknown'
              },
              date: new Date().toISOString(),
              creditsAdded: selectedPlan.credits,
              planName: selectedPlan.name,
              creditsUpdateFailed: false,
              newCreditsTotal: updateData?.newCredits || ((userData?.credits || 0) + selectedPlan.credits)
            };
            
            // Update local state
            setUserData(prev => ({
              ...prev,
              credits: successData.newCreditsTotal,
            }));
            setPaymentStatus(PaymentStatus.SUCCESS);
            
            // Navigate after a short delay
            console.log("Success data for navigation:", JSON.stringify(successData, null, 2));
            setTimeout(() => {              navigate('/payment-success', { 
                state: { paymentData: successData },
                replace: true 
              });
            }, 1000);
          } catch (error) {
            console.error("=== CREDITS UPDATE EXCEPTION ===");
            console.error("Error:", error);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            setErrorMessage("Payment succeeded but failed to update credits. Please contact support with your payment confirmation.");
            setPaymentStatus(PaymentStatus.FAILED);
          }
      } else if (paymentIntent.status === "requires_action") {
        // Handle 3D Secure or other authentication
        console.log("=== PAYMENT REQUIRES ACTION ===");
        console.log("PaymentIntent requires additional authentication");
        console.log("Next action:", paymentIntent.next_action);
        setErrorMessage("Payment requires additional authentication. Please follow the prompts from your bank.");
        setPaymentStatus(PaymentStatus.FAILED);
      } else {
        // Payment intent returned but not succeeded
        const status = paymentIntent?.status || "unknown";
        console.log("=== PAYMENT NOT SUCCESSFUL ===");
        console.log("Payment not successful, status:", status);
        console.log("Full paymentIntent for debugging:", JSON.stringify(paymentIntent, null, 2));
        setErrorMessage(`Payment processing failed. Status: ${status}. Please try again.`);
        setPaymentStatus(PaymentStatus.FAILED);
      }
    } catch (err) {
      console.error("=== PAYMENT EXCEPTION ===");
      console.error("Exception type:", err.constructor.name);
      console.error("Exception message:", err.message);
      console.error("Full exception:", err);
      console.error("Stack trace:", err.stack);
      setErrorMessage(err.message || "Something went wrong. Please try again.");
      setPaymentStatus(PaymentStatus.FAILED);
    }
  };

  // useEffect to initialize user data
  useEffect(() => {
    getUserData()
  }, [getUserData])

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
                  type="button"
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
                  hidePostalCode: true, // Hide the built-in postal code field
                }}
              />
            </div>
            
            {/* Add separate postal code input field */}
            <div className="postal-code-container">
              <label htmlFor="postal-code">Postal Code</label>
              <input
                id="postal-code"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                placeholder="Enter your postal code (e.g., SW1A 1AA)"
                className="postal-code-input"
                disabled={paymentStatus === PaymentStatus.PROCESSING}
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
            <p><strong>Test Postal Code:</strong> Any UK postcode (e.g., SW1A 1AA)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage