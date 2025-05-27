import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
// *** CHANGE START ***
// Import signIn instead of signInWithRedirect
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';
// *** CHANGE END ***
import awsconfig from '../aws-exports'; // Assuming aws-exports is in the parent directory

// This component handles the secondary login and signup verification process.
// It includes steps for signing up, confirming sign-up, and signing in using AWS Cognito.

// Import necessary libraries and modules
// React: For building the component and managing state
// react-router-dom: For navigation and accessing route information
// aws-amplify: For AWS Cognito authentication
// aws-exports: Configuration file for AWS Amplify

// Amplify configuration is temporarily overridden to use a secondary user pool for authentication.
// This ensures that actions like sign-up, confirmation, and sign-in are performed in the correct context.

// The component dynamically renders forms for different views: 'signUp', 'confirmSignUp', and 'signIn'.
// Each view corresponds to a specific step in the authentication process.

// Debugging information is displayed to assist with troubleshooting authentication issues.
// This includes details about errors and responses from AWS Cognito.

// Custom login component with verification steps
const SecondaryLoginVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // *** CHANGE START ***
  // Default returnTo should likely be the artisan console after successful secondary login/signup
  const returnTo = location.state?.returnTo || '/artisan-console';
  // *** CHANGE END ***
  const isArtisanSignup = location.state?.isArtisanSignup || false;

  // Form state
  const [view, setView] = useState(isArtisanSignup ? 'signUp' : 'signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  // DOM refs
  const emailInputRef = useRef(null);

  // Configure Amplify with the secondary pool temporarily for actions in this component
  useEffect(() => {
    let originalConfig = null;
    try {
      // Store the original config to restore later
      originalConfig = Amplify.getConfig();
      console.log('SecondaryLoginVerification: Storing original Amplify config.');

      // Configure Amplify with the secondary pool specifics for Auth
      const secondaryAuthConfig = {
        Auth: {
            // Use defaults from primary config and override only secondary pool specifics
            ...originalConfig.Auth, // Inherit region, etc., if not specified below
            userPoolId: awsconfig.secondaryUserPool.userPoolId,
            userPoolWebClientId: awsconfig.secondaryUserPool.userPoolWebClientId,
            region: awsconfig.secondaryUserPool.region, // Explicitly set secondary region
            // authenticationFlowType: 'USER_PASSWORD_AUTH' // Optional: Specify if needed
        }
      };

      // Temporarily configure Amplify, merging secondary Auth settings
      console.log('SecondaryLoginVerification: Temporarily configuring Amplify for Secondary Auth.');
      Amplify.configure({ ...originalConfig, ...secondaryAuthConfig }); // Merge, overwriting Auth

      // Focus on email input when component mounts
      if (emailInputRef.current) {
        emailInputRef.current.focus();
      }

    } catch (configError) {
      console.error("SecondaryLoginVerification: Error configuring Amplify:", configError);
      setError("Configuration error: " + configError.message);
    }

     // Restore original configuration when component unmounts
     return () => {
        if (originalConfig) {
          try {
            console.log("SecondaryLoginVerification: Restoring original Amplify config on unmount.");
            Amplify.configure(originalConfig);
          } catch (restoreError) {
            console.error("SecondaryLoginVerification: Error restoring Amplify config:", restoreError);
          }
        }
     };
  }, []); // Run only on mount and unmount


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDebugInfo({});

    // Ensure Amplify is configured with secondary pool settings before auth action
    // (This repeats the config logic slightly, ensure it's robust or refactor if needed)
    const originalConfig = Amplify.getConfig(); // Get potentially already-switched config
    const secondaryAuthConfig = { Auth: { /* ... secondary pool details ... */
        userPoolId: awsconfig.secondaryUserPool.userPoolId,
        userPoolWebClientId: awsconfig.secondaryUserPool.userPoolWebClientId,
        region: awsconfig.secondaryUserPool.region,
    }};
    Amplify.configure({ ...originalConfig, ...secondaryAuthConfig }); // Ensure secondary is active

    try {
      if (view === 'signUp') {
        const signUpData = {
          username: email,
          password,
          options: { userAttributes: { email, given_name: givenName, family_name: familyName, 'custom:Role2': 'Artisan' }}
        };
        console.log('Attempting sign up with secondary pool:', signUpData);
        const result = await signUp(signUpData);
        console.log('Sign up result:', result);
        setDebugInfo(result);
        setView('confirmSignUp');
      }
      else if (view === 'confirmSignUp') {
        console.log('Attempting confirm sign up with secondary pool for user:', email);
        const confirmResult = await confirmSignUp({ username: email, confirmationCode });
        console.log('Confirmation result:', confirmResult);
        setDebugInfo(confirmResult);
        // After successful confirmation, sign in the user automatically
        if (confirmResult.isSignUpComplete) {
           console.log('Sign up confirmed, attempting auto sign in...');
           await handleSignIn(); // Call the signIn handler below
        } else {
           // Handle cases where confirmation might need more steps (rare)
           setError("Confirmation completed but requires further steps. Please try signing in manually.");
           setView('signIn');
        }
      }
      else if (view === 'signIn') {
        await handleSignIn(); // Call the signIn handler below
      }
    } catch (err) {
      console.error('Auth error in SecondaryLoginVerification:', err);
      setError(err.message || 'An error occurred during authentication');
      setDebugInfo({ error: err.toString(), name: err.name, message: err.message });
    } finally {
      setLoading(false);
       // Restore original config after the action if needed, although unmount cleanup should handle it
       // Amplify.configure(originalConfig); // Be careful with multiple restores
    }
  };

  // Handle sign in using direct 'signIn' method
  const handleSignIn = async () => {
    setLoading(true); // Ensure loading state is set
    setError('');
    setDebugInfo({});

    // Ensure Amplify is configured with secondary pool settings
    const originalConfig = Amplify.getConfig();
    const secondaryAuthConfig = { Auth: { /* ... secondary pool details ... */
        userPoolId: awsconfig.secondaryUserPool.userPoolId,
        userPoolWebClientId: awsconfig.secondaryUserPool.userPoolWebClientId,
        region: awsconfig.secondaryUserPool.region,
    }};
    Amplify.configure({ ...originalConfig, ...secondaryAuthConfig });

    try {
      console.log('Attempting direct sign in with secondary pool for user:', email);

      // *** CHANGE START ***
      // Use signIn for direct username/password authentication
      const { isSignedIn, nextStep } = await signIn({
          username: email,
          password
          // options: { authFlowType: 'USER_PASSWORD_AUTH' } // Often not needed if it's the default for signIn
      });
      // *** CHANGE END ***

      console.log('Direct sign in result:', { isSignedIn, nextStep });
      setDebugInfo({ isSignedIn, nextStep });

      if (isSignedIn) {
        console.log('Secondary sign in successful!');
        // Store user pool type
        localStorage.setItem('userPoolType', 'secondary');
        console.log("Set userPoolType to 'secondary' in localStorage.");

        // *** CHANGE START ***
        // Programmatically navigate to the target route after successful sign in
        console.log(`Navigating to: ${returnTo}`);
        navigate(returnTo, { replace: true }); // Use replace to avoid login page in history
        // *** CHANGE END ***

      } else if (nextStep) {
        // Handle other steps like MFA if configured
        setError(`Sign in requires additional step: ${nextStep.signInStep}`);
        console.log('Sign in requires additional step:', nextStep);
        // You would need to implement UI for handling MFA codes, etc.
      } else {
        // Should not happen if not signed in and no next step, but handle defensively
         setError('Sign in failed for an unknown reason.');
      }

    } catch (err) {
      console.error('Direct sign in error:', err);
      setError(err.message || 'Failed to sign in');
      setDebugInfo({ error: err.toString(), name: err.name, message: err.message });
      localStorage.removeItem('userPoolType'); // Clear pool type on error
    } finally {
      setLoading(false);
      // Restore original config if needed here too, balancing with useEffect cleanup
      // Amplify.configure(originalConfig);
    }
  };

  // Input change handlers (no changes needed)
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleGivenNameChange = (e) => setGivenName(e.target.value);
  const handleFamilyNameChange = (e) => setFamilyName(e.target.value);
  const handleConfirmationCodeChange = (e) => setConfirmationCode(e.target.value);

  // Render appropriate form based on view (no changes needed in structure)
  const renderForm = () => {
    switch (view) {
      case 'signUp':
        return (
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Artisan Registration</h2>
            {/* ... form inputs ... */}
             <div className="form-group"> <label htmlFor="email">Email *</label> <input id="email" ref={emailInputRef} type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" required autoComplete="email" autoFocus /> </div>
             <div className="form-group"> <label htmlFor="given-name">First Name *</label> <input id="given-name" type="text" value={givenName} onChange={handleGivenNameChange} placeholder="Enter your first name" required /> </div>
             <div className="form-group"> <label htmlFor="family-name">Last Name *</label> <input id="family-name" type="text" value={familyName} onChange={handleFamilyNameChange} placeholder="Enter your last name" required /> </div>
             <div className="form-group"> <label htmlFor="password">Password *</label> <input id="password" type="password" value={password} onChange={handlePasswordChange} placeholder="Create a password" required autoComplete="new-password" minLength="8" /> <small>Password must be at least 8 characters</small> </div>
            <button type="submit" disabled={loading} className="submit-button"> {loading ? 'Creating Account...' : 'Create Account'} </button>
            <p className="auth-switch"> Already have an account?{' '} <button type="button" onClick={() => setView('signIn')} className="link-button"> Sign In </button> </p>
          </form>
        );

      case 'confirmSignUp':
        return (
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Verify Your Email</h2>
            <p>We've sent a verification code to {email}</p>
            {/* ... form inputs ... */}
            <div className="form-group"> <label htmlFor="confirmation-code">Verification Code *</label> <input id="confirmation-code" type="text" value={confirmationCode} onChange={handleConfirmationCodeChange} placeholder="Enter verification code" required autoFocus /> </div>
            <button type="submit" disabled={loading} className="submit-button"> {loading ? 'Verifying...' : 'Verify Email'} </button>
            <p className="auth-switch"> Didn't receive a code?{' '} <button type="button" onClick={() => { setError(''); setView('signUp'); }} className="link-button"> Go Back </button> </p>
          </form>
        );

      case 'signIn':
      default:
        return (
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>Artisan Login</h2>
            {/* ... form inputs ... */}
            <div className="form-group"> <label htmlFor="email">Email *</label> <input id="email" ref={emailInputRef} type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" required autoComplete="email" autoFocus /> </div>
            <div className="form-group"> <label htmlFor="password">Password *</label> <input id="password" type="password" value={password} onChange={handlePasswordChange} placeholder="Enter your password" required autoComplete="current-password" /> </div>
            <button type="submit" disabled={loading} className="submit-button"> {loading ? 'Signing In...' : 'Sign In'} </button>
            <p className="auth-switch"> Don't have an account?{' '} <button type="button" onClick={() => setView('signUp')} className="link-button"> Create Account </button> </p>
          </form>
        );
    }
  };

  return (
    <div className="secondary-login-container">
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {renderForm()}

      {/* Debug information section */}
      {Object.keys(debugInfo).length > 0 && (
        <div className="debug-info" style={{marginTop: '20px', background: '#f0f0f0', padding: '10px', fontSize: '0.8em'}}>
          <h4>Debug Info:</h4>
          <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SecondaryLoginVerification;