// auth.js - Enhanced with AWS credentials support
import { signInWithRedirect, fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from "aws-amplify/auth"
import { Amplify } from "aws-amplify"
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import awsExports from "./aws-exports"

// Initialize Amplify with your aws-exports configuration
Amplify.configure(awsExports)

// Primary auth uses the hosted UI flow
export const loginWithPrimary = async () => {
  try {
    console.log("Initiating sign in with hosted UI (Primary Pool)")
    // Use the hosted UI flow by specifying the provider as COGNITO
    await signInWithRedirect({
      provider: "COGNITO", // Ensure this uses the default configured OAuth settings (primary pool)
      options: {
        // Explicitly set the redirect URL to match what's in aws-exports
        redirectSignIn: awsExports.oauth.redirectSignIn,
      },
    })

    // The code below this point won't execute immediately because of the redirect.
  } catch (error) {
    console.error("Error initiating sign in with primary pool hosted UI:", error)
    throw error // Re-throw the error for the caller (e.g., LoginRoute) to potentially handle
  }
}

// Direct login with primary (keep as fallback if needed, but ensure pool type is set on success)
export const directLoginWithPrimary = async (email, password) => {
  // NOTE: ...
}

export const loginWithSecondary = async () => {
  const originalConfig = Amplify.getConfig()

  try {
    const secondaryAuthConfig = {
      Auth: {
        ...originalConfig.Auth,
        userPoolId: awsExports.secondaryUserPool.userPoolId,
        userPoolWebClientId: awsExports.secondaryUserPool.userPoolWebClientId,
        region: awsExports.secondaryUserPool.region,
        oauth: awsExports.secondaryUserPool.oauth,
      },
    }
    console.log("Temporarily configuring Amplify for Secondary Auth:", secondaryAuthConfig)

    Amplify.configure({ ...originalConfig, ...secondaryAuthConfig })

    console.log("Initiating sign in with hosted UI (Secondary Pool)")

    const domain = awsExports.secondaryUserPool.oauth.domain
    console.log("Using domain for secondary auth:", domain)

    await signInWithRedirect({
      provider: "COGNITO",
      options: {
        redirectSignIn: awsExports.secondaryUserPool.oauth.redirectSignIn,
      },
    })
  } catch (error) {
    console.error("Error signing in with secondary pool:", error)
    localStorage.removeItem("userPoolType")
    throw error
  } finally {
    console.log("Restoring original Amplify configuration.")
    Amplify.configure(originalConfig)
  }
}

export const directLoginWithSecondary = async (email, password) => {
  const originalConfig = Amplify.getConfig()
  let secondarySignInOutput

  try {
    const secondaryAuthConfig = {
      Auth: {
        ...originalConfig.Auth,
        userPoolId: awsExports.secondaryUserPool.userPoolId,
        userPoolWebClientId: awsExports.secondaryUserPool.userPoolWebClientId,
        region: awsExports.secondaryUserPool.region,
      },
    }
    console.log("Temporarily configuring Amplify for Secondary Auth:", secondaryAuthConfig)

    Amplify.configure({ ...originalConfig, ...secondaryAuthConfig })

    console.log("Attempting direct sign in with secondary pool")
    secondarySignInOutput = await signInWithRedirect({
      username: email,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    })
    console.log("Secondary sign in successful:", secondarySignInOutput)

    if (secondarySignInOutput.isSignedIn) {
      localStorage.setItem("userPoolType", "secondary")
      console.log("Set userPoolType to 'secondary' after secondary login.")
    }
  } catch (error) {
    console.error("Error signing in with secondary pool:", error)
    localStorage.removeItem("userPoolType")
    throw error
  } finally {
    console.log("Restoring original Amplify configuration.")
    Amplify.configure(originalConfig)
  }

  return secondarySignInOutput
}

export const checkAuthState = async () => {
  try {
    await getCurrentUser()
    return true
  } catch {
    return false
  }
}

export const signOut = async () => {
  try {
    await amplifySignOut({ global: true })
    localStorage.removeItem("userPoolType")
    console.log("Sign out successful, userPoolType removed.")
    return true
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const getAuthenticatedUser = async () => {
  try {
    const currentUser = await getCurrentUser()
    return currentUser
  } catch (error) {
    return null
  }
}

export const getAuthTokens = async () => {
  try {
    const session = await fetchAuthSession({ forceRefresh: false })
    if (!session || !session.tokens) {
      console.log("No valid session or tokens found.")
      return null
    }
    return {
      accessToken: session.tokens.accessToken,
      idToken: session.tokens.idToken,
      refreshToken: session.tokens.refreshToken,
    }
  } catch (error) {
    console.error("Error getting auth tokens:", error)
    return null
  }
}

export const getAwsCredentials = async () => {
  const userPoolType = localStorage.getItem("userPoolType")
  console.log(`getAwsCredentials called for userPoolType: ${userPoolType}`)

  try {
    const { tokens } = await fetchAuthSession({ forceRefresh: true })

    if (!tokens || !tokens.idToken) {
      console.error("No valid tokens found in session")
      throw new Error("No valid tokens found")
    }

    // Determine which login key to use based on the user pool type
    const loginKey =
      userPoolType === "secondary"
        ? `cognito-idp.${awsExports.secondaryUserPool.region}.amazonaws.com/${awsExports.secondaryUserPool.userPoolId}`
        : `cognito-idp.${awsExports.aws_cognito_region}.amazonaws.com/${awsExports.aws_user_pools_id}`

    console.log("Using login key:", loginKey)

    const credentialsProvider = fromCognitoIdentityPool({
      identityPoolId: awsExports.aws_cognito_identity_pool_id,
      region: awsExports.aws_cognito_region,
      logins: {
        [loginKey]: tokens.idToken.toString(),
      },
    })

    // Get credentials
    const credentials = await credentialsProvider()
    console.log("Successfully retrieved AWS credentials from Identity Pool.")

    return {
      credentials,
      identityId: credentials.identityId,
    }
  } catch (error) {
    console.error("Error getting AWS credentials:", error)
    throw error
  }
}

export default {
  loginWithPrimary,
  directLoginWithPrimary, // Be cautious using this if Hosted UI is primary method
  loginWithSecondary,
  directLoginWithSecondary,
  checkAuthState,
  signOut,
  getAuthenticatedUser,
  getAuthTokens,
  getAwsCredentials,
}
