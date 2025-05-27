// This module provides secondary authentication functions using AWS Amplify.
// It includes functions to manage user sessions, sign in, and retrieve authenticated user details.

import { useState, useEffect } from 'react';
import { fetchAuthSession, signIn, signOut, getCurrentUser } from 'aws-amplify/auth';
import { Amplify } from 'aws-amplify';

// Function to get the current authentication session
export const getCurrentSession = async () => {
  try {
    const session = await fetchAuthSession();
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

// Function to get the current authenticated user
export const getCurrentAuthUser = async () => {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Function to sign in a user with email and password
export const signInUser = async (username, password) => {
  try {
    const { isSignedIn, nextStep } = await signIn({
      username,
      password,
    });
    
    return { isSignedIn, nextStep };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

// Function to sign out the current user
export const signOutUser = async () => {
  try {
    await signOut();
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
};

// Configure authentication for the secondary user pool
export const configureSecondaryAuth = (config) => {
  try {
    Amplify.configure(config);
    console.log('Secondary authentication configured');
    return true;
  } catch (error) {
    console.error('Error configuring secondary auth:', error);
    return false;
  }
};

// Custom hook for managing authentication state
export const useSecondaryAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (username, password) => {
    try {
      const result = await signInUser(username, password);
      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
        return { success: true, user: currentUser };
      }
      return { success: false, nextStep: result.nextStep };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  // Function to get the current user's JWT tokens
  const getTokens = async () => {
    try {
      const session = await fetchAuthSession();
      
      // Check if we have valid tokens
      if (session && session.tokens) {
        return {
          idToken: session.tokens.idToken.toString(),
          accessToken: session.tokens.accessToken.toString(),
          refreshToken: session.tokens.refreshToken?.toString(),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  };

  // Function to get user attributes
  const getUserAttributes = async () => {
    try {
      const currentUser = await getCurrentUser();
      
      if (currentUser && currentUser.attributes) {
        return currentUser.attributes;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user attributes:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getTokens,
    getUserAttributes,
  };
};

// Function to handle redirect from Cognito for secondary user pool
export const handleRedirectSecondary = async () => {
  try {
    // Parse the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (!code) {
      console.error('No authorization code found in URL');
      return { success: false, error: 'No authorization code found' };
    }
    
    // Exchange code for tokens - implementation depends on your Cognito setup
    // This is a simplified placeholder - you'll need to implement the actual token exchange
    console.log('Authorization code received:', code);
    
    // Once tokens are received, store them and return success
    // For now, we'll just simulate a successful authentication
    return { success: true, code };
  } catch (error) {
    console.error('Error handling redirect:', error);
    return { success: false, error };
  }
};

// Function to sign up a user with the secondary user pool
export const signUpWithSecondary = async (username, password, email, attributes = {}) => {
  try {
    // Implementation depends on your specific Cognito setup
    // This is a placeholder for the actual implementation
    console.log('Signing up with secondary pool:', { username, email });
    
    // You would make the appropriate API call to your secondary Cognito pool here
    // For demonstration purposes, we'll return a simulated response
    return { 
      success: true, 
      username,
      userSub: 'simulated-user-sub',
      userConfirmed: false
    };
  } catch (error) {
    console.error('Error signing up with secondary pool:', error);
    throw error;
  }
};

// Function to login with the secondary user pool
export const loginWithSecondary = async (username, password) => {
  try {
    // This would typically involve configuring Amplify with the secondary pool
    // then performing the signIn operation
    
    // First, make sure the secondary pool is configured
    // Note: You would need to implement the actual configuration logic
    console.log('Login with secondary pool requested for:', username);
    
    // Then attempt to sign in
    const signInResult = await signIn({
      username,
      password
    });
    
    return signInResult;
  } catch (error) {
    console.error('Error logging in with secondary pool:', error);
    throw error;
  }
};

export default useSecondaryAuth;