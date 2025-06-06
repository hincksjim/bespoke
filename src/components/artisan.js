import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { getCurrentUser, signUp } from 'aws-amplify/auth';
import awsconfig from '../aws-exports';

import './Artisan.css';

// This file defines the Artisan component, which serves as the registration and management interface for artisan users.
// It includes functionalities for signing up artisans in a secondary Cognito user pool, checking authentication status, and navigating to relevant pages.

// Function to sign up a user in the secondary Cognito pool
const signUpInSecondaryPool = async (email, password) => {
  try {
    // Instead of reconfiguring Amplify, we'll use the direct auth API
    // and provide the required parameters for the secondary pool
    
    // Generate a random password if not provided
    const generatedPassword = password || Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + '1!';
    
    // Calculate the SECRET_HASH using CryptoJS if you have it imported
    // Note: You'll need to add this import: import CryptoJS from 'crypto-js';
    // For now, we'll comment this part out and use the withCredentials option instead
    
    // Import the signUp function directly from Auth module - alternative approach
    // This should work without having to reconfigure Amplify
    const authConfig = {
      region: awsconfig.aws_cognito_region,
      userPoolId: awsconfig.secondaryUserPool.userPoolId,
      userPoolWebClientId: awsconfig.secondaryUserPool.userPoolWebClientId,
      authFlowType: 'USER_PASSWORD_AUTH'
    };

    // Directly using the signUp function with the client secret
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username: email,
      password: generatedPassword,
      options: {
        userAttributes: {
          email,
          'custom:Role2': 'Artisan', // Set role to Artisan
          'custom:userPoolType': 'secondary', // Add marker for user pool type
          'custom:isArtisan': 'true' // Additional flag for artisan status
        },
        // Use the clientMetadata approach to handle the client app with secret
        clientMetadata: {
          client_id: awsconfig.secondaryUserPool.userPoolWebClientId
        }
      }
    });

    console.log("Signup response:", { isSignUpComplete, userId, nextStep });

    return { 
      user: { id: userId },
      password: generatedPassword, 
      isSignUpComplete,
      nextStep
    };
  } catch (error) {
    console.error('Error signing up in secondary pool:', error);
    throw error;
  }
};

// Artisan Component
// This component renders the artisan registration page, including a hero section, an introduction to the artisan network, and a list of benefits.
// It also provides a call-to-action button for artisans to register and handles the sign-up process with appropriate navigation and error handling.
const Artisan = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      setIsAuthenticated(true);
      setCurrentUser(user);
      console.log("User is authenticated:", user);
    } catch (error) {
      console.log("User is not authenticated:", error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const handleArtisanSignUp = async () => {
    setIsSubmitting(true);

    try {
      // Instead of trying to create the user directly, direct them to the registration page
      // which can present the Cognito UI for signup
      if (isAuthenticated) {
        // User is already authenticated, navigate to the artisan registration
        navigate('/artisan-register');
        return;
      }

      // For users who aren't authenticated, we should redirect to a special login page
      // that specifically uses the secondary pool
      navigate('/artisan-login', { 
        state: { 
          userPool: 'secondary',
          returnTo: '/artisan-register',
          isArtisanSignup: true
        } 
      });
      return;

      // We'll keep this code commented out for reference, but we won't use it
      // because of the SECRET_HASH issue
      /*
      // If not authenticated, show email prompt
      const email = prompt("Please enter your email address to sign up as an artisan:");

      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        alert("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }

      // Sign up in secondary pool with just the email
      const { user, password, isSignUpComplete } = await signUpInSecondaryPool(email);
      */

      // Navigate to verification page with the generated credentials
      navigate('/verification-required', {
        state: {
          email: email,
          password: password, // Pass the generated password so user can log in after verification
          message: 'Please check your email to verify your account. Once verified, you can complete your artisan profile.'
        }
      });
    } catch (error) {
      console.error('Error signing up as artisan:', error);
      if (error.code === 'UsernameExistsException') {
        alert('An account with this email already exists. Please login instead.');
        navigate('/login');
      } else {
        alert(`Error creating account: ${error.message || 'Please try again later.'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArtisanLogin = () => {
    navigate('/artisan-login', {
      state: {
        userPool: 'secondary',
        returnTo: '/artisan-dashboard'
      }
    });
  };

  return (
    <div>
      <main>
        <section className="hero">
          <h1>Artisan Registration</h1>
        </section>

        <section className="content container">
          <div className="registration-intro">
            <h2>Join Our Artisan Network</h2>
            <p>
              Thank you for your interest in joining Elegance Jewellery as an artisan partner.
              Click the button below to register your services and start receiving design requests
              from our clients around the world.
            </p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item">
              <h3>Global Client Base</h3>
              <p>Connect with high-value clients seeking bespoke jewelry pieces from around the world.</p>
            </div>
            <div className="benefit-item">
              <h3>Showcase Your Work</h3>
              <p>Display your craftsmanship to a global audience through our premium platform.</p>
            </div>
            <div className="benefit-item">
              <h3>Flexible Pricing</h3>
              <p>Set your own pricing and availability to match your business needs.</p>
            </div>
            <div className="benefit-item">
              <h3>Secure Payments</h3>
              <p>Receive secure payments through our trusted and reliable payment platform.</p>
            </div>
            <div className="benefit-item">
              <h3>Marketing Support</h3>
              <p>Gain exposure through our marketing channels and promotional activities.</p>
            </div>
            <div className="benefit-item">
              <h3>Professional Network</h3>
              <p>Join a community of skilled artisans and share knowledge and experiences.</p>
            </div>
          </div>

          <div className="registration-footer">
            <div className="join-cta">
              <h3>Ready to Start Your Journey?</h3>
              <p>Join hundreds of artisans who have already transformed their craft into a thriving business.</p>
            </div>

            <div className="form-actions">
              <button
                className="register-button"
                onClick={handleArtisanSignUp}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Register as an Artisan'}
              </button>

              <button
                className="login-button"
                onClick={handleArtisanLogin}
              >
                Artisan Login
              </button>
            </div>

            <p className="terms-note">
              By registering, you agree to our <a href="/terms">Terms and Conditions</a> and <a href="/privacy">Privacy Policy</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Artisan;
