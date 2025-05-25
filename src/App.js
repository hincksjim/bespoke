"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom"
import { ThemeProvider, Authenticator, useAuthenticator } from "@aws-amplify/ui-react"
import "@aws-amplify/ui-react/styles.css"
import Home from "./components/LandingPage"
import AboutUs from "./components/AboutUs"
import Artisan from "./components/artisan"
import CustomerPortalRoutes from "./components/CustomerPortal"
import Header from "./components/Header"
import Terms from "./components/Terms"
import Privacy from "./components/Privacy"
import PaymentPage from "./components/PaymentPage"
import SecondaryLoginPage from "./components/SecondaryLoginPage"
import PaymentSuccessPage from "./components/PaymentSuccessPage"
import AuthCallback from "./components/AuthCallback"
import ArtisanAuthCallback from "./components/ArtisanAuthCallback"
import ArtisanConsole from "./components/artisan-console"
import "./App.css"
import { Amplify } from "aws-amplify"
import { signUp, fetchUserAttributes, updateUserAttributes } from "aws-amplify/auth"
import awsconfig from "./aws-exports"
import { UserProvider } from "./components/UserContext"
import { CountryProvider } from "./components/CountryContext"
import { loginWithPrimary } from "./auth"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"


// Fix: Properly load the Stripe publishable key from environment variables
const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
console.log("Stripe Publishable Key being used by loadStripe:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // Good for debugging
const stripePromise = loadStripe(stripePublishableKey);
// Fix: Log only that Stripe is being initialized, not the actual key
console.log("Stripe initialization with key from environment:", 
  stripePublishableKey ? "Key loaded successfully" : "No key found");


Amplify.configure(awsconfig)

const CustomSignUp = () => {
  const { toSignIn } = useAuthenticator()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState(null)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const handleCustomSignUp = async (event) => {
    event.preventDefault()
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            given_name: firstName,
            family_name: lastName,
            "custom:Role2": "Client",
          },
          autoSignIn: true,
        },
      })
      console.log("Signup response:", { isSignUpComplete, userId, nextStep })
      setSignupSuccess(true)
    } catch (error) {
      console.error("Signup error:", error)
      setError(error.message || "An error occurred during signup")
    }
  }

  return (
    <div>
      {signupSuccess ? (
        <div>
          <h3>Signup Successful!</h3>
          <p>Please check your email and confirm your account. After confirming, sign in with your credentials.</p>
          <button onClick={toSignIn}>Go to Sign In</button>
        </div>
      ) : (
        <form onSubmit={handleCustomSignUp}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign Up as Client</button>
        </form>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  )
}

const UserRoleSetter = ({ children }) => {
  const { authStatus, user } = useAuthenticator((context) => [context.authStatus, context.user])
  const [roleSetAttempted, setRoleSetAttempted] = useState(false)

  useEffect(() => {
    const setUserRole = async () => {
      if (authStatus === "authenticated" && !roleSetAttempted) {
        try {
          console.log("User authenticated, checking role status")
          const userAttributes = await fetchUserAttributes()
          console.log("Current user attributes:", userAttributes)
          if (!userAttributes["custom:Role2"]) {
            console.log("No role found - setting custom:Role2 to Client")
            await updateUserAttributes({ userAttributes: { "custom:Role2": "Client" } })
            console.log("Role successfully set to Client")
          } else {
            console.log("User already has a role:", userAttributes["custom:Role2"])
          }
          setRoleSetAttempted(true)
        } catch (error) {
          console.error("Error in role setting process:", error)
          setRoleSetAttempted(true)
        }
      }
    }
    setUserRole()
  }, [authStatus, roleSetAttempted])

  return <>{children}</>
}

const ProtectedRoute = ({ children }) => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus])
  const location = useLocation()
  const userPoolType = localStorage.getItem("userPoolType")

  // Check if we have secondary tokens for artisan authentication
  const hasSecondaryTokens =
    userPoolType === "secondary" &&
    localStorage.getItem("secondaryIdToken") &&
    localStorage.getItem("secondaryAccessToken")

  if (authStatus !== "authenticated" && !hasSecondaryTokens) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

const LoginRoute = () => {
  const { authStatus } = useAuthenticator((context) => [context.authStatus])
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (authStatus === "authenticated") {
      const userPoolType = localStorage.getItem("userPoolType")
      console.log("LoginRoute: User already authenticated. Pool type from localStorage:", userPoolType)
      const redirectTo = userPoolType === "secondary" ? "/artisan-console" : "/portal/profile"
      const from = location.state?.from?.pathname || redirectTo
      console.log(`LoginRoute: Redirecting authenticated user to: ${from}`)
      navigate(from, { replace: true })
    } else {
      console.log("LoginRoute: User not authenticated. Initiating primary login flow...")
      loginWithPrimary().catch((error) => {
        console.error("LoginRoute: Error initiating hosted UI login:", error)
      })
    }
  }, [authStatus, navigate, location.state])

  return (
    <div className="login-container" style={{ textAlign: "center", padding: "50px" }}>
      <h2>Redirecting to Sign In...</h2>
      <p>Please wait while we securely redirect you to the login page.</p>
    </div>
  )
}

const AppRoutes = () => {
  const {
    authStatus,
    user,
    signOut: amplifyUiSignOut,
  } = useAuthenticator((context) => [context.authStatus, context.user, context.signOut])

  const navigate = useNavigate()
  const [userPoolType, setUserPoolType] = useState(() => localStorage.getItem("userPoolType"))

  useEffect(() => {
    const handleStorageChange = () => {
      const currentPoolType = localStorage.getItem("userPoolType")
      console.log("AppRoutes Storage Listener: Detected pool type:", currentPoolType)
      setUserPoolType(currentPoolType)
    }
    handleStorageChange()
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleSignOut = async () => {
    try {
      console.log("Sign out initiated")

      // Clear secondary tokens if they exist
      localStorage.removeItem("secondaryIdToken")
      localStorage.removeItem("secondaryAccessToken")
      localStorage.removeItem("secondaryRefreshToken")

      // Sign out from Amplify if using primary authentication
      if (userPoolType !== "secondary") {
        await amplifyUiSignOut()
      }

      // Clear user pool type
      localStorage.removeItem("userPoolType")
      setUserPoolType(null)

      console.log("Sign out completed and tokens cleared")
      navigate("/")
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  const isAuthenticated =
    authStatus === "authenticated" ||
    (userPoolType === "secondary" &&
      localStorage.getItem("secondaryIdToken") &&
      localStorage.getItem("secondaryAccessToken"))

  return (
    <div className="app-wrapper">
      <div className="app-content">
        <Header authenticated={isAuthenticated} onSignOut={handleSignOut} userPoolType={userPoolType} />
        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/artisan" element={<Artisan />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/artisan-callback" element={<ArtisanAuthCallback />} />
            <Route path="/artisan-login" element={<SecondaryLoginPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />

            {/* --- Protected Routes --- */}
            <Route
              path="/artisan-console"
              element={
                <ProtectedRoute>
                  {userPoolType === "secondary" ? (
                    <ArtisanConsole user={user} signOut={handleSignOut} />
                  ) : (
                    <Navigate to="/portal/profile" replace />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/portal/*"
              element={
                <ProtectedRoute>
                  {userPoolType === "primary" || userPoolType === null ? (
                    <CustomerPortalRoutes signOut={handleSignOut} user={user} />
                  ) : (
                    <Navigate to="/artisan-console" replace />
                  )}
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  {isAuthenticated ? (
                    <Elements stripe={stripePromise}>
                      <PaymentPage />
                    </Elements>
                  ) : (
                    <Navigate to="/login" replace />
                  )}
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <UserProvider>
        <ThemeProvider>
          <CountryProvider>
            <Authenticator.Provider>
              <UserRoleSetter>
                <AppRoutes />
              </UserRoleSetter>
            </Authenticator.Provider>
          </CountryProvider>
        </ThemeProvider>
      </UserProvider>
    </Router>
  )
}
export default App