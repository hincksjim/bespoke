import { Amplify } from 'aws-amplify';
import { 
  fetchAuthSession, 
  getCurrentUser,
  signIn
} from '@aws-amplify/auth';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import awsExports from '../aws-exports';

// This file defines the AuthService module, which provides authentication-related functions using AWS Amplify.
// It includes methods for fetching authenticated credentials, checking authentication state, and handling user sign-in.

// This service provides authentication-related functions using AWS Amplify.
// It includes methods for fetching authenticated credentials, checking authentication state, and handling user sign-in.

Amplify.configure(awsExports);

const amplifyRegion = awsExports.aws_project_region;
const identityPoolId = awsExports.aws_cognito_identity_pool_id;
const userPoolId = awsExports.aws_user_pools_id;

/**
 * getAuthenticatedCredentials Function
 * This function retrieves the authenticated credentials for the current user.
 * It uses the Cognito Identity Pool to fetch AWS credentials and tests them using the STS client.
 */

/**
 * Gets the authenticated credentials for the current user.
 * @returns {Promise<Function>} A promise that resolves to the credentials provider function.
 */
export const getAuthenticatedCredentials = async () => {
  try {
    console.log('Attempting to get authenticated credentials...');
    const user = await getCurrentUser();
    console.log('Current user:', user.username);

    const session = await fetchAuthSession();
    const jwtToken = session.tokens.idToken.toString();

    const credentialsProvider = fromCognitoIdentityPool({
      clientConfig: { region: amplifyRegion },
      identityPoolId,
      logins: {
        [`cognito-idp.${amplifyRegion}.amazonaws.com/${userPoolId}`]: jwtToken,
      },
    });

    const credentials = await credentialsProvider();
    console.log('Credentials:', {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: '******',
      sessionToken: credentials.sessionToken ? 'Present' : 'Not Present',
      expiration: credentials.expiration,
      identityId: credentials.identityId,
    });

    // Test the credentials
    const sts = new STSClient({ credentials, region: amplifyRegion });
    const { Arn } = await sts.send(new GetCallerIdentityCommand({}));
    console.log('Assumed Role ARN:', Arn);

    return credentialsProvider;
  } catch (error) {
    console.error('Error getting authenticated credentials:', error);
    throw error;
  }
};

/**
 * checkAuthState Function
 * This function checks the authentication state of the user.
 * It returns true if the user is authenticated, and false otherwise.
 */

/**
 * Checks the authentication state of the user.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
 */
export const checkAuthState = async () => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};

/**
 * handleSignIn Function
 * This function handles user sign-in with the given username and password.
 * It returns true if the sign-in is successful, and throws an error otherwise.
 */

/**
 * Handles user sign-in with the given username and password.
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<boolean>} A promise that resolves to true if the sign-in is successful, false otherwise.
 */
export const handleSignIn = async (username, password) => {
  try {
    await signIn({ username, password });
    return true;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};