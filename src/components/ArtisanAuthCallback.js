"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import awsExports from "../aws-exports"

// This component processes the authentication callback for artisans.
// It extracts the authorization code from the URL, exchanges it for tokens, and navigates to the artisan console.
const ArtisanAuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const processAuthCode = async () => {
      try {
        console.log("ArtisanAuthCallback: Processing authentication callback")

        // 1. Set the user pool type to secondary
        localStorage.setItem("userPoolType", "secondary")
        console.log("ArtisanAuthCallback: Set userPoolType to 'secondary' in localStorage.")

        // 2. Extract the authorization code from the URL
        const urlParams = new URLSearchParams(window.location.search)
        const authCode = urlParams.get("code")
        
        if (!authCode) {
          throw new Error("No authorization code found in URL")
        }
        
        console.log("Authorization code extracted from URL:", authCode.substring(0, 5) + "...")

        // 3. Exchange the code for tokens
        const tokens = await exchangeCodeForTokens(authCode)
        console.log("Successfully exchanged code for tokens")
        
        // 4. Store the tokens in localStorage
        localStorage.setItem("secondaryIdToken", tokens.id_token)
        localStorage.setItem("secondaryAccessToken", tokens.access_token)
        if (tokens.refresh_token) {
          localStorage.setItem("secondaryRefreshToken", tokens.refresh_token)
        }
        console.log("Tokens stored in localStorage")
        
        // 5. Navigate to the artisan console
        navigate("/artisan-console", { replace: true })
      } catch (err) {
        console.error("Error processing authentication callback:", err)
        setError("Authentication failed: " + (err.message || "Unknown error"))
        localStorage.removeItem("userPoolType")
      } finally {
        setLoading(false)
      }
    }

    // Function to exchange the authorization code for tokens
    const exchangeCodeForTokens = async (code) => {
      const { userPoolWebClientId, clientSecret, oauth } = awsExports.secondaryUserPool
      
      // Fix the domain URL format if needed
      let domain = oauth.domain
      if (!domain.includes("https://")) {
        domain = `https://${domain}`
      }
      
      // Prepare the token request
      const tokenEndpoint = `${domain}/oauth2/token`
      const redirectUri = oauth.redirectSignIn
      
      console.log("Client ID:", userPoolWebClientId)
      console.log("Redirect URI:", redirectUri)
      console.log("Token endpoint:", tokenEndpoint)
      
      // Create Basic Auth header with client secret
      const authHeader = "Basic " + btoa(userPoolWebClientId + ":" + clientSecret)
      
      const params = new URLSearchParams()
      params.append("grant_type", "authorization_code")
      params.append("client_id", userPoolWebClientId)
      params.append("code", code)
      params.append("redirect_uri", redirectUri)
      
      console.log("Sending token request to:", tokenEndpoint)
      
      // Make the request to exchange the code for tokens
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": authHeader
        },
        body: params.toString(),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Token exchange failed:", response.status, errorText)
        throw new Error(`Token exchange failed: ${response.status} ${errorText}`)
      }
      
      const tokens = await response.json()
      return tokens
    }

    processAuthCode()
  }, [navigate])

  return (
    <div className="auth-callback-container">
      {loading ? (
        <div className="auth-loading">
          <h2>Processing Artisan Authentication...</h2>
          <p>Please wait while we complete your login.</p>
        </div>
      ) : error ? (
        <div className="auth-error">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <p>Please try logging in again.</p>
        </div>
      ) : (
        <div className="auth-success">
          <h2>Authentication Successful!</h2>
          <p>Redirecting you to your artisan dashboard...</p>
        </div>
      )}
    </div>
  )
}

export default ArtisanAuthCallback

// This file defines the ArtisanAuthCallback component, which handles the authentication callback for artisan users.
// It processes the authorization code from the URL, exchanges it for tokens, and navigates the user to the artisan console.

// processAuthCode Function
// This function extracts the authorization code from the URL, exchanges it for tokens, and stores the tokens in localStorage.
// It also handles errors during the authentication process and navigates the user to the artisan console upon success.

// exchangeCodeForTokens Function
// This helper function sends a POST request to the token endpoint to exchange the authorization code for tokens.
// It uses the client ID, client secret, and redirect URI to authenticate the request and returns the tokens upon success.
