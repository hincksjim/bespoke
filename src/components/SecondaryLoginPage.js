"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import awsconfig from "../aws-exports"

// Simplified secondary login component that uses Cognito hosted UI
const SecondaryLoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = location.state?.returnTo || "/artisan-console"
  const isArtisanSignup = location.state?.isArtisanSignup || false

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const initiateAuth = async () => {
      try {
        // Get the secondary user pool configuration
        const secondaryConfig = awsconfig.secondaryUserPool

        if (!secondaryConfig) {
          throw new Error("Secondary user pool configuration not found")
        }

        // Clear any existing tokens to prevent the double login issue
        localStorage.removeItem("secondaryIdToken")
        localStorage.removeItem("secondaryAccessToken")
        localStorage.removeItem("secondaryRefreshToken")
        
        // Also clear the userPoolType to ensure a clean login flow
        localStorage.removeItem("userPoolType")

        if (isArtisanSignup) {
          // For signup, redirect to the hosted UI signup flow
          const signUpUrl = getHostedUISignUpUrl()
          console.log("Redirecting to secondary user pool signup:", signUpUrl)
          window.location.href = signUpUrl
        } else {
          // For login, redirect to the hosted UI sign-in flow
          const signInUrl = getHostedUISignInUrl()
          console.log("Redirecting to secondary user pool login:", signInUrl)
          window.location.href = signInUrl
        }
      } catch (err) {
        console.error("Auth error:", err)
        setError(err.message || "Failed to initiate authentication flow")
        setLoading(false)
      }
    }

    initiateAuth()
  }, [isArtisanSignup, navigate, location.state])

  // Helper function to get the hosted UI sign-up URL
  const getHostedUISignUpUrl = () => {
    const { userPoolWebClientId, oauth } = awsconfig.secondaryUserPool

    // Use the domain directly from the oauth configuration
    const domain = oauth.domain;

    // Use the CORRECT redirect URI from the configuration
    const callbackUrl = oauth.redirectSignIn;

    // Construct the URL for the hosted UI sign-up page
    const url = `https://${domain}/signup?client_id=${userPoolWebClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=${oauth.scope.join('+')}`;

    return url
  }

  // Helper function to get the hosted UI sign-in URL
  const getHostedUISignInUrl = () => {
    const { userPoolWebClientId, oauth } = awsconfig.secondaryUserPool

    // Use the domain directly from the oauth configuration
    const domain = oauth.domain;

    // Use the CORRECT redirect URI from the configuration
    const callbackUrl = oauth.redirectSignIn;

    // Construct the URL for the hosted UI sign-in page
    const url = `https://${domain}/login?client_id=${userPoolWebClientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=${oauth.scope.join('+')}`;

    return url
  }

  // This component will usually just trigger a redirect
  // But we'll render a loading state or error state if needed
  return (
    <div className="secondary-login-container">
      {error ? (
        <div className="error-message">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")} className="submit-button">
            Return to Home
          </button>
        </div>
      ) : (
        <div className="loading-container">
          <h2>{isArtisanSignup ? "Preparing Artisan Registration" : "Preparing Artisan Login"}</h2>
          <p>Redirecting to secure login page...</p>
          <div className="loading-spinner"></div>
        </div>
      )}
    </div>
  )
}

export default SecondaryLoginPage

