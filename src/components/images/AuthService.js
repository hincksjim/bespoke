import { Amplify } from 'aws-amplify';
import { 
  fetchAuthSession, 
  getCurrentUser,
  signIn
} from '@aws-amplify/auth';
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import awsExports from '../aws-exports';

Amplify.configure(awsExports);

const amplifyRegion = awsExports.aws_project_region;
const identityPoolId = awsExports.aws_cognito_identity_pool_id;
const userPoolId = awsExports.aws_user_pools_id;

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

export const checkAuthState = async () => {
  try {
    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};

export const handleSignIn = async (username, password) => {
  try {
    await signIn({ username, password });
    return true;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};