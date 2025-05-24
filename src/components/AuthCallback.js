"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "aws-amplify/auth"

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const processAuthCode = async () => {
      try {
        // Check if user is authenticated after redirect
        await getCurrentUser()
        console.log("AuthCallback: User is authenticated.")

        // Set the user pool type to primary since this is the primary callback
        localStorage.setItem("userPoolType", "primary")
        console.log("AuthCallback: Set userPoolType to 'primary' in localStorage.")

        // Navigate to the customer portal
        navigate("/portal/profile", { replace: true })
      } catch (err) {
        console.error("Error processing authentication callback or user not authenticated:", err)
        setError("Authentication failed or could not retrieve user session. Please try logging in again.")
        localStorage.removeItem("userPoolType") // Clear any potentially incorrect pool type
        // Navigate to login after short delay
        setTimeout(() => navigate("/login"), 4000)
      } finally {
        setLoading(false)
      }
    }

    processAuthCode()
  }, [navigate])

  return (
    <div className="auth-callback-container">
      <div className="auth-callback-content">
        {loading ? (
          <div className="auth-loading">
            <h2>Processing Authentication...</h2>
            <p>Please wait while we complete your login.</p>
          </div>
        ) : error ? (
          <div className="auth-error">
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <p>Redirecting you to login...</p>
          </div>
        ) : (
          <div className="auth-success">
            <h2>Authentication Successful!</h2>
            <p>Redirecting you to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthCallback
